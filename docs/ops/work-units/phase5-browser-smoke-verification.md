# Phase 5 Browser Smoke Verification

### 작업 이름

- 작업 ID: `phase5-browser-smoke-verification`
- 작업 제목: `Phase 5 preview 기반 브라우저 스모크 검증 자동화`
- 상태: `done`
- 담당 범위: `preview 서버 실행, headless Chrome DOM 검증, 검증 명령 문서화`

### 1. 목표

- 실제 브라우저 렌더 환경에서 홈, 과목 목록, 빈 상태 페이지, 퀴즈 진입 화면, fallback 경로가 정상적으로 뜨는지 자동으로 확인한다.

### 2. 배경

- 서버 렌더 기반 테스트와 앱 셸 스모크 테스트는 충분히 넓어졌지만, 실제 브라우저에서 번들 파일이 올라오고 HashRouter가 동작하는지 확인하는 자동 검증은 아직 없었다.
- 과거 수동 브라우저 검증은 사용자 요청으로 중단되었으므로, 반복 가능한 자동 smoke 검증이 더 적합하다.

### 3. 영향 범위

- 수정 대상 파일: `package.json`, `scripts/**`, `README.md`
- 영향 받는 문서: `docs/ops/work-units/**`
- 영향 받는 기능: preview 실행, HashRouter 브라우저 렌더 baseline 검증

### 4. 비포함 범위

- 실제 클릭 상호작용 자동화
- localStorage를 바꾸는 플레이 테스트
- 브라우저 스크린샷 비교

### 5. 완료 기준

- `npm run smoke:browser` 명령으로 build 후 preview 기반 브라우저 smoke를 실행할 수 있다.
- 홈, 수학/영어 단원 목록, review/progress 기본 상태, 수학/영어 퀴즈 진입, fallback 경로가 headless Chrome DOM 기준으로 검증된다.
- 검증 명령과 환경 요구 사항이 문서에 기록된다.

### 6. 검증 방법

- `npm run smoke:browser`

### 7. 선행 조건 / 의존성

- 필요한 문서 결정: 없음
- 필요한 파일/구조: `dist/`, `src/App.jsx`, `src/pages/Home/**`, `src/pages/English/**`
- 사용자 확인 필요 여부: 로컬 포트 실행과 headless Chrome 사용 권한이 막히면 권한 요청 필요

### 8. 리스크

- 브라우저 smoke는 환경 의존성이 있어 Chrome 경로가 다르면 `CHROME_BIN` 설정이 필요할 수 있다.
- 현재 방식은 DOM 확인 중심이라 실제 클릭 흐름이나 오디오 재생까지는 검증하지 못한다.

### 9. 작업 메모

- `smoke:browser`는 `build -> preview -> headless Chrome dump-dom` 순서로 동작한다.
- home, math, english, review, progress, quiz route, fallback 경로를 baseline으로 삼아 HashRouter 번들 로딩 여부를 확인한다.
- 각 브라우저 호출에는 종료 타임아웃을 두어 headless Chrome이 비정상적으로 멈출 때 smoke가 무한 대기하지 않도록 했다.
- Chrome stderr에 섞이는 일부 GPU 경고는 결과 해석에 필요 없는 항목이라 필터링했다.

### 10. 인수인계 조건

- preview 서버 실행 또는 headless Chrome smoke가 5회 수정 후에도 안정화되지 않으면 `docs/ops/HANDOVER.md`에 실패 명령, Chrome 경로, 마지막 stderr를 함께 기록한다.
