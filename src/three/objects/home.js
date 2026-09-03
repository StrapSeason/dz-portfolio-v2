/* Home — the instrument: a drafting gyroscope. Three nested rings on axes with
   orbiting nodes; the site's signature object. Lines + points only. */
import { Group, Mesh, SphereGeometry, MeshStandardMaterial } from 'three';
import { ring, edges, lean } from './_shared.js';
import { BoxGeometry } from 'three';

export function create({ scene, theme }) {
  const g = new Group();
  const rings = [2.8, 2.1, 1.45].map((r, i) => {
    const seg = 96, gr = new Group();
    gr.add(ring(r, seg, i === 1 ? theme.accent : theme.ink, i === 2 ? 0.7 : 1));
    gr.rotation.set(i * 0.9, i * 0.6, 0);
    g.add(gr); return gr;
  });
  // axes as dashed-looking short segments
  g.add(ring(3.2, 48, theme.muted, 0.35, (a) => [Math.cos(a) * 3.2, 0, Math.sin(a) * 3.2]));
  const nodes = [];
  for (let i = 0; i < 6; i++) {
    const m = new Mesh(new SphereGeometry(0.07, 12, 12), new MeshStandardMaterial({ color: theme.accent, roughness: 0.4 }));
    g.add(m); nodes.push(m);
  }
  const core = edges(new BoxGeometry(0.9, 0.9, 0.9), theme.ink); g.add(core);
  scene.add(g);
  return {
    group: g,
    tick(t, pointer) {
      rings[0].rotation.y = t * 0.25; rings[1].rotation.x = 0.9 + t * 0.35; rings[2].rotation.z = t * 0.5;
      core.rotation.set(t * 0.3, t * 0.2, 0);
      nodes.forEach((n, i) => { const a = t * 0.4 + (i / 6) * Math.PI * 2; const r = 2.1; n.position.set(Math.cos(a) * r, Math.sin(a * 1.3) * 0.6, Math.sin(a) * r); });
      lean(g, pointer, 0.3);
    },
    dispose() { scene.remove(g); },
  };
}
