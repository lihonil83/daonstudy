import assert from 'node:assert/strict';
import test from 'node:test';

import phonicsB from '../src/data/english/phonics-b.json' with { type: 'json' };
import phonicsC from '../src/data/english/phonics-c.json' with { type: 'json' };

function validatePhonicsUnit(unit, expectedId, expectedUpper, expectedLower) {
  assert.equal(unit.id, expectedId);
  assert.ok(unit.questions.length >= 20);

  const modeCounts = unit.questions.reduce(
    (counts, question) => {
      counts[question.visual?.mode] = (counts[question.visual?.mode] ?? 0) + 1;
      return counts;
    },
    {},
  );

  assert.equal(modeCounts.word, 10);
  assert.equal(modeCounts.letter, 10);

  for (const question of unit.questions) {
    assert.equal(question.type, 'multiple-choice');
    assert.equal(question.visual?.type, 'phonics-card');
    assert.ok(question.choices.includes(question.answer));
    assert.equal(question.hints.length, 2);

    if (question.visual.mode === 'word') {
      assert.equal(question.answer, `${expectedUpper}/${expectedLower}`);
      assert.ok(question.visual.keyword);
      assert.ok(question.visual.translation);
    }

    if (question.visual.mode === 'letter') {
      assert.equal(question.visual.upper, expectedUpper);
      assert.equal(question.visual.lower, expectedLower);
      assert.ok(typeof question.answer === 'string' && question.answer.length > 0);
    }
  }
}

test('phonics-b keeps balanced cards and aligned answers', () => {
  validatePhonicsUnit(phonicsB, 'phonics-b', 'B', 'b');
});

test('phonics-c keeps balanced cards and aligned answers', () => {
  validatePhonicsUnit(phonicsC, 'phonics-c', 'C', 'c');
});
