import { LocalisedArticle } from '../types';

/** De seks Google-artiklene: konkrete spørsmål, klare svar. */
export const GOOGLE_NO: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
  "title": "Google Kalender: sjekk tilgangen du faktisk gir",
  "short": "Tilgang og personvern i Google Kalender",
  "description": "Velg tilgang til tilgjengelighet, detaljer eller redigering. Sjekk offentlig tilgang og grupper i tillegg til individuelle rettigheter før deling.",
  "lede": "Bestem hva den andre personen skal gjøre før du deler kalenderen. Å planlegge rundt deg, lese detaljer og vedlikeholde kalenderen er ulike oppgaver. Veiledningen er publisert av Arte Soft, utvikleren av Cloud Calendars.",
  "commonBelief": "En begrenset rettighet til én person garanterer at personen ikke kan se detaljer via andre veier.",
  "sections": [
    {
      "heading": "Tilpass tilgangen til oppgaven",
      "body": [
        "En kollega som finner et tidspunkt, trenger kanskje tilgjengelighet uten avtaledetaljer. En samarbeidspartner som vedlikeholder prosjektplanen trenger noe annet. Bestem oppgaven først, og undersøk så rettigheten i kalenderens gjeldende delingsinnstillinger.",
        "Google skiller tilgjengelighet, hendelsesdetaljer og flere redigeringsnivåer. Ett begrenser tilgang til private hendelser; et annet tillater redigering og detaljer, og det sterkeste også delingsadministrasjon. Ikke behandle alle alternativer med ordet endringer som like."
      ]
    },
    {
      "heading": "Sjekk kalenderens samlede tilgang og enkeltpersonen",
      "body": [
        "Sjekk om kalenderen er offentlig, tilgjengelig for organisasjonen eller delt via en gruppe, i tillegg til navngitte personer. Google sier at bredere tilgang kan overstyre en snevrere tildeling. Å begrense én person trekker ikke tilbake allerede offentlige detaljer.",
        "Tenk på en klubbplan publisert for medlemmer. Sjekk målgruppen før du legger inn en privat avtale, fremfor å anta at bare rettigheten ved én venn betyr noe. Oppbevar private avtaler på et passende sted."
      ]
    },
    {
      "heading": "Bruk Googles innstillinger for riktig kalender",
      "body": [
        "Finn kalenderen under dine kalendere i Google Kalender på en datamaskin, åpne menyen og delingsinnstillingene. Google beskriver egne områder for personer eller grupper og bredere tilgang. Sjekk navn og innlogget konto før endring.",
        "Bekreft mottakerens tilsiktede Google-identitet ved invitasjonen. Hvis kalenderen mangler, sjekk adressen og invitasjonsmeldingen fremfor å utvide tilgangen for å få den frem. Manglende visning og utilstrekkelige redigeringsrettigheter er ulike problemer."
      ]
    },
    {
      "heading": "Test uten private avtaler",
      "body": [
        "Bruk en vanlig testavtale uten privat tittel, notater, sted eller gjesteliste. Be mottakeren bekrefte hva som kan sees og, bare når redigering kreves og tillates, endres. Ikke del kontopassord for å gjøre testen.",
        "Noter kalender og rolle, og gjennomgå resultatet etter endringen. Dette bekrefter den tilsiktede ordningen, men beviser ikke at tidligere leste eller kopierte opplysninger har forsvunnet. Ikke test ved å publisere en virkelig arbeidsplan."
      ]
    },
    {
      "heading": "Skill arbeidsregler fra appabonnementer",
      "body": [
        "Google opplyser at arbeids- og skoleadministratorer kan begrense delingskontroller. Bruk organisasjonens godkjente vei hvis innstillingen mangler. Ikke publiser arbeidsinformasjon som omvei rundt en kontobegrensning.",
        "Cloud Calendars kan vise tilkoblede kalendere, men plannavn endrer ikke Google-rettighetene. Advanced fjerner annonser; det kjøper ikke tilgang for andre til alle Google-hendelser. Sjekk leverandørens deling og bekreft det aksepterte resultatet, ikke bare en tilgjengelig lokal editor."
      ]
    },
    {
      "heading": "Gjennomgå og fjern tilgang som ikke lenger trengs",
      "body": [
        "Når prosjektet slutter, gjennomgå faktiske mottakere, grupper og bredere publisering. Å fjerne én person er bare en del når andre tilgangsveier finnes. Avtal hvem som vedlikeholder planen og håndterer senere endringer.",
        "Google beskriver fjerning av personer eller grupper separat fra deaktivering av bredere deling. Fjerning henter ikke tilbake eksporterte filer, skjermbilder eller informasjon kopiert andre steder. Følg opp dette separat med de involverte; ikke lov at én bryter sletter alle gamle kopier."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifiser kalender og mottakerens oppgave.",
    "Sjekk individuelle, gruppe-, organisasjons- og offentlige rettigheter.",
    "Velg passende rettighet i Googles gjeldende innstillinger.",
    "Bekreft identiteten før tilgangsendringer.",
    "Sjekk en ufarlig testhendelse fra mottakerens side.",
    "Gjennomgå foreldede tilgangsveier uten å anta at kopier hentes tilbake."
  ],
  "faq": [
    {
      "q": "Overstyrer en begrenset personlig rettighet en offentlig kalender?",
      "a": "Nei. Google dokumenterer at bredere rettigheter har prioritet ved konflikt. Sjekk offentlig og organisatorisk tilgang samt personens oppføring."
    },
    {
      "q": "Eksponerer alle redigeringsrettigheter private hendelser likt?",
      "a": "Nei. Google beskriver et alternativ med begrenset tilgang til private hendelser separat fra andre redigerings- og delingsroller. Les den nøyaktige gjeldende rettigheten."
    },
    {
      "q": "Endrer kjøp av Advanced Googles delingsrettigheter?",
      "a": "Nei. Advanced fjerner annonser i Cloud Calendars. Tilgang avhenger av kalenderrettigheter og organisasjonsbegrensninger."
    }
  ],
  "sourcesHeading": "Googles gjeldende veiledning om rettigheter og deling",
  "sources": [
    {
      "label": "Google: velge kalenderrettigheter",
      "url": "https://support.google.com/calendar/answer/15716974?hl=en"
    },
    {
      "label": "Google: dele kalender og fjerne tilgang",
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
    "title": "En kalender ble delt med deg, og den er ikke der",
    "short": "Delt kalender dukker ikke opp",
    "description": "Mangler en delt Google-kalender? Sjekk den inviterte kontoen, gruppen, synligheten og lenketypen.",
    "lede": "Denne veiledningen er fra Arte Soft, utvikleren av Cloud Calendars. Skill først mellom manglende tilgang og en kalender som bare er skjult.",
    "commonBelief": "At å takke ja til en delt kalender legger den på telefonen.",
    "sections": [
      {
        "heading": "Sjekk konto og gruppe",
        "body": [
          "Sammenlign mottakeren av invitasjonen med Google-kontoen på telefonen og i nettleseren. Åpne lenken med riktig konto. Google støtter deling med personer og Google-grupper. Ved gruppetilgang bør gruppeadministratoren bekrefte medlemskapet ditt, og kalendereieren kontrollere at riktig gruppe har tilgang. En videresendt e-post gir ikke tillatelse i seg selv."
        ]
      },
      {
        "heading": "Skjult, manglende eller begrenset?",
        "body": [
          "Åpne menyen i Google Kalender på iPhone eller iPad. Hvis kalenderen står på listen uten hake, velger du den. Hvis den mangler, be eieren sjekke tilgangen: En forespørsel er ikke en godkjenning. Regler fra jobb eller skole kan begrense deling. Sammenlign samme konto i Google Kalender på nettet. Virker det der, sjekk tilkoblet konto og valgte kalendere i den andre appen. Lesetilgang gir ikke rett til å redigere."
        ]
      },
      {
        "heading": "Finn ut hvilken lenke du fikk",
        "body": [
          "En delingsinvitasjon inneholder også en lenke; ikke alle lenker er ICS-abonnementer. Spør om den gir tilgang til en Google-kalender eller publiserer en skrivebeskyttet strøm. Google sier at et nytt kalenderabonnement krever en nettleser på datamaskin; å åpne en kalender som allerede er delt via e-post, er en annen handling. Oppdateringer av strømmen avhenger av mottakertjenesten. Ingen ventetid gjelder for alle; bekreft hastende endringer med arrangøren."
        ]
      }
    ],
    "claims": {},
    "faq": [
      {
        "q": "Kan en Google-gruppe få tilgang?",
        "a": "Ja. Sjekk valgt gruppe, medlemskapet ditt og organisasjonens begrensninger. En videresendt gruppemelding beviser ikke tilgang."
      },
      {
        "q": "Bør jeg slette og koble til kontoen på nytt?",
        "a": "Sjekk først identitet, rettigheter og synlighet, og sammenlign nettkalenderen. Ny tilkobling gir ikke manglende rettigheter."
      }
    ],
    "practical": [
      "Bekreft invitert konto og gruppemedlemskap.",
      "Velg kalenderen hvis den står på listen, men er skjult.",
      "Be eieren sjekke tilgang før du endrer tilkoblinger."
    ],
    "sourcesHeading": "Kilder og videre lesning",
    "sources": [
      {
        "label": "Google: Sjekk konto og gruppe",
        "url": "https://support.google.com/calendar/answer/37082?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Skjult, manglende eller begrenset?",
        "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Finn ut hvilken lenke du fikk",
        "url": "https://support.google.com/calendar/answer/37648?hl=en"
      }
    ],
    "seeAlso": [
      "who-can-see-what-in-google-calendar",
      "google-calendars-that-never-reach-your-iphone"
    ]
  },

  'the-secret-address-of-a-google-calendar': {
    title: 'Hva den hemmelige adressen til en Google-kalender egentlig gir bort',
    short: 'Den hemmelige iCal-adressen',
    description:
      'Google tilbyr en privat adresse som viser hele kalenderen din til den som har den. Hva den blottlegger, og hvorfor den ikke kan trekkes tilbake i stillhet.',
    lede: 'Dypt i innstillingene til enhver Google-kalender ligger en lenke som viser alt på den. Ingen innlogging, ingen tillatelse, ingen oversikt over hvem som åpnet den.',
    commonBelief: 'At en privat adresse er privat fordi den er vanskelig å finne.',
    sections: [
      {
        heading: 'En lenke er et passord du ikke kan bytte for én person',
        body: [
          'Den hemmelige adressen bærer fulle detaljer — titler, tidspunkt, steder, notater. Alle som har lenken, ser dem, og det finnes ingen liste over hvem det er.',
          'Den eneste beskyttelsen er den tilfeldige delen av adressen. Mot gjetting beskytter den faktisk, mot videresending, en delt skjerm eller et dokument som overlever jobben, slett ikke.',
        ],
      },
      {
        heading: 'Å nullstille den ødelegger den for alle',
        body: [
          'Du kan nullstille adressen, og den gamle dør. Den dør også for hver kollega, hvert dashbord og hvert skript som stille lente seg på den, uten varsel til noen av dem.',
          'Det er argumentet for aldri å dele ut adressen til en kalender du lever i. Publiser en kalender laget for formålet, så koster nullstillingen ingenting.',
        ],
      },
    ],
    claims: {
      linkLength: 'Tilfeldige tegn som beskytter en delingslenke av vårt slag',
      sharePrice: 'Hva det koster å dele en hendelse fra appen',
    },
    faq: [
      {
        q: 'Hva kan noen gjøre med den hemmelige adressen til kalenderen min?',
        a: 'Se alt på den — titler, tidspunkt, steder og notater — uten innlogging, uten tillatelse og uten at det noteres noe sted at de har sett.',
      },
      {
        q: 'Kan jeg ta tilbake en hemmelig kalenderadresse?',
        a: 'Bare ved å nullstille den, og det dreper den gamle for alle på én gang: kolleger, dashbord og ethvert skript som stille lente seg på den, uten varsel.',
      },
      {
        q: 'Kan jeg sende den hemmelige adressen til en kollega på e-post?',
        a: 'Behandle den som offentlig fra det øyeblikket den forlater hendene dine. Den eneste beskyttelsen er at den er vanskelig å gjette, og videresending opphever nettopp det.',
      },
    ],
    practical: [
      'Behandle den hemmelige adressen som offentlig i det øyeblikket den forlater hendene dine.',
      'Publiser aldri adressen til kalenderen du faktisk bruker.',
      'Nullstill den når noen slutter, og si fra til dem det ryker for.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'taking-back-a-calendar-you-shared'],
  },

  'what-guests-can-do-to-your-event': {
    title: 'Hva gjestene dine kan gjøre med en hendelse',
    short: 'Gjestenes rettigheter',
    description:
      'Tre avkrysningsbokser avgjør om en gjest kan flytte møtet ditt, invitere fremmede eller lese hele listen. De står på oftere enn folk tror.',
    lede: 'Å invitere noen gir mer enn et sted og et tidspunkt. I en vanlig Google-hendelse ser en gjest vanligvis hvem andre som er spurt, og får ofte legge til flere.',
    commonBelief: 'At en gjest bare kan takke ja eller nei.',
    sections: [
      {
        heading: 'De tre boksene',
        body: [
          'Endre hendelse lar en gjest bytte tid, sted og tittel for alle. Sjelden ønsket, lett latt stå på.',
          'Invitere andre lar en gjest legge til folk du aldri har møtt. Se gjestelisten viser alle inviterte og svarene deres — greit i et team, ubehagelig hos en kunde, feil i alt som ligner en gruppe separate kunder.',
        ],
      },
      {
        heading: 'Der det stille går galt',
        body: [
          'Én hendelse, mange enkeltmottakere, synlig liste: nå har alle alle. Den ene boksen er forskjellen mellom et møte og en lekket adressebok.',
          'Innstillingene hører til hendelsen, ikke kontoen, så de faller tilbake til standardverdiene dine hver gang og må tenkes gjennom på de hendelsene som betyr noe, ikke én gang for alle.',
        ],
      },
    ],
    claims: {
      sharePrice: 'Hva det koster å sende en enkelt hendelse fra appen',
    },
    faq: [
      {
        q: 'Ser gjestene hverandre i en invitasjon fra Google Kalender?',
        a: 'Som standard oftest ja. «Se gjestelisten» viser alle inviterte og svarene deres: greit i et team, ubehagelig hos en kunde, feil når gjestene er separate kunder.',
      },
      {
        q: 'Kan en gjest endre tidspunktet for møtet mitt?',
        a: 'Hvis «endre hendelse» er huket av, ja, og endringen gjelder alle. Sjelden ønsket og lett latt stå på.',
      },
      {
        q: 'Hvordan hindrer jeg gjester i å invitere andre?',
        a: 'Slå av «invitere andre» på selve hendelsen. Innstillingene hører til hendelsen og ikke kontoen, så de faller tilbake til standardverdiene dine hver gang.',
      },
    ],
    practical: [
      'Slå av «se gjestelisten» for alt som går til folk som ikke kjenner hverandre.',
      'La «endre hendelse» stå av med mindre noen faktisk planlegger for deg.',
      'Sjekk boksene på hendelsen, ikke i innstillingene: det er der de bor.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'why-a-shared-calendar-does-not-appear'],
  },

  'google-calendars-that-never-reach-your-iphone': {
    title: 'Hvorfor noen Google-kalendere aldri når iPhonen din',
    short: 'Google-kalendere mangler på iPhone',
    description:
      'Én Google-konto, flere kalendere og bare én på telefonen. Synkroniseringslisten som avgjør det, og hva du gjør i stedet.',
    lede: 'Google-kontoen din rommer åtte kalendere. iPhonen viser to. Ingenting er ødelagt: noe du aldri har sett, har valgt for deg.',
    commonBelief: 'At å legge til en Google-konto på iPhone legger til kalenderne den inneholder.',
    sections: [
      {
        heading: 'En liste du aldri er blitt vist',
        body: [
          'Google fører per enhet en liste over hvilke kalendere som får synkronisere, og sekundære kalendere — de delte, de abonnerte, de noen laget til et prosjekt — står ofte utenfor.',
          'Listen ligger ikke i iOS-innstillingene. Den bor på en egen Google-side, og derfor finner man ingenting galt på det opplagte stedet, og ingenting endrer seg.',
        ],
      },
      {
        heading: 'Den andre veien',
        body: [
          'En app som snakker direkte med Google, bruker ikke den listen, så den viser hver kalender kontoen faktisk har, også dem telefonen stille lot falle.',
          'Det fører også kontoene sammen. Én visning med privat, jobb og delt er hele poenget; om telefonen ville synkronisert hver av dem slutter å være et spørsmål.',
        ],
      },
    ],
    claims: {
      accounts: 'Kontotyper som én visning holder sammen',
      price: 'Hva Google-siden koster',
    },
    faq: [
      {
        q: 'Hvorfor vises bare noen av Google-kalenderne mine på iPhone?',
        a: 'Google fører per enhet en liste over hvilke kalendere som får synkronisere, og sekundære kalendere — delte, abonnerte, laget til et prosjekt — står ofte utenfor.',
      },
      {
        q: 'Hvor er synkroniseringsinnstillingen for Google Kalender på iPhone?',
        a: 'Ikke i iOS-innstillingene. Den bor på en egen Google-side, og derfor finner man ingenting galt på det opplagte stedet, og ingenting endrer seg.',
      },
      {
        q: 'Hvordan ser jeg alle Google-kalenderne mine på iPhone?',
        a: 'Gjennom en app som spør Google direkte i stedet for gjennom enhetens liste. Den viser hver kalender kontoen faktisk har, også dem telefonen lot falle.',
      },
    ],
    practical: [
      'Sjekk Googles synkroniseringsliste før du antar at kontoen er ødelagt.',
      'Regn med at abonnerte og delte kalendere er utelatt heller enn med.',
      'Har du mer enn et par kalendere, les dem gjennom noe som spør Google direkte.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'icloud-google-and-outlook-in-one-view'],
  },

  'taking-back-a-calendar-you-shared': {
  "title": "Slutt å dele en kalender: fjern tilgang og kontroller andre veier",
  "short": "Kontroller og fjern delt tilgang",
  "description": "Skill mellom personer, grupper, offentlig tilgang og kalenderlenker når du avslutter deling. Kontroller endringen; lagrede kopier kan bli igjen.",
  "lede": "Å avslutte et samarbeid begynner med å finne ut hvordan tilgangen ble gitt. Å fjerne en person, stoppe publisering og tilbakestille en feedadresse er ulike handlinger. Guiden er publisert av Arte Soft, utvikleren av Cloud Calendars.",
  "commonBelief": "Å fjerne én mottaker skulle straks hente tilbake alle kalenderkopier og stenge alle andre tilganger.",
  "sections": [
    {
      "heading": "Identifiser kalenderen og delingsmåten",
      "body": [
        "Bekreft eierkontoen, kalenderen og den tiltenkte målgruppen før du endrer tilgang. En Google-kalender delt med en navngitt kollega er noe annet enn en offentlig kalender, gruppetilgang eller abonnementsadresse. Cloud Calendars har også egne delingsforhold for hendelser og kalendere.",
        "En klubbsekretær kan for eksempel ha redigeringsrett via personlig invitasjon, mens medlemmene følger en publisert plan. Å fjerne sekretærens rettighet avgjør ikke hva som bør skje med medlemmenes abonnementer. Lag en oversikt over ordningene du faktisk opprettet."
      ]
    },
    {
      "heading": "Fjern den aktuelle Google-tilgangen",
      "body": [
        "Google beskriver separate innstillinger for personer eller grupper, deling i organisasjonen og offentlig tilgjengelighet. Åpne riktig kalenders delingsinnstillinger på en datamaskin og endre den aktuelle oppføringen eller bredere innstillingen. Kontroller først innlogget konto og kalendernavn.",
        "Personen kan fortsatt ha tilgang gjennom en gruppe eller bredere publisering. Se over hele oppsettet i stedet for å fjerne samme e-postadresse gjentatte ganger. Arbeids- eller skoleregler kan begrense kontrollene; følg eierens eller administratorens godkjente prosess ved behov."
      ]
    },
    {
      "heading": "Behandle en hemmelig kalenderadresse separat",
      "body": [
        "Google sier at den hemmelige iCal-adressen er til eget bruk i en annen kalenderapp og ikke skal gis til andre. Hvis den er delt, beskriver Google tilbakestilling som gjør den gamle adressen ugyldig. Dette er noe annet enn å fjerne en navngitt person.",
        "Før du endrer en abonnementsadresse du bruker selv, finn kalenderappene eller verktøyene som avhenger av den, slik at du kan koble til de riktige igjen. Ikke legg den hemmelige URL-en i et offentlig støtteinnlegg eller bruk den som bevis på riktig kalender. Oppgi kalendernavn og tilkoblingstype i stedet."
      ]
    },
    {
      "heading": "Skill Cloud Calendars-mottakere fra feedlenker",
      "body": [
        "I Cloud Calendars er mottakertilgang til en hendelse eller kalender og en utstedt abonnementsfeed ulike mekanismer. Kontroller det faktiske delingsforholdet og lenken før du velger handling. Å fjerne en identifisert mottaker garanterer ikke at alle tidligere distribuerte URL-er eller selvstendige kopier er trukket tilbake.",
        "Hvis en medarrangør bare skal slutte å redigere, vurder ønsket rolle og gjenværende brukere i stedet for å slette planen. Hvis hele samarbeidet avsluttes, avklar hvem som eier kalenderen og hvem som skal beholde den. Å forlate en mottatt kalender og å slette en du eier, er ulike valg."
      ]
    },
    {
      "heading": "Kontroller resultatet uten å love umiddelbar fjerning",
      "body": [
        "Kontroller at endringen er lagret i systemet som eier kalenderen. Hvis en autorisert kollega kan hjelpe, bekreft visning eller redigering fra vedkommendes konto uten å dele passord. Skill nektet tilgang fra en gammel hendelse som fortsatt vises i en bufret eller importert kopi.",
        "Ikke lov et universelt oppdateringsintervall eller at ingen varsling sendes. Ved overlevering må gruppen få vite hvilken plan som gjelder fremover. En synlig gammel oppføring viser ikke alene om personen har aktiv tilgang, en annen tillatelse eller en selvstendig kopi."
      ]
    },
    {
      "heading": "Følg opp tidligere kopier separat",
      "body": [
        "Eksporterte filer, skjermbilder, meldinger og separat lagrede avtaler kan bestå etter tilgangsendringer. Avklar hvilke kopier som betyr noe for overleveringen, og diskuter håndteringen med de berørte. En endring av kalenderrettigheter fastslår ikke hva hver mottaker allerede har lagret.",
        "Behold nødvendige kildeoppføringer mens resultatet vurderes. Ikke flytt sensitive møter til en annen delt kalender bare for å få den gamle til å se tom ut, og ikke avlys virkelige invitasjoner som tilgangstest. Noter kalender, delingsmåte og endring for senere feilsøking."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifiser eierkonto, kalender og delingsmåte.",
    "Kontroller navngitte personer, grupper og bredere publisering hver for seg.",
    "Bruk riktige delingskontroller i Google eller Cloud Calendars.",
    "Vurder tilbakestilling av en avslørt hemmelig feedadresse separat.",
    "Bekreft lagret tilgang uten å dele innloggingsopplysninger.",
    "Håndter tidligere eksporter og kopier separat fra aktiv tilgang."
  ],
  "faq": [
    {
      "q": "Slår fjerning av én person av offentlig kalender eller gruppetilgang?",
      "a": "Ikke anta det. Kontroller hver faktiske tilgangsvei. Google beskriver navngitte mottakere, grupper og bredere publisering som separate innstillinger."
    },
    {
      "q": "Forsvinner kalenderen umiddelbart og uten varsel?",
      "a": "Det finnes ingen universell garanti om forsvinning, varsler eller oppdateringstid. Bekreft den lagrede tilgangsendringen og skill aktiv tilgang fra bufret eller importert informasjon."
    },
    {
      "q": "Gir Advanced mulighet til å fjerne Google-kalendertilgang?",
      "a": "Advanced fjerner annonser i Cloud Calendars. Googles delingskontroller avhenger av eierskap, rettigheter og organisasjonsregler, ikke dette appabonnementet."
    }
  ],
  "sourcesHeading": "Leverandørveiledning om tilgang og abonnement",
  "sources": [
    {
      "label": "Google: delingskontroller og avslutning av tilgang",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Google: kontosynkronisering og hemmelige iCal-adresser",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "the-secret-address-of-a-google-calendar",
    "why-a-shared-calendar-does-not-appear"
  ],
  "updated": "2026-10-21"
},
};
