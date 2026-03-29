# 작업 단위

- 작업 제목: `Phase 6 덧셈/뺄셈 단원 제거`
- 상태: `done`
- 담당 범위: `수학 단원 레지스트리 + 홈/수학/진도 진입 흐름 + 현재 제품 문서 + smoke 하네스 정리`

## 목표

현재 실사용 범위에서 덧셈/뺄셈 단원을 제거하고, 추천 흐름과 내부 검증도 남은 단원 기준으로 일관되게 맞춘다.

## 영향 범위

- `src/data/unitRegistry.js`
- `src/models/homeModel.js`
- `src/pages/Home/Home.jsx`
- `src/pages/Math/Math.jsx`
- `src/pages/Progress/Progress.jsx`
- `src/components/Quiz/QuestionVisual.jsx`
- `src/pages/Smoke/*`
- `docs/exec-plans/active/mvp-plan.md`
- `docs/product-specs/quiz-system.md`

## 비포함 범위

- 과거 작업 기록 문서의 상세 구현 서술 전면 수정
- 신규 수학 단원 추가
- 보상 규칙 변경

## 완료 기준

- 수학 목록에 덧셈/뺄셈 단원이 노출되지 않는다.
- 첫 진입 추천이 `2단 구구단`부터 시작하도록 바뀐다.
- 숨겨진 smoke 라우트도 덧셈/뺄셈 문구 없이 동작한다.
- 현재 제품 문서가 남은 단원 범위와 모순되지 않는다.

## 검증 방법

- `npm run check`
- `npm run release:prep`

## 인수인계 조건

- 최신 release bundle 이 생성되어 Windows 실행 파일이 포함된다.
- 파닉스 발음 중복 수정과 덧셈/뺄셈 제거가 같은 번들에 함께 반영된다.
