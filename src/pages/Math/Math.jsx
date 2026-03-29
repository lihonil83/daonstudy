import { Link, useParams } from 'react-router-dom';
import QuizSession from '../../components/Quiz/QuizSession';
import DailyMathSession from '../../components/Math/DailyMathSession';
import { CURRICULUM } from '../../data/curriculum';
import { MATH_CHALLENGE_UNITS, MATH_UNITS as QUICK_MATH_UNITS } from '../../data/unitRegistry';
import {
  DAYS_PER_UNIT,
  getCurrentDay,
  getUnitProgress,
  isDayPassed,
  isUnitComplete,
} from '../../models/mathDailyProgressModel';
import styles from './Math.module.css';

const DAILY_MATH_UNITS = CURRICULUM.filter((unit) => unit.subject === 'math');
const DAILY_MATH_IDS = DAILY_MATH_UNITS.map((unit) => unit.id);
const GRADE_GROUPS = [1, 2, 3, 4, 5, 6].map((grade) => ({
  grade,
  units: DAILY_MATH_UNITS.filter((unit) => unit.grade === grade),
}));

function isUnitUnlocked(unit) {
  if (unit.grade === 1) return true;

  const unitIndex = DAILY_MATH_IDS.indexOf(unit.id);
  if (unitIndex <= 0) return true;

  const previousUnit = DAILY_MATH_UNITS[unitIndex - 1];
  if (previousUnit.grade === 1) return true;

  return isUnitComplete(previousUnit.id);
}

function findDailyMathUnit(unitId) {
  return DAILY_MATH_UNITS.find((unit) => unit.id === unitId || unit.unitId === unitId) ?? null;
}

function ProgressDots({ unitId }) {
  return (
    <div className={styles.dayDots}>
      {Array.from({ length: DAYS_PER_UNIT }, (_, index) => {
        const day = index + 1;
        const passed = isDayPassed(unitId, day);
        const current = !passed && day === globalThis.Math.min(getCurrentDay(unitId), DAYS_PER_UNIT);

        return (
          <span
            key={day}
            className={`${styles.dot} ${
              passed ? styles.dotDone : current ? styles.dotCurrent : styles.dotLocked
            }`}
            title={`Day ${day}`}
          />
        );
      })}
    </div>
  );
}

function QuickChallengeSection() {
  return (
    <div className={styles.gradeSection}>
      <h3 className={styles.gradeTitle}>빠르게 풀어보는 핵심 퀴즈</h3>
      <div className={styles.unitList}>
        {MATH_CHALLENGE_UNITS.map((unit) => (
          <Link key={unit.id} to={`/math/${unit.id}`} className={styles.unitCard}>
            <div className={styles.unitMeta}>
              <div className={styles.unitLeft}>
                <span className={styles.unitIcon}>⚡</span>
                <div>
                  <strong className={styles.unitTitle}>{unit.title}</strong>
                  <span className={styles.unitDesc}>{unit.description}</span>
                </div>
              </div>
              <div className={styles.unitRight}>
                <span className={styles.tagNew}>바로 도전</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function MathPage() {
  const { unitId } = useParams();

  const quickUnit = unitId ? QUICK_MATH_UNITS[unitId] : null;
  if (quickUnit) {
    return <QuizSession unit={quickUnit} accent="math" backTo="/math" />;
  }

  if (unitId) {
    const unit = findDailyMathUnit(unitId);

    if (!unit) {
      return (
        <section className={styles.page}>
          <div className={styles.panel}>
            <span className={`${styles.tag} ${styles.mathTag}`}>수학</span>
            <h2 className={styles.title}>단원을 찾을 수 없어요</h2>
            <Link className={styles.linkButton} to="/math">단원 목록으로 돌아가기</Link>
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
            <Link className={styles.linkButton} to="/math">단원 목록으로 돌아가기</Link>
          </div>
        </section>
      );
    }

    return <DailyMathSession unit={unit} backTo="/math" />;
  }

  return (
    <section className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.pageHeader}>
          <span className={`${styles.tag} ${styles.mathTag}`}>🔢 수학</span>
          <h2 className={styles.title}>수학 단원을 골라보세요</h2>
          <p className={styles.copy}>
            먼저 핵심 퀴즈로 가볍게 시작하거나, 학년별 일일 학습 단원으로 차근차근 이어갈 수 있어요.
          </p>
        </div>

        <QuickChallengeSection />

        {GRADE_GROUPS.map(({ grade, units }) => (
          <div key={grade} className={styles.gradeSection}>
            <h3 className={styles.gradeTitle}>
              {grade}학년
              {grade === 2 ? <span className={styles.gradeBadge}>현재 학년</span> : null}
            </h3>

            <div className={styles.unitList}>
              {units.map((unit) => {
                const unlocked = isUnitUnlocked(unit);
                const { passedDays, allDone } = getUnitProgress(unit.id, DAYS_PER_UNIT);
                const currentDay = globalThis.Math.min(getCurrentDay(unit.id), DAYS_PER_UNIT);
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

                    {unlocked ? <ProgressDots unitId={unit.id} /> : null}
                    {unlocked ? (
                      <p className={styles.unitDayCount}>
                        {passedDays} / {DAYS_PER_UNIT}일 완료
                        {!allDone ? ` · 오늘: Day ${currentDay}` : ''}
                      </p>
                    ) : null}
                  </>
                );

                return unlocked ? (
                  <Link key={unit.id} to={`/math/${unit.id}`} className={styles.unitCard}>
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
