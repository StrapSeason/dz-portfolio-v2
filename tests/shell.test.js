import { describe, it, expect } from 'vitest';
import { renderNav } from '../src/shell/nav.js';
import { renderFooter } from '../src/shell/footer.js';
import home from '../content/home.json';
import { norm } from './util.js';

const text = (html) => norm(html.replace(/<[^>]+>/g, ' '));
describe('shell renders verbatim strings', () => {
  it('nav carries wordmark + the three links', () => {
    const t = text(renderNav());
    for (const id of ['home-t2', 'home-t3', 'home-t4', 'home-t5', 'home-t6']) expect(t).toContain(home.records.find((r) => r.id === id).text);
  });
  it('footer carries the contact block strings', () => {
    const t = text(renderFooter());
    for (const r of home.records.filter((r) => r.hint === 'contact' || r.hint === 'contact-links')) expect(t).toContain(r.text);
  });
});
