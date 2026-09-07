/**
 * The event brief: the thing that actually gets pasted into the group chat.
 *
 * Every fact in here — time, cost, venue, who is in, how long each person
 * travels — is computed. The model is handed the finished numbers and asked
 * only to write the sentence around them, and it never sees a decision it
 * could change. If the Anthropic SDK is not installed or no key is configured,
 * `buildBrief` still returns a complete, correct brief with a plainly-worded
 * summary; the model is an upgrade to the prose, never a dependency.
 */

import type { Slot } from '../core/types.ts';
import { formatSlot } from '../core/slots.ts';
import type { HubRanking } from './geo.ts';
import type { Itinerary } from './activities.ts';
import type { Venue } from './places.ts';

export interface BriefInput {
  title?: string;
  slot: Slot;
  itinerary: Itinerary;
  hub: HubRanking;
  venues: Venue[];
  /** id -> display name, for readable output. */
  names: Record<string, string>;
  attendeeIds: string[];
  /** Invited but not coming to this slot. */
  absentIds: string[];
  timezone: string;
}

export interface EventBrief {
  title: string;
  whenLocal: string;
  startUtc: string;
  where: string;
  stops: Array<{ label: string; emoji: string; estCostAud: number; venue?: Venue }>;
  costPerPersonAud: number;
  totalMins: number;
  attendees: string[];
  absent: string[];
  travel: Array<{ name: string; minutes: number }>;
  longestTripMins: number;
  calendar: { googleUrl: string; ics: string };
  /** Plain-language summary. Always present. */
  summary: string;
  /** Model-written prose. Present only when generation succeeded. */
  blurb?: string;
  /** Ready to paste into WhatsApp. */
  chatMessage: string;
}

export function buildBrief(input: BriefInput): EventBrief {
  const nameOf = (id: string) => input.names[id] ?? id;

  const stops = input.itinerary.stops.map((s, i) => ({
    label: s.activity.label,
    emoji: s.activity.emoji,
    estCostAud: s.estCostAud,
    venue: input.venues[i],
  }));

  const travel = input.hub.perMember
    .filter((p) => input.attendeeIds.includes(p.memberId))
    .map((p) => ({ name: nameOf(p.memberId), minutes: p.minutes }))
    .sort((a, b) => b.minutes - a.minutes);

  const whenLocal = formatSlot(input.slot, input.timezone);
  const title = input.title
    ?? (stops.length ? `${stops.map((s) => s.label).join(' + ')} in ${input.hub.name}` : 'Hangout');

  const attendees = input.attendeeIds.map(nameOf);
  const absent = input.absentIds.map(nameOf);
  const longestTripMins = travel[0]?.minutes ?? 0;

  const summary = [
    `${whenLocal} in ${input.hub.name}.`,
    stops.length ? input.itinerary.summary : 'Nothing settled yet.',
    `${attendees.length} coming${absent.length ? `, ${absent.length} out` : ''}.`,
  ].join(' ');

  const brief: EventBrief = {
    title, whenLocal,
    startUtc: input.slot.startUtc,
    where: input.hub.name,
    stops,
    costPerPersonAud: input.itinerary.totalCostAud,
    totalMins: input.itinerary.totalMins,
    attendees, absent, travel, longestTripMins,
    calendar: {
      googleUrl: googleCalendarUrl(input, title),
      ics: buildIcs(input, title, summary),
    },
    summary,
    chatMessage: '',
  };

  brief.chatMessage = renderChatMessage(brief);
  return brief;
}

/** The WhatsApp-shaped version. Short, scannable, no markdown tables. */
export function renderChatMessage(brief: EventBrief): string {
  const lines = [
    `📍 ${brief.title}`,
    `🗓️ ${brief.whenLocal}`,
  ];
  for (const stop of brief.stops) {
    const venue = stop.venue && stop.venue.source === 'google' ? ` — ${stop.venue.name}` : '';
    lines.push(`${stop.emoji} ${stop.label}${venue} (~$${stop.estCostAud})`);
  }
  lines.push(`💸 ~$${brief.costPerPersonAud} each`);
  lines.push(`👥 ${brief.attendees.join(', ')}`);
  if (brief.absent.length) lines.push(`🚫 Out: ${brief.absent.join(', ')}`);
  if (brief.longestTripMins > 40) lines.push(`🚃 Longest trip ~${brief.longestTripMins} min`);
  return lines.join('\n');
}

