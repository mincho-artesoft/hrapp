import type { LocalisedArticle } from '../types';

export const PRIORITY_TR: Readonly<Record<string, LocalisedArticle>> = {
  "forecast-beside-every-event": {
    "title": "iPhone ve iPad’de bir takvim etkinliği için saatlik hava durumunu kontrol edin",
    "short": "Etkinlik saatleri için hava durumu",
    "description": "Etkinliğinizin yerini, tarihini ve saatlerini mevcut hava durumu tahminiyle eşleştirin.",
    "lede": "Bir takvim etkinliği için hava durumunu kontrol etmek istiyorsanız üç şeyi eşleştirin: mekân, yerel tarih ve etkinliğin başlangıç-bitiş aralığı. Cloud Calendars içinde hava durumu yerini seçin ve mevcut saatleri inceleyin. Bir etkinliğin adresi ile yakındaki bir hava durumu simgesi, tek başına bunların eşleştiğini kanıtlamaz. Bu kılavuz, geliştirici Arte Soft tarafından yayımlanmıştır.",
    "commonBelief": "Takvimdeki günlük hava durumu simgesinin, bir etkinliğe ekli tahminle aynı özellik olduğu düşüncesi.",
    "sections": [
      {
        "heading": "Konum ve tarihle başlayın",
        "body": [
          "Öngörülen konumun hava tahminini açın ve tarihini takvim kaydıyla karşılaştırın. Takvimdeki hava durumu seçili hava durumu konumunu yansıtabilir; bu yüzden etkinlik adresinin bunu belirlediğini varsaymak yerine, seçimin etkinlik için uygun olduğunu doğrulayın.",
          "Gelecek ay için bir etkinlik, o tarih için hava durumu verisi henüz yokken de mevcut olabilir. Etkinliği koruyun ve tarihine yaklaştıkça tahmine yeniden bakın; hava durumu bilgisinin görünmemesi, havanın açık olacağı anlamına gelmez."
        ]
      },
      {
        "heading": "Saatlik bir soru için saatlik ayrıntıyı kullanın",
        "body": [
          "Günlük özet ve saatlik tahmin farklı soruları yanıtlar. Etkinlik iki ile beş arası sürüyorsa, tek bir günlük simgeyi tüm tablo olarak görmek yerine bu aralığı kapsayan mevcut saatleri inceleyin.",
          "Aralığın yalnızca bir bölümü kullanılabiliyorsa, kalan kısmı kesinleştirmeyin. Uygulama, oluşturabileceğiniz her etkinlik için eksiksiz saatlik hava durumu sunmayı vaat etmez; bu kılavuz da herhangi bir etkinliği açtığınızda her zaman tüm hava durumu aralığının gösterileceğini vaat etmez."
        ]
      },
      {
        "heading": "Olasılık, miktar ve zamanı birbirinden ayırın",
        "body": [
          "Kontrol ettiğiniz değerin etiketini okuyun. Yağış olasılığı, yağış miktarı veya süresi değildir. Benzer şekilde, saatlik bir değer ile günlük özet farklı zaman aralıklarını kapsar; iki olası zamanı değerlendirirken aynı zaman aralıklarını karşılaştırın.",
          "Tek bir yüzdeyi her duruma uyan evrensel bir gitme-iptal etme kuralı gibi görmek yerine, planınıza uygun bir alternatif belirleyin. Hava durumu bilgileri değişebilir; bu nedenle karar verme zamanı geldiğinde yeniden kontrol edin."
        ]
      },
      {
        "heading": "Hava durumuna göre planlanan bir etkinliği kaydetmeden önce gözden geçirin",
        "body": [
          "Uygulama, tahmindeki bir saatten yola çıkarak bir etkinlik taslağı başlatabilir. Kaydetmeden önce taslağın tarihini, başlangıç saatini, bitiş saatini ve hedef takvimini gözden geçirin. Tahminden seçim yapmak, doğru planı oluşturduğunuzu kontrol etmenin yerine geçmez.",
          "Takvim erişimi veya hedef takvim kaydetmeyi engelliyorsa, bu izin sorununu hava durumu erişiminden ayrı olarak çözün. Bir hava tahminini görebilmek, paylaşılan bir takvimde düzenleme yetkisi vermez."
        ]
      },
      {
        "heading": "Özet yeterli değilse tam tahmini kullanın",
        "body": [
          "Açık havadaki bir etkinlik için, o etkinlikle ilgili değişkenleri ve gerçekten seçtiğiniz konumu inceleyin. Anlık hava durumu bileşeni veya ana sayfa demosu, uygulamadaki mevcut tahmin saatlerini kontrol etmenin yerine geçmez.",
          "Bir tutarsızlık fark ederseniz önce konumu ve zaman damgasını karşılaştırın. Farklı sağlayıcılar, seçilen konumlar ve tahmin dönemleri, takvim etkinliğinin değiştiğini kanıtlamadan da farklı görünümler oluşturabilir."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Konumu ve etkinlik tarihini doğrulayın.",
      "Etkinliğin tamamındaki mevcut saatleri kontrol edin.",
      "Olasılık ve miktarı farklı değerler olarak okuyun.",
      "Kaydetmeden önce etkinlik taslağını gözden geçirin."
    ],
    "seeAlso": [
      "weather-inside-your-calendar",
      "planning-outdoors-without-being-rained-on"
    ],
    "updated": "2026-10-23",
    "faq": [
      {
        "q": "Her etkinlik için eksiksiz bir tahmin var mı?",
        "a": "Hayır. Kapsam, seçilen konuma ve mevcut tarih ile saatlere bağlıdır."
      },
      {
        "q": "Hava durumu simgesi etkinlik adresine özel midir?",
        "a": "Etkinliğe yakın görünmesine bakarak böyle bir sonuç çıkarmayın. Hava durumu konumunu ayrıca doğrulayın."
      },
      {
        "q": "Bir saate dokunmak yeni bir etkinliği kaydeder mi?",
        "a": "Uygun olduğunda bir etkinlik taslağı başlatır. Kaydetmeden önce tarihini, saatini ve takvimini gözden geçirin."
      }
    ],
    "sourcesHeading": "Hava durumu kaynakları ve konum ayarları",
    "sources": [
      {
        "label": "Apple: WeatherKit tahminleri ve bölgesel kullanılabilirlik",
        "url": "https://developer.apple.com/weatherkit/"
      },
      {
        "label": "Apple: Gizlilik ve Konum Servisleri",
        "url": "https://support.apple.com/en-us/102515"
      }
    ],
    "comparison": {
      "heading": "Dış mekân etkinliğinden önce pratik bir kontrol",
      "columns": [
        "Kontrol",
        "Örnek",
        "Karar"
      ],
      "rows": [
        {
          "cells": [
            "Yer",
            "Etkinlik başka bir şehirde.",
            "Hava durumu görünümünde o varış noktasını seçin ve adını okuyun."
          ]
        },
        {
          "cells": [
            "Zaman aralığı",
            "Etkinlik 14:00 ile 16:00 arasında sürüyor.",
            "Her iki saati de, ayrıca ilgili hazırlık veya yolculuk süresini inceleyin."
          ]
        },
        {
          "cells": [
            "Kapsam",
            "Gereken saatlerin yalnızca bir kısmı mevcut.",
            "Planı geçici tutun ve bir kez daha kontrol etmeyi planlayın."
          ]
        },
        {
          "cells": [
            "Kaydedilen etkinlik",
            "Bir hava durumu saatinden taslak başlatıyorsunuz.",
            "Kaydetmeden önce tarihi, saat dilimini, süreyi ve hedef takvimi gözden geçirin."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-right",
      "week-left"
    ],
    "galleryCaption": "Hava durumu ve hafta görünümleri, aynı planlama görevinin farklı bölümlerini gösterir. Tahmin yerini, etkinliğin konumundan ayrı olarak doğrulayın.",
    "actionHeading": "Tahmini gerçek etkinliklerinizle karşılaştırın",
    "actionText": "Mevcut tahmini ve programınızı gözden geçirmek için iPhone veya iPad’de Cloud Calendars kullanın. Hava durumu seçiminizi bilgilendirir; bir etkinliği otomatik olarak taşımaz veya değişikliği katılımcılarla onaylamaz.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Takvim ve hava durumu görünümlerini anlayın"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Hızlı bir Ana Ekran genel görünümü seçin"
      },
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Programınızın arkasındaki takvimleri kontrol edin"
      }
    ]
  },
  "the-widget-that-shows-what-is-next": {
    "updated": "2026-10-23",
    "title": "iPhone ve iPad’de takvim araç takımları: yaklaşan etkinlikler ve hava durumu",
    "short": "Ana Ekran’da yaklaşan etkinlikler",
    "description": "Yaklaşan etkinlikler, tarih veya hava durumu için bir Cloud Calendars araç takımı seçin.",
    "lede": "Ana Ekranınızda yaklaşan etkinlikleri görmek istiyorsanız Calendar Events veya Calendar Events Large seçeneklerini seçin. Tarih ve hava durumu gösterimi için Calendar & Weather seçeneğini kullanın. Bu düzenler farklı soruları yanıtlar; eklemeden önce cihazınızda sunulan önizlemeyi inceleyin. Bu kılavuz, Cloud Calendars’ın geliştiricisi Arte Soft tarafından yayımlanmıştır.",
    "sections": [
      {
        "heading": "Önce etkinlik düzenini seçin",
        "body": [
          "Cloud Calendars araç takımı galerisinde Calendar Events, orta boy etkinlik listesi düzenidir. Calendar Events Large, yaklaşan etkinlikler için daha fazla alan sunar. Calendar & Weather ise ayrı bir tarih ve hava durumu düzenidir; küçük boyutu, sıradaki etkinlik satırını göstereceğini garanti etmez. Adlar cihazınızda çevrilmiş görünebilir.",
          "iPhone’da Ana Ekran’daki boş bir alana basılı tutun, Düzenle ve ardından Widget Ekle’yi seçin; sonra Cloud Calendars’ı bulun ve istediğiniz düzeni seçin. Ekmeden önce önizlemeyi karşılaştırın. Apple’ın widget yönergeleri bu sistem galerisini kapsar; bu, uygulama içindeki takvim görünümlerinden ayrıdır."
        ]
      },
      {
        "heading": "Widget’ı iPad’de ekleyin ve kontrol edin",
        "body": [
          "iPad’de Apple’ın Ana Ekran widget galerisini kullanın: arka plana basılı tutun, Düzenle’yi açın, ardından Widget Ekle’ye dokunun. Cloud Calendars’ı arayın, sunulan stilleri ve boyutları inceleyin, ihtiyacınız olan düzeni ekleyin, konumlandırın ve Bitti ile tamamlayın. iPadOS sürümünüzün gösterdiği denetimleri izleyin; bir önizleme, takvim verilerinizin yüklendiğini doğrulamaz.",
          "Etkinliklere ihtiyacınız varsa Calendar Events veya Calendar Events Large’ı seçin. Yüklü uygulamanın sunduğu stilleri karşılaştırın; tarih ve hava durumu kutucuğu, etkinlik listesinden farklı bir ihtiyacı karşılar.",
          "O iPad’de Cloud Calendars’ı açın ve seçili bir takvimde gelecekteki, saatli bir etkinliği bulun. iPhone’unuzda doğru görünen bir görünüm, iPad’in hesaplarını, erişimini veya yüklenen verilerini doğrulamaz. Başlığı, tarihi ve başlangıç saatini karşılaştırın; widget farklıysa aşağıdaki uygunluk ve güncelleme kontrollerine geçin."
        ]
      },
      {
        "heading": "Yaklaşan olarak neyin sayıldığını kontrol edin",
        "body": [
          "Etkinlik görünümü, seçili takvimleri ve gelecekteki saatli etkinlikleri kullanır. Tüm gün süren kayıtlar ve başlangıç saati geçmiş etkinlikler bu yaklaşan akışına dahil edilmez. Bu nedenle bir doğum günü ya da hâlihazırda devam eden bir toplantı, burada görünmese bile uygulamada görünebilir.",
          "Örneğin bugün tek kaydınız tüm gün süren bir seyahat etiketi ise, boş bir yaklaşan listesi görmek bu etiketin kaybolduğu anlamına gelmez. Günün tamamını incelemek için uygulamayı açın. Benzer şekilde, sonraki saatli etkinlik yarın veya daha sonra olabilir; her satırın bugüne ait olduğunu varsaymak yerine tarihe bakın."
        ]
      },
      {
        "heading": "Eksik bir etkinlikle satırları dolmuş bir listeyi birbirinden ayırın",
        "body": [
          "Bir widget, yaklaşan etkinliklerin sınırlı bir bölümünü gösterir. Daha erken etkinlikler satırları dolduruyorsa, daha sonraki bir etkinlik uygulamada mevcut ve yaklaşan listesine uygun olsa bile görünmeyebilir. Daha büyük bir etkinlik düzeni daha fazla satır gösterebilir; yine de bu, takvimin tamamı değildir.",
          "Seçili bir takvimdeki en yakın gelecekteki saatli etkinlikle başlayın. Bu görünüyorsa ama daha sonraki biri görünmüyorsa, programın kalanını incelemek için uygulamayı açın. En yakın uygun etkinlik de eksikse, takvim seçimi, erişim ve güncelleme kontrollerine devam edin. Sadece daha sonraki bir kaydın görünmesi için etkinlikleri taşımayın veya silmeyin."
        ]
      },
      {
        "heading": "İlk karşılaştırmanızı uygulamayla yapın",
        "body": [
          "Cloud Calendars’ı açın ve gelecekteki belirli bir saatli etkinliği bulun. Ait olduğu takvimin seçili olduğunu ve uygulamanın ihtiyaç duyduğu takvim erişimine sahip olduğunu doğrulayın. Başlığı, tarihi ve başlangıç saatini widget ile karşılaştırın. Etkinlik uygulamada da yoksa önce hesap veya eşitlemeyi inceleyin.",
          "Net bir örneğe ihtiyacınız varsa, sahibi olduğunuz bir takvimde zararsız bir test etkinliği kullanın. Gelecekte bir başlangıç saati ve kolay tanınan bir başlık verin. Sadece Ana Ekran’ı test etmek için gerçek bir daveti değiştirmeyin veya hesapları kaldırmayın."
        ]
      },
      {
        "heading": "Sabit bir süre varsaymadan güncellemeleri hesaba katın",
        "body": [
          "Widget’lar kaydedilmiş bilgileri gösterir ve açık bir uygulama gibi sürekli çalışmaz. Güncelleme zamanlamasını Apple belirler. Uygulamayı açıp etkinliği kontrol etmek size güncel bir karşılaştırma noktası sağlar, ancak widget’ın kaç saniye içinde değişmesi gerektiğine dair kesin bir süre vermez.",
          "Uygulama doğru kalırken widget yanlış görünmeye devam ediyorsa düzeni, seçili takvimi, etkinlik saatini ve uygulama/iOS sürümlerini not edin. Boş bir liste, eski bir etkinlik ve yanlış bir saat farklı gözlemlerdir; hangisini gördüğünüzü belirtin."
        ]
      },
      {
        "heading": "Hava durumunu ayrı bir özet olarak okuyun",
        "body": [
          "Tarihin yanındaki hava durumu, her etkinliğin mekânına ve başlangıç saatine bağlı bir tahmin değildir. Açık hava etkinliğinden önce hava durumu görünümünü açın ve planlanan yer ile saati kontrol edin. Mevcut koşulları gösteren bir simge, daha sonraki bir toplantıda havanın nasıl olacağını gösteremez.",
          "Bu widget’ı hızlı bir genel bakış için kullanın. Tüm gün süren yükümlülükler, etkinlik ayrıntıları ve tüm programı gerektiren kararlar için tam takvimi kullanın."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Etkinlik listesi için Calendar Events veya Calendar Events Large’ı seçin.",
      "Seçili bir takvimde gelecekteki saatli bir etkinliği doğrulayın.",
      "Widget’da sorun gidermeden önce uygulamadaki tarih ve saati karşılaştırın.",
      "Takvim verilerini silmek yerine kalıcı farkları not edin."
    ],
    "faq": [
      {
        "q": "Doğum günüm neden görünmüyor?",
        "a": "Yaklaşan akışı, tüm gün süren etkinlikleri hariç tutar. Doğum günleri ve yalnızca tarih içeren diğer kayıtlar için tam takvimi kontrol edin."
      },
      {
        "q": "Küçük widget sonraki toplantıyı gösterir mi?",
        "a": "Küçük Calendar & Weather düzeni tarih ve hava durumunu gösterir. Etkinlikler için bir etkinlik listesi düzeni seçin."
      },
      {
        "q": "Yaklaşan etkinlik görünmüyorsa bugün boşta mıyım?",
        "a": "Hayır. Tüm gün süren kayıtlar, devam eden etkinlikler, seçilmemiş takvimler ve güncel olmayan bilgiler bu sonucu değiştirebilir."
      }
    ],
    "sourcesHeading": "Kaynaklar ve Apple yönergeleri",
    "sources": [
      {
        "label": "Apple: iPhone’da widget ekleme ve düzenleme",
        "url": "https://support.apple.com/118610"
      },
      {
        "label": "Apple: Bir widget’ı güncel tutma",
        "url": "https://developer.apple.com/documentation/widgetkit/keeping-a-widget-up-to-date"
      },
      {
        "label": "Apple: iPad’de widget ekleme, düzenleme ve kaldırma",
        "url": "https://support.apple.com/guide/ipad/add-edit-and-remove-widgets-ipadb0de8630/ipados"
      }
    ],
    "seeAlso": [
      "choosing-a-widget-size",
      "a-countdown-to-your-next-meeting",
      "calendar-on-apple-watch"
    ],
    "comparison": {
      "heading": "Gerçekte ihtiyacınız olan görünümü seçin",
      "columns": [
        "Görünüm",
        "Kullanım amacı",
        "Güvenmeden önce kontrol edin"
      ],
      "rows": [
        {
          "cells": [
            "Calendar Events",
            "Yaklaşan saatli etkinliklerin kompakt görünümü.",
            "Etkinlik seçili bir takvime ait ve henüz başlamamış olmalı."
          ]
        },
        {
          "cells": [
            "Calendar Events Large",
            "Yaklaşan etkinlikler için daha fazla alan.",
            "Daha büyük düzenin de satır sayısı sınırlıdır."
          ]
        },
        {
          "cells": [
            "Calendar & Weather",
            "Hızlı bir tarih ve hava durumu özeti.",
            "Küçük düzeni, yaklaşan etkinlik satırı göstereceğini garanti etmez."
          ]
        },
        {
          "cells": [
            "Live Activity",
            "Desteklenen iPhone yüzeylerinde ayrı bir sonraki etkinlik geri sayımı.",
            "Bu bir Ana Ekran widget’ı veya özel bir Kilit Ekranı widget düzeni değildir."
          ]
        }
      ]
    },
    "galleryKinds": [
      "widgets",
      "live"
    ],
    "galleryCaption": "Ana Ekran widget’ları ile Live Activity ayrı görünümlerdir. İhtiyaç duyduğunuz bilgiye uygun düzeni seçin.",
    "actionHeading": "Programınızın yararlı kısmını Ana Ekran’a taşıyın",
    "actionText": "Cloud Calendars’ı açın, bildiğiniz gelecekteki saatli bir etkinliği kontrol edin ve ardından iPhone veya iPad’inize uygun widget’ı ekleyin. Takvimin tamamını incelemek için asıl yer yine uygulamadır.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Programınızın yanında hava durumunu inceleyin"
      },
      {
        "slug": "forecast-beside-every-event",
        "label": "Açık hava etkinliğinin saatlerini kontrol edin"
      },
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Bağlı takvim hesaplarınızı kontrol edin"
      }
    ]
  },
  "onecal-alternative-iphone-calendar-view-or-sync": {
    "updated": "2026-10-23",
    "title": "Cloud Calendars mı OneCal mı? Birleşik görünüm veya takvim eşitlemesi seçin",
    "short": "İş akışına göre Cloud Calendars ve OneCal",
    "description": "OneCal ile Cloud Calendars’ı görünümler, kopyalanan etkinlikler, mobil denetimler ve planlar açısından karşılaştırın.",
    "lede": "İhtiyacınız olan sonuca göre seçim yapın: birkaç programı birlikte gözden geçirmek, orijinal bir etkinliği düzenlemek veya meşguliyet zamanını başka bir hesaba kopyalamak. Cloud Calendars, iPhone ve iPad için planlama görünümleri sunar; OneCal ise birleşik görünümü ve ayrı Calendar Sync kurallarını belgelendirir. Bu karşılaştırma, Cloud Calendars’ın geliştiricisi Arte Soft tarafından yayımlanmıştır.",
    "commonBelief": "Google, iCloud ve Outlook takvimlerini gösteren iki ürünün, müsaitliği, etkinlik düzenlemelerini ve kopyaları zorunlu olarak aynı şekilde eşit tuttuğu.",
    "sections": [
      {
        "heading": "Genel bakış ile başka bir hesaptaki değişiklik arasında seçim yapın",
        "body": [
          "Amacınız kişisel bir etkinliği iş toplantısının yanında görmekse, birleşik görünüme ihtiyacınız vardır. İş takviminizde kişisel etkinlik için bir meşguliyet bloğu da bulunması gerekiyorsa, tanımlı bir kaynak-hedef iş akışına ihtiyacınız vardır. İlk sonuç, ikincisini sağlamaz.",
          "Cloud Calendars, seçilen takvimleri iPhone ve iPad’deki bir planlama görünümüne getirir. OneCal, Unified Calendar View özelliğini Calendar Sync’ten ayrı olarak belgelendirir; yayıncısı, eşitleme kurallarını yapılandırmadan da bu görünümü kullanabileceğinizi söyler. Hesapları bağlamadan veya abonelik adlarını karşılaştırmadan önce hangi sonucun önemli olduğuna karar verin."
        ]
      },
      {
        "heading": "Kopyalanmış bir etkinliğin neyi değiştirebileceğini anlayın",
        "body": [
          "OneCal’ın Calendar Sync belgeleri, klon etkinlikler oluşturan tek yönlü ve çok yönlü kuralları açıklar. Ayrı kapsam kılavuzu ise bir klonda yapılan düzenlemelerin orijinale geri aktarılmadığını söyler. Kopyalanmış bir etkinliği toplantıyı yeniden planlayacağınız yer olarak görmeden önce, orijinali ve ona sahip takvimi belirleyin.",
          "Cloud Calendars sağlayıcı bağlantıları da iOS deposunda yansıtılmış takvimler oluşturabilir. Birleşik görünüm, kayıtların birleştirildiğini veya bir düzenlemenin sağlayıcıya ulaştığını kanıtlamaz. Sahibi olduğunuz ve düzenleyebildiğiniz bir takvim için, misafirsiz geçici bir etkinliği hem sağlayıcıda hem de uygulamada kontrol edin."
        ]
      },
      {
        "heading": "Gerçekte kullanacağınız aygıttaki denetimleri kontrol edin",
        "body": [
          "OneCal’ın mevcut mobil kılavuzu; takvim etkinlikleri oluşturma ve düzenleme, yinelenme seçenekleri, RSVP ve toplantılara katılmayı açıklar. Ayrıca Calendar Sync yapılandırmalarını oluşturma, düzenleme, duraklatma veya silmenin web uygulamasında yapıldığını; mobilde ise bu yapılandırmaların gösterildiğini ayrı olarak belirtir. Rezervasyon bağlantısı kurulumu da web görevi olarak açıklanır.",
          "Cloud Calendars; gün, hafta, ay, yıl ve liste görünümlerine sahip bir iPhone ve iPad uygulamasıdır. İhtiyacınız olan düzenlemeyi yüklü görünümünüzde deneyin, varsa yinelenme seçimini okuyun ve kaydedilen etkinliği doğrulayın. Başka bir ürünün mobil menüsünün, rezervasyon iş akışının veya otomasyon denetimlerinin bunda da bulunduğunu varsaymayın."
        ]
      },
      {
        "heading": "Sınırsız geçmiş varsaymak yerine kapsamı doğrulayın",
        "body": [
          "OneCal’ın mevcut kapsam kılavuzu, Google ve iCloud için en fazla bir yıllık, Outlook için ise en fazla üç aylık ileriye dönük eşitleme penceresi listeler. Ayrıca gelecekteki yinelenen seriler ile geçmişteki tekil etkinlikleri de ayırt eder. Bunlar yayıncının belgelendirdiği sınırlardır; sizin belirli hesabınızın testi veya takvim görünümündeki her özellik hakkında bir iddia değildir.",
          "Cloud Calendars için de hesap yolu, seçilen takvimler ve ilgili tarihler kontrol edilmelidir. Eski toplantılar önemliyse, belirli bir etkinliği sağlayıcıda ve uygulamada karşılaştırın. Bir takvim uygulaması kendiliğinden eksiksiz bir yedekleme değildir ve geçmişteki her kaydın alınmış olduğunu garanti etmez."
        ]
      },
      {
        "heading": "Plan gereksinimlerini ve faturalandırma yolunu karşılaştırın",
        "body": [
          "Cloud Calendars, Google Calendar eşitlemesini Base’e dahil eder; Advanced reklamları kaldırır ve Premium Microsoft Calendar ile Teams desteği ekler. Hesap izinlerini plandan ayrı olarak doğrulayın. Satın almadan önce sabit bir uluslararası fiyat karşılaştırması kullanmak yerine, güncel yerel fiyatı ve faturalandırma dönemini kontrol edin.",
          "OneCal’ın web plan kılavuzu, deneme süresi sona erdiğinde klonların kaldırılması dahil olmak üzere üye başına planları ve on dört günlük denemeyi açıklar. Mobil faturalandırma kılavuzu ise mağaza tarafından yönetilen satın almaları ve ekip üyeleri eklemeye ilişkin kısıtlamaları açıklar. Hangi özelliklerin devam eden bir plan gerektirdiğini ve satın almanın nerede yönetildiğini kontrol edin; yalnızca ücretsiz indirme bu soruların yanıtı değildir."
        ]
      },
      {
        "heading": "Geçiş yapmadan önce gerçek planlama iş akışınızı test edin",
        "body": [
          "Hava durumu, araç takımları veya Live Activity önemliyse, bunları kullandığınız aygıttaki denemeye dahil edin. Cloud Calendars bu planlama yüzeylerini sunar; hava durumu ise mevcut tarihler ve seçilen yerle sınırlıdır. Burada incelenen OneCal sayfaları, bu yüzeyler için özellik eşdeğerliğini göstermemektedir; bir kılavuzdan yokluk sonucu çıkarmak yerine, mevcut ürününü kontrol edin.",
          "Gerekli sonucu doğrulayıncaya kadar orijinal uygulamaları ve bağlantı ayrıntılarını saklayın. Görünürlüğü, orijinal etkinlik düzenlemeyi, kopyalanmış meşguliyet zamanını veya bir hatırlatıcıyı doğrulayıp doğrulamadığınızı not edin; bunlar farklı sonuçlardır. Bir hizmetin bağlantısını kesmeden önce, mevcut kopyalara ne olduğunu gözden geçirin ve canlı bir davet veya gerçek bir müşteri toplantısı üzerinde deneme yapmaktan kaçının."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Birleşik görünüme mi yoksa etkinliklerin başka bir hesaba kopyalanmasına mı ihtiyacınız olduğunu not edin.",
      "Orijinalleri, kopyaları ve her önemli etkinliğin sahibi olan hesabı belirleyin.",
      "Gerekli denetimleri kullandığınız gerçek telefon, tablet veya web iş akışında kontrol edin.",
      "Sıradan bir haftayı ve güvendiğiniz geçmiş tarihleri karşılaştırın.",
      "Güncel plan gereksinimlerini, yerel fiyatı ve satın alma sağlayıcısını kontrol edin.",
      "Geçiş yapmadan önce geçici bir etkinliği doğrulayın ve kopya kaldırma kurallarını gözden geçirin."
    ],
    "faq": [
      {
        "q": "Birleşik takvim görünümü, meşguliyet zamanını eşitlemekle aynı şey midir?",
        "a": "Hayır. Birleşik görünüm, taahhütlerinizi karşılaştırmanıza olanak tanır. Başka bir hesapta giriş oluşturmak, ayrı ve desteklenen bir iş akışı gerektirir; OneCal, Calendar Sync kurallarını Unified Calendar View’dan ayrı olarak belgelendirir."
      },
      {
        "q": "Orijinal toplantıyı yeniden planlamak için bir OneCal klonunu değiştirebilir miyim?",
        "a": "Kapsam kılavuzu, klon düzenlemelerinin orijinale aktarılmadığını söylüyor. Orijinal etkinliği belirleyin ve onun takviminin düzenleme ile düzenleyici izinlerini izleyin."
      },
      {
        "q": "Kurulumum için hangi uygulama daha ucuz?",
        "a": "Bu; ihtiyaç duyduğunuz özelliklere, hesaplara, faturalandırma yoluna ve yerel fiyata bağlıdır. Cloud Calendars, Google eşitlemesini Base’te ve Microsoft desteğini Premium’da içerir. Hedeflediğiniz iş akışı için OneCal’ın güncel planını ve mobil faturalandırma koşullarını inceleyin; bu kılavuz evrensel bir fiyat kazananı iddia etmez."
      }
    ],
    "sourcesHeading": "OneCal’ın resmî iş akışı ve plan belgeleri",
    "sources": [
      {
        "label": "OneCal: mobil özellikler ve yalnızca web’de yapılabilen yapılandırma görevleri",
        "url": "https://docs.onecal.io/docs/mobile-apps"
      },
      {
        "label": "OneCal: Calendar Sync ve kaynak-hedef kuralları",
        "url": "https://docs.onecal.io/docs/calendar-sync/calendar-sync-intro"
      },
      {
        "label": "OneCal: eşitleme pencereleri ve klon etkinliklerdeki düzenlemeler",
        "url": "https://docs.onecal.io/docs/calendar-sync/what-does-onecal-sync"
      },
      {
        "label": "OneCal: planlar, deneme ve süre bitimi davranışı",
        "url": "https://docs.onecal.io/docs/billing/plans-and-free-trial"
      },
      {
        "label": "OneCal: App Store ve Google Play abonelikleri",
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
      "heading": "Abonelikten önce iş akışını karşılaştırın",
      "columns": [
        "Soru",
        "Cloud Calendars",
        "OneCal belgeleri"
      ],
      "rows": [
        {
          "cells": [
            "Programımı nerede gözden geçiririm?",
            "iPhone ve iPad’de; gün, hafta, ay, yıl ve liste görünümleriyle.",
            "Unified Calendar View, Calendar Sync yapılandırmasından ayrıdır."
          ]
        },
        {
          "cells": [
            "Hesaplar arasında kopyalanmış meşguliyet bloklarına ihtiyacım var mı?",
            "Bunu birleşik görünümden çıkarmayın; sağlayıcı bağlantıları takvimleri yerel olarak yansıtabilir.",
            "Calendar Sync, tek yönlü veya çok yönlü kurallar kullanarak klon etkinlikler oluşturur."
          ]
        },
        {
          "cells": [
            "Eşitleme kurallarını nerede değiştiririm?",
            "Uygulamanın hesap bağlantısı için belgelenmiş denetimleri kullanın.",
            "İncelenen mobil kılavuz, eşitleme yapılandırması değişikliklerini web uygulamasına atar."
          ]
        },
        {
          "cells": [
            "Hangi Cloud Calendars planına ihtiyacım var?",
            "Base, Google Calendar eşitlemesini içerir; Advanced reklamları kaldırır; Premium ise Microsoft Calendar ve Teams ekler.",
            "Gerekli iş akışı için güncel OneCal planını ve faturalandırma yolunu kontrol edin."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-left",
      "hook"
    ],
    "galleryCaption": "Cloud Calendars’ın gerçek takvim ekranları planlama görünümünü gösterir. Karşılaştırma, bu görünüm ile bir hizmetin sunucu tarafındaki klon kuralları arasındaki farkı ortaya koyar.",
    "actionHeading": "Doğrulamak istediğiniz sonucu seçin",
    "actionText": "iPhone veya iPad’de hava durumu ve araç takımları içeren bir genel bakış için Cloud Calendars’ı zararsız bir test etkinliğiyle deneyin. Gereksiniminiz başka bir hesaba kopyalanmış meşguliyet zamanıysa, bu işlemi açıkça belgelendiren bir hizmeti değerlendirin.",
    "articleLinks": [
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Birleşik bir takvim görünümü ayarlayın"
      },
      {
        "slug": "fantastical-readdle-calendar366-iphone-comparison",
        "label": "Diğer iPhone takvim seçeneklerini karşılaştırın"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Ana Ekran görünümünüzü seçin"
      }
    ]
  },
  "fantastical-readdle-calendar366-iphone-comparison": {
    "updated": "2026-10-23",
    "title": "iPhone takvim alternatifleri: Cloud Calendars, Fantastical, Readdle ve BusyCal",
    "short": "iPhone takvim alternatiflerini karşılaştırın",
    "description": "iPhone takvimlerini hava durumu, görünümler, görevler ve ihtiyaç duyduğunuz iş akışına göre karşılaştırın.",
    "lede": "Bitirmek istediğiniz işe göre bir takvim seçin: etkinlikleri hava durumuyla birlikte gözden geçirmek, hızlıca etkinlik girmek, görevleri yönetmek veya hesap görünümlerini birleştirmek. Cloud Calendars, Fantastical, Calendars by Readdle, Calendar 366 ve BusyCal bu iş akışlarında ve plan gereksinimlerinde farklılık gösterir. Cloud Calendars, Arte Soft tarafından geliştirilmiştir ve bu karşılaştırma Arte Soft tarafından yayımlanmıştır.",
    "sections": [
      {
        "heading": "Görünümü karşılaştırmadan önce nelerin mutlaka çalışması gerektiğini belirleyin",
        "body": [
          "Takvim sağlayıcılarınızı, cihazlarınızı ve sizin için kritik olan üç işlemi yazın. Örneğin: iş ve kişisel takvimleri birlikte görmek, bir anımsatmayı tamamlamak ve hızlıca toplantı eklemek. Tüm programı içe aktarmadan önce bu işlemleri özel örnek verilerle test edin.",
          "Bir ürünün sağlayıcınızın adını desteklemesi, her bağlantı yönteminin aynı izinlere veya özelliklere sahip olduğu anlamına gelmez. Cihaz takvimi, doğrudan bağlanan bir hesap ve abone olunan bir besleme benzer görünen kayıtlar oluşturabilir; ancak izin verilen işlemler farklı olabilir."
        ]
      },
      {
        "heading": "Temel karşılaştırma noktası olarak sağlayıcının kendi takvimini kullanın",
        "body": [
          "Google’ın başlangıç kılavuzu, planlama, görevler, paylaşım ve birden fazla takvim için kendi takvim arayüzünü açıklar. Programınız zaten oradaysa, başka bir uygulamaya ihtiyaç duyup duymadığınıza karar vermeden önce gereken işlemi kaynağında test edin.",
          "Örneğin, hedef hesabı bağladıktan sonra aynı etkinliği Google Calendar ve Fantastical içinde karşılaştırın. İhtiyaç duyduğunuz avantajın birleşik görünüm, görev bağlantısı, hızlı giriş veya belirli bir cihaz arayüzü olup olmadığını kontrol edin. Farklı bir takvim istemcisi kullanmak, otomatik olarak farklı bir sağlayıcıya geçiş anlamına gelmez."
        ]
      },
      {
        "heading": "Fantastical: hesap bağlantılarını ve hızlı girişi kontrol edin",
        "body": [
          "Flexibits, hem doğrudan takvim hesabı bağlantılarını hem de iOS’te zaten yapılandırılmış takvimler ve anımsatmalar için seçenekleri belgeler. Başlangıç kılavuzu, uygulamanın özelliklerinden tam yararlanmak için doğrudan bağlantıları önerir. Aynı takvimi sebepsiz yere iki kez bağlamak yerine hangi yolu seçtiğinizi belirleyin.",
          "Fantastical ayrıca cümle tabanlı girişi ve yeniden kullanılabilir etkinlik veya görev şablonlarını da belgelendirir. Açık bir tarih, süre ve hedef takvimle test yapın; sonra kaydedilen sonucu inceleyin. Bu sözdizimi Fantastical’a özgüdür; başka bir uygulamanın metin alanı aynı cümleyi farklı yorumlayabilir."
        ]
      },
      {
        "heading": "Calendars by Readdle: görev kaynağını kontrol edin",
        "body": [
          "Readdle; Google, Outlook ve iCloud takvimlerini görev ve doğal dil girişi özellikleriyle birlikte sunar. Görev kurulum kılavuzu, Görev Seçenekleri içinde iOS Reminders veya Google Tasks seçimini açıklar. Telefonda görevi tamamlamanın belirli bir özgün listeyi güncellemesi gerekiyorsa bu seçim önemlidir.",
          "Yalnızca başlığın zaman çizelgesinde görünüp görünmediğine değil, tamamlamanın iki tarafta da işleyip işlemediğine bakmak için tek kullanımlık bir görevle test yapın. iPhone’un yanında Mac üzerinde de belirli bir görünüm veya işlem gerekiyorsa, orada da test edin. Ortak ürün adına bakarak kontrollerin aynı olduğunu varsaymayın."
        ]
      },
      {
        "heading": "Calendar 366: sistem erişimini, kümeleri ve hava durumu konumunu kontrol edin",
        "body": [
          "Calendar 366 belgeleri, sistem takvimleri ve anımsatmalarına erişim ile doğrudan hesap entegrasyonlarını birbirinden ayırır. Görünen takvimleri ve listeleri seçen takvim kümelerini açıklar. Bu kümeler varsayılan takvimi de belirleyebilir; bu yüzden yeni oluşturulan etkinliğin nereye ait olacağını kontrol edin.",
          "Aynı belgeler, kendi doğal dil çözümleyicisini ve Apple Weather kullanan hava durumu özelliğini, sistem veya özel konum seçenekleriyle açıklar. Açık hava planlaması için tahminin her etkinliğin adresini izleyeceğini varsaymak yerine seçili yeri doğrulayın. Bunlar yayıncının belgelendirdiği yeteneklerdir; hesabınızda test edilmiş özellikler değildir."
        ]
      },
      {
        "heading": "BusyCal: görev görünümünü ve hava durumu için kullanılan görünümü kontrol edin",
        "body": [
          "BusyCal’ın iOS görev kılavuzu, tarihli, saatli ve tarihsiz görevleri birbirinden ayırır. Tamamlama denetimlerini ve bitmemiş tarihli görevleri ileri taşıma özelliğini açıklar. Hava durumu kılavuzu tahminleri Liste, Gün ve Ay görünümlerine yerleştirir; bu nedenle hava durumunun her yerde göründüğünü varsaymak yerine kullandığınız görünümü test edin.",
          "BusyCal ayrıca yeni etkinlik varsayılanlarında doğal dil girişini bir seçenek olarak belgelendirir. Diğer uygulamalarda kullandığınız aynı özel örnek etkinliği deneyin, ardından takvimi ve kaydedilen saati kontrol edin. Bunlar BusyCal denetimleridir; her takvim uygulamasının ortak komutları değildir."
        ]
      },
      {
        "heading": "Watch iş akışını telefondan ayrı değerlendirin",
        "body": [
          "Fantastical’ın Watch kılavuzu, görev tamamlama dahil Up Next, List ve Tasks görünümlerini açıklar. BusyCal’ın görev kılavuzu, Watch’ta gösterilen tarihli ve saatli görevlerle tarihsiz görevleri ayırır. Tarihsiz bir birikim önemliyse yalnızca bir sonraki etkinliği test etmek yerine bunu da denemeye dahil edin.",
          "Watch complication hızlı bir bakıştır; Watch uygulaması ise ek işlemler sunabilir. Veriyi ve işlemi gerçek saat ile telefonda doğrulayın, ayrıca mevcut planı gözden geçirin. Masaüstü, telefon ve saat arayüzleri yalnızca aynı ürün adını taşıdıkları için birbirinin yerine geçmez."
        ]
      },
      {
        "heading": "Fiyatı ve hakları ayrı bir kontrol olarak ele alın",
        "body": [
          "Mevcut yerel satın alma ekranını, deneme bittikten sonra hangi özelliklerin kullanılabildiğini ve önceki bir satın alımın haklarınızı değiştirip değiştirmediğini kontrol edin. Ücretsiz indirme, yinelenen abonelik ve eski bir satın alım mutlaka aynı özellik setini açmaz.",
          "Yayıncı sayfaları farklı zamanlarda değişebilir. Readdle’ın mevcut ürün SSS’si bazı temel yetenekleri ücretsiz olarak açıklarken, ayrı bir ücretsiz ve tam sürüm yardım sayfası farklı bir ayrım listeler. Tek bir açıklamayı evrensel bir vaat gibi görmek yerine, gereken işlemi kurulu uygulamada ve güncel satın alma koşullarında doğrulayın."
        ]
      },
      {
        "heading": "Kısa listedeki yeriyle Cloud Calendars",
        "body": [
          "Cloud Calendars; seçili takvimler, birden fazla planlama görünümü, hava durumu ve widget’lar için başka bir iPhone ve iPad seçeneğidir. Google eşitlemesi Base’e dahildir, Advanced reklamları kaldırır ve Premium Microsoft calendar desteği ekler. Kurulumunuz için güncel planı ve sağlayıcı izinlerini kontrol edin.",
          "Uzmanlaşmış bir görev bağlantısı, şablon komutu veya masaüstü iş akışı zorunluysa, bu gereksinimi belgeleyen ve başarıyla yerine getiren ürünü kullanın. Kaydedilen sonuçları ve günlük çabayı karşılaştırın; bu kontrol listesi seçim yapmanıza yardımcı olmalı, burada anılan her özelliğin Cloud Calendars içinde bulunduğunu ima etmemelidir."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Hesaplarınızı, cihazlarınızı ve temel işlemlerinizi listeleyin.",
      "Tek bir hesap bağlantı yolu seçin ve bunun hangi takvimleri gösterdiğini inceleyin.",
      "Hızlı giriş ve görev tamamlama işlemlerini zararsız örneklerle test edin.",
      "Hava durumu konumunu ve her cihazda kullanılan görünümleri doğrulayın.",
      "Herhangi bir deneme veya eski hak sonrasında güncel satın alma koşullarını kontrol edin."
    ],
    "faq": [
      {
        "q": "Fantastical için en iyi alternatif hangisi?",
        "a": "Bu, ihtiyaç duyduğunuz iş akışına bağlıdır. Takvim ve görev kaynaklarını, etkinlik girişini, cihaz desteğini ve mevcut hakları karşılaştırın. Bu kılavuz evrensel bir performans kazananı ilan etmez."
      },
      {
        "q": "Aynı sağlayıcı adı, her uygulamanın aynı şekilde eşitlendiği anlamına mı gelir?",
        "a": "Hayır. Doğrudan bağlantıları, cihaz takvimlerini, beslemeleri ve izinleri ayrı ayrı kontrol edin; ardından örnek bir değişikliği kaynağında doğrulayın."
      },
      {
        "q": "Reklamı yapılan her özelliğin ücretsiz olduğunu varsayabilir miyim?",
        "a": "Hayır. Kurulu uygulamayı, yerel satın alma ekranını ve deneme sonrasında kalan özellikleri kontrol edin. Yayıncı belgeleri farklı sürümleri veya hakları açıklıyor olabilir."
      }
    ],
    "sourcesHeading": "Bu kılavuz için kontrol edilen resmî belgeler",
    "sources": [
      {
        "label": "Fantastical: hesap bağlantı yolları",
        "url": "https://flexibits.com/fantastical-ios/help/getting-started"
      },
      {
        "label": "Fantastical: doğal dil girişi ve şablonlar",
        "url": "https://flexibits.com/fantastical-ios/help/adding-events-and-tasks"
      },
      {
        "label": "Readdle: güncel ürün yetenekleri ve SSS",
        "url": "https://readdle.com/calendars"
      },
      {
        "label": "Readdle: görev kaynağı seçimi",
        "url": "https://support.readdle.com/calendars/synchronization/how-to-sync-tasks-with-ios-reminders-or-google-tasks"
      },
      {
        "label": "Readdle: ayrı ücretsiz/tam plan rehberi",
        "url": "https://apphelp.readdle.com/en/index.php?id=585&pg=kb.page"
      },
      {
        "label": "Calendar 366: entegrasyonlar, kümeler, hızlı giriş ve hava durumu",
        "url": "https://calendar366.com/help/index.html"
      },
      {
        "label": "iOS için BusyCal: görevler ve Watch görev sınırları",
        "url": "https://www.busymac.com/docs/busycalios/70659-tasks/"
      },
      {
        "label": "iOS için BusyCal: hava durumu ve desteklenen görünümler",
        "url": "https://www.busymac.com/docs/busycalios/70665-weather/"
      },
      {
        "label": "iOS için BusyCal: doğal dil girişi",
        "url": "https://www.busymac.com/docs/busycalios/70669-natural-language/"
      },
      {
        "label": "Fantastical: Apple Watch görünümleri ve işlemleri",
        "url": "https://flexibits.com/fantastical-ios/help/apple-watch"
      },
      {
        "label": "Google: Calendar’ın kendi hesap tabanlı arayüzü",
        "url": "https://support.google.com/calendar/answer/2465776?hl=en"
      }
    ],
    "seeAlso": [
      "what-fantastical-costs-and-what-this-does",
      "natural-language-calendar-events-iphone",
      "iphone-calendar-tasks-reminders-versus-event-alerts"
    ],
    "comparison": {
      "heading": "Önce ana gereksiniminizden başlayın",
      "columns": [
        "Gereksinim",
        "Kontrol edilmesi gereken ilgili seçenekler",
        "Önemli ayrım"
      ],
      "rows": [
        {
          "cells": [
            "Hava durumuyla birlikte etkinlikler ve iPhone/iPad görünümleri",
            "Cloud Calendars ve karşılaştırılan uygulamalarda belgelendirilmiş hava durumu görünümleri.",
            "Tahmin konumunu, kullanılabilir dönemi ve görünümü kontrol edin; hava durumu kapsamı sınırsız değildir."
          ]
        },
        {
          "cells": [
            "Doğal dille etkinlik girişi",
            "Fantastical ve Readdle veya BusyCal içindeki ilgili özellik.",
            "Cümle çözümleme, dikte veya normal etkinlik düzenleme ile aynı şey değildir."
          ]
        },
        {
          "cells": [
            "Etkinliklerin yanında görevler",
            "Readdle, Calendar 366, BusyCal veya Fantastical içindeki belgelendirilmiş görev kaynağı.",
            "Etkinlik anımsatıcısı, görev tamamlama entegrasyonu değildir."
          ]
        },
        {
          "cells": [
            "Google Calendar eşitlemesi ve isteğe bağlı reklam kaldırma",
            "Cloud Calendars Base, Google Calendar eşitlemesini içerir; Advanced reklamları kaldırır.",
            "Microsoft Calendar ve Teams desteği için Premium gerekir."
          ]
        },
        {
          "cells": [
            "Farklı bir satın alma modeli",
            "Her uygulama ve platform için mevcut mağaza listelemesi ve haklar.",
            "Ücretsiz indirme, her özelliğin ücretsiz olduğunun kanıtı değildir; bölgesel fiyatlar ve planlar değişebilir."
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
    "galleryCaption": "Bunlar, uygulamanın görünümleri, hava durumu ve widget’ları için Cloud Calendars ekranlarıdır. Karşılaştırmadaki diğer ürünlerin ekran görüntüleri değildir.",
    "actionHeading": "Takvimi gerçek bir planlama ihtiyacına göre deneyin",
    "actionText": "Ana gereksiniminiz hava durumu ve widget’larla birlikte bir iPhone veya iPad programıysa, Cloud Calendars’ı tek kullanımlık bir etkinlikle değerlendirin. Ürünleri karşılaştırırken uzmanlaşmış görev, rezervasyon ve doğal dil gereksinimlerini ayrı tutun.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Hava durumunun takvim iş akışına nasıl uyduğunu görün"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Cloud Calendars widget’larını karşılaştırın"
      },
      {
        "slug": "onecal-alternative-iphone-calendar-view-or-sync",
        "label": "Birleşik görünüm ile kopyalanmış meşgul zamanını ayırt edin"
      }
    ]
  }
};
