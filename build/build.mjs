#!/usr/bin/env node
/* Generator: erzeugt aus content/ die fertige statische Website in docs/.
   Läuft ohne npm-Abhängigkeiten. Das Ergebnis ist reines HTML/CSS/JS –
   GitHub Pages muss nichts bauen.

   Aufruf:  node build/build.mjs  [--quiet] */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc, inline, plain } from './inline.mjs';
import { renderBlocks } from './blocks.mjs';
import { layout, icon, TOPIC_ICONS } from './layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = path.join(ROOT, 'content');
const SITE = path.join(ROOT, 'site');
const OUT = path.join(ROOT, 'docs');
const QUIET = process.argv.includes('--quiet');

const warnings = [];
const warn = (msg) => warnings.push(msg);
const log = (msg) => !QUIET && console.log(msg);

/* ================================================================
   Einlesen
   ================================================================ */
const taxonomy = readJSON(path.join(CONTENT, 'taxonomy.json'));
const site = taxonomy.site;
const phases = taxonomy.phases;
const topics = taxonomy.topics;

/* Ablagepunkte. Alle liegen in der rechten Bildhälfte – die linke
   gehört dem Text. Breiten in rem. */
const SPECIMEN_SLOTS = [
  { css: 'top:-7%;right:2%',    w: [11, 16], families: ['bloom', 'leaf'] },
  { css: 'top:14%;right:24%',   w: [6, 9],   families: ['wing', 'sprig'] },
  { css: 'bottom:-9%;right:19%', w: [9, 14], families: ['bloom', 'leaf'] },
  { css: 'top:44%;right:5%',    w: [7, 11],  families: ['sprig', 'wing'] },
  { css: 'bottom:12%;right:34%', w: [5, 8],  families: ['wing'] },
];

/* Vor dem ersten Seitenaufbau bereitstehen: die Seitenbauer greifen darauf zu. */
const SPECIMENS = loadSpecimens();
const SPECIMEN_DIMS = loadSpecimenDims();

/* Statische Seiten in Reihenfolge. Eine Liste, die sowohl die Seiten
   erzeugt als auch in die Sitemap wandert – zwei Listen laufen sonst
   irgendwann auseinander. */
const STATIC_PAGES = ['notfall', 'ueber', 'methodik', 'quellen', 'glossar', 'impressum', 'datenschutz'];

/* Slugs der Entwürfe, die loadArticles() aussortiert hat. */
const drafts = [];

const articles = loadArticles();
const byPhase = groupBy(articles, (a) => a.phases || []);
const byTopic = groupBy(articles, (a) => a.topics || []);

log(`\n  Erziehungswegweiser — Build`);
log(`  ${articles.length} Artikel · ${phases.length} Altersphasen · ${topics.length} Themenfelder\n`);

/* ================================================================
   Ausgabe vorbereiten
   ================================================================ */
resetDir(OUT);
copyDir(path.join(SITE, 'assets'), path.join(OUT, 'assets'));
write('.nojekyll', '');
writeHeaders();
bundleDesignTokens();

/* ================================================================
   Seiten erzeugen
   ================================================================ */
buildHome();
buildPhaseIndex();
phases.forEach(buildPhasePage);
buildTopicIndex();
topics.forEach(buildTopicPage);
buildArticleIndex();
articles.forEach(buildArticlePage);
buildStaticPages();
buildSearchIndex();
buildSitemap();

/* ================================================================
   Abschluss
   ================================================================ */
if (warnings.length) {
  log(`  ${warnings.length} Hinweis(e):`);
  warnings.slice(0, 40).forEach((w) => log(`    · ${w}`));
  if (warnings.length > 40) log(`    · … und ${warnings.length - 40} weitere`);
}
if (drafts.length) {
  log(`  ${drafts.length} Entwurf/Entwürfe nicht veröffentlicht: ${drafts.join(', ')}`);
}
log(`\n  Fertig → docs/\n`);

/* ================================================================
   Seitenbauer
   ================================================================ */

