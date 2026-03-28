# Phase 4 Arithmetic Generator Units

### 작업 이름

- 작업 ID: `phase4-arithmetic-generator-units`
- 작업 제목: `Phase 4 덧셈/뺄셈 생성형 단원 구현`
- 상태: `done`
- 담당 범위: `생성형 문제 모델 + 덧셈/뺄셈 단원 + 시각 카드 + 퀴즈 엔진 연결`

### 1. 목표

- 수학에 첫 생성형 문제 단원을 추가해 정적 JSON 단원 밖으로 퀴즈 엔진 범위를 넓힌다.

### 2. 배경

- 지금까지는 문항 데이터가 주로 JSON 기반으로 확장되었다.
- 다음으로 가장 가치 있는 방향은 `덧셈/뺄셈 자동 생성` 패턴을 열어 이후 생성형 수학 단원 확장을 쉽게 만드는 것이다.
- `PLANS.md`의 Phase 4e와 직접 연결된다.

### 3. 영향 범위

- 수정 대상 파일: `src/models/**`, `src/hooks/**`, `src/components/Quiz/**`, `src/data/unitRegistry.js`, `src/pages/Math/**`, `src/pages/Home/**`, `tests/**`
- 영향 받는 문서: `PLANS.md`, `docs/product-specs/quiz-system.md`
- 영향 받는 기능: 생성형 수학 퀴즈, 수학 단원 선택, 기록/보상/오답 흐름

### 4. 비포함 범위

- 곱셈 생성형 문제
- 자리올림/받아내림 심화 규칙
- 사용자 난이도 선택
- 브라우저 수동 검증

### 5. 완료 기준

- `덧셈 20까지`, `뺄셈 20까지` 단원이 수학 목록에서 시작 가능 상태로 열린다.
- 두 단원은 정적 JSON가 아니라 문제 생성 함수로 문항 묶음을 만든다.
- 생성형 문제도 기존 퀴즈/저장/보상/오답 흐름에 그대로 연결된다.
- 계산식을 보여주는 전용 시각 카드가 동작한다.
- `npm run check`가 성공한다.

### 6. 검증 방법

- `npm run check`
- `arithmeticModel.test.js` 확인
- 단원 레지스트리에서 생성형 단원 연결 확인

### 7. 선행 조건 / 의존성

- 필요한 문서 결정: `PLANS.md`, `docs/product-specs/quiz-system.md`
- 필요한 파일/구조: `src/hooks/useQuiz.js`, `src/data/unitRegistry.js`
- 사용자 확인 필요 여부: 없음

### 8. 리스크

- 생성형 문제 선택지가 너무 비슷하면 반복 피로감이 생길 수 있다.
- 훅이 정적 JSON만 기대하고 있으면 생성형 단원에서 빈 문제 상태가 날 수 있다.

### 9. 작업 메모

- `arithmeticModel.js`로 생성형 문제/선택지/힌트/시각 카드 로직을 분리했다.
- `useQuiz`가 `generateQuestions`를 가진 단원도 받아들이도록 확장했다.
- 덧셈/뺄셈은 20 안에서 연산하도록 범위를 고정해 초반 난도를 안정적으로 잡았다.

### 10. 인수인계 조건

- 생성형 문제에서 빈 문제 상태나 잘못된 선택지 문제가 5회 수정 후에도 해결되지 않으면 `docs/ops/HANDOVER.md`에 재현 순서, 생성된 예시 문항, 실패한 가설을 함께 기록한다.
