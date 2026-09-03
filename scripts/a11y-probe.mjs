/* Tab-order focus visibility, alt, lang, heading order, 320px overflow of scroll containers,
   first-load transfer excluding video, video preload attributes. */
import { preview } from 'vite';
import { chromium } from 'playwright';
const pages = ['index', 'case-lumery', 'case-aleria', 'case-bitronix', 'case-every-bali'];
const server = await preview({ preview: { port: 4181, strictPort: true }, logLevel: 'silent' });
const browser = await chromium.launch();
const out = {};
for (const name of pages) {
  const r = {};
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  let bytes = 0;
  p.on('response', async (res) => { const ct = res.headers()['content-type'] || ''; if (ct.startsWith('video/')) return; try { bytes += (await res.body()).length; } catch { /* aborted */ } });
  await p.goto(`http://localhost:4181/${name}.html`, { waitUntil: 'networkidle' });
  r.transferKBexVideo = Math.round(bytes / 1024);
  r.basics = await p.evaluate(() => ({
    lang: document.documentElement.lang, imgNoAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
    videos: [...document.querySelectorAll('video')].length, videosNoPoster: [...document.querySelectorAll('video')].filter((v) => !v.poster).length,
    videosNotMetadata: [...document.querySelectorAll('video')].filter((v) => v.getAttribute('preload') !== 'metadata').length,
    headingSkips: (() => { const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => +h.tagName[1]); let s = 0; for (let i = 1; i < hs.length; i++) if (hs[i] > hs[i - 1] + 1) s++; return s; })(),
  }));
  // tab order: every focusable reached with a visible ring
  const n = await p.evaluate(() => [...document.querySelectorAll('a[href],button,summary,[tabindex]:not([tabindex="-1"])')].filter((e) => !e.hidden && e.getBoundingClientRect().width > 0).length);
  let invisible = 0, reached = 0;
  for (let i = 0; i < Math.min(n, 80); i++) {
    await p.keyboard.press('Tab');
    const v = await p.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const cs = getComputedStyle(e); const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== 'none' || cs.backgroundColor !== getComputedStyle(e.parentElement).backgroundColor; return ring; });
    if (v === null) break; reached++; if (!v) invisible++;
  }
  r.tab = { focusables: n, reached, invisibleRing: invisible };
  r.tabTrace = []; await p.evaluate(() => document.activeElement.blur()); await p.keyboard.press('Tab');
  for (let i = 0; i < 8; i++) { r.tabTrace.push(await p.evaluate(() => { const e = document.activeElement; return e === document.body ? 'BODY' : e.tagName + (e.className ? '.' + String(e.className).split(' ')[0] : ''); })); await p.keyboard.press('Tab'); }
  r.headings = await p.evaluate(() => [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => h.tagName + ':' + h.textContent.trim().slice(0, 18)).slice(0, 40));
  await p.close();
  const q = await browser.newPage({ viewport: { width: 320, height: 700 } });
  const errors = []; q.on('console', (m) => m.type() === 'error' && errors.push(m.text())); q.on('pageerror', (e) => errors.push(String(e)));
  await q.goto(`http://localhost:4181/${name}.html`, { waitUntil: 'networkidle' }); await q.waitForTimeout(500);
  r.w320 = await q.evaluate(() => ({ overflow: document.documentElement.scrollWidth - innerWidth, tablesUncontained: [...document.querySelectorAll('table, pre')].filter((t) => { let a = t.parentElement; while (a && a !== document.body) { if (/(auto|scroll)/.test(getComputedStyle(a).overflowX)) return false; a = a.parentElement; } return t.scrollWidth > innerWidth; }).length }));
  r.w320.consoleErrors = errors.length;
  r.w320.widest = await q.evaluate(() => [...document.querySelectorAll('body *')].map((e) => ({ r: Math.round(e.getBoundingClientRect().right), s: (e.className || e.tagName).toString().slice(0, 30) })).filter((x) => x.r > innerWidth).slice(0, 5));
  await q.close();
  out[name] = r;
}
await browser.close(); await server.close();
import('node:fs').then(({ writeFileSync }) => { writeFileSync('docs/perf/a11y-11.json', JSON.stringify(out, null, 2)); });
console.log(JSON.stringify(out, null, 1));
