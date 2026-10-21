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
  "month-view-on-a-bigger-screen": {
  "updated": "2026-10-22",
  "title": "Kalender bulanan di iPad dan iPhone: lihat tanggal, lalu periksa detail",
  "short": "Gunakan tampilan bulan tanpa melewatkan detail",
  "description": "Bandingkan tanggal di iPad atau iPhone. Periksa acara tersembunyi, kalender pilihan, dan waktu sebelum memindahkan janji bersama atau berulang.",
  "lede": "Tampilan bulan menunjukkan sebaran janji pada berbagai tanggal. Tampilan ini kurang cocok untuk membuktikan bahwa jam tertentu kosong. Pilih tanggal melalui ringkasan, lalu periksa hari dan acaranya sebelum berkomitmen. Panduan ini diterbitkan oleh Arte Soft, pengembang Cloud Calendars.",
  "commonBelief": "Kisi bulan yang lebih besar menampilkan semua detail, dan tanggal yang tampak kosong membuktikan semua orang tersedia.",
  "sections": [
    {
      "heading": "Tentukan apakah Anda perlu tanggal atau jam yang tepat",
      "body": [
        "Gunakan bulan untuk membandingkan tenggat proyek, perjalanan, dan janji keluarga selama beberapa minggu. Untuk mengetahui apakah dua janji bertabrakan pukul 14.30, beralihlah ke tampilan hari atau minggu dan periksa awal serta akhirnya. Kotak bulan tidak memiliki skala waktu yang sama dengan kisi per jam.",
        "Misalnya, penyelenggara lokakarya dapat menghindari minggu perjalanan terlebih dahulu. Lalu periksa hari yang diusulkan: janji yang ada, persiapan, perjalanan, dan batas waktu selesai. Kotak yang terlihat kosong adalah kandidat untuk diperiksa, bukan pemesanan pasti atau pernyataan ketersediaan orang lain."
      ]
    },
    {
      "heading": "Baca jumlah tambahan, jangan hanya menghitung judul yang terlihat",
      "body": [
        "Kotak bulan Cloud Calendars saat ini menampilkan sejumlah label acara yang terbatas dan jumlah tambahan jika ada acara lain pada tanggal tersebut. Judul dibatasi satu baris sehingga dapat terpotong. Buka hari atau acara jika judul lengkap maupun janji lainnya penting.",
        "Layar iPad yang lebih besar dapat memudahkan pembacaan, tetapi ruang fisik tambahan belum tentu menghapus semua batas tampilan. Jendela aplikasi yang sempit atau teks lebih besar dapat mengubah muatannya. Lakukan pemeriksaan yang sama di iPhone: buka hari sebelum menganggap label yang terlihat sebagai seluruh jadwal."
      ]
    },
    {
      "heading": "Periksa bulan, kalender pilihan, dan tanggal yang berdekatan",
      "body": [
        "Baca bulan dan tahun yang ditampilkan sebelum memilih tanggal. Kisi bulan dapat menyertakan tanggal dari bulan sebelah untuk melengkapi baris. Di Cloud Calendars, gunakan navigasi bulan dan periksa tanggal yang dipilih, bukan hanya posisi kotaknya.",
        "Periksa kalender mana yang dipilih. Menyembunyikan acara kerja memudahkan membaca rencana keluarga, tetapi juga menghilangkan komitmen tersebut dari ringkasan itu. Untuk menyelidiki duplikat, sembunyikan sementara satu sumber lalu bandingkan; jangan hapus janji hanya agar bulan terlihat lebih lengang."
      ]
    },
    {
      "heading": "Buka acara sebelum mengubah kesepakatan bersama",
      "body": [
        "Konfirmasikan judul, pemilik atau kalender, waktu setempat, dan durasi dalam detail acara. Warna membantu pemindaian, tetapi tidak menggantikan pemeriksaan akun atau izin mengedit. Undangan yang terlihat berbeda dari janji yang Anda selenggarakan sendiri.",
        "Cloud Calendars menyediakan cara menyeret acara di tampilan bulan untuk memindahkannya ke tanggal lain. Sebelum menggunakannya pada janji nyata, pastikan tanggal tujuan dan cakupan pengulangan. Setelah perubahan yang diizinkan, buka kembali acara dan periksa hasilnya; gerakan lokal bukan bukti bahwa penyedia atau semua peserta menerima pengaturan baru."
      ]
    },
    {
      "heading": "Periksa acara berulang dan zona waktu secara terpisah",
      "body": [
        "Jika hanya pelajaran minggu ini yang pindah, jangan sampai pola berikutnya ikut berubah tanpa sengaja. Baca pilihan cakupan pengulangan yang tersedia, lalu periksa kejadian yang berubah dan satu kejadian berikutnya. Tampilan bulan memudahkan perbandingan tanggal berulang, tetapi cakupan edit menentukan arti perubahan.",
        "Untuk perjalanan atau rapat lintas zona waktu, periksa tanggal dan waktu setempat secara jelas. Memindahkan acara ke hari lain tidak otomatis mengonversi waktu rapat yang dimaksud. Periksa perubahan waktu musim panas jika relevan dan konfirmasikan waktu yang disepakati dengan peserta."
      ]
    },
    {
      "heading": "Gunakan tampilan besar tanpa mencampuradukkannya dengan produk lain",
      "body": [
        "Apple Calendar memiliki pilihan tampilan bulannya sendiri, sedangkan Teamup mendokumentasikan kelompok tampilan berbeda untuk browser dan seluler. Kontrol tersebut milik masing-masing produk. Jangan mencari konfigurasi browser Teamup atau menu tampilan Apple Calendar di Cloud Calendars hanya karena nama tampilannya sama.",
        "Sebulan janji juga bukan berarti sebulan prakiraan cuaca. Untuk rencana luar ruangan, periksa tempat, tanggal, dan jam prakiraan yang tersedia secara terpisah. Simpan janji akhir ke kalender yang dimaksud dan konfirmasikan perubahan langsung kepada peserta."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Gunakan tampilan bulan untuk memilih kandidat tanggal, lalu periksa jam tepatnya di tampilan hari atau minggu.",
    "Buka hari yang memiliki jumlah tambahan atau judul terpotong.",
    "Periksa bulan, tahun, dan kalender pilihan sebelum menganggap tanggal kosong.",
    "Konfirmasikan kalender, waktu, durasi, dan izin edit acara.",
    "Baca cakupan pengulangan dan periksa kejadian yang tersimpan setelah dipindahkan.",
    "Periksa ketersediaan cuaca secara terpisah dan konfirmasikan perubahan kepada peserta."
  ],
  "faq": [
    {
      "q": "Apakah tampilan bulan iPad menampilkan setiap janji secara lengkap?",
      "a": "Jangan menganggap demikian. Cloud Calendars membatasi label acara dalam kotak bulan dan memakai jumlah tambahan. Buka hari dan acara untuk memeriksa seluruh jadwal."
    },
    {
      "q": "Apakah hari kosong berarti saya tersedia?",
      "a": "Periksa dahulu kalender pilihan, tanggal, dan apakah data akun terkait tersedia. Ringkasan hanya mewakili informasi yang saat ini tersedia dan ditampilkan."
    },
    {
      "q": "Apakah memindahkan acara berulang hanya mengubah tanggal itu?",
      "a": "Baca pilihan cakupan edit, jangan berasumsi. Setelah menyimpan, periksa kejadian yang berubah dan kejadian berikutnya, lalu konfirmasikan pengaturan yang dimaksud."
    }
  ],
  "sourcesHeading": "Bandingkan deskripsi tampilan resmi",
  "sources": [
    {
      "label": "Apple: tampilan bulan, beberapa hari, dan daftar di Apple Calendar",
      "url": "https://support.apple.com/en-ca/guide/iphone/iphfd1054569/ios"
    },
    {
      "label": "Teamup: tampilan kalender serta konfigurasi browser dan aplikasi",
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
  "title": "Kalender dengan cuaca di iPhone dan iPad: periksa konteks rencana",
  "short": "Gunakan kalender dan cuaca bersama",
  "description": "Gunakan kalender dan cuaca di iPhone dan iPad. Periksa lokasi, jam prakiraan yang tersedia, dan detail acara sebelum menyimpan rencana.",
  "lede": "Kalender memberi tahu kapan suatu janji dijadwalkan. Cuaca membantu menjawab pertanyaan berbeda: kondisi apa yang diperkirakan untuk tempat dan periode yang dibutuhkan? Gunakan keduanya dengan tetap memperjelas lokasi dan tanggal. Panduan ini diterbitkan oleh Arte Soft, pengembang Cloud Calendars.",
  "commonBelief": "Cuaca di samping kalender otomatis menjelaskan alamat setiap janji, setiap jam, dan semua tanggal mendatang.",
  "sections": [
    {
      "heading": "Pilih pertanyaan perencanaan yang nyata",
      "body": [
        "Mulailah dengan janji tertentu, misalnya kunjungan sore ke taman. Tentukan apa yang mungkin berubah: waktu, tempat, persiapan, atau keputusan memilih alternatif. Anda tidak perlu mengatur ulang seluruh kalender hanya karena simbol harian menunjukkan hujan.",
        "Catat awal dan akhir kegiatan yang sebenarnya, termasuk persiapan jika relevan. Ringkasan kalender membantu mencari tanggal yang memungkinkan, sedangkan pemeriksaan prakiraan menyangkut tempat dan interval tertentu. Pisahkan kedua tugas itu saat membandingkan pilihan."
      ]
    },
    {
      "heading": "Pastikan lokasi cuaca sebelum membaca nilainya",
      "body": [
        "Cloud Calendars menyediakan cuaca untuk lokasi saat ini atau lokasi pilihan. Periksa lokasi yang ditampilkan, bukan menganggap alamat acara diam-diam mengubah prakiraan. Janji di kota lain perlu dibandingkan dengan cuaca kota tersebut.",
        "Misalnya, pengunjung merencanakan kedatangan di museum saat ponselnya masih di rumah. Baca lokasi prakiraan dan waktu setempat janji sebelum membandingkannya. Nilai yang terlihat berdekatan bukan bukti bahwa jadwal dan cuaca menggunakan tempat yang sama."
      ]
    },
    {
      "heading": "Periksa cakupan per jam dan harian secara terpisah",
      "body": [
        "Gunakan entri harian sebagai gambaran umum dan entri per jam yang tersedia untuk pertanyaan tentang sebagian hari. Janji dari pukul dua sampai lima membutuhkan lebih dari sekilas melihat satu simbol. Periksa apakah jam yang relevan benar-benar tersedia.",
        "Dalam kode aplikasi saat ini, daftar harian mengambil hingga sepuluh hari yang dikembalikan WeatherKit. Ini terpisah dari navigasi kalender maupun jam yang sedang disediakan. Janji di masa depan tidak memperpanjang cakupan cuaca. Jika periodenya tidak ada, jadwalkan pemeriksaan cuaca kemudian."
      ]
    },
    {
      "heading": "Pahami arti nilai cuaca",
      "body": [
        "Apple mendokumentasikan data WeatherKit seperti suhu, curah hujan, angin, dan UV, dengan beberapa produk hanya tersedia di wilayah tertentu. Baca nilai yang tersedia untuk lokasi pilihan, bukan mengharapkan semua produk cuaca di setiap tempat.",
        "Panduan Met Office menunjukkan mengapa periode prakiraan dan definisi variabel penting: beberapa nilai berlaku pada satu saat, lainnya pada suatu periode. Gunakan label penyedia terkait. Peluang, jumlah, dan durasi hujan merupakan pertanyaan berbeda; satu angka tidak menentukan semua kegiatan luar ruangan."
      ]
    },
    {
      "heading": "Tinjau draf yang dibuat dari jam cuaca",
      "body": [
        "Jika aplikasi menawarkan pembuatan acara dari suatu jam, yang dibuka adalah draf. Kode saat ini menggunakan zona waktu lokasi cuaca, mengusulkan durasi satu jam, dan memilih kalender default untuk acara baru. Periksa setiap nilai sebelum menyimpan.",
        "Konfirmasikan judul, kalender tujuan, awal, akhir, dan lokasi yang dimaksud. Memilih prakiraan tidak memberi izin mengedit kalender bersama, memberi tahu tempat acara, atau memesan ruang. Periksa acara tersimpan dan dapatkan kesepakatan yang dibutuhkan rencana."
      ]
    },
    {
      "heading": "Bedakan demonstrasi situs web",
      "body": [
        "Demonstrasi cuaca interaktif di situs menggunakan Open-Meteo. Aplikasi menggunakan Apple WeatherKit. Demo web berguna untuk menjelajahi tampilannya, tetapi lokasi, data, dan tanggal yang tersedia dapat berbeda dari aplikasi.",
        "Untuk keputusan nyata, buka aplikasi dan bandingkan janji yang dimaksud dengan prakiraan yang tersedia. Jika mengubah rencana bersama, pastikan penyelenggara, cakupan pengulangan, dan peserta. Siapkan alternatif yang disepakati jika kegiatan bergantung pada kondisi."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Tentukan janji dan keputusan yang dapat dipengaruhi cuaca.",
    "Pastikan lokasi cuaca serta tanggal dan waktu setempat janji.",
    "Periksa cakupan per jam yang tersedia secara terpisah dari ringkasan harian.",
    "Baca peluang, jumlah, dan nilai terkait lainnya menurut labelnya.",
    "Tinjau semua detail draf acara dan kalender tujuan sebelum menyimpan.",
    "Periksa kembali saat mengambil keputusan dan konfirmasikan perubahan bersama secara langsung."
  ],
  "faq": [
    {
      "q": "Apakah cuaca di samping kalender mengikuti alamat setiap acara?",
      "a": "Jangan menganggap demikian. Pastikan lokasi cuaca yang ditampilkan dan bandingkan dengan tempat acara; kedekatan di layar tidak membuktikan kecocokan."
    },
    {
      "q": "Apakah aplikasi memakai penyedia cuaca situs web?",
      "a": "Tidak. Aplikasi memakai Apple WeatherKit; demonstrasi situs memakai Open-Meteo secara terpisah."
    },
    {
      "q": "Apakah memilih jam prakiraan otomatis menyimpan janji?",
      "a": "Pilihan itu memulai draf jika tindakan tersebut tersedia. Periksa tanggal, zona waktu, durasi, kalender, dan lokasi, lalu simpan acara yang dimaksud."
    }
  ],
  "seeAlso": [
    "month-view-on-a-bigger-screen",
    "icloud-google-and-outlook-in-one-view",
    "sharing-one-event-not-your-calendar"
  ],
  "sourcesHeading": "Sumber resmi dan bacaan lanjutan",
  "sources": [
    {
      "label": "Apple: informasi prakiraan WeatherKit dan ketersediaan wilayah",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: lokasi, periode, dan nilai prakiraan cuaca",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ]
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
