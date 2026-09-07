import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  parseEventUrl, fetchEventMeta, toActivity, toDirectorySubmission, platformLabel,
} from '../src/ripple/event-links.ts';

describe('parseEventUrl — recognising links', () => {
  const cases: Array<[string, string, string]> = [
    ['https://lu.ma/abc123', 'luma', 'abc123'],
    ['https://luma.com/e/xyz789', 'luma', 'xyz789'],
    ['https://partiful.com/e/AbC-123_x', 'partiful', 'AbC-123_x'],
    ['https://www.eventbrite.com.au/e/warehouse-jazz-tickets-1234567890', 'eventbrite', '1234567890'],
    ['https://events.humanitix.com/big-sweat-bathhouse', 'humanitix', 'big-sweat-bathhouse'],
    ['https://www.meetup.com/ripple-social-club/events/305512345/', 'meetup', '305512345'],
  ];

  for (const [url, platform, id] of cases) {
    test(`reads ${platform} from ${url}`, () => {
      const parsed = parseEventUrl(url)!;
      assert.ok(parsed, `failed to parse ${url}`);
      assert.equal(parsed.platform, platform);
      assert.equal(parsed.sourceId, id);
    });
  }

  test('strips tracking parameters so re-pastes dedupe', () => {
    const a = parseEventUrl('https://lu.ma/abc123?utm_source=whatsapp&fbclid=xyz')!;
    const b = parseEventUrl('https://lu.ma/abc123')!;
    assert.equal(a.canonicalUrl, b.canonicalUrl);
    assert.ok(!a.canonicalUrl.includes('utm_'));
  });

  test('normalises host case and a trailing slash', () => {
    const a = parseEventUrl('https://LU.MA/abc123/')!;
    const b = parseEventUrl('https://lu.ma/abc123')!;
    assert.equal(a.canonicalUrl, b.canonicalUrl);
  });

  test('keeps a meaningful query parameter', () => {
    const parsed = parseEventUrl('https://partiful.com/e/abc?tk=secret')!;
    assert.ok(parsed.canonicalUrl.includes('tk=secret'));
  });
});

describe('parseEventUrl — rejecting everything else', () => {
  const rejected = [
    ['not a url at all', 'plain text'],
    ['', 'empty'],
    ['https://example.com/e/abc', 'unknown host'],
    ['https://lu.ma.evil.com/abc123', 'lookalike host'],
    ['https://evil.com/lu.ma/abc123', 'host in the path'],
    ['http://169.254.169.254/latest/meta-data/', 'cloud metadata endpoint'],
    ['http://127.0.0.1:8787/api/bot/outbox', 'loopback'],
    ['http://[::1]/admin', 'ipv6 loopback'],
    ['http://192.168.1.1/', 'private range'],
    ['file:///etc/passwd', 'file scheme'],
    ['javascript:alert(1)', 'javascript scheme'],
    ['data:text/html,<script>', 'data scheme'],
    ['https://lu.ma/', 'no event id'],
    ['https://partiful.com/abc', 'wrong path shape'],
    ['https://www.meetup.com/some-group/', 'group page, not an event'],
  ];

  for (const [url, why] of rejected) {
    test(`rejects ${why}`, () => {
      assert.equal(parseEventUrl(url), null, `should not have parsed: ${url}`);
    });
  }

  test('an unparsed link is what keeps the fetcher off arbitrary hosts', () => {
    // The SSRF guard is structural: fetchEventMeta only ever takes a parse
    // result, and nothing internal parses.
    for (const url of ['http://169.254.169.254/', 'http://localhost/', 'https://internal.corp/']) {
      assert.equal(parseEventUrl(url), null);
    }
  });
});

