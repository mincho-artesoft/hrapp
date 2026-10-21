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
  "updated": "2026-10-21",
  "title": "Del én kalenderbegivenhed: vælg det rette link og den rette adgang",
  "short": "Deling af én begivenhed",
  "description": "Del én begivenhed uden hele kalenderen. Forstå Reader, Writer og Owner, forhåndsvisninger, opdateringer og grænserne for at fjerne adgang.",
  "lede": "At dele middagsdetaljer, lade en medarrangør redigere og indsamle svar om deltagelse er forskellige opgaver. Vælg først opgaven og derefter delingsvejen. Guiden er skrevet af Arte Soft, udvikleren af Cloud Calendars.",
  "commonBelief": "Alle begivenhedslinks er skrivebeskyttede kalenderabonnementer, der straks opdateres og registrerer et svar.",
  "sections": [
    {
      "heading": "Begynd med én begivenhed og gennemgå detaljerne",
      "body": [
        "Deling af én begivenhed omfatter begivenheden, ikke afsenderens hele kalender. Kontrollér titel, tidszone, sted, noter og mødelink før afsendelse. Oplysninger til én gæst hører måske ikke hjemme i et link, du vil sprede bredt.",
        "En middagsaftale kræver for eksempel ikke deling af kalenderen med dine lægebesøg. Middagens eget sted og links følger dog med begivenheden. Kontrollér selve begivenheden frem for at stole på den omgivende kalenders privatliv."
      ]
    },
    {
      "heading": "Vælg forhåndsvisning, e-mail eller QR",
      "body": [
        "Cloud Calendars har forskellige delingsveje. App Clip viser en forhåndsvisning; den fulde app kræves for at tilføje begivenheden derfra. E-mail- og QR-invitationer bruger en webside, der tilbyder at åbne Cloud Calendars. Disse links er ikke indbyrdes udskiftelige abonnementsadresser.",
        "Afsenderen logger ind til appens synkroniserede deling. Links og QR-koder kan videresendes, så send dem kun steder, hvor indholdet passer. En QR-kode formidler et link; den beviser ikke, hvem der åbnede det."
      ]
    },
    {
      "heading": "Giv kun den nødvendige adgang",
      "body": [
        "E-mail-invitationer lader dig vælge Reader, Writer eller Owner. Reader kan se og synkronisere; Writer kan redigere; Owner kan også dele og administrere adgang. Valgene har konsekvenser og er ikke tre navne for samme visning. Brug Reader til dem, der kun behøver programmet.",
        "Vælg Writer til en medarrangør, som skal ændre begivenheden. Vælg kun Owner, hvis vedkommende også skal styre andres adgang. Udvidet adgang kræver den rette indloggede identitet. En anonym modtager er ikke en identificeret medejer."
      ]
    },
    {
      "heading": "Forstå, hvordan modtageren tilføjer begivenheden",
      "body": [
        "I den fulde app kræves kalendertilladelse og en skrivbar destinationskalender. Modtageren bør kontrollere destinationen før lagring. Den modtagne kopi kan derefter knyttes til den delte begivenhed for senere opdateringer.",
        "Det er forskelligt fra at importere en almindelig ICS-fil til en anden kalender. Import giver en kopi; et abonnement kontrollerer jævnligt et feed. Sender du et ICS-feed frem for en appinvitation, så forklar det og bekræft, at modtagerens kalender understøtter det."
      ]
    },
    {
      "heading": "Kontrollér ændringer, før du regner med dem",
      "body": [
        "Synkroniseret deling kan overføre senere rettelser eller aflysning, men modtagerens enhed skal have mulighed for at modtage dem. Et tip om feedopdatering er ikke en leveringsfrist. En offlineenhed, et uopdateret abonnement eller en selvstændig importeret kopi kan stadig vise gamle oplysninger.",
        "Flyttes middagen kort før start, så opdatér begivenheden og kontakt gæsterne direkte. Bed dem bekræfte det nye tidspunkt. At sende en opdatering og modtage et deltagelsessvar er separate trin."
      ]
    },
    {
      "heading": "Administrer adgang uden at love sletning af kopier",
      "body": [
        "Gennemgå modtagernes adgang og fjern unødvendige rettigheder. At fjerne en modtager og tilbagekalde et feedlink er forskellige handlinger; ingen af dem må beskrives som fjernsletning af skærmbilleder, beskeder eller alle kalenderkopier.",
        "Er et link kommet uden for målgruppen, så identificér linket eller adgangstildelingen. Kontrollér den berørte vej efter ændringen. Undlad fremover private detaljer i bredt delte links frem for at regne med senere tilbagekaldelse."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Gennemgå detaljerne og vælg behovet: visning, redigering eller deltagelsessvar.",
    "Vælg delingsvej og log ind, når det kræves.",
    "Brug Reader til læsere; giv kun Writer eller Owner til det tilsvarende ansvar.",
    "Bed modtageren kontrollere tid og destinationskalender ved tilføjelsen.",
    "Ved hastende ændringer: opdatér begivenheden og send en direkte besked.",
    "Gennemgå modtagerrettigheder og linkadgang separat, når delingen slutter."
  ],
  "faq": [
    {
      "q": "Afslører deling af én begivenhed hele min kalender?",
      "a": "Den synkroniserede enkeltbegivenhedsdeling omfatter kun begivenheden. Dens egne detaljer vises stadig gennem den valgte vej. Gennemgå dem, og send ikke en hel kalenderinvitation, hvis du kun mener én begivenhed."
    },
    {
      "q": "Kan modtageren ændre begivenheden?",
      "a": "Ja, med passende Writer- eller Owner-adgang via den understøttede indloggede vej. Reader er til visning og synkronisering. Et almindeligt ICS-abonnement er ikke samme redigeringsmekanisme."
    },
    {
      "q": "Fortryder fjernelse alt, personen allerede har modtaget?",
      "a": "Det kan ikke garanteres. Ændringer påvirker den understøttede delingsrelation, men gemte kopier, skærmbilleder og beskeder kan bestå. En delt feedadresse skal også vurderes separat."
    }
  ],
  "sourcesHeading": "Referencer om modtagermuligheder",
  "sources": [
    {
      "label": "Apple: overblik over App Clips",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google: import af begivenheder og begrænsninger",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft: import eller abonnement på en kalender",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": []
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
