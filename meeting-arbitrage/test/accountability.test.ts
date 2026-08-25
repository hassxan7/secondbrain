import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  settleWeek, resolveDisputes, resolveIssue, offenderTable, buildAgenda,
  formatMoney, DEFAULT_CHORE_CONFIG,
  type ChoreClaim, type ChoreConfig, type IssueResponse, type Issue,
} from '../src/banksia/accountability.ts';

const HOUSE = ['hassaan', 'isaac', 'kez', 'ross', 'eyong', 'pete', 'manan'];
const WEEK = '2026-08-24';

const TASKS = [
  'kitchen-bench', 'sink-drain', 'bins-out', 'bathroom',
  'vacuum-common', 'fridge-clear', 'mop-kitchen', 'recycling',
].map((id) => ({ id, label: id.replace(/-/g, ' ') }));

const CONFIG: ChoreConfig = { ...DEFAULT_CHORE_CONFIG, tasks: TASKS };

function claim(participantId: string, taskId: string, extra: Partial<ChoreClaim> = {}): ChoreClaim {
  return { participantId, taskId, weekOf: WEEK, claimedAt: `${WEEK}T10:00:00Z`, ...extra };
}

describe('settleWeek', () => {
  test('four tasks clears the bar, three does not', () => {
    const claims = [
      ...TASKS.slice(0, 4).map((t) => claim('kez', t.id)),
      ...TASKS.slice(0, 3).map((t) => claim('pete', t.id)),
    ];
    const settled = settleWeek({ weekOf: WEEK, participantIds: ['kez', 'pete'], claims, config: CONFIG });

    const kez = settled.find((s) => s.participantId === 'kez')!;
    assert.equal(kez.shortfall, 0);
    assert.equal(kez.fineCents, 0);
    assert.equal(kez.state, 'waived');

    const pete = settled.find((s) => s.participantId === 'pete')!;
    assert.equal(pete.completed, 3);
    assert.equal(pete.shortfall, 1);
    assert.equal(pete.fineCents, 500);
    assert.equal(pete.state, 'pending');
  });

  test('doing nothing costs the full four tasks', () => {
    const settled = settleWeek({ weekOf: WEEK, participantIds: ['pete'], claims: [], config: CONFIG });
    assert.equal(settled[0].shortfall, 4);
    assert.equal(formatMoney(settled[0].fineCents), '$20.00');
  });

  test('the same task twice is still one task', () => {
    const claims = [claim('pete', 'bins-out'), claim('pete', 'bins-out'), claim('pete', 'bins-out')];
    const settled = settleWeek({ weekOf: WEEK, participantIds: ['pete'], claims, config: CONFIG });
    assert.equal(settled[0].completed, 1, 'no farming the bins');
  });

  test('a challenged claim is suspended, not counted, and explained', () => {
    const claims = [
      claim('pete', 'sink-drain', { challengedBy: ['hassaan'] }),
      ...TASKS.slice(2, 5).map((t) => claim('pete', t.id)),
    ];
    const settled = settleWeek({ weekOf: WEEK, participantIds: ['pete'], claims, config: CONFIG });
    assert.equal(settled[0].completed, 3);
    assert.equal(settled[0].challenged, 1);
    assert.equal(settled[0].shortfall, 1);
    assert.match(settled[0].note, /challenged/);
  });

  test('re-ticking a challenged task does not launder the challenge', () => {
    // Pete's sink-drain claim is challenged, so he simply claims it again.
    const claims = [
      claim('pete', 'sink-drain', { challengedBy: ['hassaan'] }),
      claim('pete', 'sink-drain'),
      ...TASKS.slice(2, 5).map((t) => claim('pete', t.id)),
    ];
    const settled = settleWeek({ weekOf: WEEK, participantIds: ['pete'], claims, config: CONFIG });
    assert.equal(settled[0].challenged, 1, 'the challenge sticks to the task');
    assert.equal(settled[0].completed, 3, 'and it still does not count toward the four');
    assert.equal(settled[0].fineCents, 500);
  });

  test('claims for other weeks or unknown tasks are ignored', () => {
    const claims = [
      claim('kez', 'bins-out', { weekOf: '2026-08-17' }),
      claim('kez', 'wash-the-dog'),
      ...TASKS.slice(0, 2).map((t) => claim('kez', t.id)),
    ];
    const settled = settleWeek({ weekOf: WEEK, participantIds: ['kez'], claims, config: CONFIG });
    assert.equal(settled[0].completed, 2);
  });
});

