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
    title: 'Chia sẻ một sự kiện, không phải cả cuốn lịch',
    short: 'Chia sẻ một sự kiện',
    description: 'Việc gửi một sự kiện đơn lẻ hoạt động ra sao, người nhận thực sự nhận được gì, và vì sao họ không cần cài gì để xem.',
    lede: 'Chia sẻ lịch thường là được tất hoặc không gì cả: hoặc ai đó có quyền vào lịch của bạn, hoặc không. Gửi một bữa tối lẽ ra không nên đòi hỏi bên nào.',
    commonBelief: 'Rằng chia sẻ một sự kiện nghĩa là mở cho ai đó một ô cửa nhìn vào phần còn lại của tuần bạn.',
    sections: [
      {
        heading: 'Thứ thực sự được gửi đi',
        body: [
          'Khi bạn tạo một sự kiện, ứng dụng đề nghị chia sẻ nó. Thứ đi ra là một đường liên kết — qua email, qua tin nhắn, qua bất cứ thứ gì người kia có — và sau đường liên kết đó là một nguồn cấp lịch chứa đúng sự kiện ấy và không có gì khác.',
          'Đó không phải ảnh chụp màn hình, cũng không phải bản sao rồi sẽ cũ. Nếu giờ đổi, nguồn cấp đổi theo, và người bạn gửi thấy thay đổi mà bạn không phải gửi lại gì.',
        ],
      },
      {
        heading: 'Nó không phải là gì',
        body: [
          'Đường liên kết là một đăng ký lịch thông thường: Lịch của Apple đọc được, Google Lịch đọc được, Outlook đọc được. Trong tin nhắn còn kèm một App Clip cho ai muốn dùng ứng dụng — nó mở ra mà không cần cài. Đó là một cánh cửa, không phải trạm thu phí.',
          'Nó không tức thời: nguồn cấp đề nghị các ứng dụng xem lại mỗi giờ, và đó là một đề nghị chứ không phải quy tắc. Nó cũng không bí mật: đường liên kết mang hai mươi hai ký tự ngẫu nhiên, không ai đoán ra, nhưng ai cầm nó đều đọc được. Và hiện tại nó chỉ để đọc.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Số giờ giữa các lần đề nghị làm mới nguồn cấp',
      linkLength: 'Số ký tự ngẫu nhiên trong đường liên kết — chính điều đó khiến nó không đoán được',
      sharePrice: 'Chia sẻ tốn bao nhiêu',
    },
    practical: [
      'Hãy chia sẻ từ chính sự kiện, ngay sau khi tạo xong.',
      'Gửi đường liên kết qua kênh bạn vốn đã dùng với người đó.',
      'Nếu giờ đổi vào phút chót, hãy nhắn thêm chứ đừng chỉ dời sự kiện.',
      'Thu hồi đường liên kết khi sự kiện đã qua, như cách bạn thôi chia sẻ một tài liệu.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'weather-inside-your-calendar'],
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
