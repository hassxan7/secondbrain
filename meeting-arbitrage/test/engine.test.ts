import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { generateGrid, localParts, offsetMinutes, zonedTimeToUtc, collidesWithStandingConflict } from '../src/core/slots.ts';
import { scoreSlots, schedulingWeight } from '../src/core/arbitrage.ts';
import { recommendAnchor, evaluateRefix, patternLabel } from '../src/core/anchor.ts';
import { DEFAULT_CONFIG } from '../src/core/types.ts';
import type { Participant, ResponseMap } from '../src/core/types.ts';

const TZ = 'Australia/Sydney';

/* The real house. Isaac has football every Monday night; Pete shows up to
 * roughly a fifth of meetings and is the reason this system exists. */
const HOUSE: Participant[] = [
  { id: 'hassaan', name: 'Hassaan', attendanceRate: 1.0 },
  { id: 'isaac', name: 'Isaac', attendanceRate: 0.9,
    standingConflicts: [{ weekday: 1, startMin: 19 * 60, endMin: 21 * 60, label: 'football practice' }] },
  { id: 'kez', name: 'Kez', attendanceRate: 0.9 },
  { id: 'ross', name: 'Ross', attendanceRate: 0.8 },
  { id: 'eyong', name: 'Eyong', attendanceRate: 0.8 },
  { id: 'pete', name: 'Pete', attendanceRate: 0.2 },
  { id: 'manan', name: 'Manan', attendanceRate: 0.7 },
];

describe('timezone handling', () => {
  test('Sydney offset tracks DST', () => {
    assert.equal(offsetMinutes(new Date('2026-07-01T00:00:00Z'), TZ), 600, 'AEST = UTC+10');
    assert.equal(offsetMinutes(new Date('2026-12-01T00:00:00Z'), TZ), 660, 'AEDT = UTC+11');
  });

  test('local wall clock round-trips through UTC across DST', () => {
    for (const date of [[2026, 7, 6], [2026, 12, 7]] as const) {
      const utc = zonedTimeToUtc(date[0], date[1], date[2], 19, 30, TZ);
      const back = localParts(utc, TZ);
      assert.equal(back.hour, 19);
      assert.equal(back.minute, 30);
      assert.equal(back.day, date[2]);
    }
  });

  test('grid keeps 7:30pm local on both sides of the DST boundary', () => {
    const slots = generateGrid({
      startDate: '2026-09-28', days: 21, times: ['19:30'],
      durationMins: 60, timeZone: TZ, weekdays: [1],
    });
    assert.ok(slots.length >= 3, 'spans at least three Mondays');
    for (const s of slots) {
      const lp = localParts(s.startUtc, TZ);
      assert.equal(lp.hour, 19, `${s.id} should be 7pm-ish local`);
      assert.equal(lp.minute, 30);
      assert.equal(lp.weekday, 1, 'Monday only');
    }
    // The underlying UTC instant must actually shift when the clocks change.
    const offsets = new Set(slots.map((s) => offsetMinutes(new Date(s.startUtc), TZ)));
    assert.equal(offsets.size, 2, 'grid straddles the DST change');
  });
});

describe('standing conflicts', () => {
  const football = { weekday: 1, startMin: 19 * 60, endMin: 21 * 60, label: 'football practice' };

  test('detects overlap, and only overlap', () => {
    const monday1930 = generateGrid({ startDate: '2026-08-31', days: 1, times: ['19:30'], durationMins: 60, timeZone: TZ })[0];
    const monday1800 = generateGrid({ startDate: '2026-08-31', days: 1, times: ['18:00'], durationMins: 60, timeZone: TZ })[0];
    const monday2100 = generateGrid({ startDate: '2026-08-31', days: 1, times: ['21:00'], durationMins: 60, timeZone: TZ })[0];

    assert.equal(collidesWithStandingConflict(monday1930, football, TZ), true, '7:30 is mid-practice');
    assert.equal(collidesWithStandingConflict(monday1800, football, TZ), false, '6-7pm ends as practice starts');
    assert.equal(collidesWithStandingConflict(monday2100, football, TZ), false, '9pm starts as practice ends');
  });
});

