import { Link, useParams } from 'react-router-dom';
import DailyLessonSession from '../../components/English/DailyLessonSession';
import { ENGLISH_STAGE_1, findEnglishUnit } from '../../data/englishCurriculum';
import { getCurrentDay, isDayPassed, getUnitProgress } from '../../models/enDailyProgressModel';
import styles from './English.module.css';

// ─── 단원 카드 진도 표시 ──────────────────────────────────────────────
function UnitProgressDots({ unitId, totalDays }) {
  return (
    <div className={styles.dayDots}>
      {Array.from({ length: totalDays }, (_, i) => {
        const d = i + 1;
        const passed = isDayPassed(unitId, d);
        const current = !passed && d === getCurrentDay(unitId);
        return (
          <span
            key={d}
            className={`${styles.dot} ${passed ? styles.dotDone : current ? styles.dotCurrent : styles.dotLocked}`}
            title={`Day ${d}`}
          />
        );
      })}
    </div>
  );
}

export default function English() {
  const { unitId } = useParams();

  // ─── 단원 내부 학습 ────────────────────────────────────────────────
  if (unitId) {
    const unit = findEnglishUnit(unitId);

    if (!unit) {
      return (
        <section className={styles.page}>
          <div className={styles.panel}>
            <span className={`${styles.tag} ${styles.englishTag}`}>영어 단원</span>
            <h2 className={styles.title}>단원을 찾을 수 없어요</h2>
            <Link className={styles.linkButton} to="/english">단원 목록으로</Link>
          </div>
        </section>
      );
    }

    if (unit.type === 'coming-soon') {
      return (
        <section className={styles.page}>
          <div className={styles.panel}>
            <span className={`${styles.tag} ${styles.englishTag}`}>준비 중</span>
            <h2 className={styles.title}>{unit.icon} {unit.title}</h2>
            <p className={styles.copy}>{unit.description}<br />곧 열릴 예정이에요! 🛠️</p>
            <Link className={styles.linkButton} to="/english">단원 목록으로</Link>
          </div>
        </section>
      );
    }

    return <DailyLessonSession unit={unit} backTo="/english" />;
  }

  // ─── 단원 목록 ────────────────────────────────────────────────────
  const stage = ENGLISH_STAGE_1;

  return (
    <section className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.stageHeader}>
          <span className={`${styles.tag} ${styles.englishTag}`}>{stage.icon} {stage.subtitle}</span>
          <h2 className={styles.title}>{stage.title}</h2>
          <p className={styles.copy}>
            매일 정해진 분량을 배우고 테스트를 <strong>80% 이상</strong> 통과하면 다음 날 학습이 열려요.
          </p>
        </div>

        <div className={styles.unitList}>
          {stage.units.map((unit) => {
            const isComingSoon = unit.type === 'coming-soon';
            const totalDays = unit.dailyLessons.length;
            const { passedDays, allDone } = getUnitProgress(unit.id, totalDays);
            const currentDay = getCurrentDay(unit.id);

            // 이전 단원이 완료됐는지 확인 (단원 순서 잠금)
            const unitIndex = stage.units.indexOf(unit);
            const prevUnit = unitIndex > 0 ? stage.units[unitIndex - 1] : null;
            const prevDone = !prevUnit || prevUnit.type === 'coming-soon' ||
              getUnitProgress(prevUnit.id, prevUnit.dailyLessons.length).allDone;
            const isUnitLocked = !prevDone && !allDone && passedDays === 0;

            const cardContent = (
              <>
                <div className={styles.unitMeta}>
                  <div className={styles.unitLeft}>
                    <span className={styles.unitIcon}>{unit.icon}</span>
                    <div>
                      <strong className={styles.unitTitle}>{unit.unit}. {unit.title}</strong>
                      <span className={styles.unitDesc}>{unit.description}</span>
                    </div>
                  </div>
                  <div className={styles.unitRight}>
                    {isComingSoon ? (
                      <span className={styles.tagLocked}>🔒 준비 중</span>
                    ) : isUnitLocked ? (
                      <span className={styles.tagLocked}>🔒 잠김</span>
                    ) : allDone ? (
                      <span className={styles.tagDone}>✅ 완료</span>
                    ) : passedDays > 0 ? (
                      <span className={styles.tagTried}>Day {currentDay} 진행 중</span>
                    ) : (
                      <span className={styles.tagNew}>Day 1 시작</span>
                    )}
                  </div>
                </div>

                {/* 일일 진도 점 */}
                {!isComingSoon && totalDays > 0 && (
                  <UnitProgressDots unitId={unit.id} totalDays={totalDays} />
                )}
                {!isComingSoon && totalDays > 0 && (
                  <p className={styles.unitDayCount}>
                    {passedDays} / {totalDays}일 완료
                    {!allDone && ` · 오늘: Day ${Math.min(currentDay, totalDays)}`}
                  </p>
                )}
              </>
            );

            const isDisabled = isComingSoon || isUnitLocked;
            const cardClass = isDisabled
              ? `${styles.unitCard} ${styles.unitCardDisabled}`
              : styles.unitCard;

            return isDisabled ? (
              <div key={unit.id} className={cardClass} aria-disabled="true">
                {cardContent}
              </div>
            ) : (
              <Link key={unit.id} to={`/english/${unit.id}`} className={cardClass}>
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
