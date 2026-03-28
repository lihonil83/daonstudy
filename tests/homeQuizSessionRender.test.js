import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { loadJsxModule } from './helpers/loadJsxModule.js';

function renderWithRouter(element) {
  const originalConsoleError = console.error;

  console.error = (...args) => {
    const [firstArg] = args;

    if (typeof firstArg === 'string' && firstArg.includes('useLayoutEffect does nothing on the server')) {
      return;
    }

    originalConsoleError(...args);
  };

  try {
    return renderToStaticMarkup(React.createElement(MemoryRouter, null, element));
  } finally {
    console.error = originalConsoleError;
  }
}

test('Home page renders reward summary and review alert from hook data', async () => {
  const { default: HomePage } = await loadJsxModule(
    path.resolve('/Users/jihun/daonstudy/daonstudy/src/pages/Home/Home.jsx'),
    {
      stubModules: {
        '../../hooks/useReward': `
          export function useReward() {
            return {
              allBadges: [
                { id: 'badge-1', earned: true, icon: '🏆', hidden: false },
                { id: 'badge-2', earned: false, icon: '⭐', hidden: true },
              ],
              badgeProgress: '1/8 수집',
              icon: '🌱',
              level: 3,
              title: '꾸준한 탐험가',
              totalXp: 280,
              xpForNextLevel: 400,
              xpProgress: 0.7,
              xpToNext: 120,
            };
          }
        `,
        '../../hooks/useWrongAnswers': `
          export function useWrongAnswers() {
            return {
              unreviewedCount: 3,
            };
          }
        `,
        '../../hooks/useProgress': `
          export function useProgress() {
            return {
              totalQuizCount: 5,
              getUnitProgress() {
                return { attempts: 0 };
              },
            };
          }
        `,
      },
    },
  );

  const html = renderWithRouter(React.createElement(HomePage));

  assert.match(html, /레벨 3 · 꾸준한 탐험가/);
  assert.match(html, /다음까지 120 XP/);
  assert.match(html, /📖 복습할 문제가 3개 있어요/);
  assert.match(html, /뱃지 1\/8 수집/);
  assert.match(html, /복습 3문제부터 가볍게/);
  assert.match(html, /복습 시작하기/);
});

test('Home page renders the no-review state when there are no pending wrong answers', async () => {
  const { default: HomePage } = await loadJsxModule(
    path.resolve('/Users/jihun/daonstudy/daonstudy/src/pages/Home/Home.jsx'),
    {
      stubModules: {
        '../../hooks/useReward': `
          export function useReward() {
            return {
              allBadges: [],
              badgeProgress: '0/8 수집',
              icon: '🌱',
              level: 1,
              title: '첫 걸음',
              totalXp: 0,
              xpForNextLevel: 100,
              xpProgress: 0,
              xpToNext: 100,
            };
          }
        `,
        '../../hooks/useWrongAnswers': `
          export function useWrongAnswers() {
            return {
              unreviewedCount: 0,
            };
          }
        `,
        '../../hooks/useProgress': `
          export function useProgress() {
            return {
              totalQuizCount: 0,
              getUnitProgress(subject, unitId) {
                if (unitId === 'addition-up-to-20') return { attempts: 0 };
                return { attempts: 1 };
              },
            };
          }
        `,
      },
    },
  );

  const html = renderWithRouter(React.createElement(HomePage));

  assert.match(html, /✨ 복습할 문제가 없어요/);
  assert.match(html, /필요하면 언제든 다시 볼 수 있어요/);
  assert.match(html, /덧셈 20까지부터 시작해요/);
  assert.match(html, /첫 퀴즈 시작하기/);
});

