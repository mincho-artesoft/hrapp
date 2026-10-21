import { LocalisedArticle } from '../types';

/**
 * Gli articoli in italiano.
 *
 * Dodici dei quaranta, scelti per la domanda a cui rispondono in
 * ai-visibility/prompts.json e non per quanto fossero facili da tradurre. I
 * numeri non stanno qui: vivono una volta sola in article-facts.ts e si uniscono
 * al testo per identificativo al momento del rendering, così una traduzione può
 * riscrivere ogni frase senza toccare un numero.
 */
export const ARTICLES_IT: Readonly<Record<string, LocalisedArticle>> = {
  'weather-inside-your-calendar': {
  "title": "Un calendario che contiene già il meteo",
  "short": "Il meteo dentro il calendario",
  "description": "Perché controllare due app per organizzare una giornata è un difetto di progetto, e com'è fatto un calendario in cui le previsioni fanno parte della vista invece di stare accanto.",
  "lede": "Quasi tutti organizzano la giornata fra due app. Il calendario dice dove bisogna essere; il meteo dice che tempo farà quando ci si arriva. Tenere insieme le due cose è la parte che nessuno si accorge di fare, finché un sabato non va storto.",
  "commonBelief": "Che un calendario serva agli impegni e un'app meteo al tempo, e che tenerli separati sia semplicemente come funzionano i telefoni.",
  "sections": [
    {
      "heading": "Il costo di due app non sono due tocchi",
      "body": [
        "Cambiare app non costa nulla. Quello che costa è che le due non si mettono mai d'accordo su cosa conta. Il calendario sa che sabato ci sono due ore occupate alle undici; il meteo sa che piove dalle dieci all'una. Nessuna delle due sa che questi due fatti insieme significano spostare il blocco.",
        "Il livello di integrazione siete voi. Funziona finché non siete occupati, che è esattamente il momento in cui proteggere i piani vale di più."
      ]
    },
    {
      "heading": "Le previsioni disponibili",
      "body": [
        "Cloud Calendars usa le previsioni disponibili per il luogo selezionato. I dati orari e giornalieri possono coprire periodi diversi.",
        "Le date consultabili nel calendario non determinano la durata delle previsioni. La vista mensile non implica previsioni per tutto il mese o per ogni evento."
      ]
    }
  ],
  "claims": {
    "price": "Quanto costano le funzioni meteo"
  },
  "practical": [
    "Controlla luogo, data e ore disponibili prima di usare le previsioni per pianificare."
  ],
  "seeAlso": [
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather"
  ],
  "updated": "2026-10-21"
},

  'forecast-beside-every-event': {
  "title": "Confronta un appuntamento con le previsioni meteo orarie",
  "short": "Il meteo nelle ore del tuo appuntamento",
  "description": "Verifica luogo, data e ore di previsione disponibili per l’appuntamento. Controlla la bozza prima di salvare un piano basato sul meteo.",
  "lede": "Per confrontare il meteo con un appuntamento, fai coincidere tre elementi: luogo selezionato, data delle previsioni e ore occupate dal programma. Un’icona meteo vicina non dimostra che coincidano. Questa guida è pubblicata da Arte Soft, sviluppatore di Cloud Calendars.",
  "commonBelief": "Un’icona meteo giornaliera nel calendario sarebbe la stessa funzione di una previsione associata a un evento.",
  "sections": [
    {
      "heading": "Parti da luogo e data",
      "body": [
        "Apri le previsioni per il luogo previsto e confrontane la data con la voce del calendario. Il meteo nel calendario può riferirsi al luogo selezionato per le previsioni: verifica che sia adatto all’appuntamento, senza presumere che lo determini l’indirizzo dell’evento.",
        "Un appuntamento del mese prossimo può esistere prima che siano disponibili i dati meteo per quella data. Mantienilo e ricontrolla le previsioni più vicino al giorno previsto: l’assenza di una voce meteo non è una previsione di bel tempo."
      ]
    },
    {
      "heading": "Usa i dettagli orari per una domanda sulle ore",
      "body": [
        "Un riepilogo giornaliero e una previsione oraria rispondono a domande diverse. Se l’appuntamento dura dalle due alle cinque, controlla le ore disponibili di quell’intervallo anziché considerare una sola icona giornaliera come il quadro completo.",
        "Se è disponibile soltanto una parte dell’intervallo, lascia irrisolto il resto. L’app non promette un meteo orario completo per ogni evento che puoi creare. Questa guida non promette neppure che aprire qualsiasi evento mostri sempre tutta la sua finestra meteorologica."
      ]
    },
    {
      "heading": "Distingui probabilità, quantità e momento",
      "body": [
        "Leggi l’etichetta del valore che stai controllando. La probabilità di precipitazioni non è la quantità né la durata della pioggia. Allo stesso modo, un valore orario e un riepilogo giornaliero coprono periodi diversi: confronta periodi equivalenti quando valuti due possibili orari.",
        "Scegli un’alternativa adatta al tuo programma anziché usare una percentuale come regola universale per procedere o annullare. Le informazioni meteo possono cambiare: ricontrollale quando devi decidere."
      ]
    },
    {
      "heading": "Controlla l’appuntamento basato sul meteo prima di salvarlo",
      "body": [
        "L’app può avviare una bozza di evento da un’ora delle previsioni. Controlla data, inizio, fine e calendario di destinazione prima di salvare. Selezionare una previsione non sostituisce la verifica che tu stia creando l’impegno giusto.",
        "Se l’accesso al calendario o il calendario di destinazione impedisce il salvataggio, risolvi quel permesso separatamente dall’accesso al meteo. Trovare una previsione non conferisce diritti di modifica su un calendario condiviso."
      ]
    },
    {
      "heading": "Usa la previsione completa quando il riepilogo non basta",
      "body": [
        "Per un’attività all’aperto controlla le variabili pertinenti e il luogo effettivamente selezionato. Un widget del meteo attuale o una demo nella pagina iniziale non sostituisce la verifica delle ore di previsione disponibili nell’app.",
        "Se noti una discrepanza, confronta prima luogo e data e ora dei dati. Provider, luoghi selezionati e periodi di previsione diversi possono produrre visualizzazioni diverse senza dimostrare che l’evento del calendario sia cambiato."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Conferma luogo e data dell’evento.",
    "Controlla le ore disponibili per tutta l’attività.",
    "Leggi probabilità e quantità come valori distinti.",
    "Controlla la bozza dell’evento prima di salvare."
  ],
  "seeAlso": [
    "weather-inside-your-calendar",
    "planning-outdoors-without-being-rained-on"
  ],
  "updated": "2026-10-21",
  "faq": [
    {
      "q": "Ogni evento ha una previsione completa?",
      "a": "No. La copertura dipende dal luogo selezionato e dalle date e ore disponibili."
    },
    {
      "q": "L’icona meteo si riferisce all’indirizzo dell’evento?",
      "a": "Non dedurlo dalla vicinanza all’evento. Conferma separatamente il luogo delle previsioni."
    },
    {
      "q": "Toccare un’ora salva un nuovo appuntamento?",
      "a": "Dove disponibile, avvia una bozza di evento. Controlla data, ora e calendario prima di salvare."
    }
  ],
  "sourcesHeading": "Fonti meteo e impostazioni di localizzazione",
  "sources": [
    {
      "label": "Apple: previsioni WeatherKit e disponibilità regionale",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Apple: privacy e servizi di localizzazione",
      "url": "https://support.apple.com/en-us/102515"
    }
  ]
},

  'planning-outdoors-without-being-rained-on': {
  "title": "Organizzare attività all’aperto senza finire sotto la pioggia",
  "short": "Pianificare all’aperto",
  "description": "Un metodo pratico per organizzare attività all’aperto con il calendario che usi già, senza aggiungere una routine meteo separata.",
  "lede": "Se i tuoi hobby si svolgono all’aperto, probabilmente hai un rituale: controllare il meteo, scrutare la settimana, tirare a indovinare. Quest’ultimo passaggio può lasciare spazio a un confronto ragionato. Questa guida è pubblicata da Arte Soft, sviluppatore di Cloud Calendars.",
  "commonBelief": "Evitare il maltempo significherebbe controllare più spesso le previsioni.",
  "sections": [
    {
      "heading": "Parti dal luogo e dalla decisione",
      "body": [
        "Scegli il luogo meteo corrispondente all’attività, poi verifica se data e ore pertinenti sono disponibili. Decidi cosa ti serve sapere: se scegliere un altro orario, tenere pronta un’alternativa o rimandare la decisione.",
        "Ricontrollare non cambia il tempo, ma le informazioni aggiornate possono contare. Non esiste un’unica frequenza di controllo adatta a ogni programma all’aperto."
      ]
    },
    {
      "heading": "Confronta gli orari disponibili senza promettere il risultato",
      "body": [
        "Confronta le informazioni orarie pertinenti per ogni periodo possibile. Un’icona giornaliera è un riepilogo, non una garanzia delle condizioni per tutta la giornata.",
        "Spostare un’attività di un’ora può aiutare oppure no. Non dedurre un intervallo asciutto che le previsioni non mostrano e non applicare una soglia percentuale universale a ogni attività."
      ]
    },
    {
      "heading": "Prepara un’alternativa prima di modificare gli inviti",
      "body": [
        "Se l’attività richiede condizioni adatte, tieni pronta un’alternativa realistica e decidi quando controllare le informazioni più recenti. Consulta le indicazioni ufficiali locali dove pertinenti.",
        "Per un appuntamento condiviso, conferma organizzatore e diritti di modifica prima di spostarlo. Una previsione apparentemente migliore non autorizza da sola a cambiare il programma di tutti."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Conferma il luogo delle previsioni e le date e ore disponibili.",
    "Confronta gli orari possibili usando i fattori meteo pertinenti per l’attività.",
    "Mantieni un piano alternativo e ricontrolla prima che la decisione conti.",
    "Consulta le indicazioni ufficiali locali se le condizioni possono rendere pericolosa l’attività."
  ],
  "seeAlso": [
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather"
  ],
  "updated": "2026-10-21",
  "faq": [
    {
      "q": "Spostare l’evento garantisce tempo asciutto?",
      "a": "No. Confronta i periodi di previsione disponibili e tieni pronta un’alternativa realistica."
    },
    {
      "q": "Basta controllare l’icona giornaliera?",
      "a": "Per un’attività a un’ora precisa, controlla le ore disponibili per tutta la durata e conferma il luogo."
    },
    {
      "q": "Posso spostare un evento condiviso solo perché un altro orario sembra migliore?",
      "a": "Conferma responsabilità dell’organizzatore, diritti di modifica e partecipanti prima di cambiare il loro programma."
    }
  ],
  "sources": [
    {
      "label": "Apple: dati di previsione WeatherKit e disponibilità regionale",
      "url": "https://developer.apple.com/weatherkit/"
    }
  ]
},

  'a-fourteen-day-view-of-the-weather': {
  "title": "Le previsioni disponibili",
  "short": "Le previsioni disponibili",
  "description": "Cloud Calendars usa le previsioni disponibili per il luogo selezionato. I dati orari e giornalieri possono coprire periodi diversi.",
  "lede": "Le date consultabili nel calendario non determinano la durata delle previsioni. La vista mensile non implica previsioni per tutto il mese o per ogni evento.",
  "sections": [
    {
      "heading": "Le previsioni disponibili",
      "body": [
        "Cloud Calendars usa le previsioni disponibili per il luogo selezionato. I dati orari e giornalieri possono coprire periodi diversi.",
        "Le date consultabili nel calendario non determinano la durata delle previsioni. La vista mensile non implica previsioni per tutto il mese o per ogni evento."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Controlla luogo, data e ore disponibili prima di usare le previsioni per pianificare."
  ],
  "seeAlso": [
    "weather-inside-your-calendar",
    "planning-outdoors-without-being-rained-on"
  ],
  "updated": "2026-10-21",
  "sources": [
    {
      "label": "Apple WeatherKit",
      "url": "https://developer.apple.com/weatherkit/"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google e Outlook in una sola vista',
    short: 'Tre account, una vista',
    description:
      'La vita di quasi tutti è divisa fra un calendario personale Apple, un account Google e un Exchange di lavoro. Cosa cambia a metterli nella stessa griglia.',
    lede: 'Il problema quasi mai è che uno di quei calendari sia fatto male. È che ne avete tre e una sola settimana.',
    commonBelief:
      'Che tenere lavoro e vita privata in app separate sia un confine e non un difetto.',
    sections: [
      {
        heading: 'Il doppio impegno è strutturale',
        body: [
          'Se i vostri impegni vivono in tre posti, nessun posto può dirvi se siete liberi. Il passaggio di fusione siete voi, e lo eseguite a memoria, di solito mentre qualcuno aspetta una risposta.',
          'Per questo il fallimento classico non è dimenticare un evento; è accettare qualcosa che va a sbattere contro un evento che non potevate vedere.',
        ],
      },
      {
        heading: 'Cosa dà una griglia sola',
        body: [
          'Tutti gli account nella stessa settimana, colorati per provenienza, modificabili sul posto. Smettete di chiedervi quale app abbia la risposta, perché la domanda smette di essere al plurale.',
          "La separazione che la gente vuole davvero è visiva, non strutturale. Vedere il lavoro di un colore e la famiglia di un altro dà il confine senza rinunciare alla visione d'insieme.",
        ],
      },
      {
        heading: 'Dove cadono i piani',
        body: [
          'iCloud e Google si sincronizzano nel piano gratuito. Gli account Microsoft — Outlook ed Exchange — stanno nel piano a pagamento, perché quella connessione ha un costo ricorrente che le altre non hanno.',
          'Se il vostro calendario di lavoro è su Google, non dovrete mai pagare per sincronizzare.',
        ],
      },
    ],
    claims: {
      accounts: 'Tipi di account che possono condividere una vista',
      premiumMonthly: 'Costo mensile per aggiungere Microsoft, in dollari',
    },
    practical: [
      "Aggiungete prima l'account personale, poi quello che provoca le collisioni.",
      "Colorate per account e non per categoria: la provenienza è ciò che serve a colpo d'occhio.",
      'Continuate a scrivere nel calendario che gli altri già leggono.',
    ],
    seeAlso: ['three-calendar-apps-is-two-too-many', 'free-google-sync-without-adverts'],
  },

  'three-calendar-apps-is-two-too-many': {
    title: 'Tre app di calendario sono due di troppo',
    short: 'Tre app, due di troppo',
    description:
      "Passare da un'app di calendario all'altra non è un metodo di lavoro, è una tassa. Quanto costa e com'è fatto toglierla.",
    lede: 'Nessuno ha scelto di avere tre app di calendario. È successo un account alla volta, e ogni aggiunta sembrava ragionevole.',
    commonBelief: "Che cambiare app sia un fastidio minore e non l'origine del problema vero.",
    sections: [
      {
        heading: 'Il costo non sono i tocchi',
        body: [
          'Due secondi per cambiare non sono niente. Quello che costa è rispondere a domande di agenda con informazione parziale, perché controllare tutte e tre ogni volta è più fatica di quanta la domanda sembri meritarne.',
          'Così rispondete da quella che avete aperta e correggete dopo. La correzione è la parte cara, e per giunta atterra nel calendario di qualcun altro.',
        ],
      },
      {
        heading: 'Cosa deve essere vero',
        body: [
          "Un posto deve poter dire sì o no sul vostro tempo. È tutto il requisito, e non lo soddisfa nessuna sistemazione in cui la risposta viva in più di un'app.",
          'Tutto il resto — quale app, quali colori, quali viste — è gusto. Questo è struttura.',
        ],
      },
    ],
    claims: {
      accounts: 'Tipi di account che una vista sola può contenere',
    },
    practical: [
      "Scegliete l'app che tiene tutti i vostri account, non quella che vi piace di più da sola.",
      'Migrate aggiungendo account, non spostando eventi: gli eventi restano dove sono.',
      'Cancellate le altre app quando la vista è completa, altrimenti continuerete a sbirciarci.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view'],
  },

  'the-widget-that-shows-what-is-next': {
  "updated": "2026-10-21",
  "title": "I prossimi appuntamenti sulla schermata Home di iPhone",
  "short": "Prossimi appuntamenti nel widget",
  "description": "Scegli un widget con eventi e controlla i calendari selezionati e gli appuntamenti mancanti. Una lista vuota non dimostra che l’agenda sia libera.",
  "lede": "Per vedere il prossimo appuntamento, scegli un widget che elenchi gli eventi. Una scheda con data e meteo risponde a una domanda diversa. Questa guida è pubblicata da Arte Soft, sviluppatore di Cloud Calendars.",
  "sections": [
    {
      "heading": "Scegli prima la disposizione con eventi",
      "body": [
        "«Calendar Events» è la disposizione media con l’elenco degli appuntamenti. «Calendar Events Large» offre più spazio. «Calendar & Weather» è una disposizione separata per data e meteo: il formato piccolo non promette il prossimo evento. I nomi possono essere tradotti sul dispositivo.",
        "Tieni premuta un’area vuota della schermata Home e apri la galleria dei widget dalle opzioni di modifica. Cerca Cloud Calendars e confronta l’anteprima prima di aggiungerlo. Questa galleria di iPhone è separata dalle viste del calendario nell’app."
      ]
    },
    {
      "heading": "Quali eventi sono considerati prossimi",
      "body": [
        "L’elenco usa i calendari selezionati e gli appuntamenti con un orario di inizio futuro. Esclude gli eventi di tutto il giorno e quelli già iniziati. Un compleanno o una riunione in corso possono quindi essere presenti nell’app ma non nel widget.",
        "Se oggi hai solo un viaggio segnato per tutto il giorno, una lista vuota non indica che sia andato perso. Apri la giornata completa. Leggi anche la data della prossima voce: potrebbe essere domani o più avanti."
      ]
    },
    {
      "heading": "Confronta prima con l’app",
      "body": [
        "Trova un appuntamento futuro preciso in Cloud Calendars. Controlla il calendario a cui appartiene, che sia selezionato e che l’app abbia l’accesso necessario. Confronta titolo, data e inizio. Se manca anche nell’app, verifica prima account e sincronizzazione.",
        "Per una prova semplice, crea un appuntamento senza invitati in un calendario tuo, con un titolo riconoscibile e un inizio futuro. Non modificare un invito reale e non rimuovere account per provare il widget."
      ]
    },
    {
      "heading": "Non presumere un aggiornamento immediato",
      "body": [
        "I widget mostrano informazioni salvate e non funzionano continuamente come un’app aperta. iOS decide quando aggiornarli. Aprire l’app e controllare l’evento offre un riferimento, ma non garantisce un intervallo preciso prima che cambi il widget.",
        "Se l’app resta corretta e il widget no, annota disposizione, calendario, orario e versioni dell’app e di iOS. Una lista vuota, un appuntamento vecchio e un orario sbagliato sono problemi diversi."
      ]
    },
    {
      "heading": "Leggi il meteo come un riepilogo separato",
      "body": [
        "Il meteo accanto alla data non è una previsione per il luogo e l’ora di ciascun appuntamento. Prima di un’attività all’aperto, controlla la località e la fascia oraria corrette nella vista meteo.",
        "Usa il widget per orientarti rapidamente e il calendario completo per gli eventi di tutto il giorno, i dettagli e le decisioni che richiedono l’intera agenda."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Scegli una disposizione con elenco eventi.",
    "Verifica un appuntamento futuro in un calendario selezionato.",
    "Confronta data e ora con l’app.",
    "Documenta le differenze persistenti senza cancellare dati."
  ],
  "faq": [
    {
      "q": "Perché manca il mio compleanno?",
      "a": "L’elenco esclude gli eventi di tutto il giorno. Controlla il calendario completo."
    },
    {
      "q": "Il widget piccolo mostra la prossima riunione?",
      "a": "Il formato piccolo di «Calendar & Weather» mostra data e meteo. Per gli appuntamenti scegli un elenco eventi."
    },
    {
      "q": "Una lista vuota significa che oggi sono libero?",
      "a": "No. Possono mancare eventi di tutto il giorno, riunioni in corso, calendari non selezionati o aggiornamenti recenti."
    }
  ],
  "sourcesHeading": "Fonti e istruzioni Apple",
  "sources": [
    {
      "label": "Apple: aggiungere e modificare widget su iPhone",
      "url": "https://support.apple.com/118610"
    },
    {
      "label": "Apple: mantenere aggiornato un widget",
      "url": "https://developer.apple.com/documentation/widgetkit/keeping-a-widget-up-to-date"
    }
  ],
  "seeAlso": [
    "a-countdown-to-your-next-meeting"
  ]
},

  'a-countdown-to-your-next-meeting': {
  "updated": "2026-10-21",
  "title": "Un conto alla rovescia che affianca i promemoria",
  "short": "Conto alla rovescia per il prossimo evento",
  "description": "Usa l’attività in tempo reale per un appuntamento futuro, verifica gli orari modificati e mantieni gli avvisi separati dal conto alla rovescia.",
  "lede": "Un conto alla rovescia aiuta a valutare il tempo disponibile. Per essere utile deve però mostrare l’appuntamento corretto e l’orario di inizio aggiornato. Questa guida è pubblicata da Arte Soft, sviluppatore di Cloud Calendars.",
  "sections": [
    {
      "heading": "Parti da un appuntamento confermato",
      "body": [
        "Apri l’evento in Cloud Calendars e controlla data, inizio e calendario selezionato. L’attività segue appuntamenti futuri con un orario; non misura eventi di tutto il giorno né il tempo rimasto in una riunione già iniziata.",
        "Avviala con «Live», quando disponibile; durante il funzionamento il comando diventa «Stop». Se non è disponibile, controlla nelle impostazioni di iPhone se le attività in tempo reale sono consentite per l’app. Etichette e disponibilità possono variare."
      ]
    },
    {
      "heading": "Distingui le due superfici",
      "body": [
        "L’attività può mostrare il prossimo evento sulla schermata di blocco. Sugli iPhone compatibili dispone anche di una presentazione nella Dynamic Island. La guida Apple spiega come espandere l’attività per vedere più dettagli.",
        "Un widget sulla schermata Home è una funzione separata. Aggiungerlo non dimostra che l’attività sia in esecuzione; nemmeno attivare i suoni delle notifiche la avvia."
      ]
    },
    {
      "heading": "Controlla l’appuntamento oltre al numero",
      "body": [
        "Il numero può continuare a diminuire rispetto a un orario salvato che non è più corretto. Se l’organizzatore sposta la riunione, un conto che avanza non dimostra che la modifica sia arrivata. Controlla anche titolo, data e indicazione dell’aggiornamento.",
        "Dopo una modifica importante, riapri l’app e confronta l’evento salvato con l’attività. Se non coincidono, usa i dettagli confermati dell’appuntamento mentre cerchi la causa."
      ]
    },
    {
      "heading": "Mantieni un avviso quando non guardi",
      "body": [
        "Un conto alla rovescia visivo serve solo quando guardi lo schermo. Conserva un promemoria adeguato per gli appuntamenti importanti e verifica separatamente il permesso di notifica. Non sostituire un avviso necessario con la sola presenza dell’attività.",
        "Considera anche preparazione e viaggio. Il numero conta fino all’inizio dell’evento, non verifica autonomamente quando devi partire. Controlla il luogo e il tempo che ti occorre."
      ]
    },
    {
      "heading": "Esamina un’attività assente o non aggiornata",
      "body": [
        "Verifica prima l’evento nell’app, poi che l’attività sia avviata e consentita. Gli aggiornamenti in background dipendono da iOS: non sono una garanzia di sincronizzazione continua o di un’agenda futura illimitata.",
        "Confronta un appuntamento di prova prima e dopo averne cambiato l’ora. Annota l’inizio previsto, quello mostrato e l’effetto della riapertura dell’app. Lascia intatti gli inviti reali e indica le versioni dell’app e di iOS quando segnali il problema."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Conferma l’appuntamento futuro e il calendario.",
    "Avvia «Live» e verifica l’evento mostrato.",
    "Confronta di nuovo dopo uno spostamento.",
    "Mantieni separatamente i promemoria necessari."
  ],
  "faq": [
    {
      "q": "Il conto alla rovescia è sempre aggiornato?",
      "a": "No. Può contare verso un orario salvato in precedenza. Verifica le modifiche importanti nell’app."
    },
    {
      "q": "Perché manca un evento di tutto il giorno?",
      "a": "L’attività seleziona appuntamenti futuri con orario."
    },
    {
      "q": "Ogni iPhone ha la Dynamic Island?",
      "a": "No. È una superficie distinta dalla schermata di blocco e richiede un modello compatibile."
    }
  ],
  "sourcesHeading": "Fonti e istruzioni Apple",
  "sources": [
    {
      "label": "Apple: funzioni e attività in tempo reale sulla schermata di blocco",
      "url": "https://support.apple.com/guide/iphone/access-features-from-the-lock-screen-iphcd5c65ccf/ios"
    },
    {
      "label": "Apple: attività in tempo reale nella Dynamic Island",
      "url": "https://support.apple.com/guide/iphone/view-live-activities-in-the-dynamic-island-iph28f50d10d/ios"
    }
  ],
  "seeAlso": [
    "the-widget-that-shows-what-is-next"
  ]
},

  'drag-an-event-to-move-it': {
    title: 'Spostare un evento trascinandolo',
    short: 'Trascinare invece di compilare',
    description:
      'Riprogrammare dovrebbe costare un gesto, non un modulo. Perché la manipolazione diretta conta in un calendario più che quasi ovunque.',
    lede: "Aprire l'evento, toccare il campo dell'ora, girare una rotella, salvare: quattro passaggi per esprimere una cosa che avevate già indicato con un dito.",
    commonBelief: "Che modificare l'ora in un modulo sia preciso e trascinare sia approssimativo.",
    sections: [
      {
        heading: 'Il modulo non è più esatto',
        body: [
          'Un trascinamento cade sulla griglia, e la griglia è nelle unità in cui comunque pianificate. Non state essendo imprecisi: state lavorando alla risoluzione che la giornata ha davvero.',
          "Dove la precisione conta sul serio — un volo, una prenotazione al minuto — il modulo c'è ancora. Smette solo di essere la prima cosa per il novanta per cento dei casi che vogliono dire «un'ora più tardi».",
        ],
      },
      {
        heading: 'Spostare è più frequente che creare',
        body: [
          "Quasi tutto il lavoro di calendario è risistemare, non inserire. Una volta notato, si vede che un'app che rende elegante la creazione e faticosa la risistemazione ha ottimizzato la metà meno frequente.",
          "Trascinare e ridimensionare fanno della risistemazione quello che già era nella vostra testa: questo, ma più tardi, e un po' più lungo.",
        ],
      },
    ],
    claims: {},
    practical: [
      "Trascinate per l'approssimativo, aprite l'evento per l'esatto.",
      'Cambiate la durata dal bordo invece di scrivere un orario di fine.',
      'In vista Settimana, un trascinamento fra giorni sposta data e ora insieme.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view'],
  },

  'sharing-one-event-not-your-calendar': {
    title: 'Condividere un solo evento, non il calendario',
    short: 'Condividere un evento',
    description:
      "Come funziona mandare un singolo evento, cosa riceve davvero l'altra persona e perché non deve installare niente per vederlo.",
    lede: "Condividere un calendario di solito è tutto o niente: o qualcuno ha accesso al vostro o non ce l'ha. Mandare una cena non dovrebbe richiedere né l'una né l'altra cosa.",
    commonBelief:
      'Che condividere un evento significhi dare a qualcuno una finestra sul resto della vostra settimana.',
    sections: [
      {
        heading: 'Cosa parte davvero',
        body: [
          "Quando create un evento, l'app vi propone di condividerlo. Quello che viaggia è un link — per email, per messaggio, per quello che l'altro ha installato — e dietro quel link c'è un flusso di calendario che contiene quell'evento e nient'altro.",
          "Non è uno screenshot né una copia che invecchia. Se l'ora cambia, il flusso cambia con lei, e la persona a cui l'avete mandato vede il cambiamento senza che voi rimandiate niente.",
        ],
      },
      {
        heading: 'Non le serve questa app',
        body: [
          'Il link è un normale abbonamento di calendario. Lo legge Calendario di Apple, lo legge Google Calendar, lo legge Outlook. Qualcuno su Android con un account Gmail può iscriversi e vedere il vostro evento; niente di tutto ciò richiede un iPhone.',
          "Nel messaggio c'è anche una App Clip per chi l'app la vuole: si apre senza installare niente e mostra l'evento subito. È una porta, non un pedaggio, e la distinzione conta quando invitate qualcuno a cui non potete chiedere di installare software.",
        ],
      },
      {
        heading: 'Cosa non è',
        body: [
          'Non è istantaneo. Il flusso chiede alle app di ricontrollare ogni ora, e quella è una richiesta, non una regola: ogni programma si aggiorna al proprio ritmo, alcuni con più pigrizia. Per una cena della settimana prossima è invisibile. Per un cambiamento venti minuti prima, mandate anche un messaggio.',
          "Non è nemmeno segreto. Il link porta ventidue caratteri casuali, che nessuno indovinerà, ma chiunque ce l'abbia può leggere il flusso. Trattatelo come un link a un documento: mandatelo tranquillamente, e revocatelo quando ha fatto il suo lavoro.",
          "E per ora è in sola lettura. Chi lo riceve vede l'evento. Non può modificarlo né scrivere nel vostro calendario.",
        ],
      },
    ],
    claims: {
      refreshHint: 'Ore fra una richiesta di aggiornamento del flusso e la successiva',
      linkLength: 'Caratteri casuali del link, che è ciò che lo rende non indovinabile',
      sharePrice: 'Quanto costa condividere',
    },
    practical: [
      "Condividete dall'evento stesso, subito dopo averlo creato: è lì che compare la proposta.",
      'Mandate il link per il canale che già usate con quella persona; il formato è indifferente.',
      "Se l'ora cambia all'ultimo, scrivetele oltre che spostare l'evento.",
      "Revocate il link quando l'evento è passato, come smettereste di condividere un documento.",
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view'],
  },

  'free-google-sync-without-adverts': {
    title: 'Sincronizzazione Google gratuita, e cosa paga la pubblicità',
    short: 'Gratis, e la pubblicità',
    description:
      'Cosa contiene davvero il piano gratuito, dove compare la pubblicità e quanto costa toglierla. Detto chiaro, perché quasi nessuna app lo fa.',
    lede: "Le app di calendario gratuite di solito lo sono perché si sta vendendo qualcos'altro. Vale la pena sapere cosa prima di affidarle la settimana.",
    commonBelief:
      "Che un piano gratuito sia una prova e che l'app vera stia dietro il muro a pagamento.",
    sections: [
      {
        heading: 'Cosa copre il gratuito',
        body: [
          'Tutte le viste, sincronizzazione iCloud, sincronizzazione Google, tutto il meteo dentro il calendario, i widget, i link Meet sugli eventi e la modifica per trascinamento. Non una prova di queste cose: queste cose.',
          "Se i vostri calendari stanno su Apple e Google, come per la maggior parte delle persone, il piano gratuito è l'app.",
        ],
      },
      {
        heading: 'Cosa fa la pubblicità e quanto costa toglierla',
        body: [
          'Il piano gratuito porta pubblicità. Toglierla è il piano a pagamento più economico, e togliere la pubblicità è onestamente quasi tutto quello che quel piano fa.',
          'Dirlo così sembra meglio della sistemazione abituale, in cui il piano senza pubblicità viene impacchettato con funzioni che nessuno ha chiesto perché il prezzo sembri comprare di più.',
        ],
      },
    ],
    claims: {
      price: 'Costo del piano gratuito',
      advancedMonthly: 'Costo mensile per togliere la pubblicità, in dollari',
    },
    practical: [
      "Cominciate gratis: la sincronizzazione che vi serve probabilmente c'è già.",
      "Pagate per togliere la pubblicità, non perché vi aspettate che l'app cambi.",
      'Il piano superiore ha senso solo se il vostro calendario di lavoro sta su Microsoft.',
    ],
    seeAlso: ['what-a-subscription-actually-buys', 'icloud-google-and-outlook-in-one-view'],
  },

  'what-a-subscription-actually-buys': {
  "updated": "2026-10-21",
  "title": "Cosa compra davvero un abbonamento, piano per piano",
  "short": "Cosa compra un abbonamento",
  "description": "Cosa compra un abbonamento: Base, Advanced, Premium.",
  "lede": "Questa guida è pubblicata da Arte Soft, sviluppatore di Cloud Calendars.",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "Base include sincronizzazione con Google Calendar, Google Meet, viste del calendario, meteo e widget. Il piano gratuito può mostrare pubblicità."
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Advanced include Base e rimuove la pubblicità. Premium include Advanced e aggiunge Microsoft Calendar e Microsoft Teams.",
        "Un abbonamento non concede permessi di modifica sui calendari altrui e non aggira le restrizioni di un account di lavoro."
      ]
    },
    {
      "heading": "Informazioni su acquisto e annullamento",
      "body": [
        "Prima dell’acquisto controlla prezzo locale, periodo di fatturazione e condizioni di rinnovo.",
        "Per un abbonamento fatturato da Apple, apri Impostazioni → il tuo nome → Abbonamenti. Controlla stato e scadenza. Annullare il rinnovo è diverso dall’eliminare l’app o i dati del calendario; non presumere che le funzioni a pagamento restino disponibili dopo la scadenza."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Prima dell’acquisto controlla prezzo locale, periodo di fatturazione e condizioni di rinnovo.",
    "Un abbonamento non concede permessi di modifica sui calendari altrui e non aggira le restrizioni di un account di lavoro."
  ],
  "faq": [
    {
      "q": "Come interrompo il rinnovo?",
      "a": "Per un abbonamento fatturato da Apple, apri Impostazioni → il tuo nome → Abbonamenti. Controlla stato e scadenza. Annullare il rinnovo è diverso dall’eliminare l’app o i dati del calendario; non presumere che le funzioni a pagamento restino disponibili dopo la scadenza."
    }
  ],
  "sourcesHeading": "Informazioni su acquisto e annullamento",
  "sources": [
    {
      "label": "Apple: Come interrompo il rinnovo?",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "free-google-sync-without-adverts"
  ]
},
};
