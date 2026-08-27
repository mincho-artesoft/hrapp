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
    title: 'Un calendario che contiene già il meteo',
    short: 'Il meteo dentro il calendario',
    description:
      "Perché controllare due app per organizzare una giornata è un difetto di progetto, e com'è fatto un calendario in cui le previsioni fanno parte della vista invece di stare accanto.",
    lede: 'Quasi tutti organizzano la giornata fra due app. Il calendario dice dove bisogna essere; il meteo dice che tempo farà quando ci si arriva. Tenere insieme le due cose è la parte che nessuno si accorge di fare, finché un sabato non va storto.',
    commonBelief:
      "Che un calendario serva agli impegni e un'app meteo al tempo, e che tenerli separati sia semplicemente come funzionano i telefoni.",
    sections: [
      {
        heading: 'Il costo di due app non sono due tocchi',
        body: [
          "Cambiare app non costa nulla. Quello che costa è che le due non si mettono mai d'accordo su cosa conta. Il calendario sa che sabato ci sono due ore occupate alle undici; il meteo sa che piove dalle dieci all'una. Nessuna delle due sa che questi due fatti insieme significano spostare il blocco.",
          'Il livello di integrazione siete voi. Funziona finché non siete occupati, che è esattamente il momento in cui proteggere i piani vale di più.',
        ],
      },
      {
        heading: 'Cosa cambia quando la previsione è nella griglia',
        body: [
          "Metteteci la previsione dietro gli eventi e il conflitto si risolve da solo. Una mattina umida e un pomeriggio asciutto si vedono nello stesso colpo d'occhio della riunione che stavate per mettere, e la decisione smette di costare pensiero.",
          'Non è un widget appiccicato di lato. Ogni giorno delle viste Settimana e Mese porta le proprie condizioni, e ogni evento porta la previsione delle ore che occupa davvero — non il riassunto della giornata, che fa la media proprio della parte che vi serviva.',
        ],
      },
      {
        heading: 'Il limite, detto onestamente',
        body: [
          'Una previsione a quattordici giorni è una forma, non una promessa. Serve davvero per scegliere fra un martedì e un giovedì, e quasi a nulla per decidere se servirà il cappotto fra due settimane.',
          "L'app mostra l'orizzonte intero perché scegliere una data è lavoro vero. Non traveste il dodicesimo giorno da domani.",
        ],
      },
    ],
    claims: {
      forecastDays: 'Giorni di previsione, nel calendario e accanto a ogni evento',
      views: 'Viste che portano il meteo: Giorno, Settimana, Mese, Anno ed Elenco',
      price: 'Quanto costano le funzioni meteo',
    },
    practical: [
      "Guardate la fascia dietro i giorni in vista Settimana prima di mettere qualcosa all'aperto.",
      'Toccate un evento per vedere la previsione delle sue ore, non quella della giornata.',
      'Mettete prima le cose che dipendono dal tempo sui quattordici giorni, poi affinate due giorni prima.',
      'Trattate tutto oltre il settimo giorno come una forma, non come un piano.',
    ],
    seeAlso: ['forecast-beside-every-event', 'a-fourteen-day-view-of-the-weather'],
  },

  'forecast-beside-every-event': {
    title: 'La previsione accanto a ogni evento, non solo alla giornata',
    short: 'Previsione per evento',
    description:
      "Un riassunto giornaliero fa la media proprio delle ore che contano. Che cosa significa avere il meteo per evento e perché la differenza pesa all'aperto.",
    lede: "La maggior parte dei calendari che nominano il meteo mostra un'icona al giorno. Quell'icona è una media, e la media fra una mattina di pioggia e un pomeriggio asciutto è una pioggerella che non arriva mai.",
    commonBelief:
      "Che un'icona giornaliera nel calendario equivalga a una previsione legata a un evento.",
    sections: [
      {
        heading: "Cosa nasconde un'icona giornaliera",
        body: [
          "Prendete una giornata in cui piove forte fino alle undici e poi schiarisce. Il riassunto sceglie una via di mezzo e mostra una nuvola. Voi guardate l'appuntamento delle due, vedete la nuvola e spostate una passeggiata che non andava spostata.",
          "L'errore va in entrambe le direzioni. Una giornata buona tranne un'ora violenta alle sei appare buona, e l'unico evento che contava è proprio quello che si bagna.",
        ],
      },
      {
        heading: 'Legare la previsione alle ore',
        body: [
          "Un evento occupa ore precise. La previsione di quelle ore è un numero diverso da quella della giornata, ed è l'unico che risponde a ciò che state davvero chiedendo.",
          'Aprite un evento e le condizioni che compaiono sono quelle della sua finestra. Un blocco di tre ore riceve le sue tre ore, non le ventiquattro.',
        ],
      },
    ],
    claims: {
      forecastDays: 'Giorni di anticipo con cui un evento può portare la previsione',
    },
    practical: [
      "Controllate l'evento, non la giornata, ogni volta che il piano dipende dal tempo.",
      "Per qualcosa di più lungo di un paio d'ore, guardate come cambiano le condizioni lungo il blocco.",
      "Spostate prima di annullare: un'ora in un senso o nell'altro basta quasi sempre.",
    ],
    seeAlso: ['weather-inside-your-calendar', 'planning-outdoors-without-being-rained-on'],
  },

  'planning-outdoors-without-being-rained-on': {
    title: "Organizzare all'aperto senza prendersi la pioggia",
    short: "Organizzare all'aperto",
    description:
      'Un metodo concreto per programmare qualsiasi cosa succeda fuori, usando il calendario che avete già invece di una routine meteo a parte.',
    lede: "Se i vostri passatempi stanno all'aperto, avrete costruito un rituale privato: controllare il meteo, strizzare gli occhi sulla settimana, tirare a indovinare. La parte dell'indovinare può sparire.",
    commonBelief: 'Che evitare il maltempo consista nel controllare le previsioni più spesso.',
    sections: [
      {
        heading: 'Guardare di più non è la risposta',
        body: [
          "Aprire l'app meteo cinque volte non migliora la previsione; migliora l'ansia. Quello che cambia il risultato è guardarla nel momento in cui scegliete un orario, e quello è un momento del tutto diverso.",
          'Quel momento avviene nel calendario. Se il meteo non è lì, la decisione si prende senza e si corregge dopo.',
        ],
      },
      {
        heading: 'Scegliere lo spazio sulla settimana',
        body: [
          "Guardate la settimana con le condizioni dietro e la scelta spesso si fa da sola. Due pomeriggi possibili, uno asciutto: non c'è più niente da soppesare.",
          "L'abitudine che vale la pena è minuscola: prima di mettere qualcosa all'aperto, guardate la fascia, non un'altra app.",
        ],
      },
      {
        heading: 'Poi le ore, non il giorno',
        body: [
          "Una volta creato l'evento, la previsione che conta è la sua. Una giornata può essere piovosa e le vostre due ore asciutte, e il riassunto giornaliero non ve lo dirà mai.",
          "Spostate prima di annullare. Un'ora in una direzione salva più piani di qualsiasi quantità di controlli.",
        ],
      },
    ],
    claims: {
      forecastDays: 'Giorni di anticipo su cui collocare un piano',
    },
    practical: [
      "Mettete gli eventi all'aperto dalla vista Settimana, con le condizioni in vista.",
      "Due giorni prima, controllate le ore dell'evento e non la sua giornata.",
      "Spostate di un'ora prima di rinunciare al piano.",
      'Oltre la settimana, scegliete il giorno e accettate di affinare dopo.',
    ],
    seeAlso: ['forecast-beside-every-event', 'a-fourteen-day-view-of-the-weather'],
  },

  'a-fourteen-day-view-of-the-weather': {
    title: 'Quattordici giorni di previsioni, e a cosa serve ciascuna metà',
    short: 'Quattordici giorni in vista',
    description:
      "L'estremità lontana di una previsione lunga non è un pronostico. È comunque la cosa più utile che avete quando dovete scegliere una data.",
    lede: 'Si chiede una previsione a dieci giorni e poi ci si lamenta che il decimo era sbagliato. Sono entrambe posizioni ragionevoli. Una previsione lunga risponde a una domanda diversa da quella di domani, e le risponde bene.',
    commonBelief:
      'Che una previsione a quattordici giorni sia una promessa a quattordici giorni, e che sbagliare il dodicesimo invalidi il resto.',
    sections: [
      {
        heading: 'A cosa serve la prima settimana',
        body: [
          "Entro circa sette giorni la previsione è abbastanza concreta da agire. Vi dirà quale pomeriggio è asciutto, più o meno quando arriva la pioggia, e se vale la pena spostare di un'ora.",
          "È l'intervallo in cui vivono le decisioni di annullare, spostare, prepararsi.",
        ],
      },
      {
        heading: 'A cosa serve la seconda',
        body: [
          "Oltre la settimana sparisce il dettaglio e resta la forma. Non vi dicono più se piove alle tre; vi dicono che un capo della settimana prossima sembra stabile e l'altro no.",
          'Che è esattamente ciò che serve per scegliere fra due date candidate — la decisione meteorologica più comune che chiunque prenda.',
        ],
      },
      {
        heading: 'Leggerla senza farsi ingannare',
        body: [
          "Osservate come si muovono i giorni lontani fra una consultazione e l'altra. Un giorno che mantiene la forma su tre aggiornamenti vi sta dicendo qualcosa. Un giorno che salta dal sole al temporale vi sta dicendo che ancora non si sa, e anche quella è informazione.",
          "L'app mostra l'orizzonte intero invece di troncarlo, e non presenta il dodicesimo giorno con più sicurezza di quanta se ne sia guadagnata.",
        ],
      },
    ],
    claims: {
      forecastDays: 'Giorni coperti dalla previsione',
    },
    practical: [
      'Usate la seconda settimana per scegliere una data, non per decidere come vestirvi.',
      'Tornate su un piano che dipende dal tempo circa due giorni prima, quando arriva il dettaglio.',
      "Se l'estremità lontana cambia fra una consultazione e l'altra, consideratela instabile invece di credere alla versione di oggi.",
    ],
    seeAlso: ['weather-inside-your-calendar', 'planning-outdoors-without-being-rained-on'],
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
    title: 'Un widget che risponde a una sola domanda',
    short: 'Il widget del prossimo',
    description:
      "Quasi tutti i widget di calendario cercano di essere un calendario piccolo. Quelli utili rispondono all'unica domanda che vi fate venti volte al giorno.",
    lede: 'Nessuno sblocca il telefono per sfogliare il calendario. Lo sblocca per sapere cosa viene dopo e quanto tempo resta.',
    commonBelief: 'Che un buon widget di calendario sia una vista Mese in miniatura.',
    sections: [
      {
        heading: 'Le superfici piccole puniscono la densità',
        body: [
          "Un mese compresso in un widget è illeggibile di sfuggita, e di sfuggita è l'unico modo in cui un widget venga mai letto. Finite per aprire l'app lo stesso, e il widget vi è costato spazio senza restituire niente.",
          "Il widget che si guadagna il posto mostra il prossimo elemento, l'ora e, se conta, cosa fa il cielo in quel momento.",
        ],
      },
      {
        heading: 'Perché il meteo ci sta per lo stesso motivo',
        body: [
          'Le due cose che volete sapere prima di uscire sono quando e che tempo fa. Dividerle su due widget ricrea il problema delle due app, su uno schermo più piccolo.',
          "Un'occhiata, due risposte, nessuno sblocco.",
        ],
      },
    ],
    claims: {
      views: "Viste dell'app, per quando la aprite comunque",
    },
    practical: [
      'Mettete il widget dove atterra il pollice, non dove sta in ordine.',
      'Prendete una dimensione più grande solo se leggete davvero più del prossimo elemento.',
      'Se controllate il meteo subito dopo il calendario, prendete un widget che porti entrambi.',
    ],
    seeAlso: ['a-countdown-to-your-next-meeting'],
  },

  'a-countdown-to-your-next-meeting': {
    title: 'Un conto alla rovescia sulla schermata di blocco',
    short: 'Conto alla rovescia',
    description:
      "Un'attività in tempo reale trasforma «quand'è» in «quanto mi resta» — che era la domanda vera.",
    lede: "Fra sapere che una cosa è alle tre e sapere che mancano undici minuti c'è una differenza pratica enorme, e solo una delle due cambia quello che fate adesso.",
    commonBelief: 'Che basti una notifica qualche minuto prima.',
    sections: [
      {
        heading: 'Un orario non è una durata',
        body: [
          'Leggere «le tre» vi impone una sottrazione contro un orologio che prima dovete trovare. Leggere «undici minuti» no. Il secondo è azionabile; il primo è una consultazione.',
          'Conta soprattutto nei venti minuti precedenti, che è esattamente quando la gente sbaglia i conti.',
        ],
      },
      {
        heading: 'Perché vive sulla schermata di blocco',
        body: [
          "Il conto alla rovescia si aggiorna sul posto, basta un'occhiata. Nessuna app da aprire, nessun avviso da scacciare, e l'informazione è giusta ogni volta che guardate, invece di esserlo stata una volta quando è scattata.",
          'Un singolo avviso cinque minuti prima dice la stessa cosa esattamente una volta, e poi smette di servire.',
        ],
      },
    ],
    claims: {},
    practical: [
      "Affidatevi al conto alla rovescia per l'ultima mezz'ora e agli avvisi per il giorno prima.",
      "Se uscite spesso in ritardo, guardate il numero invece di anticipare l'avviso: l'avviso si scaccia con un dito, il numero no.",
    ],
    seeAlso: ['the-widget-that-shows-what-is-next'],
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
    title: 'Cosa compra davvero un abbonamento, piano per piano',
    short: 'Cosa compra un abbonamento',
    description:
      "Due piani a pagamento, cosa li separa e come capire quale — se ce n'è uno — è il vostro. Prezzi annuali e mensili affiancati.",
    lede: 'Due piani bastano a confondere se nessuno dice chiaramente cosa li separa. Quello che li separa è Microsoft.',
    commonBelief: 'Che il piano superiore siano le stesse funzioni ma di più.',
    sections: [
      {
        heading: 'Il primo piano toglie la pubblicità',
        body: [
          'Aggiunge anche la gestione di eventi fra calendari iCloud e Google, i permessi di condivisione Google, i link Meet automatici e un aggiornamento meteo più rapido. Ma lo si compra per la pubblicità.',
          "A questo prezzo è più o meno un caffè all'anno, ed è il piano che va bene a quasi chiunque voglia pagare qualcosa.",
        ],
      },
      {
        heading: 'Il secondo piano è per Microsoft',
        body: [
          'Sincronizzazione Outlook ed Exchange, link Teams, gestione fra account compreso il lavoro, gestione dei partecipanti. Costa un ordine di grandezza in più perché anche la connessione costa.',
          'Se il vostro calendario di lavoro non sta su Microsoft, questo piano non contiene niente per voi e non dovreste comprarlo.',
        ],
      },
      {
        heading: 'Annuale contro mensile',
        body: [
          "Entrambi i piani costano meno all'anno. Il risparmio è misurato più che clamoroso: prendete l'annuale se siete sicuri, il mensile se ci state ancora pensando.",
          'Nessuno dei due è una trappola: dopo la disdetta restate sul piano gratuito con i calendari intatti, perché gli eventi non sono mai stati nostri.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Primo piano, al mese, in dollari',
      advancedYearly: "Primo piano, all'anno, in dollari",
      premiumMonthly: 'Secondo piano, al mese, in dollari',
      premiumYearly: "Secondo piano, all'anno, in dollari",
    },
    practical: [
      'Comprate il primo piano per togliere la pubblicità, non per sbloccare il calendario.',
      'Comprate il secondo solo se il vostro lavoro vive su Microsoft.',
      "Passate all'annuale quando siete sicuri; il risparmio è reale ma piccolo.",
    ],
    seeAlso: ['free-google-sync-without-adverts'],
  },
};
