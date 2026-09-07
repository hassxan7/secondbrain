/**
 * What the group chat can do without anyone opening a link.
 *
 * The link-based app is the source of truth, but the honest observation is that
 * people are already in the WhatsApp chat and will not leave it. So the two
 * moments that matter most — somebody photographs a mess, and everybody answers
 * "was that you" — happen entirely inside the chat.
 *
 * Three routes:
 *   roster   the bot reports who is actually in the group, so a reminder can be
 *            sent over WhatsApp (free) instead of SMS (five cents)
 *   photo    a photo plus the trigger word becomes one neutral line and a poll
 *   vote     a native poll vote becomes an issue response
 */

import {
  type Env, getGroup, newId, json, badRequest, notFound,
} from '../db.ts';
import { normalisePhone } from './onboarding.ts';
import { readMessPhoto } from '../integrations/mess-vision.ts';

/**
 * The word that wakes the bot.
 *
 * One word, no punctuation, no command syntax. Anything a person has to
 * remember the exact shape of ("!issue", "banksy fix") is a thing they will get
 * wrong at 1am with one hand holding a phone, and a bot that ignores a
 * near-miss reads as broken. Matched case-insensitively anywhere in the
 * message, so "banksy", "Banksy?", "oi banksy" and "banksy who did this" all
 * work identically.
 */
export const TRIGGER = /\bbanks(y|ie)\b/i;

export function isTriggered(text: string): boolean {
  return TRIGGER.test(text ?? '');
}

async function readJson<T>(request: Request): Promise<T | null> {
  try { return await request.json() as T; } catch { return null; }
}

/**
 * POST /api/bot/roster — the bot tells us who is in the group.
 *
 * This is what makes the free channel usable. A member is only marked reachable
 * on WhatsApp if their number is actually in the group right now; guessing from
 * "they have a phone number on file" would queue messages to a chat they left,
 * and those fail silently, which is the worst failure a reminder can have.
 *
 * Numbers not matching any member are returned rather than ignored, so the
 * house can see who is in the chat but not on the board.
 */
export async function syncRoster(
  request: Request, env: Env, groupId: string,
): Promise<Response> {
  const body = await readJson<{ phones?: string[] }>(request);
  if (!Array.isArray(body?.phones)) return badRequest('need phones');

  const present = new Set(
    body.phones.map((p) => normalisePhone(p)).filter((p): p is string => Boolean(p)),
  );

  const members = await env.DB.prepare(
    'SELECT id, phone FROM members WHERE group_id = ?',
  ).bind(groupId).all<{ id: string; phone: string | null }>();

  const matched: string[] = [];
  const statements = (members.results ?? []).map((m) => {
    const normalised = normalisePhone(m.phone);
    const inGroup = Boolean(normalised && present.has(normalised));
    if (inGroup && normalised) { matched.push(normalised); }
    return env.DB.prepare('UPDATE members SET whatsapp = ? WHERE id = ?')
      .bind(inGroup ? 1 : 0, m.id);
  });
  if (statements.length > 0) await env.DB.batch(statements);

  return json({
    ok: true,
    reachable: matched.length,
    // In the chat but on nobody's member row. Usually a housemate who has not
    // joined yet, which is exactly who the house wants to know about.
    unknown: [...present].filter((p) => !matched.includes(p)),
  });
}

export interface PollSpec {
  question: string;
  options: string[];
  issueId: string;
}

/**
 * POST /api/bot/photo — a photo plus the trigger word.
 *
 * Returns a poll for the bot to post, or `{ ignored: <why> }`. Ignoring is the
 * common case and has to be silent: a bot that replies "I could not read that"
 * to every holiday photo somebody tagged it in gets muted within a day.
 */
