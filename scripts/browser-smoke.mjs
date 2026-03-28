import { access } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import process from 'node:process';

const HOST = '127.0.0.1';
const PORT = 4173;
const BASE_URL = `http://${HOST}:${PORT}`;
const PREVIEW_READY_TIMEOUT_MS = 10000;
const PAGE_BUDGET_MS = 3000;
const CHROME_CLOSE_TIMEOUT_MS = 10000;
const runtimeMode = process.argv.includes('--production') ? 'production' : 'smoke';
const previewCommand = {
  cmd: process.platform === 'win32' ? 'npm.cmd' : 'npm',
  args: ['run', 'preview', '--', '--host', HOST, '--port', String(PORT)],
};

const commonPageChecks = [
  {
    name: 'home',
    url: `${BASE_URL}/#/`,
    expected: ['다온 학습 놀이터', '시작, 복습, 기록이 한 번에 이어지는 학습 홈', '✨ 복습할 문제가 없어요'],
  },
  {
    name: 'math',
    url: `${BASE_URL}/#/math`,
    expected: ['수학 단원을 골라보세요', '길이 단위', '덧셈 20까지'],
  },
  {
    name: 'english',
    url: `${BASE_URL}/#/english`,
    expected: ['영어 단원을 골라보세요', '알파벳 대문자', '파닉스 C'],
  },
  {
    name: 'review-empty',
    url: `${BASE_URL}/#/review`,
    expected: ['오답 노트', '미복습 0개', '✨ 미복습 문제가 없어요'],
  },
  {
    name: 'progress-empty',
    url: `${BASE_URL}/#/progress`,
    expected: ['나의 학습 기록', '공부한 날', '첫 퀴즈를 풀면 최근 기록이 여기부터 차곡차곡 쌓여요.'],
  },
  {
    name: 'math-quiz',
    url: `${BASE_URL}/#/math/addition-up-to-20`,
    expected: ['덧셈 20까지', '정답을 골라보세요.', '현재 점수: 0', '이 문제에서 틀린 횟수: 0'],
  },
  {
    name: 'english-quiz',
    url: `${BASE_URL}/#/english/phonics-a`,
    expected: ['파닉스 A', '정답을 골라보세요.', '소리 듣기'],
  },
  {
    name: 'math-missing-unit',
    url: `${BASE_URL}/#/math/not-a-real-unit`,
    expected: ['단원을 찾을 수 없어요', '단원 목록으로 돌아가기'],
  },
  {
    name: 'fallback',
    url: `${BASE_URL}/#/mystery-path`,
    expected: ['이 화면은 아직 준비되지 않았어요', '홈으로 가기', '영어 단원 보기'],
  },
];

const smokeOnlyPageChecks = [
  {
    name: 'smoke-quiz-complete',
    url: `${BASE_URL}/#/smoke/quiz-complete`,
    expected: ['퀴즈 완료', '스모크 자동 완료', '2 / 2', '+90'],
    budgetMs: 6000,
  },
  {
    name: 'smoke-review-complete',
    url: `${BASE_URL}/#/smoke/review-complete`,
    expected: ['복습 완료', '📖 오답 복습 스모크', '2 / 2', '+50', '복습 목록으로', '✅ 맞혔어!'],
    budgetMs: 6000,
  },
  {
    name: 'smoke-wrong-to-review',
    url: `${BASE_URL}/#/smoke/wrong-to-review`,
    expected: ['오답 노트', '7 + 5 = ?', '미복습 1개', '전체 복습 시작 (1문제)'],
    budgetMs: 6000,
  },
  {
    name: 'smoke-wrong-to-review-complete',
    url: `${BASE_URL}/#/smoke/wrong-to-review-complete`,
    expected: ['복습 완료', '📖 오답 복습', '1 / 1', '+40', '✅ 맞혔어!'],
    budgetMs: 8000,
  },
  {
    name: 'smoke-storage-flow',
    url: `${BASE_URL}/#/smoke/storage-flow`,
    expected: ['저장 smoke 완료', '퀴즈 기록 1개', '총 XP 70', '복습 완료 1개', '뱃지 1/10 수집'],
    budgetMs: 10000,
  },
];

const productionOnlyPageChecks = [
  {
    name: 'smoke-route-hidden',
    url: `${BASE_URL}/#/smoke/quiz-complete`,
    expected: ['이 화면은 아직 준비되지 않았어요', '홈으로 가기', '수학 단원 보기'],
    forbidden: ['스모크 자동 완료', '퀴즈 완료'],
  },
];

