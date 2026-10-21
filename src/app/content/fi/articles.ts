import { LocalisedArticle } from '../types';

/**
 * The four articles this language carries.
 *
 * Chosen one per intent -- weather, one view, sharing, price -- so the language
 * answers a whole question rather than a quarter of four. The numbers are not
 * here: they live once in article-facts.ts and join the prose by id, so a
 * translation can rewrite every sentence without touching a figure.
 */
export const ARTICLES_FI: Readonly<Record<string, LocalisedArticle>> = {
  'weather-inside-your-calendar': {
  "title": "Kalenteri, jossa sää on jo sisällä",
  "short": "Sää kalenterin sisällä",
  "description": "Miksi kahden sovelluksen katsominen päivän suunnittelemiseksi on suunnitteluvirhe, ja millainen on kalenteri, jossa ennuste on osa näkymää eikä sen vieressä.",
  "lede": "Lähes kaikki suunnittelevat päivänsä kahden sovelluksen välillä. Kalenteri kertoo, missä pitää olla; sääsovellus kertoo, millainen sää siellä on. Näiden kahden pitäminen yhdessä päässä on se osa, jota kukaan ei huomaa tekevänsä — kunnes yksi lauantai menee hukkaan.",
  "commonBelief": "Että kalenteri on tapaamisia varten ja sääsovellus säätä varten, ja että niiden pitäminen erillään on yksinkertaisesti se, miten puhelimet toimivat.",
  "sections": [
    {
      "heading": "Kahden sovelluksen hinta ei ole kaksi napautusta",
      "body": [
        "Vaihtaminen ei maksa mitään. Kallista on se, että nämä kaksi eivät koskaan ole yhtä mieltä siitä, mikä on olennaista. Kalenteri tietää, että lauantaina yhdeltätoista on kaksi tuntia varattuna; sääsovellus tietää, että sataa kymmenestä yhteen. Kumpikaan ei tiedä, että nämä kaksi seikkaa yhdessä tarkoittavat, että lohkoa on siirrettävä.",
        "Integraatiokerros olet sinä. Se toimii siihen asti, kunnes sinulla on kiire — eli juuri silloin, kun suunnitelmien suojaaminen on arvokkainta."
      ]
    },
    {
      "heading": "Saatavilla oleva ennuste",
      "body": [
        "Cloud Calendars käyttää valitun paikan saatavilla olevaa ennustetta. Tunti- ja päivätiedot voivat kattaa eri ajanjaksoja.",
        "Kalenterissa selattavat päivämäärät eivät määritä ennusteen pituutta. Kuukausinäkymä ei tarkoita ennustetta koko kuukaudelle tai jokaiselle tapahtumalle."
      ]
    }
  ],
  "claims": {
    "price": "Mitä sääominaisuudet maksavat"
  },
  "practical": [
    "Tarkista paikka, päivämäärä ja saatavilla olevat tunnit ennen ennusteeseen perustuvaa suunnittelua."
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-a-subscription-actually-buys"
  ],
  "updated": "2026-10-21"
},

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google ja Outlook yhdessä näkymässä',
    short: 'Kolme tiliä, yksi näkymä',
    description:
      'Lähes jokaisen elämä jakautuu henkilökohtaisen Apple-kalenterin, Google-tilin ja työn Exchangen kesken. Mikä muuttuu, kun ne päätyvät samaan ruudukkoon.',
    lede: 'Ongelma ei lähes koskaan ole se, että jokin näistä kalentereista olisi huono. Ongelma on se, että niitä on kolme ja viikkoja yksi.',
    commonBelief: 'Että työn ja yksityiselämän pitäminen eri sovelluksissa on raja eikä puute.',
    sections: [
      {
        heading: 'Päällekkäinen varaaminen on rakenteellista',
        body: [
          'Jos sitoumuksesi asuvat kolmessa paikassa, mikään paikka ei voi kertoa, oletko vapaa. Yhdistämisvaihe olet sinä, ja suoritat sen muistista, yleensä samalla kun joku odottaa vastausta.',
          'Siksi klassinen epäonnistuminen ei ole tapahtuman unohtaminen; se on suostuminen johonkin, joka törmää tapahtumaan, jota et voinut nähdä.',
        ],
      },
      {
        heading: 'Mitä yksi ruudukko antaa',
        body: [
          'Kaikki tilit samassa viikossa, väritettyinä alkuperän mukaan, muokattavissa paikan päällä. Lakkaat miettimästä, missä sovelluksessa vastaus on, koska kysymys lakkaa olemasta monikossa.',
          'iCloud ja Google synkronoituvat ilmaisversiossa. Microsoft-tilit — Outlook ja Exchange — kuuluvat maksulliseen, koska sillä yhteydellä on toistuva kustannus, jota muilla ei ole.',
        ],
      },
    ],
    claims: {
      accounts: 'Tilityyppejä, jotka mahtuvat yhteen näkymään',
      premiumMonthly: 'Kuukausihinta Microsoftin lisäämisestä, dollareina',
    },
    practical: [
      'Lisää henkilökohtainen tili ensin ja sitten se, joka aiheuttaa törmäykset.',
      'Väritä tilin mukaan äläkä luokan: alkuperä on se, joka pitää nähdä yhdellä silmäyksellä.',
      'Jatka kirjoittamista siihen kalenteriin, jota muut jo lukevat.',
    ],
    seeAlso: ['weather-inside-your-calendar', 'what-a-subscription-actually-buys'],
  },

  'sharing-one-event-not-your-calendar': {
  "updated": "2026-10-21",
  "title": "Yhden tapahtuman jakaminen: linkki ja oikeudet",
  "short": "Yhden tapahtuman jakaminen",
  "description": "Jaa tapahtuma koko kalenterin sijaan. Tutustu Reader-, Writer- ja Owner-oikeuksiin, esikatseluun, päivityksiin ja käyttöoikeuden poistamisen rajoihin.",
  "lede": "Illallisen tietojen lähettäminen, muokkausoikeuden antaminen ja osallistumisvastausten kerääminen ovat eri tehtäviä. Valitse ensin tarkoitus ja sitten jakamistapa. Oppaan on laatinut Cloud Calendarsin kehittäjä Arte Soft.",
  "commonBelief": "Jokainen tapahtumalinkki on vain luettava kalenteritilaus, joka päivittyy heti ja tallentaa vastauksen.",
  "sections": [
    {
      "heading": "Tarkista tapahtuman sisältö",
      "body": [
        "Yksittäisen tapahtuman jakaminen koskee sitä tapahtumaa, ei lähettäjän koko kalenteria. Tarkista otsikko, aikavyöhyke, paikka, muistiinpanot ja kokouslinkit. Yhdelle vieraalle sopivat tiedot eivät välttämättä sovi laajaan jakeluun.",
        "Illallisen jakaminen ei edellytä lääkäriaikojesi kalenterin jakamista. Illallisen paikka ja linkit kuitenkin välittyvät tapahtuman mukana. Tarkista itse sisältö, älä luota ympäröivän kalenterin yksityisyyteen."
      ]
    },
    {
      "heading": "Valitse esikatselu, sähköposti tai QR-koodi",
      "body": [
        "Cloud Calendarsin App Clip näyttää esikatselun. Tapahtuman lisääminen tätä kautta vaatii koko sovelluksen. Sähköposti- ja QR-kutsut avaavat verkkosivun, josta voi avata Cloud Calendarsin. Linkit eivät ole keskenään vaihdettavia tilausosoitteita.",
        "Synkronoitua jakamista varten lähettäjä kirjautuu sisään. Linkin tai QR-koodin voi välittää eteenpäin. QR-koodi välittää linkin mutta ei todista, kuka sen avasi."
      ]
    },
    {
      "heading": "Anna vain tarvittavat oikeudet",
      "body": [
        "Sähköpostikutsussa valitaan Reader, Writer tai Owner. Reader voi katsella ja synkronoida, Writer muokata ja Owner lisäksi jakaa ja hallita käyttöoikeuksia. Aikataulun seuraajalle sopii Reader.",
        "Anna Writer järjestäjälle, jonka pitää muuttaa tapahtumaa. Owner sopii henkilölle, jonka kuuluu hallita muidenkin oikeuksia. Laajemmat oikeudet vaativat oikealla henkilöllisyydellä kirjautumisen. Anonyymi vastaanottaja ei ole tunnistettu yhteisomistaja."
      ]
    },
    {
      "heading": "Selvitä, miten vastaanottaja lisää tapahtuman",
      "body": [
        "Koko sovellus tarvitsee kalenteriluvan ja kohdekalenterin, johon voi kirjoittaa. Vastaanottajan kannattaa tarkistaa kohde ennen tallennusta. Vastaanotettu kopio voidaan yhdistää jaettuun tapahtumaan myöhempiä päivityksiä varten.",
        "Tavallisen ICS-tiedoston tuonti luo kopion, kun taas tilaus tarkistaa syötteen määräajoin. Jos lähetät ICS-syötteen sovelluskutsun sijaan, selitä ero ja varmista vastaanottajan kalenterin tuki."
      ]
    },
    {
      "heading": "Varmista muutosten saapuminen",
      "body": [
        "Synkronoitu jako voi välittää muutoksia ja peruutuksia, mutta laitteen täytyy päästä vastaanottamaan ne. Syötteen päivitysvihje ei ole toimitusaikaraja. Verkkoyhteydetön laite, päivittämätön tilaus tai erillinen tuotu kopio voi näyttää vanhoja tietoja.",
        "Jos illallinen siirtyy juuri ennen alkua, päivitä tapahtuma ja ota vieraisiin suoraan yhteyttä. Pyydä vahvistus uudelle ajalle. Päivityksen vastaanottaminen ei ole osallistumisvahvistus."
      ]
    },
    {
      "heading": "Oikeuksien poisto ei poista kaikkia kopioita",
      "body": [
        "Tarkista vastaanottajat ja poista tarpeettomat oikeudet. Vastaanottajan poistaminen ja syötelinkin peruuttaminen ovat eri toimintoja. Ne eivät takaa kuvakaappausten, viestien tai kaikkien kalenterikopioiden etäpoistoa.",
        "Jos linkki on levinnyt, selvitä mikä linkki tai oikeus on kyseessä ja tarkista tulos muutoksen jälkeen. Jätä yksityiset tiedot pois laajasti jaettavista linkeistä sen sijaan, että luottaisit myöhempään peruuttamiseen."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Tarkista tiedot ja valitse katselu, muokkaus tai osallistumisvastaus.",
    "Valitse jakamistapa ja kirjaudu tarvittaessa.",
    "Anna Reader katseluun ja Writer tai Owner vain vastaavaan vastuuseen.",
    "Pyydä vastaanottajaa tarkistamaan aika ja kohdekalenteri.",
    "Päivitä kiireellinen muutos ja lähetä lisäksi suora viesti.",
    "Tarkista lopuksi vastaanottajien oikeudet ja linkit erikseen."
  ],
  "faq": [
    {
      "q": "Paljastaako tapahtuman jakaminen koko kalenterin?",
      "a": "Yksittäisen tapahtuman synkronoitu jako rajautuu siihen tapahtumaan. Sen omat tiedot kuitenkin näkyvät. Tarkista ne äläkä lähetä koko kalenterin kutsua, jos tarkoitat vain yhtä tapahtumaa."
    },
    {
      "q": "Voiko vastaanottaja muokata tapahtumaa?",
      "a": "Kyllä, sopivilla Writer- tai Owner-oikeuksilla tuetussa kirjautuneessa käytössä. Reader katselee ja synkronoi. Tavallinen ICS-tilaus ei ole sama muokkausmekanismi."
    },
    {
      "q": "Peruuko vastaanottajan poistaminen kaiken jo saadun?",
      "a": "Sitä ei voi luvata. Jakamisoikeus muuttuu, mutta tallennetut kopiot, kuvakaappaukset ja viestit voivat jäädä. Jaetun syötteen osoite on tarkistettava erikseen."
    }
  ],
  "sourcesHeading": "Vastaanottajan vaihtoehtojen lähteet",
  "sources": [
    {
      "label": "Apple: App Clips -yleiskuvaus",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google: tapahtumien tuonti ja rajoitukset",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft: kalenterin tuonti tai tilaaminen",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "taking-back-a-calendar-you-shared"
  ]
},

  'what-a-subscription-actually-buys': {
  "updated": "2026-10-21",
  "title": "Mitä tilaus oikeasti tuo",
  "short": "Mitä tilaus tuo",
  "description": "Mitä tilaus tuo: Base, Advanced, Premium.",
  "lede": "Tämän oppaan julkaisee Cloud Calendarsin kehittäjä Arte Soft.",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "Base sisältää Google Calendar -synkronoinnin, Google Meetin, kalenterinäkymät, sään ja widgetit. Ilmainen paketti voi näyttää mainoksia."
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Advanced sisältää Basen ja poistaa mainokset. Premium sisältää Advancedin sekä Microsoft Calendarin ja Microsoft Teamsin tuen.",
        "Tilaus ei anna muokkausoikeutta muiden kalentereihin eikä ohita työtilin rajoituksia."
      ]
    },
    {
      "heading": "Osto- ja peruutustiedot",
      "body": [
        "Tarkista paikallinen hinta, laskutusjakso ja uusimisehdot ennen ostoa.",
        "Applen laskuttamaa tilausta varten avaa Asetukset → oma nimesi → Tilaukset. Tarkista tila ja päättymispäivä. Uusimisen peruminen on eri asia kuin sovelluksen tai kalenteritietojen poistaminen; älä oleta maksullisten ominaisuuksien toimivan päättymisen jälkeen."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Tarkista paikallinen hinta, laskutusjakso ja uusimisehdot ennen ostoa.",
    "Tilaus ei anna muokkausoikeutta muiden kalentereihin eikä ohita työtilin rajoituksia."
  ],
  "faq": [
    {
      "q": "Miten lopetan uusimisen?",
      "a": "Applen laskuttamaa tilausta varten avaa Asetukset → oma nimesi → Tilaukset. Tarkista tila ja päättymispäivä. Uusimisen peruminen on eri asia kuin sovelluksen tai kalenteritietojen poistaminen; älä oleta maksullisten ominaisuuksien toimivan päättymisen jälkeen."
    }
  ],
  "sourcesHeading": "Osto- ja peruutustiedot",
  "sources": [
    {
      "label": "Apple: Miten lopetan uusimisen?",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view"
  ]
},
};
