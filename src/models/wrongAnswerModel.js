import { getDateToken, getLocalDateString } from './progressModel.js';

export const MAX_WRONG_ANSWERS = 100;

export function sortByNewest(left, right) {
  const leftDate = left.reviewedDate ?? left.date;
  const rightDate = right.reviewedDate ?? right.date;
  return rightDate.localeCompare(leftDate);
}

export function pruneWrongAnswers(items, maxWrongAnswers = MAX_WRONG_ANSWERS) {
  if (items.length <= maxWrongAnswers) {
    return items;
  }

  const reviewed = items.filter((item) => item.reviewed).sort((left, right) =>
    (left.reviewedDate ?? left.date).localeCompare(right.reviewedDate ?? right.date),
  );
  const reviewedIdsToDrop = new Set();
  const overCount = items.length - maxWrongAnswers;

  for (const item of reviewed.slice(0, overCount)) {
    reviewedIdsToDrop.add(item.id);
  }

  const keptItems = items.filter((item) => !reviewedIdsToDrop.has(item.id));

  if (keptItems.length <= maxWrongAnswers) {
    return keptItems;
  }

  return keptItems.slice(keptItems.length - maxWrongAnswers);
}

export function buildWrongId(items, dateString) {
  const nextIndex = items.filter((item) => item.date === dateString).length + 1;
  return `wrong-${getDateToken(dateString)}-${String(nextIndex).padStart(3, '0')}`;
}

export function upsertWrongAnswer(storedWrongAnswers, wrongData, currentDate = getLocalDateString()) {
  const existingIndex = storedWrongAnswers.findIndex(
    (item) => item.originalQuestionId === wrongData.originalQuestionId,
  );

  const nextItem = {
    id:
      existingIndex >= 0
        ? storedWrongAnswers[existingIndex].id
        : buildWrongId(storedWrongAnswers, currentDate),
    originalQuestionId: wrongData.originalQuestionId,
    subject: wrongData.subject,
    unit: wrongData.unit,
    unitTitle: wrongData.unitTitle,
    question: wrongData.question,
    choices: [...wrongData.choices],
    userAnswer: wrongData.userAnswer,
    correctAnswer: wrongData.correctAnswer,
    hints: [...wrongData.hints],
    visual: wrongData.visual ? { ...wrongData.visual } : null,
    date: currentDate,
    reviewed: false,
    reviewedDate: null,
    reviewCorrect: null,
  };

  const nextWrongAnswers =
    existingIndex >= 0
      ? storedWrongAnswers.map((item, index) => (index === existingIndex ? nextItem : item))
      : [...storedWrongAnswers, nextItem];

  return {
    nextItem,
    nextWrongAnswers: pruneWrongAnswers(nextWrongAnswers),
  };
}

export function reviewWrongAnswer(storedWrongAnswers, id, correct, currentDate = getLocalDateString()) {
  return storedWrongAnswers.map((item) => {
    if (item.id !== id) {
      return item;
    }

    if (correct) {
      return {
        ...item,
        reviewed: true,
        reviewedDate: currentDate,
        reviewCorrect: true,
      };
    }

    return {
      ...item,
      date: currentDate,
      reviewed: false,
      reviewedDate: null,
      reviewCorrect: false,
    };
  });
}

export function clearReviewedWrongAnswers(items) {
  return items.filter((item) => !item.reviewed);
}

export function splitWrongAnswers(items) {
  return {
    unreviewedList: items.filter((item) => !item.reviewed).sort(sortByNewest),
    reviewedList: items.filter((item) => item.reviewed).sort(sortByNewest),
  };
}
