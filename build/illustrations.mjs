/* Erklärende SVG-Illustrationen für den Blocktyp "illustration" (Form B).
   Handgezeichnetes Line-Art im Stil des Icon-Sets: 1,75px Strich, runde
   Kappen, ausschließlich currentColor + Design-Tokens (funktioniert also
   automatisch im Dark Mode). Jede Zeichnung liefert ihr eigenes SVG plus
   eine Legende (nummerierte Punkte oder Farb-Swatches), die blocks.mjs
   als barrierefreie HTML-Liste unter dem Bild rendert – Beschriftungen
   im SVG selbst wären auf 320px kaum lesbar.

   Ein Preset pro Funktion. Neue Presets hier ergänzen und in
   ILLUSTRATION_PRESETS eintragen; lint.mjs und AUTHORING.md Abschnitt 4
   getrennt nachziehen. */

import { esc } from './inline.mjs';

let uid = 0;

/* ---- Bausteine, die alle Presets teilen ---- */

function frame(viewBox, title, desc, inner) {
  uid += 1;
  const t = `il-t-${uid}`;
  const d = `il-d-${uid}`;
  return `<svg class="il" viewBox="0 0 ${viewBox[0]} ${viewBox[1]}" role="img" aria-labelledby="${t} ${d}" preserveAspectRatio="xMidYMid meet">
  <title id="${t}">${esc(title)}</title>
  <desc id="${d}">${esc(desc)}</desc>
  ${inner}
</svg>`;
}

/* Nummerierter Punkt für einen Legenden-Callout. */
function badge(x, y, n) {
  return `<g class="il-badge"><circle cx="${x}" cy="${y}" r="12"/><text x="${x}" y="${y + 4.5}" text-anchor="middle">${n}</text></g>`;
}

function leader(x1, y1, x2, y2) {
  return `<path class="il-leader" d="M${x1},${y1} L${x2},${y2}"/>`;
}

/* ================================================================
   1. Sicherer Schlaf
   Quellen: AAP „Safe Sleep" Empfehlungen 2022; AWMF-S1-Leitlinie
   Plötzlicher Säuglingstod. Rückenlage, eigener Schlafsack, feste
   flache Matratze ohne Kissen/Nestchen/Kuscheltiere, 16–18 °C,
   eigenes Bett im Elternzimmer.
   ================================================================ */
function sichererSchlaf() {
  const inner = `
  <g class="il-muted il-stroke">
    <line x1="30" y1="352" x2="610" y2="352"/>
  </g>

  <!-- Elternbett, angeschnitten am linken Rand -->
  <g class="il-muted il-stroke">
    <line x1="58" y1="150" x2="58" y2="316"/>
    <rect x="20" y="296" width="150" height="46" rx="10"/>
    <rect x="40" y="272" width="58" height="26" rx="10"/>
  </g>

  <!-- Gitterbett -->
  <g class="il-stroke">
    <rect x="210" y="112" width="300" height="204" rx="22"/>
    <line x1="220" y1="330" x2="212" y2="356"/>
    <line x1="500" y1="330" x2="508" y2="356"/>
  </g>
  <g class="il-muted il-stroke" stroke-width="1">
    <line x1="228" y1="134" x2="228" y2="292"/>
    <line x1="244" y1="134" x2="244" y2="292"/>
    <line x1="260" y1="134" x2="260" y2="292"/>
    <line x1="460" y1="134" x2="460" y2="292"/>
    <line x1="476" y1="134" x2="476" y2="292"/>
    <line x1="492" y1="134" x2="492" y2="292"/>
  </g>

  <!-- Matratze: fest und flach -->
  <rect class="il-stroke il-fill" x="226" y="288" width="268" height="22" rx="8"/>

  <!-- Baby: Rückenlage im eigenen Schlafsack, einziger Coral-Akzent -->
  <g class="il-accent il-stroke">
    <circle cx="330" cy="195" r="27"/>
    <circle cx="321" cy="191" r="2.1" fill="currentColor" stroke="none"/>
    <circle cx="339" cy="191" r="2.1" fill="currentColor" stroke="none"/>
    <path d="M301,219 C294,252 296,276 312,291 L352,291 C368,276 370,252 363,219 Z"/>
    <path d="M300,228 Q280,236 274,254"/>
    <path d="M364,228 Q384,236 390,254"/>
  </g>

  <!-- Thermometer: 16-18 °C -->
  <g class="il-muted il-stroke">
    <rect x="556" y="128" width="15" height="68" rx="7.5"/>
    <circle cx="563.5" cy="204" r="13" class="il-fill"/>
    <line x1="563.5" y1="176" x2="563.5" y2="196" stroke-width="4"/>
  </g>

  ${badge(330, 152, 1)}
  ${leader(330, 164, 330, 172)}
  ${badge(420, 232, 2)}
  ${leader(408, 236, 366, 245)}
  ${badge(524, 268, 3)}
  ${leader(510, 278, 496, 297)}
  ${badge(563, 100, 4)}
  ${leader(563, 112, 563, 126)}
  ${badge(140, 218, 5)}
  ${leader(140, 230, 140, 270)}
  `;
  return {
    viewBox: [640, 380],
    inner,
    legend: [
      { n: 1, label: 'Rückenlage – für jedes Nickerchen und jede Nacht.' },
      { n: 2, label: 'Eigener Schlafsack in passender Größe statt Decke.' },
      { n: 3, label: 'Feste, flache Matratze im eigenen Bett – kein Kissen, keine Nestchen, keine Kuscheltiere.' },
      { n: 4, label: 'Zimmertemperatur um 16–18 °C, keine Mütze im Bett.' },
      { n: 5, label: 'Eigenes Bett im Zimmer der Eltern, in Reichweite – für die ersten sechs bis zwölf Monate empfohlen.' },
    ],
  };
}

