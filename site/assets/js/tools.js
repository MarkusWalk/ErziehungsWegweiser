/* Interaktive Mini-Werkzeuge in Artikeln (Block-Typ "tool").
   Nur auf Seiten geladen, die mindestens einen tool-Block enthalten
   (siehe build/build.mjs). Ohne dieses Skript steht in jedem Widget
   eine vollständige Tabelle der Regel – dieses Skript ersetzt sie durch
   ein Eingabeformular mit sofortiger Berechnung.

   Nichts wird gesendet oder gespeichert: alle Eingaben bleiben im
   Arbeitsspeicher der Seite. Einzige Ausnahme ist das Geburtsdatum,
   das app.js ohnehin schon unter dem Schlüssel "ew:prefs" in
   localStorage hält (für das „Für dein Kind gerade relevant“-Band) –
   dieses Skript liest es nur, um Formulare vorzubelegen. */

(function () {
  'use strict';

  var STORE = 'ew:prefs';

  function readPrefs() {
    try {
      return JSON.parse(localStorage.getItem(STORE) || '{}');
    } catch (e) {
      return {};
    }
  }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /* ---------------------------------------------------------
     Datumshilfen – rechnen in UTC, damit Zeitzonen keine
     Tage verschieben.
     --------------------------------------------------------- */
  var MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

  function parseISODate(value) {
    if (!value) return null;
    var parts = value.split('-');
    if (parts.length !== 3) return null;
    var d = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));
    return isNaN(d.getTime()) ? null : d;
  }

  function today() {
    var n = new Date();
    return new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()));
  }

  function addDays(date, n) {
    return new Date(date.getTime() + n * 86400000);
  }

  function addMonths(date, n) {
    var day = date.getUTCDate();
    var t = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + n, 1));
    var daysInMonth = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth() + 1, 0)).getUTCDate();
    t.setUTCDate(Math.min(day, daysInMonth));
    return t;
  }

  function monthsBetween(from, to) {
    var months = (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + (to.getUTCMonth() - from.getUTCMonth());
    if (to.getUTCDate() < from.getUTCDate()) months -= 1;
    return months;
  }

  function formatDE(date) {
    return date.getUTCDate() + '. ' + MONTHS[date.getUTCMonth()] + ' ' + date.getUTCFullYear();
  }

  function daysBetween(a, b) {
    return Math.round((b.getTime() - a.getTime()) / 86400000);
  }

  /* Zeitfenster laut Zähleinheit (Tag/Woche/Monat/Jahr, ab 1 gezählt –
     der 1. Lebenstag ist der Geburtstag selbst). */
  function windowRange(birth, w) {
    var start, end;
    if (w.unit === 'day') {
      start = addDays(birth, w.from - 1);
      end = addDays(birth, w.to - 1);
    } else if (w.unit === 'week') {
      start = addDays(birth, (w.from - 1) * 7);
      end = addDays(birth, w.to * 7 - 1);
    } else if (w.unit === 'month') {
      start = addMonths(birth, w.from - 1);
      end = addDays(addMonths(birth, w.to), -1);
    } else {
      start = addMonths(birth, (w.from - 1) * 12);
      end = addDays(addMonths(birth, w.to * 12), -1);
    }
    return { start: start, end: end };
  }

  function field(labelText, inputHtml) {
    return '<label class="c-tool__field"><span>' + esc(labelText) + '</span>' + inputHtml + '</label>';
  }

  /* ---------------------------------------------------------
     U-Termine
     --------------------------------------------------------- */
  function buildUTermine(root, spec, body) {
    var prefs = readPrefs();
    body.innerHTML =
      '<form class="c-tool__form">' +
      field('Geburtsdatum', '<input type="date" data-in="birthdate">') +
      '</form>' +
      '<div class="c-tool__result" data-out aria-live="polite"></div>';

    var input = body.querySelector('[data-in="birthdate"]');
    var out = body.querySelector('[data-out]');
    if (prefs.birthdate) input.value = prefs.birthdate;

    function render() {
      var birth = parseISODate(input.value);
      if (!birth) {
        out.innerHTML = '<p class="c-tool__hint">Geburtsdatum eingeben, um die Termine zu berechnen.</p>';
        return;
      }
      var t = today();
      var rows = spec.windows.map(function (w) {
        var r = windowRange(birth, w);
        var state = t.getTime() > r.end.getTime() ? 'past' : t.getTime() >= r.start.getTime() ? 'current' : 'future';
        return { w: w, r: r, state: state };
      });
      var hasCurrent = rows.some(function (x) { return x.state === 'current'; });
      if (!hasCurrent) {
        for (var i = 0; i < rows.length; i++) {
          if (rows[i].state === 'future') { rows[i].state = 'next'; break; }
        }
      }
      var html = '<div class="c-tablewrap"><div class="c-tablewrap__scroll"><table class="c-table">' +
        '<thead><tr><th scope="col">Untersuchung</th><th scope="col">Zeitraum</th></tr></thead><tbody>';
      rows.forEach(function (x) {
        var cls = x.state === 'current' ? ' class="is-current"' : x.state === 'next' ? ' class="is-next"' : '';
        var range = esc(formatDE(x.r.start)) + (daysBetween(x.r.start, x.r.end) > 0 ? ' – ' + esc(formatDE(x.r.end)) : '');
        var flag = x.state === 'current' ? ' <span class="c-tool__flag">jetzt dran</span>' : x.state === 'next' ? ' <span class="c-tool__flag">als Nächstes</span>' : '';
        html += '<tr' + cls + '><th scope="row">' + esc(x.w.name) + '</th><td>' + range + flag + '</td></tr>';
      });
      html += '</tbody></table></div></div>';
      out.innerHTML = html;
    }

    input.addEventListener('input', render);
    render();
  }

  /* ---------------------------------------------------------
     Schlafbedarf
     --------------------------------------------------------- */
  function buildSchlafbedarf(root, spec, body) {
    var prefs = readPrefs();
    body.innerHTML =
      '<form class="c-tool__form">' +
      field('Geburtsdatum (optional)', '<input type="date" data-in="birthdate">') +
      field('Alter', '<span class="c-tool__slider"><input type="range" min="0" max="216" step="1" value="6" data-in="months"><output data-out="months-readout"></output></span>') +
      field('Tatsächliche Schlafdauer in Stunden (optional)', '<input type="number" min="0" max="20" step="0.5" inputmode="decimal" data-in="actual">') +
      '</form>' +
      '<div class="c-tool__result" data-out="result" aria-live="polite"></div>';

    var birthInput = body.querySelector('[data-in="birthdate"]');
    var monthsInput = body.querySelector('[data-in="months"]');
    var actualInput = body.querySelector('[data-in="actual"]');
    var monthsReadout = body.querySelector('[data-out="months-readout"]');
    var out = body.querySelector('[data-out="result"]');

    function syncFromBirth() {
      var birth = parseISODate(birthInput.value);
      if (!birth) return;
      var months = monthsBetween(birth, today());
      monthsInput.value = String(Math.max(0, Math.min(216, months)));
    }

    if (prefs.birthdate) {
      birthInput.value = prefs.birthdate;
      syncFromBirth();
    }

    function describeMonths(m) {
      if (m < 24) return m + ' Monate';
      var years = Math.floor(m / 12);
      return years + (years === 1 ? ' Jahr' : ' Jahre');
    }

    function render() {
      var months = Number(monthsInput.value);
      monthsReadout.textContent = describeMonths(months);
      var range = spec.ranges.filter(function (r) { return months >= r.fromMonths && months <= r.toMonths; })[0]
        || spec.ranges[spec.ranges.length - 1];
      var html = '<p class="c-tool__figure"><strong>' + range.min + '–' + range.max + ' Stunden</strong> pro 24 Stunden gelten für ' + esc(range.label) + ' als üblich.</p>';
      var actual = actualInput.value === '' ? null : Number(actualInput.value);
      if (actual !== null && !isNaN(actual)) {
        var diff = actual < range.min ? range.min - actual : actual > range.max ? actual - range.max : 0;
        var diffText = (Math.round(diff * 10) / 10) + ' Stunde' + (Math.round(diff * 10) !== 10 ? 'n' : '');
        if (actual < range.min) html += '<p class="c-tool__note">' + diffText + ' unterhalb der genannten Spanne.</p>';
        else if (actual > range.max) html += '<p class="c-tool__note">' + diffText + ' oberhalb der genannten Spanne.</p>';
        else html += '<p class="c-tool__note">Innerhalb der genannten Spanne.</p>';
      }
      out.innerHTML = html;
    }

    birthInput.addEventListener('input', function () { syncFromBirth(); render(); });
    monthsInput.addEventListener('input', render);
    actualInput.addEventListener('input', render);
    render();
  }

  /* ---------------------------------------------------------
     Korrigiertes Alter
     --------------------------------------------------------- */
  function buildKorrigiertesAlter(root, spec, body) {
    var prefs = readPrefs();
    body.innerHTML =
      '<form class="c-tool__form">' +
      field('Geburtsdatum', '<input type="date" data-in="birthdate">') +
      field('Schwangerschaftswoche bei Geburt', '<input type="number" min="22" max="' + spec.fullTermWeeks + '" step="1" data-in="gestweek">') +
      '</form>' +
      '<div class="c-tool__result" data-out aria-live="polite"></div>';

    var birthInput = body.querySelector('[data-in="birthdate"]');
    var weekInput = body.querySelector('[data-in="gestweek"]');
    var out = body.querySelector('[data-out]');
    if (prefs.birthdate) birthInput.value = prefs.birthdate;

    function render() {
      var birth = parseISODate(birthInput.value);
      var gestWeek = Number(weekInput.value);
      if (!birth || !gestWeek) {
        out.innerHTML = '<p class="c-tool__hint">Geburtsdatum und Schwangerschaftswoche bei Geburt eingeben.</p>';
        return;
      }
      var chronoDays = daysBetween(birth, today());
      var missingDays = Math.max(0, (spec.fullTermWeeks - gestWeek) * 7);
      var correctedDays = chronoDays - missingDays;
      var chronoMonths = monthsBetween(birth, today());
      var html;
      if (correctedDays < 0) {
        html = '<p class="c-tool__figure">Der errechnete Geburtstermin (40. Schwangerschaftswoche) liegt noch '
          + Math.abs(Math.round(correctedDays / 7)) + ' Wochen entfernt. Das korrigierte Alter liegt bei 0.</p>';
      } else {
        var wCorr = Math.floor(correctedDays / 7);
        html = '<p class="c-tool__figure">Korrigiertes Alter: <strong>' + wCorr + ' Wochen</strong> '
          + '(chronologisches Alter: ' + Math.floor(chronoDays / 7) + ' Wochen).</p>';
      }
      if (chronoMonths >= spec.correctUntilMonths) {
        html += '<p class="c-tool__note">Ab etwa ' + (spec.correctUntilMonths / 12) + ' Jahren wird meist nicht mehr korrigiert – der Unterschied gleicht sich im Alltag zunehmend aus.</p>';
      }
      out.innerHTML = html;
    }

    birthInput.addEventListener('input', render);
    weekInput.addEventListener('input', render);
    render();
  }

  /* ---------------------------------------------------------
     Mutterschutz & Elternzeit
     --------------------------------------------------------- */
  function buildMutterschutz(root, spec, body) {
    body.innerHTML =
      '<form class="c-tool__form">' +
      field('Errechneter Entbindungstermin', '<input type="date" data-in="duedate">') +
      '<label class="c-tool__check"><input type="checkbox" data-in="special"><span>Frühgeburt, Mehrlinge oder ärztlich festgestellte Behinderung des Kindes</span></label>' +
      '</form>' +
      '<div class="c-tool__result" data-out aria-live="polite"></div>';

    var dueInput = body.querySelector('[data-in="duedate"]');
    var specialInput = body.querySelector('[data-in="special"]');
    var out = body.querySelector('[data-out]');

    function render() {
      var due = parseISODate(dueInput.value);
      if (!due) {
        out.innerHTML = '<p class="c-tool__hint">Errechneten Entbindungstermin eingeben.</p>';
        return;
      }
      var start = addDays(due, -spec.beforeWeeks * 7);
      var afterWeeks = specialInput.checked ? spec.afterWeeksSpecial : spec.afterWeeksNormal;
      /* Vor der Geburt ist nur der Termin bekannt – die Schutzfrist danach
         läuft ab dem tatsächlichen Geburtstag. Als Anhaltspunkt wird hier
         mit dem errechneten Termin gerechnet; das Datum verschiebt sich
         um denselben Betrag, wie die Geburt vom Termin abweicht. */
      var end = addDays(due, afterWeeks * 7);
      var elternzeitDeadline = addDays(end, -spec.elternzeitNoticeWeeks * 7);
      var html = '<div class="c-tablewrap"><div class="c-tablewrap__scroll"><table class="c-table"><tbody>' +
        '<tr><th scope="row">Beginn Mutterschutz</th><td>' + esc(formatDE(start)) + '</td></tr>' +
        '<tr><th scope="row">Ende Mutterschutz (angenommene Geburt am Termin)</th><td>' + esc(formatDE(end)) + '</td></tr>' +
        '<tr><th scope="row">Anmeldefrist Elternzeit (bei nahtlosem Anschluss)</th><td>' + esc(formatDE(elternzeitDeadline)) + '</td></tr>' +
        '</tbody></table></div></div>' +
        '<p class="c-tool__note">Elterngeld lässt sich höchstens ' + spec.elterngeldRetroMonths + ' Monate rückwirkend beantragen.</p>' +
        '<p class="c-tool__note">Keine Rechtsberatung – die Frist nach der Geburt zählt ab dem tatsächlichen Geburtstag, nicht ab dem Termin.</p>';
      out.innerHTML = html;
    }

    dueInput.addEventListener('input', render);
    specialInput.addEventListener('change', render);
    render();
  }

  /* ---------------------------------------------------------
     Schwangerschaftswoche
     --------------------------------------------------------- */
  function buildSchwangerschaftswoche(root, spec, body) {
    body.innerHTML =
      '<form class="c-tool__form">' +
      field('Errechneter Entbindungstermin', '<input type="date" data-in="duedate">') +
      '</form>' +
      '<div class="c-tool__result" data-out aria-live="polite"></div>';

    var dueInput = body.querySelector('[data-in="duedate"]');
    var out = body.querySelector('[data-out]');

    function render() {
      var due = parseISODate(dueInput.value);
      if (!due) {
        out.innerHTML = '<p class="c-tool__hint">Errechneten Entbindungstermin eingeben.</p>';
        return;
      }
      var daysToDue = daysBetween(today(), due);
      var pregnantDays = spec.totalDays - daysToDue;
      if (pregnantDays < 0) {
        out.innerHTML = '<p class="c-tool__hint">Der Termin liegt weiter als eine übliche Schwangerschaft entfernt in der Zukunft.</p>';
        return;
      }
      var week = Math.floor(pregnantDays / 7);
      var restDays = pregnantDays % 7;
      var trimester = spec.trimesters.filter(function (t) { return week + 1 >= t.fromWeek && week + 1 <= t.toWeek; })[0];
      var html = '<p class="c-tool__figure">Aktuell: <strong>SSW ' + week + '+' + restDays + '</strong>' +
        (trimester ? ' · ' + esc(trimester.label) : '') + '</p>';
      out.innerHTML = html;
    }

    dueInput.addEventListener('input', render);
    render();
  }

  /* ---------------------------------------------------------
     Beikost-Fenster
     --------------------------------------------------------- */
  function buildBeikostFenster(root, spec, body) {
    var prefs = readPrefs();
    body.innerHTML =
      '<form class="c-tool__form">' +
      field('Geburtsdatum', '<input type="date" data-in="birthdate">') +
      '</form>' +
      '<div class="c-tool__result" data-out aria-live="polite"></div>';

    var input = body.querySelector('[data-in="birthdate"]');
    var out = body.querySelector('[data-out]');
    if (prefs.birthdate) input.value = prefs.birthdate;

    function render() {
      var birth = parseISODate(input.value);
      if (!birth) {
        out.innerHTML = '<p class="c-tool__hint">Geburtsdatum eingeben, um das Fenster zu berechnen.</p>';
        return;
      }
      var start = addMonths(birth, spec.fromMonths);
      var end = addMonths(birth, spec.toMonths);
      out.innerHTML = '<p class="c-tool__figure">Fenster: <strong>' + esc(formatDE(start)) + ' bis ' + esc(formatDE(end)) + '</strong></p>';
    }

    input.addEventListener('input', render);
    render();
  }

  var BUILDERS = {
    'u-termine': buildUTermine,
    schlafbedarf: buildSchlafbedarf,
    'korrigiertes-alter': buildKorrigiertesAlter,
    mutterschutz: buildMutterschutz,
    schwangerschaftswoche: buildSchwangerschaftswoche,
    'beikost-fenster': buildBeikostFenster,
  };

  function mount(root) {
    var preset = root.getAttribute('data-tool');
    var builder = BUILDERS[preset];
    var dataNode = root.querySelector('[data-tool-data]');
    var body = root.querySelector('[data-tool-body]');
    if (!builder || !dataNode || !body) return;
    var spec;
    try {
      spec = JSON.parse(dataNode.textContent);
    } catch (e) {
      return;
    }
    builder(root, spec, body);
    root.setAttribute('data-tool-ready', '');
  }

  var nodes = document.querySelectorAll('[data-tool]');
  nodes.forEach(mount);
})();
