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
    title: 'Kalendar yang sudah mengandungi cuaca',
    short: 'Cuaca di dalam kalendar',
    description: 'Mengapa memeriksa dua aplikasi untuk menyusun satu hari ialah kecacatan reka bentuk, dan bagaimana rupanya kalendar yang ramalannya menjadi sebahagian daripada paparan dan bukan berdiri di sebelahnya.',
    lede: 'Hampir semua orang menyusun harinya antara dua aplikasi. Kalendar memberitahu di mana perlu berada; aplikasi cuaca memberitahu bagaimana cuacanya apabila sampai. Memegang kedua-duanya serentak di kepala ialah bahagian yang tiada siapa sedar sedang dibuatnya — sehingga satu hari Sabtu hilang begitu sahaja.',
    commonBelief: 'Bahawa kalendar untuk temu janji dan aplikasi cuaca untuk cuaca, dan mengasingkan kedua-duanya memang begitulah telefon berfungsi.',
    sections: [
      {
        heading: 'Kos dua aplikasi bukan dua ketikan',
        body: [
          'Bertukar tidak menelan apa-apa kos. Yang mahal ialah kedua-duanya tidak pernah bersetuju tentang apa yang penting. Kalendar anda tahu bahawa pada Sabtu jam sebelas dua jam telah terisi; aplikasi cuaca tahu hujan turun dari pukul sepuluh hingga satu. Tiada satu pun tahu bahawa kedua-dua fakta itu bersama-sama bermakna blok itu perlu dialihkan.',
          'Lapisan penyatuannya ialah anda. Ia berjalan sehingga anda sibuk, iaitu tepat ketika melindungi rancangan paling bernilai.',
        ],
      },
      {
        heading: 'Apa yang berubah apabila ramalan berada dalam grid',
        body: [
          'Letakkan ramalan di belakang acara, dan pertembungan itu selesai dengan sendirinya. Pagi yang lembap dan petang yang kering kelihatan dalam pandangan yang sama dengan mesyuarat yang hendak anda letakkan, dan keputusan berhenti memakan fikiran.',
          'Ini bukan widget yang dilekatkan di tepi. Setiap hari dalam paparan Minggu dan Bulan membawa keadaannya sendiri, dan setiap acara membawa ramalan jam-jam yang benar-benar didudukinya — bukan ringkasan harian, yang justeru mempuratakan bahagian yang anda perlukan.',
        ],
      },
    ],
    claims: {
      forecastDays: 'Hari ramalan, dalam kalendar dan di sebelah setiap acara',
      views: 'Paparan yang membawa cuaca: Hari, Minggu, Bulan, Tahun dan Senarai',
      price: 'Kos ciri-ciri cuaca',
    },
    practical: [
      'Lihat jalur di belakang hari-hari dalam paparan Minggu sebelum meletakkan apa-apa di luar.',
      'Ketik sesuatu acara untuk melihat ramalan jam-jamnya, bukan harinya.',
      'Letakkan perkara yang bergantung pada cuaca dahulu terhadap empat belas hari, kemudian perhalusi dua hari sebelumnya.',
      'Anggap apa-apa selepas hari ketujuh sebagai bentuk, bukan rancangan.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'what-a-subscription-actually-buys'],
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
    title: 'Kongsi satu acara, bukan kalendar anda',
    short: 'Kongsi satu acara',
    description: 'Bagaimana menghantar satu acara berfungsi, apa yang sebenarnya diterima pihak sana, dan mengapa dia tidak perlu memasang apa-apa untuk melihatnya.',
    lede: 'Berkongsi kalendar biasanya semua atau tiada langsung: sama ada seseorang mempunyai akses kepada milik anda atau tidak. Menghantar jemputan makan malam sepatutnya tidak menuntut kedua-duanya.',
    commonBelief: 'Bahawa berkongsi satu acara bermakna memberi seseorang tingkap ke seluruh minggu anda.',
    sections: [
      {
        heading: 'Apa yang sebenarnya dihantar',
        body: [
          'Semasa anda mencipta acara, aplikasi menawarkan untuk mengongsikannya. Yang bergerak ialah satu pautan — melalui e-mel, mesej, apa sahaja yang ada pada penerima — dan di sebalik pautan itu terdapat suapan kalendar yang mengandungi acara tersebut dan tiada yang lain.',
          'Ia bukan tangkapan skrin dan bukan salinan yang menjadi lapuk. Jika waktunya berubah, suapan berubah bersamanya, dan orang yang anda hantar melihat perubahan itu tanpa anda menghantar semula apa-apa.',
        ],
      },
      {
        heading: 'Apa yang bukan',
        body: [
          'Pautan itu ialah langganan kalendar biasa: dibaca oleh Kalendar Apple, dibaca oleh Google Kalendar, dibaca oleh Outlook. Dalam mesej itu turut disertakan App Clip bagi sesiapa yang memang mahukan aplikasinya — ia terbuka tanpa pemasangan. Itu pintu, bukan pintu tol.',
          'Ia tidak serta-merta: suapan meminta aplikasi menyemak semula setiap jam, dan itu permintaan, bukan peraturan. Ia juga bukan rahsia: pautan membawa dua puluh dua aksara rawak yang tidak akan diteka sesiapa, tetapi sesiapa yang memilikinya boleh membaca. Dan buat masa ini ia baca sahaja.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Jam antara permintaan menyegarkan suapan',
      linkLength: 'Aksara rawak dalam pautan — itulah yang menjadikannya tidak dapat diteka',
      sharePrice: 'Kos perkongsian',
    },
    practical: [
      'Kongsikan daripada acara itu sendiri, sebaik sahaja anda menciptanya.',
      'Hantar pautan melalui saluran yang anda sudah gunakan dengan orang itu.',
      'Jika waktunya berubah pada saat akhir, tulis mesej juga, bukan sekadar mengalihkan acara.',
      'Batalkan pautan apabila acara sudah berlalu, seperti anda berhenti berkongsi sesuatu dokumen.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'weather-inside-your-calendar'],
  },

  'what-a-subscription-actually-buys': {
    title: 'Apa yang sebenarnya dibeli oleh langganan',
    short: 'Apa yang dibeli langganan',
    description: 'Dua peringkat berbayar, apa yang memisahkannya, dan bagaimana anda tahu yang mana — jika ada — milik anda.',
    lede: 'Dua peringkat sudah memadai untuk mengelirukan jika tiada siapa berterus terang apa yang memisahkannya. Yang memisahkannya ialah Microsoft.',
    commonBelief: 'Bahawa peringkat yang lebih tinggi ialah ciri yang sama, cuma lebih banyak.',
    sections: [
      {
        heading: 'Peringkat pertama membuang iklan',
        body: [
          'Ia turut menambah pengurusan acara merentas kalendar iCloud dan Google, kebenaran perkongsian Google, pautan Meet automatik dan penyegaran cuaca yang lebih pantas. Tetapi orang membelinya kerana iklan.',
          'Pada harga ini ia lebih kurang secawan kopi setahun, dan inilah peringkat yang sesuai untuk hampir sesiapa sahaja yang sanggup membayar sesuatu.',
        ],
      },
      {
        heading: 'Peringkat kedua untuk Microsoft',
        body: [
          'Penyegerakan Outlook dan Exchange, pautan Teams, pengurusan merentas akaun termasuk kerja, pengurusan peserta. Harganya satu orde magnitud lebih tinggi kerana sambungannya pun begitu.',
          'Jika kalendar kerja anda bukan di Microsoft, tiada apa-apa di sini untuk anda. Kedua-dua peringkat lebih murah setahun; penjimatannya sederhana, bukan dramatik. Selepas dibatalkan anda kembali ke peringkat percuma dan kalendar anda utuh, kerana acara-acara itu tidak pernah menjadi milik kami.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Peringkat pertama, sebulan, dalam dolar',
      advancedYearly: 'Peringkat pertama, setahun, dalam dolar',
      premiumMonthly: 'Peringkat kedua, sebulan, dalam dolar',
      premiumYearly: 'Peringkat kedua, setahun, dalam dolar',
    },
    practical: [
      'Beli peringkat pertama untuk membuang iklan, bukan untuk membuka kalendar.',
      'Beli yang kedua hanya jika kerja anda hidup di Microsoft.',
      'Beralih ke tahunan apabila anda yakin; penjimatannya nyata tetapi kecil.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view'],
  },
};
