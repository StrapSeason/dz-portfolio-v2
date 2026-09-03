/* Phase-9 evidence: reduced-motion cleanliness, CLS over a full scroll, scroll fps,
   once-only reveals, no scroll hijack, hover/focus parity. */
import { preview } from 'vite';
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';

export async function runMotionProbe(phase) {
  mkdirSync('docs/perf', { recursive: true });
  const server = await preview({ preview: { port: 4179, strictPort: true }, logLevel: 'silent' });
  const browser = await chromium.launch({ headless: false });
  const pages = ['index', 'case-lumery', 'case-aleria', 'case-bitronix', 'case-every-bali'];
  const url = (p) => `http://localhost:4179/${p}.html`;
  const report = { renderer: 'gpu (headed)', pages: {} };

  for (const name of pages) {
    const r = {};
    // reduced motion: nothing transformed or faded after load
    let p = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await p.goto(url(name), { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
    r.reducedMotionViolations = await p.evaluate(() => [...document.querySelectorAll('main *')].filter((el) => {
      const cs = getComputedStyle(el); if (cs.display === 'none') return false;
      const tr = cs.transform; const nonIdentity = tr && tr !== 'none' && tr !== 'matrix(1, 0, 0, 1, 0, 0)';
      return (nonIdentity && !el.closest('.plate__annot, canvas, .screen__media, .tiles')) || (parseFloat(cs.opacity) < 1 && !el.closest('.plate__annot, .ground, .video__play') && el.tagName !== 'CANVAS');
    }).length);
    await p.close();

    // CLS over a scripted full scroll + once-only reveals + scroll hijack
    p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await p.goto(url(name), { waitUntil: 'networkidle' });
    await p.evaluate(() => { window.__cls = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); });
    await p.waitForTimeout(2200);                                   // let the entrance finish
    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 500) { await p.mouse.wheel(0, 500); await p.waitForTimeout(80); }
    await p.waitForTimeout(600);
    r.cls = +(await p.evaluate(() => window.__cls)).toFixed(4);
    r.reveal = await p.evaluate(() => { const els = [...document.querySelectorAll('.section > *:not(aside), .stage > *, .index > *')]; return { total: els.length, notVisible: els.filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99).length }; });
    await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(500);
    r.revealAfterScrollUp = await p.evaluate(() => [...document.querySelectorAll('.section > *:not(aside), .stage > *, .index > *')].filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99).length);
    r.scrollHijack = await p.evaluate(() => { let prevented = false; const l = (e) => { if (e.defaultPrevented) prevented = true; }; addEventListener('wheel', l, { passive: true }); const ev = new WheelEvent('wheel', { deltaY: 100, cancelable: true, bubbles: true }); document.body.dispatchEvent(ev); removeEventListener('wheel', l); return { htmlOverflow: document.documentElement.style.overflow, bodyOverflow: getComputedStyle(document.body).overflow, wheelPrevented: prevented || ev.defaultPrevented }; });
    await p.close();
    report.pages[name] = r;
  }
  // scroll fps on index (4 s scripted scroll)
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(url('index'), { waitUntil: 'networkidle' }); await p.waitForTimeout(2200);
  const fps = await p.evaluate(() => new Promise((res) => { let f = 0; const t0 = performance.now(); const step = () => { f++; if (performance.now() - t0 < 4000) { scrollBy(0, 6); requestAnimationFrame(step); } else res(+(f / 4).toFixed(1)); }; requestAnimationFrame(step); }));
  report.scrollFpsIndex = fps;
  await p.close();
  await browser.close(); await server.close();

  // hover / focus parity from the stylesheets
  const css = readdirSync('src/styles').map((f) => readFileSync(`src/styles/${f}`, 'utf8')).join('\n');
  const hoverSel = new Set([...css.matchAll(/([.\w-]+(?:\s+[.\w-]+)?):hover/g)].map((m) => m[1]));
  const focusSel = new Set([...css.matchAll(/([.\w-]+(?:\s+[.\w-]+)?):focus-visible/g)].map((m) => m[1]));
  report.hoverFocus = { hover: hoverSel.size, focusVisible: focusSel.size, hoverWithoutFocus: [...hoverSel].filter((s) => !focusSel.has(s)) };
  writeFileSync(`docs/perf/phase-${phase}.json`, JSON.stringify(report, null, 2));
  return report;
}
