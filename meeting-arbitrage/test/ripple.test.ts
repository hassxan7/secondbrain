import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  SUBURBS, haversineKm, centroid, rankHubs, estimateTravelMinutes, groupCentroid,
} from '../src/ripple/geo.ts';
import {
  ACTIVITIES, ACTIVITY_BY_ID, rankActivities, buildItinerary, scorePlan,
  mergeRippleEvents, DEFAULT_HANGOUT_CONFIG, type HangoutMember, type Activity,
} from '../src/ripple/activities.ts';
import { generateGrid } from '../src/core/slots.ts';

const TZ = 'Australia/Sydney';

const member = (
  id: string, suburb: string, budgetAud: number, approvals: string[],
): HangoutMember => ({ id, name: id, suburb, budgetAud, approvals });

describe('geo', () => {
  test('haversine matches known Sydney distances', () => {
    const km = haversineKm(SUBURBS['sydney-cbd'], SUBURBS['parramatta']);
    assert.ok(km > 19 && km < 21, `CBD to Parramatta should be ~20km, got ${km.toFixed(1)}`);
    assert.equal(Math.round(haversineKm(SUBURBS['newtown'], SUBURBS['newtown'])), 0);
  });

  test('centroid of one point is that point', () => {
    const c = centroid([{ lat: -33.8688, lng: 151.2093 }]);
    assert.ok(Math.abs(c.lat + 33.8688) < 1e-9);
    assert.ok(Math.abs(c.lng - 151.2093) < 1e-9);
  });

  test('travel estimate is monotonic and continuous across every band', () => {
    let previous = -1;
    // Step across both piecewise boundaries (2km and 8km) in fine increments,
    // which is what caught the discontinuity a coarse sample missed.
    for (let km = 0; km <= 40; km += 0.1) {
      const minutes = estimateTravelMinutes(km);
      assert.ok(minutes >= previous, `going further got quicker at ${km.toFixed(1)}km`);
      previous = minutes;
    }
  });

  test('travel estimates stay in a believable range for Sydney', () => {
    const cbdToParramatta = estimateTravelMinutes(
      haversineKm(SUBURBS['sydney-cbd'], SUBURBS['parramatta']),
    );
    assert.ok(cbdToParramatta > 35 && cbdToParramatta < 70,
      `CBD to Parramatta should read as a real trip, got ${cbdToParramatta} min`);

    const newtownToRedfern = estimateTravelMinutes(
      haversineKm(SUBURBS['newtown'], SUBURBS['redfern']),
    );
    assert.ok(newtownToRedfern < 25, `two inner-west stops apart, got ${newtownToRedfern} min`);
  });

  test('an inner-west group meets in the inner west, not the city', () => {
    const group = ['newtown', 'marrickville', 'enmore', 'erskineville', 'camperdown']
      .map((s, i) => member(`p${i}`, s, 60, []));
    const hubs = rankHubs(group, 4);

    assert.equal(hubs[0].hubKey, 'newtown');
    const topTwo = hubs.slice(0, 2).map((h) => h.hubKey);
    assert.ok(!topTwo.includes('sydney-cbd'), 'no reflexive trip to Town Hall');
    assert.ok(hubs[0].meanMinutes < 20);
  });

  test('a spread group meets near the middle, not on one member’s doorstep', () => {
    const group = ['manly', 'liverpool', 'hurstville', 'chatswood', 'bondi-junction']
      .map((s, i) => member(`p${i}`, s, 60, []));
    const hubs = rankHubs(group, 8);

    // Chatswood is free for the member who lives there and therefore wins on
    // raw total, while handing Liverpool the longest trip of the night.
    assert.notEqual(hubs[0].hubKey, 'chatswood');
    const chatswood = hubs.find((h) => h.hubKey === 'chatswood')!;
    assert.ok(hubs[0].maxMinutes < chatswood.maxMinutes,
      'the winning hub shortens the worst journey');
  });

  test('fairness outranks raw total — the worst trip is what makes people bail', () => {
    const group = ['manly', 'liverpool', 'hurstville', 'chatswood', 'bondi-junction']
      .map((s, i) => member(`p${i}`, s, 60, []));
    const hubs = rankHubs(group, 20);

    const cheapestTotal = [...hubs].sort((a, b) => a.totalMinutes - b.totalMinutes)[0];
    assert.ok(hubs[0].totalMinutes >= cheapestTotal.totalMinutes,
      'the winner is not simply the lowest total');
    assert.ok(hubs[0].maxMinutes < cheapestTotal.maxMinutes,
      'it trades a little total travel for a much shorter worst trip');
    assert.ok(hubs[0].cost <= cheapestTotal.cost);
  });

  test('a tight group is cheap for everyone, with no one carrying the trip', () => {
    const group = ['newtown', 'marrickville', 'enmore', 'erskineville', 'camperdown']
      .map((s, i) => member(`p${i}`, s, 60, []));
    const hub = rankHubs(group, 1)[0];
    assert.ok(hub.maxMinutes <= 25, `nobody should travel far, worst was ${hub.maxMinutes} min`);
    assert.ok(hub.kmFromCentroid < 3, 'and it sits near the group’s centre of mass');
  });

  test('reports the worst individual journey, not just the average', () => {
    const group = [member('a', 'manly', 60, []), member('b', 'liverpool', 60, [])];
    const hub = rankHubs(group, 1)[0];
    assert.ok(hub.maxMinutes >= hub.meanMinutes);
    assert.ok(hub.spreadMinutes >= 0);
    assert.equal(hub.perMember.length, 2);
  });

  test('rejects an unknown suburb loudly', () => {
    assert.throws(() => groupCentroid([member('a', 'narnia', 60, [])]), /unknown suburb/);
  });
});

