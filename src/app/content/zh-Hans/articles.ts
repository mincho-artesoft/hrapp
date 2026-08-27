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
    title: '一个本身就带着天气的日历',
    short: '日历里的天气',
    description: '为什么为了安排一天要看两个应用是一处设计缺陷，以及一个把预报放进视图本身、而不是摆在旁边的日历是什么样子。',
    lede: '几乎所有人都在两个应用之间安排自己的一天。日历说该去哪里；天气应用说到那儿时天怎么样。把这两件事在脑子里合在一起，是没人意识到自己在做的那一部分——直到有个周六白白报废。',
    commonBelief: '认为日历是用来记约会的、天气应用是用来看天的，把它们分开只不过是手机本来就这样。',
    sections: [
      {
        heading: '两个应用的代价不是两次点按',
        body: [
          '切换本身不花什么。真正昂贵的是这两者从不就"什么才重要"达成一致。你的日历知道周六十一点起有两个小时被占；天气应用知道十点到十三点下雨。谁都不知道，这两个事实合起来意味着那个时间块该挪。',
          '整合层就是你。这在你不忙的时候管用，而恰恰是忙起来的时候，保住计划才最值钱。',
        ],
      },
      {
        heading: '当预报就在格子里，会有什么不同',
        body: [
          '把预报放到日程背后，冲突自己就解开了。一个潮湿的上午和一个干燥的下午，和你正要放进去的会议出现在同一眼里，判断不再需要花心思。',
          '这不是贴在旁边的小组件。周视图和月视图里的每一天都带着自己的天气，每一个日程都带着它实际占用的那几个小时的预报——而不是那份把你真正需要的部分平均掉的当日摘要。',
        ],
      },
    ],
    claims: {
      forecastDays: '预报天数，在日历中以及每个日程旁',
      views: '带天气的视图：日、周、月、年和列表',
      price: '天气功能的费用',
    },
    practical: [
      '在放进任何户外安排之前，先看周视图里日期背后的那条带。',
      '点一下日程，看它那几个小时的预报，而不是那一整天的。',
      '看天吃饭的事先对着十四天放，再在提前两天时微调。',
      '第七天以后的一律当作趋势，不要当作计划。',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'what-a-subscription-actually-buys'],
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
    title: '分享一个日程，而不是整本日历',
    short: '分享一个日程',
    description: '发送单个日程是怎么运作的，对方实际收到的是什么，以及为什么对方不必安装任何东西就能看。',
    lede: '分享日历通常是全有或全无：要么某人能进你的日历，要么不能。发一顿晚饭的邀约，本不该需要其中任何一种。',
    commonBelief: '认为分享一个日程就等于给别人开了一扇通往你这一周其余部分的窗。',
    sections: [
      {
        heading: '真正被发出去的是什么',
        body: [
          '创建日程时，应用会提议分享它。上路的是一个链接——通过邮件、通过消息、通过对方装了什么就用什么——而那个链接背后是一条日历订阅源，里面只有那一个日程，别无其他。',
          '它既不是截图，也不是会过期的副本。时间一改，订阅源跟着改，你发给的那个人会看到这个改动，而你什么都不必再发一遍。',
        ],
      },
      {
        heading: '它不是什么',
        body: [
          '这个链接就是一份普通的日历订阅：Apple 日历读得了，Google 日历读得了，Outlook 也读得了。消息里还附了一个 App Clip，给确实想要这个应用的人——不用安装就能打开。那是一扇门，不是一道收费站。',
          '它不是即时的：订阅源请求各个应用每小时再看一次，而那是请求，不是规则。它也不是秘密：链接带着二十二个随机字符，没人猜得到，但拿到它的人都能读。而且目前只能读。',
        ],
      },
    ],
    claims: {
      refreshHint: '订阅源两次刷新请求之间的小时数',
      linkLength: '链接中的随机字符数——正是它让链接无法被猜出',
      sharePrice: '分享的费用',
    },
    practical: [
      '就从日程本身分享，创建完立刻就分享。',
      '用你和那个人本来就在用的渠道发这个链接。',
      '如果时间是临时改的，除了挪日程，还要发条消息说一声。',
      '日程过去之后撤销链接，就像你会停止分享一份文档一样。',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'weather-inside-your-calendar'],
  },

  'what-a-subscription-actually-buys': {
    title: '订阅到底买到了什么',
    short: '订阅买到了什么',
    description: '两个付费档，它们之间的分界，以及怎么判断哪一个——如果有的话——是你的。',
    lede: '如果没人把分界说清楚，两个档也足以让人糊涂。分界在于 Microsoft。',
    commonBelief: '认为更高的那一档只是同样的功能多来一些。',
    sections: [
      {
        heading: '第一档去掉广告',
        body: [
          '它还加上了跨 iCloud 和 Google 日历管理日程、Google 的分享权限、自动的 Meet 链接，以及更快的天气刷新。但人们买它是为了广告。',
          '按这个价格，一年下来大约就是一杯咖啡，而且它适合几乎所有愿意花点钱的人。',
        ],
      },
      {
        heading: '第二档是给 Microsoft 的',
        body: [
          'Outlook 和 Exchange 同步、Teams 链接、跨账户管理（包括工作账户）、参与者管理。它贵一个数量级，因为那条连接本身也贵一个数量级。',
          '如果你的工作日历不在 Microsoft 上，这一档里没有属于你的东西。两个档按年都更便宜；省下的是适度的，不是惊人的。取消之后你回到免费档，日历完好无损，因为那些日程从来就不属于我们。',
        ],
      },
    ],
    claims: {
      advancedMonthly: '第一档，每月，美元',
      advancedYearly: '第一档，每年，美元',
      premiumMonthly: '第二档，每月，美元',
      premiumYearly: '第二档，每年，美元',
    },
    practical: [
      '买第一档是为了去掉广告，不是为了解锁日历。',
      '只有当你的工作住在 Microsoft 上时才买第二档。',
      '确定了再转按年付；省的钱是真的，但不多。',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view'],
  },
};
