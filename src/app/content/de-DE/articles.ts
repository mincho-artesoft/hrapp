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
  "title": "Die Vorhersage neben jedem Termin, nicht nur beim Tag",
  "short": "Vorhersage am Termin",
  "description": "Eine Tagesübersicht mittelt genau die Stunden weg, auf die es ankommt. Was Wetter pro Termin bedeutet und warum der Unterschied draußen zählt.",
  "lede": "Die meisten Kalender, die überhaupt Wetter zeigen, zeigen ein Symbol pro Tag. Dieses Symbol ist ein Mittelwert — und der Mittelwert aus nassem Vormittag und trockenem Nachmittag ist ein Nieselregen, den es nie gegeben hat.",
  "commonBelief": "Dass ein Wettersymbol am Tag dasselbe ist wie eine Vorhersage am Termin.",
  "sections": [
    {
      "heading": "Was ein Tagessymbol verbirgt",
      "body": [
        "Nehmen Sie einen Tag, an dem es bis elf stark regnet und danach aufklart. Die Tagesübersicht wählt etwas dazwischen und zeigt eine Wolke. Sie sehen bei Ihrem Zwei-Uhr-Termin die Wolke und verschieben einen Spaziergang, der nie hätte verschoben werden müssen.",
        "Der Fehler geht in beide Richtungen. Ein Tag, der bis auf eine heftige Stunde um sechs schön ist, erscheint als schön — und der eine Termin, auf den es ankam, ist der, den es erwischt."
      ]
    },
    {
      "heading": "Die Vorhersage an die Stunden hängen",
      "body": [
        "Ein Termin belegt bestimmte Stunden. Die Vorhersage für diese Stunden ist eine andere Zahl als die für seinen Tag, und sie ist die einzige, die Ihre eigentliche Frage beantwortet.",
        "Öffnen Sie einen Termin, und die gezeigten Bedingungen sind die seines Zeitfensters. Ein Drei-Stunden-Block bekommt die drei Stunden, nicht die vierundzwanzig."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Prüfen Sie den Termin, nicht den Tag, wenn der Plan vom Wetter abhängt.",
    "Sehen Sie bei allem, was länger als zwei Stunden dauert, wie sich die Bedingungen über den Block bewegen.",
    "Verschieben Sie, bevor Sie absagen — eine Stunde in eine Richtung ist oft der ganze Unterschied."
  ],
  "seeAlso": [
    "weather-inside-your-calendar",
    "planning-outdoors-without-being-rained-on"
  ],
  "updated": "2026-10-21"
},

  'planning-outdoors-without-being-rained-on': {
  "title": "Draußen planen, ohne nass zu werden",
  "short": "Draußen planen",
  "description": "Eine praktische Methode, alles zu terminieren, was im Freien stattfindet — mit dem Kalender, den Sie ohnehin führen, statt mit einer zweiten Wetterroutine.",
  "lede": "Wenn Ihre Hobbys draußen stattfinden, haben Sie wahrscheinlich ein privates Ritual entwickelt: Wetter prüfen, auf die Woche schielen, raten. Das Raten kann weg.",
  "commonBelief": "Dass man schlechtem Wetter entgeht, indem man öfter nachsieht.",
  "sections": [
    {
      "heading": "Öfter nachsehen hilft nicht",
      "body": [
        "Die Wetter-App fünfmal zu öffnen verbessert nicht die Vorhersage, sondern die Nervosität. Was Ergebnisse ändert, ist ein Blick auf die Vorhersage in dem Moment, in dem Sie einen Zeitpunkt wählen — und das ist ein völlig anderer Moment.",
        "Dieser Moment findet im Kalender statt. Ist das Wetter nicht dort, treffen Sie die Entscheidung ohne es und korrigieren später."
      ]
    },
    {
      "heading": "Den Termin gegen die Woche wählen",
      "body": [
        "Sehen Sie die Woche mit den Bedingungen dahinter, entscheidet sich die Sache meist von selbst. Zwei mögliche Nachmittage, einer trocken — da gibt es nichts abzuwägen.",
        "Die Gewohnheit, die sich lohnt, ist klein: bevor Sie etwas nach draußen legen, schauen Sie auf das Band, nicht in eine zweite App."
      ]
    },
    {
      "heading": "Dann die Stunden prüfen, nicht den Tag",
      "body": [
        "Sobald der Termin existiert, zählt seine eigene Vorhersage. Ein Tag kann nass sein und Ihre zwei Stunden trocken — die Tagesübersicht wird Ihnen das nie sagen.",
        "Verschieben statt absagen. Eine Stunde in beide Richtungen rettet mehr Pläne als jedes erneute Nachsehen."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Legen Sie Termine im Freien aus der Wochenansicht heraus, mit sichtbaren Bedingungen.",
    "Prüfen Sie zwei Tage vorher die Stunden des Termins, nicht seinen Tag.",
    "Verschieben Sie um eine Stunde, bevor Sie den Plan aufgeben.",
    "Bei allem, was weiter als eine Woche entfernt ist: Tag wählen und akzeptieren, dass Sie später nachjustieren."
  ],
  "seeAlso": [
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather"
  ],
  "updated": "2026-10-21"
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
    title: 'Ein Widget, das eine einzige Frage beantwortet',
    short: 'Das Widget für das Nächste',
    description:
      'Die meisten Kalender-Widgets versuchen, ein kleiner Kalender zu sein. Die nützlichen beantworten die eine Frage, die Sie zwanzigmal am Tag stellen.',
    lede: 'Sie entsperren Ihr Telefon nicht, um im Kalender zu blättern. Sie entsperren es, um zu erfahren, was als Nächstes kommt und wie viel Zeit bleibt.',
    commonBelief: 'Dass ein gutes Kalender-Widget eine Monatsansicht in klein ist.',
    sections: [
      {
        heading: 'Kleine Flächen bestrafen Dichte',
        body: [
          'Ein in ein Widget gequetschter Monat ist im Vorbeigehen unlesbar — und im Vorbeigehen ist die einzige Art, wie ein Widget je gelesen wird. Am Ende öffnen Sie doch die App, und das Widget hat Platz gekostet, ohne etwas zu geben.',
          'Das Widget, das seinen Platz verdient, zeigt das Nächste, die Uhrzeit und, wenn es zählt, wie der Himmel dort aussieht.',
        ],
      },
      {
        heading: 'Warum das Wetter aus demselben Grund dazugehört',
        body: [
          'Die zwei Dinge, die Sie vor dem Aufbrechen wissen wollen, sind wann und wie es draußen ist. Auf zwei Widgets verteilt entsteht das Zwei-App-Problem noch einmal, nur auf kleinerem Bildschirm.',
          'Ein Blick, beide Antworten, kein Entsperren.',
        ],
      },
    ],
    claims: {
      views: 'Ansichten in der App selbst, wenn Sie sie doch öffnen',
    },
    practical: [
      'Legen Sie das Widget dorthin, wo Ihr Daumen landet, nicht dorthin, wo es ordentlich aussieht.',
      'Nehmen Sie eine größere Größe nur, wenn Sie wirklich mehr als den nächsten Eintrag lesen.',
      'Prüfen Sie direkt nach dem Kalender das Wetter, nehmen Sie ein Widget, das beides trägt.',
    ],
    seeAlso: ['a-countdown-to-your-next-meeting'],
  },

  'a-countdown-to-your-next-meeting': {
    title: 'Ein Countdown auf dem Sperrbildschirm bis zum Nächsten',
    short: 'Countdown bis zum Termin',
    description:
      'Eine Live-Aktivität macht aus „wann ist es“ ein „wie lange habe ich noch“ — und das war die eigentliche Frage.',
    lede: 'Zwischen „der Termin ist um drei“ und „ich habe elf Minuten“ liegt ein großer praktischer Unterschied, und nur eines von beidem ändert, was Sie als Nächstes tun.',
    commonBelief: 'Dass eine Benachrichtigung ein paar Minuten vorher reicht.',
    sections: [
      {
        heading: 'Eine Uhrzeit ist keine Dauer',
        body: [
          '„Drei Uhr“ zu lesen zwingt Sie zu einer Rechnung gegen eine Uhr, die Sie erst suchen müssen. „Elf Minuten“ nicht. Das Zweite ist handlungsfähig, das Erste ist ein Nachschlagen.',
          'Am wichtigsten ist das in den zwanzig Minuten vor etwas — genau dann, wenn Menschen sich verschätzen.',
        ],
      },
      {
        heading: 'Warum es auf dem Sperrbildschirm lebt',
        body: [
          'Der Countdown aktualisiert sich an Ort und Stelle, ein Blick genügt. Keine App zu öffnen, keine Meldung wegzuwischen, und die Information stimmt jedes Mal, wenn Sie hinsehen — statt einmal zu stimmen, als sie ausgelöst wurde.',
          'Eine einzelne Erinnerung fünf Minuten vorher sagt dasselbe genau einmal und hört dann auf zu helfen.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Verlassen Sie sich für die letzte halbe Stunde auf den Countdown und für den Vortag auf Erinnerungen.',
      'Brechen Sie regelmäßig zu spät auf, beobachten Sie die Zahl statt eine frühere Erinnerung zu setzen — die Erinnerung ist leicht wegzuwischen, die Zahl nicht.',
    ],
    seeAlso: ['the-widget-that-shows-what-is-next'],
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
