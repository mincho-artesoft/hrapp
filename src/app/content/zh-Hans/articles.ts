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
  'weather-inside-your-calendar': {
  "title": "一个本身就带着天气的日历",
  "short": "日历里的天气",
  "description": "为什么为了安排一天要看两个应用是一处设计缺陷，以及一个把预报放进视图本身、而不是摆在旁边的日历是什么样子。",
  "lede": "几乎所有人都在两个应用之间安排自己的一天。日历说该去哪里；天气应用说到那儿时天怎么样。把这两件事在脑子里合在一起，是没人意识到自己在做的那一部分——直到有个周六白白报废。",
  "commonBelief": "认为日历是用来记约会的、天气应用是用来看天的，把它们分开只不过是手机本来就这样。",
  "sections": [
    {
      "heading": "两个应用的代价不是两次点按",
      "body": [
        "切换本身不花什么。真正昂贵的是这两者从不就\"什么才重要\"达成一致。你的日历知道周六十一点起有两个小时被占；天气应用知道十点到十三点下雨。谁都不知道，这两个事实合起来意味着那个时间块该挪。",
        "整合层就是你。这在你不忙的时候管用，而恰恰是忙起来的时候，保住计划才最值钱。"
      ]
    },
    {
      "heading": "可用的天气预报",
      "body": [
        "Cloud Calendars 使用所选地点的可用预报。逐小时和逐日数据可能覆盖不同的时间范围。",
        "日历中可浏览的日期并不决定预报范围。月视图不代表整个月或每个日程都有天气预报。"
      ]
    }
  ],
  "claims": {
    "price": "天气功能的费用"
  },
  "practical": [
    "根据预报规划之前，请检查地点、日期和有数据的时段。"
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-a-subscription-actually-buys"
  ],
  "updated": "2026-10-21"
},

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud、Google 和 Outlook 在同一个视图里',
    short: '三个账户，一个视图',
    description: '几乎每个人的生活都分散在个人的 Apple 日历、一个 Google 账户和公司的 Exchange 之间。当它们落进同一张格子，会有什么不同。',
    lede: '问题几乎从来不是其中哪个日历做得差。问题是你有三个，而一周只有一个。',
    commonBelief: '认为把工作和私人生活分放在不同应用里是一条边界，而不是一处缺陷。',
    sections: [
      {
        heading: '撞期是结构性的',
        body: [
          '如果你的承诺住在三个地方，没有任何一个地方能告诉你有没有空。合并这一步就是你自己，而且你是凭记忆执行的，通常还是在别人等着答复的时候。',
          '所以经典的失手不是忘了某个日程，而是答应了某件事，它撞上了一个你当时看不见的日程。',
        ],
      },
      {
        heading: '一张格子能带来什么',
        body: [
          '所有账户落在同一周里，按来源着色，就地可改。你不再琢磨答案在哪个应用里，因为这个问题不再是复数。',
          'iCloud 和 Google 在免费档同步。Microsoft 的账户——Outlook 和 Exchange——归付费档，因为那条连接有别的账户没有的持续成本。',
        ],
      },
    ],
    claims: {
      accounts: '一个视图能容纳的账户类型数',
      premiumMonthly: '加上 Microsoft 的月度费用（美元）',
    },
    practical: [
      '先加个人账户，再加那个制造冲突的。',
      '按账户着色而不是按类别：一眼要看清的是来源。',
      '继续往别人已经在读的那本日历里写。',
    ],
    seeAlso: ['weather-inside-your-calendar', 'what-a-subscription-actually-buys'],
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
