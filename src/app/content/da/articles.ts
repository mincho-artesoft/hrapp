import { LocalisedArticle } from '../types';

/**
 * The four articles this language carries.
 *
 * Chosen one per intent -- weather, one view, sharing, price -- so the language
 * answers a whole question rather than a quarter of four. The numbers are not
 * here: they live once in article-facts.ts and join the prose by id, so a
 * translation can rewrite every sentence without touching a figure.
 */
export const ARTICLES_DA: Readonly<Record<string, LocalisedArticle>> = {
  'weather-inside-your-calendar': {
    title: 'En kalender, der allerede har vejret i sig',
    short: 'Vejret inde i kalenderen',
    description:
      'Hvorfor to apps til at planlægge en dag er en designfejl, og hvordan en kalender ser ud, hvor udsigten er en del af visningen i stedet for at stå ved siden af.',
    lede: 'Næsten alle planlægger deres dag mellem to apps. Kalenderen siger, hvor man skal være; vejrappen siger, hvordan vejret er, når man når frem. At holde de to ting sammen i hovedet er den del, ingen bemærker, de gør — indtil en lørdag går tabt.',
    commonBelief:
      'At en kalender er til aftaler og en vejrapp er til vejret, og at holde dem adskilt simpelthen er sådan, telefoner fungerer.',
    sections: [
      {
        heading: 'Prisen for to apps er ikke to tryk',
        body: [
          'At skifte koster ingenting. Det dyre er, at de to aldrig er enige om, hvad der betyder noget. Din kalender ved, at der lørdag klokken elleve er to timer optaget; vejrappen ved, at det regner fra ti til et. Ingen af dem ved, at de to kendsgerninger tilsammen betyder, at blokken skal flyttes.',
          'Integrationslaget er dig. Det virker, indtil du har travlt, hvilket er præcis når det er mest værd at beskytte sine planer.',
        ],
      },
      {
        heading: 'Hvad der ændrer sig, når udsigten ligger i gitteret',
        body: [
          'Læg udsigten bag begivenhederne, så løser konflikten sig selv. En fugtig formiddag og en tør eftermiddag ses i samme øjekast som det møde, du skulle lægge ind, og beslutningen holder op med at koste tænkning.',
          'Det er ikke en widget klistret ved siden af. Hver dag i uge- og månedsvisningen bærer sine egne forhold, og hver begivenhed bærer udsigten for de timer, den faktisk fylder — ikke dagsopsummeringen, som netop midler den del, du havde brug for.',
        ],
      },
    ],
    claims: {
      forecastDays: 'Døgns udsigt, i kalenderen og ved siden af hver begivenhed',
      views: 'Visninger med vejret: Dag, Uge, Måned, År og Liste',
      price: 'Hvad vejrfunktionerne koster',
    },
    practical: [
      'Se på båndet bag dagene i ugevisningen, før du lægger noget udendørs ind.',
      'Tryk på en begivenhed for at se udsigten for dens timer, ikke for dens dag.',
      'Læg vejrafhængige ting først op mod de fjorten døgn, og finjustér to dage før.',
      'Behandl alt ud over dag syv som en form, ikke som en plan.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'what-a-subscription-actually-buys'],
  },

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google og Outlook i én visning',
    short: 'Tre konti, én visning',
    description:
      'Næsten alles liv er delt mellem en privat Apple-kalender, en Google-konto og et Exchange fra arbejdet. Hvad der ændrer sig, når de havner i samme gitter.',
    lede: 'Problemet er næsten aldrig, at en af kalenderne er dårlig. Det er, at du har tre og kun én uge.',
    commonBelief: 'At holde arbejde og privatliv i hver sin app er en grænse og ikke en mangel.',
    sections: [
      {
        heading: 'Dobbeltbooking er strukturelt',
        body: [
          'Hvis dine aftaler bor tre steder, kan intet sted fortælle dig, om du er ledig. Sammenfletningstrinnet er dig, og du kører det efter hukommelsen, som regel mens nogen venter på svar.',
          'Derfor er den klassiske fejl ikke at glemme en begivenhed; det er at sige ja til noget, der støder sammen med en begivenhed, du ikke kunne se.',
        ],
      },
      {
        heading: 'Hvad ét gitter giver',
        body: [
          'Alle konti i samme uge, farvet efter oprindelse, redigerbare på stedet. Du holder op med at spekulere på, hvilken app der har svaret, fordi spørgsmålet holder op med at være i flertal.',
          'iCloud og Google synkroniserer i gratisversionen. Microsoft-konti — Outlook og Exchange — hører til den betalte, fordi den forbindelse har en løbende omkostning, de andre ikke har.',
        ],
      },
    ],
    claims: {
      accounts: 'Kontotyper, der kan være i én visning',
      premiumMonthly: 'Månedspris for at lægge Microsoft til, i dollar',
    },
    practical: [
      'Læg privatkontoen ind først og derefter den, der forårsager sammenstødene.',
      'Farv efter konto og ikke efter kategori: det er oprindelsen, du skal se med det samme.',
      'Bliv ved med at skrive i den kalender, andre allerede læser.',
    ],
    seeAlso: ['weather-inside-your-calendar', 'what-a-subscription-actually-buys'],
  },

  'sharing-one-event-not-your-calendar': {
    title: 'Del én begivenhed, ikke din kalender',
    short: 'Del én begivenhed',
    description:
      'Hvordan det foregår at sende en enkelt begivenhed, hvad modtageren rent faktisk får, og hvorfor vedkommende ikke behøver installere noget for at se den.',
    lede: 'At dele en kalender er som regel alt eller intet: enten har nogen adgang til din, eller også har de ikke. At sende en middag burde ikke kræve nogen af delene.',
    commonBelief:
      'At det at dele en begivenhed betyder at give nogen et vindue til resten af din uge.',
    sections: [
      {
        heading: 'Hvad der faktisk sendes',
        body: [
          'Når du opretter en begivenhed, tilbyder appen at dele den. Det, der rejser, er et link — via mail, besked, hvad modtageren nu har — og bag det link ligger et kalenderfeed, som indeholder den begivenhed og intet andet.',
          'Det er hverken et skærmbillede eller en kopi, der bliver gammel. Ændres tidspunktet, ændres feedet med det, og den, du sendte til, ser ændringen, uden at du sender noget igen.',
        ],
      },
      {
        heading: 'Hvad det ikke er',
        body: [
          'Linket er et ganske almindeligt kalenderabonnement: Apples Kalender læser det, Google Kalender læser det, Outlook læser det. I beskeden følger også et App Clip med til den, der gerne vil have appen — det åbner uden installation. Det er en dør, ikke en bom.',
          'Det er ikke øjeblikkeligt: feedet beder apps kigge igen hver time, og det er en anmodning, ikke en regel. Det er heller ikke hemmeligt: linket bærer toogtyve tilfældige tegn, som ingen gætter, men den, der har det, kan læse med. Og indtil videre er det kun læsning.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Timer mellem hver anmodning om at opdatere feedet',
      linkLength: 'Tilfældige tegn i linket, hvilket er det, der gør det ugætteligt',
      sharePrice: 'Hvad deling koster',
    },
    practical: [
      'Del fra selve begivenheden, lige efter du har oprettet den.',
      'Send linket via den kanal, du i forvejen bruger med den person.',
      'Ændres tidspunktet i sidste øjeblik, så skriv ud over at flytte begivenheden.',
      'Tilbagekald linket, når begivenheden er overstået, som du ville holde op med at dele et dokument.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'weather-inside-your-calendar'],
  },

  'what-a-subscription-actually-buys': {
    title: 'Hvad et abonnement faktisk giver',
    short: 'Hvad et abonnement giver',
    description:
      'To betalte niveauer, hvad der skiller dem, og hvordan du ved, hvilket — hvis noget — der er dit.',
    lede: 'To niveauer er nok til forvirring, hvis ingen tydeligt siger, hvad der skiller dem. Det, der skiller dem, er Microsoft.',
    commonBelief: 'At det højere niveau er de samme funktioner, bare flere af dem.',
    sections: [
      {
        heading: 'Første niveau fjerner annoncerne',
        body: [
          'Det tilføjer også håndtering af begivenheder på tværs af iCloud- og Google-kalendere, Googles delingsrettigheder, automatiske Meet-links og hurtigere vejropdatering. Men man køber det for annoncerne.',
          'Til den pris er det omtrent én kop kaffe om året, og det er niveauet, der passer til næsten alle, der overhovedet vil betale noget.',
        ],
      },
      {
        heading: 'Andet niveau er til Microsoft',
        body: [
          'Outlook- og Exchange-synkronisering, Teams-links, håndtering på tværs af konti inklusive arbejdet, deltagerhåndtering. Det koster en størrelsesorden mere, fordi forbindelsen gør det.',
          'Ligger din arbejdskalender ikke hos Microsoft, er der intet til dig her. Begge niveauer er billigere pr. år; besparelsen er moderat, ikke dramatisk. Efter opsigelse står du på gratisniveauet med kalenderne uskadte, for begivenhederne har aldrig været vores.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Første niveau, pr. måned, i dollar',
      advancedYearly: 'Første niveau, pr. år, i dollar',
      premiumMonthly: 'Andet niveau, pr. måned, i dollar',
      premiumYearly: 'Andet niveau, pr. år, i dollar',
    },
    practical: [
      'Køb første niveau for at fjerne annoncer, ikke for at låse kalenderen op.',
      'Køb det andet, kun hvis dit arbejde bor hos Microsoft.',
      'Skift til årligt, når du er sikker; besparelsen er reel, men lille.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view'],
  },
};