function buildHome() {
  const featured = articles.filter((a) => a.featured).slice(0, 6);
  const pool = featured.length ? featured : articles.slice(0, 6);

  const body = `
<section class="hero">
  <div class="hero__scene" data-scene="hero" aria-hidden="true"></div>
  ${specimens('startseite', 5)}
  <div class="hero__inner">
    <p class="section-label">Kompendium für die ersten Jahre</p>
    <h1 class="hero__title">${esc(site.tagline)}</h1>
    <p class="hero__lead">${esc(site.description)}</p>
    <div class="hero__actions">
      <a class="btn btn--primary" href="alter/">Nach Alter einsteigen ${icon('arrow-right', { size: 20 })}</a>
      <a class="btn btn--ghost" href="themen/">Themen durchstöbern</a>
    </div>
    <dl class="hero__stats">
      <div><dt>Artikel</dt><dd>${articles.length}</dd></div>
      <div><dt>Themenfelder</dt><dd>${topics.length}</dd></div>
      <div><dt>Altersphasen</dt><dd>${phases.length}</dd></div>
      <div><dt>Quellen</dt><dd>${countSources()}</dd></div>
    </dl>
  </div>
</section>

<section class="band band--personal" data-personal hidden>
  <div class="wrap">
    <h2 class="band__title">Für dein Kind gerade relevant</h2>
    <p class="band__sub" data-personal-age></p>
    <div class="card-grid" data-personal-results></div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <header class="band__head">
      <h2 class="band__title">Nach Alter</h2>
      <p class="band__sub">Jede Phase bringt eigene Fragen mit. Steig dort ein, wo dein Kind gerade steht.</p>
    </header>
    <div class="phase-grid">
      ${phases.map((p) => phaseCard(p)).join('')}
    </div>
  </div>
</section>

<section class="band band--sunk">
  <div class="wrap">
    <header class="band__head">
      <h2 class="band__title">Nach Thema</h2>
      <p class="band__sub">Quer durch alle Altersstufen – von Bindung bis Bildschirmzeit.</p>
    </header>
    <div class="topic-grid">
      ${topics.map((t) => topicCard(t)).join('')}
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap">
    <header class="band__head">
      <h2 class="band__title">Zum Einstieg</h2>
      <p class="band__sub">Artikel, die vielen Eltern früh weiterhelfen.</p>
    </header>
    <div class="card-grid">
      ${pool.map((a) => articleCard(a, '')).join('')}
    </div>
  </div>
</section>

<section class="band band--method">
  <div class="wrap wrap--narrow">
    <h2 class="band__title">Wie dieses Kompendium arbeitet</h2>
    <div class="method-grid">
      <div class="method">
        <h3>Belegt statt behauptet</h3>
        <p>Jede Aussage bekommt eine Einordnung: gut belegt, Hinweise vorhanden oder umstritten. Quellen stehen unter jedem Artikel.</p>
      </div>
      <div class="method">
        <h3>Alltagstauglich</h3>
        <p>Forschung wird übersetzt: was sie konkret für den Abend um 19 Uhr bedeutet, nicht was sie im Fachjournal heißt.</p>
      </div>
      <div class="method">
        <h3>Ohne Schuldzuweisung</h3>
        <p>Es gibt selten den einen richtigen Weg. Wir zeigen Spielräume statt Vorschriften.</p>
      </div>
    </div>
    <p class="band__more"><a class="link-arrow" href="methodik.html">Methodik im Detail ${icon('arrow-right', { size: 20 })}</a></p>
  </div>
</section>`;

  emit('index.html', {
    title: `${site.title} — ${site.tagline}`,
    description: site.description,
    kind: 'home',
    isHome: true,
    depth: 0,
    body,
  });
}

function buildPhaseIndex() {
  const body = `
${pageHead('Nach Alter', 'Von der Schwangerschaft bis ins Schulalter: Was in jeder Phase wichtig wird.', [{ label: 'Nach Alter' }], '../')}
<section class="band">
  <div class="wrap">
    <div class="phase-grid phase-grid--full">
      ${phases.map((p) => phaseCard(p, '../')).join('')}
    </div>
  </div>
</section>`;

  emit('alter/index.html', {
    title: 'Nach Alter',
    description: 'Alle Inhalte nach Altersphase sortiert – von der Schwangerschaft bis ins Schulalter.',
    kind: 'index',
    nav: 'alter',
    depth: 1,
    body,
  });
}

function buildPhasePage(phase) {
  const list = byPhase.get(phase.id) || [];
  const grouped = topics
    .map((t) => ({ topic: t, items: list.filter((a) => (a.topics || []).includes(t.id)) }))
    .filter((g) => g.items.length);

  const body = `
${pageHead(phase.name, phase.blurb, [{ label: 'Nach Alter', href: './' }, { label: phase.name }], '../', {
    eyebrow: phase.range,
    accent: phase.color,
    seed: phase.id,
  })}

<section class="band">
  <div class="wrap">
    ${
      list.length
        ? grouped
            .map(
              (g) => `
      <div class="group">
        <h2 class="group__title">${esc(g.topic.name)}</h2>
        <div class="card-grid">${g.items.map((a) => articleCard(a, '../')).join('')}</div>
      </div>`,
            )
            .join('')
        : '<p class="empty">Für diese Phase entstehen die Inhalte gerade.</p>'
    }
  </div>
</section>

<section class="band band--sunk">
  <div class="wrap">
    <h2 class="band__title">Weiter zu</h2>
    <div class="chip-row">
      ${phases
        .filter((p) => p.id !== phase.id)
        .map((p) => `<a class="chip chip--${esc(p.color)}" href="${p.id}.html">${esc(p.name)} <span>${esc(p.range)}</span></a>`)
        .join('')}
    </div>
  </div>
</section>`;

  emit(`alter/${phase.id}.html`, {
    title: `${phase.name} (${phase.range})`,
    description: phase.blurb,
    kind: 'index',
    nav: 'alter',
    depth: 1,
    body,
  });
}