describe('activity ranking', () => {
  const attendees = [
    member('a', 'newtown', 80, ['bowling', 'pool', 'clubbing']),
    member('b', 'redfern', 80, ['bowling', 'pool']),
    member('c', 'glebe', 80, ['bowling', 'eats-casual']),
    member('d', 'marrickville', 20, ['bowling', 'pool', 'eats-casual']),
  ];

  test('approval voting surfaces the thing most people ticked', () => {
    // Equal budgets, so popularity is the only thing in play.
    const evenlyFunded = attendees.map((m) => ({ ...m, budgetAud: 100 }));
    const ranked = rankActivities(evenlyFunded);
    assert.equal(ranked[0].activity.id, 'bowling', 'everyone ticked bowling');
    assert.equal(ranked[0].approvals.length, 4);
  });

  test('a cheaper option outranks a more popular one that prices someone out', () => {
    // d has $20. Bowling (~$25) is unanimous but leaves d behind; pool (~$15)
    // is one vote short and leaves nobody behind. Pool should win.
    const ranked = rankActivities(attendees);
    const bowling = ranked.find((r) => r.activity.id === 'bowling')!;
    const pool = ranked.find((r) => r.activity.id === 'pool')!;

    assert.equal(bowling.approvals.length, 4);
    assert.equal(pool.approvals.length, 3);
    assert.deepEqual(bowling.pricedOut, ['d']);
    assert.deepEqual(pool.pricedOut, []);
    assert.ok(pool.score > bowling.score,
      'including everyone is worth more than one extra vote');
    assert.equal(ranked[0].activity.id, 'pool');
  });

  test('someone on a tight budget is counted as priced out, not ignored', () => {
    const ranked = rankActivities(attendees);
    const clubbing = ranked.find((r) => r.activity.id === 'clubbing')!;
    assert.deepEqual(clubbing.pricedOut, ['d'], 'd has $20 and clubbing is ~$45');
    assert.match(clubbing.reasons.join(' '), /over budget for 1 person/);
  });

  test('scoped to attendees — the best activity depends on who is coming', () => {
    const withoutD = attendees.filter((m) => m.id !== 'd');
    const ranked = rankActivities(withoutD);
    const clubbing = ranked.find((r) => r.activity.id === 'clubbing')!;
    assert.deepEqual(clubbing.pricedOut, [], 'nobody is priced out once d is not coming');
  });

  test('a curated Ripple event competes head-to-head with generic activities', () => {
    const rippleEvent: Activity = {
      id: 'ripple-jazz', label: 'Warehouse jazz night', emoji: '🎷', estCostAud: 30,
      durationMins: 180, category: 'nightlife', placesQuery: '', timeOfDay: 'night',
      sequenceRank: 4, tags: ['curated'],
    };
    const catalogue = mergeRippleEvents([rippleEvent]);
    const voters = attendees.map((m) => ({ ...m, approvals: [...m.approvals, 'ripple-jazz'] }));
    const ranked = rankActivities(voters, catalogue);

    const jazz = ranked.find((r) => r.activity.id === 'ripple-jazz')!;
    assert.equal(jazz.activity.rippleEvent, true);
    assert.equal(jazz.approvals.length, 4);
    assert.match(jazz.reasons.join(' '), /curated Ripple event/);
  });
});

