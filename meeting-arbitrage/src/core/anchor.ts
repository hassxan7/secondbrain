/**
 * Choosing and defending the STANDING weekly time.
 *
 * A one-off "when can everyone do Thursday" poll and a "what should our fixed
 * weekly slot be" decision are different questions, and conflating them is why
 * recurring meetings rot. This module answers the second one, and polices the
 * requests to move it.
 *
 * Both functions read the same poll the group already filled in: dated slots
 * spanning a fortnight are folded onto their weekday-and-time pattern, so one
 * round of tapping answers "when this week" and "when every week" at once.
 */

import type {
  ArbitrageConfig, AvailabilityValue, Participant, ResponseMap, Slot, WeeklyPattern,
} from './types.ts';
import { DEFAULT_CONFIG } from './types.ts';
import { localParts } from './slots.ts';

const WEEKDAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

export type { WeeklyPattern };

export interface AnchorCandidate {
  pattern: WeeklyPattern;
  key: string;
  label: string;
  score: number;
  /**
   * Expected heads in a typical week — fractional on purpose. Someone who can
   * do two Mondays in three counts as 0.67, because that is what will happen.
   */
  expectedHeads: number;
  /** Recurring commitments this pattern runs into. These are fatal, not noise. */
  conflicts: Array<{ participantId: string; name: string; label: string }>;
  /** People who would miss this most weeks (reliability below half). */
  wouldExclude: string[];
  /** People with no answer for any instance of this pattern. */
  unknown: string[];
  viable: boolean;
  reasons: string[];
}

export interface AnchorRecommendation {
  ranked: AnchorCandidate[];
  best: AnchorCandidate | null;
  /** The pattern currently in force, if it was among the candidates. */
  incumbent: AnchorCandidate | null;
  action: 'adopt' | 'keep' | 'move' | 'none-viable';
  rationale: string;
}

export interface AnchorInput {
  slots: Slot[];
  participants: Participant[];
  responses: ResponseMap;
  /** The standing time currently in force, e.g. `{ weekday: 1, time: '19:30' }`. */
  incumbent?: WeeklyPattern;
  config?: Partial<ArbitrageConfig>;
}

export function patternKey(p: WeeklyPattern): string {
  return `${p.weekday}T${p.time}`;
}

export function patternLabel(p: WeeklyPattern): string {
  const [hh, mm] = p.time.split(':').map(Number);
  const suffix = hh < 12 ? 'am' : 'pm';
  const hour12 = hh % 12 === 0 ? 12 : hh % 12;
  const minutes = mm === 0 ? '' : `:${String(mm).padStart(2, '0')}`;
  return `${WEEKDAY_NAMES[p.weekday]} ${hour12}${minutes} ${suffix}`;
}

const NUMERIC: Record<AvailabilityValue, number> = { yes: 1, ifneed: 0.5, no: 0 };

/**
 * Recommend the standing weekly slot.
 *
 * The important behaviour: a pattern that collides with someone's recurring
 * commitment takes `standingConflictPenalty` on top of losing that person's
 * contribution. A weekly meeting scheduled over Isaac's football practice does
 * not fail once, it fails fifty-two times, and no amount of goodwill from the
 * other six fixes it. That is why this is punished rather than merely counted.
 */
