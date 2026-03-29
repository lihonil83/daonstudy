import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildQuestionSet,
  buildQuizResult,
  createQuestionOutcome,
  evaluateAnswer,
  getStars,
} from '../src/models/quizModel.js';

const unit = {
  id: 'multiplication-3',
  title: '3단 구구단',
  subject: 'math',
};

const question = {
  id: 'mul3-005',
  question: '3 x 5 = ?',
  choices: [12, 15, 18, 20],
  answer: 15,
  hints: ['3을 5번 더해봐요.', '3 + 3 + 3 + 3 + 3 = ?'],
};

test('buildQuestionSet limits question count and clones choices/hints', () => {
  const sourceQuestions = [
    question,
    {
      id: 'mul3-006',
      question: '3 x 6 = ?',
      choices: [16, 18, 20, 22],
      answer: 18,
      hints: ['3이 여섯 묶음이에요.', '3 x 6은 18이에요.'],
    },
  ];

  const questionSet = buildQuestionSet(
    sourceQuestions,
    1,
    (items) => [...items].reverse(),
    (items) => [...items].reverse(),
  );

  assert.equal(questionSet.length, 1);
  assert.equal(questionSet[0].id, 'mul3-006');
  assert.deepEqual(questionSet[0].choices, [22, 20, 18, 16]);
  assert.notEqual(questionSet[0].choices, sourceQuestions[1].choices);
  assert.notEqual(questionSet[0].hints, sourceQuestions[1].hints);
});

test('buildQuestionSet can expand beyond the source pool and preserve original question ids', () => {
  const sourceQuestions = [
    question,
    {
      id: 'mul3-006',
      question: '3 x 6 = ?',
      choices: [16, 18, 20, 22],
      answer: 18,
      hints: ['3이 여섯 묶음이에요.', '3 x 6은 18이에요.'],
    },
  ];

  const questionSet = buildQuestionSet(
    sourceQuestions,
    5,
    (items) => items,
    (items) => items,
  );

  assert.equal(questionSet.length, 5);
  assert.equal(questionSet[0].id, 'mul3-005');
  assert.equal(questionSet[1].id, 'mul3-006');
  assert.equal(questionSet[2].id, 'mul3-005__repeat_2');
  assert.equal(questionSet[2].originalQuestionId, 'mul3-005');
  assert.equal(questionSet[3].id, 'mul3-006__repeat_2');
  assert.equal(questionSet[4].id, 'mul3-005__repeat_3');
});

test('evaluateAnswer returns correct branch with first-try XP', () => {
  const result = evaluateAnswer({
    question,
    unit,
    answer: 15,
    attemptCount: 0,
    score: 2,
    xpEarned: 20,
    wrongAnswers: [],
    questionResults: [],
  });

  assert.equal(result.branch, 'correct');
  assert.equal(result.nextScore, 3);
  assert.equal(result.nextXp, 30);
  assert.equal(result.nextQuestionResults.length, 1);
  assert.equal(result.nextQuestionResults[0].isCorrect, true);
});

test('evaluateAnswer returns hint branch before hints are exhausted', () => {
  const result = evaluateAnswer({
    question,
    unit,
    answer: 12,
    attemptCount: 1,
    score: 0,
    xpEarned: 0,
    wrongAnswers: [],
    questionResults: [],
  });

  assert.equal(result.branch, 'hint');
  assert.equal(result.nextAttemptCount, 2);
  assert.equal(result.hintText, '3 + 3 + 3 + 3 + 3 = ?');
});

test('evaluateAnswer returns revealed branch and stores wrong outcome after final miss', () => {
  const result = evaluateAnswer({
    question,
    unit,
    answer: 12,
    attemptCount: 2,
    score: 4,
    xpEarned: 40,
    wrongAnswers: [],
    questionResults: [],
  });

  assert.equal(result.branch, 'revealed');
  assert.equal(result.nextScore, 4);
  assert.equal(result.nextXp, 40);
  assert.equal(result.nextWrongAnswers.length, 1);
  assert.equal(result.nextWrongAnswers[0].originalQuestionId, 'mul3-005');
  assert.equal(result.nextQuestionResults[0].isCorrect, false);
});

test('createQuestionOutcome preserves review metadata when present', () => {
  const outcome = createQuestionOutcome(
    {
      ...question,
      originalQuestionId: 'mul3-005-original',
      wrongId: 'wrong-20260328-001',
      subject: 'review',
      unit: 'wrong-review',
      unitTitle: '오답 복습',
      visual: { type: 'clock', hour: 3, minute: 30 },
    },
    unit,
    12,
    false,
  );

  assert.equal(outcome.originalQuestionId, 'mul3-005-original');
  assert.equal(outcome.wrongId, 'wrong-20260328-001');
  assert.equal(outcome.subject, 'review');
  assert.deepEqual(outcome.visual, { type: 'clock', hour: 3, minute: 30 });
});

test('buildQuizResult adds completion and perfect bonuses safely', () => {
  const result = buildQuizResult({
    score: 10,
    totalQuestions: 10,
    xpEarned: 95,
    wrongAnswers: [],
    questionResults: [],
    duration: 75,
    completionBonus: 20,
    perfectBonus: 50,
  });

  assert.equal(result.xpEarned, 165);
  assert.equal(result.stars, 3);
  assert.equal(getStars(6, 10), 1);
});
