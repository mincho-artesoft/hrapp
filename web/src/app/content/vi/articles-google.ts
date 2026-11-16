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
  "title": "Địa chỉ iCal bí mật của Google: phân biệt đăng ký và chia sẻ",
  "short": "Địa chỉ iCal bí mật",
  "description": "Hiểu địa chỉ iCal bí mật, kết nối tài khoản và nguồn cấp chia sẻ. Xử lý địa chỉ bị lộ mà không hứa cập nhật ngay hay xóa mọi bản sao.",
  "lede": "Địa chỉ lịch, kết nối tài khoản và lời mời có chức năng khác nhau. Hãy xác định bạn đang có gì trước khi đưa lịch trình vào ứng dụng khác. Hướng dẫn này do Arte Soft, nhà phát triển Cloud Calendars, xuất bản.",
  "commonBelief": "Địa chỉ lịch bí mật là lời mời cá nhân có thể thu hồi riêng với một người nhận.",
  "sections": [
    {
      "heading": "Chọn kết nối phù hợp mục đích",
      "body": [
        "Google phân biệt đăng nhập vào ứng dụng lịch khác với xem qua địa chỉ iCal bí mật. Kết nối tài khoản có thể hỗ trợ chỉnh sửa; địa chỉ cung cấp đăng ký chỉ xem. Google mô tả địa chỉ bí mật là dành cho bạn tự sử dụng và khuyên không chia sẻ với người khác.",
        "Ví dụ, hiển thị lịch làm việc của chính bạn trong ứng dụng tương thích khác không giống cấp quyền truy cập liên tục cho đồng nghiệp. Bắt đầu từ mục đích: xem lịch của mình, cộng tác với người cụ thể hay phát hành lịch trình cho một nhóm người. Đừng chọn URL chỉ vì dễ dán."
      ]
    },
    {
      "heading": "Kiểm tra đúng lịch, không chỉ đúng tài khoản",
      "body": [
        "Trên máy tính, hướng dẫn Google đặt địa chỉ bí mật định dạng iCal trong phần tích hợp của lịch đã chọn. Kiểm tra tên lịch trước. Quản trị viên cơ quan hoặc trường học có thể hạn chế tùy chọn này; không thấy địa chỉ không phải lý do để công khai lịch thay thế.",
        "Không để địa chỉ xuất hiện trong ảnh chụp màn hình, bài hỗ trợ công khai hoặc ghi chú dùng chung. Khi cần trợ giúp, mô tả loại tài khoản, tên lịch và cách kết nối mà không đưa URL. Thông thường cần xác định đường kết nối trước khi cần đến nội dung sự kiện."
      ]
    },
    {
      "heading": "Kiểm tra ứng dụng nhận thực sự đã thêm gì",
      "body": [
        "Đăng ký theo dõi một nguồn cấp; nhập tệp tạo ra bản sao riêng. Đọc hướng dẫn của ứng dụng nhận và xác nhận thao tác đang thực hiện. Nếu chỉ mở tệp lịch đã tải xuống, đừng mặc định các cuộc hẹn tạo ra sẽ theo những thay đổi sau này.",
        "Dùng một sự kiện quen thuộc, thông thường và không nhạy cảm để so sánh tên lịch, ngày và chi tiết hiển thị. Tránh tạo đăng ký thứ hai để kiểm tra đăng ký đầu tiên: hai bản sao cùng hiện có thể khiến cập nhật chậm trông như xung đột. Tạm ẩn một lịch khi xác định nguồn."
      ]
    },
    {
      "heading": "Phân biệt liên kết Google và Cloud Calendars",
      "body": [
        "Cloud Calendars có các cách chia sẻ sự kiện và lịch riêng, bao gồm nguồn cấp đăng ký. Chúng không phải địa chỉ bí mật của Google. Trước khi chọn cách mở, xác định người gửi đã chia sẻ một sự kiện, một lịch hay lời mời gắn với tài khoản.",
        "Người nhận trong Cloud Calendars có thể mang vai trò Reader, Writer hoặc Owner. Chỉ có địa chỉ nguồn cấp không chứng minh quyền chỉnh sửa. Tương tự, nhận địa chỉ xem Google không làm bạn thành chủ sở hữu lịch. Hỏi người gửi cần thay đổi trong hệ thống nào."
      ]
    },
    {
      "heading": "Tính đến cách ứng dụng nhận làm mới lịch",
      "body": [
        "Đăng ký không hứa dữ liệu đến ngay. Nguồn cấp Cloud Calendars có khoảng làm mới được đề xuất, nhưng ứng dụng nhận quyết định khi nào tải và hiển thị thay đổi. Giờ cũ trên một thiết bị không tự chứng minh người tổ chức chưa lưu thay đổi.",
        "Với cuộc họp trong ngày, đối chiếu lịch hiện tại của người tổ chức và xác nhận trực tiếp các thay đổi quan trọng. Ghi lại lịch nào còn hiển thị dữ liệu cũ và lúc bạn kiểm tra. Đừng nhập sự kiện nhiều lần hoặc xóa lịch nguồn để ép nguồn cấp cập nhật."
      ]
    },
    {
      "heading": "Xử lý địa chỉ bị lộ mà không hứa thu hồi mọi bản sao",
      "body": [
        "Google hướng dẫn đặt lại địa chỉ bí mật bị lộ để vô hiệu hóa địa chỉ cũ và tạo địa chỉ thay thế. Xác định các ứng dụng của bạn đang dùng nó để cập nhật đăng ký sau đó. Đặt lại địa chỉ khác với xóa một cộng tác viên cụ thể.",
        "Cuộc hẹn đã lưu, bản xuất và ảnh chụp màn hình là vấn đề riêng. Liên kết thay đổi không chứng minh mọi bản sao trước đây đã biến mất. Nếu gửi thông tin nhầm đối tượng, hãy xem nội dung và người nhận thực tế thay vì coi đặt lại thành công là bằng chứng xóa sạch."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Xác định bạn có kết nối tài khoản, lời mời, đăng ký hay tệp.",
    "Kiểm tra lịch nguồn trước khi sao chép địa chỉ.",
    "Giữ địa chỉ bí mật Google cho các ứng dụng tương thích của chính bạn.",
    "Xác nhận ứng dụng nhận đã đăng ký chứ không nhập bản sao.",
    "Xác nhận thay đổi khẩn với người tổ chức thay vì dựa vào thời gian làm mới.",
    "Nếu địa chỉ bị lộ, làm theo hướng dẫn đặt lại Google và cập nhật kết nối cần giữ."
  ],
  "faq": [
    {
      "q": "Tôi có thể đưa địa chỉ bí mật cho đồng nghiệp không?",
      "a": "Google khuyên giữ địa chỉ cho ứng dụng của chính bạn. Khi người khác cần truy cập, dùng tùy chọn chia sẻ của lịch và chọn quyền phù hợp."
    },
    {
      "q": "Đăng ký có cho phép sửa bản gốc không?",
      "a": "Địa chỉ iCal bí mật Google dùng để xem. Chỉnh sửa cần kết nối tài khoản và quyền phù hợp; vai trò chia sẻ Cloud Calendars là cơ chế riêng."
    },
    {
      "q": "Đặt lại địa chỉ có xóa cuộc hẹn cũ ở mọi nơi không?",
      "a": "Nó vô hiệu hóa địa chỉ Google cũ. Không chứng minh tệp, cuộc hẹn hay ảnh chụp màn hình lưu độc lập đã được xóa."
    }
  ],
  "sourcesHeading": "Hướng dẫn nhà cung cấp và tài liệu thêm",
  "sources": [
    {
      "label": "Google: kết nối tài khoản và địa chỉ iCal bí mật",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    },
    {
      "label": "Google: chia sẻ lịch",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: nhập, đăng ký và thời gian cập nhật",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "updated": "2026-10-21",
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "taking-back-a-calendar-you-shared",
    "sharing-one-event-not-your-calendar"
  ]
},

  'what-guests-can-do-to-your-event': {
  "title": "Quyền khách mời Google Calendar: chỉnh sửa, mời thêm và danh sách khách",
  "short": "Quyền khách mời trong sự kiện",
  "description": "Kiểm tra quyền khách mời và mặc định Google. Phân biệt quyền lời mời, quyền truy cập lịch và các vai trò trong Cloud Calendars.",
  "lede": "Khả năng trả lời lời mời không nói hết những gì khách có thể làm. Kiểm tra quyền trước khi dùng một lời mời chung cho nhóm, khách hàng hoặc buổi gặp công khai. Hướng dẫn do Arte Soft, nhà phát triển Cloud Calendars, xuất bản.",
  "commonBelief": "Khách chỉ có thể chấp nhận hoặc từ chối, và mọi ứng dụng đều có cùng tùy chọn quyền.",
  "sections": [
    {
      "heading": "Bắt đầu từ người tổ chức và sự kiện gốc",
      "body": [
        "Mở sự kiện trong Google Calendar bằng tài khoản tổ chức hoặc tài khoản được phép quản lý. Kiểm tra lịch, ngày và người tổ chức trước khi đổi quyền. Cuộc hẹn được nhập riêng không phải nơi đáng tin để điều khiển lời mời gốc.",
        "Với cuộc họp nhóm, xác định ai được đổi lịch, mời thêm người và xem các khách khác. Đây là những quyết định riêng. Một khách cần tham dự không nhất thiết cần quản lý cuộc họp."
      ]
    },
    {
      "heading": "Quyết định khách có được sửa cuộc họp không",
      "body": [
        "Google hướng dẫn tùy chọn sửa sự kiện trong phần quyền khách của trình chỉnh sửa trên máy tính. Đây là quyền cộng tác rộng, không chỉ để đề xuất giờ khác. Google giải thích quyền này cho phép quản lý sự kiện, sửa trường thông tin, xem khách và đặt phòng.",
        "Ví dụ, người đồng tổ chức đáng tin chuẩn bị hội thảo có thể cần sự linh hoạt đó. Khách hàng đến buổi hẹn có thể không cần. Chọn theo trách nhiệm giao cho khách và kiểm tra sự kiện đã lưu, thay vì dựa vào cấu hình cuộc họp khác."
      ]
    },
    {
      "heading": "Kiểm tra riêng quyền mời và xem khách",
      "body": [
        "Mô hình sự kiện Google phân biệt quyền mời thêm với quyền xem khách khác. Kiểm tra cả hai cùng quyền chỉnh sửa. Tắt một quyền không có nghĩa đã kiểm tra quyền kia; giá trị mặc định hiển thị cũng không chứng minh cài đặt sự kiện hiện có.",
        "Với các khách hàng không liên quan nhau, cân nhắc liệu lời mời chung có phù hợp. Thông tin đã nằm trong email, mô tả hoặc tin nhắn chuyển tiếp không thuộc phạm vi hẹp của tùy chọn danh sách khách hiện tại. Đừng đưa chi tiết mật vào mô tả rồi mong việc ẩn danh sách che được chúng."
      ]
    },
    {
      "heading": "Kiểm tra mặc định và sự kiện quan trọng",
      "body": [
        "Google cũng hướng dẫn quyền khách mặc định trong cài đặt sự kiện, gồm quyền sửa. Vì vậy tùy chọn không chỉ nằm ở từng sự kiện. Xem lại mặc định khi cách đặt lịch thường ngày thay đổi, rồi kiểm tra riêng các lời mời quan trọng đã có.",
        "Với cuộc họp lặp lại, xác nhận đang sửa lần nào hay cả chuỗi trước khi lưu. Đừng mặc định đổi tùy chọn sẽ viết lại lời mời cũ. Khi thử cùng đồng nghiệp, dùng ví dụ đã thống nhất và không nhạy cảm, thay vì dời hoặc hủy cuộc họp thật của khách hàng."
      ]
    },
    {
      "heading": "Phân biệt vai trò Cloud Calendars",
      "body": [
        "Cloud Calendars có hệ thống chia sẻ riêng với Reader, Writer và Owner. Reader cho xem và đồng bộ; Writer cho chỉnh sửa; Owner còn quản lý chia sẻ và truy cập bằng danh tính được mời. Các vai trò này không phải công tắc cho ba quyền khách của Google.",
        "Khi quyền riêng của Google quan trọng, kiểm tra sự kiện gốc trong Google Calendar. Thấy người tham dự trong Cloud Calendars không chứng minh có thể đổi mọi tùy chọn khách Google tại đó. Khi tìm nguyên nhân thiếu tùy chọn hay sửa thất bại, xác định rõ dịch vụ sở hữu và danh tính người nhận."
      ]
    },
    {
      "heading": "Xác minh kết quả và trách nhiệm",
      "body": [
        "Sau khi lưu, mở lại sự kiện gốc và kiểm tra cài đặt mong muốn. Khi phù hợp, nhờ đồng nghiệp có quyền xác nhận tài khoản của họ làm được gì. Không trao đổi mật khẩu hoặc gửi thông tin riêng của khách để kiểm tra truy cập cho nhanh.",
        "Phân biệt tham dự với quyền. Quyền chỉnh sửa, bản nhập riêng và phản hồi chấp nhận đã ghi nhận là những việc khác nhau. Trong Cloud Calendars, biên nhận chia sẻ không phải RSVP. Với cuộc họp quan trọng, yêu cầu phản hồi tham dự cần thiết và nói rõ ai chịu trách nhiệm thay đổi lịch."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Xác định tài khoản tổ chức và sự kiện gốc.",
    "Quyết định ai quản lý cuộc họp, mời thêm và xem khách.",
    "Kiểm tra quyền khách thực tế của sự kiện Google.",
    "Xem lại mặc định mà không cho rằng chúng sửa sự kiện hiện có.",
    "Coi vai trò Cloud Calendars là hệ thống quyền riêng.",
    "Mở lại sự kiện đã lưu và xác nhận tham dự riêng."
  ],
  "faq": [
    {
      "q": "Khách có thể đổi giờ cuộc họp của tôi không?",
      "a": "Google hỗ trợ cấp quyền sửa. Kiểm tra sự kiện và quyền của khách; đừng suy ra chỉ từ việc họ nhận lời mời."
    },
    {
      "q": "Mọi quyền khách chỉ được cài trên từng sự kiện sao?",
      "a": "Không. Google cũng có quyền mặc định. Kiểm tra mặc định cho lịch sắp tới và kiểm tra trực tiếp sự kiện quan trọng hiện có."
    },
    {
      "q": "Ẩn danh sách khách có xóa thông tin đã gửi không?",
      "a": "Không chứng minh email, mô tả, ảnh chụp hoặc bản sao độc lập trước đây đã bị xóa. Kiểm tra riêng nội dung thực tế đã phát đi."
    }
  ],
  "sourcesHeading": "Hướng dẫn nhà cung cấp và tài liệu thêm",
  "sources": [
    {
      "label": "Google: cộng tác sự kiện và quyền khách mặc định",
      "url": "https://support.google.com/a/users/answer/13293412?hl=en"
    },
    {
      "label": "Google: các trường quyền khách mời",
      "url": "https://developers.google.com/workspace/calendar/api/v3/reference/events"
    }
  ],
  "updated": "2026-10-21",
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "sharing-one-event-not-your-calendar"
  ]
},

  'google-calendars-that-never-reach-your-iphone': {
  "title": "Lịch Google không hiện trên iPhone: kiểm tra kết nối và lựa chọn",
  "short": "Lịch Google bị thiếu trên iPhone",
  "description": "Tìm lịch Google bị thiếu bằng cách kiểm tra quyền tài khoản, khả năng hiển thị và kết nối của Lịch Apple hoặc Cloud Calendars.",
  "lede": "Khi một lịch Google hiện còn lịch khác không, trước tiên xác định lịch trình bị thiếu có ở đâu. Quyền tài khoản, chọn lịch và dữ liệu sự kiện là những bước kiểm tra khác nhau. Hướng dẫn do Arte Soft, nhà phát triển Cloud Calendars, xuất bản.",
  "commonBelief": "Mọi lịch Google bị thiếu đều do một danh sách đồng bộ ẩn, và kết nối trực tiếp bảo đảm hiện tất cả.",
  "sections": [
    {
      "heading": "Xác nhận lịch có trong tài khoản này",
      "body": [
        "Mở Google Calendar trên web bằng cùng tài khoản định dùng trên điện thoại. Tìm chính lịch, không chỉ tiêu đề sự kiện quen thuộc. Hai tài khoản có thể có lịch tên giống nhau; lời mời gửi đến email công việc không chứng minh tài khoản cá nhân có quyền.",
        "Nếu lịch cũng không có ở đó, bắt đầu từ chủ sở hữu hoặc lời mời chia sẻ. Với quyền qua nhóm, xác nhận tư cách thành viên và nhóm được cấp quyền. Đừng xóa tài khoản trên điện thoại khi quyền truy cập gốc chưa rõ."
      ]
    },
    {
      "heading": "Phân biệt lịch bị ẩn với lịch vắng mặt",
      "body": [
        "Google hướng dẫn chọn lịch hiển thị qua menu trong ứng dụng Google Calendar. Lịch có tên nhưng chưa đánh dấu là vấn đề hiển thị. Nếu không có trong danh sách, cần kiểm tra điều khác như danh tính được mời, phê duyệt hoặc kết nối.",
        "Lời mời chia sẻ qua email và địa chỉ đăng ký là hai đường khác nhau. Google phân biệt thêm đăng ký mới bằng trình duyệt máy tính với mở lịch đã chia sẻ qua email. Giữ lời mời gốc nhưng không đưa liên kết riêng vào bài hỗ trợ công khai."
      ]
    },
    {
      "heading": "Xác định ứng dụng nhận dữ liệu Google thế nào",
      "body": [
        "Lịch Apple có thể kết nối qua tài khoản Google đã cấu hình trên thiết bị. Hướng dẫn Google bao gồm bật lịch cho tài khoản đó. Theo hướng dẫn hiện tại dành cho phiên bản iOS của bạn; đổi cài đặt ứng dụng riêng không giống đổi tài khoản thiết bị.",
        "Cloud Calendars cũng có đường đăng nhập Google trực tiếp. Xác định tài khoản và đường đang dùng trước khi thêm kết nối nữa. Nếu cùng lịch trình đến qua lịch thiết bị và kết nối trực tiếp, so sánh danh tính lịch trước khi kết luận sự kiện bị nhân đôi tại Google."
      ]
    },
    {
      "heading": "Kiểm tra lựa chọn Cloud Calendars mà không mặc định đầy đủ",
      "body": [
        "Trong Cloud Calendars, kiểm tra lịch thuộc tài khoản Google cần dùng và chọn lịch mong muốn. Đồng bộ Google có xét lựa chọn lịch. Đăng nhập thành công không tự chứng minh mọi lịch đã chọn hoặc mọi cập nhật đã hoàn tất.",
        "Kết nối trực tiếp là cách khác để nhận dữ liệu Google, không phải lời hứa hiện mọi lịch có thể truy cập. Nếu lịch có trên web Google nhưng thiếu trong Cloud Calendars, ghi tài khoản, tên lịch và cách kết nối cho hỗ trợ. Dùng nhà cung cấp gốc cho việc khẩn trong lúc kiểm tra."
      ]
    },
    {
      "heading": "Phân biệt thiếu lịch với thiếu ngày",
      "body": [
        "Nếu lịch có trong danh sách nhưng thiếu cuộc hẹn, so sánh ngày chính xác trong Google Calendar. Kiểm tra mục đó thuộc lịch đã chọn và cùng lần của cuộc họp lặp lại. Tiêu đề tương tự trong lịch khác không phải cùng bản ghi nguồn.",
        "Đừng mặc định ứng dụng tải toàn bộ lịch sử và tương lai xa. Đồng bộ Google của Cloud Calendars yêu cầu một khoảng ngày giới hạn. Tìm quá khứ không có kết quả không chứng minh sự kiện đã xóa khỏi Google; kiểm tra nguồn trước khi sửa hoặc tạo lại."
      ]
    },
    {
      "heading": "Nhờ hỗ trợ bằng so sánh cụ thể, không đặt lại tài khoản",
      "body": [
        "Ghi ứng dụng, loại tài khoản, tên lịch, ngày ví dụ và nơi thấy lịch trình. Nếu có lỗi, gửi nội dung sau khi bỏ thông tin riêng. Điều này phân biệt vấn đề quyền, lựa chọn và đồng bộ tốt hơn câu “tài khoản bị hỏng”.",
        "Với kế hoạch gấp, xác nhận sự kiện hiện tại với người tổ chức. Tránh xóa tài khoản, nhập bản sao lặp lại hoặc chuyển sự kiện giữa lịch để thử ban đầu. Khi hiểu vấn đề kết nối, dùng cùng ví dụ kiểm tra kết quả trước khi đổi thêm cài đặt."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "So sánh tài khoản và lịch cần dùng trong Google Calendar trên web.",
    "Kiểm tra lịch vắng mặt hay chỉ chưa được chọn.",
    "Xác định đồng bộ thiết bị, kết nối trực tiếp hay đăng ký.",
    "Kiểm tra lịch được chọn cho đúng tài khoản trong Cloud Calendars.",
    "So sánh ngày chính xác của một sự kiện tại nguồn gốc.",
    "Báo khác biệt mà không chia sẻ địa chỉ riêng hoặc đặt lại tài khoản."
  ],
  "faq": [
    {
      "q": "Đăng nhập Google trực tiếp có hiện mọi lịch không?",
      "a": "Đừng mặc định đầy đủ. Tài khoản, danh sách, lựa chọn và đồng bộ thành công đều quan trọng. So sánh lịch bị thiếu với Google Calendar trên web."
    },
    {
      "q": "Tôi có nên xóa tài khoản rồi thêm lại không?",
      "a": "Trước hết kiểm tra danh tính, quyền, hiển thị và kết nối. Kết nối lại không cấp quyền mà chủ sở hữu chưa cho."
    },
    {
      "q": "Không thấy sự kiện cũ nghĩa là nó đã bị xóa sao?",
      "a": "Không. Kiểm tra lịch Google gốc và ngày. Phạm vi ngày hoặc tìm kiếm của ứng dụng có thể khác lịch sử nhà cung cấp lưu."
    }
  ],
  "sourcesHeading": "Hướng dẫn nhà cung cấp và tài liệu thêm",
  "sources": [
    {
      "label": "Google: thêm sự kiện Google vào Lịch Apple",
      "url": "https://support.google.com/calendar/answer/99358?hl=en&co=GENIE.Platform%3DiOS"
    },
    {
      "label": "Google: đăng ký và hiển thị lịch",
      "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
    },
    {
      "label": "Google: cách hoạt động của danh sách lịch",
      "url": "https://developers.google.com/workspace/calendar/api/v3/reference/calendarList/list"
    }
  ],
  "updated": "2026-10-21",
  "seeAlso": [
    "why-a-shared-calendar-does-not-appear",
    "icloud-google-and-outlook-in-one-view"
  ]
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
