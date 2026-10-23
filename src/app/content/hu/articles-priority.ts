import type { LocalisedArticle } from '../types';

export const PRIORITY_HU: Readonly<Record<string, LocalisedArticle>> = {
  "forecast-beside-every-event": {
    "title": "Egy naptáresemény óránkénti időjárásának ellenőrzése iPhone-on és iPaden",
    "short": "Időjárás az esemény időpontjára",
    "description": "Párosítsa eseménye helyét, dátumát és óráit az elérhető időjárás-előrejelzéssel.",
    "lede": "Ha egy naptáreseményhez szeretné ellenőrizni az időjárást, három dolgot kell egyeztetnie: a helyszínt, annak helyi dátumát és az esemény kezdetétől végéig tartó időszakot. A Cloud Calendars alkalmazásban válassza ki az időjárási helyet, és vizsgálja meg az elérhető órákat. Egy esemény címe és egy közeli időjárásikon önmagában nem bizonyítja, hogy ezek egyeznek. Ezt az útmutatót a fejlesztő, az Arte Soft adta ki.",
    "commonBelief": "Sokan azt hiszik, hogy a naptárban látható napi időjárásikon ugyanaz, mint az eseményhez kapcsolt előrejelzés.",
    "sections": [
      {
        "heading": "Kezdje a hellyel és a dátummal",
        "body": [
          "Nyissa meg az előrejelzést a kívánt helyszínre, és hasonlítsa össze a dátumát a naptárbejegyzéssel. A naptár időjárása a kiválasztott időjárási helyet tükrözheti, ezért ellenőrizze, hogy az megfelel-e az eseménynek, ahelyett hogy azt feltételezné, az esemény címe szabja ezt meg.",
          "Egy jövő havi esemény már akkor is létezhet, amikor arra a dátumra még nem érhetők el időjárási adatok. Tartsa meg az eseményt, és térjen vissza az előrejelzéshez közelebb a dátumához; a hiányzó időjárási bejegyzés nem derült időt jelent."
        ]
      },
      {
        "heading": "Óránkénti kérdéshez használjon óránkénti részleteket",
        "body": [
          "A napi összefoglaló és az óránkénti előrejelzés más kérdésekre ad választ. Ha az esemény kettőtől ötig tart, nézze meg az adott időszakot lefedő elérhető órákat, ne tekintsen egyetlen napi ikont a teljes képnek.",
          "Ha az időszaknak csak egy része érhető el, a többit hagyja nyitva. Az alkalmazás nem ígér teljes óránkénti időjárási adatot minden létrehozható eseményhez, és ez az útmutató sem ígéri, hogy bármely esemény megnyitásakor mindig a teljes időjárási időablak jelenik meg."
        ]
      },
      {
        "heading": "Válassza külön a valószínűséget, a mennyiséget és az időzítést",
        "body": [
          "Olvassa el a vizsgált érték címkéjét. A csapadék valószínűsége nem azonos a csapadék mennyiségével vagy időtartamával. Ugyanígy az óránkénti érték és a napi összefoglaló eltérő időszakokra vonatkozik; két lehetséges időpont összevetésekor azonos időszakokat hasonlítson össze.",
          "Válasszon a csomagjának megfelelő tartaléktervet ahelyett, hogy egyetlen százalékértéket univerzális induljon vagy mondja le szabálynak tekintene. Az időjárási információk változhatnak, ezért nézze meg újra őket, amikor döntést kell hozni."
        ]
      },
      {
        "heading": "Ellenőrizze mentés előtt az időjárás alapján tervezett eseményt",
        "body": [
          "Az alkalmazás képes eseményvázlatot indítani egy előrejelzési órából. Mentés előtt ellenőrizze a vázlat dátumát, kezdési és befejezési idejét, valamint a célnaptárt. Az előrejelzés kiválasztása nem helyettesíti annak ellenőrzését, hogy valóban a megfelelő vállalást hozza létre.",
          "Ha a naptárhozzáférés vagy a célnaptár akadályozza a mentést, ezt az engedélyezési problémát az időjárás-hozzáféréstől külön oldja meg. Az előrejelzés megtalálása nem ad szerkesztési jogosultságot egy megosztott naptárhoz."
        ]
      },
      {
        "heading": "Használja a teljes előrejelzést, ha az összefoglaló nem elég",
        "body": [
          "Kültéri tevékenységnél ellenőrizze az adott tevékenységhez és a ténylegesen kiválasztott helyhez kapcsolódó változókat. Az aktuális időjárási widget vagy a kezdőoldali bemutató nem helyettesíti az alkalmazásban elérhető előrejelzési órák ellenőrzését.",
          "Ha eltérést észlel, először a helyet és az időbélyeget hasonlítsa össze. Eltérő szolgáltatók, kiválasztott helyek és előrejelzési időszakok különböző megjelenítést eredményezhetnek anélkül, hogy ez azt bizonyítaná, hogy a naptáresemény megváltozott."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Erősítse meg a helyszínt és az esemény dátumát.",
      "Ellenőrizze az elérhető órákat a teljes tevékenység idejére.",
      "A valószínűséget és a mennyiséget külön értékként értelmezze.",
      "Mentés előtt ellenőrizze az eseményvázlatot."
    ],
    "seeAlso": [
      "weather-inside-your-calendar",
      "planning-outdoors-without-being-rained-on"
    ],
    "updated": "2026-10-23",
    "faq": [
      {
        "q": "Minden eseményhez teljes előrejelzés tartozik?",
        "a": "Nem. A lefedettség a kiválasztott helytől, valamint az elérhető dátumoktól és óráktól függ."
      },
      {
        "q": "Az időjárásikon kifejezetten az esemény címére vonatkozik?",
        "a": "Ezt ne feltételezze pusztán amiatt, hogy az esemény közelében látható. Ellenőrizze külön az időjárási helyet."
      },
      {
        "q": "Egy óra megérintése elment egy új eseményt?",
        "a": "Ahol elérhető, eseményvázlatot indít. Mentés előtt ellenőrizze a dátumát, az idejét és a naptárat."
      }
    ],
    "sourcesHeading": "Időjárási források és helybeállítások",
    "sources": [
      {
        "label": "Apple: WeatherKit előrejelzések és regionális elérhetőség",
        "url": "https://developer.apple.com/weatherkit/"
      },
      {
        "label": "Apple: Adatvédelem és Helymeghatározás",
        "url": "https://support.apple.com/en-us/102515"
      }
    ],
    "comparison": {
      "heading": "Gyakorlati ellenőrzés kültéri esemény előtt",
      "columns": [
        "Ellenőrzés",
        "Példa",
        "Döntés"
      ],
      "rows": [
        {
          "cells": [
            "Hely",
            "Az esemény egy másik városban van.",
            "Válassza ki ezt a célállomást az időjárás nézetben, és olvassa le a nevét."
          ]
        },
        {
          "cells": [
            "Időszak",
            "A tevékenység 14:00 és 16:00 között tart.",
            "Ellenőrizze mindkét órát, valamint a kapcsolódó előkészületeket vagy utazást."
          ]
        },
        {
          "cells": [
            "Lefedettség",
            "Csak a szükséges órák egy része érhető el.",
            "Tartsa a tervet ideiglenesnek, és ütemezzen be egy újabb ellenőrzést."
          ]
        },
        {
          "cells": [
            "Mentett esemény",
            "Egy időjárási órából piszkozatot indít.",
            "Mentés előtt nézze át a dátumot, az időzónát, az időtartamot és a cél naptárat."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-right",
      "week-left"
    ],
    "galleryCaption": "Az időjárás- és a heti nézet ugyanannak a tervezési feladatnak különböző részeit mutatja. Az előrejelzés helyét az esemény helyétől külön erősítse meg.",
    "actionHeading": "Ellenőrizze az előrejelzést a valós eseményeihez",
    "actionText": "Használja a Cloud Calendarst iPhone-on vagy iPaden az elérhető előrejelzés és az időbeosztása áttekintésére. Az időjárás segíti a döntését; nem helyez át automatikusan egy eseményt, és nem erősít meg változtatást a résztvevőkkel.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Ismerje meg a naptár- és időjárásnézeteket"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Válasszon gyors Otthon képernyős áttekintést"
      },
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Ellenőrizze az időbeosztása mögötti naptárakat"
      }
    ]
  },
  "the-widget-that-shows-what-is-next": {
    "updated": "2026-10-23",
    "title": "Naptár-widgetek iPhone-on és iPaden: közelgő események és időjárás",
    "short": "Közelgő események az Otthon képernyőn",
    "description": "Válasszon Cloud Calendars widgetet a közelgő eseményekhez, a dátumhoz vagy az időjáráshoz.",
    "lede": "Válassza a Calendar Events vagy a Calendar Events Large widgetet, ha a közelgő eseményeket szeretné látni az Otthon képernyőn. Válassza a Calendar & Weather lehetőséget a dátumot és időjárást megjelenítő nézethez. Ezek az elrendezések különböző kérdésekre adnak választ; hozzáadás előtt tekintse meg az eszközén elérhető előnézetet. Ezt az útmutatót a Cloud Calendars fejlesztője, az Arte Soft adta ki.",
    "sections": [
      {
        "heading": "Először válassza ki az eseményelrendezést",
        "body": [
          "A Cloud Calendars widgetgalériájában a Calendar Events a közepes méretű eseménylistás elrendezés. A Calendar Events Large több helyet ad a közelgő eseményeknek. A Calendar & Weather külön dátum- és időjáráselrendezés; kis mérete nem garantálja a következő esemény sorát. A nevek az eszközén lefordítva is megjelenhetnek.",
          "iPhone-on tartsa lenyomva a Főképernyő egy üres részét, válassza a Szerkesztés, majd a Widget hozzáadása lehetőséget, aztán keresse meg a Cloud Calendarst, és válassza ki a kívánt elrendezést. Hozzáadás előtt hasonlítsa össze az előnézetet. Apple widgetes útmutatója erre a rendszerbeli galériára vonatkozik; ez külön áll az alkalmazáson belüli naptárnézetektől."
        ]
      },
      {
        "heading": "A widget hozzáadása és ellenőrzése iPaden",
        "body": [
          "iPaden az Apple Főképernyő-widgetgalériáját használja: tartsa lenyomva a hátteret, nyissa meg a Szerkesztést, majd válassza a Widget hozzáadása lehetőséget. Keressen rá a Cloud Calendarsra, nézze meg a felkínált stílusokat és méreteket, adja hozzá a szükséges elrendezést, helyezze el, majd fejezze be a Kész gombbal. Kövesse az iPadOS-verziója által megjelenített vezérlőket; az előnézet nem igazolja, hogy a naptáradatai betöltődtek.",
          "Ha eseményekre van szüksége, válassza a Calendar Events vagy a Calendar Events Large lehetőséget. Hasonlítsa össze a telepített alkalmazás által kínált stílusokat; egy dátum- és időjáráscsempe más kérdésre ad választ, mint egy eseménylista.",
          "Nyissa meg a Cloud Calendarst azon az iPaden, és keressen egy ismert, jövőbeli, időponthoz kötött eseményt egy kijelölt naptárban. Az, hogy iPhone-on helyesen látszik a nézet, nem igazolja az iPad fiókjait, hozzáférését vagy betöltött adatait. Hasonlítsa össze a címet, a dátumot és a kezdési időt, majd folytassa az alábbi jogosultsági és frissítési ellenőrzésekkel, ha a widget eltér."
        ]
      },
      {
        "heading": "Ellenőrizze, mi számít közelgőnek",
        "body": [
          "Az eseménymegjelenítés a kijelölt naptárakat és a jövőbeli, időponthoz kötött eseményeket használja. Az egész napos bejegyzések és azok az események, amelyek kezdési ideje már elmúlt, kimaradnak ebből a közelgő listából. Ezért egy születésnap vagy egy már folyamatban lévő megbeszélés látható lehet az alkalmazásban, itt mégsem jelenik meg.",
          "Például ha ma az egyetlen bejegyzése egy egész napos utazási címke, az üres közelgő lista nem jelenti azt, hogy az utazási címke elveszett. Nyissa meg az alkalmazást a teljes nap ellenőrzéséhez. Hasonlóképpen a következő időponthoz kötött esemény lehet holnap vagy később; olvassa el a dátumát, és ne feltételezze, hogy minden sor a mai napra vonatkozik."
        ]
      },
      {
        "heading": "Különítse el a hiányzó eseményt attól, amikor a lista kifogyott a sorokból",
        "body": [
          "Egy widget csak korlátozott számú közelgő eseményt mutat. Ha a korábbi események kitöltik a sorait, egy későbbi esemény hiányozhat, még akkor is, ha jelen van az alkalmazásban és jogosult a közelgő listára. Egy nagyobb eseményelrendezés több sort tud megjeleníteni; ettől még nem a teljes naptárat mutatja.",
          "Kezdje a legközelebbi jövőbeli, időponthoz kötött eseménnyel egy kijelölt naptárban. Ha ez megjelenik, de egy későbbi már nem, nyissa meg az alkalmazást a menetrend többi részének ellenőrzéséhez. Ha a legközelebbi jogosult esemény is hiányzik, folytassa a naptárkiválasztás, hozzáférés és frissítés ellenőrzésével. Ne helyezzen át és ne töröljön eseményeket csak azért, hogy egy későbbi bejegyzés megjelenjen."
        ]
      },
      {
        "heading": "Legyen az alkalmazás az első összehasonlítási alap",
        "body": [
          "Nyissa meg a Cloud Calendarst, és keressen meg egy konkrét jövőbeli, időponthoz kötött eseményt. Erősítse meg, hogy a hozzá tartozó naptár ki van jelölve, és hogy az alkalmazás rendelkezik a szükséges naptárhozzáféréssel. Hasonlítsa össze a címet, a dátumot és a kezdési időt a widgettel. Ha az esemény az alkalmazásból is hiányzik, először a fiókot vagy a szinkronizálást vizsgálja meg.",
          "Ha egyértelmű példára van szüksége, használjon egy ártalmatlan teszteseményt egy saját naptárban. Adjon neki jövőbeli kezdési időt és könnyen felismerhető címet. Kerülje valódi meghívás módosítását vagy fiókok eltávolítását pusztán a Főképernyő teszteléséhez."
        ]
      },
      {
        "heading": "Számoljon a frissítésekkel, de ne feltételezzen fix határidőt",
        "body": [
          "A widgetek mentett információkat jelenítenek meg, és nem futnak folyamatosan úgy, mint egy megnyitott alkalmazás. A frissítési ütemezést az Apple szabályozza. Az alkalmazás megnyitása és az esemény ellenőrzése friss összehasonlítási alapot ad, de nem határoz meg pontos másodpercszámot arra, hogy a widgetnek mikorra kell megváltoznia.",
          "Ha az alkalmazás továbbra is helyes, miközben a widget hibás marad, jegyezze fel az elrendezést, a kijelölt naptárat, az esemény időpontját, valamint az alkalmazás- és iOS-verziókat. Az üres lista, egy régi esemény és egy hibás időpont különböző megfigyelések; jelezze, önnél melyik látható."
        ]
      },
      {
        "heading": "Az időjárást külön összefoglalóként értelmezze",
        "body": [
          "A dátum melletti időjárás nem az egyes események helyszínéhez és kezdési idejéhez kötött előrejelzés. Egy szabadtéri esemény előtt nyissa meg az időjárásnézetet, és ellenőrizze a tervezett helyet és órát. Az aktuális állapotot jelző ikon nem tudja megállapítani, milyen körülmények lesznek egy későbbi megbeszélés idején.",
          "Tartsa meg ezt a widgetet gyors tájékozódásra. Az egész napos elfoglaltságokhoz, az eseményrészletekhez és az egész menetrendet igénylő döntésekhez használja a teljes naptárat."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Eseménylistához válassza a Calendar Events vagy a Calendar Events Large lehetőséget.",
      "Ellenőrizzen egy jövőbeli, időponthoz kötött eseményt egy kijelölt naptárban.",
      "A widget hibakeresése előtt hasonlítsa össze a dátumát és idejét az alkalmazásban.",
      "Ahelyett, hogy naptáradatokat törölne, jegyezze fel a tartós eltéréseket."
    ],
    "faq": [
      {
        "q": "Miért hiányzik a születésnapom?",
        "a": "A közelgő lista nem tartalmazza az egész napos eseményeket. A születésnapokat és más, csak dátumos bejegyzéseket a teljes naptárban ellenőrizze."
      },
      {
        "q": "A kis widget mutatja a következő megbeszélést?",
        "a": "A kis Calendar & Weather elrendezés a dátumot és az időjárást mutatja. Eseményekhez válasszon eseménylistás elrendezést."
      },
      {
        "q": "Ha nincs közelgő esemény, az azt jelenti, hogy ma szabad vagyok?",
        "a": "Nem. Az egész napos bejegyzések, a már folyamatban lévő események, a ki nem jelölt naptárak és az elavult információk mind megváltoztathatják ezt a következtetést."
      }
    ],
    "sourcesHeading": "Források és Apple-útmutatók",
    "sources": [
      {
        "label": "Apple: Widgetek hozzáadása és szerkesztése iPhone-on",
        "url": "https://support.apple.com/118610"
      },
      {
        "label": "Apple: Widget naprakészen tartása",
        "url": "https://developer.apple.com/documentation/widgetkit/keeping-a-widget-up-to-date"
      },
      {
        "label": "Apple: Widgetek hozzáadása, szerkesztése és eltávolítása iPaden",
        "url": "https://support.apple.com/guide/ipad/add-edit-and-remove-widgets-ipadb0de8630/ipados"
      }
    ],
    "seeAlso": [
      "choosing-a-widget-size",
      "a-countdown-to-your-next-meeting",
      "calendar-on-apple-watch"
    ],
    "comparison": {
      "heading": "Válassza azt a megjelenítést, amelyre valóban szüksége van",
      "columns": [
        "Megjelenítés",
        "Erre használja",
        "Ellenőrizze, mielőtt erre hagyatkozik"
      ],
      "rows": [
        {
          "cells": [
            "Calendar Events",
            "A közelgő, időponthoz kötött események kompakt nézete.",
            "Az esemény kijelölt naptárhoz tartozik, és még nem kezdődött el."
          ]
        },
        {
          "cells": [
            "Calendar Events Large",
            "Több hely a közelgő eseményeknek.",
            "A nagyobb elrendezésnek is korlátozott a sorszáma."
          ]
        },
        {
          "cells": [
            "Calendar & Weather",
            "Gyors áttekintés a dátumról és az időjárásról.",
            "Kis elrendezése nem garantál közelgő eseménysort."
          ]
        },
        {
          "cells": [
            "Live Activity",
            "Külön visszaszámlálás a következő eseményhez a támogatott iPhone-felületeken.",
            "Nem Főképernyő-widget és nem is önálló Zárolási képernyő-widgetelrendezés."
          ]
        }
      ]
    },
    "galleryKinds": [
      "widgets",
      "live"
    ],
    "galleryCaption": "A Főképernyő widgetjei és a Live Activity külön megjelenítések. Válassza azt az elrendezést, amely megfelel a szükséges információnak.",
    "actionHeading": "Tegye a menetrendje hasznos részét a Főképernyőre",
    "actionText": "Nyissa meg a Cloud Calendarst, ellenőrizzen egy ismert, jövőbeli, időponthoz kötött eseményt, majd adja hozzá a megfelelő widgetet iPhone-ján vagy iPadjén. A teljes naptár ellenőrzésének továbbra is az alkalmazás a helye.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Nézze át az időjárást a menetrendje mellett"
      },
      {
        "slug": "forecast-beside-every-event",
        "label": "Ellenőrizze egy szabadtéri esemény óráit"
      },
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Ellenőrizze a csatlakoztatott naptárfiókjait"
      }
    ]
  },
  "onecal-alternative-iphone-calendar-view-or-sync": {
    "updated": "2026-10-23",
    "title": "Cloud Calendars vagy OneCal? Válasszon egyesített nézetet vagy naptárszinkront",
    "short": "Cloud Calendars és OneCal munkafolyamat szerint",
    "description": "Hasonlítsa össze a OneCal és a Cloud Calendars szolgáltatásait nézetek, átmásolt események, mobilos vezérlők és csomagok alapján.",
    "lede": "A szükséges eredmény alapján válasszon: több időbeosztás együttes áttekintése, egy eredeti esemény szerkesztése vagy foglaltsági idő átmásolása egy másik fiókba. A Cloud Calendars iPhone- és iPad-alapú tervezési nézeteket kínál; a OneCal külön ismerteti az egyesített nézetet és a külön Calendar Sync szabályokat. Ezt az összehasonlítást az Arte Soft, a Cloud Calendars fejlesztője tette közzé.",
    "commonBelief": "Két termék, amely megjeleníti a Google-, iCloud- és Outlook-naptárakat, szükségszerűen ugyanúgy tartja szinkronban a foglaltságot, az eseménymódosításokat és a másolatokat.",
    "sections": [
      {
        "heading": "Válasszon az áttekintés és a másik fiókban végzett módosítás között",
        "body": [
          "Ha az a célja, hogy egy személyes programot egy munkahelyi megbeszélés mellett lásson, egyesített nézetre van szüksége. Ha a munkahelyi naptárnak is tartalmaznia kell egy foglaltsági blokkot a személyes programhoz, akkor egy meghatározott forrásból célba irányuló munkafolyamat kell. Az első eredmény nem hozza létre automatikusan a másodikat.",
          "A Cloud Calendars a kiválasztott naptárakat egy iPhone- és iPad-alapú tervezési nézetbe hozza. A OneCal külön ismerteti a Unified Calendar View nézetet a Calendar Sync beállításától; a kiadója szerint ez a nézet szinkronszabályok beállítása nélkül is használható. Még a fiókok csatlakoztatása vagy az előfizetésnevek összehasonlítása előtt döntse el, melyik eredmény számít."
        ]
      },
      {
        "heading": "Értse meg, mit változtathat meg egy átmásolt esemény",
        "body": [
          "A OneCal Calendar Sync dokumentációja egyirányú és többirányú szabályokat ír le, amelyek klóneseményeket hoznak létre. A külön lefedettségi útmutatója szerint a klón módosításai nem terjednek vissza az eredetire. Azonosítsa az eredetit és a naptárat, amelyhez tartozik, mielőtt egy átmásolt eseményt tekintene a megbeszélés átütemezésének helyének.",
          "A Cloud Calendars szolgáltatói kapcsolatai is létrehozhatnak tükrözött naptárakat az iOS-tárolóban. Az egyesített megjelenítés nem bizonyítja, hogy a rekordok egyesültek, vagy hogy a módosítás eljutott a szolgáltatóhoz. Egy olyan naptárnál, amelyet Ön birtokol és szerkeszthet, ellenőrizzen egy eldobható, vendégek nélküli teszteseményt a szolgáltatónál is, nem csak az alkalmazásban."
        ]
      },
      {
        "heading": "Ellenőrizze a ténylegesen használt eszköz vezérlőit",
        "body": [
          "A OneCal jelenlegi mobilos útmutatója ismerteti a naptáresemények létrehozását és szerkesztését, az ismétlődési lehetőségeket, az RSVP-t és a megbeszélésekhez való csatlakozást. Külön azt is jelzi, hogy a Calendar Sync konfigurációk létrehozása, szerkesztése, szüneteltetése vagy törlése a webalkalmazásban történik; mobilon ezek a konfigurációk csak megjelennek. A foglalási hivatkozás beállítását is webes feladatként írja le.",
          "A Cloud Calendars iPhone- és iPad-alkalmazás napi, heti, havi, éves és listanézettel. Próbálja ki a szükséges szerkesztést a telepített nézetben, olvassa el az esetleges ismétlődési választási lehetőséget, és erősítse meg a mentett eseményt. Ne feltételezze, hogy egy másik termék mobilmenüje, foglalási munkafolyamata vagy automatizálási vezérlői ebben is léteznek."
        ]
      },
      {
        "heading": "Ellenőrizze a lefedettséget, ne feltételezzen korlátlan előzményeket",
        "body": [
          "A OneCal jelenlegi lefedettségi útmutatója legfeljebb egyéves jövőbeli szinkronablakot ad meg a Google és az iCloud esetében, Outlooknál pedig legfeljebb három hónapot. Különbséget tesz a jövőbeli ismétlődő sorozatok és az önálló múltbeli események között is. Ezek a kiadó által dokumentált korlátok, nem az Ön konkrét fiókjának tesztjei, és nem állítások a naptárnézet minden funkciójáról.",
          "A Cloud Calendars esetében is ellenőrizni kell a fiók kapcsolódási útját, a kiválasztott naptárakat és a releváns dátumokat. Ha a régi megbeszélések lényegesek, hasonlítson össze egy beazonosított eseményt a szolgáltatónál és az alkalmazásban. Egy naptáralkalmazás nem automatikusan teljes biztonsági mentés, és nem garancia arra, hogy minden korábbi rekord lekérődött."
        ]
      },
      {
        "heading": "Hasonlítsa össze a csomagkövetelményeket és a számlázási módot",
        "body": [
          "A Cloud Calendars a Google Calendar szinkront a Base csomagban tartalmazza; az Advanced eltávolítja a hirdetéseket, a Premium pedig Microsoft Calendar és Teams támogatást ad. A fiókengedélyeket a csomagtól külön ellenőrizze. Vásárlás előtt nézze meg az aktuális helyi árat és számlázási időszakot, ne egy rögzített nemzetközi árösszehasonlításra hagyatkozzon.",
          "A OneCal webes csomagútmutatója tagonkénti csomagokat és tizennégy napos próbaidőszakot ír le, beleértve a klónok eltávolítását a próbaidő lejártakor. A mobilos számlázási útmutatója az áruház által kezelt vásárlásokat és a csapattagok hozzáadásának korlátait ismerteti. Ellenőrizze, mely funkciókhoz kell folyamatos csomag, és hol kezelik a vásárlást; önmagában az ingyenes letöltés nem válaszolja meg ezeket."
        ]
      },
      {
        "heading": "Váltás előtt tesztelje a tényleges tervezési munkafolyamatát",
        "body": [
          "Ha fontos az időjárás, a widgetek vagy egy Live Activity, vegye ezeket is bele a próbába azon az eszközön, amelyet használ. A Cloud Calendars kínál ilyen tervezési felületeket, az időjárás pedig az elérhető dátumokra és a kiválasztott helyre korlátozódik. Az itt áttekintett OneCal oldalak nem igazolják az ezekkel a felületekkel való funkcióazonosságot; ellenőrizze a jelenlegi terméket, ahelyett hogy egy útmutatóból a hiányra következtetne.",
          "Őrizze meg az eredeti alkalmazásokat és a kapcsolódási adatokat, amíg nem ellenőrizte a szükséges eredményt. Jegyezze fel, hogy a láthatóságot, az eredeti esemény szerkesztését, az átmásolt foglaltsági időt vagy egy emlékeztetőt ellenőrzött-e; ezek eltérő eredmények. Mielőtt lekapcsol egy szolgáltatást, nézze át, mi történik a meglévő másolatokkal, és ne éles meghívón vagy valódi ügyféltalálkozón kísérletezzen."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Írja le, hogy egyesített nézetre van szüksége, vagy arra, hogy az események egy másik fiókba másolódjanak.",
      "Azonosítsa az eredetieket, a másolatokat és azt a fiókot, amelyhez minden fontos esemény tartozik.",
      "Ellenőrizze a szükséges vezérlőket a tényleges telefonos, táblagépes vagy webes munkafolyamatában.",
      "Hasonlítson össze egy átlagos hetet és minden olyan korábbi dátumot, amelyre támaszkodik.",
      "Ellenőrizze az aktuális csomagkövetelményeket, a helyi árat és a vásárlási szolgáltatót.",
      "Váltás előtt ellenőrizzen egy eldobható teszteseményt, és nézze át a másolateltávolítás szabályait."
    ],
    "faq": [
      {
        "q": "Ugyanaz az egyesített naptárnézet, mint a foglaltsági idő szinkronizálása?",
        "a": "Nem. Az egyesített nézet lehetővé teszi az elfoglaltságok összehasonlítását. Egy bejegyzés létrehozásához egy másik fiókban külön támogatott munkafolyamat kell; a OneCal a Calendar Sync szabályokat külön dokumentálja a Unified Calendar View nézettől."
      },
      {
        "q": "Módosíthatok egy OneCal-klónt az eredeti megbeszélés átütemezéséhez?",
        "a": "A lefedettségi útmutatója szerint a klón módosításai nem terjednek át az eredetire. Azonosítsa az eredeti eseményt, és kövesse az adott naptár szerkesztési és szervezői engedélyeit."
      },
      {
        "q": "Melyik alkalmazás olcsóbb az én beállításomhoz?",
        "a": "Ez attól függ, milyen funkciókra, fiókokra, számlázási módra és helyi árra van szüksége. A Cloud Calendars a Google szinkront a Base csomagban, a Microsoft támogatást pedig a Premium csomagban tartalmazza. Nézze át a OneCal aktuális csomagját és mobilos számlázási feltételeit a tervezett munkafolyamathoz; ez az útmutató nem állít általános árgyőztest."
      }
    ],
    "sourcesHeading": "A OneCal hivatalos munkafolyamat- és csomagdokumentációja",
    "sources": [
      {
        "label": "OneCal: mobilos funkciók és csak weben végezhető beállítási feladatok",
        "url": "https://docs.onecal.io/docs/mobile-apps"
      },
      {
        "label": "OneCal: Calendar Sync és forrásból célba irányuló szabályok",
        "url": "https://docs.onecal.io/docs/calendar-sync/calendar-sync-intro"
      },
      {
        "label": "OneCal: szinkronablakok és a klónesemények módosításai",
        "url": "https://docs.onecal.io/docs/calendar-sync/what-does-onecal-sync"
      },
      {
        "label": "OneCal: csomagok, próbaidőszak és lejárati működés",
        "url": "https://docs.onecal.io/docs/billing/plans-and-free-trial"
      },
      {
        "label": "OneCal: App Store és Google Play előfizetések",
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
      "heading": "Munkafolyamat összehasonlítása előfizetés előtt",
      "columns": [
        "Kérdés",
        "Cloud Calendars",
        "OneCal dokumentáció"
      ],
      "rows": [
        {
          "cells": [
            "Hol tekintem át az időbeosztásomat?",
            "iPhone-on és iPaden, napi, heti, havi, éves és listanézettel.",
            "A Unified Calendar View külön áll a Calendar Sync beállításától."
          ]
        },
        {
          "cells": [
            "Szükségem van arra, hogy a foglaltsági blokkok a fiókok között másolódjanak?",
            "Erre ne következtessen az egyesített nézetből; a szolgáltatói kapcsolatok helyben tükrözhetik a naptárakat.",
            "A Calendar Sync klóneseményeket hoz létre egyirányú vagy többirányú szabályokkal."
          ]
        },
        {
          "cells": [
            "Hol módosíthatom a szinkronszabályokat?",
            "Használja az alkalmazás fiókkapcsolatához dokumentált vezérlőket.",
            "Az áttekintett mobilos útmutató a szinkronkonfiguráció módosítását a webalkalmazáshoz rendeli."
          ]
        },
        {
          "cells": [
            "Melyik Cloud Calendars csomagra van szükségem?",
            "A Base tartalmazza a Google Calendar szinkront; az Advanced eltávolítja a hirdetéseket; a Premium Microsoft Calendar és Teams támogatást ad.",
            "Ellenőrizze a szükséges munkafolyamathoz a OneCal aktuális csomagját és számlázási módját."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-left",
      "hook"
    ],
    "galleryCaption": "A Cloud Calendars valódi naptárképernyői a tervezési nézetet mutatják. Az összehasonlítás megkülönbözteti ezt a nézetet egy szolgáltatás szerveroldali klónozási szabályaitól.",
    "actionHeading": "Válassza ki az ellenőrizni kívánt eredményt",
    "actionText": "Ha iPhone- vagy iPad-áttekintésre van szüksége időjárással és widgetekkel, próbálja ki a Cloud Calendarst egy ártalmatlan teszteseménnyel. Ha az a követelmény, hogy a foglaltsági idő egy másik fiókba másolódjon, olyan szolgáltatást értékeljen, amely ezt a műveletet kifejezetten dokumentálja.",
    "articleLinks": [
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Állítson be egy egyesített naptárnézetet"
      },
      {
        "slug": "fantastical-readdle-calendar366-iphone-comparison",
        "label": "Hasonlítsa össze a többi iPhone-naptár lehetőséget"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Válassza ki a Főképernyőn megjelenő nézetet"
      }
    ]
  },
  "fantastical-readdle-calendar366-iphone-comparison": {
    "updated": "2026-10-23",
    "title": "iPhone-naptár alternatívák: Cloud Calendars, Fantastical, Readdle és BusyCal",
    "short": "Hasonlítsa össze az iPhone-naptár alternatívákat",
    "description": "Hasonlítsa össze az iPhone-naptárakat időjárás, nézetek, feladatok és a szükséges munkafolyamat alapján.",
    "lede": "A naptárt az alapján válassza ki, milyen feladatot szeretne elvégezni: események áttekintése időjárással, gyors eseményrögzítés, feladatkezelés vagy fióknézetek egyesítése. A Cloud Calendars, a Fantastical, a Calendars by Readdle, a Calendar 366 és a BusyCal ezekben a munkafolyamatokban és az előfizetési csomagok feltételeiben különbözik. A Cloud Calendarst az Arte Soft fejleszti, és ezt az összehasonlítást is ő teszi közzé.",
    "sections": [
      {
        "heading": "Először azt döntse el, minek kell működnie, és csak utána hasonlítsa össze a megjelenést",
        "body": [
          "Írja össze a naptárszolgáltatóit, az eszközeit és három alapvető műveletet. Például: a munkahelyi és személyes naptárak együttes megjelenítése, egy emlékeztető teljesítése és egy megbeszélés gyors hozzáadása. Ezeket a műveleteket először privát mintaadatokkal próbálja ki, mielőtt egy teljes időbeosztást importálna.",
          "Az, hogy egy termék támogatja az Ön szolgáltatójának nevét, nem jelenti azt, hogy minden csatlakozási mód azonos jogosultságokat vagy funkciókat ad. Egy eszköznaptár, egy közvetlenül kapcsolt fiók és egy feliratkozott feed hasonló kinézetű bejegyzéseket adhat, miközben eltérő műveleteket enged."
        ]
      },
      {
        "heading": "Kiindulási alapként használja a szolgáltató saját naptárát",
        "body": [
          "A Google kezdő útmutatója a saját naptárfelületét ismerteti ütemezéshez, feladatokhoz, megosztáshoz és több naptár kezeléséhez. Ha az időbeosztása már ott található, először a forrásban próbálja ki a szükséges műveletet, mielőtt eldöntené, kell-e másik alkalmazás.",
          "Például hasonlítsa össze ugyanazt az eseményt a Google Calendar és a Fantastical alkalmazásban, miután csatlakoztatta a kívánt fiókot. Ellenőrizze, hogy a keresett előny az egyesített nézet, a feladatkapcsolat, a gyors bevitel vagy egy adott eszközfelület. Egy másik naptárkliens használata nem jelent automatikusan átállást másik szolgáltatóra."
        ]
      },
      {
        "heading": "Fantastical: ellenőrizze a fiókkapcsolatokat és a gyors bevitelt",
        "body": [
          "A Flexibits dokumentálja a közvetlen naptárfiók-kapcsolatokat és az iOS-ben már beállított naptárakhoz és emlékeztetőkhöz kapcsolódó lehetőségeket is. A kezdő útmutató a közvetlen kapcsolatokat ajánlja az alkalmazás funkcióinak teljes körű használatához. Azonosítsa, melyik utat választotta, ahelyett hogy ok nélkül kétszer kapcsolná ugyanazt a naptárt.",
          "A Fantastical dokumentálja a mondatalapú bevitelt és az újrahasználható esemény- vagy feladatsablonokat is. Próbáljon ki egy egyértelmű dátumot, időtartamot és célnaptárat, majd ellenőrizze a mentett eredményt. A szintaxisa a Fantastical sajátja; egy másik alkalmazás szövegmezője ugyanazt a mondatot másként értelmezheti."
        ]
      },
      {
        "heading": "Calendars by Readdle: ellenőrizze a feladatok forrását",
        "body": [
          "A Readdle a Google-, Outlook- és iCloud-naptárakat feladat- és természetesnyelvi beviteli funkciókkal együtt mutatja be. A feladatok beállításáról szóló útmutató ismerteti, hogyan választható az iOS Reminders vagy a Google Tasks a Task Options alatt. Ez akkor fontos, ha egy telefonon teljesített feladatnak egy meghatározott eredeti listát kell frissítenie.",
          "Egy eldobható feladattal mindkét oldalon tesztelje a teljesítést, ne csak azt, hogy a cím megjelenik-e az idővonalon. Ha Macen is szüksége van egy nézetre vagy műveletre az iPhone mellett, ott is próbálja ki. Ne feltételezze azonos kezelőelemek meglétét csak a közös terméknév alapján."
        ]
      },
      {
        "heading": "Calendar 366: ellenőrizze a rendszerhozzáférést, a készleteket és az időjárás helyét",
        "body": [
          "A Calendar 366 dokumentációja különbséget tesz a rendszernaptárakhoz és emlékeztetőkhöz való hozzáférés, valamint a közvetlen fiókintegrációk között. Ismerteti a naptárkészleteket, amelyek meghatározzák a látható naptárakat és listákat. Ezek a készletek alapértelmezett naptárat is kijelölhetnek, ezért ellenőrizze, hová fog tartozni egy újonnan létrehozott esemény.",
          "Ugyanez a dokumentáció ismerteti a saját természetesnyelvi értelmezőjét és az Apple Weatherre épülő időjárást, rendszer- vagy egyéni helyválasztással. Kültéri tervezésnél ellenőrizze a kiválasztott helyet, ne feltételezze, hogy az előrejelzés minden esemény címét követi. Ezek a kiadó által dokumentált képességek, nem az Ön fiókján tesztelt funkciók."
        ]
      },
      {
        "heading": "BusyCal: ellenőrizze a feladatok megjelenítését és az időjáráshoz használt nézetet",
        "body": [
          "A BusyCal iOS-es feladatútmutatója különbséget tesz dátummal rendelkező, időponthoz kötött és dátum nélküli feladatok között. Ismerteti a teljesítési vezérlőket és azt is, hogyan vihetők tovább a befejezetlen, dátummal rendelkező feladatok. Az időjárásról szóló útmutató szerint az előrejelzés a Lista, Nap és Hónap nézetben jelenik meg, ezért azt a nézetet tesztelje, amelyet ténylegesen használ, ne feltételezze, hogy az időjárás mindenhol látható.",
          "A BusyCal dokumentálja a természetesnyelvi bevitelt is, mint lehetőséget az új esemény alapértelmezett beállításainál. Próbálja ki ugyanazt a privát mintaeseményt, mint a többi alkalmazásban, majd ellenőrizze a naptárat és a mentett időpontot. Ezek a BusyCal kezelőelemei, nem minden naptáralkalmazásban közös parancsok."
        ]
      },
      {
        "heading": "A Watch-munkafolyamatot külön ellenőrizze a telefonétól",
        "body": [
          "A Fantastical Watch-útmutatója dokumentálja az Up Next, List és Tasks nézeteket, beleértve a feladatok teljesítését is. A BusyCal feladatútmutatója különbséget tesz a Watchon megjelenő dátummal rendelkező és időponthoz kötött feladatok, valamint a dátum nélküli feladatok között. Ha fontos a dátum nélküli hátraléklista, vegye azt is bele a próbába, ne csak a következő eseményt tesztelje.",
          "A Watch complication gyors áttekintést ad, míg a Watch alkalmazás további műveleteket is kínálhat. Ellenőrizze az adatokat és a műveletet a tényleges órán és a telefonon, és tekintse át az aktuális csomagot. Az asztali, telefonos és órás felületek nem csereszabatosak csak azért, mert ugyanazt a terméknevet használják."
        ]
      },
      {
        "heading": "Az árat és a jogosultságot külön ellenőrzésként kezelje",
        "body": [
          "Ellenőrizze az aktuális helyi vásárlási képernyőt, a próbaidőszak után elérhető funkciókat, valamint azt, hogy egy korábbi vásárlás módosítja-e a jogosultságait. Az ingyenes letöltés, az ismétlődő előfizetés és a korábbi vásárlás nem feltétlenül ugyanazt a funkciókészletet nyitja meg.",
          "A kiadói oldalak eltérő időpontokban frissülhetnek. A Readdle aktuális termék-gyakori kérdései több alapvető képességet ingyenesként írnak le, míg egy külön súgóoldal az ingyenes és a teljes verzió között más felosztást sorol fel. Ahelyett, hogy valamelyik leírást általános ígéretnek tekintené, ellenőrizze a szükséges műveletet a telepített alkalmazásban és annak aktuális vásárlási feltételei között."
        ]
      },
      {
        "heading": "Hol van a helye a Cloud Calendarsnak a szűkített listán",
        "body": [
          "A Cloud Calendars egy másik iPhone- és iPad-lehetőség kijelölt naptárakhoz, többféle tervezési nézethez, időjáráshoz és widgetekhez. A Google szinkronizálás a Base csomag része, az Advanced eltávolítja a hirdetéseket, a Premium pedig hozzáadja a Microsoft Calendar támogatását. Ellenőrizze az aktuális csomagot és a szolgáltatói jogosultságokat a saját beállításaihoz.",
          "Ha nélkülözhetetlen egy speciális feladatkapcsolat, sablonparancs vagy asztali munkafolyamat, azt a terméket használja, amely dokumentálja és sikeresen végre is hajtja ezt a követelményt. Hasonlítsa össze a mentett eredményeket és a napi ráfordítást; ez az ellenőrzőlista a választást segíti, nem azt állítja, hogy az itt említett minden funkció létezik a Cloud Calendarsban."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Sorolja fel a fiókjait, eszközeit és alapvető műveleteit.",
      "Válasszon egy fiókcsatlakozási utat, és ellenőrizze, milyen naptárakat tesz elérhetővé.",
      "A gyors bevitelt és a feladatteljesítést ártalmatlan példákkal tesztelje.",
      "Ellenőrizze az időjárás helyét és az egyes eszközökön használt nézeteket.",
      "Bármely próbaidőszak vagy korábbi jogosultság után ellenőrizze az aktuális vásárlási feltételeket."
    ],
    "faq": [
      {
        "q": "Melyik a legjobb alternatíva a Fantastical helyett?",
        "a": "Ez a szükséges munkafolyamattól függ. Hasonlítsa össze a naptár- és feladatforrásokat, az eseménybevitelt, az eszköztámogatást és az aktuális jogosultságot. Ez az útmutató nem hirdet ki általános teljesítménybajnokot."
      },
      {
        "q": "Ugyanaz a szolgáltatónév azt jelenti, hogy minden alkalmazás ugyanúgy szinkronizál?",
        "a": "Nem. A közvetlen kapcsolatokat, az eszköznaptárakat, a feedeket és a jogosultságokat külön ellenőrizze, majd igazoljon egy minta módosítást a forrásánál."
      },
      {
        "q": "Feltételezhetem, hogy minden hirdetett funkció ingyenes?",
        "a": "Nem. Ellenőrizze a telepített alkalmazást, a helyi vásárlási képernyőt és a próbaidőszak után megmaradó funkciókat. A kiadói dokumentáció különböző verziókat vagy jogosultságokat írhat le."
      }
    ],
    "sourcesHeading": "Az útmutatóhoz ellenőrzött hivatalos dokumentáció",
    "sources": [
      {
        "label": "Fantastical: fiókcsatlakozási utak",
        "url": "https://flexibits.com/fantastical-ios/help/getting-started"
      },
      {
        "label": "Fantastical: természetesnyelvi bevitel és sablonok",
        "url": "https://flexibits.com/fantastical-ios/help/adding-events-and-tasks"
      },
      {
        "label": "Readdle: aktuális termékképességek és gyakori kérdések",
        "url": "https://readdle.com/calendars"
      },
      {
        "label": "Readdle: feladatforrás kiválasztása",
        "url": "https://support.readdle.com/calendars/synchronization/how-to-sync-tasks-with-ios-reminders-or-google-tasks"
      },
      {
        "label": "Readdle: külön útmutató az ingyenes/teljes csomaghoz",
        "url": "https://apphelp.readdle.com/en/index.php?id=585&pg=kb.page"
      },
      {
        "label": "Calendar 366: integrációk, készletek, gyors bevitel és időjárás",
        "url": "https://calendar366.com/help/index.html"
      },
      {
        "label": "BusyCal for iOS: feladatok és a Watch feladatkorlátai",
        "url": "https://www.busymac.com/docs/busycalios/70659-tasks/"
      },
      {
        "label": "BusyCal for iOS: időjárás és támogatott nézetek",
        "url": "https://www.busymac.com/docs/busycalios/70665-weather/"
      },
      {
        "label": "BusyCal for iOS: természetesnyelvi bevitel",
        "url": "https://www.busymac.com/docs/busycalios/70669-natural-language/"
      },
      {
        "label": "Fantastical: Apple Watch nézetek és műveletek",
        "url": "https://flexibits.com/fantastical-ios/help/apple-watch"
      },
      {
        "label": "Google: a Calendar saját, fiókalapú felülete",
        "url": "https://support.google.com/calendar/answer/2465776?hl=en"
      }
    ],
    "seeAlso": [
      "what-fantastical-costs-and-what-this-does",
      "natural-language-calendar-events-iphone",
      "iphone-calendar-tasks-reminders-versus-event-alerts"
    ],
    "comparison": {
      "heading": "Kezdje a fő követelménnyel",
      "columns": [
        "Követelmény",
        "Ellenőrizendő releváns lehetőségek",
        "Fontos különbség"
      ],
      "rows": [
        {
          "cells": [
            "Események időjárással és iPhone/iPad nézetekkel",
            "Cloud Calendars és az összehasonlított alkalmazásokban dokumentált időjárásnézetek.",
            "Ellenőrizze az előrejelzés helyét, az elérhető időszakot és a nézetet; az időjárási lefedettség nem korlátlan."
          ]
        },
        {
          "cells": [
            "Természetesnyelvi eseménybevitel",
            "Fantastical és a megfelelő Readdle- vagy BusyCal-funkció.",
            "A mondatértelmezés nem ugyanaz, mint a diktálás vagy a hagyományos eseményszerkesztés."
          ]
        },
        {
          "cells": [
            "Feladatok az események mellett",
            "A dokumentált feladatforrás a Readdle, Calendar 366, BusyCal vagy Fantastical esetében.",
            "Az eseményemlékeztető nem azonos a feladatteljesítési integrációval."
          ]
        },
        {
          "cells": [
            "Google Calendar szinkronizálás és opcionális hirdetéseltávolítás",
            "A Cloud Calendars Base tartalmazza a Google Calendar szinkronizálást; az Advanced eltávolítja a hirdetéseket.",
            "A Microsoft Calendar és a Teams támogatásához Premium szükséges."
          ]
        },
        {
          "cells": [
            "Más vásárlási modell",
            "Az aktuális áruházi adatlap és jogosultság minden alkalmazásnál és platformnál.",
            "Az ingyenes letöltés nem bizonyítja, hogy minden funkció ingyenes; a regionális árak és csomagok változhatnak."
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
    "galleryCaption": "Ezek a Cloud Calendars képernyői az alkalmazás nézeteiről, időjárásáról és widgetjeiről. Nem az összehasonlításban szereplő többi termék képernyőképei.",
    "actionHeading": "Próbálja ki a naptárt egy valós tervezési igényen",
    "actionText": "Ha a fő igénye egy iPhone- vagy iPad-időbeosztás időjárással és widgetekkel, értékelje a Cloud Calendarst egy eldobható mintaeseménnyel. Az összehasonlításnál a speciális feladat-, foglalási és természetesnyelvi igényeket kezelje külön.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Nézze meg, hogyan illeszkedik az időjárás a naptári munkafolyamatba"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Hasonlítsa össze a Cloud Calendars widgetjeit"
      },
      {
        "slug": "onecal-alternative-iphone-calendar-view-or-sync",
        "label": "Különböztesse meg az egyesített nézetet a másolt foglaltsági időtől"
      }
    ]
  }
};
