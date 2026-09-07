import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  slugTask, matchName, matchTask, parseBoardPayload, mergeBoard, boardStanding, behind,
  DEFAULT_TASKS, type Board,
} from '../src/banksia/board.ts';
import { extractJson } from '../src/integrations/board-vision.ts';

const HOUSE = [
  { id: 'mem_hassaan', name: 'Hassaan' },
  { id: 'mem_isaac', name: 'Isaac' },
  { id: 'mem_kez', name: 'Kez' },
  { id: 'mem_ross', name: 'Ross' },
  { id: 'mem_eyong', name: 'Eyong' },
  { id: 'mem_pete', name: 'Pete' },
  { id: 'mem_manan', name: 'Manan' },
];

describe('matching handwriting to housemates', () => {
  test('case and spacing do not matter', () => {
    assert.equal(matchName('  pete ', HOUSE), 'mem_pete');
    assert.equal(matchName('HASSAAN', HOUSE), 'mem_hassaan');
  });

  test('a one-letter slip still lands', () => {
    assert.equal(matchName('Ros', HOUSE), 'mem_ross');
    assert.equal(matchName('Hassan', HOUSE), 'mem_hassaan');
  });

  test('a name nobody has is left for a human', () => {
    assert.equal(matchName('Jordan', HOUSE), null);
    assert.equal(matchName('', HOUSE), null);
  });

  // Assigning a chore to the wrong housemate is worse than asking which one it
  // was, so an ambiguous read must refuse rather than pick.
  test('two housemates one edit apart are never guessed between', () => {
    const twins = [{ id: 'a', name: 'Pete' }, { id: 'b', name: 'Peta' }];
    assert.equal(matchName('Petr', twins), null);
    // An exact match still resolves, because it is not ambiguous.
    assert.equal(matchName('Pete', twins), 'a');
  });

  test('a two-character scrawl is not stretched into a match', () => {
    assert.equal(matchName('Ke', HOUSE), null);
  });
});

describe('parsing what the model read off the board', () => {
  test('rows become tasks and ticks', () => {
    const result = parseBoardPayload({
      rows: [
        { task: 'Take the bins out', names: ['Pete', 'Kez'] },
        { task: 'Clean the kitchen', names: ['Hassaan'] },
      ],
    }, HOUSE, '2026-08-24');

    assert.equal(result.ticksFound, 3);
    assert.equal(result.board.tasks.length, 2);
    assert.deepEqual(result.unmatched, []);
    assert.ok(result.board.ticks.some((t) => t.taskId === 'bins' && t.memberId === 'mem_pete'));
  });

  test('a known row keeps its existing id rather than forking a duplicate', () => {
    const result = parseBoardPayload(
      { rows: [{ task: 'take the bins out', names: [] }] },
      HOUSE, '2026-08-24', DEFAULT_TASKS,
    );
    assert.equal(result.board.tasks[0].id, 'bins');
    assert.deepEqual(result.newTasks, []);
  });

  test('a shortened row still finds the chore it names', () => {
    const result = parseBoardPayload(
      { rows: [{ task: 'bins out', names: [] }] },
      HOUSE, '2026-08-24', [{ id: 'bins', label: 'Take the bins out' }],
    );
    assert.equal(result.board.tasks[0].id, 'bins');
  });

  // "bins out" is inside both "Take the bins out" and "Sunday bins out". A
  // duplicated row is visible and mergeable; a tick filed under the wrong job
  // is not, so the ambiguous read declines to match.
  test('a label that fits two rows forks a new one rather than picking', () => {
    assert.equal(matchTask('bins out', DEFAULT_TASKS), null);
    // An exact hit is not ambiguous, so the earlier tiers still resolve it.
    assert.equal(matchTask('Take the bins out', DEFAULT_TASKS)?.id, 'bins');
    assert.equal(matchTask('bins', DEFAULT_TASKS)?.id, 'bins');
  });

  test('a row the house has never had is flagged as new, not silently adopted', () => {
    const result = parseBoardPayload(
      { rows: [{ task: 'Mow the lawn', names: ['Ross'] }] },
      HOUSE, '2026-08-24', DEFAULT_TASKS,
    );
    assert.equal(result.newTasks.length, 1);
    assert.equal(result.newTasks[0].id, 'mow-the-lawn');
  });

  test('an unreadable name is surfaced with its row, never dropped', () => {
    const result = parseBoardPayload(
      { rows: [{ task: 'Bathrooms', names: ['Jordan', 'Kez'] }] },
      HOUSE, '2026-08-24',
    );
    assert.deepEqual(result.unmatched, [{ name: 'Jordan', task: 'Bathrooms' }]);
    assert.equal(result.ticksFound, 1);
  });

  test('the same person twice in a row is one tick', () => {
    const result = parseBoardPayload(
      { rows: [{ task: 'Vacuum everything', names: ['Pete', 'pete', 'PETE'] }] },
      HOUSE, '2026-08-24',
    );
    assert.equal(result.ticksFound, 1);
  });

  test('a cap written on the board is carried through', () => {
    const result = parseBoardPayload(
      { rows: [{ task: 'Water the plants', cap: 2, names: [] }] },
      HOUSE, '2026-08-24', [],
    );
    assert.equal(result.board.tasks[0].cap, 2);
  });

  test('junk in the array is skipped and the good rows survive', () => {
    const result = parseBoardPayload({
      rows: [null, 'nope', { task: 42 }, { task: 'Bathrooms', names: ['Kez'] }],
    }, HOUSE, '2026-08-24');
    assert.equal(result.board.tasks.length, 1);
    assert.equal(result.ticksFound, 1);
  });

  test('a payload with no usable rows throws rather than writing an empty board', () => {
    assert.throws(() => parseBoardPayload({ rows: [] }, HOUSE, '2026-08-24'), /no rows/);
    assert.throws(() => parseBoardPayload({ nope: true }, HOUSE, '2026-08-24'), /array of rows/);
  });
});

