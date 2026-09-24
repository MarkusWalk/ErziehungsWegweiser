/* Rendert die Inhaltsblöcke eines Artikels zu statischem HTML.
   Jeder Blocktyp ist bewusst eng definiert, damit 100 Artikel
   visuell konsistent bleiben und der Autor keine Layoutfreiheit
   braucht. Diagramme werden hier als fertiges SVG erzeugt –
   im Browser läuft dafür kein JavaScript. */

import { esc, inline, slugify } from './inline.mjs';
import { TOOLS } from './tools-data.mjs';
import { renderIllustration } from './illustrations.mjs';

const EVIDENCE = {
  stark: { label: 'Gut belegt', cls: 'stark' },
  moderat: { label: 'Hinweise vorhanden', cls: 'moderat' },
  umstritten: { label: 'Umstritten', cls: 'umstritten' },
};

const CALLOUT = {
  info: 'Gut zu wissen',
  tip: 'Praxis-Tipp',
  warn: 'Achtung',
  danger: 'Sofort handeln',
  myth: 'Verbreiteter Irrtum',
};

export function renderBlocks(blocks = [], ctx = {}) {
  return blocks.map((b) => renderBlock(b, ctx)).filter(Boolean).join('\n');
}

function renderBlock(block, ctx) {
  if (!block || typeof block !== 'object') return '';
  const fn = RENDERERS[block.type];
  if (!fn) {
    ctx.warn?.(`Unbekannter Blocktyp: ${block.type}`);
    return '';
  }
  return fn(block, ctx);
}

