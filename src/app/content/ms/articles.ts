import { LocalisedArticle } from '../types';

/**
 * The four articles this language carries.
 *
 * Chosen one per intent -- weather, one view, sharing, price -- so the language
 * answers a whole question rather than a quarter of four. The numbers are not
 * here: they live once in article-facts.ts and join the prose by id, so a
 * translation can rewrite every sentence without touching a figure.
 */
export const ARTICLES_MS: Readonly<Record<string, LocalisedArticle>> = {
  "month-view-on-a-bigger-screen": {
  "updated": "2026-10-22",
  "title": "Kalendar bulanan pada iPad dan iPhone: lihat tarikh, kemudian semak butiran",
  "short": "Gunakan paparan bulan tanpa terlepas butiran",
  "description": "Bandingkan tarikh pada iPad atau iPhone. Semak acara tersembunyi, kalendar dipilih dan waktu sebelum memindahkan janji temu bersama atau berulang.",
  "lede": "Paparan bulan menunjukkan tarikh komitmen sepanjang bulan. Ia kurang sesuai untuk membuktikan sesuatu waktu lapang. Pilih tarikh melalui gambaran keseluruhan, kemudian semak hari dan acara sebelum bersetuju. Panduan ini diterbitkan oleh Arte Soft, pembangun Cloud Calendars.",
  "commonBelief": "Grid bulan yang lebih besar memaparkan setiap butiran, dan tarikh yang kelihatan kosong membuktikan semua orang lapang.",
  "sections": [
    {
      "heading": "Tentukan sama ada anda memerlukan tarikh atau waktu tepat",
      "body": [
        "Gunakan bulan untuk membandingkan tarikh akhir projek, perjalanan dan janji temu keluarga merentasi beberapa minggu. Jika persoalannya ialah pertindihan dua janji temu pada 14:30, beralih kepada paparan hari atau minggu dan semak waktu mula serta tamat. Petak bulan tidak mempunyai skala masa yang sama dengan grid mengikut jam.",
        "Contohnya, penganjur bengkel boleh mengelakkan minggu perjalanan terlebih dahulu. Seterusnya semak hari yang dicadangkan: komitmen, persediaan, perjalanan dan waktu perlu tamat. Petak yang kelihatan kosong ialah pilihan untuk diperiksa, bukan tempahan disahkan atau kenyataan bahawa orang lain lapang."
      ]
    },
    {
      "heading": "Baca bilangan tambahan, bukan hanya tajuk yang kelihatan",
      "body": [
        "Petak bulan Cloud Calendars kini memaparkan bilangan label acara yang terhad serta bilangan tambahan jika terdapat acara lain pada tarikh itu. Tajuk dihadkan kepada satu baris dan mungkin dipendekkan. Buka hari atau acara apabila tajuk penuh atau komitmen lain penting.",
        "Skrin iPad yang lebih besar boleh memudahkan pembacaan, tetapi ruang fizikal tambahan tidak semestinya menghapuskan semua had paparan. Tetingkap aplikasi sempit atau teks besar boleh mengubah apa yang muat. Buat semakan sama pada iPhone: buka hari sebelum menganggap label yang kelihatan sebagai seluruh jadual."
      ]
    },
    {
      "heading": "Semak bulan, kalendar dipilih dan tarikh bersebelahan",
      "body": [
        "Baca bulan dan tahun yang dipaparkan sebelum memilih tarikh. Grid boleh menyertakan tarikh bulan bersebelahan untuk melengkapkan baris. Dalam Cloud Calendars, gunakan navigasi bulan dan periksa tarikh dipilih, bukan bergantung pada kedudukan petak sahaja.",
        "Semak kalendar yang dipilih. Menyembunyikan acara kerja boleh memudahkan pembacaan rancangan keluarga, tetapi turut mengeluarkan komitmen itu daripada gambaran tersebut. Untuk menyiasat pendua, sembunyikan satu sumber sementara dan bandingkan; jangan padam janji temu semata-mata untuk mengurangkan kesesakan bulan."
      ]
    },
    {
      "heading": "Buka acara sebelum mengubah persetujuan bersama",
      "body": [
        "Sahkan tajuk, pemilik atau kalendar, waktu tempatan dan tempoh dalam butiran acara. Warna membantu imbasan, tetapi tidak menggantikan pengetahuan tentang akaun atau kebenaran menyunting. Jemputan yang kelihatan berbeza daripada janji temu yang anda anjurkan sendiri.",
        "Cloud Calendars menyediakan seret dan lepas dalam bulan untuk memindahkan acara ke tarikh lain. Sebelum menggunakannya pada komitmen sebenar, pastikan tarikh tujuan dan skop ulangan. Selepas perubahan yang dibenarkan, buka semula acara dan semak hasilnya; gerakan setempat bukan bukti penyedia atau setiap peserta menerima aturan baharu."
      ]
    },
    {
      "heading": "Semak acara berulang dan zon waktu secara berasingan",
      "body": [
        "Jika hanya kelas minggu ini berpindah, jangan tersilap mengubah corak masa hadapan. Baca pilihan skop ulangan yang tersedia, kemudian semak kejadian yang diubah dan satu kejadian kemudian. Paparan bulan memudahkan perbandingan tarikh berulang, tetapi skop suntingan menentukan kesan perubahan.",
        "Untuk perjalanan atau mesyuarat merentasi zon waktu, semak tarikh dan waktu tempatan acara dengan jelas. Memindahkan acara ke hari lain bukan penukaran automatik waktu mesyuarat yang dimaksudkan. Semak peralihan waktu musim panas jika berkaitan dan sahkan waktu yang dipersetujui dengan pihak terlibat."
      ]
    },
    {
      "heading": "Gunakan paparan lebih besar tanpa mengelirukannya dengan produk lain",
      "body": [
        "Apple Calendar menawarkan pilihan bulan sendiri, manakala Teamup menerangkan set paparan berbeza bagi pelayar dan aplikasi mudah alih. Kawalan itu milik produk masing-masing. Jangan cari konfigurasi pelayar Teamup atau menu paparan Apple Calendar dalam Cloud Calendars hanya kerana namanya sama.",
        "Sebulan janji temu juga bukan sebulan ramalan cuaca. Untuk rancangan luar, semak tempat, tarikh dan jam ramalan yang tersedia secara berasingan. Simpan janji temu akhir dalam kalendar yang dimaksudkan dan sahkan perubahan terus dengan peserta."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Gunakan bulan untuk menyenarai pendek tarikh, kemudian semak waktu tepat dalam paparan hari atau minggu.",
    "Buka hari dengan bilangan tambahan atau tajuk dipendekkan.",
    "Semak bulan, tahun dan kalendar dipilih sebelum menganggap tarikh lapang.",
    "Sahkan kalendar, waktu, tempoh dan kebenaran menyunting acara.",
    "Baca skop ulangan dan semak kejadian yang disimpan selepas pemindahan.",
    "Semak ketersediaan cuaca secara berasingan dan sahkan perubahan dengan peserta."
  ],
  "faq": [
    {
      "q": "Adakah paparan bulan iPad menunjukkan setiap janji temu sepenuhnya?",
      "a": "Jangan anggap begitu. Cloud Calendars mengehadkan label acara dalam petak bulan dan menunjukkan bilangan tambahan. Buka hari dan acara untuk menyemak seluruh jadual."
    },
    {
      "q": "Adakah hari kosong bermakna saya lapang?",
      "a": "Semak dahulu kalendar dipilih, tarikh dan kewujudan data akaun berkaitan. Gambaran keseluruhan hanya mewakili maklumat yang kini tersedia dan dipaparkan."
    },
    {
      "q": "Adakah memindahkan acara berulang hanya mengubah tarikh itu?",
      "a": "Baca pilihan skop suntingan dan jangan membuat andaian. Selepas menyimpan, semak kejadian yang diubah dan satu kejadian kemudian, lalu sahkan aturan yang dimaksudkan."
    }
  ],
  "sourcesHeading": "Bandingkan penerangan paparan rasmi",
  "sources": [
    {
      "label": "Apple: paparan bulan, berbilang hari dan senarai dalam Apple Calendar",
      "url": "https://support.apple.com/en-ca/guide/iphone/iphfd1054569/ios"
    },
    {
      "label": "Teamup: paparan kalendar serta konfigurasi pelayar berbanding aplikasi",
      "url": "https://calendar.teamup.com/kb/how-to-use-calendar-views/"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "weather-inside-your-calendar",
    "sharing-one-event-not-your-calendar"
  ]
},

  'weather-inside-your-calendar': {
  "updated": "2026-10-22",
  "title": "Kalendar dengan cuaca pada iPhone dan iPad: semak konteks rancangan",
  "short": "Gunakan kalendar dan cuaca bersama",
  "description": "Gunakan kalendar dan cuaca pada iPhone dan iPad. Semak tempat, jam ramalan tersedia dan butiran acara sebelum menyimpan rancangan.",
  "lede": "Kalendar memberitahu bila sesuatu komitmen dijadualkan. Cuaca membantu menjawab soalan lain: apakah keadaan yang diramalkan untuk tempat dan tempoh yang diperlukan? Gunakan kedua-duanya sambil memastikan lokasi dan tarikh jelas. Panduan ini diterbitkan oleh Arte Soft, pembangun Cloud Calendars.",
  "commonBelief": "Cuaca di sebelah kalendar secara automatik menerangkan alamat setiap janji temu, setiap jam dan semua tarikh akan datang.",
  "sections": [
    {
      "heading": "Pilih persoalan perancangan sebenar",
      "body": [
        "Mulakan dengan janji temu tertentu, seperti kunjungan petang ke taman. Kenal pasti perkara yang boleh berubah: waktu, tempat, persediaan atau keputusan memilih alternatif. Anda tidak perlu menyusun semula seluruh kalendar hanya kerana simbol harian menunjukkan hujan.",
        "Catat waktu mula dan tamat sebenar aktiviti, termasuk persediaan jika berkaitan. Gambaran kalendar membantu mencari tarikh yang sesuai, manakala semakan ramalan melibatkan tempat dan tempoh tertentu. Bezakan kedua-dua tugas semasa membandingkan pilihan."
      ]
    },
    {
      "heading": "Sahkan tempat cuaca sebelum membaca nilai",
      "body": [
        "Cloud Calendars menawarkan cuaca untuk tempat semasa atau dipilih. Semak lokasi yang dipaparkan, bukan menganggap alamat acara mengubah ramalan secara senyap. Janji temu di bandar lain perlu dibandingkan dengan cuaca bandar itu.",
        "Contohnya, pelawat mungkin merancang ketibaan di muzium ketika telefon masih di rumah. Baca lokasi ramalan dan waktu tempatan janji temu sebelum membandingkannya. Nilai yang kelihatan berdekatan bukan bukti jadual dan cuaca menggunakan tempat yang sama."
      ]
    },
    {
      "heading": "Semak liputan setiap jam dan harian secara berasingan",
      "body": [
        "Gunakan entri harian sebagai gambaran awal dan entri setiap jam yang tersedia untuk persoalan tentang sebahagian hari. Janji temu dari pukul dua hingga lima memerlukan lebih daripada melihat satu simbol. Semak sama ada jam yang berkaitan benar-benar tersedia.",
        "Dalam kod aplikasi semasa, senarai harian mengambil sehingga sepuluh hari yang dipulangkan oleh WeatherKit. Ini berasingan daripada navigasi kalendar dan jam yang kini dibekalkan. Janji temu masa hadapan tidak memanjangkan liputan cuaca. Jika tempohnya tiada, rancang semakan cuaca kemudian."
      ]
    },
    {
      "heading": "Fahami maksud nilai cuaca",
      "body": [
        "Apple menerangkan data WeatherKit seperti suhu, kerpasan, angin dan UV, dengan sesetengah produk hanya tersedia di rantau tertentu. Baca nilai yang tersedia untuk tempat pilihan, bukan menjangkakan setiap produk cuaca di semua tempat.",
        "Panduan Met Office menunjukkan sebab tempoh ramalan dan takrif pemboleh ubah penting: sesetengah nilai merujuk satu ketika, yang lain merujuk suatu tempoh. Gunakan label penyedia berkaitan. Kebarangkalian, jumlah dan tempoh hujan ialah soalan berbeza; satu nombor tidak menentukan semua aktiviti luar."
      ]
    },
    {
      "heading": "Semak draf yang dicipta daripada jam cuaca",
      "body": [
        "Apabila aplikasi menawarkan penciptaan acara daripada sesuatu jam, ia membuka draf. Kod semasa menggunakan zon waktu lokasi cuaca, mencadangkan tempoh satu jam dan memilih kalendar lalai acara baharu. Periksa setiap nilai sebelum menyimpan.",
        "Sahkan tajuk, kalendar destinasi, mula, tamat dan lokasi yang dimaksudkan. Memilih ramalan tidak memberikan kebenaran menyunting kalendar dikongsi, memaklumkan tempat acara atau menempah bilik. Semak acara yang disimpan dan dapatkan persetujuan yang diperlukan."
      ]
    },
    {
      "heading": "Bezakan demonstrasi laman web",
      "body": [
        "Demonstrasi cuaca interaktif laman web menggunakan Open-Meteo. Aplikasi menggunakan Apple WeatherKit. Demo web membantu meneroka paparan, tetapi tempat, data dan tarikh tersedia mungkin berbeza daripada aplikasi.",
        "Untuk keputusan sebenar, buka aplikasi dan bandingkan janji temu yang dimaksudkan dengan ramalan tersedia. Jika mengubah rancangan bersama, sahkan penganjur, skop ulangan dan peserta. Sediakan alternatif yang dipersetujui apabila aktiviti bergantung pada keadaan."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Kenal pasti janji temu dan keputusan yang boleh dipengaruhi cuaca.",
    "Sahkan lokasi cuaca serta tarikh dan waktu tempatan janji temu.",
    "Periksa liputan setiap jam yang tersedia secara berasingan daripada ringkasan harian.",
    "Baca kebarangkalian, jumlah dan nilai berkaitan mengikut labelnya.",
    "Semak semua butiran draf acara dan kalendar destinasi sebelum menyimpan.",
    "Semak semula pada waktu keputusan dan sahkan perubahan bersama secara langsung."
  ],
  "faq": [
    {
      "q": "Adakah cuaca di sebelah kalendar mengikut alamat setiap acara?",
      "a": "Jangan anggap begitu. Sahkan lokasi cuaca yang dipaparkan dan bandingkan dengan tempat acara; kedudukan berdekatan pada skrin tidak membuktikan padanan."
    },
    {
      "q": "Adakah aplikasi menggunakan penyedia cuaca laman web?",
      "a": "Tidak. Aplikasi menggunakan Apple WeatherKit; demonstrasi laman web menggunakan Open-Meteo secara berasingan."
    },
    {
      "q": "Adakah memilih jam ramalan menyimpan janji temu secara automatik?",
      "a": "Ia memulakan draf apabila tindakan itu ditawarkan. Semak tarikh, zon waktu, tempoh, kalendar dan lokasi, kemudian simpan acara yang dimaksudkan."
    }
  ],
  "seeAlso": [
    "month-view-on-a-bigger-screen",
    "icloud-google-and-outlook-in-one-view",
    "sharing-one-event-not-your-calendar"
  ],
  "sourcesHeading": "Sumber rasmi dan bacaan lanjut",
  "sources": [
    {
      "label": "Apple: maklumat ramalan WeatherKit dan ketersediaan serantau",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: tempat, tempoh dan nilai ramalan cuaca",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google dan Outlook dalam satu paparan',
    short: 'Tiga akaun, satu paparan',
    description: "Lihat bagaimana kalendar Apple, Google dan kerja dalam satu paparan membantu anda membandingkan komitmen dan mengenal pasti pertindihan jadual.",
    lede: 'Masalahnya hampir tidak pernah salah satu kalendar itu buruk. Masalahnya anda ada tiga dan minggu hanya satu.',
    commonBelief: 'Bahawa mengasingkan kerja dan kehidupan peribadi ke aplikasi berlainan ialah sempadan, bukan kekurangan.',
    sections: [
      {
        heading: 'Pertindihan jadual bersifat struktur',
        body: [
          'Jika komitmen anda hidup di tiga tempat, tiada satu tempat pun boleh memberitahu sama ada anda lapang. Langkah penggabungannya ialah anda, dan anda menjalankannya dari ingatan, biasanya sementara seseorang menunggu jawapan.',
          'Sebab itu kegagalan klasiknya bukan terlupa sesuatu acara; sebaliknya bersetuju dengan sesuatu yang bertembung dengan acara yang tidak dapat anda lihat.',
        ],
      },
      {
        heading: 'Apa yang diberikan satu grid',
        body: [
          'Semua akaun dalam minggu yang sama, diwarnakan mengikut asalnya, boleh disunting di situ juga. Anda berhenti tertanya-tanya aplikasi mana yang memegang jawapannya, kerana soalannya berhenti berbentuk jamak.',
          'iCloud dan Google menyegerak dalam versi percuma. Akaun Microsoft — Outlook dan Exchange — termasuk dalam versi berbayar, kerana sambungan itu mempunyai kos berulang yang tiada pada yang lain.',
        ],
      },
    ],
    claims: {
      accounts: 'Jenis akaun yang muat dalam satu paparan',
      premiumMonthly: 'Kos bulanan menambah Microsoft, dalam dolar',
    },
    practical: [
      'Tambah akaun peribadi dahulu, kemudian yang menyebabkan pertembungan.',
      'Warnakan mengikut akaun, bukan mengikut kategori: asalnya itulah yang perlu dilihat sepintas lalu.',
      'Teruslah menulis dalam kalendar yang sudah dibaca orang lain.',
    ],
    seeAlso: ['weather-inside-your-calendar', 'what-a-subscription-actually-buys'],
  },

  'sharing-one-event-not-your-calendar': {
  "updated": "2026-10-21",
  "title": "Kongsi satu acara: pilih pautan dan akses yang sesuai",
  "short": "Berkongsi satu acara",
  "description": "Kongsi satu acara tanpa seluruh kalendar. Fahami Reader, Writer dan Owner, pratonton, kemas kini serta batas penarikan balik akses.",
  "lede": "Menghantar butiran makan malam, membenarkan penganjur bersama menyunting dan mengumpul jawapan kehadiran ialah tugas berbeza. Pilih tujuan dahulu, kemudian cara berkongsi. Panduan ini ditulis oleh Arte Soft, pembangun Cloud Calendars.",
  "commonBelief": "Setiap pautan acara ialah langganan baca sahaja yang terus dikemas kini dan merekodkan jawapan.",
  "sections": [
    {
      "heading": "Semak butiran acara dahulu",
      "body": [
        "Perkongsian satu acara terhad kepada acara itu, bukan seluruh kalendar pengirim. Semak tajuk, zon waktu, lokasi, nota dan pautan mesyuarat. Maklumat untuk seorang tetamu mungkin tidak sesuai diedarkan secara luas.",
        "Berkongsi acara makan malam tidak memerlukan kalendar janji temu perubatan anda. Namun, lokasi dan pautan makan malam tetap dikongsi. Semak kandungan acara itu sendiri."
      ]
    },
    {
      "heading": "Pilih pratonton, e-mel atau QR",
      "body": [
        "App Clip Cloud Calendars memaparkan pratonton; aplikasi penuh diperlukan untuk menambah acara melalui laluan ini. Jemputan e-mel dan QR membuka halaman web yang menawarkan pembukaan Cloud Calendars. Pautan ini bukan alamat langganan yang boleh saling menggantikan.",
        "Pengirim perlu mendaftar masuk untuk perkongsian terselaras. Pautan dan kod QR boleh diteruskan kepada orang lain. Kod QR menyampaikan pautan, bukan membuktikan siapa yang membukanya."
      ]
    },
    {
      "heading": "Berikan hanya akses yang diperlukan",
      "body": [
        "Jemputan e-mel menawarkan Reader, Writer atau Owner. Reader boleh melihat dan menyelaras, Writer boleh menyunting, Owner juga boleh berkongsi dan mengurus akses. Pilih Reader untuk orang yang hanya memerlukan jadual.",
        "Pilih Writer untuk penganjur bersama yang perlu mengubah acara. Owner hanya apabila orang itu juga perlu mengurus akses orang lain. Hak lebih tinggi memerlukan identiti log masuk yang betul. Penerima tanpa nama bukan pemilik bersama yang dikenal pasti."
      ]
    },
    {
      "heading": "Fahami cara penerima menambah acara",
      "body": [
        "Aplikasi penuh memerlukan kebenaran kalendar dan kalendar destinasi yang boleh ditulis. Penerima perlu menyemak destinasi sebelum menyimpan. Salinan diterima boleh dikaitkan dengan acara dikongsi untuk kemas kini kemudian.",
        "Import fail ICS biasa menghasilkan salinan, manakala langganan menyemak suapan secara berkala. Jika menghantar suapan ICS dan bukannya jemputan aplikasi, terangkan perbezaannya dan pastikan kalendar penerima menyokongnya."
      ]
    },
    {
      "heading": "Sahkan perubahan sebelum bergantung padanya",
      "body": [
        "Perkongsian terselaras boleh membawa suntingan atau pembatalan, tetapi peranti perlu berpeluang menerimanya. Petunjuk muat semula suapan bukan tarikh akhir penghantaran. Peranti luar talian, langganan belum dimuat semula atau salinan import berasingan mungkin masih menunjukkan maklumat lama.",
        "Jika waktu makan malam berubah pada saat akhir, kemas kini acara dan hubungi tetamu secara langsung. Minta pengesahan waktu baharu. Menerima kemas kini bukan jawapan kehadiran."
      ]
    },
    {
      "heading": "Urus akses tanpa menjanjikan pemadaman semua salinan",
      "body": [
        "Semak penerima dan buang kebenaran yang tidak diperlukan. Mengeluarkan penerima dan membatalkan pautan suapan ialah tindakan berasingan. Kedua-duanya tidak menjamin pemadaman jauh semua tangkap layar, mesej atau salinan kalendar.",
        "Jika pautan tersebar, kenal pasti pautan atau akses yang terlibat dan semak hasil selepas perubahan. Elakkan butiran peribadi dalam pautan edaran luas daripada bergantung pada pembatalan kemudian."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Semak butiran dan tentukan sama ada tujuan anda melihat, menyunting atau mendapat jawapan kehadiran.",
    "Pilih laluan perkongsian dan daftar masuk apabila diperlukan.",
    "Gunakan Reader untuk pembaca; Writer atau Owner hanya bagi tanggungjawab berkaitan.",
    "Minta penerima menyemak waktu dan kalendar destinasi.",
    "Bagi perubahan segera, kemas kini acara dan hantar mesej terus.",
    "Semak hak penerima dan akses pautan secara berasingan apabila selesai."
  ],
  "faq": [
    {
      "q": "Adakah satu acara mendedahkan seluruh kalendar?",
      "a": "Perkongsian terselaras satu acara terhad kepada acara itu, tetapi butirannya tetap kelihatan. Semak butiran dan jangan hantar jemputan seluruh kalendar jika hanya satu acara diperlukan."
    },
    {
      "q": "Bolehkah penerima mengubah acara?",
      "a": "Ya, dengan hak Writer atau Owner yang sesuai melalui laluan log masuk yang disokong. Reader untuk melihat dan menyelaras. Langganan ICS biasa bukan mekanisme penyuntingan yang sama."
    },
    {
      "q": "Adakah mengeluarkan seseorang membatalkan semua yang telah diterima?",
      "a": "Tiada jaminan sedemikian. Akses perkongsian berubah, tetapi salinan, tangkap layar dan mesej boleh kekal. Alamat suapan yang dikongsi juga perlu diperiksa secara berasingan."
    }
  ],
  "sourcesHeading": "Rujukan pilihan penerima",
  "sources": [
    {
      "label": "Apple: gambaran keseluruhan App Clips",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google: import acara dan batasnya",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft: import atau langgan kalendar",
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
  "title": "Apa yang sebenarnya dibeli oleh langganan",
  "short": "Apa yang dibeli langganan",
  "description": "Apa yang dibeli langganan: Base, Advanced, Premium.",
  "lede": "Panduan ini diterbitkan oleh Arte Soft, pembangun Cloud Calendars.",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "Base merangkumi penyegerakan Google Calendar, Google Meet, paparan kalendar, cuaca dan widget. Pelan percuma mungkin memaparkan iklan."
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Advanced merangkumi Base dan membuang iklan. Premium merangkumi Advanced serta menambah Microsoft Calendar dan Microsoft Teams.",
        "Langganan tidak memberikan kebenaran menyunting kalendar orang lain atau memintas sekatan akaun kerja."
      ]
    },
    {
      "heading": "Maklumat pembelian dan pembatalan",
      "body": [
        "Semak harga tempatan, tempoh pengebilan dan syarat pembaharuan sebelum membeli.",
        "Untuk langganan yang dibilkan oleh Apple, buka Seting → nama anda → Langganan. Semak status dan tarikh tamat. Membatalkan pembaharuan berbeza daripada memadam app atau data kalendar; jangan anggap ciri berbayar kekal tersedia selepas tamat."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Semak harga tempatan, tempoh pengebilan dan syarat pembaharuan sebelum membeli.",
    "Langganan tidak memberikan kebenaran menyunting kalendar orang lain atau memintas sekatan akaun kerja."
  ],
  "faq": [
    {
      "q": "Bagaimanakah saya menghentikan pembaharuan?",
      "a": "Untuk langganan yang dibilkan oleh Apple, buka Seting → nama anda → Langganan. Semak status dan tarikh tamat. Membatalkan pembaharuan berbeza daripada memadam app atau data kalendar; jangan anggap ciri berbayar kekal tersedia selepas tamat."
    }
  ],
  "sourcesHeading": "Maklumat pembelian dan pembatalan",
  "sources": [
    {
      "label": "Apple: Bagaimanakah saya menghentikan pembaharuan?",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view"
  ]
},
};
