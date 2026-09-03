/* Independent check of the extractor: render the OLD pages in a real browser,
   take innerText, and assert every sentence longer than 12 chars is in the JSON. */
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { chromium } from 'playwright';

const OLD = '/Users/daniel/Downloads/dz-portfolio-deploy';
const PAGES = { home: 'index.html', lumery: 'case-lumery.html', aleria: 'case-aleria.html', bitronix: 'case-bitronix.html', 'every-bali': 'case-every-bali.html' };
const mime = { html: 'text/html; charset=utf-8', css: 'text/css', js: 'text/javascript', png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp', svg: 'image/svg+xml', mp4: 'video/mp4' };
const server = createServer((req, res) => {
  const f = `${OLD}${decodeURIComponent(req.url.split('?')[0]) === '/' ? '/index.html' : decodeURIComponent(req.url.split('?')[0])}`;
  if (!existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': mime[f.split('.').pop()] || 'application/octet-stream' });
  res.end(readFileSync(f));
}).listen(4175);

const norm = (s) => s.replace(/\s+/g, ' ').trim();
const letters = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const browser = await chromium.launch();
let total = 0;
for (const [page, file] of Object.entries(PAGES)) {
  const json = JSON.parse(readFileSync(`content/${page}.json`, 'utf8'));
  const records = [...new Set(json.records.map((r) => norm(r.text).toLowerCase()))].sort((a, b) => b.length - a.length);
  const tab = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await tab.goto(`http://localhost:4175/${file}`, { waitUntil: 'networkidle' });
  // innerText reflects CSS text-transform; neutralise it so we compare source copy
  await tab.addStyleTag({ content: '* { text-transform: none !important; }' });
  const text = await tab.evaluate(() => document.body.innerText);
  // Coverage: every visible line must be fully explained by record texts.
  const lines = text.split('\n').map(norm).filter((l) => l.length > 12);
  const uncovered = [];
  for (const line of lines) {
    let rest = line.toLowerCase();
    for (const r of records) if (r.length >= 2 && rest.includes(r)) rest = rest.split(r).join(' ');
    if (letters(rest).length > 0) uncovered.push(`${line.slice(0, 70)}  →  residue "${rest.trim().slice(0, 40)}"`);
  }
  total += uncovered.length;
  console.log(`${page}: ${lines.length} lines, uncovered ${uncovered.length}`);
  for (const m of uncovered.slice(0, 6)) console.log(`   ✗ ${m}`);
  await tab.close();
}
await browser.close();
server.close();
process.exit(total ? 1 : 0);
