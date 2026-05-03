import './styles/main.css';
import { renderContent } from './modules/render-content.js';
import { initCursor } from './modules/cursor.js';
import { initTilt } from './modules/tilt.js';
import { initScroll } from './modules/scroll.js';
import { initNav } from './modules/nav.js';
import { initTheme } from './modules/theme.js';
import { createBackgroundScene } from './three/background-scene.js';
import { createHeroScene } from './three/hero-scene.js';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Theme first — wires the toggle and confirms the data-theme attribute
//    that the inline <head> boot script already set. 3D scenes read this
//    attribute on construction.
initTheme();

// 2. Inject content from the data module.
renderContent();

// 3. UI bits.
initCursor();
initTilt('.project-card', 6);

// 4. 3D scenes.
const bg = createBackgroundScene({
  canvas: document.getElementById('bg-canvas'),
  prefersReducedMotion,
});

const hero = createHeroScene({
  canvas: document.getElementById('hero-canvas'),
  hostEl: document.getElementById('hero'),
  prefersReducedMotion,
});

// 5. Smooth scroll + reveal + relay scroll into 3D scenes.
const { lenis } = initScroll({
  prefersReducedMotion,
  onScroll: ({ y, factor }) => {
    bg.setScrollY(y);
    hero.setScrollFactor(factor);
  },
});

// 6. Section-awareness — tell the 3D scenes which section is currently in view
//    so they can shift composition / palette / drift.
const sections = Array.from(document.querySelectorAll('main > section[id]'));
if (sections.length && 'IntersectionObserver' in window) {
  let activeId = 'hero';
  const ratios = new Map();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => ratios.set(e.target.id, e.intersectionRatio));
      let bestId = activeId;
      let bestRatio = 0;
      ratios.forEach((r, id) => {
        if (r > bestRatio) { bestRatio = r; bestId = id; }
      });
      if (bestId !== activeId && bestRatio > 0) {
        activeId = bestId;
        hero.setActiveSection(activeId);
        bg.setActiveSection(activeId);
      }
    },
    {
      // Multiple thresholds → the section that occupies most of the
      // viewport wins, even when several are partially visible.
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: '-15% 0px -15% 0px',
    }
  );
  sections.forEach((s) => io.observe(s));
}

// 7. Nav (mobile menu + smooth anchor scroll).
initNav({ lenis });
