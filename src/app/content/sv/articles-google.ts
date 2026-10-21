import { LocalisedArticle } from '../types';

/** De sex Google-artiklarna: konkreta frågor, raka svar. */
export const GOOGLE_SV: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
  "title": "Delningsbehörigheter i Google Kalender: kontrollera åtkomsten du ger",
  "short": "Åtkomst och integritet i Google Kalender",
  "description": "Välj åtkomst till tillgänglighet, detaljer eller redigering. Kontrollera offentlig åtkomst och gruppåtkomst utöver individuella behörigheter.",
  "lede": "Bestäm vad mottagaren behöver göra innan du delar en kalender. Att planera runt din tid, läsa detaljer och sköta kalendern är olika uppgifter. Guiden publiceras av Arte Soft, utvecklaren av Cloud Calendars.",
  "commonBelief": "En begränsad inställning för en person skulle garantera att personen inte kan se detaljer via någon annan väg.",
  "sections": [
    {
      "heading": "Anpassa åtkomsten efter uppgiften",
      "body": [
        "En kollega som söker en tid kan behöva din tillgänglighet utan detaljer om möten. Den som sköter ett projektschema behöver en annan lösning. Bestäm uppgiften först och granska sedan behörigheten i kalenderns aktuella delningsinställningar.",
        "Google skiljer mellan tillgänglighet, händelsedetaljer och flera redigeringsnivåer. Ett alternativ begränsar åtkomsten till privata händelser; ett annat tillåter redigering och detaljer; det mest omfattande tillåter även delningsadministration. Alla alternativ med ordet ändringar betyder inte samma sak."
      ]
    },
    {
      "heading": "Granska hela kalenderns åtkomst, inte bara en person",
      "body": [
        "Kontrollera om kalendern är offentlig, tillgänglig för organisationen eller delad via en grupp, utöver namngivna personer. Google anger att bredare åtkomst kan ha företräde framför en snävare tilldelning: att begränsa en person gör inte redan publicerade detaljer privata.",
        "Tänk på ett föreningsschema publicerat för medlemmar. Kontrollera kalenderns publik innan du lägger in ett personligt möte. Behörigheten bredvid en vän är inte den enda relevanta inställningen. Lägg privata möten i en lämplig kalender."
      ]
    },
    {
      "heading": "Använd Googles inställningar för rätt kalender",
      "body": [
        "I Google Kalender på en dator hittar du den avsedda kalendern, öppnar dess meny och går till delningsinställningarna. Google beskriver separata delar för personer eller grupper och bredare åtkomst. Kontrollera kalendernamnet och det inloggade kontot innan du ändrar något.",
        "Bekräfta mottagarens avsedda Google-identitet vid inbjudan. Om kalendern inte hittas, kontrollera adressen och inbjudningsmeddelandet i stället för att ge bredare åtkomst för att få den att visas. Saknad visning och otillräcklig redigeringsbehörighet är olika problem."
      ]
    },
    {
      "heading": "Testa utan privata möten",
      "body": [
        "Använd en vanlig testhändelse utan privat titel, anteckningar, plats eller gästlista. Be mottagaren bekräfta vad som syns och, bara när redigering behövs och är tillåten, vad som går att ändra. Lämna inte ut dina inloggningsuppgifter för testet.",
        "Anteckna kalendern och rollen och kontrollera resultatet efter en ändring. Det prövar den tänkta lösningen, men bevisar inte att tidigare läst eller kopierad information har försvunnit. Publicera inte ett verkligt arbetsschema som test."
      ]
    },
    {
      "heading": "Skilj arbetsregler från appens abonnemang",
      "body": [
        "Google anger att arbetsplatsens eller skolans administratörer kan begränsa delning. Om inställningen saknas, använd organisationens godkända väg. Publicera inte arbetsinformation för att kringgå en kontobegränsning.",
        "Cloud Calendars kan visa anslutna kalendrar, men abonnemangsnamnen ändrar inte Googles behörigheter. Advanced tar bort annonser; det är inte en betalning som ger någon åtkomst till varje Google-händelse. Kontrollera delningen hos leverantören och det accepterade resultatet, inte bara om en lokal redigerare är tillgänglig."
      ]
    },
    {
      "heading": "Granska och ta bort åtkomst som inte behövs",
      "body": [
        "När ett projekt tar slut, granska mottagare, grupper och eventuell bredare publicering. Att ta bort en person är bara en del av kontrollen när andra vägar finns. Kom överens om vem som sköter schemat och hur framtida åtkomständringar hanteras.",
        "Google beskriver borttagning av personer eller grupper separat från avstängning av bredare delning. Återkallad åtkomst kan inte återta exporterade filer, skärmbilder eller information som kopierats. Följ upp det separat med berörda personer i stället för att lova att en inställning raderar varje äldre kopia."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifiera kalendern och mottagarens uppgift.",
    "Granska individuell åtkomst, grupper, organisation och offentlig åtkomst.",
    "Välj rätt behörighet i Googles aktuella inställningar.",
    "Kontrollera mottagarens identitet innan åtkomsten ändras.",
    "Kontrollera en ofarlig testhändelse från mottagarens sida.",
    "Granska gamla åtkomstvägar utan att anta att tidigare kopior återtas."
  ],
  "faq": [
    {
      "q": "Har en individuell begränsning företräde framför en offentlig kalender?",
      "a": "Nej. Google anger att bredare kalenderbehörigheter har företräde när inställningar står i konflikt. Granska offentliga inställningar och organisationsåtkomst utöver personens post."
    },
    {
      "q": "Visar alla redigeringsbehörigheter privata händelser på samma sätt?",
      "a": "Nej. Google beskriver en redigeringsbehörighet med begränsad åtkomst till privata händelser separat från andra redigerings- och delningsalternativ. Läs den exakta aktuella behörigheten innan du väljer."
    },
    {
      "q": "Ändrar ett köp av Advanced Googles delningsrättigheter?",
      "a": "Nej. Advanced tar bort annonser i Cloud Calendars. Leverantörsåtkomst beror på kalenderns behörigheter och organisationens eventuella begränsningar."
    }
  ],
  "sourcesHeading": "Aktuell Google-vägledning om behörigheter och delning",
  "sources": [
    {
      "label": "Google: välj kalenderbehörigheter",
      "url": "https://support.google.com/calendar/answer/15716974?hl=en"
    },
    {
      "label": "Google: dela en kalender och ta bort åtkomst",
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
    "title": "En kalender delades med dig och den finns inte där",
    "short": "Delad kalender syns inte",
    "description": "Saknas en delad Google-kalender? Kontrollera inbjudet konto, grupp, synlighet och vilken typ av länk du fått.",
    "lede": "Guiden är skriven av Arte Soft, utvecklaren av Cloud Calendars. Skilj först på saknad åtkomst och en kalender som bara är dold.",
    "commonBelief": "Att acceptera en delad kalender lägger den i telefonen.",
    "sections": [
      {
        "heading": "Kontrollera konto och grupp",
        "body": [
          "Jämför mottagaren av inbjudan med Google-kontot på telefonen och i webbläsaren. Öppna länken med rätt konto. Google stöder delning med personer och Google-grupper. Vid gruppåtkomst bör gruppadministratören bekräfta ditt medlemskap och kalenderägaren kontrollera att rätt grupp har åtkomst. Ett vidarebefordrat mejl ger inte i sig behörighet."
        ]
      },
      {
        "heading": "Dold, saknad eller begränsad?",
        "body": [
          "Öppna menyn i Google Kalender på iPhone eller iPad. Finns kalendern i listan utan bock, välj den. Saknas den, be ägaren kontrollera åtkomsten: En begäran är inte ett godkännande. Arbets- eller skolregler kan begränsa delning. Jämför samma konto i Google Kalender på webben. Fungerar det där, kontrollera anslutet konto och valda kalendrar i den andra appen. Läsbehörighet tillåter inte redigering."
        ]
      },
      {
        "heading": "Identifiera länken",
        "body": [
          "En delningsinbjudan innehåller också en länk; alla länkar är inte ICS-prenumerationer. Fråga om den ger åtkomst till en Google-kalender eller publicerar ett skrivskyddat flöde. Enligt Google kräver en ny kalenderprenumeration en webbläsare på dator; att öppna en kalender som redan delats via mejl är en annan åtgärd. Flödets uppdatering beror på mottagartjänsten. Det finns ingen allmän väntetid; bekräfta brådskande ändringar med organisatören."
        ]
      }
    ],
    "claims": {},
    "faq": [
      {
        "q": "Kan en Google-grupp få åtkomst?",
        "a": "Ja. Kontrollera vald grupp, ditt medlemskap och organisationens regler. Ett vidarebefordrat gruppmejl bevisar inte åtkomst."
      },
      {
        "q": "Ska jag ta bort och ansluta kontot igen?",
        "a": "Kontrollera först identitet, behörigheter och synlighet och jämför webbkalendern. En ny anslutning ger inga saknade rättigheter."
      }
    ],
    "practical": [
      "Bekräfta inbjudet konto och gruppmedlemskap.",
      "Markera kalendern om den finns men är dold.",
      "Be ägaren kontrollera åtkomst innan anslutningar ändras."
    ],
    "sourcesHeading": "Källor och vidare läsning",
    "sources": [
      {
        "label": "Google: Kontrollera konto och grupp",
        "url": "https://support.google.com/calendar/answer/37082?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Dold, saknad eller begränsad?",
        "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Identifiera länken",
        "url": "https://support.google.com/calendar/answer/37648?hl=en"
      }
    ],
    "seeAlso": [
      "who-can-see-what-in-google-calendar",
      "google-calendars-that-never-reach-your-iphone"
    ]
  },

  'the-secret-address-of-a-google-calendar': {
    title: 'Vad den hemliga adressen till en Google-kalender verkligen röjer',
    short: 'Den hemliga iCal-adressen',
    description:
      'Google erbjuder en privat adress som visar hela din kalender för den som håller den. Vad den blottar, och varför den inte kan tas tillbaka i tysthet.',
    lede: 'Djupt i inställningarna för varje Google-kalender finns en länk som visar allt på den. Ingen inloggning, ingen behörighet, ingen notering om vem som öppnade den.',
    commonBelief: 'Att en privat adress är privat för att den är svår att hitta.',
    sections: [
      {
        heading: 'En länk är ett lösenord som inte kan bytas för en enda person',
        body: [
          'Den hemliga adressen bär fullständiga detaljer — titlar, tider, platser, anteckningar. Den som har länken ser dem, och det finns ingen lista över vilka det är.',
          'Dess enda skydd är den slumpmässiga delen av adressen. Det är ett äkta skydd mot gissningar och inget alls mot vidarebefordran, en delad skärm eller ett dokument som överlever anställningen.',
        ],
      },
      {
        heading: 'Att återställa den förstör den för alla',
        body: [
          'Du kan återställa adressen, vilket dödar den gamla. Den dör också för varje kollega, varje instrumentpanel och varje skript som tyst lutade sig mot den, utan förvarning till någon av dem.',
          'Det är argumentet för att aldrig dela ut adressen till en kalender du lever i. Publicera en kalender gjord för ändamålet, så kostar återställningen ingenting.',
        ],
      },
    ],
    claims: {
      linkLength: 'Slumptecken som skyddar en delningslänk av vårt slag',
      sharePrice: 'Vad det kostar att dela en händelse från appen',
    },
    faq: [
      {
        q: 'Vad kan någon göra med den hemliga adressen till min kalender?',
        a: 'Se allt på den — rubriker, tider, platser och anteckningar — utan inloggning, utan behörighet och utan att det någonstans noteras att de tittat.',
      },
      {
        q: 'Kan jag ta tillbaka en hemlig kalenderadress?',
        a: 'Bara genom att återställa den, vilket dödar den gamla för alla samtidigt: kollegor, instrumentpaneler och varje skript som tyst lutade sig mot den, utan förvarning.',
      },
      {
        q: 'Kan jag mejla den hemliga adressen till en kollega?',
        a: 'Behandla den som offentlig från det ögonblick den lämnar dina händer. Dess enda skydd är att vara svår att gissa, och vidarebefordran upphäver precis det.',
      },
    ],
    practical: [
      'Behandla den hemliga adressen som offentlig i samma stund den lämnar dina händer.',
      'Publicera aldrig adressen till kalendern du faktiskt använder.',
      'Återställ den när någon slutar, och säg till dem det går sönder för.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'taking-back-a-calendar-you-shared'],
  },

  'what-guests-can-do-to-your-event': {
    title: 'Vad dina gäster kan göra med en händelse',
    short: 'Gästernas behörigheter',
    description:
      'Tre kryssrutor avgör om en gäst kan flytta ditt möte, bjuda in främlingar eller läsa hela listan. De står på oftare än folk tror.',
    lede: 'Att bjuda in någon ger mer än en plats och en tid. I en vanlig Google-händelse ser en gäst oftast vilka fler som tillfrågats, och får ofta lägga till fler.',
    commonBelief: 'Att en gäst bara kan tacka ja eller nej.',
    sections: [
      {
        heading: 'De tre rutorna',
        body: [
          'Ändra händelse låter en gäst byta tid, plats och titel för alla. Sällan önskat, lätt kvarlämnat påslaget.',
          'Bjuda in andra låter en gäst lägga till människor du aldrig träffat. Se gästlistan visar alla tillfrågade och hur de svarat — helt i sin ordning i ett team, obekvämt hos en kund, fel i allt som liknar en grupp separata kunder.',
        ],
      },
      {
        heading: 'Där det tyst går fel',
        body: [
          'En händelse, många enskilda mottagare, synlig lista: nu har alla alla. Den enda rutan är skillnaden mellan ett möte och en läckt adressbok.',
          'Inställningarna hör till händelsen, inte till kontot, så de faller tillbaka till dina standardvärden varje gång och måste tänkas igenom på de händelser som betyder något, inte en gång för alla.',
        ],
      },
    ],
    claims: {
      sharePrice: 'Vad det kostar att skicka en enda händelse från appen',
    },
    faq: [
      {
        q: 'Ser gästerna varandra i en inbjudan från Google Kalender?',
        a: 'Som standard oftast ja. «Se gästlistan» visar alla inbjudna och deras svar: helt i sin ordning i ett team, obekvämt hos en kund, fel när gästerna är separata kunder.',
      },
      {
        q: 'Kan en gäst ändra tiden för mitt möte?',
        a: 'Om «ändra händelse» är ikryssat, ja, och ändringen gäller alla. Sällan önskat och lätt kvarlämnat påslaget.',
      },
      {
        q: 'Hur hindrar jag gäster från att bjuda in andra?',
        a: 'Stäng av «bjuda in andra» på själva händelsen. Inställningarna hör till händelsen och inte till kontot, så de faller tillbaka till dina standardvärden varje gång.',
      },
    ],
    practical: [
      'Stäng av «se gästlistan» för allt som går till människor som inte känner varandra.',
      'Låt «ändra händelse» vara av om inte någon verkligen planerar åt dig.',
      'Kolla rutorna på händelsen, inte i dina inställningar: där bor de.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'why-a-shared-calendar-does-not-appear'],
  },

  'google-calendars-that-never-reach-your-iphone': {
    title: 'Varför vissa Google-kalendrar aldrig når din iPhone',
    short: 'Google-kalendrar saknas på iPhone',
    description:
      'Ett Google-konto, flera kalendrar och bara en i telefonen. Synklistan som avgör det, och vad man gör i stället.',
    lede: 'Ditt Google-konto rymmer åtta kalendrar. Din iPhone visar två. Ingenting är trasigt: något du aldrig sett har valt åt dig.',
    commonBelief: 'Att lägga till ett Google-konto på iPhone lägger till kalendrarna i det.',
    sections: [
      {
        heading: 'En lista du aldrig fått se',
        body: [
          'Google för en lista per enhet över vilka kalendrar som får synka, och sekundära kalendrar — de delade, de prenumererade, de som någon gjorde för ett projekt — står ofta utanför den.',
          'Listan finns inte i iOS inställningar. Den bor på en egen Google-sida, och därför hittar man inget fel på det självklara stället och ingenting förändras.',
        ],
      },
      {
        heading: 'Den andra vägen',
        body: [
          'En app som talar direkt med Google använder inte den listan, så den visar varje kalender kontot faktiskt har, även dem telefonen tyst lät falla.',
          'Det för också ihop kontona. En vy som rymmer privat, arbete och delat är hela poängen; om telefonen hade synkat var och en upphör att vara en fråga.',
        ],
      },
    ],
    claims: {
      accounts: 'Kontotyper som en enda vy håller ihop',
      price: 'Vad Google-sidan kostar',
    },
    faq: [
      {
        q: 'Varför syns bara vissa av mina Google-kalendrar på iPhone?',
        a: 'Google för en lista per enhet över vilka kalendrar som får synka, och sekundära kalendrar — delade, prenumererade, skapade för ett projekt — står ofta utanför den.',
      },
      {
        q: 'Var finns synkinställningen för Google Kalender på iPhone?',
        a: 'Inte i iOS inställningar. Den bor på en egen Google-sida, och därför hittar man inget fel på det självklara stället och ingenting ändras.',
      },
      {
        q: 'Hur ser jag alla mina Google-kalendrar på iPhone?',
        a: 'Genom en app som frågar Google direkt i stället för genom enhetens lista. Den visar varje kalender kontot faktiskt har, även dem telefonen lät falla.',
      },
    ],
    practical: [
      'Kolla Googles synklista innan du utgår från att kontot är trasigt.',
      'Räkna med att prenumererade och delade kalendrar är uteslutna snarare än inkluderade.',
      'Håller du fler än ett par kalendrar, läs dem genom något som frågar Google direkt.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'icloud-google-and-outlook-in-one-view'],
  },

  'taking-back-a-calendar-you-shared': {
    title: 'Ta tillbaka en kalender du delat',
    short: 'Dra tillbaka åtkomst',
    description:
      'Att ta bort någon från en kalender stoppar det som kommer härnäst. Vad det inte gör är att göra ogjort det som redan skett.',
    lede: 'Att avsluta åtkomst är en tryckning. Att avgöra om en tryckning räcker tar något längre, för delning lämnar kopior efter sig.',
    commonBelief: 'Att ta bort en person tar bort det personen sett.',
    sections: [
      {
        heading: 'Vad som upphör och vad som blir kvar',
        body: [
          'Ta bort en person och kalendern försvinner ur dennes lista, omedelbart och utan meddelande. Framtida händelser når aldrig fram.',
          'Det som inte kommer tillbaka: inbjudningar personen redan har, händelser kopierade till den egna kalendern, allt som exporterats, och allt som en hemlig adress lämnats ut för. Åtkomsten slutar; minnet gör det inte.',
        ],
      },
      {
        heading: 'Det som överlever borttagningen',
        body: [
          'Har någon någonsin fått hantera delning kan den ha lagt till andra. Att ta bort personen lämnar dessa kvar — så blir en kalender delad med någon ingen minns att de bjudit in.',
          'Läs alltså hela listan i stället för att stryka ett namn, och gör det på vägen ut snarare än månader senare. Inget påminner dig, och delningar samlas bara på hög.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Månadskostnad för nivån där detta hanteras, i dollar',
    },
    faq: [
      {
        q: 'Raderar det någon redan sett att jag tar bort personen?',
        a: 'Nej. Inbjudningar personen redan har, händelser kopierade till den egna kalendern och allt exporterat blir kvar. Åtkomsten slutar, kopiorna inte.',
      },
      {
        q: 'Får personen veta att jag tagit bort åtkomsten?',
        a: 'Nej. Kalendern försvinner ur listan omedelbart och utan meddelande.',
      },
      {
        q: 'Varför är min kalender delad med någon jag aldrig bjudit in?',
        a: 'Någon med rätt att hantera delning lade till dem. Att ta bort den personen lämnar alla den lade till kvar — därför läser man hela listan och inte ett namn.',
      },
    ],
    practical: [
      'Läs hela åtkomstlistan, inte bara namnet du tänkte ta bort.',
      'Återställ den hemliga adressen om personen någonsin haft den.',
      'Utgå från att kopior överlever, och flytta det som är verkligt känsligt i stället för att dölja det.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
