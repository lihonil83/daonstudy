import { useEffect, useMemo, useRef, useState } from 'react';
import QuizSession from '../../components/Quiz/QuizSession';
import { useProgress } from '../../hooks/useProgress';
import { useReward } from '../../hooks/useReward';
import { useWrongAnswers } from '../../hooks/useWrongAnswers';
import Review from '../Review/Review';
import { clearStorageKeys } from '../../utils/storage';
import styles from './SmokeFlow.module.css';

const STORAGE_KEYS = ['eduapp_scores', 'eduapp_progress', 'eduapp_reward', 'eduapp_wrong'];

const smokeStorageQuestions = [
  {
    id: 'smoke-storage-wrong',
    question: '3 x 4 = ?',
    choices: [11, 12, 13],
    answer: 12,
    hints: ['3을 네 번 더해보세요.', '3 + 3 + 3 + 3 = 12예요.'],
    visual: {
      type: 'equation-card',
      expression: '3 x 4',
      cue: '저장 검증',
      badge: 'SAVE',
      category: 'multiplication',
    },
  },
  {
    id: 'smoke-storage-correct',
    question: '3 x 3 = ?',
    choices: [8, 9, 10],
    answer: 9,
    hints: ['3을 세 번 더하면 9예요.'],
    visual: {
      type: 'equation-card',
      expression: '3 x 3',
      cue: '저장 검증',
      badge: 'SAVE',
      category: 'multiplication',
    },
  },
];

const smokeStorageUnit = {
  id: 'storage-aware-smoke',
  title: '저장 검증 스모크',
  subject: 'math',
  data: { questions: smokeStorageQuestions },
};

function SmokeStorageSummary({ unitId, unitTitle }) {
  const progress = useProgress();
  const reward = useReward();
  const wrongAnswers = useWrongAnswers();
  const [snapshot, setSnapshot] = useState(null);
  const cleanedRef = useRef(false);
  const unitProgress = progress.getUnitProgress('math', unitId);
  const latestScore = progress.recentScores[0] ?? null;

  const isReady =
    progress.totalQuizCount === 1 &&
    progress.totalStudyDays === 1 &&
    progress.currentStreak === 1 &&
    reward.totalXp === 70 &&
    wrongAnswers.unreviewedCount === 0 &&
    wrongAnswers.reviewedList.length === 1 &&
    unitProgress.attempts === 1 &&
    unitProgress.bestScore === 1 &&
    latestScore?.unitTitle === unitTitle &&
    latestScore?.score === 1 &&
    latestScore?.total === 2 &&
    latestScore?.xpEarned === 30 &&
    reward.badgeProgress === '1/10 수집';

  useEffect(() => {
    if (!isReady || snapshot) {
      return;
    }

    setSnapshot({
      totalQuizCount: progress.totalQuizCount,
      totalStudyDays: progress.totalStudyDays,
      currentStreak: progress.currentStreak,
      totalXp: reward.totalXp,
      badgeProgress: reward.badgeProgress,
      reviewedCount: wrongAnswers.reviewedList.length,
      recentScoreLabel: `${latestScore.score}/${latestScore.total}`,
      recentXp: latestScore.xpEarned,
      unitAttempts: unitProgress.attempts,
      unitBestScore: unitProgress.bestScore,
      reviewQuestion: wrongAnswers.reviewedList[0]?.question ?? '',
    });
  }, [
    isReady,
    latestScore,
    progress.currentStreak,
    progress.totalQuizCount,
    progress.totalStudyDays,
    reward.badgeProgress,
    reward.totalXp,
    snapshot,
    unitProgress.attempts,
    unitProgress.bestScore,
    wrongAnswers.reviewedList,
  ]);

  useEffect(() => {
    if (!snapshot || cleanedRef.current) {
      return;
    }

    cleanedRef.current = true;
    clearStorageKeys(STORAGE_KEYS);
  }, [snapshot]);

  if (!snapshot) {
    return (
      <section className={styles.page}>
        <div className={styles.panel}>
          <p className={styles.kicker}>storage-aware smoke</p>
          <h2 className={styles.title}>저장 결과를 정리하고 있어요</h2>
          <p className={styles.copy}>점수, 진도, 보상, 오답 복습 상태가 모두 반영되었는지 확인하는 중입니다.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.panel}>
        <p className={styles.kicker}>storage-aware smoke</p>
        <h2 className={styles.title}>저장 smoke 완료</h2>
        <p className={styles.copy}>
          실제 localStorage 흐름을 거쳐 기록, 보상, 오답 복습 상태가 한 번에 연결되었어요.
        </p>
        <div className={styles.grid}>
          <div className={styles.card}>
            <strong>퀴즈 기록 {snapshot.totalQuizCount}개</strong>
            <span>최근 점수 {snapshot.recentScoreLabel}</span>
            <span>퀴즈 XP {snapshot.recentXp}</span>
          </div>
          <div className={styles.card}>
            <strong>공부한 날 {snapshot.totalStudyDays}일</strong>
            <span>연속 기록 {snapshot.currentStreak}일</span>
            <span>단원 도전 {snapshot.unitAttempts}회</span>
          </div>
          <div className={styles.card}>
            <strong>총 XP {snapshot.totalXp}</strong>
            <span>뱃지 {snapshot.badgeProgress}</span>
            <span>최고 점수 {snapshot.unitBestScore}점</span>
          </div>
          <div className={styles.card}>
            <strong>복습 완료 {snapshot.reviewedCount}개</strong>
            <span>{snapshot.reviewQuestion}</span>
            <span>오답이 실제 복습 완료로 이동했어요.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SmokeStorageFlow() {
  const [stage, setStage] = useState('boot');
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;
    clearStorageKeys(STORAGE_KEYS);
    setStage('quiz');

    return () => {
      clearStorageKeys(STORAGE_KEYS);
    };
  }, []);

  const quizAutomation = useMemo(
    () => ({
      mode: 'sequence',
      answerDelayMs: 120,
      answersByQuestionId: {
        'smoke-storage-wrong': [11, 13, 11],
        'smoke-storage-correct': [9],
      },
    }),
    [],
  );

  if (stage === 'boot') {
    return (
      <section className={styles.page}>
        <div className={styles.panel}>
          <p className={styles.kicker}>storage-aware smoke</p>
          <h2 className={styles.title}>저장 검증 준비 중</h2>
          <p className={styles.copy}>이전 기록을 비우고 실제 저장 흐름을 시작하고 있어요.</p>
        </div>
      </section>
    );
  }

  if (stage === 'quiz') {
    return (
      <QuizSession
        unit={smokeStorageUnit}
        accent="math"
        backTo="/"
        quizOptions={{
          questions: smokeStorageQuestions,
          questionCount: smokeStorageQuestions.length,
          completionBonus: 20,
          perfectBonus: 0,
        }}
        automation={quizAutomation}
        onComplete={() => setStage('review')}
      />
    );
  }

  if (stage === 'review') {
    return (
      <Review
        autoStartAll
        reviewAutomation={{
          mode: 'perfect',
          answerDelayMs: 120,
        }}
        onReviewComplete={() => setStage('summary')}
      />
    );
  }

  return <SmokeStorageSummary unitId={smokeStorageUnit.id} unitTitle={smokeStorageUnit.title} />;
}
