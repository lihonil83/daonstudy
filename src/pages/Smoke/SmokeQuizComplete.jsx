import QuizSession from '../../components/Quiz/QuizSession';

const smokeQuestions = [
  {
    id: 'smoke-mul-1',
    question: '3 x 4 = ?',
    choices: [10, 12, 14],
    answer: 12,
    hints: ['3을 네 번 더해보세요.'],
    visual: {
      type: 'equation-card',
      expression: '3 x 4',
      cue: '곱셈 스모크',
      badge: 'SMOKE',
      category: 'multiplication',
    },
  },
  {
    id: 'smoke-mul-2',
    question: '2 x 5 = ?',
    choices: [8, 10, 12],
    answer: 10,
    hints: ['2를 다섯 번 더해보세요.'],
    visual: {
      type: 'equation-card',
      expression: '2 x 5',
      cue: '곱셈 스모크',
      badge: 'SMOKE',
      category: 'multiplication',
    },
  },
];

const smokeUnit = {
  id: 'smoke-quiz-complete',
  title: '스모크 자동 완료',
  subject: 'math',
  data: { questions: smokeQuestions },
};

export default function SmokeQuizComplete() {
  return (
    <QuizSession
      unit={smokeUnit}
      accent="math"
      backTo="/"
      quizOptions={{
        questions: smokeQuestions,
        questionCount: smokeQuestions.length,
        completionBonus: 20,
        perfectBonus: 50,
      }}
      automation={{
        mode: 'perfect',
        answerDelayMs: 120,
      }}
      persistResult={false}
    />
  );
}
