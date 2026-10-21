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
  "title": "Googles hemmelige iCal-adresse: skeln mellem abonnement og deling",
  "short": "Den hemmelige iCal-adresse",
  "description": "Forstå Googles hemmelige iCal-adresse, kontoforbindelser og feeds. Håndtér en afsløret adresse uden løfter om straksopdatering eller slettede kopier.",
  "lede": "En kalenderadresse, en kontoforbindelse og en invitation har forskellige formål. Find ud af, hvad du har, før du bruger det til at vise en kalender i en anden app. Guiden er udgivet af Arte Soft, udvikleren af Cloud Calendars.",
  "commonBelief": "En hemmelig kalenderadresse er en personlig invitation, som kan trækkes tilbage fra én bestemt modtager.",
  "sections": [
    {
      "heading": "Vælg forbindelsen efter formålet",
      "body": [
        "Google skelner mellem at logge ind i en anden kalenderapp og at se kalenderen via en hemmelig iCal-adresse. Kontoforbindelsen kan understøtte redigering; adressen giver et abonnement kun til visning. Google beskriver den hemmelige adresse som beregnet til eget brug og fraråder at dele den med andre.",
        "At vise din egen arbejdsplan i en anden kompatibel kalender er eksempelvis anderledes end at give en kollega løbende adgang. Start med målet: at se din kalender, samarbejde med en bestemt person eller distribuere en offentliggjort tidsplan til en målgruppe. Vælg ikke en URL alene, fordi den er nem at indsætte."
      ]
    },
    {
      "heading": "Find den rigtige kalender, ikke kun kontoen",
      "body": [
        "På en computer placerer Googles vejledning “Secret address in iCal format” under den valgte kalenders “Integrate calendar”-indstillinger. Kontrollér først kalendernavnet. Arbejds- eller skoleadministratorer kan begrænse funktionen; en manglende adresse er ikke grund til at offentliggøre kalenderen i stedet.",
        "Hold adressen ude af skærmbilleder, offentlige supportopslag og delte noter. Beskriv kontotype, kalendernavn og forbindelsesmetode uden URL’en, når du beder om hjælp. Support skal normalt først identificere forbindelsen, før der er behov for begivenhedernes indhold."
      ]
    },
    {
      "heading": "Kontrollér, hvad modtagerappen faktisk tilføjede",
      "body": [
        "Et abonnement følger et feed; import af en fil skaber en selvstændig kopi. Læs modtagerappens vejledning, og bekræft, hvilken handling du udfører. Hvis du blot åbner en hentet kalenderfil, skal du ikke forvente, at de oprettede aftaler følger senere ændringer.",
        "Brug en almindelig, ikke-følsom begivenhed, du kender, til at sammenligne kalendernavn, dato og viste detaljer. Opret ikke et andet abonnement for at undersøge det første: To synlige kopier kan få en forsinket opdatering til at ligne modstridende aftaler. Skjul midlertidigt en kalender, når du finder kilden."
      ]
    },
    {
      "heading": "Hold Google- og Cloud Calendars-links adskilt",
      "body": [
        "Cloud Calendars har egne forløb til deling af begivenheder og kalendere, herunder abonnementsfeeds. De er ikke hemmelige Google-adresser. Afklar, om afsenderen delte én begivenhed, en kalender eller en kontobaseret invitation, før du vælger, hvordan den åbnes.",
        "En Cloud Calendars-modtager kan have rollen Reader, Writer eller Owner. En feedadresse alene er ikke bevis på redigeringsret. En Google-adresse til visning gør dig heller ikke til kalenderens ejer. Spørg afsenderen, hvilket system ændringer skal foretages i."
      ]
    },
    {
      "heading": "Tag højde for modtagerkalenderens opdatering",
      "body": [
        "Et abonnement lover ikke øjeblikkelig levering. Cloud Calendars-feeds indeholder et foreslået opdateringsinterval, men modtagerappen bestemmer, hvornår den henter og viser ændringer. Et gammelt tidspunkt på én enhed beviser ikke alene, at arrangøren ikke gemte ændringen.",
        "Ved et møde samme dag bør du sammenligne med arrangørens aktuelle kalender og bekræfte vigtige ændringer direkte. Notér, hvilken kalender der stadig viser de gamle oplysninger, og hvornår du kontrollerede den. Importér ikke begivenheden gentagne gange, og slet ikke kildekalenderen for at tvinge feedet til at indhente ændringen."
      ]
    },
    {
      "heading": "Reagér på afsløring uden at love tilbagekaldelse",
      "body": [
        "Google beskriver nulstilling af en afsløret hemmelig adresse, så den gamle bliver ugyldig og erstattes af en ny. Find dine egne apps, som bruger adressen, så du efterfølgende kan opdatere abonnementerne. Nulstilling af en adresse er noget andet end at fjerne en navngiven samarbejdspartner.",
        "Tidligere gemte aftaler, eksporter og skærmbilleder er et særskilt spørgsmål. Et ændret link beviser ikke, at alle tidligere kopier er væk. Hvis oplysninger blev sendt til den forkerte målgruppe, skal du vurdere det faktiske materiale og modtagerne frem for at anse en vellykket nulstilling som bevis på fuldstændig fjernelse."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Find ud af, om du har en kontoforbindelse, invitation, abonnement eller fil.",
    "Kontrollér den tilhørende kalender, før du kopierer en adresse.",
    "Brug kun en hemmelig Google-adresse i dine egne kompatible apps.",
    "Bekræft, at modtagerappen abonnerede og ikke importerede.",
    "Bekræft hastende ændringer med arrangøren frem for at stole på opdateringstiden.",
    "Følg Googles nulstillingsvejledning ved en afsløret adresse, og opdatér de ønskede forbindelser."
  ],
  "faq": [
    {
      "q": "Kan jeg give den hemmelige adresse til en kollega?",
      "a": "Google anbefaler at holde den til dine egne apps. Brug kalenderens delingsindstillinger med den ønskede tilladelse, når andre har brug for adgang."
    },
    {
      "q": "Lader et abonnement mig redigere originalen?",
      "a": "En hemmelig Google-iCal-adresse er til visning. Redigering kræver en passende kontoforbindelse og tilladelse; Cloud Calendars-roller er en særskilt ordning."
    },
    {
      "q": "Sletter nulstilling gamle aftaler overalt?",
      "a": "Den gør den gamle Google-adresse ugyldig. Den fastslår ikke, at selvstændigt gemte filer, aftaler eller skærmbilleder er fjernet."
    }
  ],
  "sourcesHeading": "Udbydervejledning og yderligere læsning",
  "sources": [
    {
      "label": "Google: kontoforbindelser og hemmelige iCal-adresser",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    },
    {
      "label": "Google: deling af en kalender",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: import, abonnement og opdateringstid",
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
  "title": "Stop deling af en kalender: fjern adgang og kontrollér de andre veje",
  "short": "Gennemgå og fjern delt adgang",
  "description": "Stop kalenderdeling ved at skelne mellem personer, grupper, offentlig adgang og feedlinks. Kontrollér ændringen, og forstå hvorfor kopier kan blive.",
  "lede": "Når et samarbejde slutter, skal du først finde ud af, hvordan adgangen blev givet. At fjerne en person, slå offentliggørelse fra og nulstille en feedadresse er forskellige handlinger. Denne guide er udgivet af Arte Soft, udvikleren af Cloud Calendars.",
  "commonBelief": "Hvis du fjerner én modtager, tilbagekaldes alle kalenderkopier straks, og alle andre veje til kalenderen lukkes.",
  "sections": [
    {
      "heading": "Find kalenderen og måden, den er delt på",
      "body": [
        "Bekræft ejerkontoen, kalenderen og den tilsigtede målgruppe, før du ændrer adgangen. En Google-kalender delt med en navngiven kollega er noget andet end en offentlig kalender, en gruppetilladelse eller en abonnementsadresse. Cloud Calendars har også egne delingsforhold for begivenheder og kalendere.",
        "En klubs sekretær kan eksempelvis få redigeringsret via en personlig invitation, mens medlemmerne følger en offentliggjort kalender. At fjerne sekretærens personlige tilladelse afgør ikke, hvad der skal ske med medlemmernes abonnementer. Lav en liste over de ordninger, du faktisk har oprettet."
      ]
    },
    {
      "heading": "Fjern den relevante Google-tilladelse",
      "body": [
        "Google beskriver særskilte indstillinger for navngivne personer eller grupper, deling i hele organisationen og offentlig adgang. Åbn den relevante kalenders delingsindstillinger på en computer, og ændr den pågældende post eller overordnede indstilling. Kontrollér først den konto, du er logget ind på, og kalenderens navn.",
        "En person kan stadig have adgang ad en anden vej, eksempelvis via en gruppe eller en bredere offentliggørelse. Gennemgå hele ordningen frem for gentagne gange at fjerne samme e-mailadresse. Arbejdspladsens eller skolens politikker kan begrænse indstillingerne; følg om nødvendigt ejerens eller administratorens godkendte fremgangsmåde."
      ]
    },
    {
      "heading": "Behandl en hemmelig kalenderadresse særskilt",
      "body": [
        "Google oplyser, at den hemmelige iCal-adresse er til din egen brug i en anden kalenderapp og ikke må gives til andre. Hvis den er blevet delt, beskriver Google en nulstilling, der gør den gamle adresse ugyldig. Det er en anden handling end at fjerne en navngiven person.",
        "Før du ændrer en abonnementsadresse, du selv bruger, skal du finde de kalenderprogrammer eller værktøjer, der afhænger af den, så de ønskede kan forbindes igen bagefter. Indsæt ikke den hemmelige URL i et offentligt supportopslag, og send den ikke som bevis på, at du har fundet den rigtige kalender. Henvis i stedet til kalendernavnet og forbindelsestypen."
      ]
    },
    {
      "heading": "Skeln mellem Cloud Calendars-modtagere og feedlinks",
      "body": [
        "I Cloud Calendars er modtageradgang til en begivenhed eller kalender og et udstedt abonnementsfeed forskellige mekanismer. Gennemgå det konkrete delingsforhold og det relevante link, før du vælger en handling. At fjerne en bestemt modtager er ikke et generelt løfte om, at alle tidligere udsendte URL’er eller uafhængige kopier er tilbagekaldt.",
        "Hvis en medarrangør blot skal holde op med at redigere, bør du overveje den tilsigtede rolle og de øvrige modtagere frem for at slette den delte kalender. Hvis hele samarbejdet slutter, skal I afklare, hvem der ejer kalenderen, og hvem der skal beholde den. At forlade en modtaget kalender og slette en kalender, du ejer, er forskellige beslutninger."
      ]
    },
    {
      "heading": "Kontrollér resultatet uden at love øjeblikkelig forsvinden",
      "body": [
        "Kontrollér, at ændringen er gemt i det system, der ejer kalenderen. Hvis en autoriseret kollega kan hjælpe, kan I bekræfte den relevante visnings- eller redigeringsadgang fra kollegaens egen konto uden at dele adgangskoder. Skeln mellem nægtet adgang og en gammel begivenhed, der stadig ses i en cachelagret eller importeret kopi.",
        "Lov ikke et universelt opdateringsinterval eller, at der ikke sendes en notifikation. Fortæl ved en gruppeoverdragelse, hvilken kalender der fremover skal bruges. En synlig gammel post viser ikke i sig selv, om personen stadig har løbende adgang, en anden tilladelse eller en selvstændig kopi."
      ]
    },
    {
      "heading": "Følg op på tidligere kopier særskilt",
      "body": [
        "Tidligere eksporterede filer, skærmbilleder, beskeder og aftaler gemt uafhængigt kan blive liggende efter ændret adgang. Beslut, hvilke kopier der har betydning for overdragelsen, og tal med de berørte om håndteringen. En ændring af kalendertilladelser kan ikke fastslå, hvad hver modtager allerede har gemt.",
        "Bevar nødvendige kilderegistreringer, mens du gennemgår resultatet. Flyt ikke følsomme møder til en anden delt kalender blot for at få den gamle til at se tom ud, og aflys ikke rigtige invitationer som adgangstest. Notér kalenderen, adgangsvejen og ændringen, så senere fejlfinding har et klart udgangspunkt."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Find ejerkontoen, kalenderen og delingsvejen.",
    "Gennemgå personer, grupper og bredere offentliggørelse særskilt.",
    "Brug de relevante delingsindstillinger i Google eller Cloud Calendars.",
    "Vurder nulstilling af en afsløret hemmelig feedadresse særskilt.",
    "Kontrollér den gemte adgang uden at dele loginoplysninger.",
    "Planlæg håndtering af tidligere eksporter og kopier adskilt fra løbende adgang."
  ],
  "faq": [
    {
      "q": "Lukker fjernelse af én person en offentlig kalender eller personens gruppeadgang?",
      "a": "Det bør du ikke antage. Gennemgå hver faktisk adgangsvej. Google beskriver navngivne modtagere, grupper og bredere offentliggørelse som separate indstillinger."
    },
    {
      "q": "Forsvinder kalenderen straks og uden besked?",
      "a": "Der er ikke noget universelt løfte om forsvinden, notifikationer eller opdateringstid. Bekræft den gemte adgangsændring, og skeln mellem løbende adgang og cachelagrede eller importerede oplysninger."
    },
    {
      "q": "Giver Advanced mulighed for at købe fjernelse af Google-kalenderadgang?",
      "a": "Advanced fjerner reklamer i Cloud Calendars. Googles delingsindstillinger afhænger af ejerskab, tilladelser og organisationsregler, ikke af dette abonnement i appen."
    }
  ],
  "sourcesHeading": "Udbyderens vejledning om adgang og abonnementer",
  "sources": [
    {
      "label": "Google: delingsindstillinger og fjernelse af adgang",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Google: kontosynkronisering og hemmelige iCal-adresser",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "the-secret-address-of-a-google-calendar"
  ],
  "updated": "2026-10-21"
},
};
