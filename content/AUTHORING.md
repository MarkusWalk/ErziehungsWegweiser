# Autorenleitfaden

Verbindlich für alle Artikel in `content/articles/`. Ein Artikel ist **eine JSON-Datei**,
benannt nach ihrem Slug: `content/articles/<slug>.json`.

---

## 1. Harte Regeln (Build bricht sonst)

1. **Gültiges JSON.** Vor dem Speichern gedanklich prüfen.
2. **Keine geraden Anführungszeichen im Text.** Deutsche Anführung: `„so“` (U+201E / U+201C).
   Ein gerades `"` im Fließtext zerstört die Datei.
3. **Pflichtfelder:** `slug`, `title`, `phases`, `topics`, `blocks`, `sources`, `summary`, `updated`.
4. **`slug`** nur `a–z`, `0–9`, `-`. Muss dem Dateinamen entsprechen.
5. **`phases`** nur aus: `schwangerschaft`, `neugeborenes`, `saeugling`, `kleinkind`,
   `kindergarten`, `schulkind`.
6. **`topics`** nur aus: `bindung`, `schlaf`, `ernaehrung`, `entwicklung`, `sprache`,
   `emotionen`, `erziehung`, `gesundheit`, `spiel`, `medien`, `familie`, `eltern`,
   `betreuung`, `sicherheit`, `besondere-situationen`.
7. **Mindestens 3 Quellen**, davon mindestens eine Leitlinie, Übersichtsarbeit oder
   Veröffentlichung einer öffentlichen Institution.

---

## 2. Haltung und Ton

- **Zielgruppe:** Eltern und werdende Eltern. Keine Fachkräfte-Artikel.
- **Du-Form.** „Dein Kind“, nicht „Ihr Kind“.
- **Übersetzen, nicht referieren.** Was heißt der Befund für den Alltag um 19 Uhr?
- **Keine Schuldzuweisung.** Kein „richtig/falsch“, wo mehrere Wege vertretbar sind.
- **Entlastung vor Optimierung.** Viele Eltern lesen erschöpft. Zuerst: was normal ist.
- **Unsicherheit benennen.** Wo die Forschung uneins ist, schreib das hin.
- **Keine Produktempfehlungen**, keine Marken, keine Affiliate-Logik.
- **Inklusiv:** „Eltern“ meint alle Betreuungspersonen. Bei körperlichen Vorgängen
  (Stillen, Wochenbett) ist die gebärende Person gemeint.
- Länge: **900–1600 Wörter** im Fließtext, 5–8 Abschnitte.

---

## 3. Aufbau eines Artikels

```
summary        Ein Absatz: das Wichtigste, auch isoliert verständlich.
keyFacts       3–6 Stichpunkte, je ein Satz.
blocks         Erst ein "p" mit lead:true, dann Abschnitte (section).
               Jeder Artikel enthält mindestens:
                 · 2 evidence-Blöcke
                 · 1 Visualisierung (figure oder timeline)
                 · 1 faq-Block mit 4–6 echten Elternfragen
                 · 1 callout mit praktischem Bezug
sources        3–7 Belege.
related        2–4 Slugs anderer Artikel (dürfen noch nicht existieren).
```

---

## 4. Blocktypen

```jsonc
{"type":"p","text":"…","lead":true}                       // lead optional, nur der erste

{"type":"section","heading":"…","blocks":[ … ]}           // Verschachtelung möglich

{"type":"list","ordered":false,"items":[
  "Einfacher Punkt",
  {"title":"Fetter Auftakt:","text":"Erläuterung."}
]}

{"type":"steps","title":"…","items":[{"title":"…","text":"…"}]}

{"type":"callout","variant":"info|tip|warn|danger|myth","title":"…","text":"…"}
{"type":"callout","variant":"tip","title":"…","items":["…","…"]}

{"type":"evidence","level":"stark|moderat|umstritten",
 "claim":"Die eigentliche Aussage, ein bis zwei Sätze.",
 "note":"Einordnung: woher, wie sicher, was heißt das praktisch.",
 "sources":[0,2]}                                          // Indizes in sources

{"type":"table","title":"…","head":["…"],"rows":[["…"]],"caption":"…"}
   // Erste Spalte wird als Zeilenkopf gesetzt. Max. 4 Spalten.

{"type":"checklist","id":"kurz","title":"…","items":["…"]}

{"type":"timeline","title":"…","entries":[
  {"age":"4–6 Monate","label":"…","text":"…"}
],"caption":"…"}

{"type":"comparison","title":"…","columns":[
  {"title":"…","tone":"good|bad|myth|neutral","items":["…"]}
]}

{"type":"faq","items":[{"q":"…","a":"…"}]}

{"type":"quote","text":"…","source":"…"}
```

