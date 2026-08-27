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
    title: 'Un calendar care are deja vremea în el',
    short: 'Vremea în calendar',
    description:
      'De ce a consulta două aplicații ca să-ți organizezi ziua este o greșeală de proiectare și cum arată un calendar în care prognoza face parte din vedere în loc să stea alături.',
    lede: 'Aproape toată lumea își organizează ziua între două aplicații. Calendarul spune unde trebuie să fii; cea de vreme spune ce vreme va fi când ajungi. A ține cele două lucruri împreună în cap este partea pe care nimeni nu observă că o face — până când se pierde o sâmbătă.',
    commonBelief:
      'Că un calendar e pentru întâlniri și o aplicație de vreme e pentru vreme, și că a le ține separat este pur și simplu felul în care funcționează telefoanele.',
    sections: [
      {
        heading: 'Prețul a două aplicații nu sunt două atingeri',
        body: [
          'Comutarea nu costă nimic. Scump este că cele două nu se pun niciodată de acord asupra a ce contează. Calendarul știe că sâmbătă de la unsprezece sunt două ore ocupate; aplicația de vreme știe că plouă de la zece la unu. Niciuna nu știe că aceste două fapte împreună înseamnă că blocul trebuie mutat.',
          'Stratul de integrare sunteți dumneavoastră. Merge până când aveți mult de lucru, adică exact atunci când protejarea planurilor valorează cel mai mult.',
        ],
      },
      {
        heading: 'Ce se schimbă când prognoza este în grilă',
        body: [
          'Puneți prognoza în spatele evenimentelor și conflictul se rezolvă singur. O dimineață umedă și o după-amiază uscată se văd în aceeași privire cu ședința pe care urma să o puneți, iar decizia încetează să coste gândire.',
          'Nu este un widget lipit alături. Fiecare zi din vederile Săptămână și Lună poartă propriile condiții, iar fiecare eveniment poartă prognoza orelor pe care le ocupă cu adevărat — nu rezumatul zilei, care face media tocmai părții de care aveați nevoie.',
        ],
      },
    ],
    claims: {
      forecastDays: 'Zile de prognoză, în calendar și lângă fiecare eveniment',
      views: 'Vederi care poartă vremea: Zi, Săptămână, Lună, An și Listă',
      price: 'Cât costă funcțiile de vreme',
    },
    practical: [
      'Priviți banda din spatele zilelor în vederea Săptămână înainte de a pune ceva în aer liber.',
      'Atingeți un eveniment ca să vedeți prognoza orelor lui, nu a zilei lui.',
      'Puneți lucrurile care depind de vreme întâi pe cele paisprezece zile și rafinați cu două zile înainte.',
      'Tratați tot ce trece de ziua a șaptea ca pe o formă, nu ca pe un plan.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'what-a-subscription-actually-buys'],
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
    title: 'Ce cumpără de fapt un abonament',
    short: 'Ce cumpără un abonament',
    description:
      'Două niveluri plătite, ce le desparte și cum știți care — dacă vreunul — este al dumneavoastră.',
    lede: 'Două niveluri sunt de ajuns pentru confuzie dacă nimeni nu spune limpede ce le desparte. Ce le desparte este Microsoft.',
    commonBelief: 'Că nivelul superior sunt aceleași funcții, doar mai multe.',
    sections: [
      {
        heading: 'Primul nivel scoate reclamele',
        body: [
          'Adaugă și gestionarea evenimentelor între calendarele iCloud și Google, drepturi de partajare Google, legături Meet automate și reîmprospătare mai rapidă a vremii. Dar se cumpără pentru reclame.',
          'La prețul acesta este cam o cafea pe an și este nivelul care i se potrivește aproape oricui vrea să plătească ceva.',
        ],
      },
      {
        heading: 'Al doilea nivel este pentru Microsoft',
        body: [
          'Sincronizare Outlook și Exchange, legături Teams, gestionare între conturi inclusiv serviciul, gestionarea participanților. Costă un ordin de mărime mai mult pentru că și conexiunea costă.',
          'Dacă agenda dumneavoastră de serviciu nu stă la Microsoft, aici nu este nimic pentru dumneavoastră. Ambele niveluri sunt mai ieftine pe an; economia este moderată, nu spectaculoasă. După anulare rămâneți pe nivelul gratuit, iar calendarele sunt neatinse, pentru că evenimentele nu au fost niciodată ale noastre.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Primul nivel, pe lună, în dolari',
      advancedYearly: 'Primul nivel, pe an, în dolari',
      premiumMonthly: 'Al doilea nivel, pe lună, în dolari',
      premiumYearly: 'Al doilea nivel, pe an, în dolari',
    },
    practical: [
      'Cumpărați primul nivel ca să scoateți reclamele, nu ca să deblocați calendarul.',
      'Cumpărați-l pe al doilea doar dacă munca dumneavoastră trăiește la Microsoft.',
      'Treceți la anual când sunteți sigur; economia este reală, dar mică.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view'],
  },
};