function buildTopicIndex() {
  const body = `
${pageHead('Nach Thema', 'Fünfzehn Themenfelder, quer durch alle Altersstufen.', [{ label: 'Nach Thema' }], '../')}
<section class="band">
  <div class="wrap">
    <div class="topic-grid topic-grid--full">
      ${topics.map((t) => topicCard(t, '../')).join('')}
    </div>
  </div>
</section>`;

  emit('themen/index.html', {
    title: 'Nach Thema',
    description: 'Alle Themenfelder des Kompendiums im Überblick.',
    kind: 'index',
    nav: 'themen',
    depth: 1,
    body,
  });
}

function buildTopicPage(topic) {
  const list = byTopic.get(topic.id) || [];
  const grouped = phases
    .map((p) => ({ phase: p, items: list.filter((a) => (a.phases || []).includes(p.id)) }))
    .filter((g) => g.items.length);

  const body = `
${pageHead(topic.name, topic.blurb, [{ label: 'Nach Thema', href: './' }, { label: topic.name }], '../', { seed: topic.id })}

<section class="band">
  <div class="wrap">
    ${
      list.length
        ? grouped
            .map(
              (g) => `
      <div class="group">
        <h2 class="group__title"><span class="dot dot--${esc(g.phase.color)}" aria-hidden="true"></span>${esc(g.phase.name)} <small>${esc(g.phase.range)}</small></h2>
        <div class="card-grid">${g.items.map((a) => articleCard(a, '../')).join('')}</div>
      </div>`,
            )
            .join('')
        : '<p class="empty">Für dieses Themenfeld entstehen die Inhalte gerade.</p>'
    }
  </div>
</section>`;

  emit(`themen/${topic.id}.html`, {
    title: topic.name,
    description: topic.blurb,
    kind: 'index',
    nav: 'themen',
    depth: 1,
    body,
  });
}

function buildArticleIndex() {
  const sorted = [...articles].sort((a, b) => a.title.localeCompare(b.title, 'de'));
  const body = `
${pageHead('Alle Artikel', `${articles.length} Artikel, alphabetisch. Nutze die Suche oder filtere nach Phase und Thema.`, [{ label: 'Alle Artikel' }], '../')}

<section class="band">
  <div class="wrap">
    <div class="filterbar" data-filterbar>
      <div class="filterbar__group">
        <span class="filterbar__label">Alter</span>
        ${phases.map((p) => `<button type="button" class="tag tag--${esc(p.color)}" data-filter-phase="${esc(p.id)}">${esc(p.name)}</button>`).join('')}
      </div>
      <div class="filterbar__group">
        <span class="filterbar__label">Thema</span>
        ${topics.map((t) => `<button type="button" class="tag" data-filter-topic="${esc(t.id)}">${esc(t.name)}</button>`).join('')}
      </div>
      <button type="button" class="btn btn--quiet" data-filter-reset hidden>Filter zurücksetzen</button>
    </div>

    <p class="filterbar__count" data-filter-count aria-live="polite"></p>

    <div class="card-grid card-grid--dense" data-article-list>
      ${sorted.map((a) => articleCard(a, '../', true)).join('')}
    </div>
    <p class="empty" data-filter-empty hidden>Keine Artikel passen zu dieser Auswahl.</p>
  </div>
</section>`;

  emit('artikel/index.html', {
    title: 'Alle Artikel',
    description: 'Vollständige Übersicht aller Artikel des Kompendiums.',
    kind: 'index',
    nav: 'artikel',
    depth: 1,
    body,
  });
}

function buildArticlePage(article) {
  const toc = [];
  const ctx = { toc, sources: article.sources || [], warn, tools: [], root: '../', specimenDims: SPECIMEN_DIMS };
  const content = renderBlocks(article.blocks, ctx);

  const phaseTags = (article.phases || [])
    .map((id) => phases.find((p) => p.id === id))
    .filter(Boolean);
  const topicTags = (article.topics || [])
    .map((id) => topics.find((t) => t.id === id))
    .filter(Boolean);

  const related = (article.related || [])
    .map((slug) => articles.find((a) => a.slug === slug))
    .filter(Boolean);

  const body = `
<article class="article" data-article
  data-phases="${esc((article.phases || []).join(' '))}"
  data-topics="${esc((article.topics || []).join(' '))}">

  <header class="article__header">
    ${specimens(article.slug, 3, '../')}
    <div class="wrap wrap--narrow">
      <nav class="breadcrumb" aria-label="Pfad">
        <a href="../index.html">Start</a>
        ${topicTags[0] ? `<span aria-hidden="true">/</span><a href="../themen/${esc(topicTags[0].id)}.html">${esc(topicTags[0].name)}</a>` : ''}
      </nav>

      <h1 class="article__title">${esc(article.title)}</h1>
      ${article.subtitle ? `<p class="article__subtitle">${inline(article.subtitle)}</p>` : ''}

      <div class="article__meta">
        <span class="meta-item">${icon('clock', { size: 16 })} ${article.readingTime || estimateReadingTime(article)} Min. Lesezeit</span>
        ${article.updated ? `<span class="meta-item">Stand: ${esc(formatDate(article.updated))}</span>` : ''}
        <span class="meta-item">${(article.sources || []).length} Quellen</span>
      </div>

      <div class="article__tags">
        ${phaseTags.map((p) => `<a class="tag tag--${esc(p.color)}" href="../alter/${esc(p.id)}.html">${esc(p.name)}</a>`).join('')}
        ${topicTags.map((t) => `<a class="tag" href="../themen/${esc(t.id)}.html">${esc(t.name)}</a>`).join('')}
      </div>
    </div>
  </header>

  ${article.summary ? summaryCard(article) : ''}

  <div class="article__layout wrap">
    ${toc.length > 2 ? tocAside(toc) : ''}
    <div class="article__body">
      ${content}
      ${article.disclaimer !== false && needsMedicalNotice(article) ? medicalNotice() : ''}
      ${sourcesSection(article)}
    </div>
  </div>

  ${related.length ? relatedSection(related) : ''}
</article>`;

  emit(`artikel/${article.slug}.html`, {
    title: article.title,
    description: article.summary || article.subtitle || site.description,
    kind: 'article',
    nav: 'artikel',
    depth: 1,
    body,
    head: articleJsonLd(article),
    scripts: ctx.tools.length ? '<script src="../assets/js/tools.js" defer></script>' : '',
  });
}

