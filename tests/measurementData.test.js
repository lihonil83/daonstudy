import assert from 'node:assert/strict';
import test from 'node:test';

import lengthUnits from '../src/data/math/length-units.json' with { type: 'json' };
import weightUnits from '../src/data/math/weight-units.json' with { type: 'json' };

function validateMeasurementUnit(unit, expectedId, expectedCategory) {
  assert.equal(unit.id, expectedId);
  assert.ok(unit.questions.length >= 20);

  for (const question of unit.questions) {
    assert.equal(question.type, 'multiple-choice');
    assert.ok(question.choices.includes(question.answer));
    assert.equal(question.hints.length, 2);
    assert.equal(question.visual?.type, 'measurement-card');
    assert.equal(question.visual?.category, expectedCategory);
    assert.ok(question.visual?.title);
    assert.ok(question.visual?.guide);
  }
}

test('length-units keeps aligned choices and visuals', () => {
  validateMeasurementUnit(lengthUnits, 'length-units', 'length');
});

test('weight-units keeps aligned choices and visuals', () => {
  validateMeasurementUnit(weightUnits, 'weight-units', 'weight');
});