describe('resolveDisputes — attendance is the price of arguing', () => {
  const settlements = settleWeek({
    weekOf: WEEK, participantIds: ['pete', 'ross'], claims: [], config: CONFIG,
  });

  test('an undisputed fine upholds itself with nobody chasing it', () => {
    const out = resolveDisputes({ settlements, disputes: [], presentAtMeeting: HOUSE });
    assert.ok(out.every((s) => s.state === 'upheld'));
    assert.match(out[0].outcomeNote, /No one had to chase it/);
  });

  test('disputing while present gets you heard', () => {
    const out = resolveDisputes({
      settlements,
      disputes: [{ participantId: 'ross', weekOf: WEEK, argument: 'I did the bins, board was full', raisedAt: 'x' }],
      presentAtMeeting: ['ross', 'hassaan', 'kez'],
    });
    const ross = out.find((s) => s.participantId === 'ross')!;
    assert.equal(ross.state, 'disputed');
    assert.equal(ross.heard, true);
    assert.match(ross.outcomeNote, /house to vote/);
  });

  test('disputing while absent forfeits it — this is the lever', () => {
    const out = resolveDisputes({
      settlements,
      disputes: [{ participantId: 'pete', weekOf: WEEK, argument: 'unfair', raisedAt: 'x' }],
      presentAtMeeting: ['hassaan', 'kez', 'ross'],
    });
    const pete = out.find((s) => s.participantId === 'pete')!;
    assert.equal(pete.state, 'upheld');
    assert.equal(pete.heard, false);
    assert.match(pete.outcomeNote, /not at the meeting/);
  });
});

describe('resolveIssue — the noodles in the sink', () => {
  const issue: Issue = {
    id: 'i1', raisedBy: 'hassaan',
    description: 'sink blocked with noodles again',
    createdAt: '2026-08-24T09:00:00Z',
    closesAt: '2026-08-24T21:00:00Z',
  };
  const AFTER = '2026-08-25T09:00:00Z';
  const BEFORE = '2026-08-24T12:00:00Z';

  const answer = (participantId: string, a: 'was-me' | 'not-me'): IssueResponse =>
    ({ issueId: 'i1', participantId, answer: a, at: '2026-08-24T10:00:00Z' });

  test('one owner closes it without any meeting time', () => {
    const out = resolveIssue(issue, [answer('pete', 'was-me')], HOUSE, AFTER);
    assert.equal(out.status, 'owned');
    assert.deepEqual(out.owners, ['pete']);
    assert.equal(out.escalate, false);
  });

  test('two owners is fine and still closes', () => {
    const out = resolveIssue(issue, [answer('pete', 'was-me'), answer('ross', 'was-me')], HOUSE, AFTER);
    assert.equal(out.status, 'shared');
    assert.deepEqual(out.owners, ['ross', 'pete'].sort((a, b) => HOUSE.indexOf(a) - HOUSE.indexOf(b)));
    assert.equal(out.escalate, false);
  });

  test('silence gets named publicly and escalates', () => {
    const responses = ['isaac', 'kez', 'ross', 'eyong'].map((p) => answer(p, 'not-me'));
    const out = resolveIssue(issue, responses, HOUSE, AFTER);
    assert.equal(out.status, 'unresolved-silence');
    assert.deepEqual(out.silent, ['pete', 'manan'], 'the raiser is not expected to answer');
    assert.equal(out.escalate, true);
    assert.match(out.summary, /Everyone answered except: pete, manan/);
  });

  test('everyone denying still escalates rather than evaporating', () => {
    const responses = HOUSE.filter((p) => p !== 'hassaan').map((p) => answer(p, 'not-me'));
    const out = resolveIssue(issue, responses, HOUSE, AFTER);
    assert.equal(out.status, 'no-owner');
    assert.equal(out.escalate, true);
  });

  test('an open poll does not name anyone yet', () => {
    const out = resolveIssue(issue, [answer('kez', 'not-me')], HOUSE, BEFORE);
    assert.deepEqual(out.silent, []);
    assert.equal(out.escalate, false);
    assert.match(out.summary, /Still open/);
  });

  test('changing your answer is allowed; the last one counts', () => {
    const responses: IssueResponse[] = [
      { issueId: 'i1', participantId: 'pete', answer: 'not-me', at: '2026-08-24T10:00:00Z' },
      { issueId: 'i1', participantId: 'pete', answer: 'was-me', at: '2026-08-24T11:00:00Z' },
    ];
    const out = resolveIssue(issue, responses, HOUSE, AFTER);
    assert.deepEqual(out.owners, ['pete']);
    assert.equal(out.status, 'owned');
  });
});

