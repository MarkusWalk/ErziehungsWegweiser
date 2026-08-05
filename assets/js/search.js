/* Volltextsuche – vollständig im Browser, ohne Server.
   Der Index (search-index.json) wird beim ersten Öffnen der Suche
   geladen und dann im Speicher gehalten. */

(function () {
  'use strict';

  var input = document.querySelector('[data-search-input]');
  var results = document.querySelector('[data-search-results]');
  var filterHost = document.querySelector('[data-search-filters]');
  if (!input || !results) return;

  var root = document.documentElement.getAttribute('data-root') || './';
  var index = null;
  var loading = null;
  var activePhase = null;

  function load() {
    if (index) return Promise.resolve(index);
    if (loading) return loading;
    loading = fetch(root + 'search-index.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        index = data;
        renderFilters();
        return data;
      });
    return loading;
  }

  function renderFilters() {
    if (!filterHost || !index) return;
    filterHost.innerHTML = index.phases.map(function (p) {
      return '<button type="button" class="tag tag--' + p.color + '" data-phase="' + p.id + '" aria-pressed="false">' + escapeHtml(p.name) + '</button>';
    }).join('');
  }

  filterHost && filterHost.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-phase]');
    if (!btn) return;
    var id = btn.getAttribute('data-phase');
    activePhase = activePhase === id ? null : id;
    filterHost.querySelectorAll('[data-phase]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-phase') === activePhase));
    });
    run(input.value);
  });

  /* Normalisierung: Umlaute und ß werden angeglichen, damit
     "schoen" auch "schön" findet. */
  function normalize(value) {
    return String(value)
      .toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function score(doc, terms) {
    var title = normalize(doc.t);
    var sub = normalize(doc.s + ' ' + doc.d);
    var body = normalize(doc.b);
    var total = 0;

    for (var i = 0; i < terms.length; i++) {
      var term = terms[i];
      var hit = 0;
      if (title.indexOf(term) !== -1) hit += title.indexOf(term) === 0 ? 60 : 40;
      if (sub.indexOf(term) !== -1) hit += 14;
      var occurrences = body.split(term).length - 1;
      if (occurrences) hit += Math.min(occurrences, 6) * 3;
      if (!hit) return 0;
      total += hit;
    }
    return total;
  }

  function snippet(doc, terms) {
    var body = doc.b || doc.d || '';
    var lower = normalize(body);
    var pos = -1;
    for (var i = 0; i < terms.length && pos === -1; i++) pos = lower.indexOf(terms[i]);
    if (pos === -1) return body.slice(0, 150) + ' …';

    var start = Math.max(0, pos - 60);
    var text = (start > 0 ? '… ' : '') + body.slice(start, start + 190) + ' …';
    return highlight(text, terms);
  }

  function highlight(text, terms) {
    var out = escapeHtml(text);
    terms.forEach(function (term) {
      if (term.length < 2) return;
      var pattern = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      out = out.replace(pattern, '<mark>$1</mark>');
    });
    return out;
  }

  function run(query) {
    var terms = normalize(query).split(' ').filter(function (t) { return t.length > 1; });

    if (!terms.length && !activePhase) {
      results.innerHTML = '<p class="search__hint">Tippe los – die Suche läuft vollständig in deinem Browser.</p>';
      return;
    }

    load().then(function (data) {
      var pool = data.docs;
      if (activePhase) pool = pool.filter(function (d) { return d.p.indexOf(activePhase) !== -1; });

      var hits = terms.length
        ? pool.map(function (d) { return { doc: d, s: score(d, terms) }; })
            .filter(function (h) { return h.s > 0; })
            .sort(function (a, b) { return b.s - a.s; })
            .slice(0, 30)
        : pool.slice(0, 30).map(function (d) { return { doc: d, s: 0 }; });

      if (!hits.length) {
        results.innerHTML = '<p class="search__none">Nichts gefunden. Versuch ein anderes Wort – oder stöber in den <a href="' + root + 'themen/">Themenfeldern</a>.</p>';
        return;
      }

      var phaseNames = {};
      data.phases.forEach(function (p) { phaseNames[p.id] = p.name; });
      var topicNames = {};
      data.topics.forEach(function (t) { topicNames[t.id] = t.name; });

      results.innerHTML = hits.map(function (hit) {
        var d = hit.doc;
        var meta = (d.p.map(function (p) { return phaseNames[p]; })
          .concat(d.k.map(function (k) { return topicNames[k]; })))
          .filter(Boolean).join(' · ');
        return '<a class="search__hit" href="' + root + d.u + '">' +
          '<span class="search__hit-title">' + highlight(d.t, terms) + '</span>' +
          '<span class="search__hit-meta">' + escapeHtml(meta) + '</span>' +
          '<span class="search__hit-snippet">' + snippet(d, terms) + '</span>' +
          '</a>';
      }).join('');
    });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var timer;
  input.addEventListener('input', function () {
    clearTimeout(timer);
    var value = input.value;
    timer = setTimeout(function () { run(value); }, 110);
  });

  /* Tastaturnavigation durch die Treffer. */
  input.addEventListener('keydown', function (event) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Enter') return;
    var hits = Array.prototype.slice.call(results.querySelectorAll('.search__hit'));
    if (!hits.length) return;

    var current = hits.findIndex(function (h) { return h.classList.contains('is-active'); });

    if (event.key === 'Enter') {
      event.preventDefault();
      (hits[current] || hits[0]).click();
      return;
    }

    event.preventDefault();
    var next = event.key === 'ArrowDown'
      ? Math.min(current + 1, hits.length - 1)
      : Math.max(current - 1, 0);

    hits.forEach(function (h) { h.classList.remove('is-active'); });
    hits[next].classList.add('is-active');
    hits[next].scrollIntoView({ block: 'nearest' });
  });

  /* Index vorladen, sobald die Suche geöffnet wird. */
  document.addEventListener('click', function (event) {
    if (event.target.closest('[data-open-search]')) load();
  });
})();
