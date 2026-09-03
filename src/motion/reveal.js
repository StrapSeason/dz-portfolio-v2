/* Quiet scroll reveals: transform/opacity only, once, gated by reduced motion. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const SELECTOR = '.section > *:not(aside), .stage > *, .index > *';

export function initReveal(mm) {
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const targets = gsap.utils.toArray(SELECTOR).filter((el) => el.getBoundingClientRect().top > innerHeight * 0.9);
    targets.forEach((el) => {
      gsap.fromTo(el, { autoAlpha: 0, y: 22 }, {
        autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', overwrite: 'auto',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
    return () => targets.forEach((el) => gsap.set(el, { clearProps: 'all' }));
  });
}
