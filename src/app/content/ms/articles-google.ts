import { LocalisedArticle } from '../types';

/** Enam artikel Google: soalan khusus, jawapan terus. */
export const GOOGLE_MS: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
    title: 'Siapa nampak apa apabila anda berkongsi kalendar Google',
    short: 'Kebenaran perkongsian Google',
    description:
      'Tahap perkongsian Google cepat ditetapkan dan mudah disalah faham. Apa yang sebenarnya didedahkan oleh setiap satu, secara terus terang.',
    lede: 'Hampir semua perkongsian berlebihan bukanlah salah pertimbangan. Seseorang memilih tahap yang kedengaran sederhana tetapi sebenarnya tidak.',
    commonBelief: 'Bahawa «lihat sibuk/lapang sahaja» dan «lihat semua butiran» berbeza sedikit sahaja.',
    sections: [
      {
        heading: 'Jurang antara tahap lebih besar daripada bunyinya',
        body: [
          'Sibuk/lapang menunjukkan blok masa tanpa tajuk. Semua butiran menunjukkan tajuk, lokasi, nota dan tetamu — bagi kebanyakan kalendar, itu sebahagian besar kehidupan anda.',
          'Buat perubahan membenarkan penyuntingan. Urus perkongsian membenarkan seseorang menyerahkan kalendar anda kepada orang lain, dan itulah yang mengejutkan kemudian hari.',
        ],
      },
      {
        heading: 'Memilih tanpa berfikir setiap kali',
        body: [
          'Bagi rakan sekerja yang hanya perlu menyusun masa di sekeliling anda, sibuk/lapang hampir selalu jawapan yang betul dan hampir tidak pernah dipilih.',
          'Simpan butiran penuh untuk kalendar yang memang dibuat untuk dikongsi, bukan kalendar tempat anda hidup.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Kos bulanan tahap tempat ini diurus dalam aplikasi, dalam dolar',
    },
    practical: [
      'Jadikan sibuk/lapang lalai untuk sesiapa yang hanya perlu menempah masa dengan anda.',
      'Simpan «buat perubahan» untuk mereka yang benar-benar menjadualkan bagi pihak anda.',
      'Semak siapa yang ada akses dua kali setahun; perkongsian bertimbun dan tiada apa yang mengingatkan.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'what-guests-can-do-to-your-event'],
  },

  'why-a-shared-calendar-does-not-appear': {
    title: 'Kalendar dikongsi dengan anda dan ia tiada',
    short: 'Kalendar kongsi tidak muncul',
    description:
      'Seseorang berkongsi kalendar, anda menerimanya, dan tiada apa yang berubah. Empat sebab biasa, mengikut susunan yang berbaloi disemak.',
    lede: 'Jemputan sampai, pautan ditekan, dan kalendar masih tiada. Hampir selalu ia salah satu daripada empat perkara, dan tiada satu pun kerana perkongsian rosak.',
    commonBelief: 'Bahawa menerima kalendar kongsi meletakkannya pada telefon anda.',
    sections: [
      {
        heading: 'Menerima menambahkannya pada akaun, bukan pada peranti',
        body: [
          'Perkongsian mendarat dalam akaun Google yang dituju. Jika anda menerimanya sambil log masuk dengan satu akaun sedangkan telefon membawa akaun lain, kalendar itu selamat berada tepat di tempat yang anda tidak pandang.',
          'Walaupun dalam akaun yang betul, kalendar yang baru ditambah lebih kerap tiba dalam keadaan dimatikan pada peranti lain. Ia wujud, cuma tidak ditandakan — dan kalendar yang tidak ditandakan kelihatan sama seperti yang hilang.',
        ],
      },
      {
        heading: 'Dua sebab yang lain',
        body: [
          'Perkongsian kepada senarai mel atau alamat kumpulan jarang sampai kepada individu; yang diperlukan ialah alamat yang benar-benar akaun Google. Dan kalendar yang dikongsi sebagai pautan ialah langganan: ia jatuh di bahagian lain senarai dan disegarkan mengikut rentak penerbit, bukan serta-merta.',
          'Pada iPhone, kalendar Google sampai ke aplikasi terbina melalui senarai penyegerakan tersendiri, dan kalendar sekunder berada di luar senarai itu secara lalai. Sebab itulah satu akaun menunjukkan kalendar utamanya dan senyap-senyap menggugurkan empat yang penting.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Jam antara permintaan penyegaran oleh suapan langganan',
      accounts: 'Jenis akaun yang disatukan oleh satu paparan tanpa semua ini',
    },
    practical: [
      'Semak akaun mana yang menerima perkongsian sebelum menyemak perkara lain.',
      'Buka senarai kalendar pada peranti dan cari dalam keadaan dimatikan, bukan tiada.',
      'Jika ia datang sebagai pautan, jangkakan kelewatan dan bukan kemunculan serta-merta.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'google-calendars-that-never-reach-your-iphone'],
  },

  'the-secret-address-of-a-google-calendar': {
    title: 'Apa yang sebenarnya didedahkan alamat rahsia kalendar Google',
    short: 'Alamat iCal rahsia',
    description:
      'Google menawarkan alamat peribadi yang menunjukkan seluruh kalendar anda kepada sesiapa yang memegangnya. Apa yang didedahkan dan mengapa ia tidak boleh ditarik balik secara senyap.',
    lede: 'Tersembunyi dalam tetapan setiap kalendar Google ada pautan yang menunjukkan segala isinya. Tanpa log masuk, tanpa kebenaran, tanpa rekod siapa yang membukanya.',
    commonBelief: 'Bahawa alamat peribadi bersifat peribadi kerana sukar dicari.',
    sections: [
      {
        heading: 'Pautan ialah kata laluan yang tidak boleh ditukar untuk seorang sahaja',
        body: [
          'Alamat rahsia membawa butiran penuh — tajuk, waktu, lokasi, nota. Sesiapa yang memegang pautan itu melihatnya, dan tiada senarai siapa mereka.',
          'Satu-satunya perlindungannya ialah bahagian rawak alamat itu. Terhadap tekaan ia benar-benar melindungi; terhadap pemanjangan mesej, skrin yang dikongsi atau dokumen yang hidup lebih lama daripada pekerjaan, tidak sama sekali.',
        ],
      },
      {
        heading: 'Menetapkan semula merosakkannya untuk semua',
        body: [
          'Anda boleh menetapkan semula alamat itu, dan yang lama mati. Ia juga mati untuk setiap rakan sekerja, setiap papan pemuka dan setiap skrip yang diam-diam bersandar padanya, tanpa amaran kepada sesiapa.',
          'Itulah hujah untuk tidak pernah mengedarkan alamat kalendar tempat anda hidup. Terbitkan kalendar yang dibuat khusus, dan penetapan semula tidak merugikan apa-apa.',
        ],
      },
    ],
    claims: {
      linkLength: 'Aksara rawak yang melindungi pautan perkongsian kami',
      sharePrice: 'Kos berkongsi satu acara dari aplikasi',
    },
    practical: [
      'Anggap alamat rahsia sebagai awam sebaik ia keluar dari tangan anda.',
      'Jangan sekali-kali menerbitkan alamat kalendar yang anda benar-benar guna.',
      'Tetapkan semula apabila seseorang berhenti, dan beritahu mereka yang aksesnya akan terputus.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'taking-back-a-calendar-you-shared'],
  },

  'what-guests-can-do-to-your-event': {
    title: 'Apa yang tetamu boleh lakukan pada acara anda',
    short: 'Kebenaran tetamu',
    description:
      'Tiga kotak menentukan sama ada tetamu boleh memindahkan mesyuarat anda, menjemput orang asing, atau membaca seluruh senarai. Ia dihidupkan lebih kerap daripada yang disangka.',
    lede: 'Menjemput seseorang memberi lebih daripada tempat dan waktu. Dalam acara Google biasa, tetamu lazimnya nampak siapa lagi yang dijemput, dan selalunya boleh menambah.',
    commonBelief: 'Bahawa tetamu hanya boleh menerima atau menolak.',
    sections: [
      {
        heading: 'Tiga kotak itu',
        body: [
          'Ubah acara membolehkan tetamu menukar waktu, tempat dan tajuk untuk semua orang. Jarang dikehendaki, mudah dibiarkan hidup.',
          'Jemput orang lain membolehkannya menambah orang yang anda tidak pernah temui. Lihat senarai tetamu menunjukkan semua yang dijemput dan jawapan mereka — tidak mengapa dalam pasukan, janggal dengan pelanggan, salah bagi apa-apa yang menyerupai kumpulan pelanggan berasingan.',
        ],
      },
      {
        heading: 'Di mana ia tersasar secara senyap',
        body: [
          'Satu acara, banyak penerima individu, senarai kelihatan: kini semua orang memiliki semua orang. Mematikan satu kotak itu ialah beza antara sebuah mesyuarat dan buku alamat yang bocor.',
          'Tetapannya tinggal pada acara, bukan pada akaun, jadi ia kembali kepada nilai lalai anda setiap kali dan perlu difikirkan pada acara yang penting, bukan sekali sahaja.',
        ],
      },
    ],
    claims: {
      sharePrice: 'Kos menghantar satu acara dari aplikasi',
    },
    practical: [
      'Matikan «lihat senarai tetamu» bagi apa-apa yang dihantar kepada orang yang tidak saling mengenali.',
      'Biarkan «ubah acara» dimatikan melainkan ada orang yang benar-benar menjadualkan untuk anda.',
      'Semak kotak pada acara, bukan dalam tetapan: di situlah tempatnya.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'why-a-shared-calendar-does-not-appear'],
  },

  'google-calendars-that-never-reach-your-iphone': {
    title: 'Kenapa sesetengah kalendar Google tidak pernah sampai ke iPhone',
    short: 'Kalendar Google hilang pada iPhone',
    description:
      'Satu akaun Google, beberapa kalendar, dan hanya satu pada telefon. Senarai penyegerakan yang menentukannya, dan apa yang patut dibuat.',
    lede: 'Akaun Google anda menyimpan lapan kalendar. iPhone anda menunjukkan dua. Tiada apa yang rosak: sesuatu yang tidak pernah anda lihat telah memilih untuk anda.',
    commonBelief: 'Bahawa menambah akaun Google pada iPhone turut menambah kalendar di dalamnya.',
    sections: [
      {
        heading: 'Senarai yang tidak pernah ditunjukkan kepada anda',
        body: [
          'Google menyimpan senarai bagi setiap peranti tentang kalendar mana yang dibenarkan menyegerak, dan kalendar sekunder — yang dikongsi, yang dilanggan, yang dibuat untuk sesuatu projek — kerap berada di luarnya.',
          'Senarai itu bukan dalam tetapan iOS. Ia tinggal pada halaman Google tersendiri, dan sebab itulah mencari di tempat yang jelas tidak menemui apa-apa yang salah dan tidak mengubah apa-apa.',
        ],
      },
      {
        heading: 'Jalan yang satu lagi',
        body: [
          'Aplikasi yang bercakap terus dengan Google tidak menggunakan senarai itu, jadi ia menunjukkan setiap kalendar yang benar-benar ada pada akaun, termasuk yang digugurkan telefon secara senyap.',
          'Itu turut merapatkan akaun. Satu paparan yang memuatkan peribadi, kerja dan kongsi itulah maksudnya; sama ada telefon akan menyegerakkan setiap satu berhenti menjadi soalan.',
        ],
      },
    ],
    claims: {
      accounts: 'Jenis akaun yang disatukan oleh satu paparan',
      price: 'Kos bahagian Google',
    },
    practical: [
      'Semak senarai penyegerakan Google sebelum menganggap akaun itu rosak.',
      'Jangkakan kalendar langganan dan kongsi dikecualikan, bukan disertakan.',
      'Jika anda menyimpan lebih daripada dua kalendar, bacalah melalui sesuatu yang bertanya kepada Google secara terus.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'icloud-google-and-outlook-in-one-view'],
  },

  'taking-back-a-calendar-you-shared': {
    title: 'Menarik balik kalendar yang anda kongsikan',
    short: 'Menarik balik akses',
    description:
      'Mengeluarkan seseorang daripada kalendar menghentikan apa yang datang selepas ini. Apa yang ia tidak lakukan ialah membatalkan apa yang sudah berlaku.',
    lede: 'Menamatkan akses ialah satu ketukan. Menentukan sama ada satu ketukan memadai mengambil masa sedikit lebih lama, kerana perkongsian meninggalkan salinan.',
    commonBelief: 'Bahawa mengeluarkan seseorang turut mengeluarkan apa yang dilihatnya.',
    sections: [
      {
        heading: 'Apa yang berhenti dan apa yang kekal',
        body: [
          'Keluarkan seseorang dan kalendar hilang daripada senarainya, serta-merta dan tanpa mesej. Acara akan datang tidak pernah sampai kepadanya.',
          'Apa yang tidak kembali: jemputan yang sudah ada padanya, acara yang disalin ke kalendarnya sendiri, apa-apa yang dieksport, dan segala yang pernah diberi alamat rahsia. Akses tamat; ingatan tidak.',
        ],
      },
      {
        heading: 'Yang terselamat daripada pengeluaran',
        body: [
          'Jika seseorang pernah diberi hak mengurus perkongsian, dia mungkin telah menambah orang lain. Mengeluarkan dia membiarkan mereka kekal — begitulah sebuah kalendar akhirnya dikongsi dengan seseorang yang tiada siapa ingat pernah menjemputnya.',
          'Jadi bacalah seluruh senarai dan bukan memadam satu nama, dan lakukannya semasa perpisahan, bukan berbulan kemudian. Tiada apa yang mengingatkan, dan perkongsian hanya bertimbun.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Kos bulanan tahap tempat ini diurus, dalam dolar',
    },
    practical: [
      'Baca senarai akses sepenuhnya, bukan hanya nama yang anda niat keluarkan.',
      'Tetapkan semula alamat rahsia jika orang itu pernah memilikinya.',
      'Anggap salinan kekal: pindahkan perkara yang benar-benar sensitif dan bukan menyembunyikannya.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
