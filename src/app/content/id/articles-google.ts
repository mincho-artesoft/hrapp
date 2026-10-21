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