const RENDERERS = {
  section(block, ctx) {
    const id = block.id || slugify(block.heading || '');
    const level = Math.min(Math.max(block.level || 2, 2), 4);
    ctx.toc?.push({ id, title: block.heading, level });
    return `
<section class="c-section" id="${esc(id)}">
  <h${level} class="c-section__title">
    <a class="c-section__anchor" href="#${esc(id)}" aria-label="Direktlink zu diesem Abschnitt">#</a>
    ${inline(block.heading || '')}
  </h${level}>
  ${renderBlocks(block.blocks, ctx)}
</section>`;
  },

  p(block) {
    const lead = block.lead ? ' c-p--lead' : '';
    return `<p class="c-p${lead}">${inline(block.text)}</p>`;
  },

  list(block) {
    const tag = block.ordered ? 'ol' : 'ul';
    const items = (block.items || [])
      .map((item) => {
        if (typeof item === 'string') return `<li>${inline(item)}</li>`;
        return `<li><strong>${inline(item.title)}</strong> ${inline(item.text || '')}</li>`;
      })
      .join('');
    return `<${tag} class="c-list c-list--${block.ordered ? 'ordered' : 'bullet'}">${items}</${tag}>`;
  },

  steps(block) {
    const items = (block.items || [])
      .map(
        (item, i) => `
      <li class="c-steps__item">
        <span class="c-steps__num" aria-hidden="true">${i + 1}</span>
        <div class="c-steps__body">
          <h4 class="c-steps__title">${inline(item.title)}</h4>
          ${item.text ? `<p>${inline(item.text)}</p>` : ''}
        </div>
      </li>`,
      )
      .join('');
    return `
<div class="c-steps">
  ${block.title ? `<h3 class="c-steps__heading">${inline(block.title)}</h3>` : ''}
  <ol class="c-steps__list">${items}</ol>
</div>`;
  },

  callout(block) {
    const variant = CALLOUT[block.variant] ? block.variant : 'info';
    const title = block.title || CALLOUT[variant];
    const body = block.items
      ? `<ul class="c-list c-list--bullet">${block.items.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>`
      : `<p>${inline(block.text || '')}</p>`;
    return `
<aside class="c-callout c-callout--${variant}" role="note">
  <p class="c-callout__title">${inline(title)}</p>
  <div class="c-callout__body">${body}</div>
</aside>`;
  },

  evidence(block, ctx) {
    const level = EVIDENCE[block.level] ? block.level : 'moderat';
    const meta = EVIDENCE[level];
    const refs = renderRefs(block.sources, ctx);
    return `
<div class="c-evidence c-evidence--${meta.cls}">
  <p class="c-evidence__badge">
    <span class="c-evidence__dot" aria-hidden="true"></span>
    <span class="c-evidence__label">${meta.label}</span>
  </p>
  <p class="c-evidence__claim">${inline(block.claim)}</p>
  ${block.note ? `<p class="c-evidence__note">${inline(block.note)}</p>` : ''}
  ${refs}
</div>`;
  },

  quote(block) {
    return `
<figure class="c-quote">
  <blockquote><p>${inline(block.text)}</p></blockquote>
  ${block.source ? `<figcaption>${inline(block.source)}</figcaption>` : ''}
</figure>`;
  },

  table(block) {
    const head = (block.head || []).map((h) => `<th scope="col">${inline(h)}</th>`).join('');
    const rows = (block.rows || [])
      .map((row) => `<tr>${row.map((cell, i) => (i === 0 ? `<th scope="row">${inline(cell)}</th>` : `<td>${inline(cell)}</td>`)).join('')}</tr>`)
      .join('');
    return `
<figure class="c-tablewrap">
  ${block.title ? `<figcaption class="c-tablewrap__title">${inline(block.title)}</figcaption>` : ''}
  <div class="c-tablewrap__scroll">
    <table class="c-table">
      ${head ? `<thead><tr>${head}</tr></thead>` : ''}
      <tbody>${rows}</tbody>
    </table>
  </div>
  ${block.caption ? `<p class="c-caption">${inline(block.caption)}</p>` : ''}
</figure>`;
  },

  checklist(block) {
    const items = (block.items || [])
      .map(
        (item, i) => `
      <li class="c-checklist__item">
        <input type="checkbox" id="chk-${block.id || 'x'}-${i}" class="c-checklist__box">
        <label for="chk-${block.id || 'x'}-${i}">${inline(typeof item === 'string' ? item : item.text)}</label>
      </li>`,
      )
      .join('');
    return `
<div class="c-checklist" data-checklist="${esc(block.id || '')}">
  ${block.title ? `<h3 class="c-checklist__title">${inline(block.title)}</h3>` : ''}
  <ul class="c-checklist__list">${items}</ul>
</div>`;
  },

  timeline(block) {
    const entries = (block.entries || [])
      .map(
        (entry) => `
      <li class="c-timeline__item">
        <span class="c-timeline__age">${inline(entry.age)}</span>
        <div class="c-timeline__body">
          <h4 class="c-timeline__label">${inline(entry.label)}</h4>
          ${entry.text ? `<p>${inline(entry.text)}</p>` : ''}
        </div>
      </li>`,
      )
      .join('');
    return `
<div class="c-timeline">
  ${block.title ? `<h3 class="c-timeline__heading">${inline(block.title)}</h3>` : ''}
  <ol class="c-timeline__list">${entries}</ol>
  ${block.caption ? `<p class="c-caption">${inline(block.caption)}</p>` : ''}
</div>`;
  },

  comparison(block) {
    const cols = (block.columns || [])
      .map(
        (col) => `
      <div class="c-compare__col c-compare__col--${esc(col.tone || 'neutral')}">
        <h4 class="c-compare__title">${inline(col.title)}</h4>
        <ul>${(col.items || []).map((i) => `<li>${inline(i)}</li>`).join('')}</ul>
      </div>`,
      )
      .join('');
    return `
<div class="c-compare">
  ${block.title ? `<h3 class="c-compare__heading">${inline(block.title)}</h3>` : ''}
  <div class="c-compare__grid">${cols}</div>
</div>`;
  },

  faq(block) {
    const items = (block.items || [])
      .map(
        (item) => `
      <details class="c-faq__item">
        <summary>${inline(item.q)}</summary>
        <div class="c-faq__answer"><p>${inline(item.a)}</p></div>
      </details>`,
      )
      .join('');
    return `
<div class="c-faq">
  ${block.title ? `<h3 class="c-faq__heading">${inline(block.title)}</h3>` : ''}
  ${items}
</div>`;
  },

  figure(block, ctx) {
    const svg = renderChart(block, ctx);
    if (!svg) return '';
    return `
<figure class="c-figure">
  ${block.title ? `<figcaption class="c-figure__title">${inline(block.title)}</figcaption>` : ''}
  <div class="c-figure__canvas">${svg}</div>
  ${block.caption ? `<p class="c-caption">${inline(block.caption)}</p>` : ''}
</figure>`;
  },

  scene(block) {
    /* Dynamische three.js-Szene. Der Platzhalter bleibt ohne
       JavaScript sichtbar und beschreibt den Inhalt in Worten. */
    return `
<figure class="c-scene" data-scene="${esc(block.preset)}" data-scene-options="${esc(JSON.stringify(block.options || {}))}">
  ${block.title ? `<figcaption class="c-figure__title">${inline(block.title)}</figcaption>` : ''}
  <div class="c-scene__stage" role="img" aria-label="${esc(block.alt || block.title || 'Interaktive Darstellung')}">
    <noscript><p class="c-scene__fallback">${inline(block.fallback || block.alt || '')}</p></noscript>
  </div>
  ${block.caption ? `<p class="c-caption">${inline(block.caption)}</p>` : ''}
</figure>`;
  },

  tool(block, ctx) {
    /* Kleine, in den Artikel integrierte Mini-Anwendung. Ohne JavaScript
       steht eine vollständige Tabelle der zugrunde liegenden Regel da –
       mit JavaScript ersetzt tools.js sie durch das interaktive Widget. */
    const preset = block.preset;
    const spec = TOOLS[preset];
    if (!spec) {
      ctx.warn?.(`Unbekannter Tool-Preset: ${preset}`);
      return '';
    }
    const fallback = TOOL_FALLBACKS[preset] ? TOOL_FALLBACKS[preset](spec) : '';
    ctx.tools?.push(preset);
    const n = ctx.tools ? ctx.tools.length : 1;
    return `
<div class="c-tool" data-tool="${esc(preset)}" id="tool-${n}">
  ${block.title ? `<h3 class="c-tool__title">${inline(block.title)}</h3>` : ''}
  <div class="c-tool__body" data-tool-body>${fallback}</div>
  <p class="c-tool__privacy">Alle Angaben bleiben in deinem Browser – nichts wird gesendet oder gespeichert.</p>
  ${block.caption ? `<p class="c-caption">${inline(block.caption)}</p>` : ''}
  <script type="application/json" data-tool-data>${JSON.stringify(spec).replace(/</g, '\\u003c')}</script>
</div>`;
  },

  illustration(block, ctx) {
    if (block.specimen) return renderPlate(block, ctx);
    return renderIllustrationSvg(block, ctx);
  },
};

