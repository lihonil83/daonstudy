import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BADGE_DEFINITIONS,
  addXpToRewardState,
  buildBadgeCatalog,
  createRewardState,
  evaluateRewardUpdate,
  getRewardProgress,
} from '../models/rewardModel.js';
import { REWARD_KEY, SCORES_KEY } from '../config/storageKeys.js';
import { readStorageJSON, subscribeStorageKey, writeStorageJSON } from '../utils/storage';

function loadRewardState() {
  const stored = readStorageJSON(REWARD_KEY, createRewardState());
  return createRewardState(stored.totalXp ?? 0, stored.badges ?? [], stored.stats ?? {});
}

export function useReward() {
  const [rewardState, setRewardState] = useState(() => loadRewardState());
  const [pendingLevelUp, setPendingLevelUp] = useState(null);
  const [pendingBadges, setPendingBadges] = useState([]);

  useEffect(() => {
    const syncReward = () => {
      setRewardState(loadRewardState());
    };

    return subscribeStorageKey(REWARD_KEY, syncReward);
  }, []);

  const addXp = useCallback((amount) => {
    const storedReward = loadRewardState();
    const { leveledUp, nextLevel, nextReward, previousLevel } = addXpToRewardState(
      storedReward,
      amount,
    );

    writeStorageJSON(REWARD_KEY, nextReward);
    setRewardState(nextReward);

    if (leveledUp) {
      setPendingLevelUp({
        from: previousLevel,
        to: nextLevel,
      });
    }

    return {
      leveledUp,
      reward: nextReward,
    };
  }, []);

  const checkBadges = useCallback((context = {}) => {
    const storedReward = loadRewardState();
    const scores = readStorageJSON(SCORES_KEY, []);
    const { changed, newBadges, nextReward } = evaluateRewardUpdate(
      storedReward,
      scores,
      context,
    );

    if (!changed) {
      return [];
    }

    writeStorageJSON(REWARD_KEY, nextReward);
    setRewardState(nextReward);

    if (newBadges.length > 0) {
      setPendingBadges(newBadges);
    }

    return newBadges;
  }, []);

  const clearPending = useCallback(() => {
    setPendingLevelUp(null);
    setPendingBadges([]);
  }, []);

  const { xpProgress, xpToNext } = getRewardProgress(rewardState);
  const allBadges = useMemo(() => buildBadgeCatalog(rewardState.badges), [rewardState.badges]);

  return {
    level: rewardState.level,
    title: rewardState.title,
    icon: rewardState.icon,
    totalXp: rewardState.totalXp,
    xpForCurrentLevel: rewardState.xpForCurrentLevel,
    xpForNextLevel: rewardState.xpForNextLevel,
    xpProgress,
    xpToNext,
    earnedBadges: rewardState.badges,
    allBadges,
    badgeProgress: `${rewardState.badges.length}/${BADGE_DEFINITIONS.length} 수집`,
    addXp,
    checkBadges,
    pendingLevelUp,
    pendingBadges,
    clearPending,
  };
}
