import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  openPot, applyWeekFines, potState, distributePot, recommendPot,
  DEFAULT_POT_CONFIG, type PotConfig,
} from '../src/banksia/pot.ts';

const HOUSE = ['hassaan', 'isaac', 'kez', 'ross', 'eyong', 'pete', 'manan'];

describe('opening the pot', () => {
  test('everyone stakes the buy-in', () => {
    const stakes = openPot(HOUSE, DEFAULT_POT_CONFIG);
    assert.equal(stakes.length, 7);
    assert.ok(stakes.every((s) => s.openingCents === 4000 && s.finedCents === 0));
    assert.equal(potState(stakes).totalCents, 28000);
  });
});

describe('fines come out of the stake', () => {
  const config: PotConfig = { buyInCents: 4000, finePerMissedTaskCents: 500, distribution: 'split-clean' };

  test('a fine deducts from the stake, nobody is invoiced', () => {
    let stakes = openPot(['pete'], config);
    stakes = applyWeekFines(stakes, { pete: 2000 }); // 4 tasks short at $5
    const state = potState(stakes);
    assert.equal(state.stakes[0].remainingCents, 2000);
    assert.equal(state.stakes[0].clean, false);
    assert.equal(state.stakes[0].overflowCents, 0);
  });

  test('fines accumulate across weeks', () => {
    let stakes = openPot(['pete'], config);
    stakes = applyWeekFines(stakes, { pete: 1000 });
    stakes = applyWeekFines(stakes, { pete: 1500 });
    assert.equal(potState(stakes).stakes[0].remainingCents, 4000 - 2500);
  });

  test('a fine cannot take more than the stake holds, and the overflow is named', () => {
    let stakes = openPot(['pete'], config);
    stakes = applyWeekFines(stakes, { pete: 3000 });
    stakes = applyWeekFines(stakes, { pete: 3000 }); // $60 fined against a $40 stake
    const state = potState(stakes);
    assert.equal(state.stakes[0].remainingCents, 0, 'stake floored at zero');
    assert.equal(state.stakes[0].overflowCents, 2000, '$20 of real debt beyond the stake');
    assert.equal(state.stakes[0].exhausted, true);
    assert.deepEqual(state.overflows, [{ memberId: 'pete', overflowCents: 2000 }]);
    // The pot only ever grew by what was actually in the stake.
    assert.equal(state.surplusCents, 4000);
  });
});

describe('distribution — split among the clean', () => {
  const config: PotConfig = { buyInCents: 4000, finePerMissedTaskCents: 500, distribution: 'split-clean' };

  test('the tidy housemates are paid out of the messy ones', () => {
    let stakes = openPot(['hassaan', 'kez', 'pete'], config);
    stakes = applyWeekFines(stakes, { pete: 2000 }); // Pete short; the other two clean
    const dist = distributePot(stakes, config);

    const pete = dist.payouts.find((p) => p.memberId === 'pete')!;
    assert.equal(pete.stakeBackCents, 2000, 'Pete gets back what is left of his stake');
    assert.equal(pete.bonusCents, 0);

    const clean = dist.payouts.filter((p) => p.memberId !== 'pete');
    assert.ok(clean.every((p) => p.bonusCents === 1000), '$20 surplus split two ways = $10 each');
    assert.ok(clean.every((p) => p.totalCents === 5000), 'stake back plus the bonus');

    // Nothing created or destroyed: payouts total the original pot.
    const totalOut = dist.payouts.reduce((s, p) => s + p.totalCents, 0)
      + dist.houseFundCents + dist.rolloverCents;
    assert.equal(totalOut, potState(stakes).totalCents);
  });

  test('the split remainder lands somewhere, so the books balance to the cent', () => {
    // $10 surplus split three ways = $3.34 + $3.33 + $3.33.
    let stakes = openPot(['a', 'b', 'c', 'd'], config);
    stakes = applyWeekFines(stakes, { d: 1000 });
    const dist = distributePot(stakes, config);
    const bonuses = dist.payouts.filter((p) => p.bonusCents > 0).map((p) => p.bonusCents).sort();
    assert.deepEqual(bonuses, [333, 333, 334]);
    assert.equal(bonuses.reduce((a, b) => a + b, 0), 1000, 'no cents lost');
  });

  test('nobody clean → surplus becomes the house fund rather than rewarding no one', () => {
    let stakes = openPot(['a', 'b'], config);
    stakes = applyWeekFines(stakes, { a: 500, b: 500 });
    const dist = distributePot(stakes, config);
    assert.equal(dist.houseFundCents, 1000);
    assert.match(dist.summary, /Nobody finished clean/);
  });

  test('everyone clean → full stakes back, no drama', () => {
    const stakes = openPot(['a', 'b'], config);
    const dist = distributePot(stakes, config);
    assert.ok(dist.payouts.every((p) => p.totalCents === 4000 && p.bonusCents === 0));
    assert.match(dist.summary, /Everyone clean/);
  });
});

describe('distribution — house fund and roll-over', () => {
  test('house-fund pools every fine', () => {
    const config: PotConfig = { buyInCents: 4000, finePerMissedTaskCents: 500, distribution: 'house-fund' };
    let stakes = openPot(['a', 'b'], config);
    stakes = applyWeekFines(stakes, { a: 1500 });
    const dist = distributePot(stakes, config);
    assert.equal(dist.houseFundCents, 1500);
    assert.equal(dist.payouts.find((p) => p.memberId === 'a')!.stakeBackCents, 2500);
  });

  test('roll-over carries the surplus forward', () => {
    const config: PotConfig = { buyInCents: 4000, finePerMissedTaskCents: 500, distribution: 'roll-over' };
    let stakes = openPot(['a'], config);
    stakes = applyWeekFines(stakes, { a: 1500 });
    const dist = distributePot(stakes, config);
    assert.equal(dist.rolloverCents, 1500);
  });
});

describe('recommendPot — catching the $100-fine trap', () => {
  test('a healthy pot survives several bad weeks', () => {
    const advice = recommendPot({ buyInCents: 4000, finePerMissedTaskCents: 500, distribution: 'split-clean' });
    assert.equal(advice.ok, true);
    assert.ok(advice.weeksOfRunway >= 2);
  });

  test('a $100 fine on a $40 stake is flagged as a cliff', () => {
    const advice = recommendPot({ buyInCents: 4000, finePerMissedTaskCents: 2500, distribution: 'split-clean' });
    // $25/task × 4 = $100 worst week; the $40 stake is gone in one.
    assert.equal(advice.ok, false);
    assert.equal(advice.weeksOfRunway, 0);
    assert.match(advice.note, /wipes the \$40 stake/);
    assert.match(advice.note, /stake nearer \$300/);
  });

  test('a $100 fine is fine with a stake sized for it', () => {
    const advice = recommendPot({ buyInCents: 30000, finePerMissedTaskCents: 2500, distribution: 'split-clean' });
    assert.equal(advice.ok, true);
    assert.ok(advice.weeksOfRunway >= 3);
  });
});
