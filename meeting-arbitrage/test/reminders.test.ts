import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  dueReminders, pickChannel, withinSendingHours, reminderPolicy,
  DEFAULT_REMINDER_CONFIG, type ReminderInput, type ReminderTarget,
} from '../src/banksia/reminders.ts';
import { boardStanding, DEFAULT_TASKS, type Board } from '../src/banksia/board.ts';

const TARGETS: ReminderTarget[] = [
  { memberId: 'mem_isaac', name: 'Isaac', phone: '+61400000001' },
  { memberId: 'mem_pete', name: 'Pete', phone: '+61400000002' },
  { memberId: 'mem_kez', name: 'Kez', email: 'kez@example.com' },
];

const BOARD: Board = {
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

const MEMBERS = TARGETS.map((t) => ({ id: t.memberId, name: t.name }));

function thursday(over: Partial<ReminderInput> = {}): ReminderInput {
  return {
    weekOf: '2026-08-24',
    weekday: 4,
    minuteOfDay: 18 * 60,
    targets: TARGETS,
    standings: boardStanding(BOARD, MEMBERS),
    ...over,
  };
}

describe('when nothing may be sent', () => {
  test('nothing goes out at 2am', () => {
    assert.deepEqual(dueReminders(thursday({ minuteOfDay: 2 * 60 })), []);
  });

  test('nothing goes out at 10pm', () => {
    assert.deepEqual(dueReminders(thursday({ minuteOfDay: 22 * 60 })), []);
  });

  test('8am is in, 9pm is out — the boundaries are the promise', () => {
    assert.equal(withinSendingHours(8 * 60, DEFAULT_REMINDER_CONFIG), true);
    assert.equal(withinSendingHours(8 * 60 - 1, DEFAULT_REMINDER_CONFIG), false);
    assert.equal(withinSendingHours(21 * 60 - 1, DEFAULT_REMINDER_CONFIG), true);
    assert.equal(withinSendingHours(21 * 60, DEFAULT_REMINDER_CONFIG), false);
  });

  // The most common way one of these systems loses the room.
  test('someone who has done their four is never chased', () => {
    const out = dueReminders(thursday());
    assert.ok(!out.some((r) => r.memberId === 'mem_isaac'));
  });

  test('no chore nudge on a Tuesday — a weekly target does not need a daily poke', () => {
    const out = dueReminders(thursday({ weekday: 2 }));
    assert.deepEqual(out, []);
  });
});

describe('chore chasing', () => {
  test('Thursday says how many are left and offers the open ones', () => {
    const out = dueReminders(thursday());
    const pete = out.find((r) => r.memberId === 'mem_pete')!;
    assert.equal(pete.kind, 'chore-nudge');
    assert.match(pete.subject, /3 to go/);
    assert.match(pete.body, /1\/4 on the board/);
  });

  // Asking for four chores at 6pm on Sunday is an accusation, not a request.
  // The last message says what happens now instead.
  test('Sunday names the stake instead of asking for the impossible', () => {
    const out = dueReminders(thursday({ weekday: 0 }));
    const pete = out.find((r) => r.memberId === 'mem_pete')!;
    assert.equal(pete.kind, 'chore-last-call');
    assert.match(pete.body, /\$100/);
    assert.match(pete.body, /settles at midnight/);
  });

  test('there is no third chore reminder — the ladder stops at two', () => {
    const kinds = new Set(
      [0, 1, 2, 3, 4, 5, 6].flatMap((weekday) =>
        dueReminders(thursday({ weekday })).map((r) => r.kind)),
    );
    assert.deepEqual(kinds, new Set(['chore-nudge', 'chore-last-call']));
  });
});

describe('the weekly budget', () => {
  test('three is the cap, and it is spent on what expires soonest', () => {
    const out = dueReminders(thursday({
      meetingTomorrow: { label: 'Monday 7:30pm', attendees: ['mem_pete'] },
      awaitingPoll: ['mem_pete'],
      openIssues: [
        { id: 'i1', description: 'Pan left on the stove', awaiting: ['mem_pete'] },
        { id: 'i2', description: 'Bin not taken out', awaiting: ['mem_pete'] },
      ],
    }));
    const pete = out.filter((r) => r.memberId === 'mem_pete');
    assert.equal(pete.length, 3);
    assert.deepEqual(pete.map((r) => r.kind), ['meeting-tomorrow', 'issue-poll', 'issue-poll']);
  });

  test('someone already at their cap this week gets nothing more', () => {
    const out = dueReminders(thursday({ sentThisWeek: { mem_pete: 3 } }));
    assert.ok(!out.some((r) => r.memberId === 'mem_pete'));
    assert.ok(out.some((r) => r.memberId === 'mem_kez'));
  });

  test('the cap is per person, not per house', () => {
    const out = dueReminders(thursday({ sentThisWeek: { mem_pete: 3 } }));
    assert.equal(out.filter((r) => r.memberId === 'mem_kez').length, 1);
  });
});

describe('reaching people', () => {
  test('the free channel wins — WhatsApp, then email, then paid SMS', () => {
    assert.equal(pickChannel({ memberId: 'a', name: 'A', whatsapp: true, phone: '+61400000000', email: 'a@b.com' }), 'whatsapp');
    assert.equal(pickChannel({ memberId: 'a', name: 'A', phone: '+61400000000', email: 'a@b.com' }), 'email');
    assert.equal(pickChannel({ memberId: 'a', name: 'A', phone: '+61400000000' }), 'sms');
    assert.equal(pickChannel({ memberId: 'a', name: 'A' }), null);
  });

  test('an unreachable housemate is skipped, not crashed on', () => {
    const out = dueReminders(thursday({
      targets: [...TARGETS, { memberId: 'mem_ghost', name: 'Ghost' }],
      standings: boardStanding(BOARD, [...MEMBERS, { id: 'mem_ghost', name: 'Ghost' }]),
    }));
    assert.ok(!out.some((r) => r.memberId === 'mem_ghost'));
    assert.ok(out.some((r) => r.memberId === 'mem_pete'));
  });

  test('a standing with no matching target is ignored rather than half-sent', () => {
    const out = dueReminders(thursday({ targets: [TARGETS[0]] }));
    assert.deepEqual(out, []);
  });
});

describe('idempotence', () => {
  // The cron may run twice, retry, or overlap. Sending is keyed on the id, so
  // a duplicated run must produce the same keys rather than double the noise.
  test('two runs of the same day produce identical ids', () => {
    const a = dueReminders(thursday()).map((r) => r.id);
    const b = dueReminders(thursday({ minuteOfDay: 19 * 60 })).map((r) => r.id);
    assert.deepEqual(a, b);
  });

  test('ids are unique within a run, including across issues', () => {
    const out = dueReminders(thursday({
      openIssues: [
        { id: 'i1', description: 'Pan', awaiting: ['mem_pete'] },
        { id: 'i2', description: 'Bin', awaiting: ['mem_pete'] },
      ],
    }));
    assert.equal(new Set(out.map((r) => r.id)).size, out.length);
  });

  test('next week is a different key', () => {
    const a = dueReminders(thursday()).map((r) => r.id);
    const b = dueReminders(thursday({ weekOf: '2026-08-31' })).map((r) => r.id);
    assert.equal(a.some((id) => b.includes(id)), false);
  });
});

describe('the promise made at onboarding', () => {
  test('the policy states the cap and the quiet hours', () => {
    const lines = reminderPolicy().join(' ');
    assert.match(lines, /3 messages a week/);
    assert.match(lines, /9pm and 8am/);
  });
});
