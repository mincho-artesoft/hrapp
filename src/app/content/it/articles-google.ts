import { LocalisedArticle } from '../types';

/** I sei articoli su Google: domande precise, risposte nette. */
export const GOOGLE_IT: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
  "title": "Permessi di Google Calendar: controlla l’accesso effettivamente concesso",
  "short": "Accesso e privacy in Google Calendar",
  "description": "Scegli accesso a disponibilità, dettagli o modifica. Prima di condividere controlla anche accessi pubblici e di gruppo, oltre a quelli individuali.",
  "lede": "Prima di condividere un calendario, decidi cosa deve fare l’altra persona. Organizzarsi in base ai tuoi impegni, leggere i dettagli e gestire il calendario sono attività diverse. Questa guida è pubblicata da Arte Soft, sviluppatore di Cloud Calendars.",
  "commonBelief": "Un permesso limitato per una persona garantirebbe che non possa vedere dettagli attraverso altri percorsi.",
  "sections": [
    {
      "heading": "Adatta l’accesso al compito",
      "body": [
        "Un collega che cerca un orario può aver bisogno della disponibilità senza dettagli. Un collaboratore che mantiene il programma di un progetto richiede un’altra configurazione. Decidi il compito, poi esamina il permesso nelle impostazioni attuali di condivisione del calendario.",
        "Google distingue disponibilità, dettagli e più livelli di modifica. Un’opzione limita l’accesso agli eventi privati; un’altra permette modifica e dettagli, mentre la più ampia consente anche di amministrare la condivisione. Non considerare equivalenti tutte le opzioni che parlano di modifiche."
      ]
    },
    {
      "heading": "Controlla l’accesso generale oltre alla singola persona",
      "body": [
        "Verifica se il calendario è pubblico, disponibile all’organizzazione o condiviso tramite un gruppo, oltre alle persone indicate. Google spiega che un accesso più ampio può prevalere su uno ristretto: limitare una persona non ritira dettagli già resi pubblici.",
        "Pensa al programma di un club pubblicato per i soci. Prima di inserirvi un appuntamento personale, controlla il pubblico del calendario anziché supporre che conti soltanto il permesso accanto a un amico. Conserva gli appuntamenti privati in una destinazione appropriata."
      ]
    },
    {
      "heading": "Usa le impostazioni Google del calendario esatto",
      "body": [
        "In Google Calendar da computer trova il calendario tra i tuoi, apri il suo menu e le impostazioni di condivisione. Google documenta aree separate per persone o gruppi e per accessi più ampi. Controlla nome del calendario e account connesso prima di cambiare qualcosa.",
        "Conferma l’identità Google prevista del destinatario quando lo inviti. Se non trova il calendario, verifica indirizzo e messaggio d’invito anziché allargare l’accesso per farlo apparire. Un calendario non visualizzato e permessi di modifica insufficienti sono problemi diversi."
      ]
    },
    {
      "heading": "Prova senza appuntamenti privati",
      "body": [
        "Usa un normale appuntamento di prova senza titolo privato, note, luogo o lista degli ospiti. Chiedi al destinatario di confermare ciò che vede e, solo quando modificare è necessario e consentito, ciò che può cambiare. Non distribuire le credenziali dell’account per eseguire la verifica.",
        "Registra calendario e ruolo concesso, poi controlla il risultato dopo la modifica dell’impostazione. Questo verifica l’accordo previsto, ma non prova che informazioni già lette o copiate siano scomparse. Evita prove che pubblicano un vero programma di lavoro."
      ]
    },
    {
      "heading": "Separa politiche di lavoro e piani dell’app",
      "body": [
        "Google precisa che gli amministratori di lavoro o scuola possono limitare i controlli di condivisione. Se manca l’impostazione richiesta, usa il percorso approvato dall’organizzazione. Non pubblicare informazioni di lavoro per aggirare una restrizione dell’account.",
        "Cloud Calendars può mostrare calendari collegati, ma i nomi dei suoi piani non ridefiniscono i permessi Google. Advanced rimuove gli annunci: non è un pagamento che dia ad altri accesso a ogni evento Google. Controlla la condivisione del provider e il risultato accettato, senza basarti soltanto su un editor locale disponibile."
      ]
    },
    {
      "heading": "Rivedi e rimuovi gli accessi non più necessari",
      "body": [
        "Quando finisce un progetto, rivedi destinatari effettivi, gruppi ed eventuali pubblicazioni più ampie. Rimuovere una persona è solo parte del controllo se esistono altre vie. Concorda chi mantiene il programma e come gestire futuri cambiamenti di accesso.",
        "Google documenta separatamente la rimozione di persone o gruppi e la disattivazione di condivisioni più ampie. Revocare l’accesso non recupera file esportati, schermate o informazioni già copiate altrove. Affronta queste copie separatamente con gli interessati, senza promettere che un interruttore cancelli tutte le copie precedenti."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifica calendario e compito del destinatario.",
    "Controlla accessi individuali, di gruppo, dell’organizzazione e pubblici.",
    "Scegli il permesso adatto nelle impostazioni Google attuali.",
    "Verifica l’identità prima di cambiare l’accesso.",
    "Controlla un evento di prova innocuo dal lato del destinatario.",
    "Rivedi accessi obsoleti senza presumere di recuperare le copie precedenti."
  ],
  "faq": [
    {
      "q": "Un permesso individuale ristretto prevale su un calendario pubblico?",
      "a": "No. Google documenta che i permessi più ampi hanno priorità quando le impostazioni sono in conflitto. Controlla accessi pubblici e dell’organizzazione oltre alla voce della persona."
    },
    {
      "q": "Tutti i permessi di modifica espongono allo stesso modo gli eventi privati?",
      "a": "No. Google documenta un’opzione che limita l’accesso agli eventi privati separatamente da altre opzioni di modifica e gestione della condivisione. Leggi il permesso attuale esatto prima di sceglierlo."
    },
    {
      "q": "Acquistare Advanced cambia i diritti di condivisione Google?",
      "a": "No. Advanced rimuove gli annunci in Cloud Calendars. L’accesso del provider dipende dai permessi del calendario e dalle restrizioni dell’organizzazione."
    }
  ],
  "sourcesHeading": "Indicazioni Google attuali su permessi e condivisione",
  "sources": [
    {
      "label": "Google: scegliere i permessi del calendario",
      "url": "https://support.google.com/calendar/answer/15716974?hl=en"
    },
    {
      "label": "Google: condividere un calendario e rimuovere l’accesso",
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
