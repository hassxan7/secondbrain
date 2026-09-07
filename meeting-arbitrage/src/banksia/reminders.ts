/**
 * The chasing. What Banksia bot actually does between meetings.
 *
 * The hard part of a reminder system is not sending messages, it is not being
 * hated. A tool that texts seven people every day about the bins is uninstalled
 * inside a fortnight, and the house goes back to the whiteboard nobody settles.
 *
 * The budget is therefore fixed before anything else: **at most three messages
 * per person per week, none between 9pm and 8am**. Everything below is the
 * question of how to spend three messages well.
 *
 *   - Nobody is messaged about a thing they have already done. Obvious, and the
 *     single most common way these systems lose the room.
 *   - Timing does the work that volume would otherwise do. A nudge on Thursday
 *     ("two to go, three days left") is actionable; the same words on Sunday
 *     night are just an accusation, so Sunday's message says what happens now
 *     instead of asking for something that can no longer be delivered.
 *   - The escalation stops at two. There is no third, angrier chore reminder,
 *     because the thing after the second nudge is the settlement, and the
 *     settlement speaks for itself.
 *
 * Every reminder carries a stable `id`. The scheduler is a cron that may run
 * twice, retry, or overlap; sending is idempotent on that key, so a duplicated
 * run is silent rather than doubling the noise.
 */

import type { Standing } from './board.ts';

export type ReminderKind =
  | 'chore-nudge'        // you are short, there is still time
  | 'chore-last-call'    // the week closes tonight
  | 'meeting-poll'       // you have not answered the poll
  | 'meeting-tomorrow'   // it is on, you said yes
  | 'issue-poll';        // an open "who did this" needs your answer

export type Channel = 'sms' | 'email' | 'whatsapp';

export interface ReminderTarget {
  memberId: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  /** Set when the house runs the WhatsApp bridge; free, and preferred. */
  whatsapp?: boolean;
}

export interface ReminderConfig {
  maxPerWeek: number;
  /** Minutes from local midnight. Nothing is sent outside this window. */
  quietEndMin: number;   // 8am
  quietStartMin: number; // 9pm
  tasksRequired: number;
  /** What is at stake if the week closes short. Named only at last call. */
  stakeCents: number;
}

export const DEFAULT_REMINDER_CONFIG: ReminderConfig = {
  maxPerWeek: 3,
  quietEndMin: 8 * 60,
  quietStartMin: 21 * 60,
  tasksRequired: 4,
  stakeCents: 10_000,
};

export interface Reminder {
  /** Dedupe key. Sending twice with the same id must be a no-op. */
  id: string;
  memberId: string;
  kind: ReminderKind;
  channel: Channel;
  subject: string;
  body: string;
}

export interface ReminderInput {
  weekOf: string;
  /** Local day of week, 0 = Sunday. The week runs Monday to Sunday. */
  weekday: number;
  /** Local minutes past midnight. */
  minuteOfDay: number;
  targets: ReminderTarget[];
  standings: Standing[];
  /** Who has not answered the open meeting poll. */
  awaitingPoll?: string[];
  /** Who said yes to a meeting happening tomorrow. */
  meetingTomorrow?: { label: string; attendees: string[] } | null;
  /** Open "who did this" polls and who has not answered them. */
  openIssues?: { id: string; description: string; awaiting: string[] }[];
  /** How many messages each person has already had this week. */
  sentThisWeek?: Record<string, number>;
  config?: Partial<ReminderConfig>;
}

/** Free channel first: the WhatsApp bridge costs nothing, SMS does not. */
export function pickChannel(target: ReminderTarget): Channel | null {
  if (target.whatsapp) return 'whatsapp';
  if (target.email) return 'email';
  if (target.phone) return 'sms';
  return null;
}

export function withinSendingHours(minuteOfDay: number, config: ReminderConfig): boolean {
  return minuteOfDay >= config.quietEndMin && minuteOfDay < config.quietStartMin;
}

function money(cents: number): string {
  return cents % 100 === 0 ? `$${cents / 100}` : `$${(cents / 100).toFixed(2)}`;
}

