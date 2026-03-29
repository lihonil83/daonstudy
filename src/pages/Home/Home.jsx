import { Link } from 'react-router-dom';
import { CURRICULUM } from '../../data/curriculum';
import { useProgress } from '../../hooks/useProgress';
import { useReward } from '../../hooks/useReward';
import { useWrongAnswers } from '../../hooks/useWrongAnswers';
import { getUnitProgress as getMathProgress, DAYS_PER_UNIT } from '../../models/mathDailyProgressModel';
import { getUnitProgress as getEnProgress } from '../../models/enDailyProgressModel';
import { ENGLISH_STAGE_1 } from '../../data/englishCurriculum';
import styles from './Home.module.css';

const MATH_UNITS = CURRICULUM.filter(u => u.subject === 'math');

function useMathSummary() {
  const total = MATH_UNITS.length * DAYS_PER_UNIT;
  const done = MATH_UNITS.reduce((sum, u) => {
    return sum + getMathProgress(u.id, DAYS_PER_UNIT).passedDays;
  }, 0);
  return { done, total, pct: total > 0 ? Math.round(done / total * 100) : 0 };
}

function useEnglishSummary() {
  const units = ENGLISH_STAGE_1.units.filter(u => u.type === 'daily');
  const total = units.reduce((s, u) => s + u.dailyLessons.length, 0);
  const done = units.reduce((s, u) => {
    return s + getEnProgress(u.id, u.dailyLessons.length).passedDays;
  }, 0);
  return { done, total, pct: total > 0 ? Math.round(done / total * 100) : 0 };
}

export default function Home() {
  const { icon, level, title, totalXp, xpProgress, xpToNext } = useReward();
  const { currentStreak, totalQuizCount } = useProgress();
  const { unreviewedCount } = useWrongAnswers();
  const math = useMathSummary();
  const english = useEnglishSummary();
  const xpPercent = Math.max(0, Math.min(1, xpProgress)) * 100;

  return (
    <div className={styles.page}>
      {/* ── 왼쪽: 캐릭터 + XP ── */}
      <aside className={styles.sidebar}>
        <div className={styles.avatarCard}>
          <div className={styles.avatarEmoji}>{icon}</div>
          <div className={styles.levelBadge}>Lv.{level}</div>
          <h2 className={styles.levelTitle}>{title}</h2>
          <div className={styles.xpBar}>
            <div className={styles.xpFill} style={{ width: `${xpPercent}%` }} />
          </div>
          <p className={styles.xpText}>{totalXp} XP · 다음까지 {xpToNext} XP</p>
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

      {/* ── 오른쪽: 주요 학습 ── */}
      <main className={styles.mainArea}>
        <div className={styles.greeting}>
          <h1 className={styles.greetingTitle}>다온 학습 놀이터 👋</h1>
          <p className={styles.greetingKicker}>오늘도 조금씩, 꾸준히!</p>
        </div>

        {/* 과목 카드 2개 */}
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

        {/* 빠른 메뉴 */}
        <div className={styles.quickMenu}>
          <Link to="/roadmap" className={`${styles.menuCard} ${styles.menuRoadmap}`}>
            <span className={styles.menuIcon}>🗺️</span>
            <span className={styles.menuLabel}>전체 현황</span>
          </Link>
          <Link to="/review" className={`${styles.menuCard} ${styles.menuReview}`}>
            <span className={styles.menuIcon}>📖</span>
            <span className={styles.menuLabel}>오답 노트</span>
            {unreviewedCount > 0 && (
              <span className={styles.menuBadge}>{unreviewedCount}</span>
            )}
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
