import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildWrongId,
  clearReviewedWrongAnswers,
  pruneWrongAnswers,
  reviewWrongAnswer,
  splitWrongAnswers,
  upsertWrongAnswer,
} from '../src/models/wrongAnswerModel.js';

const wrongData = {
  originalQuestionId: 'mul3-005',
  subject: 'math',
  unit: 'multiplication-3',
  unitTitle: '3단 구구단',
  question: '3 x 5 = ?',
  choices: [12, 15, 18, 20],
  userAnswer: 12,
  correctAnswer: 15,
  hints: ['3을 5번 더해봐요.', '3 + 3 + 3 + 3 + 3 = ?'],
  visual: { type: 'clock', hour: 3, minute: 30 },
};

test('buildWrongId increments per day', () => {
  const items = [
    { id: 'wrong-20260328-001', date: '2026-03-28' },
    { id: 'wrong-20260328-002', date: '2026-03-28' },
  ];

  assert.equal(buildWrongId(items, '2026-03-28'), 'wrong-20260328-003');
});

test('upsertWrongAnswer creates a new item and deduplicates by originalQuestionId', () => {
  const firstInsert = upsertWrongAnswer([], wrongData, '2026-03-28');
  const updatedInsert = upsertWrongAnswer(
    [
      {
        ...firstInsert.nextItem,
        reviewed: true,
        reviewedDate: '2026-03-29',
        reviewCorrect: true,
      },
    ],
    { ...wrongData, userAnswer: 18 },
    '2026-03-30',
  );

  assert.equal(firstInsert.nextWrongAnswers.length, 1);
  assert.equal(updatedInsert.nextWrongAnswers.length, 1);
  assert.equal(updatedInsert.nextItem.id, firstInsert.nextItem.id);
  assert.equal(updatedInsert.nextItem.userAnswer, 18);
  assert.equal(updatedInsert.nextItem.reviewed, false);
  assert.equal(updatedInsert.nextItem.reviewedDate, null);
  assert.deepEqual(updatedInsert.nextItem.visual, { type: 'clock', hour: 3, minute: 30 });
});

test('reviewWrongAnswer marks success and failure with the right state', () => {
  const storedWrongAnswers = [
    {
      id: 'wrong-20260328-001',
      ...wrongData,
      date: '2026-03-28',
      reviewed: false,
      reviewedDate: null,
      reviewCorrect: null,
    },
  ];

  const reviewed = reviewWrongAnswer(storedWrongAnswers, 'wrong-20260328-001', true, '2026-03-29');
  const retried = reviewWrongAnswer(reviewed, 'wrong-20260328-001', false, '2026-03-30');

  assert.equal(reviewed[0].reviewed, true);
  assert.equal(reviewed[0].reviewedDate, '2026-03-29');
  assert.equal(reviewed[0].reviewCorrect, true);
  assert.equal(retried[0].reviewed, false);
  assert.equal(retried[0].date, '2026-03-30');
  assert.equal(retried[0].reviewCorrect, false);
});

test('pruneWrongAnswers removes the oldest reviewed items first', () => {
  const items = [
    { id: '1', date: '2026-03-25', reviewed: true, reviewedDate: '2026-03-25' },
    { id: '2', date: '2026-03-26', reviewed: true, reviewedDate: '2026-03-26' },
    { id: '3', date: '2026-03-27', reviewed: false, reviewedDate: null },
  ];

  const pruned = pruneWrongAnswers(items, 2);

  assert.deepEqual(pruned.map((item) => item.id), ['2', '3']);
});

test('splitWrongAnswers sorts unreviewed and reviewed lists by newest first', () => {
  const { reviewedList, unreviewedList } = splitWrongAnswers([
    { id: '1', date: '2026-03-27', reviewed: false, reviewedDate: null },
    { id: '2', date: '2026-03-29', reviewed: false, reviewedDate: null },
    { id: '3', date: '2026-03-28', reviewed: true, reviewedDate: '2026-03-30' },
  ]);

  assert.deepEqual(unreviewedList.map((item) => item.id), ['2', '1']);
  assert.deepEqual(reviewedList.map((item) => item.id), ['3']);
  assert.equal(clearReviewedWrongAnswers([...unreviewedList, ...reviewedList]).length, 2);
});
