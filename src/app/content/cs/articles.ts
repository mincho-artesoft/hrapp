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
  "title": "Kalendář, který už počasí obsahuje",
  "short": "Počasí uvnitř kalendáře",
  "description": "Proč je dívat se do dvou aplikací kvůli naplánování dne konstrukční chyba a jak vypadá kalendář, v němž je předpověď součástí pohledu, a ne vedle něj.",
  "lede": "Téměř každý si plánuje den mezi dvěma aplikacemi. Kalendář říká, kde je třeba být; ta s počasím říká, jaké tam bude počasí. Držet obojí pohromadě v hlavě je ta část, o níž nikdo neví, že ji dělá — dokud nepřijde o sobotu.",
  "commonBelief": "Že kalendář je na schůzky a aplikace na počasí je na počasí, a že držet je odděleně je prostě to, jak telefony fungují.",
  "sections": [
    {
      "heading": "Cena dvou aplikací nejsou dvě klepnutí",
      "body": [
        "Přepnout nestojí nic. Drahé je to, že se ty dvě nikdy neshodnou na tom, co je podstatné. Váš kalendář ví, že v sobotu od jedenácti jsou dvě hodiny obsazené; aplikace s počasím ví, že prší od deseti do jedné. Ani jedna neví, že tato dvě fakta dohromady znamenají, že blok je třeba posunout.",
        "Integrační vrstvou jste vy. Funguje to, dokud nemáte plno práce — což je přesně chvíle, kdy se chránit plány vyplácí nejvíc."
      ]
    },
    {
      "heading": "Dostupná předpověď",
      "body": [
        "Cloud Calendars používá dostupnou předpověď pro vybrané místo. Hodinové a denní údaje mohou pokrývat různá období.",
        "Data, která lze zobrazit v kalendáři, neurčují dosah předpovědi. Měsíční zobrazení neznamená předpověď na celý měsíc ani pro každou událost."
      ]
    }
  ],
  "claims": {
    "price": "Kolik stojí funkce počasí"
  },
  "practical": [
    "Před plánováním podle předpovědi zkontrolujte místo, datum a dostupné hodiny."
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-a-subscription-actually-buys"
  ],
  "updated": "2026-10-21"
},

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google a Outlook v jednom pohledu',
    short: 'Tři účty, jeden pohled',
    description:
      'Život téměř každého je rozdělen mezi osobní kalendář Apple, účet Google a pracovní Exchange. Co se změní, když se octnou v téže mřížce.',
    lede: 'Problém téměř nikdy není v tom, že by některý z těch kalendářů byl špatný. Problém je, že máte tři a týden jeden.',
    commonBelief: 'Že držet práci a soukromí v oddělených aplikacích je hranice, a ne nedostatek.',
    sections: [
      {
        heading: 'Dvojí zadání je strukturální',
        body: [
          'Pokud vaše závazky žijí na třech místech, žádné místo vám nepoví, zda máte volno. Slučovacím krokem jste vy a provádíte jej zpaměti, obvykle zatímco někdo čeká na odpověď.',
          'Proto klasické selhání není zapomenout na událost; je jím souhlas s něčím, co se sráží s událostí, kterou jste nemohli vidět.',
        ],
      },
      {
        heading: 'Co dá jedna mřížka',
        body: [
          'Všechny účty v témž týdnu, obarvené podle původu, upravitelné na místě. Přestanete se ptát, která aplikace má odpověď, protože otázka přestane být v množném čísle.',
          'iCloud a Google se synchronizují v bezplatné verzi. Účty Microsoftu — Outlook a Exchange — spadají do placené, protože to spojení má opakované náklady, jaké ostatní nemají.',
        ],
      },
    ],
    claims: {
      accounts: 'Typů účtů, které se vejdou do jednoho pohledu',
      premiumMonthly: 'Měsíční cena za přidání Microsoftu, v dolarech',
    },
    practical: [
      'Nejprve přidejte osobní účet a teprve pak ten, který způsobuje kolize.',
      'Barvěte podle účtu, ne podle kategorie: na první pohled potřebujete vidět původ.',
      'Dál pište do toho kalendáře, který ostatní už čtou.',
    ],
    seeAlso: ['weather-inside-your-calendar', 'what-a-subscription-actually-buys'],
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
