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
    title: 'Ce dezvăluie de fapt adresa secretă a unui calendar Google',
    short: 'Adresa iCal secretă',
    description:
      'Google oferă o adresă privată care arată tot calendarul tău oricui o deține. Ce expune și de ce nu poate fi retrasă în liniște.',
    lede: 'Ascuns în setările fiecărui calendar Google se află un link care arată tot ce e pe el. Fără autentificare, fără permisiune, fără urmă despre cine l-a deschis.',
    commonBelief: 'Că o adresă privată e privată pentru că e greu de găsit.',
    sections: [
      {
        heading: 'Un link e o parolă care nu poate fi schimbată pentru o singură persoană',
        body: [
          'Adresa secretă poartă detalii complete — titluri, ore, locuri, notițe. Oricine are linkul le vede, și nu există o listă cu cine sunt aceștia.',
          'Singura ei protecție e partea aleatorie a adresei. Împotriva ghicitului chiar protejează, împotriva unei redirecționări, a unui ecran partajat sau a unui document care supraviețuiește slujbei — deloc.',
        ],
      },
      {
        heading: 'Resetarea o strică pentru toți',
        body: [
          'Poți reseta adresa, iar cea veche moare. Moare și pentru fiecare coleg, fiecare tablou de bord și fiecare script care se sprijinea tăcut pe ea, fără niciun avertisment.',
          'Acesta e argumentul pentru a nu da niciodată adresa calendarului în care trăiești. Publică un calendar făcut anume pentru asta și resetarea nu te costă nimic.',
        ],
      },
    ],
    claims: {
      linkLength: 'Caractere aleatorii care protejează un link de partajare de-al nostru',
      sharePrice: 'Cât costă partajarea unui eveniment din aplicație',
    },
    faq: [
      {
        q: 'Ce poate face cineva cu adresa secretă a calendarului meu?',
        a: 'Să vadă tot ce e pe el — titluri, ore, locuri și notițe — fără autentificare, fără permisiune și fără să rămână undeva urma că s-a uitat.',
      },
      {
        q: 'Pot lua înapoi o adresă secretă de calendar?',
        a: 'Doar resetând-o, ceea ce omoară adresa veche pentru toți deodată: colegi, tablouri de bord și orice script care se sprijinea tăcut pe ea, fără avertisment.',
      },
      {
        q: 'Pot trimite adresa secretă unui coleg pe e-mail?',
        a: 'Tratează-o ca publică din clipa în care îți iese din mâini. Singura ei protecție e că se ghicește greu, iar redirecționarea anulează exact asta.',
      },
    ],
    practical: [
      'Tratează adresa secretă drept publică din clipa în care îți iese din mâini.',
      'Nu publica niciodată adresa calendarului pe care chiar îl folosești.',
      'Resetează când cineva pleacă și spune-le celor cărora li se va rupe.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'taking-back-a-calendar-you-shared'],
  },

  'what-guests-can-do-to-your-event': {
    title: 'Ce pot face invitații cu un eveniment de-al tău',
    short: 'Permisiunile invitaților',
    description:
      'Trei căsuțe decid dacă un invitat îți poate muta ședința, poate invita necunoscuți sau poate citi toată lista. Sunt bifate mai des decât crede lumea.',
    lede: 'A invita pe cineva îi dă mai mult decât un loc și o oră. Într-un eveniment Google obișnuit, invitatul vede de regulă pe cine ai mai chemat și adesea poate adăuga alții.',
    commonBelief: 'Că un invitat poate doar accepta sau refuza.',
    sections: [
      {
        heading: 'Cele trei căsuțe',
        body: [
          'Modificarea evenimentului lasă un invitat să schimbe ora, locul și titlul pentru toată lumea. Rareori dorită, ușor lăsată bifată.',
          'Invitarea altora îi permite să adauge oameni pe care nu i-ai întâlnit niciodată. Vizualizarea listei de invitați arată pe toți cei chemați și răspunsurile lor — în regulă într-o echipă, jenant cu un client, greșit în orice seamănă cu un grup de clienți separați.',
        ],
      },
      {
        heading: 'Unde o ia razna în tăcere',
        body: [
          'Un eveniment, mulți destinatari individuali, listă vizibilă: acum fiecare îi are pe toți. Debifarea acelei căsuțe e diferența dintre o ședință și o agendă de contacte scursă.',
          'Setările trăiesc pe eveniment, nu pe cont, deci revin la valorile tale implicite de fiecare dată și trebuie gândite la evenimentele care contează, nu o singură dată.',
        ],
      },
    ],
    claims: {
      sharePrice: 'Cât costă trimiterea unui singur eveniment din aplicație',
    },
    faq: [
      {
        q: 'Se văd invitații între ei într-o invitație din Google Calendar?',
        a: 'Implicit, de obicei da. „Vizualizarea listei de invitați” arată toți cei chemați și răspunsurile lor: în regulă într-o echipă, jenant cu un client și greșit când invitații sunt clienți separați.',
      },
      {
        q: 'Poate un invitat să schimbe ora ședinței mele?',
        a: 'Dacă „modificarea evenimentului” e bifată, da, iar schimbarea e valabilă pentru toți. Rareori se dorește și ușor rămâne pornită.',
      },
      {
        q: 'Cum împiedic invitații să cheme alți oameni?',
        a: 'Oprește „invitarea altora” chiar pe eveniment. Aceste setări aparțin evenimentului, nu contului, deci revin la valorile tale implicite de fiecare dată.',
      },
    ],
    practical: [
      'Oprește „vizualizarea listei de invitați” la tot ce pleacă spre oameni care nu se cunosc.',
      'Lasă „modificarea evenimentului” oprită, dacă nu cumva cineva chiar planifică pentru tine.',
      'Verifică bifele pe eveniment, nu în setări: acolo locuiesc.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'why-a-shared-calendar-does-not-appear'],
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
