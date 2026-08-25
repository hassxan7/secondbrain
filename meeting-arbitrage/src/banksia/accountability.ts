/**
 * Chores, fines, and issue ownership for the house.
 *
 * The stated problem was never that the rules are unclear. There is a chore
 * board, a 4-of-8 threshold, and a fine. The problem is that enforcing it
 * requires somebody to personally accuse a housemate at dinner, and nobody
 * wants to be that person, so the fines are never collected and the rule
 * quietly dies.
 *
 * So enforcement here is impersonal and automatic:
 *
 *   1. The ledger is computed from the board, not from an accusation. Nobody
 *      has to point at anyone; the week just closes and the numbers are what
 *      they are.
 *   2. Silence is not an exit. An unanswered "was this you?" names everyone
 *      who did not answer, so ignoring the group chat stops being free.
 *   3. Being absent forfeits the right to contest. Disputes are heard at the
 *      meeting, and only from people who are at the meeting.
 *
 * Rule 3 is the load-bearing one, and it is why this file sits next to the
 * scheduler rather than in an app of its own: it converts "come to the
 * meeting" from a request into the only way to defend yourself.
 */

/** The eight jobs on the board. Four a week, or you are short. */
export interface ChoreTask {
  id: string;
  label: string;
}

export interface ChoreClaim {
  participantId: string;
  taskId: string;
  /** Monday of the week being settled, `YYYY-MM-DD`. */
  weekOf: string;
  claimedAt: string;
  /** Housemates who confirmed it. Unverified claims still count; see below. */
  verifiedBy?: string[];
  /** Someone pressed "that wasn't done". Suspends the claim pending the meeting. */
  challengedBy?: string[];
}

export type FineState = 'pending' | 'disputed' | 'upheld' | 'waived' | 'paid';

export interface ChoreConfig {
  tasksRequired: number;
  finePerMissedTaskCents: number;
  /** Tasks on the board this period. */
  tasks: ChoreTask[];
}

export const DEFAULT_CHORE_CONFIG: Omit<ChoreConfig, 'tasks'> = {
  tasksRequired: 4,
  finePerMissedTaskCents: 500,
};

export interface Settlement {
  participantId: string;
  weekOf: string;
  completed: number;
  /** Claims suspended because someone challenged them. Not counted. */
  challenged: number;
  required: number;
  shortfall: number;
  fineCents: number;
  state: FineState;
  note: string;
}

/**
 * Close a week and compute what everyone owes.
 *
 * A claim someone has challenged does not count until the meeting resolves it.
 * That is the only place a human judgement enters, and it is deliberately
 * pushed to the one forum where the person can answer for themselves.
 */
export function settleWeek(args: {
  weekOf: string;
  participantIds: string[];
  claims: ChoreClaim[];
  config: ChoreConfig;
}): Settlement[] {
  const { weekOf, participantIds, claims, config } = args;
  const validTaskIds = new Set(config.tasks.map((t) => t.id));

  return participantIds.map((participantId) => {
    const mine = claims.filter(
      (c) => c.participantId === participantId
        && c.weekOf === weekOf
        && validTaskIds.has(c.taskId),
    );

    // One claim per task per week — doing the bins twice is still one task.
    // A challenge against any claim for a task sticks to that task: otherwise
    // re-ticking the box would quietly launder the challenge away.
    const byTask = new Map<string, boolean>();
    for (const c of mine) {
      const alreadyChallenged = byTask.get(c.taskId) ?? false;
      byTask.set(c.taskId, alreadyChallenged || Boolean(c.challengedBy?.length));
    }

    let completed = 0;
    let challenged = 0;
    for (const isChallenged of byTask.values()) {
      if (isChallenged) challenged++;
      else completed++;
    }

    const shortfall = Math.max(0, config.tasksRequired - completed);
    const fineCents = shortfall * config.finePerMissedTaskCents;

    return {
      participantId, weekOf, completed, challenged,
      required: config.tasksRequired,
      shortfall, fineCents,
      state: fineCents > 0 ? 'pending' : 'waived',
      note: buildNote(completed, config.tasksRequired, challenged, shortfall),
    };
  });
}

function buildNote(completed: number, required: number, challenged: number, shortfall: number): string {
  if (shortfall === 0) return `${completed}/${required} done. Clear.`;
  const base = `${completed}/${required} done, ${shortfall} short.`;
  return challenged > 0
    ? `${base} ${challenged} claim(s) challenged and not counted pending the meeting.`
    : base;
}

