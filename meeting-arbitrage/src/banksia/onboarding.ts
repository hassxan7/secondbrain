/**
 * Getting a housemate into the system, once, in under a minute.
 *
 * Onboarding is where an accountability tool usually dies. If joining takes a
 * form with twelve fields, six people fill it in and the seventh — reliably the
 * one the system exists for — never does, and now the board is wrong rather
 * than merely ignored.
 *
 * So this asks four things: your name, one way to reach you, when you're
 * generally free, and your acknowledgement of what the data is used for. Every
 * other fact about a person is derived from what they do afterwards.
 *
 * Two decisions in here carry weight:
 *
 *   1. **A soft yes stays soft.** "I might not be free every week" is not a
 *      lesser version of yes — it is a different answer, and it is carried
 *      through the engine as `ifneed`. If it collapsed to `yes`, the scheduler
 *      would lock the standing time onto people who never committed to it, and
 *      the resulting no-shows would be read as flakiness rather than as the
 *      system's own error.
 *
 *   2. **Re-registering is idempotent.** People open the join link twice. The
 *      second visit updates the person it matched on contact details; it does
 *      not mint a second housemate who then shows as never doing a chore.
 */

import type { AvailabilityValue, Participant, WeeklyPattern } from '../core/types.ts';

/** What the house is told at the point of handing over a phone number. */
export interface DataUseLine {
  id: string;
  label: string;
  detail: string;
}

/**
 * Shown on the consent step. Kept here rather than in the page so the same
 * words reach anyone who reads the API, and so it can't drift between the web
 * form and the message a person is later sent.
 */
export const DATA_USE: DataUseLine[] = [
  {
    id: 'reminders',
    label: 'Reminders about chores and the house meeting',
    detail: 'At most three messages a week, never between 9pm and 8am.',
  },
  {
    id: 'board',
    label: 'Your name on the chore board',
    detail: 'Everyone in the house sees who ticked what. That is the point of it.',
  },
  {
    id: 'scheduling',
    label: 'Working out a meeting time that suits the house',
    detail: 'Your weekly availability, and nothing else from your calendar.',
  },
  {
    id: 'not',
    label: 'Not used for anything else',
    detail: 'No ads, no third parties, no selling. Ask and it is deleted.',
  },
];

export type AvailabilityMode =
  /** These times work every week. Counted as a firm yes. */
  | 'fixed'
  /** Usually free then, but not every week. Counted as `ifneed`, never `yes`. */
  | 'varies'
  /** Read free/busy from a connected calendar instead of asking. */
  | 'calendar';

export interface AvailabilityDraft {
  mode: AvailabilityMode;
  /** Weekly slots the person picked. Empty is legal for `calendar`. */
  slots: WeeklyPattern[];
}

export interface JoinDraft {
  name: string;
  email?: string;
  phone?: string;
  availability: AvailabilityDraft;
  /** The consent step was shown and acknowledged. */
  acceptedDataUse: boolean;
}

export interface HouseMember {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  availability: AvailabilityDraft;
}

export interface JoinResult {
  ok: boolean;
  errors: string[];
  /** Set when ok. `matchedExisting` means this updated a person, not added one. */
  member?: Omit<HouseMember, 'id'>;
  matchedExisting?: string;
}

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/* ── Contact details ──────────────────────────────────────────────────────── */

/**
 * Lowercase and trim, and reject anything that isn't shaped like an address.
 *
 * Deliberately not an RFC 5322 validator: the cost of rejecting a real address
 * is that someone gives up on joining, which is worse than the cost of
 * accepting a typo that simply bounces.
 */
export function normaliseEmail(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return null;
  if (/\s/.test(trimmed)) return null;
  const at = trimmed.indexOf('@');
  if (at <= 0 || at !== trimmed.lastIndexOf('@')) return null;
  const domain = trimmed.slice(at + 1);
  if (!domain.includes('.') || domain.startsWith('.') || domain.endsWith('.')) return null;
  return trimmed;
}

/**
 * Australian mobile numbers, however they were typed, to E.164.
 *
 * `0412 345 678`, `+61 412 345 678` and `61412345678` are the same person, and
 * storing them as three different strings is how one housemate ends up
 * receiving every reminder three times while another receives none.
 */
export function normalisePhone(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[\s()\-.]/g, '');
  if (!cleaned) return null;

  if (/^\+\d{8,15}$/.test(cleaned)) return cleaned;
  // 04xx xxx xxx — the standard local mobile form.
  if (/^0[45]\d{8}$/.test(cleaned)) return `+61${cleaned.slice(1)}`;
  // 61 4xx xxx xxx, pasted without the plus.
  if (/^61[45]\d{8}$/.test(cleaned)) return `+${cleaned}`;
  // A bare local mobile with the leading zero lost to a spreadsheet.
  if (/^[45]\d{8}$/.test(cleaned)) return `+61${cleaned}`;
  return null;
}

