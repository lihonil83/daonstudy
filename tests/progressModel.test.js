import assert from 'node:assert/strict';
import test from 'node:test';

import {
  applyQuizResult,
  createEmptyProgress,
  getCurrentStreak,
  getStudyDaysCount,
} from '../src/models/progressModel.js';

test('applyQuizResult stores score history and updates best progress', () => {
  const storedScores = [
    {
      id: 'score-20260327-001',
      date: '2026-03-27',
      subject: 'math',
      unit: 'multiplication-2',
      unitTitle: '2단 구구단',
      score: 7,
      total: 10,
      stars: 2,
      xpEarned: 90,
      duration: 120,
      improved: false,
    },
  ];
  const storedProgress = {
    math: {
      units: {
        'multiplication-2': {
          bestScore: 7,
          bestStars: 2,
          attempts: 1,
          firstClear: '2026-03-27',
        },
      },
    },
    english: { units: {} },
  };

  const { nextProgress, nextScores, scoreEntry } = applyQuizResult(
    storedScores,
    storedProgress,
    {
      subject: 'math',
      unit: 'multiplication-2',
      unitTitle: '2단 구구단',
      score: 10,
      total: 10,
      stars: 3,
      xpEarned: 170,
      duration: 80,
    },
    '2026-03-28',
  );

  assert.equal(nextScores.length, 2);
  assert.equal(scoreEntry.id, 'score-20260328-001');
  assert.equal(scoreEntry.improved, true);
  assert.equal(nextProgress.math.units['multiplication-2'].bestScore, 10);
  assert.equal(nextProgress.math.units['multiplication-2'].bestStars, 3);
  assert.equal(nextProgress.math.units['multiplication-2'].attempts, 2);
  assert.equal(nextProgress.math.units['multiplication-2'].firstClear, '2026-03-27');
});

test('applyQuizResult does not lower best score or stars on a weaker retry', () => {
  const storedScores = [];
  const storedProgress = {
    math: {
      units: {
        'multiplication-3': {
          bestScore: 10,
          bestStars: 3,
          attempts: 2,
          firstClear: '2026-03-28',
        },
      },
    },
    english: { units: {} },
  };

  const { nextProgress, scoreEntry } = applyQuizResult(
    storedScores,
    storedProgress,
    {
      subject: 'math',
      unit: 'multiplication-3',
      unitTitle: '3단 구구단',
      score: 6,
      total: 10,
      stars: 1,
      xpEarned: 75,
      duration: 95,
    },
    '2026-03-29',
  );

  assert.equal(scoreEntry.improved, false);
  assert.equal(nextProgress.math.units['multiplication-3'].bestScore, 10);
  assert.equal(nextProgress.math.units['multiplication-3'].bestStars, 3);
  assert.equal(nextProgress.math.units['multiplication-3'].attempts, 3);
  assert.equal(nextProgress.math.units['multiplication-3'].firstClear, '2026-03-28');
});

test('getCurrentStreak counts consecutive study days and stops at gaps', () => {
  const scores = [
    { date: '2026-03-25' },
    { date: '2026-03-27' },
    { date: '2026-03-28' },
    { date: '2026-03-29' },
  ];

  assert.equal(getCurrentStreak(scores, new Date('2026-03-29T12:00:00Z')), 3);
  assert.equal(getStudyDaysCount(scores), 4);
});

test('normalize helpers are safe through applyQuizResult with empty progress input', () => {
  const { nextProgress } = applyQuizResult(
    [],
    createEmptyProgress(),
    {
      subject: 'english',
      unit: 'alphabet-upper',
      unitTitle: '알파벳 대문자',
      score: 8,
      total: 10,
      stars: 2,
      xpEarned: 105,
      duration: 110,
    },
    '2026-03-30',
  );

  assert.deepEqual(nextProgress.math.units, {});
  assert.equal(nextProgress.english.units['alphabet-upper'].bestScore, 8);
});
