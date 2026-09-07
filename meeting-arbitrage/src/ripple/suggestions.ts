/**
 * Suggestions, and the sequencing problem they create.
 *
 * The plan is filled in asynchronously — people answer whenever they open the
 * link. So the third person to answer can add an option the first two never
 * saw. Three obvious ways to handle that, all wrong:
 *
 *   Re-open the whole poll   Everyone redoes everything. Completion collapses,
 *                            and the people who were prompt are punished.
 *   Ignore the gap           The new option only collects votes from whoever
 *                            answers after it. Late options can then never win,
 *                            which makes suggesting pointless.
 *   Assume approval          Obviously wrong, and it silently manufactures
 *                            consent for something nobody agreed to.
 *
 * The fix is to stop treating a person's answer as one submission and start
 * treating it as a set of independent cells — one per option. A cell is
 * `answered` or `pending`. Adding an option does not invalidate anybody's
 * existing answers; it opens exactly one new pending cell per person.
 *
 * That gives two properties worth having:
 *
 *   1. Re-asking is proportional. Someone who already answered is shown only
 *      the options they have not seen — usually one, a few seconds' work —
 *      instead of the whole form again.
 *   2. An option cannot win before people have seen it. Ranking on approval
 *      *rate* would let a brand-new suggestion sit at 1/1 = 100% and beat an
 *      option four of six people wanted. So an option is only eligible to be
 *      chosen once every current participant has actually been shown it, and
 *      `pending` names precisely who is holding it up — which is who the
 *      reminder should go to, and nobody else.
 */

import type { Activity, HangoutMember } from './activities.ts';

export type BallotOrigin =
  | { kind: 'catalogue' }
  | { kind: 'suggested'; by: string }
  | { kind: 'link'; by: string; url: string; platform: string };

/**
 * One option on the plan, and where every participant stands on it.
 * `approvals` is always a subset of `seen`.
 */
export interface Ballot {
  activityId: string;
  seen: string[];
  approvals: string[];
  origin: BallotOrigin;
  addedAt: string;
}

export interface BallotOutcome {
  activity: Activity;
  approvals: string[];
  seen: string[];
  /** Participants who have never been shown this option. */
  pending: string[];
  /** Share of participants who have seen it, 0..1. */
  coverage: number;
  /** Attendees this option prices out. */
  pricedOut: string[];
  /**
   * Can this be chosen yet? False while anyone still has a pending cell —
   * an option nobody has seen is not a decision the group has made.
   */
  eligible: boolean;
  origin: BallotOrigin;
  score: number;
  reasons: string[];
}

/** Open the initial ballots: the standing catalogue, seen by nobody yet. */
export function openBallots(catalogue: Activity[], now: string): Ballot[] {
  return catalogue.map((activity) => ({
    activityId: activity.id,
    seen: [],
    approvals: [],
    origin: { kind: 'catalogue' } as BallotOrigin,
    addedAt: now,
  }));
}

/**
 * Record one person's pass over the options they were shown.
 *
 * `shown` is what was actually on screen, which is why it is passed in rather
 * than inferred: it is the difference between "did not want it" and "never saw
 * it", and that distinction is the whole point of this module.
 */
export function recordAnswers(
  ballots: Ballot[], memberId: string, shown: string[], approved: string[],
): Ballot[] {
  const shownSet = new Set(shown);
  const approvedSet = new Set(approved.filter((id) => shownSet.has(id)));

  return ballots.map((ballot) => {
    if (!shownSet.has(ballot.activityId)) return ballot;

    const seen = ballot.seen.includes(memberId) ? ballot.seen : [...ballot.seen, memberId];
    const wants = approvedSet.has(ballot.activityId);
    const approvals = wants
      ? (ballot.approvals.includes(memberId) ? ballot.approvals : [...ballot.approvals, memberId])
      : ballot.approvals.filter((id) => id !== memberId);

    return { ...ballot, seen, approvals };
  });
}

/**
 * Add an option mid-flight.
 *
 * The suggester has seen it and is counted as approving it — they proposed it.
 * Everybody else gets a pending cell, and the option stays ineligible until
 * they clear it.
 */
export function addSuggestion(
  ballots: Ballot[], activity: Activity, by: string, now: string,
  origin?: BallotOrigin,
): Ballot[] {
  if (ballots.some((b) => b.activityId === activity.id)) {
    // Already on the list: treat a re-suggestion as an approval, not a duplicate.
    return recordAnswers(ballots, by, [activity.id], [activity.id]);
  }
  return [...ballots, {
    activityId: activity.id,
    seen: [by],
    approvals: [by],
    origin: origin ?? { kind: 'suggested', by },
    addedAt: now,
  }];
}

