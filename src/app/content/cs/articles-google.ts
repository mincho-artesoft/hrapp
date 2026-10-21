import { LocalisedArticle } from '../types';

/** Šest článků o Googlu: konkrétní otázky, jasné odpovědi. */
export const GOOGLE_CS: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
    title: 'Kdo co uvidí, když sdílíte kalendář Google',
    short: 'Oprávnění sdílení v Googlu',
    description:
      'Úrovně sdílení v Googlu se nastaví rychle a snadno se pochopí špatně. Co každá z nich ve skutečnosti odhalí, řečeno přímo.',
    lede: 'Většina nechtěného přesdílení není chyba úsudku. Někdo zvolil úroveň, která zněla skromně, a skromná nebyla.',
    commonBelief: 'Že „jen volno/obsazeno“ a „všechny podrobnosti události“ se liší málo.',
    sections: [
      {
        heading: 'Úrovně jsou dál od sebe, než zní',
        body: [
          'Volno/obsazeno ukazuje bloky času bez názvů. Všechny podrobnosti ukazují názvy, místa, poznámky a hosty — u většiny kalendářů tedy pořádný kus vašeho života.',
          'Provádět změny dovoluje upravovat. Spravovat sdílení dovoluje předat váš kalendář dalším lidem, a právě tohle překvapí později.',
        ],
      },
      {
        heading: 'Vybírat bez přemýšlení pokaždé znovu',
        body: [
          'Kolegům, kteří mají jen plánovat kolem vás, téměř vždy stačí volno/obsazeno — a téměř nikdy ho nedostanou.',
          'Plné podrobnosti nechte kalendářům založeným kvůli sdílení, ne tomu, ve kterém žijete.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Měsíční cena úrovně, kde se tohle spravuje v aplikaci, v dolarech',
    },
    faq: [
      {
        q: 'Uvidí někdo názvy mých událostí, když sdílím jen volno/obsazeno?',
        a: 'Ne. Volno/obsazeno ukazuje bloky času bez názvů, míst, poznámek i hostů. Teprve „všechny podrobnosti“ je odhalí — a odhalí je všechny.',
      },
      {
        q: 'Co dovoluje „provádět změny a spravovat sdílení“?',
        a: 'Upravovat každou událost a předat váš kalendář dalším lidem, aniž by se vás někdo zeptal. Je to jediná úroveň, na které přístup rozdává někdo jiný než vy.',
      },
      {
        q: 'Můžu si ověřit, kdo už má k mému kalendáři přístup?',
        a: 'Ano, v nastavení sdílení daného kalendáře. Nic vás k tomu nevybízí a sdílení se jen hromadí: přečtěte si seznam dvakrát do roka.',
      },
    ],
    practical: [
      'Ve výchozím stavu volno/obsazeno pro každého, kdo si u vás má jen rezervovat čas.',
      '„Provádět změny“ nechte lidem, kteří za vás skutečně plánují.',
      'Dvakrát ročně projděte, kdo má přístup; sdílení se hromadí a nic vám to nepřipomene.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'what-guests-can-do-to-your-event'],
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
    title: 'Vzít zpět kalendář, který jste nasdíleli',
    short: 'Odebrání přístupu',
    description:
      'Odebrat někoho z kalendáře zastaví to, co teprve přijde. Nezruší to, co se už stalo.',
    lede: 'Ukončit přístup je jedno klepnutí. Rozhodnout, jestli jedno klepnutí stačí, trvá o něco déle, protože sdílení po sobě nechává kopie.',
    commonBelief: 'Že odebrání člověka odebere i to, co viděl.',
    sections: [
      {
        heading: 'Co skončí a co zůstane',
        body: [
          'Odeberte člověka a kalendář zmizí z jeho seznamu okamžitě a beze zprávy. Budoucí události se k němu nikdy nedostanou.',
          'Co se nevrátí: pozvánky, které už má, události zkopírované do vlastního kalendáře, cokoli vyexportovaného a všechno, k čemu dostal tajnou adresu. Přístup končí; paměť ne.',
        ],
      },
      {
        heading: 'To, co odebrání přežije',
        body: [
          'Pokud někdo někdy směl spravovat sdílení, mohl přidat další lidi. Odebrání jeho je nechá na místě — a tak skončí kalendář sdílený s někým, koho si nikdo nepamatuje pozvat.',
          'Čtěte proto celý seznam, místo abyste škrtli jedno jméno, a udělejte to při odchodu, ne po měsících. Nic vám to nepřipomene a sdílení se jen hromadí.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Měsíční cena úrovně, kde se tohle spravuje, v dolarech',
    },
    faq: [
      {
        q: 'Smaže odebrání člověka to, co už viděl?',
        a: 'Ne. Pozvánky, které už má, události zkopírované do vlastního kalendáře i cokoli vyexportovaného zůstanou. Přístup končí, kopie ne.',
      },
      {
        q: 'Dozví se ten člověk, že jsem mu přístup odebral?',
        a: 'Ne. Kalendář mu ze seznamu zmizí okamžitě a beze zprávy.',
      },
      {
        q: 'Proč je můj kalendář sdílený s někým, koho jsem nikdy nepozval?',
        a: 'Přidal ho někdo, kdo směl spravovat sdílení. Odebrání té osoby nechá všechny jí přidané na místě — proto se čte celý seznam, ne jedno jméno.',
      },
    ],
    practical: [
      'Přečtěte celý seznam přístupů, ne jen jméno, které jste chtěli odebrat.',
      'Resetujte tajnou adresu, pokud ji ten člověk někdy měl.',
      'Počítejte s tím, že kopie přežijí: opravdu citlivé přesuňte, místo abyste to skrývali.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
