#!/usr/bin/env node
/* Extrahiert die benötigten Icons aus dem Sprite des Designsystems
   (site/assets/icons/icons.svg) nach build/icons.mjs.

   Warum inline statt <use href="datei.svg#id">: Safari löst externe
   Sprite-Referenzen nicht auf. Bei rund dreißig Icons ist Inlining
   ohnehin die kleinere Übertragung.

   Aufruf:  node build/extract-icons.mjs */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SPRITE = path.join(ROOT, 'site', 'assets', 'icons', 'icons.svg');
const OUT = path.join(ROOT, 'build', 'icons.mjs');

/* Genutzt in layout.mjs (Bedienelemente) und TOPIC_ICONS (Themenfelder). */
const NEEDED = [
  'search', 'close', 'menu', 'settings', 'arrow-right', 'arrow-down', 'clock', 'book',
  'alert', 'check-circle', 'chevron-down', 'external-link', 'sparkle', 'sprout',
  'users', 'cloud', 'leaf', 'trend-up', 'message', 'compass', 'shield', 'star',
  'presentation', 'network', 'sun', 'graduation-cap', 'lock', 'flag', 'lightbulb',
  'info', 'help',
];

const sprite = fs.readFileSync(SPRITE, 'utf8');
const symbols = new Map();
for (const [, id, body] of sprite.matchAll(/<symbol id="i-([a-z0-9-]+)"[^>]*>([\s\S]*?)<\/symbol>/g)) {
  symbols.set(id, body.replace(/\s+/g, ' ').trim());
}

const missing = NEEDED.filter((name) => !symbols.has(name));
if (missing.length) {
  console.error(`Fehlende Icons im Sprite: ${missing.join(', ')}`);
  process.exit(1);
}

const lines = [
  '/* Icons aus dem Designsystem (assets/icons/icons.svg).',
  '   Erzeugt von build/extract-icons.mjs – nicht von Hand bearbeiten.',
  '   24px-Raster, 1.75px Strich, runde Enden, keine Fuellungen. */',
  '',
  'export const ICONS = {',
  ...NEEDED.map((name) => `  ${JSON.stringify(name)}: ${JSON.stringify(symbols.get(name))},`),
  '};',
  '',
];

fs.writeFileSync(OUT, lines.join('\n'));
console.log(`${NEEDED.length} Icons → build/icons.mjs`);
