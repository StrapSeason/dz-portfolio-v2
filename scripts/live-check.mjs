import { readFileSync } from 'node:fs';
import { visibleText, norm, PAGES } from '../tests/util.js';
const base = process.argv[2] || 'https://strapseason.github.io/dz-portfolio-v2/';
const media = JSON.parse(readFileSync('content/media.json', 'utf8'));
let failed = 0;
for (const page of PAGES) {
  const file = page === 'home' ? 'index.html' : `case-${page}.html`;
  const html = await (await fetch(base + file)).text();
  const text = visibleText(html);
  const { records } = JSON.parse(readFileSync(`content/${page}.json`, 'utf8'));
  const missing = records.filter((r) => !text.includes(norm(r.text)));
  const cssUrls = [...html.matchAll(/href="([^"]+\.css)"/g)].map((m) => new URL(m[1], base).href);
  const css = (await Promise.all(cssUrls.map((u) => fetch(u).then((r) => r.text())))).join('\n');
  const missingMedia = media[page].filter((f) => !(html + css).includes(f.split('/').pop()));
  const ok = !missing.length && !missingMedia.length;
  if (!ok) failed++;
  console.log(`${ok ? 'pass' : 'FAIL'} ${page}: ${records.length - missing.length}/${records.length} records, ${media[page].length - missingMedia.length}/${media[page].length} media${missing.length ? ' — missing: ' + missing.slice(0, 3).map((m) => m.id).join(',') : ''}`);
}
process.exit(failed ? 1 : 0);
