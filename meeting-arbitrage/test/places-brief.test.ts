import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { searchVenues, priceLevelsForBudget, rerankHubsByVenues, nearestVenue } from '../src/ripple/places.ts';
import { buildBrief, writeBlurb, renderChatMessage } from '../src/ripple/brief.ts';
import { generateGrid } from '../src/core/slots.ts';
import { rankHubs } from '../src/ripple/geo.ts';
import { rankActivities, buildItinerary, type HangoutMember } from '../src/ripple/activities.ts';

const TZ = 'Australia/Sydney';

const googleResponse = (names: string[]) => ({
  ok: true,
  json: async () => ({
    places: names.map((n, i) => ({
      displayName: { text: n },
      formattedAddress: `${i + 1} Example St, Sydney NSW`,
      location: { latitude: -33.87 - i * 0.001, longitude: 151.21 },
      rating: 4.2,
      userRatingCount: 300,
      priceLevel: 'PRICE_LEVEL_MODERATE',
      googleMapsUri: 'https://maps.google.com/?cid=1',
      currentOpeningHours: { openNow: true },
    })),
  }),
});

describe('places', () => {
  test('budget maps onto sensible price buckets', () => {
    assert.ok(priceLevelsForBudget(15).includes('PRICE_LEVEL_INEXPENSIVE'));
    assert.ok(!priceLevelsForBudget(15).includes('PRICE_LEVEL_EXPENSIVE'));
    assert.ok(priceLevelsForBudget(120).includes('PRICE_LEVEL_VERY_EXPENSIVE'));
  });

  test('without a key it returns labelled samples and invents nothing', async () => {
    const venues = await searchVenues({ query: 'pool hall', center: { lat: -33.87, lng: 151.21 } });
    assert.ok(venues.length > 0, 'a demo should still show the shape of the answer');
    for (const v of venues) {
      assert.equal(v.source, 'sample');
      assert.equal(v.rating, undefined, 'never fabricate a rating');
      assert.equal(v.priceLevel, undefined, 'never fabricate a price');
    }
  });

  test('with a key it parses the Places response', async () => {
    let captured: any = null;
    const fetchImpl = (async (_url: string, init: any) => {
      captured = JSON.parse(init.body);
      return googleResponse(['Kingpin', 'Strike']);
    }) as unknown as typeof fetch;

    const venues = await searchVenues({
      query: 'bowling alley', center: { lat: -33.87, lng: 151.21 },
      apiKey: 'test-key', budgetAud: 30, fetchImpl,
    });

    assert.equal(venues.length, 2);
    assert.equal(venues[0].name, 'Kingpin');
    assert.equal(venues[0].source, 'google');
    assert.equal(venues[0].priceLevel, 'MODERATE');
    assert.equal(venues[0].openNow, true);
    assert.equal(captured.textQuery, 'bowling alley');
    assert.ok(captured.priceLevels.includes('PRICE_LEVEL_MODERATE'));
    assert.ok(captured.locationBias.circle.radius > 0);
  });

  test('an API failure degrades to samples rather than throwing', async () => {
    const fetchImpl = (async () => ({ ok: false, json: async () => ({}) })) as unknown as typeof fetch;
    const venues = await searchVenues({
      query: 'nightclub', center: { lat: -33.87, lng: 151.21 }, apiKey: 'k', fetchImpl,
    });
    assert.ok(venues.every((v) => v.source === 'sample'));
  });

  test('a thrown network error also degrades to samples', async () => {
    const fetchImpl = (async () => { throw new Error('ECONNRESET'); }) as unknown as typeof fetch;
    const venues = await searchVenues({
      query: 'pub', center: { lat: -33.87, lng: 151.21 }, apiKey: 'k', fetchImpl,
    });
    assert.ok(venues.every((v) => v.source === 'sample'));
  });

  test('venue density re-ranks hubs — this is what sends clubbing to the city', async () => {
    const hubs = [
      { hubKey: 'burwood', location: { lat: -33.8776, lng: 151.1039 }, cost: 200 },
      { hubKey: 'darlinghurst', location: { lat: -33.8797, lng: 151.2199 }, cost: 215 },
    ];
    // Burwood returns nothing for a nightclub; Darlinghurst returns plenty.
    const fetchImpl = (async (_url: string, init: any) => {
      const body = JSON.parse(init.body);
      const isDarlo = body.locationBias.circle.center.longitude > 151.15;
      return isDarlo
        ? googleResponse(['Club A', 'Club B', 'Club C', 'Club D'])
        : { ok: true, json: async () => ({ places: [] }) };
    }) as unknown as typeof fetch;

    const ranked = await rerankHubsByVenues(hubs, 'nightclub', { apiKey: 'k', fetchImpl });

    assert.equal(ranked[0].hub.hubKey, 'darlinghurst',
      'the cheaper trip loses when the activity does not exist there');
    assert.equal(ranked[0].density, 4);
    assert.equal(ranked[1].density, 0);
    assert.ok(ranked[1].adjustedCost > ranked[0].adjustedCost);
  });

  test('nearestVenue picks the closest located option', () => {
    const venues = [
      { name: 'far', address: '', location: { lat: -33.95, lng: 151.21 }, source: 'google' as const },
      { name: 'near', address: '', location: { lat: -33.871, lng: 151.21 }, source: 'google' as const },
    ];
    assert.equal(nearestVenue(venues, { lat: -33.87, lng: 151.21 })!.name, 'near');
  });
});

