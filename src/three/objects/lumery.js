/* Lumery — the exploded glasses assembly. Rims, bridge, nose pads, temples,
   camera modules and the temple electronics as a stack that separates on tick. */
import { Group, Mesh, CylinderGeometry, BoxGeometry, MeshStandardMaterial, TubeGeometry, CatmullRomCurve3, Vector3 } from 'three';
import { ring, edges, lean } from './_shared.js';

const LENS_X = 1.15, LENS_RX = 0.95, LENS_RY = 0.72, HINGE_X = 2.08, TEMPLE_Z = -3.4, WRAP = 0.1;
const wrapZ = (x) => -WRAP * x * x;

export function create({ scene, theme }) {
  const g = new Group();
  const parts = [];                         // [object, explodeVector]
  const metal = new MeshStandardMaterial({ color: theme.ink, roughness: 0.35, metalness: 0.6 });
  const add = (o, v) => { g.add(o); parts.push([o, v, o.position.clone()]); };

  for (const s of [-1, 1]) {
    const rim = ring(1, 120, theme.ink, 1, (a) => { const x = s * LENS_X + Math.cos(a) * LENS_RX; return [x, Math.sin(a) * LENS_RY, wrapZ(x)]; });
    add(rim, new Vector3(0, 0, 0.55));
    const lens = ring(1, 64, theme.accent, 0.35, (a) => { const x = s * LENS_X + Math.cos(a) * LENS_RX * 0.86; return [x, Math.sin(a) * LENS_RY * 0.86, wrapZ(x) + 0.02]; });
    add(lens, new Vector3(0, 0, 1.1));
    const curve = new CatmullRomCurve3([new Vector3(s * HINGE_X, 0.16, wrapZ(HINGE_X)), new Vector3(s * (HINGE_X - 0.05), 0.16, -1.2), new Vector3(s * (HINGE_X - 0.1), 0.1, -2.6), new Vector3(s * (HINGE_X - 0.15), -0.45, TEMPLE_Z)]);
    const temple = new Mesh(new TubeGeometry(curve, 24, 0.05, 6, false), metal);
    add(temple, new Vector3(s * 0.5, 0, -0.3));
    const cam = new Mesh(new CylinderGeometry(0.17, 0.17, 0.12, 24), new MeshStandardMaterial({ color: theme.accent, roughness: 0.5 }));
    cam.rotation.x = Math.PI / 2; cam.position.set(s * HINGE_X, 0.12, wrapZ(HINGE_X) + 0.1);
    add(cam, new Vector3(s * 0.25, 0.5, 0.9));
    const board = edges(new BoxGeometry(0.9, 0.22, 0.06), theme.accent);
    board.position.set(s * (HINGE_X - 0.05), 0.16, -1.4); board.rotation.y = s * Math.PI / 2;
    add(board, new Vector3(s * 0.9, 0.35, 0));
    const pad = new Mesh(new CylinderGeometry(0.05, 0.05, 0.4, 8), metal);
    pad.position.set(s * 0.2, -0.35, 0.12); pad.rotation.z = s * 0.35;
    add(pad, new Vector3(0, -0.5, 0.4));
  }
  const bridge = new Mesh(new TubeGeometry(new CatmullRomCurve3([new Vector3(-0.22, 0.28, 0.04), new Vector3(0, 0.38, 0.04), new Vector3(0.22, 0.28, 0.04)]), 12, 0.05, 6, false), metal);
  add(bridge, new Vector3(0, 0.6, 0.6));
  g.position.z = 1.4; g.rotation.y = -0.5; g.rotation.x = 0.15;
  scene.add(g);
  let explode = 0;
  return {
    group: g,
    set explode(v) { explode = v; },
    tick(t, pointer) {
      const target = 0.55 + Math.sin(t * 0.5) * 0.45;          // breathing explode 0.1 → 1
      explode += (target - explode) * 0.04;
      for (const [o, v, base] of parts) o.position.copy(base).addScaledVector(v, explode);
      g.rotation.y = -0.5 + Math.sin(t * 0.25) * 0.35;
      lean(g, pointer, 0.25, 0.05);
    },
    dispose() { scene.remove(g); },
  };
}
