/**
 * Custom cursor: a tiny dot + a delayed-follow ring.
 * Disabled on touch / small screens via CSS.
 */
export function initCursor() {
  const el = document.getElementById('cursor');
  if (!el) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = el.querySelector('.cursor-dot');
  const ring = el.querySelector('.cursor-ring');

  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const ringPos = { x: pos.x, y: pos.y };

  window.addEventListener('pointermove', (e) => {
    pos.x = e.clientX;
    pos.y = e.clientY;
  }, { passive: true });

  document.querySelectorAll('[data-cursor="hover"], a, button').forEach((node) => {
    node.addEventListener('pointerenter', () => el.classList.add('is-hover'));
    node.addEventListener('pointerleave', () => el.classList.remove('is-hover'));
  });

  function loop() {
    ringPos.x += (pos.x - ringPos.x) * 0.18;
    ringPos.y += (pos.y - ringPos.y) * 0.18;
    dot.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  loop();
}
