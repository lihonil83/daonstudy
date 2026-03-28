import QuizSession from '../../components/Quiz/QuizSession';

const smokeQuestions = [
  {
    id: 'smoke-add-1',
    question: '3 + 4 = ?',
    choices: [6, 7, 8],
    answer: 7,
    hints: ['3과 4를 합쳐보세요.'],
    visual: {
      type: 'equation-card',
      expression: '3 + 4',
      cue: '덧셈 스모크',
      badge: 'SMOKE',
    },
  },
  {
    id: 'smoke-sub-1',
    question: '9 - 2 = ?',
    choices: [6, 7, 8],
    answer: 7,
    hints: ['9에서 2를 빼보세요.'],
    visual: {
      type: 'equation-card',
      expression: '9 - 2',
      cue: '뺄셈 스모크',
      badge: 'SMOKE',
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
