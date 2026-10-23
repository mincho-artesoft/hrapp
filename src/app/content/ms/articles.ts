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
  "month-view-on-a-bigger-screen": {
  "updated": "2026-10-22",
  "title": "Kalendar bulanan pada iPad dan iPhone: lihat tarikh, kemudian semak butiran",
  "short": "Gunakan paparan bulan tanpa terlepas butiran",
  "description": "Bandingkan tarikh pada iPad atau iPhone. Semak acara tersembunyi, kalendar dipilih dan waktu sebelum memindahkan janji temu bersama atau berulang.",
  "lede": "Paparan bulan menunjukkan tarikh komitmen sepanjang bulan. Ia kurang sesuai untuk membuktikan sesuatu waktu lapang. Pilih tarikh melalui gambaran keseluruhan, kemudian semak hari dan acara sebelum bersetuju. Panduan ini diterbitkan oleh Arte Soft, pembangun Cloud Calendars.",
  "commonBelief": "Grid bulan yang lebih besar memaparkan setiap butiran, dan tarikh yang kelihatan kosong membuktikan semua orang lapang.",
  "sections": [
    {
      "heading": "Tentukan sama ada anda memerlukan tarikh atau waktu tepat",
      "body": [
        "Gunakan bulan untuk membandingkan tarikh akhir projek, perjalanan dan janji temu keluarga merentasi beberapa minggu. Jika persoalannya ialah pertindihan dua janji temu pada 14:30, beralih kepada paparan hari atau minggu dan semak waktu mula serta tamat. Petak bulan tidak mempunyai skala masa yang sama dengan grid mengikut jam.",
        "Contohnya, penganjur bengkel boleh mengelakkan minggu perjalanan terlebih dahulu. Seterusnya semak hari yang dicadangkan: komitmen, persediaan, perjalanan dan waktu perlu tamat. Petak yang kelihatan kosong ialah pilihan untuk diperiksa, bukan tempahan disahkan atau kenyataan bahawa orang lain lapang."
      ]
    },
    {
      "heading": "Baca bilangan tambahan, bukan hanya tajuk yang kelihatan",
      "body": [
        "Petak bulan Cloud Calendars kini memaparkan bilangan label acara yang terhad serta bilangan tambahan jika terdapat acara lain pada tarikh itu. Tajuk dihadkan kepada satu baris dan mungkin dipendekkan. Buka hari atau acara apabila tajuk penuh atau komitmen lain penting.",
        "Skrin iPad yang lebih besar boleh memudahkan pembacaan, tetapi ruang fizikal tambahan tidak semestinya menghapuskan semua had paparan. Tetingkap aplikasi sempit atau teks besar boleh mengubah apa yang muat. Buat semakan sama pada iPhone: buka hari sebelum menganggap label yang kelihatan sebagai seluruh jadual."
      ]
    },
    {
      "heading": "Semak bulan, kalendar dipilih dan tarikh bersebelahan",
      "body": [
        "Baca bulan dan tahun yang dipaparkan sebelum memilih tarikh. Grid boleh menyertakan tarikh bulan bersebelahan untuk melengkapkan baris. Dalam Cloud Calendars, gunakan navigasi bulan dan periksa tarikh dipilih, bukan bergantung pada kedudukan petak sahaja.",
        "Semak kalendar yang dipilih. Menyembunyikan acara kerja boleh memudahkan pembacaan rancangan keluarga, tetapi turut mengeluarkan komitmen itu daripada gambaran tersebut. Untuk menyiasat pendua, sembunyikan satu sumber sementara dan bandingkan; jangan padam janji temu semata-mata untuk mengurangkan kesesakan bulan."
      ]
    },
    {
      "heading": "Buka acara sebelum mengubah persetujuan bersama",
      "body": [
        "Sahkan tajuk, pemilik atau kalendar, waktu tempatan dan tempoh dalam butiran acara. Warna membantu imbasan, tetapi tidak menggantikan pengetahuan tentang akaun atau kebenaran menyunting. Jemputan yang kelihatan berbeza daripada janji temu yang anda anjurkan sendiri.",
        "Cloud Calendars menyediakan seret dan lepas dalam bulan untuk memindahkan acara ke tarikh lain. Sebelum menggunakannya pada komitmen sebenar, pastikan tarikh tujuan dan skop ulangan. Selepas perubahan yang dibenarkan, buka semula acara dan semak hasilnya; gerakan setempat bukan bukti penyedia atau setiap peserta menerima aturan baharu."
      ]
    },
    {
      "heading": "Semak acara berulang dan zon waktu secara berasingan",
      "body": [
        "Jika hanya kelas minggu ini berpindah, jangan tersilap mengubah corak masa hadapan. Baca pilihan skop ulangan yang tersedia, kemudian semak kejadian yang diubah dan satu kejadian kemudian. Paparan bulan memudahkan perbandingan tarikh berulang, tetapi skop suntingan menentukan kesan perubahan.",
        "Untuk perjalanan atau mesyuarat merentasi zon waktu, semak tarikh dan waktu tempatan acara dengan jelas. Memindahkan acara ke hari lain bukan penukaran automatik waktu mesyuarat yang dimaksudkan. Semak peralihan waktu musim panas jika berkaitan dan sahkan waktu yang dipersetujui dengan pihak terlibat."
      ]
    },
    {
      "heading": "Gunakan paparan lebih besar tanpa mengelirukannya dengan produk lain",
      "body": [
        "Apple Calendar menawarkan pilihan bulan sendiri, manakala Teamup menerangkan set paparan berbeza bagi pelayar dan aplikasi mudah alih. Kawalan itu milik produk masing-masing. Jangan cari konfigurasi pelayar Teamup atau menu paparan Apple Calendar dalam Cloud Calendars hanya kerana namanya sama.",
        "Sebulan janji temu juga bukan sebulan ramalan cuaca. Untuk rancangan luar, semak tempat, tarikh dan jam ramalan yang tersedia secara berasingan. Simpan janji temu akhir dalam kalendar yang dimaksudkan dan sahkan perubahan terus dengan peserta."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Gunakan bulan untuk menyenarai pendek tarikh, kemudian semak waktu tepat dalam paparan hari atau minggu.",
    "Buka hari dengan bilangan tambahan atau tajuk dipendekkan.",
    "Semak bulan, tahun dan kalendar dipilih sebelum menganggap tarikh lapang.",
    "Sahkan kalendar, waktu, tempoh dan kebenaran menyunting acara.",
    "Baca skop ulangan dan semak kejadian yang disimpan selepas pemindahan.",
    "Semak ketersediaan cuaca secara berasingan dan sahkan perubahan dengan peserta."
  ],
  "faq": [
    {
      "q": "Adakah paparan bulan iPad menunjukkan setiap janji temu sepenuhnya?",
      "a": "Jangan anggap begitu. Cloud Calendars mengehadkan label acara dalam petak bulan dan menunjukkan bilangan tambahan. Buka hari dan acara untuk menyemak seluruh jadual."
    },
    {
      "q": "Adakah hari kosong bermakna saya lapang?",
      "a": "Semak dahulu kalendar dipilih, tarikh dan kewujudan data akaun berkaitan. Gambaran keseluruhan hanya mewakili maklumat yang kini tersedia dan dipaparkan."
    },
    {
      "q": "Adakah memindahkan acara berulang hanya mengubah tarikh itu?",
      "a": "Baca pilihan skop suntingan dan jangan membuat andaian. Selepas menyimpan, semak kejadian yang diubah dan satu kejadian kemudian, lalu sahkan aturan yang dimaksudkan."
    }
  ],
  "sourcesHeading": "Bandingkan penerangan paparan rasmi",
  "sources": [
    {
      "label": "Apple: paparan bulan, berbilang hari dan senarai dalam Apple Calendar",
      "url": "https://support.apple.com/en-ca/guide/iphone/iphfd1054569/ios"
    },
    {
      "label": "Teamup: paparan kalendar serta konfigurasi pelayar berbanding aplikasi",
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
  "title": "Kalendar dengan cuaca pada iPhone dan iPad: rancang hari anda dalam satu paparan",
  "short": "Gunakan kalendar dan cuaca bersama-sama",
  "description": "Bandingkan kalendar anda dengan cuaca untuk lokasi yang dipilih pada iPhone dan iPad.",
  "lede": "Cloud Calendars meletakkan jadual dan cuaca anda dalam aplikasi iPhone atau iPad yang sama. Gunakan kalendar untuk memilih tarikh dan paparan cuaca untuk meneliti lokasi yang dipilih serta ramalan jam yang tersedia. Untuk rancangan luar, semak tempoh yang benar-benar penting dan jangan hanya bergantung pada satu ikon harian. Panduan ini diterbitkan oleh Arte Soft, pembangun aplikasi ini.",
  "commonBelief": "Cuaca yang dipaparkan di sebelah kalendar secara automatik menerangkan alamat setiap acara, setiap jam dan setiap tarikh pada masa hadapan.",
  "sections": [
    {
      "heading": "Pilih soalan perancangan yang sebenar",
      "body": [
        "Mulakan dengan acara tertentu, seperti lawatan ke taman pada sebelah petang. Kenal pasti perkara yang boleh berubah: masanya, tempatnya, persediaan atau keputusan untuk menggunakan alternatif. Anda tidak perlu menyusun semula seluruh kalendar hanya kerana simbol hari itu menunjukkan hujan.",
        "Catat waktu mula dan tamat sebenar aktiviti itu, termasuk masa persediaan jika berkaitan. Gambaran keseluruhan kalendar membantu mencari tarikh yang sesuai, manakala semakan ramalan melibatkan lokasi dan tempoh tertentu. Bezakan dua tugas ini apabila membandingkan pilihan."
      ]
    },
    {
      "heading": "Sahkan lokasi cuaca sebelum membaca nilainya",
      "body": [
        "Cloud Calendars menyediakan cuaca untuk lokasi semasa atau lokasi yang dipilih. Semak lokasi yang dipaparkan dan jangan anggap alamat acara akan menukar ramalan secara senyap. Acara di bandar lain perlu dibandingkan dengan cuaca di bandar itu.",
        "Sebagai contoh, seseorang mungkin merancang waktu tiba di muzium ketika telefon masih berada di rumah. Baca lokasi ramalan dan waktu tempatan acara sebelum membandingkannya. Nilai yang kelihatan berdekatan bukan bukti bahawa jadual dan cuaca menggunakan lokasi yang sama."
      ]
    },
    {
      "heading": "Semak liputan mengikut jam dan harian secara berasingan",
      "body": [
        "Gunakan entri harian untuk orientasi dan entri mengikut jam yang tersedia untuk soalan tentang sebahagian hari. Tempahan dari pukul dua hingga lima memerlukan lebih daripada sekilas pandang pada satu simbol. Semak sama ada jam yang berkaitan benar-benar tersedia.",
        "Dalam sumber aplikasi semasa, senarai harian memaparkan sehingga sepuluh hari WeatherKit yang dikembalikan. Ini berasingan daripada navigasi kalendar dan daripada jam yang sedang dibekalkan. Acara pada masa hadapan tidak memanjangkan liputan cuaca. Jika tempohnya tiada, aturkan semakan cuaca pada masa lain."
      ]
    },
    {
      "heading": "Fahami maksud nilai cuaca",
      "body": [
        "Apple mendokumentasikan data WeatherKit seperti suhu, kerpasan, angin dan UV, dengan sesetengah produk hanya tersedia di wilayah terpilih. Baca nilai yang tersedia untuk lokasi pilihan anda dan jangan jangkakan setiap produk cuaca tersedia di semua tempat.",
        "Panduan Met Office menunjukkan mengapa tempoh ramalan dan takrif pemboleh ubah itu penting: sesetengah nilai merujuk kepada satu ketika dan yang lain kepada satu tempoh. Gunakan label daripada penyedia yang berkaitan. Kebarangkalian hujan, jumlah hujan dan tempoh hujan ialah soalan yang berbeza, dan tiada satu nombor yang menentukan setiap aktiviti luar."
      ]
    },
    {
      "heading": "Semak draf yang dicipta daripada satu jam cuaca",
      "body": [
        "Apabila aplikasi menawarkan penciptaan acara daripada satu jam, ia membuka draf. Sumber semasa menggunakan zon waktu lokasi cuaca, mencadangkan tempoh satu jam dan memilih kalendar lalai untuk acara baharu. Semak setiap nilai sebelum menyimpan.",
        "Sahkan tajuk, kalendar destinasi, waktu mula, waktu tamat dan lokasi yang dimaksudkan. Pemilihan ramalan tidak memberikan kebenaran untuk mengedit kalendar yang dikongsi, memaklumkan tempat acara atau menempah bilik. Semak acara yang disimpan dan dapatkan sebarang persetujuan yang diperlukan oleh rancangan itu."
      ]
    },
    {
      "heading": "Asingkan demonstrasi laman web",
      "body": [
        "Demonstrasi cuaca interaktif di laman web menggunakan Open-Meteo. Aplikasi menggunakan Apple WeatherKit. Demonstrasi web berguna untuk meneroka cara persembahan, tetapi lokasi, data dan tarikh yang tersedia mungkin berbeza daripada aplikasi.",
        "Untuk keputusan sebenar, buka aplikasi dan bandingkan acara yang dimaksudkan dengan ramalan yang tersedia. Jika anda mengubah rancangan yang dikongsi, sahkan penganjur, skop ulangan dan peserta. Sediakan alternatif yang dipersetujui apabila aktiviti bergantung pada keadaan."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Kenal pasti acara dan keputusan yang boleh diubah oleh cuaca.",
    "Sahkan lokasi cuaca serta tarikh dan waktu tempatan acara.",
    "Periksa liputan jam yang tersedia secara berasingan daripada ringkasan harian.",
    "Baca kebarangkalian, jumlah dan nilai lain yang berkaitan mengikut labelnya.",
    "Semak semua butiran draf acara dan kalendar destinasi sebelum menyimpan.",
    "Semak semula pada waktu keputusan dibuat dan sahkan perubahan yang dikongsi secara terus."
  ],
  "faq": [
    {
      "q": "Adakah cuaca di sebelah kalendar saya mengikut setiap alamat acara?",
      "a": "Jangan anggap begitu. Sahkan lokasi cuaca yang dipaparkan dan bandingkannya dengan tempat acara; kedudukan yang berdekatan pada skrin tidak membuktikan padanan itu."
    },
    {
      "q": "Adakah aplikasi menggunakan penyedia cuaca laman web?",
      "a": "Tidak. Aplikasi menggunakan Apple WeatherKit; demonstrasi laman web menggunakan Open-Meteo secara berasingan."
    },
    {
      "q": "Adakah memilih satu jam ramalan akan menyimpan acara secara automatik?",
      "a": "Ia memulakan draf apabila tindakan itu ditawarkan. Semak tarikh, zon waktu, tempoh, kalendar dan lokasinya, kemudian simpan acara yang dimaksudkan."
    }
  ],
  "seeAlso": [
    "weather-calendar-history-versus-forecast-iphone",
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather",
    "weather-where-the-event-is",
    "planning-outdoors-without-being-rained-on"
  ],
  "sourcesHeading": "Sumber rasmi dan bacaan lanjut",
  "sources": [
    {
      "label": "Apple: maklumat ramalan WeatherKit dan ketersediaan mengikut wilayah",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: lokasi ramalan, tempoh dan nilai cuaca",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ],
  "comparison": {
    "heading": "Paparan cuaca yang mana menjawab soalan anda?",
    "columns": [
      "Soalan anda",
      "Perkara yang perlu diperiksa",
      "Perkara yang tidak dibuktikannya"
    ],
    "rows": [
      {
        "cells": [
          "Apakah yang akan berlaku hari ini?",
          "Paparan hari atau minggu kalendar di sebelah cuaca untuk lokasi yang dipilih.",
          "Bahawa setiap alamat acara secara automatik menukar lokasi cuaca."
        ]
      },
      {
        "cells": [
          "Bolehkah hujan menjejaskan acara saya pada sebelah petang?",
          "Data mengikut jam untuk tempat acara dan keseluruhan tempoh acara.",
          "Bahawa simbol harian menerangkan setiap jam."
        ]
      },
      {
        "cells": [
          "Bolehkah saya merancang bulan depan berdasarkan cuaca?",
          "Kalendar anda sekarang, kemudian semakan ramalan lebih hampir kepada tarikhnya.",
          "Bahawa menavigasi kalendar memanjangkan liputan ramalan."
        ]
      },
      {
        "cells": [
          "Bolehkah saya melihat gambaran ringkas yang cepat di rumah?",
          "Widget Home Screen yang sesuai.",
          "Bahawa setiap susun atur widget termasuk acara atau ramalan penuh."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-right",
    "hook"
  ],
  "galleryCaption": "Skrin Cloud Calendars sebenar: paparan cuaca dan satu hari dengan acara. Semak lokasi dan tarikh yang dipilih dalam aplikasi.",
  "actionHeading": "Rancang dengan jadual dan ramalan bersama-sama",
  "actionText": "Cloud Calendars tersedia untuk iPhone dan iPad. Mulakan dengan paparan, cuaca dan penyegerakan Google Calendar yang disertakan dalam Base; Advanced membuang iklan, manakala Premium menambah sokongan Microsoft Calendar dan Teams.",
  "articleLinks": [
    {
      "slug": "forecast-beside-every-event",
      "label": "Semak cuaca mengikut jam untuk sesuatu acara"
    },
    {
      "slug": "the-widget-that-shows-what-is-next",
      "label": "Pilih widget kalendar dan cuaca"
    },
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "Gabungkan akaun kalendar dalam satu paparan"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
  "updated": "2026-10-23",
  "title": "Lihat kalendar Google, iCloud dan Outlook bersama-sama pada iPhone dan iPad",
  "short": "Tiga penyedia, satu paparan",
  "description": "Gabungkan paparan kalendar dan fahami kebenaran akaun, salinan serta keperluan pelan.",
  "lede": "Untuk melihat acara kerja dan peribadi bersama-sama, sambungkan akaun yang dimaksudkan, pilih kalendarnya dan semak acara yang sama dalam satu paparan. Cloud Calendars menyokong perancangan iPhone dan iPad dengan iCloud dan Google Calendar; sokongan Microsoft Calendar tersedia dalam Premium. Melihat acara bersama-sama berbeza daripada menyalin waktu sibuk antara akaun penyedia. Arte Soft, pembangunnya, menerbitkan panduan ini.",
  "commonBelief": "Meletakkan beberapa kalendar dalam satu aplikasi secara automatik memastikan ketersediaan, perkongsian dan salinan acara semuanya selaras.",
  "sections": [
    {
      "heading": "Kenal pasti akaun dan kalendar di sebalik setiap acara",
      "body": [
        "Mulakan dengan satu acara biasa daripada setiap penyedia. Catat alamat e-mel yang log masuk, nama kalendar dan sama ada anda memiliki acara itu atau menerima jemputan. Dua kalendar bernama “Calendar” boleh dimiliki oleh akaun yang sama sekali berbeza. Warna membantu anda meneliti seminggu dengan cepat; akaun dan kalendar menentukan tempat sesuatu perubahan perlu dibuat.",
        "Contohnya, temu janji doktor gigi dalam kalendar iCloud peribadi anda dan mesyuarat projek dalam Microsoft boleh muncul bersama untuk anda. Namun, itu sendiri tidak menjadikan temu janji doktor gigi tersebut kelihatan kepada rakan sekerja anda atau menempah masa itu dalam alat penjadualan mereka.",
        "Tentukan hasil yang anda mahu sebelum menukar sambungan. Untuk memindahkan data acara ke akaun lain, gunakan “Pilih format eksport kalendar” di bawah untuk mencari laluan pemindahan yang disokong dan semak acara wakil sebelum bergantung pada destinasi itu. Untuk membandingkan waktu, kekalkan pemilik kalendar sedia ada dan paparkan sumber terpilih bersama-sama. Jika akaun lain perlu menerima waktu sibuk, “Cloud Calendars and OneCal by workflow” menerangkan bagaimana penyalinan ketersediaan berbeza daripada gambaran peribadi."
      ]
    },
    {
      "heading": "Sambungkan melalui laluan yang sesuai",
      "body": [
        "Bagi iCloud, mula-mula aktifkan iCloud Calendar pada iPhone di bawah Apple Account yang dimaksudkan. Panduan persediaan Apple menerangkan tetapan peranti tersebut. Cloud Calendars mengakses kalendar yang tersedia melalui sistem kalendar iPhone dan memerlukan akses kalendar untuk membacanya. Akaun yang disambungkan pada peranti lain sahaja tidak mencukupi.",
        "Cloud Calendars juga mempunyai tindakan “Sign in with Google” dan “Sign in with Microsoft”. Semak akaun yang anda pilih semasa log masuk, kemudian buka kumpulan kalendarnya dan pilih kalendar yang anda perlukan. Log masuk ke penyedia yang betul tetapi dengan identiti peribadi atau kerja yang salah boleh menghasilkan senarai kalendar yang sah sepenuhnya tetapi tidak seperti yang dijangka."
      ]
    },
    {
      "heading": "Fahami pelan tanpa mengelirukannya dengan kebenaran",
      "body": [
        "Pelan Base termasuk penyegerakan Google Calendar dan paparan kalendar. Advanced menambah penghapusan iklan kepada Base. Premium menambah ciri Microsoft Calendar dan Microsoft Teams. Semak harga tempatan semasa dan tempoh pengebilan sebelum membeli.",
        "Pelan mengubah ciri aplikasi yang tersedia; ia tidak memberikan pemilikan terhadap kalendar orang lain. Google membezakan antara kebenaran untuk melihat acara dan kebenaran untuk mengubahnya. Polisi majikan dan kebenaran yang dilampirkan pada kalendar Microsoft tetap terpakai. Acara yang kelihatan atau editor yang tersedia bukan bukti bahawa penyedia akan menerima kemas kini."
      ]
    },
    {
      "heading": "Paparan gabungan boleh merangkumi salinan kalendar",
      "body": [
        "Sambungan Google dan Microsoft menggunakan salinan kalendar dalam sistem kalendar iPhone untuk memaparkan dan menyegerakkan acara. Jangan anggap bahawa menyambungkan akaun bermaksud tiada salinan wujud di luar penyedia asal. Destinasi yang digunakan untuk salinan tersebut boleh bergantung pada sumber kalendar yang tersedia pada peranti.",
        "Jika akaun yang sama turut sampai ke telefon melalui laluan lain, semak nama kalendar dan sumber sebelum menganggap acara berulang sebagai acara yang berasingan. Sembunyikan satu kalendar buat sementara waktu untuk mengenal pasti paparan yang dibekalkannya. Jangan padam acara atau kalendar semata-mata untuk mencantikkan paparan skrin: salinan yang disambungkan boleh menghantar perubahan kembali kepada penyedianya."
      ]
    },
    {
      "heading": "Teruskan memilih destinasi apabila anda mencipta acara",
      "body": [
        "Sebelum menyimpan, semak kalendar acara itu sama telitinya seperti tarikh dan waktunya. Untuk acara keluarga, pilih kalendar yang benar-benar digunakan oleh keluarga; untuk mesyuarat kerja, gunakan destinasi kerja yang dibenarkan. Melihat kedua-dua kalendar bersama-sama tidak menjadikan salah satunya destinasi automatik bagi setiap acara baharu.",
        "Menukar kalendar acara atau menyeretnya antara kalendar boleh menjadi pemindahan, bukan paparan kedua yang tidak memudaratkan. Kekalkan jemputan dan mesyuarat berulang dalam kalendar sedia adanya semasa mendiagnosis masalah paparan. Jika anda memerlukan perubahan, tentukan dahulu siapa pemilik acara itu dan kalendar mana yang boleh menerimanya."
      ]
    },
    {
      "heading": "Sahkan gambaran keseluruhan sebelum bergantung padanya",
      "body": [
        "Bandingkan satu acara terkini dalam kalendar penyedia itu sendiri dengan acara yang sepadan dalam Cloud Calendars. Semak tarikh, zon waktu, tajuk dan kalendar terpilih. Untuk kalendar boleh edit yang anda miliki, acara sementara tanpa tetamu ialah semakan yang lebih baik daripada mengubah mesyuarat sebenar. Sahkan hasilnya pada pihak penyedia sebelum menganggap sambungan itu sedia digunakan.",
        "Jangan bergantung pada paparan gabungan untuk mencipta blok sibuk tanpa butiran dalam akaun lain secara automatik. Jika anda perlu memastikan rakan sekerja melihat anda sebagai tidak tersedia tanpa melihat butiran peribadi, gunakan aturan ketersediaan yang diluluskan secara jelas dan sahkan dari pihak mereka. Gambaran peribadi yang jelas dan ketersediaan dikongsi ialah dua tugas yang berasingan."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Senaraikan akaun dan kalendar yang tepat bagi satu acara daripada setiap penyedia.",
    "Aktifkan kalendar iCloud yang dimaksudkan pada peranti dan semak akses kalendar.",
    "Gunakan log masuk Google atau Microsoft yang sesuai dan pilih kalendar yang dimaksudkan.",
    "Bandingkan satu acara terkini dengan paparan penyedianya sebelum mengubah apa-apa.",
    "Sembunyikan sumber pendua yang disyaki buat sementara waktu; kekalkan acara asas seperti sedia ada.",
    "Semak kalendar destinasi pada setiap acara baharu, dan sahkan secara berasingan sebarang perkongsian waktu sibuk yang anda perlukan."
  ],
  "faq": [
    {
      "q": "Adakah rakan sekerja saya akan melihat acara peribadi saya kerana saya memaparkan kedua-dua kalendar?",
      "a": "Memaparkan kalendar bersama-sama bukan arahan perkongsian atau jambatan waktu sibuk automatik. Semak tetapan perkongsian sebenar bagi setiap kalendar. Sambungan penyedia boleh mencipta salinan kalendar pada peranti, jadi paparan gabungan juga bukan jaminan bahawa data acara hanya wujud pada penyedia asalnya."
    },
    {
      "q": "Mengapa saya boleh melihat sesuatu acara tetapi tidak dapat mengeditnya dengan berjaya?",
      "a": "Kalendar itu mungkin baca sahaja, acara itu mungkin milik penganjur lain, atau penyedia mungkin menolak kemas kini tersebut. Semak pemilikan dan kebenaran dalam kalendar penyedia. Membeli pelan aplikasi yang lebih tinggi tidak mengubah kebenaran itu."
    },
    {
      "q": "Patutkah saya sambungkan akaun Google yang sama melalui setiap laluan yang tersedia?",
      "a": "Mula-mula semak cara ia sudah muncul pada telefon. Pelbagai laluan boleh menyukarkan pengecaman salinan kalendar. Pilih laluan yang anda mahu gunakan, sahkan acaranya, dan sembunyikan paparan tambahan semasa menyiasat daripada memadam data atau memutuskan sambungan akaun sebagai langkah pertama."
    }
  ],
  "sourcesHeading": "Sumber dan rujukan persediaan",
  "sources": [
    {
      "label": "Apple: sediakan iCloud Calendar pada peranti anda",
      "url": "https://support.apple.com/guide/icloud/set-up-calendar-mme4d73a8727/icloud"
    },
    {
      "label": "Google: perkongsian kalendar dan kebenaran",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: API kalendar Outlook dan data peti mel yang disokong",
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
    "heading": "Paparan gabungan, langganan atau waktu sibuk yang disalin?",
    "columns": [
      "Apa yang anda perlukan",
      "Apa yang perlu diperiksa",
      "Apa yang tidak patut diandaikan"
    ],
    "rows": [
      {
        "cells": [
          "Satu paparan untuk beberapa akaun",
          "Akaun yang disambungkan, kalendar yang dipilih dan pelan yang diperlukan.",
          "Bahawa skrin yang dikongsi menggabungkan pemilikan atau kebenaran."
        ]
      },
      {
        "cells": [
          "Suntingan acara yang sampai kepada penyedianya",
          "Acara asal, kebenaran menulis dan hasil yang disimpan pada sumber.",
          "Bahawa suntingan setempat yang kelihatan membuktikan penyegerakan penyedia berjaya."
        ]
      },
      {
        "cells": [
          "Waktu sibuk dalam akaun lain",
          "Perkhidmatan dengan peraturan penyegerakan sumber ke destinasi yang jelas.",
          "Bahawa paparan gabungan mencipta blok ketersediaan untuk rakan sekerja."
        ]
      },
      {
        "cells": [
          "Suapan kalendar yang dilanggan",
          "Penerbit, tingkah laku penyegaran dan status baca sahaja.",
          "Bahawa langganan ICS ialah sambungan dua hala yang boleh diedit."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-left",
    "hook"
  ],
  "galleryDevice": "iPad",
  "galleryCaption": "Paparan kalendar iPad sebenar menggambarkan semakan jadual. Tangkapan skrin tidak menunjukkan arah penyegerakan penyedia atau kebenaran akaun.",
  "actionHeading": "Semak kalendar anda bersama-sama pada iPhone dan iPad",
  "actionText": "Penyegerakan Google Calendar disertakan dalam Base. Advanced menambah pembuangan iklan; Premium menambah sokongan Microsoft Calendar dan Teams. Sahkan kebenaran akaun secara berasingan daripada pelan pembelian.",
  "articleLinks": [
    {
      "slug": "onecal-alternative-iphone-calendar-view-or-sync",
      "label": "Bandingkan paparan gabungan dengan peraturan penyegerakan OneCal"
    },
    {
      "slug": "fantastical-readdle-calendar366-iphone-comparison",
      "label": "Bandingkan aliran kerja kalendar iPhone"
    },
    {
      "slug": "weather-inside-your-calendar",
      "label": "Rancang dengan cuaca dan acara bersama-sama"
    }
  ]
},

  'sharing-one-event-not-your-calendar': {
  "updated": "2026-10-21",
  "title": "Kongsi satu acara: pilih pautan dan akses yang sesuai",
  "short": "Berkongsi satu acara",
  "description": "Kongsi satu acara tanpa seluruh kalendar. Fahami Reader, Writer dan Owner, pratonton, kemas kini serta batas penarikan balik akses.",
  "lede": "Menghantar butiran makan malam, membenarkan penganjur bersama menyunting dan mengumpul jawapan kehadiran ialah tugas berbeza. Pilih tujuan dahulu, kemudian cara berkongsi. Panduan ini ditulis oleh Arte Soft, pembangun Cloud Calendars.",
  "commonBelief": "Setiap pautan acara ialah langganan baca sahaja yang terus dikemas kini dan merekodkan jawapan.",
  "sections": [
    {
      "heading": "Semak butiran acara dahulu",
      "body": [
        "Perkongsian satu acara terhad kepada acara itu, bukan seluruh kalendar pengirim. Semak tajuk, zon waktu, lokasi, nota dan pautan mesyuarat. Maklumat untuk seorang tetamu mungkin tidak sesuai diedarkan secara luas.",
        "Berkongsi acara makan malam tidak memerlukan kalendar janji temu perubatan anda. Namun, lokasi dan pautan makan malam tetap dikongsi. Semak kandungan acara itu sendiri."
      ]
    },
    {
      "heading": "Pilih pratonton, e-mel atau QR",
      "body": [
        "App Clip Cloud Calendars memaparkan pratonton; aplikasi penuh diperlukan untuk menambah acara melalui laluan ini. Jemputan e-mel dan QR membuka halaman web yang menawarkan pembukaan Cloud Calendars. Pautan ini bukan alamat langganan yang boleh saling menggantikan.",
        "Pengirim perlu mendaftar masuk untuk perkongsian terselaras. Pautan dan kod QR boleh diteruskan kepada orang lain. Kod QR menyampaikan pautan, bukan membuktikan siapa yang membukanya."
      ]
    },
    {
      "heading": "Berikan hanya akses yang diperlukan",
      "body": [
        "Jemputan e-mel menawarkan Reader, Writer atau Owner. Reader boleh melihat dan menyelaras, Writer boleh menyunting, Owner juga boleh berkongsi dan mengurus akses. Pilih Reader untuk orang yang hanya memerlukan jadual.",
        "Pilih Writer untuk penganjur bersama yang perlu mengubah acara. Owner hanya apabila orang itu juga perlu mengurus akses orang lain. Hak lebih tinggi memerlukan identiti log masuk yang betul. Penerima tanpa nama bukan pemilik bersama yang dikenal pasti."
      ]
    },
    {
      "heading": "Fahami cara penerima menambah acara",
      "body": [
        "Aplikasi penuh memerlukan kebenaran kalendar dan kalendar destinasi yang boleh ditulis. Penerima perlu menyemak destinasi sebelum menyimpan. Salinan diterima boleh dikaitkan dengan acara dikongsi untuk kemas kini kemudian.",
        "Import fail ICS biasa menghasilkan salinan, manakala langganan menyemak suapan secara berkala. Jika menghantar suapan ICS dan bukannya jemputan aplikasi, terangkan perbezaannya dan pastikan kalendar penerima menyokongnya."
      ]
    },
    {
      "heading": "Sahkan perubahan sebelum bergantung padanya",
      "body": [
        "Perkongsian terselaras boleh membawa suntingan atau pembatalan, tetapi peranti perlu berpeluang menerimanya. Petunjuk muat semula suapan bukan tarikh akhir penghantaran. Peranti luar talian, langganan belum dimuat semula atau salinan import berasingan mungkin masih menunjukkan maklumat lama.",
        "Jika waktu makan malam berubah pada saat akhir, kemas kini acara dan hubungi tetamu secara langsung. Minta pengesahan waktu baharu. Menerima kemas kini bukan jawapan kehadiran."
      ]
    },
    {
      "heading": "Urus akses tanpa menjanjikan pemadaman semua salinan",
      "body": [
        "Semak penerima dan buang kebenaran yang tidak diperlukan. Mengeluarkan penerima dan membatalkan pautan suapan ialah tindakan berasingan. Kedua-duanya tidak menjamin pemadaman jauh semua tangkap layar, mesej atau salinan kalendar.",
        "Jika pautan tersebar, kenal pasti pautan atau akses yang terlibat dan semak hasil selepas perubahan. Elakkan butiran peribadi dalam pautan edaran luas daripada bergantung pada pembatalan kemudian."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Semak butiran dan tentukan sama ada tujuan anda melihat, menyunting atau mendapat jawapan kehadiran.",
    "Pilih laluan perkongsian dan daftar masuk apabila diperlukan.",
    "Gunakan Reader untuk pembaca; Writer atau Owner hanya bagi tanggungjawab berkaitan.",
    "Minta penerima menyemak waktu dan kalendar destinasi.",
    "Bagi perubahan segera, kemas kini acara dan hantar mesej terus.",
    "Semak hak penerima dan akses pautan secara berasingan apabila selesai."
  ],
  "faq": [
    {
      "q": "Adakah satu acara mendedahkan seluruh kalendar?",
      "a": "Perkongsian terselaras satu acara terhad kepada acara itu, tetapi butirannya tetap kelihatan. Semak butiran dan jangan hantar jemputan seluruh kalendar jika hanya satu acara diperlukan."
    },
    {
      "q": "Bolehkah penerima mengubah acara?",
      "a": "Ya, dengan hak Writer atau Owner yang sesuai melalui laluan log masuk yang disokong. Reader untuk melihat dan menyelaras. Langganan ICS biasa bukan mekanisme penyuntingan yang sama."
    },
    {
      "q": "Adakah mengeluarkan seseorang membatalkan semua yang telah diterima?",
      "a": "Tiada jaminan sedemikian. Akses perkongsian berubah, tetapi salinan, tangkap layar dan mesej boleh kekal. Alamat suapan yang dikongsi juga perlu diperiksa secara berasingan."
    }
  ],
  "sourcesHeading": "Rujukan pilihan penerima",
  "sources": [
    {
      "label": "Apple: gambaran keseluruhan App Clips",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google: import acara dan batasnya",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft: import atau langgan kalendar",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "taking-back-a-calendar-you-shared"
  ]
},

  'what-a-subscription-actually-buys': {
  "updated": "2026-10-21",
  "title": "Apa yang sebenarnya dibeli oleh langganan",
  "short": "Apa yang dibeli langganan",
  "description": "Apa yang dibeli langganan: Base, Advanced, Premium.",
  "lede": "Panduan ini diterbitkan oleh Arte Soft, pembangun Cloud Calendars.",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "Base merangkumi penyegerakan Google Calendar, Google Meet, paparan kalendar, cuaca dan widget. Pelan percuma mungkin memaparkan iklan."
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Advanced merangkumi Base dan membuang iklan. Premium merangkumi Advanced serta menambah Microsoft Calendar dan Microsoft Teams.",
        "Langganan tidak memberikan kebenaran menyunting kalendar orang lain atau memintas sekatan akaun kerja."
      ]
    },
    {
      "heading": "Maklumat pembelian dan pembatalan",
      "body": [
        "Semak harga tempatan, tempoh pengebilan dan syarat pembaharuan sebelum membeli.",
        "Untuk langganan yang dibilkan oleh Apple, buka Seting → nama anda → Langganan. Semak status dan tarikh tamat. Membatalkan pembaharuan berbeza daripada memadam app atau data kalendar; jangan anggap ciri berbayar kekal tersedia selepas tamat."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Semak harga tempatan, tempoh pengebilan dan syarat pembaharuan sebelum membeli.",
    "Langganan tidak memberikan kebenaran menyunting kalendar orang lain atau memintas sekatan akaun kerja."
  ],
  "faq": [
    {
      "q": "Bagaimanakah saya menghentikan pembaharuan?",
      "a": "Untuk langganan yang dibilkan oleh Apple, buka Seting → nama anda → Langganan. Semak status dan tarikh tamat. Membatalkan pembaharuan berbeza daripada memadam app atau data kalendar; jangan anggap ciri berbayar kekal tersedia selepas tamat."
    }
  ],
  "sourcesHeading": "Maklumat pembelian dan pembatalan",
  "sources": [
    {
      "label": "Apple: Bagaimanakah saya menghentikan pembaharuan?",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view"
  ]
},
};
