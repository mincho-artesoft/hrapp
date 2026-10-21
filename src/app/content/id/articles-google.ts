import { LocalisedArticle } from '../types';

/** Enam artikel Google: pertanyaan spesifik, jawaban lugas. */
export const GOOGLE_ID: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
  "title": "Izin Google Kalender: periksa akses yang benar-benar diberikan",
  "short": "Akses dan privasi Google Kalender",
  "description": "Pilih akses ketersediaan, rincian, atau pengeditan. Periksa akses publik dan grup, selain izin perorangan, sebelum berbagi.",
  "lede": "Sebelum berbagi kalender, tentukan tugas penerima. Mencari waktu, membaca rincian, dan memelihara kalender adalah tugas berbeda. Panduan ini diterbitkan Arte Soft, pengembang Cloud Calendars.",
  "commonBelief": "Memberi satu orang izin terbatas menjamin ia tidak bisa melihat rincian melalui jalur lain.",
  "sections": [
    {
      "heading": "Sesuaikan akses dengan tugas",
      "body": [
        "Rekan yang menentukan waktu mungkin hanya perlu ketersediaan tanpa rincian janji. Kolaborator pengelola jadwal proyek membutuhkan pengaturan berbeda. Tentukan tugas dahulu, lalu periksa izin pada setelan berbagi kalender saat ini.",
        "Google membedakan ketersediaan, rincian acara, dan beberapa tingkat edit. Satu pilihan membatasi akses acara pribadi; lainnya mengizinkan edit dan rincian, sedangkan yang terkuat juga mengelola berbagi. Jangan menyamakan semua pilihan yang menyebut perubahan."
      ]
    },
    {
      "heading": "Periksa akses seluruh kalender dan perorangan",
      "body": [
        "Selain individu, periksa apakah kalender publik, tersedia bagi organisasi, atau dibagikan melalui grup. Menurut Google, akses lebih luas dapat mengesampingkan izin sempit: membatasi satu orang tidak membatalkan rincian yang sudah publik.",
        "Misalnya jadwal klub yang dipublikasikan untuk anggota. Sebelum menaruh janji pribadi, periksa audiens kalender, bukan hanya izin di samping satu teman. Simpan janji pribadi pada tujuan yang sesuai."
      ]
    },
    {
      "heading": "Gunakan setelan Google untuk kalender yang tepat",
      "body": [
        "Di Google Kalender pada komputer, cari kalender di daftar Anda, buka menu dan setelan berbaginya. Google mendokumentasikan area terpisah untuk orang atau grup dan akses lebih luas. Periksa nama kalender serta akun masuk sebelum mengubahnya.",
        "Pastikan identitas Google penerima saat mengundang. Bila kalender tidak ditemukan, periksa alamat dan pesan undangan, bukan memperluas akses agar muncul. Tampilan hilang dan izin edit kurang adalah masalah berbeda."
      ]
    },
    {
      "heading": "Uji tanpa janji pribadi",
      "body": [
        "Gunakan acara uji biasa tanpa judul pribadi, catatan, lokasi, atau daftar tamu. Minta penerima memastikan apa yang terlihat dan, hanya jika perlu serta diizinkan, yang dapat diubah. Jangan membagikan kredensial akun untuk pengujian.",
        "Catat kalender dan peran yang diberikan, lalu periksa hasil setelah perubahan. Ini memverifikasi pengaturan yang diinginkan, bukan membuktikan hilangnya informasi yang pernah dibaca atau disalin. Jangan menguji dengan mempublikasikan jadwal kerja asli."
      ]
    },
    {
      "heading": "Pisahkan kebijakan kerja dari paket aplikasi",
      "body": [
        "Google menyatakan administrator kerja atau sekolah dapat membatasi kontrol berbagi. Jika setelan tidak tersedia, gunakan jalur yang disetujui organisasi. Jangan mempublikasikan informasi kerja untuk mengakali pembatasan akun.",
        "Cloud Calendars dapat menampilkan kalender terhubung, tetapi nama paket tidak mengubah izin Google. Advanced menghapus iklan, bukan membeli akses orang lain ke semua acara. Periksa pengaturan penyedia dan hasil yang diterima, bukan hanya editor lokal yang tersedia."
      ]
    },
    {
      "heading": "Tinjau dan hapus akses yang tidak diperlukan",
      "body": [
        "Saat proyek selesai, periksa penerima sebenarnya, grup, dan publikasi yang lebih luas. Menghapus satu nama hanya sebagian pemeriksaan jika ada jalur lain. Sepakati penanggung jawab jadwal dan perubahan akses berikutnya.",
        "Google mendokumentasikan penghapusan orang atau grup secara terpisah dari penghentian berbagi lebih luas. Pencabutan tidak menarik berkas ekspor, tangkapan layar, atau informasi yang sudah disalin. Tindak lanjuti terpisah dengan pihak terkait; jangan menjanjikan satu tombol menghapus semua salinan lama."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifikasi kalender dan tugas penerima.",
    "Periksa akses individu, grup, organisasi, dan publik.",
    "Pilih izin sesuai tugas dalam setelan Google saat ini.",
    "Pastikan identitas sebelum mengubah akses.",
    "Periksa acara uji tanpa data sensitif dari sisi penerima.",
    "Tinjau jalur usang tanpa menganggap salinan lama ditarik kembali."
  ],
  "faq": [
    {
      "q": "Apakah izin individu terbatas mengesampingkan kalender publik?",
      "a": "Tidak. Google menyatakan izin lebih luas diprioritaskan jika setelan bertentangan. Periksa akses publik dan organisasi serta entri orang tersebut."
    },
    {
      "q": "Apakah semua izin edit menampilkan acara pribadi dengan cara sama?",
      "a": "Tidak. Google mendokumentasikan opsi yang membatasi akses acara pribadi secara terpisah dari edit lain dan pengelolaan berbagi. Baca izin saat ini dengan tepat."
    },
    {
      "q": "Apakah membeli Advanced mengubah hak berbagi Google?",
      "a": "Tidak. Advanced menghapus iklan Cloud Calendars. Akses penyedia bergantung pada izin kalender dan pembatasan organisasi."
    }
  ],
  "sourcesHeading": "Panduan Google terkini tentang izin dan berbagi",
  "sources": [
    {
      "label": "Google: memilih izin kalender",
      "url": "https://support.google.com/calendar/answer/15716974?hl=en"
    },
    {
      "label": "Google: berbagi kalender dan menghapus akses",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    }
  ],
  "seeAlso": [
    "why-a-shared-calendar-does-not-appear"
  ],
  "updated": "2026-10-21"
},

  'why-a-shared-calendar-does-not-appear': {
    "updated": "2026-10-21",
    "title": "Sebuah kalender dibagikan kepada Anda dan tidak ada di sana",
    "short": "Kalender bersama tidak muncul",
    "description": "Kalender Google bersama tidak muncul? Periksa akun yang diundang, grup, visibilitas, dan jenis tautannya.",
    "lede": "Panduan ini disusun Arte Soft, pengembang Cloud Calendars. Bedakan dahulu masalah izin akses dari kalender yang hanya disembunyikan.",
    "commonBelief": "Bahwa menerima kalender bersama menaruhnya di ponsel Anda.",
    "sections": [
      {
        "heading": "Periksa akun dan grup",
        "body": [
          "Bandingkan penerima undangan dengan akun Google yang aktif di ponsel dan browser. Buka tautan undangan dengan akun yang dimaksud. Google mendukung berbagi dengan orang dan Google Grup. Untuk akses melalui grup, minta pengelola mengonfirmasi keanggotaan Anda dan pemilik kalender memeriksa izin grup yang benar. Email yang diteruskan tidak memberikan izin dengan sendirinya."
        ]
      },
      {
        "heading": "Tersembunyi, tidak ada, atau dibatasi?",
        "body": [
          "Buka menu Google Kalender di iPhone atau iPad. Jika kalender ada tetapi tidak dicentang, pilih kalender tersebut. Jika tidak ada, minta pemilik memeriksa akses: permintaan bukan persetujuan. Kebijakan kantor atau sekolah dapat membatasi berbagi. Bandingkan akun yang sama di Google Kalender versi web. Jika berfungsi di sana, periksa akun terhubung dan pilihan kalender di aplikasi lain. Akses hanya baca tidak mengizinkan pengeditan."
        ]
      },
      {
        "heading": "Kenali jenis tautan",
        "body": [
          "Undangan berbagi juga berisi tautan; tidak semua tautan merupakan langganan ICS. Tanyakan apakah tautan memberikan akses ke kalender Google atau menerbitkan umpan hanya baca. Menurut Google, langganan kalender baru memerlukan browser komputer; membuka kalender yang sudah dibagikan lewat email adalah tindakan berbeda. Pembaruan umpan bergantung pada layanan penerima. Tidak ada waktu tunggu universal; konfirmasikan perubahan mendesak kepada penyelenggara."
        ]
      }
    ],
    "claims": {},
    "faq": [
      {
        "q": "Bisakah Google Grup mendapat akses?",
        "a": "Ya. Periksa grup yang dipilih, keanggotaan Anda, dan batasan organisasi. Email grup yang diteruskan bukan bukti akses."
      },
      {
        "q": "Haruskah saya menghapus dan menghubungkan ulang akun?",
        "a": "Periksa dahulu identitas, izin, dan visibilitas, lalu bandingkan kalender web. Menghubungkan ulang tidak memberikan izin yang belum ada."
      }
    ],
    "practical": [
      "Pastikan akun yang diundang dan keanggotaan grup.",
      "Pilih kalender jika terdaftar tetapi tersembunyi.",
      "Minta pemilik memeriksa akses sebelum mengubah koneksi."
    ],
    "sourcesHeading": "Sumber dan informasi lebih lanjut",
    "sources": [
      {
        "label": "Google: Periksa akun dan grup",
        "url": "https://support.google.com/calendar/answer/37082?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Tersembunyi, tidak ada, atau dibatasi?",
        "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Kenali jenis tautan",
        "url": "https://support.google.com/calendar/answer/37648?hl=en"
      }
    ],
    "seeAlso": [
      "who-can-see-what-in-google-calendar",
      "google-calendars-that-never-reach-your-iphone"
    ]
  },

  'the-secret-address-of-a-google-calendar': {
  "title": "Alamat iCal rahasia Google: bedakan langganan dari berbagi",
  "short": "Alamat iCal rahasia",
  "description": "Pahami alamat iCal rahasia Google, koneksi akun, dan feed. Tangani alamat yang terungkap tanpa menjanjikan pembaruan instan atau penghapusan salinan.",
  "lede": "Alamat kalender, koneksi akun, dan undangan menjalankan fungsi berbeda. Kenali yang Anda miliki sebelum membawa jadwal ke aplikasi lain. Panduan ini diterbitkan oleh Arte Soft, pengembang Cloud Calendars.",
  "commonBelief": "Alamat kalender rahasia dianggap undangan pribadi yang dapat ditarik dari satu penerima saja.",
  "sections": [
    {
      "heading": "Pilih koneksi sesuai kebutuhan",
      "body": [
        "Google membedakan masuk ke aplikasi kalender lain dari melihat melalui alamat iCal rahasia. Koneksi akun dapat mendukung pengeditan; alamat menyediakan langganan hanya-baca. Google menyatakan alamat rahasia untuk penggunaan sendiri dan menyarankan agar tidak membagikannya kepada orang lain.",
        "Menampilkan jadwal kerja sendiri di kalender kompatibel berbeda dari memberi rekan akses berkelanjutan. Tentukan hasilnya: melihat jadwal sendiri, bekerja sama dengan orang tertentu, atau menerbitkan jadwal untuk audiens. Jangan memilih URL hanya karena mudah ditempel."
      ]
    },
    {
      "heading": "Temukan kalender yang benar, bukan hanya akunnya",
      "body": [
        "Di komputer, petunjuk Google menempatkan alamat rahasia berformat iCal pada pengaturan integrasi kalender yang dipilih. Periksa nama kalender dahulu. Administrator kantor atau sekolah dapat membatasi opsi ini; alamat yang tidak tersedia bukan alasan untuk memublikasikan kalender.",
        "Jauhkan alamat dari tangkapan layar, laporan dukungan publik, dan catatan bersama. Saat meminta bantuan, jelaskan jenis akun, nama kalender, dan cara koneksi tanpa URL. Biasanya jalur koneksi perlu dikenali terlebih dahulu sebelum isi acara diperlukan."
      ]
    },
    {
      "heading": "Periksa apa yang ditambahkan aplikasi penerima",
      "body": [
        "Langganan mengikuti feed; impor file membuat salinan terpisah. Baca petunjuk aplikasi penerima dan pastikan tindakan yang diambil. Membuka file kalender unduhan tidak berarti janji yang ditambahkan akan mengikuti perubahan berikutnya.",
        "Gunakan acara biasa yang tidak sensitif dan sudah Anda kenal untuk membandingkan nama kalender, tanggal, dan detail. Jangan membuat langganan kedua untuk memeriksa yang pertama: dua salinan dapat membuat keterlambatan terlihat seperti konflik. Sembunyikan satu kalender sementara untuk mengenali sumber."
      ]
    },
    {
      "heading": "Pisahkan tautan Google dan Cloud Calendars",
      "body": [
        "Cloud Calendars memiliki alur berbagi acara dan kalender sendiri, termasuk feed langganan. Itu bukan alamat rahasia Google. Sebelum membuka, kenali apakah pengirim membagikan satu acara, kalender, atau undangan berbasis akun.",
        "Penerima Cloud Calendars dapat memiliki peran Reader, Writer, atau Owner. Alamat feed saja bukan bukti hak edit. Menerima alamat tampilan Google juga tidak membuat Anda pemilik kalender. Tanyakan kepada pengirim sistem mana yang digunakan untuk perubahan."
      ]
    },
    {
      "heading": "Pertimbangkan cara kalender penerima memperbarui",
      "body": [
        "Langganan bukan janji pengiriman langsung. Feed Cloud Calendars mencantumkan interval pembaruan yang disarankan, tetapi aplikasi penerima menentukan kapan mengambil dan menampilkan perubahan. Waktu lama pada satu perangkat tidak membuktikan penyelenggara gagal menyimpan.",
        "Untuk rapat hari ini, bandingkan dengan jadwal terbaru penyelenggara dan konfirmasikan perubahan penting langsung. Catat kalender yang masih menampilkan informasi lama dan waktu pemeriksaan. Jangan mengimpor berulang kali atau menghapus kalender sumber untuk memaksa feed memperbarui."
      ]
    },
    {
      "heading": "Tangani keterbukaan alamat tanpa menjanjikan penarikan semua salinan",
      "body": [
        "Google menjelaskan penyetelan ulang alamat rahasia yang terungkap: alamat lama tidak berlaku dan pengganti dibuat. Kenali aplikasi Anda yang menggunakannya agar langganannya dapat diperbarui. Menyetel ulang alamat berbeda dari menghapus kolaborator tertentu.",
        "Janji yang tersimpan, ekspor, atau tangkapan layar sebelumnya adalah masalah terpisah. Tautan baru tidak membuktikan semua salinan lama hilang. Jika informasi tersebar ke audiens keliru, pertimbangkan isi dan penerimanya, bukan menganggap reset berhasil sebagai bukti penghapusan lengkap."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Kenali apakah Anda memiliki koneksi akun, undangan, langganan, atau file.",
    "Periksa kalender pemilik sebelum menyalin alamat.",
    "Gunakan alamat rahasia Google hanya untuk aplikasi kompatibel milik sendiri.",
    "Pastikan aplikasi penerima berlangganan, bukan mengimpor.",
    "Konfirmasikan perubahan mendesak dengan penyelenggara, jangan hanya mengandalkan pembaruan.",
    "Jika alamat terungkap, ikuti panduan reset Google dan perbarui koneksi yang dimaksud."
  ],
  "faq": [
    {
      "q": "Bolehkah saya memberikan alamat rahasia kepada rekan?",
      "a": "Google menyarankan menyimpannya untuk aplikasi sendiri. Gunakan kontrol berbagi kalender dan pilih izin yang sesuai ketika orang lain membutuhkan akses."
    },
    {
      "q": "Apakah langganan mengizinkan mengedit sumber?",
      "a": "Alamat iCal rahasia Google adalah jalur melihat. Pengeditan membutuhkan koneksi akun dan izin yang sesuai; peran berbagi Cloud Calendars merupakan pengaturan terpisah."
    },
    {
      "q": "Apakah reset alamat menghapus janji lama di semua tempat?",
      "a": "Reset membatalkan alamat Google lama. Itu tidak memastikan file, janji, atau tangkapan layar yang disimpan terpisah sudah dihapus."
    }
  ],
  "sourcesHeading": "Panduan penyedia dan bacaan lanjutan",
  "sources": [
    {
      "label": "Google: koneksi akun dan alamat iCal rahasia",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    },
    {
      "label": "Google: berbagi kalender",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: impor, langganan, dan waktu pembaruan",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "taking-back-a-calendar-you-shared",
    "sharing-one-event-not-your-calendar"
  ],
  "updated": "2026-10-21"
},

  'what-guests-can-do-to-your-event': {
  "title": "Izin tamu Google Kalender: mengedit, mengundang, dan daftar tamu",
  "short": "Izin tamu pada acara",
  "description": "Periksa izin tamu dan setelan default Google. Pisahkan hak undangan dari akses kalender serta peran Reader, Writer, dan Owner Cloud Calendars.",
  "lede": "Kemampuan membalas tidak menjelaskan semua tindakan tamu. Tinjau izin acara sebelum memakai satu undangan untuk tim, klien, atau publik. Panduan ini diterbitkan oleh Arte Soft, pengembang Cloud Calendars.",
  "commonBelief": "Tamu hanya dapat menerima atau menolak, dan semua aplikasi menampilkan kontrol izin yang sama.",
  "sections": [
    {
      "heading": "Mulai dari penyelenggara dan acara asli",
      "body": [
        "Buka acara yang benar di Google Kalender dengan akun penyelenggara atau akun yang diizinkan mengelolanya. Periksa kalender, tanggal, dan penyelenggara sebelum mengubah izin. Janji yang diimpor terpisah bukan tempat andal untuk mengatur undangan asli.",
        "Untuk rapat tim, tentukan siapa boleh mengubah jadwal, mengundang orang lain, dan melihat peserta. Ini keputusan terpisah. Tamu yang perlu hadir belum tentu perlu mengelola rapat."
      ]
    },
    {
      "heading": "Tentukan apakah tamu boleh mengubah rapat",
      "body": [
        "Google mendokumentasikan opsi “Modify event” pada bagian hak tamu di editor komputer. Ini izin kolaborasi yang luas, bukan sekadar usul waktu baru. Google menjelaskan bahwa izin itu mencakup pengeditan kolom, melihat tamu, dan memesan ruangan.",
        "Rekan penyelenggara lokakarya yang dipercaya mungkin membutuhkannya, tetapi pelanggan yang datang ke janji mungkin tidak. Pilih berdasarkan tanggung jawab dan periksa acara tersimpan, bukan konfigurasi rapat lain."
      ]
    },
    {
      "heading": "Periksa undangan dan visibilitas secara terpisah",
      "body": [
        "Google membedakan izin mengundang orang lain dari izin melihat tamu lain. Periksa keduanya bersama hak edit. Mematikan satu kemampuan tidak berarti yang lain sudah diperiksa; default yang ditampilkan bukan bukti setelan acara lama.",
        "Untuk klien yang tidak saling terkait, pertimbangkan apakah satu undangan bersama cocok. Informasi dalam email, deskripsi, atau pesan terusan berada di luar kontrol daftar tamu saat ini. Jangan menaruh detail peserta rahasia di deskripsi lalu berharap daftar tersembunyi menutupinya."
      ]
    },
    {
      "heading": "Periksa default dan acara penting satu per satu",
      "body": [
        "Google juga mendokumentasikan izin tamu default dalam setelan acara, termasuk default perubahan. Jadi kontrol tidak hanya berlaku per acara. Tinjau default saat pola penjadwalan berubah, lalu periksa undangan penting yang sudah ada secara terpisah.",
        "Untuk rapat berulang, pastikan kejadian atau seri yang diedit sebelum menyimpan. Jangan menganggap perubahan preferensi menulis ulang undangan lama. Uji dengan rekan memakai contoh yang disepakati dan tidak sensitif, bukan memindahkan atau membatalkan rapat pelanggan nyata."
      ]
    },
    {
      "heading": "Pisahkan peran Cloud Calendars",
      "body": [
        "Cloud Calendars mempunyai sistem berbagi Reader, Writer, dan Owner. Reader melihat dan menyinkronkan; Writer mengedit; Owner juga mengelola berbagi dan akses dengan identitas yang diundang. Peran ini bukan sakelar untuk tiga izin tamu Google.",
        "Jika izin khusus Google penting, periksa acara asli di Google Kalender. Melihat peserta dalam Cloud Calendars tidak membuktikan semua setelan Google dapat diubah di sana. Pastikan layanan pemilik dan identitas penerima saat menelusuri kontrol hilang atau edit gagal."
      ]
    },
    {
      "heading": "Verifikasi hasil dan sampaikan tanggung jawab",
      "body": [
        "Setelah menyimpan, buka kembali acara asli dan periksa setelan. Bila sesuai, minta rekan berwenang memastikan kemampuan akunnya sendiri. Jangan bertukar kata sandi atau mengirim detail tamu pribadi sebagai jalan pintas pemeriksaan akses.",
        "Pisahkan kehadiran dari izin. Kemampuan mengedit, salinan impor, dan penerimaan tercatat adalah fakta berbeda. Bukti penerimaan berbagi Cloud Calendars bukan RSVP. Untuk rapat penting, mintalah jawaban kehadiran dan jelaskan siapa bertanggung jawab atas perubahan jadwal."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Kenali akun penyelenggara dan acara asli.",
    "Tentukan siapa mengelola, mengundang orang lain, dan melihat tamu.",
    "Periksa izin tamu sebenarnya pada acara Google.",
    "Tinjau default tanpa menganggapnya mengubah acara lama.",
    "Perlakukan peran Cloud Calendars sebagai sistem izin terpisah.",
    "Buka kembali acara tersimpan dan konfirmasikan kehadiran secara terpisah."
  ],
  "faq": [
    {
      "q": "Bisakah tamu mengubah waktu rapat saya?",
      "a": "Google mendukung pemberian izin perubahan. Periksa acara dan akses tamu; jangan menyimpulkan dari sekadar menerima undangan."
    },
    {
      "q": "Apakah semua izin tamu hanya diatur pada tiap acara?",
      "a": "Tidak. Google juga menjelaskan izin default. Periksa default untuk penjadwalan mendatang dan acara penting yang sudah ada secara langsung."
    },
    {
      "q": "Apakah menyembunyikan daftar menghapus informasi yang sudah dikirim?",
      "a": "Itu tidak membuktikan email, deskripsi, tangkapan layar, atau salinan mandiri sebelumnya telah dihapus. Tinjau informasi yang benar-benar disebarkan secara terpisah."
    }
  ],
  "sourcesHeading": "Panduan penyedia dan bacaan lanjutan",
  "sources": [
    {
      "label": "Google: kolaborasi acara dan izin tamu default",
      "url": "https://support.google.com/a/users/answer/13293412?hl=en"
    },
    {
      "label": "Google: kolom izin tamu acara",
      "url": "https://developers.google.com/workspace/calendar/api/v3/reference/events"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "sharing-one-event-not-your-calendar",
    "why-a-shared-calendar-does-not-appear"
  ],
  "updated": "2026-10-21"
},

  'google-calendars-that-never-reach-your-iphone': {
    title: 'Mengapa sebagian kalender Google tidak pernah sampai ke iPhone',
    short: 'Kalender Google hilang di iPhone',
    description:
      'Satu akun Google, beberapa kalender, dan hanya satu di ponsel. Daftar sinkronisasi yang menentukannya, dan apa yang sebaiknya dilakukan.',
    lede: 'Akun Google Anda menyimpan delapan kalender. iPhone Anda menampilkan dua. Tidak ada yang rusak: sesuatu yang belum pernah Anda lihat memilihkan untuk Anda.',
    commonBelief: 'Bahwa menambahkan akun Google ke iPhone menambahkan kalender di dalamnya.',
    sections: [
      {
        heading: 'Daftar yang tidak pernah diperlihatkan',
        body: [
          'Google menyimpan daftar per perangkat tentang kalender mana yang boleh disinkronkan, dan kalender sekunder — yang dibagikan, yang dilanggan, yang dibuat untuk sebuah proyek — sering berada di luarnya.',
          'Daftar itu bukan di pengaturan iOS. Ia hidup di halaman Google tersendiri, dan karena itu mencari di tempat yang jelas tidak menemukan yang salah dan tidak mengubah apa pun.',
        ],
      },
      {
        heading: 'Jalur yang lain',
        body: [
          'Aplikasi yang berbicara langsung dengan Google tidak memakai daftar itu, jadi ia menampilkan setiap kalender yang benar-benar dimiliki akun, termasuk yang diam-diam dijatuhkan ponsel.',
          'Itu juga menyatukan akun-akun. Satu tampilan berisi pribadi, kerja, dan yang dibagikan adalah intinya; apakah ponsel akan menyinkronkan masing-masing berhenti menjadi pertanyaan.',
        ],
      },
    ],
    claims: {
      accounts: 'Jenis akun yang disatukan satu tampilan',
      price: 'Biaya sisi Google',
    },
    faq: [
      {
        q: 'Kenapa hanya sebagian kalender Google saya muncul di iPhone?',
        a: 'Google menyimpan daftar per perangkat tentang kalender mana yang boleh disinkronkan, dan kalender sekunder — yang dibagikan, dilanggan, dibuat untuk proyek — sering berada di luarnya.',
      },
      {
        q: 'Di mana pengaturan sinkronisasi Google Kalender untuk iPhone?',
        a: 'Bukan di pengaturan iOS. Ia ada di halaman Google tersendiri, dan karena itu mencari di tempat yang jelas tidak menemukan apa pun dan tidak mengubah apa pun.',
      },
      {
        q: 'Bagaimana melihat semua kalender Google di iPhone?',
        a: 'Lewat aplikasi yang menanyai Google langsung alih-alih lewat daftar perangkat. Ia menampilkan setiap kalender yang benar-benar dimiliki akun, termasuk yang dijatuhkan ponsel.',
      },
    ],
    practical: [
      'Periksa daftar sinkronisasi Google sebelum menyimpulkan akunnya rusak.',
      'Harapkan kalender langganan dan bersama dikecualikan, bukan disertakan.',
      'Jika Anda menyimpan lebih dari dua kalender, bacalah lewat sesuatu yang menanyai Google langsung.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'icloud-google-and-outlook-in-one-view'],
  },

  'taking-back-a-calendar-you-shared': {
  "title": "Berhenti berbagi kalender: hapus akses dan periksa jalur lainnya",
  "short": "Tinjau dan hapus akses bersama",
  "description": "Bedakan akses perorangan, grup, publik, dan tautan feed saat berhenti berbagi. Periksa perubahan; salinan yang disimpan mungkin tetap ada.",
  "lede": "Mengakhiri kerja sama dimulai dengan mengenali cara akses diberikan. Menghapus seseorang, menonaktifkan publikasi, dan menyetel ulang alamat feed adalah tindakan berbeda. Panduan ini diterbitkan oleh Arte Soft, pengembang Cloud Calendars.",
  "commonBelief": "Menghapus satu penerima dianggap langsung menarik semua salinan kalender dan menutup semua jalur akses lainnya.",
  "sections": [
    {
      "heading": "Kenali kalender dan jalur berbagi",
      "body": [
        "Pastikan akun pemilik, kalender, dan audiens yang dituju sebelum mengubah akses. Kalender Google yang dibagikan kepada rekan tertentu berbeda dari kalender publik, izin grup, atau alamat langganan. Cloud Calendars juga memiliki hubungan berbagi acara dan kalender sendiri.",
        "Misalnya, sekretaris klub mendapat hak edit melalui undangan pribadi, sementara anggota mengikuti jadwal yang diterbitkan. Menghapus izin sekretaris tidak menentukan apa yang seharusnya terjadi pada langganan anggota. Catat pengaturan yang benar-benar Anda buat."
      ]
    },
    {
      "heading": "Hapus izin Google yang dimaksud",
      "body": [
        "Google mendokumentasikan kontrol terpisah untuk orang atau grup, berbagi dalam organisasi, dan akses publik. Di komputer, buka setelan berbagi kalender yang tepat lalu ubah entri atau setelan lebih luas yang terkait. Periksa akun yang masuk dan nama kalender terlebih dahulu.",
        "Seseorang mungkin masih memiliki jalur melalui grup atau publikasi lebih luas. Tinjau seluruh pengaturan alih-alih berulang kali menghapus satu alamat email. Kebijakan kantor atau sekolah dapat membatasi kontrol; gunakan proses yang disetujui pemilik atau administrator bila diperlukan."
      ]
    },
    {
      "heading": "Tangani alamat kalender rahasia secara terpisah",
      "body": [
        "Google menyatakan bahwa alamat iCal rahasia digunakan sendiri di aplikasi kalender lain dan tidak boleh diberikan kepada orang lain. Jika sudah terungkap, Google menjelaskan penyetelan ulang untuk membatalkan alamat lama. Ini berbeda dari menghapus orang tertentu.",
        "Sebelum mengganti alamat langganan yang Anda gunakan sendiri, kenali aplikasi dan alat yang bergantung padanya agar dapat menyambungkan kembali yang diperlukan. Jangan tempel URL rahasia di laporan dukungan publik atau kirim sebagai bukti menemukan kalender yang benar. Sebutkan nama kalender dan jenis koneksinya."
      ]
    },
    {
      "heading": "Bedakan penerima Cloud Calendars dari tautan feed",
      "body": [
        "Dalam Cloud Calendars, akses penerima acara atau kalender dan feed langganan yang diterbitkan merupakan mekanisme berbeda. Periksa hubungan berbagi serta tautan sebenarnya sebelum memilih tindakan. Menghapus penerima yang dikenali tidak menjamin penarikan semua URL yang pernah disebarkan atau salinan mandiri.",
        "Jika rekan penyelenggara hanya perlu berhenti mengedit, pertimbangkan peran yang tepat dan audiens tersisa daripada menghapus jadwal bersama. Jika seluruh kerja sama berakhir, tentukan pemilik dan siapa yang perlu menyimpan kalender. Keluar dari kalender yang diterima berbeda dengan menghapus kalender milik sendiri."
      ]
    },
    {
      "heading": "Verifikasi hasil tanpa menjanjikan langsung hilang",
      "body": [
        "Periksa apakah perubahan tersimpan dalam sistem pemilik. Jika rekan yang berwenang dapat membantu, konfirmasi hasil melihat atau mengedit dari akunnya sendiri tanpa berbagi kata sandi. Bedakan penolakan akses dari acara lama yang masih tampak dalam cache atau salinan impor.",
        "Jangan menjanjikan interval pembaruan universal atau tidak adanya notifikasi. Saat serah terima kelompok, beri tahu jadwal yang digunakan selanjutnya. Catatan lama yang terlihat tidak dengan sendirinya menunjukkan apakah orang itu masih punya akses langsung, izin lain, atau salinan mandiri."
      ]
    },
    {
      "heading": "Tindak lanjuti salinan sebelumnya secara terpisah",
      "body": [
        "File ekspor, tangkapan layar, pesan, dan janji yang disimpan terpisah dapat tetap ada setelah akses berubah. Tentukan salinan yang penting untuk serah terima dan bahas penanganannya dengan pihak terkait. Mengubah izin kalender tidak mengungkap apa yang sudah disimpan setiap penerima.",
        "Pertahankan catatan sumber yang diperlukan selama memeriksa hasil. Jangan pindahkan rapat sensitif ke kalender bersama lain hanya agar kalender lama tampak kosong, atau batalkan undangan nyata untuk menguji akses. Catat kalender, jalur, dan perubahan sebagai awal penelusuran masalah berikutnya."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Kenali akun pemilik, kalender, dan jalur berbagi.",
    "Tinjau orang, grup, dan publikasi lebih luas secara terpisah.",
    "Gunakan kontrol berbagi Google atau Cloud Calendars yang sesuai.",
    "Putuskan penyetelan ulang alamat feed rahasia yang terungkap secara terpisah.",
    "Verifikasi hasil akses tersimpan tanpa berbagi kredensial.",
    "Tangani ekspor atau salinan sebelumnya terpisah dari akses langsung."
  ],
  "faq": [
    {
      "q": "Apakah menghapus seseorang menonaktifkan kalender publik atau akses grupnya?",
      "a": "Jangan berasumsi demikian. Periksa setiap jalur yang nyata. Google mendokumentasikan penerima tertentu, grup, dan publikasi lebih luas sebagai setelan terpisah."
    },
    {
      "q": "Apakah kalender langsung menghilang tanpa pemberitahuan?",
      "a": "Tidak ada janji universal tentang hilangnya tampilan, notifikasi, atau waktu pembaruan. Konfirmasi perubahan tersimpan dan bedakan akses langsung dari informasi cache atau impor."
    },
    {
      "q": "Apakah Advanced memberi kemampuan menghapus akses kalender Google?",
      "a": "Advanced menghapus iklan di Cloud Calendars. Kontrol berbagi Google bergantung pada kepemilikan, izin, dan aturan organisasi, bukan paket aplikasi tersebut."
    }
  ],
  "sourcesHeading": "Panduan penyedia tentang akses dan langganan",
  "sources": [
    {
      "label": "Google: kontrol berbagi dan menghentikan akses",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Google: sinkronisasi akun dan alamat iCal rahasia",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "the-secret-address-of-a-google-calendar",
    "why-a-shared-calendar-does-not-appear"
  ],
  "updated": "2026-10-21"
},
};
