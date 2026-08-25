/**
 * D1 access helpers.
 *
 * Rows are loaded into the exact shapes the engine expects, so route handlers
 * stay thin and the engine never learns what SQLite is.
 */

import type { Participant, ResponseMap, Slot, AvailabilityValue } from './core/types.ts';

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  DEFAULT_TIMEZONE: string;
  GOOGLE_PLACES_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  BOT_TOKEN?: string;
  GOOGLE_OAUTH_ID?: string;
  GOOGLE_OAUTH_SECRET?: string;
}

export interface GroupRow {
  id: string;
  kind: 'banksia' | 'ripple';
  name: string;
  timezone: string;
  settings_json: string;
}

export interface MemberRow {
  id: string;
  group_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  suburb: string | null;
  attendance_rate: number;
  is_required: number;
}

export interface PollRow {
  id: string;
  group_id: string;
  kind: 'anchor' | 'refix' | 'hangout';
  title: string;
  slots_json: string;
  status: string;
  anchor_slot_id: string | null;
  closes_at: string | null;
}

export function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
}

export async function getGroup(env: Env, groupId: string): Promise<GroupRow | null> {
  return env.DB.prepare('SELECT * FROM groups WHERE id = ?')
    .bind(groupId).first<GroupRow>();
}

export async function getPoll(env: Env, pollId: string): Promise<PollRow | null> {
  return env.DB.prepare('SELECT * FROM polls WHERE id = ?')
    .bind(pollId).first<PollRow>();
}

export function slotsOf(poll: PollRow): Slot[] {
  return JSON.parse(poll.slots_json) as Slot[];
}

/**
 * Load members as engine `Participant`s, with their standing conflicts.
 *
 * Two queries rather than a join, because a join would fan members out by
 * conflict count and the regrouping is more code than the extra round trip.
 */
export async function loadParticipants(env: Env, groupId: string): Promise<Participant[]> {
  const [membersResult, conflictsResult] = await Promise.all([
    env.DB.prepare('SELECT * FROM members WHERE group_id = ? ORDER BY created_at, name')
      .bind(groupId).all<MemberRow>(),
    env.DB.prepare(
      `SELECT sc.* FROM standing_conflicts sc
         JOIN members m ON m.id = sc.member_id
        WHERE m.group_id = ?`,
    ).bind(groupId).all<{
      member_id: string; weekday: number; start_min: number; end_min: number; label: string;
    }>(),
  ]);

  const byMember = new Map<string, Participant['standingConflicts']>();
  for (const c of conflictsResult.results ?? []) {
    const list = byMember.get(c.member_id) ?? [];
    list.push({ weekday: c.weekday, startMin: c.start_min, endMin: c.end_min, label: c.label });
    byMember.set(c.member_id, list);
  }

  return (membersResult.results ?? []).map((m) => ({
    id: m.id,
    name: m.name,
    required: m.is_required === 1,
    attendanceRate: m.attendance_rate,
    standingConflicts: byMember.get(m.id) ?? [],
  }));
}

export async function loadResponses(env: Env, pollId: string): Promise<ResponseMap> {
  const { results } = await env.DB.prepare(
    'SELECT member_id, slot_id, value FROM responses WHERE poll_id = ?',
  ).bind(pollId).all<{ member_id: string; slot_id: string; value: AvailabilityValue }>();

  const map: ResponseMap = {};
  for (const row of results ?? []) {
    (map[row.member_id] ??= {})[row.slot_id] = row.value;
  }
  return map;
}

export async function loadMemberNames(env: Env, groupId: string): Promise<Record<string, string>> {
  const { results } = await env.DB.prepare('SELECT id, name FROM members WHERE group_id = ?')
    .bind(groupId).all<{ id: string; name: string }>();
  return Object.fromEntries((results ?? []).map((r) => [r.id, r.name]));
}

/** Resolve a share-link token to the member it identifies. */
export async function memberFromToken(
  env: Env, token: string,
): Promise<{ memberId: string; groupId: string } | null> {
  const row = await env.DB.prepare(
    `SELECT member_id, group_id FROM member_tokens
      WHERE token = ? AND expires_at > datetime('now')`,
  ).bind(token).first<{ member_id: string; group_id: string }>();
  return row ? { memberId: row.member_id, groupId: row.group_id } : null;
}

export async function issueToken(
  env: Env, memberId: string, groupId: string, days = 120,
): Promise<string> {
  const token = crypto.randomUUID().replace(/-/g, '');
  const expires = new Date(Date.now() + days * 86_400_000).toISOString();
  await env.DB.prepare(
    'INSERT INTO member_tokens (token, member_id, group_id, expires_at) VALUES (?, ?, ?, ?)',
  ).bind(token, memberId, groupId, expires).run();
  return token;
}

/** Queue a message for the WhatsApp bot or the email sender to pick up. */
export async function enqueue(
  env: Env, groupId: string, channel: 'whatsapp' | 'email', target: string, body: string,
): Promise<void> {
  await env.DB.prepare(
    'INSERT INTO outbox (id, group_id, channel, target, body) VALUES (?, ?, ?, ?, ?)',
  ).bind(newId('out'), groupId, channel, target, body).run();
}

/** Group engine config: defaults overlaid with whatever the group has set. */
export function settingsOf<T extends object>(group: GroupRow, defaults: T): T {
  try {
    return { ...defaults, ...JSON.parse(group.settings_json) };
  } catch {
    return defaults;
  }
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export function badRequest(message: string): Response {
  return json({ error: message }, 400);
}

export function notFound(message = 'not found'): Response {
  return json({ error: message }, 404);
}

export function unauthorized(message = 'bad or expired link'): Response {
  return json({ error: message }, 401);
}

/** Monday of the week containing `date`, as YYYY-MM-DD. */
export function weekOf(date: Date = new Date()): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay();
  d.setUTCDate(d.getUTCDate() - (day === 0 ? 6 : day - 1));
  return d.toISOString().slice(0, 10);
}
