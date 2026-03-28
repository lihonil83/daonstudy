# Phase 5 Mini End-to-End Review Smoke

### 작업 이름

- 작업 ID: `phase5-mini-e2e-review-smoke`
- 작업 제목: `Phase 5 오답 생성 → 복습 화면 → 복습 완료 mini smoke 추가`
- 상태: `done`
- 담당 범위: `오답 생성 자동화, Review override 하네스, mini end-to-end 브라우저 smoke`

### 1. 목표

- 일부러 틀린 문제가 실제 Review 화면에 나타나고, 이어서 복습 완료까지 연결되는 mini end-to-end 흐름을 브라우저에서 자동 검증한다.

### 2. 배경

- 일반 퀴즈 완료 smoke와 review 완료 smoke는 각각 준비되었지만, “오답 생성”과 “복습 화면 진입”이 실제로 이어지는 흐름은 아직 분리된 상태였다.
- 실제 storage를 오염시키지 않으면서 연결 흐름을 검증하려면 smoke 전용 override 하네스가 필요하다.

### 3. 영향 범위

- 수정 대상 파일: `src/components/Quiz/**`, `src/pages/Review/**`, `src/pages/Smoke/**`, `src/App.jsx`, `tests/**`, `scripts/browser-smoke.mjs`
- 영향 받는 문서: `docs/ops/work-units/**`
- 영향 받는 기능: 오답 생성 smoke, review list smoke, review completion mini end-to-end smoke

### 4. 비포함 범위

- 실제 localStorage를 사용하는 완전한 end-to-end 검증
- 오답 여러 개가 섞인 대량 복습 검증
- 복습 실패 후 다시 미복습으로 돌아가는 분기 검증

### 5. 완료 기준

- `QuizSession`이 smoke 전용 완료 콜백과 답안 시퀀스 자동화를 지원한다.
- smoke 라우트에서 일부러 틀린 문제를 만들고 Review 화면에 노출할 수 있다.
- `npm run smoke:browser`가 review list와 review completion 연결 흐름을 검증한다.

### 6. 검증 방법

- `npm run smoke:browser`
- `npm run check`

### 7. 선행 조건 / 의존성

- 필요한 문서 결정: 없음
- 필요한 파일/구조: `src/components/Quiz/QuizSession.jsx`, `src/pages/Review/Review.jsx`, `src/pages/Smoke/**`, `scripts/browser-smoke.mjs`
- 사용자 확인 필요 여부: 로컬 preview와 headless Chrome 실행 권한 필요

### 8. 리스크

- smoke override 데이터와 실제 `useWrongAnswers` 데이터 구조가 너무 멀어지면 smoke 가치가 줄어든다.
- 자동화 시퀀스가 렌더 타이밍과 어긋나면 budget 조정이 필요할 수 있다.

### 9. 작업 메모

- `wrong-to-review` smoke는 1문제를 일부러 3번 틀려 오답을 만든 뒤 Review 목록으로 넘긴다.
- `wrong-to-review-complete` smoke는 같은 흐름 뒤에 Review를 자동 시작해 복습 완료 화면까지 간다.
- Review는 override 데이터가 있을 때 storage 대신 해당 데이터를 기준으로 목록/복습 화면을 렌더링한다.

### 10. 인수인계 조건

- mini end-to-end smoke가 5회 수정 후에도 안정화되지 않으면 `docs/ops/HANDOVER.md`에 smoke 경로, 마지막 기대 문자열, 자동화 시퀀스를 함께 기록한다.