test('QuizSession renders the default quiz result summary with badge and review CTA', async () => {
  const { default: QuizSession } = await loadJsxModule(
    path.resolve('/Users/jihun/daonstudy/daonstudy/src/components/Quiz/QuizSession.jsx'),
    {
      stubModules: {
        '../../hooks/useQuiz': `
          export function useQuiz() {
            return {
              currentQuestion: null,
              questionIndex: 9,
              totalQuestions: 10,
              score: 8,
              isShowingHint: false,
              hintText: '',
              attemptCount: 0,
              isComplete: true,
              result: {
                score: 8,
                total: 10,
                stars: 2,
                xpEarned: 95,
                wrongAnswers: [{ id: 'wrong-1' }, { id: 'wrong-2' }],
                questionResults: [],
                duration: 78,
              },
              feedbackState: 'idle',
              selectedAnswer: null,
              statusText: '퀴즈가 끝났어요.',
              canAnswer: false,
              submitAnswer() {},
              nextQuestion() {},
              restart() {},
            };
          }
        `,
        '../../hooks/useProgress': `
          export function useProgress() {
            return { saveQuizResult() {} };
          }
        `,
        '../../hooks/useReward': `
          export function useReward() {
            return {
              addXp() {},
              checkBadges() {},
              clearPending() {},
              pendingBadges: [{ id: 'badge-1', icon: '🏅', name: '첫 성장' }],
              pendingLevelUp: {
                from: { icon: '🌱' },
                to: { icon: '🚀', level: 4, title: '도약 중' },
              },
            };
          }
        `,
        '../../hooks/useWrongAnswers': `
          export function useWrongAnswers() {
            return {
              addWrongAnswer() {},
              markReviewed() {},
            };
          }
        `,
        '../../hooks/useSpeechSynthesis': `
          export function useSpeechSynthesis() {
            return {
              error: '',
              isSpeaking: false,
              isSupported: true,
              speak() {},
              stop() {},
            };
          }
        `,
        '../../models/speechModel': `
          export function getSpeechPrompt() {
            return null;
          }
        `,
        './QuestionVisual': 'export default function QuestionVisual() { return null; }',
      },
    },
  );

  const html = renderWithRouter(
    React.createElement(QuizSession, {
      unit: {
        id: 'addition-up-to-20',
        title: '덧셈 20까지',
        subject: 'math',
      },
      accent: 'math',
      backTo: '/math',
    }),
  );

  assert.match(html, /퀴즈 완료/);
  assert.match(html, /덧셈 20까지/);
  assert.match(html, /\+95/);
  assert.match(html, /레벨 업! 🌱 → 🚀/);
  assert.match(html, /🏅 새 뱃지/);
  assert.match(html, /틀린 문제 복습하기/);
});

test('QuizSession renders the review completion summary without the wrong-answer CTA', async () => {
  const { default: QuizSession } = await loadJsxModule(
    path.resolve('/Users/jihun/daonstudy/daonstudy/src/components/Quiz/QuizSession.jsx'),
    {
      stubModules: {
        '../../hooks/useQuiz': `
          export function useQuiz() {
            return {
              currentQuestion: null,
              questionIndex: 1,
              totalQuestions: 2,
              score: 1,
              isShowingHint: false,
              hintText: '',
              attemptCount: 0,
              isComplete: true,
              result: {
                score: 1,
                total: 2,
                stars: 1,
                xpEarned: 35,
                wrongAnswers: [],
                questionResults: [
                  { id: 'q1', question: '7 + 5 = ?', isCorrect: true, wrongId: 'wrong-1' },
                  { id: 'q2', question: 'C/c로 시작하는 낱말은 무엇일까요?', isCorrect: false, wrongId: 'wrong-2' },
                ],
                duration: 24,
              },
              feedbackState: 'idle',
              selectedAnswer: null,
              statusText: '복습이 끝났어요.',
              canAnswer: false,
              submitAnswer() {},
              nextQuestion() {},
              restart() {},
            };
          }
        `,
        '../../hooks/useProgress': `
          export function useProgress() {
            return { saveQuizResult() {} };
          }
        `,
        '../../hooks/useReward': `
          export function useReward() {
            return {
              addXp() {},
              checkBadges() {},
              clearPending() {},
              pendingBadges: [],
              pendingLevelUp: null,
            };
          }
        `,
        '../../hooks/useWrongAnswers': `
          export function useWrongAnswers() {
            return {
              addWrongAnswer() {},
              markReviewed() {},
            };
          }
        `,
        '../../hooks/useSpeechSynthesis': `
          export function useSpeechSynthesis() {
            return {
              error: '',
              isSpeaking: false,
              isSupported: true,
              speak() {},
              stop() {},
            };
          }
        `,
        '../../models/speechModel': `
          export function getSpeechPrompt() {
            return null;
          }
        `,
        './QuestionVisual': 'export default function QuestionVisual() { return null; }',
      },
    },
  );

  const html = renderWithRouter(
    React.createElement(QuizSession, {
      unit: {
        id: 'wrong-review',
        title: '📖 오답 복습',
        subject: 'review',
      },
      accent: 'review',
      backTo: '/review',
      mode: 'review',
    }),
  );

  assert.match(html, /복습 완료/);
  assert.match(html, /이번 복습은 24초 걸렸어요/);
  assert.match(html, /✅ 맞혔어!/);
  assert.match(html, /❌ 다음에 다시!/);
  assert.match(html, /복습 목록으로/);
  assert.doesNotMatch(html, /틀린 문제 복습하기/);
});
