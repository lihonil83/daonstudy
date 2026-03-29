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

test('Progress page renders populated stats and recent history from hook data', async () => {
  const { default: ProgressPage } = await loadJsxModule(
    path.resolve('/Users/jihun/daonstudy/daonstudy/src/pages/Progress/Progress.jsx'),
    {
      stubModules: {
        '../../hooks/useProgress': `
          export function useProgress() {
            return {
              currentStreak: 4,
              totalStudyDays: 7,
              totalQuizCount: 12,
              recentScores: [
                { id: 'score-1', date: '2026-03-28', unitTitle: '2단 구구단', score: 10, total: 10, stars: 3, improved: true },
                { id: 'score-2', date: '2026-03-27', unitTitle: '파닉스 B', score: 8, total: 10, stars: 2, improved: false },
              ],
              getUnitProgress(subject, unitId) {
                if (unitId === 'multiplication-2') return { bestScore: 10, bestStars: 3, attempts: 2, firstClear: '2026-03-28' };
                if (unitId === 'phonics-b') return { bestScore: 8, bestStars: 2, attempts: 1, firstClear: '2026-03-27' };
                return { bestScore: 0, bestStars: 0, attempts: 0, firstClear: null };
              },
            };
          }
        `,
      },
    },
  );

  const html = renderWithRouter(React.createElement(ProgressPage));

  assert.match(html, /공부한 날/);
  assert.match(html, /7일/);
  assert.match(html, /🔥 4일째 이어가고 있어요/);
  assert.match(html, /2단 구구단/);
  assert.match(html, /📈 실력이 늘고 있어요/);
  assert.match(html, /학습 기록 관리/);
  assert.match(html, /학습 기록 초기화/);
});

test('Progress page renders empty recent history guidance when there are no scores', async () => {
  const { default: ProgressPage } = await loadJsxModule(
    path.resolve('/Users/jihun/daonstudy/daonstudy/src/pages/Progress/Progress.jsx'),
    {
      stubModules: {
        '../../hooks/useProgress': `
          export function useProgress() {
            return {
              currentStreak: 0,
              totalStudyDays: 0,
              totalQuizCount: 0,
              recentScores: [],
              getUnitProgress() {
                return { bestScore: 0, bestStars: 0, attempts: 0, firstClear: null };
              },
            };
          }
        `,
      },
    },
  );

  const html = renderWithRouter(React.createElement(ProgressPage));

  assert.match(html, /첫 퀴즈를 풀면 최근 기록이 여기부터 차곡차곡 쌓여요/);
  assert.match(html, /오늘 가볍게 한 번 시작해볼까요/);
  assert.match(html, /기록은 자동 저장되니 보통은 그대로 두면 됩니다/);
  assert.match(html, /추천 수학 시작하기/);
  assert.match(html, /추천 영어 시작하기/);
});

test('Review page renders empty-state copy when there are no wrong answers', async () => {
  const { default: ReviewPage } = await loadJsxModule(
    path.resolve('/Users/jihun/daonstudy/daonstudy/src/pages/Review/Review.jsx'),
    {
      stubModules: {
        '../../hooks/useWrongAnswers': `
          export function useWrongAnswers() {
            return {
              clearReviewed() {},
              reviewedList: [],
              unreviewedCount: 0,
              unreviewedList: [],
            };
          }
        `,
      },
    },
  );

  const html = renderWithRouter(React.createElement(ReviewPage));

  assert.match(html, /미복습 문제가 없어요/);
  assert.match(html, /아직 복습을 완료한 문제는 없어요/);
  assert.match(html, /수학 시작하기/);
  assert.match(html, /영어 시작하기/);
});

test('Review page renders unreviewed and reviewed items from hook data', async () => {
  const { default: ReviewPage } = await loadJsxModule(
    path.resolve('/Users/jihun/daonstudy/daonstudy/src/pages/Review/Review.jsx'),
    {
      stubModules: {
        '../../hooks/useWrongAnswers': `
          export function useWrongAnswers() {
            return {
              clearReviewed() {},
              reviewedList: [
                {
                  id: 'wrong-2',
                  subject: 'english',
                  unitTitle: '파닉스 C',
                  question: 'C/c로 시작하는 낱말은 무엇일까요?',
                  reviewedDate: '2026-03-28',
                },
              ],
              unreviewedCount: 1,
              unreviewedList: [
                {
                  id: 'wrong-1',
                  subject: 'math',
                  unitTitle: '2단 구구단',
                  question: '2 x 4 = ?',
                  date: '2026-03-28',
                },
              ],
            };
          }
        `,
        '../../components/Quiz/QuizSession': 'export default function QuizSession() { return null; }',
      },
    },
  );

  const html = renderWithRouter(React.createElement(ReviewPage));

  assert.match(html, /전체 복습 시작 \(1문제\)/);
  assert.match(html, /2 x 4 = \?/);
  assert.match(html, /파닉스 C/);
  assert.match(html, /완료 기록 비우기/);
});
