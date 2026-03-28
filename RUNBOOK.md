# RUNBOOK.md

다온스터디를 실제로 실행하고 배포 비슷한 형태로 다룰 때 보는 운영 가이드입니다.

## 1. 이 프로젝트를 어떻게 쓰나

- 기본 사용 형태: 로컬 브라우저 실행
- 앱 성격: 정적 파일로 배포 가능한 React + Vite 앱
- 라우팅 방식: `HashRouter`
- 정적 실행 전제: `base: './'`
- 데이터 저장 방식: 브라우저 `localStorage`

즉, 서버 없이도 `dist/` 폴더만 있으면 실행 가능한 구조를 목표로 합니다.

## 2. 로컬 개발 실행

필수 조건:

- Node.js 20+
- npm

명령:

```bash
npm install
npm run dev
```

개발 서버가 뜨면 브라우저에서 안내된 주소를 열면 됩니다.

## 3. 실제 사용용 빌드

운영용 빌드는 smoke 검증 경로를 숨긴 상태로 만들어집니다.

```bash
npm run build
```

결과물:

- `dist/index.html`
- `dist/assets/*`

로컬에서 빌드 결과를 확인할 때:

```bash
npm run preview
```

또는 `dist/index.html`을 직접 열어도 되도록 설계되어 있습니다.

## 4. 검증용 smoke 빌드

검증 전용 라우트는 smoke 빌드에서만 열립니다.

```bash
npm run build:smoke
npm run smoke:browser
```

의미:

- `npm run build:smoke`: smoke 라우트 포함 빌드
- `npm run smoke:browser`: smoke 빌드 + preview + headless Chrome 자동 검증
- `npm run smoke:browser:prod`: 운영 빌드에서 smoke 라우트가 실제로 숨겨지는지 검증

## 5. 브라우저 저장 데이터

다음 데이터가 브라우저에 저장됩니다.

- `eduapp_scores`
- `eduapp_progress`
- `eduapp_reward`
- `eduapp_wrong`

사용자 화면에서는 [Progress.jsx](/Users/jihun/daonstudy/daonstudy/src/pages/Progress/Progress.jsx)에서 학습 기록 초기화를 제공하고 있습니다.

## 6. 배포 가능한 형태

이 프로젝트는 정적 파일 호스팅에 잘 맞습니다.

가능한 배포 형태:

- 로컬 PC에서 `dist/index.html` 직접 실행
- GitHub Pages 같은 정적 호스팅
- Netlify / Vercel의 정적 배포
- 사내 파일 서버나 NAS에 `dist/` 업로드

주의:

- smoke 라우트는 운영 배포에 포함하지 않는 것이 원칙입니다.
- 배포 전에 `npm run check`와 `npm run smoke:browser:prod`를 먼저 통과시키는 것을 권장합니다.

## 7. 권장 릴리스 순서

```bash
npm run check
npm run smoke:browser
npm run smoke:browser:prod
npm run build
```

한 번에 릴리스용 산출물까지 만들고 싶다면:

```bash
npm run release:prep
```

이 명령은 검증을 모두 마친 뒤 운영 빌드 기준 `release/` 폴더를 만들어 줍니다.

확인할 것:

- 홈, 수학, 영어, 복습, 기록 화면이 뜨는지
- 운영 빌드에서 `/smoke/*`가 fallback으로 막히는지
- 브라우저 localStorage 저장이 정상인지

## 8. 배포 전 체크리스트

- 문서 검증 통과
- 테스트 통과
- 운영 빌드 통과
- smoke 브라우저 검증 통과
- production 브라우저 검증 통과
- 사용자용 문구가 개발자 문구로 남아 있지 않은지 확인

## 9. release 산출물

`npm run release:prep`가 성공하면 `release/` 아래에 다음이 생성됩니다.

- `daonstudy-v0.1.0-.../dist/`
- `daonstudy-v0.1.0-.../manifest.json`
- `daonstudy-v0.1.0-.../README.txt`
- `release/LATEST.txt`

`README.txt`에는 실제 사용자가 `dist/index.html`을 어떻게 열면 되는지 적혀 있습니다.

## 10. 문제 발생 시 먼저 볼 곳

- 문서 정합성 문제: [Repository Harness](/Users/jihun/daonstudy/daonstudy/REPOSITORY-HARNESS.md)
- 작업 단위 기준: [Work Unit Template](/Users/jihun/daonstudy/daonstudy/docs/ops/WORK-UNIT-TEMPLATE.md)
- 미해결 기록: [Handover](/Users/jihun/daonstudy/daonstudy/docs/ops/HANDOVER.md)
- 브라우저 검증 스크립트: [browser-smoke script](/Users/jihun/daonstudy/daonstudy/scripts/browser-smoke.mjs)
