import { LocalisedArticle } from '../types';

/** Enam artikel Google: pertanyaan spesifik, jawaban lugas. */
export const GOOGLE_ID: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
    title: 'Siapa melihat apa saat Anda membagikan kalender Google',
    short: 'Izin berbagi Google',
    description:
      'Tingkat berbagi Google mudah diatur dan mudah disalahpahami. Apa yang sebenarnya dibuka masing-masing, dengan bahasa sederhana.',
    lede: 'Hampir semua kelebihan berbagi bukan salah menilai. Seseorang memilih tingkat yang terdengar sederhana padahal tidak.',
    commonBelief: 'Bahwa «hanya sibuk/luang» dan «semua detail acara» hanya berbeda sedikit.',
    sections: [
      {
        heading: 'Jarak antar tingkat lebih jauh daripada kedengarannya',
        body: [
          'Sibuk/luang menampilkan blok waktu tanpa judul. Semua detail menampilkan judul, lokasi, catatan, dan tamu — bagi sebagian besar kalender, itu bagian besar dari hidup Anda.',
          'Membuat perubahan memberi hak menyunting. Mengelola berbagi memberi hak menyerahkan kalender Anda kepada orang lain, dan inilah yang mengejutkan di kemudian hari.',
        ],
      },
      {
        heading: 'Memilih tanpa memikirkannya setiap kali',
        body: [
          'Untuk rekan kerja yang hanya perlu mengatur jadwal di sekitar Anda, sibuk/luang hampir selalu jawaban yang benar dan hampir tidak pernah dipilih.',
          'Simpan detail lengkap untuk kalender yang memang dibuat untuk dibagikan, bukan untuk kalender tempat Anda hidup.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Biaya bulanan tingkat tempat ini dikelola di aplikasi, dalam dolar',
    },
    faq: [
      {
        q: 'Apakah judul acara saya terlihat kalau hanya berbagi sibuk/luang?',
        a: 'Tidak. Sibuk/luang menampilkan blok waktu tanpa judul, lokasi, catatan, atau tamu. Hanya «semua detail» yang membukanya — dan membuka semuanya.',
      },
      {
        q: 'Apa yang diizinkan «membuat perubahan dan mengelola berbagi»?',
        a: 'Menyunting setiap acara dan menyerahkan kalender Anda kepada orang lain tanpa bertanya. Itu satu-satunya tingkat di mana orang lain membagikan akses.',
      },
      {
        q: 'Bisakah saya melihat siapa saja yang sudah punya akses?',
        a: 'Bisa, di pengaturan berbagi kalender itu. Tidak ada yang mengingatkan Anda untuk melihat dan berbagi hanya menumpuk: baca daftarnya dua kali setahun.',
      },
    ],
    practical: [
      'Gunakan sibuk/luang sebagai bawaan untuk siapa pun yang hanya perlu memesan waktu dengan Anda.',
      'Simpan «membuat perubahan» untuk mereka yang benar-benar menjadwalkan untuk Anda.',
      'Tinjau siapa saja yang punya akses dua kali setahun; berbagi menumpuk dan tidak ada yang mengingatkan.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'what-guests-can-do-to-your-event'],
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
    title: 'Apa yang sebenarnya dibocorkan alamat rahasia kalender Google',
    short: 'Alamat iCal rahasia',
    description:
      'Google menyediakan alamat pribadi yang memperlihatkan seluruh kalender Anda kepada siapa pun yang memegangnya. Apa yang dibukanya dan mengapa ia tidak bisa ditarik diam-diam.',
    lede: 'Terkubur di pengaturan setiap kalender Google ada tautan yang memperlihatkan semua isinya. Tanpa masuk, tanpa izin, tanpa catatan siapa yang membukanya.',
    commonBelief: 'Bahwa alamat pribadi bersifat pribadi karena sulit ditemukan.',
    sections: [
      {
        heading: 'Tautan adalah kata sandi yang tidak bisa diganti untuk satu orang',
        body: [
          'Alamat rahasia membawa detail lengkap — judul, waktu, lokasi, catatan. Siapa pun yang memegang tautan melihatnya, dan tidak ada daftar siapa saja mereka.',
          'Satu-satunya pelindungnya adalah bagian acak dari alamat itu. Terhadap tebakan itu benar-benar melindungi, dan sama sekali tidak terhadap penerusan, layar yang dibagikan, atau dokumen yang berumur lebih panjang dari pekerjaan.',
        ],
      },
      {
        heading: 'Mengatur ulang merusaknya untuk semua orang',
        body: [
          'Anda bisa mengatur ulang alamatnya, dan yang lama mati. Ia juga mati untuk setiap rekan kerja, setiap dasbor, dan setiap skrip yang diam-diam bersandar padanya, tanpa peringatan sedikit pun.',
          'Itulah alasan untuk tidak pernah membagikan alamat kalender tempat Anda hidup. Terbitkan kalender yang dibuat untuk itu, dan mengatur ulang tidak merugikan siapa pun.',
        ],
      },
    ],
    claims: {
      linkLength: 'Karakter acak yang melindungi tautan berbagi milik kami',
      sharePrice: 'Biaya membagikan satu acara dari aplikasi',
    },
    faq: [
      {
        q: 'Apa yang bisa dilakukan orang dengan alamat rahasia kalender saya?',
        a: 'Melihat semua isinya — judul, waktu, lokasi, dan catatan — tanpa masuk, tanpa izin, dan tanpa meninggalkan catatan bahwa ia melihat.',
      },
      {
        q: 'Bisakah saya menarik kembali alamat rahasia kalender?',
        a: 'Hanya dengan mengatur ulangnya, dan itu mematikan yang lama untuk semua orang sekaligus: rekan kerja, dasbor, dan setiap skrip yang diam-diam bersandar padanya, tanpa peringatan.',
      },
      {
        q: 'Bolehkah saya mengirim alamat rahasia ke rekan lewat email?',
        a: 'Anggap publik sejak ia lepas dari tangan Anda. Satu-satunya pelindungnya adalah sulit ditebak, dan meneruskannya justru meniadakan itu.',
      },
    ],
    practical: [
      'Anggap alamat rahasia sebagai publik begitu ia lepas dari tangan Anda.',
      'Jangan pernah menerbitkan alamat kalender yang benar-benar Anda pakai.',
      'Atur ulang saat seseorang pergi, dan beri tahu mereka yang aksesnya akan putus.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'taking-back-a-calendar-you-shared'],
  },

  'what-guests-can-do-to-your-event': {
    title: 'Apa yang bisa dilakukan tamu terhadap acara Anda',
    short: 'Izin tamu',
    description:
      'Tiga kotak centang menentukan apakah tamu bisa memindahkan rapat Anda, mengundang orang asing, atau membaca seluruh daftar. Kotak-kotak itu aktif lebih sering daripada dugaan orang.',
    lede: 'Mengundang seseorang memberi lebih dari tempat dan waktu. Pada acara Google biasa, tamu umumnya melihat siapa lagi yang diundang, dan sering boleh menambah.',
    commonBelief: 'Bahwa tamu hanya bisa menerima atau menolak.',
    sections: [
      {
        heading: 'Tiga kotak itu',
        body: [
          'Ubah acara membiarkan tamu mengganti waktu, tempat, dan judul untuk semua orang. Jarang diinginkan, mudah dibiarkan aktif.',
          'Undang orang lain membiarkannya menambah orang yang tidak pernah Anda temui. Lihat daftar tamu menampilkan semua yang diundang beserta jawabannya — tidak masalah di tim, canggung dengan klien, keliru pada apa pun yang menyerupai sekelompok pelanggan terpisah.',
        ],
      },
      {
        heading: 'Di mana ini diam-diam salah',
        body: [
          'Satu acara, banyak penerima perorangan, daftar terlihat: kini semua orang memiliki semua orang. Mematikan satu kotak itu adalah beda antara rapat dan buku alamat yang bocor.',
          'Pengaturannya hidup di acara, bukan di akun, jadi ia kembali ke bawaan Anda setiap kali dan harus dipikirkan pada acara yang penting, bukan sekali untuk selamanya.',
        ],
      },
    ],
    claims: {
      sharePrice: 'Biaya mengirim satu acara dari aplikasi',
    },
    faq: [
      {
        q: 'Apakah tamu saling melihat pada undangan Google Kalender?',
        a: 'Secara bawaan biasanya ya. «Lihat daftar tamu» menampilkan semua yang diundang beserta jawabannya: tidak masalah dalam tim, canggung dengan klien, dan keliru bila tamunya pelanggan yang terpisah.',
      },
      {
        q: 'Bisakah tamu mengubah jam rapat saya?',
        a: 'Kalau «ubah acara» dicentang, bisa, dan perubahannya berlaku untuk semua orang. Jarang diinginkan dan mudah dibiarkan aktif.',
      },
      {
        q: 'Bagaimana mencegah tamu mengundang orang lain?',
        a: 'Matikan «undang orang lain» pada acara itu sendiri. Pengaturan ini milik acara, bukan akun, jadi kembali ke bawaan Anda setiap kali.',
      },
    ],
    practical: [
      'Matikan «lihat daftar tamu» untuk apa pun yang dikirim ke orang yang tidak saling kenal.',
      'Biarkan «ubah acara» mati kecuali ada yang benar-benar menjadwalkan untuk Anda.',
      'Periksa kotaknya di acara, bukan di pengaturan: di situlah tempatnya.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'why-a-shared-calendar-does-not-appear'],
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
    title: 'Menarik kembali kalender yang Anda bagikan',
    short: 'Mencabut akses',
    description:
      'Mengeluarkan seseorang dari kalender menghentikan apa yang terjadi selanjutnya. Yang tidak dilakukannya adalah membatalkan yang sudah terjadi.',
    lede: 'Mengakhiri akses cukup satu ketukan. Memutuskan apakah satu ketukan sudah cukup memakan waktu sedikit lebih lama, karena berbagi meninggalkan salinan.',
    commonBelief: 'Bahwa mengeluarkan seseorang menghapus apa yang sudah dilihatnya.',
    sections: [
      {
        heading: 'Apa yang berhenti dan apa yang tinggal',
        body: [
          'Keluarkan seseorang dan kalender lenyap dari daftarnya, seketika dan tanpa pesan. Acara mendatang tidak pernah sampai padanya.',
          'Yang tidak kembali: undangan yang sudah dipegangnya, acara yang disalin ke kalendernya sendiri, apa pun yang diekspor, dan semua yang sempat diberi alamat rahasia. Akses berakhir; ingatan tidak.',
        ],
      },
      {
        heading: 'Yang bertahan setelah pencabutan',
        body: [
          'Jika seseorang pernah diberi hak mengelola berbagi, ia mungkin telah menambahkan orang lain. Mengeluarkan dia membiarkan mereka tetap ada — begitulah sebuah kalender berakhir dibagikan kepada orang yang tak seorang pun ingat pernah mengundangnya.',
          'Jadi bacalah seluruh daftar alih-alih menghapus satu nama, dan lakukan saat kepergian, bukan berbulan-bulan kemudian. Tidak ada yang mengingatkan, dan berbagi hanya menumpuk.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Biaya bulanan tingkat tempat ini dikelola, dalam dolar',
    },
    faq: [
      {
        q: 'Apakah mengeluarkan seseorang menghapus yang sudah dilihatnya?',
        a: 'Tidak. Undangan yang sudah dipegangnya, acara yang disalin ke kalendernya sendiri, dan apa pun yang diekspor tetap ada. Akses berakhir; salinan tidak.',
      },
      {
        q: 'Apakah orang itu diberi tahu bahwa saya mencabut aksesnya?',
        a: 'Tidak. Kalender lenyap dari daftarnya seketika dan tanpa pesan.',
      },
      {
        q: 'Kenapa kalender saya masih dibagikan ke orang yang tak pernah saya undang?',
        a: 'Seseorang yang berhak mengelola berbagi menambahkannya. Mengeluarkan orang itu membiarkan semua yang ia tambahkan tetap ada — karena itu dibaca seluruh daftarnya, bukan satu nama.',
      },
    ],
    practical: [
      'Baca daftar akses selengkapnya, bukan hanya nama yang hendak Anda keluarkan.',
      'Atur ulang alamat rahasia jika orang itu pernah memilikinya.',
      'Anggap salinan tetap ada: pindahkan yang benar-benar sensitif alih-alih menyembunyikannya.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
