import { LocalisedArticle } from '../types';

/** Sześć artykułów o Google: konkretne pytania, jasne odpowiedzi. */
export const GOOGLE_PL: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
  "updated": "2026-10-21",
  "title": "Uprawnienia Google Calendar: sprawdź rzeczywisty dostęp",
  "short": "Dostęp i prywatność Google Calendar",
  "description": "Wybierz dostęp do dostępności, szczegółów lub edycji w Google Calendar. Sprawdź prawa publiczne i grupowe obok uprawnień konkretnych osób.",
  "lede": "Przed udostępnieniem ustal zadanie odbiorcy: sprawdzanie wolnego czasu, czytanie szczegółów czy prowadzenie kalendarza. Poradnik publikuje Arte Soft, twórca Cloud Calendars.",
  "commonBelief": "Ograniczenie jednej osoby gwarantuje, że nie zobaczy szczegółów żadną inną drogą.",
  "sections": [
    {
      "heading": "Dopasuj uprawnienie do zadania",
      "body": [
        "Współpracownik szukający terminu może potrzebować tylko informacji o zajętości. Osoba prowadząca projekt potrzebuje innego dostępu. Najpierw określ zadanie, potem sprawdź bieżące ustawienia.",
        "Google rozróżnia dostępność, szczegóły i kilka poziomów edycji. Jeden ogranicza dostęp do prywatnych wydarzeń; drugi pozwala na edycję i szczegóły; najszerszy obejmuje zarządzanie udostępnianiem. Nie traktuj wszystkich opcji zmian jako równoważnych."
      ]
    },
    {
      "heading": "Sprawdź odbiorców całego kalendarza",
      "body": [
        "Poza osobami sprawdź publikację publiczną, dostęp organizacji i grup. Według Google szerszy dostęp może przeważyć nad węższym: ograniczenie osoby nie ukrywa już publicznych szczegółów.",
        "Przed wpisaniem prywatnej wizyty do harmonogramu klubu sprawdź całą publiczność, nie tylko ustawienie przy znajomym. Prywatne terminy umieszczaj we właściwym kalendarzu."
      ]
    },
    {
      "heading": "Otwórz ustawienia właściwego kalendarza Google",
      "body": [
        "W Google Calendar na komputerze znajdź kalendarz, otwórz jego menu i ustawienia udostępniania. Osoby lub grupy oraz szerszy dostęp mają osobne obszary. Sprawdź nazwę i zalogowane konto.",
        "Potwierdź tożsamość Google odbiorcy. Jeśli kalendarz nie jest widoczny, sprawdź adres i zaproszenie zamiast zwiększać dostęp. Brak widoku i brak prawa do edycji to różne problemy."
      ]
    },
    {
      "heading": "Testuj bez prywatnych danych",
      "body": [
        "Użyj próbnego terminu bez prywatnego tytułu, notatek, miejsca i gości. Poproś odbiorcę o potwierdzenie widoczności, a edycji tylko wtedy, gdy jest potrzebna i dozwolona. Nie udostępniaj danych logowania.",
        "Zapisz kalendarz i rolę, a po zmianie sprawdź wynik. Test nie dowodzi, że wcześniej przeczytane lub skopiowane informacje zniknęły. Nie publikuj prawdziwego grafiku pracy jako testu."
      ]
    },
    {
      "heading": "Oddziel zasady pracy od planu aplikacji",
      "body": [
        "Administrator Google w pracy lub szkole może ograniczać udostępnianie. Jeśli opcja jest niedostępna, skorzystaj z zatwierdzonej metody. Nie publikuj danych służbowych w celu obejścia ograniczeń.",
        "Plany Cloud Calendars nie zmieniają praw Google. Advanced usuwa reklamy, a nie zapewnia dostępu do wszystkich wydarzeń. Sprawdź wynik zaakceptowany przez dostawcę, nie tylko dostępny lokalny edytor."
      ]
    },
    {
      "heading": "Usuń zbędne drogi dostępu",
      "body": [
        "Po projekcie przejrzyj osoby, grupy i publikację. Usunięcie jednego nazwiska to tylko część zadania, jeśli istnieją inne drogi. Ustal, kto utrzymuje harmonogram i przyszłe prawa.",
        "Google osobno opisuje usuwanie osób lub grup i wyłączanie szerszego udostępniania. To nie wycofa eksportów, zrzutów ekranu ani kopii. Omów je oddzielnie z zainteresowanymi osobami."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Określ kalendarz i zadanie odbiorcy.",
    "Sprawdź dostęp indywidualny, grupowy, organizacyjny i publiczny.",
    "Wybierz właściwe bieżące uprawnienie Google.",
    "Potwierdź tożsamość przed zmianą dostępu.",
    "Sprawdź neutralne wydarzenie próbne po stronie odbiorcy.",
    "Usuń stare uprawnienia bez zakładania, że wszystkie kopie znikną."
  ],
  "faq": [
    {
      "q": "Czy ograniczenie osoby przeważa nad publicznym kalendarzem?",
      "a": "Nie. Google wskazuje pierwszeństwo szerszych uprawnień przy sprzeczności. Sprawdź ustawienia publiczne i organizacyjne obok wpisu osoby."
    },
    {
      "q": "Czy wszystkie prawa edycji tak samo ujawniają wydarzenia prywatne?",
      "a": "Nie. Google oddziela edycję z ograniczeniem prywatnych wydarzeń od innych praw edycji i zarządzania. Przeczytaj dokładne aktualne uprawnienie."
    },
    {
      "q": "Czy Advanced zmienia uprawnienia Google?",
      "a": "Nie. Advanced usuwa reklamy w Cloud Calendars. Dostęp zależy od kalendarza i ograniczeń organizacji."
    }
  ],
  "sourcesHeading": "Aktualne wskazówki Google",
  "sources": [
    {
      "label": "Google: wybór uprawnień kalendarza",
      "url": "https://support.google.com/calendar/answer/15716974?hl=en"
    },
    {
      "label": "Google: udostępnianie i usuwanie dostępu",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    }
  ],
  "seeAlso": [
    "why-a-shared-calendar-does-not-appear",
    "sharing-one-event-not-your-calendar"
  ]
},

  'why-a-shared-calendar-does-not-appear': {
    "updated": "2026-10-21",
    "title": "Ktoś udostępnił ci kalendarz, a jego nie ma",
    "short": "Udostępniony kalendarz się nie pojawia",
    "description": "Brakuje udostępnionego kalendarza Google? Sprawdź zaproszone konto, grupę, widoczność i rodzaj linku.",
    "lede": "Ten poradnik przygotowała Arte Soft, twórca Cloud Calendars. Najpierw odróżnij brak dostępu od kalendarza, który jest tylko ukryty.",
    "commonBelief": "Że przyjęcie udostępnionego kalendarza umieszcza go w telefonie.",
    "sections": [
      {
        "heading": "Sprawdź konto i grupę",
        "body": [
          "Porównaj adresata zaproszenia z kontem Google w telefonie i przeglądarce. Otwórz link z zaproszenia na właściwym koncie. Google obsługuje udostępnianie osobom i Grupom Google. Przy dostępie przez grupę poproś jej administratora o potwierdzenie członkostwa, a właściciela kalendarza o sprawdzenie uprawnień właściwej grupy. Przekazany e-mail sam w sobie nie nadaje dostępu."
        ]
      },
      {
        "heading": "Ukryty, nieobecny czy ograniczony?",
        "body": [
          "Otwórz menu Kalendarza Google na iPhonie lub iPadzie. Jeśli kalendarz jest na liście bez zaznaczenia, zaznacz go. Jeśli go nie ma, poproś właściciela o sprawdzenie dostępu: prośba nie oznacza zgody. Zasady firmy lub szkoły mogą ograniczać udostępnianie. Porównaj to samo konto w Kalendarzu Google w przeglądarce. Jeśli tam działa, sprawdź połączone konto i wybrane kalendarze w drugiej aplikacji. Dostęp tylko do odczytu nie pozwala edytować."
        ]
      },
      {
        "heading": "Rozpoznaj rodzaj linku",
        "body": [
          "Zaproszenie do udostępnionego kalendarza też zawiera link; nie każdy link jest subskrypcją ICS. Zapytaj, czy daje dostęp do kalendarza Google, czy publikuje kanał tylko do odczytu. Według Google nowa subskrypcja wymaga przeglądarki na komputerze; otwarcie kalendarza już udostępnionego e-mailem to inna czynność. Aktualizacja kanału zależy od usługi odbierającej. Nie ma uniwersalnego czasu oczekiwania; pilne zmiany potwierdź z organizatorem."
        ]
      }
    ],
    "claims": {},
    "faq": [
      {
        "q": "Czy Grupa Google może uzyskać dostęp?",
        "a": "Tak. Sprawdź wybraną grupę, swoje członkostwo i ograniczenia organizacji. Przekazany e-mail grupowy nie potwierdza dostępu."
      },
      {
        "q": "Czy usunąć konto i połączyć je ponownie?",
        "a": "Najpierw sprawdź konto, prawa i widoczność oraz porównaj kalendarz w przeglądarce. Ponowne połączenie nie nada brakujących praw."
      }
    ],
    "practical": [
      "Potwierdź zaproszone konto i członkostwo w grupie.",
      "Zaznacz kalendarz, jeśli jest na liście, ale ukryty.",
      "Poproś właściciela o sprawdzenie dostępu przed zmianą połączeń."
    ],
    "sourcesHeading": "Źródła i dodatkowe informacje",
    "sources": [
      {
        "label": "Google: Sprawdź konto i grupę",
        "url": "https://support.google.com/calendar/answer/37082?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Ukryty, nieobecny czy ograniczony?",
        "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Rozpoznaj rodzaj linku",
        "url": "https://support.google.com/calendar/answer/37648?hl=en"
      }
    ],
    "seeAlso": [
      "who-can-see-what-in-google-calendar",
      "google-calendars-that-never-reach-your-iphone"
    ]
  },

  'the-secret-address-of-a-google-calendar': {
    title: 'Co naprawdę zdradza tajny adres kalendarza Google',
    short: 'Tajny adres iCal',
    description:
      'Google oferuje prywatny adres, który pokazuje cały twój kalendarz każdemu, kto go ma. Co odsłania i dlaczego nie da się go cicho wycofać.',
    lede: 'W ustawieniach każdego kalendarza Google tkwi link pokazujący wszystko, co się w nim znajduje. Bez logowania, bez uprawnień, bez śladu po tym, kto go otworzył.',
    commonBelief: 'Że prywatny adres jest prywatny, bo trudno go znaleźć.',
    sections: [
      {
        heading: 'Link to hasło, którego nie zmienisz dla jednej osoby',
        body: [
          'Tajny adres niesie pełne szczegóły — tytuły, godziny, miejsca, notatki. Widzi je każdy, kto ma link, i nie istnieje lista, kto to jest.',
          'Jego jedyną ochroną jest losowa część adresu. Przed zgadywaniem chroni naprawdę, a przed przesłaniem dalej, udostępnionym ekranem czy dokumentem, który przeżyje twoją pracę — wcale.',
        ],
      },
      {
        heading: 'Zresetowanie psuje go wszystkim',
        body: [
          'Adres można zresetować i stary umiera. Umiera także dla każdego współpracownika, każdego pulpitu i każdego skryptu, który po cichu na nim polegał, bez żadnego ostrzeżenia.',
          'To argument, by nigdy nie rozdawać adresu kalendarza, w którym żyjesz. Opublikuj kalendarz zrobiony do tego celu, a reset nic cię nie kosztuje.',
        ],
      },
    ],
    claims: {
      linkLength: 'Losowe znaki chroniące nasz link do udostępniania',
      sharePrice: 'Ile kosztuje udostępnienie wydarzenia z aplikacji',
    },
    faq: [
      {
        q: 'Co ktoś może zrobić z tajnym adresem mojego kalendarza?',
        a: 'Zobaczyć wszystko, co w nim jest — tytuły, godziny, miejsca i notatki — bez logowania, bez uprawnień i bez śladu, że zaglądał.',
      },
      {
        q: 'Czy mogę odebrać tajny adres kalendarza?',
        a: 'Tylko przez zresetowanie, co zabija stary dla wszystkich naraz: współpracowników, pulpity i każdy skrypt, który po cichu na nim polegał, bez ostrzeżenia.',
      },
      {
        q: 'Czy mogę wysłać tajny adres współpracownikowi mailem?',
        a: 'Traktuj go jak publiczny od chwili, gdy opuści twoje ręce. Jedyną ochroną jest to, że trudno go zgadnąć, a przesłanie dalej znosi dokładnie to.',
      },
    ],
    practical: [
      'Traktuj tajny adres jak publiczny od chwili, gdy opuści twoje ręce.',
      'Nigdy nie publikuj adresu kalendarza, z którego naprawdę korzystasz.',
      'Zresetuj go, gdy ktoś odchodzi, i uprzedź tych, którym przez to przestanie działać.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'taking-back-a-calendar-you-shared'],
  },

  'what-guests-can-do-to-your-event': {
    title: 'Co goście mogą zrobić z twoim wydarzeniem',
    short: 'Uprawnienia gości',
    description:
      'Trzy pola decydują, czy gość może przesunąć twoje spotkanie, zaprosić obcych albo przeczytać całą listę. Są włączone częściej, niż się wydaje.',
    lede: 'Zaproszenie kogoś daje mu więcej niż miejsce i godzinę. W zwykłym wydarzeniu Google gość zwykle widzi, kogo jeszcze zaproszono, a często może dopisać kolejnych.',
    commonBelief: 'Że gość może tylko przyjąć albo odmówić.',
    sections: [
      {
        heading: 'Trzy pola',
        body: [
          'Modyfikowanie wydarzenia pozwala gościowi zmienić godzinę, miejsce i tytuł dla wszystkich. Rzadko pożądane, łatwo zostawiane włączone.',
          'Zapraszanie innych pozwala mu dodać ludzi, których nigdy nie spotkałeś. Widzenie listy gości pokazuje wszystkich zaproszonych i ich odpowiedzi — w porządku w zespole, niezręcznie u klienta, błędnie przy czymkolwiek przypominającym grupę odrębnych klientów.',
        ],
      },
      {
        heading: 'Gdzie po cichu idzie to źle',
        body: [
          'Jedno wydarzenie, wielu pojedynczych odbiorców, widoczna lista: teraz każdy ma każdego. Odznaczenie tego pola to różnica między spotkaniem a wyciekniętą książką adresową.',
          'Ustawienia żyją w wydarzeniu, nie na koncie, więc za każdym razem wracają do twoich wartości domyślnych i trzeba o nich pomyśleć przy wydarzeniach, które mają znaczenie, a nie raz na zawsze.',
        ],
      },
    ],
    claims: {
      sharePrice: 'Ile kosztuje wysłanie pojedynczego wydarzenia z aplikacji',
    },
    faq: [
      {
        q: 'Czy goście widzą się nawzajem w zaproszeniu z Kalendarza Google?',
        a: 'Domyślnie zwykle tak. „Widzenie listy gości” pokazuje wszystkich zaproszonych i ich odpowiedzi: w zespole w porządku, przy kliencie niezręcznie, a przy osobnych klientach po prostu źle.',
      },
      {
        q: 'Czy gość może zmienić godzinę mojego spotkania?',
        a: 'Jeśli „modyfikowanie wydarzenia” jest zaznaczone, tak, i zmiana obowiązuje wszystkich. Rzadko tego chcemy i łatwo zostawić włączone.',
      },
      {
        q: 'Jak powstrzymać gości przed zapraszaniem innych?',
        a: 'Odznacz „zapraszanie innych” w samym wydarzeniu. Te ustawienia należą do wydarzenia, nie do konta, więc za każdym razem wracają do twoich wartości domyślnych.',
      },
    ],
    practical: [
      'Wyłącz „widzenie listy gości” we wszystkim, co idzie do osób, które się nie znają.',
      'Zostaw „modyfikowanie wydarzenia” wyłączone, chyba że ktoś naprawdę planuje za ciebie.',
      'Sprawdzaj pola w wydarzeniu, nie w ustawieniach — tam właśnie mieszkają.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'why-a-shared-calendar-does-not-appear'],
  },

  'google-calendars-that-never-reach-your-iphone': {
    title: 'Dlaczego część kalendarzy Google nigdy nie trafia na iPhone’a',
    short: 'Brakujące kalendarze Google na iPhonie',
    description:
      'Jedno konto Google, kilka kalendarzy i tylko jeden w telefonie. Lista synchronizacji, która o tym decyduje, i co zrobić zamiast tego.',
    lede: 'Twoje konto Google trzyma osiem kalendarzy. iPhone pokazuje dwa. Nic nie jest zepsute: coś, czego nigdy nie widziałeś, wybrało za ciebie.',
    commonBelief: 'Że dodanie konta Google do iPhone’a dodaje kalendarze, które ono zawiera.',
    sections: [
      {
        heading: 'Lista, której nigdy ci nie pokazano',
        body: [
          'Google prowadzi dla każdego urządzenia listę kalendarzy, które wolno synchronizować, a kalendarze dodatkowe — udostępnione, subskrybowane, założone do projektu — często są poza nią.',
          'Ta lista nie leży w ustawieniach iOS. Mieszka na osobnej stronie Google i dlatego szukanie w oczywistym miejscu nie znajduje nic złego i nic nie zmienia.',
        ],
      },
      {
        heading: 'Druga droga',
        body: [
          'Aplikacja rozmawiająca z Google bezpośrednio nie używa tej listy, więc pokazuje każdy kalendarz, który konto naprawdę ma, łącznie z tymi, które telefon po cichu porzucił.',
          'To zbliża też konta. Jeden widok z prywatnym, służbowym i udostępnionym jest sensem całej rzeczy; czy telefon zsynchronizowałby każdy z nich, przestaje być pytaniem.',
        ],
      },
    ],
    claims: {
      accounts: 'Rodzaje kont, które jeden widok trzyma razem',
      price: 'Ile kosztuje strona Google',
    },
    faq: [
      {
        q: 'Dlaczego na iPhonie widać tylko część moich kalendarzy Google?',
        a: 'Google prowadzi dla każdego urządzenia listę kalendarzy, którym wolno się synchronizować, a kalendarze dodatkowe — udostępnione, subskrybowane, założone do projektu — często są poza nią.',
      },
      {
        q: 'Gdzie jest ustawienie synchronizacji Kalendarza Google dla iPhone’a?',
        a: 'Nie w ustawieniach iOS. Mieszka na osobnej stronie Google i dlatego szukanie w oczywistym miejscu niczego nie znajduje i niczego nie zmienia.',
      },
      {
        q: 'Jak zobaczyć wszystkie kalendarze Google na iPhonie?',
        a: 'Przez aplikację, która pyta Google bezpośrednio, zamiast przez listę urządzenia. Pokazuje każdy kalendarz, który konto naprawdę ma, łącznie z porzuconymi przez telefon.',
      },
    ],
    practical: [
      'Sprawdź listę synchronizacji Google, zanim uznasz konto za zepsute.',
      'Zakładaj, że kalendarze subskrybowane i udostępnione są wykluczone, nie włączone.',
      'Jeśli trzymasz więcej niż dwa kalendarze, czytaj je przez coś, co pyta Google bezpośrednio.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'icloud-google-and-outlook-in-one-view'],
  },

  'taking-back-a-calendar-you-shared': {
    title: 'Odbieranie kalendarza, który udostępniłeś',
    short: 'Cofanie dostępu',
    description:
      'Usunięcie kogoś z kalendarza zatrzymuje to, co dopiero nadejdzie. Nie cofa tego, co już się wydarzyło.',
    lede: 'Zakończenie dostępu to jedno dotknięcie. Decyzja, czy jedno wystarczy, trwa nieco dłużej, bo udostępnianie zostawia kopie.',
    commonBelief: 'Że usunięcie osoby usuwa to, co zobaczyła.',
    sections: [
      {
        heading: 'Co się kończy, a co zostaje',
        body: [
          'Usuń osobę, a kalendarz znika z jej listy natychmiast i bez wiadomości. Przyszłe wydarzenia nigdy do niej nie dotrą.',
          'Co nie wraca: zaproszenia, które już ma, wydarzenia skopiowane do własnego kalendarza, wszystko, co wyeksportowano, i wszystko, do czego dostała tajny adres. Dostęp się kończy; pamięć nie.',
        ],
      },
      {
        heading: 'To, co przeżywa usunięcie',
        body: [
          'Jeśli ktoś kiedykolwiek miał prawo zarządzać udostępnianiem, mógł dodać kolejne osoby. Usunięcie go zostawia je na miejscu — tak kalendarz kończy udostępniony komuś, kogo nikt nie pamięta zapraszać.',
          'Czytaj więc całą listę, zamiast skreślać jedno nazwisko, i rób to przy pożegnaniu, nie miesiące później. Nic o tym nie przypomina, a udostępnienia tylko się kumulują.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Miesięczny koszt poziomu, na którym się tym zarządza, w dolarach',
    },
    faq: [
      {
        q: 'Czy usunięcie osoby kasuje to, co już zobaczyła?',
        a: 'Nie. Zaproszenia, które już ma, wydarzenia skopiowane do własnego kalendarza i wszystko wyeksportowane zostają. Dostęp się kończy, kopie nie.',
      },
      {
        q: 'Czy osoba dowie się, że odebrałem jej dostęp?',
        a: 'Nie. Kalendarz znika z jej listy natychmiast i bez wiadomości.',
      },
      {
        q: 'Dlaczego mój kalendarz jest udostępniony komuś, kogo nigdy nie zapraszałem?',
        a: 'Dodał go ktoś, kto miał prawo zarządzać udostępnianiem. Usunięcie tej osoby zostawia na miejscu wszystkich przez nią dodanych — dlatego czyta się całą listę, a nie jedno nazwisko.',
      },
    ],
    practical: [
      'Przeczytaj pełną listę dostępu, nie tylko nazwisko, które chciałeś usunąć.',
      'Zresetuj tajny adres, jeśli ta osoba kiedykolwiek go miała.',
      'Zakładaj, że kopie przetrwają: naprawdę wrażliwe rzeczy przenieś, zamiast je ukrywać.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
