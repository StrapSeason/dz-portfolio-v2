import home from '../../content/home.json';

const hint = (h) => home.records.filter((r) => r.hint === h);

/** Site footer: the verbatim contact strings and links from the old page. */
export function renderFooter() {
  const links = hint('contact-links').map((r) => r.text);              // email, Telegram
  const notes = hint('contact').filter((r) => r.tag === 'p').map((r) => r.text);
  const top = hint('contact').find((r) => r.tag === 'a')?.text || '';
  const hrefs = { [links[0]]: `mailto:${links[0]}`, [links[1]]: 'https://t.me/insearchofblood' };
  return `<footer class="site-footer">
  ${notes.map((n) => `<p>${n}</p>`).join('\n  ')}
  <a href="#top">${top}</a>
</footer>`.replace('</footer>', `</footer>`) + `\n<template data-contact-links>${links.map((l) => `<a href="${hrefs[l]}" target="_blank" rel="noreferrer">${l} <b>↗</b></a>`).join('')}</template>`;
}
