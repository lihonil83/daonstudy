import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const repoRoot = process.cwd();
const releaseRoot = path.join(repoRoot, 'release');
const packageJsonPath = path.join(repoRoot, 'package.json');

function formatTimestamp(date = new Date()) {
  const parts = new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
    .formatToParts(date)
    .reduce((accumulator, part) => {
      accumulator[part.type] = part.value;
      return accumulator;
    }, {});

  return `${parts.year}${parts.month}${parts.day}-${parts.hour}${parts.minute}${parts.second}`;
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: repoRoot,
      stdio: 'inherit',
      shell: false,
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code}`));
    });
  });
}

function runAndCapture(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: repoRoot,
      stdio: ['ignore', 'pipe', 'inherit'],
      shell: false,
    });

    let stdout = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout.trim());
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code}`));
    });
  });
}

async function listFilesRecursively(targetDir) {
  const entries = await fs.readdir(targetDir, { withFileTypes: true });
  const nestedPaths = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = path.join(targetDir, entry.name);

      if (entry.isDirectory()) {
        return listFilesRecursively(absolutePath);
      }

      return [absolutePath];
    }),
  );

  return nestedPaths.flat();
}

async function sha256File(filePath) {
  const buffer = await fs.readFile(filePath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

async function buildManifest(distDir, metadata) {
  const files = await listFilesRecursively(distDir);

  return {
    ...metadata,
    files: await Promise.all(
      files.map(async (filePath) => ({
        path: path.relative(distDir, filePath),
        sha256: await sha256File(filePath),
      })),
    ),
  };
}

async function main() {
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
  const version = packageJson.version;
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  await runCommand(npmCommand, ['run', 'check']);
  await runCommand(npmCommand, ['run', 'smoke:browser']);
  await runCommand(npmCommand, ['run', 'smoke:browser:prod']);

  const distDir = path.join(repoRoot, 'dist');
  const timestamp = formatTimestamp();
  const bundleName = `daonstudy-v${version}-${timestamp}`;
  const bundleDir = path.join(releaseRoot, bundleName);
  const branch = await runAndCapture('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  const commit = await runAndCapture('git', ['rev-parse', 'HEAD']);

  await fs.rm(bundleDir, { recursive: true, force: true });
  await fs.mkdir(bundleDir, { recursive: true });
  await fs.cp(distDir, path.join(bundleDir, 'dist'), { recursive: true });

  const readmeText = [
    'daonstudy release bundle',
    '',
    `version: ${version}`,
    `branch: ${branch}`,
    `commit: ${commit}`,
    '',
    '사용 방법:',
    '1. dist/index.html 을 브라우저에서 엽니다.',
    '2. 수학/영어/복습/기록 화면이 보이는지 확인합니다.',
    '3. 학습 기록은 브라우저 localStorage 에 저장됩니다.',
    '',
    '이 번들은 운영 빌드 기준으로 생성되어 smoke 전용 라우트가 숨겨져 있습니다.',
  ].join('\n');

  await fs.writeFile(path.join(bundleDir, 'README.txt'), readmeText, 'utf8');

  const manifest = await buildManifest(path.join(bundleDir, 'dist'), {
    version,
    branch,
    commit,
    builtAt: new Date().toISOString(),
    command: 'npm run release:prep',
  });

  await fs.writeFile(
    path.join(bundleDir, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );
  await fs.mkdir(releaseRoot, { recursive: true });
  await fs.writeFile(path.join(releaseRoot, 'LATEST.txt'), `${bundleName}\n`, 'utf8');

  console.log(`Release bundle created: ${path.relative(repoRoot, bundleDir)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
