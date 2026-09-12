import { LocalisedArticle } from '../types';

/** A hat Google-cikk: pontos kérdések, világos válaszok. */
export const GOOGLE_HU: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
    title: 'Ki mit lát, ha megoszt egy Google-naptárat',
    short: 'Google megosztási jogok',
    description:
      'A Google megosztási szintjeit gyorsan be lehet állítani és könnyű félreérteni. Mit tár fel valójában mindegyik, egyszerűen elmondva.',
    lede: 'A véletlen túlmegosztás szinte soha nem ítélethiba. Valaki olyan szintet választott, amely szerénynek hangzott, és nem volt az.',
    commonBelief: 'Hogy a „csak szabad/foglalt” és a „minden esemény részletei” között kicsi a különbség.',
    sections: [
      {
        heading: 'A szintek távolabb vannak egymástól, mint ahogy hangzanak',
        body: [
          'A szabad/foglalt időblokkokat mutat cím nélkül. A minden részlet címeket, helyszíneket, jegyzeteket és vendégeket mutat — a legtöbb naptárnál ez az életed tekintélyes része.',
          'A módosítás joga szerkesztést enged. A megosztás kezelése azt engedi, hogy valaki továbbadja a naptáradat másoknak, és ez az, ami később meglepetést okoz.',
        ],
      },
      {
        heading: 'Választani anélkül, hogy minden alkalommal gondolkodni kellene',
        body: [
          'Azoknak a kollégáknak, akiknek csak köréd kell időt szervezniük, a szabad/foglalt szinte mindig a helyes válasz — és szinte soha nem ezt kapják.',
          'A teljes részleteket hagyd a megosztásra készült naptáraknak, ne annak, amelyikben élsz.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Annak a szintnek a havi ára, ahol ezt az alkalmazásban kezeled, dollárban',
    },
    practical: [
      'Alapértelmezésben szabad/foglalt mindenkinek, akinek csak időpontot kell foglalnia nálad.',
      'A „módosítás” joga azoké, akik tényleg helyetted szerveznek.',
      'Évente kétszer nézd át, kinek van hozzáférése; a megosztások gyűlnek, és semmi nem emlékeztet rájuk.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'what-guests-can-do-to-your-event'],
  },

  'why-a-shared-calendar-does-not-appear': {
    title: 'Megosztottak veled egy naptárat, és nincs sehol',
    short: 'A megosztott naptár nem jelenik meg',
    description:
      'Valaki megosztott egy naptárat, elfogadtad, és semmi nem változott. A négy szokásos ok, abban a sorrendben, ahogy érdemes nézni őket.',
    lede: 'A meghívó megérkezett, a linkre rákoppintottál, a naptár pedig továbbra sincs meg. Szinte mindig négy dolog egyike, és egyik sem az, hogy elromlott a megosztás.',
    commonBelief: 'Hogy egy megosztott naptár elfogadása felteszi azt a telefonodra.',
    sections: [
      {
        heading: 'Az elfogadás fiókhoz adja hozzá, nem eszközhöz',
        body: [
          'A megosztás abba a Google-fiókba érkezik, amelyiknek címezték. Ha az egyik fiókkal bejelentkezve fogadtad el, a telefonod pedig másikat visel, a naptár épségben ott van, ahová éppen nem nézel.',
          'Még a jó fiókban is a frissen hozzáadott naptár gyakrabban érkezik kikapcsolva a többi eszközre, mint bekapcsolva. Létezik, csak nincs kipipálva — és egy kipipálatlan naptár pontosan úgy néz ki, mint egy hiányzó.',
        ],
      },
      {
        heading: 'A másik két ok',
        body: [
          'A levelezőlistára vagy csoportcímre küldött megosztás ritkán ér el embereket; az a cím kell, amelyik valóban Google-fiók. A linkként megosztott naptár pedig előfizetés: a lista másik részébe kerül, és a közzétevő ritmusában frissül, nem azonnal.',
          'iPhone-on a Google-naptárak saját szinkronizálási listán át jutnak el a beépített alkalmazásba, és a másodlagos naptárak alapból kívül esnek rajta. Ezért mutat egy fiók főnaptárat, és ejti csendben azt a négyet, amelyik számít.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Órák egy előfizetett csatorna frissítési kérései között',
      accounts: 'Fióktípusok, amelyeket egyetlen nézet ehelyett összefog',
    },
    practical: [
      'Először azt nézd meg, melyik fiók fogadta el a megosztást.',
      'Nyisd meg az eszközön a naptárlistát, és kikapcsolva keresd, ne hiányzóként.',
      'Ha linkként jött, késésre számíts, ne azonnali megjelenésre.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'google-calendars-that-never-reach-your-iphone'],
  },

  'the-secret-address-of-a-google-calendar': {
    title: 'Mit ad ki valójában egy Google-naptár titkos címe',
    short: 'A titkos iCal-cím',
    description:
      'A Google kínál egy privát címet, amely a teljes naptáradat megmutatja annak, akinél van. Mit tár fel, és miért nem lehet csendben visszavenni.',
    lede: 'Minden Google-naptár beállításai közt ott lapul egy link, amely mindent megmutat, ami rajta van. Bejelentkezés nélkül, engedély nélkül, anélkül hogy nyoma maradna, ki nyitotta meg.',
    commonBelief: 'Hogy egy privát cím attól privát, hogy nehéz megtalálni.',
    sections: [
      {
        heading: 'A link olyan jelszó, amelyet nem lehet egyvalakinek megváltoztatni',
        body: [
          'A titkos cím teljes részleteket visz — címeket, időpontokat, helyszíneket, jegyzeteket. Látja mindenki, akinél a link van, és nincs lista arról, kik ők.',
          'Egyetlen védelme a cím véletlenszerű része. A találgatás ellen ez valódi védelem, a továbbküldés, a megosztott képernyő vagy a munkahelyet túlélő dokumentum ellen semmilyen.',
        ],
      },
      {
        heading: 'A visszaállítás mindenkinek elrontja',
        body: [
          'A címet vissza lehet állítani, és a régi meghal. Meghal minden kollégának, minden műszerfalnak és minden szkriptnek is, amelyik csendben rá támaszkodott — figyelmeztetés nélkül.',
          'Ez az érv amellett, hogy soha ne oszd ki annak a naptárnak a címét, amelyikben élsz. Tegyél közzé egy erre a célra készült naptárat, és a visszaállítás semmibe sem kerül.',
        ],
      },
    ],
    claims: {
      linkLength: 'Véletlen karakterek, amelyek a mi megosztási linkünket védik',
      sharePrice: 'Mennyibe kerül egy esemény megosztása az alkalmazásból',
    },
    practical: [
      'Kezeld nyilvánosként a titkos címet abban a pillanatban, ahogy kikerül a kezedből.',
      'Soha ne tedd közzé annak a naptárnak a címét, amelyiket valóban használod.',
      'Állítsd vissza, ha valaki távozik, és szólj azoknak, akiknél ettől elromlik.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'taking-back-a-calendar-you-shared'],
  },

  'what-guests-can-do-to-your-event': {
    title: 'Mit tehetnek a vendégeid egy eseményeddel',
    short: 'Vendégjogosultságok',
    description:
      'Három jelölőnégyzet dönti el, hogy egy vendég átteheti-e a megbeszélésedet, meghívhat-e idegeneket, vagy elolvashatja-e a teljes listát. Gyakrabban vannak bekapcsolva, mint gondolnád.',
    lede: 'Meghívni valakit többet ad helynél és időpontnál. Egy szokásos Google-eseményben a vendég általában látja, kit hívtál még, és gyakran hozzá is adhat másokat.',
    commonBelief: 'Hogy egy vendég csak elfogadni vagy elutasítani tud.',
    sections: [
      {
        heading: 'A három négyzet',
        body: [
          'Az esemény módosítása engedi, hogy a vendég mindenkinek megváltoztassa az időpontot, a helyet és a címet. Ritkán szeretnénk, könnyen bekapcsolva marad.',
          'A mások meghívása engedi, hogy olyanokat adjon hozzá, akikkel soha nem találkoztál. A vendéglista megtekintése megmutatja az összes meghívottat és a válaszukat — csapatban rendben van, ügyfélnél kínos, bármiben, ami különálló ügyfelek csoportjára hasonlít, hibás.',
        ],
      },
      {
        heading: 'Hol romlik el ez csendben',
        body: [
          'Egy esemény, sok külön címzett, látható lista: most mindenkinél ott van mindenki. Ez az egy négyzet a különbség egy megbeszélés és egy kiszivárgott címjegyzék között.',
          'A beállítások az eseményben laknak, nem a fiókban, így minden alkalommal visszaállnak az alapértelmezésre, és a fontos eseményeknél kell átgondolni őket, nem egyszer s mindenkorra.',
        ],
      },
    ],
    claims: {
      sharePrice: 'Mennyibe kerül egyetlen esemény küldése az alkalmazásból',
    },
    practical: [
      'Kapcsold ki a „vendéglista megtekintése” jogot mindennél, ami egymást nem ismerő embereknek megy.',
      'Hagyd kikapcsolva az „esemény módosítása” jogot, hacsak valaki tényleg helyetted nem szervez.',
      'A négyzeteket az eseményen nézd, ne a beállításokban: ott laknak.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'why-a-shared-calendar-does-not-appear'],
  },

  'google-calendars-that-never-reach-your-iphone': {
    title: 'Miért nem jut el néhány Google-naptár soha az iPhone-odra',
    short: 'Hiányzó Google-naptárak iPhone-on',
    description:
      'Egy Google-fiók, több naptár, és csak egy a telefonon. A szinkronizálási lista, amely ezt eldönti, és hogy mit érdemes tenni helyette.',
    lede: 'A Google-fiókod nyolc naptárat tart. Az iPhone-od kettőt mutat. Semmi nem romlott el: valami, amit soha nem láttál, döntött helyetted.',
    commonBelief: 'Hogy egy Google-fiók hozzáadása az iPhone-hoz hozzáadja a benne lévő naptárakat is.',
    sections: [
      {
        heading: 'Egy lista, amelyet soha nem mutattak meg',
        body: [
          'A Google eszközönként vezet listát arról, mely naptárak szinkronizálhatnak, és a másodlagos naptárak — a megosztottak, az előfizetettek, a projektre létrehozottak — gyakran kívül esnek rajta.',
          'Ez a lista nincs az iOS beállításaiban. Külön Google-oldalon él, és ezért nem talál semmi hibát az, aki a kézenfekvő helyen keres, és semmi sem változik.',
        ],
      },
      {
        heading: 'A másik út',
        body: [
          'Az az alkalmazás, amely közvetlenül a Google-lel beszél, nem használja ezt a listát: minden naptárat megmutat, ami a fiókban valóban ott van, azokat is, amelyeket a telefon csendben elejtett.',
          'Ez össze is hozza a fiókokat. Egy nézet, amely a magánt, a munkát és a megosztottat tartja, épp ez a lényeg; hogy a telefon mindegyiket szinkronizálta volna-e, megszűnik kérdés lenni.',
        ],
      },
    ],
    claims: {
      accounts: 'Fióktípusok, amelyeket egyetlen nézet összefog',
      price: 'Mennyibe kerül a Google-oldal',
    },
    practical: [
      'Nézd meg a Google szinkronizálási listáját, mielőtt elromlottnak hinnéd a fiókot.',
      'Számíts rá, hogy az előfizetett és megosztott naptárak ki vannak zárva, nem bent vannak.',
      'Ha kettőnél több naptárat tartasz, olvasd őket olyasmivel, ami közvetlenül kérdezi a Google-t.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'icloud-google-and-outlook-in-one-view'],
  },

  'taking-back-a-calendar-you-shared': {
    title: 'Visszavenni egy naptárat, amelyet megosztottál',
    short: 'A hozzáférés visszavonása',
    description:
      'Ha kiveszel valakit egy naptárból, az megállítja azt, ami ezután jön. Amit nem tesz meg: nem csinálja vissza azt, ami már megtörtént.',
    lede: 'A hozzáférés lezárása egy koppintás. Eldönteni, hogy elég-e egy koppintás, valamivel tovább tart, mert a megosztás másolatokat hagy maga után.',
    commonBelief: 'Hogy valaki eltávolítása eltávolítja azt is, amit látott.',
    sections: [
      {
        heading: 'Mi áll le és mi marad',
        body: [
          'Távolíts el valakit, és a naptár azonnal, üzenet nélkül eltűnik a listájáról. A jövőbeli események soha nem érik el.',
          'Ami nem jön vissza: a már nála lévő meghívók, a saját naptárába másolt események, bármi exportált, és minden, amihez titkos címet kapott. A hozzáférés véget ér; az emlékezet nem.',
        ],
      },
      {
        heading: 'Ami túléli az eltávolítást',
        body: [
          'Ha valakinek valaha joga volt a megosztást kezelni, lehet, hogy másokat is hozzáadott. Őt eltávolítva azok a helyükön maradnak — így lesz egy naptár megosztva valakivel, akinek a meghívására senki nem emlékszik.',
          'Olvasd tehát végig a teljes listát, ne egy nevet húzz ki, és a távozáskor tedd, ne hónapokkal később. Semmi nem emlékeztet rá, a megosztások pedig csak gyűlnek.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Annak a szintnek a havi ára, ahol ezt kezeled, dollárban',
    },
    practical: [
      'Olvasd végig a teljes hozzáférési listát, ne csak azt a nevet, amelyiket ki akartad venni.',
      'Állítsd vissza a titkos címet, ha az illetőnek valaha megvolt.',
      'Számolj azzal, hogy a másolatok megmaradnak: a valóban érzékenyet mozgasd át, ne elrejtsd.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
