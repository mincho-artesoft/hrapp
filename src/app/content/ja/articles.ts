import { LocalisedArticle } from '../types';

/**
 * The four articles this language carries.
 *
 * Chosen one per intent -- weather, one view, sharing, price -- so the language
 * answers a whole question rather than a quarter of four. The numbers are not
 * here: they live once in article-facts.ts and join the prose by id, so a
 * translation can rewrite every sentence without touching a figure.
 */
export const ARTICLES_JA: Readonly<Record<string, LocalisedArticle>> = {
  'weather-inside-your-calendar': {
  "title": "天気がすでに入っているカレンダー",
  "short": "カレンダーの中の天気",
  "description": "一日の予定を組むのに二つのアプリを見るのがなぜ設計上の欠陥なのか。そして、予報が隣に置かれるのではなく画面の一部になっているカレンダーとはどういうものか。",
  "lede": "ほとんどの人は、二つのアプリのあいだで一日を組み立てている。カレンダーはどこにいるべきかを告げ、天気アプリは着いたときの空模様を告げる。その二つを頭の中で重ね合わせる作業は、誰もやっている自覚がない — 土曜日がひとつ台無しになるまでは。",
  "commonBelief": "カレンダーは予定のためのもの、天気アプリは天気のためのもので、別々にしておくのは単に携帯電話とはそういうものだから、という思い込み。",
  "sections": [
    {
      "heading": "二つのアプリの代償は、二回のタップではない",
      "body": [
        "切り替えること自体は何のコストもかからない。高くつくのは、その二つが「何が大事か」について決して一致しないことだ。カレンダーは土曜の十一時から二時間が埋まっていることを知っている。天気アプリは十時から十三時まで雨が降ることを知っている。どちらも、その二つを合わせると「その枠を動かすべきだ」という意味になることを知らない。",
        "統合レイヤーはあなた自身である。それは忙しくなるまでは機能する。そして忙しいときこそ、予定を守る価値がいちばん高い。"
      ]
    },
    {
      "heading": "利用できる予報",
      "body": [
        "Cloud Calendarsは選択した場所で利用できる予報を使います。時間別と日別のデータでは、対象期間が異なる場合があります。",
        "カレンダーで表示できる日付と予報の対象期間は別です。月表示でも、月全体やすべての予定に予報があるとは限りません。"
      ]
    }
  ],
  "claims": {
    "price": "天気機能の料金"
  },
  "practical": [
    "予報を使って計画する前に、場所、日付、利用できる時間帯を確認してください。"
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-a-subscription-actually-buys"
  ],
  "updated": "2026-10-21"
},

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud・Google・Outlook をひとつの画面に',
    short: '三つのアカウント、ひとつの画面',
    description: 'ほとんどの人の生活は、個人の Apple カレンダー、Google アカウント、仕事の Exchange に分かれている。それらが同じ枠に収まると何が変わるか。',
    lede: '問題は、そのどれかが出来の悪いカレンダーだということではまずない。三つあって、週は一つしかないということだ。',
    commonBelief: '仕事と私生活を別々のアプリに置くのは境界であって、欠点ではない、という思い込み。',
    sections: [
      {
        heading: 'ダブルブッキングは構造的な問題である',
        body: [
          '予定が三か所に散らばっているなら、どの一か所もあなたが空いているかを答えられない。統合の工程はあなた自身であり、しかも記憶を頼りに、たいていは誰かが返事を待っているあいだに実行される。',
          'だから典型的な失敗は予定を忘れることではない。見えなかった予定とぶつかる何かを引き受けてしまうことだ。',
        ],
      },
      {
        heading: 'ひとつの枠が何をもたらすか',
        body: [
          'すべてのアカウントが同じ週に並び、出どころで色分けされ、その場で編集できる。どのアプリに答えがあるのかを考えなくなる。問いが複数形でなくなるからだ。',
          'iCloud と Google は無料版で同期する。Microsoft のアカウント — Outlook と Exchange — は有料版に属する。その接続だけは、他にはない継続的な費用がかかるからだ。',
        ],
      },
    ],
    claims: {
      accounts: 'ひとつの画面に収まるアカウントの種類数',
      premiumMonthly: 'Microsoft を追加する月額（ドル）',
    },
    practical: [
      'まず個人のアカウントを、次に衝突を起こしている方を追加する。',
      '分類ではなくアカウントで色を分ける。一目で必要なのは出どころだ。',
      '他の人がすでに読んでいるカレンダーに書き続ける。',
    ],
    seeAlso: ['weather-inside-your-calendar', 'what-a-subscription-actually-buys'],
  },

  'sharing-one-event-not-your-calendar': {
    title: 'カレンダーではなく、予定をひとつだけ共有する',
    short: '予定をひとつ共有する',
    description: '予定をひとつ送るとどう動くのか、相手が実際に受け取るものは何か、そしてなぜ相手は何もインストールせずに見られるのか。',
    lede: 'カレンダーの共有はたいてい全か無かだ。相手にあなたのカレンダーへのアクセスがあるか、ないか。夕食の誘いを送るのに、そのどちらも必要であってはならない。',
    commonBelief: '予定を共有するとは、週の残りへの窓を誰かに開けることだ、という思い込み。',
    sections: [
      {
        heading: '実際に送られるもの',
        body: [
          '予定を作ると、アプリが共有を提案する。旅をするのはリンクひとつ — メールでも、メッセージでも、相手が入れているもので届く — そのリンクの先には、その予定だけを含み他には何も含まないカレンダーフィードがある。',
          'スクリーンショットでもなければ、古びていく複製でもない。時刻が変われば、フィードも一緒に変わる。送った相手は、あなたが何かを送り直さなくてもその変更を見る。',
        ],
      },
      {
        heading: 'それが何ではないか',
        body: [
          'リンクはごく普通のカレンダー購読だ。Apple のカレンダーが読み、Google カレンダーが読み、Outlook が読む。メッセージにはアプリを使いたい人のための App Clip も同梱される — インストールせずに開く。これは門であって、料金所ではない。',
          '即時ではない。フィードは各アプリに一時間ごとの再確認を求めるが、それは要求であって規則ではない。秘密でもない。リンクには二十二文字のランダムな文字が入っていて誰にも当てられないが、手にした人は読める。そして今のところ読み取り専用だ。',
        ],
      },
    ],
    claims: {
      refreshHint: 'フィードの更新要求の間隔（時間）',
      linkLength: 'リンク内のランダムな文字数 — これが推測を不可能にしている',
      sharePrice: '共有の料金',
    },
    practical: [
      '作成した直後に、予定そのものから共有する。',
      'その相手とすでに使っている手段でリンクを送る。',
      '直前に時刻が変わったときは、予定を動かすだけでなく一言添える。',
      '予定が終わったらリンクを失効させる。書類の共有をやめるのと同じように。',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'weather-inside-your-calendar'],
  },

  'what-a-subscription-actually-buys': {
  "updated": "2026-10-21",
  "title": "サブスクリプションで実際に手に入るもの",
  "short": "サブスクで手に入るもの",
  "description": "サブスクで手に入るもの: Base, Advanced, Premium.",
  "lede": "このガイドはCloud Calendarsの開発元であるArte Softが公開しています。",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "BaseにはGoogle Calendarの同期、Google Meet、カレンダー表示、天気、ウィジェットが含まれます。無料プランでは広告が表示される場合があります。"
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "AdvancedはBaseの機能を含み、広告を非表示にします。PremiumはAdvancedに加え、Microsoft CalendarとMicrosoft Teamsに対応します。",
        "サブスクリプションで他の人のカレンダーの編集権限を購入したり、職場のアカウント制限を回避したりすることはできません。"
      ]
    },
    {
      "heading": "購入と解約について",
      "body": [
        "購入前に、お住まいの地域の価格、請求期間、更新条件を確認してください。",
        "Appleから請求されるサブスクリプションは、設定→自分の名前→サブスクリプションで管理します。状態と有効期限を確認してください。更新の解約はアプリやカレンダーデータの削除とは別です。有効期限後も有料機能を使えるとは限りません。"
      ]
    }
  ],
  "claims": {},
  "practical": [
    "購入前に、お住まいの地域の価格、請求期間、更新条件を確認してください。",
    "サブスクリプションで他の人のカレンダーの編集権限を購入したり、職場のアカウント制限を回避したりすることはできません。"
  ],
  "faq": [
    {
      "q": "更新を停止するには？",
      "a": "Appleから請求されるサブスクリプションは、設定→自分の名前→サブスクリプションで管理します。状態と有効期限を確認してください。更新の解約はアプリやカレンダーデータの削除とは別です。有効期限後も有料機能を使えるとは限りません。"
    }
  ],
  "sourcesHeading": "購入と解約について",
  "sources": [
    {
      "label": "Apple: 更新を停止するには？",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view"
  ]
},
};
