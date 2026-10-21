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
    title: 'Wat het geheime adres van een Google-agenda werkelijk weggeeft',
    short: 'Het geheime iCal-adres',
    description:
      'Google biedt een privéadres dat je hele agenda toont aan wie het heeft. Wat het prijsgeeft en waarom je het niet stilletjes terugneemt.',
    lede: 'In de instellingen van elke Google-agenda zit een link die alles erop laat zien. Zonder inloggen, zonder rechten, zonder spoor van wie hem opende.',
    commonBelief: 'Dat een privéadres privé is omdat het moeilijk te vinden is.',
    sections: [
      {
        heading: 'Een link is een wachtwoord dat je niet voor één persoon kunt wijzigen',
        body: [
          'Het geheime adres draagt volledige gegevens — titels, tijden, locaties, notities. Wie de link heeft ziet ze, en er is geen lijst van wie dat is.',
          'De enige bescherming is het willekeurige deel van het adres. Tegen raden helpt dat echt, tegen doorsturen, een gedeeld scherm of een document dat de baan overleeft helemaal niet.',
        ],
      },
      {
        heading: 'Opnieuw instellen breekt hem voor iedereen',
        body: [
          'Je kunt het adres opnieuw instellen; het oude is dan dood. Het is ook dood voor elke collega, elk dashboard en elk script dat er stil op leunde, zonder enige waarschuwing.',
          'Dat is het argument om het adres van de agenda waarin je leeft nooit uit te delen. Publiceer een agenda die daarvoor is gemaakt, en opnieuw instellen kost niets.',
        ],
      },
    ],
    claims: {
      linkLength: 'Willekeurige tekens die een deellink van ons beschermen',
      sharePrice: 'Wat het delen van één afspraak uit de app kost',
    },
    faq: [
      {
        q: 'Wat kan iemand met het geheime adres van mijn agenda?',
        a: 'Alles erop zien — titels, tijden, locaties en notities — zonder inloggen, zonder rechten en zonder dat ergens wordt vastgelegd dat hij heeft gekeken.',
      },
      {
        q: 'Kan ik een geheim agenda-adres terugnemen?',
        a: 'Alleen door het opnieuw in te stellen, en dat doodt het oude voor iedereen tegelijk: collega’s, dashboards en elk script dat er stil op leunde, zonder waarschuwing.',
      },
      {
        q: 'Mag ik het geheime adres naar een collega mailen?',
        a: 'Behandel het als openbaar zodra het je handen verlaat. De enige bescherming is dat het moeilijk te raden is, en doorsturen heft precies dat op.',
      },
    ],
    practical: [
      'Behandel het geheime adres als openbaar zodra het je handen verlaat.',
      'Publiceer nooit het adres van de agenda die je echt gebruikt.',
      'Stel het opnieuw in als iemand vertrekt, en waarschuw wie het daarmee breekt.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'taking-back-a-calendar-you-shared'],
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
    title: 'Een gedeelde agenda weer terugnemen',
    short: 'Toegang intrekken',
    description:
      'Iemand uit een agenda verwijderen stopt wat hierna komt. Wat het niet doet is ongedaan maken wat al gebeurd is.',
    lede: 'Toegang beëindigen is één tik. Beslissen of één tik genoeg is duurt iets langer, want delen laat kopieën achter.',
    commonBelief: 'Dat iemand verwijderen verwijdert wat diegene heeft gezien.',
    sections: [
      {
        heading: 'Wat stopt en wat blijft',
        body: [
          'Verwijder iemand en de agenda verdwijnt uit diens lijst, onmiddellijk en zonder bericht. Toekomstige afspraken bereiken die persoon nooit.',
          'Wat niet terugkomt: uitnodigingen die al binnen zijn, afspraken die naar de eigen agenda zijn gekopieerd, alles wat geëxporteerd is, en alles waarvoor een geheim adres rondging. De toegang eindigt; het geheugen niet.',
        ],
      },
      {
        heading: 'Wat de verwijdering overleeft',
        body: [
          'Had iemand ooit het recht om delen te beheren, dan heeft diegene misschien anderen toegevoegd. Die persoon verwijderen laat die anderen staan — zo raakt een agenda gedeeld met iemand die niemand zich herinnert te hebben uitgenodigd.',
          'Lees dus de hele lijst in plaats van één naam te schrappen, en doe het bij het vertrek, niet maanden later. Niets herinnert je eraan, en delen stapelt zich alleen op.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Maandprijs van het niveau waarin dit wordt beheerd, in dollars',
    },
    faq: [
      {
        q: 'Wist iemand verwijderen ook wat die persoon al heeft gezien?',
        a: 'Nee. Uitnodigingen die hij al heeft, afspraken die naar zijn eigen agenda zijn gekopieerd en alles wat geëxporteerd is blijven bestaan. De toegang eindigt, de kopieën niet.',
      },
      {
        q: 'Krijgt de persoon bericht dat ik de toegang heb ingetrokken?',
        a: 'Nee. De agenda verdwijnt onmiddellijk en zonder melding uit zijn lijst.',
      },
      {
        q: 'Waarom is mijn agenda gedeeld met iemand die ik nooit heb uitgenodigd?',
        a: 'Iemand met het recht om delen te beheren heeft die persoon toegevoegd. Die eerste verwijderen laat iedereen staan die hij toevoegde — daarom lees je de hele lijst en niet één naam.',
      },
    ],
    practical: [
      'Lees de volledige toegangslijst, niet alleen de naam die je wilde verwijderen.',
      'Stel het geheime adres opnieuw in als die persoon het ooit had.',
      'Ga ervan uit dat kopieën blijven: verplaats wat echt gevoelig is in plaats van het te verbergen.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
