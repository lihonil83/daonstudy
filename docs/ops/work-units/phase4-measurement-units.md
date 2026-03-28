# Phase 4 Measurement Units

### 작업 이름

- 작업 ID: `phase4-measurement-units`
- 작업 제목: `Phase 4 길이/무게 단위 단원 구현`
- 상태: `done`
- 담당 범위: `길이 단위 + 무게 단위 데이터 + 시각 카드 + 수학 단원 연결`

### 1. 목표

- 수학 과목에 길이와 무게 단위를 실제 단원으로 추가해 구구단, 시계 읽기 다음 학습 축을 만든다.

### 2. 배경

- 영어는 파닉스 A/B/C까지 확장되어 과목 밀도가 높아졌다.
- 다음으로 가장 가치 있는 방향은 수학 쪽 콘텐츠 폭을 넓혀 과목 균형을 맞추는 것이다.
- `PLANS.md`의 Phase 4d와 직접 연결된다.

### 3. 영향 범위

- 수정 대상 파일: `src/data/math/**`, `src/components/Quiz/**`, `src/data/unitRegistry.js`, `src/pages/Math/**`, `src/pages/Home/**`, `tests/**`
- 영향 받는 문서: `docs/product-specs/quiz-system.md`
- 영향 받는 기능: 수학 단원 선택, 길이/무게 퀴즈, 기록/보상/오답 흐름

### 4. 비포함 범위

- 소수점 단위 변환
- 시간 단위 변환
- 드래그형 자/저울 UI
- 브라우저 수동 검증

### 5. 완료 기준

- `길이 단위`, `무게 단위` 단원이 수학 목록에서 시작 가능 상태로 열린다.
- 각 단원은 20문제 이상을 가지고 10문제 랜덤 출제가 동작한다.
- 단위 카드를 보여주는 전용 시각 요소가 동작한다.
- 기존 저장/보상/오답 복습 흐름이 유지된다.
- `npm run check`가 성공한다.

### 6. 검증 방법

- `npm run check`
- `measurementData.test.js` 확인
- 단원 데이터와 레지스트리 확인

### 7. 선행 조건 / 의존성

- 필요한 문서 결정: `PLANS.md`, `docs/product-specs/quiz-system.md`
- 필요한 파일/구조: `src/components/Quiz/QuestionVisual.jsx`, `src/data/unitRegistry.js`
- 사용자 확인 필요 여부: 없음

### 8. 리스크

- 단위 변환이 반복되면 문제 체감이 비슷해질 수 있다.
- m/cm와 kg/g를 동시에 열면 처음엔 단위를 헷갈릴 수 있다.

### 9. 작업 메모

- 길이 단위와 무게 단위를 각각 20문제로 구성했다.
- `measurement-card` 시각 타입을 추가해 단위를 눈으로 먼저 떠올리게 했다.
- 수학과 홈 문구를 현재 열린 수학 단원 상태에 맞게 정리했다.

### 10. 인수인계 조건

- 단위 데이터 정합성이나 시각 카드 표시 문제가 5회 수정 후에도 해결되지 않으면 `docs/ops/HANDOVER.md`에 재현 순서와 실패한 예시 문제를 함께 기록한다.
