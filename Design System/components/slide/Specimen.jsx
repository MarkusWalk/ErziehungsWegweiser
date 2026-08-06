import React from 'react';

/* ============================================================
   Specimen library
   Transparent-background PNG cutouts of period naturalist artwork,
   living in assets/botanical/. Register filenames here — every
   component below draws from this map. Any family left empty
   renders as a labelled placeholder disc, so layouts can be built
   before the art lands.
   Naming: <family>-<nn>.png  e.g. bloom-01.png, wing-04.png
   ============================================================ */
export const SPECIMENS = {
  // single flowers, face-on or three-quarter
  bloom: ['bloom-01.png', 'bloom-02.png', 'bloom-02-b.png', 'bloom-02-c.png', 'bloom-02-d.png', 'bloom-02-e.png', 'bloom-03.png', 'bloom-04.png', 'bloom-05.png', 'bloom-06.png', 'bloom-07.png', 'bloom-08.png', 'bloom-09.png', 'bloom-10.png', 'bloom-11.png'],
  // single leaves, foliage, large blades
  leaf: ['leaf-01.png', 'leaf-01-e.png', 'leaf-02.png', 'leaf-03.png', 'leaf-04.png', 'leaf-05.png', 'leaf-06.png', 'leaf-07.png', 'leaf-08.png', 'leaf-09.png'],
  // buds, seed heads, small branches
  sprig: ['sprig-01.png', 'sprig-02.png', 'sprig-02-e.png', 'sprig-03.png', 'sprig-04.png', 'sprig-05.png', 'sprig-06.png', 'sprig-07.png', 'sprig-08.png'],
  // butterflies, moths and beetles
  wing: ['wing-01.png', 'wing-01-b.png', 'wing-01-e.png', 'wing-02.png', 'wing-03.png', 'wing-04.png', 'wing-05.png', 'wing-06.png', 'wing-07.png', 'wing-08.png', 'wing-09.png', 'wing-10.png', 'wing-11.png', 'wing-12.png'],
};

const DEFAULT_BASE = 'assets/botanical/';

function assetBase(base) {
  if (base) return base;
  if (typeof window !== 'undefined' && window.ITM_BOTANICAL_BASE) return window.ITM_BOTANICAL_BASE;
  return DEFAULT_BASE;
}

/* Deterministic 0..1 from an integer — keeps a composition identical
   between renders and between exports. */
function rnd(i, salt) {
  const x = Math.sin((i + 1) * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function pool(families) {
  const out = [];
  const lists = families.map(f => (SPECIMENS[f] || []).map(n => f + '/' + n));
  // Interleave families so a glyph never runs three leaves in a row.
  for (let i = 0; i < Math.max(...lists.map(l => l.length), 0); i++) lists.forEach(l => { if (l[i]) out.push(l[i]); });
  return out;
}

/* ---- Glyph skeletons -------------------------------------------------
   Each glyph is one or more polylines on a 100x100 grid. Specimens are
   distributed along the total stroke length, so the number of pieces is
   a density setting rather than a fixed layout. ---------------------- */
function ellipse(rx, ry, n) {
  const pts = [];
  for (let i = 0; i <= n; i++) { const a = (i / n) * Math.PI * 2 - Math.PI / 2; pts.push([50 + Math.cos(a) * rx, 50 + Math.sin(a) * ry]); }
  return pts;
}

export const GLYPHS = {
  '0': [ellipse(32, 44, 16)],
  '1': [[[26, 24], [50, 10], [50, 90]], [[26, 93], [74, 93]]],
  '2': [[[18, 28], [32, 12], [54, 8], [73, 20], [72, 40], [52, 56], [22, 90], [80, 90]]],
  '3': [[[20, 16], [45, 8], [68, 18], [61, 40], [44, 48], [66, 57], [71, 78], [47, 92], [22, 84]]],
  '4': [[[62, 6], [14, 66]], [[8, 66], [92, 66]], [[64, 30], [64, 94]]],
  '5': [[[74, 10], [30, 10], [26, 42], [52, 37], [72, 51], [70, 78], [44, 92], [20, 83]]],
  '6': [[[70, 12], [40, 21], [24, 51], [26, 76], [46, 92], [68, 83], [73, 61], [53, 50], [30, 56]]],
  '7': [[[19, 10], [80, 10], [44, 92]]],
  '8': [[[50, 9], [70, 18], [72, 32], [50, 45], [28, 32], [30, 18], [50, 9]], [[50, 45], [74, 56], [76, 74], [50, 92], [24, 74], [26, 56], [50, 45]]],
  '9': [[[62, 50], [38, 57], [24, 40], [34, 16], [58, 8], [74, 25], [72, 57], [61, 84], [40, 92]]],
  'I': [[[26, 10], [74, 10]], [[50, 10], [50, 90]], [[26, 90], [74, 90]]],
  'T': [[[16, 10], [84, 10]], [[50, 12], [50, 92]]],
  'M': [[[16, 92], [16, 10], [50, 58], [84, 10], [84, 92]]],
};

function strokeLength(p) {
  let l = 0;
  for (let i = 1; i < p.length; i++) l += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
  return l;
}

function sampleStroke(p, n) {
  const total = strokeLength(p), out = [];
  for (let k = 0; k < n; k++) {
    let d = total * (n === 1 ? 0.5 : k / (n - 1)), i = 1;
    while (i < p.length - 1 && d > Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])) {
      d -= Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); i++;
    }
    const seg = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]) || 1;
    const t = Math.min(1, d / seg);
    out.push([p[i - 1][0] + (p[i][0] - p[i - 1][0]) * t, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * t]);
  }
  return out;
}

