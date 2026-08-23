/* Dynamische three.js-Szenen.
   Werden erst geladen, wenn sie in Sichtweite kommen (siehe app.js),
   und laufen nur, solange sie sichtbar sind. Jede Szene ist rein
   dekorativ oder illustrativ – kein Inhalt hängt daran.

   Farben stammen aus den Design-Tokens, damit Szenen dem Theme folgen. */

import * as THREE from './vendor/three.module.min.js';

const registry = {};
const running = [];

export function mountAll(nodes) {
  nodes.forEach((node) => mount(node));
  if (running.length) startLoop();
}

function mount(node) {
  const preset = node.getAttribute('data-scene');
  const build = registry[preset];
  if (!build) return;

  const stage = node.classList.contains('hero__scene') ? node : node.querySelector('.c-scene__stage') || node;
  let options = {};
  try {
    options = JSON.parse(node.getAttribute('data-scene-options') || '{}');
  } catch (e) {
    options = {};
  }

  const width = stage.clientWidth || 800;
  const height = stage.clientHeight || 450;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(width, height, false);
  stage.appendChild(renderer.domElement);
  stage.classList.add('is-mounted');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 12);

  const instance = { renderer, scene, camera, stage, visible: true, pointer: { x: 0, y: 0 } };
  instance.update = build(scene, camera, options, instance) || (() => {});

  stage.addEventListener('pointermove', (event) => {
    const rect = stage.getBoundingClientRect();
    instance.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    instance.pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  });

  const resize = () => {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  addEventListener('resize', resize);

  /* Nur rendern, wenn die Szene im Blick ist – schont Akku und CPU. */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      instance.visible = entries[0].isIntersecting;
    }).observe(stage);
  }

  running.push(instance);
}

let clock;
function startLoop() {
  clock = new THREE.Clock();
  const tick = () => {
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();
    for (const instance of running) {
      if (!instance.visible) continue;
      instance.update(time, delta);
      instance.renderer.render(instance.scene, instance.camera);
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* Farbwert aus den Design-Tokens lesen. */
function token(name, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new THREE.Color(value || fallback);
}

/* ================================================================
   Szene: Startseite – ruhig treibende Formen
   ================================================================ */
registry.hero = (scene, camera, options, instance) => {
  /* Kugeln in der Akzentreihenfolge des Designsystems. Die Beleuchtung
     bildet die Kugel-Definition nach: ein weicher Hauptglanz oben links,
     der Rest fällt zum Rand hin ab. */
  const palette = [
    token('--coral-500', '#FF7A59'),
    token('--violet-500', '#8B7FFF'),
    token('--sky-500', '#4FACFE'),
    token('--moss-500', '#46A97A'),
    token('--amber-500', '#E8A33D'),
  ];

  scene.add(new THREE.AmbientLight(0xffffff, 1.35));
  const key = new THREE.DirectionalLight(0xffffff, 1.15);
  key.position.set(-3, 4, 6);
  scene.add(key);

  const group = new THREE.Group();
  scene.add(group);

  const blobs = [];
  const count = 9;

  /* Die Kugeln bleiben in der rechten Bildhälfte. Die linke gehört dem
     Text – Dekoration darf ihn nicht hinterlegen. */
  for (let i = 0; i < count; i++) {
    const radius = 0.6 + Math.random() * 1.2;
    const material = new THREE.MeshLambertMaterial({
      color: palette[i % palette.length],
      transparent: true,
      opacity: 0.14 + Math.random() * 0.08,
    });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 32), material);
    mesh.position.set(
      2.5 + Math.random() * 9,
      (Math.random() - 0.5) * 9,
      (Math.random() - 0.5) * 8 - 3,
    );
    group.add(mesh);
    blobs.push({
      mesh,
      speed: 0.06 + Math.random() * 0.12,
      phase: Math.random() * Math.PI * 2,
    });
  }

  return (time) => {
    for (const blob of blobs) {
      blob.mesh.position.y += Math.sin(time * blob.speed + blob.phase) * 0.0022;
      blob.mesh.rotation.y = time * blob.speed * 0.18;
    }
    group.position.x += (instance.pointer.x * 0.5 - group.position.x) * 0.02;
    group.position.y += (instance.pointer.y * 0.3 - group.position.y) * 0.02;
  };
};

/* ================================================================
   Szene: Synaptisches Netzwerk – Verknüpfung und Ausdünnung
   Illustriert, wie im frühen Gehirn erst massiv verknüpft und
   später gezielt ausgedünnt wird.
   ================================================================ */
registry.synapsen = (scene, camera, options, instance) => {
  const nodeColor = token('--coral-500', '#FF7A59');
  const lineColor = token('--violet-500', '#8B7FFF');
  const count = options.nodes || 90;

  camera.position.set(0, 0, 9);

  const points = [];
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const r = 3 + Math.random() * 0.6;
    points.push(new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta) * 0.7,
      r * Math.cos(phi),
    ));
  }

  const group = new THREE.Group();
  scene.add(group);

  const dotGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const dots = new THREE.Points(
    dotGeometry,
    new THREE.PointsMaterial({ color: nodeColor, size: 0.11, transparent: true, opacity: 0.9 }),
  );
  group.add(dots);

  /* Kanten zwischen nahen Knoten – die Menge pulsiert über die Zeit. */
  const pairs = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const d = points[i].distanceTo(points[j]);
      if (d < 1.9) pairs.push([i, j, d]);
    }
  }
  pairs.sort((a, b) => a[2] - b[2]);

  const positions = new Float32Array(pairs.length * 6);
  pairs.forEach(([i, j], k) => {
    positions.set([points[i].x, points[i].y, points[i].z, points[j].x, points[j].y, points[j].z], k * 6);
  });

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const lines = new THREE.LineSegments(
    lineGeometry,
    new THREE.LineBasicMaterial({ color: lineColor, transparent: true, opacity: 0.28 }),
  );
  group.add(lines);

  return (time) => {
    group.rotation.y = time * 0.12;
    group.rotation.x = Math.sin(time * 0.18) * 0.16;

    /* Zyklus: aufbauen (viele Verbindungen) → ausdünnen (wenige). */
    const cycle = (Math.sin(time * 0.22) + 1) / 2;
    const keep = Math.floor(pairs.length * (0.25 + cycle * 0.75));
    lineGeometry.setDrawRange(0, keep * 2);
    lines.material.opacity = 0.16 + (1 - cycle) * 0.22;

    group.rotation.z += (instance.pointer.x * 0.12 - group.rotation.z) * 0.03;
  };
};

