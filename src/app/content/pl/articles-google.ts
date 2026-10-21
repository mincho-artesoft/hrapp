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
  "title": "Zakończ udostępnianie kalendarza: usuń dostęp i sprawdź pozostałe drogi",
  "short": "Sprawdzanie i odbieranie dostępu",
  "description": "Rozróżnij osoby, grupy, dostęp publiczny i linki kanałów przy kończeniu udostępniania. Sprawdź zmianę: zapisane kopie mogą pozostać.",
  "lede": "Kończąc współpracę, najpierw ustal sposób przyznania dostępu. Usunięcie osoby, wyłączenie publikacji i zresetowanie adresu kanału to różne czynności. Poradnik publikuje Arte Soft, twórca Cloud Calendars.",
  "commonBelief": "Usunięcie jednego odbiorcy miałoby natychmiast wycofać wszystkie kopie i zamknąć każdą inną drogę do kalendarza.",
  "sections": [
    {
      "heading": "Ustal kalendarz i sposób udostępniania",
      "body": [
        "Przed zmianą potwierdź konto właściciela, kalendarz i zamierzonych odbiorców. Kalendarz Google udostępniony konkretnej osobie to inna relacja niż kalendarz publiczny, uprawnienia grupy czy adres subskrypcji. Cloud Calendars ma także własne relacje udostępniania wydarzeń i kalendarzy.",
        "Na przykład sekretarz klubu może mieć prawo edycji z imiennego zaproszenia, a członkowie obserwować opublikowany harmonogram. Odebranie praw sekretarzowi nie określa, co powinno się stać z subskrypcjami członków. Spisz faktycznie utworzone sposoby dostępu."
      ]
    },
    {
      "heading": "Usuń właściwe uprawnienie Google",
      "body": [
        "Google opisuje osobne ustawienia dla osób lub grup, całej organizacji i dostępu publicznego. Na komputerze otwórz ustawienia udostępniania właściwego kalendarza i zmień odpowiedni wpis albo szersze ustawienie. Najpierw sprawdź zalogowane konto i nazwę kalendarza.",
        "Osoba może nadal mieć dostęp przez grupę lub szerszą publikację. Sprawdź całość zamiast wielokrotnie usuwać ten sam adres e-mail. Zasady firmy lub szkoły mogą ograniczać ustawienia; w razie potrzeby skorzystaj z procedury zatwierdzonej przez właściciela lub administratora."
      ]
    },
    {
      "heading": "Potraktuj tajny adres kalendarza oddzielnie",
      "body": [
        "Google wskazuje, że tajny adres iCal służy do własnego użytku w innej aplikacji kalendarza i nie należy przekazywać go innym. Jeśli go ujawniono, Google opisuje reset unieważniający stary adres. To inna czynność niż usunięcie konkretnej osoby.",
        "Przed zmianą używanego przez siebie adresu subskrypcji ustal zależne aplikacje i narzędzia, aby później ponownie połączyć właściwe. Nie wklejaj tajnego URL-a do publicznego zgłoszenia ani nie wysyłaj go jako dowodu znalezienia kalendarza. Podaj nazwę kalendarza i rodzaj połączenia."
      ]
    },
    {
      "heading": "Odróżnij odbiorców Cloud Calendars od linków kanałów",
      "body": [
        "W Cloud Calendars dostęp odbiorcy do wydarzenia lub kalendarza i wydany kanał subskrypcji są różnymi mechanizmami. Przed działaniem sprawdź rzeczywistą relację udostępniania oraz link. Usunięcie zidentyfikowanego odbiorcy nie gwarantuje wycofania wszystkich rozesłanych URL-i ani niezależnych kopii.",
        "Jeśli współorganizator ma tylko przestać edytować, rozważ docelową rolę i pozostałych odbiorców zamiast usuwać harmonogram. Jeśli kończy się cała współpraca, ustal właściciela i osobę, która zachowa kalendarz. Opuszczenie otrzymanego kalendarza i usunięcie własnego to różne decyzje."
      ]
    },
    {
      "heading": "Sprawdź wynik bez obietnicy natychmiastowego zniknięcia",
      "body": [
        "Sprawdź zapisanie zmiany w systemie właściciela. Jeśli upoważniony współpracownik może pomóc, niech sprawdzi podgląd lub edycję na swoim koncie bez udostępniania haseł. Odróżnij odmowę dostępu od starego wydarzenia nadal widocznego w pamięci podręcznej lub zaimportowanej kopii.",
        "Nie obiecuj jednego czasu odświeżania ani braku powiadomień. Przy przekazaniu obowiązków poinformuj, który harmonogram obowiązuje dalej. Widoczny stary wpis sam nie rozstrzyga, czy osoba ma aktywny dostęp, inne uprawnienie, czy niezależną kopię."
      ]
    },
    {
      "heading": "Zajmij się wcześniejszymi kopiami osobno",
      "body": [
        "Wyeksportowane pliki, zrzuty ekranu, wiadomości i samodzielnie zapisane spotkania mogą pozostać po zmianie dostępu. Ustal, które kopie mają znaczenie dla przekazania obowiązków, i omów ich obsługę z zainteresowanymi. Zmiana uprawnienia nie ustala, co każdy odbiorca już zapisał.",
        "Zachowaj potrzebne dane źródłowe podczas sprawdzania wyniku. Nie przenoś poufnych spotkań do innego udostępnionego kalendarza tylko po to, by stary wyglądał na pusty, ani nie odwołuj prawdziwych zaproszeń jako testu dostępu. Zapisz kalendarz, drogę udostępniania i zmianę na potrzeby dalszej diagnostyki."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Ustal konto właściciela, kalendarz i sposób udostępniania.",
    "Sprawdź oddzielnie osoby, grupy i szerszą publikację.",
    "Użyj odpowiednich ustawień Google lub Cloud Calendars.",
    "Osobno zdecyduj o resecie ujawnionego tajnego adresu kanału.",
    "Potwierdź zapisany dostęp bez przekazywania danych logowania.",
    "Zaplanuj obsługę wcześniejszych eksportów i kopii niezależnie od aktywnego dostępu."
  ],
  "faq": [
    {
      "q": "Czy usunięcie osoby wyłącza kalendarz publiczny lub jej dostęp grupowy?",
      "a": "Nie zakładaj tego. Sprawdź każdą rzeczywistą drogę. Google opisuje indywidualnych odbiorców, grupy i szerszą publikację jako osobne ustawienia."
    },
    {
      "q": "Czy kalendarz zniknie natychmiast i bez powiadomienia?",
      "a": "Nie ma uniwersalnej gwarancji zniknięcia, powiadomień ani czasu odświeżania. Potwierdź zapisaną zmianę i odróżnij aktywny dostęp od danych podręcznych lub importowanych."
    },
    {
      "q": "Czy Advanced daje możliwość usuwania dostępu do kalendarza Google?",
      "a": "Advanced usuwa reklamy w Cloud Calendars. Ustawienia Google zależą od własności, uprawnień i zasad organizacji, a nie od tego planu aplikacji."
    }
  ],
  "sourcesHeading": "Wskazówki dostawcy dotyczące dostępu i subskrypcji",
  "sources": [
    {
      "label": "Google: ustawienia udostępniania i kończenie dostępu",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Google: synchronizacja kont i tajne adresy iCal",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "the-secret-address-of-a-google-calendar",
    "why-a-shared-calendar-does-not-appear"
  ],
  "updated": "2026-10-21"
},
};
