import { createScene } from '../three/scene.js';
import { initTabs } from '../shell/tabs.js';
import { initVideos } from '../shell/video.js';

const objects = {
  lumery: () => import('../three/objects/lumery.js'),
  aleria: () => import('../three/objects/aleria.js'),
  bitronix: () => import('../three/objects/bitronix.js'),
  'every-bali': () => import('../three/objects/every-bali.js'),
};
const stage = document.querySelector('[data-hero-stage]');
if (stage && objects[stage.dataset.object]) {
  objects[stage.dataset.object]().then(({ create }) => {
    const scene = createScene(stage, { build: create, distance: 8 });
    const readout = document.querySelector('[data-frames-readout]');
    if (readout && !scene.reduce) setInterval(() => { readout.textContent = `${scene.frames} f`; }, 500);
  });
}
document.querySelectorAll('[data-tabs]').forEach(initTabs);
initVideos();
