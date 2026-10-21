import { LocalisedArticle } from '../types';

/**
 * The four articles this language carries.
 *
 * Chosen one per intent -- weather, one view, sharing, price -- so the language
 * answers a whole question rather than a quarter of four. The numbers are not
 * here: they live once in article-facts.ts and join the prose by id, so a
 * translation can rewrite every sentence without touching a figure.
 */
export const ARTICLES_NL_NL: Readonly<Record<string, LocalisedArticle>> = {
  'weather-inside-your-calendar': {
  "title": "Een agenda waar het weer al in zit",
  "short": "Het weer in de agenda",
  "description": "Waarom twee apps raadplegen om een dag in te delen een ontwerpfout is, en hoe een agenda eruitziet waarin de verwachting deel van de weergave is in plaats van ernaast te staan.",
  "lede": "Bijna iedereen deelt zijn dag in tussen twee apps. De agenda zegt waar u moet zijn; de weer-app zegt wat voor weer het is als u er bent. Die twee in uw hoofd bij elkaar houden is het deel dat niemand merkt te doen — tot een zaterdag in het water valt.",
  "commonBelief": "Dat een agenda voor afspraken is en een weer-app voor het weer, en dat ze gescheiden houden nu eenmaal is hoe telefoons werken.",
  "sections": [
    {
      "heading": "De prijs van twee apps zijn geen twee tikken",
      "body": [
        "Wisselen kost niets. Duur is dat de twee het nooit eens worden over wat telt. Uw agenda weet dat zaterdag om elf uur twee uur bezet is; de weer-app weet dat het van tien tot één regent. Geen van beide weet dat die twee feiten samen betekenen dat het blok moet verschuiven.",
        "U bent de integratielaag. Dat werkt tot u het druk hebt, precies wanneer plannen beschermen het meest waard is."
      ]
    },
    {
      "heading": "De beschikbare voorspelling",
      "body": [
        "Cloud Calendars gebruikt de beschikbare voorspelling voor de gekozen locatie. Uur- en daggegevens kunnen verschillende perioden beslaan.",
        "De datums die je in de agenda kunt bekijken, bepalen niet hoe ver de voorspelling reikt. Een maandweergave betekent geen voorspelling voor de hele maand of elke afspraak."
      ]
    }
  ],
  "claims": {
    "price": "Wat de weerfuncties kosten"
  },
  "practical": [
    "Controleer locatie, datum en beschikbare uren voordat je met de voorspelling plant."
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-a-subscription-actually-buys"
  ],
  "updated": "2026-10-21"
},

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google en Outlook in één weergave',
    short: 'Drie accounts, één weergave',
    description:
      'Het leven van bijna iedereen is verdeeld over een persoonlijke Apple-agenda, een Google-account en een Exchange van het werk. Wat er verandert als ze in hetzelfde raster staan.',
    lede: "Het probleem is bijna nooit dat een van die agenda's slecht is. Het is dat u er drie hebt en één week.",
    commonBelief: 'Dat werk en privé in aparte apps houden een grens is en geen gebrek.',
    sections: [
      {
        heading: 'Dubbel boeken is structureel',
        body: [
          'Als uw afspraken op drie plekken leven, kan geen enkele plek u vertellen of u vrij bent. U bent de samenvoegstap, en die voert u uit uit uw hoofd, meestal terwijl iemand op antwoord wacht.',
          'Daarom is de klassieke misser niet een afspraak vergeten; het is iets toezeggen dat botst met een afspraak die u niet kon zien.',
        ],
      },
      {
        heading: 'Wat één raster oplevert',
        body: [
          'Alle accounts in dezelfde week, gekleurd naar herkomst, ter plekke bewerkbaar. U hoeft zich niet meer af te vragen welke app het antwoord heeft, omdat de vraag niet langer meervoud is.',
          'iCloud en Google synchroniseren in de gratis versie. Microsoft-accounts — Outlook en Exchange — vallen onder betaald, omdat die verbinding terugkerende kosten heeft die de andere niet hebben.',
        ],
      },
    ],
    claims: {
      accounts: 'Soorten accounts die één weergave kan bevatten',
      premiumMonthly: 'Maandprijs om Microsoft toe te voegen, in dollars',
    },
    practical: [
      'Voeg eerst het persoonlijke account toe en daarna dat wat de botsingen veroorzaakt.',
      'Kleur op account en niet op categorie: herkomst is wat u in één oogopslag nodig hebt.',
      'Blijf schrijven in de agenda die anderen al lezen.',
    ],
    seeAlso: ['weather-inside-your-calendar', 'what-a-subscription-actually-buys'],
  },

  'sharing-one-event-not-your-calendar': {
  "updated": "2026-10-21",
  "title": "Eén agenda-afspraak delen: kies de juiste link en toegang",
  "short": "Eén afspraak delen",
  "description": "Deel één afspraak zonder je hele agenda te delen. Begrijp Reader, Writer en Owner, voorvertoningen, updates en de grenzen van het intrekken van toegang.",
  "lede": "Details van een etentje delen, een medeorganisator laten wijzigen en aanwezigheidsreacties verzamelen zijn verschillende taken. Bepaal eerst wat je nodig hebt en kies daarna de deelmethode. Deze gids is geschreven door Arte Soft, de ontwikkelaar van Cloud Calendars.",
  "commonBelief": "Elke afspraaklink zou een alleen-lezen abonnement zijn dat direct wordt bijgewerkt en een reactie vastlegt.",
  "sections": [
    {
      "heading": "Begin met de gegevens van één afspraak",
      "body": [
        "Een gedeelde losse afspraak omvat die afspraak, niet de volledige agenda van de afzender. Controleer vóór verzending de titel, tijdzone, locatie, notities en vergaderlinks. Informatie die voor één gast nuttig is, hoort misschien niet in een breed verspreide link.",
        "Voor het delen van een etentje hoef je de agenda met je medische afspraken niet te delen. De locatie en links van het etentje gaan wel mee. Controleer daarom de afspraak zelf in plaats van op de privacy van de omringende agenda te vertrouwen."
      ]
    },
    {
      "heading": "Kies een voorvertoning, e-mailuitnodiging of QR-code",
      "body": [
        "Cloud Calendars heeft verschillende deelroutes. De App Clip toont een voorvertoning; om via die ervaring de afspraak toe te voegen is de volledige app nodig. E-mail- en QR-uitnodigingen gebruiken een webpagina die Cloud Calendars kan openen. Deze links zijn geen onderling uitwisselbare abonnements-URL’s.",
        "Voor gesynchroniseerd delen meldt de afzender zich aan. Een link of QR-code kan worden doorgestuurd: verspreid die alleen waar de inhoud geschikt is. Een QR-code geeft een link door en bewijst niet wie deze heeft geopend."
      ]
    },
    {
      "heading": "Geef alleen de benodigde toegang",
      "body": [
        "Bij e-mailuitnodigingen kies je Reader, Writer of Owner. Reader kan bekijken en synchroniseren; Writer kan bewerken; Owner kan ook delen en toegang beheren. Dit zijn wezenlijk verschillende rechten. Gebruik Reader als iemand alleen het schema hoeft te zien.",
        "Kies Writer voor een medeorganisator die de afspraak mag wijzigen. Kies Owner alleen als die persoon ook de toegang van anderen moet beheren. Voor uitgebreidere rechten moet de ontvanger met de juiste identiteit zijn aangemeld. Een anonieme ontvanger is geen geïdentificeerde mede-eigenaar."
      ]
    },
    {
      "heading": "Begrijp hoe de ontvanger de afspraak toevoegt",
      "body": [
        "In de volledige app vereist toevoegen toegang tot agenda’s en een beschrijfbare doelagenda. Laat de ontvanger die bestemming controleren voordat die opslaat. De ontvangen kopie kan vervolgens aan de gedeelde afspraak worden gekoppeld voor latere updates.",
        "Dit verschilt van het importeren van een gewoon ICS-bestand in een andere agenda. Importeren maakt een kopie; een abonnement controleert periodiek een feed. Stuur je een ICS-feed in plaats van een app-uitnodiging, leg dat dan uit en controleer of de agenda van de ontvanger dit ondersteunt."
      ]
    },
    {
      "heading": "Controleer wijzigingen voordat je erop vertrouwt",
      "body": [
        "Gesynchroniseerd delen kan latere wijzigingen of annulering overbrengen, maar het apparaat van de ontvanger moet ze kunnen ontvangen. Een verversingsadvies voor een feed is geen bezorgdeadline. Een offline apparaat, niet-ververst abonnement of losse geïmporteerde kopie kan nog oude informatie tonen.",
        "Verandert het etentje vlak voor aanvang, werk dan de afspraak bij en neem rechtstreeks contact op. Vraag de gasten de nieuwe tijd te bevestigen. Een update verzenden en een aanwezigheidsreactie ontvangen zijn afzonderlijke stappen."
      ]
    },
    {
      "heading": "Beheer toegang zonder te beloven dat kopieën verdwijnen",
      "body": [
        "Controleer de rechten van ontvangers en verwijder rechten die niet meer nodig zijn. Een ontvanger verwijderen en een feedlink intrekken zijn verschillende handelingen. Geen van beide mag worden voorgesteld als het op afstand wissen van screenshots, berichten of alle agendakopieën.",
        "Is een link buiten de bedoelde groep verspreid, stel dan vast welke link of toegangstoekenning het betreft. Controleer de betreffende route na de wijziging. Houd bij toekomstige afspraken privégegevens uit breed verspreide links, in plaats van te vertrouwen op later intrekken om die terug te halen."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Controleer de details en bepaal of je bekijken, bewerken of aanwezigheidsreacties nodig hebt.",
    "Kies de bedoelde deelroute en meld je aan waar dat nodig is.",
    "Gebruik Reader voor kijkers; geef Writer of Owner alleen voor de bijbehorende verantwoordelijkheid.",
    "Vraag de ontvanger bij het toevoegen de tijd en doelagenda te controleren.",
    "Werk bij urgente wijzigingen de afspraak bij en stuur een rechtstreeks bericht.",
    "Controleer bij beëindiging van het delen ontvangersrechten en linktoegang afzonderlijk."
  ],
  "faq": [
    {
      "q": "Wordt mijn hele agenda zichtbaar als ik één afspraak deel?",
      "a": "De gesynchroniseerde route voor één afspraak beperkt zich tot die afspraak. De eigen details worden wel via de gekozen route gedeeld. Controleer die details en stuur geen uitnodiging voor de hele agenda als je slechts één afspraak wilt delen."
    },
    {
      "q": "Kan de ontvanger de afspraak wijzigen?",
      "a": "Ja, met de juiste Writer- of Owner-toegang en de ondersteunde aangemelde route. Reader is voor bekijken en synchroniseren. Een gewoon ICS-abonnement is niet hetzelfde bewerkingsmechanisme."
    },
    {
      "q": "Maakt iemand verwijderen alles ongedaan wat die al heeft ontvangen?",
      "a": "Ga niet van die garantie uit. Toegangswijzigingen beïnvloeden de ondersteunde deelrelatie, maar opgeslagen kopieën, screenshots en berichten kunnen blijven bestaan. Een gedeelde feed-URL moet ook afzonderlijk worden beoordeeld."
    }
  ],
  "sourcesHeading": "Bronnen voor de opties van ontvangers",
  "sources": [
    {
      "label": "Apple: overzicht van App Clips",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google: afspraken importeren en beperkingen",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft: een agenda importeren of erop abonneren",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "what-guests-can-do-to-your-event",
    "taking-back-a-calendar-you-shared"
  ]
},

  'what-a-subscription-actually-buys': {
  "updated": "2026-10-21",
  "title": "Wat een abonnement werkelijk oplevert",
  "short": "Wat een abonnement oplevert",
  "description": "Wat een abonnement oplevert: Base, Advanced, Premium.",
  "lede": "Deze gids wordt uitgegeven door Arte Soft, de ontwikkelaar van Cloud Calendars.",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "Base bevat Google Calendar-synchronisatie, Google Meet, agendaweergaven, weer en widgets. Het gratis abonnement kan advertenties tonen."
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Advanced bevat Base en verwijdert advertenties. Premium bevat Advanced en voegt Microsoft Calendar en Microsoft Teams toe.",
        "Een abonnement geeft geen bewerkingsrechten voor andermans agenda’s en omzeilt geen beperkingen van een werkaccount."
      ]
    },
    {
      "heading": "Informatie over aankoop en opzegging",
      "body": [
        "Controleer vóór aankoop de lokale prijs, factureringsperiode en verlengingsvoorwaarden.",
        "Voor een door Apple gefactureerd abonnement open je Instellingen → je naam → Abonnementen. Controleer de status en einddatum. Verlenging opzeggen staat los van het verwijderen van de app of agendagegevens; ga er niet van uit dat betaalde functies na afloop beschikbaar blijven."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Controleer vóór aankoop de lokale prijs, factureringsperiode en verlengingsvoorwaarden.",
    "Een abonnement geeft geen bewerkingsrechten voor andermans agenda’s en omzeilt geen beperkingen van een werkaccount."
  ],
  "faq": [
    {
      "q": "Hoe stop ik de verlenging?",
      "a": "Voor een door Apple gefactureerd abonnement open je Instellingen → je naam → Abonnementen. Controleer de status en einddatum. Verlenging opzeggen staat los van het verwijderen van de app of agendagegevens; ga er niet van uit dat betaalde functies na afloop beschikbaar blijven."
    }
  ],
  "sourcesHeading": "Informatie over aankoop en opzegging",
  "sources": [
    {
      "label": "Apple: Hoe stop ik de verlenging?",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view"
  ]
},
};
