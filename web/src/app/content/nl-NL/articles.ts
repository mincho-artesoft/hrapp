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
  "updated": "2026-10-23",
  "title": "Kalender met weer op iPhone en iPad: plan je dag in één oogopslag",
  "short": "Gebruik kalender en weer samen",
  "description": "Vergelijk je kalender met het weer voor de gekozen locatie op iPhone en iPad.",
  "lede": "Cloud Calendars brengt je agenda en het weer samen in dezelfde app voor iPhone of iPad. Gebruik de kalender om een datum te kiezen en de weerweergave om de gekozen locatie en beschikbare voorspeluren te bekijken. Kijk voor een buitenactiviteit naar de periode die ertoe doet, in plaats van alleen op een dagsymbool af te gaan. Deze gids is gepubliceerd door Arte Soft, de ontwikkelaar van de app.",
  "commonBelief": "Weer dat naast een kalender wordt getoond, beschrijft automatisch het adres van elke afspraak, elk uur en elke toekomstige datum.",
  "sections": [
    {
      "heading": "Kies een echte planningsvraag",
      "body": [
        "Begin met een concrete afspraak, zoals een bezoek aan een park in de middag. Bepaal wat kan veranderen: het tijdstip, de locatie, de voorbereiding of de keuze voor een alternatief. Je hoeft niet je hele agenda om te gooien alleen omdat het dagsymbool regen toont.",
        "Noteer het werkelijke begin en einde van de activiteit, inclusief opbouw als dat relevant is. Een agendaoverzicht helpt om mogelijke data te vinden, terwijl de weerscontrole over een specifieke locatie en periode gaat. Houd die twee taken uit elkaar wanneer je opties vergelijkt."
      ]
    },
    {
      "heading": "Controleer eerst de weerlocatie voordat je de waarden leest",
      "body": [
        "Cloud Calendars biedt weer voor de huidige of gekozen locatie. Controleer de getoonde locatie in plaats van aan te nemen dat het adres van een event stilzwijgend de voorspelling wijzigt. Een afspraak in een andere stad moet je vergelijken met het weer in die stad.",
        "Een bezoeker kan bijvoorbeeld de aankomst bij een museum plannen terwijl de telefoon nog thuis is. Lees de locatie van de voorspelling en de lokale tijd van de afspraak voordat je ze vergelijkt. Waarden die op het scherm dicht bij elkaar staan, bewijzen niet dat agenda en weer dezelfde locatie gebruiken."
      ]
    },
    {
      "heading": "Controleer uurlijkse en dagelijkse dekking apart",
      "body": [
        "Gebruik een dagvermelding ter oriëntatie en de beschikbare uurvermeldingen voor een vraag over een deel van de dag. Een reservering van twee tot vijf vraagt om meer dan een snelle blik op één symbool. Controleer of de relevante uren daadwerkelijk aanwezig zijn.",
        "In de huidige broncode van de app bevat de daglijst maximaal tien door WeatherKit teruggegeven dagen. Dat staat los van navigatie in de kalender en van de uren die momenteel worden geleverd. Een toekomstige afspraak verlengt de weerdekking niet. Ontbreekt de betreffende periode, plan dan later nog een weerscontrole."
      ]
    },
    {
      "heading": "Lees wat de weerwaarde betekent",
      "body": [
        "Apple documenteert WeatherKit-gegevens zoals temperatuur, neerslag, wind en UV, waarbij sommige producten alleen in bepaalde regio’s beschikbaar zijn. Lees de waarden die voor je gekozen locatie beschikbaar zijn, in plaats van overal elk weerproduct te verwachten.",
        "De uitleg van het Met Office laat zien waarom de definities van voorspelperiode en variabelen belangrijk zijn: sommige waarden gelden voor een moment en andere voor een periode. Gebruik de labels van de betreffende aanbieder. Neerslagkans, hoeveelheid en duur zijn verschillende vragen, en geen enkel getal beslist over elke buitenactiviteit."
      ]
    },
    {
      "heading": "Controleer een concept dat is gemaakt vanuit een weeruur",
      "body": [
        "Waar de app het aanmaken van een event vanuit een uur aanbiedt, wordt een concept geopend. In de huidige broncode gebruikt dat de tijdzone van de weerlocatie, stelt het een duur van één uur voor en kiest het de standaardkalender voor nieuwe events. Controleer elke waarde voordat je opslaat.",
        "Controleer de titel, de doelkalender, het begin, het einde en de bedoelde locatie. Een gekozen voorspelling geeft geen toestemming om een gedeelde kalender te bewerken, een locatie op de hoogte te stellen of een ruimte te reserveren. Controleer het opgeslagen event en regel alle instemming die het plan vereist."
      ]
    },
    {
      "heading": "Houd de demonstratie op de website apart",
      "body": [
        "De interactieve weerdemonstratie op de website gebruikt Open-Meteo. De app gebruikt Apple WeatherKit. Een webdemonstratie is nuttig om de presentatie te verkennen, maar de locatie, gegevens en beschikbare datums kunnen afwijken van de app.",
        "Open voor een echte beslissing de app en vergelijk de bedoelde afspraak met de beschikbare voorspelling. Als je een gedeeld plan wijzigt, controleer dan de organisator, de omvang van de herhaling en de deelnemers. Houd een afgesproken alternatief achter de hand wanneer de activiteit van de omstandigheden afhangt."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Bepaal om welke afspraak het gaat en welke beslissing door het weer kan veranderen.",
    "Controleer de weerlocatie en de lokale datum en tijd van de afspraak.",
    "Bekijk de beschikbare uurlijke dekking apart van de dagsamenvatting.",
    "Lees kans, hoeveelheid en andere relevante waarden aan de hand van hun labels.",
    "Controleer alle details van het eventconcept en de doelkalender voordat je opslaat.",
    "Controleer opnieuw op het beslismoment en bevestig gedeelde wijzigingen direct."
  ],
  "faq": [
    {
      "q": "Volgt het weer naast mijn kalender het adres van elk event?",
      "a": "Ga daar niet van uit. Controleer de getoonde weerlocatie en vergelijk die met de locatie; nabijheid op het scherm bewijst geen overeenkomst."
    },
    {
      "q": "Gebruikt de app de weersprovider van de website?",
      "a": "Nee. De app gebruikt Apple WeatherKit; de demonstratie op de website gebruikt apart Open-Meteo."
    },
    {
      "q": "Slaat het kiezen van een voorspeluur automatisch een afspraak op?",
      "a": "Er wordt een concept gestart waar die actie wordt aangeboden. Controleer datum, tijdzone, duur, kalender en locatie en sla daarna het bedoelde event op."
    }
  ],
  "seeAlso": [
    "weather-calendar-history-versus-forecast-iphone",
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather",
    "weather-where-the-event-is",
    "planning-outdoors-without-being-rained-on"
  ],
  "sourcesHeading": "Officiële bronnen en verder lezen",
  "sources": [
    {
      "label": "Apple: informatie over WeatherKit-voorspellingen en regionale beschikbaarheid",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: voorspellocatie, perioden en weerwaarden",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ],
  "comparison": {
    "heading": "Welke weerweergave beantwoordt je vraag?",
    "columns": [
      "Je vraag",
      "Wat je moet bekijken",
      "Wat het niet aantoont"
    ],
    "rows": [
      {
        "cells": [
          "Wat staat er vandaag op de planning?",
          "Dag- of weekweergave van de kalender naast het weer voor de gekozen locatie.",
          "Dat elk eventadres de weerlocatie automatisch wijzigt."
        ]
      },
      {
        "cells": [
          "Kan regen mijn afspraak in de middag beïnvloeden?",
          "Uurgegevens voor de locatie en voor de volledige periode van de afspraak.",
          "Dat een dagsymbool elk uur beschrijft."
        ]
      },
      {
        "cells": [
          "Kan ik volgende maand plannen op basis van het weer?",
          "Nu je kalender, en daarna een nieuwe weerscontrole dichter bij de datum.",
          "Dat navigeren in de kalender de weerdekking verlengt."
        ]
      },
      {
        "cells": [
          "Kan ik thuis snel een overzicht zien?",
          "De geschikte widget voor het beginscherm.",
          "Dat elke widgetindeling afspraken of een volledige voorspelling bevat."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-right",
    "hook"
  ],
  "galleryCaption": "Echte schermen van Cloud Calendars: de weerweergave en een dag met afspraken. Controleer de gekozen locatie en datum in de app.",
  "actionHeading": "Plan met je agenda en de voorspelling samen",
  "actionText": "Cloud Calendars is er voor iPhone en iPad. Begin met de weergaven, weer en Google Calendar-sync die in Base zijn inbegrepen; Advanced verwijdert advertenties, terwijl Premium ondersteuning voor Microsoft Calendar en Teams toevoegt.",
  "articleLinks": [
    {
      "slug": "forecast-beside-every-event",
      "label": "Bekijk het weer voor de uren van een afspraak"
    },
    {
      "slug": "the-widget-that-shows-what-is-next",
      "label": "Kies een kalender- en weerwidget"
    },
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "Breng kalenderaccounts samen in één weergave"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
  "updated": "2026-10-23",
  "title": "Bekijk Google-, iCloud- en Outlook-agenda’s samen op iPhone en iPad",
  "short": "Drie aanbieders, één weergave",
  "description": "Combineer agendaweergaven en begrijp accountmachtigingen, kopieën en abonnementsvereisten.",
  "lede": "Om werk- en privéafspraken samen te zien, koppel je de bedoelde accounts, selecteer je hun agenda’s en controleer je dezelfde gebeurtenissen in één weergave. Cloud Calendars ondersteunt planning op iPhone en iPad met iCloud en Google Calendar; ondersteuning voor Microsoft Calendar zit in Premium. Afspraken samen zien is iets anders dan bezettijd kopiëren tussen accounts van aanbieders. Arte Soft, de ontwikkelaar, publiceert deze handleiding.",
  "commonBelief": "Meerdere agenda’s in één app zetten houdt hun beschikbaarheid, delen en gebeurteniskopieën automatisch op elkaar afgestemd.",
  "sections": [
    {
      "heading": "Bepaal bij elke gebeurtenis welk account en welke agenda erachter zitten",
      "body": [
        "Begin met één gewone gebeurtenis van elke aanbieder. Noteer het aangemelde e-mailadres, de naam van de agenda en of de gebeurtenis van jou is of dat je een uitnodiging hebt ontvangen. Twee agenda’s met de naam ‘Agenda’ kunnen bij heel verschillende accounts horen. Een kleur helpt om snel een week te scannen; het account en de agenda bepalen waar een wijziging moet gebeuren.",
        "Een tandartsafspraak in je persoonlijke iCloud-agenda en een projectvergadering in Microsoft kunnen bijvoorbeeld samen voor jou zichtbaar zijn. Dat maakt de tandartsafspraak op zichzelf niet zichtbaar voor je collega’s en reserveert die tijd ook niet in hun planningshulpmiddelen.",
        "Bepaal eerst het doel voordat je een verbinding wijzigt. Wil je gebeurtenisgegevens naar een ander account verplaatsen, gebruik dan hieronder ‘Kies een agenda-exportindeling’ om een ondersteunde overdrachtsroute te vinden en controleer representatieve gebeurtenissen voordat je op de bestemming vertrouwt. Wil je tijden vergelijken, laat dan de bestaande agenda-eigenaars staan en toon geselecteerde bronnen samen. Moet een ander account bezettijd ontvangen, dan legt ‘Cloud Calendars and OneCal by workflow’ uit hoe het kopiëren van beschikbaarheid verschilt van een persoonlijk overzicht."
      ]
    },
    {
      "heading": "Maak verbinding via de juiste route",
      "body": [
        "Schakel voor iCloud eerst iCloud-agenda in op de iPhone onder het bedoelde Apple Account. De installatiehandleiding van Apple legt de apparaatinstellingen uit. Cloud Calendars heeft toegang tot agenda’s die beschikbaar zijn via het agendasysteem van de iPhone en heeft agendatoegang nodig om ze te lezen. Een account dat alleen op een ander apparaat is verbonden, is niet genoeg.",
        "Cloud Calendars heeft ook de acties ‘Sign in with Google’ en ‘Sign in with Microsoft’. Controleer met welk account je inlogt en open daarna de agendagroep om de agenda’s te selecteren die je nodig hebt. Bij de juiste aanbieder inloggen met de verkeerde privé- of werkidentiteit kan een volledig geldige maar onverwachte lijst met agenda’s opleveren."
      ]
    },
    {
      "heading": "Begrijp de abonnementen zonder ze met machtigingen te verwarren",
      "body": [
        "Het Base-abonnement bevat synchronisatie met Google Calendar en de agendaweergaven. Advanced voegt advertentievrij gebruik toe aan Base. Premium voegt functies voor Microsoft Calendar en Microsoft Teams toe. Controleer vóór aankoop de actuele lokale prijs en factureringsperiode.",
        "Een abonnement bepaalt welke appfuncties beschikbaar zijn; het geeft je geen eigendom over iemands anders agenda. Google maakt onderscheid tussen toestemming om gebeurtenissen te zien en toestemming om ze te wijzigen. Beleid van werkgevers en de machtigingen die aan een Microsoft-agenda zijn gekoppeld, blijven gelden. Een zichtbare gebeurtenis of een beschikbare editor is geen bewijs dat de aanbieder een update zal accepteren."
      ]
    },
    {
      "heading": "Een gecombineerde weergave kan agenda-kopieën bevatten",
      "body": [
        "Verbindingen met Google en Microsoft gebruiken agenda-kopieën in het agendasysteem van de iPhone om gebeurtenissen weer te geven en te synchroniseren. Ga er niet van uit dat het verbinden van een account geen kopie buiten de oorspronkelijke aanbieder achterlaat. De bestemming die voor die kopieën wordt gebruikt, kan afhangen van de agendabronnen die op het apparaat beschikbaar zijn.",
        "Als hetzelfde account de telefoon ook via een andere route bereikt, controleer dan de namen van agenda’s en bronnen voordat je dubbele afspraken als aparte gebeurtenissen behandelt. Verberg tijdelijk één agenda om vast te stellen welke weergave die levert. Verwijder geen gebeurtenis of agenda alleen om het scherm netter te laten ogen: een gekoppelde kopie kan wijzigingen terugsturen naar de aanbieder."
      ]
    },
    {
      "heading": "Blijf de bestemming kiezen wanneer je een gebeurtenis maakt",
      "body": [
        "Controleer vóór het opslaan de agenda van de gebeurtenis net zo zorgvuldig als de datum en tijd. Kies voor een familieafspraak de agenda die de familie werkelijk gebruikt; gebruik voor een werkvergadering de toegestane werkbestemming. Dat je beide agenda’s samen ziet, maakt geen van beide automatisch de bestemming voor elke nieuwe gebeurtenis.",
        "De agenda van een gebeurtenis wijzigen of die tussen agenda’s slepen kan een verplaatsing zijn, niet zomaar een onschuldige tweede weergave. Laat uitnodigingen en terugkerende vergaderingen in hun bestaande agenda staan terwijl je een weergaveprobleem onderzoekt. Als je toch iets moet wijzigen, stel dan eerst vast wie eigenaar is van de gebeurtenis en welke agenda die kan accepteren."
      ]
    },
    {
      "heading": "Controleer het overzicht voordat je erop vertrouwt",
      "body": [
        "Vergelijk een recente gebeurtenis in de eigen agenda van de aanbieder met de overeenkomstige gebeurtenis in Cloud Calendars. Controleer de datum, tijdzone, titel en geselecteerde agenda. Voor een bewerkbare agenda die van jou is, is een wegwerpgebeurtenis zonder gasten een betere controle dan een lopende vergadering wijzigen. Bevestig het resultaat bij de aanbieder voordat je de verbinding als gereed beschouwt.",
        "Vertrouw er niet op dat de gecombineerde weergave automatisch anonieme bezetblokken in een ander account aanmaakt. Als je wilt dat collega’s zien dat je niet beschikbaar bent zonder persoonlijke details te zien, gebruik dan een expliciet goedgekeurde beschikbaarheidsregeling en controleer die vanaf hun kant. Een duidelijk persoonlijk overzicht en gedeelde beschikbaarheid zijn aparte taken."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Noteer het exacte account en de agenda voor één gebeurtenis van elke aanbieder.",
    "Schakel de bedoelde iCloud-agenda’s op het apparaat in en controleer de agendatoegang.",
    "Gebruik de juiste aanmelding voor Google of Microsoft en selecteer de bedoelde agenda’s.",
    "Vergelijk één recente gebeurtenis met de weergave bij de aanbieder voordat je iets wijzigt.",
    "Verberg een vermoedelijke dubbele bron tijdelijk; laat de onderliggende gebeurtenissen intact.",
    "Controleer bij elke nieuwe gebeurtenis de doelagenda en verifieer afzonderlijk elke deling van bezettijd die je nodig hebt."
  ],
  "faq": [
    {
      "q": "Zien mijn collega’s op het werk mijn persoonlijke gebeurtenissen omdat ik beide agenda’s toon?",
      "a": "Agenda’s samen weergeven is geen deelinstructie en ook geen automatische brug voor bezettijd. Controleer de werkelijke deelinstellingen van elke agenda. Verbindingen met aanbieders kunnen agenda-kopieën op het apparaat maken, dus een gecombineerde weergave garandeert ook niet dat gebeurtenisgegevens alleen bij de oorspronkelijke aanbieder bestaan."
    },
    {
      "q": "Waarom kan ik een activiteit wel zien, maar niet met succes bewerken?",
      "a": "De agenda kan alleen-lezen zijn, de activiteit kan van een andere organisator zijn, of de provider kan de wijziging weigeren. Controleer eigendom en rechten in de agenda van de provider. Een hoger appabonnement verandert die rechten niet."
    },
    {
      "q": "Moet ik hetzelfde Google-account via elke beschikbare route koppelen?",
      "a": "Controleer eerst hoe het account al op de telefoon wordt weergegeven. Meerdere routes kunnen het lastiger maken om agendakopieën te herkennen. Kies de route die je wilt gebruiken, controleer de activiteiten daarvan en verberg tijdens het onderzoeken liever een extra weergave dan meteen gegevens te verwijderen of accounts los te koppelen."
    }
  ],
  "sourcesHeading": "Bronnen en referenties voor de configuratie",
  "sources": [
    {
      "label": "Apple: iCloud Calendar instellen op je apparaten",
      "url": "https://support.apple.com/guide/icloud/set-up-calendar-mme4d73a8727/icloud"
    },
    {
      "label": "Google: agenda delen en rechten",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: Outlook agenda-API en ondersteunde mailboxgegevens",
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
    "heading": "Gecombineerde weergave, abonnement of gekopieerde bezettijden?",
    "columns": [
      "Wat je nodig hebt",
      "Wat je moet controleren",
      "Wat je niet moet aannemen"
    ],
    "rows": [
      {
        "cells": [
          "Eén weergave van meerdere accounts",
          "Het gekoppelde account, de geselecteerde agenda en het vereiste abonnement.",
          "Dat een gedeeld scherm eigendom of rechten samenvoegt."
        ]
      },
      {
        "cells": [
          "Een wijziging aan een activiteit die de provider bereikt",
          "De oorspronkelijke activiteit, schrijfrechten en het opgeslagen resultaat bij de bron.",
          "Dat een zichtbare lokale wijziging bewijst dat de synchronisatie met de provider is geslaagd."
        ]
      },
      {
        "cells": [
          "Bezettijd in een ander account",
          "Een service met expliciete synchronisatieregels van bron naar doel.",
          "Dat een gecombineerde weergave beschikbaarheidsblokken voor collega’s aanmaakt."
        ]
      },
      {
        "cells": [
          "Een geabonneerde agenda-feed",
          "De uitgever, het vernieuwingsgedrag en de alleen-lezenstatus.",
          "Dat een ICS-abonnement een bewerkbare verbinding in twee richtingen is."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-left",
    "hook"
  ],
  "galleryDevice": "iPad",
  "galleryCaption": "Echte agendaweergaven op iPad laten zien hoe je een planning controleert. Een schermafbeelding toont niet de richting van providersynchronisatie of accountrechten.",
  "actionHeading": "Bekijk je agenda’s samen op iPhone en iPad",
  "actionText": "Google Calendar-sync is inbegrepen in Base. Advanced voegt advertentievrij gebruik toe; Premium voegt ondersteuning voor Microsoft Calendar en Teams toe. Controleer de rechten van het account los van het gekochte abonnement.",
  "articleLinks": [
    {
      "slug": "onecal-alternative-iphone-calendar-view-or-sync",
      "label": "Vergelijk een gecombineerde weergave met de synchronisatieregels van OneCal"
    },
    {
      "slug": "fantastical-readdle-calendar366-iphone-comparison",
      "label": "Vergelijk agenda-workflows op iPhone"
    },
    {
      "slug": "weather-inside-your-calendar",
      "label": "Plan met weer en activiteiten samen"
    }
  ]
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
