import { describe, it, expect } from 'vitest';
import * as home from '../src/three/objects/home.js';
import * as lumery from '../src/three/objects/lumery.js';
import * as aleria from '../src/three/objects/aleria.js';
import * as bitronix from '../src/three/objects/bitronix.js';
import * as bali from '../src/three/objects/every-bali.js';
import { Scene, Color } from 'three';

const theme = { ink: new Color('#101820'), accent: new Color('#1f3bd6'), muted: new Color('#56616b'), surface: new Color('#f4f6f5') };
describe('3D objects', () => {
  for (const [name, mod] of Object.entries({ home, lumery, aleria, bitronix, 'every-bali': bali })) {
    it(`${name} exports create() and the instance ticks + disposes`, () => {
      expect(typeof mod.create).toBe('function');
      const scene = new Scene();
      const o = mod.create({ scene, theme });
      expect(typeof o.tick).toBe('function'); expect(typeof o.dispose).toBe('function');
      expect(scene.children.length).toBeGreaterThan(0);
      o.tick(1.2, { x: 0.3, y: -0.2 });
      o.dispose(); expect(scene.children.length).toBe(0);
    });
  }
});
