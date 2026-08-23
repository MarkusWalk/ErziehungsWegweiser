/* Interaktive Rechner.
   Werden erst geladen, wenn sie in Sichtweite kommen (siehe app.js),
   genau wie die three.js-Szenen in scenes.js. Jeder Rechner ist rein
   ergänzend - der Fallback-Text im Markup bleibt bis zum erfolgreichen
   Mount stehen (siehe blocks.mjs' calc()-Renderer).

   Alle Berechnungen laufen ausschließlich im Browser. Es wird nichts
   irgendwohin gesendet, und nichts wird über eine Sitzung hinaus
   gespeichert außer dem ohnehin schon vorhandenen "ew:prefs"-Geburts-
   datum, das app.js verwaltet - Rechner lesen es nur, sie schreiben es
   nicht. */

const registry = {};

export function mountAll(nodes) {
  nodes.forEach((node) => mount(node));
}

function mount(node) {
  const kind = node.getAttribute('data-calc');
  const build = registry[kind];
  const body = node.querySelector('[data-calc-body]');
  if (!build || !body) return;

  let options = {};
  try {
    options = JSON.parse(node.getAttribute('data-calc-options') || '{}');
  } catch (e) {
    options = {};
  }

  body.innerHTML = '';
  build(body, options);
  body.classList.add('is-mounted');
}

/* ---------------------------------------------------------------
   Gemeinsame Helfer
   --------------------------------------------------------------- */

/* Liest das in den Einstellungen hinterlegte Geburtsdatum, ohne app.js'
   internen Zustand anzufassen - Rechner sind unabhängig lauffähig, auch
   auf Seiten ohne den Einstellungen-Dialog. */
function savedBirthdate() {
  try {
    const prefs = JSON.parse(localStorage.getItem('ew:prefs') || '{}');
    return prefs.birthdate || '';
  } catch (e) {
    return '';
  }
}

