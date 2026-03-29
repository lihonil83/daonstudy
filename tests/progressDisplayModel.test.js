import assert from 'node:assert/strict';
import test from 'node:test';

import { getVisibleProgressPercent } from '../src/models/progressDisplayModel.js';

test('getVisibleProgressPercent keeps zero progress at zero', () => {
  assert.equal(getVisibleProgressPercent(0, 207), 0);
});

test('getVisibleProgressPercent shows early progress instead of rounding down to zero', () => {
  assert.equal(getVisibleProgressPercent(1, 207), 1);
});

test('getVisibleProgressPercent never shows 100 before completion', () => {
  assert.equal(getVisibleProgressPercent(206, 207), 99);
});

test('getVisibleProgressPercent reaches 100 on completion', () => {
  assert.equal(getVisibleProgressPercent(207, 207), 100);
});
