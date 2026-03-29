/**
 * 대한민국 초등학교 수학 교육과정 (일일수학 & 모두매쓰 & 칸아카데미 기준 전 단원)
 * 1학년부터 6학년까지의 전 단원을 구성합니다.
 */

export const SUBJECTS = {
  math:    { id: 'math',    label: '수학', icon: '🔢', color: '#4f8ef7' },
  english: { id: 'english', label: '영어', icon: '🔤', color: '#f7914f' },
};

// 외부 학습 리소스 URL
const LINKS = {
  illil: 'https://11math.com',
  modoo: 'https://modoo-math.com',
  khan:  'https://ko.khanacademy.org/math',
};

// 학년별 칸아카데미 URL
const KHAN = {
  1: `${LINKS.khan}/cc-1st-grade-math`,
  2: `${LINKS.khan}/cc-2nd-grade-math`,
  3: `${LINKS.khan}/cc-third-grade-math`,
  4: `${LINKS.khan}/cc-fourth-grade-math`,
  5: `${LINKS.khan}/cc-fifth-grade-math`,
  6: `${LINKS.khan}/cc-sixth-grade-math`,
};

/**
 * 수학 단원 외부 학습 자료 3종 생성
 * illil: 일일수학 (단원별 직접 링크)
 * modoo: 모두매쓰 (학년 페이지)
 * khan: 칸아카데미 한국어 (학년 페이지)
 */
function mathRes(grade, semester, chapter) {
  return [
    {
      type: 'link',
      label: `✏️ 일일수학 (${grade}학년 ${semester}학기 ${chapter}단원)`,
      url: LINKS.illil,
      provider: 'illil',
    },
    {
      type: 'link',
      label: `📐 모두매쓰 ${grade}학년`,
      url: LINKS.modoo,
      provider: 'modoo',
    },
    {
      type: 'link',
      label: `🎮 칸아카데미 ${grade}학년`,
      url: KHAN[grade],
      provider: 'khan',
    },
  ];
}

// 프롬프트 공통 지시사항
const KR_PROMPT_SUFFIX = '\n[중요] 반드시 대한민국 초등학교 수학 교육과정(2022 개정) 기준으로 출제하세요. 문제와 선택지는 모두 한국어로 작성하세요. 10문제를 4지선다로 만들어줘.';
const EN_PROMPT_SUFFIX = '\n[중요] 아동용 기초 영어 학습이므로 "문제와 선택지"는 반드시 영어로 작성하세요. 다만, 해설은 한국어로 작성하세요.';

