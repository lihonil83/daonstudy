import assert from 'node:assert/strict';
import test from 'node:test';

import {
  addXpToRewardState,
  buildBadgeCatalog,
  createRewardState,
  evaluateRewardUpdate,
  getRewardProgress,
} from '../src/models/rewardModel.js';

function createScore(date, subject, score, total = 10) {
  return {
    date,
    subject,
    score,
    total,
  };
}

test('addXpToRewardState levels up when threshold is crossed', () => {
  const rewardState = createRewardState(90);
  const { leveledUp, nextLevel, nextReward, previousLevel } = addXpToRewardState(rewardState, 20);

  assert.equal(leveledUp, true);
  assert.equal(previousLevel.level, 1);
  assert.equal(nextLevel.level, 2);
  assert.equal(nextReward.totalXp, 110);
  assert.equal(nextReward.level, 2);
});

test('evaluateRewardUpdate awards english challenger after three english quizzes', () => {
  const rewardState = createRewardState(0);
  const scores = [
    createScore('2026-03-28', 'english', 8),
    createScore('2026-03-29', 'english', 9),
    createScore('2026-03-30', 'english', 10),
  ];

  const { changed, newBadges, nextReward } = evaluateRewardUpdate(
    rewardState,
    scores,
    {},
    new Date('2026-03-30T12:00:00Z'),
  );

  assert.equal(changed, true);
  assert.deepEqual(
    newBadges.map((badge) => badge.id).sort(),
    ['alpha-challenger', 'first-quiz', 'perfect-one', 'streak-3'].sort(),
  );
  assert.equal(nextReward.badges.length, 4);
});

test('evaluateRewardUpdate increments review sessions and awards review badge', () => {
  const rewardState = createRewardState(120, [], { reviewSessionsCompleted: 2 });
  const { changed, newBadges, nextReward } = evaluateRewardUpdate(
    rewardState,
    [],
    { type: 'review', completed: true },
    new Date('2026-03-30T12:00:00Z'),
  );

  assert.equal(changed, true);
  assert.deepEqual(newBadges.map((badge) => badge.id), ['review-king']);
  assert.equal(nextReward.stats.reviewSessionsCompleted, 3);
});

test('getRewardProgress and buildBadgeCatalog expose dashboard-friendly state', () => {
  const rewardState = createRewardState(520, [
    {
      id: 'first-quiz',
      name: '첫 걸음',
      icon: '👶',
      earnedDate: '2026-03-28',
      hidden: false,
    },
  ]);

  const { xpProgress, xpToNext } = getRewardProgress(rewardState);
  const badgeCatalog = buildBadgeCatalog(rewardState.badges);

  assert.equal(Math.round(xpProgress * 100), 7);
  assert.equal(xpToNext, 280);
  assert.equal(badgeCatalog.find((badge) => badge.id === 'first-quiz')?.earned, true);
  assert.equal(badgeCatalog.find((badge) => badge.id === 'mul-challenger')?.earned, false);
});
