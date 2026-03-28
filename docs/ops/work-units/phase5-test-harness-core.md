# Phase 5 Test Harness Core

### 작업 이름

- 작업 ID: `phase5-test-harness-core`
- 작업 제목: `Phase 5 핵심 로직 테스트 하네스 추가`
- 상태: `done`
- 담당 범위: `진도/보상 핵심 로직 순수 함수화 + 자동 테스트`

### 1. 목표

- 핵심 학습 흐름을 자동으로 검증할 수 있도록 순수 함수 기반 테스트 하네스를 추가한다.

### 2. 배경

- Phase 4까지 콘텐츠와 화면이 빠르게 확장되었다.
- 이제는 진도/보상 계산이 깨지지 않도록 자동 검증이 먼저 필요하다.

### 3. 영향 범위

- 수정 대상 파일: `src/hooks/useProgress.js`, `src/hooks/useReward.js`, `src/models/**`, `tests/**`, `package.json`
- 영향 받는 문서: `README.md`
- 영향 받는 기능: 진도 저장, 연속 학습 계산, XP/레벨업, 뱃지 지급

### 4. 비포함 범위

- 브라우저 E2E 테스트
- React 컴포넌트 렌더 테스트
- Windows 브라우저 수동 검증

### 5. 완료 기준

- 진도/보상 핵심 계산이 React 훅 바깥의 순수 함수로 분리된다.
- `npm run test`로 핵심 로직 테스트를 실행할 수 있다.
- 최소한 점수 저장, 연속 학습일, 레벨업, 뱃지 지급 규칙이 자동 검증된다.
- `npm run build`가 기존처럼 성공한다.

### 6. 검증 방법

- `npm run test`
- `node scripts/validate-docs.mjs`
- `npm run build`

### 7. 선행 조건 / 의존성

- 필요한 문서 결정: `docs/product-specs/progress-tracker.md`, `docs/product-specs/gamification.md`
- 필요한 파일/구조: `src/hooks/useProgress.js`, `src/hooks/useReward.js`
- 사용자 확인 필요 여부: 없음

### 8. 리스크

- 훅 내부 로직을 분리하는 과정에서 기존 저장 흐름이 바뀌면 회귀가 생길 수 있다.
- 테스트가 현재 동작만 고정하고 잘못된 스펙을 고정하지 않도록 스펙 문서 기준으로 검증해야 한다.

### 9. 작업 메모

- `src/models/progressModel.js`, `src/models/rewardModel.js`로 핵심 계산을 순수 함수로 분리했다.
- `useProgress`, `useReward`가 새 모델 함수를 사용하도록 정리했다.
- `tests/progressModel.test.js`, `tests/rewardModel.test.js`를 추가해 진도/보상 규칙을 자동 검증하게 만들었다.
- `package.json`에 `npm run test`를 추가하고 `README.md`에 검증 명령을 기록했다.
- 검증 완료:
  - `npm run test`
  - `node scripts/validate-docs.mjs`
  - `npm run build`

### 10. 인수인계 조건

- 테스트 하네스가 5회 수정 후에도 안정적으로 실행되지 않으면 `docs/ops/HANDOVER.md`에 실패 로그와 재현 순서를 남긴다.