export async function photoToPoll(
  request: Request, env: Env,
): Promise<Response> {
  const body = await readJson<{
    groupId?: string; imageBase64?: string;
    mediaType?: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
    caption?: string; from?: string;
  }>(request);
  if (!body?.groupId || !body.imageBase64) return badRequest('need groupId and imageBase64');

  const group = await getGroup(env, body.groupId);
  if (!group) return notFound('no such house');
  if (!env.ANTHROPIC_API_KEY) return json({ ignored: 'not-configured' });

  const reading = await readMessPhoto({
    apiKey: env.ANTHROPIC_API_KEY,
    imageBase64: body.imageBase64,
    mediaType: body.mediaType ?? 'image/jpeg',
    caption: body.caption,
  });

  // Null covers all three refusals — a person in frame, nothing that needs
  // doing, or the model failing. None of them should produce chat noise.
  if (!reading) return json({ ignored: 'nothing-to-poll' });

  // One open poll per description per day. Three people photographing the same
  // sink within an hour is the normal case, not an edge case, and three
  // identical polls is how the chat turns against the bot.
  const existing = await env.DB.prepare(
    `SELECT id FROM issues
      WHERE group_id = ? AND status = 'open' AND description = ?
        AND created_at > datetime('now', '-1 day') LIMIT 1`,
  ).bind(body.groupId, reading.description).first<{ id: string }>();

  if (existing) return json({ ignored: 'already-open', issueId: existing.id });

  const issueId = newId('issue');
  await env.DB.prepare(
    `INSERT INTO issues (id, group_id, raised_by, description, closes_at, source)
     VALUES (?, ?, NULL, ?, datetime('now', '+1 day'), 'photo')`,
  ).bind(issueId, body.groupId, reading.description).run();

  const poll: PollSpec = {
    question: `${reading.description}. Was this you?`,
    options: ['Was me', 'Not me'],
    issueId,
  };
  return json({ poll, area: reading.area });
}

/**
 * POST /api/bot/vote — somebody tapped an option on a native poll.
 *
 * Same write path as replying "not me" in text, so the two routes cannot drift
 * apart and the settlement does not care which one a person used.
 */
export async function recordPollVote(
  request: Request, env: Env,
): Promise<Response> {
  const body = await readJson<{
    groupId?: string; issueId?: string; phone?: string; option?: string;
  }>(request);
  if (!body?.groupId || !body.issueId || !body.option) {
    return badRequest('need groupId, issueId and option');
  }

  const answer = /was me/i.test(body.option) ? 'was-me'
    : /not me/i.test(body.option) ? 'not-me'
    : null;
  if (!answer) return badRequest('unrecognised option');

  const phone = normalisePhone(body.phone);
  const member = phone
    ? await env.DB.prepare('SELECT id FROM members WHERE group_id = ? AND phone = ?')
        .bind(body.groupId, phone).first<{ id: string }>()
    : null;

  // A vote from a number nobody has registered is reported back rather than
  // dropped. Dropping it would name a person for staying silent when they
  // answered, which is the one mistake this system must never make.
  if (!member) return json({ ok: false, needsLink: true });

  await env.DB.prepare(
    `INSERT INTO issue_responses (issue_id, member_id, answer) VALUES (?, ?, ?)
     ON CONFLICT(issue_id, member_id) DO UPDATE SET
       answer = excluded.answer, answered_at = datetime('now')`,
  ).bind(body.issueId, member.id, answer).run();

  const counts = await env.DB.prepare(
    `SELECT answer, COUNT(*) AS n FROM issue_responses WHERE issue_id = ? GROUP BY answer`,
  ).bind(body.issueId).all<{ answer: string; n: number }>();

  const wasMe = (counts.results ?? []).find((r) => r.answer === 'was-me')?.n ?? 0;

  // Somebody owned it. Close immediately: owning up is the cheapest possible
  // outcome and it should visibly end the thread, not leave the poll sitting
  // there collecting further denials.
  if (wasMe > 0) {
    await env.DB.prepare(
      `UPDATE issues SET status = 'closed' WHERE id = ? AND status = 'open'`,
    ).bind(body.issueId).run();
  }

  return json({ ok: true, answer, closed: wasMe > 0 });
}
