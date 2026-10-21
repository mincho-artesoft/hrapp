import { LocalisedArticle } from '../types';

/**
 * The four articles this language carries.
 *
 * Chosen one per intent -- weather, one view, sharing, price -- so the language
 * answers a whole question rather than a quarter of four. The numbers are not
 * here: they live once in article-facts.ts and join the prose by id, so a
 * translation can rewrite every sentence without touching a figure.
 */
export const ARTICLES_DA: Readonly<Record<string, LocalisedArticle>> = {
  "month-view-on-a-bigger-screen": {
  "updated": "2026-10-22",
  "title": "Månedskalender på iPad og iPhone: se datoerne, kontrollér detaljerne",
  "short": "Brug månedsvisning uden at overse detaljer",
  "description": "Sammenlign datoer på iPad eller iPhone. Kontrollér skjulte aftaler, valgte kalendere og tider, før du flytter delte eller gentagne begivenheder.",
  "lede": "Månedsvisningen viser, hvilke datoer aftaler falder på. Den er mindre egnet til at bevise, at en bestemt time er fri. Vælg en dato i oversigten, og undersøg dagen og begivenheden, før du aftaler noget. Guiden er udgivet af Arte Soft, udvikleren af Cloud Calendars.",
  "commonBelief": "Et større månedsgitter viser alle detaljer, og en tilsyneladende tom dato beviser, at alle er ledige.",
  "sections": [
    {
      "heading": "Vælg mellem datoer og præcise klokkeslæt",
      "body": [
        "Brug måneden til at sammenligne projektfrist, rejse og familieaftale over flere uger. Når spørgsmålet er, om to aftaler overlapper kl. 14.30, så skift til dag eller uge og kontrollér præcis start og slut. En månedscelle har ikke samme tidsskala som et timegitter.",
        "En workshoparrangør kan først undgå en rejseuge. Derefter kontrolleres den foreslåede dag: aftaler, forberedelse, transport og nødvendig afslutning. En tomt udseende celle er en kandidat til undersøgelse, ikke en bekræftet reservation eller andres tilgængelighed."
      ]
    },
    {
      "heading": "Læs ekstratælleren frem for kun de synlige titler",
      "body": [
        "Cloud Calendars’ aktuelle månedscelle viser et begrænset antal begivenhedsmærker og en ekstra tæller, når flere hører til dagen. Titler holdes på én linje og kan afkortes. Åbn dagen eller begivenheden, når hele titlen eller de øvrige aftaler er vigtige.",
        "En større iPad-skærm kan gøre oversigten lettere at læse, men fjerner ikke nødvendigvis alle visningsgrænser. Et smalt appvindue eller større tekst ændrer pladsen. Kontrollér det samme på iPhone: undersøg dagen bag visningen, før du regner de synlige mærker for hele kalenderen."
      ]
    },
    {
      "heading": "Kontrollér måned, valgte kalendere og nabodatoer",
      "body": [
        "Læs måned og år, før du vælger dato. Gitteret kan medtage datoer fra en nabomåned for at udfylde rækkerne. Brug månedsnavigationen i Cloud Calendars, og kontrollér den valgte dato frem for kun feltets placering.",
        "Se, hvilke kalendere der er valgt. Skjulte arbejdsaftaler gør måske familieplanen lettere at læse, men fjerner også disse aftaler fra oversigten. Skjul ved dubletundersøgelse én kilde midlertidigt og sammenlign; slet ikke en aftale blot for at gøre måneden mindre fyldt."
      ]
    },
    {
      "heading": "Åbn en begivenhed før ændring af en fælles aftale",
      "body": [
        "Bekræft titel, ejer eller kalender, lokal tid og varighed i detaljerne. Farve hjælper med overblik, men erstatter ikke viden om konto eller redigeringsret. En synlig invitation er anderledes end en aftale, du selv arrangerer.",
        "Cloud Calendars kan flytte begivenheder til en anden dato med træk og slip i måneden. Fastlæg mål og gentagelsesomfang før en rigtig ændring. Åbn efter en tilladt ændring begivenheden igen; en lokal bevægelse beviser ikke, at udbyderen eller alle deltagere har accepteret den nye aftale."
      ]
    },
    {
      "heading": "Kontrollér gentagelser og tidszoner særskilt",
      "body": [
        "Hvis kun denne uges undervisning flyttes, så undgå utilsigtet ændring af fremtidens mønster. Læs valget af gentagelsesomfang, og undersøg både den ændrede og en senere forekomst. Måneden gør datoer lette at sammenligne, men redigeringsomfanget afgør ændringens betydning.",
        "Ved rejser eller møder på tværs af tidszoner skal du udtrykkeligt kontrollere lokal dato og tid. Flytning til en anden dag omregner ikke automatisk det ønskede mødetidspunkt. Kontrollér relevante sommertidsskift, og bekræft den aftalte tid med de involverede."
      ]
    },
    {
      "heading": "Brug den større visning uden at blande produkter sammen",
      "body": [
        "Apple Kalender har egne månedsvalg, mens Teamup beskriver forskellige visninger i browser og mobilapp. De tilhører hvert sit produkt. Led ikke efter Teamups browserkonfiguration eller Apples visningsmenu i Cloud Calendars, blot fordi visningerne har samme navn.",
        "En måned med aftaler er heller ikke en måned med vejrudsigter. Kontrollér sted, dato og tilgængelige prognosetimer særskilt til udendørsplaner. Gem den endelige aftale i den rette kalender, og bekræft ændringer direkte med deltagerne."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Vælg mulige datoer i måneden, og kontrollér præcise timer i dag eller uge.",
    "Åbn dage med ekstratæller eller afkortede titler.",
    "Kontrollér måned, år og kalendervalg, før du antager ledighed.",
    "Bekræft kalender, tid, varighed og redigeringsret.",
    "Læs gentagelsesomfanget, og kontrollér den gemte forekomst efter flytning.",
    "Kontrollér vejrtilgængelighed særskilt, og bekræft ændringer med deltagerne."
  ],
  "faq": [
    {
      "q": "Viser iPads månedsvisning alle aftaler fuldt ud?",
      "a": "Antag det ikke. Cloud Calendars begrænser mærker i en månedscelle og viser en ekstratæller. Åbn dag og begivenhed for hele planen."
    },
    {
      "q": "Betyder en tom dag, at jeg er fri?",
      "a": "Kontrollér først kalendervalg, dato og relevante kontodata. Oversigten viser kun de oplysninger, der aktuelt er tilgængelige og vist."
    },
    {
      "q": "Ændrer flytning af en gentagelse kun denne dato?",
      "a": "Læs valget af redigeringsomfang. Kontrollér efter lagring den ændrede og en senere forekomst, og bekræft derefter den ønskede aftale."
    }
  ],
  "sourcesHeading": "Sammenlign de officielle visningsbeskrivelser",
  "sources": [
    {
      "label": "Apple: måneds-, flerdages- og listevisninger",
      "url": "https://support.apple.com/en-ca/guide/iphone/iphfd1054569/ios"
    },
    {
      "label": "Teamup: visninger og konfiguration i browser og app",
      "url": "https://calendar.teamup.com/kb/how-to-use-calendar-views/"
    }
  ],
  "seeAlso": []
},

  'weather-inside-your-calendar': {
  "updated": "2026-10-22",
  "title": "Kalender med vejr på iPhone og iPad: vurder planen i sammenhæng",
  "short": "Brug kalender og vejr sammen",
  "description": "Brug kalender og vejr sammen på iPhone og iPad. Kontrollér sted, tilgængelige prognosetimer og begivenhedsdetaljer, før du gemmer en plan.",
  "lede": "En kalender fortæller, hvornår en aftale er planlagt. Vejret hjælper med et andet spørgsmål: Hvilke forhold forventes på det sted og i det tidsrum, du behøver? Brug begge, men hold styr på deres steder og datoer. Guiden er udgivet af Arte Soft, udvikleren af Cloud Calendars.",
  "commonBelief": "Vejr ved kalenderen beskriver automatisk hver aftales adresse, hver time og alle fremtidige datoer.",
  "sections": [
    {
      "heading": "Vælg et konkret planlægningsspørgsmål",
      "body": [
        "Start med en bestemt aftale, eksempelvis et parkbesøg om eftermiddagen. Find ud af, hvad der kan ændres: tidspunkt, sted, forberedelse eller valget af et alternativ. Du behøver ikke omlægge hele kalenderen, blot fordi dagens symbol viser regn.",
        "Skriv aktivitetens faktiske start og slut ned, inklusive klargøring hvis relevant. Kalenderoversigten hjælper med mulige datoer, mens vejrtjekket vedrører et bestemt sted og tidsrum. Hold de to opgaver adskilt, når du sammenligner muligheder."
      ]
    },
    {
      "heading": "Bekræft vejrstedet, før du læser værdierne",
      "body": [
        "Cloud Calendars tilbyder vejr for det aktuelle eller valgte sted. Kontrollér den viste placering i stedet for at antage, at en begivenhedsadresse ubemærket ændrer prognosen. En aftale i en anden by skal sammenlignes med vejret i den by.",
        "Du kan eksempelvis planlægge ankomsten til et museum, mens telefonen stadig er hjemme. Læs prognosens sted og aftalens lokale tid, før du sammenligner dem. Værdier tæt på hinanden på skærmen beviser ikke, at kalender og vejr bruger samme sted."
      ]
    },
    {
      "heading": "Kontrollér time- og dagsdækning særskilt",
      "body": [
        "Brug en dagsværdi til orientering og de tilgængelige timeværdier til spørgsmål om en del af dagen. En aftale fra to til fem kræver mere end et blik på ét symbol. Kontrollér, om de relevante timer faktisk findes.",
        "I den aktuelle appkode tager dagslisten op til ti dage returneret af WeatherKit. Det er adskilt fra kalendernavigation og de timer, der aktuelt leveres. En fremtidig aftale udvider ikke vejrdækningen. Hvis tidsrummet mangler, så planlæg et senere vejrtjek."
      ]
    },
    {
      "heading": "Forstå, hvad vejrværdien betyder",
      "body": [
        "Apple beskriver WeatherKit-data som temperatur, nedbør, vind og UV, hvor nogle produkter kun findes i udvalgte regioner. Læs værdierne for dit valgte sted frem for at forvente alle vejrprodukter overalt.",
        "Met Offices vejledning viser, hvorfor prognoseperiode og variabeldefinitioner betyder noget: Nogle værdier gælder et tidspunkt, andre en periode. Brug den relevante udbyders betegnelser. Sandsynlighed, mængde og varighed af regn er forskellige spørgsmål, og ét tal afgør ikke alle udendørsaktiviteter."
      ]
    },
    {
      "heading": "Gennemgå en kladde oprettet fra en vejrtime",
      "body": [
        "Hvor appen tilbyder begivenhedsoprettelse fra en time, åbner den en kladde. Den aktuelle kode bruger vejrstedets tidszone, foreslår en times varighed og vælger standardkalenderen for nye begivenheder. Kontrollér hver værdi før lagring.",
        "Bekræft titel, destinationskalender, start, slut og ønsket sted. Et prognosevalg giver ikke redigeringsret til en delt kalender, underretter ikke et sted og reserverer ikke et lokale. Kontrollér den gemte begivenhed, og indhent nødvendige aftaler."
      ]
    },
    {
      "heading": "Hold hjemmesidens demonstration adskilt",
      "body": [
        "Hjemmesidens interaktive vejrdemo bruger Open-Meteo. Appen bruger Apple WeatherKit. Webdemoen er nyttig til at udforske præsentationen, men sted, data og tilgængelige datoer kan afvige fra appen.",
        "Åbn appen til en rigtig beslutning, og sammenlign aftalen med den tilgængelige prognose. Ved ændring af en fælles plan skal du bekræfte arrangør, gentagelsesomfang og deltagere. Hav et aftalt alternativ, når aktiviteten afhænger af forholdene."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Find aftalen og den beslutning, vejret kan ændre.",
    "Bekræft vejrsted samt aftalens lokale dato og tid.",
    "Undersøg tilgængelige timer særskilt fra dagsoversigten.",
    "Læs sandsynlighed, mængde og andre værdier efter deres betegnelser.",
    "Kontrollér kladdens detaljer og destinationskalender før lagring.",
    "Tjek igen ved beslutningen, og bekræft fælles ændringer direkte."
  ],
  "faq": [
    {
      "q": "Følger vejret ved kalenderen hver begivenhedsadresse?",
      "a": "Antag det ikke. Bekræft det viste vejrsted, og sammenlign med mødestedet; nærhed på skærmen beviser ikke et match."
    },
    {
      "q": "Bruger appen hjemmesidens vejrudbyder?",
      "a": "Nej. Appen bruger Apple WeatherKit; hjemmesidens demonstration bruger Open-Meteo særskilt."
    },
    {
      "q": "Gemmer valg af en prognosetime automatisk en aftale?",
      "a": "Det starter en kladde, hvor handlingen tilbydes. Kontrollér dato, tidszone, varighed, kalender og sted, og gem derefter den ønskede begivenhed."
    }
  ],
  "seeAlso": [],
  "sourcesHeading": "Officielle kilder og yderligere læsning",
  "sources": [
    {
      "label": "Apple: WeatherKit-prognoser og regional tilgængelighed",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: prognosested, perioder og vejrværdier",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google og Outlook i én visning',
    short: 'Tre konti, én visning',
    description:
      'Næsten alles liv er delt mellem en privat Apple-kalender, en Google-konto og et Exchange fra arbejdet. Hvad der ændrer sig, når de havner i samme gitter.',
    lede: 'Problemet er næsten aldrig, at en af kalenderne er dårlig. Det er, at du har tre og kun én uge.',
    commonBelief: 'At holde arbejde og privatliv i hver sin app er en grænse og ikke en mangel.',
    sections: [
      {
        heading: 'Dobbeltbooking er strukturelt',
        body: [
          'Hvis dine aftaler bor tre steder, kan intet sted fortælle dig, om du er ledig. Sammenfletningstrinnet er dig, og du kører det efter hukommelsen, som regel mens nogen venter på svar.',
          'Derfor er den klassiske fejl ikke at glemme en begivenhed; det er at sige ja til noget, der støder sammen med en begivenhed, du ikke kunne se.',
        ],
      },
      {
        heading: 'Hvad ét gitter giver',
        body: [
          'Alle konti i samme uge, farvet efter oprindelse, redigerbare på stedet. Du holder op med at spekulere på, hvilken app der har svaret, fordi spørgsmålet holder op med at være i flertal.',
          'iCloud og Google synkroniserer i gratisversionen. Microsoft-konti — Outlook og Exchange — hører til den betalte, fordi den forbindelse har en løbende omkostning, de andre ikke har.',
        ],
      },
    ],
    claims: {
      accounts: 'Kontotyper, der kan være i én visning',
      premiumMonthly: 'Månedspris for at lægge Microsoft til, i dollar',
    },
    practical: [
      'Læg privatkontoen ind først og derefter den, der forårsager sammenstødene.',
      'Farv efter konto og ikke efter kategori: det er oprindelsen, du skal se med det samme.',
      'Bliv ved med at skrive i den kalender, andre allerede læser.',
    ],
    seeAlso: ['weather-inside-your-calendar', 'what-a-subscription-actually-buys'],
  },

  'sharing-one-event-not-your-calendar': {
  "updated": "2026-10-21",
  "title": "Del én kalenderbegivenhed: vælg det rette link og den rette adgang",
  "short": "Deling af én begivenhed",
  "description": "Del én begivenhed uden hele kalenderen. Forstå Reader, Writer og Owner, forhåndsvisninger, opdateringer og grænserne for at fjerne adgang.",
  "lede": "At dele middagsdetaljer, lade en medarrangør redigere og indsamle svar om deltagelse er forskellige opgaver. Vælg først opgaven og derefter delingsvejen. Guiden er skrevet af Arte Soft, udvikleren af Cloud Calendars.",
  "commonBelief": "Alle begivenhedslinks er skrivebeskyttede kalenderabonnementer, der straks opdateres og registrerer et svar.",
  "sections": [
    {
      "heading": "Begynd med én begivenhed og gennemgå detaljerne",
      "body": [
        "Deling af én begivenhed omfatter begivenheden, ikke afsenderens hele kalender. Kontrollér titel, tidszone, sted, noter og mødelink før afsendelse. Oplysninger til én gæst hører måske ikke hjemme i et link, du vil sprede bredt.",
        "En middagsaftale kræver for eksempel ikke deling af kalenderen med dine lægebesøg. Middagens eget sted og links følger dog med begivenheden. Kontrollér selve begivenheden frem for at stole på den omgivende kalenders privatliv."
      ]
    },
    {
      "heading": "Vælg forhåndsvisning, e-mail eller QR",
      "body": [
        "Cloud Calendars har forskellige delingsveje. App Clip viser en forhåndsvisning; den fulde app kræves for at tilføje begivenheden derfra. E-mail- og QR-invitationer bruger en webside, der tilbyder at åbne Cloud Calendars. Disse links er ikke indbyrdes udskiftelige abonnementsadresser.",
        "Afsenderen logger ind til appens synkroniserede deling. Links og QR-koder kan videresendes, så send dem kun steder, hvor indholdet passer. En QR-kode formidler et link; den beviser ikke, hvem der åbnede det."
      ]
    },
    {
      "heading": "Giv kun den nødvendige adgang",
      "body": [
        "E-mail-invitationer lader dig vælge Reader, Writer eller Owner. Reader kan se og synkronisere; Writer kan redigere; Owner kan også dele og administrere adgang. Valgene har konsekvenser og er ikke tre navne for samme visning. Brug Reader til dem, der kun behøver programmet.",
        "Vælg Writer til en medarrangør, som skal ændre begivenheden. Vælg kun Owner, hvis vedkommende også skal styre andres adgang. Udvidet adgang kræver den rette indloggede identitet. En anonym modtager er ikke en identificeret medejer."
      ]
    },
    {
      "heading": "Forstå, hvordan modtageren tilføjer begivenheden",
      "body": [
        "I den fulde app kræves kalendertilladelse og en skrivbar destinationskalender. Modtageren bør kontrollere destinationen før lagring. Den modtagne kopi kan derefter knyttes til den delte begivenhed for senere opdateringer.",
        "Det er forskelligt fra at importere en almindelig ICS-fil til en anden kalender. Import giver en kopi; et abonnement kontrollerer jævnligt et feed. Sender du et ICS-feed frem for en appinvitation, så forklar det og bekræft, at modtagerens kalender understøtter det."
      ]
    },
    {
      "heading": "Kontrollér ændringer, før du regner med dem",
      "body": [
        "Synkroniseret deling kan overføre senere rettelser eller aflysning, men modtagerens enhed skal have mulighed for at modtage dem. Et tip om feedopdatering er ikke en leveringsfrist. En offlineenhed, et uopdateret abonnement eller en selvstændig importeret kopi kan stadig vise gamle oplysninger.",
        "Flyttes middagen kort før start, så opdatér begivenheden og kontakt gæsterne direkte. Bed dem bekræfte det nye tidspunkt. At sende en opdatering og modtage et deltagelsessvar er separate trin."
      ]
    },
    {
      "heading": "Administrer adgang uden at love sletning af kopier",
      "body": [
        "Gennemgå modtagernes adgang og fjern unødvendige rettigheder. At fjerne en modtager og tilbagekalde et feedlink er forskellige handlinger; ingen af dem må beskrives som fjernsletning af skærmbilleder, beskeder eller alle kalenderkopier.",
        "Er et link kommet uden for målgruppen, så identificér linket eller adgangstildelingen. Kontrollér den berørte vej efter ændringen. Undlad fremover private detaljer i bredt delte links frem for at regne med senere tilbagekaldelse."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Gennemgå detaljerne og vælg behovet: visning, redigering eller deltagelsessvar.",
    "Vælg delingsvej og log ind, når det kræves.",
    "Brug Reader til læsere; giv kun Writer eller Owner til det tilsvarende ansvar.",
    "Bed modtageren kontrollere tid og destinationskalender ved tilføjelsen.",
    "Ved hastende ændringer: opdatér begivenheden og send en direkte besked.",
    "Gennemgå modtagerrettigheder og linkadgang separat, når delingen slutter."
  ],
  "faq": [
    {
      "q": "Afslører deling af én begivenhed hele min kalender?",
      "a": "Den synkroniserede enkeltbegivenhedsdeling omfatter kun begivenheden. Dens egne detaljer vises stadig gennem den valgte vej. Gennemgå dem, og send ikke en hel kalenderinvitation, hvis du kun mener én begivenhed."
    },
    {
      "q": "Kan modtageren ændre begivenheden?",
      "a": "Ja, med passende Writer- eller Owner-adgang via den understøttede indloggede vej. Reader er til visning og synkronisering. Et almindeligt ICS-abonnement er ikke samme redigeringsmekanisme."
    },
    {
      "q": "Fortryder fjernelse alt, personen allerede har modtaget?",
      "a": "Det kan ikke garanteres. Ændringer påvirker den understøttede delingsrelation, men gemte kopier, skærmbilleder og beskeder kan bestå. En delt feedadresse skal også vurderes separat."
    }
  ],
  "sourcesHeading": "Referencer om modtagermuligheder",
  "sources": [
    {
      "label": "Apple: overblik over App Clips",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google: import af begivenheder og begrænsninger",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft: import eller abonnement på en kalender",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": []
},

  'what-a-subscription-actually-buys': {
  "updated": "2026-10-21",
  "title": "Hvad et abonnement faktisk giver",
  "short": "Hvad et abonnement giver",
  "description": "Hvad et abonnement giver: Base, Advanced, Premium.",
  "lede": "Denne vejledning udgives af Arte Soft, udvikleren af Cloud Calendars.",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "Base omfatter Google Calendar-synkronisering, Google Meet, kalendervisninger, vejr og widgets. Gratisplanen kan vise reklamer."
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Advanced indeholder Base og fjerner reklamer. Premium indeholder Advanced og tilføjer Microsoft Calendar og Microsoft Teams.",
        "Et abonnement giver ikke redigeringsret til andres kalendere og omgår ikke begrænsninger på en arbejdskonto."
      ]
    },
    {
      "heading": "Oplysninger om køb og opsigelse",
      "body": [
        "Kontrollér den lokale pris, betalingsperioden og vilkårene for fornyelse før køb.",
        "For et abonnement faktureret af Apple skal du åbne Indstillinger → dit navn → Abonnementer. Kontrollér status og udløbsdato. At stoppe fornyelsen er adskilt fra at slette appen eller kalenderdata; antag ikke, at betalte funktioner fortsat virker efter udløb."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Kontrollér den lokale pris, betalingsperioden og vilkårene for fornyelse før køb.",
    "Et abonnement giver ikke redigeringsret til andres kalendere og omgår ikke begrænsninger på en arbejdskonto."
  ],
  "faq": [
    {
      "q": "Hvordan stopper jeg fornyelsen?",
      "a": "For et abonnement faktureret af Apple skal du åbne Indstillinger → dit navn → Abonnementer. Kontrollér status og udløbsdato. At stoppe fornyelsen er adskilt fra at slette appen eller kalenderdata; antag ikke, at betalte funktioner fortsat virker efter udløb."
    }
  ],
  "sourcesHeading": "Oplysninger om køb og opsigelse",
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
