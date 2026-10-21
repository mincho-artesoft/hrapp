import { LocalisedArticle } from '../types';

/**
 * The four articles this language carries.
 *
 * Chosen one per intent -- weather, one view, sharing, price -- so the language
 * answers a whole question rather than a quarter of four. The numbers are not
 * here: they live once in article-facts.ts and join the prose by id, so a
 * translation can rewrite every sentence without touching a figure.
 */
export const ARTICLES_NL_NL: Readonly<Record<string, LocalisedArticle>> = {
  "month-view-on-a-bigger-screen": {
  "updated": "2026-10-22",
  "title": "Maandkalender op iPad en iPhone: bekijk de datums en controleer de details",
  "short": "Maandweergave gebruiken zonder details te missen",
  "description": "Vergelijk datums op iPad of iPhone. Controleer verborgen afspraken, geselecteerde agenda’s en tijden vóór je gedeelde of herhaalde afspraken verplaatst.",
  "lede": "De maandweergave laat zien op welke datums afspraken vallen. Ze bewijst minder goed of een bepaald uur vrij is. Kies met het overzicht een datum en bekijk daarna de dag en afspraak voordat je toezegt. Deze gids is gepubliceerd door Arte Soft, de ontwikkelaar van Cloud Calendars.",
  "commonBelief": "Een groter maandraster toont elk detail, en een schijnbaar lege datum bewijst dat iedereen beschikbaar is.",
  "sections": [
    {
      "heading": "Bepaal of je datums of exacte uren nodig hebt",
      "body": [
        "Gebruik de maand om een projectdeadline, reis en familieafspraak over meerdere weken te vergelijken. Wil je weten of twee afspraken om 14.30 uur overlappen, schakel dan naar dag- of weekweergave en controleer begin en einde. Een maandvak heeft niet dezelfde tijdschaal als een uurraster.",
        "Een workshoporganisator kan eerst een reisweek uitsluiten. Controleer daarna de voorgestelde dag: afspraken, voorbereiding, reistijd en gewenste eindtijd. Een leeg ogend vak is een mogelijkheid om te onderzoeken, geen bevestigde boeking of uitspraak over andermans beschikbaarheid."
      ]
    },
    {
      "heading": "Lees het extra aantal in plaats van alleen zichtbare titels te tellen",
      "body": [
        "Een maandvak in Cloud Calendars toont momenteel een beperkt aantal afspraaklabels en een extra aantal als die datum meer afspraken bevat. Titels blijven op één regel en kunnen worden ingekort. Open de dag of afspraak wanneer de volledige titel of overige afspraken ertoe doen.",
        "Een groter iPad-scherm kan het overzicht leesbaarder maken, maar meer ruimte heft niet noodzakelijk alle weergavelimieten op. Een smal appvenster of grotere tekst beïnvloedt wat past. Doe op iPhone dezelfde controle: open de dag voordat je zichtbare labels als de volledige planning beschouwt."
      ]
    },
    {
      "heading": "Controleer maand, geselecteerde agenda’s en aangrenzende datums",
      "body": [
        "Lees de weergegeven maand en het jaar voordat je een datum kiest. Om rijen te vullen kan het raster datums uit een aangrenzende maand tonen. Gebruik in Cloud Calendars de maandnavigatie en controleer de geselecteerde datum in plaats van alleen de positie van een vak.",
        "Controleer welke agenda’s geselecteerd zijn. Werkafspraken verbergen kan een gezinsplanning overzichtelijker maken, maar haalt die verplichtingen ook uit dat overzicht. Onderzoek je een duplicaat, verberg dan tijdelijk één bron en vergelijk. Verwijder geen afspraak alleen om de maand rustiger te maken."
      ]
    },
    {
      "heading": "Open een afspraak voordat je een gedeelde planning verandert",
      "body": [
        "Controleer titel, eigenaar of agenda, lokale tijd en duur in de details. Kleur helpt bij het scannen, maar vervangt kennis van de account of je bewerkingsrechten niet. Een zichtbare uitnodiging is iets anders dan een afspraak die je zelf organiseert.",
        "Cloud Calendars biedt slepen in de maandweergave om afspraken naar een andere datum te verplaatsen. Stel bij een echte afspraak eerst de bedoelde datum en het bereik van herhalingen vast. Open de afspraak na een toegestane wijziging opnieuw; een lokale handeling bewijst niet dat de aanbieder of elke deelnemer de wijziging heeft aanvaard."
      ]
    },
    {
      "heading": "Controleer herhalingen en tijdzones afzonderlijk",
      "body": [
        "Verplaats je alleen de les van deze week, verander dan niet per ongeluk het toekomstige patroon. Lees de beschikbare keuze voor het herhalingsbereik en controleer daarna zowel de gewijzigde als een latere afspraak. De maand maakt vergelijken eenvoudig, maar het bewerkingsbereik bepaalt het effect.",
        "Controleer bij reizen of vergaderingen tussen tijdzones expliciet de lokale datum en tijd. Naar een andere dag verplaatsen zet de bedoelde vergadertijd niet automatisch om. Controleer zo nodig de overgang naar zomer- of wintertijd en bevestig het tijdstip met de betrokkenen."
      ]
    },
    {
      "heading": "Gebruik het grotere overzicht zonder producten te verwarren",
      "body": [
        "Apple Agenda heeft eigen maandopties; Teamup beschrijft verschillende weergaven voor browser en mobiele app. Die instellingen horen bij die producten. Zoek Teamups browserconfiguratie of het weergavemenu van Apple Agenda niet in Cloud Calendars alleen omdat de indelingen dezelfde naam hebben.",
        "Een maand afspraken is ook geen maand weersverwachtingen. Controleer voor buitenactiviteiten afzonderlijk plaats, datum en beschikbare voorspellingsuren. Bewaar de definitieve afspraak in de bedoelde agenda en bevestig wijzigingen rechtstreeks met deelnemers."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Kies mogelijke datums in de maand en controleer exacte uren in dag- of weekweergave.",
    "Open dagen met een extra aantal of ingekorte titels.",
    "Controleer maand, jaar en geselecteerde agenda’s voordat je een datum vrij noemt.",
    "Bevestig agenda, tijd, duur en bewerkingsrecht van de afspraak.",
    "Lees het herhalingsbereik en controleer de opgeslagen afspraak na verplaatsing.",
    "Controleer beschikbare weersinformatie apart en bevestig wijzigingen met deelnemers."
  ],
  "faq": [
    {
      "q": "Toont de iPad-maandweergave elke afspraak volledig?",
      "a": "Ga daar niet van uit. Cloud Calendars beperkt afspraaklabels per maandvak en toont een extra aantal. Open de dag en afspraak voor de volledige planning."
    },
    {
      "q": "Betekent een lege dag dat ik vrij ben?",
      "a": "Controleer eerst geselecteerde agenda’s, datum en of relevante accountgegevens aanwezig zijn. Het overzicht toont alleen informatie die momenteel beschikbaar en zichtbaar is."
    },
    {
      "q": "Verandert verplaatsen van een herhaalde afspraak alleen die datum?",
      "a": "Lees de keuze voor het bewerkingsbereik in plaats van dit aan te nemen. Controleer na opslaan de gewijzigde en een latere afspraak en bevestig de bedoelde planning."
    }
  ],
  "sourcesHeading": "Vergelijk de officiële beschrijvingen van weergaven",
  "sources": [
    {
      "label": "Apple: maand-, meerdaagse en lijstweergaven in Apple Agenda",
      "url": "https://support.apple.com/en-ca/guide/iphone/iphfd1054569/ios"
    },
    {
      "label": "Teamup: agendaweergaven en configuratie in browser versus app",
      "url": "https://calendar.teamup.com/kb/how-to-use-calendar-views/"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "weather-inside-your-calendar",
    "sharing-one-event-not-your-calendar"
  ]
},

  'weather-inside-your-calendar': {
  "updated": "2026-10-22",
  "title": "Agenda met weer op iPhone en iPad: bekijk een plan in zijn context",
  "short": "Agenda en weer samen gebruiken",
  "description": "Gebruik agenda en weer op iPhone en iPad. Controleer plaats, beschikbare voorspellingsuren en afspraakdetails voordat je een plan opslaat.",
  "lede": "Een agenda vertelt wanneer een afspraak gepland staat. Het weer beantwoordt een andere vraag: welke omstandigheden worden verwacht voor de plaats en periode die je nodig hebt? Gebruik beide samen en houd locaties en datums duidelijk. Deze gids is gepubliceerd door Arte Soft, de ontwikkelaar van Cloud Calendars.",
  "commonBelief": "Weer naast een agenda beschrijft automatisch het adres van elke afspraak, elk uur en elke toekomstige datum.",
  "sections": [
    {
      "heading": "Begin met een concrete planningsvraag",
      "body": [
        "Kies een bepaalde afspraak, zoals een middagbezoek aan een park. Bepaal wat kan veranderen: tijd, locatie, voorbereiding of de keuze voor een alternatief. Je hoeft niet je hele agenda om te gooien omdat het dagsymbool regen toont.",
        "Noteer het echte begin en einde van de activiteit, inclusief voorbereiding waar nodig. Het agendaoverzicht helpt mogelijke datums te vinden; de weercontrole betreft een specifieke plaats en periode. Houd die twee taken gescheiden wanneer je opties vergelijkt."
      ]
    },
    {
      "heading": "Controleer de weerlocatie voordat je waarden leest",
      "body": [
        "Cloud Calendars biedt weer voor de huidige of geselecteerde plaats. Controleer de weergegeven locatie in plaats van aan te nemen dat het afspraakadres de voorspelling ongemerkt verandert. Voor een afspraak in een andere stad moet je het weer van die stad vergelijken.",
        "Je kunt bijvoorbeeld een museumbezoek plannen terwijl je telefoon nog thuis is. Lees eerst de voorspellingslocatie en lokale afspraaktijd. Waarden die dicht bij elkaar op het scherm staan, bewijzen niet dat agenda en weer dezelfde plaats gebruiken."
      ]
    },
    {
      "heading": "Controleer uur- en dagdekking afzonderlijk",
      "body": [
        "Gebruik het dagoverzicht ter oriëntatie en de beschikbare uurgegevens voor een deel van de dag. Een afspraak van twee tot vijf vraagt meer dan een blik op één symbool. Controleer of de relevante uren werkelijk aanwezig zijn.",
        "In de huidige appbroncode neemt de daglijst maximaal tien door WeatherKit teruggegeven dagen over. Dat staat los van agendanavigatie en van de momenteel geleverde uren. Een toekomstige afspraak verlengt de weersdekking niet. Ontbreekt de periode, plan dan een latere weercontrole."
      ]
    },
    {
      "heading": "Lees wat de weerwaarde betekent",
      "body": [
        "Apple beschrijft WeatherKit-gegevens zoals temperatuur, neerslag, wind en UV; sommige producten zijn slechts in bepaalde regio’s beschikbaar. Lees de beschikbare waarden voor jouw plaats in plaats van overal elk weerproduct te verwachten.",
        "De uitleg van het Met Office laat zien waarom de voorspellingsperiode en definities belangrijk zijn: sommige waarden gelden voor een moment, andere voor een periode. Volg de labels van de betreffende aanbieder. Regenkans, hoeveelheid en duur zijn verschillende vragen; geen enkel getal beslist over elke buitenactiviteit."
      ]
    },
    {
      "heading": "Controleer een concept dat vanuit een weeruur is gemaakt",
      "body": [
        "Waar de app een afspraak vanuit een uur laat maken, opent deze een concept. De huidige broncode gebruikt de tijdzone van de weerlocatie, stelt één uur voor en kiest de standaardagenda voor nieuwe afspraken. Bekijk elke waarde vóór het opslaan.",
        "Bevestig titel, doelagenda, begin, einde en bedoelde locatie. Een voorspelling selecteren geeft geen bewerkingsrecht voor een gedeelde agenda, meldt niets aan een locatie en reserveert geen ruimte. Controleer de opgeslagen afspraak en regel de benodigde instemming."
      ]
    },
    {
      "heading": "Houd de websitedemonstratie apart",
      "body": [
        "De interactieve weerdemonstratie op de website gebruikt Open-Meteo. De app gebruikt Apple WeatherKit. De webdemo helpt om de presentatie te verkennen, maar plaats, gegevens en beschikbare datums kunnen van de app verschillen.",
        "Open voor een echte beslissing de app en vergelijk de bedoelde afspraak met de beschikbare voorspelling. Controleer bij wijzigingen aan een gedeeld plan de organisator, het herhalingsbereik en de deelnemers. Spreek een alternatief af als de activiteit van omstandigheden afhangt."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Bepaal de afspraak en welke beslissing het weer kan beïnvloeden.",
    "Controleer de weerlocatie en de lokale datum en tijd van de afspraak.",
    "Bekijk de beschikbare uurdekking los van het dagoverzicht.",
    "Lees kans, hoeveelheid en andere relevante waarden volgens hun labels.",
    "Controleer alle conceptdetails en de doelagenda vóór het opslaan.",
    "Controleer opnieuw op het beslismoment en bevestig gedeelde wijzigingen rechtstreeks."
  ],
  "faq": [
    {
      "q": "Volgt het weer naast mijn agenda elk afspraakadres?",
      "a": "Ga daar niet van uit. Controleer de weergegeven weerlocatie en vergelijk die met de bestemming; nabijheid op het scherm bewijst geen overeenkomst."
    },
    {
      "q": "Gebruikt de app de weeraanbieder van de website?",
      "a": "Nee. De app gebruikt Apple WeatherKit; de websitedemonstratie gebruikt afzonderlijk Open-Meteo."
    },
    {
      "q": "Slaat het kiezen van een voorspellingsuur automatisch een afspraak op?",
      "a": "Het opent een concept waar die actie beschikbaar is. Controleer datum, tijdzone, duur, agenda en locatie en sla daarna de bedoelde afspraak op."
    }
  ],
  "seeAlso": [
    "month-view-on-a-bigger-screen",
    "icloud-google-and-outlook-in-one-view",
    "sharing-one-event-not-your-calendar"
  ],
  "sourcesHeading": "Officiële bronnen en verder lezen",
  "sources": [
    {
      "label": "Apple: WeatherKit-voorspellingen en regionale beschikbaarheid",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: voorspellingsplaats, perioden en weerwaarden",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google en Outlook in één weergave',
    short: 'Drie accounts, één weergave',
    description:
      "Lees hoe één overzicht van Apple-, Google- en werkagenda’s helpt om afspraken te vergelijken en overlappende verplichtingen te herkennen.",
    lede: "Het probleem is bijna nooit dat een van die agenda's slecht is. Het is dat u er drie hebt en één week.",
    commonBelief: 'Dat werk en privé in aparte apps houden een grens is en geen gebrek.',
    sections: [
      {
        heading: 'Dubbel boeken is structureel',
        body: [
          'Als uw afspraken op drie plekken leven, kan geen enkele plek u vertellen of u vrij bent. U bent de samenvoegstap, en die voert u uit uit uw hoofd, meestal terwijl iemand op antwoord wacht.',
          'Daarom is de klassieke misser niet een afspraak vergeten; het is iets toezeggen dat botst met een afspraak die u niet kon zien.',
        ],
      },
      {
        heading: 'Wat één raster oplevert',
        body: [
          'Alle accounts in dezelfde week, gekleurd naar herkomst, ter plekke bewerkbaar. U hoeft zich niet meer af te vragen welke app het antwoord heeft, omdat de vraag niet langer meervoud is.',
          'iCloud en Google synchroniseren in de gratis versie. Microsoft-accounts — Outlook en Exchange — vallen onder betaald, omdat die verbinding terugkerende kosten heeft die de andere niet hebben.',
        ],
      },
    ],
    claims: {
      accounts: 'Soorten accounts die één weergave kan bevatten',
      premiumMonthly: 'Maandprijs om Microsoft toe te voegen, in dollars',
    },
    practical: [
      'Voeg eerst het persoonlijke account toe en daarna dat wat de botsingen veroorzaakt.',
      'Kleur op account en niet op categorie: herkomst is wat u in één oogopslag nodig hebt.',
      'Blijf schrijven in de agenda die anderen al lezen.',
    ],
    seeAlso: ['weather-inside-your-calendar', 'what-a-subscription-actually-buys'],
  },

  'sharing-one-event-not-your-calendar': {
  "updated": "2026-10-21",
  "title": "Eén agenda-afspraak delen: kies de juiste link en toegang",
  "short": "Eén afspraak delen",
  "description": "Deel één afspraak zonder je hele agenda te delen. Begrijp Reader, Writer en Owner, voorvertoningen, updates en de grenzen van het intrekken van toegang.",
  "lede": "Details van een etentje delen, een medeorganisator laten wijzigen en aanwezigheidsreacties verzamelen zijn verschillende taken. Bepaal eerst wat je nodig hebt en kies daarna de deelmethode. Deze gids is geschreven door Arte Soft, de ontwikkelaar van Cloud Calendars.",
  "commonBelief": "Elke afspraaklink zou een alleen-lezen abonnement zijn dat direct wordt bijgewerkt en een reactie vastlegt.",
  "sections": [
    {
      "heading": "Begin met de gegevens van één afspraak",
      "body": [
        "Een gedeelde losse afspraak omvat die afspraak, niet de volledige agenda van de afzender. Controleer vóór verzending de titel, tijdzone, locatie, notities en vergaderlinks. Informatie die voor één gast nuttig is, hoort misschien niet in een breed verspreide link.",
        "Voor het delen van een etentje hoef je de agenda met je medische afspraken niet te delen. De locatie en links van het etentje gaan wel mee. Controleer daarom de afspraak zelf in plaats van op de privacy van de omringende agenda te vertrouwen."
      ]
    },
    {
      "heading": "Kies een voorvertoning, e-mailuitnodiging of QR-code",
      "body": [
        "Cloud Calendars heeft verschillende deelroutes. De App Clip toont een voorvertoning; om via die ervaring de afspraak toe te voegen is de volledige app nodig. E-mail- en QR-uitnodigingen gebruiken een webpagina die Cloud Calendars kan openen. Deze links zijn geen onderling uitwisselbare abonnements-URL’s.",
        "Voor gesynchroniseerd delen meldt de afzender zich aan. Een link of QR-code kan worden doorgestuurd: verspreid die alleen waar de inhoud geschikt is. Een QR-code geeft een link door en bewijst niet wie deze heeft geopend."
      ]
    },
    {
      "heading": "Geef alleen de benodigde toegang",
      "body": [
        "Bij e-mailuitnodigingen kies je Reader, Writer of Owner. Reader kan bekijken en synchroniseren; Writer kan bewerken; Owner kan ook delen en toegang beheren. Dit zijn wezenlijk verschillende rechten. Gebruik Reader als iemand alleen het schema hoeft te zien.",
        "Kies Writer voor een medeorganisator die de afspraak mag wijzigen. Kies Owner alleen als die persoon ook de toegang van anderen moet beheren. Voor uitgebreidere rechten moet de ontvanger met de juiste identiteit zijn aangemeld. Een anonieme ontvanger is geen geïdentificeerde mede-eigenaar."
      ]
    },
    {
      "heading": "Begrijp hoe de ontvanger de afspraak toevoegt",
      "body": [
        "In de volledige app vereist toevoegen toegang tot agenda’s en een beschrijfbare doelagenda. Laat de ontvanger die bestemming controleren voordat die opslaat. De ontvangen kopie kan vervolgens aan de gedeelde afspraak worden gekoppeld voor latere updates.",
        "Dit verschilt van het importeren van een gewoon ICS-bestand in een andere agenda. Importeren maakt een kopie; een abonnement controleert periodiek een feed. Stuur je een ICS-feed in plaats van een app-uitnodiging, leg dat dan uit en controleer of de agenda van de ontvanger dit ondersteunt."
      ]
    },
    {
      "heading": "Controleer wijzigingen voordat je erop vertrouwt",
      "body": [
        "Gesynchroniseerd delen kan latere wijzigingen of annulering overbrengen, maar het apparaat van de ontvanger moet ze kunnen ontvangen. Een verversingsadvies voor een feed is geen bezorgdeadline. Een offline apparaat, niet-ververst abonnement of losse geïmporteerde kopie kan nog oude informatie tonen.",
        "Verandert het etentje vlak voor aanvang, werk dan de afspraak bij en neem rechtstreeks contact op. Vraag de gasten de nieuwe tijd te bevestigen. Een update verzenden en een aanwezigheidsreactie ontvangen zijn afzonderlijke stappen."
      ]
    },
    {
      "heading": "Beheer toegang zonder te beloven dat kopieën verdwijnen",
      "body": [
        "Controleer de rechten van ontvangers en verwijder rechten die niet meer nodig zijn. Een ontvanger verwijderen en een feedlink intrekken zijn verschillende handelingen. Geen van beide mag worden voorgesteld als het op afstand wissen van screenshots, berichten of alle agendakopieën.",
        "Is een link buiten de bedoelde groep verspreid, stel dan vast welke link of toegangstoekenning het betreft. Controleer de betreffende route na de wijziging. Houd bij toekomstige afspraken privégegevens uit breed verspreide links, in plaats van te vertrouwen op later intrekken om die terug te halen."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Controleer de details en bepaal of je bekijken, bewerken of aanwezigheidsreacties nodig hebt.",
    "Kies de bedoelde deelroute en meld je aan waar dat nodig is.",
    "Gebruik Reader voor kijkers; geef Writer of Owner alleen voor de bijbehorende verantwoordelijkheid.",
    "Vraag de ontvanger bij het toevoegen de tijd en doelagenda te controleren.",
    "Werk bij urgente wijzigingen de afspraak bij en stuur een rechtstreeks bericht.",
    "Controleer bij beëindiging van het delen ontvangersrechten en linktoegang afzonderlijk."
  ],
  "faq": [
    {
      "q": "Wordt mijn hele agenda zichtbaar als ik één afspraak deel?",
      "a": "De gesynchroniseerde route voor één afspraak beperkt zich tot die afspraak. De eigen details worden wel via de gekozen route gedeeld. Controleer die details en stuur geen uitnodiging voor de hele agenda als je slechts één afspraak wilt delen."
    },
    {
      "q": "Kan de ontvanger de afspraak wijzigen?",
      "a": "Ja, met de juiste Writer- of Owner-toegang en de ondersteunde aangemelde route. Reader is voor bekijken en synchroniseren. Een gewoon ICS-abonnement is niet hetzelfde bewerkingsmechanisme."
    },
    {
      "q": "Maakt iemand verwijderen alles ongedaan wat die al heeft ontvangen?",
      "a": "Ga niet van die garantie uit. Toegangswijzigingen beïnvloeden de ondersteunde deelrelatie, maar opgeslagen kopieën, screenshots en berichten kunnen blijven bestaan. Een gedeelde feed-URL moet ook afzonderlijk worden beoordeeld."
    }
  ],
  "sourcesHeading": "Bronnen voor de opties van ontvangers",
  "sources": [
    {
      "label": "Apple: overzicht van App Clips",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google: afspraken importeren en beperkingen",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft: een agenda importeren of erop abonneren",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "what-guests-can-do-to-your-event",
    "taking-back-a-calendar-you-shared"
  ]
},

  'what-a-subscription-actually-buys': {
  "updated": "2026-10-21",
  "title": "Wat een abonnement werkelijk oplevert",
  "short": "Wat een abonnement oplevert",
  "description": "Wat een abonnement oplevert: Base, Advanced, Premium.",
  "lede": "Deze gids wordt uitgegeven door Arte Soft, de ontwikkelaar van Cloud Calendars.",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "Base bevat Google Calendar-synchronisatie, Google Meet, agendaweergaven, weer en widgets. Het gratis abonnement kan advertenties tonen."
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Advanced bevat Base en verwijdert advertenties. Premium bevat Advanced en voegt Microsoft Calendar en Microsoft Teams toe.",
        "Een abonnement geeft geen bewerkingsrechten voor andermans agenda’s en omzeilt geen beperkingen van een werkaccount."
      ]
    },
    {
      "heading": "Informatie over aankoop en opzegging",
      "body": [
        "Controleer vóór aankoop de lokale prijs, factureringsperiode en verlengingsvoorwaarden.",
        "Voor een door Apple gefactureerd abonnement open je Instellingen → je naam → Abonnementen. Controleer de status en einddatum. Verlenging opzeggen staat los van het verwijderen van de app of agendagegevens; ga er niet van uit dat betaalde functies na afloop beschikbaar blijven."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Controleer vóór aankoop de lokale prijs, factureringsperiode en verlengingsvoorwaarden.",
    "Een abonnement geeft geen bewerkingsrechten voor andermans agenda’s en omzeilt geen beperkingen van een werkaccount."
  ],
  "faq": [
    {
      "q": "Hoe stop ik de verlenging?",
      "a": "Voor een door Apple gefactureerd abonnement open je Instellingen → je naam → Abonnementen. Controleer de status en einddatum. Verlenging opzeggen staat los van het verwijderen van de app of agendagegevens; ga er niet van uit dat betaalde functies na afloop beschikbaar blijven."
    }
  ],
  "sourcesHeading": "Informatie over aankoop en opzegging",
  "sources": [
    {
      "label": "Apple: Hoe stop ik de verlenging?",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view"
  ]
},
};
