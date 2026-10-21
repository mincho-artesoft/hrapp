import { LocalisedArticle } from '../types';

/**
 * The four articles this language carries.
 *
 * Chosen one per intent -- weather, one view, sharing, price -- so the language
 * answers a whole question rather than a quarter of four. The numbers are not
 * here: they live once in article-facts.ts and join the prose by id, so a
 * translation can rewrite every sentence without touching a figure.
 */
export const ARTICLES_NO: Readonly<Record<string, LocalisedArticle>> = {
  "month-view-on-a-bigger-screen": {
  "updated": "2026-10-22",
  "title": "Månedskalender på iPad og iPhone: se datoene, sjekk detaljene",
  "short": "Bruk månedsvisning uten å overse detaljer",
  "description": "Sammenlign datoer på iPad eller iPhone. Sjekk skjulte hendelser, valgte kalendere og klokkeslett før delte eller gjentakende avtaler flyttes.",
  "lede": "Månedsvisning viser hvilke datoer avtalene faller på. Den egner seg dårligere til å fastslå at et bestemt klokkeslett er ledig. Velg en dato i oversikten, og undersøk dagen og hendelsen før du avtaler noe. Veiledningen er publisert av Arte Soft, utvikleren av Cloud Calendars.",
  "commonBelief": "Et større månedsrutenett viser alle detaljer, og en tilsynelatende tom dato beviser at alle er ledige.",
  "sections": [
    {
      "heading": "Avgjør om du trenger datoer eller nøyaktige klokkeslett",
      "body": [
        "Bruk måneden til å sammenligne prosjektfrist, reise og familieavtale over flere uker. Skal du finne ut om to avtaler overlapper klokken 14.30, bytt til dags- eller ukesvisning og sjekk nøyaktig start og slutt. En månedsrute har ikke samme tidsskala som et timerutenett.",
        "En arrangør som velger workshopdato, kan først utelukke en reiseuke. Deretter må den foreslåtte dagen sjekkes: avtaler, forberedelser, reisetid og nødvendig sluttid. En tomt utseende rute er en mulighet å undersøke, ikke en bekreftet bestilling eller et uttrykk for andres tilgjengelighet."
      ]
    },
    {
      "heading": "Les antallet ekstra hendelser, ikke bare synlige titler",
      "body": [
        "Månedsruten i Cloud Calendars viser nå et begrenset antall hendelsesetiketter og et ekstra antall når flere hendelser tilhører datoen. Titlene holdes på én linje og kan forkortes. Åpne dagen eller hendelsen når full tittel eller resten av avtalene er viktige.",
        "En større iPad-skjerm kan gjøre oversikten mer leselig, men mer fysisk plass fjerner ikke nødvendigvis alle visningsgrenser. Et smalt appvindu eller større tekst påvirker hva som får plass. Gjør samme sjekk på iPhone: åpne dagen før du regner synlige etiketter som hele planen."
      ]
    },
    {
      "heading": "Sjekk måned, valgte kalendere og nabodatoer",
      "body": [
        "Les måneden og året som vises før du velger dato. Rutenettet kan inneholde datoer fra en nabomåned for å fylle radene. Bruk månedsnavigasjonen i Cloud Calendars og kontroller valgt dato fremfor bare å stole på rutens plassering.",
        "Sjekk hvilke kalendere som er valgt. Å skjule jobbhendelser kan gjøre familieplanen lettere å lese, men fjerner også disse avtalene fra oversikten. Undersøker du en duplikat, skjul én kilde midlertidig og sammenlign. Ikke slett en avtale bare for å rydde måneden."
      ]
    },
    {
      "heading": "Åpne hendelsen før du endrer en felles avtale",
      "body": [
        "Bekreft tittel, eier eller kalender, lokal tid og varighet i detaljene. Farge hjelper med oversikten, men erstatter ikke kunnskap om konto eller redigeringsrett. En synlig invitasjon er noe annet enn en avtale du organiserer selv.",
        "Cloud Calendars lar deg dra hendelser i måneden til en annen dato. Før du gjør det med en reell avtale, avklar ønsket dato og omfanget for gjentakelser. Åpne hendelsen igjen etter en tillatt endring og sjekk resultatet; en lokal handling beviser ikke at tjenesten eller alle deltakere har godtatt endringen."
      ]
    },
    {
      "heading": "Sjekk gjentakelser og tidssoner hver for seg",
      "body": [
        "Skal bare denne ukens undervisning flyttes, må du unngå å endre fremtidige gjentakelser ved et uhell. Les valget for endringens omfang, og sjekk både den endrede og en senere forekomst etterpå. Måneden gjør datoene lette å sammenligne, men redigeringsomfanget bestemmer virkningen.",
        "Ved reiser eller møter på tvers av tidssoner må lokal dato og klokkeslett kontrolleres uttrykkelig. Flytting til en annen dag konverterer ikke automatisk det tiltenkte møtetidspunktet. Sjekk overgang til og fra sommertid der det er relevant, og bekreft tidspunktet med de involverte."
      ]
    },
    {
      "heading": "Bruk den større oversikten uten å blande produkter",
      "body": [
        "Apple Kalender har egne valg for månedsvisning, mens Teamup beskriver ulike visninger i nettleser og mobilapp. Kontrollene tilhører de respektive produktene. Ikke let etter Teamups nettleseroppsett eller Apple Kalenders visningsmeny i Cloud Calendars bare fordi visningene har samme navn.",
        "En måned med avtaler er heller ikke en måned med værmeldinger. For uteplaner må du sjekke sted, dato og tilgjengelige prognosetimer separat. Lagre den endelige avtalen i riktig kalender og bekreft endringer direkte med deltakerne."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Velg mulige datoer i måneden, og sjekk nøyaktige tider i dags- eller ukesvisning.",
    "Åpne dager med ekstra antall eller forkortede titler.",
    "Sjekk måned, år og valgte kalendere før du antar at en dato er ledig.",
    "Bekreft hendelsens kalender, tid, varighet og redigeringsrett.",
    "Les omfanget for gjentakelser og kontroller lagret forekomst etter flytting.",
    "Sjekk tilgjengelig værinformasjon separat og bekreft endringer med deltakerne."
  ],
  "faq": [
    {
      "q": "Viser månedsvisning på iPad alle avtaler i sin helhet?",
      "a": "Ikke anta det. Cloud Calendars begrenser hendelsesetikettene i en månedsrute og viser et ekstra antall. Åpne dagen og hendelsen for å undersøke hele planen."
    },
    {
      "q": "Betyr en tom dag at jeg er ledig?",
      "a": "Sjekk først valgte kalendere, dato og om relevante kontodata finnes. Oversikten viser bare informasjonen som er tilgjengelig og vises akkurat nå."
    },
    {
      "q": "Endrer flytting av en gjentakende hendelse bare den datoen?",
      "a": "Les valget for redigeringsomfang i stedet for å anta det. Sjekk den endrede og en senere forekomst etter lagring, og bekreft ønsket avtale."
    }
  ],
  "sourcesHeading": "Sammenlign de offisielle beskrivelsene av visninger",
  "sources": [
    {
      "label": "Apple: månedsvisning, flerdagersvisning og listevisning i Apple Kalender",
      "url": "https://support.apple.com/en-ca/guide/iphone/iphfd1054569/ios"
    },
    {
      "label": "Teamup: kalendervisninger og oppsett i nettleser kontra app",
      "url": "https://calendar.teamup.com/kb/how-to-use-calendar-views/"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "weather-inside-your-calendar",
    "sharing-one-event-not-your-calendar"
  ]
},

  'weather-inside-your-calendar': {
  "title": "En kalender som allerede har været i seg",
  "short": "Været inni kalenderen",
  "description": "Hvorfor to apper for å planlegge en dag er en designfeil, og hvordan en kalender ser ut der værmeldingen er en del av visningen i stedet for å stå ved siden av.",
  "lede": "Nesten alle planlegger dagen mellom to apper. Kalenderen sier hvor man skal være; værappen sier hvordan været er når man kommer fram. Å holde de to sammen i hodet er den delen ingen merker at de gjør — helt til en lørdag går tapt.",
  "commonBelief": "At en kalender er for avtaler og en værapp er for været, og at å holde dem adskilt rett og slett er slik telefoner fungerer.",
  "sections": [
    {
      "heading": "Prisen for to apper er ikke to trykk",
      "body": [
        "Å bytte koster ingenting. Det dyre er at de to aldri er enige om hva som betyr noe. Kalenderen vet at lørdag klokken elleve er to timer opptatt; værappen vet at det regner fra ti til ett. Ingen av dem vet at disse to kjensgjerningene til sammen betyr at blokken må flyttes.",
        "Integrasjonslaget er du. Det virker helt til du har mye å gjøre, som er nøyaktig når det er mest verdt å beskytte planene sine."
      ]
    },
    {
      "heading": "Den tilgjengelige værmeldingen",
      "body": [
        "Cloud Calendars bruker den tilgjengelige værmeldingen for det valgte stedet. Time- og dagsdata kan dekke ulike perioder.",
        "Datoene du kan vise i kalenderen, bestemmer ikke hvor langt værmeldingen rekker. Månedsvisning betyr ikke en værmelding for hele måneden eller hver hendelse."
      ]
    }
  ],
  "claims": {
    "price": "Hva værfunksjonene koster"
  },
  "practical": [
    "Kontroller sted, dato og tilgjengelige timer før du planlegger ut fra værmeldingen."
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-a-subscription-actually-buys"
  ],
  "updated": "2026-10-21"
},

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google og Outlook i én visning',
    short: 'Tre kontoer, én visning',
    description:
      'Nesten alles liv er delt mellom en privat Apple-kalender, en Google-konto og en Exchange fra jobben. Hva som endrer seg når de havner i samme rutenett.',
    lede: 'Problemet er nesten aldri at en av kalenderne er dårlig. Det er at du har tre og bare én uke.',
    commonBelief: 'At det å holde jobb og privatliv i hver sin app er en grense og ikke en mangel.',
    sections: [
      {
        heading: 'Dobbeltbooking er strukturelt',
        body: [
          'Hvis avtalene dine bor tre steder, kan ingen steder fortelle deg om du er ledig. Sammenslåingssteget er du, og du kjører det etter hukommelsen, som regel mens noen venter på svar.',
          'Derfor er den klassiske tabben ikke å glemme en hendelse; det er å si ja til noe som kolliderer med en hendelse du ikke kunne se.',
        ],
      },
      {
        heading: 'Hva ett rutenett gir',
        body: [
          'Alle kontoer i samme uke, farget etter opphav, redigerbare på stedet. Du slutter å lure på hvilken app som har svaret, fordi spørsmålet slutter å være i flertall.',
          'iCloud og Google synkroniserer i gratisversjonen. Microsoft-kontoer — Outlook og Exchange — hører til den betalte, fordi den forbindelsen har en løpende kostnad de andre ikke har.',
        ],
      },
    ],
    claims: {
      accounts: 'Kontotyper som får plass i én visning',
      premiumMonthly: 'Månedspris for å legge til Microsoft, i dollar',
    },
    practical: [
      'Legg inn privatkontoen først og deretter den som forårsaker kollisjonene.',
      'Farg etter konto og ikke etter kategori: det er opphavet du må se med en gang.',
      'Fortsett å skrive i den kalenderen andre allerede leser.',
    ],
    seeAlso: ['weather-inside-your-calendar', 'what-a-subscription-actually-buys'],
  },

  'sharing-one-event-not-your-calendar': {
  "updated": "2026-10-21",
  "title": "Del én kalenderhendelse: velg riktig lenke og tilgang",
  "short": "Dele én hendelse",
  "description": "Del én hendelse uten hele kalenderen. Forstå Reader, Writer og Owner, forhåndsvisninger, oppdateringer og grensene for å trekke tilbake tilgang.",
  "lede": "Å dele middagsdetaljer, la en medarrangør redigere og samle svar om deltakelse er ulike oppgaver. Velg oppgaven først, deretter delingsmåten. Denne veiledningen er skrevet av Arte Soft, utvikleren av Cloud Calendars.",
  "commonBelief": "Alle hendelseslenker er skrivebeskyttede kalenderabonnementer som oppdateres straks og registrerer et svar.",
  "sections": [
    {
      "heading": "Start med én hendelse og sjekk detaljene",
      "body": [
        "Deling av én hendelse gjelder hendelsen, ikke avsenderens hele kalender. Kontroller tittel, tidssone, sted, notater og møtelenke før sending. Opplysninger til én gjest passer kanskje ikke i en lenke som skal spres bredt.",
        "Å dele en middag krever for eksempel ikke at du deler kalenderen med legetimene dine. Middagens eget sted og lenker følger likevel med. Kontroller hendelsen fremfor å stole på personvernet til kalenderen rundt den."
      ]
    },
    {
      "heading": "Velg forhåndsvisning, e-post eller QR",
      "body": [
        "Cloud Calendars har ulike delingsmåter. App Clip viser en forhåndsvisning; hele appen trengs for å legge til hendelsen derfra. E-post- og QR-invitasjoner bruker en nettside som tilbyr å åpne Cloud Calendars. Ikke beskriv alle disse lenkene som utskiftbare abonnementsadresser.",
        "Avsenderen logger inn for appens synkroniserte deling. Lenker og QR-koder kan videresendes, så send dem bare dit innholdet passer. En QR-kode formidler en lenke; den beviser ikke hvem som åpnet den."
      ]
    },
    {
      "heading": "Gi bare tilgangen mottakeren trenger",
      "body": [
        "E-postinvitasjoner lar deg velge Reader, Writer eller Owner. Reader kan se og synkronisere; Writer kan redigere; Owner kan også dele og administrere tilgang. Valgene har konsekvenser og er ikke tre navn på samme visning. Bruk Reader når personen bare trenger programmet.",
        "Velg Writer for en medarrangør som skal endre hendelsen. Velg Owner bare hvis personen også skal styre andres tilgang. Utvidet tilgang krever riktig innlogget identitet. En anonym mottaker er ikke en identifisert medeier."
      ]
    },
    {
      "heading": "Forstå hvordan mottakeren legger den til",
      "body": [
        "I hele appen kreves kalendertillatelse og en skrivbar målkalender. Mottakeren bør sjekke målet før lagring. Kopien kan deretter knyttes til den delte hendelsen for senere oppdateringer.",
        "Dette skiller seg fra å importere en vanlig ICS-fil til en annen kalender. Import gir en kopi; et abonnement sjekker en feed jevnlig. Sender du en ICS-feed i stedet for en appinvitasjon, forklar dette og bekreft at mottakerens kalender støtter det."
      ]
    },
    {
      "heading": "Bekreft endringer før du stoler på dem",
      "body": [
        "Synkronisert deling kan formidle senere endringer eller avlysning, men mottakerens enhet må få anledning til å motta dem. Et hint om feedoppdatering er ingen leveringsfrist. En frakoblet enhet, et uoppdatert abonnement eller en separat importert kopi kan vise gammel informasjon.",
        "Flyttes middagen rett før start, oppdater hendelsen og kontakt gjestene direkte. Be dem bekrefte den nye tiden. Å sende en oppdatering og få et svar om deltakelse er separate trinn."
      ]
    },
    {
      "heading": "Administrer tilgang uten å love sletting av kopier",
      "body": [
        "Gjennomgå mottakertilgang og fjern unødvendige rettigheter. Å fjerne en mottaker og tilbakekalle en feedlenke er ulike handlinger; ingen av dem skal beskrives som fjernsletting av skjermbilder, meldinger eller alle kalenderkopier.",
        "Har en lenke kommet utenfor målgruppen, identifiser lenken eller tilgangstildelingen. Kontroller den berørte delingsmåten etter endringen. Hold private detaljer ute av bredt spredte lenker fremover, fremfor å stole på senere tilbakekalling."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Sjekk detaljene og velg behovet: visning, redigering eller deltakelsessvar.",
    "Velg delingsmåte og logg inn når nødvendig.",
    "Bruk Reader for lesere; gi Writer eller Owner bare til tilsvarende ansvar.",
    "Be mottakeren sjekke tid og målkalender ved tillegging.",
    "Ved hasteendringer: oppdater hendelsen og send en direkte melding.",
    "Gjennomgå mottakerrettigheter og lenketilgang separat når delingen avsluttes."
  ],
  "faq": [
    {
      "q": "Avslører én delt hendelse hele kalenderen min?",
      "a": "Den synkroniserte enkelthendelsesdelingen gjelder hendelsen. Dens egne detaljer eksponeres fortsatt gjennom valgt delingsmåte. Sjekk dem, og unngå en hel kalenderinvitasjon når du mener én hendelse."
    },
    {
      "q": "Kan mottakeren endre hendelsen?",
      "a": "Ja, med passende Writer- eller Owner-tilgang i den støttede innloggede flyten. Reader gjelder visning og synkronisering. Et vanlig ICS-abonnement er ikke samme redigeringsmekanisme."
    },
    {
      "q": "Angrer fjerning alt personen allerede har mottatt?",
      "a": "Det kan ikke garanteres. Tilgangsendringer påvirker delingsforholdet, men lagrede kopier, skjermbilder og meldinger kan bestå. En delt feedadresse må vurderes separat."
    }
  ],
  "sourcesHeading": "Referanser om mottakeralternativer",
  "sources": [
    {
      "label": "Apple: oversikt over App Clips",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google: hendelsesimport og begrensninger",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft: importere eller abonnere på en kalender",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": []
},

  'what-a-subscription-actually-buys': {
  "updated": "2026-10-21",
  "title": "Hva et abonnement faktisk gir",
  "short": "Hva et abonnement gir",
  "description": "Hva et abonnement gir: Base, Advanced, Premium.",
  "lede": "Denne veiledningen publiseres av Arte Soft, utvikleren av Cloud Calendars.",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "Base inkluderer Google Calendar-synkronisering, Google Meet, kalendervisninger, vær og widgeter. Gratisplanen kan vise annonser."
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Advanced inkluderer Base og fjerner annonser. Premium inkluderer Advanced og legger til Microsoft Calendar og Microsoft Teams.",
        "Et abonnement gir ikke redigeringstilgang til andres kalendere og omgår ikke begrensninger på en jobbkonto."
      ]
    },
    {
      "heading": "Informasjon om kjøp og oppsigelse",
      "body": [
        "Kontroller lokal pris, faktureringsperiode og vilkår for fornyelse før kjøp.",
        "For et abonnement fakturert av Apple åpner du Innstillinger → navnet ditt → Abonnementer. Kontroller status og utløpsdato. Å stoppe fornyelsen er noe annet enn å slette appen eller kalenderdata; ikke anta at betalte funksjoner fortsatt er tilgjengelige etter utløp."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Kontroller lokal pris, faktureringsperiode og vilkår for fornyelse før kjøp.",
    "Et abonnement gir ikke redigeringstilgang til andres kalendere og omgår ikke begrensninger på en jobbkonto."
  ],
  "faq": [
    {
      "q": "Hvordan stopper jeg fornyelsen?",
      "a": "For et abonnement fakturert av Apple åpner du Innstillinger → navnet ditt → Abonnementer. Kontroller status og utløpsdato. Å stoppe fornyelsen er noe annet enn å slette appen eller kalenderdata; ikke anta at betalte funksjoner fortsatt er tilgjengelige etter utløp."
    }
  ],
  "sourcesHeading": "Informasjon om kjøp og oppsigelse",
  "sources": [
    {
      "label": "Apple: Hvordan stopper jeg fornyelsen?",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view"
  ]
},
};
