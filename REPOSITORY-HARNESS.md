# REPOSITORY-HARNESS.md

## 목적

이 문서는 이 저장소의 **repository-level harness**다.
문서가 서로 충돌하지 않게 유지하고, 어떤 변경이 생겼을 때 어디까지 함께 수정해야 하는지, 무엇을 검증해야 하는지를 정의한다.

`CONSTITUTION.md`가 상위 원칙을 정의하고, 앱 기능의 상세 동작은 각 스펙 문서가 담당한다.
이 문서는 그 사이에서 문서들을 **정본 체계로 묶는 운영 규칙**을 담당한다.

---

## 저장소 원칙

1. 루트 문서는 **요약과 방향**을 담당한다.
2. `docs/` 아래 문서는 **상세 스펙과 실행 계획**을 담당한다.
3. 같은 주제를 두 문서 이상이 다룰 때는 **정본 문서가 우선**이다.
4. 요약 문서는 상세 문서의 내용을 축약할 수는 있지만, **다르게 말하면 안 된다**.
5. 문서 간 불일치가 발견되면 다음 작업 전에 먼저 정리한다.

---

## 운영 용어 정의

- **작업 단위**: 하나의 완료 기준으로 성공/실패를 판별할 수 있는 최소 변경 묶음
- **같은 문제**: 같은 완료 기준이 계속 실패하거나, 같은 오류 메시지/증상이 검증 후에도 유지되는 상태
- **수정 시도 1회**: 원인 가설 수립 → 수정 수행 → 검증 실행 → 결과 정리까지 끝난 1개의 사이클
- **인수인계**: 다음 작업자가 같은 맥락을 다시 조사하지 않고 바로 이어서 작업할 수 있도록 현재 상태를 기록해 넘기는 행위

---

## 문서 정본 체계

| 주제 | 정본 문서 | 보조 문서 | 규칙 |
|------|-----------|-----------|------|
| 저장소 헌법 | `CONSTITUTION.md` | `REPOSITORY-HARNESS.md`, `README.md`, `AGENTS.md` | 프로젝트 정체성, 기술 헌법, 문서 최상위 원칙은 여기 기준 |
| 저장소 운영 규칙 | `REPOSITORY-HARNESS.md` | `README.md`, `AGENTS.md` | 문서 역할, 변경 규칙, 검증 규칙은 여기 기준 |
| 작업 단위 템플릿 | `docs/ops/WORK-UNIT-TEMPLATE.md` | `REPOSITORY-HARNESS.md`, `docs/ops/HANDOVER.md` | 작업 분해, 완료 기준, 검증 방법의 기본 형식은 여기 기준 |
| 운영 기록 / 인수인계 | `docs/ops/HANDOVER.md` | `REPOSITORY-HARNESS.md`, `README.md` | 미해결 문제, 시도 기록, 다음 작업자 전달은 여기 기준 |
| 기술 구조 | `ARCHITECTURE.md` | `AGENTS.md`, `FRONTEND.md` | 폴더 구조, 실행 환경, localStorage 키, 큰 구조는 여기 기준 |
| 개발 규칙 | `AGENTS.md` | `FRONTEND.md` | 작업 원칙, 스택 제한, 코딩 규칙은 여기 기준 |
| UI 시각 시스템 | `DESIGN.md` | `FRONTEND.md` | 색상, 폰트, 간격, 애니메이션 기준은 여기 우선 |
| 프론트엔드 구현 패턴 | `FRONTEND.md` | `AGENTS.md`, `ARCHITECTURE.md` | 라우팅 구현, 컴포넌트/훅 패턴은 여기 기준 |
| 전체 로드맵 | `PLANS.md` | `docs/exec-plans/active/mvp-plan.md` | Phase 정의와 전체 흐름은 `PLANS.md` 기준 |
| 현재 MVP 실행 계획 | `docs/exec-plans/active/mvp-plan.md` | `PLANS.md` | 현재 만들 순서와 세부 실행 항목은 여기 기준 |
| 교육 원칙 | `docs/design-docs/core-beliefs.md` | `AGENTS.md` | UX 판단 기준과 톤은 여기 기준 |
| 퀴즈 시스템 | `docs/product-specs/quiz-system.md` | `ARCHITECTURE.md`, `docs/exec-plans/active/mvp-plan.md` | 문제 흐름, 힌트 규칙, `useQuiz` 계약은 여기 기준 |
| 진도/점수 기록 | `docs/product-specs/progress-tracker.md` | `ARCHITECTURE.md` | `eduapp_scores`, `eduapp_progress`, `useProgress` 계약은 여기 기준 |
| 보상/레벨 시스템 | `docs/product-specs/gamification.md` | `ARCHITECTURE.md` | `eduapp_reward`, XP, 뱃지, `useReward` 계약은 여기 기준 |
| 오답 복습 | `docs/product-specs/wrong-answer-review.md` | `ARCHITECTURE.md` | `eduapp_wrong`, 복습 흐름, `useWrongAnswers` 계약은 여기 기준 |

---