/**
 * What this person still has to answer.
 *
 * Empty for someone who has answered everything, and empty for someone who has
 * not started (they get the whole form, not a delta).
 */
export function pendingAsksFor(
  ballots: Ballot[], memberId: string, catalogue: Map<string, Activity>,
): Activity[] {
  const hasStarted = ballots.some((b) => b.seen.includes(memberId));
  if (!hasStarted) return [];

  return ballots
    .filter((b) => !b.seen.includes(memberId))
    .map((b) => catalogue.get(b.activityId))
    .filter((a): a is Activity => Boolean(a));
}

/** Everyone who has started answering. Participants, not invitees. */
export function participants(ballots: Ballot[]): string[] {
  const ids = new Set<string>();
  for (const ballot of ballots) for (const id of ballot.seen) ids.add(id);
  return [...ids];
}

/**
 * Who is holding up a decision, and on what.
 *
 * This is the reminder list. It is deliberately narrow: someone who has
 * answered everything is never chased, and someone is only chased about the
 * options they specifically have not seen.
 */
export function outstandingAsks(
  ballots: Ballot[], catalogue: Map<string, Activity>,
): Array<{ memberId: string; activities: Activity[] }> {
  return participants(ballots)
    .map((memberId) => ({ memberId, activities: pendingAsksFor(ballots, memberId, catalogue) }))
    .filter((row) => row.activities.length > 0);
}

export interface RankOptions {
  /** Charged per attendee an option prices out. */
  pricedOutPenalty?: number;
  /**
   * Let an option be chosen once this share of participants has seen it, even
   * with cells still open. Default 1 — everyone. Lower it only to break a
   * stalemate, and say so in the UI when you do.
   */
  coverageThreshold?: number;
}

/**
 * Rank options with coverage taken into account.
 *
 * Ineligible options are still returned, and still carry their real score, so
 * the UI can show "3 votes, waiting on Kez and Ross" rather than hiding a
 * popular suggestion until it silently qualifies.
 */
export function rankBallots(
  ballots: Ballot[],
  catalogue: Map<string, Activity>,
  attendees: HangoutMember[],
  options: RankOptions = {},
): BallotOutcome[] {
  const pricedOutPenalty = options.pricedOutPenalty ?? 1.5;
  const coverageThreshold = options.coverageThreshold ?? 1;
  const everyone = participants(ballots);
  const attendeeIds = new Set(attendees.map((m) => m.id));

  return ballots
    .map((ballot) => {
      const activity = catalogue.get(ballot.activityId);
      if (!activity) return null;

      // Scope to people who can actually make the chosen time.
      const seen = ballot.seen.filter((id) => attendeeIds.has(id));
      const approvals = ballot.approvals.filter((id) => attendeeIds.has(id));
      const relevant = everyone.filter((id) => attendeeIds.has(id));
      const pending = relevant.filter((id) => !seen.includes(id));

      const coverage = relevant.length === 0 ? 0 : seen.length / relevant.length;
      const pricedOut = attendees
        .filter((m) => m.budgetAud < activity.estCostAud)
        .map((m) => m.id);

      const eligible = coverage >= coverageThreshold;
      const score = approvals.length - pricedOutPenalty * pricedOut.length;

      const reasons: string[] = [];
      if (!eligible) {
        reasons.push(pending.length === 1
          ? `waiting on 1 person to see it`
          : `waiting on ${pending.length} people to see it`);
      }
      if (pricedOut.length > 0) {
        reasons.push(`over budget for ${pricedOut.length} ${pricedOut.length === 1 ? 'person' : 'people'}`);
      }
      if (ballot.origin.kind === 'suggested') reasons.push('suggested mid-plan');
      if (ballot.origin.kind === 'link') reasons.push(`added from ${ballot.origin.platform}`);
      if (activity.rippleEvent) reasons.push('curated Ripple event');

      return {
        activity, approvals, seen, pending,
        coverage: Math.round(coverage * 100) / 100,
        pricedOut, eligible,
        origin: ballot.origin,
        score: Math.round(score * 1000) / 1000,
        reasons,
      };
    })
    .filter((o): o is BallotOutcome => o !== null)
    .sort((a, b) => {
      // Eligible options always outrank pending ones, however popular those are.
      if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
      if (a.score !== b.score) return b.score - a.score;
      if (a.approvals.length !== b.approvals.length) return b.approvals.length - a.approvals.length;
      // Equally wanted: take the cheaper one. Without this the winner is decided
      // by which option happened to be added first, which is arbitrary — and
      // breaking the tie on price is the same instinct as the budget ceiling.
      if (a.activity.estCostAud !== b.activity.estCostAud) {
        return a.activity.estCostAud - b.activity.estCostAud;
      }
      return a.activity.id.localeCompare(b.activity.id);
    });
}
