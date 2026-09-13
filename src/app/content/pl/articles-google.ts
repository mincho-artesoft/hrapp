import { LocalisedArticle } from '../types';

/** Sześć artykułów o Google: konkretne pytania, jasne odpowiedzi. */
export const GOOGLE_PL: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
    title: 'Kto co widzi, gdy udostępniasz kalendarz Google',
    short: 'Uprawnienia udostępniania',
    description:
      'Poziomy udostępniania w Google ustawia się szybko i łatwo rozumie opacznie. Co naprawdę odsłania każdy z nich, powiedziane wprost.',
    lede: 'Większość przypadkowego nadmiaru w udostępnianiu to nie błąd oceny. To ktoś wybrał poziom, który brzmiał skromnie, a taki nie był.',
    commonBelief: 'Że „tylko wolny/zajęty” i „wszystkie szczegóły wydarzeń” różnią się niewiele.',
    sections: [
      {
        heading: 'Poziomy dzieli więcej, niż wynika z nazw',
        body: [
          'Wolny/zajęty pokazuje bloki czasu bez tytułów. Wszystkie szczegóły pokazują tytuły, miejsca, notatki i gości — w większości kalendarzy sporą część twojego życia.',
          'Wprowadzanie zmian pozwala edytować. Zarządzanie udostępnianiem pozwala przekazać twój kalendarz kolejnym osobom i to ten poziom zaskakuje później.',
        ],
      },
      {
        heading: 'Wybierać bez zastanawiania się za każdym razem',
        body: [
          'Dla współpracowników, którzy mają tylko planować wokół ciebie, wolny/zajęty jest niemal zawsze właściwą odpowiedzią i niemal nigdy wybieraną.',
          'Pełne szczegóły zostaw kalendarzom stworzonym do udostępniania, nie temu, w którym żyjesz.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Miesięczny koszt poziomu, na którym zarządza się tym w aplikacji, w dolarach',
    },
    faq: [
      {
        q: 'Czy ktoś zobaczy tytuły moich wydarzeń, jeśli udostępnię tylko wolny/zajęty?',
        a: 'Nie. Wolny/zajęty pokazuje bloki czasu bez tytułów, miejsc, notatek i gości. Dopiero „wszystkie szczegóły” je odsłaniają — i odsłaniają wszystkie.',
      },
      {
        q: 'Co daje „wprowadzanie zmian i zarządzanie udostępnianiem”?',
        a: 'Edytowanie każdego wydarzenia oraz przekazanie twojego kalendarza kolejnym osobom bez pytania ciebie. To jedyny poziom, na którym ktoś inny rozdaje dostęp.',
      },
      {
        q: 'Czy mogę sprawdzić, kto ma już dostęp do mojego kalendarza?',
        a: 'Tak, w ustawieniach udostępniania tego kalendarza. Nic nie zachęca do zaglądania, a udostępnienia tylko się kumulują: przejrzyj listę dwa razy w roku.',
      },
    ],
    practical: [
      'Domyślnie wolny/zajęty dla każdego, kto ma tylko rezerwować u ciebie czas.',
      '„Wprowadzanie zmian” zostaw tym, którzy naprawdę planują za ciebie.',
      'Dwa razy w roku przejrzyj, kto ma dostęp; udostępnienia się kumulują i nic o nich nie przypomina.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'what-guests-can-do-to-your-event'],
  },

  'why-a-shared-calendar-does-not-appear': {
    title: 'Ktoś udostępnił ci kalendarz, a jego nie ma',
    short: 'Udostępniony kalendarz się nie pojawia',
    description:
      'Ktoś udostępnił kalendarz, przyjąłeś zaproszenie i nic się nie zmieniło. Cztery zwyczajne powody, w kolejności, w jakiej warto je sprawdzać.',
    lede: 'Zaproszenie przyszło, link został kliknięty, a kalendarza nadal nie ma. Prawie zawsze jest to jedna z czterech rzeczy i żadna z nich nie oznacza zepsutego udostępniania.',
    commonBelief: 'Że przyjęcie udostępnionego kalendarza umieszcza go w telefonie.',
    sections: [
      {
        heading: 'Przyjęcie dodaje go do konta, nie do urządzenia',
        body: [
          'Udostępnienie ląduje na koncie Google, do którego było zaadresowane. Jeśli przyjąłeś je zalogowany na jednym koncie, a telefon nosi inne, kalendarz spokojnie leży dokładnie tam, gdzie nie patrzysz.',
          'Nawet na właściwym koncie świeżo dodany kalendarz częściej przychodzi na inne urządzenia wyłączony niż włączony. Istnieje, tylko nie jest zaznaczony — a niezaznaczony kalendarz wygląda dokładnie jak brakujący.',
        ],
      },
      {
        heading: 'Dwa pozostałe powody',
        body: [
          'Udostępnienie na listę mailingową albo adres grupowy rzadko dociera do pojedynczych osób; potrzebny jest adres, który naprawdę jest kontem Google. A kalendarz udostępniony linkiem to subskrypcja: trafia w inne miejsce listy i odświeża się w rytmie wydawcy, a nie natychmiast.',
          'Na iPhonie kalendarze Google docierają do wbudowanej aplikacji przez własną listę synchronizacji, a kalendarze dodatkowe domyślnie stoją poza nią. Dlatego jedno konto pokazuje kalendarz główny i po cichu gubi te cztery, na których ci zależy.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Godziny między prośbami o odświeżenie subskrybowanego kanału',
      accounts: 'Rodzaje kont, które jeden widok trzyma razem bez tego wszystkiego',
    },
    faq: [
      {
        q: 'Przyjąłem udostępniony kalendarz, ale nie ma go na iPhonie. Dlaczego?',
        a: 'Udostępnienie ląduje na koncie Google, do którego było adresowane, a świeżo dodany kalendarz przychodzi na inne urządzenia najczęściej wyłączony. Sprawdź najpierw konto, potem szukaj go niezaznaczonego, a nie brakującego.',
      },
      {
        q: 'Czy udostępnienie na adres grupowy działa?',
        a: 'Rzadko. Lista mailingowa prawie nie dociera do stojących za nią osób. Potrzebny jest adres, który sam jest kontem Google.',
      },
      {
        q: 'Jak długo czeka się na pojawienie się udostępnionego kalendarza?',
        a: 'Udostępnienie przez uprawnienia pojawia się, gdy lista się odświeży. Kalendarz udostępniony linkiem to subskrypcja i odświeża się w rytmie wydawcy.',
      },
    ],
    practical: [
      'Najpierw sprawdź, które konto przyjęło udostępnienie.',
      'Otwórz listę kalendarzy na urządzeniu i szukaj go wyłączonego, a nie nieobecnego.',
      'Jeśli przyszedł linkiem, spodziewaj się opóźnienia zamiast natychmiastowego pojawienia.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'google-calendars-that-never-reach-your-iphone'],
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