/* ================================================================
   2. Reboarder
   Quelle: physikalisches Grundprinzip rückwärtsgerichteter
   Kindersitze (u. a. ADAC-Crashtests, DVR-Elternratgeber): Kopf und
   Nacken sind bei Kleinkindern relativ schwer und der Nacken noch
   nicht belastbar; rückwärts verteilt sich die Aufprallkraft eines
   Frontalzusammenstoßes über Schale und Kopfstütze statt punktuell
   auf den Nacken.
   ================================================================ */
function reboarder() {
  const inner = `
  <!-- Fahrtrichtung -->
  <g class="il-muted il-stroke">
    <line x1="560" y1="40" x2="466" y2="40"/>
    <path d="M482,28 L466,40 L482,52"/>
  </g>

  <!-- Fahrzeug, vereinfachtes Seitenprofil -->
  <g class="il-stroke">
    <path d="M70,290 L70,240 Q70,220 92,214 L170,214 Q196,132 262,132 L400,132 Q452,132 466,190 L560,190 Q582,190 582,214 L582,266 Q582,290 558,290 Z"/>
    <line x1="320" y1="132" x2="320" y2="214"/>
  </g>
  <g class="il-muted il-stroke">
    <circle cx="160" cy="292" r="26" class="il-fill"/>
    <circle cx="480" cy="292" r="26" class="il-fill"/>
  </g>

  <!-- Rückbank -->
  <g class="il-muted il-stroke">
    <rect x="392" y="222" width="150" height="24" rx="10" class="il-fill"/>
    <rect x="500" y="140" width="30" height="110" rx="12" class="il-fill"/>
  </g>

  <!-- Kindersitz-Schale, rückwärtsgerichtet: geschlossene Seite zeigt nach vorn -->
  <g class="il-stroke">
    <path d="M452,150 Q506,150 516,196 L516,238 Q506,258 462,258 L452,258 Z" class="il-fill"/>
  </g>

  <!-- Kind, einziger Coral-Akzent, blickt nach hinten -->
  <g class="il-accent il-stroke">
    <circle cx="490" cy="178" r="17"/>
    <path d="M506,176 l8,3 l-8,4"/>
    <rect x="472" y="198" width="34" height="46" rx="14"/>
  </g>

  <!-- Aufprallkraft von vorn, verteilt sich über die Schale -->
  <g class="il-muted il-stroke">
    <path d="M18,214 L62,214"/>
    <path d="M48,204 L62,214 L48,224"/>
    <path d="M470,158 Q442,148 418,144"/>
    <path d="M426,138 L418,144 L424,152" stroke-width="1.3"/>
    <path d="M470,196 Q434,196 408,196"/>
    <path d="M416,189 L408,196 L416,203" stroke-width="1.3"/>
    <path d="M470,234 Q442,246 418,252"/>
    <path d="M424,244 L418,252 L426,257" stroke-width="1.3"/>
  </g>

  ${badge(490, 130, 1)}
  ${leader(490, 142, 490, 158)}
  ${badge(430, 268, 2)}
  ${leader(430, 256, 440, 248)}
  ${badge(150, 168, 3)}
  ${leader(150, 180, 130, 196)}
  `;
  return {
    viewBox: [640, 320],
    inner,
    legend: [
      { n: 1, label: 'Sitzt rückwärtsgerichtet – entgegen der Fahrtrichtung montiert.' },
      { n: 2, label: 'Auf der Rückbank befestigt, mit Isofix oder Gurt gesichert.' },
      { n: 3, label: 'Bei einem Frontalaufprall verteilt sich die Kraft über Schale und Kopfstütze statt auf den Nacken – deshalb möglichst lange rückwärts fahren.' },
    ],
  };
}

