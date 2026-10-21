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
    "drag-an-event-to-move-it"
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
  "updated": "2026-10-21",
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
        "Prüfe vor einer weiteren Verbindung, wo der bestehende Arbeitskalender erscheint. Siehst du später zwei Versionen einer Besprechung, bestimme ihre Kalenderquellen und blende eine vorübergehend aus. Entferne keine Konten und lösche keine Ereignisse, um herauszufinden, welche Verbindung sie erzeugt hat."
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
  "updated": "2026-10-21",
  "title": "iCloud, Google und Outlook in einer Ansicht: Konten, Kopien und Rechte",
  "short": "Drei Anbieter, eine Ansicht",
  "description": "Zeige iCloud-, Google- und Microsoft-Kalender gemeinsam an. Prüfe Konten, Bearbeitungsrechte und Kopien, bevor du Termine verschiebst oder Verfügbarkeit nutzt.",
  "lede": "Ein Familientermin, ein Kundengespräch und eine Besprechung können sich überschneiden, obwohl sie zu verschiedenen Konten gehören. Eine gemeinsame Ansicht macht den Konflikt sichtbar, verwandelt die Konten aber nicht in einen geteilten Kalender. Dieser Leitfaden stammt von Arte Soft, dem Entwickler von Cloud Calendars.",
  "commonBelief": "Mehrere Kalender in einer App würden Verfügbarkeit, Freigaben und Ereigniskopien automatisch in Übereinstimmung halten.",
  "sections": [
    {
      "heading": "1. Bestimme Konto und Kalender jedes Ereignisses",
      "body": [
        "Beginne mit einem gewöhnlichen Ereignis pro Anbieter. Notiere die angemeldete E-Mail-Adresse, den Kalendernamen und ob dir das Ereignis gehört oder du eingeladen wurdest. Zwei Kalender namens „Kalender“ können zu völlig unterschiedlichen Konten gehören. Eine Farbe hilft beim Überblick; Konto und Kalender bestimmen, wohin eine Änderung gehen soll.",
        "Ein Zahnarzttermin im privaten iCloud-Kalender und eine Projektbesprechung bei Microsoft können für dich gemeinsam erscheinen. Dadurch sehen Kollegen den Zahnarzttermin nicht automatisch, und die Zeit wird nicht von selbst in ihren Planungssystemen reserviert."
      ]
    },
    {
      "heading": "2. Verwende den passenden Verbindungsweg",
      "body": [
        "Aktiviere für iCloud zuerst den iCloud-Kalender auf dem iPhone unter dem vorgesehenen Apple Account. Apples Einrichtungsanleitung erklärt die Geräteeinstellungen. Cloud Calendars greift auf Kalender im Kalendersystem des iPhones zu und benötigt Kalenderzugriff, um sie zu lesen. Eine Verbindung auf einem anderen Gerät reicht nicht.",
        "Cloud Calendars bietet außerdem „Sign in with Google“ und „Sign in with Microsoft“. Prüfe das bei der Anmeldung ausgewählte Konto, öffne anschließend dessen Kalendergruppe und wähle die benötigten Kalender. Die Anmeldung beim richtigen Anbieter mit der falschen privaten oder beruflichen Identität kann eine gültige, aber unerwartete Kalenderliste ergeben."
      ]
    },
    {
      "heading": "3. Unterscheide Tarife und Berechtigungen",
      "body": [
        "Base enthält Google-Kalender-Synchronisierung und die Kalenderansichten. Advanced ergänzt Base um Werbefreiheit. Premium fügt Microsoft-Kalender und Microsoft-Teams-Funktionen hinzu. Prüfe vor dem Kauf den aktuellen lokalen Preis und Abrechnungszeitraum.",
        "Ein Tarif bestimmt die verfügbaren App-Funktionen; er macht dich nicht zum Eigentümer eines fremden Kalenders. Google unterscheidet zwischen dem Anzeigen und Ändern von Ereignissen. Arbeitgeberregeln und Berechtigungen eines Microsoft-Kalenders gelten weiterhin. Ein sichtbares Ereignis oder ein verfügbarer Editor beweist nicht, dass der Anbieter eine Änderung akzeptiert."
      ]
    },
    {
      "heading": "4. Eine gemeinsame Ansicht kann Kalenderkopien enthalten",
      "body": [
        "Google- und Microsoft-Verbindungen verwenden Kalenderkopien im Kalendersystem des iPhones, um Ereignisse anzuzeigen und zu synchronisieren. Gehe nicht davon aus, dass beim Verbinden außerhalb des ursprünglichen Anbieters keine Kopie entsteht. Der Zielort dieser Kopien kann von den auf dem Gerät verfügbaren Kalenderquellen abhängen.",
        "Erreicht dasselbe Konto das Telefon auch über einen anderen Weg, prüfe Kalendernamen und Quellen, bevor du wiederholte Termine für eigenständige Ereignisse hältst. Blende einen Kalender vorübergehend aus, um seine Anzeige zuzuordnen. Lösche kein Ereignis und keinen Kalender nur für einen aufgeräumten Bildschirm: Eine verbundene Kopie kann Änderungen an den Anbieter zurücksenden."
      ]
    },
    {
      "heading": "5. Wähle bei jedem neuen Ereignis bewusst den Zielkalender",
      "body": [
        "Prüfe vor dem Speichern den Kalender ebenso sorgfältig wie Datum und Uhrzeit. Wähle für einen Familientermin den tatsächlich von der Familie verwendeten Kalender und für eine Besprechung den erlaubten Arbeitskalender. Dass beide gemeinsam sichtbar sind, macht keinen automatisch zum Ziel jedes neuen Ereignisses.",
        "Das Ändern des Ereigniskalenders oder Ziehen zwischen Kalendern kann ein Verschieben sein, keine harmlose zweite Ansicht. Belasse Einladungen und wiederkehrende Besprechungen während der Fehlersuche in ihrem bisherigen Kalender. Ist eine Änderung nötig, kläre zuerst, wem das Ereignis gehört und welcher Kalender es aufnehmen kann."
      ]
    },
    {
      "heading": "6. Überprüfe den Überblick, bevor du dich darauf verlässt",
      "body": [
        "Vergleiche ein aktuelles Ereignis beim Anbieter mit dem entsprechenden Ereignis in Cloud Calendars. Prüfe Datum, Zeitzone, Titel und ausgewählten Kalender. In einem eigenen bearbeitbaren Kalender eignet sich ein Testereignis ohne Gäste besser als eine Änderung an einer echten Besprechung. Bestätige das Ergebnis beim Anbieter, bevor du die Verbindung als einsatzbereit betrachtest.",
        "Verlasse dich nicht darauf, dass die gemeinsame Ansicht automatisch anonyme Belegt-Zeiten in einem anderen Konto anlegt. Sollen Kollegen deine Nichtverfügbarkeit ohne persönliche Details sehen, nutze eine ausdrücklich genehmigte Lösung und prüfe sie aus ihrer Sicht. Persönlicher Überblick und geteilte Verfügbarkeit sind getrennte Aufgaben."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Notiere für ein Ereignis jedes Anbieters das genaue Konto und den Kalender.",
    "Aktiviere die vorgesehenen iCloud-Kalender auf dem Gerät und prüfe den Kalenderzugriff.",
    "Nutze die passende Google- oder Microsoft-Anmeldung und wähle die gewünschten Kalender.",
    "Vergleiche vor Änderungen ein aktuelles Ereignis mit der Anbieteransicht.",
    "Blende eine vermutete doppelte Quelle vorübergehend aus; lasse die Ereignisse unverändert.",
    "Prüfe den Zielkalender jedes neuen Ereignisses und separat die gewünschte Freigabe belegter Zeiten."
  ],
  "faq": [
    {
      "q": "Sehen Kollegen meine privaten Ereignisse, weil ich beide Kalender anzeige?",
      "a": "Die gemeinsame Anzeige ist keine Freigabeanweisung und keine automatische Übertragung belegter Zeiten. Prüfe die tatsächlichen Freigaben jedes Kalenders. Anbieter-Verbindungen können Kalenderkopien auf dem Gerät erzeugen; die Ansicht garantiert daher auch nicht, dass Ereignisdaten nur beim ursprünglichen Anbieter existieren."
    },
    {
      "q": "Warum sehe ich ein Ereignis, kann es aber nicht erfolgreich bearbeiten?",
      "a": "Der Kalender kann schreibgeschützt sein, das Ereignis einem anderen Organisator gehören oder der Anbieter die Änderung ablehnen. Prüfe Eigentümerschaft und Rechte beim Anbieter. Ein höherer App-Tarif ändert diese Rechte nicht."
    },
    {
      "q": "Sollte ich dasselbe Google-Konto über jeden verfügbaren Weg verbinden?",
      "a": "Prüfe zuerst, wie es bereits auf dem Telefon erscheint. Mehrere Wege erschweren die Zuordnung von Kopien. Wähle den vorgesehenen Weg, überprüfe seine Ereignisse und blende während der Untersuchung eine zusätzliche Anzeige aus, statt zuerst Daten zu löschen oder Konten zu trennen."
    }
  ],
  "sourcesHeading": "Quellen und Einrichtungshinweise",
  "sources": [
    {
      "label": "Apple: iCloud-Kalender auf Geräten einrichten",
      "url": "https://support.apple.com/guide/icloud/set-up-calendar-mme4d73a8727/icloud"
    },
    {
      "label": "Google: Kalenderfreigaben und Berechtigungen",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: Outlook-Kalender-API und unterstützte Postfachdaten",
      "url": "https://learn.microsoft.com/en-us/graph/outlook-calendar-concept-overview"
    }
  ],
  "seeAlso": [
    "exchange-calendars-on-an-iphone"
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
