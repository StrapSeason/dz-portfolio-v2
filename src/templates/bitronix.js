import { makeCtx, esc, m, head, caseNav, hero, label, statement, textGrid, stageHead, figure, plate, tabs, video, roleCards, liveLink, outro, tail } from './case.js';

export function renderBitronix(content) {
  const { t, rec, js } = makeCtx(content);
  const img = (id, w, h) => ({ src: rec(id).src, alt: rec(id).text, w, h });
  const bots = [['t25', 't26', 't27'], ['t28', 't29', 't30'], ['t31', 't32', 't33'], ['t34', 't35', 't36']];
  const botFiles = ['bitronix-bot-green.png', 'bitronix-bot-blue.png', 'bitronix-bot-purple.png', 'bitronix-bot-pink.png'];
  // strategy profiles: 4 × (alt, profile, name, description, index) from the old selector's data
  const profiles = [0, 1, 2, 3].map((i) => ({ alt: js[i * 5], profile: js[i * 5 + 1], name: js[i * 5 + 2], desc: js[i * 5 + 3], index: js[i * 5 + 4], file: botFiles[i] }));
  const panel = (p) => `<div class="strategy split split--even">
    <figure class="plate"><div class="plate__media"><img src="${m(p.file)}" alt="${esc(p.alt)}" width="589" height="587" loading="lazy" /></div><div class="plate__title"><div>Sheet<b>${esc(p.index)}</b></div><div>Profile<b>${esc(p.name)}</b></div></div></figure>
    <div class="stack"><p class="section-label">${esc(p.profile)}</p><h3 class="display h2">${esc(p.name)}</h3><p class="body">${esc(p.desc)}</p></div>
  </div>`;
  return `${head({ title: t('title'), desc: t('desc'), ogImage: m('bitronix-robot.png') })}
<body class="ground" data-case="bitronix">
<div class="page" id="top">
${caseNav(t('t2'), t('t3'), t('t4'))}
<main>
${hero({ kicker: t('t6'), title: t('t7'), lead: t('t8'), facts: [[t('t9'), t('t10')], [t('t11'), t('t12')], [t('t13'), t('t14')]], caseKey: 'bitronix', sheet: [['Sheet', 'Bitronix'], ['Object', 'Character'], ['Rev', '2026']] })}

<section class="section sheet"><aside>${label(t('t15'))}</aside><div class="stack stack--loose">${statement([[t('t16')], [t('t17'), true], [t('t18')]])}${textGrid(t('t19'), t('t20'))}</div></section>

<section class="section stage">
  ${stageHead(t('t21'), [t('t22'), t('t23')], t('t24'))}
  ${plate({ ...img('t5', 1456, 832), title: [['Sheet', '01'], ['View', 'Character world']], cls: 'plate--wide' })}
  <div class="grid-4 bots">${bots.map(([i, n, tr], k) => `<figure class="figure bot"><div class="figure__media"><img src="${m(botFiles[k])}" alt="${esc(t(i))}" width="589" height="587" loading="lazy" /></div><figcaption><span>${esc(t(n))}</span><span>${esc(t(tr))}</span></figcaption></figure>`).join('')}</div>
</section>

<section class="section stage">
  ${stageHead(t('t37'), [t('t38'), t('t39')], t('t40'))}
  ${tabs('strategy', [t('t41'), t('t42'), t('t43'), t('t44')], profiles.map(panel), 'Strategy profiles')}
  <p class="label"><span>${esc(t('t45'))}</span> · ${esc(t('t46'))} · ${esc(t('t47'))} · ${esc(t('t48'))} · ${esc(t('t49'))}</p>
</section>

<section class="section sheet"><aside>${label(t('t50'))}</aside><div class="stack stack--loose">${statement([[t('t51')], [t('t52'), true], [t('t53')]])}${textGrid(t('t54'), t('t55'))}</div></section>
<section class="section stage">
  ${plate({ ...img('t56', 2560, 1440), caption: [t('t57'), t('t58')], title: [['Sheet', '02'], ['Format', 'Product story']], cls: 'plate--wide' })}
  <div class="grid-2">${[[59, 60], [61, 62], [63, 64], [65, 66]].map(([a, b]) => figure({ ...img(`t${a}`, 2560, 1440), caption: t(`t${b}`) })).join('')}</div>
</section>

<section class="section stage stage--dark">
  <div class="stage-head"><p class="section-label">${esc(t('t67'))}</p><h2 class="display h2">${esc(t('t68'))}<br />${esc(t('t69'))}</h2><p class="lead">${esc(t('t70'))}</p></div>
  <div class="motion-grid">
    ${video({ src: 'bitronix-character-film.mp4', poster: 'bitronix-robot.png', w: 1080, h: 1920, caption: [t('t71'), t('t72')], cls: 'video--portrait' })}
    ${video({ src: 'bitronix-promo-male-en.mp4', w: 1294, h: 720, caption: [t('t73')] })}
    ${video({ src: 'bitronix-channel-motion-01.mp4', w: 848, h: 848, caption: [t('t74')], cls: 'video--square' })}
    ${video({ src: 'bitronix-channel-motion-02.mp4', w: 848, h: 848, caption: [t('t75')], cls: 'video--square' })}
  </div>
</section>

<section class="section sheet"><aside>${label(t('t76'))}</aside><div class="stack stack--loose">
  ${statement([[t('t77')], [t('t78'), true]])}
  <div class="grid-4 scale-grid">${[79, 82, 85, 88].map((i) => `<div><small class="label label--accent">${esc(t(`t${i}`))}</small><h3 class="display h3">${esc(t(`t${i + 1}`))}</h3><p>${esc(t(`t${i + 2}`))}</p></div>`).join('')}</div>
</div></section>

<section class="section sheet"><aside>${label(t('t91'))}</aside><div class="stack stack--loose">${statement([[t('t92')], [t('t93'), true]])}${roleCards([['', t('t94')], ['', t('t95')], ['', t('t96')]])}<div>${liveLink(t('t97'), rec('t97').href)}</div></div></section>
</main>
${outro({ nextLabel: t('t98'), nextName: t('t99'), nextHref: 'case-every-bali.html', footer: [t('t100'), t('t101'), t('t102')] })}
</div>
${tail()}`;
}
