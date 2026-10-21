import { LocalisedArticle } from '../types';

/** Cele șase articole despre Google: întrebări concrete, răspunsuri limpezi. */
export const GOOGLE_RO: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
  "title": "Permisiuni Google Calendar: verifică accesul acordat efectiv",
  "short": "Acces și confidențialitate în Google Calendar",
  "description": "Alege acces la disponibilitate, detalii sau editare. Verifică accesul public și prin grupuri, nu doar permisiunile individuale, înainte de partajare.",
  "lede": "Înainte de partajare, decide ce trebuie să facă cealaltă persoană. Găsirea unei ore, citirea detaliilor și întreținerea calendarului sunt sarcini diferite. Ghid publicat de Arte Soft, dezvoltatorul Cloud Calendars.",
  "commonBelief": "O permisiune individuală limitată garantează că persoana nu poate vedea detalii prin altă cale.",
  "sections": [
    {
      "heading": "Potrivește accesul cu sarcina",
      "body": [
        "Un coleg care stabilește o oră poate avea nevoie doar de disponibilitate, fără detalii. Un colaborator care întreține un program de proiect are alte nevoi. Decide sarcina și apoi verifică permisiunea din setările curente de partajare.",
        "Google distinge disponibilitatea, detaliile și mai multe niveluri de editare. Unul limitează accesul la evenimente private; altul permite editarea și detaliile, iar cel mai larg și administrarea partajării. Opțiunile care menționează modificări nu sunt echivalente."
      ]
    },
    {
      "heading": "Verifică accesul întregului calendar și al persoanei",
      "body": [
        "Pe lângă persoane, verifică dacă este public, disponibil organizației sau partajat unui grup. Google spune că accesul mai larg poate prevala asupra unei acordări restrânse: limitarea unei persoane nu retrage detalii deja publice.",
        "Gândește-te la programul unui club publicat pentru membri. Înainte de o programare personală, verifică publicul calendarului, nu doar permisiunea din dreptul unui prieten. Păstrează programările private într-o destinație potrivită."
      ]
    },
    {
      "heading": "Folosește setările Google ale calendarului exact",
      "body": [
        "Pe computer, găsește calendarul între calendarele tale în Google Calendar, deschide meniul și setările de partajare. Google documentează zone separate pentru persoane sau grupuri și acces mai larg. Verifică numele și contul autentificat înainte de modificare.",
        "Confirmă identitatea Google dorită a destinatarului. Dacă nu găsește calendarul, verifică adresa și mesajul invitației în loc să extinzi accesul ca să apară. Lipsa afișării și drepturile insuficiente de editare sunt probleme diferite."
      ]
    },
    {
      "heading": "Testează fără programări private",
      "body": [
        "Folosește o programare de test fără titlu privat, note, loc sau invitați. Cere destinatarului să confirme ce vede și, numai când este necesar și permis, ce poate modifica. Nu distribui datele de autentificare pentru test.",
        "Notează calendarul și rolul, apoi verifică rezultatul după schimbarea setării. Astfel verifici configurația dorită, nu dispariția informațiilor citite sau copiate anterior. Nu testa publicând un program real de lucru."
      ]
    },
    {
      "heading": "Separă politicile de lucru de planurile aplicației",
      "body": [
        "Google precizează că administratorii de lucru sau școală pot restricționa partajarea. Dacă lipsește setarea, folosește metoda aprobată de organizație. Nu publica informații de lucru pentru a ocoli restricțiile contului.",
        "Cloud Calendars poate afișa calendare conectate, dar planurile nu redefinesc permisiunile Google. Advanced elimină reclamele, nu cumpără acces pentru altcineva la toate evenimentele. Verifică partajarea furnizorului și rezultatul acceptat, nu doar existența unui editor local."
      ]
    },
    {
      "heading": "Revizuiește și elimină accesul inutil",
      "body": [
        "La sfârșitul proiectului, verifică destinatari, grupuri și publicări mai largi. Eliminarea unei persoane este doar o parte dacă există alte căi. Stabiliți cine întreține programul și cum se vor gestiona schimbările de acces.",
        "Google documentează separat eliminarea persoanelor sau grupurilor și dezactivarea partajării mai largi. Retragerea nu recuperează exporturi, capturi sau informații copiate altundeva. Urmărește separat aceste situații cu cei implicați, fără promisiunea că un comutator șterge toate copiile vechi."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifică calendarul și sarcina destinatarului.",
    "Verifică accesul individual, prin grup, organizație și public.",
    "Alege permisiunea potrivită în setările Google curente.",
    "Verifică identitatea înainte să schimbi accesul.",
    "Testează un eveniment inofensiv din perspectiva destinatarului.",
    "Revizuiește căile vechi fără a presupune recuperarea copiilor."
  ],
  "faq": [
    {
      "q": "O permisiune individuală restrânsă prevalează asupra unui calendar public?",
      "a": "Nu. Google documentează prioritatea permisiunilor mai largi când setările se contrazic. Verifică accesul public și al organizației, nu doar persoana."
    },
    {
      "q": "Toate permisiunile de editare expun la fel evenimentele private?",
      "a": "Nu. Google documentează separat o opțiune care limitează accesul privat și alte opțiuni de editare sau administrare. Citește permisiunea actuală exactă."
    },
    {
      "q": "Advanced schimbă drepturile de partajare Google?",
      "a": "Nu. Advanced elimină reclamele în Cloud Calendars. Accesul depinde de permisiunile calendarului și restricțiile organizației."
    }
  ],
  "sourcesHeading": "Ghidurile Google actuale despre permisiuni și partajare",
  "sources": [
    {
      "label": "Google: alegerea permisiunilor calendarului",
      "url": "https://support.google.com/calendar/answer/15716974?hl=en"
    },
    {
      "label": "Google: partajarea calendarului și retragerea accesului",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    }
  ],
  "seeAlso": [
    "why-a-shared-calendar-does-not-appear"
  ],
  "updated": "2026-10-21"
},

  'why-a-shared-calendar-does-not-appear': {
    "updated": "2026-10-21",
    "title": "Ți s-a partajat un calendar și nu e acolo",
    "short": "Calendarul partajat nu apare",
    "description": "Lipsește un calendar Google partajat? Verifică contul invitat, grupul, vizibilitatea și tipul linkului primit.",
    "lede": "Acest ghid este realizat de Arte Soft, dezvoltatorul Cloud Calendars. Deosebește mai întâi lipsa accesului de un calendar doar ascuns.",
    "commonBelief": "Că acceptarea unui calendar partajat îl pune pe telefonul tău.",
    "sections": [
      {
        "heading": "Verifică contul și grupul",
        "body": [
          "Compară destinatarul invitației cu contul Google de pe telefon și din browser. Deschide linkul cu acel cont. Google permite partajarea cu persoane și Grupuri Google. Pentru acces prin grup, cere administratorului să confirme apartenența ta, iar proprietarului calendarului să verifice accesul grupului corect. Un e-mail redirecționat nu acordă singur permisiunea."
        ]
      },
      {
        "heading": "Ascuns, absent sau restricționat?",
        "body": [
          "Deschide meniul Google Calendar pe iPhone sau iPad. Dacă apare în listă, dar nu este bifat, selectează calendarul. Dacă lipsește, cere proprietarului să verifice accesul: o cerere nu înseamnă aprobare. Regulile serviciului sau școlii pot limita partajarea. Compară același cont în Google Calendar pe web. Dacă acolo funcționează, verifică contul conectat și calendarele selectate în cealaltă aplicație. Accesul doar pentru citire nu permite editarea."
        ]
      },
      {
        "heading": "Identifică linkul",
        "body": [
          "Și invitația de partajare conține un link; nu orice link este un abonament ICS. Întreabă dacă acordă acces la un calendar Google sau publică un flux doar pentru citire. Google precizează că un abonament nou necesită un browser pe computer; deschiderea unui calendar deja partajat prin e-mail este altă operațiune. Actualizările fluxului depind de serviciul destinatar. Nu există un termen universal; confirmă schimbările urgente cu organizatorul."
        ]
      }
    ],
    "claims": {},
    "faq": [
      {
        "q": "Poate un Grup Google primi acces?",
        "a": "Da. Verifică grupul ales, apartenența ta și restricțiile organizației. Un e-mail de grup redirecționat nu dovedește accesul."
      },
      {
        "q": "Să șterg contul și să-l reconectez?",
        "a": "Verifică mai întâi identitatea, drepturile și vizibilitatea și compară calendarul web. Reconectarea nu acordă drepturile lipsă."
      }
    ],
    "practical": [
      "Confirmă contul invitat și apartenența la grup.",
      "Selectează calendarul dacă este în listă, dar ascuns.",
      "Cere verificarea accesului înainte de a schimba conexiunile."
    ],
    "sourcesHeading": "Surse și informații suplimentare",
    "sources": [
      {
        "label": "Google: Verifică contul și grupul",
        "url": "https://support.google.com/calendar/answer/37082?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Ascuns, absent sau restricționat?",
        "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Identifică linkul",
        "url": "https://support.google.com/calendar/answer/37648?hl=en"
      }
    ],
    "seeAlso": [
      "who-can-see-what-in-google-calendar",
      "google-calendars-that-never-reach-your-iphone"
    ]
  },

  'the-secret-address-of-a-google-calendar': {
  "title": "Adresa iCal secretă Google: abonarea nu înseamnă partajare",
  "short": "Adresa iCal secretă",
  "description": "Înțelege adresa iCal secretă, conectarea contului și fluxurile partajate. Află ce faci dacă adresa a fost divulgată și de ce pot rămâne copii.",
  "lede": "O adresă de calendar, conectarea unui cont și o invitație au roluri diferite. Identifică ce ai înainte să folosești acel lucru pentru a aduce programul într-o altă aplicație. Acest ghid este publicat de Arte Soft, dezvoltatorul Cloud Calendars.",
  "commonBelief": "Adresa secretă este o invitație personală care poate fi retrasă pentru un singur destinatar.",
  "sections": [
    {
      "heading": "Alege conexiunea potrivită scopului",
      "body": [
        "Google diferențiază conectarea într-o altă aplicație de calendar de vizualizarea prin adresa iCal secretă. Conectarea contului poate permite editarea; adresa oferă un abonament doar pentru vizualizare. Google o descrie ca fiind pentru uz propriu și recomandă să nu o dai altor persoane.",
        "De exemplu, afișarea propriului program de lucru într-un calendar compatibil diferă de acordarea accesului permanent unui coleg. Pornește de la rezultat: consultarea programului, colaborarea cu o persoană anume sau distribuirea unui orar către un public. Nu alege un URL doar fiindcă este ușor de lipit."
      ]
    },
    {
      "heading": "Verifică calendarul, nu doar contul",
      "body": [
        "Pe computer, instrucțiunile Google plasează adresa secretă în format iCal în setările de integrare ale calendarului ales. Verifică mai întâi numele calendarului. Administratorii de serviciu sau școală pot restricționa opțiunea; lipsa adresei nu justifică publicarea calendarului.",
        "Nu include adresa în capturi de ecran, solicitări publice de asistență sau notițe partajate. Când ceri ajutor, descrie tipul contului, numele calendarului și metoda de conectare fără URL. De obicei, asistența trebuie să identifice întâi conexiunea, nu conținutul evenimentelor."
      ]
    },
    {
      "heading": "Verifică ce a adăugat aplicația destinatară",
      "body": [
        "Un abonament urmărește un flux; importarea unui fișier creează o copie separată. Citește instrucțiunile aplicației destinatare și confirmă acțiunea aleasă. Dacă doar deschizi un fișier de calendar descărcat, nu presupune că întâlnirile rezultate vor prelua modificările viitoare.",
        "Compară numele calendarului, data și detaliile cu ajutorul unui eveniment obișnuit, fără date sensibile, pe care îl recunoști. Nu crea un al doilea abonament ca să-l diagnostichezi pe primul: două copii vizibile pot face o actualizare întârziată să pară un conflict. Ascunde temporar un calendar pentru a identifica sursa."
      ]
    },
    {
      "heading": "Separă linkurile Google de cele Cloud Calendars",
      "body": [
        "Cloud Calendars are propriile mecanisme de partajare a evenimentelor și calendarelor, inclusiv fluxuri de abonare. Acestea nu sunt adrese secrete Google. Înainte să alegi cum deschizi linkul, stabilește dacă expeditorul a trimis un eveniment, un calendar sau o invitație asociată unui cont.",
        "Un destinatar Cloud Calendars poate avea rolul Reader, Writer sau Owner. O adresă de flux nu dovedește singură dreptul de editare. Nici primirea unei adrese Google pentru vizualizare nu te face proprietarul calendarului. Întreabă expeditorul în ce sistem trebuie făcute modificările."
      ]
    },
    {
      "heading": "Ține cont de actualizarea în aplicația destinatară",
      "body": [
        "Abonarea nu promite livrare imediată. Fluxurile Cloud Calendars includ un interval de actualizare sugerat, dar aplicația destinatară decide când preia și afișează schimbările. O oră veche pe un dispozitiv nu dovedește singură că organizatorul nu a salvat modificarea.",
        "Pentru o întâlnire din aceeași zi, compară cu programul actual al organizatorului și confirmă direct schimbările importante. Notează calendarul care arată încă date vechi și momentul verificării. Nu importa repetat evenimentul și nu șterge calendarul sursă pentru a forța actualizarea."
      ]
    },
    {
      "heading": "Reacționează la divulgare fără promisiuni de retragere totală",
      "body": [
        "Google documentează resetarea unei adrese secrete divulgate: vechea adresă devine invalidă și este creată alta. Identifică aplicațiile proprii care o folosesc, ca să actualizezi ulterior abonamentele. Resetarea adresei diferă de eliminarea unui colaborator anume.",
        "Întâlnirile salvate anterior, exporturile și capturile de ecran sunt o chestiune separată. Schimbarea linkului nu dovedește dispariția tuturor copiilor. Dacă informațiile au ajuns la publicul greșit, analizează materialul și destinatarii reali, fără a considera resetarea reușită drept dovadă a eliminării complete."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifică dacă ai o conexiune de cont, o invitație, un abonament sau un fișier.",
    "Verifică calendarul sursă înainte să copiezi adresa.",
    "Păstrează adresa secretă Google pentru propriile aplicații compatibile.",
    "Confirmă că aplicația s-a abonat, nu a importat o copie.",
    "Confirmă schimbările urgente cu organizatorul, fără a depinde de actualizare.",
    "Dacă adresa a fost divulgată, urmează resetarea Google și actualizează conexiunile dorite."
  ],
  "faq": [
    {
      "q": "Pot da adresa secretă unui coleg?",
      "a": "Google recomandă să o păstrezi pentru propriile aplicații. Pentru accesul altei persoane, folosește controalele de partajare și alege permisiunea potrivită."
    },
    {
      "q": "Abonarea îmi permite să editez originalul?",
      "a": "Adresa iCal secretă Google este pentru vizualizare. Editarea necesită o conexiune de cont și permisiuni potrivite; rolurile Cloud Calendars sunt un mecanism separat."
    },
    {
      "q": "Resetarea adresei șterge întâlnirile vechi de peste tot?",
      "a": "Invalidează vechea adresă Google. Nu demonstrează că fișierele, întâlnirile sau capturile salvate independent au fost eliminate."
    }
  ],
  "sourcesHeading": "Ghidurile furnizorilor și lecturi suplimentare",
  "sources": [
    {
      "label": "Google: conectarea conturilor și adresele iCal secrete",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    },
    {
      "label": "Google: partajarea unui calendar",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: import, abonare și timpul de actualizare",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "updated": "2026-10-21",
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "taking-back-a-calendar-you-shared",
    "sharing-one-event-not-your-calendar"
  ]
},

  'what-guests-can-do-to-your-event': {
  "title": "Permisiunile invitaților în Google Calendar: editare, invitații și lista participanților",
  "short": "Permisiunile invitaților",
  "description": "Verifică permisiunile și setările implicite Google. Separă drepturile invitației de accesul la calendar și de rolurile Cloud Calendars.",
  "lede": "Posibilitatea de a răspunde nu descrie tot ce poate face un invitat. Verifică permisiunile înainte să folosești o singură invitație pentru echipă, clienți sau o întâlnire publică. Ghidul este publicat de Arte Soft, dezvoltatorul Cloud Calendars.",
  "commonBelief": "Invitații pot doar accepta sau refuza, iar toate aplicațiile oferă aceleași controale de acces.",
  "sections": [
    {
      "heading": "Începe cu organizatorul și evenimentul original",
      "body": [
        "Deschide evenimentul în Google Calendar cu contul organizatorului sau unul autorizat să-l gestioneze. Verifică calendarul, data și organizatorul înainte să schimbi permisiuni. O întâlnire importată separat nu este un loc sigur pentru controlul invitației originale.",
        "Pentru o întâlnire de echipă, stabilește cine o poate reprograma, cine poate invita alte persoane și dacă participanții trebuie să se vadă între ei. Sunt decizii distincte. Un invitat care trebuie să participe nu are neapărat nevoie să gestioneze întâlnirea."
      ]
    },
    {
      "heading": "Decide dacă invitații pot modifica întâlnirea",
      "body": [
        "Google documentează opțiunea de modificare a evenimentului în permisiunile invitaților din editorul pentru computer. Este un drept larg de colaborare, nu doar o modalitate de a sugera altă oră. Google explică faptul că permite gestionarea evenimentului, editarea câmpurilor, vizualizarea invitaților și rezervarea sălilor.",
        "Un coorganizator de încredere care pregătește un atelier poate avea nevoie de această flexibilitate. Un client care vine la o programare poate nu are. Alege după responsabilitatea acordată și verifică evenimentul salvat, fără să te bazezi pe configurația altei întâlniri."
      ]
    },
    {
      "heading": "Verifică separat invitațiile și vizibilitatea participanților",
      "body": [
        "Modelul de evenimente Google separă dreptul de a invita alte persoane de dreptul de a vedea ceilalți invitați. Verifică-le pe ambele, alături de editare. Dezactivarea uneia nu înseamnă verificarea celeilalte, iar o valoare implicită afișată nu dovedește setările unui eveniment existent.",
        "Pentru clienți fără legătură între ei, gândește-te dacă o invitație comună este potrivită. Informațiile deja incluse în e-mailuri, descrieri sau mesaje redirecționate depășesc controlul actual al listei de invitați. Nu pune date confidențiale în descriere presupunând că ascunderea listei le va ascunde."
      ]
    },
    {
      "heading": "Verifică setările implicite și evenimentele importante",
      "body": [
        "Google documentează și permisiuni implicite ale invitaților în setările evenimentelor, inclusiv pentru modificare. Controalele nu sunt exclusiv individuale. Revizuiește valorile implicite când se schimbă modul obișnuit de programare, apoi verifică separat invitațiile importante existente.",
        "La o întâlnire repetată, confirmă ce apariție sau serie editezi înainte să salvezi. Nu presupune că schimbarea unei preferințe rescrie invitațiile vechi. Pentru un test cu un coleg, folosește un exemplu convenit și fără date sensibile, nu muta sau anula o întâlnire reală cu un client."
      ]
    },
    {
      "heading": "Separă rolurile Cloud Calendars",
      "body": [
        "Cloud Calendars are propriul sistem de partajare cu rolurile Reader, Writer și Owner. Reader permite vizualizarea și sincronizarea; Writer permite editarea; Owner gestionează și partajarea și accesul folosind identitatea invitată. Aceste roluri nu sunt comutatoare pentru cele trei permisiuni Google.",
        "Când contează o permisiune specifică Google, inspectează evenimentul original în Google Calendar. Prezența unui participant în Cloud Calendars nu dovedește că toate setările Google pot fi schimbate acolo. Când investighezi un control lipsă sau o editare nereușită, clarifică serviciul proprietar și identitatea destinatarului."
      ]
    },
    {
      "heading": "Confirmă rezultatul și responsabilitățile",
      "body": [
        "După salvare, redeschide evenimentul original și verifică setările dorite. Dacă este potrivit, cere unui coleg autorizat să confirme ce poate face din propriul cont. Nu schimbați parole și nu trimiteți date private ale invitaților ca scurtătură pentru verificarea accesului.",
        "Separă participarea de permisiuni. Dreptul de editare, o copie importată și un răspuns de acceptare sunt lucruri diferite. În Cloud Calendars, confirmarea primirii unui element partajat nu este RSVP. Pentru o întâlnire importantă, cere răspunsul privind participarea și precizează cine răspunde de schimbările programului."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifică contul organizatorului și evenimentul original.",
    "Stabilește cine gestionează întâlnirea, invită persoane și vede invitații.",
    "Verifică permisiunile reale ale evenimentului Google.",
    "Revizuiește valorile implicite fără a presupune că modifică evenimentele existente.",
    "Tratează rolurile Cloud Calendars ca sistem separat.",
    "Redeschide evenimentul salvat și confirmă participarea separat."
  ],
  "faq": [
    {
      "q": "Poate un invitat schimba ora întâlnirii?",
      "a": "Google permite acordarea dreptului de modificare. Verifică evenimentul și accesul invitatului; simpla primire a invitației nu dovedește acest drept."
    },
    {
      "q": "Permisiunile se configurează numai pe fiecare eveniment?",
      "a": "Nu. Google documentează și permisiuni implicite. Verifică-le pentru programările viitoare și inspectează direct evenimentele importante existente."
    },
    {
      "q": "Ascunderea listei elimină informațiile deja trimise?",
      "a": "Nu dovedește eliminarea e-mailurilor, descrierilor, capturilor sau copiilor independente anterioare. Verifică separat ce a fost distribuit."
    }
  ],
  "sourcesHeading": "Ghidurile furnizorilor și lecturi suplimentare",
  "sources": [
    {
      "label": "Google: colaborarea la evenimente și permisiunile implicite",
      "url": "https://support.google.com/a/users/answer/13293412?hl=en"
    },
    {
      "label": "Google: câmpurile de permisiune ale invitaților",
      "url": "https://developers.google.com/workspace/calendar/api/v3/reference/events"
    }
  ],
  "updated": "2026-10-21",
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "sharing-one-event-not-your-calendar"
  ]
},

  'google-calendars-that-never-reach-your-iphone': {
    title: 'De ce unele calendare Google nu ajung niciodată pe iPhone',
    short: 'Calendare Google lipsă pe iPhone',
    description:
      'Un cont Google, mai multe calendare și doar unul pe telefon. Lista de sincronizare care decide asta și ce se face în loc.',
    lede: 'Contul tău Google ține opt calendare. iPhone-ul arată două. Nu e nimic stricat: ceva ce n-ai văzut niciodată a ales în locul tău.',
    commonBelief: 'Că adăugarea unui cont Google pe iPhone adaugă și calendarele din el.',
    sections: [
      {
        heading: 'O listă care nu ți-a fost arătată niciodată',
        body: [
          'Google ține, pentru fiecare dispozitiv, o listă cu ce calendare au voie să se sincronizeze, iar calendarele secundare — cele partajate, cele abonate, cele făcute pentru un proiect — rămân frecvent în afara ei.',
          'Lista nu se află în setările iOS. Trăiește pe o pagină Google separată, și de aceea căutatul în locul evident nu găsește nimic greșit și nu schimbă nimic.',
        ],
      },
      {
        heading: 'Cealaltă cale',
        body: [
          'O aplicație care vorbește direct cu Google nu folosește acea listă, deci arată fiecare calendar pe care contul îl are cu adevărat, inclusiv pe cele pe care telefonul le-a lăsat tăcut deoparte.',
          'Asta apropie și conturile. O vedere care ține personalul, munca și partajatul e chiar ideea; dacă telefonul le-ar fi sincronizat pe fiecare încetează să fie o întrebare.',
        ],
      },
    ],
    claims: {
      accounts: 'Tipuri de conturi pe care o singură vedere le ține laolaltă',
      price: 'Cât costă partea de Google',
    },
    faq: [
      {
        q: 'De ce apar pe iPhone doar unele dintre calendarele mele Google?',
        a: 'Google ține, pentru fiecare dispozitiv, o listă cu ce calendare au voie să se sincronizeze, iar cele secundare — partajate, abonate, făcute pentru un proiect — rămân deseori în afara ei.',
      },
      {
        q: 'Unde e setarea de sincronizare Google Calendar pentru iPhone?',
        a: 'Nu în setările iOS. Trăiește pe o pagină Google separată, motiv pentru care căutarea în locul evident nu găsește nimic și nu schimbă nimic.',
      },
      {
        q: 'Cum văd toate calendarele Google pe iPhone?',
        a: 'Printr-o aplicație care interoghează Google direct, nu prin lista dispozitivului. Arată fiecare calendar pe care contul îl are cu adevărat, inclusiv pe cele lăsate deoparte de telefon.',
      },
    ],
    practical: [
      'Verifică lista de sincronizare Google înainte să crezi contul stricat.',
      'Așteaptă-te ca abonate și partajate să fie excluse, nu incluse.',
      'Dacă ai mai mult de două calendare, citește-le cu ceva care interoghează Google direct.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'icloud-google-and-outlook-in-one-view'],
  },

  'taking-back-a-calendar-you-shared': {
  "title": "Oprește partajarea unui calendar și verifică accesul rămas",
  "short": "Verificarea și retragerea accesului",
  "description": "Oprește partajarea fără a confunda persoanele, grupurile, accesul public și abonamentele. Verifică schimbările și înțelege de ce pot rămâne copii.",
  "lede": "Încheierea unei colaborări începe prin identificarea modului în care a fost acordat accesul. Eliminarea unei persoane, oprirea publicării și resetarea unei adrese de abonare sunt acțiuni diferite. Acest ghid este publicat de Arte Soft, dezvoltatorul Cloud Calendars.",
  "commonBelief": "Eliminarea unui destinatar retrage instantaneu toate copiile și închide orice altă cale de acces la calendar.",
  "sections": [
    {
      "heading": "Identifică calendarul și modul de partajare",
      "body": [
        "Înainte să schimbi accesul, confirmă contul proprietar, calendarul și publicul dorit. Un calendar Google partajat cu un anumit coleg reprezintă alt tip de acces decât un calendar public, o permisiune pentru un grup sau o adresă de abonare. Cloud Calendars are și propriile mecanisme de partajare a evenimentelor și calendarelor.",
        "De exemplu, secretarul unui club poate primi drept de editare printr-o invitație individuală, în timp ce membrii urmăresc un program publicat. Retragerea permisiunii secretarului nu stabilește ce ar trebui să se întâmple cu abonamentele membrilor. Enumeră aranjamentele pe care le-ai creat efectiv."
      ]
    },
    {
      "heading": "Retrage permisiunea potrivită în Google",
      "body": [
        "Google documentează controale separate pentru persoane sau grupuri, partajarea în organizație și accesul public. Pe computer, deschide setările de partajare ale calendarului potrivit și modifică intrarea sau setarea relevantă. Verifică mai întâi contul conectat și numele calendarului.",
        "O persoană poate avea în continuare acces printr-un grup sau prin publicarea mai largă. Verifică toate căile de acces, în loc să elimini repetat aceeași adresă de e-mail. Politicile firmei sau școlii pot limita opțiunile; folosește procedura aprobată de proprietar sau administrator când este necesar."
      ]
    },
    {
      "heading": "Tratează separat adresa secretă",
      "body": [
        "Google precizează că adresa iCal secretă este destinată utilizării proprii într-o altă aplicație de calendar și nu trebuie oferită altor persoane. Dacă a fost divulgată, Google recomandă resetarea pentru invalidarea adresei vechi. Aceasta este o acțiune diferită de eliminarea unei persoane.",
        "Înainte să schimbi o adresă de abonare pe care o folosești, identifică aplicațiile sau instrumentele dependente de ea, pentru a le reconecta ulterior pe cele dorite. Nu publica URL-ul secret într-o solicitare publică de asistență și nu îl trimite drept dovadă că ai găsit calendarul. Menționează numele calendarului și tipul conexiunii."
      ]
    },
    {
      "heading": "Separă destinatarii Cloud Calendars de linkurile de abonare",
      "body": [
        "În Cloud Calendars, accesul destinatarilor la eveniment sau calendar și un flux de abonare emis sunt mecanisme distincte. Verifică relația reală de partajare și linkul corespunzător înainte să alegi o acțiune. Eliminarea unui destinatar identificat nu garantează retragerea tuturor URL-urilor distribuite sau copiilor independente.",
        "Dacă un coorganizator trebuie doar să nu mai editeze, analizează rolul dorit și cine păstrează accesul, în loc să ștergi programul comun. Dacă întreaga colaborare se încheie, stabilește proprietarul și cine ar trebui să păstreze calendarul. Părăsirea unui calendar primit și ștergerea unuia propriu sunt decizii diferite."
      ]
    },
    {
      "heading": "Verifică rezultatul fără a promite dispariția imediată",
      "body": [
        "Verifică dacă modificarea dorită a fost salvată în sistemul proprietar. Dacă te poate ajuta un coleg autorizat, confirmați vizualizarea sau editarea din contul lui, fără să partajați parole. Deosebește refuzul accesului de un eveniment vechi încă vizibil într-o copie importată sau în cache.",
        "Nu promite un interval universal de actualizare sau absența notificărilor. La predarea responsabilităților unui grup, comunică programul care va fi folosit de acum înainte. O înregistrare veche vizibilă nu dovedește singură dacă persoana are acces activ, o altă permisiune sau o copie separată."
      ]
    },
    {
      "heading": "Gestionează separat copiile existente",
      "body": [
        "Fișierele exportate, capturile de ecran, mesajele și întâlnirile salvate separat pot rămâne după schimbarea accesului. Stabilește ce copii contează pentru predare și discută gestionarea lor cu persoanele implicate. Modificarea unei permisiuni nu arată ce a salvat deja fiecare destinatar.",
        "Păstrează înregistrările sursă necesare în timpul verificării. Nu muta întâlniri sensibile într-un alt calendar partajat doar pentru a-l goli pe cel vechi și nu anula invitații reale pentru a testa accesul. Notează calendarul, calea de acces și schimbarea făcută, pentru o investigație ulterioară clară."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifică contul proprietar, calendarul și modul de partajare.",
    "Verifică separat persoanele, grupurile și publicarea mai largă.",
    "Folosește controalele potrivite din Google sau Cloud Calendars.",
    "Tratează resetarea unei adrese secrete divulgate ca decizie separată.",
    "Verifică rezultatul salvat fără a partaja date de autentificare.",
    "Planifică separat gestionarea copiilor și exporturilor existente."
  ],
  "faq": [
    {
      "q": "Eliminarea unei persoane dezactivează calendarul public sau accesul prin grup?",
      "a": "Nu presupune asta. Verifică fiecare cale reală de acces. Google documentează separat destinatarii individuali, grupurile și publicarea mai largă."
    },
    {
      "q": "Calendarul va dispărea imediat și fără notificări?",
      "a": "Nu există o promisiune universală privind dispariția, notificările sau actualizarea. Confirmă schimbarea salvată și deosebește accesul activ de informațiile importate ori din cache."
    },
    {
      "q": "Advanced oferă dreptul de a retrage accesul la un calendar Google?",
      "a": "Advanced elimină reclamele din Cloud Calendars. Controalele Google depind de proprietate, permisiuni și regulile organizației, nu de acest plan al aplicației."
    }
  ],
  "sourcesHeading": "Ghiduri despre acces și abonare",
  "sources": [
    {
      "label": "Google: controale de partajare și oprirea accesului",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Google: sincronizarea conturilor și adresele iCal secrete",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    }
  ],
  "updated": "2026-10-21",
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "the-secret-address-of-a-google-calendar"
  ]
},
};