/* ================================================================
   3. Milchzähne
   20 Milchzähne, Durchbruchsalter nach den gängigen Eruptionstabellen
   (American Dental Association „Eruption Charts"; deckungsgleich mit
   den in zahnärztlichen Elterninformationen üblichen Bereichen,
   vgl. DGZMK/Bundeszahnärztekammer-Merkblätter).
   ================================================================ */
const TOOTH_TYPES = [
  { key: 'second-molar', label: 'Zweite Milchmolaren', series: 5, lower: '23–31 Monate', upper: '25–33 Monate' },
  { key: 'first-molar', label: 'Erste Milchmolaren', series: 4, lower: '14–18 Monate', upper: '13–19 Monate' },
  { key: 'canine', label: 'Eckzähne', series: 3, lower: '16–23 Monate', upper: '16–22 Monate' },
  { key: 'lateral-incisor', label: 'Seitliche Schneidezähne', series: 2, lower: '10–16 Monate', upper: '9–13 Monate' },
  { key: 'central-incisor', label: 'Mittlere Schneidezähne', series: 1, lower: '6–10 Monate', upper: '8–12 Monate' },
];
// Reihenfolge von der Mitte nach außen: mittig, seitlich, Eck-, 1., 2. Molar.
const TOOTH_ORDER = [0, 1, 2, 3, 4, 4, 3, 2, 1, 0].map((i) => TOOTH_TYPES[i]);

function archPoints(cx, cy, rx, depth, flip) {
  return TOOTH_ORDER.map((tooth, i) => {
    const t = -1 + (i * 2) / (TOOTH_ORDER.length - 1);
    const x = cx + t * rx;
    const y = cy + (flip ? 1 : -1) * depth * (1 - t * t);
    return { x, y, tooth };
  });
}

