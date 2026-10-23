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
  "updated": "2026-10-23",
  "title": "Kalenteri säällä iPhonessa ja iPadissa: suunnittele päiväsi yhdellä näkymällä",
  "short": "Käytä kalenteria ja säätä yhdessä",
  "description": "Vertaa kalenteriasi valitun paikan säähän iPhonessa ja iPadissa.",
  "lede": "Cloud Calendars näyttää aikataulusi ja sään samassa iPhone- tai iPad-apissa. Valitse kalenterista päivämäärä ja tarkista säänäkymästä valittu paikka sekä saatavilla olevat ennustetunnit. Ulkoilusuunnitelmissa kannattaa tarkistaa juuri merkityksellinen ajanjakso sen sijaan, että luottaisit päivän yleiseen kuvakkeeseen. Tämän oppaan julkaisee sovelluksen kehittäjä Arte Soft.",
  "commonBelief": "Kalenterin vieressä näkyvä sää kuvaa automaattisesti jokaisen tapahtuman osoitetta, jokaista tuntia ja jokaista tulevaa päivää.",
  "sections": [
    {
      "heading": "Valitse todellinen suunnittelukysymys",
      "body": [
        "Aloita tietystä tapahtumasta, kuten iltapäiväkäynnistä puistossa. Tunnista, mikä voisi muuttua: sen ajankohta, paikka, valmistautuminen tai päätös käyttää vaihtoehtoa. Koko kalenteria ei tarvitse järjestellä uudelleen vain siksi, että päivän symboli näyttää sadetta.",
        "Kirjaa toiminnan todellinen alkamis- ja päättymisaika, mukaan lukien valmistelut, jos se on olennaista. Kalenterin yleisnäkymä auttaa löytämään mahdollisia päiviä, kun taas ennusteen tarkistus koskee tiettyä paikkaa ja aikaväliä. Pidä nämä kaksi tehtävää erillään, kun vertailet vaihtoehtoja."
      ]
    },
    {
      "heading": "Varmista sääsijainti ennen arvojen lukemista",
      "body": [
        "Cloud Calendars näyttää sään nykyiselle tai valitulle paikalle. Tarkista näkyvä sijainti sen sijaan, että olettaisit tapahtuman osoitteen vaihtavan ennusteen huomaamatta. Toisessa kaupungissa oleva tapahtuma täytyy verrata kyseisen kaupungin säähän.",
        "Esimerkiksi kävijä voi suunnitella saapumista museoon, vaikka puhelin on yhä kotona. Tarkista ennusteen sijainti ja tapahtuman paikallinen aika ennen vertailua. Lähekkäin näkyvät arvot eivät todista, että aikataulu ja sää koskevat samaa paikkaa."
      ]
    },
    {
      "heading": "Tarkista tunti- ja päiväkohtainen kattavuus erikseen",
      "body": [
        "Käytä päiväkohtaista tietoa yleiskuvaan ja saatavilla olevia tuntikohtaisia tietoja kysymyksiin, jotka koskevat osaa päivästä. Kello kahdesta viiteen kestävä varaus vaatii enemmän kuin nopean vilkaisun yhteen symboliin. Tarkista, että olennaiset tunnit ovat todella saatavilla.",
        "Sovelluksen nykyisessä lähteessä päivälista sisältää enintään kymmenen WeatherKitin palauttamaa päivää. Tämä on erillinen asia kalenterissa siirtymisestä ja tällä hetkellä tarjolla olevista tunneista. Tuleva tapahtuma ei pidennä sääennusteen kattavuutta. Jos sen ajanjakso puuttuu, sovi uusi sään tarkistus myöhemmäksi."
      ]
    },
    {
      "heading": "Lue, mitä sääarvo tarkoittaa",
      "body": [
        "Apple dokumentoi WeatherKitin tietoja, kuten lämpötilaa, sadetta, tuulta ja UV-arvoja, ja osa tuotteista on saatavilla vain valituilla alueilla. Lue valitsemaasi paikkaa koskevat saatavilla olevat arvot sen sijaan, että odottaisit kaikkia säätuotteita kaikkialle.",
        "Met Officen ohjeistus havainnollistaa, miksi ennustejakson ja muuttujien määritelmät ovat tärkeitä: osa arvoista viittaa hetkeen ja osa ajanjaksoon. Käytä kyseisen palveluntarjoajan nimityksiä. Sateen todennäköisyys, määrä ja kesto ovat eri kysymyksiä, eikä yksi luku ratkaise kaikkia ulkoiluun liittyviä päätöksiä."
      ]
    },
    {
      "heading": "Tarkista sääennustetunnista luotu luonnos",
      "body": [
        "Jos sovellus tarjoaa tapahtuman luomista tunnista, se avaa luonnoksen. Nykyinen lähde käyttää sääsijainnin aikavyöhykettä, ehdottaa yhden tunnin kestoa ja valitsee uusille tapahtumille oletuskalenterin. Tarkista jokainen arvo ennen tallentamista.",
        "Vahvista otsikko, kohdekalenteri, alku, loppu ja tarkoitettu sijainti. Ennusteen valinta ei anna lupaa muokata jaettua kalenteria, ilmoittaa tapahtumapaikalle tai varata huonetta. Tarkista tallennettu tapahtuma ja hanki kaikki suunnitelman vaatimat hyväksynnät."
      ]
    },
    {
      "heading": "Pidä verkkosivuston esittely erillään",
      "body": [
        "Verkkosivuston interaktiivinen sääesittely käyttää Open-Meteo-palvelua. Sovellus käyttää Apple WeatherKitia. Verkkodemosta on hyötyä esitystavan tutkimisessa, mutta sen paikka, tiedot ja saatavilla olevat päivämäärät voivat poiketa sovelluksesta.",
        "Todellista päätöstä varten avaa sovellus ja vertaa suunniteltua tapahtumaa sen saatavilla olevaan ennusteeseen. Jos muutat jaettua suunnitelmaa, varmista järjestäjä, toistuvuuden laajuus ja osallistujat. Pidä sovittu vaihtoehto valmiina, jos toiminta riippuu olosuhteista."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Tunnista tapahtuma ja päätös, johon sää voisi vaikuttaa.",
    "Varmista sääsijainti sekä tapahtuman paikallinen päivämäärä ja aika.",
    "Tarkista saatavilla oleva tuntikohtainen kattavuus erillään päiväyhteenvedosta.",
    "Lue todennäköisyys, määrä ja muut olennaiset arvot niiden nimitysten mukaisesti.",
    "Tarkista kaikki tapahtumaluonnoksen tiedot ja kohdekalenteri ennen tallentamista.",
    "Tarkista tiedot uudelleen päätöshetkellä ja vahvista jaetut muutokset suoraan."
  ],
  "faq": [
    {
      "q": "Seuraako kalenterini vieressä näkyvä sää jokaisen tapahtuman osoitetta?",
      "a": "Älä oleta niin. Varmista näytetty sääsijainti ja vertaa sitä tapahtumapaikkaan; läheisyys näytöllä ei todista niiden vastaavan toisiaan."
    },
    {
      "q": "Käyttääkö sovellus verkkosivuston sääpalveluntarjoajaa?",
      "a": "Ei. Sovellus käyttää Apple WeatherKitia; verkkosivuston esittely käyttää erikseen Open-Meteo-palvelua."
    },
    {
      "q": "Tallentaako ennustetunnin valitseminen tapahtuman automaattisesti?",
      "a": "Se aloittaa luonnoksen, jos tämä toiminto on tarjolla. Tarkista sen päivämäärä, aikavyöhyke, kesto, kalenteri ja sijainti ja tallenna sitten haluamasi tapahtuma."
    }
  ],
  "seeAlso": [
    "weather-calendar-history-versus-forecast-iphone",
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather",
    "weather-where-the-event-is",
    "planning-outdoors-without-being-rained-on"
  ],
  "sourcesHeading": "Viralliset lähteet ja lisälukemista",
  "sources": [
    {
      "label": "Apple: WeatherKitin ennustetiedot ja alueellinen saatavuus",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: ennusteen paikka, jaksot ja sääarvot",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ],
  "comparison": {
    "heading": "Mikä säänäkymä vastaa kysymykseesi?",
    "columns": [
      "Kysymyksesi",
      "Mitä tarkistaa",
      "Mitä se ei osoita"
    ],
    "rows": [
      {
        "cells": [
          "Mitä tänään on tulossa?",
          "Kalenterin päivä- tai viikkonäkymä valitun paikan sään vieressä.",
          "Että jokainen tapahtuman osoite vaihtaa sääsijainnin automaattisesti."
        ]
      },
      {
        "cells": [
          "Voiko sade vaikuttaa iltapäivän tapahtumaani?",
          "Tuntikohtaiset tiedot tapahtumapaikalle ja tapahtuman koko ajanjaksolle.",
          "Että päiväsymboli kuvaa jokaista tuntia."
        ]
      },
      {
        "cells": [
          "Voinko suunnitella ensi kuun sään perusteella?",
          "Kalenterisi nyt, sitten uusi ennusteen tarkistus lähempänä päivämäärää.",
          "Että kalenterissa siirtyminen laajentaa ennusteen kattavuutta."
        ]
      },
      {
        "cells": [
          "Voinko nähdä kotona nopean yleiskuvan?",
          "Sopiva Koti-valikon widgetti.",
          "Että jokainen widgettiasettelu sisältää tapahtumat tai täydellisen ennusteen."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-right",
    "hook"
  ],
  "galleryCaption": "Aidot Cloud Calendars -näkymät: säänäkymä ja päivä, jolla on tapahtumia. Tarkista sovelluksessa valittu paikka ja päivämäärä.",
  "actionHeading": "Suunnittele aikataulun ja ennusteen avulla yhdessä",
  "actionText": "Cloud Calendars on saatavilla iPhonelle ja iPadille. Aloita näkymillä, säällä ja Google Calendar -synkronoinnilla, jotka sisältyvät Baseen; Advanced poistaa mainokset, ja Premium lisää Microsoft Calendar- ja Teams-tuen.",
  "articleLinks": [
    {
      "slug": "forecast-beside-every-event",
      "label": "Tarkista sää tapahtuman tunneille"
    },
    {
      "slug": "the-widget-that-shows-what-is-next",
      "label": "Valitse kalenteri- ja sääwidgetti"
    },
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "Tuo kalenteritilit yhteen näkymään"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
  "updated": "2026-10-23",
  "title": "Näe Google-, iCloud- ja Outlook-kalenterit yhdessä iPhonessa ja iPadissa",
  "short": "Kolme palveluntarjoajaa, yksi näkymä",
  "description": "Yhdistä kalenterinäkymät ja ymmärrä käyttöoikeudet, kopiot ja tilausvaatimukset.",
  "lede": "Jos haluat nähdä työ- ja henkilökohtaiset tapahtumat yhdessä, yhdistä halutut tilit, valitse niiden kalenterit ja tarkista samat tapahtumat yhdessä näkymässä. Cloud Calendars tukee iPhonen ja iPadin suunnittelua iCloudin ja Google Calendarin kanssa; Microsoft Calendar -tuki kuuluu Premiumiin. Tapahtumien katsominen yhdessä on eri asia kuin varattunaolojen kopiointi palveluntarjoajien tilien välillä. Kehittäjä Arte Soft julkaisee tämän oppaan.",
  "commonBelief": "Usean kalenterin lisääminen samaan sovellukseen pitää automaattisesti niiden varattunaolot, jakamisen ja tapahtumakopiot keskenään yhdenmukaisina.",
  "sections": [
    {
      "heading": "Tunnista jokaisen tapahtuman tili ja kalenteri",
      "body": [
        "Aloita yhdellä tavallisella tapahtumalla kustakin palveluntarjoajasta. Kirjaa ylös sisäänkirjautunut sähköpostiosoite, kalenterin nimi ja omistatko tapahtuman vai oletko saanut kutsun. Kaksi kalenteria nimeltä ”Kalenteri” voivat kuulua täysin eri tileille. Väri helpottaa viikon silmäilyä; tili ja kalenteri kertovat, minne muutos kuuluu tehdä.",
        "Esimerkiksi henkilökohtaisen iCloud-kalenterisi hammaslääkäriaika ja Microsoftin projektikokous voivat näkyä sinulle yhdessä. Tämä ei kuitenkaan itsessään tee hammaslääkäriajasta näkyvää kollegoillesi eikä varaa aikaa heidän aikataulutustyökaluissaan.",
        "Valitse tavoite ennen yhteyden muuttamista. Jos haluat siirtää tapahtumatietoja toiseen tiliin, käytä alla olevaa kohtaa ”Valitse kalenterin vientimuoto” löytääksesi tuetun siirtoreitin ja tarkista edustavat tapahtumat ennen kuin luotat kohteeseen. Jos haluat vertailla aikoja, säilytä nykyiset kalenterin omistajat ja näytä valitut lähteet yhdessä. Jos toisen tilin pitää saada varattunaoloaika, ”Cloud Calendars ja OneCal työnkulun mukaan” selittää, miten varattunaolojen kopiointi eroaa henkilökohtaisesta yleisnäkymästä."
      ]
    },
    {
      "heading": "Yhdistä oikeaa reittiä käyttäen",
      "body": [
        "Ota iCloudia varten ensin iCloud-kalenteri käyttöön iPhonessa halutun Apple Accountin alla. Applen määritysopas selittää laitteen asetukset. Cloud Calendars käyttää iPhonen kalenterijärjestelmässä saatavilla olevia kalentereita ja tarvitsee kalenterin käyttöoikeuden niiden lukemiseen. Toisella laitteella yhdistetty tili ei riitä.",
        "Cloud Calendarsissa on myös toiminnot ”Sign in with Google” ja ”Sign in with Microsoft”. Tarkista, minkä tilin valitset sisäänkirjautuessa, avaa sitten sen kalenteriryhmä ja valitse tarvitsemasi kalenterit. Oikeaan palveluntarjoajaan kirjautuminen väärällä henkilö- tai työidentiteetillä voi tuottaa täysin kelvollisen mutta odottamattoman kalenteriluettelon."
      ]
    },
    {
      "heading": "Ymmärrä tilaukset sekoittamatta niitä käyttöoikeuksiin",
      "body": [
        "Base sisältää Google Calendar -synkronoinnin ja kalenterinäkymät. Advanced lisää Baseen mainosten poiston. Premium lisää Microsoft Calendar- ja Microsoft Teams -ominaisuudet. Tarkista ajantasainen paikallinen hinta ja laskutusjakso ennen ostoa.",
        "Tilaus muuttaa sitä, mitkä sovelluksen ominaisuudet ovat käytettävissä; se ei anna omistusoikeutta toisen henkilön kalenteriin. Google erottaa tapahtumien katseluoikeuden niiden muokkausoikeudesta. Työnantajan käytännöt ja Microsoft-kalenteriin liitetyt käyttöoikeudet ovat edelleen voimassa. Näkyvä tapahtuma tai käytettävissä oleva muokkaustoiminto ei todista, että palveluntarjoaja hyväksyy päivityksen."
      ]
    },
    {
      "heading": "Yhdistetty näkymä voi sisältää kalenterikopioita",
      "body": [
        "Google- ja Microsoft-yhteydet käyttävät iPhonen kalenterijärjestelmässä kalenterikopioita tapahtumien näyttämiseen ja synkronointiin. Älä oleta, että tilin yhdistäminen tarkoittaa, ettei alkuperäisen palveluntarjoajan ulkopuolelle jää mitään kopiota. Näihin kopioihin käytetty kohde voi riippua laitteessa saatavilla olevista kalenterilähteistä.",
        "Jos sama tili päätyy puhelimeen myös toista reittiä, tarkista kalenterien nimet ja lähteet ennen kuin pidät toistuvia tapahtumia erillisinä tapahtumina. Piilota yksi kalenteri väliaikaisesti selvittääksesi, minkä näkymän se tuottaa. Älä poista tapahtumaa tai kalenteria vain siistiäksesi näkymää: yhdistetty kopio voi lähettää muutokset takaisin palveluntarjoajalleen."
      ]
    },
    {
      "heading": "Valitse kohde jatkossakin aina, kun luot tapahtuman",
      "body": [
        "Tarkista ennen tallentamista tapahtuman kalenteri yhtä huolellisesti kuin päivämäärä ja kellonaika. Perhetapahtumaa varten valitse kalenteri, jota perhe oikeasti käyttää; työkokousta varten käytä sallittua työkohdetta. Se, että näet molemmat kalenterit yhdessä, ei tee kummastakaan automaattista kohdetta kaikille uusille tapahtumille.",
        "Tapahtuman kalenterin vaihtaminen tai sen vetäminen kalenterista toiseen voi olla siirto, ei harmiton toinen näkymä. Pidä kutsut ja toistuvat kokoukset niiden vakiintuneessa kalenterissa, kun selvität näyttöongelmaa. Jos tarvitset muutoksen, selvitä ensin, kuka omistaa tapahtuman ja mikä kalenteri voi hyväksyä sen."
      ]
    },
    {
      "heading": "Vahvista yleisnäkymä ennen kuin luotat siihen",
      "body": [
        "Vertaa palveluntarjoajan omassa kalenterissa olevaa tuoretta tapahtumaa vastaavaan tapahtumaan Cloud Calendarsissa. Tarkista päivämäärä, aikavyöhyke, otsikko ja valittu kalenteri. Muokattavissa olevassa omassa kalenterissasi kertakäyttöinen tapahtuma ilman vieraita on parempi testi kuin käynnissä olevan kokouksen muuttaminen. Vahvista tulos palveluntarjoajalla ennen kuin pidät yhteyttä valmiina.",
        "Älä luota siihen, että yhdistetty näkymä luo automaattisesti nimettömiä varattunaolohkoja toiseen tiliin. Jos tarvitset kollegoiden näkevän sinut varattuna ilman henkilökohtaisia tietoja, käytä nimenomaisesti hyväksyttyä varattunaolojärjestelyä ja vahvista se heidän puoleltaan. Selkeä henkilökohtainen yleisnäkymä ja jaettu varattunaolo ovat eri tehtäviä."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Listaa tarkka tili ja kalenteri yhdelle tapahtumalle kustakin palveluntarjoajasta.",
    "Ota halutut iCloud-kalenterit käyttöön laitteessa ja tarkista kalenterin käyttöoikeus.",
    "Käytä oikeaa Google- tai Microsoft-sisäänkirjautumista ja valitse halutut kalenterit.",
    "Vertaa yhtä tuoretta tapahtumaa sen palveluntarjoajan näkymään ennen kuin muutat mitään.",
    "Piilota epäilty päällekkäinen lähde väliaikaisesti; pidä varsinaiset tapahtumat ennallaan.",
    "Tarkista kohdekalenteri jokaisessa uudessa tapahtumassa ja varmista erikseen mahdollinen tarvitsemasi varattunaolojen jakaminen."
  ],
  "faq": [
    {
      "q": "Näkevätkö työkaverini henkilökohtaiset tapahtumani, koska näytän molemmat kalenterit?",
      "a": "Kalenterien näyttäminen yhdessä ei ole jakamiskäsky eikä automaattinen varattunaolosilta. Tarkista kunkin kalenterin todelliset jakoasetukset. Palveluntarjoajayhteydet voivat luoda laitteelle kalenterikopioita, joten yhdistetty näkymä ei myöskään takaa, että tapahtumatiedot ovat vain alkuperäisellä palveluntarjoajalla."
    },
    {
      "q": "Miksi näen tapahtuman, mutta en pysty muokkaamaan sitä onnistuneesti?",
      "a": "Kalenteri voi olla vain luku -tilassa, tapahtuma voi kuulua toiselle järjestäjälle tai palveluntarjoaja voi hylätä päivityksen. Tarkista omistajuus ja käyttöoikeudet palveluntarjoajan kalenterista. Korkeamman sovellustason ostaminen ei muuta näitä oikeuksia."
    },
    {
      "q": "Kannattaako sama Google-tili yhdistää jokaisen saatavilla olevan reitin kautta?",
      "a": "Tarkista ensin, miten se näkyy jo puhelimessa. Useat reitit voivat vaikeuttaa kalenterikopioiden tunnistamista. Valitse reitti, jota aiot käyttää, varmista sen tapahtumat ja piilota ylimääräinen näkymä selvityksen ajaksi sen sijaan, että poistaisit tietoja tai katkaisisit tilien yhteyksiä ensimmäisenä toimenpiteenä."
    }
  ],
  "sourcesHeading": "Lähteet ja käyttöönoton viitteet",
  "sources": [
    {
      "label": "Apple: iCloud Calendarin käyttöönotto laitteissasi",
      "url": "https://support.apple.com/guide/icloud/set-up-calendar-mme4d73a8727/icloud"
    },
    {
      "label": "Google: kalenterin jakaminen ja käyttöoikeudet",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: Outlook-kalenterin API ja tuetut postilaatikkotiedot",
      "url": "https://learn.microsoft.com/en-us/graph/outlook-calendar-concept-overview"
    }
  ],
  "seeAlso": [
    "exchange-calendars-on-an-iphone",
    "what-calendar-sync-actually-does",
    "when-two-calendars-disagree",
    "caldav-calendar-on-iphone",
    "calendar-export-ics-pdf-and-backup",
    "onecal-alternative-iphone-calendar-view-or-sync"
  ],
  "comparison": {
    "heading": "Yhdistetty näkymä, tilaus vai kopioitu varattu aika?",
    "columns": [
      "Mitä tarvitset",
      "Mitä tarkistaa",
      "Mitä ei pidä olettaa"
    ],
    "rows": [
      {
        "cells": [
          "Yksi näkymä useista tileistä",
          "Yhdistetty tili, valittu kalenteri ja vaadittu tilaus.",
          "Että jaettu näyttö yhdistää omistajuuden tai käyttöoikeudet."
        ]
      },
      {
        "cells": [
          "Tapahtuman muokkaus, joka päätyy palveluntarjoajalle",
          "Alkuperäinen tapahtuma, kirjoitusoikeus ja lähteeseen tallennettu tulos.",
          "Että näkyvä paikallinen muokkaus todistaa onnistuneen synkronoinnin palveluntarjoajalle."
        ]
      },
      {
        "cells": [
          "Varattu aika toisella tilillä",
          "Palvelu, jossa on selkeät säännöt synkronoinnille lähteestä kohteeseen.",
          "Että yhdistetty näkymä luo kollegoille varausten estoja."
        ]
      },
      {
        "cells": [
          "Tilattu kalenterisyöte",
          "Julkaisija, päivittymiskäytäntö ja vain luku -tila.",
          "Että ICS-tilaus on muokattava kaksisuuntainen yhteys."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-left",
    "hook"
  ],
  "galleryDevice": "iPad",
  "galleryCaption": "Aidot iPad-kalenterinäkymät havainnollistavat aikataulun tarkastelua. Kuvakaappaus ei osoita palveluntarjoajan synkronoinnin suuntaa eikä tilin käyttöoikeuksia.",
  "actionHeading": "Tarkastele kalentereitasi yhdessä iPhonessa ja iPadissa",
  "actionText": "Google Calendarin synkronointi sisältyy Baseen. Advanced poistaa mainokset; Premium lisää Microsoft Calendar- ja Teams-tuen. Vahvista tilin käyttöoikeudet erikseen ostetusta tilauksesta riippumatta.",
  "articleLinks": [
    {
      "slug": "onecal-alternative-iphone-calendar-view-or-sync",
      "label": "Vertaa yhdistettyä näkymää OneCalin synkronointisääntöihin"
    },
    {
      "slug": "fantastical-readdle-calendar366-iphone-comparison",
      "label": "Vertaa iPhonen kalenterityönkulkuja"
    },
    {
      "slug": "weather-inside-your-calendar",
      "label": "Suunnittele sää ja tapahtumat yhdessä"
    }
  ]
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
