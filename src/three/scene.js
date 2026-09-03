/**
 * Scene wrapper shared by every 3D object on the site.
 *
 *  - starts only when its container intersects the viewport, stops when it leaves
 *  - caps devicePixelRatio at 2, resizes with a ResizeObserver
 *  - prefers-reduced-motion → renders exactly one still frame, never loops
 *  - disposes GPU resources on pagehide and on dispose()
 *  - exposes a frame counter on the container (data-frames) so probes can read it
 */
import { WebGLRenderer, Scene, PerspectiveCamera, HemisphereLight, DirectionalLight, Color } from 'three';

export function readTheme(el = document.documentElement) {
  const cs = getComputedStyle(el);
  const pick = (name, fallback) => (cs.getPropertyValue(name).trim() || fallback);
  return {
    ink: new Color(pick('--ink', '#101820')),
    accent: new Color(pick('--accent', '#1f3bd6')),
    muted: new Color(pick('--muted', '#56616b')),
    surface: new Color(pick('--surface', '#f4f6f5')),
  };
}

export function createScene(container, { build, fov = 32, distance = 9 } = {}) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new WebGLRenderer({ antialias: devicePixelRatio < 2, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(fov, 1, 0.1, 100);
  camera.position.set(0, 0, distance);
  scene.add(new HemisphereLight(0xffffff, 0x8899aa, 1.1));
  const key = new DirectionalLight(0xffffff, 1.4); key.position.set(4, 6, 8); scene.add(key);

  const theme = readTheme();
  const pointer = { x: 0, y: 0 };
  const object = build({ scene, theme, camera });

  let frames = 0, raf = 0, running = false, visible = false, disposed = false;
  const t0 = performance.now();
  container.dataset.frames = '0';

  const resize = () => {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  const frame = () => {
    if (!running) return;
    const t = (performance.now() - t0) / 1000;
    object.tick?.(t, pointer);
    renderer.render(scene, camera);
    container.dataset.frames = String(++frames);
    raf = requestAnimationFrame(frame);
  };
  const renderOnce = () => { object.tick?.(0, pointer); renderer.render(scene, camera); container.dataset.frames = String(++frames); };

  const start = () => {
    if (disposed || running) return;
    if (reduce) { if (frames === 0) renderOnce(); return; }     // still frame, never a loop
    running = true; raf = requestAnimationFrame(frame);
  };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  const ro = new ResizeObserver(() => { resize(); if (reduce && frames > 0) renderOnce(); });
  ro.observe(container);
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }, { threshold: 0.05 });
  io.observe(container);
  const onPointer = (e) => { const r = container.getBoundingClientRect(); pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1; pointer.y = -(((e.clientY - r.top) / r.height) * 2 - 1); };
  container.addEventListener('pointermove', onPointer, { passive: true });
  const onHide = () => stop();
  addEventListener('pagehide', onHide);
  document.addEventListener('visibilitychange', () => { document.hidden ? stop() : (visible && start()); });

  const dispose = () => {
    disposed = true; stop(); ro.disconnect(); io.disconnect();
    container.removeEventListener('pointermove', onPointer); removeEventListener('pagehide', onHide);
    object.dispose?.();
    scene.traverse((o) => { o.geometry?.dispose?.(); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose?.()); });
    renderer.dispose(); renderer.domElement.remove();
  };
  resize();
  return { start, stop, dispose, resize, renderer, scene, camera, object, get frames() { return frames; }, reduce };
}
