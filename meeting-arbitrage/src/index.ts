/**
 * Cloudflare Worker entry point.
 *
 * One deployment serves both products plus the queue the WhatsApp bot drains.
 * Routing is a small hand-rolled matcher rather than a framework — there are
 * about twenty routes and a dependency would outweigh them.
 */

import {
  type Env, json, notFound, badRequest, unauthorized, newId, weekOf, enqueue,
  loadMemberNames,
} from './db.ts';
import * as banksia from './banksia/routes.ts';
import * as ripple from './ripple/routes.ts';

type Handler = (
  request: Request, env: Env, ctx: ExecutionContext, params: string[],
) => Promise<Response> | Response;

interface Route {
  method: string;
  pattern: RegExp;
  handler: Handler;
}

const routes: Route[] = [];

function route(method: string, path: string, handler: Handler): void {
  // `:name` captures one path segment.
  const pattern = new RegExp(
    `^${path.replace(/:[a-zA-Z]+/g, '([^/]+)').replace(/\//g, '\\/')}$`,
  );
  routes.push({ method, pattern, handler });
}

/* ── Shared polls ─────────────────────────────────────────────────────────── */

route('GET', '/api/g/:groupId', (_req, env, _ctx, [groupId]) =>
  banksia.getGroupState(env, groupId));

route('POST', '/api/g/:groupId/polls', (req, env, _ctx, [groupId]) =>
  banksia.createPoll(req, env, groupId));

route('GET', '/api/polls/:pollId', (_req, env, _ctx, [pollId]) =>
  banksia.getPollState(env, pollId));

route('POST', '/api/polls/:pollId/respond', (req, env, _ctx, [pollId]) =>
  banksia.submitResponse(req, env, pollId));

route('POST', '/api/polls/:pollId/close', (_req, env, _ctx, [pollId]) =>
  banksia.closePoll(env, pollId));

/* ── Banksia ──────────────────────────────────────────────────────────────── */

route('POST', '/api/g/:groupId/refix', (req, env, _ctx, [groupId]) =>
  banksia.requestRefix(req, env, groupId));

route('GET', '/api/g/:groupId/chores', (req, env, _ctx, [groupId]) =>
  banksia.getChoreBoard(env, groupId, new URL(req.url).searchParams.get('week') ?? weekOf()));

route('POST', '/api/g/:groupId/chores/claim', (req, env, _ctx, [groupId]) =>
  banksia.claimChore(req, env, groupId));

route('POST', '/api/g/:groupId/chores/challenge', (req, env, _ctx, [groupId]) =>
  banksia.challengeChore(req, env, groupId));

route('POST', '/api/g/:groupId/week/settle', (req, env, _ctx, [groupId]) =>
  banksia.settleWeekRoute(req, env, groupId));

route('GET', '/api/g/:groupId/agenda', (_req, env, _ctx, [groupId]) =>
  banksia.getAgenda(env, groupId));

route('POST', '/api/g/:groupId/issues', (req, env, _ctx, [groupId]) =>
  banksia.raiseIssue(req, env, groupId));

route('POST', '/api/issues/:issueId/respond', (req, env, _ctx, [issueId]) =>
  banksia.respondToIssue(req, env, issueId));

route('POST', '/api/issues/:issueId/close', (_req, env, _ctx, [issueId]) =>
  banksia.closeIssue(env, issueId));

/* ── Ripple ───────────────────────────────────────────────────────────────── */

route('POST', '/api/ripple/hangouts', (req, env) => ripple.createHangout(req, env));

route('GET', '/api/ripple/hangouts/:pollId', (_req, env, _ctx, [pollId]) =>
  ripple.getHangout(env, pollId));

route('POST', '/api/ripple/hangouts/:pollId/join', (req, env, _ctx, [pollId]) =>
  ripple.joinHangout(req, env, pollId));

route('POST', '/api/ripple/hangouts/:pollId/lock', (req, env, _ctx, [pollId]) =>
  ripple.lockHangout(req, env, pollId));

/* ── Bot queue ────────────────────────────────────────────────────────────── */

function botAuthorised(request: Request, env: Env): boolean {
  const header = request.headers.get('authorization') ?? '';
  const token = header.replace(/^Bearer\s+/i, '');
  // Constant-length compare is overkill here, but the token is a shared secret
  // and the check is one line.
  return Boolean(env.BOT_TOKEN) && token === env.BOT_TOKEN;
}

route('GET', '/api/bot/outbox', async (request, env) => {
  if (!botAuthorised(request, env)) return unauthorized('bad bot token');
  const { results } = await env.DB.prepare(
    `SELECT id, group_id, channel, target, body FROM outbox
      WHERE status = 'queued' ORDER BY created_at LIMIT 20`,
  ).all();
  return json({ messages: results ?? [] });
});

route('POST', '/api/bot/outbox/:id/ack', async (request, env, _ctx, [id]) => {
  if (!botAuthorised(request, env)) return unauthorized('bad bot token');
  const body = await request.json().catch(() => ({})) as { ok?: boolean; error?: string };

  await env.DB.prepare(
    `UPDATE outbox
        SET status = ?, attempts = attempts + 1, error = ?, sent_at = datetime('now')
      WHERE id = ?`,
  ).bind(body.ok === false ? 'failed' : 'sent', body.error ?? null, id).run();

  return json({ ok: true });
});

/**
 * POST /api/bot/inbox — a message from the group chat.
 *
 * Recognises the two answers that matter ("was me" / "not me") against the
 * most recent open issue, so people can respond in the chat they are already
 * in rather than opening a link.
 */
