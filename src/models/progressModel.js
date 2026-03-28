export const MAX_SCORE_HISTORY = 500;

export function createEmptyProgress() {
  return {
    math: { units: {} },
    english: { units: {} },
  };
}

export function normalizeProgress(value) {
  const base = createEmptyProgress();

  if (!value || typeof value !== 'object') {
    return base;
  }

  for (const subject of Object.keys(base)) {
    const subjectValue = value[subject];
    if (
      subjectValue &&
      typeof subjectValue === 'object' &&
      subjectValue.units &&
      typeof subjectValue.units === 'object'
    ) {
      base[subject] = {
        units: { ...subjectValue.units },
      };
    }
  }

  return base;
}

export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateToken(dateString) {
  return dateString.replaceAll('-', '');
}

export function getNextScoreId(scores, dateString) {
  const nextIndex = scores.filter((entry) => entry.date === dateString).length + 1;
  return `score-${getDateToken(dateString)}-${String(nextIndex).padStart(3, '0')}`;
}

export function getDefaultUnitProgress() {
  return {
    bestScore: 0,
    bestStars: 0,
    attempts: 0,
    firstClear: null,
  };
}

export function getStudyDaysCount(scores) {
  return new Set(scores.map((entry) => entry.date)).size;
}

export function getCurrentStreak(scores, today = new Date()) {
  const uniqueDates = new Set(scores.map((entry) => entry.date));
  let streak = 0;

  for (let offset = 0; offset < uniqueDates.size + 1; offset += 1) {
    const current = new Date(today);
    current.setDate(current.getDate() - offset);

    if (!uniqueDates.has(getLocalDateString(current))) {
      break;
    }

    streak += 1;
  }

  return streak;
}

export function buildScoreEntry(storedScores, result, savedDate = getLocalDateString()) {
  const previousUnitScores = storedScores.filter(
    (entry) => entry.subject === result.subject && entry.unit === result.unit,
  );
  const previousUnitEntry = previousUnitScores[previousUnitScores.length - 1] ?? null;

  return {
    id: getNextScoreId(storedScores, savedDate),
    date: savedDate,
    subject: result.subject,
    unit: result.unit,
    unitTitle: result.unitTitle,
    score: result.score,
    total: result.total,
    stars: result.stars,
    xpEarned: result.xpEarned,
    duration: result.duration ?? 0,
    improved: previousUnitEntry ? result.score > previousUnitEntry.score : false,
  };
}

export function applyQuizResult(storedScores, storedProgress, result, savedDate = getLocalDateString()) {
  const normalizedProgress = normalizeProgress(storedProgress);
  const scoreEntry = buildScoreEntry(storedScores, result, savedDate);
  const nextScores = [...storedScores, scoreEntry].slice(-MAX_SCORE_HISTORY);
  const subjectProgress = normalizedProgress[result.subject] ?? { units: {} };
  const currentUnitProgress = subjectProgress.units[result.unit] ?? getDefaultUnitProgress();
  const nextBestScore = Math.max(currentUnitProgress.bestScore, result.score);
  const nextBestStars =
    result.score >= currentUnitProgress.bestScore
      ? Math.max(currentUnitProgress.bestStars, result.stars)
      : currentUnitProgress.bestStars;

  const nextProgress = {
    ...normalizedProgress,
    [result.subject]: {
      units: {
        ...subjectProgress.units,
        [result.unit]: {
          bestScore: nextBestScore,
          bestStars: nextBestStars,
          attempts: currentUnitProgress.attempts + 1,
          firstClear: currentUnitProgress.firstClear ?? savedDate,
        },
      },
    },
  };

  return {
    scoreEntry,
    nextScores,
    nextProgress,
  };
}
