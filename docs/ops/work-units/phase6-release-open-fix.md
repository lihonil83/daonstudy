# Phase 6 Release Open Fix

### 작업 이름

- 작업 ID: `phase6-release-open-fix`
- 작업 제목: `Phase 6 file 직접 실행 blank 화면 대응용 release open 명령 추가`
- 상태: `done`
- 담당 범위: `release open 스크립트, 실행 문서 수정, 사용자 실행 경로 보강`

### 1. 목표

- `dist/index.html`을 직접 열었을 때 생길 수 있는 빈 화면 문제를 피할 수 있게, 최신 릴리스 번들을 로컬 서버로 여는 명령을 제공한다.

### 2. 배경

- 실제 브라우저에서 `file://` 경로로 운영 번들을 직접 열면, Chrome 계열에서 module script가 실행되지 않아 빈 화면이 되는 문제가 재현되었다.
- 개인 사용 프로젝트라도 반복 가능한 실행 경로가 있어야 한다.

### 3. 영향 범위

- 수정 대상 파일: `package.json`, `scripts/release-open.mjs`, `scripts/release-prep.mjs`, `README.md`, `RUNBOOK.md`
- 영향 받는 문서: `docs/ops/work-units/**`
- 영향 받는 기능: 실제 릴리스 번들 실행

### 4. 비포함 범위

- 앱 번들을 non-module 방식으로 다시 구성하기
- OS별 설치형 런처 생성

### 5. 완료 기준

- `npm run release:open` 명령이 존재한다.
- 최신 release 번들을 로컬 서버로 띄울 수 있다.
- 실행 문서에 `file://` blank 가능성과 권장 실행 방법이 반영된다.

### 6. 검증 방법

- `npm run check`
- `npm run release:prep`
- `npm run release:open`

### 7. 선행 조건 / 의존성

- 필요한 문서 결정: `RUNBOOK.md`, `README.md`
- 필요한 파일/구조: `release/LATEST.txt`, `release/*/dist`
- 사용자 확인 필요 여부: 없음

### 8. 리스크

- 로컬 포트 `4174`가 이미 사용 중이면 서버가 뜨지 않을 수 있다.
- 서버 실행형 명령은 프로세스를 유지해야 한다.

### 9. 작업 메모

- 직접 파일 실행은 앱 버그가 아니라 브라우저 보안 제한 문제로 확인했다.
- `release:open`은 최신 릴리스 번들을 읽어 로컬 서버로 제공한다.
- Windows 사용자를 위해 릴리스 번들에 `start-windows.bat`도 함께 생성한다.

### 10. 인수인계 조건

- `release:open`이 5회 수정 후에도 안정화되지 않으면 `docs/ops/HANDOVER.md`에 사용 포트, 브라우저 종류, direct file 결과를 함께 기록한다.
