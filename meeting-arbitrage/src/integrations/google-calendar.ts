/**
 * Optional Google Calendar free/busy sync.
 *
 * Prefills the grid so people tap three slots instead of twenty. It is strictly
 * an accelerator: the grid is always editable afterwards, because a calendar
 * knows you have an event at 7pm but not that it is skippable.
 *
 * Only the free/busy endpoint is used, never event listing — the narrowest
 * scope that does the job, and it returns opaque busy intervals rather than
 * what anyone is actually doing.
 */

import type { Slot, AvailabilityValue } from '../core/types.ts';

export const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.freebusy';

const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const FREEBUSY_URL = 'https://www.googleapis.com/calendar/v3/freeBusy';

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export function buildAuthUrl(config: OAuthConfig, state: string): string {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: CALENDAR_SCOPE,
    access_type: 'offline',
    include_granted_scopes: 'true',
    // Without this, a returning user is not re-issued a refresh token and the
    // connection silently expires an hour later.
    prompt: 'consent',
    state,
  });
  return `${AUTH_URL}?${params.toString()}`;
}

export interface TokenSet {
  accessToken: string;
  refreshToken?: string;
  expiresAt: string;
}

export async function exchangeCode(
  config: OAuthConfig, code: string, fetchImpl: typeof fetch = fetch,
): Promise<TokenSet> {
  const res = await fetchImpl(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  if (!res.ok) throw new Error(`token exchange failed: ${res.status}`);

  const data = await res.json() as {
    access_token: string; refresh_token?: string; expires_in: number;
  };
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: new Date(Date.now() + (data.expires_in - 60) * 1000).toISOString(),
  };
}

export async function refreshAccessToken(
  config: OAuthConfig, refreshToken: string, fetchImpl: typeof fetch = fetch,
): Promise<TokenSet> {
  const res = await fetchImpl(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) throw new Error(`token refresh failed: ${res.status}`);

  const data = await res.json() as { access_token: string; expires_in: number };
  return {
    accessToken: data.access_token,
    refreshToken,
    expiresAt: new Date(Date.now() + (data.expires_in - 60) * 1000).toISOString(),
  };
}

export interface BusyInterval { start: string; end: string }

export async function fetchBusy(
  accessToken: string, timeMin: string, timeMax: string,
  fetchImpl: typeof fetch = fetch,
): Promise<BusyInterval[]> {
  const res = await fetchImpl(FREEBUSY_URL, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ timeMin, timeMax, items: [{ id: 'primary' }] }),
  });
  if (!res.ok) throw new Error(`freeBusy failed: ${res.status}`);

  const data = await res.json() as {
    calendars?: Record<string, { busy?: BusyInterval[] }>;
  };
  return data.calendars?.primary?.busy ?? [];
}

/**
 * Turn busy intervals into suggested grid answers.
 *
 * Deliberately conservative in one direction only. A clash produces `no`,
 * which the person can override in one tap; a free slot produces nothing at
 * all rather than an assumed `yes`, because an empty calendar is not consent
 * to be booked. The engine already treats silence as zero, so this cannot
 * quietly inflate a slot's score.
 */
export function suggestFromBusy(
  slots: Slot[], busy: BusyInterval[],
): Record<string, AvailabilityValue> {
  const intervals = busy
    .map((b) => ({ start: Date.parse(b.start), end: Date.parse(b.end) }))
    .filter((b) => Number.isFinite(b.start) && Number.isFinite(b.end));

  const suggestions: Record<string, AvailabilityValue> = {};

  for (const slot of slots) {
    const start = Date.parse(slot.startUtc);
    const end = start + slot.durationMins * 60_000;
    // Half-open overlap: an event ending exactly as the slot starts is fine.
    const clashes = intervals.some((b) => start < b.end && end > b.start);
    if (clashes) suggestions[slot.id] = 'no';
  }

  return suggestions;
}
