#!/usr/bin/env node
/* Prüft alle Quellen-URLs der Artikel auf Erreichbarkeit.

   Hintergrund: Die Artikel entstehen in einer Umgebung ohne freien
   Netzzugang; URLs stammen aus Suchergebnissen. Dieses Skript sollte
   deshalb einmal in einer Umgebung mit Internetzugang laufen, bevor
   die Seite veröffentlicht wird.

   Aufruf:  node build/check-links.mjs [--fix-report]

   Ergebnis: Konsolenausgabe plus content/link-report.json */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'content', 'articles');
const TIMEOUT = 15000;
const CONCURRENCY = 6;

const targets = [];
for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith('.json'))) {
  const article = JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8'));
  (article.sources || []).forEach((source, i) => {
    if (source.url) targets.push({ slug: article.slug, index: i + 1, title: source.title, url: source.url });
  });
}

console.log(`\n  ${targets.length} Quellen-URLs aus ${fs.readdirSync(DIR).length} Artikeln\n`);

const results = [];
let cursor = 0;

async function worker() {
  while (cursor < targets.length) {
    const target = targets[cursor++];
    const status = await probe(target.url);
    results.push({ ...target, status });
    const mark = status.ok ? 'ok   ' : 'PRÜFEN';
    console.log(`  ${mark} ${String(status.code).padStart(3)}  ${target.slug} [${target.index}]  ${target.url}`);
  }
}

async function probe(url) {
  for (const method of ['HEAD', 'GET']) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT);
      const response = await fetch(url, {
        method,
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ErziehungswegweiserLinkCheck/1.0)' },
      });
      clearTimeout(timer);
      /* Manche Server lehnen HEAD ab – dann noch einmal mit GET versuchen. */
      if (response.status === 405 && method === 'HEAD') continue;
      return { ok: response.status < 400, code: response.status };
    } catch (err) {
      if (method === 'GET') return { ok: false, code: 0, error: err.message };
    }
  }
  return { ok: false, code: 0 };
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const broken = results.filter((r) => !r.status.ok);

/* Wenn praktisch jede Anfrage denselben Fehler liefert, liegt es an der
   Umgebung und nicht an den Quellen. Dann ist der Lauf wertlos und darf
   nicht als Ergebnis missverstanden werden. */
const codes = new Map();
for (const r of results) codes.set(r.status.code, (codes.get(r.status.code) || 0) + 1);
const [dominantCode, dominantCount] = [...codes.entries()].sort((a, b) => b[1] - a[1])[0] || [];
const environmentBlocked = results.length > 20 && dominantCount / results.length > 0.95 && dominantCode !== 200;

fs.writeFileSync(
  path.join(ROOT, 'content', 'link-report.json'),
  JSON.stringify(
    { checked: results.length, broken: broken.length, environmentBlocked, dominantCode, entries: results },
    null,
    2,
  ),
);

console.log(`\n  ${results.length} geprüft · ${broken.length} auffällig`);

if (environmentBlocked) {
  console.log(`
  ABBRUCH: ${dominantCount} von ${results.length} Anfragen sind mit demselben
  Code (${dominantCode}) gescheitert. Das ist die Netzwerkumgebung, nicht die
  Quellenlage – ein Egress-Proxy oder eine Firewall blockt die Zielhosts.

  Der Bericht sagt in diesem Zustand nichts über die Quellen aus.
  Führ das Skript dort aus, wo ausgehende HTTPS-Verbindungen frei sind.\n`);
  process.exit(2);
}

if (broken.length) {
  console.log(`\n  Zu prüfen:`);
  for (const b of broken) console.log(`    ${b.slug} [${b.index}] ${b.url}`);
  console.log(`\n  Hinweis: Ein Fehlercode heißt nicht zwingend, dass die Quelle falsch ist –`);
  console.log(`  manche Server blocken automatisierte Anfragen. Von Hand gegenprüfen.`);
}
console.log(`\n  Bericht: content/link-report.json\n`);
process.exit(0);
