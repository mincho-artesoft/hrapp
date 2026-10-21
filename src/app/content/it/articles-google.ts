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
  "title": "Indirizzo iCal segreto di Google: sottoscrizione e condivisione sono diverse",
  "short": "L’indirizzo iCal segreto",
  "description": "Distingui indirizzo iCal segreto, account e feed. Gestisci un indirizzo divulgato senza promettere aggiornamenti immediati o cancellazione delle copie.",
  "lede": "Un indirizzo calendario, una connessione account e un invito svolgono funzioni diverse. Identifica quello che hai prima di usarlo in un’altra applicazione. Questa guida è pubblicata da Arte Soft, sviluppatore di Cloud Calendars.",
  "commonBelief": "Un indirizzo segreto sarebbe un invito personale revocabile per un solo destinatario.",
  "sections": [
    {
      "heading": "Scegli la connessione adatta allo scopo",
      "body": [
        "Google distingue l’accesso con account in un’altra app dalla visualizzazione tramite indirizzo iCal segreto. L’account può consentire modifiche; l’indirizzo offre una sottoscrizione in sola lettura. Google lo descrive come destinato all’uso personale e sconsiglia di darlo ad altri.",
        "Visualizzare il proprio programma di lavoro in un calendario compatibile è diverso dal dare accesso continuativo a un collega. Decidi se vuoi leggere il tuo programma, collaborare con una persona specifica o pubblicare un orario per un pubblico. Non scegliere un URL solo perché è facile incollarlo."
      ]
    },
    {
      "heading": "Trova il calendario corretto, non solo l’account",
      "body": [
        "Da computer, Google colloca l’indirizzo segreto in formato iCal nelle impostazioni di integrazione del calendario scelto. Controllane prima il nome. Gli amministratori di lavoro o scuola possono limitare l’opzione: la sua assenza non giustifica rendere pubblico il calendario.",
        "Tieni l’indirizzo fuori da schermate, richieste pubbliche di assistenza e note condivise. Per chiedere aiuto, descrivi tipo di account, nome del calendario e connessione senza fornire l’URL. Di solito va identificato il percorso prima che serva il contenuto degli eventi."
      ]
    },
    {
      "heading": "Verifica cosa ha aggiunto l’app destinataria",
      "body": [
        "Una sottoscrizione segue un feed; un file importato crea una copia separata. Leggi le istruzioni dell’app destinataria e conferma l’azione. Aprire un file calendario scaricato non garantisce che gli appuntamenti seguiranno le modifiche successive.",
        "Confronta nome del calendario, data e dettagli usando un evento ordinario e non riservato che riconosci. Non creare una seconda sottoscrizione per diagnosticare la prima: due copie possono far sembrare un ritardo un conflitto. Nascondi temporaneamente un calendario per identificare l’origine."
      ]
    },
    {
      "heading": "Distingui i link Google da quelli Cloud Calendars",
      "body": [
        "Cloud Calendars ha proprie modalità di condivisione di eventi e calendari, compresi feed di sottoscrizione. Non sono indirizzi segreti Google. Prima di aprire, stabilisci se il mittente ha condiviso un evento, un calendario o un invito basato su account.",
        "Un destinatario Cloud Calendars può essere Reader, Writer o Owner. Il solo indirizzo di un feed non prova diritti di modifica. Ricevere un indirizzo Google di visualizzazione non rende proprietari del calendario. Chiedi al mittente quale sistema usare per le modifiche."
      ]
    },
    {
      "heading": "Considera l’aggiornamento del calendario ricevente",
      "body": [
        "Una sottoscrizione non promette consegna immediata. I feed Cloud Calendars indicano un intervallo suggerito, ma l’app ricevente decide quando recuperare e mostrare gli aggiornamenti. Un vecchio orario su un dispositivo non dimostra che l’organizzatore non abbia salvato la modifica.",
        "Per una riunione in giornata, confronta il programma attuale dell’organizzatore e conferma direttamente le modifiche importanti. Annota calendario e momento del controllo. Non importare ripetutamente l’evento e non eliminare il calendario originale per forzare l’aggiornamento del feed."
      ]
    },
    {
      "heading": "Gestisci la divulgazione senza promettere un richiamo completo",
      "body": [
        "Google documenta la reimpostazione di un indirizzo segreto divulgato: il precedente viene invalidato e sostituito. Identifica le tue app che lo usano per aggiornare le sottoscrizioni. Reimpostare un indirizzo è diverso dal rimuovere un collaboratore specifico.",
        "Appuntamenti salvati, esportazioni e schermate precedenti sono un’altra questione. Cambiare link non dimostra che tutte le copie siano scomparse. Se hai inviato dati al pubblico sbagliato, valuta contenuti e destinatari effettivi: un ripristino riuscito non prova la rimozione completa."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifica connessione account, invito, sottoscrizione o file.",
    "Controlla il calendario proprietario prima di copiare un indirizzo.",
    "Usa l’indirizzo segreto Google solo nelle tue applicazioni compatibili.",
    "Verifica che l’app abbia sottoscritto il feed anziché importato una copia.",
    "Conferma le modifiche urgenti con l’organizzatore senza affidarti ai tempi di aggiornamento.",
    "Se l’indirizzo è stato divulgato, segui la guida Google per reimpostarlo e aggiorna le connessioni volute."
  ],
  "faq": [
    {
      "q": "Posso dare l’indirizzo segreto a un collega?",
      "a": "Google consiglia di conservarlo per le proprie app. Per dare accesso a un’altra persona usa i controlli di condivisione del calendario con il permesso appropriato."
    },
    {
      "q": "Una sottoscrizione permette di modificare l’originale?",
      "a": "L’indirizzo iCal segreto Google serve a visualizzare. Per modificare occorrono connessione account e autorizzazioni adatte; i ruoli Cloud Calendars sono un accordo separato."
    },
    {
      "q": "Reimpostare l’indirizzo elimina i vecchi appuntamenti ovunque?",
      "a": "Invalida il vecchio indirizzo Google. Non dimostra l’eliminazione di file, appuntamenti o schermate salvati indipendentemente."
    }
  ],
  "sourcesHeading": "Indicazioni dei fornitori e approfondimenti",
  "sources": [
    {
      "label": "Google: connessioni account e indirizzi iCal segreti",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    },
    {
      "label": "Google: condividere un calendario",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: importazione, sottoscrizione e tempi di aggiornamento",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "taking-back-a-calendar-you-shared",
    "sharing-one-event-not-your-calendar"
  ],
  "updated": "2026-10-21"
},

  'what-guests-can-do-to-your-event': {
  "title": "Permessi degli invitati Google Calendar: modifiche, inviti e lista ospiti",
  "short": "Permessi degli invitati a un evento",
  "description": "Controlla permessi e valori predefiniti Google. Distingui i diritti sull’invito dall’accesso al calendario e dai ruoli Cloud Calendars.",
  "lede": "La possibilità di rispondere non descrive tutto ciò che un invitato può fare. Controlla i permessi prima di usare un solo invito per colleghi, clienti o pubblico. Questa guida è pubblicata da Arte Soft, sviluppatore di Cloud Calendars.",
  "commonBelief": "Gli invitati potrebbero soltanto accettare o rifiutare e ogni app mostrerebbe gli stessi controlli.",
  "sections": [
    {
      "heading": "Parti dall’organizzatore e dall’evento originale",
      "body": [
        "Apri l’evento corretto in Google Calendar con l’account organizzatore o uno autorizzato a gestirlo. Controlla calendario, data e organizzatore prima di modificare i permessi. Un appuntamento importato separatamente non è il posto affidabile per controllare l’invito originale.",
        "Per una riunione di gruppo, stabilisci chi può spostarla, invitare altri e vedere i partecipanti. Sono decisioni distinte. Chi deve partecipare non deve necessariamente amministrare la riunione."
      ]
    },
    {
      "heading": "Decidi se gli invitati devono modificare la riunione",
      "body": [
        "Google documenta l’opzione di modifica dell’evento tra i permessi degli invitati nell’editor per computer. È un’autorizzazione ampia alla collaborazione, non soltanto un modo per proporre un altro orario. Google include modifica dei campi, visualizzazione degli ospiti e prenotazione delle sale.",
        "Un coorganizzatore fidato di un laboratorio può averne bisogno; un cliente con un appuntamento potrebbe no. Scegli in base alla responsabilità assegnata e verifica l’evento salvato, senza affidarti alla configurazione di un’altra riunione."
      ]
    },
    {
      "heading": "Controlla inviti e visibilità separatamente",
      "body": [
        "Google distingue il permesso di invitare altri da quello di vedere gli altri ospiti. Esamina entrambi insieme alla modifica. Disattivare una possibilità non significa aver controllato l’altra; un valore predefinito mostrato non prova le impostazioni di un evento esistente.",
        "Per clienti non collegati tra loro, valuta se un invito comune sia adatto. Le informazioni già presenti in email, descrizioni o messaggi inoltrati vanno oltre il controllo attuale della lista ospiti. Non inserire dati riservati nella descrizione aspettandoti che nascondere la lista li protegga."
      ]
    },
    {
      "heading": "Verifica valori predefiniti ed eventi importanti",
      "body": [
        "Google documenta anche permessi predefiniti nelle impostazioni degli eventi, compresa la modifica. Non si tratta quindi solo di scelte evento per evento. Rivedi i valori predefiniti quando cambia il tuo modo di organizzare e controlla singolarmente gli inviti importanti già esistenti.",
        "Per una riunione ricorrente, verifica se modifichi un’occorrenza o la serie. Non presumere che una preferenza abbia riscritto vecchi inviti. Prova con un collega su un esempio concordato e non riservato, senza spostare o annullare una vera riunione con un cliente."
      ]
    },
    {
      "heading": "Mantieni distinti i ruoli Cloud Calendars",
      "body": [
        "Cloud Calendars usa ruoli propri: Reader permette visualizzazione e sincronizzazione; Writer permette modifiche; Owner gestisce anche condivisione e accesso con l’identità invitata. Non presentarli come interruttori dei tre permessi Google per gli ospiti.",
        "Quando conta un permesso specifico Google, controlla l’evento originale in Google Calendar. Vedere un partecipante in Cloud Calendars non dimostra che ogni impostazione Google sia modificabile lì. Identifica servizio proprietario e destinatario quando manca un controllo o una modifica non riesce."
      ]
    },
    {
      "heading": "Verifica il risultato e chiarisci le responsabilità",
      "body": [
        "Dopo il salvataggio riapri l’evento originale e controlla le impostazioni. Se opportuno, chiedi a un collega autorizzato di verificare dal proprio account cosa può fare. Non scambiare password o dati privati degli invitati per accelerare la verifica.",
        "Tieni la presenza distinta dai permessi. Poter modificare, possedere una copia importata e avere un’accettazione registrata sono fatti diversi. Una ricevuta di condivisione Cloud Calendars non è un RSVP. Per riunioni importanti chiedi la risposta di presenza necessaria e chiarisci chi gestisce le modifiche."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifica account organizzatore ed evento originale.",
    "Decidi chi gestisce, invita altri e vede gli ospiti.",
    "Controlla i permessi effettivi nell’evento Google.",
    "Rivedi i valori predefiniti senza presumere modifiche agli eventi esistenti.",
    "Considera i ruoli Cloud Calendars un sistema separato.",
    "Riapri l’evento salvato e conferma la presenza separatamente."
  ],
  "faq": [
    {
      "q": "Un invitato può cambiare l’orario della mia riunione?",
      "a": "Google consente di assegnare il permesso di modifica. Controlla l’evento e l’accesso effettivo, senza dedurlo dalla semplice ricezione dell’invito."
    },
    {
      "q": "Tutti i permessi si configurano soltanto su ciascun evento?",
      "a": "No. Google documenta anche permessi predefiniti. Verificali per la programmazione futura e controlla direttamente gli eventi importanti già creati."
    },
    {
      "q": "Nascondere la lista ospiti elimina informazioni già inviate?",
      "a": "Non dimostra la rimozione di email, descrizioni, schermate o copie indipendenti precedenti. Esamina separatamente ciò che è stato davvero distribuito."
    }
  ],
  "sourcesHeading": "Indicazioni dei fornitori e approfondimenti",
  "sources": [
    {
      "label": "Google: collaborazione agli eventi e permessi predefiniti degli invitati",
      "url": "https://support.google.com/a/users/answer/13293412?hl=en"
    },
    {
      "label": "Google: campi dei permessi ospiti negli eventi",
      "url": "https://developers.google.com/workspace/calendar/api/v3/reference/events"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "sharing-one-event-not-your-calendar",
    "why-a-shared-calendar-does-not-appear"
  ],
  "updated": "2026-10-21"
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
  "title": "Interrompere la condivisione di un calendario: controllare ogni accesso",
  "short": "Controllare e revocare gli accessi",
  "description": "Distingui persone, gruppi, accesso pubblico e link ai feed quando interrompi la condivisione. Verifica le modifiche: le copie salvate possono restare.",
  "lede": "Per terminare una collaborazione, identifica come è stato concesso l’accesso. Rimuovere una persona, disattivare la pubblicazione e reimpostare un feed sono azioni diverse. Questa guida è pubblicata da Arte Soft, sviluppatore di Cloud Calendars.",
  "commonBelief": "Rimuovere un destinatario richiamerebbe subito ogni copia e chiuderebbe tutte le altre vie di accesso al calendario.",
  "sections": [
    {
      "heading": "Identifica il calendario e il tipo di condivisione",
      "body": [
        "Prima di modificare l’accesso, verifica account proprietario, calendario e pubblico previsto. Un calendario Google condiviso con un collega specifico è diverso da uno pubblico, da un’autorizzazione di gruppo o da un indirizzo di sottoscrizione. Cloud Calendars ha anche proprie relazioni di condivisione per eventi e calendari.",
        "Per esempio, il segretario di un’associazione può ricevere diritti di modifica tramite un invito personale mentre i membri seguono un programma pubblicato. Rimuovere i suoi diritti non stabilisce cosa debba accadere alle sottoscrizioni dei membri. Elenca gli accordi che hai effettivamente creato."
      ]
    },
    {
      "heading": "Rimuovi l’autorizzazione Google interessata",
      "body": [
        "Google documenta controlli separati per persone o gruppi, condivisione nell’organizzazione e disponibilità pubblica. Da computer, apri le impostazioni di condivisione del calendario corretto e modifica la voce o l’impostazione generale pertinente. Controlla prima account connesso e nome del calendario.",
        "Una persona può avere ancora accesso tramite un gruppo o una pubblicazione più ampia. Esamina l’intera configurazione invece di rimuovere ripetutamente lo stesso indirizzo email. Le regole aziendali o scolastiche possono limitare i controlli: usa la procedura approvata dal proprietario o amministratore quando necessario."
      ]
    },
    {
      "heading": "Gestisci separatamente l’indirizzo segreto del calendario",
      "body": [
        "Google indica che l’indirizzo iCal segreto serve per uso personale in un’altra applicazione e non va consegnato ad altri. Se è stato divulgato, Google documenta come reimpostarlo per invalidare quello precedente. È un’azione diversa dalla rimozione di una persona specifica.",
        "Prima di cambiare un indirizzo di sottoscrizione usato da te, identifica le app e gli strumenti che ne dipendono per poter ricollegare quelli desiderati. Non incollare l’URL segreto in una richiesta pubblica di assistenza né inviarlo come prova di aver trovato il calendario. Indica invece nome e tipo di connessione."
      ]
    },
    {
      "heading": "Distingui i destinatari Cloud Calendars dai link ai feed",
      "body": [
        "In Cloud Calendars, l’accesso dei destinatari a eventi o calendari e un feed di sottoscrizione emesso sono meccanismi distinti. Controlla la relazione di condivisione e il link effettivo prima di agire. Rimuovere un destinatario identificato non garantisce il richiamo di ogni URL già distribuito o copia indipendente.",
        "Se un coorganizzatore deve soltanto smettere di modificare, valuta ruolo e pubblico restante invece di eliminare il programma condiviso. Se termina tutta la collaborazione, chiarisci chi possiede il calendario e chi deve conservarlo. Abbandonare un calendario ricevuto ed eliminare quello di cui sei proprietario sono decisioni diverse."
      ]
    },
    {
      "heading": "Verifica il risultato senza promettere una scomparsa immediata",
      "body": [
        "Controlla che la modifica sia salvata nel sistema proprietario. Se un collega autorizzato può aiutare, verifica ciò che vede o può modificare dal suo account senza scambiare password. Distingui un accesso negato da un vecchio evento ancora visibile in una copia memorizzata o importata.",
        "Non promettere un intervallo universale di aggiornamento o l’assenza di notifiche. Durante un passaggio di consegne, comunica quale programma usare da quel momento. Un vecchio record visibile non rivela da solo se la persona conserva accesso attivo, ha un’altra autorizzazione o una copia autonoma."
      ]
    },
    {
      "heading": "Gestisci le copie precedenti con un seguito separato",
      "body": [
        "File esportati, schermate, messaggi e appuntamenti salvati indipendentemente possono restare dopo le modifiche. Decidi quali copie contano per il passaggio di consegne e concordane la gestione con gli interessati. Cambiare un permesso non permette di stabilire cosa ogni destinatario abbia già salvato.",
        "Conserva i dati originali necessari mentre verifichi il risultato. Non spostare incontri riservati in un altro calendario condiviso solo per far sembrare vuoto quello vecchio e non annullare inviti reali per provare l’accesso. Annota calendario, percorso e modifica come punto di partenza per eventuali verifiche."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifica account proprietario, calendario e modalità di condivisione.",
    "Esamina separatamente persone, gruppi e pubblicazione più ampia.",
    "Usa i controlli di condivisione appropriati di Google o Cloud Calendars.",
    "Valuta separatamente la reimpostazione di un indirizzo segreto divulgato.",
    "Verifica l’accesso salvato senza condividere credenziali.",
    "Gestisci esportazioni e copie precedenti separatamente dall’accesso attivo."
  ],
  "faq": [
    {
      "q": "Rimuovere una persona disattiva il calendario pubblico o il suo accesso di gruppo?",
      "a": "Non darlo per scontato. Controlla ogni percorso effettivo. Google documenta destinatari specifici, gruppi e pubblicazione generale come impostazioni separate."
    },
    {
      "q": "Il calendario scomparirà subito e senza avvisi?",
      "a": "Non esiste una promessa universale su scomparsa, notifiche o tempi di aggiornamento. Conferma la modifica salvata e distingui accesso attivo da informazioni memorizzate o importate."
    },
    {
      "q": "Advanced permette di acquistare la rimozione degli accessi Google?",
      "a": "Advanced rimuove gli annunci in Cloud Calendars. I controlli Google dipendono da proprietà, permessi e regole dell’organizzazione, non da quel piano dell’app."
    }
  ],
  "sourcesHeading": "Indicazioni del fornitore su accesso e sottoscrizioni",
  "sources": [
    {
      "label": "Google: controlli di condivisione e interruzione dell’accesso",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Google: sincronizzazione degli account e indirizzi iCal segreti",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "the-secret-address-of-a-google-calendar",
    "why-a-shared-calendar-does-not-appear"
  ],
  "updated": "2026-10-21"
},
};
