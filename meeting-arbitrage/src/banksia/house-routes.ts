/**
 * The house routes added for the rebuilt UI: joining, the board photo, the
 * anonymous channel, and the chasing run.
 *
 * Kept separate from routes.ts, which is the meeting and settlement surface.
 * Same rule holds: handlers read rows, call an engine module, write rows. No
 * decision is made in here.
 */

import {
  type Env, getGroup, loadMemberNames, memberFromToken, newId, json, badRequest,
  notFound, unauthorized, weekOf, issueToken,
} from '../db.ts';
import { validateJoin, describeAvailability, DATA_USE, type JoinDraft } from './onboarding.ts';
import {
  parseBoardPayload, mergeBoard, boardStanding, DEFAULT_TASKS,
  type Board, type BoardTask, type BoardMember,
} from './board.ts';
import {
  dueReminders, reminderPolicy, DEFAULT_REMINDER_CONFIG,
  type ReminderTarget, type Reminder,
} from './reminders.ts';
import { readBoardPhoto } from '../integrations/board-vision.ts';
import {
  raiseAnonymous, anonymousAgenda, softenNote, ISSUE_AREAS, DEFAULT_ANON_CONFIG,
  type AnonymousIssue, type IssueArea,
} from './anonymous.ts';

async function readJson<T>(request: Request): Promise<T | null> {
  try { return await request.json() as T; } catch { return null; }
}

/* ── Joining ──────────────────────────────────────────────────────────────── */

/**
 * GET /api/g/:groupId/join — everything the onboarding screen needs.
 *
 * Served before anyone types anything, so the promise about message volume is
 * on screen at the moment the phone number is asked for rather than buried in
 * a settings page afterwards.
 */
export async function joinInfo(env: Env, groupId: string): Promise<Response> {
  const group = await getGroup(env, groupId);
  if (!group) return notFound('no such house');

  const count = await env.DB.prepare(
    'SELECT COUNT(*) AS n FROM members WHERE group_id = ?',
  ).bind(groupId).first<{ n: number }>();

  return json({
    house: group.name,
    timezone: group.timezone,
    memberCount: count?.n ?? 0,
    dataUse: DATA_USE,
    messagePolicy: reminderPolicy(),
    areas: ISSUE_AREAS,
  });
}

/**
 * POST /api/g/:groupId/join — add or update a housemate.
 *
 * Returns a member token: the link *is* the credential, so finishing onboarding
 * has to hand back the thing that lets them tick a chore, or they finish the
 * form and land on a page that cannot do anything.
 */
