import { LocalisedArticle } from '../types';

/**
 * The four articles this language carries.
 *
 * Chosen one per intent -- weather, one view, sharing, price -- so the language
 * answers a whole question rather than a quarter of four. The numbers are not
 * here: they live once in article-facts.ts and join the prose by id, so a
 * translation can rewrite every sentence without touching a figure.
 */
export const ARTICLES_HU: Readonly<Record<string, LocalisedArticle>> = {
  "month-view-on-a-bigger-screen": {
  "updated": "2026-10-22",
  "title": "Havi naptár iPaden és iPhone-on: dátumválasztás után ellenőrizze a részleteket",
  "short": "Havi nézet a részletek elvesztése nélkül",
  "description": "Hasonlítson össze dátumokat iPaden vagy iPhone-on. Áthelyezés előtt ellenőrizze a rejtett eseményeket, naptárakat és pontos időket.",
  "lede": "A havi nézet megmutatja, mely napokra esnek a programok. Annak bizonyítására kevésbé alkalmas, hogy egy adott óra szabad. Válasszon dátumot az áttekintésben, majd egyeztetés előtt vizsgálja meg a napot és az eseményt. Az útmutatót a Cloud Calendars fejlesztője, az Arte Soft adja ki.",
  "commonBelief": "A nagyobb havi rács minden részletet megjelenít, és a látszólag üres dátum bizonyítja, hogy mindenki ráér.",
  "sections": [
    {
      "heading": "Döntse el, dátumokra vagy pontos órákra van szüksége",
      "body": [
        "A hónapban több héten át összehasonlíthatja a projekt határidejét, az utazást és a családi programot. Ha az a kérdés, ütközik-e két találkozó 14:30-kor, váltson napi vagy heti nézetre, és ellenőrizze a pontos kezdést és befejezést. A havi cella nem olyan időskálát ad, mint az órás rács.",
        "Egy műhelyfoglalkozás szervezője először kizárhatja az utazás hetét. Ezután a javasolt napot kell ellenőriznie: programok, felkészülés, utazás és szükséges befejezés. Az üresnek látszó cella vizsgálandó lehetőség, nem megerősített foglalás és nem mások szabadidejének igazolása."
      ]
    },
    {
      "heading": "A látható címek mellett figyelje a további események számát",
      "body": [
        "A Cloud Calendars jelenlegi havi cellája korlátozott számú eseménycímkét mutat, és további darabszámot jelez, ha több esemény tartozik a naphoz. A címek egysorosak, ezért rövidülhetnek. Nyissa meg a napot vagy az eseményt, ha a teljes cím vagy a többi program fontos.",
        "Az iPad nagyobb kijelzőjén olvashatóbb lehet az áttekintés, de a nagyobb fizikai hely nem szüntet meg feltétlenül minden megjelenítési korlátot. Keskeny alkalmazásablak vagy nagyobb betűméret módosíthatja, mi fér el. iPhone-on is nézze meg a napot, mielőtt a látható címkéket teljes programnak tekinti."
      ]
    },
    {
      "heading": "Ellenőrizze a hónapot, a kiválasztott naptárakat és a szomszédos dátumokat",
      "body": [
        "Dátumválasztás előtt olvassa el a megjelenített hónapot és évet. A rács a sorok kitöltéséhez a szomszédos hónap napjait is tartalmazhatja. A Cloud Calendarsban használja a hónapváltást és ellenőrizze a kijelölt dátumot, ne csak a négyzet helyzetére hagyatkozzon.",
        "Nézze meg, mely naptárak vannak kiválasztva. A munkahelyi események elrejtése segítheti a családi terv áttekintését, de ezeket a kötelezettségeket ki is veszi abból a nézetből. Duplikáció vizsgálatához ideiglenesen rejtsen el egy forrást és hasonlítsa össze; ne töröljön találkozót pusztán a zsúfoltság miatt."
      ]
    },
    {
      "heading": "Közös program módosítása előtt nyissa meg az eseményt",
      "body": [
        "A részletekben erősítse meg a címet, tulajdonost vagy naptárt, helyi időt és időtartamot. A szín segíti az áttekintést, de nem helyettesíti a fiók és a szerkesztési jogosultság ismeretét. A látható meghívó nem ugyanaz, mint a saját szervezésű találkozó.",
        "A Cloud Calendars havi nézetében húzással másik dátumra helyezhetők az események. Valódi programnál előbb tisztázza a céldátumot és az ismétlődésre vonatkozó módosítás hatókörét. Engedélyezett változtatás után nyissa meg újra és ellenőrizze az eredményt; a helyi mozdulat nem bizonyítja a szolgáltató vagy minden résztvevő elfogadását."
      ]
    },
    {
      "heading": "Az ismétlődést és az időzónát külön ellenőrizze",
      "body": [
        "Ha csak az e heti óra költözik, ne változtassa meg véletlenül a későbbi rendjét. Olvassa el az elérhető hatókörválasztást, majd vizsgálja meg a módosított és egy későbbi alkalmat is. A hónapban könnyű összevetni az ismétlődő dátumokat, de a szerkesztés hatóköre dönti el a változás jelentését.",
        "Utazásnál vagy időzónákon átívelő találkozónál kifejezetten ellenőrizze a helyi dátumot és időt. Másik napra helyezés nem váltja át automatikusan a szándékolt találkozóidőt. Ha érinti, ellenőrizze az óraátállítást, és egyeztesse az időpontot az érintettekkel."
      ]
    },
    {
      "heading": "Használja a nagyobb nézetet más termékekkel való összekeverés nélkül",
      "body": [
        "Az Apple Naptár saját havi megjelenítési lehetőségeket kínál, a Teamup pedig eltérő böngészős és mobilos nézeteket ismertet. Ezek a vezérlők az adott termékhez tartoznak. Ne keresse a Teamup böngészős beállításait vagy az Apple Naptár nézetmenüjét a Cloud Calendarsban pusztán az azonos név miatt.",
        "Egyhavi program nem jelent egyhavi időjárás-előrejelzést. Szabadtéri tervhez külön ellenőrizze a helyet, dátumot és az elérhető előrejelzési órákat. A végleges találkozót a megfelelő naptárba mentse, a változásokat pedig közvetlenül egyeztesse a résztvevőkkel."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "A hónapban válasszon lehetséges dátumokat, majd napi vagy heti nézetben ellenőrizze az órákat.",
    "Nyissa meg a további darabszámot vagy rövidített címeket mutató napokat.",
    "Mielőtt szabadnak tekint egy dátumot, ellenőrizze a hónapot, évet és kijelölt naptárakat.",
    "Erősítse meg az esemény naptárát, idejét, időtartamát és szerkesztési jogosultságát.",
    "Olvassa el az ismétlődés hatókörét, és áthelyezés után ellenőrizze a mentett alkalmat.",
    "Az időjárási adatok elérhetőségét külön vizsgálja, a változásokat egyeztesse a résztvevőkkel."
  ],
  "faq": [
    {
      "q": "Az iPad havi nézete minden találkozót teljesen megjelenít?",
      "a": "Ne feltételezze ezt. A Cloud Calendars korlátozza a havi cella eseménycímkéit, és további darabszámot jelez. A teljes programhoz nyissa meg a napot és az eseményt."
    },
    {
      "q": "Az üres nap azt jelenti, hogy ráérek?",
      "a": "Előbb ellenőrizze a kijelölt naptárakat, dátumot és a kapcsolódó fiókadatok meglétét. Az áttekintés csak a jelenleg rendelkezésre álló és megjelenített információkat mutatja."
    },
    {
      "q": "Ismétlődő esemény áthelyezése csak azt a dátumot módosítja?",
      "a": "Feltételezés helyett olvassa el a szerkesztési hatókört. Mentés után vizsgálja meg a módosított és egy későbbi alkalmat, majd erősítse meg a kívánt megállapodást."
    }
  ],
  "sourcesHeading": "A nézetek hivatalos leírásainak összehasonlítása",
  "sources": [
    {
      "label": "Apple: havi, többnapos és listanézet az Apple Naptárban",
      "url": "https://support.apple.com/en-ca/guide/iphone/iphfd1054569/ios"
    },
    {
      "label": "Teamup: naptárnézetek, böngészős és alkalmazásbeli beállítások",
      "url": "https://calendar.teamup.com/kb/how-to-use-calendar-views/"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "weather-inside-your-calendar",
    "sharing-one-event-not-your-calendar"
  ]
},

  'weather-inside-your-calendar': {
  "updated": "2026-10-23",
  "title": "Naptár időjárással iPhone-on és iPaden: tervezze meg a napját egyetlen nézetben",
  "short": "Használja együtt a naptárt és az időjárást",
  "description": "Hasonlítsa össze naptárát a kiválasztott hely időjárásával iPhone-on és iPaden.",
  "lede": "A Cloud Calendars egyetlen iPhone- vagy iPad-alkalmazásban jeleníti meg az időbeosztását és az időjárást. A naptárban válasszon dátumot, az időjárás nézetben pedig tekintse meg a kiválasztott helyet és az elérhető előrejelzési órákat. Kültéri program esetén azt az időszakot ellenőrizze, amely valóban számít, ne csak a napi ikonra hagyatkozzon. Ezt az útmutatót az alkalmazás fejlesztője, az Arte Soft adta ki.",
  "commonBelief": "A naptár mellett megjelenő időjárás automatikusan leírja minden esemény címét, minden órát és minden jövőbeli dátumot.",
  "sections": [
    {
      "heading": "Válasszon egy valódi tervezési kérdést",
      "body": [
        "Induljon ki egy konkrét eseményből, például egy délutáni parklátogatásból. Határozza meg, min változtathat az időjárás: az időponton, a helyszínen, a felkészülésen vagy azon a döntésen, hogy alternatívát választ-e. Nem kell az egész naptárat átrendeznie csak azért, mert a napi szimbólum esőt mutat.",
        "Írja fel a tevékenység tényleges kezdetét és végét, szükség esetén az előkészületekkel együtt. A naptár áttekintése segít a lehetséges dátumok megtalálásában, míg az előrejelzés ellenőrzése egy adott helyre és időszakra vonatkozik. Lehetőségek összehasonlításakor tartsa külön ezt a két feladatot."
      ]
    },
    {
      "heading": "Az értékek értelmezése előtt erősítse meg az időjárási helyet",
      "body": [
        "A Cloud Calendars az aktuális vagy a kiválasztott hely időjárását kínálja. Ellenőrizze a megjelenített helyet, és ne feltételezze, hogy egy esemény címe észrevétlenül módosítja az előrejelzést. Egy másik városban lévő eseményt annak a városnak az időjárásával kell összevetni.",
        "Például egy látogató múzeumi érkezést tervezhet, miközben a telefon még otthon van. Összehasonlítás előtt olvassa el az előrejelzés helyét és az esemény helyi időpontját. A képernyőn egymáshoz közelinek tűnő értékek nem bizonyítják, hogy a naptár és az időjárás ugyanazt a helyet használja."
      ]
    },
    {
      "heading": "Az óránkénti és a napi lefedettséget külön ellenőrizze",
      "body": [
        "Tájékozódáshoz használjon napi bejegyzést, a nap egy részére vonatkozó kérdésekhez pedig az elérhető óránkénti bejegyzéseket. Egy kettőtől ötig tartó foglaláshoz több kell egyetlen szimbólum gyors megnézésénél. Ellenőrizze, hogy a releváns órák valóban rendelkezésre állnak-e.",
        "Az alkalmazás jelenlegi forrásában a napi lista legfeljebb a WeatherKit által visszaadott tíz napot tartalmazza. Ez külön áll a naptárban való navigációtól és a jelenleg szolgáltatott óráktól. Egy jövőbeli esemény nem hosszabbítja meg az időjárási lefedettséget. Ha az adott időszak hiányzik, tervezzen későbbi időjárás-ellenőrzést."
      ]
    },
    {
      "heading": "Értse, mit jelent az időjárási érték",
      "body": [
        "Az Apple dokumentálja a WeatherKit adatait, például a hőmérsékletet, a csapadékot, a szelet és az UV értéket, egyes termékek pedig csak bizonyos régiókban érhetők el. A kiválasztott helyen rendelkezésre álló értékeket olvassa, és ne várja el, hogy minden időjárási termék mindenhol elérhető legyen.",
        "A Met Office útmutatása jól mutatja, miért számít az előrejelzési időszak és a változók meghatározása: egyes értékek egy adott pillanatra, mások egy időszakra vonatkoznak. Használja az adott szolgáltató címkéit. Az eső valószínűsége, mennyisége és időtartama külön kérdés, és nincs egyetlen szám, amely minden kültéri tevékenységről döntene."
      ]
    },
    {
      "heading": "Ellenőrizzen egy időjárási órából létrehozott piszkozatot",
      "body": [
        "Ahol az alkalmazás lehetővé teszi, hogy egy órából eseményt hozzon létre, ott egy piszkozat nyílik meg. A jelenlegi forrás az időjárási hely időzónáját használja, egyórás időtartamot javasol, és az alapértelmezett új eseménynaptárt választja ki. Mentés előtt ellenőrizze az összes értéket.",
        "Erősítse meg a címet, a cél naptárat, a kezdést, a befejezést és a tervezett helyszínt. Az előrejelzési időpont kiválasztása nem ad engedélyt megosztott naptár szerkesztésére, helyszín értesítésére vagy teremfoglalásra. Ellenőrizze a mentett eseményt, és szerezzen be minden szükséges jóváhagyást."
      ]
    },
    {
      "heading": "Kezelje külön a webhelyes bemutatót",
      "body": [
        "A webhely interaktív időjárás-bemutatója az Open-Meteo szolgáltatást használja. Az alkalmazás az Apple WeatherKitet használja. A webes bemutató hasznos a megjelenítés megismeréséhez, de a hely, az adatok és az elérhető dátumok eltérhetnek az alkalmazásétól.",
        "Valódi döntéshez nyissa meg az alkalmazást, és hasonlítsa össze a tervezett eseményt az ahhoz elérhető előrejelzéssel. Ha megosztott tervet módosít, erősítse meg a szervezőt, az ismétlődés hatókörét és a résztvevőket. Tartson kéznél egy egyeztetett alternatívát, ha a tevékenység a körülményektől függ."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Azonosítsa az eseményt és azt a döntést, amelyet az időjárás befolyásolhat.",
    "Erősítse meg az időjárási helyet, valamint az esemény helyi dátumát és időpontját.",
    "Az elérhető óránkénti lefedettséget külön vizsgálja meg a napi összefoglalótól.",
    "Olvassa el a valószínűséget, a mennyiséget és a többi releváns értéket a címkéik alapján.",
    "Mentés előtt nézze át az eseménypiszkozat minden részletét és a cél naptárat.",
    "A döntés időpontjában ellenőrizze újra, és a megosztott változtatásokat közvetlenül erősítse meg."
  ],
  "faq": [
    {
      "q": "A naptáram melletti időjárás követi az egyes események címét?",
      "a": "Ezt ne feltételezze. Ellenőrizze a megjelenített időjárási helyet, és vesse össze a helyszínnel; a képernyőn való közelség nem bizonyít egyezést."
    },
    {
      "q": "Az alkalmazás a webhely időjárás-szolgáltatóját használja?",
      "a": "Nem. Az alkalmazás az Apple WeatherKitet használja; a webhely bemutatója külön az Open-Meteót használja."
    },
    {
      "q": "Az előrejelzési óra kiválasztása automatikusan elment egy eseményt?",
      "a": "Ahol ez a művelet elérhető, ott egy piszkozatot indít. Ellenőrizze annak dátumát, időzónáját, időtartamát, naptárát és helyét, majd mentse a kívánt eseményt."
    }
  ],
  "seeAlso": [
    "weather-calendar-history-versus-forecast-iphone",
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather",
    "weather-where-the-event-is",
    "planning-outdoors-without-being-rained-on"
  ],
  "sourcesHeading": "Hivatalos források és további olvasnivaló",
  "sources": [
    {
      "label": "Apple: WeatherKit előrejelzési információk és regionális elérhetőség",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: az előrejelzés helye, időszakai és időjárási értékei",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ],
  "comparison": {
    "heading": "Melyik időjárásnézet válaszolja meg a kérdését?",
    "columns": [
      "Az Ön kérdése",
      "Mit érdemes ellenőrizni",
      "Mit nem bizonyít"
    ],
    "rows": [
      {
        "cells": [
          "Mi következik ma?",
          "A naptár napi vagy heti nézete a kiválasztott hely időjárása mellett.",
          "Hogy minden esemény címe automatikusan módosítja az időjárási helyet."
        ]
      },
      {
        "cells": [
          "Befolyásolhatja az eső a délutáni eseményemet?",
          "Óránkénti adatok a helyszínre és az esemény teljes időtartamára.",
          "Hogy egy napi szimbólum minden órát leír."
        ]
      },
      {
        "cells": [
          "Tervezhetek a jövő hónapra az időjárás alapján?",
          "Most a naptárát, később pedig a dátumhoz közelebbi előrejelzés-ellenőrzést.",
          "Hogy a naptárban való navigáció kiterjeszti az előrejelzés lefedettségét."
        ]
      },
      {
        "cells": [
          "Láthatok gyors áttekintést az Otthon képernyőn?",
          "A megfelelő Otthon képernyő widgetet.",
          "Hogy minden widgetelrendezés tartalmaz eseményeket vagy teljes előrejelzést."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-right",
    "hook"
  ],
  "galleryCaption": "Valós Cloud Calendars képernyők: az időjárásnézet és egy eseményekkel teli nap. Ellenőrizze a kiválasztott helyet és dátumot az alkalmazásban.",
  "actionHeading": "Tervezzen együtt az időbeosztásával és az előrejelzéssel",
  "actionText": "A Cloud Calendars iPhone-ra és iPadre készült. Kezdje a Base csomaggal, amely tartalmazza a nézeteket, az időjárást és a Google Calendar szinkronizálást; az Advanced eltávolítja a hirdetéseket, míg a Premium Microsoft Calendar- és Teams-támogatást ad hozzá.",
  "articleLinks": [
    {
      "slug": "forecast-beside-every-event",
      "label": "Ellenőrizze az időjárást egy esemény óráira"
    },
    {
      "slug": "the-widget-that-shows-what-is-next",
      "label": "Válasszon naptár- és időjárás-widgetet"
    },
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "Hozza egyetlen nézetbe a naptárfiókokat"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
  "updated": "2026-10-23",
  "title": "Google-, iCloud- és Outlook-naptárak együtt iPhone-on és iPaden",
  "short": "Három szolgáltató, egy nézet",
  "description": "Kombinálja a naptárnézeteket, és értse meg a fiókengedélyeket, másolatokat és csomagkövetelményeket.",
  "lede": "Ha a munkahelyi és a személyes eseményeket együtt szeretné látni, csatlakoztassa a kívánt fiókokat, válassza ki a naptáraikat, és ugyanazokat az eseményeket egy nézetben ellenőrizze. A Cloud Calendars az iPhone és iPad tervezését támogatja iCloud és Google Calendar használatával; a Microsoft Calendar támogatása a Premium csomag része. Az események együttes megjelenítése nem ugyanaz, mint a foglaltsági idő másolása a szolgáltatói fiókok között. Ezt az útmutatót a fejlesztő, az Arte Soft teszi közzé.",
  "commonBelief": "Ha több naptárt egy alkalmazásba teszek, az automatikusan összhangban tartja azok rendelkezésre állását, megosztását és eseménymásolatait.",
  "sections": [
    {
      "heading": "Azonosítsa az egyes események mögötti fiókot és naptárt",
      "body": [
        "Kezdjen szolgáltatónként egy-egy hétköznapi eseménnyel. Jegyezze fel a bejelentkezett e-mail-címet, a naptár nevét, valamint azt, hogy az esemény az Öné-e vagy meghívásként kapta. Két „Calendar” nevű naptár teljesen eltérő fiókokhoz tartozhat. A szín segít egy hét gyors áttekintésében; a fiók és a naptár azonosítja, hová kell küldeni egy szerkesztést.",
        "Például egy fogorvosi időpont a személyes iCloud-naptárában és egy projektmegbeszélés a Microsoftban együtt is megjelenhet Önnek. Ez önmagában nem teszi láthatóvá a fogorvosi időpontot a kollégái számára, és nem foglalja le azt az időt az ő ütemezőeszközeikben.",
        "Mielőtt kapcsolatot módosítana, döntse el a kívánt eredményt. Ha eseményadatokat szeretne másik fiókba áthelyezni, használja alább a „Naptárexport-formátum kiválasztása” részt a támogatott átviteli útvonal megtalálásához, és ellenőrizzen jellemző eseményeket, mielőtt a célhelyre hagyatkozna. Ha az időpontokat szeretné összehasonlítani, hagyja meg a meglévő naptártulajdonosokat, és jelenítse meg együtt a kijelölt forrásokat. Ha egy másik fióknak foglaltsági időt kell kapnia, a „Cloud Calendars és OneCal munkafolyamat szerint” ismerteti, miben különbözik a rendelkezésre állás másolása a személyes áttekintéstől."
      ]
    },
    {
      "heading": "Csatlakozzon a megfelelő úton",
      "body": [
        "iCloud esetén először kapcsolja be az iCloud Calendar szolgáltatást az iPhone-on a kívánt Apple Account alatt. Az Apple beállítási útmutatója ismerteti az eszköz beállításait. A Cloud Calendars az iPhone naptárrendszerén keresztül elérhető naptárakhoz fér hozzá, és olvasásukhoz naptárhozzáférésre van szüksége. Nem elég, ha a fiók egy másik eszközön van csatlakoztatva.",
        "A Cloud Calendarsban a „Sign in with Google” és a „Sign in with Microsoft” műveletek is elérhetők. Ellenőrizze, melyik fiókot választja bejelentkezéskor, majd nyissa meg annak naptárcsoportját, és válassza ki a szükséges naptárakat. Ha a megfelelő szolgáltatóhoz, de rossz személyes vagy munkahelyi azonosítóval jelentkezik be, az teljesen érvényes, mégis váratlan naptárlistát eredményezhet."
      ]
    },
    {
      "heading": "Értse meg a csomagokat anélkül, hogy összekeverné őket az engedélyekkel",
      "body": [
        "A Base csomag tartalmazza a Google Calendar szinkronizálást és a naptárnézeteket. Az Advanced a Base csomagot reklámmentességgel egészíti ki. A Premium a Microsoft Calendar- és Microsoft Teams-funkciókat adja hozzá. Vásárlás előtt ellenőrizze az aktuális helyi árat és a számlázási időszakot.",
        "Egy csomag azt változtatja meg, hogy mely alkalmazásfunkciók érhetők el; nem ad tulajdonjogot valaki más naptárához. A Google különbséget tesz az események megtekintésének és módosításának joga között. A munkahelyi szabályzatok és a Microsoft-naptárhoz tartozó engedélyek továbbra is érvényesek. Egy látható esemény vagy egy elérhető szerkesztő nem bizonyítja, hogy a szolgáltató elfogad egy frissítést."
      ]
    },
    {
      "heading": "Az egyesített nézet naptármásolatokat is tartalmazhat",
      "body": [
        "A Google- és Microsoft-kapcsolatok naptármásolatokat használnak az iPhone naptárrendszerében az események megjelenítéséhez és szinkronizálásához. Ne feltételezze, hogy egy fiók csatlakoztatása nem hagy másolatot az eredeti szolgáltatón kívül. Az ilyen másolatok célhelye függhet attól, milyen naptárforrások érhetők el az eszközön.",
        "Ha ugyanaz a fiók más úton is eléri a telefont, az ismétlődő eseményeket ne tekintse különálló eseményeknek anélkül, hogy ellenőrizné a naptárneveket és forrásokat. Azonosítsa, melyik megjelenítést melyik naptár adja úgy, hogy ideiglenesen elrejti az egyiket. Ne töröljön eseményt vagy naptárat csak azért, hogy rendezettebbnek tűnjön a képernyő: egy csatlakoztatott másolat visszaküldheti a módosításokat a szolgáltatónak."
      ]
    },
    {
      "heading": "Esemény létrehozásakor továbbra is mindig válassza ki a célhelyet",
      "body": [
        "Mentés előtt az esemény naptárát ugyanolyan figyelmesen ellenőrizze, mint a dátumát és idejét. Családi eseménynél azt a naptárat válassza, amelyet a család ténylegesen használ; munkahelyi megbeszélésnél a jóváhagyott munkahelyi célhelyet használja. Az, hogy mindkét naptárt együtt látja, még nem teszi egyiket sem automatikus célhellyé minden új eseményhez.",
        "Egy esemény naptárának módosítása vagy naptárak közti áthúzása áthelyezés lehet, nem pedig ártalmatlan második nézet. Megjelenítési probléma vizsgálatakor tartsa a meghívásokat és az ismétlődő megbeszéléseket a megszokott naptárukban. Ha változtatásra van szükség, először állapítsa meg, ki az esemény tulajdonosa, és melyik naptár fogadhatja el azt."
      ]
    },
    {
      "heading": "Ellenőrizze az áttekintést, mielőtt rábízná magát",
      "body": [
        "Hasonlítson össze egy friss eseményt a szolgáltató saját naptárában a Cloud Calendars megfelelő eseményével. Ellenőrizze a dátumot, az időzónát, a címet és a kijelölt naptárat. Egy olyan szerkeszthető naptár esetén, amely az Ön tulajdona, vendégek nélküli, eldobható eseménnyel jobb ellenőrizni, mint egy élő megbeszélést módosítani. Mielőtt késznek tekintené a kapcsolatot, erősítse meg az eredményt a szolgáltatónál.",
        "Ne számítson arra, hogy az egyesített nézet automatikusan névtelen foglaltsági blokkokat hoz létre egy másik fiókban. Ha azt szeretné, hogy a kollégái elérhetetlennek lássák Önt anélkül, hogy a személyes részleteket látnák, használjon kifejezetten jóváhagyott rendelkezésreállási megoldást, és ezt az ő oldalukról is ellenőrizze. A világos személyes áttekintés és a megosztott rendelkezésre állás két külön feladat."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Sorolja fel szolgáltatónként egy esemény pontos fiókját és naptárát.",
    "Kapcsolja be a kívánt iCloud-naptárakat az eszközön, és ellenőrizze a naptárhozzáférést.",
    "Használja a megfelelő Google- vagy Microsoft-bejelentkezést, és válassza ki a kívánt naptárakat.",
    "Mielőtt bármit módosítana, hasonlítson össze egy friss eseményt a szolgáltató saját nézetével.",
    "Ideiglenesen rejtse el a feltételezett duplikált forrást; a mögöttes eseményeket hagyja érintetlenül.",
    "Minden új eseménynél ellenőrizze a célnaptárt, és külön ellenőrizze a szükséges foglaltságimegosztást."
  ],
  "faq": [
    {
      "q": "A munkahelyi kollégáim látni fogják a személyes eseményeimet azért, mert mindkét naptárt megjelenítem?",
      "a": "A naptárak együttes megjelenítése nem megosztási utasítás és nem automatikus foglaltsági híd. Ellenőrizze az egyes naptárak tényleges megosztási beállításait. A szolgáltatói kapcsolatok naptármásolatokat hozhatnak létre az eszközön, ezért az egyesített nézet arra sem garancia, hogy az eseményadatok csak az eredeti szolgáltatónál léteznek."
    },
    {
      "q": "Miért látok egy eseményt, de miért nem tudom sikeresen szerkeszteni?",
      "a": "Lehet, hogy a naptár csak olvasható, az esemény más szervezőhöz tartozik, vagy a szolgáltató elutasítja a módosítást. Ellenőrizze a tulajdonjogot és az engedélyeket a szolgáltató naptárában. Magasabb alkalmazáscsomag vásárlása nem változtat ezeken az engedélyeken."
    },
    {
      "q": "Ugyanazt a Google-fiókot minden elérhető módon csatlakoztassam?",
      "a": "Először ellenőrizze, hogyan jelenik meg már most a telefonon. Több kapcsolódási út megnehezítheti a naptármásolatok azonosítását. Válassza ki a használni kívánt módot, ellenőrizze annak eseményeit, és a vizsgálat idejére inkább rejtsen el egy plusz megjelenítést, ne pedig adatokat töröljön vagy fiókokat kapcsoljon le első lépésként."
    }
  ],
  "sourcesHeading": "Források és beállítási hivatkozások",
  "sources": [
    {
      "label": "Apple: az iCloud Calendar beállítása az eszközein",
      "url": "https://support.apple.com/guide/icloud/set-up-calendar-mme4d73a8727/icloud"
    },
    {
      "label": "Google: naptármegosztás és engedélyek",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: Outlook Calendar API és támogatott postaládaadatok",
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
    "heading": "Egyesített nézet, előfizetés vagy átmásolt foglaltsági idő?",
    "columns": [
      "Amire szüksége van",
      "Mit ellenőrizzen",
      "Mit ne feltételezzen"
    ],
    "rows": [
      {
        "cells": [
          "Több fiók egy nézetben",
          "A csatlakoztatott fiókot, a kiválasztott naptárt és a szükséges csomagot.",
          "Hogy egy megosztott képernyő egyesíti a tulajdonjogot vagy az engedélyeket."
        ]
      },
      {
        "cells": [
          "Az eseménymódosítás eljut a szolgáltatóhoz",
          "Az eredeti eseményt, az írási jogosultságot és a forrásnál mentett eredményt.",
          "Hogy egy látható helyi szerkesztés bizonyítja a szolgáltatóval való sikeres szinkronizálást."
        ]
      },
      {
        "cells": [
          "Foglaltsági idő egy másik fiókban",
          "Olyan szolgáltatást, amely kifejezett forrásból célba szinkronszabályokkal rendelkezik.",
          "Hogy az egyesített nézet automatikusan foglaltsági blokkokat hoz létre a kollégáknak."
        ]
      },
      {
        "cells": [
          "Egy feliratkozott naptárhírfolyam",
          "A közzétevőt, a frissítési működést és a csak olvasható állapotot.",
          "Hogy egy ICS-előfizetés szerkeszthető, kétirányú kapcsolat."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-left",
    "hook"
  ],
  "galleryDevice": "iPad",
  "galleryCaption": "Valódi iPad naptárnézetek szemléltetik az időbeosztás áttekintését. Egy képernyőkép nem mutatja meg a szolgáltatói szinkron irányát vagy a fiókengedélyeket.",
  "actionHeading": "Tekintse át együtt a naptárait iPhone-on és iPaden",
  "actionText": "A Google Calendar szinkron a Base csomag része. Az Advanced eltávolítja a hirdetéseket; a Premium Microsoft Calendar és Teams támogatást ad. A fiók engedélyeit a vásárlási csomagtól függetlenül erősítse meg.",
  "articleLinks": [
    {
      "slug": "onecal-alternative-iphone-calendar-view-or-sync",
      "label": "Az egyesített nézet összevetése a OneCal szinkronszabályaival"
    },
    {
      "slug": "fantastical-readdle-calendar366-iphone-comparison",
      "label": "iPhone-os naptáras munkafolyamatok összehasonlítása"
    },
    {
      "slug": "weather-inside-your-calendar",
      "label": "Tervezés időjárással és eseményekkel együtt"
    }
  ]
},

  'sharing-one-event-not-your-calendar': {
  "updated": "2026-10-21",
  "title": "Egy naptáresemény megosztása: válassza ki a megfelelő linket és hozzáférést",
  "short": "Egy esemény megosztása",
  "description": "Osszon meg egy eseményt a teljes naptár helyett. Ismerje meg a Reader, Writer és Owner szerepeket, az előnézetet, a frissítést és a visszavonás korlátait.",
  "lede": "Egy vacsora adatainak elküldése, egy társszervező szerkesztési jogának megadása és a részvételi válaszok gyűjtése külön feladat. Először határozza meg az igényt, majd válasszon megosztási módot. Az útmutatót a Cloud Calendars fejlesztője, az Arte Soft készítette.",
  "commonBelief": "Minden eseménylink csak olvasható naptár-előfizetés lenne, amely azonnal frissül és választ rögzít.",
  "sections": [
    {
      "heading": "Kezdje az esemény adatainak ellenőrzésével",
      "body": [
        "Egyetlen esemény megosztása arra az eseményre vonatkozik, nem a küldő teljes naptárára. Küldés előtt ellenőrizze a címet, időzónát, helyszínt, jegyzeteket és megbeszéléslinkeket. Az egyik vendégnek hasznos adat nem feltétlenül való széles körben terjesztett linkbe.",
        "Egy vacsora megosztásához nem kell megosztania az orvosi időpontokat tartalmazó naptárát. A vacsora saját helyszíne és linkjei azonban az eseménnyel együtt továbbadódnak. Magát az eseményt ellenőrizze, ne a körülötte lévő naptár magánjellegére hagyatkozzon."
      ]
    },
    {
      "heading": "Válasszon előnézetet, e-mailes meghívót vagy QR-kódot",
      "body": [
        "A Cloud Calendars különböző megosztási útvonalakat kínál. Az App Clip előnézetet mutat; az esemény hozzáadásához ezen az útvonalon a teljes alkalmazás szükséges. Az e-mailes és QR-meghívók weboldalon ajánlják fel a Cloud Calendars megnyitását. Ezek a linkek nem felcserélhető előfizetési URL-ek.",
        "Az alkalmazás szinkronizált megosztásához a küldő bejelentkezik. A link és a QR-kód továbbküldhető, ezért csak megfelelő közönségnek küldje. A QR-kód egy linket közvetít, nem igazolja, ki nyitotta meg."
      ]
    },
    {
      "heading": "Csak a szükséges hozzáférést adja meg",
      "body": [
        "E-mailes meghívóknál Reader, Writer vagy Owner választható. A Reader megtekinthet és szinkronizálhat; a Writer szerkeszthet; az Owner megoszthat és hozzáférést is kezelhet. Ezek eltérő jogosultságok. Ha valakinek csak a programot kell látnia, válassza a Reader szerepet.",
        "Writer szerepet adjon annak a társszervezőnek, aki módosíthatja az eseményt. Owner csak annak járjon, aki mások hozzáférését is kezelheti. A magasabb jogosultságokhoz a címzettnek a megfelelő azonosítóval kell bejelentkeznie. Egy névtelen címzett nem azonosított társtulajdonos."
      ]
    },
    {
      "heading": "Értse meg, hogyan adja hozzá a címzett az eseményt",
      "body": [
        "A teljes alkalmazásban a megosztott esemény hozzáadásához naptárengedély és írható célnaptár kell. A címzett mentés előtt ellenőrizze a célhelyet. A kapott másolat ezután összekapcsolható a megosztott eseménnyel a későbbi frissítésekhez.",
        "Ez különbözik egy szokásos ICS-fájl másik naptárba importálásától. Az import másolatot készít, az előfizetés pedig rendszeresen ellenőrzi a hírcsatornát. Ha alkalmazásmeghívó helyett ICS-hírcsatornát küld, mondja el egyértelműen, és ellenőrizze a címzett naptárának támogatását."
      ]
    },
    {
      "heading": "Ellenőrizze a változásokat, mielőtt rájuk hagyatkozik",
      "body": [
        "A szinkronizált megosztás későbbi módosítást vagy lemondást is továbbíthat, de a címzett készülékének lehetőséget kell kapnia ezek fogadására. A hírcsatorna frissítési javaslata nem kézbesítési határidő. Egy offline készülék, nem frissített előfizetés vagy önálló importált másolat régi adatot mutathat.",
        "Ha a vacsora közvetlenül kezdés előtt változik, frissítse az eseményt, és keresse meg közvetlenül a vendégeket. Kérje az új időpont megerősítését. A frissítés elküldése és a részvételi válasz fogadása külön lépés."
      ]
    },
    {
      "heading": "Kezelje a hozzáférést a másolatok törlésének ígérete nélkül",
      "body": [
        "Nézze át a címzettek hozzáférését, és vonja vissza a szükségtelen jogokat. A címzett eltávolítása és a hírcsatornalink visszavonása két külön művelet. Egyik sem jelentheti a képernyőképek, üzenetek vagy minden naptármásolat távoli törlésének ígéretét.",
        "Ha a link a tervezett közönségen túl terjedt, azonosítsa az érintett linket vagy jogosultságot. A hozzáférés módosítása után ellenőrizze az érintett útvonalat. A jövőben hagyja ki a magánadatokat a szélesen terjesztett linkekből, ne utólagos visszavonástól várja visszaszerzésüket."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Ellenőrizze az adatokat, és döntse el, megtekintésre, szerkesztésre vagy részvételi válaszra van szüksége.",
    "Válassza ki a megfelelő megosztási módot, és szükség esetén jelentkezzen be.",
    "Megtekintéshez Reader szerepet adjon; Writer vagy Owner csak a megfelelő felelősséghez járjon.",
    "Kérje meg a címzettet az időpont és a célnaptár ellenőrzésére hozzáadáskor.",
    "Sürgős módosításkor frissítse az eseményt, és küldjön közvetlen üzenetet.",
    "A megosztás végén külön ellenőrizze a címzettek jogait és a linkes hozzáférést."
  ],
  "faq": [
    {
      "q": "Egy esemény megosztása láthatóvá teszi az egész naptáramat?",
      "a": "Az egyeseményes szinkronizált megosztás az adott eseményre korlátozódik. Saját részleteit azonban a választott útvonalon elérhetővé teszi. Ellenőrizze ezeket, és ne küldjön teljes naptármeghívót, ha csak egy eseményt szeretne megosztani."
    },
    {
      "q": "Módosíthatja a címzett az eseményt?",
      "a": "Igen, megfelelő Writer vagy Owner hozzáféréssel és a támogatott bejelentkezett folyamattal. A Reader megtekintésre és szinkronizálásra szolgál. A szokásos ICS-előfizetés nem ugyanez a szerkesztési mechanizmus."
    },
    {
      "q": "Valaki eltávolítása visszavon mindent, amit már megkapott?",
      "a": "Ilyen garanciát ne feltételezzen. A jogosultságváltozás a támogatott megosztási kapcsolatot érinti, de mentett másolatok, képernyőképek és üzenetek megmaradhatnak. A megosztott hírcsatorna URL-jét külön is meg kell vizsgálni."
    }
  ],
  "sourcesHeading": "Források a címzett lehetőségeihez",
  "sources": [
    {
      "label": "Apple: az App Clips áttekintése",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google: eseményimportálás és korlátai",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft: naptár importálása vagy előfizetés rá",
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
  "title": "Mit vásárol valójában egy előfizetés",
  "short": "Mit vásárol egy előfizetés",
  "description": "Mit vásárol egy előfizetés: Base, Advanced, Premium.",
  "lede": "Ezt az útmutatót a Cloud Calendars fejlesztője, az Arte Soft adja ki.",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "A Base tartalmazza a Google Calendar szinkronizálását, a Google Meet támogatását, a naptárnézeteket, az időjárást és a widgeteket. Az ingyenes csomag hirdetéseket jeleníthet meg."
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Az Advanced tartalmazza a Base funkcióit és eltávolítja a hirdetéseket. A Premium tartalmazza az Advancedet, valamint a Microsoft Calendar és a Microsoft Teams támogatását.",
        "Az előfizetés nem ad szerkesztési jogot mások naptárához, és nem kerüli meg a munkahelyi fiók korlátozásait."
      ]
    },
    {
      "heading": "Vásárlási és lemondási információk",
      "body": [
        "Vásárlás előtt ellenőrizze a helyi árat, a számlázási időszakot és a megújítás feltételeit.",
        "Apple által számlázott előfizetésnél nyissa meg a Beállítások → saját neve → Előfizetések menüt. Ellenőrizze az állapotot és a lejáratot. A megújítás lemondása különbözik az app vagy a naptáradatok törlésétől; ne feltételezze, hogy a fizetős funkciók lejárat után is elérhetők."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Vásárlás előtt ellenőrizze a helyi árat, a számlázási időszakot és a megújítás feltételeit.",
    "Az előfizetés nem ad szerkesztési jogot mások naptárához, és nem kerüli meg a munkahelyi fiók korlátozásait."
  ],
  "faq": [
    {
      "q": "Hogyan állítom le a megújítást?",
      "a": "Apple által számlázott előfizetésnél nyissa meg a Beállítások → saját neve → Előfizetések menüt. Ellenőrizze az állapotot és a lejáratot. A megújítás lemondása különbözik az app vagy a naptáradatok törlésétől; ne feltételezze, hogy a fizetős funkciók lejárat után is elérhetők."
    }
  ],
  "sourcesHeading": "Vásárlási és lemondási információk",
  "sources": [
    {
      "label": "Apple: Hogyan állítom le a megújítást?",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view"
  ]
},
};
