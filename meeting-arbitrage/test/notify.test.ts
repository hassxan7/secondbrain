import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { splitMessage, deliver, type OutboxRow } from '../src/integrations/notify.ts';

const row = (over: Partial<OutboxRow> = {}): OutboxRow => ({
  id: 'out_1', channel: 'email', target: 'pete@example.com',
  body: '2 to go\n\n1/4 on the board, three days left.', attempts: 0, ...over,
});

describe('splitting a queued message', () => {
  test('the first line is the subject', () => {
    const { subject, text } = splitMessage('Week closes tonight\n\nYou are 3 short.');
    assert.equal(subject, 'Week closes tonight');
    assert.equal(text, 'You are 3 short.');
  });

  test('a body with no blank line still sends', () => {
    const { subject, text } = splitMessage('Just this');
    assert.equal(subject, 'Banksia');
    assert.equal(text, 'Just this');
  });
});

describe('delivery', () => {
  // The bridge process holds the WhatsApp session; marking those rows from the
  // Worker would delete a message before anyone received it.
  test('WhatsApp is left alone for the bridge to drain', async () => {
    const outcome = await deliver(row({ channel: 'whatsapp' }), {});
    assert.equal(outcome.status, 'skipped');
  });

  test('with no sender configured the row is skipped, not failed', async () => {
    assert.equal((await deliver(row(), {})).status, 'skipped');
    assert.equal((await deliver(row({ channel: 'sms' }), {})).status, 'skipped');
  });

  test('a row that has used its attempts is given up on', async () => {
    const outcome = await deliver(row({ attempts: 3 }), {
      email: { apiKey: 'k', from: 'a@b.com' },
    });
    assert.equal(outcome.status, 'failed');
    assert.match(outcome.error ?? '', /gave up/);
  });

  test('the attempt budget is configurable', async () => {
    const outcome = await deliver(row({ attempts: 1 }), {
      email: { apiKey: 'k', from: 'a@b.com' }, maxAttempts: 1,
    });
    assert.equal(outcome.status, 'failed');
  });
});
