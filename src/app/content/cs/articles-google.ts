import { LocalisedArticle } from '../types';

/** Šest článků o Googlu: konkrétní otázky, jasné odpovědi. */
export const GOOGLE_CS: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
  "title": "Oprávnění Kalendáře Google: ověřte skutečně udělený přístup",
  "short": "Přístup a soukromí v Kalendáři Google",
  "description": "Zvolte přístup k dostupnosti, podrobnostem nebo úpravám. Před sdílením prověřte veřejný a skupinový přístup i jednotlivá oprávnění.",
  "lede": "Před sdílením kalendáře určete, co má druhý člověk dělat. Plánování podle vaší dostupnosti, čtení podrobností a správa kalendáře jsou různé úkoly. Návod vydává Arte Soft, vývojář Cloud Calendars.",
  "commonBelief": "Omezení jednoho člověka údajně zaručuje, že podrobnosti neuvidí žádnou jinou cestou.",
  "sections": [
    {
      "heading": "Přizpůsobte přístup úkolu",
      "body": [
        "Kolega hledající termín může potřebovat dostupnost bez podrobností schůzek. Spolupracovník udržující projektový plán potřebuje jiné uspořádání. Nejdříve určete úkol a potom zkontrolujte oprávnění v aktuálním nastavení sdílení kalendáře.",
        "Google rozlišuje dostupnost, podrobnosti událostí a několik úrovní úprav. Jedna možnost omezuje přístup k soukromým událostem; jiná umožňuje úpravy a podrobnosti; nejširší také správu sdílení. Neberte všechny možnosti obsahující slovo změny jako rovnocenné."
      ]
    },
    {
      "heading": "Prověřte celý kalendář, nejen jednoho člověka",
      "body": [
        "Kromě jmenovaných lidí zjistěte, zda je kalendář veřejný, dostupný organizaci nebo sdílený skupině. Google uvádí, že širší přístup může mít přednost před užším: omezení jedné osoby nezruší už zveřejněné podrobnosti.",
        "Představte si klubový rozvrh zveřejněný pro členy. Než do něj vložíte osobní schůzku, ověřte jeho publikum. Oprávnění vedle jednoho přítele není jediné důležité nastavení. Soukromé schůzky ukládejte do vhodného kalendáře."
      ]
    },
    {
      "heading": "Použijte nastavení správného kalendáře Google",
      "body": [
        "V Kalendáři Google na počítači najděte daný kalendář, otevřete jeho nabídku a nastavení sdílení. Google popisuje zvlášť osoby či skupiny a širší přístup. Před změnou ověřte název kalendáře a přihlášený účet.",
        "Při pozvání potvrďte zamýšlenou identitu Google příjemce. Pokud kalendář nenajde, prověřte adresu a zprávu s pozvánkou místo rozšíření přístupu jen kvůli zobrazení. Chybějící zobrazení a nedostatečné právo upravovat jsou různé potíže."
      ]
    },
    {
      "heading": "Testujte bez soukromých schůzek",
      "body": [
        "Použijte běžnou testovací událost bez soukromého názvu, poznámek, místa a seznamu hostů. Požádejte příjemce, aby ověřil, co vidí, a pouze pokud jsou úpravy potřebné a povolené, co může změnit. K testu nesdílejte přihlašovací údaje svého účtu.",
        "Poznamenejte si kalendář a udělenou roli a po změně ověřte výsledek. Tím kontrolujete zamýšlené uspořádání, nikoli zmizení dříve přečtených či zkopírovaných informací. Netestujte zveřejněním skutečného pracovního plánu."
      ]
    },
    {
      "heading": "Oddělte pracovní pravidla od tarifů aplikace",
      "body": [
        "Google uvádí, že správci firmy nebo školy mohou sdílení omezit. Není-li potřebné nastavení dostupné, použijte schválený postup organizace. Nezveřejňujte pracovní informace jako obcházení omezení účtu.",
        "Cloud Calendars může zobrazit připojené kalendáře, názvy tarifů ale nemění oprávnění Google. Advanced odstraňuje reklamy; platba nedává jiné osobě přístup ke všem událostem Google. Ověřte sdílení u poskytovatele i přijatý výsledek, nespoléhejte jen na dostupný místní editor."
      ]
    },
    {
      "heading": "Zkontrolujte a odeberte nepotřebný přístup",
      "body": [
        "Po skončení projektu projděte skutečné příjemce, skupiny a širší zveřejnění. Existují-li další cesty přístupu, odebrání jednoho člověka je jen část kontroly. Dohodněte se, kdo plán udržuje a jak se budou řešit další změny přístupu.",
        "Google zvlášť dokumentuje odebrání osob či skupin a vypnutí širšího sdílení. Odebrání přístupu nevrátí exportovaný soubor, snímek obrazovky ani informace zkopírované jinam. Řešte je s dotčenými lidmi samostatně, neslibujte vymazání všech kopií jedním přepínačem."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Určete kalendář a úkol příjemce.",
    "Prověřte individuální, skupinový, organizační a veřejný přístup.",
    "Vyberte oprávnění odpovídající úkolu v aktuálním nastavení Google.",
    "Před změnou ověřte identitu příjemce.",
    "Zkontrolujte neškodnou testovací událost z pohledu příjemce.",
    "Prověřte staré cesty přístupu bez předpokladu, že se předchozí kopie vrátí."
  ],
  "faq": [
    {
      "q": "Má individuální omezení přednost před veřejným kalendářem?",
      "a": "Ne. Google uvádí, že při konfliktu nastavení mají širší oprávnění kalendáře přednost. Zkontrolujte veřejné a organizační nastavení i záznam dané osoby."
    },
    {
      "q": "Zpřístupňují všechny možnosti úprav soukromé události stejně?",
      "a": "Ne. Google popisuje možnost úprav s omezeným přístupem k soukromým událostem odděleně od dalších možností úprav a správy sdílení. Před volbou si přečtěte přesné aktuální oprávnění."
    },
    {
      "q": "Mění zakoupení Advanced práva sdílení Google?",
      "a": "Ne. Advanced odstraňuje reklamy v Cloud Calendars. Přístup u poskytovatele závisí na oprávněních kalendáře a omezeních organizace."
    }
  ],
  "sourcesHeading": "Aktuální pokyny Google k oprávněním a sdílení",
  "sources": [
    {
      "label": "Google: výběr oprávnění kalendáře",
      "url": "https://support.google.com/calendar/answer/15716974?hl=en"
    },
    {
      "label": "Google: sdílení kalendáře a odebrání přístupu",
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
    "title": "Někdo vám nasdílel kalendář a on tam není",
    "short": "Sdílený kalendář se neobjeví",
    "description": "Chybí sdílený kalendář Google? Ověřte pozvaný účet, skupinu, viditelnost a typ přijatého odkazu.",
    "lede": "Tento průvodce připravila Arte Soft, vývojář Cloud Calendars. Nejdříve odlište chybějící přístup od kalendáře, který je pouze skrytý.",
    "commonBelief": "Že přijetí sdíleného kalendáře ho dostane do telefonu.",
    "sections": [
      {
        "heading": "Ověřte účet a skupinu",
        "body": [
          "Porovnejte adresáta pozvánky s účtem Google v telefonu a prohlížeči. Otevřete odkaz z pozvánky pod správným účtem. Google podporuje sdílení s lidmi i Skupinami Google. Při přístupu přes skupinu požádejte jejího správce o ověření členství a vlastníka kalendáře o kontrolu oprávnění správné skupiny. Přeposlaný e-mail sám o sobě přístup neuděluje."
        ]
      },
      {
        "heading": "Skrytý, chybějící, nebo omezený?",
        "body": [
          "V Kalendáři Google na iPhonu či iPadu otevřete nabídku. Pokud je kalendář v seznamu nezaškrtnutý, vyberte jej. Jestliže chybí, požádejte vlastníka o kontrolu přístupu: žádost není schválení. Pravidla zaměstnavatele či školy mohou sdílení omezit. Porovnejte stejný účet ve webovém Kalendáři Google. Pokud tam funguje, zkontrolujte připojený účet a výběr kalendářů v druhé aplikaci. Přístup jen pro čtení nedovoluje úpravy."
        ]
      },
      {
        "heading": "Rozpoznejte typ odkazu",
        "body": [
          "I pozvánka ke sdílení obsahuje odkaz; ne každý odkaz je odběr ICS. Zeptejte se, zda uděluje přístup ke kalendáři Google, nebo zveřejňuje kanál jen pro čtení. Podle Googlu vyžaduje nový odběr kalendáře prohlížeč na počítači; otevření kalendáře již sdíleného e-mailem je jiná operace. Aktualizace kanálu závisí na přijímající službě. Univerzální čekací doba neexistuje; naléhavé změny ověřte u organizátora."
        ]
      }
    ],
    "claims": {},
    "faq": [
      {
        "q": "Může Skupina Google získat přístup?",
        "a": "Ano. Ověřte vybranou skupinu, své členství a pravidla organizace. Přeposlaný skupinový e-mail není dokladem přístupu."
      },
      {
        "q": "Mám účet odstranit a znovu připojit?",
        "a": "Nejdříve ověřte účet, práva a viditelnost a porovnejte webový kalendář. Opětovné připojení chybějící práva neudělí."
      }
    ],
    "practical": [
      "Potvrďte pozvaný účet a členství ve skupině.",
      "Vyberte kalendář, pokud je v seznamu skrytý.",
      "Před změnou připojení požádejte vlastníka o kontrolu přístupu."
    ],
    "sourcesHeading": "Zdroje a další informace",
    "sources": [
      {
        "label": "Google: Ověřte účet a skupinu",
        "url": "https://support.google.com/calendar/answer/37082?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Skrytý, chybějící, nebo omezený?",
        "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Rozpoznejte typ odkazu",
        "url": "https://support.google.com/calendar/answer/37648?hl=en"
      }
    ],
    "seeAlso": [
      "who-can-see-what-in-google-calendar",
      "google-calendars-that-never-reach-your-iphone"
    ]
  },

  'the-secret-address-of-a-google-calendar': {
    title: 'Co tajná adresa kalendáře Google ve skutečnosti prozradí',
    short: 'Tajná adresa iCal',
    description:
      'Google nabízí soukromou adresu, která ukáže celý váš kalendář komukoli, kdo ji má. Co odhalí a proč se nedá potichu vzít zpět.',
    lede: 'V nastavení každého kalendáře Google se skrývá odkaz, který ukazuje všechno, co v něm je. Bez přihlášení, bez oprávnění, bez záznamu, kdo ho otevřel.',
    commonBelief: 'Že soukromá adresa je soukromá, protože se těžko hledá.',
    sections: [
      {
        heading: 'Odkaz je heslo, které nejde změnit jen jednomu člověku',
        body: [
          'Tajná adresa nese plné podrobnosti — názvy, časy, místa, poznámky. Vidí je každý, kdo má odkaz, a neexistuje seznam, kdo to je.',
          'Její jedinou ochranou je náhodná část adresy. Proti hádání chrání doopravdy, proti přeposlání, sdílené obrazovce nebo dokumentu, který přežije vaši práci, vůbec.',
        ],
      },
      {
        heading: 'Resetování ji rozbije všem',
        body: [
          'Adresu můžete resetovat a stará zemře. Zemře i každému kolegovi, každému přehledu a každému skriptu, který se o ni potichu opíral, bez jakéhokoli varování.',
          'To je důvod, proč adresu kalendáře, ve kterém žijete, nikdy nerozdávat. Zveřejněte kalendář založený přesně k tomu a reset vás nic nestojí.',
        ],
      },
    ],
    claims: {
      linkLength: 'Náhodné znaky, které chrání náš odkaz na sdílení',
      sharePrice: 'Kolik stojí sdílení jedné události z aplikace',
    },
    faq: [
      {
        q: 'Co může někdo udělat s tajnou adresou mého kalendáře?',
        a: 'Vidět všechno, co v něm je — názvy, časy, místa i poznámky — bez přihlášení, bez oprávnění a bez jediné stopy, že se díval.',
      },
      {
        q: 'Dá se tajná adresa kalendáře vzít zpět?',
        a: 'Jen resetem, který zabije starou adresu všem naráz: kolegům, přehledům i každému skriptu, který se o ni potichu opíral, bez varování.',
      },
      {
        q: 'Můžu tajnou adresu poslat kolegovi e-mailem?',
        a: 'Berte ji jako veřejnou od chvíle, kdy opustí vaše ruce. Její jedinou ochranou je, že se těžko hádá, a přeposlání přesně tohle ruší.',
      },
    ],
    practical: [
      'Berte tajnou adresu jako veřejnou od chvíle, kdy opustí vaše ruce.',
      'Nikdy nezveřejňujte adresu kalendáře, který skutečně používáte.',
      'Resetujte ji, když někdo odchází, a řekněte to těm, komu tím přestane fungovat.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'taking-back-a-calendar-you-shared'],
  },

  'what-guests-can-do-to-your-event': {
    title: 'Co mohou hosté udělat s vaší událostí',
    short: 'Oprávnění hostů',
    description:
      'Tři zaškrtávátka rozhodují, jestli host může posunout vaši schůzku, pozvat cizí lidi nebo přečíst celý seznam. Bývají zapnutá častěji, než se čeká.',
    lede: 'Pozvat někoho znamená dát mu víc než místo a čas. V běžné události Google host obvykle vidí, koho jste ještě pozvali, a často smí přidat další.',
    commonBelief: 'Že host může jen přijmout, nebo odmítnout.',
    sections: [
      {
        heading: 'Tři zaškrtávátka',
        body: [
          'Upravit událost dovolí hostovi změnit čas, místo a název všem. Chce se to zřídka a nechává se to zapnuté snadno.',
          'Pozvat další mu dovolí přidat lidi, které jste nikdy nepotkali. Zobrazit seznam hostů ukáže všechny pozvané i jejich odpovědi — v týmu v pořádku, u klienta trapné, u čehokoli, co připomíná skupinu oddělených zákazníků, špatně.',
        ],
      },
      {
        heading: 'Kde se to potichu pokazí',
        body: [
          'Jedna událost, mnoho jednotlivých příjemců, viditelný seznam: teď má každý všechny. Vypnutí jednoho zaškrtávátka je rozdíl mezi schůzkou a uniklým adresářem.',
          'Nastavení žijí v události, ne v účtu, takže se pokaždé vrátí k vašim výchozím hodnotám a je třeba na ně myslet u událostí, na kterých záleží, ne jednou provždy.',
        ],
      },
    ],
    claims: {
      sharePrice: 'Kolik stojí odeslání jedné události z aplikace',
    },
    faq: [
      {
        q: 'Vidí hosté jeden druhého v pozvánce z Kalendáře Google?',
        a: 'Ve výchozím stavu většinou ano. „Zobrazit seznam hostů“ ukáže všechny pozvané i jejich odpovědi: v týmu v pořádku, u klienta trapné a u oddělených zákazníků prostě špatně.',
      },
      {
        q: 'Může host změnit čas mé schůzky?',
        a: 'Pokud je zaškrtnuté „upravit událost“, ano, a změna platí všem. Chce se to zřídka a zapnuté zůstává snadno.',
      },
      {
        q: 'Jak zabráním hostům zvát další lidi?',
        a: 'Vypněte „pozvat další“ přímo v události. Tato nastavení patří události, ne účtu, takže se pokaždé vracejí k vašim výchozím hodnotám.',
      },
    ],
    practical: [
      'U všeho, co jde lidem, kteří se navzájem neznají, vypněte „zobrazit seznam hostů“.',
      '„Upravit událost“ nechte vypnuté, ledaže za vás někdo opravdu plánuje.',
      'Zaškrtávátka kontrolujte v události, ne v nastavení: bydlí tam.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'why-a-shared-calendar-does-not-appear'],
  },

  'google-calendars-that-never-reach-your-iphone': {
    title: 'Proč se některé kalendáře Google nikdy nedostanou do iPhonu',
    short: 'Kalendáře Google chybějí na iPhonu',
    description:
      'Jeden účet Google, několik kalendářů a v telefonu jen jeden. Seznam synchronizace, který o tom rozhoduje, a co dělat místo toho.',
    lede: 'Váš účet Google drží osm kalendářů. iPhone ukazuje dva. Nic není rozbité: něco, co jste nikdy neviděli, rozhodlo za vás.',
    commonBelief: 'Že přidání účtu Google do iPhonu přidá kalendáře, které obsahuje.',
    sections: [
      {
        heading: 'Seznam, který vám nikdo neukázal',
        body: [
          'Google vede pro každé zařízení seznam, které kalendáře se smějí synchronizovat, a druhotné kalendáře — sdílené, odebírané, založené kvůli projektu — bývají mimo něj.',
          'Ten seznam není v nastavení iOS. Žije na vlastní stránce Googlu, a proto hledání na zřejmém místě nic špatného nenajde a nic nezmění.',
        ],
      },
      {
        heading: 'Druhá cesta',
        body: [
          'Aplikace, která mluví s Googlem přímo, ten seznam nepoužívá, takže ukáže každý kalendář, který účet opravdu má, včetně těch, které telefon potichu zahodil.',
          'Zároveň to sblíží účty. Jeden pohled s osobním, pracovním i sdíleným je celý smysl; jestli by telefon každý z nich zesynchronizoval, přestane být otázkou.',
        ],
      },
    ],
    claims: {
      accounts: 'Typy účtů, které jeden pohled drží pohromadě',
      price: 'Kolik stojí strana Googlu',
    },
    faq: [
      {
        q: 'Proč se na iPhonu ukazuje jen část mých kalendářů Google?',
        a: 'Google vede pro každé zařízení seznam kalendářů, které se smějí synchronizovat, a druhotné — sdílené, odebírané, založené kvůli projektu — bývají mimo něj.',
      },
      {
        q: 'Kde je nastavení synchronizace Kalendáře Google pro iPhone?',
        a: 'Není v nastavení iOS. Žije na vlastní stránce Googlu, a proto hledání na zřejmém místě nic nenajde a nic nezmění.',
      },
      {
        q: 'Jak uvidím na iPhonu všechny kalendáře Google?',
        a: 'Přes aplikaci, která se ptá Googlu přímo, místo přes seznam zařízení. Ukáže každý kalendář, který účet opravdu má, včetně těch, které telefon zahodil.',
      },
    ],
    practical: [
      'Než prohlásíte účet za rozbitý, zkontrolujte seznam synchronizace Googlu.',
      'Počítejte s tím, že odebírané a sdílené kalendáře jsou vyloučené, ne zahrnuté.',
      'Držíte-li víc než dva kalendáře, čtěte je něčím, co se ptá Googlu přímo.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'icloud-google-and-outlook-in-one-view'],
  },

  'taking-back-a-calendar-you-shared': {
  "title": "Přestat sdílet kalendář: odeberte přístup a prověřte ostatní cesty",
  "short": "Zkontrolujte a odeberte sdílený přístup",
  "description": "Ukončete sdílení s rozlišením osob, skupin, veřejného přístupu a odběrových odkazů. Ověřte změnu a zjistěte, proč uložené kopie mohou zůstat.",
  "lede": "Ukončení spolupráce začíná zjištěním, jak byl přístup udělen. Odebrání osoby, vypnutí zveřejnění a obnovení adresy odběru jsou různé kroky. Tento průvodce vydává Arte Soft, vývojář Cloud Calendars.",
  "commonBelief": "Odebrání jednoho příjemce okamžitě stáhne všechny kopie kalendáře a uzavře všechny ostatní cesty k rozvrhu.",
  "sections": [
    {
      "heading": "Určete kalendář a způsob sdílení",
      "body": [
        "Před změnou přístupu ověřte účet vlastníka, kalendář a zamýšlené publikum. Kalendář Google sdílený s konkrétním kolegou se liší od veřejného kalendáře, oprávnění skupiny nebo adresy odběru. Cloud Calendars má také vlastní vztahy sdílení událostí a kalendářů.",
        "Například tajemník klubu může získat právo upravovat prostřednictvím osobní pozvánky, zatímco členové sledují zveřejněný rozvrh. Odebrání tajemníkova osobního oprávnění neurčuje, co se má stát s odběry členů. Sepište způsoby sdílení, které jste skutečně nastavili."
      ]
    },
    {
      "heading": "Odeberte příslušné oprávnění Google",
      "body": [
        "Google popisuje oddělené ovládací prvky pro konkrétní osoby či skupiny, sdílení v celé organizaci a veřejnou dostupnost. Na počítači otevřete nastavení sdílení daného kalendáře a změňte příslušnou položku nebo širší nastavení. Nejdříve zkontrolujte přihlášený účet a název kalendáře.",
        "Osoba může mít nadále přístup jinou cestou, například přes skupinu nebo širší zveřejnění. Prověřte celé uspořádání, místo abyste opakovaně odebírali jednu e-mailovou adresu. Pravidla práce či školy mohou dostupné možnosti omezovat; v případě potřeby postupujte podle schváleného postupu vlastníka nebo správce."
      ]
    },
    {
      "heading": "S tajnou adresou kalendáře zacházejte samostatně",
      "body": [
        "Google uvádí, že tajná adresa iCal slouží k vašemu vlastnímu použití v jiné kalendářové aplikaci a nemá se dávat dalším lidem. Pokud byla prozrazena, Google popisuje její obnovení, které zneplatní starou adresu. Jde o jiný krok než odebrání konkrétní osoby.",
        "Než změníte adresu odběru, kterou sami používáte, zjistěte, které kalendářové programy či nástroje na ní závisejí, abyste je poté mohli znovu připojit. Nevkládejte tajnou URL do veřejného dotazu na podporu ani ji neposílejte jako důkaz nalezení správného kalendáře. Uveďte raději název kalendáře a typ připojení."
      ]
    },
    {
      "heading": "Rozlišujte příjemce Cloud Calendars a odkazy na odběr",
      "body": [
        "V Cloud Calendars jsou přístup příjemce k události či kalendáři a vydaný odběrový kanál různé mechanismy. Před volbou kroku prověřte skutečný vztah sdílení i příslušný odkaz. Odebrání konkrétního příjemce není obecným příslibem stažení všech dříve rozeslaných URL či nezávislých kopií.",
        "Pokud spoluorganizátor pouze nemá dále upravovat, zvažte zamýšlenou roli a zbývající publikum místo smazání sdíleného rozvrhu. Končí-li celá spolupráce, ujasněte si, kdo kalendář vlastní a kdo si jej má ponechat. Opuštění přijatého kalendáře a smazání vlastního kalendáře jsou odlišná rozhodnutí."
      ]
    },
    {
      "heading": "Ověřte výsledek bez slibu okamžitého zmizení",
      "body": [
        "Ověřte, že zamýšlená změna je uložena v systému vlastníka. Může-li pomoci oprávněný kolega, potvrďte příslušný výsledek zobrazení či úprav z jeho vlastního účtu bez sdílení hesel. Rozlišujte odepření přístupu od staré události stále viditelné v mezipaměti či importované kopii.",
        "Neslibujte univerzální interval obnovení ani to, že nebude odesláno oznámení. Při předávání skupině sdělte, který rozvrh se má odteď používat. Viditelný starý záznam sám neukazuje, zda má osoba stále živý přístup, jiné oprávnění nebo samostatnou kopii."
      ]
    },
    {
      "heading": "Starší kopie řešte jako samostatný navazující úkol",
      "body": [
        "Dříve exportované soubory, snímky obrazovky, zprávy a samostatně uložené schůzky mohou po změně přístupu zůstat. Určete, které kopie jsou pro předání důležité, a jejich řešení proberte se zúčastněnými. Změna oprávnění kalendáře nemůže určit, co si každý příjemce již uložil.",
        "Při kontrole výsledku zachovejte potřebné zdrojové záznamy. Nepřesouvejte citlivé schůzky do jiného sdíleného kalendáře jen proto, aby starý vypadal prázdný, ani nerušte skutečné pozvánky jako test přístupu. Zaznamenejte kalendář, cestu přístupu a provedenou změnu pro jasný výchozí bod při budoucím řešení potíží."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Určete účet vlastníka, kalendář a způsob sdílení.",
    "Samostatně prověřte konkrétní osoby, skupiny a širší zveřejnění.",
    "Použijte příslušné nastavení sdílení Google nebo Cloud Calendars.",
    "O obnovení prozrazené tajné adresy odběru rozhodněte samostatně.",
    "Ověřte uložený výsledek bez sdílení přihlašovacích údajů.",
    "Starší exporty a kopie plánujte odděleně od živého přístupu."
  ],
  "faq": [
    {
      "q": "Vypne odebrání jedné osoby veřejný kalendář nebo její skupinový přístup?",
      "a": "Nepředpokládejte to. Prověřte každou skutečnou cestu. Google popisuje konkrétní příjemce, skupiny a širší zveřejnění jako samostatná nastavení."
    },
    {
      "q": "Zmizí kalendář okamžitě a bez oznámení?",
      "a": "Pro zmizení, oznámení ani dobu obnovení zde neexistuje univerzální příslib. Potvrďte uloženou změnu přístupu a odlište živý přístup od informací v mezipaměti či importovaných dat."
    },
    {
      "q": "Kupuje Advanced možnost odebrat přístup ke kalendáři Google?",
      "a": "Advanced odstraňuje reklamy v Cloud Calendars. Nastavení sdílení Google závisí na vlastnictví, oprávněních a pravidlech organizace, nikoli na tomto tarifu aplikace."
    }
  ],
  "sourcesHeading": "Pokyny poskytovatele k přístupu a odběrům",
  "sources": [
    {
      "label": "Google: nastavení sdílení a ukončení přístupu",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Google: synchronizace účtů a tajné adresy iCal",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "the-secret-address-of-a-google-calendar"
  ],
  "updated": "2026-10-21"
},
};