describe('itinerary — multiple stops, tightest budget wins', () => {
  const attendees = [
    member('a', 'newtown', 80, ['eats-casual', 'pool', 'clubbing']),
    member('b', 'redfern', 80, ['eats-casual', 'pool', 'clubbing']),
    member('c', 'glebe', 80, ['eats-casual', 'pool', 'clubbing']),
    member('d', 'marrickville', 50, ['eats-casual', 'pool', 'clubbing']),
  ];

  test('the ceiling is the lowest budget in the group, not the average', () => {
    const it = buildItinerary(rankActivities(attendees), attendees);
    assert.equal(it.budgetCeilingAud, 50, 'd sets the ceiling');
    assert.ok(it.totalCostAud <= 50);
    assert.deepEqual(it.pricedOut, [], 'nobody gets left behind on money');
  });

  test('chains several stops rather than forcing one choice', () => {
    const it = buildItinerary(rankActivities(attendees), attendees);
    assert.ok(it.stops.length >= 2, `expected a multi-stop night, got ${it.summary}`);
    const ids = it.stops.map((s) => s.activity.id);
    assert.ok(ids.includes('eats-casual') && ids.includes('pool'));
    assert.ok(!ids.includes('clubbing'), '$45 club on top of dinner blows d’s $50 cap');
  });

  test('orders the night food → games → drinks → club', () => {
    const it = buildItinerary(rankActivities(attendees), attendees);
    const ranks = it.stops.map((s) => s.activity.sequenceRank);
    assert.deepEqual(ranks, [...ranks].sort((x, y) => x - y), 'dinner does not come after the club');
  });

  test('one stop per category, so it is a night rather than three dinners', () => {
    const foodLovers = attendees.map((m) => ({
      ...m, budgetAud: 200, approvals: ['eats-casual', 'eats-nice', 'yum-cha', 'pool'],
    }));
    const it = buildItinerary(rankActivities(foodLovers), foodLovers);
    const categories = it.stops.map((s) => s.activity.category);
    assert.equal(new Set(categories).size, categories.length);
  });

  test('searches combinations rather than taking the best thing first', () => {
    // The greedy failure case, concretely. Ceiling is $40. Casual eats ($28,
    // food) is the single most-approved option, but taking it leaves $12 and
    // nothing else fits. Pool ($15, games) plus trivia ($25, drinks) costs
    // exactly $40 and carries six votes against four. Greedy returns one stop;
    // the search returns two. The three must sit in different categories, or
    // the one-per-category rule decides it before budget ever gets a say.
    const group: HangoutMember[] = [
      member('a', 'newtown', 40, ['eats-casual', 'pool', 'trivia']),
      member('b', 'redfern', 40, ['eats-casual', 'pool', 'trivia']),
      member('c', 'glebe', 40, ['eats-casual', 'pool', 'trivia']),
      member('d', 'enmore', 40, ['eats-casual']),
    ];

    const it = buildItinerary(rankActivities(group), group);
    const ids = it.stops.map((s) => s.activity.id);

    assert.ok(it.stops.length >= 2, `expected a multi-stop night, got ${it.summary}`);
    assert.ok(it.totalCostAud <= 40, 'still inside the ceiling');

    const greedyApprovals = 4;                       // casual eats alone
    const chosenApprovals = it.stops.reduce((sum, s) => sum + s.approvals.length, 0);
    assert.ok(chosenApprovals > greedyApprovals,
      `search should beat greedy on approvals, got ${chosenApprovals} from ${ids.join('+')}`);
  });

  test('never exceeds the ceiling just to add another stop', () => {
    const group: HangoutMember[] = [
      member('a', 'newtown', 30, ['eats-casual', 'pool', 'clubbing', 'cocktails']),
      member('b', 'redfern', 30, ['eats-casual', 'pool', 'clubbing', 'cocktails']),
      member('c', 'glebe', 30, ['eats-casual', 'pool', 'clubbing', 'cocktails']),
    ];
    const it = buildItinerary(rankActivities(group), group);
    assert.ok(it.totalCostAud <= 30, `spent $${it.totalCostAud} against a $30 cap`);
    assert.deepEqual(it.pricedOut, []);
  });

  test('raising the tightest budget genuinely unlocks a bigger night', () => {
    const richer = attendees.map((m) => ({ ...m, budgetAud: 120 }));
    const before = buildItinerary(rankActivities(attendees), attendees);
    const after = buildItinerary(rankActivities(richer), richer);
    assert.ok(after.totalCostAud > before.totalCostAud);
    assert.ok(after.stops.map((s) => s.activity.id).includes('clubbing'));
  });

  test('a broke group still gets a plan, and it is free', () => {
    const broke = attendees.map((m) => ({
      ...m, budgetAud: 0, approvals: ['beach', 'coastal-walk', 'clubbing'],
    }));
    const it = buildItinerary(rankActivities(broke), broke);
    assert.ok(it.stops.length >= 1, 'being broke is not a reason to stay home');
    assert.equal(it.totalCostAud, 0);
    assert.deepEqual(it.pricedOut, []);
  });

  test('says so plainly when nothing fits', () => {
    const impossible = attendees.map((m) => ({ ...m, budgetAud: 5, approvals: ['clubbing'] }));
    const it = buildItinerary(rankActivities(impossible), impossible);
    assert.equal(it.stops.length, 0);
    assert.match(it.summary, /No combination fits/);
  });
});

