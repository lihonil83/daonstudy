import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../../hooks/useProgress';
import { useReward } from '../../hooks/useReward';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import {
  getCurrentDay,
  isPassing,
  isDayPassed,
  markDayPassed,
  PASS_THRESHOLD,
} from '../../models/enDailyProgressModel';
import styles from './DailyLessonSession.module.css';

// ─── 문제 생성 ────────────────────────────────────────────────────────
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function makeQuestion(card, allCards, quizMode) {
  const wrongPool = shuffle(allCards.filter(c => c.id !== card.id)).slice(0, 3);
  let question, choices, answer, ttsText;

  if (quizMode === 'pick-letter') {
    question = `${card.emoji}  "${card.word}" 의 첫 글자는?`;
    answer = card.letter.toUpperCase();
    choices = shuffle([answer, ...wrongPool.map(c => c.letter.toUpperCase())]);
    ttsText = card.word;
  } else if (quizMode === 'pick-lower') {
    question = `대문자 "${card.upperLetter}" 의 소문자는?`;
    answer = card.letter;
    choices = shuffle([answer, ...wrongPool.map(c => c.letter)]);
    ttsText = card.word;
  } else {
    question = `${card.emoji}  이 그림의 이름은?`;
    answer = card.word;
    choices = shuffle([answer, ...wrongPool.map(c => c.word)]);
    ttsText = card.word;
  }

  return { id: card.id, question, choices, answer, ttsText, emoji: card.emoji, korean: card.korean };
}

/**
 * 오늘 테스트 문제 생성
 * - 새 카드 전부 + 이전 복습 카드로 총 10문제 구성
 * - 카드 수가 부족하면 새 카드 반복
 */
function buildTestQuestions(unit, day) {
  const lesson = unit.dailyLessons[day - 1];
  const newCards = lesson.newCards;

  // 이전 날 카드 (복습용)
  const prevCards = [];
  for (let d = 0; d < day - 1; d++) {
    prevCards.push(...unit.dailyLessons[d].newCards);
  }

  const TARGET = 10;
  const pool = [...newCards];

  // 복습 카드로 10개 채우기
  const reviewSampled = shuffle(prevCards);
  for (const c of reviewSampled) {
    if (pool.length >= TARGET) break;
    pool.push(c);
  }

  // 그래도 부족하면 새 카드 반복 추가
  while (pool.length < TARGET) {
    pool.push(newCards[pool.length % newCards.length]);
  }

  return shuffle(pool)
    .slice(0, TARGET)
    .map(card => makeQuestion(card, unit.cards, unit.quizMode));
}

