# FRONTEND.md — 프론트엔드 컨벤션

## 이 문서의 범위

코드를 작성할 때 참고하는 실무 패턴과 규칙.
기술 스택/폴더 구조는 `AGENTS.md`, 시각 디자인은 `DESIGN.md` 참조.

---

## 프로젝트 설정

### vite.config.js

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',  // ← 로컬 파일 실행 필수
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
```

### 폴더 별칭 (선택)

```javascript
// vite.config.js에 추가
resolve: {
  alias: {
    '@': '/src',
    '@components': '/src/components',
    '@pages': '/src/pages',
    '@hooks': '/src/hooks',
    '@utils': '/src/utils',
    '@data': '/src/data',
  },
},
```

---

## 라우팅

### React Router 구조

```jsx
// App.jsx
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Math from './pages/Math/Math';
import English from './pages/English/English';
import Review from './pages/Review/Review';
import Progress from './pages/Progress/Progress';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/math" element={<Math />} />
          <Route path="/math/:unitId" element={<Math />} />
          <Route path="/english" element={<English />} />
          <Route path="/english/:unitId" element={<English />} />
          <Route path="/review" element={<Review />} />
          <Route path="/progress" element={<Progress />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
```

> **HashRouter 사용** — `BrowserRouter`는 서버가 필요하지만, `HashRouter`는 정적 파일(index.html)만으로 라우팅이 동작한다. 로컬 실행에 필수.

---

## 컴포넌트 패턴

### 페이지 컴포넌트

```
src/pages/Math/
├── Math.jsx
├── Math.module.css
└── components/         ← 이 페이지 전용 하위 컴포넌트
    └── UnitSelector.jsx
```

- 페이지 컴포넌트는 훅을 호출하고 레이아웃을 조합하는 역할
- 비즈니스 로직은 훅에, 표현은 컴포넌트에

```jsx
// pages/Math/Math.jsx
import { useParams } from 'react-router-dom';
import { useQuiz } from '@hooks/useQuiz';
import QuizCard from '@components/Quiz/QuizCard';
import UnitSelector from './components/UnitSelector';
import styles from './Math.module.css';

export default function Math() {
  const { unitId } = useParams();

  if (!unitId) {
    return <UnitSelector subject="math" />;
  }

  return <QuizPage unitId={unitId} />;
}
```

### 공통 컴포넌트

```
src/components/Quiz/
├── QuizCard.jsx        ← 문제 카드
├── QuizCard.module.css
├── ChoiceButton.jsx    ← 선택지 버튼
├── HintBubble.jsx      ← 힌트 말풍선
├── ProgressBar.jsx     ← 진행률 바
└── ResultScreen.jsx    ← 결과 화면
```

- props로 데이터를 받고, 이벤트 핸들러를 올려보내는 패턴
- 컴포넌트 안에서 localStorage 직접 접근 금지 (훅을 통해서만)

```jsx
// components/Quiz/ChoiceButton.jsx
import styles from './ChoiceButton.module.css';

export default function ChoiceButton({ text, state, onClick }) {
  // state: 'default' | 'correct' | 'wrong' | 'disabled'
  return (
    <button
      className={`${styles.btn} ${styles[state]}`}
      onClick={onClick}
      disabled={state === 'disabled'}
    >
      {text}
    </button>
  );
}
```

---

## 커스텀 훅 패턴

### 구조

```
src/hooks/
├── useQuiz.js          ← 퀴즈 진행 로직
├── useProgress.js      ← 진도/점수 관리
├── useReward.js        ← XP/레벨/뱃지
└── useWrongAnswers.js  ← 오답 관리
```

### 훅 작성 규칙

1. **한 훅 = 한 책임** — useQuiz는 퀴즈만, useReward는 보상만
2. **훅 간 의존**: useQuiz 내부에서 useProgress, useReward, useWrongAnswers 호출 가능
3. **localStorage 접근**: 반드시 `utils/storage.js`를 통해서만
4. **반환 객체**: 상태값과 액션 함수를 하나의 객체로 반환

```javascript
// hooks/useQuiz.js 기본 구조
import { useState, useCallback } from 'react';
import { useProgress } from './useProgress';
import { useReward } from './useReward';
import { useWrongAnswers } from './useWrongAnswers';
import { shuffleArray } from '@utils/shuffle';

export function useQuiz(unitId) {
  const { saveQuizResult } = useProgress();
  const { addXp, checkBadges } = useReward();
  const { addWrongAnswer } = useWrongAnswers();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  // ...

  const submitAnswer = useCallback((answer) => {
    // 정답/오답 판정 로직
  }, [currentIndex, questions]);

  return {
    currentQuestion: questions[currentIndex],
    questionIndex: currentIndex,
    totalQuestions: questions.length,
    score,
    attemptCount,
    submitAnswer,
    // ...
  };
}
```

---

## 문제 데이터 로딩

### JSON import 패턴

```javascript
// 정적 import (빌드에 포함됨)
import mul2Data from '@data/math/multiplication-2.json';
import mul3Data from '@data/math/multiplication-3.json';

// 단원 레지스트리
const MATH_UNITS = {
  'multiplication-2': { data: mul2Data, title: '구구단 2단' },
  'multiplication-3': { data: mul3Data, title: '구구단 3단' },
};

// 사용
const unit = MATH_UNITS[unitId];
const questions = shuffleArray(unit.data.questions).slice(0, 10);
```

### 단원 추가 시

1. `src/data/math/` 또는 `src/data/english/`에 JSON 파일 추가
2. 해당 과목의 레지스트리 객체에 항목 추가
3. 끝. 라우팅은 `:unitId` 파라미터로 자동 처리

---

## CSS 컨벤션

### CSS Modules 규칙

```css
/* ✅ camelCase 클래스명 */
.quizCard { }
.choiceBtn { }
.hintBubble { }

/* ❌ kebab-case 사용 금지 (JS에서 접근 불편) */
.quiz-card { }
```

### 공통 스타일

```
src/
├── App.module.css      ← 앱 전체 레이아웃
├── index.css           ← CSS 변수, 리셋, 글로벌 스타일
```

```css
/* index.css */
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');

:root {
  /* DESIGN.md의 CSS 변수 전체 포함 */
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-primary);
  font-size: var(--text-body);
  color: var(--color-text);
  background: var(--color-bg);
  -webkit-font-smoothing: antialiased;
}
```

---

## 에러 처리

### localStorage 에러

```javascript
// utils/storage.js가 모든 에러를 흡수
// 컴포넌트에서는 기본값을 항상 준비
const progress = getStorage('progress', { math: {}, english: {} });
```

### JSON import 에러

```javascript
// 존재하지 않는 unitId 접근 시
const unit = MATH_UNITS[unitId];
if (!unit) {
  return <div>해당 단원을 찾을 수 없어요 😅</div>;
}
```

### 에러 바운더리 (선택)

```jsx
// 전체 앱을 감싸는 에러 바운더리
// MVP에서는 간단한 fallback만
<ErrorBoundary fallback={<div>앗, 문제가 생겼어요! 새로고침 해볼까?</div>}>
  <App />
</ErrorBoundary>
```

---

## 성능 고려사항

이 프로젝트에서 성능은 큰 이슈가 아니지만, 기본 원칙:

- **이미지 최적화**: `public/images/`의 이미지는 적절한 크기로 리사이즈
- **번들 크기**: React + React Router 외 추가 라이브러리 최소화
- **애니메이션**: CSS 애니메이션 우선 (JS 애니메이션 라이브러리 금지)
- **리렌더링**: 퀴즈 진행 중 불필요한 리렌더링 방지 (useCallback, useMemo 적절히 사용)

---

## 체크리스트 (PR 전)

새 기능을 추가했을 때 확인할 것:

- [ ] `npm run build` 성공하는가?
- [ ] `dist/index.html`을 브라우저에서 직접 열었을 때 동작하는가?
- [ ] localStorage 접근은 `storage.js`를 통하는가?
- [ ] CSS 클래스명은 camelCase인가?
- [ ] 새 npm 패키지를 추가했다면 정말 필요한가?
- [ ] 아이가 설명 없이 사용할 수 있는 UI인가?
