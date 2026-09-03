import { createScene } from '../three/scene.js';
import * as home from '../three/objects/home.js';
import * as lumery from '../three/objects/lumery.js';
import * as aleria from '../three/objects/aleria.js';
import * as bitronix from '../three/objects/bitronix.js';
import * as bali from '../three/objects/every-bali.js';

const objects = { home, lumery, aleria, bitronix, 'every-bali': bali };
window.__scenes = {};
for (const section of document.querySelectorAll('[data-scene]')) {
  const name = section.dataset.scene;
  const stage = section.querySelector('[data-stage]');
  const fpsEl = section.querySelector('[data-fps]');
  const s = createScene(stage, { build: objects[name].create, distance: name === 'home' ? 9 : 8 });
  window.__scenes[name] = s;
  let last = performance.now(), lastFrames = 0;
  setInterval(() => { const now = performance.now(); const f = s.frames; fpsEl.textContent = `${Math.round(((f - lastFrames) * 1000) / (now - last))} fps`; last = now; lastFrames = f; }, 1000);
}
