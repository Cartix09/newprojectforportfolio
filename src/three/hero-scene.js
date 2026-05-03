import * as THREE from 'three';

/**
 * Hero scene: a cluster of low-poly forms with cursor parallax, soft float,
 * and pointer drag-to-rotate. Pointer events are received by the hero
 * <section> and forwarded here, so the canvas itself stays pointer-none and
 * doesn't block scroll/clicks elsewhere.
 */
export function createHeroScene({ canvas, hostEl, prefersReducedMotion }) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 8);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // Lights
  const ambient = new THREE.AmbientLight(0x6677aa, 0.55);
  scene.add(ambient);

  const keyLight = new THREE.PointLight(0x7cf8d6, 2.4, 40);
  keyLight.position.set(4, 4, 6);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0xa78bfa, 1.8, 40);
  rimLight.position.set(-5, -2, 4);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0x60a5fa, 1.2, 30);
  fillLight.position.set(0, -4, 5);
  scene.add(fillLight);

  // Group of shapes — drag rotates the group
  const group = new THREE.Group();
  scene.add(group);

  const matMain = new THREE.MeshStandardMaterial({
    color: 0xe7ecf3,
    metalness: 0.85,
    roughness: 0.18,
    envMapIntensity: 1.2,
  });
  const matAccent = new THREE.MeshStandardMaterial({
    color: 0x7cf8d6,
    metalness: 0.6,
    roughness: 0.25,
    emissive: 0x0f4f44,
    emissiveIntensity: 0.6,
  });
  const matAccent2 = new THREE.MeshStandardMaterial({
    color: 0xa78bfa,
    metalness: 0.55,
    roughness: 0.32,
    emissive: 0x2a1d54,
    emissiveIntensity: 0.5,
  });

  // Central icosahedron (faceted gemstone)
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, 0), matMain);
  group.add(core);

  // Wireframe overlay on the core
  const coreWire = new THREE.LineSegments(
    new THREE.EdgesGeometry(core.geometry),
    new THREE.LineBasicMaterial({ color: 0x7cf8d6, transparent: true, opacity: 0.35 })
  );
  core.add(coreWire);

  // Floating torus
  const torus = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.05, 16, 120), matAccent);
  torus.rotation.x = Math.PI / 2.5;
  torus.position.set(0.2, -0.4, -0.6);
  group.add(torus);

  // Smaller orbiting octahedron
  const oct = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), matAccent2);
  oct.position.set(2.2, 1.2, 0.6);
  group.add(oct);

  // A second smaller satellite cube (rounded)
  const satGeom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const sat = new THREE.Mesh(satGeom, matAccent);
  sat.position.set(-2.2, -1.1, 0.4);
  group.add(sat);

  // Tiny floating dots (stars near the core)
  const dotsGroup = new THREE.Group();
  const dotGeom = new THREE.SphereGeometry(0.04, 8, 8);
  const dotMat = new THREE.MeshBasicMaterial({ color: 0xe7ecf3, transparent: true, opacity: 0.6 });
  for (let i = 0; i < 18; i++) {
    const d = new THREE.Mesh(dotGeom, dotMat);
    const r = 2.6 + Math.random() * 1.4;
    const a = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 2.2;
    d.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
    dotsGroup.add(d);
  }
  group.add(dotsGroup);

  // ---- Sizing ----
  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    // Push the cluster off-center on desktop (right side), centered on mobile
    if (w >= 900) {
      group.position.x = 2.2;
      group.position.y = 0.2;
      camera.position.z = 8;
    } else {
      group.position.x = 0;
      group.position.y = -2.4;
      camera.position.z = 9;
    }
  }
  resize();
  window.addEventListener('resize', resize);

  // ---- Pointer interaction ----
  const pointer = { x: 0, y: 0 }; // normalized -1..1
  const target = { rx: 0, ry: 0 };
  const current = { rx: 0, ry: 0 };

  // drag state
  let isDragging = false;
  let dragVel = { x: 0, y: 0 };
  let lastDrag = { x: 0, y: 0 };
  let manualRot = { x: 0, y: 0 };

  function pointerToNormalized(e) {
    const r = hostEl.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 2 - 1;
    const y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    return { x, y, rect: r };
  }

  // Hit-test: convert pointer to world ray, check intersection with group
  const ray = new THREE.Raycaster();
  function isOverShape(nx, ny) {
    ray.setFromCamera({ x: nx, y: ny }, camera);
    return ray.intersectObjects([core, torus, oct, sat], false).length > 0;
  }

  hostEl.addEventListener('pointermove', (e) => {
    const p = pointerToNormalized(e);
    pointer.x = p.x;
    pointer.y = p.y;

    // Cursor "grab" affordance when over a shape
    if (!isDragging) {
      const cursorEl = document.getElementById('cursor');
      if (cursorEl) {
        cursorEl.classList.toggle('is-grab', isOverShape(p.x, p.y));
      }
    }

    if (isDragging) {
      dragVel.x = e.clientX - lastDrag.x;
      dragVel.y = e.clientY - lastDrag.y;
      manualRot.y += dragVel.x * 0.01;
      manualRot.x += dragVel.y * 0.01;
      lastDrag.x = e.clientX;
      lastDrag.y = e.clientY;
    }
  });

  hostEl.addEventListener('pointerleave', () => {
    const cursorEl = document.getElementById('cursor');
    if (cursorEl && !isDragging) cursorEl.classList.remove('is-grab');
  });

  hostEl.addEventListener('pointerdown', (e) => {
    const p = pointerToNormalized(e);
    if (!isOverShape(p.x, p.y)) return;
    isDragging = true;
    lastDrag.x = e.clientX;
    lastDrag.y = e.clientY;
    dragVel.x = 0;
    dragVel.y = 0;
    document.body.style.userSelect = 'none';
    const cursorEl = document.getElementById('cursor');
    if (cursorEl) cursorEl.classList.add('is-grab');
  });

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    document.body.style.userSelect = '';
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  // ---- Animate ----
  let frameId = 0;
  let scrollFactor = 0;
  function setScrollFactor(v) { scrollFactor = v; }

  const clock = new THREE.Clock();
  function tick() {
    const t = clock.getElapsedTime();
    const dt = Math.min(clock.getDelta() + 1 / 60, 1 / 30);

    // Inertial cursor parallax
    target.ry = pointer.x * 0.6;
    target.rx = -pointer.y * 0.4;
    current.rx += (target.rx - current.rx) * 0.06;
    current.ry += (target.ry - current.ry) * 0.06;

    // Drag inertia decays
    if (!isDragging) {
      manualRot.y += dragVel.x * 0.01;
      manualRot.x += dragVel.y * 0.01;
      dragVel.x *= 0.92;
      dragVel.y *= 0.92;
    }

    if (!prefersReducedMotion) {
      group.rotation.x = current.rx + manualRot.x + Math.sin(t * 0.4) * 0.05;
      group.rotation.y = current.ry + manualRot.y + t * 0.08;
      group.position.y += Math.sin(t * 1.1) * 0.0015; // gentle bob

      core.rotation.x += 0.003;
      core.rotation.y += 0.0045;

      torus.rotation.z += 0.005;

      oct.rotation.x += 0.01;
      oct.rotation.y += 0.012;
      oct.position.y = 1.2 + Math.sin(t * 1.4) * 0.25;
      oct.position.x = 2.2 + Math.cos(t * 1.0) * 0.2;

      sat.rotation.x -= 0.006;
      sat.rotation.y += 0.008;
      sat.position.x = -2.2 + Math.sin(t * 0.8) * 0.18;
      sat.position.y = -1.1 + Math.cos(t * 1.2) * 0.22;

      dotsGroup.rotation.y -= 0.0015;

      // Scroll: shrink + rotate cluster as user scrolls past hero
      const s = 1 - Math.min(scrollFactor, 1) * 0.35;
      group.scale.setScalar(s);
    } else {
      group.rotation.x = current.rx + manualRot.x;
      group.rotation.y = current.ry + manualRot.y;
    }

    renderer.render(scene, camera);
    frameId = requestAnimationFrame(tick);
  }
  tick();

  return {
    setScrollFactor,
    dispose() {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      renderer.dispose();
    },
  };
}
