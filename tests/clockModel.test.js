import assert from 'node:assert/strict';
import test from 'node:test';

import { getClockHandAngles } from '../src/models/clockModel.js';

test('getClockHandAngles returns exact hour and minute hand degrees', () => {
  const { hourAngle, minuteAngle } = getClockHandAngles(3, 30);

  assert.equal(hourAngle, 105);
  assert.equal(minuteAngle, 180);
});

test('getClockHandAngles normalizes hour and minute values', () => {
  const { hourAngle, minuteAngle } = getClockHandAngles(15, 90);

  assert.equal(hourAngle, 135);
  assert.equal(minuteAngle, 180);
});
