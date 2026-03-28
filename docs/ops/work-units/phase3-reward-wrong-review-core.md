# Phase 3 Reward And Wrong Review Core

### 작업 이름

- 작업 ID: `phase3-reward-wrong-review-core`
- 작업 제목: `Phase 3 보상 저장과 오답 복습 흐름 연결`
- 상태: `done`
- 담당 범위: `useReward + useWrongAnswers + 홈 대시보드 + 복습 페이지`

### 1. 목표

- 퀴즈 완료 시 XP, 레벨, 뱃지, 오답 저장이 함께 반영되고 홈/복습 페이지에서 실제 상태를 확인할 수 있게 만든다.

### 2. 배경

- `phase3-progress-storage-core`로 점수/진도 저장은 연결되었지만, MVP 완성을 위해서는 보상과 오답 복습 흐름이 이어져야 한다.
- `docs/product-specs/gamification.md`, `docs/product-specs/wrong-answer-review.md`의 핵심 사용 경험이 아직 빈 셸 상태다.

### 3. 영향 범위

- 수정 대상 파일: `src/hooks/useReward.js`, `src/hooks/useWrongAnswers.js`, `src/hooks/useQuiz.js`, `src/components/Quiz/**`, `src/pages/Home/**`, `src/pages/Review/**`
- 영향 받는 문서: `docs/product-specs/gamification.md`, `docs/product-specs/wrong-answer-review.md`, `PLANS.md`
- 영향 받는 기능: XP/레벨/뱃지 저장, 오답 저장, 복습 퀴즈, 홈 대시보드, 복습 목록

### 4. 비포함 범위

- 사운드 효과
- 홈 대시보드 애니메이션 연출
- 데이터 백업/복원
- Windows 브라우저 수동 검증

### 5. 완료 기준

- 퀴즈 완료 시 `eduapp_reward`, `eduapp_wrong`가 스펙에 맞게 갱신된다.
- 홈 대시보드에서 현재 레벨, XP 진행, 뱃지 상태, 복습 알림을 확인할 수 있다.
- 복습 페이지에서 미복습/복습 완료 목록이 보이고 개별/전체 복습을 시작할 수 있다.
- 복습 퀴즈 완료 시 맞힌 문제는 복습 완료 처리되고, 보너스 XP가 반영된다.
- `npm run build`가 성공한다.

### 6. 검증 방법

- `node scripts/validate-docs.mjs`
- `npm run build`
- 저장 흐름과 화면 렌더 코드 확인

### 7. 선행 조건 / 의존성

- 필요한 문서 결정: `docs/product-specs/gamification.md`, `docs/product-specs/wrong-answer-review.md`, `docs/ops/work-units/phase3-progress-storage-core.md`
- 필요한 파일/구조: `src/components/Quiz/`, `src/pages/Home/`, `src/pages/Review/`, `src/hooks/`
- 사용자 확인 필요 여부: 없음

### 8. 리스크

- 보상 저장과 오답 저장이 퀴즈 완료 시점에 중복 호출되면 XP나 항목 수가 두 번 반영될 수 있다.
- 복습 페이지가 일반 퀴즈와 너무 다르게 분기되면 공통 퀴즈 UI 유지가 어려워질 수 있다.

### 9. 작업 메모

- `useReward`로 XP, 레벨, 뱃지 저장과 레벨업/신규 뱃지 표시를 연결했다.
- `useWrongAnswers`로 오답 저장, 복습 완료 처리, 완료 기록 비우기 흐름을 연결했다.
- 홈에서 레벨/XP/뱃지/복습 알림을 확인할 수 있게 만들었다.
- 복습 페이지에서 개별 복습과 전체 복습을 시작할 수 있게 만들었다.
- 검증 완료:
  - `node scripts/validate-docs.mjs`
  - `npm run build`

### 10. 인수인계 조건

- 레벨업/뱃지 중복 지급 또는 복습 상태 갱신 오류가 5회 수정 시도 후에도 해결되지 않으면 `docs/ops/HANDOVER.md`에 기록한다.
- 마지막 저장 예시, 재현 순서, 원인 추정을 남긴다.
