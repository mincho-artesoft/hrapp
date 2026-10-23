import type { LocalisedArticle } from '../types';

export const PRIORITY_ZH_HANT: Readonly<Record<string, LocalisedArticle>> = {
  "forecast-beside-every-event": {
    "title": "在 iPhone 與 iPad 上查看行事曆活動的每小時天氣",
    "short": "活動時段的天氣",
    "description": "將活動的地點、日期與時段，對照可用的天氣預報。",
    "lede": "若要查看行事曆活動的天氣，請比對三件事：地點、當地日期，以及活動從開始到結束的時段。在 Cloud Calendars 中，請選擇天氣地點並查看可用的小時資料。活動地址與附近的天氣圖示，本身並不能證明兩者一致。本指南由開發者 Arte Soft 發布。",
    "commonBelief": "以為行事曆上的每日天氣圖示，和附加在事件上的天氣預報是同一項功能。",
    "sections": [
      {
        "heading": "先確認地點與日期",
        "body": [
          "開啟目標地點的天氣預報，並將日期與行事曆項目比對。行事曆天氣可能會反映所選的天氣地點，因此請確認該地點適用於這個事件，不要直接假設會由事件地址決定。",
          "下個月的事件可能已建立，但該日期的天氣資料尚未提供。請先保留事件，並在接近當天時再查看預報；沒有天氣資訊不代表預測為晴天。"
        ]
      },
      {
        "heading": "要看時段問題，就用逐小時資訊",
        "body": [
          "每日摘要與逐小時預報回答的是不同問題。如果事件從 2 點持續到 5 點，請查看涵蓋該時段的可用小時資料，而不要把單一每日圖示當成完整情況。",
          "如果只有部分時段有資料，其餘部分就應視為尚未確定。App 並未承諾你建立的每個事件都一定會有完整的逐小時天氣，本指南也沒有保證開啟任何事件時都一定會顯示其完整天氣時段。"
        ]
      },
      {
        "heading": "區分機率、數量與時間",
        "body": [
          "請查看你正在確認的數值標示。降水機率不等於降雨量或持續時間。同樣地，逐小時數值與每日摘要涵蓋的期間不同；比較兩個可能時段時，請以相同期間的資料互相比較。",
          "請依你的方案選擇合適的備用安排，不要把單一百分比視為通用的進行或取消規則。天氣資訊可能變動，因此在需要做決定時請再次查看。"
        ]
      },
      {
        "heading": "依天氣建立事件前先檢查",
        "body": [
          "App 可從某個預報小時開始建立事件草稿。儲存前請檢查草稿的日期、開始時間、結束時間，以及目標行事曆。選取預報時段並不能取代你確認是否建立了正確事件。",
          "如果因行事曆存取權限或目標行事曆而無法儲存，請將該權限問題與天氣存取分開處理。找到天氣預報並不代表你就有共享行事曆的編輯權限。"
        ]
      },
      {
        "heading": "當摘要不足時，請查看完整預報",
        "body": [
          "若是戶外活動，請檢查與該活動相關的變數，以及你實際選擇的地點。目前天氣小工具或首頁示範，不能取代查看 App 中可用的逐小時預報。",
          "如果你發現顯示有差異，請先比對地點與時間戳記。不同供應商、所選地點與預報期間都可能造成不同顯示，這並不表示行事曆事件已變更。"
        ]
      }
    ],
    "claims": {},
    "practical": [
      "確認地點與事件日期。",
      "查看整個活動期間可用的逐小時資料。",
      "將機率與數量視為不同數值。",
      "儲存前先檢查事件草稿。"
    ],
    "seeAlso": [
      "weather-inside-your-calendar",
      "planning-outdoors-without-being-rained-on"
    ],
    "updated": "2026-10-23",
    "faq": [
      {
        "q": "每個事件都有完整預報嗎？",
        "a": "沒有。涵蓋情況取決於所選地點，以及可用的日期與時段。"
      },
      {
        "q": "天氣圖示是依事件地址顯示的嗎？",
        "a": "不要因為它顯示在事件旁邊就這樣推定。請另外確認天氣地點。"
      },
      {
        "q": "點一下某個小時就會儲存新的事件嗎？",
        "a": "在支援的情況下，這會開始建立事件草稿。儲存前請檢查日期、時間和行事曆。"
      }
    ],
    "sourcesHeading": "天氣資料來源與位置設定",
    "sources": [
      {
        "label": "Apple：WeatherKit 預報與區域供應情況",
        "url": "https://developer.apple.com/weatherkit/"
      },
      {
        "label": "Apple：隱私權與定位服務",
        "url": "https://support.apple.com/en-us/102515"
      }
    ],
    "comparison": {
      "heading": "戶外活動前的實用檢查",
      "columns": [
        "檢查項目",
        "範例",
        "決定"
      ],
      "rows": [
        {
          "cells": [
            "地點",
            "活動在另一座城市。",
            "在天氣檢視中選取該目的地，並確認其名稱。"
          ]
        },
        {
          "cells": [
            "時段",
            "活動時間是 14:00 到 16:00。",
            "同時查看這兩個小時，以及相關的準備或交通時間。"
          ]
        },
        {
          "cells": [
            "涵蓋範圍",
            "只提供了部分所需時段的資料。",
            "先把計畫視為暫定，並安排之後再檢查一次。"
          ]
        },
        {
          "cells": [
            "已儲存的活動",
            "你從某個天氣時段開始建立草稿。",
            "儲存前，請檢查日期、時區、時長與目標行事曆。"
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-right",
      "week-left"
    ],
    "galleryCaption": "天氣檢視與週檢視呈現的是同一項規劃工作的不同部分。請將預報地點與活動地點分開確認。",
    "actionHeading": "將預報與你的實際活動對照",
    "actionText": "在 iPhone 或 iPad 上使用 Cloud Calendars，查看可用預報與你的行程。天氣只能幫助你做判斷；它不會自動移動活動，也不會替你向參與者確認變更。",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "了解行事曆與天氣檢視"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "選擇主畫面的快速總覽"
      },
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "查看支撐你行程的行事曆"
      }
    ]
  },
  "the-widget-that-shows-what-is-next": {
    "updated": "2026-10-23",
    "title": "iPhone 與 iPad 上的行事曆小工具：即將到來的活動與天氣",
    "short": "主畫面上的即將到來活動",
    "description": "為即將到來的活動、日期或天氣選擇 Cloud Calendars 小工具。",
    "lede": "如果你想在主畫面查看即將到來的活動，請選擇 Calendar Events 或 Calendar Events Large。若要顯示日期與天氣，請選擇 Calendar & Weather。這些版面回答的是不同問題；加入前，請先預覽你的裝置所提供的版本。本指南由 Cloud Calendars 的開發者 Arte Soft 發布。",
    "sections": [
      {
        "heading": "請先選擇事件版面配置",
        "body": [
          "在 Cloud Calendars 小工具圖庫中，Calendar Events 是中型的事件清單版面。Calendar Events Large 可為即將到來的事件提供更多顯示空間。Calendar & Weather 則是獨立的日期與天氣版面；其小尺寸不保證會顯示下一個事件列。名稱在你的裝置上可能會以翻譯後的版本顯示。",
          "在 iPhone 上，長按主畫面的空白區域，選擇「編輯」並點選「加入小工具」，然後找到 Cloud Calendars 並選擇所需版面。加入前先比較預覽內容。Apple 的小工具說明適用於這個系統圖庫；它與 App 內的行事曆檢視是分開的。"
        ]
      },
      {
        "heading": "在 iPad 上加入並檢查小工具",
        "body": [
          "在 iPad 上，使用 Apple 的主畫面小工具圖庫：長按背景，開啟「編輯」，再點選「加入小工具」。搜尋 Cloud Calendars，查看提供的樣式與尺寸，加入你需要的版面，調整位置後按「完成」。請依照你的 iPadOS 版本顯示的控制項操作；看到預覽不代表你的行事曆資料已載入。",
          "如果你需要查看事件，請選擇 Calendar Events 或 Calendar Events Large。比較已安裝 App 提供的樣式；日期與天氣資訊磚所回答的問題，與事件清單不同。",
          "在該 iPad 上開啟 Cloud Calendars，於已選取的行事曆中找出一個你知道會在未來發生的定時事件。iPhone 上顯示正確，並不能證明 iPad 上的帳號、存取權限或資料載入都正確。請比對標題、日期與開始時間；若小工具顯示不同，再繼續進行下方的適用條件與更新檢查。"
        ]
      },
      {
        "heading": "確認哪些內容會被視為即將到來",
        "body": [
          "事件顯示會使用已選取的行事曆，以及未來的定時事件。全天項目和開始時間已經過去的事件，都不會出現在這個即將到來的清單中。因此，生日或正在進行中的會議，可能會在 App 內可見，卻不會顯示在這裡。",
          "例如，如果你今天唯一的項目是一個全天的旅行標籤，即將到來清單空白，並不代表旅行標籤遺失了。請開啟 App 檢查完整的當日行程。同樣地，下一個定時事件也可能是在明天或更晚；請查看其日期，而不要假設每一列都是今天的事件。"
        ]
      },
      {
        "heading": "區分是事件遺失，還是清單列數已滿",
        "body": [
          "小工具只會顯示有限數量的即將到來事件。如果較早的事件已占滿列數，較晚的事件就可能不會出現，即使它在 App 中存在，且符合即將到來清單的條件也是如此。較大的事件版面可以顯示更多列，但仍不是完整的行事曆。",
          "先從已選取行事曆中最近的一個未來定時事件開始檢查。如果它有顯示，但較晚的事件沒有，請開啟 App 檢查其餘行程。如果最近且符合條件的事件也遺失了，請繼續檢查行事曆選取狀態、存取權限與更新情況。不要只是為了讓較晚的項目顯示出來，就去移動或刪除事件。"
        ]
      },
      {
        "heading": "先以 App 作為比對基準",
        "body": [
          "開啟 Cloud Calendars，找出一個特定的未來定時事件。確認其所屬行事曆已被選取，且 App 擁有所需的行事曆存取權限。將其標題、日期與開始時間與小工具比對。若該事件在 App 中也遺失，請先檢查帳號或同步問題。",
          "如果你需要一個清楚的範例，請在你擁有的行事曆中建立一個不影響他人的測試事件。給它一個未來的開始時間與容易辨識的標題。不要只是為了測試主畫面，就去修改真實邀請或移除帳號。"
        ]
      },
      {
        "heading": "預留更新時間，但不要假定有固定期限",
        "body": [
          "小工具顯示的是已儲存資訊，不會像開啟中的 App 那樣持續執行。其更新排程由 Apple 控制。開啟 App 並檢查事件，可以讓你取得新的比對基準，但這不代表小工具必須在幾秒內完成變更。",
          "如果 App 持續顯示正確，但小工具仍然錯誤，請記下版面、已選取的行事曆、事件時間，以及 App／iOS 版本。清單空白、顯示舊事件，與時間錯誤，是不同的觀察結果；請明確記錄你看到的是哪一種。"
        ]
      },
      {
        "heading": "將天氣視為獨立摘要來閱讀",
        "body": [
          "日期旁的天氣資訊，並不是附加在每個事件地點與開始時間上的預報。在戶外活動前，請開啟天氣檢視並確認預定地點與時段。當前天氣狀況圖示無法用來判定稍後會議時的天氣條件。",
          "請將這個小工具用於快速掌握概況。若要查看全天安排、事件詳細資訊，以及需要完整行程才能做出的決定，請使用完整行事曆。"
        ]
      }
    ],
    "claims": {},
    "practical": [
      "若要查看事件清單，請選擇 Calendar Events 或 Calendar Events Large。",
      "確認已選取的行事曆中有一個未來的定時事件。",
      "在排查小工具問題前，先在 App 中比對其日期與時間。",
      "若差異持續存在，請記錄情況，而不是刪除行事曆資料。"
    ],
    "faq": [
      {
        "q": "為什麼我的生日沒有顯示？",
        "a": "即將到來清單不包含全天事件。請在完整行事曆中查看生日和其他只有日期的項目。"
      },
      {
        "q": "小型小工具會顯示下一場會議嗎？",
        "a": "小型的 Calendar & Weather 版面會顯示日期與天氣。若要查看事件，請選擇事件清單版面。"
      },
      {
        "q": "沒有即將到來的事件，是否表示我今天有空？",
        "a": "不是。全天項目、進行中的事件、未選取的行事曆，以及過時資訊，都可能讓這個結論不成立。"
      }
    ],
    "sourcesHeading": "來源與 Apple 操作說明",
    "sources": [
      {
        "label": "Apple：在 iPhone 上加入與編輯小工具",
        "url": "https://support.apple.com/118610"
      },
      {
        "label": "Apple：讓小工具保持最新狀態",
        "url": "https://developer.apple.com/documentation/widgetkit/keeping-a-widget-up-to-date"
      },
      {
        "label": "Apple：在 iPad 上加入、編輯與移除小工具",
        "url": "https://support.apple.com/guide/ipad/add-edit-and-remove-widgets-ipadb0de8630/ipados"
      }
    ],
    "seeAlso": [
      "choosing-a-widget-size",
      "a-countdown-to-your-next-meeting",
      "calendar-on-apple-watch"
    ],
    "comparison": {
      "heading": "選擇你真正需要的顯示方式",
      "columns": [
        "顯示方式",
        "適用情境",
        "依賴前請先確認"
      ],
      "rows": [
        {
          "cells": [
            "Calendar Events",
            "即將到來定時事件的精簡檢視。",
            "該事件屬於已選取的行事曆，且尚未開始。"
          ]
        },
        {
          "cells": [
            "Calendar Events Large",
            "為即將到來的事件提供更多顯示空間。",
            "即使是較大的版面，顯示列數仍然有限。"
          ]
        },
        {
          "cells": [
            "Calendar & Weather",
            "快速查看日期與天氣概況。",
            "其小型版面不保證會顯示即將到來的事件列。"
          ]
        },
        {
          "cells": [
            "Live Activity",
            "在支援的 iPhone 顯示介面上，以獨立方式倒數下一個事件。",
            "它不是主畫面小工具，也不是專用的鎖定畫面小工具版面。"
          ]
        }
      ]
    },
    "galleryKinds": [
      "widgets",
      "live"
    ],
    "galleryCaption": "主畫面小工具與 Live Activity 是不同的顯示方式。請選擇符合你所需資訊的版面。",
    "actionHeading": "把行程中真正有用的部分放到主畫面",
    "actionText": "開啟 Cloud Calendars，先確認一個已知的未來定時事件，然後在 iPhone 或 iPad 上加入合適的小工具。若要檢查完整行事曆，仍應以 App 為準。",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "在行程旁查看天氣"
      },
      {
        "slug": "forecast-beside-every-event",
        "label": "查看戶外活動的各時段天氣"
      },
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "檢查你已連接的行事曆帳號"
      }
    ]
  },
  "onecal-alternative-iphone-calendar-view-or-sync": {
    "updated": "2026-10-23",
    "title": "Cloud Calendars 還是 OneCal？選擇整合檢視或日曆同步",
    "short": "依工作流程比較 Cloud Calendars 與 OneCal",
    "description": "比較 OneCal 與 Cloud Calendars 的檢視方式、複製事件、行動裝置控制與方案。",
    "lede": "請依你需要的結果來選擇：一起檢視多個行程、編輯原始事件，或把忙碌時段複製到另一個帳號。Cloud Calendars 提供 iPhone 與 iPad 的規劃檢視；OneCal 則將整合檢視與獨立的 Calendar Sync 規則分開說明。本文由 Cloud Calendars 開發商 Arte Soft 發布。",
    "commonBelief": "凡是能顯示 Google、iCloud 與 Outlook 日曆的兩項產品，必然會以相同方式同步可用性、事件編輯與副本。",
    "sections": [
      {
        "heading": "在總覽與變更另一個帳號之間做選擇",
        "body": [
          "如果你的目標是把私人行程與工作會議並排查看，你需要的是整合檢視。如果你的工作日曆也必須包含該私人行程的忙碌區塊，你需要的是明確定義的來源到目的地工作流程。前者並不會自動產生後者。",
          "Cloud Calendars 會將選取的日曆帶入 iPhone 與 iPad 的規劃檢視。OneCal 將 Unified Calendar View 與 Calendar Sync 分開說明；其發布者表示，你可以在不設定同步規則的情況下使用該檢視。連接帳號或比較訂閱名稱前，先決定你真正重視的是哪種結果。"
        ]
      },
      {
        "heading": "了解複製事件能變更什麼",
        "body": [
          "OneCal 的 Calendar Sync 文件說明了會建立複製事件的單向與多向規則。其另一份涵蓋範圍指南指出，對複本的編輯不會回傳到原始事件。把複製的行程當成重新安排會議的地方之前，請先找出原始事件及其所屬日曆。",
          "Cloud Calendars 的提供者連線也可能在 iOS 儲存中建立鏡像日曆。整合顯示並不能證明紀錄已被合併，也不能證明編輯已送達提供者。對於由你擁有且可編輯的日曆，請在提供者端和 app 內都檢查一個沒有受邀者的測試事件。"
        ]
      },
      {
        "heading": "檢查你實際會使用的裝置上的控制項",
        "body": [
          "OneCal 目前的行動指南說明了建立與編輯日曆事件、重複選項、RSVP 與加入會議。它也另行說明，建立、編輯、暫停或刪除 Calendar Sync 設定是在網頁 app 中完成；行動版只會顯示這些設定。預約連結設定也被說明為網頁上的工作。",
          "Cloud Calendars 是一款 iPhone 與 iPad app，提供日、週、月、年與列表檢視。請在你已安裝的檢視中實際嘗試所需編輯、閱讀任何重複選項，並確認事件已成功儲存。不要假設另一款產品的行動選單、預約流程或自動化控制一定也存在於其中。"
        ]
      },
      {
        "heading": "不要假設有無限歷史資料，請先確認涵蓋範圍",
        "body": [
          "OneCal 目前的涵蓋範圍指南列出：Google 與 iCloud 的未來同步視窗最長可達一年，Outlook 最長可達三個月。它也區分未來的重複系列與獨立的歷史事件。這些是發布者記載的限制，不是針對你特定帳號的測試，也不是對其日曆檢視每項功能的宣稱。",
          "Cloud Calendars 也需要檢查帳號連接方式、所選日曆與相關日期。如果舊會議很重要，請對照提供者端與 app 中的特定事件。日曆 app 並不會自動成為完整備份，也不保證已擷取所有過往紀錄。"
        ]
      },
      {
        "heading": "比較方案需求與計費方式",
        "body": [
          "Cloud Calendars 的 Base 包含 Google Calendar 同步；Advanced 會移除廣告，Premium 會新增 Microsoft Calendar 與 Teams 支援。請將帳號權限與方案分開確認。購買前請查看目前的當地價格與計費週期，而不是使用固定的國際價格比較。",
          "OneCal 的網頁方案指南說明了按成員計費的方案與十四天試用，其中包含試用到期時移除複本。其行動版計費指南則說明由商店管理的購買方式，以及新增團隊成員的限制。請確認哪些功能需要持續訂閱，以及購買由哪裡管理；僅憑免費下載無法回答這些問題。"
        ]
      },
      {
        "heading": "切換前先測試你的實際規劃流程",
        "body": [
          "如果天氣、小工具或 Live Activity 很重要，請在你實際使用的裝置上把它們納入試用。Cloud Calendars 提供這些規劃介面，但天氣僅限於可用日期與所選地點。此處檢視的 OneCal 頁面無法證明在這些介面上具備同等功能；請查看其目前產品，而不要從指南推斷它一定沒有。",
          "在確認所需結果之前，請保留原始 app 與連線細節。記錄你驗證的是可見性、原始事件編輯、複製的忙碌時段還是提醒事項；這些是不同結果。中斷某項服務前，請先確認既有複本會發生什麼事，並避免拿進行中的邀請或真實客戶會議做實驗。"
        ]
      }
    ],
    "claims": {},
    "practical": [
      "先寫下你需要的是整合檢視，還是要把事件複製到另一個帳號。",
      "找出原始事件、複本，以及每個重要事件所屬的帳號。",
      "在你實際使用的手機、平板或網頁流程中，檢查所需控制項。",
      "比較一般的一週，以及你依賴的任何歷史日期。",
      "確認目前的方案需求、當地價格與購買提供者。",
      "切換前先驗證一個可棄用的測試事件，並查看移除複本的規則。"
    ],
    "faq": [
      {
        "q": "整合日曆檢視是否等同於同步忙碌時段？",
        "a": "不是。整合檢視讓你可以對照各項行程。若要在另一個帳號建立項目，則需要另外支援的工作流程；OneCal 將 Calendar Sync 規則與其 Unified Calendar View 分開說明。"
      },
      {
        "q": "我可以修改 OneCal 的複本來重新安排原始會議嗎？",
        "a": "其涵蓋範圍指南指出，對複本的編輯不會傳回原始事件。請找出原始事件，並遵循其所屬日曆的編輯與主辦人權限。"
      },
      {
        "q": "哪個 app 對我的使用情境比較便宜？",
        "a": "這取決於你需要的功能、帳號、計費方式與當地價格。Cloud Calendars 的 Base 包含 Google 同步，Premium 包含 Microsoft 支援。請依你的預定工作流程查看 OneCal 目前的方案與行動版計費條款；本指南不宣稱有一個放諸四海皆準的最低價選擇。"
      }
    ],
    "sourcesHeading": "OneCal 的官方工作流程與方案文件",
    "sources": [
      {
        "label": "OneCal：行動功能與僅限網頁的設定工作",
        "url": "https://docs.onecal.io/docs/mobile-apps"
      },
      {
        "label": "OneCal：Calendar Sync 與來源到目標規則",
        "url": "https://docs.onecal.io/docs/calendar-sync/calendar-sync-intro"
      },
      {
        "label": "OneCal：同步視窗與複製事件的編輯",
        "url": "https://docs.onecal.io/docs/calendar-sync/what-does-onecal-sync"
      },
      {
        "label": "OneCal：方案、試用與到期行為",
        "url": "https://docs.onecal.io/docs/billing/plans-and-free-trial"
      },
      {
        "label": "OneCal：App Store 與 Google Play 訂閱",
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
      "heading": "先比較工作流程，再考慮訂閱",
      "columns": [
        "問題",
        "Cloud Calendars",
        "OneCal 文件"
      ],
      "rows": [
        {
          "cells": [
            "我要在哪裡檢視我的行程？",
            "在 iPhone 和 iPad 上，提供日、週、月、年與列表檢視。",
            "Unified Calendar View 與設定 Calendar Sync 是分開的。"
          ]
        },
        {
          "cells": [
            "我需要在帳號之間複製忙碌區塊嗎？",
            "不要從整合檢視直接推斷；提供者連線可能只是在本機鏡像日曆。",
            "Calendar Sync 會依單向或多向規則建立複製事件。"
          ]
        },
        {
          "cells": [
            "我要在哪裡變更同步規則？",
            "請使用 app 帳號連線文件中所述的控制項。",
            "本次查閱的行動指南將同步設定變更歸於網頁 app。"
          ]
        },
        {
          "cells": [
            "我需要哪個 Cloud Calendars 方案？",
            "Base 包含 Google Calendar 同步；Advanced 會移除廣告；Premium 新增 Microsoft Calendar 與 Teams。",
            "請依所需工作流程查看 OneCal 目前的方案與計費方式。"
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-left",
      "hook"
    ],
    "galleryCaption": "Cloud Calendars 的真實日曆畫面顯示的是規劃檢視。本文比較時，將此檢視與服務在伺服器端的複本規則區分開來。",
    "actionHeading": "選擇你想驗證的結果",
    "actionText": "如果你需要的是 iPhone 或 iPad 上含天氣與小工具的總覽，請用無風險的測試事件試試 Cloud Calendars。若你的需求是將忙碌時段複製到另一個帳號，請評估有明確文件說明該操作的服務。",
    "articleLinks": [
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "設定合併日曆檢視"
      },
      {
        "slug": "fantastical-readdle-calendar366-iphone-comparison",
        "label": "比較其他 iPhone 日曆選項"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "選擇你的主畫面顯示方式"
      }
    ]
  },
  "fantastical-readdle-calendar366-iphone-comparison": {
    "updated": "2026-10-23",
    "title": "iPhone 日曆替代方案：Cloud Calendars、Fantastical、Readdle 和 BusyCal",
    "short": "比較 iPhone 日曆替代方案",
    "description": "依天氣、檢視方式、任務與所需工作流程，比較 iPhone 日曆。",
    "lede": "先依你想完成的工作來選日曆：查看含天氣的行程、快速輸入事件、管理任務，或整合多個帳號檢視。Cloud Calendars、Fantastical、Calendars by Readdle、Calendar 366 與 BusyCal 在這些工作流程及方案需求上各不相同。本比較由 Arte Soft 開發 Cloud Calendars 並發布。",
    "sections": [
      {
        "heading": "比較外觀前，先確認哪些功能一定要能運作",
        "body": [
          "先列出你的日曆提供者、裝置，以及三個最重要的操作。例如：同時查看工作與私人日曆、完成提醒事項、快速新增會議。先用私密的測試資料驗證這些操作，再匯入完整行程。",
          "產品支援你的提供者名稱，並不表示每種連線方式都有相同權限或功能。裝置日曆、直接連線帳號與訂閱資料來源，可能會產生看起來相似的項目，但可執行的操作不同。"
        ]
      },
      {
        "heading": "以提供者自己的日曆作為基準",
        "body": [
          "Google 的入門指南介紹了其自家日曆介面如何處理排程、任務、分享與多個日曆。如果你的行程本來就存放在那裡，先在來源端測試所需操作，再決定是否需要其他 app。",
          "例如，在連上預定使用的帳號後，比較 Google Calendar 與 Fantastical 中的同一個事件。確認你需要的優勢究竟是合併檢視、任務連結、快速輸入，還是特定裝置介面。改用不同的日曆用戶端，不等於自動遷移到不同提供者。"
        ]
      },
      {
        "heading": "Fantastical：確認帳號連線與快速輸入",
        "body": [
          "Flexibits 文件同時說明了直接連線日曆帳號，以及使用已在 iOS 中設定好的日曆與提醒事項的方式。其入門指南建議，若要完整使用 app 功能，應採用直接連線。請確認你選的是哪一種方式，不要無故把同一個日曆重複連接兩次。",
          "Fantastical 也說明了句子式輸入，以及可重複使用的事件或任務範本。請測試包含明確日期、時長與目標日曆的輸入，再檢查儲存結果。其語法屬於 Fantastical；其他 app 的文字欄位可能會以不同方式解讀同一句話。"
        ]
      },
      {
        "heading": "Calendars by Readdle：確認任務來源",
        "body": [
          "Readdle 將 Google、Outlook 與 iCloud 日曆，與任務及自然語言輸入功能一併呈現。其任務設定指南說明，可在 Task Options 中選擇 iOS Reminders 或 Google Tasks。若你需要在手機上完成任務時同步更新特定原始清單，這個選擇就很重要。",
          "請用可丟棄的測試任務，同時驗證兩端的完成狀態，而不只是看標題是否出現在時間軸上。若你也需要在 Mac 上使用某個檢視或操作，請一併在那裡測試。不要因為產品名稱相同，就假設控制方式也完全一致。"
        ]
      },
      {
        "heading": "Calendar 366：確認系統存取、集合與天氣位置",
        "body": [
          "Calendar 366 的文件區分了對系統日曆與提醒事項的存取，以及直接帳號整合。它也說明了可用來選取顯示哪些日曆與清單的日曆集合。這些集合也可能決定預設日曆，因此請確認新建立的事件會歸屬到哪個日曆。",
          "同一份文件也說明了它自有的自然語言剖析器，以及使用 Apple Weather 的天氣功能，並可選擇系統位置或自訂位置。若要規劃戶外活動，請確認所選地點，不要假設預報會跟著每個事件的地址變動。這些是發行商文件記載的能力，不是已在你的帳號上實測的功能。"
        ]
      },
      {
        "heading": "BusyCal：確認任務顯示方式與天氣所用檢視",
        "body": [
          "BusyCal 的 iOS 任務指南區分了有日期、有時間與無日期的任務，並說明完成控制，以及如何將未完成的有日期任務順延。其天氣指南指出，預報會出現在 List、Day 和 Month 檢視中，因此請測試你實際使用的檢視，不要假設每個地方都會顯示天氣。",
          "BusyCal 也記載，自然語言輸入可作為新增事件預設值中的一項選項。請用和其他 app 相同的私密測試事件來試用，再檢查所屬日曆與儲存時間。這些是 BusyCal 的控制方式，不是所有日曆 app 共享的指令。"
        ]
      },
      {
        "heading": "將 Watch 工作流程與手機分開檢查",
        "body": [
          "Fantastical 的 Watch 指南記載了 Up Next、List 與 Tasks 檢視，包括任務完成操作。BusyCal 的任務指南則區分了 Watch 上會顯示的有日期與有時間任務，以及不會這樣顯示的無日期任務。如果無日期待辦清單對你很重要，試用時就要納入，而不是只測試下一個事件。",
          "Watch complication 只是快速一瞥，而 Watch app 可能提供額外操作。請在實際手錶與手機上確認資料與操作，並查看目前方案。桌面、手機與手錶介面，不會只因為產品名稱相同就能互相替代。"
        ]
      },
      {
        "heading": "將價格與使用權分開檢查",
        "body": [
          "請查看目前當地的購買畫面、試用結束後仍可使用的功能，以及較早期購買是否會改變你的使用權。免費下載、定期訂閱與舊版購買，不一定會解鎖相同功能組合。",
          "發行商頁面可能在不同時間更新。Readdle 目前的產品 FAQ 將幾項核心功能描述為免費，但另一份區分免費版與完整版的說明頁卻列出不同的劃分。與其把其中一種說法當作通用承諾，不如直接在已安裝的 app 與其當前購買條款中，驗證你需要的操作。"
        ]
      },
      {
        "heading": "Cloud Calendars 在候選清單中的定位",
        "body": [
          "Cloud Calendars 是 iPhone 和 iPad 上的另一個選擇，提供精選日曆、多種規劃檢視、天氣與小工具。Google sync 包含於 Base，Advanced 可移除廣告，Premium 則新增 Microsoft calendar 支援。請依你的設定，確認目前方案與提供者權限。",
          "如果某項專門的任務連線、範本指令或桌面工作流程是必要條件，請選擇有文件記載且實際能完成該需求的產品。比較儲存結果與日常操作成本；這份檢查表應幫助你做選擇，而不是暗示本文提到的每項功能都存在於 Cloud Calendars。"
        ]
      }
    ],
    "claims": {},
    "practical": [
      "列出你的帳號、裝置與關鍵操作。",
      "選擇一種帳號連線方式，並檢查它會顯示哪些日曆。",
      "用無風險的範例測試快速輸入與任務完成。",
      "確認天氣位置，以及各裝置使用的檢視。",
      "在任何試用或舊版使用權之後，檢查目前購買條款。"
    ],
    "faq": [
      {
        "q": "Fantastical 的最佳替代方案是哪一個？",
        "a": "這取決於你需要的工作流程。請比較日曆與任務來源、事件輸入、裝置支援與目前使用權。本指南不宣稱有放諸四海皆準的效能冠軍。"
      },
      {
        "q": "只要提供者名稱相同，就代表每個 app 的同步都一樣嗎？",
        "a": "不是。請分別檢查直接連線、裝置日曆、訂閱來源與權限，然後回到來源端驗證一項範例變更。"
      },
      {
        "q": "我可以假設所有宣傳的功能都是免費的嗎？",
        "a": "不可以。請檢查已安裝的 app、當地購買畫面，以及試用結束後保留的功能。發行商文件可能描述的是不同版本或不同使用權。"
      }
    ],
    "sourcesHeading": "本指南查核過的官方文件",
    "sources": [
      {
        "label": "Fantastical：帳號連線方式",
        "url": "https://flexibits.com/fantastical-ios/help/getting-started"
      },
      {
        "label": "Fantastical：自然語言輸入與範本",
        "url": "https://flexibits.com/fantastical-ios/help/adding-events-and-tasks"
      },
      {
        "label": "Readdle：目前產品功能與 FAQ",
        "url": "https://readdle.com/calendars"
      },
      {
        "label": "Readdle：選擇任務來源",
        "url": "https://support.readdle.com/calendars/synchronization/how-to-sync-tasks-with-ios-reminders-or-google-tasks"
      },
      {
        "label": "Readdle：分開說明的免費版／完整版方案指引",
        "url": "https://apphelp.readdle.com/en/index.php?id=585&pg=kb.page"
      },
      {
        "label": "Calendar 366：整合、集合、快速輸入與天氣",
        "url": "https://calendar366.com/help/index.html"
      },
      {
        "label": "BusyCal for iOS：任務與 Watch 任務限制",
        "url": "https://www.busymac.com/docs/busycalios/70659-tasks/"
      },
      {
        "label": "BusyCal for iOS：天氣與支援的檢視",
        "url": "https://www.busymac.com/docs/busycalios/70665-weather/"
      },
      {
        "label": "BusyCal for iOS：自然語言輸入",
        "url": "https://www.busymac.com/docs/busycalios/70669-natural-language/"
      },
      {
        "label": "Fantastical：Apple Watch 檢視與操作",
        "url": "https://flexibits.com/fantastical-ios/help/apple-watch"
      },
      {
        "label": "Google：Calendar 自家的帳號式介面",
        "url": "https://support.google.com/calendar/answer/2465776?hl=en"
      }
    ],
    "seeAlso": [
      "what-fantastical-costs-and-what-this-does",
      "natural-language-calendar-events-iphone",
      "iphone-calendar-tasks-reminders-versus-event-alerts"
    ],
    "comparison": {
      "heading": "先從你的主要需求開始",
      "columns": [
        "需求",
        "值得檢查的相關選項",
        "重要差異"
      ],
      "rows": [
        {
          "cells": [
            "搭配天氣的事件與 iPhone/iPad 檢視",
            "Cloud Calendars，以及比較中各 app 文件記載的天氣檢視。",
            "請檢查預報地點、可用期間與檢視；天氣涵蓋範圍並非沒有限制。"
          ]
        },
        {
          "cells": [
            "自然語言事件輸入",
            "Fantastical，以及 Readdle 或 BusyCal 的相關功能。",
            "句子剖析不同於聽寫，也不同於一般事件編輯。"
          ]
        },
        {
          "cells": [
            "任務與事件並列顯示",
            "Readdle、Calendar 366、BusyCal 或 Fantastical 文件記載的任務來源。",
            "事件提醒不是任務完成整合。"
          ]
        },
        {
          "cells": [
            "Google Calendar 同步與可選的移除廣告",
            "Cloud Calendars Base 包含 Google Calendar sync；Advanced 可移除廣告。",
            "Microsoft Calendar 與 Teams 支援需要 Premium。"
          ]
        },
        {
          "cells": [
            "不同的購買模式",
            "各 app 與各平台目前的商店頁面與使用權。",
            "免費下載不代表所有功能都免費；區域價格與方案可能變動。"
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
    "galleryCaption": "這些是 Cloud Calendars 中 app 檢視、天氣與小工具的畫面，不是本比較中其他產品的截圖。",
    "actionHeading": "針對一項真實規劃需求來試用日曆",
    "actionText": "如果你的主要需求是在 iPhone 或 iPad 上查看含天氣與小工具的行程，可用可丟棄的測試事件評估 Cloud Calendars。比較產品時，請將專門的任務、預約與自然語言需求分開檢查。",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "了解天氣如何融入日曆工作流程"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "比較 Cloud Calendars 的小工具"
      },
      {
        "slug": "onecal-alternative-iphone-calendar-view-or-sync",
        "label": "分辨合併檢視與複製的忙碌時段"
      }
    ]
  }
};
