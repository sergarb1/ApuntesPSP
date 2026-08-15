import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

const root = 'src/content/docs';
const files = [];

(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.md')) files.push(p);
  }
})(root);

let bad = 0;
for (const f of files) {
  const text = readFileSync(f, 'utf8').replace(/^\uFEFF/, '');
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) {
    console.log(`BAD  ${f}: sin frontmatter`);
    bad++;
    continue;
  }
  try {
    const doc = yaml.load(m[1]);
    if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
      throw new Error('frontmatter no es un objeto');
    }
    if (!doc.title) throw new Error('sin "title"');
  } catch (e) {
    console.log(`BAD  ${f}: ${e.message}`);
    bad++;
  }
}
console.log(`\nFicheros: ${files.length} | bad: ${bad}`);
process.exit(bad ? 1 : 0);