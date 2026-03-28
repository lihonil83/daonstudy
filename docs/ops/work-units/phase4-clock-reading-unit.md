# Phase 4 Clock Reading Unit

### 작업 이름

- 작업 ID: `phase4-clock-reading-unit`
- 작업 제목: `Phase 4 시계 읽기 단원 구현`
- 상태: `done`
- 담당 범위: `시계 읽기 데이터 + 전용 시각 UI + 수학 단원 연결`

### 1. 목표

- 수학 `시계 읽기` 단원을 실제로 플레이 가능한 상태로 추가하고, 시계 얼굴을 보여주는 전용 시각 UI를 제공한다.

### 2. 배경

- Phase 4 후보 단원 중 `시계 읽기`는 첫 전용 UI 단원이라 확장 구조를 검증하기에 좋다.
- 현재 객관식 엔진과 저장/보상/오답 흐름은 이미 안정화되어 있다.

### 3. 영향 범위

- 수정 대상 파일: `src/data/math/**`, `src/data/unitRegistry.js`, `src/components/Quiz/**`, `src/pages/Home/**`, `src/pages/Math/**`
- 영향 받는 문서: `PLANS.md`
- 영향 받는 기능: 수학 단원 선택, 퀴즈 화면 시계 렌더링, 진도/기록 흐름

### 4. 비포함 범위

- 드래그로 바늘 움직이기
- 시간 직접 입력형 문제
- 시/분 단위 음성 안내
- Windows 브라우저 수동 검증

### 5. 완료 기준

- `시계 읽기` 단원이 수학 목록에서 시작 가능 상태로 열린다.
- 시계 얼굴과 바늘이 문제 데이터에 맞게 렌더링된다.
- 20문제 이상 데이터가 있고 10문제 랜덤 출제가 동작한다.
- 기존 저장/보상/오답 흐름이 그대로 유지된다.
- `npm run check`가 성공한다.

### 6. 검증 방법

- `npm run check`
- 시계 시각 렌더링 코드와 단원 레지스트리 확인

### 7. 선행 조건 / 의존성

- 필요한 문서 결정: `PLANS.md`, `docs/product-specs/quiz-system.md`
- 필요한 파일/구조: `src/components/Quiz/QuizSession.jsx`, `src/data/unitRegistry.js`
- 사용자 확인 필요 여부: 없음

### 8. 리스크

- 시계 바늘 계산이 어긋나면 정답과 시각 자료가 맞지 않을 수 있다.
- 시각 UI가 모바일에서 너무 커지면 선택지 영역이 답답해질 수 있다.

### 9. 작업 메모

- `src/data/math/clock-reading.json`에 시계 읽기 20문제를 추가하고 단원 레지스트리에서 시작 가능 상태로 열었다.
- `src/components/Quiz/QuestionVisual.jsx`와 `QuestionVisual.module.css`를 추가해 시계 그림을 렌더링하는 전용 시각 UI를 구현했다.
- 시계 문제도 오답 복습에서 같은 시각 자료를 다시 보여줄 수 있도록 `visual` 정보를 퀴즈 결과와 오답 데이터에 함께 저장하도록 확장했다.
- `src/models/clockModel.js`와 관련 테스트를 추가해 바늘 각도 계산을 자동 검증하도록 만들었다.
- 검증 완료:
  - `npm run check`

### 10. 인수인계 조건

- 시각 렌더링과 정답 데이터가 맞지 않는 문제가 5회 수정 후에도 남으면 `docs/ops/HANDOVER.md`에 재현 순서와 함께 기록한다.
