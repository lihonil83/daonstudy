import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

export async function loadJsxModule(entryPath, options = {}) {
  const { stubModules = {} } = options;
  const cacheDir = path.resolve('/Users/jihun/daonstudy/daonstudy/tests/.cache');
  const relativeName = path
    .relative('/Users/jihun/daonstudy/daonstudy', entryPath)
    .replaceAll(path.sep, '__')
    .replace(/[^a-zA-Z0-9._-]/g, '_');
  const outfile = path.join(cacheDir, `${relativeName}.mjs`);

  await mkdir(cacheDir, { recursive: true });

  const result = await build({
    absWorkingDir: path.dirname(entryPath),
    entryPoints: [entryPath],
    bundle: true,
    format: 'esm',
    platform: 'node',
    jsx: 'automatic',
    write: false,
    external: [
      'react',
      'react-dom',
      'react-dom/server',
      'react-router-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
    ],
    plugins: [
      {
        name: 'css-module-stub',
        setup(pluginBuild) {
          pluginBuild.onResolve({ filter: /.*/ }, (args) => {
            if (stubModules[args.path]) {
              return {
                path: args.path,
                namespace: 'module-stub',
              };
            }

            return null;
          });

          pluginBuild.onLoad({ filter: /.*/, namespace: 'module-stub' }, (args) => ({
            contents: stubModules[args.path],
            loader: 'js',
          }));

          pluginBuild.onResolve({ filter: /\.css$/ }, (args) => ({
            path: path.resolve(args.resolveDir, args.path),
            namespace: 'css-module-stub',
          }));

          pluginBuild.onLoad({ filter: /.*/, namespace: 'css-module-stub' }, () => ({
            contents:
              'const styles = new Proxy({}, { get: (_, key) => String(key) }); export default styles;',
            loader: 'js',
          }));
        },
      },
    ],
  });

  await writeFile(outfile, result.outputFiles[0].text, 'utf8');

  return import(`${pathToFileURL(outfile).href}?t=${Date.now()}`);
}
