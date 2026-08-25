/**
 * HTTP surface for the house: polls, the standing time, chores and issues.
 *
 * Handlers stay thin — read rows, call the engine, write rows, queue a message.
 * Nothing in here decides anything; every decision comes from src/core or from
 * accountability.ts, so the rules can be tested without a database.
 */

import {
  type Env, getGroup, getPoll, slotsOf, loadParticipants, loadResponses,
  loadMemberNames, memberFromToken, enqueue, newId, json, badRequest, notFound,
  unauthorized, weekOf, settingsOf,
} from '../db.ts';
import { scoreSlots } from '../core/arbitrage.ts';
import { recommendAnchor, evaluateRefix, patternLabel, type WeeklyPattern } from '../core/anchor.ts';
import { generateGrid, formatSlot } from '../core/slots.ts';
import { DEFAULT_CONFIG, type ArbitrageConfig, type AvailabilityValue } from '../core/types.ts';
import {
  settleWeek, resolveDisputes, resolveIssue, offenderTable, buildAgenda,
  formatMoney, DEFAULT_CHORE_CONFIG,
  type ChoreClaim, type ChoreTask, type IssueResponse, type Dispute,
} from './accountability.ts';

async function readJson<T>(request: Request): Promise<T | null> {
  try { return await request.json() as T; } catch { return null; }
}

/** GET /api/g/:groupId — everything the house dashboard needs in one call. */
export async function getGroupState(env: Env, groupId: string): Promise<Response> {
  const group = await getGroup(env, groupId);
  if (!group) return notFound('no such group');

  const [participants, polls, settlements, issues] = await Promise.all([
    loadParticipants(env, groupId),
    env.DB.prepare(
      `SELECT id, kind, title, status, closes_at, anchor_slot_id
         FROM polls WHERE group_id = ? ORDER BY created_at DESC LIMIT 10`,
    ).bind(groupId).all(),
    env.DB.prepare(
      `SELECT * FROM settlements WHERE group_id = ? AND state IN ('pending','disputed','upheld')
        ORDER BY week_of DESC LIMIT 40`,
    ).bind(groupId).all(),
    env.DB.prepare(
      `SELECT * FROM issues WHERE group_id = ? AND status = 'open' ORDER BY created_at DESC`,
    ).bind(groupId).all(),
  ]);

  const settings = settingsOf(group, DEFAULT_CONFIG);

  return json({
    group: { id: group.id, name: group.name, kind: group.kind, timezone: group.timezone },
    anchor: settings.anchorSlotId ?? null,
    anchorLabel: settings.anchorPattern
      ? patternLabel(settings.anchorPattern as WeeklyPattern) : null,
    members: participants,
    polls: polls.results ?? [],
    openFines: settlements.results ?? [],
    openIssues: issues.results ?? [],
  });
}

/**
 * POST /api/g/:groupId/polls — open a poll.
 *
 * A fortnight of candidate slots by default, because the same responses then
 * answer both "when this week" and "what should the standing time be".
 */
