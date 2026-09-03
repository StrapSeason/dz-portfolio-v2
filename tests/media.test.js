import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { builtPage, PAGES } from './util.js';

const media = JSON.parse(readFileSync('content/media.json', 'utf8'));
const OLD = '/Users/daniel/Downloads/dz-portfolio-deploy';

describe('media manifest', () => {
  it('every manifest file exists in public/media with the original byte size', () => {
    const bad = [];
    for (const f of new Set(Object.values(media).flat())) {
      const dst = `public/media/${f.split('/').pop()}`;
      if (!existsSync(dst)) bad.push(`${f}: missing`);
      else if (statSync(dst).size !== statSync(`${OLD}/${f}`).size) bad.push(`${f}: size differs`);
    }
    expect(bad).toEqual([]);
  });
});

for (const page of PAGES) {
  const html = builtPage(page);
  describe(`media/${page}`, () => {
    if (!html) { it.skip(`${page} not built yet`, () => {}); return; }
    const css = [...html.matchAll(/href="([^"]+\.css)"/g)].map((m) => `dist${m[1].replace(/^\.?\//, '/')}`).filter(existsSync).map((f) => readFileSync(f, 'utf8')).join('\n');
    const js = [...html.matchAll(/src="([^"]+\.js)"/g)].map((m) => `dist${m[1].replace(/^\.?\//, '/')}`).filter(existsSync).map((f) => readFileSync(f, 'utf8')).join('\n');
    const hay = html + css + js;
    it(`every one of ${media[page].length} files is referenced`, () => {
      const missing = media[page].filter((f) => !hay.includes(f.split('/').pop()));
      expect(missing).toEqual([]);
    });
  });
}
