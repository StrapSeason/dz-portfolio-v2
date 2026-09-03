/* Page-to-page continuity: a short fade on internal navigation, and the native
   cross-document view transition where the browser has it. Never blocks a click
   longer than one frame of intent. */
import { gsap } from 'gsap';

export function initTransitions(mm) {
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const onClick = (e) => {
      const a = e.target.closest('a[href]');
      if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      if ('startViewTransition' in document) return;               // the browser handles it
      e.preventDefault();
      gsap.to('main', { autoAlpha: 0, y: -8, duration: 0.18, ease: 'power2.in', onComplete: () => { location.href = url.href; } });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  });
}
