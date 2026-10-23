import type { LocalisedArticle } from '../types';

export const PRIORITY_KO: Readonly<Record<string, LocalisedArticle>> = {
  "forecast-beside-every-event": {
    "title": "iPhone 및 iPad에서 캘린더 이벤트의 시간별 날씨 확인하기",
    "short": "이벤트 시간대의 날씨",
    "description": "이벤트의 장소, 날짜, 시간을 제공되는 날씨 예보와 맞춰 확인하세요.",
    "lede": "캘린더 이벤트의 날씨를 확인하려면 세 가지를 맞춰야 합니다. 장소, 현지 날짜, 그리고 이벤트의 시작부터 종료까지의 시간대입니다. Cloud Calendars에서는 날씨 장소를 선택하고 제공되는 시간을 확인하세요. 이벤트 주소와 근처에 보이는 날씨 아이콘만으로는 이 둘이 일치한다고 볼 수 없습니다. 이 가이드는 개발사 Arte Soft가 제공합니다.",
    "commonBelief": "캘린더의 일별 날씨 아이콘이 이벤트에 연결된 예보와 같은 기능이라고 생각하는 것.",
    "sections": [
      {
        "heading": "장소와 날짜부터 확인하세요",
        "body": [
          "예정된 위치의 예보를 열고 그 날짜를 캘린더 항목과 비교하세요. 캘린더 날씨는 선택한 날씨 위치를 반영할 수 있으므로, 이벤트 주소가 이를 자동으로 결정한다고 가정하지 말고 해당 이벤트에 맞는 위치인지 확인해야 합니다.",
          "다음 달 이벤트는 해당 날짜의 날씨 데이터가 아직 없더라도 미리 존재할 수 있습니다. 이벤트는 그대로 두고 날짜가 가까워지면 예보를 다시 확인하세요. 날씨 항목이 없다고 해서 맑다는 뜻은 아닙니다."
        ]
      },
      {
        "heading": "시간 단위 질문에는 시간별 상세 정보를 사용하세요",
        "body": [
          "일별 요약과 시간별 예보는 서로 다른 질문에 답합니다. 이벤트가 2시부터 5시까지라면, 일별 아이콘 하나만 전체 상황으로 보지 말고 그 시간대를 포함하는 이용 가능한 시간별 정보를 확인하세요.",
          "해당 시간대의 일부만 제공된다면 나머지는 미확정으로 두세요. 앱은 사용자가 만드는 모든 이벤트에 대해 항상 완전한 시간별 날씨를 제공한다고 약속하지 않으며, 이 가이드도 어떤 이벤트를 열든 항상 전체 날씨 시간대가 표시된다고 보장하지 않습니다."
        ]
      },
      {
        "heading": "확률, 양, 시점을 구분하세요",
        "body": [
          "확인하는 값의 라벨을 읽으세요. 강수 확률은 강수량이나 지속 시간이 아닙니다. 마찬가지로 시간별 값과 일별 요약은 서로 다른 기간을 다루므로, 두 개의 가능한 시간을 비교할 때는 같은 기간끼리 비교하세요.",
          "하나의 백분율을 보편적인 진행/취소 기준으로 여기지 말고, 자신의 계획에 맞는 대안을 선택하세요. 날씨 정보는 바뀔 수 있으므로 결정을 내려야 할 시점에 다시 확인하세요."
        ]
      },
      {
        "heading": "날씨를 기준으로 이벤트를 저장하기 전에 검토하세요",
        "body": [
          "앱은 예보의 특정 시간에서 이벤트 초안을 시작할 수 있습니다. 저장하기 전에 초안의 날짜, 시작 시간, 종료 시간, 대상 캘린더를 검토하세요. 예보를 선택했다고 해서 올바른 일정을 만들고 있는지 확인하는 과정이 대체되지는 않습니다.",
          "캘린더 접근 권한이나 대상 캘린더 때문에 저장할 수 없다면, 그 권한 문제는 날씨 접근 권한과 별개로 해결하세요. 예보를 찾았다고 해서 공유 캘린더의 편집 권한이 생기는 것은 아닙니다."
        ]
      },
      {
        "heading": "요약만으로 충분하지 않다면 전체 예보를 사용하세요",
        "body": [
          "야외 활동이라면 그 활동과 실제로 선택한 위치에 관련된 변수를 확인하세요. 현재 날씨 위젯이나 홈페이지 데모는 앱에서 제공되는 예보 시간대를 확인하는 일을 대신할 수 없습니다.",
          "차이가 보인다면 먼저 위치와 타임스탬프를 비교하세요. 제공업체, 선택한 위치, 예보 기간이 다르면 캘린더 이벤트가 바뀌지 않았더라도 표시가 달라질 수 있습니다."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "위치와 이벤트 날짜를 확인하세요.",
      "활동 시간 전반에 걸친 이용 가능한 시간대를 확인하세요.",
      "확률과 양은 서로 다른 값으로 읽으세요.",
      "저장하기 전에 이벤트 초안을 검토하세요."
    ],
    "seeAlso": [
      "weather-inside-your-calendar",
      "planning-outdoors-without-being-rained-on"
    ],
    "updated": "2026-10-23",
    "faq": [
      {
        "q": "모든 이벤트에 완전한 예보가 제공되나요?",
        "a": "아니요. 제공 범위는 선택한 위치와 이용 가능한 날짜 및 시간에 따라 달라집니다."
      },
      {
        "q": "날씨 아이콘은 이벤트 주소에 맞춰 표시되나요?",
        "a": "이벤트 옆에 가깝게 표시된다고 해서 그렇게 추정하지 마세요. 날씨 위치는 별도로 확인하세요."
      },
      {
        "q": "시간을 탭하면 새 이벤트가 저장되나요?",
        "a": "지원되는 경우 이벤트 초안이 시작됩니다. 저장하기 전에 날짜, 시간, 캘린더를 검토하세요."
      }
    ],
    "sourcesHeading": "날씨 제공업체 및 위치 설정",
    "sources": [
      {
        "label": "Apple: WeatherKit 예보 및 지역별 제공 여부",
        "url": "https://developer.apple.com/weatherkit/"
      },
      {
        "label": "Apple: 개인정보 보호 및 위치 서비스",
        "url": "https://support.apple.com/en-us/102515"
      }
    ],
    "comparison": {
      "heading": "야외 이벤트 전에 해보는 실용적인 점검",
      "columns": [
        "확인 항목",
        "예시",
        "판단"
      ],
      "rows": [
        {
          "cells": [
            "장소",
            "이벤트가 다른 도시에 있습니다.",
            "날씨 보기에서 해당 목적지를 선택하고 이름을 확인하세요."
          ]
        },
        {
          "cells": [
            "시간대",
            "활동이 14:00부터 16:00까지 이어집니다.",
            "두 시간 모두 확인하고, 관련 준비 시간이나 이동 시간도 함께 보세요."
          ]
        },
        {
          "cells": [
            "제공 범위",
            "필요한 시간 중 일부만 제공됩니다.",
            "계획은 잠정적으로 유지하고 나중에 다시 확인하세요."
          ]
        },
        {
          "cells": [
            "저장된 이벤트",
            "날씨 시간에서 초안을 시작합니다.",
            "저장하기 전에 날짜, 시간대, 길이, 대상 캘린더를 검토하세요."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-right",
      "week-left"
    ],
    "galleryCaption": "날씨 보기와 주간 보기는 같은 계획 작업의 서로 다른 부분을 보여 줍니다. 예보 위치는 이벤트 위치와 별도로 확인하세요.",
    "actionHeading": "실제 이벤트와 예보를 대조해 확인하세요",
    "actionText": "iPhone 또는 iPad의 Cloud Calendars에서 제공되는 예보와 일정을 함께 검토하세요. 날씨는 선택에 참고가 되지만, 이벤트를 자동으로 옮기거나 참가자와의 변경을 대신 확정해 주지는 않습니다.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "캘린더 보기와 날씨 보기 이해하기"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "빠른 Home Screen 개요 선택하기"
      },
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "내 일정에 연결된 캘린더 확인하기"
      }
    ]
  },
  "the-widget-that-shows-what-is-next": {
    "updated": "2026-10-23",
    "title": "iPhone 및 iPad용 캘린더 위젯: 예정된 이벤트와 날씨",
    "short": "Home Screen에서 예정된 이벤트 보기",
    "description": "예정된 이벤트, 날짜 또는 날씨에 맞는 Cloud Calendars 위젯을 선택하세요.",
    "lede": "Home Screen에 예정된 이벤트를 표시하려면 Calendar Events 또는 Calendar Events Large를 선택하세요. 날짜와 날씨를 함께 보려면 Calendar & Weather를 선택하세요. 이 레이아웃들은 서로 다른 질문에 답하므로, 추가하기 전에 기기에서 제공되는 미리보기를 확인하세요. 이 가이드는 Cloud Calendars의 개발사인 Arte Soft가 제공합니다.",
    "sections": [
      {
        "heading": "먼저 이벤트 레이아웃을 선택하세요",
        "body": [
          "Cloud Calendars 위젯 갤러리에서 Calendar Events는 중간 크기의 이벤트 목록 레이아웃입니다. Calendar Events Large는 다가오는 일정 이벤트를 더 넉넉하게 보여줍니다. Calendar & Weather는 날짜와 날씨를 보여주는 별도의 레이아웃이며, 작은 크기에서는 다음 이벤트 행이 표시된다고 보장되지 않습니다. 기기에서는 이름이 번역되어 표시될 수 있습니다.",
          "iPhone에서는 홈 화면의 빈 공간을 길게 누른 뒤 편집과 위젯 추가를 선택하고, Cloud Calendars를 찾아 원하는 레이아웃을 선택하세요. 추가하기 전에 미리보기를 비교해 보세요. Apple의 위젯 안내는 이 시스템 갤러리를 설명하며, 앱 내부의 캘린더 보기와는 별개입니다."
        ]
      },
      {
        "heading": "iPad에서 위젯 추가 및 확인하기",
        "body": [
          "iPad에서는 Apple의 홈 화면 위젯 갤러리를 사용하세요. 배경을 길게 누르고 편집을 연 다음 위젯 추가를 선택합니다. Cloud Calendars를 검색하고, 제공되는 스타일과 크기를 확인한 뒤 필요한 레이아웃을 추가하고 위치를 정한 다음 완료를 탭하세요. 사용 중인 iPadOS 버전에 표시되는 조작 방법을 따르세요. 미리보기가 보인다고 해서 캘린더 데이터가 로드되었다는 뜻은 아닙니다.",
          "일정 이벤트가 필요하다면 Calendar Events 또는 Calendar Events Large를 선택하세요. 설치된 앱이 제공하는 스타일을 비교해 보세요. 날짜와 날씨 타일은 이벤트 목록과는 다른 목적의 보기입니다.",
          "그 iPad에서 Cloud Calendars를 열고, 선택된 캘린더에 있는 시작 시간이 지정된 앞으로의 일정 이벤트 하나를 찾으세요. iPhone에서 올바르게 보인다고 해서 iPad의 계정, 접근 권한 또는 로드된 데이터까지 확인되는 것은 아닙니다. 제목, 날짜, 시작 시간을 비교한 뒤 위젯이 다르면 아래의 표시 대상 및 업데이트 확인으로 계속 진행하세요."
        ]
      },
      {
        "heading": "무엇이 다가오는 일정으로 간주되는지 확인하세요",
        "body": [
          "이벤트 표시는 선택된 캘린더와 시작 시간이 지정된 미래의 일정 이벤트를 사용합니다. 하루 종일 이벤트와 이미 시작 시간이 지난 이벤트는 이 다가오는 일정 목록에서 제외됩니다. 따라서 생일이나 이미 진행 중인 회의는 앱에는 보여도 여기에는 나타나지 않을 수 있습니다.",
          "예를 들어 오늘 일정이 하루 종일 표시되는 여행 메모 하나뿐이라면, 다가오는 일정 목록이 비어 있어도 그 여행 메모가 사라진 것은 아닙니다. 하루 전체 일정은 앱에서 확인하세요. 마찬가지로 다음 시간 지정 이벤트가 내일 또는 그 이후일 수도 있으니, 모든 행이 오늘 일정이라고 단정하지 말고 날짜를 확인하세요."
        ]
      },
      {
        "heading": "이벤트 누락과 표시 행 부족을 구분하세요",
        "body": [
          "위젯에는 표시할 수 있는 다가오는 일정 이벤트 수가 제한되어 있습니다. 앞선 이벤트들이 행을 채우고 있으면, 더 뒤의 이벤트는 앱에 존재하고 표시 대상 조건을 충족하더라도 보이지 않을 수 있습니다. 더 큰 이벤트 레이아웃은 더 많은 행을 보여줄 수 있지만, 그래도 전체 캘린더를 모두 보여주지는 않습니다.",
          "선택된 캘린더에서 가장 가까운 미래의 시간 지정 이벤트부터 확인하세요. 그것은 보이는데 더 뒤의 이벤트만 보이지 않는다면, 나머지 일정은 앱에서 확인하세요. 가장 가까운 표시 대상 이벤트도 없다면 캘린더 선택, 접근 권한, 업데이트 확인으로 계속 진행하세요. 더 뒤의 항목을 보이게 하려고 이벤트를 옮기거나 삭제하지 마세요."
        ]
      },
      {
        "heading": "먼저 앱과 비교하세요",
        "body": [
          "Cloud Calendars를 열고 앞으로 예정된 특정 시간 지정 이벤트 하나를 찾으세요. 그 이벤트가 속한 캘린더가 선택되어 있는지, 그리고 앱에 필요한 캘린더 접근 권한이 있는지 확인하세요. 제목, 날짜, 시작 시간을 위젯과 비교하세요. 앱에도 이벤트가 없다면 먼저 계정 또는 동기화를 점검해야 합니다.",
          "명확한 예시가 필요하다면 본인이 소유한 캘린더에 영향 없는 테스트 이벤트를 만들어 사용하세요. 시작 시간은 미래로 설정하고 알아보기 쉬운 제목을 붙이세요. 홈 화면 테스트만을 위해 실제 초대를 변경하거나 계정을 제거하는 일은 피하세요."
        ]
      },
      {
        "heading": "고정된 마감 시간을 가정하지 말고 업데이트를 고려하세요",
        "body": [
          "위젯은 저장된 정보를 표시하며, 열려 있는 앱처럼 계속 실행되지 않습니다. 업데이트 일정은 Apple이 제어합니다. 앱을 열어 이벤트를 확인하면 새로 비교할 기준은 생기지만, 위젯이 반드시 몇 초 안에 바뀌어야 하는지를 정확히 뜻하지는 않습니다.",
          "앱은 계속 올바른데 위젯만 잘못 표시된다면, 레이아웃, 선택된 캘린더, 이벤트 시간, 앱/iOS 버전을 기록해 두세요. 빈 목록, 오래된 이벤트, 잘못된 시간은 서로 다른 증상입니다. 어떤 현상이 보이는지 구체적으로 기록하세요."
        ]
      },
      {
        "heading": "날씨는 별도의 요약으로 읽으세요",
        "body": [
          "날짜 옆의 날씨는 각 이벤트의 장소와 시작 시간에 연결된 예보가 아닙니다. 야외 일정 전에 날씨 보기를 열어 예상 장소와 시간을 확인하세요. 현재 상태 아이콘만으로는 나중 회의 시간의 기상 조건을 판단할 수 없습니다.",
          "이 위젯은 빠르게 상황을 파악하는 용도로 사용하세요. 하루 종일 일정, 이벤트 세부 정보, 전체 일정을 봐야 하는 판단은 전체 캘린더에서 확인하세요."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "이벤트 목록을 보려면 Calendar Events 또는 Calendar Events Large를 선택하세요.",
      "선택된 캘린더에서 미래의 시간 지정 이벤트를 확인하세요.",
      "위젯 문제를 점검하기 전에 앱에서 해당 날짜와 시간을 먼저 비교하세요.",
      "캘린더 데이터를 삭제하지 말고 지속되는 차이를 기록하세요."
    ],
    "faq": [
      {
        "q": "왜 제 생일이 보이지 않나요?",
        "a": "다가오는 일정 목록에는 하루 종일 이벤트가 포함되지 않습니다. 생일과 기타 날짜만 있는 항목은 전체 캘린더에서 확인하세요."
      },
      {
        "q": "작은 위젯에 다음 회의가 표시되나요?",
        "a": "작은 Calendar & Weather 레이아웃은 날짜와 날씨를 표시합니다. 일정 이벤트를 보려면 이벤트 목록 레이아웃을 선택하세요."
      },
      {
        "q": "다가오는 일정이 없으면 오늘은 한가한 건가요?",
        "a": "아니요. 하루 종일 이벤트, 진행 중인 이벤트, 선택되지 않은 캘린더, 오래된 정보 때문에 그런 결론이 달라질 수 있습니다."
      }
    ],
    "sourcesHeading": "출처 및 Apple 안내",
    "sources": [
      {
        "label": "Apple: iPhone에서 위젯 추가 및 편집하기",
        "url": "https://support.apple.com/118610"
      },
      {
        "label": "Apple: 위젯을 최신 상태로 유지하기",
        "url": "https://developer.apple.com/documentation/widgetkit/keeping-a-widget-up-to-date"
      },
      {
        "label": "Apple: iPad에서 위젯 추가, 편집 및 제거하기",
        "url": "https://support.apple.com/guide/ipad/add-edit-and-remove-widgets-ipadb0de8630/ipados"
      }
    ],
    "seeAlso": [
      "choosing-a-widget-size",
      "a-countdown-to-your-next-meeting",
      "calendar-on-apple-watch"
    ],
    "comparison": {
      "heading": "실제로 필요한 표시 방식을 선택하세요",
      "columns": [
        "표시 방식",
        "이럴 때 사용",
        "의존하기 전에 확인할 점"
      ],
      "rows": [
        {
          "cells": [
            "Calendar Events",
            "다가오는 시간 지정 이벤트를 간단히 보는 컴팩트한 보기입니다.",
            "이벤트가 선택된 캘린더에 속해 있고 아직 시작되지 않았는지 확인하세요."
          ]
        },
        {
          "cells": [
            "Calendar Events Large",
            "다가오는 일정 이벤트를 더 넉넉하게 볼 수 있습니다.",
            "더 큰 레이아웃도 표시 가능한 행 수는 제한됩니다."
          ]
        },
        {
          "cells": [
            "Calendar & Weather",
            "날짜와 날씨를 빠르게 확인하는 개요입니다.",
            "작은 레이아웃에서는 다가오는 이벤트 행이 표시된다고 보장되지 않습니다."
          ]
        },
        {
          "cells": [
            "Live Activity",
            "지원되는 iPhone 화면 영역에서 별도로 표시되는 다음 이벤트 카운트다운입니다.",
            "이것은 홈 화면 위젯도 아니고 전용 잠금 화면 위젯 레이아웃도 아닙니다."
          ]
        }
      ]
    },
    "galleryKinds": [
      "widgets",
      "live"
    ],
    "galleryCaption": "홈 화면 위젯과 Live Activity는 서로 다른 표시 방식입니다. 필요한 정보에 맞는 레이아웃을 선택하세요.",
    "actionHeading": "일정에서 유용한 부분을 홈 화면에 배치하세요",
    "actionText": "Cloud Calendars를 열어 알고 있는 미래의 시간 지정 이벤트를 확인한 뒤, iPhone 또는 iPad에 알맞은 위젯을 추가하세요. 전체 캘린더를 확인하는 곳은 여전히 앱입니다.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "일정 옆의 날씨 확인하기"
      },
      {
        "slug": "forecast-beside-every-event",
        "label": "야외 일정의 시간대 확인하기"
      },
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "연결된 캘린더 계정 확인하기"
      }
    ]
  },
  "onecal-alternative-iphone-calendar-view-or-sync": {
    "updated": "2026-10-23",
    "title": "Cloud Calendars와 OneCal 중 무엇을 선택할까요? 통합 보기 또는 캘린더 동기화 선택하기",
    "short": "워크플로 기준으로 보는 Cloud Calendars와 OneCal",
    "description": "보기 방식, 복사된 이벤트, 모바일 제어, 요금제를 기준으로 OneCal과 Cloud Calendars를 비교해 보세요.",
    "lede": "필요한 결과에 따라 선택하세요. 여러 일정을 함께 검토할지, 원본 이벤트를 수정할지, 아니면 다른 계정에 바쁨 시간을 복사할지에 따라 다릅니다. Cloud Calendars는 iPhone 및 iPad용 계획 보기 기능을 제공하고, OneCal은 통합 보기와 별도의 Calendar Sync 규칙을 문서로 안내합니다. 이 비교 문서는 Cloud Calendars의 개발사인 Arte Soft가 게시했습니다.",
    "commonBelief": "Google, iCloud, Outlook 캘린더를 보여 주는 두 제품은 가용성, 이벤트 수정, 사본을 반드시 같은 방식으로 동기화한다.",
    "sections": [
      {
        "heading": "개요 보기와 다른 계정에 변경 사항 반영하기 중 선택하기",
        "body": [
          "개인 일정과 업무 미팅을 나란히 보려는 목적이라면 통합 보기가 필요합니다. 업무 캘린더에도 개인 일정의 바쁨 블록이 있어야 한다면, 정의된 소스-대상 워크플로가 필요합니다. 첫 번째 결과가 두 번째를 자동으로 보장하지는 않습니다.",
          "Cloud Calendars는 선택한 캘린더를 iPhone 및 iPad의 계획 보기로 가져옵니다. OneCal은 Unified Calendar View를 Calendar Sync와 별도로 안내하며, 발행사 설명에 따르면 동기화 규칙을 설정하지 않아도 그 보기를 사용할 수 있습니다. 계정을 연결하거나 구독 이름을 비교하기 전에 어떤 결과가 중요한지 먼저 결정하세요."
        ]
      },
      {
        "heading": "복사된 이벤트로 무엇을 바꿀 수 있는지 이해하기",
        "body": [
          "OneCal의 Calendar Sync 문서는 복제 이벤트를 만드는 단방향 및 다방향 규칙을 설명합니다. 별도의 범위 안내 문서에서는 복제본에 대한 수정이 원본으로 다시 전파되지 않는다고 말합니다. 복사된 일정을 회의 일정 변경 장소로 보기 전에 원본과 그 원본을 소유한 캘린더를 먼저 확인하세요.",
          "Cloud Calendars의 제공업체 연결도 iOS 저장소에 미러링된 캘린더를 만들 수 있습니다. 통합 표시만으로 기록이 병합되었거나 수정 내용이 제공업체에 도달했다는 뜻은 아닙니다. 내가 소유하고 수정할 수 있는 캘린더라면, 참석자가 없는 테스트용 이벤트를 제공업체와 앱 양쪽에서 확인하세요."
        ]
      },
      {
        "heading": "실제로 사용할 기기의 제어 기능 확인하기",
        "body": [
          "OneCal의 현재 모바일 가이드는 캘린더 이벤트 생성 및 수정, 반복 옵션, RSVP, 회의 참가를 설명합니다. 반면 Calendar Sync 설정의 생성, 수정, 일시중지, 삭제는 웹 앱에서 이뤄지며 모바일에서는 그 설정을 보여 준다고 별도로 안내합니다. 예약 링크 설정도 웹 작업으로 설명됩니다.",
          "Cloud Calendars는 iPhone 및 iPad 앱으로, 일, 주, 월, 연, 목록 보기를 제공합니다. 설치한 보기에서 필요한 수정을 직접 시도하고, 반복 옵션을 읽고, 저장된 이벤트를 확인하세요. 다른 제품의 모바일 메뉴, 예약 워크플로, 자동화 제어가 여기에도 있다고 가정하지 마세요."
        ]
      },
      {
        "heading": "무제한 기록을 가정하지 말고 범위를 확인하세요",
        "body": [
          "OneCal의 현재 범위 안내는 Google 및 iCloud의 경우 최대 1년 미래 동기화 창을, Outlook의 경우 최대 3개월을 제시합니다. 또한 미래의 반복 일정과 과거의 개별 이벤트를 구분합니다. 이는 발행사가 문서화한 제한이며, 특정 계정에 대한 테스트 결과도 아니고 캘린더 보기의 모든 기능에 대한 주장도 아닙니다.",
          "Cloud Calendars도 계정 연결 경로, 선택한 캘린더, 관련 날짜를 확인해야 합니다. 오래된 회의가 중요하다면, 특정 이벤트를 제공업체와 앱에서 비교하세요. 캘린더 앱이 자동으로 완전한 백업이 되거나 모든 과거 기록을 반드시 가져온다고 보장되지는 않습니다."
        ]
      },
      {
        "heading": "요금제 요구 사항과 결제 경로 비교하기",
        "body": [
          "Cloud Calendars는 Base에 Google Calendar 동기화를 포함하고, Advanced는 광고를 제거하며, Premium은 Microsoft Calendar 및 Teams 지원을 추가합니다. 계정 권한은 요금제와 별도로 확인하세요. 고정된 국제 가격 비교에 의존하기보다 구매 전에 현재 현지 가격과 결제 주기를 확인하세요.",
          "OneCal의 웹 요금제 안내는 구성원별 요금제와 14일 체험을 설명하며, 체험 종료 시 복제본 제거도 포함해 안내합니다. 모바일 결제 안내는 스토어 관리형 구매와 팀원 추가에 대한 제약을 설명합니다. 어떤 기능에 계속되는 요금제가 필요한지, 구매를 어디서 관리하는지 확인하세요. 무료 다운로드만으로는 그 답이 되지 않습니다."
        ]
      },
      {
        "heading": "전환 전에 실제 계획 워크플로를 테스트하세요",
        "body": [
          "날씨, 위젯, Live Activity가 중요하다면 실제 사용하는 기기에서 체험에 포함하세요. Cloud Calendars는 이러한 계획 화면을 제공하며, 날씨는 사용 가능한 날짜와 선택한 장소로 제한됩니다. 여기서 검토한 OneCal 페이지는 이러한 화면에 대한 기능 동등성을 입증하지 않으므로, 가이드만 보고 없다고 추정하지 말고 현재 제품을 확인하세요.",
          "필요한 결과를 확인할 때까지 원래 앱과 연결 정보를 유지하세요. 확인한 것이 가시성인지, 원본 이벤트 수정인지, 복사된 바쁨 시간인지, 알림인지 기록해 두세요. 이들은 서로 다른 결과입니다. 서비스를 연결 해제하기 전에 기존 사본에 어떤 일이 일어나는지 검토하고, 실제 초대장이나 실제 고객 미팅으로 실험하지 마세요."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "통합 보기가 필요한지, 아니면 이벤트를 다른 계정으로 복사해야 하는지 적어 두세요.",
      "원본, 사본, 그리고 각 중요한 이벤트를 소유한 계정을 식별하세요.",
      "실제로 쓰는 휴대폰, 태블릿 또는 웹 워크플로에서 필요한 제어 기능을 확인하세요.",
      "일반적인 1주일 일정과, 의존하고 있는 과거 날짜를 함께 비교하세요.",
      "현재 요금제 요구 사항, 현지 가격, 구매 제공업체를 확인하세요.",
      "전환 전에 테스트용 이벤트를 확인하고 사본 제거 규칙을 검토하세요."
    ],
    "faq": [
      {
        "q": "통합 캘린더 보기는 바쁨 시간 동기화와 같은 뜻인가요?",
        "a": "아니요. 통합 보기는 여러 일정을 비교할 수 있게 해 줍니다. 다른 계정에 항목을 만들려면 별도의 지원 워크플로가 필요합니다. OneCal은 Calendar Sync 규칙을 Unified Calendar View와 별도로 문서화합니다."
      },
      {
        "q": "원본 회의 일정을 바꾸기 위해 OneCal 복제본을 수정할 수 있나요?",
        "a": "OneCal의 범위 안내에 따르면 복제본 수정은 원본으로 전파되지 않습니다. 원본 이벤트를 확인한 뒤, 그 캘린더의 수정 권한과 주최자 권한을 따르세요."
      },
      {
        "q": "내 환경에서는 어떤 앱이 더 저렴한가요?",
        "a": "필요한 기능, 계정 수, 결제 경로, 현지 가격에 따라 다릅니다. Cloud Calendars는 Base에 Google 동기화를 포함하고 Premium에 Microsoft 지원을 포함합니다. 의도한 워크플로에 맞게 OneCal의 현재 요금제와 모바일 결제 조건을 검토하세요. 이 가이드는 보편적인 가격 우위를 주장하지 않습니다."
      }
    ],
    "sourcesHeading": "OneCal의 공식 워크플로 및 요금제 문서",
    "sources": [
      {
        "label": "OneCal: 모바일 기능 및 웹 전용 설정 작업",
        "url": "https://docs.onecal.io/docs/mobile-apps"
      },
      {
        "label": "OneCal: Calendar Sync 및 소스-대상 규칙",
        "url": "https://docs.onecal.io/docs/calendar-sync/calendar-sync-intro"
      },
      {
        "label": "OneCal: 동기화 범위와 복제 이벤트 수정",
        "url": "https://docs.onecal.io/docs/calendar-sync/what-does-onecal-sync"
      },
      {
        "label": "OneCal: 요금제, 체험 및 만료 시 동작",
        "url": "https://docs.onecal.io/docs/billing/plans-and-free-trial"
      },
      {
        "label": "OneCal: App Store 및 Google Play 구독",
        "url": "https://docs.onecal.io/docs/billing/mobile-subscriptions"
      }
    ],
    "seeAlso": [
      "what-calendar-sync-actually-does",
      "three-calendar-apps-is-two-too-many",
      "free-google-sync-without-adverts",
      "disconnect-calendar-integration-without-losing-track",
      "what-fantastical-costs-and-what-this-does"
    ],
    "comparison": {
      "heading": "구독 전에 워크플로 비교하기",
      "columns": [
        "질문",
        "Cloud Calendars",
        "OneCal 문서"
      ],
      "rows": [
        {
          "cells": [
            "일정은 어디에서 검토하나요?",
            "iPhone 및 iPad에서, 일·주·월·연·목록 보기로 검토합니다.",
            "Unified Calendar View는 Calendar Sync 설정과 별개입니다."
          ]
        },
        {
          "cells": [
            "계정 간에 바쁨 블록을 복사해야 하나요?",
            "통합 보기만 보고 그렇게 추정하지 마세요. 제공업체 연결은 로컬에서 캘린더를 미러링할 수 있습니다.",
            "Calendar Sync는 단방향 또는 다방향 규칙으로 복제 이벤트를 만듭니다."
          ]
        },
        {
          "cells": [
            "동기화 규칙은 어디에서 바꾸나요?",
            "앱의 계정 연결에 대해 문서화된 제어 기능을 사용하세요.",
            "검토한 모바일 가이드는 동기화 설정 변경을 웹 앱 작업으로 안내합니다."
          ]
        },
        {
          "cells": [
            "어떤 Cloud Calendars 요금제가 필요한가요?",
            "Base에는 Google Calendar 동기화가 포함되고, Advanced는 광고를 제거하며, Premium은 Microsoft Calendar와 Teams를 추가합니다.",
            "필요한 워크플로에 맞게 현재 OneCal 요금제와 결제 경로를 확인하세요."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-left",
      "hook"
    ],
    "galleryCaption": "Cloud Calendars의 실제 캘린더 화면은 계획 보기를 보여 줍니다. 이 비교는 그 보기와 서비스의 서버 측 복제 규칙을 구분합니다.",
    "actionHeading": "확인하려는 결과를 선택하세요",
    "actionText": "iPhone 또는 iPad에서 날씨와 위젯이 포함된 개요 보기가 필요하다면, 무해한 테스트 이벤트로 Cloud Calendars를 사용해 보세요. 다른 계정에 바쁨 시간을 복사하는 것이 요구 사항이라면, 그 작업을 명시적으로 문서화한 서비스를 평가하세요.",
    "articleLinks": [
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "통합 캘린더 보기 설정하기"
      },
      {
        "slug": "fantastical-readdle-calendar366-iphone-comparison",
        "label": "다른 iPhone 캘린더 옵션 비교하기"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "홈 화면 표시 방식 선택하기"
      }
    ]
  },
  "fantastical-readdle-calendar366-iphone-comparison": {
    "updated": "2026-10-23",
    "title": "iPhone 캘린더 대안: Cloud Calendars, Fantastical, Readdle, BusyCal",
    "short": "iPhone 캘린더 대안 비교",
    "description": "날씨, 보기 방식, 작업, 필요한 워크플로를 기준으로 iPhone 캘린더를 비교해 보세요.",
    "lede": "마무리하려는 작업에 맞춰 캘린더를 선택하세요. 날씨와 함께 일정을 검토할지, 이벤트를 빠르게 입력할지, 작업을 관리할지, 여러 계정 보기를 합칠지에 따라 달라집니다. Cloud Calendars, Fantastical, Calendars by Readdle, Calendar 366, BusyCal은 이런 워크플로와 필요한 요금제 조건에서 차이가 있습니다. Arte Soft는 Cloud Calendars를 개발했으며 이 비교 가이드를 게시했습니다.",
    "sections": [
      {
        "heading": "디자인을 비교하기 전에 반드시 작동해야 할 것부터 정하세요",
        "body": [
          "사용 중인 캘린더 제공업체, 기기, 그리고 꼭 필요한 작업 3가지를 적어 두세요. 예를 들면 업무용과 개인용 캘린더를 함께 보기, 미리 알림 완료하기, 회의를 빠르게 추가하기 등이 있습니다. 전체 일정을 가져오기 전에 비공개 테스트 데이터로 이 작업들을 먼저 시험해 보세요.",
          "제품이 특정 제공업체 이름을 지원한다고 해서 모든 연결 방식이 동일한 권한이나 기능을 제공하는 것은 아닙니다. 기기 캘린더, 직접 연결된 계정, 구독한 피드는 비슷해 보이는 항목을 표시할 수 있어도 가능한 작업은 서로 다를 수 있습니다."
        ]
      },
      {
        "heading": "기준점으로 제공업체의 자체 캘린더를 사용하세요",
        "body": [
          "Google의 시작 가이드는 일정 예약, 작업, 공유, 여러 캘린더에 대한 자체 캘린더 인터페이스를 설명합니다. 일정이 이미 그곳에 있다면 다른 앱이 필요한지 결정하기 전에 먼저 원본에서 필요한 작업이 되는지 확인해 보세요.",
          "예를 들어 원하는 계정을 연결한 뒤 Google Calendar와 Fantastical에서 같은 일정을 비교해 보세요. 필요한 장점이 통합 보기인지, 작업 연동인지, 빠른 입력인지, 특정 기기 인터페이스인지 확인하세요. 다른 캘린더 클라이언트를 쓴다고 해서 자동으로 다른 제공업체로 이전하는 것은 아닙니다."
        ]
      },
      {
        "heading": "Fantastical: 계정 연결과 빠른 입력 확인하기",
        "body": [
          "Flexibits는 직접 캘린더 계정을 연결하는 방식과 이미 iOS에 설정된 캘린더 및 미리 알림을 사용하는 옵션을 모두 문서화하고 있습니다. 시작 가이드에서는 앱 기능을 온전히 사용하려면 직접 연결을 권장합니다. 같은 캘린더를 이유 없이 두 번 연결하지 말고, 어떤 경로를 선택했는지 확인하세요.",
          "Fantastical는 문장 기반 입력과 재사용 가능한 이벤트 또는 작업 템플릿도 문서화하고 있습니다. 날짜, 기간, 대상 캘린더를 분명히 넣어 테스트한 다음 저장된 결과를 확인해 보세요. 이 구문은 Fantastical의 방식이며, 다른 앱의 텍스트 입력란은 같은 문장을 다르게 해석할 수 있습니다."
        ]
      },
      {
        "heading": "Calendars by Readdle: 작업 원본 확인하기",
        "body": [
          "Readdle은 Google, Outlook, iCloud 캘린더와 함께 작업 기능 및 자연어 입력 기능을 제공합니다. 작업 설정 가이드에서는 Task Options에서 iOS Reminders 또는 Google Tasks를 선택하는 방법을 설명합니다. 휴대폰에서 작업을 완료했을 때 특정 원본 목록이 업데이트되어야 한다면 이 선택이 중요합니다.",
          "제목이 타임라인에 보이는지만 보지 말고, 테스트용 작업으로 양쪽 끝에서 완료 처리가 되는지 확인하세요. iPhone뿐 아니라 Mac에서도 특정 보기나 작업이 필요하다면 그곳에서도 시험해 보세요. 같은 제품 이름이라고 해서 조작 방식까지 동일하다고 가정하면 안 됩니다."
        ]
      },
      {
        "heading": "Calendar 366: 시스템 접근, 세트, 날씨 위치 확인하기",
        "body": [
          "Calendar 366 문서는 시스템 캘린더 및 미리 알림 접근과 직접 계정 연동을 구분합니다. 또한 표시할 캘린더와 목록을 선택하는 캘린더 세트를 설명합니다. 이 세트는 기본 캘린더도 결정할 수 있으므로 새로 만든 이벤트가 어디에 저장되는지 확인하세요.",
          "같은 문서에서는 자체 자연어 파서와 Apple Weather를 사용하는 날씨 기능, 그리고 시스템 위치 또는 사용자 지정 위치 선택을 설명합니다. 야외 계획에 활용한다면 예보가 각 일정의 주소를 자동으로 따른다고 가정하지 말고 선택된 장소를 확인하세요. 이는 게시사가 문서화한 기능이지, 사용자의 계정에서 테스트된 기능을 뜻하지는 않습니다."
        ]
      },
      {
        "heading": "BusyCal: 작업 표시와 날씨에 사용되는 보기 확인하기",
        "body": [
          "BusyCal의 iOS 작업 가이드는 날짜가 있는 작업, 시간이 지정된 작업, 날짜가 없는 작업을 구분합니다. 또한 완료 컨트롤과 완료되지 않은 날짜 지정 작업을 다음으로 넘기는 방법을 설명합니다. 날씨 가이드는 List, Day, Month 보기에서 예보를 제공하므로, 날씨가 어디서나 보인다고 가정하지 말고 실제로 사용하는 보기를 테스트하세요.",
          "BusyCal은 새 이벤트 기본 설정에서 자연어 입력을 옵션으로 제공한다고도 문서화하고 있습니다. 다른 앱에서 사용한 것과 같은 비공개 테스트 일정을 입력해 보고, 캘린더와 저장된 시간을 확인하세요. 이는 BusyCal의 조작 방식이지 모든 캘린더 앱이 공유하는 명령이 아닙니다."
        ]
      },
      {
        "heading": "Watch 워크플로는 휴대폰과 별도로 확인하세요",
        "body": [
          "Fantastical의 Watch 가이드는 작업 완료를 포함해 Up Next, List, Tasks 보기를 문서화합니다. BusyCal의 작업 가이드는 Watch에 표시되는 날짜 지정 작업 및 시간 지정 작업과 날짜가 없는 작업을 구분합니다. 날짜가 없는 미처리 작업 목록이 중요하다면 다음 일정만 시험하지 말고 그 항목도 평가에 포함하세요.",
          "Watch 컴플리케이션은 한눈에 보는 정보이고, Watch 앱은 추가 작업을 제공할 수 있습니다. 실제 watch와 휴대폰에서 데이터와 가능한 작업을 확인하고, 현재 요금제도 검토하세요. 데스크톱, 휴대폰, watch 인터페이스는 같은 제품 이름을 쓴다고 해서 서로 대체되는 것이 아닙니다."
        ]
      },
      {
        "heading": "가격과 이용 권한은 별도로 확인하세요",
        "body": [
          "현재 지역의 구매 화면, 체험판 종료 후 사용할 수 있는 기능, 이전 구매가 현재 이용 권한에 영향을 주는지 확인하세요. 무료 다운로드, 정기 구독, 예전 구매 방식이 반드시 같은 기능 구성을 열어 주는 것은 아닙니다.",
          "게시사 페이지는 서로 다른 시점에 변경될 수 있습니다. Readdle의 현재 제품 FAQ는 몇 가지 핵심 기능을 무료로 설명하지만, 별도의 무료/전체 기능 도움말 페이지는 다른 구분을 제시합니다. 하나의 설명을 보편적 약속으로 받아들이기보다, 설치된 앱과 현재 구매 조건에서 필요한 작업이 실제로 가능한지 확인하세요."
        ]
      },
      {
        "heading": "후보 목록에서 Cloud Calendars가 맞는 자리",
        "body": [
          "Cloud Calendars는 선택한 캘린더, 여러 계획 보기, 날씨, 위젯을 제공하는 또 다른 iPhone 및 iPad 옵션입니다. Google 동기화는 Base에 포함되고, Advanced는 광고를 제거하며, Premium은 Microsoft calendar 지원을 추가합니다. 현재 요금제와 사용 중인 환경의 제공업체 권한을 확인하세요.",
          "특화된 작업 연동, 템플릿 명령, 데스크톱 워크플로가 필수라면 그 요구 사항을 문서화했고 실제로 성공적으로 수행하는 제품을 선택하세요. 저장된 결과와 일상적인 수고를 비교하세요. 이 체크리스트는 선택을 돕기 위한 것이며, 여기 언급된 모든 기능이 Cloud Calendars에 있다고 뜻하는 것은 아닙니다."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "계정, 기기, 필수 작업을 목록으로 정리하세요.",
      "하나의 계정 연결 경로를 선택하고, 그 경로로 표시되는 캘린더를 확인하세요.",
      "문제가 없는 예시로 빠른 입력과 작업 완료를 시험하세요.",
      "날씨 위치와 각 기기에서 사용하는 보기를 확인하세요.",
      "체험판이나 이전 구매 권한이 있다면 그 이후의 현재 구매 조건을 확인하세요."
    ],
    "faq": [
      {
        "q": "Fantastical의 가장 좋은 대안은 무엇인가요?",
        "a": "필요한 워크플로에 따라 다릅니다. 캘린더와 작업의 원본, 이벤트 입력 방식, 기기 지원, 현재 이용 권한을 비교하세요. 이 가이드는 모두에게 통하는 성능상 최고의 제품을 선언하지 않습니다."
      },
      {
        "q": "같은 제공업체 이름이면 모든 앱이 똑같이 동기화되나요?",
        "a": "아니요. 직접 연결, 기기 캘린더, 피드, 권한을 각각 따로 확인한 뒤, 예시 변경 사항이 원본에 반영되는지 검증하세요."
      },
      {
        "q": "광고된 모든 기능이 무료라고 봐도 되나요?",
        "a": "아니요. 설치된 앱, 지역 구매 화면, 체험판 종료 후 남는 기능을 확인하세요. 게시사 문서는 서로 다른 버전이나 이용 권한을 설명할 수 있습니다."
      }
    ],
    "sourcesHeading": "이 가이드에서 확인한 공식 문서",
    "sources": [
      {
        "label": "Fantastical: 계정 연결 경로",
        "url": "https://flexibits.com/fantastical-ios/help/getting-started"
      },
      {
        "label": "Fantastical: 자연어 입력 및 템플릿",
        "url": "https://flexibits.com/fantastical-ios/help/adding-events-and-tasks"
      },
      {
        "label": "Readdle: 현재 제품 기능 및 FAQ",
        "url": "https://readdle.com/calendars"
      },
      {
        "label": "Readdle: 작업 원본 선택",
        "url": "https://support.readdle.com/calendars/synchronization/how-to-sync-tasks-with-ios-reminders-or-google-tasks"
      },
      {
        "label": "Readdle: 별도의 무료/전체 요금제 안내",
        "url": "https://apphelp.readdle.com/en/index.php?id=585&pg=kb.page"
      },
      {
        "label": "Calendar 366: 연동, 세트, 빠른 입력, 날씨",
        "url": "https://calendar366.com/help/index.html"
      },
      {
        "label": "BusyCal for iOS: 작업 및 Watch 작업 제한",
        "url": "https://www.busymac.com/docs/busycalios/70659-tasks/"
      },
      {
        "label": "BusyCal for iOS: 날씨 및 지원되는 보기",
        "url": "https://www.busymac.com/docs/busycalios/70665-weather/"
      },
      {
        "label": "BusyCal for iOS: 자연어 입력",
        "url": "https://www.busymac.com/docs/busycalios/70669-natural-language/"
      },
      {
        "label": "Fantastical: Apple Watch 보기 및 동작",
        "url": "https://flexibits.com/fantastical-ios/help/apple-watch"
      },
      {
        "label": "Google: Calendar의 자체 계정 기반 인터페이스",
        "url": "https://support.google.com/calendar/answer/2465776?hl=en"
      }
    ],
    "seeAlso": [
      "what-fantastical-costs-and-what-this-does",
      "natural-language-calendar-events-iphone",
      "iphone-calendar-tasks-reminders-versus-event-alerts"
    ],
    "comparison": {
      "heading": "가장 중요한 요구 사항부터 시작하세요",
      "columns": [
        "요구 사항",
        "확인할 관련 옵션",
        "중요한 구분점"
      ],
      "rows": [
        {
          "cells": [
            "날씨와 함께 보는 일정 및 iPhone/iPad 보기",
            "Cloud Calendars와 비교 대상 앱들에서 문서화된 날씨 보기",
            "예보 위치, 제공 기간, 지원 보기를 확인하세요. 날씨 제공 범위가 무제한은 아닙니다."
          ]
        },
        {
          "cells": [
            "자연어 이벤트 입력",
            "Fantastical 및 Readdle 또는 BusyCal의 관련 기능",
            "문장 파싱은 받아쓰기나 일반적인 이벤트 편집과 같은 것이 아닙니다."
          ]
        },
        {
          "cells": [
            "일정 옆에 작업 표시",
            "Readdle, Calendar 366, BusyCal 또는 Fantastical에서 문서화된 작업 원본",
            "이벤트 미리 알림은 작업 완료 연동과 다릅니다."
          ]
        },
        {
          "cells": [
            "Google Calendar 동기화 및 선택적 광고 제거",
            "Cloud Calendars Base에는 Google Calendar 동기화가 포함되며, Advanced는 광고를 제거합니다.",
            "Microsoft Calendar 및 Teams 지원은 Premium이 필요합니다."
          ]
        },
        {
          "cells": [
            "다른 구매 모델",
            "각 앱과 플랫폼의 현재 스토어 등록 정보 및 이용 권한",
            "무료 다운로드라고 해서 모든 기능이 무료라는 뜻은 아닙니다. 지역별 가격과 요금제는 변경될 수 있습니다."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-left",
      "week-right",
      "widgets"
    ],
    "galleryDevice": "iPad",
    "galleryCaption": "이 이미지는 앱의 보기, 날씨, 위젯을 보여 주는 Cloud Calendars 화면입니다. 비교 대상인 다른 제품의 스크린샷은 아닙니다.",
    "actionHeading": "하나의 실제 계획 필요에 맞춰 캘린더를 시험해 보세요",
    "actionText": "주요 요구 사항이 날씨와 위젯이 있는 iPhone 또는 iPad 일정 관리라면, 테스트용 일정으로 Cloud Calendars를 평가해 보세요. 제품을 비교할 때는 특수한 작업, 예약, 자연어 요구 사항을 따로 구분해 두세요.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "날씨가 캘린더 워크플로에 어떻게 맞는지 보기"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Cloud Calendars 위젯 비교하기"
      },
      {
        "slug": "onecal-alternative-iphone-calendar-view-or-sync",
        "label": "통합 보기와 복사된 바쁨 시간 구분하기"
      }
    ]
  }
};
