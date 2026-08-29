import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGallery } from './features/gallery.js';
import { initMap } from './features/map.js';
import { initMedia } from './features/media.js';
import { initReveal } from './features/reveal.js';
import { initRoadbook } from './features/roadbook.js';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Progressive enhancement: content is hidden only after GSAP is ready.
if (!reducedMotion) root.classList.add('movimento-ativo');

function initSmoothScroll() {
  if (reducedMotion) return null;

  const lenis = new Lenis({ autoRaf: false, duration: 1.05 });
  lenis.on('scroll', ScrollTrigger.update);

  // GSAP owns the only animation clock used by the page.
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

function initNavigation(lenis) {
  const brand = document.querySelector('.barra__marca');
  if (!brand) return;

  brand.addEventListener('click', (event) => {
    event.preventDefault();

    if (lenis) {
      lenis.scrollTo(0, { duration: 1.1 });
      return;
    }

    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  });
}

function scheduleIdle(callback) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout: 500 });
    return;
  }

  window.setTimeout(callback, 0);
}

const context = { gsap, ScrollTrigger, root, reducedMotion };
const lenis = initSmoothScroll();

initNavigation(lenis);
initMap(context);
initMedia(context);

scheduleIdle(() => {
  initReveal(context);
  initGallery(context);
  initRoadbook(context);

  document.fonts.ready.then(() => ScrollTrigger.refresh());
});
