import { LocalisedArticle } from '../types';

export const HELP_IT: Readonly<Record<string, LocalisedArticle>> = {
  "recurring-events-without-the-mess": {
  "updated": "2026-10-21",
  "title": "Eventi ricorrenti: modificare una data o la serie con attenzione",
  "short": "Eventi ricorrenti",
  "description": "Controlla permessi e date interessate prima di modificare un evento ricorrente. Gestisci cambiamenti ed eccezioni senza eliminare la serie.",
  "lede": "Prima di modificare un appuntamento ricorrente, stabilisci esattamente quali date devono cambiare. Poi verifica che l’editor consenta di limitare la modifica a quelle occorrenze. Questa guida è pubblicata da Arte Soft, sviluppatore di Cloud Calendars.",
  "commonBelief": "Ogni editor di calendario chiede se una modifica riguarda una sola occorrenza o l’intera serie.",
  "sections": [
    {
      "heading": "Descrivi la modifica prima di aprire l’editor",
      "body": [
        "“Spostare di un’ora la lezione di martedì prossimo” riguarda una sola occorrenza. “Dal mese prossimo le lezioni saranno il giovedì” cambia il programma futuro. “Correggere la sala per tutte le riunioni” può avere un effetto più ampio. Sono richieste diverse, anche quando partono dalla stessa schermata dei dettagli dell’evento.",
        "Annota la data dell’occorrenza selezionata e le date vicine che devono restare invariate. Un breve elenco prima e dopo facilita il controllo del risultato salvato. Non usare una serie reale per scoprire cosa fa un pulsante Salva che non conosci."
      ]
    },
    {
      "heading": "Controlla il calendario e i tuoi permessi di modifica",
      "body": [
        "Individua il calendario a cui appartiene l’evento e verifica se sei l’organizzatore, una persona con diritti di modifica o un invitato. Vedere una serie condivisa non concede di per sé il permesso di cambiarne gli orari. Google descrive la modifica da parte degli invitati come un’autorizzazione che l’organizzatore può concedere: visualizzare un invito e gestirlo sono capacità diverse.",
        "In Cloud Calendars, verifica che il calendario di destinazione consenta le modifiche. Il fatto che un partecipante possa vedere una riunione non significa che possa cambiare l’invito dell’organizzatore. Se non puoi apportare la modifica desiderata, chiedi all’organizzatore invece di creare un invito concorrente."
      ]
    },
    {
      "heading": "Controlla le occorrenze interessate prima di salvare in Cloud Calendars",
      "body": [
        "L’editor di Cloud Calendars include schemi di ripetizione e un’impostazione per la fine della ripetizione. Questi controlli definiscono un programma; non equivalgono alla scelta delle occorrenze interessate da una modifica. Cambiare un evento ricorrente esistente può influire sulle occorrenze future. Non sostituire un’eccezione per una sola data con una modifica alla regola di ripetizione.",
        "Prima di salvare un’eccezione per una sola data, cerca una scelta esplicita che limiti la modifica a quell’occorrenza. Se l’editor non la offre, usa l’evento originale nell’editor supportato dal servizio a cui appartiene. Poi controlla la data interessata e quelle vicine in entrambi i posti. I calendari locali e i servizi collegati non gestiscono necessariamente le modifiche alle serie nello stesso modo."
      ]
    },
    {
      "heading": "Usa una scelta supportata e verifica alcune date rappresentative",
      "body": [
        "Le istruzioni di Google Calendar per computer indicano di modificare l’evento ricorrente, salvare e scegliere gli eventi della serie a cui applicare l’aggiornamento. Leggi le opzioni effettivamente mostrate per quell’evento senza presumere che tutti i servizi usino le stesse etichette o supportino le stesse modifiche.",
        "La guida di Calendario di Apple per Mac descrive separatamente frequenza, ripetizioni personalizzate e termine della ripetizione. Sono controlli di Calendario di Apple. Qualunque editor supportato tu usi, verifica la data modificata, una data precedente che deve restare invariata e l’occorrenza ordinaria successiva. Per un invito, controlla anche l’evento salvato dall’organizzatore: una modifica alla tua visualizzazione personale non conferma che la riunione sia stata spostata per tutti."
      ]
    },
    {
      "heading": "Preserva le eccezioni e scegli consapevolmente le date di fine",
      "body": [
        "Un appuntamento spostato o una settimana saltata sono motivi per esaminare la serie esistente prima di cambiarne la regola. Annota prima le eccezioni importanti e controllale dopo. Non è corretto promettere che ogni modifica alla serie preservi le eccezioni, né affermare che le cancelli automaticamente: il risultato dipende dall’operazione e dal servizio.",
        "Usa una data finale nota per un corso o una turnazione temporanea quando corrisponde al programma reale. Un compleanno annuale o una riunione continuativa possono ragionevolmente non avere una fine prevista. Non imporre una scadenza arbitraria a ogni ripetizione e non eliminare e ricreare una serie soltanto perché contiene diverse eccezioni."
      ]
    },
    {
      "heading": "Se il risultato è inatteso, conserva gli elementi utili alla verifica",
      "body": [
        "Confronta il servizio a cui appartiene l’evento con Cloud Calendars nella data esatta interessata. Controlla il nome del calendario, l’occorrenza selezionata, lo schema di ripetizione e le eventuali condizioni di fine consultabili. Titoli simili o un appuntamento copiato separatamente possono sembrare un problema di ricorrenza: stabilisci prima quale evento stai guardando.",
        "Se l’evento è corretto nel servizio ma diverso nell’app, segnala le versioni dell’app e di iOS, il tipo di calendario, le occorrenze che volevi modificare e le date interessate. Se anche il servizio ha cambiato più date del previsto, contatta l’organizzatore o l’assistenza del servizio prima di apportare altre modifiche estese. Evita di rimuovere account, annullare inviti o eliminare una serie come tentativi di diagnosi."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Annota le date delle occorrenze da modificare e quelle che devono restare invariate.",
    "Conferma il calendario a cui appartiene l’evento e l’organizzatore o i permessi di modifica.",
    "Per un’eccezione singola, usa un editor che offra esplicitamente questa scelta.",
    "Controlla una data precedente, la data modificata e l’occorrenza ordinaria successiva.",
    "Conserva le eccezioni esistenti e l’invito originale mentre verifichi una discrepanza."
  ],
  "faq": [
    {
      "q": "Ogni modifica a un evento ricorrente chiede quali occorrenze cambiare?",
      "a": "No. Non presumere che Cloud Calendars ti chieda di scegliere le occorrenze interessate. Verifica le opzioni prima di salvare; se la scelta manca, usa un editor supportato dal servizio per un’eccezione relativa a una sola data."
    },
    {
      "q": "Ogni evento ricorrente deve avere una data di fine?",
      "a": "Usa una data di fine quando il programma reale ne prevede una. Gli impegni continuativi non hanno bisogno di una scadenza inventata soltanto per rendere il calendario più ordinato."
    },
    {
      "q": "Cambiare la serie cancellerà le sue eccezioni?",
      "a": "Non esiste una risposta universale per tutti i servizi e tutte le operazioni di modifica. Annota le eccezioni importanti e controllale dopo il cambiamento; non dare per scontate né la conservazione garantita né la perdita automatica."
    }
  ],
  "sourcesHeading": "Indicazioni ufficiali su ricorrenze e permessi di modifica",
  "sources": [
    {
      "label": "Google: creare e modificare un evento ricorrente su computer",
      "url": "https://support.google.com/calendar/answer/37115?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Apple: impostare eventi di un giorno, più giorni o ricorrenti su Mac",
      "url": "https://support.apple.com/guide/calendar/set-up-all-day-multiday-or-repeating-events-icl1018/mac"
    },
    {
      "label": "Google: collaborare in Calendar e consentire agli invitati di modificare gli eventi",
      "url": "https://support.google.com/a/users/answer/13293412?hl=en"
    }
  ],
  "seeAlso": [
    "drag-an-event-to-move-it",
    "what-guests-can-do-to-your-event"
  ]
},

  "disconnect-calendar-integration-without-losing-track": {
  "updated": "2026-10-22",
  "title": "Disconnettere un’integrazione del calendario: accesso, sincronizzazione e copie esistenti",
  "short": "Disconnetti un’integrazione con attenzione",
  "description": "Distingui uscita, accesso del fornitore e copie esistenti. Controlla i collegamenti Cloud Calendars prima di disconnettere o rimuovere un calendario.",
  "lede": "Interrompere un collegamento e rimuoverne le copie del calendario sono decisioni diverse. Identifica il percorso utilizzato e conserva le informazioni necessarie prima di scegliere una disconnessione. Questa guida è pubblicata da Arte Soft, sviluppatore di Cloud Calendars.",
  "commonBelief": "Uscire sospende soltanto gli aggiornamenti, revoca ogni permesso collegato e lascia tutti i dati del calendario esattamente come prima.",
  "sections": [
    {
      "heading": "Identifica il collegamento che vuoi interrompere",
      "body": [
        "Parti dall’account e dal calendario che contengono gli eventi. Un account del fornitore aggiunto nelle impostazioni dell’iPhone, un collegamento diretto in Cloud Calendars, un abbonamento iCalendar e l’identità di condivisione dell’app sono percorsi separati. Lo stesso indirizzo email non rende intercambiabili i loro controlli.",
        "Annota i nomi dei calendari e il percorso che li visualizza, senza condividere dettagli privati. Decidi se vuoi interrompere l’accesso futuro, lasciare una condivisione o rimuovere una copia. Se indaghi un evento mancante o duplicato, disconnettere non è il primo passo diagnostico."
      ]
    },
    {
      "heading": "Controlla cosa rimuove l’uscita dall’app",
      "body": [
        "L’implementazione esaminata tenta di disconnettere il profilo Google selezionato e rimuoverne le copie di calendario associate dall’archivio calendari di iOS. Considerala una rimozione, non una pausa. Può comunque verificarsi un errore di connessione: verifica separatamente lo stato dell’accesso presso il fornitore senza presumere che tutti i permessi siano revocati.",
        "Anche l’uscita dal profilo di calendario Microsoft tenta di rimuovere i calendari associati e i dati locali del collegamento. Non presumere che le copie restino visibili. La loro collocazione può dipendere dalle sorgenti disponibili sul dispositivo: controlla la sorgente e conserva le informazioni necessarie prima di procedere."
      ]
    },
    {
      "heading": "Esamina separatamente l’accesso futuro presso il fornitore",
      "body": [
        "I controlli Google per le app collegate distinguono Accedi con Google dall’accesso ai dati dell’Account Google. Controlla app, account e tipo di collegamento desiderati. Rimuovere l’accesso ai dati e interrompere un collegamento di accesso rispondono a domande diverse; uscire nell’app non prova che ogni connessione sia sparita.",
        "Per gli account Microsoft aziendali o scolastici, Microsoft descrive My Apps > Manage your application per esaminare i permessi. Puoi revocare quelli concessi personalmente, ma quelli concessi dall’amministratore richiedono l’amministratore dell’organizzazione. Sono indicazioni per lavoro o scuola, non una procedura universale per gli account Microsoft personali."
      ]
    },
    {
      "heading": "Distingui l’identità di condivisione dalla sincronizzazione del fornitore",
      "body": [
        "Cloud Calendars ha anche un account per la condivisione. Il codice attuale gestisce l’uscita da questo account separatamente dai profili di calendario: cancella la sessione locale di condivisione e riduce allo stato di lettore gli accessi condivisi tracciati localmente. Questo non significa che tutti i dati sul server siano stati eliminati.",
        "Con più identità di condivisione collegate, disconnetterne una conserva l’account attraverso un’altra identità. Con l’ultima, il percorso attuale chiude la sessione locale e mantiene il collegamento sul server per il recupero. Non usare l’uscita al posto di una richiesta di cancellazione dei dati né presumere che disconnetta ogni fornitore di calendari."
      ]
    },
    {
      "heading": "Gestisci abbonamenti e vecchie copie secondo le rispettive regole",
      "body": [
        "Apple documenta l’annullamento dell’iscrizione a un calendario esterno separatamente dalla scelta dei calendari da mostrare. Se si tratta di un abbonamento in sola lettura, identificalo prima di usare il relativo comando. Nascondere un calendario, annullare l’iscrizione a un feed ed eliminare un calendario modificabile sono operazioni diverse.",
        "Google osserva che rimuovere l’accesso di un’app può richiedere una domanda separata per cancellare i dati già in possesso dello sviluppatore. Un file esportato o la copia di un’altra persona non vengono richiamati cambiando un permesso. Separa il seguito su privacy e conservazione dall’autorizzazione a nuovi aggiornamenti."
      ]
    },
    {
      "heading": "Conferma il risultato prima di altre operazioni di pulizia",
      "body": [
        "Dopo un cambiamento voluto, controlla lo stato del collegamento presso il fornitore e confronta il calendario originale con l’app. Identifica cosa ha smesso di aggiornarsi, cosa è scomparso localmente e cosa resta altrove. Non eliminare eventi simili soltanto perché il nome di una connessione non compare più.",
        "Se il risultato è inatteso, interrompi la pulizia e contatta l’assistenza indicando percorso dell’account, sorgente del calendario e azione usata. Non inviare password, token di accesso, URL privati di feed o schermate di appuntamenti sensibili. Spiega se il calendario originale conserva gli eventi, così da distinguere un problema di connessione da una copia mancante."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifica esattamente account, calendario e percorso di collegamento.",
    "Decidi se vuoi interrompere l’accesso, lasciare una condivisione o rimuovere una copia.",
    "Conserva le informazioni necessarie tramite un percorso verificato di esportazione o backup.",
    "Prima di usarla, leggi cosa rimuove l’azione di uscita o disconnessione installata.",
    "Controlla separatamente i permessi del fornitore; coinvolgi l’amministratore per gli accessi gestiti.",
    "Verifica il risultato presso il fornitore e nell’app prima di altre operazioni di pulizia."
  ],
  "faq": [
    {
      "q": "Uscire da una connessione diretta Cloud Calendars mantiene le copie dei calendari?",
      "a": "Non darlo per scontato. I percorsi Google e Microsoft esaminati tentano di rimuovere i calendari associati dall’archivio iOS. Controlla la sorgente e conserva le informazioni necessarie prima di disconnettere."
    },
    {
      "q": "Rimuovere l’accesso Google di un’app elimina i dati già copiati?",
      "a": "Google dice che può essere necessario chiedere separatamente la cancellazione dei dati già conservati dallo sviluppatore. Considera accesso futuro e dati mantenuti come risultati distinti."
    },
    {
      "q": "Uscire dall’account di condivisione equivale a eliminarlo?",
      "a": "No. Il percorso attuale cancella una sessione locale e conserva il comportamento di recupero; è distinto dall’uscita dai fornitori di calendari e non prova la cancellazione dei dati sul server."
    }
  ],
  "sourcesHeading": "Indicazioni ufficiali su accesso e abbonamenti",
  "sources": [
    {
      "label": "Google: gestire app collegate e diversi tipi di connessione",
      "url": "https://support.google.com/accounts/answer/13533235?hl=en"
    },
    {
      "label": "Google: accesso e dati già conservati da un’app collegata",
      "url": "https://support.google.com/accounts/answer/14012355?hl=en"
    },
    {
      "label": "Microsoft: permessi My Apps per account aziendali o scolastici",
      "url": "https://support.microsoft.com/en-us/accounts-billing/work-school/edit-or-revoke-application-permissions-in-the-my-apps-portal"
    },
    {
      "label": "Apple: selezione dei calendari e abbonamenti su iPhone",
      "url": "https://support.apple.com/guide/iphone/use-multiple-calendars-iph3d1110d4/ios"
    }
  ],
  "seeAlso": [
    "calendar-export-ics-pdf-and-backup",
    "taking-back-a-calendar-you-shared",
    "the-secret-address-of-a-google-calendar",
    "icloud-google-and-outlook-in-one-view",
    "google-calendars-that-never-reach-your-iphone"
  ]
},

  "calendar-notifications-missing-silent-or-duplicated": {
    "updated": "2026-10-21",
    "title": "Notifiche del calendario su iPhone: assenti, silenziose o duplicate?",
    "short": "Risolvere i problemi delle notifiche",
    "description": "Distingui avvisi degli eventi, impostazioni di Cloud Calendars e controlli di iPhone. Verifica promemoria assenti, silenziosi o doppi senza eliminare dati.",
    "lede": "Parti da ciò che è successo: mancava l’evento, non è arrivata la notifica, è apparsa senza suono o ti hanno avvisato due app? Ogni caso richiede un controllo diverso. Questa guida è pubblicata da Arte Soft, sviluppatore di Cloud Calendars.",
    "commonBelief": "Se un evento compare nel calendario, tutti gli avvisi e i permessi per le notifiche devono essere già configurati.",
    "sections": [
      {
        "heading": "Individua prima il tipo di problema",
        "body": [
          "Se manca l’evento stesso, controlla l’account a cui appartiene e il calendario selezionato prima di modificare i suoni. Un avviso non permette di stabilire se l’evento corretto è arrivato nell’app. Per questo problema distinto, consulta la guida alla sincronizzazione.",
          "Se l’evento è visibile ma non compare una notifica, controlla l’avviso salvato ed entrambi i controlli delle notifiche descritti sotto. Se la notifica è silenziosa, concentrati sulle impostazioni di consegna e audio di iPhone. Se ne ricevi più di una, identifica ogni app mittente e ogni avviso configurato prima di rimuovere qualcosa."
        ]
      },
      {
        "heading": "Nessuna notifica: controlla l’evento e l’app",
        "body": [
          "Apri l’evento e controlla l’orario dell’avviso. L’editor di Cloud Calendars include «Alert» e, quando applicabile, «Second Alert», con «None» e opzioni precedenti all’evento. Un secondo avviso può essere voluto. Ricontrolla l’evento salvato dopo una modifica, soprattutto se il provider o i permessi di un calendario condiviso limitano ciò che puoi cambiare.",
          "Nelle impostazioni di Cloud Calendars cerca «Event Notifications». Le impostazioni distinguono anche le notifiche di inviti e meteo: attivarne una non dimostra che siano attivi i normali promemoria degli eventi. Controlla sia «Event Notifications» nell’app sia il permesso per le notifiche in iOS.",
          "Conta anche la selezione del calendario: il funzionamento attuale programma gli avvisi dei calendari selezionati. Verifica che quello interessato sia selezionato. Non presumere che nasconderlo cambi soltanto la visualizzazione in questa app e non eliminare eventi per fermare i promemoria."
        ]
      },
      {
        "heading": "Avviso silenzioso o in ritardo: controlla la consegna su iPhone",
        "body": [
          "Nell’app delle impostazioni di iPhone apri la sezione delle notifiche e scegli Cloud Calendars. Controlla «Allow Notifications», le posizioni disponibili per gli avvisi e i controlli audio. Verifica se «Scheduled Summary» o una modalità «Focus» attiva modifica la consegna. Sono impostazioni di sistema Apple, non il menu «Alert» dell’evento. Le etichette possono variare con la versione di iOS.",
          "Vedere un banner senza suono è diverso dal non trovare alcuna notifica. Annota se è apparso sulla schermata di blocco o nel centro notifiche, se stavi usando il telefono e quale modalità di concentrazione era attiva. Cambia una sola impostazione pertinente alla volta, così il risultato successivo sarà informativo. Il conto alla rovescia di un’Attività in tempo reale è un’altra superficie: vederlo non dimostra che arriverà un promemoria sonoro."
        ]
      },
      {
        "heading": "Due avvisi: identifica i mittenti prima di modificare l’evento",
        "body": [
          "Leggi il nome dell’app su ciascuna notifica. Calendario di Apple, Google Calendar e Cloud Calendars possono inviare notifiche separatamente anche se mostrano eventi collegati. Due notifiche non bastano a dimostrare che esistano due registrazioni dell’evento. Confronta anche gli orari: un promemoria il giorno prima e uno vicino all’inizio possono corrispondere agli avvisi salvati.",
          "La guida di Google spiega che le sue impostazioni delle notifiche sono personali per l’account e che quelle di un evento possono differire dalle impostazioni predefinite del calendario. Le istruzioni riguardano Google Calendar, non le impostazioni di Cloud Calendars. Controlla il mittente pertinente anziché supporre che un interruttore in un’app controlli tutte le altre.",
          "Scegli quale app deve avvisarti, poi modifica solo il promemoria o la preferenza di notifica pertinente. Se rimangono due veri eventi, confronta calendari e titolarità seguendo la guida ai duplicati. Non annullare una riunione reale solo per silenziare un avviso in più."
        ]
      },
      {
        "heading": "Usa un solo evento di prova per circoscrivere il problema",
        "body": [
          "Crea un appuntamento di prova con un nome chiaro in un calendario tuo e modificabile. Imposta l’inizio abbastanza avanti perché anche l’orario dell’avviso scelto sia ancora futuro. Conferma che il calendario sia selezionato, l’avviso sia salvato ed entrambi i controlli delle notifiche siano attivi. Annota l’orario previsto e quale app dovrebbe inviarlo.",
          "Osserva separatamente se compare una notifica e se emette un suono. Ripeti solo dopo aver modificato un’impostazione sospetta. Usa un normale evento di prova senza partecipanti, non una riunione importante o una serie ricorrente. Conserva il risultato con le versioni dell’app e di iOS per confrontarlo in seguito."
        ]
      },
      {
        "heading": "Se il risultato resta incoerente",
        "body": [
          "L’app programma un insieme limitato di avvisi imminenti: non fare affidamento su una coda illimitata di promemoria lontani. Controlla i comandi della versione installata e registra le consegne irregolari. Segnala le versioni dell’app e di iOS, il tipo di calendario, l’anticipo dell’avviso salvato, l’orario previsto e il risultato osservato.",
          "Non includere titoli privati, indirizzi dei partecipanti o link di iscrizione ai calendari in una segnalazione pubblica. Reinstallare, svuotare lo spazio locale o rimuovere account non è il primo passo diagnostico. Mantieni eventi e configurazione degli account mentre l’assistenza indaga."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Classifica il problema: evento mancante, notifica assente, consegna silenziosa o avvisi duplicati.",
      "Controlla l’avviso salvato e il calendario selezionato.",
      "Verifica «Event Notifications» di Cloud Calendars separatamente dal permesso per le notifiche di iPhone.",
      "Per i duplicati, confronta le app mittenti e gli orari degli avvisi configurati.",
      "Usa un solo evento futuro di prova e registra il risultato senza cambiare inviti reali."
    ],
    "faq": [
      {
        "q": "Attivare le notifiche meteo abilita i promemoria degli eventi?",
        "a": "No. L’app distingue le notifiche di eventi, inviti e meteo. Per i normali avvisi degli eventi controlla «Event Notifications» e il permesso iOS."
      },
      {
        "q": "Devo eliminare un evento se arrivano due avvisi?",
        "a": "Identifica prima le app mittenti e gli orari. Più notifiche possono provenire da app diverse o da più avvisi sullo stesso evento. Eliminare non è un modo sicuro di diagnosticarlo."
      },
      {
        "q": "Impostare un avviso ne garantisce la consegna?",
        "a": "No. È solo una parte del processo. Contano anche preferenze dell’app, permessi di sistema e impostazioni di consegna: verifica il risultato sul dispositivo."
      }
    ],
    "sourcesHeading": "Fonti e impostazioni delle notifiche",
    "sources": [
      {
        "label": "Apple: modificare le impostazioni delle notifiche su iPhone",
        "url": "https://support.apple.com/guide/iphone/change-notification-settings-iph7c3d96bab/ios"
      },
      {
        "label": "Google: modificare le notifiche di Google Calendar su iPhone e iPad",
        "url": "https://support.google.com/calendar/answer/37242?hl=en&co=GENIE.Platform%3DiOS"
      }
    ],
    "seeAlso": [
      "what-calendar-sync-actually-does",
      "when-two-calendars-disagree"
    ]
  },
  "find-old-calendar-events-by-account-date-and-title": {
    "updated": "2026-10-21",
    "title": "Trovare un vecchio evento: controlla account, date e campi di ricerca",
    "short": "Trovare eventi passati",
    "description": "Una ricerca vuota non prova che un evento sia stato eliminato. Controlla account, date e campi cercati prima di consultare l’archivio del provider.",
    "lede": "Se ricordi una riunione ma non la trovi, separa tre domande: quale account la conteneva, quali date copre la vista attuale e quali campi confronta la ricerca. Questa guida è pubblicata da Arte Soft, sviluppatore di Cloud Calendars.",
    "commonBelief": "Ogni casella di ricerca di un’app calendario cerca in tutti i campi di ogni evento mai salvato dal provider.",
    "sections": [
      {
        "heading": "Annota l’indizio utile più semplice",
        "body": [
          "Inizia con un mese o anno approssimativo, una parola caratteristica del titolo e l’account probabilmente usato. Tieni separati questi indizi. Il nome di un collega poteva essere tra i partecipanti anziché nel titolo; un indirizzo poteva trovarsi solo nel campo del luogo.",
          "Prova un breve frammento del titolo prima di una frase lunga. Un risultato negativo non indica se il dato manca, è fuori dalle date caricate o si trova in un campo non cercato."
        ]
      },
      {
        "heading": "Controlla l’account di origine e il calendario selezionato",
        "body": [
          "Cerca l’account e il calendario a cui apparteneva l’evento. Un calendario Google di lavoro, uno iCloud personale e uno locale sul dispositivo sono destinazioni diverse, anche se un’app li mostrava insieme. Verifica di avere ancora accesso all’account previsto e che il suo calendario sia selezionato.",
          "Non creare una nuova copia solo perché la ricerca è vuota. Se trovi l’evento navigando alla data approssimativa, controlla titolo, calendario e organizzatore. Avrai così elementi da confrontare con la ricerca senza modificare il dato."
        ]
      },
      {
        "heading": "Controlla date e campi usati dalla ricerca di Cloud Calendars",
        "body": [
          "Cloud Calendars cerca nei titoli degli eventi caricati senza distinguere maiuscole e minuscole. Usa una parola caratteristica del titolo. Non aspettarti che un luogo, l’indirizzo di un partecipante o una nota vengano trovati solo perché compaiono altrove nell’evento.",
          "L’attuale vista di ricerca carica gli eventi dell’anno solare in corso dai calendari selezionati. Una riunione di un anno precedente può quindi non apparire nella ricerca pur esistendo ancora presso il provider. Controlla l’intervallo prima di interpretare un risultato vuoto.",
          "Navigare a una data passata e cercare in un anno passato sono azioni diverse. Per la ricerca storica, usa gli strumenti del provider dove disponibili e verifica lo stesso account. Controlla i comandi della versione installata anziché supporre che la ricerca copra tutti gli anni."
        ]
      },
      {
        "heading": "Usa gli strumenti del provider per i campi e le date documentati",
        "body": [
          "Su Google Calendar da computer, le opzioni consentono di filtrare per calendario, informazioni dell’evento, persone, luogo e intervallo di date. Google consiglia una ricerca avanzata delimitata per data quando non compaiono eventi vecchi e documenta un limite di 200 risultati. Dividi una ricerca ampia in intervalli più piccoli anziché presumere che il primo insieme di risultati sia completo.",
          "Questi sono controlli di Google Calendar sul web, non una descrizione di Cloud Calendars. Analogamente, la guida di Calendario di Apple dice che la sua ricerca su iPhone può trovare titoli, invitati, luoghi e note. Descrive la ricerca propria di Calendario di Apple. Usare EventKit in un’altra app non le conferisce automaticamente la stessa interfaccia o le stesse regole di ricerca."
        ]
      },
      {
        "heading": "Interpreta dove compare l’evento e dove non compare",
        "body": [
          "Presente presso il provider ma assente in Cloud Calendars: controlla identità dell’account, calendario selezionato, date coperte e titolo cercato. Conserva il dato del provider. La domanda successiva riguarda ciò che l’app ha caricato o trovato, non se occorra ricreare l’appuntamento.",
          "Presente navigando per data ma assente dalla ricerca: confronta il titolo effettivo con la query e annota la data. È un indizio utile su un problema di ambito o corrispondenza della ricerca. Non cambiare il titolo di una vecchia riunione solo per far riuscire una prova.",
          "Assente anche presso il provider: conferma account, accesso al calendario e intervallo di date prima di indagare con quel provider su conservazione o eliminazione. Per un calendario locale, il sito di un provider non è una copia indipendente se non hai stabilito un collegamento separato. Non presumere che esista un archivio cloud per ogni evento locale."
        ]
      },
      {
        "heading": "Conserva una traccia utile senza esporre l’evento",
        "body": [
          "Per l’assistenza annota versione dell’app, provider del calendario o tipo di archiviazione locale, anno approssimativo e presenza dell’evento presso il provider o navigando per data. Specifica se la query era una parola del titolo, un luogo o un partecipante. È più utile che dire soltanto che la ricerca non funziona.",
          "Evita di inviare note private, link di invito o URL segreti dei feed di calendario. Mantieni intatti account e dati locali: svuotare lo spazio o importare di nuovo un vecchio file può aggiungere incertezza."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Identifica il probabile account di origine e la data approssimativa.",
      "Controlla che il calendario sia selezionato e accessibile.",
      "Prova una parola caratteristica del titolo.",
      "Distingui la ricerca dell’anno attuale nell’app dalla ricerca nell’archivio del provider.",
      "Usa i filtri per data di Google Calendar sul web o i campi documentati di Calendario di Apple quando pertinenti.",
      "Registra dove compare l’evento prima di modificare dati."
    ],
    "faq": [
      {
        "q": "Un risultato vuoto significa che il vecchio evento è stato eliminato?",
        "a": "No. Un account errato, un calendario non selezionato, una data fuori dall’intervallo caricato o un campo non cercato possono spiegare il risultato vuoto. Controlla il provider e la data approssimativa."
      },
      {
        "q": "Posso cercare in Cloud Calendars l’email di un partecipante o una nota?",
        "a": "La ricerca attuale confronta il testo del titolo degli eventi. Per partecipanti, note o luoghi usa gli strumenti del provider che documentano la ricerca in quei campi."
      },
      {
        "q": "Navigare all’anno scorso fa cercare anche nell’anno scorso?",
        "a": "Non farci affidamento. La vista di ricerca attuale carica l’anno in corso quando si apre. Per i dati storici usa la ricerca per intervallo del provider, senza presumere che l’app cerchi in una cronologia illimitata."
      }
    ],
    "sourcesHeading": "Fonti e assistenza per la ricerca dei provider",
    "sources": [
      {
        "label": "Google: cercare su Google Calendar da computer",
        "url": "https://support.google.com/calendar/answer/37176?hl=en&co=GENIE.Platform%3DDesktop"
      },
      {
        "label": "Apple: cercare eventi in Calendario su iPhone",
        "url": "https://support.apple.com/guide/iphone/search-for-events-iph2c9ef44ad/ios"
      }
    ],
    "seeAlso": [
      "what-calendar-sync-actually-does",
      "a-list-for-people-who-dislike-grids",
      "when-two-calendars-disagree"
    ]
  },
  "calendar-export-ics-pdf-and-backup": {
  "updated": "2026-10-21",
  "title": "Esportare un calendario: file ICS, PDF e iscrizioni",
  "short": "Esportazione e backup dei calendari",
  "description": "Ti serve un file del calendario di un account su iPhone? Scegli ICS, PDF o un’iscrizione e segui la procedura adatta di Google, Mac o Outlook.",
  "lede": "Un calendario su iPhone può mostrare più account. Per ottenere una copia utile, identifica l’origine e decidi se ti servono dati degli eventi, un programma leggibile o aggiornamenti continui.",
  "sections": [
    {
      "heading": "Scegli il risultato prima del formato",
      "body": [
        "Esportare un calendario può indicare lavori diversi. Se vuoi che un’altra app legga i dati degli eventi, scegli un formato strutturato supportato come ICS. Se qualcuno ha bisogno di un programma leggibile, scegli PDF o una pagina stampata. Se deve ricevere modifiche successive, valuta un’iscrizione o la condivisione con permessi.",
        "Un PDF registra l’impaginazione salvata; non è un file per importare eventi. Un ICS scaricato contiene i dati del calendario al momento in cui lo hai ottenuto. Un’iscrizione ICS usa un indirizzo che il client ricontrolla. La sola estensione non dice se il destinatario abbia importato una copia statica o si sia iscritto agli aggiornamenti.",
        "Per esempio, un itinerario del fine settimana in PDF è facile da leggere. Un collega che trasferisce appuntamenti a un altro account ha bisogno dei dati degli eventi. Il socio di un club che segue il programma variabile del prossimo mese ha bisogno di una fonte aggiornata. Decidi quale risultato ti serve prima di inviare qualcosa."
      ]
    },
    {
      "heading": "Parti dall’account che contiene gli eventi",
      "body": [
        "Su iPhone identifica il calendario e l’account che contengono gli eventi necessari. Una vista combinata può comprendere più account, calendari condivisi e iscrizioni. Vederli insieme non significa che ci sia un unico calendario di origine da esportare.",
        "Per Google Calendar usa un computer: Google non offre l’esportazione dalla sua app Calendar. Sul web apri «Settings», poi «Import & export» e «Export». Lo ZIP scaricato contiene singoli file ICS. Per un calendario, apri «Settings and sharing» e scegli «Export calendar». Google richiede il permesso di gestire modifiche e condivisione; un’organizzazione può anche limitare l’esportazione.",
        "Per un calendario disponibile in Calendario sul Mac, seleziona il nome nella barra laterale e usa «File > Export > Export» per salvare un ICS. È una procedura per Mac, non un comando nascosto su iPhone. Verifica di aver selezionato il calendario desiderato prima di salvare."
      ]
    },
    {
      "heading": "Quando serve un programma in PDF",
      "body": [
        "In Calendario sul Mac usa «File > Print» e scegli impaginazione, intervallo di date e calendari da includere. Nella finestra di stampa di macOS usa il menu «PDF» e «Save as PDF». Apri il risultato prima di inviarlo: una griglia piccola può omettere o troncare dettagli importanti per il destinatario.",
        "Indica chiaramente intervallo di date e fuso orario pertinente nel messaggio che accompagna il documento. Controlla appuntamenti privati, note e luoghi prima di condividere. Le modifiche successive al calendario non riscrivono un PDF già inviato: identifica chiaramente una copia aggiornata, così chi la riceve sa quale programma seguire."
      ]
    },
    {
      "heading": "Iscrizione e pubblicazione sono diverse dal backup",
      "body": [
        "Microsoft documenta la differenza per Outlook sul web: scaricare e importare un ICS pubblicato crea una copia senza aggiornamenti successivi; iscriversi al suo indirizzo permette di seguirne i cambiamenti. La frequenza di aggiornamento dipende dal provider del destinatario e il calendario pubblicato è di sola lettura.",
        "Dove disponibile, «Settings > Shared calendars > Publish a calendar» in Outlook consente di scegliere calendario e livello di dettaglio. Pubblicare lo rende accessibile per consultazione o iscrizione: usalo per un pubblico previsto, non come tecnica di backup privato. Un link salvato dipende ancora dalla disponibilità dell’origine."
      ]
    },
    {
      "heading": "Cosa offre la condivisione di Cloud Calendars",
      "body": [
        "Sviluppiamo Cloud Calendars. Il suo flusso di condivisione degli eventi offre App Clip, email e QR per distribuire link di invito. Questi link hanno uno scopo diverso dallo scaricare tutto il calendario come file. Un link può portare a un invito o a un’iscrizione; non è di per sé un archivio portatile di tutti i calendari visibili.",
        "Questa guida non offre una procedura di Cloud Calendars per esportare un intero calendario in ICS, CSV o PDF. Per queste attività usa le procedure documentate del provider o del Mac indicate sopra. Per inviare un singolo evento segui la nostra guida alla condivisione; per un programma condiviso continuativo decidi prima chi deve accedere e se servono aggiornamenti o diritti di modifica."
      ]
    },
    {
      "heading": "Controlla una copia prima di farci affidamento",
      "body": [
        "Conserva il calendario originale mentre controlli l’esportazione. Annota account, nome del calendario e data di esportazione. Se provi un’importazione, usa un calendario di destinazione separato quando possibile, poi confronta un appuntamento normale, un evento di tutto il giorno e una serie ricorrente con un’occorrenza modificata.",
        "Il trasferimento non promette di conservare ogni funzione delle riunioni. Google afferma che gli eventi importati omettono invitati e dati delle conferenze e che le ricorrenze CSV possono diventare singoli eventi non ripetuti. Controlla esplicitamente inviti, link delle riunioni e ricorrenze prima di considerare conclusa la migrazione.",
        "Apple offre anche «File > Export > Calendar Archive» sul Mac, che produce un archivio ICBU. È un’operazione diversa dall’esportazione di un ICS. Apple avverte che importare un archivio sostituisce le informazioni e i dati attuali del calendario: non usare il ripristino di un archivio come una semplice prova di importazione."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifica account e calendario necessari, poi scegli tra copia statica, programma stampabile o iscrizione aggiornata.",
    "Usa la procedura di esportazione documentata e conserva l’originale mentre controlli il risultato.",
    "Controlla destinazione, dettagli sensibili ed eventi rappresentativi prima di inviare o affidarti alla copia."
  ],
  "faq": [
    {
      "q": "Posso esportare Google Calendar direttamente dalla sua app per iPhone?",
      "a": "No. La procedura documentata da Google richiede un computer. Per esportare serve anche il permesso appropriato per gestire la condivisione."
    },
    {
      "q": "Iscrivermi a un indirizzo ICS mi dà un backup?",
      "a": "Un’iscrizione segue un’origine che può cambiare o diventare indisponibile. Salva un’esportazione indipendente se ti serve una copia datata e verifica ciò che il file conserva."
    },
    {
      "q": "Devo scegliere ICS o PDF?",
      "a": "Scegli ICS per dati di eventi importabili da un calendario compatibile. Scegli PDF per un programma leggibile. Un PDF non fornisce aggiornamenti né ricostruisce eventi modificabili tramite le procedure di importazione documentate."
    }
  ],
  "sourcesHeading": "Istruzioni ufficiali e limiti dei formati",
  "sources": [
    {
      "label": "Google: esportare eventi del calendario",
      "url": "https://support.google.com/calendar/answer/37111?hl=en"
    },
    {
      "label": "Google: importare eventi e limiti del trasferimento",
      "url": "https://support.google.com/calendar/answer/37118?hl=en"
    },
    {
      "label": "Apple: esportare file ICS e archivi del calendario su Mac",
      "url": "https://support.apple.com/guide/calendar/import-or-export-calendars-icl1023/mac"
    },
    {
      "label": "Apple: salvare un documento come PDF su Mac",
      "url": "https://support.apple.com/en-gb/guide/mac-help/mchlp1531/mac"
    },
    {
      "label": "Microsoft: pubblicare, importare e iscriversi in Outlook",
      "url": "https://support.microsoft.com/en-us/outlook/share-your-calendar-in-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "sharing-one-event-not-your-calendar",
    "inviting-people-who-do-not-have-the-app",
    "the-secret-address-of-a-google-calendar",
    "disconnect-calendar-integration-without-losing-track"
  ]
}
};
