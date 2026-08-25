/**
 * HTTP surface for Ripple hangouts.
 *
 * Different shape from Banksia: there is no roster. Someone opens a link,
 * onboards, and becomes a member of that hangout in the same motion — which is
 * why `join` creates the member row rather than looking one up.
 */

import {
  type Env, getGroup, getPoll, slotsOf, loadParticipants, loadResponses,
  loadMemberNames, memberFromToken, issueToken, newId, json, badRequest,
  notFound, unauthorized,
} from '../db.ts';
import { scoreSlots } from '../core/arbitrage.ts';
import { generateGrid, formatSlot } from '../core/slots.ts';
import { DEFAULT_CONFIG, type AvailabilityValue } from '../core/types.ts';
import {
  ACTIVITIES, mergeRippleEvents, rankActivities, buildItinerary,
  DEFAULT_HANGOUT_CONFIG, type Activity, type HangoutMember,
} from './activities.ts';
import { rankHubs, SUBURBS } from './geo.ts';
import { searchVenues, rerankHubsByVenues, type Venue } from './places.ts';
import { buildBrief, writeBlurb } from './brief.ts';

async function readJson<T>(request: Request): Promise<T | null> {
  try { return await request.json() as T; } catch { return null; }
}

/** Curated Ripple events, shaped so they compete inside the normal catalogue. */
async function loadRippleEvents(env: Env, groupId: string): Promise<Activity[]> {
  const { results } = await env.DB.prepare(
    `SELECT * FROM ripple_events
      WHERE is_active = 1 AND (group_id IS NULL OR group_id = ?)`,
  ).bind(groupId).all<{
    id: string; label: string; emoji: string; est_cost_aud: number;
    duration_mins: number; category: string; time_of_day: string;
    sequence_rank: number; venue_name: string | null; suburb: string | null;
  }>();

  return (results ?? []).map((e) => ({
    id: e.id,
    label: e.label,
    emoji: e.emoji,
    estCostAud: e.est_cost_aud,
    durationMins: e.duration_mins,
    category: e.category as Activity['category'],
    placesQuery: e.venue_name ?? '',
    timeOfDay: e.time_of_day as Activity['timeOfDay'],
    sequenceRank: e.sequence_rank,
    tags: ['ripple'],
  }));
}

