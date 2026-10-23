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
  "updated": "2026-10-23",
  "title": "Kalender med väder på iPhone och iPad: planera dagen i en vy",
  "short": "Använd kalender och väder tillsammans",
  "description": "Jämför din kalender med vädret för den valda platsen på iPhone och iPad.",
  "lede": "Cloud Calendars samlar ditt schema och vädret i samma app för iPhone och iPad. Använd kalendern för att välja ett datum och vädervyn för att granska den valda platsen och tillgängliga prognostimmar. För planer utomhus bör du kontrollera den period som faktiskt är relevant i stället för att förlita dig på en dagssymbol. Den här guiden publiceras av Arte Soft, appens utvecklare.",
  "commonBelief": "Väder som visas bredvid en kalender beskriver automatiskt adressen för varje händelse, varje timme och varje framtida datum.",
  "sections": [
    {
      "heading": "Välj en verklig planeringsfråga",
      "body": [
        "Börja med en konkret händelse, till exempel ett besök i en park på eftermiddagen. Avgör vad som kan behöva ändras: tiden, platsen, förberedelserna eller beslutet att välja ett alternativ. Du behöver inte lägga om hela kalendern bara för att dagens symbol visar regn.",
        "Skriv ned aktivitetens faktiska start- och sluttid, inklusive förberedelsetid om det är relevant. En kalenderöversikt hjälper dig att hitta möjliga datum, medan prognoskontrollen gäller en viss plats och tidsperiod. Håll isär de två uppgifterna när du jämför alternativ."
      ]
    },
    {
      "heading": "Bekräfta väderplatsen innan du läser värdena",
      "body": [
        "Cloud Calendars visar väder för den aktuella eller valda platsen. Kontrollera den plats som visas i stället för att anta att en händelses adress automatiskt ändrar prognosen. En händelse i en annan stad kräver en jämförelse med vädret i den staden.",
        "En besökare kan till exempel planera ankomsten till ett museum medan telefonen fortfarande är hemma. Kontrollera prognosens plats och händelsens lokala tid innan du jämför dem. Värden som ser närliggande ut är inte bevis på att schema och väder använder samma plats."
      ]
    },
    {
      "heading": "Kontrollera timvis och daglig täckning var för sig",
      "body": [
        "Använd en post på dagsnivå för överblick och de tillgängliga timposterna för frågor som gäller en del av dagen. En bokning från två till fem kräver mer än en snabb blick på en enda symbol. Kontrollera om de relevanta timmarna faktiskt finns med.",
        "I den nuvarande appkällan visar dagslistan upp till tio dagar från WeatherKit. Det är separat från kalendernavigeringen och från de timmar som för närvarande tillhandahålls. En framtida händelse utökar inte vädertäckningen. Om perioden saknas, planera in en senare väderkontroll."
      ]
    },
    {
      "heading": "Förstå vad vädervärdet betyder",
      "body": [
        "Apple dokumenterar WeatherKit-data som temperatur, nederbörd, vind och UV, och vissa produkter är bara tillgängliga i utvalda regioner. Utgå från de värden som är tillgängliga för den plats du har valt i stället för att förvänta dig alla väderprodukter överallt.",
        "Met Office visar i sin vägledning varför prognosperiod och definitioner av variabler spelar roll: vissa värden avser en tidpunkt och andra en period. Använd etiketterna från den relevanta leverantören. Sannolikhet för regn, mängd och varaktighet är olika frågor, och ett enda tal avgör inte alla aktiviteter utomhus."
      ]
    },
    {
      "heading": "Granska ett utkast som skapats från en vädertimme",
      "body": [
        "Där appen erbjuder att skapa en händelse från en timme öppnas ett utkast. Den nuvarande källan använder väderplatsens tidszon, föreslår en längd på en timme och väljer standardkalendern för nya händelser. Kontrollera varje värde innan du sparar.",
        "Bekräfta titel, målkalender, start, slut och avsedd plats. Ett valt prognostillfälle ger inte rätt att redigera en delad kalender, meddela en plats eller boka ett rum. Kontrollera den sparade händelsen och ordna de godkännanden som planen kräver."
      ]
    },
    {
      "heading": "Håll webbplatsens demonstration åtskild",
      "body": [
        "Webbplatsens interaktiva väderdemonstration använder Open-Meteo. Appen använder Apple WeatherKit. En webbdemonstration är användbar för att utforska presentationen, men dess plats, data och tillgängliga datum kan skilja sig från appens.",
        "För ett verkligt beslut öppnar du appen och jämför den avsedda händelsen med den tillgängliga prognosen. Om du ändrar en delad plan, bekräfta organisatören, återkomstdelens omfattning och deltagarna. Ha ett överenskommet alternativ om aktiviteten beror på förhållandena."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifiera händelsen och vilket beslut vädret kan påverka.",
    "Bekräfta väderplatsen samt händelsens lokala datum och tid.",
    "Granska tillgänglig timvis täckning separat från den dagliga sammanfattningen.",
    "Läs sannolikhet, mängd och andra relevanta värden utifrån deras etiketter.",
    "Granska alla detaljer i händelseutkastet och målkalendern innan du sparar.",
    "Kontrollera igen när beslutet ska tas och bekräfta delade ändringar direkt."
  ],
  "faq": [
    {
      "q": "Följer vädret bredvid min kalender adressen för varje händelse?",
      "a": "Utgå inte från det. Bekräfta den visade väderplatsen och jämför den med platsen för händelsen; närhet på skärmen betyder inte att de stämmer överens."
    },
    {
      "q": "Använder appen samma väderleverantör som webbplatsen?",
      "a": "Nej. Appen använder Apple WeatherKit, medan webbplatsens demonstration använder Open-Meteo separat."
    },
    {
      "q": "Sparas en händelse automatiskt när jag väljer en prognostimme?",
      "a": "Den startar ett utkast där den åtgärden erbjuds. Kontrollera datum, tidszon, längd, kalender och plats, och spara sedan den avsedda händelsen."
    }
  ],
  "seeAlso": [
    "weather-calendar-history-versus-forecast-iphone",
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather",
    "weather-where-the-event-is",
    "planning-outdoors-without-being-rained-on"
  ],
  "sourcesHeading": "Officiella källor och vidare läsning",
  "sources": [
    {
      "label": "Apple: prognosinformation i WeatherKit och regional tillgänglighet",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: prognosplats, perioder och vädervärden",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ],
  "comparison": {
    "heading": "Vilken vädervy besvarar din fråga?",
    "columns": [
      "Din fråga",
      "Vad du ska granska",
      "Vad det inte fastställer"
    ],
    "rows": [
      {
        "cells": [
          "Vad händer i dag?",
          "Kalenderns dag- eller veckovy bredvid vädret för den valda platsen.",
          "Att adressen för varje händelse automatiskt ändrar väderplatsen."
        ]
      },
      {
        "cells": [
          "Kan regn påverka min händelse i eftermiddag?",
          "Timdata för platsen och för hela händelsens period.",
          "Att en dagssymbol beskriver varje timme."
        ]
      },
      {
        "cells": [
          "Kan jag planera nästa månad utifrån vädret?",
          "Din kalender nu och sedan en prognoskontroll närmare datumet.",
          "Att kalendernavigering utökar prognostäckningen."
        ]
      },
      {
        "cells": [
          "Kan jag få en snabb överblick hemma?",
          "Den lämpliga widgeten för hemskärmen.",
          "Att varje widgetlayout innehåller händelser eller en fullständig prognos."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-right",
    "hook"
  ],
  "galleryCaption": "Verkliga skärmar från Cloud Calendars: vädervyn och en dag med händelser. Kontrollera den valda platsen och datumet i appen.",
  "actionHeading": "Planera med ditt schema och prognosen tillsammans",
  "actionText": "Cloud Calendars finns för iPhone och iPad. Börja med vyerna, väder och synkronisering med Google Calendar som ingår i Base; Advanced tar bort annonser, medan Premium lägger till stöd för Microsoft Calendar och Teams.",
  "articleLinks": [
    {
      "slug": "forecast-beside-every-event",
      "label": "Kontrollera vädret för timmarna i en händelse"
    },
    {
      "slug": "the-widget-that-shows-what-is-next",
      "label": "Välj en kalender- och väderwidget"
    },
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "Samla kalenderkonton i en vy"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
  "updated": "2026-10-23",
  "title": "Se Google-, iCloud- och Outlook-kalendrar tillsammans på iPhone och iPad",
  "short": "Tre leverantörer, en vy",
  "description": "Kombinera kalendervyer och förstå kontobehörigheter, kopior och plankrav.",
  "lede": "För att se jobb- och personliga händelser tillsammans ansluter du de avsedda kontona, väljer deras kalendrar och kontrollerar samma händelser i en vy. Cloud Calendars stöder planering på iPhone och iPad med iCloud och Google Calendar; stöd för Microsoft Calendar ingår i Premium. Att se händelser tillsammans skiljer sig från att kopiera upptagen tid mellan konton hos olika leverantörer. Arte Soft, utvecklaren, publicerar den här guiden.",
  "commonBelief": "Om man lägger flera kalendrar i en app hålls deras tillgänglighet, delning och händelsekopior automatiskt samordnade.",
  "sections": [
    {
      "heading": "Identifiera kontot och kalendern bakom varje händelse",
      "body": [
        "Börja med en vanlig händelse från varje leverantör. Notera den inloggade e-postadressen, kalendernamnet och om du äger händelsen eller har fått en inbjudan. Två kalendrar som heter ”Calendar” kan tillhöra helt olika konton. En färg hjälper dig att överblicka en vecka; kontot och kalendern visar var en ändring ska göras.",
        "Till exempel kan en tandläkartid i din personliga iCloud-kalender och ett projektmöte i Microsoft visas tillsammans för dig. Det gör inte i sig att tandläkartiden blir synlig för dina kollegor eller reserverar den tiden i deras schemaläggningsverktyg.",
        "Bestäm vilket resultat du vill ha innan du ändrar en anslutning. Om du vill flytta händelsedata till ett annat konto, använd ”Välj ett exportformat för kalender” nedan för att hitta en överföringsväg som stöds och kontrollera representativa händelser innan du förlitar dig på målet. Om du vill jämföra tider, behåll de befintliga kalenderägarna och visa valda källor tillsammans. Om ett annat konto måste få upptagen tid, förklarar ”Cloud Calendars och OneCal efter arbetsflöde” hur kopiering av tillgänglighet skiljer sig från en personlig översikt."
      ]
    },
    {
      "heading": "Anslut via rätt väg",
      "body": [
        "För iCloud aktiverar du först iCloud Calendar på iPhone under rätt Apple-konto. Apples installationsguide förklarar enhetsinställningarna. Cloud Calendars får åtkomst till kalendrar som är tillgängliga via iPhones kalendersystem och behöver kalenderåtkomst för att läsa dem. Det räcker inte att ett konto är anslutet på en annan enhet.",
        "Cloud Calendars har också åtgärderna ”Logga in med Google” och ”Logga in med Microsoft”. Kontrollera vilket konto du väljer när du loggar in och öppna sedan dess kalendergrupp och välj de kalendrar du behöver. Om du loggar in hos rätt leverantör med fel personlig eller arbetsrelaterad identitet kan du få en helt giltig men oväntad kalenderlista."
      ]
    },
    {
      "heading": "Förstå planerna utan att blanda ihop dem med behörigheter",
      "body": [
        "Base-planen inkluderar synkronisering med Google Calendar och kalendervyerna. Advanced lägger till borttagning av annonser i Base. Premium lägger till funktioner för Microsoft Calendar och Microsoft Teams. Granska aktuellt lokalt pris och faktureringsperiod innan du köper.",
        "En plan ändrar vilka appfunktioner som är tillgängliga; den ger dig inte äganderätt till någon annans kalender. Google skiljer mellan behörighet att se händelser och behörighet att ändra dem. Arbetsgivarens policyer och de behörigheter som är kopplade till en Microsoft-kalender gäller fortfarande. En synlig händelse eller en tillgänglig redigerare är inget bevis på att leverantören kommer att godkänna en uppdatering."
      ]
    },
    {
      "heading": "En kombinerad vy kan innehålla kalenderkopior",
      "body": [
        "Google- och Microsoft-anslutningar använder kalenderkopior i iPhones kalendersystem för att visa och synkronisera händelser. Utgå inte från att en kontoanslutning innebär att ingen kopia finns utanför den ursprungliga leverantören. Målet som används för dessa kopior kan bero på vilka kalenderkällor som finns tillgängliga på enheten.",
        "Om samma konto också når telefonen via en annan väg, granska kalendernamn och källor innan du behandlar upprepade händelser som separata händelser. Dölj tillfälligt en kalender för att identifiera vilken visning den bidrar med. Ta inte bort en händelse eller kalender bara för att få skärmen att se prydligare ut: en ansluten kopia kan skicka ändringar tillbaka till sin leverantör."
      ]
    },
    {
      "heading": "Fortsätt välja målkalender när du skapar en händelse",
      "body": [
        "Kontrollera händelsens kalender lika noggrant som datum och tid innan du sparar. För en familjehändelse väljer du den kalender som familjen faktiskt använder; för ett arbetsmöte använder du den tillåtna arbetsdestinationen. Att se båda kalendrarna tillsammans gör inte någon av dem till det automatiska målet för varje ny händelse.",
        "Att ändra en händelses kalender eller dra den mellan kalendrar kan vara en flytt, inte en ofarlig andra vy. Låt inbjudningar och återkommande möten ligga kvar i sin etablerade kalender medan du felsöker ett visningsproblem. Om du behöver göra en ändring, fastställ först vem som äger händelsen och vilken kalender som kan ta emot den."
      ]
    },
    {
      "heading": "Verifiera översikten innan du förlitar dig på den",
      "body": [
        "Jämför en nylig händelse i leverantörens egen kalender med motsvarande händelse i Cloud Calendars. Kontrollera datum, tidszon, titel och vald kalender. För en redigerbar kalender som du äger är en tillfällig händelse utan gäster en bättre kontroll än att ändra ett pågående möte. Bekräfta resultatet hos leverantören innan du anser att anslutningen är klar.",
        "Förlita dig inte på den kombinerade vyn för att automatiskt skapa anonyma upptagen-block i ett annat konto. Om du behöver att kollegor ska se dig som otillgänglig utan att se personliga detaljer, använd en uttryckligen godkänd lösning för tillgänglighet och verifiera den från deras sida. En tydlig personlig översikt och delad tillgänglighet är två separata uppgifter."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Lista exakt konto och kalender för en händelse från varje leverantör.",
    "Aktivera de avsedda iCloud-kalendrarna på enheten och granska kalenderåtkomsten.",
    "Använd rätt Google- eller Microsoft-inloggning och välj de avsedda kalendrarna.",
    "Jämför en nylig händelse med leverantörens vy innan du ändrar något.",
    "Dölj tillfälligt en misstänkt dubblettkälla; låt de underliggande händelserna vara oförändrade.",
    "Kontrollera målkalendern för varje ny händelse och verifiera separat all delning av upptagen tid som du behöver."
  ],
  "faq": [
    {
      "q": "Kommer mina arbetskollegor att se mina personliga händelser eftersom jag visar båda kalendrarna?",
      "a": "Att visa kalendrar tillsammans är inte en delningsinstruktion eller en automatisk brygga för upptagen tid. Kontrollera varje kalenders faktiska delningsinställningar. Leverantörsanslutningar kan skapa kalenderkopior på enheten, så en kombinerad vy är inte heller en garanti för att händelsedata bara finns hos den ursprungliga leverantören."
    },
    {
      "q": "Varför kan jag se en händelse men inte redigera den utan problem?",
      "a": "Kalendern kan vara skrivskyddad, händelsen kan tillhöra en annan organisatör eller så kan leverantören neka uppdateringen. Kontrollera ägarskap och behörigheter i leverantörens kalender. Att köpa en högre appplan ändrar inte dessa behörigheter."
    },
    {
      "q": "Bör jag ansluta samma Google-konto via alla tillgängliga vägar?",
      "a": "Kontrollera först hur det redan visas på telefonen. Flera vägar kan göra det svårare att identifiera kalenderkopior. Välj den väg du tänker använda, verifiera dess händelser och dölj en extra visning medan du undersöker i stället för att radera data eller koppla från konton som första steg."
    }
  ],
  "sourcesHeading": "Källor och referenser för konfiguration",
  "sources": [
    {
      "label": "Apple: konfigurera iCloud Calendar på dina enheter",
      "url": "https://support.apple.com/guide/icloud/set-up-calendar-mme4d73a8727/icloud"
    },
    {
      "label": "Google: kalenderdelning och behörigheter",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: Outlook Calendar API och mailboxdata som stöds",
      "url": "https://learn.microsoft.com/en-us/graph/outlook-calendar-concept-overview"
    }
  ],
  "seeAlso": [
    "exchange-calendars-on-an-iphone",
    "what-calendar-sync-actually-does",
    "when-two-calendars-disagree",
    "caldav-calendar-on-iphone",
    "calendar-export-ics-pdf-and-backup",
    "onecal-alternative-iphone-calendar-view-or-sync"
  ],
  "comparison": {
    "heading": "Samlad vy, prenumeration eller kopierad upptagen tid?",
    "columns": [
      "Det du behöver",
      "Det du ska kontrollera",
      "Det du inte ska utgå från"
    ],
    "rows": [
      {
        "cells": [
          "En vy över flera konton",
          "Det anslutna kontot, vald kalender och plan som krävs.",
          "Att en delad skärm slår ihop ägarskap eller behörigheter."
        ]
      },
      {
        "cells": [
          "En händelseredigering som når leverantören",
          "Den ursprungliga händelsen, skrivbehörighet och det sparade resultatet vid källan.",
          "Att en synlig lokal redigering bevisar lyckad synkronisering med leverantören."
        ]
      },
      {
        "cells": [
          "Upptagen tid i ett annat konto",
          "En tjänst med uttryckliga synkroniseringsregler från källa till mål.",
          "Att en samlad vy skapar tillgänglighetsblock för kollegor."
        ]
      },
      {
        "cells": [
          "Ett prenumererat kalenderflöde",
          "Utgivaren, uppdateringsbeteendet och status som skrivskyddad.",
          "Att en ICS-prenumeration är en redigerbar tvåvägsanslutning."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-left",
    "hook"
  ],
  "galleryDevice": "iPad",
  "galleryCaption": "Riktiga kalendervyer på iPad illustrerar hur man granskar ett schema. En skärmbild visar inte riktningen för leverantörssynkronisering eller kontobehörigheter.",
  "actionHeading": "Granska dina kalendrar tillsammans på iPhone och iPad",
  "actionText": "Google Calendar-synkronisering ingår i Base. Advanced tar bort annonser; Premium lägger till stöd för Microsoft Calendar och Teams. Bekräfta kontots behörigheter oberoende av köpt plan.",
  "articleLinks": [
    {
      "slug": "onecal-alternative-iphone-calendar-view-or-sync",
      "label": "Jämför en samlad vy med OneCal:s synkroniseringsregler"
    },
    {
      "slug": "fantastical-readdle-calendar366-iphone-comparison",
      "label": "Jämför kalenderarbetsflöden på iPhone"
    },
    {
      "slug": "weather-inside-your-calendar",
      "label": "Planera med väder och händelser tillsammans"
    }
  ]
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
