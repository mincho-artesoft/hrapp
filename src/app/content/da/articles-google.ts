import { LocalisedArticle } from '../types';

/** De seks Google-artikler: konkrete spørgsmål, klare svar. */
export const GOOGLE_DA: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
  "title": "Google Kalender: kontrollér den adgang, du faktisk giver",
  "short": "Adgang og privatliv i Google Kalender",
  "description": "Vælg adgang til tilgængelighed, detaljer eller redigering. Kontrollér offentlig adgang og grupper samt individuelle rettigheder før deling.",
  "lede": "Beslut før deling, hvad den anden person skal kunne. At finde et tidspunkt, læse detaljer og vedligeholde kalenderen er forskellige opgaver. Guiden er udgivet af Arte Soft, udvikleren af Cloud Calendars.",
  "commonBelief": "En begrænset rettighed til én person garanterer, at personen ikke kan se detaljer ad andre veje.",
  "sections": [
    {
      "heading": "Tilpas adgangen til opgaven",
      "body": [
        "En kollega, der aftaler et tidspunkt, behøver måske kun tilgængelighed uden detaljer. En samarbejdspartner, der vedligeholder et projektprogram, har andre behov. Vælg opgaven først, og se derefter rettigheden i kalenderens aktuelle delingsindstillinger.",
        "Google skelner mellem tilgængelighed, begivenhedsdetaljer og flere redigeringsniveauer. Ét begrænser adgang til private begivenheder; et andet tillader redigering og detaljer, og det stærkeste også administration af deling. Alle valgmuligheder med ordet ændringer er ikke ens."
      ]
    },
    {
      "heading": "Kontrollér hele kalenderens adgang og den enkelte person",
      "body": [
        "Se ud over navngivne personer: er kalenderen offentlig, tilgængelig for organisationen eller delt med en gruppe? Google siger, at bredere kalenderadgang kan overtrumfe en snæver tildeling. At begrænse én person fjerner ikke allerede offentlige detaljer.",
        "Overvej et klubprogram udgivet til medlemmer. Kontrollér målgruppen, før du lægger en privat aftale ind, frem for kun at se rettigheden ud for en ven. Opbevar private aftaler på en passende destination."
      ]
    },
    {
      "heading": "Brug Googles indstillinger for den præcise kalender",
      "body": [
        "Find kalenderen under dine kalendere i Google Kalender på en computer, åbn menuen og delingsindstillingerne. Google beskriver separate områder til personer eller grupper og bredere adgang. Kontrollér navn og indlogget konto før ændringer.",
        "Bekræft modtagerens tilsigtede Google-identitet ved invitationen. Mangler kalenderen, så kontrollér adresse og invitationsbesked frem for at udvide adgangen for at få den frem. Manglende visning og utilstrækkelig redigeringsadgang er forskellige problemer."
      ]
    },
    {
      "heading": "Test uden private aftaler",
      "body": [
        "Brug en almindelig testaftale uden privat titel, noter, sted eller gæsteliste. Bed modtageren bekræfte, hvad der kan ses og, kun hvis redigering kræves og er tilladt, ændres. Del ikke kontooplysninger til denne test.",
        "Notér kalender og rolle, og kontrollér resultatet efter indstillingsændringen. Det afprøver den ønskede ordning, men beviser ikke, at tidligere læste eller kopierede oplysninger er væk. Test ikke ved at offentliggøre en virkelig arbejdsplan."
      ]
    },
    {
      "heading": "Hold arbejdsregler og appabonnementer adskilt",
      "body": [
        "Google oplyser, at arbejds- og skoleadministratorer kan begrænse delingskontroller. Mangler indstillingen, så brug organisationens godkendte vej. Offentliggør ikke arbejdsoplysninger som omvej.",
        "Cloud Calendars kan vise tilsluttede kalendere, men abonnementernes navne ændrer ikke Google-rettigheder. Advanced fjerner reklamer; det køber ikke adgang for andre til alle Google-begivenheder. Kontrollér udbyderens deling og det accepterede resultat, ikke blot en tilgængelig lokal editor."
      ]
    },
    {
      "heading": "Gennemgå og fjern overflødig adgang",
      "body": [
        "Når projektet slutter, så gennemgå modtagere, grupper og bredere offentliggørelse. At fjerne én person er kun en del, hvis andre adgangsveje består. Aftal, hvem der vedligeholder programmet og håndterer kommende ændringer.",
        "Google beskriver fjernelse af personer eller grupper separat fra deaktivering af bredere deling. Fjernet adgang tilbagekalder ikke eksporterede filer, skærmbilleder eller kopier andre steder. Følg op på dem særskilt med de involverede; lov ikke, at én kontakt sletter alle gamle kopier."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identificér kalender og modtagerens opgave.",
    "Kontrollér individuel, gruppe-, organisations- og offentlig adgang.",
    "Vælg passende rettighed i Googles aktuelle indstillinger.",
    "Bekræft identiteten før adgangsændringer.",
    "Kontrollér en harmløs testbegivenhed fra modtagerens side.",
    "Gennemgå forældede adgangsveje uden at antage, at gamle kopier trækkes tilbage."
  ],
  "faq": [
    {
      "q": "Overtrumfer en begrænset individuel rettighed en offentlig kalender?",
      "a": "Nej. Google dokumenterer, at bredere rettigheder har forrang ved konflikt. Kontrollér offentlig og organisatorisk adgang samt personens post."
    },
    {
      "q": "Viser alle redigeringsrettigheder private begivenheder på samme måde?",
      "a": "Nej. Google beskriver en mulighed, der begrænser private begivenheder, separat fra andre redigerings- og delingsroller. Læs den præcise aktuelle rettighed."
    },
    {
      "q": "Ændrer køb af Advanced Googles delingsrettigheder?",
      "a": "Nej. Advanced fjerner reklamer i Cloud Calendars. Adgang afhænger af kalenderrettigheder og organisationsbegrænsninger."
    }
  ],
  "sourcesHeading": "Googles aktuelle vejledning om rettigheder og deling",
  "sources": [
    {
      "label": "Google: vælg kalenderrettigheder",
      "url": "https://support.google.com/calendar/answer/15716974?hl=en"
    },
    {
      "label": "Google: del kalender og fjern adgang",
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
    "title": "En kalender blev delt med dig, og den er der ikke",
    "short": "Delt kalender dukker ikke op",
    "description": "Mangler en delt Google-kalender? Tjek den inviterede konto, gruppen, synligheden og typen af link.",
    "lede": "Denne vejledning er skrevet af Arte Soft, udvikleren af Cloud Calendars. Skeln først mellem manglende adgang og en kalender, der blot er skjult.",
    "commonBelief": "At acceptere en delt kalender lægger den på din telefon.",
    "sections": [
      {
        "heading": "Tjek konto og gruppe",
        "body": [
          "Sammenlign invitationens modtager med Google-kontoen på telefonen og i browseren. Åbn linket med den rigtige konto. Google understøtter deling med personer og Google-grupper. Ved gruppeadgang skal gruppeadministratoren bekræfte dit medlemskab, og kalenderejeren skal kontrollere, at den rigtige gruppe har adgang. En videresendt mail giver ikke i sig selv tilladelse."
        ]
      },
      {
        "heading": "Skjult, manglende eller begrænset?",
        "body": [
          "Åbn menuen i Google Kalender på iPhone eller iPad. Er kalenderen på listen uden flueben, så vælg den. Mangler den, skal ejeren kontrollere adgangen: En anmodning er ikke en godkendelse. Arbejds- eller skoleregler kan begrænse deling. Sammenlign samme konto i Google Kalender på nettet. Virker det dér, så tjek den tilknyttede konto og valgte kalendere i den anden app. Læseadgang giver ikke ret til at redigere."
        ]
      },
      {
        "heading": "Find ud af, hvilken slags link du har",
        "body": [
          "En delingsinvitation indeholder også et link; ikke alle links er ICS-abonnementer. Spørg, om linket giver adgang til en Google-kalender eller udgiver et skrivebeskyttet feed. Ifølge Google kræver et nyt kalenderabonnement en computerbrowser; at åbne en kalender, der allerede er delt via mail, er en anden handling. Feedets opdateringer afhænger af modtagertjenesten. Der er ingen universel ventetid; bekræft hastende ændringer med arrangøren."
        ]
      }
    ],
    "claims": {},
    "faq": [
      {
        "q": "Kan en Google-gruppe få adgang?",
        "a": "Ja. Tjek gruppen, dit medlemskab og organisationens begrænsninger. En videresendt gruppemail dokumenterer ikke adgang."
      },
      {
        "q": "Skal jeg slette og tilknytte kontoen igen?",
        "a": "Tjek først konto, rettigheder og synlighed, og sammenlign webkalenderen. En ny forbindelse giver ikke manglende rettigheder."
      }
    ],
    "practical": [
      "Bekræft den inviterede konto og gruppemedlemskabet.",
      "Vælg kalenderen, hvis den findes, men er skjult.",
      "Få ejeren til at tjekke adgang før forbindelser ændres."
    ],
    "sourcesHeading": "Kilder og videre læsning",
    "sources": [
      {
        "label": "Google: Tjek konto og gruppe",
        "url": "https://support.google.com/calendar/answer/37082?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Skjult, manglende eller begrænset?",
        "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Find ud af, hvilken slags link du har",
        "url": "https://support.google.com/calendar/answer/37648?hl=en"
      }
    ],
    "seeAlso": [
      "who-can-see-what-in-google-calendar",
      "google-calendars-that-never-reach-your-iphone"
    ]
  },

  'the-secret-address-of-a-google-calendar': {
    title: 'Hvad den hemmelige adresse til en Google-kalender i virkeligheden giver væk',
    short: 'Den hemmelige iCal-adresse',
    description:
      'Google tilbyder en privat adresse, der viser hele din kalender til den, der har den. Hvad den blotter, og hvorfor den ikke kan trækkes tilbage i stilhed.',
    lede: 'Begravet i indstillingerne for enhver Google-kalender ligger et link, der viser alt på den. Ingen log ind, ingen tilladelse, ingen registrering af, hvem der åbnede det.',
    commonBelief: 'At en privat adresse er privat, fordi den er svær at finde.',
    sections: [
      {
        heading: 'Et link er en adgangskode, der ikke kan skiftes for én person',
        body: [
          'Den hemmelige adresse bærer fulde detaljer — titler, tidspunkter, steder, noter. Enhver med linket ser dem, og der findes ingen liste over hvem.',
          'Dens eneste beskyttelse er den tilfældige del af adressen. Det er ægte beskyttelse mod gætteri og slet ingen mod videresendelse, en delt skærm eller et dokument, der overlever jobbet.',
        ],
      },
      {
        heading: 'At nulstille den ødelægger den for alle',
        body: [
          'Du kan nulstille adressen, og den gamle dør. Den dør også for hver kollega, hvert dashboard og hvert script, der stille lænede sig op ad den, uden varsel til nogen af dem.',
          'Det er argumentet for aldrig at dele adressen til en kalender, du lever i, ud. Udgiv en kalender lavet til formålet, så koster nulstillingen intet.',
        ],
      },
    ],
    claims: {
      linkLength: 'Tilfældige tegn, der beskytter et delingslink af vores slags',
      sharePrice: 'Hvad det koster at dele en begivenhed fra appen',
    },
    faq: [
      {
        q: 'Hvad kan nogen bruge den hemmelige adresse til min kalender til?',
        a: 'Se alt på den — titler, tidspunkter, steder og noter — uden login, uden tilladelse og uden at det nogen steder noteres, at de har kigget.',
      },
      {
        q: 'Kan jeg tage en hemmelig kalenderadresse tilbage?',
        a: 'Kun ved at nulstille den, hvilket dræber den gamle for alle på én gang: kolleger, dashboards og ethvert script, der stille lænede sig op ad den, uden varsel.',
      },
      {
        q: 'Kan jeg maile den hemmelige adresse til en kollega?',
        a: 'Behandl den som offentlig, fra det øjeblik den forlader dine hænder. Dens eneste beskyttelse er at være svær at gætte, og videresendelse ophæver netop det.',
      },
    ],
    practical: [
      'Behandl den hemmelige adresse som offentlig, så snart den forlader dine hænder.',
      'Udgiv aldrig adressen til den kalender, du faktisk bruger.',
      'Nulstil den, når nogen stopper, og sig det til dem, det går i stykker for.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'taking-back-a-calendar-you-shared'],
  },

  'what-guests-can-do-to-your-event': {
    title: 'Hvad dine gæster kan gøre ved en begivenhed',
    short: 'Gæsternes rettigheder',
    description:
      'Tre afkrydsningsfelter afgør, om en gæst kan flytte dit møde, invitere fremmede eller læse hele listen. De står til mere end folk regner med.',
    lede: 'At invitere nogen giver mere end et sted og et tidspunkt. I en almindelig Google-begivenhed ser en gæst som regel, hvem der ellers er spurgt, og må ofte tilføje flere.',
    commonBelief: 'At en gæst kun kan takke ja eller nej.',
    sections: [
      {
        heading: 'De tre felter',
        body: [
          'Redigere begivenhed lader en gæst ændre tidspunkt, sted og titel for alle. Sjældent ønsket, let ladt tændt.',
          'Invitere andre lader en gæst tilføje folk, du aldrig har mødt. Se gæstelisten viser alle inviterede og deres svar — fint i et team, akavet hos en kunde, forkert i alt, der ligner en gruppe adskilte kunder.',
        ],
      },
      {
        heading: 'Hvor det stille går galt',
        body: [
          'Én begivenhed, mange enkelte modtagere, synlig liste: nu har alle alle. Det ene felt er forskellen mellem et møde og en lækket adressebog.',
          'Indstillingerne hører til begivenheden, ikke til kontoen, så de falder tilbage til dine standardværdier hver gang og skal tænkes igennem på de begivenheder, der betyder noget, ikke én gang for alle.',
        ],
      },
    ],
    claims: {
      sharePrice: 'Hvad det koster at sende en enkelt begivenhed fra appen',
    },
    faq: [
      {
        q: 'Kan gæsterne se hinanden i en invitation fra Google Kalender?',
        a: 'Som standard oftest ja. «Se gæstelisten» viser alle inviterede og deres svar: fint i et team, akavet hos en kunde, forkert når gæsterne er adskilte kunder.',
      },
      {
        q: 'Kan en gæst ændre tidspunktet for mit møde?',
        a: 'Hvis «rediger begivenhed» er sat, ja, og ændringen gælder alle. Sjældent ønsket og let ladt tændt.',
      },
      {
        q: 'Hvordan forhindrer jeg gæster i at invitere andre?',
        a: 'Slå «invitere andre» fra på selve begivenheden. Indstillingerne hører til begivenheden og ikke til kontoen, så de falder tilbage til dine standardværdier hver gang.',
      },
    ],
    practical: [
      'Slå «se gæstelisten» fra ved alt, der sendes til folk, som ikke kender hinanden.',
      'Lad «redigere begivenhed» være slået fra, medmindre nogen reelt planlægger for dig.',
      'Tjek felterne på begivenheden, ikke i dine indstillinger: det er der, de bor.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'why-a-shared-calendar-does-not-appear'],
  },

  'google-calendars-that-never-reach-your-iphone': {
    title: 'Hvorfor nogle Google-kalendere aldrig når din iPhone',
    short: 'Google-kalendere mangler på iPhone',
    description:
      'Én Google-konto, flere kalendere og kun én på telefonen. Synkroniseringslisten, der afgør det, og hvad man gør i stedet.',
    lede: 'Din Google-konto rummer otte kalendere. Din iPhone viser to. Intet er i stykker: noget, du aldrig har set, har valgt for dig.',
    commonBelief: 'At tilføje en Google-konto på iPhone tilføjer de kalendere, den indeholder.',
    sections: [
      {
        heading: 'En liste, du aldrig er blevet vist',
        body: [
          'Google fører pr. enhed en liste over, hvilke kalendere der må synkronisere, og sekundære kalendere — de delte, de abonnerede, dem nogen lavede til et projekt — står ofte uden for den.',
          'Listen findes ikke i iOS-indstillingerne. Den bor på en Google-side for sig, og derfor finder man intet galt det indlysende sted, og intet ændrer sig.',
        ],
      },
      {
        heading: 'Den anden vej',
        body: [
          'En app, der taler direkte med Google, bruger ikke den liste, så den viser hver kalender, kontoen faktisk har, også dem telefonen stille lod falde.',
          'Det bringer også kontoerne sammen. Ét overblik med privat, arbejde og delt er hele pointen; om telefonen ville have synkroniseret hver enkelt holder op med at være et spørgsmål.',
        ],
      },
    ],
    claims: {
      accounts: 'Kontotyper, som ét overblik holder sammen',
      price: 'Hvad Google-siden koster',
    },
    faq: [
      {
        q: 'Hvorfor vises kun nogle af mine Google-kalendere på iPhone?',
        a: 'Google fører pr. enhed en liste over, hvilke kalendere der må synkronisere, og sekundære kalendere — delte, abonnerede, lavet til et projekt — står ofte uden for den.',
      },
      {
        q: 'Hvor er synkroniseringsindstillingen for Google Kalender på iPhone?',
        a: 'Ikke i iOS-indstillingerne. Den bor på en Google-side for sig, og derfor finder man intet galt det indlysende sted, og intet ændrer sig.',
      },
      {
        q: 'Hvordan ser jeg alle mine Google-kalendere på iPhone?',
        a: 'Gennem en app, der spørger Google direkte i stedet for gennem enhedens liste. Den viser hver kalender, kontoen faktisk har, også dem telefonen lod falde.',
      },
    ],
    practical: [
      'Tjek Googles synkroniseringsliste, før du går ud fra, at kontoen er i stykker.',
      'Regn med, at abonnerede og delte kalendere er udeladt snarere end medtaget.',
      'Har du mere end et par kalendere, så læs dem gennem noget, der spørger Google direkte.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'icloud-google-and-outlook-in-one-view'],
  },

  'taking-back-a-calendar-you-shared': {
    title: 'At tage en delt kalender tilbage',
    short: 'Fjerne adgang',
    description:
      'At fjerne nogen fra en kalender stopper det, der kommer herefter. Hvad det ikke gør, er at annullere det, der allerede er sket.',
    lede: 'At afslutte adgang er ét tryk. At afgøre, om ét tryk er nok, tager lidt længere, for deling efterlader kopier.',
    commonBelief: 'At fjerne en person fjerner det, personen har set.',
    sections: [
      {
        heading: 'Hvad der ophører, og hvad der bliver',
        body: [
          'Fjern en person, og kalenderen forsvinder fra dennes liste, straks og uden besked. Fremtidige begivenheder når aldrig frem.',
          'Hvad der ikke kommer tilbage: invitationer, personen allerede har, begivenheder kopieret til egen kalender, alt eksporteret, og alt, der er udleveret en hemmelig adresse til. Adgangen slutter; hukommelsen gør ikke.',
        ],
      },
      {
        heading: 'Det, der overlever fjernelsen',
        body: [
          'Har nogen på et tidspunkt haft lov at administrere deling, kan de have tilføjet andre. At fjerne dem lader de andre blive — sådan ender en kalender delt med nogen, ingen husker at have inviteret.',
          'Læs derfor hele listen frem for at slette ét navn, og gør det på vej ud snarere end måneder senere. Intet minder dig om det, og deling hober sig kun op.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Månedlig pris for niveauet, hvor dette styres, i dollars',
    },
    faq: [
      {
        q: 'Sletter det, som personen allerede har set, når jeg fjerner adgangen?',
        a: 'Nej. Invitationer, personen allerede har, begivenheder kopieret til egen kalender og alt eksporteret bliver. Adgangen slutter; kopierne gør ikke.',
      },
      {
        q: 'Får personen besked om, at jeg har fjernet adgangen?',
        a: 'Nej. Kalenderen forsvinder fra listen straks og uden besked.',
      },
      {
        q: 'Hvorfor er min kalender delt med nogen, jeg aldrig har inviteret?',
        a: 'En med ret til at administrere deling tilføjede dem. At fjerne den person lader alle, vedkommende tilføjede, blive — derfor læser man hele listen og ikke ét navn.',
      },
    ],
    practical: [
      'Læs hele adgangslisten, ikke kun det navn du ville fjerne.',
      'Nulstil den hemmelige adresse, hvis personen nogensinde har haft den.',
      'Gå ud fra, at kopier overlever, og flyt det virkelig følsomme frem for at skjule det.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
