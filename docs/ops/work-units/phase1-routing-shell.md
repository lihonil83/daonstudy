# Phase 1 Routing Shell

### 작업 이름

- 작업 ID: `phase1-routing-shell`
- 작업 제목: `Phase 1 라우팅 셸과 기본 페이지 뼈대 구현`
- 상태: `done`
- 담당 범위: `앱 초기 스캐폴딩 + HashRouter + 5개 페이지 셸`

### 1. 목표

- 정적 파일 환경에서도 동작하는 Vite + React + HashRouter 기반 앱 뼈대를 만든다.

### 2. 배경

- `PLANS.md`의 Phase 1과 `docs/exec-plans/active/mvp-plan.md`의 첫 단계에 해당한다.
- 이후 퀴즈 엔진, 진도, 보상 기능을 붙일 수 있는 기본 화면 구조가 먼저 필요하다.

### 3. 영향 범위

- 수정 대상 파일: `package.json`, `vite.config.js`, `index.html`, `src/**`, `.gitignore`
- 영향 받는 문서: `FRONTEND.md`, `ARCHITECTURE.md`, `docs/exec-plans/active/mvp-plan.md`
- 영향 받는 기능: 홈/수학/영어/복습/진도 기본 페이지 이동

### 4. 비포함 범위

- 퀴즈 데이터 연결
- `useQuiz`, `useProgress`, `useReward`, `useWrongAnswers` 구현
- localStorage 저장 로직
- 실제 문제 풀이 화면 구현

### 5. 완료 기준

- `npm run build`가 성공한다.
- 홈/수학/영어/복습/진도 5개 경로가 렌더링된다.
- `HashRouter`와 `base: './'` 기준으로 정적 실행 가능한 구조가 반영된다.
- 공통 레이아웃과 네비게이션이 연결된다.

### 6. 검증 방법

- `node scripts/validate-docs.mjs`
- `npm run build`
- 빌드 산출물 구조 확인

### 7. 선행 조건 / 의존성

- 필요한 문서 결정: `CONSTITUTION.md`, `REPOSITORY-HARNESS.md`, `FRONTEND.md`, `docs/exec-plans/active/mvp-plan.md`
- 필요한 파일/구조: `src/`, `public/`, `vite.config.js`, `package.json`
- 사용자 확인 필요 여부: 없음

### 8. 리스크

- 의존성 설치가 환경 제약으로 막힐 수 있다.
- 정적 실행 기준과 개발 서버 기준 라우팅이 다르게 동작할 수 있다.

### 9. 작업 메모

- 첫 작업 단위는 구현보다 구조 안정성을 우선한다.
- 수학/영어 페이지는 실제 퀴즈 대신 단원 진입 셸만 제공한다.
- 검증 결과: `node scripts/validate-docs.mjs` 통과, `npm run build` 통과

### 10. 인수인계 조건

- 의존성 설치 또는 빌드가 5회 수정 시도 후에도 해결되지 않으면 `docs/ops/HANDOVER.md`에 기록한다.
- 다음 작업자가 바로 이어서 볼 수 있게 마지막 오류, 시도 내역, 권장 다음 행동을 남긴다.