export const CURRICULUM = [
  // ==========================================
  // 1학년 수학
  // ==========================================
  { id: 'g1-m-1-1', grade: 1, semester: 1, subject: 'math', icon: '🔢', title: '9까지의 수',      description: '1부터 9까지의 수를 읽고 써봐요.',          promptTemplate: '초등 1학년 1학기 1. 9까지의 수.' + KR_PROMPT_SUFFIX,           resources: mathRes(1, 1, 1) },
  { id: 'g1-m-1-2', grade: 1, semester: 1, subject: 'math', icon: '🔷', title: '여러 가지 모양', description: '동그라미, 세모, 네모 모양 찾기.',               promptTemplate: '초등 1학년 1학기 2. 여러 가지 모양.' + KR_PROMPT_SUFFIX,        resources: mathRes(1, 1, 2) },
  { id: 'g1-m-1-3', grade: 1, semester: 1, subject: 'math', icon: '➕', title: '덧셈과 뺄셈',    description: '한 자리 수의 덧셈과 뺄셈.',                promptTemplate: '초등 1학년 1학기 3. 덧셈과 뺄셈.' + KR_PROMPT_SUFFIX,          resources: mathRes(1, 1, 3) },
  { id: 'g1-m-1-4', grade: 1, semester: 1, subject: 'math', icon: '⚖️', title: '비교하기',       description: '길이, 무게, 넓이 비교.',                   promptTemplate: '초등 1학년 1학기 4. 비교하기.' + KR_PROMPT_SUFFIX,             resources: mathRes(1, 1, 4) },
  { id: 'g1-m-1-5', grade: 1, semester: 1, subject: 'math', icon: '🔢', title: '50까지의 수',    description: '50까지의 수 읽기와 세기.',                  promptTemplate: '초등 1학년 1학기 5. 50까지의 수.' + KR_PROMPT_SUFFIX,          resources: mathRes(1, 1, 5) },

  { id: 'g1-m-2-1', grade: 1, semester: 2, subject: 'math', icon: '💯', title: '100까지의 수',   description: '100까지의 수 읽기와 크기 비교.',             promptTemplate: '초등 1학년 2학기 1. 100까지의 수.' + KR_PROMPT_SUFFIX,         resources: mathRes(1, 2, 1) },
  { id: 'g1-m-2-2', grade: 1, semester: 2, subject: 'math', icon: '➕', title: '덧셈과 뺄셈(1)', description: '받아올림 없는 덧셈과 뺄셈.',                promptTemplate: '초등 1학년 2학기 2. 덧셈과 뺄셈(1).' + KR_PROMPT_SUFFIX,      resources: mathRes(1, 2, 2) },
  { id: 'g1-m-2-3', grade: 1, semester: 2, subject: 'math', icon: '🧩', title: '여러 가지 모양', description: '여러 가지 모양으로 만들기.',                 promptTemplate: '초등 1학년 2학기 3. 여러 가지 모양.' + KR_PROMPT_SUFFIX,       resources: mathRes(1, 2, 3) },
  { id: 'g1-m-2-4', grade: 1, semester: 2, subject: 'math', icon: '➕', title: '덧셈과 뺄셈(2)', description: '세 수의 덧셈과 뺄셈.',                      promptTemplate: '초등 1학년 2학기 4. 덧셈과 뺄셈(2).' + KR_PROMPT_SUFFIX,      resources: mathRes(1, 2, 4) },
  { id: 'g1-m-2-5', grade: 1, semester: 2, subject: 'math', icon: '🕐', title: '시계 보기와 규칙', description: '시각 읽기와 규칙 찾기.',                  promptTemplate: '초등 1학년 2학기 5. 시계 보기와 규칙 찾기.' + KR_PROMPT_SUFFIX, resources: mathRes(1, 2, 5) },
  { id: 'g1-m-2-6', grade: 1, semester: 2, subject: 'math', icon: '➕', title: '덧셈과 뺄셈(3)', description: '10을 이용한 덧셈과 뺄셈.',                  promptTemplate: '초등 1학년 2학기 6. 덧셈과 뺄셈(3).' + KR_PROMPT_SUFFIX,      resources: mathRes(1, 2, 6) },

  // ==========================================
  // 2학년 수학
  // ==========================================
  { id: 'g2-m-1-1', grade: 2, semester: 1, subject: 'math', icon: '🔢', title: '세 자리 수',     description: '세 자리 수 읽기와 자릿값.',                promptTemplate: '초등 2학년 1학기 1. 세 자리 수.' + KR_PROMPT_SUFFIX,           resources: mathRes(2, 1, 1) },
  { id: 'g2-m-1-2', grade: 2, semester: 1, subject: 'math', icon: '🔷', title: '여러 가지 도형', description: '삼각형, 사각형, 원의 성질.',                promptTemplate: '초등 2학년 1학기 2. 여러 가지 도형.' + KR_PROMPT_SUFFIX,       resources: mathRes(2, 1, 2) },
  { id: 'g2-m-1-3', grade: 2, semester: 1, subject: 'math', icon: '➕', title: '덧셈과 뺄셈',    description: '받아올림/내림이 있는 덧셈 뺄셈.',           promptTemplate: '초등 2학년 1학기 3. 덧셈과 뺄셈.' + KR_PROMPT_SUFFIX,          resources: mathRes(2, 1, 3) },
  { id: 'g2-m-1-4', grade: 2, semester: 1, subject: 'math', icon: '📏', title: '길이 재기',      description: 'cm 단위로 길이 재기.',                     promptTemplate: '초등 2학년 1학기 4. 길이 재기.' + KR_PROMPT_SUFFIX,            resources: mathRes(2, 1, 4), unitId: 'length-units' },
  { id: 'g2-m-1-5', grade: 2, semester: 1, subject: 'math', icon: '📁', title: '분류하기',       description: '기준에 따라 분류하기.',                    promptTemplate: '초등 2학년 1학기 5. 분류하기.' + KR_PROMPT_SUFFIX,             resources: mathRes(2, 1, 5) },
  { id: 'g2-m-1-6', grade: 2, semester: 1, subject: 'math', icon: '✖️', title: '곱셈',           description: '곱셈의 개념 이해.',                        promptTemplate: '초등 2학년 1학기 6. 곱셈.' + KR_PROMPT_SUFFIX,                resources: mathRes(2, 1, 6) },

  { id: 'g2-m-2-1', grade: 2, semester: 2, subject: 'math', icon: '🔢', title: '네 자리 수',     description: '네 자리 수 읽기와 크기 비교.',              promptTemplate: '초등 2학년 2학기 1. 네 자리 수.' + KR_PROMPT_SUFFIX,           resources: mathRes(2, 2, 1) },
  { id: 'g2-m-2-2', grade: 2, semester: 2, subject: 'math', icon: '✖️', title: '구구단',         description: '곱셈구구 마스터하기.',                     promptTemplate: '초등 2학년 2학기 2. 곱셈구구.' + KR_PROMPT_SUFFIX,            resources: mathRes(2, 2, 2), unitId: 'multiplication-2' },
  { id: 'g2-m-2-3', grade: 2, semester: 2, subject: 'math', icon: '📏', title: '길이 재기(m)',   description: 'm와 cm의 관계 이해.',                      promptTemplate: '초등 2학년 2학기 3. 길이 재기.' + KR_PROMPT_SUFFIX,            resources: mathRes(2, 2, 3) },
  { id: 'g2-m-2-4', grade: 2, semester: 2, subject: 'math', icon: '⏰', title: '시각과 시간',    description: '몇 시 몇 분 읽기와 시간 계산.',             promptTemplate: '초등 2학년 2학기 4. 시각과 시간.' + KR_PROMPT_SUFFIX,          resources: mathRes(2, 2, 4), unitId: 'clock-reading' },
  { id: 'g2-m-2-5', grade: 2, semester: 2, subject: 'math', icon: '📊', title: '표와 그래프',    description: '자료를 표와 그래프로 나타내기.',             promptTemplate: '초등 2학년 2학기 5. 표와 그래프.' + KR_PROMPT_SUFFIX,          resources: mathRes(2, 2, 5) },
  { id: 'g2-m-2-6', grade: 2, semester: 2, subject: 'math', icon: '🔄', title: '규칙 찾기',      description: '다양한 규칙 발견하기.',                    promptTemplate: '초등 2학년 2학기 6. 규칙 찾기.' + KR_PROMPT_SUFFIX,            resources: mathRes(2, 2, 6) },

  // ==========================================
  // 3학년 수학
  // ==========================================
  { id: 'g3-m-1-1', grade: 3, semester: 1, subject: 'math', icon: '➕', title: '덧셈과 뺄셈',    description: '세 자리 수 연산.',                         promptTemplate: '초등 3학년 1학기 1. 덧셈과 뺄셈.' + KR_PROMPT_SUFFIX,         resources: mathRes(3, 1, 1) },
  { id: 'g3-m-1-2', grade: 3, semester: 1, subject: 'math', icon: '📐', title: '평면도형',       description: '선분, 직선, 각, 직각삼각형.',               promptTemplate: '초등 3학년 1학기 2. 평면도형.' + KR_PROMPT_SUFFIX,             resources: mathRes(3, 1, 2) },
  { id: 'g3-m-1-3', grade: 3, semester: 1, subject: 'math', icon: '➗', title: '나눗셈',         description: '나눗셈의 기초.',                           promptTemplate: '초등 3학년 1학기 3. 나눗셈.' + KR_PROMPT_SUFFIX,              resources: mathRes(3, 1, 3) },
  { id: 'g3-m-1-4', grade: 3, semester: 1, subject: 'math', icon: '✖️', title: '곱셈',           description: '두 자리 수 곱하기 한 자리 수.',             promptTemplate: '초등 3학년 1학기 4. 곱셈.' + KR_PROMPT_SUFFIX,                resources: mathRes(3, 1, 4) },
  { id: 'g3-m-1-5', grade: 3, semester: 1, subject: 'math', icon: '⏲️', title: '길이와 시간',    description: 'mm, km 단위와 시간 계산.',                  promptTemplate: '초등 3학년 1학기 5. 길이와 시간.' + KR_PROMPT_SUFFIX,          resources: mathRes(3, 1, 5) },
  { id: 'g3-m-1-6', grade: 3, semester: 1, subject: 'math', icon: '½',  title: '분수와 소수',    description: '분수와 소수의 도입.',                      promptTemplate: '초등 3학년 1학기 6. 분수와 소수.' + KR_PROMPT_SUFFIX,          resources: mathRes(3, 1, 6) },

  { id: 'g3-m-2-1', grade: 3, semester: 2, subject: 'math', icon: '✖️', title: '곱셈',           description: '세 자리 수 연산 및 두 자리 수 곱셈.',        promptTemplate: '초등 3학년 2학기 1. 곱셈.' + KR_PROMPT_SUFFIX,                resources: mathRes(3, 2, 1) },
  { id: 'g3-m-2-2', grade: 3, semester: 2, subject: 'math', icon: '➗', title: '나눗셈',         description: '내림이 있는 나눗셈.',                      promptTemplate: '초등 3학년 2학기 2. 나눗셈.' + KR_PROMPT_SUFFIX,              resources: mathRes(3, 2, 2) },
  { id: 'g3-m-2-3', grade: 3, semester: 2, subject: 'math', icon: '⭕', title: '원',             description: '원의 중심, 반지름, 지름.',                  promptTemplate: '초등 3학년 2학기 3. 원.' + KR_PROMPT_SUFFIX,                  resources: mathRes(3, 2, 3) },
  { id: 'g3-m-2-4', grade: 3, semester: 2, subject: 'math', icon: '½',  title: '분수',           description: '진분수, 가분수, 대분수.',                   promptTemplate: '초등 3학년 2학기 4. 분수.' + KR_PROMPT_SUFFIX,                resources: mathRes(3, 2, 4) },
  { id: 'g3-m-2-5', grade: 3, semester: 2, subject: 'math', icon: '⚖️', title: '들이와 무게',    description: '들이와 무게 단위 및 연산.',                 promptTemplate: '초등 3학년 2학기 5. 들이와 무게.' + KR_PROMPT_SUFFIX,          resources: mathRes(3, 2, 5) },
  { id: 'g3-m-2-6', grade: 3, semester: 2, subject: 'math', icon: '📊', title: '자료의 정리',    description: '그림그래프와 자료 수집.',                   promptTemplate: '초등 3학년 2학기 6. 자료의 정리.' + KR_PROMPT_SUFFIX,          resources: mathRes(3, 2, 6) },

  // ==========================================
  // 4학년 수학
  // ==========================================
  { id: 'g4-m-1-1', grade: 4, semester: 1, subject: 'math', icon: '🔭', title: '큰 수',          description: '억, 조 단위의 수.',                        promptTemplate: '초등 4학년 1학기 1. 큰 수.' + KR_PROMPT_SUFFIX,               resources: mathRes(4, 1, 1) },
  { id: 'g4-m-1-2', grade: 4, semester: 1, subject: 'math', icon: '📐', title: '각도',           description: '각의 크기와 각도기 사용.',                  promptTemplate: '초등 4학년 1학기 2. 각도.' + KR_PROMPT_SUFFIX,                resources: mathRes(4, 1, 2) },
  { id: 'g4-m-1-3', grade: 4, semester: 1, subject: 'math', icon: '✖️', title: '곱셈과 나눗셈',  description: '세 자리 수와 두 자리 수 연산.',              promptTemplate: '초등 4학년 1학기 3. 곱셈과 나눗셈.' + KR_PROMPT_SUFFIX,       resources: mathRes(4, 1, 3) },
  { id: 'g4-m-1-4', grade: 4, semester: 1, subject: 'math', icon: '🔄', title: '평면도형의 이동', description: '밀기, 뒤집기, 돌리기.',                     promptTemplate: '초등 4학년 1학기 4. 평면도형의 이동.' + KR_PROMPT_SUFFIX,     resources: mathRes(4, 1, 4) },
  { id: 'g4-m-1-5', grade: 4, semester: 1, subject: 'math', icon: '📊', title: '막대그래프',     description: '막대그래프 해석과 그리기.',                 promptTemplate: '초등 4학년 1학기 5. 막대그래프.' + KR_PROMPT_SUFFIX,           resources: mathRes(4, 1, 5) },
  { id: 'g4-m-1-6', grade: 4, semester: 1, subject: 'math', icon: '🔄', title: '규칙 찾기',      description: '수의 배열 및 계산식 규칙.',                 promptTemplate: '초등 4학년 1학기 6. 규칙 찾기.' + KR_PROMPT_SUFFIX,            resources: mathRes(4, 1, 6) },

  { id: 'g4-m-2-1', grade: 4, semester: 2, subject: 'math', icon: '➕', title: '분수의 덧셈 뺄셈', description: '분모가 같은 분수 연산.',                  promptTemplate: '초등 4학년 2학기 1. 분수의 덧셈과 뺄셈.' + KR_PROMPT_SUFFIX, resources: mathRes(4, 2, 1) },
  { id: 'g4-m-2-2', grade: 4, semester: 2, subject: 'math', icon: '🔺', title: '삼각형',         description: '이등변, 정삼각형, 직각삼각형.',             promptTemplate: '초등 4학년 2학기 2. 삼각형.' + KR_PROMPT_SUFFIX,              resources: mathRes(4, 2, 2) },
  { id: 'g4-m-2-3', grade: 4, semester: 2, subject: 'math', icon: '➕', title: '소수의 덧셈 뺄셈', description: '소수 두 자리 수 연산.',                    promptTemplate: '초등 4학년 2학기 3. 소수의 덧셈과 뺄셈.' + KR_PROMPT_SUFFIX, resources: mathRes(4, 2, 3) },
  { id: 'g4-m-2-4', grade: 4, semester: 2, subject: 'math', icon: '⬛', title: '사각형',         description: '평행사변형, 마름모, 사다리꼴.',             promptTemplate: '초등 4학년 2학기 4. 사각형.' + KR_PROMPT_SUFFIX,              resources: mathRes(4, 2, 4) },
  { id: 'g4-m-2-5', grade: 4, semester: 2, subject: 'math', icon: '📈', title: '꺾은선그래프',   description: '변화하는 양을 나타내기.',                   promptTemplate: '초등 4학년 2학기 5. 꺾은선그래프.' + KR_PROMPT_SUFFIX,        resources: mathRes(4, 2, 5) },
  { id: 'g4-m-2-6', grade: 4, semester: 2, subject: 'math', icon: '💠', title: '다각형',         description: '다각형, 정다각형, 대각선.',                 promptTemplate: '초등 4학년 2학기 6. 다각형.' + KR_PROMPT_SUFFIX,              resources: mathRes(4, 2, 6) },

  // ==========================================
  // 5학년 수학
  // ==========================================
  { id: 'g5-m-1-1', grade: 5, semester: 1, subject: 'math', icon: '⚙️', title: '혼합 계산',      description: '자연수의 사칙연산 혼합.',                   promptTemplate: '초등 5학년 1학기 1. 자연수의 혼합 계산.' + KR_PROMPT_SUFFIX,  resources: mathRes(5, 1, 1) },
  { id: 'g5-m-1-2', grade: 5, semester: 1, subject: 'math', icon: '🔍', title: '약수와 배수',    description: '약수, 배수, 공약수, 공배수.',               promptTemplate: '초등 5학년 1학기 2. 약수와 배수.' + KR_PROMPT_SUFFIX,          resources: mathRes(5, 1, 2) },
  { id: 'g5-m-1-3', grade: 5, semester: 1, subject: 'math', icon: '🔄', title: '규칙과 대응',    description: '두 양 사이의 관계 찾기.',                   promptTemplate: '초등 5학년 1학기 3. 규칙과 대응.' + KR_PROMPT_SUFFIX,          resources: mathRes(5, 1, 3) },
  { id: 'g5-m-1-4', grade: 5, semester: 1, subject: 'math', icon: '⚖️', title: '약분과 통분',    description: '분수 크기 비교와 기약분수.',                promptTemplate: '초등 5학년 1학기 4. 약분과 통분.' + KR_PROMPT_SUFFIX,          resources: mathRes(5, 1, 4) },
  { id: 'g5-m-1-5', grade: 5, semester: 1, subject: 'math', icon: '➕', title: '분수의 덧셈 뺄셈', description: '분모가 다른 분수 연산.',                   promptTemplate: '초등 5학년 1학기 5. 분수의 덧셈과 뺄셈.' + KR_PROMPT_SUFFIX, resources: mathRes(5, 1, 5) },
  { id: 'g5-m-1-6', grade: 5, semester: 1, subject: 'math', icon: '📐', title: '다각형의 둘레 넓이', description: '삼각형, 사각형의 넓이 공식.',              promptTemplate: '초등 5학년 1학기 6. 다각형의 둘레와 넓이.' + KR_PROMPT_SUFFIX, resources: mathRes(5, 1, 6) },

  { id: 'g5-m-2-1', grade: 5, semester: 2, subject: 'math', icon: '📏', title: '수의 범위 어림',  description: '이상, 이하, 초과, 미만, 반올림.',           promptTemplate: '초등 5학년 2학기 1. 수의 범위와 어림하기.' + KR_PROMPT_SUFFIX, resources: mathRes(5, 2, 1) },
  { id: 'g5-m-2-2', grade: 5, semester: 2, subject: 'math', icon: '✖️', title: '분수의 곱셈',    description: '분수끼리의 곱셈.',                         promptTemplate: '초등 5학년 2학기 2. 분수의 곱셈.' + KR_PROMPT_SUFFIX,          resources: mathRes(5, 2, 2) },
  { id: 'g5-m-2-3', grade: 5, semester: 2, subject: 'math', icon: '🦋', title: '합동과 대칭',    description: '도형의 합동, 선대칭, 점대칭.',              promptTemplate: '초등 5학년 2학기 3. 합동과 대칭.' + KR_PROMPT_SUFFIX,          resources: mathRes(5, 2, 3) },
  { id: 'g5-m-2-4', grade: 5, semester: 2, subject: 'math', icon: '✖️', title: '소수의 곱셈',    description: '소수와 자연수, 소수끼리 곱셈.',             promptTemplate: '초등 5학년 2학기 4. 소수의 곱셈.' + KR_PROMPT_SUFFIX,          resources: mathRes(5, 2, 4) },
  { id: 'g5-m-2-5', grade: 5, semester: 2, subject: 'math', icon: '📦', title: '직육면체',       description: '직육면체와 정육면체의 성질.',               promptTemplate: '초등 5학년 2학기 5. 직육면체.' + KR_PROMPT_SUFFIX,             resources: mathRes(5, 2, 5) },
  { id: 'g5-m-2-6', grade: 5, semester: 2, subject: 'math', icon: '📊', title: '평균과 가능성',  description: '평균 구하기와 확률 기초.',                  promptTemplate: '초등 5학년 2학기 6. 평균과 가능성.' + KR_PROMPT_SUFFIX,        resources: mathRes(5, 2, 6) },

  // ==========================================
  // 6학년 수학
  // ==========================================
  { id: 'g6-m-1-1', grade: 6, semester: 1, subject: 'math', icon: '➗', title: '분수의 나눗셈',  description: '분수 나누기 자연수.',                      promptTemplate: '초등 6학년 1학기 1. 분수의 나눗셈.' + KR_PROMPT_SUFFIX,       resources: mathRes(6, 1, 1) },
  { id: 'g6-m-1-2', grade: 6, semester: 1, subject: 'math', icon: '🏰', title: '각기둥과 각뿔',  description: '각기둥·각뿔의 구성 요소.',                  promptTemplate: '초등 6학년 1학기 2. 각기둥과 각뿔.' + KR_PROMPT_SUFFIX,       resources: mathRes(6, 1, 2) },
  { id: 'g6-m-1-3', grade: 6, semester: 1, subject: 'math', icon: '➗', title: '소수의 나눗셈',  description: '소수 나누기 자연수.',                      promptTemplate: '초등 6학년 1학기 3. 소수의 나눗셈.' + KR_PROMPT_SUFFIX,       resources: mathRes(6, 1, 3) },
  { id: 'g6-m-1-4', grade: 6, semester: 1, subject: 'math', icon: '⚖️', title: '비와 비율',      description: '비, 비율, 백분율.',                        promptTemplate: '초등 6학년 1학기 4. 비와 비율.' + KR_PROMPT_SUFFIX,           resources: mathRes(6, 1, 4) },
  { id: 'g6-m-1-5', grade: 6, semester: 1, subject: 'math', icon: '📊', title: '여러 가지 그래프', description: '띠그래프와 원그래프.',                     promptTemplate: '초등 6학년 1학기 5. 여러 가지 그래프.' + KR_PROMPT_SUFFIX,   resources: mathRes(6, 1, 5) },
  { id: 'g6-m-1-6', grade: 6, semester: 1, subject: 'math', icon: '📦', title: '직육면체 부피 겉넓이', description: '입체도형의 크기 구하기.',               promptTemplate: '초등 6학년 1학기 6. 직육면체의 부피와 겉넓이.' + KR_PROMPT_SUFFIX, resources: mathRes(6, 1, 6) },

  { id: 'g6-m-2-1', grade: 6, semester: 2, subject: 'math', icon: '➗', title: '분수의 나눗셈',  description: '분모가 같은/다른 분수 나눗셈.',             promptTemplate: '초등 6학년 2학기 1. 분수의 나눗셈.' + KR_PROMPT_SUFFIX,       resources: mathRes(6, 2, 1) },
  { id: 'g6-m-2-2', grade: 6, semester: 2, subject: 'math', icon: '➗', title: '소수의 나눗셈',  description: '소수 나누기 소수.',                        promptTemplate: '초등 6학년 2학기 2. 소수의 나눗셈.' + KR_PROMPT_SUFFIX,       resources: mathRes(6, 2, 2) },
  { id: 'g6-m-2-3', grade: 6, semester: 2, subject: 'math', icon: '🧊', title: '공간과 입체',    description: '쌓기나무와 공간 감각.',                    promptTemplate: '초등 6학년 2학기 3. 공간과 입체.' + KR_PROMPT_SUFFIX,          resources: mathRes(6, 2, 3) },
  { id: 'g6-m-2-4', grade: 6, semester: 2, subject: 'math', icon: '⚖️', title: '비례식과 비례배분', description: '비의 성질과 비례식 계산.',               promptTemplate: '초등 6학년 2학기 4. 비례식과 비례배분.' + KR_PROMPT_SUFFIX,   resources: mathRes(6, 2, 4) },
  { id: 'g6-m-2-5', grade: 6, semester: 2, subject: 'math', icon: '⭕', title: '원의 넓이',      description: '원주와 원의 넓이 계산.',                   promptTemplate: '초등 6학년 2학기 5. 원의 넓이.' + KR_PROMPT_SUFFIX,           resources: mathRes(6, 2, 5) },
  { id: 'g6-m-2-6', grade: 6, semester: 2, subject: 'math', icon: '🥁', title: '원기둥 원뿔 구',  description: '회전체의 성질과 전개도.',                  promptTemplate: '초등 6학년 2학기 6. 원기둥, 원뿔, 구.' + KR_PROMPT_SUFFIX,   resources: mathRes(6, 2, 6) },

  // ==========================================
  // 영어 커리큘럼 (최소 구성)
  // ==========================================
  { id: 'g1-en-alpha-u', grade: 1, semester: 1, subject: 'english', icon: '🔠', title: '알파벳 대문자', description: 'A-Z 대문자 익히기.', unitId: 'alphabet-upper' },
  { id: 'g1-en-alpha-l', grade: 1, semester: 2, subject: 'english', icon: '🔡', title: '알파벳 소문자', description: 'a-z 소문자 익히기.', unitId: 'alphabet-lower' },
  { id: 'g2-en-phonics',  grade: 2, semester: 1, subject: 'english', icon: '🅰️', title: '파닉스 알파벳', description: '알파벳 첫소리 익히기.', unitId: 'phonics-a' },
  { id: 'g3-en-hello',   grade: 3, semester: 1, subject: 'english', icon: '👋', title: '기본 인사',     description: 'Hello, I am ~ 인사하기.', promptTemplate: '초등 3학년 영어 기초 인사.' + EN_PROMPT_SUFFIX },
];

export const GRADES = [1, 2, 3, 4, 5, 6];

export function getCurriculumByGrade(grade) {
  return CURRICULUM.filter(item => item.grade === grade);
}

export function getCurriculumByGradeAndSubject(grade, subject) {
  return CURRICULUM.filter(item => item.grade === grade && item.subject === subject);
}
