import { LocalisedArticle } from '../types';

/**
 * The four articles this language carries.
 *
 * Chosen one per intent -- weather, one view, sharing, price -- so the language
 * answers a whole question rather than a quarter of four. The numbers are not
 * here: they live once in article-facts.ts and join the prose by id, so a
 * translation can rewrite every sentence without touching a figure.
 */
export const ARTICLES_RO: Readonly<Record<string, LocalisedArticle>> = {
  "month-view-on-a-bigger-screen": {
  "updated": "2026-10-22",
  "title": "Calendar lunar pe iPad și iPhone: vezi datele, apoi verifică detaliile",
  "short": "Vedere lunară fără detalii omise",
  "description": "Compară date pe iPad sau iPhone. Verifică evenimente ascunse, calendare selectate și ore exacte înainte să muți întâlniri partajate sau repetate.",
  "lede": "Vederea lunară arată în ce date cad angajamentele. Este mai puțin potrivită pentru a confirma că o anumită oră este liberă. Alege o dată din ansamblu, apoi verifică ziua și evenimentul înainte să confirmi. Ghidul este publicat de Arte Soft, dezvoltatorul Cloud Calendars.",
  "commonBelief": "O grilă lunară mai mare arată toate detaliile, iar o dată aparent goală dovedește că toată lumea este disponibilă.",
  "sections": [
    {
      "heading": "Decide dacă ai nevoie de date sau ore exacte",
      "body": [
        "Folosește luna pentru a compara un termen de proiect, o călătorie și o întâlnire de familie pe mai multe săptămâni. Dacă vrei să știi dacă două întâlniri se suprapun la 14:30, treci la zi sau săptămână și verifică începutul și sfârșitul. Celula lunară nu are scara unei grile orare.",
        "De exemplu, organizatorul unui atelier poate evita întâi o săptămână de călătorie. Apoi verifică ziua propusă: angajamente, pregătire, drum și ora necesară de încheiere. O celulă aparent liberă este o posibilitate de investigat, nu o rezervare confirmată sau dovada disponibilității altora."
      ]
    },
    {
      "heading": "Citește indicatorul evenimentelor suplimentare",
      "body": [
        "Celula lunară actuală din Cloud Calendars arată un număr limitat de etichete și o indicație numerică pentru celelalte evenimente ale datei. Titlurile ocupă o linie și pot fi scurtate. Deschide ziua sau evenimentul când contează titlul complet ori celelalte angajamente.",
        "Ecranul mai mare al iPad-ului poate ușura citirea, dar spațiul fizic nu elimină neapărat toate limitele. O fereastră îngustă sau un text mai mare schimbă ce încape. Verifică la fel pe iPhone: inspectează ziua înainte să consideri etichetele vizibile drept programul complet."
      ]
    },
    {
      "heading": "Verifică luna, calendarele și datele învecinate",
      "body": [
        "Citește luna și anul afișate înainte să alegi o dată. Grila poate include date din luna alăturată pentru a completa rândurile. În Cloud Calendars, folosește navigarea lunară și verifică data selectată, fără să te bazezi doar pe poziția pătratului.",
        "Verifică calendarele selectate. Ascunderea muncii ajută la citirea unui plan de familie, dar elimină acele angajamente din imaginea respectivă. Pentru un duplicat, ascunde temporar o sursă și compară; nu șterge o întâlnire doar ca luna să fie mai aerisită."
      ]
    },
    {
      "heading": "Deschide evenimentul înainte să modifici un plan comun",
      "body": [
        "În detalii, confirmă titlul, proprietarul sau calendarul, ora locală și durata. Culoarea ajută la orientare, dar nu înlocuiește identificarea contului ori a dreptului de editare. O invitație vizibilă diferă de o întâlnire organizată de tine.",
        "Cloud Calendars permite mutarea evenimentelor la altă dată prin glisare în vederea lunară. Înainte de a muta un angajament real, stabilește data dorită și domeniul repetării. După o modificare permisă, redeschide și verifică: un gest local nu dovedește acceptarea de către furnizor sau toți participanții."
      ]
    },
    {
      "heading": "Verifică separat repetarea și fusurile orare",
      "body": [
        "Dacă se mută doar lecția de săptămâna aceasta, nu schimba accidental modelul viitor. Citește opțiunea privind domeniul repetării și verifică apoi atât apariția schimbată, cât și una ulterioară. Luna ajută la compararea datelor repetate, dar domeniul editării stabilește efectul.",
        "Pentru călătorii sau întâlniri între fusuri orare, verifică explicit data și ora locală. Mutarea în altă zi nu convertește automat ora intenționată. Verifică trecerile la ora de vară când sunt relevante și confirmă ora convenită cu cei implicați."
      ]
    },
    {
      "heading": "Nu confunda vederea mai mare cu alte produse",
      "body": [
        "Calendar Apple are propriile opțiuni lunare, iar Teamup documentează vederi diferite pentru browser și mobil. Controalele aparțin produselor respective. Nu căuta configurarea Teamup din browser sau meniul Apple în Cloud Calendars doar fiindcă vederea are același nume.",
        "O lună de întâlniri nu înseamnă o lună de prognoză. Pentru un plan în aer liber, verifică separat locul, data și orele disponibile în prognoză. Salvează întâlnirea în calendarul dorit și confirmă direct cu participanții orice schimbare."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Alege date în vederea lunară, apoi verifică orele în zi sau săptămână.",
    "Deschide zilele cu număr suplimentar sau titluri scurtate.",
    "Verifică luna, anul și calendarele înainte să consideri data liberă.",
    "Confirmă calendarul, ora, durata și dreptul de editare.",
    "Citește domeniul repetării și verifică apariția salvată după mutare.",
    "Verifică prognoza separat și confirmă schimbările cu participanții."
  ],
  "faq": [
    {
      "q": "Pe iPad, vederea lunară afișează integral toate întâlnirile?",
      "a": "Nu presupune asta. Cloud Calendars limitează etichetele și afișează un număr suplimentar. Deschide ziua și evenimentul pentru programul complet."
    },
    {
      "q": "O zi goală înseamnă că sunt liber?",
      "a": "Verifică mai întâi calendarele selectate, data și prezența datelor conturilor relevante. Ansamblul reprezintă doar informațiile disponibile și afișate atunci."
    },
    {
      "q": "Mutarea unui eveniment repetat schimbă doar acea dată?",
      "a": "Citește domeniul editării. După salvare, verifică apariția schimbată și una ulterioară, apoi confirmă rezultatul dorit."
    }
  ],
  "sourcesHeading": "Compară descrierile oficiale ale vederilor",
  "sources": [
    {
      "label": "Apple: vederi lunare, pe mai multe zile și listă",
      "url": "https://support.apple.com/en-ca/guide/iphone/iphfd1054569/ios"
    },
    {
      "label": "Teamup: vederi și configurare în browser față de aplicație",
      "url": "https://calendar.teamup.com/kb/how-to-use-calendar-views/"
    }
  ],
  "seeAlso": []
},

  'weather-inside-your-calendar': {
  "updated": "2026-10-22",
  "title": "Calendar cu vreme pe iPhone și iPad: verifică planul în context",
  "short": "Folosește calendarul și vremea împreună",
  "description": "Folosește calendarul și vremea pe iPhone și iPad. Verifică locul, orele de prognoză disponibile și detaliile evenimentului înainte de salvare.",
  "lede": "Calendarul arată când este programat un angajament. Vremea răspunde la altă întrebare: ce condiții sunt prognozate pentru locul și perioada necesare. Folosește-le împreună, păstrând clare locurile și datele. Ghidul este publicat de Arte Soft, dezvoltatorul Cloud Calendars.",
  "commonBelief": "Vremea afișată lângă calendar descrie automat adresa fiecărei întâlniri, fiecare oră și orice dată viitoare.",
  "sections": [
    {
      "heading": "Alege o întrebare concretă de planificare",
      "body": [
        "Începe cu o întâlnire concretă, precum o vizită în parc după-amiaza. Identifică ce s-ar putea schimba: ora, locul, pregătirea sau alegerea unei alternative. Nu trebuie să reorganizezi tot calendarul doar fiindcă simbolul zilei arată ploaie.",
        "Notează începutul și sfârșitul real al activității, inclusiv pregătirea când contează. Ansamblul calendarului ajută la găsirea datelor posibile, iar verificarea vremii privește un loc și interval precis. Separă aceste roluri când compari opțiuni."
      ]
    },
    {
      "heading": "Confirmă locul prognozei",
      "body": [
        "Cloud Calendars oferă vreme pentru locul curent sau selectat. Verifică locația afișată, fără să presupui că adresa unui eveniment schimbă automat prognoza. O întâlnire în alt oraș trebuie comparată cu vremea acelui oraș.",
        "De exemplu, un vizitator poate planifica sosirea la muzeu când telefonul este încă acasă. Citește locația prognozei și ora locală a întâlnirii înainte să le compari. Valorile apropiate pe ecran nu dovedesc folosirea aceluiași loc."
      ]
    },
    {
      "heading": "Verifică separat orele și zilele disponibile",
      "body": [
        "Folosește rezumatul zilnic pentru orientare și orele disponibile pentru o parte a zilei. O rezervare de la două la cinci cere mai mult decât privirea unui simbol. Verifică dacă orele relevante chiar sunt prezente.",
        "În sursa actuală a aplicației, lista zilnică preia până la zece zile returnate de WeatherKit. Aceasta diferă de navigarea calendarului și de orele furnizate. O întâlnire viitoare nu extinde prognoza. Dacă perioada lipsește, planifică o verificare meteo ulterioară."
      ]
    },
    {
      "heading": "Înțelege semnificația valorilor",
      "body": [
        "Apple documentează date WeatherKit precum temperatură, precipitații, vânt și UV, unele produse fiind disponibile doar în anumite regiuni. Citește valorile pentru locul ales, fără să aștepți toate produsele meteo peste tot.",
        "Ghidul Met Office arată de ce contează perioada și definiția variabilei: unele valori descriu un moment, altele un interval. Folosește etichetele furnizorului relevant. Probabilitatea, cantitatea și durata ploii sunt întrebări diferite; un singur număr nu decide orice activitate în aer liber."
      ]
    },
    {
      "heading": "Revizuiește schița creată dintr-o oră meteo",
      "body": [
        "Acolo unde aplicația permite crearea unui eveniment dintr-o oră, deschide o schiță. Sursa actuală folosește fusul locului prognozei, propune o oră durată și alege calendarul implicit pentru evenimente noi. Inspectează fiecare valoare înainte de salvare.",
        "Confirmă titlul, calendarul destinație, începutul, sfârșitul și locul dorit. Selectarea prognozei nu acordă drept de editare a unui calendar partajat, nu anunță locația și nu rezervă o sală. Verifică evenimentul salvat și obține acordurile necesare."
      ]
    },
    {
      "heading": "Separă demonstrația de pe site",
      "body": [
        "Demonstrația meteo interactivă de pe site folosește Open-Meteo. Aplicația folosește Apple WeatherKit. Demonstrația ajută la explorarea prezentării, dar locul, datele și perioada disponibilă pot diferi de aplicație.",
        "Pentru o decizie reală, deschide aplicația și compară întâlnirea cu prognoza disponibilă. Dacă schimbi un plan comun, confirmă organizatorul, domeniul repetării și participanții. Stabiliți o alternativă când activitatea depinde de condiții."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifică întâlnirea și decizia influențată de vreme.",
    "Confirmă locația meteo și data și ora locală ale întâlnirii.",
    "Verifică orele disponibile separat de rezumatul zilnic.",
    "Citește probabilitatea, cantitatea și alte valori după etichete.",
    "Revizuiește toate detaliile schiței și calendarul destinație înainte de salvare.",
    "Verifică din nou la momentul deciziei și confirmă direct schimbările comune."
  ],
  "faq": [
    {
      "q": "Vremea de lângă calendar urmează adresa fiecărui eveniment?",
      "a": "Nu presupune asta. Verifică locația meteo afișată și compar-o cu destinația; apropierea pe ecran nu dovedește potrivirea."
    },
    {
      "q": "Aplicația folosește furnizorul meteo al site-ului?",
      "a": "Nu. Aplicația folosește Apple WeatherKit, iar demonstrația site-ului folosește separat Open-Meteo."
    },
    {
      "q": "Alegerea unei ore de prognoză salvează automat întâlnirea?",
      "a": "Pornește o schiță unde acțiunea este oferită. Verifică data, fusul, durata, calendarul și locul, apoi salvează evenimentul dorit."
    }
  ],
  "sourcesHeading": "Surse oficiale și lecturi suplimentare",
  "sources": [
    {
      "label": "Apple: informații WeatherKit și disponibilitate regională",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: locul, perioadele și valorile prognozei",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ],
  "seeAlso": []
},

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google și Outlook într-o singură vedere',
    short: 'Trei conturi, o vedere',
    description:
      'Viața aproape oricui este împărțită între un calendar personal Apple, un cont Google și un Exchange de la serviciu. Ce se schimbă când ajung în aceeași grilă.',
    lede: 'Problema aproape niciodată nu este că vreunul dintre calendare ar fi prost. Este că aveți trei și o singură săptămână.',
    commonBelief:
      'Că a ține munca și viața personală în aplicații separate este o graniță, nu un defect.',
    sections: [
      {
        heading: 'Suprapunerea programărilor este structurală',
        body: [
          'Dacă angajamentele dumneavoastră trăiesc în trei locuri, niciun loc nu vă poate spune dacă sunteți liber. Pasul de îmbinare sunteți dumneavoastră și îl executați din memorie, de obicei în timp ce cineva așteaptă un răspuns.',
          'De aceea eșecul clasic nu este să uitați un eveniment; este să acceptați ceva care se ciocnește de un eveniment pe care nu-l puteați vedea.',
        ],
      },
      {
        heading: 'Ce dă o singură grilă',
        body: [
          'Toate conturile în aceeași săptămână, colorate după proveniență, editabile pe loc. Încetați să vă întrebați ce aplicație are răspunsul, pentru că întrebarea încetează să fie la plural.',
          'iCloud și Google se sincronizează în versiunea gratuită. Conturile Microsoft — Outlook și Exchange — țin de cea plătită, pentru că acea conexiune are un cost recurent pe care celelalte nu îl au.',
        ],
      },
    ],
    claims: {
      accounts: 'Tipuri de cont care încap într-o vedere',
      premiumMonthly: 'Costul lunar al adăugării Microsoft, în dolari',
    },
    practical: [
      'Adăugați întâi contul personal și apoi pe cel care provoacă ciocnirile.',
      'Colorați după cont, nu după categorie: proveniența este ce trebuie văzut dintr-o privire.',
      'Continuați să scrieți în calendarul pe care ceilalți îl citesc deja.',
    ],
    seeAlso: ['weather-inside-your-calendar', 'what-a-subscription-actually-buys'],
  },

  'sharing-one-event-not-your-calendar': {
  "updated": "2026-10-21",
  "title": "Partajează un singur eveniment: alege linkul și accesul potrivit",
  "short": "Partajarea unui eveniment",
  "description": "Partajează un eveniment fără întregul calendar. Află ce permit Reader, Writer și Owner, previzualizarea, actualizările și retragerea accesului.",
  "lede": "Trimiterea detaliilor unei cine, editarea de către un coorganizator și colectarea răspunsurilor de participare sunt sarcini diferite. Alege întâi sarcina, apoi metoda. Ghid scris de Arte Soft, dezvoltatorul Cloud Calendars.",
  "commonBelief": "Orice link de eveniment este un abonament doar pentru citire, actualizat imediat, care înregistrează un răspuns.",
  "sections": [
    {
      "heading": "Începe cu un eveniment și verifică detaliile",
      "body": [
        "Partajarea unui singur eveniment se limitează la acesta, nu la întregul calendar al expeditorului. Verifică titlul, fusul orar, locul, notele și linkul întâlnirii. Detaliile utile unui invitat pot fi nepotrivite într-un link distribuit larg.",
        "De exemplu, o cină nu necesită partajarea calendarului cu programările medicale. Totuși, locul și linkurile cinei însoțesc evenimentul. Verifică evenimentul în sine, nu te baza pe confidențialitatea calendarului din jur."
      ]
    },
    {
      "heading": "Alege previzualizare, e-mail sau QR",
      "body": [
        "Cloud Calendars oferă metode distincte. App Clip prezintă o previzualizare; pentru adăugare prin acea experiență este necesară aplicația completă. Invitațiile prin e-mail și QR folosesc o pagină web care propune deschiderea Cloud Calendars. Nu considera toate linkurile adrese de abonare interschimbabile.",
        "Expeditorul se autentifică pentru partajarea sincronizată. Linkul sau codul QR poate fi redirecționat, deci trimite-l doar unde conținutul este potrivit. Codul QR transmite un link, nu dovedește cine l-a deschis."
      ]
    },
    {
      "heading": "Acordă doar accesul necesar",
      "body": [
        "Invitațiile prin e-mail permit alegerea Reader, Writer sau Owner. Reader poate vizualiza și sincroniza; Writer poate edita; Owner poate și partaja și gestiona accesul. Sunt alegeri cu efecte reale, nu trei nume pentru aceeași vizualizare. Folosește Reader pentru cine are nevoie doar de program.",
        "Alege Writer pentru un coorganizator care trebuie să modifice evenimentul. Alege Owner doar dacă trebuie să gestioneze și accesul altora. Drepturile superioare necesită identitatea autentificată potrivită. Un destinatar anonim nu este un coproprietar identificat."
      ]
    },
    {
      "heading": "Înțelege cum îl adaugă destinatarul",
      "body": [
        "În aplicația completă, adăugarea necesită permisiune pentru calendar și o destinație editabilă. Destinatarul trebuie să verifice calendarul înainte de salvare. Copia primită poate fi apoi asociată evenimentului partajat pentru actualizări.",
        "Aceasta diferă de importul unui fișier ICS obișnuit în alt calendar. Importul este o copie; abonamentul verifică periodic un flux. Dacă trimiți un flux ICS în locul invitației aplicației, explică metoda și confirmă compatibilitatea calendarului destinatarului."
      ]
    },
    {
      "heading": "Verifică modificările înainte să te bazezi pe ele",
      "body": [
        "Partajarea sincronizată poate transmite editări sau anulări, dar dispozitivul destinatarului trebuie să aibă ocazia să le primească. O indicație de reîmprospătare a fluxului nu este un termen de livrare. Un dispozitiv offline, abonament nereîmprospătat sau import separat poate arăta informații vechi.",
        "Dacă cina se mută cu puțin înainte de începere, actualizează evenimentul și contactează direct invitații. Cere confirmarea noii ore. Trimiterea actualizării și primirea unui răspuns de participare sunt pași separați."
      ]
    },
    {
      "heading": "Gestionează accesul fără promisiuni de ștergere a copiilor",
      "body": [
        "Revizuiește destinatarii și retrage drepturile inutile. Eliminarea unui destinatar și revocarea linkului unui flux sunt operații distincte; niciuna nu trebuie prezentată ca ștergând de la distanță capturi, mesaje sau toate copiile calendarului.",
        "Dacă linkul a depășit publicul dorit, identifică linkul sau dreptul implicat. Verifică metoda afectată după schimbarea accesului. Pe viitor, nu include detalii private în linkuri larg distribuite, în loc să te bazezi pe revocare ulterioară."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Verifică detaliile și alege între vizualizare, editare și răspunsuri de participare.",
    "Alege metoda și autentifică-te când este necesar.",
    "Folosește Reader pentru vizualizare; acordă Writer sau Owner doar pentru responsabilitatea respectivă.",
    "Cere destinatarului să verifice ora și calendarul de destinație la adăugare.",
    "Pentru schimbări urgente, actualizează evenimentul și trimite un mesaj direct.",
    "La încheiere, verifică separat drepturile destinatarilor și accesul linkurilor."
  ],
  "faq": [
    {
      "q": "Partajarea unui eveniment expune tot calendarul?",
      "a": "Metoda sincronizată pentru un eveniment se limitează la acesta. Detaliile proprii sunt totuși expuse prin metoda aleasă. Verifică-le și nu trimite o invitație pentru tot calendarul dacă intenționezi doar un eveniment."
    },
    {
      "q": "Poate destinatarul modifica evenimentul?",
      "a": "Da, cu acces Writer sau Owner potrivit și fluxul autentificat acceptat. Reader permite vizualizare și sincronizare. Un abonament ICS obișnuit nu este același mecanism de editare."
    },
    {
      "q": "Eliminarea cuiva retrage tot ce a primit deja?",
      "a": "Nu trebuie presupusă o asemenea garanție. Accesul afectează relația de partajare, dar copiile salvate, capturile și mesajele pot rămâne. Adresa unui flux partajat trebuie analizată separat."
    }
  ],
  "sourcesHeading": "Referințe pentru opțiunile destinatarului",
  "sources": [
    {
      "label": "Apple: prezentarea App Clips",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google: importul evenimentelor și limitări",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft: import sau abonare la calendar",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": []
},

  'what-a-subscription-actually-buys': {
  "updated": "2026-10-21",
  "title": "Ce cumpără de fapt un abonament",
  "short": "Ce cumpără un abonament",
  "description": "Ce cumpără un abonament: Base, Advanced, Premium.",
  "lede": "Acest ghid este publicat de Arte Soft, dezvoltatorul Cloud Calendars.",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "Base include sincronizare Google Calendar, Google Meet, vizualizări de calendar, vreme și widgeturi. Planul gratuit poate afișa reclame."
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Advanced include Base și elimină reclamele. Premium include Advanced și adaugă Microsoft Calendar și Microsoft Teams.",
        "Un abonament nu oferă drepturi de editare pentru calendarele altora și nu ocolește restricțiile unui cont de serviciu."
      ]
    },
    {
      "heading": "Informații despre cumpărare și anulare",
      "body": [
        "Înainte de cumpărare, verificați prețul local, perioada de facturare și condițiile de reînnoire.",
        "Pentru un abonament facturat de Apple, deschideți Configurări → numele dvs. → Abonamente. Verificați starea și data expirării. Oprirea reînnoirii este separată de ștergerea aplicației sau a datelor din calendar; nu presupuneți că funcțiile plătite rămân disponibile după expirare."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Înainte de cumpărare, verificați prețul local, perioada de facturare și condițiile de reînnoire.",
    "Un abonament nu oferă drepturi de editare pentru calendarele altora și nu ocolește restricțiile unui cont de serviciu."
  ],
  "faq": [
    {
      "q": "Cum opresc reînnoirea?",
      "a": "Pentru un abonament facturat de Apple, deschideți Configurări → numele dvs. → Abonamente. Verificați starea și data expirării. Oprirea reînnoirii este separată de ștergerea aplicației sau a datelor din calendar; nu presupuneți că funcțiile plătite rămân disponibile după expirare."
    }
  ],
  "sourcesHeading": "Informații despre cumpărare și anulare",
  "sources": [
    {
      "label": "Apple: Cum opresc reînnoirea?",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view"
  ]
},
};
