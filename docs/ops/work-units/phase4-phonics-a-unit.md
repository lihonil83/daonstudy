# Phase 4 Phonics A Unit

### 작업 이름

- 작업 ID: `phase4-phonics-a-unit`
- 작업 제목: `Phase 4 영어 파닉스 A 단원 구현`
- 상태: `done`
- 담당 범위: `파닉스 A 데이터 + 전용 시각 카드 + 영어 단원 연결`

### 1. 목표

- 영어 쪽에도 첫 전용 시각 단원을 열어서 글자와 낱말의 첫소리를 연결하는 파닉스 A 학습 흐름을 만든다.

### 2. 배경

- 수학은 시계 읽기 단원으로 전용 UI 패턴이 이미 열렸다.
- 영어도 같은 수준의 확장 포인트가 필요했고, `PLANS.md`의 Phase 4c와 직접 연결된다.
- 음성 기능은 브라우저별 차이가 있어 이번 라운드에서는 전용 시각 카드까지를 우선 범위로 잡는다.

### 3. 영향 범위

- 수정 대상 파일: `src/components/Quiz/**`, `src/data/english/**`, `src/data/unitRegistry.js`, `src/pages/English/**`, `src/pages/Home/**`, `tests/**`
- 영향 받는 문서: `PLANS.md`, `docs/product-specs/quiz-system.md`
- 영향 받는 기능: 영어 단원 선택, 파닉스 A 퀴즈, 기록/보상/오답 복습 흐름

### 4. 비포함 범위

- Web Speech API 기반 음성 재생
- 마이크 입력 또는 발음 판정
- B, C 등 다음 파닉스 단원
- 브라우저 수동 검증

### 5. 완료 기준

- `파닉스 A` 단원이 영어 목록에서 시작 가능 상태로 열린다.
- 파닉스 A 문제 20개 이상이 있고, 10문제 랜덤 출제가 동작한다.
- 전용 시각 카드가 글자 중심과 낱말 중심 두 형태를 모두 보여준다.
- 기존 저장/보상/오답 복습 흐름이 유지된다.
- `npm run check`가 성공한다.

### 6. 검증 방법

- `npm run check`
- 단원 데이터와 레지스트리 확인
- 파닉스 카드 전용 테스트 확인

### 7. 선행 조건 / 의존성

- 필요한 문서 결정: `PLANS.md`, `docs/product-specs/quiz-system.md`
- 필요한 파일/구조: `src/components/Quiz/QuestionVisual.jsx`, `src/data/unitRegistry.js`
- 사용자 확인 필요 여부: 없음

### 8. 리스크

- 파닉스라는 이름에 비해 음성 기능이 없어서 범위 오해가 생길 수 있다.
- 글자 카드와 낱말 카드가 너무 직접적이면 문제 난도가 지나치게 쉬워질 수 있다.

### 9. 작업 메모

- `phonics-a.json`에 글자 고르기 10문제, 낱말 고르기 10문제를 추가했다.
- `QuestionVisual`에 `phonics-card` 타입을 추가해 영어 전용 시각 카드 패턴을 열었다.
- `PLANS.md`의 파닉스 항목은 현재 구현 상태에 맞춰 `전용 시각 카드 우선, 음성은 후속`으로 정리했다.

### 10. 인수인계 조건

- 파닉스 카드 표시 또는 데이터 정합성이 5회 수정 후에도 해결되지 않으면 `docs/ops/HANDOVER.md`에 재현 순서와 실패한 가설을 함께 기록한다.
