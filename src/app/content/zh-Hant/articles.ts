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
  "month-view-on-a-bigger-screen": {
  "updated": "2026-10-22",
  "title": "iPad 與 iPhone 月顯示方式：先看日期，再查詳情",
  "short": "使用月檢視，不漏看細節",
  "description": "在 iPad 或 iPhone 比較日期。移動共享或重複約會前，檢查隱藏活動、已選行事曆與確切時間。",
  "lede": "月檢視能看出事項分布在哪些日期，卻不適合證明某個小時有空。先用總覽選日期，再查看當天和活動，最後確認安排。本指南由 Cloud Calendars 開發者 Arte Soft 發布。",
  "commonBelief": "更大的月份格線會顯示全部細節，而看似空白的日期證明所有人都有空。",
  "sections": [
    {
      "heading": "確認需要日期還是確切時間",
      "body": [
        "用月檢視比較跨數週的專案期限、旅行與家庭約會。如果要確認兩個約會是否在 14:30 重疊，請切換至日或週檢視，查看確切起訖時間。月份儲存格並沒有逐小時格線的時間刻度。",
        "例如，挑選工作坊日期的主辦人可以先避開旅行週，再檢查候選日的既有事項、準備、交通及必須結束的時間。看似空閒的格子是待查日期，不是已確認預約，也不代表其他人的可用時間。"
      ]
    },
    {
      "heading": "留意額外活動數量",
      "body": [
        "Cloud Calendars 目前的月份儲存格顯示有限數量的活動標籤，同一天還有活動時會標示額外數量。標題維持一行，因此可能縮短。需要完整標題或其他行程時，請開啟當天或個別活動。",
        "iPad 較大螢幕可能更容易閱讀，但不要假設更多空間會移除所有顯示限制。較窄的 App 視窗或較大的文字都會影響容量。iPhone 也應先查看當天，不能將可見標籤當成完整行程。"
      ]
    },
    {
      "heading": "檢查月份、已選行事曆與相鄰日期",
      "body": [
        "挑選日期前，先讀取顯示的月份與年份。為補齊列，月份格線可能包含相鄰月份日期。在 Cloud Calendars 使用月份導覽並確認所選日期，不要只依方格位置判斷。",
        "檢查選取了哪些行事曆。隱藏工作活動可能方便閱讀家庭計畫，但也會將那些事項移出這份總覽。排查重複項目時，可暫時隱藏一個來源比較；不要只為讓月份清爽些就刪除約會。"
      ]
    },
    {
      "heading": "變更共同安排前先開啟活動",
      "body": [
        "在活動詳情確認標題、擁有者或行事曆、當地時間與長度。顏色有助瀏覽，卻不能代替確認帳號或編輯權限。看得到的邀請，與自己主辦的約會不同。",
        "Cloud Calendars 可在月檢視透過拖放將活動移至其他日期。操作真實約會前，確認目標日期與重複修改範圍。獲准變更後，重新開啟確認結果；本機手勢並不能證明供應商或每位參與者已接受新安排。"
      ]
    },
    {
      "heading": "分別檢查重複範圍與時區",
      "body": [
        "若只移動本週課程，不要不小心改變未來模式。閱讀可用的重複範圍選項，之後檢查修改過的一次及稍後的一次。月檢視容易比較重複日期，但變更意義由編輯範圍決定。",
        "旅行或跨時區會議應明確檢查活動的當地日期與時間。移到另一天不會自動轉換原本預期的會議時間。相關時請查看日光節約時間切換，並與相關人員確認約定時間。"
      ]
    },
    {
      "heading": "不要將較大檢視與其他產品混淆",
      "body": [
        "Apple 行事曆有自己的月份顯示選項，Teamup 也說明瀏覽器和行動版有不同檢視組合。這些控制屬於各自產品。不要因版面名稱相同，就在 Cloud Calendars 尋找 Teamup 瀏覽器設定或 Apple 行事曆檢視選單。",
        "一個月的約會也不代表一個月的天氣預報。戶外計畫應另外檢查地點、日期與有預報的時段。將最終約會儲存至預期行事曆，並直接與參與者確認變更。"
      ]
    }
  ],
  "claims": {},
  "practical": [
    "用月檢視篩選日期，再於日或週檢視查看確切時間。",
    "開啟有額外數量或縮短標題的日期。",
    "判定日期空閒前，檢查月份、年份及已選行事曆。",
    "確認活動行事曆、時間、長度及編輯權限。",
    "閱讀重複範圍，並檢查移動後儲存的那次活動。",
    "另外檢查天氣預報，並與參與者確認變更。"
  ],
  "faq": [
    {
      "q": "iPad 月檢視會完整顯示每個約會嗎？",
      "a": "不要如此假設。Cloud Calendars 限制儲存格內的活動標籤，並顯示額外數量。請開啟當天及活動查看完整行程。"
    },
    {
      "q": "空白日期表示我有空嗎？",
      "a": "先檢查已選行事曆、日期及相關帳號資料是否存在。總覽只代表目前可用且顯示的資訊。"
    },
    {
      "q": "移動重複活動只會變更那一天嗎？",
      "a": "請閱讀編輯範圍選項。儲存後查看修改過的一次及稍後的一次，再確認是否符合預期。"
    }
  ],
  "sourcesHeading": "比較官方檢視說明",
  "sources": [
    {
      "label": "Apple：月份、多日與列表檢視",
      "url": "https://support.apple.com/en-ca/guide/iphone/iphfd1054569/ios"
    },
    {
      "label": "Teamup：行事曆檢視與瀏覽器、App 設定",
      "url": "https://calendar.teamup.com/kb/how-to-use-calendar-views/"
    }
  ],
  "seeAlso": []
},

  'weather-inside-your-calendar': {
  "title": "一個本身就帶著天氣的行事曆",
  "short": "行事曆裡的天氣",
  "description": "為什麼為了安排一天要看兩個 App 是一處設計缺陷，以及一個把預報放進檢視本身、而不是擺在旁邊的行事曆是什麼樣子。",
  "lede": "幾乎所有人都在兩個 App 之間安排自己的一天。行事曆說該去哪裡；天氣 App 說到那裡時天氣如何。把這兩件事在腦中合在一起，是沒人意識到自己在做的那一部分——直到某個週六白白報銷。",
  "commonBelief": "認為行事曆是用來記約會的、天氣 App 是用來看天的，把它們分開只不過是手機本來就這樣。",
  "sections": [
    {
      "heading": "兩個 App 的代價不是兩次點按",
      "body": [
        "切換本身不花什麼。真正昂貴的是這兩者從不就「什麼才重要」達成一致。你的行事曆知道週六十一點起有兩個小時被佔；天氣 App 知道十點到十三點下雨。誰都不知道，這兩個事實合起來意味著那個時段該挪。",
        "整合層就是你。這在你不忙的時候管用，而恰恰是忙起來的時候，保住計畫才最值錢。"
      ]
    },
    {
      "heading": "可用的天氣預報",
      "body": [
        "Cloud Calendars 使用所選地點的可用預報。逐小時和逐日資料可能涵蓋不同的時間範圍。",
        "行事曆中可瀏覽的日期並不決定預報範圍。月檢視不代表整個月或每個行程都有天氣預報。"
      ]
    }
  ],
  "claims": {
    "price": "天氣功能的費用"
  },
  "practical": [
    "根據預報規劃之前，請檢查地點、日期和有資料的時段。"
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-a-subscription-actually-buys"
  ],
  "updated": "2026-10-21"
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
  "updated": "2026-10-21",
  "title": "分享單一行程：選擇適合的連結與權限",
  "short": "分享單一行程",
  "description": "分享一個行程，而非整份行事曆。了解 Reader、Writer、Owner 權限、預覽、更新，以及撤銷存取權的限制。",
  "lede": "傳送聚餐資訊、讓共同主辦人編輯，以及收集出席答覆，是不同的工作。先確定目的，再選擇分享方式。本指南由 Cloud Calendars 開發商 Arte Soft 撰寫。",
  "commonBelief": "每個行程連結都是唯讀訂閱，會立即更新並記錄出席答覆。",
  "sections": [
    {
      "heading": "先檢查行程內容",
      "body": [
        "單一行程分享只涵蓋該行程，不是寄件者的整份行事曆。傳送前請檢查標題、時區、地點、備註和會議連結。適合某位來賓的資訊，不一定適合廣泛傳播。",
        "分享聚餐不必開放包含就醫預約的整份行事曆，但聚餐本身的地址與連結仍會一併分享。請檢查行程內容，而不是只依賴周圍行事曆的隱私設定。"
      ]
    },
    {
      "heading": "選擇預覽、電子郵件或 QR 碼",
      "body": [
        "Cloud Calendars 的 App Clip 提供行程預覽；透過此流程加入行程需要完整 App。電子郵件與 QR 邀請會開啟網頁，提供開啟 Cloud Calendars 的選項。這些連結不是可以互換的訂閱網址。",
        "寄件者需要登入才能使用同步分享。連結與 QR 碼可以轉傳，因此請只傳給適合接收內容的對象。QR 碼只是傳遞連結，無法證明誰開啟了它。"
      ]
    },
    {
      "heading": "只給予必要權限",
      "body": [
        "電子郵件邀請可選擇 Reader、Writer 或 Owner。Reader 可檢視與同步；Writer 可編輯；Owner 還可分享並管理存取權。只需要查看時間表的人適合 Reader。",
        "需要修改行程的共同主辦人可使用 Writer。只有需要管理他人權限時才給予 Owner。較高權限需要以正確身分登入；匿名收件者不等於已確認身分的共同擁有者。"
      ]
    },
    {
      "heading": "了解收件者如何加入行程",
      "body": [
        "完整 App 需要行事曆權限，以及可寫入的目標行事曆。收件者應在儲存前確認目標。接收的副本可與分享行程關聯，以接收後續更新。",
        "這不同於將一般 ICS 檔案匯入其他行事曆。匯入建立副本，訂閱則定期檢查資訊來源。如果傳送的是 ICS 訂閱來源而非 App 邀請，請說明差異並確認對方的行事曆支援。"
      ]
    },
    {
      "heading": "先確認變更已送達",
      "body": [
        "同步分享可以傳遞編輯或取消，但收件者的裝置必須有機會接收。資訊來源的更新提示不是送達期限。離線裝置、尚未重新整理的訂閱，或獨立匯入的副本，仍可能顯示舊資料。",
        "若聚餐臨時改時間，請更新行程並直接聯絡來賓，要求確認新時間。收到更新與答覆是否出席是兩件事。"
      ]
    },
    {
      "heading": "管理權限不代表刪除所有副本",
      "body": [
        "檢查收件者並移除不再需要的權限。移除收件者和撤銷訂閱來源連結是不同操作；兩者都不應被說成能遠端刪除所有截圖、訊息或行事曆副本。",
        "若連結已傳到原定對象以外，先確認涉及哪個連結或權限，變更後再檢查結果。日後不要把私人細節放進廣泛流傳的連結，而依賴事後撤銷來收回資料。"
      ]
    }
  ],
  "claims": {},
  "practical": [
    "檢查行程內容，確定目的是檢視、編輯還是取得出席答覆。",
    "選擇分享方式，並在需要時登入。",
    "查看者使用 Reader；只有相應責任才給予 Writer 或 Owner。",
    "請收件者加入時確認時間與目標行事曆。",
    "緊急變更請更新行程並直接傳訊息。",
    "分享結束時，分別檢查收件者權限與連結存取權。"
  ],
  "faq": [
    {
      "q": "分享一個行程會公開整份行事曆嗎？",
      "a": "同步分享單一行程只涵蓋該行程，但仍會顯示它自己的詳細資料。請檢查內容；只想分享一個行程時，不要傳送整份行事曆的邀請。"
    },
    {
      "q": "收件者可以修改行程嗎？",
      "a": "可以，但需要適當的 Writer 或 Owner 權限，並使用支援的登入流程。Reader 用於檢視與同步。一般 ICS 訂閱不是相同的編輯機制。"
    },
    {
      "q": "移除對方能撤回所有已收到的資料嗎？",
      "a": "不能假設有這種保證。分享關係的存取權會改變，但儲存的副本、截圖與訊息可能保留。分享的訂閱網址也必須分別考慮。"
    }
  ],
  "sourcesHeading": "收件者選項參考資料",
  "sources": [
    {
      "label": "Apple：App Clips 概覽",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google：匯入行程與限制",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft：匯入與訂閱行事曆的差異",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "taking-back-a-calendar-you-shared"
  ]
},

  'what-a-subscription-actually-buys': {
  "updated": "2026-10-21",
  "title": "訂閱到底買到了什麼",
  "short": "訂閱買到了什麼",
  "description": "訂閱買到了什麼: Base, Advanced, Premium.",
  "lede": "本指南由 Cloud Calendars 的開發商 Arte Soft 發布。",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "Base 包含 Google Calendar 同步、Google Meet、行事曆檢視、天氣和小工具。免費方案可能顯示廣告。"
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Advanced 包含 Base 功能並移除廣告。Premium 包含 Advanced，並增加 Microsoft Calendar 和 Microsoft Teams 支援。",
        "訂閱不會授予編輯他人行事曆的權限，也不能繞過工作帳號的限制。"
      ]
    },
    {
      "heading": "購買與取消訂閱資訊",
      "body": [
        "購買前，請檢查當地價格、計費週期和續訂條款。",
        "對於透過 Apple 計費的訂閱，請開啟「設定」→你的姓名→「訂閱項目」，檢查狀態和到期日期。取消續訂與刪除 App 或行事曆資料是不同的操作；不要假定付費功能在到期後仍可使用。"
      ]
    }
  ],
  "claims": {},
  "practical": [
    "購買前，請檢查當地價格、計費週期和續訂條款。",
    "訂閱不會授予編輯他人行事曆的權限，也不能繞過工作帳號的限制。"
  ],
  "faq": [
    {
      "q": "如何停止續訂？",
      "a": "對於透過 Apple 計費的訂閱，請開啟「設定」→你的姓名→「訂閱項目」，檢查狀態和到期日期。取消續訂與刪除 App 或行事曆資料是不同的操作；不要假定付費功能在到期後仍可使用。"
    }
  ],
  "sourcesHeading": "購買與取消訂閱資訊",
  "sources": [
    {
      "label": "Apple: 如何停止續訂？",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view"
  ]
},
};
