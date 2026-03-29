import { useMemo, useState } from 'react';
import QuizSession from '../../components/Quiz/QuizSession';
import Review from '../Review/Review';

const smokeQuizQuestions = [
  {
    id: 'smoke-flow-wrong-1',
    question: '2 x 6 = ?',
    choices: [10, 11, 12],
    answer: 12,
    hints: ['2를 여섯 번 더하면 12가 돼요.', '2 + 2 + 2 + 2 + 2 + 2 = 12예요.'],
    visual: {
      type: 'equation-card',
      expression: '2 x 6',
      cue: '오답 생성 스모크',
      badge: 'SMOKE',
      category: 'multiplication',
    },
  },
];

const smokeQuizUnit = {
  id: 'smoke-wrong-to-review',
  title: '오답 생성 스모크',
  subject: 'math',
  data: { questions: smokeQuizQuestions },
};

const smokeReviewQuestions = smokeQuizQuestions.map((question) => ({
  id: question.id,
  originalQuestionId: question.id,
  wrongId: `smoke-review-${question.id}`,
  subject: 'math',
  unit: smokeQuizUnit.id,
  unitTitle: smokeQuizUnit.title,
  question: question.question,
  choices: [...question.choices],
  answer: question.answer,
  correctAnswer: question.answer,
  hints: [...(question.hints ?? [])],
  visual: question.visual ? { ...question.visual } : null,
}));

const smokeReviewUnit = {
  id: 'wrong-review',
  title: '📖 오답 복습',
  subject: 'review',
  data: { questions: smokeReviewQuestions },
};

const smokeReviewQuizOptions = {
  questions: smokeReviewQuestions,
  questionCount: smokeReviewQuestions.length,
  completionBonus: 30,
  perfectBonus: 0,
};

const smokePerfectReviewAutomation = {
  mode: 'perfect',
  answerDelayMs: 120,
};

function buildReviewWrongAnswers(items) {
  return items.map((item, index) => ({
    id: `smoke-review-item-${index + 1}`,
    originalQuestionId: item.originalQuestionId ?? item.id,
    subject: item.subject,
    unit: item.unit,
    unitTitle: item.unitTitle,
    question: item.question,
    choices: [...(item.choices ?? [])],
    userAnswer: item.userAnswer,
    answer: item.answer ?? item.correctAnswer,
    correctAnswer: item.correctAnswer ?? item.answer,
    hints: [...(item.hints ?? [])],
    visual: item.visual ? { ...item.visual } : null,
    date: '2026-03-28',
    reviewed: false,
    reviewedDate: null,
    reviewCorrect: null,
  }));
}

export default function SmokeWrongToReviewFlow({ autoStartReview = false }) {
  if (autoStartReview) {
    return (
      <QuizSession
        key="smoke-wrong-review-complete"
        unit={smokeReviewUnit}
        accent="review"
        backTo="/review"
        mode="review"
        quizOptions={smokeReviewQuizOptions}
        automation={smokePerfectReviewAutomation}
        persistResult={false}
      />
    );
  }

  const [stage, setStage] = useState('quiz');
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const reviewWrongAnswers = useMemo(() => buildReviewWrongAnswers(wrongAnswers), [wrongAnswers]);

  if (stage === 'quiz') {
    return (
      <QuizSession
        unit={smokeQuizUnit}
        accent="math"
        backTo="/"
        quizOptions={{
          questions: smokeQuizQuestions,
          questionCount: smokeQuizQuestions.length,
          completionBonus: 20,
          perfectBonus: 0,
        }}
        automation={{
          mode: 'sequence',
          answerDelayMs: 120,
          answersByQuestionId: {
            'smoke-flow-wrong-1': [10, 11, 10],
          },
        }}
        persistResult={false}
        onComplete={(result) => {
          setWrongAnswers(result.wrongAnswers);
          setStage('review');
        }}
      />
    );
  }

  return (
    <Review
      overrideWrongAnswers={reviewWrongAnswers}
      autoStartAll={autoStartReview}
      persistReviewResult={false}
      reviewAutomation={{
        mode: 'perfect',
        answerDelayMs: 120,
      }}
    />
  );
}