function fmtDate(date) {
  return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function daysBetween(a, b) {
  return Math.round((b.setHours(0, 0, 0, 0) - a.setHours(0, 0, 0, 0)) / 86400000);
}

function field(labelText, inputHtml) {
  const wrap = document.createElement('div');
  wrap.className = 'field';
  const label = document.createElement('label');
  label.textContent = labelText;
  wrap.appendChild(label);
  wrap.insertAdjacentHTML('beforeend', inputHtml);
  return wrap;
}

/* ---------------------------------------------------------------
   Geburtstermin-Rechner (Naegele-Regel)
   --------------------------------------------------------------- */
registry['due-date'] = function (body, options) {
  const form = document.createElement('div');
  form.className = 'c-calc__form';

  const lmpId = 'calc-lmp-' + Math.random().toString(36).slice(2, 8);
  const cycleId = 'calc-cycle-' + Math.random().toString(36).slice(2, 8);

  const lmpField = field('Erster Tag der letzten Periode', `<input type="date" id="${lmpId}" data-lmp>`);
  lmpField.querySelector('label').htmlFor = lmpId;

  const cycleField = field('Zykluslänge in Tagen (falls bekannt)', `<input type="number" id="${cycleId}" data-cycle min="20" max="45" value="28">`);
  cycleField.querySelector('label').htmlFor = cycleId;

  form.appendChild(lmpField);
  form.appendChild(cycleField);

  const output = document.createElement('div');
  output.className = 'c-calc__output';
  output.setAttribute('aria-live', 'polite');

  body.appendChild(form);
  body.appendChild(output);

  const lmpInput = form.querySelector('[data-lmp]');
  const cycleInput = form.querySelector('[data-cycle]');

  function render() {
    if (!lmpInput.value) {
      output.innerHTML = '<p class="c-calc__hint">Datum eingeben, um den errechneten Termin zu sehen.</p>';
      return;
    }
    const lmp = new Date(lmpInput.value);
    if (isNaN(lmp)) { output.innerHTML = ''; return; }

    const cycle = Number(cycleInput.value) || 28;
    const due = addDays(lmp, 280 + (cycle - 28));
    const today = new Date();
    const daysPregnant = daysBetween(new Date(lmp), new Date(today));

    let progressLine = '';
    if (daysPregnant >= 0 && daysPregnant <= 300) {
      const week = Math.floor(daysPregnant / 7);
      const day = daysPregnant % 7;
      progressLine = `<p class="c-calc__note">Heute: <strong>${week}. Woche${day ? ' + ' + day + ' Tag' + (day > 1 ? 'e' : '') : ''}</strong> nach dieser Rechnung.</p>`;
    }

    output.innerHTML = `
      <p class="c-calc__result"><span>Errechneter Geburtstermin</span><strong>${fmtDate(due)}</strong></p>
      ${progressLine}
    `;
  }

  lmpInput.addEventListener('input', render);
  cycleInput.addEventListener('input', render);
  render();
};

/* ---------------------------------------------------------------
   Alters-Zeitplan (U-Untersuchungen, Impfkalender, Meilensteine, ...)
   options: { unit: 'months'|'weeks', events: [{ at, label, note? }],
              windowBefore?, windowAfter? } (Fenstergröße in derselben
              Einheit, in der "erledigt/fällig/kommt noch" markiert wird)
   --------------------------------------------------------------- */
registry['age-schedule'] = function (body, options) {
  const events = Array.isArray(options.events) ? options.events : [];
  const unit = options.unit === 'weeks' ? 'weeks' : 'months';
  const unitDays = unit === 'weeks' ? 7 : 30.4375;
  const windowDays = (options.windowBefore ?? 2) * unitDays;

  const form = document.createElement('div');
  form.className = 'c-calc__form';
  const inputId = 'calc-birth-' + Math.random().toString(36).slice(2, 8);
  const birthField = field(options.inputLabel || 'Geburtsdatum deines Kindes', `<input type="date" id="${inputId}" data-birth>`);
  birthField.querySelector('label').htmlFor = inputId;
  form.appendChild(birthField);

  const output = document.createElement('div');
  output.className = 'c-calc__output';
  output.setAttribute('aria-live', 'polite');

  body.appendChild(form);
  body.appendChild(output);

  const birthInput = form.querySelector('[data-birth]');
  const saved = savedBirthdate();
  if (saved) birthInput.value = saved;

  function render() {
    if (!birthInput.value || !events.length) {
      output.innerHTML = '<p class="c-calc__hint">Geburtsdatum eingeben, um die eigene Zeitleiste zu sehen.</p>';
      return;
    }
    const birth = new Date(birthInput.value);
    if (isNaN(birth)) { output.innerHTML = ''; return; }
    const today = new Date();

    const rows = events.map((e) => {
      const target = addDays(birth, Math.round(e.at * unitDays));
      const diff = daysBetween(new Date(today), new Date(target));
      let status = 'upcoming';
      let statusLabel = 'kommt noch';
      if (diff < -windowDays) { status = 'done'; statusLabel = 'erledigt'; }
      else if (diff <= windowDays) { status = 'due'; statusLabel = 'jetzt fällig'; }
      return `
        <li class="c-calc__row c-calc__row--${status}">
          <span class="c-calc__row-label">${escapeHtml(e.label)}</span>
          <span class="c-calc__row-date">${fmtDate(target)}</span>
          <span class="c-calc__row-status">${statusLabel}</span>
          ${e.note ? `<span class="c-calc__row-note">${escapeHtml(e.note)}</span>` : ''}
        </li>`;
    }).join('');

    output.innerHTML = `<ul class="c-calc__list">${rows}</ul>`;
  }

  birthInput.addEventListener('input', render);
  render();
};

/* ---------------------------------------------------------------
   Alters-Bereichs-Nachschlage (Schlafbedarf, Bildschirmzeit, Taschengeld, ...)
   options: { unit: 'months'|'years', inputLabel?, resultLabel?,
              ranges: [{ from, to, label }] }
   --------------------------------------------------------------- */
registry['age-range-lookup'] = function (body, options) {
  const ranges = Array.isArray(options.ranges) ? options.ranges : [];
  const unit = options.unit === 'months' ? 'months' : 'years';
  const unitLabel = unit === 'months' ? 'Monate' : 'Jahre';

  const form = document.createElement('div');
  form.className = 'c-calc__form';
  const inputId = 'calc-age-' + Math.random().toString(36).slice(2, 8);
  const ageField = field(options.inputLabel || `Alter deines Kindes (${unitLabel})`, `<input type="number" id="${inputId}" data-age min="0" step="1">`);
  ageField.querySelector('label').htmlFor = inputId;
  form.appendChild(ageField);

  const output = document.createElement('div');
  output.className = 'c-calc__output';
  output.setAttribute('aria-live', 'polite');

  body.appendChild(form);
  body.appendChild(output);

  const ageInput = form.querySelector('[data-age]');
  const saved = savedBirthdate();
  if (saved) {
    const birth = new Date(saved);
    if (!isNaN(birth)) {
      const days = daysBetween(new Date(birth), new Date());
      if (days >= 0) ageInput.value = unit === 'months' ? Math.floor(days / 30.4375) : Math.floor(days / 365.25);
    }
  }

  function render() {
    const table = ranges.map((r) => {
      const active = ageInput.value !== '' && Number(ageInput.value) >= r.from && Number(ageInput.value) < (r.to ?? Infinity);
      const toLabel = r.to === undefined || r.to === null ? '+' : `–${r.to}`;
      return `
        <li class="c-calc__row${active ? ' c-calc__row--active' : ''}">
          <span class="c-calc__row-label">${r.from}${toLabel} ${unitLabel}</span>
          <span class="c-calc__row-date">${escapeHtml(r.label)}</span>
        </li>`;
    }).join('');

    output.innerHTML = `<ul class="c-calc__list c-calc__list--lookup">${table}</ul>`;
  }

  ageInput.addEventListener('input', render);
  render();
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
