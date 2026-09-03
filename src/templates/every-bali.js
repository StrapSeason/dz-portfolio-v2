import { makeCtx, esc, m, head, caseNav, hero, label, statement, textGrid, stageHead, figure, plate, liveLink, outro, tail } from './case.js';

export function renderEveryBali(content) {
  const { t, rec, js } = makeCtx(content);
  const img = (id, w, h) => ({ src: rec(id).src, alt: rec(id).text, w, h });
  // The old drag plane is NOT re-implemented: in the Instrument direction the eight
  // facility renders are laid out as a contact sheet under a static reconstruction of the screen.
  const tiles = [['every-bali-hero-pool.webp', 416, 744, js[0]], ['every-bali-hero-gym.webp', 416, 744, ''], ['every-bali-hero-workout.webp', 416, 744, js[1]], ['every-bali-hero-running.png', 896, 1344, js[2]], ['every-bali-hero-surf.png', 1280, 1164, ''], ['every-bali-hero-spa.png', 416, 744, ''], ['every-bali-hero-sauna.png', 416, 744, js[3]], ['every-bali-hero-beauty.png', 1200, 1500, '']];
  const dl = (pairs) => `<dl class="spec">${pairs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
  // each unit's feature line comes from the old masterplan data (js[6], js[10], js[14])
  const card = (imgId, kind, h3, size, specs, features) => `<article class="unit-card"><div class="figure__media"><img src="${m(rec(imgId).src)}" alt="${esc(t(imgId))}" width="664" height="744" loading="lazy" /></div><div class="stack stack--tight"><span class="label label--accent">${esc(t(kind))}</span><h3 class="display h3">${esc(t(h3))}</h3><b class="mono">${esc(t(size))}</b>${dl(specs.map(([a, b]) => [t(a), t(b)]))}<p class="muted">${esc(features)}</p></div></article>`;
  return `${head({ title: t('title'), desc: t('desc'), ogImage: m('every-bali-hero.png') })}
<body class="ground" data-case="every-bali">
<div class="page" id="top">
${caseNav(t('t2'), t('t3'), t('t4'))}
<main>
${hero({ kicker: t('t6'), title: t('t7'), lead: t('t8'), facts: [[t('t9'), t('t10')], [t('t11'), t('t12')], [t('t13'), t('t14')]], caseKey: 'every-bali', sheet: [['Sheet', 'Every Bali'], ['Object', 'Masterplan'], ['Rev', '2026']] })}
<section class="section stage">${plate({ ...img('t5', 1440, 880), title: [['Sheet', '01'], ['View', 'Site']], cls: 'plate--wide' })}</section>

<section class="section sheet"><aside>${label(t('t15'))}</aside><div class="stack stack--loose">${statement([[t('t16')], [t('t17'), true]])}${textGrid(t('t18'), t('t19'))}</div></section>

<section class="section stage">
  <div class="stage-head"><p class="section-label">${esc(t('t20'))}</p><h2 class="display h2">${esc(t('t21'))}</h2><p class="lead">${esc(t('t22'))}</p></div>
  <figure class="plate screen">
    <div class="plate__media screen__media">
      <div class="tiles">${tiles.map(([f, w, h, cap]) => `<figure class="tile"><img src="${m(f)}" alt="" width="${w}" height="${h}" loading="lazy" />${cap ? `<figcaption>${esc(cap)}</figcaption>` : ''}</figure>`).join('')}</div>
      <div class="screen__nav"><span>${esc(t('t23'))}</span><span>${esc(t('t24'))}</span><strong>${esc(t('t25'))}</strong><span>${esc(t('t26'))}</span><span>${esc(t('t27'))}</span></div>
      <div class="screen__title"><span class="display">${esc(t('t28'))}</span><small>${esc(t('t29'))}<br />${esc(t('t30'))}</small></div>
      <div class="screen__actions"><b>${esc(t('t31'))}</b><i>${esc(t('t32'))}</i></div>
      <p class="screen__hint">${esc(t('t33'))}</p>
    </div>
    <div class="plate__title"><div>Sheet<b>02</b></div><div>View<b>Home screen</b></div></div>
    <figcaption><span>${esc(t('t20'))}</span></figcaption>
  </figure>
  <ul class="principles">${['t34', 't35', 't36'].map((id) => `<li>${esc(t(id))}</li>`).join('')}</ul>
  <div>${liveLink(t('t37'), rec('t37').href)}</div>
</section>

<section class="section sheet"><aside>${label(t('t38'))}</aside><div class="stack stack--loose">
  ${statement([[t('t39')], [t('t40'), true]])}
  <ul class="system-list">${[41, 43, 45, 47, 49].map((i) => `<li><span>${esc(t(`t${i}`))}</span><em>${esc(t(`t${i + 1}`))}</em></li>`).join('')}</ul>
</div></section>

<section class="section stage">
  ${stageHead(t('t51'), [t('t52'), t('t53')], t('t54'))}
  <div class="split">
    <figure class="plate"><div class="plate__media"><img src="${m(rec('t55').src)}" alt="${esc(t('t55'))}" width="1440" height="860" loading="lazy" />
      <svg class="plate__annot" viewBox="0 0 1000 597" preserveAspectRatio="none" aria-hidden="true">
        <circle cx="300" cy="300" r="14" /><text x="322" y="296">${esc(t('t56'))} · ${esc(t('t57'))}</text>
        <circle cx="560" cy="360" r="14" /><text x="582" y="356">${esc(t('t58'))} · ${esc(t('t59'))}</text>
        <circle cx="620" cy="220" r="14" /><text x="642" y="216">${esc(t('t60'))} · ${esc(t('t61'))}</text>
      </svg></div>
      <div class="plate__title"><div>Sheet<b>03</b></div><div>View<b>Masterplan</b></div></div><figcaption><span>${esc(t('t75'))}</span></figcaption></figure>
    <article class="unit-card unit-card--lead">
      <div class="figure__media"><img src="${m(rec('t62').src)}" alt="${esc(t('t62'))}" width="664" height="744" loading="lazy" /></div>
      <div class="stack stack--tight"><span class="label label--accent">${esc(t('t63'))} · ${esc(t('t64'))}</span><h3 class="display h3">${esc(t('t65'))}</h3>
      ${dl([[t('t66'), t('t67')], [t('t68'), t('t69')], [t('t70'), `${t('t71')} ${t('t72')}`]])}
      <p class="muted">${esc(t('t73'))}</p>${liveLink(t('t74'), rec('t74').href)}</div>
    </article>
  </div>
</section>

<section class="section stage">
  ${stageHead(t('t76'), [t('t77'), t('t78')], t('t79'))}
  <div class="cluster"><span class="label">${esc(t('t80'))}</span><span class="chip">${esc(t('t81'))}</span><span class="chip">${esc(t('t82'))}</span><span class="chip">${esc(t('t83'))}</span></div>
  <div class="grid-3 catalog">
    ${card('t84', 't85', 't86', 't87', [['t88', 't89'], ['t90', 't91'], ['t92', 't93']], js[6])}
    ${card('t94', 't95', 't96', 't97', [['t98', 't99'], ['t100', 't101'], ['t102', 't103']], js[10])}
    ${card('t104', 't105', 't106', 't107', [['t108', 't109'], ['t110', 't111'], ['t112', 't113']], js[14])}
  </div>
</section>

<section class="section stage stage--dark">
  ${stageHead(t('t114'), [t('t115'), t('t116'), t('t117')], t('t118'))}
  <div class="grid-3 phones">${[['t119', 't120'], ['t121', 't122'], ['t123', 't124']].map(([i, c]) => figure({ ...img(i, 390, 844), caption: t(c), cls: 'figure--phone' })).join('')}</div>
  <p class="label">${esc(t('t125'))} · ${esc(t('t126'))}</p>
</section>

<section class="section sheet"><aside>${label(t('t127'))}</aside><div class="stack stack--loose">
  ${statement([[t('t128')], [t('t129'), true]])}${textGrid(t('t130'), t('t131'))}
  <div class="grid-3 decisions">${[132, 135, 138].map((i) => `<article class="decision"><small class="label">${esc(t(`t${i}`))}</small><h3 class="display h3">${esc(t(`t${i + 1}`))}</h3><p class="body">${esc(t(`t${i + 2}`))}</p></article>`).join('')}</div>
</div></section>

<section class="section stage roi">
  <div class="split split--even">
    <div class="stack stack--loose"><p class="section-label">${esc(t('t141'))}</p><h2 class="display h2">${esc(t('t142'))}</h2><p class="lead">${esc(t('t143'))}</p><div>${liveLink(t('t144'), rec('t144').href)}</div></div>
    <div class="plate roi__panel">
      <p class="label">${esc(t('t145'))}</p>
      <div class="grid-3 roi__figures">
        <div><small>${esc(t('t146'))}</small><b>${esc(t('t147'))}</b><span>${esc(t('t148'))}</span></div>
        <div class="is-lead"><small>${esc(t('t149'))}</small><b>${esc(t('t150'))}<i>${esc(t('t151'))}</i></b><span>${esc(t('t152'))}</span></div>
        <div><small>${esc(t('t153'))}</small><b>${esc(t('t154'))}</b><span>${esc(t('t155'))}</span></div>
      </div>
      <table class="table"><tbody>${[156, 158, 160].map((i) => `<tr><td>${esc(t(`t${i}`))}</td><td class="mono">${esc(t(`t${i + 1}`))}</td></tr>`).join('')}</tbody></table>
    </div>
  </div>
</section>

<section class="section sheet"><aside>${label(t('t162'))}</aside><div class="stack stack--loose">${statement([[t('t163')], [t('t164'), true]])}${textGrid(t('t165'), t('t166'))}<div>${liveLink(t('t167'), rec('t167').href)}</div></div></section>
</main>
${outro({ nextLabel: t('t168'), nextName: t('t169'), nextHref: 'case-aleria.html', footer: [t('t170'), t('t171'), t('t172')] })}
</div>
${tail()}`;
}