## 헌법 기반 고정 결정

아래 항목은 현재 저장소의 고정된 기준이며 `CONSTITUTION.md`와 일치해야 한다. 변경하려면 관련 문서를 한 번에 같이 수정해야 한다.

- MVP 범위: `수학 구구단 + 영어 알파벳`
- 라우팅 방식: `React Router v6 + HashRouter`
- 실행 방식: `Vite build` 결과물을 Windows에서 정적 파일로 직접 실행
- 데이터 저장: `localStorage`
- localStorage 접두사: `eduapp_`
- 기술 스택 제한: React 18, Vite, CSS Modules, React Router v6, localStorage
- 문제 데이터 방식: `src/data/`의 JSON 파일을 정적 import
- 힌트 규칙: `hints` 배열 기반 2회 힌트 후 정답 공개

---

## 변경 규칙

### 1. 기능 동작을 바꿀 때

- 먼저 해당 `docs/product-specs/*.md`를 수정한다.
- 그 다음 요약 문서(`ARCHITECTURE.md`, `AGENTS.md`, `PLANS.md`, `docs/exec-plans/active/mvp-plan.md`)를 맞춘다.
- 상세 스펙과 요약 문서가 같은 PR/커밋 안에서 함께 바뀌어야 한다.

### 2. 데이터 구조를 바꿀 때

- `docs/product-specs/`의 정본 스펙을 먼저 수정한다.
- `ARCHITECTURE.md`의 예시 JSON을 같이 맞춘다.
- 훅 인터페이스가 바뀌면 관련 스펙 문서와 `FRONTEND.md`를 같이 확인한다.

### 3. MVP 범위나 Phase를 바꿀 때

- `PLANS.md`를 먼저 수정한다.
- `docs/exec-plans/active/mvp-plan.md`를 같은 기준으로 맞춘다.
- 요약 문서에서 MVP 언급이 있다면 함께 수정한다.

### 4. 경로나 파일 위치를 바꿀 때

- `README.md`의 진입 경로를 수정한다.
- `AGENTS.md`의 핵심 문서 위치 표를 수정한다.
- 문서 내부의 경로 참조도 모두 같은 작업에서 수정한다.

### 5. UI/UX 원칙을 바꿀 때

- `docs/design-docs/core-beliefs.md` 또는 `DESIGN.md`를 먼저 수정한다.
- 텍스트 톤/UX 판단 기준이 바뀌면 `AGENTS.md`도 같이 맞춘다.

---

## 업무 분해 규칙

1. 각 작업 단위에는 반드시 `목표`, `영향 범위`, `완료 기준`, `검증 방법`이 있어야 한다.
2. 하나의 작업이 둘 이상의 독립된 완료 기준을 가지면 별도 작업으로 분리한다.
3. 헌법 수준 변경과 기능 구현은 같은 작업 단위로 묶지 않는다.
4. 막힌 문제를 푸는 작업과 새 기능을 만드는 작업은 가능하면 분리한다.
5. 인수인계는 작업 단위 기준으로 가능해야 하며, 다음 작업자가 첫 10분 안에 재현할 수 있어야 한다.
6. 모든 product spec은 최소한 `완료 기준`과 `실패/중단 조건` 섹션을 가져야 한다.
7. 새 개발 작업을 시작할 때는 `docs/ops/WORK-UNIT-TEMPLATE.md` 형식으로 작업을 정의할 수 있어야 한다.

---

## 수정 시도 규칙

1. AI는 같은 문제에 대해 최대 `5회`까지 자율적으로 수정 시도를 반복할 수 있다.
2. 여기서 `5회`는 같은 문제에 대한 독립적인 수정-검증 사이클 수를 뜻한다.
3. 검증이 빠진 수정은 시도로 계산하지 않는다.
4. 같은 문제를 5회까지 시도했는데도 해결되지 않으면, 더 무작정 수정하지 않고 `docs/ops/HANDOVER.md`에 기록한다.
5. 다만 아래 조건 중 하나가 먼저 발생하면 5회를 채우기 전에도 즉시 인수인계 또는 사용자 확인으로 전환한다.
6. 헌법 수준 결정이 필요한 경우
7. 권한, 네트워크, 환경 제약으로 진행이 막힌 경우
8. 예상치 못한 외부 변경과 충돌한 경우
9. 파괴적 작업 또는 되돌리기 어려운 작업이 필요한 경우

모호했던 문장은 아래처럼 해석한다.

> 같은 문제는 같은 완료 기준 또는 같은 오류 시그니처가 유지되는 경우를 뜻한다. 수정 시도 1회는 가설 수립, 수정, 검증, 결과 정리까지 포함한 한 사이클이다. 이 사이클을 최대 5회까지 반복한 뒤에도 해결되지 않으면 `docs/ops/HANDOVER.md`에 기록하고 인수인계한다.

---

## 실패 기록 규칙

같은 문제를 해결하지 못했을 때는 `docs/ops/HANDOVER.md`에 아래 항목을 남긴다.

