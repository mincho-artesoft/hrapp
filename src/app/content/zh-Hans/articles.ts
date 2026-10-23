import { LocalisedArticle } from '../types';

/**
 * The four articles this language carries.
 *
 * Chosen one per intent -- weather, one view, sharing, price -- so the language
 * answers a whole question rather than a quarter of four. The numbers are not
 * here: they live once in article-facts.ts and join the prose by id, so a
 * translation can rewrite every sentence without touching a figure.
 */
export const ARTICLES_ZH_HANS: Readonly<Record<string, LocalisedArticle>> = {
  "month-view-on-a-bigger-screen": {
  "updated": "2026-10-22",
  "title": "iPad 与 iPhone 月视图：先看日期，再查详情",
  "short": "使用月视图，不遗漏详情",
  "description": "在 iPad 或 iPhone 月视图中比较日期。移动共享或重复约会前，检查隐藏活动、所选日历及准确时间。",
  "lede": "月视图说明事项分布在哪些日期，却不适合证明某个小时空闲。先用概览选择日期，再检查当天和活动，最后确认安排。本指南由 Cloud Calendars 开发者 Arte Soft 发布。",
  "commonBelief": "更大的月网格会显示全部详情，看起来空白的日期就证明每个人都有空。",
  "sections": [
    {
      "heading": "确定需要比较日期还是准确时间",
      "body": [
        "用月视图比较跨越数周的项目截止日、旅行和家庭约会。如果要判断两场会议是否在 14:30 重叠，请切换到日或周视图，检查准确开始及结束时间。月单元格并不提供逐小时网格那样的时间刻度。",
        "例如，选择工作坊日期的组织者可以先避开旅行周，再检查候选日已有事项、准备、路程和必须结束的时间。看起来空闲的格子只是值得进一步检查的日期，不是确认预订，也不能代表他人有空。"
      ]
    },
    {
      "heading": "留意额外活动数量",
      "body": [
        "Cloud Calendars 当前的月单元格显示有限数量的活动标签；同一天还有其他活动时，会显示额外数量。标题保持单行，因此可能缩短。需要完整标题或其余事项时，请打开当天或具体活动。",
        "iPad 更大的屏幕可能更易阅读，但不要假定更大面积会消除所有显示限制。较窄的应用窗口或较大的文字都会影响能容纳的内容。在 iPhone 上也应先查看当天，不能把可见标签当作完整日程。"
      ]
    },
    {
      "heading": "检查月份、所选日历与相邻日期",
      "body": [
        "选择日期前，读取当前月份和年份。为补齐行，月网格可能包含相邻月份的日期。在 Cloud Calendars 中使用月份导航并检查所选日期，不要只凭方格位置判断。",
        "检查选中了哪些日历。隐藏工作活动有助于阅读家庭计划，但也会从当前概览移除那些事项。排查重复记录时，暂时隐藏一个来源进行比较；不要仅为让月份不那么拥挤就删除约会。"
      ]
    },
    {
      "heading": "修改共同安排前打开活动",
      "body": [
        "在活动详情中确认标题、所有者或日历、当地时间和时长。颜色方便浏览，却不能替代账号及编辑权限的确认。能看到的邀请，与自己组织的约会不是一回事。",
        "Cloud Calendars 的月视图支持拖放，将活动移到其他日期。对真实约会操作前，确定目标日期和重复修改范围。获准修改后，重新打开检查结果；本地手势不能证明服务商或每位参与者都接受了新安排。"
      ]
    },
    {
      "heading": "分别检查重复范围与时区",
      "body": [
        "如果只移动本周课程，不要误改未来规律。阅读可用的重复范围选项，之后检查修改过的一次及以后的一次。月视图让重复日期容易比较，但实际影响取决于编辑范围。",
        "旅行或跨时区会议应明确检查活动当地日期和时间。移到另一天不会自动转换原本打算的会议时间。相关时应检查夏令时转换，并与相关人员确认约定时间。"
      ]
    },
    {
      "heading": "不要将大屏视图与其他产品混淆",
      "body": [
        "Apple 日历提供自己的月显示选项，Teamup 也说明了浏览器与移动端不同的视图组合。这些控制属于各自产品。不要因为布局名称相同，就在 Cloud Calendars 中寻找 Teamup 浏览器配置或 Apple 日历视图菜单。",
        "一个月的约会也不等于一个月的天气预报。安排户外活动时，单独检查目标地点、日期及可用预报小时。将最终约会保存到目标日历，并直接与参与者确认改变的安排。"
      ]
    }
  ],
  "claims": {},
  "practical": [
    "用月视图筛选日期，再在日或周视图查看准确时间。",
    "打开带额外数量或缩短标题的日期。",
    "判定日期空闲前，检查月份、年份和所选日历。",
    "确认活动日历、时间、时长及编辑权限。",
    "阅读重复范围，并检查移动后保存的那次活动。",
    "单独检查天气预报，并与参与者确认变更。"
  ],
  "faq": [
    {
      "q": "iPad 月视图会完整显示每个约会吗？",
      "a": "不要这样假定。Cloud Calendars 限制单元格内的活动标签，并显示额外数量。请打开当天和活动检查完整日程。"
    },
    {
      "q": "空白日期是否意味着我有空？",
      "a": "先检查所选日历、日期及相关账号数据是否存在。概览只代表目前可用并显示的信息。"
    },
    {
      "q": "移动重复活动是否只改变那一天？",
      "a": "请阅读编辑范围选项，不要假定。保存后检查改变过的一次及以后的一次，再确认是否符合预期。"
    }
  ],
  "sourcesHeading": "比较官方视图说明",
  "sources": [
    {
      "label": "Apple：月、多日与列表视图",
      "url": "https://support.apple.com/en-ca/guide/iphone/iphfd1054569/ios"
    },
    {
      "label": "Teamup：日历视图及浏览器与应用配置",
      "url": "https://calendar.teamup.com/kb/how-to-use-calendar-views/"
    }
  ],
  "seeAlso": []
},

  'weather-inside-your-calendar': {
  "updated": "2026-10-23",
  "title": "iPhone 和 iPad 上带天气的日历：一屏规划你的一天",
  "short": "同时查看日历和天气",
  "description": "在 iPhone 和 iPad 上，将你的日历与所选地点的天气进行对照。",
  "lede": "Cloud Calendars 可在同一款 iPhone 或 iPad app 中同时显示你的日程和天气。你可以用日历选择日期，再通过天气视图查看所选地点及可用的预报小时。安排户外活动时，应查看真正相关的时段，而不是只依赖当天的天气图标。本指南由该 app 的开发者 Arte Soft 发布。",
  "commonBelief": "日历旁显示的天气会自动对应每个日程的地址、每个小时以及未来的每一天。",
  "sections": [
    {
      "heading": "先明确一个真实的规划问题",
      "body": [
        "先从某个具体日程开始，例如下午去公园。想清楚天气可能改变什么：时间、地点、准备事项，或是否改用替代方案。不要仅因为当天图标显示有雨，就重排整天的日历。",
        "写下该活动的实际开始和结束时间，如有需要也包括准备时间。日历总览有助于寻找可选日期，而天气预报核对关注的是某个具体地点和时间段。比较方案时，要把这两项工作区分开。"
      ]
    },
    {
      "heading": "查看数值前先确认天气地点",
      "body": [
        "Cloud Calendars 提供当前地点或所选地点的天气。请查看界面显示的位置，不要默认某个事件的地址会自动悄然改动天气预报。若日程在另一座城市，就需要对照那座城市的天气。",
        "例如，访客可能正在规划到达博物馆的时间，而手机仍在家中。比较前，请先查看天气预报对应的位置，以及该事件的当地时间。屏幕上看起来接近，并不能证明日程和天气使用的是同一地点。"
      ]
    },
    {
      "heading": "分别查看按小时和按天的覆盖范围",
      "body": [
        "如需整体把握，可先看按天条目；若问题涉及一天中的某段时间，则看可用的按小时条目。一个从 2 点到 5 点的预约，不能只看一个图标就下判断。还要确认相关小时数据是否确实提供。",
        "在当前 app 的数据源中，按天列表最多显示 WeatherKit 返回的 10 天数据。这与日历导航无关，也与当前提供的小时数据无关。未来的事件不会延长天气覆盖范围。如果所需时段尚未提供，请稍后再查看天气。"
      ]
    },
    {
      "heading": "看懂天气数值的含义",
      "body": [
        "Apple 说明了 WeatherKit 提供的温度、降水、风力、UV 等数据，其中部分产品仅在特定地区可用。请根据你所选地点实际提供的数值来判断，不要预期所有地方都能看到全部天气产品。",
        "Met Office 的说明展示了为什么预报时段和变量定义很重要：有些数值对应某一时刻，有些则对应某一时间段。请以相关提供方的标签为准。降雨概率、降雨量和降雨持续时间是不同的问题，没有任何一个数字能决定所有户外活动。"
      ]
    },
    {
      "heading": "根据某个天气小时生成草稿后要复核",
      "body": [
        "当 app 提供从某个小时创建事件的功能时，它打开的是草稿。当前数据源会使用天气地点所在时区、建议 1 小时时长，并选用默认的新建事件日历。保存前请检查每一项值。",
        "确认标题、目标日历、开始时间、结束时间和预期地点。选择某个预报时段，并不意味着你获得了编辑共享日历、通知场地或预订会议室的权限。请检查已保存的事件，并取得该计划所需的任何同意。"
      ]
    },
    {
      "heading": "将网站演示与 app 分开看待",
      "body": [
        "网站上的交互式天气演示使用 Open-Meteo。app 使用 Apple WeatherKit。网页演示有助于了解展示方式，但其地点、数据和可用日期可能与 app 不同。",
        "要做实际决定时，请打开 app，将目标事件与其中可用的天气预报进行对照。如果你要修改共享计划，请确认组织者、重复范围和参与者。若活动受天气条件影响，请保留一个已商定的替代方案。"
      ]
    }
  ],
  "claims": {},
  "practical": [
    "确认是哪个事件，以及天气可能改变什么决定。",
    "确认天气地点，以及该事件的当地日期和时间。",
    "将可用的小时覆盖范围与每日摘要分开查看。",
    "根据标签解读概率、降水量及其他相关数值。",
    "保存前，检查所有事件草稿细节和目标日历。",
    "在需要作出决定时再次核对，并直接确认共享变更。"
  ],
  "faq": [
    {
      "q": "我日历旁边的天气会跟随每个事件地址变化吗？",
      "a": "不要这样假设。请确认界面显示的天气地点，并将其与活动地点进行对照；屏幕上位置接近，并不能证明二者匹配。"
    },
    {
      "q": "app 使用网站上的天气提供方吗？",
      "a": "不是。app 使用 Apple WeatherKit；网站演示则单独使用 Open-Meteo。"
    },
    {
      "q": "选择某个预报小时会自动保存一个日程吗？",
      "a": "在提供该操作时，它会先创建一个草稿。请检查其中的日期、时区、时长、日历和地点，然后再保存你想要的事件。"
    }
  ],
  "seeAlso": [
    "weather-calendar-history-versus-forecast-iphone",
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather",
    "weather-where-the-event-is",
    "planning-outdoors-without-being-rained-on"
  ],
  "sourcesHeading": "官方来源与延伸阅读",
  "sources": [
    {
      "label": "Apple：WeatherKit 预报信息与地区可用性",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office：预报地点、时段与天气数值",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ],
  "comparison": {
    "heading": "哪种天气视图能回答你的问题？",
    "columns": [
      "你的问题",
      "应查看什么",
      "它不能证明什么"
    ],
    "rows": [
      {
        "cells": [
          "今天接下来会发生什么？",
          "日历的日视图或周视图，配合所选地点的天气查看。",
          "不能证明每个事件地址都会自动改变天气地点。"
        ]
      },
      {
        "cells": [
          "下雨会影响我下午的日程吗？",
          "查看活动地点以及该事件完整时段的小时数据。",
          "不能证明一个每日图标就代表每个小时。"
        ]
      },
      {
        "cells": [
          "我可以根据天气来安排下个月吗？",
          "先看你当前的日历，再在更接近该日期时重新查看天气预报。",
          "不能证明浏览日历会延长天气预报的覆盖范围。"
        ]
      },
      {
        "cells": [
          "我能在主屏幕上快速总览吗？",
          "选择合适的主屏幕小组件。",
          "不能证明每种小组件布局都包含事件或完整天气预报。"
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-right",
    "hook"
  ],
  "galleryCaption": "真实的 Cloud Calendars 界面：天气视图与包含事件的一天。请在 app 中确认所选地点和日期。",
  "actionHeading": "结合日程与天气预报来安排计划",
  "actionText": "Cloud Calendars 适用于 iPhone 和 iPad。你可以从 Base 开始，其中包含视图、天气和 Google Calendar 同步；Advanced 去除广告，Premium 则增加 Microsoft Calendar 和 Teams 支持。",
  "articleLinks": [
    {
      "slug": "forecast-beside-every-event",
      "label": "查看某个事件所在时段的天气"
    },
    {
      "slug": "the-widget-that-shows-what-is-next",
      "label": "选择日历和天气小组件"
    },
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "将多个日历账户汇集到一个视图中"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
  "updated": "2026-10-23",
  "title": "在 iPhone 和 iPad 上同时查看 Google、iCloud 和 Outlook 日历",
  "short": "三个提供商，一个视图",
  "description": "整合多个日历视图，并了解账户权限、日历副本和套餐要求。",
  "lede": "若要同时查看工作和个人日程，请连接目标账户，选中相应日历，并在同一视图中核对这些活动。Cloud Calendars 支持在 iPhone 和 iPad 上通过 iCloud 和 Google Calendar 进行规划；Microsoft Calendar 支持包含在 Premium 中。把活动放在一起查看，与在不同提供商账户之间复制忙闲时间，是两回事。本文由开发者 Arte Soft 发布。",
  "commonBelief": "把多个日历放进同一个 app，就会自动让它们的忙闲状态、共享设置和活动副本保持一致。",
  "sections": [
    {
      "heading": "识别每项活动背后的账户和日历",
      "body": [
        "先从每个提供商各选一项普通活动开始。记下登录的电子邮件地址、日历名称，以及该活动是你创建的还是你收到的邀请。两个都叫“Calendar”的日历，可能属于完全不同的账户。颜色便于你快速查看一周安排；而账户和日历才能确定应当把修改提交到哪里。",
        "例如，你个人 iCloud 日历中的牙医预约，以及 Microsoft 中的项目会议，都可以同时显示给你看。但这本身并不会让同事看到你的牙医预约，也不会在他们的排期工具中自动占用那段时间。",
        "在更改连接之前，先明确你想达到的结果。如果你要把活动数据转移到另一个账户，请使用下方的“选择日历导出格式”查找受支持的转移方式，并在依赖目标账户之前核对有代表性的活动。如果你只是想比较时间，请保留现有日历所有者，并把选定来源一起显示。如果另一个账户必须收到忙闲时间，请参阅“按工作流了解 Cloud Calendars 和 OneCal”，其中解释了可用性复制与个人总览的区别。"
      ]
    },
    {
      "heading": "通过合适的方式连接",
      "body": [
        "对于 iCloud，请先在 iPhone 上的目标 Apple Account 下启用 iCloud Calendar。设备设置请参阅 Apple 的设置指南。Cloud Calendars 访问的是 iPhone 日历系统中可用的日历，并需要日历访问权限才能读取它们。仅在另一台设备上连接该账户是不够的。",
        "Cloud Calendars 还提供“Sign in with Google”和“Sign in with Microsoft”操作。请确认登录时选择的是哪个账户，然后打开其日历分组并选中你需要的日历。登录到了正确的提供商，但使用了错误的个人或工作身份，可能会得到一份完全有效却不符合预期的日历列表。"
      ]
    },
    {
      "heading": "理解套餐，不要把它和权限混为一谈",
      "body": [
        "Base 套餐包含 Google Calendar 同步和日历视图。Advanced 在 Base 的基础上增加去广告。Premium 增加 Microsoft Calendar 和 Microsoft Teams 功能。购买前请查看当前本地价格和计费周期。",
        "套餐改变的是 app 可用的功能，并不会赋予你对他人日历的所有权。Google 会区分“查看活动”的权限和“修改活动”的权限。雇主政策以及附加在 Microsoft 日历上的权限仍然适用。活动可见，或出现可编辑界面，并不等于提供商一定会接受更新。"
      ]
    },
    {
      "heading": "合并视图中可能包含日历副本",
      "body": [
        "Google 和 Microsoft 连接会在 iPhone 日历系统中使用日历副本来展示和同步活动。不要以为连接账户后，除了原始提供商之外就不会存在任何副本。这些副本使用的目标位置，可能取决于设备上可用的日历来源。",
        "如果同一个账户还通过其他方式连接到手机，在把重复出现的预约当作不同活动之前，请先检查日历名称和来源。可暂时隐藏其中一个日历，以识别它提供的是哪一组显示内容。不要只是为了让界面看起来整洁，就删除某个活动或日历：已连接的副本可能会把更改回传给其提供商。"
      ]
    },
    {
      "heading": "创建活动时，继续主动选择目标日历",
      "body": [
        "保存前，请像检查日期和时间一样仔细检查活动所属日历。家庭安排请选择家人实际使用的日历；工作会议请选择允许使用的工作目标日历。把两个日历同时显示，并不会让其中任何一个自动成为每个新活动的默认目标。",
        "更改活动所属日历，或在日历之间拖动活动，可能意味着“移动”，而不是无害地多看一份。排查显示问题时，请将邀请和重复会议保留在它们原有的日历中。如果你确实需要更改，请先确认谁拥有该活动，以及哪个日历能够接收它。"
      ]
    },
    {
      "heading": "在依赖总览之前先验证",
      "body": [
        "请将提供商自带日历中的一项最近活动，与 Cloud Calendars 中对应的活动进行比较。检查日期、时区、标题和所选日历。对于你拥有且可编辑的日历，用一个不带来宾、可随时删除的活动来测试，比去改动正在进行中的会议更合适。在认为连接已准备就绪之前，请先到提供商一侧确认结果。",
        "不要依赖合并视图去自动在另一个账户中创建匿名的忙碌时间块。如果你需要让同事看到你不可用，但又不显示个人细节，请使用明确获批的可用性共享方案，并从他们那一侧进行验证。清晰的个人总览和共享可用性是两项不同任务。"
      ]
    }
  ],
  "claims": {},
  "practical": [
    "列出每个提供商各一项活动对应的准确账户和日历。",
    "在设备上启用目标 iCloud 日历，并检查日历访问权限。",
    "使用相应的 Google 或 Microsoft 登录方式，并选择目标日历。",
    "在做任何更改前，先将一项最近活动与其提供商视图进行比较。",
    "暂时隐藏你怀疑重复的来源；保留底层活动不变。",
    "为每个新活动检查目标日历，并单独验证你需要的任何忙闲时间共享。"
  ],
  "faq": [
    {
      "q": "如果我同时显示工作和个人日历，我的同事会看到我的私人活动吗？",
      "a": "把多个日历一起显示，并不是共享指令，也不会自动在不同账户之间建立忙闲时间桥接。请检查每个日历的实际共享设置。提供商连接还可能在设备上创建日历副本，因此合并视图也不能保证活动数据只存在于其原始提供商处。"
    },
    {
      "q": "为什么我能看到某个事件，却无法成功编辑它？",
      "a": "该日历可能是只读的，事件也可能属于其他组织者，或者服务提供方拒绝了更新。请在提供方的日历中检查所有权和权限。购买更高等级的应用方案不会改变这些权限。"
    },
    {
      "q": "我是否应该通过所有可用方式连接同一个 Google 账号？",
      "a": "请先检查它目前在手机上是如何显示的。通过多种方式接入，会让你更难分辨哪些是同一日历的副本。选择你打算使用的接入方式，核对其中的事件；在排查时，优先先隐藏多余的显示项，而不是一开始就删除数据或断开账号连接。"
    }
  ],
  "sourcesHeading": "来源与设置参考",
  "sources": [
    {
      "label": "Apple：在你的设备上设置 iCloud Calendar",
      "url": "https://support.apple.com/guide/icloud/set-up-calendar-mme4d73a8727/icloud"
    },
    {
      "label": "Google：日历共享与权限",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft：Outlook 日历 API 与受支持的邮箱数据",
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
    "heading": "合并视图、订阅，还是复制忙碌时间？",
    "columns": [
      "你需要什么",
      "需要检查什么",
      "不要想当然地认为"
    ],
    "rows": [
      {
        "cells": [
          "在一个视图中查看多个账号",
          "已连接的账号、所选日历以及所需方案。",
          "共享的屏幕显示会合并所有权或权限。"
        ]
      },
      {
        "cells": [
          "让事件编辑真正提交到其提供方",
          "原始事件、写入权限，以及源端保存后的结果。",
          "本地可见的编辑就证明已成功同步到提供方。"
        ]
      },
      {
        "cells": [
          "在另一个账号中显示忙碌时间",
          "具有明确“源到目标”同步规则的服务。",
          "合并视图会自动为同事创建可用性忙碌时段。"
        ]
      },
      {
        "cells": [
          "一个已订阅的日历源",
          "发布方、刷新方式以及只读状态。",
          "ICS 订阅是可编辑的双向连接。"
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-left",
    "hook"
  ],
  "galleryDevice": "iPad",
  "galleryCaption": "真实的 iPad 日历视图可用于说明如何查看日程。截图并不能证明提供方同步的方向，也不能证明账号权限。",
  "actionHeading": "在 iPhone 和 iPad 上集中查看你的日历",
  "actionText": "Google Calendar 同步包含在 Base 中。Advanced 可去除广告；Premium 增加 Microsoft Calendar 和 Teams 支持。账号权限需要独立确认，不取决于所购方案。",
  "articleLinks": [
    {
      "slug": "onecal-alternative-iphone-calendar-view-or-sync",
      "label": "对比合并视图与 OneCal 的同步规则"
    },
    {
      "slug": "fantastical-readdle-calendar366-iphone-comparison",
      "label": "对比 iPhone 日历工作流"
    },
    {
      "slug": "weather-inside-your-calendar",
      "label": "将天气与日程安排结合起来规划"
    }
  ]
},

  'sharing-one-event-not-your-calendar': {
  "updated": "2026-10-21",
  "title": "分享单个日历活动：选择合适的链接和权限",
  "short": "分享单个活动",
  "description": "无需分享整个日历即可分享一个活动。了解 Reader、Writer、Owner 权限、预览链接、更新以及撤销访问的限制。",
  "lede": "分享聚餐详情、邀请共同组织者编辑，以及收集出席答复，是不同的任务。先明确需求，再选择分享方式。本指南由 Cloud Calendars 的开发者 Arte Soft 编写。",
  "commonBelief": "所有活动链接都是只读日历订阅，能立即更新并记录答复。",
  "sections": [
    {
      "heading": "先检查要分享的活动",
      "body": [
        "单个活动分享只涉及该活动，而不是发送者的整个日历。发送前检查标题、时区、地点、备注和会议网址。适合一位客人的信息，未必适合广泛传播的链接。",
        "例如，分享聚餐不需要分享包含就医预约的日历。但聚餐自己的地点和链接仍会随活动一起传递。请检查活动本身，而不是依赖其所在日历的隐私设置。"
      ]
    },
    {
      "heading": "选择预览、电子邮件或二维码方式",
      "body": [
        "Cloud Calendars 提供不同的分享途径。App Clip 展示活动预览；通过该体验添加活动需要完整应用。电子邮件和二维码邀请使用一个提供打开 Cloud Calendars 选项的网页。不要把这些链接都描述成可互换的订阅网址。",
        "发送者需要登录才能使用应用的同步分享流程。链接和二维码可以被转发，因此只应发送到适合其内容的场合。二维码是传递链接的方式，不能证明谁打开了它。"
      ]
    },
    {
      "heading": "只授予接收者需要的权限",
      "body": [
        "电子邮件邀请可以选择 Reader、Writer 或 Owner。Reader 可查看和同步；Writer 可编辑；Owner 还可分享并管理访问权限。这些选择有实际影响，不是同一种查看权限的三个名称。只需查看安排的人应使用 Reader。",
        "需要修改活动的共同组织者可使用 Writer。只有还需管理他人访问权限时才选择 Owner。接收者必须使用正确的登录身份才能获得更高权限。匿名接收者不是已确认身份的共同所有者。"
      ]
    },
    {
      "heading": "了解接收者如何添加活动",
      "body": [
        "在完整应用中添加共享活动，需要日历访问权限和可写入的目标日历。接收者应在保存前检查目标。收到的副本随后可以与共享活动关联，以接收后续更新。",
        "这不同于将普通 ICS 文件导入另一日历。导入生成副本，而订阅会定期检查信息源。如果发送的是 ICS 信息源而非应用邀请，请明确说明，并确认接收者的日历支持该方式。"
      ]
    },
    {
      "heading": "依赖更新前先确认结果",
      "body": [
        "同步分享可以传递后续编辑或取消，但接收设备必须有机会收到更新。信息源刷新提示不是送达期限。离线设备、尚未刷新的订阅或独立导入的副本仍可能显示旧信息。",
        "如果聚餐临近开始时改期，请更新活动并直接联系客人，请他们确认新时间。发送更新和收到出席答复是两个独立步骤。"
      ]
    },
    {
      "heading": "管理访问时，不要承诺删除已有副本",
      "body": [
        "检查活动接收者的权限，移除不再需要的访问。移除接收者和撤销信息源链接是不同操作；都不能描述为远程删除截图、消息或所有日历副本。",
        "如果链接已超出预期受众，先确定涉及哪个链接或哪项授权。修改权限后验证受影响的分享途径。今后不要把私人详情放入广泛传播的链接，而不是依赖事后撤销来收回信息。"
      ]
    }
  ],
  "claims": {},
  "practical": [
    "检查活动详情，明确需要查看、编辑还是出席答复。",
    "选择分享途径，并按要求登录。",
    "查看者使用 Reader；仅为相应职责授予 Writer 或 Owner。",
    "请接收者添加时检查活动时间和目标日历。",
    "紧急改动时，更新活动并直接发送消息。",
    "结束分享时，分别检查接收者权限和链接访问。"
  ],
  "faq": [
    {
      "q": "分享一个活动会暴露整个日历吗？",
      "a": "同步的单个活动分享只限于该活动，但其自身详情仍会通过所选途径展示。请检查详情；如果只想发送一个活动，不要发送整个日历的邀请。"
    },
    {
      "q": "接收者可以修改活动吗？",
      "a": "可以，但必须拥有适当的 Writer 或 Owner 权限，并使用受支持的登录流程。Reader 用于查看和同步。普通 ICS 订阅不是相同的编辑机制。"
    },
    {
      "q": "移除某人会撤回其收到的一切吗？",
      "a": "不应假定有这种保证。权限变更影响受支持的分享关系，但已保存副本、截图和消息可能保留。共享信息源网址也需要单独考虑。"
    }
  ],
  "sourcesHeading": "接收方式参考资料",
  "sources": [
    {
      "label": "Apple：App Clips 概述",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google：导入活动及其限制",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft：导入与订阅日历的区别",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": []
},

  'what-a-subscription-actually-buys': {
  "updated": "2026-10-21",
  "title": "订阅到底买到了什么",
  "short": "订阅买到了什么",
  "description": "订阅买到了什么: Base, Advanced, Premium.",
  "lede": "本指南由 Cloud Calendars 的开发商 Arte Soft 发布。",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "Base 包含 Google Calendar 同步、Google Meet、日历视图、天气和小组件。免费方案可能显示广告。"
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Advanced 包含 Base 功能并移除广告。Premium 包含 Advanced，并增加 Microsoft Calendar 和 Microsoft Teams 支持。",
        "订阅不会授予编辑他人日历的权限，也不能绕过工作账户的限制。"
      ]
    },
    {
      "heading": "购买与取消订阅信息",
      "body": [
        "购买前，请检查当地价格、计费周期和续订条款。",
        "对于通过 Apple 计费的订阅，请打开“设置”→你的姓名→“订阅”，检查状态和到期日期。取消续订与删除应用或日历数据是不同的操作；不要假定付费功能在到期后仍可使用。"
      ]
    }
  ],
  "claims": {},
  "practical": [
    "购买前，请检查当地价格、计费周期和续订条款。",
    "订阅不会授予编辑他人日历的权限，也不能绕过工作账户的限制。"
  ],
  "faq": [
    {
      "q": "如何停止续订？",
      "a": "对于通过 Apple 计费的订阅，请打开“设置”→你的姓名→“订阅”，检查状态和到期日期。取消续订与删除应用或日历数据是不同的操作；不要假定付费功能在到期后仍可使用。"
    }
  ],
  "sourcesHeading": "购买与取消订阅信息",
  "sources": [
    {
      "label": "Apple: 如何停止续订？",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view"
  ]
},
};
