/* For every mp4 in public/media without a matching *-poster.jpg, load it in Chromium,
   seek to a representative frame and save a JPEG. Deterministic, lossless to the source. */
import { preview } from 'vite';
import { chromium } from 'playwright';
import { readdirSync, existsSync, writeFileSync } from 'node:fs';
const server = await preview({ preview: { port: 4180, strictPort: true }, logLevel: 'silent' });
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:4180/index.html');
const todo = readdirSync('public/media').filter((f) => f.endsWith('.mp4') && !existsSync(`public/media/${f.replace('.mp4', '-poster.jpg')}`));
for (const f of todo) {
  const dataUrl = await page.evaluate(async (src) => {
    const v = document.createElement('video'); v.src = src; v.muted = true; v.playsInline = true; v.crossOrigin = 'anonymous';
    await new Promise((r) => { v.onloadedmetadata = r; });
    v.currentTime = Math.min(1.2, v.duration * 0.35);
    await new Promise((r) => { v.onseeked = r; });
    const c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0);
    return c.toDataURL('image/jpeg', 0.82);
  }, `/media/${f}`);
  writeFileSync(`public/media/${f.replace('.mp4', '-poster.jpg')}`, Buffer.from(dataUrl.split(',')[1], 'base64'));
  console.log('poster:', f.replace('.mp4', '-poster.jpg'));
}
await browser.close(); await server.close();
console.log(`posters: ${todo.length} written`);
