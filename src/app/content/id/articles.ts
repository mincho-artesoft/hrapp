import { LocalisedArticle } from '../types';

/**
 * The four articles this language carries.
 *
 * Chosen one per intent -- weather, one view, sharing, price -- so the language
 * answers a whole question rather than a quarter of four. The numbers are not
 * here: they live once in article-facts.ts and join the prose by id, so a
 * translation can rewrite every sentence without touching a figure.
 */
export const ARTICLES_ID: Readonly<Record<string, LocalisedArticle>> = {
  'weather-inside-your-calendar': {
  "title": "Kalender yang sudah memuat cuaca di dalamnya",
  "short": "Cuaca di dalam kalender",
  "description": "Mengapa memeriksa dua aplikasi untuk menata satu hari adalah cacat rancangan, dan seperti apa kalender yang prakiraannya menjadi bagian tampilan alih-alih berdiri di sebelahnya.",
  "lede": "Hampir semua orang menata harinya di antara dua aplikasi. Kalender berkata di mana harus berada; aplikasi cuaca berkata bagaimana cuacanya ketika tiba. Menahan keduanya sekaligus di kepala adalah bagian yang tak seorang pun sadar sedang dilakukannya — sampai satu hari Sabtu hilang percuma.",
  "commonBelief": "Bahwa kalender untuk janji temu dan aplikasi cuaca untuk cuaca, dan memisahkan keduanya memang begitulah ponsel bekerja.",
  "sections": [
    {
      "heading": "Ongkos dua aplikasi bukan dua ketukan",
      "body": [
        "Berpindah tidak memakan biaya apa pun. Yang mahal adalah keduanya tak pernah sepakat tentang apa yang penting. Kalender Anda tahu bahwa Sabtu pukul sebelas ada dua jam terisi; aplikasi cuaca tahu hujan turun pukul sepuluh sampai satu. Tak satu pun tahu bahwa kedua fakta itu bersama-sama berarti blok itu harus digeser.",
        "Lapisan penggabungnya adalah Anda. Itu bekerja sampai Anda sibuk, yaitu tepat saat melindungi rencana paling berharga."
      ]
    },
    {
      "heading": "Prakiraan yang tersedia",
      "body": [
        "Cloud Calendars menggunakan prakiraan yang tersedia untuk lokasi yang dipilih. Data per jam dan harian dapat mencakup periode berbeda.",
        "Tanggal yang dapat dilihat di kalender tidak menentukan jangkauan prakiraan. Tampilan bulanan tidak berarti prakiraan tersedia untuk seluruh bulan atau setiap acara."
      ]
    }
  ],
  "claims": {
    "price": "Biaya fitur cuaca"
  },
  "practical": [
    "Periksa lokasi, tanggal, dan jam yang tersedia sebelum merencanakan dengan prakiraan."
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-a-subscription-actually-buys"
  ],
  "updated": "2026-10-21"
},

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google, dan Outlook dalam satu tampilan',
    short: 'Tiga akun, satu tampilan',
    description: 'Hidup hampir setiap orang terbelah antara kalender Apple pribadi, akun Google, dan Exchange kantor. Apa yang berubah ketika ketiganya masuk ke kisi yang sama.',
    lede: 'Masalahnya hampir tidak pernah salah satu kalender itu buruk. Masalahnya Anda punya tiga dan pekan hanya satu.',
    commonBelief: 'Bahwa memisahkan kerja dan kehidupan pribadi ke aplikasi berbeda adalah batas, bukan kekurangan.',
    sections: [
      {
        heading: 'Bentrok jadwal itu soal struktur',
        body: [
          'Kalau komitmen Anda hidup di tiga tempat, tidak ada satu tempat pun yang bisa memberi tahu apakah Anda luang. Langkah penggabungnya adalah Anda, dan Anda menjalankannya dari ingatan, biasanya sementara seseorang menunggu jawaban.',
          'Karena itu kegagalan klasiknya bukan melupakan sebuah acara; melainkan menyanggupi sesuatu yang bertabrakan dengan acara yang tak bisa Anda lihat.',
        ],
      },
      {
        heading: 'Apa yang diberikan satu kisi',
        body: [
          'Semua akun di pekan yang sama, diwarnai menurut asalnya, dapat disunting di tempat. Anda berhenti bertanya-tanya aplikasi mana yang menyimpan jawabannya, karena pertanyaannya berhenti berbentuk jamak.',
          'iCloud dan Google tersinkron di versi gratis. Akun Microsoft — Outlook dan Exchange — masuk ke versi berbayar, karena sambungan itu punya biaya berulang yang tidak dimiliki yang lain.',
        ],
      },
    ],
    claims: {
      accounts: 'Jenis akun yang muat dalam satu tampilan',
      premiumMonthly: 'Biaya bulanan menambahkan Microsoft, dalam dolar',
    },
    practical: [
      'Tambahkan akun pribadi lebih dulu, lalu yang menyebabkan tabrakan.',
      'Warnai menurut akun, bukan menurut kategori: asal itulah yang perlu terlihat sekilas.',
      'Teruslah menulis di kalender yang sudah dibaca orang lain.',
    ],
    seeAlso: ['weather-inside-your-calendar', 'what-a-subscription-actually-buys'],
  },

  'sharing-one-event-not-your-calendar': {
  "updated": "2026-10-21",
  "title": "Bagikan satu acara kalender: pilih tautan dan akses yang tepat",
  "short": "Berbagi satu acara",
  "description": "Bagikan satu acara tanpa seluruh kalender. Pahami Reader, Writer, Owner, pratinjau, pembaruan, dan batas pencabutan akses.",
  "lede": "Berbagi rincian makan malam, mengizinkan penyelenggara lain mengedit, dan meminta jawaban kehadiran adalah tugas berbeda. Tentukan kebutuhan, lalu pilih jalur berbagi. Panduan ini ditulis Arte Soft, pengembang Cloud Calendars.",
  "commonBelief": "Setiap tautan acara adalah langganan kalender hanya baca yang langsung diperbarui dan mencatat jawaban.",
  "sections": [
    {
      "heading": "Mulai dari satu acara dan periksa rinciannya",
      "body": [
        "Berbagi satu acara dibatasi pada acara itu, bukan seluruh kalender pengirim. Sebelum mengirim, periksa judul, zona waktu, lokasi, catatan, dan URL rapat. Informasi untuk satu tamu belum tentu cocok untuk tautan yang disebarkan luas.",
        "Berbagi acara makan malam tidak mengharuskan Anda berbagi kalender berisi janji medis. Namun, lokasi dan tautan makan malam tetap ikut. Periksa acaranya sendiri, bukan mengandalkan privasi kalender di sekitarnya."
      ]
    },
    {
      "heading": "Pilih pratinjau, undangan email, atau QR",
      "body": [
        "Cloud Calendars menawarkan jalur berbeda. App Clip menampilkan pratinjau; aplikasi lengkap diperlukan untuk menambahkan acara melalui pengalaman itu. Undangan email dan QR memakai halaman web yang menawarkan pembukaan Cloud Calendars. Jangan menyebut semua tautan ini sebagai URL langganan yang saling menggantikan.",
        "Pengirim masuk untuk alur berbagi tersinkronisasi. Tautan atau kode QR dapat diteruskan, jadi kirim hanya ke tempat yang sesuai dengan isinya. QR menyampaikan tautan, bukan membuktikan siapa yang membukanya."
      ]
    },
    {
      "heading": "Berikan hanya akses yang diperlukan",
      "body": [
        "Undangan email menyediakan Reader, Writer, atau Owner. Reader dapat melihat dan menyinkronkan; Writer mengedit; Owner juga berbagi dan mengelola akses. Pilihan ini berdampak, bukan tiga nama untuk tampilan undangan yang sama. Gunakan Reader bagi yang hanya membutuhkan jadwal.",
        "Pilih Writer untuk rekan penyelenggara yang perlu mengubah acara. Pilih Owner hanya jika ia juga perlu mengelola akses orang lain. Akses lebih tinggi memerlukan identitas masuk yang sesuai. Penerima anonim bukan pemilik bersama yang teridentifikasi."
      ]
    },
    {
      "heading": "Pahami cara penerima menambahkan acara",
      "body": [
        "Dalam aplikasi lengkap, penambahan memerlukan izin kalender dan kalender tujuan yang dapat ditulis. Penerima perlu memeriksa tujuan sebelum menyimpan. Salinan yang diterima kemudian dapat dihubungkan dengan acara bersama untuk pembaruan berikutnya.",
        "Ini berbeda dari mengimpor berkas ICS biasa ke kalender lain. Impor menghasilkan salinan; langganan memeriksa feed secara berkala. Jika Anda mengirim feed ICS, bukan undangan aplikasi, jelaskan jalurnya dan pastikan kalender penerima mendukungnya."
      ]
    },
    {
      "heading": "Verifikasi perubahan sebelum mengandalkannya",
      "body": [
        "Berbagi tersinkronisasi dapat membawa perubahan atau pembatalan, tetapi perangkat penerima harus berkesempatan menerimanya. Petunjuk penyegaran feed bukan tenggat pengiriman. Perangkat offline, langganan yang belum disegarkan, atau salinan impor mandiri dapat tetap menampilkan data lama.",
        "Jika makan malam dipindah mendekati waktu mulai, perbarui acara dan hubungi tamu langsung. Minta konfirmasi waktu baru. Mengirim pembaruan dan menerima jawaban kehadiran adalah langkah terpisah."
      ]
    },
    {
      "heading": "Kelola akses tanpa menjanjikan penghapusan salinan",
      "body": [
        "Tinjau akses penerima dan hapus izin yang tidak diperlukan. Menghapus penerima dan mencabut tautan feed adalah tindakan berbeda; keduanya bukan penghapusan jarak jauh atas tangkapan layar, pesan, atau semua salinan kalender.",
        "Jika tautan tersebar melampaui sasaran, identifikasi tautan atau pemberian akses terkait. Periksa jalur itu setelah perubahan. Untuk acara berikutnya, hindari rincian pribadi pada tautan luas daripada mengandalkan pencabutan untuk menariknya kembali."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Periksa rincian dan tentukan kebutuhan melihat, mengedit, atau jawaban kehadiran.",
    "Pilih jalur berbagi dan masuk bila diperlukan.",
    "Gunakan Reader untuk pembaca; berikan Writer atau Owner hanya sesuai tanggung jawab.",
    "Minta penerima memeriksa waktu dan kalender tujuan saat menambahkan.",
    "Untuk perubahan mendesak, perbarui acara dan kirim pesan langsung.",
    "Tinjau izin penerima dan akses tautan secara terpisah saat berbagi berakhir."
  ],
  "faq": [
    {
      "q": "Apakah berbagi satu acara membuka seluruh kalender saya?",
      "a": "Jalur tersinkronisasi satu acara dibatasi pada acara itu. Rinciannya sendiri tetap terlihat melalui jalur pilihan. Tinjau rinciannya dan jangan kirim undangan seluruh kalender jika hanya bermaksud satu acara."
    },
    {
      "q": "Bisakah penerima mengubah acara?",
      "a": "Ya, dengan akses Writer atau Owner yang sesuai melalui alur masuk yang didukung. Reader untuk melihat dan menyinkronkan. Langganan ICS biasa bukan mekanisme edit yang sama."
    },
    {
      "q": "Apakah menghapus penerima membatalkan semua yang sudah diterimanya?",
      "a": "Jangan mengasumsikan jaminan itu. Perubahan memengaruhi hubungan berbagi, tetapi salinan tersimpan, tangkapan layar, dan pesan dapat tetap ada. URL feed bersama perlu ditinjau terpisah."
    }
  ],
  "sourcesHeading": "Referensi opsi penerima",
  "sources": [
    {
      "label": "Apple: pengantar App Clips",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google: impor acara dan batasannya",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft: mengimpor atau berlangganan kalender",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": []
},

  'what-a-subscription-actually-buys': {
  "updated": "2026-10-21",
  "title": "Apa yang sebenarnya dibeli sebuah langganan",
  "short": "Apa yang dibeli langganan",
  "description": "Apa yang dibeli langganan: Base, Advanced, Premium.",
  "lede": "Panduan ini diterbitkan oleh Arte Soft, pengembang Cloud Calendars.",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "Base mencakup sinkronisasi Google Calendar, Google Meet, tampilan kalender, cuaca, dan widget. Paket gratis dapat menampilkan iklan."
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Advanced mencakup Base dan menghapus iklan. Premium mencakup Advanced serta menambahkan Microsoft Calendar dan Microsoft Teams.",
        "Langganan tidak memberi izin mengedit kalender orang lain atau melewati pembatasan akun kerja."
      ]
    },
    {
      "heading": "Informasi pembelian dan pembatalan",
      "body": [
        "Periksa harga lokal, periode penagihan, dan ketentuan perpanjangan sebelum membeli.",
        "Untuk langganan yang ditagih Apple, buka Pengaturan → nama Anda → Langganan. Periksa status dan tanggal berakhirnya. Membatalkan perpanjangan berbeda dari menghapus app atau data kalender; jangan menganggap fitur berbayar tetap tersedia setelah berakhir."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Periksa harga lokal, periode penagihan, dan ketentuan perpanjangan sebelum membeli.",
    "Langganan tidak memberi izin mengedit kalender orang lain atau melewati pembatasan akun kerja."
  ],
  "faq": [
    {
      "q": "Bagaimana cara menghentikan perpanjangan?",
      "a": "Untuk langganan yang ditagih Apple, buka Pengaturan → nama Anda → Langganan. Periksa status dan tanggal berakhirnya. Membatalkan perpanjangan berbeda dari menghapus app atau data kalender; jangan menganggap fitur berbayar tetap tersedia setelah berakhir."
    }
  ],
  "sourcesHeading": "Informasi pembelian dan pembatalan",
  "sources": [
    {
      "label": "Apple: Bagaimana cara menghentikan perpanjangan?",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view"
  ]
},
};
