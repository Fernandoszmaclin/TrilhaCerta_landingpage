import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, transform } from 'esbuild';
import { minify } from 'html-minifier-terser';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fromRoot = (...parts) => resolve(root, ...parts);
const dist = fromRoot('dist');

await rm(dist, { recursive: true, force: true });
await mkdir(fromRoot('dist/assets/css'), { recursive: true });
await mkdir(fromRoot('dist/assets/js'), { recursive: true });
await cp(fromRoot('src/assets'), fromRoot('dist/assets'), { recursive: true });

const mainStyles = await readFile(fromRoot('src/styles/main.css'), 'utf8');
const styleFiles = [...mainStyles.matchAll(/@import ['"]\.\/([^'"]+)['"];/g)]
  .map((match) => match[1]);

if (!styleFiles.length) {
  throw new Error('src/styles/main.css não declara folhas de estilo para o build.');
}

const styles = await Promise.all(styleFiles.map((file) => readFile(fromRoot('src/styles', file), 'utf8')));
const minifiedStyles = await transform(styles.join('\n'), {
  loader: 'css',
  minify: true,
  target: 'es2020'
});
await writeFile(fromRoot('dist/assets/css/app.css'), minifiedStyles.code, 'utf8');

await build({
  entryPoints: [fromRoot('src/js/main.js')],
  outfile: fromRoot('dist/assets/js/app.js'),
  bundle: true,
  format: 'esm',
  minify: true,
  target: 'es2020',
  legalComments: 'none'
});

const sourceHtml = await readFile(fromRoot('src/index.html'), 'utf8');
const minifiedHtml = await minify(sourceHtml, {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true
});
await writeFile(fromRoot('dist/index.html'), minifiedHtml, 'utf8');

console.log('Build concluído em dist/.');
