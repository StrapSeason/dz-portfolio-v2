import { makeCtx, esc, m, head, caseNav, hero, label, statement, textGrid, figure, plate, video, roleCards, liveLink, outro, tail } from './case.js';

export function renderAleria(content) {
  const { t, rec } = makeCtx(content);
  const img = (id, w, h) => ({ src: rec(id).src, alt: rec(id).text, w, h });
  const films = [['aleria-onboarding-home.mp4', 't65'], ['aleria-onboarding-office.mp4', 't66'], ['aleria-onboarding-meeting.mp4', 't67'], ['aleria-onboarding-board.mp4', 't68'], ['aleria-onboarding-dinner.mp4', 't69']];
  return `${head({ title: t('title'), desc: t('desc'), ogImage: m('aleria-ecosystem.jpg') })}
<body class="ground" data-case="aleria">
<div class="page" id="top">
${caseNav(t('t2'), t('t3'), t('t4'))}
<main>
${hero({ kicker: t('t5'), title: t('t6'), lead: t('t7'), facts: [[t('t8'), t('t9')], [t('t10'), t('t11')], [t('t12'), t('t13')]], caseKey: 'aleria', sheet: [['Sheet', 'Aleria'], ['Object', 'Lattice'], ['Rev', '2025']] })}

<section class="section sheet"><aside>${label(t('t14'))}</aside><div class="stack stack--loose">${statement([[t('t15')], [t('t16'), true], [t('t17')]])}${textGrid(t('t18'), t('t19'))}</div></section>
<section class="section stage">${plate({ ...img('t20', 3840, 2160), caption: [t('t21'), t('t22')], title: [['Sheet', '01'], ['Format', 'Presentation']], cls: 'plate--wide' })}</section>

<section class="section sheet"><aside>${label(t('t23'))}</aside><div class="stack stack--loose">
  ${statement([[t('t24')], [t('t25'), true]])}
  <ul class="system-list">${[26, 28, 30, 32, 34].map((i) => `<li><span>${esc(t(`t${i}`))}</span><em>${esc(t(`t${i + 1}`))}</em></li>`).join('')}</ul>
</div></section>
<section class="section stage">${plate({ ...img('t36', 1684, 1190), caption: [t('t37')], title: [['Sheet', '02'], ['Format', 'Brand rules']], cls: 'plate--wide' })}</section>

<section class="section sheet"><aside>${label(t('t38'))}</aside><div class="stack stack--loose">${statement([[t('t39')], [t('t40'), true]])}${textGrid(t('t41'), t('t42'))}</div></section>
<section class="section stage"><div class="grid-2">${figure({ ...img('t43', 1400, 788), caption: t('t44') })}${figure({ ...img('t45', 1400, 788), caption: t('t46') })}</div></section>

<section class="section sheet"><aside>${label(t('t47'))}</aside><div class="stack stack--loose">${statement([[t('t48')], [t('t49'), true]])}${textGrid(t('t50'), t('t51'))}</div></section>
<section class="section stage"><div class="grid-2">
  ${figure({ ...img('t52', 1280, 849), caption: t('t53') })}${figure({ ...img('t54', 1280, 728), caption: t('t55') })}
  ${figure({ ...img('t56', 1280, 728), caption: t('t57') })}${figure({ ...img('t58', 1280, 764), caption: t('t59') })}
</div></section>

<section class="section stage stage--dark">
  <div class="stage-head"><p class="section-label">${esc(t('t60'))}</p><h2 class="display h2">${esc(t('t61'))}</h2><p class="lead">${esc(t('t62'))}</p></div>
  ${video({ src: 'aleria-onboarding-tomorrow.mp4', w: 1920, h: 1080, caption: [t('t63'), t('t64')], cls: 'film-lead' })}
  <div class="grid-3 film-grid">${films.map(([f, id]) => video({ src: f, w: 1920, h: 1080, caption: [t(id)] })).join('')}</div>
  ${figure({ ...img('t70', 786, 1704), caption: t('t71'), cls: 'figure--phone' })}
</section>

<section class="section sheet"><aside>${label(t('t72'))}</aside><div class="stack stack--loose">${statement([[t('t73')], [t('t74'), true]])}${textGrid(t('t75'), t('t76'))}</div></section>
<section class="section stage"><div class="split">
  ${plate({ ...img('t77', 3840, 2160), title: [['Sheet', '03'], ['Format', 'Presentation']] })}
  ${plate({ ...img('t78', 1190, 1684), title: [['Sheet', '04'], ['Format', 'Roll-up']], cls: 'plate--tall' })}
</div></section>

<section class="section sheet"><aside>${label(t('t79'))}</aside><div class="stack stack--loose">${statement([[t('t80')], [t('t81'), true]])}${roleCards([[t('t82'), t('t83')], [t('t84'), t('t85')], [t('t86'), t('t87')]])}</div></section>

<section class="section sheet"><aside>${label(t('t88'))}</aside><div class="stack stack--loose">${statement([[t('t89')], [t('t90'), true]])}${textGrid(t('t91'), t('t92'))}<div>${liveLink(t('t93'), rec('t93').href)}</div></div></section>
<section class="section stage">${plate({ ...img('t94', 1400, 788), caption: [t('t95'), t('t96')], title: [['Sheet', '05'], ['Format', 'Deployment']], cls: 'plate--wide' })}</section>
</main>
${outro({ nextLabel: t('t97'), nextName: t('t98'), nextHref: 'case-lumery.html', footer: [t('t99'), t('t100'), t('t101')] })}
</div>
${tail()}`;
}
