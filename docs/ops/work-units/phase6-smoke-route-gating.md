# Phase 6 Smoke Route Gating

### 작업 이름

- 작업 ID: `phase6-smoke-route-gating`
- 작업 제목: `Phase 6 smoke 전용 라우트 운영 경로 분리`
- 상태: `done`
- 담당 범위: `feature flag, smoke build, route gating, 검증 문서 정리`

### 1. 목표

- smoke 전용 라우트를 실제 사용 빌드에서 숨기고, 검증용 빌드에서만 열리도록 분리한다.

### 2. 배경

- 브라우저 smoke 하네스는 매우 유용하지만 `/smoke/*` 경로가 운영 빌드에도 그대로 남아 있으면 실제 사용자 경로와 검증 경로의 경계가 흐려진다.
- 이제는 앱이 실제 사용 단계로 가까워지고 있어 운영 경로를 더 선명하게 만드는 정리가 필요하다.

### 3. 영향 범위

- 수정 대상 파일: `src/App.jsx`, `src/config/**`, `package.json`, `.env.smoke`, `tests/**`, `docs/**`
- 영향 받는 문서: `README.md`, `docs/ops/work-units/**`
- 영향 받는 기능: smoke route 노출 여부, smoke 전용 build 명령

### 4. 비포함 범위

- smoke 페이지 자체 삭제
- CI 파이프라인 구성
- 운영 배포 스크립트 추가

### 5. 완료 기준

- 기본 `npm run build` 결과에서는 smoke 라우트가 비활성화된다.
- `npm run build:smoke`와 `npm run smoke:browser`에서는 smoke 라우트가 활성화된다.
- `npm run smoke:browser:prod`에서 `/smoke/*` 경로가 fallback 화면으로 막히는 것이 확인된다.
- 테스트로 smoke flag on/off 라우팅이 모두 검증된다.

### 6. 검증 방법

- `npm run check`
- `npm run build:smoke`
- `npm run smoke:browser`
- `npm run smoke:browser:prod`

### 7. 선행 조건 / 의존성

- 필요한 문서 결정: 없음
- 필요한 파일/구조: `src/App.jsx`, `tests/appShellRender.test.js`, `package.json`
- 사용자 확인 필요 여부: 없음

### 8. 리스크

- flag 조건이 테스트와 런타임에서 다르게 해석되면 smoke 경로가 예상과 다르게 노출될 수 있다.
- smoke build와 운영 build의 역할이 문서에 명확히 남지 않으면 이후 사용자가 헷갈릴 수 있다.

### 9. 작업 메모

- smoke route 노출은 `smokeRoutesEnabled` 플래그 하나로 관리한다.
- 기본 build는 운영 경로만 남기고, smoke build는 `.env.smoke`를 통해 검증 경로를 연다.
- 앱 셸 테스트에 smoke flag off fallback 검증도 추가했다.
- 브라우저 smoke 스크립트는 `smoke`와 `production` 모드를 모두 지원한다.

### 10. 인수인계 조건

- smoke route gating이 5회 수정 후에도 안정화되지 않으면 `docs/ops/HANDOVER.md`에 flag 값, 실패 경로, build 명령을 함께 기록한다.
