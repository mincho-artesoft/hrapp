import { LocalisedArticle } from '../types';

/** I sei articoli su Google: domande precise, risposte nette. */
export const GOOGLE_IT: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
    title: 'Chi vede cosa quando condividi un calendario Google',
    short: 'Permessi di condivisione Google',
    description:
      'I livelli di condivisione di Google si impostano in fretta e si fraintendono facilmente. Cosa espone davvero ciascuno, detto in modo semplice.',
    lede: 'Quasi nessuna condivisione eccessiva è un errore di giudizio. È qualcuno che ha scelto un permesso che sembrava modesto e non lo era.',
    commonBelief: 'Che fra «solo libero/occupato» e «tutti i dettagli» ci sia poca differenza.',
    sections: [
      {
        heading: 'I livelli sono più distanti di come suonano',
        body: [
          'Libero/occupato mostra blocchi di tempo senza titoli. Tutti i dettagli mostra titoli, luoghi, note e invitati: per la maggior parte dei calendari, una parte consistente della tua vita.',
          'Apportare modifiche consente di modificare. Gestire la condivisione consente di consegnare il tuo calendario ad altre persone, ed è quello che sorprende più avanti.',
        ],
      },
      {
        heading: 'Scegliere senza ripensarci ogni volta',
        body: [
          'Per i colleghi che devono solo incastrare orari con te, libero/occupato è quasi sempre la risposta giusta e quasi mai quella scelta.',
          'Tieni i dettagli completi per i calendari nati per essere condivisi, non per quello in cui vivi.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Costo mensile del livello in cui questo si gestisce nell’app, in dollari',
    },
    faq: [
      {
        q: 'Si condivido solo libero/occupato, si vedono i titoli dei miei eventi?',
        a: 'No. Libero/occupato mostra blocchi di tempo senza titoli, luoghi, note o invitati. Solo «tutti i dettagli» li espone, e li espone tutti.',
      },
      {
        q: 'Cosa consente «apportare modifiche e gestire la condivisione»?',
        a: 'Modificare ogni evento e consegnare il tuo calendario ad altre persone senza chiedertelo. È l’unico livello che permette a qualcun altro di distribuire l’accesso.',
      },
      {
        q: 'Posso controllare chi ha già accesso al mio calendario?',
        a: 'Sì, nelle impostazioni di condivisione di quel calendario. Nulla ti invita a guardare e le condivisioni si accumulano soltanto: rileggi l’elenco due volte l’anno.',
      },
    ],
    practical: [
      'Di norma libero/occupato per chi deve solo prenotare del tempo con te.',
      'Tieni «apportare modifiche» per chi pianifica davvero al posto tuo.',
      'Rivedi due volte l’anno chi ha accesso: le condivisioni si accumulano e nulla te lo ricorda.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'what-guests-can-do-to-your-event'],
  },

  'why-a-shared-calendar-does-not-appear': {
    "updated": "2026-10-21",
    "title": "Ti hanno condiviso un calendario e non c’è",
    "short": "Calendario condiviso che non compare",
    "description": "Calendario Google condiviso assente? Controlla account invitato, gruppo, visibilità e tipo di link ricevuto.",
    "lede": "Questa guida è di Arte Soft, sviluppatore di Cloud Calendars. Distingui prima un problema di accesso da un calendario semplicemente nascosto.",
    "commonBelief": "Che accettare un calendario condiviso lo metta sul telefono.",
    "sections": [
      {
        "heading": "Controlla account e gruppo",
        "body": [
          "Confronta il destinatario dell’invito con l’account Google sul telefono e nel browser. Apri il link con l’account corretto. Google permette la condivisione con persone e Gruppi Google. Per l’accesso tramite gruppo, chiedi al responsabile di confermare la tua appartenenza e al proprietario del calendario di verificare il gruppo autorizzato. Una mail inoltrata non concede da sola il permesso."
        ]
      },
      {
        "heading": "Nascosto, assente o limitato?",
        "body": [
          "Apri il menu di Google Calendar su iPhone o iPad. Se il calendario è elencato ma non selezionato, attivalo. Se manca, chiedi al proprietario di verificare l’accesso: una richiesta non è un’approvazione. Le regole aziendali o scolastiche possono limitare la condivisione. Confronta lo stesso account sul Web. Se lì funziona, controlla account collegato e calendari selezionati nell’altra app. L’accesso in sola lettura non consente modifiche."
        ]
      },
      {
        "heading": "Identifica il link",
        "body": [
          "Anche un invito di condivisione contiene un link: non tutti sono abbonamenti ICS. Chiedi se concede accesso a un calendario Google o pubblica un feed in sola lettura. Google richiede un browser su computer per un nuovo abbonamento; aprire un calendario già condiviso via mail è un’altra operazione. Gli aggiornamenti del feed dipendono dal servizio ricevente. Non esiste un’attesa universale: conferma le modifiche urgenti con l’organizzatore."
        ]
      }
    ],
    "claims": {},
    "faq": [
      {
        "q": "Un Gruppo Google può ottenere accesso?",
        "a": "Sì. Verifica gruppo selezionato, appartenenza e restrizioni dell’organizzazione. Una mail del gruppo inoltrata non dimostra l’accesso."
      },
      {
        "q": "Devo eliminare e ricollegare l’account?",
        "a": "Prima controlla identità, permessi e visibilità e confronta il calendario sul Web. Ricollegare non concede permessi mancanti."
      }
    ],
    "practical": [
      "Conferma account invitato e appartenenza al gruppo.",
      "Attiva il calendario se è elencato ma nascosto.",
      "Fai verificare l’accesso prima di cambiare le connessioni."
    ],
    "sourcesHeading": "Fonti e approfondimenti",
    "sources": [
      {
        "label": "Google: Controlla account e gruppo",
        "url": "https://support.google.com/calendar/answer/37082?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Nascosto, assente o limitato?",
        "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Identifica il link",
        "url": "https://support.google.com/calendar/answer/37648?hl=en"
      }
    ],
    "seeAlso": [
      "who-can-see-what-in-google-calendar",
      "google-calendars-that-never-reach-your-iphone"
    ]
  },

  'the-secret-address-of-a-google-calendar': {
    title: 'Cosa rivela davvero l’indirizzo segreto di un calendario Google',
    short: 'L’indirizzo iCal segreto',
    description:
      'Google offre un indirizzo privato che mostra l’intero calendario a chiunque lo abbia. Cosa espone e perché non si ritira in silenzio.',
    lede: 'Nelle impostazioni di ogni calendario Google c’è un link che mostra tutto quello che contiene. Senza accesso, senza permesso, senza traccia di chi l’ha aperto.',
    commonBelief: 'Che un indirizzo privato sia privato perché è difficile da trovare.',
    sections: [
      {
        heading: 'Un link è una password che non puoi cambiare per una sola persona',
        body: [
          'L’indirizzo segreto porta i dettagli completi: titoli, orari, luoghi, note. Chi ha il link li vede, e non esiste un elenco di chi sia.',
          'La sua unica protezione è la parte casuale dell’indirizzo. Contro il tentativo di indovinare protegge sul serio; contro un inoltro, uno schermo condiviso o un documento che sopravvive al posto di lavoro, per nulla.',
        ],
      },
      {
        heading: 'Reimpostarlo lo rompe per tutti',
        body: [
          'Puoi reimpostare l’indirizzo e il vecchio muore. Muore anche per ogni collega, ogni dashboard e ogni script che ci si appoggiava in silenzio, senza il minimo preavviso.',
          'È la ragione per non distribuire mai l’indirizzo del calendario in cui vivi. Pubblica un calendario creato apposta e reimpostarlo non costa nulla.',
        ],
      },
    ],
    claims: {
      linkLength: 'Caratteri casuali che proteggono un nostro link di condivisione',
      sharePrice: 'Quanto costa condividere un evento dall’app',
    },
    faq: [
      {
        q: 'Cosa può fare qualcuno con l’indirizzo segreto del mio calendario?',
        a: 'Vedere tutto ciò che contiene — titoli, orari, luoghi e note — senza accedere, senza permesso e senza lasciare traccia di essere passato.',
      },
      {
        q: 'Posso riprendermi un indirizzo segreto?',
        a: 'Solo reimpostandolo, il che uccide il vecchio per tutti insieme: colleghi, dashboard e qualunque script ci si appoggiasse in silenzio, senza preavviso.',
      },
      {
        q: 'Posso mandare per email l’indirizzo segreto a un collega?',
        a: 'Consideralo pubblico dal momento in cui esce dalle tue mani. La sua unica protezione è essere difficile da indovinare, e un inoltro annulla proprio quello.',
      },
    ],
    practical: [
      'Tratta l’indirizzo segreto come pubblico dal momento in cui esce dalle tue mani.',
      'Non pubblicare mai l’indirizzo del calendario che usi davvero.',
      'Reimpostalo quando qualcuno se ne va, e avvisa chi ne resterà scollegato.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'taking-back-a-calendar-you-shared'],
  },

  'what-guests-can-do-to-your-event': {
    title: 'Cosa possono fare gli invitati a un tuo evento',
    short: 'Permessi degli invitati',
    description:
      'Tre caselle decidono se un invitato può spostare la riunione, invitare estranei o leggere l’intero elenco. Sono attive più spesso di quanto si creda.',
    lede: 'Invitare qualcuno gli dà più di un posto e un orario. In un normale evento Google un invitato di solito vede chi altro è stato chiamato e spesso può aggiungere persone.',
    commonBelief: 'Che un invitato possa solo accettare o rifiutare.',
    sections: [
      {
        heading: 'Le tre caselle',
        body: [
          'Modificare l’evento permette a un invitato di cambiare orario, luogo e titolo per tutti. Raramente desiderato, facilmente lasciato acceso.',
          'Invitare altri gli permette di aggiungere persone che non hai mai incontrato. Vedere l’elenco degli invitati mostra tutti i chiamati e le loro risposte: accettabile in un gruppo di lavoro, imbarazzante con un cliente, sbagliato in qualsiasi cosa somigli a un insieme di clienti distinti.',
        ],
      },
      {
        heading: 'Dove va storto in silenzio',
        body: [
          'Un evento, molti destinatari singoli, elenco visibile: adesso ognuno ha tutti gli altri. Togliere quella casella è la differenza fra una riunione e una rubrica trapelata.',
          'Le impostazioni vivono sull’evento, non sull’account: tornano ai tuoi valori predefiniti ogni volta e vanno pensate sugli eventi che contano, non una volta sola.',
        ],
      },
    ],
    claims: {
      sharePrice: 'Quanto costa inviare un singolo evento dall’app',
    },
    faq: [
      {
        q: 'Gli invitati si vedono tra loro in un invito di Google Calendar?',
        a: 'Per impostazione predefinita di solito sì. «Vedere l’elenco degli invitati» mostra tutti i chiamati e le loro risposte: accettabile in un gruppo di lavoro, imbarazzante con un cliente, sbagliato quando gli invitati sono clienti distinti.',
      },
      {
        q: 'Un invitato può cambiare l’orario della mia riunione?',
        a: 'Se «modificare l’evento» è attivo, sì, e la modifica vale per tutti. Raramente desiderato, facilmente lasciato acceso.',
      },
      {
        q: 'Come impedisco agli invitati di invitare altri?',
        a: 'Togli «invitare altri» sull’evento stesso. Queste impostazioni appartengono all’evento e non all’account, quindi tornano ai tuoi valori predefiniti ogni volta.',
      },
    ],
    practical: [
      'Disattiva «vedere l’elenco degli invitati» per tutto ciò che va a persone che non si conoscono.',
      'Lascia spento «modificare l’evento» a meno che qualcuno pianifichi davvero per te.',
      'Controlla le caselle sull’evento, non nelle impostazioni: è lì che vivono.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'why-a-shared-calendar-does-not-appear'],
  },

  'google-calendars-that-never-reach-your-iphone': {
    title: 'Perché alcuni calendari Google non arrivano mai sull’iPhone',
    short: 'Calendari Google mancanti su iPhone',
    description:
      'Un account Google, più calendari e uno solo sul telefono. L’elenco di sincronizzazione che lo decide e cosa fare invece.',
    lede: 'Il tuo account Google contiene otto calendari. L’iPhone ne mostra due. Non è rotto nulla: qualcosa che non hai mai visto ha scelto per te.',
    commonBelief: 'Che aggiungere un account Google all’iPhone aggiunga i calendari che contiene.',
    sections: [
      {
        heading: 'Un elenco che non ti è mai stato mostrato',
        body: [
          'Google tiene, per dispositivo, un elenco di quali calendari possono sincronizzarsi, e i calendari secondari — quelli condivisi, quelli sottoscritti, quelli creati per un progetto — ne restano spesso fuori.',
          'Quell’elenco non è nelle impostazioni di iOS: vive su una pagina Google a parte. Ecco perché cercare nel posto ovvio non trova nulla di sbagliato e non cambia nulla.',
        ],
      },
      {
        heading: 'L’altra strada',
        body: [
          'Un’app che parla direttamente con Google non usa quell’elenco: mostra ogni calendario che l’account possiede davvero, compresi quelli che il telefono ha lasciato cadere.',
          'Così si avvicinano anche gli account. Una vista che tiene personale, lavoro e condiviso è il punto; se il telefono avrebbe sincronizzato ciascuno smette di essere una domanda.',
        ],
      },
    ],
    claims: {
      accounts: 'Tipi di account che una sola vista tiene insieme',
      price: 'Quanto costa la parte Google',
    },
    faq: [
      {
        q: 'Perché solo alcuni dei miei calendari Google compaiono sull’iPhone?',
        a: 'Google tiene, per dispositivo, un elenco di quali calendari possono sincronizzarsi, e quelli secondari — condivisi, sottoscritti, creati per un progetto — ne restano spesso fuori.',
      },
      {
        q: 'Dov’è l’impostazione di sincronizzazione di Google Calendar per iPhone?',
        a: 'Non nelle impostazioni di iOS. Vive su una pagina Google a parte, ed è per questo che cercare nel posto ovvio non trova nulla e non cambia nulla.',
      },
      {
        q: 'Come vedo tutti i calendari Google sull’iPhone?',
        a: 'Con un’app che interroga Google direttamente invece di passare dall’elenco del dispositivo. Mostra ogni calendario che l’account possiede davvero, compresi quelli lasciati cadere dal telefono.',
      },
    ],
    practical: [
      'Controlla l’elenco di sincronizzazione di Google prima di dare l’account per rotto.',
      'Aspettati che i calendari sottoscritti e condivisi siano esclusi, non inclusi.',
      'Se tieni più di un paio di calendari, leggili con qualcosa che interroghi Google direttamente.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'icloud-google-and-outlook-in-one-view'],
  },

  'taking-back-a-calendar-you-shared': {
    title: 'Riprendersi un calendario che hai condiviso',
    short: 'Togliere l’accesso',
    description:
      'Togliere una persona da un calendario ferma ciò che viene dopo. Quello che non fa è annullare ciò che è già accaduto.',
    lede: 'Chiudere un accesso è un tocco. Decidere se un tocco basti richiede un po’ di più, perché condividere lascia copie.',
    commonBelief: 'Che rimuovere una persona rimuova ciò che ha visto.',
    sections: [
      {
        heading: 'Cosa si ferma e cosa resta',
        body: [
          'Rimuovi una persona e il calendario sparisce dal suo elenco, subito e senza messaggio. Gli eventi futuri non la raggiungono mai.',
          'Ciò che non torna indietro: gli inviti già ricevuti, gli eventi copiati nel suo calendario, tutto ciò che è stato esportato e tutto ciò per cui è circolato un indirizzo segreto. L’accesso finisce; la memoria no.',
        ],
      },
      {
        heading: 'Quello che sopravvive alla rimozione',
        body: [
          'Se qualcuno ha avuto, anche solo una volta, il diritto di gestire la condivisione, può aver aggiunto altre persone. Rimuovere lui le lascia al loro posto: è così che un calendario finisce condiviso con qualcuno che nessuno ricorda di aver invitato.',
          'Leggi quindi l’intero elenco invece di cancellare un nome, e fallo all’uscita, non mesi dopo. Nulla te lo ricorda e le condivisioni si accumulano soltanto.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Costo mensile del livello in cui questo si gestisce, in dollari',
    },
    faq: [
      {
        q: 'Rimuovere una persona cancella ciò che ha già visto?',
        a: 'No. Gli inviti che ha già, gli eventi copiati nel suo calendario e tutto ciò che è stato esportato restano. L’accesso finisce, le copie no.',
      },
      {
        q: 'La persona viene avvisata che le ho tolto l’accesso?',
        a: 'No. Il calendario sparisce dal suo elenco subito e senza messaggio.',
      },
      {
        q: 'Perché il mio calendario è ancora condiviso con qualcuno che non ho mai invitato?',
        a: 'Qualcuno che poteva gestire la condivisione ce l’ha messo. Rimuovere quella persona lascia al loro posto tutte quelle che ha aggiunto: per questo si legge l’intero elenco, non un nome.',
      },
    ],
    practical: [
      'Leggi l’elenco completo degli accessi, non solo il nome che volevi togliere.',
      'Reimposta l’indirizzo segreto se quella persona lo ha mai avuto.',
      'Dai per scontato che le copie sopravvivano: sposta ciò che è davvero delicato invece di nasconderlo.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
