import { LocalisedArticle } from '../types';

/**
 * The four articles this language carries.
 *
 * Chosen one per intent -- weather, one view, sharing, price -- so the language
 * answers a whole question rather than a quarter of four. The numbers are not
 * here: they live once in article-facts.ts and join the prose by id, so a
 * translation can rewrite every sentence without touching a figure.
 */
export const ARTICLES_ZH_HANT: Readonly<Record<string, LocalisedArticle>> = {
  'weather-inside-your-calendar': {
    title: '一個本身就帶著天氣的行事曆',
    short: '行事曆裡的天氣',
    description: '為什麼為了安排一天要看兩個 App 是一處設計缺陷，以及一個把預報放進檢視本身、而不是擺在旁邊的行事曆是什麼樣子。',
    lede: '幾乎所有人都在兩個 App 之間安排自己的一天。行事曆說該去哪裡；天氣 App 說到那裡時天氣如何。把這兩件事在腦中合在一起，是沒人意識到自己在做的那一部分——直到某個週六白白報銷。',
    commonBelief: '認為行事曆是用來記約會的、天氣 App 是用來看天的，把它們分開只不過是手機本來就這樣。',
    sections: [
      {
        heading: '兩個 App 的代價不是兩次點按',
        body: [
          '切換本身不花什麼。真正昂貴的是這兩者從不就「什麼才重要」達成一致。你的行事曆知道週六十一點起有兩個小時被佔；天氣 App 知道十點到十三點下雨。誰都不知道，這兩個事實合起來意味著那個時段該挪。',
          '整合層就是你。這在你不忙的時候管用，而恰恰是忙起來的時候，保住計畫才最值錢。',
        ],
      },
      {
        heading: '當預報就在格子裡，會有什麼不同',
        body: [
          '把預報放到行程背後，衝突自己就解開了。一個潮濕的上午和一個乾燥的下午，和你正要放進去的會議出現在同一眼裡，判斷不再需要花心思。',
          '這不是貼在旁邊的小工具。週檢視和月檢視裡的每一天都帶著自己的天氣，每一個行程都帶著它實際佔用的那幾個小時的預報——而不是那份把你真正需要的部分平均掉的當日摘要。',
        ],
      },
    ],
    claims: {
      forecastDays: '預報天數，在行事曆中以及每個行程旁',
      views: '帶天氣的檢視：日、週、月、年和列表',
      price: '天氣功能的費用',
    },
    practical: [
      '在放進任何戶外安排之前，先看週檢視裡日期背後的那條帶。',
      '點一下行程，看它那幾個小時的預報，而不是那一整天的。',
      '看天氣行事的先對著十四天放，再在提前兩天時微調。',
      '第七天以後的一律當作趨勢，不要當作計畫。',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'what-a-subscription-actually-buys'],
  },

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud、Google 和 Outlook 在同一個檢視裡',
    short: '三個帳戶，一個檢視',
    description: '幾乎每個人的生活都分散在個人的 Apple 行事曆、一個 Google 帳戶和公司的 Exchange 之間。當它們落進同一張格子，會有什麼不同。',
    lede: '問題幾乎從來不是其中哪個行事曆做得差。問題是你有三個，而一週只有一個。',
    commonBelief: '認為把工作和私人生活分放在不同 App 裡是一條邊界，而不是一處缺陷。',
    sections: [
      {
        heading: '撞期是結構性的',
        body: [
          '如果你的承諾住在三個地方，沒有任何一個地方能告訴你有沒有空。合併這一步就是你自己，而且你是憑記憶執行的，通常還是在別人等著答覆的時候。',
          '所以經典的失手不是忘了某個行程，而是答應了某件事，它撞上了一個你當時看不見的行程。',
        ],
      },
      {
        heading: '一張格子能帶來什麼',
        body: [
          '所有帳戶落在同一週裡，按來源著色，就地可改。你不再琢磨答案在哪個 App 裡，因為這個問題不再是複數。',
          'iCloud 和 Google 在免費層同步。Microsoft 的帳戶——Outlook 和 Exchange——歸付費層，因為那條連線有別的帳戶沒有的持續成本。',
        ],
      },
    ],
    claims: {
      accounts: '一個檢視能容納的帳戶類型數',
      premiumMonthly: '加上 Microsoft 的每月費用（美元）',
    },
    practical: [
      '先加個人帳戶，再加那個製造衝突的。',
      '按帳戶著色而不是按類別：一眼要看清的是來源。',
      '繼續往別人已經在讀的那本行事曆裡寫。',
    ],
    seeAlso: ['weather-inside-your-calendar', 'what-a-subscription-actually-buys'],
  },

  'sharing-one-event-not-your-calendar': {
    title: '分享一個行程，而不是整本行事曆',
    short: '分享一個行程',
    description: '傳送單一行程是怎麼運作的，對方實際收到的是什麼，以及為什麼對方不必安裝任何東西就能看。',
    lede: '分享行事曆通常是全有或全無：要麼某人能進你的行事曆，要麼不能。傳一頓晚餐的邀約，本不該需要其中任何一種。',
    commonBelief: '認為分享一個行程就等於給別人開了一扇通往你這一週其餘部分的窗。',
    sections: [
      {
        heading: '真正被傳出去的是什麼',
        body: [
          '建立行程時，App 會提議分享它。上路的是一個連結——透過郵件、透過訊息、透過對方裝了什麼就用什麼——而那個連結背後是一條行事曆訂閱源，裡面只有那一個行程，別無其他。',
          '它既不是截圖，也不是會過期的副本。時間一改，訂閱源跟著改，你傳給的那個人會看到這個改動，而你什麼都不必再傳一遍。',
        ],
      },
      {
        heading: '它不是什麼',
        body: [
          '這個連結就是一份普通的行事曆訂閱：Apple 行事曆讀得了，Google 日曆讀得了，Outlook 也讀得了。訊息裡還附了一個 App Clip，給確實想要這個 App 的人——不用安裝就能開啟。那是一扇門，不是一道收費站。',
          '它不是即時的：訂閱源請求各個 App 每小時再看一次，而那是請求，不是規則。它也不是祕密：連結帶著二十二個隨機字元，沒人猜得到，但拿到它的人都能讀。而且目前只能讀。',
        ],
      },
    ],
    claims: {
      refreshHint: '訂閱源兩次更新請求之間的小時數',
      linkLength: '連結中的隨機字元數——正是它讓連結無法被猜出',
      sharePrice: '分享的費用',
    },
    practical: [
      '就從行程本身分享，建立完立刻就分享。',
      '用你和那個人本來就在用的管道傳這個連結。',
      '如果時間是臨時改的，除了挪行程，還要傳則訊息說一聲。',
      '行程過去之後撤銷連結，就像你會停止分享一份文件一樣。',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'weather-inside-your-calendar'],
  },

  'what-a-subscription-actually-buys': {
    title: '訂閱到底買到了什麼',
    short: '訂閱買到了什麼',
    description: '兩個付費層，它們之間的分界，以及怎麼判斷哪一個——如果有的話——是你的。',
    lede: '如果沒人把分界說清楚，兩個層也足以讓人糊塗。分界在於 Microsoft。',
    commonBelief: '認為更高的那一層只是同樣的功能多來一些。',
    sections: [
      {
        heading: '第一層去掉廣告',
        body: [
          '它還加上了跨 iCloud 和 Google 行事曆管理行程、Google 的分享權限、自動的 Meet 連結，以及更快的天氣更新。但人們買它是為了廣告。',
          '按這個價格，一年下來大約就是一杯咖啡，而且它適合幾乎所有願意花點錢的人。',
        ],
      },
      {
        heading: '第二層是給 Microsoft 的',
        body: [
          'Outlook 和 Exchange 同步、Teams 連結、跨帳戶管理（包括工作帳戶）、參與者管理。它貴一個數量級，因為那條連線本身也貴一個數量級。',
          '如果你的工作行事曆不在 Microsoft 上，這一層裡沒有屬於你的東西。兩個層按年都更便宜；省下的是適度的，不是驚人的。取消之後你回到免費層，行事曆完好無損，因為那些行程從來就不屬於我們。',
        ],
      },
    ],
    claims: {
      advancedMonthly: '第一層，每月，美元',
      advancedYearly: '第一層，每年，美元',
      premiumMonthly: '第二層，每月，美元',
      premiumYearly: '第二層，每年，美元',
    },
    practical: [
      '買第一層是為了去掉廣告，不是為了解鎖行事曆。',
      '只有當你的工作住在 Microsoft 上時才買第二層。',
      '確定了再轉按年付；省的錢是真的，但不多。',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view'],
  },
};
