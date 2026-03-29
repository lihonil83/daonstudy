import { Link } from 'react-router-dom';
import { ENGLISH_CHALLENGE_UNITS, MATH_CHALLENGE_UNITS } from '../../data/unitRegistry';
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
  const progress = useProgress();
  const reward = useReward();
  const { todayMinutes } = useStudyLogger();

  const currentStreak = progress.currentStreak ?? 0;
  const totalQuizCount = progress.totalQuizCount ?? 0;
  const totalStudyDays = progress.totalStudyDays ?? 0;
  const recentScores = progress.recentScores ?? [];

  const levelNumber =
    typeof reward.level === 'number' ? reward.level : reward.level?.level ?? 1;
  const levelTitle = reward.title ?? reward.level?.title ?? '새싹 학습자';
  const levelIcon = reward.icon ?? reward.level?.icon ?? '🌱';
  const totalXp = reward.totalXp ?? reward.xp ?? 0;
  const xpToNext = reward.xpToNext ?? 0;
  const earnedBadges =
    reward.allBadges?.filter((badge) => badge.earned) ??
    reward.earnedBadges ??
    reward.badges ??
    [];

  const stats = [
    { label: '연속 학습', value: `${currentStreak}일`, tone: styles.statWarm },
    { label: '전체 퀴즈', value: `${totalQuizCount}회`, tone: styles.statSky },
    { label: '오늘 학습', value: `${todayMinutes}분`, tone: styles.statMint },
    { label: '공부한 날', value: `${totalStudyDays}일`, tone: styles.statGold },
  ];

  const recommendedMathUnit = MATH_CHALLENGE_UNITS[0];
  const recommendedEnglishUnit = ENGLISH_CHALLENGE_UNITS[0];

  const handleReset = () => {
    if (typeof window === 'undefined') {
      return;
    }

    if (window.confirm('정말 모든 학습 기록을 지울까요? 이 작업은 되돌릴 수 없어요.')) {
      clearLearningData();
      window.location.reload();
    }
  };

  return (
    <section className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroMain}>
          <p className={styles.heroEyebrow}>나의 학습 기록</p>
          <h1 className={styles.heroTitle}>오늘까지 쌓인 배움의 흐름을 한눈에 볼 수 있어요</h1>
          <p className={styles.heroCopy}>기록은 자동으로 저장되고, 작은 진전도 여기서 차곡차곡 확인할 수 있어요.</p>
          <div className={styles.levelRow}>
            <span className={styles.levelIcon}>{levelIcon}</span>
            <div>
              <p className={styles.levelLabel}>Lv.{levelNumber}</p>
              <h2 className={styles.levelTitle}>{levelTitle}</h2>
            </div>
          </div>
          <p className={styles.streakHeadline}>🔥 {currentStreak}일째 이어가고 있어요</p>
        </div>

        <div className={styles.heroSide}>
          <div className={styles.xpCard}>
            <span className={styles.xpLabel}>현재 경험치</span>
            <strong className={styles.xpValue}>{totalXp} XP</strong>
            <span className={styles.xpHint}>다음 레벨까지 {xpToNext} XP</span>
          </div>
          <div className={styles.badgeCard}>
            <span className={styles.xpLabel}>획득한 뱃지</span>
            <strong className={styles.xpValue}>{earnedBadges.length}개</strong>
            <span className={styles.xpHint}>학습을 이어가면 새 뱃지가 열려요.</span>
          </div>
        </div>
      </header>

      <div className={styles.statGrid}>
        {stats.map((stat) => (
          <div key={stat.label} className={`${styles.statCard} ${stat.tone}`}>
            <span className={styles.statLabel}>{stat.label}</span>
            <strong className={styles.statValue}>{stat.value}</strong>
          </div>
        ))}
      </div>

      <div className={styles.contentGrid}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>최근 학습 기록</h2>
          {recentScores.length > 0 ? (
            <div className={styles.recentList}>
              {recentScores.slice(0, 5).map((entry) => (
                <div key={entry.id ?? `${entry.unitTitle}-${entry.date}`} className={styles.recentRow}>
                  <div className={styles.scoreBadge}>{entry.score}/{entry.total}</div>
                  <div className={styles.entryInfo}>
                    <strong>{entry.unitTitle}</strong>
                    <span>{formatShortDate(entry.date)} · {formatStars(entry.stars)}</span>
                  </div>
                  {entry.improved ? <span className={styles.upBadge}>📈 실력이 늘고 있어요</span> : null}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyPanel}>
              <p className={styles.emptyLead}>첫 퀴즈를 풀면 최근 기록이 여기부터 차곡차곡 쌓여요.</p>
              <p className={styles.emptyCopy}>오늘 가볍게 한 번 시작해볼까요?</p>
              <div className={styles.actionRow}>
                <Link to={`/math/${recommendedMathUnit.id}`} className={styles.primaryLink}>
                  추천 수학 시작하기
                </Link>
                <Link to={`/english/${recommendedEnglishUnit.id}`} className={styles.secondaryLink}>
                  추천 영어 시작하기
                </Link>
              </div>
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>학습 기록 관리</h2>
          <p className={styles.manageCopy}>기록은 자동 저장되니 보통은 그대로 두면 됩니다.</p>
          <div className={styles.quickLinks}>
            <Link to="/review" className={styles.linkChip}>오답 노트 보기</Link>
            <Link to="/roadmap" className={styles.linkChip}>전체 현황 보기</Link>
            <Link to="/math" className={styles.linkChip}>수학 단원 보기</Link>
            <Link to="/english" className={styles.linkChip}>영어 단원 보기</Link>
          </div>
          <button type="button" className={styles.resetButton} onClick={handleReset}>
            학습 기록 초기화
          </button>
        </section>
      </div>
    </section>
  );
}