function summaryCard(article) {
  const facts = article.keyFacts || [];
  return `
<div class="wrap wrap--narrow">
  <div class="summary">
    <p class="summary__label">Das Wichtigste in Kürze</p>
    <p class="summary__text">${inline(article.summary)}</p>
    ${facts.length ? `<ul class="summary__facts">${facts.map((f) => `<li>${inline(f)}</li>`).join('')}</ul>` : ''}
  </div>
</div>`;
}

function tocAside(toc) {
  return `
<aside class="toc" aria-label="Inhaltsverzeichnis">
  <p class="toc__title">Inhalt</p>
  <ol class="toc__list">
    ${toc
      .filter((t) => t.level === 2)
      .map((t) => `<li><a href="#${esc(t.id)}" data-toc-link>${esc(plain(t.title))}</a></li>`)
      .join('')}
  </ol>
</aside>`;
}

function sourcesSection(article) {
  const sources = article.sources || [];
  if (!sources.length) return '';
  return `
<section class="sources" id="quellen">
  <h2 class="sources__title">Quellen</h2>
  <ol class="sources__list">
    ${sources
      .map(
        (s, i) => `
    <li class="sources__item" id="quelle-${i + 1}">
      <span class="sources__num">${i + 1}</span>
      <div>
        <p class="sources__name">${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a>` : esc(s.title)}</p>
        <p class="sources__pub">${esc([s.publisher, s.year, s.kind].filter(Boolean).join(' · '))}</p>
        ${s.note ? `<p class="sources__note">${inline(s.note)}</p>` : ''}
      </div>
    </li>`,
      )
      .join('')}
  </ol>
  <p class="sources__hint">Wie wir Quellen auswählen und Aussagen einordnen, steht in der <a href="../methodik.html">Methodik</a>.</p>
</section>`;
}

function medicalNotice() {
  return `
<aside class="c-callout c-callout--warn c-callout--medical" role="note">
  <p class="c-callout__title">Kein Ersatz für ärztlichen Rat</p>
  <div class="c-callout__body">
    <p>Dieser Artikel fasst den aktuellen Wissensstand allgemein zusammen. Jedes Kind ist anders.
    Bei Sorgen, ungewöhnlichen Symptomen oder wenn dein Bauchgefühl Alarm schlägt: Kinderarztpraxis
    kontaktieren. Bei akuter Gefahr <strong>112</strong>. Weitere Anlaufstellen findest du auf der
    <a href="../notfall.html">Notfallseite</a>.</p>
  </div>
</aside>`;
}

function relatedSection(related) {
  return `
<section class="band band--sunk related">
  <div class="wrap">
    <h2 class="band__title">Passt dazu</h2>
    <div class="card-grid">${related.map((a) => articleCard(a, '../')).join('')}</div>
  </div>
</section>`;
}

/* ================================================================
   Statische Seiten
   ================================================================ */
function buildStaticPages() {
  for (const name of STATIC_PAGES) {
    const file = path.join(CONTENT, 'pages', `${name}.json`);
    if (!fs.existsSync(file)) {
      warn(`Statische Seite fehlt: content/pages/${name}.json`);
      continue;
    }
    const raw = fs.readFileSync(file, 'utf8');
    const page = JSON.parse(raw);

    /* Impressum und Datenschutzerklärung sind rechtlich verlangt. Ein
       unausgefülltes Formular erfüllt die Pflicht nicht – also laut sagen,
       solange noch Platzhalter darin stehen. */
    const blanks = raw.match(/«[^»]+»/g);
    if (blanks) {
      const unique = [...new Set(blanks)];
      warn(
        `${name}.html: ${unique.length} Platzhalter noch nicht ausgefüllt ` +
          `(${unique.slice(0, 3).join(', ')}${unique.length > 3 ? ', …' : ''})`,
      );
    }
    const ctx = { toc: [], sources: page.sources || [], warn, root: '', specimenDims: SPECIMEN_DIMS };
    const body = `