/* ------------------------------------------------------------------ *
 * Disputes. Heard at the meeting, and only from people at the meeting.
 * ------------------------------------------------------------------ */

export interface Dispute {
  participantId: string;
  weekOf: string;
  argument: string;
  raisedAt: string;
}

export interface DisputeOutcome extends Settlement {
  heard: boolean;
  outcomeNote: string;
}

/**
 * Apply the attendance rule to a week's fines.
 *
 * Undisputed fines uphold themselves — that is what makes this automatic. A
 * dispute from someone who turned up gets heard at the meeting. A dispute from
 * someone who did not turn up is forfeited, which is the entire incentive.
 */
export function resolveDisputes(args: {
  settlements: Settlement[];
  disputes: Dispute[];
  /** Who was actually at the meeting where this week was settled. */
  presentAtMeeting: string[];
}): DisputeOutcome[] {
  const present = new Set(args.presentAtMeeting);

  return args.settlements.map((s) => {
    if (s.fineCents === 0) {
      return { ...s, heard: false, outcomeNote: 'Nothing owed.' };
    }

    const dispute = args.disputes.find(
      (d) => d.participantId === s.participantId && d.weekOf === s.weekOf,
    );

    if (!dispute) {
      return {
        ...s, state: 'upheld', heard: false,
        outcomeNote: 'Not disputed, so it stands. No one had to chase it.',
      };
    }

    if (!present.has(s.participantId)) {
      return {
        ...s, state: 'upheld', heard: false,
        outcomeNote: 'Disputed, but the disputant was not at the meeting. '
          + 'Forfeited — you have to be there to argue it.',
      };
    }

    return {
      ...s, state: 'disputed', heard: true,
      outcomeNote: `Heard at the meeting: "${dispute.argument}" — house to vote.`,
    };
  });
}

/* ------------------------------------------------------------------ *
 * Issue polls: "sink is full of noodles again — was this you?"
 * ------------------------------------------------------------------ */

export interface Issue {
  id: string;
  raisedBy: string;
  description: string;
  createdAt: string;
  /** After this, silence gets named. */
  closesAt: string;
  photoUrl?: string;
}

export type IssueAnswer = 'was-me' | 'not-me';

export interface IssueResponse {
  issueId: string;
  participantId: string;
  answer: IssueAnswer;
  at: string;
}

export type IssueStatus = 'owned' | 'shared' | 'no-owner' | 'unresolved-silence';

export interface IssueOutcome {
  issueId: string;
  status: IssueStatus;
  owners: string[];
  denied: string[];
  /** Did not answer before the poll closed. Named, publicly. */
  silent: string[];
  /** Ready to drop straight into the group chat. */
  summary: string;
  /** Should this become an agenda item? */
  escalate: boolean;
}

/**
 * Resolve a "was me / not me" poll.
 *
 * The interesting case is not someone owning up, it is everyone staying quiet.
 * A poll where nobody answers currently resolves as "no one did it", which is
 * how issues die in a group chat. Here it resolves as a named list of people
 * who did not answer, and it escalates. That costs less social capital than
 * accusing someone and it is much harder to sit out.
 */
export function resolveIssue(
  issue: Issue,
  responses: IssueResponse[],
  participantIds: string[],
  now: string,
): IssueOutcome {
  const mine = responses.filter((r) => r.issueId === issue.id);
  const latest = new Map<string, IssueAnswer>();
  for (const r of mine.sort((a, b) => a.at.localeCompare(b.at))) {
    latest.set(r.participantId, r.answer); // last word wins
  }

  const owners = participantIds.filter((p) => latest.get(p) === 'was-me');
  const denied = participantIds.filter((p) => latest.get(p) === 'not-me');
  const closed = now >= issue.closesAt;
  const silent = closed
    ? participantIds.filter((p) => !latest.has(p) && p !== issue.raisedBy)
    : [];

  if (owners.length === 1) {
    return {
      issueId: issue.id, status: 'owned', owners, denied, silent,
      summary: `${owners[0]} owned it. Closed, no meeting time needed.`,
      escalate: false,
    };
  }

  if (owners.length > 1) {
    return {
      issueId: issue.id, status: 'shared', owners, denied, silent,
      summary: `${owners.join(' and ')} both owned it. Closed.`,
      escalate: false,
    };
  }

  if (!closed) {
    return {
      issueId: issue.id, status: 'unresolved-silence', owners: [], denied, silent: [],
      summary: `Still open. ${denied.length} said not me, `
        + `${participantIds.length - denied.length - 1} yet to answer.`,
      escalate: false,
    };
  }

  if (silent.length > 0) {
    return {
      issueId: issue.id, status: 'unresolved-silence', owners: [], denied, silent,
      summary: `Nobody owned this. Everyone answered except: ${silent.join(', ')}. `
        + `Going on the agenda.`,
      escalate: true,
    };
  }

  return {
    issueId: issue.id, status: 'no-owner', owners: [], denied, silent: [],
    summary: 'Everyone answered "not me". Going on the agenda as unresolved.',
    escalate: true,
  };
}

