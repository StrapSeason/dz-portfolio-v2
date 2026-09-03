import { makeCtx, esc, m, head, caseNav, hero, label, statement, textGrid, stageHead, figure, plate, tabs, outro, tail } from './case.js';

export function renderLumery(content) {
  const { t, rec, range, js } = makeCtx(content);
  const A = (id) => rec(id).text;          // alt text of an image record
  const S = (id) => rec(id).src;           // its filename
  const img = (id, w = 1920, h = 1080) => ({ src: S(id), alt: A(id), w, h });

  // logic panel: [copy p, h3 a, h3 b, span] + 6×(b, span) flow + 3×(small,h4,p) model
  const panel = (start) => {
    const r = range(start, `t${+start.slice(1) + 24}`).map((x) => x.text);
    const [p, h3a, h3b, span] = r;
    const flow = []; for (let i = 4; i < 16; i += 2) flow.push([r[i], r[i + 1]]);
    const model = []; for (let i = 16; i < 25; i += 3) model.push([r[i], r[i + 1], r[i + 2]]);
    return `<div class="logic-panel">
      <div class="stack"><p class="section-label">${esc(p)}</p><h3 class="display h3">${esc(h3a)}<br />${esc(h3b)}</h3><p class="body">${esc(span)}</p></div>
      <ol class="logic-flow">${flow.map(([b, s]) => `<li><b>${esc(b)}</b><span>${esc(s)}</span></li>`).join('')}</ol>
      <div class="logic-model grid-3">${model.map(([sm, h4, pp]) => `<div><small class="label">${esc(sm)}</small><h4>${esc(h4)}</h4><p>${esc(pp)}</p></div>`).join('')}</div>
    </div>`;
  };
  // pipeline groups: small + n spans
  const pipeline = [['t60', 4], ['t65', 4], ['t70', 2], ['t73', 1]].map(([id, n]) => {
    const r = range(id, `t${+id.slice(1) + n}`).map((x) => x.text);
    return `<div class="pipe"><small class="label">${esc(r[0])}</small>${r.slice(1).map((s) => `<span>${esc(s)}</span>`).join('')}</div>`;
  }).join('');
  const decisions = [153, 156, 159, 162].map((i) => `<article class="decision"><small class="label">${esc(t(`t${i}`))}</small><h3 class="display h3">${esc(t(`t${i + 1}`))}</h3><p class="body">${esc(t(`t${i + 2}`))}</p></article>`).join('');
  // workfile: six real Figma views from the old viewer's data (alt, path, stage, title, description, index)
  const files = ['lumery-figma-architecture.jpg', 'lumery-figma-wireframes.jpg', 'lumery-figma-dark-flow.jpg', 'lumery-figma-system.jpg', 'lumery-figma-review.jpg', 'lumery-figma-light-flow.jpg'];
  const views = files.map((f, i) => ({ file: f, alt: js[i * 6], path: js[i * 6 + 1], stage: js[i * 6 + 2], title: js[i * 6 + 3], desc: js[i * 6 + 4], index: js[i * 6 + 5] }));
  const legend = ['t171', 't172', 't174', 't175', 't176', 't178'].map((id) => t(id));
  const legendGroups = [[t('t170'), legend.slice(0, 2)], [t('t173'), legend.slice(2, 5)], [t('t177'), legend.slice(5)]];
  const roles = [209, 211, 213].map((i) => `<article class="role-card"><span class="label label--accent">${esc(t(`t${i}`))}</span><p>${esc(t(`t${i + 1}`))}</p></article>`).join('');

  return `${head({ title: t('title'), desc: t('desc'), ogImage: m('lumery-product-front.png') })}
<body class="ground" data-case="lumery">
<div class="page" id="top">
${caseNav(t('t2'), t('t3'), t('t4'))}
<main>
${hero({ kicker: t('t6'), title: t('t7'), lead: t('t8'), facts: [[t('t9'), t('t10')], [t('t11'), t('t12')], [t('t13'), t('t14')]], caseKey: 'lumery', sheet: [['Sheet', 'Lumery'], ['Object', 'Assembly'], ['Scale', '1 : 1']] })}

<section class="section sheet">
  <aside>${label(t('t15'))}</aside>
  <div class="stack stack--loose">${statement([[t('t16')], [t('t17'), true]])}${textGrid(t('t18'), t('t19'))}</div>
</section>

<section class="section stage">
  ${stageHead(t('t20'), [t('t21'), t('t22')], t('t23'))}
  ${plate({ ...img('t5'), pos: '8% 30%', caption: [t('t20')], title: [['Sheet', '01'], ['View', 'Cut-away']] })}
  ${plate({ ...img('t24'), pos: '50% 45%', caption: [t('t25'), t('t26')], title: [['Sheet', '02'], ['View', 'Front']], cls: 'plate--wide' })}
  <div class="grid-2">${figure({ ...img('t27', 1920, 1072), caption: t('t28') })}${figure({ ...img('t29', 1920, 1072), caption: t('t30') })}</div>
</section>

<section class="section sheet">
  <aside>${label(t('t31'))}</aside>
  <div class="stack stack--loose">
    ${statement([[t('t32')], [t('t33'), true]])}
    <ul class="system-list">${[34, 36, 38, 40].map((i) => `<li><span>${esc(t(`t${i}`))}</span><em>${esc(t(`t${i + 1}`))}</em></li>`).join('')}</ul>
  </div>
</section>

<section class="section stage"><div class="grid-2">${figure({ ...img('t42', 1920, 1072), caption: t('t43') })}${figure({ ...img('t44', 1920, 1072), caption: t('t45') })}</div></section>

<section class="section stage stage--dark">
  ${stageHead(t('t46'), [t('t47'), t('t48')], t('t49'))}
  ${plate({ ...img('t50'), caption: [t('t51')], title: [['Sheet', '03'], ['Surface', 'Companion app']], cls: 'plate--wide' })}
  <div class="grid-2">${figure({ ...img('t52'), caption: t('t53') })}${figure({ ...img('t54'), caption: t('t55') })}</div>
</section>

<section class="section stage">
  ${stageHead(t('t56'), [t('t57'), t('t58')], t('t59'))}
  <div class="pipeline">${pipeline}</div>
  ${tabs('logic', [t('t75'), t('t76'), t('t77')], [panel('t78'), panel('t103'), panel('t128')], 'Lumery logic')}
  <div class="grid-4 decisions">${decisions}</div>
</section>

<section class="section stage workfile">
  ${stageHead(t('t165'), [t('t166'), t('t167')], t('t168'))}
  <div class="workfile__legend">
    <p class="label"><b>${esc(t('t169'))}</b></p>
    ${legendGroups.map(([g, items]) => `<div class="workfile__group"><span class="label">${esc(g)}</span>${items.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div>`).join('')}
    <p class="label"><b>${esc(t('t179'))}</b> · <a href="${m(files[0])}" target="_blank" rel="noreferrer">${esc(t('t180'))}</a></p>
  </div>
  <div class="workfile__views">${views.map((v) => plate({ src: v.file, alt: v.alt, w: 2560, h: 1440, caption: [v.path, v.index], title: [['Stage', v.stage], ['Sheet', v.index]], cls: 'workfile__view' }) + `<div class="workfile__copy"><h4 class="display h3">${esc(v.title)}</h4><p class="body">${esc(v.desc)}</p></div>`).join('')}</div>
  <div class="workfile__copy"><small class="label">${esc(t('t182'))}</small><h4 class="display h3">${esc(t('t183'))}</h4><p class="body">${esc(t('t184'))}</p><p class="muted">${esc(t('t185'))}</p></div>
  <p class="label workfile__note">${esc(t('t186'))} · ${esc(t('t187'))}</p>
</section>

<section class="section sheet">
  <aside>${label(t('t188'))}</aside>
  <div class="stack stack--loose">
    ${statement([[t('t189')], [t('t190'), true], [t('t191')]])}
    ${textGrid(t('t192'), t('t193'))}
    <p class="signal mono"><span>${esc(t('t194'))}</span><b>${esc(t('t195'))}</b></p>
    ${figure({ ...img('t196'), caption: t('t197') })}
  </div>
</section>

<section class="section stage">
  ${stageHead(t('t198'), [t('t199'), t('t200')], t('t201'))}
  <div class="grid-2">${figure({ ...img('t202'), caption: t('t203') })}${figure({ ...img('t204', 1920, 1072), caption: t('t205') })}</div>
</section>

<section class="section sheet">
  <aside>${label(t('t206'))}</aside>
  <div class="stack stack--loose">${statement([[t('t207')], [t('t208'), true]])}<div class="grid-3 role-cards">${roles}</div></div>
</section>

<section class="section sheet">
  <aside>${label(t('t215'))}</aside>
  <div class="stack stack--loose">${statement([[t('t216')], [t('t217'), true]])}${textGrid(t('t218'), t('t219'))}</div>
</section>
</main>
${outro({ nextLabel: t('t220'), nextName: t('t221'), nextHref: 'case-bitronix.html', footer: [t('t222'), t('t223'), t('t224')] })}
</div>
${tail()}`;
}
