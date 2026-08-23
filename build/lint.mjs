#!/usr/bin/env node
/* Qualitätsprüfung für Artikel. Prüft die Regeln aus content/AUTHORING.md,
   die der Generator selbst nicht erzwingt.

   Aufruf:  node build/lint.mjs            alle Artikel
            node build/lint.mjs <slug> …   einzelne Artikel
   Exit-Code 1, wenn Fehler (nicht: Warnungen) gefunden wurden. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { plain } from './inline.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'content', 'articles');

const taxonomy = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'taxonomy.json'), 'utf8'));
const map = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'topic-map.json'), 'utf8'));

const PHASES = new Set(taxonomy.phases.map((p) => p.id));
const TOPICS = new Set(taxonomy.topics.map((t) => t.id));
const PLANNED = new Set(map.articles.map((a) => a.slug));
const SCENES = new Set(['synapsen', 'schlafzyklus', 'meilensteine', 'koregulation', 'hero']);
const CALLOUTS = new Set(['info', 'tip', 'warn', 'danger', 'myth']);
const LEVELS = new Set(['stark', 'moderat', 'umstritten']);
const FIGURES = new Set(['bar', 'range', 'share', 'line']);
const CALCS = new Set(['due-date', 'age-schedule', 'age-range-lookup']);
const TOOLS = new Set(['interval-timer', 'tally-counter', 'breathing-pacer', 'countdown', 'picker']);

/* Entwürfe erscheinen nicht auf der Seite und werden deshalb nicht als
   Fehler gewertet – sonst blockiert ein bewusst zurückgehaltener Artikel
   die Auslieferung aller anderen. Sie werden aber immer gemeldet, damit
   sie nicht in Vergessenheit geraten. --strict wertet sie mit. */
const STRICT = process.argv.includes('--strict');
const only = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json'))
  .filter((f) => !only.length || only.includes(f.replace(/\.json$/, '')));

let errorCount = 0;
let warnCount = 0;
let draftCount = 0;
const rows = [];

