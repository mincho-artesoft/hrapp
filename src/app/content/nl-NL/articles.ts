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
    title: 'Een agenda waar het weer al in zit',
    short: 'Het weer in de agenda',
    description:
      'Waarom twee apps raadplegen om een dag in te delen een ontwerpfout is, en hoe een agenda eruitziet waarin de verwachting deel van de weergave is in plaats van ernaast te staan.',
    lede: 'Bijna iedereen deelt zijn dag in tussen twee apps. De agenda zegt waar u moet zijn; de weer-app zegt wat voor weer het is als u er bent. Die twee in uw hoofd bij elkaar houden is het deel dat niemand merkt te doen — tot een zaterdag in het water valt.',
    commonBelief:
      'Dat een agenda voor afspraken is en een weer-app voor het weer, en dat ze gescheiden houden nu eenmaal is hoe telefoons werken.',
    sections: [
      {
        heading: 'De prijs van twee apps zijn geen twee tikken',
        body: [
          'Wisselen kost niets. Duur is dat de twee het nooit eens worden over wat telt. Uw agenda weet dat zaterdag om elf uur twee uur bezet is; de weer-app weet dat het van tien tot één regent. Geen van beide weet dat die twee feiten samen betekenen dat het blok moet verschuiven.',
          'U bent de integratielaag. Dat werkt tot u het druk hebt, precies wanneer plannen beschermen het meest waard is.',
        ],
      },
      {
        heading: 'Wat er verandert als de verwachting in het raster staat',
        body: [
          'Zet de verwachting achter de afspraken en het conflict lost zichzelf op. Een natte ochtend en een droge middag ziet u in dezelfde oogopslag als de afspraak die u wilde plaatsen, en de beslissing kost geen denkwerk meer.',
          'Dit is geen widget die ernaast geplakt zit. Elke dag in de week- en maandweergave draagt zijn eigen omstandigheden, en elke afspraak draagt de verwachting van de uren die hij werkelijk beslaat — niet de dagsamenvatting, die juist het deel uitmiddelt dat u nodig had.',
        ],
      },
    ],
    claims: {
      forecastDays: 'Dagen verwachting, in de agenda en naast elke afspraak',
      views: 'Weergaven die het weer dragen: Dag, Week, Maand, Jaar en Lijst',
      price: 'Wat de weerfuncties kosten',
    },
    practical: [
      'Kijk naar de band achter de dagen in de weekweergave voordat u iets buiten plant.',
      'Tik op een afspraak om de verwachting van zijn uren te zien, niet die van de dag.',
      'Plaats weersafhankelijke dingen eerst tegen de veertien dagen en verfijn twee dagen van tevoren.',
      'Behandel alles voorbij dag zeven als een vorm, niet als een plan.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'what-a-subscription-actually-buys'],
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
    title: 'Eén afspraak delen, niet uw agenda',
    short: 'Eén afspraak delen',
    description:
      'Hoe het versturen van één afspraak werkt, wat de ander werkelijk krijgt en waarom die niets hoeft te installeren om hem te zien.',
    lede: 'Een agenda delen is meestal alles of niets: iemand heeft toegang tot de uwe of niet. Een etentje versturen zou geen van beide moeten vergen.',
    commonBelief:
      'Dat een afspraak delen betekent dat u iemand een venster op de rest van uw week geeft.',
    sections: [
      {
        heading: 'Wat er werkelijk verstuurd wordt',
        body: [
          'Bij het aanmaken van een afspraak biedt de app aan hem te delen. Wat er reist is een link — per e-mail, per bericht, via wat de ander heeft — en achter die link zit een agendafeed met die ene afspraak en niets anders.',
          'Het is geen schermafbeelding en geen kopie die veroudert. Verandert de tijd, dan verandert de feed mee, en de ontvanger ziet dat zonder dat u iets opnieuw stuurt.',
        ],
      },
      {
        heading: 'Wat het niet is',
        body: [
          'De link is een gewoon agenda-abonnement: Apple Agenda leest hem, Google Agenda leest hem, Outlook leest hem. In het bericht zit ook een App Clip voor wie de app wél wil — die opent zonder installatie. Dat is een deur, geen tolhek.',
          'Het is niet onmiddellijk: de feed vraagt apps elk uur opnieuw te kijken, en dat is een verzoek en geen regel. Het is ook niet geheim: de link draagt tweeëntwintig willekeurige tekens, die niemand raadt, maar wie hem heeft kan meelezen. En het is voorlopig alleen-lezen.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Uren tussen twee verzoeken om de feed te verversen',
      linkLength: 'Willekeurige tekens in de link, wat hem onraadbaar maakt',
      sharePrice: 'Wat delen kost',
    },
    practical: [
      'Deel vanuit de afspraak zelf, meteen na het aanmaken.',
      'Stuur de link via het kanaal dat u al met die persoon gebruikt.',
      'Verandert de tijd op het laatste moment, stuur dan ook een bericht.',
      'Trek de link in als de afspraak voorbij is, zoals u een document niet langer zou delen.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'weather-inside-your-calendar'],
  },

  'what-a-subscription-actually-buys': {
    title: 'Wat een abonnement werkelijk oplevert',
    short: 'Wat een abonnement oplevert',
    description:
      'Twee betaalde versies, wat ze scheidt, en hoe u weet welke — als er één is — de uwe is.',
    lede: 'Twee versies zijn genoeg voor verwarring als niemand duidelijk zegt wat ze scheidt. Wat ze scheidt is Microsoft.',
    commonBelief: 'Dat de duurdere versie dezelfde functies zijn, maar dan meer.',
    sections: [
      {
        heading: 'De eerste versie haalt de advertenties weg',
        body: [
          "Ze voegt ook beheer van afspraken tussen iCloud- en Google-agenda's toe, Google-deelrechten, automatische Meet-links en sneller verversend weer. Maar men koopt haar voor de advertenties.",
          'Tegen deze prijs is dat ongeveer één koffie per jaar, en het is de versie die past bij vrijwel iedereen die iets wil betalen.',
        ],
      },
      {
        heading: 'De tweede versie is voor Microsoft',
        body: [
          'Outlook- en Exchange-synchronisatie, Teams-links, beheer over accounts heen inclusief werk, deelnemersbeheer. Ze kost een orde van grootte meer omdat de verbinding dat ook doet.',
          "Staat uw werkagenda niet bij Microsoft, dan zit er niets voor u in en moet u haar niet kopen. Beide versies zijn per jaar goedkoper; de besparing is bescheiden, niet spectaculair. Na opzeggen staat u op gratis en zijn uw agenda's ongeschonden, want de afspraken waren nooit van ons.",
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Eerste versie, per maand, in dollars',
      advancedYearly: 'Eerste versie, per jaar, in dollars',
      premiumMonthly: 'Tweede versie, per maand, in dollars',
      premiumYearly: 'Tweede versie, per jaar, in dollars',
    },
    practical: [
      'Koop de eerste versie om advertenties weg te halen, niet om de agenda te ontgrendelen.',
      'Koop de tweede alleen als uw werk bij Microsoft leeft.',
      'Ga over op jaarlijks zodra u zeker bent; de besparing is echt maar klein.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view'],
  },
};
