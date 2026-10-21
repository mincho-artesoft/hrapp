import { LocalisedArticle } from '../types';

/** Die sechs Google-Artikel: konkrete Fragen, klar beantwortet. */
export const GOOGLE_DE_DE: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
    title: 'Wer was sieht, wenn Sie einen Google-Kalender teilen',
    short: 'Google-Freigaberechte',
    description:
      'Googles Freigabestufen sind schnell gesetzt und leicht misszuverstehen. Was jede einzelne tatsächlich preisgibt, in klaren Worten.',
    lede: 'Die meisten versehentlichen Einblicke sind kein Fehlurteil. Jemand hat eine Stufe gewählt, die bescheiden klang und es nicht war.',
    commonBelief: 'Dass zwischen „nur frei/gebucht“ und „alle Termindetails“ ein kleiner Unterschied liegt.',
    sections: [
      {
        heading: 'Die Stufen liegen weiter auseinander, als sie klingen',
        body: [
          'Frei/gebucht zeigt Zeitblöcke ohne Titel. Alle Details zeigt Titel, Orte, Notizen und Gäste — bei den meisten Kalendern also erstaunlich viel über Ihr Leben.',
          'Ändern erlaubt das Bearbeiten. Freigabeeinstellungen verwalten erlaubt, Ihren Kalender an weitere Personen weiterzugeben — das ist die Stufe, die später überrascht.',
        ],
      },
      {
        heading: 'Wählen, ohne jedes Mal nachzudenken',
        body: [
          'Für Kolleginnen und Kollegen, die nur um Sie herum planen müssen, ist frei/gebucht fast immer richtig und fast nie gewählt.',
          'Volle Details gehören Kalendern, die zum Teilen angelegt wurden, nicht dem, in dem Sie leben.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Monatlicher Preis der Stufe, in der das in der App verwaltet wird, in Dollar',
    },
    faq: [
      {
        q: 'Sieht jemand meine Termintitel, wenn ich nur frei/gebucht teile?',
        a: 'Nein. Frei/gebucht zeigt Zeitblöcke ohne Titel, Orte, Notizen oder Gäste. Erst „alle Termindetails“ legt das offen — und dann alles davon.',
      },
      {
        q: 'Was darf jemand mit „Ändern und Freigabeeinstellungen verwalten“?',
        a: 'Jeden Termin bearbeiten und Ihren Kalender an weitere Personen weitergeben, ohne Sie zu fragen. Es ist die einzige Stufe, auf der jemand anderes Zugriff verteilen kann.',
      },
      {
        q: 'Kann ich nachsehen, wer bereits Zugriff auf meinen Kalender hat?',
        a: 'Ja, in den Freigabeeinstellungen des Kalenders. Niemand erinnert Sie daran, und Freigaben sammeln sich nur an, deshalb lohnt sich ein Blick zweimal im Jahr.',
      },
    ],
    practical: [
      'Standardmäßig frei/gebucht für alle, die nur Zeit bei Ihnen buchen wollen.',
      '„Ändern“ nur für Menschen, die wirklich für Sie planen.',
      'Zweimal im Jahr durchsehen, wer Zugriff hat; Freigaben sammeln sich an, und niemand erinnert Sie daran.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'what-guests-can-do-to-your-event'],
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
