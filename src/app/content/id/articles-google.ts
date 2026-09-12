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
    practical: [
      'Gunakan sibuk/luang sebagai bawaan untuk siapa pun yang hanya perlu memesan waktu dengan Anda.',
      'Simpan «membuat perubahan» untuk mereka yang benar-benar menjadwalkan untuk Anda.',
      'Tinjau siapa saja yang punya akses dua kali setahun; berbagi menumpuk dan tidak ada yang mengingatkan.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'what-guests-can-do-to-your-event'],
  },

  'why-a-shared-calendar-does-not-appear': {
    title: 'Sebuah kalender dibagikan kepada Anda dan tidak ada di sana',
    short: 'Kalender bersama tidak muncul',
    description:
      'Seseorang membagikan kalender, Anda menerimanya, dan tidak ada yang berubah. Empat alasan biasa, dalam urutan yang layak diperiksa.',
    lede: 'Undangannya datang, tautannya ditekan, dan kalendernya tetap tidak ada. Hampir selalu satu dari empat hal, dan tidak satu pun karena berbagi rusak.',
    commonBelief: 'Bahwa menerima kalender bersama menaruhnya di ponsel Anda.',
    sections: [
      {
        heading: 'Menerima menambahkannya ke akun, bukan ke perangkat',
        body: [
          'Sebuah berbagi mendarat di akun Google yang dituju. Jika Anda menerimanya saat masuk dengan satu akun sementara ponsel membawa akun lain, kalender itu aman persis di tempat yang tidak Anda lihat.',
          'Bahkan di akun yang benar, kalender yang baru ditambahkan lebih sering tiba dalam keadaan mati di perangkat lain. Ia ada, hanya tidak dicentang — dan kalender yang tidak dicentang tampak persis seperti yang hilang.',
        ],
      },
      {
        heading: 'Dua alasan lainnya',
        body: [
          'Berbagi ke milis atau alamat grup jarang sampai ke perorangan; yang dibutuhkan adalah alamat yang benar-benar akun Google. Dan kalender yang dibagikan sebagai tautan adalah langganan: ia jatuh di bagian lain daftar dan menyegarkan mengikuti irama penerbit, bukan seketika.',
          'Di iPhone, kalender Google sampai ke aplikasi bawaan lewat daftar sinkronisasi tersendiri, dan kalender sekunder berada di luar daftar itu secara bawaan. Karena itu satu akun menampilkan kalender utamanya dan diam-diam menjatuhkan empat yang penting.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Jam antara permintaan penyegaran dari umpan langganan',
      accounts: 'Jenis akun yang disatukan satu tampilan tanpa semua ini',
    },
    practical: [
      'Periksa akun mana yang menerima berbagi sebelum memeriksa hal lain.',
      'Buka daftar kalender di perangkat dan cari dalam keadaan mati, bukan hilang.',
      'Jika datang sebagai tautan, harapkan jeda, bukan kemunculan seketika.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'google-calendars-that-never-reach-your-iphone'],
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
    practical: [
      'Baca daftar akses selengkapnya, bukan hanya nama yang hendak Anda keluarkan.',
      'Atur ulang alamat rahasia jika orang itu pernah memilikinya.',
      'Anggap salinan tetap ada: pindahkan yang benar-benar sensitif alih-alih menyembunyikannya.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
