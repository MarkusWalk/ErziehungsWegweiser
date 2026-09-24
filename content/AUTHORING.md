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

### Mini-Werkzeuge (`tool`)

Kleine, in den Artikel integrierte Rechner. Ohne JavaScript steht eine vollständige
Tabelle der zugrunde liegenden Regel da; mit JavaScript wird daraus ein Eingabeformular
(Geburtsdatum o. Ä.) mit sofortigem Ergebnis. Die Regeldaten liegen einmalig in
`build/tools-data.mjs`. Sparsam einsetzen, höchstens eines pro Artikel. Verfügbare Presets:
`u-termine` (U1–U9 und J1 ab Geburtsdatum), `schlafbedarf` (Schlafbedarf nach Alter),
`korrigiertes-alter` (für Frühgeborene), `mutterschutz` (Mutterschutz- und
Elternzeit-Fristen ab Entbindungstermin), `schwangerschaftswoche` (aktuelle SSW ab
Entbindungstermin), `beikost-fenster` (Beikost-Startfenster ab Geburtsdatum).

```jsonc
{"type":"tool","preset":"u-termine","title":"…","caption":"…"}
```

### Bildmaterial (`illustration`)

Stimmung statt Information – höchstens zwei pro Artikel, meist eines. Zwei Formen:

**Botanische Bildtafel** (`specimen`): ein einzelnes Motiv aus `site/assets/botanical/`
als ruhige, gerahmte Bildtafel. Rein atmosphärisch, ersetzt keine Erklärung. `alt`
nur setzen, wenn das Bild ausnahmsweise etwas zeigt, das im Text keine Entsprechung
hat – sonst bleibt es dekorativ (leeres `alt`). `align` ist `right` (schwimmt ab 760px
neben dem Text) oder `wide` (größere, zentrierte Bildtafel als Absatz-Pause).

```jsonc
{"type":"illustration","specimen":"bloom-04","align":"right","caption":"…"}
```

Verfügbare Spezimen: alle Dateien unter `site/assets/botanical/` (Familien `bloom`,
`leaf`, `sprig`, `wing`, je mit laufender Nummer, z. B. `bloom-04`, `leaf-09`,
`sprig-03`, `wing-05`). Ein unbekannter Name bricht den Build.

**Erklärendes Linien-SVG** (`preset`): eine im Code gezeichnete Grafik aus
`build/illustrations.mjs`, im Stil des Icon-Sets. Für Sachverhalte, die ein Foto oder
ein Diagramm nicht zeigen kann. `alt` beschreibt den Inhalt für Screenreader, `title`
erscheint als Bildunterschrift. Verfügbare Presets: `sicherer-schlaf` (Rückenlage,
Schlafsack, Zimmertemperatur, eigenes Bett), `reboarder` (rückwärtsgerichteter
Kindersitz, Kraftverteilung), `milchzaehne` (20 Milchzähne mit Durchbruchsalter),
`stabile-seitenlage-kind` (drei Schritte), `hand-und-magen` (Magengröße als Faustregel).

```jsonc
{"type":"illustration","preset":"sicherer-schlaf","title":"…","alt":"…","caption":"…"}
```

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
