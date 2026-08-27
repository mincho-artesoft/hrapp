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
    title: 'Kalender yang sudah memuat cuaca di dalamnya',
    short: 'Cuaca di dalam kalender',
    description: 'Mengapa memeriksa dua aplikasi untuk menata satu hari adalah cacat rancangan, dan seperti apa kalender yang prakiraannya menjadi bagian tampilan alih-alih berdiri di sebelahnya.',
    lede: 'Hampir semua orang menata harinya di antara dua aplikasi. Kalender berkata di mana harus berada; aplikasi cuaca berkata bagaimana cuacanya ketika tiba. Menahan keduanya sekaligus di kepala adalah bagian yang tak seorang pun sadar sedang dilakukannya — sampai satu hari Sabtu hilang percuma.',
    commonBelief: 'Bahwa kalender untuk janji temu dan aplikasi cuaca untuk cuaca, dan memisahkan keduanya memang begitulah ponsel bekerja.',
    sections: [
      {
        heading: 'Ongkos dua aplikasi bukan dua ketukan',
        body: [
          'Berpindah tidak memakan biaya apa pun. Yang mahal adalah keduanya tak pernah sepakat tentang apa yang penting. Kalender Anda tahu bahwa Sabtu pukul sebelas ada dua jam terisi; aplikasi cuaca tahu hujan turun pukul sepuluh sampai satu. Tak satu pun tahu bahwa kedua fakta itu bersama-sama berarti blok itu harus digeser.',
          'Lapisan penggabungnya adalah Anda. Itu bekerja sampai Anda sibuk, yaitu tepat saat melindungi rencana paling berharga.',
        ],
      },
      {
        heading: 'Apa yang berubah ketika prakiraan berada di dalam kisi',
        body: [
          'Letakkan prakiraan di belakang acara, dan benturannya selesai sendiri. Pagi yang lembap dan sore yang kering terlihat dalam pandangan yang sama dengan rapat yang hendak Anda taruh, dan keputusan berhenti memakan pikiran.',
          'Ini bukan widget yang ditempel di samping. Setiap hari pada tampilan Pekan dan Bulan membawa kondisinya sendiri, dan setiap acara membawa prakiraan jam-jam yang benar-benar ditempatinya — bukan ringkasan harian, yang justru merata-ratakan bagian yang Anda butuhkan.',
        ],
      },
    ],
    claims: {
      forecastDays: 'Hari prakiraan, di kalender dan di samping setiap acara',
      views: 'Tampilan yang memuat cuaca: Hari, Pekan, Bulan, Tahun, dan Daftar',
      price: 'Biaya fitur cuaca',
    },
    practical: [
      'Lihat pita di belakang hari-hari pada tampilan Pekan sebelum menaruh apa pun di luar ruangan.',
      'Ketuk sebuah acara untuk melihat prakiraan jam-jamnya, bukan harinya.',
      'Taruh hal yang bergantung pada cuaca lebih dulu terhadap empat belas hari, lalu perhalus dua hari sebelumnya.',
      'Perlakukan apa pun setelah hari ketujuh sebagai bentuk, bukan rencana.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'what-a-subscription-actually-buys'],
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
    title: 'Berbagi satu acara, bukan kalender Anda',
    short: 'Berbagi satu acara',
    description: 'Bagaimana mengirim satu acara bekerja, apa yang sebenarnya diterima pihak lain, dan mengapa ia tidak perlu memasang apa pun untuk melihatnya.',
    lede: 'Berbagi kalender biasanya semua atau tidak sama sekali: entah seseorang punya akses ke milik Anda atau tidak. Mengirim undangan makan malam semestinya tidak menuntut keduanya.',
    commonBelief: 'Bahwa berbagi satu acara berarti memberi seseorang jendela ke sisa pekan Anda.',
    sections: [
      {
        heading: 'Apa yang sebenarnya dikirim',
        body: [
          'Ketika Anda membuat acara, aplikasi menawarkan untuk membagikannya. Yang berjalan adalah sebuah tautan — lewat surel, lewat pesan, lewat apa pun yang dimiliki penerimanya — dan di balik tautan itu ada umpan kalender yang berisi acara tersebut dan tidak ada yang lain.',
          'Ini bukan tangkapan layar dan bukan salinan yang menjadi usang. Kalau waktunya berubah, umpannya berubah bersamanya, dan orang yang Anda kirimi melihat perubahan itu tanpa Anda mengirim ulang apa pun.',
        ],
      },
      {
        heading: 'Apa yang bukan',
        body: [
          'Tautannya adalah langganan kalender biasa: dibaca Kalender Apple, dibaca Google Kalender, dibaca Outlook. Dalam pesan itu juga ada App Clip bagi yang memang menginginkan aplikasinya — terbuka tanpa pemasangan. Itu pintu, bukan gerbang tol.',
          'Ini tidak seketika: umpan meminta aplikasi memeriksa lagi tiap jam, dan itu permintaan, bukan aturan. Ini juga bukan rahasia: tautannya membawa dua puluh dua karakter acak yang tak akan ditebak siapa pun, tetapi siapa pun yang memilikinya bisa membaca. Dan untuk sekarang ini hanya-baca.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Jam antara permintaan penyegaran umpan',
      linkLength: 'Karakter acak dalam tautan — itulah yang membuatnya tak tertebak',
      sharePrice: 'Biaya berbagi',
    },
    practical: [
      'Bagikan dari acaranya sendiri, tepat setelah membuatnya.',
      'Kirim tautan lewat saluran yang sudah Anda pakai dengan orang itu.',
      'Kalau waktunya berubah mendadak, tulis pesan juga, jangan hanya menggeser acaranya.',
      'Cabut tautannya setelah acara lewat, seperti Anda berhenti membagikan sebuah dokumen.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'weather-inside-your-calendar'],
  },

  'what-a-subscription-actually-buys': {
    title: 'Apa yang sebenarnya dibeli sebuah langganan',
    short: 'Apa yang dibeli langganan',
    description: 'Dua tingkat berbayar, apa yang memisahkannya, dan bagaimana tahu yang mana — kalau ada — yang milik Anda.',
    lede: 'Dua tingkat sudah cukup membingungkan kalau tidak ada yang berterus terang apa yang memisahkannya. Yang memisahkannya adalah Microsoft.',
    commonBelief: 'Bahwa tingkat yang lebih tinggi adalah fitur yang sama, hanya lebih banyak.',
    sections: [
      {
        heading: 'Tingkat pertama menghapus iklan',
        body: [
          'Ia juga menambahkan pengelolaan acara lintas kalender iCloud dan Google, izin berbagi Google, tautan Meet otomatis, dan penyegaran cuaca yang lebih cepat. Tetapi orang membelinya karena iklan.',
          'Pada harga ini kira-kira setara satu kopi setahun, dan inilah tingkat yang cocok untuk hampir siapa pun yang bersedia membayar sesuatu.',
        ],
      },
      {
        heading: 'Tingkat kedua untuk Microsoft',
        body: [
          'Sinkronisasi Outlook dan Exchange, tautan Teams, pengelolaan lintas akun termasuk kantor, pengelolaan peserta. Harganya satu orde besaran lebih tinggi karena sambungannya pun begitu.',
          'Kalau kalender kerja Anda tidak di Microsoft, tidak ada apa pun di sini untuk Anda. Kedua tingkat lebih murah per tahun; penghematannya terukur, bukan dramatis. Setelah dibatalkan Anda kembali ke tingkat gratis dan kalender Anda utuh, karena acara-acara itu tidak pernah milik kami.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Tingkat pertama, per bulan, dalam dolar',
      advancedYearly: 'Tingkat pertama, per tahun, dalam dolar',
      premiumMonthly: 'Tingkat kedua, per bulan, dalam dolar',
      premiumYearly: 'Tingkat kedua, per tahun, dalam dolar',
    },
    practical: [
      'Beli tingkat pertama untuk menghapus iklan, bukan untuk membuka kalender.',
      'Beli yang kedua hanya kalau pekerjaan Anda hidup di Microsoft.',
      'Pindah ke tahunan begitu Anda yakin; penghematannya nyata tetapi kecil.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view'],
  },
};
