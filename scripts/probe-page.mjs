/* Per-page runtime evidence: hero frames within 2s, reduced-motion still,
   image width/height + loading attributes, caption clipping, links. */
import { preview } from 'vite';
import { chromium } from 'playwright';
const page = process.argv[process.argv.indexOf('--page') + 1] || 'index';
const server = await preview({ preview: { port: 4178, strictPort: true }, logLevel: 'silent' });
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader'] });
const url = `http://localhost:4178/${page}.html`;
const out = { page };
let p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(2000);
out.heroFramesAt2s = await p.evaluate(() => +(document.querySelector('[data-hero-stage]')?.dataset.frames ?? -1));
out.images = await p.evaluate(() => {
  const imgs = [...document.querySelectorAll('img')];
  const firstViewport = (el) => el.getBoundingClientRect().top < innerHeight;
  return {
    total: imgs.length,
    missingDims: imgs.filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).length,
    belowFoldWithoutLoading: imgs.filter((i) => !firstViewport(i) && !i.getAttribute('loading')).length,
    missingAlt: imgs.filter((i) => !i.hasAttribute('alt')).length,
  };
});
out.captionsClipped = await p.evaluate(() => {
  let n = 0;
  for (const fig of document.querySelectorAll('figure')) {
    const cap = fig.querySelector('figcaption'); if (!cap) continue;
    let anc = cap.parentElement, clip = null;
    while (anc && anc !== document.body) { if (getComputedStyle(anc).overflow !== 'visible') { clip = anc; break; } anc = anc.parentElement; }
    if (clip) { const c = cap.getBoundingClientRect(), b = clip.getBoundingClientRect(); if (c.bottom > b.bottom + 1 || c.right > b.right + 1) n++; }
  }
  return n;
});
out.caseLinks = await p.evaluate(() => document.querySelectorAll('a[href^="case-"]').length);
out.overflow390 = null;
await p.close();
p = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
out.reducedMotionFrames = await p.evaluate(() => +(document.querySelector('[data-hero-stage]')?.dataset.frames ?? -1));
await p.close();
p = await browser.newPage({ viewport: { width: 390, height: 800 } });
await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
out.overflow390 = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
await browser.close(); await server.close();
console.log(JSON.stringify(out, null, 1));
