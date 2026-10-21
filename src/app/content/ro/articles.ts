import { LocalisedArticle } from '../types';

/**
 * The four articles this language carries.
 *
 * Chosen one per intent -- weather, one view, sharing, price -- so the language
 * answers a whole question rather than a quarter of four. The numbers are not
 * here: they live once in article-facts.ts and join the prose by id, so a
 * translation can rewrite every sentence without touching a figure.
 */
export const ARTICLES_RO: Readonly<Record<string, LocalisedArticle>> = {
  'weather-inside-your-calendar': {
  "title": "Un calendar care are deja vremea în el",
  "short": "Vremea în calendar",
  "description": "De ce a consulta două aplicații ca să-ți organizezi ziua este o greșeală de proiectare și cum arată un calendar în care prognoza face parte din vedere în loc să stea alături.",
  "lede": "Aproape toată lumea își organizează ziua între două aplicații. Calendarul spune unde trebuie să fii; cea de vreme spune ce vreme va fi când ajungi. A ține cele două lucruri împreună în cap este partea pe care nimeni nu observă că o face — până când se pierde o sâmbătă.",
  "commonBelief": "Că un calendar e pentru întâlniri și o aplicație de vreme e pentru vreme, și că a le ține separat este pur și simplu felul în care funcționează telefoanele.",
  "sections": [
    {
      "heading": "Prețul a două aplicații nu sunt două atingeri",
      "body": [
        "Comutarea nu costă nimic. Scump este că cele două nu se pun niciodată de acord asupra a ce contează. Calendarul știe că sâmbătă de la unsprezece sunt două ore ocupate; aplicația de vreme știe că plouă de la zece la unu. Niciuna nu știe că aceste două fapte împreună înseamnă că blocul trebuie mutat.",
        "Stratul de integrare sunteți dumneavoastră. Merge până când aveți mult de lucru, adică exact atunci când protejarea planurilor valorează cel mai mult."
      ]
    },
    {
      "heading": "Prognoza disponibilă",
      "body": [
        "Cloud Calendars folosește prognoza disponibilă pentru locul selectat. Datele orare și zilnice pot acoperi perioade diferite.",
        "Datele pe care le puteți vedea în calendar nu determină intervalul prognozei. Vizualizarea lunară nu înseamnă prognoză pentru întreaga lună sau pentru fiecare eveniment."
      ]
    }
  ],
  "claims": {
    "price": "Cât costă funcțiile de vreme"
  },
  "practical": [
    "Verificați locul, data și orele disponibile înainte de a planifica folosind prognoza."
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-a-subscription-actually-buys"
  ],
  "updated": "2026-10-21"
},

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google și Outlook într-o singură vedere',
    short: 'Trei conturi, o vedere',
    description:
      'Viața aproape oricui este împărțită între un calendar personal Apple, un cont Google și un Exchange de la serviciu. Ce se schimbă când ajung în aceeași grilă.',
    lede: 'Problema aproape niciodată nu este că vreunul dintre calendare ar fi prost. Este că aveți trei și o singură săptămână.',
    commonBelief:
      'Că a ține munca și viața personală în aplicații separate este o graniță, nu un defect.',
    sections: [
      {
        heading: 'Suprapunerea programărilor este structurală',
        body: [
          'Dacă angajamentele dumneavoastră trăiesc în trei locuri, niciun loc nu vă poate spune dacă sunteți liber. Pasul de îmbinare sunteți dumneavoastră și îl executați din memorie, de obicei în timp ce cineva așteaptă un răspuns.',
          'De aceea eșecul clasic nu este să uitați un eveniment; este să acceptați ceva care se ciocnește de un eveniment pe care nu-l puteați vedea.',
        ],
      },
      {
        heading: 'Ce dă o singură grilă',
        body: [
          'Toate conturile în aceeași săptămână, colorate după proveniență, editabile pe loc. Încetați să vă întrebați ce aplicație are răspunsul, pentru că întrebarea încetează să fie la plural.',
          'iCloud și Google se sincronizează în versiunea gratuită. Conturile Microsoft — Outlook și Exchange — țin de cea plătită, pentru că acea conexiune are un cost recurent pe care celelalte nu îl au.',
        ],
      },
    ],
    claims: {
      accounts: 'Tipuri de cont care încap într-o vedere',
      premiumMonthly: 'Costul lunar al adăugării Microsoft, în dolari',
    },
    practical: [
      'Adăugați întâi contul personal și apoi pe cel care provoacă ciocnirile.',
      'Colorați după cont, nu după categorie: proveniența este ce trebuie văzut dintr-o privire.',
      'Continuați să scrieți în calendarul pe care ceilalți îl citesc deja.',
    ],
    seeAlso: ['weather-inside-your-calendar', 'what-a-subscription-actually-buys'],
  },

  'sharing-one-event-not-your-calendar': {
  "updated": "2026-10-21",
  "title": "Partajează un singur eveniment: alege linkul și accesul potrivit",
  "short": "Partajarea unui eveniment",
  "description": "Partajează un eveniment fără întregul calendar. Află ce permit Reader, Writer și Owner, previzualizarea, actualizările și retragerea accesului.",
  "lede": "Trimiterea detaliilor unei cine, editarea de către un coorganizator și colectarea răspunsurilor de participare sunt sarcini diferite. Alege întâi sarcina, apoi metoda. Ghid scris de Arte Soft, dezvoltatorul Cloud Calendars.",
  "commonBelief": "Orice link de eveniment este un abonament doar pentru citire, actualizat imediat, care înregistrează un răspuns.",
  "sections": [
    {
      "heading": "Începe cu un eveniment și verifică detaliile",
      "body": [
        "Partajarea unui singur eveniment se limitează la acesta, nu la întregul calendar al expeditorului. Verifică titlul, fusul orar, locul, notele și linkul întâlnirii. Detaliile utile unui invitat pot fi nepotrivite într-un link distribuit larg.",
        "De exemplu, o cină nu necesită partajarea calendarului cu programările medicale. Totuși, locul și linkurile cinei însoțesc evenimentul. Verifică evenimentul în sine, nu te baza pe confidențialitatea calendarului din jur."
      ]
    },
    {
      "heading": "Alege previzualizare, e-mail sau QR",
      "body": [
        "Cloud Calendars oferă metode distincte. App Clip prezintă o previzualizare; pentru adăugare prin acea experiență este necesară aplicația completă. Invitațiile prin e-mail și QR folosesc o pagină web care propune deschiderea Cloud Calendars. Nu considera toate linkurile adrese de abonare interschimbabile.",
        "Expeditorul se autentifică pentru partajarea sincronizată. Linkul sau codul QR poate fi redirecționat, deci trimite-l doar unde conținutul este potrivit. Codul QR transmite un link, nu dovedește cine l-a deschis."
      ]
    },
    {
      "heading": "Acordă doar accesul necesar",
      "body": [
        "Invitațiile prin e-mail permit alegerea Reader, Writer sau Owner. Reader poate vizualiza și sincroniza; Writer poate edita; Owner poate și partaja și gestiona accesul. Sunt alegeri cu efecte reale, nu trei nume pentru aceeași vizualizare. Folosește Reader pentru cine are nevoie doar de program.",
        "Alege Writer pentru un coorganizator care trebuie să modifice evenimentul. Alege Owner doar dacă trebuie să gestioneze și accesul altora. Drepturile superioare necesită identitatea autentificată potrivită. Un destinatar anonim nu este un coproprietar identificat."
      ]
    },
    {
      "heading": "Înțelege cum îl adaugă destinatarul",
      "body": [
        "În aplicația completă, adăugarea necesită permisiune pentru calendar și o destinație editabilă. Destinatarul trebuie să verifice calendarul înainte de salvare. Copia primită poate fi apoi asociată evenimentului partajat pentru actualizări.",
        "Aceasta diferă de importul unui fișier ICS obișnuit în alt calendar. Importul este o copie; abonamentul verifică periodic un flux. Dacă trimiți un flux ICS în locul invitației aplicației, explică metoda și confirmă compatibilitatea calendarului destinatarului."
      ]
    },
    {
      "heading": "Verifică modificările înainte să te bazezi pe ele",
      "body": [
        "Partajarea sincronizată poate transmite editări sau anulări, dar dispozitivul destinatarului trebuie să aibă ocazia să le primească. O indicație de reîmprospătare a fluxului nu este un termen de livrare. Un dispozitiv offline, abonament nereîmprospătat sau import separat poate arăta informații vechi.",
        "Dacă cina se mută cu puțin înainte de începere, actualizează evenimentul și contactează direct invitații. Cere confirmarea noii ore. Trimiterea actualizării și primirea unui răspuns de participare sunt pași separați."
      ]
    },
    {
      "heading": "Gestionează accesul fără promisiuni de ștergere a copiilor",
      "body": [
        "Revizuiește destinatarii și retrage drepturile inutile. Eliminarea unui destinatar și revocarea linkului unui flux sunt operații distincte; niciuna nu trebuie prezentată ca ștergând de la distanță capturi, mesaje sau toate copiile calendarului.",
        "Dacă linkul a depășit publicul dorit, identifică linkul sau dreptul implicat. Verifică metoda afectată după schimbarea accesului. Pe viitor, nu include detalii private în linkuri larg distribuite, în loc să te bazezi pe revocare ulterioară."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Verifică detaliile și alege între vizualizare, editare și răspunsuri de participare.",
    "Alege metoda și autentifică-te când este necesar.",
    "Folosește Reader pentru vizualizare; acordă Writer sau Owner doar pentru responsabilitatea respectivă.",
    "Cere destinatarului să verifice ora și calendarul de destinație la adăugare.",
    "Pentru schimbări urgente, actualizează evenimentul și trimite un mesaj direct.",
    "La încheiere, verifică separat drepturile destinatarilor și accesul linkurilor."
  ],
  "faq": [
    {
      "q": "Partajarea unui eveniment expune tot calendarul?",
      "a": "Metoda sincronizată pentru un eveniment se limitează la acesta. Detaliile proprii sunt totuși expuse prin metoda aleasă. Verifică-le și nu trimite o invitație pentru tot calendarul dacă intenționezi doar un eveniment."
    },
    {
      "q": "Poate destinatarul modifica evenimentul?",
      "a": "Da, cu acces Writer sau Owner potrivit și fluxul autentificat acceptat. Reader permite vizualizare și sincronizare. Un abonament ICS obișnuit nu este același mecanism de editare."
    },
    {
      "q": "Eliminarea cuiva retrage tot ce a primit deja?",
      "a": "Nu trebuie presupusă o asemenea garanție. Accesul afectează relația de partajare, dar copiile salvate, capturile și mesajele pot rămâne. Adresa unui flux partajat trebuie analizată separat."
    }
  ],
  "sourcesHeading": "Referințe pentru opțiunile destinatarului",
  "sources": [
    {
      "label": "Apple: prezentarea App Clips",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google: importul evenimentelor și limitări",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft: import sau abonare la calendar",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": []
},

  'what-a-subscription-actually-buys': {
  "updated": "2026-10-21",
  "title": "Ce cumpără de fapt un abonament",
  "short": "Ce cumpără un abonament",
  "description": "Ce cumpără un abonament: Base, Advanced, Premium.",
  "lede": "Acest ghid este publicat de Arte Soft, dezvoltatorul Cloud Calendars.",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "Base include sincronizare Google Calendar, Google Meet, vizualizări de calendar, vreme și widgeturi. Planul gratuit poate afișa reclame."
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Advanced include Base și elimină reclamele. Premium include Advanced și adaugă Microsoft Calendar și Microsoft Teams.",
        "Un abonament nu oferă drepturi de editare pentru calendarele altora și nu ocolește restricțiile unui cont de serviciu."
      ]
    },
    {
      "heading": "Informații despre cumpărare și anulare",
      "body": [
        "Înainte de cumpărare, verificați prețul local, perioada de facturare și condițiile de reînnoire.",
        "Pentru un abonament facturat de Apple, deschideți Configurări → numele dvs. → Abonamente. Verificați starea și data expirării. Oprirea reînnoirii este separată de ștergerea aplicației sau a datelor din calendar; nu presupuneți că funcțiile plătite rămân disponibile după expirare."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Înainte de cumpărare, verificați prețul local, perioada de facturare și condițiile de reînnoire.",
    "Un abonament nu oferă drepturi de editare pentru calendarele altora și nu ocolește restricțiile unui cont de serviciu."
  ],
  "faq": [
    {
      "q": "Cum opresc reînnoirea?",
      "a": "Pentru un abonament facturat de Apple, deschideți Configurări → numele dvs. → Abonamente. Verificați starea și data expirării. Oprirea reînnoirii este separată de ștergerea aplicației sau a datelor din calendar; nu presupuneți că funcțiile plătite rămân disponibile după expirare."
    }
  ],
  "sourcesHeading": "Informații despre cumpărare și anulare",
  "sources": [
    {
      "label": "Apple: Cum opresc reînnoirea?",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view"
  ]
},
};
