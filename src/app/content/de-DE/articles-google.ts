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
    title: 'Was die geheime Adresse eines Google-Kalenders wirklich preisgibt',
    short: 'Die geheime iCal-Adresse',
    description:
      'Google bietet eine private Adresse, die Ihren ganzen Kalender zeigt — jedem, der sie hat. Was sie offenlegt und warum sie sich nicht leise zurücknehmen lässt.',
    lede: 'In den Einstellungen jedes Google-Kalenders steckt ein Link, der alles darauf zeigt. Ohne Anmeldung, ohne Berechtigung, ohne Protokoll, wer ihn geöffnet hat.',
    commonBelief: 'Dass eine private Adresse privat ist, weil sie schwer zu finden ist.',
    sections: [
      {
        heading: 'Ein Link ist ein Passwort, das man nicht für eine einzelne Person ändern kann',
        body: [
          'Die geheime Adresse trägt volle Details — Titel, Zeiten, Orte, Notizen. Wer den Link hat, sieht sie, und es gibt keine Liste, wer das ist.',
          'Ihr einziger Schutz ist der zufällige Teil der Adresse. Gegen Raten schützt das wirklich, gegen Weiterleiten, einen geteilten Bildschirm oder ein Dokument, das den Job überlebt, überhaupt nicht.',
        ],
      },
      {
        heading: 'Zurücksetzen macht sie für alle kaputt',
        body: [
          'Sie können die Adresse zurücksetzen, dann ist die alte tot. Sie ist damit auch für jede Kollegin, jedes Dashboard und jedes stille Skript tot, das daran hängt — ohne Vorwarnung.',
          'Genau deshalb gibt man die Adresse des Kalenders, in dem man lebt, nicht heraus. Veröffentlichen Sie einen eigens dafür angelegten Kalender, und das Zurücksetzen kostet nichts.',
        ],
      },
    ],
    claims: {
      linkLength: 'Zufallszeichen, die einen Freigabelink von uns schützen',
      sharePrice: 'Was das Teilen eines Termins aus der App kostet',
    },
    faq: [
      {
        q: 'Was kann jemand mit der geheimen Adresse meines Kalenders anfangen?',
        a: 'Alles darauf sehen — Titel, Zeiten, Orte und Notizen — ohne Anmeldung, ohne Berechtigung und ohne dass irgendwo festgehalten wird, dass er nachgesehen hat.',
      },
      {
        q: 'Kann ich eine geheime Kalenderadresse zurücknehmen?',
        a: 'Nur durch Zurücksetzen, und das tötet die alte Adresse für alle gleichzeitig: Kolleginnen, Dashboards und jedes still daran hängende Skript, ohne Warnung.',
      },
      {
        q: 'Kann ich die geheime Adresse einer Kollegin mailen?',
        a: 'Betrachten Sie sie als öffentlich, sobald sie Ihre Hände verlässt. Ihr einziger Schutz ist, schwer zu erraten zu sein, und Weiterleiten hebt genau das auf.',
      },
    ],
    practical: [
      'Die geheime Adresse als öffentlich betrachten, sobald sie Ihre Hände verlässt.',
      'Niemals die Adresse des Kalenders herausgeben, den Sie tatsächlich nutzen.',
      'Beim Ausscheiden einer Person zurücksetzen — und denen Bescheid geben, bei denen es dadurch bricht.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'taking-back-a-calendar-you-shared'],
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
    title: 'Einen geteilten Kalender wieder zurückholen',
    short: 'Zugriff wieder entziehen',
    description:
      'Jemanden aus einem Kalender zu entfernen, stoppt, was danach kommt. Was es nicht tut: rückgängig machen, was schon geschehen ist.',
    lede: 'Zugriff zu beenden ist ein Tippen. Zu entscheiden, ob ein Tippen reicht, dauert etwas länger — denn Teilen hinterlässt Kopien.',
    commonBelief: 'Dass das Entfernen einer Person entfernt, was sie gesehen hat.',
    sections: [
      {
        heading: 'Was aufhört und was bleibt',
        body: [
          'Entfernen Sie eine Person, verschwindet der Kalender aus ihrer Liste, sofort und ohne Nachricht. Künftige Termine erreichen sie nie.',
          'Was nicht zurückkommt: bereits erhaltene Einladungen, in den eigenen Kalender kopierte Termine, Exportiertes und alles, wofür eine geheime Adresse herausging. Der Zugriff endet; die Erinnerung nicht.',
        ],
      },
      {
        heading: 'Das, was das Entfernen überlebt',
        body: [
          'Hatte jemand je das Recht, Freigaben zu verwalten, hat er vielleicht weitere Personen hinzugefügt. Ihn zu entfernen lässt diese Personen stehen — so wird ein Kalender mit jemandem geteilt, an dessen Einladung sich niemand erinnert.',
          'Lesen Sie also die ganze Liste, statt einen Namen zu streichen, und tun Sie es beim Abschied, nicht Monate später. Niemand erinnert Sie, und Freigaben sammeln sich nur an.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Monatlicher Preis der Stufe, in der das verwaltet wird, in Dollar',
    },
    faq: [
      {
        q: 'Löscht das Entfernen einer Person, was sie bereits gesehen hat?',
        a: 'Nein. Bereits erhaltene Einladungen, in den eigenen Kalender kopierte Termine und alles Exportierte bleiben. Der Zugriff endet, die Kopien nicht.',
      },
      {
        q: 'Erfährt die Person, dass ich ihren Zugriff entfernt habe?',
        a: 'Nein. Der Kalender verschwindet sofort und ohne Nachricht aus ihrer Liste.',
      },
      {
        q: 'Warum ist mein Kalender mit jemandem geteilt, den ich nie eingeladen habe?',
        a: 'Jemand mit dem Recht, Freigaben zu verwalten, hat ihn hinzugefügt. Diese Person zu entfernen lässt alle von ihr Hinzugefügten stehen — deshalb liest man die ganze Liste und nicht einen Namen.',
      },
    ],
    practical: [
      'Die vollständige Zugriffsliste lesen, nicht nur den Namen, den Sie streichen wollten.',
      'Die geheime Adresse zurücksetzen, wenn die Person sie je hatte.',
      'Davon ausgehen, dass Kopien bleiben — wirklich Sensibles verschieben statt verstecken.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
