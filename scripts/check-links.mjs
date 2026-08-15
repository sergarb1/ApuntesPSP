import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const docsRoot = 'src/content/docs';
const base = '/ApuntesPSP/';

function collectFiles(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) collectFiles(p).forEach((f) => out.push(f));
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

const targets = process.argv.slice(2);
const files = targets.flatMap((t) => {
  const p = join(docsRoot, t);
  if (existsSync(p) && statSync(p).isDirectory()) {
    return collectFiles(p).concat(p.endsWith('.md') ? [] : [`${p}.md`]);
  }
  return [p.endsWith('.md') ? p : `${p}.md`];
});

let badLinks = 0;
let totalLinks = 0;

for (const f of files) {
  const text = readFileSync(f, 'utf8');
  const links = [...text.matchAll(/\]\(\/ApuntesPSP\/[^)]*\)/g)].map((m) => m[0].slice(2, -1));
  for (const link of links) {
    totalLinks++;
    const rel = link.replace(base, '').replace(/\/$/, '');
    const mdPath = join(docsRoot, `${rel}.md`);
    if (!existsSync(mdPath)) {
      console.log(`ROTO  ${f}: -> ${link}`);
      badLinks++;
    }
  }
}

console.log(`\nFicheros comprobados: ${files.length} | enlaces: ${totalLinks} | rotos: ${badLinks}`);
process.exit(badLinks ? 1 : 0);