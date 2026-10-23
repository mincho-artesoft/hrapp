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
  "month-view-on-a-bigger-screen": {
  "updated": "2026-10-22",
  "title": "Kalendarz miesięczny na iPadzie i iPhonie: wybierz daty, potem sprawdź szczegóły",
  "short": "Widok miesiąca bez pomijania szczegółów",
  "description": "Porównuj daty na iPadzie i iPhonie. Przed przeniesieniem wspólnych lub cyklicznych spotkań sprawdź ukryte wydarzenia, kalendarze i godziny.",
  "lede": "Widok miesiąca pokazuje, na które daty przypadają zobowiązania. Gorzej nadaje się do potwierdzenia, że konkretna godzina jest wolna. Wybierz datę w przeglądzie, a przed ustaleniem terminu sprawdź dzień i wydarzenie. Poradnik publikuje Arte Soft, twórca Cloud Calendars.",
  "commonBelief": "Większa siatka miesiąca pokazuje każdy szczegół, a pozornie pusta data dowodzi, że wszyscy są dostępni.",
  "sections": [
    {
      "heading": "Ustal, czy potrzebujesz dat, czy dokładnych godzin",
      "body": [
        "Użyj miesiąca do porównania terminu projektu, podróży i rodzinnego spotkania na przestrzeni kilku tygodni. Gdy pytanie dotyczy nakładania się dwóch spotkań o 14:30, przejdź do widoku dnia lub tygodnia i sprawdź początek oraz koniec. Pole miesiąca nie ma takiej skali czasu jak siatka godzinowa.",
        "Organizator warsztatu może najpierw wykluczyć tydzień podróży. Potem powinien sprawdzić proponowany dzień: wcześniejsze zobowiązania, przygotowanie, dojazd i wymagany czas zakończenia. Pozornie puste pole jest kandydatem do sprawdzenia, nie potwierdzoną rezerwacją ani informacją o dostępności innych osób."
      ]
    },
    {
      "heading": "Czytaj liczbę dodatkowych wydarzeń, nie tylko widoczne tytuły",
      "body": [
        "Obecnie pole miesiąca w Cloud Calendars pokazuje ograniczoną liczbę etykiet wydarzeń i dodatkowy licznik, gdy na ten dzień przypada ich więcej. Tytuły zajmują jeden wiersz, więc mogą być skrócone. Otwórz dzień lub wydarzenie, gdy ważny jest pełny tytuł albo pozostałe zobowiązania.",
        "Większy ekran iPada może ułatwić czytanie, ale więcej miejsca nie musi usuwać wszystkich ograniczeń wyświetlania. Wąskie okno aplikacji lub większy tekst mogą zmienić to, co się mieści. Na iPhonie sprawdzaj tak samo: otwórz dzień, zanim uznasz widoczne etykiety za cały harmonogram."
      ]
    },
    {
      "heading": "Sprawdź miesiąc, wybrane kalendarze i sąsiednie daty",
      "body": [
        "Przed wyborem daty odczytaj wyświetlany miesiąc i rok. Siatka może zawierać daty sąsiedniego miesiąca, aby wypełnić wiersze. W Cloud Calendars używaj nawigacji miesięcznej i sprawdzaj wybraną datę, zamiast polegać wyłącznie na położeniu pola.",
        "Sprawdź, które kalendarze są zaznaczone. Ukrycie wydarzeń służbowych ułatwia czytanie planu rodzinnego, ale usuwa te zobowiązania z tego przeglądu. Przy badaniu duplikatu tymczasowo ukryj jedno źródło i porównaj; nie usuwaj spotkania tylko po to, by miesiąc był mniej zatłoczony."
      ]
    },
    {
      "heading": "Otwórz wydarzenie przed zmianą wspólnych ustaleń",
      "body": [
        "W szczegółach potwierdź tytuł, właściciela lub kalendarz, czas lokalny i długość. Kolor pomaga przeglądać, ale nie zastępuje wiedzy o koncie ani prawie do edycji. Widoczne zaproszenie różni się od spotkania, które organizujesz samodzielnie.",
        "Cloud Calendars pozwala przeciągać wydarzenia w miesiącu na inną datę. Przed użyciem tej funkcji dla rzeczywistego zobowiązania ustal docelową datę i zakres powtarzania. Po dozwolonej zmianie otwórz wydarzenie ponownie i sprawdź wynik; lokalny gest nie dowodzi, że dostawca lub wszyscy uczestnicy przyjęli nowe ustalenie."
      ]
    },
    {
      "heading": "Powtarzanie i strefy czasowe sprawdzaj osobno",
      "body": [
        "Jeśli przenosisz tylko lekcję z tego tygodnia, nie zmień przypadkowo przyszłego schematu. Odczytaj dostępny wybór zakresu powtarzania, a potem sprawdź zmienione i jedno późniejsze wystąpienie. Widok miesiąca ułatwia porównywanie dat, ale znaczenie zmiany określa zakres edycji.",
        "Przy podróży lub spotkaniu między strefami czasowymi wyraźnie sprawdź lokalną datę i godzinę wydarzenia. Przeniesienie na inny dzień nie jest automatycznym przeliczeniem zamierzonej godziny spotkania. W razie potrzeby sprawdź zmianę czasu letniego i potwierdź uzgodnioną godzinę z zainteresowanymi."
      ]
    },
    {
      "heading": "Korzystaj z większego widoku, nie myląc produktów",
      "body": [
        "Kalendarz Apple ma własne opcje miesiąca, a Teamup opisuje inne zestawy widoków w przeglądarce i aplikacji mobilnej. Te ustawienia należą do odpowiednich produktów. Nie szukaj konfiguracji przeglądarkowej Teamup ani menu widoków Kalendarza Apple w Cloud Calendars tylko dlatego, że układy mają tę samą nazwę.",
        "Miesiąc spotkań nie oznacza też miesiąca prognoz pogody. Dla planu na zewnątrz osobno sprawdź miejsce, datę i dostępne godziny prognozy. Zapisz ostateczne spotkanie we właściwym kalendarzu, a zmienione ustalenia potwierdź bezpośrednio z uczestnikami."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Wybierz potencjalne daty w miesiącu, a dokładne godziny sprawdź w widoku dnia lub tygodnia.",
    "Otwieraj dni z dodatkowym licznikiem lub skróconymi tytułami.",
    "Zanim uznasz datę za wolną, sprawdź miesiąc, rok i wybrane kalendarze.",
    "Potwierdź kalendarz wydarzenia, godzinę, długość i prawo do edycji.",
    "Przeczytaj zakres powtarzania i po przeniesieniu sprawdź zapisane wystąpienie.",
    "Osobno sprawdź dostępność pogody i potwierdź zmiany z uczestnikami."
  ],
  "faq": [
    {
      "q": "Czy miesięczny widok iPada pokazuje każde spotkanie w całości?",
      "a": "Nie zakładaj tego. Cloud Calendars ogranicza etykiety wydarzeń w polu miesiąca i pokazuje dodatkowy licznik. Otwórz dzień i wydarzenie, aby sprawdzić pełny plan."
    },
    {
      "q": "Czy pusty dzień oznacza, że mam wolne?",
      "a": "Najpierw sprawdź wybrane kalendarze, datę i obecność danych odpowiednich kont. Przegląd przedstawia tylko informacje obecnie dostępne i wyświetlane."
    },
    {
      "q": "Czy przeniesienie wydarzenia cyklicznego zmienia tylko tę datę?",
      "a": "Przeczytaj wybór zakresu edycji, zamiast zgadywać. Po zapisaniu sprawdź zmienione i jedno późniejsze wystąpienie, a następnie potwierdź zamierzone ustalenia."
    }
  ],
  "sourcesHeading": "Porównaj oficjalne opisy widoków",
  "sources": [
    {
      "label": "Apple: widok miesiąca, wielu dni i listy w Kalendarzu Apple",
      "url": "https://support.apple.com/en-ca/guide/iphone/iphfd1054569/ios"
    },
    {
      "label": "Teamup: widoki kalendarza i konfiguracja w przeglądarce oraz aplikacji",
      "url": "https://calendar.teamup.com/kb/how-to-use-calendar-views/"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "weather-inside-your-calendar",
    "sharing-one-event-not-your-calendar"
  ]
},

  'weather-inside-your-calendar': {
  "updated": "2026-10-23",
  "title": "Kalendarz z pogodą na iPhone i iPadzie: zaplanuj dzień w jednym widoku",
  "short": "Korzystaj z kalendarza i pogody razem",
  "description": "Porównaj kalendarz z pogodą dla wybranego miejsca na iPhonie i iPadzie.",
  "lede": "Cloud Calendars łączy harmonogram i pogodę w jednej aplikacji na iPhone’a lub iPada. Użyj kalendarza, aby wybrać datę, a widoku pogody, aby sprawdzić wybrane miejsce i dostępne godziny prognozy. Przy planach na zewnątrz sprawdzaj interesujący Cię przedział czasu, zamiast polegać na dziennej ikonie. Ten przewodnik publikuje Arte Soft, twórca aplikacji.",
  "commonBelief": "Pogoda wyświetlana obok kalendarza automatycznie opisuje adres każdego wydarzenia, każdą godzinę i każdą przyszłą datę.",
  "sections": [
    {
      "heading": "Wybierz rzeczywiste pytanie planistyczne",
      "body": [
        "Zacznij od konkretnego wydarzenia, na przykład popołudniowej wizyty w parku. Ustal, co może się zmienić: godzina, miejsce, przygotowanie lub decyzja o skorzystaniu z alternatywy. Nie musisz przestawiać całego kalendarza tylko dlatego, że symbol dnia pokazuje deszcz.",
        "Zapisz rzeczywisty czas rozpoczęcia i zakończenia aktywności, uwzględniając przygotowania, jeśli to istotne. Widok kalendarza pomaga znaleźć możliwe terminy, a sprawdzenie prognozy dotyczy konkretnego miejsca i przedziału czasu. Porównując opcje, rozdziel te dwa zadania."
      ]
    },
    {
      "heading": "Potwierdź miejsce pogody przed odczytaniem wartości",
      "body": [
        "Cloud Calendars oferuje pogodę dla bieżącego lub wybranego miejsca. Sprawdź wyświetlaną lokalizację, zamiast zakładać, że adres wydarzenia po cichu zmienia prognozę. Wydarzenie w innym mieście wymaga porównania z pogodą dla tego miasta.",
        "Na przykład ktoś może planować przyjazd do muzeum, gdy telefon nadal jest w domu. Przed porównaniem sprawdź lokalizację prognozy i czas lokalny wydarzenia. Zbliżone wartości nie dowodzą, że harmonogram i pogoda dotyczą tego samego miejsca."
      ]
    },
    {
      "heading": "Sprawdzaj zakres godzinowy i dzienny osobno",
      "body": [
        "Użyj pozycji dziennej do orientacji, a dostępnych pozycji godzinowych do pytania o część dnia. Rezerwacja od drugiej do piątej wymaga więcej niż spojrzenia na jeden symbol. Sprawdź, czy odpowiednie godziny są faktycznie dostępne.",
        "W obecnym źródle aplikacji lista dzienna obejmuje maksymalnie dziesięć dni zwróconych przez WeatherKit. To jest niezależne od nawigacji po kalendarzu i od godzin obecnie dostarczanych w prognozie. Przyszłe wydarzenie nie wydłuża zakresu prognozy. Jeśli jego okres nie jest dostępny, zaplanuj późniejsze sprawdzenie pogody."
      ]
    },
    {
      "heading": "Sprawdź, co oznacza dana wartość pogody",
      "body": [
        "Apple dokumentuje dane WeatherKit, takie jak temperatura, opady, wiatr i UV, przy czym niektóre produkty są dostępne tylko w wybranych regionach. Odczytuj wartości dostępne dla wybranego miejsca, zamiast oczekiwać wszystkich produktów pogodowych wszędzie.",
        "Wskazówki Met Office pokazują, dlaczego znaczenie ma okres prognozy i definicje zmiennych: niektóre wartości odnoszą się do chwili, a inne do przedziału czasu. Korzystaj z etykiet danego dostawcy. Prawdopodobieństwo deszczu, jego ilość i czas trwania to różne kwestie, a jedna liczba nie rozstrzyga o każdej aktywności na zewnątrz."
      ]
    },
    {
      "heading": "Sprawdź wersję roboczą utworzoną z godziny prognozy",
      "body": [
        "Tam, gdzie aplikacja umożliwia utworzenie wydarzenia na podstawie godziny, otwiera wersję roboczą. Obecne źródło używa strefy czasowej lokalizacji pogody, proponuje czas trwania jednej godziny i wybiera domyślny kalendarz dla nowych wydarzeń. Przed zapisaniem sprawdź każdą wartość.",
        "Potwierdź tytuł, kalendarz docelowy, początek, koniec i zamierzoną lokalizację. Wybranie godziny prognozy nie daje uprawnień do edycji współdzielonego kalendarza, powiadomienia miejsca spotkania ani rezerwacji sali. Sprawdź zapisane wydarzenie i uzyskaj wszystkie zgody potrzebne do realizacji planu."
      ]
    },
    {
      "heading": "Oddziel demonstrację na stronie od aplikacji",
      "body": [
        "Interaktywna demonstracja pogody na stronie korzysta z Open-Meteo. Aplikacja korzysta z Apple WeatherKit. Demonstracja internetowa jest przydatna do poznania sposobu prezentacji, ale jej lokalizacja, dane i dostępne daty mogą różnić się od tych w aplikacji.",
        "Przy podejmowaniu rzeczywistej decyzji otwórz aplikację i porównaj planowane wydarzenie z dostępną dla niego prognozą. Jeśli zmieniasz wspólny plan, potwierdź organizatora, zakres cykliczności i uczestników. Zachowaj uzgodnioną alternatywę, gdy aktywność zależy od warunków."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Określ wydarzenie i decyzję, na którą pogoda może wpłynąć.",
    "Potwierdź lokalizację pogody oraz lokalną datę i godzinę wydarzenia.",
    "Sprawdź dostępny zakres godzinowy osobno od podsumowania dziennego.",
    "Odczytuj prawdopodobieństwo, ilość i inne istotne wartości zgodnie z ich etykietami.",
    "Przed zapisaniem sprawdź wszystkie szczegóły wersji roboczej wydarzenia i kalendarz docelowy.",
    "Sprawdź ponownie w momencie podejmowania decyzji i bezpośrednio potwierdź wspólne zmiany."
  ],
  "faq": [
    {
      "q": "Czy pogoda obok mojego kalendarza uwzględnia adres każdego wydarzenia?",
      "a": "Nie zakładaj tego. Potwierdź wyświetlaną lokalizację pogody i porównaj ją z miejscem wydarzenia; bliskość na ekranie nie potwierdza zgodności."
    },
    {
      "q": "Czy aplikacja korzysta z dostawcy pogody ze strony internetowej?",
      "a": "Nie. Aplikacja korzysta z Apple WeatherKit, a demonstracja na stronie osobno z Open-Meteo."
    },
    {
      "q": "Czy wybranie godziny prognozy automatycznie zapisuje wydarzenie?",
      "a": "Uruchamia wersję roboczą tam, gdzie ta funkcja jest dostępna. Sprawdź datę, strefę czasową, czas trwania, kalendarz i lokalizację, a następnie zapisz właściwe wydarzenie."
    }
  ],
  "seeAlso": [
    "weather-calendar-history-versus-forecast-iphone",
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather",
    "weather-where-the-event-is",
    "planning-outdoors-without-being-rained-on"
  ],
  "sourcesHeading": "Oficjalne źródła i dalsza lektura",
  "sources": [
    {
      "label": "Apple: informacje o prognozie WeatherKit i dostępności regionalnej",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: miejsce prognozy, okresy i wartości pogodowe",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ],
  "comparison": {
    "heading": "Który widok pogody odpowiada na Twoje pytanie?",
    "columns": [
      "Twoje pytanie",
      "Co sprawdzić",
      "Czego to nie potwierdza"
    ],
    "rows": [
      {
        "cells": [
          "Co czeka mnie dzisiaj?",
          "Widok dnia lub tygodnia w kalendarzu obok pogody dla wybranego miejsca.",
          "Że adres każdego wydarzenia automatycznie zmienia lokalizację pogody."
        ]
      },
      {
        "cells": [
          "Czy deszcz może wpłynąć na moje popołudniowe wydarzenie?",
          "Dane godzinowe dla miejsca wydarzenia i całego czasu jego trwania.",
          "Że dzienny symbol opisuje każdą godzinę."
        ]
      },
      {
        "cells": [
          "Czy mogę planować przyszły miesiąc pod kątem pogody?",
          "Najpierw kalendarz teraz, potem ponowne sprawdzenie prognozy bliżej terminu.",
          "Że poruszanie się po kalendarzu wydłuża zakres prognozy."
        ]
      },
      {
        "cells": [
          "Czy mogę zobaczyć szybki przegląd na ekranie początkowym?",
          "Odpowiedni widżet ekranu początkowego.",
          "Że każdy układ widżetu obejmuje wydarzenia lub pełną prognozę."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-right",
    "hook"
  ],
  "galleryCaption": "Rzeczywiste ekrany Cloud Calendars: widok pogody i dzień z wydarzeniami. Sprawdź w aplikacji wybrane miejsce i datę.",
  "actionHeading": "Planuj, korzystając jednocześnie z harmonogramu i prognozy",
  "actionText": "Cloud Calendars jest dostępne na iPhone’a i iPada. Zacznij od widoków, pogody i synchronizacji z Google Calendar dostępnych w Base; Advanced usuwa reklamy, a Premium dodaje obsługę Microsoft Calendar i Teams.",
  "articleLinks": [
    {
      "slug": "forecast-beside-every-event",
      "label": "Sprawdź pogodę dla godzin wydarzenia"
    },
    {
      "slug": "the-widget-that-shows-what-is-next",
      "label": "Wybierz widżet kalendarza i pogody"
    },
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "Połącz konta kalendarza w jednym widoku"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
  "updated": "2026-10-23",
  "title": "Zobacz razem kalendarze Google, iCloud i Outlook na iPhone i iPadzie",
  "short": "Trzech dostawców, jeden widok",
  "description": "Połącz widoki kalendarza i poznaj uprawnienia kont, kopie oraz wymagania planów.",
  "lede": "Aby widzieć razem wydarzenia służbowe i prywatne, połącz odpowiednie konta, wybierz ich kalendarze i sprawdź te same wydarzenia w jednym widoku. Cloud Calendars obsługuje planowanie na iPhone i iPadzie z iCloud i Google Calendar; obsługa Microsoft Calendar jest dostępna w Premium. Wspólne wyświetlanie wydarzeń to coś innego niż kopiowanie zajętości między kontami różnych dostawców. Arte Soft, twórca aplikacji, publikuje ten przewodnik.",
  "commonBelief": "Dodanie kilku kalendarzy w jednej aplikacji automatycznie utrzymuje zgodność ich dostępności, udostępniania i kopii wydarzeń.",
  "sections": [
    {
      "heading": "Ustal konto i kalendarz stojące za każdym wydarzeniem",
      "body": [
        "Zacznij od jednego zwykłego wydarzenia od każdego dostawcy. Zanotuj zalogowany adres e-mail, nazwę kalendarza oraz to, czy jesteś właścicielem wydarzenia, czy otrzymałeś zaproszenie. Dwa kalendarze o nazwie „Calendar” mogą należeć do całkowicie różnych kont. Kolor pomaga przeglądać tydzień, ale to konto i kalendarz wskazują, gdzie należy wprowadzić zmianę.",
        "Na przykład wizyta u dentysty w Twoim prywatnym kalendarzu iCloud i spotkanie projektowe w Microsoft mogą być wyświetlane razem. To samo w sobie nie sprawia jednak, że wizyta u dentysty stanie się widoczna dla współpracowników ani że ten czas zostanie zarezerwowany w ich narzędziach do planowania.",
        "Zanim zmienisz sposób połączenia, określ oczekiwany efekt. Jeśli chcesz przenieść dane wydarzeń na inne konto, skorzystaj z sekcji „Wybierz format eksportu kalendarza” poniżej, aby znaleźć obsługiwaną drogę przeniesienia, i sprawdź reprezentatywne wydarzenia, zanim zaczniesz polegać na miejscu docelowym. Jeśli chcesz tylko porównywać terminy, zachowaj obecnych właścicieli kalendarzy i wyświetlaj razem wybrane źródła. Jeśli inne konto ma otrzymywać informacje o zajętości, sekcja „Cloud Calendars i OneCal według sposobu pracy” wyjaśnia, czym kopiowanie dostępności różni się od osobistego widoku zbiorczego."
      ]
    },
    {
      "heading": "Połącz przez odpowiednią ścieżkę",
      "body": [
        "W przypadku iCloud najpierw włącz iCloud Calendar na iPhone w ramach właściwego Apple Account. Przewodnik konfiguracji Apple wyjaśnia ustawienia urządzenia. Cloud Calendars uzyskuje dostęp do kalendarzy dostępnych przez system kalendarza iPhone i potrzebuje dostępu do kalendarza, aby je odczytywać. Samo połączenie konta na innym urządzeniu nie wystarczy.",
        "Cloud Calendars ma też opcje „Zaloguj się przez Google” i „Zaloguj się przez Microsoft”. Sprawdź, które konto wybierasz podczas logowania, a następnie otwórz jego grupę kalendarzy i zaznacz potrzebne kalendarze. Zalogowanie się do właściwego dostawcy przy użyciu niewłaściwej tożsamości prywatnej lub służbowej może dać całkowicie prawidłową, ale nieoczekiwaną listę kalendarzy."
      ]
    },
    {
      "heading": "Zrozum plany, nie myląc ich z uprawnieniami",
      "body": [
        "Plan Base obejmuje synchronizację Google Calendar i widoki kalendarza. Advanced dodaje do Base usunięcie reklam. Premium dodaje funkcje Microsoft Calendar i Microsoft Teams. Przed zakupem sprawdź aktualną cenę lokalną oraz okres rozliczeniowy.",
        "Plan zmienia to, które funkcje aplikacji są dostępne; nie daje własności do cudzego kalendarza. Google rozróżnia uprawnienie do przeglądania wydarzeń od uprawnienia do ich zmieniania. Nadal obowiązują zasady pracodawcy i uprawnienia przypisane do kalendarza Microsoft. Widoczne wydarzenie lub dostępny edytor nie są dowodem, że dostawca zaakceptuje aktualizację."
      ]
    },
    {
      "heading": "Widok łączony może obejmować kopie kalendarzy",
      "body": [
        "Połączenia Google i Microsoft używają kopii kalendarzy w systemie kalendarza iPhone, aby prezentować i synchronizować wydarzenia. Nie zakładaj, że połączenie konta nie pozostawia żadnej kopii poza oryginalnym systemem dostawcy. Miejsce docelowe używane dla tych kopii może zależeć od źródeł kalendarza dostępnych na urządzeniu.",
        "Jeśli to samo konto trafia do telefonu również inną drogą, sprawdź nazwy kalendarzy i źródła, zanim uznasz powtarzające się wydarzenia za odrębne wpisy. Tymczasowo ukryj jeden kalendarz, aby ustalić, który widok z niego pochodzi. Nie usuwaj wydarzenia ani kalendarza tylko po to, aby ekran wyglądał schludniej: podłączona kopia może odesłać zmiany z powrotem do swojego dostawcy."
      ]
    },
    {
      "heading": "Przy tworzeniu wydarzenia nadal wybieraj kalendarz docelowy",
      "body": [
        "Przed zapisaniem sprawdź kalendarz wydarzenia równie uważnie jak datę i godzinę. W przypadku rodzinnego wydarzenia wybierz kalendarz, którego rodzina rzeczywiście używa; w przypadku spotkania służbowego użyj dozwolonego kalendarza służbowego. To, że widzisz oba kalendarze razem, nie oznacza, że którykolwiek z nich staje się automatycznym miejscem docelowym dla każdego nowego wydarzenia.",
        "Zmiana kalendarza wydarzenia lub przeciągnięcie go między kalendarzami może być przeniesieniem, a nie nieszkodliwym drugim widokiem. Podczas diagnozowania problemu z wyświetlaniem pozostaw zaproszenia i spotkania cykliczne w ich dotychczasowym kalendarzu. Jeśli potrzebujesz zmiany, najpierw ustal, kto jest właścicielem wydarzenia i który kalendarz może je przyjąć."
      ]
    },
    {
      "heading": "Zweryfikuj widok zbiorczy, zanim zaczniesz na nim polegać",
      "body": [
        "Porównaj niedawne wydarzenie w natywnym kalendarzu dostawcy z odpowiadającym mu wydarzeniem w Cloud Calendars. Sprawdź datę, strefę czasową, tytuł i wybrany kalendarz. W przypadku edytowalnego kalendarza, którego jesteś właścicielem, jednorazowe wydarzenie bez gości jest lepszym testem niż zmienianie aktywnego spotkania. Potwierdź wynik u dostawcy, zanim uznasz połączenie za gotowe.",
        "Nie zakładaj, że widok łączony automatycznie utworzy anonimowe bloki zajętości na innym koncie. Jeśli chcesz, aby współpracownicy widzieli Cię jako niedostępnego bez ujawniania szczegółów prywatnych, użyj wyraźnie zatwierdzonego sposobu udostępniania dostępności i sprawdź go z ich strony. Czytelny osobisty widok zbiorczy i współdzielona dostępność to dwa różne zadania."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Wypisz dokładne konto i kalendarz dla jednego wydarzenia od każdego dostawcy.",
    "Włącz odpowiednie kalendarze iCloud na urządzeniu i sprawdź dostęp do kalendarza.",
    "Użyj właściwego logowania Google lub Microsoft i wybierz odpowiednie kalendarze.",
    "Przed wprowadzaniem zmian porównaj jedno niedawne wydarzenie z widokiem u dostawcy.",
    "Tymczasowo ukryj źródło podejrzewane o duplikowanie; pozostaw same wydarzenia bez zmian.",
    "Przy każdym nowym wydarzeniu sprawdzaj kalendarz docelowy, a wszelkie potrzebne udostępnianie zajętości weryfikuj osobno."
  ],
  "faq": [
    {
      "q": "Czy moi współpracownicy zobaczą moje prywatne wydarzenia, ponieważ wyświetlam oba kalendarze?",
      "a": "Wspólne wyświetlanie kalendarzy nie jest poleceniem udostępnienia ani automatycznym mostem zajętości. Sprawdź rzeczywiste ustawienia udostępniania każdego kalendarza. Połączenia z dostawcami mogą tworzyć kopie kalendarzy na urządzeniu, więc widok łączony nie gwarantuje też, że dane wydarzeń istnieją wyłącznie u pierwotnego dostawcy."
    },
    {
      "q": "Dlaczego widzę wydarzenie, ale nie mogę go skutecznie edytować?",
      "a": "Kalendarz może być tylko do odczytu, wydarzenie może należeć do innego organizatora albo dostawca może odrzucać aktualizację. Sprawdź własność i uprawnienia w kalendarzu dostawcy. Zakup wyższego planu aplikacji nie zmienia tych uprawnień."
    },
    {
      "q": "Czy powinienem połączyć to samo konto Google wszystkimi dostępnymi sposobami?",
      "a": "Najpierw sprawdź, jak konto jest już widoczne na telefonie. Wiele sposobów połączenia może utrudniać rozpoznanie kopii kalendarzy. Wybierz sposób, którego chcesz używać, sprawdź jego wydarzenia i podczas analizy ukryj dodatkowy widok zamiast od razu usuwać dane lub odłączać konta."
    }
  ],
  "sourcesHeading": "Źródła i materiały konfiguracyjne",
  "sources": [
    {
      "label": "Apple: skonfiguruj iCloud Calendar na swoich urządzeniach",
      "url": "https://support.apple.com/guide/icloud/set-up-calendar-mme4d73a8727/icloud"
    },
    {
      "label": "Google: udostępnianie kalendarza i uprawnienia",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: API kalendarza Outlook i obsługiwane dane skrzynki pocztowej",
      "url": "https://learn.microsoft.com/en-us/graph/outlook-calendar-concept-overview"
    }
  ],
  "seeAlso": [
    "exchange-calendars-on-an-iphone",
    "what-calendar-sync-actually-does",
    "when-two-calendars-disagree",
    "caldav-calendar-on-iphone",
    "calendar-export-ics-pdf-and-backup",
    "onecal-alternative-iphone-calendar-view-or-sync"
  ],
  "comparison": {
    "heading": "Widok łączony, subskrypcja czy skopiowane zajęte terminy?",
    "columns": [
      "Czego potrzebujesz",
      "Co sprawdzić",
      "Czego nie zakładać"
    ],
    "rows": [
      {
        "cells": [
          "Jeden widok dla kilku kont",
          "Połączone konto, wybrany kalendarz i wymagany plan.",
          "Że wspólny ekran łączy własność lub uprawnienia."
        ]
      },
      {
        "cells": [
          "Edycja wydarzenia docierająca do dostawcy",
          "Oryginalne wydarzenie, uprawnienie do zapisu i zapisany wynik u źródła.",
          "Że widoczna lokalna edycja potwierdza udaną synchronizację z dostawcą."
        ]
      },
      {
        "cells": [
          "Zajęte terminy na innym koncie",
          "Usługa z jasno określonymi regułami synchronizacji ze źródła do miejsca docelowego.",
          "Że widok łączony tworzy bloki dostępności dla współpracowników."
        ]
      },
      {
        "cells": [
          "Subskrybowany kanał kalendarza",
          "Wydawcę, sposób odświeżania i status tylko do odczytu.",
          "Że subskrypcja ICS jest edytowalnym połączeniem dwukierunkowym."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-left",
    "hook"
  ],
  "galleryDevice": "iPad",
  "galleryCaption": "Rzeczywiste widoki kalendarza na iPadzie pokazują przegląd harmonogramu. Zrzut ekranu nie pokazuje kierunku synchronizacji z dostawcą ani uprawnień konta.",
  "actionHeading": "Przeglądaj swoje kalendarze razem na iPhone i iPad",
  "actionText": "Synchronizacja z Google Calendar jest dostępna w planie Base. Advanced usuwa reklamy, a Premium dodaje obsługę Microsoft Calendar i Teams. Uprawnienia konta potwierdź niezależnie od zakupionego planu.",
  "articleLinks": [
    {
      "slug": "onecal-alternative-iphone-calendar-view-or-sync",
      "label": "Porównaj widok łączony z regułami synchronizacji OneCal"
    },
    {
      "slug": "fantastical-readdle-calendar366-iphone-comparison",
      "label": "Porównaj sposoby pracy z kalendarzem na iPhone"
    },
    {
      "slug": "weather-inside-your-calendar",
      "label": "Planuj, mając pogodę i wydarzenia razem"
    }
  ]
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
