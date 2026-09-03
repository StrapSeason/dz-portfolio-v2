/* Deterministic evidence: full-page PNGs of every built page at three widths,
   console errors and horizontal-overflow readings per page. */
import { preview } from 'vite';
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';

const phase = process.argv.find((a) => /^\d+$/.test(a)) || process.argv[process.argv.indexOf('--phase') + 1] || '0';
const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1].split(',') : null;
const widths = [1440, 1024, 390];
const dir = `docs/shots/phase-${phase}`;
mkdirSync(dir, { recursive: true });

import { readdirSync } from 'node:fs';
const concepts = existsSync('dist/concepts') ? readdirSync('dist/concepts').filter((f) => f.endsWith('.html')).map((f) => `concepts/${f.replace('.html', '')}`) : [];
const pages = ['index', 'case-lumery', 'case-aleria', 'case-bitronix', 'case-every-bali', 'styleguide', 'lab', ...concepts]
  .filter((p) => existsSync(`dist/${p}.html`) && !/dz-stub/.test(readFileSync(`dist/${p}.html`, 'utf8')))
  .filter((p) => !only || only.includes(p));

const server = await preview({ preview: { port: 4174, strictPort: true }, logLevel: 'silent' });
const browser = await chromium.launch();
const report = {};
let failed = false;
for (const p of pages) {
  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 }, reducedMotion: 'no-preference' });
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(`http://localhost:4174/${p}.html`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    await page.screenshot({ path: `${dir}/${p.replace('/', '-')}-${w}.png`, fullPage: true });
    report[`${p}-${w}`] = { errors, overflow };
    if (errors.length || overflow > 0) failed = true;
    await page.close();
  }
}
await browser.close();
await server.close();
writeFileSync(`${dir}/console.json`, JSON.stringify(report, null, 2));
for (const [k, v] of Object.entries(report)) console.log(`${k}: errors=${v.errors.length} overflow=${v.overflow}`);
if (failed) { console.error('shots: console errors or overflow detected'); process.exit(1); }
