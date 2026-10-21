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
  "title": "Googles hemliga iCal-adress: skilj prenumeration från delning",
  "short": "Den hemliga iCal-adressen",
  "description": "Förstå Googles hemliga iCal-adress, kontoanslutningar och delade flöden. Hantera en spridd adress utan löften om snabba uppdateringar eller raderade kopior.",
  "lede": "En kalenderadress, en kontoanslutning och en inbjudan fyller olika funktioner. Ta reda på vad du har innan du använder det för att visa schemat i en annan app. Guiden publiceras av Arte Soft, utvecklaren bakom Cloud Calendars.",
  "commonBelief": "En hemlig kalenderadress är en personlig inbjudan som kan återkallas för en enda mottagare.",
  "sections": [
    {
      "heading": "Välj anslutning efter uppgiften",
      "body": [
        "Google skiljer mellan att logga in i en annan kalenderapp och att visa kalendern via en hemlig iCal-adress. Kontoanslutningen kan stödja redigering; adressen ger en prenumeration för enbart visning. Google beskriver den hemliga adressen som avsedd för eget bruk och avråder från att lämna den till andra.",
        "Att visa ditt eget arbetsschema i en annan kompatibel kalender är exempelvis något annat än att ge en kollega löpande åtkomst. Börja med målet: läsa ditt schema, samarbeta med en viss person eller sprida en tidtabell till en publik. Välj inte en webbadress bara för att den är lätt att klistra in."
      ]
    },
    {
      "heading": "Kontrollera kalendern, inte bara kontot",
      "body": [
        "I Googles datorinstruktioner finns den hemliga adressen i iCal-format under integrationsinställningarna för den valda kalendern. Kontrollera kalenderns namn först. Administratörer på arbetet eller i skolan kan begränsa alternativet; en saknad adress är inte ett skäl att publicera kalendern i stället.",
        "Håll adressen borta från skärmbilder, offentliga supportinlägg och delade anteckningar. När du ber om hjälp, beskriv kontotyp, kalendernamn och anslutningsmetod utan att lämna webbadressen. Vanligen behöver supporten identifiera anslutningen innan något händelseinnehåll behövs."
      ]
    },
    {
      "heading": "Kontrollera vad den mottagande appen faktiskt lade till",
      "body": [
        "En prenumeration följer ett flöde; en importerad fil skapar en separat kopia. Läs mottagarappens instruktioner och bekräfta vilken åtgärd du använder. Om du bara öppnar en hämtad kalenderfil ska du inte utgå från att mötena följer framtida ändringar.",
        "Använd en välbekant, vanlig händelse utan känsliga uppgifter för att jämföra kalendernamn, datum och detaljer. Undvik en andra prenumeration för att felsöka den första: två synliga kopior kan få en fördröjd uppdatering att likna en konflikt. Dölj en kalender tillfälligt när du identifierar källan."
      ]
    },
    {
      "heading": "Skilj Google-länkar från Cloud Calendars-länkar",
      "body": [
        "Cloud Calendars har egna sätt att dela händelser och kalendrar, inklusive prenumerationsflöden. Dessa är inte Googles hemliga adresser. Ta reda på om avsändaren delat en händelse, en kalender eller en kontobaserad inbjudan innan du väljer hur den ska öppnas.",
        "En mottagare i Cloud Calendars kan ha rollen Reader, Writer eller Owner. En flödesadress är inte i sig bevis på redigeringsrätt. En Google-adress för visning gör dig inte heller till kalenderägare. Fråga avsändaren i vilket system ändringar ska göras."
      ]
    },
    {
      "heading": "Ta hänsyn till hur mottagaren uppdaterar kalendern",
      "body": [
        "En prenumeration lovar inte omedelbar leverans. Cloud Calendars-flöden innehåller ett föreslaget uppdateringsintervall, men den mottagande appen avgör när ändringar hämtas och visas. En gammal tid på en enhet bevisar inte i sig att arrangören glömt att spara ändringen.",
        "För ett möte samma dag, jämför med arrangörens aktuella schema och bekräfta viktiga ändringar direkt. Anteckna vilken kalender som fortfarande visar gamla uppgifter och när du kontrollerade den. Importera inte händelsen upprepade gånger och radera inte källkalendern för att tvinga fram uppdatering."
      ]
    },
    {
      "heading": "Hantera en spridd adress utan löften om återkallade kopior",
      "body": [
        "Google beskriver hur en röjd hemlig adress återställs så att den gamla blir ogiltig och ersätts av en ny. Identifiera dina egna appar som använder den så att deras prenumerationer kan uppdateras efteråt. Att återställa en adress är något annat än att ta bort en namngiven samarbetspartner.",
        "Tidigare sparade möten, exporter och skärmbilder är en separat fråga. En ändrad länk visar inte att alla äldre kopior har försvunnit. Om information skickats till fel publik, bedöm innehållet och mottagarna i stället för att se en lyckad återställning som bevis på fullständig borttagning."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifiera om du har en kontoanslutning, inbjudan, prenumeration eller fil.",
    "Kontrollera källkalendern innan du kopierar en adress.",
    "Behåll Googles hemliga adress för dina egna kompatibla appar.",
    "Kontrollera att mottagarappen prenumererade i stället för att importera.",
    "Bekräfta brådskande ändringar med arrangören i stället för att lita på uppdateringstiden.",
    "Följ Googles återställningsråd om adressen röjts och uppdatera avsedda anslutningar."
  ],
  "faq": [
    {
      "q": "Kan jag ge den hemliga adressen till en kollega?",
      "a": "Google rekommenderar att den används i dina egna appar. Använd kalenderns delningskontroller och välj rätt behörighet när någon annan behöver åtkomst."
    },
    {
      "q": "Kan jag redigera originalet via en prenumeration?",
      "a": "Googles hemliga iCal-adress är för visning. Redigering kräver en lämplig kontoanslutning och behörighet; Cloud Calendars-roller är ett separat upplägg."
    },
    {
      "q": "Raderar en återställning gamla möten överallt?",
      "a": "Den gör den gamla Google-adressen ogiltig. Den visar inte att separat sparade filer, möten eller skärmbilder har tagits bort."
    }
  ],
  "sourcesHeading": "Leverantörernas vägledning och vidare läsning",
  "sources": [
    {
      "label": "Google: kontoanslutningar och hemliga iCal-adresser",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    },
    {
      "label": "Google: dela en kalender",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: import, prenumeration och uppdateringstid",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "updated": "2026-10-21",
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "taking-back-a-calendar-you-shared",
    "sharing-one-event-not-your-calendar"
  ]
},

  'what-guests-can-do-to-your-event': {
  "title": "Gästbehörigheter i Google Kalender: redigering, inbjudningar och gästlista",
  "short": "Gästernas behörigheter",
  "description": "Kontrollera Googles gästbehörigheter och standardinställningar. Skilj inbjudningsrättigheter från kalenderåtkomst och roller i Cloud Calendars.",
  "lede": "Att en gäst kan svara på en inbjudan beskriver inte allt personen kan göra. Granska behörigheterna innan samma inbjudan används för ett team, kunder eller en offentlig träff. Guiden publiceras av Arte Soft, utvecklaren bakom Cloud Calendars.",
  "commonBelief": "Inbjudna gäster kan bara tacka ja eller nej, och alla appar erbjuder samma behörighetskontroller.",
  "sections": [
    {
      "heading": "Börja med arrangören och originalhändelsen",
      "body": [
        "Öppna rätt händelse i Google Kalender med arrangörens konto eller ett konto som får hantera den. Kontrollera kalender, datum och arrangör innan behörigheter ändras. Ett separat importerat möte är ingen tillförlitlig plats att styra originalinbjudan från.",
        "För ett teammöte, bestäm vem som får boka om, bjuda in andra och se deltagarna. Det är separata beslut. En gäst som behöver delta behöver inte nödvändigtvis kunna hantera mötet."
      ]
    },
    {
      "heading": "Bestäm om gäster ska få ändra mötet",
      "body": [
        "Google beskriver ett alternativ för att ändra händelsen under gästbehörigheter i datorns händelseredigerare. Det är en bred samarbetsbehörighet, inte bara ett sätt att föreslå en ny tid. Enligt Google omfattar den hantering av händelsen, redigering av fält, visning av gäster och bokning av rum.",
        "En betrodd medarrangör som ordnar en workshop kan behöva den flexibiliteten. En kund som kommer till ett bokat besök kanske inte behöver den. Utgå från ansvaret du ger gästen och kontrollera den sparade händelsen i stället för en annan möteskonfiguration."
      ]
    },
    {
      "heading": "Granska inbjudningar och gästernas synlighet separat",
      "body": [
        "Googles händelsemodell skiljer rätten att bjuda in andra från rätten att se övriga gäster. Granska båda tillsammans med redigeringsrätten. Att stänga av en funktion innebär inte att den andra är kontrollerad, och ett visat standardval bevisar inte en befintlig händelses inställningar.",
        "När kunderna saknar koppling till varandra, överväg om en gemensam inbjudan alls passar. Uppgifter som redan finns i mejl, beskrivningar eller vidarebefordrade meddelanden ligger utanför den aktuella gästlistekontrollen. Lägg inte känsliga deltagaruppgifter i beskrivningen och förvänta dig att en dold lista döljer dem."
      ]
    },
    {
      "heading": "Kontrollera standardval och viktiga händelser",
      "body": [
        "Google beskriver även standardbehörigheter för gäster i händelseinställningarna, inklusive ändringsrätt. Kontrollerna finns alltså inte bara på varje enskild händelse. Granska standardvalen när ditt vanliga bokningsmönster ändras och kontrollera sedan viktiga befintliga inbjudningar var för sig.",
        "För ett återkommande möte, bekräfta vilken förekomst eller serie du redigerar innan du sparar. Anta inte att en ändrad inställning har skrivit om äldre inbjudningar. Testa tillsammans med en kollega på ett överenskommet exempel utan känsliga uppgifter, inte genom att flytta eller avboka ett riktigt kundmöte."
      ]
    },
    {
      "heading": "Håll Cloud Calendars-rollerna åtskilda",
      "body": [
        "Cloud Calendars har ett separat delningssystem med Reader, Writer och Owner. Reader ger visning och synkronisering; Writer tillåter redigering; Owner hanterar också delning och åtkomst med den inbjudna identiteten. Dessa roller är inte reglage för Googles tre gästbehörigheter.",
        "Om en Google-specifik behörighet är viktig, granska originalhändelsen i Google Kalender. Att en deltagare syns i Cloud Calendars visar inte att alla Googles gästinställningar kan ändras där. Håll isär ägartjänsten och mottagarens identitet när du undersöker en saknad kontroll eller misslyckad ändring."
      ]
    },
    {
      "heading": "Verifiera resultatet och tydliggör ansvaret",
      "body": [
        "Öppna originalhändelsen igen efter att du sparat och kontrollera inställningarna. Be vid behov en behörig kollega bekräfta vad det egna kontot kan göra. Dela inte lösenord eller privata gästuppgifter som genväg för att kontrollera åtkomsten.",
        "Skilj deltagande från behörigheter. Redigeringsrätt, en importerad kopia och ett registrerat ja-svar är olika saker. I Cloud Calendars är ett mottagningskvitto för en delning inte ett närvarosvar. För viktiga möten, be om det deltagarsvar du behöver och tydliggör vem som ansvarar för schemaändringar."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifiera arrangörskontot och originalhändelsen.",
    "Bestäm vem som hanterar mötet, bjuder in andra och ser gäster.",
    "Kontrollera Google-händelsens faktiska gästbehörigheter.",
    "Granska standardval utan att anta att befintliga händelser ändras.",
    "Behandla Cloud Calendars-roller som ett separat system.",
    "Öppna den sparade händelsen igen och bekräfta deltagande separat."
  ],
  "faq": [
    {
      "q": "Kan en gäst ändra tiden för mitt möte?",
      "a": "Google stöder ändringsbehörighet. Kontrollera händelsen och gästens åtkomst; dra inte slutsatsen enbart av att personen fått en inbjudan."
    },
    {
      "q": "Ställs alla gästbehörigheter in på varje händelse?",
      "a": "Nej. Google beskriver också standardbehörigheter. Kontrollera dem för framtida bokningar och granska viktiga befintliga händelser direkt."
    },
    {
      "q": "Tar en dold gästlista bort uppgifter som redan skickats?",
      "a": "Det visar inte att tidigare mejl, beskrivningar, skärmbilder eller fristående kopior tagits bort. Granska separat vad som faktiskt spreds."
    }
  ],
  "sourcesHeading": "Leverantörernas vägledning och vidare läsning",
  "sources": [
    {
      "label": "Google: samarbete och standardbehörigheter för gäster",
      "url": "https://support.google.com/a/users/answer/13293412?hl=en"
    },
    {
      "label": "Google: fält för gästbehörigheter",
      "url": "https://developers.google.com/workspace/calendar/api/v3/reference/events"
    }
  ],
  "updated": "2026-10-21",
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "sharing-one-event-not-your-calendar"
  ]
},

  'google-calendars-that-never-reach-your-iphone': {
  "title": "En Google-kalender saknas på iPhone: kontrollera anslutning och val",
  "short": "Google-kalendrar saknas på iPhone",
  "description": "Hitta en saknad Google-kalender genom att kontrollera kontoåtkomst, synlighet och anslutningen som Apple Kalender eller Cloud Calendars använder.",
  "lede": "Om en Google-kalender syns men en annan saknas, ta först reda på var det saknade schemat finns. Kontoåtkomst, val av kalendrar och tillgängliga händelser är olika kontroller. Guiden publiceras av Arte Soft, utvecklaren bakom Cloud Calendars.",
  "commonBelief": "Alla saknade Google-kalendrar beror på en dold synklista, och direktanslutning garanterar att allt visas.",
  "sections": [
    {
      "heading": "Bekräfta att kalendern finns för kontot",
      "body": [
        "Öppna Google Kalender på webben med samma konto som du tänker använda på telefonen. Leta efter själva kalendern, inte bara en välbekant händelsetitel. Två konton kan ha liknande kalendernamn, och en inbjudan till jobbmejlen ger inte automatiskt privatkontot åtkomst.",
        "Om kalendern saknas även där, börja med ägaren eller delningsinbjudan. Vid gruppåtkomst, kontrollera medlemskapet och vilken grupp som fått behörighet. Ta inte bort telefonkontot medan den grundläggande åtkomstfrågan är olöst."
      ]
    },
    {
      "heading": "Skilj en dold kalender från en saknad",
      "body": [
        "Google beskriver hur du väljer kalendrar för visning via menyn i Google Kalender-appen. En kalender som finns i listan men inte är markerad har ett synlighetsproblem. En kalender utanför listan kräver annan felsökning, exempelvis av inbjuden identitet, godkännande eller anslutning.",
        "En delningsinbjudan via mejl och en prenumerationsadress är också olika vägar. Google skiljer en ny prenumeration via datorns webbläsare från att öppna en kalender som redan delats via mejl. Behåll originalinbjudan, men publicera inte privata länkar i offentliga supportinlägg."
      ]
    },
    {
      "heading": "Identifiera hur appen får Google-data",
      "body": [
        "Apple Kalender kan ansluta via Google-kontot som är konfigurerat på enheten. Googles instruktioner omfattar att aktivera kalendrar för kontot. Följ aktuell vägledning för din iOS-version; en separat apps inställningar är inte samma sak som enhetens konto.",
        "Cloud Calendars erbjuder också direkt Google-inloggning. Fastställ konto och anslutningsväg innan du lägger till ytterligare en anslutning. Om samma schema kommer både genom enhetskalendern och direkt, jämför kalenderidentiteterna innan du drar slutsatsen att Google har duplicerat händelsen."
      ]
    },
    {
      "heading": "Kontrollera valen i Cloud Calendars utan att anta full täckning",
      "body": [
        "I Cloud Calendars, granska kalendrarna för rätt Google-konto och välj dem du vill använda. Google-synkroniseringen tar hänsyn till kalenderurvalet. En lyckad inloggning visar inte i sig att alla kalendrar valts eller att varje begärd uppdatering slutförts.",
        "Direktanslutning är ett annat sätt att få Google-data, inte ett löfte att varje åtkomlig kalender visas. Om den finns på Googles webbplats men saknas i Cloud Calendars, anteckna konto, kalendernamn och anslutningsmetod för supporten. Använd originaltjänsten för brådskande planering under utredningen."
      ]
    },
    {
      "heading": "Skilj saknad kalender från saknade datum",
      "body": [
        "Om kalendern finns i listan men ett möte saknas, jämför exakt datum i Google Kalender. Kontrollera att händelsen hör till vald kalender och att det är samma förekomst av ett återkommande möte. En liknande titel i en annan kalender är inte samma källpost.",
        "Anta inte att appen har hämtat hela historiken och alla avlägsna framtida händelser. Cloud Calendars Google-synkronisering begär ett begränsat datumintervall. En tom historisk sökning bevisar därför inte att Google har raderat händelsen; kontrollera originaltjänsten innan du ändrar eller återskapar något."
      ]
    },
    {
      "heading": "Be om hjälp med en jämförelse, inte en återställning",
      "body": [
        "Anteckna app, kontotyp, kalendernamn, ett exempeldatum och var schemat syns. Ta med eventuellt felmeddelande, utan privata uppgifter. Det skiljer behörighets-, urvals- och synkproblem bättre än att säga att hela kontot är trasigt.",
        "Bekräfta aktuella uppgifter med arrangören vid tidskritiska planer. Undvik att radera konton, importera upprepade kopior eller flytta händelser som första test. När anslutningsproblemet är förstått, kontrollera samma exempel innan du ändrar fler inställningar."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Jämför rätt konto och kalender i Google Kalender på webben.",
    "Kontrollera om kalendern saknas eller bara inte är vald.",
    "Identifiera enhetssynk, direktanslutning eller prenumeration.",
    "Granska valda kalendrar för rätt konto i Cloud Calendars.",
    "Jämför ett exakt händelsedatum hos originaltjänsten.",
    "Rapportera skillnaden utan privata adresser eller kontoåterställning."
  ],
  "faq": [
    {
      "q": "Visar direkt Google-inloggning alla kalendrar?",
      "a": "Anta inte full täckning. Konto, kalenderlista, urval och lyckad synkronisering spelar roll. Jämför med Google Kalender på webben."
    },
    {
      "q": "Ska jag ta bort kontot och lägga till det igen?",
      "a": "Kontrollera först identitet, åtkomst, synlighet och anslutning. Återanslutning ger inte en behörighet som ägaren inte har beviljat."
    },
    {
      "q": "Betyder en saknad gammal händelse att den raderats?",
      "a": "Nej. Kontrollera ursprunglig Google-kalender och datum. Appens datumintervall eller sökning kan skilja sig från leverantörens sparade historik."
    }
  ],
  "sourcesHeading": "Leverantörernas vägledning och vidare läsning",
  "sources": [
    {
      "label": "Google: lägga till händelser i Apple Kalender",
      "url": "https://support.google.com/calendar/answer/99358?hl=en&co=GENIE.Platform%3DiOS"
    },
    {
      "label": "Google: prenumerationer och kalendersynlighet",
      "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
    },
    {
      "label": "Google: kalenderlistans funktion",
      "url": "https://developers.google.com/workspace/calendar/api/v3/reference/calendarList/list"
    }
  ],
  "updated": "2026-10-21",
  "seeAlso": [
    "why-a-shared-calendar-does-not-appear",
    "icloud-google-and-outlook-in-one-view"
  ]
},

  'taking-back-a-calendar-you-shared': {
  "title": "Sluta dela en kalender och kontrollera kvarvarande åtkomst",
  "short": "Granska och ta bort åtkomst",
  "description": "Skilj mellan personer, grupper, offentlig åtkomst och prenumerationslänkar när du slutar dela. Kontrollera ändringen och förstå varför kopior kan finnas kvar.",
  "lede": "Börja med att ta reda på hur åtkomsten gavs när ett samarbete avslutas. Att ta bort en person, stänga av publicering och återställa en prenumerationsadress är olika åtgärder. Guiden publiceras av Arte Soft, utvecklaren bakom Cloud Calendars.",
  "commonBelief": "Att ta bort en mottagare återkallar genast alla kalenderkopior och stänger alla andra vägar till schemat.",
  "sections": [
    {
      "heading": "Identifiera kalendern och delningssättet",
      "body": [
        "Kontrollera ägarkontot, kalendern och den avsedda målgruppen innan du ändrar åtkomst. En Google-kalender som delas med en viss kollega är något annat än en offentlig kalender, gruppbehörighet eller prenumerationsadress. Cloud Calendars har också egna sätt att dela händelser och kalendrar.",
        "En föreningssekreterare kan till exempel få redigeringsrätt genom en personlig inbjudan medan medlemmarna följer ett publicerat schema. Att ta bort sekreterarens behörighet avgör inte vad som ska hända med medlemmarnas prenumerationer. Lista de delningar du faktiskt har skapat."
      ]
    },
    {
      "heading": "Ta bort rätt behörighet i Google",
      "body": [
        "Google beskriver separata inställningar för personer eller grupper, delning inom organisationen och offentlig åtkomst. Öppna rätt kalenders delningsinställningar på en dator och ändra den aktuella posten eller den bredare inställningen. Kontrollera först vilket konto som är inloggat och kalenderns namn.",
        "En person kan fortfarande ha åtkomst via en grupp eller en bredare publicering. Granska hela upplägget i stället för att upprepade gånger ta bort samma e-postadress. Arbetsplatsens eller skolans regler kan begränsa inställningarna; följ vid behov ägarens eller administratörens godkända förfarande."
      ]
    },
    {
      "heading": "Hantera den hemliga adressen separat",
      "body": [
        "Google anger att den hemliga iCal-adressen är till för eget bruk i en annan kalenderapp och inte ska lämnas till andra. Om adressen har spridits beskriver Google hur den återställs så att den gamla adressen blir ogiltig. Det är en annan åtgärd än att ta bort en namngiven person.",
        "Innan du ändrar en prenumerationsadress som du själv använder, identifiera appar och verktyg som är beroende av den så att du sedan kan ansluta de avsedda igen. Klistra inte in den hemliga webbadressen i ett offentligt supportinlägg eller skicka den som bevis för att du hittat rätt kalender. Ange kalenderns namn och anslutningstyp i stället."
      ]
    },
    {
      "heading": "Skilj Cloud Calendars-mottagare från prenumerationslänkar",
      "body": [
        "I Cloud Calendars är mottagaråtkomst till en händelse eller kalender och ett utfärdat prenumerationsflöde olika mekanismer. Kontrollera den faktiska delningen och länken innan du väljer åtgärd. Att ta bort en identifierad mottagare garanterar inte att alla tidigare spridda länkar eller fristående kopior återkallas.",
        "Om en medarrangör bara ska sluta redigera, överväg rollen och vilka som fortsatt ska ha åtkomst i stället för att radera schemat. Om hela samarbetet avslutas, fastställ vem som äger kalendern och vem som ska behålla den. Att lämna en mottagen kalender och radera en egen är olika beslut."
      ]
    },
    {
      "heading": "Kontrollera resultatet utan löften om omedelbar försvinning",
      "body": [
        "Kontrollera att ändringen sparats i systemet som äger kalendern. Om en behörig kollega kan hjälpa till, bekräfta visning eller redigering från kollegans eget konto utan att dela lösenord. Skilj nekad åtkomst från en gammal händelse som fortfarande syns i en importerad eller cachad kopia.",
        "Lova inte ett universellt uppdateringsintervall eller att inga aviseringar skickas. Vid en överlämning till en grupp, tala om vilket schema som gäller framöver. En synlig gammal post visar inte i sig om personen har aktiv åtkomst, en annan behörighet eller en fristående kopia."
      ]
    },
    {
      "heading": "Hantera tidigare kopior som en separat uppgift",
      "body": [
        "Exporterade filer, skärmbilder, meddelanden och separat sparade möten kan finnas kvar efter ändrad åtkomst. Avgör vilka kopior som är relevanta för överlämningen och diskutera hanteringen med de berörda. En ändrad kalenderbehörighet visar inte vad varje mottagare redan har sparat.",
        "Behåll nödvändiga källuppgifter medan du kontrollerar resultatet. Flytta inte känsliga möten till en annan delad kalender bara för att få den gamla att se tom ut, och avboka inte riktiga inbjudningar som åtkomsttest. Anteckna kalendern, åtkomstvägen och ändringen så att senare felsökning har en tydlig utgångspunkt."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifiera ägarkontot, kalendern och delningssättet.",
    "Granska personer, grupper och bredare publicering separat.",
    "Använd rätt delningsinställningar i Google eller Cloud Calendars.",
    "Bedöm återställning av en spridd hemlig adress separat.",
    "Kontrollera det sparade åtkomstresultatet utan att dela inloggningsuppgifter.",
    "Planera för tidigare exporter och kopior separat från aktiv åtkomst."
  ],
  "faq": [
    {
      "q": "Stänger borttagning av en person den offentliga kalendern eller gruppåtkomsten?",
      "a": "Utgå inte från det. Kontrollera varje faktisk åtkomstväg. Google beskriver separata inställningar för personer, grupper och bredare publicering."
    },
    {
      "q": "Försvinner kalendern genast och utan avisering?",
      "a": "Det finns inget universellt löfte om försvinnande, aviseringar eller uppdateringstid. Bekräfta den sparade ändringen och skilj aktiv åtkomst från cachad eller importerad information."
    },
    {
      "q": "Krävs Advanced för att ta bort åtkomst till en Google-kalender?",
      "a": "Advanced tar bort annonser i Cloud Calendars. Googles delningskontroller beror på ägarskap, behörigheter och organisationsregler, inte på den appnivån."
    }
  ],
  "sourcesHeading": "Vägledning om åtkomst och prenumerationer",
  "sources": [
    {
      "label": "Google: delningsinställningar och avslutad åtkomst",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Google: kontosynkronisering och hemliga iCal-adresser",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    }
  ],
  "updated": "2026-10-21",
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "the-secret-address-of-a-google-calendar"
  ]
},
};
