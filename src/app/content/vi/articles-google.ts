import { LocalisedArticle } from '../types';

/** Sáu bài về Google: câu hỏi cụ thể, trả lời rõ ràng. */
export const GOOGLE_VI: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
  "title": "Quyền chia sẻ Google Calendar: kiểm tra quyền bạn thực sự cấp",
  "short": "Truy cập và quyền riêng tư trong Google Calendar",
  "description": "Chọn quyền xem thời gian rảnh/bận, chi tiết hoặc chỉnh sửa. Kiểm tra truy cập công khai và qua nhóm bên cạnh quyền từng người trước khi chia sẻ.",
  "lede": "Trước khi chia sẻ lịch, xác định người kia cần làm gì. Sắp xếp theo thời gian của bạn, đọc chi tiết và duy trì lịch là các việc khác nhau. Hướng dẫn này do Arte Soft, nhà phát triển Cloud Calendars, xuất bản.",
  "commonBelief": "Đặt quyền hạn chế cho một người bảo đảm họ không thể xem chi tiết qua bất kỳ cách nào khác.",
  "sections": [
    {
      "heading": "Chọn quyền theo công việc",
      "body": [
        "Đồng nghiệp tìm giờ hẹn có thể chỉ cần biết khi nào bạn rảnh, không cần chi tiết cuộc hẹn. Người cộng tác duy trì lịch dự án cần cách cấp quyền khác. Xác định việc cần làm trước, rồi kiểm tra quyền trong cài đặt chia sẻ hiện tại của lịch.",
        "Google phân biệt thời gian rảnh/bận, chi tiết sự kiện và nhiều mức chỉnh sửa. Một tùy chọn chỉnh sửa giới hạn truy cập sự kiện riêng tư; tùy chọn khác cho phép chỉnh sửa và xem chi tiết; mức cao nhất còn cho quản lý chia sẻ. Không coi mọi tùy chọn có từ thay đổi là tương đương."
      ]
    },
    {
      "heading": "Kiểm tra truy cập toàn lịch, không chỉ từng người",
      "body": [
        "Ngoài các cá nhân được chỉ định, xem lịch có công khai, mở cho tổ chức hoặc chia sẻ qua nhóm không. Google cho biết quyền rộng hơn có thể được ưu tiên: hạn chế một người không thu lại chi tiết đã công khai.",
        "Ví dụ, hãy xét lịch câu lạc bộ công bố cho thành viên. Trước khi thêm cuộc hẹn cá nhân, kiểm tra đối tượng xem lịch thay vì cho rằng quyền bên cạnh một người bạn là cài đặt duy nhất liên quan. Lưu cuộc hẹn riêng tư vào nơi phù hợp."
      ]
    },
    {
      "heading": "Dùng cài đặt Google cho đúng lịch",
      "body": [
        "Trong Google Calendar trên máy tính, tìm lịch cần dùng, mở trình đơn và vào cài đặt chia sẻ. Google mô tả các khu vực riêng cho người hoặc nhóm và cho truy cập rộng hơn. Kiểm tra tên lịch và tài khoản đăng nhập trước khi thay đổi.",
        "Khi mời, xác nhận đúng danh tính Google của người nhận. Nếu họ không tìm thấy lịch, kiểm tra địa chỉ và thư mời thay vì mở rộng quyền để lịch xuất hiện. Không hiển thị lịch và thiếu quyền chỉnh sửa là hai vấn đề khác nhau."
      ]
    },
    {
      "heading": "Thử kết quả mà không dùng cuộc hẹn riêng tư",
      "body": [
        "Dùng một cuộc hẹn thử không có tiêu đề, ghi chú, địa điểm hay danh sách khách riêng tư. Yêu cầu người nhận xác nhận những gì họ thấy và, chỉ khi cần và được phép chỉnh sửa, những gì họ có thể đổi. Không đưa thông tin đăng nhập của bạn để làm kiểm tra này.",
        "Ghi lại lịch và vai trò đã cấp, rồi kiểm tra kết quả sau khi đổi cài đặt. Điều này xác minh cách chia sẻ mong muốn, không chứng minh thông tin đã đọc hoặc sao chép đã biến mất. Không thử bằng cách công khai lịch làm việc thật."
      ]
    },
    {
      "heading": "Tách chính sách nơi làm việc khỏi gói ứng dụng",
      "body": [
        "Google nêu rằng quản trị viên cơ quan hoặc trường học có thể hạn chế chia sẻ. Khi không có cài đặt cần dùng, hãy dùng cách tổ chức cho phép. Không công bố thông tin công việc để vượt hạn chế tài khoản.",
        "Cloud Calendars có thể hiển thị lịch đã kết nối, nhưng tên gói không định nghĩa lại quyền Google. Advanced bỏ quảng cáo; trả tiền không tự cấp cho người khác quyền xem mọi sự kiện Google. Kiểm tra chia sẻ ở nhà cung cấp và kết quả đã được chấp nhận, thay vì chỉ dựa vào trình chỉnh sửa cục bộ sẵn có."
      ]
    },
    {
      "heading": "Rà soát và xóa quyền không còn cần",
      "body": [
        "Khi dự án kết thúc, xem lại người nhận, nhóm và mọi hình thức công bố rộng hơn. Xóa một người chỉ là một phần kiểm tra nếu còn cách truy cập khác. Thống nhất ai duy trì lịch và cách xử lý thay đổi quyền về sau.",
        "Google hướng dẫn riêng việc xóa người hoặc nhóm và việc tắt chia sẻ rộng hơn. Bỏ quyền không thu hồi tệp đã xuất, ảnh chụp màn hình hoặc thông tin đã sao chép nơi khác. Trao đổi riêng với người liên quan, không hứa rằng một công tắc xóa mọi bản sao cũ."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Xác định lịch và việc người nhận cần làm.",
    "Kiểm tra truy cập cá nhân, nhóm, tổ chức và công khai.",
    "Chọn quyền phù hợp trong cài đặt Google hiện tại.",
    "Xác minh danh tính người nhận trước khi đổi quyền.",
    "Kiểm tra một sự kiện thử vô hại từ phía người nhận.",
    "Rà soát các cách truy cập cũ mà không mặc định thu hồi được bản sao trước đây."
  ],
  "faq": [
    {
      "q": "Quyền hạn chế riêng có ưu tiên hơn lịch công khai không?",
      "a": "Không. Google nêu rằng quyền lịch rộng hơn được ưu tiên khi các cài đặt xung đột. Kiểm tra cài đặt công khai và tổ chức bên cạnh mục của người đó."
    },
    {
      "q": "Mọi quyền chỉnh sửa có cho xem sự kiện riêng tư như nhau không?",
      "a": "Không. Google mô tả một tùy chọn chỉnh sửa giới hạn truy cập sự kiện riêng tư, riêng với các tùy chọn chỉnh sửa và quản lý chia sẻ khác. Đọc chính xác quyền hiện tại trước khi chọn."
    },
    {
      "q": "Mua Advanced có thay đổi quyền chia sẻ Google không?",
      "a": "Không. Advanced bỏ quảng cáo trong Cloud Calendars. Truy cập tại nhà cung cấp phụ thuộc vào quyền của lịch và hạn chế của tổ chức."
    }
  ],
  "sourcesHeading": "Hướng dẫn hiện tại của Google về quyền và chia sẻ",
  "sources": [
    {
      "label": "Google: chọn quyền cho lịch",
      "url": "https://support.google.com/calendar/answer/15716974?hl=en"
    },
    {
      "label": "Google: chia sẻ lịch và xóa quyền truy cập",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    }
  ],
  "seeAlso": [
    "why-a-shared-calendar-does-not-appear",
    "sharing-one-event-not-your-calendar",
    "taking-back-a-calendar-you-shared"
  ],
  "updated": "2026-10-21"
},

  'why-a-shared-calendar-does-not-appear': {
    "updated": "2026-10-21",
    "title": "Một lịch được chia sẻ với bạn mà không thấy đâu",
    "short": "Lịch chia sẻ không hiện ra",
    "description": "Lịch Google được chia sẻ không xuất hiện? Kiểm tra tài khoản được mời, nhóm, chế độ hiển thị và loại liên kết.",
    "lede": "Hướng dẫn này do Arte Soft, nhà phát triển Cloud Calendars, biên soạn. Trước hết hãy phân biệt thiếu quyền truy cập với lịch chỉ bị ẩn.",
    "commonBelief": "Rằng chấp nhận một lịch chia sẻ là đưa nó vào điện thoại của bạn.",
    "sections": [
      {
        "heading": "Kiểm tra tài khoản và nhóm",
        "body": [
          "So sánh địa chỉ nhận lời mời với tài khoản Google đang đăng nhập trên điện thoại và trình duyệt. Mở liên kết lời mời bằng đúng tài khoản. Google hỗ trợ chia sẻ với cá nhân và Google Groups. Nếu truy cập qua nhóm, nhờ quản trị viên xác nhận tư cách thành viên và chủ lịch kiểm tra quyền của đúng nhóm. Email được chuyển tiếp tự nó không cấp quyền."
        ]
      },
      {
        "heading": "Bị ẩn, không có hay bị hạn chế?",
        "body": [
          "Mở trình đơn Google Calendar trên iPhone hoặc iPad. Nếu lịch có trong danh sách nhưng chưa được chọn, hãy chọn lịch. Nếu không có, nhờ chủ lịch kiểm tra quyền: gửi yêu cầu không có nghĩa là đã được chấp thuận. Chính sách nơi làm việc hoặc trường học có thể hạn chế chia sẻ. So sánh cùng tài khoản trong Google Calendar trên web. Nếu ở đó hiển thị, kiểm tra tài khoản kết nối và lịch được chọn trong ứng dụng khác. Quyền chỉ đọc không cho phép chỉnh sửa."
        ]
      },
      {
        "heading": "Xác định loại liên kết",
        "body": [
          "Lời mời chia sẻ cũng chứa liên kết; không phải mọi liên kết đều là đăng ký ICS. Hỏi người gửi xem liên kết cấp quyền vào lịch Google hay xuất bản nguồn chỉ đọc. Theo Google, đăng ký lịch mới cần trình duyệt trên máy tính; mở lịch đã được chia sẻ qua email là thao tác khác. Việc cập nhật nguồn phụ thuộc vào dịch vụ nhận. Không có thời gian chờ chung cho mọi trường hợp; hãy xác nhận thay đổi gấp với người tổ chức."
        ]
      }
    ],
    "claims": {},
    "faq": [
      {
        "q": "Google Group có thể được cấp quyền không?",
        "a": "Có. Kiểm tra nhóm được chọn, tư cách thành viên và giới hạn của tổ chức. Email nhóm được chuyển tiếp không chứng minh quyền truy cập."
      },
      {
        "q": "Có nên xóa rồi kết nối lại tài khoản không?",
        "a": "Trước hết kiểm tra tài khoản, quyền và chế độ hiển thị, rồi so sánh với lịch trên web. Kết nối lại không cấp quyền còn thiếu."
      }
    ],
    "practical": [
      "Xác nhận tài khoản được mời và tư cách thành viên nhóm.",
      "Chọn lịch nếu lịch có trong danh sách nhưng bị ẩn.",
      "Nhờ chủ lịch kiểm tra quyền trước khi đổi kết nối."
    ],
    "sourcesHeading": "Nguồn và thông tin thêm",
    "sources": [
      {
        "label": "Google: Kiểm tra tài khoản và nhóm",
        "url": "https://support.google.com/calendar/answer/37082?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Bị ẩn, không có hay bị hạn chế?",
        "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Xác định loại liên kết",
        "url": "https://support.google.com/calendar/answer/37648?hl=en"
      }
    ],
    "seeAlso": [
      "who-can-see-what-in-google-calendar",
      "google-calendars-that-never-reach-your-iphone"
    ]
  },

  'the-secret-address-of-a-google-calendar': {
    title: 'Địa chỉ bí mật của lịch Google thực sự để lộ điều gì',
    short: 'Địa chỉ iCal bí mật',
    description:
      'Google cung cấp một địa chỉ riêng tư cho thấy toàn bộ lịch của bạn với bất cứ ai giữ nó. Nó phơi bày điều gì, và vì sao không thể lặng lẽ thu hồi.',
    lede: 'Nằm sâu trong phần cài đặt của mọi lịch Google là một liên kết cho thấy mọi thứ trên đó. Không cần đăng nhập, không cần quyền, không có dấu vết ai đã mở.',
    commonBelief: 'Rằng một địa chỉ riêng tư là riêng tư vì nó khó tìm.',
    sections: [
      {
        heading: 'Một liên kết là mật khẩu không thể đổi riêng cho một người',
        body: [
          'Địa chỉ bí mật mang theo chi tiết đầy đủ — tiêu đề, giờ giấc, địa điểm, ghi chú. Ai giữ liên kết đều thấy, và không có danh sách nào ghi lại họ là ai.',
          'Lớp bảo vệ duy nhất là phần ngẫu nhiên trong địa chỉ. Trước việc đoán mò thì đó là bảo vệ thật, còn trước việc chuyển tiếp, một màn hình chia sẻ hay một tài liệu sống lâu hơn công việc thì hoàn toàn không.',
        ],
      },
      {
        heading: 'Đặt lại sẽ làm hỏng nó với tất cả mọi người',
        body: [
          'Bạn có thể đặt lại địa chỉ, và cái cũ chết. Nó cũng chết với mọi đồng nghiệp, mọi bảng theo dõi và mọi đoạn mã lặng lẽ dựa vào nó, không hề báo trước.',
          'Đó là lý do đừng bao giờ phát địa chỉ của cái lịch bạn đang sống trong đó. Hãy công bố một lịch lập riêng cho việc ấy, khi đó đặt lại chẳng tốn gì.',
        ],
      },
    ],
    claims: {
      linkLength: 'Số ký tự ngẫu nhiên bảo vệ một liên kết chia sẻ của chúng tôi',
      sharePrice: 'Chi phí chia sẻ một sự kiện từ ứng dụng',
    },
    faq: [
      {
        q: 'Ai đó có thể làm gì với địa chỉ bí mật của lịch tôi?',
        a: 'Xem mọi thứ trên đó — tiêu đề, giờ giấc, địa điểm và ghi chú — mà không cần đăng nhập, không cần quyền, và không để lại dấu vết nào rằng họ đã xem.',
      },
      {
        q: 'Tôi có lấy lại được địa chỉ bí mật không?',
        a: 'Chỉ bằng cách đặt lại, và điều đó giết địa chỉ cũ với tất cả mọi người cùng lúc: đồng nghiệp, bảng theo dõi và mọi đoạn mã lặng lẽ dựa vào nó, không báo trước.',
      },
      {
        q: 'Tôi gửi địa chỉ bí mật cho đồng nghiệp qua email được không?',
        a: 'Hãy coi nó là công khai ngay khi rời khỏi tay bạn. Lớp bảo vệ duy nhất là khó đoán, và việc chuyển tiếp xóa sạch đúng điều đó.',
      },
    ],
    practical: [
      'Hãy coi địa chỉ bí mật là công khai ngay khi nó rời khỏi tay bạn.',
      'Đừng bao giờ công bố địa chỉ của cái lịch bạn thực sự dùng.',
      'Đặt lại khi có người nghỉ việc, và báo cho những ai sẽ bị đứt.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'taking-back-a-calendar-you-shared'],
  },

  'what-guests-can-do-to-your-event': {
    title: 'Khách mời có thể làm gì với sự kiện của bạn',
    short: 'Quyền của khách mời',
    description:
      'Ba ô đánh dấu quyết định khách mời có thể dời cuộc họp, mời người lạ hay đọc toàn bộ danh sách hay không. Chúng bật nhiều hơn người ta tưởng.',
    lede: 'Mời ai đó là cho họ nhiều hơn một địa điểm và một giờ. Trong một sự kiện Google thông thường, khách mời thường thấy còn ai được mời, và nhiều khi được thêm người.',
    commonBelief: 'Rằng khách mời chỉ có thể nhận lời hoặc từ chối.',
    sections: [
      {
        heading: 'Ba ô ấy',
        body: [
          'Sửa sự kiện cho phép khách mời đổi giờ, đổi nơi và đổi tiêu đề cho tất cả mọi người. Hiếm khi ta muốn thế, mà lại rất dễ để nguyên.',
          'Mời người khác cho phép họ thêm những người bạn chưa từng gặp. Xem danh sách khách mời cho thấy tất cả những ai được mời và họ trả lời ra sao — ổn trong một nhóm làm việc, khó xử với khách hàng, và sai với bất cứ thứ gì giống một nhóm khách hàng riêng rẽ.',
        ],
      },
      {
        heading: 'Chỗ mọi thứ lặng lẽ hỏng',
        body: [
          'Một sự kiện, nhiều người nhận riêng lẻ, danh sách hiện rõ: giờ thì ai cũng có tất cả mọi người. Bỏ đúng một ô ấy là khác biệt giữa một cuộc họp và một sổ địa chỉ bị lộ.',
          'Các thiết lập sống trong sự kiện chứ không trong tài khoản, nên chúng quay về giá trị mặc định mỗi lần và phải được cân nhắc ở những sự kiện quan trọng, chứ không phải một lần cho mãi mãi.',
        ],
      },
    ],
    claims: {
      sharePrice: 'Chi phí gửi một sự kiện đơn lẻ từ ứng dụng',
    },
    faq: [
      {
        q: 'Khách mời có thấy nhau trong một lời mời của Lịch Google không?',
        a: 'Mặc định thường là có. «Xem danh sách khách mời» hiện mọi người được mời cùng câu trả lời của họ: ổn trong một nhóm, khó xử với khách hàng, và sai khi khách mời là những khách hàng riêng rẽ.',
      },
      {
        q: 'Khách mời có đổi được giờ họp của tôi không?',
        a: 'Nếu «sửa sự kiện» được bật thì có, và thay đổi áp dụng cho tất cả mọi người. Hiếm khi ta muốn thế và rất dễ để nguyên.',
      },
      {
        q: 'Làm sao ngăn khách mời mời thêm người khác?',
        a: 'Tắt «mời người khác» ngay trên sự kiện. Các thiết lập này thuộc về sự kiện chứ không thuộc tài khoản, nên chúng quay về giá trị mặc định mỗi lần.',
      },
    ],
    practical: [
      'Tắt «xem danh sách khách mời» với mọi thứ gửi tới những người không quen nhau.',
      'Để «sửa sự kiện» tắt, trừ khi có người thật sự sắp lịch thay bạn.',
      'Kiểm tra các ô trên sự kiện, không phải trong cài đặt: chúng nằm ở đó.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'why-a-shared-calendar-does-not-appear'],
  },

  'google-calendars-that-never-reach-your-iphone': {
    title: 'Vì sao một số lịch Google không bao giờ tới được iPhone',
    short: 'Lịch Google thiếu trên iPhone',
    description:
      'Một tài khoản Google, nhiều lịch, mà điện thoại chỉ có một. Danh sách đồng bộ quyết định điều đó, và nên làm gì thay thế.',
    lede: 'Tài khoản Google của bạn giữ tám lịch. iPhone hiện hai. Chẳng có gì hỏng cả: một thứ bạn chưa từng thấy đã chọn thay bạn.',
    commonBelief: 'Rằng thêm tài khoản Google vào iPhone là thêm cả các lịch trong đó.',
    sections: [
      {
        heading: 'Một danh sách chưa ai cho bạn xem',
        body: [
          'Google giữ cho từng thiết bị một danh sách những lịch được phép đồng bộ, và các lịch phụ — lịch được chia sẻ, lịch đăng ký, lịch ai đó lập cho một dự án — thường nằm ngoài danh sách ấy.',
          'Danh sách đó không nằm trong phần cài đặt của iOS. Nó sống trên một trang riêng của Google, nên tìm ở chỗ hiển nhiên sẽ chẳng thấy gì sai và cũng chẳng thay đổi được gì.',
        ],
      },
      {
        heading: 'Con đường còn lại',
        body: [
          'Một ứng dụng nói chuyện thẳng với Google không dùng danh sách ấy, nên nó hiện mọi lịch mà tài khoản thực sự có, kể cả những lịch điện thoại đã lặng lẽ bỏ rơi.',
          'Điều đó cũng kéo các tài khoản lại gần nhau. Một khung nhìn chứa cả cá nhân, công việc và lịch chung mới là điều cần; chuyện điện thoại có đồng bộ từng lịch hay không, không còn là câu hỏi.',
        ],
      },
    ],
    claims: {
      accounts: 'Số loại tài khoản mà một khung nhìn giữ chung',
      price: 'Chi phí cho phần Google',
    },
    faq: [
      {
        q: 'Vì sao chỉ một số lịch Google của tôi hiện trên iPhone?',
        a: 'Google giữ cho từng thiết bị một danh sách những lịch được phép đồng bộ, và các lịch phụ — được chia sẻ, đăng ký, lập cho một dự án — thường nằm ngoài danh sách ấy.',
      },
      {
        q: 'Thiết lập đồng bộ Lịch Google cho iPhone nằm ở đâu?',
        a: 'Không nằm trong phần cài đặt của iOS. Nó sống trên một trang riêng của Google, nên tìm ở chỗ hiển nhiên sẽ chẳng thấy gì sai và cũng chẳng đổi được gì.',
      },
      {
        q: 'Làm sao thấy hết lịch Google trên iPhone?',
        a: 'Qua một ứng dụng hỏi thẳng Google thay vì đi qua danh sách của thiết bị. Nó hiện mọi lịch mà tài khoản thực sự có, kể cả những lịch điện thoại đã bỏ rơi.',
      },
    ],
    practical: [
      'Xem danh sách đồng bộ của Google trước khi cho rằng tài khoản bị hỏng.',
      'Hãy tính rằng lịch đăng ký và lịch chia sẻ bị loại ra chứ không được đưa vào.',
      'Nếu bạn giữ hơn hai lịch, hãy đọc chúng bằng thứ hỏi thẳng Google.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'icloud-google-and-outlook-in-one-view'],
  },

  'taking-back-a-calendar-you-shared': {
  "title": "Ngừng chia sẻ lịch và kiểm tra các đường truy cập còn lại",
  "short": "Kiểm tra và thu hồi quyền truy cập",
  "description": "Phân biệt người nhận, nhóm, quyền công khai và liên kết đăng ký khi ngừng chia sẻ lịch. Kiểm tra thay đổi và hiểu vì sao bản sao có thể còn lại.",
  "lede": "Khi kết thúc cộng tác, trước hết hãy xác định quyền truy cập đã được cấp theo cách nào. Xóa một người, tắt công khai và đặt lại địa chỉ đăng ký là những việc khác nhau. Hướng dẫn này do Arte Soft, nhà phát triển Cloud Calendars, xuất bản.",
  "commonBelief": "Xóa một người nhận sẽ lập tức thu hồi mọi bản sao lịch và đóng tất cả đường truy cập khác.",
  "sections": [
    {
      "heading": "Xác định lịch và cách chia sẻ",
      "body": [
        "Trước khi đổi quyền, hãy xác nhận tài khoản sở hữu, lịch và đối tượng cần tiếp cận. Chia sẻ lịch Google cho một đồng nghiệp cụ thể khác với công khai lịch, cấp quyền cho nhóm hoặc dùng địa chỉ đăng ký. Cloud Calendars cũng có cơ chế riêng để chia sẻ sự kiện và lịch.",
        "Ví dụ, thư ký câu lạc bộ có thể nhận quyền sửa qua lời mời cá nhân, còn thành viên theo dõi lịch trình đã công bố. Thu hồi quyền riêng của thư ký không quyết định phải làm gì với đăng ký của các thành viên. Hãy liệt kê những cách chia sẻ bạn thực sự đã thiết lập."
      ]
    },
    {
      "heading": "Thu hồi đúng quyền trong Google",
      "body": [
        "Google hướng dẫn các tùy chọn riêng cho người hoặc nhóm cụ thể, chia sẻ toàn tổ chức và truy cập công khai. Trên máy tính, mở cài đặt chia sẻ của đúng lịch rồi đổi mục hoặc tùy chọn tương ứng. Trước hết hãy kiểm tra tài khoản đang đăng nhập và tên lịch.",
        "Một người vẫn có thể truy cập qua nhóm hoặc phạm vi công khai rộng hơn. Kiểm tra toàn bộ cách cấp quyền thay vì liên tục xóa cùng một địa chỉ email. Quy định cơ quan hoặc trường học có thể giới hạn tùy chọn; khi cần, hãy làm theo quy trình được chủ sở hữu hoặc quản trị viên cho phép."
      ]
    },
    {
      "heading": "Xử lý riêng địa chỉ lịch bí mật",
      "body": [
        "Google nói địa chỉ iCal bí mật dành cho việc bạn tự dùng trong ứng dụng lịch khác và không nên đưa cho người khác. Nếu địa chỉ bị lộ, Google hướng dẫn đặt lại để vô hiệu hóa địa chỉ cũ. Việc này khác với xóa một người nhận cụ thể.",
        "Trước khi đổi địa chỉ đăng ký đang dùng, hãy xác định các ứng dụng hoặc công cụ phụ thuộc vào nó để sau đó kết nối lại những nơi cần thiết. Không dán URL bí mật vào bài hỗ trợ công khai hoặc gửi nó để chứng minh bạn đã tìm đúng lịch. Thay vào đó, nêu tên lịch và loại kết nối."
      ]
    },
    {
      "heading": "Phân biệt người nhận Cloud Calendars với liên kết đăng ký",
      "body": [
        "Trong Cloud Calendars, quyền của người nhận sự kiện hoặc lịch và nguồn cấp đăng ký đã tạo là các cơ chế riêng. Kiểm tra quan hệ chia sẻ thực tế và liên kết liên quan trước khi chọn thao tác. Xóa một người nhận xác định không bảo đảm thu hồi mọi URL đã phát hoặc mọi bản sao độc lập.",
        "Nếu người đồng tổ chức chỉ cần ngừng chỉnh sửa, hãy cân nhắc vai trò và những người còn cần truy cập thay vì xóa lịch trình chung. Nếu kết thúc toàn bộ cộng tác, xác định ai sở hữu và ai nên giữ lịch. Rời một lịch được chia sẻ và xóa lịch của chính mình là hai quyết định khác nhau."
      ]
    },
    {
      "heading": "Kiểm tra kết quả mà không hứa lịch biến mất ngay",
      "body": [
        "Kiểm tra thay đổi đã được lưu trong hệ thống sở hữu lịch. Nếu một đồng nghiệp có quyền có thể giúp, hãy xác nhận khả năng xem hoặc sửa từ tài khoản của họ mà không chia sẻ mật khẩu. Phân biệt truy cập bị từ chối với sự kiện cũ vẫn hiện trong bộ nhớ đệm hoặc bản nhập.",
        "Không hứa một thời gian làm mới áp dụng cho mọi nơi hoặc sẽ không có thông báo. Khi bàn giao cho nhóm, nói rõ lịch trình nào cần dùng từ nay. Một mục cũ còn hiển thị không tự cho biết người đó còn truy cập trực tiếp, có quyền qua đường khác hay đã giữ bản sao riêng."
      ]
    },
    {
      "heading": "Xử lý riêng các bản sao đã có",
      "body": [
        "Tệp đã xuất, ảnh chụp màn hình, tin nhắn và cuộc hẹn lưu riêng có thể còn lại sau khi đổi quyền. Xác định bản sao nào quan trọng cho việc bàn giao và trao đổi cách xử lý với người liên quan. Đổi một quyền lịch không thể xác định tất cả những gì mỗi người nhận đã lưu.",
        "Giữ các bản ghi nguồn cần thiết trong khi kiểm tra kết quả. Không chuyển cuộc họp nhạy cảm sang lịch dùng chung khác chỉ để làm lịch cũ trống đi, cũng không hủy lời mời thật để thử quyền. Ghi lại lịch, đường truy cập và thay đổi đã thực hiện để việc kiểm tra sau này có điểm bắt đầu rõ ràng."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Xác định tài khoản sở hữu, lịch và cách chia sẻ.",
    "Kiểm tra riêng người nhận, nhóm và phạm vi công khai rộng hơn.",
    "Dùng đúng tùy chọn chia sẻ của Google hoặc Cloud Calendars.",
    "Xem việc đặt lại địa chỉ bí mật bị lộ là quyết định riêng.",
    "Xác minh quyền sau khi lưu mà không chia sẻ thông tin đăng nhập.",
    "Lập kế hoạch xử lý bản xuất và bản sao cũ riêng với truy cập trực tiếp."
  ],
  "faq": [
    {
      "q": "Xóa một người có tắt lịch công khai hoặc quyền qua nhóm của họ không?",
      "a": "Đừng mặc định như vậy. Kiểm tra từng đường truy cập thực tế. Google có cài đặt riêng cho người cụ thể, nhóm và phạm vi công khai rộng hơn."
    },
    {
      "q": "Lịch có biến mất ngay và không gửi thông báo không?",
      "a": "Không có bảo đảm chung về việc biến mất, thông báo hay thời gian làm mới. Xác nhận thay đổi đã lưu và phân biệt truy cập trực tiếp với thông tin trong bộ nhớ đệm hoặc bản nhập."
    },
    {
      "q": "Có phải mua Advanced để thu hồi quyền truy cập lịch Google không?",
      "a": "Advanced loại bỏ quảng cáo trong Cloud Calendars. Tùy chọn chia sẻ Google phụ thuộc vào quyền sở hữu, quyền truy cập và quy định tổ chức, không phụ thuộc gói ứng dụng này."
    }
  ],
  "sourcesHeading": "Hướng dẫn về quyền truy cập và đăng ký lịch",
  "sources": [
    {
      "label": "Google: tùy chọn chia sẻ và ngừng cấp quyền",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Google: đồng bộ tài khoản và địa chỉ iCal bí mật",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    }
  ],
  "updated": "2026-10-21",
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "the-secret-address-of-a-google-calendar"
  ]
},
};
