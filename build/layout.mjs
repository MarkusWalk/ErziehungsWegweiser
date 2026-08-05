/* Seitengerüst: Kopf, Navigation, Fuß, Overlays.
   Erzeugt vollständiges, eigenständiges HTML pro Seite –
   im Browser läuft kein Renderer, nur Progressive Enhancement. */

import { esc } from './inline.mjs';

export function layout(page, site) {
  const root = '../'.repeat(page.depth || 0) || './';
  const css = (file) => `${root}assets/css/${file}`;
  const js = (file) => `${root}assets/js/${file}`;

  return `<!DOCTYPE html>
<html lang="de" data-theme="auto" data-root="${root}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(page.title)}${page.isHome ? '' : ` · ${esc(site.title)}`}</title>
<meta name="description" content="${esc(page.description || site.description)}">
<meta name="color-scheme" content="light dark">
<meta property="og:type" content="${page.kind === 'article' ? 'article' : 'website'}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description || site.description)}">
<meta property="og:site_name" content="${esc(site.title)}">
<link rel="canonical" href="${esc(page.canonical || '')}">
<link rel="icon" href="${root}assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${css('tokens.css')}">
<link rel="stylesheet" href="${css('base.css')}">
<link rel="stylesheet" href="${css('components.css')}">
<link rel="stylesheet" href="${css('layout.css')}">
<script>
  /* Theme, Lesemodus und Schriftgröße vor dem ersten Paint setzen,
     damit kein Aufblitzen des falschen Modus entsteht. */
  (function () {
    try {
      var s = JSON.parse(localStorage.getItem('ew:prefs') || '{}');
      var r = document.documentElement;
      var theme = s.theme || 'auto';
      if (theme === 'auto') {
        theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      r.setAttribute('data-theme', theme);
      if (s.reading) r.setAttribute('data-reading', 'on');
      if (s.textsize) r.setAttribute('data-textsize', s.textsize);
    } catch (e) {}
  })();
</script>
${page.head || ''}
</head>
<body class="page page--${esc(page.kind || 'default')}" data-root="${root}">
<a class="skip-link" href="#inhalt">Zum Inhalt springen</a>

${header(page, site, root)}

<main id="inhalt" class="main">
${page.body}
</main>

${footer(site, root)}

${searchOverlay()}
${settingsPanel()}

<script src="${js('app.js')}" defer></script>
<script src="${js('search.js')}" defer></script>
${page.scripts || ''}
</body>
</html>`;
}

function header(page, site, root) {
  const nav = [
    { href: `${root}alter/`, label: 'Nach Alter', id: 'alter' },
    { href: `${root}themen/`, label: 'Nach Thema', id: 'themen' },
    { href: `${root}artikel/`, label: 'Alle Artikel', id: 'artikel' },
    { href: `${root}notfall.html`, label: 'Notfall', id: 'notfall' },
    { href: `${root}ueber.html`, label: 'Über', id: 'ueber' },
  ];

  return `
<header class="site-header" data-header>
  <div class="site-header__inner">
    <a class="brand" href="${root}index.html">
      <span class="brand__mark" aria-hidden="true"></span>
      <span class="brand__text">
        <span class="brand__name">${esc(site.title)}</span>
        <span class="brand__tagline">${esc(site.tagline)}</span>
      </span>
    </a>

    <nav class="site-nav" aria-label="Hauptnavigation">
      <ul class="site-nav__list">
        ${nav
          .map(
            (item) => `<li><a class="site-nav__link${page.nav === item.id ? ' is-current' : ''}" href="${item.href}"${page.nav === item.id ? ' aria-current="page"' : ''}>${esc(item.label)}</a></li>`,
          )
          .join('')}
      </ul>
    </nav>

    <div class="site-header__actions">
      <button class="icon-btn" type="button" data-open-search aria-label="Suche öffnen" title="Suchen (S)">
        ${icon('search')}
      </button>
      <button class="icon-btn" type="button" data-open-settings aria-label="Darstellung und Einstellungen" title="Darstellung">
        ${icon('sliders')}
      </button>
      <button class="icon-btn icon-btn--menu" type="button" data-open-menu aria-label="Menü öffnen" aria-expanded="false">
        ${icon('menu')}
      </button>
    </div>
  </div>
  <div class="site-progress" data-progress aria-hidden="true"><span></span></div>
</header>`;
}

