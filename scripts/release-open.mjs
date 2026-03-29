import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';

const repoRoot = process.cwd();
const releaseRoot = path.join(repoRoot, 'release');
const latestPointerPath = path.join(releaseRoot, 'LATEST.txt');
const host = '127.0.0.1';
const port = 4174;
const shouldOpen = process.argv.includes('--open');

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
};

function getContentType(filePath) {
  return contentTypes[path.extname(filePath)] ?? 'application/octet-stream';
}

async function readLatestBundleName() {
  return (await fs.readFile(latestPointerPath, 'utf8')).trim();
}

function normalizeRequestPath(urlPath) {
  if (!urlPath || urlPath === '/') {
    return '/index.html';
  }

  return decodeURIComponent(urlPath.split('?')[0]);
}

function openBrowser(url) {
  const command =
    process.platform === 'darwin'
      ? 'open'
      : process.platform === 'win32'
        ? 'cmd'
        : 'xdg-open';
  const args =
    process.platform === 'darwin'
      ? [url]
      : process.platform === 'win32'
        ? ['/c', 'start', '', url]
        : [url];

  const child = spawn(command, args, {
    cwd: repoRoot,
    detached: true,
    stdio: 'ignore',
  });

  child.unref();
}

async function main() {
  const latestBundleName = await readLatestBundleName();
  const distRoot = path.join(releaseRoot, latestBundleName, 'dist');

  const server = http.createServer(async (request, response) => {
    const requestedPath = normalizeRequestPath(request.url);
    const absolutePath = path.join(distRoot, requestedPath);

    try {
      const stats = await fs.stat(absolutePath);

      if (stats.isDirectory()) {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Not found');
        return;
      }

      const buffer = await fs.readFile(absolutePath);
      response.writeHead(200, { 'Content-Type': getContentType(absolutePath) });
      response.end(buffer);
    } catch {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
    }
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, resolve);
  });

  const url = `http://${host}:${port}/`;
  console.log(`Serving release bundle: ${latestBundleName}`);
  console.log(`Open in browser: ${url}`);
  console.log('Press Ctrl+C to stop.');

  if (shouldOpen) {
    openBrowser(url);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
