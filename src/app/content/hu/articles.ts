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
    title: 'Egy esemény megosztása, nem a naptáré',
    short: 'Egy esemény megosztása',
    description:
      'Hogyan működik egyetlen esemény elküldése, mit kap valójában a másik fél, és miért nem kell semmit telepítenie ahhoz, hogy lássa.',
    lede: 'A naptármegosztás rendszerint mindent vagy semmit jelent: vagy hozzáfér valaki az Önéhez, vagy nem. Egy vacsora elküldése egyiket sem kellene, hogy megkövetelje.',
    commonBelief:
      'Hogy egy esemény megosztása azt jelenti, ablakot ad valakinek a hete többi részére.',
    sections: [
      {
        heading: 'Mi megy el valójában',
        body: [
          'Esemény létrehozásakor az alkalmazás felajánlja a megosztást. Egy hivatkozás utazik — e-mailben, üzenetben, azon, ami a másiknál van —, és e hivatkozás mögött egy naptárcsatorna áll, amely ezt az egy eseményt tartalmazza és semmi mást.',
          'Nem képernyőkép és nem elavuló másolat. Ha az időpont változik, a csatorna vele változik, és akinek elküldte, látja a változást anélkül, hogy bármit újraküldene.',
        ],
      },
      {
        heading: 'Mi nem ez',
        body: [
          'A hivatkozás közönséges naptárfeliratkozás: olvassa az Apple Naptár, olvassa a Google Naptár, olvassa az Outlook. Az üzenetben App Clip is van annak, aki mégis akarja az alkalmazást — telepítés nélkül nyílik. Ez ajtó, nem sorompó.',
          'Nem azonnali: a csatorna óránként kéri az alkalmazásokat, hogy nézzenek rá újra, és ez kérés, nem szabály. Nem is titkos: a hivatkozás huszonkét véletlen karaktert visz, amit senki nem talál ki, de aki megkapta, olvashatja. És egyelőre csak olvasható.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Órák a csatorna frissítési kérései között',
      linkLength: 'Véletlen karakterek a hivatkozásban — ez teszi kitalálhatatlanná',
      sharePrice: 'Mennyibe kerül a megosztás',
    },
    practical: [
      'Magából az eseményből osszon meg, közvetlenül a létrehozás után.',
      'Azon a csatornán küldje a hivatkozást, amelyet az illetővel amúgy is használ.',
      'Ha az időpont az utolsó pillanatban változik, írjon is, ne csak mozgassa az eseményt.',
      'Vonja vissza a hivatkozást, ha az esemény elmúlt, ahogy egy dokumentum megosztását is abbahagyná.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'weather-inside-your-calendar'],
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
