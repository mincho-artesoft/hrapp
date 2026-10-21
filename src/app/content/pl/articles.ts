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
  "title": "Kalendarz, który ma pogodę już w środku",
  "short": "Pogoda w kalendarzu",
  "description": "Dlaczego sprawdzanie dwóch aplikacji przy planowaniu dnia jest błędem projektowym i jak wygląda kalendarz, w którym prognoza jest częścią widoku, a nie stoi obok.",
  "lede": "Niemal każdy planuje dzień między dwiema aplikacjami. Kalendarz mówi, gdzie trzeba być; pogodowa mówi, jaka będzie pogoda na miejscu. Trzymanie obu rzeczy w głowie to ta część, której nikt nie zauważa — dopóki nie przepadnie sobota.",
  "commonBelief": "Że kalendarz jest od spotkań, aplikacja pogodowa od pogody, a trzymanie ich osobno to po prostu sposób, w jaki działają telefony.",
  "sections": [
    {
      "heading": "Koszt dwóch aplikacji to nie dwa dotknięcia",
      "body": [
        "Przełączenie nic nie kosztuje. Drogie jest to, że obie nigdy nie zgadzają się co do tego, co ma znaczenie. Kalendarz wie, że w sobotę o jedenastej zajęte są dwie godziny; aplikacja pogodowa wie, że pada od dziesiątej do trzynastej. Żadna nie wie, że te dwa fakty razem oznaczają, że blok trzeba przesunąć.",
        "Warstwą integracyjną jesteś ty. Działa to do momentu, w którym masz dużo zajęć — czyli dokładnie wtedy, gdy ochrona planów jest najcenniejsza."
      ]
    },
    {
      "heading": "Dostępna prognoza",
      "body": [
        "Cloud Calendars korzysta z dostępnej prognozy dla wybranego miejsca. Dane godzinowe i dzienne mogą obejmować różne okresy.",
        "Daty widoczne w kalendarzu nie określają zasięgu prognozy. Widok miesiąca nie oznacza prognozy na cały miesiąc ani dla każdego wydarzenia."
      ]
    }
  ],
  "claims": {
    "price": "Ile kosztują funkcje pogodowe"
  },
  "practical": [
    "Przed planowaniem na podstawie prognozy sprawdź miejsce, datę i dostępne godziny."
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-a-subscription-actually-buys"
  ],
  "updated": "2026-10-21"
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
  "updated": "2026-10-21",
  "title": "Co naprawdę kupuje subskrypcja",
  "short": "Co kupuje subskrypcja",
  "description": "Co kupuje subskrypcja: Base, Advanced, Premium.",
  "lede": "Ten poradnik publikuje Arte Soft, twórca Cloud Calendars.",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "Base obejmuje synchronizację Google Calendar, Google Meet, widoki kalendarza, pogodę i widżety. Bezpłatny plan może wyświetlać reklamy."
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Advanced obejmuje Base i usuwa reklamy. Premium obejmuje Advanced oraz dodaje Microsoft Calendar i Microsoft Teams.",
        "Subskrypcja nie nadaje praw do edycji cudzych kalendarzy ani nie omija ograniczeń konta służbowego."
      ]
    },
    {
      "heading": "Informacje o zakupie i anulowaniu",
      "body": [
        "Przed zakupem sprawdź lokalną cenę, okres rozliczeniowy i warunki odnowienia.",
        "Dla subskrypcji rozliczanej przez Apple otwórz Ustawienia → swoje imię i nazwisko → Subskrypcje. Sprawdź status i datę wygaśnięcia. Anulowanie odnowienia jest odrębne od usunięcia aplikacji lub danych kalendarza; nie zakładaj dostępności płatnych funkcji po wygaśnięciu."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Przed zakupem sprawdź lokalną cenę, okres rozliczeniowy i warunki odnowienia.",
    "Subskrypcja nie nadaje praw do edycji cudzych kalendarzy ani nie omija ograniczeń konta służbowego."
  ],
  "faq": [
    {
      "q": "Jak zatrzymać odnowienie?",
      "a": "Dla subskrypcji rozliczanej przez Apple otwórz Ustawienia → swoje imię i nazwisko → Subskrypcje. Sprawdź status i datę wygaśnięcia. Anulowanie odnowienia jest odrębne od usunięcia aplikacji lub danych kalendarza; nie zakładaj dostępności płatnych funkcji po wygaśnięciu."
    }
  ],
  "sourcesHeading": "Informacje o zakupie i anulowaniu",
  "sources": [
    {
      "label": "Apple: Jak zatrzymać odnowienie?",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view"
  ]
},
};
