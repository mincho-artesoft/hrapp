import { LocalisedArticle } from '../types';

/**
 * The four articles this language carries.
 *
 * Chosen one per intent -- weather, one view, sharing, price -- so the language
 * answers a whole question rather than a quarter of four. The numbers are not
 * here: they live once in article-facts.ts and join the prose by id, so a
 * translation can rewrite every sentence without touching a figure.
 */
export const ARTICLES_VI: Readonly<Record<string, LocalisedArticle>> = {
  "month-view-on-a-bigger-screen": {
  "updated": "2026-10-22",
  "title": "Lịch tháng trên iPad và iPhone: xem ngày rồi kiểm tra chi tiết",
  "short": "Dùng chế độ tháng mà không bỏ sót chi tiết",
  "description": "So sánh ngày trên iPad hoặc iPhone. Kiểm tra sự kiện ẩn, lịch được chọn và giờ chính xác trước khi chuyển cuộc hẹn chung hoặc lặp lại.",
  "lede": "Chế độ tháng cho biết công việc rơi vào ngày nào, nhưng ít phù hợp để chứng minh một giờ cụ thể còn trống. Chọn ngày từ tổng quan rồi xem kỹ ngày và sự kiện trước khi xác nhận. Hướng dẫn do Arte Soft, nhà phát triển Cloud Calendars, xuất bản.",
  "commonBelief": "Lưới tháng lớn hơn hiển thị mọi chi tiết và ngày trông trống chứng minh mọi người đều rảnh.",
  "sections": [
    {
      "heading": "Xác định cần ngày hay giờ chính xác",
      "body": [
        "Dùng tháng để so sánh hạn dự án, chuyến đi và cuộc hẹn gia đình qua nhiều tuần. Khi cần biết hai cuộc hẹn có trùng lúc 14:30 không, chuyển sang ngày hoặc tuần để xem giờ bắt đầu và kết thúc. Ô tháng không có thang thời gian như lưới giờ.",
        "Ví dụ, người chọn ngày hội thảo có thể tránh tuần đi xa trước. Sau đó kiểm tra ngày đề xuất: việc đã có, chuẩn bị, di chuyển và giờ phải kết thúc. Ô trông thoáng chỉ là ngày cần xem xét, không phải đặt chỗ đã xác nhận hay lời khẳng định người khác rảnh."
      ]
    },
    {
      "heading": "Đọc số sự kiện bổ sung",
      "body": [
        "Ô tháng hiện tại của Cloud Calendars hiển thị số nhãn sự kiện giới hạn và số lượng bổ sung khi còn sự kiện cùng ngày. Tiêu đề chỉ có một dòng nên có thể bị rút ngắn. Mở ngày hoặc sự kiện khi cần tiêu đề đầy đủ hay các công việc còn lại.",
        "Màn hình iPad lớn hơn có thể dễ đọc, nhưng đừng cho rằng diện tích lớn xóa mọi giới hạn hiển thị. Cửa sổ hẹp hoặc chữ lớn thay đổi lượng nội dung vừa chỗ. Trên iPhone cũng cần mở ngày trước khi coi các nhãn đang thấy là toàn bộ lịch trình."
      ]
    },
    {
      "heading": "Kiểm tra tháng, lịch được chọn và ngày liền kề",
      "body": [
        "Đọc tháng và năm đang hiển thị trước khi chọn ngày. Lưới có thể kèm ngày của tháng liền kề để đủ hàng. Trong Cloud Calendars, dùng điều hướng tháng và kiểm tra ngày đã chọn thay vì chỉ dựa vào vị trí ô.",
        "Kiểm tra lịch nào được chọn. Ẩn việc công ty giúp xem kế hoạch gia đình, nhưng cũng bỏ các việc ấy khỏi tổng quan đó. Khi tìm sự kiện trùng, tạm ẩn một nguồn rồi so sánh; đừng xóa cuộc hẹn chỉ để tháng bớt chật."
      ]
    },
    {
      "heading": "Mở sự kiện trước khi đổi kế hoạch chung",
      "body": [
        "Trong chi tiết, xác nhận tiêu đề, chủ sở hữu hoặc lịch, giờ địa phương và thời lượng. Màu giúp nhìn nhanh nhưng không thay thế việc biết tài khoản hay quyền chỉnh sửa. Lời mời nhìn thấy khác với cuộc hẹn do chính bạn tổ chức.",
        "Cloud Calendars có thao tác kéo thả trong tháng để chuyển sự kiện sang ngày khác. Trước khi dùng với việc thật, xác định ngày muốn chuyển và phạm vi lặp. Sau thay đổi được phép, mở lại để kiểm tra; cử chỉ trên thiết bị không chứng minh nhà cung cấp hay mọi người đã chấp nhận kế hoạch mới."
      ]
    },
    {
      "heading": "Kiểm tra riêng lịch lặp và múi giờ",
      "body": [
        "Nếu chỉ chuyển buổi học tuần này, đừng vô tình đổi cả quy luật tương lai. Đọc lựa chọn phạm vi lặp rồi kiểm tra cả lần đã đổi và một lần sau. Tháng giúp so sánh ngày lặp, nhưng phạm vi chỉnh sửa quyết định tác động.",
        "Với chuyến đi hoặc họp khác múi giờ, kiểm tra rõ ngày và giờ địa phương. Chuyển sang ngày khác không tự chuyển đổi giờ họp dự định. Kiểm tra thay đổi giờ mùa hè nếu liên quan và xác nhận giờ đã thống nhất với mọi người."
      ]
    },
    {
      "heading": "Không nhầm giao diện lớn hơn với sản phẩm khác",
      "body": [
        "Lịch Apple có lựa chọn hiển thị tháng riêng; Teamup hướng dẫn bộ chế độ khác nhau cho trình duyệt và di động. Các tùy chọn thuộc sản phẩm tương ứng. Đừng tìm cấu hình web Teamup hay menu Lịch Apple trong Cloud Calendars chỉ vì cùng tên chế độ.",
        "Một tháng cuộc hẹn cũng không phải một tháng dự báo thời tiết. Với hoạt động ngoài trời, kiểm tra riêng địa điểm, ngày và giờ có dự báo. Lưu cuộc hẹn cuối cùng vào đúng lịch và xác nhận thay đổi trực tiếp với người tham gia."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Chọn ngày trong tháng rồi kiểm tra giờ ở chế độ ngày hoặc tuần.",
    "Mở ngày có số bổ sung hoặc tiêu đề rút ngắn.",
    "Kiểm tra tháng, năm và lịch được chọn trước khi coi ngày là trống.",
    "Xác nhận lịch, giờ, thời lượng và quyền chỉnh sửa.",
    "Đọc phạm vi lặp và kiểm tra lần đã lưu sau khi chuyển.",
    "Kiểm tra thời tiết riêng và xác nhận thay đổi với người tham gia."
  ],
  "faq": [
    {
      "q": "Chế độ tháng iPad có hiện đầy đủ mọi cuộc hẹn không?",
      "a": "Đừng mặc định như vậy. Cloud Calendars giới hạn nhãn trong ô và hiện số bổ sung. Mở ngày và sự kiện để xem toàn bộ lịch trình."
    },
    {
      "q": "Ngày trống nghĩa là tôi rảnh sao?",
      "a": "Trước hết kiểm tra lịch được chọn, ngày và dữ liệu tài khoản liên quan có sẵn không. Tổng quan chỉ phản ánh thông tin hiện có và đang hiển thị."
    },
    {
      "q": "Chuyển sự kiện lặp chỉ đổi ngày đó sao?",
      "a": "Đọc phạm vi chỉnh sửa thay vì mặc định. Sau khi lưu, kiểm tra lần đã đổi và một lần sau, rồi xác nhận đúng ý định."
    }
  ],
  "sourcesHeading": "So sánh mô tả chế độ chính thức",
  "sources": [
    {
      "label": "Apple: chế độ tháng, nhiều ngày và danh sách",
      "url": "https://support.apple.com/en-ca/guide/iphone/iphfd1054569/ios"
    },
    {
      "label": "Teamup: chế độ xem và cấu hình trình duyệt so với ứng dụng",
      "url": "https://calendar.teamup.com/kb/how-to-use-calendar-views/"
    }
  ],
  "seeAlso": []
},

  'weather-inside-your-calendar': {
  "title": "Một cuốn lịch đã có sẵn thời tiết bên trong",
  "short": "Thời tiết bên trong cuốn lịch",
  "description": "Vì sao phải mở hai ứng dụng để sắp xếp một ngày là một lỗi thiết kế, và một cuốn lịch mà dự báo là một phần của khung nhìn chứ không đứng bên cạnh thì trông như thế nào.",
  "lede": "Gần như ai cũng sắp xếp ngày của mình giữa hai ứng dụng. Lịch nói cần có mặt ở đâu; ứng dụng thời tiết nói lúc tới đó trời thế nào. Giữ cả hai cùng lúc trong đầu là phần việc không ai nhận ra mình đang làm — cho tới khi mất trắng một ngày thứ Bảy.",
  "commonBelief": "Rằng lịch là để ghi hẹn còn ứng dụng thời tiết là để xem trời, và tách riêng chúng đơn giản là cách điện thoại vận hành.",
  "sections": [
    {
      "heading": "Cái giá của hai ứng dụng không phải là hai lần chạm",
      "body": [
        "Chuyển qua lại chẳng tốn gì. Cái đắt là hai bên không bao giờ thống nhất điều gì mới quan trọng. Lịch của bạn biết thứ Bảy lúc mười một giờ có hai tiếng đã kín; ứng dụng thời tiết biết mưa từ mười giờ đến một giờ. Không bên nào biết rằng hai dữ kiện ấy cộng lại nghĩa là phải dời khối thời gian đó.",
        "Lớp kết nối chính là bạn. Nó chạy được cho tới khi bạn bận, mà đó đúng là lúc việc bảo vệ kế hoạch đáng giá nhất."
      ]
    },
    {
      "heading": "Dự báo hiện có",
      "body": [
        "Cloud Calendars sử dụng dự báo hiện có cho địa điểm đã chọn. Dữ liệu theo giờ và theo ngày có thể bao phủ các khoảng thời gian khác nhau.",
        "Các ngày có thể xem trong lịch không quyết định phạm vi dự báo. Chế độ xem tháng không có nghĩa là có dự báo cho cả tháng hoặc mọi sự kiện."
      ]
    }
  ],
  "claims": {
    "price": "Các tính năng thời tiết tốn bao nhiêu"
  },
  "practical": [
    "Kiểm tra địa điểm, ngày và các giờ có dữ liệu trước khi lập kế hoạch theo dự báo."
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-a-subscription-actually-buys"
  ],
  "updated": "2026-10-21"
},

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google và Outlook trong cùng một khung nhìn',
    short: 'Ba tài khoản, một khung nhìn',
    description: 'Cuộc sống của gần như ai cũng bị chia giữa lịch Apple cá nhân, một tài khoản Google và một Exchange của công ty. Điều gì thay đổi khi chúng vào chung một lưới.',
    lede: 'Vấn đề gần như không bao giờ là một trong các cuốn lịch đó tệ. Vấn đề là bạn có ba cuốn mà chỉ có một tuần.',
    commonBelief: 'Rằng giữ công việc và đời sống riêng ở hai ứng dụng khác nhau là một ranh giới chứ không phải một thiếu sót.',
    sections: [
      {
        heading: 'Trùng lịch là chuyện thuộc về cấu trúc',
        body: [
          'Nếu các cam kết của bạn sống ở ba nơi, không nơi nào nói được bạn có rảnh hay không. Bước hợp nhất chính là bạn, và bạn chạy nó bằng trí nhớ, thường là trong lúc ai đó đang chờ câu trả lời.',
          'Vì vậy thất bại kinh điển không phải quên một sự kiện; mà là nhận lời một việc đâm vào một sự kiện bạn không thể thấy.',
        ],
      },
      {
        heading: 'Một cái lưới duy nhất mang lại điều gì',
        body: [
          'Tất cả tài khoản trong cùng một tuần, tô màu theo nguồn gốc, sửa được ngay tại chỗ. Bạn thôi phải tự hỏi ứng dụng nào giữ câu trả lời, vì câu hỏi thôi ở dạng số nhiều.',
          'iCloud và Google đồng bộ ở bản miễn phí. Tài khoản Microsoft — Outlook và Exchange — thuộc bản trả phí, vì kết nối đó có chi phí lặp lại mà những cái kia không có.',
        ],
      },
    ],
    claims: {
      accounts: 'Số loại tài khoản vừa trong một khung nhìn',
      premiumMonthly: 'Chi phí hằng tháng để thêm Microsoft, tính bằng đô la',
    },
    practical: [
      'Thêm tài khoản cá nhân trước, rồi mới đến cái gây ra va chạm.',
      'Tô màu theo tài khoản chứ không theo hạng mục: nguồn gốc mới là thứ cần thấy trong một cái liếc.',
      'Cứ tiếp tục ghi vào cuốn lịch mà người khác vốn đã đọc.',
    ],
    seeAlso: ['weather-inside-your-calendar', 'what-a-subscription-actually-buys'],
  },

  'sharing-one-event-not-your-calendar': {
  "updated": "2026-10-21",
  "title": "Chia sẻ một sự kiện: chọn đúng liên kết và quyền truy cập",
  "short": "Chia sẻ một sự kiện",
  "description": "Chia sẻ một sự kiện mà không chia sẻ cả lịch. Hiểu quyền Reader, Writer và Owner, bản xem trước, cập nhật và giới hạn của việc thu hồi quyền.",
  "lede": "Gửi thông tin bữa tối, cho người đồng tổ chức chỉnh sửa và thu thập câu trả lời tham dự là các việc khác nhau. Xác định nhu cầu rồi chọn cách chia sẻ. Hướng dẫn này do Arte Soft, nhà phát triển Cloud Calendars, biên soạn.",
  "commonBelief": "Mọi liên kết sự kiện đều là đăng ký lịch chỉ đọc, cập nhật tức thì và ghi nhận câu trả lời.",
  "sections": [
    {
      "heading": "Bắt đầu bằng việc kiểm tra một sự kiện",
      "body": [
        "Chia sẻ một sự kiện chỉ bao gồm sự kiện đó, không phải toàn bộ lịch của người gửi. Trước khi gửi, kiểm tra tiêu đề, múi giờ, địa điểm, ghi chú và URL cuộc họp. Thông tin hữu ích với một khách có thể không phù hợp trong liên kết được phát rộng rãi.",
        "Ví dụ, chia sẻ bữa tối không đòi hỏi chia sẻ lịch chứa các cuộc hẹn khám bệnh. Tuy nhiên, địa điểm và liên kết của bữa tối vẫn đi cùng sự kiện. Hãy kiểm tra chính sự kiện thay vì dựa vào tính riêng tư của lịch chứa nó."
      ]
    },
    {
      "heading": "Chọn bản xem trước, lời mời email hoặc mã QR",
      "body": [
        "Cloud Calendars có các cách chia sẻ riêng biệt. App Clip hiển thị bản xem trước; cần ứng dụng đầy đủ để thêm sự kiện qua trải nghiệm đó. Lời mời email và QR dùng trang web có tùy chọn mở Cloud Calendars. Không nên coi các liên kết này là URL đăng ký lịch có thể thay thế lẫn nhau.",
        "Người gửi đăng nhập để dùng quy trình chia sẻ đồng bộ của ứng dụng. Liên kết hoặc mã QR có thể bị chuyển tiếp, nên chỉ gửi tới nơi phù hợp với nội dung. Mã QR truyền tải liên kết, không chứng minh ai đã mở."
      ]
    },
    {
      "heading": "Chỉ cấp quyền người nhận cần",
      "body": [
        "Lời mời qua email cho phép chọn Reader, Writer hoặc Owner. Reader có thể xem và đồng bộ; Writer có thể chỉnh sửa; Owner còn có thể chia sẻ và quản lý quyền truy cập. Đây là các quyền có tác động khác nhau, không phải ba tên gọi cho việc xem. Dùng Reader nếu người nhận chỉ cần lịch trình.",
        "Chọn Writer cho người đồng tổ chức cần thay đổi sự kiện. Chỉ chọn Owner khi họ cũng cần quản lý quyền của người khác. Người nhận phải đăng nhập bằng đúng danh tính để nhận quyền nâng cao. Người nhận ẩn danh không phải đồng sở hữu đã được xác định."
      ]
    },
    {
      "heading": "Hiểu cách người nhận thêm sự kiện",
      "body": [
        "Trong ứng dụng đầy đủ, thêm sự kiện được chia sẻ cần quyền truy cập lịch và một lịch đích cho phép ghi. Người nhận nên kiểm tra đích trước khi lưu. Bản sao nhận được sau đó có thể liên kết với sự kiện được chia sẻ để nhận cập nhật sau này.",
        "Điều này khác với nhập tệp ICS thông thường vào lịch khác. Nhập tạo ra bản sao, còn đăng ký sẽ định kỳ kiểm tra nguồn cấp. Nếu gửi nguồn cấp ICS thay vì lời mời của ứng dụng, hãy giải thích rõ và xác nhận lịch của người nhận hỗ trợ cách đó."
      ]
    },
    {
      "heading": "Kiểm tra thay đổi trước khi dựa vào chúng",
      "body": [
        "Chia sẻ đồng bộ có thể truyền các chỉnh sửa hoặc hủy bỏ sau đó, nhưng thiết bị người nhận phải có cơ hội nhận chúng. Gợi ý chu kỳ làm mới nguồn cấp không phải hạn chót giao thông tin. Thiết bị ngoại tuyến, đăng ký chưa làm mới hoặc bản sao nhập độc lập vẫn có thể hiển thị thông tin cũ.",
        "Nếu bữa tối đổi giờ sát lúc bắt đầu, cập nhật sự kiện và liên hệ trực tiếp với khách. Yêu cầu họ xác nhận giờ mới. Gửi cập nhật và nhận câu trả lời tham dự là hai bước riêng."
      ]
    },
    {
      "heading": "Quản lý quyền mà không hứa xóa mọi bản sao",
      "body": [
        "Rà soát quyền của người nhận và bỏ quyền không còn cần thiết. Xóa một người nhận và thu hồi liên kết nguồn cấp là hai thao tác khác nhau. Không nên mô tả thao tác nào là xóa từ xa ảnh chụp màn hình, tin nhắn hoặc mọi bản sao trong lịch.",
        "Nếu liên kết đã lan ra ngoài nhóm dự kiến, xác định liên kết hoặc quyền cấp nào liên quan. Kiểm tra lại cách truy cập đó sau khi thay đổi quyền. Với sự kiện sau này, không đưa thông tin riêng tư vào liên kết phát rộng rãi thay vì trông chờ thu hồi để lấy lại thông tin."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Kiểm tra chi tiết và xác định cần xem, chỉnh sửa hay câu trả lời tham dự.",
    "Chọn đúng cách chia sẻ và đăng nhập khi cần.",
    "Dùng Reader cho người xem; chỉ cấp Writer hoặc Owner theo trách nhiệm tương ứng.",
    "Yêu cầu người nhận kiểm tra giờ và lịch đích khi thêm sự kiện.",
    "Khi có thay đổi khẩn, cập nhật sự kiện và gửi tin nhắn trực tiếp.",
    "Khi kết thúc chia sẻ, kiểm tra riêng quyền người nhận và truy cập qua liên kết."
  ],
  "faq": [
    {
      "q": "Chia sẻ một sự kiện có lộ cả lịch của tôi không?",
      "a": "Cách chia sẻ đồng bộ một sự kiện chỉ giới hạn ở sự kiện đó. Nhưng chi tiết riêng của sự kiện vẫn được cung cấp qua cách đã chọn. Kiểm tra nội dung và đừng gửi lời mời cả lịch khi chỉ định gửi một sự kiện."
    },
    {
      "q": "Người nhận có thể thay đổi sự kiện không?",
      "a": "Có, nếu họ có quyền Writer hoặc Owner phù hợp và dùng quy trình đăng nhập được hỗ trợ. Reader dành cho xem và đồng bộ. Đăng ký ICS thông thường không phải cùng cơ chế chỉnh sửa."
    },
    {
      "q": "Xóa một người có thu hồi mọi thứ họ đã nhận không?",
      "a": "Không nên mặc định có bảo đảm đó. Thay đổi quyền tác động tới quan hệ chia sẻ được hỗ trợ, nhưng bản sao đã lưu, ảnh chụp và tin nhắn có thể còn lại. URL nguồn cấp chia sẻ cũng cần được xem xét riêng."
    }
  ],
  "sourcesHeading": "Tài liệu về các lựa chọn cho người nhận",
  "sources": [
    {
      "label": "Apple: tổng quan về App Clips",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google: nhập sự kiện và các giới hạn",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft: nhập lịch hoặc đăng ký lịch",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "what-guests-can-do-to-your-event",
    "taking-back-a-calendar-you-shared"
  ]
},

  'what-a-subscription-actually-buys': {
  "updated": "2026-10-21",
  "title": "Một gói thuê bao thực sự mua được gì",
  "short": "Thuê bao mua được gì",
  "description": "Thuê bao mua được gì: Base, Advanced, Premium.",
  "lede": "Hướng dẫn này do Arte Soft, nhà phát triển Cloud Calendars, xuất bản.",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "Base gồm đồng bộ Google Calendar, Google Meet, các chế độ xem lịch, thời tiết và tiện ích. Gói miễn phí có thể hiển thị quảng cáo."
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Advanced gồm Base và loại bỏ quảng cáo. Premium gồm Advanced và bổ sung Microsoft Calendar cùng Microsoft Teams.",
        "Đăng ký không cấp quyền sửa lịch của người khác hoặc vượt qua hạn chế của tài khoản công việc."
      ]
    },
    {
      "heading": "Thông tin mua và hủy",
      "body": [
        "Trước khi mua, hãy kiểm tra giá tại địa phương, kỳ thanh toán và điều kiện gia hạn.",
        "Với đăng ký do Apple tính phí, mở Cài đặt → tên của bạn → Đăng ký. Kiểm tra trạng thái và ngày hết hạn. Hủy gia hạn khác với xóa ứng dụng hoặc dữ liệu lịch; đừng mặc định các tính năng trả phí vẫn dùng được sau khi hết hạn."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Trước khi mua, hãy kiểm tra giá tại địa phương, kỳ thanh toán và điều kiện gia hạn.",
    "Đăng ký không cấp quyền sửa lịch của người khác hoặc vượt qua hạn chế của tài khoản công việc."
  ],
  "faq": [
    {
      "q": "Làm sao để dừng gia hạn?",
      "a": "Với đăng ký do Apple tính phí, mở Cài đặt → tên của bạn → Đăng ký. Kiểm tra trạng thái và ngày hết hạn. Hủy gia hạn khác với xóa ứng dụng hoặc dữ liệu lịch; đừng mặc định các tính năng trả phí vẫn dùng được sau khi hết hạn."
    }
  ],
  "sourcesHeading": "Thông tin mua và hủy",
  "sources": [
    {
      "label": "Apple: Làm sao để dừng gia hạn?",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view"
  ]
},
};
