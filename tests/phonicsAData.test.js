import assert from 'node:assert/strict';
import test from 'node:test';

import phonicsA from '../src/data/english/phonics-a.json' with { type: 'json' };

test('phonics-a includes balanced word and letter cards', () => {
  assert.equal(phonicsA.id, 'phonics-a');
  assert.ok(phonicsA.questions.length >= 20);

  const modeCounts = phonicsA.questions.reduce(
    (counts, question) => {
      counts[question.visual?.mode] = (counts[question.visual?.mode] ?? 0) + 1;
      return counts;
    },
    {},
  );

  assert.equal(modeCounts.word, 10);
  assert.equal(modeCounts.letter, 10);
});

test('phonics-a questions keep answer and visual data aligned', () => {
  for (const question of phonicsA.questions) {
    assert.equal(question.type, 'multiple-choice');
    assert.equal(question.visual?.type, 'phonics-card');
    assert.ok(question.choices.includes(question.answer));
    assert.equal(question.hints.length, 2);

    if (question.visual.mode === 'word') {
      assert.equal(question.answer, 'A/a');
      assert.ok(question.visual.keyword);
      assert.ok(question.visual.translation);
    }

    if (question.visual.mode === 'letter') {
      assert.equal(question.visual.upper, 'A');
      assert.equal(question.visual.lower, 'a');
      assert.ok(typeof question.answer === 'string' && question.answer.length > 0);
    }
  }
});