export function recommendAnchor(input: AnchorInput): AnchorRecommendation {
  const cfg: ArbitrageConfig = { ...DEFAULT_CONFIG, ...input.config };
  const { participants, responses } = input;

  // Fold dated slots onto their weekly pattern.
  const groups = new Map<string, { pattern: WeeklyPattern; slots: Slot[] }>();
  for (const slot of input.slots) {
    const lp = localParts(slot.startUtc, cfg.timezone);
    const pattern: WeeklyPattern = {
      weekday: lp.weekday,
      time: `${String(lp.hour).padStart(2, '0')}:${String(lp.minute).padStart(2, '0')}`,
    };
    const key = patternKey(pattern);
    const existing = groups.get(key);
    if (existing) existing.slots.push(slot);
    else groups.set(key, { pattern, slots: [slot] });
  }

  const ranked = [...groups.values()]
    .map(({ pattern, slots }) => scorePattern(pattern, slots, participants, responses, cfg))
    .sort((a, b) => b.score - a.score || b.expectedHeads - a.expectedHeads);

  const viable = ranked.filter((c) => c.viable);
  const incumbentKey = input.incumbent ? patternKey(input.incumbent) : null;
  const incumbent = incumbentKey ? ranked.find((c) => c.key === incumbentKey) ?? null : null;

  if (viable.length === 0) {
    return {
      ranked, best: null, incumbent, action: 'none-viable',
      rationale: 'No weekly pattern clears quorum in a typical week. '
        + 'Either the quorum is too high or the group needs to offer more times.',
    };
  }

  const best = viable[0];

  if (!incumbent) {
    return {
      ranked, best, incumbent: null, action: 'adopt',
      rationale: `${best.label} is the strongest standing slot `
        + `(${best.expectedHeads.toFixed(1)} of ${participants.length} in a typical week).`,
    };
  }

  // A live standing conflict against the incumbent is decisive on its own: it
  // is precisely the failure that repeats, so stability is no longer a virtue.
  if (incumbent.conflicts.length > 0) {
    return {
      ranked, best, incumbent, action: 'move',
      rationale: `${incumbent.label} runs into `
        + `${incumbent.conflicts.map((c) => `${c.name}'s ${c.label}`).join(', ')} every week. `
        + `Move to ${best.label}.`,
    };
  }

  const margin = best.score - incumbent.score;
  if (!incumbent.viable) {
    return {
      ranked, best, incumbent, action: 'move',
      rationale: `${incumbent.label} no longer clears quorum `
        + `(${incumbent.reasons.join('; ')}). Move to ${best.label}.`,
    };
  }
  if (margin <= cfg.switchMargin) {
    return {
      ranked, best: incumbent, incumbent, action: 'keep',
      rationale: `${incumbent.label} still holds up. The best alternative `
        + `(${best.label}) is only ${margin.toFixed(2)} better, under the `
        + `${cfg.switchMargin.toFixed(2)} margin needed to justify moving a fixed time.`,
    };
  }

  return {
    ranked, best, incumbent, action: 'move',
    rationale: `${best.label} beats ${incumbent.label} by ${margin.toFixed(2)}, `
      + `clearing the ${cfg.switchMargin.toFixed(2)} margin.`,
  };
}

function scorePattern(
  pattern: WeeklyPattern, slots: Slot[], participants: Participant[],
  responses: ResponseMap, cfg: ArbitrageConfig,
): AnchorCandidate {
  const conflicts: AnchorCandidate['conflicts'] = [];
  const wouldExclude: string[] = [];
  const unknown: string[] = [];
  const reasons: string[] = [];
  let score = 0;
  let expectedHeads = 0;
  let blocked = false;

  for (const p of participants) {
    const clash = (p.standingConflicts ?? []).find(
      (c) => c.weekday === pattern.weekday && overlapsTime(pattern, c.startMin, c.endMin, slots),
    );

    if (clash) {
      conflicts.push({ participantId: p.id, name: p.name, label: clash.label });
      wouldExclude.push(p.id);
      score -= cfg.standingConflictPenalty;
      if (p.required) blocked = true;
      continue;
    }

    // Reliability = how often they can actually do this pattern, 0..1.
    const answered = slots
      .map((s) => responses[p.id]?.[s.id])
      .filter((v): v is AvailabilityValue => Boolean(v));

    if (answered.length === 0) {
      unknown.push(p.id);
      if (p.required) blocked = true;
      continue;
    }

    const reliability = answered.reduce((sum, v) => sum + NUMERIC[v], 0) / answered.length;
    expectedHeads += reliability;
    score += schedulingWeightFor(p, cfg) * reliability;
    if (reliability < 0.5) {
      wouldExclude.push(p.id);
      if (p.required) blocked = true;
    }
  }

  const viable = expectedHeads >= cfg.quorum && !blocked;
  if (expectedHeads < cfg.quorum) {
    reasons.push(`expected ${expectedHeads.toFixed(1)} heads, need ${cfg.quorum}`);
  }
  if (blocked) reasons.push('a required person cannot reliably make it');
  for (const c of conflicts) reasons.push(`${c.name}: ${c.label} (every week)`);
  if (unknown.length) reasons.push(`${unknown.length} never answered for this slot`);

  return {
    pattern,
    key: patternKey(pattern),
    label: patternLabel(pattern),
    score: Math.round(score * 1000) / 1000,
    expectedHeads: Math.round(expectedHeads * 100) / 100,
    conflicts, wouldExclude, unknown, viable, reasons,
  };
}