/* ---------------------------------------------------------------
   Bildmaterial (illustration): botanische Bildtafel oder erklärendes
   Linien-SVG. Zwei Formen desselben Blocktyps – unterschieden über
   "specimen" vs. "preset", siehe content/AUTHORING.md Abschnitt 4.
   --------------------------------------------------------------- */

/* Form A: eine einzelne Botanik-Spezimen als ruhige Bildtafel. */
function renderPlate(block, ctx) {
  const name = block.specimen;
  const dims = ctx.specimenDims?.[name];
  if (!dims) {
    ctx.warn?.(`illustration: unbekanntes Spezimen "${name}"`);
    return '';
  }
  const align = block.align === 'right' ? 'right' : block.align === 'wide' ? 'wide' : 'center';
  const root = ctx.root || '';
  const [w, h] = dims;
  return `
<figure class="c-illustration c-illustration--plate c-illustration--${align}">
  <span class="c-plate">
    <img src="${root}assets/botanical/${esc(name)}.webp" alt="${esc(block.alt || '')}" width="${w}" height="${h}" loading="lazy" decoding="async">
  </span>
  ${block.caption ? `<figcaption class="c-illustration__caption">${inline(block.caption)}</figcaption>` : ''}
</figure>`;
}

/* Form B: erklärendes Linien-SVG aus illustrations.mjs. */
function renderIllustrationSvg(block, ctx) {
  const result = renderIllustration(block.preset, block.title || '', block.alt || block.title || '');
  if (!result) {
    ctx.warn?.(`illustration: unbekanntes Preset "${block.preset}"`);
    return '';
  }
  const legend = result.legend
    .map((item) => {
      const marker = item.color
        ? `<span class="c-illustration__swatch${item.swatchClass ? ` ${esc(item.swatchClass)}` : ''}" style="${item.color !== 'transparent' ? `background:${esc(item.color)}` : ''}" aria-hidden="true"></span>`
        : `<span class="c-illustration__num" aria-hidden="true">${item.n}</span>`;
      return `<li>${marker}<span>${inline(item.label)}</span></li>`;
    })
    .join('');
  return `
<figure class="c-illustration c-illustration--diagram">
  ${block.title ? `<figcaption class="c-figure__title">${inline(block.title)}</figcaption>` : ''}
  <div class="c-illustration__canvas">${result.svg}</div>
  <ul class="c-illustration__legend">${legend}</ul>
  ${block.caption ? `<p class="c-caption">${inline(block.caption)}</p>` : ''}
</figure>`;
}