${pageHead(page.title, page.subtitle, page.breadcrumb || [{ label: page.title }], '')}
<section class="band">
  <div class="wrap wrap--narrow">
    <div class="article__body">
      ${name === 'quellen' ? renderSourceRegister() : renderBlocks(page.blocks, ctx)}
    </div>
  </div>
</section>`;

    emit(`${name}.html`, {
      title: page.title,
      description: page.subtitle || site.description,
      kind: 'static',
      nav: name,
      depth: 0,
      body,
    });
  }

  /* Der Hoster liefert 404.html unter jeder Pfadtiefe aus – daher absolute Pfade. */
  const root404 = site.baseUrl ? `${new URL(site.baseUrl).pathname.replace(/\/$/, '')}/` : '';
  emit('404.html', {
    title: 'Seite nicht gefunden',
    description: 'Diese Seite existiert nicht.',
    kind: 'static',
    depth: 0,
    root: root404,
    body: `
${pageHead('Diese Seite gibt es nicht', 'Vielleicht hilft die Suche oder einer der Einstiege weiter.', [{ label: '404' }], root404)}
<section class="band">
  <div class="wrap wrap--narrow">
    <div class="hero__actions">
      <a class="btn btn--primary" href="${root404}index.html">Zur Startseite</a>
      <a class="btn btn--ghost" href="${root404}artikel/">Alle Artikel</a>
    </div>
  </div>
</section>`,
  });
}

/* Gesammeltes Quellenverzeichnis über alle Artikel. */
function renderSourceRegister() {
  const map = new Map();
  for (const article of articles) {
    for (const source of article.sources || []) {
      const key = source.url || `${source.title}|${source.publisher}`;
      if (!map.has(key)) map.set(key, { source, articles: [] });
      map.get(key).articles.push(article);
    }
  }
  const entries = [...map.values()].sort((a, b) =>
    (a.source.publisher || a.source.title).localeCompare(b.source.publisher || b.source.title, 'de'),
  );

  if (!entries.length) return '<p class="empty">Das Quellenverzeichnis füllt sich mit den Artikeln.</p>';

  return `
<p class="c-p c-p--lead">Alle ${entries.length} Quellen, auf die sich das Kompendium stützt – mit den Artikeln, in denen sie verwendet werden.</p>
<ol class="sources__list sources__list--register">
  ${entries
    .map(
      (entry, i) => `
  <li class="sources__item">
    <span class="sources__num">${i + 1}</span>
    <div>
      <p class="sources__name">${entry.source.url ? `<a href="${esc(entry.source.url)}" target="_blank" rel="noopener noreferrer">${esc(entry.source.title)}</a>` : esc(entry.source.title)}</p>
      <p class="sources__pub">${esc([entry.source.publisher, entry.source.year, entry.source.kind].filter(Boolean).join(' · '))}</p>
      <p class="sources__used">Verwendet in: ${entry.articles.map((a) => `<a href="artikel/${esc(a.slug)}.html">${esc(a.title)}</a>`).join(', ')}</p>
    </div>
  </li>`,
    )
    .join('')}
</ol>`;
}

/* ================================================================
   Suchindex + Sitemap
   ================================================================ */
function buildSearchIndex() {
  const index = articles.map((a) => ({
    t: a.title,
    s: a.subtitle || '',
    u: `artikel/${a.slug}.html`,
    p: a.phases || [],
    k: a.topics || [],
    d: plain(a.summary || ''),
    b: searchBody(a).slice(0, 1400),
  }));

  write(
    'search-index.json',
    JSON.stringify({
      generated: articles.length,
      phases: phases.map((p) => ({ id: p.id, name: p.name, range: p.range, color: p.color })),
      topics: topics.map((t) => ({ id: t.id, name: t.name })),
      docs: index,
    }),
  );
}

function searchBody(article) {
  const parts = [];
  const walk = (blocks) => {
    for (const b of blocks || []) {
      if (b.heading) parts.push(b.heading);
      if (b.text) parts.push(b.text);
      if (b.claim) parts.push(b.claim);
      if (b.title) parts.push(b.title);
      if (Array.isArray(b.items)) {
        for (const item of b.items) {
          if (typeof item === 'string') parts.push(item);
          else parts.push([item.title, item.text, item.q, item.a].filter(Boolean).join(' '));
        }
      }
      if (b.blocks) walk(b.blocks);
    }
  };
  walk(article.blocks);
  (article.keyFacts || []).forEach((f) => parts.push(f));
  return plain(parts.join(' ')).replace(/\s+/g, ' ').trim();
}

function buildSitemap() {
  const urls = [
    'index.html',
    'alter/index.html',
    'themen/index.html',
    'artikel/index.html',
    ...STATIC_PAGES.map((name) => `${name}.html`),
    ...phases.map((p) => `alter/${p.id}.html`),
    ...topics.map((t) => `themen/${t.id}.html`),
    ...articles.map((a) => `artikel/${a.slug}.html`),
  ];

  /* Eine Sitemap verlangt absolute URLs. Ohne baseUrl in taxonomy.json
     entsteht eine, die Suchmaschinen verwerfen. */
  if (!site.baseUrl) {
    warn('site.baseUrl in content/taxonomy.json ist leer – sitemap.xml enthält keine absoluten URLs');
  }

  write(
    'sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${site.baseUrl || ''}/${u}</loc></url>`).join('\n')}
