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
  "updated": "2026-10-23",
  "title": "Calendar cu vreme pe iPhone și iPad: planifică-ți ziua dintr-o singură privire",
  "short": "Folosește calendarul și vremea împreună",
  "description": "Compară calendarul tău cu vremea pentru locul selectat pe iPhone și iPad.",
  "lede": "Cloud Calendars îți aduce programul și vremea în aceeași aplicație pe iPhone sau iPad. Folosește calendarul pentru a alege o dată și vizualizarea meteo pentru a examina locul selectat și orele de prognoză disponibile. Pentru un plan în aer liber, verifică intervalul care contează, în loc să te bazezi pe o pictogramă zilnică. Acest ghid este publicat de Arte Soft, dezvoltatorul aplicației.",
  "commonBelief": "Vremea afișată lângă un calendar descrie automat adresa fiecărui eveniment, fiecare oră și orice dată viitoare.",
  "sections": [
    {
      "heading": "Alege o întrebare reală de planificare",
      "body": [
        "Pornește de la un eveniment concret, cum ar fi o vizită după-amiaza într-un parc. Stabilește ce s-ar putea schimba: ora, locul, pregătirea sau decizia de a folosi o alternativă. Nu trebuie să rearanjezi tot calendarul doar pentru că simbolul zilei arată ploaie.",
        "Notează începutul și sfârșitul reale ale activității, incluzând pregătirea dacă este relevantă. O privire de ansamblu asupra calendarului ajută la găsirea datelor posibile, în timp ce verificarea prognozei privește un anumit loc și un anumit interval. Păstrează distincte aceste două roluri când compari opțiunile."
      ]
    },
    {
      "heading": "Confirmă locul pentru vreme înainte de a citi valorile",
      "body": [
        "Cloud Calendars oferă vremea pentru locul curent sau selectat. Verifică locația afișată, în loc să presupui că adresa unui eveniment schimbă implicit prognoza. Un eveniment din alt oraș trebuie comparat cu vremea din acel oraș.",
        "De exemplu, cineva poate planifica sosirea la un muzeu în timp ce telefonul este încă acasă. Citește locația prognozei și ora locală a evenimentului înainte să le compari. Valorile care par apropiate nu dovedesc că programul și vremea folosesc același loc."
      ]
    },
    {
      "heading": "Verifică separat acoperirea pe ore și pe zile",
      "body": [
        "Folosește o intrare zilnică pentru orientare și intrările orare disponibile pentru o întrebare despre o parte a zilei. O rezervare de la două la cinci are nevoie de mai mult decât o privire la un singur simbol. Verifică dacă orele relevante sunt într-adevăr prezente.",
        "În sursa actuală a aplicației, lista zilnică preia până la zece zile returnate de WeatherKit. Acest lucru este separat de navigarea în calendar și de orele furnizate în prezent. Un eveniment viitor nu extinde acoperirea meteo. Dacă intervalul lui lipsește, programează o nouă verificare a vremii mai târziu."
      ]
    },
    {
      "heading": "Înțelege ce înseamnă valoarea meteo",
      "body": [
        "Apple documentează datele WeatherKit precum temperatura, precipitațiile, vântul și UV, unele produse fiind disponibile doar în anumite regiuni. Citește valorile disponibile pentru locul ales, în loc să te aștepți ca fiecare produs meteo să existe peste tot.",
        "Ghidul Met Office arată de ce contează perioada prognozei și definițiile variabilelor: unele valori se referă la un moment, altele la o perioadă. Folosește etichetele furnizorului relevant. Probabilitatea de ploaie, cantitatea și durata sunt întrebări diferite, iar niciun număr unic nu decide orice activitate în aer liber."
      ]
    },
    {
      "heading": "Verifică o schiță creată dintr-o oră meteo",
      "body": [
        "Acolo unde aplicația oferă crearea unui eveniment dintr-o oră, aceasta deschide o schiță. Sursa actuală folosește fusul orar al locației meteo, propune o durată de o oră și selectează calendarul implicit pentru evenimente noi. Verifică fiecare valoare înainte de salvare.",
        "Confirmă titlul, calendarul de destinație, începutul, sfârșitul și locația dorită. O selecție din prognoză nu îți dă permisiunea să editezi un calendar partajat, să anunți un loc sau să rezervi o sală. Verifică evenimentul salvat și obține orice acord necesar planului."
      ]
    },
    {
      "heading": "Păstrează separată demonstrația de pe site",
      "body": [
        "Demonstrația interactivă meteo de pe site folosește Open-Meteo. Aplicația folosește Apple WeatherKit. O demonstrație web este utilă pentru a explora prezentarea, dar locul, datele și datele calendaristice disponibile pot diferi față de aplicație.",
        "Pentru o decizie reală, deschide aplicația și compară evenimentul planificat cu prognoza disponibilă. Dacă modifici un plan partajat, confirmă organizatorul, domeniul recurenței și participanții. Păstrează o alternativă agreată când activitatea depinde de condiții."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifică evenimentul și decizia pe care vremea ar putea să o schimbe.",
    "Confirmă locația vremii și data și ora locale ale evenimentului.",
    "Examinează separat acoperirea orară disponibilă față de rezumatul zilnic.",
    "Citește probabilitatea, cantitatea și celelalte valori relevante folosind etichetele lor.",
    "Verifică toate detaliile schiței de eveniment și calendarul de destinație înainte de salvare.",
    "Verifică din nou la momentul deciziei și confirmă direct schimbările comune."
  ],
  "faq": [
    {
      "q": "Vremea afișată lângă calendarul meu urmărește adresa fiecărui eveniment?",
      "a": "Nu presupune asta. Confirmă locația meteo afișată și compar-o cu locul desfășurării; apropierea pe ecran nu dovedește corespondența."
    },
    {
      "q": "Aplicația folosește furnizorul meteo de pe site?",
      "a": "Nu. Aplicația folosește Apple WeatherKit; demonstrația de pe site folosește separat Open-Meteo."
    },
    {
      "q": "Alegerea unei ore din prognoză salvează automat un eveniment?",
      "a": "Pornește o schiță acolo unde această acțiune este oferită. Verifică data, fusul orar, durata, calendarul și locația, apoi salvează evenimentul dorit."
    }
  ],
  "seeAlso": [
    "weather-calendar-history-versus-forecast-iphone",
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather",
    "weather-where-the-event-is",
    "planning-outdoors-without-being-rained-on"
  ],
  "sourcesHeading": "Surse oficiale și lecturi suplimentare",
  "sources": [
    {
      "label": "Apple: informații despre prognoza WeatherKit și disponibilitatea regională",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: locul prognozei, perioadele și valorile meteo",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ],
  "comparison": {
    "heading": "Ce vizualizare meteo răspunde la întrebarea ta?",
    "columns": [
      "Întrebarea ta",
      "Ce să verifici",
      "Ce nu dovedește"
    ],
    "rows": [
      {
        "cells": [
          "Ce urmează astăzi?",
          "Vizualizarea pe zi sau pe săptămână a calendarului alături de vremea pentru locul selectat.",
          "Că adresa fiecărui eveniment schimbă automat locația vremii."
        ]
      },
      {
        "cells": [
          "Ar putea ploaia să afecteze evenimentul meu de după-amiază?",
          "Datele orare pentru locul desfășurării și pentru întreaga durată a evenimentului.",
          "Că un simbol zilnic descrie fiecare oră."
        ]
      },
      {
        "cells": [
          "Pot să-mi planific luna viitoare în funcție de vreme?",
          "Calendarul tău acum, apoi o verificare a prognozei mai aproape de dată.",
          "Că navigarea în calendar extinde acoperirea prognozei."
        ]
      },
      {
        "cells": [
          "Pot vedea rapid o privire de ansamblu acasă?",
          "Widgetul potrivit pentru Ecran principal.",
          "Că fiecare aranjare de widget include evenimente sau o prognoză completă."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-right",
    "hook"
  ],
  "galleryCaption": "Ecrane reale din Cloud Calendars: vizualizarea meteo și o zi cu evenimente. Verifică în aplicație locul și data selectate.",
  "actionHeading": "Planifică folosind împreună programul și prognoza",
  "actionText": "Cloud Calendars este pentru iPhone și iPad. Începe cu vizualizările, vremea și sincronizarea Google Calendar incluse în Base; Advanced elimină reclamele, iar Premium adaugă suport pentru Microsoft Calendar și Teams.",
  "articleLinks": [
    {
      "slug": "forecast-beside-every-event",
      "label": "Verifică vremea pentru orele unui eveniment"
    },
    {
      "slug": "the-widget-that-shows-what-is-next",
      "label": "Alege un widget de calendar și vreme"
    },
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "Adu conturile de calendar într-o singură vizualizare"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
  "updated": "2026-10-23",
  "title": "Vedeți împreună calendarele Google, iCloud și Outlook pe iPhone și iPad",
  "short": "Trei furnizori, o singură vizualizare",
  "description": "Combinați vizualizări de calendar și înțelegeți permisiunile contului, copiile și cerințele planului.",
  "lede": "Pentru a vedea împreună evenimentele de serviciu și cele personale, conectați conturile dorite, selectați calendarele lor și verificați aceleași evenimente într-o singură vizualizare. Cloud Calendars acceptă planificarea pe iPhone și iPad cu iCloud și Google Calendar; suportul pentru Microsoft Calendar este disponibil în Premium. A vedea evenimentele împreună este diferit de copierea intervalelor ocupate între conturile furnizorilor. Arte Soft, dezvoltatorul, publică acest ghid.",
  "commonBelief": "Punerea mai multor calendare într-o singură aplicație menține automat în acord disponibilitatea, partajarea și copiile evenimentelor lor.",
  "sections": [
    {
      "heading": "Identificați contul și calendarul din spatele fiecărui eveniment",
      "body": [
        "Începeți cu un eveniment obișnuit de la fiecare furnizor. Notați adresa de e-mail conectată, numele calendarului și dacă dețineți evenimentul sau ați primit o invitație. Două calendare numite „Calendar” pot aparține unor conturi complet diferite. O culoare vă ajută să parcurgeți rapid o săptămână; contul și calendarul identifică locul unde trebuie făcută o modificare.",
        "De exemplu, o programare la dentist din calendarul dvs. personal iCloud și o întâlnire de proiect din Microsoft pot apărea împreună pentru dvs. Asta nu face, de la sine, ca programarea la dentist să devină vizibilă colegilor sau să rezerve acel interval în instrumentele lor de planificare.",
        "Stabiliți rezultatul dorit înainte de a modifica o conexiune. Pentru a muta datele evenimentelor într-un alt cont, folosiți „Alegeți un format de export al calendarului” de mai jos pentru a găsi o rută de transfer acceptată și verificați evenimente reprezentative înainte de a vă baza pe destinație. Pentru a compara orele, păstrați proprietarii actuali ai calendarelor și afișați împreună sursele selectate. Dacă alt cont trebuie să primească intervalele ocupate, „Cloud Calendars și OneCal după fluxul de lucru” explică modul în care copierea disponibilității diferă de o prezentare personală."
      ]
    },
    {
      "heading": "Conectați-vă prin ruta potrivită",
      "body": [
        "Pentru iCloud, activați mai întâi iCloud Calendar pe iPhone în Apple Account-ul dorit. Ghidul de configurare Apple explică setările dispozitivului. Cloud Calendars accesează calendarele disponibile prin sistemul de calendare al iPhone-ului și are nevoie de acces la calendare pentru a le citi. Nu este suficient ca un cont să fie conectat pe alt dispozitiv.",
        "Cloud Calendars are și acțiunile „Sign in with Google” și „Sign in with Microsoft”. Verificați ce cont selectați la autentificare, apoi deschideți grupul lui de calendare și selectați calendarele de care aveți nevoie. Autentificarea la furnizorul corect cu identitatea personală sau de serviciu greșită poate produce o listă de calendare perfect validă, dar neașteptată."
      ]
    },
    {
      "heading": "Înțelegeți planurile fără să le confundați cu permisiunile",
      "body": [
        "Planul Base include sincronizarea Google Calendar și vizualizările calendarului. Advanced adaugă eliminarea reclamelor la Base. Premium adaugă funcții Microsoft Calendar și Microsoft Teams. Verificați prețul local curent și perioada de facturare înainte de achiziție.",
        "Un plan schimbă ce funcții ale aplicației sunt disponibile; nu vă oferă dreptul de proprietate asupra calendarului altcuiva. Google face distincție între permisiunea de a vedea evenimente și permisiunea de a le modifica. Politicile angajatorului și permisiunile asociate unui calendar Microsoft se aplică în continuare. Un eveniment vizibil sau un editor disponibil nu reprezintă o dovadă că furnizorul va accepta o actualizare."
      ]
    },
    {
      "heading": "O vizualizare combinată poate include copii ale calendarelor",
      "body": [
        "Conexiunile Google și Microsoft folosesc copii ale calendarelor în sistemul de calendare al iPhone-ului pentru a prezenta și sincroniza evenimentele. Nu presupuneți că, prin conectarea unui cont, nu rămâne nicio copie în afara furnizorului original. Destinația folosită pentru aceste copii poate depinde de sursele de calendar disponibile pe dispozitiv.",
        "Dacă același cont ajunge la telefon și prin altă rută, verificați numele calendarelor și sursele înainte de a trata programările repetate ca evenimente separate. Ascundeți temporar un calendar pentru a identifica ce afișare furnizează. Nu ștergeți un eveniment sau un calendar doar pentru a face ecranul să pară ordonat: o copie conectată poate trimite modificările înapoi la furnizorul ei."
      ]
    },
    {
      "heading": "Continuați să alegeți destinația atunci când creați un eveniment",
      "body": [
        "Înainte de salvare, verificați calendarul evenimentului la fel de atent ca data și ora. Pentru un eveniment de familie, alegeți calendarul pe care familia îl folosește efectiv; pentru o întâlnire de serviciu, folosiți destinația de serviciu permisă. Faptul că vedeți ambele calendare împreună nu face din niciunul destinația automată pentru fiecare eveniment nou.",
        "Schimbarea calendarului unui eveniment sau mutarea lui între calendare poate fi o mutare, nu doar o a doua vizualizare inofensivă. Păstrați invitațiile și întâlnirile recurente în calendarul lor stabilit în timp ce diagnosticați o problemă de afișare. Dacă aveți nevoie de o schimbare, stabiliți mai întâi cine deține evenimentul și care calendar îl poate accepta."
      ]
    },
    {
      "heading": "Verificați prezentarea generală înainte de a vă baza pe ea",
      "body": [
        "Comparați un eveniment recent din calendarul propriu al furnizorului cu evenimentul corespunzător din Cloud Calendars. Verificați data, fusul orar, titlul și calendarul selectat. Pentru un calendar editabil pe care îl dețineți, un eveniment temporar fără invitați este o verificare mai bună decât modificarea unei întâlniri reale. Confirmați rezultatul la furnizor înainte de a considera conexiunea pregătită.",
        "Nu vă bazați pe vizualizarea combinată pentru a crea automat blocuri de timp ocupat anonime într-un alt cont. Dacă aveți nevoie ca colegii să vă vadă indisponibil fără să vadă detalii personale, folosiți un aranjament de disponibilitate aprobat explicit și verificați-l din partea lor. O prezentare personală clară și disponibilitatea partajată sunt sarcini separate."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Enumerați contul exact și calendarul exact pentru câte un eveniment de la fiecare furnizor.",
    "Activați pe dispozitiv calendarele iCloud dorite și verificați accesul la calendare.",
    "Folosiți autentificarea Google sau Microsoft potrivită și selectați calendarele dorite.",
    "Comparați un eveniment recent cu vizualizarea furnizorului înainte de a modifica orice.",
    "Ascundeți temporar o sursă suspectată de duplicat; păstrați evenimentele de bază intacte.",
    "Verificați calendarul de destinație pentru fiecare eveniment nou și verificați separat orice partajare a timpului ocupat de care aveți nevoie."
  ],
  "faq": [
    {
      "q": "Colegii mei de la serviciu îmi vor vedea evenimentele personale pentru că afișez ambele calendare?",
      "a": "Afișarea calendarelor împreună nu reprezintă o instrucțiune de partajare și nici o punte automată pentru timpul ocupat. Verificați setările reale de partajare ale fiecărui calendar. Conexiunile la furnizori pot crea copii ale calendarelor pe dispozitiv, așa că o vizualizare combinată nu garantează nici că datele evenimentelor există doar la furnizorul lor original."
    },
    {
      "q": "De ce pot vedea un eveniment, dar nu îl pot edita cu succes?",
      "a": "Calendarul poate fi doar pentru citire, evenimentul poate aparține altui organizator sau furnizorul poate respinge actualizarea. Verificați proprietatea și permisiunile în calendarul furnizorului. Achiziționarea unui plan superior al aplicației nu modifică aceste permisiuni."
    },
    {
      "q": "Ar trebui să conectez același cont Google prin toate rutele disponibile?",
      "a": "Mai întâi verificați cum apare deja pe telefon. Mai multe rute pot complica identificarea copiilor de calendar. Alegeți ruta pe care intenționați să o folosiți, verificați-i evenimentele și ascundeți o afișare suplimentară cât timp investigați, în loc să ștergeți date sau să deconectați conturi ca prim pas."
    }
  ],
  "sourcesHeading": "Surse și referințe pentru configurare",
  "sources": [
    {
      "label": "Apple: configurați iCloud Calendar pe dispozitivele dvs.",
      "url": "https://support.apple.com/guide/icloud/set-up-calendar-mme4d73a8727/icloud"
    },
    {
      "label": "Google: partajarea calendarului și permisiuni",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: API-ul calendarului Outlook și datele de cutie poștală acceptate",
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
    "heading": "Vizualizare combinată, abonament sau intervale ocupate copiate?",
    "columns": [
      "De ce aveți nevoie",
      "Ce trebuie verificat",
      "Ce să nu presupuneți"
    ],
    "rows": [
      {
        "cells": [
          "O singură vizualizare pentru mai multe conturi",
          "Contul conectat, calendarul selectat și planul necesar.",
          "Că un ecran partajat combină proprietatea sau permisiunile."
        ]
      },
      {
        "cells": [
          "O editare a unui eveniment care ajunge la furnizorul său",
          "Evenimentul original, permisiunea de scriere și rezultatul salvat la sursă.",
          "Că o editare locală vizibilă dovedește o sincronizare reușită cu furnizorul."
        ]
      },
      {
        "cells": [
          "Interval ocupat într-un alt cont",
          "Un serviciu cu reguli explicite de sincronizare de la sursă la destinație.",
          "Că o vizualizare combinată creează blocuri de disponibilitate pentru colegi."
        ]
      },
      {
        "cells": [
          "Un flux de calendar abonat",
          "Publicatorul, comportamentul de reîmprospătare și starea doar pentru citire.",
          "Că un abonament ICS este o conexiune bidirecțională editabilă."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-left",
    "hook"
  ],
  "galleryDevice": "iPad",
  "galleryCaption": "Vizualizările reale de calendar pe iPad ilustrează examinarea unui program. O captură de ecran nu demonstrează direcția sincronizării furnizorului sau permisiunile contului.",
  "actionHeading": "Examinați-vă calendarele împreună pe iPhone și iPad",
  "actionText": "Sincronizarea Google Calendar este inclusă în Base. Advanced elimină reclamele; Premium adaugă suport pentru Microsoft Calendar și Teams. Confirmați permisiunile contului separat de planul achiziționat.",
  "articleLinks": [
    {
      "slug": "onecal-alternative-iphone-calendar-view-or-sync",
      "label": "Comparați o vizualizare combinată cu regulile de sincronizare OneCal"
    },
    {
      "slug": "fantastical-readdle-calendar366-iphone-comparison",
      "label": "Comparați fluxurile de lucru pentru calendar pe iPhone"
    },
    {
      "slug": "weather-inside-your-calendar",
      "label": "Planificați cu vremea și evenimentele împreună"
    }
  ]
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