describe('merging a photo into the board on record', () => {
  const existing: Board = {
    weekOf: '2026-08-24',
    tasks: DEFAULT_TASKS,
    ticks: [{ taskId: 'dishes', memberId: 'mem_isaac' }],
  };

  test('new ticks are added', () => {
    const merged = mergeBoard(existing, {
      weekOf: '2026-08-24', tasks: [], ticks: [{ taskId: 'bins', memberId: 'mem_pete' }],
    });
    assert.equal(merged.added.length, 1);
    assert.equal(merged.board.ticks.length, 2);
  });

  // The expensive direction. A wiped board, a smudged marker, or a hand over
  // one column must not cost someone a chore they actually did — the evidence
  // is gone by the time anyone notices.
  test('a tick the photo did not show is kept, not deleted', () => {
    const merged = mergeBoard(existing, {
      weekOf: '2026-08-24', tasks: [], ticks: [],
    });
    assert.equal(merged.board.ticks.length, 1);
    assert.deepEqual(merged.keptDespiteAbsence, [{ taskId: 'dishes', memberId: 'mem_isaac' }]);
  });

  test('re-uploading the same photo changes nothing', () => {
    const photo = { weekOf: '2026-08-24', tasks: [], ticks: [{ taskId: 'bins', memberId: 'mem_pete' }] };
    const once = mergeBoard(existing, photo);
    const twice = mergeBoard(once.board, photo);
    assert.equal(twice.added.length, 0);
    assert.equal(twice.board.ticks.length, once.board.ticks.length);
  });

  test('last week\'s photo cannot be merged into this week', () => {
    assert.throws(() => mergeBoard(existing, {
      weekOf: '2026-08-17', tasks: [], ticks: [],
    }), /different weeks/);
  });
});

describe('where everyone stands', () => {
  const board: Board = {
    weekOf: '2026-08-24',
    tasks: DEFAULT_TASKS,
    ticks: [
      { taskId: 'dishes', memberId: 'mem_isaac' },
      { taskId: 'bins', memberId: 'mem_isaac' },
      { taskId: 'kitchen', memberId: 'mem_isaac' },
      { taskId: 'vacuum', memberId: 'mem_isaac' },
      { taskId: 'plants', memberId: 'mem_pete' },
    ],
  };

  test('four done is clear, one done is three short', () => {
    const standings = boardStanding(board, HOUSE);
    const isaac = standings.find((s) => s.memberId === 'mem_isaac')!;
    const pete = standings.find((s) => s.memberId === 'mem_pete')!;
    assert.equal(isaac.done, 4);
    assert.equal(isaac.short, 0);
    assert.equal(pete.done, 1);
    assert.equal(pete.short, 3);
  });

  test('a task that is not on the board does not count towards anyone', () => {
    const standings = boardStanding({
      ...board, ticks: [{ taskId: 'ghost-task', memberId: 'mem_kez' }],
    }, HOUSE);
    assert.equal(standings.find((s) => s.memberId === 'mem_kez')!.done, 0);
  });

  // Doing the bins on Tuesday and again on Friday is one job done twice.
  test('the same task twice is one', () => {
    const standings = boardStanding({
      ...board,
      ticks: [{ taskId: 'bins', memberId: 'mem_kez' }, { taskId: 'bins', memberId: 'mem_kez' }],
    }, HOUSE);
    assert.equal(standings.find((s) => s.memberId === 'mem_kez')!.done, 1);
  });

  test('remaining lists exactly what a nudge can offer', () => {
    const standings = boardStanding(board, HOUSE);
    const isaac = standings.find((s) => s.memberId === 'mem_isaac')!;
    assert.equal(isaac.remaining.length, DEFAULT_TASKS.length - 4);
    assert.ok(!isaac.remaining.includes('dishes'));
  });

  test('the chasing list is worst first, then alphabetical', () => {
    const list = behind(boardStanding(board, HOUSE));
    assert.equal(list[0].memberId, 'mem_eyong'); // 4 short, first alphabetically
    assert.ok(!list.some((s) => s.memberId === 'mem_isaac'));
    assert.equal(list.at(-1)!.memberId, 'mem_pete'); // 3 short
  });
});

describe('slugs and model output', () => {
  test('a label becomes a stable id', () => {
    assert.equal(slugTask('Take the bins out!'), 'take-the-bins-out');
    assert.equal(slugTask('   '), 'task');
  });

  test('a fenced code block is unwrapped', () => {
    const parsed = extractJson('```json\n{"rows":[{"task":"Bins","names":["Kez"]}]}\n```');
    assert.equal(parsed?.rows.length, 1);
  });

  test('prose around the JSON does not defeat the parse', () => {
    const parsed = extractJson('Here you go:\n{"rows":[]}\nHope that helps.');
    assert.deepEqual(parsed?.rows, []);
  });

  test('a reply with no JSON at all returns null rather than throwing', () => {
    assert.equal(extractJson('I could not read that image.'), null);
    assert.equal(extractJson('{ not json'), null);
    assert.equal(extractJson('{"nope": 1}'), null);
  });
});
