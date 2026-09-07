import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  buildAuthUrl, suggestFromBusy, exchangeCode, fetchBusy, CALENDAR_SCOPE,
} from '../src/integrations/google-calendar.ts';
import { generateGrid } from '../src/core/slots.ts';

const TZ = 'Australia/Sydney';
const CONFIG = {
  clientId: 'id.apps.googleusercontent.com',
  clientSecret: 'secret',
  redirectUri: 'https://example.workers.dev/api/calendar/callback',
};

describe('oauth url', () => {
  test('requests only the free/busy scope', () => {
    const url = new URL(buildAuthUrl(CONFIG, 'state123'));
    assert.equal(url.searchParams.get('scope'), CALENDAR_SCOPE);
    assert.ok(!url.searchParams.get('scope')!.includes('calendar.events'),
      'never ask for more than free/busy');
  });

  test('asks for offline access and forces consent so refresh tokens arrive', () => {
    const url = new URL(buildAuthUrl(CONFIG, 'state123'));
    assert.equal(url.searchParams.get('access_type'), 'offline');
    assert.equal(url.searchParams.get('prompt'), 'consent');
    assert.equal(url.searchParams.get('state'), 'state123');
  });
});

describe('token exchange', () => {
  test('sets an expiry slightly early to avoid racing the clock', async () => {
    const fetchImpl = (async () => ({
      ok: true,
      json: async () => ({ access_token: 'at', refresh_token: 'rt', expires_in: 3600 }),
    })) as unknown as typeof fetch;

    const before = Date.now();
    const tokens = await exchangeCode(CONFIG, 'code', fetchImpl);
    const ttl = Date.parse(tokens.expiresAt) - before;

    assert.equal(tokens.accessToken, 'at');
    assert.equal(tokens.refreshToken, 'rt');
    assert.ok(ttl < 3600_000, 'expires before Google says it does');
    assert.ok(ttl > 3400_000, 'but not so early it thrashes');
  });

  test('a failed exchange throws rather than returning a broken token', async () => {
    const fetchImpl = (async () => ({ ok: false, status: 400 })) as unknown as typeof fetch;
    await assert.rejects(() => exchangeCode(CONFIG, 'bad', fetchImpl), /token exchange failed/);
  });
});

describe('fetchBusy', () => {
  test('reads the primary calendar and tolerates an empty response', async () => {
    let body: any = null;
    const fetchImpl = (async (_url: string, init: any) => {
      body = JSON.parse(init.body);
      return { ok: true, json: async () => ({ calendars: {} }) };
    }) as unknown as typeof fetch;

    const busy = await fetchBusy('token', '2026-09-01T00:00:00Z', '2026-09-14T00:00:00Z', fetchImpl);
    assert.deepEqual(busy, []);
    assert.deepEqual(body.items, [{ id: 'primary' }]);
  });
});

describe('suggestFromBusy', () => {
  const slots = generateGrid({
    startDate: '2026-09-07', days: 1, times: ['18:00', '19:30', '21:00'],
    durationMins: 60, timeZone: TZ,
  });
  const [six, half7, nine] = slots;

  test('marks a clashing slot as no', () => {
    const busy = [{ start: half7.startUtc, end: new Date(Date.parse(half7.startUtc) + 3600_000).toISOString() }];
    const suggestions = suggestFromBusy(slots, busy);
    assert.equal(suggestions[half7.id], 'no');
  });

  test('never guesses yes — an empty calendar is not consent', () => {
    const suggestions = suggestFromBusy(slots, []);
    assert.deepEqual(suggestions, {}, 'free slots produce no answer at all');
  });

  test('an event ending exactly as a slot starts does not clash', () => {
    const busy = [{
      start: new Date(Date.parse(half7.startUtc) - 3600_000).toISOString(),
      end: half7.startUtc,
    }];
    assert.equal(suggestFromBusy([half7], busy)[half7.id], undefined);
  });

  test('a long event blocks every slot it covers', () => {
    const busy = [{
      start: new Date(Date.parse(six.startUtc) - 1800_000).toISOString(),
      end: new Date(Date.parse(nine.startUtc) + 1800_000).toISOString(),
    }];
    const suggestions = suggestFromBusy(slots, busy);
    assert.equal(Object.keys(suggestions).length, 3);
    assert.ok(Object.values(suggestions).every((v) => v === 'no'));
  });

  test('malformed intervals are skipped rather than throwing', () => {
    const busy = [{ start: 'not-a-date', end: 'also-bad' }, { start: six.startUtc, end: nine.startUtc }];
    const suggestions = suggestFromBusy(slots, busy);
    assert.equal(suggestions[six.id], 'no');
  });
});
