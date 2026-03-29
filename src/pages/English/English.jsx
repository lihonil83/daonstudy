import { Link, useParams } from 'react-router-dom';
import QuizSession from '../../components/Quiz/QuizSession';
import DailyLessonSession from '../../components/English/DailyLessonSession';
import { ENGLISH_STAGE_1, findEnglishUnit } from '../../data/englishCurriculum';
import { ENGLISH_CHALLENGE_UNITS, ENGLISH_UNITS as QUICK_ENGLISH_UNITS } from '../../data/unitRegistry';
import { getCurrentDay, getUnitProgress, isDayPassed } from '../../models/enDailyProgressModel';
import styles from './English.module.css';

function UnitProgressDots({ unitId, totalDays }) {
  return (
    <div className={styles.dayDots}>
      {Array.from({ length: totalDays }, (_, index) => {
        const day = index + 1;
        const passed = isDayPassed(unitId, day);
        const current = !passed && day === getCurrentDay(unitId);

        return (
          <span
            key={day}
            className={`${styles.dot} ${passed ? styles.dotDone : current ? styles.dotCurrent : styles.dotLocked}`}
            title={`Day ${day}`}
          />
        );
      })}
    </div>
  );
}

function QuickChallengeSection() {
  return (
    <div className={styles.stageHeader}>
      <span className={`${styles.tag} ${styles.englishTag}`}>⚡ 빠른 챌린지</span>
      <h3 className={styles.title}>알파벳과 파닉스 핵심 퀴즈</h3>
      <p className={styles.copy}>10문제 퀴즈로 대문자, 소문자, 파닉스 A/B/C를 바로 연습할 수 있어요.</p>
      <div className={styles.unitList}>
        {ENGLISH_CHALLENGE_UNITS.map((unit) => (
          <Link key={unit.id} to={`/english/${unit.id}`} className={styles.unitCard}>
            <div className={styles.unitMeta}>
              <div className={styles.unitLeft}>
                <span className={styles.unitIcon}>🔤</span>
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

export default function EnglishPage() {
  const { unitId } = useParams();

  const quickUnit = unitId ? QUICK_ENGLISH_UNITS[unitId] : null;
  if (quickUnit) {
    return <QuizSession unit={quickUnit} accent="english" backTo="/english" />;
  }

  if (unitId) {
    const unit = findEnglishUnit(unitId);

    if (!unit) {
      return (
        <section className={styles.page}>
          <div className={styles.panel}>
            <span className={`${styles.tag} ${styles.englishTag}`}>영어 단원</span>
            <h2 className={styles.title}>단원을 찾을 수 없어요</h2>
            <Link className={styles.linkButton} to="/english">단원 목록으로 돌아가기</Link>
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
            <Link className={styles.linkButton} to="/english">단원 목록으로 돌아가기</Link>
          </div>
        </section>
      );
    }

    return <DailyLessonSession unit={unit} backTo="/english" />;
  }

  const stage = ENGLISH_STAGE_1;

  return (
    <section className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.stageHeader}>
          <span className={`${styles.tag} ${styles.englishTag}`}>{stage.icon} {stage.subtitle}</span>
          <h2 className={styles.title}>영어 단원을 골라보세요</h2>
          <p className={styles.copy}>
            빠른 알파벳·파닉스 퀴즈부터 시작하거나, Stage 1 일일 학습으로 차근차근 이어갈 수 있어요.
          </p>
        </div>

        <QuickChallengeSection />

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
            const totalDays = unit.dailyLessons?.length ?? 0;
            const { passedDays, allDone } = getUnitProgress(unit.id, totalDays);
            const currentDay = getCurrentDay(unit.id);
            const unitIndex = stage.units.indexOf(unit);
            const previousUnit = unitIndex > 0 ? stage.units[unitIndex - 1] : null;
            const previousDone =
              !previousUnit ||
              previousUnit.type === 'coming-soon' ||
              getUnitProgress(previousUnit.id, previousUnit.dailyLessons.length).allDone;
            const isUnitLocked = !previousDone && !allDone && passedDays === 0;

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

                {!isComingSoon && totalDays > 0 ? (
                  <UnitProgressDots unitId={unit.id} totalDays={totalDays} />
                ) : null}
                {!isComingSoon && totalDays > 0 ? (
                  <p className={styles.unitDayCount}>
                    {passedDays} / {totalDays}일 완료
                    {!allDone ? ` · 오늘: Day ${globalThis.Math.min(currentDay, totalDays)}` : ''}
                  </p>
                ) : null}
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
