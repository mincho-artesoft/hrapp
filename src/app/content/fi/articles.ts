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
  "month-view-on-a-bigger-screen": {
  "updated": "2026-10-22",
  "title": "Kuukausikalenteri iPadilla ja iPhonella: katso päivät, tarkista tiedot",
  "short": "Käytä kuukausinäkymää ohittamatta tietoja",
  "description": "Vertaa päiviä iPadilla tai iPhonella. Tarkista piilotetut tapahtumat, kalenterivalinnat ja ajat ennen jaettujen tai toistuvien tapaamisten siirtoa.",
  "lede": "Kuukausinäkymä näyttää, mille päiville menot osuvat. Se soveltuu huonommin tietyn tunnin vapauden todistamiseen. Valitse päivä yleiskuvasta ja tutki päivä sekä tapahtuma ennen sitoutumista. Oppaan julkaisee Cloud Calendarsin kehittäjä Arte Soft.",
  "commonBelief": "Suurempi kuukausiruudukko näyttää kaikki tiedot, ja tyhjältä vaikuttava päivä todistaa kaikkien olevan vapaita.",
  "sections": [
    {
      "heading": "Päätä, tarvitsetko päiviä vai tarkkoja tunteja",
      "body": [
        "Vertaa kuukaudessa projektin määräaikaa, matkaa ja perhetapaamista usean viikon ajalta. Kun kysymys koskee päällekkäisyyttä klo 14.30, siirry päivä- tai viikkonäkymään ja tarkista tarkka alku ja loppu. Kuukauden solulla ei ole tuntiruudukon aikamittakaavaa.",
        "Työpajan järjestäjä voi ensin välttää matkaviikon. Seuraavaksi tarkistetaan ehdotettu päivä: menot, valmistelu, matka ja tarvittava päättymisaika. Tyhjältä näyttävä solu on tutkittava vaihtoehto, ei vahvistettu varaus tai muiden saatavuustieto."
      ]
    },
    {
      "heading": "Lue lisämäärä, älä laske vain näkyviä nimiä",
      "body": [
        "Cloud Calendarsin nykyinen kuukausisolu näyttää rajallisen määrän tapahtumamerkintöjä ja lisämäärän, jos päivään kuuluu muitakin. Nimet ovat yksirivisiä ja voivat lyhentyä. Avaa päivä tai tapahtuma, kun koko nimi tai muut menot ovat tärkeitä.",
        "Suurempi iPad-näyttö voi helpottaa lukemista poistamatta kaikkia näyttörajoja. Kapea sovellusikkuna tai suurempi teksti muuttaa mahtuvaa sisältöä. Tarkista sama iPhonella: tutki päivä ennen kuin pidät näkyviä merkintöjä koko aikatauluna."
      ]
    },
    {
      "heading": "Tarkista kuukausi, kalenterivalinnat ja viereiset päivät",
      "body": [
        "Lue kuukausi ja vuosi ennen päivän valintaa. Ruudukko voi täydentää rivejä viereisen kuukauden päivillä. Käytä Cloud Calendarsin kuukausinavigointia ja tarkista valittu päivä pelkän ruudun sijainnin sijaan.",
        "Tarkista valitut kalenterit. Työmenojen piilottaminen voi selkeyttää perhesuunnitelmaa, mutta poistaa ne tästä yleiskuvasta. Kaksoiskappaletta selvittäessäsi piilota yksi lähde tilapäisesti ja vertaa; älä poista tapaamista vain väljempää kuukautta varten."
      ]
    },
    {
      "heading": "Avaa tapahtuma ennen yhteisen järjestelyn muuttamista",
      "body": [
        "Varmista tiedoista nimi, omistaja tai kalenteri, paikallinen aika ja kesto. Väri auttaa silmäilyä muttei korvaa tilin tai muokkausoikeuden tuntemista. Näkyvä kutsu eroaa itse järjestämästäsi tapaamisesta.",
        "Cloud Calendarsissa voi siirtää tapahtuman kuukausinäkymässä vetämällä toiseen päivään. Selvitä ennen oikean menon siirtoa tarkoitettu päivä ja toiston muutoslaajuus. Avaa tapahtuma sallitun muutoksen jälkeen; paikallinen ele ei todista palveluntarjoajan tai kaikkien osallistujien hyväksyneen uutta järjestelyä."
      ]
    },
    {
      "heading": "Tarkista toistot ja aikavyöhykkeet erikseen",
      "body": [
        "Jos vain tämän viikon oppitunti siirtyy, älä muuta vahingossa tulevaa rytmiä. Lue tarjottu toiston laajuus ja tarkista sitten muutettu sekä myöhempi kerta. Kuukausi helpottaa vertailua, mutta muokkauslaajuus määrää muutoksen merkityksen.",
        "Matkalla tai aikavyöhykkeiden välisessä kokouksessa tutki paikallinen päivä ja kellonaika erikseen. Siirto toiseen päivään ei automaattisesti muunna aiottua kokousaikaa. Tarkista tarvittaessa kesäajan vaihtuminen ja vahvista sovittu aika asianosaisten kanssa."
      ]
    },
    {
      "heading": "Käytä suurempaa näkymää sekoittamatta tuotteita",
      "body": [
        "Apple Kalenterilla on omat kuukausivaihtoehtonsa, Teamup kuvaa erilaiset selain- ja mobiilinäkymät. Asetukset kuuluvat omiin tuotteisiinsa. Älä etsi Teamupin selainasetuksia tai Applen näkymävalikkoa Cloud Calendarsista vain saman näkymänimen vuoksi.",
        "Kuukausi tapaamisia ei myöskään ole kuukausi sääennusteita. Tarkista ulkosuunnitelmalle paikka, päivä ja saatavilla olevat ennustetunnit erikseen. Tallenna lopullinen tapaaminen oikeaan kalenteriin ja vahvista muutokset suoraan osallistujien kanssa."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Valitse mahdolliset päivät kuukaudessa ja tarkat tunnit päivästä tai viikosta.",
    "Avaa päivät, joissa on lisämäärä tai lyhennettyjä nimiä.",
    "Tarkista kuukausi, vuosi ja kalenterit ennen vapaan päivän olettamista.",
    "Varmista kalenteri, aika, kesto ja muokkausoikeus.",
    "Lue toiston laajuus ja tarkista tallennettu kerta siirron jälkeen.",
    "Tarkista sään saatavuus erikseen ja vahvista muutokset osallistujille."
  ],
  "faq": [
    {
      "q": "Näyttääkö iPadin kuukausi kaikki tapaamiset kokonaan?",
      "a": "Älä oleta niin. Cloud Calendars rajoittaa solun tapahtumamerkintöjä ja käyttää lisämäärää. Avaa päivä ja tapahtuma koko aikataulua varten."
    },
    {
      "q": "Tarkoittaako tyhjä päivä, että olen vapaa?",
      "a": "Tarkista ensin kalenterivalinnat, päivä ja olennaiset tilitiedot. Yleiskuva edustaa vain saatavilla olevia ja näytettyjä tietoja."
    },
    {
      "q": "Muuttaako toistuvan tapahtuman siirto vain tämän päivän?",
      "a": "Lue muokkauslaajuuden valinta. Tarkista tallennuksen jälkeen muutettu ja myöhempi kerta, sitten vahvista tarkoitettu järjestely."
    }
  ],
  "sourcesHeading": "Vertaa virallisia näkymäkuvauksia",
  "sources": [
    {
      "label": "Apple: kuukausi-, monipäivä- ja luettelonäkymät",
      "url": "https://support.apple.com/en-ca/guide/iphone/iphfd1054569/ios"
    },
    {
      "label": "Teamup: näkymät sekä selain- ja sovellusasetukset",
      "url": "https://calendar.teamup.com/kb/how-to-use-calendar-views/"
    }
  ],
  "seeAlso": []
},

  'weather-inside-your-calendar': {
  "updated": "2026-10-22",
  "title": "Kalenteri ja sää iPhonella ja iPadilla: tarkista suunnitelman olosuhteet",
  "short": "Käytä kalenteria ja säätä yhdessä",
  "description": "Käytä kalenteria ja säätä yhdessä iPhonella ja iPadilla. Tarkista paikka, saatavilla olevat ennustetunnit ja tapahtuman tiedot ennen tallennusta.",
  "lede": "Kalenteri kertoo, milloin meno on sovittu. Sää vastaa toiseen kysymykseen: millaisia olosuhteita tarvittavaan paikkaan ja ajanjaksoon ennustetaan? Käytä molempia pitäen paikat ja päivät selvinä. Oppaan julkaisee Cloud Calendarsin kehittäjä Arte Soft.",
  "commonBelief": "Kalenterin vieressä näkyvä sää kuvaa automaattisesti jokaisen tapaamisen osoitetta, jokaista tuntia ja kaikkia tulevia päiviä.",
  "sections": [
    {
      "heading": "Valitse todellinen suunnittelukysymys",
      "body": [
        "Aloita tietystä menosta, kuten iltapäivän puistokäynnistä. Tunnista mahdollinen muutos: aika, paikka, valmistelu tai vaihtoehdon valinta. Koko kalenteria ei tarvitse järjestellä uudelleen vain siksi, että päivän symbolissa on sadetta.",
        "Kirjaa toiminnan todellinen alku ja loppu sekä tarvittaessa valmistelut. Kalenterin yleiskuva auttaa löytämään mahdollisia päiviä, kun taas ennusteen tarkistus koskee tiettyä paikkaa ja aikaväliä. Erota tehtävät vaihtoehtoja verratessasi."
      ]
    },
    {
      "heading": "Varmista sääpaikka ennen arvojen lukemista",
      "body": [
        "Cloud Calendars tarjoaa nykyisen tai valitun paikan sään. Tarkista näkyvä sijainti sen sijaan, että olettaisit tapahtuman osoitteen muuttavan ennustetta huomaamatta. Toisessa kaupungissa oleva meno on verrattava sen kaupungin säähän.",
        "Vierailija voi esimerkiksi suunnitella museolle saapumista puhelimen ollessa vielä kotona. Lue ennusteen sijainti ja tapaamisen paikallinen aika ennen vertailua. Näytöllä vierekkäiset arvot eivät todista aikataulun ja sään koskevan samaa paikkaa."
      ]
    },
    {
      "heading": "Tarkista tunti- ja päiväkattavuus erikseen",
      "body": [
        "Käytä päivätietoa yleiskuvaksi ja saatavilla olevia tuntitietoja päivän osaa koskevaan kysymykseen. Meno kahdesta viiteen vaatii enemmän kuin yhden symbolin vilkaisemisen. Tarkista, että tarvittavat tunnit ovat oikeasti saatavilla.",
        "Nykyisessä sovelluskoodissa päiväluettelo ottaa enintään kymmenen WeatherKitin palauttamaa päivää. Se on erillinen kalenterin navigoinnista ja toimitetuista tunneista. Tuleva tapaaminen ei pidennä sääennustetta. Jos ajanjakso puuttuu, sovi myöhempi säätarkistus."
      ]
    },
    {
      "heading": "Ymmärrä sääarvon merkitys",
      "body": [
        "Apple kuvaa WeatherKitin tietoja kuten lämpötila, sade, tuuli ja UV; osa tuotteista on saatavilla vain tietyillä alueilla. Lue valitsemasi paikan arvot odottamatta kaikkia säätuotteita kaikkialla.",
        "Met Officen ohje osoittaa ennustejakson ja muuttujamääritelmien merkityksen: osa arvoista koskee hetkeä, osa ajanjaksoa. Käytä kyseisen palveluntarjoajan nimikkeitä. Sateen todennäköisyys, määrä ja kesto ovat eri kysymyksiä, eikä yksi luku ratkaise kaikkea ulkotoimintaa."
      ]
    },
    {
      "heading": "Tarkista sääajasta luotu luonnos",
      "body": [
        "Kun sovellus tarjoaa tapahtuman luomista tunnista, se avaa luonnoksen. Nykyinen koodi käyttää sääpaikan aikavyöhykettä, ehdottaa tunnin kestoa ja valitsee uusien tapahtumien oletuskalenterin. Tarkista jokainen arvo ennen tallennusta.",
        "Varmista nimi, kohdekalenteri, alku, loppu ja tarkoitettu paikka. Ennusteen valinta ei anna jaetun kalenterin muokkausoikeutta, ilmoita tilan pitäjälle tai varaa huonetta. Tarkista tallennettu tapahtuma ja hanki suunnitelman vaatimat sopimukset."
      ]
    },
    {
      "heading": "Pidä verkkosivun esittely erillisenä",
      "body": [
        "Sivuston vuorovaikutteinen sääesittely käyttää Open-Meteota. Sovellus käyttää Apple WeatherKitiä. Verkkoesittely auttaa tutustumaan esitystapaan, mutta sen paikka, tiedot ja saatavilla olevat päivät voivat erota sovelluksesta.",
        "Todellista päätöstä varten avaa sovellus ja vertaa suunniteltua menoa saatavilla olevaan ennusteeseen. Jaettua suunnitelmaa muuttaessasi varmista järjestäjä, toiston laajuus ja osallistujat. Pidä sovittu vaihtoehto, jos toiminta riippuu olosuhteista."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Tunnista tapaaminen ja päätös, johon sää voi vaikuttaa.",
    "Varmista sääpaikka sekä tapaamisen paikallinen päivä ja aika.",
    "Tarkista saatavilla olevat tunnit erillään päiväyhteenvedosta.",
    "Lue todennäköisyys, määrä ja muut arvot nimikkeiden mukaan.",
    "Tarkista luonnoksen kaikki tiedot ja kohdekalenteri ennen tallennusta.",
    "Tarkista uudelleen päätöshetkellä ja vahvista yhteiset muutokset suoraan."
  ],
  "faq": [
    {
      "q": "Seuraako kalenterin sää jokaisen tapahtuman osoitetta?",
      "a": "Älä oleta niin. Varmista näkyvä sääpaikka ja vertaa sitä tapahtumapaikkaan; läheisyys näytöllä ei osoita vastaavuutta."
    },
    {
      "q": "Käyttääkö sovellus verkkosivun sääpalvelua?",
      "a": "Ei. Sovellus käyttää Apple WeatherKitiä ja sivuston esittely erikseen Open-Meteota."
    },
    {
      "q": "Tallentaako ennustetunnin valinta tapaamisen automaattisesti?",
      "a": "Se aloittaa luonnoksen siellä, missä toiminto on tarjolla. Tarkista päivä, aikavyöhyke, kesto, kalenteri ja paikka ja tallenna sitten tarkoitettu tapahtuma."
    }
  ],
  "seeAlso": [],
  "sourcesHeading": "Viralliset lähteet ja lisätietoa",
  "sources": [
    {
      "label": "Apple: WeatherKit-ennusteet ja alueellinen saatavuus",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: ennustepaikka, ajanjaksot ja sääarvot",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ]
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
