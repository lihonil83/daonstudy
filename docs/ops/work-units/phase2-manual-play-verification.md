# Phase 2 Manual Play Verification

### 작업 이름

- 작업 ID: `phase2-manual-play-verification`
- 작업 제목: `Phase 2 수동 플레이 검증과 화면 확인`
- 상태: `blocked`
- 담당 범위: `정적 미리보기 실행 + 홈/단원/퀴즈 화면 수동 확인`

### 1. 목표

- Phase 2 퀴즈 엔진이 실제 브라우저에서 기본 플레이 흐름으로 동작하는지 확인한다.

### 2. 배경

- `phase2-quiz-engine-core` 작업은 빌드 기준으로 완료되었지만, 실제 브라우저에서의 플레이 감각과 라우팅 흐름은 아직 확인되지 않았다.
- `FRONTEND.md`와 `docs/product-specs/quiz-system.md`의 화면/흐름 의도가 실제 UI에 반영되는지 점검해야 한다.

### 3. 영향 범위

- 수정 대상 파일: `docs/ops/work-units/phase2-manual-play-verification.md`
- 영향 받는 문서: `FRONTEND.md`, `docs/product-specs/quiz-system.md`
- 영향 받는 기능: 홈 진입, 단원 선택, 퀴즈 진행, 결과 화면

### 4. 비포함 범위

- 퀴즈 로직 수정
- localStorage 저장 기능 구현
- 시각 디자인 리팩터링

### 5. 완료 기준

- 정적 또는 preview 환경에서 앱이 브라우저로 열린다.
- 홈 화면, 수학 단원 목록, 영어 단원 목록이 확인된다.
- 최소 1개 플레이 가능한 단원에서 문제 화면과 결과 화면을 확인한다.
- 확인 결과와 남은 리스크가 작업 메모에 기록된다.

### 6. 검증 방법

- `npm run build`
- `npm run preview -- --host 127.0.0.1 --port 4173`
- 브라우저에서 홈, 수학, 영어, 퀴즈 화면 수동 확인

### 7. 선행 조건 / 의존성

- 필요한 문서 결정: `FRONTEND.md`, `docs/product-specs/quiz-system.md`, `docs/ops/work-units/phase2-quiz-engine-core.md`
- 필요한 파일/구조: `dist/`, `src/pages/**`, `src/components/Quiz/**`
- 사용자 확인 필요 여부: 브라우저 실행 권한이 막히면 권한 요청 필요

### 8. 리스크

- 로컬 브라우저 실행 또는 캡처 권한이 환경 제약으로 막힐 수 있다.
- 수동 확인 범위가 좁으면 상호작용 버그 일부가 남을 수 있다.

### 9. 작업 메모

- 진행 중 수동 검증을 시작했지만, 사용자 요청으로 여기서 중단했다.
- build 기준 검증은 완료되었고 브라우저 수동 확인은 이후 별도 검증 패스로 이어간다.

### 10. 인수인계 조건

- 브라우저 실행, 캡처, 또는 수동 확인이 5회 수정 시도 후에도 불가능하면 `docs/ops/HANDOVER.md`에 기록한다.
- 마지막 시도 환경, 차단 원인, 대체 검증 가능성을 남긴다.
