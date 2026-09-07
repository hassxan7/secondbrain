import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { isTriggered, TRIGGER } from '../src/banksia/bot-routes.ts';
import { parseMessReading, extractObject } from '../src/integrations/mess-vision.ts';

describe('waking the bot', () => {
  test('one word, anywhere, any case', () => {
    for (const text of ['banksy', 'Banksy', 'BANKSY', 'oi banksy', 'banksy who did this', 'banksy?']) {
      assert.equal(isTriggered(text), true, text);
    }
  });

  test('the common misspelling still works', () => {
    assert.equal(isTriggered('banksie'), true);
  });

  // A bot that fires on every photo is a bot that gets muted, so the word has
  // to be a real word boundary rather than a substring.
  test('it does not fire on ordinary chat', () => {
    for (const text of ['banksia', 'the banksia house', 'banks', 'my bank said no', '']) {
      assert.equal(isTriggered(text), false, text);
    }
  });

  test('the pattern is not sticky between calls', () => {
    assert.equal(TRIGGER.test('banksy'), true);
    assert.equal(TRIGGER.test('banksy'), true);
  });
});

describe('reading a photo of a mess', () => {
  const good = {
    description: 'Pan and bowl left in the sink',
    area: 'kitchen', peopleVisible: false, isMess: true,
  };

  test('a clean reading passes through', () => {
    const reading = parseMessReading(good);
    assert.equal(reading?.description, 'Pan and bowl left in the sink');
    assert.equal(reading?.area, 'kitchen');
  });

  // The guard that matters most. There is no version of "a man is standing at
  // the sink" that is not pointing at somebody, so it is refused in code and
  // not only in the prompt.
  test('a photo with a person in it is refused, not described', () => {
    assert.equal(parseMessReading({ ...good, peopleVisible: true }), null);
  });

  test('a photo of nothing that needs doing produces no poll', () => {
    assert.equal(parseMessReading({ ...good, isMess: false }), null);
  });

  test('an unknown area falls back rather than failing', () => {
    assert.equal(parseMessReading({ ...good, area: 'garage' })?.area, 'other');
    assert.equal(parseMessReading({ ...good, area: 42 })?.area, 'other');
  });

  test('a missing or oversized description is refused', () => {
    assert.equal(parseMessReading({ ...good, description: '' }), null);
    assert.equal(parseMessReading({ ...good, description: 'x'.repeat(200) }), null);
    assert.equal(parseMessReading({ ...good, description: 7 }), null);
    assert.equal(parseMessReading(null), null);
  });

  test('whitespace in the description is normalised', () => {
    assert.equal(
      parseMessReading({ ...good, description: '  Pan   in\nthe sink ' })?.description,
      'Pan in the sink',
    );
  });
});

describe('pulling the JSON out of a reply', () => {
  test('a fenced block is unwrapped', () => {
    const parsed = extractObject('```json\n{"description":"Bins are full"}\n```');
    assert.equal((parsed as { description: string }).description, 'Bins are full');
  });

  test('prose around it does not defeat the parse', () => {
    assert.ok(extractObject('Sure:\n{"isMess":true}\nHope that helps.'));
  });

  test('no JSON at all returns null rather than throwing', () => {
    assert.equal(extractObject('I cannot see an image.'), null);
    assert.equal(extractObject('{ nope'), null);
  });
});