### Diagramme (`figure`)

Vier Typen, alle werden als SVG erzeugt:

```jsonc
{"type":"figure","kind":"bar","title":"…","alt":"…","caption":"…",
 "data":[{"label":"…","value":12,"display":"12 h"}]}

{"type":"figure","kind":"range","title":"…","alt":"…","caption":"…",
 "min":0,"max":20,"ticks":[0,5,10,15,20],
 "data":[{"label":"0–3 Monate","from":14,"to":17,"display":"14–17 h"}]}

{"type":"figure","kind":"share","title":"…","alt":"…","caption":"…",
 "data":[{"label":"…","value":40,"display":"40 %"}]}

{"type":"figure","kind":"line","title":"…","alt":"…","caption":"…",
 "xMin":0,"xMax":36,"yMin":0,"yMax":100,
 "xTicks":[0,12,24,36],"yTicks":[0,50,100],
 "series":[{"label":"…","points":[[0,5],[12,50],[24,200]]}]}
```

**Zahlen müssen belegt sein.** Lieber ein Diagramm weniger als eine erfundene Kurve.
Immer `alt` und `caption` setzen; die `caption` nennt die Quelle in Worten.

### three.js-Szenen (`scene`)

Nur wo sie etwas erklären, maximal eine pro Artikel. Verfügbare Presets:
`synapsen` (Hirnentwicklung, Verknüpfung und Ausdünnung),
`schlafzyklus` (Schlafphasen über die Nacht),
`meilensteine` (Entwicklungspfad),
`koregulation` (zwei Systeme finden in den Gleichtakt).

```jsonc
{"type":"scene","preset":"synapsen","title":"…","alt":"…",
 "fallback":"Textbeschreibung für Menschen ohne JavaScript.","caption":"…"}
```

### Rechner (`calc`)

Echte Eingabe/Ausgabe, kein reines Bild. Läuft vollständig im Browser, es wird
nichts übertragen oder gespeichert. Maximal einer pro Artikel, nur wo er dem
Text etwas hinzufügt, das Fließtext oder eine Tabelle nicht besser leisten.
Jeder `calc`-Block bekommt automatisch eine Disclaimer-Zeile darunter
("Orientierungswert nach Leitlinien – ersetzt keine individuelle Beratung."),
per `disclaimer` überschreibbar. **Keine Rechner für Medikamentendosierung**
(siehe Regel 7) und keine, die einen exakten Geldbetrag verspricht (z. B.
Elterngeld – zu viele Sonderfälle im echten Steuer-/Sozialrecht).

Drei `kind`s, alle in `site/assets/js/calculators.js` implementiert:

```jsonc
// Geburtstermin nach Naegele-Regel, mit Zykluslängen-Korrektur.
{"type":"calc","kind":"due-date","title":"…","caption":"…"}

// Geburtsdatum → eigene Zeitleiste. "at" ist in der Einheit "unit" seit
// der Geburt, "windowBefore" (Standard 2) legt in derselben Einheit fest,
// ab wann ein Termin als "erledigt" statt "fällig" gilt.
{"type":"calc","kind":"age-schedule","title":"…","caption":"…",
 "options":{"unit":"months","events":[
   {"at":0,"label":"U1","note":"…"},
   {"at":1,"label":"U2"}
 ]}}

// Alter → passende Zeile aus einer Bereichstabelle, live hervorgehoben.
// "to" weglassen für einen offenen letzten Bereich ("6+").
{"type":"calc","kind":"age-range-lookup","title":"…","caption":"…",
 "options":{"unit":"months","inputLabel":"Alter deines Kindes (Monate)",
   "ranges":[{"from":0,"to":3,"label":"14–17 Stunden"},{"from":3,"label":"…"}]}}
```

**Die Zahlen in `options` müssen aus denselben Quellen stammen wie der Rest
des Artikels** – nichts Neues erfinden, sondern das, was `figure`/`table`
ohnehin schon belegen, in eine interaktive Form bringen.

### Werkzeuge (`tool`)

Anders als `calc` errechnet ein Werkzeug nichts aus einer Eingabe, sondern
läuft während einer Aktivität mit: Timer, Zähler, Atemführung, Zufalls-
auswahl. Maximal einer pro Artikel, nur wo er wirklich beim Tun hilft statt
nur ein Gimmick zu sein. Jeder `tool`-Block braucht ein eindeutiges `id`
(sonst wird `title` slugifiziert) – manche Werkzeuge merken sich ihren
Stand pro Seite in localStorage, `id` ist dafür der Schlüssel.

