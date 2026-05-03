import * as THREE from 'three';

/**
 * Background: a starfield-style particle drift with subtle parallax
 * driven by the global pointer. Lightweight — single Points buffer, no
 * raycasting, no per-frame allocations.
 */
export function createBackgroundScene({ canvas, prefersReducedMotion }) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const COUNT = window.innerWidth < 720 ? 800 : 1600;
  const positions = new Float32Array(COUNT * 3);
  const sizes = new Float32Array(COUNT);
  const colors = new Float32Array(COUNT * 3);

  const palette = [
    new THREE.Color(0x7cf8d6),
    new THREE.Color(0xa78bfa),
    new THREE.Color(0x60a5fa),
    new THREE.Color(0xffffff),
  ];

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 90;
    positions[i3 + 1] = (Math.random() - 0.5) * 60;
    positions[i3 + 2] = (Math.random() - 0.5) * 60 - 5;
    sizes[i] = Math.random() * 1.6 + 0.2;
    const c = palette[(Math.random() * palette.length) | 0];
    colors[i3] = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Soft round point sprite generated in-canvas (no asset)
  const sprite = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.4, 'rgba(255,255,255,0.6)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  })();

  const mat = new THREE.PointsMaterial({
    size: 0.18,
    map: sprite,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geom, mat);
  scene.add(points);

  const pointer = { x: 0, y: 0 };
  function onPointer(e) {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
  }
  window.addEventListener('pointermove', onPointer, { passive: true });

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  }
  window.addEventListener('resize', onResize);

  let frame = 0;
  let scrollY = 0;
  function setScrollY(v) { scrollY = v; }

  const clock = new THREE.Clock();
  function tick() {
    const t = clock.getElapsedTime();
    if (!prefersReducedMotion) {
      points.rotation.y = t * 0.015 + pointer.x * 0.05;
      points.rotation.x = -pointer.y * 0.05;
      camera.position.y = -scrollY * 0.002;
    }
    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  }
  tick();

  return {
    setScrollY,
    dispose() {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      geom.dispose();
      mat.dispose();
      sprite.dispose();
      renderer.dispose();
    },
  };
}