/* ------------------------------------------------------------------ *
 * Repeat offenders and the agenda.
 * ------------------------------------------------------------------ */

export interface OffenderRow {
  participantId: string;
  ownedIssues: number;
  unresolvedNearMisses: number;
  upheldFines: number;
  finesOwedCents: number;
  meetingsMissed: number;
  /** Rough composite, only for ordering the agenda. Not a punishment. */
  score: number;
}

/**
 * Rank who the house keeps having the same conversation about.
 *
 * This exists to order the agenda, not to hand out verdicts. Being top of this
 * list means the recurring issues get discussed while people are still in the
 * room, instead of at 1am in the group chat.
 */
export function offenderTable(args: {
  participantIds: string[];
  outcomes: IssueOutcome[];
  settlements: DisputeOutcome[];
  meetingsMissed: Record<string, number>;
}): OffenderRow[] {
  return args.participantIds
    .map((participantId) => {
      const ownedIssues = args.outcomes.filter((o) => o.owners.includes(participantId)).length;
      const unresolvedNearMisses = args.outcomes
        .filter((o) => o.escalate && o.silent.includes(participantId)).length;
      const upheld = args.settlements
        .filter((s) => s.participantId === participantId && s.state === 'upheld');
      const finesOwedCents = upheld.reduce((sum, s) => sum + s.fineCents, 0);
      const meetingsMissed = args.meetingsMissed[participantId] ?? 0;

      return {
        participantId, ownedIssues, unresolvedNearMisses,
        upheldFines: upheld.length, finesOwedCents, meetingsMissed,
        score: ownedIssues * 3 + unresolvedNearMisses * 2 + upheld.length * 2 + meetingsMissed,
      };
    })
    .sort((a, b) => b.score - a.score);
}

export interface AgendaItem {
  kind: 'dispute' | 'unresolved-issue' | 'repeat-offender' | 'ledger';
  title: string;
  detail: string;
  /** Who this is about, if anyone. */
  concerns: string[];
}

/**
 * Build the meeting agenda from the week's unfinished business.
 *
 * A meeting with no agenda is a meeting people skip. This one always has a
 * concrete one, and — because disputes are only heard from people in the room
 * — the people most likely to skip are the people with the most riding on it.
 */
export function buildAgenda(args: {
  outcomes: IssueOutcome[];
  settlements: DisputeOutcome[];
  offenders: OffenderRow[];
  nameOf: (id: string) => string;
}): AgendaItem[] {
  const items: AgendaItem[] = [];
  const { nameOf } = args;

  for (const s of args.settlements.filter((x) => x.state === 'disputed')) {
    items.push({
      kind: 'dispute',
      title: `${nameOf(s.participantId)} is contesting a ${formatMoney(s.fineCents)} fine`,
      detail: s.outcomeNote,
      concerns: [s.participantId],
    });
  }

  for (const o of args.outcomes.filter((x) => x.escalate)) {
    items.push({
      kind: 'unresolved-issue',
      title: 'Unowned issue',
      detail: o.summary,
      concerns: o.silent,
    });
  }

  const repeat = args.offenders.filter((o) => o.score >= 5);
  for (const o of repeat) {
    items.push({
      kind: 'repeat-offender',
      title: `Recurring: ${nameOf(o.participantId)}`,
      detail: `${o.ownedIssues} owned issue(s), ${o.upheldFines} upheld fine(s), `
        + `${o.meetingsMissed} meeting(s) missed, ${formatMoney(o.finesOwedCents)} outstanding.`,
      concerns: [o.participantId],
    });
  }

  const owed = args.settlements.filter((s) => s.state === 'upheld' && s.fineCents > 0);
  if (owed.length) {
    items.push({
      kind: 'ledger',
      title: 'Ledger',
      detail: owed
        .map((s) => `${nameOf(s.participantId)}: ${formatMoney(s.fineCents)} (${s.note})`)
        .join(' · '),
      concerns: owed.map((s) => s.participantId),
    });
  }

  return items;
}

export function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
