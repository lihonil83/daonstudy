import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { loadJsxModule } from './helpers/loadJsxModule.js';

function renderAppShell(AppShell, initialEntries) {
  const originalConsoleError = console.error;

  console.error = (...args) => {
    const [firstArg] = args;

    if (typeof firstArg === 'string' && firstArg.includes('useLayoutEffect does nothing on the server')) {
      return;
    }

    originalConsoleError(...args);
  };

  try {
    return renderToStaticMarkup(
      React.createElement(AppShell, {
        RouterComponent: MemoryRouter,
        routerProps: { initialEntries },
      }),
    );
  } finally {
    console.error = originalConsoleError;
  }
}

async function loadAppShell() {
  const { AppShell } = await loadJsxModule(path.resolve('/Users/jihun/daonstudy/daonstudy/src/App.jsx'), {
    stubModules: {
      './pages/Home/Home': 'export default function Home() { return "HOME_ROUTE_STUB"; }',
      './pages/Math/Math': 'export default function Math() { return "MATH_ROUTE_STUB"; }',
      './pages/English/English': 'export default function English() { return "ENGLISH_ROUTE_STUB"; }',
      './pages/Review/Review': 'export default function Review() { return "REVIEW_ROUTE_STUB"; }',
      './pages/Progress/Progress': 'export default function Progress() { return "PROGRESS_ROUTE_STUB"; }',
      './pages/Smoke/SmokeQuizComplete': 'export default function SmokeQuizComplete() { return "SMOKE_ROUTE_STUB"; }',
      './pages/Smoke/SmokeReviewComplete': 'export default function SmokeReviewComplete() { return "SMOKE_REVIEW_ROUTE_STUB"; }',
      './pages/Smoke/SmokeWrongToReviewFlow': 'export default function SmokeWrongToReviewFlow() { return "SMOKE_WRONG_TO_REVIEW_ROUTE_STUB"; }',
      './pages/Smoke/SmokeStorageFlow': 'export default function SmokeStorageFlow() { return "SMOKE_STORAGE_ROUTE_STUB"; }',
    },
  });

  return AppShell;
}

test('App shell renders the shared layout and home route content', async () => {
  const AppShell = await loadAppShell();
  const html = renderAppShell(AppShell, ['/']);

  assert.match(html, /다온 학습 놀이터/);
  assert.match(html, /콘텐츠 확장 \+ 자동 검증/);
  assert.match(html, /HOME_ROUTE_STUB/);
  assert.match(html, /홈/);
  assert.match(html, /수학/);
  assert.match(html, /영어/);
  assert.match(html, /복습/);
  assert.match(html, /기록/);
});

test('App shell routes subject paths into the right page outlet', async () => {
  const AppShell = await loadAppShell();
  const mathHtml = renderAppShell(AppShell, ['/math']);
  const reviewHtml = renderAppShell(AppShell, ['/review']);

  assert.match(mathHtml, /MATH_ROUTE_STUB/);
  assert.doesNotMatch(mathHtml, /HOME_ROUTE_STUB/);
  assert.match(reviewHtml, /REVIEW_ROUTE_STUB/);
  assert.doesNotMatch(reviewHtml, /MATH_ROUTE_STUB/);
});

test('App shell shows the fallback screen for unknown routes', async () => {
  const AppShell = await loadAppShell();
  const html = renderAppShell(AppShell, ['/mystery-path']);

  assert.match(html, /이 화면은 아직 준비되지 않았어요/);
  assert.match(html, /홈으로 가기/);
  assert.match(html, /수학 단원 보기/);
  assert.match(html, /영어 단원 보기/);
});

test('App shell routes the hidden smoke review path into the review smoke page', async () => {
  const AppShell = await loadAppShell();
  const html = renderAppShell(AppShell, ['/smoke/review-complete']);

  assert.match(html, /SMOKE_REVIEW_ROUTE_STUB/);
  assert.doesNotMatch(html, /SMOKE_ROUTE_STUB/);
});

test('App shell routes the wrong-to-review smoke path into the flow harness', async () => {
  const AppShell = await loadAppShell();
  const html = renderAppShell(AppShell, ['/smoke/wrong-to-review-complete']);

  assert.match(html, /SMOKE_WRONG_TO_REVIEW_ROUTE_STUB/);
  assert.doesNotMatch(html, /SMOKE_REVIEW_ROUTE_STUB/);
});

test('App shell routes the storage-aware smoke path into the storage harness', async () => {
  const AppShell = await loadAppShell();
  const html = renderAppShell(AppShell, ['/smoke/storage-flow']);

  assert.match(html, /SMOKE_STORAGE_ROUTE_STUB/);
  assert.doesNotMatch(html, /SMOKE_WRONG_TO_REVIEW_ROUTE_STUB/);
});
