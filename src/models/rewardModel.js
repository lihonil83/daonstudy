import { getCurrentStreak, getLocalDateString } from './progressModel.js';

export const LEVELS = [
  { level: 1, minXp: 0, title: '새싹 학습자', icon: '🌱' },
  { level: 2, minXp: 100, title: '열심히 하는 학습자', icon: '🌿' },
  { level: 3, minXp: 250, title: '성장하는 학습자', icon: '🌳' },
  { level: 4, minXp: 500, title: '똑똑한 학습자', icon: '⭐' },
  { level: 5, minXp: 800, title: '빛나는 학습자', icon: '🌟' },
  { level: 6, minXp: 1200, title: '대단한 학습자', icon: '💫' },
  { level: 7, minXp: 1700, title: '불꽃 학습자', icon: '🔥' },
  { level: 8, minXp: 2300, title: '챔피언 학습자', icon: '🏆' },
  { level: 9, minXp: 3000, title: '마스터 학습자', icon: '👑' },
  { level: 10, minXp: 4000, title: '전설의 학습자', icon: '🐉' },
];

export const BADGE_DEFINITIONS = [
  { id: 'first-quiz', name: '첫 걸음', icon: '👶', hidden: false },
  { id: 'mul-challenger', name: '구구단 도전자', icon: '🔢', hidden: false },
  { id: 'alpha-challenger', name: '영어 도전자', icon: '🔤', hidden: false },
  { id: 'perfect-one', name: '완벽주의자', icon: '💎', hidden: false },
  { id: 'mul-master', name: '구구단 마스터', icon: '🏅', hidden: false },
  { id: 'review-king', name: '복습왕', icon: '📖', hidden: false },
  { id: 'streak-3', name: '3일 연속', icon: '🔥', hidden: false },
  { id: 'streak-7', name: '7일 연속', icon: '🔥🔥', hidden: false },
  { id: 'streak-30', name: '30일 연속', icon: '🔥🔥🔥', hidden: false },
  { id: 'secret-five', name: '비밀 뱃지', icon: '🎁', hidden: true },
];

export function getLevelInfo(totalXp) {
  return [...LEVELS].reverse().find((level) => totalXp >= level.minXp) ?? LEVELS[0];
}

export function getNextLevelInfo(totalXp) {
  return LEVELS.find((level) => level.minXp > totalXp) ?? null;
}

export function createRewardState(totalXp = 0, badges = [], stats = {}) {
  const currentLevel = getLevelInfo(totalXp);
  const nextLevel = getNextLevelInfo(totalXp);

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    icon: currentLevel.icon,
    totalXp,
    xpForCurrentLevel: currentLevel.minXp,
    xpForNextLevel: nextLevel ? nextLevel.minXp : currentLevel.minXp,
    badges,
    stats: {
      reviewSessionsCompleted: stats.reviewSessionsCompleted ?? 0,
    },
  };
}

export function getEarnedBadgeMap(badges) {
  return new Map(badges.map((badge) => [badge.id, badge]));
}

export function hasQuizCountOnAnyDay(scores, minimumCount) {
  const counts = scores.reduce((map, entry) => {
    map.set(entry.date, (map.get(entry.date) ?? 0) + 1);
    return map;
  }, new Map());

  return [...counts.values()].some((count) => count >= minimumCount);
}

export function evaluateBadge(definition, rewardState, scores, today = new Date()) {
  switch (definition.id) {
    case 'first-quiz':
      return scores.length >= 1;
    case 'mul-challenger':
      return scores.filter((entry) => entry.subject === 'math').length >= 3;
    case 'alpha-challenger':
      return scores.filter((entry) => entry.subject === 'english').length >= 3;
    case 'perfect-one':
      return scores.some((entry) => entry.score === entry.total);
    case 'mul-master':
      return scores.filter((entry) => entry.subject === 'math' && entry.score === entry.total).length >= 3;
    case 'review-king':
      return (rewardState.stats.reviewSessionsCompleted ?? 0) >= 3;
    case 'streak-3':
      return getCurrentStreak(scores, today) >= 3;
    case 'streak-7':
      return getCurrentStreak(scores, today) >= 7;
    case 'streak-30':
      return getCurrentStreak(scores, today) >= 30;
    case 'secret-five':
      return hasQuizCountOnAnyDay(scores, 5);
    default:
      return false;
  }
}

export function addXpToRewardState(rewardState, amount) {
  const previousLevel = getLevelInfo(rewardState.totalXp);
  const nextTotalXp = Math.max(0, rewardState.totalXp + amount);
  const nextReward = createRewardState(nextTotalXp, rewardState.badges, rewardState.stats);

  return {
    nextReward,
    previousLevel,
    nextLevel: getLevelInfo(nextTotalXp),
    leveledUp: nextReward.level > previousLevel.level,
  };
}

export function evaluateRewardUpdate(rewardState, scores, context = {}, today = new Date()) {
  const previousReviewSessions = rewardState.stats.reviewSessionsCompleted ?? 0;
  const nextStats = {
    ...rewardState.stats,
    reviewSessionsCompleted:
      context.type === 'review' && context.completed
        ? previousReviewSessions + 1
        : previousReviewSessions,
  };
  const rewardWithStats = createRewardState(rewardState.totalXp, rewardState.badges, nextStats);
  const earnedBadgeMap = getEarnedBadgeMap(rewardWithStats.badges);
  const earnedDate = getLocalDateString(today);
  const newBadges = BADGE_DEFINITIONS.filter(
    (definition) =>
      !earnedBadgeMap.has(definition.id) &&
      evaluateBadge(definition, rewardWithStats, scores, today),
  ).map((definition) => ({
    id: definition.id,
    name: definition.name,
    icon: definition.icon,
    earnedDate,
    hidden: definition.hidden,
  }));

  if (newBadges.length === 0 && nextStats.reviewSessionsCompleted === previousReviewSessions) {
    return {
      nextReward: rewardState,
      newBadges: [],
      changed: false,
    };
  }

  return {
    nextReward: createRewardState(
      rewardWithStats.totalXp,
      [...rewardWithStats.badges, ...newBadges],
      nextStats,
    ),
    newBadges,
    changed: true,
  };
}

export function getRewardProgress(rewardState) {
  const nextLevelXp = rewardState.xpForNextLevel;
  const currentLevelXp = rewardState.xpForCurrentLevel;

  return {
    xpProgress:
      nextLevelXp === currentLevelXp
        ? 1
        : (rewardState.totalXp - currentLevelXp) / (nextLevelXp - currentLevelXp),
    xpToNext: Math.max(0, nextLevelXp - rewardState.totalXp),
  };
}

export function buildBadgeCatalog(earnedBadges) {
  const earnedBadgeMap = getEarnedBadgeMap(earnedBadges);

  return BADGE_DEFINITIONS.map((definition) => ({
    ...definition,
    earned: earnedBadgeMap.has(definition.id),
    earnedDate: earnedBadgeMap.get(definition.id)?.earnedDate ?? null,
  }));
}
