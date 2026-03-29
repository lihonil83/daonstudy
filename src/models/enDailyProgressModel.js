/**
 * 영어 일일 학습 진도 모델
 * - 완료 기준 잠금 해제 (날짜 무관)
 * - 통과 기준: 80% 이상
 * - 재시도: 무제한
 */

const STORAGE_KEY = 'daon_en_daily_v1';
const PASS_THRESHOLD = 0.8;

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function save(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // 저장 실패 무시
  }
}

/**
 * 해당 단원에서 현재 학습해야 할 day 번호 반환 (1-based)
 * 모든 day 완료 시 totalDays + 1 반환
 */
export function getCurrentDay(unitId) {
  const data = load();
  const unit = data[unitId] || {};
  let day = 1;
  while (unit[day]?.passed === true) {
    day++;
  }
  return day;
}

/** day가 잠금 해제됐는지 확인 */
export function isDayUnlocked(unitId, day) {
  if (day <= 1) return true;
  const data = load();
  const unit = data[unitId] || {};
  return unit[day - 1]?.passed === true;
}

/** day가 통과됐는지 확인 */
export function isDayPassed(unitId, day) {
  const data = load();
  return data[unitId]?.[day]?.passed === true;
}

/**
 * day 통과 처리
 * @param {string} unitId
 * @param {number} day
 * @param {number} score  - 맞힌 개수
 * @param {number} total  - 전체 문제 수
 */
export function markDayPassed(unitId, day, score, total) {
  const data = load();
  if (!data[unitId]) data[unitId] = {};
  data[unitId][day] = {
    passed: true,
    score,
    total,
    percent: Math.round((score / total) * 100),
    passedAt: new Date().toISOString(),
  };
  save(data);
}

/**
 * 단원 전체 진도 요약
 * @returns {{ passedDays: number, totalDays: number, allDone: boolean }}
 */
export function getUnitProgress(unitId, totalDays) {
  const data = load();
  const unit = data[unitId] || {};
  const passedDays = Object.values(unit).filter(d => d?.passed).length;
  return {
    passedDays,
    totalDays,
    allDone: passedDays >= totalDays,
  };
}

/** 80% 이상이면 통과 */
export function isPassing(score, total) {
  if (total === 0) return false;
  return score / total >= PASS_THRESHOLD;
}

export { PASS_THRESHOLD };
