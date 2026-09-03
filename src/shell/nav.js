import home from '../../content/home.json';

const byHint = (hint, tag) => home.records.filter((r) => r.hint === hint && (!tag || r.tag === tag)).map((r) => r.text);

/** Site header: wordmark and the three verbatim nav links, straight from content. */
export function renderNav({ current = '' } = {}) {
  const [first, last] = byHint('wordmark');
  const links = byHint('site-header', 'a');
  const hrefs = { Work: '/#work', About: '/#about', Contact: '/#contact' };
  return `<header class="site-header">
  <a class="wordmark" href="/" aria-label="${first} ${last}, home"><span>${first}</span><span>${last}</span></a>
  <nav class="nav" aria-label="Main navigation">${links.map((l) => `<a href="${hrefs[l] || '/'}"${current === l ? ' aria-current="page"' : ''}>${l}</a>`).join('')}</nav>
  <span class="sheet-id" aria-hidden="true"></span>
</header>`;
}
