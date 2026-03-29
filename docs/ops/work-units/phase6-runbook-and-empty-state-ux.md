# Phase 6 Runbook And Empty-State UX

### 작업 이름

- 작업 ID: `phase6-runbook-and-empty-state-ux`
- 작업 제목: `Phase 6 실행 가이드 정리와 빈 상태 UX 마감`
- 상태: `done`
- 담당 범위: `운영 가이드 문서, README 진입점, Review/Progress 빈 상태 행동 유도`

### 1. 목표

- 실제 실행과 검증 방법을 한 문서에서 볼 수 있게 정리한다.
- 빈 상태 화면에서도 사용자가 다음 행동을 바로 고를 수 있게 만든다.

### 2. 배경

- 앱 기능은 충분히 갖춰졌지만, 실제 사용자는 어디서 실행하고 어떻게 확인하는지 한 번에 보기 어려울 수 있다.
- 빈 상태 화면은 정보는 주지만 행동 유도는 아직 약했다.

### 3. 영향 범위

- 수정 대상 파일: `README.md`, `RUNBOOK.md`, `src/pages/Review/**`, `src/pages/Progress/**`, `tests/**`
- 영향 받는 문서: `docs/ops/work-units/**`
- 영향 받는 기능: 실행 안내, 첫 사용 UX, 빈 상태에서의 이동 흐름

### 4. 비포함 범위

- CI 설정 추가
- 외부 배포 플랫폼 연동
- 사용자 계정/백엔드 도입

### 5. 완료 기준

- 실행/빌드/검증 흐름이 문서로 정리된다.
- README에서 실행 가이드로 진입할 수 있다.
- Review/Progress 빈 상태에서 다음 행동 링크가 제공된다.
- 테스트와 브라우저 smoke가 통과한다.

### 6. 검증 방법

- `npm run check`
- `npm run smoke:browser`
- `npm run smoke:browser:prod`

### 7. 선행 조건 / 의존성

- 필요한 문서 결정: `README.md`, `REPOSITORY-HARNESS.md`
- 필요한 파일/구조: `src/pages/Review/Review.jsx`, `src/pages/Progress/Progress.jsx`
- 사용자 확인 필요 여부: 없음

### 8. 리스크

- 실행 가이드가 실제 명령과 어긋나면 오히려 혼란을 줄 수 있다.
- 빈 상태 행동 유도가 너무 많으면 화면이 산만해질 수 있다.

### 9. 작업 메모

- 실행 가이드는 로컬 실행, 운영 빌드, smoke 빌드, 배포 가능한 형태를 한 문서에 모았다.
- 빈 상태 행동 유도는 버튼 수를 최소화하고 수학/영어 시작 같은 명확한 선택지만 남겼다.

### 10. 인수인계 조건

- 실행 가이드와 실제 명령이 5회 수정 후에도 맞지 않으면 `docs/ops/HANDOVER.md`에 실패 명령, 기대 결과, 실제 결과를 함께 남긴다.
