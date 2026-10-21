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
  'weather-inside-your-calendar': {
  "title": "Havayı zaten içinde taşıyan bir takvim",
  "short": "Takvimin içindeki hava",
  "description": "Bir günü planlamak için iki uygulamaya bakmanın neden bir tasarım hatası olduğu ve tahminin yanda durmak yerine görünümün parçası olduğu bir takvimin nasıl göründüğü.",
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
    title: 'Takvimi değil, tek bir etkinliği paylaşmak',
    short: 'Tek etkinlik paylaşmak',
    description: 'Tek bir etkinlik göndermenin nasıl işlediği, karşı tarafın gerçekte ne aldığı ve görmek için neden hiçbir şey kurmasına gerek olmadığı.',
    lede: 'Takvim paylaşmak genelde ya hep ya hiçtir: ya birinin sizinkine erişimi vardır ya da yoktur. Bir akşam yemeği göndermek bunların hiçbirini gerektirmemeli.',
    commonBelief: 'Bir etkinliği paylaşmanın, birine haftanızın geri kalanına açılan bir pencere vermek olduğu.',
    sections: [
      {
        heading: 'Gerçekte ne gider',
        body: [
          'Bir etkinlik oluştururken uygulama onu paylaşmayı önerir. Yola çıkan bir bağlantıdır — e-postayla, mesajla, karşı tarafta ne kuruluysa onunla — ve o bağlantının arkasında yalnızca o etkinliği içeren, başka hiçbir şey içermeyen bir takvim akışı durur.',
          'Ekran görüntüsü değil, eskiyen bir kopya da değil. Saat değişirse akış da onunla değişir ve gönderdiğiniz kişi değişikliği siz bir şey yeniden göndermeden görür.',
        ],
      },
      {
        heading: 'Ne değildir',
        body: [
          'Bağlantı sıradan bir takvim aboneliğidir: Apple Takvim okur, Google Takvim okur, Outlook okur. Mesajda ayrıca uygulamayı isteyen için bir App Clip vardır — kurulum olmadan açılır. Bu bir kapıdır, gişe değil.',
          'Anlık değildir: akış uygulamalardan saatte bir yeniden bakmalarını ister ve bu bir istektir, kural değil. Gizli de değildir: bağlantı yirmi iki rastgele karakter taşır, kimse tahmin edemez, ama elinde olan okuyabilir. Ve şimdilik yalnızca okumadır.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Akışın yenilenme istekleri arasındaki saat sayısı',
      linkLength: 'Bağlantıdaki rastgele karakter sayısı — tahmin edilemez yapan budur',
      sharePrice: 'Paylaşımın ücreti',
    },
    practical: [
      'Oluşturduktan hemen sonra etkinliğin kendisinden paylaşın.',
      'Bağlantıyı o kişiyle zaten kullandığınız kanaldan gönderin.',
      'Saat son anda değişirse, etkinliği kaydırmanın yanı sıra bir de yazın.',
      'Etkinlik geçtiğinde bağlantıyı iptal edin, bir belgeyi paylaşmayı bırakacağınız gibi.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'weather-inside-your-calendar'],
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
