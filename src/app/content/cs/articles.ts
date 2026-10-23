import { LocalisedArticle } from '../types';

/**
 * The four articles this language carries.
 *
 * Chosen one per intent -- weather, one view, sharing, price -- so the language
 * answers a whole question rather than a quarter of four. The numbers are not
 * here: they live once in article-facts.ts and join the prose by id, so a
 * translation can rewrite every sentence without touching a figure.
 */
export const ARTICLES_CS: Readonly<Record<string, LocalisedArticle>> = {
  "month-view-on-a-bigger-screen": {
  "updated": "2026-10-22",
  "title": "Měsíční kalendář na iPadu a iPhonu: porovnejte data, ověřte podrobnosti",
  "short": "Měsíční přehled bez přehlédnutí detailů",
  "description": "Porovnejte data na iPadu či iPhonu. Před přesunem sdílených nebo opakovaných schůzek ověřte skryté události, vybrané kalendáře a přesné časy.",
  "lede": "Měsíční pohled ukazuje, na které dny připadají závazky. Hůře dokazuje, že určitá hodina je volná. Vyberte datum v přehledu a před závazkem prohlédněte den i událost. Průvodce vydává Arte Soft, vývojář Cloud Calendars.",
  "commonBelief": "Větší měsíční mřížka ukazuje všechny podrobnosti a zdánlivě prázdný den dokazuje dostupnost všech.",
  "sections": [
    {
      "heading": "Rozhodněte mezi daty a přesnými hodinami",
      "body": [
        "Použijte měsíc k porovnání termínu projektu, cesty a rodinné schůzky během několika týdnů. Chcete-li zjistit překrytí ve 14:30, přepněte na den či týden a ověřte přesný začátek a konec. Měsíční buňka nemá stejnou časovou stupnici jako hodinová mřížka.",
        "Organizátor workshopu může nejprve vyloučit cestovní týden. Poté ověří navržený den: závazky, přípravu, cestu a nutný konec. Prázdně vypadající buňka je možnost k prověření, nikoli potvrzená rezervace nebo informace o dostupnosti ostatních."
      ]
    },
    {
      "heading": "Sledujte počet dalších událostí, nejen viditelné názvy",
      "body": [
        "Současná měsíční buňka Cloud Calendars ukazuje omezený počet štítků událostí a údaj o dalších, pokud jich k datu patří více. Názvy zůstávají na jednom řádku a mohou se zkrátit. Otevřete den či událost, pokud záleží na celém názvu nebo ostatních závazcích.",
        "Větší displej iPadu usnadňuje čtení, ale nemusí odstranit všechny limity zobrazení. Úzké okno nebo větší text mění dostupný prostor. Stejně postupujte na iPhonu: prohlédněte den, než viditelné štítky považujete za celý rozvrh."
      ]
    },
    {
      "heading": "Ověřte měsíc, vybrané kalendáře a sousední data",
      "body": [
        "Před výběrem přečtěte měsíc a rok. Mřížka může doplňovat řádky dny sousedního měsíce. V Cloud Calendars použijte navigaci měsíců a ověřte vybrané datum, nespoléhejte jen na polohu políčka.",
        "Zkontrolujte výběr kalendářů. Skrytí práce může zpřehlednit rodinný plán, ale odstraní tyto závazky z daného přehledu. Při diagnostice duplicity dočasně skryjte jeden zdroj a porovnejte; nemažte schůzku jen kvůli méně zaplněnému měsíci."
      ]
    },
    {
      "heading": "Před změnou společné dohody otevřete událost",
      "body": [
        "V podrobnostech potvrďte název, vlastníka či kalendář, místní čas a trvání. Barva pomáhá orientaci, nenahrazuje však znalost účtu nebo práva upravovat. Viditelná pozvánka se liší od vámi organizované schůzky.",
        "Cloud Calendars umožňuje v měsíci přetáhnout událost na jiné datum. Před skutečnou změnou určete cílový den a rozsah opakování. Po povolené změně událost znovu otevřete; místní gesto nedokazuje přijetí nové dohody poskytovatelem nebo všemi účastníky."
      ]
    },
    {
      "heading": "Opakování a časová pásma kontrolujte zvlášť",
      "body": [
        "Pokud se přesouvá jen lekce tohoto týdne, nezměňte omylem budoucí vzorec. Přečtěte nabízený rozsah a poté ověřte změněný i pozdější výskyt. Měsíc usnadňuje porovnání dat, ale rozsah úpravy určuje účinek.",
        "U cest či schůzek napříč pásmy výslovně ověřte místní datum a čas. Přesun na jiný den automaticky nepřevádí zamýšlený čas setkání. Zkontrolujte případné změny letního času a potvrďte dohodnutou hodinu s účastníky."
      ]
    },
    {
      "heading": "Použijte větší přehled bez zaměňování produktů",
      "body": [
        "Kalendář Apple má vlastní možnosti měsíčního zobrazení, Teamup popisuje různé pohledy v prohlížeči a mobilu. Ovládání patří příslušným produktům. Nehledejte webovou konfiguraci Teamupu nebo nabídku Apple v Cloud Calendars jen kvůli stejnému názvu pohledu.",
        "Měsíc schůzek není měsíc předpovědí počasí. Pro venkovní plán ověřte místo, datum a dostupné hodiny předpovědi zvlášť. Uložte konečnou schůzku do správného kalendáře a změny potvrďte přímo s účastníky."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Vyberte možné dny v měsíci a přesné hodiny ověřte v dni či týdnu.",
    "Otevřete dny s počtem dalších událostí nebo zkrácenými názvy.",
    "Před předpokladem volného dne ověřte měsíc, rok a kalendáře.",
    "Potvrďte kalendář, čas, trvání a právo upravovat.",
    "Přečtěte rozsah opakování a po přesunu ověřte uložený výskyt.",
    "Dostupnost počasí ověřte zvlášť a změny potvrďte s účastníky."
  ],
  "faq": [
    {
      "q": "Ukazuje měsíc na iPadu všechny schůzky celé?",
      "a": "Nepředpokládejte to. Cloud Calendars omezuje štítky v buňce a zobrazuje počet dalších. Otevřete den a událost pro celý rozvrh."
    },
    {
      "q": "Znamená prázdný den, že mám volno?",
      "a": "Nejprve ověřte výběr kalendářů, datum a dostupnost příslušných dat účtu. Přehled ukazuje jen aktuálně dostupné a zobrazené informace."
    },
    {
      "q": "Změní přesun opakované události jen tento den?",
      "a": "Přečtěte volbu rozsahu úpravy. Po uložení zkontrolujte změněný a pozdější výskyt a potvrďte zamýšlenou dohodu."
    }
  ],
  "sourcesHeading": "Porovnejte oficiální popisy zobrazení",
  "sources": [
    {
      "label": "Apple: měsíční, vícedenní a seznamové zobrazení",
      "url": "https://support.apple.com/en-ca/guide/iphone/iphfd1054569/ios"
    },
    {
      "label": "Teamup: pohledy a konfigurace prohlížeče versus aplikace",
      "url": "https://calendar.teamup.com/kb/how-to-use-calendar-views/"
    }
  ],
  "seeAlso": []
},

  'weather-inside-your-calendar': {
  "updated": "2026-10-23",
  "title": "Kalendář s počasím na iPhone a iPadu: naplánujte si den v jednom přehledu",
  "short": "Používejte kalendář a počasí společně",
  "description": "Porovnejte si na iPhone a iPadu kalendář s počasím pro vybrané místo.",
  "lede": "Cloud Calendars spojuje váš plán a počasí v jedné aplikaci pro iPhone nebo iPad. V kalendáři si vyberte datum a v zobrazení počasí si prohlédněte vybrané místo i dostupné hodiny předpovědi. Pokud plánujete venkovní aktivitu, kontrolujte období, na kterém záleží, místo spoléhání na denní ikonu. Tento průvodce vydává Arte Soft, vývojář aplikace.",
  "commonBelief": "Počasí zobrazené vedle kalendáře automaticky popisuje adresu každé události, každou hodinu i každé budoucí datum.",
  "sections": [
    {
      "heading": "Zvolte si skutečnou plánovací otázku",
      "body": [
        "Začněte konkrétní událostí, například odpolední návštěvou parku. Určete, co by se mohlo změnit: čas, místo, příprava nebo rozhodnutí zvolit jinou možnost. Nemusíte přeorganizovat celý kalendář jen proto, že symbol dne ukazuje déšť.",
        "Poznamenejte si skutečný začátek a konec aktivity, včetně přípravy, pokud je relevantní. Přehled kalendáře pomáhá najít možné termíny, zatímco kontrola předpovědi se týká konkrétního místa a časového úseku. Při porovnávání možností tyto dvě úlohy nepléste."
      ]
    },
    {
      "heading": "Než začnete číst hodnoty, ověřte místo počasí",
      "body": [
        "Cloud Calendars nabízí počasí pro aktuální nebo vybrané místo. Ověřte zobrazenou lokalitu, místo abyste předpokládali, že adresa události předpověď automaticky změní. Událost v jiném městě vyžaduje porovnání s počasím v tomto městě.",
        "Například návštěvník může plánovat příchod do muzea, zatímco telefon je stále doma. Před porovnáním si přečtěte místo předpovědi a místní čas události. Podobné hodnoty neznamenají, že plán a počasí používají stejné místo."
      ]
    },
    {
      "heading": "Hodinové a denní pokrytí kontrolujte zvlášť",
      "body": [
        "Denní údaj použijte pro orientaci a dostupné hodinové údaje pro otázky týkající se části dne. Rezervace od dvou do pěti vyžaduje víc než letmý pohled na jeden symbol. Ověřte, zda jsou příslušné hodiny skutečně k dispozici.",
        "V aktuálním zdroji aplikace denní seznam obsahuje až deset vrácených dnů z WeatherKit. To je oddělené od pohybu v kalendáři i od právě poskytovaných hodin. Budoucí událost nerozšiřuje pokrytí počasí. Pokud její období chybí, naplánujte pozdější kontrolu předpovědi."
      ]
    },
    {
      "heading": "Čtěte, co daná hodnota počasí znamená",
      "body": [
        "Apple dokumentuje data WeatherKit, jako jsou teplota, srážky, vítr a UV, přičemž některé produkty jsou dostupné jen ve vybraných regionech. Čtěte hodnoty dostupné pro zvolené místo, místo očekávání, že všechny produkty počasí budou dostupné všude.",
        "Pokyny Met Office ukazují, proč záleží na období předpovědi a definicích proměnných: některé hodnoty se vztahují k okamžiku a jiné k období. Používejte popisky příslušného poskytovatele. Pravděpodobnost deště, množství a trvání jsou různé otázky a žádné jedno číslo nerozhodne o každé venkovní aktivitě."
      ]
    },
    {
      "heading": "Zkontrolujte koncept vytvořený z hodiny počasí",
      "body": [
        "Tam, kde aplikace nabízí vytvoření události z hodiny, otevře koncept. Aktuální zdroj používá časové pásmo místa počasí, navrhuje hodinovou délku a vybírá výchozí kalendář pro nové události. Před uložením zkontrolujte každou hodnotu.",
        "Potvrďte název, cílový kalendář, začátek, konec i zamýšlené místo. Výběr předpovědi nedává oprávnění upravovat sdílený kalendář, informovat místo konání ani rezervovat místnost. Zkontrolujte uloženou událost a získejte všechna potvrzení, která plán vyžaduje."
      ]
    },
    {
      "heading": "Webovou ukázku posuzujte odděleně",
      "body": [
        "Interaktivní ukázka počasí na webu používá Open-Meteo. Aplikace používá Apple WeatherKit. Webová ukázka je užitečná pro prozkoumání způsobu zobrazení, ale její místo, data i dostupná data se mohou od aplikace lišit.",
        "Pro skutečné rozhodnutí otevřete aplikaci a porovnejte zamýšlenou událost s dostupnou předpovědí. Pokud měníte sdílený plán, potvrďte organizátora, rozsah opakování a účastníky. Mějte domluvenou alternativu pro případ, že aktivita závisí na podmínkách."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Určete událost a rozhodnutí, které by počasí mohlo změnit.",
    "Potvrďte místo počasí a místní datum a čas události.",
    "Dostupné hodinové pokrytí zkontrolujte odděleně od denního souhrnu.",
    "Pravděpodobnost, množství a další relevantní hodnoty čtěte podle jejich popisků.",
    "Před uložením zkontrolujte všechny údaje konceptu události i cílový kalendář.",
    "V čase rozhodnutí vše znovu ověřte a sdílené změny potvrďte přímo."
  ],
  "faq": [
    {
      "q": "Sleduje počasí vedle mého kalendáře adresu každé události?",
      "a": "To nepředpokládejte. Ověřte zobrazené místo počasí a porovnejte je s místem konání; blízkost na obrazovce shodu nedokazuje."
    },
    {
      "q": "Používá aplikace stejného poskytovatele počasí jako web?",
      "a": "Ne. Aplikace používá Apple WeatherKit; webová ukázka používá samostatně Open-Meteo."
    },
    {
      "q": "Uloží výběr hodiny předpovědi událost automaticky?",
      "a": "Tam, kde je tato akce nabízena, spustí koncept. Zkontrolujte jeho datum, časové pásmo, délku, kalendář a místo a potom uložte zamýšlenou událost."
    }
  ],
  "seeAlso": [
    "weather-calendar-history-versus-forecast-iphone",
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather",
    "weather-where-the-event-is",
    "planning-outdoors-without-being-rained-on"
  ],
  "sourcesHeading": "Oficiální zdroje a další čtení",
  "sources": [
    {
      "label": "Apple: informace o předpovědi WeatherKit a regionální dostupnost",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: místo předpovědi, období a hodnoty počasí",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ],
  "comparison": {
    "heading": "Které zobrazení počasí odpoví na vaši otázku?",
    "columns": [
      "Vaše otázka",
      "Co zkontrolovat",
      "Co to nepotvrzuje"
    ],
    "rows": [
      {
        "cells": [
          "Co mě dnes čeká?",
          "Denní nebo týdenní zobrazení kalendáře vedle počasí pro vybrané místo.",
          "Že adresa každé události automaticky mění místo počasí."
        ]
      },
      {
        "cells": [
          "Může déšť ovlivnit mou odpolední událost?",
          "Hodinová data pro místo konání a celé období události.",
          "Že denní symbol popisuje každou hodinu."
        ]
      },
      {
        "cells": [
          "Mohu plánovat příští měsíc podle počasí?",
          "Teď svůj kalendář, pak kontrolu předpovědi blíž k datu.",
          "Že pohyb v kalendáři rozšiřuje pokrytí předpovědi."
        ]
      },
      {
        "cells": [
          "Mohu doma vidět rychlý přehled?",
          "Vhodný widget na plochu.",
          "Že každé rozložení widgetu zahrnuje události nebo úplnou předpověď."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-right",
    "hook"
  ],
  "galleryCaption": "Skutečné obrazovky Cloud Calendars: zobrazení počasí a den s událostmi. V aplikaci zkontrolujte vybrané místo a datum.",
  "actionHeading": "Plánujte s rozvrhem i předpovědí společně",
  "actionText": "Cloud Calendars je pro iPhone a iPad. Začněte se zobrazeními, počasím a synchronizací Google Calendar, které jsou součástí Base; Advanced odstraňuje reklamy, zatímco Premium přidává podporu Microsoft Calendar a Teams.",
  "articleLinks": [
    {
      "slug": "forecast-beside-every-event",
      "label": "Zkontrolujte počasí pro hodiny události"
    },
    {
      "slug": "the-widget-that-shows-what-is-next",
      "label": "Vyberte widget kalendáře a počasí"
    },
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "Spojte kalendářové účty do jednoho přehledu"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
  "updated": "2026-10-23",
  "title": "Zobrazte si kalendáře Google, iCloud a Outlook společně na iPhone a iPad",
  "short": "Tři poskytovatelé, jedno zobrazení",
  "description": "Spojte zobrazení kalendářů a pochopte oprávnění účtů, kopie i požadavky na tarif.",
  "lede": "Chcete-li vidět pracovní i osobní události pohromadě, připojte zamýšlené účty, vyberte jejich kalendáře a zkontrolujte stejné události v jednom zobrazení. Cloud Calendars podporuje plánování na iPhone a iPad s iCloud a Google Calendar; podpora Microsoft Calendar je v Premium. Společné zobrazení událostí se liší od kopírování obsazenosti mezi účty různých poskytovatelů. Tento návod vydává vývojář Arte Soft.",
  "commonBelief": "Když vložím několik kalendářů do jedné aplikace, automaticky to udrží jejich dostupnost, sdílení a kopie událostí ve shodě.",
  "sections": [
    {
      "heading": "Určete účet a kalendář za každou událostí",
      "body": [
        "Začněte jednou běžnou událostí od každého poskytovatele. Poznamenejte si přihlášenou e-mailovou adresu, název kalendáře a to, zda událost vlastníte, nebo jste dostali pozvánku. Dva kalendáře s názvem „Kalendář“ mohou patřit úplně jiným účtům. Barva pomáhá při orientaci v týdnu; účet a kalendář určují, kam má případná úprava směřovat.",
        "Například návštěva zubaře ve vašem osobním kalendáři iCloud a projektová schůzka v Microsoft se vám mohou zobrazovat společně. To samo o sobě neznamená, že návštěvu zubaře uvidí i vaši kolegové nebo že se tento čas zablokuje v jejich plánovacích nástrojích.",
        "Než změníte připojení, určete si požadovaný výsledek. Pokud chcete přesunout data událostí do jiného účtu, použijte níže možnost „Zvolte formát exportu kalendáře“ a najděte podporovanou cestu přenosu; než se na cílové umístění spolehnete, zkontrolujte reprezentativní události. Pokud chcete porovnávat časy, ponechte stávající vlastníky kalendářů a zobrazte vybrané zdroje společně. Pokud má jiný účet dostávat informaci o obsazenosti, část „Cloud Calendars a OneCal podle pracovního postupu“ vysvětluje, jak se kopírování dostupnosti liší od osobního přehledu."
      ]
    },
    {
      "heading": "Připojte se vhodnou cestou",
      "body": [
        "U iCloud nejprve na iPhone v zamýšleném Apple Account zapněte iCloud Calendar. Nastavení zařízení vysvětluje návod Apple. Cloud Calendars přistupuje ke kalendářům dostupným přes kalendářový systém iPhone a pro jejich čtení potřebuje přístup ke kalendáři. Nestačí, že je účet připojený na jiném zařízení.",
        "Cloud Calendars má také akce „Sign in with Google“ a „Sign in with Microsoft“. Zkontrolujte, který účet při přihlášení vybíráte, pak otevřete jeho skupinu kalendářů a vyberte kalendáře, které potřebujete. Přihlášení ke správnému poskytovateli se špatnou osobní nebo pracovní identitou může vytvořit zcela platný, ale nečekaný seznam kalendářů."
      ]
    },
    {
      "heading": "Rozumějte tarifům a nepleťte si je s oprávněními",
      "body": [
        "Tarif Base zahrnuje synchronizaci Google Calendar a zobrazení kalendáře. Advanced k Base přidává odstranění reklam. Premium přidává funkce Microsoft Calendar a Microsoft Teams. Před nákupem si zkontrolujte aktuální místní cenu a fakturační období.",
        "Tarif mění, které funkce aplikace jsou dostupné; neuděluje vám vlastnictví cizího kalendáře. Google rozlišuje oprávnění k zobrazení událostí od oprávnění je měnit. Stále platí zásady zaměstnavatele i oprávnění přiřazená kalendáři Microsoft. Viditelná událost nebo dostupný editor nejsou důkazem, že poskytovatel aktualizaci přijme."
      ]
    },
    {
      "heading": "Kombinované zobrazení může zahrnovat kopie kalendářů",
      "body": [
        "Připojení Google a Microsoft používají v kalendářovém systému iPhone kopie kalendářů k zobrazení a synchronizaci událostí. Nepředpokládejte, že připojení účtu nezanechá žádnou kopii mimo původního poskytovatele. Cíl použitý pro tyto kopie může záviset na zdrojích kalendářů dostupných v zařízení.",
        "Pokud se stejný účet dostává do telefonu i jinou cestou, zkontrolujte názvy kalendářů a zdroje dříve, než budete opakované události považovat za samostatné. Dočasně skryjte jeden kalendář, abyste zjistili, které zobrazení dodává. Nemažte událost ani kalendář jen proto, aby obrazovka vypadala přehledněji: připojená kopie může posílat změny zpět poskytovateli."
      ]
    },
    {
      "heading": "Při vytváření události vždy znovu volte cíl",
      "body": [
        "Před uložením kontrolujte kalendář události stejně pečlivě jako její datum a čas. Pro rodinnou událost vyberte kalendář, který rodina skutečně používá; pro pracovní schůzku použijte povolený pracovní cíl. To, že vidíte oba kalendáře společně, neznamená, že se některý z nich automaticky stane cílem pro každou novou událost.",
        "Změna kalendáře události nebo její přetažení mezi kalendáři může být přesun, ne neškodné druhé zobrazení. Při řešení problému se zobrazením ponechte pozvánky a opakující se schůzky v jejich zavedeném kalendáři. Pokud změnu potřebujete, nejprve zjistěte, kdo událost vlastní a který kalendář ji může přijmout."
      ]
    },
    {
      "heading": "Než se na přehled spolehnete, ověřte ho",
      "body": [
        "Porovnejte nedávnou událost v kalendáři samotného poskytovatele s odpovídající událostí v Cloud Calendars. Zkontrolujte datum, časové pásmo, název a vybraný kalendář. U upravitelného kalendáře, který vlastníte, je jednorázová testovací událost bez hostů lepší kontrolou než změna probíhající schůzky. Než budete připojení považovat za připravené, potvrďte výsledek u poskytovatele.",
        "Nespoléhejte na to, že kombinované zobrazení automaticky vytvoří anonymní bloky obsazenosti v jiném účtu. Pokud potřebujete, aby kolegové viděli vaši nedostupnost bez osobních detailů, použijte výslovně schválené řešení sdílení dostupnosti a ověřte ho z jejich strany. Jasný osobní přehled a sdílená dostupnost jsou dvě různé úlohy."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Uveďte přesný účet a kalendář pro jednu událost od každého poskytovatele.",
    "Na zařízení zapněte zamýšlené kalendáře iCloud a zkontrolujte přístup ke kalendářům.",
    "Použijte odpovídající přihlášení ke Google nebo Microsoft a vyberte zamýšlené kalendáře.",
    "Než cokoli změníte, porovnejte jednu nedávnou událost s jejím zobrazením u poskytovatele.",
    "Podezřelý duplicitní zdroj dočasně skryjte; původní události ponechte beze změny.",
    "U každé nové události zkontrolujte cílový kalendář a zvlášť ověřte jakékoli sdílení obsazenosti, které potřebujete."
  ],
  "faq": [
    {
      "q": "Uvidí moji pracovní kolegové moje osobní události, když zobrazuji oba kalendáře?",
      "a": "Společné zobrazení kalendářů není pokyn ke sdílení ani automatický most pro přenos obsazenosti. Zkontrolujte skutečná nastavení sdílení každého kalendáře. Připojení poskytovatelů mohou v zařízení vytvářet kopie kalendářů, takže ani kombinované zobrazení nezaručuje, že data událostí existují jen u původního poskytovatele."
    },
    {
      "q": "Proč událost vidím, ale nejde ji úspěšně upravit?",
      "a": "Kalendář může být jen pro čtení, událost může patřit jinému organizátorovi nebo poskytovatel může aktualizaci odmítnout. Zkontrolujte vlastnictví a oprávnění v kalendáři poskytovatele. Vyšší tarif aplikace tato oprávnění nemění."
    },
    {
      "q": "Mám stejný účet Google připojit všemi dostupnými způsoby?",
      "a": "Nejprve zkontrolujte, jak se už zobrazuje v telefonu. Více způsobů připojení může ztížit rozlišení kopií kalendáře. Zvolte cestu, kterou chcete používat, ověřte její události a při prověřování raději skryjte nadbytečné zobrazení, než abyste jako první krok mazali data nebo odpojovali účty."
    }
  ],
  "sourcesHeading": "Zdroje a odkazy k nastavení",
  "sources": [
    {
      "label": "Apple: nastavení iCloud Calendar na vašich zařízeních",
      "url": "https://support.apple.com/guide/icloud/set-up-calendar-mme4d73a8727/icloud"
    },
    {
      "label": "Google: sdílení kalendáře a oprávnění",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: Outlook calendar API a podporovaná data poštovních schránek",
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
    "heading": "Společné zobrazení, odběr nebo zkopírovaná zaneprázdněnost?",
    "columns": [
      "Co potřebujete",
      "Co zkontrolovat",
      "Co nepředpokládat"
    ],
    "rows": [
      {
        "cells": [
          "Jedno zobrazení několika účtů",
          "Připojený účet, vybraný kalendář a požadovaný tarif.",
          "Že sdílená obrazovka slučuje vlastnictví nebo oprávnění."
        ]
      },
      {
        "cells": [
          "Aby se úprava události propsala k poskytovateli",
          "Původní událost, oprávnění k zápisu a uložený výsledek u zdroje.",
          "Že viditelná místní úprava dokazuje úspěšnou synchronizaci s poskytovatelem."
        ]
      },
      {
        "cells": [
          "Zaneprázdněnost v jiném účtu",
          "Službu s výslovně popsanými pravidly synchronizace ze zdroje do cíle.",
          "Že společné zobrazení vytváří bloky dostupnosti pro kolegy."
        ]
      },
      {
        "cells": [
          "Odebíraný kalendářní feed",
          "Vydavatele, chování obnovování a stav jen pro čtení.",
          "Že odběr ICS je upravitelné obousměrné propojení."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-left",
    "hook"
  ],
  "galleryDevice": "iPad",
  "galleryCaption": "Skutečná zobrazení kalendáře na iPadu ukazují, jak kontrolovat plán. Snímek obrazovky nedokládá směr synchronizace poskytovatele ani oprávnění účtu.",
  "actionHeading": "Prohlédněte si své kalendáře společně na iPhone a iPad",
  "actionText": "Synchronizace Google Calendar je součástí Base. Advanced odstraňuje reklamy; Premium přidává podporu Microsoft Calendar a Teams. Oprávnění účtu ověřujte nezávisle na zakoupeném tarifu.",
  "articleLinks": [
    {
      "slug": "onecal-alternative-iphone-calendar-view-or-sync",
      "label": "Porovnat společné zobrazení s pravidly synchronizace OneCal"
    },
    {
      "slug": "fantastical-readdle-calendar366-iphone-comparison",
      "label": "Porovnat pracovní postupy kalendáře na iPhone"
    },
    {
      "slug": "weather-inside-your-calendar",
      "label": "Plánujte s počasím a událostmi pohromadě"
    }
  ]
},

  'sharing-one-event-not-your-calendar': {
  "updated": "2026-10-21",
  "title": "Sdílení jedné události: zvolte správný odkaz a oprávnění",
  "short": "Sdílení jedné události",
  "description": "Sdílejte událost bez celého kalendáře. Zjistěte, co znamenají role Reader, Writer a Owner, náhledy, aktualizace a omezení odebrání přístupu.",
  "lede": "Poslat podrobnosti večeře, povolit spoluorganizátorovi úpravy a získat potvrzení účasti jsou různé úkoly. Nejdříve si vyberte potřebný výsledek, potom způsob sdílení. Tento návod připravila Arte Soft, vývojář Cloud Calendars.",
  "commonBelief": "Každý odkaz na událost je údajně odběr kalendáře pouze pro čtení, který se okamžitě aktualizuje a zaznamená odpověď.",
  "sections": [
    {
      "heading": "Začněte kontrolou jedné události",
      "body": [
        "Sdílení jednotlivé události se týká této události, nikoli celého kalendáře odesílatele. Před odesláním zkontrolujte název, časové pásmo, místo, poznámky a odkazy na schůzky. Údaj vhodný pro jednoho hosta nemusí patřit do široce šířeného odkazu.",
        "Sdílení večeře nevyžaduje sdílet kalendář s návštěvami lékaře. Místo a odkazy samotné večeře se však sdílejí spolu s ní. Prověřte obsah události, nespoléhejte na soukromí okolního kalendáře."
      ]
    },
    {
      "heading": "Vyberte náhled, e-mailovou pozvánku nebo QR kód",
      "body": [
        "Cloud Calendars nabízí různé cesty sdílení. App Clip zobrazuje náhled; k přidání události touto cestou je potřeba plná aplikace. E-mailové a QR pozvánky používají webovou stránku nabízející otevření Cloud Calendars. Tyto odkazy nejsou zaměnitelné adresy odběru.",
        "Pro synchronizované sdílení v aplikaci se odesílatel přihlašuje. Odkaz i QR kód lze přeposlat, proto je posílejte jen tam, kde je jejich obsah vhodný. QR kód předává odkaz, nedokazuje totožnost člověka, který jej otevřel."
      ]
    },
    {
      "heading": "Přidělte jen potřebná oprávnění",
      "body": [
        "U e-mailových pozvánek lze zvolit Reader, Writer nebo Owner. Reader může prohlížet a synchronizovat; Writer upravovat; Owner také sdílet a spravovat přístup. Nejde o tři názvy pro pouhé prohlížení. Pro člověka, který potřebuje pouze program, zvolte Reader.",
        "Writer je vhodný pro spoluorganizátora, který má měnit událost. Owner přidělte jen tomu, kdo má spravovat i přístup ostatních. Vyšší oprávnění vyžadují odpovídající přihlášenou identitu příjemce. Anonymní příjemce není identifikovaný spoluvlastník."
      ]
    },
    {
      "heading": "Zjistěte, jak příjemce událost přidá",
      "body": [
        "V plné aplikaci vyžaduje přidání sdílené události oprávnění ke kalendářům a zapisovatelný cílový kalendář. Příjemce má před uložením zkontrolovat cíl. Přijatá kopie pak může být spojena se sdílenou událostí pro pozdější aktualizace.",
        "To se liší od importu běžného souboru ICS do jiného kalendáře. Import vytvoří kopii, zatímco odběr pravidelně kontroluje kanál. Posíláte-li kanál ICS místo pozvánky aplikace, výslovně to vysvětlete a ověřte podporu v kalendáři příjemce."
      ]
    },
    {
      "heading": "Ověřte změny, než se na ně spolehnete",
      "body": [
        "Synchronizované sdílení může přenášet pozdější úpravy či zrušení, zařízení příjemce však musí dostat možnost je přijmout. Doporučený interval obnovení kanálu není termín doručení. Zařízení offline, neobnovený odběr nebo samostatná importovaná kopie mohou stále zobrazovat staré údaje.",
        "Přesune-li se večeře těsně před začátkem, upravte událost a kontaktujte hosty přímo. Požádejte o potvrzení nového času. Odeslání aktualizace a získání odpovědi o účasti jsou samostatné kroky."
      ]
    },
    {
      "heading": "Spravujte přístup bez slibu vymazání kopií",
      "body": [
        "Prověřte oprávnění příjemců a odeberte nepotřebná. Odebrání příjemce a odvolání odkazu na kanál jsou různé operace. Ani jednu nepopisujte jako vzdálené vymazání snímků obrazovky, zpráv či všech kopií v kalendářích.",
        "Rozšířil-li se odkaz mimo zamýšlený okruh, zjistěte, o který odkaz nebo oprávnění jde. Po změně přístupu ověřte dotčenou cestu. U dalších událostí nedávejte soukromé údaje do široce šířených odkazů, místo spoléhání na jejich pozdější odvolání."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Zkontrolujte podrobnosti a určete, zda potřebujete čtení, úpravy nebo odpovědi o účasti.",
    "Zvolte správnou cestu sdílení a podle potřeby se přihlaste.",
    "Pro čtenáře použijte Reader; Writer a Owner přidělujte podle skutečné odpovědnosti.",
    "Požádejte příjemce, aby při přidávání ověřil čas a cílový kalendář.",
    "Při naléhavé změně upravte událost a pošlete přímou zprávu.",
    "Při ukončení sdílení prověřte zvlášť oprávnění příjemců a přístup přes odkazy."
  ],
  "faq": [
    {
      "q": "Zpřístupní sdílení události celý můj kalendář?",
      "a": "Synchronizované sdílení jedné události je omezeno na ni. Přesto zvolenou cestou zpřístupňuje její vlastní podrobnosti. Zkontrolujte je a neposílejte pozvánku k celému kalendáři, chcete-li sdílet jen událost."
    },
    {
      "q": "Může příjemce událost změnit?",
      "a": "Ano, s odpovídající rolí Writer nebo Owner a podporovaným přihlášeným postupem. Reader slouží k prohlížení a synchronizaci. Běžný odběr ICS není stejný mechanismus úprav."
    },
    {
      "q": "Zruší odebrání člověka vše, co už obdržel?",
      "a": "Takovou záruku nepředpokládejte. Změna oprávnění ovlivňuje podporovaný vztah sdílení, ale uložené kopie, snímky obrazovky a zprávy mohou zůstat. Samostatně je třeba posoudit i adresu sdíleného kanálu."
    }
  ],
  "sourcesHeading": "Zdroje k možnostem příjemce",
  "sources": [
    {
      "label": "Apple: přehled App Clips",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google: import událostí a jeho omezení",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft: import kalendáře a přihlášení k odběru",
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
  "title": "Co předplatné doopravdy přináší",
  "short": "Co předplatné přináší",
  "description": "Co předplatné přináší: Base, Advanced, Premium.",
  "lede": "Tuto příručku vydává Arte Soft, vývojář aplikace Cloud Calendars.",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "Base zahrnuje synchronizaci Google Calendar, Google Meet, zobrazení kalendáře, počasí a widgety. Bezplatný plán může zobrazovat reklamy."
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Advanced zahrnuje Base a odstraňuje reklamy. Premium zahrnuje Advanced a přidává Microsoft Calendar a Microsoft Teams.",
        "Předplatné nedává právo upravovat cizí kalendáře ani neobchází omezení pracovního účtu."
      ]
    },
    {
      "heading": "Informace o nákupu a zrušení",
      "body": [
        "Před nákupem zkontrolujte místní cenu, fakturační období a podmínky obnovení.",
        "U předplatného účtovaného společností Apple otevřete Nastavení → vaše jméno → Předplatná. Zkontrolujte stav a datum vypršení. Zrušení obnovení je oddělené od smazání aplikace nebo dat kalendáře; nepočítejte s tím, že placené funkce zůstanou po vypršení dostupné."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Před nákupem zkontrolujte místní cenu, fakturační období a podmínky obnovení.",
    "Předplatné nedává právo upravovat cizí kalendáře ani neobchází omezení pracovního účtu."
  ],
  "faq": [
    {
      "q": "Jak zastavím obnovení?",
      "a": "U předplatného účtovaného společností Apple otevřete Nastavení → vaše jméno → Předplatná. Zkontrolujte stav a datum vypršení. Zrušení obnovení je oddělené od smazání aplikace nebo dat kalendáře; nepočítejte s tím, že placené funkce zůstanou po vypršení dostupné."
    }
  ],
  "sourcesHeading": "Informace o nákupu a zrušení",
  "sources": [
    {
      "label": "Apple: Jak zastavím obnovení?",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view"
  ]
},
};
