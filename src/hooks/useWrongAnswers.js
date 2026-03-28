import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  clearReviewedWrongAnswers,
  reviewWrongAnswer,
  splitWrongAnswers,
  upsertWrongAnswer,
} from '../models/wrongAnswerModel.js';
import { readStorageJSON, subscribeStorageKey, writeStorageJSON } from '../utils/storage';

const WRONG_KEY = 'eduapp_wrong';

function loadWrongAnswers() {
  return readStorageJSON(WRONG_KEY, []);
}

export function useWrongAnswers() {
  const [wrongAnswers, setWrongAnswers] = useState(() => loadWrongAnswers());

  useEffect(() => {
    const syncWrongAnswers = () => {
      setWrongAnswers(loadWrongAnswers());
    };

    return subscribeStorageKey(WRONG_KEY, syncWrongAnswers);
  }, []);

  const addWrongAnswer = useCallback((wrongData) => {
    const storedWrongAnswers = loadWrongAnswers();
    const { nextItem, nextWrongAnswers } = upsertWrongAnswer(storedWrongAnswers, wrongData);

    writeStorageJSON(WRONG_KEY, nextWrongAnswers);
    setWrongAnswers(nextWrongAnswers);

    return nextItem;
  }, []);

  const markReviewed = useCallback((id, correct) => {
    const nextWrongAnswers = reviewWrongAnswer(loadWrongAnswers(), id, correct);

    writeStorageJSON(WRONG_KEY, nextWrongAnswers);
    setWrongAnswers(nextWrongAnswers);
  }, []);

  const clearReviewed = useCallback(() => {
    const nextWrongAnswers = clearReviewedWrongAnswers(loadWrongAnswers());
    writeStorageJSON(WRONG_KEY, nextWrongAnswers);
    setWrongAnswers(nextWrongAnswers);
  }, []);

  const { unreviewedList, reviewedList } = useMemo(
    () => splitWrongAnswers(wrongAnswers),
    [wrongAnswers],
  );

  return {
    unreviewedList,
    reviewedList,
    unreviewedCount: unreviewedList.length,
    addWrongAnswer,
    markReviewed,
    clearReviewed,
  };
}
