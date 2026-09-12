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
    practical: [
      'Di norma libero/occupato per chi deve solo prenotare del tempo con te.',
      'Tieni «apportare modifiche» per chi pianifica davvero al posto tuo.',
      'Rivedi due volte l’anno chi ha accesso: le condivisioni si accumulano e nulla te lo ricorda.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'what-guests-can-do-to-your-event'],
  },

  'why-a-shared-calendar-does-not-appear': {
    title: 'Ti hanno condiviso un calendario e non c’è',
    short: 'Calendario condiviso che non compare',
    description:
      'Qualcuno ha condiviso un calendario, hai accettato e non è cambiato nulla. I quattro motivi ordinari, nell’ordine in cui conviene guardarli.',
    lede: 'L’invito è arrivato, il link è stato toccato e il calendario continua a mancare. Quasi sempre è una di quattro cose, e nessuna è che la condivisione non funzioni.',
    commonBelief: 'Che accettare un calendario condiviso lo metta sul telefono.',
    sections: [
      {
        heading: 'Accettare lo aggiunge a un account, non a un dispositivo',
        body: [
          'Una condivisione atterra nell’account Google a cui era indirizzata. Se hai accettato con un account e il telefono ne porta un altro, il calendario sta al sicuro esattamente dove non stai guardando.',
          'Persino nell’account giusto, un calendario appena aggiunto arriva disattivato sugli altri dispositivi più spesso che attivato. Esiste, semplicemente non è spuntato, e un calendario non spuntato sembra identico a uno mancante.',
        ],
      },
      {
        heading: 'Gli altri due motivi',
        body: [
          'Condividere con una mailing list o un indirizzo di gruppo raramente raggiunge le persone: serve l’indirizzo che è davvero un account Google. E un calendario condiviso come link è un abbonamento: finisce in un’altra parte dell’elenco e si aggiorna al ritmo di chi pubblica, non all’istante.',
          'Su iPhone i calendari Google raggiungono l’app integrata attraverso un elenco di sincronizzazione tutto loro, e i calendari secondari ne restano fuori per impostazione predefinita. Per questo un account mostra il calendario principale e lascia cadere in silenzio i quattro che contano.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Ore fra le richieste di aggiornamento di un feed sottoscritto',
      accounts: 'Tipi di account che una sola vista tiene insieme, senza nulla di tutto questo',
    },
    practical: [
      'Controlla quale account ha accettato la condivisione prima di qualsiasi altra cosa.',
      'Apri l’elenco dei calendari sul dispositivo e cercalo spento, non assente.',
      'Se è arrivato come link, aspettati un ritardo invece di una comparsa immediata.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'google-calendars-that-never-reach-your-iphone'],
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
    practical: [
      'Leggi l’elenco completo degli accessi, non solo il nome che volevi togliere.',
      'Reimposta l’indirizzo segreto se quella persona lo ha mai avuto.',
      'Dai per scontato che le copie sopravvivano: sposta ciò che è davvero delicato invece di nasconderlo.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
