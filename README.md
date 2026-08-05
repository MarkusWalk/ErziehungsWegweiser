# Erziehungswegweiser

Ein Kompendium zu Schwangerschaft, Neugeborenen, Babys, Kleinkindern und Erziehung –
wissenschaftlich gestützt, für Eltern aufbereitet, als statische Website.

**Zielgruppe:** Eltern und werdende Eltern · **Sprache:** Deutsch ·
**Technik:** reines HTML, CSS und JavaScript – kein Framework, keine Runtime-Abhängigkeiten.

---

## Wie das Projekt aufgebaut ist

```
content/
  taxonomy.json        Altersphasen, Themenfelder, Evidenzstufen
  topic-map.json       Redaktionelle Themenlandkarte (geplante Artikel)
  AUTHORING.md         Verbindliche Regeln fürs Schreiben
  articles/*.json      Ein Artikel = eine Datei, strukturierte Inhaltsblöcke
  pages/*.json         Statische Seiten (Notfall, Über, Methodik, Glossar)

build/
  build.mjs            Generator: content/ + site/ → docs/
  lint.mjs             Qualitätsprüfung der Artikel
  blocks.mjs           Rendert Inhaltsblöcke, erzeugt SVG-Diagramme
  layout.mjs           Seitengerüst, Navigation, Overlays
  inline.mjs           Minimale Inline-Auszeichnung

site/assets/           CSS, JavaScript, Bilder – wird unverändert übernommen
  css/tokens.css       ← einziger Ort für Farben, Typografie, Abstände

docs/                  Generierte Website (das, was GitHub Pages ausliefert)
```

Die Artikel liegen als **strukturierte JSON-Blöcke** vor, nicht als HTML. Der Generator
erzeugt daraus fertige Seiten. Dadurch bleiben 90+ Artikel visuell konsistent, die
Navigation, Suche und Verschlagwortung entstehen automatisch, und ein Designwechsel
betrifft nur die Vorlagen – nicht die Inhalte.

**Auf GitHub Pages läuft kein Build.** `docs/` enthält fertiges HTML/CSS/JS.

---

## Befehle

```bash
node build/build.mjs        # Website nach docs/ erzeugen
node build/lint.mjs         # Alle Artikel gegen die Autorenregeln prüfen
node build/lint.mjs <slug>  # Einen Artikel prüfen

# Lokale Vorschau
python3 -m http.server 8000 --directory docs
# → http://localhost:8000
```

Nach jeder Änderung an `content/` oder `site/` muss `node build/build.mjs` laufen,
damit `docs/` aktuell ist.

---

## GitHub Pages aktivieren

1. Repository → **Settings** → **Pages**
2. *Source*: **Deploy from a branch**
3. *Branch*: der gewünschte Branch, *Ordner*: **`/docs`**
4. Speichern. Die Seite erscheint nach ein bis zwei Minuten.

Eine `.nojekyll`-Datei wird mitgeneriert, damit GitHub die Dateien unverändert
ausliefert.

---

## Design

Die gesamte visuelle Gestaltung hängt an **`site/assets/css/tokens.css`**. Diese Datei
enthält aktuell einen neutralen Platzhalter und wird durch die verbindliche
Designrichtlinie ersetzt. Belegt werden müssen:

- Farbpalette: Basis, Akzent, Semantik (Info/Tipp/Warnung/Gefahr), drei Evidenzfarben,
  sechs Altersphasenfarben – jeweils mit Dark-Mode-Entsprechung
- Schriftfamilien (Display + Body), Größenskala, Zeilenhöhen, Laufweiten
- Abstandsskala, Satzbreite, Layoutbreiten
- Radien, Rahmen, Schatten
- Bewegungskurven und -dauern

`base.css`, `components.css` und `layout.css` greifen ausschließlich über diese
Variablen zu und müssen dafür nicht angefasst werden.

---

## Funktionen der Website

- **Duale Navigation:** nach Altersphase und nach Themenfeld
- **Evidenz-Ampel:** jede tragende Aussage ist als gut belegt, Hinweise vorhanden
  oder umstritten gekennzeichnet
- **Quellenapparat** pro Artikel plus gesammeltes Quellenverzeichnis
- **Volltextsuche**, vollständig im Browser (kein Server, kein Tracking)
- **Alters-Personalisierung:** optionales Geburtsdatum hebt passende Inhalte hervor,
  gespeichert nur lokal
- **Lesemodus**, Dark Mode, Schriftgrößen
- **Visualisierungen:** serverseitig erzeugte SVG-Diagramme, Zeitstrahlen und
  three.js-Szenen, die erst bei Sichtbarkeit geladen werden
- **Notfallseite** mit Hotlines und Warnzeichen

Die Seite funktioniert vollständig ohne JavaScript; alle JS-Funktionen sind Zusatz.

---

## Hinweis

Dieses Kompendium ersetzt keine ärztliche, therapeutische oder psychologische
Beratung. Die Inhalte werden KI-gestützt recherchiert und aufbereitet; Belege sind
bei jedem Artikel angegeben. Bei akuter Gefahr gilt der Notruf **112**.
