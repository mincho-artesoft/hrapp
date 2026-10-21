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
  "month-view-on-a-bigger-screen": {
  "updated": "2026-10-22",
  "title": "Månadskalender på iPad och iPhone: välj datum och kontrollera detaljer",
  "short": "Använd månadsvyn utan att missa detaljer",
  "description": "Jämför datum på iPad eller iPhone. Kontrollera dolda händelser, valda kalendrar och exakta tider innan delade eller återkommande möten flyttas.",
  "lede": "Månadsvyn visar vilka datum åtaganden ligger på. Den passar sämre för att bevisa att en viss timme är ledig. Välj ett datum i översikten och granska sedan dagen och händelsen innan du bestämmer dig. Guiden publiceras av Arte Soft, utvecklaren bakom Cloud Calendars.",
  "commonBelief": "En större månadsvy visar alla detaljer, och ett till synes tomt datum bevisar att alla är lediga.",
  "sections": [
    {
      "heading": "Avgör om du behöver datum eller exakta timmar",
      "body": [
        "Använd månaden för att jämföra en projektdeadline, en resa och ett familjemöte över flera veckor. Om frågan gäller överlappning klockan 14.30, byt till dag eller vecka och kontrollera exakt start och slut. En månadscell ger inte samma tidsskala som ett timrutnät.",
        "En workshoparrangör kan exempelvis först undvika en resvecka. Nästa kontroll gäller dagen: befintliga åtaganden, förberedelse, resa och nödvändig sluttid. En tomliknande cell är ett datum att undersöka, inte en bekräftad bokning eller uppgift om andras tillgänglighet."
      ]
    },
    {
      "heading": "Läs antalet ytterligare händelser",
      "body": [
        "Cloud Calendars nuvarande månadscell visar ett begränsat antal händelseetiketter och ett antal för ytterligare händelser samma datum. Titlar hålls till en rad och kan kortas. Öppna dagen eller händelsen när hela titeln eller övriga åtaganden spelar roll.",
        "En större iPad-skärm kan göra översikten lättare att läsa, men mer fysisk plats tar inte nödvändigtvis bort alla visningsgränser. Ett smalt appfönster eller större text påverkar vad som ryms. Kontrollera också på iPhone den underliggande dagen innan synliga etiketter ses som hela schemat."
      ]
    },
    {
      "heading": "Kontrollera månad, valda kalendrar och angränsande datum",
      "body": [
        "Läs månad och år innan du väljer datum. Rutnätet kan innehålla angränsande månaders datum för att fylla raderna. Använd månadsnavigeringen i Cloud Calendars och kontrollera det valda datumet, inte bara rutans position.",
        "Kontrollera valda kalendrar. Dolda jobbhändelser kan underlätta läsningen av familjeplanen, men tar också bort de åtagandena ur just den översikten. Vid dubblettfelsökning, dölj tillfälligt en källa och jämför; radera inte ett möte bara för att göra månaden luftigare."
      ]
    },
    {
      "heading": "Öppna händelsen innan en gemensam plan ändras",
      "body": [
        "Bekräfta titel, ägare eller kalender, lokal tid och längd i detaljerna. Färg hjälper vid överblick men ersätter inte kunskap om konto eller redigeringsrätt. En synlig inbjudan är något annat än ett möte du själv ordnar.",
        "Cloud Calendars har drag och släpp i månadsvyn för att flytta händelser till andra datum. Fastställ datum och upprepningsomfattning innan du flyttar ett riktigt åtagande. Öppna händelsen efter en tillåten ändring och kontrollera: en lokal gest bevisar inte att leverantören eller alla deltagare accepterat planen."
      ]
    },
    {
      "heading": "Kontrollera upprepning och tidszoner separat",
      "body": [
        "Om bara veckans lektion flyttas, ändra inte framtida mönster av misstag. Läs valet för upprepningsomfattning och granska både den ändrade förekomsten och en senare efteråt. Månadsvyn underlättar jämförelse av återkommande datum, men omfattningen avgör ändringens betydelse.",
        "Vid resa eller möten över tidszoner, kontrollera uttryckligen händelsens lokala datum och tid. Flytt till en annan dag omvandlar inte automatiskt den avsedda mötestiden. Kontrollera sommartidsövergångar när det är relevant och bekräfta tiden med deltagarna."
      ]
    },
    {
      "heading": "Skilj den större vyn från andra produkter",
      "body": [
        "Apple Kalender har egna månadsalternativ, medan Teamup beskriver olika vyer för webbläsare och mobil. Kontrollerna hör till respektive produkt. Leta inte efter Teamups webbläsarkonfiguration eller Apple Kalenders vymeny i Cloud Calendars bara för att vyerna har samma namn.",
        "En månad av möten innebär inte heller en månads väderprognos. Kontrollera plats, datum och tillgängliga prognostimmar separat för utomhusplaner. Spara slutligt möte i avsedd kalender och bekräfta ändringar direkt med deltagarna."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Välj datum i månadsvyn och kontrollera timmar i dag eller vecka.",
    "Öppna dagar med extra antal eller förkortade titlar.",
    "Kontrollera månad, år och valda kalendrar innan ett datum anses ledigt.",
    "Bekräfta kalender, tid, längd och redigeringsrätt.",
    "Läs upprepningsomfattningen och kontrollera sparad förekomst efter flytt.",
    "Kontrollera vädret separat och bekräfta ändringar med deltagarna."
  ],
  "faq": [
    {
      "q": "Visar iPads månadsvy varje möte i sin helhet?",
      "a": "Utgå inte från det. Cloud Calendars begränsar händelseetiketter och visar antalet ytterligare händelser. Öppna dagen och händelsen för att granska hela schemat."
    },
    {
      "q": "Betyder en tom dag att jag är ledig?",
      "a": "Kontrollera först valda kalendrar, datum och att relevanta kontodata finns. Översikten visar bara den information som är tillgänglig och visad just nu."
    },
    {
      "q": "Ändrar en flytt av återkommande händelse bara det datumet?",
      "a": "Läs valet för ändringens omfattning. Efter sparandet, granska den ändrade och en senare förekomst och bekräfta avsikten."
    }
  ],
  "sourcesHeading": "Jämför de officiella vybeskrivningarna",
  "sources": [
    {
      "label": "Apple: månads-, flerdagars- och listvyer",
      "url": "https://support.apple.com/en-ca/guide/iphone/iphfd1054569/ios"
    },
    {
      "label": "Teamup: vyer och inställningar i webbläsare respektive app",
      "url": "https://calendar.teamup.com/kb/how-to-use-calendar-views/"
    }
  ],
  "seeAlso": []
},

  'weather-inside-your-calendar': {
  "updated": "2026-10-22",
  "title": "Kalender med väder på iPhone och iPad: granska planen i sitt sammanhang",
  "short": "Använd kalender och väder tillsammans",
  "description": "Använd kalender och väder på iPhone och iPad. Kontrollera vald plats, tillgängliga prognostimmar och händelsens detaljer innan du sparar.",
  "lede": "Kalendern visar när ett åtagande är planerat. Vädret svarar på en annan fråga: vilka förhållanden väntas på platsen och under perioden du behöver? Använd båda, men håll platser och datum tydliga. Guiden publiceras av Arte Soft, utvecklaren bakom Cloud Calendars.",
  "commonBelief": "Väder bredvid kalendern beskriver automatiskt varje mötesadress, varje timme och varje framtida datum.",
  "sections": [
    {
      "heading": "Välj en konkret planeringsfråga",
      "body": [
        "Börja med ett särskilt åtagande, till exempel ett parkbesök på eftermiddagen. Identifiera vad som kan ändras: tid, plats, förberedelser eller ett alternativ. Hela kalendern behöver inte göras om bara för att dagens symbol visar regn.",
        "Skriv upp aktivitetens verkliga start och slut, inklusive förberedelser när de är relevanta. Kalenderöversikten hjälper dig hitta möjliga datum, medan prognoskontrollen gäller en bestämd plats och period. Håll isär uppgifterna när du jämför alternativ."
      ]
    },
    {
      "heading": "Bekräfta prognosplatsen",
      "body": [
        "Cloud Calendars erbjuder väder för aktuell eller vald plats. Kontrollera platsnamnet i stället för att anta att händelsens adress ändrar prognosen i bakgrunden. Ett möte i en annan stad behöver jämföras med den stadens väder.",
        "En besökare kan exempelvis planera ankomsten till ett museum medan telefonen fortfarande är hemma. Läs prognosplatsen och mötets lokala tid innan du jämför. Närliggande värden på skärmen bevisar inte att kalender och väder gäller samma plats."
      ]
    },
    {
      "heading": "Kontrollera tim- och dygnstäckning separat",
      "body": [
        "Använd dygnsvärdet som orientering och tillgängliga timvärden för en del av dagen. En bokning från två till fem kräver mer än en blick på en symbol. Kontrollera att de relevanta timmarna faktiskt finns.",
        "I appens nuvarande källkod tar dygnslistan upp till tio dagar som WeatherKit returnerar. Detta är separat från kalendernavigeringen och de timmar som tillhandahålls. Ett framtida möte utökar inte prognosen. Planera en senare väderkontroll om perioden saknas."
      ]
    },
    {
      "heading": "Förstå vädervärdets betydelse",
      "body": [
        "Apple beskriver WeatherKit-data som temperatur, nederbörd, vind och UV, med vissa produkter endast i utvalda regioner. Läs värdena för vald plats i stället för att förvänta dig alla väderprodukter överallt.",
        "Met Offices vägledning visar varför period och variabeldefinition spelar roll: vissa värden gäller ett ögonblick, andra en period. Använd respektive leverantörs etiketter. Regnsannolikhet, mängd och varaktighet är olika frågor; inget enskilt tal avgör varje utomhusaktivitet."
      ]
    },
    {
      "heading": "Granska utkastet från en prognostimme",
      "body": [
        "Där appen erbjuder händelseskapande från en timme öppnas ett utkast. Nuvarande källkod använder väderplatsens tidszon, föreslår en timmes längd och väljer standardkalendern för nya händelser. Granska varje värde innan du sparar.",
        "Bekräfta titel, målkalender, start, slut och avsedd plats. Ett prognosval ger inte redigeringsrätt i en delad kalender, meddelar inte lokalen och bokar inget rum. Kontrollera den sparade händelsen och skaffa de överenskommelser planen kräver."
      ]
    },
    {
      "heading": "Håll webbplatsens demonstration separat",
      "body": [
        "Webbplatsens interaktiva väderdemonstration använder Open-Meteo. Appen använder Apple WeatherKit. Demonstrationen hjälper dig utforska presentationen, men plats, data och tillgängliga datum kan skilja sig från appen.",
        "Öppna appen för ett verkligt beslut och jämför mötet med tillgänglig prognos. Om du ändrar en gemensam plan, bekräfta arrangör, upprepningsomfattning och deltagare. Ha ett överenskommet alternativ när aktiviteten beror på förhållandena."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifiera åtagandet och beslutet som vädret kan påverka.",
    "Bekräfta väderplatsen och mötets lokala datum och tid.",
    "Granska tillgängliga timmar separat från dygnsöversikten.",
    "Läs sannolikhet, mängd och andra värden med deras etiketter.",
    "Kontrollera utkastets detaljer och målkalender innan du sparar.",
    "Kontrollera igen vid beslutstillfället och bekräfta gemensamma ändringar direkt."
  ],
  "faq": [
    {
      "q": "Följer vädret bredvid kalendern varje händelses adress?",
      "a": "Utgå inte från det. Kontrollera visad väderplats mot mötesplatsen; närhet på skärmen bevisar ingen matchning."
    },
    {
      "q": "Använder appen webbplatsens väderleverantör?",
      "a": "Nej. Appen använder Apple WeatherKit; webbplatsens demonstration använder Open-Meteo separat."
    },
    {
      "q": "Sparas ett möte automatiskt när jag väljer prognostimme?",
      "a": "Det startar ett utkast där funktionen finns. Kontrollera datum, tidszon, längd, kalender och plats och spara sedan önskad händelse."
    }
  ],
  "sourcesHeading": "Officiella källor och vidare läsning",
  "sources": [
    {
      "label": "Apple: WeatherKit-prognoser och regional tillgänglighet",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: prognosplats, perioder och vädervärden",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ],
  "seeAlso": []
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
