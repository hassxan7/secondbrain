/**
 * The arbitrage engine.
 *
 * Three questions, three functions:
 *
 *   scoreSlots()      Given this week's answers, when should we actually meet?
 *   recommendAnchor() Given a fortnight of answers, what should the STANDING
 *                     weekly time be? Slots that collide with a recurring
 *                     commitment are punished, because they fail every week.
 *   evaluateRefix()   Someone says they can't make the fixed time. Do we move
 *                     the meeting, or does it go ahead without them?
 *
 * Everything here is a pure function of its inputs. Same input, same output,
 * no clock reads, no network, no model. That matters: the output of this file
 * gets used to fine people, so it has to be arguable in a kitchen.
 */

import type {
  ArbitrageConfig, ArbitrageResult, AvailabilityValue, Participant,
  ResponseMap, Slot, SlotScore,
} from './types.ts';
import { DEFAULT_CONFIG } from './types.ts';
import { collidesWithStandingConflict, localParts } from './slots.ts';

export interface ArbitrageInput {
  slots: Slot[];
  participants: Participant[];
  responses: ResponseMap;
  config?: Partial<ArbitrageConfig>;
}

/**
 * How much this person's preference moves the schedule.
 *
 * Deliberately *decreasing* in absenteeism. The intuition people reach for is
 * the opposite — weight the no-shows more, so the time suits them and maybe
 * they turn up. That rewards the behaviour and lets one person drag a
 * seven-person meeting around indefinitely. Here, showing up is what buys you
 * influence over the time. The floor keeps a chronic absentee from being
 * erased entirely, and a genuine recurring clash is handled by
 * StandingConflict, which is free and never counted against anyone.
 */
export function schedulingWeight(p: Participant, cfg: ArbitrageConfig): number {
  const rate = p.attendanceRate ?? 1;
  const clamped = Math.min(1, Math.max(0, rate));
  return cfg.minWeight + (1 - cfg.minWeight) * clamped;
}

function resolveConfig(partial?: Partial<ArbitrageConfig>): ArbitrageConfig {
  return { ...DEFAULT_CONFIG, ...partial };
}

interface Resolved {
  value: AvailabilityValue | 'unknown';
  conflict?: string;
}

/**
 * What this person effectively said about this slot.
 *
 * An explicit answer always wins over an inferred one — people do skip
 * football — but the clash is still reported so the UI can show *why* a slot
 * is awkward even when someone gamely said yes.
 */
function resolveAvailability(
  p: Participant, slot: Slot, responses: ResponseMap, tz: string,
): Resolved {
  const explicit = responses[p.id]?.[slot.id];
  const clash = (p.standingConflicts ?? [])
    .find((c) => collidesWithStandingConflict(slot, c, tz));

  if (explicit) return { value: explicit, conflict: clash?.label };
  if (clash) return { value: 'no', conflict: clash.label };
  return { value: 'unknown' };
}

/** Score every candidate slot and recommend one. */
export function scoreSlots(input: ArbitrageInput): ArbitrageResult {
  const cfg = resolveConfig(input.config);
  const { participants, responses, slots } = input;

  const ranked = slots
    .map((slot) => scoreOneSlot(slot, participants, responses, cfg))
    .sort(compareSlotScores);

  const nonResponders = participants
    .filter((p) => Object.keys(responses[p.id] ?? {}).length === 0)
    .map((p) => p.id);

  return {
    ranked,
    recommendation: recommend(ranked, cfg),
    nonResponders,
  };
}

