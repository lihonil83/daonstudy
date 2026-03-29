import assert from 'node:assert/strict';
import test from 'node:test';

import { getRecommendedMission } from '../src/models/homeModel.js';

const mathUnits = [
  { id: 'multiplication-2', subject: 'math', title: '2단 구구단', available: true },
  { id: 'multiplication-3', subject: 'math', title: '3단 구구단', available: true },
  { id: 'clock-reading', subject: 'math', title: '시계 읽기', available: true },
];

const englishUnits = [
  { id: 'alphabet-upper', subject: 'english', title: '알파벳 대문자', available: true },
  { id: 'alphabet-lower', subject: 'english', title: '알파벳 소문자', available: true },
  { id: 'phonics-a', subject: 'english', title: '파닉스 A', available: true },
];

test('getRecommendedMission prioritizes review work when wrong answers are pending', () => {
  const recommendation = getRecommendedMission({
    unreviewedCount: 2,
    totalQuizCount: 6,
    getUnitProgress() {
      return { attempts: 1 };
    },
    mathUnits,
    englishUnits,
  });

  assert.equal(recommendation.to, '/review');
  assert.match(recommendation.title, /복습 2문제부터 가볍게/);
});

test('getRecommendedMission picks the gentle starter unit on the first visit', () => {
  const recommendation = getRecommendedMission({
    unreviewedCount: 0,
    totalQuizCount: 0,
    getUnitProgress(subject, unitId) {
      if (unitId === 'multiplication-2') {
        return { attempts: 0 };
      }

      return { attempts: 1 };
    },
    mathUnits,
    englishUnits,
  });

  assert.equal(recommendation.to, '/math/multiplication-2');
  assert.match(recommendation.title, /2단 구구단부터 시작해요/);
});

test('getRecommendedMission suggests the next unseen unit after study has started', () => {
  const recommendation = getRecommendedMission({
    unreviewedCount: 0,
    totalQuizCount: 4,
    getUnitProgress(subject, unitId) {
      if (unitId === 'alphabet-upper') {
        return { attempts: 0 };
      }

      return { attempts: 1 };
    },
    mathUnits,
    englishUnits,
  });

  assert.equal(recommendation.to, '/english/alphabet-upper');
  assert.match(recommendation.title, /다음은 알파벳 대문자/);
});
