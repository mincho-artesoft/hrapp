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
  "title": "Googles hemmelige iCal-adresse: abonnement er ikke det samme som deling",
  "short": "Den hemmelige iCal-adressen",
  "description": "Forstå Googles hemmelige iCal-adresse, kontotilkoblinger og feeder. Håndter en avslørt adresse uten å love øyeblikkelige oppdateringer eller slettede kopier.",
  "lede": "En kalenderadresse, en kontotilkobling og en invitasjon gjør forskjellige jobber. Identifiser hva du har før du bruker det i en annen app. Guiden er publisert av Arte Soft, utvikleren av Cloud Calendars.",
  "commonBelief": "En hemmelig kalenderadresse skulle være en personlig invitasjon som kan trekkes tilbake for bare én mottaker.",
  "sections": [
    {
      "heading": "Velg tilkobling etter oppgaven",
      "body": [
        "Google skiller mellom å logge inn i en annen kalenderapp og å vise via en hemmelig iCal-adresse. Kontotilkobling kan støtte redigering; adressen gir et skrivebeskyttet abonnement. Google sier adressen er til eget bruk og fraråder å dele den med andre.",
        "Å vise egen arbeidsplan i en kompatibel kalender er noe annet enn å gi en kollega varig tilgang. Bestem om du skal se egen plan, samarbeide med en navngitt person eller publisere en timeplan for et publikum. Ikke velg en URL bare fordi den er lett å lime inn."
      ]
    },
    {
      "heading": "Finn riktig kalender, ikke bare riktig konto",
      "body": [
        "På en datamaskin plasserer Googles veiledning den hemmelige iCal-adressen under integreringsinnstillingene for den valgte kalenderen. Kontroller navnet først. Administratorer på jobb eller skole kan begrense valget; en manglende adresse er ikke grunn til å gjøre kalenderen offentlig.",
        "Hold adressen unna skjermbilder, offentlige støtteinnlegg og delte notater. Oppgi kontotype, kalendernavn og tilkoblingsmåte ved hjelpespørsmål, uten URL-en. Vanligvis må støtte først identifisere tilkoblingsmåten, før innholdet i hendelsene er relevant."
      ]
    },
    {
      "heading": "Kontroller hva mottakerappen faktisk la til",
      "body": [
        "Et abonnement følger en feed; en importert fil lager en egen kopi. Les veiledningen for mottakerappen og bekreft handlingen. Ikke anta at avtaler fra en nedlastet kalenderfil vil følge senere endringer bare fordi du åpnet filen.",
        "Bruk en vanlig, ufølsom hendelse du kjenner til for å sammenligne kalendernavn, dato og viste detaljer. Ikke lag et ekstra abonnement for å undersøke det første; to kopier kan få forsinkelse til å ligne en konflikt. Skjul én kalender midlertidig for å finne kilden."
      ]
    },
    {
      "heading": "Skill Google-lenker fra Cloud Calendars-lenker",
      "body": [
        "Cloud Calendars har egne delingsflyter for hendelser og kalendere, inkludert abonnementsfeeder. Disse er ikke hemmelige Google-adresser. Finn ut om avsenderen delte én hendelse, en kalender eller en kontobasert invitasjon før du velger åpningsmåte.",
        "En Cloud Calendars-mottaker kan ha rollen Reader, Writer eller Owner. En feedadresse alene beviser ikke redigeringsrett. En Google-visningsadresse gjør deg heller ikke til eier av kalenderen. Spør avsenderen hvilket system som skal brukes til endringer."
      ]
    },
    {
      "heading": "Ta hensyn til mottakerkalenderens oppdateringer",
      "body": [
        "Et abonnement lover ikke umiddelbar levering. Cloud Calendars-feeder inneholder et foreslått oppdateringsintervall, men mottakerappen bestemmer når oppdateringer hentes og vises. En gammel tid på én enhet beviser ikke at arrangøren glemte å lagre endringen.",
        "For et møte samme dag, sammenlign med arrangørens aktuelle plan og bekreft viktige endringer direkte. Noter kalenderen som viser gamle opplysninger og tidspunktet du sjekket. Ikke importer gjentatte ganger eller slett kildekalenderen for å tvinge fram oppdatering."
      ]
    },
    {
      "heading": "Håndter en avslørt adresse uten å love tilbakekalling",
      "body": [
        "Google beskriver tilbakestilling av en avslørt hemmelig adresse, slik at den gamle blir ugyldig og erstattes. Finn egne apper som bruker adressen, slik at abonnementene kan oppdateres. Å tilbakestille adressen er ikke det samme som å fjerne en navngitt samarbeidspartner.",
        "Tidligere lagrede avtaler, eksporter og skjermbilder er en egen sak. En endret lenke beviser ikke at alle gamle kopier er borte. Hvis informasjon nådde feil publikum, vurder selve innholdet og mottakerne; vellykket tilbakestilling beviser ikke full sletting."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifiser om du har kontotilkobling, invitasjon, abonnement eller fil.",
    "Kontroller eierkalenderen før du kopierer en adresse.",
    "Bruk Googles hemmelige adresse bare i egne kompatible apper.",
    "Bekreft at mottakerappen abonnerte i stedet for å importere.",
    "Bekreft hastende endringer med arrangøren fremfor å stole på oppdateringstid.",
    "Følg Googles tilbakestillingsveiledning ved eksponering og oppdater ønskede tilkoblinger."
  ],
  "faq": [
    {
      "q": "Kan jeg gi den hemmelige adressen til en kollega?",
      "a": "Google anbefaler å beholde den for egne apper. Bruk kalenderens delingskontroller og velg riktig rettighet når en annen person trenger tilgang."
    },
    {
      "q": "Kan jeg redigere originalen med et abonnement?",
      "a": "En hemmelig Google-iCal-adresse gir visning. Redigering krever egnet kontotilkobling og tillatelse; delingsroller i Cloud Calendars er en separat ordning."
    },
    {
      "q": "Sletter tilbakestilling gamle avtaler overalt?",
      "a": "Den gjør den gamle Google-adressen ugyldig. Det fastslår ikke at selvstendig lagrede filer, avtaler eller skjermbilder er slettet."
    }
  ],
  "sourcesHeading": "Leverandørveiledning og videre lesning",
  "sources": [
    {
      "label": "Google: kontotilkoblinger og hemmelige iCal-adresser",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    },
    {
      "label": "Google: dele en kalender",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: import, abonnement og oppdateringstid",
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
  "title": "Gjesterettigheter i Google Kalender: redigering, invitasjoner og gjesteliste",
  "short": "Gjesterettigheter på en hendelse",
  "description": "Kontroller Googles gjesterettigheter og standardvalg. Skill invitasjonsrettigheter fra kalendertilgang og rollene i Cloud Calendars.",
  "lede": "At en gjest kan svare, sier ikke alt om hva vedkommende kan gjøre. Kontroller rettighetene før du bruker én invitasjon for et team, kunder eller publikum. Guiden er publisert av Arte Soft, utvikleren av Cloud Calendars.",
  "commonBelief": "Inviterte gjester skulle bare kunne godta eller avslå, og alle apper skulle vise de samme rettighetskontrollene.",
  "sections": [
    {
      "heading": "Start med arrangøren og den opprinnelige hendelsen",
      "body": [
        "Åpne riktig hendelse i Google Kalender med arrangørkontoen eller en konto med administrasjonsrett. Kontroller kalender, dato og arrangør før endringer. En separat importert avtale er ikke et pålitelig sted å styre originalinvitasjonen.",
        "Avklar for et teammøte hvem som kan flytte det, invitere flere og se deltakerne. Dette er separate valg. En gjest som skal delta, trenger ikke nødvendigvis å administrere møtet."
      ]
    },
    {
      "heading": "Avgjør om gjester skal kunne endre møtet",
      "body": [
        "Google beskriver et valg for å endre hendelsen under gjesterettigheter i datamaskinens hendelsesredigering. Dette er en bred samarbeidsrett, ikke bare et forslag om ny tid. Google forklarer at den omfatter feltredigering, visning av gjester og rombestilling.",
        "En betrodd medarrangør av et verksted kan trenge fleksibiliteten; en kunde med en avtale trenger den kanskje ikke. Velg ut fra ansvaret og kontroller den lagrede hendelsen, ikke hvordan et annet møte var satt opp."
      ]
    },
    {
      "heading": "Kontroller invitasjoner og gjestesynlighet separat",
      "body": [
        "Google skiller mellom å invitere andre og å se andre gjester. Kontroller begge sammen med redigeringsrett. Å slå av én funksjon betyr ikke at den andre er vurdert, og en vist standard er ikke bevis på innstillingene i en eksisterende hendelse.",
        "For kunder som ikke kjenner hverandre, vurder om én felles invitasjon passer. Opplysninger i e-post, beskrivelse eller videresendt melding ligger utenfor spørsmålet om gjestelisten. Ikke legg fortrolige deltakeropplysninger i beskrivelsen og forvent at en skjult liste skjuler dem."
      ]
    },
    {
      "heading": "Kontroller standardvalg og viktige enkelthendelser",
      "body": [
        "Google beskriver også standardrettigheter for gjester under hendelsesinnstillinger, inkludert endringstillatelse. Kontrollene gjelder derfor ikke bare enkelthendelser. Se over standardene når planleggingsmønsteret endres, og kontroller viktige eksisterende invitasjoner hver for seg.",
        "For gjentakende møter, bekreft om du redigerer én forekomst eller serien. Ikke anta at en preferanse har omskrevet eldre invitasjoner. Test med en kollega på et avtalt, ufølsomt eksempel, ikke ved å flytte eller avlyse et ekte kundemøte."
      ]
    },
    {
      "heading": "Hold Cloud Calendars-rollene atskilt",
      "body": [
        "Cloud Calendars har egne Reader-, Writer- og Owner-roller. Reader gir visning og synkronisering; Writer tillater redigering; Owner styrer også deling og tilgang med den inviterte identiteten. Rollene er ikke brytere for Googles tre gjesterettigheter.",
        "Når en Google-spesifikk rettighet er viktig, kontroller originalhendelsen i Google Kalender. At en deltaker vises i Cloud Calendars, beviser ikke at alle Google-valg kan endres der. Hold eiertjeneste og mottakeridentitet klart ved manglende kontroller eller mislykkede endringer."
      ]
    },
    {
      "heading": "Bekreft det lagrede resultatet og ansvaret",
      "body": [
        "Åpne originalhendelsen igjen etter lagring og kontroller valgene. Be eventuelt en autorisert kollega bekrefte hva vedkommendes egen konto kan gjøre. Ikke del passord eller private gjestedetaljer som snarvei for å kontrollere tilgang.",
        "Skill deltakelse fra rettigheter. Redigeringsmulighet, en importert kopi og registrert aksept er ulike fakta. En mottakskvittering for deling i Cloud Calendars er ikke et RSVP-svar. Be om nødvendig deltakelsesbekreftelse ved viktige møter og avklar hvem som styrer endringer."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifiser arrangørkontoen og originalhendelsen.",
    "Avgjør hvem som skal administrere, invitere flere og se gjester.",
    "Kontroller hendelsens faktiske Google-rettigheter.",
    "Se over standarder uten å anta at eksisterende hendelser endres.",
    "Behandle Cloud Calendars-rollene som et separat system.",
    "Åpne den lagrede hendelsen og bekreft deltakelse separat."
  ],
  "faq": [
    {
      "q": "Kan en gjest endre møtetiden min?",
      "a": "Google støtter endringstillatelse. Kontroller hendelsen og gjestens tilgang; ikke utled rettigheten av at personen mottok en invitasjon."
    },
    {
      "q": "Angis alle gjesterettigheter bare på hver hendelse?",
      "a": "Nei. Google beskriver også standardrettigheter. Kontroller standardene for fremtidig planlegging og viktige eksisterende hendelser individuelt."
    },
    {
      "q": "Fjerner en skjult gjesteliste allerede sendt informasjon?",
      "a": "Det beviser ikke at eldre e-poster, beskrivelser, skjermbilder eller selvstendige kopier er fjernet. Kontroller det som faktisk ble delt separat."
    }
  ],
  "sourcesHeading": "Leverandørveiledning og videre lesning",
  "sources": [
    {
      "label": "Google: samarbeid om hendelser og standardrettigheter for gjester",
      "url": "https://support.google.com/a/users/answer/13293412?hl=en"
    },
    {
      "label": "Google: felter for gjesterettigheter på hendelser",
      "url": "https://developers.google.com/workspace/calendar/api/v3/reference/events"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "sharing-one-event-not-your-calendar",
    "why-a-shared-calendar-does-not-appear"
  ],
  "updated": "2026-10-21"
},

  'google-calendars-that-never-reach-your-iphone': {
  "title": "En Google-kalender mangler på iPhone: sjekk tilkobling og valg",
  "short": "Google-kalendere som mangler på iPhone",
  "description": "Finn en manglende Google-kalender ved å sjekke tilgang, synlighet og tilkoblingen som Apple Kalender eller Cloud Calendars bruker.",
  "lede": "Når én Google-kalender vises og en annen ikke gjør det, må du først finne ut hvor den manglende kalenderen er tilgjengelig. Kontotilgang, kalendervalg og tilgjengelige hendelser er ulike kontroller. Veiledningen er publisert av Arte Soft, utvikleren av Cloud Calendars.",
  "commonBelief": "Alle manglende Google-kalendere skyldes én skjult synkroniseringsliste, og direkte tilkobling garanterer at alt vises.",
  "sections": [
    {
      "heading": "Bekreft at kalenderen finnes for denne kontoen",
      "body": [
        "Åpne Google Kalender på nettet med kontoen du vil bruke på telefonen. Se etter selve kalenderen, ikke bare en kjent hendelsestittel. To kontoer kan ha kalendere med lignende navn. En invitasjon til jobbadressen gir ikke nødvendigvis privatkontoen tilgang.",
        "Mangler kalenderen også der, begynn med eieren eller delingsinvitasjonen. Ved gruppetilgang må du bekrefte medlemskapet og hvilken gruppe som fikk tillatelse. Ikke slett kontoen fra telefonen mens tilgangsspørsmålet fortsatt er uavklart."
      ]
    },
    {
      "heading": "Skill mellom en skjult og en manglende kalender",
      "body": [
        "Google beskriver hvordan du velger kalendere som skal vises, i menyen til Google Kalender-appen. En oppført kalender uten avkrysning er et synlighetsproblem. Mangler den fra listen, må du undersøke for eksempel invitert identitet, godkjenning eller tilkobling.",
        "En delingsinvitasjon på e-post og en abonnementsadresse er forskjellige veier. Google skiller mellom å legge til et nytt abonnement i nettleseren på en datamaskin og å åpne en kalender som allerede er delt via e-post. Behold originalinvitasjonen, men ikke publiser private lenker i åpne hjelpeinnlegg."
      ]
    },
    {
      "heading": "Finn ut hvordan iPhone-appen mottar Google-data",
      "body": [
        "Apple Kalender kan kobles til via Google-kontoen som er konfigurert på enheten. Googles veiledning inkluderer å aktivere Kalendere for kontoen. Følg oppdaterte instruksjoner for din iOS-versjon; innstillinger i en separat app er ikke det samme som denne enhetskontoen.",
        "Cloud Calendars tilbyr også direkte Google-pålogging. Avklar konto og tilkoblingsmåte før du legger til enda en forbindelse. Kommer samme kalender via både enhetskalenderen og direkte tilkobling, sammenlign kalenderidentitetene før du konkluderer med at Google har duplisert en hendelse."
      ]
    },
    {
      "heading": "Kontroller valgene i Cloud Calendars uten å anta full dekning",
      "body": [
        "Se gjennom kalenderne til den aktuelle Google-kontoen i Cloud Calendars og velg dem du vil bruke. Google-synkroniseringen kontrollerer kalendervalget. Vellykket pålogging alene viser ikke at alle kalendere er valgt eller at alle forespurte oppdateringer er fullført.",
        "Direkte tilkobling er en annen måte å motta Google-data på, ikke et løfte om at alle tilgjengelige kalendere vises. Finnes kalenderen på Googles nettsted, men ikke i Cloud Calendars, noter konto, kalendernavn og tilkoblingsmåte til kundestøtten. Bruk den opprinnelige tjenesten til hastesaker mens forskjellen undersøkes."
      ]
    },
    {
      "heading": "Skill en manglende kalender fra manglende datoer",
      "body": [
        "Er kalenderen oppført, men en avtale mangler, sammenlign den nøyaktige datoen i Google Kalender. Kontroller at hendelsen tilhører valgt kalender, og at du ser på samme forekomst av et gjentakende møte. En lignende tittel i en annen kalender er ikke samme kilderegistrering.",
        "Ikke anta at en app har lastet ned alle historiske eller fjerne fremtidige hendelser. Google-synkroniseringen i Cloud Calendars bruker et avgrenset datointervall. Et tomt søk bakover i tid beviser derfor ikke at Google har slettet hendelsen. Sjekk originaltjenesten før du endrer eller oppretter noe på nytt."
      ]
    },
    {
      "heading": "Be om hjelp med en nyttig sammenligning, ikke en nullstilling",
      "body": [
        "Noter app, kontotype, kalendernavn, eksempeldato og hvor kalenderen vises. Ta med eventuell feilmelding etter å ha fjernet private opplysninger. Dette skiller tillatelser, valg og synkronisering bedre enn å si at hele kontoen er ødelagt.",
        "Ved tidskritiske planer bør du bekrefte gjeldende hendelse med arrangøren. Ikke start med å slette kontoer, importere gjentatte kopier eller flytte hendelser mellom kalendere. Når tilkoblingsproblemet er forstått, kontroller samme eksempel før du endrer flere innstillinger."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Sammenlign riktig konto og kalender i Google Kalender på nettet.",
    "Sjekk om kalenderen mangler eller bare ikke er valgt.",
    "Avklar om du bruker Google-synkronisering på enheten, direkte apptilkobling eller abonnement.",
    "Kontroller valgte kalendere for riktig konto i Cloud Calendars.",
    "Sammenlign én nøyaktig hendelsesdato hos originaltjenesten.",
    "Rapporter forskjellen uten å dele private adresser eller nullstille kontoer."
  ],
  "faq": [
    {
      "q": "Vil direkte Google-pålogging vise alle kalendere?",
      "a": "Ikke anta full dekning. Konto, kalenderliste, valg og vellykket synkronisering har betydning. Sammenlign den manglende kalenderen med Google Kalender på nettet."
    },
    {
      "q": "Bør jeg slette kontoen og legge den til igjen?",
      "a": "Sjekk først identitet, tilgang, synlighet og tilkoblingsmåte. Ny tilkobling kan ikke gi en tillatelse eieren ikke har gitt."
    },
    {
      "q": "Betyr en manglende gammel hendelse at den er slettet?",
      "a": "Nei. Sjekk den opprinnelige Google-kalenderen og datoen. Appens datointervall eller søk kan avvike fra historikken tjenesten har lagret."
    }
  ],
  "sourcesHeading": "Veiledning fra leverandørene og videre lesning",
  "sources": [
    {
      "label": "Google: legge til Google-hendelser i Apple Kalender",
      "url": "https://support.google.com/calendar/answer/99358?hl=en&co=GENIE.Platform%3DiOS"
    },
    {
      "label": "Google: abonnementer og synlighet for kalendere",
      "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
    },
    {
      "label": "Google: hvordan kalenderlisten fungerer",
      "url": "https://developers.google.com/workspace/calendar/api/v3/reference/calendarList/list"
    }
  ],
  "seeAlso": [
    "why-a-shared-calendar-does-not-appear",
    "icloud-google-and-outlook-in-one-view",
    "the-secret-address-of-a-google-calendar"
  ],
  "updated": "2026-10-21"
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
