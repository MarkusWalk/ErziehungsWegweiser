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
  pages/*.json         Statische Seiten (Notfall, Über, Methodik, Glossar,
                       Quellen, Impressum, Datenschutz)

build/
  build.mjs            Generator: content/ + site/ → docs/
  lint.mjs             Qualitätsprüfung der Artikel
  blocks.mjs           Rendert Inhaltsblöcke, erzeugt SVG-Diagramme
  layout.mjs           Seitengerüst, Navigation, Overlays
  inline.mjs           Minimale Inline-Auszeichnung

site/assets/           CSS, JavaScript, Bilder – wird unverändert übernommen
  css/tokens.css       ← einziger Ort für Farben, Typografie, Abstände

docs/                  Generierte Website (das, was der Hoster ausliefert)
```

Die Artikel liegen als **strukturierte JSON-Blöcke** vor, nicht als HTML. Der Generator
erzeugt daraus fertige Seiten. Dadurch bleiben 90+ Artikel visuell konsistent, die
Navigation, Suche und Verschlagwortung entstehen automatisch, und ein Designwechsel
betrifft nur die Vorlagen – nicht die Inhalte.

**Beim Hoster läuft kein Build.** `docs/` enthält fertiges HTML/CSS/JS.

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

## Veröffentlichen

Die Seite wird **nicht über GitHub Pages** ausgeliefert. Grund: GitHub Pages läuft
seit 2022 ausnahmslos über GitHub Actions — auch die Einstellung *Deploy from a
branch* erzeugt intern den Workflow `pages build and deployment`. Ein Betrieb ohne
Actions ist dort nicht möglich.

Stattdessen ein Hoster, der statische Dateien direkt ausliefert. Beide Varianten
sind für dieses Projekt kostenlos, brauchen keine Zahlungsdaten und führen keinen
Build aus — `docs/` enthält fertiges HTML/CSS/JS.

### Cloudflare Pages

1. [dash.cloudflare.com](https://dash.cloudflare.com) → *Workers & Pages* →
   *Create* → *Pages* → *Connect to Git*
2. Repository `MarkusWalk/ErziehungsWegweiser` auswählen, Branch `main`
3. **Framework preset:** `None`
4. **Build command:** *leer lassen*
5. **Build output directory:** `docs`
6. *Save and Deploy*

### Netlify

1. [app.netlify.com](https://app.netlify.com) → *Add new site* → *Import an
   existing project* → GitHub → Repository auswählen
2. Die Einstellungen kommen aus `netlify.toml` im Wurzelverzeichnis:
   `publish = "docs"`, kein Build-Befehl
3. *Deploy*

### Vercel

1. [vercel.com/new](https://vercel.com/new) → Repository importieren
2. Die Einstellungen kommen aus `vercel.json` im Wurzelverzeichnis:
   `outputDirectory: "docs"`, kein Build-Befehl (es gibt keine `package.json`,
   Vercel liefert die Dateien direkt aus)
3. *Deploy*

Zu beachten: Der kostenlose **Hobby**-Tarif ist laut Nutzungsbedingungen
nicht-kommerziellen Projekten vorbehalten — also keine Werbung, keine
Bezahlinhalte, kein Firmenauftritt. Für dieses Kompendium in seiner jetzigen
Form trifft das zu.

Alle drei veröffentlichen ab dann bei jedem Push auf `main` automatisch neu.

### Vor dem Livegang: Impressum und Datenschutz

Beide Seiten liegen fertig unter `content/pages/impressum.json` und
`content/pages/datenschutz.json`, aber mit Platzhaltern in spitzen Klammern:
`«VORNAME NACHNAME»`, `«STRASSE HAUSNUMMER»`, `«E-MAIL-ADRESSE»`, `«HOSTER
EINTRAGEN»`, `«BUNDESLAND»`. Die müssen raus, bevor die Seite erreichbar ist —
der Generator meldet bei jedem Lauf, wie viele noch stehen.

Zwei Dinge hängen an der Hosterwahl: In der Datenschutzerklärung muss stehen,
wer die Server-Logfiles verarbeitet (Cloudflare, Netlify oder Vercel — alle drei
US-Unternehmen, alle drei mit Auftragsverarbeitungsvertrag). Und dieser Vertrag
nach Art. 28 DSGVO muss im jeweiligen Konto tatsächlich abgeschlossen werden.

Ebenfalls offen: `site.baseUrl` in `content/taxonomy.json`. Solange die leer ist,
enthält `sitemap.xml` keine absoluten URLs und Suchmaschinen verwerfen sie. Sobald
die endgültige Domain feststeht, dort eintragen (ohne Schrägstrich am Ende).

Ein Cookie-Banner braucht die Seite nicht: Sie setzt keine Cookies, und die
lokal gespeicherten Einstellungen (Farbmodus, Schriftgröße, Geburtsdatum,
Checklisten) fallen unter § 25 Abs. 2 Nr. 2 TDDDG — du stellst sie selbst ein,
also sind sie für die gewünschte Funktion erforderlich.

### Header

`build/build.mjs` erzeugt beide Konfigurationen aus derselben Regelliste:
`docs/_headers` für Cloudflare Pages und Netlify, `vercel.json` für Vercel
(das `_headers` nicht kennt). Gesetzt werden:

- **Content-Security-Policy** — keine Skripte, Stile, Schriften oder Bilder von
  fremden Servern, keine Einbettung in fremde Seiten
- `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
  `Permissions-Policy`
- **Cache:** ein Jahr für Schriften, Botanicals und three.js (die ändern sich
  nie), zehn Minuten für HTML und Suchindex

`'unsafe-inline'` bei `script-src` ist nötig: Das Theme-Bootstrap steht inline im
`<head>` — ohne das blitzt beim Laden der falsche Farbmodus auf — und die
JSON-LD-Blöcke unterscheiden sich pro Artikel. Der wesentliche Schutz bleibt: kein
einziger Zugriff auf fremde Server.

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
