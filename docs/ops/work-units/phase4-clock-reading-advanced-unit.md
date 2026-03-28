# Phase 4 Clock Reading Advanced Unit

### 작업 이름

- 작업 ID: `phase4-clock-reading-advanced-unit`
- 작업 제목: `Phase 4 시계 읽기 심화 단원 구현`
- 상태: `done`
- 담당 범위: `15분/45분 시계 읽기 데이터 + 수학 단원 연결`

### 1. 목표

- 첫 시계 읽기 단원을 정각/30분에서 끝내지 않고 15분/45분까지 확장해 실제 학습 단원 흐름으로 완성한다.

### 2. 배경

- 시계 읽기 기본 단원과 전용 시각 UI는 이미 구현되었다.
- 다음으로 가장 가치 있는 확장은 같은 UI를 활용해 시간 읽기 난도를 자연스럽게 높이는 것이다.

### 3. 영향 범위

- 수정 대상 파일: `src/data/math/**`, `src/data/unitRegistry.js`, `src/pages/Math/**`, `src/pages/Home/**`, `tests/**`
- 영향 받는 문서: `PLANS.md`
- 영향 받는 기능: 수학 단원 선택, 시계 읽기 심화 퀴즈, 진도/기록 흐름

### 4. 비포함 범위

- 5분 단위 전체 시각 읽기
- 디지털 시계 모드
- 드래그/입력형 문제
- Windows 브라우저 수동 검증

### 5. 완료 기준

- `시계 읽기 심화` 단원이 수학 목록에서 시작 가능 상태로 열린다.
- 15분/45분 문제 20개 이상이 있고 10문제 랜덤 출제가 동작한다.
- 기존 시계 시각 UI를 그대로 사용하면서 저장/보상/오답 흐름이 유지된다.
- `npm run check`가 성공한다.

### 6. 검증 방법

- `npm run check`
- 단원 데이터와 레지스트리 확인

### 7. 선행 조건 / 의존성

- 필요한 문서 결정: `PLANS.md`, `docs/product-specs/quiz-system.md`
- 필요한 파일/구조: `src/data/math/clock-reading.json`, `src/data/unitRegistry.js`
- 사용자 확인 필요 여부: 없음

### 8. 리스크

- 45분 시각은 짧은 바늘 위치 해석이 어려워 초반 난도가 급격히 올라갈 수 있다.
- 선택지가 너무 비슷하면 문제 피로감이 생길 수 있다.

### 9. 작업 메모

- `clock-reading-advanced.json`에 15분/45분 시각 문제 20개를 추가했다.
- `unitRegistry.js`에 `시계 읽기 심화` 단원을 연결해 즉시 시작 가능 상태로 열었다.
- `Math.jsx` 문구를 현재 수학 단원 상태에 맞게 정리했다.
- `tests/clockReadingAdvancedData.test.js`로 시각 분포와 정답/선택지 정합성을 자동 검증한다.

### 10. 인수인계 조건

- 시계 심화 단원에서 시각 자료와 정답 텍스트가 5회 수정 후에도 어긋나면 `docs/ops/HANDOVER.md`에 재현 순서와 함께 기록한다.
