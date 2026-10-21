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
  'weather-inside-your-calendar': {
  "title": "Kalendar yang sudah mengandungi cuaca",
  "short": "Cuaca di dalam kalendar",
  "description": "Mengapa memeriksa dua aplikasi untuk menyusun satu hari ialah kecacatan reka bentuk, dan bagaimana rupanya kalendar yang ramalannya menjadi sebahagian daripada paparan dan bukan berdiri di sebelahnya.",
  "lede": "Hampir semua orang menyusun harinya antara dua aplikasi. Kalendar memberitahu di mana perlu berada; aplikasi cuaca memberitahu bagaimana cuacanya apabila sampai. Memegang kedua-duanya serentak di kepala ialah bahagian yang tiada siapa sedar sedang dibuatnya — sehingga satu hari Sabtu hilang begitu sahaja.",
  "commonBelief": "Bahawa kalendar untuk temu janji dan aplikasi cuaca untuk cuaca, dan mengasingkan kedua-duanya memang begitulah telefon berfungsi.",
  "sections": [
    {
      "heading": "Kos dua aplikasi bukan dua ketikan",
      "body": [
        "Bertukar tidak menelan apa-apa kos. Yang mahal ialah kedua-duanya tidak pernah bersetuju tentang apa yang penting. Kalendar anda tahu bahawa pada Sabtu jam sebelas dua jam telah terisi; aplikasi cuaca tahu hujan turun dari pukul sepuluh hingga satu. Tiada satu pun tahu bahawa kedua-dua fakta itu bersama-sama bermakna blok itu perlu dialihkan.",
        "Lapisan penyatuannya ialah anda. Ia berjalan sehingga anda sibuk, iaitu tepat ketika melindungi rancangan paling bernilai."
      ]
    },
    {
      "heading": "Ramalan yang tersedia",
      "body": [
        "Cloud Calendars menggunakan ramalan yang tersedia untuk lokasi yang dipilih. Data setiap jam dan harian mungkin meliputi tempoh yang berbeza.",
        "Tarikh yang boleh dilihat dalam kalendar tidak menentukan julat ramalan. Paparan bulanan tidak bermaksud ramalan tersedia untuk seluruh bulan atau setiap acara."
      ]
    }
  ],
  "claims": {
    "price": "Kos ciri-ciri cuaca"
  },
  "practical": [
    "Semak lokasi, tarikh dan jam yang tersedia sebelum merancang berdasarkan ramalan."
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-a-subscription-actually-buys"
  ],
  "updated": "2026-10-21"
},

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google dan Outlook dalam satu paparan',
    short: 'Tiga akaun, satu paparan',
    description: 'Kehidupan hampir setiap orang terbahagi antara kalendar Apple peribadi, akaun Google dan Exchange dari tempat kerja. Apa yang berubah apabila ketiga-tiganya masuk ke grid yang sama.',
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