function scoreOneSlot(
  slot: Slot, participants: Participant[], responses: ResponseMap, cfg: ArbitrageConfig,
): SlotScore {
  const attendees: string[] = [];
  const ifNeeded: string[] = [];
  const absent: string[] = [];
  const unknown: string[] = [];
  const blockedBy: string[] = [];
  const conflicts: Array<{ participantId: string; label: string }> = [];
  const reasons: string[] = [];

  let score = 0;

  for (const p of participants) {
    const { value, conflict } = resolveAvailability(p, slot, responses, cfg.timezone);
    const weight = schedulingWeight(p, cfg);
    if (conflict) conflicts.push({ participantId: p.id, label: conflict });

    switch (value) {
      case 'yes':
        attendees.push(p.id);
        score += weight;
        break;
      case 'ifneed':
        ifNeeded.push(p.id);
        score += weight * cfg.ifNeedValue;
        break;
      case 'no':
        absent.push(p.id);
        if (p.required) blockedBy.push(p.id);
        // Rotate the pain: someone the schedule already excluded recently
        // makes this slot a worse choice than one that excludes a fresh face.
        score -= cfg.fairnessPenalty * (p.excludedRecently ?? 0);
        break;
      case 'unknown':
        unknown.push(p.id);
        if (p.required) blockedBy.push(p.id);
        break;
    }
  }

  // A non-responder is scored as a zero, never as an optimistic maybe. The
  // fastest way to raise a slot's score is therefore to go and get an answer.
  const heads = attendees.length + ifNeeded.length;
  const isAnchor = slot.id === cfg.anchorSlotId;
  if (isAnchor) {
    score += cfg.anchorBonus;
    reasons.push(`current fixed time (+${cfg.anchorBonus.toFixed(2)} stability bonus)`);
  }

  const viable = heads >= cfg.quorum && blockedBy.length === 0;
  if (heads < cfg.quorum) reasons.push(`below quorum: ${heads}/${cfg.quorum}`);
  if (blockedBy.length) reasons.push(`missing required: ${blockedBy.join(', ')}`);
  if (unknown.length) reasons.push(`${unknown.length} yet to answer`);
  for (const c of conflicts) reasons.push(`${c.participantId}: ${c.label}`);

  return {
    slot, score: round(score),
    attendees, ifNeeded, absent, unknown, blockedBy, conflicts,
    viable, reasons,
  };
}

/** Highest score first; break ties on real heads, then on the earlier slot. */
function compareSlotScores(a: SlotScore, b: SlotScore): number {
  if (b.score !== a.score) return b.score - a.score;
  const heads = (b.attendees.length + b.ifNeeded.length) - (a.attendees.length + a.ifNeeded.length);
  if (heads !== 0) return heads;
  return a.slot.startUtc.localeCompare(b.slot.startUtc);
}

function recommend(ranked: SlotScore[], cfg: ArbitrageConfig): ArbitrageResult['recommendation'] {
  const viable = ranked.filter((r) => r.viable);

  if (viable.length === 0) {
    const best = ranked[0];
    return {
      slotId: null,
      action: 'no-viable-slot',
      margin: 0,
      rationale: best
        ? `Nothing clears quorum. Closest is ${best.slot.id} (${best.reasons.join('; ')}).`
        : 'No candidate slots were supplied.',
    };
  }

  const winner = viable[0];

  if (!cfg.anchorSlotId) {
    return {
      slotId: winner.slot.id,
      action: 'switch',
      margin: round(winner.score - (viable[1]?.score ?? 0)),
      rationale: `No fixed time set yet. ${winner.slot.id} is the strongest option.`,
    };
  }

  const anchor = ranked.find((r) => r.slot.id === cfg.anchorSlotId);

  if (!anchor || !anchor.viable) {
    return {
      slotId: winner.slot.id,
      action: 'switch',
      margin: round(winner.score - (anchor?.score ?? 0)),
      rationale: anchor
        ? `Fixed time is not viable this round (${anchor.reasons.join('; ')}). Moving to ${winner.slot.id}.`
        : `Fixed time is not among this round's options. Moving to ${winner.slot.id}.`,
    };
  }

  const margin = round(winner.score - anchor.score);

  if (winner.slot.id === anchor.slot.id || margin <= cfg.switchMargin) {
    return {
      slotId: anchor.slot.id,
      action: 'keep-anchor',
      margin,
      rationale: margin <= 0
        ? 'Fixed time is still the best option. Keeping it.'
        : `Best alternative only beats the fixed time by ${margin.toFixed(2)}, `
          + `under the ${cfg.switchMargin.toFixed(2)} margin needed to justify moving. Keeping it.`,
    };
  }

  return {
    slotId: winner.slot.id,
    action: 'switch',
    margin,
    rationale: `${winner.slot.id} beats the fixed time by ${margin.toFixed(2)}, `
      + `clearing the ${cfg.switchMargin.toFixed(2)} margin. Worth moving.`,
  };
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}