Fünf `kind`s, alle in `site/assets/js/tools.js` implementiert:

```jsonc
// Start/Stopp, protokolliert Dauer + Abstand zur vorherigen Messung
// (Beginn-zu-Beginn – relevant z. B. für Wehenabstände). "tags" optional
// für mehrere benannte Sitzungen (z. B. linke/rechte Seite beim Stillen).
{"type":"tool","kind":"interval-timer","id":"…","title":"…","caption":"…",
 "options":{"tags":["Links","Rechts"]}}

// Tippen zum Hochzählen, zeigt Zeit seit dem ersten Eintrag. "buttons"
// optional für mehrere benannte Zähler nebeneinander.
{"type":"tool","kind":"tally-counter","id":"…","title":"…","caption":"…",
 "options":{"buttons":["Bewegung"]}}

// Animierter Kreis, folgt einer Phasenfolge (respektiert reduced-motion:
// zeigt dann nur Text statt Animation).
{"type":"tool","kind":"breathing-pacer","id":"…","title":"…","caption":"…",
 "options":{"phases":[{"label":"Einatmen","seconds":4},{"label":"Halten","seconds":4},
   {"label":"Ausatmen","seconds":4},{"label":"Halten","seconds":4}]}}

// Countdown ab "seconds", oder mehrere Voreinstellungen über "presets".
{"type":"tool","kind":"countdown","id":"…","title":"…","caption":"…",
 "options":{"presets":[60,180,300]}}

// Zufällig eine Zeile aus "items" ziehen, "Nochmal" vermeidet Wiederholung.
{"type":"tool","kind":"picker","id":"…","title":"…","caption":"…",
 "options":{"items":["…","…","…"],"buttonLabel":"Idee ziehen"}}
```

**Kein Werkzeug ersetzt eine medizinische Einschätzung.** Ein Zähler für
Kindsbewegungen oder ein Wehen-Timer protokolliert nur, was die Person
selbst beobachtet – er bewertet nichts. Formuliere `caption`/`disclaimer`
entsprechend zurückhaltend.

---

## 5. Quellen

```jsonc
"sources":[
 {"title":"…","publisher":"…","year":"2023","kind":"Leitlinie","url":"https://…"}
]
```

`kind`: Leitlinie · Metaanalyse · Übersichtsarbeit · Studie · Empfehlung ·
Institutionelle Information · Fachbuch

**Rangfolge:** AWMF-Leitlinien, WHO, Cochrane, RKI/STIKO, BZgA
(kindergesundheit-info.de), DGKJ, NICE, AAP, Nationales Zentrum Frühe Hilfen,
methodisch starke Einzelstudien.

**URLs nur angeben, wenn du sie sicher kennst.** Eine Quelle ohne `url` ist besser
als eine erfundene URL. Titel und Herausgeber müssen echt sein — niemals Belege erfinden.

**Deutschsprachiger Kontext bevorzugt:** U-Untersuchungen, STIKO-Impfkalender,
Elterngeld, Kita-Recht, Notrufnummern beziehen sich auf Deutschland.

---

## 6. Evidenz-Ampel richtig setzen

| Stufe | Wann |
|---|---|
| `stark` | Leitlinienempfehlung, Metaanalyse oder mehrere übereinstimmende Studien |
| `moderat` | Einzelstudien, Fachkonsens ohne breite Datenbasis, plausible Mechanismen |
| `umstritten` | Widersprüchliche Studienlage oder weltanschaulich aufgeladene Frage |

Nicht jede Aussage braucht einen `evidence`-Block – nur die tragenden. Alltagstipps
ohne Studienlage gehören in `callout` mit `variant: "tip"`, nicht in die Ampel.

---

## 7. Sicherheit

Bei Gesundheits-, Schlaf-, Ernährungs- und Sicherheitsthemen hängt der Generator
automatisch einen medizinischen Hinweis an. Zusätzlich gilt:

- Warnzeichen, die sofortiges Handeln erfordern, gehören in einen
  `callout` mit `variant: "danger"` – **weit oben im Artikel**, nicht am Ende.
- Keine Dosierungsangaben für Medikamente.
- Bei psychischer Belastung von Eltern immer auf konkrete Hilfsangebote verweisen.

---

## 8. Vor dem Abgeben

1. `node -e "JSON.parse(require('fs').readFileSync('content/articles/<slug>.json','utf8'))"`
2. `node build/build.mjs` — es dürfen keine Hinweise zu deinem Artikel erscheinen.
3. Referenzartikel `content/articles/sicherer-schlaf.json` als Maßstab gegenlesen.
