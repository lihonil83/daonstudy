# AGENTS.md

## 프로젝트 요약

초등학교 2학년 아들 1명을 위한 영어/수학 교육 웹 앱.
배포 없이 로컬 브라우저에서만 실행하는 개인 프로젝트.

---

## 기술 스택

- **React 18** + **Vite** (JavaScript, TypeScript 사용 안 함)
- **CSS Modules** (스타일링)
- **React Router v6 (HashRouter)** (라우팅)
- **localStorage** (데이터 저장)
- 외부 라이브러리 최소화 — 위 4개 외에는 가급적 추가하지 않는다

---

## 핵심 문서 위치

| 문서 | 경로 | 용도 |
|------|------|------|
| 저장소 헌법 | `CONSTITUTION.md` | 프로젝트 정체성, 기술 헌법, 변경 경계 |
| 저장소 하네스 | `REPOSITORY-HARNESS.md` | 문서 정본 체계, 변경 규칙, 검증 규칙 |
| 작업 단위 템플릿 | `docs/ops/WORK-UNIT-TEMPLATE.md` | 작업 분해, 완료 기준, 검증 방법의 표준 형식 |
| 인수인계 로그 | `docs/ops/HANDOVER.md` | 미해결 문제 기록, 반복 실패 이슈, 다음 작업자 전달 |
| 기술 구조 | `ARCHITECTURE.md` | 폴더 구조, 데이터 모델, 설계 원칙 |
| MVP 계획 | `docs/exec-plans/active/mvp-plan.md` | 개발 단계, 우선순위, 퀴즈 JSON 스키마 |
| 교육 원칙 | `docs/design-docs/core-beliefs.md` | UX 판단 기준, 톤 & 보이스 |
| 퀴즈 시스템 | `docs/product-specs/quiz-system.md` | 퀴즈 흐름, 힌트 로직, useQuiz 인터페이스 |
| 진도 기록 | `docs/product-specs/progress-tracker.md` | 점수 저장, 연속 학습, useProgress 인터페이스 |
| 보상 시스템 | `docs/product-specs/gamification.md` | XP, 레벨, 뱃지, useReward 인터페이스 |
| 오답 복습 | `docs/product-specs/wrong-answer-review.md` | 오답 저장/복습 흐름, useWrongAnswers 인터페이스 |

---

## 코딩 규칙

### 파일 구조

```
src/
├── components/    → 재사용 가능한 UI 컴포넌트
├── pages/         → 라우트별 페이지 컴포넌트
├── data/          → 문제 JSON 파일
├── hooks/         → 커스텀 훅 (비즈니스 로직)
├── utils/         → 헬퍼 함수
├── App.jsx
└── main.jsx
```

### 네이밍 컨벤션

- 컴포넌트: **PascalCase** (`QuizCard.jsx`, `RewardPopup.jsx`)
- 훅: **camelCase** + use 접두사 (`useQuiz.js`, `useProgress.js`)
- 유틸: **camelCase** (`storage.js`, `shuffle.js`)
- CSS Modules: **컴포넌트명.module.css** (`QuizCard.module.css`)
- 데이터: **kebab-case** (`multiplication-3.json`, `alphabet-upper.json`)

### 컴포넌트 작성 패턴

```jsx
// 함수형 컴포넌트 + CSS Modules
import styles from './QuizCard.module.css';

export default function QuizCard({ question, onAnswer }) {
  return (
    <div className={styles.card}>
      {/* ... */}
    </div>
  );
}
```

- 클래스 컴포넌트 사용 금지 — 함수형 + 훅만 사용
- prop-types 생략 (JS 프로젝트, 1인 개발)
- default export 사용

### 상태 관리

- **전역 상태 라이브러리 사용 안 함** (Redux, Zustand 등 금지)
- 페이지 내 상태: `useState`, `useReducer`
- 페이지 간 공유 데이터: localStorage (커스텀 훅으로 래핑)
- 컴포넌트 간 데이터 전달: props drilling (깊이 2단계까지만)

### localStorage 규칙

- 키 접두사: `eduapp_` (다른 앱 데이터와 충돌 방지)
- 읽기/쓰기는 반드시 `utils/storage.js`를 통해서만
- JSON.parse/stringify 에러 핸들링 필수
- 데이터 없을 때 기본값 반환

```javascript
// utils/storage.js 패턴
export function getStorage(key, defaultValue) {
  try {
    const data = localStorage.getItem(`eduapp_${key}`);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStorage(key, value) {
  try {
    localStorage.setItem(`eduapp_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write failed:', e);
  }
}
```

---

## UX 판단 기준

코드를 작성할 때 아래 원칙을 항상 참고한다. 상세 내용은 `docs/design-docs/core-beliefs.md` 참조.

1. **놀이가 먼저** — 게임처럼 느껴져야 한다
2. **틀려도 괜찮다** — 힌트 → 재시도, 부정적 피드백 금지
3. **자기 속도로** — 강제 학습량 없음, 일일 제한 없음
4. **작은 성취를 크게** — 즉각적 보상, 레벨업 축하
5. **단순한 화면** — 8살이 설명 없이 사용 가능

### 텍스트 톤

- 칭찬은 구체적: "잘했어!" → "와, 7단을 다 맞혔어!"
- 격려는 따뜻하게: "틀렸습니다" → "아깝다! 힌트를 줄게"
- 이모지 적극 활용: 🎉 ⭐ 💪 🏆

---

## 빌드 & 실행

```bash
# 개발 (macOS)
npm run dev

# 빌드 (macOS)
npm run build
# → dist/ 폴더 생성

# 실행 (Windows)
# dist/ 폴더를 복사 → index.html을 브라우저로 열기
```

- `vite.config.js`에 `base: './'` 필수 (상대경로)
- 빌드 결과물은 정적 파일만 — 서버 불필요

---

## 문제 데이터 추가 방법

새 단원 추가 = JSON 파일 1개 + 라우트 연결

1. `src/data/` 하위에 JSON 파일 생성
2. `docs/exec-plans/active/mvp-plan.md`의 퀴즈 JSON 스키마를 따른다
3. 해당 과목 페이지에서 import하여 useQuiz에 전달
4. 단원당 최소 20문제 (10문제 랜덤 출제)

---

## 주의사항

- **서버 코드 작성 금지** — 프론트엔드 전용 프로젝트
- **외부 API 호출 금지** — 오프라인 실행이 기본
- **TypeScript 사용 금지** — JavaScript만
- **테스트 코드 불필요** — 1인 개인 프로젝트
- 새 npm 패키지 설치 전 반드시 확인 받기