/**
 * Everything that should go out on this run, already filtered and budgeted.
 *
 * Ordering is the priority order: when someone is near their weekly cap, the
 * reminders that survive are the ones with a deadline attached.
 */
export function dueReminders(input: ReminderInput): Reminder[] {
  const config = { ...DEFAULT_REMINDER_CONFIG, ...input.config };
  if (!withinSendingHours(input.minuteOfDay, config)) return [];

  const byId = new Map(input.targets.map((t) => [t.memberId, t]));
  const standingOf = new Map(input.standings.map((s) => [s.memberId, s]));
  const candidates: Reminder[] = [];

  const push = (memberId: string, kind: ReminderKind, subject: string, body: string, suffix = '') => {
    const target = byId.get(memberId);
    if (!target) return;
    const channel = pickChannel(target);
    if (!channel) return; // no way to reach them; the board still counts them
    candidates.push({
      id: `${kind}:${memberId}:${input.weekOf}${suffix}`,
      memberId, kind, channel, subject, body,
    });
  };

  // 1. Tomorrow's meeting. Highest priority: it expires soonest and asks least.
  if (input.meetingTomorrow) {
    for (const memberId of input.meetingTomorrow.attendees) {
      const name = byId.get(memberId)?.name ?? 'there';
      push(
        memberId, 'meeting-tomorrow', 'House meeting tomorrow',
        `${name} — house meeting ${input.meetingTomorrow.label}. `
        + 'You said you were free. Anything to raise, add it before then.',
      );
    }
  }

  // 2. Open "who did this" polls. One message per issue, not per day.
  for (const issue of input.openIssues ?? []) {
    for (const memberId of issue.awaiting) {
      push(
        memberId, 'issue-poll', 'Was this you?',
        `${issue.description}\n\nReply "was me" or "not me". `
        + 'Not answering counts as not answering — it does not count as no.',
        `:${issue.id}`,
      );
    }
  }

  // 3. The meeting poll.
  for (const memberId of input.awaitingPoll ?? []) {
    push(
      memberId, 'meeting-poll', 'Two taps: when are you free?',
      'The house is picking a meeting time and you are the one it is waiting on. '
      + 'Silence scores as unavailable, so the time gets picked around you.',
    );
  }

  // 4. Chores. Nothing before Thursday: a Tuesday nudge about a weekly target
  //    is noise, and noise is what gets the whole thing muted.
  const lastCall = input.weekday === 0; // Sunday
  const nudgeDay = input.weekday === 4; // Thursday
  if (lastCall || nudgeDay) {
    for (const target of input.targets) {
      const standing = standingOf.get(target.memberId);
      if (!standing || standing.short === 0) continue;

      if (lastCall) {
        push(
          target.memberId, 'chore-last-call', 'Week closes tonight',
          `${standing.done}/${standing.required} done — ${standing.short} short. `
          + `The week settles at midnight and ${money(config.stakeCents)} of your stake is on it. `
          + 'Anything ticked before then counts.',
        );
      } else {
        push(
          target.memberId, 'chore-nudge', `${standing.short} to go`,
          `${standing.done}/${standing.required} on the board, three days left. `
          + 'Quickest ones still open: ' + standing.remaining.slice(0, 3).join(', ') + '.',
        );
      }
    }
  }

  // Spend the budget in priority order.
  const spent = { ...(input.sentThisWeek ?? {}) };
  const out: Reminder[] = [];
  for (const reminder of candidates) {
    const used = spent[reminder.memberId] ?? 0;
    if (used >= config.maxPerWeek) continue;
    spent[reminder.memberId] = used + 1;
    out.push(reminder);
  }
  return out;
}

/**
 * What the house is told about the messaging, in the words they will read.
 * Shown at onboarding, because a promise about volume is only worth anything
 * if it is made before the phone number is handed over.
 */
export function reminderPolicy(config: ReminderConfig = DEFAULT_REMINDER_CONFIG): string[] {
  return [
    `At most ${config.maxPerWeek} messages a week.`,
    'Nothing between 9pm and 8am.',
    'Never about something you have already done.',
    'One chore nudge on Thursday, one on Sunday if you are still short. That is it.',
  ];
}
