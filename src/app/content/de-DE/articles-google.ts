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
    practical: [
      'Standardmäßig frei/gebucht für alle, die nur Zeit bei Ihnen buchen wollen.',
      '„Ändern“ nur für Menschen, die wirklich für Sie planen.',
      'Zweimal im Jahr durchsehen, wer Zugriff hat; Freigaben sammeln sich an, und niemand erinnert Sie daran.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'what-guests-can-do-to-your-event'],
  },

  'why-a-shared-calendar-does-not-appear': {
    title: 'Ein Kalender wurde für Sie freigegeben und ist nicht da',
    short: 'Geteilter Kalender fehlt',
    description:
      'Jemand hat einen Kalender geteilt, Sie haben angenommen, und nichts hat sich geändert. Die vier gewöhnlichen Gründe, in der sinnvollen Reihenfolge.',
    lede: 'Die Einladung kam, der Link wurde angetippt, und der Kalender fehlt weiterhin. Fast immer ist es eines von vier Dingen, und keines davon ist eine kaputte Freigabe.',
    commonBelief: 'Dass Annehmen einen geteilten Kalender auf Ihr Telefon bringt.',
    sections: [
      {
        heading: 'Annehmen fügt ihn einem Konto hinzu, nicht einem Gerät',
        body: [
          'Eine Freigabe landet in dem Google-Konto, an das sie adressiert war. Haben Sie mit einem Konto angenommen und trägt Ihr Telefon ein anderes, liegt der Kalender wohlbehalten dort, wo Sie gerade nicht hinsehen.',
          'Selbst im richtigen Konto kommt ein neuer Kalender auf anderen Geräten häufiger ausgeschaltet als eingeschaltet an. Er existiert, er ist nur nicht angehakt — und ein nicht angehakter Kalender sieht genauso aus wie ein fehlender.',
        ],
      },
      {
        heading: 'Die anderen beiden Gründe',
        body: [
          'Freigaben an Verteiler oder Gruppenadressen erreichen Einzelpersonen selten; nötig ist die Adresse, die tatsächlich ein Google-Konto ist. Und ein als Link geteilter Kalender ist ein Abonnement: Er landet an anderer Stelle in der Liste und aktualisiert sich im Takt des Herausgebers statt sofort.',
          'Auf dem iPhone erreichen Google-Kalender die eingebaute App über eine eigene Synchronisierungsliste, und Zweitkalender stehen standardmäßig außerhalb davon. Deshalb zeigt ein Konto seinen Hauptkalender und lässt die vier wichtigen stillschweigend weg.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Stunden zwischen den Aktualisierungsanfragen eines abonnierten Feeds',
      accounts: 'Kontoarten, die eine Ansicht ganz ohne das alles zusammenhält',
    },
    practical: [
      'Erst prüfen, welches Konto die Freigabe angenommen hat, dann alles andere.',
      'Die Kalenderliste auf dem Gerät öffnen und nach dem ausgeschalteten Eintrag suchen, nicht nach einem fehlenden.',
      'Kam er als Link, rechnen Sie mit Verzögerung statt mit sofortigem Erscheinen.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'google-calendars-that-never-reach-your-iphone'],
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
    practical: [
      'Die vollständige Zugriffsliste lesen, nicht nur den Namen, den Sie streichen wollten.',
      'Die geheime Adresse zurücksetzen, wenn die Person sie je hatte.',
      'Davon ausgehen, dass Kopien bleiben — wirklich Sensibles verschieben statt verstecken.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
