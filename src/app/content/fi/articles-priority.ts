import type { LocalisedArticle } from '../types';

export const PRIORITY_FI: Readonly<Record<string, LocalisedArticle>> = {
  "forecast-beside-every-event": {
    "title": "Tarkista kalenteritapahtuman tuntikohtainen sää iPhonessa ja iPadissa",
    "short": "Sää tapahtuman ajaksi",
    "description": "Sovita tapahtumasi paikka, päivämäärä ja tunnit saatavilla olevaan sääennusteeseen.",
    "lede": "Jos haluat tarkistaa sään kalenteritapahtumaa varten, sovita yhteen kolme asiaa: tapahtumapaikka, sen paikallinen päivämäärä ja tapahtuman alku- ja loppuajasta muodostuva ajanjakso. Valitse Cloud Calendarsissa sääsijainti ja tarkista saatavilla olevat tunnit. Tapahtuman osoite ja lähellä näkyvä sääkuvake eivät yksin todista, että nämä vastaavat toisiaan. Tämän oppaan julkaisee kehittäjä Arte Soft.",
    "commonBelief": "Että kalenterin päivittäinen sääkuvake olisi sama ominaisuus kuin tapahtumaan liitetty sääennuste.",
    "sections": [
      {
        "heading": "Aloita paikasta ja päivämäärästä",
        "body": [
          "Avaa ennuste aiotulle sijainnille ja vertaa sen päivämäärää kalenterimerkintään. Kalenterin sää voi perustua valittuun sääsijaintiin, joten varmista, että se sopii tapahtumaan äläkä oleta tapahtuman osoitteen määräävän sitä.",
          "Ensi kuun tapahtuma voi olla olemassa jo ennen kuin kyseisen päivän säätiedot ovat saatavilla. Säilytä tapahtuma ja palaa ennusteeseen lähempänä ajankohtaa; puuttuva säätieto ei tarkoita ennustetta poutasäästä."
        ]
      },
      {
        "heading": "Käytä tuntitietoja, kun kysymys koskee tunteja",
        "body": [
          "Päiväyhteenveto ja tuntiennuste vastaavat eri kysymyksiin. Jos tapahtuma kestää kahdesta viiteen, tarkista kyseisen ajanjakson saatavilla olevat tunnit sen sijaan, että pitäisit yhtä päivän sääkuvaketta koko kuvana.",
          "Jos vain osa ajanjaksosta on saatavilla, jätä loput avoimeksi. Sovellus ei lupaa täydellistä tuntikohtaista säätä jokaiselle luotavalle tapahtumalle, eikä tämä ohje lupaa, että minkä tahansa tapahtuman avaaminen näyttää aina koko sen sääjakson."
        ]
      },
      {
        "heading": "Erota todennäköisyys, määrä ja ajoitus",
        "body": [
          "Lue tarkistamasi arvon selite. Sateen todennäköisyys ei ole sama asia kuin sademäärä tai kesto. Samoin tuntikohtainen arvo ja päiväyhteenveto kattavat eri ajanjaksot; vertaile samoja ajanjaksoja, kun punnitset kahta mahdollista aikaa.",
          "Valitse varavaihtoehto suunnitelmaasi sopivalla tavalla sen sijaan, että pitäisit yhtä prosenttilukua yleisenä lähde-tai-peruuta-sääntönä. Säätiedot voivat muuttua, joten tarkista ne uudelleen, kun päätös on tehtävä."
        ]
      },
      {
        "heading": "Tarkista ennen sääperusteisen tapahtuman tallentamista",
        "body": [
          "Sovellus voi aloittaa tapahtumaluonnoksen ennustetunnista. Tarkista luonnoksen päivämäärä, alku, loppu ja kohdekalenteri ennen tallentamista. Ennusteen valinta ei korvaa varmistusta siitä, että olet luomassa oikeaa merkintää.",
          "Jos kalenterin käyttöoikeus tai kohdekalenteri estää tallentamisen, ratkaise kyseinen lupa-asia erikseen sääoikeuksista. Ennusteen löytyminen ei anna muokkausoikeutta jaettuun kalenteriin."
        ]
      },
      {
        "heading": "Käytä koko ennustetta, kun yhteenveto ei riitä",
        "body": [
          "Ulkona tapahtuvaa toimintaa varten tarkista juuri kyseiseen toimintaan liittyvät muuttujat ja se sijainti, jonka todella valitsit. Nykyisen sään widget tai etusivun demo ei korvaa sovelluksen saatavilla olevien ennustetuntien tarkistamista.",
          "Jos huomaat ristiriidan, vertaa ensin paikkaa ja aikaleimaa. Eri palveluntarjoajat, valitut sijainnit ja ennustejaksot voivat tuottaa erilaisia näkymiä ilman, että se todistaisi kalenteritapahtuman muuttuneen."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Varmista sijainti ja tapahtuman päivämäärä.",
      "Tarkista toiminnan ajalle saatavilla olevat tunnit.",
      "Lue todennäköisyys ja määrä eri arvoina.",
      "Tarkista tapahtumaluonnos ennen tallentamista."
    ],
    "seeAlso": [
      "weather-inside-your-calendar",
      "planning-outdoors-without-being-rained-on"
    ],
    "updated": "2026-10-23",
    "faq": [
      {
        "q": "Onko jokaisella tapahtumalla täydellinen ennuste?",
        "a": "Ei. Kattavuus riippuu valitusta sijainnista sekä saatavilla olevista päivistä ja tunneista."
      },
      {
        "q": "Onko sääkuvake sidottu juuri tapahtuman osoitteeseen?",
        "a": "Älä päättele sitä pelkästään tapahtuman läheisyydestä. Vahvista sääsijainti erikseen."
      },
      {
        "q": "Tallentaako tunnin napauttaminen uuden tapahtuman?",
        "a": "Se aloittaa tapahtumaluonnoksen, jos ominaisuus on saatavilla. Tarkista sen päivämäärä, aika ja kalenteri ennen tallentamista."
      }
    ],
    "sourcesHeading": "Säälähteet ja sijaintiasetukset",
    "sources": [
      {
        "label": "Apple: WeatherKit-ennusteet ja alueellinen saatavuus",
        "url": "https://developer.apple.com/weatherkit/"
      },
      {
        "label": "Apple: Tietosuoja ja sijaintipalvelut",
        "url": "https://support.apple.com/en-us/102515"
      }
    ],
    "comparison": {
      "heading": "Käytännöllinen tarkistus ennen ulkotapahtumaa",
      "columns": [
        "Tarkistus",
        "Esimerkki",
        "Päätös"
      ],
      "rows": [
        {
          "cells": [
            "Paikka",
            "Tapahtuma on toisessa kaupungissa.",
            "Valitse kyseinen määränpää säänäkymässä ja lue sen nimi."
          ]
        },
        {
          "cells": [
            "Ajanjakso",
            "Toiminta kestää klo 14.00–16.00.",
            "Tarkista molemmat tunnit sekä olennainen valmistautuminen tai matkustaminen."
          ]
        },
        {
          "cells": [
            "Kattavuus",
            "Vain osa tarvittavista tunneista on saatavilla.",
            "Pidä suunnitelma alustavana ja sovi uusi tarkistus."
          ]
        },
        {
          "cells": [
            "Tallennettu tapahtuma",
            "Aloitat luonnoksen sääennustetunnista.",
            "Tarkista päivämäärä, aikavyöhyke, kesto ja kohdekalenteri ennen tallentamista."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-right",
      "week-left"
    ],
    "galleryCaption": "Sää- ja viikkonäkymä näyttävät saman suunnittelutehtävän eri osia. Vahvista ennusteen paikka erikseen tapahtuman sijainnista.",
    "actionHeading": "Tarkista ennuste todellisia tapahtumiasi vasten",
    "actionText": "Käytä Cloud Calendarsia iPhonessa tai iPadissa tarkistaaksesi saatavilla olevan ennusteen ja aikataulusi. Sää tukee valintaasi; se ei siirrä tapahtumaa automaattisesti eikä vahvista muutosta osallistujille.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Ymmärrä kalenteri- ja säänäkymät"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Valitse nopea Koti-valikon yleiskuva"
      },
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Tarkista aikataulusi taustalla olevat kalenterit"
      }
    ]
  },
  "the-widget-that-shows-what-is-next": {
    "updated": "2026-10-23",
    "title": "Kalenteriwidgetit iPhonessa ja iPadissa: tulevat tapahtumat ja sää",
    "short": "Tulevat tapahtumat Koti-valikossa",
    "description": "Valitse Cloud Calendars -widgetti tuleville tapahtumille, päivämäärälle tai säälle.",
    "lede": "Valitse Calendar Events tai Calendar Events Large, kun haluat Koti-valikkoon tulevat tapahtumat. Valitse Calendar & Weather, kun haluat päivämäärän ja sään näyttävän näkymän. Nämä asettelut vastaavat eri kysymyksiin; esikatsele laitteellasi tarjolla oleva vaihtoehto ennen sen lisäämistä. Tämän oppaan julkaisee Cloud Calendarsin kehittäjä Arte Soft.",
    "sections": [
      {
        "heading": "Valitse ensin tapahtuma-asettelu",
        "body": [
          "Cloud Calendarsin widget-galleriassa Calendar Events on keskikokoinen tapahtumaluetteloasettelu. Calendar Events Large tarjoaa enemmän tilaa tuleville tapahtumille. Calendar & Weather on erillinen päivämäärä- ja sääasettelu; sen pieni koko ei takaa seuraavan tapahtuman riviä. Nimet voivat näkyä laitteellasi käännettyinä.",
          "Pidä iPhonessa Koti-valikon tyhjää aluetta painettuna, valitse Muokkaa ja Lisää widget ja etsi sitten Cloud Calendars sekä valitse haluamasi asettelu. Vertaa esikatselua ennen lisäämistä. Applen widget-ohjeet koskevat tätä järjestelmän galleriaa; se on eri asia kuin sovelluksen sisäiset kalenterinäkymät."
        ]
      },
      {
        "heading": "Lisää ja tarkista widget iPadissa",
        "body": [
          "Käytä iPadissa Applen Koti-valikon widget-galleriaa: pidä taustaa painettuna, avaa Muokkaa ja sitten Lisää widget. Hae Cloud Calendars, tarkista tarjotut tyylit ja koot, lisää tarvitsemasi asettelu, sijoita se ja viimeistele valitsemalla Valmis. Noudata iPadOS-versiosi näyttämiä ohjaimia; esikatselu ei vahvista, että kalenteritietosi ovat latautuneet.",
          "Valitse Calendar Events tai Calendar Events Large, kun tarvitset tapahtumia näkyviin. Vertaa asennetun sovelluksen tarjoamia tyylejä; päivämäärä- ja sääruutu vastaa eri tarpeeseen kuin tapahtumaluettelo.",
          "Avaa Cloud Calendars kyseisessä iPadissa ja etsi valitusta kalenterista tuttu tuleva kellonaikaan sidottu tapahtuma. Oikea näkymä iPhonessa ei vahvista iPadin tilejä, käyttöoikeuksia tai ladattuja tietoja. Vertaa otsikkoa, päivämäärää ja alkamisaikaa ja jatka sitten alla oleviin kelpoisuus- ja päivitystarkistuksiin, jos widget poikkeaa tästä."
        ]
      },
      {
        "heading": "Tarkista, mikä lasketaan tulevaksi",
        "body": [
          "Tapahtumanäkymä käyttää valittuja kalentereita ja tulevia kellonaikaan sidottuja tapahtumia. Koko päivän merkinnät ja tapahtumat, joiden alkamisaika on jo mennyt, jätetään tästä tulevien tapahtumien syötteestä pois. Siksi syntymäpäivä tai jo käynnissä oleva kokous voi näkyä sovelluksessa mutta ei täällä.",
          "Jos esimerkiksi ainoa merkintäsi tänään on koko päivän matkustusta kuvaava merkintä, tyhjä tulevien lista ei tarkoita, että merkintä olisi kadonnut. Avaa sovellus nähdäksesi koko päivän. Samoin seuraava kellonaikaan sidottu tapahtuma voi olla vasta huomenna tai myöhemmin; lue päivämäärä äläkä oleta, että jokainen rivi koskee tätä päivää."
        ]
      },
      {
        "heading": "Erota puuttuva tapahtuma tilanteesta, jossa listasta ovat rivit loppuneet",
        "body": [
          "Widget näyttää rajallisen määrän tulevia tapahtumia. Jos aiemmat tapahtumat täyttävät sen rivit, myöhempi tapahtuma voi puuttua, vaikka se näkyisi sovelluksessa ja olisi kelvollinen tulevien listalle. Suurempi tapahtuma-asettelu voi näyttää enemmän rivejä, mutta sekään ei ole koko kalenteri.",
          "Aloita lähimmästä tulevasta kellonaikaan sidotusta tapahtumasta valitussa kalenterissa. Jos se näkyy mutta myöhempi ei, avaa sovellus ja tarkista loput aikataulusta. Jos myös lähin kelvollinen tapahtuma puuttuu, jatka kalenterivalinnan, käyttöoikeuksien ja päivitysten tarkistamiseen. Älä siirrä tai poista tapahtumia vain saadaksesi myöhemmän merkinnän näkyviin."
        ]
      },
      {
        "heading": "Käytä sovellusta ensimmäisenä vertailukohtana",
        "body": [
          "Avaa Cloud Calendars ja etsi yksi tietty tuleva kellonaikaan sidottu tapahtuma. Vahvista, että sen oma kalenteri on valittuna ja että sovelluksella on tarvittava kalenterin käyttöoikeus. Vertaa otsikkoa, päivämäärää ja alkamisaikaa widgetiin. Jos tapahtuma puuttuu myös sovelluksesta, selvitä ensin tili tai synkronointi.",
          "Käytä vaaratonta testitapahtumaa kalenterissa, jonka omistat, jos tarvitset selkeän esimerkin. Anna sille tuleva alkamisaika ja helposti tunnistettava otsikko. Vältä oikean kutsun muuttamista tai tilien poistamista vain Koti-valikon testaamiseksi."
        ]
      },
      {
        "heading": "Huomioi päivitykset olettamatta kiinteää määräaikaa",
        "body": [
          "Widgetit näyttävät tallennettuja tietoja eivätkä päivity jatkuvasti kuten avoin sovellus. Apple hallitsee niiden päivitysaikataulua. Sovelluksen avaaminen ja tapahtuman tarkistaminen antaa tuoreen vertailukohdan, mutta ei määritä tarkkaa sekuntimäärää, jonka kuluessa widgetin pitäisi muuttua.",
          "Jos sovellus pysyy oikeana mutta widget pysyy vääränä, kirjaa ylös asettelu, valittu kalenteri, tapahtuman aika sekä sovelluksen ja iOS:n versiot. Tyhjä lista, vanha tapahtuma ja väärä aika ovat eri havaintoja; ilmoita, minkä näet."
        ]
      },
      {
        "heading": "Tulkitse sää erillisenä yhteenvetona",
        "body": [
          "Päivämäärän vieressä näkyvä sää ei ole ennuste, joka olisi sidottu kunkin tapahtuman paikkaan ja alkamisaikaan. Ennen ulkotapahtumaa avaa säänäkymä ja tarkista aiottu paikka ja kellonaika. Nykyhetken olosuhdekuvake ei kerro, millaiset olosuhteet ovat myöhemmän tapaamisen aikaan.",
          "Pidä tämä widget nopeaa yleiskuvaa varten. Käytä koko kalenteria koko päivän sitoumuksiin, tapahtumien tietoihin ja päätöksiin, joissa tarvitaan koko aikataulu."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Valitse Calendar Events tai Calendar Events Large tapahtumaluetteloa varten.",
      "Varmista tuleva kellonaikaan sidottu tapahtuma valitussa kalenterissa.",
      "Vertaa sen päivämäärää ja aikaa sovelluksessa ennen widgetin vianmääritystä.",
      "Kirjaa toistuvat erot muistiin kalenteritietojen poistamisen sijaan."
    ],
    "faq": [
      {
        "q": "Miksi syntymäpäiväni puuttuu?",
        "a": "Tulevien syöte ei sisällä koko päivän tapahtumia. Tarkista koko kalenterista syntymäpäivät ja muut vain päivämäärään sidotut merkinnät."
      },
      {
        "q": "Näyttääkö pieni widget seuraavan kokouksen?",
        "a": "Pieni Calendar & Weather -asettelu näyttää päivämäärän ja sään. Valitse tapahtumaluetteloasettelu nähdäksesi tapahtumat."
      },
      {
        "q": "Tarkoittaako se, ettei tulevia tapahtumia ole, että olen vapaa tänään?",
        "a": "Ei. Koko päivän merkinnät, käynnissä olevat tapahtumat, valitsemattomat kalenterit ja vanhentuneet tiedot voivat muuttaa tämän johtopäätöksen."
      }
    ],
    "sourcesHeading": "Lähteet ja Applen ohjeet",
    "sources": [
      {
        "label": "Apple: Widgetien lisääminen ja muokkaaminen iPhonessa",
        "url": "https://support.apple.com/118610"
      },
      {
        "label": "Apple: Widgetin pitäminen ajan tasalla",
        "url": "https://developer.apple.com/documentation/widgetkit/keeping-a-widget-up-to-date"
      },
      {
        "label": "Apple: Widgetien lisääminen, muokkaaminen ja poistaminen iPadissa",
        "url": "https://support.apple.com/guide/ipad/add-edit-and-remove-widgets-ipadb0de8630/ipados"
      }
    ],
    "seeAlso": [
      "choosing-a-widget-size",
      "a-countdown-to-your-next-meeting",
      "calendar-on-apple-watch"
    ],
    "comparison": {
      "heading": "Valitse näyttö, jota oikeasti tarvitset",
      "columns": [
        "Näyttö",
        "Käyttötarkoitus",
        "Tarkista ennen kuin luotat siihen"
      ],
      "rows": [
        {
          "cells": [
            "Calendar Events",
            "Kompakti näkymä tulevista kellonaikaan sidotuista tapahtumista.",
            "Tapahtuma kuuluu valittuun kalenteriin eikä ole vielä alkanut."
          ]
        },
        {
          "cells": [
            "Calendar Events Large",
            "Enemmän tilaa tuleville tapahtumille.",
            "Suuremmassakin asettelussa rivien määrä on rajallinen."
          ]
        },
        {
          "cells": [
            "Calendar & Weather",
            "Nopea yleiskuva päivämäärästä ja säästä.",
            "Sen pieni asettelu ei takaa tulevan tapahtuman riviä."
          ]
        },
        {
          "cells": [
            "Live Activity",
            "Erillinen seuraavan tapahtuman lähtölaskenta tuetuissa iPhonen näkymissä.",
            "Se ei ole Koti-valikon widget eikä erillinen lukitusnäytön widget-asettelu."
          ]
        }
      ]
    },
    "galleryKinds": [
      "widgets",
      "live"
    ],
    "galleryCaption": "Koti-valikon widgetit ja Live Activity ovat erillisiä näyttöjä. Valitse tarpeitasi vastaava asettelu.",
    "actionHeading": "Tuo aikataulusi hyödyllinen osa Koti-valikkoon",
    "actionText": "Avaa Cloud Calendars, tarkista tuttu tuleva kellonaikaan sidottu tapahtuma ja lisää sitten sopiva widget iPhoneen tai iPadiin. Koko kalenterin tarkistaminen kuuluu edelleen sovellukseen.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Tarkastele säätä aikataulusi rinnalla"
      },
      {
        "slug": "forecast-beside-every-event",
        "label": "Tarkista ulkotapahtuman kellonajat"
      },
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Tarkista yhdistetyt kalenteritilisi"
      }
    ]
  },
  "onecal-alternative-iphone-calendar-view-or-sync": {
    "updated": "2026-10-23",
    "title": "Cloud Calendars vai OneCal? Valitse yhdistetty näkymä tai kalenterin synkronointi",
    "short": "Cloud Calendars ja OneCal työnkulun mukaan",
    "description": "Vertaa OneCalia ja Cloud Calendarsia näkymien, kopioitujen tapahtumien, mobiiliohjainten ja tilausten mukaan.",
    "lede": "Valitse tarvitsemasi lopputuloksen mukaan: useiden aikataulujen tarkastelu yhdessä, alkuperäisen tapahtuman muokkaaminen tai varatun ajan kopiointi toiselle tilille. Cloud Calendars tarjoaa iPhonen ja iPadin suunnittelunäkymiä; OneCal dokumentoi Unified Calendar View’n ja erilliset Calendar Sync -säännöt. Tämän vertailun on julkaissut Arte Soft, Cloud Calendarsin kehittäjä.",
    "commonBelief": "Kaksi tuotetta, jotka näyttävät Google-, iCloud- ja Outlook-kalenterit, pitävät välttämättä saatavuuden, tapahtumamuokkaukset ja kopiot synkronoituna samalla tavalla.",
    "sections": [
      {
        "heading": "Valitse yleiskuvan ja toisella tilillä tehtävän muutoksen välillä",
        "body": [
          "Jos tavoitteesi on nähdä henkilökohtainen tapahtuma työpalaverin vieressä, tarvitset yhdistetyn näkymän. Jos työkalenterissasi on oltava myös henkilökohtaista tapahtumaa vastaava varausesto, tarvitset määritellyn työnkulun lähteestä kohteeseen. Ensimmäinen lopputulos ei luo toista.",
          "Cloud Calendars tuo valitut kalenterit iPhonen ja iPadin suunnittelunäkymään. OneCal dokumentoi Unified Calendar View’n erillään Calendar Syncistä; sen julkaisijan mukaan näkymää voi käyttää ilman synkronointisääntöjen määrittämistä. Päätä, mikä lopputulos on tärkeä, ennen kuin yhdistät tilejä tai vertailet tilausten nimiä."
        ]
      },
      {
        "heading": "Ymmärrä, mitä kopioitu tapahtuma voi muuttaa",
        "body": [
          "OneCalin Calendar Sync -dokumentaatio kuvaa yksisuuntaisia ja monisuuntaisia sääntöjä, jotka luovat kloonitapahtumia. Sen erillinen kattavuusopas kertoo, että klooniin tehdyt muokkaukset eivät välity takaisin alkuperäiseen. Tunnista alkuperäinen tapahtuma ja sen omistava kalenteri, ennen kuin pidät kopioitua tapahtumaa paikkana, jossa kokous aikataulutetaan uudelleen.",
          "Cloud Calendarsin palveluntarjoajayhteydet voivat myös luoda peilattuja kalentereita iOS:n tietovarastoon. Yhdistetty näyttö ei todista, että tietueita olisi yhdistetty tai että muokkaus olisi päätynyt palveluntarjoajalle. Jos omistat kalenterin ja saat muokata sitä, tarkista vieraaton testitapahtuma sekä palveluntarjoajalta että sovelluksesta."
        ]
      },
      {
        "heading": "Tarkista ohjaimet sillä laitteella, jota todella käytät",
        "body": [
          "OneCalin nykyinen mobiiliopas kuvaa kalenteritapahtumien luomisen ja muokkaamisen, toistuvuuden valinnat, RSVP-toiminnot ja kokouksiin liittymisen. Se kertoo erikseen, että Calendar Sync -määritysten luominen, muokkaaminen, keskeyttäminen tai poistaminen tehdään verkkosovelluksessa; mobiili näyttää nämä määritykset. Myös varauslinkkien määritys kuvataan verkkotehtäväksi.",
          "Cloud Calendars on iPhone- ja iPad-sovellus, jossa on päivä-, viikko-, kuukausi-, vuosi- ja luettelonäkymät. Kokeile tarvitsemaasi muokkausta asennetussa näkymässäsi, lue mahdolliset toistuvuuden valinnat ja vahvista tallennettu tapahtuma. Älä oleta, että toisen tuotteen mobiilivalikko, varaustyönkulku tai automaatio-ohjaimet ovat siinä olemassa."
        ]
      },
      {
        "heading": "Varmista kattavuus äläkä oleta rajatonta historiaa",
        "body": [
          "OneCalin nykyinen kattavuusopas ilmoittaa tulevan synkronointi-ikkunan Googlelle ja iCloudille enintään vuodeksi ja Outlookille enintään kolmeksi kuukaudeksi. Se erottaa myös tulevat toistuvat sarjat yksittäisistä historiallisista tapahtumista. Nämä ovat julkaisijan dokumentoimia rajoja, eivät testi juuri sinun tilistäsi tai väite kaikista sen kalenterinäkymän ominaisuuksista.",
          "Cloud Calendarsissakin on tarkistettava tilin yhteystapa, valitut kalenterit ja olennaiset päivämäärät. Jos vanhat kokoukset ovat olennaisia, vertaa tunnistettua tapahtumaa palveluntarjoajalla ja sovelluksessa. Kalenterisovellus ei automaattisesti ole täydellinen varmuuskopio eikä tae siitä, että jokainen mennyt tietue on haettu."
        ]
      },
      {
        "heading": "Vertaa tilausten vaatimuksia ja laskutusreittiä",
        "body": [
          "Cloud Calendars sisältää Google Calendarin synkronoinnin Basessa; Advanced poistaa mainokset ja Premium lisää Microsoft Calendar- ja Teams-tuen. Tarkista tilin käyttöoikeudet erikseen tilauksesta. Tarkista nykyinen paikallinen hinta ja laskutusjakso ennen ostoa sen sijaan, että käyttäisit kiinteää kansainvälistä hintavertailua.",
          "OneCalin verkon tilaussivu kuvaa jäsenkohtaisia tilauksia ja neljäntoista päivän kokeilua, mukaan lukien kloonien poistamisen kokeilun päättyessä. Sen mobiililaskutusopas kuvaa kaupan hallinnoimia ostoja ja rajoituksia tiimin jäsenten lisäämiseen. Tarkista, mitkä ominaisuudet vaativat jatkuvan tilauksen ja missä osto hallitaan; pelkkä ilmainen lataus ei vastaa näihin kysymyksiin."
        ]
      },
      {
        "heading": "Testaa todellinen suunnittelutyönkulkusi ennen vaihtoa",
        "body": [
          "Jos sää, widgetit tai Live Activity ovat tärkeitä, sisällytä ne kokeiluun sillä laitteella, jota käytät. Cloud Calendars tarjoaa nämä suunnittelupinnat, ja sää rajoittuu saatavilla oleviin päivämääriin ja valittuun paikkaan. Tässä tarkastellut OneCal-sivut eivät osoita näiden pintojen ominaisuuksien vastaavuutta; tarkista sen nykyinen tuote sen sijaan, että päätelisit oppaan perusteella ominaisuuden puuttuvan.",
          "Säilytä alkuperäiset sovellukset ja yhteystiedot, kunnes olet tarkistanut vaaditun lopputuloksen. Kirjaa, varmistitko näkyvyyden, alkuperäisen tapahtuman muokkauksen, kopioidun varatun ajan vai muistutuksen; ne ovat eri lopputuloksia. Ennen kuin katkaiset palvelun yhteyden, tarkista mitä tapahtuu olemassa oleville kopioille ja vältä kokeiluja aktiivisella kutsulla tai oikealla asiakastapaamisella."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Kirjaa ylös, tarvitsetko yhdistetyn näkymän vai toiselle tilille kopioitavat tapahtumat.",
      "Tunnista alkuperäiset, kopiot ja tili, joka omistaa jokaisen tärkeän tapahtuman.",
      "Tarkista tarvittavat ohjaimet sillä puhelimella, tabletilla tai verkkotyönkulussa, jota todella käytät.",
      "Vertaa yhtä tavallista viikkoa ja mahdollisia historiallisia päivämääriä, joihin tukeudut.",
      "Tarkista nykyiset tilausten vaatimukset, paikallinen hinta ja oston tarjoaja.",
      "Varmista vaaraton testitapahtuma ja tarkista kopioiden poistamissäännöt ennen vaihtoa."
    ],
    "faq": [
      {
        "q": "Onko yhdistetty kalenterinäkymä sama asia kuin varatun ajan synkronointi?",
        "a": "Ei. Yhdistetty näkymä auttaa vertailemaan sitoumuksia. Merkinnän luominen toiselle tilille edellyttää erillistä tuettua työnkulkua; OneCal dokumentoi Calendar Sync -säännöt erillään Unified Calendar View’sta."
      },
      {
        "q": "Voinko muuttaa OneCal-kloonia siirtääkseni alkuperäisen kokouksen ajankohtaa?",
        "a": "Sen kattavuusoppaan mukaan klooniin tehdyt muokkaukset eivät välity alkuperäiseen. Tunnista alkuperäinen tapahtuma ja noudata sen kalenterin muokkaus- ja järjestäjäoikeuksia."
      },
      {
        "q": "Kumpi sovellus on omassa käytössäni edullisempi?",
        "a": "Se riippuu tarvitsemistasi ominaisuuksista, tileistä, laskutusreitistä ja paikallisesta hinnasta. Cloud Calendars sisältää Google-synkronoinnin Basessa ja Microsoft-tuen Premiumissa. Tarkista OneCalin nykyinen tilaus ja mobiililaskutuksen ehdot aiottua työnkulkuasi varten; tämä opas ei väitä mitään vaihtoehtoa yleisesti halvimmaksi."
      }
    ],
    "sourcesHeading": "OneCalin virallinen työnkulku- ja tilausten dokumentaatio",
    "sources": [
      {
        "label": "OneCal: mobiiliominaisuudet ja vain verkossa tehtävät määritystehtävät",
        "url": "https://docs.onecal.io/docs/mobile-apps"
      },
      {
        "label": "OneCal: Calendar Sync ja lähde-kohde-säännöt",
        "url": "https://docs.onecal.io/docs/calendar-sync/calendar-sync-intro"
      },
      {
        "label": "OneCal: synkronointi-ikkunat ja kloonitapahtumien muokkaukset",
        "url": "https://docs.onecal.io/docs/calendar-sync/what-does-onecal-sync"
      },
      {
        "label": "OneCal: tilaukset, kokeilu ja toiminta kokeilun päättyessä",
        "url": "https://docs.onecal.io/docs/billing/plans-and-free-trial"
      },
      {
        "label": "OneCal: App Store- ja Google Play -tilaukset",
        "url": "https://docs.onecal.io/docs/billing/mobile-subscriptions"
      }
    ],
    "seeAlso": [
      "what-calendar-sync-actually-does",
      "three-calendar-apps-is-two-too-many",
      "free-google-sync-without-adverts",
      "disconnect-calendar-integration-without-losing-track",
      "what-fantastical-costs-and-what-this-does"
    ],
    "comparison": {
      "heading": "Vertaa työnkulkua ennen tilausta",
      "columns": [
        "Kysymys",
        "Cloud Calendars",
        "OneCalin dokumentaatio"
      ],
      "rows": [
        {
          "cells": [
            "Missä tarkistan aikatauluni?",
            "iPhonessa ja iPadissa päivä-, viikko-, kuukausi-, vuosi- ja luettelonäkymillä.",
            "Unified Calendar View on erillinen Calendar Syncin määrittämisestä."
          ]
        },
        {
          "cells": [
            "Tarvitsenko varausestojen kopioinnin tilien välillä?",
            "Älä päättele sitä yhdistetystä näkymästä; palveluntarjoajayhteydet voivat peilata kalentereita paikallisesti.",
            "Calendar Sync luo kloonitapahtumia yksisuuntaisilla tai monisuuntaisilla säännöillä."
          ]
        },
        {
          "cells": [
            "Missä muutan synkronointisääntöjä?",
            "Käytä sovelluksen tiliyhteydelle dokumentoituja ohjaimia.",
            "Tarkasteltu mobiiliopas ohjaa synkronointimääritysten muutokset verkkosovellukseen."
          ]
        },
        {
          "cells": [
            "Minkä Cloud Calendars -tilauksen tarvitsen?",
            "Base sisältää Google Calendarin synkronoinnin; Advanced poistaa mainokset; Premium lisää Microsoft Calendarin ja Teamsin.",
            "Tarkista tarvittua työnkulkua varten OneCalin nykyinen tilaus ja laskutusreitti."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-left",
      "hook"
    ],
    "galleryCaption": "Cloud Calendarsin aidot kalenterinäytöt näyttävät suunnittelunäkymän. Vertailu erottaa tämän näkymän palvelun palvelinpuolen kloonisäännöistä.",
    "actionHeading": "Valitse lopputulos, jonka haluat varmistaa",
    "actionText": "Jos haluat iPhonen tai iPadin yleiskuvan säällä ja widgeteillä, kokeile Cloud Calendarsia vaarattomalla testitapahtumalla. Jos tarvitset kopioitua varattua aikaa toisella tilillä, arvioi palvelu, joka dokumentoi tämän toiminnon nimenomaisesti.",
    "articleLinks": [
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Ota yhdistetty kalenterinäkymä käyttöön"
      },
      {
        "slug": "fantastical-readdle-calendar366-iphone-comparison",
        "label": "Vertaa muita iPhonen kalenterivaihtoehtoja"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Valitse Koti-valikon näyttö"
      }
    ]
  },
  "fantastical-readdle-calendar366-iphone-comparison": {
    "updated": "2026-10-23",
    "title": "iPhonen kalenterivaihtoehdot: Cloud Calendars, Fantastical, Readdle ja BusyCal",
    "short": "Vertaa iPhonen kalenterivaihtoehtoja",
    "description": "Vertaa iPhonen kalentereita sään, näkymien, tehtävien ja tarvitsemasi työnkulun perusteella.",
    "lede": "Valitse kalenteri sen tehtävän mukaan, jonka haluat saada valmiiksi: tarkastele tapahtumia sään kanssa, lisää tapahtuma nopeasti, hallitse tehtäviä tai yhdistä tilien näkymiä. Cloud Calendars, Fantastical, Calendars by Readdle, Calendar 366 ja BusyCal eroavat näissä työnkuluissa ja niiden tilaustasovaatimuksissa. Arte Soft kehittää Cloud Calendarsia ja julkaisee tämän vertailun.",
    "sections": [
      {
        "heading": "Valitse ensin, mikä on pakko toimia, ennen kuin vertaat ulkoasua",
        "body": [
          "Kirjaa ylös kalenteripalvelusi, laitteesi ja kolme olennaista toimintoa. Esimerkki: näe työ- ja henkilökohtaiset kalenterit yhdessä, suorita muistutus ja lisää kokous nopeasti. Testaa nämä toiminnot yksityisillä esimerkkitiedoilla ennen koko aikataulun tuomista.",
          "Se, että tuote tukee palveluntarjoajasi nimeä, ei tarkoita, että kaikilla yhteystavoilla olisi samat oikeudet tai ominaisuudet. Laitteen kalenteri, suoraan yhdistetty tili ja tilattu syöte voivat näyttää samankaltaisilta merkinnöiltä, mutta sallia eri toimintoja."
        ]
      },
      {
        "heading": "Käytä palveluntarjoajan omaa kalenteria vertailun lähtötasona",
        "body": [
          "Googlen aloitusopas kuvaa sen oman kalenterikäyttöliittymän aikataulutusta, tehtäviä, jakamista ja useita kalentereita varten. Jos aikataulusi on jo siellä, testaa vaadittu toiminto lähteessä ennen kuin päätät, tarvitsetko toisen sovelluksen.",
          "Vertaa esimerkiksi samaa tapahtumaa Google Calendarissa ja Fantasticalissa sen jälkeen, kun olet yhdistänyt aiotun tilin. Tarkista, onko tarvitsemasi etu yhdistetty näkymä, tehtäväyhteys, pikalisäys vai tietty laitekäyttöliittymä. Eri kalenteriohjelma ei automaattisesti tarkoita siirtymistä toiseen palveluntarjoajaan."
        ]
      },
      {
        "heading": "Fantastical: tarkista tiliyhteydet ja pikalisäys",
        "body": [
          "Flexibits dokumentoi sekä suorat kalenteritiliyhteydet että vaihtoehdot kalentereille ja muistutuksille, jotka on jo määritetty iOS:ssä. Sen aloitusopas suosittelee suoria yhteyksiä sovelluksen ominaisuuksien täysimääräiseen käyttöön. Selvitä, minkä tavan valitsit, sen sijaan että yhdistäisit saman kalenterin kahdesti ilman syytä.",
          "Fantastical dokumentoi myös lausepohjaisen syötön sekä uudelleenkäytettävät tapahtuma- tai tehtävämallit. Testaa yksiselitteinen päivämäärä, kesto ja kohdekalenteri ja tarkista sitten tallennettu tulos. Sen syntaksi kuuluu Fantasticalille; toisen sovelluksen tekstikenttä voi tulkita saman lauseen eri tavalla."
        ]
      },
      {
        "heading": "Calendars by Readdle: tarkista tehtävän lähde",
        "body": [
          "Readdle esittelee Google-, Outlook- ja iCloud-kalenterit yhdessä tehtäväominaisuuksien ja luonnollisen kielen syötön kanssa. Sen tehtävien määritysopas kuvaa iOS Remindersin tai Google Tasksin valitsemista Task Options -asetuksissa. Tämä valinta on tärkeä, jos puhelimella suoritetun tehtävän on päivitettävä tietty alkuperäinen lista.",
          "Käytä kertakäyttöistä tehtävää testataksesi valmistumisen molemmissa päissä, älä vain sitä, näkyykö otsikko aikajanalla. Jos tarvitset näkymän tai toiminnon myös Macissa iPhonen lisäksi, testaa se myös siellä. Älä oleta samoja ohjaimia pelkän yhteisen tuotenimen perusteella."
        ]
      },
      {
        "heading": "Calendar 366: tarkista järjestelmäkäyttöoikeus, joukkoasetukset ja sään sijainti",
        "body": [
          "Calendar 366:n dokumentaatio erottaa järjestelmän kalentereihin ja muistutuksiin pääsyn suorista tili-integraatioista. Se kuvaa kalenterijoukot, joilla valitaan näkyvät kalenterit ja listat. Nämä joukot voivat myös määrittää oletuskalenterin, joten tarkista, mihin uusi tapahtuma kuuluu.",
          "Sama dokumentaatio kuvaa myös sen oman luonnollisen kielen jäsentimen ja Apple Weatheriin perustuvan sään, jossa voi käyttää järjestelmän sijaintia tai mukautettua sijaintia. Ulkosuunnittelussa varmista valittu paikka sen sijaan, että olettaisit ennusteen seuraavan jokaisen tapahtuman osoitetta. Nämä ovat julkaisijan dokumentoimia ominaisuuksia, eivät tililläsi testattuja toimintoja."
        ]
      },
      {
        "heading": "BusyCal: tarkista tehtävien näyttö ja säähän käytettävä näkymä",
        "body": [
          "BusyCalin iOS-tehtäväopas erottaa päivätyt, ajoitetut ja päiväämättömät tehtävät. Se kuvaa suorituspainikkeet ja keskeneräisten päivättyjen tehtävien siirtämisen eteenpäin. Sen sääopas näyttää ennusteet List-, Day- ja Month-näkymissä, joten testaa juuri käyttämäsi näkymä sen sijaan, että olettaisit sään näkyvän kaikkialla.",
          "BusyCal dokumentoi myös luonnollisen kielen syötön vaihtoehtona uusien tapahtumien oletusasetuksissa. Kokeile samaa yksityistä esimerkkitapahtumaa kuin muissa sovelluksissa ja tarkista sitten kalenteri ja tallennettu aika. Nämä ovat BusyCalin ohjaimia, eivät kaikkien kalenterisovellusten yhteisiä komentoja."
        ]
      },
      {
        "heading": "Tarkista Watch-työnkulku erikseen puhelimesta",
        "body": [
          "Fantasticalin Watch-opas dokumentoi Up Next-, List- ja Tasks-näkymät, mukaan lukien tehtävien suorittamisen. BusyCalin tehtäväopas erottaa Watchissa näkyvät päivätyt ja ajoitetut tehtävät päiväämättömistä tehtävistä. Jos päiväämätön tehtäväjono on tärkeä, sisällytä se kokeiluun sen sijaan, että testaisit vain seuraavaa tapahtumaa.",
          "Watch-komplikaatio on pikavilkaisu, kun taas Watch-sovellus voi tarjota lisätoimintoja. Varmista tiedot ja toiminto oikealla kellolla ja puhelimella sekä tarkista nykyinen tilaus. Tietokoneen, puhelimen ja kellon käyttöliittymät eivät ole keskenään vaihtokelpoisia vain siksi, että niillä on sama tuotenimi."
        ]
      },
      {
        "heading": "Käsittele hinta ja käyttöoikeus erillisenä tarkistuksena",
        "body": [
          "Tarkista nykyinen paikallinen ostoruutu, kokeilun päätyttyä saatavilla olevat ominaisuudet ja muuttaako aiempi ostos käyttöoikeuttasi. Ilmainen lataus, toistuva tilaus ja vanha ostos eivät välttämättä avaa samaa ominaisuusjoukkoa.",
          "Julkaisijoiden sivut voivat päivittyä eri aikoihin. Readdlen nykyinen tuotteen UKK kuvaa useita ydintoimintoja ilmaisiksi, kun taas erillinen ilmaisen ja täysversion ohjesivu esittää erilaisen jaon. Sen sijaan että pitäisit yhtä kuvausta yleisenä lupauksena, varmista vaadittu toiminto asennetussa sovelluksessa ja sen nykyisissä ostoehdoissa."
        ]
      },
      {
        "heading": "Mihin Cloud Calendars sijoittuu vaihtoehtolistalla",
        "body": [
          "Cloud Calendars on toinen iPhone- ja iPad-vaihtoehto valituille kalentereille, useille suunnittelunäkymille, säälle ja pienoissovelluksille. Google-synkronointi sisältyy Baseen, Advanced poistaa mainokset ja Premium lisää Microsoft-kalenterituen. Tarkista nykyinen tilaustaso ja palveluntarjoajan oikeudet omassa kokoonpanossasi.",
          "Jos erikoistunut tehtäväyhteys, mallikomento tai työpöytätyönkulku on välttämätön, käytä tuotetta, joka dokumentoi ja myös onnistuneesti toteuttaa tämän vaatimuksen. Vertaa tallennettuja tuloksia ja päivittäistä vaivaa; tarkistuslistan pitäisi auttaa valinnassa, ei antaa ymmärtää, että kaikki tässä mainitut ominaisuudet ovat olemassa Cloud Calendarsissa."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Listaa tilisi, laitteesi ja olennaiset toimintosi.",
      "Valitse yksi tilin yhdistämistapa ja tarkista, mitä kalentereita se tuo näkyviin.",
      "Testaa pikalisäys ja tehtävän suorittaminen harmittomilla esimerkeillä.",
      "Varmista sään sijainti ja kullakin laitteella käytetyt näkymät.",
      "Tarkista nykyiset ostoehdot kokeilun tai vanhan käyttöoikeuden jälkeen."
    ],
    "faq": [
      {
        "q": "Mikä on paras vaihtoehto Fantasticalille?",
        "a": "Se riippuu tarvitsemastasi työnkulusta. Vertaa kalenteri- ja tehtävälähteitä, tapahtumien syöttöä, laitetukea ja nykyistä käyttöoikeutta. Tämä opas ei nimeä yleispätevää suorituskykyvoittajaa."
      },
      {
        "q": "Tarkoittaako sama palveluntarjoajan nimi, että jokainen sovellus synkronoi samalla tavalla?",
        "a": "Ei. Tarkista suorat yhteydet, laitekalenterit, syötteet ja käyttöoikeudet erikseen ja varmista sitten esimerkkimuutos sen lähteessä."
      },
      {
        "q": "Voinko olettaa, että jokainen mainostettu ominaisuus on ilmainen?",
        "a": "Et. Tarkista asennettu sovellus, paikallinen ostoruutu ja kokeilun jälkeen jäljelle jäävät ominaisuudet. Julkaisijan dokumentaatio voi kuvata eri versioita tai käyttöoikeuksia."
      }
    ],
    "sourcesHeading": "Tätä opasta varten tarkistettu virallinen dokumentaatio",
    "sources": [
      {
        "label": "Fantastical: tiliyhteyksien tavat",
        "url": "https://flexibits.com/fantastical-ios/help/getting-started"
      },
      {
        "label": "Fantastical: luonnollisen kielen syöttö ja mallit",
        "url": "https://flexibits.com/fantastical-ios/help/adding-events-and-tasks"
      },
      {
        "label": "Readdle: nykyiset tuotteen ominaisuudet ja UKK",
        "url": "https://readdle.com/calendars"
      },
      {
        "label": "Readdle: tehtävälähteen valinta",
        "url": "https://support.readdle.com/calendars/synchronization/how-to-sync-tasks-with-ios-reminders-or-google-tasks"
      },
      {
        "label": "Readdle: erillinen ohje ilmaisesta/täydestä versiosta",
        "url": "https://apphelp.readdle.com/en/index.php?id=585&pg=kb.page"
      },
      {
        "label": "Calendar 366: integraatiot, joukot, pikalisäys ja sää",
        "url": "https://calendar366.com/help/index.html"
      },
      {
        "label": "BusyCal for iOS: tehtävät ja Watchin tehtävärajoitukset",
        "url": "https://www.busymac.com/docs/busycalios/70659-tasks/"
      },
      {
        "label": "BusyCal for iOS: sää ja tuetut näkymät",
        "url": "https://www.busymac.com/docs/busycalios/70665-weather/"
      },
      {
        "label": "BusyCal for iOS: luonnollisen kielen syöttö",
        "url": "https://www.busymac.com/docs/busycalios/70669-natural-language/"
      },
      {
        "label": "Fantastical: Apple Watch -näkymät ja -toiminnot",
        "url": "https://flexibits.com/fantastical-ios/help/apple-watch"
      },
      {
        "label": "Google: Calendarin oma tilipohjainen käyttöliittymä",
        "url": "https://support.google.com/calendar/answer/2465776?hl=en"
      }
    ],
    "seeAlso": [
      "what-fantastical-costs-and-what-this-does",
      "natural-language-calendar-events-iphone",
      "iphone-calendar-tasks-reminders-versus-event-alerts"
    ],
    "comparison": {
      "heading": "Aloita tärkeimmästä vaatimuksestasi",
      "columns": [
        "Vaatimus",
        "Tarkistettavat olennaiset vaihtoehdot",
        "Tärkeä ero"
      ],
      "rows": [
        {
          "cells": [
            "Tapahtumat sään kanssa sekä iPhone/iPad-näkymät",
            "Cloud Calendars ja verrattujen sovellusten dokumentoidut säänäkymät.",
            "Tarkista ennusteen sijainti, saatavilla oleva ajanjakso ja näkymä; sääkattavuus ei ole rajaton."
          ]
        },
        {
          "cells": [
            "Luonnollisen kielen tapahtumasyöttö",
            "Fantastical ja asiaankuuluva Readdle- tai BusyCal-ominaisuus.",
            "Lauseiden jäsentäminen ei ole sama asia kuin sanelu tai tavallinen tapahtuman muokkaus."
          ]
        },
        {
          "cells": [
            "Tehtävät tapahtumien rinnalla",
            "Readdlen, Calendar 366:n, BusyCalin tai Fantasticalin dokumentoitu tehtävälähde.",
            "Tapahtumamuistutus ei ole tehtävien suoritusintegraatio."
          ]
        },
        {
          "cells": [
            "Google Calendar -synkronointi ja valinnainen mainosten poisto",
            "Cloud Calendars Base sisältää Google Calendar -synkronoinnin; Advanced poistaa mainokset.",
            "Microsoft Calendar- ja Teams-tuki vaativat Premiumin."
          ]
        },
        {
          "cells": [
            "Erilainen ostomalli",
            "Kunkin sovelluksen ja alustan nykyinen kauppalistus ja käyttöoikeus.",
            "Ilmainen lataus ei todista, että kaikki ominaisuudet ovat ilmaisia; alueelliset hinnat ja tilaustasot voivat muuttua."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-left",
      "week-right",
      "widgets"
    ],
    "galleryDevice": "iPad",
    "galleryCaption": "Nämä ovat Cloud Calendarsin näyttöjä sovelluksen näkymistä, säästä ja pienoissovelluksista. Ne eivät ole kuvakaappauksia vertailun muista tuotteista.",
    "actionHeading": "Kokeile kalenteria yhtä todellista suunnittelutarvetta vasten",
    "actionText": "Jos tärkein vaatimuksesi on iPhone- tai iPad-aikataulu sään ja pienoissovellusten kanssa, arvioi Cloud Calendars kertakäyttöisellä esimerkkitapahtumalla. Pidä erikoistuneet tehtävä-, varaus- ja luonnollisen kielen vaatimukset erillään tuotteita vertaillessa.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Katso, miten sää sopii kalenterin työnkulkuun"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Vertaa Cloud Calendars -pienoissovelluksia"
      },
      {
        "slug": "onecal-alternative-iphone-calendar-view-or-sync",
        "label": "Erota yhdistetty näkymä kopioidusta varatusta ajasta"
      }
    ]
  }
};
