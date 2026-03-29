import { Link, useParams } from 'react-router-dom';
import DailyMathSession from '../../components/Math/DailyMathSession';
import { CURRICULUM } from '../../data/curriculum';
import {
  getCurrentDay,
  getUnitProgress,
  isDayPassed,
  isUnitComplete,
  DAYS_PER_UNIT,
} from '../../models/mathDailyProgressModel';
import styles from './Math.module.css';

// 수학 단원만 추출 (curriculum 순서 유지)
const MATH_UNITS = CURRICULUM.filter((u) => u.subject === 'math');
const MATH_IDS = MATH_UNITS.map((u) => u.id);

// 학년별 그룹핑
const GRADE_GROUPS = [1, 2, 3, 4, 5, 6].map((g) => ({
  grade: g,
  units: MATH_UNITS.filter((u) => u.grade === g),
}));

/**
 * 단원 잠금 여부 판단
 * - 1학년: 항상 열림 (복습)
 * - 2학년: 첫 단원 항상 열림, 이후 순차 잠금
 * - 3학년 이상: 이전 학년 전체 완료 후 순차 개방
 */
function isUnitUnlocked(unit) {
  if (unit.grade === 1) return true;

  const idx = MATH_IDS.indexOf(unit.id);
  if (idx <= 0) return true;

  const prevUnit = MATH_UNITS[idx - 1];

  // 이전 단원이 1학년 → 2학년으로 넘어오는 경계: 바로 열림
  if (prevUnit.grade === 1) return true;

  return isUnitComplete(prevUnit.id);
}

// ─── 일일 진도 점 ──────────────────────────────────────────────────────
function ProgressDots({ unitId }) {
  return (
    <div className={styles.dayDots}>
      {Array.from({ length: DAYS_PER_UNIT }, (_, i) => {
        const d = i + 1;
        const passed = isDayPassed(unitId, d);
        const current = !passed && d === Math.min(getCurrentDay(unitId), DAYS_PER_UNIT);
        return (
          <span
            key={d}
            className={`${styles.dot} ${
              passed ? styles.dotDone : current ? styles.dotCurrent : styles.dotLocked
            }`}
            title={`Day ${d}`}
          />
        );
      })}
    </div>
  );
}

export default function Math() {
  const { unitId } = useParams();

  // ─── 단원 학습 화면 ─────────────────────────────────────────────
  if (unitId) {
    const unit = MATH_UNITS.find((u) => u.id === unitId);

    if (!unit) {
      return (
        <section className={styles.page}>
          <div className={styles.panel}>
            <span className={`${styles.tag} ${styles.mathTag}`}>수학</span>
            <h2 className={styles.title}>단원을 찾을 수 없어요</h2>
            <Link className={styles.linkButton} to="/math">단원 목록으로</Link>
          </div>
        </section>
      );
    }

    if (!isUnitUnlocked(unit)) {
      return (
        <section className={styles.page}>
          <div className={styles.panel}>
            <span className={`${styles.tag} ${styles.mathTag}`}>🔒 잠김</span>
            <h2 className={styles.title}>{unit.icon} {unit.title}</h2>
            <p className={styles.copy}>이전 단원을 먼저 완료해야 열려요.</p>
            <Link className={styles.linkButton} to="/math">단원 목록으로</Link>
          </div>
        </section>
      );
    }

    return <DailyMathSession unit={unit} backTo="/math" />;
  }

  // ─── 단원 목록 화면 ─────────────────────────────────────────────
  return (
    <section className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.pageHeader}>
          <span className={`${styles.tag} ${styles.mathTag}`}>🔢 수학</span>
          <h2 className={styles.title}>수학 단원 목록</h2>
          <p className={styles.copy}>
            매일 10문제를 풀고 <strong>80% 이상</strong> 맞히면 다음 날 학습이 열려요.
            1학년은 복습용으로 항상 열려 있어요.
          </p>
        </div>

        {GRADE_GROUPS.map(({ grade, units }) => (
          <div key={grade} className={styles.gradeSection}>
            <h3 className={styles.gradeTitle}>
              {grade}학년
              {grade === 2 && <span className={styles.gradeBadge}>현재 학년</span>}
            </h3>

            <div className={styles.unitList}>
              {units.map((unit) => {
                const unlocked = isUnitUnlocked(unit);
                const { passedDays, allDone } = getUnitProgress(unit.id, DAYS_PER_UNIT);
                const currentDay = Math.min(getCurrentDay(unit.id), DAYS_PER_UNIT);
                const hasProgress = passedDays > 0;

                const cardContent = (
                  <>
                    <div className={styles.unitMeta}>
                      <div className={styles.unitLeft}>
                        <span className={styles.unitIcon}>{unit.icon}</span>
                        <div>
                          <strong className={styles.unitTitle}>{unit.title}</strong>
                          <span className={styles.unitDesc}>{unit.description}</span>
                        </div>
                      </div>
                      <div className={styles.unitRight}>
                        {!unlocked ? (
                          <span className={styles.tagLocked}>🔒 잠김</span>
                        ) : allDone ? (
                          <span className={styles.tagDone}>✅ 완료</span>
                        ) : hasProgress ? (
                          <span className={styles.tagTried}>Day {currentDay} 진행 중</span>
                        ) : (
                          <span className={styles.tagNew}>Day 1 시작</span>
                        )}
                      </div>
                    </div>

                    {unlocked && (
                      <ProgressDots unitId={unit.id} />
                    )}
                    {unlocked && (
                      <p className={styles.unitDayCount}>
                        {passedDays} / {DAYS_PER_UNIT}일 완료
                        {!allDone && ` · 오늘: Day ${currentDay}`}
                      </p>
                    )}
                  </>
                );

                return unlocked ? (
                  <Link
                    key={unit.id}
                    to={`/math/${unit.id}`}
                    className={styles.unitCard}
                  >
                    {cardContent}
                  </Link>
                ) : (
                  <div
                    key={unit.id}
                    className={`${styles.unitCard} ${styles.unitCardDisabled}`}
                    aria-disabled="true"
                  >
                    {cardContent}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
