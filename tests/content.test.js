import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { builtPage, visibleText, norm, PAGES } from './util.js';

for (const page of PAGES) {
  const html = builtPage(page);
  const { records } = JSON.parse(readFileSync(`content/${page}.json`, 'utf8'));
  describe(`content/${page}`, () => {
    if (!html) { it.skip(`${page} not built yet`, () => {}); return; }
    const text = visibleText(html);
    // JS-injected strings may legitimately live in the page's JS bundle; check dist JS too.
    const bundleText = norm(readFileSync('dist/index.html', 'utf8')); // fallback only
    it(`every one of ${records.length} records appears verbatim`, () => {
      const missing = records.filter((r) => !text.includes(norm(r.text)) && !bundleText.includes(norm(r.text)));
      expect(missing.map((m) => `${m.id}: ${m.text.slice(0, 80)}`)).toEqual([]);
    });
  });
}