/* ---------------------------------------------------------------
   Quellenverweise innerhalb eines Blocks
   --------------------------------------------------------------- */
function renderRefs(indices, ctx) {
  if (!Array.isArray(indices) || !indices.length) return '';
  const links = indices
    .map((i) => {
      const source = ctx.sources?.[i];
      if (!source) return '';
      return `<a class="c-ref" href="#quelle-${i + 1}" title="${esc(source.title)}">[${i + 1}]</a>`;
    })
    .filter(Boolean)
    .join(' ');
  return links ? `<p class="c-evidence__refs">Belege: ${links}</p>` : '';
}

/* ---------------------------------------------------------------
   Diagramme als statisches SVG
   --------------------------------------------------------------- */
function renderChart(block, ctx) {
  const kind = block.kind || 'bar';
  const builder = CHARTS[kind];
  if (!builder) {
    ctx.warn?.(`Unbekannter Diagrammtyp: ${kind}`);
    return '';
  }
  return builder(block);
}

const CHARTS = {
  /* Horizontale Balken – Vergleich weniger Kategorien. */
  bar(block) {
    const data = block.data || [];
    const max = block.max || Math.max(...data.map((d) => d.value), 1);
    const rowH = 46;
    const labelW = 168;
    const width = 720;
    const height = data.length * rowH + 24;
    const trackW = width - labelW - 76;

    const rows = data
      .map((d, i) => {
        const y = i * rowH + 12;
        const w = Math.max((d.value / max) * trackW, 2);
        return `
    <g>
      <text x="${labelW - 14}" y="${y + 22}" text-anchor="end" class="ch-label">${esc(d.label)}</text>
      <rect x="${labelW}" y="${y + 8}" width="${trackW}" height="22" rx="11" class="ch-track"/>
      <rect x="${labelW}" y="${y + 8}" width="${w}" height="22" rx="11" class="ch-bar" style="--i:${i}"/>
      <text x="${labelW + w + 12}" y="${y + 24}" class="ch-value">${esc(d.display || d.value)}</text>
    </g>`;
      })
      .join('');

    return svgWrap(width, height, rows, block);
  },

  /* Spannweite von–bis, z. B. „Schlafbedarf 11–14 h". */
  range(block) {
    const data = block.data || [];
    const min = block.min ?? Math.min(...data.map((d) => d.from));
    const max = block.max ?? Math.max(...data.map((d) => d.to));
    const span = Math.max(max - min, 1);
    const rowH = 52;
    const labelW = 176;
    const width = 720;
    const height = data.length * rowH + 44;
    const trackW = width - labelW - 96;
    const scale = (v) => labelW + ((v - min) / span) * trackW;

    const ticks = (block.ticks || [])
      .map(
        (t) => `
    <g class="ch-tick">
      <line x1="${scale(t)}" y1="18" x2="${scale(t)}" y2="${height - 26}"/>
      <text x="${scale(t)}" y="${height - 8}" text-anchor="middle">${esc(t)}</text>
    </g>`,
      )
      .join('');

    const rows = data
      .map((d, i) => {
        const y = i * rowH + 30;
        const x1 = scale(d.from);
        const x2 = scale(d.to);
        return `
    <g>
      <text x="${labelW - 14}" y="${y + 20}" text-anchor="end" class="ch-label">${esc(d.label)}</text>
      <line x1="${labelW}" y1="${y + 14}" x2="${labelW + trackW}" y2="${y + 14}" class="ch-track-line"/>
      <rect x="${x1}" y="${y + 4}" width="${Math.max(x2 - x1, 4)}" height="20" rx="10" class="ch-bar" style="--i:${i}"/>
      <text x="${x2 + 12}" y="${y + 20}" class="ch-value">${esc(d.display || `${d.from}–${d.to}`)}</text>
    </g>`;
      })
      .join('');

    return svgWrap(width, height, ticks + rows, block);
  },

  /* Anteile eines Ganzen als gestapelter Balken. */
  share(block) {
    const data = block.data || [];
    const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
    const width = 720;
    const barY = 16;
    const barH = 40;
    let x = 0;

    const segments = data
      .map((d, i) => {
        const w = (d.value / total) * width;
        const seg = `<rect x="${x}" y="${barY}" width="${w}" height="${barH}" class="ch-seg" style="--i:${i}"/>`;
        x += w;
        return seg;
      })
      .join('');

    const legend = data
      .map(
        (d, i) => `
      <g transform="translate(${(i % 3) * 240}, ${86 + Math.floor(i / 3) * 26})">
        <rect x="0" y="0" width="12" height="12" rx="3" class="ch-seg" style="--i:${i}"/>
        <text x="20" y="11" class="ch-legend">${esc(d.label)} · ${esc(d.display || `${Math.round((d.value / total) * 100)} %`)}</text>
      </g>`,
      )
      .join('');

    const height = 96 + Math.ceil(data.length / 3) * 26;
    return svgWrap(width, height, segments + legend, block);
  },

  /* Verlauf über die Zeit, z. B. Wachstum oder Schlafdauer. */
  line(block) {
    const series = block.series || [];
    const width = 720;
    const height = 340;
    const pad = { top: 20, right: 24, bottom: 44, left: 56 };
    const xs = series.flatMap((s) => s.points.map((p) => p[0]));
    const ys = series.flatMap((s) => s.points.map((p) => p[1]));
    const xMin = block.xMin ?? Math.min(...xs);
    const xMax = block.xMax ?? Math.max(...xs);
    const yMin = block.yMin ?? 0;
    const yMax = block.yMax ?? Math.max(...ys);
    const sx = (v) => pad.left + ((v - xMin) / Math.max(xMax - xMin, 1)) * (width - pad.left - pad.right);
    const sy = (v) => height - pad.bottom - ((v - yMin) / Math.max(yMax - yMin, 1)) * (height - pad.top - pad.bottom);

    const grid = (block.yTicks || [])
      .map(
        (t) => `
    <g class="ch-grid">
      <line x1="${pad.left}" y1="${sy(t)}" x2="${width - pad.right}" y2="${sy(t)}"/>
      <text x="${pad.left - 12}" y="${sy(t) + 4}" text-anchor="end">${esc(t)}</text>
    </g>`,
      )
      .join('');

    const xLabels = (block.xTicks || [])
      .map((t) => `<text x="${sx(t)}" y="${height - 16}" text-anchor="middle" class="ch-axis">${esc(t)}</text>`)
      .join('');

    const paths = series
      .map((s, i) => {
        const d = s.points.map((p, j) => `${j === 0 ? 'M' : 'L'}${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`).join(' ');
        return `<path d="${d}" class="ch-line" style="--i:${i}"/>`;
      })
      .join('');

    const legend = series
      .map(
        (s, i) => `
      <g transform="translate(${pad.left + i * 190}, ${pad.top - 6})">
        <line x1="0" y1="0" x2="22" y2="0" class="ch-line" style="--i:${i}"/>
        <text x="30" y="4" class="ch-legend">${esc(s.label)}</text>
      </g>`,
      )
      .join('');

    return svgWrap(width, height, grid + xLabels + paths + legend, block);
  },
};