export async function createPoll(request: Request, env: Env, groupId: string): Promise<Response> {
  const group = await getGroup(env, groupId);
  if (!group) return notFound('no such group');

  const body = await readJson<{
    kind?: 'anchor' | 'refix'; title?: string; startDate?: string; days?: number;
    times?: string[]; weekdays?: number[]; durationMins?: number; closesAt?: string;
  }>(request);
  if (!body) return badRequest('expected a JSON body');

  const slots = generateGrid({
    startDate: body.startDate ?? new Date().toISOString().slice(0, 10),
    days: body.days ?? 14,
    times: body.times ?? ['18:30', '19:30', '20:30'],
    durationMins: body.durationMins ?? 60,
    timeZone: group.timezone,
    weekdays: body.weekdays,
  });
  if (slots.length === 0) return badRequest('that grid produced no slots');

  const settings = settingsOf(group, DEFAULT_CONFIG);
  const pollId = newId('poll');

  await env.DB.prepare(
    `INSERT INTO polls (id, group_id, kind, title, slots_json, anchor_slot_id, closes_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    pollId, groupId, body.kind ?? 'anchor',
    body.title ?? 'When can you do?', JSON.stringify(slots),
    settings.anchorSlotId ?? null, body.closesAt ?? null,
  ).run();

  return json({ pollId, slots: slots.length });
}

/** GET /api/polls/:pollId — poll state plus live standings. */
export async function getPollState(env: Env, pollId: string): Promise<Response> {
  const poll = await getPoll(env, pollId);
  if (!poll) return notFound('no such poll');

  const group = await getGroup(env, poll.group_id);
  if (!group) return notFound('no such group');

  const [participants, responses, names] = await Promise.all([
    loadParticipants(env, poll.group_id),
    loadResponses(env, pollId),
    loadMemberNames(env, poll.group_id),
  ]);

  const config: Partial<ArbitrageConfig> = {
    ...settingsOf(group, DEFAULT_CONFIG),
    timezone: group.timezone,
    anchorSlotId: poll.anchor_slot_id ?? undefined,
  };

  const slots = slotsOf(poll);
  const result = scoreSlots({ slots, participants, responses, config });
  const anchor = recommendAnchor({ slots, participants, responses, config });

  return json({
    poll: {
      id: poll.id, kind: poll.kind, title: poll.title,
      status: poll.status, closesAt: poll.closes_at,
    },
    timezone: group.timezone,
    slots: slots.map((s) => ({ ...s, label: formatSlot(s, group.timezone) })),
    members: participants.map((p) => ({
      id: p.id, name: p.name,
      answered: Object.keys(responses[p.id] ?? {}).length > 0,
    })),
    names,
    responses,
    thisRound: result,
    standingTime: anchor,
  });
}

/** POST /api/polls/:pollId/respond — one person's availability. */
export async function submitResponse(
  request: Request, env: Env, pollId: string,
): Promise<Response> {
  const body = await readJson<{
    token: string; responses: Record<string, AvailabilityValue>;
  }>(request);
  if (!body?.token) return badRequest('missing token');

  const identity = await memberFromToken(env, body.token);
  if (!identity) return unauthorized();

  const poll = await getPoll(env, pollId);
  if (!poll) return notFound('no such poll');
  if (poll.group_id !== identity.groupId) return unauthorized('that link is for another group');
  if (poll.status !== 'open') return badRequest('this poll is closed');

  const validSlots = new Set(slotsOf(poll).map((s) => s.id));
  const entries = Object.entries(body.responses ?? {})
    .filter(([slotId, value]) =>
      validSlots.has(slotId) && ['yes', 'ifneed', 'no'].includes(value));

  if (entries.length === 0) return badRequest('no valid answers in that submission');

  // Replace this member's answers wholesale so unticking a slot actually clears it.
  const statements = [
    env.DB.prepare('DELETE FROM responses WHERE poll_id = ? AND member_id = ?')
      .bind(pollId, identity.memberId),
    ...entries.map(([slotId, value]) =>
      env.DB.prepare(
        `INSERT INTO responses (poll_id, member_id, slot_id, value)
         VALUES (?, ?, ?, ?)`,
      ).bind(pollId, identity.memberId, slotId, value)),
  ];
  await env.DB.batch(statements);

  return json({ ok: true, recorded: entries.length });
}

/** POST /api/polls/:pollId/close — run the engine and record the decision. */
export async function closePoll(env: Env, pollId: string): Promise<Response> {
  const poll = await getPoll(env, pollId);
  if (!poll) return notFound('no such poll');

  const group = await getGroup(env, poll.group_id);
  if (!group) return notFound('no such group');

  const [participants, responses] = await Promise.all([
    loadParticipants(env, poll.group_id),
    loadResponses(env, pollId),
  ]);

  const config: Partial<ArbitrageConfig> = {
    ...settingsOf(group, DEFAULT_CONFIG),
    timezone: group.timezone,
    anchorSlotId: poll.anchor_slot_id ?? undefined,
  };
  const slots = slotsOf(poll);
  const result = scoreSlots({ slots, participants, responses, config });
  const anchorRec = recommendAnchor({ slots, participants, responses, config });

  const decisionId = newId('dec');
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO decisions (id, poll_id, slot_id, action, rationale)
       VALUES (?, ?, ?, ?, ?)`,
    ).bind(
      decisionId, pollId, result.recommendation.slotId,
      result.recommendation.action, result.recommendation.rationale,
    ),
    env.DB.prepare("UPDATE polls SET status = 'closed' WHERE id = ?").bind(pollId),
  ]);

  const chosen = slots.find((s) => s.id === result.recommendation.slotId);
  const message = chosen
    ? `🗓️ Meeting locked: ${formatSlot(chosen, group.timezone)}\n${result.recommendation.rationale}`
    : `⚠️ No time cleared quorum. ${result.recommendation.rationale}`;
  await enqueue(env, poll.group_id, 'whatsapp', 'group', message);

  return json({ decisionId, thisRound: result, standingTime: anchorRec });
}

