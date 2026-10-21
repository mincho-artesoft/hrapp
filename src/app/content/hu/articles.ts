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
  'weather-inside-your-calendar': {
  "title": "Naptár, amelyben már benne van az időjárás",
  "short": "Az időjárás a naptárban",
  "description": "Miért tervezési hiba két alkalmazást megnézni egy nap beosztásához, és hogyan néz ki az a naptár, amelyben az előrejelzés a nézet része, nem pedig mellette áll.",
  "lede": "Szinte mindenki két alkalmazás között osztja be a napját. A naptár megmondja, hol kell lenni; az időjárás-alkalmazás megmondja, milyen idő lesz odaérve. A kettőt együtt tartani a fejben az a rész, amiről senki nem tudja, hogy csinálja — amíg el nem vész egy szombat.",
  "commonBelief": "Hogy a naptár a találkozókról szól, az időjárás-alkalmazás az időjárásról, és hogy külön tartani őket egyszerűen így működnek a telefonok.",
  "sections": [
    {
      "heading": "Két alkalmazás ára nem két koppintás",
      "body": [
        "Váltani semmibe nem kerül. Az a drága, hogy a kettő sosem ért egyet abban, mi számít. A naptár tudja, hogy szombaton tizenegytől két óra foglalt; az időjárás-alkalmazás tudja, hogy tíztől egyig esik. Egyik sem tudja, hogy e két tény együtt azt jelenti: a blokkot el kell mozdítani.",
        "Az integrációs réteg Ön. Ez addig működik, amíg nincs sok dolga — vagyis pontosan addig, amíg a tervek védelme a legtöbbet érné."
      ]
    },
    {
      "heading": "Az elérhető előrejelzés",
      "body": [
        "A Cloud Calendars a kiválasztott helyhez elérhető előrejelzést használja. Az óránkénti és napi adatok eltérő időszakokat fedhetnek le.",
        "A naptárban megtekinthető dátumok nem határozzák meg az előrejelzés hosszát. A havi nézet nem jelent az egész hónapra vagy minden eseményre szóló előrejelzést."
      ]
    }
  ],
  "claims": {
    "price": "Mennyibe kerülnek az időjárási funkciók"
  },
  "practical": [
    "Tervezés előtt ellenőrizze a helyet, a dátumot és az elérhető órákat."
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-a-subscription-actually-buys"
  ],
  "updated": "2026-10-21"
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
