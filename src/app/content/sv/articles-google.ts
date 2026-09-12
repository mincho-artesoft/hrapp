import { LocalisedArticle } from '../types';

/** De sex Google-artiklarna: konkreta frågor, raka svar. */
export const GOOGLE_SV: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
    title: 'Vem ser vad när du delar en Google-kalender',
    short: 'Googles delningsnivåer',
    description:
      'Googles delningsnivåer ställs in snabbt och missförstås lätt. Vad var och en faktiskt blottar, i klartext.',
    lede: 'Nästan all oavsiktlig översyn är inte ett omdömesfel. Det är någon som valde en nivå som lät blygsam och inte var det.',
    commonBelief: 'Att «visa endast ledig/upptagen» och «visa alla detaljer» skiljer sig marginellt.',
    sections: [
      {
        heading: 'Nivåerna ligger längre isär än de låter',
        body: [
          'Ledig/upptagen visar block av tid utan titlar. Alla detaljer visar titlar, platser, anteckningar och gäster — för de flesta kalendrar en betydande del av ditt liv.',
          'Göra ändringar låter någon redigera. Hantera delning låter någon lämna vidare din kalender till andra, och det är den som överraskar längre fram.',
        ],
      },
      {
        heading: 'Välja utan att tänka efter varje gång',
        body: [
          'För kollegor som bara behöver planera runt dig är ledig/upptagen nästan alltid rätt svar och nästan aldrig det valda.',
          'Spara fullständiga detaljer till kalendrar som skapats för att delas, inte till den du lever i.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Månadskostnad för nivån där detta hanteras i appen, i dollar',
    },
    practical: [
      'Ledig/upptagen som standard för alla som bara ska boka tid hos dig.',
      'Spara «göra ändringar» till dem som verkligen planerar åt dig.',
      'Gå igenom vilka som har åtkomst två gånger om året; delningar samlas på hög och inget påminner dig.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'what-guests-can-do-to-your-event'],
  },

  'why-a-shared-calendar-does-not-appear': {
    title: 'En kalender delades med dig och den finns inte där',
    short: 'Delad kalender syns inte',
    description:
      'Någon delade en kalender, du accepterade och ingenting hände. De fyra vanliga orsakerna, i den ordning det lönar sig att kolla dem.',
    lede: 'Inbjudan kom, länken trycktes och kalendern saknas fortfarande. Nästan alltid är det en av fyra saker, och ingen av dem är trasig delning.',
    commonBelief: 'Att acceptera en delad kalender lägger den i telefonen.',
    sections: [
      {
        heading: 'Att acceptera lägger den i ett konto, inte i en enhet',
        body: [
          'En delning landar i det Google-konto den adresserades till. Accepterade du inloggad som ett konto medan telefonen bär ett annat ligger kalendern tryggt precis där du inte tittar.',
          'Även i rätt konto anländer en nyss tillagd kalender avstängd på andra enheter oftare än påslagen. Den finns, den är bara inte ikryssad — och en okryssad kalender ser precis ut som en saknad.',
        ],
      },
      {
        heading: 'De två andra orsakerna',
        body: [
          'Delning till en sändlista eller gruppadress når sällan enskilda; det krävs adressen som faktiskt är ett Google-konto. Och en kalender som delas som länk är en prenumeration: den hamnar på ett annat ställe i listan och uppdateras i utgivarens takt i stället för direkt.',
          'På iPhone når Google-kalendrar den inbyggda appen via en egen synklista, och sekundära kalendrar står utanför den som standard. Därför visar ett konto sin huvudkalender och tappar tyst de fyra som betyder något.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Timmar mellan uppdateringsförfrågningar från ett prenumererat flöde',
      accounts: 'Kontotyper som en enda vy håller ihop, utan något av detta',
    },
    practical: [
      'Kolla vilket konto som accepterade delningen innan du kollar något annat.',
      'Öppna kalenderlistan på enheten och leta efter den avstängd snarare än frånvarande.',
      'Kom den som länk, räkna med fördröjning i stället för omedelbar uppdykning.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'google-calendars-that-never-reach-your-iphone'],
  },

  'the-secret-address-of-a-google-calendar': {
    title: 'Vad den hemliga adressen till en Google-kalender verkligen röjer',
    short: 'Den hemliga iCal-adressen',
    description:
      'Google erbjuder en privat adress som visar hela din kalender för den som håller den. Vad den blottar, och varför den inte kan tas tillbaka i tysthet.',
    lede: 'Djupt i inställningarna för varje Google-kalender finns en länk som visar allt på den. Ingen inloggning, ingen behörighet, ingen notering om vem som öppnade den.',
    commonBelief: 'Att en privat adress är privat för att den är svår att hitta.',
    sections: [
      {
        heading: 'En länk är ett lösenord som inte kan bytas för en enda person',
        body: [
          'Den hemliga adressen bär fullständiga detaljer — titlar, tider, platser, anteckningar. Den som har länken ser dem, och det finns ingen lista över vilka det är.',
          'Dess enda skydd är den slumpmässiga delen av adressen. Det är ett äkta skydd mot gissningar och inget alls mot vidarebefordran, en delad skärm eller ett dokument som överlever anställningen.',
        ],
      },
      {
        heading: 'Att återställa den förstör den för alla',
        body: [
          'Du kan återställa adressen, vilket dödar den gamla. Den dör också för varje kollega, varje instrumentpanel och varje skript som tyst lutade sig mot den, utan förvarning till någon av dem.',
          'Det är argumentet för att aldrig dela ut adressen till en kalender du lever i. Publicera en kalender gjord för ändamålet, så kostar återställningen ingenting.',
        ],
      },
    ],
    claims: {
      linkLength: 'Slumptecken som skyddar en delningslänk av vårt slag',
      sharePrice: 'Vad det kostar att dela en händelse från appen',
    },
    practical: [
      'Behandla den hemliga adressen som offentlig i samma stund den lämnar dina händer.',
      'Publicera aldrig adressen till kalendern du faktiskt använder.',
      'Återställ den när någon slutar, och säg till dem det går sönder för.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'taking-back-a-calendar-you-shared'],
  },

  'what-guests-can-do-to-your-event': {
    title: 'Vad dina gäster kan göra med en händelse',
    short: 'Gästernas behörigheter',
    description:
      'Tre kryssrutor avgör om en gäst kan flytta ditt möte, bjuda in främlingar eller läsa hela listan. De står på oftare än folk tror.',
    lede: 'Att bjuda in någon ger mer än en plats och en tid. I en vanlig Google-händelse ser en gäst oftast vilka fler som tillfrågats, och får ofta lägga till fler.',
    commonBelief: 'Att en gäst bara kan tacka ja eller nej.',
    sections: [
      {
        heading: 'De tre rutorna',
        body: [
          'Ändra händelse låter en gäst byta tid, plats och titel för alla. Sällan önskat, lätt kvarlämnat påslaget.',
          'Bjuda in andra låter en gäst lägga till människor du aldrig träffat. Se gästlistan visar alla tillfrågade och hur de svarat — helt i sin ordning i ett team, obekvämt hos en kund, fel i allt som liknar en grupp separata kunder.',
        ],
      },
      {
        heading: 'Där det tyst går fel',
        body: [
          'En händelse, många enskilda mottagare, synlig lista: nu har alla alla. Den enda rutan är skillnaden mellan ett möte och en läckt adressbok.',
          'Inställningarna hör till händelsen, inte till kontot, så de faller tillbaka till dina standardvärden varje gång och måste tänkas igenom på de händelser som betyder något, inte en gång för alla.',
        ],
      },
    ],
    claims: {
      sharePrice: 'Vad det kostar att skicka en enda händelse från appen',
    },
    practical: [
      'Stäng av «se gästlistan» för allt som går till människor som inte känner varandra.',
      'Låt «ändra händelse» vara av om inte någon verkligen planerar åt dig.',
      'Kolla rutorna på händelsen, inte i dina inställningar: där bor de.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'why-a-shared-calendar-does-not-appear'],
  },

  'google-calendars-that-never-reach-your-iphone': {
    title: 'Varför vissa Google-kalendrar aldrig når din iPhone',
    short: 'Google-kalendrar saknas på iPhone',
    description:
      'Ett Google-konto, flera kalendrar och bara en i telefonen. Synklistan som avgör det, och vad man gör i stället.',
    lede: 'Ditt Google-konto rymmer åtta kalendrar. Din iPhone visar två. Ingenting är trasigt: något du aldrig sett har valt åt dig.',
    commonBelief: 'Att lägga till ett Google-konto på iPhone lägger till kalendrarna i det.',
    sections: [
      {
        heading: 'En lista du aldrig fått se',
        body: [
          'Google för en lista per enhet över vilka kalendrar som får synka, och sekundära kalendrar — de delade, de prenumererade, de som någon gjorde för ett projekt — står ofta utanför den.',
          'Listan finns inte i iOS inställningar. Den bor på en egen Google-sida, och därför hittar man inget fel på det självklara stället och ingenting förändras.',
        ],
      },
      {
        heading: 'Den andra vägen',
        body: [
          'En app som talar direkt med Google använder inte den listan, så den visar varje kalender kontot faktiskt har, även dem telefonen tyst lät falla.',
          'Det för också ihop kontona. En vy som rymmer privat, arbete och delat är hela poängen; om telefonen hade synkat var och en upphör att vara en fråga.',
        ],
      },
    ],
    claims: {
      accounts: 'Kontotyper som en enda vy håller ihop',
      price: 'Vad Google-sidan kostar',
    },
    practical: [
      'Kolla Googles synklista innan du utgår från att kontot är trasigt.',
      'Räkna med att prenumererade och delade kalendrar är uteslutna snarare än inkluderade.',
      'Håller du fler än ett par kalendrar, läs dem genom något som frågar Google direkt.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'icloud-google-and-outlook-in-one-view'],
  },

  'taking-back-a-calendar-you-shared': {
    title: 'Ta tillbaka en kalender du delat',
    short: 'Dra tillbaka åtkomst',
    description:
      'Att ta bort någon från en kalender stoppar det som kommer härnäst. Vad det inte gör är att göra ogjort det som redan skett.',
    lede: 'Att avsluta åtkomst är en tryckning. Att avgöra om en tryckning räcker tar något längre, för delning lämnar kopior efter sig.',
    commonBelief: 'Att ta bort en person tar bort det personen sett.',
    sections: [
      {
        heading: 'Vad som upphör och vad som blir kvar',
        body: [
          'Ta bort en person och kalendern försvinner ur dennes lista, omedelbart och utan meddelande. Framtida händelser når aldrig fram.',
          'Det som inte kommer tillbaka: inbjudningar personen redan har, händelser kopierade till den egna kalendern, allt som exporterats, och allt som en hemlig adress lämnats ut för. Åtkomsten slutar; minnet gör det inte.',
        ],
      },
      {
        heading: 'Det som överlever borttagningen',
        body: [
          'Har någon någonsin fått hantera delning kan den ha lagt till andra. Att ta bort personen lämnar dessa kvar — så blir en kalender delad med någon ingen minns att de bjudit in.',
          'Läs alltså hela listan i stället för att stryka ett namn, och gör det på vägen ut snarare än månader senare. Inget påminner dig, och delningar samlas bara på hög.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Månadskostnad för nivån där detta hanteras, i dollar',
    },
    practical: [
      'Läs hela åtkomstlistan, inte bara namnet du tänkte ta bort.',
      'Återställ den hemliga adressen om personen någonsin haft den.',
      'Utgå från att kopior överlever, och flytta det som är verkligt känsligt i stället för att dölja det.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
