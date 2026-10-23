import type { LocalisedArticle } from '../types';

export const PRIORITY_NO: Readonly<Record<string, LocalisedArticle>> = {
  "forecast-beside-every-event": {
    "title": "Sjekk timevær for en kalenderhendelse på iPhone og iPad",
    "short": "Vær i arrangementstiden",
    "description": "Match sted, dato og klokkeslett for hendelsen med den tilgjengelige værmeldingen.",
    "lede": "For å sjekke været for en kalenderhendelse må du matche tre ting: stedet, den lokale datoen og tidsrommet fra start til slutt. I Cloud Calendars velger du værstedet og ser på de tilgjengelige timene. Adressen til en hendelse og et værikon i nærheten er ikke i seg selv bevis på at disse stemmer overens. Denne veiledningen er publisert av Arte Soft, utvikleren.",
    "commonBelief": "At et daglig værikon i en kalender er det samme som en værmelding knyttet til en hendelse.",
    "sections": [
      {
        "heading": "Start med sted og dato",
        "body": [
          "Åpne værmeldingen for stedet det gjelder, og sammenlign datoen med kalenderoppføringen. Kalendervær kan gjenspeile det valgte værstedet, så kontroller at det passer for hendelsen i stedet for å anta at arrangementsadressen styrer dette.",
          "En hendelse neste måned kan finnes før værdata for den datoen er tilgjengelige. Behold hendelsen og gå tilbake til værmeldingen nærmere datoen; en manglende værmelding er ikke en prognose om klarvær."
        ]
      },
      {
        "heading": "Bruk timevise detaljer når spørsmålet gjelder timer",
        "body": [
          "Et dagssammendrag og en timevarsel svarer på ulike spørsmål. Hvis hendelsen varer fra to til fem, bør du se på de tilgjengelige timene i dette intervallet i stedet for å behandle ett daglig ikon som hele bildet.",
          "Hvis bare deler av intervallet er tilgjengelige, lar du resten stå uavklart. Appen lover ikke fullstendige timevise værdata for alle hendelser du kan opprette, og denne veiledningen lover ikke at det å åpne en hendelse alltid viser hele værvinduet."
        ]
      },
      {
        "heading": "Skill mellom sannsynlighet, mengde og tidspunkt",
        "body": [
          "Les etiketten på verdien du kontrollerer. Sannsynlighet for nedbør er ikke det samme som nedbørsmengde eller varighet. Tilsvarende dekker en timeverdi og et dagsammendrag ulike perioder; sammenlign like perioder når du vurderer to mulige tidspunkter.",
          "Velg en reserveplan som passer for planen din, i stedet for å bruke én prosentverdi som en universell regel for gjennomføre eller avlyse. Værinformasjon kan endre seg, så sjekk den på nytt når en beslutning må tas."
        ]
      },
      {
        "heading": "Se gjennom før du lagrer en værbasert hendelse",
        "body": [
          "Appen kan starte et hendelsesutkast fra en varslet time. Se gjennom utkastets dato, start, slutt og målkalendar før du lagrer. Valg av værvarsel erstatter ikke kontrollen av at du oppretter riktig avtale.",
          "Hvis kalendertilgang eller målkalendar hindrer lagring, må denne tillatelsen løses separat fra værtilgang. Det å finne en værmelding gir deg ikke redigeringsrettigheter i en delt kalender."
        ]
      },
      {
        "heading": "Bruk hele værmeldingen når sammendraget ikke er nok",
        "body": [
          "For en aktivitet utendørs bør du kontrollere variablene som er relevante for aktiviteten og stedet du faktisk valgte. En widget for gjeldende vær eller en demo på startsiden erstatter ikke å sjekke appens tilgjengelige varslingstimer.",
          "Hvis du oppdager et avvik, bør du først sammenligne sted og tidspunkt. Ulike leverandører, valgte steder og varslingsperioder kan gi ulike visninger uten at det betyr at kalenderhendelsen er endret."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Bekreft sted og hendelsesdato.",
      "Kontroller de tilgjengelige timene gjennom hele aktiviteten.",
      "Les sannsynlighet og mengde som ulike verdier.",
      "Se gjennom hendelsesutkastet før du lagrer."
    ],
    "seeAlso": [
      "weather-inside-your-calendar",
      "planning-outdoors-without-being-rained-on"
    ],
    "updated": "2026-10-23",
    "faq": [
      {
        "q": "Har hver hendelse en fullstendig værmelding?",
        "a": "Nei. Dekningen avhenger av valgt sted og tilgjengelige datoer og timer."
      },
      {
        "q": "Er værikonet spesifikt for arrangementsadressen?",
        "a": "Ikke trekk den konklusjonen ut fra nærheten til hendelsen. Bekreft værstedet separat."
      },
      {
        "q": "Lagrer et trykk på en time en ny hendelse?",
        "a": "Der det er tilgjengelig, starter det et hendelsesutkast. Se gjennom dato, klokkeslett og kalender før du lagrer."
      }
    ],
    "sourcesHeading": "Værkilder og stedsinnstillinger",
    "sources": [
      {
        "label": "Apple: WeatherKit-varsler og regional tilgjengelighet",
        "url": "https://developer.apple.com/weatherkit/"
      },
      {
        "label": "Apple: Personvern og Stedstjenester",
        "url": "https://support.apple.com/en-us/102515"
      }
    ],
    "comparison": {
      "heading": "En praktisk sjekk før en utendørshendelse",
      "columns": [
        "Sjekk",
        "Eksempel",
        "Beslutning"
      ],
      "rows": [
        {
          "cells": [
            "Sted",
            "Hendelsen er i en annen by.",
            "Velg den destinasjonen i værvisningen og les navnet på stedet."
          ]
        },
        {
          "cells": [
            "Tidsrom",
            "Aktiviteten varer fra 14:00 til 16:00.",
            "Sjekk begge timene, pluss relevant forberedelse eller reise."
          ]
        },
        {
          "cells": [
            "Dekning",
            "Bare noen av timene du trenger, er tilgjengelige.",
            "Hold planen foreløpig og avtal en ny sjekk."
          ]
        },
        {
          "cells": [
            "Lagret hendelse",
            "Du starter et utkast fra en værtime.",
            "Gå gjennom dato, tidssone, varighet og målkonto for kalenderen før du lagrer."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-right",
      "week-left"
    ],
    "galleryCaption": "Vær- og ukevisningene viser ulike deler av den samme planleggingsoppgaven. Bekreft varslingsstedet separat fra stedet for hendelsen.",
    "actionHeading": "Sjekk værmeldingen opp mot de faktiske hendelsene dine",
    "actionText": "Bruk Cloud Calendars på iPhone eller iPad for å se tilgjengelig værmelding og timeplanen din. Været informerer valget ditt; det flytter ikke automatisk en hendelse eller bekrefter en endring med deltakerne.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Forstå kalender- og værvisningene"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Velg en rask oversikt på Hjem-skjermen"
      },
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Sjekk kalenderne bak timeplanen din"
      }
    ]
  },
  "the-widget-that-shows-what-is-next": {
    "updated": "2026-10-23",
    "title": "Kalenderwidgeter på iPhone og iPad: kommende hendelser og vær",
    "short": "Kommende hendelser på Hjem-skjermen",
    "description": "Velg en widget i Cloud Calendars for kommende hendelser, datoen eller været.",
    "lede": "Velg Calendar Events eller Calendar Events Large når du vil ha kommende hendelser på Hjem-skjermen. Velg Calendar & Weather for en visning av dato og vær. Disse oppsettene svarer på ulike spørsmål; forhåndsvis det som tilbys på enheten din før du legger det til. Denne veiledningen er publisert av Arte Soft, utvikleren av Cloud Calendars.",
    "sections": [
      {
        "heading": "Velg først hendelsesoppsettet",
        "body": [
          "I widgetgalleriet i Cloud Calendars er Calendar Events det mellomstore oppsettet for hendelseslister. Calendar Events Large gir mer plass til kommende hendelser. Calendar & Weather er et eget oppsett for dato og vær; den lille størrelsen lover ikke en rad for neste hendelse. Navn kan vises oversatt på enheten din.",
          "På iPhone holder du inne et tomt område på Hjem-skjermen, velger Rediger og Legg til widget, finner deretter Cloud Calendars og velger ønsket oppsett. Sammenlign forhåndsvisningen før du legger den til. Apples widgetveiledning gjelder dette systemgalleriet; det er atskilt fra kalendervisningene inne i appen."
        ]
      },
      {
        "heading": "Legg til og kontroller widgeten på iPad",
        "body": [
          "På iPad bruker du Apples widgetgalleri på Hjem-skjermen: Hold inne bakgrunnen, åpne Rediger og deretter Legg til widget. Søk etter Cloud Calendars, se gjennom stilene og størrelsene som tilbys, legg til oppsettet du trenger, plasser det og avslutt med Ferdig. Følg kontrollene som vises i din versjon av iPadOS; en forhåndsvisning bekrefter ikke at kalenderdataene dine er lastet inn.",
          "Velg Calendar Events eller Calendar Events Large når du trenger hendelser. Sammenlign stilene som tilbys av den installerte appen; en rute med dato og vær svarer på noe annet enn en hendelsesliste.",
          "Åpne Cloud Calendars på den iPaden og finn en kjent fremtidig hendelse med klokkeslett i en valgt kalender. At visningen er riktig på iPhone, bekrefter ikke iPadens kontoer, tilgang eller innlastede data. Sammenlign tittel, dato og starttid, og fortsett deretter med kontrollene av kvalifisering og oppdatering nedenfor hvis widgeten avviker."
        ]
      },
      {
        "heading": "Kontroller hva som regnes som kommende",
        "body": [
          "Hendelsesvisningen bruker valgte kalendere og fremtidige hendelser med klokkeslett. Heldagsoppføringer og hendelser der starttiden allerede har passert, er utelatt fra denne kommende-listen. En bursdag eller et møte som allerede pågår, kan derfor være synlig i appen uten å vises her.",
          "Hvis den eneste oppføringen din i dag for eksempel er en heldagsmerknad om reise, betyr ikke en tom kommende-liste at reiseoppføringen er borte. Åpne appen for å se hele dagen. På samme måte kan neste hendelse med klokkeslett være i morgen eller senere; les datoen i stedet for å anta at hver rad gjelder i dag."
        ]
      },
      {
        "heading": "Skill mellom en manglende hendelse og en liste som har gått tom for rader",
        "body": [
          "En widget viser et begrenset antall kommende hendelser. Hvis tidligere hendelser fyller radene, kan en senere hendelse mangle selv om den finnes i appen og kvalifiserer for kommende-listen. Et større hendelsesoppsett kan vise flere rader; det er fortsatt ikke hele kalenderen.",
          "Begynn med den nærmeste fremtidige hendelsen med klokkeslett i en valgt kalender. Hvis den vises, men en senere ikke gjør det, åpner du appen for å se resten av planen. Hvis også den nærmeste kvalifiserte hendelsen mangler, fortsetter du med kontroller av kalendervalg, tilgang og oppdatering. Ikke flytt eller slett hendelser bare for å få en senere oppføring til å vises."
        ]
      },
      {
        "heading": "La appen være første sammenligningspunkt",
        "body": [
          "Åpne Cloud Calendars og finn én bestemt fremtidig hendelse med klokkeslett. Bekreft at kalenderen den tilhører er valgt, og at appen har kalendertilgangen den trenger. Sammenlign tittel, dato og starttid med widgeten. Hvis hendelsen også mangler i appen, må du først undersøke konto eller synkronisering.",
          "Bruk en ufarlig testhendelse i en kalender du eier hvis du trenger et tydelig eksempel. Gi den en fremtidig starttid og en lett gjenkjennelig tittel. Unngå å endre en ekte invitasjon eller fjerne kontoer bare for å teste Hjem-skjermen."
        ]
      },
      {
        "heading": "Ta høyde for oppdateringer uten å anta en fast frist",
        "body": [
          "Widgeter viser lagret informasjon og kjører ikke kontinuerlig slik en åpen app gjør. Apple styrer når de oppdateres. Å åpne appen og kontrollere hendelsen gir deg et ferskt sammenligningsgrunnlag, men det fastslår ikke et eksakt antall sekunder før widgeten må endres.",
          "Hvis appen forblir korrekt mens widgeten fortsatt er feil, noter oppsettet, valgt kalender, hendelsestidspunkt og app-/iOS-versjoner. En tom liste, en gammel hendelse og et feil klokkeslett er ulike observasjoner; oppgi hvilken du ser."
        ]
      },
      {
        "heading": "Les været som en egen oppsummering",
        "body": [
          "Været ved siden av datoen er ikke en prognose knyttet til hvert enkelt hendelsessted og starttidspunkt. Før en utendørshendelse åpner du værvisningen og kontrollerer ønsket sted og klokkeslett. Et ikon for gjeldende forhold kan ikke fastslå hvilke forhold som vil gjelde for et senere møte.",
          "Behold denne widgeten for rask orientering. Bruk den fullstendige kalenderen for heldagsforpliktelser, hendelsesdetaljer og avgjørelser som krever hele planen."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Velg Calendar Events eller Calendar Events Large for en hendelsesliste.",
      "Bekreft en fremtidig hendelse med klokkeslett i en valgt kalender.",
      "Sammenlign dato og klokkeslett i appen før du feilsøker widgeten.",
      "Noter vedvarende avvik i stedet for å slette kalenderdata."
    ],
    "faq": [
      {
        "q": "Hvorfor mangler bursdagen min?",
        "a": "Kommende-listen utelater heldagshendelser. Sjekk hele kalenderen for bursdager og andre oppføringer som bare har dato."
      },
      {
        "q": "Viser den lille widgeten neste møte?",
        "a": "Det lille oppsettet Calendar & Weather viser dato og vær. Velg et oppsett med hendelsesliste for hendelser."
      },
      {
        "q": "Betyr ingen kommende hendelse at jeg er ledig i dag?",
        "a": "Nei. Heldagsoppføringer, pågående hendelser, ikke-valgte kalendere og utdatert informasjon kan endre den konklusjonen."
      }
    ],
    "sourcesHeading": "Kilder og Apple-veiledning",
    "sources": [
      {
        "label": "Apple: Legg til og rediger widgeter på iPhone",
        "url": "https://support.apple.com/118610"
      },
      {
        "label": "Apple: Holde en widget oppdatert",
        "url": "https://developer.apple.com/documentation/widgetkit/keeping-a-widget-up-to-date"
      },
      {
        "label": "Apple: Legg til, rediger og fjern widgeter på iPad",
        "url": "https://support.apple.com/guide/ipad/add-edit-and-remove-widgets-ipadb0de8630/ipados"
      }
    ],
    "seeAlso": [
      "choosing-a-widget-size",
      "a-countdown-to-your-next-meeting",
      "calendar-on-apple-watch"
    ],
    "comparison": {
      "heading": "Velg visningen du faktisk trenger",
      "columns": [
        "Visning",
        "Bruk den til",
        "Kontroller før du stoler på den"
      ],
      "rows": [
        {
          "cells": [
            "Calendar Events",
            "En kompakt visning av kommende hendelser med klokkeslett.",
            "Hendelsen tilhører en valgt kalender og har ikke startet."
          ]
        },
        {
          "cells": [
            "Calendar Events Large",
            "Mer plass til kommende hendelser.",
            "Et større oppsett har fortsatt et begrenset antall rader."
          ]
        },
        {
          "cells": [
            "Calendar & Weather",
            "En rask oversikt over dato og vær.",
            "Det lille oppsettet lover ikke en rad for kommende hendelser."
          ]
        },
        {
          "cells": [
            "Live Activity",
            "En egen nedtelling til neste hendelse på støttede iPhone-flater.",
            "Det er ikke en widget for Hjem-skjermen eller et eget widgetoppsett for låseskjermen."
          ]
        }
      ]
    },
    "galleryKinds": [
      "widgets",
      "live"
    ],
    "galleryCaption": "Widgetene på Hjem-skjermen og Live Activity er separate visninger. Velg oppsettet som passer informasjonen du trenger.",
    "actionHeading": "Få den nyttige delen av planen din på Hjem-skjermen",
    "actionText": "Åpne Cloud Calendars, kontroller en kjent fremtidig hendelse med klokkeslett, og legg deretter til riktig widget på iPhone eller iPad. Appen er fortsatt stedet der du ser hele kalenderen.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Se vær ved siden av planen din"
      },
      {
        "slug": "forecast-beside-every-event",
        "label": "Kontroller klokkeslettene for en utendørshendelse"
      },
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Kontroller de tilkoblede kalenderkontoene dine"
      }
    ]
  },
  "onecal-alternative-iphone-calendar-view-or-sync": {
    "updated": "2026-10-23",
    "title": "Cloud Calendars eller OneCal? Velg samlet visning eller kalendersynkronisering",
    "short": "Cloud Calendars og OneCal etter arbeidsflyt",
    "description": "Sammenlign OneCal og Cloud Calendars etter visninger, kopierte hendelser, mobilkontroller og abonnementer.",
    "lede": "Velg ut fra resultatet du trenger: å se flere planer samlet, redigere en opprinnelig hendelse eller kopiere opptattid til en annen konto. Cloud Calendars tilbyr planleggingsvisninger på iPhone og iPad; OneCal dokumenterer en Unified Calendar View og separate regler for Calendar Sync. Denne sammenligningen er publisert av Arte Soft, utvikleren av Cloud Calendars.",
    "commonBelief": "To produkter som viser Google-, iCloud- og Outlook-kalendere holder nødvendigvis tilgjengelighet, hendelsesredigeringer og kopier synkronisert på samme måte.",
    "sections": [
      {
        "heading": "Velg mellom oversikt og en endring i en annen konto",
        "body": [
          "Hvis målet ditt er å se en privat avtale ved siden av et jobbmøte, trenger du en samlet visning. Hvis jobbkontoens kalender også må inneholde en opptattblokk for den private avtalen, trenger du en definert arbeidsflyt fra kilde til mål. Det første resultatet etablerer ikke det andre.",
          "Cloud Calendars samler valgte kalendere i en planleggingsvisning på iPhone og iPad. OneCal dokumenterer en Unified Calendar View separat fra Calendar Sync; utgiveren sier at du kan bruke den visningen uten å konfigurere synkroniseringsregler. Bestem hvilket resultat som betyr mest før du kobler til kontoer eller sammenligner abonnementsnavn."
        ]
      },
      {
        "heading": "Forstå hva en kopiert hendelse kan endre",
        "body": [
          "OneCal sin dokumentasjon for Calendar Sync beskriver enveis- og flerveisregler som oppretter klonede hendelser. Den separate veiledningen om dekning sier at redigeringer av en klone ikke overføres tilbake til originalen. Identifiser originalen og kalenderen som eier den før du behandler en kopiert avtale som stedet der du skal flytte et møte.",
          "Leverandørtilkoblinger i Cloud Calendars kan også opprette speilede kalendere i iOS-lageret. En samlet visning beviser ikke at oppføringer er slått sammen eller at en redigering nådde leverandøren. For en kalender du eier og kan redigere, bør du sjekke en ufarlig testhendelse uten gjester hos leverandøren så vel som i appen."
        ]
      },
      {
        "heading": "Kontroller kontrollene på enheten du faktisk skal bruke",
        "body": [
          "OneCal sin nåværende mobilveiledning beskriver oppretting og redigering av kalenderhendelser, valg for gjentakelse, RSVP og det å bli med i møter. Den sier også separat at oppretting, redigering, pausing eller sletting av Calendar Sync-konfigurasjoner skjer i nettappen; på mobil vises disse konfigurasjonene. Oppsett av bookinglenker beskrives også som en oppgave på nett.",
          "Cloud Calendars er en app for iPhone og iPad med dag-, uke-, måned-, år- og listevisning. Prøv redigeringen du trenger i visningen du har installert, les eventuelle valg for gjentakelse, og bekreft den lagrede hendelsen. Ikke anta at en annen apps mobilmeny, bookingflyt eller automatiseringskontroller finnes her."
        ]
      },
      {
        "heading": "Bekreft dekning i stedet for å anta ubegrenset historikk",
        "body": [
          "OneCal sin nåværende dekningsveiledning oppgir et framtidig synkroniseringsvindu på opptil ett år for Google og iCloud og opptil tre måneder for Outlook. Den skiller også mellom framtidige gjentakende serier og frittstående historiske hendelser. Dette er begrensninger dokumentert av utgiveren, ikke en test av akkurat din konto eller en påstand om alle funksjoner i kalendervisningen.",
          "Cloud Calendars krever også at du kontrollerer kontometoden, valgte kalendere og relevante datoer. Hvis gamle møter er viktige, sammenlign en identifisert hendelse hos leverandøren og i appen. En kalenderapp er ikke automatisk en fullstendig sikkerhetskopi eller en garanti for at alle tidligere oppføringer er hentet inn."
        ]
      },
      {
        "heading": "Sammenlign abonnementsbehov og faktureringsmåte",
        "body": [
          "Cloud Calendars inkluderer Google Calendar-synkronisering i Base; Advanced fjerner annonser, og Premium legger til støtte for Microsoft Calendar og Teams. Bekreft kontotillatelser separat fra abonnementet. Sjekk gjeldende lokal pris og faktureringsperiode før kjøp, i stedet for å bruke en fast internasjonal prissammenligning.",
          "OneCal sin veiledning for abonnementer på nett beskriver planer per medlem og en prøveperiode på fjorten dager, inkludert fjerning av kloner når prøveperioden utløper. Veiledningen for mobilfakturering beskriver kjøp administrert av butikkene og begrensninger for å legge til teammedlemmer. Sjekk hvilke funksjoner som krever et løpende abonnement og hvor kjøpet administreres; en gratis nedlasting alene svarer ikke på dette."
        ]
      },
      {
        "heading": "Test den faktiske planleggingsflyten din før du bytter",
        "body": [
          "Hvis vær, widgeter eller en Live Activity er viktige, ta dem med i utprøvingen på enheten du bruker. Cloud Calendars tilbyr disse planleggingsflatene, med vær begrenset til tilgjengelige datoer og det valgte stedet. OneCal-sidene som er gjennomgått her, fastslår ikke funksjonslikhet for disse flatene; sjekk gjeldende produkt i stedet for å tolke fravær ut fra en veiledning.",
          "Behold de opprinnelige appene og tilkoblingsdetaljene til du har kontrollert resultatet du trenger. Noter om du verifiserte synlighet, redigering av originalhendelse, kopiert opptattid eller en påminnelse; dette er ulike resultater. Før du kobler fra en tjeneste, gå gjennom hva som skjer med eksisterende kopier, og unngå å eksperimentere med en aktiv invitasjon eller et ekte kundemøte."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Skriv ned om du trenger en samlet visning eller hendelser kopiert til en annen konto.",
      "Identifiser originaler, kopier og kontoen som eier hver viktige hendelse.",
      "Kontroller de nødvendige kontrollene i den faktiske arbeidsflyten på telefon, nettbrett eller nett.",
      "Sammenlign én vanlig uke og eventuelle historiske datoer du er avhengig av.",
      "Sjekk gjeldende abonnementsbehov, lokal pris og kjøpsleverandør.",
      "Bekreft en ufarlig testhendelse og gå gjennom regler for fjerning av kopier før du bytter."
    ],
    "faq": [
      {
        "q": "Er en samlet kalendervisning det samme som å synkronisere opptattid?",
        "a": "Nei. En samlet visning lar deg sammenligne avtaler. Å opprette en oppføring i en annen konto krever en separat støttet arbeidsflyt; OneCal dokumenterer regler for Calendar Sync separat fra sin Unified Calendar View."
      },
      {
        "q": "Kan jeg endre en OneCal-klone for å flytte det opprinnelige møtet?",
        "a": "Dets dekningsveiledning sier at endringer i kloner ikke overføres til originalen. Identifiser den opprinnelige hendelsen og følg redigerings- og arrangørtillatelsene i den kalenderen."
      },
      {
        "q": "Hvilken app er billigst for mitt oppsett?",
        "a": "Det avhenger av funksjonene, kontoene, faktureringsmåten og den lokale prisen du trenger. Cloud Calendars inkluderer Google-synkronisering i Base og støtte for Microsoft i Premium. Gå gjennom OneCal sine gjeldende abonnements- og mobilfaktureringsvilkår for den planlagte arbeidsflyten; denne veiledningen hevder ikke at én pris er best for alle."
      }
    ],
    "sourcesHeading": "OneCal sin offisielle dokumentasjon for arbeidsflyt og abonnementer",
    "sources": [
      {
        "label": "OneCal: mobilfunksjoner og oppgaver som bare kan konfigureres på nett",
        "url": "https://docs.onecal.io/docs/mobile-apps"
      },
      {
        "label": "OneCal: Calendar Sync og regler fra kilde til mål",
        "url": "https://docs.onecal.io/docs/calendar-sync/calendar-sync-intro"
      },
      {
        "label": "OneCal: synkroniseringsvinduer og redigeringer av klonede hendelser",
        "url": "https://docs.onecal.io/docs/calendar-sync/what-does-onecal-sync"
      },
      {
        "label": "OneCal: abonnementer, prøveperiode og hva som skjer ved utløp",
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
      "heading": "Sammenlign arbeidsflyten før abonnementet",
      "columns": [
        "Spørsmål",
        "Cloud Calendars",
        "OneCal-dokumentasjon"
      ],
      "rows": [
        {
          "cells": [
            "Hvor gjennomgår jeg planen min?",
            "På iPhone og iPad, med dag-, uke-, måned-, år- og listevisning.",
            "Unified Calendar View er separat fra konfigurering av Calendar Sync."
          ]
        },
        {
          "cells": [
            "Trenger jeg opptattblokker kopiert mellom kontoer?",
            "Ikke utled det fra den samlede visningen; leverandørtilkoblinger kan speile kalendere lokalt.",
            "Calendar Sync oppretter klonede hendelser ved hjelp av enveis- eller flerveisregler."
          ]
        },
        {
          "cells": [
            "Hvor endrer jeg synkroniseringsregler?",
            "Bruk kontrollene som er dokumentert for appens kontotilkobling.",
            "Den gjennomgåtte mobilveiledningen legger endringer i synkroniseringskonfigurasjon til nettappen."
          ]
        },
        {
          "cells": [
            "Hvilket Cloud Calendars-abonnement trenger jeg?",
            "Base inkluderer Google Calendar-synkronisering; Advanced fjerner annonser; Premium legger til Microsoft Calendar og Teams.",
            "Sjekk gjeldende OneCal-abonnement og faktureringsmåte for arbeidsflyten du trenger."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-left",
      "hook"
    ],
    "galleryCaption": "Ekte kalenderskjermer fra Cloud Calendars viser planleggingsvisningen. Sammenligningen skiller denne visningen fra en tjenestes serverside-regler for kloner.",
    "actionHeading": "Velg resultatet du vil bekrefte",
    "actionText": "For en oversikt på iPhone eller iPad med vær og widgeter kan du prøve Cloud Calendars med en ufarlig testhendelse. Hvis kravet ditt er kopiert opptattid i en annen konto, bør du vurdere en tjeneste som uttrykkelig dokumenterer denne operasjonen.",
    "articleLinks": [
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Sett opp en kombinert kalendervisning"
      },
      {
        "slug": "fantastical-readdle-calendar366-iphone-comparison",
        "label": "Sammenlign andre kalenderalternativer for iPhone"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Velg visning på Hjem-skjermen"
      }
    ]
  },
  "fantastical-readdle-calendar366-iphone-comparison": {
    "updated": "2026-10-23",
    "title": "Kalenderalternativer for iPhone: Cloud Calendars, Fantastical, Readdle og BusyCal",
    "short": "Sammenlign kalenderalternativer for iPhone",
    "description": "Sammenlign kalendere for iPhone etter vær, visninger, oppgaver og arbeidsflyten du trenger.",
    "lede": "Velg kalender etter det du faktisk vil få gjort: se hendelser med vær, legge inn en hendelse raskt, håndtere oppgaver eller kombinere kontovisninger. Cloud Calendars, Fantastical, Calendars by Readdle, Calendar 366 og BusyCal skiller seg fra hverandre i disse arbeidsflytene og i hvilke abonnementer som kreves. Arte Soft utvikler Cloud Calendars og publiserer denne sammenligningen.",
    "sections": [
      {
        "heading": "Velg hva som må fungere før du sammenligner utseende",
        "body": [
          "Skriv ned kalenderleverandørene, enhetene og tre viktige handlinger. Et eksempel kan være: se jobb- og privatkalendere samlet, fullføre en påminnelse og legge til et møte raskt. Test disse handlingene med private eksempeldata før du importerer en hel kalenderplan.",
          "At et produkt støtter navnet på leverandøren din, betyr ikke at alle tilkoblingsmåter har de samme tillatelsene eller funksjonene. En enhetskalender, en konto koblet til direkte og en abonnert feed kan gi oppføringer som ser like ut, men tillate ulike handlinger."
        ]
      },
      {
        "heading": "Bruk leverandørens egen kalender som utgangspunkt",
        "body": [
          "Googles veiledning for å komme i gang beskriver deres egen kalenderflate for planlegging, oppgaver, deling og flere kalendere. Hvis planen din allerede ligger der, bør du teste den nødvendige handlingen i kilden før du avgjør om du trenger en annen app.",
          "Sammenlign for eksempel den samme hendelsen i Google Calendar og Fantastical etter at du har koblet til kontoen du vil bruke. Sjekk om fordelen du trenger, er en kombinert visning, en oppgavekobling, rask registrering eller et bestemt grensesnitt på enheten. En annen kalenderklient er ikke automatisk en overgang til en annen leverandør."
        ]
      },
      {
        "heading": "Fantastical: sjekk kontotilkoblinger og rask registrering",
        "body": [
          "Flexibits dokumenterer både direkte tilkoblinger til kalenderkontoer og alternativer for kalendere og påminnelser som allerede er konfigurert i iOS. Veiledningen deres anbefaler direkte tilkoblinger for full bruk av appens funksjoner. Finn ut hvilken metode du valgte, i stedet for å koble til samme kalender to ganger uten grunn.",
          "Fantastical dokumenterer også setningsbasert registrering og gjenbrukbare maler for hendelser eller oppgaver. Test en tydelig dato, varighet og målkalendar, og kontroller deretter det lagrede resultatet. Syntaksen tilhører Fantastical; tekstfeltet i en annen app kan tolke den samme setningen annerledes."
        ]
      },
      {
        "heading": "Calendars by Readdle: sjekk oppgavekilden",
        "body": [
          "Readdle viser Google-, Outlook- og iCloud-kalendere sammen med funksjoner for oppgaver og registrering med naturlig språk. Veiledningen deres for oppgaveoppsett beskriver valg av iOS Reminders eller Google Tasks i Task Options. Dette valget er viktig hvis fullføring av en oppgave på telefonen må oppdatere en bestemt opprinnelig liste.",
          "Bruk en midlertidig oppgave for å teste fullføring i begge ender, ikke bare om en tittel vises på en tidslinje. Hvis du også trenger en visning eller handling på Mac i tillegg til iPhone, bør du teste det der også. Ikke anta identiske kontroller bare fordi produktnavnet er det samme."
        ]
      },
      {
        "heading": "Calendar 366: sjekk systemtilgang, sett og værposisjon",
        "body": [
          "Dokumentasjonen for Calendar 366 skiller mellom tilgang til systemkalendere og påminnelser og direkte kontointegrasjoner. Den beskriver kalendersett som velger hvilke kalendere og lister som er synlige. Disse settene kan også bestemme standardkalender, så sjekk hvor en nyopprettet hendelse blir lagret.",
          "Den samme dokumentasjonen beskriver også deres egen parser for naturlig språk og vær fra Apple Weather, med valg mellom systemplassering og egendefinert plassering. For planlegging utendørs bør du kontrollere valgt sted i stedet for å anta at værmeldingen følger adressen til hver hendelse. Dette er funksjoner dokumentert av utgiveren, ikke funksjoner testet på kontoen din."
        ]
      },
      {
        "heading": "BusyCal: sjekk oppgavevisning og visningen som brukes for vær",
        "body": [
          "BusyCals oppgaveveiledning for iOS skiller mellom daterte, tidsbestemte og udaterte oppgaver. Den beskriver kontroller for fullføring og hvordan uferdige daterte oppgaver kan flyttes videre. Værveiledningen plasserer værmeldinger i visningene Liste, Dag og Måned, så test den konkrete visningen du bruker i stedet for å anta at vær vises overalt.",
          "BusyCal dokumenterer også registrering med naturlig språk som et alternativ i standardinnstillingene for nye hendelser. Prøv den samme private eksempelavtalen som for de andre appene, og sjekk deretter kalenderen og lagret tidspunkt. Dette er BusyCal-kontroller, ikke kommandoer som deles av alle kalenderapper."
        ]
      },
      {
        "heading": "Sjekk arbeidsflyten på Watch separat fra telefonen",
        "body": [
          "Veiledningen for Fantastical på Watch dokumenterer visningene Up Next, List og Tasks, inkludert fullføring av oppgaver. BusyCals oppgaveveiledning skiller mellom daterte og tidsbestemte oppgaver som vises på Watch, og udaterte oppgaver. Hvis en udatert restliste er viktig, bør du ta den med i utprøvingen i stedet for bare å teste neste hendelse.",
          "En komplikasjon på Watch er en rask oversikt, mens Watch-appen kan tilby flere handlinger. Bekreft dataene og handlingen på den faktiske klokken og telefonen, og sjekk gjeldende abonnement. Grensesnittene på datamaskin, telefon og klokke er ikke utbyttbare bare fordi de bruker samme produktnavn."
        ]
      },
      {
        "heading": "Behandle pris og rettigheter som en egen kontroll",
        "body": [
          "Sjekk den gjeldende lokale kjøpsskjermen, hvilke funksjoner som er tilgjengelige etter at en prøveperiode er slutt, og om et tidligere kjøp endrer rettighetene dine. Gratis nedlasting, et løpende abonnement og et eldre kjøp låser ikke nødvendigvis opp det samme funksjonssettet.",
          "Sider fra utgiveren kan bli oppdatert til ulike tider. Readdles nåværende produkt-FAQ beskriver flere kjernefunksjoner som gratis, mens en egen hjelpeside om gratis versus fullversjon oppgir en annen inndeling. I stedet for å behandle én beskrivelse som et universelt løfte, bør du kontrollere den nødvendige handlingen i den installerte appen og de gjeldende kjøpsvilkårene."
        ]
      },
      {
        "heading": "Hvor Cloud Calendars hører hjemme på kortlisten",
        "body": [
          "Cloud Calendars er et annet alternativ for iPhone og iPad med utvalgte kalendere, flere planleggingsvisninger, vær og widgeter. Google-synkronisering er inkludert i Base, Advanced fjerner annonser og Premium legger til støtte for Microsoft Calendar. Sjekk gjeldende abonnement og leverandørtillatelser for oppsettet ditt.",
          "Hvis en spesialisert oppgavekobling, en malkommando eller en arbeidsflyt på datamaskin er avgjørende, bør du bruke produktet som dokumenterer og faktisk utfører dette kravet. Sammenlign lagrede resultater og daglig innsats; en sjekkliste skal hjelpe deg å velge, ikke antyde at alle funksjonene som er nevnt her, finnes i Cloud Calendars."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Lag en liste over kontoene, enhetene og de viktigste handlingene dine.",
      "Velg én metode for kontotilkobling og kontroller hvilke kalendere den viser.",
      "Test rask registrering og fullføring av oppgaver med ufarlige eksempler.",
      "Bekreft værposisjonen og visningene som brukes på hver enhet.",
      "Sjekk gjeldende kjøpsvilkår etter eventuell prøveperiode eller eldre rettighet."
    ],
    "faq": [
      {
        "q": "Hvilket er det beste alternativet til Fantastical?",
        "a": "Det avhenger av hvilken arbeidsflyt du trenger. Sammenlign kalender- og oppgavekilder, registrering av hendelser, enhetsstøtte og gjeldende rettigheter. Denne veiledningen kårer ingen universell vinner når det gjelder ytelse."
      },
      {
        "q": "Betyr samme leverandørnavn at alle apper synkroniserer likt?",
        "a": "Nei. Sjekk direkte tilkoblinger, enhetskalendere, feeder og tillatelser hver for seg, og bekreft deretter en eksempelendring i kilden."
      },
      {
        "q": "Kan jeg anta at alle annonserte funksjoner er gratis?",
        "a": "Nei. Sjekk den installerte appen, den lokale kjøpsskjermen og hvilke funksjoner som gjenstår etter en prøveperiode. Dokumentasjonen fra utgiveren kan beskrive ulike versjoner eller rettigheter."
      }
    ],
    "sourcesHeading": "Offisiell dokumentasjon kontrollert for denne veiledningen",
    "sources": [
      {
        "label": "Fantastical: metoder for kontotilkobling",
        "url": "https://flexibits.com/fantastical-ios/help/getting-started"
      },
      {
        "label": "Fantastical: registrering med naturlig språk og maler",
        "url": "https://flexibits.com/fantastical-ios/help/adding-events-and-tasks"
      },
      {
        "label": "Readdle: nåværende produktfunksjoner og FAQ",
        "url": "https://readdle.com/calendars"
      },
      {
        "label": "Readdle: velge en oppgavekilde",
        "url": "https://support.readdle.com/calendars/synchronization/how-to-sync-tasks-with-ios-reminders-or-google-tasks"
      },
      {
        "label": "Readdle: egen veiledning for gratis/fullversjon",
        "url": "https://apphelp.readdle.com/en/index.php?id=585&pg=kb.page"
      },
      {
        "label": "Calendar 366: integrasjoner, sett, rask registrering og vær",
        "url": "https://calendar366.com/help/index.html"
      },
      {
        "label": "BusyCal for iOS: oppgaver og begrensninger for oppgaver på Watch",
        "url": "https://www.busymac.com/docs/busycalios/70659-tasks/"
      },
      {
        "label": "BusyCal for iOS: vær og støttede visninger",
        "url": "https://www.busymac.com/docs/busycalios/70665-weather/"
      },
      {
        "label": "BusyCal for iOS: registrering med naturlig språk",
        "url": "https://www.busymac.com/docs/busycalios/70669-natural-language/"
      },
      {
        "label": "Fantastical: visninger og handlinger på Apple Watch",
        "url": "https://flexibits.com/fantastical-ios/help/apple-watch"
      },
      {
        "label": "Google: Calendars eget kontobaserte grensesnitt",
        "url": "https://support.google.com/calendar/answer/2465776?hl=en"
      }
    ],
    "seeAlso": [
      "what-fantastical-costs-and-what-this-does",
      "natural-language-calendar-events-iphone",
      "iphone-calendar-tasks-reminders-versus-event-alerts"
    ],
    "comparison": {
      "heading": "Start med hovedkravet ditt",
      "columns": [
        "Krav",
        "Relevante alternativer å sjekke",
        "Viktig forskjell"
      ],
      "rows": [
        {
          "cells": [
            "Hendelser med vær og visninger på iPhone/iPad",
            "Cloud Calendars og de dokumenterte værvisningene i appene som sammenlignes.",
            "Sjekk sted for værmelding, tilgjengelig periode og visning; værdekningen er ikke ubegrenset."
          ]
        },
        {
          "cells": [
            "Registrering av hendelser med naturlig språk",
            "Fantastical og den relevante funksjonen i Readdle eller BusyCal.",
            "Setningsanalyse er ikke det samme som diktering eller vanlig redigering av hendelser."
          ]
        },
        {
          "cells": [
            "Oppgaver ved siden av hendelser",
            "Den dokumenterte oppgavekilden i Readdle, Calendar 366, BusyCal eller Fantastical.",
            "En påminnelse om en hendelse er ikke det samme som integrasjon for fullføring av oppgaver."
          ]
        },
        {
          "cells": [
            "Synkronisering med Google Calendar og valgfri fjerning av annonser",
            "Cloud Calendars Base inkluderer synkronisering med Google Calendar; Advanced fjerner annonser.",
            "Støtte for Microsoft Calendar og Teams krever Premium."
          ]
        },
        {
          "cells": [
            "En annen kjøpsmodell",
            "Den gjeldende butikksiden og rettighetene for hver app og plattform.",
            "En gratis nedlasting er ikke bevis på at alle funksjoner er gratis; regionale priser og abonnementer kan endres."
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
    "galleryCaption": "Dette er skjermer fra Cloud Calendars for appens visninger, vær og widgeter. De er ikke skjermbilder av de andre produktene i sammenligningen.",
    "actionHeading": "Prøv kalenderen mot ett reelt planleggingsbehov",
    "actionText": "Hvis hovedkravet ditt er en plan på iPhone eller iPad med vær og widgeter, bør du vurdere Cloud Calendars med en midlertidig hendelse. Hold spesialkrav til oppgaver, booking og naturlig språk adskilt når du sammenligner produkter.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Se hvordan vær passer inn i kalenderarbeidsflyten"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Sammenlign widgetene i Cloud Calendars"
      },
      {
        "slug": "onecal-alternative-iphone-calendar-view-or-sync",
        "label": "Skille mellom en kombinert visning og kopiert opptattid"
      }
    ]
  }
};