function milchzaehne() {
  const upper = archPoints(320, 148, 226, 78, false);
  const lower = archPoints(320, 336, 226, 78, true);

  const teeth = [...upper, ...lower]
    .map(({ x, y, tooth }) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="15" class="il-tooth" style="--i:${tooth.series - 1}"/>`)
    .join('\n  ');

  const inner = `
  <line x1="320" y1="60" x2="320" y2="424" class="il-muted il-stroke" stroke-width="1" stroke-dasharray="3 5"/>
  <path d="M96,232 h448" class="il-muted il-stroke" stroke-width="1" stroke-dasharray="3 5"/>
  ${teeth}
  `;
  return {
    viewBox: [640, 460],
    inner,
    legend: TOOTH_TYPES.map((t) => ({
      color: `var(--c-series-${t.series})`,
      label: `${t.label} · unten ${t.lower}, oben ${t.upper}`,
    })),
  };
}

/* ================================================================
   4. Stabile Seitenlage (Kind)
   Ablauf vereinfacht nach den generischen Erste-Hilfe-Schritten
   (European Resuscitation Council / DRK-Erste-Hilfe-Fibel): Arm des
   Kindes anwinkeln, Hand der anderen Seite an die Wange, fernes Bein
   aufstellen und darüber zur Seite drehen, Kopf überstrecken und mit
   dem angewinkelten Bein sichern.
   ================================================================ */
/* Kleine, gefüllte Gelenkpunkte machen aus dem Strichmännchen ein
   lesbares Schema statt einer Kritzelei – dieselbe Idee wie Gelenkpunkte
   in Bewegungsdiagrammen. */
function joint(x, y) {
  return `<circle cx="${x}" cy="${y}" r="2.6" fill="currentColor" stroke="none"/>`;
}

function figure(cx, cy, pose) {
  /* Gemeinsamer Maßstab: Kopf r=14, Rumpf rund 65 lang. Lokales Raster,
     danach per translate an die Spaltenmitte gesetzt.
     pose 1: Rückenlage, naher Arm angewinkelt, ferne Hand an der Wange.
     pose 2: Drehung über das aufgestellte, ferne Bein.
     pose 3: stabile Seitenlage, Kopf überstreckt, oberes Bein stützt. */
  if (pose === 1) {
    return `
    <g transform="translate(${cx - 92},${cy - 4})">
      <circle cx="22" cy="26" r="14"/>
      <path d="M40,30 L106,36"/>
      <path d="M106,36 L168,36"/>
      <path d="M40,30 L40,2 L70,2"/>
      <path d="M64,32 Q46,22 32,22"/>
      ${joint(40, 30)} ${joint(40, 2)} ${joint(106, 36)} ${joint(168, 36)}
    </g>`;
  }
  if (pose === 2) {
    return `
    <g transform="translate(${cx - 90},${cy - 2})">
      <path d="M56,10 Q90,-2 120,14" class="il-muted" stroke-width="1.3"/>
      <path d="M116,7 L120,14 L112,17" class="il-muted" stroke-width="1.3"/>
      <circle cx="22" cy="30" r="14"/>
      <path d="M40,34 L100,42"/>
      <path d="M40,34 L58,66"/>
      <path d="M100,42 L128,20 L154,42"/>
      <path d="M100,48 L150,64"/>
      ${joint(40, 34)} ${joint(100, 42)} ${joint(128, 20)} ${joint(100, 48)}
    </g>`;
  }
  return `
  <g transform="translate(${cx - 90},${cy + 6})">
    <circle cx="26" cy="20" r="14"/>
    <path d="M36,12 L50,8"/>
    <path d="M42,32 L106,44"/>
    <path d="M42,28 L60,10 L38,4"/>
    <path d="M40,38 L32,52"/>
    <path d="M104,46 L124,52" class="il-muted" stroke-width="1.3"/>
    <path d="M100,40 L136,58 L114,76"/>
    ${joint(42, 32)} ${joint(106, 44)} ${joint(136, 58)}
  </g>`;
}

function stabileSeitenlage() {
  const cols = [107, 320, 533];
  const panels = cols
    .map((cx, i) => `
  <g>
    <line x1="${cx - 96}" y1="196" x2="${cx + 96}" y2="196" class="il-muted il-stroke" stroke-width="1"/>
    <g class="il-accent il-stroke">${figure(cx, 130, i + 1)}</g>
    ${badge(cx - 88, 44, i + 1)}
  </g>`)
    .join('');
  const dividers = `
  <line x1="213" y1="20" x2="213" y2="230" class="il-muted il-stroke" stroke-width="1" stroke-dasharray="2 6"/>
  <line x1="426" y1="20" x2="426" y2="230" class="il-muted il-stroke" stroke-width="1" stroke-dasharray="2 6"/>`;
  return {
    viewBox: [640, 250],
    inner: dividers + panels,
    legend: [
      { n: 1, label: 'Nahen Arm im rechten Winkel anwinkeln, die Hand der anderen Seite an die Wange legen.' },
      { n: 2, label: 'Das ferne Bein am Knie aufstellen und das Kind daran zu dir auf die Seite drehen.' },
      { n: 3, label: 'Kopf überstrecken, damit die Atemwege frei bleiben – das obere, angewinkelte Bein stützt die Seitenlage.' },
    ],
  };
}

/* ================================================================
   5. Hand und Magen
   Als grobe Merkregel verbreitet (z. B. in Ernährungsratgebern für
   Kita und Elternhaus), keine anatomische Messung: der kindliche
   Magen fasst etwa so viel wie die eigene Faust – ein Anhaltspunkt
   für Portionsgrößen, keine feste Regel.
   ================================================================ */
function handUndMagen() {
  const inner = `
  <g class="il-accent il-stroke">
    <path d="M170,240 Q120,236 116,190 Q112,150 140,128 Q136,104 158,94 Q160,74 182,72 Q202,56 222,74 Q244,70 252,92 Q274,100 270,126 Q290,150 276,182 Q286,220 246,236 Q210,252 170,240 Z"/>
    <path d="M150,128 L166,140 M176,102 L184,118 M206,96 L206,116 M238,104 L228,120"/>
  </g>
  <g class="il-muted il-stroke" stroke-dasharray="4 5">
    <path d="M460,236 C404,236 372,206 372,168 C372,132 398,108 430,102 C438,80 462,66 490,72 C508,54 538,58 550,80 C578,84 592,110 582,136 C598,158 592,190 566,206 C556,230 526,246 494,240 C482,248 470,244 460,236 Z"/>
  </g>
  <line x1="330" y1="156" x2="356" y2="156" class="il-muted il-stroke" stroke-width="1"/>
  <path d="M330,150 L322,156 L330,162" class="il-muted il-stroke" stroke-width="1"/>
  <path d="M356,150 L364,156 L356,162" class="il-muted il-stroke" stroke-width="1"/>
  `;
  return {
    viewBox: [640, 300],
    inner,
    legend: [
      { color: 'var(--c-accent-fill)', label: 'Die eigene Faust deines Kindes.' },
      { color: 'transparent', swatchClass: 'il-legend-outline', label: 'Etwa so viel fasst sein Magen – eine grobe Faustregel für Portionsgrößen, keine anatomische Messung.' },
    ],
  };
}

const BUILDERS = {
  'sicherer-schlaf': sichererSchlaf,
  reboarder,
  milchzaehne,
  'stabile-seitenlage-kind': stabileSeitenlage,
  'hand-und-magen': handUndMagen,
};

export const ILLUSTRATION_PRESETS = new Set(Object.keys(BUILDERS));

export function renderIllustration(preset, title, desc) {
  const build = BUILDERS[preset];
  if (!build) return null;
  const { viewBox, inner, legend } = build();
  return { svg: frame(viewBox, title, desc, inner), legend };
}
