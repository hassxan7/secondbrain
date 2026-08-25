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
import {
  type Ballot, type BallotOrigin, addSuggestion, recordAnswers,
  pendingAsksFor, outstandingAsks, rankBallots,
} from './suggestions.ts';
import {
  parseEventUrl, fetchEventMeta, toActivity as linkToActivity,
  toDirectorySubmission, platformLabel,
} from './event-links.ts';

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
    /** Activity ids to start with. Omit for the whole standing catalogue. */
    options?: string[];
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

  // Seed the option list up front. Without this there are no ballots to answer
  // against, and every submitted answer matches nothing and is silently
  // discarded — the plan looks like it is working and records nothing.
  const events = await loadRippleEvents(env, groupId);
  const starting = mergeRippleEvents(events);
  const chosen = body.options?.length
    ? starting.filter((a) => body.options!.includes(a.id))
    : starting;
  const seedList = chosen.length > 0 ? chosen : starting;
  const now = new Date().toISOString();

  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO groups (id, kind, name, timezone) VALUES (?, 'ripple', ?, ?)`,
    ).bind(groupId, body.title ?? 'Hangout', timezone),
    env.DB.prepare(
      `INSERT INTO polls (id, group_id, kind, title, slots_json)
       VALUES (?, ?, 'hangout', ?, ?)`,
    ).bind(pollId, groupId, body.title ?? 'When are you free?', JSON.stringify(slots)),
    ...seedList.map((activity) => env.DB.prepare(
      `INSERT INTO plan_options (poll_id, activity_id, activity_json, origin_json, added_at)
       VALUES (?, ?, ?, '{"kind":"catalogue"}', ?)`,
    ).bind(pollId, activity.id, JSON.stringify(activity), now)),
  ]);

  return json({
    hangoutId: groupId, pollId, sharePath: `/r/${pollId}`, options: seedList.length,
  });
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

  // Prefer the ballot record when a plan has one: it knows who has actually
  // seen each option, and an option nobody has seen is not a decision the group
  // has made. Fall back to raw approvals for plans created before options were
  // tracked per person.
  const stored = await loadBallots(env, pollId);
  let ranked;
  let waiting: string[] = [];

  if (stored.ballots.length > 0) {
    const outcomes = rankBallots(stored.ballots, stored.catalogue, attending);
    waiting = outcomes
      .filter((o) => !o.eligible && o.approvals.length > 0)
      .map((o) => o.activity.label);
    ranked = outcomes.filter((o) => o.eligible);
  } else {
    const catalogueList = mergeRippleEvents(events);
    ranked = rankActivities(attending, catalogueList, DEFAULT_HANGOUT_CONFIG);
  }

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
    // Options with real support that nobody could pick yet, so the organiser
    // can see what a nudge would unlock rather than wondering where it went.
    heldBack: waiting,
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


/* ── Options, suggestions and links ───────────────────────────────────────── */

/** Load the ballot set for a plan: one option per row, answers folded in. */
async function loadBallots(env: Env, pollId: string): Promise<{
  ballots: Ballot[]; catalogue: Map<string, Activity>;
}> {
  const [optionRows, answerRows] = await Promise.all([
    env.DB.prepare(
      'SELECT activity_id, activity_json, origin_json, added_at FROM plan_options WHERE poll_id = ?',
    ).bind(pollId).all<{
      activity_id: string; activity_json: string; origin_json: string; added_at: string;
    }>(),
    env.DB.prepare(
      'SELECT activity_id, member_id, approved FROM option_answers WHERE poll_id = ?',
    ).bind(pollId).all<{ activity_id: string; member_id: string; approved: number }>(),
  ]);

  const seen = new Map<string, string[]>();
  const approved = new Map<string, string[]>();
  const push = (map: Map<string, string[]>, key: string, value: string) => {
    const list = map.get(key);
    if (list) list.push(value);
    else map.set(key, [value]);
  };
  for (const row of answerRows.results ?? []) {
    push(seen, row.activity_id, row.member_id);
    if (row.approved === 1) push(approved, row.activity_id, row.member_id);
  }

  const catalogue = new Map<string, Activity>();
  const ballots: Ballot[] = [];
  for (const row of optionRows.results ?? []) {
    let activity: Activity;
    let origin: BallotOrigin;
    try {
      activity = JSON.parse(row.activity_json) as Activity;
      origin = JSON.parse(row.origin_json) as BallotOrigin;
    } catch {
      continue; // A malformed row must not take the whole plan down.
    }
    catalogue.set(activity.id, activity);
    ballots.push({
      activityId: row.activity_id,
      seen: seen.get(row.activity_id) ?? [],
      approvals: approved.get(row.activity_id) ?? [],
      origin,
      addedAt: row.added_at,
    });
  }

  return { ballots, catalogue };
}

/** Persist a ballot set. Upserts only — nothing is ever silently dropped. */
async function saveBallots(
  env: Env, pollId: string, ballots: Ballot[], catalogue: Map<string, Activity>,
): Promise<void> {
  const statements: D1PreparedStatement[] = [];

  for (const ballot of ballots) {
    const activity = catalogue.get(ballot.activityId);
    if (!activity) continue;

    statements.push(env.DB.prepare(
      `INSERT INTO plan_options (poll_id, activity_id, activity_json, origin_json, added_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(poll_id, activity_id) DO UPDATE SET
         activity_json = excluded.activity_json`,
    ).bind(
      pollId, ballot.activityId, JSON.stringify(activity),
      JSON.stringify(ballot.origin), ballot.addedAt,
    ));

    for (const memberId of ballot.seen) {
      statements.push(env.DB.prepare(
        `INSERT INTO option_answers (poll_id, activity_id, member_id, approved)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(poll_id, activity_id, member_id) DO UPDATE SET
           approved = excluded.approved, answered_at = datetime('now')`,
      ).bind(pollId, ballot.activityId, memberId, ballot.approvals.includes(memberId) ? 1 : 0));
    }
  }

  if (statements.length) await env.DB.batch(statements);
}

/**
 * GET /api/ripple/hangouts/:pollId/asks — the delta for one person.
 *
 * Empty for someone who has answered everything, and empty for someone who has
 * not started (they get the whole form). Non-empty means: here are the options
 * added since you last looked, and nothing else.
 */
export async function getAsks(request: Request, env: Env, pollId: string): Promise<Response> {
  const token = new URL(request.url).searchParams.get('token');
  if (!token) return badRequest('missing token');

  const identity = await memberFromToken(env, token);
  if (!identity) return unauthorized();

  const { ballots, catalogue } = await loadBallots(env, pollId);
  const asks = pendingAsksFor(ballots, identity.memberId, catalogue);

  return json({
    asks: asks.map((a) => ({
      id: a.id, label: a.label, emoji: a.emoji, estCostAud: a.estCostAud,
      origin: ballots.find((b) => b.activityId === a.id)?.origin,
    })),
    count: asks.length,
  });
}

/** POST /api/ripple/hangouts/:pollId/options — record one person's pass. */
export async function submitOptions(
  request: Request, env: Env, pollId: string,
): Promise<Response> {
  const body = await readJson<{ token: string; shown: string[]; approved: string[] }>(request);
  if (!body?.token || !Array.isArray(body.shown)) return badRequest('need token and shown[]');

  const identity = await memberFromToken(env, body.token);
  if (!identity) return unauthorized();

  const poll = await getPoll(env, pollId);
  if (!poll || poll.group_id !== identity.groupId) return notFound();
  if (poll.status !== 'open') return badRequest('this plan is locked');

  const { ballots, catalogue } = await loadBallots(env, pollId);
  if (ballots.length === 0) return badRequest('this plan has no options yet');

  const updated = recordAnswers(
    ballots, identity.memberId, body.shown, body.approved ?? []);
  await saveBallots(env, pollId, updated, catalogue);

  await env.DB.prepare(
    `UPDATE invites SET responded_at = COALESCE(responded_at, datetime('now'))
      WHERE group_id = ? AND member_id = ?`,
  ).bind(poll.group_id, identity.memberId).run();

  // Count what actually landed. Echoing back the request's own length reports
  // success for ids that matched no option and were dropped.
  const recorded = updated.filter((b) => b.seen.includes(identity.memberId)).length;
  const ignored = body.shown.filter((id) => !catalogue.has(id));

  return json({ ok: true, recorded, ignored });
}

/**
 * POST /api/ripple/hangouts/:pollId/suggest — add an option mid-plan.
 *
 * Returns who now has to be asked, which is exactly the nudge list.
 */
export async function suggestOption(
  request: Request, env: Env, pollId: string,
): Promise<Response> {
  const body = await readJson<{
    token: string; label: string; estCostAud?: number; category?: string; emoji?: string;
  }>(request);
  if (!body?.token || !body.label?.trim()) return badRequest('need token and a label');

  const identity = await memberFromToken(env, body.token);
  if (!identity) return unauthorized();

  const poll = await getPoll(env, pollId);
  if (!poll || poll.group_id !== identity.groupId) return notFound();
  if (poll.status !== 'open') return badRequest('this plan is locked');

  const { ballots, catalogue } = await loadBallots(env, pollId);
  const label = body.label.trim().slice(0, 60);

  // Typing the name of an option already on the list must register as an
  // approval, not create a rival ballot that splits the vote.
  const existing = [...catalogue.values()]
    .find((a) => a.label.toLowerCase() === label.toLowerCase());

  const activity: Activity = existing ?? {
    id: `sug-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 32)}`,
    label,
    emoji: body.emoji?.slice(0, 4) || '✨',
    estCostAud: Math.max(0, Math.round(body.estCostAud ?? 0)),
    durationMins: 90,
    category: (body.category as Activity['category']) ?? 'culture',
    placesQuery: label,
    timeOfDay: 'any',
    sequenceRank: 2,
    tags: ['suggested'],
  };

  catalogue.set(activity.id, activity);
  const updated = addSuggestion(ballots, activity, identity.memberId, new Date().toISOString());
  await saveBallots(env, pollId, updated, catalogue);

  const ballot = updated.find((b) => b.activityId === activity.id)!;
  const pending = outstandingAsks(updated, catalogue)
    .filter((row) => row.activities.some((a) => a.id === activity.id))
    .map((row) => row.memberId);

  return json({
    ok: true,
    activityId: activity.id,
    deduped: Boolean(existing),
    seen: ballot.seen.length,
    pending,
  });
}

/**
 * POST /api/ripple/hangouts/:pollId/link — paste an existing event in.
 *
 * The URL is parsed before anything is fetched. That ordering is the SSRF
 * guard: only an allow-listed public event host ever gets a request.
 */
export async function addLinkOption(
  request: Request, env: Env, pollId: string,
): Promise<Response> {
  const body = await readJson<{ token: string; url: string; estCostAud?: number }>(request);
  if (!body?.token || !body.url) return badRequest('need token and url');

  const identity = await memberFromToken(env, body.token);
  if (!identity) return unauthorized();

  const parsed = parseEventUrl(body.url);
  if (!parsed) {
    return badRequest('that is not a Luma, Partiful, Eventbrite, Humanitix or Meetup link');
  }

  const poll = await getPoll(env, pollId);
  if (!poll || poll.group_id !== identity.groupId) return notFound();
  if (poll.status !== 'open') return badRequest('this plan is locked');

  const { ballots, catalogue } = await loadBallots(env, pollId);
  const meta = await fetchEventMeta(parsed);

  // An unreadable price falls back to the group's tightest budget rather than
  // to zero: a ticketed event that looks free quietly blows the ceiling.
  const prefs = await env.DB.prepare(
    'SELECT MIN(budget_aud) AS floor FROM poll_preferences WHERE poll_id = ?',
  ).bind(pollId).first<{ floor: number | null }>();
  const fallback = body.estCostAud ?? prefs?.floor ?? 40;

  const activity = linkToActivity(parsed, meta, fallback);
  catalogue.set(activity.id, activity);

  const origin: BallotOrigin = {
    kind: 'link', by: identity.memberId,
    url: parsed.canonicalUrl, platform: parsed.platform,
  };
  const updated = addSuggestion(
    ballots, activity, identity.memberId, new Date().toISOString(), origin);
  await saveBallots(env, pollId, updated, catalogue);

  // Feed Ripple's own directory, held for review rather than published.
  const submission = toDirectorySubmission(parsed, meta, identity.memberId);
  await env.DB.prepare(
    `INSERT INTO directory_submissions
       (id, platform, source_id, canonical_url, title, image_url, submitted_by, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pending_review')
     ON CONFLICT(platform, source_id) DO NOTHING`,
  ).bind(
    newId('sub'), submission.platform, submission.sourceId, submission.canonicalUrl,
    submission.title, submission.imageUrl ?? null, identity.memberId,
  ).run();

  const pending = outstandingAsks(updated, catalogue)
    .filter((row) => row.activities.some((a) => a.id === activity.id))
    .map((row) => row.memberId);

  return json({
    ok: true,
    activityId: activity.id,
    platform: platformLabel(parsed.platform),
    title: activity.label,
    pending,
  });
}

/**
 * POST /api/ripple/hangouts/:pollId/nudge — chase whoever is holding it up.
 *
 * Two different kinds of missing person, and they get different messages:
 * someone who never started, and someone who answered but has not seen an
 * option added since. Rate-limited per person so a plan cannot be used to
 * spam somebody.
 */
export async function nudge(request: Request, env: Env, pollId: string): Promise<Response> {
  const body = await readJson<{ token: string; minHoursBetween?: number }>(request);
  if (!body?.token) return badRequest('missing token');

  const identity = await memberFromToken(env, body.token);
  if (!identity) return unauthorized();

  const poll = await getPoll(env, pollId);
  if (!poll || poll.group_id !== identity.groupId) return notFound();

  const minHours = Math.max(1, body.minHoursBetween ?? 12);
  const { ballots, catalogue } = await loadBallots(env, pollId);
  const [names, inviteRows] = await Promise.all([
    loadMemberNames(env, poll.group_id),
    env.DB.prepare(
      `SELECT member_id, channel, contact, last_nudge_at, responded_at
         FROM invites WHERE group_id = ?`,
    ).bind(poll.group_id).all<{
      member_id: string; channel: string; contact: string;
      last_nudge_at: string | null; responded_at: string | null;
    }>(),
  ]);

  const asks = new Map(outstandingAsks(ballots, catalogue).map((r) => [r.memberId, r.activities]));
  const started = new Set(ballots.flatMap((b) => b.seen));
  const cutoff = Date.now() - minHours * 3_600_000;

  const sent: Array<{ memberId: string; channel: string; reason: string }> = [];
  const skipped: Array<{ memberId: string; why: string }> = [];
  const writes: D1PreparedStatement[] = [];

  for (const invite of inviteRows.results ?? []) {
    const name = names[invite.member_id] ?? 'there';
    const pendingFor = asks.get(invite.member_id) ?? [];
    const hasStarted = started.has(invite.member_id);

    if (hasStarted && pendingFor.length === 0) {
      skipped.push({ memberId: invite.member_id, why: 'already answered everything' });
      continue;
    }
    if (invite.last_nudge_at && Date.parse(invite.last_nudge_at) > cutoff) {
      skipped.push({ memberId: invite.member_id, why: `nudged within ${minHours}h` });
      continue;
    }

    const link = `${new URL(request.url).origin}/r/${pollId}`;
    const message = hasStarted
      ? `${name} — one more thing on the plan: `
        + `${pendingFor.map((a) => a.label).join(', ')}. Ten seconds: ${link}`
      : `${name} — still need your times for the plan. `
        + `Takes 30 seconds, no app needed: ${link}`;

    const channel = invite.channel === 'email' ? 'email' : 'whatsapp';
    writes.push(env.DB.prepare(
      'INSERT INTO outbox (id, group_id, channel, target, body) VALUES (?, ?, ?, ?, ?)',
    ).bind(newId('out'), poll.group_id, channel, invite.contact, message));
    writes.push(env.DB.prepare(
      `UPDATE invites SET nudges = nudges + 1, last_nudge_at = datetime('now')
        WHERE group_id = ? AND member_id = ?`,
    ).bind(poll.group_id, invite.member_id));

    sent.push({
      memberId: invite.member_id,
      channel,
      reason: hasStarted ? 'has unseen options' : 'never started',
    });
  }

  if (writes.length) await env.DB.batch(writes);
  return json({ sent, skipped });
}