export async function joinHouse(request: Request, env: Env, groupId: string): Promise<Response> {
  const group = await getGroup(env, groupId);
  if (!group) return notFound('no such house');

  const body = await readJson<JoinDraft>(request);
  if (!body) return badRequest('expected a JSON body');

  const existing = await env.DB.prepare(
    'SELECT id, name, email, phone FROM members WHERE group_id = ?',
  ).bind(groupId).all<{ id: string; name: string; email: string | null; phone: string | null }>();

  const result = validateJoin(body, existing.results ?? []);
  if (!result.ok || !result.member) return json({ ok: false, errors: result.errors }, 400);

  const { name, email, phone, availability } = result.member;
  const memberId = result.matchedExisting ?? newId('mem');
  const now = new Date().toISOString();

  if (result.matchedExisting) {
    await env.DB.prepare(
      `UPDATE members SET name = ?, email = ?, phone = ?, availability_json = ?, joined_at = ?
        WHERE id = ?`,
    ).bind(name, email, phone, JSON.stringify(availability), now, memberId).run();
  } else {
    await env.DB.prepare(
      `INSERT INTO members (id, group_id, name, email, phone, availability_json, joined_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ).bind(memberId, groupId, name, email, phone, JSON.stringify(availability), now).run();
  }

  const token = await issueToken(env, memberId, groupId);

  return json({
    ok: true,
    memberId,
    token,
    rejoined: Boolean(result.matchedExisting),
    name,
    availability: describeAvailability(availability),
  });
}

/* ── The board ────────────────────────────────────────────────────────────── */

async function loadBoard(env: Env, groupId: string, week: string): Promise<{
  board: Board; members: BoardMember[];
}> {
  const [taskRows, claimRows, names] = await Promise.all([
    env.DB.prepare(
      'SELECT id, label FROM chore_tasks WHERE group_id = ? AND is_active = 1',
    ).bind(groupId).all<{ id: string; label: string }>(),
    env.DB.prepare(
      'SELECT member_id, task_id FROM chore_claims WHERE group_id = ? AND week_of = ?',
    ).bind(groupId, week).all<{ member_id: string; task_id: string }>(),
    loadMemberNames(env, groupId),
  ]);

  const tasks: BoardTask[] = (taskRows.results ?? []).length > 0
    ? (taskRows.results ?? []).map((r) => ({ id: r.id, label: r.label }))
    : DEFAULT_TASKS;

  return {
    board: {
      weekOf: week,
      tasks,
      ticks: (claimRows.results ?? []).map((r) => ({ taskId: r.task_id, memberId: r.member_id })),
    },
    members: Object.entries(names).map(([id, name]) => ({ id, name })),
  };
}

/** GET /api/g/:groupId/board — the whiteboard, as a grid. */
export async function getBoard(env: Env, groupId: string, week?: string): Promise<Response> {
  const group = await getGroup(env, groupId);
  if (!group) return notFound('no such house');

  const target = week ?? weekOf();
  const { board, members } = await loadBoard(env, groupId, target);

  return json({
    weekOf: target,
    tasks: board.tasks,
    members,
    ticks: board.ticks,
    required: DEFAULT_REMINDER_CONFIG.tasksRequired,
    standings: boardStanding(board, members, DEFAULT_REMINDER_CONFIG.tasksRequired),
  });
}

/**
 * POST /api/g/:groupId/board/photo — read a photographed whiteboard.
 *
 * The model transcribes; `parseBoardPayload` decides. The merge is additive,
 * so the worst a misread can do is miss a tick someone then adds by hand —
 * never delete one, which would be unrecoverable once the board is wiped.
 */
export async function importBoardPhoto(
  request: Request, env: Env, groupId: string,
): Promise<Response> {
  const body = await readJson<{
    token: string; imageBase64: string;
    mediaType?: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
    weekOf?: string;
    /** Test and offline path: skip the model, supply rows directly. */
    rows?: unknown;
  }>(request);
  if (!body?.token) return badRequest('missing token');

  const identity = await memberFromToken(env, body.token);
  if (!identity || identity.groupId !== groupId) return unauthorized();

  const week = body.weekOf ?? weekOf();
  const { board, members } = await loadBoard(env, groupId, week);

  let payload: unknown = body.rows ? { rows: body.rows } : null;
  if (!payload) {
    if (!body.imageBase64) return badRequest('send an image or rows');
    if (!env.ANTHROPIC_API_KEY) {
      return json({ error: 'photo import is not configured — tap the grid instead' }, 503);
    }
    payload = await readBoardPhoto({
      apiKey: env.ANTHROPIC_API_KEY,
      imageBase64: body.imageBase64,
      mediaType: body.mediaType ?? 'image/jpeg',
    });
    if (!payload) return json({ error: 'could not read that photo — try tapping the grid' }, 502);
  }

  let imported;
  try {
    imported = parseBoardPayload(payload, members, week, board.tasks);
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : 'could not read that board');
  }

  const merged = mergeBoard(board, imported.board);

  const statements = [
    ...imported.newTasks.map((t) => env.DB.prepare(
      'INSERT OR IGNORE INTO chore_tasks (id, group_id, label) VALUES (?, ?, ?)',
    ).bind(t.id, groupId, t.label)),
    ...merged.added.map((t) => env.DB.prepare(
      `INSERT INTO chore_claims (id, group_id, member_id, task_id, week_of)
       VALUES (?, ?, ?, ?, ?)`,
    ).bind(newId('claim'), groupId, t.memberId, t.taskId, week)),
    env.DB.prepare(
      `INSERT INTO board_imports
         (id, group_id, week_of, uploaded_by, ticks_added, unmatched_json, new_tasks_json)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      newId('imp'), groupId, week, identity.memberId, merged.added.length,
      JSON.stringify(imported.unmatched), JSON.stringify(imported.newTasks),
    ),
  ];
  if (statements.length > 0) await env.DB.batch(statements);

  return json({
    ok: true,
    weekOf: week,
    added: merged.added.length,
    keptDespiteAbsence: merged.keptDespiteAbsence.length,
    unmatched: imported.unmatched,
    newTasks: imported.newTasks,
    standings: boardStanding(merged.board, members, DEFAULT_REMINDER_CONFIG.tasksRequired),
  });
}

/* ── The anonymous channel ────────────────────────────────────────────────── */

/**
 * Opaque author key.
 *
 * Hashed so the raiser is not sitting in the column as a foreign key, and no
 * read path ever selects it. Worth saying plainly: in a seven-person house a
 * hash of a member id is enumerable by anyone holding the member list, so this
 * is not a cryptographic guarantee against the person running the database. It
 * is a guarantee against the issue leaking through an ordinary query or a JSON
 * response, which is the way it would actually leak.
 */
