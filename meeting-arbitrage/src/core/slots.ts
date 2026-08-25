/**
 * Slot grid construction and timezone maths.
 *
 * Uses only `Intl` so it runs unchanged in Cloudflare Workers, Node, and the
 * browser. Sydney observes DST, so every local<->UTC conversion goes through
 * the IANA database rather than a fixed offset.
 */

import type { Slot, StandingConflict } from './types.ts';

export interface LocalParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  /** 0 = Sunday .. 6 = Saturday */
  weekday: number;
  /** Minutes from local midnight. */
  minutesOfDay: number;
}

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};

const partsCache = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZone: string): Intl.DateTimeFormat {
  let fmt = partsCache.get(timeZone);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour12: false,
      weekday: 'short',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    partsCache.set(timeZone, fmt);
  }
  return fmt;
}

/** Decompose a UTC instant into wall-clock parts in `timeZone`. */
export function localParts(instant: Date | string, timeZone: string): LocalParts {
  const date = typeof instant === 'string' ? new Date(instant) : instant;
  if (Number.isNaN(date.getTime())) throw new RangeError(`invalid instant: ${String(instant)}`);

  const bag: Record<string, string> = {};
  for (const p of formatterFor(timeZone).formatToParts(date)) {
    if (p.type !== 'literal') bag[p.type] = p.value;
  }

  // `hour12: false` yields 24 for midnight in some ICU builds; normalise to 0.
  const hour = Number(bag.hour) % 24;
  const minute = Number(bag.minute);

  return {
    year: Number(bag.year),
    month: Number(bag.month),
    day: Number(bag.day),
    hour,
    minute,
    weekday: WEEKDAY_INDEX[bag.weekday] ?? 0,
    minutesOfDay: hour * 60 + minute,
  };
}

/**
 * Offset of `timeZone` from UTC, in minutes, at a given instant.
 * Positive east of Greenwich (Sydney is +600 or +660).
 */
export function offsetMinutes(instant: Date, timeZone: string): number {
  const p = localParts(instant, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
  return Math.round((asUtc - instant.getTime()) / 60_000);
}

/**
 * Convert a local wall-clock time in `timeZone` to a UTC instant.
 *
 * Resolved in two passes because the offset itself depends on the instant.
 * On a DST boundary the second pass settles it; ambiguous times (the repeated
 * hour when clocks go back) resolve to the earlier instant.
 */
export function zonedTimeToUtc(
  year: number, month: number, day: number,
  hour: number, minute: number, timeZone: string,
): Date {
  const naive = Date.UTC(year, month - 1, day, hour, minute);
  let guess = new Date(naive - offsetMinutes(new Date(naive), timeZone) * 60_000);
  const refined = naive - offsetMinutes(guess, timeZone) * 60_000;
  if (refined !== guess.getTime()) guess = new Date(refined);
  return guess;
}

/** Format a slot for humans, e.g. "Mon 1 Sep, 7:30 pm". */
export function formatSlot(slot: Slot, timeZone: string): string {
  return new Intl.DateTimeFormat('en-AU', {
    timeZone,
    weekday: 'short', day: 'numeric', month: 'short',
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(new Date(slot.startUtc)).replace(/ /g, ' ');
}

export interface GridOptions {
  /** Local date the grid starts on, `YYYY-MM-DD`. */
  startDate: string;
  days: number;
  /** Local start times to offer each day, `HH:MM`. */
  times: string[];
  durationMins: number;
  timeZone: string;
  /** Restrict to these weekdays (0 = Sun). Omit for every day. */
  weekdays?: number[];
}

/**
 * Build the candidate slot grid people tap on.
 *
 * Slot ids encode local date and time (`2026-09-01T19:30`) so that a link
 * pasted into WhatsApp stays readable and stable across deploys.
 */
export function generateGrid(opts: GridOptions): Slot[] {
  const [y, m, d] = opts.startDate.split('-').map(Number);
  if (!y || !m || !d) throw new RangeError(`invalid startDate: ${opts.startDate}`);

  const slots: Slot[] = [];
  const allowed = opts.weekdays ? new Set(opts.weekdays) : null;

  for (let dayIndex = 0; dayIndex < opts.days; dayIndex++) {
    // Step by calendar day at local noon, which never lands on a DST gap.
    const probe = new Date(Date.UTC(y, m - 1, d + dayIndex, 12, 0));
    const local = localParts(probe, opts.timeZone);
    if (allowed && !allowed.has(local.weekday)) continue;

    for (const time of opts.times) {
      const [hh, mm] = time.split(':').map(Number);
      const startUtc = zonedTimeToUtc(local.year, local.month, local.day, hh, mm, opts.timeZone);
      const id = `${local.year}-${pad(local.month)}-${pad(local.day)}T${pad(hh)}:${pad(mm)}`;
      slots.push({ id, startUtc: startUtc.toISOString(), durationMins: opts.durationMins });
    }
  }
  return slots;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** Does this slot overlap a recurring commitment? Half-open: [start, end). */
export function collidesWithStandingConflict(
  slot: Slot, conflict: StandingConflict, timeZone: string,
): boolean {
  const p = localParts(slot.startUtc, timeZone);
  if (p.weekday !== conflict.weekday) return false;
  const slotStart = p.minutesOfDay;
  const slotEnd = slotStart + slot.durationMins;
  return slotStart < conflict.endMin && slotEnd > conflict.startMin;
}
