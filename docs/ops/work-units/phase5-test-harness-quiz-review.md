# Phase 5 Test Harness Quiz And Review

### 작업 이름

- 작업 ID: `phase5-test-harness-quiz-review`
- 작업 제목: `Phase 5 퀴즈와 오답 흐름 테스트 하네스 확장`
- 상태: `done`
- 담당 범위: `useQuiz + useWrongAnswers 핵심 로직 모델화 + 전체 체크 명령`

### 1. 목표

- 퀴즈 판정과 오답 저장 규칙도 자동 테스트로 고정해 핵심 학습 흐름 전체를 검증 가능하게 만든다.

### 2. 배경

- 이전 단계에서 진도/보상 로직은 모델과 테스트로 분리되었다.
- 남은 핵심 회귀 지점은 퀴즈 판정과 오답 복습 상태 전이이다.

### 3. 영향 범위

- 수정 대상 파일: `src/hooks/useQuiz.js`, `src/hooks/useWrongAnswers.js`, `src/models/**`, `tests/**`, `package.json`, `README.md`
- 영향 받는 문서: `docs/product-specs/quiz-system.md`, `docs/product-specs/wrong-answer-review.md`
- 영향 받는 기능: 힌트 2단계, 정답/오답 판정, 오답 중복 처리, 복습 완료 처리, 개발 체크 명령

### 4. 비포함 범위

- React 컴포넌트 렌더 테스트
- 브라우저 E2E 테스트
- Windows 브라우저 수동 검증

### 5. 완료 기준

- 퀴즈 판정과 오답 저장 규칙이 React 훅 바깥의 순수 함수로 분리된다.
- `npm run test`에 퀴즈/오답 관련 테스트가 추가된다.
- `npm run check`로 테스트, 문서 검증, 빌드를 한 번에 실행할 수 있다.
- `npm run build`가 기존처럼 성공한다.

### 6. 검증 방법

- `npm run test`
- `npm run check`

### 7. 선행 조건 / 의존성

- 필요한 문서 결정: `docs/product-specs/quiz-system.md`, `docs/product-specs/wrong-answer-review.md`
- 필요한 파일/구조: `src/hooks/useQuiz.js`, `src/hooks/useWrongAnswers.js`, `src/models/`
- 사용자 확인 필요 여부: 없음

### 8. 리스크

- 퀴즈 훅의 타이머 흐름과 순수 함수 판정 로직이 어긋나면 UI 체감이 달라질 수 있다.
- 오답 중복 처리 기준이 바뀌지 않도록 기존 데이터 구조를 그대로 유지해야 한다.

### 9. 작업 메모

- `src/models/quizModel.js`, `src/models/wrongAnswerModel.js`로 퀴즈 판정과 오답 저장 로직을 순수 함수로 분리했다.
- `useQuiz`, `useWrongAnswers`가 새 모델 함수를 사용하도록 정리했다.
- `tests/quizModel.test.js`, `tests/wrongAnswerModel.test.js`를 추가해 힌트 2단계, 정답/오답 판정, 오답 중복 처리, 복습 상태 전이를 자동 검증하게 만들었다.
- `package.json`에 `npm run check`를 추가하고 `README.md`에 검증 명령을 기록했다.
- 검증 완료:
  - `npm run check`

### 10. 인수인계 조건

- 퀴즈 판정/오답 상태 전이가 5회 수정 후에도 테스트로 안정화되지 않으면 `docs/ops/HANDOVER.md`에 재현 순서와 실패 케이스를 기록한다.
