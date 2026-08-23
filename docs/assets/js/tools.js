/* Praktische Werkzeuge ohne Berechnung: Timer, Zähler, Atemführung,
   Zufallsauswahl. Laufen während einer Aktivität mit, statt aus einer
   Eingabe ein Ergebnis zu errechnen (das macht calculators.js). Werden
   nachgeladen wie Rechner und Szenen - siehe app.js. */

const registry = {};

export function mountAll(nodes) {
  nodes.forEach((node) => mount(node));
}

function mount(node) {
  const kind = node.getAttribute('data-tool');
  const build = registry[kind];
  const body = node.querySelector('[data-tool-body]');
  if (!build || !body) return;

  let options = {};
  try {
    options = JSON.parse(node.getAttribute('data-tool-options') || '{}');
  } catch (e) {
    options = {};
  }
  const id = node.getAttribute('data-tool-id') || kind;

  body.innerHTML = '';
  build(body, options, id);
  body.classList.add('is-mounted');
}

/* ---------------------------------------------------------------
   Gemeinsame Helfer
   --------------------------------------------------------------- */
function storageKey(id) {
  return 'ew:tool:' + location.pathname + ':' + id;
}

function loadState(id, fallback) {
  try {
    const raw = localStorage.getItem(storageKey(id));
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveState(id, state) {
  try {
    localStorage.setItem(storageKey(id), JSON.stringify(state));
  } catch (e) {
    /* privater Modus o. ä. - Werkzeug bleibt innerhalb der Sitzung nutzbar */
  }
}

function fmtClock(seconds) {
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return m + ':' + String(rest).padStart(2, '0');
}

function fmtDuration(seconds) {
  const s = Math.max(0, Math.round(seconds));
  if (s < 60) return s + ' Sek.';
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return rest ? `${m} Min. ${rest} Sek.` : `${m} Min.`;
}

function button(label, cls) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = cls || 'btn btn--primary';
  b.textContent = label;
  return b;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------------------
   Intervall-Timer (Wehen, Stillzeiten, ...)
   options: { tags?: string[], note? }
   --------------------------------------------------------------- */
registry['interval-timer'] = function (body, options, id) {
  const state = loadState(id, { running: false, tag: null, startedAt: null, log: [] });

  const controls = document.createElement('div');
  controls.className = 'c-tool__controls';
  const liveOut = document.createElement('p');
  liveOut.className = 'c-tool__live';
  liveOut.setAttribute('aria-live', 'polite');
  const logEl = document.createElement('ul');
  logEl.className = 'c-calc__list';

  body.appendChild(controls);
  body.appendChild(liveOut);
  body.appendChild(logEl);

  let ticker = null;

  function stopTicking() {
    if (ticker) { clearInterval(ticker); ticker = null; }
  }

  function renderLog() {
    logEl.innerHTML = state.log.slice().reverse().slice(0, 12).map((entry, i, arr) => {
      const idx = state.log.length - i; // 1-based, chronological
      const prev = state.log[idx - 2];
      const gap = prev ? `<span class="c-calc__row-note">Abstand zur vorherigen (Beginn–Beginn): ${fmtDuration((entry.start - prev.start) / 1000)}</span>` : '';
      return `
        <li class="c-calc__row">
          <span class="c-calc__row-label">${entry.tag ? escapeHtml(entry.tag) + ' · ' : ''}#${idx}</span>
          <span class="c-calc__row-date">${fmtDuration((entry.end - entry.start) / 1000)}</span>
          ${gap}
        </li>`;
    }).join('') || '<li class="c-calc__row"><span class="c-calc__row-label c-calc__hint">Noch keine Einträge.</span></li>';
  }

  function renderControls() {
    controls.innerHTML = '';
    if (state.running) {
      liveOut.hidden = false;
      const stop = button('Stopp' + (state.tag ? ' · ' + state.tag : ''), 'btn btn--primary');
      stop.addEventListener('click', () => {
        const end = Date.now();
        state.log.push({ tag: state.tag, start: state.startedAt, end });
        state.running = false;
        state.tag = null;
        state.startedAt = null;
        saveState(id, state);
        stopTicking();
        renderControls();
        renderLog();
      });
      controls.appendChild(stop);
      tick();
      ticker = setInterval(tick, 1000);
    } else {
      liveOut.hidden = true;
      const tags = options.tags && options.tags.length ? options.tags : [null];
      tags.forEach((tag) => {
        const start = button(tag ? 'Start · ' + tag : 'Start', 'btn btn--primary');
        start.addEventListener('click', () => {
          state.running = true;
          state.tag = tag;
          state.startedAt = Date.now();
          saveState(id, state);
          renderControls();
        });
        controls.appendChild(start);
      });
      if (state.log.length) {
        const reset = button('Verlauf löschen', 'btn btn--quiet');
        reset.addEventListener('click', () => {
          state.log = [];
          saveState(id, state);
          renderLog();
          renderControls();
        });
        controls.appendChild(reset);
      }
    }
  }

  function tick() {
    if (!state.running) return;
    liveOut.textContent = 'Läuft: ' + fmtClock((Date.now() - state.startedAt) / 1000);
  }

  renderControls();
  renderLog();
};

/* ---------------------------------------------------------------
   Zähler (Kindsbewegungen, Windelwechsel, ...)
   options: { buttons?: string[], note? }
   --------------------------------------------------------------- */
registry['tally-counter'] = function (body, options, id) {
  const names = options.buttons && options.buttons.length ? options.buttons : ['Zählen'];
  const state = loadState(id, { counts: {}, firstAt: {} });
  names.forEach((n) => { if (!(n in state.counts)) state.counts[n] = 0; });

  const controls = document.createElement('div');
  controls.className = 'c-tool__controls';
  const out = document.createElement('div');
  out.className = 'c-tool__output';
  out.setAttribute('aria-live', 'polite');

  body.appendChild(out);

  function render() {
    out.innerHTML = names.map((n) => {
      const count = state.counts[n] || 0;
      const since = state.firstAt[n] ? `<span class="c-calc__row-note">seit dem ersten Eintrag: ${fmtDuration((Date.now() - state.firstAt[n]) / 1000)}</span>` : '';
      return `
        <div class="c-tool__count">
          <span class="c-tool__count-value">${count}</span>
          <span class="c-tool__count-label">${escapeHtml(n)}</span>
          ${since}
        </div>`;
    }).join('');
  }

  names.forEach((n) => {
    const b = button('+ ' + n, 'btn btn--primary');
    b.addEventListener('click', () => {
      state.counts[n] = (state.counts[n] || 0) + 1;
      if (!state.firstAt[n]) state.firstAt[n] = Date.now();
      saveState(id, state);
      render();
    });
    controls.appendChild(b);
  });
  const reset = button('Zurücksetzen', 'btn btn--quiet');
  reset.addEventListener('click', () => {
    state.counts = {}; state.firstAt = {};
    names.forEach((n) => { state.counts[n] = 0; });
    saveState(id, state);
    render();
  });
  controls.appendChild(reset);

  body.appendChild(controls);
  render();
};

/* ---------------------------------------------------------------
   Atem-Pacer
   options: { phases?: {label, seconds}[], cycles?: number }
   --------------------------------------------------------------- */
registry['breathing-pacer'] = function (body, options) {
  const phases = options.phases && options.phases.length
    ? options.phases
    : [{ label: 'Einatmen', seconds: 4 }, { label: 'Halten', seconds: 4 }, { label: 'Ausatmen', seconds: 4 }, { label: 'Halten', seconds: 4 }];

  const stage = document.createElement('div');
  stage.className = 'c-tool__breath-stage';
  const circle = document.createElement('div');
  circle.className = 'c-tool__breath-circle';
  const label = document.createElement('p');
  label.className = 'c-tool__breath-label';
  label.setAttribute('aria-live', 'polite');
  label.textContent = 'Bereit';
  stage.appendChild(circle);
  stage.appendChild(label);

  const controls = document.createElement('div');
  controls.className = 'c-tool__controls';
  const toggle = button('Start', 'btn btn--primary');
  controls.appendChild(toggle);

  body.appendChild(stage);
  body.appendChild(controls);

  let running = false;
  let timeoutId = null;
  let cycle = 0;

  function scaleFor(phaseLabel, index) {
    // Grobe, aber verlässliche Heuristik: "ein"-Phasen weiten, "aus"-Phasen
    // verengen, "halten" bleibt stehen - unabhängig von exakten Labeltexten.
    const lower = phaseLabel.toLowerCase();
    if (lower.indexOf('ein') === 0 || lower.indexOf('einat') !== -1) return 1.35;
    if (lower.indexOf('aus') === 0 || lower.indexOf('ausat') !== -1) return 0.75;
    return null; // halten: Größe unverändert lassen
  }

  function runPhase(i) {
    if (!running) return;
    const phase = phases[i % phases.length];
    label.textContent = phase.label;
    if (!reducedMotion) {
      const scale = scaleFor(phase.label, i);
      circle.style.transitionDuration = phase.seconds + 's';
      if (scale) circle.style.transform = 'scale(' + scale + ')';
    } else {
      label.textContent = phase.label + ' (' + phase.seconds + 's)';
    }
    timeoutId = setTimeout(() => {
      if (i % phases.length === phases.length - 1) {
        cycle++;
        if (options.cycles && cycle >= options.cycles) { stop(); return; }
      }
      runPhase(i + 1);
    }, phase.seconds * 1000);
  }

  function start() {
    running = true;
    cycle = 0;
    toggle.textContent = 'Stopp';
    runPhase(0);
  }

  function stop() {
    running = false;
    if (timeoutId) clearTimeout(timeoutId);
    toggle.textContent = 'Start';
    label.textContent = 'Bereit';
    circle.style.transform = 'scale(1)';
  }

  toggle.addEventListener('click', () => { running ? stop() : start(); });
};

/* ---------------------------------------------------------------
   Countdown
   options: { seconds?: number, presets?: number[], label?: string }
   --------------------------------------------------------------- */
registry['countdown'] = function (body, options) {
  const presets = options.presets && options.presets.length ? options.presets : [options.seconds || 300];

  const controls = document.createElement('div');
  controls.className = 'c-tool__controls';
  const display = document.createElement('p');
  display.className = 'c-tool__countdown';
  display.setAttribute('aria-live', 'polite');
  display.textContent = fmtClock(presets[0]);

  body.appendChild(display);
  body.appendChild(controls);

  let remaining = presets[0];
  let ticker = null;

  function render() {
    display.textContent = fmtClock(remaining);
    display.classList.toggle('c-tool__countdown--done', remaining <= 0);
  }

  function stopTick() { if (ticker) { clearInterval(ticker); ticker = null; } }

  function renderControls() {
    controls.innerHTML = '';
    if (ticker) {
      const pause = button('Pause', 'btn btn--ghost');
      pause.addEventListener('click', () => { stopTick(); renderControls(); });
      controls.appendChild(pause);
    } else {
      const start = button(remaining === presets[0] ? 'Start' : 'Weiter', 'btn btn--primary');
      start.addEventListener('click', () => {
        if (remaining <= 0) return;
        ticker = setInterval(() => {
          remaining -= 1;
          render();
          if (remaining <= 0) { stopTick(); renderControls(); }
        }, 1000);
        renderControls();
      });
      controls.appendChild(start);
    }
    if (presets.length > 1) {
      presets.forEach((p) => {
        const b = button(fmtClock(p), 'btn btn--quiet');
        b.addEventListener('click', () => { stopTick(); remaining = p; render(); renderControls(); });
        controls.appendChild(b);
      });
    } else {
      const reset = button('Zurücksetzen', 'btn btn--quiet');
      reset.addEventListener('click', () => { stopTick(); remaining = presets[0]; render(); renderControls(); });
      controls.appendChild(reset);
    }
  }

  render();
  renderControls();
};

/* ---------------------------------------------------------------
   Zufallsauswahl (Ideen-Los, Gesprächskarten, ...)
   options: { items: string[], buttonLabel? }
   --------------------------------------------------------------- */
registry['picker'] = function (body, options) {
  const items = options.items || [];
  const out = document.createElement('p');
  out.className = 'c-tool__pick';
  out.setAttribute('aria-live', 'polite');
  out.textContent = items.length ? 'Tippe, um zu starten.' : 'Keine Einträge hinterlegt.';

  const controls = document.createElement('div');
  controls.className = 'c-tool__controls';

  body.appendChild(out);
  body.appendChild(controls);
  if (!items.length) return;

  let last = -1;
  const draw = button(options.buttonLabel || 'Ziehen', 'btn btn--primary');
  draw.addEventListener('click', () => {
    let i = Math.floor(Math.random() * items.length);
    if (items.length > 1 && i === last) i = (i + 1) % items.length;
    last = i;
    out.textContent = items[i];
    draw.textContent = 'Nochmal';
  });
  controls.appendChild(draw);
};