function footer(site, root) {
  return `
<footer class="site-footer">
  <div class="site-footer__inner">
    <div class="site-footer__brand">
      <p class="site-footer__name">${esc(site.title)}</p>
      <p class="site-footer__claim">${esc(site.description)}</p>
    </div>

    <nav class="site-footer__nav" aria-label="Fußzeile">
      <div>
        <p class="site-footer__head">Einstieg</p>
        <ul>
          <li><a href="${root}alter/">Nach Alter</a></li>
          <li><a href="${root}themen/">Nach Thema</a></li>
          <li><a href="${root}artikel/">Alle Artikel</a></li>
        </ul>
      </div>
      <div>
        <p class="site-footer__head">Hintergrund</p>
        <ul>
          <li><a href="${root}ueber.html">Über das Projekt</a></li>
          <li><a href="${root}methodik.html">Methodik &amp; Evidenz</a></li>
          <li><a href="${root}quellen.html">Quellenverzeichnis</a></li>
        </ul>
      </div>
      <div>
        <p class="site-footer__head">Hilfe</p>
        <ul>
          <li><a href="${root}notfall.html">Notfall &amp; Hotlines</a></li>
          <li><a href="${root}glossar.html">Glossar</a></li>
        </ul>
      </div>
    </nav>
  </div>

  <div class="site-footer__legal">
    <p class="disclaimer">
      <strong>Wichtig:</strong> Dieses Kompendium ersetzt keine ärztliche, therapeutische
      oder psychologische Beratung. Bei Sorgen um die Gesundheit oder Entwicklung
      eines Kindes wende dich an die Kinderarztpraxis. In akuten Notfällen gilt der
      Notruf <strong>112</strong>.
    </p>
  </div>
</footer>`;
}

function searchOverlay() {
  return `
<div class="overlay" data-search-overlay hidden>
  <div class="overlay__backdrop" data-close-search></div>
  <div class="overlay__panel search" role="dialog" aria-modal="true" aria-label="Suche">
    <div class="search__field">
      ${icon('search')}
      <input type="search" class="search__input" data-search-input placeholder="Wonach suchst du? z. B. Schlaf, Trotzphase, Beikost" autocomplete="off" spellcheck="false">
      <button class="icon-btn" type="button" data-close-search aria-label="Suche schließen">${icon('close')}</button>
    </div>
    <div class="search__filters" data-search-filters></div>
    <div class="search__results" data-search-results>
      <p class="search__hint">Tippe los – die Suche läuft vollständig in deinem Browser.</p>
    </div>
  </div>
</div>`;
}

function settingsPanel() {
  return `
<div class="overlay" data-settings-overlay hidden>
  <div class="overlay__backdrop" data-close-settings></div>
  <div class="overlay__panel settings" role="dialog" aria-modal="true" aria-label="Darstellung">
    <div class="settings__head">
      <h2>Darstellung</h2>
      <button class="icon-btn" type="button" data-close-settings aria-label="Schließen">${icon('close')}</button>
    </div>

    <fieldset class="settings__group">
      <legend>Farbmodus</legend>
      <div class="segmented" data-pref="theme">
        <button type="button" data-value="light">Hell</button>
        <button type="button" data-value="auto">Automatisch</button>
        <button type="button" data-value="dark">Dunkel</button>
      </div>
    </fieldset>

    <fieldset class="settings__group">
      <legend>Schriftgröße</legend>
      <div class="segmented" data-pref="textsize">
        <button type="button" data-value="m">Normal</button>
        <button type="button" data-value="l">Groß</button>
        <button type="button" data-value="xl">Sehr groß</button>
      </div>
    </fieldset>

    <fieldset class="settings__group">
      <legend>Lesemodus</legend>
      <label class="switch">
        <input type="checkbox" data-pref-toggle="reading">
        <span class="switch__track" aria-hidden="true"></span>
        <span class="switch__label">Immersiv lesen – Navigation und Beiwerk treten zurück</span>
      </label>
    </fieldset>

    <fieldset class="settings__group">
      <legend>Alter meines Kindes</legend>
      <p class="settings__hint">Damit hebt die Seite passende Inhalte hervor. Die Angabe bleibt in deinem Browser.</p>
      <label class="field">
        <span>Geburtsdatum</span>
        <input type="date" data-pref-birthdate>
      </label>
      <p class="settings__age" data-age-readout aria-live="polite"></p>
      <button type="button" class="btn btn--quiet" data-clear-birthdate>Angabe löschen</button>
    </fieldset>
  </div>
</div>`;
}

/* Inline-SVG-Icons: keine Icon-Font, keine externen Requests. */
export function icon(name, cls = '') {
  const paths = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    sliders: '<path d="M4 8h10M18 8h2M4 16h4M12 16h8"/><circle cx="16" cy="8" r="2"/><circle cx="10" cy="16" r="2"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2z"/><path d="M8 3v18"/>',
    alert: '<path d="M12 4 2.5 20h19z"/><path d="M12 10v4M12 17h.01"/>',
  };
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || ''}</svg>`;
}
