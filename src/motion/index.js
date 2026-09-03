import { gsap } from 'gsap';
import { initReveal } from './reveal.js';
import { initHeroEntrance } from './hero.js';
import { initHover } from './hover.js';
import { initTransitions } from './transitions.js';

/* one matchMedia context per page; every timeline lives inside it */
export function initMotion() {
  const mm = gsap.matchMedia();
  initHeroEntrance(mm);
  initReveal(mm);
  initHover(mm);
  initTransitions(mm);
  return mm;
}
