import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../../hooks/useProgress';
import { useReward } from '../../hooks/useReward';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import styles from './FlashcardSession.module.css';

// ─── 퀴즈 문제 생성 ────────────────────────────────────────────────────
function generateQuestions(unit) {
  const { cards, quizMode, quizCount = 10 } = unit;
  const count = Math.min(quizCount, cards.length);
  const shuffled = [...cards].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, count);

  return picked.map(card => {
    // 오답 후보: 현재 카드 제외하고 3개 랜덤 선택
    const wrongPool = cards.filter(c => c.id !== card.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    let question, choices, answer, ttsText;

    if (quizMode === 'pick-letter') {
      // 이모지 보고 첫 글자(대문자) 고르기
      question = `${card.emoji}  "${card.word}" 의 첫 글자는?`;
      answer = card.letter.toUpperCase();
      const wrongLetters = wrongPool.map(c => c.letter.toUpperCase());
      choices = [answer, ...wrongLetters].sort(() => Math.random() - 0.5);
      ttsText = card.word;
    } else if (quizMode === 'pick-lower') {
      // 대문자 보고 소문자 고르기
      question = `대문자 "${card.upperLetter}" 의 소문자는?`;
      answer = card.letter;
      const wrongLetters = wrongPool.map(c => c.letter);
      choices = [answer, ...wrongLetters].sort(() => Math.random() - 0.5);
      ttsText = card.word;
    } else {
      // pick-word: 이모지 보고 영어 단어 고르기
      question = `${card.emoji}  이 그림의 이름은?`;
      answer = card.word;
      const wrongWords = wrongPool.map(c => c.word);
      choices = [answer, ...wrongWords].sort(() => Math.random() - 0.5);
      ttsText = card.word;
    }

    return { id: card.id, question, choices, answer, ttsText, emoji: card.emoji, korean: card.korean };
  });
}

