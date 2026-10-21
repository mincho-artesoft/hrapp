import { LocalisedArticle } from '../types';

/** A hat Google-cikk: pontos kérdések, világos válaszok. */
export const GOOGLE_HU: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
  "title": "Google Naptár-megosztás: ellenőrizze a ténylegesen megadott jogokat",
  "short": "Hozzáférés és adatvédelem a Google Naptárban",
  "description": "Válasszon elérhetőségi, részletmegtekintési vagy szerkesztési hozzáférést. Megosztás előtt az egyéni jogok mellett a nyilvános és csoportos hozzáférést is ellenőrizze.",
  "lede": "Megosztás előtt döntse el, mire van szüksége a másik félnek. Az időpont-egyeztetés, az eseményadatok olvasása és a naptár karbantartása más feladat. Az útmutatót a Cloud Calendars fejlesztője, az Arte Soft adja ki.",
  "commonBelief": "Egy személy korlátozása garantálná, hogy más útvonalon sem láthat részleteket.",
  "sections": [
    {
      "heading": "Igazítsa a hozzáférést a feladathoz",
      "body": [
        "Az időpontot kereső kollégának elég lehet a szabad és foglalt idő, a találkozók részletei nélkül. A projekt ütemezését kezelő munkatársnak más hozzáférés kell. Előbb határozza meg a feladatot, majd nézze meg a naptár aktuális megosztási beállítását.",
        "A Google megkülönbözteti az elérhetőséget, az eseményrészleteket és több szerkesztési szintet. Az egyik szerkesztési opció korlátozza a privát események elérését; egy másik engedi a szerkesztést és a részleteket; a legerősebb a megosztást is kezeli. Nem minden változtatást említő opció egyenértékű."
      ]
    },
    {
      "heading": "Az egész naptár hozzáférését is ellenőrizze",
      "body": [
        "A megnevezett személyek mellett nézze meg, nyilvános-e a naptár, elérhető-e a szervezetnek vagy meg van-e osztva csoporttal. A Google szerint a szélesebb hozzáférés felülírhatja a szűkebbet: egy személy korlátozása nem rejti el a már nyilvános részleteket.",
        "Gondoljon egy klub tagjainak közzétett programra. Személyes időpont hozzáadása előtt ellenőrizze a naptár közönségét, ne csak az egyik barát melletti jogot tekintse relevánsnak. A magánidőpontokat megfelelő célhelyen tárolja."
      ]
    },
    {
      "heading": "A megfelelő naptár Google-beállításait használja",
      "body": [
        "Számítógépen a Google Naptárban keresse meg a kívánt naptárt, nyissa meg a menüjét, majd a megosztási beállításait. A Google külön területet ír le személyeknek vagy csoportoknak és a szélesebb hozzáférésnek. Módosítás előtt ellenőrizze a naptár nevét és a bejelentkezett fiókot.",
        "Meghíváskor egyeztesse a címzett kívánt Google-azonosítóját. Ha nem találja a naptárt, ellenőrizze az e-mail-címet és a meghívóüzenetet, ne a hozzáférés bővítésével próbálja láthatóvá tenni. A hiányzó megjelenítés és az elégtelen szerkesztési jog külön probléma."
      ]
    },
    {
      "heading": "Privát időpontok nélkül teszteljen",
      "body": [
        "Használjon olyan teszteseményt, amelynek címe, jegyzete, helye és vendéglistája nem tartalmaz magánadatot. Kérje meg a címzettet, hogy ellenőrizze, mit lát, és csak ha szükséges és engedélyezett, mit módosíthat. Ehhez ne adja át fiókja bejelentkezési adatait.",
        "Jegyezze fel a naptárt és a szerepet, majd beállításváltozás után vizsgálja meg az eredményt. Ez a szándékolt hozzáférést ellenőrzi, nem bizonyítja a korábban olvasott vagy másolt adatok eltűnését. Ne valódi munkarend közzétételével teszteljen."
      ]
    },
    {
      "heading": "Válassza külön a munkahelyi szabályokat és az alkalmazáscsomagokat",
      "body": [
        "A Google szerint a munkahelyi vagy iskolai rendszergazda korlátozhatja a megosztást. Ha egy beállítás nem érhető el, a szervezet által jóváhagyott utat használja. Ne tegyen közzé munkahelyi adatokat fiókkorlátozás megkerülésére.",
        "A Cloud Calendars megjelenítheti a kapcsolt naptárakat, de a csomagnevek nem írják át a Google jogait. Az Advanced eltávolítja a hirdetéseket; nem olyan díj, amely bárkinek minden Google-eseményhez hozzáférést ad. Ellenőrizze a szolgáltatói megosztást és az elfogadott eredményt, ne csak az elérhető helyi szerkesztőre hagyatkozzon."
      ]
    },
    {
      "heading": "Vizsgálja felül és távolítsa el a felesleges hozzáférést",
      "body": [
        "Projektzáráskor ellenőrizze a tényleges címzetteket, csoportokat és a szélesebb közzétételt. Egy személy eltávolítása csak része a feladatnak, ha más utak is léteznek. Egyezzenek meg, ki kezeli a programot és a későbbi hozzáférésváltozásokat.",
        "A Google külön dokumentálja személyek vagy csoportok eltávolítását és a szélesebb megosztás kikapcsolását. A hozzáférés megszüntetése nem hív vissza exportált fájlt, képernyőképet vagy máshová másolt információt. Ezekről külön egyeztessen az érintettekkel, ne ígérje minden korábbi másolat törlését egy kapcsolóval."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Azonosítsa a naptárt és a címzett feladatát.",
    "Ellenőrizze az egyéni, csoportos, szervezeti és nyilvános hozzáférést.",
    "Válasszon a feladathoz illő jogot a Google aktuális beállításaiban.",
    "Hozzáférésmódosítás előtt ellenőrizze a címzett azonosságát.",
    "Ellenőrizzen ártalmatlan teszteseményt a címzett oldaláról.",
    "Vizsgálja felül a régi hozzáférési utakat anélkül, hogy a másolatok visszahívását feltételezné."
  ],
  "faq": [
    {
      "q": "Az egyéni korlátozás felülírja a nyilvános naptárt?",
      "a": "Nem. A Google szerint ütközéskor a szélesebb naptárjogok élveznek elsőbbséget. Az adott személy mellett a nyilvános és szervezeti beállításokat is vizsgálja meg."
    },
    {
      "q": "Minden szerkesztési jog ugyanúgy teszi elérhetővé a privát eseményeket?",
      "a": "Nem. A Google külön szerkesztési opciót dokumentál a privát események korlátozott elérésére, más szerkesztési és megosztáskezelési opciók mellett. Választás előtt olvassa el a pontos, aktuális jogosultságot."
    },
    {
      "q": "Az Advanced megvásárlása megváltoztatja a Google megosztási jogait?",
      "a": "Nem. Az Advanced a Cloud Calendars hirdetéseit távolítja el. A szolgáltatói hozzáférés a naptár jogosultságaitól és a szervezeti korlátozásoktól függ."
    }
  ],
  "sourcesHeading": "A Google aktuális útmutatói jogosultságokhoz és megosztáshoz",
  "sources": [
    {
      "label": "Google: naptárjogosultságok kiválasztása",
      "url": "https://support.google.com/calendar/answer/15716974?hl=en"
    },
    {
      "label": "Google: naptár megosztása és hozzáférés eltávolítása",
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
    "title": "Megosztottak veled egy naptárat, és nincs sehol",
    "short": "A megosztott naptár nem jelenik meg",
    "description": "Hiányzik egy megosztott Google-naptár? Ellenőrizd a meghívott fiókot, a csoportot, a láthatóságot és a kapott link típusát.",
    "lede": "Az útmutatót a Cloud Calendars fejlesztője, az Arte Soft készítette. Először különítsd el a hiányzó hozzáférést a pusztán elrejtett naptártól.",
    "commonBelief": "Hogy egy megosztott naptár elfogadása felteszi azt a telefonodra.",
    "sections": [
      {
        "heading": "Ellenőrizd a fiókot és a csoportot",
        "body": [
          "Hasonlítsd össze a meghívó címzettjét a telefonon és a böngészőben használt Google-fiókkal. Nyisd meg a meghívó linkjét a megfelelő fiókkal. A Google személyekkel és Google-csoportokkal is enged megosztást. Csoportos hozzáférésnél kérd a csoport kezelőjét tagságod, a naptár tulajdonosát pedig a megfelelő csoport hozzáférésének ellenőrzésére. Egy továbbított e-mail önmagában nem ad jogosultságot."
        ]
      },
      {
        "heading": "Rejtett, hiányzó vagy korlátozott?",
        "body": [
          "Nyisd meg a Google Naptár menüjét iPhone-on vagy iPaden. Ha a naptár szerepel, de nincs kijelölve, jelöld ki. Ha hiányzik, a tulajdonos ellenőrizze a hozzáférést: a kérés még nem jóváhagyás. Munkahelyi vagy iskolai szabályok korlátozhatják a megosztást. Nézd meg ugyanazt a fiókot a webes Google Naptárban. Ha ott működik, a másik alkalmazásban ellenőrizd a csatlakoztatott fiókot és a kiválasztott naptárakat. Az olvasási jog nem enged szerkesztést."
        ]
      },
      {
        "heading": "Azonosítsd a linket",
        "body": [
          "A megosztási meghívó is tartalmaz linket; nem minden link ICS-feliratkozás. Kérdezd meg, Google-naptárhoz ad-e hozzáférést, vagy csak olvasható hírcsatornát tesz közzé. A Google szerint új naptárfeliratkozáshoz számítógépes böngésző kell; az e-mailben már megosztott naptár megnyitása más művelet. A hírcsatorna frissülése a fogadó szolgáltatástól függ. Nincs általános várakozási idő; a sürgős változásokat egyeztesd a szervezővel."
        ]
      }
    ],
    "claims": {},
    "faq": [
      {
        "q": "Kaphat hozzáférést egy Google-csoport?",
        "a": "Igen. Ellenőrizd a kiválasztott csoportot, tagságodat és a szervezeti korlátozásokat. Egy továbbított csoportlevél nem igazolja a hozzáférést."
      },
      {
        "q": "Töröljem és csatlakoztassam újra a fiókot?",
        "a": "Előbb ellenőrizd a fiókot, a jogokat és a láthatóságot, majd a webes naptárt. Az újracsatlakozás nem ad hiányzó jogokat."
      }
    ],
    "practical": [
      "Ellenőrizd a meghívott fiókot és csoporttagságodat.",
      "Jelöld ki a listán szereplő, de rejtett naptárt.",
      "A kapcsolatok módosítása előtt ellenőriztesd a hozzáférést."
    ],
    "sourcesHeading": "Források és további információk",
    "sources": [
      {
        "label": "Google: Ellenőrizd a fiókot és a csoportot",
        "url": "https://support.google.com/calendar/answer/37082?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Rejtett, hiányzó vagy korlátozott?",
        "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Azonosítsd a linket",
        "url": "https://support.google.com/calendar/answer/37648?hl=en"
      }
    ],
    "seeAlso": [
      "who-can-see-what-in-google-calendar",
      "google-calendars-that-never-reach-your-iphone"
    ]
  },

  'the-secret-address-of-a-google-calendar': {
    title: 'Mit ad ki valójában egy Google-naptár titkos címe',
    short: 'A titkos iCal-cím',
    description:
      'A Google kínál egy privát címet, amely a teljes naptáradat megmutatja annak, akinél van. Mit tár fel, és miért nem lehet csendben visszavenni.',
    lede: 'Minden Google-naptár beállításai közt ott lapul egy link, amely mindent megmutat, ami rajta van. Bejelentkezés nélkül, engedély nélkül, anélkül hogy nyoma maradna, ki nyitotta meg.',
    commonBelief: 'Hogy egy privát cím attól privát, hogy nehéz megtalálni.',
    sections: [
      {
        heading: 'A link olyan jelszó, amelyet nem lehet egyvalakinek megváltoztatni',
        body: [
          'A titkos cím teljes részleteket visz — címeket, időpontokat, helyszíneket, jegyzeteket. Látja mindenki, akinél a link van, és nincs lista arról, kik ők.',
          'Egyetlen védelme a cím véletlenszerű része. A találgatás ellen ez valódi védelem, a továbbküldés, a megosztott képernyő vagy a munkahelyet túlélő dokumentum ellen semmilyen.',
        ],
      },
      {
        heading: 'A visszaállítás mindenkinek elrontja',
        body: [
          'A címet vissza lehet állítani, és a régi meghal. Meghal minden kollégának, minden műszerfalnak és minden szkriptnek is, amelyik csendben rá támaszkodott — figyelmeztetés nélkül.',
          'Ez az érv amellett, hogy soha ne oszd ki annak a naptárnak a címét, amelyikben élsz. Tegyél közzé egy erre a célra készült naptárat, és a visszaállítás semmibe sem kerül.',
        ],
      },
    ],
    claims: {
      linkLength: 'Véletlen karakterek, amelyek a mi megosztási linkünket védik',
      sharePrice: 'Mennyibe kerül egy esemény megosztása az alkalmazásból',
    },
    faq: [
      {
        q: 'Mit kezdhet valaki a naptáram titkos címével?',
        a: 'Mindent láthat rajta — címeket, időpontokat, helyszíneket és jegyzeteket — bejelentkezés nélkül, engedély nélkül, és anélkül hogy bárhol nyoma maradna, hogy megnézte.',
      },
      {
        q: 'Visszavehetem a naptár titkos címét?',
        a: 'Csak úgy, hogy visszaállítod, ami egyszerre öli meg a régit mindenkinél: kollégáknál, műszerfalakon és minden szkriptnél, amely csendben rá támaszkodott, figyelmeztetés nélkül.',
      },
      {
        q: 'Elküldhetem a titkos címet e-mailben egy kollégának?',
        a: 'Tekintsd nyilvánosnak abban a pillanatban, ahogy kikerül a kezedből. Egyetlen védelme, hogy nehéz kitalálni, és a továbbküldés pontosan ezt szünteti meg.',
      },
    ],
    practical: [
      'Kezeld nyilvánosként a titkos címet abban a pillanatban, ahogy kikerül a kezedből.',
      'Soha ne tedd közzé annak a naptárnak a címét, amelyiket valóban használod.',
      'Állítsd vissza, ha valaki távozik, és szólj azoknak, akiknél ettől elromlik.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'taking-back-a-calendar-you-shared'],
  },

  'what-guests-can-do-to-your-event': {
    title: 'Mit tehetnek a vendégeid egy eseményeddel',
    short: 'Vendégjogosultságok',
    description:
      'Három jelölőnégyzet dönti el, hogy egy vendég átteheti-e a megbeszélésedet, meghívhat-e idegeneket, vagy elolvashatja-e a teljes listát. Gyakrabban vannak bekapcsolva, mint gondolnád.',
    lede: 'Meghívni valakit többet ad helynél és időpontnál. Egy szokásos Google-eseményben a vendég általában látja, kit hívtál még, és gyakran hozzá is adhat másokat.',
    commonBelief: 'Hogy egy vendég csak elfogadni vagy elutasítani tud.',
    sections: [
      {
        heading: 'A három négyzet',
        body: [
          'Az esemény módosítása engedi, hogy a vendég mindenkinek megváltoztassa az időpontot, a helyet és a címet. Ritkán szeretnénk, könnyen bekapcsolva marad.',
          'A mások meghívása engedi, hogy olyanokat adjon hozzá, akikkel soha nem találkoztál. A vendéglista megtekintése megmutatja az összes meghívottat és a válaszukat — csapatban rendben van, ügyfélnél kínos, bármiben, ami különálló ügyfelek csoportjára hasonlít, hibás.',
        ],
      },
      {
        heading: 'Hol romlik el ez csendben',
        body: [
          'Egy esemény, sok külön címzett, látható lista: most mindenkinél ott van mindenki. Ez az egy négyzet a különbség egy megbeszélés és egy kiszivárgott címjegyzék között.',
          'A beállítások az eseményben laknak, nem a fiókban, így minden alkalommal visszaállnak az alapértelmezésre, és a fontos eseményeknél kell átgondolni őket, nem egyszer s mindenkorra.',
        ],
      },
    ],
    claims: {
      sharePrice: 'Mennyibe kerül egyetlen esemény küldése az alkalmazásból',
    },
    faq: [
      {
        q: 'Látják egymást a vendégek egy Google Naptár meghívóban?',
        a: 'Alapból többnyire igen. A „vendéglista megtekintése” megmutatja az összes meghívottat és a válaszukat: csapaton belül rendben, ügyféllel kínos, különálló ügyfeleknél pedig egyszerűen hibás.',
      },
      {
        q: 'Megváltoztathatja egy vendég a megbeszélésem időpontját?',
        a: 'Ha az „esemény módosítása” be van jelölve, igen, és a változás mindenkire vonatkozik. Ritkán akarjuk, és könnyen bekapcsolva marad.',
      },
      {
        q: 'Hogyan akadályozom meg, hogy a vendégek másokat hívjanak meg?',
        a: 'Kapcsold ki a „mások meghívása” jogot magán az eseményen. Ezek a beállítások az eseményhez tartoznak, nem a fiókhoz, így minden alkalommal visszaállnak az alapértelmezésre.',
      },
    ],
    practical: [
      'Kapcsold ki a „vendéglista megtekintése” jogot mindennél, ami egymást nem ismerő embereknek megy.',
      'Hagyd kikapcsolva az „esemény módosítása” jogot, hacsak valaki tényleg helyetted nem szervez.',
      'A négyzeteket az eseményen nézd, ne a beállításokban: ott laknak.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'why-a-shared-calendar-does-not-appear'],
  },

  'google-calendars-that-never-reach-your-iphone': {
    title: 'Miért nem jut el néhány Google-naptár soha az iPhone-odra',
    short: 'Hiányzó Google-naptárak iPhone-on',
    description:
      'Egy Google-fiók, több naptár, és csak egy a telefonon. A szinkronizálási lista, amely ezt eldönti, és hogy mit érdemes tenni helyette.',
    lede: 'A Google-fiókod nyolc naptárat tart. Az iPhone-od kettőt mutat. Semmi nem romlott el: valami, amit soha nem láttál, döntött helyetted.',
    commonBelief: 'Hogy egy Google-fiók hozzáadása az iPhone-hoz hozzáadja a benne lévő naptárakat is.',
    sections: [
      {
        heading: 'Egy lista, amelyet soha nem mutattak meg',
        body: [
          'A Google eszközönként vezet listát arról, mely naptárak szinkronizálhatnak, és a másodlagos naptárak — a megosztottak, az előfizetettek, a projektre létrehozottak — gyakran kívül esnek rajta.',
          'Ez a lista nincs az iOS beállításaiban. Külön Google-oldalon él, és ezért nem talál semmi hibát az, aki a kézenfekvő helyen keres, és semmi sem változik.',
        ],
      },
      {
        heading: 'A másik út',
        body: [
          'Az az alkalmazás, amely közvetlenül a Google-lel beszél, nem használja ezt a listát: minden naptárat megmutat, ami a fiókban valóban ott van, azokat is, amelyeket a telefon csendben elejtett.',
          'Ez össze is hozza a fiókokat. Egy nézet, amely a magánt, a munkát és a megosztottat tartja, épp ez a lényeg; hogy a telefon mindegyiket szinkronizálta volna-e, megszűnik kérdés lenni.',
        ],
      },
    ],
    claims: {
      accounts: 'Fióktípusok, amelyeket egyetlen nézet összefog',
      price: 'Mennyibe kerül a Google-oldal',
    },
    faq: [
      {
        q: 'Miért csak néhány Google-naptáram jelenik meg az iPhone-on?',
        a: 'A Google eszközönként vezet listát arról, mely naptárak szinkronizálhatnak, és a másodlagosak — a megosztottak, az előfizetettek, a projektre létrehozottak — gyakran kimaradnak belőle.',
      },
      {
        q: 'Hol van a Google Naptár szinkronizálási beállítása iPhone-on?',
        a: 'Nem az iOS beállításaiban. Külön Google-oldalon él, és ezért a kézenfekvő helyen keresve semmi hibát nem találsz, és semmi nem változik.',
      },
      {
        q: 'Hogyan látom az összes Google-naptáramat az iPhone-on?',
        a: 'Olyan alkalmazáson át, amely közvetlenül a Google-t kérdezi, nem az eszköz listáján keresztül. Az minden naptárat megmutat, ami a fiókban tényleg ott van, azokat is, amelyeket a telefon elejtett.',
      },
    ],
    practical: [
      'Nézd meg a Google szinkronizálási listáját, mielőtt elromlottnak hinnéd a fiókot.',
      'Számíts rá, hogy az előfizetett és megosztott naptárak ki vannak zárva, nem bent vannak.',
      'Ha kettőnél több naptárat tartasz, olvasd őket olyasmivel, ami közvetlenül kérdezi a Google-t.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'icloud-google-and-outlook-in-one-view'],
  },

  'taking-back-a-calendar-you-shared': {
  "title": "Naptármegosztás megszüntetése: ellenőrizze az összes hozzáférési utat",
  "short": "Megosztott hozzáférés ellenőrzése és törlése",
  "description": "Külön kezelje a személyeket, csoportokat, nyilvános elérést és hírcsatornalinkeket. Ellenőrizze a változást: a mentett másolatok megmaradhatnak.",
  "lede": "Egy együttműködés lezárásakor először azonosítsa, hogyan adtak hozzáférést. Egy személy eltávolítása, a közzététel leállítása és a hírcsatorna címének visszaállítása más művelet. Az útmutatót a Cloud Calendars fejlesztője, az Arte Soft adja ki.",
  "commonBelief": "Egy címzett eltávolítása azonnal visszahívna minden naptármásolatot és lezárna minden más hozzáférési utat.",
  "sections": [
    {
      "heading": "Azonosítsa a naptárt és a megosztás módját",
      "body": [
        "Módosítás előtt ellenőrizze a tulajdonos fiókját, a naptárt és a célközönséget. Egy név szerint meghívott kollégával megosztott Google-naptár más kapcsolat, mint a nyilvános naptár, csoportjog vagy előfizetési cím. A Cloud Calendars saját esemény- és naptármegosztási kapcsolatokat is használ.",
        "Például egy klub titkára személyes meghívással kaphat szerkesztési jogot, miközben a tagok közzétett programot követnek. A titkár jogának törlése nem határozza meg, mi történjen a tagok előfizetéseivel. Írja össze a ténylegesen kialakított hozzáféréseket."
      ]
    },
    {
      "heading": "A megfelelő Google-jogosultságot távolítsa el",
      "body": [
        "A Google külön szabályozza a személyek vagy csoportok, a teljes szervezet és a nyilvánosság hozzáférését. Számítógépen nyissa meg a megfelelő naptár megosztási beállításait, és módosítsa az érintett bejegyzést vagy szélesebb beállítást. Előbb ellenőrizze a bejelentkezett fiókot és a naptár nevét.",
        "Az illetőnek csoporton vagy szélesebb közzétételen át továbbra is lehet hozzáférése. Az egész rendszert tekintse át, ne ugyanazt az e-mail-címet törölje újra. Munkahelyi vagy iskolai szabályok korlátozhatják a lehetőségeket; szükség esetén kövesse a tulajdonos vagy rendszergazda jóváhagyott eljárását."
      ]
    },
    {
      "heading": "A titkos naptárcímet külön kezelje",
      "body": [
        "A Google szerint a titkos iCal-cím saját használatra való egy másik naptáralkalmazásban, és nem adható át másoknak. Ha nyilvánosságra került, a Google leírja visszaállítását, amely érvényteleníti a régi címet. Ez nem ugyanaz, mint egy megnevezett személy eltávolítása.",
        "Saját előfizetési cím módosítása előtt keresse meg az arra támaszkodó alkalmazásokat és eszközöket, hogy utána a szükségeseket újra csatlakoztathassa. Ne tegye a titkos URL-t nyilvános támogatási bejegyzésbe, és ne küldje el bizonyítékként a naptár azonosítására. Inkább nevet és kapcsolattípust adjon meg."
      ]
    },
    {
      "heading": "Különböztesse meg a címzetteket a hírcsatornalinkektől",
      "body": [
        "A Cloud Calendars esemény- vagy naptárcímzettjeinek hozzáférése és a kiadott előfizetési hírcsatorna külön mechanizmus. Művelet előtt vizsgálja meg a tényleges megosztási kapcsolatot és linket. Egy azonosított címzett eltávolítása nem garantálja minden korábban kiosztott URL vagy önálló másolat visszahívását.",
        "Ha egy társszervezőnek csak a szerkesztést kell abbahagynia, a szerepet és a többi felhasználót vizsgálja, ne törölje a közös programot. Ha az egész együttműködés véget ér, tisztázza a tulajdonost és azt, ki őrizze meg a naptárt. Kapott naptár elhagyása és saját naptár törlése más döntés."
      ]
    },
    {
      "heading": "Az eredményt ellenőrizze, ne ígérjen azonnali eltűnést",
      "body": [
        "Ellenőrizze, hogy a tulajdonos rendszerében mentődött-e a változás. Ha jogosult kolléga segíthet, saját fiókjából ellenőrizze a megtekintést vagy szerkesztést, jelszómegosztás nélkül. Különböztesse meg a megtagadott hozzáférést a gyorsítótárazott vagy importált másolatban látható régi eseménytől.",
        "Ne ígérjen egységes frissítési időt vagy értesítésmentességet. Átadáskor mondja el, melyik programot kell ezután használni. Egy régi látható bejegyzés önmagában nem árulja el, maradt-e élő hozzáférés, másik jogosultság vagy önálló másolat."
      ]
    },
    {
      "heading": "A korábbi másolatokat külön kövesse nyomon",
      "body": [
        "Exportált fájlok, képernyőképek, üzenetek és külön mentett időpontok a változás után is megmaradhatnak. Döntse el, melyek fontosak az átadáshoz, és egyeztessen róluk az érintettekkel. Naptárjog módosításából nem állapítható meg, ki mit mentett korábban.",
        "Az ellenőrzés alatt őrizze meg a szükséges forrásadatokat. Ne mozgasson érzékeny találkozókat másik megosztott naptárba csak azért, hogy a régi üresnek látszódjon, és ne töröljön valódi meghívókat hozzáférési tesztként. Jegyezze fel a naptárt, útvonalat és változást a későbbi hibakereséshez."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Azonosítsa a tulajdonos fiókját, a naptárt és a megosztás módját.",
    "Külön ellenőrizze a személyeket, csoportokat és szélesebb közzétételt.",
    "Használja a megfelelő Google- vagy Cloud Calendars-megosztási beállítást.",
    "Külön döntsön a kiszivárgott titkos hírcsatornacím visszaállításáról.",
    "Bejelentkezési adatok megosztása nélkül ellenőrizze a mentett hozzáférést.",
    "A korábbi exportokat és másolatokat az élő hozzáféréstől külön kezelje."
  ],
  "faq": [
    {
      "q": "Egy személy eltávolítása kikapcsolja a nyilvános vagy csoportos hozzáférését is?",
      "a": "Ne feltételezze. Minden tényleges utat vizsgáljon meg. A Google a címzetteket, csoportokat és szélesebb közzétételt külön beállításként dokumentálja."
    },
    {
      "q": "A naptár azonnal és értesítés nélkül eltűnik?",
      "a": "Nincs általános garancia az eltűnésre, értesítésre vagy frissítési időre. Ellenőrizze a mentett módosítást, és válassza külön az élő hozzáférést a gyorsítótárazott vagy importált adatoktól."
    },
    {
      "q": "Az Advanced megvásárlása ad jogot Google-naptárhozzáférés eltávolítására?",
      "a": "Az Advanced a Cloud Calendars hirdetéseit távolítja el. A Google megosztási lehetőségei a tulajdonjogtól, jogosultságoktól és szervezeti szabályoktól függenek, nem az alkalmazáscsomagtól."
    }
  ],
  "sourcesHeading": "Szolgáltatói útmutató hozzáféréshez és előfizetéshez",
  "sources": [
    {
      "label": "Google: megosztási beállítások és hozzáférés megszüntetése",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Google: fiókszinkronizálás és titkos iCal-címek",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "the-secret-address-of-a-google-calendar",
    "why-a-shared-calendar-does-not-appear"
  ],
  "updated": "2026-10-21"
},
};
