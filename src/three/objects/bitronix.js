/* Bitronix — a character: head, visor eyes, antenna, torso, arms. Solid ink
   body with accent details; bobs and glances at the pointer. */
import { Group, Mesh, BoxGeometry, SphereGeometry, CylinderGeometry, MeshStandardMaterial } from 'three';
import { edges, lean } from './_shared.js';

export function create({ scene, theme }) {
  const g = new Group();
  const body = new MeshStandardMaterial({ color: theme.ink, roughness: 0.45, metalness: 0.2 });
  const glow = new MeshStandardMaterial({ color: theme.accent, roughness: 0.3, emissive: theme.accent, emissiveIntensity: 0.6 });
  const head = new Mesh(new BoxGeometry(1.6, 1.2, 1.3), body); head.position.y = 1.15; g.add(head);
  const headEdges = edges(new BoxGeometry(1.62, 1.22, 1.32), theme.accent, 0.6);
  headEdges.position.copy(head.position);
  g.add(headEdges);
  const eyes = new Group();
  for (const s of [-1, 1]) { const e = new Mesh(new SphereGeometry(0.16, 16, 16), glow); e.position.set(s * 0.38, 1.2, 0.66); eyes.add(e); }
  g.add(eyes);
  const antenna = new Mesh(new CylinderGeometry(0.03, 0.03, 0.7, 8), body); antenna.position.set(0, 2.05, 0); g.add(antenna);
  const tip = new Mesh(new SphereGeometry(0.11, 12, 12), glow); tip.position.set(0, 2.45, 0); g.add(tip);
  const torso = new Mesh(new BoxGeometry(1.3, 1.4, 0.9), body); torso.position.y = -0.3; g.add(torso);
  const arms = [];
  for (const s of [-1, 1]) { const a = new Mesh(new CylinderGeometry(0.12, 0.1, 1.2, 10), body); a.position.set(s * 0.95, -0.35, 0); a.rotation.z = s * 0.25; g.add(a); arms.push(a); }
  g.position.y = -0.6; g.scale.setScalar(0.95);
  scene.add(g);
  return {
    group: g,
    tick(t, pointer) {
      g.position.y = -0.6 + Math.sin(t * 1.6) * 0.12;
      head.rotation.y = pointer.x * 0.5; head.rotation.x = -pointer.y * 0.25;
      eyes.rotation.copy(head.rotation);
      arms.forEach((a, i) => { a.rotation.z = (i ? 1 : -1) * (0.25 + Math.sin(t * 1.6 + i) * 0.12); });
      tip.scale.setScalar(1 + Math.sin(t * 4) * 0.25);
      lean(g, pointer, 0.15, 0.08);
    },
    dispose() { scene.remove(g); },
  };
}
