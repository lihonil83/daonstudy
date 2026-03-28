# Phase 5 Review Interaction Smoke

### 작업 이름

- 작업 ID: `phase5-review-interaction-smoke`
- 작업 제목: `Phase 5 복습 완료 브라우저 smoke 추가`
- 상태: `done`
- 담당 범위: `review mode 자동 완료 smoke 라우트, 브라우저 복습 결과 검증`

### 1. 목표

- 오답 복습 모드가 실제로 끝까지 진행되어 review 결과 화면이 뜨는지 브라우저에서 자동 검증한다.

### 2. 배경

- 일반 퀴즈 완료 smoke는 이미 준비됐지만, 핵심 학습 루프의 다른 축인 복습 완료 흐름은 아직 브라우저 기준 자동 검증이 없었다.
- 복습 결과 화면은 일반 퀴즈 결과와 문구, XP 보너스, CTA가 달라 별도 smoke가 필요하다.

### 3. 영향 범위

- 수정 대상 파일: `src/pages/Smoke/**`, `src/App.jsx`, `scripts/browser-smoke.mjs`, `tests/**`
- 영향 받는 문서: `docs/ops/work-units/**`
- 영향 받는 기능: review mode 완료 smoke, 복습 결과 화면 baseline 검증

### 4. 비포함 범위

- 실제 localStorage 오답 목록을 생성해서 복습 화면으로 진입하는 end-to-end 검증
- 복습 실패 분기 검증
- 클릭 이벤트 자동화

### 5. 완료 기준

- 숨겨진 review smoke 라우트에서 2문제 복습 퀴즈가 자동 완료된다.
- `npm run smoke:browser`가 review 결과 화면의 핵심 문구와 XP를 검증한다.
- 기존 앱 셸 테스트가 새 smoke 라우트를 인지한다.

### 6. 검증 방법

- `npm run smoke:browser`
- `npm run check`

### 7. 선행 조건 / 의존성

- 필요한 문서 결정: 없음
- 필요한 파일/구조: `src/components/Quiz/QuizSession.jsx`, `src/pages/Smoke/**`, `scripts/browser-smoke.mjs`
- 사용자 확인 필요 여부: 로컬 preview와 headless Chrome 실행 권한 필요

### 8. 리스크

- review mode smoke도 저장을 끄고 동작해야 기존 학습 기록을 오염시키지 않는다.
- 브라우저 렌더 타이밍이 늦으면 smoke budget 조정이 필요할 수 있다.

### 9. 작업 메모

- review smoke는 수학 1문제, 영어 1문제를 섞어서 review 결과 목록과 문구가 모두 보이도록 구성했다.
- 결과 화면에서 `복습 완료`, `2 / 2`, `+50`, `복습 목록으로`, `✅ 맞혔어!`를 확인한다.
- 앱 셸 테스트에도 새 숨김 라우트 stub을 추가해 경로 연결이 끊기지 않도록 했다.

### 10. 인수인계 조건

- review smoke가 5회 수정 후에도 안정화되지 않으면 `docs/ops/HANDOVER.md`에 검증 경로, 마지막 기대 문자열, smoke budget을 함께 기록한다.
