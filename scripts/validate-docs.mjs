import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');

const markdownFiles = [
  'README.md',
  'CONSTITUTION.md',
  'REPOSITORY-HARNESS.md',
  'AGENTS.md',
  'ARCHITECTURE.md',
  'DESIGN.md',
  'FRONTEND.md',
  'PLANS.md',
  'RUNBOOK.md',
  'docs/design-docs/core-beliefs.md',
  'docs/exec-plans/active/mvp-plan.md',
  'docs/ops/HANDOVER.md',
  'docs/ops/WORK-UNIT-TEMPLATE.md',
  'docs/product-specs/quiz-system.md',
  'docs/product-specs/progress-tracker.md',
  'docs/product-specs/gamification.md',
  'docs/product-specs/wrong-answer-review.md',
];

const contents = new Map(
  markdownFiles.map((relativePath) => [
    relativePath,
    fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'),
  ]),
);

const failures = [];
let checksRun = 0;

function read(relativePath) {
  return contents.get(relativePath);
}

function check(name, run) {
  checksRun += 1;
  try {
    run();
  } catch (error) {
    failures.push(`[${name}] ${error.message}`);
  }
}

function expect(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function expectAll(haystack, needles, label) {
  for (const needle of needles) {
    expect(haystack.includes(needle), `${label}: "${needle}" missing`);
  }
}

function normalizePhaseTitle(title) {
  return title.replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
}

function getPhaseHeadings(relativePath) {
  return [...read(relativePath).matchAll(/^## Phase (\d+) — (.+)$/gm)].map((match) => ({
    number: Number(match[1]),
    title: normalizePhaseTitle(match[2]),
  }));
}

function resolveReferencedPath(fromFile, reference) {
  if (reference.startsWith('docs/')) {
    return path.join(repoRoot, reference);
  }

  const relativeCandidate = path.resolve(repoRoot, path.dirname(fromFile), reference);
  if (fs.existsSync(relativeCandidate)) {
    return relativeCandidate;
  }

  return path.join(repoRoot, reference);
}

function collectReferencedMarkdownPaths(relativePath) {
  const fileContents = read(relativePath);
  const matches = fileContents.match(/(?:docs\/[A-Za-z0-9./-]+\.md|[A-Za-z0-9-]+\.md)/g) ?? [];
  return [...new Set(matches)];
}

check('markdown file references', () => {
  for (const relativePath of markdownFiles) {
    for (const reference of collectReferencedMarkdownPaths(relativePath)) {
      const resolvedPath = resolveReferencedPath(relativePath, reference);
      expect(
        fs.existsSync(resolvedPath),
        `${relativePath}: referenced markdown file not found -> ${reference}`,
      );
    }
  }
});

check('phase alignment', () => {
  const plansPhases = getPhaseHeadings('PLANS.md');
  const mvpPhases = getPhaseHeadings('docs/exec-plans/active/mvp-plan.md');

  expect(plansPhases.length > 0, 'PLANS.md phase headings not found');
  expect(mvpPhases.length > 0, 'docs/exec-plans/active/mvp-plan.md phase headings not found');
  expect(plansPhases.length === mvpPhases.length, 'Phase count differs between PLANS.md and mvp-plan.md');

  for (let index = 0; index < plansPhases.length; index += 1) {
    const plansPhase = plansPhases[index];
    const mvpPhase = mvpPhases[index];

    expect(plansPhase.number === mvpPhase.number, `Phase number mismatch at position ${index + 1}`);
    expect(
      plansPhase.title === mvpPhase.title,
      `Phase title mismatch for Phase ${plansPhase.number}: "${plansPhase.title}" != "${mvpPhase.title}"`,
    );
  }
});

check('mvp scope consistency', () => {
  const requiredScopeFiles = [
    'CONSTITUTION.md',
    'REPOSITORY-HARNESS.md',
    'ARCHITECTURE.md',
    'PLANS.md',
    'docs/exec-plans/active/mvp-plan.md',
  ];

  for (const relativePath of requiredScopeFiles) {
    const fileContents = read(relativePath);
    expect(
      fileContents.includes('구구단') && fileContents.includes('알파벳'),
      `${relativePath}: MVP scope should mention both 구구단 and 알파벳`,
    );
  }

  const outdatedPattern = /MVP[^\n]*덧셈\/뺄셈[^\n]*알파벳/;
  for (const relativePath of markdownFiles) {
    expect(
      !outdatedPattern.test(read(relativePath)),
      `${relativePath}: outdated MVP scope still references 덧셈/뺄셈 + 알파벳`,
    );
  }
});

check('hashrouter and static execution rules', () => {
  const hashRouterFiles = [
    'AGENTS.md',
    'ARCHITECTURE.md',
    'CONSTITUTION.md',
    'FRONTEND.md',
    'PLANS.md',
    'REPOSITORY-HARNESS.md',
    'docs/exec-plans/active/mvp-plan.md',
  ];

  for (const relativePath of hashRouterFiles) {
    expect(read(relativePath).includes('HashRouter'), `${relativePath}: HashRouter missing`);
  }

  const baseFiles = [
    'AGENTS.md',
    'CONSTITUTION.md',
    'FRONTEND.md',
    'REPOSITORY-HARNESS.md',
    'docs/exec-plans/active/mvp-plan.md',
  ];

  for (const relativePath of baseFiles) {
    expect(read(relativePath).includes("base: './'"), `${relativePath}: base './' requirement missing`);
  }
});

