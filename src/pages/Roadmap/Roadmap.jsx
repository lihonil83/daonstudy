import { Link } from 'react-router-dom';
import { CURRICULUM } from '../../data/curriculum';
import { ENGLISH_STAGE_1 } from '../../data/englishCurriculum';
import { getUnitProgress as getMathProgress, DAYS_PER_UNIT, isUnitComplete } from '../../models/mathDailyProgressModel';
import { getUnitProgress as getEnProgress } from '../../models/enDailyProgressModel';
import styles from './Roadmap.module.css';

const MATH_UNITS = CURRICULUM.filter(u => u.subject === 'math');
const GRADES = [1, 2, 3, 4, 5, 6];

function MathGradeRow({ grade }) {
  const units = MATH_UNITS.filter(u => u.grade === grade);
  const done = units.filter(u => isUnitComplete(u.id)).length;
  const total = units.length;
  const pct = total > 0 ? Math.round(done / total * 100) : 0;

  return (
    <div className={styles.gradeRow}>
      <div className={styles.gradeHead}>
        <span className={styles.gradeBadge}>{grade}학년</span>
        <span className={styles.gradeCount}>{done}/{total} 단원</span>
        <span className={styles.gradePct}>{pct}%</span>
      </div>
      <div className={styles.gradeBar}>
        <div className={styles.gradeBarFill} style={{ width: `${pct}%` }} />
      </div>
      <div className={styles.unitList}>
        {units.map(u => {
          const prog = getMathProgress(u.id, DAYS_PER_UNIT);
          const complete = isUnitComplete(u.id);
          return (
            <Link
              key={u.id}
              to={`/math/${u.id}`}
              className={`${styles.unitChip} ${complete ? styles.unitChipDone : prog.passedDays > 0 ? styles.unitChipTried : ''}`}
            >
              <span>{u.icon}</span>
              <span className={styles.chipTitle}>{u.title}</span>
              {complete
                ? <span className={styles.chipBadgeDone}>완료</span>
                : prog.passedDays > 0
                ? <span className={styles.chipBadgeTried}>{prog.passedDays}/{DAYS_PER_UNIT}일</span>
                : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function EnglishStageSection() {
  const units = ENGLISH_STAGE_1.units.filter(u => u.type === 'daily');
  return (
    <div className={styles.enSection}>
      <div className={styles.stageHead}>
        <span className={styles.stageBadge}>Stage 1</span>
        <span className={styles.stageName}>{ENGLISH_STAGE_1.title}</span>
      </div>
      <div className={styles.unitList}>
        {ENGLISH_STAGE_1.units.map(u => {
          if (u.type !== 'daily') {
            return (
              <div key={u.id} className={`${styles.unitChip} ${styles.unitChipLocked}`}>
                <span>{u.icon}</span>
                <span className={styles.chipTitle}>{u.title}</span>
                <span className={styles.chipBadgeLocked}>준비 중</span>
              </div>
            );
          }
          const prog = getEnProgress(u.id, u.dailyLessons.length);
          const complete = prog.passedDays >= u.dailyLessons.length;
          return (
            <Link
              key={u.id}
              to={`/english/${u.id}`}
              className={`${styles.unitChip} ${complete ? styles.unitChipDone : prog.passedDays > 0 ? styles.unitChipTried : ''}`}
            >
              <span>{u.icon}</span>
              <span className={styles.chipTitle}>{u.title}</span>
              {complete
                ? <span className={styles.chipBadgeDone}>완료</span>
                : prog.passedDays > 0
                ? <span className={styles.chipBadgeTried}>{prog.passedDays}/{u.dailyLessons.length}일</span>
                : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function Roadmap() {
  const mathTotal = MATH_UNITS.length;
  const mathDone = MATH_UNITS.filter(u => isUnitComplete(u.id)).length;
  const mathDaysDone = MATH_UNITS.reduce((s, u) => s + getMathProgress(u.id, DAYS_PER_UNIT).passedDays, 0);
  const mathDaysTotal = MATH_UNITS.length * DAYS_PER_UNIT;

  const enUnits = ENGLISH_STAGE_1.units.filter(u => u.type === 'daily');
  const enDone = enUnits.reduce((s, u) => s + getEnProgress(u.id, u.dailyLessons.length).passedDays, 0);
  const enTotal = enUnits.reduce((s, u) => s + u.dailyLessons.length, 0);

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <p className={styles.kicker}>전체 현황</p>
        <h2 className={styles.heading}>🗺️ 학습 로드맵</h2>
      </div>

      {/* 요약 카드 */}
      <div className={styles.summaryGrid}>
        <Link to="/math" className={`${styles.summaryCard} ${styles.summaryMath}`}>
          <span className={styles.summaryEmoji}>🔢</span>
          <div>
            <p className={styles.summarySubject}>수학</p>
            <p className={styles.summaryStats}>{mathDone}/{mathTotal} 단원 · {mathDaysDone}/{mathDaysTotal}일</p>
          </div>
          <span className={styles.summaryPct}>{mathDaysTotal > 0 ? Math.round(mathDaysDone / mathDaysTotal * 100) : 0}%</span>
        </Link>
        <Link to="/english" className={`${styles.summaryCard} ${styles.summaryEnglish}`}>
          <span className={styles.summaryEmoji}>🔤</span>
          <div>
            <p className={styles.summarySubject}>영어</p>
            <p className={styles.summaryStats}>Stage 1 · {enDone}/{enTotal}일</p>
          </div>
          <span className={styles.summaryPct}>{enTotal > 0 ? Math.round(enDone / enTotal * 100) : 0}%</span>
        </Link>
      </div>

      {/* 수학 학년별 */}
      <div className={styles.subjectBlock}>
        <h3 className={styles.subjectTitle}>🔢 수학 단원</h3>
        {GRADES.map(g => <MathGradeRow key={g} grade={g} />)}
      </div>

      {/* 영어 */}
      <div className={styles.subjectBlock}>
        <h3 className={styles.subjectTitle}>🔤 영어 단원</h3>
        <EnglishStageSection />
      </div>
    </section>
  );
}
