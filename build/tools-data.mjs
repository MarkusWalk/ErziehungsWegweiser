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
};
