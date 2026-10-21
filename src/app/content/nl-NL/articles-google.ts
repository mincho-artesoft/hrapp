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
    title: 'Wat je gasten met een afspraak kunnen doen',
    short: 'Rechten van gasten',
    description:
      'Drie vinkjes bepalen of een gast je vergadering kan verzetten, vreemden kan uitnodigen of de hele lijst kan lezen. Ze staan vaker aan dan mensen denken.',
    lede: 'Iemand uitnodigen geeft meer dan een plaats en een tijd. In een gewone Google-afspraak ziet een gast doorgaans wie er nog meer gevraagd is, en mag hij er vaak mensen bij zetten.',
    commonBelief: 'Dat een gast alleen kan accepteren of weigeren.',
    sections: [
      {
        heading: 'De drie vinkjes',
        body: [
          'Afspraak wijzigen laat een gast tijd, plaats en titel voor iedereen veranderen. Zelden gewenst, makkelijk aan gelaten.',
          'Anderen uitnodigen laat een gast mensen toevoegen die jij nooit hebt ontmoet. Gastenlijst zien toont iedereen die gevraagd is en hun antwoord — prima in een team, ongemakkelijk bij een klant, fout bij alles wat lijkt op een groep losse klanten.',
        ],
      },
      {
        heading: 'Waar het stil misgaat',
        body: [
          'Eén afspraak, veel losse ontvangers, zichtbare lijst: nu heeft iedereen iedereen. Dat ene vinkje is het verschil tussen een vergadering en een gelekt adresboek.',
          'De instellingen horen bij de afspraak, niet bij het account: ze vallen elke keer terug op je standaard en moeten worden bedacht bij de afspraken die ertoe doen, niet één keer.',
        ],
      },
    ],
    claims: {
      sharePrice: 'Wat het versturen van één afspraak uit de app kost',
    },
    faq: [
      {
        q: 'Zien gasten elkaar bij een uitnodiging in Google Agenda?',
        a: 'Standaard meestal wel. «Gastenlijst zien» toont iedereen die is uitgenodigd en hun antwoord: prima in een team, ongemakkelijk bij een klant, fout wanneer de gasten losse klanten zijn.',
      },
      {
        q: 'Kan een gast de tijd van mijn vergadering wijzigen?',
        a: 'Als «afspraak wijzigen» aan staat wel, en de wijziging geldt voor iedereen. Zelden gewenst en makkelijk aan gelaten.',
      },
      {
        q: 'Hoe voorkom ik dat gasten anderen uitnodigen?',
        a: 'Zet «anderen uitnodigen» uit op de afspraak zelf. Deze instellingen horen bij de afspraak en niet bij het account, dus ze vallen elke keer terug op je standaard.',
      },
    ],
    practical: [
      'Zet «gastenlijst zien» uit bij alles dat naar mensen gaat die elkaar niet kennen.',
      'Laat «afspraak wijzigen» uit, tenzij iemand echt voor je plant.',
      'Controleer de vinkjes op de afspraak, niet in je instellingen: daar horen ze thuis.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'why-a-shared-calendar-does-not-appear'],
  },

  'google-calendars-that-never-reach-your-iphone': {
    title: 'Waarom sommige Google-agenda’s je iPhone nooit bereiken',
    short: 'Google-agenda’s ontbreken op iPhone',
    description:
      'Eén Google-account, meerdere agenda’s en maar één op de telefoon. De synchronisatielijst die dat bepaalt, en wat je in plaats daarvan doet.',
    lede: 'Je Google-account bevat acht agenda’s. Je iPhone toont er twee. Er is niets kapot: iets dat je nooit hebt gezien koos voor jou.',
    commonBelief: 'Dat een Google-account toevoegen op de iPhone ook zijn agenda’s toevoegt.',
    sections: [
      {
        heading: 'Een lijst die je nooit is getoond',
        body: [
          'Google houdt per apparaat een lijst bij van welke agenda’s mogen synchroniseren, en secundaire agenda’s — de gedeelde, de geabonneerde, die iemand voor een project maakte — staan daar vaak buiten.',
          'Die lijst staat niet in de iOS-instellingen. Hij leeft op een eigen Google-pagina; daarom vind je op de voor de hand liggende plek niets fout en verandert er niets.',
        ],
      },
      {
        heading: 'De andere route',
        body: [
          'Een app die rechtstreeks met Google praat gebruikt die lijst niet, dus toont hij elke agenda die het account werkelijk heeft, ook die de telefoon stil liet vallen.',
          'Dat brengt ook de accounts bij elkaar. Eén overzicht met privé, werk en gedeeld is het punt; of de telefoon elk ervan zou hebben gesynchroniseerd is dan geen vraag meer.',
        ],
      },
    ],
    claims: {
      accounts: 'Soorten accounts die één overzicht bijeenhoudt',
      price: 'Wat de Google-kant kost',
    },
    faq: [
      {
        q: 'Waarom verschijnen maar sommige van mijn Google-agenda’s op de iPhone?',
        a: 'Google houdt per apparaat een lijst bij van welke agenda’s mogen synchroniseren, en secundaire agenda’s — gedeelde, geabonneerde, voor een project gemaakte — staan daar vaak buiten.',
      },
      {
        q: 'Waar staat de synchronisatie-instelling voor Google Agenda op de iPhone?',
        a: 'Niet in de iOS-instellingen. Ze staat op een eigen Google-pagina, en daarom vindt zoeken op de voor de hand liggende plek niets en verandert er niets.',
      },
      {
        q: 'Hoe zie ik al mijn Google-agenda’s op de iPhone?',
        a: 'Via een app die Google rechtstreeks bevraagt in plaats van via de lijst van het apparaat. Die toont elke agenda die het account echt heeft, ook de door de telefoon weggelaten.',
      },
    ],
    practical: [
      'Kijk in de Google-synchronisatielijst voordat je het account kapot verklaart.',
      'Reken erop dat geabonneerde en gedeelde agenda’s zijn uitgesloten, niet opgenomen.',
      'Houd je meer dan een paar agenda’s bij, lees ze dan via iets dat Google rechtstreeks bevraagt.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'icloud-google-and-outlook-in-one-view'],
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
