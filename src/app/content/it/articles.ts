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
  "month-view-on-a-bigger-screen": {
  "updated": "2026-10-22",
  "title": "Calendario mensile su iPad e iPhone: scegli la data, poi verifica i dettagli",
  "short": "Usare il mese senza perdere i dettagli",
  "description": "Confronta le date su iPad o iPhone. Controlla eventi nascosti, calendari selezionati e orari prima di spostare appuntamenti condivisi o ricorrenti.",
  "lede": "La vista mensile mostra come gli impegni si distribuiscono fra le date. È meno adatta a dimostrare che una certa ora sia libera. Usa la panoramica per scegliere una data, poi esamina giornata ed evento prima di confermare. Questa guida è pubblicata da Arte Soft, sviluppatore di Cloud Calendars.",
  "commonBelief": "Una griglia mensile più grande mostra ogni dettaglio, e una data apparentemente vuota dimostra che tutti sono disponibili.",
  "sections": [
    {
      "heading": "Decidi se ti servono date oppure orari precisi",
      "body": [
        "Usa il mese per confrontare una scadenza, un viaggio e un appuntamento familiare nell’arco di più settimane. Per capire se due appuntamenti si sovrappongono alle 14:30, passa alla vista giornaliera o settimanale e controllane inizio e fine. Una casella mensile non ha la stessa scala temporale di una griglia oraria.",
        "Per scegliere la data di un laboratorio, l’organizzatore può prima escludere una settimana di viaggio. Poi deve esaminare il giorno proposto: impegni, preparazione, spostamenti e termine previsto. Una casella che sembra libera è una possibilità da verificare, non una prenotazione confermata né la disponibilità degli altri."
      ]
    },
    {
      "heading": "Leggi il conteggio aggiuntivo, non soltanto i titoli visibili",
      "body": [
        "La casella mensile attuale di Cloud Calendars mostra un numero limitato di etichette degli eventi e un conteggio aggiuntivo quando quella data ne contiene altri. I titoli occupano una riga e possono risultare abbreviati. Apri la giornata o l’evento quando contano il titolo completo o gli altri impegni.",
        "Lo schermo più grande dell’iPad può rendere la panoramica più leggibile, ma più spazio fisico non elimina necessariamente tutti i limiti di visualizzazione. Una finestra stretta o caratteri grandi possono cambiare quanto entra. Anche su iPhone, apri la giornata prima di considerare le etichette visibili come l’intero programma."
      ]
    },
    {
      "heading": "Controlla mese, calendari selezionati e date adiacenti",
      "body": [
        "Leggi mese e anno visualizzati prima di scegliere una data. Per completare le righe, la griglia può includere date del mese vicino. In Cloud Calendars usa la navigazione mensile e controlla la data selezionata, senza affidarti soltanto alla posizione della casella.",
        "Verifica quali calendari sono selezionati. Nascondere gli eventi di lavoro facilita la lettura del programma familiare, ma toglie quegli impegni da quella panoramica. Per indagare un duplicato, nascondi temporaneamente una fonte e confronta; non eliminare un appuntamento soltanto per alleggerire il mese."
      ]
    },
    {
      "heading": "Apri l’evento prima di modificare un accordo condiviso",
      "body": [
        "Nei dettagli verifica titolo, proprietario o calendario, ora locale e durata. Il colore aiuta a scorrere, ma non sostituisce la verifica dell’account o del diritto di modifica. Un invito visibile è diverso da un appuntamento organizzato da te.",
        "Cloud Calendars permette di trascinare eventi nel mese per spostarli a un’altra data. Prima di farlo su un impegno reale, stabilisci data desiderata e ambito della ricorrenza. Dopo una modifica consentita, riapri l’evento e controlla il risultato: un gesto locale non prova che il servizio o tutti i partecipanti abbiano accettato il nuovo accordo."
      ]
    },
    {
      "heading": "Controlla separatamente ricorrenze e fusi orari",
      "body": [
        "Se cambia soltanto la lezione di questa settimana, evita di modificare per errore anche quelle future. Leggi la scelta dell’ambito disponibile e controlla poi sia l’occorrenza modificata sia una successiva. Il mese facilita il confronto tra date ripetute, ma è l’ambito di modifica a definire l’effetto.",
        "Per viaggi o riunioni tra fusi orari, controlla esplicitamente data e ora locale dell’evento. Spostare un evento a un altro giorno non converte automaticamente l’orario desiderato. Verifica eventuali passaggi all’ora legale e conferma l’ora concordata con gli interessati."
      ]
    },
    {
      "heading": "Usa la vista più ampia senza confonderla con altri prodotti",
      "body": [
        "Apple Calendar offre proprie opzioni mensili, mentre Teamup documenta viste diverse per browser e dispositivi mobili. Questi controlli appartengono ai rispettivi prodotti. Non cercare la configurazione browser di Teamup o il menu viste di Apple Calendar dentro Cloud Calendars solo perché le viste hanno lo stesso nome.",
        "Un mese di appuntamenti non equivale a un mese di previsioni meteo. Per un’attività all’aperto verifica separatamente luogo, data e ore di previsione disponibili. Salva l’appuntamento finale nel calendario desiderato e conferma direttamente con i partecipanti ogni cambiamento."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Usa il mese per individuare date candidate, poi controlla gli orari nella vista giornaliera o settimanale.",
    "Apri le giornate con conteggi aggiuntivi o titoli abbreviati.",
    "Controlla mese, anno e calendari selezionati prima di ritenere libera una data.",
    "Conferma calendario, ora, durata e permesso di modifica dell’evento.",
    "Leggi l’ambito della ricorrenza e verifica l’occorrenza salvata dopo lo spostamento.",
    "Controlla separatamente le previsioni disponibili e conferma i cambiamenti con i partecipanti."
  ],
  "faq": [
    {
      "q": "La vista mensile su iPad mostra ogni appuntamento per intero?",
      "a": "Non darlo per scontato. Cloud Calendars limita le etichette nella casella mensile e mostra un conteggio aggiuntivo. Apri giornata ed evento per esaminare tutto il programma."
    },
    {
      "q": "Una giornata vuota significa che sono libero?",
      "a": "Verifica prima calendari selezionati, data e presenza dei dati degli account pertinenti. La panoramica rappresenta solo le informazioni attualmente disponibili e visualizzate."
    },
    {
      "q": "Spostare un evento ricorrente cambia soltanto quella data?",
      "a": "Leggi l’ambito di modifica senza presumere nulla. Dopo il salvataggio controlla l’occorrenza modificata e una successiva, poi conferma l’accordo desiderato."
    }
  ],
  "sourcesHeading": "Confronta le descrizioni ufficiali delle viste",
  "sources": [
    {
      "label": "Apple: viste mensile, su più giorni ed elenco in Apple Calendar",
      "url": "https://support.apple.com/en-ca/guide/iphone/iphfd1054569/ios"
    },
    {
      "label": "Teamup: viste del calendario e configurazione nel browser e nell’app",
      "url": "https://calendar.teamup.com/kb/how-to-use-calendar-views/"
    }
  ],
  "seeAlso": [
    "drag-an-event-to-move-it",
    "icloud-google-and-outlook-in-one-view",
    "weather-inside-your-calendar",
    "sharing-one-event-not-your-calendar"
  ]
},

"keeping-track-of-who-replied":{
  "updated": "2026-10-21",
  "title": "Risposte agli inviti: distinguere partecipazione e accesso condiviso",
  "short": "Chi ha risposto e chi ha accesso",
  "description": "Distingui risposte di partecipazione, inviti in attesa, destinatari anonimi e accessi accettati. Conferma le presenze senza inventare un totale.",
  "lede": "Una persona può aprire un link, aggiungere un evento o accettare l’accesso senza promettere di partecipare. Decidi quale risposta ti serve prima di interpretare l’elenco dei destinatari. Questa guida è scritta da Arte Soft, sviluppatore di Cloud Calendars.",
  "commonBelief": "Ogni destinatario o condivisione accettata sarebbe una presenza confermata, e il silenzio permetterebbe una stima affidabile.",
  "sections": [
    {
      "heading": "1. Identifica il tipo di invito",
      "body": [
        "Un invito a una riunione del provider chiede una risposta di partecipazione. Una condivisione Cloud Calendars dà accesso a dettagli o a un calendario, eventualmente con modifica. Un’iscrizione ICS segue informazioni. Queste azioni possono riguardare la stessa riunione senza registrare la stessa decisione.",
        "Un volontario può accettare l’accesso “Writer” per aggiornare l’evento senza partecipare. Un ospite può leggere l’anteprima web e rispondere con un messaggio. Nessuno dei due casi va contato soltanto da una schermata di gestione degli accessi."
      ]
    },
    {
      "heading": "2. Leggi i destinatari come informazioni di accesso",
      "body": [
        "Cloud Calendars distingue inviti email in attesa, destinatari identificati, anonimi e ruoli di accesso. Un invito in attesa può offrire il reinvio. “Reader”, “Writer” e “Owner” descrivono cosa il destinatario può fare con le informazioni condivise.",
        "Il sistema registra accettazione o ricezione nei percorsi di aggiunta e accesso. È utile per capire la relazione di condivisione, ma non è una risposta di partecipazione Sì/Forse/No. Neppure una ricezione anonima identifica un ospite con nome da conteggiare."
      ]
    },
    {
      "heading": "3. Verifica la partecipazione nel percorso d’invito dell’organizzatore",
      "body": [
        "Google documenta risposte esplicite “Yes”, “No” e “Maybe”. Calendario Apple distingue “Accept”, “Maybe” e “Decline” per gli inviti supportati. Per verificarle usa l’evento e l’account corrispondenti dell’organizzatore.",
        "Se una risposta manca o sembra errata, conferma con la persona l’email invitata e la versione dell’evento. Una copia importata, un link inoltrato o un evento in un altro account possono non rappresentare l’invito originale. Non presumere che ogni vista di terze parti abbia l’ultima risposta."
      ]
    },
    {
      "heading": "4. Lascia sconosciuta la partecipazione sconosciuta",
      "body": [
        "Una condivisione in attesa, nessuna risposta o un messaggio non letto non sono accettazioni o rifiuti affidabili. Registra separatamente conferme esplicite, rinunce e risposte ancora sconosciute. Non aggiungere una frazione fissa di destinatari silenziosi al totale confermato.",
        "Per un pasto con una scadenza di prenotazione, indica entro quando serve rispondere e contatta direttamente chi manca. Il seguito dipende dall’evento: non esiste una regola universale per cui basti un promemoria due giorni prima."
      ]
    },
    {
      "heading": "5. Tratta i link delle riunioni come indicazioni per collegarsi",
      "body": [
        "Un URL Google Meet o Microsoft Teams indica dove collegarsi, non se qualcuno ha accettato o parteciperà. Cloud Calendars include Google Meet in Base e Microsoft Teams in Premium, secondo account e percorso del provider. Un piano superiore non rende più affidabile il conteggio.",
        "Controlla che il link previsto sia nell’evento e funzioni per il pubblico desiderato. Importazioni e conversioni possono perdere informazioni di conferenza. Se cambi l’organizzazione della riunione, indica evento e link da usare anziché interpretare il vecchio accesso come conferma."
      ]
    },
    {
      "heading": "6. Conferma dopo un cambiamento importante",
      "body": [
        "Se un evento viene spostato in modo sostanziale, aggiornalo dal calendario di origine o dal percorso di condivisione. Poi avvisa le persone la cui presenza conta e chiedi una nuova conferma se necessario. Una risposta per martedì non vale necessariamente per giovedì.",
        "Tieni l’elenco finale dei partecipanti separato da quello degli accessi. Revocare la modifica non annulla la partecipazione, e rifiutare l’accesso condiviso non significa necessariamente rifiutare l’incontro. Usa messaggi chiari perché tutti sappiano quale decisione chiedi."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifica se hai inviato un invito del provider, una condivisione dell’app o un feed.",
    "Usa l’elenco di condivisione per accessi e inviti in attesa, non per totali di partecipazione.",
    "Controlla quando pertinente la risposta del provider sull’evento effettivo dell’organizzatore.",
    "Separa risposte sconosciute, conferme e rinunce.",
    "Chiedi una risposta diretta entro una scadenza adeguata.",
    "Dopo un cambiamento importante, conferma nuova organizzazione e link con gli ospiti interessati."
  ],
  "faq": [
    {
      "q": "Accettare l’accesso al calendario significa che la persona verrà?",
      "a": "No. Significa che è stata accettata una relazione di condivisione tramite quel percorso. La partecipazione richiede una risposta all’invito del provider o una conferma esplicita."
    },
    {
      "q": "Posso contare i destinatari anonimi come ospiti confermati?",
      "a": "No. La ricezione anonima non è un impegno di partecipazione identificato. Può descrivere l’uso di un evento condiviso, ma non fornisce un elenco nominativo affidabile."
    },
    {
      "q": "Serve Premium per sapere chi ha risposto?",
      "a": "Non equiparare il piano all’affidabilità delle risposte. Premium aggiunge calendario Microsoft e Teams; ricevute di accesso e risposte di partecipazione restano informazioni diverse. Controlla invito originale e account dell’organizzatore."
    }
  ],
  "sourcesHeading": "Riferimenti su partecipazione e importazione",
  "sources": [
    {
      "label": "Google: rispondere agli inviti agli eventi",
      "url": "https://support.google.com/calendar/answer/37135?hl=en"
    },
    {
      "label": "Apple: rispondere agli inviti di Calendario su iPhone",
      "url": "https://support.apple.com/en-ph/guide/iphone/iphc0eddfe3c/ios"
    },
    {
      "label": "Google: importare eventi e relative limitazioni",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    }
  ],
  "seeAlso": [
    "sharing-one-event-not-your-calendar"
  ]
},

"exchange-calendars-on-an-iphone":{
  "updated": "2026-10-21",
  "title": "Calendari Microsoft ed Exchange su iPhone: verifica prima la connessione",
  "short": "Calendari Microsoft su iPhone",
  "description": "Controlla tipo di account Microsoft, approvazione aziendale e permessi prima di collegare un calendario. Cosa aggiunge Cloud Calendars Premium.",
  "lede": "“Calendario Exchange” può indicare servizi e regole aziendali diversi. Prima di cambiare impostazioni o comprare un piano, identifica dove è ospitata la casella di posta e quale connessione consente l’organizzazione. Questa guida è scritta da Arte Soft, sviluppatore di Cloud Calendars.",
  "commonBelief": "Ogni app con accesso Microsoft dovrebbe funzionare con qualsiasi server Exchange e calendario di lavoro condiviso.",
  "sections": [
    {
      "heading": "1. Identifica la casella di posta, non solo l’app Outlook",
      "body": [
        "Outlook è un’app e un nome usato per servizi Microsoft. Un account in Outlook non indica quale server ospiti il calendario. Chiedi se usi un account Microsoft personale, una casella Microsoft 365 in Exchange Online o un’installazione Exchange propria dell’organizzazione.",
        "Cloud Calendars offre l’accesso Microsoft e usa la connessione al servizio di calendario Microsoft. Non è una configurazione universale con indirizzo del server e password per qualsiasi Exchange. Microsoft documenta l’API del calendario separatamente dalla configurazione Exchange generica: conferma il percorso previsto per la casella anziché indovinare un server."
      ]
    },
    {
      "heading": "2. Separa l’account del dispositivo Apple dalla connessione dell’app",
      "body": [
        "Un calendario di lavoro già disponibile in Calendario Apple tramite un account del dispositivo approvato segue un percorso diverso da “Sign in with Microsoft” dentro Cloud Calendars. Anche i calendari esposti dal sistema del telefono dipendono dal permesso di accesso. Una configurazione riuscita nelle impostazioni Apple non prova che un accesso Microsoft separato sarà approvato.",
        "Prima di aggiungere una connessione, controlla dove appare il calendario di lavoro esistente. Se in seguito vedi due versioni di una riunione, identifica le sorgenti e nascondine una temporaneamente. Non rimuovere account o eliminare eventi per diagnosticare quale connessione li abbia prodotti."
      ]
    },
    {
      "heading": "3. Verifica Premium e approvazione aziendale separatamente",
      "body": [
        "Premium aggiunge a Cloud Calendars funzioni per calendari Microsoft e Microsoft Teams. Advanced rimuove gli annunci da Base, ma non sblocca l’accesso Microsoft dell’app. Controlla prezzo locale attuale e periodo di fatturazione, senza affidarti a un prezzo indicato per un’altra regione.",
        "Un abbonamento non può annullare la decisione del datore di lavoro sull’accesso delle app. Microsoft consente di controllare il consenso degli utenti e richiedere l’approvazione amministrativa. Se compare una richiesta, comunica all’amministratore nome dell’app, account previsto e messaggio esatto. Non pubblicare il calendario di lavoro né passare a un account personale per aggirare la decisione."
      ]
    },
    {
      "heading": "4. Individua la fase non riuscita",
      "body": [
        "Se l’accesso non si completa, controlla identità selezionata, rete e messaggio Microsoft. Una richiesta di approvazione è diversa da una sessione scaduta o un errore di connessione. Non c’è motivo di attribuire ogni collegamento fallito a una regola aziendale.",
        "Se l’accesso riesce ma manca un calendario, controlla gruppo dell’account e selezione in Cloud Calendars, poi confronta lo stesso account in Outlook. Se manca un calendario condiviso o delegato mentre il tuo appare, indaga l’accesso a quello specifico calendario. Le capacità generali dell’API Microsoft non garantiscono che ogni caso di casella condivisa o delega sia disponibile nell’app."
      ]
    },
    {
      "heading": "5. Distingui una copia visibile da un aggiornamento confermato",
      "body": [
        "La connessione Microsoft usa copie nel sistema di calendario dell’iPhone. La destinazione di archiviazione può dipendere dalle sorgenti disponibili sul dispositivo. Per un account di lavoro, verifica che questo assetto rispetti i requisiti dell’organizzazione prima di usarlo per riunioni sensibili; non presumere che una copia rimanga solo nella casella originale.",
        "Per esempio, un calendario di gruppo può mostrare una riunione ma rifiutare la modifica perché non hai i diritti necessari. Una modifica locale riuscita non è il controllo finale. Confronta l’evento in Outlook con lo stesso account. Prova soltanto un evento eliminabile in un calendario tuo, senza invitare colleghi o cambiare una riunione stabilita."
      ]
    },
    {
      "heading": "6. Mantieni esplicite responsabilità e disponibilità",
      "body": [
        "Una riunione organizzata da un collega non è tua da spostare o riscrivere solo perché appare vicino ai programmi personali. Considera organizzatore, calendario di lavoro e partecipanti previsti. Usa la procedura approvata dal provider quando l’azione necessaria non è disponibile o una modifica non arriva al server.",
        "Allo stesso modo, mostrare un appuntamento personale accanto al lavoro non blocca automaticamente la disponibilità lavorativa né ne nasconde i dettagli in una voce generica di occupato. Se è il tuo obiettivo, chiedi quale metodo supporti l’organizzazione e verifica il risultato. Un link di sola lettura non sostituisce l’accesso modificabile, e pubblicare un link non è una scorciatoia diagnostica."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifica dove è ospitata la casella e quale connessione permette l’organizzazione.",
    "Verifica se il calendario raggiunge già l’iPhone tramite un account del dispositivo.",
    "Esamina Premium separatamente dal consenso Microsoft e dai permessi del calendario.",
    "All’accesso Microsoft scegli l’identità prevista e conserva eventuali errori per l’assistenza.",
    "Dopo l’accesso scegli il calendario necessario e confronta un evento recente in Outlook.",
    "Conferma una modifica di prova autorizzata presso il provider; lascia intatti inviti e riunioni ricorrenti."
  ],
  "faq": [
    {
      "q": "Premium garantisce la connessione al server Exchange aziendale?",
      "a": "No. Premium abilita le funzioni Microsoft dell’app. Compatibilità della casella, approvazione aziendale e permessi dei singoli calendari sono requisiti separati. Conferma la connessione con l’amministratore prima di considerare supportata un’installazione Exchange."
    },
    {
      "q": "Perché Outlook funziona mentre un’altra app viene rifiutata?",
      "a": "Le app possono avere permessi e requisiti di approvazione diversi. Outlook funzionante è un riferimento utile per l’account, ma non dimostra l’approvazione per un’altra app. Usa l’errore effettivo o la richiesta di approvazione per capire cosa verificare."
    },
    {
      "q": "Posso usare un link pubblico se l’accesso Microsoft è bloccato?",
      "a": "Non pubblicare informazioni di lavoro per aggirare un blocco. Un’iscrizione è normalmente di sola lettura, non equivalente all’accesso modificabile. Chiedi al proprietario o all’amministratore un metodo approvato; non presumere che un link pubblico sia consentito."
    }
  ],
  "sourcesHeading": "Fonti e indicazioni dei provider",
  "sources": [
    {
      "label": "Microsoft: API del calendario Outlook e dati delle caselle di posta supportati",
      "url": "https://learn.microsoft.com/en-us/graph/outlook-calendar-concept-overview"
    },
    {
      "label": "Microsoft: consenso di utenti e amministratori",
      "url": "https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/user-admin-consent-overview"
    },
    {
      "label": "Apple: più calendari e iscrizioni di sola lettura",
      "url": "https://support.apple.com/en-lamr/guide/iphone/iph3d1110d4/ios"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-a-subscription-actually-buys"
  ]
},

  'weather-inside-your-calendar': {
  "title": "Un calendario che contiene già il meteo",
  "short": "Il meteo dentro il calendario",
  "description": "Pianifica con appuntamenti e meteo nella stessa vista. Scopri come le previsioni disponibili entrano nel calendario e quali periodi coprono.",
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
  "updated": "2026-10-21",
  "title": "iCloud, Google e Outlook in una vista: account, copie e permessi",
  "short": "Tre provider, una vista",
  "description": "Visualizza insieme calendari iCloud, Google e Microsoft. Controlla account, permessi e copie prima di spostare eventi o affidarti alla disponibilità.",
  "lede": "Un appuntamento familiare, una chiamata con un cliente e una riunione possono sovrapporsi pur appartenendo ad account diversi. Una vista comune aiuta a notare il conflitto, ma non trasforma gli account in un calendario condiviso. Questa guida è scritta da Arte Soft, sviluppatore di Cloud Calendars.",
  "commonBelief": "Riunire più calendari in un’app manterrebbe automaticamente coerenti disponibilità, condivisione e copie degli eventi.",
  "sections": [
    {
      "heading": "1. Identifica account e calendario di ogni evento",
      "body": [
        "Parti da un evento normale di ogni provider. Annota l’indirizzo email dell’account connesso, il nome del calendario e se possiedi l’evento o hai ricevuto un invito. Due calendari chiamati “Calendario” possono appartenere ad account completamente diversi. Il colore aiuta a leggere la settimana; account e calendario indicano dove deve arrivare una modifica.",
        "Per esempio, una visita dal dentista nel tuo iCloud personale e una riunione di progetto in Microsoft possono apparire insieme per te. Questo non rende di per sé la visita visibile ai colleghi né riserva quel tempo nei loro strumenti di pianificazione."
      ]
    },
    {
      "heading": "2. Usa il collegamento appropriato",
      "body": [
        "Per iCloud, attiva prima Calendario iCloud sull’iPhone con l’Apple Account previsto. La guida Apple spiega le impostazioni del dispositivo. Cloud Calendars accede ai calendari disponibili nel sistema di calendario dell’iPhone e richiede il permesso per leggerli. Un account collegato su un altro dispositivo non basta.",
        "Cloud Calendars offre anche “Sign in with Google” e “Sign in with Microsoft”. Controlla l’account selezionato all’accesso, poi apri il suo gruppo e scegli i calendari necessari. Accedere al provider corretto con l’identità personale o lavorativa sbagliata può produrre un elenco valido ma inatteso."
      ]
    },
    {
      "heading": "3. Distingui i piani dai permessi",
      "body": [
        "Base include sincronizzazione con Google Calendar e viste del calendario. Advanced aggiunge la rimozione degli annunci a Base. Premium aggiunge funzioni per calendari Microsoft e Microsoft Teams. Controlla prezzo locale attuale e periodo di fatturazione prima dell’acquisto.",
        "Un piano modifica le funzioni disponibili nell’app, non ti rende proprietario del calendario altrui. Google distingue il permesso di vedere eventi da quello di modificarli. Restano valide le regole del datore di lavoro e i permessi del calendario Microsoft. Vedere un evento o un editor disponibile non prova che il provider accetterà una modifica."
      ]
    },
    {
      "heading": "4. Una vista comune può includere copie dei calendari",
      "body": [
        "Le connessioni Google e Microsoft usano copie nel sistema di calendario dell’iPhone per mostrare e sincronizzare gli eventi. Non presumere che collegare un account non lasci copie fuori dal provider originale. La destinazione delle copie può dipendere dalle sorgenti di calendario disponibili sul dispositivo.",
        "Se lo stesso account raggiunge il telefono anche attraverso un altro percorso, controlla nomi e sorgenti prima di considerare appuntamenti ripetuti come eventi distinti. Nascondi temporaneamente un calendario per identificarne il contributo alla vista. Non eliminare eventi o calendari solo per ordinare lo schermo: una copia collegata può inviare modifiche al provider."
      ]
    },
    {
      "heading": "5. Scegli sempre la destinazione quando crei un evento",
      "body": [
        "Prima di salvare, controlla il calendario con la stessa cura di data e ora. Per un appuntamento familiare scegli quello effettivamente usato dalla famiglia; per una riunione, la destinazione di lavoro consentita. Vederli entrambi non rende nessuno la destinazione automatica di tutti i nuovi eventi.",
        "Cambiare il calendario di un evento o trascinarlo fra calendari può essere uno spostamento, non una seconda vista innocua. Mantieni inviti e riunioni ricorrenti nel calendario abituale durante la diagnosi. Se serve un cambiamento, stabilisci prima chi possiede l’evento e quale calendario può accoglierlo."
      ]
    },
    {
      "heading": "6. Verifica la panoramica prima di farci affidamento",
      "body": [
        "Confronta un evento recente nel calendario del provider con quello corrispondente in Cloud Calendars. Controlla data, fuso orario, titolo e calendario selezionato. In un calendario tuo e modificabile, un evento di prova senza ospiti è preferibile alla modifica di una riunione reale. Conferma il risultato presso il provider prima di considerare pronta la connessione.",
        "Non affidarti alla vista comune per creare automaticamente blocchi anonimi di tempo occupato in un altro account. Se i colleghi devono vedere la tua indisponibilità senza dettagli personali, usa un sistema espressamente approvato e verificalo dal loro lato. Panoramica personale e disponibilità condivisa sono attività separate."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Annota account e calendario esatti di un evento di ogni provider.",
    "Attiva i calendari iCloud previsti sul dispositivo e controlla l’accesso.",
    "Usa l’accesso Google o Microsoft appropriato e scegli i calendari desiderati.",
    "Confronta un evento recente con la vista del provider prima di modificare qualcosa.",
    "Nascondi temporaneamente una sorgente sospetta di duplicati; conserva gli eventi intatti.",
    "Controlla la destinazione di ogni nuovo evento e separatamente la condivisione del tempo occupato."
  ],
  "faq": [
    {
      "q": "I colleghi vedranno i miei eventi personali perché mostro entrambi i calendari?",
      "a": "La visualizzazione comune non è un’istruzione di condivisione né un trasferimento automatico del tempo occupato. Controlla le impostazioni effettive di ciascun calendario. Le connessioni possono creare copie sul dispositivo: la vista comune non garantisce neppure che i dati esistano soltanto presso il provider originale."
    },
    {
      "q": "Perché vedo un evento ma non riesco a modificarlo?",
      "a": "Il calendario può essere di sola lettura, l’evento appartenere a un altro organizzatore o il provider rifiutare l’aggiornamento. Controlla proprietà e permessi presso il provider. Acquistare un piano superiore non cambia quei diritti."
    },
    {
      "q": "Devo collegare lo stesso account Google attraverso ogni percorso disponibile?",
      "a": "Controlla prima come appare già sul telefono. Più percorsi complicano l’identificazione delle copie. Scegli quello previsto, verifica gli eventi e nascondi la vista aggiuntiva durante l’indagine, anziché cominciare eliminando dati o scollegando account."
    }
  ],
  "sourcesHeading": "Fonti e riferimenti per la configurazione",
  "sources": [
    {
      "label": "Apple: configurare Calendario iCloud sui dispositivi",
      "url": "https://support.apple.com/guide/icloud/set-up-calendar-mme4d73a8727/icloud"
    },
    {
      "label": "Google: condivisione dei calendari e permessi",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: API del calendario Outlook e dati delle caselle di posta supportati",
      "url": "https://learn.microsoft.com/en-us/graph/outlook-calendar-concept-overview"
    }
  ],
  "seeAlso": [
    "exchange-calendars-on-an-iphone"
  ]
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
  "updated": "2026-10-21",
  "title": "Condividere un evento: scegliere il link e i permessi",
  "short": "Condividere un evento",
  "description": "Condividi un evento senza l’intero calendario. Scopri i ruoli Reader, Writer e Owner, le anteprime, gli aggiornamenti e i limiti della revoca.",
  "lede": "Inviare i dettagli di una cena, consentire modifiche a un coorganizzatore e raccogliere conferme di presenza sono attività diverse. Scegli prima lo scopo e poi il metodo di condivisione. Questa guida è scritta da Arte Soft, sviluppatore di Cloud Calendars.",
  "commonBelief": "Ogni link è un abbonamento di sola lettura che si aggiorna subito e registra una risposta.",
  "sections": [
    {
      "heading": "Controlla i dettagli del singolo evento",
      "body": [
        "La condivisione di un singolo evento riguarda quell’evento, non l’intero calendario. Prima di inviarlo, controlla titolo, fuso orario, luogo, note e link della riunione. Informazioni utili a un invitato potrebbero non essere adatte a una diffusione ampia.",
        "Condividere una cena non richiede di condividere il calendario delle visite mediche. Tuttavia, luogo e link della cena vengono trasmessi con l’evento. Controlla il contenuto stesso."
      ]
    },
    {
      "heading": "Scegli anteprima, email o QR",
      "body": [
        "L’App Clip di Cloud Calendars mostra un’anteprima; per aggiungere l’evento tramite quel percorso serve l’app completa. Gli inviti via email e QR aprono una pagina web che propone di aprire Cloud Calendars. Non sono indirizzi di abbonamento intercambiabili.",
        "Il mittente accede al proprio account per la condivisione sincronizzata. Link e codici QR possono essere inoltrati. Un QR trasmette un link, ma non dimostra chi lo abbia aperto."
      ]
    },
    {
      "heading": "Assegna soltanto l’accesso necessario",
      "body": [
        "Negli inviti email puoi scegliere Reader, Writer o Owner. Reader visualizza e sincronizza; Writer modifica; Owner può anche condividere e gestire gli accessi. Per chi deve solo consultare il programma, scegli Reader.",
        "Writer è adatto a un coorganizzatore che deve modificare l’evento. Owner serve quando deve anche gestire l’accesso altrui. Per ottenere permessi superiori il destinatario deve accedere con l’identità corretta. Un destinatario anonimo non è un comproprietario identificato."
      ]
    },
    {
      "heading": "Comprendi come viene aggiunto l’evento",
      "body": [
        "Nell’app completa occorrono il permesso di accesso ai calendari e un calendario di destinazione modificabile. Il destinatario deve controllarlo prima di salvare. La copia ricevuta può essere associata all’evento condiviso per gli aggiornamenti successivi.",
        "Importare un normale file ICS in un altro calendario è diverso: l’importazione crea una copia, mentre un abbonamento controlla periodicamente un feed. Se invii un feed ICS, spiega il percorso e verifica che il calendario del destinatario lo supporti."
      ]
    },
    {
      "heading": "Verifica gli aggiornamenti",
      "body": [
        "Una condivisione sincronizzata può trasmettere modifiche e annullamenti, ma il dispositivo deve poterli ricevere. L’intervallo suggerito dal feed non è una scadenza di consegna. Dispositivi offline, abbonamenti non aggiornati e copie importate indipendenti possono mostrare dati vecchi.",
        "Se la cena cambia poco prima dell’inizio, aggiorna l’evento e contatta direttamente gli invitati. Chiedi conferma del nuovo orario. Ricevere un aggiornamento non equivale a confermare la presenza."
      ]
    },
    {
      "heading": "Gestisci l’accesso senza promettere di cancellare ogni copia",
      "body": [
        "Rivedi i destinatari e rimuovi i permessi inutili. Rimuovere una persona e revocare un link al feed sono operazioni distinte; nessuna equivale a cancellare da remoto ogni screenshot, messaggio o copia del calendario.",
        "Se un link ha raggiunto altre persone, identifica il link o l’autorizzazione coinvolta e verifica il risultato dopo la modifica. Evita dettagli privati nei link distribuiti ampiamente, invece di confidare in una revoca successiva."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Controlla i dettagli e scegli tra visualizzazione, modifica e risposte sulla presenza.",
    "Scegli il percorso di condivisione e accedi quando richiesto.",
    "Usa Reader per i lettori; Writer o Owner solo per le responsabilità corrispondenti.",
    "Chiedi di controllare orario e calendario di destinazione.",
    "Per modifiche urgenti, aggiorna l’evento e invia un messaggio diretto.",
    "Alla fine, verifica separatamente permessi dei destinatari e accesso tramite link."
  ],
  "faq": [
    {
      "q": "Condividere un evento rivela tutto il calendario?",
      "a": "Il percorso sincronizzato per un singolo evento è limitato a quell’evento, ma ne espone i dettagli. Controllali ed evita un invito all’intero calendario quando vuoi condividere solo un appuntamento."
    },
    {
      "q": "Il destinatario può modificarlo?",
      "a": "Sì, con Writer o Owner e il percorso supportato con accesso all’account. Reader permette visualizzazione e sincronizzazione. Un normale abbonamento ICS non usa lo stesso meccanismo di modifica."
    },
    {
      "q": "Rimuovere una persona annulla tutto ciò che ha ricevuto?",
      "a": "Non è garantito. Cambia il rapporto di condivisione, ma copie salvate, screenshot e messaggi possono restare. Anche l’indirizzo di un feed condiviso va valutato separatamente."
    }
  ],
  "sourcesHeading": "Riferimenti per i destinatari",
  "sources": [
    {
      "label": "Apple: panoramica delle App Clip",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google: importazione di eventi e limiti",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft: importare un calendario o abbonarsi",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "keeping-track-of-who-replied",
    "who-can-see-what-in-google-calendar"
  ]
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