/**
 * POST /api/g/:groupId/refix — "I can't make the fixed time".
 *
 * The asymmetry lives here: a declared recurring clash re-picks the standing
 * time for free, an ad-hoc excuse spends from a small budget, and once that
 * budget is gone the meeting simply goes ahead.
 */
export async function requestRefix(
  request: Request, env: Env, groupId: string,
): Promise<Response> {
  const body = await readJson<{
    token: string; reason: string; standingConflict?: boolean;
    conflict?: { weekday: number; startMin: number; endMin: number; label: string };
  }>(request);
  if (!body?.token) return badRequest('missing token');

  const identity = await memberFromToken(env, body.token);
  if (!identity || identity.groupId !== groupId) return unauthorized();

  const participants = await loadParticipants(env, groupId);
  const me = participants.find((p) => p.id === identity.memberId);
  if (!me) return notFound('member not in this group');

  const period = weekOf();
  const existing = await env.DB.prepare(
    'SELECT used, budget FROM veto_state WHERE member_id = ? AND period_start = ?',
  ).bind(identity.memberId, period).first<{ used: number; budget: number }>();

  const state = {
    participantId: identity.memberId,
    used: existing?.used ?? 0,
    budget: existing?.budget ?? 2,
    periodStart: period,
  };

  const decision = evaluateRefix(
    { participantId: identity.memberId, reason: body.reason ?? '', standingConflict: body.standingConflict },
    state, me,
  );

  const writes: D1PreparedStatement[] = [];

  if (decision.consumedToken) {
    writes.push(env.DB.prepare(
      `INSERT INTO veto_state (member_id, period_start, used, budget) VALUES (?, ?, 1, ?)
       ON CONFLICT(member_id, period_start) DO UPDATE SET used = used + 1`,
    ).bind(identity.memberId, period, state.budget));
  }

  // A declared recurring clash is recorded permanently, so every future poll
  // routes around it without anyone having to remember.
  if (body.standingConflict && body.conflict) {
    writes.push(env.DB.prepare(
      `INSERT INTO standing_conflicts (id, member_id, weekday, start_min, end_min, label)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).bind(
      newId('sc'), identity.memberId, body.conflict.weekday,
      body.conflict.startMin, body.conflict.endMin, body.conflict.label,
    ));
  }

  if (writes.length) await env.DB.batch(writes);

  const verb = decision.outcome === 'proceed-without' ? '🚫' : '🔁';
  await enqueue(env, groupId, 'whatsapp', 'group',
    `${verb} ${me.name}: ${body.reason || 'can’t make the fixed time'}\n${decision.rationale}`);

  return json({ decision });
}

/* ── Chores ───────────────────────────────────────────────────────────────── */

async function choreConfig(env: Env, groupId: string) {
  const { results } = await env.DB.prepare(
    'SELECT id, label FROM chore_tasks WHERE group_id = ? AND is_active = 1',
  ).bind(groupId).all<ChoreTask>();
  return { ...DEFAULT_CHORE_CONFIG, tasks: results ?? [] };
}

async function loadClaims(env: Env, groupId: string, week: string): Promise<ChoreClaim[]> {
  const { results } = await env.DB.prepare(
    'SELECT * FROM chore_claims WHERE group_id = ? AND week_of = ?',
  ).bind(groupId, week).all<{
    member_id: string; task_id: string; week_of: string;
    claimed_at: string; challenged_by_json: string;
  }>();

  return (results ?? []).map((r) => ({
    participantId: r.member_id,
    taskId: r.task_id,
    weekOf: r.week_of,
    claimedAt: r.claimed_at,
    challengedBy: JSON.parse(r.challenged_by_json || '[]'),
  }));
}

/** GET /api/g/:groupId/chores?week=YYYY-MM-DD — the board, live. */
export async function getChoreBoard(
  env: Env, groupId: string, week: string,
): Promise<Response> {
  const [config, claims, names] = await Promise.all([
    choreConfig(env, groupId),
    loadClaims(env, groupId, week),
    loadMemberNames(env, groupId),
  ]);

  const settlements = settleWeek({
    weekOf: week, participantIds: Object.keys(names), claims, config,
  });

  return json({
    weekOf: week,
    tasks: config.tasks,
    required: config.tasksRequired,
    finePerTask: formatMoney(config.finePerMissedTaskCents),
    claims,
    names,
    projected: settlements,
  });
}

/** POST /api/g/:groupId/chores/claim — tick a task off. */
export async function claimChore(request: Request, env: Env, groupId: string): Promise<Response> {
  const body = await readJson<{ token: string; taskId: string; weekOf?: string }>(request);
  if (!body?.token || !body.taskId) return badRequest('need token and taskId');

  const identity = await memberFromToken(env, body.token);
  if (!identity || identity.groupId !== groupId) return unauthorized();

  const week = body.weekOf ?? weekOf();
  const task = await env.DB.prepare(
    'SELECT id FROM chore_tasks WHERE id = ? AND group_id = ? AND is_active = 1',
  ).bind(body.taskId, groupId).first();
  if (!task) return badRequest('no such task on this board');

  await env.DB.prepare(
    `INSERT INTO chore_claims (id, group_id, member_id, task_id, week_of)
     VALUES (?, ?, ?, ?, ?)`,
  ).bind(newId('claim'), groupId, identity.memberId, body.taskId, week).run();

  return json({ ok: true, weekOf: week });
}

/**
 * POST /api/g/:groupId/chores/challenge — "that wasn't actually done".
 *
 * Appended rather than replaced, and the challenge sticks to the task, so
 * re-ticking the box cannot launder it away.
 */
export async function challengeChore(
  request: Request, env: Env, groupId: string,
): Promise<Response> {
  const body = await readJson<{ token: string; memberId: string; taskId: string; weekOf?: string }>(request);
  if (!body?.token) return badRequest('missing token');

  const identity = await memberFromToken(env, body.token);
  if (!identity || identity.groupId !== groupId) return unauthorized();
  if (identity.memberId === body.memberId) return badRequest('you cannot challenge your own claim');

  const week = body.weekOf ?? weekOf();
  const rows = await env.DB.prepare(
    `SELECT id, challenged_by_json FROM chore_claims
      WHERE group_id = ? AND member_id = ? AND task_id = ? AND week_of = ?`,
  ).bind(groupId, body.memberId, body.taskId, week).all<{ id: string; challenged_by_json: string }>();

  if ((rows.results ?? []).length === 0) return notFound('no such claim');

  await env.DB.batch((rows.results ?? []).map((row) => {
    const current: string[] = JSON.parse(row.challenged_by_json || '[]');
    if (!current.includes(identity.memberId)) current.push(identity.memberId);
    return env.DB.prepare('UPDATE chore_claims SET challenged_by_json = ? WHERE id = ?')
      .bind(JSON.stringify(current), row.id);
  }));

  return json({ ok: true });
}

/**
 * POST /api/g/:groupId/week/settle — close the week.
 *
 * Fines are computed from the board and upheld unless contested *by someone
 * who was at the meeting*. Nobody has to accuse anyone.
 */
export async function settleWeekRoute(
  request: Request, env: Env, groupId: string,
): Promise<Response> {
  const body = await readJson<{ weekOf?: string; presentAtMeeting?: string[] }>(request);
  const week = body?.weekOf ?? weekOf();

  const [config, claims, names, disputeRows] = await Promise.all([
    choreConfig(env, groupId),
    loadClaims(env, groupId, week),
    loadMemberNames(env, groupId),
    env.DB.prepare('SELECT * FROM disputes WHERE group_id = ? AND week_of = ?')
      .bind(groupId, week).all<{ member_id: string; week_of: string; argument: string; raised_at: string }>(),
  ]);

  const present = body?.presentAtMeeting ?? (await env.DB.prepare(
    'SELECT member_id FROM attendance WHERE group_id = ? AND meeting_date = ? AND present = 1',
  ).bind(groupId, week).all<{ member_id: string }>()).results?.map((r) => r.member_id) ?? [];

  const disputes: Dispute[] = (disputeRows.results ?? []).map((d) => ({
    participantId: d.member_id, weekOf: d.week_of, argument: d.argument, raisedAt: d.raised_at,
  }));

  const settlements = settleWeek({
    weekOf: week, participantIds: Object.keys(names), claims, config,
  });
  const outcomes = resolveDisputes({ settlements, disputes, presentAtMeeting: present });

  await env.DB.batch(outcomes.map((o) => env.DB.prepare(
    `INSERT INTO settlements
       (id, group_id, member_id, week_of, completed, challenged, shortfall, fine_cents, state, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(group_id, member_id, week_of) DO UPDATE SET
       completed = excluded.completed, challenged = excluded.challenged,
       shortfall = excluded.shortfall, fine_cents = excluded.fine_cents,
       state = excluded.state, note = excluded.note, updated_at = datetime('now')`,
  ).bind(
    newId('stl'), groupId, o.participantId, week, o.completed, o.challenged,
    o.shortfall, o.fineCents, o.state, `${o.note} ${o.outcomeNote}`.trim(),
  )));

  const owing = outcomes.filter((o) => o.state === 'upheld' && o.fineCents > 0);
  if (owing.length) {
    await enqueue(env, groupId, 'whatsapp', 'group',
      `📋 Week of ${week} closed.\n`
      + owing.map((o) => `${names[o.participantId] ?? o.participantId}: ${formatMoney(o.fineCents)} — ${o.note}`).join('\n')
      + `\n\nUndisputed fines stand. To contest one, be at the meeting.`);
  }

  return json({ weekOf: week, outcomes });
}

/** GET /api/g/:groupId/agenda — what the meeting is actually for. */
export async function getAgenda(env: Env, groupId: string): Promise<Response> {
  const week = weekOf();
  const [names, settlementRows, issueRows, attendanceRows] = await Promise.all([
    loadMemberNames(env, groupId),
    env.DB.prepare(
      `SELECT * FROM settlements WHERE group_id = ? AND state IN ('upheld','disputed','pending')
        ORDER BY week_of DESC LIMIT 40`,
    ).bind(groupId).all<any>(),
    env.DB.prepare('SELECT outcome_json FROM issues WHERE group_id = ? AND outcome_json IS NOT NULL LIMIT 50')
      .bind(groupId).all<{ outcome_json: string }>(),
    env.DB.prepare(
      `SELECT member_id, SUM(CASE WHEN present = 0 THEN 1 ELSE 0 END) AS missed
         FROM attendance WHERE group_id = ? GROUP BY member_id`,
    ).bind(groupId).all<{ member_id: string; missed: number }>(),
  ]);

  const settlements = (settlementRows.results ?? []).map((s: any) => ({
    participantId: s.member_id, weekOf: s.week_of, completed: s.completed,
    challenged: s.challenged, required: 4, shortfall: s.shortfall,
    fineCents: s.fine_cents, state: s.state, note: s.note,
    heard: s.state === 'disputed', outcomeNote: s.note,
  }));

  const outcomes = (issueRows.results ?? [])
    .map((r) => { try { return JSON.parse(r.outcome_json); } catch { return null; } })
    .filter(Boolean);

  const meetingsMissed = Object.fromEntries(
    (attendanceRows.results ?? []).map((r) => [r.member_id, r.missed]),
  );

  const offenders = offenderTable({
    participantIds: Object.keys(names), outcomes, settlements, meetingsMissed,
  });
  const agenda = buildAgenda({
    outcomes, settlements, offenders, nameOf: (id) => names[id] ?? id,
  });

  return json({ weekOf: week, agenda, offenders, names });
}

/* ── Issues ───────────────────────────────────────────────────────────────── */

/** POST /api/g/:groupId/issues — "sink is full of noodles again". */
export async function raiseIssue(request: Request, env: Env, groupId: string): Promise<Response> {
  const body = await readJson<{
    token: string; description: string; photoUrl?: string; hoursOpen?: number;
  }>(request);
  if (!body?.token || !body.description) return badRequest('need token and description');

  const identity = await memberFromToken(env, body.token);
  if (!identity || identity.groupId !== groupId) return unauthorized();

  const issueId = newId('iss');
  const closesAt = new Date(Date.now() + (body.hoursOpen ?? 12) * 3_600_000).toISOString();

  await env.DB.prepare(
    `INSERT INTO issues (id, group_id, raised_by, description, photo_url, closes_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).bind(issueId, groupId, identity.memberId, body.description, body.photoUrl ?? null, closesAt).run();

  await enqueue(env, groupId, 'whatsapp', 'group',
    `🧽 ${body.description}\n\nWas this you? Reply *was me* or *not me*.\n`
    + `Silence gets named when this closes.`);

  return json({ issueId, closesAt });
}

/** POST /api/issues/:issueId/respond — was me / not me. */
export async function respondToIssue(
  request: Request, env: Env, issueId: string,
): Promise<Response> {
  const body = await readJson<{ token: string; answer: 'was-me' | 'not-me' }>(request);
  if (!body?.token || !['was-me', 'not-me'].includes(body.answer)) {
    return badRequest('answer must be was-me or not-me');
  }

  const identity = await memberFromToken(env, body.token);
  if (!identity) return unauthorized();

  const issue = await env.DB.prepare('SELECT * FROM issues WHERE id = ?')
    .bind(issueId).first<{ id: string; group_id: string; status: string }>();
  if (!issue) return notFound('no such issue');
  if (issue.group_id !== identity.groupId) return unauthorized();
  if (issue.status !== 'open') return badRequest('that poll has closed');

  await env.DB.prepare(
    `INSERT INTO issue_responses (issue_id, member_id, answer) VALUES (?, ?, ?)
     ON CONFLICT(issue_id, member_id) DO UPDATE SET
       answer = excluded.answer, answered_at = datetime('now')`,
  ).bind(issueId, identity.memberId, body.answer).run();

  return json({ ok: true });
}

/** Close an issue poll and publish the outcome. Called by cron and by hand. */
export async function closeIssue(env: Env, issueId: string): Promise<Response> {
  const issue = await env.DB.prepare('SELECT * FROM issues WHERE id = ?')
    .bind(issueId).first<{
      id: string; group_id: string; raised_by: string; description: string;
      created_at: string; closes_at: string;
    }>();
  if (!issue) return notFound('no such issue');

  const [responseRows, names] = await Promise.all([
    env.DB.prepare('SELECT * FROM issue_responses WHERE issue_id = ?')
      .bind(issueId).all<{ member_id: string; answer: 'was-me' | 'not-me'; answered_at: string }>(),
    loadMemberNames(env, issue.group_id),
  ]);

  const responses: IssueResponse[] = (responseRows.results ?? []).map((r) => ({
    issueId, participantId: r.member_id, answer: r.answer, at: r.answered_at,
  }));

  const outcome = resolveIssue(
    {
      id: issue.id, raisedBy: issue.raised_by, description: issue.description,
      createdAt: issue.created_at, closesAt: issue.closes_at,
    },
    responses, Object.keys(names), new Date().toISOString(),
  );

  const readable = {
    ...outcome,
    owners: outcome.owners.map((id) => names[id] ?? id),
    silent: outcome.silent.map((id) => names[id] ?? id),
  };

  await env.DB.prepare(
    "UPDATE issues SET status = 'closed', outcome_json = ? WHERE id = ?",
  ).bind(JSON.stringify(outcome), issueId).run();

  await enqueue(env, issue.group_id, 'whatsapp', 'group',
    `🧽 "${issue.description}"\n${readable.summary.replace(
      /\b([a-z0-9_]+)\b/gi, (m) => names[m] ?? m)}`);

  return json({ outcome: readable });
}
