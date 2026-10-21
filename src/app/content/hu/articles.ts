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
  "updated": "2026-10-22",
  "title": "Naptár időjárással iPhone-on és iPaden: vizsgálja meg a terv körülményeit",
  "short": "Naptár és időjárás együtt",
  "description": "Használja együtt a naptárt és időjárást iPhone-on, iPaden. Mentés előtt ellenőrizze a helyet, az elérhető órás előrejelzést és az eseményt.",
  "lede": "A naptár megmondja, mikorra szól egy program. Az időjárás más kérdésre válaszol: milyen körülmények várhatók a szükséges helyen és időszakban? Használja együtt őket, de tartsa egyértelműen szem előtt a helyeket és dátumokat. Az útmutatót a Cloud Calendars fejlesztője, az Arte Soft adja ki.",
  "commonBelief": "A naptár mellett látható időjárás automatikusan minden találkozó címére, minden órára és minden jövőbeli dátumra vonatkozik.",
  "sections": [
    {
      "heading": "Válasszon valós tervezési kérdést",
      "body": [
        "Induljon egy konkrét programból, például délutáni parklátogatásból. Határozza meg, mi változhat: az időpont, a helyszín, a felkészülés vagy egy alternatíva választása. Nem kell az egész naptárt átszervezni pusztán azért, mert a napi jel esőt mutat.",
        "Írja fel a tevékenység tényleges kezdetét és végét, szükség esetén az előkészülettel együtt. A naptári áttekintés lehetséges dátumokat keres, az előrejelzés vizsgálata viszont konkrét helyre és időszakra vonatkozik. Az opciók összehasonlításakor különítse el a két feladatot."
      ]
    },
    {
      "heading": "Az értékek olvasása előtt ellenőrizze az időjárási helyet",
      "body": [
        "A Cloud Calendars az aktuális vagy kiválasztott hely időjárását kínálja. Ellenőrizze a megjelenített helyet, ne feltételezze, hogy az esemény címe észrevétlenül átállítja az előrejelzést. Más városban lévő találkozóhoz annak a városnak az időjárását kell összevetni.",
        "Például múzeumi érkezést tervezhet, miközben a telefon még otthon van. Összehasonlítás előtt olvassa el az előrejelzés helyét és a találkozó helyi időpontját. A képernyőn közeli értékek nem bizonyítják, hogy a program és az időjárás ugyanarra a helyre vonatkozik."
      ]
    },
    {
      "heading": "Az órás és napi lefedettséget külön ellenőrizze",
      "body": [
        "A napi adatot tájékozódásra, az elérhető órás adatokat a nap egy részére vonatkozó kérdéshez használja. A kettőtől ötig tartó programhoz egyetlen jel megtekintése nem elég. Ellenőrizze, hogy a szükséges órák ténylegesen szerepelnek-e.",
        "Az alkalmazás jelenlegi forráskódjában a napi lista legfeljebb tíz, a WeatherKit által visszaadott napot vesz át. Ez különálló a naptárban való léptetéstől és az éppen biztosított óráktól. Egy jövőbeli találkozó nem hosszabbítja meg az előrejelzést. Ha az időszak hiányzik, tervezzen későbbi időjárás-ellenőrzést."
      ]
    },
    {
      "heading": "Értse meg az időjárási érték jelentését",
      "body": [
        "Az Apple többek között hőmérséklet-, csapadék-, szél- és UV-adatokat dokumentál a WeatherKithez; bizonyos termékek csak egyes régiókban érhetők el. A választott helyhez rendelkezésre álló értékeket olvassa, ne várjon minden időjárási terméket mindenhol.",
        "A Met Office útmutatója megmutatja, miért fontos az előrejelzés időszaka és a változók meghatározása: egyes értékek pillanatra, mások időszakra vonatkoznak. Kövesse az adott szolgáltató jelöléseit. Az eső valószínűsége, mennyisége és időtartama külön kérdés; egyetlen szám nem dönt minden szabadtéri tevékenységről."
      ]
    },
    {
      "heading": "Vizsgálja meg az időjárási órából létrehozott tervezetet",
      "body": [
        "Ahol az alkalmazás lehetővé teszi esemény indítását egy órából, tervezet nyílik meg. A jelenlegi kód az időjárási hely időzónáját használja, egyórás időtartamot javasol, és az új események alapértelmezett naptárát választja. Mentés előtt ellenőrizzen minden értéket.",
        "Erősítse meg a címet, célnaptárt, kezdést, befejezést és kívánt helyszínt. Az előrejelzés kiválasztása nem ad megosztott naptári szerkesztési jogot, nem értesít helyszínt, és nem foglal termet. Ellenőrizze a mentett eseményt, és szerezze meg a szükséges megállapodásokat."
      ]
    },
    {
      "heading": "Különítse el a webhely bemutatóját",
      "body": [
        "A webhely interaktív időjárás-bemutatója Open-Meteót használ. Az alkalmazás Apple WeatherKitet használ. A webes bemutató segít megismerni a megjelenítést, de helye, adatai és elérhető dátumai eltérhetnek az alkalmazástól.",
        "Valós döntéshez nyissa meg az alkalmazást, és hasonlítsa össze a találkozót az elérhető előrejelzéssel. Megosztott terv módosításakor ellenőrizze a szervezőt, az ismétlődés hatókörét és a résztvevőket. A körülményektől függő programhoz legyen egyeztetett alternatíva."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Azonosítsa a programot és a döntést, amelyet az időjárás megváltoztathat.",
    "Erősítse meg az időjárási helyet, valamint a találkozó helyi dátumát és idejét.",
    "Az elérhető órás lefedettséget a napi összefoglalótól külön vizsgálja.",
    "A valószínűséget, mennyiséget és más értékeket a jelölések szerint olvassa.",
    "Mentés előtt ellenőrizze az eseménytervezet minden részletét és célnaptárát.",
    "A döntéskor nézze meg újra, és a közös változásokat közvetlenül egyeztesse."
  ],
  "faq": [
    {
      "q": "A naptár melletti időjárás követi minden esemény címét?",
      "a": "Ne feltételezze ezt. Ellenőrizze a megjelenített időjárási helyet, és vesse össze a helyszínnel; a képernyőn való közelség nem bizonyít egyezést."
    },
    {
      "q": "Az alkalmazás a webhely időjárás-szolgáltatóját használja?",
      "a": "Nem. Az alkalmazás Apple WeatherKitet, a webhely bemutatója külön Open-Meteót használ."
    },
    {
      "q": "Az előrejelzési óra kiválasztása automatikusan ment találkozót?",
      "a": "Ahol ez a művelet elérhető, tervezetet indít. Ellenőrizze a dátumot, időzónát, időtartamot, naptárt és helyet, majd mentse a kívánt eseményt."
    }
  ],
  "seeAlso": [
    "month-view-on-a-bigger-screen",
    "icloud-google-and-outlook-in-one-view",
    "sharing-one-event-not-your-calendar"
  ],
  "sourcesHeading": "Hivatalos források és további olvasnivalók",
  "sources": [
    {
      "label": "Apple: WeatherKit-előrejelzések és regionális elérhetőség",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: az előrejelzés helye, időszakai és időjárási értékei",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google és Outlook egyetlen nézetben',
    short: 'Három fiók, egy nézet',
    description:
      'Szinte mindenki élete megoszlik egy személyes Apple-naptár, egy Google-fiók és egy munkahelyi Exchange között. Mi változik, ha egy rácsba kerülnek.',
    lede: 'A baj szinte soha nem az, hogy valamelyik naptár rossz. Az, hogy három van, hét pedig egy.',
    commonBelief:
      'Hogy a munkát és a magánéletet külön alkalmazásban tartani határ, és nem hiányosság.',
    sections: [
      {
        heading: 'A kettős foglalás szerkezeti',
        body: [
          'Ha a kötelezettségei három helyen élnek, egyik hely sem tudja megmondani, hogy szabad-e. Az összefésülő lépés Ön, és fejből futtatja, rendszerint miközben valaki választ vár.',
          'Ezért a klasszikus hiba nem az, hogy elfelejt egy eseményt; hanem hogy igent mond valamire, ami ütközik egy eseménnyel, amit nem láthatott.',
        ],
      },
      {
        heading: 'Mit ad egyetlen rács',
        body: [
          'Minden fiók ugyanabban a hétben, eredet szerint színezve, helyben szerkeszthetően. Megszűnik a kérdés, melyik alkalmazásban van a válasz, mert a kérdés megszűnik többes számban lenni.',
          'Az iCloud és a Google az ingyenes változatban szinkronizál. A Microsoft-fiókok — Outlook és Exchange — a fizetőshöz tartoznak, mert annak a kapcsolatnak visszatérő költsége van, ami a többinek nincs.',
        ],
      },
    ],
    claims: {
      accounts: 'Fióktípusok, amelyek egy nézetbe férnek',
      premiumMonthly: 'A Microsoft hozzáadásának havi ára dollárban',
    },
    practical: [
      'Először a személyes fiókot vegye fel, aztán azt, amelyik az ütközéseket okozza.',
      'Fiók szerint színezzen, ne kategória szerint: az eredetet kell egy pillantással látni.',
      'Továbbra is abba a naptárba írjon, amelyet mások már olvasnak.',
    ],
    seeAlso: ['weather-inside-your-calendar', 'what-a-subscription-actually-buys'],
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
