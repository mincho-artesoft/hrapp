import { LocalisedArticle } from '../types';

/** Sáu bài về Google: câu hỏi cụ thể, trả lời rõ ràng. */
export const GOOGLE_VI: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
    title: 'Ai thấy gì khi bạn chia sẻ lịch Google',
    short: 'Quyền chia sẻ của Google',
    description:
      'Các mức chia sẻ của Google đặt rất nhanh và rất dễ hiểu sai. Mỗi mức thực sự để lộ điều gì, nói thẳng ra.',
    lede: 'Gần như mọi vụ chia sẻ quá tay đều không phải lỗi phán đoán. Đó là ai đó chọn một mức nghe có vẻ khiêm tốn mà thực ra không.',
    commonBelief: 'Rằng «chỉ xem rảnh/bận» và «xem mọi chi tiết sự kiện» chênh nhau không bao nhiêu.',
    sections: [
      {
        heading: 'Các mức cách nhau xa hơn cái tên của chúng',
        body: [
          'Rảnh/bận cho thấy các khối thời gian không có tiêu đề. Mọi chi tiết cho thấy tiêu đề, địa điểm, ghi chú và khách mời — với phần lớn lịch, đó là một phần đáng kể đời sống của bạn.',
          'Thực hiện thay đổi cho phép chỉnh sửa. Quản lý chia sẻ cho phép ai đó chuyển lịch của bạn cho người khác, và đây mới là mức khiến người ta bất ngờ về sau.',
        ],
      },
      {
        heading: 'Chọn mà không phải cân nhắc lại mỗi lần',
        body: [
          'Với đồng nghiệp chỉ cần xếp lịch quanh bạn, rảnh/bận gần như luôn là đáp án đúng và gần như không bao giờ được chọn.',
          'Hãy dành mức chi tiết đầy đủ cho những lịch lập ra để chia sẻ, không phải cho cái lịch bạn đang sống trong đó.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Chi phí hằng tháng của gói nơi việc này được quản lý trong ứng dụng, tính bằng đô la',
    },
    practical: [
      'Mặc định rảnh/bận cho bất kỳ ai chỉ cần đặt giờ với bạn.',
      'Dành «thực hiện thay đổi» cho người thật sự sắp lịch thay bạn.',
      'Mỗi năm hai lần hãy xem lại ai đang có quyền; chia sẻ cứ dồn lại và chẳng có gì nhắc bạn.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'what-guests-can-do-to-your-event'],
  },

  'why-a-shared-calendar-does-not-appear': {
    title: 'Một lịch được chia sẻ với bạn mà không thấy đâu',
    short: 'Lịch chia sẻ không hiện ra',
    description:
      'Ai đó chia sẻ một lịch, bạn đã chấp nhận, và chẳng có gì thay đổi. Bốn lý do thường gặp, theo thứ tự đáng kiểm tra.',
    lede: 'Lời mời đã đến, liên kết đã bấm, mà lịch vẫn không có. Gần như luôn là một trong bốn điều, và không điều nào là chia sẻ bị hỏng.',
    commonBelief: 'Rằng chấp nhận một lịch chia sẻ là đưa nó vào điện thoại của bạn.',
    sections: [
      {
        heading: 'Chấp nhận thêm nó vào một tài khoản, không phải vào một thiết bị',
        body: [
          'Việc chia sẻ đáp xuống đúng tài khoản Google được gửi tới. Nếu bạn chấp nhận khi đang đăng nhập bằng tài khoản này còn điện thoại mang tài khoản khác, lịch vẫn nằm yên ở nơi bạn không nhìn tới.',
          'Ngay cả trong đúng tài khoản, một lịch vừa được thêm thường đến các thiết bị khác ở trạng thái tắt hơn là bật. Nó có đó, chỉ là chưa được đánh dấu — mà một lịch chưa đánh dấu trông y hệt một lịch không tồn tại.',
        ],
      },
      {
        heading: 'Hai lý do còn lại',
        body: [
          'Chia sẻ tới một danh sách thư hay địa chỉ nhóm hiếm khi đến được từng người; cần địa chỉ thực sự là một tài khoản Google. Còn lịch chia sẻ dạng liên kết là một đăng ký: nó rơi vào phần khác của danh sách và làm mới theo nhịp của bên phát hành chứ không tức thì.',
          'Trên iPhone, lịch Google đến ứng dụng có sẵn qua một danh sách đồng bộ riêng, và các lịch phụ mặc định nằm ngoài danh sách đó. Vì thế một tài khoản hiện lịch chính và lặng lẽ bỏ rơi bốn lịch quan trọng.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Số giờ giữa các lần một nguồn đã đăng ký xin làm mới',
      accounts: 'Số loại tài khoản mà một khung nhìn giữ chung, không cần tới những thứ này',
    },
    practical: [
      'Xem tài khoản nào đã chấp nhận chia sẻ trước khi xem bất cứ điều gì khác.',
      'Mở danh sách lịch trên thiết bị và tìm nó ở trạng thái tắt chứ đừng tìm cái vắng mặt.',
      'Nếu nó đến dạng liên kết, hãy chờ độ trễ thay vì xuất hiện ngay.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'google-calendars-that-never-reach-your-iphone'],
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
    practical: [
      'Xem danh sách đồng bộ của Google trước khi cho rằng tài khoản bị hỏng.',
      'Hãy tính rằng lịch đăng ký và lịch chia sẻ bị loại ra chứ không được đưa vào.',
      'Nếu bạn giữ hơn hai lịch, hãy đọc chúng bằng thứ hỏi thẳng Google.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'icloud-google-and-outlook-in-one-view'],
  },

  'taking-back-a-calendar-you-shared': {
    title: 'Lấy lại một lịch bạn đã chia sẻ',
    short: 'Thu hồi quyền truy cập',
    description:
      'Gỡ một người khỏi lịch sẽ chặn những gì đến sau. Điều nó không làm được là xóa đi những gì đã xảy ra.',
    lede: 'Kết thúc quyền truy cập chỉ một chạm. Quyết định xem một chạm có đủ hay không thì lâu hơn, vì chia sẻ để lại các bản sao.',
    commonBelief: 'Rằng gỡ một người là gỡ luôn những gì họ đã thấy.',
    sections: [
      {
        heading: 'Cái gì dừng lại và cái gì ở lại',
        body: [
          'Gỡ một người và lịch biến khỏi danh sách của họ, ngay lập tức và không có lời nhắn nào. Các sự kiện sau này không bao giờ tới được họ.',
          'Những gì không quay lại: lời mời họ đã có, sự kiện họ đã chép sang lịch riêng, mọi thứ đã xuất ra, và mọi thứ từng được trao địa chỉ bí mật. Quyền truy cập chấm dứt; trí nhớ thì không.',
        ],
      },
      {
        heading: 'Cái sống sót sau khi gỡ',
        body: [
          'Nếu ai đó từng có quyền quản lý chia sẻ, họ có thể đã thêm người khác. Gỡ họ ra vẫn để nguyên những người kia — đó là cách một lịch rốt cuộc được chia sẻ với người mà không ai nhớ đã mời.',
          'Vậy hãy đọc cả danh sách thay vì xóa một cái tên, và làm lúc chia tay chứ đừng để vài tháng sau. Chẳng có gì nhắc bạn, còn chia sẻ thì chỉ dồn thêm.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Chi phí hằng tháng của gói nơi việc này được quản lý, tính bằng đô la',
    },
    practical: [
      'Đọc toàn bộ danh sách quyền, không chỉ cái tên bạn định gỡ.',
      'Đặt lại địa chỉ bí mật nếu người đó từng có nó.',
      'Cứ cho rằng các bản sao còn đó: hãy chuyển những gì thực sự nhạy cảm đi thay vì giấu.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
