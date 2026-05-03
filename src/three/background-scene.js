import * as THREE from 'three';

/**
 * Background: a starfield-style particle drift with subtle parallax
 * driven by the global pointer. Section-aware: opacity, drift speed,
 * and color blend shift slightly per section. Theme-aware: re-skins
 * particle palette when "themechange" fires.
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

  const COUNT = window.innerWidth < 720 ? 700 : 1500;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    positions[i3]     = (Math.random() - 0.5) * 90;
    positions[i3 + 1] = (Math.random() - 0.5) * 60;
    positions[i3 + 2] = (Math.random() - 0.5) * 60 - 5;
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Sprite (no asset needed)
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

  // ---- Theme palettes ----
  const palettes = {
    dark: [
      new THREE.Color(0x7cf8d6),
      new THREE.Color(0xa78bfa),
      new THREE.Color(0x60a5fa),
      new THREE.Color(0xffffff),
    ],
    light: [
      new THREE.Color(0x0d9488),
      new THREE.Color(0x7c3aed),
      new THREE.Color(0x2563eb),
      new THREE.Color(0x14181f),
    ],
  };

  function applyPalette(themeName) {
    const palette = palettes[themeName] || palettes.dark;
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const c = palette[(i + (i * 7) % palette.length) % palette.length];
      colors[i3] = c.r; colors[i3 + 1] = c.g; colors[i3 + 2] = c.b;
    }
    geom.attributes.color.needsUpdate = true;
    mat.opacity = themeName === 'light' ? 0.55 : 0.85;
    mat.blending = themeName === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending;
  }
  applyPalette(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  window.addEventListener('themechange', (e) => {
    applyPalette(e?.detail?.theme === 'light' ? 'light' : 'dark');
  });

  // ---- Pointer + scroll + section ----
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

  const sectionPresets = {
    hero:        { driftSpeed: 0.015, sizeMul: 1.0,  opacityMul: 1.0,  zoom: 0.0 },
    about:       { driftSpeed: 0.012, sizeMul: 0.95, opacityMul: 0.9,  zoom: -1 },
    projects:    { driftSpeed: 0.025, sizeMul: 1.1,  opacityMul: 1.0,  zoom:  1 },
    experience:  { driftSpeed: 0.010, sizeMul: 0.9,  opacityMul: 0.8,  zoom: -2 },
    skills:      { driftSpeed: 0.030, sizeMul: 1.25, opacityMul: 1.05, zoom:  2 },
    education:   { driftSpeed: 0.011, sizeMul: 0.95, opacityMul: 0.85, zoom: -1 },
    credentials: { driftSpeed: 0.014, sizeMul: 1.0,  opacityMul: 0.9,  zoom:  0 },
    contact:     { driftSpeed: 0.008, sizeMul: 0.85, opacityMul: 0.7,  zoom: -3 },
  };
  let active = sectionPresets.hero;
  const live = { ...active };
  function setActiveSection(id) { if (sectionPresets[id]) active = sectionPresets[id]; }

  let scrollY = 0;
  function setScrollY(v) { scrollY = v; }

  let frame = 0;
  const clock = new THREE.Clock();
  const lerp = (a, b, t) => a + (b - a) * t;
  const baseSize = mat.size;
  const baseOpacityRef = { dark: 0.85, light: 0.55 };

  function tick() {
    const t = clock.getElapsedTime();
    const k = prefersReducedMotion ? 1 : 0.04;

    live.driftSpeed = lerp(live.driftSpeed, active.driftSpeed, k);
    live.sizeMul    = lerp(live.sizeMul,    active.sizeMul,    k);
    live.opacityMul = lerp(live.opacityMul, active.opacityMul, k);
    live.zoom       = lerp(live.zoom,       active.zoom,       k);

    if (!prefersReducedMotion) {
      points.rotation.y += live.driftSpeed * 0.016;
      points.rotation.y += pointer.x * 0.0006;
      points.rotation.x = -pointer.y * 0.05;
      camera.position.y = -scrollY * 0.002;
      camera.position.z = 30 + live.zoom;
    }

    mat.size = baseSize * live.sizeMul;
    const themeName = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    mat.opacity = baseOpacityRef[themeName] * live.opacityMul;

    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  }
  tick();

  return {
    setScrollY,
    setActiveSection,
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
