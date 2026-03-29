# daonstudy

다온이 전용 학습도우미 프로젝트입니다.

현재 저장소는 문서 하네스와 실제 실행 가능한 앱을 함께 운영하고 있습니다.

## Windows 빠른 실행

GitHub 공개 저장소라는 뜻은 다른 노트북에서 코드를 받을 수 있다는 의미이고, 앱이 자동 배포된 상태는 아닙니다.
Windows 노트북에서 직접 실행하려면 아래 순서로 진행하면 됩니다.

필수 조건:

- Node.js LTS
- Git
- PowerShell 또는 Windows Terminal

설치 확인:

```powershell
node -v
npm -v
git --version
```

저장소 받기와 의존성 설치:

```powershell
git clone https://github.com/lihonil83/daonstudy.git
cd daonstudy
npm install
```

개발 서버 실행:

```powershell
npm run dev
```

브라우저 접속:

- 기본 주소는 보통 `http://localhost:5173`

운영 빌드 확인:

```powershell
npm run build
npm run preview
```

릴리스 번들까지 만들고 Windows에서 간단히 열기:

```powershell
npm run release:prep
```

- 이후 `release/` 폴더 안의 `start-windows.bat`를 더블클릭하면 됩니다.

같은 와이파이의 다른 기기에서도 접속하려면:

```powershell
npm run dev -- --host 0.0.0.0
```

- 그다음 실행한 노트북의 IP로 접속합니다.
- 예시: `http://192.168.0.10:5173`

핵심 진입점:

- `CONSTITUTION.md` : 프로젝트 헌법, 최상위 원칙, 변경 경계
- `REPOSITORY-HARNESS.md` : 문서 정본 체계, 변경 규칙, 검증 규칙
- `docs/ops/WORK-UNIT-TEMPLATE.md` : 개발 작업을 쪼개는 표준 작업 단위 템플릿
- `docs/ops/HANDOVER.md` : 미해결 문제 기록과 인수인계 로그
- `AGENTS.md` : 작업 원칙, 기술 스택, 개발 규칙
- `ARCHITECTURE.md` : 폴더 구조, 데이터 모델, 설계 원칙
- `PLANS.md` : 전체 로드맵과 Phase 기준
- `RUNBOOK.md` : 실제 실행, 빌드, smoke 검증, 배포 전 체크리스트
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
├── RUNBOOK.md
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
- `npm run release:prep` : 전체 검증 후 운영 `dist`를 `release/` 폴더용 산출물로 정리
- `npm run release:open` : 최신 릴리스 번들을 로컬 서버로 열고 브라우저에서 확인
- Windows 노트북에서는 release 번들 안의 `start-windows.bat` 더블클릭으로도 실행 가능
