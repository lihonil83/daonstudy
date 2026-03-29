import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../../hooks/useProgress';
import { useReward } from '../../hooks/useReward';
import { useStudyLogger } from '../../hooks/useStudyLogger';
import { clearLearningData } from '../../utils/storage';
import styles from './Progress.module.css';

function formatShortDate(dateString) {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length < 3) return dateString;
  return `${Number(parts[1])}/${Number(parts[2])}`;
}

function formatStars(stars) {
  return stars > 0 ? '⭐'.repeat(stars) : '도전 완료';
}

export default function Progress() {
  const { currentStreak, recentScores, totalQuizCount, totalStudyDays } = useProgress();
  const { xp, level, badges } = useReward();
  const { todayMinutes } = useStudyLogger();
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const stats = [
    { label: '🔥 연속 학습', value: `${currentStreak}일`, color: '#ff6b6b' },
    { label: '📊 전체 퀴즈', value: `${totalQuizCount}회`, color: '#4f8ef7' },
    { label: '⏰ 오늘 학습', value: `${todayMinutes}분`, color: '#9d4edd' },
    { label: '📅 열공한 날', value: `${totalStudyDays}일`, color: '#2ec4b6' },
  ];

  const handleReset = () => {
    if (window.confirm('정말 모든 학습 기록을 지울까요? 이 작업은 되돌릴 수 없어요.')) {
      clearLearningData();
      window.location.reload();
    }
  };

  return (
    <div className={styles.container}>
      {/* ── 상단 대시보드 ── */}
      <header className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.profileBadge}>
            <span className={styles.avatar}>{level.icon}</span>
            <div className={styles.levelInfo}>
              <span className={styles.levelTag}>Lv.{level.level}</span>
              <h2 className={styles.levelTitle}>{level.title}</h2>
            </div>
          </div>
          <div className={styles.xpBarContainer}>
            <div className={styles.xpMeta}>
              <span>현재 경험치 {xp} XP</span>
              <span>다음 레벨까지 {500 - (xp % 500)} XP</span>
            </div>
            <div className={styles.xpBarTrack}>
              <div className={styles.xpBarFill} style={{ width: `${(xp % 500) / 5}%` }} />
            </div>
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.statGrid}>
            {stats.map(stat => (
              <div key={stat.label} className={styles.statCard}>
                <span className={styles.statLabel}>{stat.label}</span>
                <strong className={styles.statValue} style={{ color: stat.color }}>{stat.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className={styles.mainContent}>
        {/* ── 뱃지 컬렉션 ── */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>🏆 뱃지 컬렉션 ({badges.length})</h3>
          {badges.length > 0 ? (
            <div className={styles.badgeGrid}>
              {badges.map(badge => (
                <div key={badge.id} className={styles.badgeItem} title={badge.description}>
                  <span className={styles.badgeIcon}>{badge.icon}</span>
                  <span className={styles.badgeName}>{badge.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyCard}>
              <p>아직 획득한 뱃지가 없어요. 로드맵을 따라 퀴즈를 풀어보세요!</p>
              <Link to="/roadmap" className={styles.linkButton}>로드맵 가기</Link>
            </div>
          )}
        </section>

        <div className={styles.twoColumn}>
          {/* ── 최근 활동 ── */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>📝 최근 학습 기록</h3>
            {recentScores.length > 0 ? (
              <div className={styles.recentList}>
                {recentScores.slice(0, 5).map(entry => (
                  <div key={entry.id || Math.random()} className={styles.recentRow}>
                    <div className={styles.scoreBadge}>{entry.score}/{entry.total}</div>
                    <div className={styles.entryInfo}>
                      <strong>{entry.unitTitle}</strong>
                      <span>{formatShortDate(entry.date)} · {formatStars(entry.stars)}</span>
                    </div>
                    {entry.improved && <span className={styles.upBadge}>📈 실력 쑥쑥</span>}
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyText}>최근 기록이 아직 없어요.</p>
            )}
          </section>

          {/* ── AI 분석 (Placeholder) ── */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>💡 AI 학습 가이드</h3>
            <div className={styles.aiCard}>
              <p className={styles.aiText}>
                현재까지의 학습 데이터를 분석하여 아드님에게 꼭 필요한 다음 단원을 추천해줄 수 있어요.
              </p>
              <button className={styles.aiButton} disabled>준비 중인 기능이에요</button>
            </div>
          </section>
        </div>

        {/* ── 관리 ── */}
        <footer className={styles.footer}>
          <button onClick={handleReset} className={styles.resetButton}>학습 데이터 초기화</button>
        </footer>
      </div>
    </div>
  );
}
