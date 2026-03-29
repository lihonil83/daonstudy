# Phase 6 Release Prep Automation

### 작업 이름

- 작업 ID: `phase6-release-prep-automation`
- 작업 제목: `Phase 6 릴리스 준비 자동화와 산출물 정리`
- 상태: `done`
- 담당 범위: `release 명령, 산출물 구조, runbook 반영`

### 1. 목표

- 릴리스 전 검증과 운영 `dist` 산출물 정리를 한 번에 수행하는 명령을 제공한다.

### 2. 배경

- 지금까지는 검증 명령과 운영 빌드가 각각 준비되어 있었지만, 실제 릴리스 직전에는 한 번에 순서대로 실행하는 흐름이 필요했다.
- `dist`는 무시 대상이라도, 실제 전달 가능한 산출물 묶음은 `release/` 아래에 다시 구성할 필요가 있다.

### 3. 영향 범위

- 수정 대상 파일: `package.json`, `.gitignore`, `scripts/**`, `README.md`, `RUNBOOK.md`
- 영향 받는 문서: `docs/ops/work-units/**`
- 영향 받는 기능: release 명령, 운영 산출물 생성

### 4. 비포함 범위

- GitHub Release 업로드
- 자동 zip 생성
- CI/CD 서버 연동

### 5. 완료 기준

- `npm run release:prep` 명령이 존재한다.
- 이 명령이 `check`, `smoke:browser`, `smoke:browser:prod`를 순서대로 수행한다.
- 최종 운영 `dist`가 `release/` 아래의 번들 폴더로 복사된다.
- 번들 폴더에 `README.txt`, `manifest.json`이 생성된다.

### 6. 검증 방법

- `npm run check`
- `npm run smoke:browser`
- `npm run smoke:browser:prod`
- `npm run release:prep`

### 7. 선행 조건 / 의존성

- 필요한 문서 결정: `RUNBOOK.md`, `README.md`
- 필요한 파일/구조: `scripts/browser-smoke.mjs`, `dist/`
- 사용자 확인 필요 여부: 없음

### 8. 리스크

- 브라우저 smoke는 headless Chrome 환경이 필요하다.
- `release:prep` 시간이 길어질 수 있다.

### 9. 작업 메모

- `release/`는 생성 산출물 폴더이므로 Git 추적 대상에서 제외했다.
- 릴리스 번들에는 운영용 `dist`만 포함하고, smoke 빌드는 포함하지 않는다.
- manifest에는 파일별 sha256과 현재 commit 정보를 남긴다.

### 10. 인수인계 조건

- `release:prep`가 5회 수정 후에도 안정화되지 않으면 `docs/ops/HANDOVER.md`에 실패 명령, 마지막 통과 명령, release 폴더 상태를 함께 기록한다.
