import { LocalisedArticle } from '../types';

/**
 * The four articles this language carries.
 *
 * Chosen one per intent -- weather, one view, sharing, price -- so the language
 * answers a whole question rather than a quarter of four. The numbers are not
 * here: they live once in article-facts.ts and join the prose by id, so a
 * translation can rewrite every sentence without touching a figure.
 */
export const ARTICLES_KO: Readonly<Record<string, LocalisedArticle>> = {
  'weather-inside-your-calendar': {
  "title": "날씨가 이미 들어 있는 달력",
  "short": "달력 안의 날씨",
  "description": "하루를 짜기 위해 앱을 두 개 보는 것이 왜 설계 결함인지, 그리고 예보가 옆에 놓이는 대신 화면의 일부인 달력은 어떤 모습인지.",
  "lede": "거의 모든 사람이 두 앱 사이에서 하루를 짠다. 달력은 어디에 있어야 하는지 알려주고, 날씨 앱은 도착했을 때 날씨가 어떨지 알려준다. 그 둘을 머릿속에서 겹쳐 두는 일은 아무도 자기가 하고 있다는 걸 알아채지 못하는 부분이다 — 토요일 하루를 통째로 날리기 전까지는.",
  "commonBelief": "달력은 약속을 위한 것이고 날씨 앱은 날씨를 위한 것이며, 둘을 따로 두는 게 그저 휴대전화가 원래 그런 거라는 생각.",
  "sections": [
    {
      "heading": "앱 두 개의 대가는 두 번의 탭이 아니다",
      "body": [
        "전환 자체는 아무 비용도 들지 않는다. 비싼 것은 그 둘이 무엇이 중요한지에 대해 결코 합의하지 않는다는 점이다. 달력은 토요일 열한 시부터 두 시간이 차 있다는 걸 안다. 날씨 앱은 열 시부터 한 시까지 비가 온다는 걸 안다. 어느 쪽도 그 두 사실을 합치면 그 블록을 옮겨야 한다는 뜻이 된다는 걸 모른다.",
        "통합 계층은 당신이다. 그건 바쁘지 않을 때까지만 작동한다. 그리고 바쁠 때야말로 계획을 지키는 일의 값어치가 가장 크다."
      ]
    },
    {
      "heading": "제공되는 예보",
      "body": [
        "Cloud Calendars는 선택한 위치에 제공되는 예보를 사용합니다. 시간별 데이터와 일별 데이터의 제공 기간은 다를 수 있습니다.",
        "캘린더에서 볼 수 있는 날짜가 예보 기간을 결정하지는 않습니다. 월 보기는 한 달 전체나 모든 일정에 예보가 있다는 뜻이 아닙니다."
      ]
    }
  ],
  "claims": {
    "price": "날씨 기능의 값"
  },
  "practical": [
    "예보로 계획을 세우기 전에 위치, 날짜, 제공되는 시간을 확인하세요."
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-a-subscription-actually-buys"
  ],
  "updated": "2026-10-21"
},

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google, Outlook을 한 화면에',
    short: '세 계정, 한 화면',
    description: '거의 모두의 삶은 개인 Apple 달력과 Google 계정, 회사의 Exchange로 나뉘어 있다. 그것들이 같은 격자에 들어오면 무엇이 달라지는가.',
    lede: '문제는 그 달력들 중 하나가 나쁘다는 게 거의 아니다. 셋인데 주는 하나라는 것이다.',
    commonBelief: '일과 사생활을 다른 앱에 두는 것이 경계이지 결함은 아니라는 생각.',
    sections: [
      {
        heading: '이중 예약은 구조의 문제다',
        body: [
          '약속이 세 곳에 흩어져 있으면 어느 곳도 당신이 비었는지 답할 수 없다. 합치는 단계는 당신이고, 게다가 기억에 의존해 실행된다. 보통은 누군가 답을 기다리는 동안에.',
          '그래서 전형적인 실패는 일정을 잊는 게 아니다. 볼 수 없었던 일정과 부딪치는 무언가를 수락하는 것이다.',
        ],
      },
      {
        heading: '하나의 격자가 주는 것',
        body: [
          '모든 계정이 같은 주에, 출처별로 색이 나뉘어, 그 자리에서 고쳐진다. 어느 앱에 답이 있는지 궁금해할 일이 없어진다. 질문이 복수형이기를 그치기 때문이다.',
          'iCloud와 Google은 무료 단계에서 동기화된다. Microsoft 계정 — Outlook과 Exchange — 은 유료에 속한다. 그 연결에는 다른 것들에 없는 반복 비용이 들기 때문이다.',
        ],
      },
    ],
    claims: {
      accounts: '한 화면에 들어가는 계정 종류의 수',
      premiumMonthly: 'Microsoft를 더하는 월 비용(달러)',
    },
    practical: [
      '개인 계정을 먼저, 충돌을 일으키는 쪽을 나중에 더한다.',
      '범주가 아니라 계정으로 색을 나눈다. 한눈에 필요한 건 출처다.',
      '남들이 이미 읽고 있는 달력에 계속 쓴다.',
    ],
    seeAlso: ['weather-inside-your-calendar', 'what-a-subscription-actually-buys'],
  },

  'sharing-one-event-not-your-calendar': {
  "updated": "2026-10-21",
  "title": "일정 하나 공유하기: 링크와 접근 권한 선택",
  "short": "일정 하나 공유하기",
  "description": "전체 캘린더 대신 일정 하나를 공유하세요. Reader, Writer, Owner 권한과 미리보기, 업데이트, 접근 철회의 한계를 알아봅니다.",
  "lede": "저녁 약속 정보를 보내는 일, 공동 주최자에게 편집을 맡기는 일, 참석 답변을 받는 일은 다릅니다. 필요한 일을 정한 뒤 공유 방식을 고르세요. 이 안내는 Cloud Calendars 개발사 Arte Soft가 작성했습니다.",
  "commonBelief": "모든 일정 링크는 즉시 업데이트되고 답변을 기록하는 읽기 전용 캘린더 구독이다.",
  "sections": [
    {
      "heading": "일정 하나의 세부 정보를 확인하세요",
      "body": [
        "단일 일정 공유는 발신자의 전체 캘린더가 아닌 해당 일정만 대상으로 합니다. 보내기 전에 제목, 시간대, 장소, 메모, 회의 URL을 확인하세요. 한 손님에게 필요한 정보가 널리 배포할 링크에도 적절한 것은 아닙니다.",
        "저녁 약속을 공유하려고 진료 예약이 있는 캘린더 전체를 공유할 필요는 없습니다. 다만 저녁 약속의 장소와 링크는 일정과 함께 전달됩니다. 주변 캘린더의 비공개 설정에 기대지 말고 일정 자체를 확인하세요."
      ]
    },
    {
      "heading": "미리보기, 이메일 또는 QR 방식을 선택하세요",
      "body": [
        "Cloud Calendars는 서로 다른 공유 경로를 제공합니다. App Clip은 일정 미리보기를 보여주며, 그 경험에서 일정을 추가하려면 전체 앱이 필요합니다. 이메일과 QR 초대는 Cloud Calendars 열기를 안내하는 웹페이지를 사용합니다. 모두를 서로 바꿔 쓸 수 있는 구독 URL로 설명하지 마세요.",
        "앱의 동기화 공유를 사용하려면 발신자가 로그인합니다. 링크나 QR 코드는 전달될 수 있으므로 내용에 적합한 곳에만 보내세요. QR 코드는 링크 전달 방식이지 누가 열었는지를 증명하지 않습니다."
      ]
    },
    {
      "heading": "필요한 권한만 부여하세요",
      "body": [
        "이메일 초대에서 Reader, Writer, Owner를 선택할 수 있습니다. Reader는 보기와 동기화, Writer는 편집, Owner는 추가로 공유와 접근 관리를 할 수 있습니다. 같은 초대 보기의 세 이름이 아니라 실제 영향을 주는 선택입니다. 일정 확인만 필요한 사람에게는 Reader를 사용하세요.",
        "일정을 바꿔야 하는 공동 주최자에게 Writer를 선택하세요. 다른 사람의 접근까지 관리해야 할 때만 Owner를 주세요. 높은 권한을 받으려면 수신자가 올바른 계정으로 로그인해야 합니다. 익명 수신자는 신원이 확인된 공동 소유자가 아닙니다."
      ]
    },
    {
      "heading": "수신자가 추가하는 과정을 이해하세요",
      "body": [
        "전체 앱에서 공유 일정을 추가하려면 캘린더 접근 허용과 쓰기 가능한 대상 캘린더가 필요합니다. 저장 전 대상을 확인해야 합니다. 받은 사본을 공유 일정과 연결해 이후 업데이트를 받을 수 있습니다.",
        "이는 일반 ICS 파일을 다른 캘린더로 가져오는 것과 다릅니다. 가져오기는 사본을 만들고, 구독은 피드를 주기적으로 확인합니다. 앱 초대 대신 ICS 피드를 보낸다면 이를 명확히 설명하고 수신자의 캘린더가 지원하는지 확인하세요."
      ]
    },
    {
      "heading": "변경 사항을 확인한 뒤 의존하세요",
      "body": [
        "동기화 공유는 후속 편집이나 취소를 전달할 수 있지만 수신 기기에 이를 받을 기회가 있어야 합니다. 피드 새로고침 힌트는 전달 기한이 아닙니다. 오프라인 기기, 갱신되지 않은 구독, 별도로 가져온 사본은 이전 정보를 보여줄 수 있습니다.",
        "시작 직전에 저녁 약속이 바뀌면 일정을 업데이트하고 손님에게 직접 연락하세요. 새 시간을 확인해 달라고 요청하세요. 업데이트 전송과 참석 답변 수신은 별도 단계입니다."
      ]
    },
    {
      "heading": "사본 삭제를 약속하지 말고 접근을 관리하세요",
      "body": [
        "수신자 권한을 검토하고 불필요한 권한을 제거하세요. 수신자 제거와 피드 링크 철회는 서로 다른 작업이며, 스크린샷이나 메시지 또는 모든 캘린더 사본을 원격으로 지운다고 설명해서는 안 됩니다.",
        "링크가 의도한 대상 밖으로 퍼졌다면 어떤 링크나 권한인지 식별하세요. 권한을 바꾼 뒤 해당 경로를 확인하세요. 앞으로는 나중에 철회해 정보를 되찾으려 하지 말고 널리 배포하는 링크에서 사적인 세부 정보를 제외하세요."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "세부 정보를 검토하고 보기, 편집, 참석 답변 중 목적을 정하세요.",
    "공유 경로를 선택하고 필요할 때 로그인하세요.",
    "보는 사람은 Reader, 해당 책임이 있을 때만 Writer나 Owner를 부여하세요.",
    "추가할 때 시간과 대상 캘린더를 확인하도록 요청하세요.",
    "급한 변경은 일정을 업데이트하고 직접 메시지를 보내세요.",
    "공유 종료 시 수신자 권한과 링크 접근을 따로 검토하세요."
  ],
  "faq": [
    {
      "q": "일정 하나를 공유하면 전체 캘린더가 공개되나요?",
      "a": "동기화 단일 일정 공유는 그 일정만 대상으로 하지만 일정 자체의 정보는 선택한 경로로 공개됩니다. 내용을 확인하고 하나만 보낼 때 전체 캘린더 초대를 보내지 마세요."
    },
    {
      "q": "수신자가 일정을 바꿀 수 있나요?",
      "a": "적절한 Writer 또는 Owner 권한으로 지원되는 로그인 절차를 사용하면 가능합니다. Reader는 보기와 동기화용입니다. 일반 ICS 구독은 같은 편집 방식이 아닙니다."
    },
    {
      "q": "사람을 제거하면 이미 받은 모든 것이 취소되나요?",
      "a": "그런 보장을 가정하면 안 됩니다. 접근 변경은 지원되는 공유 관계에 적용되지만 저장된 사본, 스크린샷, 메시지는 남을 수 있습니다. 공유 피드 URL도 별도로 고려해야 합니다."
    }
  ],
  "sourcesHeading": "수신 방식 참고 자료",
  "sources": [
    {
      "label": "Apple: App Clips 개요",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google: 일정 가져오기와 제한",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft: 캘린더 가져오기와 구독의 차이",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": []
},

  'what-a-subscription-actually-buys': {
  "updated": "2026-10-21",
  "title": "구독이 실제로 사주는 것",
  "short": "구독이 사주는 것",
  "description": "구독이 사주는 것: Base, Advanced, Premium.",
  "lede": "이 가이드는 Cloud Calendars 개발사인 Arte Soft가 발행합니다.",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "Base에는 Google Calendar 동기화, Google Meet, 캘린더 보기, 날씨, 위젯이 포함됩니다. 무료 플랜에는 광고가 표시될 수 있습니다."
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Advanced는 Base 기능을 포함하고 광고를 제거합니다. Premium은 Advanced에 Microsoft Calendar와 Microsoft Teams 지원을 추가합니다.",
        "구독으로 다른 사람의 캘린더 편집 권한을 얻거나 업무 계정의 제한을 우회할 수는 없습니다."
      ]
    },
    {
      "heading": "구매 및 취소 정보",
      "body": [
        "구매 전에 현지 가격, 결제 기간, 갱신 조건을 확인하세요.",
        "Apple에서 결제하는 구독은 설정 → 사용자 이름 → 구독에서 관리합니다. 상태와 만료일을 확인하세요. 갱신 취소는 앱이나 캘린더 데이터 삭제와 별개입니다. 만료 후에도 유료 기능을 계속 사용할 수 있다고 가정하지 마세요."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "구매 전에 현지 가격, 결제 기간, 갱신 조건을 확인하세요.",
    "구독으로 다른 사람의 캘린더 편집 권한을 얻거나 업무 계정의 제한을 우회할 수는 없습니다."
  ],
  "faq": [
    {
      "q": "갱신을 중지하려면 어떻게 하나요?",
      "a": "Apple에서 결제하는 구독은 설정 → 사용자 이름 → 구독에서 관리합니다. 상태와 만료일을 확인하세요. 갱신 취소는 앱이나 캘린더 데이터 삭제와 별개입니다. 만료 후에도 유료 기능을 계속 사용할 수 있다고 가정하지 마세요."
    }
  ],
  "sourcesHeading": "구매 및 취소 정보",
  "sources": [
    {
      "label": "Apple: 갱신을 중지하려면 어떻게 하나요?",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view"
  ]
},
};
