# Phase 2 Quiz Engine Core

### 작업 이름

- 작업 ID: `phase2-quiz-engine-core`
- 작업 제목: `Phase 2 퀴즈 엔진 코어와 첫 데이터 단원 구현`
- 상태: `done`
- 담당 범위: `첫 수학/영어 데이터 + useQuiz + 공통 퀴즈 UI + 페이지 연결`

### 1. 목표

- 수학 1개 단원과 영어 1개 단원에서 실제로 10문제 퀴즈를 플레이할 수 있게 만든다.

### 2. 배경

- `PLANS.md`의 Phase 2와 `docs/exec-plans/active/mvp-plan.md`의 퀴즈 엔진 단계에 해당한다.
- 라우팅 셸 위에 실제 문제 흐름을 올리는 첫 구현 단계다.

### 3. 영향 범위

- 수정 대상 파일: `src/data/**`, `src/hooks/useQuiz.js`, `src/components/Quiz/**`, `src/pages/Math/**`, `src/pages/English/**`, `src/utils/shuffle.js`
- 영향 받는 문서: `docs/product-specs/quiz-system.md`, `docs/exec-plans/active/mvp-plan.md`, `FRONTEND.md`
- 영향 받는 기능: 단원 선택, 문제 풀이, 힌트, 결과 화면

### 4. 비포함 범위

- localStorage 저장
- `useProgress`, `useReward`, `useWrongAnswers` persistence 구현
- 오답 복습 실제 데이터 연동
- 진도/보상 페이지 실제 통계 반영

### 5. 완료 기준

- 수학 1개 단원과 영어 1개 단원에서 각각 10문제 퀴즈가 동작한다.
- `useQuiz`가 셔플, 정답 판정, 힌트 2회, 결과 객체 생성을 처리한다.
- 결과 화면에서 점수, 별 등급, XP 결과를 확인할 수 있다.
- `npm run build`가 성공한다.

### 6. 검증 방법

- `node scripts/validate-docs.mjs`
- `npm run build`
- 수학/영어 각 1개 단원 진입 후 퀴즈 흐름 수동 확인

### 7. 선행 조건 / 의존성

- 필요한 문서 결정: `docs/product-specs/quiz-system.md`, `FRONTEND.md`, `docs/exec-plans/active/mvp-plan.md`
- 필요한 파일/구조: `src/components/Quiz/`, `src/data/math/`, `src/data/english/`, `src/hooks/`, `src/utils/`
- 사용자 확인 필요 여부: 없음

### 8. 리스크

- 힌트/정답 공개 흐름이 애매하면 UI 상태가 꼬일 수 있다.
- JSON 데이터가 적절하지 않으면 반복성이 너무 높거나 난이도가 불균형할 수 있다.

### 9. 작업 메모

- Phase 2에서는 persistence 없이 local result만 생성한다.
- 아직 구현되지 않은 단원은 locked state로 남긴다.
- 구현 결과: `multiplication-2`, `alphabet-upper` 단원이 실제 퀴즈 세션으로 연결되었다.
- 검증 결과: `node scripts/validate-docs.mjs` 통과, `npm run build` 통과
- 남은 확인: 실제 브라우저에서 수동 플레이 확인은 다음 검증 패스에서 이어서 점검한다.

### 10. 인수인계 조건

- 퀴즈 흐름이 5회 수정 시도 후에도 안정화되지 않으면 `docs/ops/HANDOVER.md`에 기록한다.
- 마지막 재현 방법, 실패 상태, 가장 유력한 원인을 남긴다.
