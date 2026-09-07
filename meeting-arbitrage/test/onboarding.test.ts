import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  normaliseEmail, normalisePhone, normaliseName, normaliseAvailability,
  impliedAnswer, describeAvailability, validateJoin, DATA_USE,
  type JoinDraft,
} from '../src/banksia/onboarding.ts';

const base: JoinDraft = {
  name: 'Pete',
  phone: '0412 345 678',
  availability: { mode: 'fixed', slots: [{ weekday: 1, time: '19:30' }] },
  acceptedDataUse: true,
};

describe('contact details', () => {
  test('the same mobile typed four ways is one number', () => {
    const forms = ['0412 345 678', '+61 412 345 678', '61412345678', '(04) 1234-5678'];
    const normalised = forms.map(normalisePhone);
    assert.deepEqual(new Set(normalised), new Set(['+61412345678']));
  });

  test('a landline or a mangled number is rejected rather than stored broken', () => {
    assert.equal(normalisePhone('02 9999 1234'), null);
    assert.equal(normalisePhone('12345'), null);
    assert.equal(normalisePhone('not a phone'), null);
  });

  test('international numbers already in E.164 pass through', () => {
    assert.equal(normalisePhone('+1 415 555 0123'), '+14155550123');
  });

  test('emails are lowercased and obvious rubbish is caught', () => {
    assert.equal(normaliseEmail('  Pete@Example.COM '), 'pete@example.com');
    assert.equal(normaliseEmail('pete@@example.com'), null);
    assert.equal(normaliseEmail('pete@localhost'), null);
    assert.equal(normaliseEmail('pete at example.com'), null);
  });

  test('names collapse whitespace and refuse the extremes', () => {
    assert.equal(normaliseName('  Pete   Smith '), 'Pete Smith');
    assert.equal(normaliseName('P'), null);
    assert.equal(normaliseName('x'.repeat(41)), null);
  });
});

describe('availability', () => {
  test('duplicate picks collapse and order is stable', () => {
    const a = normaliseAvailability({
      mode: 'fixed',
      slots: [{ weekday: 3, time: '19:30' }, { weekday: 1, time: '19:30' }, { weekday: 3, time: '19:30' }],
    });
    assert.deepEqual(a?.slots, [{ weekday: 1, time: '19:30' }, { weekday: 3, time: '19:30' }]);
  });

  test('nonsense weekdays and times are dropped, not stored', () => {
    const a = normaliseAvailability({
      mode: 'fixed',
      slots: [{ weekday: 9, time: '19:30' }, { weekday: 1, time: '25:00' }, { weekday: 1, time: '19:30' }],
    });
    assert.deepEqual(a?.slots, [{ weekday: 1, time: '19:30' }]);
  });

  test('picking nothing is only allowed when a calendar is doing the answering', () => {
    assert.equal(normaliseAvailability({ mode: 'fixed', slots: [] }), null);
    assert.equal(normaliseAvailability({ mode: 'varies', slots: [] }), null);
    assert.deepEqual(normaliseAvailability({ mode: 'calendar', slots: [] }), { mode: 'calendar', slots: [] });
  });

  // The load-bearing one. "I might not be free every week" must never reach the
  // scheduler as a firm yes, or the standing time gets pinned on someone who
  // never committed to it and their absence is then read as flakiness.
  test('"not every week" is ifneed, never yes', () => {
    const slot = { weekday: 1, time: '19:30' };
    assert.equal(impliedAnswer({ mode: 'fixed', slots: [slot] }, slot), 'yes');
    assert.equal(impliedAnswer({ mode: 'varies', slots: [slot] }, slot), 'ifneed');
  });

  test('a slot nobody picked implies nothing, rather than a no', () => {
    const picked = { weekday: 1, time: '19:30' };
    const other = { weekday: 2, time: '19:30' };
    assert.equal(impliedAnswer({ mode: 'fixed', slots: [picked] }, other), null);
  });

  test('a synced calendar asserts nothing up front', () => {
    const slot = { weekday: 1, time: '19:30' };
    assert.equal(impliedAnswer({ mode: 'calendar', slots: [slot] }, slot), null);
  });

  test('the summary says out loud that a varies answer is soft', () => {
    const text = describeAvailability({
      mode: 'varies',
      slots: [{ weekday: 1, time: '19:30' }, { weekday: 1, time: '20:30' }],
    });
    assert.match(text, /Monday 19:30, 20:30/);
    assert.match(text, /not every week/);
  });
});

describe('joining', () => {
  test('a good join produces a member', () => {
    const result = validateJoin(base);
    assert.equal(result.ok, true);
    assert.equal(result.member?.phone, '+61412345678');
    assert.equal(result.member?.email, null);
    assert.equal(result.matchedExisting, undefined);
  });

  test('every problem is reported at once, not one per attempt', () => {
    const result = validateJoin({
      name: 'P',
      email: 'nope',
      availability: { mode: 'fixed', slots: [] },
      acceptedDataUse: false,
    });
    assert.equal(result.ok, false);
    assert.equal(result.errors.length, 5);
  });

  test('no contact detail at all is refused — an unreachable housemate cannot be chased', () => {
    const { phone, ...noContact } = base;
    const result = validateJoin(noContact as JoinDraft);
    assert.equal(result.ok, false);
    assert.ok(result.errors.some((e) => /mobile or an email/.test(e)));
  });

  test('the consent step is not optional', () => {
    const result = validateJoin({ ...base, acceptedDataUse: false });
    assert.equal(result.ok, false);
  });

  // People open the join link twice. The second visit must update a person,
  // not mint a second housemate who then reads as never having done a chore.
  test('re-joining on the same number matches the existing housemate', () => {
    const existing = [{ id: 'mem_pete', name: 'Pete', phone: '+61412345678', email: null }];
    const result = validateJoin({ ...base, name: 'Peter' }, existing);
    assert.equal(result.ok, true);
    assert.equal(result.matchedExisting, 'mem_pete');
  });

  test('matching is on contact details, not on the name — two Sams are ordinary', () => {
    const existing = [{ id: 'mem_sam1', name: 'Pete', phone: '+61499999999', email: null }];
    const result = validateJoin(base, existing);
    assert.equal(result.matchedExisting, undefined);
  });

  test('a differently-typed version of the same number still matches', () => {
    const existing = [{ id: 'mem_pete', name: 'Pete', phone: '0412345678', email: null }];
    const result = validateJoin({ ...base, phone: '+61 412 345 678' }, existing);
    assert.equal(result.matchedExisting, 'mem_pete');
  });
});

describe('what people are told', () => {
  test('the data-use lines include the promise not to do anything else', () => {
    assert.ok(DATA_USE.some((l) => l.id === 'not'));
    assert.ok(DATA_USE.every((l) => l.label && l.detail));
  });
});
