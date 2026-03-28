import { Link } from 'react-router-dom';
import { useReward } from '../../hooks/useReward';
import { useWrongAnswers } from '../../hooks/useWrongAnswers';
import styles from './Home.module.css';

const cards = [
  {
    to: '/math',
    badge: '수학',
    title: '수학 미션',
    description: '숫자 놀이터로 들어가서 구구단, 시계 읽기, 길이·무게 단위, 덧셈·뺄셈을 골라 시작해보세요.',
  },
  {
    to: '/english',
    badge: '영어',
    title: '영어 퀘스트',
    description: '알파벳, 기초 단어, 파닉스 A·B·C 단원으로 들어가서 영어 퀴즈를 풀어보세요.',
  },
  {
    to: '/review',
    badge: '복습',
    title: '복습 노트',
    description: '3단계에서 오답 복습 흐름이 연결될 준비가 되어 있어요.',
  },
  {
    to: '/progress',
    badge: '기록',
    title: '학습 기록판',
    description: '연속 학습, 점수, 레벨 기록이 들어올 자리를 미리 준비해두었어요.',
  },
];

export default function Home() {
  const { allBadges, badgeProgress, icon, level, title, totalXp, xpForNextLevel, xpProgress, xpToNext } =
    useReward();
  const { unreviewedCount } = useWrongAnswers();
  const badgePreview = allBadges.slice(0, 6);

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div>
          <p className={styles.kicker}>3단계 MVP 흐름</p>
          <h2 className={styles.heading}>배운 기록과 보상이 함께 쌓이는 학습 출발점</h2>
        </div>
        <p className={styles.copy}>
          퀴즈를 끝까지 풀면 점수, XP, 뱃지, 오답 복습 흐름이 함께 이어집니다. 잘한 점을
          모으면서 다음 학습으로 자연스럽게 넘어가게 만들고 있어요.
        </p>
        <div className={styles.overviewGrid}>
          <div className={styles.rewardCard}>
            <div className={styles.rewardTop}>
              <div>
                <p className={styles.rewardLabel}>현재 레벨</p>
                <h3 className={styles.rewardTitle}>
                  {icon} 레벨 {level} · {title}
                </h3>
              </div>
              <span className={styles.rewardHint}>다음까지 {xpToNext} XP</span>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${Math.max(0, Math.min(1, xpProgress)) * 100}%` }} />
            </div>
            <div className={styles.rewardMeta}>
              <span>{totalXp} XP</span>
              <span>{xpForNextLevel} XP 목표</span>
            </div>
            <div className={styles.badgeRow}>
              {badgePreview.map((badge) => (
                <span key={badge.id} className={badge.earned ? styles.badgeChip : styles.badgeChipMuted}>
                  {badge.earned ? badge.icon : badge.hidden ? '❔' : '◻️'}
                </span>
              ))}
            </div>
            <p className={styles.rewardCopy}>뱃지 {badgeProgress}</p>
          </div>

          <Link className={styles.reviewCard} to="/review">
            <p className={styles.reviewKicker}>복습 알림</p>
            <h3 className={styles.reviewTitle}>
              {unreviewedCount > 0 ? `📖 복습할 문제가 ${unreviewedCount}개 있어요` : '✨ 복습할 문제가 없어요'}
            </h3>
            <p className={styles.reviewCopy}>
              {unreviewedCount > 0
                ? '가볍게 다시 풀어보면 XP도 받고 더 또렷하게 기억할 수 있어요.'
                : '지금까지 나온 문제는 잘 정리되고 있어요. 필요하면 언제든 다시 볼 수 있어요.'}
            </p>
          </Link>
        </div>
      </div>

      <div className={styles.grid}>
        {cards.map((card) => (
          <Link key={card.to} to={card.to} className={styles.card}>
            <span className={styles.badge}>{card.badge}</span>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            <p className={styles.cardCopy}>{card.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
