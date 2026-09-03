import { initMotion } from '../motion/index.js';
import { createScene } from '../three/scene.js';
import { create as createInstrument } from '../three/objects/home.js';
import { initVideos } from '../shell/video.js';

const stage = document.querySelector('[data-hero-stage]');
if (stage) {
  const scene = createScene(stage, { build: createInstrument, distance: 9 });
  const readout = document.querySelector('[data-frames-readout]');
  if (readout && !scene.reduce) setInterval(() => { readout.textContent = `${scene.frames} f`; }, 500);
}
initVideos();
// the old modal's "Close ×" lives inside each expandable case summary
document.querySelectorAll('.case-sum [data-close]').forEach((b) => b.addEventListener('click', () => { const d = b.closest('details'); d.open = false; d.querySelector('summary').focus(); }));

initMotion();
