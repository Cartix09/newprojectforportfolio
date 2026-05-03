/**
 * Lightweight tilt-on-hover + glow follow for project cards.
 * No deps — sets CSS transforms and CSS custom props for a glow blob.
 */
export function initTilt(selector = '.project-card', max = 8) {
  const cards = document.querySelectorAll(selector);
  cards.forEach((card) => {
    let raf = 0;
    let target = { rx: 0, ry: 0, mx: 50, my: 50 };
    let current = { rx: 0, ry: 0, mx: 50, my: 50 };

    function loop() {
      current.rx += (target.rx - current.rx) * 0.12;
      current.ry += (target.ry - current.ry) * 0.12;
      current.mx += (target.mx - current.mx) * 0.18;
      current.my += (target.my - current.my) * 0.18;
      card.style.transform = `perspective(900px) rotateX(${current.rx}deg) rotateY(${current.ry}deg) translateZ(0)`;
      card.style.setProperty('--mx', `${current.mx}%`);
      card.style.setProperty('--my', `${current.my}%`);
      raf = requestAnimationFrame(loop);
    }

    card.addEventListener('pointerenter', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      target.ry = (px - 0.5) * (max * 2);
      target.rx = -(py - 0.5) * (max * 2);
      target.mx = px * 100;
      target.my = py * 100;
    });
    card.addEventListener('pointerleave', () => {
      target = { rx: 0, ry: 0, mx: 50, my: 50 };
      // let it ease back, then cancel
      setTimeout(() => cancelAnimationFrame(raf), 600);
    });
  });
}