export function glyphNodes(glyph, count) {
  const strokes = GLYPHS[String(glyph).toUpperCase()] || GLYPHS['5'];
  const lens = strokes.map(strokeLength), total = lens.reduce((a, b) => a + b, 0);
  const nodes = [];
  strokes.forEach((s, si) => {
    const n = Math.max(2, Math.round(count * (lens[si] / total)));
    sampleStroke(s, n).forEach(pt => nodes.push(pt));
  });
  return nodes;
}

/* ---- Components ----------------------------------------------------- */

/** One cutout. Sized by its long edge; aged artwork is never recoloured. */
export function Specimen({ name, family = 'bloom', size = 180, rotate = 0, flip = false, opacity = 1, base, style, alt = '' }) {
  size = Number(size) || 180;
  const file = name || (SPECIMENS[family] || [])[0];
  const t = 'rotate(' + rotate + 'deg)' + (flip ? ' scaleX(-1)' : '');
  const box = { width: size, height: size, transform: t, opacity, flexShrink: 0, ...style };
  if (!file) {
    return (
      <span aria-hidden="true" style={{
        ...box, display: 'grid', placeItems: 'center', borderRadius: 'var(--radius-circle)',
        background: 'repeating-linear-gradient(135deg, rgba(51,48,42,.10) 0 5px, rgba(51,48,42,0) 5px 10px)',
        border: '1px dashed rgba(51,48,42,.28)', boxSizing: 'border-box',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: Math.max(7, Math.min(11, size * 0.11)),
          color: 'var(--paper-ink-muted)', letterSpacing: '.04em',
        }}>{family}</span>
      </span>
    );
  }
  const src = file.indexOf('/') > -1 ? assetBase(base) + file.split('/').pop() : assetBase(base) + file;
  return <img src={src} alt={alt} aria-hidden={alt ? undefined : 'true'} style={{ ...box, objectFit: 'contain', display: 'block' }} />;
}

/** A numeral or letter built from specimens strung along its stroke —
 *  the title-slide device. Digits 0-9 plus I, T, M. */
export function SpecimenGlyph({
  glyph = '5', size = 620, count = 14, families = ['bloom', 'leaf', 'sprig'],
  piece, jitter = 1, seed = 3, base, style, children,
}) {
  size = Number(size) || 620; count = Number(count) || 14; jitter = Number(jitter);
  if (!isFinite(jitter)) jitter = 1;
  const nodes = glyphNodes(glyph, count);
  const items = pool(families);
  const unit = piece || size * 0.24;
  return (
    <div aria-hidden="true" style={{ position: 'relative', width: size * 0.8, height: size, ...style }}>
      {nodes.map(([x, y], i) => {
        const r1 = rnd(i, seed), r2 = rnd(i, seed + 7), r3 = rnd(i, seed + 13);
        const s = unit * (0.6 + r1 * 0.7);
        const file = items.length ? items[i % items.length] : null;
        return (
          <span key={i} style={{
            position: 'absolute', left: (x + (r2 - 0.5) * 5 * jitter) + '%', top: (y + (r3 - 0.5) * 4 * jitter) + '%',
            transform: 'translate(-50%,-50%)', zIndex: Math.round(s),
          }}>
            <Specimen name={file ? file.split('/').pop() : null} family={file ? file.split('/')[0] : families[i % families.length]}
              size={s} rotate={(r2 - 0.5) * 34 * jitter} flip={r3 > 0.62} base={base} />
          </span>
        );
      })}
      {children}
    </div>
  );
}

/** Low-opacity specimens drifting behind a text block. Fills its
 *  positioned parent; never sits inside the text column. */
export function SpecimenScatter({
  count = 6, size = 280, families = ['leaf', 'sprig', 'wing'],
  opacity = 'var(--specimen-scatter-opacity)', seed = 11, base, style,
}) {
  count = Number(count) || 6; size = Number(size) || 280;
  const items = pool(families);
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', opacity, ...style }}>
      {Array.from({ length: count }, (_, i) => {
        const r1 = rnd(i, seed), r2 = rnd(i, seed + 5), r3 = rnd(i, seed + 9), r4 = rnd(i, seed + 17);
        const file = items.length ? items[i % items.length] : null;
        return (
          <span key={i} style={{ position: 'absolute', left: (4 + r1 * 88) + '%', top: (4 + r2 * 86) + '%', transform: 'translate(-50%,-50%)' }}>
            <Specimen name={file ? file.split('/').pop() : null} family={file ? file.split('/')[0] : families[i % families.length]}
              size={size * (0.5 + r3 * 0.8)} rotate={(r4 - 0.5) * 40} flip={r3 > 0.5} base={base} />
          </span>
        );
      })}
    </div>
  );
}

/** An aged-paper ground with optional grain. The only surface a
 *  specimen may sit on. */
export function Paper({ tone = 'cream', grain = true, radius = 0, children, style }) {
  const bg = { cream: 'var(--paper-cream)', sage: 'var(--paper-sage)', tan: 'var(--paper-tan)' }[tone] || 'var(--paper-cream)';
  return (
    <div style={{ position: 'relative', background: bg, color: 'var(--paper-ink)', borderRadius: radius, overflow: 'hidden', ...style }}>
      {grain && <span aria-hidden="true" style={{
        position: 'absolute', inset: 0, backgroundImage: 'var(--grain)',
        opacity: 'var(--grain-opacity)', mixBlendMode: 'var(--grain-blend)', pointerEvents: 'none',
      }} />}
      {children}
    </div>
  );
}