describe('event brief', () => {
  const slot = generateGrid({
    startDate: '2026-09-05', days: 1, times: ['19:00'], durationMins: 240, timeZone: TZ,
  })[0];

  const members: HangoutMember[] = [
    { id: 'hassaan', name: 'Hassaan', suburb: 'surry-hills', budgetAud: 60, approvals: ['eats-casual', 'pool'] },
    { id: 'isaac', name: 'Isaac', suburb: 'newtown', budgetAud: 60, approvals: ['eats-casual', 'pool'] },
    { id: 'kez', name: 'Kez', suburb: 'glebe', budgetAud: 50, approvals: ['eats-casual', 'pool'] },
  ];

  function makeBrief() {
    const itinerary = buildItinerary(rankActivities(members), members);
    const hub = rankHubs(members, 1)[0];
    return buildBrief({
      slot, itinerary, hub, venues: [],
      names: Object.fromEntries(members.map((m) => [m.id, m.name])),
      attendeeIds: members.map((m) => m.id),
      absentIds: ['pete'],
      timezone: TZ,
    });
  }

  test('is complete and correct with no API keys at all', () => {
    const brief = makeBrief();
    assert.ok(brief.title.length > 0);
    assert.match(brief.whenLocal, /Sat|Sep/);
    assert.ok(brief.stops.length > 0);
    assert.ok(brief.costPerPersonAud > 0);
    assert.deepEqual(brief.attendees, ['Hassaan', 'Isaac', 'Kez']);
    assert.deepEqual(brief.absent, ['pete']);
    assert.ok(brief.summary.length > 0);
    assert.equal(brief.blurb, undefined, 'no model, no blurb, still a brief');
  });

  test('travel is listed worst-first, since that is what people check', () => {
    const brief = makeBrief();
    const minutes = brief.travel.map((t) => t.minutes);
    assert.deepEqual(minutes, [...minutes].sort((a, b) => b - a));
    assert.equal(brief.longestTripMins, minutes[0]);
  });

  test('produces a Google Calendar link with a real time range', () => {
    const brief = makeBrief();
    const url = new URL(brief.calendar.googleUrl);
    assert.equal(url.searchParams.get('action'), 'TEMPLATE');
    const [start, end] = url.searchParams.get('dates')!.split('/');
    assert.match(start, /^\d{8}T\d{6}Z$/);
    assert.ok(end > start, 'the event ends after it starts');
  });

  test('produces an ICS that parses as one well-formed event', () => {
    const ics = makeBrief().calendar.ics;
    assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
    assert.match(ics, /END:VCALENDAR$/);
    assert.equal((ics.match(/BEGIN:VEVENT/g) ?? []).length, 1);
    for (const field of ['UID:', 'DTSTART:', 'DTEND:', 'SUMMARY:', 'LOCATION:']) {
      assert.ok(ics.includes(field), `missing ${field}`);
    }
    assert.ok(ics.split('\r\n').every((l) => !l.startsWith(' ') || l.length > 1));
  });

  test('escapes commas in ICS text so calendars do not drop the event', () => {
    const brief = makeBrief();
    const locationLine = brief.calendar.ics.split('\r\n').find((l) => l.startsWith('LOCATION:'))!;
    assert.ok(locationLine.includes('\\,'), 'commas must be escaped per RFC 5545');
  });

  test('renders a chat message that fits in a WhatsApp bubble', () => {
    const brief = makeBrief();
    const msg = renderChatMessage(brief);
    assert.ok(msg.includes(brief.title));
    assert.ok(msg.includes('$'));
    assert.ok(msg.includes('Hassaan'));
    assert.ok(msg.split('\n').length <= 10, 'short enough to read on a phone');
    assert.ok(!msg.includes('|'), 'no markdown tables in a chat app');
  });

  test('venue names appear only when they are real', () => {
    const itinerary = buildItinerary(rankActivities(members), members);
    const hub = rankHubs(members, 1)[0];
    const brief = buildBrief({
      slot, itinerary, hub,
      venues: [{ name: 'Sample pub venue 1', address: '', source: 'sample' }],
      names: Object.fromEntries(members.map((m) => [m.id, m.name])),
      attendeeIds: members.map((m) => m.id), absentIds: [], timezone: TZ,
    });
    assert.ok(!brief.chatMessage.includes('Sample pub venue 1'),
      'a placeholder venue must never be pasted into the group chat as fact');
  });

  test('writeBlurb returns null without a key rather than throwing', async () => {
    assert.equal(await writeBlurb(makeBrief()), null);
  });
});