check('localStorage keys and prefix', () => {
  expectAll(
    read('ARCHITECTURE.md'),
    ['eduapp_progress', 'eduapp_scores', 'eduapp_wrong', 'eduapp_reward'],
    'ARCHITECTURE.md',
  );

  expectAll(
    read('docs/product-specs/progress-tracker.md'),
    ['eduapp_progress', 'eduapp_scores'],
    'docs/product-specs/progress-tracker.md',
  );
  expect(read('docs/product-specs/gamification.md').includes('eduapp_reward'), 'docs/product-specs/gamification.md: eduapp_reward missing');
  expect(read('docs/product-specs/wrong-answer-review.md').includes('eduapp_wrong'), 'docs/product-specs/wrong-answer-review.md: eduapp_wrong missing');

  const prefixFiles = ['AGENTS.md', 'CONSTITUTION.md', 'REPOSITORY-HARNESS.md'];
  for (const relativePath of prefixFiles) {
    expect(read(relativePath).includes('eduapp_'), `${relativePath}: eduapp_ prefix rule missing`);
  }
});

check('hook coverage', () => {
  const hooks = ['useQuiz', 'useProgress', 'useReward', 'useWrongAnswers'];

  expectAll(read('ARCHITECTURE.md'), hooks, 'ARCHITECTURE.md');
  expectAll(read('FRONTEND.md'), hooks, 'FRONTEND.md');

  expect(read('docs/product-specs/quiz-system.md').includes('useQuiz'), 'docs/product-specs/quiz-system.md: useQuiz missing');
  expect(read('docs/product-specs/progress-tracker.md').includes('useProgress'), 'docs/product-specs/progress-tracker.md: useProgress missing');
  expect(read('docs/product-specs/gamification.md').includes('useReward'), 'docs/product-specs/gamification.md: useReward missing');
  expect(read('docs/product-specs/wrong-answer-review.md').includes('useWrongAnswers'), 'docs/product-specs/wrong-answer-review.md: useWrongAnswers missing');
});

check('hint schema consistency', () => {
  for (const relativePath of markdownFiles) {
    expect(!/"hint"\s*:/.test(read(relativePath)), `${relativePath}: legacy "hint" field found`);
  }

  const hintsFiles = [
    'ARCHITECTURE.md',
    'docs/exec-plans/active/mvp-plan.md',
    'docs/product-specs/quiz-system.md',
    'docs/product-specs/wrong-answer-review.md',
  ];

  for (const relativePath of hintsFiles) {
    expect(read(relativePath).includes('"hints":'), `${relativePath}: "hints" field missing`);
  }
});

check('entrypoint coverage', () => {
  const readme = read('README.md');
  expect(readme.includes('CONSTITUTION.md'), 'README.md: CONSTITUTION.md entry missing');
  expect(readme.includes('REPOSITORY-HARNESS.md'), 'README.md: REPOSITORY-HARNESS.md entry missing');
  expect(readme.includes('RUNBOOK.md'), 'README.md: RUNBOOK.md entry missing');
  expect(readme.includes('docs/ops/WORK-UNIT-TEMPLATE.md'), 'README.md: docs/ops/WORK-UNIT-TEMPLATE.md entry missing');
  expect(readme.includes('docs/ops/HANDOVER.md'), 'README.md: docs/ops/HANDOVER.md entry missing');
  expect(readme.includes('docs/product-specs/'), 'README.md: docs/product-specs entry missing');
});

check('operational rules coverage', () => {
  const harness = read('REPOSITORY-HARNESS.md');

  expectAll(
    harness,
    [
      '같은 문제',
      '수정 시도 1회',
      '최대 `5회`',
      'docs/ops/HANDOVER.md',
      '인수인계 완료 조건',
      '업무 분해 규칙',
    ],
    'REPOSITORY-HARNESS.md',
  );

  const handover = read('docs/ops/HANDOVER.md');
  expectAll(
    handover,
    [
      '문제 정의',
      '완료 기준',
      '시도 1',
      '시도 1 검증',
      '다음 작업자가 먼저 할 일',
      '사용자 확인 필요',
    ],
    'docs/ops/HANDOVER.md',
  );

  const workUnit = read('docs/ops/WORK-UNIT-TEMPLATE.md');
  expectAll(
    workUnit,
    [
      '## 작업 단위 템플릿',
      '### 1. 목표',
      '### 3. 영향 범위',
      '### 5. 완료 기준',
      '### 6. 검증 방법',
      '### 10. 인수인계 조건',
    ],
    'docs/ops/WORK-UNIT-TEMPLATE.md',
  );
});

check('product spec completion sections', () => {
  const productSpecs = [
    'docs/product-specs/quiz-system.md',
    'docs/product-specs/progress-tracker.md',
    'docs/product-specs/gamification.md',
    'docs/product-specs/wrong-answer-review.md',
  ];

  for (const relativePath of productSpecs) {
    expect(read(relativePath).includes('## 완료 기준'), `${relativePath}: "## 완료 기준" missing`);
    expect(
      read(relativePath).includes('## 실패/중단 조건'),
      `${relativePath}: "## 실패/중단 조건" missing`,
    );
  }
});

if (failures.length > 0) {
  console.error(`Document validation failed (${failures.length} issue(s), ${checksRun} check(s) run):`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Document validation passed (${checksRun} check(s)).`);
}