const pageChecks =
  runtimeMode === 'production'
    ? [...commonPageChecks, ...productionOnlyPageChecks]
    : [...commonPageChecks, ...smokeOnlyPageChecks];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function spawnProcess(command, args, options = {}) {
  return spawn(command, args, {
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  });
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function findChromeBinary() {
  const candidates = [
    process.env.CHROME_BIN,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    'google-chrome',
    'chromium',
    'chromium-browser',
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (candidate.startsWith('/')) {
      if (await fileExists(candidate)) {
        return candidate;
      }

      continue;
    }

    const probe = spawnProcess('which', [candidate]);
    let stdout = '';

    probe.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    const exitCode = await new Promise((resolve) => {
      probe.on('close', resolve);
    });

    if (exitCode === 0 && stdout.trim()) {
      return stdout.trim();
    }
  }

  throw new Error(
    'Chrome 실행 파일을 찾지 못했습니다. `CHROME_BIN` 환경 변수를 설정하거나 로컬에 Google Chrome을 설치해 주세요.',
  );
}

async function waitForPreview(url) {
  const deadline = Date.now() + PREVIEW_READY_TIMEOUT_MS;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return;
      }
    } catch {
      // preview 서버가 아직 뜨지 않은 동안은 재시도한다.
    }

    await sleep(250);
  }

  throw new Error(`Preview 서버가 ${PREVIEW_READY_TIMEOUT_MS}ms 안에 준비되지 않았습니다.`);
}

function collectProcessOutput(child) {
  let stdout = '';
  let stderr = '';

  child.stdout.on('data', (chunk) => {
    stdout += chunk.toString();
  });

  child.stderr.on('data', (chunk) => {
    stderr += chunk.toString();
  });

  return { stdout: () => stdout, stderr: () => stderr };
}

function sanitizeChromeStderr(stderrText) {
  return stderrText
    .split('\n')
    .filter(
      (line) =>
        line &&
        !line.includes('SharedImageManager::ProduceMemory') &&
        !line.includes('InitializeSandbox() called with multiple threads'),
    )
    .join('\n');
}

async function dumpDom(chromeBinary, url, budgetMs = PAGE_BUDGET_MS) {
  const chrome = spawnProcess(chromeBinary, [
    '--headless=new',
    '--disable-gpu',
    `--virtual-time-budget=${budgetMs}`,
    '--dump-dom',
    url,
  ]);
  const output = collectProcessOutput(chrome);

  const exitCode = await new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      chrome.kill('SIGKILL');
      reject(new Error(`Chrome DOM dump timed out for ${url}`));
    }, CHROME_CLOSE_TIMEOUT_MS);

    chrome.on('close', (code) => {
      clearTimeout(timeoutId);
      resolve(code);
    });
  });

  const stderr = sanitizeChromeStderr(output.stderr());

  if (exitCode !== 0) {
    throw new Error(`Chrome DOM dump failed for ${url}\n${stderr}`.trim());
  }

  if (stderr) {
    console.warn(stderr);
  }

  return output.stdout();
}

async function run() {
  const chromeBinary = await findChromeBinary();
  const preview = spawnProcess(previewCommand.cmd, previewCommand.args);
  const previewOutput = collectProcessOutput(preview);

  try {
    await waitForPreview(BASE_URL);
    console.log(`Preview ready: ${BASE_URL}`);

    for (const page of pageChecks) {
      const dom = await dumpDom(chromeBinary, page.url, page.budgetMs);

      for (const expectedText of page.expected) {
        if (!dom.includes(expectedText)) {
          throw new Error(`[${page.name}] expected text not found: ${expectedText}`);
        }
      }

      for (const forbiddenText of page.forbidden ?? []) {
        if (dom.includes(forbiddenText)) {
          throw new Error(`[${page.name}] forbidden text found: ${forbiddenText}`);
        }
      }

      console.log(`Browser smoke passed: ${page.name}`);
    }
  } finally {
    preview.kill('SIGTERM');
    await new Promise((resolve) => {
      preview.on('close', resolve);
      setTimeout(resolve, 1000);
    });
  }

  const previewStderr = previewOutput.stderr().trim();

  if (previewStderr) {
    console.warn(previewStderr);
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
