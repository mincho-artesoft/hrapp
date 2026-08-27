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
    title: 'Kalenteri, jossa sää on jo sisällä',
    short: 'Sää kalenterin sisällä',
    description:
      'Miksi kahden sovelluksen katsominen päivän suunnittelemiseksi on suunnitteluvirhe, ja millainen on kalenteri, jossa ennuste on osa näkymää eikä sen vieressä.',
    lede: 'Lähes kaikki suunnittelevat päivänsä kahden sovelluksen välillä. Kalenteri kertoo, missä pitää olla; sääsovellus kertoo, millainen sää siellä on. Näiden kahden pitäminen yhdessä päässä on se osa, jota kukaan ei huomaa tekevänsä — kunnes yksi lauantai menee hukkaan.',
    commonBelief:
      'Että kalenteri on tapaamisia varten ja sääsovellus säätä varten, ja että niiden pitäminen erillään on yksinkertaisesti se, miten puhelimet toimivat.',
    sections: [
      {
        heading: 'Kahden sovelluksen hinta ei ole kaksi napautusta',
        body: [
          'Vaihtaminen ei maksa mitään. Kallista on se, että nämä kaksi eivät koskaan ole yhtä mieltä siitä, mikä on olennaista. Kalenteri tietää, että lauantaina yhdeltätoista on kaksi tuntia varattuna; sääsovellus tietää, että sataa kymmenestä yhteen. Kumpikaan ei tiedä, että nämä kaksi seikkaa yhdessä tarkoittavat, että lohkoa on siirrettävä.',
          'Integraatiokerros olet sinä. Se toimii siihen asti, kunnes sinulla on kiire — eli juuri silloin, kun suunnitelmien suojaaminen on arvokkainta.',
        ],
      },
      {
        heading: 'Mikä muuttuu, kun ennuste on ruudukossa',
        body: [
          'Aseta ennuste tapahtumien taakse, niin ristiriita ratkeaa itsestään. Kostea aamupäivä ja kuiva iltapäivä näkyvät samalla silmäyksellä kuin kokous, jonka olit lisäämässä, ja päätös lakkaa maksamasta ajattelua.',
          'Tämä ei ole sivuun liimattu widget. Jokainen päivä viikko- ja kuukausinäkymässä kantaa omat olosuhteensa, ja jokainen tapahtuma kantaa niiden tuntien ennusteen, jotka se todella vie — ei päiväyhteenvetoa, joka keskiarvoistaa juuri sen osan, jota tarvitsit.',
        ],
      },
    ],
    claims: {
      forecastDays: 'Ennustevuorokausia, kalenterissa ja jokaisen tapahtuman vieressä',
      views: 'Näkymät, joissa sää on mukana: Päivä, Viikko, Kuukausi, Vuosi ja Luettelo',
      price: 'Mitä sääominaisuudet maksavat',
    },
    practical: [
      'Katso päivien takana olevaa nauhaa viikkonäkymässä ennen kuin lisäät mitään ulkona tapahtuvaa.',
      'Napauta tapahtumaa nähdäksesi sen tuntien ennusteen, et sen päivän.',
      'Sijoita säästä riippuvat asiat ensin neljäätoista vuorokautta vasten ja hienosäädä kaksi päivää ennen.',
      'Kohtele kaikkea seitsemännen päivän jälkeen muotona, ei suunnitelmana.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'what-a-subscription-actually-buys'],
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
    title: 'Mitä tilaus oikeasti tuo',
    short: 'Mitä tilaus tuo',
    description:
      'Kaksi maksullista tasoa, mikä ne erottaa, ja miten tiedät kumpi — jos kumpikaan — on sinun.',
    lede: 'Kaksi tasoa riittää sekaannukseen, jos kukaan ei sano selvästi, mikä ne erottaa. Ne erottaa Microsoft.',
    commonBelief: 'Että ylempi taso on samoja ominaisuuksia, vain enemmän.',
    sections: [
      {
        heading: 'Ensimmäinen taso poistaa mainokset',
        body: [
          'Se lisää myös tapahtumien hallinnan iCloud- ja Google-kalentereiden välillä, Googlen jako-oikeudet, automaattiset Meet-linkit ja nopeamman sään päivityksen. Mutta se ostetaan mainosten takia.',
          'Tähän hintaan se on suunnilleen yksi kahvi vuodessa, ja se on taso, joka sopii lähes kaikille, jotka ylipäätään haluavat maksaa jotain.',
        ],
      },
      {
        heading: 'Toinen taso on Microsoftia varten',
        body: [
          'Outlook- ja Exchange-synkronointi, Teams-linkit, hallinta tilien yli mukaan lukien työ, osallistujien hallinta. Se maksaa suuruusluokkaa enemmän, koska yhteyskin maksaa.',
          'Jos työkalenterisi ei ole Microsoftilla, tässä ei ole sinulle mitään. Molemmat tasot ovat halvempia vuodessa; säästö on maltillinen, ei dramaattinen. Irtisanomisen jälkeen olet ilmaistasolla ja kalenterisi ovat ehjät, koska tapahtumat eivät koskaan olleet meidän.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Ensimmäinen taso, kuukaudessa, dollareina',
      advancedYearly: 'Ensimmäinen taso, vuodessa, dollareina',
      premiumMonthly: 'Toinen taso, kuukaudessa, dollareina',
      premiumYearly: 'Toinen taso, vuodessa, dollareina',
    },
    practical: [
      'Osta ensimmäinen taso mainosten poistamiseksi, ei kalenterin avaamiseksi.',
      'Osta toinen vain, jos työsi asuu Microsoftilla.',
      'Siirry vuositilaukseen, kun olet varma; säästö on todellinen mutta pieni.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view'],
  },
};
