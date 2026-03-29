import { Link } from 'react-router-dom';
import { CURRICULUM } from '../../data/curriculum';
import { ENGLISH_STAGE_1 } from '../../data/englishCurriculum';
import { ENGLISH_CHALLENGE_UNITS, MATH_CHALLENGE_UNITS } from '../../data/unitRegistry';
import { useProgress } from '../../hooks/useProgress';
import { useReward } from '../../hooks/useReward';
import { useWrongAnswers } from '../../hooks/useWrongAnswers';
import { getUnitProgress as getEnProgress } from '../../models/enDailyProgressModel';
import { getRecommendedMission } from '../../models/homeModel';
import { DAYS_PER_UNIT, getUnitProgress as getMathProgress } from '../../models/mathDailyProgressModel';
import styles from './Home.module.css';

const DAILY_MATH_UNITS = CURRICULUM.filter((unit) => unit.subject === 'math');

function useMathSummary() {
  const total = DAILY_MATH_UNITS.length * DAYS_PER_UNIT;
  const done = DAILY_MATH_UNITS.reduce((sum, unit) => {
    return sum + getMathProgress(unit.id, DAYS_PER_UNIT).passedDays;
  }, 0);

  return {
    done,
    total,
    pct: total > 0 ? Math.round((done / total) * 100) : 0,
  };
}

function useEnglishSummary() {
  const units = ENGLISH_STAGE_1.units.filter((unit) => unit.type === 'daily');
  const total = units.reduce((sum, unit) => sum + unit.dailyLessons.length, 0);
  const done = units.reduce((sum, unit) => {
    return sum + getEnProgress(unit.id, unit.dailyLessons.length).passedDays;
  }, 0);

  return {
    done,
    total,
    pct: total > 0 ? Math.round((done / total) * 100) : 0,
  };
}

export default function Home() {
  const reward = useReward();
  const progress = useProgress();
  const wrongAnswers = useWrongAnswers();

  const icon = reward.icon ?? '🌱';
  const level = reward.level ?? 1;
  const title = reward.title ?? '새싹 학습자';
  const totalXp = reward.totalXp ?? 0;
  const xpProgress = reward.xpProgress ?? 0;
  const xpToNext = reward.xpToNext ?? 0;
  const badgeProgress = reward.badgeProgress ?? '0/0 수집';
  const currentStreak = progress.currentStreak ?? 0;
  const totalQuizCount = progress.totalQuizCount ?? 0;
  const unreviewedCount = wrongAnswers.unreviewedCount ?? 0;

  const math = useMathSummary();
  const english = useEnglishSummary();
  const xpPercent = Math.max(0, Math.min(1, xpProgress)) * 100;
  const recommendation = getRecommendedMission({
    unreviewedCount,
    totalQuizCount,
    getUnitProgress: progress.getUnitProgress ?? (() => ({ attempts: 0 })),
    mathUnits: MATH_CHALLENGE_UNITS,
    englishUnits: ENGLISH_CHALLENGE_UNITS,
  });

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.avatarCard}>
          <div className={styles.avatarEmoji}>{icon}</div>
          <div className={styles.avatarInfo}>
            <p className={styles.levelLine}>레벨 {level} · {title}</p>
            <div className={styles.levelBadge}>Lv.{level}</div>
            <h2 className={styles.levelTitle}>{title}</h2>
            <div className={styles.xpBar}>
              <div className={styles.xpFill} style={{ width: `${xpPercent}%` }} />
            </div>
            <p className={styles.xpText}>{totalXp} XP · 다음까지 {xpToNext} XP</p>
            <p className={styles.badgeText}>뱃지 {badgeProgress}</p>
          </div>
        </div>

        <div className={styles.streakCard}>
          <span className={styles.streakIcon}>🔥</span>
          <div>
            <p className={styles.streakLabel}>연속 학습</p>
            <p className={styles.streakValue}>{currentStreak}일째</p>
          </div>
        </div>

        <div className={styles.statRow}>
          <div className={styles.statItem}>
            <span className={styles.statNum}>{totalQuizCount}</span>
            <span className={styles.statLabel}>퀴즈 완료</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum}>{unreviewedCount}</span>
            <span className={styles.statLabel}>오답 대기</span>
          </div>
        </div>
      </aside>

      <main className={styles.mainArea}>
        <div className={styles.greeting}>
          <h1 className={styles.greetingTitle}>다온 학습 놀이터 👋</h1>
          <p className={styles.greetingKicker}>시작, 복습, 기록이 한 번에 이어지는 학습 홈</p>
          <p className={styles.greetingSub}>오늘도 조금씩, 꾸준히!</p>
        </div>

        <section className={styles.missionCard}>
          <div className={styles.missionHeader}>
            <span className={styles.missionBadge}>{recommendation.badge}</span>
            <p className={styles.reviewStatus}>
              {unreviewedCount > 0
                ? `📖 복습할 문제가 ${unreviewedCount}개 있어요`
                : '✨ 복습할 문제가 없어요'}
            </p>
          </div>
          <h2 className={styles.missionTitle}>{recommendation.title}</h2>
          <p className={styles.missionCopy}>
            {unreviewedCount > 0
              ? recommendation.description
              : '필요하면 언제든 다시 볼 수 있어요.'}
          </p>
          <Link to={recommendation.to} className={styles.missionButton}>
            {recommendation.cta}
          </Link>
        </section>

        <div className={styles.subjectGrid}>
          <Link to="/math" className={`${styles.subjectCard} ${styles.subjectMath}`}>
            <span className={styles.subjectEmoji}>🔢</span>
            <div className={styles.subjectInfo}>
              <h3 className={styles.subjectName}>수학</h3>
              <p className={styles.subjectSub}>1~6학년 · {math.done}/{math.total}일 완료</p>
            </div>
            <div className={styles.subjectBar}>
              <div className={styles.subjectFill} style={{ width: `${math.pct}%` }} />
            </div>
            <span className={styles.subjectPct}>{math.pct}%</span>
          </Link>

          <Link to="/english" className={`${styles.subjectCard} ${styles.subjectEnglish}`}>
            <span className={styles.subjectEmoji}>🔤</span>
            <div className={styles.subjectInfo}>
              <h3 className={styles.subjectName}>영어</h3>
              <p className={styles.subjectSub}>Stage 1 · {english.done}/{english.total}일 완료</p>
            </div>
            <div className={styles.subjectBar}>
              <div className={styles.subjectFill} style={{ width: `${english.pct}%` }} />
            </div>
            <span className={styles.subjectPct}>{english.pct}%</span>
          </Link>
        </div>

        <div className={styles.quickMenu}>
          <Link to="/roadmap" className={`${styles.menuCard} ${styles.menuRoadmap}`}>
            <span className={styles.menuIcon}>🗺️</span>
            <span className={styles.menuLabel}>전체 현황</span>
          </Link>
          <Link to="/review" className={`${styles.menuCard} ${styles.menuReview}`}>
            <span className={styles.menuIcon}>📖</span>
            <span className={styles.menuLabel}>오답 노트</span>
            {unreviewedCount > 0 ? <span className={styles.menuBadge}>{unreviewedCount}</span> : null}
          </Link>
          <Link to="/progress" className={`${styles.menuCard} ${styles.menuProgress}`}>
            <span className={styles.menuIcon}>📊</span>
            <span className={styles.menuLabel}>학습 기록</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
