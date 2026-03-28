import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  applyQuizResult,
  createEmptyProgress,
  getCurrentStreak,
  getDefaultUnitProgress,
  getStudyDaysCount,
  normalizeProgress,
} from '../models/progressModel.js';
import { PROGRESS_KEY, SCORES_KEY } from '../config/storageKeys.js';
import { readStorageJSON, subscribeStorageKey, writeStorageJSON } from '../utils/storage';

function loadScores() {
  return readStorageJSON(SCORES_KEY, []);
}

function loadProgress() {
  return normalizeProgress(readStorageJSON(PROGRESS_KEY, createEmptyProgress()));
}

export function useProgress() {
  const [scores, setScores] = useState(() => loadScores());
  const [progress, setProgress] = useState(() => loadProgress());

  useEffect(() => {
    const syncScores = () => {
      setScores(loadScores());
    };

    const syncProgress = () => {
      setProgress(loadProgress());
    };

    const unsubscribeScores = subscribeStorageKey(SCORES_KEY, syncScores);
    const unsubscribeProgress = subscribeStorageKey(PROGRESS_KEY, syncProgress);

    return () => {
      unsubscribeScores();
      unsubscribeProgress();
    };
  }, []);

  const saveQuizResult = useCallback((result) => {
    const storedScores = loadScores();
    const storedProgress = loadProgress();
    const { scoreEntry, nextScores, nextProgress } = applyQuizResult(
      storedScores,
      storedProgress,
      result,
    );

    writeStorageJSON(SCORES_KEY, nextScores);
    writeStorageJSON(PROGRESS_KEY, nextProgress);

    setScores(nextScores);
    setProgress(nextProgress);

    return scoreEntry;
  }, []);

  const totalStudyDays = useMemo(() => getStudyDaysCount(scores), [scores]);
  const currentStreak = useMemo(() => getCurrentStreak(scores), [scores]);
  const totalQuizCount = scores.length;
  const recentScores = useMemo(() => [...scores].slice(-10).reverse(), [scores]);

  const getUnitProgress = useCallback(
    (subject, unitId) => progress[subject]?.units?.[unitId] ?? getDefaultUnitProgress(),
    [progress],
  );

  const getAllUnits = useCallback(
    (subject) =>
      Object.entries(progress[subject]?.units ?? {}).map(([unitId, value]) => ({
        unitId,
        ...value,
      })),
    [progress],
  );

  const getScoresBySubject = useCallback(
    (subject) => scores.filter((entry) => entry.subject === subject),
    [scores],
  );

  const getScoresByDate = useCallback(
    (dateString) => scores.filter((entry) => entry.date === dateString),
    [scores],
  );

  return {
    saveQuizResult,
    totalStudyDays,
    currentStreak,
    totalQuizCount,
    getUnitProgress,
    getAllUnits,
    recentScores,
    getScoresBySubject,
    getScoresByDate,
  };
}