/** Collapse whitespace and cap length; the board has a column this wide. */
export function normaliseName(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const trimmed = raw.replace(/\s+/g, ' ').trim();
  if (trimmed.length < 2 || trimmed.length > 40) return null;
  return trimmed;
}

/* ── Availability ─────────────────────────────────────────────────────────── */

function validPattern(p: unknown): p is WeeklyPattern {
  if (!p || typeof p !== 'object') return false;
  const { weekday, time } = p as WeeklyPattern;
  return Number.isInteger(weekday) && weekday >= 0 && weekday <= 6
    && typeof time === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
}

/** Dedupe and sort so two people who picked the same slots compare equal. */
export function normaliseAvailability(raw: unknown): AvailabilityDraft | null {
  if (!raw || typeof raw !== 'object') return null;
  const { mode, slots } = raw as Partial<AvailabilityDraft>;
  if (mode !== 'fixed' && mode !== 'varies' && mode !== 'calendar') return null;

  const list = Array.isArray(slots) ? slots.filter(validPattern) : [];
  const seen = new Set<string>();
  const unique: WeeklyPattern[] = [];
  for (const s of list) {
    const key = `${s.weekday}@${s.time}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push({ weekday: s.weekday, time: s.time });
  }
  unique.sort((a, b) => (a.weekday - b.weekday) || a.time.localeCompare(b.time));

  // Picking nothing and not connecting a calendar means the system knows
  // nothing about you, which is a real answer but not a usable one.
  if (mode !== 'calendar' && unique.length === 0) return null;
  return { mode, slots: unique };
}

/**
 * The answer this person's declared availability implies for one slot.
 *
 * `varies` never returns `yes`. That is the whole point of offering the option:
 * someone who says "most weeks" should not be able to have a standing meeting
 * pinned on them and then be marked absent from it.
 */
export function impliedAnswer(
  availability: AvailabilityDraft,
  slot: WeeklyPattern,
): AvailabilityValue | null {
  if (availability.mode === 'calendar') return null;
  const matches = availability.slots.some(
    (s) => s.weekday === slot.weekday && s.time === slot.time,
  );
  if (!matches) return null;
  return availability.mode === 'fixed' ? 'yes' : 'ifneed';
}

/** Plain-English summary for the confirmation screen and the meeting agenda. */
export function describeAvailability(availability: AvailabilityDraft): string {
  if (availability.mode === 'calendar') {
    return availability.slots.length > 0
      ? `Calendar synced, plus ${availability.slots.length} time(s) picked by hand`
      : 'Calendar synced — free/busy read at poll time';
  }
  const byDay = new Map<number, string[]>();
  for (const s of availability.slots) {
    const list = byDay.get(s.weekday) ?? [];
    list.push(s.time);
    byDay.set(s.weekday, list);
  }
  const parts = [...byDay.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([weekday, times]) => `${WEEKDAY_NAMES[weekday]} ${times.join(', ')}`);
  const suffix = availability.mode === 'varies' ? ' (not every week)' : '';
  return parts.join(' · ') + suffix;
}

/* ── Joining ──────────────────────────────────────────────────────────────── */

export interface ExistingMember {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
}

/**
 * Validate a join, and say whether it is a new housemate or the same one back.
 *
 * Errors are returned as a list rather than thrown one at a time: a person
 * filling in a form should be told everything that is wrong with it at once,
 * not made to discover the problems in sequence.
 */
export function validateJoin(draft: JoinDraft, existing: ExistingMember[] = []): JoinResult {
  const errors: string[] = [];

  const name = normaliseName(draft.name);
  if (!name) errors.push('Give a name between 2 and 40 characters.');

  const email = normaliseEmail(draft.email);
  const phone = normalisePhone(draft.phone);
  if (draft.email && !email) errors.push('That email address does not look right.');
  if (draft.phone && !phone) errors.push('That looks off — use a mobile like 0412 345 678.');
  if (!email && !phone) errors.push('One way to reach you: a mobile or an email.');

  const availability = normaliseAvailability(draft.availability);
  if (!availability) {
    errors.push('Pick at least one time you are usually free, or sync a calendar.');
  }

  if (!draft.acceptedDataUse) errors.push('Tick the box to say what this is used for.');

  if (errors.length > 0 || !name || !availability) return { ok: false, errors };

  // Contact details identify a person; names do not. Two housemates called Sam
  // is ordinary, one person joining twice is what breaks the ledger.
  const matched = existing.find(
    (m) => (email && normaliseEmail(m.email) === email)
      || (phone && normalisePhone(m.phone) === phone),
  );

  return {
    ok: true,
    errors: [],
    member: { name, email, phone, availability },
    matchedExisting: matched?.id,
  };
}

/** The shape the scheduling engine consumes. Attendance starts optimistic. */
export function toParticipant(member: HouseMember, attendanceRate = 1): Participant {
  return { id: member.id, name: member.name, attendanceRate };
}
