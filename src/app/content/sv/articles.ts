import { LocalisedArticle } from '../types';

/**
 * The four articles this language carries.
 *
 * Chosen one per intent -- weather, one view, sharing, price -- so the language
 * answers a whole question rather than a quarter of four. The numbers are not
 * here: they live once in article-facts.ts and join the prose by id, so a
 * translation can rewrite every sentence without touching a figure.
 */
export const ARTICLES_SV: Readonly<Record<string, LocalisedArticle>> = {
  'weather-inside-your-calendar': {
  "title": "En kalender som redan har vädret i sig",
  "short": "Vädret inuti kalendern",
  "description": "Varför två appar för att planera en dag är ett konstruktionsfel, och hur en kalender ser ut där prognosen är en del av vyn i stället för att stå bredvid.",
  "lede": "Nästan alla planerar sin dag mellan två appar. Kalendern säger var man ska vara; väderappen säger hur det är när man kommer dit. Att hålla ihop de två i huvudet är den del ingen märker att de gör — tills en lördag går förlorad.",
  "commonBelief": "Att en kalender är för åtaganden och en väderapp är för vädret, och att hålla dem åtskilda helt enkelt är så telefoner fungerar.",
  "sections": [
    {
      "heading": "Priset för två appar är inte två tryck",
      "body": [
        "Att växla kostar ingenting. Det dyra är att de två aldrig är överens om vad som spelar roll. Din kalender vet att lördag klockan elva är två timmar upptagna; väderappen vet att det regnar från tio till ett. Ingen av dem vet att de två fakta tillsammans betyder att blocket måste flyttas.",
        "Integrationslagret är du. Det fungerar tills du har mycket att göra, vilket är precis när det är värt mest att skydda sina planer."
      ]
    },
    {
      "heading": "Den tillgängliga prognosen",
      "body": [
        "Cloud Calendars använder den tillgängliga prognosen för vald plats. Tim- och dagsdata kan omfatta olika perioder.",
        "Datumen du kan visa i kalendern avgör inte hur långt prognosen sträcker sig. Månadsvyn innebär inte en prognos för hela månaden eller varje händelse."
      ]
    }
  ],
  "claims": {
    "price": "Vad väderfunktionerna kostar"
  },
  "practical": [
    "Kontrollera plats, datum och tillgängliga timmar innan du planerar utifrån prognosen."
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-a-subscription-actually-buys"
  ],
  "updated": "2026-10-21"
},

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google och Outlook i en enda vy',
    short: 'Tre konton, en vy',
    description:
      'Nästan allas liv är uppdelat mellan en privat Apple-kalender, ett Google-konto och ett Exchange från jobbet. Vad som ändras när de hamnar i samma rutnät.',
    lede: 'Problemet är nästan aldrig att någon av kalendrarna är dålig. Det är att du har tre och en enda vecka.',
    commonBelief: 'Att hålla arbete och privatliv i skilda appar är en gräns och inte ett fel.',
    sections: [
      {
        heading: 'Dubbelbokning är strukturell',
        body: [
          'Om dina åtaganden bor på tre ställen kan inget ställe säga om du är ledig. Sammanslagningssteget är du, och du kör det ur minnet, oftast medan någon väntar på svar.',
          'Därför är det klassiska misslyckandet inte att glömma en händelse; det är att tacka ja till något som krockar med en händelse du inte kunde se.',
        ],
      },
      {
        heading: 'Vad ett enda rutnät ger',
        body: [
          'Alla konton i samma vecka, färgade efter ursprung, redigerbara på plats. Du slutar undra vilken app som har svaret, eftersom frågan slutar vara i plural.',
          'iCloud och Google synkar i gratisversionen. Microsoft-konton — Outlook och Exchange — ligger i den betalda, eftersom den anslutningen har en löpande kostnad som de andra inte har.',
        ],
      },
    ],
    claims: {
      accounts: 'Kontotyper som ryms i en vy',
      premiumMonthly: 'Månadskostnad för att lägga till Microsoft, i dollar',
    },
    practical: [
      'Lägg till privatkontot först och sedan det som orsakar krockarna.',
      'Färga per konto och inte per kategori: det är ursprunget du behöver se på en gång.',
      'Fortsätt skriva i den kalender som andra redan läser.',
    ],
    seeAlso: ['weather-inside-your-calendar', 'what-a-subscription-actually-buys'],
  },

  'sharing-one-event-not-your-calendar': {
    title: 'Dela en händelse, inte din kalender',
    short: 'Dela en händelse',
    description:
      'Hur det går till att skicka en enda händelse, vad mottagaren faktiskt får och varför den inte behöver installera något för att se den.',
    lede: 'Att dela en kalender är oftast allt eller inget: antingen har någon tillgång till din eller inte. Att skicka en middag borde inte kräva någotdera.',
    commonBelief: 'Att dela en händelse betyder att ge någon ett fönster mot resten av din vecka.',
    sections: [
      {
        heading: 'Vad som faktiskt skickas',
        body: [
          'När du skapar en händelse erbjuder appen att dela den. Det som färdas är en länk — via e-post, meddelande, vad mottagaren nu har — och bakom länken ligger ett kalenderflöde som innehåller den händelsen och inget annat.',
          'Det är ingen skärmbild och ingen kopia som blir gammal. Ändras tiden ändras flödet med den, och den du skickade till ser ändringen utan att du skickar om något.',
        ],
      },
      {
        heading: 'Vad det inte är',
        body: [
          'Länken är en vanlig kalenderprenumeration: Apples Kalender läser den, Google Kalender läser den, Outlook läser den. I meddelandet följer också ett App Clip med för den som vill ha appen — det öppnas utan installation. Det är en dörr, inte en vägtull.',
          'Det är inte omedelbart: flödet ber apparna titta igen varje timme, och det är en begäran, inte en regel. Det är inte heller hemligt: länken bär tjugotvå slumpmässiga tecken som ingen gissar, men den som har den kan läsa. Och tills vidare är det enbart läsning.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Timmar mellan varje begäran om att uppdatera flödet',
      linkLength: 'Slumpmässiga tecken i länken, vilket är det som gör den ogissbar',
      sharePrice: 'Vad delning kostar',
    },
    practical: [
      'Dela från själva händelsen, direkt efter att du skapat den.',
      'Skicka länken via den kanal du redan använder med personen.',
      'Ändras tiden i sista stund, skriv också och nöj dig inte med att flytta händelsen.',
      'Återkalla länken när händelsen är över, som du skulle sluta dela ett dokument.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'weather-inside-your-calendar'],
  },

  'what-a-subscription-actually-buys': {
  "updated": "2026-10-21",
  "title": "Vad en prenumeration faktiskt ger",
  "short": "Vad en prenumeration ger",
  "description": "Vad en prenumeration ger: Base, Advanced, Premium.",
  "lede": "Den här guiden publiceras av Arte Soft, utvecklaren av Cloud Calendars.",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "Base innehåller Google Calendar-synkronisering, Google Meet, kalendervyer, väder och widgetar. Gratisplanen kan visa annonser."
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Advanced innehåller Base och tar bort annonser. Premium innehåller Advanced och lägger till Microsoft Calendar och Microsoft Teams.",
        "En prenumeration ger inte rätt att redigera andras kalendrar och kringgår inte begränsningar för ett jobbkonto."
      ]
    },
    {
      "heading": "Information om köp och uppsägning",
      "body": [
        "Kontrollera lokalt pris, faktureringsperiod och förnyelsevillkor före köp.",
        "För en prenumeration som faktureras av Apple öppnar du Inställningar → ditt namn → Prenumerationer. Kontrollera status och slutdatum. Att stoppa förnyelsen är skilt från att radera appen eller kalenderdata; anta inte att betalfunktioner finns kvar efter att prenumerationen löpt ut."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Kontrollera lokalt pris, faktureringsperiod och förnyelsevillkor före köp.",
    "En prenumeration ger inte rätt att redigera andras kalendrar och kringgår inte begränsningar för ett jobbkonto."
  ],
  "faq": [
    {
      "q": "Hur stoppar jag förnyelsen?",
      "a": "För en prenumeration som faktureras av Apple öppnar du Inställningar → ditt namn → Prenumerationer. Kontrollera status och slutdatum. Att stoppa förnyelsen är skilt från att radera appen eller kalenderdata; anta inte att betalfunktioner finns kvar efter att prenumerationen löpt ut."
    }
  ],
  "sourcesHeading": "Information om köp och uppsägning",
  "sources": [
    {
      "label": "Apple: Hur stoppar jag förnyelsen?",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view"
  ]
},
};
