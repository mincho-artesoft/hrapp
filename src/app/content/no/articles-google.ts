import { LocalisedArticle } from '../types';

/** De seks Google-artiklene: konkrete spørsmål, klare svar. */
export const GOOGLE_NO: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
    title: 'Hvem ser hva når du deler en Google-kalender',
    short: 'Googles delingsnivåer',
    description:
      'Googles delingsnivåer settes raskt og misforstås lett. Hva hvert nivå faktisk blottlegger, sagt rett fram.',
    lede: 'De færreste tilfeller av for mye deling er en feilvurdering. Det er noen som valgte et nivå som hørtes beskjedent ut og ikke var det.',
    commonBelief: 'At «se bare ledig/opptatt» og «se alle detaljer» ligger nær hverandre.',
    sections: [
      {
        heading: 'Nivåene ligger lenger fra hverandre enn de høres ut',
        body: [
          'Ledig/opptatt viser blokker med tid uten titler. Alle detaljer viser titler, steder, notater og gjester — for de fleste kalendere en betydelig del av livet ditt.',
          'Gjøre endringer gir rett til å redigere. Administrere deling gir rett til å gi kalenderen din videre til andre, og det er nivået som overrasker senere.',
        ],
      },
      {
        heading: 'Å velge uten å tenke over det hver gang',
        body: [
          'For kolleger som bare skal planlegge rundt deg, er ledig/opptatt nesten alltid riktig svar og nesten aldri det valgte.',
          'Spar de fulle detaljene til kalendere laget for å deles, ikke til den du lever i.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Månedspris for nivået der dette styres i appen, i dollar',
    },
    faq: [
      {
        q: 'Ser andre titlene på hendelsene mine hvis jeg bare deler ledig/opptatt?',
        a: 'Nei. Ledig/opptatt viser blokker med tid uten titler, steder, notater eller gjester. Først «alle detaljer» blottlegger dem — og da alle sammen.',
      },
      {
        q: 'Hva gir «gjøre endringer og administrere deling»?',
        a: 'Rett til å redigere hver hendelse og til å gi kalenderen din videre til flere uten å spørre deg. Det er det eneste nivået der noen andre deler ut tilgang.',
      },
      {
        q: 'Kan jeg se hvem som allerede har tilgang til kalenderen min?',
        a: 'Ja, i delingsinnstillingene for den kalenderen. Ingenting ber deg se etter, og delinger bare hoper seg opp: les listen to ganger i året.',
      },
    ],
    practical: [
      'Ledig/opptatt som standard for alle som bare skal booke tid hos deg.',
      'Spar «gjøre endringer» til dem som faktisk planlegger for deg.',
      'Gå gjennom hvem som har tilgang to ganger i året; deling hoper seg opp, og ingenting minner deg på det.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'what-guests-can-do-to-your-event'],
  },

  'why-a-shared-calendar-does-not-appear': {
    title: 'En kalender ble delt med deg, og den er ikke der',
    short: 'Delt kalender dukker ikke opp',
    description:
      'Noen delte en kalender, du takket ja, og ingenting skjedde. De fire vanlige årsakene, i den rekkefølgen det lønner seg å sjekke dem.',
    lede: 'Invitasjonen kom, lenken ble trykket, og kalenderen mangler fortsatt. Nesten alltid er det én av fire ting, og ingen av dem er at delingen er ødelagt.',
    commonBelief: 'At å takke ja til en delt kalender legger den på telefonen.',
    sections: [
      {
        heading: 'Å takke ja legger den til en konto, ikke til en enhet',
        body: [
          'En deling lander i Google-kontoen den var adressert til. Takket du ja innlogget som én konto mens telefonen bærer en annen, ligger kalenderen trygt nøyaktig der du ikke ser.',
          'Selv i riktig konto kommer en nylig lagt til kalender oftere avslått enn påslått på andre enheter. Den finnes, den er bare ikke huket av — og en kalender uten hake ser nøyaktig ut som en som mangler.',
        ],
      },
      {
        heading: 'De to andre årsakene',
        body: [
          'Deling til en e-postliste eller gruppeadresse når sjelden enkeltpersoner; det må være adressen som faktisk er en Google-konto. Og en kalender delt som lenke er et abonnement: den havner et annet sted i listen og oppdateres i utgiverens takt i stedet for straks.',
          'På iPhone når Google-kalendere den innebygde appen gjennom sin egen synkroniseringsliste, og sekundære kalendere står utenfor den som standard. Derfor viser én konto hovedkalenderen og mister stille de fire som betyr noe.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Timer mellom oppdateringsforespørsler fra en abonnert strøm',
      accounts: 'Kontotyper som én visning holder sammen helt uten dette',
    },
    faq: [
      {
        q: 'Jeg takket ja til en delt kalender, men den er ikke på iPhonen. Hvorfor?',
        a: 'Delingen lander i Google-kontoen den var adressert til, og en nylig lagt til kalender kommer som regel avslått til andre enheter. Sjekk kontoen først, og let så etter den uten hake i stedet for som fraværende.',
      },
      {
        q: 'Virker deling til en gruppeadresse?',
        a: 'Sjelden. En e-postliste når knapt menneskene bak den. Det må være adressen som selv er en Google-konto.',
      },
      {
        q: 'Hvor lang tid tar det før en delt kalender dukker opp?',
        a: 'En deling via rettigheter dukker opp så snart listen oppdateres. En kalender delt som lenke er et abonnement og følger utgiverens takt.',
      },
    ],
    practical: [
      'Sjekk hvilken konto som tok imot delingen før du sjekker noe annet.',
      'Åpne kalenderlisten på enheten og se etter den avslått heller enn fraværende.',
      'Kom den som lenke, regn med forsinkelse i stedet for umiddelbar oppdukking.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'google-calendars-that-never-reach-your-iphone'],
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
    title: 'Å ta tilbake en kalender du har delt',
    short: 'Fjerne tilgang',
    description:
      'Å fjerne noen fra en kalender stopper det som kommer etterpå. Det det ikke gjør, er å gjøre om på det som allerede har skjedd.',
    lede: 'Å avslutte tilgang er ett trykk. Å avgjøre om ett trykk holder, tar litt lenger, for deling etterlater kopier.',
    commonBelief: 'At å fjerne en person fjerner det personen har sett.',
    sections: [
      {
        heading: 'Hva som opphører og hva som blir',
        body: [
          'Fjern en person, og kalenderen forsvinner fra listen deres, straks og uten melding. Framtidige hendelser når dem aldri.',
          'Det som ikke kommer tilbake: invitasjoner de allerede har, hendelser kopiert til egen kalender, alt eksportert, og alt det er delt ut en hemmelig adresse til. Tilgangen slutter; hukommelsen gjør det ikke.',
        ],
      },
      {
        heading: 'Det som overlever fjerningen',
        body: [
          'Har noen en gang hatt lov til å administrere deling, kan de ha lagt til andre. Å fjerne dem lar de andre bli stående — slik ender en kalender delt med noen ingen husker å ha invitert.',
          'Les derfor hele listen i stedet for å stryke ett navn, og gjør det på vei ut heller enn måneder senere. Ingenting minner deg på det, og delinger bare hoper seg opp.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Månedspris for nivået der dette styres, i dollar',
    },
    faq: [
      {
        q: 'Sletter det den andre allerede har sett, når jeg fjerner tilgangen?',
        a: 'Nei. Invitasjoner vedkommende allerede har, hendelser kopiert til egen kalender og alt eksportert blir liggende. Tilgangen slutter; kopiene gjør det ikke.',
      },
      {
        q: 'Får personen beskjed om at jeg har fjernet tilgangen?',
        a: 'Nei. Kalenderen forsvinner fra listen med en gang og uten melding.',
      },
      {
        q: 'Hvorfor er kalenderen min delt med noen jeg aldri har invitert?',
        a: 'Noen med rett til å administrere deling la dem til. Å fjerne den personen lar alle vedkommende la til bli stående — derfor leser man hele listen og ikke ett navn.',
      },
    ],
    practical: [
      'Les hele tilgangslisten, ikke bare navnet du mente å fjerne.',
      'Nullstill den hemmelige adressen hvis personen noen gang har hatt den.',
      'Gå ut fra at kopier overlever, og flytt det virkelig følsomme heller enn å skjule det.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
