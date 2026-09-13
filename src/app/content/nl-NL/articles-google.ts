import { LocalisedArticle } from '../types';

/** De zes Google-artikelen: concrete vragen, heldere antwoorden. */
export const GOOGLE_NL_NL: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
    title: 'Wie ziet wat als je een Google-agenda deelt',
    short: 'Google-deelrechten',
    description:
      'De deelniveaus van Google zijn snel ingesteld en makkelijk verkeerd begrepen. Wat elk niveau werkelijk prijsgeeft, in gewone woorden.',
    lede: 'Bijna niemand deelt te veel door een beoordelingsfout. Iemand koos een niveau dat bescheiden klonk en dat niet was.',
    commonBelief: 'Dat «alleen vrij/bezet» en «alle afspraakgegevens» weinig schelen.',
    sections: [
      {
        heading: 'De niveaus liggen verder uit elkaar dan ze klinken',
        body: [
          'Vrij/bezet toont blokken tijd zonder titels. Alle gegevens toont titels, locaties, notities en gasten — bij de meeste agenda’s dus een flink deel van je leven.',
          'Wijzigingen aanbrengen geeft bewerkrechten. Delen beheren geeft iemand het recht jouw agenda aan anderen door te geven, en dat is het niveau dat later verrast.',
        ],
      },
      {
        heading: 'Kiezen zonder er elke keer over na te denken',
        body: [
          'Voor collega’s die alleen om je heen moeten plannen is vrij/bezet vrijwel altijd het juiste antwoord en vrijwel nooit het gekozene.',
          'Bewaar volledige gegevens voor agenda’s die zijn gemaakt om te delen, niet voor die waarin je leeft.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Maandprijs van het niveau waarin dit in de app wordt beheerd, in dollars',
    },
    faq: [
      {
        q: 'Zijn mijn afspraaktitels zichtbaar als ik alleen vrij/bezet deel?',
        a: 'Nee. Vrij/bezet toont blokken tijd zonder titels, locaties, notities of gasten. Alleen «alle afspraakgegevens» legt die bloot — en dan allemaal.',
      },
      {
        q: 'Wat mag iemand met «wijzigingen aanbrengen en delen beheren»?',
        a: 'Elke afspraak bewerken én jouw agenda doorgeven aan anderen zonder het te vragen. Het is het enige niveau waarop iemand anders toegang kan uitdelen.',
      },
      {
        q: 'Kan ik zien wie al toegang heeft tot mijn agenda?',
        a: 'Ja, in de deelinstellingen van die agenda. Niets nodigt je uit om te kijken en delen stapelt zich alleen op: lees de lijst twee keer per jaar.',
      },
    ],
    practical: [
      'Standaard vrij/bezet voor iedereen die alleen tijd bij je hoeft te boeken.',
      'Houd «wijzigingen aanbrengen» voor mensen die echt voor je plannen.',
      'Kijk twee keer per jaar wie toegang heeft: delen stapelt zich op en niets herinnert je eraan.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'what-guests-can-do-to-your-event'],
  },

  'why-a-shared-calendar-does-not-appear': {
    title: 'Een agenda is met je gedeeld en hij staat er niet',
    short: 'Gedeelde agenda verschijnt niet',
    description:
      'Iemand deelde een agenda, je accepteerde, en er veranderde niets. De vier gewone oorzaken, in de volgorde die loont.',
    lede: 'De uitnodiging kwam, de link is aangetikt en de agenda ontbreekt nog steeds. Bijna altijd is het een van vier dingen, en geen daarvan is kapot delen.',
    commonBelief: 'Dat accepteren een gedeelde agenda op je telefoon zet.',
    sections: [
      {
        heading: 'Accepteren voegt hem toe aan een account, niet aan een apparaat',
        body: [
          'Een gedeelde agenda landt in het Google-account waaraan hij gericht was. Accepteerde je met het ene account en draagt je telefoon het andere, dan staat de agenda veilig precies daar waar je niet kijkt.',
          'Zelfs in het juiste account komt een nieuw toegevoegde agenda op andere apparaten vaker uitgeschakeld dan ingeschakeld binnen. Hij bestaat, hij is alleen niet aangevinkt — en een niet-aangevinkte agenda ziet er precies zo uit als een ontbrekende.',
        ],
      },
      {
        heading: 'De andere twee oorzaken',
        body: [
          'Delen met een mailinglijst of groepsadres bereikt zelden personen; nodig is het adres dat werkelijk een Google-account is. En een agenda die als link wordt gedeeld is een abonnement: hij belandt elders in de lijst en ververst op het ritme van de uitgever in plaats van meteen.',
          'Op de iPhone bereiken Google-agenda’s de ingebouwde app via een eigen synchronisatielijst, en secundaire agenda’s staan daar standaard buiten. Daarom toont één account zijn hoofdagenda en laat het de vier die ertoe doen stilletjes vallen.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Uren tussen verversingsverzoeken van een geabonneerde feed',
      accounts: 'Soorten accounts die één overzicht bijeenhoudt, zonder dit alles',
    },
    faq: [
      {
        q: 'Ik heb een gedeelde agenda geaccepteerd maar hij staat niet op mijn iPhone. Waarom?',
        a: 'De deling landt in het Google-account waaraan hij was gericht, en een net toegevoegde agenda komt op andere apparaten meestal uitgeschakeld binnen. Kijk eerst naar het account en zoek hem daarna niet-aangevinkt in plaats van afwezig.',
      },
      {
        q: 'Werkt delen met een groepsadres?',
        a: 'Zelden. Een mailinglijst bereikt de mensen erachter nauwelijks. Nodig is het adres dat zelf een Google-account is.',
      },
      {
        q: 'Hoe lang duurt het voordat een gedeelde agenda verschijnt?',
        a: 'Een deling via rechten verschijnt zodra de lijst ververst. Een als link gedeelde agenda is een abonnement en volgt het ritme van de uitgever.',
      },
    ],
    practical: [
      'Kijk eerst welk account de deling heeft geaccepteerd, daarna pas naar de rest.',
      'Open de agendalijst op het apparaat en zoek hem uitgeschakeld in plaats van afwezig.',
      'Kwam hij als link, reken dan op vertraging in plaats van directe verschijning.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'google-calendars-that-never-reach-your-iphone'],
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
