import type { LocalisedArticle } from '../types';

export const PRIORITY_SV: Readonly<Record<string, LocalisedArticle>> = {
  "forecast-beside-every-event": {
    "title": "Kontrollera timvädret för en kalenderhändelse på iPhone och iPad",
    "short": "Väder för eventets tid",
    "description": "Matcha plats, datum och timmar för din händelse med den tillgängliga väderprognosen.",
    "lede": "För att kontrollera vädret för en kalenderhändelse behöver du få tre saker att stämma: platsen, dess lokala datum och händelsens period från start till slut. I Cloud Calendars väljer du väderplats och granskar de tillgängliga timmarna. En händelses adress och en väderikon i närheten är i sig inte bevis på att detta stämmer överens. Den här guiden publiceras av Arte Soft, utvecklaren.",
    "commonBelief": "Att en daglig väderikon i en kalender är samma funktion som en prognos kopplad till ett event.",
    "sections": [
      {
        "heading": "Börja med plats och datum",
        "body": [
          "Öppna prognosen för den avsedda platsen och jämför dess datum med kalenderposten. Kalendervädret kan spegla den valda väderplatsen, så kontrollera att den passar för eventet i stället för att anta att eventets adress styr detta.",
          "Ett event nästa månad kan finnas innan väderdata för det datumet är tillgängliga. Behåll eventet och återkom till prognosen närmare datumet; en saknad väderpost är inte en prognos om klart väder."
        ]
      },
      {
        "heading": "Använd timdetaljer för frågor om en viss timme",
        "body": [
          "En dagssammanfattning och en timprognos besvarar olika frågor. Om eventet pågår från två till fem ska du granska de tillgängliga timmarna som täcker intervallet i stället för att se en daglig ikon som hela bilden.",
          "Om bara en del av intervallet är tillgänglig, låt resten vara oklart. Appen lovar inte komplett timvis väder för varje event du kan skapa, och den här guiden lovar inte att hela väderfönstret alltid visas när du öppnar ett event."
        ]
      },
      {
        "heading": "Håll isär sannolikhet, mängd och tidpunkt",
        "body": [
          "Läs etiketten för det värde du kontrollerar. Sannolikhet för nederbörd är inte samma sak som mängd eller varaktighet av regn. På samma sätt avser ett timvärde och en dagssammanfattning olika perioder; jämför likvärdiga perioder när du väger mellan två möjliga tider.",
          "Välj ett alternativ som passar din plan i stället för att behandla en enda procentsats som en universell regel för att genomföra eller ställa in. Väderinformation kan ändras, så kontrollera den igen när ett beslut behöver fattas."
        ]
      },
      {
        "heading": "Granska innan du sparar ett väderbaserat event",
        "body": [
          "Appen kan starta ett eventutkast från en prognostimme. Granska utkastets datum, start, sluttid och målkalender innan du sparar. Att välja en prognos ersätter inte kontrollen av att du skapar rätt åtagande.",
          "Om kalenderåtkomst eller målkalendern hindrar att du sparar, löser du den behörigheten separat från väderåtkomst. Att hitta en prognos ger dig inte rätt att redigera en delad kalender."
        ]
      },
      {
        "heading": "Använd hela prognosen när sammanfattningen inte räcker",
        "body": [
          "För en aktivitet utomhus ska du granska de variabler som är relevanta för aktiviteten och den plats du faktiskt har valt. En widget för aktuellt väder eller en demo på startsidan ersätter inte att kontrollera appens tillgängliga prognostimmar.",
          "Om du upptäcker en avvikelse ska du först jämföra plats och tidsstämpel. Olika leverantörer, valda platser och prognosperioder kan ge olika visningar utan att det bevisar att kalenderhändelsen har ändrats."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Bekräfta plats och eventdatum.",
      "Kontrollera de tillgängliga timmarna för hela aktiviteten.",
      "Läs sannolikhet och mängd som olika värden.",
      "Granska eventutkastet innan du sparar."
    ],
    "seeAlso": [
      "weather-inside-your-calendar",
      "planning-outdoors-without-being-rained-on"
    ],
    "updated": "2026-10-23",
    "faq": [
      {
        "q": "Har varje event en fullständig prognos?",
        "a": "Nej. Täckningen beror på den valda platsen och på vilka datum och timmar som är tillgängliga."
      },
      {
        "q": "Är väderikonen specifik för eventets adress?",
        "a": "Dra inte den slutsatsen utifrån närheten till eventet. Bekräfta väderplatsen separat."
      },
      {
        "q": "Sparas ett nytt event när du trycker på en timme?",
        "a": "Det startar ett eventutkast där funktionen är tillgänglig. Granska datum, tid och kalender innan du sparar."
      }
    ],
    "sourcesHeading": "Väderkällor och platsinställningar",
    "sources": [
      {
        "label": "Apple: WeatherKit-prognoser och regional tillgänglighet",
        "url": "https://developer.apple.com/weatherkit/"
      },
      {
        "label": "Apple: Integritet och platstjänster",
        "url": "https://support.apple.com/en-us/102515"
      }
    ],
    "comparison": {
      "heading": "En praktisk kontroll före en aktivitet utomhus",
      "columns": [
        "Kontroll",
        "Exempel",
        "Beslut"
      ],
      "rows": [
        {
          "cells": [
            "Plats",
            "Händelsen är i en annan stad.",
            "Välj den destinationen i vädervyn och kontrollera namnet."
          ]
        },
        {
          "cells": [
            "Period",
            "Aktiviteten pågår från 14:00 till 16:00.",
            "Granska båda timmarna samt relevanta förberedelser eller resor."
          ]
        },
        {
          "cells": [
            "Täckning",
            "Bara några av de timmar som behövs är tillgängliga.",
            "Låt planen vara preliminär och gör en ny kontroll senare."
          ]
        },
        {
          "cells": [
            "Sparad händelse",
            "Du startar ett utkast från en vädertimme.",
            "Granska datum, tidszon, längd och målkalender innan du sparar."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-right",
      "week-left"
    ],
    "galleryCaption": "Vädervyn och veckovyn visar olika delar av samma planeringsuppgift. Bekräfta prognosplatsen separat från händelsens plats.",
    "actionHeading": "Kontrollera prognosen mot dina verkliga händelser",
    "actionText": "Använd Cloud Calendars på iPhone eller iPad för att granska den tillgängliga prognosen och ditt schema. Vädret hjälper dig att välja; det flyttar inte automatiskt en händelse eller bekräftar en ändring med deltagarna.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Förstå kalender- och vädervyerna"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Välj en snabb översikt för hemskärmen"
      },
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Kontrollera kalendrarna bakom ditt schema"
      }
    ]
  },
  "the-widget-that-shows-what-is-next": {
    "updated": "2026-10-23",
    "title": "Kalenderwidgets på iPhone och iPad: kommande händelser och väder",
    "short": "Kommande händelser på hemskärmen",
    "description": "Välj en widget från Cloud Calendars för kommande händelser, datum eller väder.",
    "lede": "Välj Calendar Events eller Calendar Events Large när du vill ha kommande händelser på hemskärmen. Välj Calendar & Weather för att visa datum och väder. Dessa layouter besvarar olika frågor; förhandsgranska den som erbjuds på din enhet innan du lägger till den. Den här guiden publiceras av Arte Soft, utvecklaren av Cloud Calendars.",
    "sections": [
      {
        "heading": "Välj först en layout för händelserna",
        "body": [
          "I widgetgalleriet för Cloud Calendars är Calendar Events den medelstora layouten för en händelselista. Calendar Events Large ger mer plats för kommande händelser. Calendar & Weather är en separat layout för datum och väder; den lilla storleken innebär inte att en rad för nästa händelse visas. Namnen kan visas översatta på din enhet.",
          "På iPhone håller du ned på ett tomt område på hemskärmen, väljer Redigera och Lägg till widget, letar sedan upp Cloud Calendars och väljer önskad layout. Jämför förhandsvisningen innan du lägger till den. Apples widgetinstruktioner gäller det här systemgalleriet; det är separat från kalendervyerna i appen."
        ]
      },
      {
        "heading": "Lägg till och kontrollera widgeten på iPad",
        "body": [
          "På iPad använder du Apples widgetgalleri på hemskärmen: håll ned bakgrunden, öppna Redigera och sedan Lägg till widget. Sök efter Cloud Calendars, granska de stilar och storlekar som erbjuds, lägg till den layout du behöver, placera den och avsluta med Klar. Följ reglagen som visas i din version av iPadOS; en förhandsvisning bekräftar inte att dina kalenderdata har lästs in.",
          "Välj Calendar Events eller Calendar Events Large när du behöver se händelser. Jämför de stilar som den installerade appen erbjuder; en ruta för datum och väder besvarar en annan fråga än en händelselista.",
          "Öppna Cloud Calendars på den iPaden och leta upp en känd framtida tidsatt händelse i en vald kalender. En korrekt vy på din iPhone bekräftar inte iPadens konton, åtkomst eller inlästa data. Jämför titel, datum och starttid och fortsätt sedan med kontrollerna av behörighet och uppdatering nedan om widgeten skiljer sig."
        ]
      },
      {
        "heading": "Kontrollera vad som räknas som kommande",
        "body": [
          "Händelsevisningen använder valda kalendrar och framtida tidsatta händelser. Heldagsposter och händelser vars starttid redan har passerat utesluts från den här listan över kommande händelser. En födelsedag eller ett pågående möte kan därför vara synligt i appen utan att visas här.",
          "Om din enda post i dag till exempel är en heldagsetikett för resa betyder en tom lista över kommande händelser inte att resetiketten har försvunnit. Öppna appen för att granska hela dagen. På samma sätt kan nästa tidsatta händelse vara i morgon eller senare; läs datumet i stället för att anta att varje rad gäller i dag."
        ]
      },
      {
        "heading": "Skilj på en saknad händelse och en lista som har slut på rader",
        "body": [
          "En widget visar ett begränsat antal kommande händelser. Om tidigare händelser fyller dess rader kan en senare händelse saknas trots att den finns i appen och är kvalificerad för listan över kommande händelser. En större händelselayout kan visa fler rader, men det är fortfarande inte hela kalendern.",
          "Börja med den närmaste framtida tidsatta händelsen i en vald kalender. Om den visas men en senare inte gör det, öppna appen för att granska resten av schemat. Om den närmaste kvalificerade händelsen också saknas, fortsätt med kontroller av kalenderurval, åtkomst och uppdatering. Flytta eller ta inte bort händelser bara för att få en senare post att visas."
        ]
      },
      {
        "heading": "Låt appen vara din första jämförelse",
        "body": [
          "Öppna Cloud Calendars och leta upp en specifik framtida tidsatt händelse. Bekräfta att dess kalender är vald och att appen har den kalenderåtkomst den behöver. Jämför titel, datum och starttid med widgeten. Om händelsen också saknas i appen bör du först undersöka kontot eller synkroniseringen.",
          "Använd en ofarlig testhändelse i en kalender du äger om du behöver ett tydligt exempel. Ge den en framtida starttid och en lättigenkännlig titel. Undvik att ändra en riktig inbjudan eller ta bort konton bara för att testa hemskärmen."
        ]
      },
      {
        "heading": "Räkna med uppdateringar utan att anta en fast tidsgräns",
        "body": [
          "Widgetar visar sparad information och körs inte kontinuerligt som en öppen app. Apple styr när de uppdateras. Att öppna appen och kontrollera händelsen ger dig en ny jämförelsepunkt, men det fastställer inte ett exakt antal sekunder innan widgeten måste ändras.",
          "Om appen fortsätter att vara korrekt medan widgeten fortfarande visar fel, notera layouten, den valda kalendern, händelsens tid samt app- och iOS-versioner. En tom lista, en gammal händelse och en felaktig tid är olika observationer; ange vilket av dem du ser."
        ]
      },
      {
        "heading": "Läs vädret som en separat sammanfattning",
        "body": [
          "Vädret bredvid datumet är inte en prognos knuten till varje händelses plats och starttid. Öppna vädervyn före en utomhushändelse och kontrollera den avsedda platsen och timmen. En ikon för aktuella förhållanden kan inte fastställa vilka förhållanden som kommer att råda vid ett senare möte.",
          "Behåll den här widgeten för snabb överblick. Använd den fullständiga kalendern för heldagsåtaganden, händelseuppgifter och beslut som kräver hela schemat."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Välj Calendar Events eller Calendar Events Large för en händelselista.",
      "Bekräfta en framtida tidsatt händelse i en vald kalender.",
      "Jämför dess datum och tid i appen innan du felsöker widgeten.",
      "Dokumentera bestående skillnader i stället för att ta bort kalenderdata."
    ],
    "faq": [
      {
        "q": "Varför saknas min födelsedag?",
        "a": "Listan över kommande händelser utesluter heldagshändelser. Kontrollera hela kalendern för födelsedagar och andra poster som bara har datum."
      },
      {
        "q": "Visar den lilla widgeten nästa möte?",
        "a": "Den lilla layouten Calendar & Weather visar datum och väder. Välj en layout med händelselista för händelser."
      },
      {
        "q": "Betyder inga kommande händelser att jag är ledig i dag?",
        "a": "Nej. Heldagsposter, pågående händelser, icke valda kalendrar och inaktuell information kan ändra den slutsatsen."
      }
    ],
    "sourcesHeading": "Källor och Apple-instruktioner",
    "sources": [
      {
        "label": "Apple: Lägg till och redigera widgetar på iPhone",
        "url": "https://support.apple.com/118610"
      },
      {
        "label": "Apple: Hålla en widget uppdaterad",
        "url": "https://developer.apple.com/documentation/widgetkit/keeping-a-widget-up-to-date"
      },
      {
        "label": "Apple: Lägg till, redigera och ta bort widgetar på iPad",
        "url": "https://support.apple.com/guide/ipad/add-edit-and-remove-widgets-ipadb0de8630/ipados"
      }
    ],
    "seeAlso": [
      "choosing-a-widget-size",
      "a-countdown-to-your-next-meeting",
      "calendar-on-apple-watch"
    ],
    "comparison": {
      "heading": "Välj den visning du faktiskt behöver",
      "columns": [
        "Visning",
        "Använd den för",
        "Kontrollera innan du förlitar dig på den"
      ],
      "rows": [
        {
          "cells": [
            "Calendar Events",
            "En kompakt vy över kommande tidsatta händelser.",
            "Händelsen tillhör en vald kalender och har inte börjat än."
          ]
        },
        {
          "cells": [
            "Calendar Events Large",
            "Mer plats för kommande händelser.",
            "Även en större layout har ett begränsat antal rader."
          ]
        },
        {
          "cells": [
            "Calendar & Weather",
            "En snabb översikt över datum och väder.",
            "Den lilla layouten garanterar inte en rad för kommande händelser."
          ]
        },
        {
          "cells": [
            "Live Activity",
            "En separat nedräkning till nästa händelse på iPhone-ytor som stöds.",
            "Det är inte en widget för hemskärmen eller en särskild widgetlayout för låsskärmen."
          ]
        }
      ]
    },
    "galleryKinds": [
      "widgets",
      "live"
    ],
    "galleryCaption": "Widgetarna på hemskärmen och Live Activity är separata visningar. Välj den layout som motsvarar den information du behöver.",
    "actionHeading": "Lägg den användbara delen av ditt schema på hemskärmen",
    "actionText": "Öppna Cloud Calendars, kontrollera en känd framtida tidsatt händelse och lägg sedan till rätt widget på din iPhone eller iPad. Appen är fortfarande platsen där du granskar hela kalendern.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Granska vädret bredvid ditt schema"
      },
      {
        "slug": "forecast-beside-every-event",
        "label": "Kontrollera timmarna för en utomhushändelse"
      },
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Kontrollera dina anslutna kalenderkonton"
      }
    ]
  },
  "onecal-alternative-iphone-calendar-view-or-sync": {
    "updated": "2026-10-23",
    "title": "Cloud Calendars eller OneCal? Välj en samlad vy eller kalendersynkronisering",
    "short": "Cloud Calendars och OneCal efter arbetsflöde",
    "description": "Jämför OneCal och Cloud Calendars utifrån vyer, kopierade händelser, mobilkontroller och planer.",
    "lede": "Välj utifrån vilket resultat du behöver: granska flera scheman tillsammans, redigera en ursprunglig händelse eller kopiera upptagen tid till ett annat konto. Cloud Calendars erbjuder planeringsvyer för iPhone och iPad; OneCal dokumenterar en Unified Calendar View och separata regler för Calendar Sync. Denna jämförelse publiceras av Arte Soft, utvecklaren av Cloud Calendars.",
    "commonBelief": "Två produkter som visar Google-, iCloud- och Outlook-kalendrar håller nödvändigtvis tillgänglighet, händelseredigeringar och kopior synkroniserade på samma sätt.",
    "sections": [
      {
        "heading": "Välj mellan en översikt och en ändring i ett annat konto",
        "body": [
          "Om ditt mål är att se en privat händelse bredvid ett jobbmöte behöver du en samlad vy. Om din jobbkalender också måste innehålla ett upptagen-block för den privata händelsen behöver du ett definierat arbetsflöde från källa till mål. Det första resultatet etablerar inte det andra.",
          "Cloud Calendars samlar valda kalendrar i en planeringsvy på iPhone och iPad. OneCal dokumenterar Unified Calendar View separat från Calendar Sync; enligt utgivaren kan du använda den vyn utan att konfigurera synkroniseringsregler. Avgör vilket resultat som är viktigast innan du ansluter konton eller jämför namn på abonnemang."
        ]
      },
      {
        "heading": "Förstå vad en kopierad händelse kan ändra",
        "body": [
          "OneCal:s dokumentation för Calendar Sync beskriver envägs- och flervägsregler som skapar klonhändelser. Dess separata guide om täckning säger att ändringar i en klon inte förs tillbaka till originalet. Identifiera originalet och dess ägande kalender innan du behandlar en kopierad händelse som platsen där ett möte ska bokas om.",
          "Cloud Calendars leverantörsanslutningar kan också skapa speglade kalendrar i iOS-lagringen. En samlad visning bevisar inte att poster har slagits ihop eller att en redigering nådde leverantören. För en kalender som du äger och får redigera, kontrollera en ofarlig testhändelse utan gäster hos leverantören såväl som i appen."
        ]
      },
      {
        "heading": "Kontrollera funktionerna på den enhet du faktiskt ska använda",
        "body": [
          "OneCal:s aktuella mobilguide beskriver hur man skapar och redigerar kalenderhändelser, val för återkommande händelser, RSVP och att gå med i möten. Den säger separat att skapande, redigering, pausning eller borttagning av Calendar Sync-konfigurationer sker i webbappen; mobilen visar dessa konfigurationer. Konfiguration av bokningslänkar beskrivs också som en uppgift för webben.",
          "Cloud Calendars är en app för iPhone och iPad med dag-, vecka-, månad-, år- och listvyer. Prova den redigering du behöver i den installerade vyn, läs eventuella val för återkommande händelser och bekräfta den sparade händelsen. Utgå inte från att en annan produkts mobilmeny, bokningsflöde eller automationskontroller finns där."
        ]
      },
      {
        "heading": "Verifiera täckningen i stället för att anta obegränsad historik",
        "body": [
          "OneCal:s aktuella guide om täckning anger ett framtida synkroniseringsfönster på upp till ett år för Google och iCloud och upp till tre månader för Outlook. Den skiljer också mellan framtida återkommande serier och fristående historiska händelser. Detta är begränsningar som dokumenterats av utgivaren, inte ett test av just ditt konto eller ett påstående om varje funktion i dess kalendervy.",
          "Cloud Calendars kräver också att du kontrollerar kontovägen, valda kalendrar och relevanta datum. Om äldre möten är viktiga, jämför en identifierad händelse hos leverantören och i appen. En kalenderapp är inte automatiskt en fullständig säkerhetskopia eller en garanti för att varje tidigare post har hämtats."
        ]
      },
      {
        "heading": "Jämför plankrav och betalningsväg",
        "body": [
          "Cloud Calendars inkluderar Google Calendar-synkronisering i Base; Advanced tar bort annonser och Premium lägger till stöd för Microsoft Calendar och Teams. Verifiera kontobehörigheter separat från planen. Kontrollera aktuellt lokalt pris och faktureringsperiod före köp i stället för att använda en fast internationell prisjämförelse.",
          "OneCal:s guide för webbplaner beskriver planer per medlem och en provperiod på fjorton dagar, inklusive borttagning av kloner när provperioden löper ut. Dess mobilguide för betalning beskriver köp som hanteras av butiken och begränsningar för att lägga till teammedlemmar. Kontrollera vilka funktioner som kräver en löpande plan och var köpet hanteras; enbart en gratis nedladdning besvarar inte de frågorna."
        ]
      },
      {
        "heading": "Testa ditt faktiska planeringsflöde innan du byter",
        "body": [
          "Om väder, widgetar eller en Live Activity är viktiga, ta med dem i testet på den enhet du använder. Cloud Calendars erbjuder dessa planeringsytor, med väder begränsat till tillgängliga datum och den valda platsen. OneCal-sidorna som granskats här fastställer inte funktionsparitet för dessa ytor; kontrollera den aktuella produkten i stället för att dra slutsatsen att funktionen saknas utifrån en guide.",
          "Behåll originalapparna och anslutningsuppgifterna tills du har kontrollerat det resultat som krävs. Notera om du verifierade synlighet, redigering av originalhändelse, kopierad upptagen tid eller en påminnelse; det är olika resultat. Innan du kopplar från en tjänst, gå igenom vad som händer med befintliga kopior och undvik att experimentera på en aktiv inbjudan eller ett riktigt kundmöte."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Skriv ned om du behöver en samlad vy eller händelser som kopieras till ett annat konto.",
      "Identifiera original, kopior och vilket konto som äger varje viktig händelse.",
      "Kontrollera de funktioner du behöver på din faktiska telefon, surfplatta eller i ditt webbflöde.",
      "Jämför en vanlig vecka och eventuella historiska datum som du förlitar dig på.",
      "Kontrollera aktuella plankrav, lokalt pris och vem som hanterar köpet.",
      "Verifiera en ofarlig testhändelse och gå igenom regler för borttagning av kopior innan du byter."
    ],
    "faq": [
      {
        "q": "Är en samlad kalendervy samma sak som att synkronisera upptagen tid?",
        "a": "Nej. En samlad vy låter dig jämföra åtaganden. Att skapa en post i ett annat konto kräver ett separat arbetsflöde som stöds; OneCal dokumenterar regler för Calendar Sync separat från sin Unified Calendar View."
      },
      {
        "q": "Kan jag ändra en OneCal-klon för att boka om originalmötet?",
        "a": "Dess guide om täckning säger att ändringar i kloner inte förs vidare till originalet. Identifiera originalhändelsen och följ dess kalenders regler för redigering och organisatörsbehörigheter."
      },
      {
        "q": "Vilken app är billigast för min konfiguration?",
        "a": "Det beror på vilka funktioner, konton, vilken betalningsväg och vilket lokalt pris du behöver. Cloud Calendars inkluderar Google-synkronisering i Base och Microsoft-stöd i Premium. Gå igenom OneCal:s aktuella plan och villkor för mobilbetalning för det arbetsflöde du tänker använda; den här guiden utser ingen universell prisvinnare."
      }
    ],
    "sourcesHeading": "OneCal:s officiella dokumentation om arbetsflöden och planer",
    "sources": [
      {
        "label": "OneCal: mobilfunktioner och konfigurationsuppgifter som bara finns på webben",
        "url": "https://docs.onecal.io/docs/mobile-apps"
      },
      {
        "label": "OneCal: Calendar Sync och regler från källa till mål",
        "url": "https://docs.onecal.io/docs/calendar-sync/calendar-sync-intro"
      },
      {
        "label": "OneCal: synkroniseringsfönster och ändringar i klonhändelser",
        "url": "https://docs.onecal.io/docs/calendar-sync/what-does-onecal-sync"
      },
      {
        "label": "OneCal: planer, provperiod och beteende vid utgång",
        "url": "https://docs.onecal.io/docs/billing/plans-and-free-trial"
      },
      {
        "label": "OneCal: abonnemang i App Store och Google Play",
        "url": "https://docs.onecal.io/docs/billing/mobile-subscriptions"
      }
    ],
    "seeAlso": [
      "what-calendar-sync-actually-does",
      "three-calendar-apps-is-two-too-many",
      "free-google-sync-without-adverts",
      "disconnect-calendar-integration-without-losing-track",
      "what-fantastical-costs-and-what-this-does"
    ],
    "comparison": {
      "heading": "Jämför arbetsflödet före abonnemanget",
      "columns": [
        "Fråga",
        "Cloud Calendars",
        "OneCal-dokumentation"
      ],
      "rows": [
        {
          "cells": [
            "Var granskar jag mitt schema?",
            "På iPhone och iPad, med dag-, vecka-, månad-, år- och listvyer.",
            "Unified Calendar View är separat från att konfigurera Calendar Sync."
          ]
        },
        {
          "cells": [
            "Behöver jag att upptagen-block kopieras mellan konton?",
            "Dra inte den slutsatsen från den samlade vyn; leverantörsanslutningar kan spegla kalendrar lokalt.",
            "Calendar Sync skapar klonhändelser med envägs- eller flervägsregler."
          ]
        },
        {
          "cells": [
            "Var ändrar jag synkroniseringsregler?",
            "Använd de kontroller som dokumenteras för appens kontoanslutning.",
            "Den granskade mobilguiden hänvisar ändringar av synkroniseringskonfiguration till webbappen."
          ]
        },
        {
          "cells": [
            "Vilken plan i Cloud Calendars behöver jag?",
            "Base inkluderar Google Calendar-synkronisering; Advanced tar bort annonser; Premium lägger till Microsoft Calendar och Teams.",
            "Kontrollera aktuell OneCal-plan och betalningsväg för det arbetsflöde som krävs."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-left",
      "hook"
    ],
    "galleryCaption": "Riktiga kalenderskärmar i Cloud Calendars visar planeringsvyn. Jämförelsen skiljer den vyn från en tjänsts serverbaserade regler för kloner.",
    "actionHeading": "Välj vilket resultat du vill verifiera",
    "actionText": "För en översikt på iPhone eller iPad med väder och widgetar, prova Cloud Calendars med en ofarlig testhändelse. Om ditt krav är kopierad upptagen tid i ett annat konto, utvärdera en tjänst som uttryckligen dokumenterar den åtgärden.",
    "articleLinks": [
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Ställ in en kombinerad kalendervy"
      },
      {
        "slug": "fantastical-readdle-calendar366-iphone-comparison",
        "label": "Jämför andra kalenderalternativ för iPhone"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Välj vad som ska visas på hemskärmen"
      }
    ]
  },
  "fantastical-readdle-calendar366-iphone-comparison": {
    "updated": "2026-10-23",
    "title": "Kalenderalternativ för iPhone: Cloud Calendars, Fantastical, Readdle och BusyCal",
    "short": "Jämför kalenderalternativ för iPhone",
    "description": "Jämför kalendrar för iPhone efter väder, vyer, uppgifter och det arbetsflöde du behöver.",
    "lede": "Välj kalender utifrån vad du vill få gjort: granska händelser med väder, lägga in en händelse snabbt, hantera uppgifter eller kombinera vyer från olika konton. Cloud Calendars, Fantastical, Calendars by Readdle, Calendar 366 och BusyCal skiljer sig åt i dessa arbetsflöden och i vilka abonnemang som krävs. Arte Soft utvecklar Cloud Calendars och publicerar denna jämförelse.",
    "sections": [
      {
        "heading": "Välj vad som måste fungera innan du jämför utseendet",
        "body": [
          "Skriv ned dina kalenderleverantörer, enheter och tre viktiga åtgärder. Ett exempel är: se jobb- och privata kalendrar tillsammans, slutföra en påminnelse och snabbt lägga till ett möte. Testa de åtgärderna med privata exempeldata innan du importerar ett helt schema.",
          "Att en produkt stöder namnet på din leverantör innebär inte att alla anslutningsmetoder har samma behörigheter eller funktioner. En enhetskalender, ett direktanslutet konto och ett prenumererat flöde kan ge poster som ser liknande ut men tillåter olika åtgärder."
        ]
      },
      {
        "heading": "Använd leverantörens egen kalender som utgångspunkt",
        "body": [
          "Googles introduktionsguide beskriver det egna kalendergränssnittet för schemaläggning, uppgifter, delning och flera kalendrar. Om ditt schema redan finns där bör du testa den åtgärd du behöver i källan innan du avgör om du behöver en annan app.",
          "Jämför till exempel samma händelse i Google Calendar och Fantastical efter att du har anslutit det avsedda kontot. Kontrollera om fördelen du behöver är en kombinerad vy, en uppgiftskoppling, snabb inmatning eller ett visst enhetsgränssnitt. En annan kalenderklient innebär inte automatiskt en flytt till en annan leverantör."
        ]
      },
      {
        "heading": "Fantastical: kontrollera kontoanslutningar och snabb inmatning",
        "body": [
          "Flexibits dokumenterar både direkta anslutningar till kalenderkonton och alternativ för kalendrar och påminnelser som redan har konfigurerats i iOS. I introduktionsguiden rekommenderas direkta anslutningar för att använda appens funktioner fullt ut. Ta reda på vilken väg du valde i stället för att ansluta samma kalender två gånger utan anledning.",
          "Fantastical dokumenterar också meningsbaserad inmatning och återanvändbara mallar för händelser eller uppgifter. Testa ett tydligt datum, en varaktighet och en målkalendar och granska sedan det sparade resultatet. Syntaxen tillhör Fantastical; textfältet i en annan app kan tolka samma mening annorlunda."
        ]
      },
      {
        "heading": "Calendars by Readdle: kontrollera uppgiftskällan",
        "body": [
          "Readdle visar Google-, Outlook- och iCloud-kalendrar tillsammans med funktioner för uppgifter och naturlig språkinmatning. I deras guide för att ställa in uppgifter beskrivs hur du väljer iOS Reminders eller Google Tasks i Task Options. Det valet är viktigt om en slutförd uppgift på telefonen måste uppdatera en viss ursprunglig lista.",
          "Använd en tillfällig uppgift för att testa slutförande i båda ändar, inte bara om en titel visas på en tidslinje. Om du behöver en vy eller åtgärd på Mac såväl som på iPhone, testa även där. Utgå inte från att kontrollerna är identiska bara för att produktnamnet delas."
        ]
      },
      {
        "heading": "Calendar 366: kontrollera systemåtkomst, uppsättningar och plats för väder",
        "body": [
          "I dokumentationen för Calendar 366 skiljs åtkomst till systemkalendrar och påminnelser från direkta kontointegrationer. Där beskrivs även kalenderuppsättningar som väljer vilka kalendrar och listor som är synliga. Dessa uppsättningar kan också bestämma standardkalender, så kontrollera var en ny händelse kommer att hamna.",
          "Samma dokumentation beskriver också den egna tolken för naturligt språk och väder via Apple Weather, med val av systemplats eller anpassad plats. Om du planerar utomhus bör du kontrollera vald plats i stället för att anta att prognosen följer adressen för varje händelse. Detta är funktioner som dokumenterats av utgivaren, inte funktioner som testats på ditt konto."
        ]
      },
      {
        "heading": "BusyCal: kontrollera uppgiftsvisning och den vy som används för väder",
        "body": [
          "BusyCals guide för uppgifter i iOS skiljer mellan uppgifter med datum, med tid och utan datum. Den beskriver kontroller för att slutföra uppgifter och att flytta ofullständiga daterade uppgifter framåt. I väderguiden placeras prognoser i vyerna List, Day och Month, så testa den vy du faktiskt använder i stället för att anta att väder visas överallt.",
          "BusyCal dokumenterar också naturlig språkinmatning som ett alternativ i standardinställningarna för nya händelser. Prova samma privata exempel på en händelse som i de andra apparna och kontrollera sedan kalendern och den sparade tiden. Detta är kontroller i BusyCal, inte kommandon som delas av alla kalenderappar."
        ]
      },
      {
        "heading": "Kontrollera arbetsflödet på Watch separat från telefonen",
        "body": [
          "Fantasticals guide för Watch dokumenterar vyerna Up Next, List och Tasks, inklusive att slutföra uppgifter. BusyCals guide för uppgifter skiljer mellan uppgifter med datum och tid som visas på Watch och uppgifter utan datum. Om en eftersläpande lista utan datum är viktig bör du ta med den i testet i stället för att bara testa nästa händelse.",
          "En komplikation på Watch är en snabb överblick, medan Watch-appen kan erbjuda fler åtgärder. Kontrollera data och åtgärd på den faktiska klockan och telefonen, och gå igenom aktuellt abonnemang. Gränssnitten på dator, telefon och klocka är inte utbytbara bara för att de använder samma produktnamn."
        ]
      },
      {
        "heading": "Behandla pris och rättigheter som en separat kontroll",
        "body": [
          "Kontrollera den aktuella lokala köpskärmen, vilka funktioner som finns kvar efter att en provperiod har slutat och om ett tidigare köp ändrar dina rättigheter. Gratis nedladdning, återkommande prenumeration och ett äldre köp låser inte nödvändigtvis upp samma uppsättning funktioner.",
          "Utgivarnas sidor kan uppdateras vid olika tidpunkter. I Readdles aktuella produkt-FAQ beskrivs flera kärnfunktioner som gratis, medan en separat hjälpsida om gratis kontra fullversion visar en annan uppdelning. I stället för att se en beskrivning som ett universellt löfte bör du verifiera den åtgärd du behöver i den installerade appen och dess aktuella köpvillkor."
        ]
      },
      {
        "heading": "Var Cloud Calendars hör hemma i urvalet",
        "body": [
          "Cloud Calendars är ett annat alternativ för iPhone och iPad med utvalda kalendrar, flera planeringsvyer, väder och widgetar. Google-synk ingår i Base, Advanced tar bort annonser och Premium lägger till stöd för Microsoft calendar. Kontrollera aktuellt abonnemang och leverantörens behörigheter för din konfiguration.",
          "Om en särskild uppgiftskoppling, mallfunktion eller datorarbetsflöde är avgörande bör du välja den produkt som dokumenterar och faktiskt klarar det kravet. Jämför sparade resultat och daglig arbetsinsats; en checklista ska hjälpa dig att välja, inte antyda att alla funktioner som nämns här finns i Cloud Calendars."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Lista dina konton, enheter och viktiga åtgärder.",
      "Välj en väg för kontoanslutning och granska vilka kalendrar den visar.",
      "Testa snabb inmatning och att slutföra uppgifter med ofarliga exempel.",
      "Verifiera väderplatsen och vilka vyer som används på varje enhet.",
      "Kontrollera aktuella köpvillkor efter eventuell provperiod eller äldre rättighet."
    ],
    "faq": [
      {
        "q": "Vilket är det bästa alternativet till Fantastical?",
        "a": "Det beror på vilket arbetsflöde du behöver. Jämför kalender- och uppgiftskällor, inmatning av händelser, enhetsstöd och aktuella rättigheter. Den här guiden utser ingen universell vinnare när det gäller prestanda."
      },
      {
        "q": "Betyder samma leverantörsnamn att alla appar synkar identiskt?",
        "a": "Nej. Kontrollera direkta anslutningar, enhetskalendrar, flöden och behörigheter var för sig och verifiera sedan en exempeländring i källan."
      },
      {
        "q": "Kan jag utgå från att alla annonserade funktioner är gratis?",
        "a": "Nej. Kontrollera den installerade appen, den lokala köpskärmen och vilka funktioner som finns kvar efter en provperiod. Utgivarens dokumentation kan beskriva olika versioner eller rättigheter."
      }
    ],
    "sourcesHeading": "Officiell dokumentation som har kontrollerats för den här guiden",
    "sources": [
      {
        "label": "Fantastical: vägar för kontoanslutning",
        "url": "https://flexibits.com/fantastical-ios/help/getting-started"
      },
      {
        "label": "Fantastical: naturlig språkinmatning och mallar",
        "url": "https://flexibits.com/fantastical-ios/help/adding-events-and-tasks"
      },
      {
        "label": "Readdle: aktuella produktfunktioner och FAQ",
        "url": "https://readdle.com/calendars"
      },
      {
        "label": "Readdle: välja en uppgiftskälla",
        "url": "https://support.readdle.com/calendars/synchronization/how-to-sync-tasks-with-ios-reminders-or-google-tasks"
      },
      {
        "label": "Readdle: separat vägledning för gratis/fullversion",
        "url": "https://apphelp.readdle.com/en/index.php?id=585&pg=kb.page"
      },
      {
        "label": "Calendar 366: integrationer, uppsättningar, snabb inmatning och väder",
        "url": "https://calendar366.com/help/index.html"
      },
      {
        "label": "BusyCal för iOS: uppgifter och begränsningar för uppgifter på Watch",
        "url": "https://www.busymac.com/docs/busycalios/70659-tasks/"
      },
      {
        "label": "BusyCal för iOS: väder och vyer som stöds",
        "url": "https://www.busymac.com/docs/busycalios/70665-weather/"
      },
      {
        "label": "BusyCal för iOS: naturlig språkinmatning",
        "url": "https://www.busymac.com/docs/busycalios/70669-natural-language/"
      },
      {
        "label": "Fantastical: vyer och åtgärder på Apple Watch",
        "url": "https://flexibits.com/fantastical-ios/help/apple-watch"
      },
      {
        "label": "Google: Calendar:s eget kontobaserade gränssnitt",
        "url": "https://support.google.com/calendar/answer/2465776?hl=en"
      }
    ],
    "seeAlso": [
      "what-fantastical-costs-and-what-this-does",
      "natural-language-calendar-events-iphone",
      "iphone-calendar-tasks-reminders-versus-event-alerts"
    ],
    "comparison": {
      "heading": "Börja med ditt viktigaste krav",
      "columns": [
        "Krav",
        "Relevanta alternativ att kontrollera",
        "Viktig skillnad"
      ],
      "rows": [
        {
          "cells": [
            "Händelser med väder och vyer för iPhone/iPad",
            "Cloud Calendars och de dokumenterade vädervyerna i de jämförda apparna.",
            "Kontrollera prognosplats, tillgänglig period och vy; vädertäckningen är inte obegränsad."
          ]
        },
        {
          "cells": [
            "Naturlig språkinmatning för händelser",
            "Fantastical och den relevanta funktionen i Readdle eller BusyCal.",
            "Meningsanalys är inte samma sak som diktering eller vanlig redigering av händelser."
          ]
        },
        {
          "cells": [
            "Uppgifter bredvid händelser",
            "Den dokumenterade uppgiftskällan i Readdle, Calendar 366, BusyCal eller Fantastical.",
            "En påminnelse om en händelse är inte en integration för att slutföra uppgifter."
          ]
        },
        {
          "cells": [
            "Google Calendar-synk och valfri annonsborttagning",
            "Cloud Calendars Base inkluderar Google Calendar-synk; Advanced tar bort annonser.",
            "Stöd för Microsoft Calendar och Teams kräver Premium."
          ]
        },
        {
          "cells": [
            "En annan köpmodell",
            "Den aktuella butikslistningen och rättigheten för varje app och plattform.",
            "En gratis nedladdning är inte bevis på att alla funktioner är gratis; regionala priser och abonnemang kan ändras."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-left",
      "week-right",
      "widgets"
    ],
    "galleryDevice": "iPad",
    "galleryCaption": "Detta är skärmar från Cloud Calendars för appens vyer, väder och widgetar. De är inte skärmbilder från de andra produkterna i jämförelsen.",
    "actionHeading": "Prova kalendern mot ett verkligt planeringsbehov",
    "actionText": "Om ditt viktigaste krav är ett schema på iPhone eller iPad med väder och widgetar, utvärdera Cloud Calendars med en tillfällig händelse. Håll specialkrav för uppgifter, bokning och naturligt språk åtskilda när du jämför produkter.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Se hur väder passar in i kalenderarbetsflödet"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Jämför widgetarna i Cloud Calendars"
      },
      {
        "slug": "onecal-alternative-iphone-calendar-view-or-sync",
        "label": "Skilj en kombinerad vy från kopierad upptagen tid"
      }
    ]
  }
};
