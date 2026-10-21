import { LocalisedArticle } from '../types';

/**
 * The four articles this language carries.
 *
 * Chosen one per intent -- weather, one view, sharing, price -- so the language
 * answers a whole question rather than a quarter of four. The numbers are not
 * here: they live once in article-facts.ts and join the prose by id, so a
 * translation can rewrite every sentence without touching a figure.
 */
export const ARTICLES_TR: Readonly<Record<string, LocalisedArticle>> = {
  "month-view-on-a-bigger-screen": {
  "updated": "2026-10-22",
  "title": "iPad ve iPhone’da aylık takvim: tarihe bakın, ayrıntıları kontrol edin",
  "short": "Aylık görünümde ayrıntıları kaçırmayın",
  "description": "iPad veya iPhone’da tarihleri karşılaştırın. Ortak ya da yinelenen randevuları taşımadan önce gizli etkinlikleri, seçili takvimleri ve saatleri inceleyin.",
  "lede": "Aylık görünüm, işlerin hangi tarihlere düştüğünü gösterir. Belirli bir saatin boş olduğunu kanıtlamaya daha az uygundur. Genel görünümden tarih seçin, sonra kesinleştirmeden günü ve etkinliği inceleyin. Rehber Cloud Calendars geliştiricisi Arte Soft tarafından yayımlanmıştır.",
  "commonBelief": "Daha büyük aylık tablo tüm ayrıntıları gösterir ve boş görünen tarih herkesin müsait olduğunu kanıtlar.",
  "sections": [
    {
      "heading": "Tarih mi kesin saat mi gerektiğine karar verin",
      "body": [
        "Ayı; proje teslimi, seyahat ve aile randevusunu haftalar boyunca karşılaştırmak için kullanın. İki randevunun 14.30’da çakışıp çakışmadığı soruluyorsa gün veya hafta görünümünde başlangıç ve bitişi inceleyin. Ay hücresi saatlik tablonun zaman ölçeğini sunmaz.",
        "Örneğin atölye tarihi seçen düzenleyici önce seyahat haftasını eleyebilir. Sonra önerilen gündeki işler, hazırlık, yol ve gerekli bitiş kontrol edilir. Boş görünen hücre araştırılacak adaydır; onaylı rezervasyon ya da başkalarının müsaitlik beyanı değildir."
      ]
    },
    {
      "heading": "Ek etkinlik sayısını okuyun",
      "body": [
        "Cloud Calendars’ın mevcut ay hücresi sınırlı etkinlik etiketi ve aynı tarihteki diğer etkinliklerin sayısını gösterir. Başlıklar tek satırda tutulduğu için kısalabilir. Tam başlık veya diğer işler önemliyse günü ya da etkinliği açın.",
        "Daha büyük iPad ekranı okumayı kolaylaştırabilir ama fiziksel alanın tüm görüntüleme sınırlarını kaldırdığını varsaymayın. Dar uygulama penceresi veya büyük yazı sığanları değiştirebilir. iPhone’da da görünen etiketleri tam program saymadan günü inceleyin."
      ]
    },
    {
      "heading": "Ayı, seçili takvimleri ve komşu tarihleri kontrol edin",
      "body": [
        "Tarih seçmeden görüntülenen ay ve yılı okuyun. Satırları tamamlamak için tabloda komşu aydan tarihler bulunabilir. Cloud Calendars’ta ay gezinmesini kullanıp seçili tarihi kontrol edin; yalnızca karenin konumuna güvenmeyin.",
        "Hangi takvimlerin seçili olduğunu kontrol edin. İş etkinliklerini gizlemek aile planını okumayı kolaylaştırır ama bu yükümlülükleri o görünümden çıkarır. Tekrarı incelerken bir kaynağı geçici gizleyip karşılaştırın; ayı ferahlatmak için randevu silmeyin."
      ]
    },
    {
      "heading": "Ortak planı değiştirmeden etkinliği açın",
      "body": [
        "Ayrıntılarda başlık, sahip veya takvim, yerel saat ve süreyi doğrulayın. Renk taramaya yardımcıdır ama hesabı ya da düzenleme iznini bilmenin yerini tutmaz. Görünen davet, kendiniz düzenlediğiniz randevuyla aynı değildir.",
        "Cloud Calendars aylık görünümde sürükleyip bırakarak başka tarihe taşıma yolu sunar. Gerçek bir randevuda kullanmadan hedef tarihi ve tekrar kapsamını belirleyin. İzinli değişiklikten sonra yeniden açıp doğrulayın; yerel hareket, sağlayıcının veya tüm katılımcıların yeni planı kabul ettiğini kanıtlamaz."
      ]
    },
    {
      "heading": "Tekrarları ve saat dilimlerini ayrı kontrol edin",
      "body": [
        "Yalnızca bu haftaki ders taşınıyorsa gelecekteki düzeni yanlışlıkla değiştirmeyin. Sunulan tekrar kapsamını okuyup sonrasında hem değişen hem sonraki bir örneği inceleyin. Ay görünümü tekrarlanan tarihleri karşılaştırmayı kolaylaştırır ama değişikliğin anlamını kapsam belirler.",
        "Seyahat veya farklı saat dilimindeki toplantıda yerel tarih ve saati açıkça kontrol edin. Etkinliği başka güne taşımak hedef saati otomatik dönüştürmez. İlgiliyse yaz saati geçişlerini inceleyin ve kararlaştırılan saati katılımcılarla doğrulayın."
      ]
    },
    {
      "heading": "Büyük görünümü başka ürünlerle karıştırmayın",
      "body": [
        "Apple Takvim kendi aylık seçeneklerini sunar; Teamup tarayıcı ve mobilde farklı görünümler açıklar. Bu kontroller kendi ürünlerine aittir. Görünümlerin adı aynı diye Teamup tarayıcı ayarlarını veya Apple Takvim menüsünü Cloud Calendars’ta aramayın.",
        "Bir aylık randevu, bir aylık hava tahmini değildir. Açık hava planında yeri, tarihi ve mevcut tahmin saatlerini ayrı kontrol edin. Son randevuyu amaçlanan takvime kaydedip değişiklikleri katılımcılarla doğrudan doğrulayın."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Ay görünümünde tarih seçip kesin saatleri gün veya haftada inceleyin.",
    "Ek sayı veya kısaltılmış başlık olan günleri açın.",
    "Tarihi boş saymadan ay, yıl ve takvim seçimini kontrol edin.",
    "Takvimi, saati, süreyi ve düzenleme iznini doğrulayın.",
    "Tekrar kapsamını okuyup taşınan kaydı kontrol edin.",
    "Hava tahminini ayrı inceleyip değişiklikleri katılımcılarla doğrulayın."
  ],
  "faq": [
    {
      "q": "iPad aylık görünümü her randevuyu tam gösterir mi?",
      "a": "Varsaymayın. Cloud Calendars hücredeki etiketleri sınırlar ve ek sayı gösterir. Tam program için günü ve etkinliği açın."
    },
    {
      "q": "Boş gün müsait olduğum anlamına mı gelir?",
      "a": "Önce seçili takvimleri, tarihi ve ilgili hesap verilerinin varlığını kontrol edin. Görünüm yalnızca o anda mevcut ve gösterilen bilgiyi temsil eder."
    },
    {
      "q": "Yinelenen etkinliği taşımak yalnızca o tarihi mi değiştirir?",
      "a": "Düzenleme kapsamını okuyun. Kaydettikten sonra değişen ve sonraki bir örneği inceleyip amaçlanan düzeni doğrulayın."
    }
  ],
  "sourcesHeading": "Resmî görünüm açıklamalarını karşılaştırın",
  "sources": [
    {
      "label": "Apple: ay, çoklu gün ve liste görünümleri",
      "url": "https://support.apple.com/en-ca/guide/iphone/iphfd1054569/ios"
    },
    {
      "label": "Teamup: görünümler ve tarayıcı ile uygulama ayarları",
      "url": "https://calendar.teamup.com/kb/how-to-use-calendar-views/"
    }
  ],
  "seeAlso": []
},

  'weather-inside-your-calendar': {
  "title": "Havayı zaten içinde taşıyan bir takvim",
  "short": "Takvimin içindeki hava",
  "description": "Etkinlikleri ve hava durumunu aynı görünümde planlayın. Mevcut tahminin takvime nasıl eklendiğini ve hangi dönemleri kapsadığını öğrenin.",
  "lede": "Neredeyse herkes gününü iki uygulama arasında planlar. Takvim nerede olunacağını söyler; hava uygulaması varıldığında havanın nasıl olacağını. İkisini kafada bir arada tutmak, kimsenin yaptığını fark etmediği kısımdır — ta ki bir cumartesi boşa gidene kadar.",
  "commonBelief": "Takvimin randevular, hava uygulamasının hava için olduğu ve ikisini ayrı tutmanın telefonların çalışma biçimi olduğu.",
  "sections": [
    {
      "heading": "İki uygulamanın bedeli iki dokunuş değildir",
      "body": [
        "Geçiş yapmak hiçbir şeye mal olmaz. Pahalı olan, ikisinin neyin önemli olduğu konusunda asla anlaşmamasıdır. Takviminiz cumartesi on birde iki saatin dolu olduğunu bilir; hava uygulaması ondan bire kadar yağmur yağdığını bilir. Hiçbiri, bu iki olgunun birlikte bloğun kaydırılması gerektiği anlamına geldiğini bilmez.",
        "Bütünleştirme katmanı sizsiniz. Bu, işiniz yoğunlaşana kadar işler — ki planları korumanın en çok değdiği an tam da odur."
      ]
    },
    {
      "heading": "Mevcut hava tahmini",
      "body": [
        "Cloud Calendars, seçilen konum için mevcut hava tahminini kullanır. Saatlik ve günlük veriler farklı dönemleri kapsayabilir.",
        "Takvimde görebildiğiniz tarihler tahminin kapsamını belirlemez. Ay görünümü, tüm ay veya her etkinlik için tahmin olduğu anlamına gelmez."
      ]
    }
  ],
  "claims": {
    "price": "Hava özelliklerinin ücreti"
  },
  "practical": [
    "Tahmine göre plan yapmadan önce konumu, tarihi ve mevcut saatleri kontrol edin."
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-a-subscription-actually-buys"
  ],
  "updated": "2026-10-21"
},

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google ve Outlook tek görünümde',
    short: 'Üç hesap, tek görünüm',
    description: 'Neredeyse herkesin hayatı kişisel bir Apple takvimi, bir Google hesabı ve işten bir Exchange arasında bölünmüştür. Aynı ızgaraya girdiklerinde ne değişir.',
    lede: 'Sorun neredeyse hiçbir zaman takvimlerden birinin kötü olması değildir. Sorun üç tane olması ve haftanın bir tane olmasıdır.',
    commonBelief: 'İşi ve özel hayatı ayrı uygulamalarda tutmanın bir sınır olduğu, bir eksiklik olmadığı.',
    sections: [
      {
        heading: 'Çift randevu yapısaldır',
        body: [
          'Taahhütleriniz üç yerde yaşıyorsa, hiçbir yer size boş olup olmadığınızı söyleyemez. Birleştirme adımı sizsiniz ve onu ezberden çalıştırırsınız, genellikle biri yanıt beklerken.',
          'Bu yüzden klasik hata bir etkinliği unutmak değildir; göremediğiniz bir etkinlikle çakışan bir şeye evet demektir.',
        ],
      },
      {
        heading: 'Tek ızgara ne verir',
        body: [
          'Tüm hesaplar aynı haftada, kaynağına göre renklendirilmiş, yerinde düzenlenebilir. Yanıtın hangi uygulamada olduğunu merak etmeyi bırakırsınız, çünkü soru çoğul olmaktan çıkar.',
          'iCloud ve Google ücretsiz sürümde eşitlenir. Microsoft hesapları — Outlook ve Exchange — ücretliye aittir, çünkü o bağlantının diğerlerinde olmayan yinelenen bir maliyeti vardır.',
        ],
      },
    ],
    claims: {
      accounts: 'Tek görünüme sığan hesap türü sayısı',
      premiumMonthly: 'Microsoft eklemenin aylık ücreti, dolar olarak',
    },
    practical: [
      'Önce kişisel hesabı, sonra çakışmalara yol açanı ekleyin.',
      'Kategoriye değil hesaba göre renklendirin: bir bakışta görülmesi gereken kaynaktır.',
      'Başkalarının zaten okuduğu takvime yazmayı sürdürün.',
    ],
    seeAlso: ['weather-inside-your-calendar', 'what-a-subscription-actually-buys'],
  },

  'sharing-one-event-not-your-calendar': {
  "updated": "2026-10-21",
  "title": "Tek etkinlik paylaşımı: doğru bağlantı ve erişim",
  "short": "Tek etkinlik paylaşma",
  "description": "Tüm takvim yerine tek etkinlik paylaşın. Reader, Writer ve Owner rollerini, önizlemeyi, güncellemeleri ve erişimi kaldırmanın sınırlarını öğrenin.",
  "lede": "Yemek ayrıntılarını göndermek, ortak düzenleyiciye düzenleme izni vermek ve katılım yanıtı toplamak farklı işlerdir. Önce amacınızı, sonra paylaşım yolunu seçin. Bu rehberi Cloud Calendars geliştiricisi Arte Soft hazırlamıştır.",
  "commonBelief": "Her etkinlik bağlantısı anında güncellenen, yanıt kaydeden salt okunur bir takvim aboneliğidir.",
  "sections": [
    {
      "heading": "Önce etkinliğin ayrıntılarını inceleyin",
      "body": [
        "Tek etkinlik paylaşımı gönderenin tüm takvimini değil, o etkinliği kapsar. Başlığı, saat dilimini, konumu, notları ve toplantı bağlantılarını kontrol edin. Bir konuk için uygun bilgi geniş dağıtıma uygun olmayabilir.",
        "Yemek paylaşmak için doktor randevularınızın takvimini açmanız gerekmez. Ancak yemeğin konumu ve bağlantıları etkinlikle gider. Çevresindeki takvimin gizliliğine güvenmek yerine içeriği inceleyin."
      ]
    },
    {
      "heading": "Önizleme, e-posta veya QR yolunu seçin",
      "body": [
        "Cloud Calendars App Clip bir önizleme sunar; bu yoldan etkinlik eklemek için tam uygulama gerekir. E-posta ve QR davetleri Cloud Calendars açma seçeneği sunan bir web sayfasına gider. Bunlar birbirinin yerine kullanılan abonelik adresleri değildir.",
        "Eşzamanlanan paylaşım için gönderen oturum açar. Bağlantılar ve QR kodları başkalarına iletilebilir. QR kodu bağlantıyı taşır, kimin açtığını kanıtlamaz."
      ]
    },
    {
      "heading": "Yalnızca gereken hakları verin",
      "body": [
        "E-posta davetinde Reader, Writer veya Owner seçilir. Reader görüntüler ve eşzamanlar, Writer düzenler, Owner ayrıca paylaşır ve erişimi yönetir. Yalnızca programı izleyecek kişiye Reader verin.",
        "Etkinliği değiştirecek ortak düzenleyiciye Writer uygundur. Owner, başkalarının erişimini de yönetecek kişi içindir. Yüksek haklar doğru kimlikle oturum açmayı gerektirir. Anonim alıcı, kimliği belirli bir ortak sahip değildir."
      ]
    },
    {
      "heading": "Alıcının etkinliği nasıl eklediğini anlayın",
      "body": [
        "Tam uygulamada takvim izni ve yazılabilir hedef takvim gerekir. Alıcı kaydetmeden önce hedefi kontrol etmelidir. Alınan kopya sonraki değişiklikler için paylaşılan etkinlikle ilişkilendirilebilir.",
        "Normal ICS dosyası içe aktarmak kopya oluşturur; abonelik ise akışı düzenli aralıklarla kontrol eder. Uygulama daveti yerine ICS akışı gönderiyorsanız farkı açıklayın ve alıcının takviminin desteklediğini doğrulayın."
      ]
    },
    {
      "heading": "Değişikliklerin ulaştığını kontrol edin",
      "body": [
        "Eşzamanlanan paylaşım düzenleme ve iptalleri taşıyabilir, ancak cihazın bunları alma fırsatı olmalıdır. Akış yenileme ipucu bir teslim süresi değildir. Çevrimdışı cihaz, yenilenmemiş abonelik veya bağımsız içe aktarılmış kopya eski bilgileri gösterebilir.",
        "Yemek son anda ertelenirse etkinliği güncelleyin ve konuklara doğrudan ulaşın. Yeni saati doğrulamalarını isteyin. Güncellemeyi almak, katılacağını bildirmek değildir."
      ]
    },
    {
      "heading": "Erişimi kaldırmak bütün kopyaları silmez",
      "body": [
        "Alıcı haklarını gözden geçirip gereksiz izinleri kaldırın. Alıcıyı kaldırmak ve akış bağlantısını iptal etmek ayrı işlemlerdir. Bunlar tüm ekran görüntülerini, mesajları veya takvim kopyalarını uzaktan silme garantisi vermez.",
        "Bağlantı yayıldıysa ilgili adresi veya izni belirleyin ve değişiklikten sonra sonucu kontrol edin. Sonradan iptale güvenmek yerine özel bilgileri geniş dağıtılan bağlantılara koymayın."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Ayrıntıları ve amacınızı kontrol edin: görüntüleme, düzenleme veya katılım yanıtı.",
    "Paylaşım yolunu seçip gerektiğinde oturum açın.",
    "İzleyicilere Reader, ilgili sorumluluklar için Writer veya Owner verin.",
    "Alıcıdan saati ve hedef takvimi kontrol etmesini isteyin.",
    "Acil değişiklikte etkinliği güncelleyip doğrudan mesaj gönderin.",
    "Paylaşım bittiğinde alıcı hakları ve bağlantıları ayrı inceleyin."
  ],
  "faq": [
    {
      "q": "Tek etkinlik tüm takvimimi açar mı?",
      "a": "Eşzamanlanan tek etkinlik yolu o etkinlikle sınırlıdır, fakat kendi ayrıntılarını gösterir. Bunları inceleyin; tek etkinlik amaçlıyorsanız tüm takvim daveti göndermeyin."
    },
    {
      "q": "Alıcı etkinliği değiştirebilir mi?",
      "a": "Evet, uygun Writer veya Owner hakkıyla desteklenen oturum açma yolunu kullanırsa. Reader görüntüleme ve eşzamanlama içindir. Normal ICS aboneliği aynı düzenleme mekanizması değildir."
    },
    {
      "q": "Birini kaldırmak aldıklarının hepsini geri alır mı?",
      "a": "Böyle bir garanti yoktur. Paylaşım erişimi değişir, ancak kaydedilmiş kopyalar, ekran görüntüleri ve mesajlar kalabilir. Paylaşılan akış adresi ayrıca değerlendirilmelidir."
    }
  ],
  "sourcesHeading": "Alıcı seçenekleri için kaynaklar",
  "sources": [
    {
      "label": "Apple: App Clips genel bakışı",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google: etkinlik içe aktarma ve sınırları",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft: takvimi içe aktarma veya abone olma",
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
  "title": "Bir abonelik gerçekte ne satın alır",
  "short": "Abonelik ne satın alır",
  "description": "Abonelik ne satın alır: Base, Advanced, Premium.",
  "lede": "Bu rehber, Cloud Calendars geliştiricisi Arte Soft tarafından yayımlanmıştır.",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "Base; Google Calendar eşitleme, Google Meet, takvim görünümleri, hava durumu ve araç takımlarını içerir. Ücretsiz plan reklam gösterebilir."
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Advanced, Base özelliklerini içerir ve reklamları kaldırır. Premium, Advanced özelliklerine Microsoft Calendar ve Microsoft Teams desteğini ekler.",
        "Abonelik, başkalarının takvimlerini düzenleme izni vermez ve iş hesabının kısıtlamalarını aşmaz."
      ]
    },
    {
      "heading": "Satın alma ve iptal bilgileri",
      "body": [
        "Satın almadan önce yerel fiyatı, fatura dönemini ve yenileme koşullarını kontrol edin.",
        "Apple tarafından faturalandırılan abonelik için Ayarlar → adınız → Abonelikler bölümünü açın. Durumu ve bitiş tarihini kontrol edin. Yenilemeyi iptal etmek, uygulamayı veya takvim verilerini silmekten ayrıdır; ücretli özelliklerin süre dolduktan sonra kullanılabileceğini varsaymayın."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Satın almadan önce yerel fiyatı, fatura dönemini ve yenileme koşullarını kontrol edin.",
    "Abonelik, başkalarının takvimlerini düzenleme izni vermez ve iş hesabının kısıtlamalarını aşmaz."
  ],
  "faq": [
    {
      "q": "Yenilemeyi nasıl durdururum?",
      "a": "Apple tarafından faturalandırılan abonelik için Ayarlar → adınız → Abonelikler bölümünü açın. Durumu ve bitiş tarihini kontrol edin. Yenilemeyi iptal etmek, uygulamayı veya takvim verilerini silmekten ayrıdır; ücretli özelliklerin süre dolduktan sonra kullanılabileceğini varsaymayın."
    }
  ],
  "sourcesHeading": "Satın alma ve iptal bilgileri",
  "sources": [
    {
      "label": "Apple: Yenilemeyi nasıl durdururum?",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view"
  ]
},
};
