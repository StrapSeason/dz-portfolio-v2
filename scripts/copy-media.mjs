import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync, existsSync } from 'node:fs';
import { basename } from 'node:path';
const OLD = '/Users/daniel/Downloads/dz-portfolio-deploy';
const media = JSON.parse(execFileSync('cat', ['content/media.json'], { encoding: 'utf8' }));
mkdirSync('public/media', { recursive: true });
const files = [...new Set(Object.values(media).flat())];
let ok = 0, bad = [];
for (const f of files) {
  const src = `${OLD}/${f}`;
  const dst = `public/media/${basename(f)}`;
  if (!existsSync(src)) { bad.push(`${f}: missing in old site`); continue; }
  execFileSync('cp', ['-c', src, dst]);                 // APFS clone, no byte duplication
  if (statSync(src).size !== statSync(dst).size) bad.push(`${f}: size mismatch`); else ok++;
}
console.log(`copied ${ok}/${files.length} files`);
if (bad.length) { console.error(bad.join('\n')); process.exit(1); }
