import { useState, useCallback } from 'react';
import { generateQuizWithGemini, getGeminiApiKey } from '../services/geminiService';

/**
 * Gemini API를 통해 퀴즈를 생성하는 커스텀 훅입니다.
 * 로딩, 에러, 생성된 문제 목록 상태를 관리합니다.
 */
export function useGeneratedQuiz() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  const hasApiKey = Boolean(getGeminiApiKey());

  const generateQuiz = useCallback(async (curriculumId, promptTemplate) => {
    setIsLoading(true);
    setError(null);
    setGeneratedQuestions([]);

    try {
      const result = await generateQuizWithGemini(curriculumId, promptTemplate);
      setGeneratedQuestions(result.questions);
      return { success: true, questions: result.questions };
    } catch (err) {
      const msg = err.message === 'GEMINI_API_KEY_MISSING' 
        ? 'api_key_missing' 
        : (err.message || '문제 생성에 실패했습니다.');
      
      setError(msg);
      return { success: false, errorMessage: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearGenerated = useCallback(() => {
    setGeneratedQuestions([]);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    generatedQuestions,
    hasApiKey,
    generateQuiz,
    clearGenerated,
  };
}
