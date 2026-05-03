import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth scroll + scroll-driven reveals.
 * - Lenis runs the rAF loop and reports to ScrollTrigger.
 * - Each element with .reveal fades + slides in when it crosses the viewport.
 * - Hero scene & background scene get scroll callbacks via the returned API.
 */
export function initScroll({ prefersReducedMotion, onScroll } = {}) {
  let lenis = null;

  if (!prefersReducedMotion) {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      smoothTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if (prefersReducedMotion) {
    reveals.forEach(el => el.classList.add('is-visible'));
  } else {
    reveals.forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        onEnter: () => el.classList.add('is-visible'),
        once: true,
      });
    });
  }

  // Section title parallax (soft slide-in)
  if (!prefersReducedMotion) {
    document.querySelectorAll('.section-head').forEach((head) => {
      gsap.from(head, {
        y: 36,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: head,
          start: 'top 90%',
          once: true,
        },
      });
    });
  }

  // Generic scroll callback (used by 3D scenes for scroll-reactive scaling)
  function dispatchScroll() {
    const y = window.scrollY || window.pageYOffset || 0;
    const heroH = window.innerHeight;
    const factor = Math.min(y / heroH, 1.4);
    onScroll && onScroll({ y, factor });
  }
  window.addEventListener('scroll', dispatchScroll, { passive: true });
  dispatchScroll();

  // Nav scrolled state
  const nav = document.querySelector('.nav');
  function navState() {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', (window.scrollY || 0) > 20);
  }
  window.addEventListener('scroll', navState, { passive: true });
  navState();

  return { lenis };
}
