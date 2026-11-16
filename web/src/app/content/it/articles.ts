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
  "a-calendar-that-is-yours-to-share": {
  "updated": "2026-10-22",
  "title": "Condividere un calendario: scegli persone, permessi e metodo",
  "short": "Un calendario da condividere",
  "description": "Condividi un calendario su iPhone distinguendo accesso nell’app e permessi del provider. Controlla ruoli, accettazione e aggiornamenti.",
  "lede": "Un calendario delle prove o degli impegni di casa deve avere un proprietario e destinatari ben definiti. Prima di invitare qualcuno, decidi chi deve consultarlo, chi deve modificare gli eventi e chi deve gestire gli accessi. Questa guida è scritta da Arte Soft, sviluppatore di Cloud Calendars.",
  "commonBelief": "Condividere un calendario crea sempre un’iscrizione di sola lettura collegata a un account già esistente presso un provider.",
  "sections": [
    {
      "heading": "Scegli un calendario con uno scopo preciso",
      "body": [
        "Un calendario separato rende più chiaro a chi è destinato. Inserisci le prove nel calendario delle prove e tieni altrove gli appuntamenti che non riguardano il gruppo. Prima di condividere un calendario esistente, controlla gli eventi e i loro dettagli, senza affidarti soltanto al nome.",
        "Per esempio, il segretario di un’associazione può gestire il programma degli incontri mentre i soci lo consultano soltanto. In famiglia, invece, può servire che due persone apportino modifiche. Nessuna delle due situazioni richiede di condividere tutti i calendari visibili nell’app dell’organizzatore."
      ]
    },
    {
      "heading": "Identifica il sistema di condivisione che stai usando",
      "body": [
        "Cloud Calendars dispone di un proprio sistema di condivisione dei calendari, che comprende calendari locali dell’app e calendari supportati accessibili tramite il sistema di calendario dell’iPhone. Offre anche un percorso separato per condividere calendari Google. Non si tratta di un unico meccanismo universale di iscrizione.",
        "Un calendario locale dell’app non è automaticamente un calendario di un account Google o iCloud. Allo stesso modo, le regole di condivisione di un calendario del provider dipendono da quel provider. Controlla il calendario effettivo e la schermata di condivisione prima di stabilire cosa riceverà un’altra persona e dove comparirà."
      ]
    },
    {
      "heading": "Assegna ruoli diversi a chi legge e a chi modifica",
      "body": [
        "Nella condivisione di Cloud Calendars, Reader può visualizzare, Writer può modificare gli eventi e Owner può anche condividere il calendario e gestire gli accessi. Assegna Reader ai soci che devono soltanto consultare il programma. Assegna Writer a un coorganizzatore che deve aggiornarlo.",
        "Owner comprende responsabilità più ampie della modifica. Assegnalo quando una persona deve anche decidere chi altro può usare il calendario. Google utilizza livelli di autorizzazione propri: non presumere che un ruolo di condivisione dell’app e un permesso Google abbiano gli stessi nomi o gli stessi effetti."
      ]
    },
    {
      "heading": "Aiuta il destinatario ad accettare il calendario",
      "body": [
        "Un invito al calendario può arrivare via email oppure tramite un link condiviso o un codice QR. Visualizzare l’anteprima non significa aver completato l’accettazione. In Cloud Calendars, il destinatario accede e aggiunge il calendario a “Shared with me”, l’area dei calendari condivisi con lui; per questo percorso è richiesta un’identità con indirizzo email verificato.",
        "Se l’invito era rivolto a un indirizzo email specifico, verifica che il destinatario usi l’identità corrispondente. Chi apre un link con un altro account potrebbe non ricevere il ruolo previsto. Controlla il calendario visualizzato e l’accesso ottenuto: una pagina caricata correttamente non dimostra che la collaborazione sia già attiva."
      ]
    },
    {
      "heading": "Verifica una modifica prima di affidarti al programma completo",
      "body": [
        "Inizia con un evento di prova senza dati sensibili, chiarendo al gruppo che si tratta di un test. Chiedi a un Reader di confermare che lo vede e, se necessario, a un Writer autorizzato di modificarlo. Controlla il risultato dal lato del proprietario prima di usare questa configurazione per eventi importanti.",
        "Gli aggiornamenti richiedono una connessione funzionante e un aggiornamento dei dati. Una condivisione dell’app è diversa da un’iscrizione ICS, e nessuna delle due giustifica la promessa che ogni modifica arrivi all’istante. Per un annullamento all’ultimo momento o un cambio di luogo, aggiorna il calendario e contatta direttamente le persone interessate."
      ]
    },
    {
      "heading": "Rivedi gli accessi quando cambia il gruppo",
      "body": [
        "Quando un coorganizzatore lascia il gruppo, controlla il suo ruolo e rimuovi gli accessi che non servono più. Uscire da un calendario ricevuto ed eliminare un calendario di cui sei proprietario sono azioni diverse. Leggi la conferma e identifica il proprietario prima di procedere.",
        "Revocare l’accesso non garantisce che scompaiano vecchi screenshot, dati esportati o copie indipendenti. Annota il metodo di condivisione usato e verifica l’accesso interessato dopo una modifica. È particolarmente utile quando le stesse persone ricevono anche inviti del provider o link separati a singoli eventi."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Scegli un calendario dedicato al gruppo e controlla i contenuti già presenti.",
    "Prima di invitare qualcuno, distingui la condivisione di un calendario locale dell’app, di un calendario del provider sul dispositivo o di Google.",
    "Scegli Reader, Writer o Owner in base alle responsabilità di ogni persona.",
    "Chiedi ai destinatari di accedere con l’identità prevista e accettare l’invito.",
    "Verifica un evento di prova e una modifica autorizzata prima di fare affidamento sugli aggiornamenti.",
    "Rivedi gli accessi quando cambiano i partecipanti e distingui l’uscita dal calendario dalla sua eliminazione."
  ],
  "faq": [
    {
      "q": "Le altre persone possono modificare un calendario condiviso?",
      "a": "Sì, i ruoli Writer e Owner dell’app consentono di modificare gli eventi. Reader è il ruolo di visualizzazione. I calendari dei provider hanno regole di autorizzazione proprie: controlla il metodo di condivisione effettivamente usato."
    },
    {
      "q": "Un nuovo calendario condiviso deve essere collegato al mio account Google o iCloud?",
      "a": "Non darlo per scontato. Cloud Calendars offre anche calendari locali dell’app con un proprio sistema di condivisione. Identifica dove risiede il calendario prima di aspettarti che compaia nell’app di un altro provider."
    },
    {
      "q": "Aprire l’invito significa essere entrati nel calendario?",
      "a": "No. Un’anteprima non equivale all’accettazione. Il percorso dell’app per condividere un intero calendario richiede accesso e accettazione; l’identità invitata influisce sul ruolo concesso. Controlla il calendario condiviso risultante e l’accesso del destinatario."
    }
  ],
  "sourcesHeading": "Riferimenti sui permessi dei provider",
  "sources": [
    {
      "label": "Google: autorizzazioni per condividere un calendario",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: importare un calendario o iscriversi a un calendario",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "sharing-one-event-not-your-calendar",
    "keeping-track-of-who-replied",
    "what-a-subscription-actually-buys"
  ]
},

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
  "sharing-one-event-not-your-calendar",
  "recurring-events-without-the-mess"
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
  "updated": "2026-10-22",
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
        "Prima di aggiungere una connessione, controlla dove appare il calendario di lavoro esistente. Se in seguito vedi due versioni di una riunione, identifica le sorgenti e nascondine una temporaneamente. Non rimuovere account o eliminare eventi per diagnosticare quale connessione li abbia prodotti. In Cloud Calendars, annota la selezione iniziale e ripristinala dopo il confronto. La selezione può influire anche sui widget e sulla programmazione delle notifiche; non presumere che riguardi soltanto la visualizzazione."
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
  "updated": "2026-10-23",
  "title": "Calendario con meteo su iPhone e iPad: organizza la giornata in un’unica vista",
  "short": "Usa insieme calendario e meteo",
  "description": "Confronta il tuo calendario con il meteo del luogo selezionato su iPhone e iPad.",
  "lede": "Cloud Calendars riunisce agenda e meteo nella stessa app per iPhone o iPad. Usa il calendario per scegliere una data e la vista meteo per controllare il luogo selezionato e le ore di previsione disponibili. Per un programma all’aperto, verifica la fascia oraria che conta invece di basarti su un’icona giornaliera. Questa guida è pubblicata da Arte Soft, lo sviluppatore dell’app.",
  "commonBelief": "Il meteo mostrato accanto a un calendario descrive automaticamente l’indirizzo di ogni evento, ogni ora e ogni data futura.",
  "sections": [
    {
      "heading": "Scegli una vera domanda di pianificazione",
      "body": [
        "Parti da un evento specifico, come una visita pomeridiana a un parco. Individua che cosa potrebbe cambiare: l’orario, il luogo, la preparazione o la decisione di usare un’alternativa. Non serve riorganizzare tutto il calendario solo perché il simbolo del giorno indica pioggia.",
        "Annota l’inizio e la fine effettivi dell’attività, includendo la preparazione se pertinente. Una panoramica del calendario aiuta a trovare date possibili, mentre il controllo delle previsioni riguarda un luogo e un intervallo precisi. Tieni distinti questi due compiti quando confronti le opzioni."
      ]
    },
    {
      "heading": "Conferma il luogo del meteo prima di leggere i valori",
      "body": [
        "Cloud Calendars offre il meteo per il luogo attuale o selezionato. Controlla la posizione visualizzata invece di presumere che l’indirizzo di un evento cambi automaticamente la previsione. Un evento in un’altra città richiede un confronto con il meteo di quella città.",
        "Per esempio, una persona può pianificare l’arrivo a un museo mentre il telefono si trova ancora a casa. Prima di confrontare i dati, leggi il luogo della previsione e l’ora locale dell’evento. Valori apparentemente vicini non dimostrano che agenda e meteo usino lo stesso luogo."
      ]
    },
    {
      "heading": "Controlla separatamente la copertura oraria e quella giornaliera",
      "body": [
        "Usa una voce giornaliera per orientarti e le voci orarie disponibili per una domanda che riguarda una parte della giornata. Una prenotazione dalle due alle cinque richiede più di un’occhiata a un solo simbolo. Verifica che le ore rilevanti siano davvero presenti.",
        "Nell’attuale sorgente dell’app, l’elenco giornaliero include fino a dieci giorni restituiti da WeatherKit. Questo è separato dalla navigazione del calendario e dalle ore attualmente fornite. Un evento futuro non estende la copertura meteo. Se il suo intervallo non è presente, pianifica un nuovo controllo più avanti."
      ]
    },
    {
      "heading": "Leggi il significato del valore meteo",
      "body": [
        "Apple documenta i dati di WeatherKit come temperatura, precipitazioni, vento e UV, con alcuni prodotti disponibili solo in determinate regioni. Leggi i valori disponibili per il luogo scelto invece di aspettarti ogni prodotto meteo ovunque.",
        "Le indicazioni del Met Office mostrano perché contano il periodo della previsione e le definizioni delle variabili: alcuni valori si riferiscono a un momento, altri a un intervallo. Usa le etichette del provider pertinente. Probabilità di pioggia, quantità e durata sono domande diverse, e nessun singolo numero decide ogni attività all’aperto."
      ]
    },
    {
      "heading": "Rivedi una bozza creata da un’ora meteo",
      "body": [
        "Dove l’app consente di creare un evento a partire da un’ora, si apre una bozza. L’attuale sorgente usa il fuso orario del luogo meteo, propone una durata di un’ora e seleziona il calendario predefinito per i nuovi eventi. Controlla ogni valore prima di salvare.",
        "Conferma il titolo, il calendario di destinazione, l’inizio, la fine e il luogo previsto. La selezione di una previsione non concede il permesso di modificare un calendario condiviso, avvisare una struttura o prenotare una sala. Controlla l’evento salvato e ottieni qualsiasi accordo richiesto dal piano."
      ]
    },
    {
      "heading": "Tieni distinta la dimostrazione sul sito web",
      "body": [
        "La dimostrazione interattiva del meteo sul sito web usa Open-Meteo. L’app usa Apple WeatherKit. Una dimostrazione web è utile per esplorare la presentazione, ma luogo, dati e date disponibili possono differire dall’app.",
        "Per una decisione reale, apri l’app e confronta l’evento previsto con le previsioni disponibili. Se modifichi un piano condiviso, conferma organizzatore, ambito della ricorrenza e partecipanti. Mantieni un’alternativa concordata quando l’attività dipende dalle condizioni."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Individua l’evento e la decisione che il meteo potrebbe cambiare.",
    "Conferma il luogo del meteo e la data e l’ora locali dell’evento.",
    "Controlla separatamente la copertura oraria disponibile rispetto al riepilogo giornaliero.",
    "Leggi probabilità, quantità e altri valori pertinenti usando le relative etichette.",
    "Rivedi tutti i dettagli della bozza dell’evento e il calendario di destinazione prima di salvare.",
    "Controlla di nuovo al momento della decisione e conferma direttamente le modifiche condivise."
  ],
  "faq": [
    {
      "q": "Il meteo accanto al mio calendario segue l’indirizzo di ogni evento?",
      "a": "Non darlo per scontato. Conferma il luogo meteo visualizzato e confrontalo con la sede; la vicinanza sullo schermo non prova che coincidano."
    },
    {
      "q": "L’app usa lo stesso provider meteo del sito web?",
      "a": "No. L’app usa Apple WeatherKit; la dimostrazione sul sito web usa separatamente Open-Meteo."
    },
    {
      "q": "Scegliere un’ora della previsione salva automaticamente un evento?",
      "a": "Avvia una bozza dove questa azione è disponibile. Controlla data, fuso orario, durata, calendario e luogo, poi salva l’evento desiderato."
    }
  ],
  "seeAlso": [
    "weather-calendar-history-versus-forecast-iphone",
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather",
    "weather-where-the-event-is",
    "planning-outdoors-without-being-rained-on"
  ],
  "sourcesHeading": "Fonti ufficiali e approfondimenti",
  "sources": [
    {
      "label": "Apple: informazioni sulle previsioni di WeatherKit e disponibilità regionale",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: luogo della previsione, periodi e valori meteo",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ],
  "comparison": {
    "heading": "Quale vista meteo risponde alla tua domanda?",
    "columns": [
      "La tua domanda",
      "Che cosa controllare",
      "Che cosa non dimostra"
    ],
    "rows": [
      {
        "cells": [
          "Che cosa è previsto per oggi?",
          "Vista giorno o settimana del calendario accanto al meteo del luogo selezionato.",
          "Che l’indirizzo di ogni evento cambi automaticamente il luogo meteo."
        ]
      },
      {
        "cells": [
          "La pioggia potrebbe influire sul mio evento pomeridiano?",
          "Dati orari per la sede e per l’intero intervallo dell’evento.",
          "Che un simbolo giornaliero descriva ogni ora."
        ]
      },
      {
        "cells": [
          "Posso pianificare il mese prossimo in base al meteo?",
          "Il tuo calendario adesso, poi un controllo delle previsioni più vicino alla data.",
          "Che navigare nel calendario estenda la copertura delle previsioni."
        ]
      },
      {
        "cells": [
          "Posso vedere una rapida panoramica nella schermata Home?",
          "Il widget appropriato della schermata Home.",
          "Che ogni layout del widget includa eventi o una previsione completa."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-right",
    "hook"
  ],
  "galleryCaption": "Schermate reali di Cloud Calendars: la vista meteo e un giorno con eventi. Controlla il luogo e la data selezionati nell’app.",
  "actionHeading": "Pianifica con agenda e previsioni insieme",
  "actionText": "Cloud Calendars è disponibile per iPhone e iPad. Inizia con le viste, il meteo e la sincronizzazione con Google Calendar inclusi in Base; Advanced rimuove gli annunci, mentre Premium aggiunge il supporto per Microsoft Calendar e Teams.",
  "articleLinks": [
    {
      "slug": "forecast-beside-every-event",
      "label": "Controlla il meteo nelle ore di un evento"
    },
    {
      "slug": "the-widget-that-shows-what-is-next",
      "label": "Scegli un widget calendario e meteo"
    },
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "Riunisci gli account calendario in un’unica vista"
    }
  ]
},

  'forecast-beside-every-event': {
  "title": "Controlla il meteo orario per un evento del calendario su iPhone e iPad",
  "short": "Meteo per le ore dell’evento",
  "description": "Abbina il luogo, la data e le ore del tuo evento alle previsioni meteo disponibili.",
  "lede": "Per controllare il meteo di un evento del calendario, fai coincidere tre elementi: la sede, la data locale e l’intervallo dall’inizio alla fine dell’evento. In Cloud Calendars, scegli il luogo meteo e controlla le ore disponibili. L’indirizzo di un evento e un’icona meteo vicina non sono, da soli, una prova che questi elementi coincidano. Questa guida è pubblicata da Arte Soft, lo sviluppatore.",
  "commonBelief": "Che un’icona meteo giornaliera sul calendario sia la stessa funzione di una previsione associata a un evento.",
  "sections": [
    {
      "heading": "Parti da luogo e data",
      "body": [
        "Apri le previsioni per il luogo previsto e confronta la data con quella della voce di calendario. Il meteo del calendario può riflettere il luogo meteo selezionato, quindi verifica che sia adatto all’evento invece di dare per scontato che sia determinato dall’indirizzo dell’evento.",
        "Un evento del mese prossimo può esistere prima che siano disponibili i dati meteo per quella data. Mantieni l’evento e torna a controllare le previsioni più vicino alla data; l’assenza di una voce meteo non è una previsione di cielo sereno."
      ]
    },
    {
      "heading": "Usa il dettaglio orario per una domanda oraria",
      "body": [
        "Un riepilogo giornaliero e una previsione oraria rispondono a domande diverse. Se l’evento dura dalle due alle cinque, controlla le ore disponibili che coprono quell’intervallo invece di considerare una singola icona giornaliera come il quadro completo.",
        "Se è disponibile solo una parte dell’intervallo, lascia il resto in sospeso. L’app non promette un meteo orario completo per ogni evento che puoi creare e questa guida non promette che aprendo qualsiasi evento venga sempre mostrata l’intera finestra meteo."
      ]
    },
    {
      "heading": "Distingui tra probabilità, quantità e orario",
      "body": [
        "Leggi l’etichetta del valore che stai controllando. La probabilità di precipitazioni non corrisponde alla quantità o alla durata della pioggia. Allo stesso modo, un valore orario e un riepilogo giornaliero coprono periodi diversi; confronta periodi equivalenti quando valuti due possibili orari.",
        "Scegli un’alternativa adatta al tuo piano invece di trattare una singola percentuale come una regola universale per decidere se andare o annullare. Le informazioni meteo possono cambiare, quindi ricontrollale quando devi prendere una decisione."
      ]
    },
    {
      "heading": "Controlla prima di salvare un evento basato sul meteo",
      "body": [
        "L’app può avviare una bozza di evento a partire da un’ora delle previsioni. Prima di salvare, controlla data, inizio, fine e calendario di destinazione della bozza. La selezione della previsione non sostituisce la verifica che tu stia creando l’impegno corretto.",
        "Se l’accesso al calendario o il calendario di destinazione impediscono il salvataggio, risolvi quell’autorizzazione separatamente dall’accesso ai dati meteo. Trovare una previsione non concede diritti di modifica su un calendario condiviso."
      ]
    },
    {
      "heading": "Usa le previsioni complete quando il riepilogo non basta",
      "body": [
        "Per un’attività all’aperto, controlla le variabili pertinenti per quell’attività e per il luogo che hai effettivamente scelto. Un widget del meteo attuale o una demo nella schermata iniziale non sostituiscono il controllo delle ore di previsione disponibili nell’app.",
        "Se noti una discrepanza, confronta prima il luogo e il timestamp. Provider diversi, luoghi selezionati diversi e periodi di previsione diversi possono produrre visualizzazioni differenti senza dimostrare che l’evento di calendario sia cambiato."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Conferma luogo e data dell’evento.",
    "Controlla le ore disponibili durante l’attività.",
    "Leggi probabilità e quantità come valori distinti.",
    "Controlla la bozza dell’evento prima di salvare."
  ],
  "seeAlso": [
    "weather-inside-your-calendar",
    "planning-outdoors-without-being-rained-on"
  ],
  "updated": "2026-10-23",
  "faq": [
    {
      "q": "Ogni evento ha una previsione completa?",
      "a": "No. La copertura dipende dal luogo selezionato e dalle date e ore disponibili."
    },
    {
      "q": "L’icona meteo è specifica per l’indirizzo dell’evento?",
      "a": "Non dedurlo dalla vicinanza all’evento. Conferma separatamente il luogo meteo."
    },
    {
      "q": "Toccando un’ora viene salvato un nuovo evento?",
      "a": "Dove disponibile, avvia una bozza di evento. Prima di salvare, controllane data, ora e calendario."
    }
  ],
  "sourcesHeading": "Fonti meteo e impostazioni della posizione",
  "sources": [
    {
      "label": "Apple: previsioni WeatherKit e disponibilità regionale",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Apple: privacy e servizi di localizzazione",
      "url": "https://support.apple.com/en-us/102515"
    }
  ],
  "comparison": {
    "heading": "Un controllo pratico prima di un evento all’aperto",
    "columns": [
      "Controllo",
      "Esempio",
      "Decisione"
    ],
    "rows": [
      {
        "cells": [
          "Luogo",
          "L’evento si svolge in un’altra città.",
          "Seleziona quella destinazione nella vista meteo e leggine il nome."
        ]
      },
      {
        "cells": [
          "Intervallo",
          "L’attività si svolge dalle 14:00 alle 16:00.",
          "Controlla entrambe le ore, oltre a eventuale preparazione o viaggio pertinenti."
        ]
      },
      {
        "cells": [
          "Copertura",
          "Sono disponibili solo alcune delle ore necessarie.",
          "Mantieni il piano provvisorio e programma un altro controllo."
        ]
      },
      {
        "cells": [
          "Evento salvato",
          "Avvii una bozza da un’ora meteo.",
          "Prima di salvare, rivedi data, fuso orario, durata e calendario di destinazione."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-right",
    "week-left"
  ],
  "galleryCaption": "Le viste meteo e settimana mostrano parti diverse dello stesso compito di pianificazione. Conferma separatamente il luogo della previsione rispetto alla posizione dell’evento.",
  "actionHeading": "Confronta le previsioni con i tuoi eventi reali",
  "actionText": "Usa Cloud Calendars su iPhone o iPad per controllare le previsioni disponibili e la tua agenda. Il meteo orienta la scelta; non sposta automaticamente un evento né conferma una modifica con i partecipanti.",
  "articleLinks": [
    {
      "slug": "weather-inside-your-calendar",
      "label": "Comprendi le viste calendario e meteo"
    },
    {
      "slug": "the-widget-that-shows-what-is-next",
      "label": "Scegli una rapida panoramica della schermata Home"
    },
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "Controlla i calendari alla base della tua agenda"
    }
  ]
},

  'planning-outdoors-without-being-rained-on': {
  "updated": "2026-10-22",
  "title": "Organizza un evento all’aperto con una previsione e un’alternativa",
  "short": "Scegli un programma all’aperto e un’alternativa praticabile",
  "description": "Organizza un evento all’aperto: controlla luogo, ore di previsione e alternativa concordata. Verifica i dettagli prima di cambiare un impegno condiviso.",
  "lede": "Il meteo aiuta a confrontare possibili orari per un’attività all’aperto, ma non promette un risultato senza pioggia. Parti dai requisiti dell’attività e dalle decisioni ancora modificabili, poi usa la previsione pertinente per orientarle. Questa guida è pubblicata da Arte Soft, sviluppatore di Cloud Calendars.",
  "commonBelief": "Controllare più spesso o spostare leggermente un’attività garantisce di evitare il maltempo.",
  "sections": [
    {
      "heading": "Definisci l’attività prima di scegliere un numero meteo",
      "body": [
        "Identifica luogo, persone coinvolte e necessità dell’attività. Un pranzo in giardino, un’attività sportiva scolastica e uno spettacolo all’aperto prenotato hanno vincoli pratici diversi. Evita di applicare a tutti un’unica percentuale generica di pioggia.",
        "Annota chi può decidere un cambiamento e l’ultimo momento utile per farlo. La scadenza di un luogo o la disponibilità di un collaboratore può limitare le opzioni prima del meteo. Questi esempi di pianificazione non forniscono limiti tecnici di sicurezza per alcuna attività."
      ]
    },
    {
      "heading": "Abbina luogo, data locale e intero intervallo",
      "body": [
        "Confronta la località meteo selezionata con il luogo reale. Includi arrivo e preparazione dove serve, poi esamina le ore disponibili durante l’attività. Una sola icona giornaliera non descrive ogni momento di un impegno lungo.",
        "Se l’evento supera le date della previsione, conserva la data concordata e programma un controllo successivo. In viaggio, confronta l’ora locale del luogo con l’appuntamento. Non sostituire implicitamente le condizioni della destinazione con una previsione per la posizione attuale."
      ]
    },
    {
      "heading": "Confronta alternative reali senza inventare intervalli asciutti",
      "body": [
        "Confronta i periodi candidati usando i valori meteo pertinenti e le loro etichette. La guida del Met Office distingue la probabilità dagli altri valori e spiega che i campi possono descrivere periodi diversi. Leggi le definizioni della fonte che utilizzi.",
        "Partire un’ora dopo può migliorare le condizioni oppure no. Considera un periodo apparentemente più adatto come informazione per il piano, non come garanzia. Non dedurre un’ora non coperta o condizioni lungo tutto il percorso da un valore relativo a un solo luogo."
      ]
    },
    {
      "heading": "Concorda un’alternativa che le persone possano davvero usare",
      "body": [
        "Un’alternativa deve risolvere il problema concreto: un luogo al chiuso autorizzato, un rinvio concordato o un’altra soluzione raggiungibile dai partecipanti. Verifica accesso, costo e disponibilità con l’organizzatore o la struttura competente.",
        "Per esempio, spostare un picnic al chiuso può fallire se nessuno ha confermato la sala. Registra chiaramente l’alternativa e stabilisci chi comunicherà la scelta finale. Una nota nel calendario privato di una persona non è un accordo condiviso."
      ]
    },
    {
      "heading": "Salva e modifica l’evento desiderato",
      "body": [
        "Prima di creare o modificare, conferma calendario di destinazione, inizio, fine e luogo. Una bozza avviata da un’ora meteo richiede comunque una verifica. La durata proposta potrebbe non coprire preparazione, viaggio o tutta l’attività.",
        "Per un appuntamento condiviso o ricorrente, verifica responsabilità dell’organizzatore, diritti di modifica e ambito della ricorrenza. Dopo una modifica autorizzata, riapri l’evento salvato. Un cambiamento locale non prova che la struttura o ogni partecipante lo abbiano accettato."
      ]
    },
    {
      "heading": "Ricontrolla quando una decisione può ancora essere utile",
      "body": [
        "Scegli un momento di verifica che lasci spazio per agire secondo le condizioni dell’impegno. Confronta l’ultima previsione pertinente e le indicazioni ufficiali o della struttura applicabili. La previsione è un elemento della decisione, non un permesso per ignorare i requisiti dell’attività.",
        "Comunica il piano finale e conferma direttamente i passaggi importanti di responsabilità. Se un aggiornamento successivo cambia la decisione, identifica l’evento e l’occorrenza da modificare. Aggiornare continuamente senza un’alternativa praticabile non elimina l’incertezza."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifica luogo, requisiti dell’attività e responsabile della decisione.",
    "Controlla la località meteo selezionata e l’intero intervallo in ora locale.",
    "Confronta solo date e ore di previsione effettivamente disponibili.",
    "Concorda un’alternativa fattibile e una scadenza decisionale.",
    "Verifica calendario di destinazione, dettagli e ambito della ricorrenza prima di salvare.",
    "Ricontrolla al momento concordato e conferma il piano finale con i partecipanti."
  ],
  "faq": [
    {
      "q": "Spostare l’evento di un’ora può garantire tempo asciutto?",
      "a": "No. Confronta i periodi disponibili e conserva un’alternativa adatta all’attività. Una previsione non è una promessa del risultato."
    },
    {
      "q": "E se la previsione non arriva alla data dell’evento?",
      "a": "Conserva l’appuntamento concordato e programma un controllo meteo successivo. L’assenza di informazioni non è una previsione di bel tempo."
    },
    {
      "q": "Posso spostare un evento condiviso se un altro orario sembra migliore?",
      "a": "Conferma prima accordo dell’organizzatore, diritti di modifica e partecipanti. Controlla ambito della ricorrenza e risultato salvato, poi comunica il cambiamento."
    }
  ],
  "seeAlso": [
    "forecast-beside-every-event",
    "weather-inside-your-calendar",
    "a-fourteen-day-view-of-the-weather",
    "month-view-on-a-bigger-screen"
  ],
  "sourcesHeading": "Fonti ufficiali e approfondimenti",
  "sources": [
    {
      "label": "Apple: informazioni di previsione WeatherKit e disponibilità regionale",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: località, periodi e valori delle previsioni",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ]
},

  'a-fourteen-day-view-of-the-weather': {
  "updated": "2026-10-22",
  "title": "Fino a quale data posso vedere il meteo in Cloud Calendars?",
  "short": "Controlla le date di previsione realmente disponibili",
  "description": "Controlla le date meteo in Cloud Calendars. Distingui copertura giornaliera e oraria, appuntamenti futuri e dimostrazione del sito.",
  "lede": "Un calendario a lungo termine e una previsione a lungo termine sono cose diverse. Puoi fissare una riunione prima che esista la sua previsione. Leggi le date disponibili nell’app invece di dedurre la copertura meteo dal mese che puoi aprire. Questa guida è pubblicata da Arte Soft, sviluppatore di Cloud Calendars.",
  "commonBelief": "Ogni data futura del calendario ha una previsione, e la dimostrazione del sito su quattordici giorni corrisponde alla copertura dell’app.",
  "sections": [
    {
      "heading": "Leggi le date nella schermata meteo",
      "body": [
        "Apri il meteo del luogo desiderato e identifica le date effettivamente elencate. Non dedurre la disponibilità dalla navigazione mensile o annuale del calendario. Una previsione assente richiede un controllo successivo; non significa bel tempo.",
        "Se organizzi un incontro tra diverse settimane, salva la data concordata e annota separatamente la decisione legata al meteo. Disponibilità del luogo, inviti e futura previsione sono elementi diversi del programma."
      ]
    },
    {
      "heading": "Comprendi l’elenco giornaliero dell’app",
      "body": [
        "L’app usa Apple WeatherKit. L’implementazione attuale dell’elenco giornaliero conserva fino a dieci giorni restituiti dal servizio. Leggi la prima e l’ultima data del luogo selezionato senza presumere che ogni vista o richiesta abbia dieci giorni completi.",
        "Questo limite descrive l’elenco giornaliero mostrato, non promette la stessa attendibilità per tutte le variabili né una previsione completa per ogni appuntamento in quelle date. Usa il livello di dettaglio necessario alla decisione."
      ]
    },
    {
      "heading": "Controlla le ore disponibili per le attività con orario preciso",
      "body": [
        "Un riepilogo giornaliero non definisce le condizioni esatte per tutta la durata di un appuntamento. Apri il giorno pertinente e confronta le ore disponibili per arrivo, attività e partenza. Se parte del periodo manca, lasciala da verificare.",
        "Per un evento serale, assicurati che luogo e data locale corrispondano ancora al programma. Un arrivo dopo mezzanotte appartiene a un’altra data. Controlla gli orari effettivi senza considerare la fine dell’elenco giornaliero come la fine di ogni serie oraria."
      ]
    },
    {
      "heading": "Distingui la dimostrazione del sito",
      "body": [
        "Il sito attualmente richiede quattordici giorni di previsione a Open-Meteo per la dimostrazione meteo. Open-Meteo documenta intervalli configurabili; questa richiesta del sito è un’implementazione distinta dall’app iOS.",
        "Non usare il risultato web per affermare che l’app fornisce quattordici giorni WeatherKit. Se le due schermate differiscono, confronta prima luogo, ora e fornitore. Un intervallo di previsione diverso non significa che il calendario abbia perso un appuntamento."
      ]
    },
    {
      "heading": "Programma un controllo quando la previsione non è ancora disponibile",
      "body": [
        "Conserva la data reale dell’impegno e organizza un controllo che lasci tempo per decidere il luogo o avvisare i partecipanti. Per esempio, una festa all’aperto può richiedere un’alternativa al chiuso concordata prima del prossimo controllo meteo.",
        "Scegli il controllo in base ai vincoli effettivi dell’attività. Questa guida non assegna percentuali di precisione o soglie universali per confermare o annullare a un determinato giorno di previsione. Consulta le informazioni aggiornate quando possono cambiare una decisione concreta."
      ]
    },
    {
      "heading": "Controlla i dettagli dopo aver scelto un orario",
      "body": [
        "Se un’ora di previsione disponibile ti aiuta a scegliere l’orario, controlla la bozza di evento risultante. Conferma data locale, inizio, fine, calendario di destinazione e luogo. Navigare nel meteo non sostituisce i permessi del calendario o l’accordo dell’organizzatore.",
        "Dopo una modifica autorizzata, riapri l’evento e verifica l’occorrenza o la serie desiderata. Conferma separatamente i cambiamenti importanti con i partecipanti. La disponibilità di nuovi dati meteo non equivale alla ricezione di un invito modificato."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Seleziona il luogo pertinente all’appuntamento.",
    "Leggi la prima e l’ultima data nell’elenco giornaliero dell’app.",
    "Controlla separatamente l’intervallo orario necessario, compreso il passaggio a mezzanotte.",
    "Distingui la copertura Open-Meteo del sito da quella WeatherKit dell’app.",
    "Organizza un controllo successivo per programmi oltre la previsione disponibile.",
    "Verifica l’evento salvato e conferma le modifiche condivise con i partecipanti."
  ],
  "faq": [
    {
      "q": "Cloud Calendars offre una previsione di quattordici giorni nell’app?",
      "a": "L’elenco giornaliero attuale usa fino a dieci giorni restituiti da WeatherKit. Il sito richiede separatamente quattordici giorni Open-Meteo. Controlla le date effettivamente disponibili nell’app."
    },
    {
      "q": "Perché posso creare un evento dopo l’ultima data meteo?",
      "a": "Il salvataggio nel calendario e la disponibilità meteo sono separati. Conserva l’appuntamento e controlla la previsione più vicino alla data."
    },
    {
      "q": "Una voce giornaliera garantisce il meteo per ogni ora dell’evento?",
      "a": "No. Controlla le ore realmente fornite per quel luogo e periodo. Non dedurre la copertura oraria completa dall’elenco giornaliero."
    }
  ],
  "seeAlso": [
    "weather-inside-your-calendar",
    "forecast-beside-every-event",
    "planning-outdoors-without-being-rained-on",
    "month-view-on-a-bigger-screen"
  ],
  "sourcesHeading": "Fonti ufficiali e approfondimenti",
  "sources": [
    {
      "label": "Apple: informazioni di previsione WeatherKit e disponibilità regionale",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Open-Meteo: parametri delle previsioni e intervalli disponibili",
      "url": "https://open-meteo.com/en/docs"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
  "updated": "2026-10-23",
  "title": "Vedi insieme i calendari Google, iCloud e Outlook su iPhone e iPad",
  "short": "Tre provider, un’unica vista",
  "description": "Combina le viste calendario e comprendi autorizzazioni degli account, copie e requisiti del piano.",
  "lede": "Per vedere insieme gli eventi di lavoro e quelli personali, collega gli account desiderati, seleziona i relativi calendari e controlla gli stessi eventi in un’unica vista. Cloud Calendars supporta la pianificazione su iPhone e iPad con iCloud e Google Calendar; il supporto a Microsoft Calendar è incluso in Premium. Vedere gli eventi insieme è diverso dal copiare gli stati di occupato tra account di provider diversi. Questa guida è pubblicata da Arte Soft, lo sviluppatore.",
  "commonBelief": "Inserire più calendari in un’unica app mantiene automaticamente allineate disponibilità, condivisione e copie degli eventi.",
  "sections": [
    {
      "heading": "Identifica l’account e il calendario dietro ogni evento",
      "body": [
        "Inizia con un evento normale per ciascun provider. Annota l’indirizzo email con cui hai effettuato l’accesso, il nome del calendario e se l’evento è tuo o se hai ricevuto un invito. Due calendari chiamati “Calendar” possono appartenere ad account completamente diversi. Un colore aiuta a leggere la settimana; sono l’account e il calendario a indicare dove deve essere fatta una modifica.",
        "Per esempio, un appuntamento dal dentista nel tuo calendario iCloud personale e una riunione di progetto in Microsoft possono apparire insieme per te. Questo, da solo, non rende l’appuntamento dal dentista visibile ai tuoi colleghi né riserva quel tempo nei loro strumenti di pianificazione.",
        "Definisci l’obiettivo prima di cambiare una connessione. Per spostare i dati degli eventi in un altro account, usa “Scegliere un formato di esportazione del calendario” qui sotto per trovare un percorso di trasferimento supportato e controlla eventi rappresentativi prima di fare affidamento sulla destinazione. Per confrontare gli orari, mantieni i proprietari attuali dei calendari e mostra insieme le fonti selezionate. Se un altro account deve ricevere gli stati di occupato, “Cloud Calendars e OneCal per flusso di lavoro” spiega in che modo la copia della disponibilità differisce da una panoramica personale."
      ]
    },
    {
      "heading": "Collega tramite il percorso appropriato",
      "body": [
        "Per iCloud, abilita prima iCloud Calendar su iPhone nell’Apple Account desiderato. La guida di configurazione Apple spiega le impostazioni del dispositivo. Cloud Calendars accede ai calendari disponibili tramite il sistema calendario di iPhone e ha bisogno dell’accesso al calendario per leggerli. Non basta che un account sia collegato su un altro dispositivo.",
        "Cloud Calendars offre anche le azioni “Accedi con Google” e “Accedi con Microsoft”. Controlla quale account selezioni al momento dell’accesso, poi apri il relativo gruppo di calendari e seleziona quelli che ti servono. Accedere al provider giusto con l’identità personale o di lavoro sbagliata può produrre un elenco calendari perfettamente valido ma inatteso."
      ]
    },
    {
      "heading": "Comprendi i piani senza confonderli con le autorizzazioni",
      "body": [
        "Il piano Base include la sincronizzazione con Google Calendar e le viste calendario. Advanced aggiunge la rimozione degli annunci a Base. Premium aggiunge le funzioni Microsoft Calendar e Microsoft Teams. Controlla il prezzo locale attuale e il periodo di fatturazione prima dell’acquisto.",
        "Un piano cambia quali funzioni dell’app sono disponibili; non ti concede la proprietà del calendario di qualcun altro. Google distingue tra autorizzazione a vedere gli eventi e autorizzazione a modificarli. Restano valide anche le policy del datore di lavoro e le autorizzazioni associate a un calendario Microsoft. Un evento visibile o un editor disponibile non dimostrano che il provider accetterà un aggiornamento."
      ]
    },
    {
      "heading": "Una vista combinata può includere copie del calendario",
      "body": [
        "Le connessioni Google e Microsoft usano copie del calendario nel sistema calendario di iPhone per presentare e sincronizzare gli eventi. Non presumere che collegare un account significhi non lasciare alcuna copia al di fuori del provider originale. La destinazione usata per queste copie può dipendere dalle fonti calendario disponibili sul dispositivo.",
        "Se lo stesso account raggiunge il telefono anche tramite un altro percorso, controlla i nomi e le fonti dei calendari prima di considerare gli eventi ripetuti come eventi separati. Nascondi temporaneamente un calendario per identificare quale visualizzazione fornisce. Non eliminare un evento o un calendario solo per rendere la schermata più ordinata: una copia collegata può rimandare le modifiche al suo provider."
      ]
    },
    {
      "heading": "Continua a scegliere la destinazione quando crei un evento",
      "body": [
        "Prima di salvare, controlla il calendario dell’evento con la stessa attenzione riservata a data e ora. Per un appuntamento di famiglia, scegli il calendario che la famiglia usa davvero; per una riunione di lavoro, usa la destinazione di lavoro consentita. Vedere insieme entrambi i calendari non rende automaticamente uno dei due la destinazione di ogni nuovo evento.",
        "Cambiare il calendario di un evento o trascinarlo da un calendario all’altro può essere uno spostamento, non una seconda vista innocua. Mantieni inviti e riunioni ricorrenti nel loro calendario abituale mentre analizzi un problema di visualizzazione. Se devi apportare una modifica, stabilisci prima chi è il proprietario dell’evento e quale calendario può accettarla."
      ]
    },
    {
      "heading": "Verifica la panoramica prima di farci affidamento",
      "body": [
        "Confronta un evento recente nel calendario del provider con l’evento corrispondente in Cloud Calendars. Controlla data, fuso orario, titolo e calendario selezionato. Per un calendario modificabile di tua proprietà, un evento usa e getta senza invitati è un controllo migliore che modificare una riunione reale. Conferma il risultato nel provider prima di considerare pronta la connessione.",
        "Non fare affidamento sulla vista combinata per creare automaticamente blocchi di occupato anonimi in un altro account. Se hai bisogno che i colleghi ti vedano come non disponibile senza vedere i dettagli personali, usa una soluzione di disponibilità esplicitamente approvata e verificala dal loro lato. Una panoramica personale chiara e la disponibilità condivisa sono attività distinte."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Elenca l’account esatto e il calendario di un evento per ciascun provider.",
    "Abilita sul dispositivo i calendari iCloud desiderati e controlla l’accesso al calendario.",
    "Usa l’accesso Google o Microsoft appropriato e seleziona i calendari desiderati.",
    "Confronta un evento recente con la vista del provider prima di modificare qualsiasi cosa.",
    "Nascondi temporaneamente una fonte che sospetti duplicata; lascia intatti gli eventi sottostanti.",
    "Controlla il calendario di destinazione per ogni nuovo evento e verifica separatamente ogni condivisione degli stati di occupato di cui hai bisogno."
  ],
  "faq": [
    {
      "q": "I miei colleghi di lavoro vedranno i miei eventi personali perché visualizzo entrambi i calendari?",
      "a": "Visualizzare insieme i calendari non è un’istruzione di condivisione né un collegamento automatico degli stati di occupato. Controlla le impostazioni di condivisione effettive di ciascun calendario. Le connessioni ai provider possono creare copie del calendario sul dispositivo, quindi una vista combinata non garantisce nemmeno che i dati degli eventi esistano solo presso il provider originale."
    },
    {
      "q": "Perché riesco a vedere un evento ma non a modificarlo correttamente?",
      "a": "Il calendario potrebbe essere di sola lettura, l’evento potrebbe appartenere a un altro organizzatore oppure il provider potrebbe rifiutare l’aggiornamento. Controlla proprietà e autorizzazioni nel calendario del provider. Acquistare un piano dell’app superiore non modifica tali autorizzazioni."
    },
    {
      "q": "Dovrei collegare lo stesso account Google tramite ogni percorso disponibile?",
      "a": "Per prima cosa, controlla come appare già sul telefono. Più percorsi possono complicare l’identificazione delle copie del calendario. Scegli il percorso che intendi usare, verifica i relativi eventi e, durante le verifiche, nascondi una visualizzazione in più invece di eliminare dati o scollegare account come primo passo."
    }
  ],
  "sourcesHeading": "Fonti e riferimenti per la configurazione",
  "sources": [
    {
      "label": "Apple: configurare iCloud Calendar sui tuoi dispositivi",
      "url": "https://support.apple.com/guide/icloud/set-up-calendar-mme4d73a8727/icloud"
    },
    {
      "label": "Google: condivisione del calendario e autorizzazioni",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: API del calendario di Outlook e dati delle caselle di posta supportati",
      "url": "https://learn.microsoft.com/en-us/graph/outlook-calendar-concept-overview"
    }
  ],
  "seeAlso": [
    "exchange-calendars-on-an-iphone",
    "what-calendar-sync-actually-does",
    "when-two-calendars-disagree",
    "caldav-calendar-on-iphone",
    "calendar-export-ics-pdf-and-backup",
    "onecal-alternative-iphone-calendar-view-or-sync"
  ],
  "comparison": {
    "heading": "Vista combinata, abbonamento o tempo occupato copiato?",
    "columns": [
      "Di cosa hai bisogno",
      "Cosa controllare",
      "Cosa non dare per scontato"
    ],
    "rows": [
      {
        "cells": [
          "Un’unica vista di più account",
          "L’account collegato, il calendario selezionato e il piano richiesto.",
          "Che una schermata condivisa unisca proprietà o autorizzazioni."
        ]
      },
      {
        "cells": [
          "Una modifica a un evento che raggiunge il provider",
          "L’evento originale, l’autorizzazione in scrittura e il risultato salvato alla fonte.",
          "Che una modifica locale visibile dimostri una sincronizzazione riuscita con il provider."
        ]
      },
      {
        "cells": [
          "Tempo occupato in un altro account",
          "Un servizio con regole esplicite di sincronizzazione da origine a destinazione.",
          "Che una vista combinata crei blocchi di disponibilità per i colleghi."
        ]
      },
      {
        "cells": [
          "Un feed di calendario in abbonamento",
          "L’editore, il comportamento di aggiornamento e lo stato di sola lettura.",
          "Che un abbonamento ICS sia una connessione bidirezionale modificabile."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-left",
    "hook"
  ],
  "galleryDevice": "iPad",
  "galleryCaption": "Le vere viste del calendario su iPad illustrano la revisione di una pianificazione. Uno screenshot non dimostra la direzione della sincronizzazione del provider né le autorizzazioni dell’account.",
  "actionHeading": "Controlla insieme i tuoi calendari su iPhone e iPad",
  "actionText": "La sincronizzazione di Google Calendar è inclusa in Base. Advanced rimuove la pubblicità; Premium aggiunge il supporto per Microsoft Calendar e Teams. Conferma le autorizzazioni dell’account indipendentemente dal piano acquistato.",
  "articleLinks": [
    {
      "slug": "onecal-alternative-iphone-calendar-view-or-sync",
      "label": "Confronta una vista combinata con le regole di sincronizzazione di OneCal"
    },
    {
      "slug": "fantastical-readdle-calendar366-iphone-comparison",
      "label": "Confronta i flussi di lavoro del calendario su iPhone"
    },
    {
      "slug": "weather-inside-your-calendar",
      "label": "Pianifica con meteo ed eventi insieme"
    }
  ]
},

  'three-calendar-apps-is-two-too-many': {
  "title": "Riunisci i calendari su iPhone senza perdere di vista gli eventi",
  "short": "Una vista comune da verificare",
  "description": "Riunisci i calendari su iPhone. Verifica account, copie, modifiche e notifiche prima di cambiare il tuo modo di organizzarti.",
  "lede": "Una vista comune può aiutarti a confrontare gli impegni di più account. Inizia verificando cosa comprende e dove vengono salvate le modifiche. Questa guida è pubblicata da Arte Soft, sviluppatore di Cloud Calendars.",
  "commonBelief": "Sostituire più app di calendario significa unire tutti i calendari ed eliminare subito le altre app.",
  "sections": [
    {
      "heading": "Decidi a cosa deve servire la vista comune",
      "body": [
        "Elenca i calendari che incidono su una decisione concreta: per esempio, le riunioni di lavoro, gli appuntamenti personali e un calendario familiare condiviso. Identifica gli account e il proprietario di ogni calendario. Più calendari nello stesso account Google restano calendari distinti.",
        "Decidi se vuoi vedere gli impegni insieme, modificare gli eventi originali o copiare la disponibilità in un altro account. Sono esigenze diverse. Una vista comune aiuta a confrontare gli orari, ma da sola non rende visibile un appuntamento personale nel sistema con cui i colleghi organizzano il lavoro."
      ]
    },
    {
      "heading": "Verifica le regole aziendali prima di collegare un account",
      "body": [
        "Per un account di lavoro, usa il metodo di connessione consentito dalla tua organizzazione. Conserva l’app approvata quando serve per rispondere agli inviti, usare un accesso delegato o svolgere altre attività lavorative. Un’app di calendario personale a pagamento non può concederti permessi che non hai.",
        "Se la connessione non riesce, annota il tipo di account e la fase in cui si è verificato il problema, invece di cambiare ripetutamente password o eliminare account. Un accesso non autorizzato, un errore di connessione e un calendario semplicemente nascosto richiedono soluzioni diverse. Chiedi all’amministratore se non è chiaro quale metodo sia consentito."
      ]
    },
    {
      "heading": "Aggiungi gli account senza presumere che non vengano create copie",
      "body": [
        "Cloud Calendars può mostrare i calendari iOS selezionati accanto ai calendari Google e Microsoft collegati. Le connessioni ai provider utilizzano copie dei calendari nel sistema di calendario dell’iPhone. Non si tratta quindi della promessa di una connessione di sola visualizzazione che non memorizzi mai un’altra rappresentazione di un evento.",
        "Prima di aggiungere un secondo collegamento allo stesso account, verifica come compare già sul telefono. Un calendario disponibile sia tramite iOS sia tramite una connessione separata nell’app può essere difficile da riconoscere solo dal nome. Controlla il calendario e la sua sorgente, senza presumere che voci con nomi simili siano intercambiabili."
      ]
    },
    {
      "heading": "Verifica un appuntamento di prova in entrambe le direzioni",
      "body": [
        "Crea un appuntamento di prova senza conseguenze e con un nome riconoscibile nel calendario previsto in cui puoi scrivere. Verifica che compaia nell’interfaccia del provider. Modificane il titolo lì, torna alla vista comune e controlla lo stesso evento. Poi fai una piccola modifica di prova dalla vista comune e confermala presso il provider.",
        "Questo controllo riguarda la tua configurazione effettiva e non garantisce un tempo di aggiornamento. Usa un normale appuntamento di cui sei proprietario, senza invitati né ripetizioni, così la prova non invia inviti modificati ad altre persone. Lascia invariate le riunioni reali finché non hai capito quale collegamento presenta il problema."
      ]
    },
    {
      "heading": "Restringi la visualizzazione prima di eliminare qualcosa",
      "body": [
        "Se la vista comune mostra duplicati, nascondi temporaneamente un calendario e annota quale voce scompare. Confronta account, calendario, organizzatore e orario prima di decidere se esistono due eventi salvati o due modi di visualizzare lo stesso evento. Nomi uguali non bastano a giustificare un’eliminazione. Annota la selezione iniziale e ripristinala dopo il confronto. In Cloud Calendars, la selezione può influire anche sui widget, sulla programmazione delle notifiche e sulla sincronizzazione con Google.",
        "Apple spiega come mostrare o nascondere i calendari usando le caselle nell’elenco dei calendari. Nascondere è un utile primo controllo della visualizzazione; eliminare un evento o un account può avere conseguenze più ampie. Conserva la sorgente e gli eventuali backup necessari mentre verifichi il problema."
      ]
    },
    {
      "heading": "Scegli una nuova routine dopo le verifiche",
      "body": [
        "Usa la vista comune come schermata abituale per organizzarti se comprende i calendari che ti servono. Conserva un’altra app approvata per le attività che quella vista non supporta, come una procedura di invito specifica della tua organizzazione. Passare meno spesso da un’app all’altra può essere utile senza affidare a una sola app tutte le funzioni di ogni account.",
        "Controlla le notifiche separatamente. Vedere un evento una sola volta non dimostra che ad avvisarti sarà una sola app o un solo dispositivo. Cloud Calendars Base comprende la sincronizzazione con Google e le viste di calendario; Advanced rimuove gli annunci, mentre Premium aggiunge il supporto per i calendari Microsoft e Microsoft Teams. Verifica i prezzi locali e i permessi degli account prima di abbonarti."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Elenca i calendari e gli account a cui appartengono che ti servono per organizzarti.",
    "Verifica l’approvazione aziendale e conserva le app di lavoro necessarie.",
    "Controlla i collegamenti esistenti prima di aggiungere un’altra connessione al provider.",
    "Segui un appuntamento di prova fino al provider e poi nella direzione opposta.",
    "Nascondi il calendario che sembra duplicato prima di valutare un’eliminazione, poi ripristina la selezione iniziale.",
    "Controlla gli avvisi separatamente dalla vista del calendario."
  ],
  "faq": [
    {
      "q": "Devo eliminare le altre app di calendario?",
      "a": "No. Conserva le app necessarie e la configurazione attuale mentre verifichi la nuova vista comune. Usa ogni app per le attività che hai controllato."
    },
    {
      "q": "I colleghi vedranno che sono occupato durante gli appuntamenti personali?",
      "a": "Una vista comune sul telefono non dimostra che un altro account riceva la tua disponibilità. È un’esigenza distinta di condivisione o sincronizzazione."
    },
    {
      "q": "Collegare un provider significa che i dati rimangono soltanto presso quel provider?",
      "a": "Non darlo per scontato. Cloud Calendars usa copie dei calendari dei provider nel sistema di calendario iOS. Verifica il collegamento effettivo dell’account e dove vengono archiviati i dati prima di connettere calendari sensibili."
    }
  ],
  "sourcesHeading": "Indicazioni ufficiali su configurazione e visibilità dei calendari",
  "sources": [
    {
      "label": "Apple: configurare più calendari su iPhone",
      "url": "https://support.apple.com/guide/iphone/use-multiple-calendars-iph3d1110d4/ios"
    },
    {
      "label": "Apple: nascondere i calendari per individuare i duplicati",
      "url": "https://support.apple.com/en-us/102180"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "calendar-notifications-missing-silent-or-duplicated"
  ],
  "updated": "2026-10-22"
},

  'the-widget-that-shows-what-is-next': {
  "updated": "2026-10-23",
  "title": "Widget calendario su iPhone e iPad: prossimi eventi e meteo",
  "short": "Prossimi eventi nella schermata Home",
  "description": "Scegli un widget Cloud Calendars per i prossimi eventi, la data o il meteo.",
  "lede": "Scegli Calendar Events o Calendar Events Large se vuoi vedere i prossimi eventi nella schermata Home. Scegli Calendar & Weather per una visualizzazione di data e meteo. Questi layout rispondono a domande diverse; prima di aggiungerne uno, visualizza in anteprima quello disponibile sul tuo dispositivo. Questa guida è pubblicata da Arte Soft, lo sviluppatore di Cloud Calendars.",
  "sections": [
    {
      "heading": "Scegli prima il layout degli eventi",
      "body": [
        "Nella galleria widget di Cloud Calendars, Calendar Events è il layout medio con elenco eventi. Calendar Events Large offre più spazio per i prossimi eventi. Calendar & Weather è un layout separato con data e meteo; nelle dimensioni piccole non garantisce una riga con il prossimo evento. I nomi potrebbero apparire tradotti sul tuo dispositivo.",
        "Su iPhone, tieni premuta un’area vuota della schermata Home, scegli Modifica e Aggiungi widget, quindi cerca Cloud Calendars e seleziona il layout desiderato. Confronta l’anteprima prima di aggiungerlo. Le istruzioni Apple sui widget si riferiscono a questa galleria di sistema, che è distinta dalle viste calendario all’interno dell’app."
      ]
    },
    {
      "heading": "Aggiungi e controlla il widget su iPad",
      "body": [
        "Su iPad, usa la galleria widget della schermata Home di Apple: tieni premuto lo sfondo, apri Modifica, quindi Aggiungi widget. Cerca Cloud Calendars, esamina stili e dimensioni disponibili, aggiungi il layout che ti serve, posizionalo e concludi con Fine. Segui i comandi mostrati dalla tua versione di iPadOS; un’anteprima non conferma che i dati del calendario siano stati caricati.",
        "Scegli Calendar Events o Calendar Events Large se ti servono gli eventi. Confronta gli stili offerti dall’app installata; un riquadro con data e meteo risponde a un’esigenza diversa rispetto a un elenco eventi.",
        "Apri Cloud Calendars su quell’iPad e trova un evento futuro con orario in un calendario selezionato. Una visualizzazione corretta su iPhone non conferma gli account, gli accessi o i dati caricati su iPad. Confronta titolo, data e ora di inizio, poi passa ai controlli di idoneità e aggiornamento qui sotto se il widget è diverso."
      ]
    },
    {
      "heading": "Controlla cosa viene considerato imminente",
      "body": [
        "La visualizzazione degli eventi usa i calendari selezionati e gli eventi futuri con orario. Le voci per l’intera giornata e gli eventi la cui ora di inizio è già passata sono esclusi da questo elenco dei prossimi eventi. Per questo motivo, un compleanno o una riunione già in corso possono essere visibili nell’app senza comparire qui.",
        "Per esempio, se oggi hai solo una voce di viaggio per l’intera giornata, un elenco dei prossimi eventi vuoto non significa che quella voce sia andata persa. Apri l’app per controllare l’intera giornata. Allo stesso modo, il prossimo evento con orario potrebbe essere domani o più avanti; leggi la data invece di presumere che ogni riga si riferisca a oggi."
      ]
    },
    {
      "heading": "Distingui un evento mancante da un elenco che ha esaurito le righe disponibili",
      "body": [
        "Un widget mostra un numero limitato di prossimi eventi. Se gli eventi precedenti occupano tutte le righe, un evento successivo può non apparire anche se è presente nell’app ed è idoneo per l’elenco dei prossimi eventi. Un layout eventi più grande può mostrare più righe, ma non rappresenta comunque l’intero calendario.",
        "Inizia dall’evento futuro con orario più vicino in un calendario selezionato. Se appare, ma uno successivo no, apri l’app per controllare il resto della pianificazione. Se manca anche l’evento idoneo più vicino, continua con i controlli su selezione del calendario, accesso e aggiornamento. Non spostare né eliminare eventi solo per far apparire una voce successiva."
      ]
    },
    {
      "heading": "Usa l’app come primo termine di confronto",
      "body": [
        "Apri Cloud Calendars e trova un evento futuro con orario ben preciso. Conferma che il calendario a cui appartiene sia selezionato e che l’app abbia l’accesso al calendario necessario. Confronta titolo, data e ora di inizio con il widget. Se l’evento manca anche nell’app, verifica prima l’account o la sincronizzazione.",
        "Se ti serve un esempio chiaro, usa un evento di prova innocuo in un calendario di tua proprietà. Assegnagli un orario futuro e un titolo facilmente riconoscibile. Evita di modificare un invito reale o di rimuovere account solo per testare la schermata Home."
      ]
    },
    {
      "heading": "Considera gli aggiornamenti senza presumere una scadenza fissa",
      "body": [
        "I widget mostrano informazioni salvate e non funzionano in modo continuo come un’app aperta. Apple controlla la pianificazione dei loro aggiornamenti. Aprire l’app e controllare l’evento ti dà un termine di paragone aggiornato, ma non stabilisce un numero esatto di secondi entro cui il widget debba cambiare.",
        "Se l’app continua a essere corretta mentre il widget resta errato, annota il layout, il calendario selezionato, l’ora dell’evento e le versioni dell’app e di iOS. Un elenco vuoto, un evento vecchio e un orario errato sono osservazioni diverse; segnala quale di queste stai vedendo."
      ]
    },
    {
      "heading": "Leggi il meteo come riepilogo separato",
      "body": [
        "Il meteo accanto alla data non è una previsione associata al luogo e all’ora di inizio di ciascun evento. Prima di un evento all’aperto, apri la vista meteo e controlla il luogo e l’ora previsti. Un’icona delle condizioni attuali non può stabilire quali saranno le condizioni in una riunione successiva.",
        "Tieni questo widget per un orientamento rapido. Usa il calendario completo per gli impegni di tutta la giornata, i dettagli degli eventi e le decisioni che richiedono l’intera pianificazione."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Scegli Calendar Events o Calendar Events Large per un elenco eventi.",
    "Verifica un evento futuro con orario in un calendario selezionato.",
    "Confronta data e ora nell’app prima di risolvere i problemi del widget.",
    "Registra le differenze persistenti invece di eliminare i dati del calendario."
  ],
  "faq": [
    {
      "q": "Perché il mio compleanno non compare?",
      "a": "L’elenco dei prossimi eventi esclude gli eventi di tutta la giornata. Controlla il calendario completo per compleanni e altre voci senza orario."
    },
    {
      "q": "Il widget piccolo mostra la prossima riunione?",
      "a": "Il layout piccolo Calendar & Weather mostra data e meteo. Scegli un layout con elenco eventi per gli eventi."
    },
    {
      "q": "Se non ci sono prossimi eventi significa che oggi sono libero?",
      "a": "No. Voci per l’intera giornata, eventi in corso, calendari non selezionati e informazioni non aggiornate possono cambiare questa conclusione."
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
    },
    {
      "label": "Apple: aggiungere, modificare e rimuovere widget su iPad",
      "url": "https://support.apple.com/guide/ipad/add-edit-and-remove-widgets-ipadb0de8630/ipados"
    }
  ],
  "seeAlso": [
    "choosing-a-widget-size",
    "a-countdown-to-your-next-meeting",
    "calendar-on-apple-watch"
  ],
  "comparison": {
    "heading": "Scegli la visualizzazione di cui hai davvero bisogno",
    "columns": [
      "Visualizzazione",
      "Usala per",
      "Controlla prima di farci affidamento"
    ],
    "rows": [
      {
        "cells": [
          "Calendar Events",
          "Una vista compatta dei prossimi eventi con orario.",
          "L’evento appartiene a un calendario selezionato e non è ancora iniziato."
        ]
      },
      {
        "cells": [
          "Calendar Events Large",
          "Più spazio per i prossimi eventi.",
          "Anche un layout più grande ha comunque un numero limitato di righe."
        ]
      },
      {
        "cells": [
          "Calendar & Weather",
          "Una rapida panoramica di data e meteo.",
          "Il suo layout piccolo non garantisce una riga con il prossimo evento."
        ]
      },
      {
        "cells": [
          "Live Activity",
          "Un conto alla rovescia separato per il prossimo evento nelle superfici supportate di iPhone.",
          "Non è un widget della schermata Home né un layout widget dedicato per la schermata di blocco."
        ]
      }
    ]
  },
  "galleryKinds": [
    "widgets",
    "live"
  ],
  "galleryCaption": "I widget della schermata Home e la Live Activity sono visualizzazioni separate. Seleziona il layout che corrisponde alle informazioni di cui hai bisogno.",
  "actionHeading": "Metti la parte utile della tua pianificazione sulla schermata Home",
  "actionText": "Apri Cloud Calendars, controlla un evento futuro con orario che conosci e poi aggiungi il widget appropriato sul tuo iPhone o iPad. L’app resta il punto di riferimento per controllare il calendario completo.",
  "articleLinks": [
    {
      "slug": "weather-inside-your-calendar",
      "label": "Controlla il meteo accanto alla tua pianificazione"
    },
    {
      "slug": "forecast-beside-every-event",
      "label": "Controlla gli orari di un evento all’aperto"
    },
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "Controlla i tuoi account calendario collegati"
    }
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
    "who-can-see-what-in-google-calendar",
    "a-calendar-that-is-yours-to-share"
  ]
},

  'free-google-sync-without-adverts': {
  "updated": "2026-10-22",
  "title": "Sincronizzazione Google gratuita su iPhone: funzioni incluse e pubblicità",
  "short": "Google gratis e pubblicità",
  "description": "Google Calendar è incluso in Base. Advanced rimuove la pubblicità; Premium aggiunge Microsoft e Teams. Verifica permessi e prezzo locale.",
  "lede": "Cloud Calendars è sviluppato da Arte Soft, che pubblica anche questa guida. La sincronizzazione con Google Calendar è inclusa nel piano gratuito Base. L’app gratuita può mostrare pubblicità; Advanced la rimuove. Un abbonamento e il permesso di modificare il calendario di un’altra persona sono due cose distinte.",
  "commonBelief": "Una connessione gratuita al calendario sarebbe solo una prova, oppure un piano senza pubblicità darebbe automaticamente più permessi sui calendari condivisi.",
  "sections": [
    {
      "heading": "Parti dalla connessione che ti serve",
      "body": [
        "Base include sincronizzazione con Google Calendar, supporto per Google Meet, viste del calendario, meteo e widget della schermata Home. Devi comunque collegare l’account Google previsto e selezionare i calendari da visualizzare. Un calendario condiviso in sola lettura resta tale indipendentemente dal piano dell’app.",
        "Puoi usare calendari locali sul dispositivo senza creare un account dell’app. Collegare un fornitore e usare i servizi di condivisione può richiedere l’accesso. Il permesso di leggere i calendari dell’iPhone non significa che tu abbia collegato tutti i tuoi calendari Google."
      ]
    },
    {
      "heading": "Che cosa cambia con un piano a pagamento",
      "body": [
        "Advanced comprende le funzioni di Base e rimuove la pubblicità. Il pagamento non cambia i permessi di condivisione di Google e non dà priorità alle previsioni meteo. La rimozione della pubblicità non conferisce il diritto di modificare calendari appartenenti ad altri account.",
        "Premium comprende Advanced e aggiunge Microsoft Calendar e Microsoft Teams. Un acquisto non può superare le restrizioni della tua organizzazione sulle connessioni esterne. Verifica la connessione che ti serve prima di farvi affidamento per il lavoro."
      ]
    },
    {
      "heading": "Prova una settimana normale prima di decidere",
      "body": [
        "Seleziona un piccolo gruppo di calendari reali, controlla che compaiano gli eventi corretti e crea un evento di prova eliminabile in un calendario modificabile. Verifica dove viene salvato: vedere due account nella stessa vista non significa che i loro eventi siano stati uniti.",
        "Valuta separatamente se la pubblicità disturba il tuo uso e se ti serve il supporto Microsoft. Non occorre scegliere un piano superiore solo perché un’altra persona usa un fornitore diverso. Controlla prezzo locale e periodo di fatturazione prima dell’acquisto."
      ]
    },
    {
      "heading": "Gestisci l’acquisto con l’Apple Account corretto",
      "body": [
        "Per un abbonamento fatturato da Apple, apri Impostazioni, tocca il tuo nome e poi Abbonamenti per controllare piano e opzioni di disdetta. Se l’acquisto non compare, verifica l’Apple Account indicato sulla ricevuta. L’accesso a un fornitore di calendari è distinto dall’Apple Account che possiede l’abbonamento.",
        "Rimuovere l’app non è il modo per gestire il rinnovo. Prima di cambiare account o cancellare dati locali, accertati di sapere quali calendari sono locali e quali sono conservati presso un fornitore."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Collega l’account Google previsto e controlla i calendari selezionati.",
    "Verifica il permesso di modifica con un evento di prova nella destinazione corretta.",
    "Usa Base per valutare le viste, il meteo e i widget che ti servono.",
    "Scegli Advanced per rimuovere la pubblicità; valuta Premium se ti servono Microsoft Calendar o Teams.",
    "Controlla prezzo locale, periodo di fatturazione e Apple Account usato per l’acquisto."
  ],
  "faq": [
    {
      "q": "Serve Advanced per sincronizzare Google Calendar?",
      "a": "No. La sincronizzazione con Google Calendar è inclusa in Base. Advanced rimuove la pubblicità; Premium aggiunge Microsoft Calendar e Teams."
    },
    {
      "q": "Pagare mi permette di modificare un calendario condiviso in sola lettura?",
      "a": "No. Il permesso di modifica dipende dal proprietario del calendario e dal fornitore. Un abbonamento all’app non concede diritti sul calendario di un’altra persona."
    }
  ],
  "sourcesHeading": "Fonti e assistenza per gli acquisti",
  "sources": [
    {
      "label": "Apple: annullare un abbonamento",
      "url": "https://support.apple.com/it-it/118428"
    }
  ],
  "seeAlso": [
    "what-a-subscription-actually-buys",
    "icloud-google-and-outlook-in-one-view"
  ]
},

  'what-a-subscription-actually-buys': {
  "updated": "2026-10-22",
  "claims": {},
  "title": "Abbonamenti Cloud Calendars: Base, Advanced e Premium",
  "short": "Scegli un piano Cloud Calendars",
  "description": "Base include Google, viste, meteo e widget. Advanced rimuove la pubblicità; Premium aggiunge Microsoft e Teams. Verifica acquisto e permessi.",
  "lede": "Cloud Calendars è sviluppato da Arte Soft, che pubblica anche questa guida. Scegli Advanced per rimuovere la pubblicità oppure Premium per aggiungere anche Microsoft Calendar e Teams. Distingui le funzioni del piano dai permessi del fornitore e dall’Apple Account che paga l’abbonamento.",
  "commonBelief": "Advanced sbloccherebbe la condivisione Google o un meteo prioritario, mentre Premium permetterebbe di aggirare le restrizioni di un calendario di lavoro.",
  "sections": [
    {
      "heading": "Base: il punto di partenza gratuito",
      "body": [
        "Base include sincronizzazione con Google Calendar, supporto per Google Meet, diverse viste del calendario, meteo e widget della schermata Home. L’app gratuita può mostrare pubblicità. I calendari locali permettono di iniziare sul dispositivo; collegamenti ai fornitori e condivisione hanno requisiti propri.",
        "Se i tuoi calendari soddisfano già le tue esigenze con Base, la presenza di un piano a pagamento non è di per sé un motivo per cambiare. Valuta come usi effettivamente il calendario prima di scegliere."
      ]
    },
    {
      "heading": "Advanced: le funzioni di Base senza pubblicità",
      "body": [
        "Advanced comprende le funzioni di Base e rimuove la pubblicità. Il pagamento non cambia i permessi di condivisione di Google né aggiunge una priorità agli aggiornamenti meteo. La creazione di link Meet continua a dipendere dal calendario e dal contesto dell’evento.",
        "Rimuovere la pubblicità cambia l’esperienza d’uso. Non concede al tuo account il diritto di modificare il calendario in sola lettura di un’altra persona e non risolve le restrizioni dell’organizzazione sulle connessioni."
      ]
    },
    {
      "heading": "Premium: Microsoft Calendar e Teams",
      "body": [
        "Premium comprende Advanced e aggiunge Microsoft Calendar e Microsoft Teams. Un’organizzazione lavorativa o scolastica può limitare app esterne, account o creazione di riunioni. Verifica la connessione prevista e i permessi, senza presumere che ogni configurazione Exchange sia supportata.",
        "Anche la creazione di un link di riunione dipende dal fornitore e dal contesto dell’evento. Questa funzione non garantisce che ogni evento di ogni calendario riceva automaticamente un link per una conferenza."
      ]
    },
    {
      "heading": "Leggi la schermata di acquisto locale",
      "body": [
        "Prima di confermare, controlla piano, prezzo locale, periodo di fatturazione e condizioni di rinnovo. Confronta l’opzione mensile con quella annuale corrispondente, invece di moltiplicare un prezzo promozionale di un altro Paese. La schermata di acquisto attuale è più utile di un articolo con un importo fisso destinato a invecchiare.",
        "L’Apple Account usato per il pagamento è distinto dagli account Google, Microsoft e dall’identità usata per condividere nell’app. Conserva la ricevuta e controlla quale Apple Account possiede l’abbonamento se non compare dove ti aspetti."
      ]
    },
    {
      "heading": "Disdici il rinnovo senza confonderlo con la cancellazione dei dati",
      "body": [
        "Su iPhone, Apple indica il percorso Impostazioni, il tuo nome, Abbonamenti e poi l’abbonamento interessato. Leggi lo stato e le informazioni sulla scadenza. Eliminare l’app, cancellare un evento o scollegare un fornitore non sostituisce la gestione del rinnovo.",
        "Prima di cambiare piano o rimuovere dati locali, controlla a cosa potrai ancora accedere e quale calendario contiene gli eventi importanti. Questa guida non promette che ogni connessione o funzione a pagamento resti disponibile dopo la scadenza. Non consiglia neppure di eliminare calendari per risolvere problemi di fatturazione."
      ]
    }
  ],
  "practical": [
    "Decidi se ti servono la rimozione della pubblicità, il supporto Microsoft o nessuno dei due.",
    "Verifica proprietà del calendario e accesso al fornitore separatamente dal piano.",
    "Leggi la schermata di acquisto locale e il periodo di fatturazione.",
    "Conserva la ricevuta Apple e annota l’account usato per il pagamento.",
    "Gestisci il rinnovo nelle impostazioni degli abbonamenti Apple; considera le modifiche ai dati del calendario un’operazione separata."
  ],
  "faq": [
    {
      "q": "Che cosa aggiunge Advanced?",
      "a": "Advanced rimuove la pubblicità e comprende le funzioni di Base. Sincronizzazione con Google Calendar, viste, meteo, widget e supporto per Google Meet sono già inclusi in Base."
    },
    {
      "q": "Che cosa aggiunge Premium?",
      "a": "Premium comprende Advanced e aggiunge Microsoft Calendar e Microsoft Teams, nel rispetto dei permessi dell’account del fornitore e dell’organizzazione."
    },
    {
      "q": "Eliminare Cloud Calendars annulla l’abbonamento?",
      "a": "Gestisci un abbonamento fatturato da Apple nelle impostazioni degli abbonamenti Apple. Rimuovere l’app o scollegare un fornitore di calendari è un’operazione distinta."
    },
    {
      "q": "Condividere un acquisto con la famiglia condivide anche i calendari?",
      "a": "Controlla separatamente acquisto e calendario. In famiglia di Apple supporta acquisti e abbonamenti idonei: verifica l’idoneità attuale del prodotto specifico, senza presumere che ogni acquisto sia condivisibile. L’accesso al calendario dipende comunque dall’invito, dal link condiviso o dai permessi del fornitore. Per un calendario condiviso in Cloud Calendars, il destinatario deve usare l’identità prevista, accettare il calendario e controllare l’accesso ottenuto. Un acquisto condiviso non conferma che un familiare possa leggere o modificare il tuo calendario."
    }
  ],
  "sourcesHeading": "Informazioni su acquisti e disdetta",
  "sources": [
    {
      "label": "Apple: annullare un abbonamento",
      "url": "https://support.apple.com/it-it/118428"
    },
    {
      "label": "Cloud Calendars su App Store",
      "url": "https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319"
    },
    {
      "label": "Apple: contenuti e acquisti idonei per In famiglia",
      "url": "https://support.apple.com/en-ie/111114"
    }
  ],
  "seeAlso": [
    "free-google-sync-without-adverts",
    "icloud-google-and-outlook-in-one-view"
  ]
},
};
