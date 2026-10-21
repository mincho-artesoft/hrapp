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
    faq: [
      {
        q: 'Yalnızca boş/meşgul paylaşırsam etkinlik başlıklarım görünür mü?',
        a: 'Hayır. Boş/meşgul, başlıksız zaman bloklarını gösterir; yer, not ve konuk yoktur. Bunları ancak «tüm ayrıntılar» açar — ve hepsini açar.',
      },
      {
        q: '«Değişiklik yapma ve paylaşımı yönetme» neye izin verir?',
        a: 'Her etkinliği düzenlemeye ve takviminizi size sormadan başkalarına devretmeye. Erişimi sizden başka birinin dağıtabildiği tek düzey budur.',
      },
      {
        q: 'Takvimime kimlerin erişimi olduğunu görebilir miyim?',
        a: 'Evet, o takvimin paylaşım ayarlarında. Hiçbir şey bakmanızı istemez ve paylaşımlar yalnızca birikir: listeyi yılda iki kez okuyun.',
      },
    ],
    practical: [
      'Sizden yalnızca zaman ayırtacak herkes için varsayılan boş/meşgul olsun.',
      '«Değişiklik yapma»yı gerçekten sizin adınıza plan yapanlara bırakın.',
      'Kimin erişimi olduğunu yılda iki kez gözden geçirin; paylaşımlar birikir ve hiçbir şey hatırlatmaz.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'what-guests-can-do-to-your-event'],
  },

  'why-a-shared-calendar-does-not-appear': {
    "updated": "2026-10-21",
    "title": "Sizinle bir takvim paylaşıldı ve ortada yok",
    "short": "Paylaşılan takvim görünmüyor",
    "description": "Paylaşılan Google takvimi görünmüyor mu? Davet edilen hesabı, grubu, görünürlüğü ve bağlantı türünü kontrol edin.",
    "lede": "Bu rehberi Cloud Calendars geliştiricisi Arte Soft hazırladı. Önce erişim eksikliğini yalnızca gizlenmiş bir takvimden ayırın.",
    "commonBelief": "Kabul etmenin paylaşılan takvimi telefonunuza koyduğu.",
    "sections": [
      {
        "heading": "Hesabı ve grubu kontrol edin",
        "body": [
          "Davetin alıcısını telefonda ve tarayıcıda açık olan Google hesabıyla karşılaştırın. Davet bağlantısını doğru hesapla açın. Google, kişilerle ve Google Grupları ile paylaşımı destekler. Erişim bir grup üzerinden geliyorsa grup yöneticisinden üyeliğinizi, takvim sahibinden doğru grubun erişimini doğrulamasını isteyin. İletilmiş bir e-posta tek başına izin vermez."
        ]
      },
      {
        "heading": "Gizli mi, eksik mi, kısıtlı mı?",
        "body": [
          "iPhone veya iPad’de Google Takvim menüsünü açın. Takvim listede olup işaretli değilse seçin. Listede yoksa sahibinden erişimi kontrol etmesini isteyin: İstek, onay anlamına gelmez. İş veya okul kuralları paylaşımı sınırlayabilir. Aynı hesabı web’de Google Takvim ile karşılaştırın. Orada çalışıyorsa diğer uygulamanın bağlı hesabını ve takvim seçimini kontrol edin. Salt okunur erişim düzenleme izni vermez."
        ]
      },
      {
        "heading": "Bağlantının türünü belirleyin",
        "body": [
          "Paylaşım davetinde de bağlantı vardır; her bağlantı ICS aboneliği değildir. Gönderene Google takvimine erişim mi verdiğini, yoksa salt okunur bir akış mı yayımladığını sorun. Google’a göre yeni takvim aboneliği için bilgisayar tarayıcısı gerekir; e-postayla zaten paylaşılmış takvimi açmak ayrı bir işlemdir. Akış güncellemeleri alıcı hizmetin yenilemesine bağlıdır. Her durum için geçerli bekleme süresi yoktur; acil değişiklikleri düzenleyenle doğrulayın."
        ]
      }
    ],
    "claims": {},
    "faq": [
      {
        "q": "Bir Google Grubu erişim alabilir mi?",
        "a": "Evet. Seçilen grubu, üyeliğinizi ve kuruluş kısıtlamalarını kontrol edin. İletilmiş bir grup e-postası erişimi kanıtlamaz."
      },
      {
        "q": "Hesabı silip yeniden bağlamalı mıyım?",
        "a": "Önce kimliği, izinleri ve görünürlüğü kontrol edip web takvimiyle karşılaştırın. Yeniden bağlamak eksik izinleri vermez."
      }
    ],
    "practical": [
      "Davet edilen hesabı ve grup üyeliğini doğrulayın.",
      "Listede olup gizlenen takvimi seçin.",
      "Bağlantıları değiştirmeden önce erişimi kontrol ettirin."
    ],
    "sourcesHeading": "Kaynaklar ve ek bilgiler",
    "sources": [
      {
        "label": "Google: Hesabı ve grubu kontrol edin",
        "url": "https://support.google.com/calendar/answer/37082?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Gizli mi, eksik mi, kısıtlı mı?",
        "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Bağlantının türünü belirleyin",
        "url": "https://support.google.com/calendar/answer/37648?hl=en"
      }
    ],
    "seeAlso": [
      "who-can-see-what-in-google-calendar",
      "google-calendars-that-never-reach-your-iphone"
    ]
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
    faq: [
      {
        q: 'Biri takvimimin gizli adresiyle ne yapabilir?',
        a: 'Üzerindeki her şeyi görebilir — başlıklar, saatler, yerler ve notlar — oturum açmadan, izin almadan ve baktığına dair hiçbir yerde kayıt bırakmadan.',
      },
      {
        q: 'Gizli takvim adresini geri alabilir miyim?',
        a: 'Yalnızca sıfırlayarak; bu da eskisini herkes için aynı anda öldürür: iş arkadaşları, panolar ve ona sessizce dayanan her betik, hiçbir uyarı almadan.',
      },
      {
        q: 'Gizli adresi bir iş arkadaşıma e-postayla gönderebilir miyim?',
        a: 'Elinizden çıktığı andan itibaren herkese açık sayın. Tek koruması tahmin edilmesinin zor olmasıdır ve iletmek tam olarak bunu ortadan kaldırır.',
      },
    ],
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
    faq: [
      {
        q: 'Google Takvim davetinde konuklar birbirini görür mü?',
        a: 'Varsayılan olarak çoğunlukla evet. «Konuk listesini görme», davet edilen herkesi ve yanıtlarını gösterir: ekip içinde sorun değil, müşteriyle rahatsız edici, konuklar ayrı müşterilerse doğrudan yanlış.',
      },
      {
        q: 'Bir konuk toplantımın saatini değiştirebilir mi?',
        a: '«Etkinliği değiştirme» işaretliyse evet, ve değişiklik herkes için geçerli olur. Nadiren istenir, kolayca açık bırakılır.',
      },
      {
        q: 'Konukların başkalarını davet etmesini nasıl engellerim?',
        a: '«Başkalarını davet etme»yi etkinliğin kendisinde kapatın. Bu ayarlar hesaba değil etkinliğe aittir, bu yüzden her seferinde varsayılanlarınıza döner.',
      },
    ],
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
    faq: [
      {
        q: 'Neden Google takvimlerimin yalnızca bazıları iPhone’da görünüyor?',
        a: 'Google, cihaz başına hangi takvimlerin eşitlenebileceğini tutan bir liste tutar ve ikincil takvimler — paylaşılanlar, abone olunanlar, bir proje için kurulanlar — sıklıkla bunun dışındadır.',
      },
      {
        q: 'iPhone için Google Takvim eşitleme ayarı nerede?',
        a: 'iOS ayarlarında değil. Kendi Google sayfasında yaşar; bu yüzden bariz yere bakmak bir hata bulmaz ve hiçbir şeyi değiştirmez.',
      },
      {
        q: 'iPhone’da tüm Google takvimlerimi nasıl görürüm?',
        a: 'Cihazın listesi yerine Google’a doğrudan soran bir uygulamayla. Hesabın gerçekten sahip olduğu her takvimi gösterir, telefonun düşürdüklerini de.',
      },
    ],
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
    faq: [
      {
        q: 'Birini çıkarmak onun gördüklerini de siler mi?',
        a: 'Hayır. Elinde olan davetler, kendi takvimine kopyaladığı etkinlikler ve dışa aktarılan her şey kalır. Erişim biter; kopyalar bitmez.',
      },
      {
        q: 'Kişiye erişimini kaldırdığım bildirilir mi?',
        a: 'Hayır. Takvim, listesinden anında ve mesajsız kaybolur.',
      },
      {
        q: 'Takvimim neden hiç davet etmediğim biriyle paylaşılmış durumda?',
        a: 'Paylaşımı yönetme yetkisi olan biri onu eklemiş. O kişiyi çıkarmak, eklediği herkesi yerinde bırakır — bu yüzden tek bir isim değil, listenin tamamı okunur.',
      },
    ],
    practical: [
      'Yalnızca çıkarmak istediğiniz ismi değil, erişim listesinin tamamını okuyun.',
      'Kişi gizli adrese bir zamanlar sahip olduysa adresi sıfırlayın.',
      'Kopyaların kaldığını varsayın: gerçekten hassas olanı gizlemek yerine taşıyın.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