describe('scorePlan', () => {
  const slot = generateGrid({
    startDate: '2026-09-05', days: 1, times: ['19:00'], durationMins: 240, timeZone: TZ,
  })[0];

  test('produces a complete plan: time, itinerary, and place', () => {
    const attendees = [
      member('a', 'newtown', 80, ['eats-casual', 'pool']),
      member('b', 'redfern', 80, ['eats-casual', 'pool']),
      member('c', 'glebe', 60, ['eats-casual', 'pool']),
    ];
    const plan = scorePlan({ slot, attendees })!;
    assert.ok(plan);
    assert.equal(plan.attendees.length, 3);
    assert.ok(plan.itinerary.stops.length > 0);
    assert.ok(plan.hub.name.length > 0);
    assert.match(plan.reasons.join(' '), /3 coming/);
  });

  test('refuses to plan for a group that is too small', () => {
    const plan = scorePlan({
      slot,
      attendees: [member('a', 'newtown', 80, ['pool'])],
      config: { minAttendees: 3 },
    });
    assert.equal(plan, null);
  });

  test('prefers the night that costs the group less travel, all else equal', () => {
    const tight = ['newtown', 'enmore', 'erskineville'].map((s, i) => member(`p${i}`, s, 80, ['pool']));
    const spread = ['manly', 'liverpool', 'hornsby'].map((s, i) => member(`q${i}`, s, 80, ['pool']));
    const a = scorePlan({ slot, attendees: tight })!;
    const b = scorePlan({ slot, attendees: spread })!;
    assert.ok(a.score > b.score, 'travel burden shows up in the score');
    assert.ok(a.hub.meanMinutes < b.hub.meanMinutes);
  });
});

describe('catalogue integrity', () => {
  test('ids are unique and the lookup covers everything', () => {
    const ids = ACTIVITIES.map((a) => a.id);
    assert.equal(new Set(ids).size, ids.length, 'duplicate activity id');
    assert.equal(ACTIVITY_BY_ID.size, ACTIVITIES.length);
  });

  test('every activity is costed, timed and searchable', () => {
    for (const a of ACTIVITIES) {
      assert.ok(a.estCostAud >= 0, `${a.id} has no cost`);
      assert.ok(a.durationMins > 0, `${a.id} has no duration`);
      assert.ok(a.emoji.length > 0, `${a.id} has no emoji`);
      assert.ok(a.sequenceRank >= 1 && a.sequenceRank <= 4, `${a.id} has a bad sequence rank`);
      if (a.estCostAud > 0) assert.ok(a.placesQuery.length > 0, `${a.id} cannot be searched`);
    }
  });

  test('there is always something free to do', () => {
    assert.ok(ACTIVITIES.some((a) => a.estCostAud === 0));
  });
});
