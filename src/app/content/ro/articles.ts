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
    title: 'Partajați un eveniment, nu calendarul',
    short: 'Partajați un eveniment',
    description:
      'Cum funcționează trimiterea unui singur eveniment, ce primește de fapt cealaltă persoană și de ce nu trebuie să instaleze nimic ca să îl vadă.',
    lede: 'Partajarea unui calendar este de obicei totul sau nimic: ori are cineva acces la al dumneavoastră, ori nu. Trimiterea unei cine nu ar trebui să ceară niciuna dintre variante.',
    commonBelief:
      'Că a partaja un eveniment înseamnă a-i da cuiva o fereastră spre restul săptămânii dumneavoastră.',
    sections: [
      {
        heading: 'Ce pleacă de fapt',
        body: [
          'Când creați un eveniment, aplicația vă propune să îl partajați. Călătorește o legătură — prin e-mail, prin mesaj, prin ce are instalat celălalt — iar în spatele acelei legături stă un flux de calendar care conține acel eveniment și nimic altceva.',
          'Nu este o captură de ecran și nici o copie care se învechește. Dacă ora se schimbă, fluxul se schimbă odată cu ea, iar persoana căreia i-ați trimis vede schimbarea fără să retrimiteți nimic.',
        ],
      },
      {
        heading: 'Ce nu este',
        body: [
          'Legătura este un abonament de calendar obișnuit: o citește Calendar de la Apple, o citește Google Calendar, o citește Outlook. În mesaj merge și un App Clip pentru cine vrea totuși aplicația — se deschide fără instalare. Este o ușă, nu o barieră.',
          'Nu este instantaneu: fluxul cere aplicațiilor să se uite din nou la fiecare oră, iar aceasta este o cerere, nu o regulă. Nu este nici secret: legătura poartă douăzeci și două de caractere aleatoare, pe care nimeni nu le ghicește, dar oricine o are poate citi. Și deocamdată este doar pentru citire.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Ore între cererile de reîmprospătare a fluxului',
      linkLength: 'Caractere aleatoare în legătură, ceea ce o face de neghicit',
      sharePrice: 'Cât costă partajarea',
    },
    practical: [
      'Partajați din evenimentul însuși, imediat după ce l-ați creat.',
      'Trimiteți legătura pe canalul pe care îl folosiți deja cu acea persoană.',
      'Dacă ora se schimbă în ultima clipă, scrieți-i, nu doar mutați evenimentul.',
      'Revocați legătura când evenimentul a trecut, așa cum ați înceta să partajați un document.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'weather-inside-your-calendar'],
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
