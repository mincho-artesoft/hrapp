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
  "title": "A Google titkos iCal-címe: az előfizetés nem ugyanaz, mint a megosztás",
  "short": "A titkos iCal-cím",
  "description": "Ismerje meg a Google titkos iCal-címét, a fiókkapcsolatot és a hírcsatornát. Kiszivárgáskor ne ígérjen azonnali frissítést vagy másolattörlést.",
  "lede": "A naptárcím, a fiókkapcsolat és a meghívó más feladatot lát el. Azonosítsa, melyiket használja, mielőtt másik alkalmazásba viszi a programot. Az útmutatót a Cloud Calendars fejlesztője, az Arte Soft adja ki.",
  "commonBelief": "A titkos naptárcím személyes meghívó lenne, amely egyetlen címzettől is visszavonható.",
  "sections": [
    {
      "heading": "Válasszon a feladatnak megfelelő kapcsolatot",
      "body": [
        "A Google megkülönbözteti a másik naptáralkalmazásba történő bejelentkezést a titkos iCal-címen át történő megtekintéstől. A fiókkapcsolat szerkesztést is támogathat; a cím csak olvasható előfizetést ad. A Google saját használatra szánja a titkos címet, és nem javasolja továbbadását.",
        "Saját munkarend megjelenítése egy kompatibilis naptárban más, mint tartós hozzáférést adni egy kollégának. Döntse el, saját programot nézne, egy megnevezett személlyel dolgozna együtt, vagy közönségnek közölne időrendet. Ne csak a könnyű beillesztés miatt válasszon URL-t."
      ]
    },
    {
      "heading": "A megfelelő naptárt keresse, ne csak a fiókot",
      "body": [
        "Számítógépen a Google útmutatója a kiválasztott naptár integrációs beállításainál jelöli a titkos iCal-formátumú címet. Először ellenőrizze a naptár nevét. Munkahelyi vagy iskolai rendszergazda korlátozhatja az opciót; hiánya nem indok a naptár nyilvánossá tételére.",
        "Ne szerepeljen a cím képernyőképen, nyilvános támogatási bejegyzésben vagy megosztott jegyzetben. Segítségkéréskor fióktípust, naptárnevet és kapcsolódási módot írjon, URL nélkül. Általában a kapcsolatot kell előbb azonosítani, nem az események tartalmát átadni."
      ]
    },
    {
      "heading": "Ellenőrizze, mit adott hozzá a fogadó alkalmazás",
      "body": [
        "Az előfizetés hírcsatornát követ; az importált fájl önálló másolatot hoz létre. Olvassa el a fogadó alkalmazás útmutatóját, és tisztázza a végzett műveletet. Letöltött naptárfájl megnyitása nem jelenti, hogy az időpontok követik a későbbi változásokat.",
        "Egy ismert, nem érzékeny eseményen hasonlítsa össze a naptár nevét, a dátumot és a részleteket. Ne hozzon létre második előfizetést az első hibakeresésére: két másolat ütközésnek mutathat egy késést. A forrás azonosításához ideiglenesen rejtse el az egyik naptárt."
      ]
    },
    {
      "heading": "Különböztesse meg a Google és a Cloud Calendars linkjeit",
      "body": [
        "A Cloud Calendars saját esemény- és naptármegosztási folyamatokkal rendelkezik, köztük előfizetési hírcsatornákkal. Ezek nem Google-féle titkos címek. Megnyitás előtt állapítsa meg, egy eseményt, naptárt vagy fiókhoz kötött meghívót küldtek-e.",
        "A Cloud Calendars címzettje Reader, Writer vagy Owner szerepet kaphat. Egy hírcsatornacím önmagában nem bizonyít szerkesztési jogot. Google megtekintési cím fogadása sem teszi a naptár tulajdonosává. Kérdezze meg a küldőt, melyik rendszerben kell változtatni."
      ]
    },
    {
      "heading": "Számoljon a fogadó naptár frissítésével",
      "body": [
        "Az előfizetés nem ígéret azonnali kézbesítésre. A Cloud Calendars hírcsatornái javasolt frissítési időközt tartalmaznak, de a fogadó alkalmazás dönti el, mikor tölti le és jeleníti meg a változásokat. Egy eszközön látható régi időpont nem bizonyítja, hogy a szervező nem mentett.",
        "Aznap esedékes találkozónál hasonlítsa össze a szervező aktuális programját, és a fontos módosítást közvetlenül erősítse meg. Jegyezze fel, melyik naptár mutat régi adatot és mikor ellenőrizte. Ne importáljon ismételten és ne törölje a forrásnaptárt a frissítés kikényszerítésére."
      ]
    },
    {
      "heading": "Kiszivárgáskor ne ígérjen minden másolatot visszahívó megoldást",
      "body": [
        "A Google leírja a kiszivárgott titkos cím visszaállítását: a régi érvénytelen lesz, és új készül. Azonosítsa saját alkalmazásait, amelyek használják, hogy utána átállíthassa előfizetéseiket. Ez más művelet, mint megnevezett közreműködő eltávolítása.",
        "Korábban mentett időpontok, exportok és képernyőképek külön kérdést jelentenek. Egy módosult link nem bizonyítja minden régi másolat eltűnését. Téves közönséghez került információnál a tényleges tartalmat és címzetteket mérlegelje, ne tekintse a sikeres visszaállítást teljes eltávolításnak."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Azonosítsa a fiókkapcsolatot, meghívót, előfizetést vagy fájlt.",
    "Cím másolása előtt ellenőrizze a forrásnaptárt.",
    "A Google titkos címét saját kompatibilis alkalmazásaiban használja.",
    "Ellenőrizze, hogy a fogadó alkalmazás előfizetett, nem importált.",
    "Sürgős változást a szervezővel erősítsen meg, ne a frissítésre hagyatkozzon.",
    "Kiszivárgáskor kövesse a Google visszaállítási útmutatóját, és frissítse a kívánt kapcsolatokat."
  ],
  "faq": [
    {
      "q": "Odaadhatom a titkos címet egy kollégának?",
      "a": "A Google saját alkalmazásokhoz javasolja megtartani. Ha másnak kell hozzáférés, a naptár megosztási beállításaiban válassza ki a szükséges jogosultságot."
    },
    {
      "q": "Az előfizetés engedi az eredeti szerkesztését?",
      "a": "A Google titkos iCal-címe megtekintésre szolgál. Szerkesztéshez megfelelő fiókkapcsolat és engedély kell; a Cloud Calendars megosztási szerepei külön rendszert alkotnak."
    },
    {
      "q": "A cím visszaállítása mindenhol törli a régi időpontokat?",
      "a": "A régi Google-címet érvényteleníti. Nem bizonyítja az önállóan mentett fájlok, időpontok vagy képernyőképek törlését."
    }
  ],
  "sourcesHeading": "Szolgáltatói útmutatók és további információ",
  "sources": [
    {
      "label": "Google: fiókkapcsolatok és titkos iCal-címek",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    },
    {
      "label": "Google: naptár megosztása",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: importálás, előfizetés és frissítési idő",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "taking-back-a-calendar-you-shared",
    "sharing-one-event-not-your-calendar"
  ],
  "updated": "2026-10-21"
},

  'what-guests-can-do-to-your-event': {
  "title": "Google Naptár vendégjogok: szerkesztés, meghívás és vendéglista",
  "short": "Eseményvendégek jogosultságai",
  "description": "Ellenőrizze a Google vendégjogait és alapértékeit. Különítse el a meghívás jogait a naptárhozzáféréstől és a Cloud Calendars szerepeitől.",
  "lede": "A válaszadás lehetősége nem mondja el, mit tehet még a vendég. Ellenőrizze a jogokat, mielőtt egy meghívót használ csapathoz, ügyfelekhez vagy nyilvános eseményhez. Az útmutatót a Cloud Calendars fejlesztője, az Arte Soft adja ki.",
  "commonBelief": "A meghívottak csak elfogadhatnak vagy elutasíthatnak, és minden alkalmazás ugyanazokat a jogbeállításokat mutatja.",
  "sections": [
    {
      "heading": "Kezdje a szervezővel és az eredeti eseménnyel",
      "body": [
        "Nyissa meg az eseményt a Google Naptárban a szervező vagy jogosult kezelő fiókjával. Módosítás előtt ellenőrizze a naptárt, dátumot és szervezőt. Egy külön importált időpont nem megbízható hely az eredeti meghívó kezelésére.",
        "Csapattalálkozónál írja le, ki változtathat időpontot, hívhat másokat, és láthatják-e egymást a résztvevők. Ezek külön döntések. A részvételhez nem feltétlenül kell kezelési jog."
      ]
    },
    {
      "heading": "Döntse el, módosíthatnak-e a vendégek",
      "body": [
        "A Google számítógépes eseményszerkesztője a vendégek jogai között eseménymódosítást is kínál. Ez széles együttműködési engedély, nem pusztán új időpont javaslata. A Google szerint mezőszerkesztést, vendégmegtekintést és teremfoglalást is lehetővé tesz.",
        "Megbízható műhelyszervező társának kellhet ez a rugalmasság, egy időpontra érkező ügyfélnek nem feltétlenül. A felelősség szerint válasszon, és a mentett eseményt ellenőrizze, ne egy másik találkozó beállítására hagyatkozzon."
      ]
    },
    {
      "heading": "Külön ellenőrizze a meghívást és a vendégek láthatóságát",
      "body": [
        "A Google megkülönbözteti mások meghívását és más vendégek megtekintését. Mindkettőt vizsgálja a szerkesztési jog mellett. Egy lehetőség kikapcsolása nem jelenti a másik ellenőrzését; a kijelzett alapérték nem bizonyítja meglévő esemény beállításait.",
        "Egymástól független ügyfeleknél mérlegelje, megfelelő-e közös meghívó. Az e-mailben, leírásban vagy továbbított üzenetben szereplő adat kívül esik az aktuális vendéglista-beállításon. Ne írjon bizalmas résztvevőadatot a leírásba azt várva, hogy a rejtett lista elrejti."
      ]
    },
    {
      "heading": "Az alapértékeket és a fontos eseményeket is vizsgálja",
      "body": [
        "A Google az eseménybeállításokban alapértelmezett vendégjogokat is dokumentál, köztük módosítási alapértéket. Nem minden szabály eseményenkénti. Tervezési szokás változásakor ellenőrizze az alapértékeket, majd külön a fontos meglévő meghívókat.",
        "Ismétlődő találkozónál mentés előtt tisztázza, egy alkalmat vagy sorozatot szerkeszt-e. Ne feltételezze, hogy egy preferencia átírta a korábbi meghívókat. Kollégával egyeztetett, nem érzékeny példán teszteljen, ne valódi ügyféltalálkozó áthelyezésével vagy lemondásával."
      ]
    },
    {
      "heading": "A Cloud Calendars szerepeit kezelje külön",
      "body": [
        "A Cloud Calendars külön Reader, Writer és Owner szerepeket használ. Reader megtekintést és szinkronizálást ad; Writer szerkeszthet; Owner a megosztást és hozzáférést is kezeli a meghívott identitással. Ezek nem a Google három vendégjogának kapcsolói.",
        "Google-specifikus jognál ellenőrizze az eredetit a Google Naptárban. Egy résztvevő Cloud Calendars-beli megjelenése nem bizonyítja, hogy minden Google-jog ott módosítható. Hiányzó vezérlő vagy sikertelen szerkesztés esetén tartsa egyértelműen számon a szolgáltatót és címzettet."
      ]
    },
    {
      "heading": "Ellenőrizze a mentést és tisztázza a felelősséget",
      "body": [
        "Mentés után nyissa meg újra az eredeti eseményt, és ellenőrizze a beállításokat. Szükség esetén jogosult kolléga saját fiókjában igazolja, mit tehet. Ne cseréljenek jelszavakat vagy privát vendégadatokat gyors ellenőrzésként.",
        "A részvételt válassza külön a jogoktól. Szerkeszthetőség, importált másolat és rögzített elfogadás más tény. A Cloud Calendars megosztási átvételi nyugtája nem RSVP. Fontos találkozónál kérjen részvételi választ, és tisztázza, ki felel az időrend módosításáért."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Azonosítsa a szervező fiókját és az eredeti eseményt.",
    "Döntse el, ki kezelhet, hívhat másokat és láthat vendégeket.",
    "Vizsgálja meg a Google-esemény tényleges vendégjogait.",
    "Ellenőrizze az alapértékeket a régi események átírásának feltételezése nélkül.",
    "A Cloud Calendars szerepeit tekintse külön jogosultsági rendszernek.",
    "Nyissa meg a mentett eseményt, és külön erősítse meg a részvételt."
  ],
  "faq": [
    {
      "q": "Megváltoztathatja egy vendég a találkozó időpontját?",
      "a": "A Google enged módosítási jogot adni. Ellenőrizze az eseményt és a vendég hozzáférését; ne csak a meghívó kézhezvételéből következtessen."
    },
    {
      "q": "Minden vendégjog kizárólag az egyes eseményeken állítható?",
      "a": "Nem. A Google alapértelmezett vendégjogokat is dokumentál. Ezeket a jövőbeli tervezéshez, a fontos meglévő eseményeket pedig külön ellenőrizze."
    },
    {
      "q": "A vendéglista elrejtése eltávolítja a már elküldött adatokat?",
      "a": "Nem bizonyítja korábbi e-mailek, leírások, képernyőképek vagy önálló másolatok törlését. Külön vizsgálja meg, mi került ténylegesen továbbításra."
    }
  ],
  "sourcesHeading": "Szolgáltatói útmutatók és további információ",
  "sources": [
    {
      "label": "Google: esemény-együttműködés és alapértelmezett vendégjogok",
      "url": "https://support.google.com/a/users/answer/13293412?hl=en"
    },
    {
      "label": "Google: események vendégjogosultsági mezői",
      "url": "https://developers.google.com/workspace/calendar/api/v3/reference/events"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "sharing-one-event-not-your-calendar",
    "why-a-shared-calendar-does-not-appear"
  ],
  "updated": "2026-10-21"
},

  'google-calendars-that-never-reach-your-iphone': {
  "title": "Hiányzó Google-naptár iPhone-on: kapcsolat és kiválasztás ellenőrzése",
  "short": "Hiányzó Google-naptárak iPhone-on",
  "description": "Keresse meg a hiányzó Google-naptárt: ellenőrizze a hozzáférést, a láthatóságot és az Apple Naptár vagy a Cloud Calendars kapcsolatát.",
  "lede": "Ha az egyik Google-naptár látszik, a másik nem, először tisztázza, hol érhető el a hiányzó naptár. A fiók hozzáférése, a naptárak kiválasztása és az események elérhetősége külön kérdés. Az útmutatót a Cloud Calendars fejlesztője, az Arte Soft adja ki.",
  "commonBelief": "Minden hiányzó Google-naptárt egy rejtett szinkronizálási lista okoz, és a közvetlen kapcsolat garantálja, hogy minden megjelenik.",
  "sections": [
    {
      "heading": "Ellenőrizze, hogy a fiók hozzáfér-e a naptárhoz",
      "body": [
        "Nyissa meg a Google Naptár webes felületét a telefonon használni kívánt fiókkal. Magát a naptárt keresse, ne csak egy ismerős eseménycímet. Két fiókban lehetnek hasonló nevű naptárak; a munkahelyi címre küldött meghívó nem igazolja a személyes fiók hozzáférését.",
        "Ha ott is hiányzik, a tulajdonosnál vagy a megosztási meghívónál kezdje. Csoportos hozzáférésnél ellenőrizze a tagságot és a jogosultságot kapott csoportot. Ne törölje a telefonos fiókot, amíg a hozzáférés kérdése tisztázatlan."
      ]
    },
    {
      "heading": "Különböztesse meg az elrejtett és a hiányzó naptárt",
      "body": [
        "A Google leírja, hogyan választhatók ki a megjelenítendő naptárak a Google Naptár alkalmazás menüjében. A felsorolt, de ki nem jelölt naptár láthatósági kérdés. Ha a listából is hiányzik, például a meghívott személyazonosságot, a jóváhagyást vagy a kapcsolatot kell vizsgálni.",
        "Az e-mailes megosztási meghívó és a feliratkozási cím is külön út. A Google külön kezeli az új feliratkozás hozzáadását számítógépes böngészőből és az e-mailben már megosztott naptár megnyitását. Őrizze meg az eredeti meghívót, de privát hivatkozásokat ne tegyen közzé nyilvános segítségkérésben."
      ]
    },
    {
      "heading": "Azonosítsa, hogyan kap Google-adatokat az iPhone alkalmazása",
      "body": [
        "Az Apple Naptár az eszközön beállított Google-fiókon keresztül kapcsolódhat. A Google útmutatója szerint engedélyezni kell a Naptárak funkciót ennél a fióknál. Kövesse az iOS-verziójához tartozó aktuális utasításokat; egy külön alkalmazás beállítása nem azonos az eszközfiók módosításával.",
        "A Cloud Calendars közvetlen Google-bejelentkezést is kínál. Új kapcsolat felvétele előtt tisztázza a tényleges fiókot és kapcsolódási módot. Ha ugyanaz a naptár az eszközön és közvetlenül is érkezik, először hasonlítsa össze a naptárak azonosságát, ne feltételezzen Google-oldali eseményduplikálást."
      ]
    },
    {
      "heading": "Ellenőrizze a Cloud Calendars kiválasztását, ne feltételezzen teljes lefedettséget",
      "body": [
        "A Cloud Calendarsban tekintse át a megfelelő Google-fiók naptárait, és válassza ki a használni kívántakat. A Google-szinkronizálás ellenőrzi a naptárkiválasztást. A sikeres bejelentkezés önmagában nem igazolja, hogy minden naptár ki van jelölve vagy minden kért frissítés befejeződött.",
        "A közvetlen kapcsolat a Google-adatok fogadásának másik módja, nem ígéret minden hozzáférhető naptár megjelenítésére. Ha a Google webhelyén látszik, de a Cloud Calendarsban nem, jegyezze fel a fiókot, a naptár nevét és a kapcsolódási módot az ügyfélszolgálatnak. A vizsgálat alatt sürgős szervezéshez használja az eredeti szolgáltatást."
      ]
    },
    {
      "heading": "Válassza külön a hiányzó naptárt és a hiányzó dátumokat",
      "body": [
        "Ha a naptár szerepel, de egy találkozó hiányzik, nézze meg pontosan azt a dátumot a Google Naptárban. Ellenőrizze, hogy az esemény a kiválasztott naptárhoz tartozik-e, és ugyanazt az ismétlődő alkalmat nézi-e. Másik naptár hasonló címe nem ugyanaz a forrásbejegyzés.",
        "Ne feltételezze, hogy egy alkalmazás minden múltbeli vagy távoli jövőbeli eseményt letöltött. A Cloud Calendars Google-szinkronizálása korlátozott dátumtartományt kér le. Az üres múltbeli keresés ezért nem bizonyít Google-oldali törlést: módosítás vagy újralétrehozás előtt ellenőrizze az eredeti szolgáltatót."
      ]
    },
    {
      "heading": "Hasznos összehasonlítással kérjen segítséget, ne alaphelyzetbe állítással",
      "body": [
        "Jegyezze fel az alkalmazást, a fióktípust, a naptár nevét, egy példadátumot és azt, hol látszik a naptár. Ha van hibaüzenet, személyes adatok nélkül mellékelje. Így jobban elkülöníthető a jogosultság, a kiválasztás és a szinkronizálás hibája, mint azzal, hogy az egész fiók rossz.",
        "Sürgős programnál egyeztessen a szervezővel az aktuális eseményről. Első tesztként ne töröljön fiókokat, ne importáljon ismételt másolatokat, és ne mozgasson eseményeket naptárak között. A kapcsolat hibájának megértése után ugyanazon a példán ellenőrizze az eredményt, mielőtt mást is átállítana."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Hasonlítsa össze a megfelelő fiókot és naptárt a Google Naptár webes felületén.",
    "Nézze meg, hogy hiányzik-e a naptár, vagy csak nincs kijelölve.",
    "Azonosítsa az eszköz Google-szinkronizálását, a közvetlen alkalmazáskapcsolatot vagy a feliratkozást.",
    "Ellenőrizze a megfelelő fiók kiválasztott naptárait a Cloud Calendarsban.",
    "Hasonlítson össze egy pontos eseménydátumot az eredeti szolgáltatónál.",
    "Jelezze az eltérést privát címek megosztása és fiókok alaphelyzetbe állítása nélkül."
  ],
  "faq": [
    {
      "q": "A közvetlen Google-bejelentkezés minden naptárt megjelenít?",
      "a": "Ne feltételezzen teljes lefedettséget. A fiók, a naptárlista, a kiválasztás és a sikeres szinkronizálás egyaránt számít. Hasonlítsa össze a hiányzó naptárt a Google Naptár webes felületével."
    },
    {
      "q": "Töröljem, majd adjam hozzá újra a fiókot?",
      "a": "Előbb ellenőrizze a személyazonosságot, a hozzáférést, a láthatóságot és a kapcsolat módját. Az újracsatlakozás nem adja meg azt a jogosultságot, amelyet a tulajdonos nem engedélyezett."
    },
    {
      "q": "A hiányzó régi eseményt biztosan törölték?",
      "a": "Nem. Ellenőrizze az eredeti Google-naptárt és a dátumot. Az alkalmazás dátumtartománya vagy keresése eltérhet a szolgáltató által tárolt előzményektől."
    }
  ],
  "sourcesHeading": "Szolgáltatói útmutatók és további olvasnivalók",
  "sources": [
    {
      "label": "Google: Google-események hozzáadása az Apple Naptárhoz",
      "url": "https://support.google.com/calendar/answer/99358?hl=en&co=GENIE.Platform%3DiOS"
    },
    {
      "label": "Google: feliratkozások és a naptárak láthatósága",
      "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
    },
    {
      "label": "Google: a naptárlista működése",
      "url": "https://developers.google.com/workspace/calendar/api/v3/reference/calendarList/list"
    }
  ],
  "seeAlso": [
    "why-a-shared-calendar-does-not-appear",
    "icloud-google-and-outlook-in-one-view",
    "the-secret-address-of-a-google-calendar"
  ],
  "updated": "2026-10-21"
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