describe('fetchEventMeta', () => {
  const parsed = parseEventUrl('https://lu.ma/abc123')!;

  const page = (body: string) => (async () => ({
    ok: true, text: async () => body,
  })) as unknown as typeof fetch;

  test('reads Open Graph title and description', async () => {
    const meta = await fetchEventMeta(parsed, page(`
      <html><head>
      <meta property="og:title" content="Warehouse Jazz Night">
      <meta property="og:description" content="Doors 8pm, Marrickville">
      <meta property="og:image" content="https://cdn.lu.ma/x.jpg">
      </head></html>`));

    assert.equal(meta.title, 'Warehouse Jazz Night');
    assert.equal(meta.description, 'Doors 8pm, Marrickville');
    assert.equal(meta.imageUrl, 'https://cdn.lu.ma/x.jpg');
  });

  test('handles attributes in the other order', async () => {
    const meta = await fetchEventMeta(parsed, page(
      `<meta content="Reversed Order Party" property="og:title">`));
    assert.equal(meta.title, 'Reversed Order Party');
  });

  test('decodes HTML entities in titles', async () => {
    const meta = await fetchEventMeta(parsed, page(
      `<meta property="og:title" content="Jazz &amp; Noodles &#39;26">`));
    assert.equal(meta.title, "Jazz & Noodles '26");
  });

  test('a dead link degrades to empty rather than throwing', async () => {
    const dead = (async () => { throw new Error('ENOTFOUND'); }) as unknown as typeof fetch;
    assert.deepEqual(await fetchEventMeta(parsed, dead), {});

    const notOk = (async () => ({ ok: false, text: async () => '' })) as unknown as typeof fetch;
    assert.deepEqual(await fetchEventMeta(parsed, notOk), {});
  });

  test('a page with no tags still returns cleanly', async () => {
    assert.deepEqual(await fetchEventMeta(parsed, page('<html><body>hi</body></html>')), {});
  });
});

describe('toActivity', () => {
  const parsed = parseEventUrl('https://partiful.com/e/abc123')!;

  test('an unreadable link still becomes a nameable option', () => {
    const a = toActivity(parsed, {}, 40);
    assert.equal(a.label, 'Partiful event');
    assert.equal(a.id, 'link-partiful-abc123');
    assert.ok(a.tags.includes('link'));
  });

  test('an unknown price defaults to the ceiling, never to free', () => {
    const a = toActivity(parsed, { title: 'Rooftop thing' }, 45);
    assert.equal(a.estCostAud, 45,
      'a ticketed event that looks free would quietly blow the budget');
  });

  test('long titles are truncated so cards stay readable', () => {
    const a = toActivity(parsed, { title: 'A'.repeat(120) }, 30);
    assert.ok(a.label.length <= 42);
    assert.ok(a.label.endsWith('…'));
  });

  test('the id is stable across re-pastes of the same event', () => {
    const again = parseEventUrl('https://partiful.com/e/abc123?utm_source=ig')!;
    assert.equal(toActivity(again, {}, 30).id, toActivity(parsed, {}, 30).id);
  });
});

describe('toDirectorySubmission', () => {
  test('a pasted link is held for review, never auto-published', () => {
    const parsed = parseEventUrl('https://lu.ma/jazz9')!;
    const sub = toDirectorySubmission(parsed, { title: 'Warehouse Jazz' }, 'isaac');

    assert.equal(sub.status, 'pending_review',
      'anyone with a link could otherwise write to the directory');
    assert.equal(sub.submittedBy, 'isaac');
    assert.equal(sub.canonicalUrl, 'https://lu.ma/jazz9');
    assert.equal(sub.title, 'Warehouse Jazz');
  });

  test('falls back to the platform name when there is no title', () => {
    const parsed = parseEventUrl('https://lu.ma/jazz9')!;
    assert.equal(toDirectorySubmission(parsed, {}, 'isaac').title, 'Luma event');
  });
});

describe('platformLabel', () => {
  test('labels read the way people say them', () => {
    assert.equal(platformLabel('luma'), 'Luma');
    assert.equal(platformLabel('partiful'), 'Partiful');
    assert.equal(platformLabel('humanitix'), 'Humanitix');
  });
});
