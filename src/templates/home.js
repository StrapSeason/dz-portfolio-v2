/* Home page template. Every string is pulled from content/home.json by id or
   hint — nothing is retyped — so the verbatim invariant holds by construction. */
import { renderNav } from '../shell/nav.js';
import { renderFooter } from '../shell/footer.js';

export function renderHome(content) {
  const R = content.records;
  const byId = (id) => R.find((r) => r.id === id)?.text ?? '';
  const hint = (h, tag) => R.filter((r) => r.hint === h && (!tag || r.tag === tag));
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const m = (name) => `/media/${name}`;
  const title = byId('home-title'), desc = byId('home-desc');

  // case cards: card copy from hints, in old order, plus the old modal copy as an expandable summary
  const js = R.filter((r) => r.kind === 'js').map((r) => r.text);
  const modal = {
    aleria:   js.slice(0, 7),   // index, lead, role, period, meta, body, link
    lumery:   js.slice(7, 13),  // index, lead, role, period, team, body  (link shared)
    bitronix: js.slice(13, 19),
    bali:     js.slice(19, 25),
  };
  const link = js[6];                                  // "View full case study →"
  const cases = [
    { key: 'lumery',   href: 'case-lumery.html',     img: m('lumery-glasses.jpg'),    w: 1400, h: 788, alt: byId('home-t22'), copy: byId('home-t17'), name: byId('home-t18'), chips: ['home-t19', 'home-t20', 'home-t21'].map(byId), sum: modal.lumery },
    { key: 'aleria',   href: 'case-aleria.html',     img: m('aleria-ecosystem.jpg'),  w: 1400, h: 788, alt: '',              copy: byId('home-t23'), name: byId('home-t24'), chips: ['home-t25', 'home-t26', 'home-t27', 'home-t28'].map(byId), sum: modal.aleria, extra: byId('home-t29') },
    { key: 'bitronix', href: 'case-bitronix.html',   img: m('bitronix-robot.png'),    w: 1456, h: 832, alt: byId('home-t35'), copy: byId('home-t30'), name: byId('home-t31'), chips: ['home-t32', 'home-t33', 'home-t34'].map(byId), sum: modal.bitronix },
    { key: 'bali',     href: 'case-every-bali.html', img: m('every-bali-hero.png'),   w: 1440, h: 880, alt: '',              copy: byId('home-t36'), name: byId('home-t37'), chips: ['home-t38', 'home-t39', 'home-t40', 'home-t41'].map(byId), sum: modal.bali, thumbs: [[m('every-bali-map.webp'), 720, 430], [m('every-bali-interior.png'), 682, 762]] },
  ];
  const closeLabel = byId('home-t68');

  const row = (c) => `
      <article class="case-row-wrap" data-case="${c.key}">
        <a class="case-row" href="${c.href}">
          <img src="${c.img}" alt="${esc(c.alt)}" width="${c.w}" height="${c.h}" loading="lazy" />
          <h2 class="display">${esc(c.name)}</h2>
          <p>${esc(c.copy)}${c.extra ? ` <span class="label">${esc(c.extra)}</span>` : ''}</p>
          <div class="chips">${c.chips.map((t) => `<span class="chip">${esc(t)}</span>`).join('')}</div>
        </a>
        <details class="case-sum">
          <summary class="label">${esc(c.sum[0])}</summary>
          <div class="case-sum__body">
            <p class="lead">${esc(c.sum[1])}</p>
            <div class="facts">${[c.sum[2], c.sum[3], c.sum[4]].map((t) => `<div><span>${esc(t)}</span></div>`).join('')}</div>
            <p class="body">${esc(c.sum[5])}</p>
            ${c.thumbs ? `<div class="grid-2 case-sum__thumbs">${c.thumbs.map(([src, w, h]) => `<img src="${src}" alt="" width="${w}" height="${h}" loading="lazy" />`).join('')}</div>` : ''}
            <div class="cluster"><a class="btn" href="${c.href}">${esc(link)}</a><button class="btn" type="button" data-close>${esc(closeLabel)}</button></div>
          </div>
        </details>
      </article>`;

  const manifestoLis = hint('manifesto-grid', 'li').map((r) => `<li>${esc(r.text)}</li>`).join('');
  const aboutParas = hint('about-columns', 'p').map((r) => `<p class="body">${esc(r.text)}</p>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:image" content="${m('lumery-glasses.jpg')}" />
  <link rel="icon" href="${m('favicon.svg')}" type="image/svg+xml" />
  <link rel="stylesheet" href="/src/styles/tokens.css" />
  <link rel="stylesheet" href="/src/styles/base.css" />
  <link rel="stylesheet" href="/src/styles/layout.css" />
  <link rel="stylesheet" href="/src/styles/components.css" />
  <link rel="stylesheet" href="/src/styles/home.css" />
</head>
<body class="ground">
<div class="page" id="top">
${renderNav({ current: '' })}
<main>
  <section class="hero split" id="hero">
    <div class="hero__copy">
      <p class="label label--accent">${esc(byId('home-t7'))}</p>
      <h1 class="display h1">${esc(byId('home-t8'))}<br /><span class="display--light">${esc(byId('home-t9'))}</span> &amp;<br />${esc(byId('home-t10'))}</h1>
      <p class="lead">${esc(byId('home-t11'))}</p>
      <a class="btn" href="#work"><b>${esc(byId('home-t12'))}</b> ${esc(byId('home-t13'))} ↘</a>
    </div>
    <figure class="plate hero__plate">
      <div class="plate__media hero__stage" data-hero-stage aria-label="${esc(byId('home-t8'))} — instrument"></div>
      <svg class="plate__annot" viewBox="0 0 1000 562" preserveAspectRatio="none" aria-hidden="true">
        <line class="tick" x1="48" y1="80" x2="48" y2="482" /><line class="tick" x1="48" y1="482" x2="952" y2="482" />
        <circle cx="500" cy="281" r="210" /><line x1="500" y1="40" x2="500" y2="70" /><line x1="500" y1="492" x2="500" y2="522" />
        <text x="520" y="62">R 210</text><text x="60" y="60">Y</text><text x="930" y="500">X</text>
      </svg>
      <div class="plate__title"><div>Sheet<b>Home</b></div><div>Object<b>Instrument</b></div><div>Rev<b>2026</b></div></div>
      <figcaption><span>${esc(byId('home-t14'))}</span><span class="mono" data-frames-readout></span></figcaption>
    </figure>
  </section>

  <section class="section" id="work">
    <div class="section-head"><p class="label">${esc(byId('home-t15'))}</p><p class="label">${esc(byId('home-t16'))}</p></div>
    <div class="index">${cases.map(row).join('')}</div>
    <figure class="plate reel">
      <div class="plate__media video">
        <video src="${m('particle-video.mp4')}" preload="metadata" playsinline muted loop width="854" height="480"></video>
        <button class="video__play" type="button">Play</button>
      </div>
      <div class="plate__title"><div>Sheet<b>Reel</b></div><div>Format<b>Motion</b></div></div>
      <figcaption><span>${esc(byId('home-t15'))}</span><span>${esc(byId('home-t16'))}</span></figcaption>
    </figure>
  </section>

  <section class="section sheet" id="manifesto">
    <aside><p class="section-label">${esc(byId('home-t42'))}</p></aside>
    <div class="stack stack--loose">
      <h2 class="display h2">${esc(byId('home-t43'))}<br />${esc(byId('home-t44'))}<br /><em class="accent">${esc(byId('home-t45'))}</em></h2>
      <p class="lead">${esc(byId('home-t46'))}</p>
      <ul class="manifesto-list">${manifestoLis}</ul>
    </div>
  </section>

  <section class="section split split--reverse" id="about">
    <div class="stack stack--loose">
      <p class="section-label">${esc(byId('home-t54'))}</p>
      <h2 class="display h2">${esc(byId('home-t55'))}</h2>
      <div class="grid-2 about__cols">${aboutParas}</div>
      <p class="label">${esc(byId('home-t58'))}</p>
    </div>
    <figure class="plate portrait">
      <div class="plate__media portrait__media"><img src="${m('daniil-portrait.png')}" alt="${esc(byId('home-t52'))}" width="1254" height="1254" loading="lazy" /></div>
      <div class="plate__title"><div>Sheet<b>${esc(byId('home-t53'))}</b></div></div>
      <figcaption><span>${esc(byId('home-t54'))}</span></figcaption>
    </figure>
  </section>

  <section class="section contact" id="contact">
    <p class="section-label">${esc(byId('home-t59'))}</p>
    <h2 class="display title">${esc(byId('home-t60'))}<br /><span class="accent display--light">${esc(byId('home-t61'))}</span></h2>
    <p class="availability"><i></i> ${esc(byId('home-t62'))}</p>
    <div class="contact-links">
      <a href="mailto:${esc(byId('home-t63'))}">${esc(byId('home-t63'))} <b>↗</b></a>
      <a href="https://t.me/insearchofblood" target="_blank" rel="noreferrer">${esc(byId('home-t64'))} <b>↗</b></a>
    </div>
  </section>
</main>
${renderFooter()}
</div>
<script type="module" src="/src/pages/home.js"></script>
</body>
</html>
`;
}
