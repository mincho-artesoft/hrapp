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
  "title": "En kalender, der allerede har vejret i sig",
  "short": "Vejret inde i kalenderen",
  "description": "Hvorfor to apps til at planlægge en dag er en designfejl, og hvordan en kalender ser ud, hvor udsigten er en del af visningen i stedet for at stå ved siden af.",
  "lede": "Næsten alle planlægger deres dag mellem to apps. Kalenderen siger, hvor man skal være; vejrappen siger, hvordan vejret er, når man når frem. At holde de to ting sammen i hovedet er den del, ingen bemærker, de gør — indtil en lørdag går tabt.",
  "commonBelief": "At en kalender er til aftaler og en vejrapp er til vejret, og at holde dem adskilt simpelthen er sådan, telefoner fungerer.",
  "sections": [
    {
      "heading": "Prisen for to apps er ikke to tryk",
      "body": [
        "At skifte koster ingenting. Det dyre er, at de to aldrig er enige om, hvad der betyder noget. Din kalender ved, at der lørdag klokken elleve er to timer optaget; vejrappen ved, at det regner fra ti til et. Ingen af dem ved, at de to kendsgerninger tilsammen betyder, at blokken skal flyttes.",
        "Integrationslaget er dig. Det virker, indtil du har travlt, hvilket er præcis når det er mest værd at beskytte sine planer."
      ]
    },
    {
      "heading": "Den tilgængelige vejrudsigt",
      "body": [
        "Cloud Calendars bruger den tilgængelige vejrudsigt for det valgte sted. Time- og dagsdata kan dække forskellige perioder.",
        "De datoer, du kan se i kalenderen, bestemmer ikke vejrudsigtens rækkevidde. Månedsvisning betyder ikke en vejrudsigt for hele måneden eller hver begivenhed."
      ]
    }
  ],
  "claims": {
    "price": "Hvad vejrfunktionerne koster"
  },
  "practical": [
    "Kontrollér sted, dato og tilgængelige timer, før du planlægger ud fra vejrudsigten."
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-a-subscription-actually-buys"
  ],
  "updated": "2026-10-21"
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
  "updated": "2026-10-21",
  "title": "Hvad et abonnement faktisk giver",
  "short": "Hvad et abonnement giver",
  "description": "Hvad et abonnement giver: Base, Advanced, Premium.",
  "lede": "Denne vejledning udgives af Arte Soft, udvikleren af Cloud Calendars.",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "Base omfatter Google Calendar-synkronisering, Google Meet, kalendervisninger, vejr og widgets. Gratisplanen kan vise reklamer."
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Advanced indeholder Base og fjerner reklamer. Premium indeholder Advanced og tilføjer Microsoft Calendar og Microsoft Teams.",
        "Et abonnement giver ikke redigeringsret til andres kalendere og omgår ikke begrænsninger på en arbejdskonto."
      ]
    },
    {
      "heading": "Oplysninger om køb og opsigelse",
      "body": [
        "Kontrollér den lokale pris, betalingsperioden og vilkårene for fornyelse før køb.",
        "For et abonnement faktureret af Apple skal du åbne Indstillinger → dit navn → Abonnementer. Kontrollér status og udløbsdato. At stoppe fornyelsen er adskilt fra at slette appen eller kalenderdata; antag ikke, at betalte funktioner fortsat virker efter udløb."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Kontrollér den lokale pris, betalingsperioden og vilkårene for fornyelse før køb.",
    "Et abonnement giver ikke redigeringsret til andres kalendere og omgår ikke begrænsninger på en arbejdskonto."
  ],
  "faq": [
    {
      "q": "Hvordan stopper jeg fornyelsen?",
      "a": "For et abonnement faktureret af Apple skal du åbne Indstillinger → dit navn → Abonnementer. Kontrollér status og udløbsdato. At stoppe fornyelsen er adskilt fra at slette appen eller kalenderdata; antag ikke, at betalte funktioner fortsat virker efter udløb."
    }
  ],
  "sourcesHeading": "Oplysninger om køb og opsigelse",
  "sources": [
    {
      "label": "Apple: Hvordan stopper jeg fornyelsen?",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view"
  ]
},
};
