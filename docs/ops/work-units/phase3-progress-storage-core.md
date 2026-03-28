# Phase 3 Progress Storage Core

### 작업 이름

- 작업 ID: `phase3-progress-storage-core`
- 작업 제목: `Phase 3 진도 저장과 기록 페이지 연결`
- 상태: `done`
- 담당 범위: `storage.js + useProgress + 퀴즈 결과 저장 + 기록 페이지 반영`

### 1. 목표

- 퀴즈 결과가 localStorage에 저장되고, 기록 페이지에서 실제 통계와 최근 기록을 볼 수 있게 만든다.

### 2. 배경

- `PLANS.md`의 Phase 3 중 기록 영역의 첫 구현이다.
- Phase 2에서 결과 화면까지는 완성되었지만, 퀴즈 결과가 브라우저에 남지 않아 학습 기록이 누적되지 않는다.

### 3. 영향 범위

- 수정 대상 파일: `src/utils/storage.js`, `src/hooks/useProgress.js`, `src/hooks/useQuiz.js`, `src/components/Quiz/QuizSession.jsx`, `src/pages/Progress/**`
- 영향 받는 문서: `docs/product-specs/progress-tracker.md`, `ARCHITECTURE.md`, `PLANS.md`
- 영향 받는 기능: 퀴즈 완료 저장, 과목별 진도, 최근 퀴즈 기록, 학습일/연속 기록 계산

### 4. 비포함 범위

- `useReward.js` 구현
- `useWrongAnswers.js` persistence 구현
- 복습 페이지 실제 오답 퀴즈 연결
- 홈 대시보드 보상/오답 알림 연결

### 5. 완료 기준

- 퀴즈 완료 시 `eduapp_scores`와 `eduapp_progress`가 함께 갱신된다.
- 기록 페이지에서 총 학습일, 연속 학습일, 푼 퀴즈 수가 계산되어 표시된다.
- 수학/영어 단원별 최고 점수와 도전 횟수를 확인할 수 있다.
- 최근 퀴즈 기록이 표시되고, 저장 데이터가 없는 경우에도 빈 상태가 자연스럽게 보인다.
- `npm run build`가 성공한다.

### 6. 검증 방법

- `node scripts/validate-docs.mjs`
- `npm run build`
- localStorage 저장 구조와 기록 페이지 렌더 결과 코드 확인

### 7. 선행 조건 / 의존성

- 필요한 문서 결정: `docs/product-specs/progress-tracker.md`, `ARCHITECTURE.md`, `PLANS.md`
- 필요한 파일/구조: `src/components/Quiz/`, `src/pages/Progress/`, `src/hooks/`, `src/utils/`
- 사용자 확인 필요 여부: 없음

### 8. 리스크

- 퀴즈 결과 저장이 중복 호출되면 같은 기록이 여러 번 쌓일 수 있다.
- 날짜 계산 로직이 로컬 시간대 기준과 어긋나면 연속 학습일이 잘못 계산될 수 있다.

### 9. 작업 메모

- 구현 결과: `storage.js`, `useProgress.js`를 추가하고 퀴즈 완료 시 `eduapp_scores`, `eduapp_progress`가 함께 저장되도록 연결했다.
- 구현 결과: 기록 페이지에서 총 학습일, 연속 학습일, 푼 퀴즈 수, 과목별 단원 진도, 최근 퀴즈 기록을 실제 저장 데이터 기준으로 렌더링한다.
- 검증 결과: `node scripts/validate-docs.mjs` 통과, `npm run build` 통과
- 남은 확인: 브라우저 수동 저장 확인은 사용자가 검증을 중단해 다음 확인 패스로 넘긴다.

### 10. 인수인계 조건

- 저장 로직 또는 연속 학습일 계산이 5회 수정 시도 후에도 안정화되지 않으면 `docs/ops/HANDOVER.md`에 기록한다.
- 마지막 저장 데이터 예시, 재현 순서, 유력 원인을 남긴다.
