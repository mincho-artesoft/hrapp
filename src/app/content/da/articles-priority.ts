import type { LocalisedArticle } from '../types';

export const PRIORITY_DA: Readonly<Record<string, LocalisedArticle>> = {
  "forecast-beside-every-event": {
    "title": "Tjek timevejret for en kalenderbegivenhed på iPhone og iPad",
    "short": "Vejr i de timer, hvor begivenheden finder sted",
    "description": "Sammenhold din begivenheds sted, dato og timer med den tilgængelige vejrprognose.",
    "lede": "For at tjekke vejret for en kalenderbegivenhed skal du få tre ting til at passe sammen: stedet, den lokale dato og aftalens tidsrum fra start til slut. I Cloud Calendars vælger du vejrstedet og ser de tilgængelige timer. En begivenheds adresse og et nærliggende vejrikon er ikke i sig selv bevis på, at de passer sammen. Denne guide udgives af Arte Soft, udvikleren.",
    "commonBelief": "At et dagligt vejr-ikon i en kalender er den samme funktion som en prognose knyttet til en begivenhed.",
    "sections": [
      {
        "heading": "Start med sted og dato",
        "body": [
          "Åbn prognosen for den ønskede placering, og sammenlign datoen med kalenderposten. Kalendervejr kan afspejle det valgte vejrsted, så kontrollér, at det passer til begivenheden, i stedet for at antage, at begivenhedens adresse styrer det.",
          "En begivenhed næste måned kan findes, før der er vejrdata tilgængelige for den dato. Behold begivenheden, og vend tilbage til prognosen tættere på datoen; en manglende vejroplysning er ikke en prognose om klart vejr."
        ]
      },
      {
        "heading": "Brug timedetaljer til spørgsmål om timer",
        "body": [
          "Et dagligt resumé og en timeprognose besvarer forskellige spørgsmål. Hvis begivenheden varer fra klokken to til fem, bør du se på de tilgængelige timer i det interval i stedet for at betragte ét dagligt ikon som hele billedet.",
          "Hvis kun en del af intervallet er tilgængeligt, skal resten forblive uafklaret. Appen lover ikke fuldstændige timeopdelte vejroplysninger for alle begivenheder, du kan oprette, og denne vejledning lover ikke, at åbning af en vilkårlig begivenhed altid viser hele dens vejrinterval."
        ]
      },
      {
        "heading": "Adskil sandsynlighed, mængde og tidspunkt",
        "body": [
          "Læs etiketten på den værdi, du kontrollerer. Sandsynlighed for nedbør er ikke det samme som nedbørsmængde eller varighed. Tilsvarende dækker en timeværdi og et dagligt resumé forskellige perioder; sammenlign ens perioder, når du vurderer to mulige tidspunkter.",
          "Vælg en alternativ løsning, der passer til dit abonnement, i stedet for at behandle én enkelt procent som en universel regel for at gennemføre eller aflyse. Vejroplysninger kan ændre sig, så tjek dem igen, når der skal træffes en beslutning."
        ]
      },
      {
        "heading": "Gennemgå før du gemmer en vejrafhængig begivenhed",
        "body": [
          "Appen kan starte en kladde til en begivenhed ud fra en prognosetime. Gennemgå kladdens dato, start, slut og destinationskalender, før du gemmer. Valg af prognose erstatter ikke kontrollen af, at du opretter den rigtige aftale.",
          "Hvis kalenderadgang eller destinationskalenderen forhindrer lagring, skal du løse den tilladelse separat fra vejrtilgang. At finde en prognose giver ikke redigeringsrettigheder til en delt kalender."
        ]
      },
      {
        "heading": "Brug den fulde prognose, når resuméet ikke er nok",
        "body": [
          "Ved en aktivitet udendørs bør du kontrollere de variabler, der er relevante for aktiviteten, og for den placering, du faktisk har valgt. En widget med aktuelt vejr eller en demo på forsiden erstatter ikke et tjek af appens tilgængelige prognosetimer.",
          "Hvis du bemærker en uoverensstemmelse, skal du først sammenligne sted og tidsstempel. Forskellige udbydere, valgte steder og prognoseperioder kan give forskellige visninger uden at bevise, at kalenderbegivenheden er ændret."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Bekræft placering og begivenhedsdato.",
      "Kontrollér de tilgængelige timer gennem hele aktiviteten.",
      "Læs sandsynlighed og mængde som forskellige værdier.",
      "Gennemgå begivenhedskladden, før du gemmer."
    ],
    "seeAlso": [
      "weather-inside-your-calendar",
      "planning-outdoors-without-being-rained-on"
    ],
    "updated": "2026-10-23",
    "faq": [
      {
        "q": "Har alle begivenheder en komplet prognose?",
        "a": "Nej. Dækningen afhænger af det valgte sted og de tilgængelige datoer og timer."
      },
      {
        "q": "Er vejr-ikonet specifikt for begivenhedens adresse?",
        "a": "Det bør du ikke udlede ud fra nærheden til begivenheden. Bekræft vejrplaceringen separat."
      },
      {
        "q": "Gemmer tryk på en time en ny begivenhed?",
        "a": "Det starter en begivenhedskladde, hvor det er tilgængeligt. Gennemgå dato, tidspunkt og kalender, før du gemmer."
      }
    ],
    "sourcesHeading": "Vejrkilder og placeringsindstillinger",
    "sources": [
      {
        "label": "Apple: WeatherKit-prognoser og regional tilgængelighed",
        "url": "https://developer.apple.com/weatherkit/"
      },
      {
        "label": "Apple: Anonymitet og Lokalitetstjenester",
        "url": "https://support.apple.com/en-us/102515"
      }
    ],
    "comparison": {
      "heading": "Et praktisk tjek før en udendørs aftale",
      "columns": [
        "Tjek",
        "Eksempel",
        "Beslutning"
      ],
      "rows": [
        {
          "cells": [
            "Sted",
            "Aftalen er i en anden by.",
            "Vælg den destination i vejrvisningen, og læs dens navn."
          ]
        },
        {
          "cells": [
            "Tidsrum",
            "Aktiviteten varer fra 14.00 til 16.00.",
            "Tjek begge timer samt relevant forberedelse eller rejsetid."
          ]
        },
        {
          "cells": [
            "Dækning",
            "Kun nogle af de nødvendige timer er tilgængelige.",
            "Lad planen være foreløbig, og aftal et nyt tjek."
          ]
        },
        {
          "cells": [
            "Gemt begivenhed",
            "Du starter et udkast fra en vejrtime.",
            "Gennemgå dato, tidszone, varighed og målkalendar, før du gemmer."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-right",
      "week-left"
    ],
    "galleryCaption": "Vejrvisningen og ugevisningen viser forskellige dele af den samme planlægningsopgave. Bekræft prognosestedet separat fra begivenhedens placering.",
    "actionHeading": "Sammenhold prognosen med dine faktiske aftaler",
    "actionText": "Brug Cloud Calendars på iPhone eller iPad til at gennemgå den tilgængelige prognose og din kalender. Vejret hjælper dit valg; det flytter ikke automatisk en begivenhed eller bekræfter en ændring med deltagerne.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Forstå kalender- og vejrvisningerne"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Vælg et hurtigt overblik på hjemmeskærmen"
      },
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Tjek kalendrene bag din kalenderplan"
      }
    ]
  },
  "the-widget-that-shows-what-is-next": {
    "updated": "2026-10-23",
    "title": "Kalenderwidgets på iPhone og iPad: kommende begivenheder og vejr",
    "short": "Kommende begivenheder på hjemmeskærmen",
    "description": "Vælg en Cloud Calendars-widget til kommende begivenheder, datoen eller vejret.",
    "lede": "Vælg Calendar Events eller Calendar Events Large, når du vil have kommende aftaler på din hjemmeskærm. Vælg Calendar & Weather for en visning af dato og vejr. Disse layouts besvarer forskellige spørgsmål; forhåndsvis den variant, der tilbydes på din enhed, før du tilføjer den. Denne guide er udgivet af Arte Soft, udvikleren af Cloud Calendars.",
    "sections": [
      {
        "heading": "Vælg først eventlayoutet",
        "body": [
          "I widgetgalleriet i Cloud Calendars er Calendar Events det mellemstore layout med eventliste. Calendar Events Large giver mere plads til kommende events. Calendar & Weather er et separat layout med dato og vejr; den lille størrelse lover ikke en række med næste event. Navnene kan være oversat på din enhed.",
          "På iPhone skal du holde på et tomt område på hjemmeskærmen, vælge Rediger og Tilføj widget, derefter finde Cloud Calendars og vælge det ønskede layout. Sammenlign forhåndsvisningen, før du tilføjer det. Apples widgetvejledning dækker dette systemgalleri; det er adskilt fra kalendervisningerne i appen."
        ]
      },
      {
        "heading": "Tilføj og kontrollér widgetten på iPad",
        "body": [
          "På iPad skal du bruge Apples widgetgalleri på hjemmeskærmen: Hold på baggrunden, åbn Rediger og derefter Tilføj widget. Søg efter Cloud Calendars, gennemse de tilbudte stilarter og størrelser, tilføj det layout, du har brug for, placér det, og afslut med OK. Følg de kontroller, som din version af iPadOS viser; en forhåndsvisning er ikke en bekræftelse på, at dine kalenderdata er indlæst.",
          "Vælg Calendar Events eller Calendar Events Large, når du har brug for events. Sammenlign de stilarter, som den installerede app tilbyder; en dato- og vejrflise besvarer et andet behov end en eventliste.",
          "Åbn Cloud Calendars på den iPad, og find et kendt fremtidigt tidsbestemt event i en valgt kalender. En korrekt visning på din iPhone bekræfter ikke iPadens konti, adgang eller indlæste data. Sammenlign titel, dato og starttid, og fortsæt derefter med kontrollerne af egnethed og opdatering nedenfor, hvis widgetten afviger."
        ]
      },
      {
        "heading": "Kontrollér, hvad der regnes som kommende",
        "body": [
          "Eventvisningen bruger valgte kalendere og fremtidige tidsbestemte events. Heldagsindlæg og events, hvis starttid allerede er passeret, udelukkes fra denne liste over kommende events. En fødselsdag eller et møde, der allerede er i gang, kan derfor godt være synligt i appen uden at vises her.",
          "Hvis din eneste post i dag for eksempel er en heldagsmarkering for rejse, betyder en tom liste over kommende events ikke, at rejsemarkeringen er forsvundet. Åbn appen for at se hele dagen. Tilsvarende kan det næste tidsbestemte event være i morgen eller senere; læs datoen i stedet for at antage, at alle rækker gælder i dag."
        ]
      },
      {
        "heading": "Skeln mellem et manglende event og en liste, der ikke har flere rækker",
        "body": [
          "En widget viser et begrænset antal kommende events. Hvis tidligere events fylder rækkerne, kan et senere event mangle, selv om det findes i appen og er kvalificeret til listen over kommende events. Et større eventlayout kan vise flere rækker; det er stadig ikke hele kalenderen.",
          "Begynd med det nærmeste fremtidige tidsbestemte event i en valgt kalender. Hvis det vises, men et senere ikke gør, skal du åbne appen for at se resten af planen. Hvis det nærmeste kvalificerede event også mangler, skal du fortsætte med at kontrollere kalendervalg, adgang og opdateringer. Flyt eller slet ikke events kun for at få en senere post til at vises."
        ]
      },
      {
        "heading": "Brug appen som din første sammenligning",
        "body": [
          "Åbn Cloud Calendars, og find ét bestemt fremtidigt tidsbestemt event. Bekræft, at den kalender, det tilhører, er valgt, og at appen har den kalenderadgang, den har brug for. Sammenlign titel, dato og starttid med widgetten. Hvis eventet også mangler i appen, skal du først undersøge kontoen eller synkroniseringen.",
          "Brug et ufarligt testevent i en kalender, du selv ejer, hvis du har brug for et tydeligt eksempel. Giv det en fremtidig starttid og en genkendelig titel. Undgå at ændre en rigtig invitation eller fjerne konti bare for at teste hjemmeskærmen."
        ]
      },
      {
        "heading": "Tag højde for opdateringer uden at gå ud fra en fast frist",
        "body": [
          "Widgets viser gemte oplysninger og kører ikke hele tiden som en åben app. Apple styrer, hvornår de opdateres. Når du åbner appen og kontrollerer eventet, får du et frisk sammenligningsgrundlag, men det fastslår ikke et præcist antal sekunder, før widgetten skal ændre sig.",
          "Hvis appen fortsat er korrekt, mens widgetten stadig er forkert, så notér layoutet, den valgte kalender, eventtidspunktet og versionerne af appen og iOS. En tom liste, et gammelt event og et forkert tidspunkt er forskellige observationer; angiv, hvilken du ser."
        ]
      },
      {
        "heading": "Læs vejret som en separat oversigt",
        "body": [
          "Vejret ved siden af datoen er ikke en prognose knyttet til hvert enkelt events sted og starttid. Før et udendørs event bør du åbne vejroversigten og kontrollere det ønskede sted og tidspunkt. Et ikon for de aktuelle forhold kan ikke fastslå, hvilke forhold der vil være ved et senere møde.",
          "Behold denne widget til hurtig orientering. Brug den fulde kalender til heldagsaftaler, eventdetaljer og beslutninger, der kræver hele planen."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Vælg Calendar Events eller Calendar Events Large for at få en eventliste.",
      "Bekræft et fremtidigt tidsbestemt event i en valgt kalender.",
      "Sammenlign dets dato og tidspunkt i appen, før du fejlsøger widgetten.",
      "Registrér vedvarende forskelle i stedet for at slette kalenderdata."
    ],
    "faq": [
      {
        "q": "Hvorfor mangler min fødselsdag?",
        "a": "Listen over kommende events udelukker heldagsevents. Se den fulde kalender for fødselsdage og andre poster kun med dato."
      },
      {
        "q": "Viser den lille widget det næste møde?",
        "a": "Det lille layout Calendar & Weather viser dato og vejr. Vælg et layout med eventliste for at se events."
      },
      {
        "q": "Betyder ingen kommende events, at jeg har fri i dag?",
        "a": "Nej. Heldagsposter, igangværende events, ikke-valgte kalendere og forældede oplysninger kan ændre den konklusion."
      }
    ],
    "sourcesHeading": "Kilder og Apple-vejledninger",
    "sources": [
      {
        "label": "Apple: Tilføj og rediger widgets på iPhone",
        "url": "https://support.apple.com/118610"
      },
      {
        "label": "Apple: Hold en widget opdateret",
        "url": "https://developer.apple.com/documentation/widgetkit/keeping-a-widget-up-to-date"
      },
      {
        "label": "Apple: Tilføj, rediger og fjern widgets på iPad",
        "url": "https://support.apple.com/guide/ipad/add-edit-and-remove-widgets-ipadb0de8630/ipados"
      }
    ],
    "seeAlso": [
      "choosing-a-widget-size",
      "a-countdown-to-your-next-meeting",
      "calendar-on-apple-watch"
    ],
    "comparison": {
      "heading": "Vælg den visning, du faktisk har brug for",
      "columns": [
        "Visning",
        "Brug den til",
        "Kontrollér dette, før du stoler på den"
      ],
      "rows": [
        {
          "cells": [
            "Calendar Events",
            "En kompakt visning af kommende tidsbestemte events.",
            "Eventet tilhører en valgt kalender og er ikke startet endnu."
          ]
        },
        {
          "cells": [
            "Calendar Events Large",
            "Mere plads til kommende events.",
            "Et større layout har stadig et begrænset antal rækker."
          ]
        },
        {
          "cells": [
            "Calendar & Weather",
            "Et hurtigt overblik over dato og vejr.",
            "Det lille layout lover ikke en række med et kommende event."
          ]
        },
        {
          "cells": [
            "Live Activity",
            "En separat nedtælling til næste event på understøttede iPhone-flader.",
            "Det er ikke en widget til hjemmeskærmen eller et særligt widgetlayout til låseskærmen."
          ]
        }
      ]
    },
    "galleryKinds": [
      "widgets",
      "live"
    ],
    "galleryCaption": "Widgets på hjemmeskærmen og Live Activity er separate visninger. Vælg det layout, der passer til de oplysninger, du har brug for.",
    "actionHeading": "Få den nyttige del af din kalender op på hjemmeskærmen",
    "actionText": "Åbn Cloud Calendars, kontrollér et kendt fremtidigt tidsbestemt event, og tilføj derefter den passende widget på din iPhone eller iPad. Appen er stadig stedet, hvor du ser hele kalenderen.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Se vejret ved siden af din kalender"
      },
      {
        "slug": "forecast-beside-every-event",
        "label": "Kontrollér timerne for et udendørs event"
      },
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Kontrollér dine tilsluttede kalenderkonti"
      }
    ]
  },
  "onecal-alternative-iphone-calendar-view-or-sync": {
    "updated": "2026-10-23",
    "title": "Cloud Calendars eller OneCal? Vælg en samlet visning eller kalendersynkronisering",
    "short": "Cloud Calendars og OneCal efter arbejdsgang",
    "description": "Sammenlign OneCal og Cloud Calendars ud fra visninger, kopierede begivenheder, mobilstyring og planer.",
    "lede": "Vælg ud fra det resultat, du har brug for: at gennemgå flere tidsplaner samlet, redigere en oprindelig begivenhed eller kopiere optaget tid til en anden konto. Cloud Calendars giver planlægningsvisninger på iPhone og iPad; OneCal dokumenterer en Unified Calendar View og separate Calendar Sync-regler. Denne sammenligning er udgivet af Arte Soft, udvikleren af Cloud Calendars.",
    "commonBelief": "To produkter, der viser Google-, iCloud- og Outlook-kalendere, holder nødvendigvis tilgængelighed, redigeringer af begivenheder og kopier synkroniseret på samme måde.",
    "sections": [
      {
        "heading": "Vælg mellem et overblik og en ændring i en anden konto",
        "body": [
          "Hvis dit mål er at se en personlig aftale ved siden af et arbejdsmøde, har du brug for en samlet visning. Hvis din arbejdskalender også skal indeholde en optaget-blok for den personlige aftale, har du brug for en defineret arbejdsgang fra kilde til destination. Det første resultat etablerer ikke det andet.",
          "Cloud Calendars samler valgte kalendere i en planlægningsvisning på iPhone og iPad. OneCal dokumenterer en Unified Calendar View separat fra Calendar Sync; udgiveren oplyser, at du kan bruge denne visning uden at konfigurere synkroniseringsregler. Afgør, hvilket resultat der betyder mest, før du forbinder konti eller sammenligner abonnementsnavne."
        ]
      },
      {
        "heading": "Forstå, hvad en kopieret begivenhed kan ændre",
        "body": [
          "OneCals dokumentation for Calendar Sync beskriver envejs- og flervejsregler, som opretter klonbegivenheder. Dets separate dækningsguide siger, at redigeringer af en klon ikke overføres tilbage til originalen. Identificér originalen og dens ejende kalender, før du behandler en kopieret aftale som stedet, hvor et møde skal flyttes.",
          "Cloud Calendars-forbindelser til udbydere kan også oprette spejlede kalendere i iOS-lageret. En samlet visning beviser ikke, at poster blev flettet sammen, eller at en redigering nåede frem til udbyderen. For en kalender, du ejer og må redigere i, bør du kontrollere en ufarlig testbegivenhed uden gæster både hos udbyderen og i appen."
        ]
      },
      {
        "heading": "Kontrollér styringen på den enhed, du faktisk vil bruge",
        "body": [
          "OneCals aktuelle mobilguide beskriver oprettelse og redigering af kalenderbegivenheder, valg for gentagelse, RSVP og at deltage i møder. Den siger også separat, at oprettelse, redigering, pause eller sletning af Calendar Sync-konfigurationer sker i webappen; mobilen viser disse konfigurationer. Opsætning af bookinglink beskrives også som en webopgave.",
          "Cloud Calendars er en app til iPhone og iPad med dags-, uge-, måneds-, års- og listevisning. Prøv den nødvendige redigering i den visning, du har installeret, læs eventuelle valg for gentagelse, og bekræft den gemte begivenhed. Antag ikke, at en anden apps mobilmenu, bookingarbejdsgang eller automatiseringsstyring findes her."
        ]
      },
      {
        "heading": "Bekræft dækningen i stedet for at antage ubegrænset historik",
        "body": [
          "OneCals aktuelle dækningsguide angiver et fremtidigt synkroniseringsvindue på op til et år for Google og iCloud og op til tre måneder for Outlook. Den skelner også mellem fremtidige tilbagevendende serier og selvstændige historiske begivenheder. Dette er grænser dokumenteret af udgiveren, ikke en test af netop din konto eller en påstand om alle funktioner i kalendervisningen.",
          "Cloud Calendars kræver også kontrol af kontoruten, de valgte kalendere og relevante datoer. Hvis gamle møder er vigtige, så sammenlign en identificeret begivenhed hos udbyderen og i appen. En kalenderapp er ikke automatisk en fuld backup eller en garanti for, at alle tidligere poster er hentet."
        ]
      },
      {
        "heading": "Sammenlign plankrav og faktureringsvej",
        "body": [
          "Cloud Calendars inkluderer Google Calendar-synkronisering i Base; Advanced fjerner annoncer, og Premium tilføjer understøttelse af Microsoft Calendar og Teams. Bekræft kontotilladelser separat fra planen. Kontrollér den aktuelle lokale pris og faktureringsperiode før køb i stedet for at bruge en fast international prissammenligning.",
          "OneCals webguide til planer beskriver planer pr. medlem og en prøveperiode på fjorten dage, inklusive fjernelse af kloner, når prøveperioden udløber. Dets mobilguide til fakturering beskriver køb administreret af butikken og begrænsninger for at tilføje teammedlemmer. Kontrollér, hvilke funktioner der kræver en løbende plan, og hvor købet administreres; en gratis download alene besvarer ikke de spørgsmål."
        ]
      },
      {
        "heading": "Test din faktiske planlægningsarbejdsgang, før du skifter",
        "body": [
          "Hvis vejr, widgets eller en Live Activity er vigtige, så tag dem med i afprøvningen på den enhed, du bruger. Cloud Calendars tilbyder disse planlægningsflader, med vejr begrænset til tilgængelige datoer og det valgte sted. De OneCal-sider, der er gennemgået her, fastslår ikke funktionsparitet for disse flader; kontrollér det aktuelle produkt i stedet for at udlede fravær ud fra en guide.",
          "Behold de oprindelige apps og forbindelsesoplysninger, indtil du har kontrolleret det nødvendige resultat. Notér, om du har verificeret synlighed, redigering af den oprindelige begivenhed, kopieret optaget tid eller en påmindelse; det er forskellige resultater. Før du afbryder en tjeneste, bør du gennemgå, hvad der sker med eksisterende kopier, og undgå at eksperimentere på en aktiv invitation eller et rigtigt kundemøde."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Skriv ned, om du har brug for en samlet visning eller begivenheder kopieret til en anden konto.",
      "Identificér originaler, kopier og den konto, der ejer hver vigtig begivenhed.",
      "Kontrollér de nødvendige styringer i din faktiske arbejdsgang på telefon, tablet eller web.",
      "Sammenlign en almindelig uge og eventuelle historiske datoer, du er afhængig af.",
      "Kontrollér aktuelle plankrav, lokal pris og købsudbyderen.",
      "Bekræft en ufarlig testbegivenhed, og gennemgå regler for fjernelse af kopier, før du skifter."
    ],
    "faq": [
      {
        "q": "Er en samlet kalendervisning det samme som at synkronisere optaget tid?",
        "a": "Nej. En samlet visning lader dig sammenligne forpligtelser. Oprettelse af en post i en anden konto kræver en separat understøttet arbejdsgang; OneCal dokumenterer Calendar Sync-regler separat fra sin Unified Calendar View."
      },
      {
        "q": "Kan jeg ændre en OneCal-klon for at flytte det oprindelige møde?",
        "a": "Dets dækningsguide siger, at ændringer i kloner ikke overføres til originalen. Identificér den oprindelige begivenhed, og følg dens kalenders redigerings- og arrangørtilladelser."
      },
      {
        "q": "Hvilken app er billigst til min opsætning?",
        "a": "Det afhænger af de funktioner, konti, den faktureringsvej og den lokale pris, du har brug for. Cloud Calendars inkluderer Google-synkronisering i Base og Microsoft-understøttelse i Premium. Gennemgå OneCals aktuelle plan og vilkår for mobilfakturering for din tiltænkte arbejdsgang; denne guide påstår ikke, at der findes en universel prisvinder."
      }
    ],
    "sourcesHeading": "OneCals officielle dokumentation for arbejdsgange og planer",
    "sources": [
      {
        "label": "OneCal: mobilfunktioner og konfigurationsopgaver kun til web",
        "url": "https://docs.onecal.io/docs/mobile-apps"
      },
      {
        "label": "OneCal: Calendar Sync og regler fra kilde til mål",
        "url": "https://docs.onecal.io/docs/calendar-sync/calendar-sync-intro"
      },
      {
        "label": "OneCal: synkroniseringsvinduer og redigeringer af klonbegivenheder",
        "url": "https://docs.onecal.io/docs/calendar-sync/what-does-onecal-sync"
      },
      {
        "label": "OneCal: planer, prøveperiode og adfærd ved udløb",
        "url": "https://docs.onecal.io/docs/billing/plans-and-free-trial"
      },
      {
        "label": "OneCal: abonnementer i App Store og Google Play",
        "url": "https://docs.onecal.io/docs/billing/mobile-subscriptions"
      }
    ],
    "seeAlso": [
      "what-calendar-sync-actually-does",
      "three-calendar-apps-is-two-too-many",
      "free-google-sync-without-adverts",
      "disconnect-calendar-integration-without-losing-track",
      "what-fantastical-costs-and-what-this-does"
    ],
    "comparison": {
      "heading": "Sammenlign arbejdsgangen før abonnementet",
      "columns": [
        "Spørgsmål",
        "Cloud Calendars",
        "OneCal-dokumentation"
      ],
      "rows": [
        {
          "cells": [
            "Hvor gennemgår jeg min tidsplan?",
            "På iPhone og iPad med dags-, uge-, måneds-, års- og listevisning.",
            "Unified Calendar View er adskilt fra konfiguration af Calendar Sync."
          ]
        },
        {
          "cells": [
            "Har jeg brug for optaget-blokke kopieret mellem konti?",
            "Udled ikke dette af den samlede visning; forbindelser til udbydere kan spejle kalendere lokalt.",
            "Calendar Sync opretter klonbegivenheder ved hjælp af envejs- eller flervejsregler."
          ]
        },
        {
          "cells": [
            "Hvor ændrer jeg synkroniseringsregler?",
            "Brug de styringer, der er dokumenteret for appens kontoforbindelse.",
            "Den gennemgåede mobilguide placerer ændringer af synkroniseringskonfiguration i webappen."
          ]
        },
        {
          "cells": [
            "Hvilken Cloud Calendars-plan har jeg brug for?",
            "Base inkluderer Google Calendar-synkronisering; Advanced fjerner annoncer; Premium tilføjer Microsoft Calendar og Teams.",
            "Kontrollér OneCals aktuelle plan og faktureringsvej for den nødvendige arbejdsgang."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-left",
      "hook"
    ],
    "galleryCaption": "Cloud Calendars’ ægte kalenderskærme viser planlægningsvisningen. Sammenligningen skelner mellem denne visning og en tjenestes serverside-regler for kloner.",
    "actionHeading": "Vælg det resultat, du vil verificere",
    "actionText": "Hvis du vil have et overblik på iPhone eller iPad med vejr og widgets, så prøv Cloud Calendars med en ufarlig testbegivenhed. Hvis dit krav er kopieret optaget tid i en anden konto, så vurder en tjeneste, der udtrykkeligt dokumenterer den handling.",
    "articleLinks": [
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Opsæt en samlet kalendervisning"
      },
      {
        "slug": "fantastical-readdle-calendar366-iphone-comparison",
        "label": "Sammenlign andre kalenderløsninger til iPhone"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Vælg visningen på din hjemmeskærm"
      }
    ]
  },
  "fantastical-readdle-calendar366-iphone-comparison": {
    "updated": "2026-10-23",
    "title": "Alternativer til iPhone-kalendere: Cloud Calendars, Fantastical, Readdle og BusyCal",
    "short": "Sammenlign alternativer til iPhone-kalendere",
    "description": "Sammenlign iPhone-kalendere efter vejr, visninger, opgaver og den arbejdsgang, du har brug for.",
    "lede": "Vælg en kalender ud fra den opgave, du vil have løst: gennemgå begivenheder med vejr, opret hurtigt en begivenhed, administrer opgaver eller kombiner visninger fra flere konti. Cloud Calendars, Fantastical, Calendars by Readdle, Calendar 366 og BusyCal adskiller sig på disse arbejdsgange og deres plankrav. Arte Soft udvikler Cloud Calendars og udgiver denne sammenligning.",
    "sections": [
      {
        "heading": "Vælg først det, der absolut skal fungere, før du sammenligner udseendet",
        "body": [
          "Skriv dine kalenderudbydere, enheder og tre vigtigste handlinger ned. Et eksempel kan være: se arbejds- og privatkalendere samlet, fuldføre en påmindelse og hurtigt tilføje et møde. Test disse handlinger med private eksempeldata, før du importerer en hel kalenderplan.",
          "At et produkt understøtter navnet på din udbyder, betyder ikke, at alle forbindelsesmetoder har de samme tilladelser eller funktioner. En enhedskalender, en direkte tilsluttet konto og et abonnement på et feed kan give opslag, der ligner hinanden, men tillader forskellige handlinger."
        ]
      },
      {
        "heading": "Brug udbyderens egen kalender som udgangspunkt",
        "body": [
          "Googles introduktionsguide beskriver virksomhedens egen kalendergrænseflade til planlægning, opgaver, deling og flere kalendere. Hvis din kalenderplan allerede ligger der, så test den nødvendige handling ved kilden, før du beslutter, om du har brug for en anden app.",
          "Sammenlign for eksempel den samme begivenhed i Google Calendar og Fantastical, efter at du har tilsluttet den påtænkte konto. Kontroller, om den fordel, du har brug for, er en samlet visning, en opgaveforbindelse, hurtig indtastning eller en bestemt enhedsgrænseflade. En anden kalenderklient er ikke automatisk en flytning til en anden udbyder."
        ]
      },
      {
        "heading": "Fantastical: kontroller kontoforbindelser og hurtig indtastning",
        "body": [
          "Flexibits dokumenterer både direkte forbindelser til kalenderkonti og muligheder for kalendere og påmindelser, der allerede er konfigureret i iOS. Introduktionsguiden anbefaler direkte forbindelser for fuld udnyttelse af appens funktioner. Find ud af, hvilken metode du valgte, i stedet for at forbinde den samme kalender to gange uden grund.",
          "Fantastical dokumenterer også sætningsbaseret indtastning og genanvendelige skabeloner til begivenheder eller opgaver. Test en tydelig dato, varighed og målkalender, og gennemgå derefter det gemte resultat. Syntaksen hører til Fantastical; et tekstfelt i en anden app kan fortolke den samme sætning anderledes."
        ]
      },
      {
        "heading": "Calendars by Readdle: kontroller opgavekilden",
        "body": [
          "Readdle præsenterer Google-, Outlook- og iCloud-kalendere sammen med funktioner til opgaver og naturligt sprog. Guiden til opsætning af opgaver beskriver valg af iOS Reminders eller Google Tasks i Opgaveindstillinger. Det valg er vigtigt, hvis fuldførelse af en opgave på telefonen skal opdatere en bestemt oprindelig liste.",
          "Brug en midlertidig opgave til at teste fuldførelse i begge ender, ikke kun om en titel vises på en tidslinje. Hvis du også har brug for en visning eller handling på Mac ud over iPhone, så test også der. Gå ikke ud fra identiske kontroller, bare fordi produktnavnet er fælles."
        ]
      },
      {
        "heading": "Calendar 366: kontroller systemadgang, sæt og vejrlokation",
        "body": [
          "Calendar 366’s dokumentation skelner mellem adgang til systemkalendere og påmindelser og direkte kontointegrationer. Den beskriver kalendersæt, der vælger synlige kalendere og lister. Disse sæt kan også bestemme en standardkalender, så kontroller, hvor en nyoprettet begivenhed vil høre til.",
          "Den samme dokumentation beskriver appens egen parser til naturligt sprog og vejr via Apple Weather med valg mellem systemlokation eller brugerdefineret lokation. Til udendørs planlægning bør du kontrollere det valgte sted i stedet for at antage, at prognosen følger adressen for hver begivenhed. Dette er funktioner dokumenteret af udgiveren, ikke funktioner testet på din konto."
        ]
      },
      {
        "heading": "BusyCal: kontroller visning af opgaver og den visning, der bruges til vejr",
        "body": [
          "BusyCal’s guide til iOS-opgaver skelner mellem opgaver med dato, med tidspunkt og uden dato. Den beskriver kontroller til fuldførelse og at flytte uafsluttede opgaver med dato videre. Vejrguiden placerer prognoser i visningerne Liste, Dag og Måned, så test den konkrete visning, du bruger, i stedet for at antage, at vejr vises overalt.",
          "BusyCal dokumenterer også indtastning med naturligt sprog som en mulighed i standardindstillingerne for nye begivenheder. Prøv den samme private eksempelbegivenhed, som blev brugt til de andre apps, og kontroller derefter kalenderen og det gemte tidspunkt. Dette er kontroller i BusyCal, ikke kommandoer, som deles af alle kalenderapps."
        ]
      },
      {
        "heading": "Kontroller arbejdsgangen på Watch separat fra telefonen",
        "body": [
          "Fantastical’s Watch-guide dokumenterer visningerne Up Next, Liste og Opgaver, inklusive fuldførelse af opgaver. BusyCal’s opgaveguide skelner mellem opgaver med dato og tidspunkt, som vises på Watch, og opgaver uden dato. Hvis en udateret efterslæbsliste er vigtig, så tag den med i din afprøvning i stedet for kun at teste den næste begivenhed.",
          "En Watch complication er et hurtigt overblik, mens Watch-appen kan tilbyde yderligere handlinger. Bekræft dataene og handlingen på det faktiske ur og telefonen, og gennemgå den aktuelle plan. Grænsefladerne på computer, telefon og ur kan ikke udskiftes indbyrdes, blot fordi de bruger samme produktnavn."
        ]
      },
      {
        "heading": "Behandl pris og rettigheder som en separat kontrol",
        "body": [
          "Kontroller den aktuelle lokale købsskærm, hvilke funktioner der er tilgængelige efter en prøveperiode, og om et tidligere køb ændrer dine rettigheder. Gratis download, et tilbagevendende abonnement og et ældre køb låser ikke nødvendigvis op for det samme sæt funktioner.",
          "Udgivernes sider kan blive opdateret på forskellige tidspunkter. Readdles aktuelle produkt-FAQ beskriver flere kernefunktioner som gratis, mens en separat hjælpeside om gratis versus fuld version angiver en anden opdeling. I stedet for at betragte én beskrivelse som et universelt løfte bør du kontrollere den nødvendige handling i den installerede app og dens aktuelle købsvilkår."
        ]
      },
      {
        "heading": "Hvor Cloud Calendars hører hjemme på shortlist'en",
        "body": [
          "Cloud Calendars er endnu en mulighed til iPhone og iPad med udvalgte kalendere, flere planlægningsvisninger, vejr og widgets. Google-synkronisering er inkluderet i Base, Advanced fjerner annoncer, og Premium tilføjer understøttelse af Microsoft calendar. Kontroller den aktuelle plan og udbydertilladelserne for din opsætning.",
          "Hvis en specialiseret opgaveforbindelse, skabelonkommando eller desktop-arbejdsgang er afgørende, så brug det produkt, der dokumenterer og faktisk udfører det krav. Sammenlign gemte resultater og den daglige indsats; en tjekliste skal hjælpe dig med at vælge, ikke antyde at alle funktioner nævnt her findes i Cloud Calendars."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Lav en liste over dine konti, enheder og vigtigste handlinger.",
      "Vælg én rute til kontoforbindelse, og undersøg hvilke kalendere den giver adgang til.",
      "Test hurtig indtastning og fuldførelse af opgaver med ufarlige eksempler.",
      "Kontroller vejrlokationen og de visninger, der bruges på hver enhed.",
      "Kontroller de aktuelle købsvilkår efter en eventuel prøveperiode eller ældre rettighed."
    ],
    "faq": [
      {
        "q": "Hvilket er det bedste alternativ til Fantastical?",
        "a": "Det afhænger af den arbejdsgang, du har brug for. Sammenlign kalender- og opgavekilder, indtastning af begivenheder, enhedssupport og aktuelle rettigheder. Denne guide udråber ikke en universel vinder på ydeevne."
      },
      {
        "q": "Betyder det samme udbydernavn, at alle apps synkroniserer identisk?",
        "a": "Nej. Kontroller direkte forbindelser, enhedskalendere, feeds og tilladelser hver for sig, og bekræft derefter en eksempelændring ved kilden."
      },
      {
        "q": "Kan jeg gå ud fra, at alle annoncerede funktioner er gratis?",
        "a": "Nej. Kontroller den installerede app, den lokale købsskærm og de funktioner, der er tilbage efter en prøveperiode. Udgiverens dokumentation kan beskrive forskellige versioner eller rettigheder."
      }
    ],
    "sourcesHeading": "Officiel dokumentation gennemgået til denne guide",
    "sources": [
      {
        "label": "Fantastical: ruter til kontoforbindelse",
        "url": "https://flexibits.com/fantastical-ios/help/getting-started"
      },
      {
        "label": "Fantastical: indtastning med naturligt sprog og skabeloner",
        "url": "https://flexibits.com/fantastical-ios/help/adding-events-and-tasks"
      },
      {
        "label": "Readdle: aktuelle produktfunktioner og FAQ",
        "url": "https://readdle.com/calendars"
      },
      {
        "label": "Readdle: valg af opgavekilde",
        "url": "https://support.readdle.com/calendars/synchronization/how-to-sync-tasks-with-ios-reminders-or-google-tasks"
      },
      {
        "label": "Readdle: separat vejledning til gratis/fuld plan",
        "url": "https://apphelp.readdle.com/en/index.php?id=585&pg=kb.page"
      },
      {
        "label": "Calendar 366: integrationer, sæt, hurtig indtastning og vejr",
        "url": "https://calendar366.com/help/index.html"
      },
      {
        "label": "BusyCal til iOS: opgaver og grænser for Watch-opgaver",
        "url": "https://www.busymac.com/docs/busycalios/70659-tasks/"
      },
      {
        "label": "BusyCal til iOS: vejr og understøttede visninger",
        "url": "https://www.busymac.com/docs/busycalios/70665-weather/"
      },
      {
        "label": "BusyCal til iOS: indtastning med naturligt sprog",
        "url": "https://www.busymac.com/docs/busycalios/70669-natural-language/"
      },
      {
        "label": "Fantastical: Apple Watch-visninger og handlinger",
        "url": "https://flexibits.com/fantastical-ios/help/apple-watch"
      },
      {
        "label": "Google: Calendar’s egen kontobaserede grænseflade",
        "url": "https://support.google.com/calendar/answer/2465776?hl=en"
      }
    ],
    "seeAlso": [
      "what-fantastical-costs-and-what-this-does",
      "natural-language-calendar-events-iphone",
      "iphone-calendar-tasks-reminders-versus-event-alerts"
    ],
    "comparison": {
      "heading": "Begynd med dit vigtigste krav",
      "columns": [
        "Krav",
        "Relevante muligheder at kontrollere",
        "Vigtig forskel"
      ],
      "rows": [
        {
          "cells": [
            "Begivenheder med vejr og visninger på iPhone/iPad",
            "Cloud Calendars og de dokumenterede vejrvisninger i de sammenlignede apps.",
            "Kontroller prognosens lokation, tilgængelige periode og visning; vejrdækningen er ikke ubegrænset."
          ]
        },
        {
          "cells": [
            "Indtastning af begivenheder med naturligt sprog",
            "Fantastical og den relevante funktion i Readdle eller BusyCal.",
            "Sætningsfortolkning er ikke det samme som diktering eller almindelig redigering af begivenheder."
          ]
        },
        {
          "cells": [
            "Opgaver ved siden af begivenheder",
            "Den dokumenterede opgavekilde i Readdle, Calendar 366, BusyCal eller Fantastical.",
            "En påmindelse om en begivenhed er ikke det samme som en integration til fuldførelse af opgaver."
          ]
        },
        {
          "cells": [
            "Google Calendar-synkronisering og valgfri fjernelse af annoncer",
            "Cloud Calendars Base inkluderer Google Calendar-synkronisering; Advanced fjerner annoncer.",
            "Understøttelse af Microsoft Calendar og Teams kræver Premium."
          ]
        },
        {
          "cells": [
            "En anden købsmodel",
            "Den aktuelle butiksliste og rettighed for hver app og platform.",
            "En gratis download er ikke bevis for, at alle funktioner er gratis; regionale priser og planer kan ændre sig."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-left",
      "week-right",
      "widgets"
    ],
    "galleryDevice": "iPad",
    "galleryCaption": "Dette er skærmbilleder fra Cloud Calendars af appens visninger, vejr og widgets. De er ikke skærmbilleder af de andre produkter i sammenligningen.",
    "actionHeading": "Prøv kalenderen op mod ét reelt planlægningsbehov",
    "actionText": "Hvis dit vigtigste krav er en kalenderplan på iPhone eller iPad med vejr og widgets, så vurder Cloud Calendars med en midlertidig begivenhed. Hold specialkrav til opgaver, booking og naturligt sprog adskilt, når du sammenligner produkter.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Se, hvordan vejr passer ind i kalenderarbejdsgangen"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Sammenlign widgettene i Cloud Calendars"
      },
      {
        "slug": "onecal-alternative-iphone-calendar-view-or-sync",
        "label": "Skeln mellem en samlet visning og kopieret optaget tid"
      }
    ]
  }
};
