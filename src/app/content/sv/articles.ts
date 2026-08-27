import { LocalisedArticle } from '../types';

/**
 * The four articles this language carries.
 *
 * Chosen one per intent -- weather, one view, sharing, price -- so the language
 * answers a whole question rather than a quarter of four. The numbers are not
 * here: they live once in article-facts.ts and join the prose by id, so a
 * translation can rewrite every sentence without touching a figure.
 */
export const ARTICLES_SV: Readonly<Record<string, LocalisedArticle>> = {
  'weather-inside-your-calendar': {
    title: 'En kalender som redan har vädret i sig',
    short: 'Vädret inuti kalendern',
    description:
      'Varför två appar för att planera en dag är ett konstruktionsfel, och hur en kalender ser ut där prognosen är en del av vyn i stället för att stå bredvid.',
    lede: 'Nästan alla planerar sin dag mellan två appar. Kalendern säger var man ska vara; väderappen säger hur det är när man kommer dit. Att hålla ihop de två i huvudet är den del ingen märker att de gör — tills en lördag går förlorad.',
    commonBelief:
      'Att en kalender är för åtaganden och en väderapp är för vädret, och att hålla dem åtskilda helt enkelt är så telefoner fungerar.',
    sections: [
      {
        heading: 'Priset för två appar är inte två tryck',
        body: [
          'Att växla kostar ingenting. Det dyra är att de två aldrig är överens om vad som spelar roll. Din kalender vet att lördag klockan elva är två timmar upptagna; väderappen vet att det regnar från tio till ett. Ingen av dem vet att de två fakta tillsammans betyder att blocket måste flyttas.',
          'Integrationslagret är du. Det fungerar tills du har mycket att göra, vilket är precis när det är värt mest att skydda sina planer.',
        ],
      },
      {
        heading: 'Vad som ändras när prognosen ligger i rutnätet',
        body: [
          'Lägg prognosen bakom händelserna så löser konflikten sig själv. En fuktig förmiddag och en torr eftermiddag syns i samma ögonkast som mötet du skulle lägga in, och beslutet slutar kosta tankemöda.',
          'Det här är ingen widget klistrad vid sidan. Varje dag i vecko- och månadsvyn bär sina egna förhållanden, och varje händelse bär prognosen för de timmar den faktiskt upptar — inte dagssammanfattningen, som medelvärdesbildar just den del du behövde.',
        ],
      },
    ],
    claims: {
      forecastDays: 'Dygn prognos, i kalendern och bredvid varje händelse',
      views: 'Vyer som bär vädret: Dag, Vecka, Månad, År och Lista',
      price: 'Vad väderfunktionerna kostar',
    },
    practical: [
      'Titta på bandet bakom dagarna i veckovyn innan du lägger in något utomhus.',
      'Tryck på en händelse för att se prognosen för dess timmar, inte för dess dag.',
      'Lägg väderberoende saker först mot de fjorton dygnen och finjustera två dagar innan.',
      'Behandla allt bortom dag sju som en form, inte som en plan.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'what-a-subscription-actually-buys'],
  },

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google och Outlook i en enda vy',
    short: 'Tre konton, en vy',
    description:
      'Nästan allas liv är uppdelat mellan en privat Apple-kalender, ett Google-konto och ett Exchange från jobbet. Vad som ändras när de hamnar i samma rutnät.',
    lede: 'Problemet är nästan aldrig att någon av kalendrarna är dålig. Det är att du har tre och en enda vecka.',
    commonBelief: 'Att hålla arbete och privatliv i skilda appar är en gräns och inte ett fel.',
    sections: [
      {
        heading: 'Dubbelbokning är strukturell',
        body: [
          'Om dina åtaganden bor på tre ställen kan inget ställe säga om du är ledig. Sammanslagningssteget är du, och du kör det ur minnet, oftast medan någon väntar på svar.',
          'Därför är det klassiska misslyckandet inte att glömma en händelse; det är att tacka ja till något som krockar med en händelse du inte kunde se.',
        ],
      },
      {
        heading: 'Vad ett enda rutnät ger',
        body: [
          'Alla konton i samma vecka, färgade efter ursprung, redigerbara på plats. Du slutar undra vilken app som har svaret, eftersom frågan slutar vara i plural.',
          'iCloud och Google synkar i gratisversionen. Microsoft-konton — Outlook och Exchange — ligger i den betalda, eftersom den anslutningen har en löpande kostnad som de andra inte har.',
        ],
      },
    ],
    claims: {
      accounts: 'Kontotyper som ryms i en vy',
      premiumMonthly: 'Månadskostnad för att lägga till Microsoft, i dollar',
    },
    practical: [
      'Lägg till privatkontot först och sedan det som orsakar krockarna.',
      'Färga per konto och inte per kategori: det är ursprunget du behöver se på en gång.',
      'Fortsätt skriva i den kalender som andra redan läser.',
    ],
    seeAlso: ['weather-inside-your-calendar', 'what-a-subscription-actually-buys'],
  },

  'sharing-one-event-not-your-calendar': {
    title: 'Dela en händelse, inte din kalender',
    short: 'Dela en händelse',
    description:
      'Hur det går till att skicka en enda händelse, vad mottagaren faktiskt får och varför den inte behöver installera något för att se den.',
    lede: 'Att dela en kalender är oftast allt eller inget: antingen har någon tillgång till din eller inte. Att skicka en middag borde inte kräva någotdera.',
    commonBelief: 'Att dela en händelse betyder att ge någon ett fönster mot resten av din vecka.',
    sections: [
      {
        heading: 'Vad som faktiskt skickas',
        body: [
          'När du skapar en händelse erbjuder appen att dela den. Det som färdas är en länk — via e-post, meddelande, vad mottagaren nu har — och bakom länken ligger ett kalenderflöde som innehåller den händelsen och inget annat.',
          'Det är ingen skärmbild och ingen kopia som blir gammal. Ändras tiden ändras flödet med den, och den du skickade till ser ändringen utan att du skickar om något.',
        ],
      },
      {
        heading: 'Vad det inte är',
        body: [
          'Länken är en vanlig kalenderprenumeration: Apples Kalender läser den, Google Kalender läser den, Outlook läser den. I meddelandet följer också ett App Clip med för den som vill ha appen — det öppnas utan installation. Det är en dörr, inte en vägtull.',
          'Det är inte omedelbart: flödet ber apparna titta igen varje timme, och det är en begäran, inte en regel. Det är inte heller hemligt: länken bär tjugotvå slumpmässiga tecken som ingen gissar, men den som har den kan läsa. Och tills vidare är det enbart läsning.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Timmar mellan varje begäran om att uppdatera flödet',
      linkLength: 'Slumpmässiga tecken i länken, vilket är det som gör den ogissbar',
      sharePrice: 'Vad delning kostar',
    },
    practical: [
      'Dela från själva händelsen, direkt efter att du skapat den.',
      'Skicka länken via den kanal du redan använder med personen.',
      'Ändras tiden i sista stund, skriv också och nöj dig inte med att flytta händelsen.',
      'Återkalla länken när händelsen är över, som du skulle sluta dela ett dokument.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'weather-inside-your-calendar'],
  },

  'what-a-subscription-actually-buys': {
    title: 'Vad en prenumeration faktiskt ger',
    short: 'Vad en prenumeration ger',
    description:
      'Två betalnivåer, vad som skiljer dem, och hur du vet vilken — om någon — som är din.',
    lede: 'Två nivåer räcker för förvirring om ingen tydligt säger vad som skiljer dem. Det som skiljer dem är Microsoft.',
    commonBelief: 'Att den högre nivån är samma funktioner fast mer av dem.',
    sections: [
      {
        heading: 'Första nivån tar bort annonserna',
        body: [
          'Den lägger också till hantering av händelser mellan iCloud- och Google-kalendrar, Googles delningsrättigheter, automatiska Meet-länkar och snabbare väderuppdatering. Men man köper den för annonserna.',
          'Till det priset är det ungefär en kaffe om året, och det är nivån som passar nästan alla som över huvud taget vill betala något.',
        ],
      },
      {
        heading: 'Andra nivån är för Microsoft',
        body: [
          'Outlook- och Exchange-synk, Teams-länkar, hantering över konton inklusive jobbet, deltagarhantering. Den kostar en storleksordning mer eftersom anslutningen gör det.',
          'Ligger inte din jobbkalender hos Microsoft finns det inget för dig här. Båda nivåerna är billigare per år; besparingen är måttlig, inte dramatisk. Efter uppsägning står du på gratisnivån med kalendrarna oskadda, eftersom händelserna aldrig var våra.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Första nivån, per månad, i dollar',
      advancedYearly: 'Första nivån, per år, i dollar',
      premiumMonthly: 'Andra nivån, per månad, i dollar',
      premiumYearly: 'Andra nivån, per år, i dollar',
    },
    practical: [
      'Köp första nivån för att ta bort annonser, inte för att låsa upp kalendern.',
      'Köp den andra bara om ditt jobb bor hos Microsoft.',
      'Gå över till årsvis när du är säker; besparingen är verklig men liten.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view'],
  },
};