describe('scheduling weight', () => {
  test('falls with absenteeism but never to zero', () => {
    const cfg = DEFAULT_CONFIG;
    const reliable = schedulingWeight({ id: 'a', name: 'A', attendanceRate: 1 }, cfg);
    const flaky = schedulingWeight({ id: 'b', name: 'B', attendanceRate: 0.2 }, cfg);
    const ghost = schedulingWeight({ id: 'c', name: 'C', attendanceRate: 0 }, cfg);

    assert.equal(reliable, 1);
    assert.ok(flaky < reliable, 'a no-show pulls the schedule around less');
    assert.equal(ghost, cfg.minWeight, 'floored, never erased');
    assert.ok(ghost > 0);
  });

  test('unknown attendance is treated as fully reliable', () => {
    assert.equal(schedulingWeight({ id: 'n', name: 'N' }, DEFAULT_CONFIG), 1);
  });
});

describe('scoreSlots', () => {
  const slots = generateGrid({
    startDate: '2026-08-31', days: 3, times: ['19:30'], durationMins: 60, timeZone: TZ,
  });
  const [mon, tue, wed] = slots;

  test('quorum gate rejects thin slots', () => {
    const responses: ResponseMap = {
      hassaan: { [mon.id]: 'yes' },
      kez: { [mon.id]: 'yes' },
    };
    const result = scoreSlots({ slots: [mon], participants: HOUSE, responses });
    assert.equal(result.ranked[0].viable, false);
    assert.equal(result.recommendation.action, 'no-viable-slot');
    assert.match(result.ranked[0].reasons.join(' '), /below quorum: 2\/5/);
  });

  test('non-responders score zero and are surfaced for chasing', () => {
    const responses: ResponseMap = {
      hassaan: { [mon.id]: 'yes' }, kez: { [mon.id]: 'yes' },
      ross: { [mon.id]: 'yes' }, eyong: { [mon.id]: 'yes' }, manan: { [mon.id]: 'yes' },
    };
    const result = scoreSlots({ slots: [mon], participants: HOUSE, responses });
    assert.deepEqual(result.nonResponders.sort(), ['isaac', 'pete']);
    assert.ok(result.ranked[0].unknown.includes('pete'));
    assert.equal(result.ranked[0].viable, true, '5 of 7 clears quorum');
  });

  test('an unanswered slot infers Isaac out on Monday from his standing conflict', () => {
    const responses: ResponseMap = {
      hassaan: { [mon.id]: 'yes' }, kez: { [mon.id]: 'yes' }, ross: { [mon.id]: 'yes' },
      eyong: { [mon.id]: 'yes' }, manan: { [mon.id]: 'yes' }, pete: { [mon.id]: 'yes' },
    };
    const result = scoreSlots({ slots: [mon], participants: HOUSE, responses });
    assert.ok(result.ranked[0].absent.includes('isaac'));
    assert.ok(result.ranked[0].conflicts.some((c) => c.label === 'football practice'));
  });

  test('an explicit yes overrides the inferred conflict but still flags it', () => {
    const responses: ResponseMap = {
      isaac: { [mon.id]: 'yes' },
      hassaan: { [mon.id]: 'yes' }, kez: { [mon.id]: 'yes' }, ross: { [mon.id]: 'yes' },
      eyong: { [mon.id]: 'yes' }, manan: { [mon.id]: 'yes' },
    };
    const result = scoreSlots({ slots: [mon], participants: HOUSE, responses });
    assert.ok(result.ranked[0].attendees.includes('isaac'), 'people can skip football');
    assert.ok(result.ranked[0].conflicts.some((c) => c.participantId === 'isaac'),
      'but the clash is still shown');
  });

  test('a required person who cannot make it blocks the slot outright', () => {
    const withRequired = HOUSE.map((p) => p.id === 'hassaan' ? { ...p, required: true } : p);
    const responses: ResponseMap = {
      hassaan: { [tue.id]: 'no' }, isaac: { [tue.id]: 'yes' }, kez: { [tue.id]: 'yes' },
      ross: { [tue.id]: 'yes' }, eyong: { [tue.id]: 'yes' }, manan: { [tue.id]: 'yes' },
      pete: { [tue.id]: 'yes' },
    };
    const result = scoreSlots({ slots: [tue], participants: withRequired, responses });
    assert.equal(result.ranked[0].viable, false, 'six yeses do not help if the required one is out');
    assert.deepEqual(result.ranked[0].blockedBy, ['hassaan']);
  });

  test('the stability bonus lets a fixed time win outright when it is close', () => {
    const responses: ResponseMap = {};
    for (const p of HOUSE) responses[p.id] = { [tue.id]: 'yes', [wed.id]: 'yes' };
    responses.pete = { [tue.id]: 'no', [wed.id]: 'yes' };

    const result = scoreSlots({
      slots: [tue, wed], participants: HOUSE, responses,
      config: { anchorSlotId: tue.id },
    });
    assert.equal(result.recommendation.action, 'keep-anchor');
    assert.equal(result.recommendation.slotId, tue.id);
    assert.equal(result.recommendation.margin, 0, 'the anchor is itself the top slot');
    // Pete is the only absentee and his pull is the weakest in the house, so
    // losing him costs less than the stability of not moving.
    assert.ok(result.ranked[0].absent.includes('pete'));
  });

  test('hysteresis: an alternative that edges ahead but not enough does not move it', () => {
    const responses: ResponseMap = {};
    for (const p of HOUSE) responses[p.id] = { [tue.id]: 'yes', [wed.id]: 'yes' };
    // Two people out on the fixed night, so Wednesday genuinely scores higher.
    responses.pete = { [tue.id]: 'no', [wed.id]: 'yes' };
    responses.manan = { [tue.id]: 'no', [wed.id]: 'yes' };

    const result = scoreSlots({
      slots: [tue, wed], participants: HOUSE, responses,
      config: { anchorSlotId: tue.id },
    });
    const anchorScore = result.ranked.find((r) => r.slot.id === tue.id)!.score;
    const altScore = result.ranked.find((r) => r.slot.id === wed.id)!.score;
    assert.ok(altScore > anchorScore, 'Wednesday really is the better night on raw numbers');
    assert.ok(altScore - anchorScore <= DEFAULT_CONFIG.switchMargin, 'but only just');

    assert.equal(result.recommendation.action, 'keep-anchor');
    assert.equal(result.recommendation.slotId, tue.id);
    assert.match(result.recommendation.rationale, /under the .* margin/);
  });

  test('a decisively better alternative does move it', () => {
    const responses: ResponseMap = {};
    for (const p of HOUSE) responses[p.id] = { [tue.id]: 'no', [wed.id]: 'yes' };

    const result = scoreSlots({
      slots: [tue, wed], participants: HOUSE, responses,
      config: { anchorSlotId: tue.id },
    });
    assert.equal(result.recommendation.action, 'switch');
    assert.equal(result.recommendation.slotId, wed.id);
  });

  test('fairness penalty rotates who gets excluded', () => {
    const repeatedlyExcluded = HOUSE.map((p) => p.id === 'manan' ? { ...p, excludedRecently: 3 } : p);
    const responses: ResponseMap = {};
    for (const p of HOUSE) responses[p.id] = { [tue.id]: 'yes', [wed.id]: 'yes' };
    // Two otherwise identical slots; each leaves exactly one person out.
    responses.manan = { [tue.id]: 'no', [wed.id]: 'yes' };
    responses.ross = { [tue.id]: 'yes', [wed.id]: 'no' };

    const result = scoreSlots({ slots: [tue, wed], participants: repeatedlyExcluded, responses });
    assert.equal(result.recommendation.slotId, wed.id,
      'prefers the slot that excludes the person who has not been excluded lately');
  });
});

