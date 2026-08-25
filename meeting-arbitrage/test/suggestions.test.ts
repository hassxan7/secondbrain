import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  openBallots, recordAnswers, addSuggestion, pendingAsksFor, outstandingAsks,
  participants, rankBallots, type Ballot,
} from '../src/ripple/suggestions.ts';
import { ACTIVITIES, type Activity, type HangoutMember } from '../src/ripple/activities.ts';

const CATALOGUE = new Map(ACTIVITIES.map((a) => [a.id, a]));
const ALL_IDS = ACTIVITIES.map((a) => a.id);
const NOW = '2026-08-25T10:00:00Z';

const member = (id: string, budgetAud = 60): HangoutMember =>
  ({ id, name: id, suburb: 'newtown', budgetAud, approvals: [] });

/** Deliberately NOT in the standing catalogue — this is the novel suggestion. */
const NIGHT_MARKET: Activity = {
  id: 'night-market', label: 'Night market', emoji: '🏮', estCostAud: 12,
  durationMins: 90, category: 'outdoors', placesQuery: 'night market',
  timeOfDay: 'night', sequenceRank: 1, tags: ['cheap'],
};

describe('answering', () => {
  test('records what was approved, and what was merely seen', () => {
    let ballots = openBallots(ACTIVITIES, NOW);
    ballots = recordAnswers(ballots, 'a', ALL_IDS, ['pool', 'pub']);

    const pool = ballots.find((b) => b.activityId === 'pool')!;
    const bowling = ballots.find((b) => b.activityId === 'bowling')!;

    assert.deepEqual(pool.approvals, ['a']);
    assert.deepEqual(pool.seen, ['a']);
    assert.deepEqual(bowling.approvals, [], 'seen but not wanted');
    assert.deepEqual(bowling.seen, ['a'], 'and that is different from never shown');
  });

  test('changing your mind removes the approval without unseeing it', () => {
    let ballots = openBallots(ACTIVITIES, NOW);
    ballots = recordAnswers(ballots, 'a', ALL_IDS, ['pool']);
    ballots = recordAnswers(ballots, 'a', ALL_IDS, ['pub']);

    const pool = ballots.find((b) => b.activityId === 'pool')!;
    assert.deepEqual(pool.approvals, []);
    assert.deepEqual(pool.seen, ['a'], 'still seen');
  });

  test('an approval for something not shown is ignored', () => {
    let ballots = openBallots(ACTIVITIES, NOW);
    ballots = recordAnswers(ballots, 'a', ['pool'], ['pool', 'clubbing']);
    assert.deepEqual(ballots.find((b) => b.activityId === 'clubbing')!.approvals, []);
    assert.deepEqual(ballots.find((b) => b.activityId === 'clubbing')!.seen, []);
  });

  test('participants are people who have started, not everyone invited', () => {
    let ballots = openBallots(ACTIVITIES, NOW);
    ballots = recordAnswers(ballots, 'a', ALL_IDS, ['pool']);
    ballots = recordAnswers(ballots, 'b', ALL_IDS, []);
    assert.deepEqual(participants(ballots).sort(), ['a', 'b']);
  });
});

