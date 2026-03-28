# Phase 4 Unit Expansion Round 1

### 작업 이름

- 작업 ID: `phase4-unit-expansion-round1`
- 작업 제목: `Phase 4 1차 단원 확장`
- 상태: `done`
- 담당 범위: `수학 3단 구구단 + 영어 알파벳 소문자`

### 1. 목표

- 현재 퀴즈 엔진 위에 새 단원을 추가해 MVP 이후 콘텐츠 확장을 시작한다.

### 2. 배경

- Phase 3까지 완료되어 기본 학습 흐름은 동작한다.
- 다음 단계는 전용 UI 없이도 붙일 수 있는 단원을 늘려 학습 반복성을 높이는 것이다.

### 3. 영향 범위

- 수정 대상 파일: `src/data/unitRegistry.js`, `src/data/math/**`, `src/data/english/**`, `src/pages/Math/**`, `src/pages/English/**`
- 영향 받는 문서: `PLANS.md`, `docs/exec-plans/active/mvp-plan.md`
- 영향 받는 기능: 수학 단원 선택, 영어 단원 선택, 퀴즈 데이터 랜덤 출제

### 4. 비포함 범위

- 시계 읽기 전용 UI
- 파닉스 음성 기능
- 이미지 기반 단어 카드
- Windows 브라우저 수동 검증

### 5. 완료 기준

- `3단 구구단`과 `알파벳 소문자`가 단원 목록에서 시작 가능 상태로 보인다.
- 각 단원은 20문제 이상의 JSON 데이터를 갖고, 한 번의 플레이에서 10문제 랜덤 출제가 동작한다.
- 단원 선택 화면 문구가 현재 열려 있는 단원 상태와 맞는다.
- `npm run build`가 성공한다.

### 6. 검증 방법

- `node scripts/validate-docs.mjs`
- `npm run build`
- 단원 레지스트리와 JSON 데이터 구조 확인

### 7. 선행 조건 / 의존성

- 필요한 문서 결정: `PLANS.md`, `docs/exec-plans/active/mvp-plan.md`, `docs/product-specs/quiz-system.md`
- 필요한 파일/구조: `src/data/unitRegistry.js`, `src/pages/Math/Math.jsx`, `src/pages/English/English.jsx`
- 사용자 확인 필요 여부: 없음

### 8. 리스크

- 데이터 형식이 기존 퀴즈 스키마와 어긋나면 단원 진입 시 런타임 오류가 발생할 수 있다.
- 같은 계열 단원만 늘리면 콘텐츠 다양성은 아직 제한적일 수 있다.

### 9. 작업 메모

- `3단 구구단` JSON 데이터 20문제를 추가하고 단원 레지스트리에서 시작 가능 상태로 열었다.
- `알파벳 소문자` JSON 데이터 20문제를 추가하고 단원 레지스트리에서 시작 가능 상태로 열었다.
- 수학/영어 목록 화면과 홈 카드 문구를 현재 단원 상태에 맞게 수정했다.
- 검증 완료:
  - `node scripts/validate-docs.mjs`
  - `npm run build`

### 10. 인수인계 조건

- 새 단원 로딩 오류나 JSON 형식 오류가 5회 수정 시도 후에도 남아 있으면 `docs/ops/HANDOVER.md`에 재현 순서와 함께 기록한다.