describe('offenderTable and agenda', () => {
  test('ranks the person the house keeps relitigating to the top', () => {
    const outcomes = [
      { issueId: 'i1', status: 'owned' as const, owners: ['pete'], denied: [], silent: [], summary: '', escalate: false },
      { issueId: 'i2', status: 'owned' as const, owners: ['pete'], denied: [], silent: [], summary: '', escalate: false },
      { issueId: 'i3', status: 'unresolved-silence' as const, owners: [], denied: [], silent: ['pete', 'manan'], summary: '', escalate: true },
    ];
    const settlements = resolveDisputes({
      settlements: settleWeek({ weekOf: WEEK, participantIds: HOUSE, claims: [], config: CONFIG }),
      disputes: [], presentAtMeeting: HOUSE,
    });
    const table = offenderTable({
      participantIds: HOUSE, outcomes, settlements,
      meetingsMissed: { pete: 6, manan: 1 },
    });

    assert.equal(table[0].participantId, 'pete');
    assert.equal(table[0].ownedIssues, 2);
    assert.equal(table[0].meetingsMissed, 6);
    assert.ok(table[0].score > table[1].score);
  });

  test('agenda turns unfinished business into named items', () => {
    const settlements = resolveDisputes({
      settlements: settleWeek({ weekOf: WEEK, participantIds: ['pete', 'ross'], claims: [], config: CONFIG }),
      disputes: [{ participantId: 'ross', weekOf: WEEK, argument: 'board was full', raisedAt: 'x' }],
      presentAtMeeting: ['ross'],
    });
    const outcomes = [{
      issueId: 'i3', status: 'unresolved-silence' as const, owners: [], denied: [],
      silent: ['pete'], summary: 'Nobody owned this.', escalate: true,
    }];
    const offenders = offenderTable({
      participantIds: ['pete', 'ross'], outcomes, settlements, meetingsMissed: { pete: 6 },
    });
    const agenda = buildAgenda({ outcomes, settlements, offenders, nameOf: (id) => id.toUpperCase() });

    const kinds = agenda.map((a) => a.kind);
    assert.ok(kinds.includes('dispute'));
    assert.ok(kinds.includes('unresolved-issue'));
    assert.ok(kinds.includes('repeat-offender'));
    assert.ok(kinds.includes('ledger'), 'the ledger is always read out');
    assert.match(agenda.find((a) => a.kind === 'dispute')!.title, /ROSS is contesting a \$20\.00 fine/);
  });
});
