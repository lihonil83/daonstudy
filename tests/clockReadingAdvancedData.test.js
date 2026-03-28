import assert from 'node:assert/strict';
import test from 'node:test';

import clockReadingAdvanced from '../src/data/math/clock-reading-advanced.json' with { type: 'json' };

test('clock-reading-advanced includes 20 questions using only :15 and :45 visuals', () => {
  assert.equal(clockReadingAdvanced.id, 'clock-reading-advanced');
  assert.ok(clockReadingAdvanced.questions.length >= 20);

  const minutes = new Set(clockReadingAdvanced.questions.map((question) => question.visual?.minute));

  assert.deepEqual([...minutes].sort((left, right) => left - right), [15, 45]);
});

test('clock-reading-advanced answers stay aligned with choices and visuals', () => {
  for (const question of clockReadingAdvanced.questions) {
    assert.equal(question.type, 'multiple-choice');
    assert.equal(question.visual?.type, 'clock');
    assert.ok(question.choices.includes(question.answer));
    assert.equal(question.hints.length, 2);

    const expectedAnswer = `${question.visual.hour}시 ${question.visual.minute}분`;

    assert.equal(question.answer, expectedAnswer);
  }
});
