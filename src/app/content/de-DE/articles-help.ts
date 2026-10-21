import { LocalisedArticle } from '../types';

export const HELP_DE_DE: Readonly<Record<string, LocalisedArticle>> = {
  "calendar-notifications-missing-silent-or-duplicated": {
    "updated": "2026-10-21",
    "title": "Kalender-Mitteilungen auf dem iPhone: fehlend, lautlos oder doppelt?",
    "short": "Kalender-Mitteilungen prüfen",
    "description": "Prüfen Sie Ereignishinweise, Cloud Calendars und die iPhone-Mitteilungen getrennt. Finden Sie die Ursache fehlender oder doppelter Hinweise ohne Datenlöschung.",
    "lede": "Was genau ist passiert: Fehlt der Termin, bleibt die Mitteilung aus, erscheint sie ohne Ton oder melden sich zwei Apps? Daraus ergibt sich die passende Prüfung. Diesen Leitfaden veröffentlicht Arte Soft, der Entwickler von Cloud Calendars.",
    "commonBelief": "Wenn ein Termin im Kalender steht, müssen bereits alle Hinweise und Mitteilungsrechte eingerichtet sein.",
    "sections": [
      {
        "heading": "Zuerst das Problem eingrenzen",
        "body": [
          "Fehlt der Termin selbst, prüfen Sie zuerst das zugehörige Konto und den ausgewählten Kalender. Toneinstellungen klären nicht, ob der richtige Termin die App erreicht hat. Für dieses eigenständige Problem hilft der Leitfaden zur Kalendersynchronisierung.",
          "Ist der Termin sichtbar, aber keine Mitteilung da, prüfen Sie den gespeicherten Hinweis und beide unten beschriebenen Einstellungen. Bei lautlosen Mitteilungen geht es zunächst um die Zustellung und den Ton auf dem iPhone. Bei mehreren Hinweisen identifizieren Sie zuerst die sendenden Apps und die eingestellten Hinweiszeiten."
        ]
      },
      {
        "heading": "Keine Mitteilung: Termin und App prüfen",
        "body": [
          "Öffnen Sie den Termin und prüfen Sie die Hinweiszeit. Der Ereigniseditor von Cloud Calendars bietet „Alert“ und gegebenenfalls „Second Alert“, einschließlich „None“ und verschiedener Zeitpunkte vor dem Termin. Ein zweiter Hinweis kann beabsichtigt sein. Prüfen Sie nach einer Änderung den gespeicherten Termin erneut, besonders wenn Anbieter oder Freigaberechte Änderungen begrenzen.",
          "Suchen Sie in den Einstellungen von Cloud Calendars nach „Event Notifications“. Einladungs- und Wettermitteilungen werden getrennt eingestellt. Sind diese aktiviert, müssen normale Terminerinnerungen deshalb noch nicht aktiviert sein. Prüfen Sie sowohl „Event Notifications“ als auch die iOS-Mitteilungsberechtigung.",
          "Auch die Kalenderauswahl zählt: Die aktuelle Planung verwendet Hinweise aus ausgewählten Kalendern. Stellen Sie sicher, dass der betreffende Kalender ausgewählt ist. Nehmen Sie nicht an, dass Ausblenden in dieser App nur die Darstellung ändert. Löschen Sie keine Termine, um Erinnerungen zu stoppen."
        ]
      },
      {
        "heading": "Lautlos oder verspätet: Zustellung auf dem iPhone prüfen",
        "body": [
          "Öffnen Sie in den iPhone-Einstellungen den Bereich für Mitteilungen und wählen Sie Cloud Calendars. Prüfen Sie die Erlaubnis, die verfügbaren Anzeigeorte und die Toneinstellungen. Kontrollieren Sie, ob eine geplante Übersicht oder ein aktiver Fokus die Zustellung beeinflusst. Das sind Apple-Systemeinstellungen, nicht das Menü „Alert“ eines Termins. Bezeichnungen können je nach iOS-Version abweichen.",
          "Ein Banner ohne Ton ist etwas anderes als eine Mitteilung, die nirgends erscheint. Notieren Sie Sperrbildschirm oder Mitteilungszentrale, ob das Telefon benutzt wurde und welcher Fokus aktiv war. Ändern Sie jeweils nur eine relevante Einstellung. Ein Live-Activity-Countdown ist eine andere Anzeige; er beweist nicht, dass eine hörbare Erinnerung eintreffen wird."
        ]
      },
      {
        "heading": "Zwei Hinweise: erst die Absender erkennen",
        "body": [
          "Lesen Sie den App-Namen jeder Mitteilung. Apple Kalender, Google Kalender und Cloud Calendars können getrennt benachrichtigen, obwohl sie zusammengehörige Termine anzeigen. Zwei Mitteilungen beweisen keine zwei Datensätze. Vergleichen Sie auch die Zeiten: Ein Hinweis am Vortag und einer kurz vor Beginn können genau den gespeicherten Einstellungen entsprechen.",
          "Google erklärt, dass Mitteilungseinstellungen persönlich für das Konto gelten und einzelne Termine von den Kalendervorgaben abweichen können. Diese Anleitung betrifft Google Kalender, nicht Cloud Calendars. Prüfen Sie den jeweiligen Absender, statt anzunehmen, ein Schalter kontrolliere alle Apps.",
          "Entscheiden Sie, welche App Sie benachrichtigen soll, und ändern Sie nur die passende Erinnerung oder Mitteilungseinstellung. Bleiben tatsächlich zwei Terminaufzeichnungen, vergleichen Sie Kalender und Eigentümer mit dem Leitfaden zu Duplikaten. Sagen Sie kein echtes Meeting ab, nur um einen zusätzlichen Hinweis zu unterdrücken."
        ]
      },
      {
        "heading": "Mit einem entbehrlichen Testtermin prüfen",
        "body": [
          "Erstellen Sie einen klar benannten Testtermin in einem eigenen, beschreibbaren Kalender. Legen Sie den Beginn so weit in die Zukunft, dass auch die Hinweiszeit noch bevorsteht. Prüfen Sie Kalenderauswahl, gespeicherten Hinweis und beide Mitteilungseinstellungen. Notieren Sie erwartete Uhrzeit und sendende App.",
          "Beobachten Sie getrennt, ob eine Mitteilung erscheint und ob sie einen Ton abspielt. Wiederholen Sie den Versuch erst nach Änderung einer vermuteten Ursache. Verwenden Sie einen normalen Termin ohne Teilnehmer, kein wichtiges Meeting und keine Terminserie. Speichern Sie das Ergebnis zusammen mit App- und iOS-Version für spätere Vergleiche."
        ]
      },
      {
        "heading": "Wenn die Ergebnisse weiter schwanken",
        "body": [
          "Die App plant eine begrenzte Anzahl kommender Hinweise. Verlassen Sie sich nicht auf eine unbegrenzte Warteschlange weit entfernter Erinnerungen. Prüfen Sie Ihre installierte Version und dokumentieren Sie unregelmäßige Zustellung. Melden Sie App- und iOS-Version, Kalendertyp, Hinweisabstand, erwartete Uhrzeit und Ergebnis.",
          "Veröffentlichen Sie keine privaten Termintitel, Teilnehmeradressen oder Kalender-Abonnementlinks. Neuinstallation, Löschen lokaler Daten und Entfernen von Konten sind keine ersten Diagnoseschritte. Lassen Sie Termine und Konten unverändert, während der Support untersucht."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Unterscheiden Sie fehlenden Termin, fehlende Mitteilung, lautlose Zustellung und doppelte Hinweise.",
      "Prüfen Sie gespeicherten Hinweis und Kalenderauswahl.",
      "Prüfen Sie „Event Notifications“ getrennt von der iPhone-Mitteilungserlaubnis.",
      "Vergleichen Sie bei Duplikaten Apps und Hinweiszeiten.",
      "Testen Sie mit einem entbehrlichen zukünftigen Termin statt mit echten Einladungen."
    ],
    "faq": [
      {
        "q": "Aktivieren Wettermitteilungen auch Terminerinnerungen?",
        "a": "Nein. Ereignis-, Einladungs- und Wettermitteilungen sind getrennt. Prüfen Sie für normale Terminhinweise „Event Notifications“ und die iOS-Erlaubnis."
      },
      {
        "q": "Soll ich bei zwei Hinweisen einen Termin löschen?",
        "a": "Identifizieren Sie zuerst Apps und Zeiten. Mehrere Apps oder mehrere Hinweise desselben Termins können die Ursache sein. Löschen ist dafür kein sicherer Diagnoseschritt."
      },
      {
        "q": "Garantiert eine Hinweiszeit die Zustellung?",
        "a": "Nein. Sie ist nur ein Teil. App-Einstellungen, Systemerlaubnis und Zustellungsoptionen spielen ebenfalls eine Rolle. Prüfen Sie das Ergebnis auf Ihrem Gerät."
      }
    ],
    "sourcesHeading": "Quellen und Mitteilungseinstellungen",
    "sources": [
      {
        "label": "Apple: Mitteilungseinstellungen auf dem iPhone ändern",
        "url": "https://support.apple.com/guide/iphone/change-notification-settings-iph7c3d96bab/ios"
      },
      {
        "label": "Google: Google-Kalender-Mitteilungen auf iPhone und iPad ändern",
        "url": "https://support.google.com/calendar/answer/37242?hl=en&co=GENIE.Platform%3DiOS"
      }
    ],
    "seeAlso": [
      "what-calendar-sync-actually-does",
      "when-two-calendars-disagree"
    ]
  },
  "find-old-calendar-events-by-account-date-and-title": {
    "updated": "2026-10-21",
    "title": "Alte Kalendertermine finden: Konto, Zeitraum und Suchfelder prüfen",
    "short": "Vergangene Termine finden",
    "description": "Ein leeres Suchergebnis beweist keine Löschung. Prüfen Sie Konto, Zeitraum und Suchfelder, bevor Sie im Archiv des Anbieters suchen.",
    "lede": "Wenn Sie sich an ein Meeting erinnern, es aber nicht finden, trennen Sie drei Fragen: Welches Konto enthielt es, welche Daten umfasst die Ansicht und welche Felder durchsucht die Suche? Dieser Leitfaden stammt von Arte Soft, dem Entwickler von Cloud Calendars.",
    "commonBelief": "Jedes Suchfeld einer Kalender-App durchsucht alle Felder sämtlicher jemals beim Anbieter gespeicherten Termine.",
    "sections": [
      {
        "heading": "Mit einem kleinen, brauchbaren Hinweis beginnen",
        "body": [
          "Notieren Sie einen ungefähren Monat oder ein Jahr, ein markantes Wort aus dem Titel und das wahrscheinlich verwendete Konto. Halten Sie diese Hinweise auseinander. Der Name eines Kollegen könnte nur in der Teilnehmerliste stehen, eine Adresse nur im Ortsfeld.",
          "Probieren Sie einen kurzen Titelausschnitt vor einer langen Wortfolge. Ein leeres Ergebnis erklärt noch nicht, ob der Datensatz fehlt, außerhalb des geladenen Zeitraums liegt oder das Wort in einem nicht durchsuchten Feld steht."
        ]
      },
      {
        "heading": "Konto und Kalenderauswahl prüfen",
        "body": [
          "Suchen Sie nach dem Konto und Kalender, zu denen der Termin ursprünglich gehörte. Ein geschäftlicher Google-Kalender, ein privater iCloud-Kalender und ein lokaler Gerätekalender sind verschiedene Speicherorte, auch wenn eine App sie gemeinsam zeigte. Prüfen Sie den Zugriff und die Auswahl des Kalenders.",
          "Erstellen Sie nicht allein wegen eines leeren Ergebnisses eine Kopie. Finden Sie den Termin durch Blättern zum ungefähren Datum, prüfen Sie Titel, Kalender und Organisator. So gewinnen Sie Vergleichsdaten, ohne den Eintrag zu verändern."
        ]
      },
      {
        "heading": "Zeitraum und Felder der Cloud-Calendars-Suche beachten",
        "body": [
          "Cloud Calendars durchsucht die Titel geladener Termine ohne Unterscheidung von Groß- und Kleinschreibung. Verwenden Sie ein markantes Titelwort. Erwarten Sie keinen Treffer für einen Ort, eine Teilnehmeradresse oder eine Notiz, nur weil diese anderswo im Termin stehen.",
          "Die aktuelle Suchansicht lädt Termine des laufenden Kalenderjahrs aus ausgewählten Kalendern. Ein Meeting aus einem früheren Jahr kann deshalb in dieser Suche fehlen und beim Anbieter trotzdem existieren. Prüfen Sie den Zeitraum, bevor Sie ein leeres Ergebnis deuten.",
          "Zu einem alten Datum zu blättern und ein früheres Jahr zu durchsuchen sind verschiedene Vorgänge. Für ältere Daten nutzen Sie verfügbare Anbieterwerkzeuge mit demselben Konto. Prüfen Sie Ihre installierte App-Version, statt eine Suche über alle Jahre vorauszusetzen."
        ]
      },
      {
        "heading": "Die dokumentierten Anbieterwerkzeuge nutzen",
        "body": [
          "In Google Kalender am Computer können Suchoptionen nach Kalender, Ereignisinformationen, Personen, Ort und Zeitraum eingrenzen. Für fehlende ältere Ereignisse empfiehlt Google eine erweiterte Suche mit Datumsgrenzen und nennt ein Limit von 200 Ergebnissen. Teilen Sie große Suchbereiche in kleinere Zeiträume, statt die erste Ergebnisliste für vollständig zu halten.",
          "Das sind Funktionen der Google-Kalender-Website, keine Beschreibung von Cloud Calendars. Apples Anleitung nennt Titel, Eingeladene, Orte und Notizen als Suchfelder seiner iPhone-Kalender-App. Die Nutzung von EventKit in einer anderen App verleiht dieser nicht automatisch dieselbe Suchoberfläche oder dieselben Trefferregeln."
        ]
      },
      {
        "heading": "Einordnen, wo der Termin erscheint",
        "body": [
          "Beim Anbieter vorhanden, in Cloud Calendars nicht: Prüfen Sie Kontoidentität, Kalenderauswahl, Zeitraum und gesuchten Titel. Behalten Sie den Anbieter-Datensatz. Zunächst geht es darum, was die App geladen oder gefunden hat, nicht darum, den Termin neu anzulegen.",
          "Beim Blättern vorhanden, in der Suche nicht: Vergleichen Sie den tatsächlichen Titel mit der Anfrage und notieren Sie das Datum. Das weist auf Suchumfang oder Textabgleich hin. Ändern Sie keinen alten Meetingtitel nur, damit ein Diagnosetest gelingt.",
          "Auch beim Anbieter nicht vorhanden: Prüfen Sie Konto, Zugriff und Zeitraum, bevor Sie Aufbewahrung oder Löschung beim Anbieter untersuchen. Bei einem lokalen Kalender ist eine Anbieterwebsite nur dann eine unabhängige Kopie, wenn eine entsprechende Verbindung eingerichtet wurde. Nicht jeder lokale Termin hat ein Cloud-Archiv."
        ]
      },
      {
        "heading": "Nützliche Angaben sammeln, ohne Inhalte offenzulegen",
        "body": [
          "Notieren Sie für den Support App-Version, Kalenderanbieter oder lokale Speicherart, ungefähres Jahr und ob der Termin beim Anbieter oder durch Datumsnavigation erscheint. Geben Sie an, ob Sie ein Titelwort, einen Ort oder einen Teilnehmer gesucht haben. Das ist aussagekräftiger als „Die Suche funktioniert nicht“.",
          "Senden Sie keine privaten Notizen, Einladungslinks oder geheimen Kalender-Feed-Adressen. Behalten Sie Konten und lokale Daten. Speicher zu leeren oder eine alte Datei erneut zu importieren kann die Diagnose erschweren."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Bestimmen Sie das wahrscheinliche Konto und ungefähre Datum.",
      "Prüfen Sie Kalenderauswahl und Zugriff.",
      "Suchen Sie ein markantes Wort aus dem Titel.",
      "Trennen Sie die App-Suche im aktuellen Jahr von der Archivsuche des Anbieters.",
      "Nutzen Sie gegebenenfalls Googles Web-Datumsfilter oder die dokumentierten Suchfelder von Apple Kalender.",
      "Dokumentieren Sie Fundstellen, bevor Sie Daten ändern."
    ],
    "faq": [
      {
        "q": "Bedeutet ein leeres Ergebnis, dass der alte Termin gelöscht wurde?",
        "a": "Nein. Ein anderes Konto, ein nicht ausgewählter Kalender, ein Datum außerhalb des geladenen Bereichs oder ein anderes Suchfeld können die Ursache sein. Prüfen Sie Anbieter und ungefähres Datum."
      },
      {
        "q": "Kann Cloud Calendars nach Teilnehmer-E-Mails oder Notizen suchen?",
        "a": "Die aktuelle Suche gleicht den Termintitel ab. Für Teilnehmer, Notizen oder Orte verwenden Sie die dafür dokumentierten Suchwerkzeuge des Anbieters."
      },
      {
        "q": "Durchsucht die App das Vorjahr, wenn ich dorthin blättere?",
        "a": "Verlassen Sie sich nicht darauf. Die aktuelle Suchansicht lädt beim Öffnen das laufende Jahr. Verwenden Sie für historische Einträge die Zeitraum-Suche eines Anbieters statt eine unbegrenzte App-Historie anzunehmen."
      }
    ],
    "sourcesHeading": "Quellen und Hilfe zur Anbietersuche",
    "sources": [
      {
        "label": "Google: In Google Kalender am Computer suchen",
        "url": "https://support.google.com/calendar/answer/37176?hl=en&co=GENIE.Platform%3DDesktop"
      },
      {
        "label": "Apple: Ereignisse in Kalender auf dem iPhone suchen",
        "url": "https://support.apple.com/guide/iphone/search-for-events-iph2c9ef44ad/ios"
      }
    ],
    "seeAlso": [
      "what-calendar-sync-actually-does",
      "a-list-for-people-who-dislike-grids",
      "when-two-calendars-disagree"
    ]
  },
  "calendar-export-ics-pdf-and-backup": {
    "updated": "2026-10-21",
    "title": "Kalender exportieren: ICS-Dateien, PDFs und Abonnements",
    "short": "Kalenderexport und Sicherung",
    "description": "Kalenderdaten vom iPhone-Konto sichern oder teilen? Wählen Sie ICS, PDF oder ein Abonnement und den passenden Weg über Google, Mac oder Outlook.",
    "lede": "Der Kalender auf Ihrem iPhone kann mehrere Konten anzeigen. Für eine brauchbare Kopie müssen Sie die Quelle kennen und entscheiden, ob Sie Ereignisdaten, einen lesbaren Zeitplan oder laufende Aktualisierungen brauchen. Dieser Leitfaden stammt von Arte Soft, dem Entwickler von Cloud Calendars.",
    "sections": [
      {
        "heading": "Erst das Ergebnis, dann das Format wählen",
        "body": [
          "Ein Kalenderexport kann unterschiedliche Aufgaben erfüllen. Soll eine andere Kalender-App Ereignisdatensätze lesen, wählen Sie ein unterstütztes strukturiertes Format wie ICS. Für einen lesbaren Zeitplan eignet sich ein PDF oder Ausdruck. Für spätere Änderungen prüfen Sie ein Abonnement oder eine Freigabe mit Berechtigungen.",
          "Ein PDF hält das gespeicherte Layout fest; es ist keine Importdatei für Termine. Eine heruntergeladene ICS-Datei enthält Daten zum Zeitpunkt des Downloads. Ein ICS-Abonnement verwendet eine Adresse, die der Kalender erneut abruft. Die Dateiendung allein unterscheidet nicht zwischen importierter Momentaufnahme und laufendem Abonnement.",
          "Eine Wochenendreise als PDF lässt sich gut lesen. Ein Kollege, der Termine in ein anderes Konto überträgt, braucht Ereignisdaten. Ein Vereinsmitglied, das sich ändernde Spieltermine verfolgen möchte, braucht eine aktualisierte Quelle. Klären Sie das Ziel vor dem Versand."
        ]
      },
      {
        "heading": "Mit dem Konto beginnen, das die Termine enthält",
        "body": [
          "Identifizieren Sie auf dem iPhone Kalender und Konto mit den benötigten Ereignissen. Eine gemeinsame Ansicht kann mehrere Konten, Freigaben und Abonnements enthalten. Das macht daraus keinen einzelnen Quellkalender für den Export.",
          "Für Google Kalender benötigen Sie einen Computer; die Google-Kalender-App bietet keinen Export. Öffnen Sie auf der Website „Settings“, „Import & export“ und „Export“. Die ZIP-Datei enthält einzelne ICS-Dateien. Für einen Kalender wählen Sie dessen „Settings and sharing“ und „Export calendar“. Google verlangt Berechtigung zur Verwaltung von Änderungen und Freigaben; auch eine Organisation kann den Export einschränken.",
          "Ist der Kalender in Kalender auf dem Mac verfügbar, wählen Sie ihn in der Seitenleiste und nutzen „File > Export > Export“ für eine ICS-Datei. Dies ist ein Mac-Verfahren, kein versteckter iPhone-Befehl. Prüfen Sie vor dem Speichern den ausgewählten Kalender."
        ]
      },
      {
        "heading": "Wenn ein PDF-Zeitplan gebraucht wird",
        "body": [
          "Verwenden Sie in Kalender auf dem Mac „File > Print“ und wählen Sie Layout, Datumsbereich und Kalender. Im macOS-Druckdialog nutzen Sie das PDF-Menü und „Save as PDF“. Öffnen Sie das Ergebnis vor dem Versand: Ein kleines Raster kann wichtige Angaben abschneiden oder weglassen.",
          "Nennen Sie im Begleittext den Zeitraum und die relevante Zeitzone. Prüfen Sie private Termine, Notizen und Orte vor der Weitergabe. Spätere Kalenderänderungen verändern kein bereits versandtes PDF. Kennzeichnen Sie eine überarbeitete Kopie eindeutig."
        ]
      },
      {
        "heading": "Abonnieren und Veröffentlichen ist keine Sicherung",
        "body": [
          "Microsoft unterscheidet für Outlook im Web ausdrücklich: Eine veröffentlichte ICS-Datei herunterzuladen und zu importieren erzeugt eine Kopie ohne spätere Aktualisierungen. Ein Abonnement der ICS-Adresse folgt Änderungen. Das Aktualisierungsintervall hängt vom Anbieter des Empfängers ab; der veröffentlichte Kalender ist schreibgeschützt.",
          "Wo verfügbar, können Sie in Outlook über „Settings > Shared calendars > Publish a calendar“ Kalender und Detailgrad wählen. Veröffentlichung ermöglicht Ansicht oder Abonnement. Nutzen Sie das für eine beabsichtigte Zielgruppe, nicht als private Sicherung. Ein gespeicherter Link bleibt von der Verfügbarkeit der Quelle abhängig."
        ]
      },
      {
        "heading": "Was Cloud Calendars beim Teilen bereitstellt",
        "body": [
          "Wir entwickeln Cloud Calendars. Die Ereignisfreigabe bietet App Clip, E-Mail und QR-Code als Wege für Einladungslinks. Diese erfüllen einen anderen Zweck als der Download eines ganzen Kalenders. Ein Link kann zu einer Einladung oder einem Abonnement führen, ist aber kein portables Archiv aller angezeigten Kalender.",
          "Dieser Leitfaden enthält keine Anleitung zum vollständigen ICS-, CSV- oder PDF-Export aus Cloud Calendars. Nutzen Sie dafür die dokumentierten Anbieter- oder Mac-Verfahren. Für einen einzelnen Termin hilft unser Freigabeleitfaden. Für einen laufenden gemeinsamen Zeitplan klären Sie zuerst, wer Zugriff, Aktualisierungen oder Bearbeitungsrechte braucht."
        ]
      },
      {
        "heading": "Eine Kopie prüfen, bevor Sie sich darauf verlassen",
        "body": [
          "Behalten Sie den Originalkalender während der Prüfung. Notieren Sie Konto, Kalendername und Exportdatum. Testen Sie einen Import nach Möglichkeit in einem eigenen Zielkalender. Vergleichen Sie einen normalen Termin, ein ganztägiges Ereignis und eine Serie mit einem geänderten Einzeltermin.",
          "Eine Übertragung garantiert nicht den Erhalt aller Meetingfunktionen. Google weist darauf hin, dass importierte Ereignisse keine Gäste und Konferenzdaten enthalten und CSV-Wiederholungen zu einzelnen Terminen werden können. Prüfen Sie Einladungen, Meetinglinks und Wiederholungen vor Abschluss einer Migration.",
          "Apple bietet auf dem Mac außerdem „File > Export > Calendar Archive“ für ein ICBU-Archiv. Das unterscheidet sich vom Export einer ICS-Datei. Apple warnt, dass ein Archivimport aktuelle Kalenderinformationen und Daten ersetzt. Verwenden Sie eine Archivwiederherstellung nicht als beiläufigen Importtest."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Bestimmen Sie Konto und Kalender sowie das Ziel: Momentaufnahme, Druckansicht oder aktualisiertes Abonnement.",
      "Nutzen Sie den dokumentierten Exportweg und behalten Sie während der Prüfung das Original.",
      "Prüfen Sie Ziel, sensible Angaben und repräsentative Termine vor Weitergabe oder Nutzung."
    ],
    "faq": [
      {
        "q": "Kann ich Google Kalender direkt aus seiner iPhone-App exportieren?",
        "a": "Nein. Googles dokumentierter Export erfordert einen Computer sowie die passende Berechtigung zur Verwaltung der Freigaben."
      },
      {
        "q": "Ist ein ICS-Abonnement eine Sicherung?",
        "a": "Es folgt einer Quelle, die sich ändern oder wegfallen kann. Speichern Sie für eine datierte Kopie einen unabhängigen Export und prüfen Sie dessen Inhalt."
      },
      {
        "q": "Soll ich ICS oder PDF wählen?",
        "a": "ICS eignet sich für Ereignisdaten zum Import in einen kompatiblen Kalender. PDF eignet sich für einen lesbaren Zeitplan. Ein PDF liefert keine Aktualisierungen und stellt über die dokumentierten Importwege keine bearbeitbaren Termine wieder her."
      }
    ],
    "sourcesHeading": "Offizielle Anleitungen und Formatgrenzen",
    "sources": [
      {
        "label": "Google: Kalenderereignisse exportieren",
        "url": "https://support.google.com/calendar/answer/37111?hl=en"
      },
      {
        "label": "Google: Ereignisse importieren und Übertragungsgrenzen",
        "url": "https://support.google.com/calendar/answer/37118?hl=en"
      },
      {
        "label": "Apple: ICS-Dateien und Kalenderarchive auf dem Mac",
        "url": "https://support.apple.com/guide/calendar/import-or-export-calendars-icl1023/mac"
      },
      {
        "label": "Apple: Dokumente auf dem Mac als PDF sichern",
        "url": "https://support.apple.com/en-gb/guide/mac-help/mchlp1531/mac"
      },
      {
        "label": "Microsoft: Veröffentlichung, Import und Abonnement in Outlook",
        "url": "https://support.microsoft.com/en-us/outlook/share-your-calendar-in-outlook-on-the-web"
      }
    ],
    "seeAlso": [
      "sharing-one-event-not-your-calendar",
      "inviting-people-who-do-not-have-the-app",
      "the-secret-address-of-a-google-calendar"
    ]
  }
};