for (const file of files) {
  const slug = file.replace(/\.json$/, '');
  const errors = [];
  const warnings = [];

  let article;
  try {
    article = JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8'));
  } catch (err) {
    report(slug, [`JSON ungültig: ${err.message}`], []);
    continue;
  }

  /* ---- Kopfdaten ---- */
  for (const key of ['slug', 'title', 'subtitle', 'summary', 'phases', 'topics', 'blocks', 'sources', 'updated']) {
    if (!article[key]) errors.push(`Pflichtfeld fehlt: ${key}`);
  }
  if (article.slug !== slug) errors.push(`slug "${article.slug}" passt nicht zum Dateinamen`);
  if (!PLANNED.has(slug)) warnings.push('nicht in topic-map.json geplant');

  (article.phases || []).forEach((p) => { if (!PHASES.has(p)) errors.push(`unbekannte Phase: ${p}`); });
  (article.topics || []).forEach((t) => { if (!TOPICS.has(t)) errors.push(`unbekanntes Thema: ${t}`); });

  if ((article.keyFacts || []).length < 3) warnings.push('weniger als 3 keyFacts');
  if ((article.summary || '').length < 120) warnings.push('summary sehr kurz');

  /* ---- Quellen ---- */
  const sources = article.sources || [];
  if (sources.length < 3) errors.push(`nur ${sources.length} Quellen (mindestens 3)`);
  sources.forEach((s, i) => {
    if (!s.title) errors.push(`Quelle ${i + 1}: Titel fehlt`);
    if (!s.publisher) warnings.push(`Quelle ${i + 1}: Herausgeber fehlt`);
    if (s.url && !/^https?:\/\//.test(s.url)) errors.push(`Quelle ${i + 1}: URL unplausibel`);
  });
  if (sources.length && !sources.some((s) => /leitlinie|metaanalyse|übersichtsarbeit|empfehlung|institutionelle/i.test(s.kind || ''))) {
    warnings.push('keine Leitlinie / Übersichtsarbeit / institutionelle Quelle');
  }

  /* Quellen ohne URL sind erlaubt – eine erfundene URL wäre schlimmer.
     Ein Artikel, in dem gar keine Quelle verlinkt ist, konnte aber
     offensichtlich nicht gegengeprüft werden und braucht eine Runde
     Nacharbeit, sobald wieder recherchiert werden kann. */
  const linked = sources.filter((s) => s.url).length;
  if (sources.length && linked === 0) {
    errors.push(`keine einzige der ${sources.length} Quellen ist verlinkt – vor Veröffentlichung gegenprüfen`);
  } else if (sources.length >= 4 && linked < sources.length / 2) {
    warnings.push(`nur ${linked} von ${sources.length} Quellen verlinkt`);
  }

  /* ---- Blöcke einsammeln ---- */
  const counts = {};
  const texts = [];
  let sceneCount = 0;
  let calcCount = 0;
  let toolCount = 0;

  const walk = (blocks, depth = 0) => {
    for (const b of blocks || []) {
      if (!b || !b.type) { errors.push('Block ohne type'); continue; }
      counts[b.type] = (counts[b.type] || 0) + 1;

      ['text', 'claim', 'note', 'heading', 'title', 'caption', 'summary'].forEach((k) => {
        if (typeof b[k] === 'string') texts.push(b[k]);
      });
      (b.items || []).forEach((item) => {
        if (typeof item === 'string') texts.push(item);
        else if (item) ['title', 'text', 'q', 'a'].forEach((k) => { if (item[k]) texts.push(item[k]); });
      });
      (b.entries || []).forEach((e) => { if (e) texts.push([e.age, e.label, e.text].filter(Boolean).join(' ')); });
      (b.columns || []).forEach((c) => {
        if (!c) return;
        texts.push(c.title || '');
        (c.items || []).forEach((i) => texts.push(i));
      });

      switch (b.type) {
        case 'section':
          if (!b.heading) errors.push('section ohne heading');
          if (depth > 1) warnings.push('section mehr als zweifach verschachtelt');
          walk(b.blocks, depth + 1);
          break;
        case 'evidence':
          if (!LEVELS.has(b.level)) errors.push(`evidence: unbekanntes level "${b.level}"`);
          if (!b.claim) errors.push('evidence ohne claim');
          (b.sources || []).forEach((i) => {
            if (typeof i !== 'number' || i < 0 || i >= sources.length) {
              errors.push(`evidence verweist auf Quelle ${i}, die es nicht gibt`);
            }
          });
          if (!(b.sources || []).length) warnings.push('evidence-Block ohne Quellenverweis');
          break;
        case 'callout':
          if (!CALLOUTS.has(b.variant)) errors.push(`callout: unbekannte variant "${b.variant}"`);
          if (!b.text && !(b.items || []).length) errors.push('callout ohne Inhalt');
          break;
        case 'figure':
          if (!FIGURES.has(b.kind)) errors.push(`figure: unbekannter kind "${b.kind}"`);
          if (!b.alt) warnings.push('figure ohne alt');
          if (!b.caption) warnings.push('figure ohne caption');
          if (b.kind === 'line' ? !(b.series || []).length : !(b.data || []).length) {
            errors.push('figure ohne Daten');
          }
          break;
        case 'scene':
          sceneCount++;
          if (!SCENES.has(b.preset)) errors.push(`scene: unbekanntes preset "${b.preset}"`);
          if (!b.fallback) errors.push('scene ohne fallback (Barrierefreiheit)');
          break;
        case 'calc':
          calcCount++;
          if (!CALCS.has(b.kind)) { errors.push(`calc: unbekannter kind "${b.kind}"`); break; }
          if (b.kind === 'age-schedule') {
            const events = b.options?.events || [];
            if (!events.length) errors.push('calc(age-schedule) ohne options.events');
            events.forEach((e, i) => {
              if (typeof e?.at !== 'number') errors.push(`calc(age-schedule): events[${i}] ohne numerisches "at"`);
              if (!e?.label) errors.push(`calc(age-schedule): events[${i}] ohne label`);
            });
          }
          if (b.kind === 'age-range-lookup') {
            const ranges = b.options?.ranges || [];
            if (!ranges.length) errors.push('calc(age-range-lookup) ohne options.ranges');
            ranges.forEach((r, i) => {
              if (typeof r?.from !== 'number') errors.push(`calc(age-range-lookup): ranges[${i}] ohne numerisches "from"`);
              if (!r?.label) errors.push(`calc(age-range-lookup): ranges[${i}] ohne label`);
            });
          }
          break;
        case 'tool':
          toolCount++;
          if (!TOOLS.has(b.kind)) { errors.push(`tool: unbekannter kind "${b.kind}"`); break; }
          if (!b.id && !b.title) errors.push('tool ohne id und ohne title – braucht eine der beiden für den localStorage-Schlüssel');
          if (b.kind === 'picker') {
            const items = b.options?.items || [];
            if (items.length < 2) errors.push('tool(picker) braucht mindestens 2 options.items');
          }
          if (b.kind === 'breathing-pacer' && b.options?.phases) {
            b.options.phases.forEach((p, i) => {
              if (typeof p?.seconds !== 'number' || p.seconds <= 0) errors.push(`tool(breathing-pacer): phases[${i}] ohne positives "seconds"`);
              if (!p?.label) errors.push(`tool(breathing-pacer): phases[${i}] ohne label`);
            });
          }
          if (b.kind === 'countdown') {
            const presets = b.options?.presets;
            if (presets && presets.some((p) => typeof p !== 'number' || p <= 0)) errors.push('tool(countdown): options.presets enthält einen nicht-positiven Wert');
            if (!presets && (typeof b.options?.seconds !== 'number' || b.options.seconds <= 0)) errors.push('tool(countdown) ohne gültiges options.seconds oder options.presets');
          }
          break;
        case 'table':
          if (!(b.head || []).length) warnings.push('table ohne Kopfzeile');
          (b.rows || []).forEach((r, i) => {
            if (r.length !== (b.head || []).length) errors.push(`table: Zeile ${i + 1} hat abweichende Spaltenzahl`);
          });
          if ((b.head || []).length > 4) warnings.push('table mit mehr als 4 Spalten (mobil schwer lesbar)');
          break;
        case 'faq':
          (b.items || []).forEach((item) => {
            if (!item.q || !item.a) errors.push('faq-Eintrag unvollständig');
          });
          break;
        case 'timeline':
          if (!(b.entries || []).length) errors.push('timeline ohne entries');
          break;
        case 'p':
          if (!b.text) errors.push('p ohne text');
          break;
        default:
          break;
      }
    }
  };
  walk(article.blocks);

  /* ---- Aufbau-Mindestanforderungen ---- */
  if ((counts.evidence || 0) < 2) errors.push(`nur ${counts.evidence || 0} evidence-Blöcke (mindestens 2)`);
  if (!(counts.figure || counts.timeline)) errors.push('keine Visualisierung (figure oder timeline)');
  if (!counts.faq) warnings.push('kein faq-Block');
  if (!counts.callout) warnings.push('kein callout');
  if ((counts.section || 0) < 4) warnings.push(`nur ${counts.section || 0} Abschnitte`);
  if (sceneCount > 1) warnings.push(`${sceneCount} scene-Blöcke (höchstens 1 empfohlen)`);
  if (calcCount > 1) warnings.push(`${calcCount} calc-Blöcke (höchstens 1 empfohlen)`);
  if (toolCount > 1) warnings.push(`${toolCount} tool-Blöcke (höchstens 1 empfohlen)`);

  /* ---- Textprüfungen ---- */
  const body = texts.map(plain).join(' ');
  const words = body.split(/\s+/).filter(Boolean).length;
  if (words < 800) errors.push(`nur ${words} Wörter (mindestens 900 angestrebt)`);
  else if (words < 900) warnings.push(`${words} Wörter (Zielkorridor 900–1600)`);
  if (words > 2200) warnings.push(`${words} Wörter (deutlich über dem Korridor)`);

  const straight = texts.filter((t) => /"/.test(t));
  if (straight.length) warnings.push(`${straight.length}× gerades Anführungszeichen im Text`);

  /* Interne Links prüfen. Artikelseiten liegen unter artikel/<slug>.html,
     der Pfad ist also relativ und führt für alles außerhalb über "../".
     Wurzelabsolute Links (/notfall) brechen auf GitHub Pages, weil das
     Projekt dort unter /<repo>/ ausgeliefert wird. */
  const STATIC_PAGES = new Set(['notfall', 'ueber', 'methodik', 'quellen', 'glossar', 'index', '404']);
  for (const text of texts) {
    for (const [, , href] of String(text).matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)) {
      if (/^https?:/i.test(href) || href.startsWith('#') || href.startsWith('mailto:')) continue;

      if (href.startsWith('/')) {
        errors.push(`wurzelabsoluter Link "${href}" – auf GitHub Pages defekt, nutze "../notfall.html" bzw. "<slug>.html"`);
        continue;
      }
      if (!href.endsWith('.html')) {
        errors.push(`interner Link ohne .html: "${href}"`);
        continue;
      }

      const target = href.replace(/^\.\.\//, '').replace(/\.html$/, '');
      if (href.startsWith('../')) {
        if (!STATIC_PAGES.has(target) && !target.startsWith('alter/') && !target.startsWith('themen/') && !target.startsWith('artikel/')) {
          warnings.push(`Linkziel unbekannt: ${href}`);
        }
      } else if (!fs.existsSync(path.join(DIR, `${target}.json`)) && !PLANNED.has(target)) {
        warnings.push(`Linkziel unbekannt: ${href}`);
      }
    }
  }

  if (/\bIhr Kind\b|\bIhrem Kind\b|\bIhre Kinder\b/.test(body)) warnings.push('Sie-Form gefunden (das Kompendium duzt)');

  /* ---- Querverweise ---- */
  (article.related || []).forEach((r) => {
    if (!PLANNED.has(r) && !fs.existsSync(path.join(DIR, `${r}.json`))) {
      warnings.push(`related verweist auf unbekannten Slug: ${r}`);
    }
    if (r === slug) errors.push('related verweist auf sich selbst');
  });
  if ((article.related || []).length < 2) warnings.push('weniger als 2 related-Verweise');

  const isDraft = Boolean(article.draft);
  rows.push({
    slug, words, isDraft,
    sources: sources.length,
    evidence: counts.evidence || 0,
    errors: errors.length,
    warnings: warnings.length,
  });
  report(slug, errors, warnings, isDraft);
}

function report(slug, errors, warnings, isDraft) {
  if (isDraft && !STRICT) {
    draftCount++;
  } else {
    errorCount += errors.length;
    warnCount += warnings.length;
  }
  if (!errors.length && !warnings.length) return;
  console.log(`\n  ${slug}${isDraft ? '  (Entwurf, nicht veroeffentlicht)' : ''}`);
  const label = isDraft && !STRICT ? 'offen    ' : 'FEHLER   ';
  errors.forEach((e) => console.log(`    ${label}${e}`));
  warnings.forEach((w) => console.log(`    Hinweis  ${w}`));
}

console.log(`\n  ${'Artikel'.padEnd(34)} ${'Wörter'.padStart(7)} ${'Quellen'.padStart(8)} ${'Evidenz'.padStart(8)}  Status`);
console.log(`  ${'-'.repeat(76)}`);
for (const r of rows.sort((a, b) => a.slug.localeCompare(b.slug))) {
  const status = r.isDraft && !STRICT
    ? 'Entwurf'
    : r.errors ? `${r.errors} Fehler` : r.warnings ? `${r.warnings} Hinweise` : 'ok';
  console.log(`  ${r.slug.padEnd(34)} ${String(r.words).padStart(7)} ${String(r.sources).padStart(8)} ${String(r.evidence).padStart(8)}  ${status}`);
}

const draftNote = draftCount ? ` · ${draftCount} Entwurf/Entwuerfe (nicht gewertet, --strict wertet mit)` : '';
console.log(`\n  ${rows.length} Artikel · ${errorCount} Fehler · ${warnCount} Hinweise${draftNote}\n`);
process.exit(errorCount ? 1 : 0);
