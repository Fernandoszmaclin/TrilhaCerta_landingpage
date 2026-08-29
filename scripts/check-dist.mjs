import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fromRoot = (...parts) => resolve(root, ...parts);
const dist = fromRoot('dist');
const files = [
  fromRoot('dist/index.html'),
  fromRoot('dist/assets/css/app.css'),
  fromRoot('dist/assets/js/app.js')
];

for (const file of files) await access(file, constants.R_OK);

const [html, css, js] = await Promise.all(files.map((file) => readFile(file, 'utf8')));

if (html.includes('<!--') || css.includes('/*') || js.includes('/*')) {
  throw new Error('O artefato de produção ainda contém comentários.');
}

const references = [
  ...html.matchAll(/(?:href|src|poster)="(assets\/[^"]+)"/g),
  ...html.matchAll(/srcset="(assets\/[^\s"]+)/g),
  ...css.matchAll(/url\(["']?(\.\.\/assets\/[^)'"\s]+)/g)
].map((match) => match[1]);

for (const reference of references) {
  const absolute = reference.startsWith('../')
    ? resolve(fromRoot('dist/assets/css'), reference)
    : resolve(dist, reference);
  await access(absolute, constants.R_OK);
}

console.log(`Artefato validado: ${references.length} referências locais resolvidas.`);
