import { LocalisedArticle } from '../types';

/**
 * The four articles this language carries.
 *
 * Chosen one per intent -- weather, one view, sharing, price -- so the language
 * answers a whole question rather than a quarter of four. The numbers are not
 * here: they live once in article-facts.ts and join the prose by id, so a
 * translation can rewrite every sentence without touching a figure.
 */
export const ARTICLES_PL: Readonly<Record<string, LocalisedArticle>> = {
  'weather-inside-your-calendar': {
    title: 'Kalendarz, który ma pogodę już w środku',
    short: 'Pogoda w kalendarzu',
    description:
      'Dlaczego sprawdzanie dwóch aplikacji przy planowaniu dnia jest błędem projektowym i jak wygląda kalendarz, w którym prognoza jest częścią widoku, a nie stoi obok.',
    lede: 'Niemal każdy planuje dzień między dwiema aplikacjami. Kalendarz mówi, gdzie trzeba być; pogodowa mówi, jaka będzie pogoda na miejscu. Trzymanie obu rzeczy w głowie to ta część, której nikt nie zauważa — dopóki nie przepadnie sobota.',
    commonBelief:
      'Że kalendarz jest od spotkań, aplikacja pogodowa od pogody, a trzymanie ich osobno to po prostu sposób, w jaki działają telefony.',
    sections: [
      {
        heading: 'Koszt dwóch aplikacji to nie dwa dotknięcia',
        body: [
          'Przełączenie nic nie kosztuje. Drogie jest to, że obie nigdy nie zgadzają się co do tego, co ma znaczenie. Kalendarz wie, że w sobotę o jedenastej zajęte są dwie godziny; aplikacja pogodowa wie, że pada od dziesiątej do trzynastej. Żadna nie wie, że te dwa fakty razem oznaczają, że blok trzeba przesunąć.',
          'Warstwą integracyjną jesteś ty. Działa to do momentu, w którym masz dużo zajęć — czyli dokładnie wtedy, gdy ochrona planów jest najcenniejsza.',
        ],
      },
      {
        heading: 'Co się zmienia, gdy prognoza jest w siatce',
        body: [
          'Umieść prognozę za wydarzeniami, a konflikt rozwiązuje się sam. Wilgotny poranek i suche popołudnie widać tym samym spojrzeniem co spotkanie, które właśnie chciałeś wstawić, a decyzja przestaje kosztować myślenie.',
          'To nie jest widżet przyklejony z boku. Każdy dzień w widoku tygodnia i miesiąca niesie własne warunki, a każde wydarzenie niesie prognozę godzin, które faktycznie zajmuje — nie dzienne podsumowanie, które uśrednia dokładnie tę część, która była potrzebna.',
        ],
      },
    ],
    claims: {
      forecastDays: 'Dni prognozy, w kalendarzu i obok każdego wydarzenia',
      views: 'Widoki z pogodą: Dzień, Tydzień, Miesiąc, Rok i Lista',
      price: 'Ile kosztują funkcje pogodowe',
    },
    practical: [
      'Zajrzyj na pasek za dniami w widoku tygodnia, zanim wstawisz cokolwiek na zewnątrz.',
      'Dotknij wydarzenia, by zobaczyć prognozę jego godzin, a nie jego dnia.',
      'Plany zależne od pogody układaj najpierw na czternastu dniach, a dopracowuj dwa dni wcześniej.',
      'Wszystko po siódmym dniu traktuj jako kształt, nie jako plan.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'what-a-subscription-actually-buys'],
  },

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google i Outlook w jednym widoku',
    short: 'Trzy konta, jeden widok',
    description:
      'Życie niemal każdego jest rozdzielone między prywatny kalendarz Apple, konto Google i służbowy Exchange. Co się zmienia, gdy trafią do jednej siatki.',
    lede: 'Problemem prawie nigdy nie jest to, że któryś z tych kalendarzy jest zły. Problemem jest to, że masz trzy, a tydzień jeden.',
    commonBelief:
      'Że trzymanie pracy i życia prywatnego w osobnych aplikacjach to granica, a nie wada.',
    sections: [
      {
        heading: 'Podwójne umawianie jest strukturalne',
        body: [
          'Jeśli twoje zobowiązania żyją w trzech miejscach, żadne miejsce nie powie ci, czy jesteś wolny. Krokiem scalającym jesteś ty i wykonujesz go z pamięci, zwykle gdy ktoś czeka na odpowiedź.',
          'Dlatego klasyczna wpadka to nie zapomnienie o wydarzeniu; to zgoda na coś, co zderza się z wydarzeniem, którego nie mogłeś zobaczyć.',
        ],
      },
      {
        heading: 'Co daje jedna siatka',
        body: [
          'Wszystkie konta w tym samym tygodniu, pokolorowane według pochodzenia, edytowalne na miejscu. Przestajesz się zastanawiać, która aplikacja ma odpowiedź, bo pytanie przestaje być w liczbie mnogiej.',
          'iCloud i Google synchronizują się w wersji darmowej. Konta Microsoftu — Outlook i Exchange — należą do płatnej, bo to połączenie ma koszt cykliczny, którego pozostałe nie mają.',
        ],
      },
    ],
    claims: {
      accounts: 'Rodzaje kont, które mieszczą się w jednym widoku',
      premiumMonthly: 'Miesięczny koszt dołożenia Microsoftu, w dolarach',
    },
    practical: [
      'Najpierw dodaj konto prywatne, potem to, które powoduje kolizje.',
      'Koloruj według konta, nie kategorii: to pochodzenie trzeba widzieć od razu.',
      'Nadal pisz w tym kalendarzu, który inni już czytają.',
    ],
    seeAlso: ['weather-inside-your-calendar', 'what-a-subscription-actually-buys'],
  },

  'sharing-one-event-not-your-calendar': {
    title: 'Udostępnić jedno wydarzenie, a nie kalendarz',
    short: 'Udostępnić wydarzenie',
    description:
      'Jak działa wysłanie pojedynczego wydarzenia, co druga strona naprawdę dostaje i dlaczego nie musi niczego instalować, żeby je zobaczyć.',
    lede: 'Udostępnianie kalendarza to zwykle wszystko albo nic: ktoś ma dostęp do twojego albo nie ma. Wysłanie kolacji nie powinno wymagać żadnej z tych rzeczy.',
    commonBelief:
      'Że udostępnienie wydarzenia oznacza danie komuś okna na resztę twojego tygodnia.',
    sections: [
      {
        heading: 'Co naprawdę zostaje wysłane',
        body: [
          'Przy tworzeniu wydarzenia aplikacja proponuje jego udostępnienie. Podróżuje link — mailem, wiadomością, tym, co druga strona ma zainstalowane — a za tym linkiem stoi kanał kalendarza zawierający to jedno wydarzenie i nic więcej.',
          'To nie zrzut ekranu ani kopia, która się starzeje. Gdy zmieni się godzina, kanał zmienia się razem z nią, a osoba, której go wysłałeś, widzi zmianę bez ponownego wysyłania.',
        ],
      },
      {
        heading: 'Czym to nie jest',
        body: [
          'Link to zwykła subskrypcja kalendarza: czyta go Kalendarz Apple, czyta Kalendarz Google, czyta Outlook. W wiadomości jest też App Clip dla kogoś, kto chce aplikacji — otwiera się bez instalowania. To drzwi, nie bramka.',
          'Nie jest natychmiastowy: kanał prosi aplikacje, by zaglądały co godzinę, a to prośba, nie reguła. Nie jest też tajny: link niesie dwadzieścia dwa losowe znaki, których nikt nie zgadnie, ale kto go ma, ten czyta. I na razie jest tylko do odczytu.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Godziny między prośbami o odświeżenie kanału',
      linkLength: 'Losowe znaki w linku, co czyni go nie do odgadnięcia',
      sharePrice: 'Ile kosztuje udostępnianie',
    },
    practical: [
      'Udostępniaj z samego wydarzenia, zaraz po jego utworzeniu.',
      'Wyślij link tym kanałem, którego już z tą osobą używasz.',
      'Jeśli godzina zmienia się na ostatnią chwilę, napisz oprócz przesunięcia wydarzenia.',
      'Unieważnij link, gdy wydarzenie minie, tak jak przestałbyś udostępniać dokument.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'weather-inside-your-calendar'],
  },

  'what-a-subscription-actually-buys': {
    title: 'Co naprawdę kupuje subskrypcja',
    short: 'Co kupuje subskrypcja',
    description:
      'Dwa płatne warianty, co je dzieli i jak poznać, który — jeśli którykolwiek — jest twój.',
    lede: 'Dwa warianty wystarczą, by wprowadzić zamęt, jeśli nikt jasno nie mówi, co je dzieli. Dzieli je Microsoft.',
    commonBelief: 'Że wyższy wariant to te same funkcje, tylko więcej.',
    sections: [
      {
        heading: 'Pierwszy wariant usuwa reklamy',
        body: [
          'Dokłada też zarządzanie wydarzeniami między kalendarzami iCloud i Google, uprawnienia udostępniania Google, automatyczne linki Meet i szybsze odświeżanie pogody. Ale kupuje się go dla reklam.',
          'W tej cenie to mniej więcej jedna kawa rocznie i jest to wariant pasujący niemal każdemu, kto w ogóle chce zapłacić.',
        ],
      },
      {
        heading: 'Drugi wariant jest dla Microsoftu',
        body: [
          'Synchronizacja Outlooka i Exchange, linki Teams, zarządzanie między kontami łącznie z pracą, zarządzanie uczestnikami. Kosztuje rząd wielkości więcej, bo połączenie też.',
          'Jeśli twój kalendarz służbowy nie stoi na Microsofcie, ten wariant nie zawiera nic dla ciebie. Oba są tańsze w skali roku; oszczędność jest umiarkowana, nie spektakularna. Po rezygnacji zostajesz na wersji darmowej, a kalendarze są nietknięte, bo wydarzenia nigdy nie były nasze.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Pierwszy wariant, miesięcznie, w dolarach',
      advancedYearly: 'Pierwszy wariant, rocznie, w dolarach',
      premiumMonthly: 'Drugi wariant, miesięcznie, w dolarach',
      premiumYearly: 'Drugi wariant, rocznie, w dolarach',
    },
    practical: [
      'Kup pierwszy wariant, by usunąć reklamy, a nie by odblokować kalendarz.',
      'Kup drugi tylko wtedy, gdy twoja praca żyje na Microsofcie.',
      'Przejdź na rok, gdy będziesz pewien; oszczędność jest realna, ale niewielka.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view'],
  },
};
