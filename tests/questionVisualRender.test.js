import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadJsxModule } from './helpers/loadJsxModule.js';

const { default: QuestionVisual } = await loadJsxModule(
  path.resolve('/Users/jihun/daonstudy/daonstudy/src/components/Quiz/QuestionVisual.jsx'),
);

test('QuestionVisual renders measurement cards with unit guidance', () => {
  const html = renderToStaticMarkup(
    React.createElement(QuestionVisual, {
      visual: {
        type: 'measurement-card',
        category: 'length',
        title: '120 cm',
        subtitle: '길이 카드',
        guide: '100cm를 1m로 바꿔서 생각해보세요.',
      },
    }),
  );

  assert.match(html, /120 cm/);
  assert.match(html, /길이 단위 생각하기/);
});

test('QuestionVisual renders equation cards with arithmetic cues', () => {
  const html = renderToStaticMarkup(
    React.createElement(QuestionVisual, {
      visual: {
        type: 'equation-card',
        category: 'addition',
        expression: '7 \+ 5',
        label: '덧셈 카드',
        guide: '두 수를 합치면 얼마가 되는지 떠올려보세요.',
      },
    }),
  );

  assert.match(html, /덧셈 카드/);
  assert.match(html, /7 \+ 5/);
  assert.match(html, /덧셈 생각하기/);
});

test('QuestionVisual renders phonics cards with keyword and sound chip', () => {
  const html = renderToStaticMarkup(
    React.createElement(QuestionVisual, {
      visual: {
        type: 'phonics-card',
        upper: 'B',
        lower: 'b',
        keyword: 'ball',
        soundLabel: '첫소리 B\/b',
        guide: 'B/b로 시작하는 낱말을 골라보세요.',
      },
    }),
  );

  assert.match(html, /ball/);
  assert.match(html, /첫소리 B\/b/);
});