/** POST /api/ripple/hangouts — open a hangout and get a shareable link. */
export async function createHangout(request: Request, env: Env): Promise<Response> {
  const body = await readJson<{
    title?: string; hostName?: string; startDate?: string; days?: number;
    times?: string[]; durationMins?: number;
  }>(request);
  if (!body) return badRequest('expected a JSON body');

  const groupId = newId('rip');
  const timezone = env.DEFAULT_TIMEZONE || 'Australia/Sydney';

  const slots = generateGrid({
    startDate: body.startDate ?? new Date().toISOString().slice(0, 10),
    days: body.days ?? 10,
    times: body.times ?? ['12:00', '18:00', '19:30', '21:00'],
    durationMins: body.durationMins ?? 180,
    timeZone: timezone,
  });

  const pollId = newId('poll');
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO groups (id, kind, name, timezone) VALUES (?, 'ripple', ?, ?)`,
    ).bind(groupId, body.title ?? 'Hangout', timezone),
    env.DB.prepare(
      `INSERT INTO polls (id, group_id, kind, title, slots_json)
       VALUES (?, ?, 'hangout', ?, ?)`,
    ).bind(pollId, groupId, body.title ?? 'When are you free?', JSON.stringify(slots)),
  ]);

  return json({ hangoutId: groupId, pollId, sharePath: `/r/${pollId}` });
}

/**
 * POST /api/ripple/hangouts/:pollId/join — onboarding, in one submit.
 *
 * Name, suburb, budget, what they'd be up for, and when. Returns a token so
 * the same person can come back and change their answers from the same phone
 * without an account.
 */
export async function joinHangout(
  request: Request, env: Env, pollId: string,
): Promise<Response> {
  const body = await readJson<{
    token?: string; name: string; suburb: string; budgetAud: number;
    approvals: string[]; responses: Record<string, AvailabilityValue>;
  }>(request);
  if (!body?.name?.trim()) return badRequest('we need a name to put on the plan');
  if (!SUBURBS[body.suburb]) return badRequest('pick a suburb from the list');
  if (!Number.isFinite(body.budgetAud) || body.budgetAud < 0) return badRequest('budget must be a number');

  const poll = await getPoll(env, pollId);
  if (!poll) return notFound('that link has expired or never existed');
  if (poll.status !== 'open') return badRequest('this hangout is already locked in');

  // Returning visitor keeps their identity; a new one gets created.
  let memberId: string;
  let token = body.token ?? '';
  const existing = token ? await memberFromToken(env, token) : null;

  if (existing && existing.groupId === poll.group_id) {
    memberId = existing.memberId;
    await env.DB.prepare('UPDATE members SET name = ?, suburb = ? WHERE id = ?')
      .bind(body.name.trim(), body.suburb, memberId).run();
  } else {
    memberId = newId('mem');
    await env.DB.prepare(
      'INSERT INTO members (id, group_id, name, suburb) VALUES (?, ?, ?, ?)',
    ).bind(memberId, poll.group_id, body.name.trim(), body.suburb).run();
    token = await issueToken(env, memberId, poll.group_id);
  }

  const validSlots = new Set(slotsOf(poll).map((s) => s.id));
  const answers = Object.entries(body.responses ?? {})
    .filter(([slotId, v]) => validSlots.has(slotId) && ['yes', 'ifneed', 'no'].includes(v));

  const knownActivities = new Set([
    ...ACTIVITIES.map((a) => a.id),
    ...(await loadRippleEvents(env, poll.group_id)).map((a) => a.id),
  ]);
  const approvals = (body.approvals ?? []).filter((id) => knownActivities.has(id));

  await env.DB.batch([
    env.DB.prepare('DELETE FROM responses WHERE poll_id = ? AND member_id = ?')
      .bind(pollId, memberId),
    ...answers.map(([slotId, value]) => env.DB.prepare(
      'INSERT INTO responses (poll_id, member_id, slot_id, value) VALUES (?, ?, ?, ?)',
    ).bind(pollId, memberId, slotId, value)),
    env.DB.prepare(
      `INSERT INTO poll_preferences (poll_id, member_id, budget_aud, suburb, approvals_json)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(poll_id, member_id) DO UPDATE SET
         budget_aud = excluded.budget_aud, suburb = excluded.suburb,
         approvals_json = excluded.approvals_json, updated_at = datetime('now')`,
    ).bind(pollId, memberId, Math.round(body.budgetAud), body.suburb, JSON.stringify(approvals)),
  ]);

  return json({ ok: true, token, memberId });
}

/** Assemble HangoutMembers from stored preferences. */
async function loadHangoutMembers(
  env: Env, pollId: string, groupId: string,
): Promise<HangoutMember[]> {
  const { results } = await env.DB.prepare(
    `SELECT m.id, m.name, p.budget_aud, p.suburb, p.approvals_json
       FROM poll_preferences p JOIN members m ON m.id = p.member_id
      WHERE p.poll_id = ? AND m.group_id = ?`,
  ).bind(pollId, groupId).all<{
    id: string; name: string; budget_aud: number | null;
    suburb: string | null; approvals_json: string;
  }>();

  return (results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    suburb: r.suburb && SUBURBS[r.suburb] ? r.suburb : 'sydney-cbd',
    budgetAud: r.budget_aud ?? 50,
    approvals: JSON.parse(r.approvals_json || '[]'),
  }));
}

/** GET /api/ripple/hangouts/:pollId — live state while people are still joining. */
export async function getHangout(env: Env, pollId: string): Promise<Response> {
  const poll = await getPoll(env, pollId);
  if (!poll) return notFound('that link has expired or never existed');

  const group = await getGroup(env, poll.group_id);
  if (!group) return notFound();

  const [participants, responses, members, events, names] = await Promise.all([
    loadParticipants(env, poll.group_id),
    loadResponses(env, pollId),
    loadHangoutMembers(env, pollId, poll.group_id),
    loadRippleEvents(env, poll.group_id),
    loadMemberNames(env, poll.group_id),
  ]);

  const slots = slotsOf(poll);
  const timing = scoreSlots({
    slots, participants, responses,
    config: { ...DEFAULT_CONFIG, quorum: Math.min(3, Math.max(2, participants.length)), timezone: group.timezone },
  });

  const best = timing.ranked.find((r) => r.viable) ?? timing.ranked[0];
  const attending = best
    ? members.filter((m) => best.attendees.includes(m.id) || best.ifNeeded.includes(m.id))
    : [];

  const catalogue = mergeRippleEvents(events);
  const activityStandings = attending.length ? rankActivities(attending, catalogue) : [];

  return json({
    hangout: { id: poll.id, title: poll.title, status: poll.status, timezone: group.timezone },
    slots: slots.map((s) => ({ ...s, label: formatSlot(s, group.timezone) })),
    catalogue: catalogue.map((a) => ({
      id: a.id, label: a.label, emoji: a.emoji, estCostAud: a.estCostAud,
      category: a.category, rippleEvent: Boolean(a.rippleEvent),
    })),
    members: members.map((m) => ({ id: m.id, name: m.name, suburb: m.suburb })),
    names,
    joined: members.length,
    timing,
    leadingSlot: best ? { ...best.slot, label: formatSlot(best.slot, group.timezone) } : null,
    activityStandings: activityStandings.slice(0, 8),
  });
}

/**
 * POST /api/ripple/hangouts/:pollId/lock — arbitrate and produce the brief.
 *
 * Runs the whole chain: time -> who is coming -> what they want and can afford
 * -> where that is fair to get to -> which of those places the activity
 * actually exists in -> venues -> brief.
 */
export async function lockHangout(
  request: Request, env: Env, pollId: string,
): Promise<Response> {
  const poll = await getPoll(env, pollId);
  if (!poll) return notFound();

  const group = await getGroup(env, poll.group_id);
  if (!group) return notFound();

  const body = await readJson<{ slotId?: string }>(request) ?? {};

  const [participants, responses, members, events, names] = await Promise.all([
    loadParticipants(env, poll.group_id),
    loadResponses(env, pollId),
    loadHangoutMembers(env, pollId, poll.group_id),
    loadRippleEvents(env, poll.group_id),
    loadMemberNames(env, poll.group_id),
  ]);

  if (members.length === 0) return badRequest('nobody has joined yet');

  const slots = slotsOf(poll);
  const timing = scoreSlots({
    slots, participants, responses,
    config: {
      ...DEFAULT_CONFIG,
      quorum: Math.min(3, Math.max(2, participants.length)),
      timezone: group.timezone,
    },
  });

  const chosen = body.slotId
    ? timing.ranked.find((r) => r.slot.id === body.slotId)
    : timing.ranked.find((r) => r.viable);

  if (!chosen) {
    return json({
      locked: false,
      reason: timing.recommendation.rationale,
      timing,
    }, 409);
  }

  const attendeeIds = [...chosen.attendees, ...chosen.ifNeeded];
  const attending = members.filter((m) => attendeeIds.includes(m.id));
  if (attending.length === 0) return badRequest('nobody is free at that time');

  const catalogue = mergeRippleEvents(events);
  const ranked = rankActivities(attending, catalogue, DEFAULT_HANGOUT_CONFIG);
  const itinerary = buildItinerary(ranked, attending, DEFAULT_HANGOUT_CONFIG);

  // Travel-fair hubs first, then let venue density re-order them.
  const hubs = rankHubs(attending, 5);
  const primaryQuery = itinerary.stops[0]?.activity.placesQuery ?? 'bar';
  const budgetCeiling = itinerary.budgetCeilingAud;

  const reranked = await rerankHubsByVenues(hubs, primaryQuery, {
    apiKey: env.GOOGLE_PLACES_KEY,
    budgetAud: budgetCeiling,
    maxResults: 5,
  });
  const hub = reranked[0]?.hub ?? hubs[0];

  // One venue per stop, near the settled hub.
  const venues: Venue[] = [];
  for (const stop of itinerary.stops) {
    const found = await searchVenues({
      query: stop.activity.placesQuery || stop.activity.label,
      center: hub.location,
      apiKey: env.GOOGLE_PLACES_KEY,
      budgetAud: stop.estCostAud,
      maxResults: 3,
    });
    venues.push(found[0]);
  }

  const brief = buildBrief({
    slot: chosen.slot, itinerary, hub, venues, names,
    attendeeIds: attending.map((m) => m.id),
    absentIds: members.filter((m) => !attendeeIds.includes(m.id)).map((m) => m.id),
    timezone: group.timezone,
  });

  const blurb = await writeBlurb(brief, { apiKey: env.ANTHROPIC_API_KEY });
  if (blurb) brief.blurb = blurb;

  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO decisions (id, poll_id, slot_id, action, rationale, brief_json)
       VALUES (?, ?, ?, 'lock', ?, ?)`,
    ).bind(
      newId('dec'), pollId, chosen.slot.id,
      `${attending.length} coming, ~$${itinerary.totalCostAud} each, ${hub.name}`,
      JSON.stringify(brief),
    ),
    env.DB.prepare("UPDATE polls SET status = 'closed' WHERE id = ?").bind(pollId),
  ]);

  return json({
    locked: true,
    brief,
    alternatives: {
      times: timing.ranked.slice(0, 4).map((r) => ({
        slotId: r.slot.id, label: formatSlot(r.slot, group.timezone),
        heads: r.attendees.length + r.ifNeeded.length, viable: r.viable,
      })),
      activities: ranked.slice(0, 6),
      hubs: reranked.slice(0, 4).map((h) => ({
        name: (h.hub as typeof hub).name, density: h.density,
        meanMinutes: (h.hub as typeof hub).meanMinutes,
        adjustedCost: h.adjustedCost,
      })),
    },
  });
}