function svgWrap(width, height, inner, block) {
  return `<svg class="ch" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(block.alt || block.title || 'Diagramm')}" preserveAspectRatio="xMidYMid meet">${inner}</svg>`;
}

/* ---------------------------------------------------------------
   Statische Fallback-Tabellen für tool-Blöcke (ohne JavaScript)
   --------------------------------------------------------------- */
const UNIT_WORD = { day: 'Lebenstag', week: 'Lebenswoche', month: 'Lebensmonat', year: 'Lebensjahr' };

function windowWords(w) {
  const unit = UNIT_WORD[w.unit] || w.unit;
  const text = w.from === w.to ? `${w.from}. ${unit}` : `${w.from}.–${w.to}. ${unit}`;
  return w.note ? `${text} (${w.note})` : text;
}

const TOOL_FALLBACKS = {
  'u-termine'(spec) {
    const rows = spec.windows
      .map((w) => `<tr><th scope="row">${esc(w.name)}</th><td>${esc(windowWords(w))}</td></tr>`)
      .join('');
    return `
<div class="c-tablewrap">
  <div class="c-tablewrap__scroll">
    <table class="c-table">
      <thead><tr><th scope="col">Untersuchung</th><th scope="col">Zeitfenster</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
</div>`;
  },

  schlafbedarf(spec) {
    const rows = spec.ranges
      .map((r) => `<tr><th scope="row">${esc(r.label)}</th><td>${r.min}–${r.max} Stunden</td></tr>`)
      .join('');
    return `
<div class="c-tablewrap">
  <div class="c-tablewrap__scroll">
    <table class="c-table">
      <thead><tr><th scope="col">Alter</th><th scope="col">Schlafbedarf pro 24 h</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
</div>`;
  },

  'korrigiertes-alter'(spec) {
    return `
<p class="c-p">Korrigiertes Alter = chronologisches Alter minus die Wochen, die bei der Geburt bis zur
${spec.fullTermWeeks}. Schwangerschaftswoche gefehlt haben. Üblich bis etwa zum ${spec.correctUntilMonths / 12}.
Geburtstag – danach gleicht sich der Unterschied im Alltag meist aus.</p>`;
  },

  mutterschutz(spec) {
    const rows = [
      ['Beginn Mutterschutz', `${spec.beforeWeeks} Wochen vor dem errechneten Termin`],
      ['Ende Mutterschutz (Regelfall)', `${spec.afterWeeksNormal} Wochen nach der Geburt`],
      ['Ende Mutterschutz (Frühgeburt, Mehrlinge, Behinderung des Kindes)', `${spec.afterWeeksSpecial} Wochen nach der Geburt`],
      ['Anmeldefrist Elternzeit', `spätestens ${spec.elternzeitNoticeWeeks} Wochen vor Beginn`],
      ['Elterngeld rückwirkend beantragen', `höchstens ${spec.elterngeldRetroMonths} Monate rückwirkend`],
    ]
      .map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`)
      .join('');
    return `
<div class="c-tablewrap">
  <div class="c-tablewrap__scroll">
    <table class="c-table">
      <tbody>${rows}</tbody>
    </table>
  </div>
</div>
<p class="c-tool__privacy">Keine Rechtsberatung – im Einzelfall zählt die Auskunft der Krankenkasse oder Elterngeldstelle.</p>`;
  },

  schwangerschaftswoche(spec) {
    const rows = spec.trimesters
      .map((t) => `<tr><th scope="row">${esc(t.label)}</th><td>SSW ${t.fromWeek}–${t.toWeek}</td></tr>`)
      .join('');
    return `
<div class="c-tablewrap">
  <div class="c-tablewrap__scroll">
    <table class="c-table">
      <thead><tr><th scope="col">Abschnitt</th><th scope="col">Schwangerschaftswochen</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
</div>`;
  },

  'beikost-fenster'(spec) {
    return `
<p class="c-p">Empfohlenes Fenster: Beginn des ${spec.fromMonths + 1}. bis Beginn des ${spec.toMonths + 1}. Lebensmonats
– also nicht vor vollendeten ${spec.fromMonths} und nicht nach vollendeten ${spec.toMonths} Monaten.</p>`;
  },
};
