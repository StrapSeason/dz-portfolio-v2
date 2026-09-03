/* Runtime evidence for the 3D library: fps per scene, reduced-motion still frame,
   offscreen gating. --headed uses the machine GPU; default is headless SwiftShader
   (a conservative floor). Writes docs/perf/phase-<N>.json. */
import { preview } from 'vite';
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const phase = process.argv[process.argv.indexOf('--phase') + 1] || '0';
const headed = process.argv.includes('--headed');
mkdirSync('docs/perf', { recursive: true });
const server = await preview({ preview: { port: 4177, strictPort: true }, logLevel: 'silent' });
const browser = await chromium.launch({ headless: !headed, args: headed ? [] : ['--enable-unsafe-swiftshader'] });
const url = 'http://localhost:4177/lab.html';
const report = { renderer: headed ? 'gpu (headed)' : 'swiftshader (headless)', scenes: {} };

// 1) fps per scene, each scrolled into view for 3 s
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });
const names = await page.$$eval('[data-scene]', (els) => els.map((e) => e.dataset.scene));
for (const name of names) {
  await page.evaluate((n) => document.querySelector(`[data-scene="${n}"]`).scrollIntoView({ block: 'center' }), name);
  await page.waitForTimeout(400);
  const f0 = await page.evaluate((n) => +document.querySelector(`[data-scene="${n}"] [data-stage]`).dataset.frames, name);
  await page.waitForTimeout(3000);
  const f1 = await page.evaluate((n) => +document.querySelector(`[data-scene="${n}"] [data-stage]`).dataset.frames, name);
  report.scenes[name] = { fps: +(((f1 - f0) / 3).toFixed(1)) };
}
await page.close();   // one foreground page at a time: a background tab is document.hidden and the loop stops by design
// 2) offscreen gating: fresh load at top, last scene must have 0 frames until scrolled
const p2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await p2.goto(url, { waitUntil: 'networkidle' }); await p2.waitForTimeout(800);
const last = names[names.length - 1];
const before = await p2.evaluate((n) => +document.querySelector(`[data-scene="${n}"] [data-stage]`).dataset.frames, last);
await p2.evaluate((n) => document.querySelector(`[data-scene="${n}"]`).scrollIntoView({ block: 'center' }), last); await p2.waitForTimeout(800);
const after = await p2.evaluate((n) => +document.querySelector(`[data-scene="${n}"] [data-stage]`).dataset.frames, last);
report.offscreenGating = { scene: last, framesBeforeScroll: before, framesAfterScroll: after };
await p2.close();
// 3) reduced motion: exactly one frame per visible scene
const p3 = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
await p3.goto(url, { waitUntil: 'networkidle' });
// each scene is brought into view (lazy start), then must sit at exactly one frame
report.reducedMotion = {};
for (const name of names) {
  await p3.evaluate((n) => document.querySelector(`[data-scene="${n}"]`).scrollIntoView({ block: 'center' }), name);
  await p3.waitForTimeout(700);
  report.reducedMotion[name] = await p3.evaluate((n) => +document.querySelector(`[data-scene="${n}"] [data-stage]`).dataset.frames, name);
}
report.pixelRatioCap = await p3.evaluate(() => Object.values(window.__scenes)[0].renderer.getPixelRatio() <= 2);
await browser.close(); await server.close();
writeFileSync(`docs/perf/phase-${phase}.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));
const bad = Object.entries(report.scenes).filter(([, v]) => v.fps < 50).map(([k]) => k);
if (bad.length) { console.error('below 50 fps:', bad.join(', ')); process.exit(headed ? 1 : 0); }
