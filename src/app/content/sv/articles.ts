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
  "updated": "2026-10-21",
  "title": "Dela en kalenderhändelse: välj rätt länk och behörighet",
  "short": "Dela en händelse",
  "description": "Dela en händelse utan att dela hela kalendern. Förstå Reader, Writer och Owner, förhandsvisningar, uppdateringar och vad återkallad åtkomst inte gör.",
  "lede": "Att dela middagsdetaljer, låta en medarrangör redigera och samla närvarosvar är olika uppgifter. Bestäm vad du behöver innan du väljer delningssätt. Guiden är skriven av Arte Soft, utvecklaren av Cloud Calendars.",
  "commonBelief": "Varje händelselänk skulle vara en skrivskyddad kalenderprenumeration som uppdateras direkt och registrerar ett svar.",
  "sections": [
    {
      "heading": "Börja med att granska en händelses innehåll",
      "body": [
        "Delning av en enskild händelse omfattar den händelsen, inte avsändarens hela kalender. Kontrollera titel, tidszon, plats, anteckningar och möteslänkar före utskick. Information som passar en gäst passar inte nödvändigtvis i en länk som sprids brett.",
        "Att dela en middag kräver inte att du delar kalendern med dina läkarbesök. Middagens egen plats och länkar följer däremot med. Granska själva händelsen i stället för att förlita dig på att den omgivande kalendern är privat."
      ]
    },
    {
      "heading": "Välj förhandsvisning, e-postinbjudan eller QR-kod",
      "body": [
        "Cloud Calendars har olika delningsvägar. App Clip visar en förhandsvisning; den fullständiga appen behövs för att lägga till händelsen därifrån. Inbjudningar via e-post och QR öppnar en webbsida som erbjuder att öppna Cloud Calendars. Länkarna är inte utbytbara prenumerationsadresser.",
        "Avsändaren loggar in för appens synkroniserade delning. En länk eller QR-kod kan vidarebefordras, så skicka den bara där innehållet passar. En QR-kod förmedlar en länk och bevisar inte vem som öppnat den."
      ]
    },
    {
      "heading": "Ge bara den åtkomst mottagaren behöver",
      "body": [
        "E-postinbjudningar låter dig välja Reader, Writer eller Owner. Reader kan läsa och synkronisera; Writer kan redigera; Owner kan också dela och hantera åtkomst. Det är olika befogenheter, inte tre namn för visning. Välj Reader när någon bara behöver schemat.",
        "Välj Writer för en medarrangör som ska ändra händelsen. Välj Owner bara om personen också ska bestämma andras åtkomst. Mottagaren måste använda rätt inloggad identitet för utökade behörigheter. En anonym mottagare är inte en identifierad medägare."
      ]
    },
    {
      "heading": "Förstå hur mottagaren lägger till händelsen",
      "body": [
        "I den fullständiga appen krävs kalenderbehörighet och en skrivbar målkalender för att lägga till en delad händelse. Mottagaren bör kontrollera destinationen innan den sparas. Den mottagna kopian kan sedan kopplas till den delade händelsen för senare uppdateringar.",
        "Det skiljer sig från att importera en vanlig ICS-fil i en annan kalender. Import skapar en kopia, medan en prenumeration kontrollerar ett flöde regelbundet. Om du skickar ett ICS-flöde i stället för en appinbjudan, förklara det och kontrollera att mottagarens kalender stöder det."
      ]
    },
    {
      "heading": "Kontrollera ändringar innan du förlitar dig på dem",
      "body": [
        "Synkroniserad delning kan föra vidare ändringar och inställda händelser, men mottagarens enhet måste kunna ta emot dem. Ett önskemål om flödets uppdateringsintervall är ingen leveransfrist. En offlineenhet, en ouppdaterad prenumeration eller en fristående importerad kopia kan visa äldre uppgifter.",
        "Om middagen flyttas strax före start, uppdatera händelsen och kontakta gästerna direkt. Be dem bekräfta den nya tiden. Att skicka en uppdatering och få ett närvarosvar är separata steg."
      ]
    },
    {
      "heading": "Hantera åtkomst utan att lova att kopior raderas",
      "body": [
        "Granska mottagarnas behörigheter och ta bort sådant som inte längre behövs. Att ta bort en mottagare och återkalla en flödeslänk är olika åtgärder. Ingen av dem ska beskrivas som fjärradering av skärmbilder, meddelanden eller alla kalenderkopior.",
        "Om en länk har spridits utanför den tänkta kretsen, identifiera länken eller behörigheten det gäller. Kontrollera den berörda vägen efter ändringen. Håll privata detaljer borta från framtida brett spridda länkar, i stället för att hoppas kunna återta dem senare."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Granska händelsen och avgör om du behöver läsning, redigering eller närvarosvar.",
    "Välj avsedd delningsväg och logga in när det krävs.",
    "Använd Reader för läsare; ge Writer eller Owner bara för motsvarande ansvar.",
    "Be mottagaren kontrollera tiden och målkalendern när händelsen läggs till.",
    "Uppdatera händelsen och skicka ett direktmeddelande vid brådskande ändringar.",
    "Granska mottagarbehörigheter och länkåtkomst var för sig när delningen upphör."
  ],
  "faq": [
    {
      "q": "Visas hela min kalender när jag delar en händelse?",
      "a": "Synkroniserad delning av en händelse är avgränsad till den. Händelsens egna detaljer blir ändå tillgängliga via vald väg. Granska dem och skicka inte en inbjudan till hela kalendern när du bara vill dela en händelse."
    },
    {
      "q": "Kan mottagaren ändra händelsen?",
      "a": "Ja, med rätt Writer- eller Owner-behörighet och det inloggade flöde som stöds. Reader är för läsning och synkronisering. En vanlig ICS-prenumeration är inte samma redigeringsmekanism."
    },
    {
      "q": "Ångras allt någon redan fått när jag tar bort personen?",
      "a": "Utgå inte från en sådan garanti. Ändrad åtkomst påverkar den delningsrelation som stöds, men sparade kopior, skärmbilder och meddelanden kan finnas kvar. En delad flödesadress behöver också hanteras separat."
    }
  ],
  "sourcesHeading": "Referenser för mottagarens alternativ",
  "sources": [
    {
      "label": "Apple: översikt över App Clips",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google: import av händelser och begränsningar",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft: importera eller prenumerera på en kalender",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "what-guests-can-do-to-your-event",
    "taking-back-a-calendar-you-shared"
  ]
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