// ─── 컴포넌트 ───────────────────────────────────────────────────────────
export default function FlashcardSession({ unit, backTo = '/english' }) {
  const { saveQuizResult } = useProgress();
  const { addXp, checkBadges } = useReward();
  const speech = useSpeechSynthesis();

  // phase: 'cards' | 'quiz' | 'result'
  const [phase, setPhase] = useState('cards');
  const [cardIndex, setCardIndex] = useState(0);

  // 퀴즈 상태
  const [questions, setQuestions] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);   // 선택한 보기
  const [feedback, setFeedback] = useState(null);   // 'correct' | 'wrong'
  const savedRef = useRef(false);

  const cards = unit.cards;
  const currentCard = cards[cardIndex];
  const currentQuestion = questions[quizIndex];

  // ─── 카드 TTS ─────────────────────────────────────────────────────
  const speakCard = useCallback(() => {
    if (currentCard?.word) speech.speak(currentCard.word);
  }, [currentCard, speech]);

  // 카드 바뀔 때 자동 발음 (선택 사항 — 끊기지 않게 첫 카드만)
  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) { isFirstMount.current = false; return; }
    speech.stop();
  }, [cardIndex]);

  // ─── 카드 → 퀴즈 전환 ────────────────────────────────────────────
  const startQuiz = useCallback(() => {
    const qs = generateQuestions(unit);
    setQuestions(qs);
    setPhase('quiz');
  }, [unit]);

  // ─── 퀴즈: 보기 선택 ─────────────────────────────────────────────
  const handleChoiceSelect = useCallback((choice) => {
    if (selected !== null) return; // 이미 선택함
    const isCorrect = choice === currentQuestion.answer;
    setSelected(choice);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(s => s + 1);

    // TTS: 정답 단어 읽기
    if (currentQuestion.ttsText) speech.speak(currentQuestion.ttsText);

    // 1초 후 다음 문제 or 결과
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

  // ─── 결과 저장 (한 번만) ─────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'result' || savedRef.current) return;
    savedRef.current = true;
    const xpEarned = score * 5;
    saveQuizResult({
      subject: 'english',
      unit: unit.id,
      unitTitle: unit.title,
      score,
      total: questions.length,
      stars: score >= questions.length * 0.9 ? 3 : score >= questions.length * 0.7 ? 2 : 1,
      xpEarned,
      duration: 0,
    });
    addXp(xpEarned);
    checkBadges({ type: 'quiz', subject: 'english', unitId: unit.id });
  }, [phase, score, questions.length, unit, saveQuizResult, addXp, checkBadges]);

  // ─── 다시 하기 ────────────────────────────────────────────────────
  const handleRestart = () => {
    savedRef.current = false;
    setPhase('cards');
    setCardIndex(0);
    setQuizIndex(0);
    setScore(0);
    setSelected(null);
    setFeedback(null);
    setQuestions([]);
  };

  // ─── 렌더: 카드 ──────────────────────────────────────────────────
  if (phase === 'cards') {
    const isLast = cardIndex === cards.length - 1;
    const progress = ((cardIndex + 1) / cards.length) * 100;

    return (
      <div className={styles.shell}>
        <div className={styles.card}>
          {/* 헤더 */}
          <div className={styles.header}>
            <span className={styles.unitLabel}>{unit.icon} {unit.title}</span>
            <span className={styles.counter}>{cardIndex + 1} / {cards.length}</span>
          </div>

          {/* 진행 바 */}
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>

          {/* 카드 본문 */}
          <div className={styles.cardBody}>
            <div className={styles.cardEmoji}>{currentCard.emoji}</div>
            <p className={styles.cardWord}>{currentCard.word}</p>
            {unit.showKorean && (
              <p className={styles.cardKorean}>{currentCard.korean}</p>
            )}
            {/* 소문자 단원: 대문자 짝 표시 */}
            {currentCard.upperLetter && (
              <p className={styles.cardPair}>대문자: {currentCard.upperLetter}</p>
            )}
            {/* 파닉스 단원: 패밀리/모음 표시 */}
            {currentCard.family && (
              <p className={styles.cardHint}>패밀리: {currentCard.family}</p>
            )}
            {currentCard.vowel && (
              <p className={styles.cardHint}>모음: {currentCard.vowel}</p>
            )}
          </div>

          {/* TTS 버튼 */}
          <button
            type="button"
            className={`${styles.ttsButton} ${speech.isSpeaking ? styles.ttsActive : ''}`}
            onClick={speakCard}
            disabled={!speech.isSupported}
          >
            {speech.isSpeaking ? '🔊 듣는 중...' : '🔊 발음 듣기'}
          </button>

          {/* 네비게이션 */}
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
              <button type="button" className={styles.startQuizBtn} onClick={startQuiz}>
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

  // ─── 렌더: 퀴즈 ──────────────────────────────────────────────────
  if (phase === 'quiz' && currentQuestion) {
    const quizProgress = ((quizIndex + 1) / questions.length) * 100;

    return (
      <div className={styles.shell}>
        <div className={styles.card}>
          {/* 헤더 */}
          <div className={styles.header}>
            <span className={styles.unitLabel}>🎯 퀴즈</span>
            <span className={styles.counter}>{quizIndex + 1} / {questions.length}</span>
          </div>

          {/* 진행 바 */}
          <div className={styles.progressTrack}>
            <div className={`${styles.progressFill} ${styles.progressQuiz}`} style={{ width: `${quizProgress}%` }} />
          </div>

          {/* 점수 */}
          <div className={styles.scoreRow}>
            <span>현재 점수: <strong>{score}</strong></span>
          </div>

          {/* 문제 */}
          <div className={styles.questionBox}>
            <p className={styles.questionText}>{currentQuestion.question}</p>
          </div>

          {/* 보기 */}
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
                  onClick={() => handleChoiceSelect(choice)}
                  disabled={selected !== null}
                >
                  {choice}
                </button>
              );
            })}
          </div>

          {/* 피드백 메시지 */}
          {feedback && (
            <p className={`${styles.feedbackMsg} ${styles[`feedback_${feedback}`]}`}>
              {feedback === 'correct' ? '🎉 정답!' : `❌ 정답: ${currentQuestion.answer}`}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ─── 렌더: 결과 ──────────────────────────────────────────────────
  if (phase === 'result') {
    const percent = Math.round((score / questions.length) * 100);
    const stars = percent >= 90 ? '⭐⭐⭐' : percent >= 70 ? '⭐⭐' : '⭐';
    const xp = score * 5;

    return (
      <div className={styles.shell}>
        <div className={styles.card}>
          <p className={styles.unitLabel}>✅ 완료! {unit.icon} {unit.title}</p>
          <div className={styles.resultEmoji}>{percent >= 80 ? '🏆' : '💪'}</div>
          <div className={styles.resultGrid}>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>점수</span>
              <strong className={styles.resultValue}>{score} / {questions.length}</strong>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>정확도</span>
              <strong className={styles.resultValue}>{percent}%</strong>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>별</span>
              <strong className={styles.resultValue}>{stars}</strong>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>획득 XP</span>
              <strong className={styles.resultValue}>+{xp}</strong>
            </div>
          </div>

          <div className={styles.resultActions}>
            <button type="button" className={styles.primaryBtn} onClick={handleRestart}>
              처음부터 다시
            </button>
            <Link to={backTo} className={styles.secondaryBtn}>
              단원 목록으로
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
