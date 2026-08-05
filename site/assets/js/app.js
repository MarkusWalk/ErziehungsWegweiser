/* Progressive Enhancement für alle Seiten.
   Ohne dieses Skript bleibt die Seite vollständig lesbar und
   navigierbar – es ergänzt Komfort, es trägt keine Inhalte. */

(function () {
  'use strict';

  var STORE = 'ew:prefs';
  var root = document.documentElement;

  /* ---------------------------------------------------------
     Einstellungen
     --------------------------------------------------------- */
  function readPrefs() {
    try {
      return JSON.parse(localStorage.getItem(STORE) || '{}');
    } catch (e) {
      return {};
    }
  }

  function writePrefs(prefs) {
    try {
      localStorage.setItem(STORE, JSON.stringify(prefs));
    } catch (e) {
      /* Privater Modus o. ä. – Einstellungen gelten dann nur für diese Sitzung. */
    }
  }

  var prefs = readPrefs();

  function applyPrefs() {
    var theme = prefs.theme || 'auto';
    var resolved = theme === 'auto'
      ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    root.setAttribute('data-theme', resolved);

    if (prefs.reading) root.setAttribute('data-reading', 'on');
    else root.removeAttribute('data-reading');

    if (prefs.textsize && prefs.textsize !== 'm') root.setAttribute('data-textsize', prefs.textsize);
    else root.removeAttribute('data-textsize');

    syncControls();
  }

  function syncControls() {
    document.querySelectorAll('[data-pref]').forEach(function (group) {
      var key = group.getAttribute('data-pref');
      var current = prefs[key] || (key === 'theme' ? 'auto' : 'm');
      group.querySelectorAll('button').forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(btn.getAttribute('data-value') === current));
      });
    });

    document.querySelectorAll('[data-pref-toggle]').forEach(function (input) {
      input.checked = Boolean(prefs[input.getAttribute('data-pref-toggle')]);
    });

    var birth = document.querySelector('[data-pref-birthdate]');
    if (birth && prefs.birthdate) birth.value = prefs.birthdate;
  }

  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    if ((prefs.theme || 'auto') === 'auto') applyPrefs();
  });

  document.addEventListener('click', function (event) {
    var segBtn = event.target.closest('[data-pref] button');
    if (segBtn) {
      var key = segBtn.closest('[data-pref]').getAttribute('data-pref');
      prefs[key] = segBtn.getAttribute('data-value');
      writePrefs(prefs);
      applyPrefs();
    }

    if (event.target.closest('[data-clear-birthdate]')) {
      delete prefs.birthdate;
      writePrefs(prefs);
      var field = document.querySelector('[data-pref-birthdate]');
      if (field) field.value = '';
      renderAge();
      renderPersonal();
    }
  });

  document.addEventListener('change', function (event) {
    var toggle = event.target.closest('[data-pref-toggle]');
    if (toggle) {
      prefs[toggle.getAttribute('data-pref-toggle')] = toggle.checked;
      writePrefs(prefs);
      applyPrefs();
    }

    var birth = event.target.closest('[data-pref-birthdate]');
    if (birth) {
      prefs.birthdate = birth.value;
      writePrefs(prefs);
      renderAge();
      renderPersonal();
    }
  });

  /* ---------------------------------------------------------
     Alter berechnen und passende Phase bestimmen
     --------------------------------------------------------- */
  var PHASE_RANGES = [
    { id: 'schwangerschaft', from: -9, to: 0 },
    { id: 'neugeborenes', from: 0, to: 3 },
    { id: 'saeugling', from: 3, to: 12 },
    { id: 'kleinkind', from: 12, to: 36 },
    { id: 'kindergarten', from: 36, to: 72 },
    { id: 'schulkind', from: 72, to: 240 },
  ];

  function ageInMonths() {
    if (!prefs.birthdate) return null;
    var birth = new Date(prefs.birthdate);
    if (isNaN(birth)) return null;
    var now = new Date();
    return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  }

  function currentPhase() {
    var months = ageInMonths();
    if (months === null) return null;
    for (var i = 0; i < PHASE_RANGES.length; i++) {
      if (months >= PHASE_RANGES[i].from && months < PHASE_RANGES[i].to) return PHASE_RANGES[i].id;
    }
    return 'schulkind';
  }

  function describeAge() {
    var months = ageInMonths();
    if (months === null) return '';
    if (months < 0) return 'Noch ' + Math.abs(months) + ' Monate bis zum errechneten Termin.';
    if (months < 24) return 'Dein Kind ist ' + months + ' Monate alt.';
    var years = Math.floor(months / 12);
    var rest = months % 12;
    return 'Dein Kind ist ' + years + ' Jahre' + (rest ? ' und ' + rest + ' Monate' : '') + ' alt.';
  }

  function renderAge() {
    var readout = document.querySelector('[data-age-readout]');
    if (readout) readout.textContent = describeAge();
  }

  /* Startseite: Artikel der aktuellen Phase hervorheben. */
  function renderPersonal() {
    var band = document.querySelector('[data-personal]');
    if (!band) return;

    var phase = currentPhase();
    if (!phase) {
      band.hidden = true;
      return;
    }

    fetch(root.getAttribute('data-root') + 'search-index.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var matches = data.docs.filter(function (d) { return d.p.indexOf(phase) !== -1; }).slice(0, 6);
        if (!matches.length) { band.hidden = true; return; }

        var phaseMeta = data.phases.filter(function (p) { return p.id === phase; })[0] || {};
        var ageLine = band.querySelector('[data-personal-age]');
        if (ageLine) ageLine.textContent = describeAge() + ' Phase: ' + (phaseMeta.name || '') + ' (' + (phaseMeta.range || '') + ').';

        var target = band.querySelector('[data-personal-results]');
        target.innerHTML = matches.map(function (d) {
          return '<a class="card card--' + (phaseMeta.color || '') + '" href="' + root.getAttribute('data-root') + d.u + '">' +
            '<span class="card__kicker">' + escapeHtml(phaseMeta.name || '') + '</span>' +
            '<h3 class="card__title">' + escapeHtml(d.t) + '</h3>' +
            '<p class="card__text">' + escapeHtml((d.d || '').slice(0, 140)) + '</p>' +
            '</a>';
        }).join('');

        band.hidden = false;
      })
      .catch(function () { band.hidden = true; });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ---------------------------------------------------------
     Overlays und Menü
     --------------------------------------------------------- */
  function toggleOverlay(selector, open) {
    var overlay = document.querySelector(selector);
    if (!overlay) return;
    overlay.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      var focusable = overlay.querySelector('input, button');
      if (focusable) focusable.focus();
    }
  }

  document.addEventListener('click', function (event) {
    if (event.target.closest('[data-open-search]')) toggleOverlay('[data-search-overlay]', true);
    if (event.target.closest('[data-close-search]')) toggleOverlay('[data-search-overlay]', false);
    if (event.target.closest('[data-open-settings]')) toggleOverlay('[data-settings-overlay]', true);
    if (event.target.closest('[data-close-settings]')) toggleOverlay('[data-settings-overlay]', false);

    var menuBtn = event.target.closest('[data-open-menu]');
    if (menuBtn) {
      var nav = document.querySelector('.site-nav');
      var open = nav.getAttribute('data-open') !== 'true';
      nav.setAttribute('data-open', String(open));
      menuBtn.setAttribute('aria-expanded', String(open));
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      toggleOverlay('[data-search-overlay]', false);
      toggleOverlay('[data-settings-overlay]', false);
    }

    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (!typing && (event.key === 's' || event.key === 'S' || event.key === '/')) {
      event.preventDefault();
      toggleOverlay('[data-search-overlay]', true);
    }
    if (!typing && (event.key === 'l' || event.key === 'L')) {
      prefs.reading = !prefs.reading;
      writePrefs(prefs);
      applyPrefs();
    }
  });

  /* ---------------------------------------------------------
     Lesefortschritt und Inhaltsverzeichnis
     --------------------------------------------------------- */
  var progress = document.querySelector('[data-progress] span');
  var article = document.querySelector('[data-article]');

  if (progress && article) {
    var updateProgress = function () {
      var rect = article.getBoundingClientRect();
      var total = rect.height - window.innerHeight;
      var done = Math.min(Math.max(-rect.top / Math.max(total, 1), 0), 1);
      progress.style.width = (done * 100).toFixed(1) + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  var tocLinks = document.querySelectorAll('[data-toc-link]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    tocLinks.forEach(function (link) { map[link.getAttribute('href').slice(1)] = link; });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          tocLinks.forEach(function (l) { l.classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-15% 0px -70% 0px' });

    Object.keys(map).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  /* ---------------------------------------------------------
     Filter auf der Artikelübersicht
     --------------------------------------------------------- */
  var filterbar = document.querySelector('[data-filterbar]');
  if (filterbar) {
    var active = { phase: new Set(), topic: new Set() };
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var countEl = document.querySelector('[data-filter-count]');
    var emptyEl = document.querySelector('[data-filter-empty]');
    var resetBtn = document.querySelector('[data-filter-reset]');

    var applyFilters = function () {
      var visible = 0;
      cards.forEach(function (card) {
        var phases = (card.getAttribute('data-phases') || '').split(' ');
        var topicsOf = (card.getAttribute('data-topics') || '').split(' ');
        var okPhase = active.phase.size === 0 || phases.some(function (p) { return active.phase.has(p); });
        var okTopic = active.topic.size === 0 || topicsOf.some(function (t) { return active.topic.has(t); });
        var show = okPhase && okTopic;
        card.hidden = !show;
        if (show) visible++;
      });

      if (countEl) countEl.textContent = visible + ' von ' + cards.length + ' Artikeln';
      if (emptyEl) emptyEl.hidden = visible !== 0;
      if (resetBtn) resetBtn.hidden = active.phase.size === 0 && active.topic.size === 0;
    };

    filterbar.addEventListener('click', function (event) {
      var btn = event.target.closest('[data-filter-phase], [data-filter-topic]');
      if (btn) {
        var isPhase = btn.hasAttribute('data-filter-phase');
        var set = isPhase ? active.phase : active.topic;
        var value = btn.getAttribute(isPhase ? 'data-filter-phase' : 'data-filter-topic');
        if (set.has(value)) set.delete(value);
        else set.add(value);
        btn.setAttribute('aria-pressed', String(set.has(value)));
        applyFilters();
      }

      if (event.target.closest('[data-filter-reset]')) {
        active.phase.clear();
        active.topic.clear();
        filterbar.querySelectorAll('[aria-pressed="true"]').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        applyFilters();
      }
    });

    applyFilters();
  }

  /* ---------------------------------------------------------
     Checklisten merken sich den Stand
     --------------------------------------------------------- */
  document.querySelectorAll('[data-checklist]').forEach(function (list) {
    var key = 'ew:chk:' + location.pathname + ':' + list.getAttribute('data-checklist');
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) {}

    list.querySelectorAll('input[type="checkbox"]').forEach(function (box, i) {
      if (saved[i]) box.checked = true;
      box.addEventListener('change', function () {
        saved[i] = box.checked;
        try { localStorage.setItem(key, JSON.stringify(saved)); } catch (e) {}
      });
    });
  });

  /* ---------------------------------------------------------
     three.js-Szenen nachladen, wenn sie sichtbar werden
     --------------------------------------------------------- */
  var scenes = document.querySelectorAll('[data-scene]');
  if (scenes.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var loadScenes = function () {
      import(root.getAttribute('data-root') + 'assets/js/scenes.js')
        .then(function (mod) { mod.mountAll(scenes); })
        .catch(function () { /* Szenen sind Beiwerk – Ausfall bleibt folgenlos. */ });
    };

    if ('IntersectionObserver' in window) {
      var sceneObserver = new IntersectionObserver(function (entries, obs) {
        if (entries.some(function (e) { return e.isIntersecting; })) {
          obs.disconnect();
          loadScenes();
        }
      }, { rootMargin: '200px' });
      scenes.forEach(function (s) { sceneObserver.observe(s); });
    } else {
      loadScenes();
    }
  }

  /* ---------------------------------------------------------
     Start
     --------------------------------------------------------- */
  applyPrefs();
  renderAge();
  renderPersonal();
})();
