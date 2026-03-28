# Phase 4 Phonics Audio

### 작업 이름

- 작업 ID: `phase4-phonics-audio`
- 작업 제목: `Phase 4 파닉스 소리 듣기 기능 구현`
- 상태: `done`
- 담당 범위: `Web Speech API 기반 소리 듣기 + 퀴즈 화면 연결`

### 1. 목표

- 파닉스 단원에서 글자와 낱말을 눈으로만 보지 않고, 브라우저 음성으로 다시 들을 수 있게 만든다.

### 2. 배경

- `phase4-phonics-a-unit`으로 파닉스 A 전용 시각 카드가 열렸다.
- 다음으로 가장 가치 있는 확장은 파닉스의 핵심인 소리 경험을 가볍게 붙이는 것이다.
- `PLANS.md`의 Phase 4c와 직접 연결된다.

### 3. 영향 범위

- 수정 대상 파일: `src/components/Quiz/**`, `src/hooks/**`, `src/models/**`, `tests/**`
- 영향 받는 문서: `PLANS.md`, `docs/product-specs/quiz-system.md`
- 영향 받는 기능: 파닉스 퀴즈 화면, 브라우저 음성 재생, 미지원 브라우저 안내

### 4. 비포함 범위

- 음성 인식
- 발음 정확도 평가
- 자동 재생
- 브라우저 수동 검증

### 5. 완료 기준

- 파닉스 카드가 있는 문제에서 `소리 듣기` 버튼이 보인다.
- 지원 브라우저에서는 Web Speech API로 영어 글자 또는 낱말 재생을 시도한다.
- 미지원 브라우저에서는 앱이 깨지지 않고 안내 문구만 보인다.
- 문제 이동, 다시 풀기, 화면 이탈 시 재생이 정리된다.
- `npm run check`가 성공한다.

### 6. 검증 방법

- `npm run check`
- `speechModel` 테스트 확인
- 파닉스 카드가 있는 질문에서 오디오 프롬프트 생성 로직 확인

### 7. 선행 조건 / 의존성

- 필요한 문서 결정: `PLANS.md`, `docs/product-specs/quiz-system.md`
- 필요한 파일/구조: `src/components/Quiz/QuizSession.jsx`, `src/components/Quiz/QuestionVisual.jsx`
- 사용자 확인 필요 여부: 없음

### 8. 리스크

- 브라우저마다 음성 엔진과 보이스 목록이 달라 실제 발음 결과가 조금 다를 수 있다.
- 지원 여부가 불안정한 환경에서는 버튼이 보여도 재생 실패가 날 수 있다.

### 9. 작업 메모

- `speechModel.js`로 지원 여부, 보이스 선택, 파닉스 오디오 프롬프트 생성 로직을 분리했다.
- `useSpeechSynthesis.js`로 브라우저 음성 재생과 정리 로직을 감쌌다.
- 질문이 바뀌거나 다시 시작할 때 기존 음성이 겹치지 않도록 `cancel()` 정리를 넣었다.

### 10. 인수인계 조건

- 특정 브라우저에서 음성 재생 실패가 5회 수정 후에도 해결되지 않으면 `docs/ops/HANDOVER.md`에 브라우저 정보, 재현 순서, 실패 메시지를 함께 기록한다.
