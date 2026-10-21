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
  "updated": "2026-10-21",
  "title": "Udostępnij jedno wydarzenie: wybierz link i uprawnienia",
  "short": "Udostępnianie jednego wydarzenia",
  "description": "Udostępnij wydarzenie bez całego kalendarza. Poznaj role Reader, Writer i Owner, podgląd, aktualizacje oraz ograniczenia cofania dostępu.",
  "lede": "Wysłanie szczegółów kolacji, zezwolenie współorganizatorowi na edycję i zbieranie odpowiedzi o obecności to różne zadania. Najpierw wybierz cel, potem sposób udostępnienia. Poradnik przygotował Arte Soft, twórca Cloud Calendars.",
  "commonBelief": "Każdy link to subskrypcja tylko do odczytu, która aktualizuje się natychmiast i zapisuje odpowiedź.",
  "sections": [
    {
      "heading": "Sprawdź szczegóły wydarzenia",
      "body": [
        "Udostępnienie pojedynczego wydarzenia obejmuje je, a nie cały kalendarz nadawcy. Sprawdź tytuł, strefę czasową, miejsce, notatki i linki do spotkania. Dane dla jednego gościa nie zawsze nadają się do szerokiej publikacji.",
        "Kolacja nie wymaga udostępnienia kalendarza wizyt lekarskich. Jej własne miejsce i linki nadal są jednak przekazywane. Sprawdź treść wydarzenia, zamiast polegać na prywatności pozostałego kalendarza."
      ]
    },
    {
      "heading": "Wybierz podgląd, e-mail lub QR",
      "body": [
        "App Clip Cloud Calendars pokazuje podgląd; dodanie wydarzenia tą drogą wymaga pełnej aplikacji. Zaproszenia e-mail i QR otwierają stronę z możliwością otwarcia Cloud Calendars. To nie są zamienne adresy subskrypcji.",
        "Nadawca loguje się do synchronizowanego udostępniania. Link lub kod QR można przekazać dalej. Kod przenosi adres, ale nie dowodzi, kto go otworzył."
      ]
    },
    {
      "heading": "Przyznaj tylko potrzebny dostęp",
      "body": [
        "W zaproszeniu e-mail wybierasz Reader, Writer lub Owner. Reader przegląda i synchronizuje, Writer edytuje, a Owner dodatkowo udostępnia i zarządza dostępem. Osobie potrzebującej tylko harmonogramu przyznaj Reader.",
        "Writer pasuje do współorganizatora zmieniającego wydarzenie. Owner jest dla osoby zarządzającej również dostępem innych. Wyższe prawa wymagają zalogowania właściwą tożsamością. Anonimowy odbiorca nie jest zidentyfikowanym współwłaścicielem."
      ]
    },
    {
      "heading": "Wyjaśnij dodawanie wydarzenia",
      "body": [
        "Pełna aplikacja wymaga uprawnienia do kalendarzy i kalendarza docelowego z możliwością zapisu. Odbiorca powinien sprawdzić go przed zapisaniem. Otrzymaną kopię można powiązać z udostępnionym wydarzeniem dla późniejszych aktualizacji.",
        "Zwykły import ICS tworzy kopię, natomiast subskrypcja okresowo sprawdza kanał. Jeśli wysyłasz kanał ICS zamiast zaproszenia aplikacji, wyjaśnij różnicę i sprawdź obsługę w kalendarzu odbiorcy."
      ]
    },
    {
      "heading": "Potwierdź dotarcie zmian",
      "body": [
        "Synchronizowane udostępnienie może przekazywać zmiany i odwołanie, ale urządzenie musi je odebrać. Wskazówka odświeżania kanału nie jest terminem dostarczenia. Urządzenie offline, nieodświeżona subskrypcja lub osobna importowana kopia mogą pokazywać stare dane.",
        "Jeśli kolacja zmienia godzinę tuż przed rozpoczęciem, zaktualizuj wydarzenie i skontaktuj się z gośćmi bezpośrednio. Poproś o potwierdzenie nowego czasu. Odebranie zmiany nie potwierdza uczestnictwa."
      ]
    },
    {
      "heading": "Cofnięcie dostępu nie usuwa wszystkich kopii",
      "body": [
        "Sprawdź odbiorców i usuń niepotrzebne prawa. Usunięcie odbiorcy i unieważnienie linku kanału to osobne działania. Żadne nie oznacza zdalnego wymazania wszystkich zrzutów ekranu, wiadomości i kopii kalendarza.",
        "Jeśli link trafił dalej, ustal właściwy adres lub uprawnienie i sprawdź efekt zmiany. Nie umieszczaj prywatnych danych w szeroko rozpowszechnianych linkach, licząc na późniejsze cofnięcie dostępu."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Sprawdź szczegóły i cel: podgląd, edycję czy odpowiedzi o obecności.",
    "Wybierz sposób udostępnienia i zaloguj się, gdy jest to wymagane.",
    "Daj Reader do podglądu, a Writer lub Owner tylko do odpowiednich obowiązków.",
    "Poproś odbiorcę o sprawdzenie godziny i kalendarza docelowego.",
    "Pilną zmianę przekaż również bezpośrednią wiadomością.",
    "Na koniec osobno sprawdź prawa odbiorców i dostęp przez link."
  ],
  "faq": [
    {
      "q": "Czy jedno wydarzenie ujawnia cały kalendarz?",
      "a": "Synchronizowany sposób udostępniania jednego wydarzenia obejmuje tylko je. Nadal ujawnia jego szczegóły. Sprawdź je i nie wysyłaj zaproszenia do całego kalendarza zamiast pojedynczego wydarzenia."
    },
    {
      "q": "Czy odbiorca może edytować?",
      "a": "Tak, mając odpowiednie prawa Writer lub Owner i korzystając z obsługiwanego logowania. Reader służy do podglądu i synchronizacji. Zwykła subskrypcja ICS nie jest tym samym mechanizmem edycji."
    },
    {
      "q": "Czy usunięcie osoby cofa wszystko, co otrzymała?",
      "a": "Nie ma takiej gwarancji. Zmienia się relacja udostępniania, ale zapisane kopie, zrzuty i wiadomości mogą pozostać. Adres kanału wymaga osobnej oceny."
    }
  ],
  "sourcesHeading": "Źródła dotyczące opcji odbiorcy",
  "sources": [
    {
      "label": "Apple: informacje o App Clips",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google: import wydarzeń i ograniczenia",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft: importowanie a subskrybowanie kalendarza",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "taking-back-a-calendar-you-shared"
  ]
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
