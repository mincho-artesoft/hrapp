import { LocalisedArticle } from '../types';

/** De zes Google-artikelen: concrete vragen, heldere antwoorden. */
export const GOOGLE_NL_NL: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
  "title": "Deelrechten in Google Agenda: controleer welke toegang je geeft",
  "short": "Toegang en privacy in Google Agenda",
  "description": "Kies toegang tot beschikbaarheid, details of bewerken. Controleer vóór het delen zowel openbare en groepstoegang als individuele rechten.",
  "lede": "Bepaal vóór het delen wat de ander moet kunnen doen. Om je afspraken heen plannen, details lezen en de agenda onderhouden zijn verschillende taken. Deze gids is gepubliceerd door Arte Soft, de ontwikkelaar van Cloud Calendars.",
  "commonBelief": "Een beperkte instelling voor één persoon zou garanderen dat die via geen enkele andere route details kan zien.",
  "sections": [
    {
      "heading": "Stem de toegang af op de taak",
      "body": [
        "Een collega die een tijd zoekt, heeft mogelijk alleen beschikbaarheid nodig zonder afspraakdetails. Iemand die een projectplanning bijhoudt, heeft andere toegang nodig. Bepaal eerst de taak en bekijk daarna de rechten in de huidige deelinstellingen van de agenda.",
        "Google onderscheidt beschikbaarheid, afspraakdetails en meerdere bewerkingsniveaus. Eén bewerkingsoptie beperkt toegang tot privéafspraken; een andere staat bewerken en details toe; de ruimste biedt ook beheer van delen. Behandel niet elke optie met het woord wijzigen als gelijkwaardig."
      ]
    },
    {
      "heading": "Controleer de toegang tot de hele agenda",
      "body": [
        "Bekijk naast personen ook of de agenda openbaar is, voor je organisatie beschikbaar is of met een groep wordt gedeeld. Volgens Google kan ruimere agendatoegang een beperktere toekenning overstijgen: één persoon beperken maakt al gepubliceerde details niet onzichtbaar.",
        "Denk aan een verenigingsrooster dat voor leden is gepubliceerd. Controleer het publiek voordat je er een persoonlijke afspraak in zet. De instelling naast één vriend is niet de enige relevante instelling. Bewaar privéafspraken in een passende agenda."
      ]
    },
    {
      "heading": "Gebruik de instellingen van de juiste Google-agenda",
      "body": [
        "Zoek op een computer in Google Agenda de bedoelde agenda, open het menu en ga naar de deelinstellingen. Google beschrijft afzonderlijke onderdelen voor personen of groepen en bredere toegang. Controleer de agendanaam en het aangemelde account voordat je iets wijzigt.",
        "Bevestig bij uitnodigen de bedoelde Google-identiteit van de ontvanger. Kan die de agenda niet vinden, controleer dan het adres en uitnodigingsbericht in plaats van de toegang te verruimen om de agenda zichtbaar te maken. Ontbrekende weergave en onvoldoende bewerkingsrechten zijn verschillende problemen."
      ]
    },
    {
      "heading": "Test zonder privéafspraken",
      "body": [
        "Gebruik een gewone testafspraak zonder vertrouwelijke titel, notities, locatie of gastenlijst. Vraag de ontvanger wat zichtbaar is en, alleen als bewerken nodig en toegestaan is, wat gewijzigd kan worden. Deel daarvoor niet je accountgegevens.",
        "Noteer de agenda en toegekende rol en controleer het resultaat na een wijziging. Zo toets je de bedoelde inrichting; je bewijst niet dat eerder gelezen of gekopieerde informatie verdwenen is. Publiceer geen echt werkschema als test."
      ]
    },
    {
      "heading": "Houd werkbeleid en app-abonnementen uit elkaar",
      "body": [
        "Google vermeldt dat werk- of schoolbeheerders delen kunnen beperken. Gebruik de goedgekeurde route van de organisatie als de benodigde instelling ontbreekt. Publiceer geen werkinformatie om een accountbeperking te omzeilen.",
        "Cloud Calendars kan gekoppelde agenda’s tonen, maar abonnementsnamen veranderen Google-rechten niet. Advanced verwijdert advertenties; betaling geeft een ander niet ineens toegang tot elk Google-evenement. Controleer de deelinstellingen bij de aanbieder en het geaccepteerde resultaat, niet alleen of lokaal een editor beschikbaar is."
      ]
    },
    {
      "heading": "Controleer en verwijder overbodige toegang",
      "body": [
        "Bekijk na een project de daadwerkelijke ontvangers, groepen en eventuele bredere publicatie. Eén persoon verwijderen is maar een deel van de controle als andere toegangswegen bestaan. Spreek af wie het schema onderhoudt en hoe toekomstige wijzigingen worden geregeld.",
        "Google beschrijft personen of groepen verwijderen en breder delen uitschakelen afzonderlijk. Toegang intrekken haalt geen geëxporteerd bestand, screenshot of elders gekopieerde informatie terug. Bespreek dat apart met betrokkenen in plaats van te beloven dat één schakelaar alle eerdere kopieën wist."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Bepaal de agenda en de taak van de ontvanger.",
    "Controleer individuele, groeps-, organisatie- en openbare toegang.",
    "Kies in de actuele Google-instellingen de rechten die bij de taak passen.",
    "Controleer de identiteit vóór je toegang wijzigt.",
    "Controleer een onschuldige testafspraak aan de kant van de ontvanger.",
    "Bekijk verouderde toegangswegen zonder aan te nemen dat kopieën worden teruggehaald."
  ],
  "faq": [
    {
      "q": "Heeft een individuele beperking voorrang op een openbare agenda?",
      "a": "Nee. Google beschrijft dat ruimere agendarechten voorrang hebben bij tegenstrijdige instellingen. Controleer openbare en organisatie-instellingen naast de vermelding van die persoon."
    },
    {
      "q": "Maken alle bewerkingsrechten privéafspraken op dezelfde manier zichtbaar?",
      "a": "Nee. Google beschrijft een bewerkingsoptie die toegang tot privéafspraken beperkt, afzonderlijk van andere bewerkings- en deelbeheeropties. Lees de exacte actuele rechten voordat je kiest."
    },
    {
      "q": "Verandert Advanced kopen de deelrechten van Google?",
      "a": "Nee. Advanced verwijdert advertenties in Cloud Calendars. Toegang bij de aanbieder hangt af van agendarechten en eventuele organisatiebeperkingen."
    }
  ],
  "sourcesHeading": "Actuele Google-informatie over rechten en delen",
  "sources": [
    {
      "label": "Google: agendarechten kiezen",
      "url": "https://support.google.com/calendar/answer/15716974?hl=en"
    },
    {
      "label": "Google: een agenda delen en toegang verwijderen",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    }
  ],
  "seeAlso": [
    "why-a-shared-calendar-does-not-appear",
    "sharing-one-event-not-your-calendar",
    "taking-back-a-calendar-you-shared"
  ],
  "updated": "2026-10-21"
},

  'why-a-shared-calendar-does-not-appear': {
    "updated": "2026-10-21",
    "title": "Een agenda is met je gedeeld en hij staat er niet",
    "short": "Gedeelde agenda verschijnt niet",
    "description": "Ontbreekt een gedeelde Google-agenda? Controleer het uitgenodigde account, de groep, zichtbaarheid en het soort link.",
    "lede": "Deze gids is van Arte Soft, de ontwikkelaar van Cloud Calendars. Maak eerst onderscheid tussen ontbrekende toegang en een verborgen agenda.",
    "commonBelief": "Dat accepteren een gedeelde agenda op je telefoon zet.",
    "sections": [
      {
        "heading": "Controleer account en groep",
        "body": [
          "Vergelijk de ontvanger van de uitnodiging met het Google-account op je telefoon en in je browser. Open de uitnodigingslink met het juiste account. Google ondersteunt delen met personen en Google-groepen. Laat bij groepstoegang je lidmaatschap bevestigen door de groepsbeheerder en de juiste groepsmachtiging door de agenda-eigenaar. Een doorgestuurde e-mail verleent op zichzelf geen toegang."
        ]
      },
      {
        "heading": "Verborgen, afwezig of beperkt?",
        "body": [
          "Open het menu van Google Agenda op iPhone of iPad. Staat de agenda er zonder vinkje, selecteer hem dan. Ontbreekt hij, laat de eigenaar de toegang controleren: een aanvraag is nog geen toestemming. Werk- of schoolbeleid kan delen beperken. Vergelijk hetzelfde account in Google Agenda op het web. Werkt het daar, controleer dan het verbonden account en de agendaselectie in de andere app. Alleen-lezen geeft geen bewerkingsrecht."
        ]
      },
      {
        "heading": "Bepaal het soort link",
        "body": [
          "Een deeluitnodiging bevat ook een link; niet elke link is een ICS-abonnement. Vraag of hij toegang verleent tot een Google-agenda of een alleen-lezenfeed publiceert. Google vereist een computerbrowser voor een nieuw agenda-abonnement; een al per e-mail gedeelde agenda openen is iets anders. Feedupdates hangen af van de ontvangende dienst. Er is geen vaste wachttijd voor alles; bevestig urgente wijzigingen met de organisator."
        ]
      }
    ],
    "claims": {},
    "faq": [
      {
        "q": "Kan een Google-groep toegang krijgen?",
        "a": "Ja. Controleer de gekozen groep, je lidmaatschap en organisatieregels. Een doorgestuurde groepsmail bewijst geen toegang."
      },
      {
        "q": "Moet ik het account verwijderen en opnieuw verbinden?",
        "a": "Controleer eerst identiteit, rechten en zichtbaarheid en vergelijk de webagenda. Opnieuw verbinden verleent geen ontbrekende rechten."
      }
    ],
    "practical": [
      "Bevestig het uitgenodigde account en groepslidmaatschap.",
      "Vink een aanwezige maar verborgen agenda aan.",
      "Laat toegang controleren voordat je verbindingen wijzigt."
    ],
    "sourcesHeading": "Bronnen en meer informatie",
    "sources": [
      {
        "label": "Google: Controleer account en groep",
        "url": "https://support.google.com/calendar/answer/37082?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Verborgen, afwezig of beperkt?",
        "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Bepaal het soort link",
        "url": "https://support.google.com/calendar/answer/37648?hl=en"
      }
    ],
    "seeAlso": [
      "who-can-see-what-in-google-calendar",
      "google-calendars-that-never-reach-your-iphone"
    ]
  },

  'the-secret-address-of-a-google-calendar': {
  "title": "Googles geheime iCal-adres: abonneren is iets anders dan delen",
  "short": "Het geheime iCal-adres",
  "description": "Begrijp Googles geheime iCal-adres, accountverbindingen en feeds. Handel bij uitlekken zonder directe updates of het wissen van kopieën te beloven.",
  "lede": "Een kalenderadres, accountverbinding en uitnodiging hebben verschillende functies. Bepaal wat je hebt voordat je een rooster in een andere app opent. Deze gids is gepubliceerd door Arte Soft, de ontwikkelaar van Cloud Calendars.",
  "commonBelief": "Een geheim kalenderadres zou een persoonlijke uitnodiging zijn die je voor één ontvanger kunt intrekken.",
  "sections": [
    {
      "heading": "Kies de verbinding die bij de taak past",
      "body": [
        "Google onderscheidt aanmelden bij een andere agenda-app van bekijken via een geheim iCal-adres. Een accountverbinding kan bewerken ondersteunen; het adres biedt een alleen-lezen abonnement. Volgens Google is het geheime adres voor eigen gebruik en moet je het niet met anderen delen.",
        "Je eigen werkrooster in een compatibele agenda tonen is bijvoorbeeld iets anders dan een collega blijvend toegang geven. Bepaal of je zelf wilt kijken, met een genoemde persoon wilt samenwerken of een rooster wilt publiceren. Kies een URL niet alleen omdat plakken makkelijk is."
      ]
    },
    {
      "heading": "Zoek de juiste agenda, niet alleen het juiste account",
      "body": [
        "Op een computer staat het geheime iCal-adres volgens Google bij de integratie-instellingen van de gekozen agenda. Controleer eerst de agendanaam. Werk- of schoolbeheerders kunnen deze optie beperken; een ontbrekend adres is geen reden om de agenda openbaar te maken.",
        "Houd het adres uit screenshots, openbare supportberichten en gedeelde notities. Beschrijf bij hulpvragen accounttype, agendanaam en verbindingsmethode zonder de URL mee te sturen. Eerst moet duidelijk zijn welke route je gebruikt; afspraakinhoud is daarvoor doorgaans niet nodig."
      ]
    },
    {
      "heading": "Controleer wat de ontvangende app heeft toegevoegd",
      "body": [
        "Een abonnement volgt een feed; een geïmporteerd bestand maakt een afzonderlijke kopie. Lees de instructies van de ontvangende app en controleer welke actie je uitvoert. Het openen van een gedownload kalenderbestand betekent niet dat de afspraken later automatisch veranderen.",
        "Vergelijk met een gewone, niet-gevoelige afspraak die je herkent: agendanaam, datum en zichtbare details. Maak geen tweede abonnement om het eerste te onderzoeken; twee kopieën kunnen een vertraagde update op een conflict laten lijken. Verberg tijdelijk één agenda om de bron te herkennen."
      ]
    },
    {
      "heading": "Houd Google- en Cloud Calendars-links uit elkaar",
      "body": [
        "Cloud Calendars heeft eigen deelroutes voor afspraken en agenda’s, waaronder feeds. Dat zijn geen geheime Google-adressen. Stel vast of de afzender één afspraak, een agenda of een accountgebonden uitnodiging deelt voordat je kiest hoe je de link opent.",
        "Een Cloud Calendars-ontvanger kan Reader, Writer of Owner zijn. Een feedadres alleen bewijst geen bewerkingsrecht. Ook een Google-kijkadres maakt je geen eigenaar van de agenda. Vraag de afzender welk systeem voor wijzigingen bedoeld is."
      ]
    },
    {
      "heading": "Houd rekening met verversing door de ontvangende agenda",
      "body": [
        "Een abonnement belooft geen directe bezorging. Cloud Calendars-feeds bevatten een voorgesteld verversingsinterval, maar de ontvangende app bepaalt wanneer updates worden opgehaald en getoond. Een oude tijd op één apparaat bewijst niet dat de organisator de wijziging niet heeft opgeslagen.",
        "Vergelijk bij een afspraak voor vandaag met het actuele schema van de organisator en bevestig belangrijke wijzigingen rechtstreeks. Noteer welke agenda oude informatie toont en wanneer je keek. Importeer niet steeds opnieuw en verwijder de bronagenda niet om een feed te laten bijwerken."
      ]
    },
    {
      "heading": "Reageer op uitlekken zonder volledige terughaling te beloven",
      "body": [
        "Google beschrijft het opnieuw instellen van een uitgelekt geheim adres: het oude wordt ongeldig en er komt een nieuw adres. Bepaal welke eigen apps het gebruiken zodat je hun abonnementen kunt aanpassen. Dit is iets anders dan een genoemde medewerker verwijderen.",
        "Eerder opgeslagen afspraken, exports en screenshots zijn een aparte kwestie. Een gewijzigde link bewijst niet dat elke oude kopie verdwenen is. Is informatie bij de verkeerde mensen beland, kijk dan naar inhoud en ontvangers; een geslaagde reset bewijst geen volledige verwijdering."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Bepaal of je een accountverbinding, uitnodiging, abonnement of bestand hebt.",
    "Controleer de bronagenda voordat je een adres kopieert.",
    "Gebruik een geheim Google-adres alleen voor je eigen compatibele apps.",
    "Controleer of de ontvangende app zich heeft geabonneerd in plaats van geïmporteerd.",
    "Bevestig urgente wijzigingen bij de organisator in plaats van op verversing te vertrouwen.",
    "Volg bij uitlekken Googles resetinstructies en werk de bedoelde verbindingen bij."
  ],
  "faq": [
    {
      "q": "Kan ik het geheime adres aan een collega geven?",
      "a": "Google adviseert het voor eigen apps te bewaren. Gebruik de deelinstellingen van de agenda als iemand anders toegang nodig heeft en kies de bedoelde rechten."
    },
    {
      "q": "Kan ik via een abonnement het origineel bewerken?",
      "a": "Een geheim Google-iCal-adres is voor bekijken. Bewerken vereist een passende accountverbinding en toestemming; Cloud Calendars-deelrollen zijn een afzonderlijke regeling."
    },
    {
      "q": "Wist een reset overal de oude afspraken?",
      "a": "De reset maakt het oude Google-adres ongeldig. Daarmee is niet vastgesteld dat los opgeslagen bestanden, afspraken of screenshots zijn verwijderd."
    }
  ],
  "sourcesHeading": "Informatie van aanbieders en verdere uitleg",
  "sources": [
    {
      "label": "Google: accountverbindingen en geheime iCal-adressen",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    },
    {
      "label": "Google: een agenda delen",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: importeren, abonneren en verversing",
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
  "title": "Google Agenda-gastrechten: bewerken, uitnodigen en de gastenlijst",
  "short": "Gastrechten voor een afspraak",
  "description": "Controleer gastrechten en standaardinstellingen in Google. Onderscheid uitnodigingsrechten van agendatoegang en Cloud Calendars-rollen.",
  "lede": "Kunnen antwoorden zegt niet alles over wat een gast mag doen. Controleer de rechten voordat je één uitnodiging gebruikt voor een team, klanten of publiek. Deze gids is gepubliceerd door Arte Soft, de ontwikkelaar van Cloud Calendars.",
  "commonBelief": "Gasten zouden alleen kunnen accepteren of weigeren, en elke app zou dezelfde rechteninstellingen tonen.",
  "sections": [
    {
      "heading": "Begin bij de organisator en de oorspronkelijke afspraak",
      "body": [
        "Open de bedoelde afspraak in Google Agenda met het organiserende account of een account dat deze mag beheren. Controleer agenda, datum en organisator voordat je rechten wijzigt. Een afzonderlijk geïmporteerde afspraak is geen betrouwbare plek om de oorspronkelijke uitnodiging te beheren.",
        "Leg voor een teamvergadering vast wie de tijd mag wijzigen, anderen mag uitnodigen en deelnemers mag zien. Dit zijn aparte beslissingen. Een gast die moet deelnemen, hoeft de vergadering niet te beheren."
      ]
    },
    {
      "heading": "Bepaal of gasten de vergadering mogen wijzigen",
      "body": [
        "Google beschrijft in de computereditor onder de gastrechten een optie om de afspraak te wijzigen. Dat is een brede samenwerkingsbevoegdheid, niet slechts een voorstel voor een ander tijdstip. Volgens Google omvat dit velden bewerken, gasten bekijken en ruimtes boeken.",
        "Een vertrouwde medeorganisator van een workshop kan die ruimte nodig hebben; een klant met een afspraak mogelijk niet. Kies op basis van verantwoordelijkheid en controleer de opgeslagen afspraak. Vertrouw niet op de inrichting van een andere vergadering."
      ]
    },
    {
      "heading": "Controleer uitnodigen en zichtbaarheid afzonderlijk",
      "body": [
        "Google onderscheidt anderen uitnodigen van andere gasten zien. Controleer beide naast bewerkingsrechten. Eén mogelijkheid uitschakelen betekent niet dat je de andere hebt gecontroleerd. Een getoonde standaardinstelling bewijst niets over een bestaande afspraak.",
        "Overweeg bij losstaande klanten of één gezamenlijke uitnodiging überhaupt geschikt is. Informatie in een e-mail, omschrijving of doorgestuurd bericht valt buiten de huidige gastenlijstinstelling. Zet geen vertrouwelijke deelnemersgegevens in de omschrijving in de verwachting dat een verborgen lijst ze verbergt."
      ]
    },
    {
      "heading": "Controleer standaardinstellingen én belangrijke afspraken",
      "body": [
        "Google beschrijft ook standaardgastrechten in de afspraakinstellingen, waaronder een standaard voor wijzigen. Het is dus niet uitsluitend een instelling per afspraak. Bekijk de standaardinstellingen wanneer je manier van plannen verandert en controleer belangrijke bestaande uitnodigingen apart.",
        "Controleer bij herhaling of je één afspraak of de reeks wijzigt. Neem niet aan dat een voorkeur oudere uitnodigingen heeft herschreven. Test met een collega aan een afgesproken, niet-gevoelig voorbeeld, niet door een echte klantafspraak te verplaatsen of annuleren."
      ]
    },
    {
      "heading": "Houd Cloud Calendars-rollen afzonderlijk",
      "body": [
        "Cloud Calendars heeft eigen Reader-, Writer- en Owner-rollen. Reader biedt bekijken en synchroniseren; Writer mag bewerken; Owner beheert ook delen en toegang met de uitgenodigde identiteit. Deze rollen zijn geen schakelaars voor Googles drie gastrechten.",
        "Controleer bij Google-specifieke rechten de oorspronkelijke afspraak in Google Agenda. Een deelnemer zien in Cloud Calendars bewijst niet dat je daar elke Google-instelling kunt wijzigen. Houd aanbieder en identiteit duidelijk bij ontbrekende knoppen of mislukte wijzigingen."
      ]
    },
    {
      "heading": "Controleer het resultaat en spreek verantwoordelijkheid af",
      "body": [
        "Open na opslaan de oorspronkelijke afspraak opnieuw en controleer de instellingen. Laat waar passend een bevoegde collega vanuit het eigen account bevestigen wat mogelijk is. Deel geen wachtwoorden of privégegevens van gasten als snelle toegangstest.",
        "Houd aanwezigheid apart van rechten. Kunnen bewerken, een geïmporteerde kopie hebben en een vastgelegde acceptatie zijn verschillende feiten. Een ontvangstregistratie bij delen in Cloud Calendars is geen RSVP. Vraag bij belangrijke vergaderingen expliciet om aanwezigheid en benoem wie wijzigingen beheert."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identificeer het organiserende account en de oorspronkelijke afspraak.",
    "Bepaal wie mag beheren, anderen uitnodigen en gasten zien.",
    "Controleer de werkelijke gastrechten van de Google-afspraak.",
    "Bekijk standaardinstellingen zonder aan te nemen dat ze bestaande afspraken wijzigen.",
    "Behandel Cloud Calendars-rollen als een afzonderlijk rechtensysteem.",
    "Open de opgeslagen afspraak opnieuw en bevestig aanwezigheid apart."
  ],
  "faq": [
    {
      "q": "Kan een gast mijn vergadertijd wijzigen?",
      "a": "Google kan wijzigingsrechten geven. Controleer de afspraak en de toegang van de gast; leid dit niet af uit het ontvangen van een uitnodiging."
    },
    {
      "q": "Stel je alle gastrechten alleen per afspraak in?",
      "a": "Nee. Google documenteert ook standaardgastrechten. Controleer deze voor toekomstige planning en bekijk belangrijke bestaande afspraken zelf."
    },
    {
      "q": "Verwijdert een verborgen gastenlijst eerder verzonden informatie?",
      "a": "Dat bewijst niet dat eerdere e-mails, omschrijvingen, screenshots of onafhankelijke kopieën zijn verwijderd. Controleer apart wat daadwerkelijk is verspreid."
    }
  ],
  "sourcesHeading": "Informatie van aanbieders en verdere uitleg",
  "sources": [
    {
      "label": "Google: samenwerken aan afspraken en standaardgastrechten",
      "url": "https://support.google.com/a/users/answer/13293412?hl=en"
    },
    {
      "label": "Google: velden voor gastrechten bij afspraken",
      "url": "https://developers.google.com/workspace/calendar/api/v3/reference/events"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "sharing-one-event-not-your-calendar",
    "why-a-shared-calendar-does-not-appear"
  ],
  "updated": "2026-10-21"
},

  'google-calendars-that-never-reach-your-iphone': {
  "title": "Een Google-agenda ontbreekt op iPhone: controleer verbinding en selectie",
  "short": "Google-agenda’s ontbreken op iPhone",
  "description": "Zoek een ontbrekende Google-agenda door toegang, zichtbaarheid en de verbinding van Apple Agenda of Cloud Calendars te controleren.",
  "lede": "Verschijnt de ene Google-agenda wel en de andere niet? Bepaal eerst waar de ontbrekende agenda beschikbaar is. Accounttoegang, agendaselectie en beschikbare afspraken zijn verschillende controles. Deze gids is gepubliceerd door Arte Soft, de ontwikkelaar van Cloud Calendars.",
  "commonBelief": "Elke ontbrekende Google-agenda komt door één verborgen synchronisatielijst, en rechtstreeks verbinden garandeert dat alles verschijnt.",
  "sections": [
    {
      "heading": "Controleer of deze account toegang heeft tot de agenda",
      "body": [
        "Open Google Agenda op het web met dezelfde account die je op je telefoon wilt gebruiken. Zoek de agenda zelf, niet alleen een bekende afspraaktitel. Twee accounts kunnen agenda’s met vergelijkbare namen hebben. Een uitnodiging aan je werkadres bewijst geen toegang voor je privéaccount.",
        "Ontbreekt de agenda daar ook, begin dan bij de eigenaar of de deeluitnodiging. Controleer bij toegang via een groep je lidmaatschap en welke groep toestemming heeft gekregen. Verwijder de account niet van je telefoon zolang de toegangsvraag onopgelost is."
      ]
    },
    {
      "heading": "Maak onderscheid tussen verborgen en ontbrekend",
      "body": [
        "Google beschrijft hoe je in het menu van de Google Agenda-app agenda’s voor weergave selecteert. Een vermelde maar niet aangevinkte agenda betreft zichtbaarheid. Ontbreekt hij in de lijst, onderzoek dan bijvoorbeeld de uitgenodigde identiteit, goedkeuring of verbinding.",
        "Een deeluitnodiging per e-mail en een abonnementsadres zijn ook verschillende routes. Google beschrijft een nieuw abonnement toevoegen via een computerbrowser apart van het openen van een al per e-mail gedeelde agenda. Bewaar de oorspronkelijke uitnodiging, maar plaats privélinks niet in openbare hulpvragen."
      ]
    },
    {
      "heading": "Bepaal hoe deze iPhone-app Google-gegevens ontvangt",
      "body": [
        "Apple Agenda kan verbinden via de Google-account die op het apparaat is ingesteld. Volgens Google moet Agenda’s voor die account ingeschakeld zijn. Volg de actuele instructies voor jouw iOS-versie; instellingen in een afzonderlijke app wijzigen is iets anders dan deze apparaataccount aanpassen.",
        "Cloud Calendars biedt ook rechtstreeks aanmelden bij Google. Stel vast welke account en route je werkelijk gebruikt voordat je nog een verbinding toevoegt. Komt dezelfde agenda via zowel het apparaat als een directe verbinding binnen, vergelijk dan de agenda-identiteiten voordat je concludeert dat Google een afspraak heeft gedupliceerd."
      ]
    },
    {
      "heading": "Controleer de selectie in Cloud Calendars zonder volledige dekking aan te nemen",
      "body": [
        "Bekijk in Cloud Calendars de agenda’s van de bedoelde Google-account en selecteer wat je wilt gebruiken. De Google-synchronisatie controleert de agendaselectie. Succesvol aanmelden bewijst niet dat elke agenda geselecteerd is of elke aangevraagde update is afgerond.",
        "Een directe verbinding is een andere manier om Google-gegevens te ontvangen, geen belofte dat elke toegankelijke agenda verschijnt. Staat een agenda op Googles website maar niet in Cloud Calendars, noteer dan account, agendanaam en verbindingsmethode voor ondersteuning. Gebruik bij urgente afspraken de oorspronkelijke dienst terwijl het verschil wordt onderzocht."
      ]
    },
    {
      "heading": "Onderscheid een ontbrekende agenda van ontbrekende datums",
      "body": [
        "Staat de agenda in de lijst maar ontbreekt een afspraak, vergelijk dan die exacte datum in Google Agenda. Controleer of de afspraak bij de geselecteerde agenda hoort en of je dezelfde herhaling bekijkt. Een vergelijkbare titel in een andere agenda is niet hetzelfde bronrecord.",
        "Neem niet aan dat een app alle oude of ver toekomstige afspraken heeft opgehaald. De Google-synchronisatie van Cloud Calendars gebruikt een begrensde datumaanvraag. Een lege zoekopdracht in het verleden bewijst dus geen verwijdering bij Google. Controleer de oorspronkelijke dienst voordat je iets wijzigt of opnieuw maakt."
      ]
    },
    {
      "heading": "Vraag hulp met een bruikbare vergelijking, niet met een reset",
      "body": [
        "Noteer app, accounttype, agendanaam, voorbeelddatum en waar de agenda zichtbaar is. Voeg een eventuele foutmelding toe nadat je privégegevens hebt verwijderd. Zo onderscheid je rechten, selectie en synchronisatie beter dan met de melding dat de hele account kapot is.",
        "Bevestig bij tijdkritische plannen de actuele afspraak met de organisator. Begin niet met accounts verwijderen, herhaaldelijk kopieën importeren of afspraken tussen agenda’s verplaatsen. Controleer na het vaststellen van het verbindingsprobleem hetzelfde voorbeeld voordat je verdere instellingen wijzigt."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Vergelijk de bedoelde account en agenda in Google Agenda op het web.",
    "Controleer of de agenda ontbreekt of alleen niet geselecteerd is.",
    "Bepaal of je apparaatsynchronisatie, een directe appverbinding of een abonnement gebruikt.",
    "Controleer de geselecteerde agenda’s van de bedoelde account in Cloud Calendars.",
    "Vergelijk één exacte afspraakdatum bij de oorspronkelijke dienst.",
    "Meld het verschil zonder privé-adressen te delen of accounts te resetten."
  ],
  "faq": [
    {
      "q": "Toont rechtstreeks aanmelden bij Google elke agenda?",
      "a": "Ga niet uit van volledige dekking. Account, agendalijst, selectie en geslaagde synchronisatie tellen allemaal mee. Vergelijk een ontbrekende agenda met Google Agenda op het web."
    },
    {
      "q": "Moet ik de account verwijderen en opnieuw toevoegen?",
      "a": "Controleer eerst identiteit, toegang, zichtbaarheid en verbindingsroute. Opnieuw verbinden verleent geen toestemming die de eigenaar niet heeft gegeven."
    },
    {
      "q": "Betekent een ontbrekende oude afspraak dat deze is verwijderd?",
      "a": "Nee. Controleer de oorspronkelijke Google-agenda en datum. Het beschikbare datumbereik of zoekgedrag van een app kan afwijken van de opgeslagen geschiedenis bij de dienst."
    }
  ],
  "sourcesHeading": "Instructies van de aanbieders en verder lezen",
  "sources": [
    {
      "label": "Google: Google-afspraken toevoegen aan Apple Agenda",
      "url": "https://support.google.com/calendar/answer/99358?hl=en&co=GENIE.Platform%3DiOS"
    },
    {
      "label": "Google: abonnementen en zichtbaarheid van agenda’s",
      "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
    },
    {
      "label": "Google: werking van de agendalijst",
      "url": "https://developers.google.com/workspace/calendar/api/v3/reference/calendarList/list"
    }
  ],
  "seeAlso": [
    "why-a-shared-calendar-does-not-appear",
    "icloud-google-and-outlook-in-one-view",
    "the-secret-address-of-a-google-calendar"
  ],
  "updated": "2026-10-21"
},

  'taking-back-a-calendar-you-shared': {
  "title": "Stoppen met een agenda delen: verwijder toegang en controleer andere routes",
  "short": "Gedeelde toegang controleren en intrekken",
  "description": "Stop met delen en houd personen, groepen, openbare toegang en feedlinks uit elkaar. Controleer het resultaat; eerder opgeslagen kopieën kunnen blijven bestaan.",
  "lede": "Een samenwerking beëindigen begint met vaststellen hoe toegang is verleend. Een persoon verwijderen, publicatie stoppen en een feedadres vernieuwen zijn verschillende handelingen. Deze gids is gepubliceerd door Arte Soft, de ontwikkelaar van Cloud Calendars.",
  "commonBelief": "Eén ontvanger verwijderen zou direct alle agendakopieën terughalen en elke andere toegangsroute afsluiten.",
  "sections": [
    {
      "heading": "Bepaal de agenda en de deelroute",
      "body": [
        "Controleer het account van de eigenaar, de agenda en het bedoelde publiek voordat je toegang wijzigt. Een Google-agenda delen met een genoemde collega verschilt van openbare publicatie, groepstoegang of een abonnementsadres. Cloud Calendars heeft ook eigen deelrelaties voor afspraken en agenda’s.",
        "Een verenigingssecretaris kan bijvoorbeeld via een persoonlijke uitnodiging bewerkingsrechten hebben, terwijl leden een gepubliceerd rooster volgen. De toegang van de secretaris verwijderen bepaalt niet wat met de abonnementen van leden moet gebeuren. Maak een overzicht van de regelingen die je werkelijk hebt ingesteld."
      ]
    },
    {
      "heading": "Verwijder de bedoelde Google-toegang",
      "body": [
        "Google beschrijft afzonderlijke instellingen voor personen of groepen, delen met de organisatie en openbare beschikbaarheid. Open op een computer de deelinstellingen van de juiste agenda en wijzig de betreffende vermelding of bredere instelling. Controleer eerst account en agendanaam.",
        "Iemand kan nog via een groep of bredere publicatie toegang hebben. Controleer de hele inrichting in plaats van steeds hetzelfde e-mailadres te verwijderen. Werk- of schoolbeleid kan de beschikbare instellingen beperken; volg zo nodig de goedgekeurde procedure van eigenaar of beheerder."
      ]
    },
    {
      "heading": "Behandel een geheim agenda-adres afzonderlijk",
      "body": [
        "Volgens Google is het geheime iCal-adres bedoeld voor eigen gebruik in een andere agenda-app en mag je het niet aan anderen geven. Bij uitlekken beschrijft Google hoe je het opnieuw instelt om het oude adres ongeldig te maken. Dat is iets anders dan een genoemde persoon verwijderen.",
        "Bepaal vóór het wijzigen van je eigen abonnementsadres welke agenda-apps of hulpmiddelen ervan afhangen, zodat je de bedoelde verbindingen kunt herstellen. Plaats de geheime URL niet in openbare supportberichten of als bewijs dat je de juiste agenda hebt gevonden. Noem de agenda en het verbindingstype."
      ]
    },
    {
      "heading": "Maak onderscheid tussen Cloud Calendars-ontvangers en feedlinks",
      "body": [
        "Toegang voor ontvangers van afspraken of agenda’s en een uitgegeven abonnementsfeed zijn in Cloud Calendars verschillende mechanismen. Controleer de daadwerkelijke deelrelatie en de betrokken link voordat je een actie kiest. Een geïdentificeerde ontvanger verwijderen garandeert niet dat alle verspreide URL’s of onafhankelijke kopieën zijn teruggehaald.",
        "Moet een medeorganisator alleen stoppen met bewerken, bekijk dan de gewenste rol en overige gebruikers in plaats van het gedeelde rooster te verwijderen. Eindigt de hele samenwerking, bepaal dan wie eigenaar is en wie de agenda moet behouden. Een ontvangen agenda verlaten en je eigen agenda verwijderen zijn verschillende beslissingen."
      ]
    },
    {
      "heading": "Controleer het resultaat zonder directe verdwijning te beloven",
      "body": [
        "Controleer of de wijziging is opgeslagen in het systeem dat de agenda beheert. Kan een bevoegde collega helpen, laat die vanuit het eigen account de weergave of bewerking controleren zonder wachtwoorden te delen. Maak onderscheid tussen geweigerde toegang en oude afspraken in een cache of geïmporteerde kopie.",
        "Beloof geen universeel verversingsinterval en ook niet dat er geen melding komt. Vertel bij overdracht welk rooster voortaan geldt. Een zichtbaar oud item bewijst op zichzelf niet of iemand nog live toegang heeft, een andere toestemming heeft of een losse kopie bewaart."
      ]
    },
    {
      "heading": "Bespreek eerdere kopieën afzonderlijk",
      "body": [
        "Geëxporteerde bestanden, screenshots, berichten en zelfstandig opgeslagen afspraken kunnen na de wijziging blijven bestaan. Bepaal welke kopieën belangrijk zijn voor de overdracht en bespreek de afhandeling met betrokkenen. Een agendarecht wijzigen toont niet wat elke ontvanger al heeft opgeslagen.",
        "Bewaar noodzakelijke brongegevens terwijl je het resultaat controleert. Verplaats gevoelige afspraken niet naar een andere gedeelde agenda om de oude leeg te laten lijken en annuleer geen echte uitnodigingen als toegangstest. Noteer agenda, route en wijziging als uitgangspunt voor later onderzoek."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Bepaal het eigenaarsaccount, de agenda en de deelroute.",
    "Controleer personen, groepen en bredere publicatie afzonderlijk.",
    "Gebruik de juiste deelinstellingen van Google of Cloud Calendars.",
    "Behandel een uitgelekt geheim feedadres als een aparte resetbeslissing.",
    "Controleer de opgeslagen toegangsrechten zonder inloggegevens te delen.",
    "Behandel eerdere exports en kopieën afzonderlijk van live toegang."
  ],
  "faq": [
    {
      "q": "Schakelt één persoon verwijderen ook openbare toegang of diens groepstoegang uit?",
      "a": "Ga daar niet van uit. Controleer elke werkelijke route. Google beschrijft personen, groepen en bredere publicatie als afzonderlijke instellingen."
    },
    {
      "q": "Verdwijnt de agenda onmiddellijk en zonder melding?",
      "a": "Daarvoor geldt geen universele belofte over verdwijnen, meldingen of verversing. Controleer de opgeslagen wijziging en onderscheid live toegang van gecachete of geïmporteerde informatie."
    },
    {
      "q": "Koop ik met Advanced de mogelijkheid Google-agendatoegang te verwijderen?",
      "a": "Advanced verwijdert advertenties in Cloud Calendars. Google-deelinstellingen hangen af van eigendom, rechten en organisatieregels, niet van dat app-abonnement."
    }
  ],
  "sourcesHeading": "Informatie over toegang en abonnementen bij de aanbieder",
  "sources": [
    {
      "label": "Google: deelinstellingen en toegang beëindigen",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Google: accountsynchronisatie en geheime iCal-adressen",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "the-secret-address-of-a-google-calendar",
    "why-a-shared-calendar-does-not-appear"
  ],
  "updated": "2026-10-21"
},
};