describe('recommendAnchor — the Monday 7:30 problem', () => {
  // A fortnight of Mondays, Tuesdays and Wednesdays at 7:30pm.
  const slots = generateGrid({
    startDate: '2026-08-31', days: 14, times: ['19:30'],
    durationMins: 60, timeZone: TZ, weekdays: [1, 2, 3],
  });
  const responses: ResponseMap = {};
  for (const p of HOUSE) {
    responses[p.id] = {};
    for (const s of slots) responses[p.id][s.id] = 'yes';
  }

  test('folds dated slots onto weekly patterns', () => {
    const rec = recommendAnchor({ slots, participants: HOUSE, responses });
    assert.equal(rec.ranked.length, 3, 'Mon/Tue/Wed at 7:30pm');
    assert.deepEqual(
      rec.ranked.map((c) => c.label).sort(),
      ['Monday 7:30 pm', 'Tuesday 7:30 pm', 'Wednesday 7:30 pm'],
    );
  });

  test('moves the standing meeting off Monday despite everyone saying yes', () => {
    const rec = recommendAnchor({
      slots, participants: HOUSE, responses,
      incumbent: { weekday: 1, time: '19:30' },
    });
    assert.equal(rec.action, 'move');
    assert.match(rec.rationale, /football practice/);
    assert.notEqual(rec.best!.pattern.weekday, 1, 'anything but Monday');
    const monday = rec.ranked.find((c) => c.pattern.weekday === 1)!;
    assert.ok(monday.conflicts.some((c) => c.name === 'Isaac'));
    assert.ok(
      monday.score < rec.best!.score,
      'a clash that repeats every week outranks one week of goodwill',
    );
  });

  test('keeps a healthy standing time rather than chasing noise', () => {
    const noConflicts = HOUSE.map(({ standingConflicts, ...p }) => p);
    const rec = recommendAnchor({
      slots, participants: noConflicts, responses,
      incumbent: { weekday: 2, time: '19:30' },
    });
    assert.equal(rec.action, 'keep');
  });

  test('reports fractional expected attendance', () => {
    const partial: ResponseMap = JSON.parse(JSON.stringify(responses));
    const mondays = slots.filter((s) => localParts(s.startUtc, TZ).weekday === 1);
    partial.pete[mondays[0].id] = 'no';   // makes one Monday in two
    const rec = recommendAnchor({ slots, participants: HOUSE, responses: partial });
    const monday = rec.ranked.find((c) => c.pattern.weekday === 1)!;
    assert.ok(monday.expectedHeads < HOUSE.length - 1,
      'partial reliability shows up as a fraction, not a rounded head');
  });
});