/* ================================================================
   Szene: Schlafzyklen – Wellenband durch die Nacht
   ================================================================ */
registry.schlafzyklus = (scene, camera, options) => {
  camera.position.set(0, 1.6, 9);
  camera.lookAt(0, 0, 0);

  const deep = token('--violet-600', '#6D5B97');
  const light = token('--amber-500', '#E8A33D');

  const segments = 260;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(segments * 3);
  const colors = new Float32Array(segments * 3);
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const line = new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.95 }),
  );
  scene.add(line);

  /* Zyklendauer: beim Säugling ca. 50 Minuten, beim Erwachsenen ca. 90. */
  const cycles = options.cycles || 5;
  const tmp = new THREE.Color();

  return (time) => {
    for (let i = 0; i < segments; i++) {
      const t = i / (segments - 1);
      const x = (t - 0.5) * 14;
      const depth = Math.sin(t * Math.PI * 2 * cycles - time * 0.5);
      const decay = 1 - t * 0.35;
      const y = depth * 1.5 * decay;
      positions.set([x, y, Math.cos(t * Math.PI * 2 * cycles) * 0.4], i * 3);
      tmp.copy(deep).lerp(light, (depth + 1) / 2);
      colors.set([tmp.r, tmp.g, tmp.b], i * 3);
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
  };
};

/* ================================================================
   Szene: Meilensteine – Pfad durch die ersten Jahre
   ================================================================ */
registry.meilensteine = (scene, camera, options, instance) => {
  camera.position.set(0, 2.2, 10);
  camera.lookAt(0, 0, 0);

  const marks = options.marks || 6;
  const accent = token('--coral-500', '#FF7A59');
  const soft = token('--c-line-strong', '#DCD0B4');

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-7, -1.4, 0),
    new THREE.Vector3(-3.5, 0.6, 1.2),
    new THREE.Vector3(0, -0.5, -1),
    new THREE.Vector3(3.5, 1.2, 1),
    new THREE.Vector3(7, 0.2, 0),
  ]);

  const tube = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 120, 0.05, 8, false),
    new THREE.MeshBasicMaterial({ color: soft, transparent: true, opacity: 0.6 }),
  );
  scene.add(tube);

  const spheres = [];
  for (let i = 0; i < marks; i++) {
    const t = i / (marks - 1);
    const position = curve.getPointAt(t);
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 24, 24),
      new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.85 }),
    );
    sphere.position.copy(position);
    scene.add(sphere);
    spheres.push({ sphere, t });
  }

  const traveller = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 20, 20),
    new THREE.MeshBasicMaterial({ color: accent }),
  );
  scene.add(traveller);

  return (time) => {
    const t = (time * 0.09) % 1;
    traveller.position.copy(curve.getPointAt(t));

    spheres.forEach((mark) => {
      const near = 1 - Math.min(Math.abs(mark.t - t) * 6, 1);
      const scale = 1 + near * 0.9;
      mark.sphere.scale.setScalar(scale);
      mark.sphere.material.opacity = 0.4 + near * 0.55;
    });

    scene.rotation.y = instance.pointer.x * 0.18;
    scene.rotation.x = -instance.pointer.y * 0.08;
  };
};

/* ================================================================
   Szene: Co-Regulation – zwei Systeme finden in den Gleichtakt
   ================================================================ */
registry.koregulation = (scene, camera) => {
  camera.position.set(0, 0, 9);

  const warm = token('--coral-500', '#FF7A59');
  const cool = token('--violet-500', '#8B7FFF');

  const makeRing = (color, radius) => {
    const geometry = new THREE.TorusGeometry(radius, 0.035, 12, 120);
    const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.7 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    return mesh;
  };

  const adult = makeRing(cool, 2.4);
  const child = makeRing(warm, 1.3);
  adult.position.x = -1.5;
  child.position.x = 1.5;

  return (time) => {
    /* Zuerst schwingen beide unterschiedlich, dann gleichen sie sich an. */
    const sync = (Math.sin(time * 0.16) + 1) / 2;
    const adultPulse = 1 + Math.sin(time * 1.1) * 0.06;
    const childPulse = 1 + Math.sin(time * (1.1 + (1 - sync) * 1.6)) * (0.06 + (1 - sync) * 0.1);

    adult.scale.setScalar(adultPulse);
    child.scale.setScalar(childPulse);

    adult.position.x = -1.5 + sync * 0.75;
    child.position.x = 1.5 - sync * 0.75;
    adult.rotation.z = time * 0.1;
    child.rotation.z = -time * 0.14;
  };
};
