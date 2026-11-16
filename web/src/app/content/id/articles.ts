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
  "updated": "2026-10-23",
  "title": "Kalender dengan cuaca di iPhone dan iPad: rencanakan hari Anda dalam satu tampilan",
  "short": "Gunakan kalender dan cuaca bersama",
  "description": "Bandingkan kalender Anda dengan cuaca untuk lokasi yang dipilih di iPhone dan iPad.",
  "lede": "Cloud Calendars menampilkan jadwal dan cuaca Anda dalam aplikasi yang sama di iPhone atau iPad. Gunakan kalender untuk memilih tanggal dan tampilan cuaca untuk meninjau lokasi yang dipilih serta jam prakiraan yang tersedia. Untuk rencana di luar ruangan, periksa periode yang benar-benar penting alih-alih mengandalkan ikon harian. Panduan ini diterbitkan oleh Arte Soft, pengembang aplikasi ini.",
  "commonBelief": "Cuaca yang ditampilkan di samping kalender otomatis menggambarkan alamat setiap acara, setiap jam, dan setiap tanggal di masa mendatang.",
  "sections": [
    {
      "heading": "Pilih pertanyaan perencanaan yang nyata",
      "body": [
        "Mulailah dengan acara tertentu, misalnya kunjungan ke taman pada sore hari. Tentukan apa yang mungkin berubah: waktunya, tempatnya, persiapannya, atau keputusan untuk memakai alternatif lain. Anda tidak perlu menata ulang seluruh kalender hanya karena simbol hari itu menunjukkan hujan.",
        "Catat waktu mulai dan selesai kegiatan yang sebenarnya, termasuk persiapan jika relevan. Gambaran umum kalender membantu menemukan tanggal yang mungkin, sedangkan pemeriksaan prakiraan berkaitan dengan lokasi dan rentang waktu tertentu. Pisahkan kedua tugas itu saat membandingkan pilihan."
      ]
    },
    {
      "heading": "Konfirmasikan lokasi cuaca sebelum membaca nilainya",
      "body": [
        "Cloud Calendars menyediakan cuaca untuk lokasi saat ini atau lokasi yang dipilih. Periksa lokasi yang ditampilkan, jangan berasumsi bahwa alamat acara diam-diam mengubah prakiraan. Acara di kota lain perlu dibandingkan dengan cuaca di kota tersebut.",
        "Misalnya, seseorang mungkin sedang merencanakan waktu tiba di museum saat ponselnya masih berada di rumah. Bacalah lokasi prakiraan dan waktu lokal acara sebelum membandingkannya. Nilai yang terlihat berdekatan bukan bukti bahwa jadwal dan cuaca memakai lokasi yang sama."
      ]
    },
    {
      "heading": "Periksa cakupan per jam dan harian secara terpisah",
      "body": [
        "Gunakan entri harian untuk orientasi dan entri per jam yang tersedia untuk pertanyaan tentang sebagian hari. Pemesanan dari pukul dua hingga lima memerlukan lebih dari sekadar melihat satu simbol. Periksa apakah jam yang relevan benar-benar tersedia.",
        "Dalam sumber aplikasi saat ini, daftar harian memuat hingga sepuluh hari WeatherKit yang dikembalikan. Ini terpisah dari navigasi kalender dan dari jam yang saat ini disediakan. Acara di masa mendatang tidak memperluas cakupan cuaca. Jika periodenya belum tersedia, jadwalkan pemeriksaan cuaca di lain waktu."
      ]
    },
    {
      "heading": "Pahami arti nilai cuaca",
      "body": [
        "Apple mendokumentasikan data WeatherKit seperti suhu, presipitasi, angin, dan UV, dengan beberapa produk hanya tersedia di wilayah tertentu. Bacalah nilai yang tersedia untuk lokasi pilihan Anda, alih-alih mengharapkan semua produk cuaca tersedia di mana-mana.",
        "Panduan Met Office menunjukkan mengapa periode prakiraan dan definisi variabel itu penting: beberapa nilai merujuk pada satu waktu, dan yang lain pada suatu periode. Gunakan label dari penyedia yang relevan. Probabilitas hujan, jumlah hujan, dan durasi hujan adalah pertanyaan yang berbeda, dan tidak ada satu angka pun yang menentukan setiap aktivitas luar ruangan."
      ]
    },
    {
      "heading": "Tinjau draf yang dibuat dari satu jam cuaca",
      "body": [
        "Jika aplikasi menawarkan pembuatan acara dari satu jam, aplikasi akan membuka draf. Sumber saat ini memakai zona waktu lokasi cuaca, mengusulkan durasi satu jam, dan memilih kalender bawaan untuk acara baru. Periksa setiap nilai sebelum menyimpan.",
        "Konfirmasikan judul, kalender tujuan, waktu mulai, waktu selesai, dan lokasi yang dimaksud. Pemilihan prakiraan tidak memberi izin untuk mengedit kalender bersama, memberi tahu suatu tempat, atau memesan ruangan. Periksa acara yang disimpan dan dapatkan persetujuan apa pun yang dibutuhkan rencana tersebut."
      ]
    },
    {
      "heading": "Pisahkan demonstrasi situs web",
      "body": [
        "Demonstrasi cuaca interaktif di situs web menggunakan Open-Meteo. Aplikasi menggunakan Apple WeatherKit. Demonstrasi web berguna untuk mengeksplorasi tampilan, tetapi lokasi, data, dan tanggal yang tersedia bisa berbeda dari aplikasi.",
        "Untuk keputusan yang nyata, buka aplikasi dan bandingkan acara yang dimaksud dengan prakiraan yang tersedia. Jika Anda mengubah rencana bersama, konfirmasikan penyelenggara, cakupan pengulangan, dan peserta. Siapkan alternatif yang telah disepakati bila kegiatan bergantung pada kondisi."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Tentukan acara dan keputusan yang bisa berubah karena cuaca.",
    "Konfirmasikan lokasi cuaca serta tanggal dan waktu lokal acara.",
    "Periksa cakupan per jam yang tersedia secara terpisah dari ringkasan harian.",
    "Bacalah probabilitas, jumlah, dan nilai relevan lainnya sesuai labelnya.",
    "Tinjau semua detail draf acara dan kalender tujuan sebelum menyimpan.",
    "Periksa kembali pada saat keputusan diambil dan konfirmasikan perubahan bersama secara langsung."
  ],
  "faq": [
    {
      "q": "Apakah cuaca di samping kalender saya mengikuti setiap alamat acara?",
      "a": "Jangan berasumsi demikian. Konfirmasikan lokasi cuaca yang ditampilkan dan bandingkan dengan tempat acara; kedekatan di layar tidak membuktikan kecocokannya."
    },
    {
      "q": "Apakah aplikasi menggunakan penyedia cuaca dari situs web?",
      "a": "Tidak. Aplikasi menggunakan Apple WeatherKit; demonstrasi situs web menggunakan Open-Meteo secara terpisah."
    },
    {
      "q": "Apakah memilih satu jam prakiraan akan otomatis menyimpan acara?",
      "a": "Tindakan itu memulai draf jika fitur tersebut tersedia. Periksa tanggal, zona waktu, durasi, kalender, dan lokasinya, lalu simpan acara yang dimaksud."
    }
  ],
  "seeAlso": [
    "weather-calendar-history-versus-forecast-iphone",
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather",
    "weather-where-the-event-is",
    "planning-outdoors-without-being-rained-on"
  ],
  "sourcesHeading": "Sumber resmi dan bacaan lanjutan",
  "sources": [
    {
      "label": "Apple: informasi prakiraan WeatherKit dan ketersediaan regional",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: lokasi prakiraan, periode, dan nilai cuaca",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ],
  "comparison": {
    "heading": "Tampilan cuaca mana yang menjawab pertanyaan Anda?",
    "columns": [
      "Pertanyaan Anda",
      "Yang perlu diperiksa",
      "Yang tidak dibuktikan"
    ],
    "rows": [
      {
        "cells": [
          "Apa yang akan datang hari ini?",
          "Tampilan kalender harian atau mingguan di samping cuaca untuk lokasi yang dipilih.",
          "Bahwa setiap alamat acara otomatis mengubah lokasi cuaca."
        ]
      },
      {
        "cells": [
          "Apakah hujan bisa memengaruhi acara saya sore ini?",
          "Data per jam untuk tempat acara dan seluruh periode acara.",
          "Bahwa satu simbol harian menggambarkan setiap jam."
        ]
      },
      {
        "cells": [
          "Bisakah saya merencanakan bulan depan berdasarkan cuaca?",
          "Kalender Anda sekarang, lalu tinjauan prakiraan lebih dekat ke tanggalnya.",
          "Bahwa menavigasi kalender memperluas cakupan prakiraan."
        ]
      },
      {
        "cells": [
          "Bisakah saya melihat gambaran singkat di rumah?",
          "Widget Home Screen yang sesuai.",
          "Bahwa setiap tata letak widget mencakup acara atau prakiraan lengkap."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-right",
    "hook"
  ],
  "galleryCaption": "Layar Cloud Calendars yang nyata: tampilan cuaca dan satu hari dengan acara. Periksa lokasi dan tanggal yang dipilih di aplikasi.",
  "actionHeading": "Rencanakan dengan jadwal dan prakiraan bersama-sama",
  "actionText": "Cloud Calendars tersedia untuk iPhone dan iPad. Mulailah dengan tampilan, cuaca, dan sinkronisasi Google Calendar yang disertakan di Base; Advanced menghapus iklan, sedangkan Premium menambahkan dukungan Microsoft Calendar dan Teams.",
  "articleLinks": [
    {
      "slug": "forecast-beside-every-event",
      "label": "Periksa cuaca untuk jam-jam acara"
    },
    {
      "slug": "the-widget-that-shows-what-is-next",
      "label": "Pilih widget kalender dan cuaca"
    },
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "Gabungkan akun kalender dalam satu tampilan"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
  "updated": "2026-10-23",
  "title": "Lihat kalender Google, iCloud, dan Outlook bersama di iPhone dan iPad",
  "short": "Tiga penyedia, satu tampilan",
  "description": "Gabungkan tampilan kalender dan pahami izin akun, salinan, serta persyaratan paket.",
  "lede": "Untuk melihat acara kerja dan pribadi bersama-sama, hubungkan akun yang dimaksud, pilih kalendernya, dan periksa acara yang sama dalam satu tampilan. Cloud Calendars mendukung perencanaan di iPhone dan iPad dengan iCloud dan Google Calendar; dukungan Microsoft Calendar tersedia di Premium. Melihat acara bersama-sama berbeda dari menyalin status sibuk antar akun penyedia. Arte Soft, pengembangnya, menerbitkan panduan ini.",
  "commonBelief": "Menempatkan beberapa kalender dalam satu app secara otomatis menjaga ketersediaan, pembagian, dan salinan acaranya tetap selaras.",
  "sections": [
    {
      "heading": "Identifikasi akun dan kalender di balik setiap acara",
      "body": [
        "Mulailah dengan satu acara biasa dari tiap penyedia. Catat alamat email yang masuk, nama kalender, dan apakah acara itu milik Anda atau Anda menerimanya sebagai undangan. Dua kalender bernama “Calendar” bisa berasal dari akun yang sama sekali berbeda. Warna membantu Anda memindai satu minggu; akun dan kalender menunjukkan tempat pengeditan yang tepat.",
        "Misalnya, janji dokter gigi di kalender iCloud pribadi Anda dan rapat proyek di Microsoft dapat muncul bersama untuk Anda. Itu tidak serta-merta membuat janji dokter gigi tersebut terlihat oleh rekan kerja Anda atau memesan waktu itu di alat penjadwalan mereka.",
        "Tentukan hasil yang Anda inginkan sebelum mengubah koneksi. Untuk memindahkan data acara ke akun lain, gunakan “Choose a calendar export format” di bawah untuk menemukan jalur transfer yang didukung dan periksa acara perwakilan sebelum mengandalkan tujuan tersebut. Untuk membandingkan waktu, pertahankan pemilik kalender yang ada dan tampilkan sumber yang dipilih bersama-sama. Jika akun lain harus menerima status sibuk, “Cloud Calendars and OneCal by workflow” menjelaskan bagaimana penyalinan ketersediaan berbeda dari ringkasan pribadi."
      ]
    },
    {
      "heading": "Hubungkan melalui jalur yang sesuai",
      "body": [
        "Untuk iCloud, terlebih dahulu aktifkan iCloud Calendar di iPhone pada Apple Account yang dimaksud. Panduan pengaturan Apple menjelaskan pengaturan perangkat ini. Cloud Calendars mengakses kalender yang tersedia melalui sistem kalender iPhone dan memerlukan akses kalender untuk membacanya. Akun yang terhubung di perangkat lain saja tidak cukup.",
        "Cloud Calendars juga memiliki tindakan “Sign in with Google” dan “Sign in with Microsoft”. Periksa akun mana yang Anda pilih saat masuk, lalu buka grup kalendernya dan pilih kalender yang Anda perlukan. Masuk ke penyedia yang benar dengan identitas pribadi atau kerja yang salah dapat menghasilkan daftar kalender yang sepenuhnya valid tetapi tidak sesuai harapan."
      ]
    },
    {
      "heading": "Pahami paket tanpa mencampurkannya dengan izin",
      "body": [
        "Paket Base mencakup sinkronisasi Google Calendar dan tampilan kalender. Advanced menambahkan penghapusan iklan ke Base. Premium menambahkan fitur Microsoft Calendar dan Microsoft Teams. Tinjau harga lokal dan periode penagihan saat ini sebelum membeli.",
        "Paket mengubah fitur app yang tersedia; paket tidak memberikan kepemilikan atas kalender milik orang lain. Google membedakan izin untuk melihat acara dari izin untuk mengubahnya. Kebijakan perusahaan dan izin yang melekat pada kalender Microsoft tetap berlaku. Acara yang terlihat atau editor yang tersedia bukan bukti bahwa penyedia akan menerima pembaruan."
      ]
    },
    {
      "heading": "Tampilan gabungan dapat mencakup salinan kalender",
      "body": [
        "Koneksi Google dan Microsoft menggunakan salinan kalender di sistem kalender iPhone untuk menampilkan dan menyinkronkan acara. Jangan menganggap bahwa menghubungkan akun berarti tidak ada salinan di luar penyedia aslinya. Tujuan yang digunakan untuk salinan tersebut dapat bergantung pada sumber kalender yang tersedia di perangkat.",
        "Jika akun yang sama juga menjangkau ponsel melalui jalur lain, periksa nama kalender dan sumbernya sebelum menganggap acara yang berulang sebagai acara terpisah. Sembunyikan sementara satu kalender untuk mengidentifikasi tampilan mana yang disediakannya. Jangan hapus acara atau kalender hanya agar layar terlihat rapi: salinan yang terhubung dapat mengirim perubahan kembali ke penyedianya."
      ]
    },
    {
      "heading": "Terus pilih tujuan saat Anda membuat acara",
      "body": [
        "Sebelum menyimpan, periksa kalender acara sama telitinya dengan tanggal dan waktunya. Untuk acara keluarga, pilih kalender yang benar-benar digunakan keluarga; untuk rapat kerja, gunakan tujuan kerja yang diizinkan. Melihat kedua kalender bersama-sama tidak membuat salah satunya menjadi tujuan otomatis untuk setiap acara baru.",
        "Mengubah kalender sebuah acara atau menyeretnya antar kalender bisa merupakan pemindahan, bukan sekadar tampilan kedua yang tidak berbahaya. Biarkan undangan dan rapat berulang tetap di kalender yang sudah digunakan saat Anda mendiagnosis masalah tampilan. Jika Anda perlu melakukan perubahan, tentukan dulu siapa pemilik acara itu dan kalender mana yang dapat menerimanya."
      ]
    },
    {
      "heading": "Verifikasi ringkasan sebelum mengandalkannya",
      "body": [
        "Bandingkan acara terbaru di kalender penyedianya sendiri dengan acara yang sesuai di Cloud Calendars. Periksa tanggal, zona waktu, judul, dan kalender yang dipilih. Untuk kalender yang dapat diedit dan Anda miliki, acara sekali pakai tanpa tamu adalah pemeriksaan yang lebih baik daripada mengubah rapat aktif. Konfirmasikan hasilnya pada penyedia sebelum menganggap koneksi siap digunakan.",
        "Jangan mengandalkan tampilan gabungan untuk membuat blok sibuk anonim di akun lain secara otomatis. Jika Anda perlu agar rekan kerja melihat Anda tidak tersedia tanpa melihat detail pribadi, gunakan pengaturan ketersediaan yang disetujui secara eksplisit dan verifikasi dari sisi mereka. Ringkasan pribadi yang jelas dan ketersediaan bersama adalah tugas yang terpisah."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Daftarkan akun dan kalender yang tepat untuk satu acara dari tiap penyedia.",
    "Aktifkan kalender iCloud yang dimaksud di perangkat dan tinjau akses kalender.",
    "Gunakan metode masuk Google atau Microsoft yang sesuai dan pilih kalender yang dimaksud.",
    "Bandingkan satu acara terbaru dengan tampilan penyedianya sebelum mengubah apa pun.",
    "Sembunyikan sementara sumber yang diduga duplikat; biarkan acara dasarnya tetap utuh.",
    "Periksa kalender tujuan pada setiap acara baru, dan verifikasi secara terpisah setiap pembagian status sibuk yang Anda perlukan."
  ],
  "faq": [
    {
      "q": "Apakah rekan kerja saya akan melihat acara pribadi saya karena saya menampilkan kedua kalender?",
      "a": "Menampilkan kalender bersama-sama bukanlah instruksi berbagi atau jembatan status sibuk otomatis. Periksa pengaturan berbagi sebenarnya pada tiap kalender. Koneksi penyedia dapat membuat salinan kalender di perangkat, jadi tampilan gabungan juga bukan jaminan bahwa data acara hanya ada pada penyedia aslinya."
    },
    {
      "q": "Mengapa saya bisa melihat sebuah acara tetapi tidak berhasil mengeditnya?",
      "a": "Kalender tersebut mungkin hanya-baca, acara itu mungkin milik penyelenggara lain, atau penyedia menolak pembaruannya. Periksa kepemilikan dan izin di kalender penyedia. Membeli paket aplikasi yang lebih tinggi tidak mengubah izin tersebut."
    },
    {
      "q": "Haruskah saya menghubungkan akun Google yang sama melalui semua jalur yang tersedia?",
      "a": "Pertama, periksa bagaimana akun itu sudah tampil di ponsel. Beberapa jalur dapat mempersulit identifikasi salinan kalender. Pilih jalur yang ingin Anda gunakan, verifikasi acaranya, dan sembunyikan tampilan tambahan saat menyelidiki, alih-alih menghapus data atau memutuskan akun sebagai langkah pertama."
    }
  ],
  "sourcesHeading": "Sumber dan referensi penyiapan",
  "sources": [
    {
      "label": "Apple: atur iCloud Calendar di perangkat Anda",
      "url": "https://support.apple.com/guide/icloud/set-up-calendar-mme4d73a8727/icloud"
    },
    {
      "label": "Google: berbagi kalender dan izin",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: API kalender Outlook dan data kotak surat yang didukung",
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
    "heading": "Tampilan gabungan, langganan, atau waktu sibuk yang disalin?",
    "columns": [
      "Yang Anda butuhkan",
      "Yang perlu diperiksa",
      "Yang tidak boleh diasumsikan"
    ],
    "rows": [
      {
        "cells": [
          "Satu tampilan untuk beberapa akun",
          "Akun yang terhubung, kalender yang dipilih, dan paket yang diperlukan.",
          "Bahwa layar bersama menggabungkan kepemilikan atau izin."
        ]
      },
      {
        "cells": [
          "Edit acara yang sampai ke penyedianya",
          "Acara asli, izin menulis, dan hasil tersimpan di sumbernya.",
          "Bahwa edit lokal yang terlihat membuktikan sinkronisasi penyedia berhasil."
        ]
      },
      {
        "cells": [
          "Waktu sibuk di akun lain",
          "Layanan dengan aturan sinkronisasi sumber-ke-tujuan yang dinyatakan secara eksplisit.",
          "Bahwa tampilan gabungan membuat blok ketersediaan untuk rekan kerja."
        ]
      },
      {
        "cells": [
          "Feed kalender berlangganan",
          "Penerbit, perilaku penyegaran, dan status hanya-baca.",
          "Bahwa langganan ICS adalah koneksi dua arah yang dapat diedit."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-left",
    "hook"
  ],
  "galleryDevice": "iPad",
  "galleryCaption": "Tampilan kalender iPad asli menggambarkan peninjauan jadwal. Tangkapan layar tidak menunjukkan arah sinkronisasi penyedia atau izin akun.",
  "actionHeading": "Tinjau kalender Anda bersama-sama di iPhone dan iPad",
  "actionText": "Sinkronisasi Google Calendar sudah termasuk dalam Base. Advanced menambahkan penghapusan iklan; Premium menambahkan dukungan Microsoft Calendar dan Teams. Konfirmasikan izin akun secara terpisah dari paket pembelian.",
  "articleLinks": [
    {
      "slug": "onecal-alternative-iphone-calendar-view-or-sync",
      "label": "Bandingkan tampilan gabungan dengan aturan sinkronisasi OneCal"
    },
    {
      "slug": "fantastical-readdle-calendar366-iphone-comparison",
      "label": "Bandingkan alur kerja kalender iPhone"
    },
    {
      "slug": "weather-inside-your-calendar",
      "label": "Rencanakan dengan weather dan acara sekaligus"
    }
  ]
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