describe('the third-person-suggests problem', () => {
  /** a and b answer the standing list; c answers and adds Yochi. */
  function scenario() {
    let ballots = openBallots(ACTIVITIES, NOW);
    ballots = recordAnswers(ballots, 'a', ALL_IDS, ['pool', 'eats-casual']);
    ballots = recordAnswers(ballots, 'b', ALL_IDS, ['pool', 'pub']);
    ballots = recordAnswers(ballots, 'c', ALL_IDS, ['pool']);
    ballots = addSuggestion(ballots, NIGHT_MARKET, 'c', NOW);
    return ballots;
  }

  test('the suggester is counted as having seen and wanted it', () => {
    const yochi = scenario().find((b) => b.activityId === 'night-market')!;
    assert.deepEqual(yochi.seen, ['c']);
    assert.deepEqual(yochi.approvals, ['c']);
    assert.deepEqual(yochi.origin, { kind: 'suggested', by: 'c' });
  });

  test('the earlier answers survive untouched — nobody redoes the form', () => {
    const ballots = scenario();
    const pool = ballots.find((b) => b.activityId === 'pool')!;
    assert.deepEqual(pool.approvals.sort(), ['a', 'b', 'c']);
    assert.deepEqual(pool.seen.sort(), ['a', 'b', 'c']);
  });

  test('a and b are asked about exactly one thing', () => {
    const ballots = scenario();
    const catalogue = new Map([...CATALOGUE, ['night-market', NIGHT_MARKET]]);

    for (const who of ['a', 'b']) {
      const asks = pendingAsksFor(ballots, who, catalogue);
      assert.equal(asks.length, 1, `${who} should have one open question`);
      assert.equal(asks[0].id, 'night-market');
    }
    assert.deepEqual(pendingAsksFor(ballots, 'c', catalogue), [], 'c has nothing outstanding');
  });

  test('someone who never started gets the whole form, not a delta', () => {
    const ballots = scenario();
    const catalogue = new Map([...CATALOGUE, ['night-market', NIGHT_MARKET]]);
    assert.deepEqual(pendingAsksFor(ballots, 'd', catalogue), []);
  });

  test('the reminder list names only the people actually holding it up', () => {
    const ballots = scenario();
    const catalogue = new Map([...CATALOGUE, ['night-market', NIGHT_MARKET]]);
    const outstanding = outstandingAsks(ballots, catalogue);

    assert.deepEqual(outstanding.map((o) => o.memberId).sort(), ['a', 'b']);
    assert.ok(outstanding.every((o) => o.activities.length === 1));
  });

  test('a fresh suggestion cannot win on a perfect rate', () => {
    const ballots = scenario();
    const catalogue = new Map([...CATALOGUE, ['night-market', NIGHT_MARKET]]);
    const attendees = ['a', 'b', 'c'].map((id) => member(id));
    const ranked = rankBallots(ballots, catalogue, attendees);

    const yochi = ranked.find((r) => r.activity.id === 'night-market')!;
    const pool = ranked.find((r) => r.activity.id === 'pool')!;

    // Yochi is 1-for-1. Pool is 3-for-3. Rate alone would tie them.
    assert.equal(yochi.approvals.length, 1);
    assert.equal(yochi.coverage, 0.33);
    assert.equal(yochi.eligible, false);
    assert.deepEqual(yochi.pending.sort(), ['a', 'b']);
    assert.match(yochi.reasons.join(' '), /waiting on 2 people/);

    assert.equal(pool.eligible, true);
    assert.ok(ranked.indexOf(pool) < ranked.indexOf(yochi),
      'anything eligible outranks anything still pending');
  });

  test('once everyone has seen it, it competes normally and can win', () => {
    let ballots = scenario();
    const catalogue = new Map([...CATALOGUE, ['night-market', NIGHT_MARKET]]);

    // a and b clear their one open cell, both saying yes.
    ballots = recordAnswers(ballots, 'a', ['night-market'], ['night-market']);
    ballots = recordAnswers(ballots, 'b', ['night-market'], ['night-market']);

    const attendees = ['a', 'b', 'c'].map((id) => member(id));
    const ranked = rankBallots(ballots, catalogue, attendees);
    const yochi = ranked.find((r) => r.activity.id === 'night-market')!;

    assert.equal(yochi.eligible, true);
    assert.equal(yochi.coverage, 1);
    assert.deepEqual(yochi.approvals.sort(), ['a', 'b', 'c']);
    assert.deepEqual(yochi.pending, []);
    assert.equal(ranked[0].activity.id, 'night-market', 'unanimous and cheap — it should win');
  });

  test('clearing the cell with a no also unblocks it, without a vote', () => {
    let ballots = scenario();
    const catalogue = new Map([...CATALOGUE, ['night-market', NIGHT_MARKET]]);
    ballots = recordAnswers(ballots, 'a', ['night-market'], []);
    ballots = recordAnswers(ballots, 'b', ['night-market'], []);

    const ranked = rankBallots(ballots, catalogue, ['a', 'b', 'c'].map((id) => member(id)));
    const yochi = ranked.find((r) => r.activity.id === 'night-market')!;

    assert.equal(yochi.eligible, true, 'seeing it is what counts, not liking it');
    assert.deepEqual(yochi.approvals, ['c']);
  });

  test('suggesting something already in the catalogue dedupes to an approval', () => {
    // Yochi ships in the standing catalogue. Someone typing "Yochi" into the
    // suggest box must not create a second, competing ballot for it.
    let ballots = scenario();
    const before = ballots.length;
    ballots = addSuggestion(ballots, CATALOGUE.get('yochi')!, 'a', NOW);

    assert.equal(ballots.length, before, 'no duplicate Yochi ballot');
    const yochi = ballots.find((b) => b.activityId === 'yochi')!;
    assert.ok(yochi.approvals.includes('a'));
    assert.equal(yochi.origin.kind, 'catalogue', 'it was always on the list');
  });

  test('re-suggesting something already listed is an approval, not a duplicate', () => {
    let ballots = scenario();
    const before = ballots.length;
    ballots = addSuggestion(ballots, CATALOGUE.get('pub')!, 'c', NOW);

    assert.equal(ballots.length, before, 'no second pub ballot');
    assert.ok(ballots.find((b) => b.activityId === 'pub')!.approvals.includes('c'));
  });
});