// ─── 컴포넌트 ──────────────────────────────────────────────────────────
export default function DailyLessonSession({ unit, backTo = '/english' }) {
  const { saveQuizResult } = useProgress();
  const { addXp } = useReward();
  const speech = useSpeechSynthesis();

  // 현재 day 계산 (완료 기준 잠금)
  const day = Math.min(getCurrentDay(unit.id), unit.dailyLessons.length);
  const lesson = unit.dailyLessons[day - 1];
  const totalDays = unit.dailyLessons.length;
  const alreadyAllDone = unit.dailyLessons.every((_, i) => isDayPassed(unit.id, i + 1));

  // phase: 'cards' | 'test' | 'result'
  const [phase, setPhase] = useState('cards');
  const [cardIndex, setCardIndex] = useState(0);

  // 테스트 상태
  const [questions, setQuestions] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const savedRef = useRef(false);

  const newCards = lesson?.newCards ?? [];
  const currentCard = newCards[cardIndex];
  const currentQuestion = questions[quizIndex];

  // ─── TTS ───────────────────────────────────────────────────────────
  const speakCurrent = useCallback(() => {
    if (currentCard?.word) speech.speak(currentCard.word);
  }, [currentCard, speech]);

  useEffect(() => { speech.stop(); }, [cardIndex]);

  // ─── 카드 → 테스트 전환 ──────────────────────────────────────────
  const startTest = useCallback(() => {
    savedRef.current = false;
    const qs = buildTestQuestions(unit, day);
    setQuestions(qs);
    setQuizIndex(0);
    setScore(0);
    setSelected(null);
    setFeedback(null);
    setPhase('test');
  }, [unit, day]);

  // ─── 보기 선택 ────────────────────────────────────────────────────
  const handleChoice = useCallback((choice) => {
    if (selected !== null) return;
    const isCorrect = choice === currentQuestion.answer;
    setSelected(choice);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(s => s + 1);
    if (currentQuestion.ttsText) speech.speak(currentQuestion.ttsText);

    setTimeout(() => {
      setSelected(null);
      setFeedback(null);
      if (quizIndex + 1 >= questions.length) {
        setPhase('result');
      } else {
        setQuizIndex(i => i + 1);
      }
    }, 1100);
  }, [selected, currentQuestion, quizIndex, questions.length, speech]);

  // ─── 결과 저장 ────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'result' || savedRef.current || questions.length === 0) return;
    savedRef.current = true;

    const passed = isPassing(score, questions.length);
    if (passed) {
      markDayPassed(unit.id, day, score, questions.length);
    }

    const xpEarned = passed ? score * 8 : score * 3;
    saveQuizResult({
      subject: 'english',
      unit: unit.id,
      unitTitle: `${unit.title} Day ${day}`,
      score,
      total: questions.length,
      stars: passed ? (score === questions.length ? 3 : 2) : 1,
      xpEarned,
      duration: 0,
    });
    addXp(xpEarned);
  }, [phase, score, questions.length, unit, day, saveQuizResult, addXp]);

  // ─── 다시 도전 (무제한) ──────────────────────────────────────────
  const handleRetry = () => {
    setCardIndex(0);
    setPhase('cards');
    speech.stop();
  };

  // ─── 모든 단원 완료 ───────────────────────────────────────────────
  if (alreadyAllDone) {
    return (
      <div className={styles.shell}>
        <div className={`${styles.card} ${styles.cardPass}`}>
          <div className={styles.bigEmoji}>🏆</div>
          <h2 className={styles.resultTitle}>단원 완전 정복!</h2>
          <p className={styles.resultSub}>
            {unit.icon} {unit.title} 전체 {totalDays}일 과정을 모두 마쳤어요!
          </p>
          <Link to={backTo} className={styles.primaryBtn}>단원 목록으로</Link>
        </div>
      </div>
    );
  }

  // ─── 카드 화면 ────────────────────────────────────────────────────
  if (phase === 'cards') {
    const isLast = cardIndex === newCards.length - 1;
    const progress = ((cardIndex + 1) / newCards.length) * 100;

    return (
      <div className={styles.shell}>
        <div className={styles.card}>
          {/* 헤더 */}
          <div className={styles.header}>
            <div className={styles.dayBadge}>Day {day} / {totalDays}</div>
            <span className={styles.counter}>{cardIndex + 1} / {newCards.length}</span>
          </div>

          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>

          {/* 오늘 학습 안내 (첫 카드만) */}
          {cardIndex === 0 && (
            <p className={styles.todayHint}>
              📖 오늘 배울 단어 {newCards.length}개를 먼저 살펴본 뒤 퀴즈로 확인해요.
            </p>
          )}

          {/* 카드 본문 */}
          <div className={styles.cardBody}>
            <div className={styles.cardEmoji}>{currentCard.emoji}</div>
            <p className={styles.cardWord}>{currentCard.word}</p>
            <p className={styles.cardKorean}>{currentCard.korean}</p>
            {currentCard.upperLetter && (
              <p className={styles.cardHint}>대문자: {currentCard.upperLetter}</p>
            )}
            {currentCard.family && (
              <p className={styles.cardHint}>패밀리: {currentCard.family}</p>
            )}
            {currentCard.vowel && (
              <p className={styles.cardHint}>모음: {currentCard.vowel}</p>
            )}
          </div>

          {/* TTS */}
          <button
            type="button"
            className={`${styles.ttsButton} ${speech.isSpeaking ? styles.ttsActive : ''}`}
            onClick={speakCurrent}
            disabled={!speech.isSupported}
          >
            {speech.isSpeaking ? '🔊 듣는 중...' : '🔊 발음 듣기'}
          </button>

          {/* 네비 */}
          <div className={styles.navRow}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => setCardIndex(i => Math.max(0, i - 1))}
              disabled={cardIndex === 0}
            >
              ← 이전
            </button>
            {isLast ? (
              <button type="button" className={styles.startTestBtn} onClick={startTest}>
                퀴즈 시작! 🎯
              </button>
            ) : (
              <button
                type="button"
                className={styles.navBtn}
                onClick={() => setCardIndex(i => i + 1)}
              >
                다음 →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── 테스트 화면 ──────────────────────────────────────────────────
  if (phase === 'test' && currentQuestion) {
    const quizProgress = ((quizIndex + 1) / questions.length) * 100;
    const neededToPass = Math.ceil(questions.length * PASS_THRESHOLD);

    return (
      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.dayBadge}>Day {day} · 테스트</div>
            <span className={styles.counter}>{quizIndex + 1} / {questions.length}</span>
          </div>

          <div className={styles.progressTrack}>
            <div className={`${styles.progressFill} ${styles.progressTest}`} style={{ width: `${quizProgress}%` }} />
          </div>

          <p className={styles.passInfo}>
            통과 기준: {neededToPass}/{questions.length}개 이상 ({Math.round(PASS_THRESHOLD * 100)}%)
          </p>

          <div className={styles.questionBox}>
            <p className={styles.questionText}>{currentQuestion.question}</p>
          </div>

          <div className={styles.choiceGrid}>
            {currentQuestion.choices.map(choice => {
              let state = 'default';
              if (selected !== null) {
                if (choice === currentQuestion.answer) state = 'correct';
                else if (choice === selected) state = 'wrong';
              }
              return (
                <button
                  key={choice}
                  type="button"
                  className={`${styles.choiceBtn} ${styles[`choice_${state}`]}`}
                  onClick={() => handleChoice(choice)}
                  disabled={selected !== null}
                >
                  {choice}
                </button>
              );
            })}
          </div>

          {feedback && (
            <p className={`${styles.feedbackMsg} ${styles[`feedback_${feedback}`]}`}>
              {feedback === 'correct'
                ? `🎉 정답! (${currentQuestion.korean})`
                : `❌ 정답: ${currentQuestion.answer} (${currentQuestion.korean})`}
            </p>
          )}

          <div className={styles.scoreRow}>
            현재 점수: <strong>{score}</strong> / {quizIndex + (selected ? 1 : 0)}
          </div>
        </div>
      </div>
    );
  }

  // ─── 결과 화면 ────────────────────────────────────────────────────
  if (phase === 'result') {
    const passed = isPassing(score, questions.length);
    const percent = Math.round((score / questions.length) * 100);
    const neededToPass = Math.ceil(questions.length * PASS_THRESHOLD);
    const isLastDay = day === totalDays;

    return (
      <div className={styles.shell}>
        <div className={`${styles.card} ${passed ? styles.cardPass : styles.cardFail}`}>
          <div className={styles.bigEmoji}>{passed ? (percent === 100 ? '🏆' : '🎉') : '💪'}</div>

          <h2 className={styles.resultTitle}>
            {passed ? (isLastDay ? '단원 완료! 🎊' : `Day ${day} 통과!`) : '아직 조금 더!'}
          </h2>

          <div className={styles.resultGrid}>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>점수</span>
              <strong className={styles.resultValue}>{score} / {questions.length}</strong>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>정확도</span>
              <strong className={styles.resultValue}>{percent}%</strong>
            </div>
          </div>

          {passed ? (
            <div className={styles.passMessage}>
              {isLastDay ? (
                <p>🎊 {unit.title} 단원을 모두 완료했어요!</p>
              ) : (
                <p>✅ Day {day + 1}이 열렸어요! 내일 계속 도전해요.</p>
              )}
            </div>
          ) : (
            <div className={styles.failMessage}>
              <p>
                통과 기준은 {neededToPass}개 이상이에요.<br />
                오늘 배운 카드를 다시 보고 도전해요!
              </p>
            </div>
          )}

          <div className={styles.resultActions}>
            {!passed && (
              <button type="button" className={styles.retryBtn} onClick={handleRetry}>
                다시 도전! 💪
              </button>
            )}
            <Link to={backTo} className={styles.backBtn}>
              단원 목록으로
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
