import { useMemo, useState } from 'react';
import QuizSession from '../../components/Quiz/QuizSession';
import Review from '../Review/Review';

const smokeQuizQuestions = [
  {
    id: 'smoke-flow-wrong-1',
    question: '7 + 5 = ?',
    choices: [10, 11, 12],
    answer: 12,
    hints: ['7에 5를 더하면 12가 돼요.', '10보다 조금 더 커요.'],
    visual: {
      type: 'equation-card',
      expression: '7 + 5',
      cue: '오답 생성 스모크',
      badge: 'SMOKE',
    },
  },
];

const smokeQuizUnit = {
  id: 'smoke-wrong-to-review',
  title: '오답 생성 스모크',
  subject: 'math',
  data: { questions: smokeQuizQuestions },
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
    correctAnswer: item.correctAnswer,
    hints: [...(item.hints ?? [])],
    visual: item.visual ? { ...item.visual } : null,
    date: '2026-03-28',
    reviewed: false,
    reviewedDate: null,
    reviewCorrect: null,
  }));
}

export default function SmokeWrongToReviewFlow({ autoStartReview = false }) {
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
