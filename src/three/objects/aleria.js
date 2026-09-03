/* Aleria — the sovereign AI / OS: an icosahedral lattice around a dense inner
   point field, rotating on two axes. */
import { Group, IcosahedronGeometry } from 'three';
import { edges, pointCloud, ring, lean } from './_shared.js';

export function create({ scene, theme }) {
  const g = new Group();
  const shell = edges(new IcosahedronGeometry(2.4, 1), theme.ink, 0.9); g.add(shell);
  const inner = edges(new IcosahedronGeometry(1.5, 0), theme.accent, 0.8); g.add(inner);
  const pos = [];
  for (let i = 0; i < 1400; i++) { const r = 0.5 + Math.random() * 1.6, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1); pos.push(r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph)); }
  const cloud = pointCloud(pos, theme.accent, 0.035, 0.75); g.add(cloud);
  g.add(ring(3.1, 96, theme.muted, 0.4, (a) => [Math.cos(a) * 3.1, Math.sin(a) * 0.6, Math.sin(a) * 3.1]));
  scene.add(g);
  return {
    group: g,
    tick(t, pointer) { shell.rotation.set(t * 0.12, t * 0.2, 0); inner.rotation.set(-t * 0.3, t * 0.15, 0); cloud.rotation.y = -t * 0.08; lean(g, pointer, 0.3); },
    dispose() { scene.remove(g); },
  };
}
