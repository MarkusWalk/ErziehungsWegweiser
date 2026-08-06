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
node build/lint.mjs --strict  # Entwürfe mitwerten
node build/check-links.mjs  # Quellen-URLs prüfen (braucht freies Netz)

# Lokale Vorschau
python3 -m http.server 8000 --directory docs
# → http://localhost:8000
```

Nach jeder Änderung an `content/` oder `site/` muss `node build/build.mjs` laufen,
damit `docs/` aktuell ist.

---

## GitHub Pages aktivieren

**Einmalig von Hand:**

1. Repository → **Settings** → **Pages**
2. *Build and deployment* → *Source*: **Deploy from a branch**
3. Branch **`gh-pages`**, Ordner **`/ (root)`** → Speichern

Die Seite steht dann unter `https://markuswalk.github.io/ErziehungsWegweiser/`
(Groß- und Kleinschreibung im Pfad beachten).

Es läuft dabei **kein Build und kein Runner** — der Branch enthält fertiges
HTML/CSS/JS, eine `.nojekyll`-Datei sorgt dafür, dass GitHub nichts daran ändert.

### Warum ein eigener Branch statt `main` + `/docs`

Beides funktioniert. Bei `main` muss in den Einstellungen zusätzlich der
Unterordner `/docs` gewählt werden — steht dort versehentlich `/ (root)`, liefert
Pages **404 auf jede Seite**, weil im Wurzelverzeichnis von `main` keine
`index.html` liegt. Bei `gh-pages` entfällt diese Auswahl: dort *ist* die Wurzel
die Seite. Eine Fehlerquelle weniger.

### Nach inhaltlichen Änderungen veröffentlichen

```bash
sh build/publish.sh
```

Das baut neu, prüft ob `docs/` committet ist, und überträgt es per
`git subtree push` in die Wurzel von `gh-pages`. `docs/` auf `main` bleibt die
einzige Quelle — `gh-pages` ist nur die Auslieferungsform.

Das Repository muss dafür öffentlich sein, sonst verlangt Pages einen bezahlten
Plan (Pro, Team oder Enterprise).

### Warum kein GitHub-Actions-Workflow

Es gab einen (`.github/workflows/pages.yml`), er ist wieder entfernt. Zwei Gründe:

1. `actions/configure-pages` kann Pages nicht selbst aktivieren — der
   `GITHUB_TOKEN` darf eine Pages-Site nicht anlegen (*„Resource not accessible by
   integration"*). Der Handgriff in den Einstellungen blieb also ohnehin nötig.
2. Der Prüfjob bekam anschließend keinen Runner zugeteilt und wurde nach 15
   Minuten abgebrochen. Für ein Projekt, das nichts zu bauen hat, ist das
   unnötige Abhängigkeit von fremder Infrastruktur.

Die Prüfung, die der Workflow leistete, läuft jetzt lokal vor jedem Push.

### Prüfung vor dem Push

```bash
git config core.hooksPath build/hooks   # einmalig je Klon
```

`build/hooks/pre-push` bricht den Push ab bei:

- Lint-Fehlern in den Artikeln
- einem `docs/`, das nicht zum aktuellen `content/` und `site/` passt

Der zweite Punkt funktioniert nur, weil der Generator deterministisch ist: gleiche
Eingabe, byte-gleiche Ausgabe. Deshalb ist die Streuung der botanischen Spezimen
aus dem Slug abgeleitet und nicht zufällig.

Notfalls umgehbar mit `git push --no-verify`.

---

## Design

Die Gestaltung folgt dem Designsystem im Ordner `Design System/`.

```
Design System/tokens/*.css     Quelle der Wahrheit für alle Gestaltungswerte
        ↓ kopiert nach
site/assets/css/ds/*.css       unverändert, damit gegen die Quelle abgleichbar
        ↓ gebündelt vom Generator
docs/assets/css/ds-tokens.css  eine Datei, ein Request
        ↓ gelesen von
site/assets/css/tokens.css     Adapter: bildet die Projektnamen auf die Tokens ab
        ↓ genutzt von
base.css · components.css · layout.css · print.css
```

**Der Adapter ist die einzige Stelle mit einer Zuordnung.** Ein Update des
Designsystems bedeutet: `Design System/tokens/` nach `site/assets/css/ds/` kopieren,
bauen, fertig. Die übrigen Stylesheets kennen nur Projektnamen (`--c-accent`,
`--fs-md`, `--r-md`), nie einzelne Farbwerte.

Übernommen wurden:

- **Farbe** — Coral als einziger Akzent, warme Creme-Flächen, Moss/Amber/Violett
  funktional für die Evidenz-Ampel, die sechs Altersphasen aus der Chart-Reihe
- **Schrift** — Bricolage Grotesque (Display) und Instrument Sans (Text),
  **selbst gehostet** unter `site/assets/fonts/`. Bewusst nicht über Google Fonts:
  so entsteht beim Seitenaufruf keine Verbindung zu Dritten (DSGVO)
- **Icons** — der 73-Icon-Satz; die benötigten werden von
  `build/extract-icons.mjs` aus `assets/icons/icons.svg` nach `build/icons.mjs`
  extrahiert und inline gesetzt (externe Sprite-Referenzen scheitern in Safari)
- **Geometrie** — Kugeln mit farbgleichem Schein, Washes als Flächenverlauf,
  botanische Spezimen als stille Hintergrundgeometrie
- **Radius-Sprache** — Kreise für Abzeichen, 16/24 px für Container,
  vollrund für Schaltflächen und Tags

### Zwei Abweichungen, bewusst getroffen

1. **Coral-700 statt Coral-500 für Text.** Das Designsystem hält fest, dass
   Coral-500 niemals kleinen Text trägt (2,6:1). Da der Akzent hier Links und
   Labels trägt, ist `--c-accent` auf Coral-700 gelegt (4,6:1). Coral-500 bleibt
   als `--c-accent-fill` für Flächen.
2. **Abgedunkelte Textvarianten der Phasen- und Statusfarben.** Die Fülltöne sind
   für Text zu hell. Neben jedem steht deshalb ein `--c-*-ink` mit mindestens
   4,5:1. Die Füllfarben selbst sind unverändert.

Geprüft mit axe-core (WCAG 2 A/AA) auf Start-, Artikel-, Phasen-, Listen- und
Notfallseite, hell und dunkel: 0 Verstöße.

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
