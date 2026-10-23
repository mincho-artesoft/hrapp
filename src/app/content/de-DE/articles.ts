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
  "month-view-on-a-bigger-screen": {
  "updated": "2026-10-22",
  "title": "Monatskalender auf iPad und iPhone: erst Daten vergleichen, dann Details prüfen",
  "short": "Monatsansicht nutzen, ohne Details zu übersehen",
  "description": "Vergleiche Tage auf iPad oder iPhone. Prüfe verborgene Termine, Kalenderauswahl und Uhrzeiten vor dem Verschieben gemeinsamer oder wiederkehrender Termine.",
  "lede": "Die Monatsansicht zeigt, auf welche Tage Verpflichtungen fallen. Ob eine bestimmte Stunde frei ist, lässt sich damit weniger gut beurteilen. Wähle in der Übersicht einen Tag und prüfe dann Tag und Termin, bevor du zusagst. Dieser Leitfaden stammt von Arte Soft, dem Entwickler von Cloud Calendars.",
  "commonBelief": "Ein größeres Monatsraster zeigt jedes Detail, und ein scheinbar leerer Tag beweist, dass alle Zeit haben.",
  "sections": [
    {
      "heading": "Zwischen Tagen und genauen Uhrzeiten unterscheiden",
      "body": [
        "Vergleiche im Monat eine Projektfrist, eine Reise und einen Familientermin über mehrere Wochen. Geht es darum, ob sich zwei Termine um 14:30 überschneiden, wechsle zur Tages- oder Wochenansicht und prüfe Beginn und Ende. Eine Monatszelle hat nicht denselben Zeitmaßstab wie ein Stundenraster.",
        "Ein Workshop-Organisator kann zunächst eine Reisewoche ausschließen. Danach folgt die Prüfung des vorgesehenen Tages: bestehende Verpflichtungen, Vorbereitung, Anfahrt und nötiges Ende. Eine frei wirkende Zelle ist ein Kandidat zur Prüfung, keine bestätigte Buchung oder Aussage über die Verfügbarkeit anderer."
      ]
    },
    {
      "heading": "Die Zusatzanzahl beachten, statt nur sichtbare Titel zu zählen",
      "body": [
        "Die aktuelle Monatszelle von Cloud Calendars zeigt nur eine begrenzte Zahl von Terminelementen und bei weiteren Terminen eine zusätzliche Anzahl. Titel bleiben einzeilig und können gekürzt sein. Öffne den Tag oder einzelnen Termin, wenn vollständiger Titel oder weitere Verpflichtungen wichtig sind.",
        "Ein größeres iPad-Display kann die Übersicht lesbarer machen, hebt aber nicht automatisch jede Anzeigegrenze auf. Ein schmales App-Fenster oder größere Schrift verändert den verfügbaren Platz. Prüfe auf dem iPhone ebenso den zugrunde liegenden Tag, bevor du sichtbare Elemente für den vollständigen Plan hältst."
      ]
    },
    {
      "heading": "Monat, Kalenderauswahl und benachbarte Daten prüfen",
      "body": [
        "Lies vor der Auswahl Monat und Jahr. Ein Monatsraster kann zum Auffüllen seiner Zeilen Daten des Nachbarmonats enthalten. Nutze in Cloud Calendars die Monatsnavigation und prüfe das ausgewählte Datum, statt dich allein auf die Position eines Feldes zu verlassen.",
        "Kontrolliere die ausgewählten Kalender. Ausgeblendete Arbeitstermine können einen Familienplan übersichtlicher machen, fehlen dann aber in dieser Ansicht. Blende zur Prüfung eines Duplikats vorübergehend eine Quelle aus und vergleiche; lösche keinen Termin nur für einen weniger vollen Monat."
      ]
    },
    {
      "heading": "Vor Änderungen gemeinsamer Absprachen den Termin öffnen",
      "body": [
        "Prüfe Titel, Eigentümer oder Kalender, Ortszeit und Dauer in den Details. Eine Farbe hilft beim Überfliegen, ersetzt aber weder Kontozuordnung noch Kenntnis der Bearbeitungsrechte. Eine sichtbare Einladung ist etwas anderes als ein selbst organisierter Termin.",
        "Cloud Calendars ermöglicht in der Monatsansicht das Ziehen von Terminen auf ein anderes Datum. Kläre vor einer echten Änderung das Ziel und den Umfang bei Wiederholungen. Öffne nach einer erlaubten Änderung den Termin erneut; eine lokale Geste beweist nicht, dass der Anbieter oder alle Teilnehmer die neue Absprache akzeptiert haben."
      ]
    },
    {
      "heading": "Wiederholungen und Zeitzonen gesondert prüfen",
      "body": [
        "Wenn nur der Unterricht dieser Woche verschoben wird, ändere nicht versehentlich das künftige Muster. Lies die angebotene Auswahl zum Wiederholungsumfang und prüfe danach den geänderten sowie einen späteren Termin. Im Monat lassen sich wiederkehrende Daten gut vergleichen, aber der Bearbeitungsumfang bestimmt die Wirkung.",
        "Prüfe bei Reisen oder zeitzonenübergreifenden Besprechungen ausdrücklich das lokale Datum und die Uhrzeit. Das Verschieben auf einen anderen Tag rechnet die beabsichtigte Besprechungszeit nicht automatisch um. Beachte gegebenenfalls Zeitumstellungen und bestätige die vereinbarte Zeit mit den Beteiligten."
      ]
    },
    {
      "heading": "Die größere Ansicht nutzen, ohne Produkte zu verwechseln",
      "body": [
        "Apple Kalender bietet eigene Monatsdarstellungen, Teamup beschreibt unterschiedliche Ansichten für Browser und Mobilgeräte. Diese Einstellungen gehören zum jeweiligen Produkt. Suche Teamups Browserkonfiguration oder Apples Ansichtsmenü nicht in Cloud Calendars, nur weil die Ansichten gleich heißen.",
        "Ein Monat voller Termine bedeutet auch keinen Monat voller Wettervorhersagen. Prüfe bei Plänen im Freien Ort, Datum und verfügbare Vorhersagestunden getrennt. Speichere den endgültigen Termin im richtigen Kalender und bestätige Änderungen direkt mit den Teilnehmern."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Im Monat mögliche Tage auswählen, genaue Stunden im Tag oder in der Woche prüfen.",
    "Tage mit Zusatzanzahl oder gekürzten Titeln öffnen.",
    "Monat, Jahr und ausgewählte Kalender prüfen, bevor du einen Tag als frei ansiehst.",
    "Kalender, Uhrzeit, Dauer und Bearbeitungsrecht bestätigen.",
    "Wiederholungsumfang lesen und nach dem Verschieben den gespeicherten Termin prüfen.",
    "Wetterverfügbarkeit gesondert prüfen und Änderungen mit Teilnehmern bestätigen."
  ],
  "faq": [
    {
      "q": "Zeigt die iPad-Monatsansicht alle Termine vollständig?",
      "a": "Gehe nicht davon aus. Cloud Calendars begrenzt die Terminelemente einer Monatszelle und zeigt eine Zusatzanzahl. Öffne Tag und Termin für den vollständigen Plan."
    },
    {
      "q": "Bin ich an einem leeren Tag frei?",
      "a": "Prüfe zuerst Kalenderauswahl, Datum und verfügbare Kontodaten. Die Übersicht bildet nur die aktuell verfügbaren und angezeigten Informationen ab."
    },
    {
      "q": "Ändert das Verschieben eines Serientermins nur dieses Datum?",
      "a": "Lies die Auswahl zum Bearbeitungsumfang. Prüfe nach dem Speichern die geänderte und eine spätere Wiederholung und bestätige die gewünschte Absprache."
    }
  ],
  "sourcesHeading": "Offizielle Beschreibungen der Ansichten vergleichen",
  "sources": [
    {
      "label": "Apple: Monats-, Mehrtages- und Listenansicht in Apple Kalender",
      "url": "https://support.apple.com/en-ca/guide/iphone/iphfd1054569/ios"
    },
    {
      "label": "Teamup: Kalenderansichten und Konfiguration in Browser und App",
      "url": "https://calendar.teamup.com/kb/how-to-use-calendar-views/"
    }
  ],
  "seeAlso": [
  "drag-an-event-to-move-it",
  "recurring-events-without-the-mess"
]
},

"keeping-track-of-who-replied":{
  "updated": "2026-10-21",
  "title": "Kalenderantworten: Teilnahme und Freigabezugriff unterscheiden",
  "short": "Wer geantwortet hat und wer Zugriff hat",
  "description": "Unterscheide Teilnahmeantworten von offenen Einladungen, anonymen Empfängern und angenommenen Freigaben. Bestätige Teilnahme ohne geschätzte Gästezahlen.",
  "lede": "Eine Person kann einen Link öffnen, ein Ereignis hinzufügen oder Kalenderzugriff annehmen, ohne ihre Teilnahme zuzusagen. Kläre vor dem Lesen einer Empfängerliste, welche Antwort du brauchst. Dieser Leitfaden stammt von Arte Soft, dem Entwickler von Cloud Calendars.",
  "commonBelief": "Alle verzeichneten Empfänger oder angenommenen Freigaben seien bestätigte Teilnehmende; aus Schweigen lasse sich zuverlässig eine Zahl ableiten.",
  "sections": [
    {
      "heading": "1. Bestimme die Art der Einladung",
      "body": [
        "Eine Besprechungseinladung des Anbieters fragt nach Teilnahme. Eine Cloud-Calendars-Freigabe gibt Zugriff auf Ereignisdetails oder einen Kalender, möglicherweise mit Bearbeitungsrechten. Ein ICS-Abonnement folgt Informationen. Diese Vorgänge können dieselbe Besprechung betreffen, ohne dieselbe Entscheidung zu erfassen.",
        "Eine freiwillig helfende Person kann etwa „Writer“-Zugriff zur Aktualisierung eines Ereignisses annehmen, ohne teilzunehmen. Ein Gast liest vielleicht die Webvorschau und antwortet anschließend per Nachricht. Zähle keinen dieser Fälle allein anhand der Zugriffsverwaltung."
      ]
    },
    {
      "heading": "2. Lies Freigabeempfänger als Zugriffsinformation",
      "body": [
        "Die Empfängerinformationen in Cloud Calendars unterscheiden offene E-Mail-Einladungen, identifizierte und anonyme Empfänger sowie Zugriffsrollen. Bei einer offenen Einladung kann erneutes Senden angeboten werden. „Reader“, „Writer“ und „Owner“ beschreiben die Möglichkeiten im Umgang mit geteilten Informationen.",
        "Das Freigabesystem erfasst Annahme oder Empfang beim Hinzufügen beziehungsweise Zugreifen. Das hilft, die Freigabebeziehung zu verstehen, ist aber keine Teilnahmeantwort Ja/Vielleicht/Nein. Auch anonymer Empfang identifiziert keinen namentlichen Gast für deine Teilnehmerzahl."
      ]
    },
    {
      "heading": "3. Prüfe Teilnahme im Einladungsablauf des Organisators",
      "body": [
        "Google dokumentiert für Besprechungseinladungen ausdrückliche Antworten „Yes“, „No“ und „Maybe“. Apple Kalender unterscheidet bei unterstützten Einladungen ebenfalls „Accept“, „Maybe“ und „Decline“. Prüfe Antworten am entsprechenden Ereignis und Konto des Organisators.",
        "Fehlt eine Antwort oder wirkt sie falsch, bestätige mit der Person die eingeladene E-Mail-Adresse und Ereignisversion. Eine importierte Kopie, ein weitergeleiteter Link oder ein Ereignis in einem anderen Konto muss nicht die ursprüngliche Einladung abbilden. Nicht jede Drittanbieteranzeige enthält zwingend die neueste Antwort."
      ]
    },
    {
      "heading": "4. Lass unbekannte Teilnahme unbekannt",
      "body": [
        "Eine offene Freigabe, fehlende Antwort oder ungelesene Nachricht ist weder zuverlässige Zusage noch Absage. Erfasse ausdrücklich bestätigte Personen, Absagen und weiterhin unbekannte Antworten getrennt. Addiere keinen festen Anteil schweigender Empfänger zur bestätigten Zahl.",
        "Nenne bei einem Essen mit Buchungsfrist das Datum, bis zu dem du eine Antwort brauchst, und frage die übrigen Personen direkt. Das Nachfassen hängt vom Ereignis ab; es gibt keine allgemeine Regel, dass eine Erinnerung zwei Tage vorher genügt."
      ]
    },
    {
      "heading": "5. Behandle Besprechungslinks als Beitrittsinformationen",
      "body": [
        "Eine Google-Meet- oder Microsoft-Teams-URL zeigt, wo jemand beitreten kann, nicht ob er zugesagt hat oder teilnehmen wird. Cloud Calendars führt Google Meet unter Base und Microsoft Teams unter Premium, abhängig vom Konto und Anbieterablauf. Ein höherer Tarif macht die Teilnehmerzahl nicht zuverlässiger.",
        "Prüfe, ob der richtige Link im Ereignis steht und für die vorgesehene Zielgruppe funktioniert. Dateiimporte und Umwandlungen können Konferenzinformationen verlieren. Änderst du die Besprechung, teile den Beteiligten Ereignis und Link mit, statt ihren alten Zugriffsdatensatz als Bestätigung zu deuten."
      ]
    },
    {
      "heading": "6. Bestätige wichtige Änderungen erneut",
      "body": [
        "Verschiebt sich ein Ereignis wesentlich, aktualisiere es über den zuständigen Kalender oder Freigabeablauf. Informiere anschließend die Personen, auf deren Teilnahme es ankommt, und bitte bei Bedarf um erneute Bestätigung. Eine frühere Antwort auf Dienstag gilt nicht unbedingt für Donnerstag.",
        "Halte die endgültige Teilnehmerliste getrennt von der Zugriffsliste. Bearbeitungsrechte zu entfernen sagt die Teilnahme nicht ab; geteilten Zugriff abzulehnen lehnt nicht zwangsläufig das Treffen ab. Formuliere Nachrichten klar, damit alle wissen, welche Entscheidung gefragt ist."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Bestimme, ob du eine Anbietereinladung, eine App-Freigabe oder einen Feed gesendet hast.",
    "Nutze die Freigabeliste für Zugriffe und offene Einladungen, nicht für Teilnehmerzahlen.",
    "Prüfe gegebenenfalls die Anbieterantwort am tatsächlichen Ereignis des Organisators.",
    "Trenne unbekannte Antworten von Zusagen und Absagen.",
    "Bitte um eine direkte Antwort bis zu einer passenden Frist.",
    "Bestätige nach wesentlichen Änderungen die neue Vereinbarung und den Beitrittslink mit betroffenen Gästen."
  ],
  "faq": [
    {
      "q": "Bedeutet angenommener Kalenderzugriff, dass die Person kommt?",
      "a": "Nein. Damit wurde eine Freigabebeziehung über diesen Ablauf angenommen. Teilnahme erfordert eine Anbieterantwort oder eine ausdrückliche Rückmeldung der Person."
    },
    {
      "q": "Kann ich anonyme Empfänger als bestätigte Gäste zählen?",
      "a": "Nein. Anonymer Empfang ist keine identifizierte Teilnahmezusage. Er kann die Nutzung eines geteilten Ereignisses beschreiben, liefert aber keine verlässliche namentliche Gästeliste."
    },
    {
      "q": "Brauche ich Premium, um zu sehen, wer geantwortet hat?",
      "a": "Setze einen App-Tarif nicht mit zuverlässigen Teilnahmeantworten gleich. Premium ergänzt Microsoft-Kalender und Teams; Zugriffsbestätigungen und Anbieterantworten bleiben unterschiedliche Informationen. Prüfe ursprüngliche Einladung und Organisatorkonto."
    }
  ],
  "sourcesHeading": "Quellen zu Teilnahme und Import",
  "sources": [
    {
      "label": "Google: auf Ereigniseinladungen antworten",
      "url": "https://support.google.com/calendar/answer/37135?hl=en"
    },
    {
      "label": "Apple: auf Kalendereinladungen am iPhone antworten",
      "url": "https://support.apple.com/en-ph/guide/iphone/iphc0eddfe3c/ios"
    },
    {
      "label": "Google: Ereignisimport und Einschränkungen",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    }
  ],
  "seeAlso": [
    "sharing-one-event-not-your-calendar"
  ]
},

"exchange-calendars-on-an-iphone":{
  "updated": "2026-10-22",
  "title": "Microsoft- und Exchange-Kalender auf dem iPhone: zuerst die Verbindung prüfen",
  "short": "Microsoft-Kalender auf dem iPhone",
  "description": "Prüfe Microsoft-Kontotyp, Arbeitgeberfreigabe und Rechte, bevor du einen Arbeitskalender verbindest. Erfahre, was Cloud Calendars Premium ergänzt.",
  "lede": "„Exchange-Kalender“ kann unterschiedliche Dienste und Arbeitsplatzregeln bedeuten. Kläre vor Einstellungsänderungen oder einem Kauf, wo dein Postfach liegt und welche Verbindung deine Organisation erlaubt. Dieser Leitfaden stammt von Arte Soft, dem Entwickler von Cloud Calendars.",
  "commonBelief": "Jede App mit Microsoft-Anmeldung müsse mit jedem Exchange-Server und jedem geteilten Arbeitskalender funktionieren.",
  "sections": [
    {
      "heading": "1. Bestimme das Postfach, nicht nur die Outlook-App",
      "body": [
        "Outlook ist eine App und ein Name für Microsoft-Dienste. Ein Konto in Outlook sagt nicht, welcher Server dessen Kalender bereitstellt. Frage nach, ob du ein persönliches Microsoft-Konto, ein Microsoft-365-Postfach in Exchange Online oder eine eigene Exchange-Installation der Organisation nutzt.",
        "Cloud Calendars bietet Microsoft-Anmeldung und verwendet die Verbindung zum Microsoft-Kalenderdienst. Das ist keine universelle Einrichtung mit Serveradresse und Passwort für jede Exchange-Installation. Microsoft dokumentiert seine Kalender-API getrennt von allgemeinen Exchange-Einstellungen. Kläre den vorgesehenen Weg für dein Postfach, statt einen Servernamen zu erraten."
      ]
    },
    {
      "heading": "2. Trenne Apples Gerätekonto von der App-Verbindung",
      "body": [
        "Ein über ein genehmigtes Gerätekonto bereits in Apple Kalender verfügbarer Arbeitskalender nutzt einen anderen Weg als „Sign in with Microsoft“ in Cloud Calendars. Auch Kalender aus dem Kalendersystem des Telefons benötigen Kalenderzugriff. Eine erfolgreiche Einrichtung in Apples Einstellungen beweist nicht, dass eine separate Microsoft-Anmeldung genehmigt wird.",
        "Prüfe vor einer weiteren Verbindung, wo der bestehende Arbeitskalender erscheint. Siehst du später zwei Versionen einer Besprechung, bestimme ihre Kalenderquellen und blende eine vorübergehend aus. Entferne keine Konten und lösche keine Ereignisse, um herauszufinden, welche Verbindung sie erzeugt hat. Notiere in Cloud Calendars die ursprüngliche Auswahl und stelle sie nach dem Vergleich wieder her. Die Auswahl kann auch Widgets und die Planung von Benachrichtigungen beeinflussen; gehe nicht davon aus, dass sie nur die Anzeige verändert."
      ]
    },
    {
      "heading": "3. Prüfe Premium und organisatorische Freigabe getrennt",
      "body": [
        "Premium ergänzt Cloud Calendars um Microsoft-Kalender- und Microsoft-Teams-Funktionen. Advanced entfernt Werbung aus Base, schaltet aber die Microsoft-Anmeldung der App nicht frei. Prüfe den aktuellen lokalen Kaufpreis und Abrechnungszeitraum statt einer Preisangabe für eine andere Region.",
        "Ein Abonnement kann die Entscheidung eines Arbeitgebers zum App-Zugriff nicht aufheben. Microsoft erlaubt Organisationen, Nutzereinwilligungen zu steuern und Administratorfreigaben zu verlangen. Wird eine Freigabe angefordert, gib der Administration App-Name, vorgesehenes Konto und exakten Meldungstext. Veröffentliche den Arbeitskalender nicht und wechsle nicht zu einem privaten Konto, um diese Entscheidung zu umgehen."
      ]
    },
    {
      "heading": "4. Untersuche die fehlgeschlagene Phase",
      "body": [
        "Wird die Anmeldung nicht abgeschlossen, prüfe gewählte Identität, Netzwerk und Microsoft-Meldung. Eine Freigabeanforderung ist etwas anderes als eine abgelaufene Sitzung oder ein Verbindungsfehler. Nicht jede fehlgeschlagene Verbindung lässt sich auf Arbeitgeberregeln zurückführen.",
        "Gelingt die Anmeldung, fehlt aber ein Kalender, prüfe Kontogruppe und Kalenderauswahl in Cloud Calendars und vergleiche dasselbe Konto in Outlook. Fehlt nur ein geteilter oder delegierter Kalender, während der eigene erscheint, untersuche dessen Zugriff gesondert. Allgemeine Microsoft-API-Funktionen garantieren nicht, dass jedes Szenario mit geteilten Postfächern oder Delegierung in dieser App verfügbar ist."
      ]
    },
    {
      "heading": "5. Unterscheide eine sichtbare Kopie von einer bestätigten Änderung",
      "body": [
        "Die Microsoft-Verbindung verwendet Kalenderkopien im Kalendersystem des iPhones. Ihr Speicherziel kann von den verfügbaren Quellen auf dem Gerät abhängen. Kläre für ein Arbeitskonto vor sensiblen Besprechungen, ob diese Anordnung den Vorgaben deiner Organisation entspricht. Gehe nicht davon aus, dass eine Kopie ausschließlich im ursprünglichen Postfach bleibt.",
        "Ein Teamkalender kann etwa eine Besprechung anzeigen, deine Änderung aber wegen fehlender Rechte ablehnen. Eine erfolgreiche lokale Bearbeitung ist nicht die abschließende Prüfung. Vergleiche das Ereignis in Outlook mit demselben Konto. Teste nur ein entbehrliches Ereignis in einem eigenen Kalender, ohne Kollegen einzuladen oder eine bestehende Besprechung zu verändern."
      ]
    },
    {
      "heading": "6. Halte Zuständigkeit und Verfügbarkeit ausdrücklich fest",
      "body": [
        "Eine von einem Kollegen organisierte Besprechung darfst du nicht allein deshalb verschieben oder umschreiben, weil sie neben privaten Plänen erscheint. Berücksichtige Organisator, Arbeitskalender und vorgesehene Teilnehmende. Nutze den genehmigten Anbieterprozess, wenn eine Aktion fehlt oder eine Änderung den Server nicht erreicht.",
        "Ebenso sperrt ein privater Termin neben Arbeitsterminen nicht automatisch die berufliche Verfügbarkeit und verbirgt seine Details nicht automatisch als allgemeinen Belegt-Eintrag. Frage nach einer unterstützten Freigabemethode und prüfe das Ergebnis. Ein schreibgeschützter Kalenderlink ersetzt keinen Bearbeitungszugriff, und die Veröffentlichung eines Links ist keine Abkürzung bei der Fehlersuche."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Kläre den Postfachanbieter und den von der Organisation erlaubten Verbindungsweg.",
    "Prüfe, ob der Kalender bereits über ein Gerätekonto auf das iPhone gelangt.",
    "Prüfe Premium getrennt von Microsoft-Einwilligung und Kalenderrechten.",
    "Wähle bei der Microsoft-Anmeldung die richtige Identität und bewahre Fehlermeldungen für den Support auf.",
    "Wähle nach der Anmeldung den benötigten Kalender und vergleiche ein aktuelles Ereignis in Outlook.",
    "Bestätige eine erlaubte Teständerung beim Anbieter; lasse bestehende Einladungen und Serientermine unverändert."
  ],
  "faq": [
    {
      "q": "Garantiert Premium die Verbindung zum Exchange-Server meiner Firma?",
      "a": "Nein. Premium aktiviert die Microsoft-Funktionen der App. Postfachkompatibilität, Freigabe der Organisation und Rechte einzelner Kalender sind getrennte Voraussetzungen. Bestätige die Verbindung mit der Administration, bevor du eine Exchange-Installation als unterstützt betrachtest."
    },
    {
      "q": "Warum funktioniert Outlook, während eine andere Kalender-App abgelehnt wird?",
      "a": "Apps können unterschiedliche Rechte und Freigaben benötigen. Ein funktionierendes Outlook ist eine nützliche Referenz für das Konto, beweist aber keine Freigabe für eine andere App. Nutze den tatsächlichen Fehler oder die Freigabeanforderung zur Diagnose."
    },
    {
      "q": "Kann ich bei blockierter Microsoft-Anmeldung einen öffentlichen Kalenderlink verwenden?",
      "a": "Veröffentliche keine Arbeitsinformationen, um eine blockierte Verbindung zu umgehen. Ein Kalenderabonnement ist normalerweise schreibgeschützt und kein gleichwertiger Bearbeitungszugriff. Frage Eigentümer oder Administration nach einer genehmigten Methode; setze nicht voraus, dass ein veröffentlichter Link erlaubt ist."
    }
  ],
  "sourcesHeading": "Quellen und Anbieterhinweise",
  "sources": [
    {
      "label": "Microsoft: Outlook-Kalender-API und unterstützte Postfachdaten",
      "url": "https://learn.microsoft.com/en-us/graph/outlook-calendar-concept-overview"
    },
    {
      "label": "Microsoft: Einwilligung von Nutzern und Administratoren",
      "url": "https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/user-admin-consent-overview"
    },
    {
      "label": "Apple: mehrere Kalender und schreibgeschützte Abonnements",
      "url": "https://support.apple.com/en-lamr/guide/iphone/iph3d1110d4/ios"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-a-subscription-actually-buys"
  ]
},

  'weather-inside-your-calendar': {
  "updated": "2026-10-23",
  "title": "Kalender mit Wetter auf iPhone und iPad: Planen Sie Ihren Tag in einer Ansicht",
  "short": "Kalender und Wetter zusammen nutzen",
  "description": "Vergleichen Sie auf iPhone und iPad Ihren Kalender mit dem Wetter für den ausgewählten Ort.",
  "lede": "Cloud Calendars vereint Ihren Zeitplan und das Wetter in derselben App auf dem iPhone oder iPad. Wählen Sie im Kalender ein Datum aus und prüfen Sie in der Wetteransicht den ausgewählten Ort und die verfügbaren Prognosestunden. Wenn Sie etwas im Freien planen, schauen Sie auf den Zeitraum, der wirklich relevant ist, statt sich nur auf ein Tagessymbol zu verlassen. Dieser Leitfaden wird von Arte Soft, dem Entwickler der App, veröffentlicht.",
  "commonBelief": "Das neben einem Kalender angezeigte Wetter beschreibt automatisch die Adresse jedes Termins, jede Stunde und jedes zukünftige Datum.",
  "sections": [
    {
      "heading": "Wählen Sie eine konkrete Planungsfrage",
      "body": [
        "Gehen Sie von einem bestimmten Termin aus, zum Beispiel einem nachmittäglichen Besuch im Park. Überlegen Sie, was sich ändern könnte: die Uhrzeit, der Ort, die Vorbereitung oder die Entscheidung für eine Alternative. Sie müssen nicht gleich den ganzen Kalender umstellen, nur weil das Tagessymbol Regen zeigt.",
        "Notieren Sie den tatsächlichen Beginn und das Ende der Aktivität, einschließlich Vorbereitungszeit, falls relevant. Eine Kalenderübersicht hilft dabei, mögliche Daten zu finden, während sich die Wetterprüfung auf einen bestimmten Ort und Zeitraum bezieht. Halten Sie diese beiden Aufgaben beim Vergleichen von Optionen auseinander."
      ]
    },
    {
      "heading": "Bestätigen Sie den Wetterort, bevor Sie die Werte lesen",
      "body": [
        "Cloud Calendars bietet Wetter für den aktuellen oder ausgewählten Ort. Prüfen Sie den angezeigten Ort, statt anzunehmen, dass die Adresse eines Ereignisses die Prognose stillschweigend ändert. Für einen Termin in einer anderen Stadt brauchen Sie einen Vergleich mit dem Wetter dieser Stadt.",
        "Zum Beispiel plant jemand vielleicht die Ankunft in einem Museum, während sich das Telefon noch zu Hause befindet. Prüfen Sie den Prognoseort und die Ortszeit des Termins, bevor Sie beides vergleichen. Ähnlich wirkende Werte sind kein Beleg dafür, dass Zeitplan und Wetter denselben Ort verwenden."
      ]
    },
    {
      "heading": "Stündliche und tägliche Abdeckung getrennt prüfen",
      "body": [
        "Nutzen Sie einen Tageseintrag zur Orientierung und die verfügbaren stündlichen Einträge für Fragen zu einem Teil des Tages. Eine Buchung von zwei bis fünf braucht mehr als einen kurzen Blick auf ein Symbol. Prüfen Sie, ob die relevanten Stunden tatsächlich vorhanden sind.",
        "In der aktuellen App-Quelle umfasst die Tagesliste bis zu zehn von WeatherKit zurückgegebene Tage. Das ist getrennt von der Kalendernavigation und von den aktuell gelieferten Stunden. Ein zukünftiger Termin erweitert die Wetterabdeckung nicht. Wenn sein Zeitraum fehlt, planen Sie eine spätere Wetterprüfung ein."
      ]
    },
    {
      "heading": "Lesen Sie, was der Wetterwert bedeutet",
      "body": [
        "Apple dokumentiert WeatherKit-Daten wie Temperatur, Niederschlag, Wind und UV; einige Produkte sind nur in ausgewählten Regionen verfügbar. Lesen Sie die für Ihren gewählten Ort verfügbaren Werte, statt überall mit jedem Wetterprodukt zu rechnen.",
        "Die Hinweise des Met Office zeigen, warum Prognosezeitraum und Definitionen von Variablen wichtig sind: Manche Werte beziehen sich auf einen Zeitpunkt, andere auf einen Zeitraum. Nutzen Sie die Bezeichnungen des jeweiligen Anbieters. Regenwahrscheinlichkeit, -menge und -dauer sind unterschiedliche Fragen, und keine einzelne Zahl entscheidet über jede Aktivität im Freien."
      ]
    },
    {
      "heading": "Einen aus einer Wetterstunde erstellten Entwurf prüfen",
      "body": [
        "Wenn die App das Erstellen eines Ereignisses aus einer Stunde anbietet, wird ein Entwurf geöffnet. Die aktuelle Quelle verwendet die Zeitzone des Wetterorts, schlägt eine Dauer von einer Stunde vor und wählt den Standardkalender für neue Ereignisse aus. Prüfen Sie jeden Wert, bevor Sie speichern.",
        "Bestätigen Sie Titel, Zielkalender, Beginn, Ende und den vorgesehenen Ort. Die Auswahl einer Prognosestunde erteilt keine Berechtigung, einen freigegebenen Kalender zu bearbeiten, einen Veranstaltungsort zu benachrichtigen oder einen Raum zu reservieren. Prüfen Sie das gespeicherte Ereignis und holen Sie alle erforderlichen Zustimmungen ein."
      ]
    },
    {
      "heading": "Die Demonstration auf der Website getrennt betrachten",
      "body": [
        "Die interaktive Wetterdemonstration auf der Website verwendet Open-Meteo. Die App verwendet Apple WeatherKit. Eine Web-Demonstration ist nützlich, um die Darstellung zu erkunden, aber Ort, Daten und verfügbare Termine können sich von der App unterscheiden.",
        "Für eine echte Entscheidung öffnen Sie die App und vergleichen Sie den geplanten Termin mit der verfügbaren Prognose. Wenn Sie einen gemeinsam abgestimmten Plan ändern, bestätigen Sie Organisator, Serienumfang und Teilnehmende. Halten Sie eine vereinbarte Alternative bereit, wenn die Aktivität von den Bedingungen abhängt."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Bestimmen Sie den Termin und die Entscheidung, die das Wetter beeinflussen könnte.",
    "Bestätigen Sie den Wetterort sowie das lokale Datum und die lokale Uhrzeit des Termins.",
    "Prüfen Sie die verfügbare stündliche Abdeckung getrennt von der Tagesübersicht.",
    "Lesen Sie Wahrscheinlichkeit, Menge und andere relevante Werte anhand ihrer Bezeichnungen.",
    "Prüfen Sie vor dem Speichern alle Details des Ereignisentwurfs und den Zielkalender.",
    "Prüfen Sie zum Entscheidungszeitpunkt erneut und bestätigen Sie gemeinsame Änderungen direkt."
  ],
  "faq": [
    {
      "q": "Folgt das neben meinem Kalender angezeigte Wetter jeder Ereignisadresse?",
      "a": "Gehen Sie nicht davon aus. Bestätigen Sie den angezeigten Wetterort und vergleichen Sie ihn mit dem Veranstaltungsort; räumliche Nähe auf dem Bildschirm belegt keine Übereinstimmung."
    },
    {
      "q": "Verwendet die App den Wetteranbieter der Website?",
      "a": "Nein. Die App verwendet Apple WeatherKit; die Demonstration auf der Website verwendet separat Open-Meteo."
    },
    {
      "q": "Wird beim Auswählen einer Prognosestunde automatisch ein Termin gespeichert?",
      "a": "Dabei wird ein Entwurf gestartet, sofern diese Aktion angeboten wird. Prüfen Sie Datum, Zeitzone, Dauer, Kalender und Ort und speichern Sie dann das gewünschte Ereignis."
    }
  ],
  "seeAlso": [
    "weather-calendar-history-versus-forecast-iphone",
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather",
    "weather-where-the-event-is",
    "planning-outdoors-without-being-rained-on"
  ],
  "sourcesHeading": "Offizielle Quellen und weiterführende Informationen",
  "sources": [
    {
      "label": "Apple: WeatherKit-Prognoseinformationen und regionale Verfügbarkeit",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: Prognoseort, Zeiträume und Wetterwerte",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ],
  "comparison": {
    "heading": "Welche Wetteransicht beantwortet Ihre Frage?",
    "columns": [
      "Ihre Frage",
      "Was Sie prüfen sollten",
      "Was damit nicht belegt ist"
    ],
    "rows": [
      {
        "cells": [
          "Was steht heute an?",
          "Kalenderansicht für Tag oder Woche neben dem Wetter des ausgewählten Ortes.",
          "Dass jede Ereignisadresse den Wetterort automatisch ändert."
        ]
      },
      {
        "cells": [
          "Könnte Regen meinen Termin am Nachmittag beeinflussen?",
          "Stündliche Daten für den Veranstaltungsort und den gesamten Zeitraum des Termins.",
          "Dass ein Tagessymbol jede Stunde beschreibt."
        ]
      },
      {
        "cells": [
          "Kann ich den nächsten Monat nach dem Wetter planen?",
          "Ihren Kalender jetzt, dann eine erneute Prognoseprüfung näher am Datum.",
          "Dass die Navigation im Kalender die Prognoseabdeckung erweitert."
        ]
      },
      {
        "cells": [
          "Kann ich zu Hause einen schnellen Überblick sehen?",
          "Das passende Home Screen-Widget.",
          "Dass jedes Widget-Layout Termine oder eine vollständige Prognose enthält."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-right",
    "hook"
  ],
  "galleryCaption": "Echte Cloud Calendars-Bildschirme: die Wetteransicht und ein Tag mit Terminen. Prüfen Sie in der App den ausgewählten Ort und das Datum.",
  "actionHeading": "Planen Sie mit Zeitplan und Prognose zusammen",
  "actionText": "Cloud Calendars ist für iPhone und iPad verfügbar. Starten Sie mit den Ansichten, dem Wetter und der Google Calendar-Synchronisierung, die in Base enthalten sind; Advanced entfernt Werbung, während Premium Unterstützung für Microsoft Calendar und Teams hinzufügt.",
  "articleLinks": [
    {
      "slug": "forecast-beside-every-event",
      "label": "Wetter für die Stunden eines Termins prüfen"
    },
    {
      "slug": "the-widget-that-shows-what-is-next",
      "label": "Ein Kalender- und Wetter-Widget auswählen"
    },
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "Kalenderkonten in einer Ansicht zusammenführen"
    }
  ]
},

  'forecast-beside-every-event': {
  "title": "Das stündliche Wetter für ein Kalenderereignis auf iPhone und iPad prüfen",
  "short": "Wetter für die Terminzeiten",
  "description": "Gleichen Sie Ort, Datum und Stunden Ihres Ereignisses mit der verfügbaren Wetterprognose ab.",
  "lede": "Um das Wetter für ein Kalenderereignis zu prüfen, müssen drei Dinge zusammenpassen: der Veranstaltungsort, sein lokales Datum und der Zeitraum vom Beginn bis zum Ende des Termins. Wählen Sie in Cloud Calendars den Wetterort und prüfen Sie die verfügbaren Stunden. Die Adresse eines Ereignisses und ein nahe angezeigtes Wettersymbol sind für sich genommen kein Beweis dafür, dass beides übereinstimmt. Arte Soft, der Entwickler, veröffentlicht diesen Leitfaden.",
  "commonBelief": "Dass ein tägliches Wettersymbol im Kalender dieselbe Funktion ist wie eine an ein Ereignis angehängte Vorhersage.",
  "sections": [
    {
      "heading": "Mit Ort und Datum beginnen",
      "body": [
        "Öffnen Sie die Vorhersage für den gewünschten Ort und vergleichen Sie deren Datum mit dem Kalendereintrag. Das Kalenderwetter kann den ausgewählten Wetterort widerspiegeln. Prüfen Sie daher, ob er für das Ereignis passend ist, statt anzunehmen, dass die Ereignisadresse maßgeblich ist.",
        "Ein Ereignis im nächsten Monat kann bereits existieren, bevor Wetterdaten für dieses Datum verfügbar sind. Lassen Sie das Ereignis bestehen und prüfen Sie die Vorhersage näher am Termin erneut; ein fehlender Wettereintrag ist keine Prognose für klares Wetter."
      ]
    },
    {
      "heading": "Für stundenbezogene Fragen die Stundenansicht nutzen",
      "body": [
        "Eine Tagesübersicht und eine stündliche Vorhersage beantworten unterschiedliche Fragen. Wenn das Ereignis von zwei bis fünf dauert, prüfen Sie die verfügbaren Stunden für diesen Zeitraum, statt ein einzelnes Tagessymbol als vollständiges Bild zu betrachten.",
        "Wenn nur ein Teil des Zeitraums verfügbar ist, lassen Sie den Rest offen. Die App verspricht nicht für jedes Ereignis, das Sie erstellen können, vollständige stündliche Wetterdaten, und auch dieser Leitfaden verspricht nicht, dass beim Öffnen eines beliebigen Ereignisses immer das gesamte Wetterfenster angezeigt wird."
      ]
    },
    {
      "heading": "Wahrscheinlichkeit, Menge und Zeitpunkt getrennt betrachten",
      "body": [
        "Achten Sie auf die Bezeichnung des Werts, den Sie prüfen. Eine Niederschlagswahrscheinlichkeit ist nicht dasselbe wie Niederschlagsmenge oder -dauer. Ebenso beziehen sich ein Stundenwert und eine Tagesübersicht auf unterschiedliche Zeiträume; vergleichen Sie bei zwei möglichen Uhrzeiten jeweils dieselben Zeiträume.",
        "Wählen Sie eine zu Ihrem Plan passende Ausweichlösung, statt einen einzelnen Prozentwert als allgemeine Regel für durchführen oder absagen zu behandeln. Wetterinformationen können sich ändern, daher sollten Sie sie erneut prüfen, wenn eine Entscheidung ansteht."
      ]
    },
    {
      "heading": "Vor dem Speichern eines wetterbasierten Ereignisses prüfen",
      "body": [
        "Die App kann aus einer Vorhersagestunde einen Ereignisentwurf starten. Prüfen Sie vor dem Speichern Datum, Beginn, Ende und Zielkalender des Entwurfs. Die Auswahl aus der Vorhersage ersetzt nicht die Kontrolle, ob Sie das richtige Ereignis erstellen.",
        "Wenn der Zugriff auf den Kalender oder der Zielkalender das Speichern verhindert, klären Sie diese Berechtigung getrennt vom Wetterzugriff. Das Finden einer Vorhersage verleiht keine Bearbeitungsrechte für einen geteilten Kalender."
      ]
    },
    {
      "heading": "Die vollständige Vorhersage nutzen, wenn die Zusammenfassung nicht ausreicht",
      "body": [
        "Prüfen Sie bei einer Aktivität im Freien die für diese Aktivität relevanten Variablen und den tatsächlich ausgewählten Ort. Ein Widget mit aktuellem Wetter oder eine Demo auf der Startseite ersetzt nicht die Prüfung der in der App verfügbaren Vorhersagestunden.",
        "Wenn Ihnen eine Abweichung auffällt, vergleichen Sie zuerst Ort und Zeitstempel. Unterschiedliche Anbieter, ausgewählte Orte und Vorhersagezeiträume können zu unterschiedlichen Anzeigen führen, ohne zu belegen, dass sich das Kalenderereignis geändert hat."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Ort und Ereignisdatum bestätigen.",
    "Die verfügbaren Stunden für die gesamte Aktivität prüfen.",
    "Wahrscheinlichkeit und Menge als unterschiedliche Werte lesen.",
    "Den Ereignisentwurf vor dem Speichern prüfen."
  ],
  "seeAlso": [
    "weather-inside-your-calendar",
    "planning-outdoors-without-being-rained-on"
  ],
  "updated": "2026-10-23",
  "faq": [
    {
      "q": "Hat jedes Ereignis eine vollständige Vorhersage?",
      "a": "Nein. Die Abdeckung hängt vom ausgewählten Ort sowie von den verfügbaren Daten und Stunden ab."
    },
    {
      "q": "Bezieht sich das Wettersymbol speziell auf die Ereignisadresse?",
      "a": "Leiten Sie das nicht aus der Nähe zum Ereignis ab. Prüfen Sie den Wetterort separat."
    },
    {
      "q": "Wird durch Tippen auf eine Stunde ein neues Ereignis gespeichert?",
      "a": "Sofern verfügbar, wird ein Ereignisentwurf gestartet. Prüfen Sie vor dem Speichern Datum, Uhrzeit und Kalender."
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
  ],
  "comparison": {
    "heading": "Eine praktische Prüfung vor einem Termin im Freien",
    "columns": [
      "Prüfung",
      "Beispiel",
      "Entscheidung"
    ],
    "rows": [
      {
        "cells": [
          "Ort",
          "Der Termin findet in einer anderen Stadt statt.",
          "Wählen Sie dieses Ziel in der Wetteransicht aus und lesen Sie seinen Namen."
        ]
      },
      {
        "cells": [
          "Zeitraum",
          "Die Aktivität dauert von 14:00 bis 16:00 Uhr.",
          "Prüfen Sie beide Stunden sowie relevante Vorbereitungs- oder Reisezeit."
        ]
      },
      {
        "cells": [
          "Abdeckung",
          "Nur einige der benötigten Stunden sind verfügbar.",
          "Halten Sie den Plan vorläufig und planen Sie eine weitere Prüfung ein."
        ]
      },
      {
        "cells": [
          "Gespeichertes Ereignis",
          "Sie starten einen Entwurf aus einer Wetterstunde.",
          "Prüfen Sie vor dem Speichern Datum, Zeitzone, Dauer und Zielkalender."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-right",
    "week-left"
  ],
  "galleryCaption": "Die Wetter- und Wochenansicht zeigen unterschiedliche Teile derselben Planungsaufgabe. Bestätigen Sie den Prognoseort getrennt vom Ort des Ereignisses.",
  "actionHeading": "Prüfen Sie die Prognose anhand Ihrer tatsächlichen Termine",
  "actionText": "Nutzen Sie Cloud Calendars auf dem iPhone oder iPad, um die verfügbare Prognose und Ihren Zeitplan zu prüfen. Das Wetter unterstützt Ihre Entscheidung; es verschiebt ein Ereignis nicht automatisch und bestätigt auch keine Änderung mit Teilnehmenden.",
  "articleLinks": [
    {
      "slug": "weather-inside-your-calendar",
      "label": "Die Kalender- und Wetteransichten verstehen"
    },
    {
      "slug": "the-widget-that-shows-what-is-next",
      "label": "Einen schnellen Überblick für den Home Screen auswählen"
    },
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "Die Kalender hinter Ihrem Zeitplan prüfen"
    }
  ]
},

  'planning-outdoors-without-being-rained-on': {
  "updated": "2026-10-22",
  "title": "Eine Veranstaltung im Freien mit Vorhersage und Alternative planen",
  "short": "Einen Plan im Freien und eine machbare Alternative wählen",
  "description": "Plane im Freien mit geprüftem Ort, Vorhersagestunden und vereinbarter Alternative. Prüfe Kalenderdetails, bevor du einen gemeinsamen Termin änderst.",
  "lede": "Wetter kann beim Vergleich möglicher Zeiten für Aktivitäten im Freien helfen, aber keinen trockenen Ausgang versprechen. Beginne mit den Anforderungen der Aktivität und den noch veränderbaren Entscheidungen. Nutze dann die passende Vorhersage als Grundlage. Dieser Leitfaden stammt von Arte Soft, dem Entwickler von Cloud Calendars.",
  "commonBelief": "Häufigeres Prüfen oder geringfügiges Verschieben garantiert, dass eine Aktivität schlechtes Wetter vermeidet.",
  "sections": [
    {
      "heading": "Die Aktivität definieren, bevor du eine Wetterzahl auswählst",
      "body": [
        "Bestimme Ort, beteiligte Personen und Anforderungen der Aktivität. Ein Mittagessen im Garten, eine Schulsportstunde und eine gebuchte Freiluftaufführung haben unterschiedliche praktische Einschränkungen. Verwende nicht für alle denselben allgemeinen Regenprozentsatz.",
        "Halte fest, wer eine Änderung entscheiden darf und wann die letzte sinnvolle Entscheidung möglich ist. Die Frist eines Veranstaltungsorts oder die Verfügbarkeit einer Hilfsperson kann deine Optionen früher einschränken als das Wetter. Diese Planungsbeispiele liefern keine technischen Sicherheitsgrenzwerte für Aktivitäten."
      ]
    },
    {
      "heading": "Ort, lokales Datum und vollständigen Zeitraum abgleichen",
      "body": [
        "Vergleiche den ausgewählten Wetterort mit dem tatsächlichen Veranstaltungsort. Beziehe gegebenenfalls Ankunft und Vorbereitung ein und prüfe die verfügbaren Stunden über die gesamte Aktivität. Ein Tagessymbol beschreibt nicht jeden Moment einer langen Buchung.",
        "Liegt der Termin jenseits der Vorhersagedaten, behalte das vereinbarte Datum und plane eine spätere Prüfung. Vergleiche auf Reisen die Ortszeit des Veranstaltungsorts mit dem Termin. Ersetze die Buchungsgrundlage nicht unbemerkt durch eine Vorhersage für deinen aktuellen Standort."
      ]
    },
    {
      "heading": "Echte Alternativen vergleichen, ohne trockene Zeitfenster zu erfinden",
      "body": [
        "Vergleiche mögliche Zeiträume anhand der relevanten Wetterfelder und ihrer Bezeichnungen. Der Vorhersageleitfaden des Met Office unterscheidet Wahrscheinlichkeit von anderen Werten und erklärt unterschiedliche Bezugszeiträume. Lies die entsprechenden Definitionen deiner verwendeten Quelle.",
        "Eine Stunde später loszugehen kann die Bedingungen verbessern oder auch nicht. Behandle einen geeigneter wirkenden Zeitraum als Planungsinformation, nicht als Garantie. Leite aus einem Wert für einen Ort weder eine nicht abgedeckte Stunde noch Beobachtungen entlang einer ganzen Strecke ab."
      ]
    },
    {
      "heading": "Eine tatsächlich nutzbare Alternative vereinbaren",
      "body": [
        "Eine Alternative sollte das reale Problem lösen: ein nutzbarer, freigegebener Innenraum, eine vereinbarte Verschiebung oder eine andere für Teilnehmer erreichbare Lösung. Prüfe Zugang, Kosten und Verfügbarkeit beim zuständigen Organisator oder Veranstaltungsort.",
        "Ein Picknick nach drinnen zu verlegen kann beispielsweise scheitern, wenn niemand den Raum bestätigt hat. Halte die Alternative klar fest und bestimme, wer die endgültige Wahl mitteilt. Eine Notiz im privaten Kalender einer Person ist keine gemeinsame Vereinbarung."
      ]
    },
    {
      "heading": "Den vorgesehenen Termin speichern und ändern",
      "body": [
        "Bestätige vor Erstellen oder Bearbeiten Zielkalender, Beginn, Ende und Ort. Auch ein aus einer Wetterstunde gestarteter Entwurf muss geprüft werden. Seine vorgeschlagene Dauer deckt Aufbau, Fahrt oder die gesamte Aktivität möglicherweise nicht ab.",
        "Prüfe bei gemeinsamen oder wiederkehrenden Terminen Zuständigkeit des Organisators, Bearbeitungsrechte und Wiederholungsumfang. Öffne nach einer erlaubten Änderung den gespeicherten Termin erneut. Eine lokale Änderung beweist nicht die Zustimmung des Veranstaltungsorts oder aller Teilnehmer."
      ]
    },
    {
      "heading": "Erneut prüfen, solange eine Entscheidung noch etwas bewirken kann",
      "body": [
        "Wähle einen Prüfzeitpunkt, der unter den Buchungsbedingungen noch Handlungsspielraum lässt. Vergleiche die aktuelle relevante Vorhersage sowie geltende offizielle Hinweise oder Vorgaben des Veranstaltungsorts. Wetterinformationen sind eine Entscheidungsgrundlage, keine Erlaubnis, Anforderungen einer Aktivität zu ignorieren.",
        "Teile den endgültigen Plan mit und bestätige wichtige Übergaben direkt. Ändert eine spätere Aktualisierung die Entscheidung, bestimme den zu ändernden Termin und die Wiederholung. Wiederholtes Aktualisieren ohne machbare Alternative beseitigt die Unsicherheit nicht."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Ort, Anforderungen und entscheidungsverantwortliche Person bestimmen.",
    "Den ausgewählten Wetterort und den gesamten Zeitraum in Ortszeit prüfen.",
    "Nur tatsächlich verfügbare Vorhersagedaten und Stunden vergleichen.",
    "Eine machbare Alternative und Entscheidungsfrist vereinbaren.",
    "Zielkalender, Termindetails und Wiederholungsumfang vor dem Speichern prüfen.",
    "Zum vereinbarten Zeitpunkt erneut prüfen und den endgültigen Plan mit Teilnehmern bestätigen."
  ],
  "faq": [
    {
      "q": "Garantiert eine Verschiebung um eine Stunde trockenes Wetter?",
      "a": "Nein. Vergleiche verfügbare Zeiträume und halte eine zur Aktivität passende Alternative bereit. Eine Vorhersage verspricht kein bestimmtes Ergebnis."
    },
    {
      "q": "Was, wenn die Vorhersage noch nicht bis zum Termin reicht?",
      "a": "Behalte den vereinbarten Termin und plane eine spätere Wetterprüfung. Fehlende Informationen sind keine Schönwettervorhersage."
    },
    {
      "q": "Darf ich einen gemeinsamen Termin verschieben, wenn eine andere Zeit besser aussieht?",
      "a": "Bestätige zuerst Zustimmung des Organisators, Bearbeitungsrechte und Teilnehmer. Prüfe Wiederholungsumfang und gespeichertes Ergebnis und teile dann die Änderung mit."
    }
  ],
  "seeAlso": [
    "forecast-beside-every-event"
  ],
  "sourcesHeading": "Offizielle Quellen und weiterführende Informationen",
  "sources": [
    {
      "label": "Apple: WeatherKit-Vorhersagen und regionale Verfügbarkeit",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: Vorhersageort, Zeiträume und Wetterwerte",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ]
},

  'a-fourteen-day-view-of-the-weather': {
  "updated": "2026-10-22",
  "title": "Wie weit reicht die Wettervorhersage in Cloud Calendars?",
  "short": "Die tatsächlich verfügbaren Vorhersagedaten prüfen",
  "description": "Prüfe die verfügbaren Vorhersagedaten in Cloud Calendars. Unterscheide Tages- und Stundenwerte, zukünftige Termine und die Wetterdemo der Website.",
  "lede": "Ein weit vorausreichender Kalender und eine langfristige Wettervorhersage sind verschiedene Dinge. Du kannst eine Besprechung vereinbaren, bevor ihre Vorhersage vorliegt. Lies die verfügbaren Daten in der App, statt sie aus dem aufrufbaren Kalendermonat abzuleiten. Dieser Leitfaden stammt von Arte Soft, dem Entwickler von Cloud Calendars.",
  "commonBelief": "Jedes zukünftige Kalenderdatum hat eine Vorhersage, und die Vierzehntage-Demo der Website entspricht dem Vorhersagezeitraum der App.",
  "sections": [
    {
      "heading": "Die Daten in der Wetteranzeige lesen",
      "body": [
        "Öffne das Wetter für den vorgesehenen Ort und prüfe die tatsächlich aufgeführten Daten. Leite die Verfügbarkeit nicht aus der Monats- oder Jahresnavigation ab. Fehlende Vorhersagedaten bedeuten, dass eine spätere Prüfung nötig ist; sie bedeuten keinen klaren Tag.",
        "Wenn du ein Treffen mehrere Wochen im Voraus organisierst, speichere das vereinbarte Datum und halte die Wetterentscheidung gesondert fest. Verfügbarkeit des Veranstaltungsorts, Einladungen und eine spätere Vorhersage sind unterschiedliche Grundlagen dieses Plans."
      ]
    },
    {
      "heading": "Die Tagesliste der App verstehen",
      "body": [
        "Die App verwendet Apple WeatherKit. Ihre aktuelle Tagesliste übernimmt bis zu zehn vom Dienst zurückgegebene Tage. Lies für den gewählten Ort das tatsächliche erste und letzte Datum, statt bei jeder Ansicht oder Anfrage volle zehn Tage vorauszusetzen.",
        "Diese Grenze beschreibt die angezeigte Tagesliste. Sie verspricht weder gleiche Verlässlichkeit aller Wetterwerte noch eine vollständige Vorhersage für jeden Termin innerhalb dieser Daten. Nutze die Detailtiefe, die deine Entscheidung erfordert."
      ]
    },
    {
      "heading": "Stundenwerte für zeitlich festgelegte Aktivitäten prüfen",
      "body": [
        "Eine Tagesübersicht belegt nicht die genauen Bedingungen während des gesamten Termins. Öffne den betreffenden Tag und vergleiche die verfügbaren Stunden für Ankunft, Aktivität und Abreise. Fehlt ein Teil des Zeitraums, behandle ihn als ungeklärt.",
        "Prüfe bei einer Abendveranstaltung, ob gewählter Ort und lokales Datum noch zum Plan passen. Eine späte Ankunft nach Mitternacht gehört zum nächsten Datum. Prüfe die tatsächlichen Zeitangaben, statt das Ende der Tagesliste mit dem Ende jeder Stundenreihe gleichzusetzen."
      ]
    },
    {
      "heading": "Die Website-Demonstration unterscheiden",
      "body": [
        "Die aktuelle Website fordert für ihre Wetterdemonstration vierzehn Vorhersagetage von Open-Meteo an. Open-Meteo beschreibt konfigurierbare Zeiträume; diese Website-Anfrage ist eine getrennte Umsetzung von der iOS-App.",
        "Leite aus dem Webergebnis nicht ab, dass die App vierzehn WeatherKit-Tage liefert. Unterscheiden sich die Anzeigen, vergleiche zuerst Ort, Zeit und Anbieter. Ein anderer Vorhersagezeitraum bedeutet nicht, dass der Kalender einen Termin verloren hat."
      ]
    },
    {
      "heading": "Eine spätere Prüfung einplanen, wenn die Vorhersage noch fehlt",
      "body": [
        "Behalte das echte Datum der Buchung und plane eine Prüfung mit genügend Zeit für eine Ortsentscheidung oder Nachricht an die Teilnehmer. Eine Feier im Freien kann beispielsweise eine vereinbarte Innenraumalternative brauchen, bevor das Wetter erneut geprüft wird.",
        "Richte die Prüfung nach den tatsächlichen Einschränkungen der Aktivität aus. Dieser Leitfaden ordnet keinem nummerierten Vorhersagetag einen Genauigkeitsprozentsatz oder eine allgemeine Durchführungs- oder Absagegrenze zu. Prüfe aktuelle Informationen, wenn sie eine noch umsetzbare Entscheidung beeinflussen können."
      ]
    },
    {
      "heading": "Nach der Zeitwahl die Termindetails prüfen",
      "body": [
        "Wenn eine verfügbare Vorhersagestunde bei der Zeitwahl hilft, prüfe den daraus entstehenden Terminentwurf. Bestätige lokales Datum, Beginn, Ende, Zielkalender und Ort. Die Navigation durch Vorhersagen ersetzt weder Kalenderberechtigungen noch die Zustimmung des Organisators.",
        "Öffne nach einer erlaubten Änderung den Termin erneut und prüfe die gewünschte Wiederholung oder Serie. Bestätige wichtige Änderungen gesondert mit den Teilnehmern. Verfügbare Wetterdaten sind nicht gleichbedeutend mit dem Empfang einer geänderten Einladung."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Den für den Termin relevanten Ort wählen.",
    "Das erste und letzte Datum der Tagesliste in der App lesen.",
    "Den benötigten Stundenzeitraum einschließlich Mitternachtsgrenzen getrennt prüfen.",
    "Open-Meteo-Abdeckung der Website von WeatherKit-Abdeckung der App unterscheiden.",
    "Für Pläne jenseits der Vorhersage eine spätere Prüfung vereinbaren.",
    "Den gespeicherten Termin prüfen und gemeinsame Änderungen mit Teilnehmern bestätigen."
  ],
  "faq": [
    {
      "q": "Bietet Cloud Calendars in der App eine Vierzehntage-Vorhersage?",
      "a": "Die aktuelle Tagesliste der App nutzt bis zu zehn zurückgegebene WeatherKit-Tage. Die Website fordert getrennt vierzehn Open-Meteo-Tage an. Prüfe die tatsächlich in der App verfügbaren Daten."
    },
    {
      "q": "Warum kann ich einen Termin nach dem letzten Wetterdatum erstellen?",
      "a": "Kalenderspeicherung und Wetterverfügbarkeit sind getrennt. Behalte den Termin und prüfe die Vorhersage näher am Datum."
    },
    {
      "q": "Garantiert ein Tageseintrag Wetter für jede Stunde meines Termins?",
      "a": "Nein. Prüfe die tatsächlich gelieferten Stunden für Ort und Zeitraum. Leite aus der Tagesliste keine vollständige Stundenabdeckung ab."
    }
  ],
  "seeAlso": [
    "weather-inside-your-calendar",
    "forecast-beside-every-event",
    "planning-outdoors-without-being-rained-on"
  ],
  "sourcesHeading": "Offizielle Quellen und weiterführende Informationen",
  "sources": [
    {
      "label": "Apple: WeatherKit-Vorhersagen und regionale Verfügbarkeit",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Open-Meteo: Vorhersageparameter und verfügbare Zeiträume",
      "url": "https://open-meteo.com/en/docs"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
  "updated": "2026-10-23",
  "title": "Google-, iCloud- und Outlook-Kalender gemeinsam auf iPhone und iPad sehen",
  "short": "Drei Anbieter, eine Ansicht",
  "description": "Kalenderansichten kombinieren und Accounts, Berechtigungen, Kopien und Tarifanforderungen richtig einordnen.",
  "lede": "Um berufliche und private Termine gemeinsam zu sehen, verbinden Sie die gewünschten Accounts, wählen deren Kalender aus und prüfen dieselben Ereignisse in einer Ansicht. Cloud Calendars unterstützt die Planung auf iPhone und iPad mit iCloud und Google Calendar; Unterstützung für Microsoft Calendar ist in Premium enthalten. Termine gemeinsam anzuzeigen ist etwas anderes, als Belegtzeiten zwischen Anbieter-Accounts zu kopieren. Arte Soft, der Entwickler, veröffentlicht diesen Leitfaden.",
  "commonBelief": "Wenn mehrere Kalender in einer App angezeigt werden, bleiben ihre Verfügbarkeit, Freigaben und Ereigniskopien automatisch aufeinander abgestimmt.",
  "sections": [
    {
      "heading": "Den Account und Kalender hinter jedem Ereignis bestimmen",
      "body": [
        "Beginnen Sie mit je einem gewöhnlichen Ereignis pro Anbieter. Notieren Sie die angemeldete E-Mail-Adresse, den Kalendernamen und ob das Ereignis Ihnen gehört oder ob Sie eine Einladung erhalten haben. Zwei Kalender mit dem Namen „Calendar“ können zu völlig unterschiedlichen Accounts gehören. Eine Farbe hilft beim Überblick über eine Woche; Account und Kalender zeigen, wohin eine Änderung gehört.",
        "Ein Zahnarzttermin in Ihrem persönlichen iCloud-Kalender und ein Projektmeeting in Microsoft können zum Beispiel für Sie zusammen erscheinen. Das macht den Zahnarzttermin für Ihre Kollegen nicht automatisch sichtbar und blockiert diese Zeit auch nicht in deren Planungstools.",
        "Legen Sie das Ziel fest, bevor Sie eine Verbindung ändern. Wenn Sie Ereignisdaten in einen anderen Account übertragen möchten, nutzen Sie unten „Ein Kalender-Exportformat wählen“, um einen unterstützten Übertragungsweg zu finden, und prüfen Sie repräsentative Ereignisse, bevor Sie sich auf das Ziel verlassen. Wenn Sie Zeiten vergleichen möchten, behalten Sie die bestehenden Kalenderinhaber bei und zeigen ausgewählte Quellen gemeinsam an. Wenn ein anderer Account Belegtzeit erhalten soll, erklärt „Cloud Calendars and OneCal nach Arbeitsablauf“, wie sich das Kopieren von Verfügbarkeit von einer persönlichen Übersicht unterscheidet."
      ]
    },
    {
      "heading": "Über den passenden Weg verbinden",
      "body": [
        "Aktivieren Sie für iCloud zuerst iCloud Calendar auf dem iPhone unter dem gewünschten Apple Account. Apples Einrichtungsanleitung erklärt die Geräteeinstellungen. Cloud Calendars greift auf Kalender zu, die über das Kalendersystem des iPhone verfügbar sind, und benötigt Kalenderzugriff, um sie zu lesen. Ein Account, der nur auf einem anderen Gerät verbunden ist, reicht nicht aus.",
        "Cloud Calendars bietet auch die Aktionen „Sign in with Google“ und „Sign in with Microsoft“. Prüfen Sie, welchen Account Sie bei der Anmeldung auswählen, öffnen Sie dann die zugehörige Kalendergruppe und wählen Sie die benötigten Kalender aus. Wenn Sie sich beim richtigen Anbieter mit der falschen privaten oder beruflichen Identität anmelden, kann eine völlig gültige, aber unerwartete Kalenderliste entstehen."
      ]
    },
    {
      "heading": "Tarife verstehen, ohne sie mit Berechtigungen zu verwechseln",
      "body": [
        "Der Base-Tarif umfasst die Synchronisierung mit Google Calendar und die Kalenderansichten. Advanced ergänzt Base um die Entfernung von Werbung. Premium ergänzt Microsoft Calendar und Microsoft Teams-Funktionen. Prüfen Sie vor dem Kauf den aktuellen lokalen Preis und den Abrechnungszeitraum.",
        "Ein Tarif ändert, welche App-Funktionen verfügbar sind; er verleiht Ihnen nicht den Besitz am Kalender anderer Personen. Google unterscheidet zwischen der Berechtigung, Ereignisse zu sehen, und der Berechtigung, sie zu ändern. Richtlinien Ihres Arbeitgebers und die Berechtigungen eines Microsoft-Kalenders gelten weiterhin. Ein sichtbares Ereignis oder ein verfügbarer Editor ist kein Beleg dafür, dass der Anbieter eine Aktualisierung akzeptiert."
      ]
    },
    {
      "heading": "Eine kombinierte Ansicht kann Kalenderkopien enthalten",
      "body": [
        "Google- und Microsoft-Verbindungen verwenden Kalenderkopien im Kalendersystem des iPhone, um Ereignisse darzustellen und zu synchronisieren. Gehen Sie nicht davon aus, dass beim Verbinden eines Accounts keine Kopie außerhalb des ursprünglichen Anbieters entsteht. Das Ziel für diese Kopien kann von den auf dem Gerät verfügbaren Kalenderquellen abhängen.",
        "Wenn derselbe Account das Telefon auch auf anderem Weg erreicht, prüfen Sie Kalendernamen und Quellen, bevor Sie doppelte Termine als getrennte Ereignisse behandeln. Blenden Sie vorübergehend einen Kalender aus, um festzustellen, welche Anzeige er liefert. Löschen Sie kein Ereignis und keinen Kalender nur, damit der Bildschirm aufgeräumter wirkt: Eine verbundene Kopie kann Änderungen an ihren Anbieter zurücksenden."
      ]
    },
    {
      "heading": "Beim Erstellen eines Ereignisses das Ziel weiter bewusst wählen",
      "body": [
        "Prüfen Sie vor dem Speichern den Kalender des Ereignisses genauso sorgfältig wie Datum und Uhrzeit. Für einen Familientermin wählen Sie den Kalender, den die Familie tatsächlich verwendet; für ein berufliches Meeting nutzen Sie das zulässige berufliche Ziel. Dass beide Kalender zusammen sichtbar sind, macht keinen von ihnen automatisch zum Ziel für jedes neue Ereignis.",
        "Das Ändern des Kalenders eines Ereignisses oder das Verschieben zwischen Kalendern kann ein tatsächlicher Umzug sein, nicht nur eine harmlose zweite Ansicht. Belassen Sie Einladungen und wiederkehrende Meetings während der Fehlersuche in ihrem bestehenden Kalender. Wenn Sie etwas ändern müssen, klären Sie zuerst, wem das Ereignis gehört und welcher Kalender es annehmen kann."
      ]
    },
    {
      "heading": "Die Übersicht prüfen, bevor Sie sich darauf verlassen",
      "body": [
        "Vergleichen Sie ein aktuelles Ereignis im eigenen Kalender des Anbieters mit dem entsprechenden Ereignis in Cloud Calendars. Prüfen Sie Datum, Zeitzone, Titel und den ausgewählten Kalender. Für einen bearbeitbaren Kalender, der Ihnen gehört, ist ein entbehrliches Ereignis ohne Gäste ein besserer Test, als ein laufendes Meeting zu ändern. Bestätigen Sie das Ergebnis beim Anbieter, bevor Sie die Verbindung als einsatzbereit ansehen.",
        "Verlassen Sie sich nicht darauf, dass die kombinierte Ansicht automatisch anonyme Belegt-Blöcke in einem anderen Account erstellt. Wenn Kollegen Sie als nicht verfügbar sehen sollen, ohne private Details zu sehen, verwenden Sie eine ausdrücklich genehmigte Verfügbarkeitsregelung und prüfen Sie sie von deren Seite aus. Eine klare persönliche Übersicht und gemeinsam genutzte Verfügbarkeit sind zwei unterschiedliche Aufgaben."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Listen Sie für je ein Ereignis pro Anbieter den genauen Account und Kalender auf.",
    "Aktivieren Sie die gewünschten iCloud-Kalender auf dem Gerät und prüfen Sie den Kalenderzugriff.",
    "Verwenden Sie die passende Google- oder Microsoft-Anmeldung und wählen Sie die gewünschten Kalender aus.",
    "Vergleichen Sie ein aktuelles Ereignis mit der Ansicht beim Anbieter, bevor Sie etwas ändern.",
    "Blenden Sie eine vermutete doppelte Quelle vorübergehend aus; lassen Sie die zugrunde liegenden Ereignisse unverändert.",
    "Prüfen Sie bei jedem neuen Ereignis den Zielkalender und verifizieren Sie benötigte Belegtzeit-Freigaben separat."
  ],
  "faq": [
    {
      "q": "Werden meine Arbeitskollegen meine privaten Ereignisse sehen, weil ich beide Kalender anzeige?",
      "a": "Kalender gemeinsam anzuzeigen ist weder eine Freigabeanweisung noch eine automatische Brücke für Belegtzeiten. Prüfen Sie die tatsächlichen Freigabeeinstellungen jedes Kalenders. Anbieter-Verbindungen können Kalenderkopien auf dem Gerät erzeugen, daher ist eine kombinierte Ansicht auch keine Garantie dafür, dass Ereignisdaten nur beim ursprünglichen Anbieter existieren."
    },
    {
      "q": "Warum kann ich ein Ereignis sehen, es aber nicht erfolgreich bearbeiten?",
      "a": "Der Kalender ist möglicherweise schreibgeschützt, das Ereignis gehört eventuell einem anderen Organisator oder der Anbieter lehnt die Aktualisierung ab. Prüfen Sie Eigentümerschaft und Berechtigungen im Kalender des Anbieters. Der Kauf eines höheren App-Plans ändert diese Berechtigungen nicht."
    },
    {
      "q": "Sollte ich dasselbe Google-Konto über jeden verfügbaren Weg verbinden?",
      "a": "Prüfen Sie zuerst, wie es bereits auf dem Telefon erscheint. Mehrere Wege können es erschweren, Kalenderkopien zu erkennen. Wählen Sie den Weg, den Sie verwenden möchten, prüfen Sie dessen Ereignisse und blenden Sie während der Prüfung lieber eine zusätzliche Anzeige aus, statt Daten zu löschen oder Konten als ersten Schritt zu trennen."
    }
  ],
  "sourcesHeading": "Quellen und Einrichtungsreferenzen",
  "sources": [
    {
      "label": "Apple: iCloud Calendar auf Ihren Geräten einrichten",
      "url": "https://support.apple.com/guide/icloud/set-up-calendar-mme4d73a8727/icloud"
    },
    {
      "label": "Google: Kalenderfreigabe und Berechtigungen",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: Outlook-Kalender-API und unterstützte Postfachdaten",
      "url": "https://learn.microsoft.com/en-us/graph/outlook-calendar-concept-overview"
    }
  ],
  "seeAlso": [
    "exchange-calendars-on-an-iphone",
    "what-calendar-sync-actually-does",
    "when-two-calendars-disagree",
    "caldav-calendar-on-iphone",
    "calendar-export-ics-pdf-and-backup",
    "onecal-alternative-iphone-calendar-view-or-sync"
  ],
  "comparison": {
    "heading": "Kombinierte Ansicht, Abonnement oder kopierte Belegtzeit?",
    "columns": [
      "Was Sie benötigen",
      "Was Sie prüfen sollten",
      "Was Sie nicht annehmen sollten"
    ],
    "rows": [
      {
        "cells": [
          "Eine Ansicht für mehrere Konten",
          "Das verbundene Konto, den ausgewählten Kalender und den erforderlichen Plan.",
          "Dass eine gemeinsame Anzeige Eigentümerschaft oder Berechtigungen zusammenführt."
        ]
      },
      {
        "cells": [
          "Eine Ereignisbearbeitung, die den Anbieter erreicht",
          "Das ursprüngliche Ereignis, Schreibberechtigung und das gespeicherte Ergebnis an der Quelle.",
          "Dass eine sichtbare lokale Bearbeitung einen erfolgreichen Abgleich mit dem Anbieter belegt."
        ]
      },
      {
        "cells": [
          "Belegtzeit in einem anderen Konto",
          "Einen Dienst mit ausdrücklich dokumentierten Regeln für die Synchronisierung von Quelle zu Ziel.",
          "Dass eine kombinierte Ansicht Verfügbarkeitsblöcke für Kollegen erstellt."
        ]
      },
      {
        "cells": [
          "Ein abonnierter Kalender-Feed",
          "Den Herausgeber, das Aktualisierungsverhalten und den schreibgeschützten Status.",
          "Dass ein ICS-Abonnement eine bearbeitbare Zwei-Wege-Verbindung ist."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-left",
    "hook"
  ],
  "galleryDevice": "iPad",
  "galleryCaption": "Echte Kalenderansichten auf dem iPad veranschaulichen die Prüfung eines Terminplans. Ein Screenshot zeigt weder die Richtung der Anbietersynchronisierung noch Kontoberechtigungen.",
  "actionHeading": "Prüfen Sie Ihre Kalender gemeinsam auf iPhone und iPad",
  "actionText": "Die Synchronisierung mit Google Calendar ist in Base enthalten. Advanced entfernt Werbung; Premium ergänzt Microsoft Calendar- und Teams-Unterstützung. Prüfen Sie die Berechtigungen des Kontos unabhängig vom gekauften Plan.",
  "articleLinks": [
    {
      "slug": "onecal-alternative-iphone-calendar-view-or-sync",
      "label": "Eine kombinierte Ansicht mit den Synchronisierungsregeln von OneCal vergleichen"
    },
    {
      "slug": "fantastical-readdle-calendar366-iphone-comparison",
      "label": "Kalender-Workflows auf dem iPhone vergleichen"
    },
    {
      "slug": "weather-inside-your-calendar",
      "label": "Mit Wetter und Terminen zusammen planen"
    }
  ]
},

  'sharing-one-event-not-your-calendar': {
  "updated": "2026-10-21",
  "title": "Ein Kalenderereignis teilen: Link und Zugriffsrechte bewusst wählen",
  "short": "Ein Ereignis teilen",
  "description": "Teilen Sie einen Termin statt des ganzen Kalenders. Verstehen Sie Reader, Writer und Owner, Vorschauen, Aktualisierungen und die Grenzen eines Widerrufs.",
  "lede": "Details zum Abendessen senden, Mitorganisatoren Änderungen erlauben und Zusagen sammeln sind unterschiedliche Aufgaben. Wählen Sie zuerst Ihr Ziel und dann den Freigabeweg. Dieser Leitfaden stammt von Arte Soft, dem Entwickler von Cloud Calendars.",
  "commonBelief": "Jeder Ereignislink ist ein schreibgeschütztes Kalenderabonnement, das sofort aktualisiert wird und eine Antwort erfasst.",
  "sections": [
    {
      "heading": "Prüfen Sie zuerst das einzelne Ereignis",
      "body": [
        "Eine Freigabe für ein einzelnes Ereignis umfasst dieses Ereignis und nicht den gesamten Kalender. Prüfen Sie Titel, Zeitzone, Ort, Notizen und Besprechungslinks. Angaben für einen Gast eignen sich nicht unbedingt für einen weit verbreiteten Link.",
        "Für ein Abendessen müssen Sie nicht den Kalender mit Ihren Arztterminen freigeben. Ort und Links des Abendessens werden aber mitgeteilt. Prüfen Sie deshalb den Inhalt selbst."
      ]
    },
    {
      "heading": "Wählen Sie Vorschau, E-Mail oder QR-Code",
      "body": [
        "Der App Clip von Cloud Calendars zeigt eine Vorschau. Zum Hinzufügen über diesen Weg wird die vollständige App benötigt. E-Mail- und QR-Einladungen öffnen eine Webseite mit einer Option zum Öffnen von Cloud Calendars. Diese Links sind keine austauschbaren Abonnementadressen.",
        "Für die synchronisierte Freigabe meldet sich der Absender an. Links und QR-Codes lassen sich weiterleiten. Ein QR-Code übermittelt einen Link, beweist aber nicht, wer ihn geöffnet hat."
      ]
    },
    {
      "heading": "Vergeben Sie nur die nötigen Rechte",
      "body": [
        "Bei E-Mail-Einladungen wählen Sie Reader, Writer oder Owner. Reader darf ansehen und synchronisieren, Writer darf bearbeiten, Owner zusätzlich teilen und Zugriffe verwalten. Für jemanden, der nur den Zeitplan benötigt, reicht Reader.",
        "Writer passt zu einem Mitorganisator, der das Ereignis ändern soll. Owner ist für Personen gedacht, die auch fremde Zugriffe verwalten sollen. Höhere Rechte erfordern die passende angemeldete Identität. Ein anonymer Empfänger ist kein identifizierter Mitinhaber."
      ]
    },
    {
      "heading": "Klären Sie, wie das Ereignis hinzugefügt wird",
      "body": [
        "Die vollständige App benötigt Kalenderzugriff und einen beschreibbaren Zielkalender. Der Empfänger sollte das Ziel vor dem Speichern prüfen. Die empfangene Kopie kann für spätere Änderungen mit dem geteilten Ereignis verknüpft werden.",
        "Ein gewöhnlicher ICS-Import in einen anderen Kalender ist etwas anderes: Er erstellt eine Kopie, während ein Abonnement regelmäßig einen Feed abruft. Wenn Sie einen ICS-Feed senden, erklären Sie diesen Weg und prüfen Sie, ob der Kalender des Empfängers ihn unterstützt."
      ]
    },
    {
      "heading": "Verlassen Sie sich erst nach Prüfung auf Änderungen",
      "body": [
        "Eine synchronisierte Freigabe kann Änderungen und Absagen übermitteln, aber das Gerät muss sie empfangen können. Ein Aktualisierungshinweis für einen Feed ist keine Zustellfrist. Offlinegeräte, noch nicht aktualisierte Abonnements und unabhängige importierte Kopien können alte Angaben zeigen.",
        "Verschiebt sich das Abendessen kurzfristig, aktualisieren Sie das Ereignis und kontaktieren Sie die Gäste direkt. Lassen Sie die neue Uhrzeit bestätigen. Eine Aktualisierung zu erhalten ist keine Zusage zur Teilnahme."
      ]
    },
    {
      "heading": "Zugriff ändern heißt nicht alle Kopien löschen",
      "body": [
        "Prüfen Sie Empfängerrechte und entfernen Sie nicht mehr benötigte Berechtigungen. Einen Empfänger zu entfernen und einen Feed-Link zu widerrufen sind getrennte Schritte. Keiner davon löscht zuverlässig alle Screenshots, Nachrichten oder Kalenderkopien aus der Ferne.",
        "Wurde ein Link weiterverbreitet, bestimmen Sie den betroffenen Link oder Zugriff und prüfen Sie das Ergebnis nach der Änderung. Lassen Sie private Angaben künftig aus breit verteilten Links heraus, statt auf einen späteren Widerruf zu vertrauen."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Prüfen Sie Details und entscheiden Sie, ob es um Ansicht, Bearbeitung oder Teilnahmeantworten geht.",
    "Wählen Sie den Freigabeweg und melden Sie sich bei Bedarf an.",
    "Vergeben Sie Reader zum Ansehen und Writer oder Owner nur für die passende Verantwortung.",
    "Bitten Sie den Empfänger, Uhrzeit und Zielkalender zu prüfen.",
    "Aktualisieren Sie dringende Änderungen und senden Sie zusätzlich eine direkte Nachricht.",
    "Prüfen Sie zum Abschluss Empfängerrechte und Linkzugriff getrennt."
  ],
  "faq": [
    {
      "q": "Wird mein gesamter Kalender sichtbar?",
      "a": "Die synchronisierte Einzelfreigabe ist auf das Ereignis begrenzt. Seine eigenen Details werden dennoch geteilt. Prüfen Sie sie und senden Sie keine Einladung zum gesamten Kalender, wenn nur ein Termin gemeint ist."
    },
    {
      "q": "Darf der Empfänger das Ereignis ändern?",
      "a": "Mit den passenden Writer- oder Owner-Rechten und dem unterstützten angemeldeten Ablauf ja. Reader dient zum Ansehen und Synchronisieren. Ein gewöhnliches ICS-Abonnement verwendet nicht diesen Bearbeitungsmechanismus."
    },
    {
      "q": "Macht das Entfernen alles bereits Empfangene rückgängig?",
      "a": "Das ist nicht garantiert. Der Zugriff auf die Freigabe ändert sich, gespeicherte Kopien, Screenshots und Nachrichten können aber bleiben. Eine geteilte Feed-Adresse ist gesondert zu prüfen."
    }
  ],
  "sourcesHeading": "Referenzen für Empfänger",
  "sources": [
    {
      "label": "Apple: Überblick über App Clips",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google: Ereignisse importieren und Einschränkungen",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft: Kalender importieren oder abonnieren",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "keeping-track-of-who-replied",
    "who-can-see-what-in-google-calendar"
  ]
},

  'three-calendar-apps-is-two-too-many': {
  "title": "Kalender auf dem iPhone bündeln und Termine im Blick behalten",
  "short": "Eine geprüfte Übersicht statt ständiger App-Wechsel",
  "description": "Kalenderkonten auf dem iPhone gemeinsam anzeigen. Prüfe Speicherziele, doppelte Verbindungen, Änderungen und Benachrichtigungen vor dem Wechsel.",
  "lede": "Eine gemeinsame Kalenderansicht hilft dir, Termine aus verschiedenen Konten zu vergleichen. Prüfe zuerst, was sie enthält und wo Änderungen gespeichert werden. Dieser Leitfaden stammt von Arte Soft, dem Entwickler von Cloud Calendars.",
  "commonBelief": "Wer mehrere Kalender-Apps ersetzt, müsse alle Kalender zusammenführen und die bisherigen Apps sofort löschen.",
  "sections": [
    {
      "heading": "Kläre, wofür du die Übersicht brauchst",
      "body": [
        "Notiere die Kalender, die für eine konkrete Terminentscheidung wichtig sind: etwa Besprechungen bei der Arbeit, private Termine und ein gemeinsamer Haushaltskalender. Kläre, zu welchen Konten sie gehören und wem jeder Kalender gehört. Auch mehrere Kalender unter demselben Google-Konto bleiben eigenständige Kalender.",
        "Entscheide, ob du Termine gemeinsam sehen, ihre Originale bearbeiten oder Verfügbarkeit in ein anderes Konto übertragen möchtest. Das sind unterschiedliche Aufgaben. Eine gemeinsame Ansicht hilft beim Zeitvergleich; allein dadurch sehen Kollegen einen privaten Termin noch nicht in ihrem beruflichen Planungssystem."
      ]
    },
    {
      "heading": "Prüfe vor dem Verbinden die Freigabe am Arbeitsplatz",
      "body": [
        "Verwende für ein Arbeitskonto den Verbindungsweg, den deine Organisation erlaubt. Behalte die genehmigte App, wenn du sie für Besprechungsantworten, delegierten Zugriff oder andere Arbeitsaufgaben brauchst. Auch eine kostenpflichtige private Kalender-App kann dir keine fehlenden Rechte erteilen.",
        "Scheitert eine Verbindung, notiere Kontotyp und fehlgeschlagenen Schritt, statt wiederholt Passwörter zu ändern oder Konten zu löschen. Eine Zugriffsentscheidung, ein Verbindungsfehler und ein lediglich ausgeblendeter Kalender erfordern unterschiedliche Lösungen. Frage bei der Administration nach, wenn der erlaubte Weg unklar ist."
      ]
    },
    {
      "heading": "Berücksichtige Kalenderkopien beim Hinzufügen von Konten",
      "body": [
        "Cloud Calendars kann ausgewählte iOS-Kalender neben verbundenen Google- und Microsoft-Kalendern anzeigen. Die Anbieter-Verbindungen verwenden gespiegelte Kalender im Kalenderspeicher des iPhones. Das ist keine Zusage einer reinen Anzeigeverbindung, die niemals eine weitere Darstellung eines Ereignisses speichert.",
        "Prüfe vor einem zweiten Verbindungsweg zum selben Konto, wie es bereits auf dem Telefon erscheint. Ein Anbieter-Kalender, der sowohl über iOS als auch über eine separate App-Verbindung verfügbar ist, lässt sich am Namen allein möglicherweise nicht eindeutig erkennen. Prüfe Kalender und Quelle, statt ähnlich benannte Einträge für austauschbar zu halten."
      ]
    },
    {
      "heading": "Prüfe einen entbehrlichen Testtermin in beide Richtungen",
      "body": [
        "Erstelle einen harmlosen Testtermin mit einem eindeutigen Namen im vorgesehenen beschreibbaren Kalender. Prüfe ihn in der eigenen Ansicht des Anbieters. Ändere dort den Titel, kehre zur gemeinsamen Ansicht zurück und kontrolliere denselben Eintrag. Nimm anschließend in der gemeinsamen Ansicht eine kleine Teständerung vor und bestätige sie beim Anbieter.",
        "Damit prüfst du deine tatsächliche Einrichtung, nicht eine garantierte Aktualisierungszeit. Verwende einen gewöhnlichen Termin, der dir gehört, ohne Gäste oder Wiederholung. So verschickt die Fehlersuche keine geänderten Einladungen an andere. Lasse echte Besprechungen unverändert, bis du weißt, welcher Verbindungsweg nicht funktioniert."
      ]
    },
    {
      "heading": "Grenze die Ansicht ein, bevor du etwas löschst",
      "body": [
        "Zeigt die Übersicht doppelte Einträge, blende einen Kalender vorübergehend aus und notiere, welcher Eintrag verschwindet. Vergleiche Konto, Kalender, Organisator und Uhrzeit, bevor du entscheidest, ob zwei gespeicherte Ereignisse oder zwei Anzeigewege vorliegen. Gleiche Namen reichen als Grund zum Löschen nicht aus. Notiere die ursprüngliche Auswahl und stelle sie nach dem Vergleich wieder her. In Cloud Calendars kann die Auswahl auch Widgets, die Planung von Benachrichtigungen und die Google-Synchronisierung beeinflussen.",
        "Apple beschreibt das Ein- und Ausblenden über die Auswahlfelder der Kalenderliste. Ausblenden eignet sich als erste Prüfung der Anzeige; das Löschen eines Ereignisses oder Kontos kann weitergehende Folgen haben. Bewahre die Quelle und eine gegebenenfalls benötigte Sicherung während der Untersuchung auf."
      ]
    },
    {
      "heading": "Lege deinen Alltag erst nach den Prüfungen fest",
      "body": [
        "Nutze die gemeinsame Ansicht als deinen üblichen Planungsbildschirm, wenn sie die benötigten Kalender abdeckt. Behalte eine weitere genehmigte App für Aufgaben, die die Übersicht nicht unterstützt, etwa einen besonderen Einladungsablauf am Arbeitsplatz. Weniger App-Wechsel können hilfreich sein, ohne dass eine einzige App jede Kontofunktion übernehmen muss.",
        "Prüfe Benachrichtigungen gesondert. Dass ein Ereignis nur einmal sichtbar ist, bedeutet nicht, dass dich nur eine App oder ein Gerät daran erinnert. Cloud Calendars Base enthält Google-Synchronisierung und Kalenderansichten. Advanced entfernt Werbung, Premium ergänzt Microsoft-Kalender und Teams. Prüfe lokale Preise und Kontoberechtigungen, bevor du ein Abonnement abschließt."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Liste die benötigten Kalender und die zugehörigen Eigentümerkonten für deine Planungsübersicht auf.",
    "Kläre die Freigabe am Arbeitsplatz und behalte erforderliche Arbeits-Apps.",
    "Prüfe bestehende Verbindungswege, bevor du eine weitere Anbieter-Verbindung hinzufügst.",
    "Verfolge einen entbehrlichen Testtermin zum Anbieter und zurück.",
    "Blende einen vermutlich doppelt eingebundenen Kalender aus, bevor du etwas löschst.",
    "Prüfe Erinnerungen unabhängig von der sichtbaren Kalenderansicht."
  ],
  "faq": [
    {
      "q": "Muss ich die anderen Kalender-Apps löschen?",
      "a": "Nein. Behalte erforderliche Apps und deine bisherige Einrichtung, während du die neue Übersicht prüfst. Nutze jede App für die Aufgaben, die du überprüft hast."
    },
    {
      "q": "Sehen meine Kollegen, dass meine private Zeit belegt ist?",
      "a": "Eine gemeinsame Ansicht auf deinem Telefon bestätigt nicht, dass ein anderes Konto deine Verfügbarkeit erhält. Dafür brauchst du eine gesonderte Freigabe oder Synchronisierung."
    },
    {
      "q": "Bleiben Daten bei einer Anbieter-Verbindung ausschließlich beim Anbieter?",
      "a": "Gehe nicht davon aus. Cloud Calendars verwendet gespiegelte Anbieter-Kalender im iOS-Kalenderspeicher. Prüfe den tatsächlichen Verbindungsweg und die Speicherumgebung, bevor du sensible Kalender verbindest."
    }
  ],
  "sourcesHeading": "Offizielle Hinweise zur Einrichtung und Sichtbarkeit von Kalendern",
  "sources": [
    {
      "label": "Apple: Mehrere Kalender auf dem iPhone einrichten",
      "url": "https://support.apple.com/guide/iphone/use-multiple-calendars-iph3d1110d4/ios"
    },
    {
      "label": "Apple: Kalender bei der Suche nach Duplikaten ausblenden",
      "url": "https://support.apple.com/en-us/102180"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "calendar-notifications-missing-silent-or-duplicated"
  ],
  "updated": "2026-10-22"
},

  'the-widget-that-shows-what-is-next': {
  "updated": "2026-10-23",
  "title": "Kalender-Widgets auf iPhone und iPad: anstehende Ereignisse und Wetter",
  "short": "Anstehende Ereignisse auf dem Home Screen",
  "description": "Wählen Sie ein Cloud Calendars-Widget für anstehende Ereignisse, das Datum oder das Wetter.",
  "lede": "Wählen Sie Calendar Events oder Calendar Events Large, wenn Sie anstehende Termine auf Ihrem Home Screen sehen möchten. Wählen Sie Calendar & Weather für eine Anzeige von Datum und Wetter. Diese Layouts beantworten unterschiedliche Fragen; sehen Sie sich die auf Ihrem Gerät angebotene Vorschau an, bevor Sie das Widget hinzufügen. Dieser Leitfaden wird von Arte Soft, dem Entwickler von Cloud Calendars, veröffentlicht.",
  "sections": [
    {
      "heading": "Wählen Sie zuerst das Ereignislayout",
      "body": [
        "In der Widget-Galerie von Cloud Calendars ist Calendar Events das mittlere Ereignislisten-Layout. Calendar Events Large bietet mehr Platz für bevorstehende Termine. Calendar & Weather ist ein separates Datums- und Wetter-Layout; die kleine Größe garantiert keine Zeile für das nächste Ereignis. Auf Ihrem Gerät können die Namen übersetzt angezeigt werden.",
        "Halten Sie auf dem iPhone einen leeren Bereich des Home-Bildschirms gedrückt, wählen Sie „Bearbeiten“ und „Widget hinzufügen“, suchen Sie dann nach Cloud Calendars und wählen Sie das gewünschte Layout aus. Vergleichen Sie die Vorschau, bevor Sie es hinzufügen. Apples Widget-Anleitung bezieht sich auf diese Systemgalerie; sie ist von den Kalenderansichten in der App getrennt."
      ]
    },
    {
      "heading": "Widget auf dem iPad hinzufügen und prüfen",
      "body": [
        "Verwenden Sie auf dem iPad Apples Widget-Galerie auf dem Home-Bildschirm: Hintergrund gedrückt halten, „Bearbeiten“ öffnen, dann „Widget hinzufügen“. Suchen Sie nach Cloud Calendars, prüfen Sie die angebotenen Stile und Größen, fügen Sie das gewünschte Layout hinzu, platzieren Sie es und tippen Sie auf „Fertig“. Folgen Sie den Bedienelementen Ihrer iPadOS-Version; eine Vorschau bestätigt nicht, dass Ihre Kalenderdaten geladen wurden.",
        "Wählen Sie Calendar Events oder Calendar Events Large, wenn Sie Termine benötigen. Vergleichen Sie die von der installierten App angebotenen Stile; eine Datums- und Wetter-Kachel beantwortet eine andere Frage als eine Ereignisliste.",
        "Öffnen Sie Cloud Calendars auf diesem iPad und suchen Sie in einem ausgewählten Kalender nach einem bekannten zukünftigen Termin mit Uhrzeit. Eine korrekte Ansicht auf Ihrem iPhone bestätigt nicht die Accounts, Zugriffsrechte oder geladenen Daten des iPads. Vergleichen Sie Titel, Datum und Startzeit und fahren Sie dann mit den untenstehenden Prüfungen zu Eignung und Aktualisierung fort, wenn das Widget abweicht."
      ]
    },
    {
      "heading": "Prüfen, was als bevorstehend gilt",
      "body": [
        "Die Ereignisanzeige verwendet ausgewählte Kalender und zukünftige Termine mit Uhrzeit. Ganztägige Einträge und Termine, deren Startzeit bereits vergangen ist, sind von dieser Liste bevorstehender Ereignisse ausgeschlossen. Deshalb kann ein Geburtstag oder ein laufendes Meeting in der App sichtbar sein, hier aber nicht erscheinen.",
        "Wenn Ihr einziger Eintrag heute zum Beispiel ein ganztägiger Reisehinweis ist, bedeutet eine leere Liste bevorstehender Ereignisse nicht, dass der Reisehinweis verloren gegangen ist. Öffnen Sie die App, um den vollständigen Tag zu prüfen. Ebenso kann das nächste Ereignis mit Uhrzeit erst morgen oder später sein; lesen Sie das Datum, statt anzunehmen, dass jede Zeile für heute gilt."
      ]
    },
    {
      "heading": "Fehlendes Ereignis von einer zu kurzen Liste unterscheiden",
      "body": [
        "Ein Widget zeigt nur eine begrenzte Anzahl bevorstehender Termine. Wenn frühere Ereignisse die Zeilen füllen, kann ein späterer Termin fehlen, obwohl er in der App vorhanden und für die Liste bevorstehender Ereignisse geeignet ist. Ein größeres Ereignislayout kann mehr Zeilen anzeigen; es ist trotzdem nicht der vollständige Kalender.",
        "Beginnen Sie mit dem zeitlich nächsten zukünftigen Termin mit Uhrzeit in einem ausgewählten Kalender. Wenn er erscheint, ein späterer aber nicht, öffnen Sie die App und prüfen Sie den restlichen Zeitplan. Fehlt auch das nächste geeignete Ereignis, fahren Sie mit Prüfungen zu Kalenderauswahl, Zugriff und Aktualisierung fort. Verschieben oder löschen Sie keine Termine, nur damit ein späterer Eintrag erscheint."
      ]
    },
    {
      "heading": "Die App als ersten Vergleich verwenden",
      "body": [
        "Öffnen Sie Cloud Calendars und suchen Sie einen bestimmten zukünftigen Termin mit Uhrzeit. Bestätigen Sie, dass sein Kalender ausgewählt ist und die App den erforderlichen Kalenderzugriff hat. Vergleichen Sie Titel, Datum und Startzeit mit dem Widget. Wenn das Ereignis auch in der App fehlt, prüfen Sie zuerst den Account oder die Synchronisierung.",
        "Verwenden Sie bei Bedarf einen unkritischen Testtermin in einem Kalender, der Ihnen gehört. Geben Sie ihm eine zukünftige Startzeit und einen leicht erkennbaren Titel. Ändern Sie keine echte Einladung und entfernen Sie keine Accounts, nur um den Home-Bildschirm zu testen."
      ]
    },
    {
      "heading": "Aktualisierungen einplanen, ohne von einer festen Frist auszugehen",
      "body": [
        "Widgets zeigen gespeicherte Informationen an und laufen nicht kontinuierlich wie eine geöffnete App. Apple steuert, wann sie aktualisiert werden. Wenn Sie die App öffnen und das Ereignis prüfen, haben Sie einen aktuellen Vergleichspunkt, aber keine exakte Anzahl von Sekunden, nach der sich das Widget ändern muss.",
        "Wenn die App korrekt bleibt, das Widget aber falsch ist, notieren Sie Layout, ausgewählten Kalender, Ereigniszeit und App-/iOS-Versionen. Eine leere Liste, ein alter Termin und eine falsche Uhrzeit sind unterschiedliche Beobachtungen; melden Sie, was Sie sehen."
      ]
    },
    {
      "heading": "Das Wetter als separate Zusammenfassung lesen",
      "body": [
        "Das Wetter neben dem Datum ist keine Vorhersage, die an den Ort und die Startzeit jedes Termins gebunden ist. Öffnen Sie vor einem Ereignis im Freien die Wetteransicht und prüfen Sie den vorgesehenen Ort und die Stunde. Ein Symbol für aktuelle Bedingungen kann nicht belegen, welche Bedingungen bei einem späteren Meeting herrschen werden.",
        "Nutzen Sie dieses Widget zur schnellen Orientierung. Verwenden Sie den vollständigen Kalender für ganztägige Verpflichtungen, Ereignisdetails und Entscheidungen, für die der gesamte Zeitplan nötig ist."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Wählen Sie Calendar Events oder Calendar Events Large für eine Ereignisliste.",
    "Prüfen Sie einen zukünftigen Termin mit Uhrzeit in einem ausgewählten Kalender.",
    "Vergleichen Sie Datum und Uhrzeit in der App, bevor Sie das Widget weiter prüfen.",
    "Halten Sie dauerhafte Abweichungen fest, statt Kalenderdaten zu löschen."
  ],
  "faq": [
    {
      "q": "Warum fehlt mein Geburtstag?",
      "a": "Die Liste bevorstehender Ereignisse schließt ganztägige Ereignisse aus. Prüfen Sie den vollständigen Kalender für Geburtstage und andere Einträge nur mit Datum."
    },
    {
      "q": "Zeigt das kleine Widget das nächste Meeting an?",
      "a": "Das kleine Layout Calendar & Weather zeigt Datum und Wetter. Wählen Sie für Termine ein Ereignislisten-Layout."
    },
    {
      "q": "Bedeutet kein bevorstehendes Ereignis, dass ich heute frei habe?",
      "a": "Nein. Ganztägige Einträge, laufende Ereignisse, nicht ausgewählte Kalender und veraltete Informationen können dieses Fazit verändern."
    }
  ],
  "sourcesHeading": "Quellen und Apple-Anleitungen",
  "sources": [
    {
      "label": "Apple: Widgets auf dem iPhone hinzufügen und bearbeiten",
      "url": "https://support.apple.com/118610"
    },
    {
      "label": "Apple: Ein Widget auf dem aktuellen Stand halten",
      "url": "https://developer.apple.com/documentation/widgetkit/keeping-a-widget-up-to-date"
    },
    {
      "label": "Apple: Widgets auf dem iPad hinzufügen, bearbeiten und entfernen",
      "url": "https://support.apple.com/guide/ipad/add-edit-and-remove-widgets-ipadb0de8630/ipados"
    }
  ],
  "seeAlso": [
    "choosing-a-widget-size",
    "a-countdown-to-your-next-meeting",
    "calendar-on-apple-watch"
  ],
  "comparison": {
    "heading": "Wählen Sie die Anzeige, die Sie tatsächlich benötigen",
    "columns": [
      "Anzeige",
      "Geeignet für",
      "Vor der Nutzung prüfen"
    ],
    "rows": [
      {
        "cells": [
          "Calendar Events",
          "Eine kompakte Ansicht bevorstehender Termine mit Uhrzeit.",
          "Das Ereignis gehört zu einem ausgewählten Kalender und hat noch nicht begonnen."
        ]
      },
      {
        "cells": [
          "Calendar Events Large",
          "Mehr Platz für bevorstehende Termine.",
          "Auch ein größeres Layout hat nur eine begrenzte Anzahl von Zeilen."
        ]
      },
      {
        "cells": [
          "Calendar & Weather",
          "Ein schneller Überblick über Datum und Wetter.",
          "Das kleine Layout garantiert keine Zeile für ein bevorstehendes Ereignis."
        ]
      },
      {
        "cells": [
          "Live Activity",
          "Ein separater Countdown zum nächsten Ereignis auf unterstützten iPhone-Oberflächen.",
          "Es ist weder ein Home-Bildschirm-Widget noch ein eigenes Widget-Layout für den Sperrbildschirm."
        ]
      }
    ]
  },
  "galleryKinds": [
    "widgets",
    "live"
  ],
  "galleryCaption": "Die Home-Bildschirm-Widgets und die Live Activity sind getrennte Anzeigen. Wählen Sie das Layout, das zu den Informationen passt, die Sie benötigen.",
  "actionHeading": "Den nützlichen Teil Ihres Zeitplans auf den Home-Bildschirm bringen",
  "actionText": "Öffnen Sie Cloud Calendars, prüfen Sie ein bekanntes zukünftiges Ereignis mit Uhrzeit und fügen Sie dann das passende Widget auf Ihrem iPhone oder iPad hinzu. Die App bleibt der Ort, an dem Sie den vollständigen Kalender prüfen.",
  "articleLinks": [
    {
      "slug": "weather-inside-your-calendar",
      "label": "Wetter neben Ihrem Zeitplan ansehen"
    },
    {
      "slug": "forecast-beside-every-event",
      "label": "Die Stunden eines Termins im Freien prüfen"
    },
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "Ihre verbundenen Kalender-Accounts prüfen"
    }
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
  "updated": "2026-10-22",
  "claims": {},
  "title": "Kostenlose Google-Synchronisierung auf dem iPhone: Funktionen und Werbung",
  "short": "Google kostenlos nutzen und Werbung entfernen",
  "description": "Google-Synchronisierung ist in Base enthalten. Advanced entfernt Werbung, Premium ergänzt Microsoft und Teams. Prüfe Rechte und lokale Preise.",
  "lede": "Cloud Calendars wird von Arte Soft entwickelt, dem Herausgeber dieses Leitfadens. Die Synchronisierung mit Google Kalender gehört zum kostenlosen Base-Plan. Die kostenlose App kann Werbung anzeigen; Advanced entfernt sie. Ein Abonnement und das Recht, fremde Kalender zu bearbeiten, sind zwei verschiedene Dinge.",
  "commonBelief": "Eine kostenlose Kalenderverbindung sei nur eine Testphase, oder ein werbefreier Plan verleihe automatisch mehr Rechte an geteilten Kalendern.",
  "sections": [
    {
      "heading": "Beginne mit der Verbindung, die du brauchst",
      "body": [
        "Base enthält Google-Kalender-Synchronisierung, Unterstützung für Google Meet, Kalenderansichten, Wetter und Widgets für den Home-Bildschirm. Du musst trotzdem das vorgesehene Google-Konto verbinden und die gewünschten Kalender auswählen. Ein schreibgeschützt geteilter Kalender bleibt unabhängig vom App-Plan schreibgeschützt.",
        "Lokale Kalender kannst du auf dem Gerät verwenden, ohne ein App-Konto anzulegen. Für eine Anbieter-Verbindung und Freigabedienste kann eine Anmeldung nötig sein. Die Erlaubnis, iPhone-Kalender zu lesen, bedeutet nicht, dass alle deine Google-Kalender verbunden sind."
      ]
    },
    {
      "heading": "Was sich durch einen kostenpflichtigen Plan ändert",
      "body": [
        "Advanced enthält die Funktionen von Base und entfernt Werbung. Die Zahlung ändert keine Google-Freigaberechte und verschafft Wettervorhersagen keine Priorität. Das Entfernen von Werbung gibt dir nicht das Recht, Kalender anderer Konten zu bearbeiten.",
        "Premium enthält Advanced und ergänzt Microsoft Kalender und Microsoft Teams. Wenn deine Organisation externe Verbindungen einschränkt, kann ein Kauf diese Regeln nicht aufheben. Prüfe die benötigte Verbindung, bevor du dich bei der Arbeit darauf verlässt."
      ]
    },
    {
      "heading": "Prüfe eine gewöhnliche Woche, bevor du dich entscheidest",
      "body": [
        "Wähle eine kleine Gruppe deiner tatsächlichen Kalender aus, kontrolliere die angezeigten Ereignisse und erstelle einen entbehrlichen Testtermin in einem beschreibbaren Kalender. Prüfe sein Speicherziel: Zwei Konten in derselben Ansicht bedeuten nicht, dass ihre Ereignisse zusammengeführt wurden.",
        "Entscheide getrennt, ob dich die Werbung stört und ob du Microsoft-Unterstützung brauchst. Nur weil jemand anderes einen anderen Anbieter nutzt, musst du keinen höheren Plan kaufen. Prüfe vor dem Kauf den lokalen Preis und den Abrechnungszeitraum."
      ]
    },
    {
      "heading": "Verwalte den Kauf mit dem richtigen Apple Account",
      "body": [
        "Bei einem von Apple abgerechneten Abonnement öffnest du Einstellungen, deinen Namen und dann Abonnements, um den Plan und die Kündigungsoptionen zu prüfen. Fehlt der Kauf, kontrolliere den Apple Account auf dem Beleg. Die Anmeldung beim Kalenderanbieter ist nicht dieselbe wie beim Apple Account, dem das Abonnement gehört.",
        "Das Entfernen der App ist kein Weg, die Verlängerung zu verwalten. Bevor du Konten wechselst oder lokale Daten löschst, kläre, welche Kalender lokal und welche bei einem Anbieter gespeichert sind."
      ]
    }
  ],
  "practical": [
    "Verbinde das vorgesehene Google-Konto und prüfe die ausgewählten Kalender.",
    "Prüfe die Bearbeitungsrechte mit einem entbehrlichen Testtermin im richtigen Zielkalender.",
    "Beurteile mit Base die Ansichten, Wetterfunktionen und Widgets, die du brauchst.",
    "Wähle Advanced zum Entfernen der Werbung und Premium, wenn du Microsoft Kalender oder Teams benötigst.",
    "Prüfe den lokalen Preis, den Abrechnungszeitraum und den Apple Account des Kaufs."
  ],
  "faq": [
    {
      "q": "Brauche ich Advanced für die Google-Kalender-Synchronisierung?",
      "a": "Nein. Die Google-Kalender-Synchronisierung ist in Base enthalten. Advanced entfernt Werbung; Premium ergänzt Microsoft Kalender und Teams."
    },
    {
      "q": "Kann ich durch Bezahlen einen schreibgeschützt geteilten Kalender bearbeiten?",
      "a": "Nein. Die Bearbeitungsrechte werden vom Kalendereigentümer und Anbieter bestimmt. Ein App-Abonnement verleiht dir keine Rechte an fremden Kalendern."
    }
  ],
  "sourcesHeading": "Quellen und Hilfe zu Käufen",
  "sources": [
    {
      "label": "Apple: Ein Abonnement kündigen",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "what-a-subscription-actually-buys",
    "icloud-google-and-outlook-in-one-view"
  ]
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
