import { LocalisedArticle } from '../types';

/**
 * The four articles this language carries.
 *
 * Chosen one per intent -- weather, one view, sharing, price -- so the language
 * answers a whole question rather than a quarter of four. The numbers are not
 * here: they live once in article-facts.ts and join the prose by id, so a
 * translation can rewrite every sentence without touching a figure.
 */
export const ARTICLES_NO: Readonly<Record<string, LocalisedArticle>> = {
  'weather-inside-your-calendar': {
  "title": "En kalender som allerede har været i seg",
  "short": "Været inni kalenderen",
  "description": "Hvorfor to apper for å planlegge en dag er en designfeil, og hvordan en kalender ser ut der værmeldingen er en del av visningen i stedet for å stå ved siden av.",
  "lede": "Nesten alle planlegger dagen mellom to apper. Kalenderen sier hvor man skal være; værappen sier hvordan været er når man kommer fram. Å holde de to sammen i hodet er den delen ingen merker at de gjør — helt til en lørdag går tapt.",
  "commonBelief": "At en kalender er for avtaler og en værapp er for været, og at å holde dem adskilt rett og slett er slik telefoner fungerer.",
  "sections": [
    {
      "heading": "Prisen for to apper er ikke to trykk",
      "body": [
        "Å bytte koster ingenting. Det dyre er at de to aldri er enige om hva som betyr noe. Kalenderen vet at lørdag klokken elleve er to timer opptatt; værappen vet at det regner fra ti til ett. Ingen av dem vet at disse to kjensgjerningene til sammen betyr at blokken må flyttes.",
        "Integrasjonslaget er du. Det virker helt til du har mye å gjøre, som er nøyaktig når det er mest verdt å beskytte planene sine."
      ]
    },
    {
      "heading": "Den tilgjengelige værmeldingen",
      "body": [
        "Cloud Calendars bruker den tilgjengelige værmeldingen for det valgte stedet. Time- og dagsdata kan dekke ulike perioder.",
        "Datoene du kan vise i kalenderen, bestemmer ikke hvor langt værmeldingen rekker. Månedsvisning betyr ikke en værmelding for hele måneden eller hver hendelse."
      ]
    }
  ],
  "claims": {
    "price": "Hva værfunksjonene koster"
  },
  "practical": [
    "Kontroller sted, dato og tilgjengelige timer før du planlegger ut fra værmeldingen."
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-a-subscription-actually-buys"
  ],
  "updated": "2026-10-21"
},

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google og Outlook i én visning',
    short: 'Tre kontoer, én visning',
    description:
      'Nesten alles liv er delt mellom en privat Apple-kalender, en Google-konto og en Exchange fra jobben. Hva som endrer seg når de havner i samme rutenett.',
    lede: 'Problemet er nesten aldri at en av kalenderne er dårlig. Det er at du har tre og bare én uke.',
    commonBelief: 'At det å holde jobb og privatliv i hver sin app er en grense og ikke en mangel.',
    sections: [
      {
        heading: 'Dobbeltbooking er strukturelt',
        body: [
          'Hvis avtalene dine bor tre steder, kan ingen steder fortelle deg om du er ledig. Sammenslåingssteget er du, og du kjører det etter hukommelsen, som regel mens noen venter på svar.',
          'Derfor er den klassiske tabben ikke å glemme en hendelse; det er å si ja til noe som kolliderer med en hendelse du ikke kunne se.',
        ],
      },
      {
        heading: 'Hva ett rutenett gir',
        body: [
          'Alle kontoer i samme uke, farget etter opphav, redigerbare på stedet. Du slutter å lure på hvilken app som har svaret, fordi spørsmålet slutter å være i flertall.',
          'iCloud og Google synkroniserer i gratisversjonen. Microsoft-kontoer — Outlook og Exchange — hører til den betalte, fordi den forbindelsen har en løpende kostnad de andre ikke har.',
        ],
      },
    ],
    claims: {
      accounts: 'Kontotyper som får plass i én visning',
      premiumMonthly: 'Månedspris for å legge til Microsoft, i dollar',
    },
    practical: [
      'Legg inn privatkontoen først og deretter den som forårsaker kollisjonene.',
      'Farg etter konto og ikke etter kategori: det er opphavet du må se med en gang.',
      'Fortsett å skrive i den kalenderen andre allerede leser.',
    ],
    seeAlso: ['weather-inside-your-calendar', 'what-a-subscription-actually-buys'],
  },

  'sharing-one-event-not-your-calendar': {
    title: 'Del én hendelse, ikke kalenderen din',
    short: 'Del én hendelse',
    description:
      'Hvordan det foregår å sende én enkelt hendelse, hva mottakeren faktisk får, og hvorfor vedkommende ikke trenger å installere noe for å se den.',
    lede: 'Å dele en kalender er som regel alt eller ingenting: enten har noen tilgang til din, eller så har de det ikke. Å sende en middag burde ikke kreve noen av delene.',
    commonBelief: 'At det å dele en hendelse betyr å gi noen et vindu til resten av uken din.',
    sections: [
      {
        heading: 'Hva som faktisk sendes',
        body: [
          'Når du oppretter en hendelse, tilbyr appen å dele den. Det som reiser, er en lenke — via e-post, melding, hva mottakeren nå har — og bak den lenken ligger en kalenderstrøm som inneholder den hendelsen og ingenting annet.',
          'Det er verken et skjermbilde eller en kopi som blir gammel. Endres tidspunktet, endres strømmen med det, og den du sendte til, ser endringen uten at du sender noe på nytt.',
        ],
      },
      {
        heading: 'Hva det ikke er',
        body: [
          'Lenken er et helt vanlig kalenderabonnement: Apples Kalender leser den, Google Kalender leser den, Outlook leser den. I meldingen følger det også med et App Clip for den som vil ha appen — det åpnes uten installasjon. Det er en dør, ikke en bom.',
          'Det er ikke øyeblikkelig: strømmen ber apper se etter igjen hver time, og det er en forespørsel, ikke en regel. Det er heller ikke hemmelig: lenken bærer tjueto tilfeldige tegn som ingen gjetter, men den som har den, kan lese med. Og foreløpig er det bare lesing.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Timer mellom hver forespørsel om å oppdatere strømmen',
      linkLength: 'Tilfeldige tegn i lenken, som er det som gjør den ugjettelig',
      sharePrice: 'Hva deling koster',
    },
    practical: [
      'Del fra selve hendelsen, rett etter at du har opprettet den.',
      'Send lenken via den kanalen du allerede bruker med den personen.',
      'Endres tidspunktet i siste liten, så skriv i tillegg til å flytte hendelsen.',
      'Trekk tilbake lenken når hendelsen er over, slik du ville sluttet å dele et dokument.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'weather-inside-your-calendar'],
  },

  'what-a-subscription-actually-buys': {
  "updated": "2026-10-21",
  "title": "Hva et abonnement faktisk gir",
  "short": "Hva et abonnement gir",
  "description": "Hva et abonnement gir: Base, Advanced, Premium.",
  "lede": "Denne veiledningen publiseres av Arte Soft, utvikleren av Cloud Calendars.",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "Base inkluderer Google Calendar-synkronisering, Google Meet, kalendervisninger, vær og widgeter. Gratisplanen kan vise annonser."
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Advanced inkluderer Base og fjerner annonser. Premium inkluderer Advanced og legger til Microsoft Calendar og Microsoft Teams.",
        "Et abonnement gir ikke redigeringstilgang til andres kalendere og omgår ikke begrensninger på en jobbkonto."
      ]
    },
    {
      "heading": "Informasjon om kjøp og oppsigelse",
      "body": [
        "Kontroller lokal pris, faktureringsperiode og vilkår for fornyelse før kjøp.",
        "For et abonnement fakturert av Apple åpner du Innstillinger → navnet ditt → Abonnementer. Kontroller status og utløpsdato. Å stoppe fornyelsen er noe annet enn å slette appen eller kalenderdata; ikke anta at betalte funksjoner fortsatt er tilgjengelige etter utløp."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Kontroller lokal pris, faktureringsperiode og vilkår for fornyelse før kjøp.",
    "Et abonnement gir ikke redigeringstilgang til andres kalendere og omgår ikke begrensninger på en jobbkonto."
  ],
  "faq": [
    {
      "q": "Hvordan stopper jeg fornyelsen?",
      "a": "For et abonnement fakturert av Apple åpner du Innstillinger → navnet ditt → Abonnementer. Kontroller status og utløpsdato. Å stoppe fornyelsen er noe annet enn å slette appen eller kalenderdata; ikke anta at betalte funksjoner fortsatt er tilgjengelige etter utløp."
    }
  ],
  "sourcesHeading": "Informasjon om kjøp og oppsigelse",
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
