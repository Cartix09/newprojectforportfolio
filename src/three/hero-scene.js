import * as THREE from 'three';

/**
 * Hero scene: a cluster of low-poly forms tied to the user's identity.
 *  - Faceted icosahedral "data core" with a wireframe net (data/AI feeling)
 *  - Connecting lines between satellites (network / nodes)
 *  - Orbit ring (global trade / mobility motif)
 *  - Floating cube + octahedron satellites (panels / product)
 *  - Tiny dot cloud around the core (data points)
 *
 * Scroll behaviour:
 *  - Cluster stays alive across the whole page, drifting slowly to the side
 *    and shrinking while the user reads.
 *  - Each section nudges target rotation + scale + accent intensity, so the
 *    composition feels alive instead of static.
 *
 * Theme: re-skins all material colors when "themechange" fires.
 *
 * Pointer:
 *  - Cursor parallax everywhere.
 *  - Drag-to-rotate (hit-tested against the meshes), with inertia.
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
  const ambient = new THREE.AmbientLight(0xffffff, 0.55);
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

  // ---- Theme palettes ----
  const palettes = {
    dark: {
      ambient: new THREE.Color(0x6677aa),
      key: new THREE.Color(0x7cf8d6),
      rim: new THREE.Color(0xa78bfa),
      fill: new THREE.Color(0x60a5fa),
      core: new THREE.Color(0xe7ecf3),
      coreEmissive: new THREE.Color(0x000000),
      accent: new THREE.Color(0x7cf8d6),
      accent2: new THREE.Color(0xa78bfa),
      wire: new THREE.Color(0x7cf8d6),
      wireOpacity: 0.35,
      lines: new THREE.Color(0x7cf8d6),
      linesOpacity: 0.28,
      ring: new THREE.Color(0x7cf8d6),
      dot: new THREE.Color(0xffffff),
      dotOpacity: 0.6,
    },
    light: {
      ambient: new THREE.Color(0xffffff),
      key: new THREE.Color(0x0d9488),
      rim: new THREE.Color(0x7c3aed),
      fill: new THREE.Color(0x2563eb),
      core: new THREE.Color(0xffffff),
      coreEmissive: new THREE.Color(0x111418),
      accent: new THREE.Color(0x0d9488),
      accent2: new THREE.Color(0x7c3aed),
      wire: new THREE.Color(0x0d9488),
      wireOpacity: 0.5,
      lines: new THREE.Color(0x14181f),
      linesOpacity: 0.35,
      ring: new THREE.Color(0x0d9488),
      dot: new THREE.Color(0x14181f),
      dotOpacity: 0.55,
    },
  };

  // Materials we'll mutate on theme change
  const matCore = new THREE.MeshStandardMaterial({
    metalness: 0.85, roughness: 0.18, envMapIntensity: 1.2,
  });
  const matAccent = new THREE.MeshStandardMaterial({
    metalness: 0.6, roughness: 0.25, emissiveIntensity: 0.6,
  });
  const matAccent2 = new THREE.MeshStandardMaterial({
    metalness: 0.55, roughness: 0.32, emissiveIntensity: 0.5,
  });
  const matWire = new THREE.LineBasicMaterial({ transparent: true });
  const matLines = new THREE.LineBasicMaterial({ transparent: true });
  const matRing = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.55 });
  const matDot = new THREE.MeshBasicMaterial({ transparent: true });

  function applyPalette(p) {
    matCore.color.copy(p.core);
    matCore.emissive.copy(p.coreEmissive);
    matAccent.color.copy(p.accent);
    matAccent.emissive.copy(p.accent).multiplyScalar(0.18);
    matAccent2.color.copy(p.accent2);
    matAccent2.emissive.copy(p.accent2).multiplyScalar(0.18);
    matWire.color.copy(p.wire);
    matWire.opacity = p.wireOpacity;
    matLines.color.copy(p.lines);
    matLines.opacity = p.linesOpacity;
    matRing.color.copy(p.ring);
    matDot.color.copy(p.dot);
    matDot.opacity = p.dotOpacity;
    keyLight.color.copy(p.key);
    rimLight.color.copy(p.rim);
    fillLight.color.copy(p.fill);
    ambient.color.copy(p.ambient);
    ambient.intensity = p === palettes.light ? 0.95 : 0.55;
  }

  // ---- Group ----
  const group = new THREE.Group();
  scene.add(group);

  // Core
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, 0), matCore);
  group.add(core);

  // Wire net — sub-divided icosahedron edges for "data" feel
  const wireGeo = new THREE.IcosahedronGeometry(1.42, 1);
  const coreWire = new THREE.LineSegments(new THREE.EdgesGeometry(wireGeo), matWire);
  core.add(coreWire);

  // Orbit ring (very thin torus)
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.018, 16, 160), matRing);
  ring.rotation.x = Math.PI / 2.6;
  group.add(ring);

  // Satellites
  const oct = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), matAccent2);
  oct.position.set(2.2, 1.2, 0.6);
  group.add(oct);

  const sat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), matAccent);
  sat.position.set(-2.2, -1.1, 0.4);
  group.add(sat);

  const tetra = new THREE.Mesh(new THREE.TetrahedronGeometry(0.35, 0), matAccent2);
  tetra.position.set(1.6, -1.6, -0.3);
  group.add(tetra);

  // Connecting lines (network feel) between core <-> satellites
  function makeLink(target) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    const line = new THREE.Line(g, matLines);
    line.userData.target = target;
    group.add(line);
    return line;
  }
  const links = [makeLink(oct), makeLink(sat), makeLink(tetra)];

  // Dot cloud
  const dotsGroup = new THREE.Group();
  const dotGeom = new THREE.SphereGeometry(0.04, 8, 8);
  for (let i = 0; i < 24; i++) {
    const d = new THREE.Mesh(dotGeom, matDot);
    const r = 2.6 + Math.random() * 1.6;
    const a = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 2.4;
    d.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
    d.userData.baseY = y;
    d.userData.speed = 0.4 + Math.random() * 0.6;
    dotsGroup.add(d);
  }
  group.add(dotsGroup);

  applyPalette(palettes[document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark']);
  window.addEventListener('themechange', (e) => {
    const t = e?.detail?.theme === 'light' ? 'light' : 'dark';
    applyPalette(palettes[t]);
  });

  // ---- Sizing / desktop vs mobile composition ----
  let baseGroupX = 2.2;
  let baseGroupY = 0.2;
  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (w >= 900) {
      baseGroupX = 2.2; baseGroupY = 0.2;
      camera.position.z = 8;
    } else {
      baseGroupX = 0; baseGroupY = -2.4;
      camera.position.z = 9;
    }
  }
  resize();
  window.addEventListener('resize', resize);

  // ---- Pointer interaction ----
  const pointer = { x: 0, y: 0 };
  const target = { rx: 0, ry: 0 };
  const current = { rx: 0, ry: 0 };

  let isDragging = false;
  let dragVel = { x: 0, y: 0 };
  let lastDrag = { x: 0, y: 0 };
  let manualRot = { x: 0, y: 0 };

  function pointerToNormalized(e) {
    const r = hostEl.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 2 - 1;
    const y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    return { x, y };
  }

  const ray = new THREE.Raycaster();
  function isOverShape(nx, ny) {
    ray.setFromCamera({ x: nx, y: ny }, camera);
    return ray.intersectObjects([core, oct, sat, tetra], false).length > 0;
  }

  hostEl.addEventListener('pointermove', (e) => {
    const p = pointerToNormalized(e);
    pointer.x = p.x;
    pointer.y = p.y;
    if (!isDragging) {
      const cursorEl = document.getElementById('cursor');
      if (cursorEl) cursorEl.classList.toggle('is-grab', isOverShape(p.x, p.y));
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
    const c = document.getElementById('cursor');
    if (c && !isDragging) c.classList.remove('is-grab');
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
    const c = document.getElementById('cursor');
    if (c) c.classList.add('is-grab');
  });
  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    document.body.style.userSelect = '';
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  // ---- Section-aware transforms ----
  // Each section defines an offset relative to the hero baseline.
  // The "current" values lerp toward the active section's target.
  const sectionPresets = {
    hero:        { offX:  0.0, offY:  0.0, scale: 1.00, ringTilt: Math.PI / 2.6, dotsSpread: 1.0, ringOpacity: 0.55, intensity: 1.0 },
    about:       { offX: -0.6, offY:  0.2, scale: 0.85, ringTilt: Math.PI / 2.2, dotsSpread: 1.05, ringOpacity: 0.45, intensity: 0.85 },
    projects:    { offX: -1.0, offY:  0.4, scale: 0.72, ringTilt: Math.PI / 2.0, dotsSpread: 1.4,  ringOpacity: 0.40, intensity: 0.9 },
    experience:  { offX:  0.4, offY: -0.4, scale: 0.78, ringTilt: Math.PI / 2.8, dotsSpread: 1.1,  ringOpacity: 0.55, intensity: 0.95 },
    skills:      { offX:  0.0, offY:  0.6, scale: 0.70, ringTilt: Math.PI / 2.5, dotsSpread: 1.6,  ringOpacity: 0.32, intensity: 0.9 },
    education:   { offX: -0.8, offY: -0.5, scale: 0.74, ringTilt: Math.PI / 2.4, dotsSpread: 1.0,  ringOpacity: 0.50, intensity: 0.85 },
    credentials: { offX:  0.6, offY:  0.5, scale: 0.72, ringTilt: Math.PI / 2.3, dotsSpread: 1.05, ringOpacity: 0.50, intensity: 0.85 },
    contact:     { offX:  0.0, offY:  0.0, scale: 0.92, ringTilt: Math.PI / 2.6, dotsSpread: 0.9,  ringOpacity: 0.40, intensity: 0.85 },
  };
  let active = sectionPresets.hero;
  const live = { ...active };

  function setActiveSection(id) {
    if (sectionPresets[id]) active = sectionPresets[id];
  }

  // Scroll factor (0 at top, ~1 once past hero)
  let scrollFactor = 0;
  function setScrollFactor(v) { scrollFactor = v; }

  // ---- Animate ----
  let frameId = 0;
  const clock = new THREE.Clock();
  const lerp = (a, b, t) => a + (b - a) * t;

  function tick() {
    const t = clock.getElapsedTime();

    // Lerp section presets
    const k = prefersReducedMotion ? 1 : 0.045;
    live.offX = lerp(live.offX, active.offX, k);
    live.offY = lerp(live.offY, active.offY, k);
    live.scale = lerp(live.scale, active.scale, k);
    live.ringTilt = lerp(live.ringTilt, active.ringTilt, k);
    live.dotsSpread = lerp(live.dotsSpread, active.dotsSpread, k);
    live.ringOpacity = lerp(live.ringOpacity, active.ringOpacity, k);
    live.intensity = lerp(live.intensity, active.intensity, k);

    // Cursor parallax
    target.ry = pointer.x * 0.6;
    target.rx = -pointer.y * 0.4;
    current.rx += (target.rx - current.rx) * 0.06;
    current.ry += (target.ry - current.ry) * 0.06;

    // Drag inertia
    if (!isDragging) {
      manualRot.y += dragVel.x * 0.01;
      manualRot.x += dragVel.y * 0.01;
      dragVel.x *= 0.92;
      dragVel.y *= 0.92;
    }

    // Position group
    group.position.x = baseGroupX + live.offX;
    group.position.y = baseGroupY + live.offY + (prefersReducedMotion ? 0 : Math.sin(t * 0.9) * 0.08);
    group.scale.setScalar(live.scale);

    if (!prefersReducedMotion) {
      group.rotation.x = current.rx + manualRot.x + Math.sin(t * 0.4) * 0.04;
      group.rotation.y = current.ry + manualRot.y + t * 0.06 + scrollFactor * 0.4;

      core.rotation.x += 0.0025;
      core.rotation.y += 0.004;

      ring.rotation.x = lerp(ring.rotation.x, live.ringTilt, 0.04);
      ring.rotation.z += 0.004;
      matRing.opacity = live.ringOpacity;

      oct.rotation.x += 0.01;
      oct.rotation.y += 0.012;
      oct.position.y = 1.2 + Math.sin(t * 1.4) * 0.25;
      oct.position.x = 2.2 + Math.cos(t * 1.0) * 0.2;

      sat.rotation.x -= 0.006;
      sat.rotation.y += 0.008;
      sat.position.x = -2.2 + Math.sin(t * 0.8) * 0.18;
      sat.position.y = -1.1 + Math.cos(t * 1.2) * 0.22;

      tetra.rotation.x += 0.012;
      tetra.rotation.y -= 0.01;
      tetra.position.x = 1.6 + Math.cos(t * 1.1) * 0.18;
      tetra.position.y = -1.6 + Math.sin(t * 1.3) * 0.22;

      dotsGroup.rotation.y -= 0.0015;
      dotsGroup.scale.setScalar(live.dotsSpread);
      dotsGroup.children.forEach((d, i) => {
        d.position.y = d.userData.baseY + Math.sin(t * d.userData.speed + i) * 0.12;
      });

      // Update connecting lines core <-> satellites
      links.forEach((line) => {
        const tgt = line.userData.target;
        const arr = line.geometry.attributes.position.array;
        arr[0] = 0; arr[1] = 0; arr[2] = 0;
        arr[3] = tgt.position.x; arr[4] = tgt.position.y; arr[5] = tgt.position.z;
        line.geometry.attributes.position.needsUpdate = true;
      });
      matLines.opacity = lerp(matLines.opacity, 0.18 + live.ringOpacity * 0.4, 0.05);
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
    setActiveSection,
    dispose() {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      renderer.dispose();
    },
  };
}
