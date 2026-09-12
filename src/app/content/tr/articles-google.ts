import { LocalisedArticle } from '../types';

/** Altı Google yazısı: net sorular, net cevaplar. */
export const GOOGLE_TR: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
    title: 'Bir Google takvimini paylaştığınızda kim neyi görür',
    short: 'Google paylaşım izinleri',
    description:
      'Google’ın paylaşım düzeyleri hızlı ayarlanır ve kolay yanlış anlaşılır. Her birinin gerçekte neyi açtığı, sade bir dille.',
    lede: 'Kazara fazla paylaşmanın neredeyse hiçbiri muhakeme hatası değildir. Biri, mütevazı gibi duran ama olmayan bir düzeyi seçmiştir.',
    commonBelief: '«Yalnızca boş/meşgul» ile «tüm etkinlik ayrıntıları» arasındaki farkın küçük olduğu.',
    sections: [
      {
        heading: 'Düzeyler kulağa geldiğinden daha uzaktır',
        body: [
          'Boş/meşgul, başlıksız zaman blokları gösterir. Tüm ayrıntılar başlıkları, yerleri, notları ve konukları gösterir — çoğu takvim için bu, hayatınızın hatırı sayılır bir bölümüdür.',
          'Değişiklik yapma düzenlemeye izin verir. Paylaşımı yönetme, takviminizi başkalarına devretmeye izin verir; sonradan şaşırtan da budur.',
        ],
      },
      {
        heading: 'Her seferinde düşünmeden seçmek',
        body: [
          'Yalnızca sizin etrafınızda plan yapması gereken iş arkadaşları için boş/meşgul neredeyse her zaman doğru yanıttır ve neredeyse hiç seçilmez.',
          'Tüm ayrıntıları paylaşılmak için kurulmuş takvimlere saklayın, içinde yaşadığınıza değil.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Bunun uygulamada yönetildiği katmanın aylık ücreti, dolar olarak',
    },
    practical: [
      'Sizden yalnızca zaman ayırtacak herkes için varsayılan boş/meşgul olsun.',
      '«Değişiklik yapma»yı gerçekten sizin adınıza plan yapanlara bırakın.',
      'Kimin erişimi olduğunu yılda iki kez gözden geçirin; paylaşımlar birikir ve hiçbir şey hatırlatmaz.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'what-guests-can-do-to-your-event'],
  },

  'why-a-shared-calendar-does-not-appear': {
    title: 'Sizinle bir takvim paylaşıldı ve ortada yok',
    short: 'Paylaşılan takvim görünmüyor',
    description:
      'Biri bir takvim paylaştı, kabul ettiniz ve hiçbir şey değişmedi. Dört sıradan neden, bakılmaya değer sırayla.',
    lede: 'Davet geldi, bağlantıya dokunuldu ve takvim hâlâ yok. Neredeyse her zaman dört şeyden biridir ve hiçbiri paylaşımın bozulması değildir.',
    commonBelief: 'Kabul etmenin paylaşılan takvimi telefonunuza koyduğu.',
    sections: [
      {
        heading: 'Kabul etmek onu bir hesaba ekler, bir cihaza değil',
        body: [
          'Paylaşım, gönderildiği Google hesabına iner. Bir hesapla oturum açmışken kabul ettiyseniz ve telefonunuz başka bir hesap taşıyorsa, takvim tam da bakmadığınız yerde güvenle duruyordur.',
          'Doğru hesapta bile yeni eklenen bir takvim diğer cihazlara açık olmaktan çok kapalı gelir. Vardır, yalnızca işaretli değildir — ve işaretsiz bir takvim, olmayan bir takvime birebir benzer.',
        ],
      },
      {
        heading: 'Diğer iki neden',
        body: [
          'Bir posta listesine ya da grup adresine yapılan paylaşım kişilere nadiren ulaşır; gerçekten bir Google hesabı olan adres gerekir. Bağlantı olarak paylaşılan takvim ise bir aboneliktir: listenin başka bir yerine düşer ve anında değil, yayımlayanın temposunda yenilenir.',
          'iPhone’da Google takvimleri yerleşik uygulamaya kendi eşitleme listesi üzerinden ulaşır ve ikincil takvimler varsayılan olarak bu listenin dışındadır. Bu yüzden bir hesap ana takvimini gösterir, önemli olan dördünü sessizce düşürür.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Abone olunan bir akışın yenileme istekleri arasındaki saat',
      accounts: 'Tek bir görünümün bütün bunlar olmadan bir arada tuttuğu hesap türleri',
    },
    practical: [
      'Her şeyden önce paylaşımı hangi hesabın kabul ettiğine bakın.',
      'Cihazdaki takvim listesini açın ve onu yok değil, kapalı olarak arayın.',
      'Bağlantı olarak geldiyse anında görünmeyi değil, gecikmeyi bekleyin.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'google-calendars-that-never-reach-your-iphone'],
  },

  'the-secret-address-of-a-google-calendar': {
    title: 'Bir Google takviminin gizli adresi gerçekte neyi ele verir',
    short: 'Gizli iCal adresi',
    description:
      'Google, elinde tutan herkese tüm takviminizi gösteren özel bir adres sunar. Neyi açığa çıkardığı ve neden sessizce geri alınamayacağı.',
    lede: 'Her Google takviminin ayarlarına gömülü, üzerindeki her şeyi gösteren bir bağlantı vardır. Oturum açmadan, izin almadan, kimin açtığına dair kayıt olmadan.',
    commonBelief: 'Özel bir adresin, bulunması zor olduğu için özel olduğu.',
    sections: [
      {
        heading: 'Bağlantı, tek bir kişi için değiştirilemeyen bir paroladır',
        body: [
          'Gizli adres tüm ayrıntıları taşır — başlıklar, saatler, yerler, notlar. Bağlantıyı elinde tutan herkes bunları görür ve kimlerin gördüğüne dair bir liste yoktur.',
          'Tek koruması adresin rastgele kısmıdır. Tahmine karşı gerçek bir korumadır; iletilmeye, paylaşılan bir ekrana ya da işten uzun ömürlü çıkan bir belgeye karşı hiçbir koruma değildir.',
        ],
      },
      {
        heading: 'Sıfırlamak onu herkes için bozar',
        body: [
          'Adresi sıfırlayabilirsiniz, eskisi ölür. Aynı zamanda ona sessizce dayanan her iş arkadaşı, her pano ve her betik için de ölür; hiçbirine uyarı gitmez.',
          'İçinde yaşadığınız takvimin adresini asla dağıtmamanın gerekçesi budur. Bunun için kurulmuş bir takvim yayımlayın, sıfırlamak size hiçbir şeye mal olmaz.',
        ],
      },
    ],
    claims: {
      linkLength: 'Bizim paylaşım bağlantımızı koruyan rastgele karakter sayısı',
      sharePrice: 'Uygulamadan bir etkinliği paylaşmanın ücreti',
    },
    practical: [
      'Gizli adresi, elinizden çıktığı anda herkese açık sayın.',
      'Gerçekten kullandığınız takvimin adresini asla yayımlamayın.',
      'Biri ayrıldığında sıfırlayın ve bununla bağlantısı kopacak olanlara söyleyin.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'taking-back-a-calendar-you-shared'],
  },

  'what-guests-can-do-to-your-event': {
    title: 'Konuklarınız bir etkinliğinize ne yapabilir',
    short: 'Konuk izinleri',
    description:
      'Üç kutucuk, bir konuğun toplantınızı taşıyıp taşıyamayacağını, yabancıları davet edip edemeyeceğini, listenin tamamını okuyup okuyamayacağını belirler. Sanılandan daha sık açıktırlar.',
    lede: 'Birini davet etmek ona bir yerden ve saatten fazlasını verir. Sıradan bir Google etkinliğinde konuk genellikle başka kimlerin çağrıldığını görür ve çoğu zaman listeye ekleme yapabilir.',
    commonBelief: 'Bir konuğun yalnızca kabul edip reddedebileceği.',
    sections: [
      {
        heading: 'Üç kutucuk',
        body: [
          'Etkinliği değiştirme, konuğun saati, yeri ve başlığı herkes için değiştirmesine izin verir. Nadiren istenir, kolayca açık bırakılır.',
          'Başkalarını davet etme, hiç tanışmadığınız kişileri eklemesine izin verir. Konuk listesini görme, çağrılan herkesi ve yanıtlarını gösterir — bir ekipte sorun değil, müşteride rahatsız edici, birbirinden ayrı müşteriler topluluğuna benzeyen her şeyde yanlıştır.',
        ],
      },
      {
        heading: 'İşin sessizce bozulduğu yer',
        body: [
          'Tek etkinlik, çok sayıda ayrı alıcı, görünür liste: artık herkeste herkes var. O tek kutucuğu kaldırmak, bir toplantı ile sızmış bir adres defteri arasındaki farktır.',
          'Ayarlar hesapta değil etkinlikte yaşar; her seferinde varsayılanlarınıza döner ve bir kez değil, önemli olan etkinliklerde düşünülmeleri gerekir.',
        ],
      },
    ],
    claims: {
      sharePrice: 'Uygulamadan tek bir etkinlik göndermenin ücreti',
    },
    practical: [
      'Birbirini tanımayan kişilere giden her şeyde «konuk listesini görme»yi kapatın.',
      'Biri gerçekten sizin adınıza plan yapmıyorsa «etkinliği değiştirme»yi kapalı bırakın.',
      'Kutucuklara ayarlarda değil etkinlikte bakın: orada yaşıyorlar.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'why-a-shared-calendar-does-not-appear'],
  },

  'google-calendars-that-never-reach-your-iphone': {
    title: 'Bazı Google takvimleri neden iPhone’unuza hiç ulaşmaz',
    short: 'iPhone’da eksik Google takvimleri',
    description:
      'Tek Google hesabı, birkaç takvim ve telefonda yalnızca biri. Buna karar veren eşitleme listesi ve onun yerine ne yapmalı.',
    lede: 'Google hesabınız sekiz takvim tutuyor. iPhone’unuz iki tanesini gösteriyor. Bozulan bir şey yok: hiç görmediğiniz bir şey sizin adınıza seçim yaptı.',
    commonBelief: 'iPhone’a Google hesabı eklemenin, içindeki takvimleri de eklediği.',
    sections: [
      {
        heading: 'Size hiç gösterilmemiş bir liste',
        body: [
          'Google, cihaz başına hangi takvimlerin eşitlenebileceğini tutan bir liste tutar ve ikincil takvimler — paylaşılanlar, abone olunanlar, bir proje için kurulanlar — sıklıkla bu listenin dışındadır.',
          'Bu liste iOS ayarlarında değildir. Kendi Google sayfasında yaşar; bu yüzden bariz yere bakmak yanlış bir şey bulmaz ve hiçbir şey değişmez.',
        ],
      },
      {
        heading: 'Diğer yol',
        body: [
          'Google ile doğrudan konuşan bir uygulama o listeyi kullanmaz, dolayısıyla hesabın gerçekten sahip olduğu her takvimi gösterir; telefonun sessizce düşürdüklerini de.',
          'Bu, hesapları da bir araya getirir. Kişiseli, işi ve paylaşılanı bir arada tutan tek görünüm asıl meseledir; telefonun her birini eşitleyip eşitlemeyeceği artık bir soru olmaktan çıkar.',
        ],
      },
    ],
    claims: {
      accounts: 'Tek bir görünümün bir arada tuttuğu hesap türleri',
      price: 'Google tarafının ücreti',
    },
    practical: [
      'Hesabı bozuk saymadan önce Google’ın eşitleme listesine bakın.',
      'Abone olunan ve paylaşılan takvimlerin dahil değil, dışarıda olmasını bekleyin.',
      'Birkaçtan fazla takvim tutuyorsanız onları Google’a doğrudan soran bir şeyle okuyun.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'icloud-google-and-outlook-in-one-view'],
  },

  'taking-back-a-calendar-you-shared': {
    title: 'Paylaştığınız bir takvimi geri almak',
    short: 'Erişimi geri çekmek',
    description:
      'Birini takvimden çıkarmak bundan sonrasını durdurur. Yapmadığı şey, olup biteni geri almaktır.',
    lede: 'Erişimi bitirmek tek dokunuş. Tek dokunuşun yetip yetmediğine karar vermek biraz daha uzun sürer, çünkü paylaşmak arkasında kopyalar bırakır.',
    commonBelief: 'Birini çıkarmanın, o kişinin gördüklerini de çıkardığı.',
    sections: [
      {
        heading: 'Ne durur, ne kalır',
        body: [
          'Birini çıkarın, takvim o kişinin listesinden anında ve mesajsız kaybolur. Gelecekteki etkinlikler ona hiç ulaşmaz.',
          'Geri gelmeyenler: elinde olan davetler, kendi takvimine kopyaladığı etkinlikler, dışa aktarılan her şey ve gizli adres verilmiş olan her şey. Erişim biter; hafıza bitmez.',
        ],
      },
      {
        heading: 'Çıkarmayı aşan şey',
        body: [
          'Biri bir zamanlar paylaşımı yönetme hakkına sahip olduysa başkalarını eklemiş olabilir. Onu çıkarmak diğerlerini yerinde bırakır — bir takvim böyle, kimsenin davet ettiğini hatırlamadığı biriyle paylaşılmış olur.',
          'Bu yüzden tek bir ismi silmek yerine listenin tamamını okuyun ve bunu aylar sonra değil, çıkışta yapın. Hiçbir şey hatırlatmaz, paylaşımlar ise yalnızca birikir.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Bunun yönetildiği katmanın aylık ücreti, dolar olarak',
    },
    practical: [
      'Yalnızca çıkarmak istediğiniz ismi değil, erişim listesinin tamamını okuyun.',
      'Kişi gizli adrese bir zamanlar sahip olduysa adresi sıfırlayın.',
      'Kopyaların kaldığını varsayın: gerçekten hassas olanı gizlemek yerine taşıyın.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
