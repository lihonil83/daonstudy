import { shuffleArray } from '../utils/shuffle.js';

export function getStars(score, total) {
  if (total === 0) return 0;
  if (score === total) return 3;
  if (score >= 7) return 2;
  if (score >= 4) return 1;
  return 0;
}

export function buildQuestionSet(
  sourceQuestions,
  questionCount,
  shuffleQuestions = shuffleArray,
  shuffleChoices = shuffleArray,
) {
  const safeQuestionCount = Math.max(0, Math.min(questionCount, sourceQuestions.length));

  return shuffleQuestions(sourceQuestions)
    .slice(0, safeQuestionCount)
    .map((question) => ({
      ...question,
      choices: shuffleChoices(question.choices ?? []),
      hints: [...(question.hints ?? [])],
    }));
}

export function createQuestionOutcome(question, unit, userAnswer, isCorrect) {
  return {
    id: question.id,
    originalQuestionId: question.originalQuestionId ?? question.id,
    wrongId: question.wrongId ?? null,
    question: question.question,
    choices: [...(question.choices ?? [])],
    hints: [...(question.hints ?? [])],
    userAnswer,
    correctAnswer: question.answer,
    isCorrect,
    explanation: question.explanation ?? '',
    subject: question.subject ?? unit.subject,
    unit: question.unit ?? unit.id,
    unitTitle: question.unitTitle ?? unit.title,
    visual: question.visual ? { ...question.visual } : null,
  };
}

export function evaluateAnswer({
  question,
  unit,
  answer,
  attemptCount,
  score,
  xpEarned,
  wrongAnswers,
  questionResults,
}) {
  if (answer === question.answer) {
    const gainedXp = attemptCount === 0 ? 10 : 5;
    const nextScore = score + 1;
    const nextXp = xpEarned + gainedXp;
    const nextQuestionResults = [
      ...questionResults,
      createQuestionOutcome(question, unit, answer, true),
    ];

    return {
      branch: 'correct',
      gainedXp,
      nextScore,
      nextXp,
      nextWrongAnswers: wrongAnswers,
      nextQuestionResults,
      statusText:
        attemptCount === 0
          ? '정답이에요! 잘했어요.'
          : '정답이에요! 힌트를 잘 활용했어요.',
    };
  }

  const hints = question.hints ?? [];

  if (attemptCount < hints.length) {
    const nextAttemptCount = attemptCount + 1;

    return {
      branch: 'hint',
      nextAttemptCount,
      hintText: hints[nextAttemptCount - 1],
      statusText:
        nextAttemptCount === 1
          ? '조금만 더 생각해봐요. 힌트를 줄게요.'
          : '힌트를 하나 더 줄게요. 다시 해봐요.',
    };
  }

  const wrongOutcome = createQuestionOutcome(question, unit, answer, false);
  const nextWrongAnswers = [...wrongAnswers, wrongOutcome];
  const nextQuestionResults = [...questionResults, wrongOutcome];

  return {
    branch: 'revealed',
    wrongOutcome,
    nextScore: score,
    nextXp: xpEarned,
    nextWrongAnswers,
    nextQuestionResults,
    statusText: `정답은 ${question.answer}였어요. 다음에는 맞힐 수 있어요.`,
  };
}

export function buildQuizResult({
  score,
  totalQuestions,
  xpEarned,
  wrongAnswers,
  questionResults,
  duration,
  completionBonus = 20,
  perfectBonus = 50,
}) {
  const finalPerfectBonus = totalQuestions > 0 && score === totalQuestions ? perfectBonus : 0;
  const finalXp = xpEarned + completionBonus + finalPerfectBonus;

  return {
    score,
    total: totalQuestions,
    stars: getStars(score, totalQuestions),
    xpEarned: finalXp,
    wrongAnswers,
    questionResults,
    duration,
  };
}
