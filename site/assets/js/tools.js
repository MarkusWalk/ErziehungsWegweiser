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

  /* ---------------------------------------------------------
     Gemeinsame Hilfen für die vier folgenden Werkzeuge, die
     Einträge im Browser sammeln (localStorage).
     --------------------------------------------------------- */
  function pad2(n) { return n < 10 ? '0' + n : String(n); }

  function formatClockTime(ms) {
    var d = new Date(ms);
    return pad2(d.getHours()) + ':' + pad2(d.getMinutes());
  }

  function formatDuration(ms) {
    var total = Math.max(0, Math.round(ms / 1000));
    var m = Math.floor(total / 60);
    var s = total % 60;
    return m + ':' + pad2(s);
  }

  function loadList(key) {
    try {
      var raw = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(raw) ? raw : [];
    } catch (e) {
      return [];
    }
  }

  function saveList(key, list) {
    try {
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {}
  }

  /* ---------------------------------------------------------
     Wehen-Timer
     --------------------------------------------------------- */
  function buildWehenTimer(root, spec, body) {
    var STORE_KEY = 'ew:wehen';
    var entries = loadList(STORE_KEY);
    var tickTimer = null;

    body.innerHTML =
      '<div class="c-tool__toolbar">' +
      '<button type="button" class="c-tool__bigbtn" data-action="toggle">Wehe starten</button>' +
      '<button type="button" class="c-tool__resetbtn" data-action="reset">Liste löschen</button>' +
      '</div>' +
      '<div class="c-tool__result" data-out aria-live="polite"></div>';

    var btn = body.querySelector('[data-action="toggle"]');
    var resetBtn = body.querySelector('[data-action="reset"]');
    var out = body.querySelector('[data-out]');

    function active() {
      return entries.length && entries[entries.length - 1].e == null ? entries[entries.length - 1] : null;
    }

    function render() {
      var a = active();
      if (a) {
        btn.textContent = 'Wehe beenden (' + formatDuration(Date.now() - a.s) + ')';
        btn.className = 'c-tool__bigbtn is-active';
      } else {
        btn.textContent = 'Wehe starten';
        btn.className = 'c-tool__bigbtn';
      }

      var chron = entries.slice().sort(function (x, y) { return x.s - y.s; });
      var completed = chron.filter(function (x) { return x.e != null; });
      var cutoff = Date.now() - 3600000;
      var recent = completed.filter(function (x) { return x.s >= cutoff; });

      var html = '';
      if (recent.length) {
        var durSum = 0;
        recent.forEach(function (x) { durSum += x.e - x.s; });
        var avgDur = durSum / recent.length;
        var intervals = [];
        for (var i = 1; i < completed.length; i++) {
          if (completed[i].s >= cutoff) intervals.push(completed[i].s - completed[i - 1].s);
        }
        var avgInt = intervals.length ? intervals.reduce(function (a2, b) { return a2 + b; }, 0) / intervals.length : null;

        html += '<p class="c-tool__figure">Letzte Stunde: <strong>' + recent.length + ' Wehen</strong>' +
          ', Ø Dauer ' + formatDuration(avgDur) + (avgInt != null ? ', Ø Abstand ' + formatDuration(avgInt) : '') + '</p>';

        var haveHourOfData = (Date.now() - recent[0].s) >= spec.sustainedHours * 3600000 * 0.9;
        var patternMatches = avgInt != null && avgInt <= spec.intervalMinutes * 60000 * 1.2 && avgDur >= spec.durationMinutes * 60000 * 0.7;
        if (haveHourOfData && patternMatches) {
          html += '<p class="c-tool__alert">Das Muster entspricht seit etwa einer Stunde der „' + spec.intervalMinutes +
            '-' + spec.durationMinutes + '-' + spec.sustainedHours + '“-Orientierung – Zeit, in der Klinik oder bei der Hebamme anzurufen. ' +
            'Die eigenen Anweisungen von Klinik oder Hebamme gehen immer vor. Sofort anrufen bei Blutungen, grünlichem oder blutigem ' +
            'Fruchtwasser, spürbar weniger Kindsbewegungen oder sehr starken Schmerzen.</p>';
        }
      } else {
        html += '<p class="c-tool__hint">Noch keine Wehen in der letzten Stunde erfasst.</p>';
      }

      if (chron.length) {
        html += '<ul class="c-tool__log">' + chron.map(function (x, i) {
          var durText = x.e != null ? formatDuration(x.e - x.s) : 'läuft…';
          var intervalText = i > 0 ? ' · Abstand ' + formatDuration(x.s - chron[i - 1].s) : '';
          return '<li>' + formatClockTime(x.s) + ' Uhr · Dauer ' + durText + intervalText + '</li>';
        }).reverse().join('') + '</ul>';
      }

      out.innerHTML = html;
    }

    function startTicking() { stopTicking(); tickTimer = setInterval(render, 1000); }
    function stopTicking() { if (tickTimer) { clearInterval(tickTimer); tickTimer = null; } }

    btn.addEventListener('click', function () {
      var a = active();
      if (a) {
        a.e = Date.now();
        stopTicking();
      } else {
        entries.push({ s: Date.now(), e: null });
        startTicking();
      }
      saveList(STORE_KEY, entries);
      render();
    });

    resetBtn.addEventListener('click', function () {
      if (!entries.length) return;
      if (!window.confirm('Alle erfassten Wehen löschen?')) return;
      entries = [];
      stopTicking();
      saveList(STORE_KEY, entries);
      render();
    });

    if (active()) startTicking();
    render();
  }

  /* ---------------------------------------------------------
     Tagesprotokoll (Stillen, Flasche, Windel, Stuhl, Schlaf)
     --------------------------------------------------------- */
  var PROTOKOLL_LABELS = { links: 'Stillen links', rechts: 'Stillen rechts', flasche: 'Flasche', windel: 'Nasse Windel', stuhl: 'Stuhl', schlaf: 'Schlaf' };

  function isToday(ts) {
    var a = new Date(ts), b = new Date();
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function buildProtokoll(root, spec, body) {
    var STORE_KEY = 'ew:protokoll';
    var entries = loadList(STORE_KEY);
    var nextId = entries.reduce(function (m, x) { return Math.max(m, x.id || 0); }, 0) + 1;

    body.innerHTML =
      '<div class="c-tool__grid">' +
      '<button type="button" class="c-tool__actionbtn" data-add="links">Stillen links</button>' +
      '<button type="button" class="c-tool__actionbtn" data-add="rechts">Stillen rechts</button>' +
      '<button type="button" class="c-tool__actionbtn" data-add="windel">Nasse Windel</button>' +
      '<button type="button" class="c-tool__actionbtn" data-add="stuhl">Stuhl</button>' +
      '<button type="button" class="c-tool__actionbtn" data-action="sleep">Schlaf (Start)</button>' +
      '</div>' +
      '<div class="c-tool__flaschenfeld">' +
      field('Flasche in ml (optional)', '<input type="number" min="0" max="500" step="10" inputmode="numeric" data-in="ml">') +
      '<button type="button" class="c-tool__actionbtn" data-add="flasche">Flasche eintragen</button>' +
      '</div>' +
      '<div class="c-tool__result" data-out aria-live="polite"></div>' +
      '<ul class="c-tool__log" data-log></ul>' +
      '<div class="c-tool__toolbar">' +
      '<button type="button" class="c-tool__resetbtn" data-action="clear">Tag löschen</button>' +
      '<button type="button" class="c-tool__resetbtn" data-action="export">Als Text kopieren</button>' +
      '</div>' +
      '<p class="c-tool__hint" data-copystatus aria-live="polite"></p>';

    var out = body.querySelector('[data-out]');
    var log = body.querySelector('[data-log]');
    var mlInput = body.querySelector('[data-in="ml"]');
    var copyStatus = body.querySelector('[data-copystatus]');
    var sleepBtn = body.querySelector('[data-action="sleep"]');

    function persist() { saveList(STORE_KEY, entries); }

    function activeSleep() {
      for (var i = entries.length - 1; i >= 0; i--) {
        if (entries[i].type === 'schlaf' && entries[i].t2 == null) return entries[i];
      }
      return null;
    }

    function todays() {
      return entries.filter(function (x) { return isToday(x.t); }).sort(function (a, b) { return a.t - b.t; });
    }

    function render() {
      var list = todays();
      var a = activeSleep();
      sleepBtn.textContent = a ? 'Schlaf beenden' : 'Schlaf (Start)';
      sleepBtn.className = a ? 'c-tool__actionbtn is-active' : 'c-tool__actionbtn';

      var feeds = list.filter(function (x) { return x.type === 'links' || x.type === 'rechts' || x.type === 'flasche'; });
      var wet = list.filter(function (x) { return x.type === 'windel'; }).length;
      var stool = list.filter(function (x) { return x.type === 'stuhl'; }).length;
      var lastSide = null;
      for (var i = entries.length - 1; i >= 0; i--) {
        if (entries[i].type === 'links' || entries[i].type === 'rechts') { lastSide = entries[i].type; break; }
      }

      var html = '<p class="c-tool__figure">Heute: <strong>' + feeds.length + ' Mahlzeiten</strong>, ' +
        wet + ' nasse Windel' + (wet === 1 ? '' : 'n') + ', ' + stool + ' Stuhlgang' + (stool === 1 ? '' : '-Einträge') + '</p>';
      if (lastSide) html += '<p class="c-tool__note">Zuletzt gestillt: ' + (lastSide === 'links' ? 'links' : 'rechts') + '</p>';
      html += '<p class="c-tool__note">Orientierung ab etwa dem ' + spec.fromDay + '. Lebenstag: ' + spec.wetDiapersMin +
        ' oder mehr nasse Windeln und ' + spec.feedsMin + '–' + spec.feedsMax + ' Mahlzeiten pro 24 Stunden gelten als üblich – keine Diagnose.</p>';
      out.innerHTML = html;

      log.innerHTML = list.slice().reverse().map(function (x) {
        var label = PROTOKOLL_LABELS[x.type];
        var meta = '';
        if (x.type === 'flasche' && x.ml) meta = ' · ' + x.ml + ' ml';
        if (x.type === 'schlaf') meta = x.t2 != null ? ' · ' + formatDuration(x.t2 - x.t) : ' · läuft…';
        return '<li>' + formatClockTime(x.t) + ' Uhr · ' + esc(label) + meta +
          ' <button type="button" class="c-tool__delbtn" data-del="' + x.id + '" aria-label="Eintrag löschen">×</button></li>';
      }).join('');
    }

    function addEntry(type, extra) {
      var e = { id: nextId++, type: type, t: Date.now() };
      if (type === 'schlaf') e.t2 = null;
      if (extra) { for (var k in extra) e[k] = extra[k]; }
      entries.push(e);
      persist();
      render();
    }

    body.querySelectorAll('[data-add]').forEach(function (b) {
      b.addEventListener('click', function () {
        var type = b.getAttribute('data-add');
        if (type === 'flasche') {
          var ml = mlInput.value ? Number(mlInput.value) : null;
          addEntry('flasche', { ml: ml });
          mlInput.value = '';
        } else {
          addEntry(type);
        }
      });
    });

    sleepBtn.addEventListener('click', function () {
      var a = activeSleep();
      if (a) { a.t2 = Date.now(); } else { entries.push({ id: nextId++, type: 'schlaf', t: Date.now(), t2: null }); }
      persist();
      render();
    });

    log.addEventListener('click', function (ev) {
      var btn = ev.target.closest ? ev.target.closest('[data-del]') : null;
      if (!btn) return;
      var id = Number(btn.getAttribute('data-del'));
      entries = entries.filter(function (x) { return x.id !== id; });
      persist();
      render();
    });

    body.querySelector('[data-action="clear"]').addEventListener('click', function () {
      if (!todays().length) return;
      if (!window.confirm('Heutige Einträge löschen?')) return;
      entries = entries.filter(function (x) { return !isToday(x.t); });
      persist();
      render();
    });

    body.querySelector('[data-action="export"]').addEventListener('click', function () {
      var list = todays();
      var lines = list.map(function (x) {
        var label = PROTOKOLL_LABELS[x.type];
        var meta = x.type === 'flasche' && x.ml ? ' (' + x.ml + ' ml)' : x.type === 'schlaf' && x.t2 != null ? ' (' + formatDuration(x.t2 - x.t) + ')' : '';
        return formatClockTime(x.t) + ' ' + label + meta;
      });
      var text = 'Tagesprotokoll ' + new Date().toLocaleDateString('de-DE') + '\n' + lines.join('\n');
      function done(ok) {
        copyStatus.textContent = ok ? 'In die Zwischenablage kopiert.' : 'Kopieren nicht möglich – Text bitte manuell markieren.';
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      } else {
        done(false);
      }
    });

    render();
  }

  /* ---------------------------------------------------------
     Zahnputz-Timer
     --------------------------------------------------------- */
  function beep(freq, durationMs) {
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      var ctx = new Ctx();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.frequency.value = freq;
      gain.gain.value = 0.08;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      setTimeout(function () { osc.stop(); ctx.close(); }, durationMs);
    } catch (e) {}
  }

  function buildZahnputzTimer(root, spec, body) {
    var total = spec.totalSeconds;
    var qLen = spec.quadrantSeconds;
    var running = false;
    var elapsedMs = 0;
    var startedAt = null;
    var timer = null;
    var lastQuadrant = -1;
    var radius = 54;
    var circumference = 2 * Math.PI * radius;

    var quadrantChips = spec.quadrants.map(function (q, i) {
      return '<li data-q="' + i + '">' + esc(q) + '</li>';
    }).join('');

    body.innerHTML =
      '<div class="c-tool__ringwrap">' +
      '<svg class="c-tool__ring" viewBox="0 0 120 120" aria-hidden="true">' +
      '<circle class="c-tool__ring-bg" cx="60" cy="60" r="' + radius + '"></circle>' +
      '<circle class="c-tool__ring-fg" data-ring cx="60" cy="60" r="' + radius + '" ' +
      'stroke-dasharray="' + circumference + '" stroke-dashoffset="' + circumference + '" transform="rotate(-90 60 60)"></circle>' +
      '</svg>' +
      '<div class="c-tool__ringtime" data-time aria-hidden="true">' + formatDuration(total * 1000) + '</div>' +
      '</div>' +
      '<ul class="c-tool__quadrants" data-quadrants>' + quadrantChips + '</ul>' +
      '<div class="c-tool__toolbar">' +
      '<button type="button" class="c-tool__bigbtn" data-action="toggle">Start</button>' +
      '<button type="button" class="c-tool__resetbtn" data-action="reset">Zurücksetzen</button>' +
      '</div>' +
      '<label class="c-tool__check"><input type="checkbox" data-in="sound"><span>Ton bei Quadrantenwechsel</span></label>' +
      '<div class="c-tool__result" data-out aria-live="polite"></div>';

    var ring = body.querySelector('[data-ring]');
    var timeLabel = body.querySelector('[data-time]');
    var toggleBtn = body.querySelector('[data-action="toggle"]');
    var resetBtn = body.querySelector('[data-action="reset"]');
    var soundInput = body.querySelector('[data-in="sound"]');
    var quadList = body.querySelectorAll('[data-quadrants] li');
    var out = body.querySelector('[data-out]');

    function currentElapsedMs() {
      return running ? elapsedMs + (Date.now() - startedAt) : elapsedMs;
    }

    function render() {
      var elapsed = Math.min(total * 1000, currentElapsedMs());
      var remaining = Math.max(0, total * 1000 - elapsed);
      var progress = elapsed / (total * 1000);
      ring.setAttribute('stroke-dashoffset', String(circumference * (1 - progress)));
      timeLabel.textContent = formatDuration(remaining);

      var qIndex = Math.min(spec.quadrants.length - 1, Math.floor(elapsed / 1000 / qLen));
      quadList.forEach(function (li, i) {
        li.className = elapsed >= total * 1000 ? 'is-done' : i === qIndex ? 'is-current' : i < qIndex ? 'is-done' : '';
      });

      if (running && qIndex !== lastQuadrant) {
        if (lastQuadrant !== -1 && soundInput.checked) beep(660, 150);
        lastQuadrant = qIndex;
      }

      if (elapsed >= total * 1000) {
        out.innerHTML = '<p class="c-tool__figure">Fertig – zwei Minuten geputzt.</p>';
        if (running) stop();
      } else {
        out.innerHTML = '';
      }
    }

    function start() {
      if (running) return;
      if (currentElapsedMs() >= total * 1000) { elapsedMs = 0; lastQuadrant = -1; }
      running = true;
      startedAt = Date.now();
      toggleBtn.textContent = 'Pause';
      timer = setInterval(render, 200);
      render();
    }

    function stop() {
      if (!running) return;
      elapsedMs = currentElapsedMs();
      running = false;
      toggleBtn.textContent = elapsedMs >= total * 1000 ? 'Start' : 'Weiter';
      if (timer) { clearInterval(timer); timer = null; }
    }

    toggleBtn.addEventListener('click', function () { if (running) stop(); else start(); });

    resetBtn.addEventListener('click', function () {
      stop();
      elapsedMs = 0;
      lastQuadrant = -1;
      toggleBtn.textContent = 'Start';
      render();
    });

    render();
  }

  /* ---------------------------------------------------------
     Atemübung
     --------------------------------------------------------- */
  function buildAtemuebung(root, spec, body) {
    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var totalMs = spec.defaultMinutes * 60000;
    var running = false;
    var phase = 'ein';
    var phaseStart = null;
    var startedAt = null;
    var timer = null;

    body.innerHTML =
      (reducedMotion ? '' : '<div class="c-tool__breathe" data-circle aria-hidden="true"></div>') +
      '<p class="c-tool__breathe-cue" data-cue aria-live="polite">Bereit</p>' +
      '<p class="c-tool__breathe-count" data-count aria-hidden="true"></p>' +
      '<div class="c-tool__toolbar">' +
      '<button type="button" class="c-tool__bigbtn" data-action="toggle">Start</button>' +
      '</div>' +
      '<p class="c-tool__hint" data-remaining></p>';

    var circle = body.querySelector('[data-circle]');
    var cue = body.querySelector('[data-cue]');
    var count = body.querySelector('[data-count]');
    var toggleBtn = body.querySelector('[data-action="toggle"]');
    var remainingLabel = body.querySelector('[data-remaining]');

    function setPhase(p) {
      phase = p;
      phaseStart = Date.now();
      cue.textContent = p === 'ein' ? 'Einatmen' : 'Ausatmen';
      if (circle) {
        circle.style.transitionDuration = (p === 'ein' ? spec.inSeconds : spec.outSeconds) + 's';
        circle.className = 'c-tool__breathe' + (p === 'ein' ? ' is-in' : '');
      }
    }

    function tick() {
      var now = Date.now();
      var phaseLen = (phase === 'ein' ? spec.inSeconds : spec.outSeconds) * 1000;
      var phaseElapsed = now - phaseStart;
      count.textContent = String(Math.max(0, Math.ceil((phaseLen - phaseElapsed) / 1000)));

      if (phaseElapsed >= phaseLen) setPhase(phase === 'ein' ? 'aus' : 'ein');

      var totalRemaining = Math.max(0, totalMs - (now - startedAt));
      remainingLabel.textContent = 'Noch ' + formatDuration(totalRemaining);
      if (now - startedAt >= totalMs) stopSession('Geschafft – eine Minute ruhiger geatmet.');
    }

    function stopSession(message) {
      running = false;
      if (timer) { clearInterval(timer); timer = null; }
      toggleBtn.textContent = 'Start';
      cue.textContent = message || 'Bereit';
      count.textContent = '';
      remainingLabel.textContent = '';
      if (circle) circle.className = 'c-tool__breathe';
    }

    toggleBtn.addEventListener('click', function () {
      if (running) { stopSession(); return; }
      running = true;
      startedAt = Date.now();
      toggleBtn.textContent = 'Beenden';
      setPhase('ein');
      timer = setInterval(tick, 200);
    });
  }

  /* ---------------------------------------------------------
     Meilensteine & Grenzsteine
     --------------------------------------------------------- */
  function buildMeilensteine(root, spec, body) {
    var prefs = readPrefs();
    body.innerHTML =
      '<form class="c-tool__form">' +
      field('Geburtsdatum', '<input type="date" data-in="birthdate">') +
      field('Schwangerschaftswoche bei Geburt (nur bei Frühgeburt)', '<input type="number" min="22" max="' + spec.fullTermWeeks + '" step="1" data-in="gestweek">') +
      '</form>' +
      '<div class="c-tool__checkgroup" data-out="checklist"></div>' +
      '<div class="c-tool__result" data-out="result" aria-live="polite"></div>' +
      '<p class="c-tool__note"><strong>Immer ein Grund für zeitnahen Rat:</strong> ' + esc(spec.redFlag) + '</p>';

    var birthInput = body.querySelector('[data-in="birthdate"]');
    var gestInput = body.querySelector('[data-in="gestweek"]');
    var listOut = body.querySelector('[data-out="checklist"]');
    var out = body.querySelector('[data-out="result"]');
    if (prefs.birthdate) birthInput.value = prefs.birthdate;

    function ageMonthsFor(birth) {
      var gestWeek = Number(gestInput.value);
      var chronoMonths = monthsBetween(birth, today());
      if (gestWeek && gestWeek < spec.fullTermWeeks && chronoMonths < spec.correctUntilMonths) {
        var correctedBirth = addDays(birth, (spec.fullTermWeeks - gestWeek) * 7);
        return { months: Math.max(0, monthsBetween(correctedBirth, today())), corrected: true };
      }
      return { months: Math.max(0, chronoMonths), corrected: false };
    }

    function pickCheckpoint(months) {
      var upcoming = false;
      var cp = spec.checkpoints[0];
      if (months < cp.months) {
        upcoming = true;
      } else {
        for (var i = 0; i < spec.checkpoints.length; i++) {
          if (spec.checkpoints[i].months <= months) cp = spec.checkpoints[i];
        }
      }
      return { cp: cp, upcoming: upcoming };
    }

    function updateResult() {
      var boxes = listOut.querySelectorAll('input[type="checkbox"]');
      var allChecked = true;
      boxes.forEach(function (b) { if (!b.checked) allChecked = false; });
      if (!boxes.length) { out.innerHTML = ''; return; }
      if (allChecked) {
        out.innerHTML = '<p class="c-tool__outcome c-tool__outcome--tip"><strong>Alles davon zeigt dein Kind schon.</strong> Kein Anlass zur Sorge in diesem Bereich.</p>';
      } else {
        out.innerHTML = '<p class="c-tool__outcome c-tool__outcome--info"><strong>Noch nicht alles dabei.</strong> ' + esc(spec.followUp) + '</p>';
      }
    }

    function render() {
      var birth = parseISODate(birthInput.value);
      if (!birth) {
        listOut.innerHTML = '';
        out.innerHTML = '<p class="c-tool__hint">Geburtsdatum eingeben, um die passenden Grenzsteine zu zeigen.</p>';
        return;
      }
      var age = ageMonthsFor(birth);
      var picked = pickCheckpoint(age.months);
      var cp = picked.cp;
      var html = '<p class="c-tool__figure">Grenzsteine für <strong>' + esc(cp.label) + '</strong>' + (picked.upcoming ? ' (noch vor euch – als Vorschau)' : '') + '</p>';
      cp.domains.forEach(function (d) {
        html += '<p class="c-tool__group-title">' + esc(d.label) + '</p><ul class="c-tool__checklist">';
        d.items.forEach(function (item, i) {
          var id = 'ms-' + cp.months + '-' + d.key + '-' + i;
          html += '<li class="c-tool__check c-tool__check--lg"><input type="checkbox" id="' + id + '"><label for="' + id + '">' + esc(item) + '</label></li>';
        });
        html += '</ul>';
      });
      if (age.corrected) {
        html += '<p class="c-tool__note">Gerechnet mit korrigiertem Alter (' + age.months + ' Monate) wegen Frühgeburt.</p>';
      }
      listOut.innerHTML = html;
      listOut.querySelectorAll('input[type="checkbox"]').forEach(function (b) {
        b.addEventListener('change', updateResult);
      });
      updateResult();
    }

    birthInput.addEventListener('input', render);
    gestInput.addEventListener('input', render);
    render();
  }

  /* ---------------------------------------------------------
     Fieber-Check
     --------------------------------------------------------- */
  function buildFieberCheck(root, spec, body) {
    var prefs = readPrefs();
    var methodOptions = spec.methods.map(function (m) { return '<option value="' + esc(m.id) + '">' + esc(m.label) + '</option>'; }).join('');

    function checklistHtml(prefix, items, extraClass) {
      return items.map(function (text, i) {
        var id = prefix + '-' + i;
        return '<li class="c-tool__check c-tool__check--lg' + (extraClass ? ' ' + extraClass : '') + '"><input type="checkbox" id="' + id + '" data-flag="' + prefix + '"><label for="' + id + '">' + esc(text) + '</label></li>';
      }).join('');
    }

    body.innerHTML =
      '<div class="c-tool__result" data-out="result" aria-live="polite"></div>' +
      '<p class="c-tool__group-title c-tool__group-title--danger">Zuerst prüfen: eines davon dabei?</p>' +
      '<ul class="c-tool__checklist" data-out="red">' + checklistHtml('red', spec.redFlags) + '</ul>' +
      '<p class="c-tool__group-title">Weitere Anzeichen</p>' +
      '<ul class="c-tool__checklist" data-out="amber">' + checklistHtml('amber', spec.amberFlags) + '</ul>' +
      '<form class="c-tool__form">' +
      field('Geburtsdatum (optional, für das Alter)', '<input type="date" data-in="birthdate">') +
      field('Alter', '<span class="c-tool__slider"><input type="range" min="0" max="60" step="1" value="6" data-in="months"><output data-out="months-readout"></output></span>') +
      field('Temperatur in °C', '<input type="number" min="34" max="42" step="0.1" inputmode="decimal" data-in="temp">') +
      field('Messmethode', '<select data-in="method">' + methodOptions + '</select>') +
      '</form>' +
      '<p class="c-tool__note" data-out="methodnote"></p>' +
      '<p class="c-tool__note">' + esc(spec.always) + '</p>';

    var birthInput = body.querySelector('[data-in="birthdate"]');
    var monthsInput = body.querySelector('[data-in="months"]');
    var monthsReadout = body.querySelector('[data-out="months-readout"]');
    var tempInput = body.querySelector('[data-in="temp"]');
    var methodInput = body.querySelector('[data-in="method"]');
    var methodNote = body.querySelector('[data-out="methodnote"]');
    var out = body.querySelector('[data-out="result"]');
    if (prefs.birthdate) birthInput.value = prefs.birthdate;

    function syncFromBirth() {
      var birth = parseISODate(birthInput.value);
      if (!birth) return;
      var months = monthsBetween(birth, today());
      monthsInput.value = String(Math.max(0, Math.min(60, months)));
    }
    syncFromBirth();

    function anyChecked(sel) {
      var boxes = body.querySelectorAll(sel);
      var found = false;
      boxes.forEach(function (b) { if (b.checked) found = true; });
      return found;
    }

    function render() {
      monthsReadout.textContent = monthsInput.value + (monthsInput.value === '1' ? ' Monat' : ' Monate');
      methodNote.textContent = methodInput.value === 'rektal' ? '' : spec.methodNote;
      var months = Number(monthsInput.value);
      var temp = tempInput.value === '' ? null : Number(tempInput.value);
      var red = anyChecked('[data-flag="red"]');
      var amber = anyChecked('[data-flag="amber"]');
      var infantRule = false, ageRule = false;
      if (temp !== null && !isNaN(temp)) {
        if (months < spec.infantMaxMonths && temp >= spec.infantMinTemp) infantRule = true;
        if (months >= spec.youngMinMonths && months <= spec.youngMaxMonths && temp >= spec.youngMinTemp) ageRule = true;
      }
      var outcome, variant;
      if (red) {
        outcome = spec.outcomes.emergency;
        variant = 'danger';
      } else if (infantRule) {
        /* Unter 3 Monaten nicht bis zum Abend warten – sofort abklären. */
        outcome = spec.outcomes.infant;
        variant = 'warn';
      } else if (amber || ageRule) {
        outcome = spec.outcomes.today;
        variant = 'warn';
      } else {
        outcome = spec.outcomes.home;
        variant = 'info';
      }
      out.innerHTML = '<p class="c-tool__outcome c-tool__outcome--' + variant + '"><strong>' + esc(outcome.title) + '</strong><br>' + esc(outcome.text) + '</p>';
      if (temp === null || isNaN(temp)) {
        out.innerHTML += '<p class="c-tool__hint">Temperatur eingeben, um die Alters-/Temperaturregel mit einzubeziehen. Rote Warnzeichen zählen auch ohne Temperaturangabe.</p>';
      }
    }

    body.querySelectorAll('[data-flag]').forEach(function (b) { b.addEventListener('change', render); });
    birthInput.addEventListener('input', function () { syncFromBirth(); render(); });
    monthsInput.addEventListener('input', render);
    tempInput.addEventListener('input', render);
    methodInput.addEventListener('change', render);
    render();
  }

  /* ---------------------------------------------------------
     Wachfenster
     --------------------------------------------------------- */
  function parseTimeMinutes(v) {
    if (!v) return null;
    var p = v.split(':');
    if (p.length !== 2) return null;
    var h = Number(p[0]), m = Number(p[1]);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
  }

  function formatMinutesClock(mins) {
    mins = Math.round(mins);
    mins = ((mins % 1440) + 1440) % 1440;
    var h = Math.floor(mins / 60), m = mins % 60;
    return pad2(h) + ':' + pad2(m);
  }

  function buildWachfenster(root, spec, body) {
    var prefs = readPrefs();
    body.innerHTML =
      '<form class="c-tool__form">' +
      field('Geburtsdatum (optional)', '<input type="date" data-in="birthdate">') +
      field('Alter', '<span class="c-tool__slider"><input type="range" min="4" max="71" step="1" value="6" data-in="months"><output data-out="months-readout"></output></span>') +
      field('Aufwachzeit am Morgen', '<input type="time" data-in="wake" value="07:00">') +
      '</form>' +
      '<p class="c-tool__hint">' + esc(spec.disclaimer) + '</p>' +
      '<div class="c-tool__result" data-out="result" aria-live="polite"></div>';

    var birthInput = body.querySelector('[data-in="birthdate"]');
    var monthsInput = body.querySelector('[data-in="months"]');
    var wakeInput = body.querySelector('[data-in="wake"]');
    var monthsReadout = body.querySelector('[data-out="months-readout"]');
    var out = body.querySelector('[data-out="result"]');

    function syncFromBirth() {
      var birth = parseISODate(birthInput.value);
      if (!birth) return;
      var months = monthsBetween(birth, today());
      monthsInput.value = String(Math.max(4, Math.min(71, months)));
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

    function findRange(months) {
      for (var i = 0; i < spec.ranges.length; i++) {
        var r = spec.ranges[i];
        if (months >= r.fromMonths && months <= r.toMonths) return r;
      }
      return spec.ranges[spec.ranges.length - 1];
    }

    function render() {
      var months = Number(monthsInput.value);
      monthsReadout.textContent = describeMonths(months);
      var range = findRange(months);
      var html = '<p class="c-tool__figure">Übliches Wachfenster für ' + esc(range.label) + ': <strong>' +
        (range.minWake / 60) + '–' + (range.maxWake / 60) + ' Stunden</strong></p>';

      var wakeMin = parseTimeMinutes(wakeInput.value);
      if (wakeMin == null) {
        html += '<p class="c-tool__hint">Aufwachzeit eingeben, um Schläfchen und Bettzeit zu schätzen.</p>';
        out.innerHTML = html;
        return;
      }

      if (range.naps > 0) {
        var cur = wakeMin;
        var rows = '';
        for (var i = 0; i < range.naps; i++) {
          var startMin = cur + range.minWake;
          var startMax = cur + range.maxWake;
          rows += '<li>Schläfchen ' + (i + 1) + ': ca. ' + formatMinutesClock(startMin) + '–' + formatMinutesClock(startMax) + ' Uhr</li>';
          cur = cur + (range.minWake + range.maxWake) / 2 + (range.napMin + range.napMax) / 2;
        }
        var bedMin = cur + range.minWake;
        var bedMax = cur + range.maxWake;
        html += '<ul class="c-list c-list--bullet">' + rows + '</ul>';
        html += '<p class="c-tool__figure">Bettzeit: <strong>ca. ' + formatMinutesClock(bedMin) + '–' + formatMinutesClock(bedMax) + ' Uhr</strong></p>';
      } else {
        html += '<p class="c-tool__note">In diesem Alter ist meist kein Tagschlaf mehr üblich. Die Bettzeit richtet sich vor allem nach dem Abendritual, nicht mehr nach einem festen Wachfenster.</p>';
      }
      out.innerHTML = html;
    }

    birthInput.addEventListener('input', function () { syncFromBirth(); render(); });
    monthsInput.addEventListener('input', render);
    wakeInput.addEventListener('input', render);
    render();
  }

  /* ---------------------------------------------------------
     Mental Load
     --------------------------------------------------------- */
  function buildMentalLoad(root, spec, body) {
    var STORE_KEY = 'ew:tool:mental-load';
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); } catch (e) { saved = null; }
    saved = saved || {};
    var nameA = saved.nameA || spec.personADefault;
    var nameB = saved.nameB || spec.personBDefault;
    var assign = saved.assign || {};

    var rows = spec.tasks.map(function (t) {
      var val = assign[t.id] || 'a';
      return '<li class="c-tool__mlrow">' +
        '<span class="c-tool__mltext">' + esc(t.text) + '</span>' +
        '<select data-assign="' + esc(t.id) + '" aria-label="Zuständig für: ' + esc(t.text) + '">' +
        '<option value="a"' + (val === 'a' ? ' selected' : '') + '></option>' +
        '<option value="both"' + (val === 'both' ? ' selected' : '') + '>beide</option>' +
        '<option value="b"' + (val === 'b' ? ' selected' : '') + '></option>' +
        '</select></li>';
    }).join('');

    body.innerHTML =
      '<form class="c-tool__form">' +
      field('Name Person A', '<input type="text" data-in="namea" value="' + esc(nameA) + '" maxlength="30">') +
      field('Name Person B', '<input type="text" data-in="nameb" value="' + esc(nameB) + '" maxlength="30">') +
      '</form>' +
      '<ul class="c-tool__mllist">' + rows + '</ul>' +
      '<div class="c-tool__result" data-out aria-live="polite"></div>' +
      '<div class="c-tool__toolbar">' +
      '<button type="button" class="btn btn--ghost" data-save>Speichern</button>' +
      '</div>' +
      '<p class="c-tool__hint" data-saved-hint aria-live="polite"></p>';

    var nameAInput = body.querySelector('[data-in="namea"]');
    var nameBInput = body.querySelector('[data-in="nameb"]');
    var selects = body.querySelectorAll('[data-assign]');
    var out = body.querySelector('[data-out]');
    var saveBtn = body.querySelector('[data-save]');
    var savedHint = body.querySelector('[data-saved-hint]');

    function currentAssign() {
      var a = {};
      selects.forEach(function (s) { a[s.getAttribute('data-assign')] = s.value; });
      return a;
    }

    function updateSelectLabels() {
      var a = nameAInput.value || spec.personADefault;
      var b = nameBInput.value || spec.personBDefault;
      selects.forEach(function (s) {
        s.options[0].textContent = a;
        s.options[2].textContent = b;
      });
    }

    function bar(labelText, cA, cB, cBoth) {
      var total = cA + cB + cBoth || 1;
      var wA = (cA / total) * 100, wB = (cB / total) * 100, wBoth = (cBoth / total) * 100;
      var nameAv = esc(nameAInput.value || spec.personADefault);
      var nameBv = esc(nameBInput.value || spec.personBDefault);
      return '<div class="c-tool__splitbar">' +
        '<p class="c-tool__splitbar-label">' + esc(labelText) + '</p>' +
        '<div class="c-tool__splitbar-track">' +
        (wA ? '<span class="c-tool__splitbar-seg c-tool__splitbar-seg--a" style="width:' + wA + '%"></span>' : '') +
        (wBoth ? '<span class="c-tool__splitbar-seg c-tool__splitbar-seg--both" style="width:' + wBoth + '%"></span>' : '') +
        (wB ? '<span class="c-tool__splitbar-seg c-tool__splitbar-seg--b" style="width:' + wB + '%"></span>' : '') +
        '</div>' +
        '<p class="c-tool__note">' + nameAv + ': ' + cA + ' · beide: ' + cBoth + ' · ' + nameBv + ': ' + cB + '</p>' +
        '</div>';
    }

    function render() {
      updateSelectLabels();
      var a = currentAssign();
      var planA = 0, planB = 0, planBoth = 0, doA = 0, doB = 0, doBoth = 0;
      spec.tasks.forEach(function (t) {
        var v = a[t.id] || 'a';
        if (t.kind === 'plan') {
          if (v === 'a') planA++; else if (v === 'b') planB++; else planBoth++;
        } else {
          if (v === 'a') doA++; else if (v === 'b') doB++; else doBoth++;
        }
      });
      var nameAv = esc(nameAInput.value || spec.personADefault);
      var nameBv = esc(nameBInput.value || spec.personBDefault);
      var totalA = planA + doA, totalB = planB + doB, totalBoth = planBoth + doBoth;

      var html = bar('Planen & Denken', planA, planB, planBoth) + bar('Erledigen', doA, doB, doBoth);
      html += '<p class="c-tool__figure">Gesamt: ' + nameAv + ' ' + totalA + ' · beide ' + totalBoth + ' · ' + nameBv + ' ' + totalB + ' von ' + spec.tasks.length + ' Aufgaben</p>';
      out.innerHTML = html;
    }

    nameAInput.addEventListener('input', render);
    nameBInput.addEventListener('input', render);
    selects.forEach(function (s) { s.addEventListener('change', render); });
    saveBtn.addEventListener('click', function () {
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify({ nameA: nameAInput.value, nameB: nameBInput.value, assign: currentAssign() }));
        savedHint.textContent = 'Gespeichert auf diesem Gerät.';
      } catch (e) {
        savedHint.textContent = 'Speichern hat nicht geklappt.';
      }
    });

    render();
  }

  /* ---------------------------------------------------------
     Taschengeld
     --------------------------------------------------------- */
  function buildTaschengeld(root, spec, body) {
    var prefs = readPrefs();
    body.innerHTML =
      '<form class="c-tool__form">' +
      field('Geburtsdatum (optional)', '<input type="date" data-in="birthdate">') +
      field('Alter in Jahren', '<span class="c-tool__slider"><input type="range" min="4" max="17" step="1" value="8" data-in="years"><output data-out="years-readout"></output></span>') +
      '</form>' +
      '<div class="c-tool__result" data-out="result" aria-live="polite"></div>';

    var birthInput = body.querySelector('[data-in="birthdate"]');
    var yearsInput = body.querySelector('[data-in="years"]');
    var readout = body.querySelector('[data-out="years-readout"]');
    var out = body.querySelector('[data-out="result"]');

    function syncFromBirth() {
      var birth = parseISODate(birthInput.value);
      if (!birth) return;
      var years = Math.floor(monthsBetween(birth, today()) / 12);
      yearsInput.value = String(Math.max(4, Math.min(17, years)));
    }

    if (prefs.birthdate) {
      birthInput.value = prefs.birthdate;
      syncFromBirth();
    }

    function findRange(years) {
      for (var i = 0; i < spec.ranges.length; i++) {
        var r = spec.ranges[i];
        if (years >= r.fromYears && years <= r.toYears) return r;
      }
      return null;
    }

    function render() {
      var years = Number(yearsInput.value);
      readout.textContent = years + ' Jahre';
      var range = findRange(years);
      if (!range) {
        out.innerHTML = '<p class="c-tool__hint">Für dieses Alter gibt es in der Tabelle keinen Richtwert.</p>';
        return;
      }
      var rhythm = range.unit === 'week' ? 'pro Woche' : 'pro Monat';
      out.innerHTML = '<p class="c-tool__figure">Richtwert: <strong>' + esc(range.display) + '</strong> ' + rhythm + '</p>';
    }

    birthInput.addEventListener('input', function () { syncFromBirth(); render(); });
    yearsInput.addEventListener('input', render);
    render();
  }

  /* ---------------------------------------------------------
     Kinderkrankentage
     --------------------------------------------------------- */
  function buildKinderkrankentage(root, spec, body) {
    var STORE_KEY = 'ew:tool:kinderkrankentage-' + spec.year;
    var usedSaved = 0;
    try { usedSaved = Number(localStorage.getItem(STORE_KEY)) || 0; } catch (e) { usedSaved = 0; }

    body.innerHTML =
      '<form class="c-tool__form">' +
      field('Anzahl Kinder', '<input type="number" min="1" max="6" step="1" value="1" data-in="children">') +
      '<label class="c-tool__check"><input type="checkbox" data-in="alone"><span>Alleinerziehend</span></label>' +
      field('Bereits genutzte Tage in ' + spec.year, '<input type="number" min="0" step="1" value="' + usedSaved + '" data-in="used">') +
      '</form>' +
      '<div class="c-tool__result" data-out aria-live="polite"></div>';

    var childrenInput = body.querySelector('[data-in="children"]');
    var aloneInput = body.querySelector('[data-in="alone"]');
    var usedInput = body.querySelector('[data-in="used"]');
    var out = body.querySelector('[data-out]');

    function render() {
      var children = Math.max(1, Number(childrenInput.value) || 1);
      var alone = aloneInput.checked;
      var perChild = alone ? spec.perChildAlone : spec.perChildNormal;
      var maxYear = alone ? spec.maxYearAlone : spec.maxYearNormal;
      var entitlement = Math.min(children * perChild, maxYear);
      var used = Math.max(0, Number(usedInput.value) || 0);
      try { localStorage.setItem(STORE_KEY, String(used)); } catch (e) {}
      var remaining = Math.max(0, entitlement - used);
      out.innerHTML = '<p class="c-tool__figure">Anspruch ' + spec.year + ': <strong>' + entitlement + ' Arbeitstage</strong></p>' +
        '<p class="c-tool__note">' + perChild + ' Tage je Kind, höchstens ' + maxYear + ' Tage im Jahr insgesamt.</p>' +
        '<p class="c-tool__figure">Davon verbraucht: ' + used + ' · verbleibend: <strong>' + remaining + ' Tage</strong></p>';
    }

    childrenInput.addEventListener('input', render);
    aloneInput.addEventListener('change', render);
    usedInput.addEventListener('input', render);
    render();
  }

  /* ---------------------------------------------------------
     Routinekarten
     --------------------------------------------------------- */
  var ROUTINE_CHEVRON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">' +
    '<path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

  function buildRoutinekarten(root, spec, body) {
    var mode = 'morgen';
    var customCount = 0;
    var state = {
      morgen: spec.steps.morgen.map(function (s) { return { id: s.id, text: s.text, on: true }; }),
      abend: spec.steps.abend.map(function (s) { return { id: s.id, text: s.text, on: true }; }),
    };

    body.innerHTML =
      '<div class="segmented" role="group" aria-label="Tageszeit">' +
      '<button type="button" data-mode="morgen" aria-pressed="true">Morgen</button>' +
      '<button type="button" data-mode="abend" aria-pressed="false">Abend</button>' +
      '</div>' +
      '<ul class="c-tool__routine-list" data-list></ul>' +
      '<form class="c-tool__form">' +
      field('Eigener Schritt', '<span class="c-tool__routine-add"><input type="text" data-in="custom" maxlength="40" placeholder="z. B. Rucksack packen"><button type="button" class="btn btn--ghost" data-add>Hinzufügen</button></span>') +
      '</form>' +
      '<div class="c-routine-cards-preview" data-cards aria-live="polite"></div>' +
      '<div class="c-tool__toolbar">' +
      '<button type="button" class="btn btn--primary" data-print>Drucken</button>' +
      '</div>';

    var list = body.querySelector('[data-list]');
    var cardsOut = body.querySelector('[data-cards]');
    var customInput = body.querySelector('[data-in="custom"]');
    var addBtn = body.querySelector('[data-add]');
    var printBtn = body.querySelector('[data-print]');
    var modeButtons = body.querySelectorAll('[data-mode]');

    function renderCards() {
      var items = state[mode].filter(function (item) { return item.on; });
      if (!items.length) {
        cardsOut.innerHTML = '<p class="c-tool__hint">Mindestens einen Schritt auswählen, um Karten anzuzeigen.</p>';
        return;
      }
      var cards = items.map(function (item, i) {
        return '<li class="c-routine-card"><span class="c-routine-card__num" aria-hidden="true">' + (i + 1) + '</span>' +
          '<span class="c-routine-card__text">' + esc(item.text) + '</span></li>';
      }).join('');
      cardsOut.innerHTML = '<h4 class="c-routine-print__title">' + (mode === 'morgen' ? 'Morgenroutine' : 'Abendroutine') + '</h4>' +
        '<ol class="c-routine-cards">' + cards + '</ol>';
    }

    function renderList() {
      var items = state[mode];
      list.innerHTML = items.map(function (item, i) {
        return '<li class="c-tool__routine-item" data-id="' + esc(item.id) + '">' +
          '<label class="c-tool__check"><input type="checkbox" data-toggle' + (item.on ? ' checked' : '') + '><span>' + esc(item.text) + '</span></label>' +
          '<span class="c-tool__routine-move">' +
          '<button type="button" class="c-tool__iconbtn c-tool__iconbtn--up" data-move="up"' + (i === 0 ? ' disabled' : '') + ' aria-label="' + esc(item.text) + ' nach oben verschieben">' + ROUTINE_CHEVRON + '</button>' +
          '<button type="button" class="c-tool__iconbtn" data-move="down"' + (i === items.length - 1 ? ' disabled' : '') + ' aria-label="' + esc(item.text) + ' nach unten verschieben">' + ROUTINE_CHEVRON + '</button>' +
          '</span></li>';
      }).join('');
      renderCards();
    }

    list.addEventListener('change', function (e) {
      var t = e.target;
      if (!t.matches('[data-toggle]')) return;
      var li = t.closest('[data-id]');
      var id = li.getAttribute('data-id');
      var item = state[mode].filter(function (x) { return x.id === id; })[0];
      if (item) item.on = t.checked;
      renderCards();
    });

    list.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-move]');
      if (!btn) return;
      var li = btn.closest('[data-id]');
      var id = li.getAttribute('data-id');
      var items = state[mode];
      var idx = -1;
      for (var i = 0; i < items.length; i++) { if (items[i].id === id) { idx = i; break; } }
      if (idx === -1) return;
      var dir = btn.getAttribute('data-move') === 'up' ? -1 : 1;
      var swapWith = idx + dir;
      if (swapWith < 0 || swapWith >= items.length) return;
      var tmp = items[idx];
      items[idx] = items[swapWith];
      items[swapWith] = tmp;
      renderList();
    });

    addBtn.addEventListener('click', function () {
      var text = (customInput.value || '').trim();
      if (!text) return;
      customCount++;
      state[mode].push({ id: 'custom-' + mode + '-' + customCount, text: text, on: true });
      customInput.value = '';
      renderList();
    });

    modeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        mode = btn.getAttribute('data-mode');
        modeButtons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        renderList();
      });
    });

    printBtn.addEventListener('click', function () {
      /* Statt den Rest der Seite nur unsichtbar zu machen (visibility),
         wird eine eigene Druckfläche erzeugt und außerhalb des Artikels
         eingehängt – so bleibt die gedruckte Seite genau eine Seite lang,
         statt lange Leerseiten aus dem restlichen Layout zu erben. */
      var overlay = document.getElementById('ew-print-routine');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'ew-print-routine';
        document.body.appendChild(overlay);
      }
      var items = state[mode].filter(function (item) { return item.on; });
      var cards = items.map(function (item, i) {
        return '<li class="c-routine-card"><span class="c-routine-card__num" aria-hidden="true">' + (i + 1) + '</span>' +
          '<span class="c-routine-card__text">' + esc(item.text) + '</span></li>';
      }).join('');
      overlay.innerHTML = '<h1 class="c-routine-print__title">' + (mode === 'morgen' ? 'Morgenroutine' : 'Abendroutine') + '</h1>' +
        '<ol class="c-routine-cards">' + cards + '</ol>';
      document.documentElement.classList.add('print-routine');
      window.print();
    });

    window.addEventListener('afterprint', function () {
      document.documentElement.classList.remove('print-routine');
    });

    renderList();
  }

  var BUILDERS = {
    'u-termine': buildUTermine,
    schlafbedarf: buildSchlafbedarf,
    'korrigiertes-alter': buildKorrigiertesAlter,
    mutterschutz: buildMutterschutz,
    schwangerschaftswoche: buildSchwangerschaftswoche,
    'beikost-fenster': buildBeikostFenster,
    'wehen-timer': buildWehenTimer,
    protokoll: buildProtokoll,
    'zahnputz-timer': buildZahnputzTimer,
    atemuebung: buildAtemuebung,
    meilensteine: buildMeilensteine,
    'fieber-check': buildFieberCheck,
    wachfenster: buildWachfenster,
    'mental-load': buildMentalLoad,
    taschengeld: buildTaschengeld,
    kinderkrankentage: buildKinderkrankentage,
    routinekarten: buildRoutinekarten,
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
