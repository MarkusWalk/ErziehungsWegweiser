/* Regeldaten für die `tool`-Mini-Anwendungen (siehe blocks.mjs, tools.js).
   Eine einzige Stelle für Zahlen, die sowohl im statischen Fallback (Node,
   ohne JavaScript im Browser) als auch im interaktiven Widget (tools.js)
   verwendet werden. Das Widget bekommt sie pro Artikel als eingebettetes
   JSON – nirgendwo sonst stehen dieselben Werte noch einmal hart codiert.

   Alle Zeitangaben sind sprachlich wie im Gelben Heft / in der
   Fachliteratur formuliert (z. B. „3.–10. Lebenstag“), damit Fallback-
   Tabelle und Widget dieselbe Zählweise benutzen: die erste Einheit
   (Tag/Woche/Monat/Jahr) trägt die Nummer 1. */

export const TOOLS = {
  'u-termine': {
    label: 'U-Untersuchungen',
    /* unit: 'day' | 'week' | 'month' | 'year' – Zählung ab 1 (1. Lebenstag
       ist der Geburtstag selbst). from/to sind inklusive. */
    windows: [
      { id: 'U1', name: 'U1', unit: 'day', from: 1, to: 1, note: 'unmittelbar nach der Geburt' },
      { id: 'U2', name: 'U2', unit: 'day', from: 3, to: 10 },
      { id: 'U3', name: 'U3', unit: 'week', from: 4, to: 5 },
      { id: 'U4', name: 'U4', unit: 'month', from: 3, to: 4 },
      { id: 'U5', name: 'U5', unit: 'month', from: 6, to: 7 },
      { id: 'U6', name: 'U6', unit: 'month', from: 10, to: 12 },
      { id: 'U7', name: 'U7', unit: 'month', from: 21, to: 24 },
      { id: 'U7a', name: 'U7a', unit: 'month', from: 34, to: 36 },
      { id: 'U8', name: 'U8', unit: 'month', from: 46, to: 48 },
      { id: 'U9', name: 'U9', unit: 'month', from: 60, to: 64 },
      { id: 'J1', name: 'J1', unit: 'year', from: 13, to: 14 },
    ],
    source: 'G-BA Kinder-Richtlinie',
  },

  schlafbedarf: {
    label: 'Schlafbedarf',
    /* Altersgrenzen in vollendeten Lebensmonaten, Bedarf in Stunden je 24 h.
       0–3 Monate nach NSF (AASM beginnt erst ab 4 Monaten), ab 4 Monaten
       nach dem AASM-Konsens 2016. */
    ranges: [
      { fromMonths: 0, toMonths: 3, min: 14, max: 17, label: '0–3 Monate' },
      { fromMonths: 4, toMonths: 11, min: 12, max: 16, label: '4–11 Monate' },
      { fromMonths: 12, toMonths: 35, min: 11, max: 14, label: '1–2 Jahre' },
      { fromMonths: 36, toMonths: 71, min: 10, max: 13, label: '3–5 Jahre' },
      { fromMonths: 72, toMonths: 155, min: 9, max: 12, label: '6–12 Jahre' },
      { fromMonths: 156, toMonths: 216, min: 8, max: 10, label: '13–18 Jahre' },
    ],
    source: 'AASM-Konsensempfehlung 2016 (Paruthi et al.), 0–3 Monate nach National Sleep Foundation',
  },

  'korrigiertes-alter': {
    label: 'Korrigiertes Alter',
    fullTermWeeks: 40,
    correctUntilMonths: 24,
    source: 'AAP Committee on Fetus and Newborn',
  },

  mutterschutz: {
    label: 'Mutterschutz & Elternzeit',
    beforeWeeks: 6,
    afterWeeksNormal: 8,
    afterWeeksSpecial: 12,
    elternzeitNoticeWeeks: 7,
    elterngeldRetroMonths: 3,
    source: 'MuSchG (§3), BEEG (§16, §7), Stand 2025/2026',
  },

  schwangerschaftswoche: {
    label: 'Schwangerschaftswoche',
    totalDays: 280,
    trimesters: [
      { label: '1. Trimester', fromWeek: 1, toWeek: 13 },
      { label: '2. Trimester', fromWeek: 14, toWeek: 27 },
      { label: '3. Trimester', fromWeek: 28, toWeek: 40 },
    ],
    source: 'Naegele-Regel, 280 Tage ab letzter Periode',
  },

  'beikost-fenster': {
    label: 'Beikost-Fenster',
    fromMonths: 4,
    toMonths: 6,
    source: 'Netzwerk Gesund ins Leben',
  },

  'wehen-timer': {
    label: 'Wehen-Timer',
    /* Häufig genannte Orientierung fürs erste Kind: „5-1-1“ – Wehen etwa
       alle 5 Minuten, rund 1 Minute lang, über etwa 1 Stunde. */
    intervalMinutes: 5,
    durationMinutes: 1,
    sustainedHours: 1,
    privacy: 'Die Liste bleibt nur auf diesem Gerät gespeichert – nichts wird gesendet.',
    source: 'DGGG-Leitlinie „Vaginale Geburt am Termin“; NICE Intrapartum Care; Hebammen-Info',
  },

  protokoll: {
    label: 'Tagesprotokoll',
    /* Orientierungswerte ab dem 5./6. Lebenstag, wenn die Milchbildung
       eingesetzt hat – keine Diagnose, nur ein grober Anhaltspunkt. */
    fromDay: 5,
    wetDiapersMin: 6,
    feedsMin: 8,
    feedsMax: 12,
    privacy: 'Einträge bleiben nur auf diesem Gerät gespeichert – nichts wird gesendet.',
    source: 'Nationale Stillkommission; Netzwerk Gesund ins Leben',
  },

  'zahnputz-timer': {
    label: 'Zahnputz-Timer',
    totalSeconds: 120,
    quadrantSeconds: 30,
    quadrants: ['oben rechts', 'oben links', 'unten links', 'unten rechts'],
    source: 'Richtwert zwei Minuten; Aufteilung in vier Bereiche als Merkhilfe',
  },

  atemuebung: {
    label: 'Atemübung',
    inSeconds: 4,
    outSeconds: 6,
    defaultMinutes: 1,
    source: 'Paced Breathing / verlangsamte Atmung als Selbstregulationsübung',
  },

  wachfenster: {
    label: 'Wachfenster',
    /* Wachfenster (Zeit zwischen zwei Schlafphasen) sind Orientierungswerte
       aus der Beratungspraxis, keine Messgröße mit Studienbasis – siehe
       Artikel „Schlaf zwischen vier und zwölf Monaten". Zeiten in Minuten.
       naps: übliche Zahl an Tagschlafphasen in dem Alter (0 = meist keiner
       mehr). napMin/napMax: übliche Dauer je Schläfchen. */
    disclaimer: 'Wachfenster sind Orientierungswerte aus der Beratungspraxis, keine Messgröße mit Studienbasis. Das Kind selbst zählt mehr als die Uhr: Augenreiben, Fahrigkeit und Desinteresse zeigen den Zeitpunkt oft zuverlässiger an.',
    ranges: [
      { fromMonths: 4, toMonths: 5, minWake: 120, maxWake: 180, naps: 3, napMin: 45, napMax: 75, label: '4–5 Monate' },
      { fromMonths: 6, toMonths: 8, minWake: 150, maxWake: 210, naps: 3, napMin: 45, napMax: 75, label: '6–8 Monate' },
      { fromMonths: 9, toMonths: 11, minWake: 180, maxWake: 225, naps: 2, napMin: 60, napMax: 90, label: '9–11 Monate' },
      { fromMonths: 12, toMonths: 17, minWake: 210, maxWake: 270, naps: 2, napMin: 60, napMax: 90, label: '12–17 Monate' },
      { fromMonths: 18, toMonths: 23, minWake: 240, maxWake: 300, naps: 1, napMin: 90, napMax: 120, label: '18–23 Monate' },
      { fromMonths: 24, toMonths: 35, minWake: 300, maxWake: 360, naps: 1, napMin: 75, napMax: 105, label: '2–3 Jahre' },
      { fromMonths: 36, toMonths: 47, minWake: 330, maxWake: 390, naps: 1, napMin: 60, napMax: 90, label: '3–4 Jahre' },
      { fromMonths: 48, toMonths: 71, minWake: 360, maxWake: 420, naps: 0, napMin: 0, napMax: 0, label: '4–6 Jahre' },
    ],
    source: 'Orientierungswerte der Beratungspraxis wie im Artikel „Schlaf zwischen vier und zwölf Monaten" beschrieben (2–3 Std. mit vier Monaten, 3–4 Std. gegen Jahresende); Rückgang der Mittagsschlaf-Häufigkeit nach Staton et al., Sleep Medicine Reviews 2020',
  },

  'mental-load': {
    label: 'Mental Load',
    personADefault: 'Person A',
    personBDefault: 'Person B',
    privacy: 'Die Verteilung bleibt in deinem Browser. Nur wenn du auf „Speichern" tippst, landet sie im lokalen Speicher (localStorage) dieses Geräts – gesendet wird nichts.',
    /* kind: 'plan' = Denken/Organisieren (Mental Load im engeren Sinn),
       'do' = Ausführen. Je 10 Aufgaben, angelehnt an die im Artikel
       genannten Bereiche. */
    tasks: [
      { id: 'arzttermine-planen', text: 'Arzttermine im Blick behalten und vereinbaren', kind: 'plan' },
      { id: 'arzttermine-wahrnehmen', text: 'Zum Arzttermin gehen', kind: 'do' },
      { id: 'kita-kommunikation', text: 'Kita-Kommunikation (Elternabende, Nachrichten, Anmeldungen)', kind: 'plan' },
      { id: 'bringen-abholen', text: 'Kind bringen und abholen', kind: 'do' },
      { id: 'kleidung-groesse', text: 'Kleidung in passender Größe im Blick behalten', kind: 'plan' },
      { id: 'waesche', text: 'Wäsche waschen und einräumen', kind: 'do' },
      { id: 'essensplanung', text: 'Essensplanung für die Woche', kind: 'plan' },
      { id: 'kochen', text: 'Kochen', kind: 'do' },
      { id: 'einkaufsliste', text: 'Einkaufsliste im Kopf behalten (was fehlt, was zur Neige geht)', kind: 'plan' },
      { id: 'einkaufen', text: 'Einkaufen erledigen', kind: 'do' },
      { id: 'geschenke-planen', text: 'Geschenke für Kindergeburtstage organisieren', kind: 'plan' },
      { id: 'geschenke-besorgen', text: 'Geschenke besorgen und einpacken', kind: 'do' },
      { id: 'geburtstag-planen', text: 'Geburtstagsfeier des eigenen Kindes planen', kind: 'plan' },
      { id: 'geburtstag-ausrichten', text: 'Geburtstagsfeier ausrichten', kind: 'do' },
      { id: 'impfausweis', text: 'Impfausweis und Vorsorgetermine im Blick behalten', kind: 'plan' },
      { id: 'medikamente', text: 'Medikamente geben', kind: 'do' },
      { id: 'groessen-check', text: 'Spielsachen und Kleidergrößen im Blick behalten (was fehlt, was zu klein ist)', kind: 'plan' },
      { id: 'aufraeumen', text: 'Aufräumen', kind: 'do' },
      { id: 'urlaubsbetreuung', text: 'Ferien- und Urlaubsbetreuung organisieren', kind: 'plan' },
      { id: 'zubettbringen', text: 'Baden, Wickeln, Zubettbringen', kind: 'do' },
    ],
    source: 'Aufgabenliste angelehnt an die WSI-Beschäftigtenbefragung (Lott/Bünger, Hans-Böckler-Stiftung) und die Zeitverwendungserhebung des Statistischen Bundesamtes 2022',
  },

  taschengeld: {
    label: 'Taschengeld',
    /* fromYears/toYears inklusive. unit: 'week' unter 10 Jahren, 'month'
       ab 10 Jahren – wie im Artikel „Taschengeld und Verantwortung"
       beschrieben. */
    ranges: [
      { fromYears: 4, toYears: 5, min: 0.5, max: 1, unit: 'week', display: '0,50–1,00 €' },
      { fromYears: 6, toYears: 9, min: 2, max: 4, unit: 'week', display: '2–4 €' },
      { fromYears: 10, toYears: 11, min: 15, max: 25, unit: 'month', display: '15–25 €' },
      { fromYears: 12, toYears: 13, min: 20, max: 30, unit: 'month', display: '20–30 €' },
      { fromYears: 14, toYears: 14, min: 29, max: 35, unit: 'month', display: '29–35 €' },
      { fromYears: 15, toYears: 15, min: 34, max: 45, unit: 'month', display: '34–45 €' },
      { fromYears: 16, toYears: 17, min: 40, max: 60, unit: 'month', display: '40–60 €' },
    ],
    source: 'Taschengeldtabelle des Deutschen Jugendinstituts (DJI), wie von den Jugendämtern verbreitet. Werte für 4–13 und 16–17 Jahre wie im Artikel „Taschengeld und Verantwortung" zitiert, 14–15 Jahre nach aktueller DJI-Tabelle (Stand 2026)',
  },

  kinderkrankentage: {
    label: 'Kinderkrankentage',
    year: 2026,
    perChildNormal: 15,
    perChildAlone: 30,
    maxYearNormal: 35,
    maxYearAlone: 70,
    privacy: 'Die eingetragenen Tage werden nur in deinem Browser gespeichert (localStorage) – nichts wird gesendet. Keine Rechtsberatung.',
    source: 'Bundesgesundheitsministerium (BMG) zu § 45 SGB V, Regelung für das Jahr 2026; ab 2027 sind wieder 10 bzw. 20 Tage je Kind vorgesehen (höchstens 25 bzw. 50 im Jahr) – vor der Jahresplanung bei der Krankenkasse prüfen',
  },

  routinekarten: {
    label: 'Routinekarten',
    /* Bausteine wie im Artikel „Rituale und Tagesstruktur" beschrieben.
       selected: welche Schritte im Fallback vorausgewählt sind. */
    steps: {
      morgen: [
        { id: 'aufstehen', text: 'Aufstehen' },
        { id: 'anziehen', text: 'Anziehen' },
        { id: 'fruehstueck', text: 'Frühstück' },
        { id: 'zaehneputzen-morgen', text: 'Zähneputzen' },
        { id: 'toilette-morgen', text: 'Toilette' },
        { id: 'schuhe-an', text: 'Schuhe an' },
      ],
      abend: [
        { id: 'aufraeumen-abend', text: 'Aufräumen' },
        { id: 'baden', text: 'Baden oder Waschen' },
        { id: 'schlafanzug', text: 'Schlafanzug' },
        { id: 'zaehneputzen-abend', text: 'Zähneputzen' },
        { id: 'toilette-abend', text: 'Toilette' },
        { id: 'vorlesen', text: 'Vorlesen' },
        { id: 'kuscheln', text: 'Kuscheln' },
        { id: 'licht-aus', text: 'Licht aus' },
      ],
    },
    source: 'Ablaufbausteine wie im Artikel „Rituale und Tagesstruktur" beschrieben; Wirksamkeit fester Abendroutinen nach Mindell et al., Sleep 2009 und Sleep Medicine Reviews 2018',
  },

  meilensteine: {
    label: 'Meilensteine & Grenzsteine',
    /* Grenzsteine: Alter, zu dem etwa 90–95 % der Kinder eine Fähigkeit
       zeigen (nicht der Durchschnitt). Dieselben Alter und derselbe
       Wortlaut wie in der Grenzstein-Tabelle des Artikels
       "meilensteine-uebersicht" – hier nur nach Bereich aufgeteilt und
       aus "kann X nicht" in "kann X" gedreht. Keine eigenständige neue
       Quelle: Zusammenstellung aus dem Grenzsteinkonzept nach Michaelis,
       der S3-Leitlinie Sprachentwicklungsstörungen (Late-Talker-Kriterium)
       und der G-BA Kinder-Richtlinie, wie in den Artikeln
       "meilensteine-uebersicht" und "entwicklungsverzoegerung-erkennen"
       dargestellt. correctUntilMonths/fullTermWeeks wie bei
       "korrigiertes-alter", damit Frühgeborene richtig einsortiert werden. */
    fullTermWeeks: 40,
    correctUntilMonths: 24,
    checkpoints: [
      {
        months: 3,
        label: '3 Monate',
        domains: [
          { key: 'sozial', label: 'Sozial/Emotional', items: ['Nimmt Blickkontakt auf', 'Lächelt als Antwort auf ein Gesicht (soziales Lächeln)'] },
          { key: 'sprache', label: 'Sprache/Hören', items: ['Reagiert auf laute Geräusche oder auf deine Stimme'] },
        ],
      },
      {
        months: 6,
        label: '6 Monate',
        domains: [
          { key: 'motorik', label: 'Motorik', items: ['Hält den Kopf in Bauchlage', 'Greift gezielt nach Gegenständen'] },
          { key: 'sprache', label: 'Sprache', items: ['Bildet Laute (z. B. Lallen wie „ba-ba“)'] },
        ],
      },
      {
        months: 10,
        label: '10 Monate',
        domains: [
          { key: 'motorik', label: 'Motorik', items: ['Sitzt frei ohne Stütze'] },
          { key: 'sprache', label: 'Sprache', items: ['Bildet Silbenketten (z. B. „ba-ba-ba“, „da-da-da“)'] },
          { key: 'sozial', label: 'Sozial/Kognition', items: ['Zeigt Interesse an Gegenständen oder Personen'] },
        ],
      },
      {
        months: 12,
        label: '12 Monate',
        domains: [
          { key: 'motorik', label: 'Motorik', items: ['Bewegt sich selbstständig fort (Krabbeln, Robben oder eine andere Form)'] },
          { key: 'sprache', label: 'Sprache', items: ['Reagiert auf den eigenen Namen'] },
          { key: 'kognition', label: 'Kognition/Sozial', items: ['Zeigt mit dem Finger auf Dinge'] },
        ],
      },
      {
        months: 18,
        label: '18 Monate',
        domains: [
          { key: 'motorik', label: 'Motorik', items: ['Läuft frei'] },
          { key: 'sprache', label: 'Sprache', items: ['Spricht sinnvolle Einzelwörter'] },
          { key: 'kognition', label: 'Kognition', items: ['Ahmt Alltagshandlungen nach (z. B. Telefonieren, Löffel zum Mund führen)'] },
        ],
      },
      {
        months: 24,
        label: '24 Monate',
        domains: [
          { key: 'sprache', label: 'Sprache', items: ['Spricht mindestens 50 Wörter oder bildet Zweiwortkombinationen (z. B. „mehr Milch“)'] },
          { key: 'kognition', label: 'Kognition', items: ['Zeigt Symbolspiel (z. B. ein Klotz wird zum Auto)'] },
        ],
      },
      {
        months: 36,
        label: '3 Jahre',
        domains: [
          { key: 'sprache', label: 'Sprache', items: ['Spricht so, dass Fremde es verstehen'] },
          { key: 'sozial', label: 'Sozial', items: ['Zeigt Interesse an anderen Kindern'] },
        ],
      },
    ],
    redFlag: 'Verlust einer Fähigkeit, die dein Kind schon sicher konnte – in jedem Alter ein Grund, zeitnah in die Kinderarztpraxis zu gehen.',
    followUp: 'Sprich das bei der nächsten U-Untersuchung an – oder früher, wenn du dir Sorgen machst.',
    source: 'Grenzsteinkonzept nach Michaelis (Monatsschrift Kinderheilkunde 2022); S3-Leitlinie Therapie von Sprachentwicklungsstörungen (Late-Talker-Kriterium, 24 Monate); G-BA Kinder-Richtlinie – Zusammenstellung wie in „Meilensteine von 0 bis 6 im Überblick“',
  },

  'fieber-check': {
    label: 'Fieber-Check',
    /* Ampel-Logik nach NICE NG143 "Fever in under 5s" (rotes/gelbes/grünes
       Ampelsystem), vereinfacht auf vier Handlungsempfehlungen für Eltern.
       Rote Warnzeichen -> sofort 112. <3 Monate + Fieber ab 38 °C -> sofort
       ärztlich abklären. 3-6 Monate (einschließlich) + Fieber ab 39 °C ->
       noch am selben Tag abklären (dieselben
       Alters-/Temperaturregeln wie im Artikel "fieber-und-infekte" und auf
       der Seite "Notfall & Anlaufstellen"). "Weitere Anzeichen" ohne rotes
       Warnzeichen -> ebenfalls noch am selben Tag abklären. Sonst: zu Hause
       beobachten. Keine Medikamentendosierung – die ist hier bewusst nicht
       Teil des Werkzeugs. */
    infantMaxMonths: 3,
    infantMinTemp: 38.0,
    youngMinMonths: 3,
    youngMaxMonths: 6,
    youngMinTemp: 39.0,
    methods: [
      { id: 'rektal', label: 'Rektal (im Po)' },
      { id: 'ohr', label: 'Im Ohr' },
      { id: 'stirn', label: 'Stirn oder berührungslos' },
      { id: 'achsel', label: 'In der Achselhöhle' },
    ],
    methodNote: 'Stirn-, Ohr- und Achselmessung schwanken stärker und messen oft zu niedrig. Bei einem Wert nah an einer Schwelle lieber rektal nachmessen.',
    redFlags: [
      'Blaue, graue oder fleckig-marmorierte Haut, Lippen oder Zunge',
      'Reagiert kaum oder ist kaum weckbar',
      'Schwacher, hoher, durchdringender oder ununterbrochener Schrei',
      'Stöhnendes Grunzen bei der Atmung',
      'Deutlich angestrengte, sehr schnelle Atmung oder sichtbare Einziehungen zwischen den Rippen',
      'Hautflecken oder Ausschlag, der sich mit einem Glas nicht wegdrücken lässt',
      'Vorgewölbte Fontanelle (weiche Stelle am Kopf bei Säuglingen)',
      'Nackensteifigkeit',
      'Krampfanfall',
      'Zeichen ausgeprägter Austrocknung (stehende Hautfalte, eingesunkene Augen, kaum noch nasse Windeln)',
    ],
    amberFlags: [
      'Blasse Haut, Lippen oder Zunge',
      'Trinkt deutlich weniger oder isst kaum, spürbar weniger nasse Windeln',
      'Wirkt insgesamt schlapper oder kränker als sonst, lässt sich aber wecken und ansprechen',
      'Fieber kommt nach einer fieberfreien Phase zurück',
      'Fieber dauert schon länger als 3 Tage an, ohne dass ein Grund erkennbar ist',
    ],
    outcomes: {
      emergency: { title: '112 rufen', text: 'Mindestens ein rotes Warnzeichen ist angekreuzt. Ruf jetzt den Notruf 112 – warte nicht ab und recherchiere nicht erst weiter.' },
      infant: { title: 'Sofort ärztlich abklären', text: 'Fieber ab 38 °C unter drei Monaten wird immer sofort abgeklärt, auch wenn dein Kind sonst unauffällig wirkt: Kinderarztpraxis, sonst Kinderklinik oder 116 117 – jetzt, nicht erst später am Tag.' },
      today: { title: 'Heute noch ärztlich abklären', text: 'Kinderarztpraxis, außerhalb der Sprechzeiten die 116 117 – heute noch, nicht erst morgen.' },
      home: { title: 'Zu Hause beobachten', text: 'Aktuell kein Warnzeichen. Beobachte weiter: Trinkverhalten, Wachheit, Atmung, Hautfarbe. Sobald eines der oben genannten Anzeichen dazukommt, gilt die höhere Stufe.' },
    },
    always: 'Im Zweifel: 116 117 oder 112. Dein Gefühl zählt – wenn dir etwas nicht geheuer ist, lass es abklären.',
    source: 'NICE NG143 „Fever in under 5s: assessment and initial management“ (Ampelsystem), Elterninformation der Bundeszentrale für gesundheitliche Aufklärung (kindergesundheit-info.de); Alters-/Temperaturschwellen wie im Artikel „Fieber und Infekte richtig einschätzen“ und auf der Seite „Notfall & Anlaufstellen“',
  },
};
