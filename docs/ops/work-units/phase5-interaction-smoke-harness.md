# Phase 5 Interaction Smoke Harness

### 작업 이름

- 작업 ID: `phase5-interaction-smoke-harness`
- 작업 제목: `Phase 5 자동 완료 퀴즈 smoke 하네스 추가`
- 상태: `done`
- 담당 범위: `QuizSession 자동 플레이 옵션, smoke 라우트, 브라우저 완료 화면 검증`

### 1. 목표

- 실제 퀴즈가 한 번 끝까지 진행되어 결과 화면이 뜨는지 브라우저에서 자동으로 검증한다.

### 2. 배경

- 기존 브라우저 smoke는 목록 페이지와 초기 진입 화면을 잘 검증했지만, 문제 풀이가 실제로 진행되어 완료 상태에 도달하는지까지는 보지 못했다.
- 외부 브라우저 제어 도구 없이도 반복 가능한 상호작용 baseline을 만들려면 앱 안에 얇은 smoke 전용 완료 경로가 필요하다.

### 3. 영향 범위

- 수정 대상 파일: `src/components/Quiz/**`, `src/pages/Smoke/**`, `src/App.jsx`, `scripts/**`, `tests/**`
- 영향 받는 문서: `docs/ops/work-units/**`
- 영향 받는 기능: 퀴즈 자동 진행 smoke, 브라우저 결과 화면 검증

### 4. 비포함 범위

- 실제 사용자 클릭 이벤트 자동화
- 보상/진도 localStorage 저장을 포함한 end-to-end 검증
- 오답 복습 플레이 자동화

### 5. 완료 기준

- `QuizSession`이 검증 전용 자동 정답 진행 옵션을 지원한다.
- 숨겨진 smoke 라우트에서 2문제 퀴즈가 자동 완료된다.
- `npm run smoke:browser`가 완료 화면까지 검증한다.

### 6. 검증 방법

- `npm run smoke:browser`
- `npm run check`

### 7. 선행 조건 / 의존성

- 필요한 문서 결정: 없음
- 필요한 파일/구조: `src/components/Quiz/QuizSession.jsx`, `src/App.jsx`, `scripts/browser-smoke.mjs`
- 사용자 확인 필요 여부: 로컬 preview와 headless Chrome 실행 권한 필요

### 8. 리스크

- smoke 전용 자동화 코드가 일반 퀴즈 흐름에 영향을 주지 않도록 기본값이 비활성화 상태여야 한다.
- 브라우저 렌더 타이밍이 느릴 경우 virtual-time-budget 조정이 필요할 수 있다.

### 9. 작업 메모

- smoke 라우트는 실제 `QuizSession`과 `useQuiz`를 그대로 사용하되, 자동 정답 진행과 저장 비활성화 옵션만 켰다.
- 결과 화면에서 `2 / 2`, `+90`을 확인해 완주 흐름과 XP 계산이 함께 살아 있는지 본다.
- 브라우저 smoke는 이 경로에만 더 긴 budget을 줘서 완료 상태까지 기다린다.

### 10. 인수인계 조건

- 자동 완료 smoke가 5회 수정 후에도 안정화되지 않으면 `docs/ops/HANDOVER.md`에 마지막 검증 경로, budget 값, 실패한 DOM 기대 문자열을 함께 기록한다.
