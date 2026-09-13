import { LocalisedArticle } from '../types';

/** Kuusi Google-artikkelia: täsmällisiä kysymyksiä, selkeitä vastauksia. */
export const GOOGLE_FI: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
    title: 'Kuka näkee mitä, kun jaat Google-kalenterin',
    short: 'Googlen jako-oikeudet',
    description:
      'Googlen jakotasot asetetaan nopeasti ja ymmärretään helposti väärin. Mitä kukin niistä todella paljastaa, selvin sanoin.',
    lede: 'Lähes kaikki vahingossa tapahtunut liikajakaminen ei ole arviointivirhe. Joku valitsi tason, joka kuulosti vaatimattomalta eikä ollut sitä.',
    commonBelief: 'Että «näytä vain varattu/vapaa» ja «näytä kaikki tiedot» eroavat vähän.',
    sections: [
      {
        heading: 'Tasot ovat kauempana toisistaan kuin kuulostavat',
        body: [
          'Varattu/vapaa näyttää aikalohkoja ilman otsikoita. Kaikki tiedot näyttää otsikot, paikat, muistiinpanot ja vieraat — useimmissa kalentereissa siis melkoisen osan elämästäsi.',
          'Tee muutoksia antaa muokkausoikeuden. Hallitse jakamista antaa oikeuden luovuttaa kalenterisi eteenpäin muille, ja juuri se yllättää myöhemmin.',
        ],
      },
      {
        heading: 'Valinta ilman pohdintaa joka kerta',
        body: [
          'Kollegoille, joiden pitää vain sovittaa aikoja ympärillesi, varattu/vapaa on lähes aina oikea vastaus ja lähes koskaan valittu.',
          'Säästä täydet tiedot kalentereihin, jotka on tehty jaettaviksi, älä siihen, jossa elät.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Kuukausihinta tasolle, jolla tätä hallitaan sovelluksessa, dollareina',
    },
    faq: [
      {
        q: 'Näkyvätkö tapahtumieni otsikot, jos jaan vain varattu/vapaa?',
        a: 'Ei. Varattu/vapaa näyttää aikalohkoja ilman otsikoita, paikkoja, muistiinpanoja tai vieraita. Vasta «kaikki tiedot» paljastaa ne — ja silloin kaikki.',
      },
      {
        q: 'Mitä «tee muutoksia ja hallitse jakamista» sallii?',
        a: 'Muokata jokaista tapahtumaa ja luovuttaa kalenterisi eteenpäin muille kysymättä sinulta. Se on ainoa taso, jolla joku muu jakaa käyttöoikeuksia.',
      },
      {
        q: 'Voinko tarkistaa, kenellä on jo pääsy kalenteriini?',
        a: 'Kyllä, kyseisen kalenterin jakoasetuksista. Mikään ei kehota katsomaan ja jakoja vain kertyy: lue lista kahdesti vuodessa.',
      },
    ],
    practical: [
      'Oletuksena varattu/vapaa kaikille, joiden tarvitsee vain varata aikaa kanssasi.',
      'Säästä «tee muutoksia» niille, jotka oikeasti suunnittelevat puolestasi.',
      'Käy käyttöoikeudet läpi kahdesti vuodessa; jakoja kertyy eikä mikään muistuta niistä.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'what-guests-can-do-to-your-event'],
  },

  'why-a-shared-calendar-does-not-appear': {
    title: 'Kalenteri jaettiin sinulle, eikä sitä näy',
    short: 'Jaettu kalenteri ei ilmesty',
    description:
      'Joku jakoi kalenterin, hyväksyit sen eikä mikään muuttunut. Neljä tavallista syytä siinä järjestyksessä, jossa ne kannattaa tarkistaa.',
    lede: 'Kutsu tuli, linkkiä painettiin, ja kalenteri puuttuu yhä. Lähes aina kyse on yhdestä neljästä asiasta, eikä yksikään niistä ole rikkinäinen jako.',
    commonBelief: 'Että jaetun kalenterin hyväksyminen tuo sen puhelimeen.',
    sections: [
      {
        heading: 'Hyväksyminen lisää sen tiliin, ei laitteeseen',
        body: [
          'Jako laskeutuu siihen Google-tiliin, jolle se osoitettiin. Jos hyväksyit yhdellä tilillä kirjautuneena ja puhelimessasi on toinen, kalenteri lepää turvassa juuri siellä, minne et katso.',
          'Oikeassakin tilissä juuri lisätty kalenteri saapuu muille laitteille useammin pois päältä kuin päällä. Se on olemassa, sitä ei vain ole rastitettu — ja rastittamaton kalenteri näyttää täsmälleen puuttuvalta.',
        ],
      },
      {
        heading: 'Kaksi muuta syytä',
        body: [
          'Jako postituslistalle tai ryhmäosoitteeseen tavoittaa yksilöitä harvoin; tarvitaan osoite, joka todella on Google-tili. Ja linkkinä jaettu kalenteri on tilaus: se päätyy listan toiseen kohtaan ja päivittyy julkaisijan tahdissa eikä heti.',
          'iPhonessa Google-kalenterit tulevat sisäänrakennettuun sovellukseen omaa synkronointilistaansa pitkin, ja toissijaiset kalenterit ovat oletuksena sen ulkopuolella. Siksi yksi tili näyttää pääkalenterinsa ja pudottaa hiljaa ne neljä, joilla on väliä.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Tunnit tilatun syötteen päivityspyyntöjen välillä',
      accounts: 'Tilityypit, jotka yksi näkymä pitää koossa ilman tätä kaikkea',
    },
    faq: [
      {
        q: 'Hyväksyin jaetun kalenterin, mutta sitä ei ole iPhonessa. Miksi?',
        a: 'Jako laskeutuu siihen Google-tiliin, jolle se osoitettiin, ja juuri lisätty kalenteri saapuu muille laitteille yleensä pois päältä. Tarkista ensin tili ja etsi sitä sitten rastittamattomana, ei puuttuvana.',
      },
      {
        q: 'Toimiiko jakaminen ryhmäosoitteeseen?',
        a: 'Harvoin. Postituslista ei juuri tavoita sen takana olevia ihmisiä. Tarvitaan osoite, joka on itse Google-tili.',
      },
      {
        q: 'Kuinka kauan jaetun kalenterin ilmestyminen kestää?',
        a: 'Käyttöoikeuksilla jaettu näkyy heti kun lista päivittyy. Linkkinä jaettu kalenteri on tilaus ja päivittyy julkaisijan tahdissa.',
      },
    ],
    practical: [
      'Tarkista ensin, mikä tili hyväksyi jaon, vasta sitten muu.',
      'Avaa laitteen kalenterilista ja etsi sitä pois päältä olevana, älä puuttuvana.',
      'Jos se tuli linkkinä, odota viivettä eikä välitöntä ilmestymistä.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'google-calendars-that-never-reach-your-iphone'],
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
    title: 'Jaetun kalenterin ottaminen takaisin',
    short: 'Käyttöoikeuden poisto',
    description:
      'Henkilön poistaminen kalenterista pysäyttää sen, mikä tulee tämän jälkeen. Se ei kumoa sitä, mikä on jo tapahtunut.',
    lede: 'Käyttöoikeuden päättäminen on yksi painallus. Sen ratkaiseminen, riittääkö yksi, vie hieman kauemmin, sillä jakaminen jättää kopioita.',
    commonBelief: 'Että henkilön poistaminen poistaa sen, minkä hän on nähnyt.',
    sections: [
      {
        heading: 'Mikä loppuu ja mikä jää',
        body: [
          'Poista henkilö, ja kalenteri katoaa hänen listaltaan heti ja ilman viestiä. Tulevat tapahtumat eivät koskaan tavoita häntä.',
          'Mikä ei palaa: jo saadut kutsut, omaan kalenteriin kopioidut tapahtumat, kaikki viety ja kaikki, mihin on annettu salainen osoite. Käyttöoikeus päättyy; muisti ei.',
        ],
      },
      {
        heading: 'Se, mikä selviää poistosta',
        body: [
          'Jos jollakulla on joskus ollut oikeus hallita jakamista, hän on voinut lisätä muita. Hänen poistamisensa jättää heidät paikoilleen — näin kalenteri päätyy jaetuksi jollekulle, jonka kutsumista kukaan ei muista.',
          'Lue siis koko lista sen sijaan, että poistat yhden nimen, ja tee se lähtöhetkellä, älä kuukausia myöhemmin. Mikään ei muistuta, ja jakoja vain kertyy.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Kuukausihinta tasolle, jolla tätä hallitaan, dollareina',
    },
    faq: [
      {
        q: 'Poistaako henkilön poistaminen sen, minkä hän on jo nähnyt?',
        a: 'Ei. Jo saadut kutsut, omaan kalenteriin kopioidut tapahtumat ja kaikki viety jäävät. Käyttöoikeus päättyy, kopiot eivät.',
      },
      {
        q: 'Saako henkilö tiedon siitä, että poistin hänen oikeutensa?',
        a: 'Ei. Kalenteri katoaa hänen listaltaan heti ja ilman viestiä.',
      },
      {
        q: 'Miksi kalenterini on jaettu jollekulle, jota en ole koskaan kutsunut?',
        a: 'Joku, jolla oli oikeus hallita jakamista, lisäsi hänet. Sen henkilön poistaminen jättää kaikki hänen lisäämänsä paikoilleen — siksi luetaan koko lista eikä yhtä nimeä.',
      },
    ],
    practical: [
      'Lue koko käyttöoikeuslista, älä vain sitä nimeä, jonka aioit poistaa.',
      'Nollaa salainen osoite, jos henkilöllä on se koskaan ollut.',
      'Oleta, että kopiot jäävät: siirrä todella arka asia sen sijaan, että piilottaisit sen.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
