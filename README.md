# daonstudy

다온이 전용 학습도우미 프로젝트입니다.

현재 저장소는 구현 전 단계의 하네스 문서와 실행 계획을 중심으로 정리되어 있습니다.

핵심 진입점:

- `CONSTITUTION.md` : 프로젝트 헌법, 최상위 원칙, 변경 경계
- `REPOSITORY-HARNESS.md` : 문서 정본 체계, 변경 규칙, 검증 규칙
- `docs/ops/WORK-UNIT-TEMPLATE.md` : 개발 작업을 쪼개는 표준 작업 단위 템플릿
- `docs/ops/HANDOVER.md` : 미해결 문제 기록과 인수인계 로그
- `AGENTS.md` : 작업 원칙, 기술 스택, 개발 규칙
- `ARCHITECTURE.md` : 폴더 구조, 데이터 모델, 설계 원칙
- `PLANS.md` : 전체 로드맵과 Phase 기준
- `docs/exec-plans/active/mvp-plan.md` : 현재 MVP 실행 계획
- `docs/design-docs/core-beliefs.md` : 교육 원칙과 UX 판단 기준
- `docs/product-specs/` : 퀴즈, 진도, 보상, 오답 복습 상세 스펙

문서 구조:

```text
.
├── CONSTITUTION.md
├── REPOSITORY-HARNESS.md
├── AGENTS.md
├── ARCHITECTURE.md
├── DESIGN.md
├── FRONTEND.md
├── PLANS.md
└── docs/
    ├── design-docs/
    ├── exec-plans/active/
    ├── ops/
    └── product-specs/
```

문서 검증:

- `node scripts/validate-docs.mjs`

개발 검증:

- `npm run test`
- `npm run check`
- `npm run build`
- `npm run build:smoke` : smoke 전용 라우트를 포함한 검증 빌드
- `npm run smoke:browser` : smoke 빌드 + 로컬 preview + headless Chrome 기반 브라우저 스모크 검증
- `npm run smoke:browser:prod` : 운영 빌드에서 smoke 라우트가 숨겨지는지 headless Chrome으로 검증
