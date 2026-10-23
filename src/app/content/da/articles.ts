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
  "updated": "2026-10-23",
  "title": "Kalender med vejr på iPhone og iPad: planlæg dagen i ét overblik",
  "short": "Brug kalender og vejr sammen",
  "description": "Sammenlign din kalender med vejret for det valgte sted på iPhone og iPad.",
  "lede": "Cloud Calendars samler din kalender og vejret i den samme app til iPhone eller iPad. Brug kalenderen til at vælge en dato og vejrvisningen til at se det valgte sted og de tilgængelige prognosetimer. Hvis du planlægger noget udendørs, så tjek det tidsrum, der er relevant, i stedet for kun at stole på et dagsikon. Denne guide er udgivet af Arte Soft, appens udvikler.",
  "commonBelief": "Vejr, der vises ved siden af en kalender, beskriver automatisk adressen for alle aftaler, hver time og alle fremtidige datoer.",
  "sections": [
    {
      "heading": "Vælg et reelt planlægningsspørgsmål",
      "body": [
        "Tag udgangspunkt i en konkret aftale, f.eks. et eftermiddagsbesøg i en park. Vurder, hvad der kan ændre sig: tidspunkt, sted, forberedelse eller beslutningen om at vælge et alternativ. Du behøver ikke omlægge hele kalenderen, bare fordi dagens symbol viser regn.",
        "Notér aktivitetens faktiske start og slut, inklusive forberedelse, hvis det er relevant. Et kalendoverblik hjælper med at finde mulige datoer, mens vejrtjekket handler om et bestemt sted og tidsrum. Hold de to opgaver adskilt, når du sammenligner muligheder."
      ]
    },
    {
      "heading": "Bekræft stedet for vejret, før du læser værdierne",
      "body": [
        "Cloud Calendars tilbyder vejr for den aktuelle eller valgte placering. Tjek den viste placering i stedet for at antage, at en begivenheds adresse automatisk ændrer prognosen. En aftale i en anden by kræver sammenligning med vejret i den by.",
        "En besøgende kan f.eks. planlægge ankomst til et museum, mens telefonen stadig er hjemme. Læs prognosens placering og aftalens lokale tidspunkt, før du sammenligner dem. Værdier, der ser nærliggende ud, er ikke bevis på, at kalenderen og vejret bruger samme sted."
      ]
    },
    {
      "heading": "Tjek time- og dagsdækning hver for sig",
      "body": [
        "Brug en dagspost til overblik og de tilgængelige timeposter, når spørgsmålet handler om en del af dagen. En booking fra klokken to til fem kræver mere end et hurtigt blik på ét symbol. Tjek, om de relevante timer faktisk er med.",
        "I den nuværende appkilde viser dagslisten op til ti returnerede WeatherKit-dage. Det er adskilt fra kalendernavigation og fra de timer, der aktuelt leveres. En fremtidig aftale udvider ikke vejrdataenes dækning. Hvis perioden mangler, så planlæg et senere vejrtjek."
      ]
    },
    {
      "heading": "Forstå, hvad vejrværdien betyder",
      "body": [
        "Apple dokumenterer WeatherKit-data som temperatur, nedbør, vind og UV, og nogle produkter er kun tilgængelige i udvalgte regioner. Læs de værdier, der er tilgængelige for dit valgte sted, i stedet for at forvente alle vejrprodukter overalt.",
        "Met Office’s vejledning viser, hvorfor prognoseperiode og definitioner af variabler er vigtige: Nogle værdier gælder et øjeblik, andre en periode. Brug mærkningen fra den relevante udbyder. Sandsynlighed for regn, mængde og varighed er forskellige spørgsmål, og ét tal afgør ikke enhver udendørs aktivitet."
      ]
    },
    {
      "heading": "Gennemgå et udkast oprettet fra en vejrtime",
      "body": [
        "Hvor appen tilbyder at oprette en begivenhed ud fra en time, åbner den et udkast. Den nuværende kilde bruger vejrstedets tidszone, foreslår en varighed på én time og vælger standardkalenderen for nye begivenheder. Gennemgå hver værdi, før du gemmer.",
        "Bekræft titel, målkalendar, start, slut og den tiltænkte placering. Et valgt prognosetidspunkt giver ikke tilladelse til at redigere en delt kalender, give besked til et sted eller reservere et lokale. Tjek den gemte begivenhed, og indhent de aftaler, planen kræver."
      ]
    },
    {
      "heading": "Hold websitedemonstrationen adskilt",
      "body": [
        "Websitets interaktive vejrdemonstration bruger Open-Meteo. Appen bruger Apple WeatherKit. En webdemonstration er nyttig til at udforske visningen, men dens sted, data og tilgængelige datoer kan afvige fra appens.",
        "Ved en reel beslutning skal du åbne appen og sammenligne den planlagte aftale med den tilgængelige prognose. Hvis du ændrer en fælles plan, så bekræft arrangør, gentagelsesomfang og deltagere. Hav et aftalt alternativ, når aktiviteten afhænger af forholdene."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identificér aftalen og den beslutning, vejret kan ændre.",
    "Bekræft vejrets placering samt aftalens lokale dato og klokkeslæt.",
    "Se særskilt på den tilgængelige timedækning og dagsoversigten.",
    "Læs sandsynlighed, mængde og andre relevante værdier ud fra deres mærkning.",
    "Gennemgå alle detaljer i begivenhedsudkastet og målkalendar, før du gemmer.",
    "Tjek igen på beslutningstidspunktet, og bekræft fælles ændringer direkte."
  ],
  "faq": [
    {
      "q": "Følger vejret ved siden af min kalender adressen for hver begivenhed?",
      "a": "Det bør du ikke gå ud fra. Bekræft den viste vejrlokation og sammenlign den med stedet; nærhed på skærmen beviser ikke, at de passer sammen."
    },
    {
      "q": "Bruger appen websitets vejrudbyder?",
      "a": "Nej. Appen bruger Apple WeatherKit; websitedemonstrationen bruger separat Open-Meteo."
    },
    {
      "q": "Gemmer appen automatisk en aftale, når jeg vælger en prognosetime?",
      "a": "Den starter et udkast, hvor handlingen tilbydes. Tjek dato, tidszone, varighed, kalender og placering, og gem derefter den ønskede begivenhed."
    }
  ],
  "seeAlso": [
    "weather-calendar-history-versus-forecast-iphone",
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather",
    "weather-where-the-event-is",
    "planning-outdoors-without-being-rained-on"
  ],
  "sourcesHeading": "Officielle kilder og videre læsning",
  "sources": [
    {
      "label": "Apple: prognoseoplysninger i WeatherKit og regional tilgængelighed",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: prognosested, perioder og vejrværdier",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ],
  "comparison": {
    "heading": "Hvilken vejrvisning besvarer dit spørgsmål?",
    "columns": [
      "Dit spørgsmål",
      "Hvad du skal tjekke",
      "Hvad det ikke fastslår"
    ],
    "rows": [
      {
        "cells": [
          "Hvad kommer der i dag?",
          "Kalenderens dags- eller ugevisning ved siden af vejret for det valgte sted.",
          "At adressen for hver begivenhed automatisk ændrer vejrets placering."
        ]
      },
      {
        "cells": [
          "Kan regn påvirke min aftale i eftermiddag?",
          "Timedata for stedet og hele aftalens tidsrum.",
          "At et dagssymbol beskriver hver eneste time."
        ]
      },
      {
        "cells": [
          "Kan jeg planlægge næste måned ud fra vejret?",
          "Din kalender nu og derefter et nyt prognosetjek tættere på datoen.",
          "At navigation i kalenderen udvider prognosens dækning."
        ]
      },
      {
        "cells": [
          "Kan jeg få et hurtigt overblik derhjemme?",
          "Den passende widget til hjemmeskærmen.",
          "At alle widgetlayouts indeholder aftaler eller en fuld prognose."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-right",
    "hook"
  ],
  "galleryCaption": "Rigtige skærmbilleder fra Cloud Calendars: vejrvisningen og en dag med aftaler. Tjek det valgte sted og datoen i appen.",
  "actionHeading": "Planlæg med din kalender og prognosen samlet",
  "actionText": "Cloud Calendars er til iPhone og iPad. Kom i gang med visninger, vejr og Google Calendar-synkronisering, som er inkluderet i Base; Advanced fjerner reklamer, mens Premium tilføjer understøttelse af Microsoft Calendar og Teams.",
  "articleLinks": [
    {
      "slug": "forecast-beside-every-event",
      "label": "Tjek vejret for timerne i en aftale"
    },
    {
      "slug": "the-widget-that-shows-what-is-next",
      "label": "Vælg en kalender- og vejrwidget"
    },
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "Saml kalenderkonti i ét overblik"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
  "updated": "2026-10-23",
  "title": "Se Google-, iCloud- og Outlook-kalendere samlet på iPhone og iPad",
  "short": "Tre udbydere, én visning",
  "description": "Kombinér kalendervisninger, og forstå kontotilladelser, kopier og plankrav.",
  "lede": "For at se arbejds- og personlige events samlet skal du forbinde de relevante konti, vælge deres kalendere og kontrollere de samme events i én visning. Cloud Calendars understøtter planlægning på iPhone og iPad med iCloud og Google Calendar; understøttelse af Microsoft Calendar findes i Premium. At se events samlet er noget andet end at kopiere optaget tid mellem konti hos forskellige udbydere. Arte Soft, udvikleren, har udgivet denne vejledning.",
  "commonBelief": "Når man lægger flere kalendere i én app, holdes deres tilgængelighed, deling og eventkopier automatisk synkroniseret.",
  "sections": [
    {
      "heading": "Identificér kontoen og kalenderen bag hvert event",
      "body": [
        "Begynd med ét almindeligt event fra hver udbyder. Notér den e-mailadresse, der er logget ind med, kalendernavnet, og om du selv ejer eventet eller har modtaget en invitation. To kalendere med navnet “Calendar” kan tilhøre helt forskellige konti. En farve hjælper dig med at danne overblik over en uge; det er kontoen og kalenderen, der afgør, hvor en ændring skal foretages.",
        "For eksempel kan en tandlægetid i din personlige iCloud-kalender og et projektmøde i Microsoft vises samlet for dig. Det betyder ikke i sig selv, at tandlægetiden bliver synlig for dine kolleger eller reserverer tiden i deres planlægningsværktøjer.",
        "Vælg det ønskede resultat, før du ændrer en forbindelse. Hvis du vil flytte eventdata til en anden konto, kan du bruge “Vælg et eksportformat for kalender” nedenfor til at finde en understøttet overførselsvej og kontrollere repræsentative events, før du stoler på destinationen. Hvis du vil sammenligne tidspunkter, skal du beholde de eksisterende kalenderes ejere og vise de valgte kilder samlet. Hvis en anden konto skal modtage optaget tid, forklarer “Cloud Calendars og OneCal efter arbejdsgang”, hvordan kopiering af tilgængelighed adskiller sig fra et personligt overblik."
      ]
    },
    {
      "heading": "Forbind via den relevante vej",
      "body": [
        "For iCloud skal du først aktivere iCloud Calendar på iPhone under den ønskede Apple Account. Apples opsætningsvejledning forklarer enhedsindstillingerne. Cloud Calendars har adgang til kalendere, der er tilgængelige gennem iPhones kalendersystem, og skal have kalenderadgang for at kunne læse dem. Det er ikke nok, at en konto er forbundet på en anden enhed.",
        "Cloud Calendars har også handlingerne “Sign in with Google” og “Sign in with Microsoft”. Kontrollér, hvilken konto du vælger ved login, og åbn derefter dens kalendergruppe og vælg de kalendere, du har brug for. Logger du ind hos den rigtige udbyder med den forkerte personlige eller arbejdsidentitet, kan du få en helt gyldig, men uventet kalenderliste."
      ]
    },
    {
      "heading": "Forstå planerne uden at forveksle dem med tilladelser",
      "body": [
        "Base-planen omfatter synkronisering med Google Calendar og kalendervisningerne. Advanced tilføjer fjernelse af annoncer til Base. Premium tilføjer funktioner til Microsoft Calendar og Microsoft Teams. Gennemgå den aktuelle lokale pris og faktureringsperiode, før du køber.",
        "En plan ændrer, hvilke appfunktioner der er tilgængelige; den giver dig ikke ejerskab over en andens kalender. Google skelner mellem tilladelse til at se events og tilladelse til at ændre dem. Arbejdsgiverens politikker og de tilladelser, der er knyttet til en Microsoft-kalender, gælder stadig. Et synligt event eller en tilgængelig editor er ikke bevis på, at udbyderen vil acceptere en opdatering."
      ]
    },
    {
      "heading": "En samlet visning kan indeholde kalenderkopier",
      "body": [
        "Google- og Microsoft-forbindelser bruger kalenderkopier i iPhones kalendersystem til at vise og synkronisere events. Gå ikke ud fra, at en forbundet konto ikke efterlader nogen kopi uden for den oprindelige udbyder. Den destination, der bruges til disse kopier, kan afhænge af de kalenderkilder, der er tilgængelige på enheden.",
        "Hvis den samme konto også når telefonen ad en anden vej, så kontrollér kalendernavne og kilder, før du behandler gentagne events som separate events. Skjul midlertidigt én kalender for at identificere, hvilken visning den leverer. Slet ikke et event eller en kalender blot for at få skærmen til at se ryddelig ud: en tilsluttet kopi kan sende ændringer tilbage til sin udbyder."
      ]
    },
    {
      "heading": "Bliv ved med at vælge destinationen, når du opretter et event",
      "body": [
        "Før du gemmer, skal du kontrollere eventets kalender lige så omhyggeligt som dato og tidspunkt. Ved en familieaftale skal du vælge den kalender, familien faktisk bruger; ved et arbejdsmøde skal du bruge den tilladte arbejdsdestination. At se begge kalendere samlet gør ikke den ene til automatisk destination for alle nye events.",
        "At ændre et events kalender eller trække det mellem kalendere kan være en flytning, ikke bare en ufarlig ekstra visning. Behold invitationer og tilbagevendende møder i deres etablerede kalender, mens du undersøger et visningsproblem. Hvis du har brug for en ændring, skal du først fastslå, hvem der ejer eventet, og hvilken kalender der kan tage imod det."
      ]
    },
    {
      "heading": "Bekræft overblikket, før du stoler på det",
      "body": [
        "Sammenlign et nyligt event i udbyderens egen kalender med det tilsvarende event i Cloud Calendars. Kontrollér dato, tidszone, titel og valgt kalender. For en redigerbar kalender, du selv ejer, er et engangsevent uden gæster en bedre kontrol end at ændre et aktivt møde. Bekræft resultatet hos udbyderen, før du anser forbindelsen for klar.",
        "Stol ikke på, at den samlede visning automatisk opretter anonyme blokke med optaget tid i en anden konto. Hvis du har brug for, at kolleger skal se dig som utilgængelig uden at se personlige detaljer, skal du bruge en udtrykkeligt godkendt løsning til deling af tilgængelighed og kontrollere den fra deres side. Et klart personligt overblik og delt tilgængelighed er to forskellige opgaver."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Angiv den præcise konto og kalender for ét event fra hver udbyder.",
    "Aktivér de ønskede iCloud-kalendere på enheden, og gennemgå kalenderadgangen.",
    "Brug det relevante Google- eller Microsoft-login, og vælg de ønskede kalendere.",
    "Sammenlign ét nyligt event med udbyderens visning, før du ændrer noget.",
    "Skjul en mistænkt duplikatkilde midlertidigt; bevar de underliggende events intakte.",
    "Kontrollér destinationskalenderen for hvert nyt event, og bekræft særskilt enhver deling af optaget tid, du har brug for."
  ],
  "faq": [
    {
      "q": "Vil mine arbejdskolleger kunne se mine personlige events, fordi jeg viser begge kalendere?",
      "a": "At vise kalendere samlet er ikke en delingsinstruktion eller en automatisk bro for optaget tid. Kontrollér de faktiske delingsindstillinger for hver kalender. Udbyderforbindelser kan oprette kalenderkopier på enheden, så en samlet visning er heller ikke en garanti for, at eventdata kun findes hos den oprindelige udbyder."
    },
    {
      "q": "Hvorfor kan jeg se en begivenhed, men ikke redigere den korrekt?",
      "a": "Kalenderen kan være skrivebeskyttet, begivenheden kan tilhøre en anden arrangør, eller udbyderen kan afvise opdateringen. Kontrollér ejerskab og tilladelser i udbyderens kalender. Køb af en højere app-plan ændrer ikke disse tilladelser."
    },
    {
      "q": "Bør jeg forbinde den samme Google-konto via alle tilgængelige ruter?",
      "a": "Kontrollér først, hvordan den allerede vises på telefonen. Flere ruter kan gøre det sværere at identificere kopier af kalendere. Vælg den rute, du vil bruge, bekræft dens begivenheder, og skjul en ekstra visning under undersøgelsen i stedet for som første skridt at slette data eller afbryde konti."
    }
  ],
  "sourcesHeading": "Kilder og opsætningsreferencer",
  "sources": [
    {
      "label": "Apple: konfigurer iCloud Calendar på dine enheder",
      "url": "https://support.apple.com/guide/icloud/set-up-calendar-mme4d73a8727/icloud"
    },
    {
      "label": "Google: deling af kalender og tilladelser",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: Outlook Calendar API og understøttede mailbox-data",
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
    "heading": "Samlet visning, abonnement eller kopieret optaget tid?",
    "columns": [
      "Det, du har brug for",
      "Det, du skal kontrollere",
      "Det, du ikke bør antage"
    ],
    "rows": [
      {
        "cells": [
          "Én visning af flere konti",
          "Den tilsluttede konto, den valgte kalender og den nødvendige plan.",
          "At en delt skærm samler ejerskab eller tilladelser."
        ]
      },
      {
        "cells": [
          "At en redigering af en begivenhed når frem til dens udbyder",
          "Den oprindelige begivenhed, skrivetilladelse og det gemte resultat ved kilden.",
          "At en synlig lokal redigering beviser vellykket synkronisering med udbyderen."
        ]
      },
      {
        "cells": [
          "Optaget tid i en anden konto",
          "En tjeneste med eksplicitte regler for synkronisering fra kilde til destination.",
          "At en samlet visning opretter tilgængelighedsblokke for kolleger."
        ]
      },
      {
        "cells": [
          "Et kalenderfeed, du abonnerer på",
          "Udgiveren, opdateringsadfærden og skrivebeskyttet status.",
          "At et ICS-abonnement er en redigerbar tovejforbindelse."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-left",
    "hook"
  ],
  "galleryDevice": "iPad",
  "galleryCaption": "Ægte kalendervisninger på iPad illustrerer gennemgang af en tidsplan. Et skærmbillede viser ikke retningen for synkronisering med udbyderen eller kontotilladelser.",
  "actionHeading": "Gennemgå dine kalendere samlet på iPhone og iPad",
  "actionText": "Google Calendar-synkronisering er inkluderet i Base. Advanced fjerner annoncer; Premium tilføjer understøttelse af Microsoft Calendar og Teams. Bekræft kontoens tilladelser uafhængigt af den købte plan.",
  "articleLinks": [
    {
      "slug": "onecal-alternative-iphone-calendar-view-or-sync",
      "label": "Sammenlign en samlet visning med OneCal-synkroniseringsregler"
    },
    {
      "slug": "fantastical-readdle-calendar366-iphone-comparison",
      "label": "Sammenlign kalenderarbejdsgange på iPhone"
    },
    {
      "slug": "weather-inside-your-calendar",
      "label": "Planlæg med vejr og aftaler samlet"
    }
  ]
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
