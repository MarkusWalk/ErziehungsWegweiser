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
  <!-- Vogelperspektive auf das Kinderzimmer: Boden -->
  <g class="il-muted il-stroke">
    <line x1="30" y1="352" x2="610" y2="352"/>
  </g>

  <!-- Elternbett von oben, angeschnitten am linken Rand -->
  <g class="il-muted il-stroke">
    <line x1="86" y1="150" x2="86" y2="330"/>
    <rect x="18" y="150" width="68" height="180" rx="10"/>
    <rect x="30" y="164" width="44" height="36" rx="8"/>
  </g>

  <!-- Gitterbett von oben: Rahmen mit Sprossen an den Längsseiten -->
  <g class="il-stroke">
    <rect x="180" y="108" width="340" height="220" rx="20"/>
  </g>
  <g class="il-muted il-stroke" stroke-width="1.3">
    <line x1="204" y1="108" x2="204" y2="98"/>
    <line x1="230" y1="108" x2="230" y2="98"/>
    <line x1="256" y1="108" x2="256" y2="98"/>
    <line x1="444" y1="108" x2="444" y2="98"/>
    <line x1="470" y1="108" x2="470" y2="98"/>
    <line x1="496" y1="108" x2="496" y2="98"/>
    <line x1="204" y1="328" x2="204" y2="338"/>
    <line x1="230" y1="328" x2="230" y2="338"/>
    <line x1="256" y1="328" x2="256" y2="338"/>
    <line x1="444" y1="328" x2="444" y2="338"/>
    <line x1="470" y1="328" x2="470" y2="338"/>
    <line x1="496" y1="328" x2="496" y2="338"/>
  </g>

  <!-- Matratze: feste, flache Liegefläche, rundum sichtbar leer -->
  <rect class="il-stroke il-fill" x="196" y="124" width="308" height="188" rx="14"/>

  <!-- Baby von oben: Rückenlage im eigenen Schlafsack, Arme neben dem
       Kopf – einziger Coral-Akzent. Liegt flach und mittig, ringsum
       bleibt die Matratze sichtbar leer. -->
  <g class="il-accent il-stroke">
    <path d="M292,182 Q268,174 250,184" />
    <path d="M292,246 Q268,254 250,244" />
    <circle cx="292" cy="214" r="26"/>
    <path d="M318,180 Q400,168 442,196 Q460,214 442,232 Q400,260 318,248 Z"/>
  </g>

  <!-- Thermometer: 16-18 °C -->
  <g class="il-muted il-stroke">
    <rect x="556" y="128" width="15" height="68" rx="7.5"/>
    <circle cx="563.5" cy="204" r="13" class="il-fill"/>
    <line x1="563.5" y1="176" x2="563.5" y2="196" stroke-width="4"/>
  </g>

  ${badge(292, 156, 1)}
  ${leader(292, 168, 292, 186)}
  ${badge(400, 148, 2)}
  ${leader(392, 160, 372, 178)}
  ${badge(478, 288, 3)}
  ${leader(468, 278, 452, 262)}
  ${badge(563, 100, 4)}
  ${leader(563, 112, 563, 126)}
  ${badge(150, 250, 5)}
  ${leader(140, 240, 100, 220)}
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
   2. Milchzähne
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

const BUILDERS = {
  'sicherer-schlaf': sichererSchlaf,
  milchzaehne,
};

export const ILLUSTRATION_PRESETS = new Set(Object.keys(BUILDERS));

export function renderIllustration(preset, title, desc) {
  const build = BUILDERS[preset];
  if (!build) return null;
  const { viewBox, inner, legend } = build();
  return { svg: frame(viewBox, title, desc, inner), legend };
}
