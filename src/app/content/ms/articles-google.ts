import { LocalisedArticle } from '../types';

/** Enam artikel Google: soalan khusus, jawapan terus. */
export const GOOGLE_MS: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
  "updated": "2026-10-21",
  "title": "Kebenaran Google Calendar: semak akses sebenar",
  "short": "Akses dan privasi Google Calendar",
  "description": "Pilih akses ketersediaan, butiran atau suntingan Google Calendar. Semak akses awam dan kumpulan selain kebenaran individu.",
  "lede": "Sebelum berkongsi, tentukan sama ada penerima perlu melihat waktu lapang, membaca butiran atau menyelenggara kalendar. Panduan ini diterbitkan oleh Arte Soft, pembangun Cloud Calendars.",
  "commonBelief": "Mengehadkan seorang individu menjamin mereka tidak dapat melihat butiran melalui laluan lain.",
  "sections": [
    {
      "heading": "Padankan akses dengan tugas",
      "body": [
        "Rakan sekerja yang mencari waktu mungkin hanya memerlukan ketersediaan. Pengurus jadual projek memerlukan aturan lain. Tentukan tugas sebelum memeriksa kebenaran dalam tetapan semasa.",
        "Google membezakan ketersediaan, butiran dan beberapa tahap suntingan. Satu pilihan mengehadkan acara peribadi; satu lagi membenarkan suntingan dan butiran; yang paling luas turut mengurus perkongsian. Jangan samakan semua pilihan perubahan."
      ]
    },
    {
      "heading": "Semak akses seluruh kalendar",
      "body": [
        "Selain individu, semak sama ada kalendar terbuka kepada umum, organisasi atau kumpulan. Menurut Google, akses lebih luas boleh mengatasi kebenaran sempit: sekatan individu tidak menyembunyikan butiran yang sudah awam.",
        "Sebelum memasukkan janji temu peribadi ke jadual kelab, semak seluruh khalayaknya, bukan hanya tetapan seorang rakan. Simpan urusan peribadi dalam destinasi yang sesuai."
      ]
    },
    {
      "heading": "Gunakan tetapan Google bagi kalendar tepat",
      "body": [
        "Dalam Google Calendar pada komputer, cari kalendar, buka menunya dan tetapan perkongsian. Terdapat bahagian orang atau kumpulan dan akses lebih luas. Semak nama kalendar serta akaun yang digunakan.",
        "Sahkan identiti Google penerima. Jika kalendar tidak kelihatan, periksa alamat dan jemputan, bukan meluaskan akses untuk memunculkannya. Paparan hilang dan kebenaran menyunting yang tidak cukup ialah masalah berbeza."
      ]
    },
    {
      "heading": "Uji tanpa maklumat peribadi",
      "body": [
        "Gunakan acara ujian tanpa tajuk peribadi, nota, lokasi atau senarai tetamu. Minta penerima mengesahkan apa yang dilihat dan, hanya jika diperlukan serta dibenarkan, apa yang boleh disunting. Jangan beri kata laluan akaun anda.",
        "Catat kalendar dan peranan, kemudian periksa hasil selepas perubahan. Ujian tidak membuktikan maklumat yang telah dibaca atau disalin sudah hilang. Jangan terbitkan jadual kerja sebenar sebagai ujian."
      ]
    },
    {
      "heading": "Asingkan polisi kerja daripada pelan aplikasi",
      "body": [
        "Pentadbir Google kerja atau sekolah boleh mengehadkan perkongsian. Jika pilihan diperlukan tiada, gunakan laluan organisasi yang diluluskan. Jangan terbitkan maklumat kerja untuk memintas sekatan.",
        "Nama pelan Cloud Calendars tidak mengubah hak Google. Advanced membuang iklan, bukan memberi orang lain akses kepada semua acara. Semak hasil yang diterima penyedia, bukan hanya penyunting tempatan yang tersedia."
      ]
    },
    {
      "heading": "Buang akses yang tidak lagi diperlukan",
      "body": [
        "Apabila projek tamat, semak penerima, kumpulan dan penerbitan umum. Membuang satu nama tidak cukup jika ada laluan lain. Persetujui siapa yang menjaga jadual dan perubahan akses seterusnya.",
        "Google menerangkan pembuangan orang atau kumpulan dan penutupan perkongsian umum secara berasingan. Ia tidak menarik balik fail eksport, tangkap layar atau maklumat yang disalin. Urus salinan tersebut secara berasingan dengan pihak terlibat."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Kenal pasti kalendar dan tugas penerima.",
    "Semak akses individu, kumpulan, organisasi dan awam.",
    "Pilih hak yang sesuai dalam tetapan Google semasa.",
    "Sahkan identiti sebelum menukar akses.",
    "Periksa acara ujian selamat dari pihak penerima.",
    "Semak akses lama tanpa menganggap semua salinan ditarik balik."
  ],
  "faq": [
    {
      "q": "Adakah sekatan individu mengatasi kalendar awam?",
      "a": "Tidak. Google menyatakan kebenaran lebih luas diutamakan jika tetapan bercanggah. Semak tetapan awam dan organisasi selain individu."
    },
    {
      "q": "Adakah semua hak suntingan mendedahkan acara peribadi dengan cara sama?",
      "a": "Tidak. Google membezakan pilihan suntingan yang mengehadkan acara peribadi daripada hak suntingan dan pengurusan lain. Baca kebenaran semasa yang tepat."
    },
    {
      "q": "Adakah membeli Advanced mengubah hak Google?",
      "a": "Tidak. Advanced membuang iklan dalam Cloud Calendars. Akses bergantung pada kebenaran kalendar dan sekatan organisasi."
    }
  ],
  "sourcesHeading": "Panduan Google semasa",
  "sources": [
    {
      "label": "Google: memilih kebenaran kalendar",
      "url": "https://support.google.com/calendar/answer/15716974?hl=en"
    },
    {
      "label": "Google: berkongsi kalendar dan membuang akses",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    }
  ],
  "seeAlso": [
    "why-a-shared-calendar-does-not-appear",
    "sharing-one-event-not-your-calendar"
  ]
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
  "title": "Alamat iCal rahsia Google: bezakan langganan daripada perkongsian",
  "short": "Alamat iCal rahsia",
  "description": "Fahami alamat iCal rahsia Google, sambungan akaun dan suapan. Urus alamat terdedah tanpa menjanjikan kemas kini segera atau pemadaman salinan.",
  "lede": "Alamat kalendar, sambungan akaun dan jemputan mempunyai fungsi berbeza. Kenal pasti yang anda miliki sebelum membawa jadual ke aplikasi lain. Panduan ini diterbitkan oleh Arte Soft, pembangun Cloud Calendars.",
  "commonBelief": "Alamat kalendar rahsia dianggap jemputan peribadi yang boleh ditarik balik daripada seorang penerima sahaja.",
  "sections": [
    {
      "heading": "Pilih sambungan mengikut tujuan",
      "body": [
        "Google membezakan log masuk ke aplikasi kalendar lain daripada paparan melalui alamat iCal rahsia. Sambungan akaun boleh menyokong suntingan; alamat menyediakan langganan baca sahaja. Google menyatakan alamat rahsia untuk kegunaan sendiri dan menasihatkan supaya tidak dikongsi dengan orang lain.",
        "Memaparkan jadual kerja sendiri dalam kalendar serasi berbeza daripada memberikan rakan akses berterusan. Tentukan hasil: melihat jadual sendiri, bekerjasama dengan individu tertentu atau menerbitkan jadual untuk khalayak. Jangan pilih URL hanya kerana mudah ditampal."
      ]
    },
    {
      "heading": "Cari kalendar yang betul, bukan sekadar akaun",
      "body": [
        "Pada komputer, arahan Google meletakkan alamat rahsia berformat iCal dalam tetapan penyepaduan kalendar terpilih. Semak namanya dahulu. Pentadbir kerja atau sekolah mungkin mengehadkan pilihan ini; ketiadaan alamat bukan alasan untuk menerbitkan kalendar secara awam.",
        "Jangan masukkan alamat dalam tangkap layar, siaran sokongan awam atau nota bersama. Apabila meminta bantuan, terangkan jenis akaun, nama kalendar dan kaedah sambungan tanpa URL. Lazimnya laluan sambungan perlu dikenal pasti sebelum kandungan acara diperlukan."
      ]
    },
    {
      "heading": "Semak apa yang sebenarnya ditambah oleh aplikasi penerima",
      "body": [
        "Langganan mengikuti suapan; fail import menghasilkan salinan berasingan. Baca arahan aplikasi penerima dan sahkan tindakan yang diambil. Membuka fail kalendar yang dimuat turun tidak bermakna janji temu itu akan mengikuti perubahan kemudian.",
        "Gunakan acara biasa yang tidak sensitif dan sudah dikenali untuk membandingkan nama kalendar, tarikh dan butiran. Jangan tambah langganan kedua untuk mendiagnosis yang pertama: dua salinan boleh membuat kelewatan kelihatan seperti konflik. Sembunyikan satu kalendar sementara untuk mengenal pasti sumber."
      ]
    },
    {
      "heading": "Asingkan pautan Google dan Cloud Calendars",
      "body": [
        "Cloud Calendars mempunyai aliran perkongsian acara dan kalendar sendiri, termasuk suapan langganan. Ia bukan alamat rahsia Google. Tentukan sama ada pengirim berkongsi satu acara, kalendar atau jemputan berasaskan akaun sebelum memilih cara membukanya.",
        "Penerima Cloud Calendars boleh mempunyai peranan Reader, Writer atau Owner. Alamat suapan sahaja bukan bukti hak menyunting. Alamat paparan Google juga tidak menjadikan anda pemilik kalendar. Tanya pengirim sistem yang patut digunakan untuk perubahan."
      ]
    },
    {
      "heading": "Ambil kira cara kalendar penerima menyegar semula",
      "body": [
        "Langganan bukan janji penghantaran serta-merta. Suapan Cloud Calendars menyertakan sela penyegaran yang dicadangkan, tetapi aplikasi penerima menentukan masa mengambil dan memaparkan kemas kini. Masa lama pada satu peranti tidak membuktikan penganjur gagal menyimpan perubahan.",
        "Untuk mesyuarat hari yang sama, bandingkan jadual terkini penganjur dan sahkan perubahan penting secara langsung. Catat kalendar yang masih menunjukkan maklumat lama serta masa anda menyemak. Jangan import berulang kali atau padam kalendar sumber untuk memaksa suapan dikemas kini."
      ]
    },
    {
      "heading": "Urus pendedahan tanpa menjanjikan penarikan semua salinan",
      "body": [
        "Google menerangkan penetapan semula alamat rahsia yang terdedah: alamat lama menjadi tidak sah dan pengganti diwujudkan. Kenal pasti aplikasi sendiri yang menggunakannya untuk mengemas kini langganan kemudian. Menetapkan semula alamat berbeza daripada membuang rakan kerjasama tertentu.",
        "Janji temu tersimpan, eksport dan tangkap layar terdahulu ialah perkara berasingan. Pautan baharu tidak membuktikan semua salinan lama telah hilang. Jika maklumat sampai kepada khalayak yang salah, pertimbangkan bahan dan penerima sebenar; kejayaan menetap semula bukan bukti pemadaman lengkap."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Kenal pasti sambungan akaun, jemputan, langganan atau fail.",
    "Semak kalendar pemilik sebelum menyalin alamat.",
    "Simpan alamat rahsia Google untuk aplikasi serasi anda sendiri.",
    "Sahkan aplikasi penerima melanggan, bukan mengimport.",
    "Sahkan perubahan segera dengan penganjur, bukan bergantung pada masa penyegaran.",
    "Jika alamat terdedah, ikuti panduan Google dan kemas kini sambungan yang dikehendaki."
  ],
  "faq": [
    {
      "q": "Bolehkah saya memberikan alamat rahsia kepada rakan?",
      "a": "Google menasihatkan supaya menyimpannya untuk aplikasi sendiri. Gunakan kawalan perkongsian kalendar dengan kebenaran yang sesuai apabila orang lain memerlukan akses."
    },
    {
      "q": "Adakah langganan membolehkan saya menyunting asal?",
      "a": "Alamat iCal rahsia Google ialah laluan paparan. Suntingan memerlukan sambungan akaun dan kebenaran sesuai; peranan perkongsian Cloud Calendars ialah susunan berasingan."
    },
    {
      "q": "Adakah menetapkan semula alamat memadam janji temu lama di semua tempat?",
      "a": "Ia menjadikan alamat Google lama tidak sah. Ia tidak membuktikan fail, janji temu atau tangkap layar yang disimpan secara bebas telah dipadam."
    }
  ],
  "sourcesHeading": "Panduan penyedia dan bacaan lanjut",
  "sources": [
    {
      "label": "Google: sambungan akaun dan alamat iCal rahsia",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    },
    {
      "label": "Google: berkongsi kalendar",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: import, langganan dan masa kemas kini",
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
  "title": "Kebenaran tetamu Google Calendar: suntingan, jemputan dan senarai tetamu",
  "short": "Kebenaran tetamu bagi acara",
  "description": "Semak kebenaran tetamu dan tetapan lalai Google. Bezakan hak jemputan daripada akses kalendar serta peranan Cloud Calendars.",
  "lede": "Kebolehan membalas tidak menerangkan semua tindakan tetamu. Semak kebenaran sebelum menggunakan satu jemputan untuk pasukan, pelanggan atau orang ramai. Panduan ini diterbitkan oleh Arte Soft, pembangun Cloud Calendars.",
  "commonBelief": "Tetamu hanya boleh menerima atau menolak, dan setiap aplikasi menawarkan kawalan kebenaran yang sama.",
  "sections": [
    {
      "heading": "Mulakan dengan penganjur dan acara asal",
      "body": [
        "Buka acara yang betul dalam Google Calendar menggunakan akaun penganjur atau akaun yang dibenarkan mengurusnya. Semak kalendar, tarikh dan penganjur sebelum mengubah kebenaran. Janji temu yang diimport berasingan bukan tempat yang boleh dipercayai untuk mengawal jemputan asal.",
        "Untuk mesyuarat pasukan, tentukan siapa boleh menjadualkan semula, menjemput orang lain dan melihat peserta. Ini keputusan berasingan. Tetamu yang perlu hadir tidak semestinya perlu mengurus mesyuarat."
      ]
    },
    {
      "heading": "Tentukan sama ada tetamu patut mengubah mesyuarat",
      "body": [
        "Google mendokumenkan pilihan “Modify event” di bawah kebenaran tetamu dalam editor komputer. Ini kebenaran kerjasama yang luas, bukan sekadar mencadangkan masa baharu. Google menerangkan bahawa ia merangkumi suntingan medan, melihat tetamu dan menempah bilik.",
        "Penganjur bersama bengkel yang dipercayai mungkin memerlukan kebebasan ini, tetapi pelanggan dengan janji temu mungkin tidak. Pilih mengikut tanggungjawab dan sahkan acara yang disimpan, bukan tetapan mesyuarat lain."
      ]
    },
    {
      "heading": "Semak jemputan dan keterlihatan secara berasingan",
      "body": [
        "Google membezakan kebenaran menjemput orang lain daripada melihat tetamu lain. Semak kedua-duanya bersama akses suntingan. Mematikan satu kebolehan tidak bermakna yang lain sudah diperiksa; lalai yang dipaparkan bukan bukti tetapan acara sedia ada.",
        "Bagi pelanggan yang tidak berkaitan, pertimbangkan sama ada jemputan bersama sesuai. Maklumat dalam e-mel, huraian atau mesej diteruskan berada di luar kawalan senarai tetamu semasa. Jangan letakkan butiran sulit peserta dalam huraian lalu mengharapkan senarai tersembunyi melindunginya."
      ]
    },
    {
      "heading": "Semak lalai serta acara penting secara individu",
      "body": [
        "Google turut mendokumenkan kebenaran tetamu lalai dalam tetapan acara, termasuk lalai pengubahsuaian. Jadi kawalan bukan hanya pada setiap acara. Semak lalai apabila corak penjadualan berubah, kemudian periksa jemputan penting sedia ada satu per satu.",
        "Bagi mesyuarat berulang, pastikan kejadian atau siri yang disunting sebelum menyimpan. Jangan anggap perubahan keutamaan menulis semula jemputan lama. Uji dengan rakan menggunakan contoh yang dipersetujui dan tidak sensitif, bukan memindahkan atau membatalkan mesyuarat pelanggan sebenar."
      ]
    },
    {
      "heading": "Asingkan peranan Cloud Calendars",
      "body": [
        "Cloud Calendars mempunyai perkongsian berasingan dengan Reader, Writer dan Owner. Reader membolehkan paparan dan penyegerakan; Writer menyunting; Owner turut mengurus perkongsian dan akses menggunakan identiti yang dijemput. Ini bukan suis untuk tiga kebenaran tetamu Google.",
        "Apabila kebenaran khusus Google penting, semak acara asal dalam Google Calendar. Melihat peserta dalam Cloud Calendars tidak membuktikan semua tetapan Google boleh diubah di situ. Kenal pasti perkhidmatan pemilik dan identiti penerima apabila kawalan hilang atau suntingan gagal."
      ]
    },
    {
      "heading": "Sahkan hasil dan jelaskan tanggungjawab",
      "body": [
        "Selepas menyimpan, buka semula acara asal dan semak tetapan. Jika sesuai, minta rakan yang diberi kuasa mengesahkan kebolehan akaunnya sendiri. Jangan bertukar kata laluan atau menghantar butiran peribadi tetamu sebagai jalan pintas menguji akses.",
        "Asingkan kehadiran daripada kebenaran. Kebolehan menyunting, salinan import dan penerimaan direkodkan ialah fakta berbeza. Resit penerimaan perkongsian Cloud Calendars bukan RSVP. Untuk mesyuarat penting, minta jawapan kehadiran dan jelaskan siapa mengurus perubahan jadual."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Kenal pasti akaun penganjur dan acara asal.",
    "Tentukan siapa mengurus, menjemput orang lain dan melihat tetamu.",
    "Periksa kebenaran tetamu sebenar pada acara Google.",
    "Semak lalai tanpa menganggapnya mengubah acara sedia ada.",
    "Anggap peranan Cloud Calendars sebagai sistem kebenaran berasingan.",
    "Buka semula acara tersimpan dan sahkan kehadiran secara berasingan."
  ],
  "faq": [
    {
      "q": "Bolehkah tetamu menukar masa mesyuarat saya?",
      "a": "Google menyokong pemberian kebenaran pengubahsuaian. Periksa acara dan akses tetamu; jangan simpulkan daripada penerimaan jemputan sahaja."
    },
    {
      "q": "Adakah semua kebenaran ditetapkan hanya pada setiap acara?",
      "a": "Tidak. Google juga mendokumenkan kebenaran lalai. Semak lalai untuk penjadualan akan datang dan acara penting sedia ada secara langsung."
    },
    {
      "q": "Adakah menyembunyikan senarai membuang maklumat yang sudah dihantar?",
      "a": "Ia tidak membuktikan e-mel, huraian, tangkap layar atau salinan bebas terdahulu telah dibuang. Semak apa yang sebenarnya diedarkan secara berasingan."
    }
  ],
  "sourcesHeading": "Panduan penyedia dan bacaan lanjut",
  "sources": [
    {
      "label": "Google: kerjasama acara dan kebenaran tetamu lalai",
      "url": "https://support.google.com/a/users/answer/13293412?hl=en"
    },
    {
      "label": "Google: medan kebenaran tetamu acara",
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
  "title": "Hentikan perkongsian kalendar: buang akses dan semak laluan lain",
  "short": "Semak dan tarik balik akses perkongsian",
  "description": "Bezakan individu, kumpulan, akses awam dan pautan suapan semasa menghentikan perkongsian. Semak perubahan; salinan tersimpan mungkin kekal.",
  "lede": "Menamatkan kerjasama bermula dengan mengenal pasti cara akses diberikan. Membuang seseorang, menghentikan penerbitan dan menetapkan semula alamat suapan ialah tindakan berbeza. Panduan ini diterbitkan oleh Arte Soft, pembangun Cloud Calendars.",
  "commonBelief": "Membuang seorang penerima dianggap serta-merta menarik balik semua salinan kalendar dan menutup setiap laluan akses lain.",
  "sections": [
    {
      "heading": "Kenal pasti kalendar dan laluan perkongsian",
      "body": [
        "Sahkan akaun pemilik, kalendar dan khalayak yang dimaksudkan sebelum mengubah akses. Kalendar Google yang dikongsi dengan rakan tertentu berbeza daripada kalendar awam, kebenaran kumpulan atau alamat langganan. Cloud Calendars juga mempunyai hubungan perkongsian acara dan kalendarnya sendiri.",
        "Contohnya, setiausaha kelab boleh menerima hak menyunting melalui jemputan peribadi, sementara ahli mengikuti jadual terbitan. Membuang hak setiausaha tidak menentukan apa yang patut berlaku kepada langganan ahli. Senaraikan susunan yang benar-benar anda wujudkan."
      ]
    },
    {
      "heading": "Buang kebenaran Google yang berkenaan",
      "body": [
        "Google mendokumenkan kawalan berasingan untuk individu atau kumpulan, perkongsian seluruh organisasi dan akses awam. Pada komputer, buka tetapan perkongsian kalendar yang betul dan ubah entri atau tetapan lebih luas yang berkaitan. Semak dahulu akaun yang dilog masuk dan nama kalendar.",
        "Seseorang mungkin masih mempunyai akses melalui kumpulan atau penerbitan lebih luas. Semak seluruh susunan, bukan membuang alamat e-mel sama berulang kali. Dasar tempat kerja atau sekolah boleh mengehadkan kawalan; gunakan proses yang diluluskan pemilik atau pentadbir jika perlu."
      ]
    },
    {
      "heading": "Urus alamat kalendar rahsia secara berasingan",
      "body": [
        "Google menyatakan alamat iCal rahsia adalah untuk kegunaan sendiri dalam aplikasi kalendar lain dan tidak patut diberikan kepada orang lain. Jika terdedah, Google menerangkan cara menetapkannya semula supaya alamat lama tidak sah. Ini berbeza daripada membuang individu tertentu.",
        "Sebelum menukar alamat langganan yang digunakan sendiri, kenal pasti aplikasi dan alat yang bergantung padanya supaya yang diperlukan boleh disambungkan semula. Jangan tampal URL rahsia dalam siaran sokongan awam atau hantar sebagai bukti menemui kalendar yang betul. Nyatakan nama kalendar dan jenis sambungan sahaja."
      ]
    },
    {
      "heading": "Bezakan penerima Cloud Calendars daripada pautan suapan",
      "body": [
        "Dalam Cloud Calendars, akses penerima acara atau kalendar dan suapan langganan yang dikeluarkan ialah mekanisme berbeza. Semak hubungan perkongsian sebenar serta pautan berkaitan sebelum bertindak. Membuang penerima yang dikenal pasti tidak menjamin semua URL terdahulu atau salinan bebas telah ditarik balik.",
        "Jika penganjur bersama hanya perlu berhenti menyunting, pertimbangkan peranan dan khalayak yang tinggal, bukannya memadam jadual bersama. Jika seluruh kerjasama tamat, tentukan pemilik dan siapa yang patut menyimpan kalendar. Meninggalkan kalendar yang diterima berbeza daripada memadam kalendar milik sendiri."
      ]
    },
    {
      "heading": "Sahkan hasil tanpa menjanjikan kehilangan serta-merta",
      "body": [
        "Semak bahawa perubahan disimpan dalam sistem pemilik. Jika rakan yang diberi kuasa boleh membantu, sahkan hasil paparan atau suntingan daripada akaunnya sendiri tanpa berkongsi kata laluan. Bezakan akses ditolak daripada acara lama yang masih kelihatan dalam cache atau salinan import.",
        "Jangan janjikan sela penyegaran sejagat atau bahawa tiada pemberitahuan dihantar. Semasa penyerahan kumpulan, beritahu jadual yang perlu digunakan seterusnya. Rekod lama yang kelihatan tidak dengan sendirinya menunjukkan akses langsung, kebenaran lain atau salinan bebas masih ada."
      ]
    },
    {
      "heading": "Susuli salinan terdahulu secara berasingan",
      "body": [
        "Fail eksport, tangkap layar, mesej dan janji temu yang disimpan berasingan mungkin kekal selepas perubahan akses. Tentukan salinan yang penting untuk penyerahan dan bincangkan pengurusannya dengan pihak terlibat. Menukar kebenaran tidak menentukan apa yang sudah disimpan setiap penerima.",
        "Simpan rekod sumber yang diperlukan semasa menilai hasil. Jangan pindahkan mesyuarat sensitif ke kalendar bersama lain hanya supaya yang lama kelihatan kosong, atau batalkan jemputan sebenar sebagai ujian akses. Catat kalendar, laluan dan perubahan untuk membantu penyelesaian masalah kemudian."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Kenal pasti akaun pemilik, kalendar dan laluan perkongsian.",
    "Semak individu, kumpulan dan penerbitan lebih luas secara berasingan.",
    "Gunakan kawalan perkongsian Google atau Cloud Calendars yang sesuai.",
    "Pertimbangkan penetapan semula alamat suapan rahsia yang terdedah secara berasingan.",
    "Sahkan hasil akses yang disimpan tanpa berkongsi maklumat log masuk.",
    "Urus eksport atau salinan lama secara berasingan daripada akses langsung."
  ],
  "faq": [
    {
      "q": "Adakah membuang seorang individu mematikan kalendar awam atau akses kumpulannya?",
      "a": "Jangan anggap begitu. Semak setiap laluan sebenar. Google mendokumenkan penerima tertentu, kumpulan dan penerbitan lebih luas sebagai tetapan berasingan."
    },
    {
      "q": "Adakah kalendar hilang serta-merta tanpa pemberitahuan?",
      "a": "Tiada janji sejagat tentang kehilangan paparan, pemberitahuan atau masa penyegaran. Sahkan perubahan tersimpan dan bezakan akses langsung daripada maklumat cache atau import."
    },
    {
      "q": "Adakah Advanced membeli keupayaan membuang akses kalendar Google?",
      "a": "Advanced membuang iklan dalam Cloud Calendars. Kawalan perkongsian Google bergantung pada pemilikan, kebenaran dan peraturan organisasi, bukan pelan aplikasi tersebut."
    }
  ],
  "sourcesHeading": "Panduan penyedia tentang akses dan langganan",
  "sources": [
    {
      "label": "Google: kawalan perkongsian dan menghentikan akses",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Google: penyegerakan akaun dan alamat iCal rahsia",
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
