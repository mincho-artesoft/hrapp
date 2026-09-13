import { LocalisedArticle } from '../types';

/** Cele șase articole despre Google: întrebări concrete, răspunsuri limpezi. */
export const GOOGLE_RO: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
    title: 'Cine ce vede când partajezi un calendar Google',
    short: 'Permisiuni de partajare Google',
    description:
      'Nivelurile de partajare ale Google se setează repede și se înțeleg greșit ușor. Ce expune de fapt fiecare, spus pe șleau.',
    lede: 'Aproape nicio partajare excesivă nu e o eroare de judecată. E cineva care a ales un nivel ce suna modest și nu era.',
    commonBelief: 'Că „doar liber/ocupat” și „toate detaliile evenimentelor” diferă puțin.',
    sections: [
      {
        heading: 'Nivelurile sunt mai depărtate decât sună',
        body: [
          'Liber/ocupat arată blocuri de timp fără titluri. Toate detaliile arată titluri, locuri, notițe și invitați — pentru majoritatea calendarelor, o bună parte din viața ta.',
          'Efectuarea de modificări permite editarea. Gestionarea partajării permite cuiva să dea calendarul tău mai departe altora, iar acesta e nivelul care surprinde mai târziu.',
        ],
      },
      {
        heading: 'Să alegi fără să te gândești de fiecare dată',
        body: [
          'Pentru colegii care trebuie doar să își potrivească orele cu ale tale, liber/ocupat e aproape întotdeauna răspunsul corect și aproape niciodată cel ales.',
          'Păstrează detaliile complete pentru calendarele create ca să fie partajate, nu pentru cel în care trăiești.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Costul lunar al nivelului în care se gestionează asta în aplicație, în dolari',
    },
    faq: [
      {
        q: 'Se văd titlurile evenimentelor mele dacă partajez doar liber/ocupat?',
        a: 'Nu. Liber/ocupat arată blocuri de timp fără titluri, locuri, notițe sau invitați. Abia „toate detaliile” le expune — și le expune pe toate.',
      },
      {
        q: 'Ce permite „efectuarea de modificări și gestionarea partajării”?',
        a: 'Editarea oricărui eveniment și predarea calendarului tău altor persoane fără să te întrebe. E singurul nivel la care altcineva împarte accesul.',
      },
      {
        q: 'Pot verifica cine are deja acces la calendarul meu?',
        a: 'Da, în setările de partajare ale acelui calendar. Nimic nu te îndeamnă să te uiți, iar partajările doar se adună: citește lista de două ori pe an.',
      },
    ],
    practical: [
      'Implicit liber/ocupat pentru oricine trebuie doar să rezerve timp cu tine.',
      'Păstrează „efectuarea de modificări” pentru cei care chiar planifică în locul tău.',
      'Verifică de două ori pe an cine are acces; partajările se adună și nimic nu-ți amintește.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'what-guests-can-do-to-your-event'],
  },

  'why-a-shared-calendar-does-not-appear': {
    title: 'Ți s-a partajat un calendar și nu e acolo',
    short: 'Calendarul partajat nu apare',
    description:
      'Cineva a partajat un calendar, ai acceptat și nu s-a schimbat nimic. Cele patru motive obișnuite, în ordinea în care merită verificate.',
    lede: 'Invitația a venit, linkul a fost atins, iar calendarul tot lipsește. Aproape întotdeauna e unul din patru lucruri, și niciunul nu e partajarea stricată.',
    commonBelief: 'Că acceptarea unui calendar partajat îl pune pe telefonul tău.',
    sections: [
      {
        heading: 'Acceptarea îl adaugă unui cont, nu unui dispozitiv',
        body: [
          'O partajare aterizează în contul Google căruia i-a fost adresată. Dacă ai acceptat conectat cu un cont, iar telefonul poartă altul, calendarul stă cuminte exact acolo unde nu te uiți.',
          'Chiar și în contul potrivit, un calendar proaspăt adăugat ajunge pe celelalte dispozitive mai des oprit decât pornit. Există, doar că nu e bifat — iar un calendar nebifat arată exact ca unul lipsă.',
        ],
      },
      {
        heading: 'Celelalte două motive',
        body: [
          'Partajarea către o listă de discuții sau o adresă de grup ajunge rar la persoane; e nevoie de adresa care chiar este un cont Google. Iar un calendar partajat ca link este un abonament: ajunge în altă parte a listei și se reîmprospătează în ritmul celui care publică, nu instantaneu.',
          'Pe iPhone, calendarele Google ajung în aplicația integrată printr-o listă de sincronizare proprie, iar calendarele secundare sunt implicit în afara ei. De aceea un cont arată calendarul principal și le scapă în tăcere pe cele patru care contează.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Ore între cererile de reîmprospătare ale unui flux abonat',
      accounts: 'Tipuri de conturi pe care o singură vedere le ține laolaltă, fără nimic din toate astea',
    },
    faq: [
      {
        q: 'Am acceptat un calendar partajat, dar nu e pe iPhone. De ce?',
        a: 'Partajarea aterizează în contul Google căruia i-a fost adresată, iar un calendar proaspăt adăugat ajunge pe celelalte dispozitive de obicei oprit. Verifică întâi contul, apoi caută-l nebifat, nu absent.',
      },
      {
        q: 'Funcționează partajarea către o adresă de grup?',
        a: 'Rar. O listă de discuții ajunge greu la oamenii din spatele ei. E nevoie de adresa care este ea însăși un cont Google.',
      },
      {
        q: 'Cât durează până apare un calendar partajat?',
        a: 'Partajarea prin permisiuni apare imediat ce lista se reîmprospătează. Un calendar partajat ca link este un abonament și urmează ritmul celui care publică.',
      },
    ],
    practical: [
      'Verifică întâi ce cont a acceptat partajarea, apoi restul.',
      'Deschide lista de calendare de pe dispozitiv și caută-l oprit, nu absent.',
      'Dacă a venit ca link, așteaptă-te la întârziere, nu la apariție imediată.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'google-calendars-that-never-reach-your-iphone'],
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
    title: 'Să iei înapoi un calendar pe care l-ai partajat',
    short: 'Retragerea accesului',
    description:
      'Scoaterea cuiva dintr-un calendar oprește ce urmează. Ce nu face este să desfacă ce s-a întâmplat deja.',
    lede: 'Încheierea accesului e o atingere. Să decizi dacă o atingere ajunge durează ceva mai mult, fiindcă partajarea lasă copii în urmă.',
    commonBelief: 'Că scoaterea unei persoane scoate și ce a văzut.',
    sections: [
      {
        heading: 'Ce se oprește și ce rămâne',
        body: [
          'Scoate o persoană și calendarul dispare din lista ei, imediat și fără mesaj. Evenimentele viitoare nu o mai ating niciodată.',
          'Ce nu se întoarce: invitațiile pe care le are deja, evenimentele copiate în propriul calendar, orice a fost exportat și tot ce a primit o adresă secretă. Accesul se încheie; memoria nu.',
        ],
      },
      {
        heading: 'Cel care supraviețuiește scoaterii',
        body: [
          'Dacă cineva a avut vreodată dreptul de a gestiona partajarea, poate a adăugat alți oameni. Scoaterea lui îi lasă pe aceia la locul lor — așa ajunge un calendar partajat cu cineva pe care nimeni nu-și amintește să-l fi invitat.',
          'Citește deci toată lista în loc să ștergi un nume și fă-o la plecare, nu peste luni. Nimic nu-ți amintește, iar partajările doar se adună.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Costul lunar al nivelului în care se gestionează asta, în dolari',
    },
    faq: [
      {
        q: 'Scoaterea cuiva șterge și ce a văzut deja?',
        a: 'Nu. Invitațiile pe care le are deja, evenimentele copiate în propriul calendar și tot ce a fost exportat rămân. Accesul se încheie; copiile nu.',
      },
      {
        q: 'Află persoana că i-am retras accesul?',
        a: 'Nu. Calendarul dispare din lista ei imediat și fără niciun mesaj.',
      },
      {
        q: 'De ce e calendarul meu partajat cu cineva pe care nu l-am invitat niciodată?',
        a: 'L-a adăugat cineva care avea dreptul de a gestiona partajarea. Scoaterea acelei persoane lasă la locul lor pe toți cei adăugați de ea — de aceea se citește lista întreagă, nu un nume.',
      },
    ],
    practical: [
      'Citește lista completă de acces, nu doar numele pe care voiai să-l scoți.',
      'Resetează adresa secretă dacă persoana a avut-o vreodată.',
      'Presupune că rămân copii: mută ce e cu adevărat sensibil în loc să ascunzi.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