/* ------------------------------------------------------------------ *
 * Calendar
 * ------------------------------------------------------------------ */

function stampUtc(iso: string): string {
  return iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function googleCalendarUrl(input: BriefInput, title: string): string {
  const start = new Date(input.slot.startUtc);
  const end = new Date(start.getTime()
    + Math.max(input.itinerary.totalMins, input.slot.durationMins) * 60_000);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${stampUtc(start.toISOString())}/${stampUtc(end.toISOString())}`,
    details: input.itinerary.summary,
    location: input.hub.name + ', Sydney NSW',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildIcs(input: BriefInput, title: string, summary: string): string {
  const start = new Date(input.slot.startUtc);
  const end = new Date(start.getTime()
    + Math.max(input.itinerary.totalMins, input.slot.durationMins) * 60_000);
  const uid = `${input.slot.id}-${input.hub.hubKey}@ripple.local`;

  // Fold long lines and escape per RFC 5545, or Apple Calendar silently drops it.
  const esc = (s: string) => s.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ripple//Hangout//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stampUtc(new Date(0).toISOString())}`,
    `DTSTART:${stampUtc(start.toISOString())}`,
    `DTEND:${stampUtc(end.toISOString())}`,
    `SUMMARY:${esc(title)}`,
    `DESCRIPTION:${esc(summary)}`,
    `LOCATION:${esc(input.hub.name + ', Sydney NSW')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/* ------------------------------------------------------------------ *
 * Optional prose
 * ------------------------------------------------------------------ */

const BLURB_SYSTEM = `You write one-line summaries for a Sydney social app.

You are given a plan that has ALREADY been decided. Every number, name, time,
venue and cost in it is final and computed. Your only job is to write the
sentence around them.

Rules:
- Never change, round, recompute or add a fact. No times, prices, or venues
  that are not in the input.
- Two sentences maximum. Under 30 words.
- Sound like a friend in a group chat, not a marketing email. No emoji, no
  exclamation marks, no "Get ready for".
- If the plan is thin or awkward (long travel, someone priced out), say so
  lightly rather than overselling it.`;

export interface BlurbOptions {
  apiKey?: string;
  /** Override for tests or self-hosting. */
  model?: string;
}

/**
 * Ask Claude for the one-liner. Returns null on any failure, and callers keep
 * the deterministic `summary` — a missing blurb must never block a plan.
 */
export async function writeBlurb(
  brief: EventBrief,
  opts: BlurbOptions = {},
): Promise<string | null> {
  const apiKey = opts.apiKey;
  if (!apiKey) return null;

  const facts = [
    `When: ${brief.whenLocal}`,
    `Where: ${brief.where}`,
    `Plan: ${brief.stops.map((s) => s.label).join(' then ')}`,
    `Cost: about $${brief.costPerPersonAud} each`,
    `Coming: ${brief.attendees.join(', ')}`,
    brief.absent.length ? `Not coming: ${brief.absent.join(', ')}` : '',
    brief.longestTripMins > 40 ? `Longest trip: ${brief.longestTripMins} minutes` : '',
  ].filter(Boolean).join('\n');

  try {
    // Imported lazily so the engine, the Worker routes and the tests all run
    // with no Anthropic dependency installed.
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey });

    const response = await client.beta.messages.create({
      model: opts.model ?? 'claude-opus-5',
      max_tokens: 300,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'low' },
      system: BLURB_SYSTEM,
      messages: [{ role: 'user', content: facts }],
    });

    if (response.stop_reason === 'refusal') return null;

    // Narrow on `.type` and let the SDK's own union do the work — hand-written
    // predicates over SDK types drift the moment a block variant is added.
    const text = response.content
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('')
      .trim();

    return text.length > 0 ? text : null;
  } catch {
    return null;
  }
}
