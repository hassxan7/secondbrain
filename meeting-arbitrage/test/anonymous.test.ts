import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  raiseAnonymous, weightOf, resolveAnonymous, anonymousAgenda, softenNote,
  DEFAULT_ANON_CONFIG, type AnonymousIssue,
} from '../src/banksia/anonymous.ts';

const NAMES = ['Hassaan', 'Isaac', 'Kez', 'Ross', 'Eyong', 'Pete', 'Manan'];
const NOW = '2026-08-25T12:00:00Z';
const dayBefore = '2026-08-24T09:00:00Z';

describe('raising and aggregating', () => {
  test('a first raise opens a thread for that area', () => {
    const issues = raiseAnonymous([], { area: 'kitchen', author: 'a', note: 'sink again', now: NOW });
    assert.equal(issues.length, 1);
    assert.equal(issues[0].area, 'kitchen');
    assert.equal(weightOf(issues[0]), 1);
  });

  test('the same area joins one thread instead of spawning duplicates', () => {
    let issues = raiseAnonymous([], { area: 'kitchen', author: 'a', now: NOW });
    issues = raiseAnonymous(issues, { area: 'kitchen', author: 'b', now: NOW });
    issues = raiseAnonymous(issues, { area: 'kitchen', author: 'c', now: NOW });
    assert.equal(issues.length, 1, 'one kitchen thread');
    assert.equal(weightOf(issues[0]), 3, 'three distinct raisers');
  });

  test('the same person raising twice does not inflate the weight', () => {
    let issues = raiseAnonymous([], { area: 'kitchen', author: 'a', note: 'first', now: NOW });
    issues = raiseAnonymous(issues, { area: 'kitchen', author: 'a', note: 'still bad', now: NOW });
    assert.equal(weightOf(issues[0]), 1, 'one person, weight one');
    // But their note is updated to the latest.
    assert.ok(issues[0].contributions.some((c) => c.note === 'still bad'));
    assert.ok(!issues[0].contributions.some((c) => c.note === 'first'));
  });

  test('different areas are separate threads', () => {
    let issues = raiseAnonymous([], { area: 'kitchen', author: 'a', now: NOW });
    issues = raiseAnonymous(issues, { area: 'noise', author: 'a', now: NOW });
    assert.equal(issues.length, 2);
  });
});

describe('softening — the animosity guard', () => {
  test('a housemate named in a note is anonymised', () => {
    const out = softenNote('Pete never does his dishes', NAMES);
    assert.ok(!/Pete/i.test(out), 'the name is stripped');
    assert.match(out, /someone never does/i);
  });

  test('shouting is calmed', () => {
    const out = softenNote('THE KITCHEN IS DISGUSTING', NAMES);
    assert.equal(out, 'The kitchen is disgusting', 'flattened to a normal sentence');
  });

  test('piled-up punctuation is collapsed', () => {
    assert.equal(softenNote('clean up!!!', NAMES), 'clean up!');
  });

  test('a rant is capped to a flag', () => {
    const long = 'the bins '.repeat(60);
    const out = softenNote(long, NAMES, { ...DEFAULT_ANON_CONFIG, maxNoteLength: 40 });
    assert.ok(out.length <= 40);
    assert.ok(out.endsWith('…'));
  });

  test('facts survive — only the heat is removed', () => {
    const out = softenNote('the shower has been mouldy for two weeks', NAMES);
    assert.match(out, /mouldy for two weeks/);
  });
});

describe('a lone raise waits; consensus does not', () => {
  test('one fresh raise is held during the cooling window', () => {
    const issues = raiseAnonymous([], { area: 'kitchen', author: 'a', now: NOW });
    const outcome = resolveAnonymous(issues[0], NAMES, NOW);
    assert.equal(outcome.onAgenda, false, 'not a same-day strike');
    assert.equal(outcome.status, 'building');
    assert.match(outcome.summary, /Held \d+h/);
  });

  test('a lone raise surfaces on its own once it has cooled', () => {
    const issue: AnonymousIssue = {
      id: 'x', area: 'kitchen', createdAt: dayBefore,
      contributions: [{ author: 'a', at: dayBefore }],
    };
    const outcome = resolveAnonymous(issue, NAMES, NOW);
    assert.equal(outcome.onAgenda, true, 'a real issue is not suppressed forever');
    assert.match(outcome.summary, /Not urgent/);
  });

  test('two raisers go to the agenda immediately, as consensus', () => {
    let issues = raiseAnonymous([], { area: 'kitchen', author: 'a', now: NOW });
    issues = raiseAnonymous(issues, { area: 'kitchen', author: 'b', now: NOW });
    const outcome = resolveAnonymous(issues[0], NAMES, NOW);
    assert.equal(outcome.onAgenda, true);
    assert.match(outcome.summary, /2 housemates quietly flagged/);
  });

  test('the agenda is consensus-first and never names anyone', () => {
    let issues: AnonymousIssue[] = [];
    // Kitchen: three people, one names Pete in a note.
    issues = raiseAnonymous(issues, { area: 'kitchen', author: 'a', note: 'Pete leaves pans', now: NOW });
    issues = raiseAnonymous(issues, { area: 'kitchen', author: 'b', now: NOW });
    issues = raiseAnonymous(issues, { area: 'kitchen', author: 'c', now: NOW });
    // Noise: one fresh raise — should be held.
    issues = raiseAnonymous(issues, { area: 'noise', author: 'd', now: NOW });
    // Bills: one cooled raise — should surface.
    issues.push({ id: 'bills', area: 'bills', createdAt: dayBefore, contributions: [{ author: 'e', at: dayBefore }] });

    const agenda = anonymousAgenda(issues, NAMES, NOW);
    const areas = agenda.map((o) => o.area);

    assert.ok(areas.includes('kitchen'));
    assert.ok(areas.includes('bills'));
    assert.ok(!areas.includes('noise'), 'the fresh lone raise is still cooling');
    assert.equal(agenda[0].area, 'kitchen', 'consensus sorts first');

    const kitchen = agenda.find((o) => o.area === 'kitchen')!;
    assert.ok(kitchen.notes.every((n) => !/Pete/i.test(n)), 'no note names a housemate');
  });
});