describe('evaluateRefix — Pete vs Isaac', () => {
  const fresh = { participantId: 'pete', used: 0, budget: 2, periodStart: '2026-08-01' };

  test('a declared recurring clash is free and re-picks the standing time', () => {
    const decision = evaluateRefix(
      { participantId: 'isaac', reason: 'football every Monday', standingConflict: true },
      { ...fresh, participantId: 'isaac' },
    );
    assert.equal(decision.granted, true);
    assert.equal(decision.consumedToken, false);
    assert.equal(decision.outcome, 'repick-anchor');
    assert.equal(decision.tokensRemaining, 2, 'costs nothing');
  });

  test('an ad-hoc excuse spends a token', () => {
    const decision = evaluateRefix({ participantId: 'pete', reason: 'busy' }, fresh);
    assert.equal(decision.granted, true);
    assert.equal(decision.consumedToken, true);
    assert.equal(decision.tokensRemaining, 1);
    assert.equal(decision.outcome, 'refix-poll');
  });

  test('once the budget is spent the meeting proceeds without them', () => {
    const spent = { ...fresh, used: 2 };
    const decision = evaluateRefix({ participantId: 'pete', reason: 'busy again' }, spent);
    assert.equal(decision.granted, false);
    assert.equal(decision.outcome, 'proceed-without');
    assert.match(decision.rationale, /goes ahead at the fixed time/);
  });

  test('a required person overrides an exhausted budget, and it is flagged', () => {
    const spent = { ...fresh, participantId: 'hassaan', used: 2 };
    const decision = evaluateRefix(
      { participantId: 'hassaan', reason: 'away' }, spent,
      { id: 'hassaan', name: 'Hassaan', required: true },
    );
    assert.equal(decision.granted, true);
    assert.equal(decision.outcome, 'refix-poll');
    assert.match(decision.rationale, /required/);
  });
});

describe('patternLabel', () => {
  test('formats times the way people say them', () => {
    assert.equal(patternLabel({ weekday: 1, time: '19:30' }), 'Monday 7:30 pm');
    assert.equal(patternLabel({ weekday: 0, time: '09:00' }), 'Sunday 9 am');
    assert.equal(patternLabel({ weekday: 6, time: '12:00' }), 'Saturday 12 pm');
  });
});
