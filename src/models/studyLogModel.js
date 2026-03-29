import { getLocalDateString } from './progressModel';

export const STUDY_LOG_KEY = 'eduapp_study_logs';

export function createEmptyStudyLog() {
  return {
    dailyStats: {}, // { "2026-03-29": 120 (seconds) }
    totalSeconds: 0,
    sessions: [], // [ { start: timestamp, end: timestamp, duration: seconds } ]
  };
}

export function loadStudyLog() {
  try {
    const data = localStorage.getItem(STUDY_LOG_KEY);
    return data ? JSON.parse(data) : createEmptyStudyLog();
  } catch (e) {
    console.error('Failed to load study logs:', e);
    return createEmptyStudyLog();
  }
}

export function saveStudyLog(log) {
  try {
    localStorage.setItem(STUDY_LOG_KEY, JSON.stringify(log));
  } catch (e) {
    console.error('Failed to save study logs:', e);
  }
}

/**
 * 특정 날짜의 학습 시간을 추가합니다.
 * @param {number} secondsToAdd - 추가할 시간 (초 단위)
 * @param {string} date - 날짜 (기본값 오늘)
 */
export function addStudyTime(secondsToAdd, date = getLocalDateString()) {
  const log = loadStudyLog();
  
  // 날짜별 통계 업데이트
  const currentDaily = log.dailyStats[date] || 0;
  log.dailyStats[date] = currentDaily + secondsToAdd;
  
  // 전체 시간 업데이트
  log.totalSeconds += secondsToAdd;
  
  saveStudyLog(log);
  return log;
}

/**
 * 오늘 공부한 총 시간을 분 단위로 반환합니다.
 */
export function getTodayStudyMinutes() {
  const log = loadStudyLog();
  const today = getLocalDateString();
  const seconds = log.dailyStats[today] || 0;
  return Math.floor(seconds / 60);
}
