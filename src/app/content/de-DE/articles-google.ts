import { LocalisedArticle } from '../types';

/** Die sechs Google-Artikel: konkrete Fragen, klar beantwortet. */
export const GOOGLE_DE_DE: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
  "title": "Google-Kalender freigeben: den tatsächlichen Zugriff prüfen",
  "short": "Google-Kalender: Zugriff und Privatsphäre",
  "description": "Wähle Zugriff auf Verfügbarkeit, Details oder Bearbeitung. Prüfe vor dem Teilen auch öffentliche und Gruppenfreigaben, nicht nur einzelne Personen.",
  "lede": "Entscheide vor einer Kalenderfreigabe, was die andere Person tun soll. Termine um deine Verfügbarkeit herum planen, Details lesen und den Kalender pflegen sind unterschiedliche Aufgaben. Dieser Leitfaden stammt von Arte Soft, dem Entwickler von Cloud Calendars.",
  "commonBelief": "Eine eingeschränkte Berechtigung für eine Person garantiere, dass sie über keinen anderen Weg Details sehen kann.",
  "sections": [
    {
      "heading": "Passe den Zugriff an die Aufgabe an",
      "body": [
        "Ein Kollege, der einen Termin abstimmt, braucht möglicherweise nur deine Verfügbarkeit ohne Details. Wer einen Projektplan pflegt, benötigt eine andere Regelung. Bestimme zuerst die Aufgabe und prüfe dann die Berechtigung in den aktuellen Freigabeeinstellungen des Kalenders.",
        "Google unterscheidet Verfügbarkeit, Ereignisdetails und mehrere Bearbeitungsstufen. Eine Bearbeitungsoption beschränkt den Zugriff auf private Ereignisse; eine andere erlaubt Bearbeitung und Details, die stärkste zusätzlich die Verwaltung von Freigaben. Nicht jede Option mit dem Wort „Änderungen“ ist gleichwertig."
      ]
    },
    {
      "heading": "Prüfe kalenderweite Zugriffe und einzelne Personen",
      "body": [
        "Prüfe neben namentlich aufgeführten Personen, ob der Kalender öffentlich, für die Organisation oder über eine Gruppe verfügbar ist. Laut Google kann ein weiter gefasster Kalenderzugriff eine engere Berechtigung überwiegen: Eine Person einzuschränken nimmt bereits öffentliche Details nicht zurück.",
        "Ein Beispiel ist ein für Mitglieder veröffentlichter Vereinsplan. Bevor du dort einen privaten Termin einträgst, prüfe den Empfängerkreis statt nur die Berechtigung neben einem Freund. Bewahre private Termine an einem geeigneten Ort auf."
      ]
    },
    {
      "heading": "Nutze Googles Einstellungen für den genauen Kalender",
      "body": [
        "Suche in Google Kalender am Computer unter deinen Kalendern den richtigen, öffne sein Menü und seine Freigabeeinstellungen. Google dokumentiert getrennte Bereiche für Personen oder Gruppen und weiter gefassten Zugriff. Prüfe Kalendername und angemeldetes Konto vor einer Änderung.",
        "Bestätige beim Einladen die vorgesehene Google-Identität. Findet die Person den Kalender nicht, prüfe Adresse und Einladungsnachricht, statt die Freigabe auszuweiten, damit er erscheint. Eine fehlende Anzeige und unzureichende Bearbeitungsrechte sind verschiedene Probleme."
      ]
    },
    {
      "heading": "Teste ohne private Termine",
      "body": [
        "Verwende einen gewöhnlichen Testtermin ohne privaten Titel, Notizen, Ort oder Gästeliste. Bitte die vorgesehene Person zu bestätigen, was sie sieht und – nur wenn Bearbeitung nötig und erlaubt ist – was sie ändern kann. Gib für diesen Test keine Zugangsdaten weiter.",
        "Notiere Kalender und gewährte Rolle und prüfe das Ergebnis nach einer Einstellungsänderung. Das bestätigt die beabsichtigte Regelung, beweist aber nicht, dass zuvor gelesene oder kopierte Informationen verschwunden sind. Teste nicht durch Veröffentlichung eines echten Arbeitsplans."
      ]
    },
    {
      "heading": "Trenne Arbeitsrichtlinien und App-Tarife",
      "body": [
        "Google weist darauf hin, dass Administratoren von Arbeits- oder Schulkonten die Freigaben beschränken können. Fehlt die benötigte Einstellung, nutze den genehmigten Weg der Organisation. Veröffentliche keine Arbeitsinformationen, um Kontobeschränkungen zu umgehen.",
        "Cloud Calendars kann verbundene Kalender anzeigen, doch seine Tarifnamen definieren Google-Berechtigungen nicht neu. Advanced entfernt Werbung; damit wird keiner anderen Person Zugriff auf jedes Google-Ereignis gekauft. Prüfe die Freigabe beim Anbieter und das tatsächlich akzeptierte Ergebnis, statt dich allein auf einen verfügbaren lokalen Editor zu verlassen."
      ]
    },
    {
      "heading": "Prüfe und entferne nicht mehr benötigte Zugriffe",
      "body": [
        "Prüfe nach Projektende tatsächliche Empfänger, Gruppen und weiter gehende Veröffentlichungen. Eine einzelne Person zu entfernen ist nur ein Teil der Prüfung, wenn andere Zugriffswege bestehen. Vereinbart, wer den Plan pflegt und wie spätere Rechteänderungen gehandhabt werden.",
        "Google dokumentiert das Entfernen von Personen oder Gruppen getrennt vom Abschalten breiterer Freigaben. Ein entzogener Zugriff holt keine exportierte Datei, kein Bildschirmfoto und keine anderweitig kopierten Informationen zurück. Kläre solche Kopien separat mit den Beteiligten, statt zu versprechen, ein Schalter lösche alle bisherigen Kopien."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Bestimme Kalender und Aufgabe der empfangenden Person.",
    "Prüfe persönliche, Gruppen-, Organisations- und öffentliche Zugriffe.",
    "Wähle die passende Berechtigung in den aktuellen Google-Einstellungen.",
    "Bestätige die Identität vor einer Rechteänderung.",
    "Prüfe ein unbedenkliches Testereignis aus Sicht der empfangenden Person.",
    "Überprüfe überholte Zugriffswege, ohne eine Rückholung früherer Kopien anzunehmen."
  ],
  "faq": [
    {
      "q": "Überwiegt eine eingeschränkte persönliche Berechtigung einen öffentlichen Kalender?",
      "a": "Nein. Google dokumentiert, dass breitere Kalenderrechte bei widersprüchlichen Einstellungen Vorrang haben. Prüfe öffentliche und organisatorische Freigaben ebenso wie den Eintrag der Person."
    },
    {
      "q": "Zeigen alle Bearbeitungsrechte private Ereignisse auf dieselbe Weise?",
      "a": "Nein. Google beschreibt eine Bearbeitungsoption mit eingeschränktem Zugriff auf private Ereignisse getrennt von weiteren Bearbeitungs- und Freigabeverwaltungsrechten. Lies vor der Auswahl die genaue aktuelle Berechtigung."
    },
    {
      "q": "Ändert der Kauf von Advanced die Google-Freigaberechte?",
      "a": "Nein. Advanced entfernt Werbung in Cloud Calendars. Der Anbieterzugriff hängt von Kalenderrechten und möglichen Organisationsbeschränkungen ab."
    }
  ],
  "sourcesHeading": "Aktuelle Google-Hinweise zu Rechten und Freigaben",
  "sources": [
    {
      "label": "Google: Kalenderberechtigungen auswählen",
      "url": "https://support.google.com/calendar/answer/15716974?hl=en"
    },
    {
      "label": "Google: Kalender freigeben und Zugriff entfernen",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    }
  ],
  "seeAlso": [
    "why-a-shared-calendar-does-not-appear"
  ],
  "updated": "2026-10-21"
},

  'why-a-shared-calendar-does-not-appear': {
    "updated": "2026-10-21",
    "title": "Ein Kalender wurde für Sie freigegeben und ist nicht da",
    "short": "Geteilter Kalender fehlt",
    "description": "Fehlenden Google-Kalender finden: eingeladenes Konto, Gruppenmitgliedschaft, Sichtbarkeit und Art des erhaltenen Links prüfen.",
    "lede": "Dieser Leitfaden stammt von Arte Soft, dem Entwickler von Cloud Calendars. Unterscheiden Sie zunächst fehlenden Zugriff von einem ausgeblendeten Kalender.",
    "commonBelief": "Dass Annehmen einen geteilten Kalender auf Ihr Telefon bringt.",
    "sections": [
      {
        "heading": "Konto und Gruppe prüfen",
        "body": [
          "Vergleichen Sie den Empfänger der Einladung mit dem Google-Konto auf dem Telefon und im Browser. Öffnen Sie den Einladungslink mit dem vorgesehenen Konto. Google unterstützt Freigaben für Personen und Google-Gruppen. Bei Gruppenzugriff lassen Sie Ihre Mitgliedschaft von der Gruppenverwaltung und die Freigabe der richtigen Gruppe vom Kalenderinhaber prüfen. Eine weitergeleitete E-Mail allein erteilt keine Berechtigung."
        ]
      },
      {
        "heading": "Ausgeblendet, fehlend oder eingeschränkt?",
        "body": [
          "Öffnen Sie in Google Kalender auf iPhone oder iPad das Menü. Ist der Kalender aufgeführt, aber nicht ausgewählt, aktivieren Sie ihn. Fehlt er, lassen Sie den Inhaber den Zugriff prüfen: Eine Anfrage ist noch keine Genehmigung. Organisationsrichtlinien können Freigaben begrenzen. Vergleichen Sie dasselbe Konto in Google Kalender im Web. Funktioniert es dort, prüfen Sie das verbundene Konto und die Kalenderauswahl der anderen App. Lesezugriff erlaubt keine Bearbeitung."
        ]
      },
      {
        "heading": "Welche Art von Link ist es?",
        "body": [
          "Auch eine Freigabeeinladung enthält einen Link; nicht jeder Link ist ein ICS-Abonnement. Fragen Sie, ob er Zugriff auf einen Google-Kalender gewährt oder einen schreibgeschützten Feed veröffentlicht. Laut Google erfordert ein neues Kalenderabonnement einen Computerbrowser; das Öffnen eines bereits per E-Mail geteilten Kalenders ist ein anderer Vorgang. Feed-Aktualisierungen hängen vom empfangenden Dienst ab. Es gibt keine allgemeine Wartezeit; dringende Änderungen direkt bestätigen lassen."
        ]
      }
    ],
    "claims": {},
    "faq": [
      {
        "q": "Kann eine Google-Gruppe Kalenderzugriff erhalten?",
        "a": "Ja. Prüfen Sie die freigegebene Gruppe, Ihre Mitgliedschaft und Organisationsregeln. Eine weitergeleitete Gruppenmail belegt keinen Zugriff."
      },
      {
        "q": "Soll ich das Konto löschen und neu verbinden?",
        "a": "Prüfen Sie zuerst Konto, Rechte und Sichtbarkeit sowie den Kalender im Web. Erneutes Verbinden erteilt keine fehlenden Rechte."
      }
    ],
    "practical": [
      "Eingeladenes Konto und Gruppenmitgliedschaft bestätigen.",
      "Einen aufgeführten, ausgeblendeten Kalender aktivieren.",
      "Vor Verbindungsänderungen den Zugriff vom Inhaber prüfen lassen."
    ],
    "sourcesHeading": "Quellen und weiterführende Informationen",
    "sources": [
      {
        "label": "Google: Konto und Gruppe prüfen",
        "url": "https://support.google.com/calendar/answer/37082?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Ausgeblendet, fehlend oder eingeschränkt?",
        "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Welche Art von Link ist es?",
        "url": "https://support.google.com/calendar/answer/37648?hl=en"
      }
    ],
    "seeAlso": [
      "who-can-see-what-in-google-calendar",
      "google-calendars-that-never-reach-your-iphone"
    ]
  },

  'the-secret-address-of-a-google-calendar': {
  "title": "Googles geheime iCal-Adresse: abonnieren und Freigaben unterscheiden",
  "short": "Die geheime iCal-Adresse",
  "description": "Verstehe Googles geheime iCal-Adresse, Kontoverbindungen und Feeds. Reagiere auf Offenlegung ohne Versprechen sofortiger Updates oder gelöschter Kopien.",
  "lede": "Eine Kalenderadresse, eine Kontoverbindung und eine Einladung erfüllen unterschiedliche Aufgaben. Kläre zuerst, was du hast, bevor du einen Terminplan in eine andere Anwendung übernimmst. Dieser Leitfaden stammt von Arte Soft, dem Entwickler von Cloud Calendars.",
  "commonBelief": "Eine geheime Kalenderadresse ist eine persönliche Einladung, die sich für genau einen Empfänger zurückziehen lässt.",
  "sections": [
    {
      "heading": "Die passende Verbindung wählen",
      "body": [
        "Google unterscheidet die Anmeldung in einer anderen Kalenderanwendung von der Anzeige über eine geheime iCal-Adresse. Eine Kontoverbindung kann Bearbeitung ermöglichen; die Adresse bietet ein Abonnement nur zur Ansicht. Google beschreibt die geheime Adresse als für den eigenen Gebrauch bestimmt und rät von der Weitergabe an andere ab.",
        "Deinen eigenen Arbeitsplan in einem kompatiblen Kalender anzuzeigen ist beispielsweise etwas anderes, als einem Kollegen dauerhaften Zugriff zu geben. Beginne beim Ziel: deinen Plan ansehen, mit einer bestimmten Person zusammenarbeiten oder einen Terminplan für ein Publikum veröffentlichen. Wähle eine URL nicht allein deshalb, weil sie sich leicht einfügen lässt."
      ]
    },
    {
      "heading": "Den richtigen Kalender finden, nicht nur das richtige Konto",
      "body": [
        "Laut Googles Anleitung findest du am Computer „Secret address in iCal format“ in den Einstellungen „Integrate calendar“ des ausgewählten Kalenders. Prüfe zuerst den Kalendernamen. Administratoren am Arbeitsplatz oder in der Schule können diese Option einschränken; eine fehlende Adresse ist kein Grund, stattdessen den Kalender zu veröffentlichen.",
        "Halte die Adresse aus Screenshots, öffentlichen Supportbeiträgen und geteilten Notizen heraus. Beschreibe bei einer Hilfsanfrage Kontotyp, Kalendername und Verbindungsart, ohne die URL anzugeben. Im Support muss normalerweise zunächst der Verbindungsweg geklärt werden, bevor Termininhalte nötig sind."
      ]
    },
    {
      "heading": "Prüfen, was die empfangende Anwendung hinzugefügt hat",
      "body": [
        "Ein Abonnement folgt einem Feed; eine importierte Datei erzeugt eine eigenständige Kopie. Lies die Anleitung der empfangenden Anwendung und prüfe, welche Aktion du ausführst. Wenn du lediglich eine heruntergeladene Kalenderdatei öffnest, gehe nicht davon aus, dass die daraus entstandenen Termine spätere Änderungen übernehmen.",
        "Vergleiche Kalendername, Datum und angezeigte Details anhand eines bekannten, gewöhnlichen Termins ohne vertrauliche Inhalte. Erstelle kein zweites Abonnement zur Diagnose des ersten: Zwei sichtbare Kopien können eine verzögerte Aktualisierung wie einen Terminkonflikt aussehen lassen. Blende beim Ermitteln der Quelle vorübergehend einen Kalender aus."
      ]
    },
    {
      "heading": "Google- und Cloud Calendars-Links unterscheiden",
      "body": [
        "Cloud Calendars hat eigene Abläufe zur Freigabe von Terminen und Kalendern, einschließlich Abonnement-Feeds. Diese sind keine geheimen Google-Adressen. Kläre vor dem Öffnen, ob der Absender einen einzelnen Termin, einen Kalender oder eine kontobasierte Einladung geteilt hat.",
        "Ein Empfänger in Cloud Calendars kann die Rolle Reader, Writer oder Owner haben. Eine Feed-Adresse allein ist kein Nachweis für Bearbeitungsrechte. Ebenso macht dich eine Google-Adresse zur Ansicht nicht zum Eigentümer des Kalenders. Frage den Absender, in welchem System Änderungen vorgenommen werden sollen."
      ]
    },
    {
      "heading": "Das Aktualisierungsverhalten des empfangenden Kalenders berücksichtigen",
      "body": [
        "Ein Abonnement verspricht keine sofortige Zustellung. Cloud Calendars-Feeds enthalten einen vorgeschlagenen Aktualisierungsabstand, doch die empfangende Anwendung entscheidet, wann sie Änderungen abruft und anzeigt. Eine alte Uhrzeit auf einem Gerät beweist allein nicht, dass der Organisator die Änderung nicht gespeichert hat.",
        "Vergleiche bei einer Besprechung am selben Tag mit dem aktuellen Plan des Organisators und bestätige wichtige Änderungen direkt. Notiere, welcher Kalender noch alte Informationen zeigt und wann du nachgesehen hast. Importiere den Termin nicht wiederholt und lösche nicht den Quellkalender, um eine Feed-Aktualisierung zu erzwingen."
      ]
    },
    {
      "heading": "Auf Offenlegung reagieren, ohne einen Rückruf zu versprechen",
      "body": [
        "Google beschreibt das Zurücksetzen einer offengelegten geheimen Adresse: Die alte Adresse wird ungültig und eine neue erstellt. Ermittle deine eigenen Anwendungen, die sie nutzen, damit du deren Abonnements anschließend aktualisieren kannst. Das Zurücksetzen einer Adresse ist etwas anderes als das Entfernen eines bestimmten Mitarbeiters.",
        "Bereits gespeicherte Termine, Exporte und Screenshots sind gesondert zu betrachten. Ein geänderter Link beweist nicht, dass jede frühere Kopie verschwunden ist. Wenn Informationen an das falsche Publikum gelangt sind, berücksichtige die tatsächlichen Inhalte und Empfänger, statt ein erfolgreiches Zurücksetzen als Beleg vollständiger Entfernung zu werten."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Kontoverbindung, Einladung, Abonnement oder Datei unterscheiden.",
    "Vor dem Kopieren einer Adresse den zugehörigen Kalender prüfen.",
    "Eine geheime Google-Adresse nur in deinen eigenen kompatiblen Anwendungen nutzen.",
    "Prüfen, ob die empfangende Anwendung abonniert statt importiert hat.",
    "Dringende Änderungen direkt mit dem Organisator bestätigen, statt auf Aktualisierungszeiten zu vertrauen.",
    "Bei Offenlegung Googles Anleitung zum Zurücksetzen befolgen und gewünschte Verbindungen aktualisieren."
  ],
  "faq": [
    {
      "q": "Kann ich die geheime Adresse einem Kollegen geben?",
      "a": "Google empfiehlt, sie den eigenen Anwendungen vorzubehalten. Nutze die Freigabeeinstellungen des Kalenders, wenn eine andere Person Zugriff braucht, und wähle die passende Berechtigung."
    },
    {
      "q": "Kann ich über ein Abonnement das Original bearbeiten?",
      "a": "Eine geheime Google-iCal-Adresse ermöglicht die Ansicht. Für Bearbeitung sind eine geeignete Kontoverbindung und Berechtigung nötig; Cloud Calendars-Freigaberollen sind eine getrennte Regelung."
    },
    {
      "q": "Löscht das Zurücksetzen überall alte Termine?",
      "a": "Es macht die alte Google-Adresse ungültig. Es belegt nicht, dass unabhängig gespeicherte Dateien, Termine oder Screenshots entfernt wurden."
    }
  ],
  "sourcesHeading": "Anbieterhinweise und weiterführende Informationen",
  "sources": [
    {
      "label": "Google: Kontoverbindungen und geheime iCal-Adressen",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    },
    {
      "label": "Google: einen Kalender teilen",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: Import und Abonnement sowie Aktualisierungszeiten",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "taking-back-a-calendar-you-shared",
    "sharing-one-event-not-your-calendar"
  ],
  "updated": "2026-10-21"
},

  'what-guests-can-do-to-your-event': {
    title: 'Was Gäste mit Ihrem Termin anstellen können',
    short: 'Gastberechtigungen',
    description:
      'Drei Kästchen entscheiden, ob ein Gast Ihr Meeting verschieben, Fremde einladen oder die ganze Liste lesen darf. Sie sind öfter aktiv, als man denkt.',
    lede: 'Wer jemanden einlädt, gibt mehr als einen Ort und eine Zeit. In einem normalen Google-Termin sieht ein Gast meist, wer sonst gefragt wurde — und darf häufig weitere hinzufügen.',
    commonBelief: 'Dass ein Gast nur zusagen oder absagen kann.',
    sections: [
      {
        heading: 'Die drei Kästchen',
        body: [
          'Termin ändern erlaubt einem Gast, Zeit, Ort und Titel für alle zu ändern. Selten gewollt, leicht aktiviert gelassen.',
          'Andere einladen erlaubt, Menschen hinzuzufügen, die Sie nie getroffen haben. Gästeliste sehen zeigt alle Eingeladenen samt Antwort — in Ordnung für ein Team, unangenehm bei Kundschaft, falsch bei allem, was einer Gruppe getrennter Kunden ähnelt.',
        ],
      },
      {
        heading: 'Wo das leise schiefgeht',
        body: [
          'Ein Termin, viele einzelne Empfänger, sichtbare Gästeliste: Jetzt hat jeder jeden. Dieses eine Kästchen ist der Unterschied zwischen einem Meeting und einem geleakten Adressbuch.',
          'Die Einstellungen gehören zum Termin, nicht zum Konto. Sie fallen jedes Mal auf Ihre Standardwerte zurück und müssen bei den wichtigen Terminen bedacht werden, nicht einmalig.',
        ],
      },
    ],
    claims: {
      sharePrice: 'Was das Senden eines einzelnen Termins aus der App kostet',
    },
    faq: [
      {
        q: 'Sehen Gäste einander in einer Google-Kalender-Einladung?',
        a: 'Standardmäßig meist ja. „Gästeliste sehen“ zeigt alle Eingeladenen und ihre Antworten — im Team in Ordnung, bei Kundschaft unangenehm und falsch, wenn die Gäste getrennte Kunden sind.',
      },
      {
        q: 'Kann ein Gast die Uhrzeit meines Termins ändern?',
        a: 'Wenn „Termin ändern“ gesetzt ist, ja — und die Änderung gilt für alle. Selten gewollt, leicht aktiviert gelassen.',
      },
      {
        q: 'Wie verhindere ich, dass Gäste weitere Personen einladen?',
        a: '„Andere einladen“ am Termin selbst abschalten. Diese Einstellungen gehören zum Termin, nicht zum Konto, und fallen bei jedem neuen auf Ihre Standardwerte zurück.',
      },
    ],
    practical: [
      '„Gästeliste sehen“ ausschalten bei allem, was an einander fremde Menschen geht.',
      '„Termin ändern“ aus lassen, außer jemand plant wirklich für Sie.',
      'Die Kästchen im Termin prüfen, nicht in den Einstellungen — dort leben sie.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'why-a-shared-calendar-does-not-appear'],
  },

  'google-calendars-that-never-reach-your-iphone': {
    title: 'Warum manche Google-Kalender nie auf dem iPhone ankommen',
    short: 'Google-Kalender fehlen auf dem iPhone',
    description:
      'Ein Google-Konto, mehrere Kalender, und nur einer davon auf dem Telefon. Die Synchronisierungsliste, die das entscheidet — und was stattdessen hilft.',
    lede: 'Ihr Google-Konto hält acht Kalender. Ihr iPhone zeigt zwei. Nichts ist kaputt: Etwas, das Sie nie gesehen haben, hat für Sie entschieden.',
    commonBelief: 'Dass ein Google-Konto auf dem iPhone auch seine Kalender mitbringt.',
    sections: [
      {
        heading: 'Eine Liste, die Ihnen nie gezeigt wurde',
        body: [
          'Google führt pro Gerät eine Liste, welche Kalender synchronisieren dürfen, und Zweitkalender — die geteilten, die abonnierten, die für ein Projekt angelegten — stehen häufig außerhalb.',
          'Diese Liste steckt nicht in den iOS-Einstellungen. Sie lebt auf einer eigenen Google-Seite. Deshalb findet man an der naheliegenden Stelle nichts Falsches, und es ändert sich nichts.',
        ],
      },
      {
        heading: 'Der andere Weg',
        body: [
          'Eine App, die direkt mit Google spricht, nutzt diese Liste nicht. Sie zeigt jeden Kalender, den das Konto wirklich hält, auch die, die das Telefon stillschweigend fallen ließ.',
          'Damit rücken auch die Konten zusammen. Eine Ansicht mit Privatem, Arbeit und Geteiltem ist der Sinn der Sache; ob das Telefon jeden einzelnen synchronisiert hätte, ist dann keine Frage mehr.',
        ],
      },
    ],
    claims: {
      accounts: 'Kontoarten, die eine Ansicht zusammenhält',
      price: 'Was die Google-Seite kostet',
    },
    faq: [
      {
        q: 'Warum erscheinen nur einige meiner Google-Kalender auf dem iPhone?',
        a: 'Google führt pro Gerät eine Liste, welche Kalender synchronisieren dürfen, und Zweitkalender — geteilte, abonnierte, für ein Projekt angelegte — stehen häufig außerhalb davon.',
      },
      {
        q: 'Wo ist die Synchronisierungseinstellung für Google-Kalender auf dem iPhone?',
        a: 'Nicht in den iOS-Einstellungen. Sie liegt auf einer eigenen Google-Seite, weshalb die Suche an der naheliegenden Stelle nichts findet und nichts ändert.',
      },
      {
        q: 'Wie sehe ich alle Google-Kalender auf dem iPhone?',
        a: 'Über eine App, die Google direkt abfragt, statt über die Geräteliste. Sie zeigt jeden Kalender, den das Konto wirklich hält, auch die vom Telefon fallengelassenen.',
      },
    ],
    practical: [
      'Erst die Google-Synchronisierungsliste prüfen, bevor Sie das Konto für kaputt halten.',
      'Damit rechnen, dass abonnierte und geteilte Kalender ausgeschlossen statt eingeschlossen sind.',
      'Bei mehr als zwei Kalendern etwas nutzen, das Google direkt abfragt.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'icloud-google-and-outlook-in-one-view'],
  },

  'taking-back-a-calendar-you-shared': {
  "title": "Kalender nicht mehr teilen: Zugriff entfernen und andere Wege prüfen",
  "short": "Geteilte Zugriffe prüfen und entfernen",
  "description": "Beende die Kalenderfreigabe gezielt: Prüfe Personen, Gruppen, öffentliche Zugriffe und Feed-Links und erfahre, warum gespeicherte Kopien bleiben können.",
  "lede": "Um eine Zusammenarbeit zu beenden, musst du zunächst wissen, wie der Zugriff erteilt wurde. Eine Person zu entfernen, die Veröffentlichung abzuschalten und eine Feed-Adresse zurückzusetzen sind unterschiedliche Aktionen. Dieser Leitfaden stammt von Arte Soft, dem Entwickler von Cloud Calendars.",
  "commonBelief": "Wenn du einen Empfänger entfernst, werden sofort alle Kalenderkopien zurückgerufen und alle anderen Zugangswege geschlossen.",
  "sections": [
    {
      "heading": "Kalender und Freigabeweg bestimmen",
      "body": [
        "Prüfe vor einer Änderung das Eigentümerkonto, den Kalender und den vorgesehenen Empfängerkreis. Eine Google-Kalenderfreigabe für einen bestimmten Kollegen ist etwas anderes als ein öffentlicher Kalender, eine Gruppenberechtigung oder eine Abonnementadresse. Cloud Calendars hat außerdem eigene Freigabebeziehungen für Termine und Kalender.",
        "Beispielsweise kann die Schriftführung eines Vereins über eine persönliche Einladung Bearbeitungsrechte erhalten, während Mitglieder einem veröffentlichten Terminplan folgen. Das Entfernen dieser persönlichen Berechtigung sagt nichts darüber aus, was mit den Abonnements der Mitglieder geschehen soll. Liste die tatsächlich eingerichteten Freigaben auf."
      ]
    },
    {
      "heading": "Die beabsichtigte Google-Berechtigung entfernen",
      "body": [
        "Google beschreibt getrennte Einstellungen für einzelne Personen oder Gruppen, organisationsweite Freigaben und öffentlichen Zugriff. Öffne am Computer die Freigabeeinstellungen des betreffenden Kalenders und ändere den passenden Eintrag oder die übergeordnete Einstellung. Prüfe zuerst das angemeldete Konto und den Kalendernamen.",
        "Eine Person kann weiterhin über einen anderen Weg Zugriff haben, etwa über eine Gruppe oder eine umfassendere Veröffentlichung. Prüfe die gesamte Freigabe, statt dieselbe E-Mail-Adresse wiederholt zu entfernen. Arbeits- oder Schulrichtlinien können die verfügbaren Einstellungen einschränken; nutze bei Bedarf das vom Eigentümer oder Administrator vorgesehene Verfahren."
      ]
    },
    {
      "heading": "Eine geheime Kalenderadresse gesondert behandeln",
      "body": [
        "Laut Google ist die geheime iCal-Adresse für deine eigene Verwendung in einer anderen Kalenderanwendung bestimmt und darf nicht an andere weitergegeben werden. Wurde sie offengelegt, beschreibt Google das Zurücksetzen, um die alte Adresse ungültig zu machen. Das ist eine andere Aktion als das Entfernen einer bestimmten Person.",
        "Bevor du eine selbst genutzte Abonnementadresse änderst, ermittle die davon abhängigen Kalenderprogramme oder Werkzeuge, damit du die gewünschten anschließend wieder verbinden kannst. Veröffentliche die geheime URL nicht in einem Supportbeitrag und verschicke sie nicht als Beleg für den richtigen Kalender. Nenne stattdessen Kalendername und Verbindungsart."
      ]
    },
    {
      "heading": "Cloud Calendars-Empfänger von Feed-Links unterscheiden",
      "body": [
        "In Cloud Calendars sind der Empfängerzugriff auf Termine oder Kalender und ein ausgegebener Abonnement-Feed unterschiedliche Mechanismen. Prüfe die konkrete Freigabebeziehung und den betreffenden Link, bevor du handelst. Das Entfernen eines bestimmten Empfängers verspricht nicht pauschal, dass jede zuvor verteilte URL oder unabhängige Kopie zurückgerufen wurde.",
        "Wenn ein Mitorganisator lediglich nicht mehr bearbeiten soll, prüfe die vorgesehene Rolle und den verbleibenden Empfängerkreis, statt den gemeinsamen Terminplan zu löschen. Endet die gesamte Zusammenarbeit, kläre, wem der Kalender gehört und wer ihn behalten soll. Einen empfangenen Kalender zu verlassen und einen eigenen Kalender zu löschen sind unterschiedliche Entscheidungen."
      ]
    },
    {
      "heading": "Das Ergebnis prüfen, ohne sofortiges Verschwinden zu versprechen",
      "body": [
        "Prüfe, ob die gewünschte Änderung im verwaltenden System gespeichert wurde. Wenn ein berechtigter Kollege helfen kann, kontrolliert den betreffenden Anzeige- oder Bearbeitungszugriff über dessen eigenes Konto, ohne Passwörter auszutauschen. Unterscheide eine Zugriffsverweigerung von einem alten Termin, der noch in einer zwischengespeicherten oder importierten Kopie sichtbar ist.",
        "Versprich weder eine allgemeingültige Aktualisierungsfrist noch, dass keine Benachrichtigung versendet wird. Teile bei einer Gruppenübergabe mit, welcher Terminplan künftig gilt. Ein sichtbarer alter Eintrag allein verrät nicht, ob die Person weiterhin direkten Zugriff hat, eine andere Berechtigung nutzt oder eine eigenständige Kopie aufbewahrt."
      ]
    },
    {
      "heading": "Frühere Kopien gesondert nachverfolgen",
      "body": [
        "Bereits exportierte Dateien, Screenshots, Nachrichten und unabhängig gespeicherte Termine können nach Zugriffsänderungen bestehen bleiben. Entscheide, welche Kopien für die Übergabe wichtig sind, und besprich den Umgang damit mit den Beteiligten. Eine Änderung der Kalenderberechtigung zeigt nicht, was jeder Empfänger bereits gespeichert hat.",
        "Bewahre notwendige Originalunterlagen auf, während du das Ergebnis prüfst. Verschiebe vertrauliche Besprechungen nicht in einen anderen geteilten Kalender, nur damit der alte leer aussieht, und sage echte Einladungen nicht als Zugriffstest ab. Halte Kalender, Zugangsweg und Änderung fest, damit spätere Fehlersuche einen klaren Ausgangspunkt hat."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Eigentümerkonto, Kalender und Freigabeweg bestimmen.",
    "Einzelne Personen, Gruppen und umfassendere Veröffentlichungen getrennt prüfen.",
    "Die passenden Freigabeeinstellungen von Google oder Cloud Calendars verwenden.",
    "Über das Zurücksetzen einer offengelegten geheimen Feed-Adresse gesondert entscheiden.",
    "Den gespeicherten Zugriff prüfen, ohne Zugangsdaten weiterzugeben.",
    "Frühere Exporte und Kopien getrennt vom direkten Zugriff berücksichtigen."
  ],
  "faq": [
    {
      "q": "Deaktiviert das Entfernen einer Person einen öffentlichen Kalender oder ihren Gruppenzugriff?",
      "a": "Davon solltest du nicht ausgehen. Prüfe jeden tatsächlichen Zugangsweg. Google beschreibt einzelne Empfänger, Gruppen und umfassendere Veröffentlichungen als getrennte Einstellungen."
    },
    {
      "q": "Verschwindet der Kalender sofort und ohne Benachrichtigung?",
      "a": "Für Verschwinden, Benachrichtigungen und Aktualisierungszeiten gibt es hier keine allgemeingültige Zusage. Prüfe die gespeicherte Zugriffsänderung und unterscheide direkten Zugriff von zwischengespeicherten oder importierten Informationen."
    },
    {
      "q": "Kauft man mit Advanced die Möglichkeit, Google-Kalenderzugriff zu entfernen?",
      "a": "Advanced entfernt Werbung in Cloud Calendars. Die Google-Freigabeeinstellungen hängen von Eigentümerschaft, Berechtigungen und Organisationsregeln ab, nicht von diesem App-Tarif."
    }
  ],
  "sourcesHeading": "Hinweise des Anbieters zu Zugriff und Abonnements",
  "sources": [
    {
      "label": "Google: Freigabeeinstellungen und Zugriff beenden",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Google: Kontosynchronisierung und geheime iCal-Adressen",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "the-secret-address-of-a-google-calendar"
  ],
  "updated": "2026-10-21"
},
};
