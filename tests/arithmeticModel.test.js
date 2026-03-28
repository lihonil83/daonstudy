import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildArithmeticQuestion,
  buildArithmeticQuestionBank,
} from '../src/models/arithmeticModel.js';

test('buildArithmeticQuestion creates equation visuals and valid distractors', () => {
  const question = buildArithmeticQuestion({
    operation: 'addition',
    left: 7,
    right: 5,
    minChoice: 0,
    maxChoice: 20,
  });

  assert.equal(question.question, '7 + 5 = ?');
  assert.equal(question.answer, 12);
  assert.equal(question.visual.type, 'equation-card');
  assert.equal(question.visual.expression, '7 + 5');
  assert.ok(question.choices.includes(12));
  assert.equal(new Set(question.choices).size, 4);
});

test('buildArithmeticQuestionBank filters subtraction results below zero', () => {
  const questions = buildArithmeticQuestionBank({
    operation: 'subtraction',
    minLeft: 1,
    maxLeft: 3,
    minRight: 1,
    maxRight: 3,
    minAnswer: 0,
    maxAnswer: 20,
  });

  assert.deepEqual(
    questions.map((question) => question.id),
    ['subtraction-1-1', 'subtraction-2-1', 'subtraction-2-2', 'subtraction-3-1', 'subtraction-3-2', 'subtraction-3-3'],
  );
});

test('addition and subtraction banks generate enough equation-card questions', () => {
  const additionQuestions = buildArithmeticQuestionBank({
    operation: 'addition',
    minLeft: 1,
    maxLeft: 10,
    minRight: 1,
    maxRight: 10,
    minAnswer: 2,
    maxAnswer: 20,
  });
  const subtractionQuestions = buildArithmeticQuestionBank({
    operation: 'subtraction',
    minLeft: 2,
    maxLeft: 20,
    minRight: 1,
    maxRight: 10,
    minAnswer: 0,
    maxAnswer: 20,
  });

  assert.ok(additionQuestions.length >= 20);
  assert.ok(subtractionQuestions.length >= 20);
  assert.equal(additionQuestions[0].visual.type, 'equation-card');
  assert.equal(subtractionQuestions[0].visual.type, 'equation-card');
});