route('POST', '/api/bot/inbox', async (request, env) => {
  if (!botAuthorised(request, env)) return unauthorized('bad bot token');

  const body = await request.json().catch(() => null) as {
    groupId?: string; from?: string; phone?: string; body?: string;
  } | null;
  if (!body?.groupId || !body.body) return badRequest('need groupId and body');

  const text = body.body.trim().toLowerCase();
  const member = body.phone
    ? await env.DB.prepare('SELECT id FROM members WHERE group_id = ? AND phone = ?')
        .bind(body.groupId, body.phone).first<{ id: string }>()
    : null;

  let handledAs: string | null = null;

  const answer = /^(was me|wasme|it was me|yeah that was me|my bad)$/.test(text) ? 'was-me'
    : /^(not me|notme|wasn'?t me|nah not me)$/.test(text) ? 'not-me'
    : null;

  if (answer && member) {
    const issue = await env.DB.prepare(
      `SELECT id FROM issues WHERE group_id = ? AND status = 'open'
        ORDER BY created_at DESC LIMIT 1`,
    ).bind(body.groupId).first<{ id: string }>();

    if (issue) {
      await env.DB.prepare(
        `INSERT INTO issue_responses (issue_id, member_id, answer) VALUES (?, ?, ?)
         ON CONFLICT(issue_id, member_id) DO UPDATE SET
           answer = excluded.answer, answered_at = datetime('now')`,
      ).bind(issue.id, member.id, answer).run();
      handledAs = `issue:${issue.id}:${answer}`;
    }
  }

  await env.DB.prepare(
    `INSERT INTO inbox (id, group_id, member_id, raw_from, body, handled_as)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).bind(newId('in'), body.groupId, member?.id ?? null, body.from ?? '', body.body, handledAs).run();

  return json({ ok: true, handledAs });
});

/* ── Dispatch ─────────────────────────────────────────────────────────────── */

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (url.pathname.startsWith('/api/')) {
      for (const r of routes) {
        if (r.method !== request.method) continue;
        const match = r.pattern.exec(url.pathname);
        if (!match) continue;
        try {
          const response = await r.handler(request, env, ctx, match.slice(1).map(decodeURIComponent));
          const headers = new Headers(response.headers);
          for (const [k, v] of Object.entries(corsHeaders())) headers.set(k, v);
          return new Response(response.body, { status: response.status, headers });
        } catch (error) {
          console.error('route failed', url.pathname, error);
          return json({ error: 'internal error' }, 500);
        }
      }
      return notFound('no such endpoint');
    }

    // Pretty links straight from the group chat.
    if (url.pathname.startsWith('/r/')) return env.ASSETS.fetch(rewrite(request, '/ripple/'));
    if (url.pathname.startsWith('/h/')) return env.ASSETS.fetch(rewrite(request, '/banksia/'));

    return env.ASSETS.fetch(request);
  },

  /**
   * Scheduled work. Two cadences:
   *   daily   close issue polls that are due, then chase non-responders
   *   weekly  settle the chore board
   */
  async scheduled(event: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(runScheduled(event, env));
  },
};

function rewrite(request: Request, prefix: string): Request {
  const url = new URL(request.url);
  url.pathname = `${prefix}index.html`;
  return new Request(url, request);
}

function corsHeaders(): Record<string, string> {
  return {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type,authorization',
  };
}

async function runScheduled(event: ScheduledController, env: Env): Promise<void> {
  const isWeekly = event.cron === '0 23 * * 0';

  // Close every issue poll whose window has passed. Silence gets named here.
  const due = await env.DB.prepare(
    `SELECT id FROM issues WHERE status = 'open' AND closes_at <= datetime('now')`,
  ).all<{ id: string }>();

  for (const issue of due.results ?? []) {
    try {
      await banksia.closeIssue(env, issue.id);
    } catch (error) {
      console.error('failed to close issue', issue.id, error);
    }
  }

  // Chase anyone sitting on an open poll.
  const openPolls = await env.DB.prepare(
    `SELECT p.id, p.group_id, p.title FROM polls p
       JOIN groups g ON g.id = p.group_id
      WHERE p.status = 'open' AND g.kind = 'banksia'`,
  ).all<{ id: string; group_id: string; title: string }>();

  for (const poll of openPolls.results ?? []) {
    const [names, answered] = await Promise.all([
      loadMemberNames(env, poll.group_id),
      env.DB.prepare('SELECT DISTINCT member_id FROM responses WHERE poll_id = ?')
        .bind(poll.id).all<{ member_id: string }>(),
    ]);
    const answeredIds = new Set((answered.results ?? []).map((r) => r.member_id));
    const missing = Object.entries(names).filter(([id]) => !answeredIds.has(id));

    if (missing.length > 0) {
      await enqueue(env, poll.group_id, 'whatsapp', 'group',
        `⏳ Still waiting on ${missing.map(([, name]) => name).join(', ')} for "${poll.title}".\n`
        + `A slot you haven't answered counts as a no.`);
    }
  }

  if (!isWeekly) return;

  const groups = await env.DB.prepare("SELECT id FROM groups WHERE kind = 'banksia'")
    .all<{ id: string }>();

  for (const group of groups.results ?? []) {
    try {
      await banksia.settleWeekRoute(
        new Request('https://internal/settle', {
          method: 'POST',
          body: JSON.stringify({ weekOf: weekOf(new Date(Date.now() - 86_400_000)) }),
        }),
        env, group.id,
      );
    } catch (error) {
      console.error('weekly settle failed for', group.id, error);
    }
  }
}
