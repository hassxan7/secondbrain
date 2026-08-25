/**
 * Cloudflare Worker entry point.
 *
 * One deployment serves both products plus the queue the WhatsApp bot drains.
 * Routing is a small hand-rolled matcher rather than a framework — there are
 * about twenty routes and a dependency would outweigh them.
 */

import {
  type Env, json, notFound, badRequest, unauthorized, newId, weekOf, enqueue,
  loadMemberNames, memberFromToken, getPoll, slotsOf,
} from './db.ts';
import {
  buildAuthUrl, exchangeCode, refreshAccessToken, fetchBusy, suggestFromBusy,
} from './integrations/google-calendar.ts';
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

route('GET', '/api/ripple/hangouts/:pollId/asks', (req, env, _ctx, [pollId]) =>
  ripple.getAsks(req, env, pollId));

route('POST', '/api/ripple/hangouts/:pollId/options', (req, env, _ctx, [pollId]) =>
  ripple.submitOptions(req, env, pollId));

route('POST', '/api/ripple/hangouts/:pollId/suggest', (req, env, _ctx, [pollId]) =>
  ripple.suggestOption(req, env, pollId));

route('POST', '/api/ripple/hangouts/:pollId/link', (req, env, _ctx, [pollId]) =>
  ripple.addLinkOption(req, env, pollId));

route('POST', '/api/ripple/hangouts/:pollId/nudge', (req, env, _ctx, [pollId]) =>
  ripple.nudge(req, env, pollId));

/* ── Google Calendar (optional) ───────────────────────────────────────────── */

function oauthConfig(env: Env, request: Request) {
  if (!env.GOOGLE_OAUTH_ID || !env.GOOGLE_OAUTH_SECRET) return null;
  return {
    clientId: env.GOOGLE_OAUTH_ID,
    clientSecret: env.GOOGLE_OAUTH_SECRET,
    redirectUri: new URL('/api/calendar/callback', request.url).toString(),
  };
}

route('GET', '/api/calendar/connect', async (request, env) => {
  const config = oauthConfig(env, request);
  if (!config) return badRequest('calendar sync is not configured on this deployment');

  const token = new URL(request.url).searchParams.get('token');
  if (!token) return badRequest('missing token');
  if (!await memberFromToken(env, token)) return unauthorized();

  // The share-link token doubles as the OAuth state, so the callback knows who
  // came back without a session cookie.
  return Response.redirect(buildAuthUrl(config, token), 302);
});

route('GET', '/api/calendar/callback', async (request, env) => {
  const config = oauthConfig(env, request);
  if (!config) return badRequest('calendar sync is not configured');

  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (!code || !state) return badRequest('missing code or state');

  const identity = await memberFromToken(env, state);
  if (!identity) return unauthorized('that link expired mid-connect — open it again');

  try {
    const tokens = await exchangeCode(config, code);
    await env.DB.prepare(
      `INSERT INTO calendar_tokens (member_id, access_token, refresh_token, expires_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(member_id) DO UPDATE SET
         access_token = excluded.access_token,
         refresh_token = COALESCE(excluded.refresh_token, calendar_tokens.refresh_token),
         expires_at = excluded.expires_at`,
    ).bind(
      identity.memberId, tokens.accessToken, tokens.refreshToken ?? null, tokens.expiresAt,
    ).run();
  } catch (error) {
    console.error('calendar connect failed', error);
    return json({ error: 'could not connect that calendar' }, 502);
  }

  return Response.redirect(new URL('/?calendar=connected', request.url).toString(), 302);
});

/**
 * GET /api/calendar/suggest/:pollId — prefill suggestions for one person.
 *
 * Returns `no` for clashing slots and nothing for free ones. Never `yes`: an
 * empty calendar is not consent to be booked.
 */
route('GET', '/api/calendar/suggest/:pollId', async (request, env, _ctx, [pollId]) => {
  const config = oauthConfig(env, request);
  const token = new URL(request.url).searchParams.get('token');
  if (!token) return badRequest('missing token');

  const identity = await memberFromToken(env, token);
  if (!identity) return unauthorized();
  if (!config) return json({ suggestions: {}, connected: false });

  const stored = await env.DB.prepare(
    'SELECT access_token, refresh_token, expires_at FROM calendar_tokens WHERE member_id = ?',
  ).bind(identity.memberId).first<{
    access_token: string; refresh_token: string | null; expires_at: string;
  }>();
  if (!stored) return json({ suggestions: {}, connected: false });

  const poll = await getPoll(env, pollId);
  if (!poll) return notFound('no such poll');

  let accessToken = stored.access_token;
  if (Date.parse(stored.expires_at) <= Date.now()) {
    if (!stored.refresh_token) return json({ suggestions: {}, connected: false, expired: true });
    try {
      const refreshed = await refreshAccessToken(config, stored.refresh_token);
      accessToken = refreshed.accessToken;
      await env.DB.prepare(
        'UPDATE calendar_tokens SET access_token = ?, expires_at = ? WHERE member_id = ?',
      ).bind(refreshed.accessToken, refreshed.expiresAt, identity.memberId).run();
    } catch {
      return json({ suggestions: {}, connected: false, expired: true });
    }
  }

  const slots = slotsOf(poll);
  if (slots.length === 0) return json({ suggestions: {}, connected: true });

  const starts = slots.map((s) => Date.parse(s.startUtc));
  const timeMin = new Date(Math.min(...starts)).toISOString();
  const timeMax = new Date(
    Math.max(...starts) + slots[0].durationMins * 60_000,
  ).toISOString();

  try {
    const busy = await fetchBusy(accessToken, timeMin, timeMax);
    return json({ suggestions: suggestFromBusy(slots, busy), connected: true });
  } catch (error) {
    console.error('freeBusy failed', error);
    // A calendar outage must not block someone answering by hand.
    return json({ suggestions: {}, connected: true, error: 'calendar unavailable' });
  }
});

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
  let needsLink = false;

  const answer = /^(was me|wasme|it was me|yeah that was me|my bad)$/.test(text) ? 'was-me'
    : /^(not me|notme|wasn'?t me|nah not me)$/.test(text) ? 'not-me'
    : null;

  if (answer) {
    const issue = await env.DB.prepare(
      `SELECT id FROM issues WHERE group_id = ? AND status = 'open'
        ORDER BY created_at DESC LIMIT 1`,
    ).bind(body.groupId).first<{ id: string }>();

    if (issue && member) {
      await env.DB.prepare(
        `INSERT INTO issue_responses (issue_id, member_id, answer) VALUES (?, ?, ?)
         ON CONFLICT(issue_id, member_id) DO UPDATE SET
           answer = excluded.answer, answered_at = datetime('now')`,
      ).bind(issue.id, member.id, answer).run();
      handledAs = `issue:${issue.id}:${answer}`;
    } else if (issue && !member) {
      // Somebody answered but their number is not on any member row, usually
      // because it was never filled in. Dropping this silently is the worst
      // possible outcome for a system whose whole point is that silence costs
      // something: they would be named for not answering when they did.
      handledAs = `unlinked-sender:${answer}`;
      needsLink = true;
    }
  }

  await env.DB.prepare(
    `INSERT INTO inbox (id, group_id, member_id, raw_from, body, handled_as)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).bind(newId('in'), body.groupId, member?.id ?? null, body.from ?? '', body.body, handledAs).run();

  return json({ ok: true, handledAs, needsLink });
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
