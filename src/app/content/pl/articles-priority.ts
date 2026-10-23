import type { LocalisedArticle } from '../types';

export const PRIORITY_PL: Readonly<Record<string, LocalisedArticle>> = {
  "forecast-beside-every-event": {
    "title": "Sprawdź godzinową pogodę dla wydarzenia w kalendarzu na iPhonie i iPadzie",
    "short": "Pogoda na godziny wydarzenia",
    "description": "Dopasuj miejsce, datę i godziny wydarzenia do dostępnej prognozy pogody.",
    "lede": "Aby sprawdzić pogodę dla wydarzenia w kalendarzu, dopasuj trzy elementy: miejsce, lokalną datę i przedział od początku do końca wydarzenia. W Cloud Calendars wybierz lokalizację pogody i sprawdź dostępne godziny. Adres wydarzenia i pobliska ikona pogody same w sobie nie dowodzą, że to się zgadza. Ten przewodnik publikuje Arte Soft, twórca aplikacji.",
    "commonBelief": "Że dzienna ikona pogody w kalendarzu to ta sama funkcja co prognoza przypisana do wydarzenia.",
    "sections": [
      {
        "heading": "Zacznij od miejsca i daty",
        "body": [
          "Otwórz prognozę dla wybranej lokalizacji i porównaj jej datę z wpisem w kalendarzu. Pogoda w kalendarzu może odzwierciedlać wybrane miejsce pogody, więc upewnij się, że jest ono właściwe dla wydarzenia, zamiast zakładać, że decyduje o tym adres wydarzenia.",
          "Wydarzenie w przyszłym miesiącu może istnieć jeszcze przed udostępnieniem danych pogodowych na ten dzień. Zachowaj wydarzenie i wróć do prognozy bliżej jego daty; brak informacji o pogodzie nie oznacza prognozy bezchmurnej pogody."
        ]
      },
      {
        "heading": "Przy pytaniu o konkretną godzinę korzystaj ze szczegółów godzinowych",
        "body": [
          "Podsumowanie dzienne i prognoza godzinowa odpowiadają na różne pytania. Jeśli wydarzenie trwa od drugiej do piątej, sprawdź dostępne godziny obejmujące ten przedział, zamiast traktować jedną dzienną ikonę jako pełny obraz sytuacji.",
          "Jeśli dostępna jest tylko część tego przedziału, pozostaw resztę jako nierozstrzygniętą. Aplikacja nie obiecuje pełnej prognozy godzinowej dla każdego wydarzenia, które możesz utworzyć, a ten przewodnik nie obiecuje, że otwarcie dowolnego wydarzenia zawsze pokaże całe odpowiadające mu okno pogodowe."
        ]
      },
      {
        "heading": "Oddziel prawdopodobieństwo, ilość i czas",
        "body": [
          "Przeczytaj etykietę przy sprawdzanej wartości. Prawdopodobieństwo opadów to nie ilość ani czas trwania opadów. Podobnie wartość godzinowa i podsumowanie dzienne obejmują różne okresy; porównuj te same okresy, gdy rozważasz dwa możliwe terminy.",
          "Wybierz rozwiązanie zapasowe odpowiednie dla swojego planu, zamiast traktować jeden procent jako uniwersalną zasadę „idź albo odwołaj”. Informacje pogodowe mogą się zmieniać, więc sprawdź je ponownie, gdy trzeba podjąć decyzję."
        ]
      },
      {
        "heading": "Sprawdź przed zapisaniem wydarzenia zależnego od pogody",
        "body": [
          "Aplikacja może rozpocząć szkic wydarzenia na podstawie godziny z prognozy. Przed zapisaniem sprawdź datę, godzinę rozpoczęcia, godzinę zakończenia i kalendarz docelowy w szkicu. Wybranie prognozy nie zastępuje sprawdzenia, czy tworzysz właściwe zobowiązanie.",
          "Jeśli dostęp do kalendarza lub kalendarz docelowy uniemożliwia zapisanie, rozwiąż ten problem z uprawnieniami niezależnie od dostępu do pogody. Znalezienie prognozy nie daje uprawnień do edytowania współdzielonego kalendarza."
        ]
      },
      {
        "heading": "Korzystaj z pełnej prognozy, gdy podsumowanie nie wystarcza",
        "body": [
          "W przypadku aktywności na zewnątrz sprawdź zmienne istotne dla tej aktywności oraz dla faktycznie wybranej lokalizacji. Widżet bieżącej pogody lub demonstracja na stronie głównej nie zastępują sprawdzenia dostępnych w aplikacji godzin prognozy.",
          "Jeśli zauważysz rozbieżność, najpierw porównaj miejsce i znacznik czasu. Różni dostawcy, wybrane lokalizacje i okresy prognozy mogą dawać różne widoki, co nie dowodzi, że wydarzenie w kalendarzu się zmieniło."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Potwierdź lokalizację i datę wydarzenia.",
      "Sprawdź dostępne godziny w całym czasie aktywności.",
      "Traktuj prawdopodobieństwo i ilość jako różne wartości.",
      "Przed zapisaniem sprawdź szkic wydarzenia."
    ],
    "seeAlso": [
      "weather-inside-your-calendar",
      "planning-outdoors-without-being-rained-on"
    ],
    "updated": "2026-10-23",
    "faq": [
      {
        "q": "Czy każde wydarzenie ma pełną prognozę?",
        "a": "Nie. Zakres zależy od wybranej lokalizacji oraz dostępnych dat i godzin."
      },
      {
        "q": "Czy ikona pogody dotyczy konkretnie adresu wydarzenia?",
        "a": "Nie wyciągaj takiego wniosku tylko na podstawie bliskości do wydarzenia. Potwierdź lokalizację pogody osobno."
      },
      {
        "q": "Czy stuknięcie godziny zapisuje nowe wydarzenie?",
        "a": "Tam, gdzie to dostępne, rozpoczyna szkic wydarzenia. Przed zapisaniem sprawdź jego datę, godzinę i kalendarz."
      }
    ],
    "sourcesHeading": "Źródła pogody i ustawienia lokalizacji",
    "sources": [
      {
        "label": "Apple: prognozy WeatherKit i dostępność regionalna",
        "url": "https://developer.apple.com/weatherkit/"
      },
      {
        "label": "Apple: Prywatność i usługi lokalizacji",
        "url": "https://support.apple.com/en-us/102515"
      }
    ],
    "comparison": {
      "heading": "Praktyczna kontrola przed wydarzeniem na zewnątrz",
      "columns": [
        "Sprawdzenie",
        "Przykład",
        "Decyzja"
      ],
      "rows": [
        {
          "cells": [
            "Miejsce",
            "Wydarzenie odbywa się w innym mieście.",
            "Wybierz to miejsce docelowe w widoku pogody i odczytaj jego nazwę."
          ]
        },
        {
          "cells": [
            "Przedział czasu",
            "Aktywność trwa od 14:00 do 16:00.",
            "Sprawdź obie godziny oraz istotny czas na przygotowanie lub dojazd."
          ]
        },
        {
          "cells": [
            "Zakres danych",
            "Dostępna jest tylko część potrzebnych godzin.",
            "Pozostaw plan jako wstępny i zaplanuj kolejne sprawdzenie."
          ]
        },
        {
          "cells": [
            "Zapisywane wydarzenie",
            "Rozpoczynasz wersję roboczą z godziny prognozy.",
            "Przed zapisaniem sprawdź datę, strefę czasową, czas trwania i kalendarz docelowy."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-right",
      "week-left"
    ],
    "galleryCaption": "Widoki pogody i tygodnia pokazują różne części tego samego zadania planistycznego. Potwierdź miejsce prognozy osobno od lokalizacji wydarzenia.",
    "actionHeading": "Porównaj prognozę z rzeczywistymi wydarzeniami",
    "actionText": "Używaj Cloud Calendars na iPhonie lub iPadzie, aby sprawdzać dostępną prognozę i swój harmonogram. Pogoda pomaga w wyborze; nie przenosi automatycznie wydarzenia ani nie potwierdza zmiany z uczestnikami.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Poznaj widoki kalendarza i pogody"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Wybierz szybki przegląd na ekranie początkowym"
      },
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Sprawdź kalendarze stojące za Twoim harmonogramem"
      }
    ]
  },
  "the-widget-that-shows-what-is-next": {
    "updated": "2026-10-23",
    "title": "Widżety kalendarza na iPhone’a i iPada: nadchodzące wydarzenia i pogoda",
    "short": "Nadchodzące wydarzenia na ekranie początkowym",
    "description": "Wybierz widżet Cloud Calendars dla nadchodzących wydarzeń, daty lub pogody.",
    "lede": "Wybierz Calendar Events lub Calendar Events Large, gdy chcesz widzieć nadchodzące wydarzenia na ekranie początkowym. Wybierz Calendar & Weather, jeśli chcesz wyświetlać datę i pogodę. Te układy odpowiadają na różne pytania; przed dodaniem sprawdź podgląd tego, który jest dostępny na Twoim urządzeniu. Ten przewodnik publikuje Arte Soft, twórca Cloud Calendars.",
    "sections": [
      {
        "heading": "Najpierw wybierz układ wydarzeń",
        "body": [
          "W galerii widżetów Cloud Calendars układ Calendar Events to średni widok listy wydarzeń. Calendar Events Large daje więcej miejsca na nadchodzące wydarzenia. Calendar & Weather to osobny układ z datą i pogodą; jego mały rozmiar nie gwarantuje wiersza z następnym wydarzeniem. Nazwy na Twoim urządzeniu mogą być wyświetlane w tłumaczeniu.",
          "Na iPhone przytrzymaj puste miejsce na ekranie początkowym, wybierz Edytuj i Dodaj widżet, a następnie znajdź Cloud Calendars i wybierz odpowiedni układ. Przed dodaniem porównaj podgląd. Instrukcje Apple dotyczą tej systemowej galerii widżetów; jest ona oddzielna od widoków kalendarza w aplikacji."
        ]
      },
      {
        "heading": "Dodaj widżet i sprawdź go na iPadzie",
        "body": [
          "Na iPadzie użyj galerii widżetów ekranu początkowego Apple: przytrzymaj tło, otwórz Edytuj, a potem Dodaj widżet. Wyszukaj Cloud Calendars, przejrzyj dostępne style i rozmiary, dodaj potrzebny układ, ustaw go w wybranym miejscu i zakończ przyciskiem Gotowe. Korzystaj z elementów sterujących widocznych w Twojej wersji iPadOS; podgląd nie potwierdza, że dane kalendarza zostały już wczytane.",
          "Wybierz Calendar Events lub Calendar Events Large, gdy potrzebujesz widoku wydarzeń. Porównaj style oferowane przez zainstalowaną aplikację; kafelek z datą i pogodą odpowiada na inne potrzeby niż lista wydarzeń.",
          "Otwórz Cloud Calendars na tym iPadzie i znajdź znane przyszłe wydarzenie z określoną godziną w wybranym kalendarzu. Prawidłowy widok na iPhone nie potwierdza kont, dostępu ani wczytanych danych na iPadzie. Porównaj tytuł, datę i godzinę rozpoczęcia, a jeśli widżet pokazuje coś innego, przejdź do poniższych kontroli kwalifikowania i aktualizacji."
        ]
      },
      {
        "heading": "Sprawdź, co liczy się jako nadchodzące",
        "body": [
          "Widok wydarzeń korzysta z wybranych kalendarzy i przyszłych wydarzeń z określoną godziną. Wydarzenia całodniowe oraz wydarzenia, których godzina rozpoczęcia już minęła, są wykluczone z tej listy nadchodzących. Dlatego urodziny lub trwające spotkanie mogą być widoczne w aplikacji, ale nie pojawią się tutaj.",
          "Na przykład jeśli jedyny wpis na dziś to całodniowa informacja o podróży, pusta lista nadchodzących nie oznacza, że ten wpis zniknął. Otwórz aplikację, aby sprawdzić cały dzień. Podobnie następne wydarzenie z określoną godziną może przypadać jutro lub później; sprawdź jego datę, zamiast zakładać, że każdy wiersz dotyczy dzisiaj."
        ]
      },
      {
        "heading": "Odróżnij brakujące wydarzenie od listy, na której skończyło się miejsce",
        "body": [
          "Widżet pokazuje ograniczoną liczbę nadchodzących wydarzeń. Jeśli wcześniejsze wydarzenia zajmują jego wiersze, późniejsze może się nie pojawić, mimo że jest widoczne w aplikacji i kwalifikuje się do listy nadchodzących. Większy układ wydarzeń może pokazać więcej wierszy, ale nadal nie jest to pełny kalendarz.",
          "Zacznij od najbliższego przyszłego wydarzenia z określoną godziną w wybranym kalendarzu. Jeśli ono się pojawia, ale późniejsze nie, otwórz aplikację, aby sprawdzić resztę planu. Jeśli brakuje także najbliższego kwalifikującego się wydarzenia, przejdź do kontroli wyboru kalendarzy, dostępu i aktualizacji. Nie przenoś ani nie usuwaj wydarzeń tylko po to, aby wyświetlić późniejszy wpis."
        ]
      },
      {
        "heading": "Niech aplikacja będzie pierwszym punktem odniesienia",
        "body": [
          "Otwórz Cloud Calendars i znajdź jedno konkretne przyszłe wydarzenie z określoną godziną. Potwierdź, że jego kalendarz jest wybrany i że aplikacja ma wymagany dostęp do kalendarza. Porównaj tytuł, datę i godzinę rozpoczęcia z widżetem. Jeśli wydarzenia brakuje także w aplikacji, najpierw sprawdź konto lub synchronizację.",
          "Jeśli potrzebujesz wyraźnego przykładu, użyj nieszkodliwego wydarzenia testowego w kalendarzu, którego jesteś właścicielem. Ustaw mu przyszłą godzinę rozpoczęcia i łatwy do rozpoznania tytuł. Nie zmieniaj prawdziwego zaproszenia ani nie usuwaj kont tylko po to, by testować ekran początkowy."
        ]
      },
      {
        "heading": "Uwzględnij aktualizacje, nie zakładając sztywnego terminu",
        "body": [
          "Widżety wyświetlają zapisane informacje i nie działają stale tak jak otwarta aplikacja. Harmonogramem ich aktualizacji zarządza Apple. Otwarcie aplikacji i sprawdzenie wydarzenia daje świeży punkt odniesienia, ale nie określa dokładnej liczby sekund, po których widżet musi się zmienić.",
          "Jeśli aplikacja nadal pokazuje poprawne dane, a widżet pozostaje błędny, zanotuj układ, wybrany kalendarz, godzinę wydarzenia oraz wersje aplikacji i iOS. Pusta lista, stare wydarzenie i nieprawidłowa godzina to różne obserwacje; zgłoś dokładnie to, co widzisz."
        ]
      },
      {
        "heading": "Traktuj pogodę jako osobne podsumowanie",
        "body": [
          "Pogoda obok daty nie jest prognozą przypisaną do miejsca i godziny rozpoczęcia każdego wydarzenia. Przed wydarzeniem na zewnątrz otwórz widok pogody i sprawdź planowane miejsce oraz godzinę. Ikona bieżących warunków nie pozwala stwierdzić, jakie warunki będą podczas późniejszego spotkania.",
          "Traktuj ten widżet jako szybki punkt orientacyjny. W przypadku zobowiązań całodniowych, szczegółów wydarzeń i decyzji wymagających pełnego planu używaj pełnego kalendarza."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Wybierz Calendar Events lub Calendar Events Large, aby wyświetlić listę wydarzeń.",
      "Sprawdź przyszłe wydarzenie z określoną godziną w wybranym kalendarzu.",
      "Przed rozpoczęciem diagnozowania widżetu porównaj jego datę i godzinę w aplikacji.",
      "Zapisz utrzymujące się różnice, zamiast usuwać dane kalendarza."
    ],
    "faq": [
      {
        "q": "Dlaczego nie widzę moich urodzin?",
        "a": "Lista nadchodzących nie obejmuje wydarzeń całodniowych. Sprawdź pełny kalendarz, aby zobaczyć urodziny i inne wpisy tylko z datą."
      },
      {
        "q": "Czy mały widżet pokazuje następne spotkanie?",
        "a": "Mały układ Calendar & Weather pokazuje datę i pogodę. Wybierz układ listy wydarzeń, jeśli chcesz widzieć wydarzenia."
      },
      {
        "q": "Czy brak nadchodzącego wydarzenia oznacza, że mam dziś wolne?",
        "a": "Nie. Na ten wniosek mogą wpływać wydarzenia całodniowe, trwające wydarzenia, niewybrane kalendarze i nieaktualne informacje."
      }
    ],
    "sourcesHeading": "Źródła i instrukcje Apple",
    "sources": [
      {
        "label": "Apple: dodawanie i edycja widżetów na iPhone",
        "url": "https://support.apple.com/118610"
      },
      {
        "label": "Apple: utrzymywanie aktualności widżetu",
        "url": "https://developer.apple.com/documentation/widgetkit/keeping-a-widget-up-to-date"
      },
      {
        "label": "Apple: dodawanie, edytowanie i usuwanie widżetów na iPadzie",
        "url": "https://support.apple.com/guide/ipad/add-edit-and-remove-widgets-ipadb0de8630/ipados"
      }
    ],
    "seeAlso": [
      "choosing-a-widget-size",
      "a-countdown-to-your-next-meeting",
      "calendar-on-apple-watch"
    ],
    "comparison": {
      "heading": "Wybierz widok, którego naprawdę potrzebujesz",
      "columns": [
        "Widok",
        "Zastosowanie",
        "Sprawdź przed użyciem"
      ],
      "rows": [
        {
          "cells": [
            "Calendar Events",
            "Kompaktowy widok nadchodzących wydarzeń z określoną godziną.",
            "Wydarzenie należy do wybranego kalendarza i jeszcze się nie rozpoczęło."
          ]
        },
        {
          "cells": [
            "Calendar Events Large",
            "Więcej miejsca na nadchodzące wydarzenia.",
            "Większy układ nadal ma ograniczoną liczbę wierszy."
          ]
        },
        {
          "cells": [
            "Calendar & Weather",
            "Szybki przegląd daty i pogody.",
            "Jego mały układ nie gwarantuje wiersza z nadchodzącym wydarzeniem."
          ]
        },
        {
          "cells": [
            "Live Activity",
            "Osobne odliczanie do następnego wydarzenia na obsługiwanych ekranach iPhone.",
            "To nie jest widżet ekranu początkowego ani osobny układ widżetu ekranu blokady."
          ]
        }
      ]
    },
    "galleryKinds": [
      "widgets",
      "live"
    ],
    "galleryCaption": "Widżety ekranu początkowego i Live Activity to osobne widoki. Wybierz układ odpowiadający potrzebnym informacjom.",
    "actionHeading": "Umieść przydatną część swojego planu na ekranie początkowym",
    "actionText": "Otwórz Cloud Calendars, sprawdź znane przyszłe wydarzenie z określoną godziną, a następnie dodaj odpowiedni widżet na iPhone lub iPadzie. Aplikacja pozostaje miejscem do przeglądania pełnego kalendarza.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Sprawdź pogodę obok swojego planu"
      },
      {
        "slug": "forecast-beside-every-event",
        "label": "Sprawdź godziny wydarzenia na zewnątrz"
      },
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Sprawdź podłączone konta kalendarza"
      }
    ]
  },
  "onecal-alternative-iphone-calendar-view-or-sync": {
    "updated": "2026-10-23",
    "title": "Cloud Calendars czy OneCal? Wybierz widok łączony albo synchronizację kalendarza",
    "short": "Cloud Calendars i OneCal według sposobu pracy",
    "description": "Porównaj OneCal i Cloud Calendars pod kątem widoków, kopiowanych wydarzeń, sterowania mobilnego i planów.",
    "lede": "Wybieraj według potrzebnego efektu: wspólnego przeglądu kilku harmonogramów, edycji oryginalnego wydarzenia albo skopiowania zajętych terminów na inne konto. Cloud Calendars oferuje widoki planowania na iPhone i iPadzie; OneCal opisuje Unified Calendar View oraz osobne reguły Calendar Sync. To porównanie publikuje Arte Soft, twórca Cloud Calendars.",
    "commonBelief": "Dwa produkty, które pokazują kalendarze Google, iCloud i Outlook, muszą w ten sam sposób synchronizować dostępność, edycje wydarzeń i kopie.",
    "sections": [
      {
        "heading": "Wybierz między podglądem a zmianą na innym koncie",
        "body": [
          "Jeśli chcesz zobaczyć prywatne wydarzenie obok służbowego spotkania, potrzebujesz widoku łączonego. Jeśli w kalendarzu służbowym ma się też pojawić blok zajętości dla prywatnego wydarzenia, potrzebujesz określonego procesu ze źródła do miejsca docelowego. Pierwszy efekt nie oznacza automatycznie drugiego.",
          "Cloud Calendars zbiera wybrane kalendarze w widoku planowania na iPhone i iPadzie. OneCal opisuje Unified Calendar View oddzielnie od Calendar Sync; według wydawcy z tego widoku można korzystać bez konfigurowania reguł synchronizacji. Zdecyduj, jaki efekt jest ważny, zanim połączysz konta lub zaczniesz porównywać nazwy subskrypcji."
        ]
      },
      {
        "heading": "Zrozum, co może zmienić skopiowane wydarzenie",
        "body": [
          "Dokumentacja Calendar Sync w OneCal opisuje reguły jednokierunkowe i wielokierunkowe, które tworzą zdublowane wydarzenia. Osobny przewodnik dotyczący zakresu działania informuje, że edycje kopii nie są przenoszone z powrotem do oryginału. Ustal, które wydarzenie jest oryginałem i do którego kalendarza należy, zanim potraktujesz skopiowane wydarzenie jako miejsce do przełożenia spotkania.",
          "Połączenia z dostawcami w Cloud Calendars także mogą tworzyć lustrzane kalendarze w magazynie iOS. Widok łączony nie dowodzi, że rekordy zostały scalone ani że edycja dotarła do dostawcy. W przypadku kalendarza, który należy do Ciebie i który możesz edytować, sprawdź testowe wydarzenie bez gości zarówno u dostawcy, jak i w aplikacji."
        ]
      },
      {
        "heading": "Sprawdź sterowanie na urządzeniu, z którego naprawdę będziesz korzystać",
        "body": [
          "Aktualny przewodnik mobilny OneCal opisuje tworzenie i edytowanie wydarzeń, opcje powtarzania, RSVP oraz dołączanie do spotkań. Osobno wskazuje, że tworzenie, edytowanie, wstrzymywanie i usuwanie konfiguracji Calendar Sync odbywa się w aplikacji webowej; na urządzeniach mobilnych te konfiguracje są tylko wyświetlane. Konfiguracja linków do rezerwacji jest również opisana jako zadanie wykonywane w wersji webowej.",
          "Cloud Calendars to aplikacja na iPhone i iPad z widokami dnia, tygodnia, miesiąca, roku i listy. Wypróbuj potrzebną edycję w zainstalowanym widoku, przeczytaj każdą opcję powtarzania i potwierdź zapisane wydarzenie. Nie zakładaj, że menu mobilne, proces rezerwacji lub sterowanie automatyzacją z innego produktu występują także tutaj."
        ]
      },
      {
        "heading": "Weryfikuj zakres zamiast zakładać nieograniczoną historię",
        "body": [
          "Aktualny przewodnik OneCal dotyczący zakresu działania podaje przyszłe okno synchronizacji do roku dla Google i iCloud oraz do trzech miesięcy dla Outlook. Rozróżnia też przyszłe serie cykliczne od pojedynczych wydarzeń historycznych. To limity opisane przez wydawcę, a nie test Twojego konkretnego konta ani stwierdzenie dotyczące każdej funkcji w widoku kalendarza.",
          "Cloud Calendars również wymaga sprawdzenia sposobu połączenia konta, wybranych kalendarzy i odpowiednich dat. Jeśli starsze spotkania są istotne, porównaj konkretne wydarzenie u dostawcy i w aplikacji. Aplikacja kalendarza nie jest automatycznie pełną kopią zapasową ani gwarancją, że pobrano każdy zapis z przeszłości."
        ]
      },
      {
        "heading": "Porównaj wymagania planów i sposób rozliczenia",
        "body": [
          "Cloud Calendars obejmuje synchronizację z Google Calendar w planie Base; Advanced usuwa reklamy, a Premium dodaje obsługę Microsoft Calendar i Teams. Uprawnienia konta weryfikuj niezależnie od planu. Przed zakupem sprawdź aktualną lokalną cenę i okres rozliczeniowy, zamiast opierać się na stałym międzynarodowym porównaniu cen.",
          "Przewodnik OneCal po planach w wersji webowej opisuje plany na członka zespołu i czternastodniowy okres próbny, w tym usuwanie kopii po jego wygaśnięciu. Przewodnik dotyczący rozliczeń mobilnych opisuje zakupy zarządzane przez sklep i ograniczenia związane z dodawaniem członków zespołu. Sprawdź, które funkcje wymagają aktywnego planu i gdzie zarządzany jest zakup; samo bezpłatne pobranie nie odpowiada na te pytania."
        ]
      },
      {
        "heading": "Przetestuj rzeczywisty sposób planowania przed zmianą",
        "body": [
          "Jeśli ważne są dla Ciebie pogoda, widżety lub Live Activity, uwzględnij je w teście na urządzeniu, którego używasz. Cloud Calendars oferuje te powierzchnie planowania, przy czym pogoda jest ograniczona do dostępnych dat i wybranego miejsca. Omawiane tu strony OneCal nie potwierdzają zgodności funkcji w tych obszarach; sprawdź aktualny produkt, zamiast wnioskować o braku funkcji na podstawie samego przewodnika.",
          "Zachowaj oryginalne aplikacje i szczegóły połączeń, dopóki nie sprawdzisz wymaganego efektu. Zanotuj, czy weryfikujesz widoczność, edycję oryginalnego wydarzenia, skopiowane zajęte terminy czy przypomnienie — to różne rezultaty. Zanim odłączysz usługę, sprawdź, co stanie się z istniejącymi kopiami, i nie eksperymentuj na aktywnym zaproszeniu ani na prawdziwym spotkaniu z klientem."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Zapisz, czy potrzebujesz widoku łączonego, czy kopiowania wydarzeń na inne konto.",
      "Ustal, które wydarzenia są oryginałami, które kopiami i które konto jest właścicielem każdego ważnego wydarzenia.",
      "Sprawdź potrzebne funkcje na swoim rzeczywistym telefonie, tablecie lub w procesie pracy w wersji webowej.",
      "Porównaj jeden zwykły tydzień oraz wszystkie daty historyczne, na których polegasz.",
      "Sprawdź aktualne wymagania planu, lokalną cenę i dostawcę zakupu.",
      "Przed zmianą zweryfikuj testowe wydarzenie i sprawdź zasady usuwania kopii."
    ],
    "faq": [
      {
        "q": "Czy widok kalendarza łączonego to to samo co synchronizacja zajętych terminów?",
        "a": "Nie. Widok łączony pozwala porównać zobowiązania. Utworzenie wpisu na innym koncie wymaga osobnego obsługiwanego procesu; OneCal opisuje reguły Calendar Sync oddzielnie od Unified Calendar View."
      },
      {
        "q": "Czy mogę zmienić kopię w OneCal, aby przełożyć oryginalne spotkanie?",
        "a": "Przewodnik dotyczący zakresu działania informuje, że edycje kopii nie są przenoszone do oryginału. Ustal, które wydarzenie jest oryginalne, i stosuj uprawnienia edycji oraz organizatora obowiązujące w jego kalendarzu."
      },
      {
        "q": "Która aplikacja jest tańsza w mojej konfiguracji?",
        "a": "To zależy od potrzebnych funkcji, kont, sposobu rozliczenia i lokalnej ceny. Cloud Calendars obejmuje synchronizację z Google w planie Base oraz obsługę Microsoft w Premium. Sprawdź aktualny plan OneCal i warunki rozliczeń mobilnych dla zamierzonego sposobu pracy; ten przewodnik nie wskazuje jednego uniwersalnie najtańszego rozwiązania."
      }
    ],
    "sourcesHeading": "Oficjalna dokumentacja OneCal dotycząca sposobu pracy i planów",
    "sources": [
      {
        "label": "OneCal: funkcje mobilne i zadania konfiguracyjne tylko w wersji webowej",
        "url": "https://docs.onecal.io/docs/mobile-apps"
      },
      {
        "label": "OneCal: Calendar Sync i reguły ze źródła do celu",
        "url": "https://docs.onecal.io/docs/calendar-sync/calendar-sync-intro"
      },
      {
        "label": "OneCal: okna synchronizacji i edycje skopiowanych wydarzeń",
        "url": "https://docs.onecal.io/docs/calendar-sync/what-does-onecal-sync"
      },
      {
        "label": "OneCal: plany, okres próbny i sposób działania po wygaśnięciu",
        "url": "https://docs.onecal.io/docs/billing/plans-and-free-trial"
      },
      {
        "label": "OneCal: subskrypcje App Store i Google Play",
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
      "heading": "Porównaj sposób pracy przed subskrypcją",
      "columns": [
        "Pytanie",
        "Cloud Calendars",
        "Dokumentacja OneCal"
      ],
      "rows": [
        {
          "cells": [
            "Gdzie przeglądam swój harmonogram?",
            "Na iPhone i iPadzie, w widokach dnia, tygodnia, miesiąca, roku i listy.",
            "Unified Calendar View jest oddzielony od konfiguracji Calendar Sync."
          ]
        },
        {
          "cells": [
            "Czy potrzebuję kopiowania bloków zajętości między kontami?",
            "Nie wnioskuj tego z widoku łączonego; połączenia z dostawcami mogą lokalnie odzwierciedlać kalendarze.",
            "Calendar Sync tworzy zdublowane wydarzenia za pomocą reguł jednokierunkowych lub wielokierunkowych."
          ]
        },
        {
          "cells": [
            "Gdzie zmieniam reguły synchronizacji?",
            "Użyj mechanizmów opisanych dla połączenia konta w aplikacji.",
            "W analizowanym przewodniku mobilnym zmiany konfiguracji synchronizacji przypisano do aplikacji webowej."
          ]
        },
        {
          "cells": [
            "Którego planu Cloud Calendars potrzebuję?",
            "Base obejmuje synchronizację z Google Calendar; Advanced usuwa reklamy; Premium dodaje Microsoft Calendar i Teams.",
            "Sprawdź aktualny plan OneCal i sposób rozliczenia dla potrzebnego sposobu pracy."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-left",
      "hook"
    ],
    "galleryCaption": "Rzeczywiste ekrany kalendarza w Cloud Calendars pokazują widok planowania. To porównanie odróżnia ten widok od serwerowych reguł tworzenia kopii w usłudze.",
    "actionHeading": "Wybierz efekt, który chcesz zweryfikować",
    "actionText": "Jeśli potrzebujesz przeglądu na iPhone lub iPadzie z pogodą i widżetami, wypróbuj Cloud Calendars z nieszkodliwym wydarzeniem testowym. Jeśli wymagasz kopiowania zajętych terminów na inne konto, oceń usługę, która jednoznacznie opisuje takie działanie.",
    "articleLinks": [
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Skonfiguruj połączony widok kalendarza"
      },
      {
        "slug": "fantastical-readdle-calendar366-iphone-comparison",
        "label": "Porównaj inne opcje kalendarza na iPhone’a"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Wybierz widok na ekranie początkowym"
      }
    ]
  },
  "fantastical-readdle-calendar366-iphone-comparison": {
    "updated": "2026-10-23",
    "title": "Alternatywy dla kalendarza na iPhone’a: Cloud Calendars, Fantastical, Readdle i BusyCal",
    "short": "Porównaj alternatywy kalendarza na iPhone’a",
    "description": "Porównaj kalendarze na iPhone’a pod kątem pogody, widoków, zadań i potrzebnego sposobu pracy.",
    "lede": "Wybierz kalendarz według zadania, które chcesz wykonać: przeglądaj wydarzenia z pogodą, szybko dodawaj wydarzenie, zarządzaj zadaniami lub łącz widoki kont. Cloud Calendars, Fantastical, Calendars by Readdle, Calendar 366 i BusyCal różnią się pod tym względem oraz wymaganiami planów. Arte Soft rozwija Cloud Calendars i publikuje to porównanie.",
    "sections": [
      {
        "heading": "Najpierw określ, co musi działać, a dopiero potem porównuj wygląd",
        "body": [
          "Zapisz swoich dostawców kalendarza, urządzenia i trzy kluczowe działania. Na przykład: widzieć razem kalendarz służbowy i prywatny, ukończyć przypomnienie i szybko dodać spotkanie. Przetestuj te działania na prywatnych danych testowych, zanim zaimportujesz cały harmonogram.",
          "To, że produkt obsługuje nazwę Twojego dostawcy, nie oznacza jeszcze, że każda metoda połączenia ma identyczne uprawnienia i funkcje. Kalendarz urządzenia, konto połączone bezpośrednio i subskrybowany kanał mogą tworzyć podobnie wyglądające wpisy, ale pozwalać na różne działania."
        ]
      },
      {
        "heading": "Jako punkt odniesienia użyj własnego kalendarza dostawcy",
        "body": [
          "Przewodnik Google dla początkujących opisuje własny interfejs kalendarza do planowania, zadań, udostępniania i wielu kalendarzy. Jeśli Twój harmonogram już tam jest, przetestuj wymagane działanie u źródła, zanim zdecydujesz, czy potrzebujesz innej aplikacji.",
          "Na przykład porównaj to samo wydarzenie w Google Calendar i Fantastical po połączeniu odpowiedniego konta. Sprawdź, czy potrzebną przewagą jest widok łączony, połączenie z zadaniami, szybkie dodawanie czy konkretny interfejs urządzenia. Inny klient kalendarza nie oznacza automatycznie migracji do innego dostawcy."
        ]
      },
      {
        "heading": "Fantastical: sprawdź połączenia kont i szybkie dodawanie",
        "body": [
          "Flexibits dokumentuje zarówno bezpośrednie połączenia z kontami kalendarza, jak i opcje dla kalendarzy oraz przypomnień już skonfigurowanych w iOS. Przewodnik dla początkujących zaleca bezpośrednie połączenia, aby w pełni korzystać z funkcji aplikacji. Ustal, którą drogę wybrano, zamiast bez potrzeby podłączać ten sam kalendarz dwa razy.",
          "Fantastical opisuje też wprowadzanie na podstawie zdań oraz wielokrotnego użytku szablony wydarzeń i zadań. Przetestuj jednoznaczną datę, czas trwania i kalendarz docelowy, a potem sprawdź zapisany wynik. Ta składnia należy do Fantastical; pole tekstowe innej aplikacji może zinterpretować to samo zdanie inaczej."
        ]
      },
      {
        "heading": "Calendars by Readdle: sprawdź źródło zadań",
        "body": [
          "Readdle prezentuje kalendarze Google, Outlook i iCloud obok funkcji zadań oraz wprowadzania w języku naturalnym. Przewodnik konfiguracji zadań opisuje wybór iOS Reminders lub Google Tasks w opcjach zadań. To ważne, jeśli ukończenie zadania na telefonie ma aktualizować konkretną listę źródłową.",
          "Użyj tymczasowego zadania, aby sprawdzić ukończenie po obu stronach, a nie tylko to, czy tytuł pojawia się na osi czasu. Jeśli potrzebujesz danego widoku lub działania także na Macu, a nie tylko na iPhone, przetestuj to również tam. Nie zakładaj identycznych mechanizmów tylko na podstawie wspólnej nazwy produktu."
        ]
      },
      {
        "heading": "Calendar 366: sprawdź dostęp systemowy, zestawy i lokalizację pogody",
        "body": [
          "Dokumentacja Calendar 366 rozróżnia dostęp do kalendarzy systemowych i przypomnień od bezpośrednich integracji z kontami. Opisuje zestawy kalendarzy, które wybierają widoczne kalendarze i listy. Zestawy te mogą też określać kalendarz domyślny, więc sprawdź, do czego będzie należeć nowo utworzone wydarzenie.",
          "Ta sama dokumentacja opisuje własny parser języka naturalnego oraz pogodę z Apple Weather, z wyborem lokalizacji systemowej lub własnej. Przy planowaniu na zewnątrz sprawdź wybrane miejsce, zamiast zakładać, że prognoza podąża za adresem każdego wydarzenia. To możliwości opisane przez wydawcę, a nie funkcje przetestowane na Twoim koncie."
        ]
      },
      {
        "heading": "BusyCal: sprawdź wyświetlanie zadań i widok używany do pogody",
        "body": [
          "Przewodnik BusyCal dla iOS rozróżnia zadania z datą, z godziną i bez daty. Opisuje mechanizmy oznaczania ukończenia oraz przenoszenia nieukończonych zadań z datą na kolejne dni. Przewodnik po pogodzie umieszcza prognozy w widokach List, Day i Month, więc przetestuj konkretny używany widok, zamiast zakładać, że pogoda pojawia się wszędzie.",
          "BusyCal dokumentuje też wprowadzanie w języku naturalnym jako opcję w domyślnych ustawieniach nowego wydarzenia. Wypróbuj to samo prywatne przykładowe wydarzenie co w innych aplikacjach, a potem sprawdź kalendarz i zapisany czas. To mechanizmy BusyCal, a nie polecenia wspólne dla każdej aplikacji kalendarza."
        ]
      },
      {
        "heading": "Sprawdź sposób pracy na Watch osobno od telefonu",
        "body": [
          "Przewodnik Fantastical dla Watch opisuje widoki Up Next, List i Tasks, w tym ukończenie zadania. Przewodnik BusyCal dotyczący zadań rozróżnia zadania z datą i godziną wyświetlane na Watch od zadań bez daty. Jeśli zależy Ci na nieprzypisanych zadaniach zaległych, uwzględnij je w teście, zamiast sprawdzać tylko najbliższe wydarzenie.",
          "Komplikacja na Watch służy do szybkiego podglądu, podczas gdy aplikacja na Watch może oferować dodatkowe działania. Sprawdź dane i działanie na rzeczywistym zegarku i telefonie oraz przejrzyj bieżący plan. Interfejsy na komputerze, telefonie i zegarku nie są wymienne tylko dlatego, że używają tej samej nazwy produktu."
        ]
      },
      {
        "heading": "Traktuj cenę i zakres uprawnień jako osobny etap sprawdzania",
        "body": [
          "Sprawdź aktualny lokalny ekran zakupu, funkcje dostępne po zakończeniu okresu próbnego oraz to, czy wcześniejszy zakup zmienia Twój zakres uprawnień. Darmowe pobranie, cykliczna subskrypcja i starszy zakup nie muszą odblokowywać tego samego zestawu funkcji.",
          "Strony wydawcy mogą zmieniać się w różnym czasie. Bieżące FAQ produktu Readdle opisuje kilka podstawowych możliwości jako darmowe, podczas gdy osobna strona pomocy o wersji darmowej i pełnej pokazuje inny podział. Zamiast traktować jeden opis jako uniwersalną obietnicę, sprawdź wymagane działanie w zainstalowanej aplikacji i jej aktualnych warunkach zakupu."
        ]
      },
      {
        "heading": "Gdzie Cloud Calendars mieści się na krótkiej liście",
        "body": [
          "Cloud Calendars to kolejna opcja na iPhone i iPad do wybranych kalendarzy, wielu widoków planowania, pogody i widżetów. Synchronizacja z Google jest zawarta w Base, Advanced usuwa reklamy, a Premium dodaje obsługę Microsoft Calendar. Sprawdź aktualny plan i uprawnienia dostawcy dla swojej konfiguracji.",
          "Jeśli kluczowe jest specjalistyczne połączenie z zadaniami, polecenie szablonu lub sposób pracy na komputerze, wybierz produkt, który dokumentuje ten wymóg i rzeczywiście go spełnia. Porównuj zapisane wyniki i codzienny nakład pracy; lista kontrolna ma pomóc w wyborze, a nie sugerować, że każda wspomniana tu funkcja istnieje w Cloud Calendars."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Wypisz swoje konta, urządzenia i kluczowe działania.",
      "Wybierz jedną drogę połączenia z kontem i sprawdź, jakie kalendarze udostępnia.",
      "Przetestuj szybkie dodawanie i kończenie zadań na nieszkodliwych przykładach.",
      "Sprawdź lokalizację pogody i widoki używane na każdym urządzeniu.",
      "Sprawdź aktualne warunki zakupu po okresie próbnym lub wcześniejszych uprawnieniach."
    ],
    "faq": [
      {
        "q": "Która alternatywa dla Fantastical jest najlepsza?",
        "a": "To zależy od wymaganego sposobu pracy. Porównaj źródła kalendarzy i zadań, dodawanie wydarzeń, obsługę urządzeń i aktualny zakres uprawnień. Ten przewodnik nie wskazuje jednego uniwersalnego zwycięzcy pod względem działania."
      },
      {
        "q": "Czy ta sama nazwa dostawcy oznacza, że każda aplikacja synchronizuje się identycznie?",
        "a": "Nie. Sprawdź osobno połączenia bezpośrednie, kalendarze urządzenia, kanały i uprawnienia, a następnie zweryfikuj przykładową zmianę u źródła."
      },
      {
        "q": "Czy mogę założyć, że każda reklamowana funkcja jest darmowa?",
        "a": "Nie. Sprawdź zainstalowaną aplikację, lokalny ekran zakupu i funkcje pozostające po okresie próbnym. Dokumentacja wydawcy może opisywać różne wersje lub zakresy uprawnień."
      }
    ],
    "sourcesHeading": "Oficjalna dokumentacja sprawdzona na potrzeby tego przewodnika",
    "sources": [
      {
        "label": "Fantastical: sposoby połączenia konta",
        "url": "https://flexibits.com/fantastical-ios/help/getting-started"
      },
      {
        "label": "Fantastical: wprowadzanie w języku naturalnym i szablony",
        "url": "https://flexibits.com/fantastical-ios/help/adding-events-and-tasks"
      },
      {
        "label": "Readdle: bieżące możliwości produktu i FAQ",
        "url": "https://readdle.com/calendars"
      },
      {
        "label": "Readdle: wybór źródła zadań",
        "url": "https://support.readdle.com/calendars/synchronization/how-to-sync-tasks-with-ios-reminders-or-google-tasks"
      },
      {
        "label": "Readdle: osobne wskazówki dotyczące planu darmowego i pełnego",
        "url": "https://apphelp.readdle.com/en/index.php?id=585&pg=kb.page"
      },
      {
        "label": "Calendar 366: integracje, zestawy, szybkie dodawanie i pogoda",
        "url": "https://calendar366.com/help/index.html"
      },
      {
        "label": "BusyCal dla iOS: zadania i ograniczenia zadań na Watch",
        "url": "https://www.busymac.com/docs/busycalios/70659-tasks/"
      },
      {
        "label": "BusyCal dla iOS: pogoda i obsługiwane widoki",
        "url": "https://www.busymac.com/docs/busycalios/70665-weather/"
      },
      {
        "label": "BusyCal dla iOS: wprowadzanie w języku naturalnym",
        "url": "https://www.busymac.com/docs/busycalios/70669-natural-language/"
      },
      {
        "label": "Fantastical: widoki i działania na Apple Watch",
        "url": "https://flexibits.com/fantastical-ios/help/apple-watch"
      },
      {
        "label": "Google: własny interfejs Calendar oparty na koncie",
        "url": "https://support.google.com/calendar/answer/2465776?hl=en"
      }
    ],
    "seeAlso": [
      "what-fantastical-costs-and-what-this-does",
      "natural-language-calendar-events-iphone",
      "iphone-calendar-tasks-reminders-versus-event-alerts"
    ],
    "comparison": {
      "heading": "Zacznij od najważniejszego wymagania",
      "columns": [
        "Wymaganie",
        "Odpowiednie opcje do sprawdzenia",
        "Ważne rozróżnienie"
      ],
      "rows": [
        {
          "cells": [
            "Wydarzenia z pogodą oraz widoki na iPhone i iPad",
            "Cloud Calendars oraz udokumentowane widoki pogody w porównywanych aplikacjach.",
            "Sprawdź lokalizację prognozy, dostępny okres i widok; zakres pogody nie jest nieograniczony."
          ]
        },
        {
          "cells": [
            "Wprowadzanie wydarzeń w języku naturalnym",
            "Fantastical oraz odpowiednia funkcja Readdle lub BusyCal.",
            "Analiza zdań to nie to samo co dyktowanie lub zwykła edycja wydarzenia."
          ]
        },
        {
          "cells": [
            "Zadania obok wydarzeń",
            "Udokumentowane źródło zadań w Readdle, Calendar 366, BusyCal lub Fantastical.",
            "Przypomnienie o wydarzeniu nie jest integracją ukończenia zadania."
          ]
        },
        {
          "cells": [
            "Synchronizacja z Google Calendar i opcjonalne usunięcie reklam",
            "Cloud Calendars Base zawiera synchronizację z Google Calendar; Advanced usuwa reklamy.",
            "Obsługa Microsoft Calendar i Teams wymaga Premium."
          ]
        },
        {
          "cells": [
            "Inny model zakupu",
            "Aktualna oferta sklepu i zakres uprawnień dla każdej aplikacji i platformy.",
            "Darmowe pobranie nie dowodzi, że każda funkcja jest darmowa; ceny regionalne i plany mogą się zmieniać."
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
    "galleryCaption": "To są ekrany Cloud Calendars pokazujące widoki aplikacji, pogodę i widżety. Nie są to zrzuty ekranu innych produktów z tego porównania.",
    "actionHeading": "Sprawdź kalendarz pod kątem jednej rzeczywistej potrzeby planowania",
    "actionText": "Jeśli Twoim głównym wymaganiem jest harmonogram na iPhone lub iPad z pogodą i widżetami, oceń Cloud Calendars na tymczasowym wydarzeniu. Przy porównywaniu produktów trzymaj specjalistyczne wymagania dotyczące zadań, rezerwacji i języka naturalnego oddzielnie.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Zobacz, jak pogoda wpisuje się w pracę z kalendarzem"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Porównaj widżety Cloud Calendars"
      },
      {
        "slug": "onecal-alternative-iphone-calendar-view-or-sync",
        "label": "Odróżnij widok łączony od skopiowanego czasu zajętości"
      }
    ]
  }
};
