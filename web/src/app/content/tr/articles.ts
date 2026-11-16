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
  "updated": "2026-10-23",
  "title": "iPhone ve iPad’de hava durumlu takvim: gününüzü tek ekranda planlayın",
  "short": "Takvim ve hava durumunu birlikte kullanın",
  "description": "iPhone ve iPad’de seçilen yer için takviminizi hava durumuyla karşılaştırın.",
  "lede": "Cloud Calendars, programınızı ve hava durumunu aynı iPhone veya iPad uygulamasında bir araya getirir. Bir tarih seçmek için takvimi, seçilen yeri ve mevcut tahmin saatlerini incelemek için hava durumu görünümünü kullanın. Dış mekân planlarında, yalnızca günlük simgeye bakmak yerine sizin için önemli zaman aralığını kontrol edin. Bu kılavuz, uygulamanın geliştiricisi Arte Soft tarafından yayımlanmıştır.",
  "commonBelief": "Takvimin yanında gösterilen hava durumu, otomatik olarak her etkinliğin adresini, her saati ve gelecekteki tüm tarihleri açıklar.",
  "sections": [
    {
      "heading": "Gerçek bir planlama sorusu seçin",
      "body": [
        "Öğleden sonra parka yapılacak bir ziyaret gibi belirli bir etkinlikle başlayın. Nelerin değişebileceğini belirleyin: saat, yer, hazırlık ya da alternatif bir seçeneği kullanma kararı. Gün simgesinde yağmur görünüyor diye tüm takvimi yeniden düzenlemeniz gerekmez.",
        "Gerekliyse kurulum süresini de ekleyerek etkinliğin gerçek başlangıç ve bitişini not edin. Takvim genel görünümü olası tarihleri bulmaya yardımcı olur; tahmin kontrolü ise belirli bir yer ve zaman aralığıyla ilgilidir. Seçenekleri karşılaştırırken bu iki işi ayrı tutun."
      ]
    },
    {
      "heading": "Değerleri okumadan önce hava durumu yerini doğrulayın",
      "body": [
        "Cloud Calendars, mevcut veya seçilen yer için hava durumu sunar. Bir etkinliğin adresinin tahmini kendiliğinden değiştirdiğini varsaymak yerine gösterilen konumu kontrol edin. Başka bir şehirdeki etkinlik, o şehrin hava durumuyla karşılaştırılmalıdır.",
        "Örneğin, telefon hâlâ evdeyken bir ziyaretçi müzeye varışı planlıyor olabilir. Karşılaştırma yapmadan önce tahmin konumunu ve etkinliğin yerel saatini okuyun. Ekranda birbirine yakın görünen değerler, programın ve hava durumunun aynı yeri kullandığını kanıtlamaz."
      ]
    },
    {
      "heading": "Saatlik ve günlük kapsamı ayrı ayrı kontrol edin",
      "body": [
        "Günlük girişi genel yönelim için, günün bir bölümüyle ilgili sorularda ise mevcut saatlik girişleri kullanın. İkiden beşe kadar süren bir rezervasyon için tek bir simgeye bakmak yeterli değildir. İlgili saatlerin gerçekten mevcut olup olmadığını kontrol edin.",
        "Uygulamanın mevcut kaynağında günlük liste, döndürülen en fazla on WeatherKit gününü gösterir. Bu, takvimde gezinmeden ve şu anda sağlanan saatlerden ayrıdır. Gelecekteki bir etkinlik, hava durumu kapsamını genişletmez. İlgili zaman aralığı yoksa daha sonra yeniden hava durumu kontrolü planlayın."
      ]
    },
    {
      "heading": "Hava durumu değerinin ne anlama geldiğini okuyun",
      "body": [
        "Apple, sıcaklık, yağış, rüzgâr ve UV gibi WeatherKit verilerini belgeler; bazı ürünler yalnızca belirli bölgelerde kullanılabilir. Her yerde tüm hava durumu ürünlerini beklemek yerine, seçtiğiniz yer için sunulan değerleri okuyun.",
        "Met Office’in rehberi, tahmin dönemi ve değişken tanımlarının neden önemli olduğunu gösterir: bazı değerler bir ana, bazılarıysa bir döneme karşılık gelir. İlgili sağlayıcının etiketlerini kullanın. Yağmur olasılığı, miktarı ve süresi farklı sorulardır; tek bir sayı her dış mekân etkinliğini belirlemez."
      ]
    },
    {
      "heading": "Bir hava durumu saatinden oluşturulan taslağı gözden geçirin",
      "body": [
        "Uygulama bir saatten etkinlik oluşturma seçeneği sunduğunda, bir taslak açar. Mevcut kaynakta hava durumu konumunun saat dilimi kullanılır, bir saatlik süre önerilir ve varsayılan yeni etkinlik takvimi seçilir. Kaydetmeden önce her değeri inceleyin.",
        "Başlığı, hedef takvimi, başlangıç ve bitişi ve amaçlanan konumu doğrulayın. Bir tahmin seçimi, paylaşılan bir takvimi düzenleme, bir mekânı bilgilendirme veya oda ayırtma izni vermez. Kaydedilen etkinliği kontrol edin ve planın gerektirdiği onayı alın."
      ]
    },
    {
      "heading": "Web sitesi demosunu ayrı değerlendirin",
      "body": [
        "Web sitesindeki etkileşimli hava durumu demosu Open-Meteo kullanır. Uygulama ise Apple WeatherKit kullanır. Web demosu sunumu keşfetmek için yararlıdır, ancak yeri, verileri ve kullanılabilir tarihleri uygulamadan farklı olabilir.",
        "Gerçek bir karar için uygulamayı açın ve planlanan etkinliği mevcut tahminiyle karşılaştırın. Paylaşılan bir planı değiştiriyorsanız düzenleyiciyi, tekrar kapsamını ve katılımcıları doğrulayın. Etkinlik koşullara bağlıysa üzerinde anlaşılmış bir alternatifi hazır tutun."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Etkinliği ve hava durumunun değiştirebileceği kararı belirleyin.",
    "Hava durumu konumunu ve etkinliğin yerel tarih ve saatini doğrulayın.",
    "Mevcut saatlik kapsamı günlük özetten ayrı olarak inceleyin.",
    "Olasılık, miktar ve diğer ilgili değerleri etiketlerine göre okuyun.",
    "Kaydetmeden önce tüm etkinlik taslağı ayrıntılarını ve hedef takvimi gözden geçirin.",
    "Karar anında yeniden kontrol edin ve ortak değişiklikleri doğrudan doğrulayın."
  ],
  "faq": [
    {
      "q": "Takvimimin yanındaki hava durumu her etkinlik adresini takip eder mi?",
      "a": "Bunu varsaymayın. Gösterilen hava durumu konumunu doğrulayın ve mekânla karşılaştırın; ekranda yakın görünmeleri eşleştiğini kanıtlamaz."
    },
    {
      "q": "Uygulama, web sitesindeki hava durumu sağlayıcısını mı kullanıyor?",
      "a": "Hayır. Uygulama Apple WeatherKit kullanır; web sitesi demosu ise ayrı olarak Open-Meteo kullanır."
    },
    {
      "q": "Bir tahmin saatini seçmek etkinliği otomatik olarak kaydeder mi?",
      "a": "Bu işlem, o seçeneğin sunulduğu bir taslak başlatır. Tarihi, saat dilimini, süreyi, takvimi ve konumu kontrol edin; ardından istediğiniz etkinliği kaydedin."
    }
  ],
  "seeAlso": [
    "weather-calendar-history-versus-forecast-iphone",
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather",
    "weather-where-the-event-is",
    "planning-outdoors-without-being-rained-on"
  ],
  "sourcesHeading": "Resmî kaynaklar ve ek okumalar",
  "sources": [
    {
      "label": "Apple: WeatherKit tahmin bilgileri ve bölgesel kullanılabilirlik",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: tahmin yeri, dönemler ve hava durumu değerleri",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ],
  "comparison": {
    "heading": "Hangi hava durumu görünümü sorunuza yanıt verir?",
    "columns": [
      "Sorunuz",
      "Neye bakılmalı",
      "Neyi kanıtlamaz"
    ],
    "rows": [
      {
        "cells": [
          "Bugün sırada ne var?",
          "Seçilen yerin hava durumunun yanındaki günlük veya haftalık takvim görünümü.",
          "Her etkinlik adresinin hava durumu konumunu otomatik olarak değiştirdiğini."
        ]
      },
      {
        "cells": [
          "Yağmur öğleden sonraki etkinliğimi etkileyebilir mi?",
          "Mekân için saatlik veriler ve etkinliğin tüm zaman aralığı.",
          "Günlük bir simgenin her saati açıkladığını."
        ]
      },
      {
        "cells": [
          "Gelecek ayı hava durumuna göre planlayabilir miyim?",
          "Önce şimdi takviminiz, sonra tarihe yaklaştıkça tahmin kontrolü.",
          "Takvimde gezinmenin tahmin kapsamını genişlettiğini."
        ]
      },
      {
        "cells": [
          "Evde hızlı bir genel görünüm görebilir miyim?",
          "Uygun Ana Ekran araç takımını.",
          "Her araç takımı düzeninin etkinlikleri veya tam tahmini içerdiğini."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-right",
    "hook"
  ],
  "galleryCaption": "Gerçek Cloud Calendars ekranları: hava durumu görünümü ve etkinliklerin olduğu bir gün. Uygulamada seçilen yeri ve tarihi kontrol edin.",
  "actionHeading": "Programınız ve tahmini birlikte kullanarak plan yapın",
  "actionText": "Cloud Calendars, iPhone ve iPad içindir. Base ile görünümler, hava durumu ve Google Calendar eşzamanlaması dahildir; Advanced reklamları kaldırır, Premium ise Microsoft Calendar ve Teams desteği ekler.",
  "articleLinks": [
    {
      "slug": "forecast-beside-every-event",
      "label": "Bir etkinliğin saatleri için hava durumunu kontrol edin"
    },
    {
      "slug": "the-widget-that-shows-what-is-next",
      "label": "Bir takvim ve hava durumu araç takımı seçin"
    },
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "Takvim hesaplarını tek görünümde bir araya getirin"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
  "updated": "2026-10-23",
  "title": "Google, iCloud ve Outlook takvimlerini iPhone ve iPad’de birlikte görün",
  "short": "Üç sağlayıcı, tek görünüm",
  "description": "Takvim görünümlerini birleştirin; hesap izinlerini, kopyaları ve plan gereksinimlerini anlayın.",
  "lede": "İş ve kişisel etkinlikleri birlikte görmek için ilgili hesapları bağlayın, takvimlerini seçin ve aynı etkinlikleri tek görünümde kontrol edin. Cloud Calendars, iPhone ve iPad planlamasında iCloud ve Google Calendar’ı destekler; Microsoft Calendar desteği Premium’dadır. Etkinlikleri birlikte görmek, sağlayıcı hesapları arasında meşguliyet bilgisini kopyalamaktan farklıdır. Bu kılavuz, geliştirici Arte Soft tarafından yayımlanmıştır.",
  "commonBelief": "Bir uygulamada birden fazla takvimi göstermek, bunların uygunluk, paylaşım ve etkinlik kopyalarını otomatik olarak birbiriyle uyumlu tutar.",
  "sections": [
    {
      "heading": "Her etkinliğin arkasındaki hesap ve takvimi belirleyin",
      "body": [
        "Her sağlayıcıdan bir sıradan etkinlikle başlayın. Oturum açılmış e-posta adresini, takvim adını ve etkinliğin size mi ait olduğunu yoksa bir davet mi aldığınızı not edin. “Calendar” adlı iki takvim tamamen farklı hesaplara ait olabilir. Renk, haftayı taramanıza yardımcı olur; ancak düzenlemenin nereye yapılacağını hesap ve takvim belirler.",
        "Örneğin kişisel iCloud takviminizdeki bir diş hekimi randevusu ile Microsoft’taki bir proje toplantısı sizin için birlikte görünebilir. Bu, tek başına, diş hekimi randevusunu iş arkadaşlarınıza görünür yapmaz veya onların planlama araçlarında bu zamanı ayırmaz.",
        "Bağlantıyı değiştirmeden önce sonucu belirleyin. Etkinlik verilerini başka bir hesaba taşımak için, desteklenen aktarım yolunu bulmak üzere aşağıdaki “Bir takvim dışa aktarma biçimi seçin” bölümünü kullanın ve hedefe güvenmeden önce temsilî etkinlikleri kontrol edin. Saatleri karşılaştırmak için mevcut takvim sahiplerini koruyun ve seçili kaynakları birlikte görüntüleyin. Başka bir hesabın meşguliyet bilgisini alması gerekiyorsa, “İş akışına göre Cloud Calendars ve OneCal”, uygunluk kopyalamanın kişisel genel bakıştan nasıl farklı olduğunu açıklar."
      ]
    },
    {
      "heading": "Uygun yöntemle bağlanın",
      "body": [
        "iCloud için önce iPhone’da ilgili Apple Account altında iCloud Calendar’ı etkinleştirin. Apple’ın kurulum kılavuzu cihaz ayarlarını açıklar. Cloud Calendars, iPhone’un takvim sistemi üzerinden kullanılabilen takvimlere erişir ve bunları okumak için takvim erişimine ihtiyaç duyar. Hesabın başka bir cihazda bağlı olması yeterli değildir.",
        "Cloud Calendars’ta ayrıca “Sign in with Google” ve “Sign in with Microsoft” işlemleri de vardır. Oturum açarken hangi hesabı seçtiğinizi kontrol edin, ardından ilgili takvim grubunu açın ve ihtiyacınız olan takvimleri seçin. Doğru sağlayıcıda, yanlış kişisel veya iş kimliğiyle oturum açmak tamamen geçerli ama beklenmedik bir takvim listesi oluşturabilir."
      ]
    },
    {
      "heading": "Planları, izinlerle karıştırmadan anlayın",
      "body": [
        "Base planı Google Calendar eşitlemesini ve takvim görünümlerini içerir. Advanced, Base’e reklam kaldırmayı ekler. Premium, Microsoft Calendar ve Microsoft Teams özelliklerini ekler. Satın almadan önce güncel yerel fiyatı ve faturalandırma dönemini inceleyin.",
        "Bir plan, uygulamada hangi özelliklerin kullanılabildiğini değiştirir; size başkasının takvimi üzerinde sahiplik vermez. Google, etkinlikleri görme izni ile onları değiştirme iznini birbirinden ayırır. İşveren politikaları ve bir Microsoft takvimine bağlı izinler geçerliliğini korur. Görünen bir etkinlik veya kullanılabilir bir düzenleyici, sağlayıcının bir güncellemeyi kabul edeceğinin kanıtı değildir."
      ]
    },
    {
      "heading": "Birleşik görünüm takvim kopyaları içerebilir",
      "body": [
        "Google ve Microsoft bağlantıları, etkinlikleri sunmak ve eşitlemek için iPhone takvim sisteminde takvim kopyaları kullanır. Bir hesabı bağlamanın, özgün sağlayıcının dışında hiçbir kopya bırakmadığını varsaymayın. Bu kopyalar için kullanılan hedef, cihazda mevcut olan takvim kaynaklarına bağlı olabilir.",
        "Aynı hesap telefona başka bir yolla da ulaşıyorsa, yinelenen etkinlikleri ayrı etkinlikler saymadan önce takvim adlarını ve kaynaklarını inceleyin. Hangi görünümü hangi takvimin sağladığını belirlemek için bir takvimi geçici olarak gizleyin. Sadece ekran daha düzenli görünsün diye bir etkinliği veya takvimi silmeyin: bağlı bir kopya, değişiklikleri sağlayıcısına geri gönderebilir."
      ]
    },
    {
      "heading": "Etkinlik oluştururken hedefi seçmeye devam edin",
      "body": [
        "Kaydetmeden önce etkinliğin takvimini en az tarih ve saat kadar dikkatle kontrol edin. Bir aile etkinliği için ailenin gerçekten kullandığı takvimi seçin; bir iş toplantısı için izin verilen iş hedefini kullanın. Her iki takvimi birlikte görmek, bunlardan herhangi birini her yeni etkinlik için otomatik hedef yapmaz.",
        "Bir etkinliğin takvimini değiştirmek veya onu takvimler arasında sürüklemek, zararsız bir ikinci görünüm değil, bir taşıma işlemi olabilir. Görünüm sorununu teşhis ederken davetleri ve yinelenen toplantıları yerleşik takvimlerinde tutun. Bir değişiklik yapmanız gerekiyorsa önce etkinliğin sahibini ve hangi takvimin bunu kabul edebileceğini belirleyin."
      ]
    },
    {
      "heading": "Güvenmeden önce genel görünümü doğrulayın",
      "body": [
        "Sağlayıcının kendi takvimindeki yakın tarihli bir etkinliği, Cloud Calendars’taki karşılığıyla karşılaştırın. Tarihi, saat dilimini, başlığı ve seçili takvimi kontrol edin. Düzenlenebilir, sahibi olduğunuz bir takvim için konuksuz, geçici bir etkinlik, aktif bir toplantıyı değiştirmekten daha iyi bir kontroldür. Bağlantıyı hazır kabul etmeden önce sonucu sağlayıcı tarafında doğrulayın.",
        "Birleşik görünüme, başka bir hesapta otomatik olarak anonim meşguliyet blokları oluşturması için güvenmeyin. İş arkadaşlarınızın kişisel ayrıntıları görmeden sizi müsait değil olarak görmesi gerekiyorsa, açıkça onaylanmış bir uygunluk düzeni kullanın ve bunu onların tarafından doğrulayın. Net bir kişisel genel bakış ile paylaşılan uygunluk ayrı işlerdir."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Her sağlayıcıdan bir etkinlik için tam hesabı ve takvimi listeleyin.",
    "Cihazda ilgili iCloud takvimlerini etkinleştirin ve takvim erişimini gözden geçirin.",
    "Uygun Google veya Microsoft oturum açma yöntemini kullanın ve hedeflenen takvimleri seçin.",
    "Herhangi bir şeyi değiştirmeden önce yakın tarihli bir etkinliği sağlayıcı görünümüyle karşılaştırın.",
    "Şüpheli yinelenen kaynağı geçici olarak gizleyin; alttaki etkinlikleri olduğu gibi bırakın.",
    "Her yeni etkinlikte hedef takvimi kontrol edin ve ihtiyacınız olan meşguliyet paylaşımını ayrıca doğrulayın."
  ],
  "faq": [
    {
      "q": "Her iki takvimi de görüntülediğim için iş arkadaşlarım kişisel etkinliklerimi görecek mi?",
      "a": "Takvimleri birlikte görüntülemek, bir paylaşım talimatı veya otomatik meşguliyet köprüsü değildir. Her takvimin gerçek paylaşım ayarlarını kontrol edin. Sağlayıcı bağlantıları cihazda takvim kopyaları oluşturabilir; bu nedenle birleşik görünüm, etkinlik verilerinin yalnızca özgün sağlayıcısında bulunduğunun da garantisi değildir."
    },
    {
      "q": "Bir etkinliği neden görebiliyorum ama başarıyla düzenleyemiyorum?",
      "a": "Takvim salt okunur olabilir, etkinlik başka bir düzenleyiciye ait olabilir veya sağlayıcı güncellemeyi reddedebilir. Sahipliği ve izinleri sağlayıcının takviminde kontrol edin. Daha yüksek bir uygulama planı satın almak bu izinleri değiştirmez."
    },
    {
      "q": "Aynı Google hesabını mevcut tüm yollarla bağlamalı mıyım?",
      "a": "Önce telefonunuzda bunun zaten nasıl göründüğünü kontrol edin. Birden fazla yol, takvim kopyalarını ayırt etmeyi zorlaştırabilir. Kullanmayı düşündüğünüz yolu seçin, etkinliklerini doğrulayın ve ilk adım olarak verileri silmek veya hesapların bağlantısını kesmek yerine, inceleme sırasında fazla görünen bir görünümü gizleyin."
    }
  ],
  "sourcesHeading": "Kaynaklar ve kurulum başvuruları",
  "sources": [
    {
      "label": "Apple: aygıtlarınızda iCloud Calendar’ı ayarlama",
      "url": "https://support.apple.com/guide/icloud/set-up-calendar-mme4d73a8727/icloud"
    },
    {
      "label": "Google: takvim paylaşımı ve izinler",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: Outlook takvim API’si ve desteklenen posta kutusu verileri",
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
    "heading": "Birleşik görünüm mü, abonelik mi, yoksa kopyalanmış meşguliyet zamanı mı?",
    "columns": [
      "İhtiyacınız olan",
      "Kontrol edilmesi gerekenler",
      "Varsaymamanız gerekenler"
    ],
    "rows": [
      {
        "cells": [
          "Birden fazla hesabın tek görünümü",
          "Bağlı hesap, seçili takvim ve gerekli plan.",
          "Paylaşılan bir ekranın sahipliği veya izinleri birleştirdiği."
        ]
      },
      {
        "cells": [
          "Sağlayıcısına ulaşan bir etkinlik düzenlemesi",
          "Orijinal etkinlik, yazma izni ve kaynaktaki kayıtlı sonuç.",
          "Görünür bir yerel düzenlemenin sağlayıcıyla başarılı eşitlemeyi kanıtladığı."
        ]
      },
      {
        "cells": [
          "Başka bir hesaptaki meşguliyet zamanı",
          "Kaynak-hedef eşitleme kurallarını açıkça tanımlayan bir hizmet.",
          "Birleşik görünümün iş arkadaşları için müsaitlik blokları oluşturduğu."
        ]
      },
      {
        "cells": [
          "Abone olunan bir takvim akışı",
          "Yayıncı, yenileme davranışı ve salt okunur durum.",
          "Bir ICS aboneliğinin düzenlenebilir, çift yönlü bir bağlantı olduğu."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-left",
    "hook"
  ],
  "galleryDevice": "iPad",
  "galleryCaption": "Gerçek iPad takvim görünümleri, bir programın gözden geçirilmesini örnekler. Bir ekran görüntüsü, sağlayıcı eşitlemesinin yönünü veya hesap izinlerini göstermez.",
  "actionHeading": "Takvimlerinizi iPhone ve iPad’de birlikte gözden geçirin",
  "actionText": "Google Calendar eşitlemesi Base’e dahildir. Advanced reklam kaldırma ekler; Premium ise Microsoft Calendar ve Teams desteği ekler. Hesabın izinlerini, satın alma planından bağımsız olarak doğrulayın.",
  "articleLinks": [
    {
      "slug": "onecal-alternative-iphone-calendar-view-or-sync",
      "label": "Birleşik görünümü OneCal eşitleme kurallarıyla karşılaştırın"
    },
    {
      "slug": "fantastical-readdle-calendar366-iphone-comparison",
      "label": "iPhone takvim iş akışlarını karşılaştırın"
    },
    {
      "slug": "weather-inside-your-calendar",
      "label": "Hava durumu ve etkinliklerle birlikte plan yapın"
    }
  ]
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
