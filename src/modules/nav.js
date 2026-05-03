/**
 * Mobile nav toggle + smooth in-page nav links (when Lenis is around,
 * the browser's native scroll-to is fine; Lenis intercepts).
 */
export function initNav({ lenis } = {}) {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Close menu when a link is clicked + smooth scroll via Lenis if present
  links.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      if (lenis && href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -60, duration: 1.1 });
        }
      }
    });
  });
}
