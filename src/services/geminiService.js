import { readStorageJSON, writeStorageJSON } from '../utils/storage';
import { GEMINI_API_KEY } from '../config/storageKeys';
import { isLocalGeneratorSupported, generateLocalQuiz } from '../utils/localGenerator';

// 생성된 퀴즈를 캐싱할 스토리지 키 접두사 (eduapp_ 포함)
const CACHE_PREFIX = 'generated_quiz_';

/**
 * 저장된 Gemini API 키를 가져옵니다.
 */
export function getGeminiApiKey() {
  // 1. 새 표준 키로 읽기
  let key = readStorageJSON(GEMINI_API_KEY, '');

  // 2. 만약 새 키가 없고 이전 키(접두사 없는 버전)가 있다면 마이그레이션
  if (!key) {
    const oldKey = localStorage.getItem('gemini_api_key');
    if (oldKey) {
      // 이전 키가 'AIza'로 시작하는지(따옴표 포함 가능) 확인 후 저장
      const cleanKey = oldKey.replace(/"/g, ''); 
      saveGeminiApiKey(cleanKey);
      localStorage.removeItem('gemini_api_key');
      key = cleanKey;
    }
  }

  return key || '';
}

/**
 * Gemini API 키를 저장합니다.
 */
export function saveGeminiApiKey(key) {
  writeStorageJSON(GEMINI_API_KEY, key);
}

/**
 * 캐시에서 생성된 퀴즈를 가져옵니다.
 */
function loadCachedQuiz(curriculumId) {
  return readStorageJSON(CACHE_PREFIX + curriculumId, null);
}

/**
 * 생성된 퀴즈를 캐시에 저장합니다.
 */
function saveCachedQuiz(curriculumId, questions) {
  writeStorageJSON(CACHE_PREFIX + curriculumId, questions);
}

/**
 * Gemini API에 보낼 최종 프롬프트를 구성합니다.
 * 출력이 반드시 JSON 배열로 올 수 있도록 지시합니다.
 */
function buildSystemPrompt(userPrompt) {
  return `
당신은 초등학교 학습 퀴즈 문제 생성 전문가입니다.
다음 조건을 반드시 지켜서 퀴즈를 만들어 주세요.

[조건]
- 문제 수: 10개
- 형식: 4지선다 (객관식)
- 대상: 한국 초등학생
- 언어: 한국어 (영어 단어 퀴즈 제외)
- 설명: 없음(코드블록 없이 순수 JSON만 출력)
- 응답 형식: JSON 배열, 아래 스키마를 반드시 따를 것

[JSON 스키마]
[
  {
    "id": "gen-[고유숫자]",
    "type": "multiple-choice",
    "question": "문제 텍스트",
    "choices": [정답포함 4개 선택지 배열, 숫자 또는 문자열],
    "answer": "정답 (choices 중 하나와 정확히 일치)",
    "hints": ["힌트1", "힌트2"],
    "explanation": "왜 정답인지 초등학생이 이해하기 쉽게 설명"
  }
]

[생성 요청]
${userPrompt}
`.trim();
}

/**
 * Gemini API를 호출하여 퀴즈를 생성합니다.
 * 캐시가 있으면 API를 호출하지 않고 캐시를 반환합니다.
 */
export async function generateQuizWithGemini(curriculumId, promptTemplate) {
  // 0. 로컬 생성기 지원 여부 확인
  if (isLocalGeneratorSupported(curriculumId)) {
    const questions = await generateLocalQuiz(curriculumId);
    return { questions, fromCache: false, isLocal: true };
  }

  // 1. 캐시 확인 (이미 생성된 퀴즈가 있으면 재사용)
  const cached = loadCachedQuiz(curriculumId);
  if (cached && cached.length > 0) {
    return { questions: cached, fromCache: true };
  }

  // 2. API 키 확인
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY_MISSING');
  }

  // 3. Gemini API 호출
  const prompt = buildSystemPrompt(promptTemplate);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    console.error('Gemini API Error Detail:', errorBody);
    throw new Error(errorBody?.error?.message || `API 호출 실패 (${response.status})`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // 4. JSON 파싱 (응답에서 순수 JSON 배열 추출)
  const jsonMatch = rawText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('응답에서 JSON을 파싱할 수 없습니다.');
  }

  const questions = JSON.parse(jsonMatch[0]);

  // 5. 캐시에 저장 (다음에 같은 단원을 클릭하면 API 호출 없이 사용)
  saveCachedQuiz(curriculumId, questions);

  return { questions, fromCache: false };
}

/**
 * API 키가 유효한지 간단히 테스트합니다.
 */
export async function testGeminiConnection(apiKey) {
  if (!apiKey) throw new Error('API 키가 입력되지 않았습니다.');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: '안녕! 너는 누구니? 한 문장으로 대답해.' }] }],
        generationConfig: { maxOutputTokens: 20 },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody?.error?.message || '인증 실패');
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || '연결 성공';
  } catch (err) {
    console.error('Connection Test Failed:', err);
    throw err;
  }
}

/**
 * 사용 가능한 Gemini 모델 목록을 가져옵니다.
 */
export async function getAvailableModels(apiKey) {
  if (!apiKey) throw new Error('API 키가 필요합니다.');

  // v1beta를 기본값으로 사용하여 최신 모델(2.5 시리즈 등)의 지원 목록까지 포괄
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody?.error?.message || '모델 목록 조회 실패');
    }

    const data = await response.json();
    // 모델명(name)만 추출하여 반환 (예: models/gemini-1.5-flash)
    return data?.models || [];
  } catch (err) {
    console.error('List Models Failed:', err);
    throw err;
  }
}
