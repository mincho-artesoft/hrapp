import type { LocalisedArticle } from '../types';

export const PRIORITY_RO: Readonly<Record<string, LocalisedArticle>> = {
  "forecast-beside-every-event": {
    "title": "Verifică vremea pe ore pentru un eveniment din calendar pe iPhone și iPad",
    "short": "Vremea pentru orele evenimentului",
    "description": "Potrivește locul, data și orele evenimentului tău cu prognoza meteo disponibilă.",
    "lede": "Pentru a verifica vremea pentru un eveniment din calendar, potrivește trei lucruri: locul, data locală și intervalul dintre începutul și sfârșitul evenimentului. În Cloud Calendars, alege locul pentru vreme și examinează orele disponibile. Adresa unui eveniment și o pictogramă meteo din apropiere nu sunt, prin ele însele, dovada că acestea corespund. Arte Soft, dezvoltatorul, publică acest ghid.",
    "commonBelief": "Că o pictogramă meteo zilnică din calendar este aceeași funcție ca o prognoză atașată unui eveniment.",
    "sections": [
      {
        "heading": "Începeți cu locul și data",
        "body": [
          "Deschideți prognoza pentru locația dorită și comparați data acesteia cu intrarea din calendar. Vremea din calendar poate reflecta locația meteo selectată, așa că verificați dacă este potrivită pentru eveniment, în loc să presupuneți că adresa evenimentului o controlează.",
          "Un eveniment de luna viitoare poate exista înainte ca datele meteo pentru acea dată să fie disponibile. Păstrați evenimentul și reveniți la prognoză mai aproape de data lui; o informație meteo lipsă nu este o predicție de vreme senină."
        ]
      },
      {
        "heading": "Folosiți detaliile orare pentru o întrebare despre ore",
        "body": [
          "Un rezumat zilnic și o prognoză orară răspund la întrebări diferite. Dacă evenimentul durează de la două la cinci, verificați orele disponibile care acoperă acel interval, în loc să tratați o singură pictogramă zilnică drept imaginea completă.",
          "Dacă este disponibilă doar o parte a intervalului, lăsați restul neclarificat. Aplicația nu promite informații meteo orare complete pentru fiecare eveniment pe care îl puteți crea, iar acest ghid nu promite că deschiderea oricărui eveniment afișează întotdeauna întreaga sa fereastră meteo."
        ]
      },
      {
        "heading": "Separați probabilitatea, cantitatea și momentul",
        "body": [
          "Citiți eticheta valorii pe care o verificați. Probabilitatea precipitațiilor nu este același lucru cu cantitatea sau durata ploilor. La fel, o valoare orară și un rezumat zilnic acoperă perioade diferite; comparați perioade similare când evaluați două momente posibile.",
          "Alegeți o variantă de rezervă potrivită planului dvs., în loc să tratați un singur procent ca regulă universală de mergi sau anulezi. Informațiile meteo se pot schimba, așa că verificați-le din nou când trebuie luată o decizie."
        ]
      },
      {
        "heading": "Verificați înainte de a salva un eveniment bazat pe vreme",
        "body": [
          "Aplicația poate porni o ciornă de eveniment dintr-o oră din prognoză. Verificați data, ora de început, ora de sfârșit și calendarul de destinație ale ciornei înainte de salvare. Selectarea din prognoză nu înlocuiește verificarea faptului că creați angajamentul corect.",
          "Dacă accesul la calendar sau calendarul de destinație împiedică salvarea, rezolvați acea permisiune separat de accesul la vreme. Găsirea unei prognoze nu acordă drepturi de editare într-un calendar partajat."
        ]
      },
      {
        "heading": "Folosiți prognoza completă când rezumatul nu este suficient",
        "body": [
          "Pentru o activitate în aer liber, verificați variabilele relevante pentru acea activitate și pentru locația pe care ați ales-o efectiv. Un widget cu vremea curentă sau un demo de pe pagina principală nu înlocuiește verificarea orelor de prognoză disponibile în aplicație.",
          "Dacă observați o neconcordanță, comparați mai întâi locația și marcajul temporal. Furnizori diferiți, locații selectate diferite și perioade de prognoză diferite pot produce afișări diferite fără a demonstra că evenimentul din calendar s-a schimbat."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Confirmați locația și data evenimentului.",
      "Verificați orele disponibile pe întreaga durată a activității.",
      "Citiți probabilitatea și cantitatea ca valori diferite.",
      "Verificați ciorna evenimentului înainte de salvare."
    ],
    "seeAlso": [
      "weather-inside-your-calendar",
      "planning-outdoors-without-being-rained-on"
    ],
    "updated": "2026-10-23",
    "faq": [
      {
        "q": "Are fiecare eveniment o prognoză completă?",
        "a": "Nu. Acoperirea depinde de locația selectată și de datele și orele disponibile."
      },
      {
        "q": "Este pictograma meteo specifică adresei evenimentului?",
        "a": "Nu deduceți asta din apropierea de eveniment. Confirmați separat locația meteo."
      },
      {
        "q": "Atingerea unei ore salvează un eveniment nou?",
        "a": "Pornește o ciornă de eveniment, acolo unde este disponibilă. Verificați data, ora și calendarul înainte de salvare."
      }
    ],
    "sourcesHeading": "Surse meteo și setări de locație",
    "sources": [
      {
        "label": "Apple: prognoze WeatherKit și disponibilitate regională",
        "url": "https://developer.apple.com/weatherkit/"
      },
      {
        "label": "Apple: Confidențialitate și servicii de localizare",
        "url": "https://support.apple.com/en-us/102515"
      }
    ],
    "comparison": {
      "heading": "O verificare practică înaintea unui eveniment în aer liber",
      "columns": [
        "Verificare",
        "Exemplu",
        "Decizie"
      ],
      "rows": [
        {
          "cells": [
            "Loc",
            "Evenimentul este în alt oraș.",
            "Selectează acea destinație în vizualizarea meteo și citește-i numele."
          ]
        },
        {
          "cells": [
            "Interval",
            "Activitatea are loc între 14:00 și 16:00.",
            "Verifică ambele ore, plus pregătirea sau deplasarea relevante."
          ]
        },
        {
          "cells": [
            "Acoperire",
            "Sunt disponibile doar unele dintre orele necesare.",
            "Păstrează planul provizoriu și programează o altă verificare."
          ]
        },
        {
          "cells": [
            "Eveniment salvat",
            "Pornești o schiță dintr-o oră meteo.",
            "Verifică data, fusul orar, durata și calendarul de destinație înainte de salvare."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-right",
      "week-left"
    ],
    "galleryCaption": "Vizualizările meteo și pe săptămână arată părți diferite ale aceleiași sarcini de planificare. Confirmă separat locul prognozei față de locația evenimentului.",
    "actionHeading": "Verifică prognoza în raport cu evenimentele tale reale",
    "actionText": "Folosește Cloud Calendars pe iPhone sau iPad pentru a analiza prognoza disponibilă și programul tău. Vremea îți informează alegerea; nu mută automat un eveniment și nu confirmă o schimbare cu participanții.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Înțelege vizualizările calendarului și vremii"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Alege o privire de ansamblu rapidă pentru Ecran principal"
      },
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Verifică calendarele din spatele programului tău"
      }
    ]
  },
  "the-widget-that-shows-what-is-next": {
    "updated": "2026-10-23",
    "title": "Widgeturi de calendar pe iPhone și iPad: evenimente viitoare și vreme",
    "short": "Evenimente viitoare pe Ecran principal",
    "description": "Alege un widget Cloud Calendars pentru evenimente viitoare, dată sau vreme.",
    "lede": "Alege Calendar Events sau Calendar Events Large când vrei evenimentele viitoare pe Ecran principal. Alege Calendar & Weather pentru un afișaj cu dată și vreme. Aceste aranjări răspund la întrebări diferite; previzualizează varianta oferită pe dispozitivul tău înainte de a o adăuga. Acest ghid este publicat de Arte Soft, dezvoltatorul Cloud Calendars.",
    "sections": [
      {
        "heading": "Alegeți mai întâi aspectul evenimentelor",
        "body": [
          "În galeria de widgeturi Cloud Calendars, Calendar Events este aspectul mediu cu listă de evenimente. Calendar Events Large oferă mai mult spațiu pentru evenimentele viitoare. Calendar & Weather este un aspect separat pentru dată și vreme; dimensiunea sa mică nu garantează un rând pentru următorul eveniment. Denumirile pot apărea traduse pe dispozitivul dvs.",
          "Pe iPhone, țineți apăsat pe o zonă goală a ecranului principal, alegeți Edit și Add Widget, apoi găsiți Cloud Calendars și selectați aspectul dorit. Comparați previzualizarea înainte de a-l adăuga. Instrucțiunile Apple pentru widgeturi se referă la această galerie a sistemului; ea este separată de vizualizările calendarului din aplicație."
        ]
      },
      {
        "heading": "Adăugați și verificați widgetul pe iPad",
        "body": [
          "Pe iPad, folosiți galeria de widgeturi pentru ecranul principal de la Apple: țineți apăsat pe fundal, deschideți Edit, apoi Add Widget. Căutați Cloud Calendars, examinați stilurile și dimensiunile oferite, adăugați aspectul de care aveți nevoie, poziționați-l și încheiați cu Done. Urmați comenzile afișate de versiunea dvs. de iPadOS; o previzualizare nu confirmă că datele din calendar au fost încărcate.",
          "Alegeți Calendar Events sau Calendar Events Large când aveți nevoie de evenimente. Comparați stilurile oferite de aplicația instalată; un panou pentru dată și vreme răspunde la o altă nevoie decât o listă de evenimente.",
          "Deschideți Cloud Calendars pe acel iPad și găsiți un eveniment viitor cunoscut, cu oră stabilită, într-un calendar selectat. O vizualizare corectă pe iPhone nu confirmă conturile, accesul sau datele încărcate pe iPad. Comparați titlul, data și ora de început, apoi continuați cu verificările de eligibilitate și actualizare de mai jos dacă widgetul diferă."
        ]
      },
      {
        "heading": "Verificați ce este considerat viitor",
        "body": [
          "Afișarea evenimentelor folosește calendarele selectate și evenimentele viitoare cu oră stabilită. Intrările pentru întreaga zi și evenimentele a căror oră de început a trecut deja sunt excluse din această listă de evenimente viitoare. De aceea, o aniversare sau o întâlnire deja în desfășurare poate fi vizibilă în aplicație fără să apară aici.",
          "De exemplu, dacă singura dvs. intrare de astăzi este o etichetă de călătorie pentru întreaga zi, o listă goală de evenimente viitoare nu înseamnă că eticheta de călătorie s-a pierdut. Deschideți aplicația pentru a verifica ziua completă. La fel, următorul eveniment cu oră stabilită poate fi mâine sau mai târziu; citiți data lui în loc să presupuneți că fiecare rând este pentru astăzi."
        ]
      },
      {
        "heading": "Faceți diferența între un eveniment lipsă și o listă care nu mai are rânduri",
        "body": [
          "Un widget afișează un număr limitat de evenimente viitoare. Dacă evenimentele mai apropiate îi ocupă rândurile, un eveniment mai târziu poate lipsi, chiar dacă există în aplicație și este eligibil pentru lista de evenimente viitoare. Un aspect de evenimente mai mare poate afișa mai multe rânduri; tot nu reprezintă calendarul complet.",
          "Începeți cu cel mai apropiat eveniment viitor, cu oră stabilită, dintr-un calendar selectat. Dacă acesta apare, dar unul ulterior nu apare, deschideți aplicația pentru a verifica restul programului. Dacă lipsește și cel mai apropiat eveniment eligibil, continuați cu verificările privind selecția calendarului, accesul și actualizarea. Nu mutați și nu ștergeți evenimente doar pentru a face să apară o intrare ulterioară."
        ]
      },
      {
        "heading": "Folosiți aplicația ca prim termen de comparație",
        "body": [
          "Deschideți Cloud Calendars și găsiți un anumit eveniment viitor, cu oră stabilită. Confirmați că este selectat calendarul căruia îi aparține și că aplicația are accesul la calendare de care are nevoie. Comparați titlul, data și ora de început cu widgetul. Dacă evenimentul lipsește și din aplicație, investigați mai întâi contul sau sincronizarea.",
          "Folosiți un eveniment de test inofensiv într-un calendar pe care îl dețineți dacă aveți nevoie de un exemplu clar. Dați-i o oră de început în viitor și un titlu ușor de recunoscut. Evitați să modificați o invitație reală sau să eliminați conturi doar pentru a testa ecranul principal."
        ]
      },
      {
        "heading": "Luați în calcul actualizările fără să presupuneți un termen fix",
        "body": [
          "Widgeturile afișează informații salvate și nu rulează continuu precum o aplicație deschisă. Apple controlează programarea actualizărilor lor. Deschiderea aplicației și verificarea evenimentului vă oferă un punct de comparație actualizat, dar nu stabilește un număr exact de secunde după care widgetul trebuie să se schimbe.",
          "Dacă aplicația rămâne corectă, iar widgetul rămâne greșit, notați aspectul, calendarul selectat, ora evenimentului și versiunile aplicației/iOS. O listă goală, un eveniment vechi și o oră incorectă sunt observații diferite; raportați ce anume vedeți."
        ]
      },
      {
        "heading": "Citiți vremea ca pe un rezumat separat",
        "body": [
          "Vremea afișată lângă dată nu este o prognoză atașată locului și orei de început ale fiecărui eveniment. Înaintea unui eveniment în aer liber, deschideți vizualizarea meteo și verificați locul și ora vizate. O pictogramă a condițiilor actuale nu poate stabili ce condiții vor fi la o întâlnire ulterioară.",
          "Păstrați acest widget pentru orientare rapidă. Folosiți calendarul complet pentru angajamentele de o zi întreagă, detaliile evenimentelor și deciziile care necesită întregul program."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Alegeți Calendar Events sau Calendar Events Large pentru o listă de evenimente.",
      "Verificați un eveniment viitor cu oră stabilită într-un calendar selectat.",
      "Comparați data și ora lui în aplicație înainte de a depana widgetul.",
      "Notați diferențele persistente în loc să ștergeți datele din calendar."
    ],
    "faq": [
      {
        "q": "De ce lipsește aniversarea mea?",
        "a": "Lista de evenimente viitoare exclude evenimentele de o zi întreagă. Verificați calendarul complet pentru aniversări și alte intrări doar cu dată."
      },
      {
        "q": "Widgetul mic afișează următoarea întâlnire?",
        "a": "Aspectul mic Calendar & Weather afișează data și vremea. Alegeți un aspect de tip listă de evenimente pentru evenimente."
      },
      {
        "q": "Dacă nu apare niciun eveniment viitor, înseamnă că sunt liber astăzi?",
        "a": "Nu. Intrările de o zi întreagă, evenimentele în desfășurare, calendarele neselectate și informațiile neactualizate pot schimba această concluzie."
      }
    ],
    "sourcesHeading": "Surse și instrucțiuni Apple",
    "sources": [
      {
        "label": "Apple: Adăugarea și editarea widgeturilor pe iPhone",
        "url": "https://support.apple.com/118610"
      },
      {
        "label": "Apple: Menținerea unui widget actualizat",
        "url": "https://developer.apple.com/documentation/widgetkit/keeping-a-widget-up-to-date"
      },
      {
        "label": "Apple: Adăugarea, editarea și eliminarea widgeturilor pe iPad",
        "url": "https://support.apple.com/guide/ipad/add-edit-and-remove-widgets-ipadb0de8630/ipados"
      }
    ],
    "seeAlso": [
      "choosing-a-widget-size",
      "a-countdown-to-your-next-meeting",
      "calendar-on-apple-watch"
    ],
    "comparison": {
      "heading": "Alegeți afișarea de care aveți efectiv nevoie",
      "columns": [
        "Afișare",
        "Folosiți-o pentru",
        "Verificați înainte de a vă baza pe ea"
      ],
      "rows": [
        {
          "cells": [
            "Calendar Events",
            "O vizualizare compactă a evenimentelor viitoare cu oră stabilită.",
            "Evenimentul aparține unui calendar selectat și nu a început încă."
          ]
        },
        {
          "cells": [
            "Calendar Events Large",
            "Mai mult spațiu pentru evenimentele viitoare.",
            "Chiar și un aspect mai mare are un număr limitat de rânduri."
          ]
        },
        {
          "cells": [
            "Calendar & Weather",
            "O prezentare rapidă a datei și vremii.",
            "Aspectul său mic nu garantează un rând pentru următorul eveniment."
          ]
        },
        {
          "cells": [
            "Live Activity",
            "O numărătoare inversă separată până la următorul eveniment, pe suprafețele compatibile ale iPhone-ului.",
            "Nu este un widget pentru ecranul principal și nici un aspect dedicat de widget pentru ecranul de blocare."
          ]
        }
      ]
    },
    "galleryKinds": [
      "widgets",
      "live"
    ],
    "galleryCaption": "Widgeturile pentru ecranul principal și Live Activity sunt afișări separate. Selectați aspectul care corespunde informațiilor de care aveți nevoie.",
    "actionHeading": "Puneți partea utilă a programului dvs. pe ecranul principal",
    "actionText": "Deschideți Cloud Calendars, verificați un eveniment viitor cunoscut, cu oră stabilită, apoi adăugați widgetul potrivit pe iPhone sau iPad. Aplicația rămâne locul în care verificați calendarul complet.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Consultați vremea lângă programul dvs."
      },
      {
        "slug": "forecast-beside-every-event",
        "label": "Verificați orele unui eveniment în aer liber"
      },
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Verificați conturile dvs. de calendar conectate"
      }
    ]
  },
  "onecal-alternative-iphone-calendar-view-or-sync": {
    "updated": "2026-10-23",
    "title": "Cloud Calendars sau OneCal? Alegeți o vizualizare combinată sau sincronizarea calendarelor",
    "short": "Cloud Calendars și OneCal după fluxul de lucru",
    "description": "Comparați OneCal și Cloud Calendars după vizualizări, evenimente copiate, controale mobile și planuri.",
    "lede": "Alegeți în funcție de rezultatul de care aveți nevoie: examinarea mai multor programe împreună, editarea unui eveniment original sau copierea intervalelor ocupate într-un alt cont. Cloud Calendars oferă vizualizări de planificare pe iPhone și iPad; OneCal prezintă o Unified Calendar View și reguli separate pentru Calendar Sync. Această comparație este publicată de Arte Soft, dezvoltatorul Cloud Calendars.",
    "commonBelief": "Două produse care afișează calendare Google, iCloud și Outlook păstrează neapărat disponibilitatea, editările evenimentelor și copiile sincronizate în același mod.",
    "sections": [
      {
        "heading": "Alegeți între o privire de ansamblu și o modificare într-un alt cont",
        "body": [
          "Dacă scopul dvs. este să vedeți un eveniment personal lângă o ședință de serviciu, aveți nevoie de o vizualizare combinată. Dacă calendarul de serviciu trebuie să conțină și un bloc ocupat pentru evenimentul personal, aveți nevoie de un flux de lucru definit de la sursă la destinație. Primul rezultat nu îl stabilește pe al doilea.",
          "Cloud Calendars aduce calendarele selectate într-o vizualizare de planificare pe iPhone și iPad. OneCal prezintă Unified Calendar View separat de Calendar Sync; publicatorul său spune că puteți folosi acea vizualizare fără a configura reguli de sincronizare. Decideți ce rezultat contează înainte de a conecta conturi sau de a compara numele abonamentelor."
        ]
      },
      {
        "heading": "Înțelegeți ce poate modifica un eveniment copiat",
        "body": [
          "Documentația OneCal pentru Calendar Sync descrie reguli unidirecționale și multidirecționale care creează evenimente-clonă. Ghidul său separat de acoperire spune că editările unei clone nu sunt propagate înapoi la original. Identificați originalul și calendarul care îl deține înainte de a trata un eveniment copiat ca locul în care să reprogramați o ședință.",
          "Conexiunile furnizorilor din Cloud Calendars pot crea, de asemenea, calendare reflectate în stocarea iOS. O afișare combinată nu dovedește că înregistrările au fost unite sau că o editare a ajuns la furnizor. Pentru un calendar pe care îl dețineți și îl puteți edita, verificați un eveniment de test fără invitați atât la furnizor, cât și în aplicație."
        ]
      },
      {
        "heading": "Verificați controalele de pe dispozitivul pe care îl veți folosi efectiv",
        "body": [
          "Ghidul mobil actual OneCal descrie crearea și editarea evenimentelor din calendar, opțiunile de recurență, RSVP și participarea la întâlniri. Separat, acesta spune că crearea, editarea, întreruperea sau ștergerea configurațiilor Calendar Sync se face în aplicația web; pe mobil aceste configurații sunt doar afișate. Configurarea linkurilor de programare este, de asemenea, descrisă ca activitate pentru web.",
          "Cloud Calendars este o aplicație pentru iPhone și iPad cu vizualizări pe zi, săptămână, lună, an și listă. Încercați editarea necesară în vizualizarea instalată, citiți orice opțiune de recurență și confirmați evenimentul salvat. Nu presupuneți că meniul mobil, fluxul de programare sau controalele de automatizare ale altui produs există și aici."
        ]
      },
      {
        "heading": "Verificați acoperirea în loc să presupuneți un istoric nelimitat",
        "body": [
          "Ghidul actual de acoperire OneCal indică o fereastră de sincronizare viitoare de până la un an pentru Google și iCloud și de până la trei luni pentru Outlook. De asemenea, face diferența între seriile recurente viitoare și evenimentele istorice independente. Acestea sunt limite documentate de publicator, nu un test al contului dvs. specific și nici o afirmație despre fiecare funcție din vizualizarea sa de calendar.",
          "Și în Cloud Calendars trebuie verificate ruta contului, calendarele selectate și datele relevante. Dacă întâlnirile vechi sunt esențiale, comparați un eveniment identificat în furnizor și în aplicație. O aplicație de calendar nu este automat o copie de rezervă completă și nici o garanție că a fost preluată fiecare înregistrare din trecut."
        ]
      },
      {
        "heading": "Comparați cerințele planurilor și ruta de facturare",
        "body": [
          "Cloud Calendars include sincronizarea Google Calendar în Base; Advanced elimină reclamele, iar Premium adaugă suport pentru Microsoft Calendar și Teams. Verificați permisiunile contului separat de plan. Înainte de achiziție, verificați prețul local actual și perioada de facturare, în loc să folosiți o comparație fixă de preț internațional.",
          "Ghidul OneCal pentru planurile web descrie planuri per membru și o perioadă de probă de paisprezece zile, inclusiv eliminarea clonelor la expirarea perioadei de probă. Ghidul său de facturare mobilă descrie achiziții gestionate de magazin și constrângeri privind adăugarea membrilor echipei. Verificați ce funcții necesită un plan activ și unde este administrată achiziția; doar descărcarea gratuită nu răspunde la aceste întrebări."
        ]
      },
      {
        "heading": "Testați-vă fluxul real de planificare înainte de a schimba",
        "body": [
          "Dacă vremea, widgeturile sau o Live Activity sunt importante, includeți-le în perioada de probă pe dispozitivul pe care îl folosiți. Cloud Calendars oferă aceste suprafețe de planificare, vremea fiind limitată la datele disponibile și locul selectat. Paginile OneCal analizate aici nu stabilesc paritate de funcții pentru aceste suprafețe; verificați produsul său actual în loc să deduceți absența dintr-un ghid.",
          "Păstrați aplicațiile originale și detaliile de conectare până când ați verificat rezultatul necesar. Notați dacă ați verificat vizibilitatea, editarea evenimentului original, copierea intervalului ocupat sau un memento; acestea sunt rezultate diferite. Înainte de a deconecta un serviciu, examinați ce se întâmplă cu copiile existente și evitați experimentele pe o invitație activă sau pe o întâlnire reală cu un client."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Notați dacă aveți nevoie de o vizualizare combinată sau de evenimente copiate într-un alt cont.",
      "Identificați originalele, copiile și contul care deține fiecare eveniment important.",
      "Verificați controalele necesare pe telefonul, tableta sau în fluxul web pe care îl folosiți efectiv.",
      "Comparați o săptămână obișnuită și orice date istorice pe care vă bazați.",
      "Verificați cerințele actuale ale planului, prețul local și furnizorul achiziției.",
      "Verificați un eveniment de test și analizați regulile de eliminare a copiilor înainte de a schimba."
    ],
    "faq": [
      {
        "q": "Este o vizualizare combinată a calendarului același lucru cu sincronizarea intervalelor ocupate?",
        "a": "Nu. O vizualizare combinată vă permite să comparați angajamentele. Crearea unei intrări într-un alt cont necesită un flux de lucru separat, acceptat; OneCal documentează regulile Calendar Sync separat de Unified Calendar View."
      },
      {
        "q": "Pot modifica o clonă OneCal pentru a reprograma întâlnirea originală?",
        "a": "Ghidul său de acoperire spune că editările clonelor nu sunt propagate la original. Identificați evenimentul original și urmați permisiunile de editare și de organizator ale calendarului său."
      },
      {
        "q": "Ce aplicație este mai ieftină pentru configurarea mea?",
        "a": "Depinde de funcțiile, conturile, ruta de facturare și prețul local de care aveți nevoie. Cloud Calendars include sincronizarea Google în Base și suportul Microsoft în Premium. Consultați planul actual OneCal și condițiile de facturare mobilă pentru fluxul de lucru dorit; acest ghid nu afirmă că există un câștigător universal la preț."
      }
    ],
    "sourcesHeading": "Documentația oficială OneCal despre fluxuri de lucru și planuri",
    "sources": [
      {
        "label": "OneCal: funcții mobile și sarcini de configurare disponibile doar pe web",
        "url": "https://docs.onecal.io/docs/mobile-apps"
      },
      {
        "label": "OneCal: Calendar Sync și reguli de la sursă la destinație",
        "url": "https://docs.onecal.io/docs/calendar-sync/calendar-sync-intro"
      },
      {
        "label": "OneCal: ferestre de sincronizare și editări ale evenimentelor-clonă",
        "url": "https://docs.onecal.io/docs/calendar-sync/what-does-onecal-sync"
      },
      {
        "label": "OneCal: planuri, perioadă de probă și comportamentul la expirare",
        "url": "https://docs.onecal.io/docs/billing/plans-and-free-trial"
      },
      {
        "label": "OneCal: abonamente din App Store și Google Play",
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
      "heading": "Comparați fluxul de lucru înainte de abonament",
      "columns": [
        "Întrebare",
        "Cloud Calendars",
        "Documentația OneCal"
      ],
      "rows": [
        {
          "cells": [
            "Unde îmi revizuiesc programul?",
            "Pe iPhone și iPad, cu vizualizări pe zi, săptămână, lună, an și listă.",
            "Unified Calendar View este separată de configurarea Calendar Sync."
          ]
        },
        {
          "cells": [
            "Am nevoie ca blocurile de timp ocupat să fie copiate între conturi?",
            "Nu deduceți asta din vizualizarea combinată; conexiunile furnizorilor pot reflecta local calendarele.",
            "Calendar Sync creează evenimente-clonă folosind reguli unidirecționale sau multidirecționale."
          ]
        },
        {
          "cells": [
            "Unde modific regulile de sincronizare?",
            "Folosiți controalele documentate pentru conectarea contului în aplicație.",
            "Ghidul mobil analizat atribuie modificările de configurare a sincronizării aplicației web."
          ]
        },
        {
          "cells": [
            "De ce plan Cloud Calendars am nevoie?",
            "Base include sincronizarea Google Calendar; Advanced elimină reclamele; Premium adaugă Microsoft Calendar și Teams.",
            "Verificați planul actual OneCal și ruta de facturare pentru fluxul de lucru necesar."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-left",
      "hook"
    ],
    "galleryCaption": "Ecranele reale de calendar din Cloud Calendars arată vizualizarea de planificare. Comparația distinge această vizualizare de regulile unei clone la nivel de server ale unui serviciu.",
    "actionHeading": "Alegeți rezultatul pe care doriți să îl verificați",
    "actionText": "Pentru o privire de ansamblu pe iPhone sau iPad cu vreme și widgeturi, încercați Cloud Calendars cu un eveniment de test inofensiv. Dacă aveți nevoie de intervale ocupate copiate într-un alt cont, evaluați un serviciu care documentează explicit această operațiune.",
    "articleLinks": [
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Configurați o vizualizare de calendar combinată"
      },
      {
        "slug": "fantastical-readdle-calendar366-iphone-comparison",
        "label": "Comparați alte opțiuni de calendar pentru iPhone"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Alegeți afișarea pentru ecranul principal"
      }
    ]
  },
  "fantastical-readdle-calendar366-iphone-comparison": {
    "updated": "2026-10-23",
    "title": "Alternative de calendar pentru iPhone: Cloud Calendars, Fantastical, Readdle și BusyCal",
    "short": "Comparați alternativele de calendar pentru iPhone",
    "description": "Comparați calendarele pentru iPhone după vreme, vizualizări, sarcini și fluxul de lucru de care aveți nevoie.",
    "lede": "Alegeți un calendar în funcție de ceea ce vreți să realizați: să revizuiți evenimentele cu informații meteo, să introduceți rapid un eveniment, să gestionați sarcini sau să combinați vizualizări din mai multe conturi. Cloud Calendars, Fantastical, Calendars by Readdle, Calendar 366 și BusyCal diferă în aceste fluxuri de lucru și în cerințele planurilor lor. Arte Soft dezvoltă Cloud Calendars și publică această comparație.",
    "sections": [
      {
        "heading": "Alegeți ce trebuie să funcționeze înainte de a compara aspectul",
        "body": [
          "Notați-vă furnizorii de calendar, dispozitivele și trei acțiuni esențiale. De exemplu: să vedeți împreună calendarele de serviciu și personale, să finalizați un memento și să adăugați rapid o ședință. Testați aceste acțiuni cu date de probă private înainte de a importa un program întreg.",
          "Faptul că un produs menționează numele furnizorului dvs. nu înseamnă că toate metodele de conectare au permisiuni sau funcții identice. Un calendar de pe dispozitiv, un cont conectat direct și un flux abonat pot genera intrări cu aspect similar, dar pot permite acțiuni diferite."
        ]
      },
      {
        "heading": "Folosiți propriul calendar al furnizorului ca punct de referință",
        "body": [
          "Ghidul introductiv Google descrie propria interfață de calendar pentru programare, sarcini, partajare și calendare multiple. Dacă programul dvs. este deja acolo, testați acțiunea necesară la sursă înainte de a decide dacă aveți nevoie de altă aplicație.",
          "De exemplu, comparați același eveniment în Google Calendar și Fantastical după conectarea contului dorit. Verificați dacă avantajul de care aveți nevoie este o vizualizare combinată, o conexiune pentru sarcini, introducerea rapidă sau o anumită interfață de dispozitiv. Un alt client de calendar nu înseamnă automat migrarea la alt furnizor."
        ]
      },
      {
        "heading": "Fantastical: verificați conexiunile conturilor și introducerea rapidă",
        "body": [
          "Flexibits documentează atât conexiuni directe la conturile de calendar, cât și opțiuni pentru calendarele și mementourile deja configurate în iOS. Ghidul de pornire recomandă conexiunile directe pentru utilizarea completă a funcțiilor aplicației. Identificați ce variantă ați ales, în loc să conectați același calendar de două ori fără motiv.",
          "Fantastical documentează și introducerea bazată pe propoziții, precum și șabloane reutilizabile pentru evenimente sau sarcini. Testați o dată explicită, o durată și calendarul de destinație, apoi verificați rezultatul salvat. Sintaxa aparține Fantastical; câmpul text din altă aplicație poate interpreta aceeași propoziție diferit."
        ]
      },
      {
        "heading": "Calendars by Readdle: verificați sursa sarcinilor",
        "body": [
          "Readdle prezintă calendare Google, Outlook și iCloud împreună cu funcții pentru sarcini și introducere în limbaj natural. Ghidul său de configurare a sarcinilor descrie alegerea între iOS Reminders și Google Tasks în Task Options. Această alegere contează dacă finalizarea unei sarcini pe telefon trebuie să actualizeze o anumită listă sursă.",
          "Folosiți o sarcină temporară pentru a testa finalizarea la ambele capete, nu doar dacă un titlu apare în cronologie. Dacă aveți nevoie de o vizualizare sau de o acțiune și pe Mac, nu doar pe iPhone, testați și acolo. Nu presupuneți controale identice doar pentru că numele produsului este comun."
        ]
      },
      {
        "heading": "Calendar 366: verificați accesul la sistem, seturile și locația meteo",
        "body": [
          "Documentația Calendar 366 face distincție între accesul la calendarele și mementourile sistemului și integrările directe cu conturi. Ea descrie seturi de calendare care aleg calendarele și listele vizibile. Aceste seturi pot stabili și un calendar implicit, așa că verificați cui va aparține un eveniment nou creat.",
          "Aceeași documentație descrie propriul parser de limbaj natural și vremea prin Apple Weather, cu opțiuni pentru locația sistemului sau una personalizată. Pentru planificarea în aer liber, verificați locul selectat în loc să presupuneți că prognoza urmează adresa fiecărui eveniment. Acestea sunt capabilități documentate de editor, nu funcții testate pe contul dvs."
        ]
      },
      {
        "heading": "BusyCal: verificați afișarea sarcinilor și vizualizarea folosită pentru vreme",
        "body": [
          "Ghidul BusyCal pentru iOS face distincție între sarcini datate, programate la o oră și fără dată. El descrie controalele de finalizare și mutarea înainte a sarcinilor datate nefinalizate. Ghidul meteo plasează prognozele în vizualizările List, Day și Month, așa că testați exact vizualizarea pe care o folosiți, în loc să presupuneți că vremea apare peste tot.",
          "BusyCal documentează și introducerea în limbaj natural ca opțiune în valorile implicite pentru evenimente noi. Încercați același eveniment de probă privat folosit pentru celelalte aplicații, apoi verificați calendarul și ora salvată. Acestea sunt controale BusyCal, nu comenzi comune tuturor aplicațiilor de calendar."
        ]
      },
      {
        "heading": "Verificați separat fluxul de lucru de pe Watch față de cel de pe telefon",
        "body": [
          "Ghidul Fantastical pentru Watch documentează vizualizările Up Next, List și Tasks, inclusiv finalizarea sarcinilor. Ghidul BusyCal pentru sarcini face distincție între sarcinile datate și programate la o oră afișate pe Watch și sarcinile fără dată. Dacă un rest de sarcini fără dată este important, includeți-l în test, nu verificați doar următorul eveniment.",
          "O complicație pe Watch oferă o privire rapidă, în timp ce aplicația de pe Watch poate oferi acțiuni suplimentare. Verificați datele și acțiunea pe ceasul și telefonul reale și analizați planul actual. Interfețele de desktop, telefon și ceas nu sunt interschimbabile doar pentru că folosesc același nume de produs."
        ]
      },
      {
        "heading": "Tratați prețul și drepturile incluse ca pe o verificare separată",
        "body": [
          "Verificați ecranul actual de achiziție locală, funcțiile disponibile după încheierea unei perioade de probă și dacă o achiziție anterioară vă schimbă drepturile. O descărcare gratuită, un abonament recurent și o achiziție veche nu deblochează neapărat același set de funcții.",
          "Paginile editorilor se pot modifica la momente diferite. Întrebările frecvente actuale despre produsul Readdle descriu mai multe capabilități de bază ca fiind gratuite, în timp ce o pagină separată de ajutor despre gratuit versus complet indică o împărțire diferită. În loc să tratați una dintre descrieri ca pe o promisiune universală, verificați acțiunea necesară în aplicația instalată și în condițiile curente de achiziție."
        ]
      },
      {
        "heading": "Unde se încadrează Cloud Calendars în lista scurtă",
        "body": [
          "Cloud Calendars este o altă opțiune pentru iPhone și iPad, pentru calendare selectate, mai multe vizualizări de planificare, vreme și widgeturi. Sincronizarea Google este inclusă în Base, Advanced elimină reclamele, iar Premium adaugă suport pentru calendarul Microsoft. Verificați planul actual și permisiunile furnizorului pentru configurarea dvs.",
          "Dacă o conexiune specializată pentru sarcini, o comandă de șablon sau un flux de lucru pe desktop este esențial, folosiți produsul care documentează și îndeplinește cu succes acea cerință. Comparați rezultatele salvate și efortul zilnic; această listă de verificare ar trebui să vă ajute să alegeți, nu să sugereze că toate funcțiile menționate aici există în Cloud Calendars."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Listați-vă conturile, dispozitivele și acțiunile esențiale.",
      "Alegeți o singură variantă de conectare a contului și verificați ce calendare expune.",
      "Testați introducerea rapidă și finalizarea sarcinilor cu exemple inofensive.",
      "Verificați locația meteo și vizualizările folosite pe fiecare dispozitiv.",
      "Verificați condițiile actuale de achiziție după orice perioadă de probă sau drept vechi."
    ],
    "faq": [
      {
        "q": "Care este cea mai bună alternativă la Fantastical?",
        "a": "Depinde de fluxul de lucru de care aveți nevoie. Comparați sursele pentru calendare și sarcini, introducerea evenimentelor, suportul pentru dispozitive și drepturile actuale. Acest ghid nu declară un câștigător universal la capitolul performanță."
      },
      {
        "q": "Înseamnă același nume de furnizor că toate aplicațiile sincronizează identic?",
        "a": "Nu. Verificați separat conexiunile directe, calendarele dispozitivului, fluxurile și permisiunile, apoi confirmați o modificare de exemplu la sursă."
      },
      {
        "q": "Pot presupune că orice funcție promovată este gratuită?",
        "a": "Nu. Verificați aplicația instalată, ecranul local de achiziție și funcțiile care rămân după perioada de probă. Documentația editorului poate descrie versiuni sau drepturi diferite."
      }
    ],
    "sourcesHeading": "Documentația oficială verificată pentru acest ghid",
    "sources": [
      {
        "label": "Fantastical: variante de conectare a conturilor",
        "url": "https://flexibits.com/fantastical-ios/help/getting-started"
      },
      {
        "label": "Fantastical: introducere în limbaj natural și șabloane",
        "url": "https://flexibits.com/fantastical-ios/help/adding-events-and-tasks"
      },
      {
        "label": "Readdle: capabilitățile actuale ale produsului și întrebări frecvente",
        "url": "https://readdle.com/calendars"
      },
      {
        "label": "Readdle: alegerea unei surse pentru sarcini",
        "url": "https://support.readdle.com/calendars/synchronization/how-to-sync-tasks-with-ios-reminders-or-google-tasks"
      },
      {
        "label": "Readdle: ghid separat pentru planul gratuit/complet",
        "url": "https://apphelp.readdle.com/en/index.php?id=585&pg=kb.page"
      },
      {
        "label": "Calendar 366: integrări, seturi, introducere rapidă și vreme",
        "url": "https://calendar366.com/help/index.html"
      },
      {
        "label": "BusyCal pentru iOS: sarcini și limitele sarcinilor pe Watch",
        "url": "https://www.busymac.com/docs/busycalios/70659-tasks/"
      },
      {
        "label": "BusyCal pentru iOS: vreme și vizualizări compatibile",
        "url": "https://www.busymac.com/docs/busycalios/70665-weather/"
      },
      {
        "label": "BusyCal pentru iOS: introducere în limbaj natural",
        "url": "https://www.busymac.com/docs/busycalios/70669-natural-language/"
      },
      {
        "label": "Fantastical: vizualizări și acțiuni pe Apple Watch",
        "url": "https://flexibits.com/fantastical-ios/help/apple-watch"
      },
      {
        "label": "Google: interfața proprie a Calendar, bazată pe cont",
        "url": "https://support.google.com/calendar/answer/2465776?hl=en"
      }
    ],
    "seeAlso": [
      "what-fantastical-costs-and-what-this-does",
      "natural-language-calendar-events-iphone",
      "iphone-calendar-tasks-reminders-versus-event-alerts"
    ],
    "comparison": {
      "heading": "Începeți cu cerința principală",
      "columns": [
        "Cerință",
        "Opțiuni relevante de verificat",
        "Distincție importantă"
      ],
      "rows": [
        {
          "cells": [
            "Evenimente cu vreme și vizualizări pe iPhone/iPad",
            "Cloud Calendars și vizualizările meteo documentate în aplicațiile comparate.",
            "Verificați locația prognozei, perioada disponibilă și vizualizarea; acoperirea meteo nu este nelimitată."
          ]
        },
        {
          "cells": [
            "Introducerea evenimentelor în limbaj natural",
            "Fantastical și funcția relevantă din Readdle sau BusyCal.",
            "Analiza propozițiilor nu este același lucru cu dictarea sau editarea obișnuită a evenimentelor."
          ]
        },
        {
          "cells": [
            "Sarcini alături de evenimente",
            "Sursa de sarcini documentată în Readdle, Calendar 366, BusyCal sau Fantastical.",
            "Un memento pentru eveniment nu este o integrare pentru finalizarea sarcinilor."
          ]
        },
        {
          "cells": [
            "Sincronizare Google Calendar și eliminarea opțională a reclamelor",
            "Cloud Calendars Base include sincronizare Google Calendar; Advanced elimină reclamele.",
            "Suportul pentru Microsoft Calendar și Teams necesită Premium."
          ]
        },
        {
          "cells": [
            "Un model de achiziție diferit",
            "Listarea actuală din magazin și drepturile incluse pentru fiecare aplicație și platformă.",
            "O descărcare gratuită nu dovedește că toate funcțiile sunt gratuite; prețurile și planurile regionale se pot schimba."
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
    "galleryCaption": "Acestea sunt ecrane Cloud Calendars pentru vizualizările, vremea și widgeturile aplicației. Nu sunt capturi de ecran ale celorlalte produse din comparație.",
    "actionHeading": "Încercați calendarul raportat la o nevoie reală de planificare",
    "actionText": "Dacă principala dvs. cerință este un program pe iPhone sau iPad cu vreme și widgeturi, evaluați Cloud Calendars cu un eveniment temporar. Păstrați separate cerințele specializate privind sarcinile, rezervările și limbajul natural atunci când comparați produsele.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Vedeți cum se integrează vremea în fluxul de lucru al calendarului"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Comparați widgeturile Cloud Calendars"
      },
      {
        "slug": "onecal-alternative-iphone-calendar-view-or-sync",
        "label": "Faceți diferența între o vizualizare combinată și timpul ocupat copiat"
      }
    ]
  }
};