</urlset>`,
  );
}

/* ================================================================
   Bausteine
   ================================================================ */
function pageHead(title, subtitle, crumbs, root, opts = {}) {
  return `
<header class="pagehead${opts.accent ? ` pagehead--${esc(opts.accent)}` : ''}">
  ${specimens(opts.seed || title, 3, root)}
  <div class="wrap">
    <nav class="breadcrumb" aria-label="Pfad">
      <a href="${root}index.html">Start</a>
      ${crumbs.map((c) => `<span aria-hidden="true">/</span>${c.href ? `<a href="${esc(c.href)}">${esc(c.label)}</a>` : `<span>${esc(c.label)}</span>`}`).join('')}
    </nav>
    ${opts.eyebrow ? `<p class="section-label">${esc(opts.eyebrow)}</p>` : ''}
    <h1 class="pagehead__title">${esc(title)}</h1>
    ${subtitle ? `<p class="pagehead__sub">${inline(subtitle)}</p>` : ''}
  </div>
</header>`;
}

/* ================================================================
   Botanische Spezimen
   ----------------------------------------------------------------
   Gedruckte Naturkunde-Ausschnitte aus dem Designsystem als stille
   Hintergrundgeometrie. Rein dekorativ: aria-hidden, lazy geladen,
   unter 900px ausgeblendet.

   Die Auswahl ist gestreut, aber nicht zufällig: sie hängt am Slug
   der Seite. Dadurch bekommt jede Seite ihr eigenes Bild, und zwar
   bei jedem Build dasselbe – Diffs bleiben lesbar, und wiederkehrende
   Besucher sehen dieselbe Seite wieder.
   ================================================================ */

function loadSpecimens() {
  const dir = path.join(SITE, 'assets', 'botanical');
  if (!fs.existsSync(dir)) return {};
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.webp')).map((f) => f.replace(/\.webp$/, ''));
  const byFamily = {};
  for (const file of files) {
    const family = file.split('-')[0];
    (byFamily[family] ||= []).push(file);
  }
  for (const list of Object.values(byFamily)) list.sort();
  return byFamily;
}

/* Breite/Höhe je Spezimen, gelesen aus dem WebP-Header (VP8X-Chunk) –
   für den illustration-Block "specimen": width/height im <img> verhindert
   Layout-Sprünge, ohne dass eine Bildbibliothek als Abhängigkeit nötig wäre. */
function loadSpecimenDims() {
  const dir = path.join(SITE, 'assets', 'botanical');
  if (!fs.existsSync(dir)) return {};
  const dims = {};
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.webp'))) {
    const buf = fs.readFileSync(path.join(dir, file));
    if (buf.toString('ascii', 12, 16) !== 'VP8X') continue;
    const w = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
    const h = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
    dims[file.replace(/\.webp$/, '')] = [w, h];
  }
  return dims;
}

/* Kleiner deterministischer Generator (mulberry32), gespeist aus dem Slug. */
function seededRandom(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}


function specimens(seed, count = 3, root = '') {
  const families = Object.keys(SPECIMENS);
  if (!families.length) return '';

  const rand = seededRandom(seed);
  const used = new Set();
  const out = [];

  /* Damit sich Familien nicht häufen, wird die Reihenfolge der
     Ablagepunkte selbst gemischt. */
  const slots = [...SPECIMEN_SLOTS].sort(() => rand() - 0.5).slice(0, Math.min(count, SPECIMEN_SLOTS.length));

  for (const slot of slots) {
    const pool = slot.families
      .flatMap((f) => SPECIMENS[f] || [])
      .filter((name) => !used.has(name));
    if (!pool.length) continue;

    const file = pool[Math.floor(rand() * pool.length)];
    used.add(file);

    const width = (slot.w[0] + rand() * (slot.w[1] - slot.w[0])).toFixed(1);
    const rotate = (rand() * 36 - 18).toFixed(1);
    const style = `${slot.css};width:${width}rem;transform:rotate(${rotate}deg)`;

    out.push(
      `<img class="specimen" src="${root}assets/botanical/${esc(file)}.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" style="${esc(style)}">`,
    );
  }

  return out.join('\n  ');
}

function phaseCard(phase, root = '') {
  const count = (byPhase.get(phase.id) || []).length;
  return `
<a class="phase-card phase-card--${esc(phase.color)}" href="${root}alter/${esc(phase.id)}.html">
  <span class="phase-card__range">${esc(phase.range)}</span>
  <h3 class="phase-card__name">${esc(phase.name)}</h3>
  <p class="phase-card__blurb">${esc(phase.blurb)}</p>
  <span class="phase-card__count">${count} ${count === 1 ? 'Artikel' : 'Artikel'}</span>
