import { LocalisedArticle } from '../types';

/** Altı Google yazısı: net sorular, net cevaplar. */
export const GOOGLE_TR: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
  "updated": "2026-10-21",
  "title": "Google Calendar paylaşımı: gerçek erişimi kontrol edin",
  "short": "Google Calendar erişimi ve gizlilik",
  "description": "Google Calendar için uygun görüntüleme veya düzenleme hakkını seçin. Kişisel izinlerle birlikte herkese açık, grup ve kuruluş erişimini inceleyin.",
  "lede": "Paylaşmadan önce kişinin boş zamanı görmesi, ayrıntıları okuması veya takvimi yönetmesi gerekip gerekmediğini belirleyin. Bu rehberi Cloud Calendars geliştiricisi Arte Soft yayımlamıştır.",
  "commonBelief": "Bir kişiyi kısıtlamak, ayrıntıları başka hiçbir yoldan göremeyeceğini garanti eder.",
  "sections": [
    {
      "heading": "İzni göreve göre seçin",
      "body": [
        "Zaman ayarlayan bir iş arkadaşı yalnızca uygunluğunuzu görmek isteyebilir. Proje programını yöneten kişinin ihtiyacı farklıdır. Önce görevi belirleyin, sonra güncel paylaşım ayarını inceleyin.",
        "Google uygunluk, etkinlik ayrıntıları ve birkaç düzenleme düzeyini ayırır. Bir seçenek özel etkinlik erişimini sınırlar; başka biri düzenleme ve ayrıntılara izin verir; en genişi paylaşım yönetimini de içerir. Tüm değişiklik seçeneklerini eşit saymayın."
      ]
    },
    {
      "heading": "Takvimin genel erişimini de inceleyin",
      "body": [
        "Tek tek kişiler dışında herkese açıklığı, kuruluşu ve grupları kontrol edin. Google’a göre geniş erişim dar izni geçersiz kılabilir: kişiyi kısıtlamak zaten yayımlanmış ayrıntıları gizlemez.",
        "Kulüp programına kişisel randevu koymadan önce yalnızca bir arkadaşın iznine değil bütün izleyici kitlesine bakın. Özel randevuları uygun takvimde tutun."
      ]
    },
    {
      "heading": "Doğru takvimin Google ayarlarını kullanın",
      "body": [
        "Bilgisayarda Google Calendar içinde takvimi bulun, menüsünü ve paylaşım ayarlarını açın. Kişi veya gruplar ile genel erişim farklı alanlardadır. Takvim adını ve oturum açılan hesabı kontrol edin.",
        "Alıcının amaçlanan Google kimliğini doğrulayın. Takvim görünmüyorsa erişimi genişletmek yerine adresi ve daveti inceleyin. Eksik görüntü ile yetersiz düzenleme hakkı farklı sorunlardır."
      ]
    },
    {
      "heading": "Özel bilgi kullanmadan deneyin",
      "body": [
        "Özel başlık, not, konum veya konuk listesi olmayan deneme randevusu kullanın. Alıcıdan gördüklerini, yalnızca gerekli ve izinli olduğunda da değiştirebildiklerini doğrulamasını isteyin. Hesap parolanızı paylaşmayın.",
        "Takvimi ve rolü kaydedip ayar değişikliğinin sonucunu kontrol edin. Bu, daha önce okunmuş veya kopyalanmış bilgilerin silindiğini kanıtlamaz. Denemek için gerçek iş programını yayımlamayın."
      ]
    },
    {
      "heading": "İş kurallarıyla uygulama planını ayırın",
      "body": [
        "İş veya okul Google yöneticileri paylaşımı kısıtlayabilir. Gerekli ayar yoksa kuruluşun onayladığı yolu kullanın. Kısıtı aşmak için iş bilgilerini herkese açmayın.",
        "Cloud Calendars planları Google haklarını yeniden tanımlamaz. Advanced reklamları kaldırır; başka birine tüm olayları açan bir ödeme değildir. Yerel düzenleyicinin görünmesine değil, sağlayıcının kabul ettiği sonuca bakın."
      ]
    },
    {
      "heading": "Gereksiz erişim yollarını kaldırın",
      "body": [
        "Proje bitince kişileri, grupları ve genel yayını inceleyin. Başka yollar varsa bir kişiyi kaldırmak tek başına yetmez. Programı ve ilerideki izinleri kimin yöneteceğini kararlaştırın.",
        "Google kişi veya grup kaldırmayı ve genel paylaşımı kapatmayı ayrı açıklar. Bu, dışa aktarılmış dosyaları, ekran görüntülerini veya kopyaları geri getirmez. Onları ilgililerle ayrıca ele alın."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Takvimi ve alıcının görevini belirleyin.",
    "Kişi, grup, kuruluş ve genel erişimi inceleyin.",
    "Güncel Google ayarlarında göreve uygun izni seçin.",
    "Değişiklikten önce kimliği doğrulayın.",
    "Zararsız bir deneme etkinliğini alıcı tarafından kontrol edin.",
    "Eski erişimi kaldırırken önceki kopyaların silindiğini varsaymayın."
  ],
  "faq": [
    {
      "q": "Kişisel kısıtlama herkese açık takvime üstün gelir mi?",
      "a": "Hayır. Google, çelişkide daha geniş takvim izinlerinin öncelikli olduğunu belirtir. Kişi kaydı yanında genel ve kuruluş ayarlarını da inceleyin."
    },
    {
      "q": "Her düzenleme hakkı özel etkinlikleri aynı şekilde gösterir mi?",
      "a": "Hayır. Google özel etkinlik erişimini sınırlayan düzenlemeyi diğer düzenleme ve paylaşım yönetimi seçeneklerinden ayırır. Güncel iznin tam açıklamasını okuyun."
    },
    {
      "q": "Advanced almak Google haklarını değiştirir mi?",
      "a": "Hayır. Advanced Cloud Calendars reklamlarını kaldırır. Erişim, takvim izinleri ve kuruluş kısıtlarına bağlıdır."
    }
  ],
  "sourcesHeading": "Güncel Google paylaşım rehberleri",
  "sources": [
    {
      "label": "Google: takvim izinlerini seçme",
      "url": "https://support.google.com/calendar/answer/15716974?hl=en"
    },
    {
      "label": "Google: paylaşma ve erişimi kaldırma",
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
  "title": "Google gizli iCal adresi: abonelik ile paylaşımı ayırın",
  "short": "Gizli iCal adresi",
  "description": "Google gizli iCal adresini, hesap bağlantısını ve paylaşılan akışları ayırın. Açığa çıkan adresi, güncelleme gecikmelerini ve eski kopyaları anlayın.",
  "lede": "Takvim adresi, hesap bağlantısı ve davet farklı işler yapar. Programı başka bir uygulamaya taşımadan önce elinizde hangisinin olduğunu belirleyin. Bu rehber, Cloud Calendars geliştiricisi Arte Soft tarafından yayımlanmıştır.",
  "commonBelief": "Gizli takvim adresi, yalnızca bir alıcı için geri alınabilen kişisel bir davettir.",
  "sections": [
    {
      "heading": "İşe uygun bağlantıyı seçin",
      "body": [
        "Google, başka bir takvim uygulamasında oturum açmayı gizli iCal adresiyle görüntülemeden ayırır. Hesap bağlantısı düzenlemeyi destekleyebilir; adres ise yalnızca görüntüleme amaçlı abonelik sunar. Google, gizli adresi kişisel kullanım için tanımlar ve başkalarıyla paylaşılmamasını önerir.",
        "Örneğin kendi iş programınızı başka bir uyumlu takvimde görmek, bir iş arkadaşına sürekli erişim vermekten farklıdır. Önce amacı belirleyin: programınızı görüntülemek, belirli biriyle çalışmak veya bir kitleye takvim sunmak. Yalnızca yapıştırması kolay diye bir URL seçmeyin."
      ]
    },
    {
      "heading": "Yalnızca hesabı değil, takvimi de kontrol edin",
      "body": [
        "Google’ın bilgisayar yönergelerinde iCal biçimindeki gizli adres, seçilen takvimin entegrasyon ayarlarındadır. Önce takvim adını kontrol edin. İş veya okul yöneticileri bu seçeneği kısıtlayabilir; adresin olmaması, bunun yerine takvimi herkese açık yayımlamak için gerekçe değildir.",
        "Adresi ekran görüntülerine, herkese açık destek gönderilerine veya paylaşılan notlara koymayın. Yardım isterken URL’yi vermeden hesap türünü, takvim adını ve bağlantı yöntemini açıklayın. Destek görüşmesinde genellikle etkinlik içeriğinden önce bağlantı yolunun belirlenmesi gerekir."
      ]
    },
    {
      "heading": "Alıcı uygulamanın ne eklediğini kontrol edin",
      "body": [
        "Abonelik bir akışı takip eder; içe aktarılan dosya ayrı bir kopya oluşturur. Alıcı uygulamanın yönergelerini okuyup hangi işlemi yaptığınızı doğrulayın. Yalnızca indirilmiş bir takvim dosyasını açtıysanız oluşan randevuların sonraki değişiklikleri izleyeceğini varsaymayın.",
        "Takvim adını, tarihi ve görünen ayrıntıları karşılaştırmak için tanıdığınız, hassas bilgi içermeyen sıradan bir etkinlik kullanın. İlkini incelemek için ikinci abonelik oluşturmayın: iki görünür kopya, gecikmiş güncellemeyi çakışma gibi gösterebilir. Kaynağı belirlerken bir takvimi geçici olarak gizleyin."
      ]
    },
    {
      "heading": "Google ve Cloud Calendars bağlantılarını ayırın",
      "body": [
        "Cloud Calendars’ın abonelik akışları dahil kendi etkinlik ve takvim paylaşım yolları vardır. Bunlar Google gizli adresleri değildir. Nasıl açacağınıza karar vermeden önce gönderenin bir etkinlik, takvim veya hesaba bağlı davet paylaşıp paylaşmadığını belirleyin.",
        "Cloud Calendars alıcısının Reader, Writer veya Owner rolü olabilir. Tek başına akış adresi düzenleme hakkının kanıtı sayılmamalıdır. Benzer şekilde bir Google görüntüleme adresi almak da sizi takvimin sahibi yapmaz. Değişiklikler için hangi sistemin kullanılacağını gönderene sorun."
      ]
    },
    {
      "heading": "Alıcı takvimin yenileme davranışını hesaba katın",
      "body": [
        "Abonelik anında teslim sözü vermez. Cloud Calendars akışlarında önerilen yenileme aralığı bulunur; ancak güncellemeleri ne zaman alıp göstereceğine alıcı uygulama karar verir. Bir cihazdaki eski saat, düzenleyicinin değişikliği kaydetmediğini tek başına kanıtlamaz.",
        "Aynı günkü toplantı için düzenleyicinin güncel programıyla karşılaştırın ve önemli değişiklikleri doğrudan doğrulayın. Hangi takvimin eski bilgiyi gösterdiğini ve ne zaman kontrol ettiğinizi kaydedin. Akışı güncellemeye zorlamak için etkinliği tekrar tekrar içe aktarmayın veya kaynak takvimi silmeyin."
      ]
    },
    {
      "heading": "Açığa çıkan adresi tüm kopyaları geri alma sözü vermeden yönetin",
      "body": [
        "Google, açığa çıkan gizli adresin sıfırlanmasını açıklar: eski adres geçersiz olur ve yenisi oluşturulur. Sonradan aboneliklerini güncellemek için adresi kullanan kendi uygulamalarınızı belirleyin. Adresi sıfırlamak, belirli bir çalışma arkadaşını kaldırmaktan farklıdır.",
        "Önceden kaydedilmiş randevular, dışa aktarımlar ve ekran görüntüleri ayrı bir konudur. Değişen bağlantı, eski kopyaların tümünün kaybolduğunu kanıtlamaz. Bilgiyi yanlış kişilere dağıttıysanız başarılı sıfırlamayı tam silinme kanıtı saymak yerine gerçek içeriği ve alıcıları değerlendirin."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Hesap bağlantısı, davet, abonelik veya dosyadan hangisine sahip olduğunuzu belirleyin.",
    "Adresi kopyalamadan önce kaynak takvimi kontrol edin.",
    "Google gizli adresini kendi uyumlu uygulamalarınız için saklayın.",
    "Alıcı uygulamanın içe aktarma yerine abone olduğunu doğrulayın.",
    "Acil değişiklikleri yenileme zamanına güvenmek yerine düzenleyiciyle doğrulayın.",
    "Adres açığa çıktıysa Google’ın sıfırlama yönergelerini izleyip gerekli bağlantıları güncelleyin."
  ],
  "faq": [
    {
      "q": "Gizli adresi iş arkadaşıma verebilir miyim?",
      "a": "Google adresi kendi uygulamalarınız için tutmanızı önerir. Başka birinin erişimi gerekiyorsa takvimin paylaşım kontrollerini kullanıp uygun izni seçin."
    },
    {
      "q": "Abonelik özgün takvimi düzenlememi sağlar mı?",
      "a": "Google gizli iCal adresi görüntüleme içindir. Düzenleme uygun hesap bağlantısı ve izin gerektirir; Cloud Calendars paylaşım rolleri ayrı bir düzenlemedir."
    },
    {
      "q": "Adresi sıfırlamak eski randevuları her yerden siler mi?",
      "a": "Eski Google adresini geçersiz kılar. Bağımsız kaydedilmiş dosya, randevu veya ekran görüntülerinin silindiğini göstermez."
    }
  ],
  "sourcesHeading": "Sağlayıcı yönergeleri ve ek kaynaklar",
  "sources": [
    {
      "label": "Google: hesap bağlantıları ve gizli iCal adresleri",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    },
    {
      "label": "Google: takvim paylaşma",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: içe aktarma, abonelik ve güncelleme zamanı",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "updated": "2026-10-21",
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "taking-back-a-calendar-you-shared",
    "sharing-one-event-not-your-calendar"
  ]
},

  'what-guests-can-do-to-your-event': {
  "title": "Google Takvim misafir izinleri: düzenleme, davetler ve misafir listesi",
  "short": "Etkinlikte misafir izinleri",
  "description": "Google misafir izinlerini ve varsayılanları kontrol edin. Davet haklarını takvim erişiminden ve Cloud Calendars rollerinden ayırın.",
  "lede": "Bir misafirin yanıt verebilmesi, yapabileceklerinin tamamını açıklamaz. Ekip, müşteriler veya açık bir buluşma için tek davet kullanmadan önce izinleri inceleyin. Bu rehber Cloud Calendars geliştiricisi Arte Soft tarafından yayımlanmıştır.",
  "commonBelief": "Misafirler yalnızca kabul veya ret yanıtı verebilir ve her uygulama aynı izin kontrollerini sunar.",
  "sections": [
    {
      "heading": "Düzenleyici ve özgün etkinlikle başlayın",
      "body": [
        "Google Takvim’de ilgili etkinliği düzenleyen hesapla veya yönetim yetkisi olan hesapla açın. İzinleri değiştirmeden önce takvimi, tarihi ve düzenleyiciyi kontrol edin. Ayrı içe aktarılmış randevu, özgün daveti yönetmek için güvenilir bir yer değildir.",
        "Ekip toplantısında kimin zamanı değiştirebileceğini, başkalarını davet edebileceğini ve katılımcıları görebileceğini belirleyin. Bunlar ayrı kararlardır. Katılması gereken bir misafirin toplantıyı yönetmesi şart değildir."
      ]
    },
    {
      "heading": "Misafirlerin toplantıyı değiştirip değiştiremeyeceğine karar verin",
      "body": [
        "Google, bilgisayardaki etkinlik düzenleyicisinde misafir izinleri altında etkinliği değiştirme seçeneğini açıklar. Bu yalnızca yeni saat önerme yolu değil, geniş bir iş birliği iznidir. Google’a göre alanları düzenleme, misafirleri görme ve oda ayırtma dahil etkinlik yönetimini sağlar.",
        "Örneğin atölye hazırlayan güvenilir bir ortak düzenleyici bu esnekliğe ihtiyaç duyabilir. Randevuya gelen müşteri duymayabilir. Verdiğiniz sorumluluğa göre seçin ve başka toplantının ayarına güvenmek yerine kaydedilmiş etkinliği kontrol edin."
      ]
    },
    {
      "heading": "Davet ve misafir görünürlüğünü ayrı inceleyin",
      "body": [
        "Google’ın etkinlik modeli, başkalarını davet etme izniyle diğer misafirleri görme iznini ayırır. İkisini de düzenleme hakkıyla birlikte inceleyin. Birini kapatmak diğerini kontrol ettiğiniz anlamına gelmez; görünen varsayılan da mevcut etkinliğin ayarlarını kanıtlamaz.",
        "Birbirini tanımayan müşteriler için ortak davetin uygun olup olmadığını düşünün. E-posta, açıklama veya iletilen mesajda zaten bulunan bilgi, mevcut misafir listesi kontrolünün kapsamı dışındadır. Gizli katılımcı bilgilerini açıklamaya yazıp listeyi gizlemenin bunları saklayacağını beklemeyin."
      ]
    },
    {
      "heading": "Varsayılanları ve önemli etkinlikleri kontrol edin",
      "body": [
        "Google ayrıca etkinlik ayarlarında değişiklik izni dahil varsayılan misafir izinlerini açıklar. Dolayısıyla kontroller yalnızca tek tek etkinliklerde değildir. Alışılmış planlama biçiminiz değiştiğinde varsayılanları gözden geçirin, ardından önemli mevcut davetleri ayrı kontrol edin.",
        "Yinelenen toplantıda kaydetmeden önce hangi örneği veya seriyi düzenlediğinizi doğrulayın. Bir tercihi değiştirmek eski davetleri yeniden yazmış sayılmaz. Bir meslektaşınızla test ederken gerçek müşteri toplantısını taşımak veya iptal etmek yerine üzerinde anlaşılan, hassas olmayan bir örnek kullanın."
      ]
    },
    {
      "heading": "Cloud Calendars rollerini ayrı tutun",
      "body": [
        "Cloud Calendars’ın Reader, Writer ve Owner rollerinden oluşan ayrı paylaşım sistemi vardır. Reader görüntüleme ve eşitleme; Writer düzenleme sağlar. Owner ayrıca davet edilen kimlikle paylaşımı ve erişimi yönetir. Bu roller Google’ın üç misafir izninin anahtarları değildir.",
        "Google’a özgü bir izin önemliyse özgün etkinliği Google Takvim’de inceleyin. Cloud Calendars’ta katılımcı görmek, Google’ın bütün misafir ayarlarının orada değiştirilebildiğini göstermez. Eksik kontrol veya başarısız düzenlemeyi incelerken sahip hizmeti ve alıcının kimliğini netleştirin."
      ]
    },
    {
      "heading": "Kaydedilen sonucu ve sorumlulukları doğrulayın",
      "body": [
        "Kaydettikten sonra özgün etkinliği yeniden açıp istenen ayarları kontrol edin. Uygunsa yetkili bir meslektaşınızdan kendi hesabının yapabildiklerini doğrulamasını isteyin. Erişim kontrolünü kolaylaştırmak için şifre veya özel misafir bilgileri paylaşmayın.",
        "Katılımı izinlerden ayırın. Düzenleme hakkı, içe aktarılmış kopya ve kaydedilmiş kabul yanıtı farklı olgulardır. Cloud Calendars’ta paylaşımın alındığı kaydı RSVP değildir. Önemli toplantılarda gereken katılım yanıtını isteyin ve program değişikliklerinden kimin sorumlu olduğunu açıklayın."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Düzenleyen hesabı ve özgün etkinliği belirleyin.",
    "Toplantıyı kimin yöneteceğini, davet göndereceğini ve misafirleri göreceğini kararlaştırın.",
    "Google etkinliğinin gerçek misafir izinlerini inceleyin.",
    "Varsayılanların mevcut etkinlikleri değiştirdiğini varsaymadan kontrol edin.",
    "Cloud Calendars rollerini ayrı izin sistemi olarak ele alın.",
    "Kaydedilen etkinliği yeniden açın ve katılımı ayrıca doğrulayın."
  ],
  "faq": [
    {
      "q": "Misafir toplantı saatimi değiştirebilir mi?",
      "a": "Google değişiklik izni vermeyi destekler. Etkinliği ve misafirin erişimini kontrol edin; yalnızca davet almış olmasından sonuç çıkarmayın."
    },
    {
      "q": "Tüm misafir izinleri yalnızca etkinlik üzerinde mi ayarlanır?",
      "a": "Hayır. Google varsayılan izinleri de açıklar. Gelecek planlar için bunları, önemli mevcut etkinlikler için etkinliğin kendisini kontrol edin."
    },
    {
      "q": "Misafir listesini gizlemek gönderilmiş bilgiyi kaldırır mı?",
      "a": "Eski e-posta, açıklama, ekran görüntüsü veya bağımsız kopyaların kaldırıldığını göstermez. Gerçekte dağıtılan içeriği ayrıca inceleyin."
    }
  ],
  "sourcesHeading": "Sağlayıcı yönergeleri ve ek kaynaklar",
  "sources": [
    {
      "label": "Google: etkinlik iş birliği ve varsayılan misafir izinleri",
      "url": "https://support.google.com/a/users/answer/13293412?hl=en"
    },
    {
      "label": "Google: etkinlik misafir izni alanları",
      "url": "https://developers.google.com/workspace/calendar/api/v3/reference/events"
    }
  ],
  "updated": "2026-10-21",
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "sharing-one-event-not-your-calendar"
  ]
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
  "title": "Takvim paylaşımını durdurun ve kalan erişim yollarını kontrol edin",
  "short": "Paylaşılan erişimi inceleme ve kaldırma",
  "description": "Kişi, grup, herkese açık erişim ve abonelik bağlantılarını ayırarak paylaşımı durdurun. Değişikliği ve eski kopyaların neden kalabileceğini kontrol edin.",
  "lede": "Bir iş birliğini bitirirken önce erişimin nasıl verildiğini belirleyin. Bir kişiyi kaldırmak, yayını kapatmak ve abonelik adresini sıfırlamak farklı işlemlerdir. Bu rehber, Cloud Calendars geliştiricisi Arte Soft tarafından yayımlanmıştır.",
  "commonBelief": "Bir alıcıyı kaldırmak tüm takvim kopyalarını anında geri çeker ve diğer bütün erişim yollarını kapatır.",
  "sections": [
    {
      "heading": "Takvimi ve paylaşım yolunu belirleyin",
      "body": [
        "Erişimi değiştirmeden önce sahip hesabı, takvimi ve hedef kitleyi doğrulayın. Belirli bir iş arkadaşıyla paylaşılan Google takvimi; herkese açık takvimden, grup izninden veya abonelik adresinden farklıdır. Cloud Calendars’ın da kendi etkinlik ve takvim paylaşım ilişkileri vardır.",
        "Örneğin bir kulübün sekreteri kişisel davetle düzenleme izni alırken üyeler yayımlanan programı takip edebilir. Sekreterin bireysel iznini kaldırmak, üyelerin aboneliklerine ne yapılacağını belirlemez. Gerçekte oluşturduğunuz paylaşım düzenlerini listeleyin."
      ]
    },
    {
      "heading": "Google’daki ilgili izni kaldırın",
      "body": [
        "Google, belirli kişiler veya gruplar, kuruluş genelinde paylaşım ve herkese açık erişim için ayrı kontroller açıklar. Bilgisayarda ilgili takvimin paylaşım ayarlarını açıp uygun kaydı veya genel ayarı değiştirin. Önce oturum açılan hesabı ve takvim adını kontrol edin.",
        "Bir kişi grup üyeliği veya daha geniş yayın yoluyla erişmeye devam edebilir. Aynı e-posta adresini tekrar tekrar kaldırmak yerine bütün erişim düzenini inceleyin. İş veya okul kuralları seçenekleri kısıtlayabilir; gerekirse sahibin ya da yöneticinin onayladığı süreci izleyin."
      ]
    },
    {
      "heading": "Gizli takvim adresini ayrı ele alın",
      "body": [
        "Google, gizli iCal adresinin başka bir takvim uygulamasında kişisel kullanım için olduğunu ve başkalarıyla paylaşılmaması gerektiğini belirtir. Adres ifşa edildiyse Google, eski adresi geçersiz kılacak sıfırlamayı açıklar. Bu, belirli bir kişiyi kaldırmaktan farklı bir işlemdir.",
        "Kullandığınız abonelik adresini değiştirmeden önce ona bağlı uygulama ve araçları belirleyin; böylece istediklerinizi sonradan yeniden bağlayabilirsiniz. Gizli URL’yi herkese açık destek mesajına yapıştırmayın veya doğru takvimi bulduğunuzun kanıtı olarak göndermeyin. Bunun yerine takvim adını ve bağlantı türünü belirtin."
      ]
    },
    {
      "heading": "Cloud Calendars alıcılarını abonelik bağlantılarından ayırın",
      "body": [
        "Cloud Calendars’ta bir etkinlik veya takvimin alıcı erişimi ile oluşturulmuş abonelik akışı farklı mekanizmalardır. İşlem seçmeden önce gerçek paylaşım ilişkisini ve ilgili bağlantıyı inceleyin. Tanımlanmış bir alıcıyı kaldırmak, önceden dağıtılmış tüm URL’lerin ya da bağımsız kopyaların geri çekildiğini garanti etmez.",
        "Bir ortak düzenleyicinin yalnızca düzenlemeyi bırakması gerekiyorsa paylaşılan programı silmek yerine rolünü ve erişimi sürecek kişileri değerlendirin. İş birliği tamamen bitiyorsa takvimin sahibini ve kimde kalması gerektiğini belirleyin. Size verilen takvimden ayrılmakla kendi takviminizi silmek farklı kararlardır."
      ]
    },
    {
      "heading": "Anında kaybolma sözü vermeden sonucu doğrulayın",
      "body": [
        "İstenen değişikliğin takvimin sahibi olan sistemde kaydedildiğini kontrol edin. Yetkili bir iş arkadaşı yardım edebiliyorsa şifre paylaşmadan kendi hesabından görüntüleme veya düzenleme sonucunu doğrulayın. Erişimin reddedilmesini, önbellekteki veya içe aktarılmış kopyada hâlâ görünen eski etkinlikten ayırın.",
        "Her yerde geçerli bir yenileme süresi veya bildirim gönderilmeyeceği sözü vermeyin. Bir gruba devir yaparken bundan sonra hangi programın kullanılacağını bildirin. Eski bir kaydın görünmesi tek başına canlı erişimin, başka bir iznin veya bağımsız bir kopyanın bulunduğunu ayırt etmez."
      ]
    },
    {
      "heading": "Önceden alınmış kopyaları ayrıca ele alın",
      "body": [
        "Dışa aktarılmış dosyalar, ekran görüntüleri, mesajlar ve ayrı kaydedilmiş randevular erişim değiştikten sonra kalabilir. Devir için hangi kopyaların önemli olduğunu belirleyip ilgili kişilerle nasıl ele alınacağını konuşun. Takvim iznini değiştirmek, her alıcının önceden neler kaydettiğini göstermez.",
        "Sonucu incelerken gerekli kaynak kayıtlarını koruyun. Sırf eski takvim boş görünsün diye hassas toplantıları başka bir paylaşılan takvime taşımayın veya erişim testi için gerçek davetleri iptal etmeyin. Sonraki sorun incelemelerine başlangıç olması için takvimi, erişim yolunu ve yaptığınız değişikliği kaydedin."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Sahip hesabı, takvimi ve paylaşım yolunu belirleyin.",
    "Kişileri, grupları ve daha geniş yayını ayrı ayrı inceleyin.",
    "Google veya Cloud Calendars’ın uygun paylaşım kontrollerini kullanın.",
    "İfşa edilmiş gizli adresi sıfırlamayı ayrı bir karar olarak ele alın.",
    "Kimlik bilgilerini paylaşmadan kaydedilen erişim sonucunu doğrulayın.",
    "Eski dışa aktarımları ve kopyaları canlı erişimden ayrı planlayın."
  ],
  "faq": [
    {
      "q": "Bir kişiyi kaldırmak herkese açık takvimi veya grup erişimini kapatır mı?",
      "a": "Bunu varsaymayın. Gerçek erişim yollarının her birini inceleyin. Google; kişiler, gruplar ve daha geniş yayın için ayrı ayarlar açıklar."
    },
    {
      "q": "Takvim hemen ve bildirim olmadan kaybolur mu?",
      "a": "Kaybolma, bildirim veya yenileme süresi için genel bir garanti yoktur. Kaydedilen erişim değişikliğini doğrulayın; canlı erişimi önbellekteki veya içe aktarılmış bilgiden ayırın."
    },
    {
      "q": "Google takvim erişimini kaldırabilmek için Advanced gerekir mi?",
      "a": "Advanced, Cloud Calendars’taki reklamları kaldırır. Google paylaşım kontrolleri bu uygulama planına değil, sahipliğe, izinlere ve kuruluş kurallarına bağlıdır."
    }
  ],
  "sourcesHeading": "Erişim ve abonelik rehberleri",
  "sources": [
    {
      "label": "Google: paylaşım kontrolleri ve erişimi durdurma",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Google: hesap eşitleme ve gizli iCal adresleri",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    }
  ],
  "updated": "2026-10-21",
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "the-secret-address-of-a-google-calendar"
  ]
},
};
