import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizSession from '../../components/Quiz/QuizSession';

/**
 * Gemini API로 생성된 퀴즈를 실행하는 페이지입니다.
 * sessionStorage에서 문제 데이터를 읽어 QuizSession에 전달합니다.
 */
export default function GeneratedQuiz() {
  const navigate = useNavigate();

  const quizData = useMemo(() => {
    try {
      const raw = sessionStorage.getItem('generatedQuizData');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!quizData) {
      navigate('/roadmap');
    }
  }, [quizData, navigate]);

  if (!quizData) return null;

  // QuizSession이 기대하는 unit 형식으로 변환
  // type을 'gemini'로 설정 → useQuiz가 unit.data.questions를 직접 사용하게 함
  const unit = {
    id: quizData.curriculumId,
    title: quizData.title,
    description: quizData.description,
    subject: quizData.subject,
    available: true,
    type: 'gemini',  // 'generated'가 아님! useQuiz의 자체 생성기를 건너뜁니다.
    data: { questions: quizData.questions },
  };

  return (
    <QuizSession
      unit={unit}
      accent={quizData.subject === 'math' ? 'math' : 'english'}
      backTo="/roadmap"
    />
  );
}