</a>`;
}

function topicCard(topic, root = '') {
  const count = (byTopic.get(topic.id) || []).length;
  return `
<a class="topic-card" href="${root}themen/${esc(topic.id)}.html">
  <span class="topic-card__icon" aria-hidden="true">${icon(TOPIC_ICONS[topic.id] || 'sparkle', { size: 24 })}</span>
  <h3 class="topic-card__name">${esc(topic.name)}</h3>
  <p class="topic-card__blurb">${esc(topic.blurb)}</p>
  <span class="topic-card__count">${count}</span>
</a>`;
}

function articleCard(article, root = '', withData = false) {
  const phase = phases.find((p) => (article.phases || [])[0] === p.id);
  const data = withData
    ? ` data-card data-phases="${esc((article.phases || []).join(' '))}" data-topics="${esc((article.topics || []).join(' '))}" data-title="${esc(article.title.toLowerCase())}"`
    : '';
  return `
<a class="card${phase ? ` card--${esc(phase.color)}` : ''}" href="${root}artikel/${esc(article.slug)}.html"${data}>
  <span class="card__kicker">${esc(phase ? phase.name : 'Alle Alter')}</span>
  <h3 class="card__title">${esc(article.title)}</h3>
  <p class="card__text">${esc(truncate(plain(article.summary || article.subtitle || ''), 150))}</p>
  <span class="card__foot">${article.readingTime || estimateReadingTime(article)} Min.</span>
</a>`;
}

function articleJsonLd(article) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: plain(article.summary || ''),
    inLanguage: 'de',
    dateModified: article.updated,
    isAccessibleForFree: true,
    publisher: { '@type': 'Organization', name: site.title },
  };
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

/* ================================================================
   Hilfsfunktionen
   ================================================================ */
function loadArticles() {
  const dir = path.join(CONTENT, 'articles');
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
  const seen = new Set();
  const list = [];

  for (const file of files) {
    let article;
    try {
      article = readJSON(path.join(dir, file));
    } catch (err) {
      warn(`${file}: ungültiges JSON – ${err.message}`);
      continue;
    }
    const problems = validate(article, file);
    if (problems.length) {
      problems.forEach((p) => warn(`${file}: ${p}`));
      continue;
    }
    if (seen.has(article.slug)) {
      warn(`${file}: doppelter Slug "${article.slug}"`);
      continue;
    }
    /* Entwürfe bleiben im Repo, erscheinen aber nicht auf der Seite.
       Gedacht für Artikel, deren Belege noch nicht gegengeprüft werden
       konnten – ein Kompendium, das Belegbarkeit verspricht, darf keine
       unüberprüften Quellen ausliefern. */
    if (article.draft) {
      drafts.push(article.slug);
      continue;
    }
    seen.add(article.slug);
    list.push(article);
  }
  return list;
}

function validate(article, file) {
  const problems = [];
  const need = ['slug', 'title', 'phases', 'topics', 'blocks'];
  for (const key of need) {
    if (!article[key]) problems.push(`Pflichtfeld fehlt: ${key}`);
  }
  if (article.slug && !/^[a-z0-9-]+$/.test(article.slug)) problems.push(`Slug enthält unerlaubte Zeichen: ${article.slug}`);
  for (const id of article.phases || []) {
    if (!phases.some((p) => p.id === id)) problems.push(`unbekannte Phase: ${id}`);
  }
  for (const id of article.topics || []) {
    if (!topics.some((t) => t.id === id)) problems.push(`unbekanntes Thema: ${id}`);
  }
  if (!Array.isArray(article.sources) || article.sources.length === 0) {
    warn(`${file}: keine Quellen angegeben`);
  }
  return problems;
}

function needsMedicalNotice(article) {
  const medical = ['gesundheit', 'ernaehrung', 'schlaf', 'sicherheit', 'besondere-situationen'];
  return (article.topics || []).some((t) => medical.includes(t));
}

function estimateReadingTime(article) {
  const words = searchBody(article).split(/\s+/).length;
  return Math.max(2, Math.round(words / 190));
}

function countSources() {
  const set = new Set();
  for (const a of articles) {
    for (const s of a.sources || []) set.add(s.url || s.title);
  }
  return set.size;
}

function groupBy(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    for (const key of keyFn(item)) {
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    }
  }
  return map;
}

function truncate(text, max) {
  if (!text || text.length <= max) return text || '';
  return `${text.slice(0, max).replace(/\s+\S*$/, '')} …`;
}

function formatDate(iso) {
  const [y, m, d] = String(iso).split('-');
  if (!y || !m || !d) return iso;
  const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  return `${Number(d)}. ${months[Number(m) - 1]} ${y}`;
}

function emit(relPath, page) {
  if (site.baseUrl && relPath !== '404.html') page.canonical = `${site.baseUrl}/${relPath}`;
  write(relPath, layout(page, site));
}

function write(relPath, contents) {
  const target = path.join(OUT, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents);
}

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function resetDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  fs.cpSync(from, to, { recursive: true });
}

/* HTTP-Header für Cloudflare Pages und Netlify. Beide lesen eine Datei
   namens _headers im Ausgabeverzeichnis. Auf einem Hoster, der sie nicht
   kennt, liegt sie ungenutzt herum und stört nicht.

   Zur Content-Security-Policy: 'unsafe-inline' bei script-src ist nötig,
   weil zwei Dinge inline im HTML stehen — das Theme-Bootstrap im <head>
   (ohne das blitzt beim Laden der falsche Farbmodus auf) und die
   JSON-LD-Blöcke, die pro Artikel unterschiedlich sind. Der wesentliche
   Schutz bleibt: keine Skripte, Stile, Schriften oder Bilder von fremden
   Servern, keine Einbettung in fremde Seiten. */
function writeHeaders() {
  const csp = [
    "default-src 'self'",
    "img-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "connect-src 'self'",
    "base-uri 'self'",
    "form-action 'none'",
    "frame-ancestors 'none'",
  ].join('; ');

  const SECURITY = {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'DENY',
    'Permissions-Policy': 'geolocation=(), camera=(), microphone=(), payment=()',
    'Content-Security-Policy': csp,
  };

  const IMMUTABLE = 'public, max-age=31536000, immutable';
  const REVALIDATE = 'public, max-age=600, must-revalidate';

  /* Ein Regelwerk, zwei Schreibweisen. Die Pfadmuster stehen deshalb
     doppelt da: Netlify/Cloudflare kennen Globs, Vercel erwartet
     path-to-regexp. Alles andere wird aus denselben Werten erzeugt. */
  const CACHE = [
    { glob: '/assets/fonts/*',     source: '/assets/fonts/(.*)',     value: IMMUTABLE,  note: 'Unveränderliche Dateien: ein Jahr cachen.' },
    { glob: '/assets/botanical/*', source: '/assets/botanical/(.*)', value: IMMUTABLE },
    { glob: '/assets/js/vendor/*', source: '/assets/js/vendor/(.*)', value: IMMUTABLE },
    { glob: '/*.html',             source: '/(.*).html',             value: REVALIDATE, note: 'Inhalte ändern sich: kurz cachen, dann neu prüfen.' },
    { glob: '/search-index.json',  source: '/search-index.json',     value: REVALIDATE },
  ];

  /* Cloudflare Pages und Netlify: docs/_headers */
  const blocks = CACHE.map(
    (rule) => `${rule.note ? `# ${rule.note}\n` : ''}${rule.glob}\n  Cache-Control: ${rule.value}\n`,
  );
  write(
    '_headers',
    `# Erzeugt von build/build.mjs – nicht von Hand bearbeiten.

