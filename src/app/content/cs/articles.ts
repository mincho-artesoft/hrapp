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
    title: 'Sdílet jednu událost, ne svůj kalendář',
    short: 'Sdílet jednu událost',
    description:
      'Jak funguje odeslání jediné události, co druhá strana skutečně dostane a proč si nemusí nic instalovat, aby to viděla.',
    lede: 'Sdílet kalendář bývá všechno, nebo nic: buď má někdo přístup k tomu vašemu, nebo nemá. Poslat večeři by nemělo vyžadovat ani jedno.',
    commonBelief: 'Že sdílet událost znamená dát někomu okno do zbytku vašeho týdne.',
    sections: [
      {
        heading: 'Co se doopravdy odesílá',
        body: [
          'Při vytváření události vám aplikace nabídne ji sdílet. Cestuje odkaz — e-mailem, zprávou, tím, co má druhá strana nainstalované — a za tím odkazem stojí kalendářový kanál obsahující tuto jednu událost a nic dalšího.',
          'Není to snímek obrazovky ani kopie, která stárne. Změní-li se čas, změní se s ním i kanál, a ten, komu jste jej poslali, změnu uvidí, aniž byste cokoli posílali znovu.',
        ],
      },
      {
        heading: 'Co to není',
        body: [
          'Odkaz je běžné kalendářové předplatné: čte jej Kalendář Apple, čte jej Kalendář Google, čte jej Outlook. Ve zprávě je i App Clip pro toho, kdo aplikaci chce — otevře se bez instalace. Jsou to dveře, ne mýtná brána.',
          'Není okamžitý: kanál žádá aplikace, aby se každou hodinu podívaly znovu, a to je žádost, ne pravidlo. Není ani tajný: odkaz nese dvaadvacet náhodných znaků, které nikdo neuhodne, ale kdo jej má, může číst. A zatím je jen pro čtení.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Hodin mezi žádostmi o obnovení kanálu',
      linkLength: 'Náhodných znaků v odkazu, což je to, co jej činí neuhodnutelným',
      sharePrice: 'Kolik stojí sdílení',
    },
    practical: [
      'Sdílejte přímo z události, hned po jejím vytvoření.',
      'Pošlete odkaz kanálem, který s tím člověkem už používáte.',
      'Mění-li se čas na poslední chvíli, napište kromě toho, že událost posunete.',
      'Odvolejte odkaz, až událost skončí, tak jako byste přestali sdílet dokument.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'weather-inside-your-calendar'],
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
