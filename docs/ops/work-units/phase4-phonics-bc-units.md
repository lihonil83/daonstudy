# Phase 4 Phonics B C Units

### 작업 이름

- 작업 ID: `phase4-phonics-bc-units`
- 작업 제목: `Phase 4 파닉스 B/C 단원 확장`
- 상태: `done`
- 담당 범위: `파닉스 B/C 데이터 + 영어 단원 연결 + 데이터 검증`

### 1. 목표

- 파닉스 학습 흐름이 A 한 단원에서 멈추지 않도록 B, C 단원을 이어서 열어 영어 전용 콘텐츠 묶음을 만든다.

### 2. 배경

- `phase4-phonics-a-unit`, `phase4-phonics-audio`로 파닉스 A와 소리 듣기 흐름이 준비되었다.
- 같은 구조를 바로 확장하는 것이 가장 적은 비용으로 가장 큰 콘텐츠 밀도를 만든다.

### 3. 영향 범위

- 수정 대상 파일: `src/data/english/**`, `src/data/unitRegistry.js`, `src/pages/English/**`, `src/pages/Home/**`, `tests/**`
- 영향 받는 문서: `docs/product-specs/quiz-system.md`
- 영향 받는 기능: 영어 단원 선택, 파닉스 B/C 퀴즈, 파닉스 소리 듣기

### 4. 비포함 범위

- 파닉스 D 이후 단원
- 음성 인식
- 파닉스 전용 뱃지 추가
- 브라우저 수동 검증

### 5. 완료 기준

- `파닉스 B`, `파닉스 C` 단원이 영어 목록에서 시작 가능 상태로 열린다.
- 각 단원은 20문제 이상을 가지고 10문제 랜덤 출제가 동작한다.
- 기존 파닉스 카드와 소리 듣기 흐름이 B/C 단원에서도 그대로 재사용된다.
- `npm run check`가 성공한다.

### 6. 검증 방법

- `npm run check`
- 단원 데이터와 레지스트리 확인
- `phonicsBCData.test.js` 확인

### 7. 선행 조건 / 의존성

- 필요한 문서 결정: `docs/product-specs/quiz-system.md`
- 필요한 파일/구조: `src/data/english/phonics-a.json`, `src/components/Quiz/QuestionVisual.jsx`
- 사용자 확인 필요 여부: 없음

### 8. 리스크

- 파닉스 낱말이 너무 어려우면 초반 학습 난도가 올라갈 수 있다.
- 단어 목록이 겹치거나 선택지가 단순하면 반복 피로감이 생길 수 있다.

### 9. 작업 메모

- 파닉스 A와 같은 형식으로 B/C 각 20문제씩 추가했다.
- 각 단원은 `word` 10문제, `letter` 10문제로 균형을 맞췄다.
- 홈과 영어 페이지 문구도 현재 열린 영어 단원 상태에 맞게 갱신했다.

### 10. 인수인계 조건

- 파닉스 B/C 데이터 정합성 문제가 5회 수정 후에도 해결되지 않으면 `docs/ops/HANDOVER.md`에 재현 순서와 실패한 선택지 조합을 함께 기록한다.
