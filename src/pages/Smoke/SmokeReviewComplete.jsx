import QuizSession from '../../components/Quiz/QuizSession';

const reviewQuestions = [
  {
    id: 'smoke-review-1',
    originalQuestionId: 'smoke-review-original-1',
    wrongId: 'wrong-smoke-1',
    question: '9시 15분은 어느 시각일까요?',
    choices: ['9시 15분', '9시 45분', '10시 15분'],
    answer: '9시 15분',
    hints: ['분침이 3을 가리키면 15분이에요.'],
    visual: {
      type: 'clock-face',
      hour: 9,
      minute: 15,
      label: '9:15',
    },
    subject: 'math',
    unit: 'clock-reading-advanced',
    unitTitle: '시계 읽기 심화',
  },
  {
    id: 'smoke-review-2',
    originalQuestionId: 'smoke-review-original-2',
    wrongId: 'wrong-smoke-2',
    question: 'C/c로 시작하는 낱말은 무엇일까요?',
    choices: ['cat', 'bag', 'apple'],
    answer: 'cat',
    hints: ['c는 /k/ 소리로 시작할 수 있어요.'],
    visual: {
      type: 'phonics-card',
      upper: 'C',
      lower: 'c',
      keyword: 'cat',
      sound: '/k/',
    },
    subject: 'english',
    unit: 'phonics-c',
    unitTitle: '파닉스 C',
  },
];

const reviewUnit = {
  id: 'smoke-review-complete',
  title: '📖 오답 복습 스모크',
  subject: 'review',
  data: { questions: reviewQuestions },
};

export default function SmokeReviewComplete() {
  return (
    <QuizSession
      unit={reviewUnit}
      accent="review"
      backTo="/review"
      mode="review"
      quizOptions={{
        questions: reviewQuestions,
        questionCount: reviewQuestions.length,
        completionBonus: 30,
        perfectBonus: 0,
      }}
      automation={{
        mode: 'perfect',
        answerDelayMs: 120,
      }}
      persistResult={false}
    />
  );
}
