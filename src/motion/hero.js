/* The one orchestrated moment: the cover sheet draws itself. */
import { gsap } from 'gsap';

export function initHeroEntrance(mm, root = document) {
  const copy = root.querySelector('.hero__copy, .case-hero > .stack');
  const plate = root.querySelector('.hero__plate, .case-hero__plate');
  if (!copy || !plate) return;
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const lines = [...copy.children];
    const annot = [...plate.querySelectorAll('.plate__annot line, .plate__annot circle, .plate__annot path')];
    const cells = [...plate.querySelectorAll('.plate__title > div')];
    annot.forEach((p) => { const len = p.getTotalLength ? p.getTotalLength() : 600; p.style.strokeDasharray = len; p.style.strokeDashoffset = len; });
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(plate, { autoAlpha: 0, duration: 0.6 }, 0)
      .from(lines, { autoAlpha: 0, y: 18, duration: 0.7, stagger: 0.09 }, 0.15)
      .to(annot, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', stagger: 0.08 }, 0.4)
      .from(cells, { autoAlpha: 0, y: 6, duration: 0.5, stagger: 0.06 }, 0.9);
    return () => { tl.kill(); gsap.set([plate, ...lines, ...cells], { clearProps: 'all' }); annot.forEach((p) => { p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; }); };
  });
}
