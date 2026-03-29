import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CURRICULUM } from '../../data/curriculum';
import { useProgress } from '../../hooks/useProgress';
import { useReward } from '../../hooks/useReward';
import { useWrongAnswers } from '../../hooks/useWrongAnswers';
import { getRecommendedMission } from '../../models/homeModel';
import styles from './Home.module.css';

export default function Home() {
  const { icon, level, title, totalXp, xpForNextLevel, xpProgress, xpToNext } = useReward();
  const { getUnitProgress, totalQuizCount, currentStreak } = useProgress();
  const { unreviewedCount } = useWrongAnswers();

  const recommendation = useMemo(
    () => {
      // CURRICULUM 데이터를 homeModel이 기대하는 형식으로 변환
      const allUnits = CURRICULUM.map(item => ({
        ...item,
        available: true // 모든 단원을 추천 가능 대상으로 함
      }));
      
      const mathUnits = allUnits.filter(u => u.subject === 'math');
      const englishUnits = allUnits.filter(u => u.subject === 'english');

      return getRecommendedMission({
        unreviewedCount,
        totalQuizCount,
        getUnitProgress,
        mathUnits,
        englishUnits,
      });
    },
    [getUnitProgress, totalQuizCount, unreviewedCount],
  );

  const xpPercent = Math.max(0, Math.min(1, xpProgress)) * 100;

  return (
    <div className={styles.page}>
      {/* 왼쪽: 캐릭터 + XP */}
      <aside className={styles.sidebar}>
        <div className={styles.avatarCard}>
          <div className={styles.avatarEmoji}>{icon}</div>
          <div className={styles.levelBadge}>Lv.{level}</div>
          <h2 className={styles.levelTitle}>{title}</h2>
          <div className={styles.xpBar}>
            <div className={styles.xpFill} style={{ width: `${xpPercent}%` }} />
          </div>
          <p className={styles.xpText}>{totalXp} XP · 다음까지 {xpToNext} XP</p>
          <p className={styles.xpGoal}>{xpForNextLevel} XP 목표</p>
        </div>

        {/* 연속 학습 스트릭 */}
        <div className={styles.streakCard}>
          <span className={styles.streakIcon}>🔥</span>
          <div>
            <p className={styles.streakLabel}>연속 학습</p>
            <p className={styles.streakValue}>{currentStreak}일째</p>
          </div>
        </div>

        {/* 복습 알림 */}
        <Link to="/review" className={`${styles.reviewBadge} ${unreviewedCount > 0 ? styles.reviewBadgeActive : ''}`}>
          <span>📖</span>
          <span>복습할 문제 {unreviewedCount > 0 ? `${unreviewedCount}개` : '없음'}</span>
        </Link>
      </aside>

      {/* 오른쪽: 오늘의 추천 + 메뉴 */}
      <main className={styles.mainArea}>
        <div className={styles.greeting}>
          <p className={styles.greetingKicker}>안녕하세요! 오늘도 같이 공부해요 🎉</p>
          <h1 className={styles.greetingTitle}>다온 학습 놀이터</h1>
        </div>

        {/* 오늘의 추천 */}
        <Link to={recommendation.to} className={styles.spotlightCard}>
          <div className={styles.spotlightLeft}>
            <span className={styles.spotlightBadge}>{recommendation.badge}</span>
            <h3 className={styles.spotlightTitle}>{recommendation.title}</h3>
            <p className={styles.spotlightDesc}>{recommendation.description}</p>
          </div>
          <span className={styles.spotlightCta}>{recommendation.cta} →</span>
        </Link>

        {/* 빠른 메뉴 3개 */}
        <div className={styles.quickMenu}>
          <Link to="/roadmap" className={`${styles.menuCard} ${styles.menuRoadmap}`}>
            <span className={styles.menuIcon}>🗺️</span>
            <span className={styles.menuLabel}>학습 로드맵</span>
            <span className={styles.menuDesc}>1~6학년 전체</span>
          </Link>
          <Link to="/review" className={`${styles.menuCard} ${styles.menuReview}`}>
            <span className={styles.menuIcon}>📖</span>
            <span className={styles.menuLabel}>오답 복습</span>
            <span className={styles.menuDesc}>{unreviewedCount}개 대기중</span>
          </Link>
          <Link to="/progress" className={`${styles.menuCard} ${styles.menuProgress}`}>
            <span className={styles.menuIcon}>📊</span>
            <span className={styles.menuLabel}>학습 기록</span>
            <span className={styles.menuDesc}>총 {totalQuizCount}회 완료</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
