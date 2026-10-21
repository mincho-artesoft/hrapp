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
    title: 'Jaa yksi tapahtuma, ei kalenteriasi',
    short: 'Jaa yksi tapahtuma',
    description:
      'Miten yhden tapahtuman lähettäminen toimii, mitä vastaanottaja oikeasti saa ja miksi hänen ei tarvitse asentaa mitään nähdäkseen sen.',
    lede: 'Kalenterin jakaminen on yleensä kaikki tai ei mitään: joko jollakulla on pääsy sinun kalenteriisi tai ei ole. Illallisen lähettämisen ei pitäisi vaatia kumpaakaan.',
    commonBelief: 'Että tapahtuman jakaminen tarkoittaa ikkunan antamista muuhun viikkoosi.',
    sections: [
      {
        heading: 'Mitä oikeasti lähtee',
        body: [
          'Tapahtumaa luodessasi sovellus tarjoaa sen jakamista. Matkalle lähtee linkki — sähköpostilla, viestillä, sillä mitä vastaanottajalla on — ja sen linkin takana on kalenterisyöte, joka sisältää tuon tapahtuman eikä mitään muuta.',
          'Se ei ole kuvakaappaus eikä vanhentuva kopio. Jos aika muuttuu, syöte muuttuu sen mukana, ja se, jolle lähetit, näkee muutoksen ilman että lähetät mitään uudelleen.',
        ],
      },
      {
        heading: 'Mitä se ei ole',
        body: [
          'Linkki on aivan tavallinen kalenteritilaus: Applen Kalenteri lukee sen, Google-kalenteri lukee sen, Outlook lukee sen. Viestissä on myös App Clip sille, joka haluaa sovelluksen — se avautuu ilman asennusta. Se on ovi, ei tullipuomi.',
          'Se ei ole välitön: syöte pyytää sovelluksia katsomaan uudelleen tunnin välein, ja se on pyyntö eikä sääntö. Se ei myöskään ole salainen: linkissä on kaksikymmentäkaksi satunnaista merkkiä, joita kukaan ei arvaa, mutta kuka tahansa linkin haltija voi lukea. Ja toistaiseksi se on vain luku.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Tunteja syötteen päivityspyyntöjen välillä',
      linkLength: 'Satunnaisia merkkejä linkissä — juuri se tekee siitä arvaamattoman',
      sharePrice: 'Mitä jakaminen maksaa',
    },
    practical: [
      'Jaa itse tapahtumasta, heti sen luomisen jälkeen.',
      'Lähetä linkki sitä kanavaa pitkin, jota jo käytät tuon henkilön kanssa.',
      'Jos aika muuttuu viime hetkellä, kirjoita sen lisäksi että siirrät tapahtuman.',
      'Peru linkki, kun tapahtuma on ohi, kuten lopettaisit asiakirjan jakamisen.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'weather-inside-your-calendar'],
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
