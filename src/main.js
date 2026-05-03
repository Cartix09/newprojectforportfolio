import './styles/main.css';
import { renderContent } from './modules/render-content.js';
import { initCursor } from './modules/cursor.js';
import { initTilt } from './modules/tilt.js';
import { initScroll } from './modules/scroll.js';
import { initNav } from './modules/nav.js';
import { createBackgroundScene } from './three/background-scene.js';
import { createHeroScene } from './three/hero-scene.js';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Inject content from data module before everything else.
renderContent();

// 2. Boot UI bits.
initCursor();
initTilt('.project-card', 6);

// 3. 3D scenes.
const bg = createBackgroundScene({
  canvas: document.getElementById('bg-canvas'),
  prefersReducedMotion,
});

const hero = createHeroScene({
  canvas: document.getElementById('hero-canvas'),
  hostEl: document.getElementById('hero'),
  prefersReducedMotion,
});

// 4. Smooth scroll + reveal + relay scroll into 3D scenes.
const { lenis } = initScroll({
  prefersReducedMotion,
  onScroll: ({ y, factor }) => {
    bg.setScrollY(y);
    hero.setScrollFactor(factor);
  },
});

// 5. Nav.
initNav({ lenis });
