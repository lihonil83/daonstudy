import { useEffect, useRef, useState } from 'react';
import {
  buildQuestionSet,
  buildQuizResult,
  evaluateAnswer,
} from '../models/quizModel.js';
import { generateMathMixedUnit, generateEnglishMixedUnit } from '../utils/quizGenerator.js';

export function useQuiz(unit, options = {}) {
  const configuredQuestionCount = Math.max(0, options.questionCount ?? unit?.questionCount ?? 10);
  const completionBonus = options.completionBonus ?? 20;
  const perfectBonus = options.perfectBonus ?? 50;
  const advanceTimerRef = useRef(null);
  const quizStartedAtRef = useRef(Date.now());

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isShowingHint, setIsShowingHint] = useState(false);
  const [hintText, setHintText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [questionResults, setQuestionResults] = useState([]);
  const [feedbackState, setFeedbackState] = useState('idle');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [explanationText, setExplanationText] = useState('');
  const [statusText, setStatusText] = useState('정답을 골라보세요.');

  const clearAdvanceTimer = () => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  };

  const resetQuiz = () => {
    clearAdvanceTimer();
    quizStartedAtRef.current = Date.now();
    let sourceQuestions = options.questions;

    if (!sourceQuestions) {
      if (unit?.type === 'generated') {
        const { type, danList, sourceUnits } = unit.config || {};
        if (type === 'math-mixed') {
          sourceQuestions = generateMathMixedUnit(danList, configuredQuestionCount);
        } else if (type === 'english-mixed') {
          sourceQuestions = generateEnglishMixedUnit(sourceUnits, configuredQuestionCount);
        } else {
          sourceQuestions = [];
        }
      } else {
        sourceQuestions = typeof unit?.data?.generateQuestions === 'function'
          ? unit.data.generateQuestions()
          : unit?.data?.questions ?? [];
      }
    }
    const questionCount = Math.max(0, Math.min(configuredQuestionCount, sourceQuestions.length));

    if (!sourceQuestions.length) {
      setQuestions([]);
      setCurrentIndex(0);
      setScore(0);
      setAttemptCount(0);
      setIsShowingHint(false);
      setHintText('');
      setExplanationText('');
      setIsComplete(false);
      setResult(null);
      setXpEarned(0);
      setWrongAnswers([]);
      setQuestionResults([]);
      setFeedbackState('idle');
      setSelectedAnswer(null);
      setStatusText('아직 문제 데이터가 없어요.');
      return;
    }

    setQuestions(buildQuestionSet(sourceQuestions, questionCount));
    setCurrentIndex(0);
    setScore(0);
    setAttemptCount(0);
    setIsShowingHint(false);
    setHintText('');
    setExplanationText('');
    setIsComplete(false);
    setResult(null);
    setXpEarned(0);
    setWrongAnswers([]);
    setQuestionResults([]);
    setFeedbackState('idle');
    setSelectedAnswer(null);
    setStatusText('정답을 골라보세요.');
  };

  useEffect(() => {
    resetQuiz();

    return () => {
      clearAdvanceTimer();
    };
  }, [unit, options.questions, configuredQuestionCount]);

  const currentQuestion = questions[currentIndex] ?? null;
  const totalQuestions = questions.length;
  const canAnswer = Boolean(currentQuestion) && feedbackState !== 'correct' && feedbackState !== 'revealed' && !isComplete;

  const finishOrAdvance = (nextScore, nextXp, nextWrongAnswers, nextQuestionResults) => {
    clearAdvanceTimer();

    if (currentIndex >= totalQuestions - 1) {
      const duration = Math.max(1, Math.round((Date.now() - quizStartedAtRef.current) / 1000));
      const quizResult = buildQuizResult({
        score: nextScore,
        totalQuestions,
        xpEarned: nextXp,
        wrongAnswers: nextWrongAnswers,
        questionResults: nextQuestionResults,
        duration,
        completionBonus,
        perfectBonus,
      });

      setScore(nextScore);
      setXpEarned(quizResult.xpEarned);
      setWrongAnswers(nextWrongAnswers);
      setQuestionResults(nextQuestionResults);
      setIsComplete(true);
      setResult(quizResult);
      setStatusText('퀴즈가 끝났어요.');
      return;
    }

    setScore(nextScore);
    setXpEarned(nextXp);
    setWrongAnswers(nextWrongAnswers);
    setQuestionResults(nextQuestionResults);
    setCurrentIndex((value) => value + 1);
    setAttemptCount(0);
    setIsShowingHint(false);
    setHintText('');
    setExplanationText('');
    setFeedbackState('idle');
    setSelectedAnswer(null);
    setStatusText('정답을 골라보세요.');
  };

  const queueAdvance = (nextScore, nextXp, nextWrongAnswers, nextQuestionResults, delay) => {
    clearAdvanceTimer();
    advanceTimerRef.current = setTimeout(() => {
      advanceTimerRef.current = null;
      finishOrAdvance(nextScore, nextXp, nextWrongAnswers, nextQuestionResults);
    }, delay);
  };

  const submitAnswer = (answer) => {
    if (!currentQuestion || !canAnswer) return;

    setSelectedAnswer(answer);
    const evaluation = evaluateAnswer({
      question: currentQuestion,
      unit,
      answer,
      attemptCount,
      score,
      xpEarned,
      wrongAnswers,
      questionResults,
    });

    if (evaluation.branch === 'correct') {
      setFeedbackState('correct');
      setIsShowingHint(false);
      setHintText('');
      setStatusText(evaluation.statusText);
      queueAdvance(
        evaluation.nextScore,
        evaluation.nextXp,
        evaluation.nextWrongAnswers,
        evaluation.nextQuestionResults,
        900,
      );
      return;
    }

    if (evaluation.branch === 'hint') {
      setAttemptCount(evaluation.nextAttemptCount);
      setFeedbackState('wrong');
      setIsShowingHint(true);
      setHintText(evaluation.hintText);
      setStatusText(evaluation.statusText);
      return;
    }

    setFeedbackState('revealed');
    setIsShowingHint(false);
    setHintText('');
    setExplanationText(currentQuestion.explanation ?? '');
    setWrongAnswers(evaluation.nextWrongAnswers);
    setStatusText(evaluation.statusText);
    queueAdvance(
      evaluation.nextScore,
      evaluation.nextXp,
      evaluation.nextWrongAnswers,
      evaluation.nextQuestionResults,
      1300,
    );
  };

  const nextQuestion = () => {
    finishOrAdvance(score, xpEarned, wrongAnswers, questionResults);
  };

  return {
    currentQuestion,
    questionIndex: currentIndex,
    totalQuestions,
    score,
    isShowingHint,
    hintText,
    explanationText,
    attemptCount,
    isComplete,
    result,
    xpEarned,
    wrongAnswers,
    questionResults,
    feedbackState,
    selectedAnswer,
    statusText,
    canAnswer,
    submitAnswer,
    nextQuestion,
    restart: resetQuiz,
  };
}