1. 문제 이름 또는 작업 이름
2. 문제 정의
3. 영향 파일 / 문서
4. 완료 기준
5. 시도 1~5 요약
6. 각 시도의 검증 결과
7. 현재 가장 유력한 가설
8. 다음 작업자가 먼저 해볼 권장 작업
9. 사용자 확인이 필요한 결정

---

## 인수인계 완료 조건

인수인계는 아래 조건을 모두 만족해야 완료로 본다.

1. `docs/ops/HANDOVER.md`에 최신 상태가 기록되어 있다.
2. 문제가 재현되는 방법 또는 마지막 검증 방법이 적혀 있다.
3. 어디까지 시도했고 왜 멈췄는지 명확하다.
4. 다음 작업자가 시작할 첫 번째 행동이 적혀 있다.
5. 사용자에게 물어야 할 결정이 있다면 질문 형태로 정리되어 있다.

---

## 검증 규칙

문서 변경 후 아래 검증을 통과해야 한다.

1. 모든 문서 경로 참조가 실제 파일 위치와 일치한다.
2. `PLANS.md`와 `docs/exec-plans/active/mvp-plan.md`의 Phase 정의가 충돌하지 않는다.
3. MVP 범위가 문서마다 다르지 않다.
4. 라우팅 방식(`HashRouter`)과 실행 방식(`base: './'`, 정적 실행)이 서로 일치한다.
5. localStorage 키 이름과 데이터 구조 예시가 상세 스펙과 충돌하지 않는다.
6. 훅 목록과 훅 이름이 문서마다 다르지 않다.
7. JSON 스키마 예시는 상세 스펙의 필드명과 일치한다.
8. 루트 문서는 요약만 담고, 상세 계약은 `docs/` 쪽 정본에 위임한다.
9. 새 문서를 추가했으면 `README.md` 또는 관련 진입 문서에서 발견 가능해야 한다.
10. 운영 규칙의 핵심 용어(`같은 문제`, `수정 시도 1회`, `5회`, `인수인계`)가 문서에 정의되어 있어야 한다.
11. 인수인계 기록 위치가 실제 파일로 존재해야 한다.
12. 모든 product spec에 `완료 기준`과 `실패/중단 조건`이 존재해야 한다.
13. 작업 단위 템플릿 문서가 실제 파일로 존재해야 하며 `목표`, `영향 범위`, `완료 기준`, `검증 방법`, `인수인계 조건`을 포함해야 한다.

검증 실행:

- `node scripts/validate-docs.mjs`

---

## 변경 번들 규칙

한 문서를 바꿨을 때 보통 같이 봐야 하는 묶음은 아래와 같다.

| 변경 대상 | 같이 확인할 문서 |
|-----------|------------------|
| `docs/product-specs/quiz-system.md` | `ARCHITECTURE.md`, `FRONTEND.md`, `docs/exec-plans/active/mvp-plan.md` |
| `docs/product-specs/progress-tracker.md` | `ARCHITECTURE.md` |
| `docs/product-specs/gamification.md` | `ARCHITECTURE.md`, `PLANS.md` |
| `docs/product-specs/wrong-answer-review.md` | `ARCHITECTURE.md`, `PLANS.md` |
| `PLANS.md` | `docs/exec-plans/active/mvp-plan.md` |
| `DESIGN.md` | `FRONTEND.md`, `AGENTS.md` |
| `AGENTS.md` | `README.md` |
| 문서 경로 이동 | `README.md`, `AGENTS.md`, 모든 인용 문서 |

---

## 충돌 해결 규칙

문서가 충돌할 때는 아래 순서로 판단한다.

1. 상세 기능 계약은 `docs/product-specs/`가 우선
2. 현재 실행 순서는 `docs/exec-plans/active/mvp-plan.md`보다 `PLANS.md`와 함께 봐야 하며, 충돌 시 먼저 의도를 확인한 뒤 둘 다 수정
3. 요약 예시는 상세 스펙보다 우선할 수 없음
4. 경로와 실제 파일 배치는 저장소의 현재 구조가 우선이며, 문서는 그 구조에 맞춰 수정
5. 헌법 수준 원칙은 `CONSTITUTION.md`를 먼저 확인한다.

---

## 완료 기준

repository-level harness가 유지된 상태란 아래를 뜻한다.

- 새로 들어온 사람이 `README.md`에서 문서 진입점을 바로 찾을 수 있다.
- 어떤 기능의 정본 문서가 어디인지 혼동이 없다.
- 한 영역을 수정할 때 어떤 문서를 같이 바꿔야 하는지 판단할 수 있다.
- 문서만 읽어도 현재 MVP 범위, 데이터 계약, 구현 원칙이 일관되게 이해된다.

---

## 다음 자동화 후보

문서 하네스 이후 자동화하면 좋은 항목:

- 문서 경로 깨짐 검사
- 핵심 용어(`HashRouter`, MVP 범위, localStorage 키) 일관성 검사
- JSON 예시 스키마와 스펙 문서 간 필드명 검사
- 루트 문서와 `docs/` 문서 간 참조 누락 검사
