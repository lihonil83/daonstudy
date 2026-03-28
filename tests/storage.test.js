import assert from 'node:assert/strict';
import test from 'node:test';

import {
  clearLearningData,
  readStorageJSON,
  writeStorageJSON,
} from '../src/utils/storage.js';
import {
  PROGRESS_KEY,
  REWARD_KEY,
  SCORES_KEY,
  WRONG_KEY,
} from '../src/config/storageKeys.js';

test('clearLearningData removes all learning-related storage keys', () => {
  writeStorageJSON(SCORES_KEY, [{ id: 'score-1' }]);
  writeStorageJSON(PROGRESS_KEY, { math: { units: { 'addition-up-to-20': { attempts: 1 } } } });
  writeStorageJSON(REWARD_KEY, { totalXp: 120 });
  writeStorageJSON(WRONG_KEY, [{ id: 'wrong-1' }]);

  clearLearningData();

  assert.deepEqual(readStorageJSON(SCORES_KEY, []), []);
  assert.deepEqual(readStorageJSON(PROGRESS_KEY, {}), {});
  assert.deepEqual(readStorageJSON(REWARD_KEY, {}), {});
  assert.deepEqual(readStorageJSON(WRONG_KEY, []), []);
});
