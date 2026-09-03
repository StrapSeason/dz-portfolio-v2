import { LineBasicMaterial, LineSegments, EdgesGeometry, Points, PointsMaterial, BufferGeometry, Float32BufferAttribute, Group } from 'three';

export const lineMat = (color, opacity = 1) => new LineBasicMaterial({ color, transparent: opacity < 1, opacity });
export const edges = (geometry, color, opacity = 1) => new LineSegments(new EdgesGeometry(geometry, 12), lineMat(color, opacity));
export function pointCloud(positions, color, size = 0.045, opacity = 0.9) {
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(positions, 3));
  return new Points(g, new PointsMaterial({ color, size, sizeAttenuation: true, transparent: true, opacity }));
}
export function ring(radius, segments, color, opacity = 1, fn = (a) => [Math.cos(a) * radius, Math.sin(a) * radius, 0]) {
  const pos = [];
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2, b = ((i + 1) / segments) * Math.PI * 2;
    pos.push(...fn(a), ...fn(b));
  }
  const g = new BufferGeometry(); g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  return new LineSegments(g, lineMat(color, opacity));
}
export const group = () => new Group();
/* gentle pointer-driven tilt used by every object */
export function lean(obj, pointer, k = 0.35, damp = 0.06) {
  obj.rotation.x += ((-pointer.y * k) - obj.rotation.x) * damp;
  obj.rotation.y += ((pointer.x * k * 1.4) - obj.rotation.y) * damp;
}
