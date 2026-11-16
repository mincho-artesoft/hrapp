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
  "title": "Tajny adres iCal Google: odróżnij subskrypcję od udostępniania",
  "short": "Tajny adres iCal",
  "description": "Poznaj tajny adres iCal Google, połączenia kont i kanały. Reaguj na ujawnienie adresu bez obietnic natychmiastowych aktualizacji lub usunięcia kopii.",
  "lede": "Adres kalendarza, połączenie konta i zaproszenie pełnią różne funkcje. Ustal, co masz, zanim użyjesz tego w innej aplikacji. Poradnik publikuje Arte Soft, twórca Cloud Calendars.",
  "commonBelief": "Tajny adres kalendarza miałby być osobistym zaproszeniem, które można cofnąć tylko jednemu odbiorcy.",
  "sections": [
    {
      "heading": "Dobierz połączenie do zadania",
      "body": [
        "Google odróżnia logowanie do innej aplikacji od wyświetlania przez tajny adres iCal. Połączenie konta może umożliwiać edycję, a adres zapewnia subskrypcję tylko do odczytu. Google przeznacza tajny adres do własnego użytku i odradza przekazywanie go innym.",
        "Wyświetlanie własnego grafiku w zgodnej aplikacji różni się od przyznania koledze stałego dostępu. Ustal, czy chcesz oglądać swój plan, współpracować z konkretną osobą, czy publikować harmonogram dla odbiorców. Nie wybieraj URL-a tylko dlatego, że łatwo go wkleić."
      ]
    },
    {
      "heading": "Znajdź właściwy kalendarz, nie tylko konto",
      "body": [
        "Na komputerze instrukcje Google umieszczają tajny adres w formacie iCal w ustawieniach integracji wybranego kalendarza. Najpierw sprawdź nazwę. Administrator pracy lub szkoły może ograniczać tę opcję; brak adresu nie jest powodem do upublicznienia kalendarza.",
        "Nie umieszczaj adresu na zrzutach ekranu, w publicznych zgłoszeniach ani wspólnych notatkach. Prosząc o pomoc, opisz typ konta, nazwę i sposób połączenia bez URL-a. Zwykle najpierw trzeba ustalić drogę połączenia, zanim potrzebna będzie treść wydarzeń."
      ]
    },
    {
      "heading": "Sprawdź, co dodała aplikacja odbierająca",
      "body": [
        "Subskrypcja śledzi kanał, a import pliku tworzy oddzielną kopię. Przeczytaj instrukcje aplikacji i potwierdź wykonywaną czynność. Otwarcie pobranego pliku kalendarza nie oznacza, że dodane spotkania będą śledzić przyszłe zmiany.",
        "Porównaj nazwę kalendarza, datę i szczegóły na zwykłym, znanym wydarzeniu bez poufnych danych. Nie twórz drugiej subskrypcji do diagnozowania pierwszej: dwie kopie mogą sprawić, że opóźnienie wygląda jak konflikt. Tymczasowo ukryj jeden kalendarz, by rozpoznać źródło."
      ]
    },
    {
      "heading": "Oddziel linki Google od Cloud Calendars",
      "body": [
        "Cloud Calendars ma własne sposoby udostępniania wydarzeń i kalendarzy, w tym kanały subskrypcji. Nie są to tajne adresy Google. Przed otwarciem ustal, czy nadawca udostępnił wydarzenie, kalendarz czy zaproszenie powiązane z kontem.",
        "Odbiorca Cloud Calendars może mieć rolę Reader, Writer lub Owner. Sam adres kanału nie dowodzi prawa edycji. Adres do podglądu Google także nie czyni Cię właścicielem kalendarza. Zapytaj nadawcę, w którym systemie wprowadzać zmiany."
      ]
    },
    {
      "heading": "Uwzględnij odświeżanie po stronie odbiorcy",
      "body": [
        "Subskrypcja nie gwarantuje natychmiastowego dostarczenia. Kanały Cloud Calendars podają sugerowany odstęp odświeżania, ale aplikacja odbierająca decyduje, kiedy pobiera i wyświetla zmiany. Stara godzina na jednym urządzeniu nie dowodzi, że organizator nie zapisał zmiany.",
        "Przy spotkaniu tego samego dnia porównaj aktualny plan organizatora i potwierdź ważne zmiany bezpośrednio. Zanotuj, który kalendarz pokazuje stare dane i kiedy go sprawdzono. Nie importuj wydarzenia wielokrotnie ani nie usuwaj źródła, by wymusić aktualizację kanału."
      ]
    },
    {
      "heading": "Reaguj na ujawnienie bez obietnicy wycofania wszystkich kopii",
      "body": [
        "Google opisuje reset ujawnionego tajnego adresu: unieważnia stary i tworzy nowy. Ustal własne aplikacje korzystające z adresu, aby potem zaktualizować subskrypcje. Reset adresu różni się od usunięcia konkretnego współpracownika.",
        "Wcześniej zapisane spotkania, eksporty i zrzuty ekranu to osobna kwestia. Zmiana linku nie dowodzi zniknięcia każdej kopii. Jeśli dane trafiły do niewłaściwych osób, oceń ich treść i odbiorców, zamiast uznawać udany reset za dowód pełnego usunięcia."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Ustal, czy używasz połączenia konta, zaproszenia, subskrypcji czy pliku.",
    "Sprawdź kalendarz źródłowy przed skopiowaniem adresu.",
    "Zachowaj tajny adres Google do własnych zgodnych aplikacji.",
    "Potwierdź, że aplikacja subskrybuje kanał, a nie importuje kopię.",
    "Pilne zmiany potwierdź u organizatora zamiast polegać na odświeżaniu.",
    "Po ujawnieniu adresu wykonaj reset według Google i zaktualizuj właściwe połączenia."
  ],
  "faq": [
    {
      "q": "Czy mogę przekazać tajny adres koledze?",
      "a": "Google zaleca używać go tylko we własnych aplikacjach. Gdy inna osoba potrzebuje dostępu, skorzystaj z ustawień udostępniania i wybierz właściwe uprawnienie."
    },
    {
      "q": "Czy subskrypcja pozwoli edytować oryginał?",
      "a": "Tajny adres iCal Google służy do podglądu. Edycja wymaga odpowiedniego połączenia konta i uprawnień; role udostępniania Cloud Calendars są odrębnym rozwiązaniem."
    },
    {
      "q": "Czy reset adresu usuwa stare spotkania wszędzie?",
      "a": "Unieważnia stary adres Google. Nie potwierdza usunięcia niezależnie zapisanych plików, spotkań ani zrzutów ekranu."
    }
  ],
  "sourcesHeading": "Wskazówki dostawców i dalsze informacje",
  "sources": [
    {
      "label": "Google: połączenia kont i tajne adresy iCal",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    },
    {
      "label": "Google: udostępnianie kalendarza",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: import, subskrypcja i czas aktualizacji",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "taking-back-a-calendar-you-shared",
    "sharing-one-event-not-your-calendar"
  ],
  "updated": "2026-10-21"
},

  'what-guests-can-do-to-your-event': {
  "title": "Uprawnienia gości Google: edycja, zaproszenia i lista uczestników",
  "short": "Uprawnienia gości wydarzenia",
  "description": "Sprawdź uprawnienia gości i ustawienia domyślne Google. Odróżnij prawa zaproszenia od dostępu do kalendarza i ról Cloud Calendars.",
  "lede": "Możliwość odpowiedzi nie opisuje wszystkich działań gościa. Sprawdź uprawnienia przed użyciem jednego zaproszenia dla zespołu, klientów lub publiczności. Poradnik publikuje Arte Soft, twórca Cloud Calendars.",
  "commonBelief": "Zaproszeni goście mogą tylko przyjąć lub odrzucić, a każda aplikacja pokazuje identyczne ustawienia uprawnień.",
  "sections": [
    {
      "heading": "Zacznij od organizatora i oryginalnego wydarzenia",
      "body": [
        "Otwórz właściwe wydarzenie w Kalendarzu Google na koncie organizatora lub uprawnionego zarządcy. Przed zmianą sprawdź kalendarz, datę i organizatora. Osobno zaimportowane spotkanie nie jest wiarygodnym miejscem kontroli oryginalnego zaproszenia.",
        "Dla spotkania zespołu ustal, kto może zmienić termin, zapraszać innych i widzieć uczestników. To osobne decyzje. Gość, który ma przyjść, nie musi zarządzać spotkaniem."
      ]
    },
    {
      "heading": "Zdecyduj, czy goście mają zmieniać spotkanie",
      "body": [
        "Google opisuje opcję modyfikowania wydarzenia w prawach gości edytora na komputerze. To szerokie prawo współpracy, nie tylko propozycja nowej godziny. Według Google obejmuje edycję pól, oglądanie gości i rezerwację sal.",
        "Zaufany współorganizator warsztatu może potrzebować takiej swobody; klient przychodzący na wizytę niekoniecznie. Wybieraj według powierzonej odpowiedzialności i sprawdź zapisane wydarzenie, nie konfigurację innego spotkania."
      ]
    },
    {
      "heading": "Oddzielnie sprawdź zapraszanie i widoczność gości",
      "body": [
        "Google rozróżnia zapraszanie innych i oglądanie innych gości. Sprawdź obie opcje wraz z edycją. Wyłączenie jednej nie oznacza sprawdzenia drugiej, a widoczne ustawienie domyślne nie dowodzi ustawień istniejącego wydarzenia.",
        "Przy niezwiązanych klientach rozważ, czy wspólne zaproszenie jest właściwe. Dane w e-mailu, opisie lub przekazanej wiadomości wykraczają poza bieżący przełącznik listy gości. Nie umieszczaj poufnych danych uczestników w opisie, licząc, że ukryta lista je schowa."
      ]
    },
    {
      "heading": "Sprawdź ustawienia domyślne i ważne wydarzenia",
      "body": [
        "Google dokumentuje domyślne uprawnienia gości w ustawieniach wydarzeń, także możliwość modyfikacji. Kontrola nie odbywa się więc wyłącznie osobno dla każdego wydarzenia. Sprawdź wartości domyślne przy zmianie sposobu planowania, a ważne istniejące zaproszenia przejrzyj indywidualnie.",
        "Przy cyklicznym spotkaniu ustal, czy zmieniasz jedno wystąpienie, czy serię. Nie zakładaj, że zmiana preferencji przepisała stare zaproszenia. Testuj z kolegą na uzgodnionym, niepoufnym przykładzie zamiast przesuwać lub odwoływać prawdziwe spotkanie klienta."
      ]
    },
    {
      "heading": "Odróżniaj role Cloud Calendars",
      "body": [
        "Cloud Calendars ma własne role Reader, Writer i Owner. Reader pozwala przeglądać i synchronizować; Writer edytować; Owner także zarządzać udostępnianiem i dostępem z zaproszoną tożsamością. Nie są to przełączniki trzech praw gości Google.",
        "Gdy ważne jest prawo specyficzne dla Google, sprawdź oryginał w Kalendarzu Google. Widoczność uczestnika w Cloud Calendars nie dowodzi, że można tam zmienić każde ustawienie Google. Przy brakującym przycisku lub nieudanej edycji ustal usługę właściciela i tożsamość odbiorcy."
      ]
    },
    {
      "heading": "Potwierdź zapisany wynik i odpowiedzialność",
      "body": [
        "Po zapisaniu ponownie otwórz oryginalne wydarzenie i sprawdź ustawienia. W razie potrzeby poproś uprawnionego kolegę o sprawdzenie możliwości jego konta. Nie wymieniaj haseł ani prywatnych danych gości, by przyspieszyć kontrolę dostępu.",
        "Oddziel obecność od uprawnień. Prawo edycji, zaimportowana kopia i zapisane przyjęcie to różne fakty. Potwierdzenie odbioru udostępnienia w Cloud Calendars nie jest RSVP. Przy ważnym spotkaniu poproś o odpowiedź dotyczącą obecności i jasno ustal odpowiedzialność za zmiany."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Ustal konto organizatora i oryginalne wydarzenie.",
    "Zdecyduj, kto zarządza, zaprasza innych i widzi gości.",
    "Sprawdź rzeczywiste prawa gości wydarzenia Google.",
    "Przejrzyj wartości domyślne bez założenia zmiany starych wydarzeń.",
    "Traktuj role Cloud Calendars jako osobny system uprawnień.",
    "Otwórz zapisane wydarzenie i oddzielnie potwierdź obecność."
  ],
  "faq": [
    {
      "q": "Czy gość może zmienić godzinę mojego spotkania?",
      "a": "Google pozwala przyznać prawo modyfikacji. Sprawdź wydarzenie i dostęp gościa; nie wyciągaj wniosku tylko z otrzymania zaproszenia."
    },
    {
      "q": "Czy wszystkie uprawnienia ustawia się wyłącznie na każdym wydarzeniu?",
      "a": "Nie. Google opisuje także domyślne uprawnienia. Sprawdź je dla przyszłego planowania, a ważne istniejące wydarzenia obejrzyj osobno."
    },
    {
      "q": "Czy ukrycie listy usuwa wysłane już informacje?",
      "a": "Nie dowodzi usunięcia wcześniejszych e-maili, opisów, zrzutów ani niezależnych kopii. Oddzielnie sprawdź, co faktycznie rozesłano."
    }
  ],
  "sourcesHeading": "Wskazówki dostawców i dalsze informacje",
  "sources": [
    {
      "label": "Google: współpraca przy wydarzeniach i domyślne prawa gości",
      "url": "https://support.google.com/a/users/answer/13293412?hl=en"
    },
    {
      "label": "Google: pola uprawnień gości wydarzenia",
      "url": "https://developers.google.com/workspace/calendar/api/v3/reference/events"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "sharing-one-event-not-your-calendar",
    "why-a-shared-calendar-does-not-appear"
  ],
  "updated": "2026-10-21"
},

  'google-calendars-that-never-reach-your-iphone': {
  "title": "Brak kalendarza Google na iPhonie: sprawdź połączenie i wybór kalendarzy",
  "short": "Kalendarze Google niewidoczne na iPhonie",
  "description": "Znajdź brakujący kalendarz Google: sprawdź dostęp, widoczność i połączenie używane przez Kalendarz Apple lub Cloud Calendars.",
  "lede": "Gdy jeden kalendarz Google jest widoczny, a drugi nie, najpierw ustal, gdzie ten brakujący jest dostępny. Dostęp konta, wybór kalendarzy i dostępność wydarzeń to osobne kwestie. Poradnik publikuje Arte Soft, twórca Cloud Calendars.",
  "commonBelief": "Każdy brakujący kalendarz Google wynika z jednej ukrytej listy synchronizacji, a bezpośrednie połączenie gwarantuje wyświetlenie wszystkiego.",
  "sections": [
    {
      "heading": "Potwierdź, że kalendarz jest dostępny dla tego konta",
      "body": [
        "Otwórz Kalendarz Google w przeglądarce na koncie, którego chcesz używać w telefonie. Szukaj samego kalendarza, nie tylko znajomego tytułu wydarzenia. Dwa konta mogą mieć kalendarze o podobnych nazwach. Zaproszenie na służbowy adres nie potwierdza dostępu konta prywatnego.",
        "Jeśli tam też go nie ma, zacznij od właściciela lub zaproszenia do udostępnionego kalendarza. Przy dostępie grupowym potwierdź członkostwo i grupę, która otrzymała uprawnienie. Nie usuwaj konta z telefonu, dopóki podstawowa kwestia dostępu pozostaje niewyjaśniona."
      ]
    },
    {
      "heading": "Odróżnij kalendarz ukryty od nieobecnego",
      "body": [
        "Google opisuje wybieranie kalendarzy do wyświetlenia w menu aplikacji Kalendarz Google. Kalendarz obecny na liście, lecz niezaznaczony, to kwestia widoczności. Brak na liście wymaga sprawdzenia innych rzeczy: zaproszonego konta, zatwierdzenia lub połączenia.",
        "Zaproszenie do udostępnionego kalendarza przesłane e-mailem i adres subskrypcji to także różne drogi. Google osobno opisuje dodanie nowej subskrypcji w przeglądarce komputera i otwarcie kalendarza już udostępnionego e-mailem. Zachowaj oryginalne zaproszenie, ale nie publikuj prywatnych linków w publicznych prośbach o pomoc."
      ]
    },
    {
      "heading": "Ustal, jak aplikacja na iPhonie odbiera dane Google",
      "body": [
        "Kalendarz Apple może łączyć się przez konto Google skonfigurowane na urządzeniu. Instrukcja Google obejmuje włączenie Kalendarzy dla tego konta. Korzystaj z aktualnych wskazówek dla swojej wersji iOS; ustawienia osobnej aplikacji to nie to samo co ustawienia tego konta urządzenia.",
        "Cloud Calendars oferuje też bezpośrednie logowanie do Google. Przed dodaniem kolejnego połączenia ustal używane konto i drogę dostępu. Jeśli ten sam kalendarz trafia przez kalendarz urządzenia i bezpośrednie połączenie, porównaj tożsamość kalendarzy, zanim uznasz, że Google powielił wydarzenie."
      ]
    },
    {
      "heading": "Sprawdź wybór w Cloud Calendars bez zakładania pełnego zakresu",
      "body": [
        "W Cloud Calendars przejrzyj kalendarze powiązane z właściwym kontem Google i wybierz potrzebne. Synchronizacja Google sprawdza wybór kalendarzy. Samo udane logowanie nie potwierdza, że wybrano każdy kalendarz ani że wszystkie żądane aktualizacje się zakończyły.",
        "Bezpośrednie połączenie to inny sposób odbierania danych Google, nie obietnica wyświetlenia każdego dostępnego kalendarza. Jeśli jest na stronie Google, lecz nie ma go w Cloud Calendars, zanotuj konto, nazwę kalendarza i sposób połączenia dla pomocy technicznej. W pilnych sprawach korzystaj z pierwotnej usługi podczas wyjaśniania różnicy."
      ]
    },
    {
      "heading": "Odróżnij brak kalendarza od braku określonych dat",
      "body": [
        "Jeśli kalendarz jest na liście, ale brakuje spotkania, porównaj dokładnie tę datę w Kalendarzu Google. Sprawdź, czy wydarzenie należy do wybranego kalendarza i czy oglądasz to samo wystąpienie spotkania cyklicznego. Podobny tytuł w innym kalendarzu nie oznacza tego samego rekordu źródłowego.",
        "Nie zakładaj, że aplikacja pobrała wszystkie dawne i odległe przyszłe wydarzenia. Synchronizacja Google w Cloud Calendars pobiera ograniczony zakres dat. Pusty wynik wyszukiwania w przeszłości nie dowodzi usunięcia wydarzenia z Google. Przed zmianą lub ponownym utworzeniem czegokolwiek sprawdź pierwotną usługę."
      ]
    },
    {
      "heading": "Zgłoś problem z użytecznym porównaniem, zamiast resetować",
      "body": [
        "Zanotuj aplikację, typ konta, nazwę kalendarza, przykładową datę i miejsce, gdzie kalendarz jest widoczny. Jeśli pojawia się błąd, dołącz jego komunikat bez prywatnych danych. To lepiej rozdziela problemy uprawnień, wyboru i synchronizacji niż stwierdzenie, że całe konto nie działa.",
        "Przy pilnych planach potwierdź bieżące wydarzenie z organizatorem. Nie zaczynaj testów od usuwania kont, wielokrotnego importowania kopii ani przenoszenia wydarzeń między kalendarzami. Gdy problem połączenia jest zrozumiały, sprawdź wynik na tym samym przykładzie przed zmianą kolejnych ustawień."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Porównaj właściwe konto i kalendarz w internetowym Kalendarzu Google.",
    "Sprawdź, czy kalendarza nie ma, czy jest tylko niezaznaczony.",
    "Ustal, czy używasz synchronizacji Google urządzenia, bezpośredniego połączenia aplikacji czy subskrypcji.",
    "Sprawdź wybrane kalendarze właściwego konta w Cloud Calendars.",
    "Porównaj jedną dokładną datę wydarzenia w pierwotnej usłudze.",
    "Zgłoś różnicę bez ujawniania prywatnych adresów i resetowania kont."
  ],
  "faq": [
    {
      "q": "Czy bezpośrednie logowanie do Google pokaże każdy kalendarz?",
      "a": "Nie zakładaj pełnego zakresu. Liczą się konto, lista kalendarzy, wybór i udana synchronizacja. Porównaj brakujący kalendarz z Kalendarzem Google w przeglądarce."
    },
    {
      "q": "Czy usunąć konto i dodać je ponownie?",
      "a": "Najpierw sprawdź tożsamość konta, dostęp, widoczność i drogę połączenia. Ponowne połączenie nie nada uprawnienia, którego właściciel nie przyznał."
    },
    {
      "q": "Czy brak starego wydarzenia oznacza, że je usunięto?",
      "a": "Nie. Sprawdź oryginalny kalendarz Google i datę. Zakres dat lub działanie wyszukiwarki aplikacji może różnić się od historii zapisanej u dostawcy."
    }
  ],
  "sourcesHeading": "Wskazówki dostawców i dalsza lektura",
  "sources": [
    {
      "label": "Google: dodawanie wydarzeń Google do Kalendarza Apple",
      "url": "https://support.google.com/calendar/answer/99358?hl=en&co=GENIE.Platform%3DiOS"
    },
    {
      "label": "Google: subskrypcje i widoczność kalendarzy",
      "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
    },
    {
      "label": "Google: działanie listy kalendarzy",
      "url": "https://developers.google.com/workspace/calendar/api/v3/reference/calendarList/list"
    }
  ],
  "seeAlso": [
    "why-a-shared-calendar-does-not-appear",
    "icloud-google-and-outlook-in-one-view",
    "the-secret-address-of-a-google-calendar"
  ],
  "updated": "2026-10-21"
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