describe('coverage and attendance interact', () => {
  test('someone who cannot make the time does not hold an option hostage', () => {
    let ballots = openBallots(ACTIVITIES, NOW);
    ballots = recordAnswers(ballots, 'a', ALL_IDS, ['pool']);
    ballots = recordAnswers(ballots, 'b', ALL_IDS, ['pool']);
    ballots = recordAnswers(ballots, 'c', ALL_IDS, ['pool']);
    ballots = addSuggestion(ballots, NIGHT_MARKET, 'a', NOW);
    ballots = recordAnswers(ballots, 'b', ['night-market'], ['night-market']);
    // c never answers about Yochi — but c cannot make the chosen slot anyway.

    const catalogue = new Map([...CATALOGUE, ['night-market', NIGHT_MARKET]]);
    const attending = [member('a'), member('b')];
    const yochi = rankBallots(ballots, catalogue, attending)
      .find((r) => r.activity.id === 'night-market')!;

    assert.equal(yochi.eligible, true, 'coverage is measured over people who are coming');
    assert.deepEqual(yochi.pending, []);
  });

  test('a lowered threshold can break a stalemate', () => {
    let ballots = openBallots(ACTIVITIES, NOW);
    for (const who of ['a', 'b', 'c']) ballots = recordAnswers(ballots, who, ALL_IDS, ['pool']);
    ballots = addSuggestion(ballots, NIGHT_MARKET, 'a', NOW);
    ballots = recordAnswers(ballots, 'b', ['night-market'], ['night-market']);
    // c has gone quiet.

    const catalogue = new Map([...CATALOGUE, ['night-market', NIGHT_MARKET]]);
    const attendees = ['a', 'b', 'c'].map((id) => member(id));

    assert.equal(
      rankBallots(ballots, catalogue, attendees).find((r) => r.activity.id === 'night-market')!.eligible,
      false, 'strict by default');
    assert.equal(
      rankBallots(ballots, catalogue, attendees, { coverageThreshold: 0.6 })
        .find((r) => r.activity.id === 'night-market')!.eligible,
      true, 'organiser can force it through');
  });

  test('budget still applies to a suggestion', () => {
    let ballots = openBallots(ACTIVITIES, NOW);
    ballots = recordAnswers(ballots, 'a', ALL_IDS, []);
    ballots = recordAnswers(ballots, 'b', ALL_IDS, []);
    ballots = addSuggestion(ballots, { ...NIGHT_MARKET, id: 'fancy', estCostAud: 90 }, 'a', NOW);
    ballots = recordAnswers(ballots, 'b', ['fancy'], ['fancy']);

    const catalogue = new Map([...CATALOGUE, ['fancy', { ...NIGHT_MARKET, id: 'fancy', estCostAud: 90 }]]);
    const outcome = rankBallots(ballots, catalogue, [member('a', 40), member('b', 40)])
      .find((r) => r.activity.id === 'fancy')!;

    assert.deepEqual(outcome.pricedOut.sort(), ['a', 'b']);
    assert.match(outcome.reasons.join(' '), /over budget for 2 people/);
  });
});
