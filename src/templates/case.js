/* Shared case-page helpers. Every helper takes record ids, never literal copy. */
import { renderFooter } from '../shell/footer.js';

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const m = (name) => `/media/${name}`;

export function makeCtx(content) {
  const R = content.records;
  const t = (id) => { const r = R.find((x) => x.id === `${content.page}-${id}`); if (!r) throw new Error(`missing record ${content.page}-${id}`); return r.text; };
  const rec = (id) => R.find((x) => x.id === `${content.page}-${id}`);
  const range = (a, b) => { const ia = R.findIndex((x) => x.id === `${content.page}-${a}`), ib = R.findIndex((x) => x.id === `${content.page}-${b}`); return R.slice(ia, ib + 1); };
  const js = R.filter((r) => r.kind === 'js').map((r) => r.text);
  return { R, t, rec, range, js };
}

export const head = ({ title, desc, ogImage, extraCss = [] }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:image" content="${ogImage}" />
  <link rel="icon" href="${m('favicon.svg')}" type="image/svg+xml" />
  <link rel="stylesheet" href="/src/styles/tokens.css" />
  <link rel="stylesheet" href="/src/styles/base.css" />
  <link rel="stylesheet" href="/src/styles/layout.css" />
  <link rel="stylesheet" href="/src/styles/components.css" />
  <link rel="stylesheet" href="/src/styles/case.css" />
  ${extraCss.map((c) => `<link rel="stylesheet" href="${c}" />`).join('\n  ')}
</head>`;

/* the case pages carried their own nav strings ("All work", brand, "Contact") */
export const caseNav = (allWork, brand, contact) => `<header class="site-header case-nav">
  <a class="nav-back" href="./#work">← <span>${esc(allWork)}</span></a>
  <a class="wordmark wordmark--inline" href="./">${esc(brand)}</a>
  <nav class="nav"><a href="#contact">${esc(contact)}</a></nav>
</header>`;

export const hero = ({ kicker, title, lead, facts, caseKey, sheet }) => `<section class="case-hero split">
  <div class="stack stack--loose">
    <p class="label label--accent">${esc(kicker)}</p>
    <h1 class="display title">${esc(title)}</h1>
    <p class="lead">${esc(lead)}</p>
    <div class="facts">${facts.map(([k, v]) => `<div><small>${esc(k)}</small><span>${esc(v)}</span></div>`).join('')}</div>
  </div>
  <figure class="plate case-hero__plate">
    <div class="plate__media case-hero__stage" data-hero-stage data-object="${caseKey}" aria-label="${esc(title)} — object"></div>
    <div class="plate__title">${sheet.map(([k, v]) => `<div>${esc(k)}<b>${esc(v)}</b></div>`).join('')}</div>
    <figcaption><span>${esc(kicker)}</span><span class="mono" data-frames-readout></span></figcaption>
  </figure>
</section>`;

export const label = (text) => `<p class="section-label">${esc(text)}</p>`;
export const statement = (parts) => `<p class="statement">${parts.map(([txt, em]) => em ? `<em>${esc(txt)}</em>` : esc(txt)).join(' ')}</p>`;
export const textGrid = (h2, p) => `<div class="text-grid"><h2 class="display h2">${esc(h2)}</h2><p class="body">${esc(p)}</p></div>`;
export const stageHead = (label, h2lines, span) => `<div class="stage-head">
  <p class="section-label">${esc(label)}</p>
  <h2 class="display h2">${h2lines.map(esc).join('<br />')}</h2>
  <p class="lead">${esc(span)}</p>
</div>`;

/* media */
export const figure = ({ src, alt, w, h, caption, lazy = true, cls = '' }) => `<figure class="figure ${cls}">
  <div class="figure__media"><img src="${m(src)}" alt="${esc(alt)}" width="${w}" height="${h}"${lazy ? ' loading="lazy"' : ''} /></div>
  ${caption ? `<figcaption>${(Array.isArray(caption) ? caption : [caption]).map((c) => `<span>${esc(c)}</span>`).join('')}</figcaption>` : ''}
</figure>`;
export const plate = ({ src, alt, w, h, caption = [], title = [], pos = '50% 50%', annot = '', lazy = true, cls = '' }) => `<figure class="plate ${cls}">
  <div class="plate__media"><img src="${m(src)}" alt="${esc(alt)}" width="${w}" height="${h}" style="object-position:${pos}"${lazy ? ' loading="lazy"' : ''} />${annot}</div>
  ${title.length ? `<div class="plate__title">${title.map(([k, v]) => `<div>${esc(k)}<b>${esc(v)}</b></div>`).join('')}</div>` : ''}
  ${caption.length ? `<figcaption>${caption.map((c) => `<span>${esc(c)}</span>`).join('')}</figcaption>` : ''}
</figure>`;

/* accessible tabs; behaviour in src/shell/tabs.js */
export const tabs = (id, items, panels, ariaLabel) => `<div data-tabs class="tabset">
  <div class="tabs" role="tablist" aria-label="${esc(ariaLabel)}">${items.map((label, i) => `<button class="tab" role="tab" id="${id}-t${i}" aria-controls="${id}-p${i}" aria-selected="${i === 0}" type="button">${esc(label)}</button>`).join('')}</div>
  ${panels.map((html, i) => `<div class="tabpanel" role="tabpanel" id="${id}-p${i}" aria-labelledby="${id}-t${i}"${i ? ' hidden' : ''}>${html}</div>`).join('')}
</div>`;

export const outro = ({ nextLabel, nextName, nextHref, footer }) => `<section class="section case-outro" id="contact">
  <p class="section-label">${esc(nextLabel)}</p>
  <a class="next-case display title" href="${nextHref}">${esc(nextName)} <span aria-hidden="true">→</span></a>
  <div class="case-footer">
    <p>${esc(footer[0])}</p><p class="muted">${esc(footer[1])}</p>
    <a href="mailto:${esc(footer[2])}">${esc(footer[2])}</a>
  </div>
</section>
${renderFooter()}`;

export const tail = () => `<script type="module" src="/src/pages/case.js"></script>
</body>
</html>
`;

/* video frame: poster-first, plays on request; portrait/square handled by CSS aspect */
export const video = ({ src, poster, w, h, caption = [], cls = '' }) => `<figure class="figure ${cls}">
  <div class="video figure__media"><video src="${m(src)}" poster="${m(poster || src.replace('.mp4', '-poster.jpg'))}" preload="metadata" playsinline muted width="${w}" height="${h}"></video><button class="video__play" type="button">Play</button></div>
  ${caption.length ? `<figcaption>${caption.map((c) => `<span>${esc(c)}</span>`).join('')}</figcaption>` : ''}
</figure>`;
export const roleCards = (cards) => `<div class="grid-3 role-cards">${cards.map(([span, p]) => `<article class="role-card">${span ? `<span class="label label--accent">${esc(span)}</span>` : ''}<p>${esc(p)}</p></article>`).join('')}</div>`;
export const liveLink = (text, href) => `<a class="btn" href="${esc(href)}" target="_blank" rel="noreferrer">${esc(text)}</a>`;
