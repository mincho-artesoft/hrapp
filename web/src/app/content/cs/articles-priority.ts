import type { LocalisedArticle } from '../types';

export const PRIORITY_CS: Readonly<Record<string, LocalisedArticle>> = {
  "forecast-beside-every-event": {
    "title": "Zkontrolujte hodinové počasí pro událost v kalendáři na iPhone a iPadu",
    "short": "Počasí pro dobu konání události",
    "description": "Porovnejte místo, datum a hodiny své události s dostupnou předpovědí počasí.",
    "lede": "Chcete-li zkontrolovat počasí pro událost v kalendáři, porovnejte tři věci: místo konání, jeho místní datum a období od začátku do konce události. V Cloud Calendars vyberte místo počasí a zkontrolujte dostupné hodiny. Adresa události ani blízká ikona počasí samy o sobě nedokazují, že se tyto údaje shodují. Tento průvodce vydává Arte Soft, vývojář aplikace.",
    "commonBelief": "Že denní ikona počasí v kalendáři je totéž jako předpověď přiřazená ke konkrétní události.",
    "sections": [
      {
        "heading": "Začněte místem a datem",
        "body": [
          "Otevřete předpověď pro zamýšlené místo a porovnejte její datum se záznamem v kalendáři. Počasí v kalendáři může odrážet vybrané místo počasí, proto ověřte, že odpovídá dané události, a nepředpokládejte, že je řízeno adresou události.",
          "Událost na příští měsíc může existovat ještě předtím, než jsou pro dané datum dostupná meteorologická data. Událost ponechte a k předpovědi se vraťte blíže k jejímu datu; chybějící údaj o počasí neznamená předpověď jasného počasí."
        ]
      },
      {
        "heading": "Pro hodinový dotaz použijte hodinové podrobnosti",
        "body": [
          "Denní souhrn a hodinová předpověď odpovídají na různé otázky. Pokud událost trvá od dvou do pěti, zkontrolujte dostupné hodiny pokrývající tento interval, místo abyste jednu denní ikonu považovali za úplný obraz.",
          "Pokud je k dispozici jen část intervalu, ponechte zbytek jako nevyřešený. Aplikace neslibuje úplné hodinové údaje o počasí pro každou událost, kterou můžete vytvořit, a tento návod neslibuje, že otevření jakékoli události vždy zobrazí celé její časové okno počasí."
        ]
      },
      {
        "heading": "Rozlišujte pravděpodobnost, množství a načasování",
        "body": [
          "Přečtěte si popisek hodnoty, kterou kontrolujete. Pravděpodobnost srážek není množství ani délka trvání deště. Stejně tak hodinová hodnota a denní souhrn pokrývají různá období; při porovnávání dvou možných časů srovnávejte stejné intervaly.",
          "Zvolte záložní variantu vhodnou pro svůj plán, místo abyste jedno procento brali jako univerzální pravidlo pro konání či zrušení. Informace o počasí se mohou měnit, proto je zkontrolujte znovu, když nastane čas rozhodnutí."
        ]
      },
      {
        "heading": "Před uložením události založené na počasí vše zkontrolujte",
        "body": [
          "Aplikace může založit návrh události z hodiny v předpovědi. Před uložením zkontrolujte datum, začátek, konec a cílový kalendář návrhu. Výběr z předpovědi nenahrazuje ověření, že vytváříte správný závazek.",
          "Pokud uložení brání přístup ke kalendáři nebo cílový kalendář, vyřešte toto oprávnění odděleně od přístupu k počasí. Nalezení předpovědi vám nedává práva k úpravám sdíleného kalendáře."
        ]
      },
      {
        "heading": "Když souhrn nestačí, použijte úplnou předpověď",
        "body": [
          "Pro venkovní aktivitu zkontrolujte proměnné relevantní pro tuto aktivitu a pro místo, které jste skutečně vybrali. Widget aktuálního počasí ani ukázka na domovské stránce nenahrazují kontrolu dostupných hodin předpovědi v aplikaci.",
          "Pokud si všimnete nesrovnalosti, nejprve porovnejte místo a časové razítko. Různí poskytovatelé, vybraná místa a období předpovědi mohou vést k odlišnému zobrazení, aniž by to dokazovalo, že se událost v kalendáři změnila."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Potvrďte místo a datum události.",
      "Zkontrolujte dostupné hodiny v průběhu celé aktivity.",
      "Čtěte pravděpodobnost a množství jako různé hodnoty.",
      "Před uložením zkontrolujte návrh události."
    ],
    "seeAlso": [
      "weather-inside-your-calendar",
      "planning-outdoors-without-being-rained-on"
    ],
    "updated": "2026-10-23",
    "faq": [
      {
        "q": "Má každá událost úplnou předpověď?",
        "a": "Ne. Pokrytí závisí na vybraném místě a na dostupných datech a hodinách."
      },
      {
        "q": "Je ikona počasí specifická pro adresu události?",
        "a": "Nevyvozujte to z její blízkosti k události. Místo pro počasí ověřte samostatně."
      },
      {
        "q": "Uloží klepnutí na hodinu novou událost?",
        "a": "Kde je to k dispozici, spustí návrh události. Před uložením zkontrolujte datum, čas a kalendář."
      }
    ],
    "sourcesHeading": "Zdroje počasí a nastavení polohy",
    "sources": [
      {
        "label": "Apple: předpovědi WeatherKit a regionální dostupnost",
        "url": "https://developer.apple.com/weatherkit/"
      },
      {
        "label": "Apple: Soukromí a polohové služby",
        "url": "https://support.apple.com/en-us/102515"
      }
    ],
    "comparison": {
      "heading": "Praktická kontrola před venkovní událostí",
      "columns": [
        "Kontrola",
        "Příklad",
        "Rozhodnutí"
      ],
      "rows": [
        {
          "cells": [
            "Místo",
            "Událost je v jiném městě.",
            "Vyberte tento cíl v zobrazení počasí a přečtěte si jeho název."
          ]
        },
        {
          "cells": [
            "Období",
            "Aktivita trvá od 14:00 do 16:00.",
            "Zkontrolujte obě hodiny i relevantní přípravu nebo cestu."
          ]
        },
        {
          "cells": [
            "Pokrytí",
            "K dispozici jsou jen některé z potřebných hodin.",
            "Ponechte plán předběžný a domluvte další kontrolu."
          ]
        },
        {
          "cells": [
            "Uložená událost",
            "Spustíte koncept z hodiny počasí.",
            "Před uložením zkontrolujte datum, časové pásmo, délku a cílový kalendář."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-right",
      "week-left"
    ],
    "galleryCaption": "Zobrazení počasí a týdne ukazují různé části stejného plánovacího úkolu. Místo předpovědi potvrďte odděleně od místa události.",
    "actionHeading": "Porovnejte předpověď se svými skutečnými událostmi",
    "actionText": "Použijte Cloud Calendars na iPhone nebo iPadu ke kontrole dostupné předpovědi a svého rozvrhu. Počasí pomáhá při rozhodování; nepřesune automaticky událost ani nepotvrdí změnu s účastníky.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Pochopte zobrazení kalendáře a počasí"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Vyberte rychlý přehled na ploše"
      },
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Zkontrolujte kalendáře za svým rozvrhem"
      }
    ]
  },
  "the-widget-that-shows-what-is-next": {
    "updated": "2026-10-23",
    "title": "Widgety kalendáře na iPhone a iPadu: nadcházející události a počasí",
    "short": "Nadcházející události na ploše",
    "description": "Vyberte si widget Cloud Calendars pro nadcházející události, datum nebo počasí.",
    "lede": "Zvolte Calendar Events nebo Calendar Events Large, když chcete na ploše vidět nadcházející události. Zvolte Calendar & Weather pro zobrazení data a počasí. Tato rozložení odpovídají na různé otázky; před přidáním si prohlédněte náhled varianty dostupné na svém zařízení. Tento průvodce vydává Arte Soft, vývojář Cloud Calendars.",
    "sections": [
      {
        "heading": "Nejprve zvolte rozvržení událostí",
        "body": [
          "V galerii widgetů Cloud Calendars je Calendar Events středně velké rozvržení se seznamem událostí. Calendar Events Large nabízí více místa pro nadcházející události. Calendar & Weather je samostatné rozvržení s datem a počasím; jeho malá velikost nezaručuje řádek s příští událostí. Názvy se na vašem zařízení mohou zobrazovat přeložené.",
          "Na iPhone podržte prázdné místo na ploše, zvolte Upravit a Přidat widget, potom najděte Cloud Calendars a vyberte požadované rozvržení. Před přidáním porovnejte náhled. Pokyny Apple k widgetům se týkají této systémové galerie; ta je oddělená od zobrazení kalendáře uvnitř aplikace."
        ]
      },
      {
        "heading": "Přidejte a zkontrolujte widget na iPad",
        "body": [
          "Na iPad použijte galerii widgetů Apple na ploše: podržte pozadí, otevřete Upravit a potom Přidat widget. Vyhledejte Cloud Calendars, prohlédněte nabízené styly a velikosti, přidejte potřebné rozvržení, umístěte ho a dokončete klepnutím na Hotovo. Postupujte podle ovládacích prvků zobrazených ve vaší verzi iPadOS; náhled nepotvrzuje, že se data kalendáře už načetla.",
          "Pokud potřebujete události, zvolte Calendar Events nebo Calendar Events Large. Porovnejte styly, které nabízí nainstalovaná aplikace; dlaždice s datem a počasím odpovídá na jinou otázku než seznam událostí.",
          "Otevřete na tom iPadu Cloud Calendars a v některém vybraném kalendáři najděte známou budoucí událost s časem. Správné zobrazení na vašem iPhone nepotvrzuje účty, přístup ani načtená data na iPadu. Porovnejte název, datum a čas začátku, a pokud se widget liší, pokračujte níže kontrolou podmínek a aktualizací."
        ]
      },
      {
        "heading": "Zkontrolujte, co se počítá jako nadcházející",
        "body": [
          "Zobrazení událostí používá vybrané kalendáře a budoucí události s časem. Celodenní položky a události, jejichž čas začátku už uplynul, jsou z tohoto přehledu nadcházejících položek vyloučeny. Narozeniny nebo právě probíhající schůzka tak mohou být v aplikaci viditelné, ale zde se neobjeví.",
          "Například pokud je vaší jedinou dnešní položkou celodenní označení cesty, prázdný seznam nadcházejících položek neznamená, že se tato položka ztratila. Otevřete aplikaci a zkontrolujte celý den. Stejně tak další časovaná událost může být až zítra nebo později; přečtěte si její datum, místo abyste předpokládali, že každý řádek patří dnešku."
        ]
      },
      {
        "heading": "Odlište chybějící událost od seznamu, kterému došly řádky",
        "body": [
          "Widget zobrazuje jen omezený počet nadcházejících událostí. Pokud jeho řádky zaplní dřívější události, pozdější událost může chybět, i když je v aplikaci přítomná a pro seznam nadcházejících položek způsobilá. Větší rozvržení událostí může zobrazit více řádků; stále to ale není celý kalendář.",
          "Začněte nejbližší budoucí událostí s časem ve vybraném kalendáři. Pokud se zobrazuje, ale pozdější ne, otevřete aplikaci a zkontrolujte zbytek rozvrhu. Pokud chybí i nejbližší způsobilá událost, pokračujte kontrolou výběru kalendáře, přístupu a aktualizací. Nepřesouvejte ani nemažte události jen proto, aby se zobrazila některá pozdější."
        ]
      },
      {
        "heading": "Jako první srovnání použijte aplikaci",
        "body": [
          "Otevřete Cloud Calendars a najděte jednu konkrétní budoucí událost s časem. Potvrďte, že je vybraný její kalendář a že má aplikace potřebný přístup ke kalendářům. Porovnejte název, datum a čas začátku s widgetem. Pokud událost chybí i v aplikaci, nejprve prověřte účet nebo synchronizaci.",
          "Pokud potřebujete jasný příklad, použijte neškodnou testovací událost v kalendáři, který vlastníte. Nastavte jí začátek do budoucna a dejte jí snadno rozpoznatelný název. Kvůli testování plochy neměňte skutečnou pozvánku ani neodebírejte účty."
        ]
      },
      {
        "heading": "Počítejte s aktualizacemi, ale nepředpokládejte pevný termín",
        "body": [
          "Widgety zobrazují uložené informace a neběží průběžně jako otevřená aplikace. Časování jejich aktualizací řídí Apple. Otevření aplikace a kontrola události vám dá aktuální bod pro srovnání, ale nestanovuje přesný počet sekund, po kterých se widget musí změnit.",
          "Pokud aplikace zůstává správná, ale widget je stále chybný, poznamenejte si rozvržení, vybraný kalendář, čas události a verze aplikace a iOS. Prázdný seznam, stará událost a nesprávný čas jsou různá pozorování; nahlaste, které z nich vidíte."
        ]
      },
      {
        "heading": "Počasí čtěte jako samostatný souhrn",
        "body": [
          "Počasí vedle data není předpověď navázaná na místo a čas začátku každé události. Před venkovní akcí otevřete zobrazení počasí a zkontrolujte zamýšlené místo a hodinu. Ikona aktuálních podmínek nemůže určit, jaké podmínky budou při pozdější schůzce.",
          "Tento widget si ponechte pro rychlou orientaci. Pro celodenní závazky, podrobnosti o událostech a rozhodnutí vyžadující celý rozvrh používejte úplný kalendář."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Pro seznam událostí zvolte Calendar Events nebo Calendar Events Large.",
      "Ověřte budoucí událost s časem ve vybraném kalendáři.",
      "Než začnete řešit widget, porovnejte v aplikaci její datum a čas.",
      "Přetrvávající rozdíly si zaznamenejte místo mazání dat kalendáře."
    ],
    "faq": [
      {
        "q": "Proč mi chybí narozeniny?",
        "a": "Přehled nadcházejících položek vylučuje celodenní události. Narozeniny a další položky pouze s datem zkontrolujte v plném kalendáři."
      },
      {
        "q": "Zobrazuje malý widget příští schůzku?",
        "a": "Malé rozvržení Calendar & Weather zobrazuje datum a počasí. Pro události zvolte rozvržení se seznamem událostí."
      },
      {
        "q": "Znamená absence nadcházející události, že mám dnes volno?",
        "a": "Ne. Tento závěr mohou změnit celodenní položky, probíhající události, nevybrané kalendáře i neaktuální informace."
      }
    ],
    "sourcesHeading": "Zdroje a pokyny Apple",
    "sources": [
      {
        "label": "Apple: Přidání a úprava widgetů na iPhone",
        "url": "https://support.apple.com/118610"
      },
      {
        "label": "Apple: Jak udržovat widget aktuální",
        "url": "https://developer.apple.com/documentation/widgetkit/keeping-a-widget-up-to-date"
      },
      {
        "label": "Apple: Přidávání, úpravy a odebírání widgetů na iPad",
        "url": "https://support.apple.com/guide/ipad/add-edit-and-remove-widgets-ipadb0de8630/ipados"
      }
    ],
    "seeAlso": [
      "choosing-a-widget-size",
      "a-countdown-to-your-next-meeting",
      "calendar-on-apple-watch"
    ],
    "comparison": {
      "heading": "Vyberte zobrazení, které skutečně potřebujete",
      "columns": [
        "Zobrazení",
        "Použití",
        "Před spoléháním se na něj zkontrolujte"
      ],
      "rows": [
        {
          "cells": [
            "Calendar Events",
            "Kompaktní přehled nadcházejících událostí s časem.",
            "Událost patří do vybraného kalendáře a ještě nezačala."
          ]
        },
        {
          "cells": [
            "Calendar Events Large",
            "Více místa pro nadcházející události.",
            "I větší rozvržení má stále omezený počet řádků."
          ]
        },
        {
          "cells": [
            "Calendar & Weather",
            "Rychlý přehled data a počasí.",
            "Jeho malé rozvržení nezaručuje řádek s nadcházející událostí."
          ]
        },
        {
          "cells": [
            "Live Activity",
            "Samostatné odpočítávání do další události na podporovaných plochách iPhone.",
            "Nejde o widget na ploše ani o samostatné rozvržení widgetu pro zamčenou obrazovku."
          ]
        }
      ]
    },
    "galleryKinds": [
      "widgets",
      "live"
    ],
    "galleryCaption": "Widgety na ploše a Live Activity jsou oddělená zobrazení. Zvolte rozvržení, které odpovídá informacím, jež potřebujete.",
    "actionHeading": "Umístěte užitečnou část svého rozvrhu na plochu",
    "actionText": "Otevřete Cloud Calendars, zkontrolujte známou budoucí událost s časem a potom na iPhone nebo iPad přidejte vhodný widget. Aplikace zůstává místem pro kontrolu celého kalendáře.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Zkontrolujte počasí vedle svého rozvrhu"
      },
      {
        "slug": "forecast-beside-every-event",
        "label": "Zkontrolujte hodiny venkovní události"
      },
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Zkontrolujte připojené kalendářové účty"
      }
    ]
  },
  "onecal-alternative-iphone-calendar-view-or-sync": {
    "updated": "2026-10-23",
    "title": "Cloud Calendars, nebo OneCal? Zvolte společné zobrazení, nebo synchronizaci kalendářů",
    "short": "Cloud Calendars a OneCal podle pracovního postupu",
    "description": "Porovnejte OneCal a Cloud Calendars podle zobrazení, kopírovaných událostí, mobilních ovládacích prvků a tarifů.",
    "lede": "Vybírejte podle výsledku, který potřebujete: zobrazit několik rozvrhů pohromadě, upravit původní událost nebo zkopírovat zaneprázdněnost do jiného účtu. Cloud Calendars nabízí plánovací zobrazení pro iPhone a iPad; OneCal popisuje sjednocené zobrazení a samostatná pravidla Calendar Sync. Toto srovnání publikuje Arte Soft, vývojář Cloud Calendars.",
    "commonBelief": "Dva produkty, které zobrazují kalendáře Google, iCloud a Outlook, nutně udržují dostupnost, úpravy událostí a kopie synchronizované stejným způsobem.",
    "sections": [
      {
        "heading": "Volte mezi přehledem a změnou v jiném účtu",
        "body": [
          "Pokud chcete vidět osobní událost vedle pracovní schůzky, potřebujete společné zobrazení. Pokud má váš pracovní kalendář zároveň obsahovat blok zaneprázdněnosti pro osobní událost, potřebujete jasně daný postup ze zdroje do cíle. První výsledek automaticky nevytváří ten druhý.",
          "Cloud Calendars přináší vybrané kalendáře do plánovacího zobrazení na iPhone a iPad. OneCal popisuje Unified Calendar View odděleně od Calendar Sync; jeho vydavatel uvádí, že toto zobrazení můžete používat i bez nastavení pravidel synchronizace. Ještě před připojením účtů nebo porovnáváním názvů předplatného se rozhodněte, na jakém výsledku vám záleží."
        ]
      },
      {
        "heading": "Pochopte, co může změnit zkopírovaná událost",
        "body": [
          "Dokumentace OneCal ke Calendar Sync popisuje jednosměrná i vícesměrná pravidla, která vytvářejí klonované události. Její samostatný průvodce pokrytím uvádí, že úpravy klonu se zpět do originálu nepropagují. Než budete zkopírovanou událost považovat za místo, kde přeplánovat schůzku, určete originál a kalendář, kterému patří.",
          "Připojení poskytovatelů v Cloud Calendars mohou také vytvářet zrcadlené kalendáře v úložišti iOS. Společné zobrazení nedokazuje, že se záznamy sloučily nebo že se úprava dostala k poskytovateli. U kalendáře, který vlastníte a smíte upravovat, ověřte u poskytovatele i v aplikaci testovací událost bez hostů."
        ]
      },
      {
        "heading": "Zkontrolujte ovládací prvky na zařízení, které skutečně používáte",
        "body": [
          "Aktuální mobilní příručka OneCal popisuje vytváření a úpravy událostí kalendáře, volby opakování, RSVP a připojení ke schůzkám. Zároveň samostatně uvádí, že vytváření, úpravy, pozastavení nebo mazání konfigurací Calendar Sync probíhá ve webové aplikaci; mobil je pouze zobrazuje. Nastavení booking linků je také popsáno jako úkol pro web.",
          "Cloud Calendars je aplikace pro iPhone a iPad s denním, týdenním, měsíčním, ročním a seznamovým zobrazením. Vyzkoušejte potřebnou úpravu v nainstalovaném zobrazení, přečtěte si volby opakování a ověřte uloženou událost. Nepředpokládejte, že v něm existuje mobilní nabídka, rezervační postup nebo ovládání automatizace jiného produktu."
        ]
      },
      {
        "heading": "Ověřte pokrytí místo předpokladu neomezené historie",
        "body": [
          "Aktuální průvodce pokrytím OneCal uvádí budoucí okno synchronizace až na rok pro Google a iCloud a až na tři měsíce pro Outlook. Zároveň rozlišuje budoucí opakující se série a samostatné historické události. Jde o limity uvedené vydavatelem, nikoli o test vašeho konkrétního účtu ani tvrzení o všech funkcích v jeho kalendářním zobrazení.",
          "Také u Cloud Calendars je potřeba zkontrolovat způsob připojení účtu, vybrané kalendáře a relevantní data. Pokud jsou starší schůzky zásadní, porovnejte konkrétně určenou událost u poskytovatele a v aplikaci. Kalendářová aplikace není automaticky úplnou zálohou ani zárukou, že byly načteny všechny minulé záznamy."
        ]
      },
      {
        "heading": "Porovnejte požadavky tarifů a způsob účtování",
        "body": [
          "Cloud Calendars zahrnuje synchronizaci Google Calendar v tarifu Base; Advanced odstraňuje reklamy a Premium přidává podporu Microsoft Calendar a Teams. Oprávnění účtu ověřujte zvlášť od tarifu. Před nákupem si zkontrolujte aktuální místní cenu a fakturační období, místo abyste se řídili pevným mezinárodním srovnáním cen.",
          "Průvodce tarify OneCal pro web popisuje tarify za člena a čtrnáctidenní zkušební období, včetně odstranění klonů po jeho skončení. Jeho průvodce mobilním účtováním popisuje nákupy spravované obchodem a omezení při přidávání členů týmu. Ověřte si, které funkce vyžadují průběžný tarif a kde se nákup spravuje; samotné bezplatné stažení na to neodpoví."
        ]
      },
      {
        "heading": "Než přejdete jinam, otestujte svůj skutečný plánovací postup",
        "body": [
          "Pokud jsou pro vás důležité počasí, widgety nebo Live Activity, zahrňte je do zkoušky na zařízení, které používáte. Cloud Calendars tyto plánovací plochy nabízí, přičemž počasí je omezeno na dostupná data a vybrané místo. Zde posuzované stránky OneCal nedokládají rovnocennost těchto ploch; ověřte aktuální produkt, místo abyste z průvodce vyvozovali jejich absenci.",
          "Původní aplikace a údaje o připojení si ponechte, dokud neověříte požadovaný výsledek. Zaznamenejte si, zda jste ověřovali viditelnost, úpravu původní události, zkopírovanou zaneprázdněnost nebo připomínku; jde o různé výsledky. Před odpojením služby si zjistěte, co se stane se stávajícími kopiemi, a neexperimentujte na aktivní pozvánce nebo skutečné schůzce se zákazníkem."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Poznamenejte si, zda potřebujete společné zobrazení, nebo zkopírovat události do jiného účtu.",
      "Určete originály, kopie a účet, kterému každá důležitá událost patří.",
      "Ověřte potřebné ovládací prvky na telefonu, tabletu nebo ve webovém postupu, které skutečně používáte.",
      "Porovnejte jeden běžný týden i všechny historické termíny, na které spoléháte.",
      "Zkontrolujte aktuální požadavky tarifu, místní cenu a poskytovatele nákupu.",
      "Před přechodem ověřte testovací událost a prostudujte pravidla pro odstraňování kopií."
    ],
    "faq": [
      {
        "q": "Je společné zobrazení kalendáře totéž co synchronizace zaneprázdněnosti?",
        "a": "Ne. Společné zobrazení vám umožní porovnat závazky. Vytvoření záznamu v jiném účtu vyžaduje samostatný podporovaný postup; OneCal popisuje pravidla Calendar Sync odděleně od svého Unified Calendar View."
      },
      {
        "q": "Mohu změnit klon v OneCal a tím přeplánovat původní schůzku?",
        "a": "Jeho průvodce pokrytím uvádí, že úpravy klonu se do originálu nepropagují. Určete původní událost a řiďte se oprávněními k úpravám a oprávněními organizátora v jejím kalendáři."
      },
      {
        "q": "Která aplikace je pro moje nastavení levnější?",
        "a": "To záleží na funkcích, účtech, způsobu účtování a místní ceně, které potřebujete. Cloud Calendars zahrnuje synchronizaci Google v Base a podporu Microsoft v Premium. Pro zamýšlený pracovní postup si projděte aktuální tarif OneCal a podmínky mobilního účtování; tento průvodce netvrdí, že jedna cena univerzálně vítězí."
      }
    ],
    "sourcesHeading": "Oficiální dokumentace OneCal k pracovním postupům a tarifům",
    "sources": [
      {
        "label": "OneCal: mobilní funkce a úkony nastavení jen přes web",
        "url": "https://docs.onecal.io/docs/mobile-apps"
      },
      {
        "label": "OneCal: Calendar Sync a pravidla ze zdroje do cíle",
        "url": "https://docs.onecal.io/docs/calendar-sync/calendar-sync-intro"
      },
      {
        "label": "OneCal: okna synchronizace a úpravy klonovaných událostí",
        "url": "https://docs.onecal.io/docs/calendar-sync/what-does-onecal-sync"
      },
      {
        "label": "OneCal: tarify, zkušební období a chování po skončení",
        "url": "https://docs.onecal.io/docs/billing/plans-and-free-trial"
      },
      {
        "label": "OneCal: předplatná v App Store a Google Play",
        "url": "https://docs.onecal.io/docs/billing/mobile-subscriptions"
      }
    ],
    "seeAlso": [
      "what-calendar-sync-actually-does",
      "three-calendar-apps-is-two-too-many",
      "free-google-sync-without-adverts",
      "disconnect-calendar-integration-without-losing-track",
      "what-fantastical-costs-and-what-this-does"
    ],
    "comparison": {
      "heading": "Než předplatné zaplatíte, porovnejte pracovní postup",
      "columns": [
        "Otázka",
        "Cloud Calendars",
        "Dokumentace OneCal"
      ],
      "rows": [
        {
          "cells": [
            "Kde si prohlížím svůj rozvrh?",
            "Na iPhone a iPad, v denním, týdenním, měsíčním, ročním a seznamovém zobrazení.",
            "Unified Calendar View je oddělené od nastavování Calendar Sync."
          ]
        },
        {
          "cells": [
            "Potřebuji mezi účty kopírovat bloky zaneprázdněnosti?",
            "Nevyvozujte to ze společného zobrazení; připojení poskytovatelů mohou kalendáře zrcadlit lokálně.",
            "Calendar Sync vytváří klonované události pomocí jednosměrných nebo vícesměrných pravidel."
          ]
        },
        {
          "cells": [
            "Kde změním pravidla synchronizace?",
            "Použijte ovládací prvky zdokumentované pro připojení účtu v aplikaci.",
            "V posuzované mobilní příručce jsou změny konfigurace synchronizace přiřazeny webové aplikaci."
          ]
        },
        {
          "cells": [
            "Který tarif Cloud Calendars potřebuji?",
            "Base zahrnuje synchronizaci Google Calendar; Advanced odstraňuje reklamy; Premium přidává Microsoft Calendar a Teams.",
            "Pro požadovaný pracovní postup zkontrolujte aktuální tarif OneCal a způsob účtování."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-left",
      "hook"
    ],
    "galleryCaption": "Skutečné obrazovky kalendáře v Cloud Calendars ukazují plánovací zobrazení. Srovnání toto zobrazení odlišuje od serverových pravidel klonování dané služby.",
    "actionHeading": "Vyberte si výsledek, který chcete ověřit",
    "actionText": "Pokud chcete přehled na iPhone nebo iPad s počasím a widgety, vyzkoušejte Cloud Calendars s neškodnou testovací událostí. Pokud požadujete zkopírovanou zaneprázdněnost v jiném účtu, posuďte službu, která tuto operaci výslovně dokumentuje.",
    "articleLinks": [
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Nastavte si kombinované zobrazení kalendářů"
      },
      {
        "slug": "fantastical-readdle-calendar366-iphone-comparison",
        "label": "Porovnejte další možnosti kalendářů pro iPhone"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Vyberte si zobrazení na ploše"
      }
    ]
  },
  "fantastical-readdle-calendar366-iphone-comparison": {
    "updated": "2026-10-23",
    "title": "Alternativy kalendáře pro iPhone: Cloud Calendars, Fantastical, Readdle a BusyCal",
    "short": "Porovnání alternativ kalendářů pro iPhone",
    "description": "Porovnejte kalendáře pro iPhone podle počasí, zobrazení, úkolů a pracovního postupu, který potřebujete.",
    "lede": "Vyberte kalendář podle toho, co v něm potřebujete skutečně dělat: procházet události s počasím, rychle zadat událost, spravovat úkoly nebo spojit zobrazení více účtů. Cloud Calendars, Fantastical, Calendars by Readdle, Calendar 366 a BusyCal se v těchto pracovních postupech i požadavcích na tarif liší. Cloud Calendars vyvíjí Arte Soft a toto srovnání také publikuje.",
    "sections": [
      {
        "heading": "Než začnete porovnávat vzhled, určete si, co musí fungovat",
        "body": [
          "Sepište si své poskytovatele kalendářů, zařízení a tři klíčové činnosti. Například: zobrazit spolu pracovní a osobní kalendáře, dokončit připomínku a rychle přidat schůzku. Tyto činnosti si vyzkoušejte na soukromých ukázkových datech, než naimportujete celý rozvrh.",
          "To, že produkt podporuje název vašeho poskytovatele, neznamená, že každá metoda připojení nabízí stejná oprávnění nebo funkce. Kalendář v zařízení, přímo připojený účet a odebíraný kanál mohou vytvářet podobně vypadající položky, ale umožňovat odlišné akce."
        ]
      },
      {
        "heading": "Jako výchozí základ použijte vlastní kalendář poskytovatele",
        "body": [
          "Průvodce Google pro začátek popisuje vlastní rozhraní jeho kalendáře pro plánování, úkoly, sdílení a více kalendářů. Pokud tam už svůj rozvrh máte, vyzkoušejte nejdřív požadovanou akci přímo u zdroje, než se rozhodnete, zda potřebujete jinou aplikaci.",
          "Například po připojení zamýšleného účtu porovnejte stejnou událost v Google Calendar a Fantastical. Zkontrolujte, zda skutečně potřebujete výhodu v podobě kombinovaného zobrazení, propojení s úkoly, rychlého zadání nebo konkrétního rozhraní zařízení. Jiný kalendářový klient automaticky neznamená přechod k jinému poskytovateli."
        ]
      },
      {
        "heading": "Fantastical: zkontrolujte připojení účtů a rychlé zadávání",
        "body": [
          "Flexibits dokumentuje jak přímá připojení kalendářových účtů, tak možnosti pro kalendáře a připomínky už nastavené v iOS. Jeho průvodce pro začátek doporučuje pro plné využití funkcí aplikace přímá připojení. Určete si, kterou cestu jste zvolili, místo abyste bezdůvodně připojovali stejný kalendář dvakrát.",
          "Fantastical také dokumentuje zadávání větami a znovupoužitelné šablony událostí nebo úkolů. Vyzkoušejte jednoznačné datum, délku trvání a cílový kalendář a potom zkontrolujte uložený výsledek. Tato syntaxe patří Fantastical; textové pole v jiné aplikaci může stejnou větu vyhodnotit jinak."
        ]
      },
      {
        "heading": "Calendars by Readdle: zkontrolujte zdroj úkolů",
        "body": [
          "Readdle uvádí kalendáře Google, Outlook a iCloud spolu s funkcemi pro úkoly a zadávání přirozeným jazykem. Jeho návod k nastavení úkolů popisuje výběr iOS Reminders nebo Google Tasks v možnostech úkolů. Tato volba je důležitá, pokud dokončení úkolu v telefonu musí aktualizovat konkrétní původní seznam.",
          "Pomocí dočasného úkolu otestujte dokončení na obou stranách, nejen to, zda se název zobrazí na časové ose. Pokud potřebujete konkrétní zobrazení nebo akci i na Macu, nejen na iPhone, otestujte ji i tam. Nepředpokládejte stejné ovládání jen podle společného názvu produktu."
        ]
      },
      {
        "heading": "Calendar 366: zkontrolujte přístup k systému, sady a polohu počasí",
        "body": [
          "Dokumentace Calendar 366 rozlišuje přístup k systémovým kalendářům a připomínkám od přímých integrací účtů. Popisuje sady kalendářů, které určují viditelné kalendáře a seznamy. Tyto sady mohou také určovat výchozí kalendář, proto si ověřte, kam bude nově vytvořená událost patřit.",
          "Stejná dokumentace popisuje i vlastní parser přirozeného jazyka a počasí pomocí Apple Weather s volbou systémové nebo vlastní polohy. Pro plánování venku si ověřte vybrané místo, místo abyste předpokládali, že se předpověď řídí adresou každé události. Jde o možnosti zdokumentované vydavatelem, nikoli o funkce otestované na vašem účtu."
        ]
      },
      {
        "heading": "BusyCal: zkontrolujte zobrazení úkolů a zobrazení používané pro počasí",
        "body": [
          "Průvodce BusyCal pro úkoly v iOS rozlišuje datované, časované a nedatované úkoly. Popisuje ovládací prvky pro dokončení a přesun nedokončených datovaných úkolů do dalších dnů. Jeho průvodce počasím umisťuje předpovědi do zobrazení List, Day a Month, takže otestujte konkrétní zobrazení, které používáte, místo abyste předpokládali, že se počasí zobrazuje všude.",
          "BusyCal také dokumentuje zadávání přirozeným jazykem jako možnost ve výchozím nastavení nové události. Vyzkoušejte stejnou soukromou ukázkovou událost jako v ostatních aplikacích a pak zkontrolujte kalendář i uložený čas. Jde o ovládání BusyCal, ne o příkazy sdílené všemi kalendářovými aplikacemi."
        ]
      },
      {
        "heading": "Pracovní postup na Watch ověřujte odděleně od telefonu",
        "body": [
          "Průvodce Fantastical pro Watch dokumentuje zobrazení Up Next, List a Tasks včetně dokončování úkolů. Průvodce BusyCal pro úkoly rozlišuje datované a časované úkoly zobrazené na Watch od nedatovaných úkolů. Pokud je pro vás nedatovaný seznam restů důležitý, zahrňte ho do zkoušky místo testování jen další události.",
          "Komplikace na Watch slouží k rychlému přehledu, zatímco aplikace na Watch může nabízet další akce. Ověřte si data i akci na skutečných hodinkách i telefonu a zkontrolujte aktuální tarif. Rozhraní pro desktop, telefon a hodinky nejsou zaměnitelná jen proto, že používají stejný název produktu."
        ]
      },
      {
        "heading": "Cenu a nárok na funkce posuzujte zvlášť",
        "body": [
          "Zkontrolujte aktuální místní nákupní obrazovku, funkce dostupné po skončení zkušební verze a to, zda dřívější nákup mění váš nárok na funkce. Stažení zdarma, opakované předplatné a starší nákup nemusí nutně odemykat stejnou sadu funkcí.",
          "Stránky vydavatelů se mohou měnit v různých časech. Aktuální FAQ produktu od Readdle popisuje několik klíčových možností jako bezplatné, zatímco samostatná stránka nápovědy o bezplatné a plné verzi uvádí jiné rozdělení. Místo toho, abyste jeden popis brali jako univerzální příslib, ověřte požadovanou akci v nainstalované aplikaci a její aktuální nákupní podmínky."
        ]
      },
      {
        "heading": "Kam Cloud Calendars patří v užším výběru",
        "body": [
          "Cloud Calendars je další možnost pro iPhone a iPad, pokud potřebujete vybrané kalendáře, více plánovacích zobrazení, počasí a widgety. Synchronizace s Google je součástí Base, Advanced odstraňuje reklamy a Premium přidává podporu kalendáře Microsoft. Zkontrolujte aktuální tarif a oprávnění poskytovatele pro své nastavení.",
          "Pokud je zásadní specializované propojení úkolů, příkaz šablony nebo pracovní postup na desktopu, použijte produkt, který tento požadavek dokumentuje a úspěšně splní. Porovnávejte uložené výsledky a každodenní náročnost; tento kontrolní seznam vám má pomoci s výběrem, ne naznačovat, že každá zde zmíněná funkce existuje v Cloud Calendars."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Sepište si své účty, zařízení a klíčové činnosti.",
      "Zvolte jednu cestu připojení účtu a zkontrolujte, které kalendáře zpřístupňuje.",
      "Vyzkoušejte rychlé zadávání a dokončování úkolů na neškodných příkladech.",
      "Ověřte polohu pro počasí a zobrazení používaná na jednotlivých zařízeních.",
      "Po jakékoli zkušební verzi nebo starším nároku zkontrolujte aktuální nákupní podmínky."
    ],
    "faq": [
      {
        "q": "Která alternativa k Fantastical je nejlepší?",
        "a": "Záleží na pracovním postupu, který potřebujete. Porovnejte zdroje kalendářů a úkolů, zadávání událostí, podporu zařízení a aktuální nárok na funkce. Tento průvodce neurčuje jednoho univerzálního vítěze z hlediska výkonu."
      },
      {
        "q": "Znamená stejný název poskytovatele, že se všechny aplikace synchronizují stejně?",
        "a": "Ne. Samostatně zkontrolujte přímá připojení, kalendáře v zařízení, kanály i oprávnění a pak ověřte ukázkovou změnu u jejího zdroje."
      },
      {
        "q": "Mohu předpokládat, že každá propagovaná funkce je zdarma?",
        "a": "Ne. Zkontrolujte nainstalovanou aplikaci, místní nákupní obrazovku a funkce, které zůstanou po skončení zkušební verze. Dokumentace vydavatele může popisovat různé verze nebo různé nároky na funkce."
      }
    ],
    "sourcesHeading": "Oficiální dokumentace ověřená pro tohoto průvodce",
    "sources": [
      {
        "label": "Fantastical: cesty připojení účtu",
        "url": "https://flexibits.com/fantastical-ios/help/getting-started"
      },
      {
        "label": "Fantastical: zadávání přirozeným jazykem a šablony",
        "url": "https://flexibits.com/fantastical-ios/help/adding-events-and-tasks"
      },
      {
        "label": "Readdle: aktuální možnosti produktu a FAQ",
        "url": "https://readdle.com/calendars"
      },
      {
        "label": "Readdle: výběr zdroje úkolů",
        "url": "https://support.readdle.com/calendars/synchronization/how-to-sync-tasks-with-ios-reminders-or-google-tasks"
      },
      {
        "label": "Readdle: samostatné informace k bezplatnému/plnému tarifu",
        "url": "https://apphelp.readdle.com/en/index.php?id=585&pg=kb.page"
      },
      {
        "label": "Calendar 366: integrace, sady, rychlé zadávání a počasí",
        "url": "https://calendar366.com/help/index.html"
      },
      {
        "label": "BusyCal pro iOS: úkoly a omezení úkolů na Watch",
        "url": "https://www.busymac.com/docs/busycalios/70659-tasks/"
      },
      {
        "label": "BusyCal pro iOS: počasí a podporovaná zobrazení",
        "url": "https://www.busymac.com/docs/busycalios/70665-weather/"
      },
      {
        "label": "BusyCal pro iOS: zadávání přirozeným jazykem",
        "url": "https://www.busymac.com/docs/busycalios/70669-natural-language/"
      },
      {
        "label": "Fantastical: zobrazení a akce na Apple Watch",
        "url": "https://flexibits.com/fantastical-ios/help/apple-watch"
      },
      {
        "label": "Google: vlastní rozhraní Calendar založené na účtu",
        "url": "https://support.google.com/calendar/answer/2465776?hl=en"
      }
    ],
    "seeAlso": [
      "what-fantastical-costs-and-what-this-does",
      "natural-language-calendar-events-iphone",
      "iphone-calendar-tasks-reminders-versus-event-alerts"
    ],
    "comparison": {
      "heading": "Začněte svým hlavním požadavkem",
      "columns": [
        "Požadavek",
        "Relevantní možnosti ke kontrole",
        "Důležité rozlišení"
      ],
      "rows": [
        {
          "cells": [
            "Události s počasím a zobrazeními pro iPhone/iPad",
            "Cloud Calendars a zdokumentovaná zobrazení počasí v porovnávaných aplikacích.",
            "Zkontrolujte polohu předpovědi, dostupné období a zobrazení; pokrytí počasí není neomezené."
          ]
        },
        {
          "cells": [
            "Zadávání událostí přirozeným jazykem",
            "Fantastical a příslušná funkce v Readdle nebo BusyCal.",
            "Zpracování vět není totéž co diktování nebo běžná úprava události."
          ]
        },
        {
          "cells": [
            "Úkoly vedle událostí",
            "Zdokumentovaný zdroj úkolů v Readdle, Calendar 366, BusyCal nebo Fantastical.",
            "Připomínka k události není integrace dokončování úkolů."
          ]
        },
        {
          "cells": [
            "Synchronizace Google Calendar a volitelné odstranění reklam",
            "Cloud Calendars Base zahrnuje synchronizaci Google Calendar; Advanced odstraňuje reklamy.",
            "Podpora Microsoft Calendar a Teams vyžaduje Premium."
          ]
        },
        {
          "cells": [
            "Jiný model nákupu",
            "Aktuální nabídka v obchodě a nárok na funkce pro každou aplikaci a platformu.",
            "Stažení zdarma není důkaz, že jsou zdarma všechny funkce; regionální ceny a tarify se mohou měnit."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-left",
      "week-right",
      "widgets"
    ],
    "galleryDevice": "iPad",
    "galleryCaption": "Toto jsou obrazovky Cloud Calendars pro zobrazení aplikace, počasí a widgety. Nejde o snímky obrazovky ostatních produktů v tomto srovnání.",
    "actionHeading": "Vyzkoušejte kalendář na jedné skutečné potřebě plánování",
    "actionText": "Pokud je vaším hlavním požadavkem rozvrh pro iPhone nebo iPad s počasím a widgety, vyzkoušejte Cloud Calendars s dočasnou událostí. Při porovnávání produktů oddělte specializované požadavky na úkoly, rezervace a přirozený jazyk.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Podívejte se, jak počasí zapadá do práce s kalendářem"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Porovnejte widgety Cloud Calendars"
      },
      {
        "slug": "onecal-alternative-iphone-calendar-view-or-sync",
        "label": "Rozlište kombinované zobrazení od zkopírovaně obsazeného času"
      }
    ]
  }
};
