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
    practical: [
      'Lees de volledige toegangslijst, niet alleen de naam die je wilde verwijderen.',
      'Stel het geheime adres opnieuw in als die persoon het ooit had.',
      'Ga ervan uit dat kopieën blijven: verplaats wat echt gevoelig is in plaats van het te verbergen.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
