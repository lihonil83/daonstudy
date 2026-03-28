# Phase 5 Storage-Aware Smoke

### 작업 이름

- 작업 ID: `phase5-storage-aware-smoke`
- 작업 제목: `Phase 5 localStorage 반영까지 확인하는 storage-aware smoke 추가`
- 상태: `done`
- 담당 범위: `storage 유틸 정리, 실제 저장 흐름 smoke, 저장 결과 summary 검증`

### 1. 목표

- 실제 localStorage 반영까지 포함해 퀴즈 기록, 진도, 보상, 오답 복습 상태가 연결되는지 브라우저에서 자동 검증한다.

### 2. 배경

- mini end-to-end smoke는 오답 생성과 review 연결 흐름을 잘 검증했지만, storage에 실제로 무엇이 남는지는 직접 확인하지 않았다.
- 브라우저 DOM만으로 저장 결과를 읽어보려면 실제 훅을 그대로 사용하는 summary 단계가 필요하다.

### 3. 영향 범위

- 수정 대상 파일: `src/utils/storage.js`, `src/components/Quiz/**`, `src/pages/Review/**`, `src/pages/Smoke/**`, `src/App.jsx`, `tests/**`, `scripts/browser-smoke.mjs`
- 영향 받는 문서: `docs/ops/work-units/**`
- 영향 받는 기능: storage-aware smoke, 실제 저장 결과 summary, smoke cleanup

### 4. 비포함 범위

- 브라우저 프로필을 공유하는 완전한 외부 end-to-end 테스트
- 여러 과목/여러 오답이 섞인 복합 저장 검증
- 서버 동기화나 원격 저장 검증

### 5. 완료 기준

- smoke 라우트가 실제 저장을 사용해 quiz -> review -> summary 흐름을 수행한다.
- summary에서 점수, 진도, XP, 뱃지, 복습 완료 상태를 DOM으로 확인할 수 있다.
- `npm run smoke:browser`가 storage 결과 요약을 검증한다.

### 6. 검증 방법

- `npm run smoke:browser`
- `npm run check`

### 7. 선행 조건 / 의존성

- 필요한 문서 결정: 없음
- 필요한 파일/구조: `src/utils/storage.js`, `src/components/Quiz/QuizSession.jsx`, `src/pages/Review/Review.jsx`, `src/pages/Smoke/**`
- 사용자 확인 필요 여부: 로컬 preview와 headless Chrome 실행 권한 필요

### 8. 리스크

- smoke가 실제 storage를 쓰는 만큼 시작/종료 시 정리(cleanup)가 빠지면 다음 검증에 영향을 줄 수 있다.
- summary 기대값이 저장 모델 변경과 함께 업데이트되지 않으면 false negative가 날 수 있다.

### 9. 작업 메모

- storage-aware smoke는 실제 저장을 켠 상태로 퀴즈와 복습을 순서대로 진행한다.
- 마지막 summary에서 `퀴즈 기록 1개`, `총 XP 70`, `복습 완료 1개`, `뱃지 1/10 수집`을 확인한다.
- summary 스냅샷을 만든 뒤 storage를 정리해 다음 smoke 실행에 흔적이 남지 않도록 했다.

### 10. 인수인계 조건

- storage-aware smoke가 5회 수정 후에도 안정화되지 않으면 `docs/ops/HANDOVER.md`에 마지막 기대 문자열, 저장 키 상태, cleanup 여부를 함께 기록한다.
