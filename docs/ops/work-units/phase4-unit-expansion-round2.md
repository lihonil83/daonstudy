# Phase 4 Unit Expansion Round 2

### 작업 이름

- 작업 ID: `phase4-unit-expansion-round2`
- 작업 제목: `Phase 4 2차 단원 확장과 진도 가시성 개선`
- 상태: `done`
- 담당 범위: `4단 구구단 + 영어 기초 단어(색깔/동물) + 진도 페이지 CTA`

### 1. 목표

- 추가 단원을 실제로 열고, 진도 페이지에서 아직 플레이하지 않은 새 단원도 바로 시작할 수 있게 만든다.

### 2. 배경

- 1차 확장으로 3단 구구단과 알파벳 소문자를 열었다.
- 다음 단계는 콘텐츠 밀도를 조금 더 높이고, 진도 화면이 단순 기록판을 넘어 다음 학습의 출발점 역할도 하게 만드는 것이다.

### 3. 영향 범위

- 수정 대상 파일: `src/data/unitRegistry.js`, `src/data/math/**`, `src/data/english/**`, `src/pages/Progress/**`, `src/pages/Home/**`, `src/pages/Math/**`, `src/pages/English/**`, `src/hooks/useReward.js`
- 영향 받는 문서: `docs/product-specs/gamification.md`
- 영향 받는 기능: 단원 선택, 영어 기초 단어 퀴즈, 진도 페이지 CTA, 영어 도전 뱃지 표기

### 4. 비포함 범위

- 이미지 문제 UI
- 음성/발음 기능
- 자동 문제 생성
- Windows 브라우저 수동 검증

### 5. 완료 기준

- `4단 구구단`, `색깔 단어`, `동물 단어`가 시작 가능 상태로 열린다.
- 각 신규 단원은 20문제 이상이며 기존 퀴즈 엔진에서 정상 동작한다.
- 진도 페이지에서 아직 안 푼 새 단원이 분명하게 보이고, 바로 시작 버튼으로 이동할 수 있다.
- 영어 도전 뱃지 표기가 새 영어 단원 구조와 어긋나지 않는다.
- `npm run build`가 성공한다.

### 6. 검증 방법

- `node scripts/validate-docs.mjs`
- `npm run build`
- 단원 레지스트리, 진도 페이지 CTA, 보상 표기 코드 확인

### 7. 선행 조건 / 의존성

- 필요한 문서 결정: `PLANS.md`, `docs/exec-plans/active/mvp-plan.md`, `docs/product-specs/quiz-system.md`, `docs/product-specs/gamification.md`
- 필요한 파일/구조: `src/data/unitRegistry.js`, `src/pages/Progress/Progress.jsx`, `src/hooks/useReward.js`
- 사용자 확인 필요 여부: 없음

### 8. 리스크

- 기초 단어를 텍스트 4지선다로 먼저 구현하면 시각적 학습 효과는 아직 제한적일 수 있다.
- 진도 페이지에 CTA를 추가하면서 정보 밀도가 높아지면 모바일에서 답답해질 수 있다.

### 9. 작업 메모

- `4단 구구단` 20문제를 추가하고 바로 시작 가능한 수학 단원으로 열었다.
- 영어 `색깔 단어`, `동물 단어` 20문제씩을 추가하고 시작 가능 상태로 열었다.
- 진도 페이지에 과목별 시작 가능/새 단원 요약, 단원 상태 강조, `바로 시작하기`/`다시 풀기` CTA를 추가했다.
- 영어 단원 확장에 맞춰 보상 뱃지 표기를 `영어 도전자`로 정리했다.
- 검증 완료:
  - `node scripts/validate-docs.mjs`
  - `npm run build`

### 10. 인수인계 조건

- 신규 단원 라우팅 오류 또는 진도 CTA 동작 오류가 5회 수정 시도 후에도 남아 있으면 `docs/ops/HANDOVER.md`에 재현 순서와 함께 기록한다.
