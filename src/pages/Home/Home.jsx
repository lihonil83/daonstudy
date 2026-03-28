import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ENGLISH_UNITS, MATH_UNITS } from '../../data/unitRegistry';
import { useProgress } from '../../hooks/useProgress';
import { useReward } from '../../hooks/useReward';
import { useWrongAnswers } from '../../hooks/useWrongAnswers';
import { getRecommendedMission } from '../../models/homeModel';
import styles from './Home.module.css';

const cards = [
  {
    to: '/math',
    badge: '수학',
    title: '수학 미션',
    description: '구구단, 시계 읽기, 길이·무게 단위, 덧셈·뺄셈 단원에서 오늘 풀고 싶은 문제를 골라보세요.',
  },
  {
    to: '/english',
    badge: '영어',
    title: '영어 퀘스트',
    description: '알파벳, 기초 단어, 파닉스 A·B·C 단원으로 들어가서 듣고 보고 고르는 영어 퀴즈를 시작해보세요.',
  },
  {
    to: '/review',
    badge: '복습',
    title: '복습 노트',
    description: '틀린 문제를 다시 풀면서 기억을 단단하게 만들고 복습 XP도 함께 받아보세요.',
  },
  {
    to: '/progress',
    badge: '기록',
    title: '학습 기록판',
    description: '연속 학습, 최고 점수, 레벨, 뱃지 변화를 한눈에 살펴보고 다음 단원도 바로 이어보세요.',
  },
];

const guideCards = [
  {
    title: '한 번에 10문제',
    copy: '퀴즈는 부담 없이 끝까지 풀 수 있게 10문제로 맞춰져 있어요.',
  },
  {
    title: '기록은 자동 저장',
    copy: '퀴즈를 마치면 점수, XP, 진도, 오답 노트가 함께 저장됩니다.',
  },
  {
    title: '복습으로 마무리',
    copy: '틀린 문제는 복습 노트로 모이고, 다시 풀면 기억이 더 오래 남아요.',
  },
];

export default function Home() {
  const { allBadges, badgeProgress, icon, level, title, totalXp, xpForNextLevel, xpProgress, xpToNext } =
    useReward();
  const { getUnitProgress, totalQuizCount } = useProgress();
  const { unreviewedCount } = useWrongAnswers();
  const badgePreview = allBadges.slice(0, 6);
  const recommendation = useMemo(
    () =>
      getRecommendedMission({
        unreviewedCount,
        totalQuizCount,
        getUnitProgress,
        mathUnits: Object.values(MATH_UNITS),
        englishUnits: Object.values(ENGLISH_UNITS),
      }),
    [getUnitProgress, totalQuizCount, unreviewedCount],
  );

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div>
          <p className={styles.kicker}>오늘의 학습 루틴</p>
          <h2 className={styles.heading}>시작, 복습, 기록이 한 번에 이어지는 학습 홈</h2>
        </div>
        <p className={styles.copy}>
          오늘 풀 문제를 고르고, 끝까지 풀고, 다시 복습하고, 기록까지 살펴보는 흐름을 한 화면에서
          자연스럽게 이어가도록 만들었습니다.
        </p>
        <Link className={styles.spotlightCard} to={recommendation.to}>
          <div className={styles.spotlightBody}>
            <span className={styles.spotlightBadge}>{recommendation.badge}</span>
            <h3 className={styles.spotlightTitle}>{recommendation.title}</h3>
            <p className={styles.spotlightCopy}>{recommendation.description}</p>
          </div>
          <span className={styles.spotlightCta}>{recommendation.cta}</span>
        </Link>
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
        <div className={styles.guideGrid}>
          {guideCards.map((card) => (
            <div key={card.title} className={styles.guideCard}>
              <strong className={styles.guideTitle}>{card.title}</strong>
              <p className={styles.guideCopy}>{card.copy}</p>
            </div>
          ))}
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
