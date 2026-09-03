/* Micro-interactions that CSS cannot express: the plate title block nudges its
   cells on hover, the case row arrow leans. Everything else is CSS. */
import { gsap } from 'gsap';

export function initHover(mm, root = document) {
  mm.add('(prefers-reduced-motion: no-preference) and (hover: hover)', () => {
    const rows = [...root.querySelectorAll('.case-row')];
    const handlers = rows.map((row) => {
      const img = row.querySelector('img');
      const on = () => gsap.to(img, { scale: 1.04, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
      const off = () => gsap.to(img, { scale: 1, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
      row.addEventListener('pointerenter', on); row.addEventListener('pointerleave', off);
      row.addEventListener('focusin', on); row.addEventListener('focusout', off);
      return () => { row.removeEventListener('pointerenter', on); row.removeEventListener('pointerleave', off); row.removeEventListener('focusin', on); row.removeEventListener('focusout', off); gsap.set(img, { clearProps: 'all' }); };
    });
    return () => handlers.forEach((h) => h());
  });
}