/*
${Object.entries(SECURITY).map(([k, v]) => `  ${k}: ${v}`).join('\n')}

${blocks.join('\n')}`,
  );

  /* Vercel liest _headers nicht, sondern vercel.json im Wurzelverzeichnis.
     Dort steht auch das Ausgabeverzeichnis, damit beim Anlegen des
     Projekts nichts von Hand eingestellt werden muss. */
  const list = (obj) => Object.entries(obj).map(([key, value]) => ({ key, value }));
  fs.writeFileSync(
    path.join(ROOT, 'vercel.json'),
    JSON.stringify(
      {
        $schema: 'https://openapi.vercel.sh/vercel.json',
        outputDirectory: 'docs',
        headers: [
          { source: '/(.*)', headers: list(SECURITY) },
          ...CACHE.map((rule) => ({
            source: rule.source,
            headers: [{ key: 'Cache-Control', value: rule.value }],
          })),
        ],
      },
      null,
      2,
    ) + '\n',
  );
}

/* Die Token-Dateien des Designsystems liegen einzeln unter
   site/assets/css/ds/ – so bleiben sie gegen die Quelle abgleichbar.
   Ausgeliefert werden sie als eine Datei, damit die Seite nicht acht
   Stylesheets nacheinander laden muss. */
function bundleDesignTokens() {
  const dir = path.join(SITE, 'assets', 'css', 'ds');
  if (!fs.existsSync(dir)) {
    warn('Design-Tokens fehlen: site/assets/css/ds/');
    return;
  }
  const order = ['colors', 'typography', 'spacing', 'elevation', 'motion', 'layout', 'effects', 'paper'];
  const parts = order
    .map((name) => path.join(dir, `${name}.css`))
    .filter((file) => fs.existsSync(file))
    .map((file) => `/* ---- ${path.basename(file)} ---- */\n${fs.readFileSync(file, 'utf8')}`);

  write(
    'assets/css/ds-tokens.css',
    `/* Design-Tokens, aus site/assets/css/ds/ zusammengeführt.\n   Nicht von Hand bearbeiten – Änderungen gehören in die Einzeldateien. */\n\n${parts.join('\n')}`,
  );
  fs.rmSync(path.join(OUT, 'assets', 'css', 'ds'), { recursive: true, force: true });
}
