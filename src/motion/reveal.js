/* Quiet scroll reveals: opacity + transform only, once, gated by reduced motion.
   Never visibility:hidden — unrevealed content must stay focusable and readable;
   focus into a pending element completes its reveal immediately. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const SELECTOR = '.section > *:not(aside), .stage > *, .index > *';

export function initReveal(mm) {
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const targets = gsap.utils.toArray(SELECTOR).filter((el) => el.getBoundingClientRect().top > innerHeight * 0.9);
    const tweens = targets.map((el) => gsap.fromTo(el, { opacity: 0, y: 22 }, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', overwrite: 'auto',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    }));
    const onFocus = (e) => {
      const el = targets.find((t) => t.contains(e.target));
      const i = targets.indexOf(el);
      if (i < 0) return;
      tweens[i].scrollTrigger?.kill(); tweens[i].progress(1);
    };
    document.addEventListener('focusin', onFocus);
    return () => { document.removeEventListener('focusin', onFocus); tweens.forEach((t) => t.kill()); targets.forEach((el) => gsap.set(el, { clearProps: 'all' })); };
  });
}
