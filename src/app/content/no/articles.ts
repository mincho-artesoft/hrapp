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
  "updated": "2026-10-23",
  "title": "Kalender med vær på iPhone og iPad: planlegg dagen din i én visning",
  "short": "Bruk kalender og vær sammen",
  "description": "Sammenlign kalenderen din med værmeldingen for det valgte stedet på iPhone og iPad.",
  "lede": "Cloud Calendars samler timeplanen din og været i samme app på iPhone eller iPad. Bruk kalenderen til å velge en dato og værvisningen til å se det valgte stedet og tilgjengelige varseltimer. For planer utendørs bør du sjekke tidsrommet som faktisk betyr noe, i stedet for å stole på et dagsikon. Denne veiledningen er publisert av Arte Soft, appens utvikler.",
  "commonBelief": "Været som vises ved siden av en kalender, beskriver automatisk adressen til hver hendelse, hver time og enhver fremtidig dato.",
  "sections": [
    {
      "heading": "Velg et reelt planleggingsspørsmål",
      "body": [
        "Ta utgangspunkt i en bestemt hendelse, for eksempel et ettermiddagsbesøk i en park. Finn ut hva som kan endres: tidspunktet, stedet, forberedelsene eller beslutningen om å bruke et alternativ. Du trenger ikke å omorganisere hele kalenderen bare fordi dagens symbol viser regn.",
        "Skriv ned aktivitetens faktiske start og slutt, inkludert rigging hvis det er relevant. En kalenderoversikt hjelper deg å finne mulige datoer, mens værmeldingen gjelder et bestemt sted og tidsrom. Hold disse to oppgavene atskilt når du sammenligner alternativer."
      ]
    },
    {
      "heading": "Bekreft værstedet før du leser verdiene",
      "body": [
        "Cloud Calendars tilbyr vær for gjeldende eller valgt sted. Sjekk stedet som vises, i stedet for å anta at adressen til en hendelse automatisk endrer værmeldingen. En hendelse i en annen by må sammenlignes med været i den byen.",
        "En besøkende kan for eksempel planlegge ankomst til et museum mens telefonen fortsatt er hjemme. Les stedet i værmeldingen og hendelsens lokale klokkeslett før du sammenligner dem. Verdier som ser nærliggende ut, er ikke bevis på at timeplanen og værmeldingen bruker samme sted."
      ]
    },
    {
      "heading": "Sjekk time- og dagsdekning hver for seg",
      "body": [
        "Bruk en dagsoppføring for oversikt og de tilgjengelige timeoppføringene når du har spørsmål om en del av dagen. En bestilling fra to til fem krever mer enn et raskt blikk på ett symbol. Sjekk om de relevante timene faktisk er tilgjengelige.",
        "I appens nåværende kilde bruker dagslisten opptil ti returnerte WeatherKit-dager. Det er atskilt fra kalendernavigasjon og fra timene som leveres nå. En fremtidig hendelse utvider ikke værdekningen. Hvis tidsrommet mangler, bør du planlegge en ny værsjekk senere."
      ]
    },
    {
      "heading": "Forstå hva værverdien betyr",
      "body": [
        "Apple dokumenterer WeatherKit-data som temperatur, nedbør, vind og UV, og noen produkter er bare tilgjengelige i utvalgte regioner. Les verdiene som er tilgjengelige for stedet du har valgt, i stedet for å forvente alle værprodukter overalt.",
        "Veiledningen fra Met Office viser hvorfor varslingsperiode og definisjoner av variabler betyr noe: noen verdier gjelder et øyeblikk, andre en periode. Bruk etikettene fra den aktuelle leverandøren. Sannsynlighet for regn, mengde og varighet er ulike spørsmål, og ett enkelt tall avgjør ikke alle utendørsaktiviteter."
      ]
    },
    {
      "heading": "Gå gjennom et utkast opprettet fra en værtime",
      "body": [
        "Der appen tilbyr å opprette en hendelse fra en time, åpnes et utkast. I den nåværende kilden bruker appen tidssonen til værstedet, foreslår en varighet på én time og velger standardkalenderen for nye hendelser. Kontroller hver verdi før du lagrer.",
        "Bekreft tittelen, målkontoen for kalenderen, start, slutt og ønsket sted. Et valgt varsel gir ikke tillatelse til å redigere en delt kalender, varsle et sted eller reservere et rom. Sjekk den lagrede hendelsen og innhent eventuell godkjenning planen krever."
      ]
    },
    {
      "heading": "Hold nettdemonstrasjonen atskilt",
      "body": [
        "Nettstedets interaktive værdemonstrasjon bruker Open-Meteo. Appen bruker Apple WeatherKit. En webdemo er nyttig for å utforske presentasjonen, men sted, data og tilgjengelige datoer kan være annerledes enn i appen.",
        "For en reell beslutning bør du åpne appen og sammenligne den planlagte hendelsen med tilgjengelig værmelding. Hvis du endrer en delt plan, må du bekrefte arrangør, omfanget av gjentakelsen og deltakerne. Ha et avtalt alternativ klart når aktiviteten avhenger av forholdene."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifiser hendelsen og beslutningen været kan påvirke.",
    "Bekreft værstedet og hendelsens lokale dato og klokkeslett.",
    "Se på tilgjengelig timedekning separat fra dagsoppsummeringen.",
    "Les sannsynlighet, mengde og andre relevante verdier ut fra etikettene deres.",
    "Gå gjennom alle detaljer i hendelsesutkastet og målkontoen før du lagrer.",
    "Sjekk på nytt når beslutningen skal tas, og bekreft delte endringer direkte."
  ],
  "faq": [
    {
      "q": "Følger været ved siden av kalenderen min adressen til hver hendelse?",
      "a": "Ikke anta det. Bekreft værstedet som vises, og sammenlign det med stedet for hendelsen; nærhet på skjermen beviser ikke at de stemmer overens."
    },
    {
      "q": "Bruker appen samme værleverandør som nettstedet?",
      "a": "Nei. Appen bruker Apple WeatherKit; nettstedsdemonstrasjonen bruker Open-Meteo separat."
    },
    {
      "q": "Lagrer appen automatisk en hendelse når jeg velger en varseltime?",
      "a": "Den starter et utkast der denne handlingen tilbys. Sjekk dato, tidssone, varighet, kalender og sted, og lagre deretter den ønskede hendelsen."
    }
  ],
  "seeAlso": [
    "weather-calendar-history-versus-forecast-iphone",
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather",
    "weather-where-the-event-is",
    "planning-outdoors-without-being-rained-on"
  ],
  "sourcesHeading": "Offisielle kilder og videre lesning",
  "sources": [
    {
      "label": "Apple: WeatherKit-varselinformasjon og regional tilgjengelighet",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: varslingssted, perioder og værverdier",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ],
  "comparison": {
    "heading": "Hvilken værvisning svarer på spørsmålet ditt?",
    "columns": [
      "Spørsmålet ditt",
      "Hva du bør se på",
      "Hva det ikke fastslår"
    ],
    "rows": [
      {
        "cells": [
          "Hva kommer senere i dag?",
          "Kalenderens dag- eller ukevisning ved siden av været for det valgte stedet.",
          "At adressen til hver hendelse automatisk endrer værstedet."
        ]
      },
      {
        "cells": [
          "Kan regn påvirke hendelsen min i ettermiddag?",
          "Timedata for stedet og hele tidsrommet for hendelsen.",
          "At et dagsymbol beskriver hver time."
        ]
      },
      {
        "cells": [
          "Kan jeg planlegge neste måned ut fra været?",
          "Kalenderen din nå, og deretter en værsjekk nærmere datoen.",
          "At navigering i kalenderen utvider værdekningen."
        ]
      },
      {
        "cells": [
          "Kan jeg få en rask oversikt hjemme?",
          "Den passende widgeten på Hjem-skjermen.",
          "At alle widgetoppsett inkluderer hendelser eller en full værmelding."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-right",
    "hook"
  ],
  "galleryCaption": "Ekte skjermer fra Cloud Calendars: værvisningen og en dag med hendelser. Sjekk valgt sted og dato i appen.",
  "actionHeading": "Planlegg med timeplanen og værmeldingen samlet",
  "actionText": "Cloud Calendars er for iPhone og iPad. Start med visningene, vær og Google Calendar-synkronisering inkludert i Base; Advanced fjerner annonser, mens Premium legger til støtte for Microsoft Calendar og Teams.",
  "articleLinks": [
    {
      "slug": "forecast-beside-every-event",
      "label": "Sjekk været for timene i en hendelse"
    },
    {
      "slug": "the-widget-that-shows-what-is-next",
      "label": "Velg en widget for kalender og vær"
    },
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "Samle kalenderkontoer i én visning"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
  "updated": "2026-10-23",
  "title": "Se Google-, iCloud- og Outlook-kalendere samlet på iPhone og iPad",
  "short": "Tre leverandører, én visning",
  "description": "Kombiner kalendervisninger og forstå kontotillatelser, kopier og plankrav.",
  "lede": "For å se jobb- og private hendelser samlet kobler du til de aktuelle kontoene, velger kalenderne deres og kontrollerer de samme hendelsene i én visning. Cloud Calendars støtter planlegging på iPhone og iPad med iCloud og Google Calendar; støtte for Microsoft Calendar er inkludert i Premium. Å se hendelser samlet er noe annet enn å kopiere opptatt-tid mellom leverandørkontoer. Arte Soft, utvikleren, publiserer denne veiledningen.",
  "commonBelief": "Å legge flere kalendere i én app sørger automatisk for at tilgjengelighet, deling og hendelseskopier holdes i samsvar.",
  "sections": [
    {
      "heading": "Identifiser konto og kalender bak hver hendelse",
      "body": [
        "Begynn med én vanlig hendelse fra hver leverandør. Merk deg hvilken e-postadresse som er logget inn, kalendernavnet og om du eier hendelsen eller har mottatt en invitasjon. To kalendere som heter «Kalender», kan tilhøre helt forskjellige kontoer. En farge hjelper deg å skanne en uke; konto og kalender avgjør hvor en endring skal gjøres.",
        "For eksempel kan en tannlegetime i din private iCloud-kalender og et prosjektmøte i Microsoft vises samlet for deg. Det gjør ikke i seg selv tannlegetimen synlig for kollegene dine eller reserverer den tiden i planleggingsverktøyene deres.",
        "Bestem ønsket resultat før du endrer en tilkobling. Hvis du vil flytte hendelsesdata til en annen konto, bruker du «Velg et kalender-eksportformat» nedenfor for å finne en støttet overføringsvei, og kontrollerer representative hendelser før du stoler på målet. Hvis du vil sammenligne tider, behold de eksisterende kalendereierne og vis valgte kilder samlet. Hvis en annen konto må motta opptatt-tid, forklarer «Cloud Calendars and OneCal by workflow» hvordan kopiering av tilgjengelighet skiller seg fra en personlig oversikt."
      ]
    },
    {
      "heading": "Koble til via riktig vei",
      "body": [
        "For iCloud må du først aktivere iCloud Calendar på iPhone under den aktuelle Apple-kontoen. Apples oppsettsveiledning forklarer enhetsinnstillingene. Cloud Calendars får tilgang til kalendere som er tilgjengelige gjennom iPhones kalendersystem, og trenger kalendertilgang for å lese dem. Det er ikke nok at en konto er koblet til på en annen enhet.",
        "Cloud Calendars har også handlingene «Sign in with Google» og «Sign in with Microsoft». Kontroller hvilken konto du velger ved innlogging, og åpne deretter kalendergruppen og velg kalenderne du trenger. Hvis du logger inn hos riktig leverandør med feil privat- eller jobbidentitet, kan du få en helt gyldig, men uventet kalenderliste."
      ]
    },
    {
      "heading": "Forstå abonnementene uten å forveksle dem med tillatelser",
      "body": [
        "Base-planen inkluderer Google Calendar-synkronisering og kalendervisningene. Advanced legger til fjerning av annonser i Base. Premium legger til Microsoft Calendar- og Microsoft Teams-funksjoner. Se gjennom gjeldende lokal pris og faktureringsperiode før kjøp.",
        "Et abonnement endrer hvilke appfunksjoner som er tilgjengelige; det gir deg ikke eierskap til andres kalender. Google skiller mellom tillatelse til å se hendelser og tillatelse til å endre dem. Arbeidsgiverens retningslinjer og tillatelsene knyttet til en Microsoft-kalender gjelder fortsatt. En synlig hendelse eller en tilgjengelig redigeringsmulighet er ikke bevis på at leverandøren vil godta en oppdatering."
      ]
    },
    {
      "heading": "En kombinert visning kan inneholde kalenderkopier",
      "body": [
        "Google- og Microsoft-tilkoblinger bruker kalenderkopier i iPhones kalendersystem for å vise og synkronisere hendelser. Ikke anta at tilkobling av en konto betyr at ingen kopi finnes utenfor den opprinnelige leverandøren. Målet som brukes for disse kopiene, kan avhenge av hvilke kalenderkilder som er tilgjengelige på enheten.",
        "Hvis den samme kontoen også når telefonen via en annen vei, må du kontrollere kalendernavn og kilder før du behandler gjentatte hendelser som separate hendelser. Skjul én kalender midlertidig for å identifisere hvilken visning den leverer. Ikke slett en hendelse eller kalender bare for å få skjermen til å se ryddig ut: En tilkoblet kopi kan sende endringer tilbake til leverandøren sin."
      ]
    },
    {
      "heading": "Fortsett å velge målkalender når du oppretter en hendelse",
      "body": [
        "Før du lagrer, må du kontrollere hendelsens kalender like nøye som dato og klokkeslett. For en familiehendelse velger du kalenderen familien faktisk bruker; for et jobbmøte bruker du det godkjente jobbmålet. At du ser begge kalenderne samlet, gjør ikke noen av dem automatisk til mål for hver nye hendelse.",
        "Å endre en hendelses kalender eller dra den mellom kalendere kan være en flytting, ikke en ufarlig ekstra visning. Behold invitasjoner og gjentakende møter i den etablerte kalenderen mens du undersøker et visningsproblem. Hvis du trenger en endring, må du først fastslå hvem som eier hendelsen og hvilken kalender som kan godta den."
      ]
    },
    {
      "heading": "Bekreft oversikten før du stoler på den",
      "body": [
        "Sammenlign en nylig hendelse i leverandørens egen kalender med den tilsvarende hendelsen i Cloud Calendars. Kontroller dato, tidssone, tittel og valgt kalender. For en redigerbar kalender du eier, er en engangshendelse uten gjester en bedre test enn å endre et aktivt møte. Bekreft resultatet hos leverandøren før du anser tilkoblingen som klar.",
        "Ikke stol på at den kombinerte visningen automatisk oppretter anonyme opptatt-blokker i en annen konto. Hvis du trenger at kolleger skal se deg som utilgjengelig uten å se personlige detaljer, bruker du en uttrykkelig godkjent løsning for deling av tilgjengelighet og bekrefter den fra deres side. En tydelig personlig oversikt og delt tilgjengelighet er to forskjellige oppgaver."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "List opp nøyaktig konto og kalender for én hendelse fra hver leverandør.",
    "Aktiver de aktuelle iCloud-kalenderne på enheten og kontroller kalendertilgangen.",
    "Bruk riktig Google- eller Microsoft-innlogging og velg de aktuelle kalenderne.",
    "Sammenlign én nylig hendelse med leverandørvisningen før du endrer noe.",
    "Skjul en mistenkt duplikatkilde midlertidig; behold de underliggende hendelsene intakte.",
    "Kontroller målkalenderen for hver nye hendelse, og bekreft separat eventuell deling av opptatt-tid du trenger."
  ],
  "faq": [
    {
      "q": "Vil jobbkollegene mine se de private hendelsene mine fordi jeg viser begge kalenderne?",
      "a": "Å vise kalendere samlet er ikke en delingsinstruks eller en automatisk bro for opptatt-tid. Kontroller de faktiske delingsinnstillingene for hver kalender. Leverandørtilkoblinger kan opprette kalenderkopier på enheten, så en kombinert visning er heller ingen garanti for at hendelsesdata bare finnes hos den opprinnelige leverandøren."
    },
    {
      "q": "Hvorfor kan jeg se en hendelse, men ikke redigere den?",
      "a": "Kalenderen kan være skrivebeskyttet, hendelsen kan tilhøre en annen arrangør, eller leverandøren kan avvise oppdateringen. Kontroller eierskap og tillatelser i leverandørens kalender. Å kjøpe et høyere appabonnement endrer ikke disse tillatelsene."
    },
    {
      "q": "Bør jeg koble til samme Google-konto via alle tilgjengelige metoder?",
      "a": "Sjekk først hvordan den allerede vises på telefonen. Flere metoder kan gjøre det vanskeligere å identifisere kopier av kalendere. Velg metoden du vil bruke, bekreft hendelsene der, og skjul en ekstra visning mens du undersøker, i stedet for å slette data eller koble fra kontoer som første steg."
    }
  ],
  "sourcesHeading": "Kilder og oppsettsreferanser",
  "sources": [
    {
      "label": "Apple: konfigurer iCloud Calendar på enhetene dine",
      "url": "https://support.apple.com/guide/icloud/set-up-calendar-mme4d73a8727/icloud"
    },
    {
      "label": "Google: kalenderdeling og tillatelser",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: Outlook calendar API og støttede postkassedata",
      "url": "https://learn.microsoft.com/en-us/graph/outlook-calendar-concept-overview"
    }
  ],
  "seeAlso": [
    "exchange-calendars-on-an-iphone",
    "what-calendar-sync-actually-does",
    "when-two-calendars-disagree",
    "caldav-calendar-on-iphone",
    "calendar-export-ics-pdf-and-backup",
    "onecal-alternative-iphone-calendar-view-or-sync"
  ],
  "comparison": {
    "heading": "Samlet visning, abonnement eller kopiert opptattid?",
    "columns": [
      "Det du trenger",
      "Dette bør du sjekke",
      "Dette bør du ikke anta"
    ],
    "rows": [
      {
        "cells": [
          "Én visning av flere kontoer",
          "Den tilkoblede kontoen, den valgte kalenderen og nødvendig abonnement.",
          "At en delt skjerm slår sammen eierskap eller tillatelser."
        ]
      },
      {
        "cells": [
          "At en redigering av en hendelse når fram til leverandøren",
          "Den opprinnelige hendelsen, skrivetillatelse og det lagrede resultatet hos kilden.",
          "At en synlig lokal redigering beviser vellykket synkronisering med leverandøren."
        ]
      },
      {
        "cells": [
          "Opptattid i en annen konto",
          "En tjeneste med tydelige synkroniseringsregler fra kilde til mål.",
          "At en samlet visning oppretter tilgjengelighetsblokker for kolleger."
        ]
      },
      {
        "cells": [
          "Et abonnert kalenderfeed",
          "Utgiveren, oppdateringsatferd og skrivebeskyttet status.",
          "At et ICS-abonnement er en redigerbar toveis tilkobling."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-left",
    "hook"
  ],
  "galleryDevice": "iPad",
  "galleryCaption": "Ekte kalendervisninger på iPad viser hvordan man kan gjennomgå en plan. Et skjermbilde viser ikke retningen på leverandørsynkronisering eller kontotillatelser.",
  "actionHeading": "Se kalenderne dine samlet på iPhone og iPad",
  "actionText": "Google Calendar-synkronisering er inkludert i Base. Advanced fjerner annonser, og Premium legger til støtte for Microsoft Calendar og Teams. Bekreft kontoens tillatelser uavhengig av abonnementet du kjøper.",
  "articleLinks": [
    {
      "slug": "onecal-alternative-iphone-calendar-view-or-sync",
      "label": "Sammenlign en samlet visning med OneCal sine synkroniseringsregler"
    },
    {
      "slug": "fantastical-readdle-calendar366-iphone-comparison",
      "label": "Sammenlign kalenderarbeidsflyter på iPhone"
    },
    {
      "slug": "weather-inside-your-calendar",
      "label": "Planlegg med vær og hendelser samlet"
    }
  ]
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
