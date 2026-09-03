/* Every Bali — the masterplan: a terrain grid with villa blocks placed on it,
   slowly turning like a table model. */
import { Group, Mesh, BoxGeometry, MeshStandardMaterial, BufferGeometry, Float32BufferAttribute, LineSegments } from 'three';
import { lineMat, edges, lean } from './_shared.js';

export function create({ scene, theme }) {
  const g = new Group();
  const N = 28, S = 6.4, h = (x, z) => 0.35 * Math.sin(x * 1.1) * Math.cos(z * 0.9) + 0.15 * Math.sin(z * 2.3);
  const pos = [];
  for (let i = 0; i <= N; i++) for (let j = 0; j < N; j++) {
    const x0 = -S / 2 + (i / N) * S, z0 = -S / 2 + (j / N) * S, z1 = -S / 2 + ((j + 1) / N) * S;
    pos.push(x0, h(x0, z0), z0, x0, h(x0, z1), z1);                  // along z
    const x1 = -S / 2 + ((j + 1) / N) * S; const zz = x0;
    pos.push(z0, h(z0, zz), zz, x1, h(x1, zz), zz);                  // along x
  }
  const geo = new BufferGeometry(); geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
  const terrain = new LineSegments(geo, lineMat(theme.muted, 0.55)); g.add(terrain);
  const villa = new MeshStandardMaterial({ color: theme.surface, roughness: 0.8 });
  const blocks = [];
  for (let i = 0; i < 18; i++) {
    const x = -2.6 + (i % 6) * 1.05 + (Math.random() - 0.5) * 0.3, z = -2 + Math.floor(i / 6) * 1.6 + (Math.random() - 0.5) * 0.4;
    const w = 0.5 + Math.random() * 0.3, d = 0.4 + Math.random() * 0.3, ht = 0.25 + Math.random() * 0.35;
    const m = new Mesh(new BoxGeometry(w, ht, d), villa); m.position.set(x, h(x, z) + ht / 2, z); g.add(m);
    const e = edges(new BoxGeometry(w, ht, d), i % 5 === 0 ? theme.accent : theme.ink, 0.9); e.position.copy(m.position); g.add(e);
    blocks.push(e);
  }
  g.rotation.x = 0.55; g.position.y = 0.3;
  scene.add(g);
  return {
    group: g,
    tick(t, pointer) { g.rotation.y = t * 0.12; lean(g, pointer, 0.12, 0.05); g.rotation.x = 0.55 + -pointer.y * 0.12 * 0.5; },
    dispose() { scene.remove(g); },
  };
}
