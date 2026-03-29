import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import QuestionVisual from './QuestionVisual';
import { useProgress } from '../../hooks/useProgress';
import { useQuiz } from '../../hooks/useQuiz';
import { useReward } from '../../hooks/useReward';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { useWrongAnswers } from '../../hooks/useWrongAnswers';
import { useSound } from '../../hooks/useSound';
import { getSpeechPrompt } from '../../models/speechModel';
import styles from './QuizSession.module.css';

function getStarsLabel(stars) {
  if (stars === 3) return '별 3개';
  if (stars === 2) return '별 2개';
  if (stars === 1) return '별 1개';
  return '다음에 다시 도전';
}

function getChoiceState(choice, quiz) {
  if (quiz.feedbackState === 'correct' && choice === quiz.currentQuestion.answer) {
    return 'correct';
  }

  if (quiz.feedbackState === 'wrong' && choice === quiz.selectedAnswer) {
    return 'wrong';
  }

  if (quiz.feedbackState === 'revealed') {
    if (choice === quiz.currentQuestion.answer) return 'correct';
    if (choice === quiz.selectedAnswer) return 'wrong';
  }

  return 'default';
}

export default function QuizSession({
  unit,
  accent,
  backTo,
  mode = 'default',
  quizOptions,
  onRequestBack,
  automation,
  persistResult = true,
  onComplete,
}) {
  const quiz = useQuiz(unit, quizOptions);
  const { saveQuizResult } = useProgress();
  const { addXp, checkBadges, clearPending, pendingBadges, pendingLevelUp } = useReward();
  const { addWrongAnswer, markReviewed } = useWrongAnswers();
  const speech = useSpeechSynthesis();
  const { playClick, playCorrect, playWrong, playFanfare } = useSound();
  const lastSavedKeyRef = useRef('');
  const lastCompletedKeyRef = useRef('');
  const automationTimerRef = useRef(null);
  const lastAutomatedQuestionRef = useRef('');
  const speechPrompt = getSpeechPrompt(quiz.currentQuestion?.visual);

  const clearAutomationTimer = () => {
    if (automationTimerRef.current) {
      clearTimeout(automationTimerRef.current);
      automationTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (!quiz.isComplete || !quiz.result) {
      lastSavedKeyRef.current = '';
      return;
    }

    const saveKey = [
      mode,
      unit.subject,
      unit.id,
      quiz.result.score,
      quiz.result.total,
      quiz.result.stars,
      quiz.result.xpEarned,
      quiz.result.duration,
    ].join(':');

    if (lastSavedKeyRef.current === saveKey) {
      return;
    }

    if (!persistResult) {
      lastSavedKeyRef.current = saveKey;
      return;
    }

    if (mode === 'default') {
      saveQuizResult({
        subject: unit.subject,
        unit: unit.id,
        unitTitle: unit.title,
        score: quiz.result.score,
        total: quiz.result.total,
        stars: quiz.result.stars,
        xpEarned: quiz.result.xpEarned,
        duration: quiz.result.duration,
      });

      quiz.result.wrongAnswers.forEach((wrongAnswer) => {
        addWrongAnswer(wrongAnswer);
      });

      addXp(quiz.result.xpEarned);
      checkBadges({
        type: 'quiz',
        subject: unit.subject,
        unitId: unit.id,
      });
    }

    if (mode === 'review') {
      quiz.result.questionResults.forEach((questionResult) => {
        if (questionResult.wrongId) {
          markReviewed(questionResult.wrongId, questionResult.isCorrect);
        }
      });

      addXp(quiz.result.xpEarned);
      checkBadges({
        type: 'review',
        completed: true,
      });
    }

    lastSavedKeyRef.current = saveKey;
  }, [
    addWrongAnswer,
    addXp,
    checkBadges,
    markReviewed,
    mode,
    persistResult,
    quiz.isComplete,
    quiz.result,
    saveQuizResult,
    unit,
  ]);

  useEffect(() => {
    if (quiz.feedbackState === 'correct') {
      playCorrect();
    } else if (quiz.feedbackState === 'wrong' || quiz.feedbackState === 'revealed') {
      playWrong();
    }
  }, [quiz.feedbackState, playCorrect, playWrong]);

  useEffect(() => {
    if (!quiz.isComplete || !quiz.result) {
      lastCompletedKeyRef.current = '';
      return;
    }

    const completionKey = [
      mode,
      unit.subject,
      unit.id,
      quiz.result.score,
      quiz.result.total,
      quiz.result.stars,
      quiz.result.xpEarned,
      quiz.result.duration,
    ].join(':');

    if (lastCompletedKeyRef.current === completionKey) {
      return;
    }

    onComplete?.(quiz.result);
    // 퀴즈 완료 팡파르 재생 (점수에 상관없이 완료 자체를 축하)
    playFanfare();
    lastCompletedKeyRef.current = completionKey;
  }, [mode, onComplete, playFanfare, quiz.isComplete, quiz.result, unit.id, unit.subject]);

  useEffect(() => {
    speech.stop();
  }, [quiz.questionIndex, quiz.isComplete]);

  useEffect(() => {
    clearAutomationTimer();

    if (!automation || !quiz.currentQuestion || !quiz.canAnswer || quiz.isComplete) {
      if (!quiz.currentQuestion || quiz.isComplete) {
        lastAutomatedQuestionRef.current = '';
      }
      return undefined;
    }

    const answerSequence =
      automation.mode === 'sequence'
        ? automation.answersByQuestionId?.[quiz.currentQuestion.id] ??
          automation.answersByQuestionIndex?.[quiz.questionIndex] ??
          [quiz.currentQuestion.answer]
        : [quiz.currentQuestion.answer];
    const plannedAnswer = answerSequence[Math.min(quiz.attemptCount, answerSequence.length - 1)];

    if (typeof plannedAnswer === 'undefined') {
      return undefined;
    }

    const automationKey = [
      unit.id,
      quiz.questionIndex,
      quiz.currentQuestion.id,
      quiz.attemptCount,
      String(plannedAnswer),
    ].join(':');

    if (lastAutomatedQuestionRef.current === automationKey) {
      return undefined;
    }

    lastAutomatedQuestionRef.current = automationKey;
    automationTimerRef.current = setTimeout(() => {
      automationTimerRef.current = null;
      // 자동화 시에는 클릭 소리를 재생하지 않거나 필요에 따라 추가
      quiz.submitAnswer(plannedAnswer);
    }, automation.answerDelayMs ?? 120);

    return () => {
      clearAutomationTimer();
    };
  }, [
    automation,
    quiz.attemptCount,
    quiz.canAnswer,
    quiz.currentQuestion,
    quiz.isComplete,
    quiz.questionIndex,
    quiz.submitAnswer,
    unit.id,
  ]);

  const handleRestart = () => {
    speech.stop();
    clearAutomationTimer();
    lastAutomatedQuestionRef.current = '';
    clearPending();
    quiz.restart();
  };

  const handleBack = () => {
    speech.stop();
    clearAutomationTimer();
    lastAutomatedQuestionRef.current = '';
    clearPending();
    if (onRequestBack) {
      onRequestBack();
    }
  };

  const renderBackAction = (className, label) =>
    onRequestBack ? (
      <button type="button" className={className} onClick={handleBack}>
        {label}
      </button>
    ) : (
      <Link className={className} to={backTo} onClick={clearPending}>
        {label}
      </Link>
    );

  if (!quiz.currentQuestion && !quiz.isComplete) {
    return (
      <section className={`${styles.shell} ${styles[accent]}`}>
        <div className={styles.card}>
          <p className={styles.meta}>문제를 준비하고 있어요</p>
          <h2 className={styles.title}>{unit.title}</h2>
          <p className={styles.copy}>문제 세트를 불러오는 중입니다.</p>
        </div>
      </section>
    );
  }

  if (quiz.isComplete && quiz.result) {
    return (
      <section className={`${styles.shell} ${styles[accent]}`}>
        <div className={styles.card}>
          <p className={styles.meta}>{mode === 'review' ? '복습 완료' : '퀴즈 완료'}</p>
          <h2 className={styles.title}>{unit.title}</h2>
          {pendingLevelUp ? (
            <div className={styles.eventCard}>
              <strong>
                레벨 업! {pendingLevelUp.from.icon} → {pendingLevelUp.to.icon}
              </strong>
              <span>
                레벨 {pendingLevelUp.to.level} · {pendingLevelUp.to.title}
              </span>
            </div>
          ) : null}
          {pendingBadges.length > 0 ? (
            <div className={styles.badgeStack}>
              {pendingBadges.map((badge) => (
                <div key={badge.id} className={styles.badgeCard}>
                  <strong>
                    {badge.icon} 새 뱃지
                  </strong>
                  <span>{badge.name}</span>
                </div>
              ))}
            </div>
          ) : null}
          <div className={styles.resultGrid}>
            <div className={styles.resultCard}>
              <span className={styles.resultLabel}>점수</span>
              <strong className={styles.resultValue}>
                {quiz.result.score} / {quiz.result.total}
              </strong>
            </div>
            <div className={styles.resultCard}>
              <span className={styles.resultLabel}>별</span>
              <strong className={styles.resultValue}>{getStarsLabel(quiz.result.stars)}</strong>
            </div>
            <div className={styles.resultCard}>
              <span className={styles.resultLabel}>획득 XP</span>
              <strong className={styles.resultValue}>+{quiz.result.xpEarned}</strong>
            </div>
          </div>
          <p className={styles.copy}>
            {mode === 'review'
              ? `이번 복습은 ${quiz.result.duration}초 걸렸어요. 맞힌 문제는 완료 처리되고 아직 어려운 문제는 다음에 다시 만날 수 있어요.`
              : `복습할 문제는 ${quiz.result.wrongAnswers.length}개, 걸린 시간은 ${quiz.result.duration}초예요. 이번 기록은 학습 기록판에 자동으로 저장됩니다.`}
          </p>
          {mode === 'review' ? (
            <div className={styles.reviewList}>
              {quiz.result.questionResults.map((item) => (
                <div key={`${item.wrongId ?? item.id}-${item.isCorrect}`} className={styles.reviewItem}>
                  <span>{item.question}</span>
                  <strong>{item.isCorrect ? '✅ 맞혔어!' : '❌ 다음에 다시!'}</strong>
                </div>
              ))}
            </div>
          ) : null}
          <div className={styles.resultActions}>
            <button type="button" className={styles.primaryButton} onClick={handleRestart}>
              다시 풀기
            </button>
            {renderBackAction(styles.secondaryButton, mode === 'review' ? '복습 목록으로' : '단원 목록으로')}
            {mode === 'default' && quiz.result.wrongAnswers.length > 0 ? (
              <Link className={styles.ghostButton} to="/review" onClick={clearPending}>
                틀린 문제 복습하기
              </Link>
            ) : null}
          </div>

          {unit.resources && unit.resources.length > 0 ? (
            <div className={styles.resourceSection}>
              <p className={styles.resourceTitle}>📚 계속 공부하려면 — 여기서 더 풀어보세요</p>
              <p className={styles.resourceHint}>앱을 켜 둔 채로 아래 사이트에서 같은 단원 문제를 풀면 공부 시간이 자동으로 기록돼요.</p>
              <div className={styles.resourceLinks}>
                {unit.resources.map((res) => (
                  <a
                    key={res.url}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.resourceLink} ${styles[`resource_${res.provider}`]}`}
                  >
                    {res.label}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  const progressPercent = ((quiz.questionIndex + 1) / quiz.totalQuestions) * 100;
  const handleSpeechAction = () => {
    if (!speechPrompt) {
      return;
    }

    if (speech.isSpeaking) {
      speech.stop();
      return;
    }

    speech.speak(speechPrompt);
  };

  return (
    <section className={`${styles.shell} ${styles[accent]}`}>
      <div className={styles.card}>
        <div className={styles.topRow}>
          <div>
            <p className={styles.meta}>{unit.title}</p>
            <h2 className={styles.title}>{quiz.currentQuestion.question}</h2>
          </div>
          <div className={styles.counter}>
            {quiz.questionIndex + 1} / {quiz.totalQuestions}
          </div>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
        </div>
        <QuestionVisual visual={quiz.currentQuestion.visual} />
        {speechPrompt ? (
          <div className={styles.audioRow}>
            <button
              type="button"
              className={`${styles.audioButton} ${speech.isSpeaking ? styles.audioButtonActive : ''}`}
              onClick={handleSpeechAction}
              disabled={!speech.isSupported}
            >
              {speech.isSpeaking ? '소리 멈추기' : speechPrompt.label}
            </button>
            <span className={styles.audioHint}>
              {speech.error ||
                (speech.isSupported
                  ? '브라우저 음성으로 영어 단어와 글자를 들어볼 수 있어요.'
                  : '이 브라우저에서는 영어 소리 듣기를 지원하지 않아요.')}
            </span>
          </div>
        ) : null}
        <p className={styles.statusText}>{quiz.statusText}</p>
        {quiz.isShowingHint ? (
          <div className={styles.hintBubble}>
            <span className={styles.hintLabel}>힌트</span>
            <p>{quiz.hintText}</p>
          </div>
        ) : null}
        {quiz.explanationText ? (
          <div className={styles.explanationBox}>
            <span className={styles.explanationLabel}>💡 AI 선생님의 설명</span>
            <p>{quiz.explanationText}</p>
          </div>
        ) : null}
        <div className={styles.choiceGrid}>
          {quiz.currentQuestion.choices.map((choice) => {
            const choiceState = getChoiceState(choice, quiz);
            const className = [
              styles.choiceButton,
              choiceState === 'correct' ? styles.choiceCorrect : '',
              choiceState === 'wrong' ? styles.choiceWrong : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <button
                key={`${quiz.currentQuestion.id}-${choice}`}
                type="button"
                className={className}
                disabled={!quiz.canAnswer}
                onClick={() => {
                  quiz.submitAnswer(choice);
                }}
              >
                <span>{String(choice)}</span>
              </button>
            );
          })}
        </div>
        <div className={styles.footer}>
          <div className={styles.footerInfo}>
            <span>현재 점수: {quiz.score}</span>
            <span>이 문제에서 틀린 횟수: {quiz.attemptCount}</span>
          </div>
          {renderBackAction(styles.backLink, mode === 'review' ? '복습 목록으로 돌아가기' : '단원 목록으로 돌아가기')}
        </div>
      </div>
    </section>
  );
}
