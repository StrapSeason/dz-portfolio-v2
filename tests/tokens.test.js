import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const css = readFileSync('src/styles/tokens.css', 'utf8');
const hex = (s) => { const h = s.replace('#', ''); const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const lin = (c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const L = (rgb) => 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
const contrast = (a, b) => { const [x, y] = [L(hex(a)), L(hex(b))].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// every block that redefines --bg is a theme
const blocks = [...css.matchAll(/([^{}]+)\{([^{}]*--bg:[^{}]*)\}/g)].map((m) => ({ sel: m[1].trim().split('\n').pop().trim(), body: m[2] }));
const tok = (body, name) => (body.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{3,6})`)) || [])[1];

describe('token contrast', () => {
  it('finds at least a light and a dark theme block', () => { expect(blocks.length).toBeGreaterThanOrEqual(2); });
  for (const b of blocks) {
    it(`${b.sel}: ink/bg ≥ 4.5 and muted/bg ≥ 3`, () => {
      const bg = tok(b.body, '--bg'), ink = tok(b.body, '--ink'), muted = tok(b.body, '--muted'), accent = tok(b.body, '--accent');
      const ci = contrast(ink, bg), cm = contrast(muted, bg), ca = contrast(accent, bg);
      console.log(`${b.sel}  ink/bg=${ci.toFixed(2)}  muted/bg=${cm.toFixed(2)}  accent/bg=${ca.toFixed(2)}`);
      expect(ci).toBeGreaterThanOrEqual(4.5);
      expect(cm).toBeGreaterThanOrEqual(3);
      expect(ca).toBeGreaterThanOrEqual(3);
    });
  }
});

describe('no literal colours outside tokens.css', () => {
  for (const f of ['base', 'layout', 'components']) {
    it(`${f}.css has no hex literals`, () => {
      const src = readFileSync(`src/styles/${f}.css`, 'utf8').replace(/url\("data:[^"]*"\)/g, '');
      expect(src.match(/#[0-9a-fA-F]{3,6}\b/g) || []).toEqual([]);
    });
  }
});
