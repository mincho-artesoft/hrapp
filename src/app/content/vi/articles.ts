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
  "updated": "2026-10-23",
  "title": "Lịch có thời tiết trên iPhone và iPad: lên kế hoạch cho ngày của bạn trong một màn hình",
  "short": "Dùng lịch và thời tiết cùng nhau",
  "description": "So sánh lịch của bạn với thời tiết tại địa điểm đã chọn trên iPhone và iPad.",
  "lede": "Cloud Calendars đưa lịch trình và thời tiết của bạn vào cùng một ứng dụng trên iPhone hoặc iPad. Dùng lịch để chọn ngày và dùng chế độ xem thời tiết để xem địa điểm đã chọn cùng các giờ dự báo hiện có. Với kế hoạch ngoài trời, hãy kiểm tra đúng khoảng thời gian quan trọng thay vì chỉ dựa vào biểu tượng của cả ngày. Hướng dẫn này do Arte Soft, nhà phát triển ứng dụng, xuất bản.",
  "commonBelief": "Thời tiết hiển thị cạnh lịch sẽ tự động mô tả địa chỉ của mọi sự kiện, mọi giờ và mọi ngày trong tương lai.",
  "sections": [
    {
      "heading": "Chọn một câu hỏi lập kế hoạch thực tế",
      "body": [
        "Hãy bắt đầu với một sự kiện cụ thể, chẳng hạn một chuyến đi công viên vào buổi chiều. Xác định điều gì có thể thay đổi: thời gian, địa điểm, khâu chuẩn bị hoặc quyết định dùng phương án thay thế. Bạn không cần sắp xếp lại toàn bộ lịch chỉ vì biểu tượng của ngày đó cho thấy có mưa.",
        "Ghi lại thời gian bắt đầu và kết thúc thực tế của hoạt động, bao gồm cả thời gian chuẩn bị nếu có liên quan. Chế độ tổng quan lịch giúp tìm các ngày có thể chọn, còn việc kiểm tra dự báo liên quan đến một địa điểm và khoảng thời gian cụ thể. Hãy tách bạch hai việc này khi so sánh các lựa chọn."
      ]
    },
    {
      "heading": "Xác nhận địa điểm thời tiết trước khi đọc các giá trị",
      "body": [
        "Cloud Calendars cung cấp thời tiết cho vị trí hiện tại hoặc địa điểm đã chọn. Hãy kiểm tra địa điểm đang hiển thị thay vì cho rằng địa chỉ của sự kiện sẽ âm thầm làm thay đổi dự báo. Một sự kiện ở thành phố khác cần được đối chiếu với thời tiết của chính thành phố đó.",
        "Ví dụ, một người đi thăm có thể đang lên kế hoạch đến bảo tàng trong khi điện thoại vẫn ở nhà. Hãy đọc địa điểm dự báo và giờ địa phương của sự kiện trước khi so sánh chúng. Các giá trị trông có vẻ gần nhau không phải là bằng chứng rằng lịch trình và thời tiết đang dùng cùng một địa điểm."
      ]
    },
    {
      "heading": "Kiểm tra riêng phạm vi theo giờ và theo ngày",
      "body": [
        "Hãy dùng mục theo ngày để định hướng và các mục theo giờ hiện có cho câu hỏi liên quan đến một phần của ngày. Một lịch hẹn từ hai giờ đến năm giờ cần nhiều hơn một cái nhìn lướt qua một biểu tượng. Hãy kiểm tra xem các giờ liên quan có thực sự đang hiện diện hay không.",
        "Trong nguồn ứng dụng hiện tại, danh sách theo ngày nhận tối đa mười ngày WeatherKit được trả về. Điều đó tách biệt với việc điều hướng lịch và với các giờ hiện đang được cung cấp. Một sự kiện trong tương lai không làm mở rộng phạm vi dự báo thời tiết. Nếu khoảng thời gian của nó không có, hãy sắp xếp kiểm tra thời tiết vào lúc sau."
      ]
    },
    {
      "heading": "Hiểu ý nghĩa của từng giá trị thời tiết",
      "body": [
        "Apple mô tả dữ liệu WeatherKit như nhiệt độ, lượng mưa, gió và UV, trong đó một số sản phẩm chỉ có ở một số khu vực nhất định. Hãy đọc các giá trị sẵn có cho địa điểm bạn chọn thay vì mong đợi mọi sản phẩm thời tiết đều có ở mọi nơi.",
        "Hướng dẫn của Met Office cho thấy vì sao khoảng thời gian dự báo và định nghĩa của từng biến số lại quan trọng: một số giá trị đề cập đến một thời điểm, còn số khác đề cập đến cả một giai đoạn. Hãy dùng nhãn của đúng nhà cung cấp liên quan. Xác suất mưa, lượng mưa và thời gian mưa là những câu hỏi khác nhau, và không có một con số duy nhất nào quyết định mọi hoạt động ngoài trời."
      ]
    },
    {
      "heading": "Rà soát bản nháp được tạo từ một giờ thời tiết",
      "body": [
        "Ở nơi ứng dụng cho phép tạo sự kiện từ một giờ, ứng dụng sẽ mở một bản nháp. Nguồn hiện tại dùng múi giờ của địa điểm thời tiết, đề xuất thời lượng một giờ và chọn lịch mặc định cho sự kiện mới. Hãy kiểm tra từng giá trị trước khi lưu.",
        "Xác nhận tiêu đề, lịch đích, thời gian bắt đầu, thời gian kết thúc và địa điểm dự định. Việc chọn một mục dự báo không cấp quyền chỉnh sửa lịch dùng chung, thông báo cho địa điểm tổ chức hay đặt chỗ phòng. Hãy kiểm tra sự kiện đã lưu và có được mọi sự đồng ý mà kế hoạch đó cần."
      ]
    },
    {
      "heading": "Tách riêng phần minh hoạ trên website",
      "body": [
        "Phần minh hoạ thời tiết tương tác trên website dùng Open-Meteo. Ứng dụng dùng Apple WeatherKit. Bản minh hoạ trên web hữu ích để khám phá cách trình bày, nhưng địa điểm, dữ liệu và các ngày khả dụng của nó có thể khác với ứng dụng.",
        "Đối với một quyết định thực tế, hãy mở ứng dụng và đối chiếu sự kiện dự định với dự báo hiện có của nó. Nếu bạn thay đổi một kế hoạch dùng chung, hãy xác nhận người tổ chức, phạm vi lặp lại và những người tham gia. Hãy giữ một phương án thay thế đã thống nhất khi hoạt động phụ thuộc vào điều kiện thời tiết."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Xác định sự kiện và quyết định mà thời tiết có thể làm thay đổi.",
    "Xác nhận địa điểm thời tiết cùng ngày giờ địa phương của sự kiện.",
    "Xem riêng phạm vi theo giờ hiện có và phần tóm tắt theo ngày.",
    "Đọc xác suất, lượng và các giá trị liên quan khác theo đúng nhãn của chúng.",
    "Kiểm tra mọi chi tiết của bản nháp sự kiện và lịch đích trước khi lưu.",
    "Kiểm tra lại vào thời điểm cần quyết định và xác nhận trực tiếp mọi thay đổi dùng chung."
  ],
  "faq": [
    {
      "q": "Thời tiết cạnh lịch của tôi có đi theo địa chỉ của từng sự kiện không?",
      "a": "Đừng mặc định như vậy. Hãy xác nhận địa điểm thời tiết đang hiển thị và so sánh với nơi diễn ra; việc ở gần nhau trên màn hình không chứng minh chúng khớp nhau."
    },
    {
      "q": "Ứng dụng có dùng nhà cung cấp thời tiết của website không?",
      "a": "Không. Ứng dụng dùng Apple WeatherKit; phần minh hoạ trên website dùng Open-Meteo riêng biệt."
    },
    {
      "q": "Việc chọn một giờ dự báo có tự động lưu một sự kiện không?",
      "a": "Nó sẽ bắt đầu một bản nháp ở nơi có cung cấp thao tác đó. Hãy kiểm tra ngày, múi giờ, thời lượng, lịch và địa điểm của bản nháp, rồi lưu sự kiện bạn muốn."
    }
  ],
  "seeAlso": [
    "weather-calendar-history-versus-forecast-iphone",
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather",
    "weather-where-the-event-is",
    "planning-outdoors-without-being-rained-on"
  ],
  "sourcesHeading": "Nguồn chính thức và đọc thêm",
  "sources": [
    {
      "label": "Apple: thông tin dự báo WeatherKit và phạm vi khả dụng theo khu vực",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: địa điểm dự báo, các giai đoạn và các giá trị thời tiết",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ],
  "comparison": {
    "heading": "Chế độ xem thời tiết nào trả lời câu hỏi của bạn?",
    "columns": [
      "Câu hỏi của bạn",
      "Điều cần xem",
      "Điều nó không chứng minh"
    ],
    "rows": [
      {
        "cells": [
          "Hôm nay sắp có gì?",
          "Chế độ xem lịch theo ngày hoặc tuần cạnh thời tiết của địa điểm đã chọn.",
          "Rằng địa chỉ của mọi sự kiện sẽ tự động thay đổi địa điểm thời tiết."
        ]
      },
      {
        "cells": [
          "Mưa có thể ảnh hưởng đến sự kiện buổi chiều của tôi không?",
          "Dữ liệu theo giờ cho địa điểm diễn ra và toàn bộ khoảng thời gian của sự kiện.",
          "Rằng biểu tượng theo ngày mô tả mọi giờ."
        ]
      },
      {
        "cells": [
          "Tôi có thể lên kế hoạch cho tháng sau dựa vào thời tiết không?",
          "Lịch của bạn hiện tại, rồi kiểm tra lại dự báo gần ngày hơn.",
          "Rằng việc điều hướng lịch sẽ mở rộng phạm vi dự báo."
        ]
      },
      {
        "cells": [
          "Tôi có thể xem nhanh tổng quan ở màn hình chính không?",
          "Widget Màn hình chính phù hợp.",
          "Rằng mọi bố cục widget đều bao gồm sự kiện hoặc dự báo đầy đủ."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-right",
    "hook"
  ],
  "galleryCaption": "Màn hình Cloud Calendars thực tế: chế độ xem thời tiết và một ngày có các sự kiện. Hãy kiểm tra địa điểm và ngày đã chọn trong ứng dụng.",
  "actionHeading": "Lên kế hoạch với lịch trình và dự báo cùng nhau",
  "actionText": "Cloud Calendars dành cho iPhone và iPad. Hãy bắt đầu với các chế độ xem, thời tiết và đồng bộ Google Calendar có trong Base; Advanced loại bỏ quảng cáo, còn Premium bổ sung hỗ trợ Microsoft Calendar và Teams.",
  "articleLinks": [
    {
      "slug": "forecast-beside-every-event",
      "label": "Kiểm tra thời tiết theo giờ của một sự kiện"
    },
    {
      "slug": "the-widget-that-shows-what-is-next",
      "label": "Chọn một widget lịch và thời tiết"
    },
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "Đưa các tài khoản lịch vào một chế độ xem"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
  "updated": "2026-10-23",
  "title": "Xem lịch Google, iCloud và Outlook cùng nhau trên iPhone và iPad",
  "short": "Ba nhà cung cấp, một chế độ xem",
  "description": "Kết hợp các chế độ xem lịch và hiểu về quyền tài khoản, bản sao và yêu cầu gói.",
  "lede": "Để xem cùng lúc các sự kiện công việc và cá nhân, hãy kết nối đúng các tài khoản, chọn lịch của chúng và kiểm tra cùng một sự kiện trong một chế độ xem. Cloud Calendars hỗ trợ lập kế hoạch trên iPhone và iPad với iCloud và Google Calendar; hỗ trợ Microsoft Calendar có trong Premium. Việc xem các sự kiện cùng nhau khác với việc sao chép thời gian bận giữa các tài khoản của nhà cung cấp. Arte Soft, nhà phát triển, phát hành hướng dẫn này.",
  "commonBelief": "Đưa nhiều lịch vào một ứng dụng sẽ tự động đồng bộ tình trạng rảnh/bận, quyền chia sẻ và các bản sao sự kiện giữa chúng.",
  "sections": [
    {
      "heading": "Xác định tài khoản và lịch đứng sau từng sự kiện",
      "body": [
        "Hãy bắt đầu với một sự kiện thông thường từ mỗi nhà cung cấp. Ghi lại địa chỉ email đang đăng nhập, tên lịch và liệu bạn sở hữu sự kiện hay nhận được lời mời. Hai lịch cùng tên “Calendar” có thể thuộc các tài khoản hoàn toàn khác nhau. Màu sắc giúp bạn quét nhanh một tuần; còn tài khoản và lịch mới cho biết cần chỉnh sửa ở đâu.",
        "Ví dụ, một cuộc hẹn nha sĩ trong lịch iCloud cá nhân của bạn và một cuộc họp dự án trong Microsoft có thể xuất hiện cùng nhau cho bạn. Nhưng riêng điều đó không làm cho cuộc hẹn nha sĩ hiển thị với đồng nghiệp của bạn hoặc giữ khoảng thời gian đó trong các công cụ lên lịch của họ.",
        "Hãy xác định kết quả bạn muốn trước khi thay đổi một kết nối. Nếu muốn chuyển dữ liệu sự kiện sang tài khoản khác, hãy dùng mục “Chọn định dạng xuất lịch” bên dưới để tìm lộ trình chuyển phù hợp và kiểm tra các sự kiện đại diện trước khi tin vào đích đến. Nếu chỉ muốn so sánh thời gian, hãy giữ nguyên chủ sở hữu lịch hiện tại và hiển thị các nguồn đã chọn cùng nhau. Nếu một tài khoản khác cần nhận thông tin thời gian bận, mục “Cloud Calendars và OneCal theo quy trình làm việc” giải thích việc sao chép trạng thái rảnh/bận khác với tổng quan cá nhân như thế nào."
      ]
    },
    {
      "heading": "Kết nối qua lộ trình phù hợp",
      "body": [
        "Với iCloud, trước tiên hãy bật iCloud Calendar trên iPhone dưới Apple Account mong muốn. Hướng dẫn thiết lập của Apple giải thích các cài đặt trên thiết bị. Cloud Calendars truy cập các lịch có sẵn qua hệ thống lịch của iPhone và cần quyền truy cập lịch để đọc chúng. Chỉ kết nối tài khoản trên thiết bị khác là chưa đủ.",
        "Cloud Calendars cũng có các thao tác “Sign in with Google” và “Sign in with Microsoft”. Hãy kiểm tra bạn chọn tài khoản nào khi đăng nhập, rồi mở nhóm lịch của tài khoản đó và chọn các lịch bạn cần. Đăng nhập đúng nhà cung cấp nhưng bằng nhầm danh tính cá nhân hoặc công việc vẫn có thể tạo ra một danh sách lịch hoàn toàn hợp lệ nhưng ngoài dự kiến."
      ]
    },
    {
      "heading": "Hiểu rõ các gói mà không nhầm chúng với quyền",
      "body": [
        "Gói Base bao gồm đồng bộ Google Calendar và các chế độ xem lịch. Advanced bổ sung tính năng xóa quảng cáo cho Base. Premium bổ sung các tính năng Microsoft Calendar và Microsoft Teams. Hãy xem giá địa phương hiện tại và chu kỳ thanh toán trước khi mua.",
        "Một gói thay đổi những tính năng nào của ứng dụng khả dụng; nó không cấp quyền sở hữu lịch của người khác cho bạn. Google phân biệt giữa quyền xem sự kiện và quyền thay đổi chúng. Các chính sách của nơi làm việc và các quyền gắn với một lịch Microsoft vẫn được áp dụng. Một sự kiện hiển thị hoặc một trình chỉnh sửa khả dụng không chứng minh rằng nhà cung cấp sẽ chấp nhận một cập nhật."
      ]
    },
    {
      "heading": "Chế độ xem kết hợp có thể bao gồm các bản sao lịch",
      "body": [
        "Các kết nối Google và Microsoft sử dụng các bản sao lịch trong hệ thống lịch của iPhone để trình bày và đồng bộ sự kiện. Đừng cho rằng việc kết nối một tài khoản có nghĩa là không có bản sao nào tồn tại ngoài nhà cung cấp gốc. Đích dùng cho các bản sao đó có thể phụ thuộc vào các nguồn lịch có sẵn trên thiết bị.",
        "Nếu cùng một tài khoản cũng đến điện thoại qua một lộ trình khác, hãy kiểm tra tên lịch và nguồn trước khi coi các sự kiện lặp lại là những sự kiện riêng biệt. Tạm thời ẩn một lịch để xác định nó đang cung cấp phần hiển thị nào. Đừng xóa một sự kiện hoặc lịch chỉ để màn hình trông gọn hơn: một bản sao đã kết nối có thể gửi thay đổi ngược lại nhà cung cấp của nó."
      ]
    },
    {
      "heading": "Tiếp tục chọn lịch đích khi bạn tạo sự kiện",
      "body": [
        "Trước khi lưu, hãy kiểm tra lịch của sự kiện kỹ như kiểm tra ngày và giờ của nó. Với một cuộc hẹn gia đình, hãy chọn lịch mà gia đình thực sự dùng; với một cuộc họp công việc, hãy dùng đích công việc được cho phép. Việc nhìn thấy cả hai lịch cùng nhau không khiến một trong hai tự động trở thành đích cho mọi sự kiện mới.",
        "Thay đổi lịch của một sự kiện hoặc kéo nó giữa các lịch có thể là một lần di chuyển, chứ không phải một chế độ xem thứ hai vô hại. Hãy giữ các lời mời và cuộc họp định kỳ trong lịch vốn có của chúng khi bạn đang chẩn đoán sự cố hiển thị. Nếu cần thay đổi, trước tiên hãy xác định ai sở hữu sự kiện và lịch nào có thể chấp nhận nó."
      ]
    },
    {
      "heading": "Xác minh tổng quan trước khi dựa vào nó",
      "body": [
        "Hãy so sánh một sự kiện gần đây trong lịch riêng của nhà cung cấp với sự kiện tương ứng trong Cloud Calendars. Kiểm tra ngày, múi giờ, tiêu đề và lịch đã chọn. Với một lịch có thể chỉnh sửa mà bạn sở hữu, một sự kiện dùng để thử không có khách mời sẽ là cách kiểm tra tốt hơn so với sửa một cuộc họp đang diễn ra. Hãy xác nhận kết quả ở phía nhà cung cấp trước khi coi kết nối là đã sẵn sàng.",
        "Đừng dựa vào chế độ xem kết hợp để tự động tạo các khối bận ẩn danh trong một tài khoản khác. Nếu bạn cần đồng nghiệp thấy bạn không rảnh mà không nhìn thấy chi tiết cá nhân, hãy dùng một cách thiết lập trạng thái rảnh/bận đã được chấp thuận rõ ràng và xác minh từ phía họ. Tổng quan cá nhân rõ ràng và trạng thái sẵn sàng chia sẻ là hai nhiệm vụ khác nhau."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Liệt kê chính xác tài khoản và lịch cho một sự kiện từ mỗi nhà cung cấp.",
    "Bật các lịch iCloud mong muốn trên thiết bị và xem lại quyền truy cập lịch.",
    "Dùng đúng cách đăng nhập Google hoặc Microsoft và chọn các lịch dự định sử dụng.",
    "So sánh một sự kiện gần đây với chế độ xem của nhà cung cấp trước khi thay đổi bất cứ điều gì.",
    "Tạm thời ẩn một nguồn bị nghi trùng lặp; giữ nguyên các sự kiện gốc.",
    "Kiểm tra lịch đích trên mỗi sự kiện mới, và xác minh riêng mọi chia sẻ thời gian bận mà bạn cần."
  ],
  "faq": [
    {
      "q": "Đồng nghiệp ở chỗ làm có thấy các sự kiện cá nhân của tôi vì tôi hiển thị cả hai lịch không?",
      "a": "Việc hiển thị các lịch cùng nhau không phải là một chỉ dẫn chia sẻ hay một cầu nối tự động cho thời gian bận. Hãy kiểm tra cài đặt chia sẻ thực tế của từng lịch. Các kết nối nhà cung cấp có thể tạo bản sao lịch trên thiết bị, vì vậy chế độ xem kết hợp cũng không đảm bảo rằng dữ liệu sự kiện chỉ tồn tại ở nhà cung cấp gốc của nó."
    },
    {
      "q": "Vì sao tôi nhìn thấy một sự kiện nhưng không thể chỉnh sửa thành công?",
      "a": "Lịch có thể ở chế độ chỉ đọc, sự kiện có thể thuộc về người tổ chức khác hoặc nhà cung cấp có thể từ chối cập nhật. Hãy kiểm tra quyền sở hữu và quyền truy cập trong lịch của nhà cung cấp. Việc mua gói ứng dụng cao hơn không làm thay đổi các quyền đó."
    },
    {
      "q": "Tôi có nên kết nối cùng một tài khoản Google qua mọi cách khả dụng không?",
      "a": "Trước tiên, hãy kiểm tra xem tài khoản đó hiện đang xuất hiện trên điện thoại như thế nào. Nhiều cách kết nối có thể khiến việc xác định các bản sao lịch trở nên phức tạp. Hãy chọn cách kết nối bạn định dùng, xác minh các sự kiện của nó và ẩn phần hiển thị thừa trong khi kiểm tra thay vì xóa dữ liệu hoặc ngắt kết nối tài khoản ngay từ đầu."
    }
  ],
  "sourcesHeading": "Nguồn tham khảo và hướng dẫn thiết lập",
  "sources": [
    {
      "label": "Apple: thiết lập iCloud Calendar trên thiết bị của bạn",
      "url": "https://support.apple.com/guide/icloud/set-up-calendar-mme4d73a8727/icloud"
    },
    {
      "label": "Google: chia sẻ lịch và quyền truy cập",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: Outlook calendar API và dữ liệu hộp thư được hỗ trợ",
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
    "heading": "Chế độ xem kết hợp, đăng ký hay bản sao thời gian bận?",
    "columns": [
      "Điều bạn cần",
      "Điều cần kiểm tra",
      "Điều không nên giả định"
    ],
    "rows": [
      {
        "cells": [
          "Một chế độ xem cho nhiều tài khoản",
          "Tài khoản đã kết nối, lịch đã chọn và gói cần thiết.",
          "Rằng một màn hình dùng chung sẽ gộp quyền sở hữu hoặc quyền truy cập."
        ]
      },
      {
        "cells": [
          "Một chỉnh sửa sự kiện được gửi tới nhà cung cấp của nó",
          "Sự kiện gốc, quyền ghi và kết quả đã lưu tại nguồn.",
          "Rằng một chỉnh sửa cục bộ đang hiển thị chứng minh việc đồng bộ với nhà cung cấp đã thành công."
        ]
      },
      {
        "cells": [
          "Thời gian bận trong một tài khoản khác",
          "Một dịch vụ có quy tắc đồng bộ từ nguồn đến đích được nêu rõ.",
          "Rằng một chế độ xem kết hợp sẽ tạo các khoảng chặn lịch rảnh/bận cho đồng nghiệp."
        ]
      },
      {
        "cells": [
          "Một nguồn cấp lịch đã đăng ký",
          "Đơn vị phát hành, cách làm mới và trạng thái chỉ đọc.",
          "Rằng một đăng ký ICS là kết nối hai chiều có thể chỉnh sửa."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-left",
    "hook"
  ],
  "galleryDevice": "iPad",
  "galleryCaption": "Các chế độ xem lịch thực tế trên iPad minh họa việc rà soát lịch trình. Ảnh chụp màn hình không cho thấy chiều đồng bộ của nhà cung cấp hoặc quyền của tài khoản.",
  "actionHeading": "Xem các lịch của bạn cùng nhau trên iPhone và iPad",
  "actionText": "Đồng bộ Google Calendar được bao gồm trong Base. Advanced thêm tính năng bỏ quảng cáo; Premium bổ sung hỗ trợ Microsoft Calendar và Teams. Hãy xác nhận quyền của tài khoản độc lập với gói đã mua.",
  "articleLinks": [
    {
      "slug": "onecal-alternative-iphone-calendar-view-or-sync",
      "label": "So sánh chế độ xem kết hợp với quy tắc đồng bộ của OneCal"
    },
    {
      "slug": "fantastical-readdle-calendar366-iphone-comparison",
      "label": "So sánh quy trình làm việc với lịch trên iPhone"
    },
    {
      "slug": "weather-inside-your-calendar",
      "label": "Lập kế hoạch với thời tiết và sự kiện cùng nhau"
    }
  ]
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
