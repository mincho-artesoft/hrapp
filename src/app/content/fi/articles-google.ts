import { LocalisedArticle } from '../types';

/** Kuusi Google-artikkelia: täsmällisiä kysymyksiä, selkeitä vastauksia. */
export const GOOGLE_FI: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
  "updated": "2026-10-21",
  "title": "Google-kalenterin jakaminen: tarkista todelliset oikeudet",
  "short": "Google-kalenterin käyttöoikeudet",
  "description": "Valitse saatavuuden, tietojen tai muokkauksen oikeudet Google-kalenterissa. Tarkista henkilöiden lisäksi ryhmien, organisaation ja julkinen pääsy.",
  "lede": "Päätä ennen jakamista, tarvitseeko toinen henkilö vapaat ajat, tapahtumatiedot vai kalenterin ylläpito-oikeuden. Ne ovat eri tehtäviä. Oppaan julkaisee Cloud Calendarsin kehittäjä Arte Soft.",
  "commonBelief": "Yhden henkilön rajattu oikeus estää häntä näkemästä tietoja minkään muun reitin kautta.",
  "sections": [
    {
      "heading": "Sovita oikeus tehtävään",
      "body": [
        "Aikaa ehdottava kollega voi tarvita vain varaustilanteen. Projektin aikataulua ylläpitävä tarvitsee muuta. Määritä tehtävä ja tarkista vasta sitten kalenterin nykyiset jakamisasetukset.",
        "Google erottaa saatavuuden, tapahtumatiedot ja useita muokkaustasoja. Yksi rajoittaa yksityisten tapahtumien tietoja, toinen sallii muokkauksen ja tiedot, laajin myös jakamisen hallinnan. Kaikki muokkausvaihtoehdot eivät vastaa toisiaan."
      ]
    },
    {
      "heading": "Tarkista koko kalenterin yleisö",
      "body": [
        "Nimettyjen henkilöiden lisäksi tarkista julkisuus, organisaatio ja ryhmäjako. Googlen mukaan laajempi oikeus voi ohittaa suppeamman: yhden henkilön rajoitus ei piilota jo julkisia tietoja.",
        "Tarkista esimerkiksi kerhon julkistetun aikataulun yleisö ennen henkilökohtaisen menon lisäämistä. Yhden ystävän kohdalla näkyvä asetus ei ole ainoa. Säilytä yksityiset menot sopivassa kalenterissa."
      ]
    },
    {
      "heading": "Avaa oikean kalenterin Google-asetukset",
      "body": [
        "Etsi kalenteri tietokoneen Google-kalenterissa ja avaa sen valikosta jakamisasetukset. Henkilöille ja ryhmille sekä laajemmalle pääsylle on eri alueet. Tarkista kalenterin nimi ja kirjautunut tili.",
        "Varmista vastaanottajan Google-identiteetti. Jos kalenteri puuttuu, tarkista osoite ja kutsu, älä laajenna oikeuksia vain saadaksesi sen näkyviin. Näkymän puuttuminen ja muokkausluvan puuttuminen ovat eri ongelmia."
      ]
    },
    {
      "heading": "Kokeile ilman yksityisiä tietoja",
      "body": [
        "Luo tavallinen koetapahtuma ilman yksityistä otsikkoa, muistiinpanoja, paikkaa tai vieraslistaa. Pyydä vastaanottajaa kertomaan mitä hän näkee ja vain tarvittaessa ja luvalla mitä hän voi muuttaa. Älä jaa tunnuksiasi.",
        "Kirjaa kalenteri ja rooli, ja tarkista tulos asetuksen muutoksen jälkeen. Koe ei todista aiemmin luetun tai kopioidun tiedon poistuneen. Älä julkaise oikeaa työaikataulua testiksi."
      ]
    },
    {
      "heading": "Erota organisaation säännöt sovelluksen tilauksesta",
      "body": [
        "Työ- tai koulutilin ylläpitäjä voi rajoittaa jakamista. Jos tarvittavaa asetusta ei ole, käytä organisaation hyväksymää tapaa. Älä julkaise työtietoja rajoituksen kiertämiseksi.",
        "Cloud Calendarsin tilaustasot eivät määritä Googlen oikeuksia. Advanced poistaa mainokset, ei anna toiselle pääsyä kaikkiin tapahtumiin. Tarkista palveluntarjoajan hyväksymä lopputulos, älä luota vain paikallisen muokkaimen saatavuuteen."
      ]
    },
    {
      "heading": "Poista tarpeettomat pääsyreitit",
      "body": [
        "Projektin jälkeen tarkista henkilöt, ryhmät ja laajempi julkaisu. Yhden nimen poistaminen ei riitä, jos muita reittejä on. Sopikaa aikataulun ja tulevien oikeuksien ylläpidosta.",
        "Google ohjeistaa henkilöiden tai ryhmien poistamisen ja yleisen jakamisen sulkemisen erikseen. Tämä ei palauta vietyjä tiedostoja, kuvakaappauksia tai kopioita. Käsittele ne erikseen asianosaisten kanssa."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Tunnista kalenteri ja vastaanottajan tehtävä.",
    "Tarkista henkilö-, ryhmä-, organisaatio- ja julkiset oikeudet.",
    "Valitse tehtävään sopiva nykyinen Google-oikeus.",
    "Varmista vastaanottajan identiteetti ennen muutosta.",
    "Tarkista harmiton koetapahtuma vastaanottajan näkökulmasta.",
    "Poista vanhat pääsyreitit olettamatta kopioiden häviävän."
  ],
  "faq": [
    {
      "q": "Ohittaako henkilökohtainen rajoitus julkisen kalenterin?",
      "a": "Ei. Googlen mukaan laajemmat kalenterioikeudet ovat ristiriidassa etusijalla. Tarkista julkiset ja organisaatioasetukset sekä henkilön oma oikeus."
    },
    {
      "q": "Näyttävätkö kaikki muokkausoikeudet yksityiset tapahtumat samoin?",
      "a": "Eivät. Google erottaa yksityisiin tapahtumiin rajoitetun muokkausvaihtoehdon muista muokkaus- ja jakamisenhallintaoikeuksista. Lue nykyinen tarkka lupa."
    },
    {
      "q": "Muuttaako Advanced Googlen jakamisoikeuksia?",
      "a": "Ei. Advanced poistaa Cloud Calendarsin mainokset. Pääsy riippuu kalenterin oikeuksista ja organisaation rajoituksista."
    }
  ],
  "sourcesHeading": "Googlen ajantasaiset jakamisohjeet",
  "sources": [
    {
      "label": "Google: kalenterioikeuden valinta",
      "url": "https://support.google.com/calendar/answer/15716974?hl=en"
    },
    {
      "label": "Google: jakaminen ja pääsyn poistaminen",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    }
  ],
  "seeAlso": [
    "why-a-shared-calendar-does-not-appear",
    "sharing-one-event-not-your-calendar"
  ]
},

  'why-a-shared-calendar-does-not-appear': {
    "updated": "2026-10-21",
    "title": "Kalenteri jaettiin sinulle, eikä sitä näy",
    "short": "Jaettu kalenteri ei ilmesty",
    "description": "Puuttuuko jaettu Google-kalenteri? Tarkista kutsuttu tili, ryhmä, näkyvyys ja saamasi linkin tyyppi.",
    "lede": "Oppaan on kirjoittanut Cloud Calendarsin kehittäjä Arte Soft. Erota ensin puuttuva käyttöoikeus kalenterista, joka on vain piilotettu.",
    "commonBelief": "Että jaetun kalenterin hyväksyminen tuo sen puhelimeen.",
    "sections": [
      {
        "heading": "Tarkista tili ja ryhmä",
        "body": [
          "Vertaa kutsun vastaanottajaa puhelimen ja selaimen Google-tiliin. Avaa kutsulinkki oikealla tilillä. Google tukee jakamista henkilöille ja Google-ryhmille. Jos oikeus tulee ryhmästä, pyydä ryhmän ylläpitäjää vahvistamaan jäsenyytesi ja kalenterin omistajaa tarkistamaan, että oikealla ryhmällä on pääsy. Edelleenlähetetty sähköposti ei yksin anna käyttöoikeutta."
        ]
      },
      {
        "heading": "Piilotettu, puuttuva vai rajoitettu?",
        "body": [
          "Avaa Google Kalenterin valikko iPhonessa tai iPadissa. Jos kalenteri näkyy luettelossa ilman valintaa, valitse se. Jos se puuttuu, pyydä omistajaa tarkistamaan pääsy: pyyntö ei ole hyväksyntä. Työpaikan tai koulun säännöt voivat rajoittaa jakamista. Vertaa samaa tiliä Google Kalenterin verkkoversiossa. Jos se toimii siellä, tarkista toisen sovelluksen yhdistetty tili ja kalenterivalinnat. Pelkkä lukuoikeus ei salli muokkaamista."
        ]
      },
      {
        "heading": "Tunnista linkki",
        "body": [
          "Myös jakamiskutsu sisältää linkin; kaikki linkit eivät ole ICS-tilauksia. Kysy, antaako linkki pääsyn Google-kalenteriin vai julkaiseeko se vain luettavan syötteen. Googlen mukaan uusi kalenteritilaus vaatii tietokoneen selaimen; jo sähköpostitse jaetun kalenterin avaaminen on eri toiminto. Syötteen päivitys riippuu vastaanottavasta palvelusta. Yleistä odotusaikaa ei ole; varmista kiireelliset muutokset järjestäjältä."
        ]
      }
    ],
    "claims": {},
    "faq": [
      {
        "q": "Voiko Google-ryhmä saada käyttöoikeuden?",
        "a": "Kyllä. Tarkista valittu ryhmä, jäsenyytesi ja organisaation rajoitukset. Edelleenlähetetty ryhmäviesti ei todista oikeutta."
      },
      {
        "q": "Pitääkö tili poistaa ja yhdistää uudelleen?",
        "a": "Tarkista ensin tili, oikeudet ja näkyvyys sekä vertaa verkkokalenteriin. Uudelleen yhdistäminen ei anna puuttuvia oikeuksia."
      }
    ],
    "practical": [
      "Varmista kutsuttu tili ja ryhmäjäsenyys.",
      "Valitse luettelossa oleva piilotettu kalenteri.",
      "Pyydä omistajaa tarkistamaan pääsy ennen yhteyksien muuttamista."
    ],
    "sourcesHeading": "Lähteet ja lisätietoja",
    "sources": [
      {
        "label": "Google: Tarkista tili ja ryhmä",
        "url": "https://support.google.com/calendar/answer/37082?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Piilotettu, puuttuva vai rajoitettu?",
        "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Tunnista linkki",
        "url": "https://support.google.com/calendar/answer/37648?hl=en"
      }
    ],
    "seeAlso": [
      "who-can-see-what-in-google-calendar",
      "google-calendars-that-never-reach-your-iphone"
    ]
  },

  'the-secret-address-of-a-google-calendar': {
    title: 'Mitä Google-kalenterin salainen osoite todella paljastaa',
    short: 'Salainen iCal-osoite',
    description:
      'Google tarjoaa yksityisen osoitteen, joka näyttää koko kalenterisi sille, jolla se on. Mitä se paljastaa ja miksi sitä ei oteta hiljaa takaisin.',
    lede: 'Jokaisen Google-kalenterin asetuksiin on haudattu linkki, joka näyttää kaiken siinä. Ei kirjautumista, ei oikeuksia, ei tietoa siitä, kuka sen avasi.',
    commonBelief: 'Että yksityinen osoite on yksityinen, koska sitä on vaikea löytää.',
    sections: [
      {
        heading: 'Linkki on salasana, jota ei voi vaihtaa yhdelle henkilölle',
        body: [
          'Salainen osoite kantaa täydet tiedot — otsikot, ajat, paikat, muistiinpanot. Linkin haltija näkee ne, eikä ole listaa siitä, keitä he ovat.',
          'Sen ainoa suoja on osoitteen satunnainen osa. Arvaamista vastaan se suojaa aidosti, edelleenlähetystä, jaettua näyttöä tai työsuhteen ylittävää dokumenttia vastaan ei lainkaan.',
        ],
      },
      {
        heading: 'Nollaus rikkoo sen kaikilta',
        body: [
          'Voit nollata osoitteen, jolloin vanha kuolee. Se kuolee myös jokaiselta kollegalta, jokaiselta näkymältä ja jokaiselta skriptiltä, joka hiljaa nojasi siihen, ilman varoitusta kenellekään.',
          'Tästä syystä sen kalenterin osoitetta, jossa elät, ei jaeta koskaan. Julkaise tarkoitusta varten tehty kalenteri, niin nollaus ei maksa mitään.',
        ],
      },
    ],
    claims: {
      linkLength: 'Satunnaismerkit, jotka suojaavat meidän jakolinkkiämme',
      sharePrice: 'Mitä tapahtuman jakaminen sovelluksesta maksaa',
    },
    faq: [
      {
        q: 'Mitä joku voi tehdä kalenterini salaisella osoitteella?',
        a: 'Nähdä kaiken siinä — otsikot, ajat, paikat ja muistiinpanot — ilman kirjautumista, ilman oikeuksia ja ilman että mihinkään jää merkintää katsomisesta.',
      },
      {
        q: 'Voinko ottaa salaisen kalenteriosoitteen takaisin?',
        a: 'Vain nollaamalla sen, mikä tappaa vanhan kaikilta yhtä aikaa: kollegoilta, näkymiltä ja jokaiselta skriptiltä, joka hiljaa nojasi siihen, ilman varoitusta.',
      },
      {
        q: 'Voinko lähettää salaisen osoitteen kollegalle sähköpostilla?',
        a: 'Käsittele sitä julkisena siitä hetkestä, kun se lähtee käsistäsi. Sen ainoa suoja on vaikeasti arvattavuus, ja edelleenlähetys kumoaa juuri sen.',
      },
    ],
    practical: [
      'Käsittele salaista osoitetta julkisena siitä hetkestä, kun se lähtee käsistäsi.',
      'Älä koskaan julkaise sen kalenterin osoitetta, jota oikeasti käytät.',
      'Nollaa se, kun joku lähtee, ja kerro niille, joilta se katkeaa.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'taking-back-a-calendar-you-shared'],
  },

  'what-guests-can-do-to-your-event': {
    title: 'Mitä vieraasi voivat tehdä tapahtumallesi',
    short: 'Vieraiden oikeudet',
    description:
      'Kolme valintaruutua ratkaisee, voiko vieras siirtää palaverisi, kutsua tuntemattomia tai lukea koko listan. Ne ovat päällä useammin kuin luullaan.',
    lede: 'Kutsuminen antaa enemmän kuin paikan ja ajan. Tavallisessa Google-tapahtumassa vieras yleensä näkee, ketä muita on pyydetty, ja saa usein lisätä listalle.',
    commonBelief: 'Että vieras voi vain hyväksyä tai kieltäytyä.',
    sections: [
      {
        heading: 'Kolme ruutua',
        body: [
          'Muokkaa tapahtumaa antaa vieraan vaihtaa ajan, paikan ja otsikon kaikilta. Harvoin haluttua, helposti päälle jäävää.',
          'Kutsu muita antaa lisätä ihmisiä, joita et ole koskaan tavannut. Näe vieraslista näyttää kaikki pyydetyt ja heidän vastauksensa — tiimissä sopivaa, asiakkaan kanssa kiusallista, väärin kaikessa, mikä muistuttaa erillisten asiakkaiden joukkoa.',
        ],
      },
      {
        heading: 'Missä tämä menee hiljaa pieleen',
        body: [
          'Yksi tapahtuma, monta erillistä vastaanottajaa, lista näkyvissä: nyt jokaisella on kaikki. Tuon yhden ruudun poistaminen on ero palaverin ja vuotaneen osoitekirjan välillä.',
          'Asetukset asuvat tapahtumassa, eivät tilissä, joten ne palaavat oletuksiisi joka kerta ja ne on mietittävä niissä tapahtumissa, joilla on väliä, ei kerran.',
        ],
      },
    ],
    claims: {
      sharePrice: 'Mitä yksittäisen tapahtuman lähettäminen sovelluksesta maksaa',
    },
    faq: [
      {
        q: 'Näkevätkö vieraat toisensa Google-kalenterin kutsussa?',
        a: 'Oletuksena useimmiten kyllä. «Näe vieraslista» näyttää kaikki kutsutut ja heidän vastauksensa: tiimissä sopivaa, asiakkaan kanssa kiusallista, ja väärin kun vieraat ovat erillisiä asiakkaita.',
      },
      {
        q: 'Voiko vieras muuttaa palaverini kellonaikaa?',
        a: 'Jos «muokkaa tapahtumaa» on valittuna, kyllä, ja muutos koskee kaikkia. Harvoin haluttua ja helposti päälle jäävää.',
      },
      {
        q: 'Miten estän vieraita kutsumasta muita?',
        a: 'Poista «kutsu muita» itse tapahtumasta. Asetukset kuuluvat tapahtumalle eivätkä tilille, joten ne palaavat oletuksiisi joka kerta.',
      },
    ],
    practical: [
      'Poista «näe vieraslista» kaikesta, mikä lähtee toisilleen tuntemattomille.',
      'Pidä «muokkaa tapahtumaa» pois päältä, ellei joku oikeasti suunnittele puolestasi.',
      'Tarkista ruudut tapahtumasta, älä asetuksista: siellä ne asuvat.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'why-a-shared-calendar-does-not-appear'],
  },

  'google-calendars-that-never-reach-your-iphone': {
    title: 'Miksi osa Google-kalentereista ei koskaan päädy iPhoneen',
    short: 'Google-kalentereita puuttuu iPhonesta',
    description:
      'Yksi Google-tili, useita kalentereita ja vain yksi puhelimessa. Synkronointilista, joka päättää sen, ja mitä tehdä sen sijaan.',
    lede: 'Google-tilissäsi on kahdeksan kalenteria. iPhone näyttää kaksi. Mikään ei ole rikki: jokin, jota et ole koskaan nähnyt, valitsi puolestasi.',
    commonBelief: 'Että Google-tilin lisääminen iPhoneen lisää sen sisältämät kalenterit.',
    sections: [
      {
        heading: 'Lista, jota sinulle ei ole näytetty',
        body: [
          'Google pitää laitekohtaista listaa siitä, mitkä kalenterit saavat synkronoitua, ja toissijaiset kalenterit — jaetut, tilatut, jotakin projektia varten tehdyt — ovat usein sen ulkopuolella.',
          'Lista ei ole iOS:n asetuksissa. Se asuu omalla Google-sivullaan, ja siksi ilmeisestä paikasta ei löydy mitään vikaa eikä mikään muutu.',
        ],
      },
      {
        heading: 'Toinen reitti',
        body: [
          'Sovellus, joka puhuu suoraan Googlelle, ei käytä tuota listaa, joten se näyttää jokaisen kalenterin, joka tilillä todella on, myös ne, jotka puhelin hiljaa pudotti.',
          'Samalla tilit tulevat yhteen. Yksi näkymä, jossa on henkilökohtainen, työ ja jaettu, on koko pointti; se, olisiko puhelin synkronoinut kunkin niistä, lakkaa olemasta kysymys.',
        ],
      },
    ],
    claims: {
      accounts: 'Tilityypit, jotka yksi näkymä pitää koossa',
      price: 'Mitä Googlen puoli maksaa',
    },
    faq: [
      {
        q: 'Miksi vain osa Google-kalentereistani näkyy iPhonessa?',
        a: 'Google pitää laitekohtaista listaa siitä, mitkä kalenterit saavat synkronoitua, ja toissijaiset — jaetut, tilatut, projektia varten tehdyt — ovat usein sen ulkopuolella.',
      },
      {
        q: 'Missä Google-kalenterin synkronointiasetus on iPhonella?',
        a: 'Ei iOS:n asetuksissa. Se asuu omalla Google-sivullaan, ja siksi ilmeisestä paikasta ei löydy vikaa eikä mikään muutu.',
      },
      {
        q: 'Miten näen kaikki Google-kalenterini iPhonessa?',
        a: 'Sovelluksella, joka kysyy Googlelta suoraan laitteen listan sijaan. Se näyttää jokaisen kalenterin, joka tilillä todella on, myös puhelimen pudottamat.',
      },
    ],
    practical: [
      'Tarkista Googlen synkronointilista ennen kuin oletat tilin rikkinäiseksi.',
      'Odota, että tilatut ja jaetut kalenterit on jätetty pois eikä otettu mukaan.',
      'Jos kalentereita on enemmän kuin pari, lue ne jollakin, joka kysyy Googlelta suoraan.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'icloud-google-and-outlook-in-one-view'],
  },

  'taking-back-a-calendar-you-shared': {
  "title": "Lopeta kalenterin jakaminen: poista käyttöoikeus ja tarkista muut reitit",
  "short": "Tarkista ja poista jaetut käyttöoikeudet",
  "description": "Lopeta kalenterin jakaminen erottamalla henkilöt, ryhmät, julkinen käyttö ja syötelinkit. Tarkista muutos ja miksi tallennetut kopiot voivat jäädä.",
  "lede": "Yhteistyön päättäminen alkaa siitä, että selvität, miten käyttöoikeus annettiin. Henkilön poistaminen, julkaisemisen estäminen ja syöteosoitteen nollaaminen ovat eri toimia. Tämän oppaan julkaisee Cloud Calendarsin kehittäjä Arte Soft.",
  "commonBelief": "Yhden vastaanottajan poistaminen palauttaa heti kaikki kalenterikopiot ja sulkee kaikki muut pääsyreitit aikatauluun.",
  "sections": [
    {
      "heading": "Tunnista kalenteri ja jakamistapa",
      "body": [
        "Varmista omistajan tili, kalenteri ja tarkoitettu yleisö ennen käyttöoikeuden muuttamista. Nimetylle kollegalle jaettu Google-kalenteri eroaa julkisesta kalenterista, ryhmän oikeudesta ja tilausosoitteesta. Cloud Calendarsissa on lisäksi omat tapahtumien ja kalenterien jakamissuhteensa.",
        "Esimerkiksi yhdistyksen sihteeri voi saada muokkausoikeuden henkilökohtaisella kutsulla, kun jäsenet seuraavat julkaistua aikataulua. Sihteerin henkilökohtaisen oikeuden poistaminen ei kerro, mitä jäsenten tilauksille pitäisi tehdä. Listaa ne jakamisjärjestelyt, jotka todella olet luonut."
      ]
    },
    {
      "heading": "Poista tarkoitettu Google-oikeus",
      "body": [
        "Google kuvaa erilliset asetukset nimetyille henkilöille tai ryhmille, organisaation laajuiselle jakamiselle ja julkiselle saatavuudelle. Avaa tietokoneella kyseisen kalenterin jakamisasetukset ja muuta oikeaa merkintää tai laajempaa asetusta. Tarkista ensin kirjautunut tili ja kalenterin nimi.",
        "Henkilöllä voi olla edelleen toinen pääsyreitti, kuten ryhmä tai laajempi julkaisu. Tarkista koko järjestely sen sijaan, että poistaisit saman sähköpostiosoitteen toistuvasti. Työpaikan tai oppilaitoksen käytännöt voivat rajoittaa asetuksia; käytä tarvittaessa omistajan tai ylläpitäjän hyväksymää menettelyä."
      ]
    },
    {
      "heading": "Käsittele salainen kalenteriosoite erikseen",
      "body": [
        "Googlen mukaan salainen iCal-osoite on omaa käyttöäsi varten toisessa kalenterisovelluksessa, eikä sitä pidä antaa muille. Jos osoite on paljastunut, Google ohjeistaa nollaamaan sen, jolloin vanha osoite lakkaa toimimasta. Tämä on eri toimi kuin nimetyn henkilön poistaminen.",
        "Ennen kuin muutat itse käyttämääsi tilausosoitetta, selvitä siitä riippuvat kalenteriohjelmat ja työkalut, jotta voit yhdistää haluamasi uudelleen. Älä liitä salaista URL-osoitetta julkiseen tukiviestiin äläkä lähetä sitä todisteena oikean kalenterin löytämisestä. Viittaa sen sijaan kalenterin nimeen ja yhteystyyppiin."
      ]
    },
    {
      "heading": "Erota Cloud Calendarsin vastaanottajat syötelinkeistä",
      "body": [
        "Cloud Calendarsissa vastaanottajan pääsy tapahtumaan tai kalenteriin ja annettu tilaussyöte ovat eri mekanismeja. Tarkista todellinen jakamissuhde ja kyseinen linkki ennen toimenpiteen valintaa. Tietyn vastaanottajan poistaminen ei ole yleinen lupaus kaikkien aiemmin jaettujen URL-osoitteiden tai itsenäisten kopioiden takaisinvedosta.",
        "Jos kanssajärjestäjän tarvitsee vain lopettaa muokkaaminen, arvioi tarkoitettu rooli ja jäljelle jäävä yleisö jaetun aikataulun poistamisen sijaan. Jos koko yhteistyö päättyy, selvitä kalenterin omistaja ja se, kenen tulee säilyttää kalenteri. Vastaanotetusta kalenterista poistuminen ja oman kalenterin poistaminen ovat eri päätöksiä."
      ]
    },
    {
      "heading": "Varmista tulos lupaamatta välitöntä katoamista",
      "body": [
        "Tarkista, että tarkoitettu muutos on tallennettu kalenteria hallinnoivaan järjestelmään. Jos valtuutettu kollega voi auttaa, varmista katselu- tai muokkaustulos hänen omalta tililtään jakamatta salasanoja. Erota pääsyn epääminen vanhasta tapahtumasta, joka näkyy yhä välimuistissa tai tuodussa kopiossa.",
        "Älä lupaa yleispätevää päivitysväliä tai sitä, ettei ilmoitusta lähetetä. Kerro ryhmän vastuunvaihdossa, mitä aikataulua jatkossa käytetään. Näkyvä vanha merkintä ei yksin kerro, onko henkilöllä yhä ajantasainen pääsy, jokin muu oikeus vai itsenäinen kopio."
      ]
    },
    {
      "heading": "Käsittele aiemmat kopiot erillisenä jatkotoimena",
      "body": [
        "Aiemmin viedyt tiedostot, kuvakaappaukset, viestit ja erikseen tallennetut tapaamiset voivat jäädä käyttöoikeuden muuttamisen jälkeen. Päätä, mitkä kopiot ovat vastuunvaihdon kannalta olennaisia, ja keskustele niiden käsittelystä asianosaisten kanssa. Kalenterioikeuden muuttaminen ei osoita, mitä kukin vastaanottaja on jo tallentanut.",
        "Säilytä tarvittavat alkuperäiset tiedot tulosta tarkistaessasi. Älä siirrä arkaluonteisia kokouksia toiseen jaettuun kalenteriin vain saadaksesi vanhan näyttämään tyhjältä äläkä peru oikeita kutsuja käyttöoikeustestinä. Kirjaa kalenteri, pääsyreitti ja tehty muutos, jotta myöhemmällä vianmäärityksellä on selkeä lähtökohta."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Tunnista omistajan tili, kalenteri ja jakamistapa.",
    "Tarkista nimetyt henkilöt, ryhmät ja laajempi julkaiseminen erikseen.",
    "Käytä Googlen tai Cloud Calendarsin asianmukaisia jakamisasetuksia.",
    "Päätä paljastuneen salaisen syöteosoitteen nollaamisesta erikseen.",
    "Varmista tallennettu käyttöoikeustulos jakamatta tunnuksia.",
    "Suunnittele aiempien vientien ja kopioiden käsittely erillään ajantasaisesta pääsystä."
  ],
  "faq": [
    {
      "q": "Poistaako yhden henkilön poistaminen julkisen kalenterin tai hänen ryhmäpääsynsä?",
      "a": "Älä oleta niin. Tarkista jokainen todellinen reitti. Google kuvaa nimetyt vastaanottajat, ryhmät ja laajemman julkaisemisen erillisinä asetuksina."
    },
    {
      "q": "Katoaako kalenteri heti ja ilman ilmoitusta?",
      "a": "Katoamisesta, ilmoituksista tai päivitysajasta ei ole tässä yleispätevää lupausta. Varmista tallennettu käyttöoikeusmuutos ja erota ajantasainen pääsy välimuistissa olevista tai tuoduista tiedoista."
    },
    {
      "q": "Ostaako Advanced mahdollisuuden poistaa Google-kalenterin käyttöoikeuden?",
      "a": "Advanced poistaa mainokset Cloud Calendarsista. Googlen jakamisasetukset riippuvat omistajuudesta, oikeuksista ja organisaation säännöistä, eivät kyseisestä sovelluksen paketista."
    }
  ],
  "sourcesHeading": "Palveluntarjoajan ohjeet käyttöoikeuksiin ja tilauksiin",
  "sources": [
    {
      "label": "Google: jakamisasetukset ja pääsyn lopettaminen",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Google: tilien synkronointi ja salaiset iCal-osoitteet",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "the-secret-address-of-a-google-calendar"
  ],
  "updated": "2026-10-21"
},
};
