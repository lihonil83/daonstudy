import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { loadJsxModule } from './helpers/loadJsxModule.js';

const { default: MathPage } = await loadJsxModule(
  path.resolve('/Users/jihun/daonstudy/daonstudy/src/pages/Math/Math.jsx'),
);
const { default: EnglishPage } = await loadJsxModule(
  path.resolve('/Users/jihun/daonstudy/daonstudy/src/pages/English/English.jsx'),
);

function renderRoute(initialEntry, routePath, element) {
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
      React.createElement(
        MemoryRouter,
        { initialEntries: [initialEntry] },
        React.createElement(
          Routes,
          null,
          React.createElement(Route, {
            path: routePath,
            element,
          }),
        ),
      ),
    );
  } finally {
    console.error = originalConsoleError;
  }
}

test('Math page lists generated and measurement units on the index route', () => {
  const html = renderRoute('/math', '/math', React.createElement(MathPage));

  assert.match(html, /길이 단위/);
  assert.match(html, /무게 단위/);
  assert.match(html, /덧셈 20까지/);
  assert.match(html, /뺄셈 20까지/);
});

test('English page lists the expanded phonics sequence on the index route', () => {
  const html = renderRoute('/english', '/english', React.createElement(EnglishPage));

  assert.match(html, /파닉스 A/);
  assert.match(html, /파닉스 B/);
  assert.match(html, /파닉스 C/);
});
