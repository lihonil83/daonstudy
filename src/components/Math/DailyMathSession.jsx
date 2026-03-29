import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getCurrentDay,
  isPassing,
  isUnitComplete,
  markDayPassed,
  DAYS_PER_UNIT,
} from '../../models/mathDailyProgressModel';
import { generateLocalQuiz } from '../../utils/localGenerator';
import styles from './DailyMathSession.module.css';

// ─── 내부 퀴즈 컴포넌트 ───────────────────────────────────────────────
function QuizPart({ questions, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState('idle'); // 'idle' | 'correct' | 'wrong'

  const q = questions[idx];
  if (!q) return null;

  const submit = (choice) => {
    if (phase !== 'idle') return;
    const correct = String(choice) === String(q.answer);
    setSelected(choice);
    setPhase(correct ? 'correct' : 'wrong');

    setTimeout(() => {
      const nextScore = correct ? score + 1 : score;
      const nextIdx = idx + 1;
      if (nextIdx >= questions.length) {
        onComplete(nextScore, questions.length);
      } else {
        setScore(nextScore);
        setIdx(nextIdx);
        setSelected(null);
        setPhase('idle');
      }
    }, correct ? 700 : 1200);
  };

  const pct = ((idx + 1) / questions.length) * 100;

  return (
    <div className={styles.quizPart}>
      <div className={styles.quizTop}>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${pct}%` }} />
        </div>
        <span className={styles.counter}>{idx + 1} / {questions.length}</span>
      </div>

      <h2 className={styles.question}>{q.question}</h2>

      <div className={styles.choices}>
        {q.choices.map((c) => {
          const cs = String(c);
          const ans = String(q.answer);
          const isSel = selected === c;
          const isAns = cs === ans;
          let cls = styles.choice;
          if (isSel && phase === 'correct') cls += ` ${styles.choiceCorrect}`;
          else if (isSel && phase === 'wrong') cls += ` ${styles.choiceWrong}`;
          else if (!isSel && phase === 'wrong' && isAns) cls += ` ${styles.choiceCorrect}`;
          return (
            <button
              key={cs}
              className={cls}
              onClick={() => submit(c)}
              disabled={phase !== 'idle'}
            >
              {cs}
            </button>
          );
        })}
      </div>

      {phase === 'wrong' && q.explanation && (
        <div className={styles.explanation}>{q.explanation}</div>
      )}

      <p className={styles.scoreInfo}>현재 점수: {score}</p>
    </div>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────
export default function DailyMathSession({ unit, backTo }) {
  const alreadyDone = isUnitComplete(unit.id);
  const currentDay = alreadyDone ? DAYS_PER_UNIT : getCurrentDay(unit.id);
  const isPracticeMode = alreadyDone;

  const [screen, setScreen] = useState('quiz'); // 'quiz' | 'pass' | 'fail'
  const [quizKey, setQuizKey] = useState(0);
  const [lastScore, setLastScore] = useState(null);
  const [lastTotal, setLastTotal] = useState(null);

  const questions = useMemo(
    () => generateLocalQuiz(unit.id, 10),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [unit.id, quizKey],
  );

  const handleComplete = (score, total) => {
    setLastScore(score);
    setLastTotal(total);
    if (isPracticeMode || isPassing(score, total)) {
      if (!isPracticeMode) {
        markDayPassed(unit.id, currentDay, score, total);
      }
      setScreen('pass');
    } else {
      setScreen('fail');
    }
  };

  const handleRetry = () => {
    setQuizKey((k) => k + 1);
    setScreen('quiz');
  };

  // ─── 통과 화면 ────────────────────────────────────────────────
  if (screen === 'pass') {
    const unitNowDone = !isPracticeMode && currentDay >= DAYS_PER_UNIT;
    return (
      <section className={styles.resultScreen}>
        <div className={`${styles.resultCard} ${styles.passCard}`}>
          <p className={styles.emoji}>{unitNowDone ? '🏆' : isPracticeMode ? '✨' : '⭐'}</p>
          <h2 className={styles.resultTitle}>
            {unitNowDone
              ? '단원 완료!'
              : isPracticeMode
              ? '연습 완료!'
              : `Day ${currentDay} 통과!`}
          </h2>
          <p className={styles.scoreDisplay}>
            {lastScore} / {lastTotal} 정답
            <span className={styles.pct}>
              ({Math.round((lastScore / lastTotal) * 100)}%)
            </span>
          </p>
          {unitNowDone && (
            <p className={styles.msg}>
              이 단원을 모두 마쳤어요! 🎉 다음 단원이 열렸어요.
            </p>
          )}
          {!unitNowDone && !isPracticeMode && (
            <p className={styles.msg}>
              {DAYS_PER_UNIT - currentDay}일 더 남았어요. 내일 계속해요!
            </p>
          )}
          {isPracticeMode && (
            <p className={styles.msg}>이미 완료한 단원이에요. 언제든 다시 연습할 수 있어요!</p>
          )}
          <div className={styles.resultActions}>
            <button type="button" className={styles.retryBtn} onClick={handleRetry}>
              다시 풀기
            </button>
            <Link className={styles.backBtn} to={backTo}>
              단원 목록으로
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ─── 실패 화면 ────────────────────────────────────────────────
  if (screen === 'fail') {
    return (
      <section className={styles.resultScreen}>
        <div className={`${styles.resultCard} ${styles.failCard}`}>
          <p className={styles.emoji}>💪</p>
          <h2 className={styles.resultTitle}>80%를 넘어야 해요</h2>
          <p className={styles.scoreDisplay}>
            {lastScore} / {lastTotal} 정답
            <span className={styles.pct}>
              ({Math.round((lastScore / lastTotal) * 100)}%)
            </span>
          </p>
          <p className={styles.msg}>조금만 더 연습하면 돼요! 다시 도전해볼까요?</p>
          <div className={styles.resultActions}>
            <button type="button" className={styles.retryBtn} onClick={handleRetry}>
              다시 풀기
            </button>
            <Link className={styles.backBtn} to={backTo}>
              단원 목록으로
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ─── 퀴즈 화면 ────────────────────────────────────────────────
  return (
    <section className={styles.shell}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <p className={styles.dayLabel}>
              {isPracticeMode
                ? '연습 모드'
                : `Day ${currentDay} / ${DAYS_PER_UNIT}`}
            </p>
            <h2 className={styles.unitTitle}>{unit.icon} {unit.title}</h2>
            <p className={styles.unitDesc}>{unit.description}</p>
          </div>
          <Link className={styles.backLink} to={backTo}>
            ← 목록
          </Link>
        </div>

        <QuizPart key={quizKey} questions={questions} onComplete={handleComplete} />
      </div>
    </section>
  );
}
