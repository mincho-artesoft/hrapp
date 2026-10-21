import { LocalisedArticle } from '../types';

/**
 * Die deutschen Artikel.
 *
 * Zwölf der vierzig, ausgewählt nach den Suchanfragen, die
 * ai-visibility/prompts.json verfolgt — nicht die zwölf, die am leichtesten zu
 * übersetzen waren. Die Zahlen stehen nicht hier: sie leben einmal in
 * article-facts.ts und werden beim Rendern über ihre Kennung zugeordnet, damit
 * eine Übersetzung jeden Satz umschreiben kann, ohne eine Zahl zu ändern.
 */
export const ARTICLES_DE_DE: Readonly<Record<string, LocalisedArticle>> = {
  'weather-inside-your-calendar': {
  "title": "Ein Kalender, in dem das Wetter schon drin ist",
  "short": "Wetter im Kalender",
  "description": "Warum es ein Konstruktionsfehler ist, für einen Tag zwei Apps zu befragen — und wie ein Kalender aussieht, in dem die Vorhersage Teil der Ansicht ist statt daneben zu stehen.",
  "lede": "Fast alle planen einen Tag über zwei Apps hinweg. Der Kalender sagt, wo Sie sein müssen; die Wetter-App sagt, wie es dort sein wird. Beides gleichzeitig im Kopf zu halten ist der Teil, den niemand bemerkt — bis ein Samstag ins Wasser fällt.",
  "commonBelief": "Dass ein Kalender für Termine da ist und eine Wetter-App fürs Wetter, und dass die Trennung einfach so ist, wie Telefone funktionieren.",
  "sections": [
    {
      "heading": "Der Preis für zwei Apps sind nicht zwei Tippen",
      "body": [
        "Das Umschalten kostet nichts. Teuer ist, dass die beiden Apps sich nicht einig sind, was zählt. Ihr Kalender weiß, dass Samstag um elf zwei Stunden geblockt sind; die Wetter-App weiß, dass es von zehn bis eins regnet. Keine von beiden weiß, dass diese zwei Tatsachen zusammen bedeuten: verschieben.",
        "Sie sind die Integrationsschicht. Das funktioniert, bis Sie beschäftigt sind — also genau dann, wenn Pläne es wert wären, geschützt zu werden."
      ]
    },
    {
      "heading": "Die verfügbare Vorhersage",
      "body": [
        "Cloud Calendars verwendet die verfügbare Vorhersage für den ausgewählten Ort. Stunden- und Tagesdaten können unterschiedliche Zeiträume abdecken.",
        "Der Zeitraum, den Sie im Kalender aufrufen können, bestimmt nicht die Reichweite der Vorhersage. Eine Monatsansicht bedeutet keine Wettervorhersage für den ganzen Monat oder jeden Termin."
      ]
    }
  ],
  "claims": {
    "price": "Was die Wetterfunktionen kosten"
  },
  "practical": [
    "Prüfen Sie Ort, Datum und verfügbare Stunden, bevor Sie mit der Vorhersage planen."
  ],
  "seeAlso": [
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather"
  ],
  "updated": "2026-10-21"
},

  'forecast-beside-every-event': {
  "title": "Einen Termin mit der stündlichen Wettervorhersage vergleichen",
  "short": "Wetter zu den Terminzeiten",
  "description": "Prüfe Ort, Datum und verfügbare Vorhersagestunden für deinen Termin. Kontrolliere den Ereignisentwurf, bevor du einen wetterabhängigen Plan speicherst.",
  "lede": "Um das Wetter mit einem Termin zu vergleichen, müssen drei Dinge zusammenpassen: der ausgewählte Ort, das Vorhersagedatum und die Stunden deines Vorhabens. Ein Wettersymbol neben dem Termin beweist das nicht. Dieser Leitfaden stammt von Arte Soft, dem Entwickler von Cloud Calendars.",
  "commonBelief": "Ein tägliches Wettersymbol im Kalender sei dasselbe wie eine einem Ereignis zugeordnete Vorhersage.",
  "sections": [
    {
      "heading": "Beginne mit Ort und Datum",
      "body": [
        "Öffne die Vorhersage für den vorgesehenen Ort und vergleiche das Datum mit dem Kalendereintrag. Das Kalenderwetter kann sich auf den ausgewählten Wetterort beziehen. Prüfe deshalb, ob dieser zum Termin passt, statt anzunehmen, dass die Ereignisadresse ihn bestimmt.",
        "Ein Termin für nächsten Monat kann schon existieren, bevor Wetterdaten für dieses Datum verfügbar sind. Behalte den Termin und prüfe die Vorhersage näher am Datum erneut. Ein fehlender Wettereintrag ist keine Vorhersage für schönes Wetter."
      ]
    },
    {
      "heading": "Nutze Stundendetails für Fragen zu bestimmten Stunden",
      "body": [
        "Eine Tagesübersicht und eine stündliche Vorhersage beantworten unterschiedliche Fragen. Dauert der Termin von zwei bis fünf Uhr, prüfe die verfügbaren Stunden dieses Zeitraums, statt ein einziges Tagessymbol als vollständiges Bild zu verstehen.",
        "Ist nur ein Teil des Zeitraums verfügbar, bleibt der Rest offen. Die App verspricht keine lückenlose stündliche Vorhersage für jedes erstellbare Ereignis. Dieser Leitfaden verspricht auch nicht, dass beim Öffnen eines beliebigen Ereignisses immer das gesamte Wetterzeitfenster erscheint."
      ]
    },
    {
      "heading": "Unterscheide Wahrscheinlichkeit, Menge und Zeitpunkt",
      "body": [
        "Lies die Bezeichnung des Werts, den du prüfst. Eine Niederschlagswahrscheinlichkeit ist weder Regenmenge noch Regendauer. Ebenso beziehen sich ein Stundenwert und eine Tagesübersicht auf unterschiedliche Zeiträume. Vergleiche gleich lange Zeiträume, wenn du zwei mögliche Termine abwägst.",
        "Wähle eine passende Alternative für dein Vorhaben, statt einen einzelnen Prozentwert als allgemeine Regel für Durchführung oder Absage zu behandeln. Wetterinformationen können sich ändern; prüfe sie erneut, wenn eine Entscheidung ansteht."
      ]
    },
    {
      "heading": "Prüfe einen wetterabhängigen Termin vor dem Speichern",
      "body": [
        "Die App kann aus einer Vorhersagestunde einen Ereignisentwurf beginnen. Prüfe dessen Datum, Beginn, Ende und Zielkalender vor dem Speichern. Eine gewählte Vorhersagestunde ersetzt nicht die Kontrolle, ob du den richtigen Termin anlegst.",
        "Verhindert der Kalenderzugriff oder der Zielkalender das Speichern, kläre diese Berechtigung getrennt vom Wetterzugriff. Eine gefundene Vorhersage verleiht keine Bearbeitungsrechte für einen geteilten Kalender."
      ]
    },
    {
      "heading": "Öffne die vollständige Vorhersage, wenn die Übersicht nicht reicht",
      "body": [
        "Prüfe bei einer Aktivität im Freien die dafür wichtigen Wettergrößen und den tatsächlich ausgewählten Ort. Ein Widget für das aktuelle Wetter oder eine Demo auf der Startseite ersetzt nicht die Kontrolle der in der App verfügbaren Vorhersagestunden.",
        "Bei einer Abweichung vergleiche zuerst Ort und Zeitstempel. Unterschiedliche Anbieter, ausgewählte Orte und Vorhersagezeiträume können unterschiedliche Anzeigen ergeben, ohne dass sich der Kalendereintrag geändert haben muss."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Bestätige Ort und Ereignisdatum.",
    "Prüfe die verfügbaren Stunden für die gesamte Aktivität.",
    "Lies Wahrscheinlichkeit und Menge als unterschiedliche Werte.",
    "Prüfe den Ereignisentwurf vor dem Speichern."
  ],
  "seeAlso": [
    "weather-inside-your-calendar",
    "planning-outdoors-without-being-rained-on"
  ],
  "updated": "2026-10-21",
  "faq": [
    {
      "q": "Hat jedes Ereignis eine vollständige Vorhersage?",
      "a": "Nein. Die Abdeckung hängt vom ausgewählten Ort und den verfügbaren Tagen und Stunden ab."
    },
    {
      "q": "Gilt das Wettersymbol für die Ereignisadresse?",
      "a": "Schließe das nicht allein aus seiner Nähe zum Ereignis. Bestätige den Wetterort separat."
    },
    {
      "q": "Speichert das Antippen einer Stunde einen neuen Termin?",
      "a": "Wo verfügbar, öffnet es einen Ereignisentwurf. Prüfe Datum, Uhrzeit und Kalender vor dem Speichern."
    }
  ],
  "sourcesHeading": "Wetterquellen und Standorteinstellungen",
  "sources": [
    {
      "label": "Apple: WeatherKit-Vorhersagen und regionale Verfügbarkeit",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Apple: Datenschutz und Ortungsdienste",
      "url": "https://support.apple.com/en-us/102515"
    }
  ]
},

  'planning-outdoors-without-being-rained-on': {
  "title": "Aktivitäten im Freien planen, ohne im Regen zu stehen",
  "short": "Draußen planen",
  "description": "Eine praktische Methode für Aktivitäten im Freien: Nutze deinen bestehenden Kalender, statt eine separate Wetterroutine aufzubauen.",
  "lede": "Wenn deine Hobbys draußen stattfinden, hast du vermutlich dein eigenes Ritual: Wetter prüfen, die Woche überblicken, raten. Das Raten lässt sich durch bewusstes Vergleichen ersetzen. Dieser Leitfaden stammt von Arte Soft, dem Entwickler von Cloud Calendars.",
  "commonBelief": "Schlechtes Wetter lasse sich vermeiden, indem man die Vorhersage häufiger prüft.",
  "sections": [
    {
      "heading": "Beginne mit Ort und Entscheidung",
      "body": [
        "Wähle den Wetterort passend zur Aktivität und prüfe, ob das betreffende Datum und die Stunden verfügbar sind. Entscheide, was du wissen musst: ob du eine andere Zeit wählen, eine Alternative bereithalten oder die Entscheidung verschieben solltest.",
        "Erneutes Prüfen ändert das Wetter nicht, doch aktualisierte Informationen können wichtig sein. Es gibt keinen einzigen Prüfzeitplan, der für jedes Vorhaben im Freien passt."
      ]
    },
    {
      "heading": "Vergleiche verfügbare Zeiten ohne Ergebnisgarantie",
      "body": [
        "Vergleiche die relevanten stündlichen Angaben für jeden möglichen Zeitraum. Ein Tagessymbol ist eine Zusammenfassung und keine Garantie für die Bedingungen während des ganzen Tages.",
        "Eine Verschiebung um eine Stunde kann helfen, muss es aber nicht. Leite kein trockenes Zeitfenster ab, das die Vorhersage nicht zeigt, und wende keinen allgemeinen Prozentgrenzwert auf jede Aktivität an."
      ]
    },
    {
      "heading": "Plane eine Alternative, bevor du Einladungen änderst",
      "body": [
        "Hängt die Aktivität von geeigneten Bedingungen ab, halte eine realistische Alternative bereit und entscheide, wann du die neuesten Informationen prüfst. Beachte gegebenenfalls örtliche amtliche Hinweise.",
        "Prüfe bei einem geteilten Termin den Organisator und die Bearbeitungsrechte, bevor du ihn verschiebst. Eine günstiger aussehende Vorhersage berechtigt allein nicht dazu, den Zeitplan aller Beteiligten zu ändern."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Bestätige den Vorhersageort sowie die verfügbaren Tage und Stunden.",
    "Vergleiche mögliche Zeiten anhand der für deine Aktivität wichtigen Wetterfaktoren.",
    "Halte eine Alternative bereit und prüfe erneut, bevor die Entscheidung relevant wird.",
    "Beachte örtliche amtliche Hinweise, wenn die Bedingungen die Aktivität gefährlich machen könnten."
  ],
  "seeAlso": [
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather"
  ],
  "updated": "2026-10-21",
  "faq": [
    {
      "q": "Garantiert das Verschieben eines Termins trockenes Wetter?",
      "a": "Nein. Vergleiche die verfügbaren Vorhersagezeiträume und halte eine realistische Alternative bereit."
    },
    {
      "q": "Reicht das Tagessymbol?",
      "a": "Prüfe bei einer Aktivität zu einer bestimmten Uhrzeit die verfügbaren Stunden über ihre gesamte Dauer und bestätige den Ort."
    },
    {
      "q": "Darf ich einen geteilten Termin verschieben, nur weil eine andere Zeit besser aussieht?",
      "a": "Kläre die Zuständigkeit des Organisators, Bearbeitungsrechte und Teilnehmende, bevor du deren Zeitplan änderst."
    }
  ],
  "sources": [
    {
      "label": "Apple: WeatherKit-Vorhersagedaten und regionale Verfügbarkeit",
      "url": "https://developer.apple.com/weatherkit/"
    }
  ]
},

  'a-fourteen-day-view-of-the-weather': {
  "title": "Die verfügbare Vorhersage",
  "short": "Die verfügbare Vorhersage",
  "description": "Cloud Calendars verwendet die verfügbare Vorhersage für den ausgewählten Ort. Stunden- und Tagesdaten können unterschiedliche Zeiträume abdecken.",
  "lede": "Der Zeitraum, den Sie im Kalender aufrufen können, bestimmt nicht die Reichweite der Vorhersage. Eine Monatsansicht bedeutet keine Wettervorhersage für den ganzen Monat oder jeden Termin.",
  "sections": [
    {
      "heading": "Die verfügbare Vorhersage",
      "body": [
        "Cloud Calendars verwendet die verfügbare Vorhersage für den ausgewählten Ort. Stunden- und Tagesdaten können unterschiedliche Zeiträume abdecken.",
        "Der Zeitraum, den Sie im Kalender aufrufen können, bestimmt nicht die Reichweite der Vorhersage. Eine Monatsansicht bedeutet keine Wettervorhersage für den ganzen Monat oder jeden Termin."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Prüfen Sie Ort, Datum und verfügbare Stunden, bevor Sie mit der Vorhersage planen."
  ],
  "seeAlso": [
    "weather-inside-your-calendar",
    "planning-outdoors-without-being-rained-on"
  ],
  "updated": "2026-10-21",
  "sources": [
    {
      "label": "Apple WeatherKit",
      "url": "https://developer.apple.com/weatherkit/"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google und Outlook in einer Ansicht',
    short: 'Drei Konten, eine Ansicht',
    description:
      'Bei den meisten liegt das Leben auf einem privaten Apple-Kalender, einem Google-Konto und einem Exchange-Kalender der Arbeit. Was sich ändert, wenn alle drei in einem Raster stehen.',
    lede: 'Das Problem ist selten, dass einer der Kalender schlecht wäre. Es ist, dass Sie drei davon haben und nur eine Woche.',
    commonBelief: 'Dass getrennte Apps für Arbeit und Privat eine Grenze sind und kein Fehler.',
    sections: [
      {
        heading: 'Die Doppelbuchung ist strukturell',
        body: [
          'Liegen Ihre Verpflichtungen an drei Orten, kann kein einzelner Ort sagen, ob Sie frei sind. Sie selbst sind der Zusammenführungsschritt, und Sie führen ihn aus dem Gedächtnis aus — meist während jemand auf eine Antwort wartet.',
          'Deshalb ist der klassische Fehler nicht, einen Termin zu vergessen. Er ist, etwas zuzusagen, das mit einem Termin kollidiert, den Sie nicht sehen konnten.',
        ],
      },
      {
        heading: 'Was ein Raster gibt',
        body: [
          'Alle Konten in derselben Woche, nach Herkunft eingefärbt, an Ort und Stelle bearbeitbar. Sie hören auf zu fragen, welche App die Antwort hat, weil die Frage keinen Plural mehr hat.',
          'Die Trennung, die Menschen eigentlich wollen, ist visuell und nicht strukturell. Arbeit in einer Farbe und Familie in einer anderen gibt Ihnen die Grenze, ohne den Überblick zu kosten.',
        ],
      },
      {
        heading: 'Wo die Stufen liegen',
        body: [
          'iCloud und Google synchronisieren beide in der kostenlosen Stufe. Microsoft-Konten — Outlook und Exchange — liegen in der bezahlten, weil diese Verbindung laufende Kosten hat, die die anderen nicht haben.',
          'Ist Ihr Arbeitskalender ein Google-Kalender, werden Sie für Synchronisierung nie bezahlen müssen.',
        ],
      },
    ],
    claims: {
      accounts: 'Kontotypen, die sich eine Ansicht teilen können',
      premiumMonthly: 'Monatlicher Preis für Microsoft, in Dollar',
    },
    practical: [
      'Fügen Sie zuerst das private Konto hinzu, dann das, das die Kollisionen verursacht.',
      'Färben Sie nach Konto, nicht nach Kategorie — die Herkunft ist das, was Sie im Vorbeigehen brauchen.',
      'Schreiben Sie weiterhin in den Kalender, den die anderen Beteiligten ohnehin lesen.',
    ],
    seeAlso: ['three-calendar-apps-is-two-too-many', 'free-google-sync-without-adverts'],
  },

  'sharing-one-event-not-your-calendar': {
    title: 'Einen Termin teilen, ohne den Kalender herzugeben',
    short: 'Einen Termin teilen',
    description:
      'Wie das Versenden eines einzelnen Termins funktioniert, was beim Empfänger tatsächlich ankommt — und warum er dafür nichts installieren muss.',
    lede: 'Kalender teilen heißt sonst alles oder nichts: entweder jemand hat Zugriff auf Ihren Kalender oder nicht. Ein Abendessen zu verschicken sollte keines von beidem verlangen.',
    commonBelief:
      'Dass einen Termin zu teilen bedeutet, jemandem ein Fenster in den Rest der Woche zu öffnen.',
    sections: [
      {
        heading: 'Was tatsächlich verschickt wird',
        body: [
          'Beim Anlegen eines Termins wird angeboten, ihn zu teilen. Unterwegs ist ein Link — per Mail, per Nachricht, über das, was Sie installiert haben — und hinter dem Link liegt ein Kalender-Feed, der diesen einen Termin enthält und sonst nichts.',
          'Kein Screenshot, keine Kopie, die veraltet. Verschiebt sich die Zeit, verschiebt sich der Feed mit, und der Empfänger sieht die Änderung, ohne dass Sie noch einmal etwas senden.',
        ],
      },
      {
        heading: 'Er braucht diese App nicht',
        body: [
          'Der Link ist ein gewöhnliches Kalender-Abonnement. Apple Kalender liest ihn, Google Kalender liest ihn, Outlook liest ihn. Jemand mit Android und einem Gmail-Konto kann ihn abonnieren und Ihren Termin sehen; nichts daran verlangt ein iPhone.',
          'In der Nachricht steckt zusätzlich ein App-Clip für alle, die die App wollen — er öffnet sich ohne Installation und zeigt den Termin sofort. Das ist eine Tür, keine Schranke, und der Unterschied zählt, wenn Sie jemanden einladen, den Sie nicht um eine Installation bitten können.',
        ],
      },
      {
        heading: 'Was es nicht ist',
        body: [
          'Es ist nicht sofort. Der Feed bittet Kalender-Apps, stündlich nachzusehen, und das ist eine Bitte und keine Regel — Programme aktualisieren nach eigenem Zeitplan, manche träger als andere. Für ein Abendessen nächste Woche ist das unsichtbar. Für eine Änderung zwanzig Minuten vorher schreiben Sie zusätzlich eine Nachricht.',
          'Geheim ist es auch nicht. Der Link enthält zweiundzwanzig zufällige Zeichen, die niemand errät, aber wer ihn hat, kann den Feed lesen. Behandeln Sie ihn wie einen Dokumentlink: bedenkenlos zu verschicken, und es lohnt sich, ihn zurückzuziehen, wenn er seine Arbeit getan hat.',
          'Und er ist vorerst nur lesbar. Wer ihn bekommt, sieht den Termin. Bearbeiten kann er ihn nicht, und in Ihren Kalender zurückschreiben auch nicht.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Stunden zwischen den Aktualisierungsbitten des Feeds',
      linkLength: 'Zufällige Zeichen im Link, die ihn unerratbar machen',
      sharePrice: 'Was das Teilen kostet',
    },
    practical: [
      'Teilen Sie direkt aus dem Termin heraus, gleich nach dem Anlegen — dort erscheint das Angebot.',
      'Verschicken Sie den Link so, wie Sie diese Person ohnehin erreichen; das Format ist gleichgültig.',
      'Ändern Sie die Zeit kurzfristig, schreiben Sie zusätzlich — verlassen Sie sich nicht auf die stündliche Aktualisierung.',
      'Ziehen Sie den Link zurück, wenn der Termin vorbei ist, wie bei einem geteilten Dokument.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view'],
  },

  'three-calendar-apps-is-two-too-many': {
    title: 'Drei Kalender-Apps sind zwei zu viel',
    short: 'Drei Apps sind zwei zu viel',
    description:
      'Zwischen Kalender-Apps zu wechseln ist kein Arbeitsablauf, sondern eine Steuer. Was sie kostet und wie ihre Abschaffung aussieht.',
    lede: 'Niemand hat sich entschieden, drei Kalender-Apps zu führen. Es ist Konto für Konto passiert, und jede einzelne Ergänzung wirkte vernünftig.',
    commonBelief:
      'Dass App-Wechsel eine kleine Unbequemlichkeit sind und nicht die Quelle des eigentlichen Problems.',
    sections: [
      {
        heading: 'Der Preis ist nicht das Tippen',
        body: [
          'Zwei Sekunden Umschalten sind nichts. Teuer ist, dass Sie Terminfragen aus unvollständiger Information beantworten, weil jedes Mal alle drei zu prüfen mehr Mühe ist, als die Frage zu verdienen scheint.',
          'Also antworten Sie aus der App, die gerade offen ist, und korrigieren später. Die Korrektur ist der teure Teil, und sie landet auch im Kalender von jemand anderem.',
        ],
      },
      {
        heading: 'Was tatsächlich wahr sein muss',
        body: [
          'Ein Ort muss Ja oder Nein zu Ihrer Zeit sagen können. Das ist die ganze Anforderung, und keine Anordnung erfüllt sie, bei der die Antwort in mehr als einer App liegt.',
          'Alles andere — welche App, welche Farben, welche Ansichten — ist Geschmack. Das hier ist Struktur.',
        ],
      },
    ],
    claims: {
      accounts: 'Kontotypen, die eine Ansicht fassen kann',
    },
    practical: [
      'Wählen Sie die App, die alle Ihre Konten hält, nicht die, die Ihnen einzeln am besten gefällt.',
      'Wandern Sie über Konten, nicht über Termine — die Termine bleiben, wo sie sind.',
      'Löschen Sie die anderen Apps, sobald die Ansicht vollständig ist, sonst schauen Sie weiter hinein.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view'],
  },

  'the-widget-that-shows-what-is-next': {
  "updated": "2026-10-21",
  "title": "Kommende Kalendertermine auf dem iPhone-Home-Bildschirm",
  "short": "Kommende Termine im Widget",
  "description": "Wählen Sie ein Termin-Widget, prüfen Sie ausgewählte Kalender und fehlende Einträge. Eine leere Liste bedeutet nicht, dass Ihr Kalender leer ist.",
  "lede": "Für die nächsten Termine brauchen Sie ein Widget mit Terminliste. Eine Kachel mit Datum und Wetter beantwortet eine andere Frage. Dieser Leitfaden wird von Arte Soft, dem Entwickler von Cloud Calendars, veröffentlicht.",
  "sections": [
    {
      "heading": "Zuerst das passende Layout wählen",
      "body": [
        "„Calendar Events“ ist das mittlere Layout mit Terminliste. „Calendar Events Large“ bietet mehr Platz. „Calendar & Weather“ ist ein eigenes Layout für Datum und Wetter; die kleine Variante zeigt nicht automatisch den nächsten Termin. Auf Ihrem Gerät können die Namen übersetzt sein.",
        "Halten Sie einen freien Bereich des Home-Bildschirms gedrückt und öffnen Sie über die Bearbeitungsoptionen die Widget-Auswahl. Suchen Sie Cloud Calendars und vergleichen Sie die Vorschau, bevor Sie ein Layout hinzufügen. Diese iPhone-Auswahl ist von den Kalenderansichten in der App getrennt."
      ]
    },
    {
      "heading": "Welche Termine als kommend gelten",
      "body": [
        "Die Liste berücksichtigt ausgewählte Kalender und zeitlich festgelegte Termine, deren Beginn noch bevorsteht. Ganztägige und bereits begonnene Einträge gehören nicht zu dieser Vorschau. Ein Geburtstag oder eine laufende Besprechung kann deshalb in der App sichtbar sein und im Widget fehlen.",
        "Wenn heute nur ein ganztägiger Reiseeintrag vorhanden ist, beweist eine leere Liste keinen Datenverlust. Öffnen Sie den vollständigen Tag. Lesen Sie außerdem das Datum der nächsten Zeile: Sie kann zu morgen oder einem späteren Tag gehören."
      ]
    },
    {
      "heading": "Zuerst mit der App vergleichen",
      "body": [
        "Suchen Sie in Cloud Calendars einen konkreten zukünftigen Termin. Prüfen Sie den zugehörigen Kalender, dessen Auswahl und den Kalenderzugriff der App. Vergleichen Sie Titel, Datum und Beginn. Fehlt der Termin auch in der App, beginnen Sie bei Konto und Synchronisierung.",
        "Für einen übersichtlichen Vergleich eignet sich ein unverbindlicher Testtermin in einem eigenen Kalender. Verwenden Sie einen eindeutigen Titel und einen zukünftigen Beginn. Ändern Sie dafür keine echte Einladung und entfernen Sie kein Konto."
      ]
    },
    {
      "heading": "Aktualisierungen richtig einordnen",
      "body": [
        "Widgets zeigen gespeicherte Informationen; sie laufen nicht ständig wie eine geöffnete App. iOS bestimmt die Aktualisierung. Öffnen Sie die App und kontrollieren Sie den Termin, ohne daraus eine feste Wartezeit für das Widget abzuleiten.",
        "Bleibt die App korrekt und das Widget falsch, notieren Sie Layout, Kalender, Terminzeit sowie App- und iOS-Version. Eine leere Liste, ein alter Termin und eine falsche Uhrzeit sind unterschiedliche Beobachtungen."
      ]
    },
    {
      "heading": "Wetter getrennt vom Termin prüfen",
      "body": [
        "Das Wetter neben dem Datum ist keine Vorhersage für den Ort und die Startzeit jeder Besprechung. Prüfen Sie für einen Ausflug den gewünschten Ort und die passende Stunde in der Wetteransicht.",
        "Nutzen Sie das Widget zur Orientierung und den vollständigen Kalender für ganztägige Verpflichtungen, Details und die gesamte Tagesplanung."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Ein Layout mit Terminliste auswählen.",
    "Einen zukünftigen Termin im ausgewählten Kalender prüfen.",
    "Datum und Uhrzeit zunächst mit der App vergleichen.",
    "Dauerhafte Abweichungen dokumentieren, statt Daten zu löschen."
  ],
  "faq": [
    {
      "q": "Warum fehlt mein Geburtstag?",
      "a": "Die Vorschau schließt ganztägige Einträge aus. Prüfen Sie Geburtstage im vollständigen Kalender."
    },
    {
      "q": "Zeigt das kleine Widget den nächsten Termin?",
      "a": "Das kleine Layout „Calendar & Weather“ zeigt Datum und Wetter. Für Termine wählen Sie eine Terminliste."
    },
    {
      "q": "Bedeutet eine leere Liste, dass ich heute frei habe?",
      "a": "Nein. Ganztägige oder laufende Termine, nicht ausgewählte Kalender und veraltete Informationen können fehlen."
    }
  ],
  "sourcesHeading": "Quellen und Apple-Anleitungen",
  "sources": [
    {
      "label": "Apple: Widgets auf dem iPhone hinzufügen und bearbeiten",
      "url": "https://support.apple.com/118610"
    },
    {
      "label": "Apple: Widgets aktuell halten",
      "url": "https://developer.apple.com/documentation/widgetkit/keeping-a-widget-up-to-date"
    }
  ],
  "seeAlso": [
    "a-countdown-to-your-next-meeting"
  ]
},

  'a-countdown-to-your-next-meeting': {
  "updated": "2026-10-21",
  "title": "Ein Kalender-Countdown ergänzt Erinnerungen",
  "short": "Countdown zum nächsten Termin",
  "description": "Nutzen Sie die Live Activity für kommende Termine. Prüfen Sie geänderte Startzeiten und behalten Sie Erinnerungen unabhängig vom Countdown bei.",
  "lede": "Ein Countdown hilft, die verbleibende Zeit einzuschätzen. Dafür muss die angezeigte Aktivität aber den richtigen Termin und dessen aktuellen Beginn kennen. Dieser Leitfaden wird von Arte Soft, dem Entwickler von Cloud Calendars, veröffentlicht.",
  "sections": [
    {
      "heading": "Mit einem bestätigten Termin beginnen",
      "body": [
        "Öffnen Sie zuerst den Termin und prüfen Sie Datum, Beginn und Kalenderauswahl. Der Countdown folgt zukünftigen Terminen mit Uhrzeit. Er ist weder ein Countdown für ganztägige Einträge noch eine Restzeitanzeige für bereits laufende Besprechungen.",
        "Starten Sie die Aktivität mit „Live“, sofern verfügbar. Während sie läuft, wird daraus „Stop“. Fehlt die Funktion, prüfen Sie in den iPhone-Einstellungen, ob Live Activities für die App erlaubt sind. Bezeichnungen und Verfügbarkeit können variieren."
      ]
    },
    {
      "heading": "Zwei Anzeigeorte unterscheiden",
      "body": [
        "Die Aktivität kann den nächsten Termin auf dem Sperrbildschirm anzeigen. Auf unterstützten iPhones gibt es zusätzlich eine Darstellung in der Dynamic Island. Apples Anleitung erklärt, wie sich dort weitere Details öffnen lassen.",
        "Ein Home-Bildschirm-Widget ist eine separate Anzeige. Das Hinzufügen eines Widgets startet nicht automatisch eine Live Activity; auch das Einschalten von Benachrichtigungstönen ist kein Startbefehl."
      ]
    },
    {
      "heading": "Nicht nur auf die Zahl schauen",
      "body": [
        "Ein Countdown kann weiterlaufen, obwohl sein gespeicherter Startzeitpunkt inzwischen falsch ist. Wird eine Besprechung verschoben, beweist die sich ändernde Zahl nicht, dass diese Änderung angekommen ist. Prüfen Sie auch Titel, Datum und die angezeigte Aktualisierungsinformation.",
        "Öffnen Sie nach wichtigen Änderungen die App und vergleichen Sie den gespeicherten Termin mit der Aktivität. Bei Abweichungen richten Sie sich zunächst nach den bestätigten Termindetails."
      ]
    },
    {
      "heading": "Erinnerungen unabhängig beibehalten",
      "body": [
        "Ein sichtbarer Countdown hilft nur, wenn Sie hinsehen. Behalten Sie für wichtige Termine eine geeignete Erinnerung bei und prüfen Sie die Benachrichtigungsberechtigung getrennt. Ersetzen Sie einen benötigten Hinweis nicht durch die bloße Anzeige.",
        "Planen Sie auch Vorbereitung und Anfahrt ein. Die Zahl zählt bis zum Terminbeginn, nicht bis zu einer unabhängig geprüften Abfahrtszeit. Prüfen Sie Ort und Zeitbedarf selbst."
      ]
    },
    {
      "heading": "Fehlende oder alte Anzeigen eingrenzen",
      "body": [
        "Prüfen Sie zuerst den Termin in der App, danach den Start und die Berechtigung der Aktivität. Hintergrundaktualisierungen hängen von iOS ab; die Anzeige garantiert keine ununterbrochene Synchronisierung.",
        "Vergleichen Sie einen unverbindlichen zukünftigen Testtermin vor und nach einer Zeitänderung. Notieren Sie erwarteten und angezeigten Beginn sowie das Ergebnis nach erneutem Öffnen der App. Lassen Sie echte Einladungen unverändert."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Zukünftigen Termin und Kalender bestätigen.",
    "„Live“ starten und den angezeigten Termin prüfen.",
    "Nach einer Verschiebung erneut vergleichen.",
    "Benötigte Erinnerungen getrennt aktiviert lassen."
  ],
  "faq": [
    {
      "q": "Ist der Countdown immer aktuell?",
      "a": "Nein. Er kann auf einen früher gespeicherten Beginn zählen. Prüfen Sie wichtige Änderungen in der App."
    },
    {
      "q": "Warum fehlt ein ganztägiger Termin?",
      "a": "Die Aktivität berücksichtigt zukünftige Termine mit Uhrzeit."
    },
    {
      "q": "Hat jedes iPhone eine Dynamic Island?",
      "a": "Nein. Die Anzeige auf dem Sperrbildschirm und die Dynamic Island sind unterschiedliche Funktionen; Letztere benötigt ein unterstütztes Modell."
    }
  ],
  "sourcesHeading": "Quellen und Apple-Anleitungen",
  "sources": [
    {
      "label": "Apple: Funktionen und Live Activities auf dem Sperrbildschirm",
      "url": "https://support.apple.com/guide/iphone/access-features-from-the-lock-screen-iphcd5c65ccf/ios"
    },
    {
      "label": "Apple: Live Activities in der Dynamic Island",
      "url": "https://support.apple.com/guide/iphone/view-live-activities-in-the-dynamic-island-iph28f50d10d/ios"
    }
  ],
  "seeAlso": [
    "the-widget-that-shows-what-is-next"
  ]
},

  'drag-an-event-to-move-it': {
    title: 'Einen Termin verschieben, indem man ihn zieht',
    short: 'Ziehen statt Formular',
    description:
      'Umplanen sollte eine Geste kosten, kein Formular. Warum direkte Manipulation im Kalender mehr zählt als fast überall sonst.',
    lede: 'Termin öffnen, Zeitfeld antippen, Rad drehen, sichern: vier Schritte für etwas, das Sie mit dem Finger schon gezeigt hatten.',
    commonBelief: 'Dass ein Formular genau ist und Ziehen ungefähr.',
    sections: [
      {
        heading: 'Das Formular ist nicht genauer',
        body: [
          'Ein Zug landet auf dem Raster, und das Raster ist in den Einheiten, in denen Sie ohnehin planen. Sie sind nicht ungenau; Sie arbeiten in der Auflösung, die der Tag hat.',
          'Wo Genauigkeit wirklich zählt — ein Flug, eine Buchung auf die Minute — gibt es das Formular weiterhin. Es hört nur auf, der Normalfall für die neunzig Prozent zu sein, die „eine Stunde später“ heißen.',
        ],
      },
      {
        heading: 'Verschieben ist häufiger als Anlegen',
        body: [
          'Die meiste Kalenderarbeit ist Umräumen, nicht Eintragen. Wer das einmal bemerkt, sieht, dass eine App, die das Anlegen elegant und das Umräumen mühsam macht, die seltenere Hälfte optimiert hat.',
          'Ziehen und in der Größe ändern macht aus dem Umräumen das, was es im Kopf ohnehin ist: das hier, aber später, und ein bisschen länger.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Ziehen Sie für alles Ungefähre, öffnen Sie den Termin für alles Exakte.',
      'Ändern Sie die Dauer an der Kante, statt eine Endzeit zu tippen.',
      'In der Wochenansicht verschiebt ein Zug über Tage hinweg Datum und Uhrzeit gemeinsam.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view'],
  },

  'free-google-sync-without-adverts': {
    title: 'Kostenlose Google-Synchronisierung — und wofür die Werbung bezahlt',
    short: 'Kostenlos, und die Werbung',
    description:
      'Was die kostenlose Stufe wirklich enthält, wo Werbung erscheint und was ihre Entfernung kostet. Klar gesagt, weil die meisten Apps das nicht tun.',
    lede: 'Kostenlose Kalender-Apps sind meist kostenlos, weil etwas anderes verkauft wird. Es lohnt sich zu wissen, was — bevor man ihr seine Woche anvertraut.',
    commonBelief:
      'Dass eine kostenlose Stufe eine Testphase ist und die richtige App hinter der Bezahlschranke liegt.',
    sections: [
      {
        heading: 'Was kostenlos tatsächlich abdeckt',
        body: [
          'Alle Ansichten, iCloud-Synchronisierung, Google-Synchronisierung, das gesamte Wetter im Kalender, Widgets, Meet-Links an Terminen und Bearbeiten per Ziehen. Kein Test dieser Dinge — diese Dinge.',
          'Liegen Ihre Kalender bei Apple und Google, was bei den meisten der Fall ist, dann ist die kostenlose Stufe die App.',
        ],
      },
      {
        heading: 'Was die Werbung tut und was ihre Entfernung kostet',
        body: [
          'Die kostenlose Stufe trägt Werbung. Sie zu entfernen ist die günstigste bezahlte Stufe, und Werbung zu entfernen ist ehrlich gesagt das meiste, wofür diese Stufe da ist.',
          'Das so zu sagen scheint besser als die übliche Anordnung, in der die werbefreie Stufe mit Funktionen gebündelt wird, nach denen niemand gefragt hat, damit der Preis nach mehr aussieht.',
        ],
      },
    ],
    claims: {
      price: 'Preis der kostenlosen Stufe',
      advancedMonthly: 'Monatlicher Preis ohne Werbung, in Dollar',
    },
    practical: [
      'Fangen Sie kostenlos an; die Synchronisierung, die Sie brauchen, ist wahrscheinlich schon da.',
      'Zahlen Sie, um Werbung loszuwerden, nicht weil Sie erwarten, dass die App sich ändert.',
      'Die oberste Stufe lohnt sich nur, wenn Ihr Arbeitskalender bei Microsoft liegt.',
    ],
    seeAlso: ['what-a-subscription-actually-buys', 'icloud-google-and-outlook-in-one-view'],
  },

  'what-a-subscription-actually-buys': {
  "updated": "2026-10-21",
  "title": "Was ein Abonnement tatsächlich bringt, Stufe für Stufe",
  "short": "Was ein Abo bringt",
  "description": "Was ein Abo bringt: Base, Advanced, Premium.",
  "lede": "Dieser Leitfaden stammt von Arte Soft, dem Entwickler von Cloud Calendars.",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "Base umfasst Google-Calendar-Synchronisierung, Google Meet, Kalenderansichten, Wetter und Widgets. Der kostenlose Tarif kann Werbung anzeigen."
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Advanced enthält Base und entfernt Werbung. Premium enthält Advanced und ergänzt Microsoft Calendar und Microsoft Teams.",
        "Ein Abonnement kauft keine Bearbeitungsrechte für fremde Kalender und umgeht keine Einschränkungen eines Arbeitskontos."
      ]
    },
    {
      "heading": "Informationen zu Kauf und Kündigung",
      "body": [
        "Prüfen Sie vor dem Kauf den lokalen Preis, den Abrechnungszeitraum und die Verlängerungsbedingungen.",
        "Für ein über Apple abgerechnetes Abo öffnen Sie Einstellungen → Ihr Name → Abonnements. Prüfen Sie Status und Ablaufdatum. Die Kündigung der Verlängerung ist vom Löschen der App oder von Kalenderdaten getrennt; kostenpflichtige Funktionen bleiben nach Ablauf nicht automatisch verfügbar."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Prüfen Sie vor dem Kauf den lokalen Preis, den Abrechnungszeitraum und die Verlängerungsbedingungen.",
    "Ein Abonnement kauft keine Bearbeitungsrechte für fremde Kalender und umgeht keine Einschränkungen eines Arbeitskontos."
  ],
  "faq": [
    {
      "q": "Wie beende ich die Verlängerung?",
      "a": "Für ein über Apple abgerechnetes Abo öffnen Sie Einstellungen → Ihr Name → Abonnements. Prüfen Sie Status und Ablaufdatum. Die Kündigung der Verlängerung ist vom Löschen der App oder von Kalenderdaten getrennt; kostenpflichtige Funktionen bleiben nach Ablauf nicht automatisch verfügbar."
    }
  ],
  "sourcesHeading": "Informationen zu Kauf und Kündigung",
  "sources": [
    {
      "label": "Apple: Wie beende ich die Verlängerung?",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "free-google-sync-without-adverts"
  ]
},
};
