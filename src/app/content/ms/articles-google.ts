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
    faq: [
      {
        q: 'Adakah tajuk acara saya kelihatan jika saya kongsi sibuk/lapang sahaja?',
        a: 'Tidak. Sibuk/lapang menunjukkan blok masa tanpa tajuk, lokasi, nota atau tetamu. Hanya «semua butiran» mendedahkannya — dan mendedahkan semuanya.',
      },
      {
        q: 'Apa yang dibenarkan oleh «buat perubahan dan urus perkongsian»?',
        a: 'Menyunting setiap acara dan menyerahkan kalendar anda kepada orang lain tanpa bertanya. Itu satu-satunya tahap yang membolehkan orang lain mengagihkan akses.',
      },
      {
        q: 'Bolehkah saya lihat siapa sudah mempunyai akses kepada kalendar saya?',
        a: 'Boleh, dalam tetapan perkongsian kalendar itu. Tiada apa yang mengajak anda menyemak dan perkongsian hanya bertimbun: baca senarainya dua kali setahun.',
      },
    ],
    practical: [
      'Jadikan sibuk/lapang lalai untuk sesiapa yang hanya perlu menempah masa dengan anda.',
      'Simpan «buat perubahan» untuk mereka yang benar-benar menjadualkan bagi pihak anda.',
      'Semak siapa yang ada akses dua kali setahun; perkongsian bertimbun dan tiada apa yang mengingatkan.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'what-guests-can-do-to-your-event'],
  },

  'why-a-shared-calendar-does-not-appear': {
    "updated": "2026-10-21",
    "title": "Kalendar dikongsi dengan anda dan ia tiada",
    "short": "Kalendar kongsi tidak muncul",
    "description": "Kalendar Google yang dikongsi tidak muncul? Semak akaun jemputan, kumpulan, keterlihatan dan jenis pautan.",
    "lede": "Panduan ini disediakan oleh Arte Soft, pembangun Cloud Calendars. Bezakan dahulu masalah akses daripada kalendar yang hanya disembunyikan.",
    "commonBelief": "Bahawa menerima kalendar kongsi meletakkannya pada telefon anda.",
    "sections": [
      {
        "heading": "Semak akaun dan kumpulan",
        "body": [
          "Bandingkan penerima jemputan dengan akaun Google pada telefon dan pelayar. Buka pautan jemputan menggunakan akaun yang betul. Google menyokong perkongsian dengan individu dan Google Groups. Untuk akses melalui kumpulan, minta pengurus mengesahkan keahlian anda dan pemilik kalendar menyemak akses kumpulan yang betul. E-mel yang dimajukan tidak memberikan kebenaran dengan sendirinya."
        ]
      },
      {
        "heading": "Tersembunyi, tiada atau terhad?",
        "body": [
          "Buka menu Google Calendar pada iPhone atau iPad. Jika kalendar tersenarai tetapi tidak ditandakan, pilih kalendar itu. Jika tiada, minta pemilik menyemak akses: permintaan bukan kelulusan. Dasar tempat kerja atau sekolah boleh mengehadkan perkongsian. Bandingkan akaun yang sama dalam Google Calendar di web. Jika berfungsi di situ, semak akaun tersambung dan pilihan kalendar dalam aplikasi lain. Akses baca sahaja tidak membenarkan suntingan."
        ]
      },
      {
        "heading": "Kenal pasti jenis pautan",
        "body": [
          "Jemputan perkongsian juga mengandungi pautan; bukan semua pautan ialah langganan ICS. Tanya sama ada pautan memberikan akses kepada kalendar Google atau menerbitkan suapan baca sahaja. Menurut Google, langganan kalendar baharu memerlukan pelayar komputer; membuka kalendar yang sudah dikongsi melalui e-mel ialah tindakan berbeza. Kemas kini suapan bergantung pada perkhidmatan penerima. Tiada tempoh menunggu yang seragam; sahkan perubahan segera dengan penganjur."
        ]
      }
    ],
    "claims": {},
    "faq": [
      {
        "q": "Bolehkah Google Group menerima akses?",
        "a": "Ya. Semak kumpulan yang dipilih, keahlian anda dan sekatan organisasi. E-mel kumpulan yang dimajukan bukan bukti akses."
      },
      {
        "q": "Perlukah saya memadam dan menyambung semula akaun?",
        "a": "Semak dahulu identiti, kebenaran dan keterlihatan, kemudian bandingkan kalendar web. Sambungan semula tidak memberikan kebenaran yang tiada."
      }
    ],
    "practical": [
      "Sahkan akaun jemputan dan keahlian kumpulan.",
      "Pilih kalendar jika tersenarai tetapi tersembunyi.",
      "Minta pemilik menyemak akses sebelum mengubah sambungan."
    ],
    "sourcesHeading": "Sumber dan maklumat lanjut",
    "sources": [
      {
        "label": "Google: Semak akaun dan kumpulan",
        "url": "https://support.google.com/calendar/answer/37082?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Tersembunyi, tiada atau terhad?",
        "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Kenal pasti jenis pautan",
        "url": "https://support.google.com/calendar/answer/37648?hl=en"
      }
    ],
    "seeAlso": [
      "who-can-see-what-in-google-calendar",
      "google-calendars-that-never-reach-your-iphone"
    ]
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
    faq: [
      {
        q: 'Apa yang boleh dilakukan seseorang dengan alamat rahsia kalendar saya?',
        a: 'Melihat segala isinya — tajuk, waktu, lokasi dan nota — tanpa log masuk, tanpa kebenaran, dan tanpa meninggalkan rekod bahawa dia melihat.',
      },
      {
        q: 'Bolehkah saya menarik balik alamat rahsia kalendar?',
        a: 'Hanya dengan menetapkannya semula, dan itu mematikan yang lama untuk semua orang serentak: rakan sekerja, papan pemuka dan setiap skrip yang bersandar padanya secara senyap, tanpa amaran.',
      },
      {
        q: 'Bolehkah saya e-mel alamat rahsia kepada rakan sekerja?',
        a: 'Anggap ia awam sebaik ia keluar daripada tangan anda. Satu-satunya perlindungannya ialah sukar diteka, dan memanjangkannya membatalkan tepat perkara itu.',
      },
    ],
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
    faq: [
      {
        q: 'Adakah tetamu nampak satu sama lain dalam jemputan Kalendar Google?',
        a: 'Secara lalai selalunya ya. «Lihat senarai tetamu» menunjukkan semua yang dijemput dan jawapan mereka: tidak mengapa dalam pasukan, janggal dengan pelanggan, dan salah apabila tetamu ialah pelanggan yang berasingan.',
      },
      {
        q: 'Bolehkah tetamu menukar waktu mesyuarat saya?',
        a: 'Jika «ubah acara» ditanda, boleh, dan perubahan itu terpakai untuk semua. Jarang dikehendaki dan mudah dibiarkan hidup.',
      },
      {
        q: 'Bagaimana menghalang tetamu daripada menjemput orang lain?',
        a: 'Matikan «jemput orang lain» pada acara itu sendiri. Tetapan ini milik acara, bukan akaun, jadi ia kembali kepada nilai lalai anda setiap kali.',
      },
    ],
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
    faq: [
      {
        q: 'Kenapa hanya sebahagian kalendar Google saya muncul pada iPhone?',
        a: 'Google menyimpan senarai bagi setiap peranti tentang kalendar mana yang dibenarkan menyegerak, dan kalendar sekunder — yang dikongsi, dilanggan, dibuat untuk projek — kerap berada di luarnya.',
      },
      {
        q: 'Di mana tetapan penyegerakan Kalendar Google untuk iPhone?',
        a: 'Bukan dalam tetapan iOS. Ia berada pada halaman Google tersendiri, dan sebab itulah mencari di tempat yang jelas tidak menemui apa-apa dan tidak mengubah apa-apa.',
      },
      {
        q: 'Bagaimana saya melihat semua kalendar Google pada iPhone?',
        a: 'Melalui aplikasi yang bertanya kepada Google secara terus dan bukan melalui senarai peranti. Ia menunjukkan setiap kalendar yang benar-benar ada pada akaun, termasuk yang digugurkan telefon.',
      },
    ],
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
    faq: [
      {
        q: 'Adakah mengeluarkan seseorang memadam apa yang sudah dilihatnya?',
        a: 'Tidak. Jemputan yang sudah ada padanya, acara yang disalin ke kalendarnya sendiri dan apa-apa yang dieksport kekal. Akses tamat; salinan tidak.',
      },
      {
        q: 'Adakah orang itu diberitahu bahawa saya menarik balik aksesnya?',
        a: 'Tidak. Kalendar hilang daripada senarainya serta-merta dan tanpa mesej.',
      },
      {
        q: 'Kenapa kalendar saya masih dikongsi dengan orang yang tidak pernah saya jemput?',
        a: 'Seseorang yang berhak mengurus perkongsian menambahnya. Mengeluarkan orang itu membiarkan semua yang ditambahnya kekal — sebab itulah dibaca seluruh senarai, bukan satu nama.',
      },
    ],
    practical: [
      'Baca senarai akses sepenuhnya, bukan hanya nama yang anda niat keluarkan.',
      'Tetapkan semula alamat rahsia jika orang itu pernah memilikinya.',
      'Anggap salinan kekal: pindahkan perkara yang benar-benar sensitif dan bukan menyembunyikannya.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