async function authorKey(groupId: string, memberId: string): Promise<string> {
  const data = new TextEncoder().encode(`${groupId}:${memberId}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].slice(0, 12)
    .map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function loadAnonIssues(env: Env, groupId: string): Promise<AnonymousIssue[]> {
  const rows = await env.DB.prepare(
    `SELECT i.id, i.area, i.created_at, c.author, c.note, c.raised_at
       FROM anon_issues i
       JOIN anon_contributions c ON c.issue_id = i.id
      WHERE i.group_id = ? AND i.resolved_at IS NULL
      ORDER BY i.created_at, c.raised_at`,
  ).bind(groupId).all<{
    id: string; area: string; created_at: string;
    author: string; note: string | null; raised_at: string;
  }>();

  const byIssue = new Map<string, AnonymousIssue>();
  for (const row of rows.results ?? []) {
    const issue = byIssue.get(row.id) ?? {
      id: row.id, area: row.area as IssueArea, contributions: [], createdAt: row.created_at,
    };
    issue.contributions.push({
      author: row.author, note: row.note ?? undefined, at: row.raised_at,
    });
    byIssue.set(row.id, issue);
  }
  return [...byIssue.values()];
}

/** GET /api/g/:groupId/anon — what the house may see. Authors never leave here. */
export async function getAnonymous(env: Env, groupId: string): Promise<Response> {
  const group = await getGroup(env, groupId);
  if (!group) return notFound('no such house');

  const [issues, names] = await Promise.all([
    loadAnonIssues(env, groupId),
    loadMemberNames(env, groupId),
  ]);

  return json({
    areas: ISSUE_AREAS,
    open: anonymousAgenda(issues, Object.values(names), new Date().toISOString()),
    coolingHours: DEFAULT_ANON_CONFIG.coolingHours,
  });
}

/** POST /api/g/:groupId/anon — raise something, about an area, not a person. */
export async function raiseAnonymousRoute(
  request: Request, env: Env, groupId: string,
): Promise<Response> {
  const body = await readJson<{ token: string; area: IssueArea; note?: string }>(request);
  if (!body?.token || !body.area) return badRequest('need token and area');
  if (!ISSUE_AREAS.some((a) => a.id === body.area)) return badRequest('unknown area');

  const identity = await memberFromToken(env, body.token);
  if (!identity || identity.groupId !== groupId) return unauthorized();

  const [issues, names] = await Promise.all([
    loadAnonIssues(env, groupId),
    loadMemberNames(env, groupId),
  ]);

  const author = await authorKey(groupId, identity.memberId);
  const now = new Date().toISOString();
  // Soften before storage, not before display: the raw note is never written
  // down, so there is nothing to leak later or to un-soften by accident.
  const note = body.note
    ? softenNote(body.note, Object.values(names), DEFAULT_ANON_CONFIG)
    : undefined;

  const before = new Set(issues.map((i) => i.id));
  const next = raiseAnonymous(issues, { area: body.area, author, note, now });
  const issue = next.find((i) => i.area === body.area)!;

  if (!before.has(issue.id)) {
    await env.DB.prepare(
      'INSERT INTO anon_issues (id, group_id, area, created_at) VALUES (?, ?, ?, ?)',
    ).bind(issue.id, groupId, issue.area, issue.createdAt).run();
  }
  await env.DB.prepare(
    `INSERT INTO anon_contributions (issue_id, author, note, raised_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(issue_id, author) DO UPDATE SET
       note = COALESCE(excluded.note, anon_contributions.note),
       raised_at = excluded.raised_at`,
  ).bind(issue.id, author, note ?? null, now).run();

  const agenda = anonymousAgenda(next, Object.values(names), now);
  return json({
    ok: true,
    // Told to the raiser only, so they know whether it landed or is waiting.
    status: agenda.find((o) => o.id === issue.id)?.status ?? 'building',
  });
}

/* ── The chasing run ──────────────────────────────────────────────────────── */

/**
 * Work out and queue this run's reminders.
 *
 * Called by the cron and by POST /api/g/:groupId/remind (which the bot and the
 * "send the nudges now" button both hit). Inserting into `reminders_sent` on a
 * primary key that is the reminder's own dedupe id is what makes a double run
 * silent: the second insert fails, and nothing is queued for it.
 */
export async function runReminders(
  env: Env, groupId: string, now: Date = new Date(),
): Promise<{ queued: Reminder[]; skipped: number }> {
  const group = await getGroup(env, groupId);
  if (!group) return { queued: [], skipped: 0 };

  const week = weekOf(now);
  const { board, members } = await loadBoard(env, groupId, week);

  const [memberRows, sentRows, pollRow] = await Promise.all([
    env.DB.prepare(
      'SELECT id, name, phone, email FROM members WHERE group_id = ?',
    ).bind(groupId).all<{ id: string; name: string; phone: string | null; email: string | null }>(),
    env.DB.prepare(
      'SELECT member_id, COUNT(*) AS n FROM reminders_sent WHERE group_id = ? AND week_of = ? GROUP BY member_id',
    ).bind(groupId, week).all<{ member_id: string; n: number }>(),
    env.DB.prepare(
      `SELECT id FROM polls WHERE group_id = ? AND status = 'open'
        ORDER BY created_at DESC LIMIT 1`,
    ).bind(groupId).first<{ id: string }>(),
  ]);

  const targets: ReminderTarget[] = (memberRows.results ?? []).map((m) => ({
    memberId: m.id, name: m.name, phone: m.phone, email: m.email,
  }));

  let awaitingPoll: string[] = [];
  if (pollRow) {
    const answered = await env.DB.prepare(
      'SELECT DISTINCT member_id FROM responses WHERE poll_id = ?',
    ).bind(pollRow.id).all<{ member_id: string }>();
    const done = new Set((answered.results ?? []).map((r) => r.member_id));
    awaitingPoll = targets.map((t) => t.memberId).filter((id) => !done.has(id));
  }

  const openIssues = await env.DB.prepare(
    `SELECT id, description FROM issues WHERE group_id = ? AND status = 'open'`,
  ).bind(groupId).all<{ id: string; description: string }>();

  const issuesWithAwaiting = await Promise.all(
    (openIssues.results ?? []).map(async (issue) => {
      const answered = await env.DB.prepare(
        'SELECT member_id FROM issue_responses WHERE issue_id = ?',
      ).bind(issue.id).all<{ member_id: string }>();
      const done = new Set((answered.results ?? []).map((r) => r.member_id));
      return {
        id: issue.id,
        description: issue.description,
        awaiting: targets.map((t) => t.memberId).filter((id) => !done.has(id)),
      };
    }),
  );

  // Local wall-clock, because quiet hours are a promise about someone's night,
  // not about UTC.
  const local = localClock(now, group.timezone);

  const reminders = dueReminders({
    weekOf: week,
    weekday: local.weekday,
    minuteOfDay: local.minuteOfDay,
    targets,
    standings: boardStanding(board, members, DEFAULT_REMINDER_CONFIG.tasksRequired),
    awaitingPoll,
    openIssues: issuesWithAwaiting,
    sentThisWeek: Object.fromEntries(
      (sentRows.results ?? []).map((r) => [r.member_id, r.n]),
    ),
  });

  const queued: Reminder[] = [];
  let skipped = 0;
  const byId = new Map(targets.map((t) => [t.memberId, t]));

  for (const reminder of reminders) {
    const claimed = await env.DB.prepare(
      `INSERT OR IGNORE INTO reminders_sent (id, group_id, member_id, week_of, kind, channel)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).bind(
      reminder.id, groupId, reminder.memberId, week, reminder.kind, reminder.channel,
    ).run();

    if ((claimed.meta?.changes ?? 0) === 0) { skipped++; continue; }

    const target = byId.get(reminder.memberId)!;
    const to = reminder.channel === 'email' ? target.email! : target.phone!;
    await env.DB.prepare(
      'INSERT INTO outbox (id, group_id, channel, target, body) VALUES (?, ?, ?, ?, ?)',
    ).bind(
      newId('out'), groupId, reminder.channel, to,
      `${reminder.subject}\n\n${reminder.body}`,
    ).run();
    queued.push(reminder);
  }

  return { queued, skipped };
}

/** POST /api/g/:groupId/remind — run the chase now. */
export async function remindRoute(
  request: Request, env: Env, groupId: string,
): Promise<Response> {
  const body = await readJson<{ token?: string }>(request);
  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  // Either a housemate's link or the bot's shared secret. Anything else could
  // be used to burn a person's weekly message budget from outside the house.
  const authorised = bearer && env.BOT_TOKEN && bearer === env.BOT_TOKEN
    ? true
    : Boolean(body?.token && (await memberFromToken(env, body.token))?.groupId === groupId);
  if (!authorised) return unauthorized();

  const { queued, skipped } = await runReminders(env, groupId);
  return json({
    ok: true,
    queued: queued.map((r) => ({ memberId: r.memberId, kind: r.kind, channel: r.channel })),
    alreadySent: skipped,
  });
}

/** Weekday and minute-of-day in a named timezone, via Intl only. */
export function localClock(now: Date, timeZone: string): {
  weekday: number; minuteOfDay: number;
} {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hour = Number(get('hour')) % 24;

  return {
    weekday: Math.max(0, days.indexOf(get('weekday'))),
    minuteOfDay: hour * 60 + Number(get('minute')),
  };
}