function overlapsTime(
  pattern: WeeklyPattern, startMin: number, endMin: number, slots: Slot[],
): boolean {
  const [hh, mm] = pattern.time.split(':').map(Number);
  const start = hh * 60 + mm;
  const duration = slots[0]?.durationMins ?? 60;
  return start < endMin && start + duration > startMin;
}

function schedulingWeightFor(p: Participant, cfg: ArbitrageConfig): number {
  const rate = Math.min(1, Math.max(0, p.attendanceRate ?? 1));
  return cfg.minWeight + (1 - cfg.minWeight) * rate;
}

/* ------------------------------------------------------------------ *
 * Re-fix requests: the mechanism that stops the fixed time drifting.
 * ------------------------------------------------------------------ */

export interface RefixRequest {
  participantId: string;
  /** Free text the requester typed, shown to the group verbatim. */
  reason: string;
  /**
   * Set when the clash is a declared recurring commitment rather than a
   * one-off. Free, permanent, and never counted against anyone — it triggers
   * a re-pick of the standing time instead of a one-week detour.
   */
  standingConflict?: boolean;
}

export interface VetoState {
  participantId: string;
  used: number;
  /** Ad-hoc moves allowed per period. Small on purpose. */
  budget: number;
  periodStart: string;
}

export interface RefixDecision {
  granted: boolean;
  consumedToken: boolean;
  tokensRemaining: number;
  outcome: 'refix-poll' | 'proceed-without' | 'repick-anchor';
  rationale: string;
}

/**
 * Decide what a "can't make it this week" message actually does.
 *
 * The asymmetry is the whole point. A recurring, declarable clash is free and
 * fixes the schedule permanently. An ad-hoc one spends from a small budget.
 * Once that budget is gone the meeting simply proceeds without you — and,
 * per the accountability rules, being absent forfeits your right to contest
 * anything decided about you while you were not there.
 */
export function evaluateRefix(
  request: RefixRequest, state: VetoState, participant?: Participant,
): RefixDecision {
  if (request.standingConflict) {
    return {
      granted: true,
      consumedToken: false,
      tokensRemaining: Math.max(0, state.budget - state.used),
      outcome: 'repick-anchor',
      rationale: 'Declared as a recurring commitment, so this re-picks the standing '
        + 'time rather than moving one meeting. Recurring clashes are free.',
    };
  }

  const remaining = Math.max(0, state.budget - state.used);

  if (remaining > 0) {
    return {
      granted: true,
      consumedToken: true,
      tokensRemaining: remaining - 1,
      outcome: 'refix-poll',
      rationale: `Re-fix poll opened. ${remaining - 1} of ${state.budget} ad-hoc `
        + `moves left this period. If this clash is actually recurring, declare it `
        + `as a standing conflict instead — those are free.`,
    };
  }

  if (participant?.required) {
    return {
      granted: true,
      consumedToken: false,
      tokensRemaining: 0,
      outcome: 'refix-poll',
      rationale: 'Ad-hoc budget is spent, but this person is marked required, '
        + 'so the meeting cannot proceed without them. Re-fix poll opened and flagged.',
    };
  }

  return {
    granted: false,
    consumedToken: false,
    tokensRemaining: 0,
    outcome: 'proceed-without',
    rationale: `No ad-hoc moves left this period (${state.budget} used). The meeting `
      + `goes ahead at the fixed time. Anything decided in your absence stands.`,
  };
}
