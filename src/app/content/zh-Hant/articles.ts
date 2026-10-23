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
  "updated": "2026-10-23",
  "title": "iPhone 與 iPad 上可顯示天氣的行事曆：一眼規劃你的一天",
  "short": "同時使用行事曆與天氣",
  "description": "在 iPhone 與 iPad 上，比對所選地點的天氣與你的行事曆。",
  "lede": "Cloud Calendars 在同一個 iPhone 或 iPad app 中顯示你的行程與天氣。你可以用行事曆選擇日期，再用天氣檢視查看所選地點及可用的預報時段。若要安排戶外活動，請查看真正相關的時段，而不要只依賴每日圖示。本指南由 app 開發者 Arte Soft 發布。",
  "commonBelief": "顯示在行事曆旁的天氣，會自動描述每個活動地址、每個小時與每個未來日期。",
  "sections": [
    {
      "heading": "先確認真正要規劃的問題",
      "body": [
        "先從某個特定活動開始，例如下午去公園。找出天氣可能改變的是什麼：時間、地點、準備事項，或是否改用替代方案。你不需要只因為當天的圖示顯示下雨，就重排整個行事曆。",
        "記下活動實際的開始與結束時間；若與準備作業有關，也要一併算入。行事曆總覽有助於找出可能日期，而天氣預報檢查則是針對特定地點與時段。比較選項時，請把這兩件事分開處理。"
      ]
    },
    {
      "heading": "讀取數值前，先確認天氣地點",
      "body": [
        "Cloud Calendars 提供目前地點或所選地點的天氣。請確認畫面顯示的位置，不要假設活動地址會自動讓預報切換。若活動在另一座城市，就需要與那座城市的天氣比對。",
        "例如，使用者可能在家中時，就已在規劃前往博物館的抵達時間。比對前，請先查看預報地點與活動當地時間。畫面上看起來相近的資訊，並不能證明行程與天氣使用的是同一地點。"
      ]
    },
    {
      "heading": "每小時與每日涵蓋範圍要分開查看",
      "body": [
        "每日項目適合用來掌握大方向；若問題與一天中的某段時間有關，請查看可用的每小時資料。下午二點到五點的預約，不能只看一個圖示就下判斷。請確認相關時段的資料實際上是否存在。",
        "依目前 app 的資料來源，每日清單最多會顯示 WeatherKit 傳回的十天資料。這與行事曆瀏覽範圍及目前提供的每小時資料是分開的。未來的活動不會延長天氣預報涵蓋範圍。若該時段尚未提供資料，請之後再安排一次天氣檢查。"
      ]
    },
    {
      "heading": "看懂天氣數值代表什麼",
      "body": [
        "Apple 說明了 WeatherKit 的資料，例如氣溫、降水、風與 UV，但部分產品僅在特定地區提供。請閱讀你所選地點實際提供的數值，不要預期所有地點都會有每一種天氣產品。",
        "Met Office 的說明顯示，預報時段與變數定義為何重要：有些數值代表某個時點，另一些則代表一段期間。請依相關供應商的標示來理解。降雨機率、降雨量與持續時間是不同問題，沒有單一數字能決定所有戶外活動。"
      ]
    },
    {
      "heading": "檢查由某個天氣時段建立的草稿活動",
      "body": [
        "若 app 提供從某個小時建立活動的功能，開啟的是草稿。依目前資料來源，系統會使用天氣地點的時區、預設一小時長度，並選取預設的新活動行事曆。儲存前請檢查每一個值。",
        "請確認標題、目標行事曆、開始時間、結束時間，以及預定地點。選取預報時段，並不表示你已取得編輯共享行事曆、通知場地或預訂空間的權限。請檢查已儲存的活動，並取得該計畫所需的任何同意。"
      ]
    },
    {
      "heading": "將網站示範與 app 分開看待",
      "body": [
        "網站上的互動式天氣示範使用 Open-Meteo。app 使用的是 Apple WeatherKit。網頁示範適合用來了解呈現方式，但其地點、資料與可用日期可能與 app 不同。",
        "若要做出實際決定，請開啟 app，將預定活動與其中可用的預報比對。若你要更動共享計畫，請確認主辦人、重複範圍與參與者。當活動受天氣條件影響時，請保留已談妥的替代方案。"
      ]
    }
  ],
  "claims": {},
  "practical": [
    "先確認是哪個活動，以及天氣可能改變什麼決定。",
    "確認天氣地點，以及活動當地的日期與時間。",
    "將可用的每小時資料與每日摘要分開查看。",
    "依標示閱讀機率、數量與其他相關數值。",
    "儲存前，檢查所有活動草稿細節與目標行事曆。",
    "到需要做決定時再重新確認，並直接確認共享變更。"
  ],
  "faq": [
    {
      "q": "行事曆旁的天氣會跟著每個活動地址變動嗎？",
      "a": "不要這樣假設。請確認畫面顯示的天氣地點，並與活動地點比對；畫面上位置相近，不代表兩者相符。"
    },
    {
      "q": "app 使用的是網站上的天氣供應商嗎？",
      "a": "不是。app 使用 Apple WeatherKit；網站示範則另外使用 Open-Meteo。"
    },
    {
      "q": "選擇某個預報時段後，會自動儲存活動嗎？",
      "a": "如果該操作有提供，系統會先建立草稿。請檢查日期、時區、時長、行事曆與地點，再儲存你要的活動。"
    }
  ],
  "seeAlso": [
    "weather-calendar-history-versus-forecast-iphone",
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather",
    "weather-where-the-event-is",
    "planning-outdoors-without-being-rained-on"
  ],
  "sourcesHeading": "官方來源與延伸閱讀",
  "sources": [
    {
      "label": "Apple：WeatherKit 預報資訊與區域可用性",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office：預報地點、時段與天氣數值",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ],
  "comparison": {
    "heading": "哪種天氣檢視能回答你的問題？",
    "columns": [
      "你的問題",
      "應查看什麼",
      "它無法證明什麼"
    ],
    "rows": [
      {
        "cells": [
          "今天接下來有什麼安排？",
          "查看所選地點天氣旁的行事曆日檢視或週檢視。",
          "這不代表每個活動地址都會自動改變天氣地點。"
        ]
      },
      {
        "cells": [
          "下雨會影響我下午的活動嗎？",
          "查看活動地點的每小時資料，以及活動完整時段。",
          "這不代表每日圖示能描述每一個小時。"
        ]
      },
      {
        "cells": [
          "我可以依照天氣來規劃下個月嗎？",
          "先看現在的行事曆，再在接近當天時重新查看預報。",
          "這不代表瀏覽行事曆會延長預報涵蓋範圍。"
        ]
      },
      {
        "cells": [
          "我可以在主畫面快速看總覽嗎？",
          "選擇適合的主畫面小工具。",
          "這不代表每種小工具版面都會包含活動或完整預報。"
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-right",
    "hook"
  ],
  "galleryCaption": "真實的 Cloud Calendars 畫面：天氣檢視與有活動的一天。請在 app 中確認所選地點與日期。",
  "actionHeading": "結合你的行程與天氣預報來規劃",
  "actionText": "Cloud Calendars 適用於 iPhone 與 iPad。Base 包含各種檢視、天氣與 Google Calendar 同步；Advanced 會移除廣告，Premium 則加入 Microsoft Calendar 與 Teams 支援。",
  "articleLinks": [
    {
      "slug": "forecast-beside-every-event",
      "label": "查看活動時段的天氣"
    },
    {
      "slug": "the-widget-that-shows-what-is-next",
      "label": "選擇行事曆與天氣小工具"
    },
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "將多個行事曆帳號整合到同一個檢視"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
  "updated": "2026-10-23",
  "title": "在 iPhone 和 iPad 上同時查看 Google、iCloud 與 Outlook 行事曆",
  "short": "三個提供者，一個檢視",
  "description": "整合行事曆檢視，並了解帳號權限、副本與方案需求。",
  "lede": "若要同時查看工作與個人事件，請連接你要使用的帳號、選取其行事曆，並在同一個檢視中檢查相同事件。Cloud Calendars 支援在 iPhone 和 iPad 上以 iCloud 與 Google Calendar 進行規劃；Microsoft Calendar 支援包含在 Premium。將事件一起顯示，與在不同提供者帳號之間複製忙碌時段是不同的事。此指南由開發者 Arte Soft 發布。",
  "commonBelief": "把多個行事曆放進同一個 App，就會自動讓它們的可用性、分享設定和事件副本保持一致。",
  "sections": [
    {
      "heading": "辨識每個事件背後的帳號與行事曆",
      "body": [
        "先從每個提供者各選一個一般事件開始。記下登入的電子郵件地址、行事曆名稱，以及該事件是你擁有的還是你收到的邀請。兩個都叫做「Calendar」的行事曆，可能屬於完全不同的帳號。顏色有助於你快速瀏覽一週行程；真正決定應該在哪裡編輯的，是帳號與行事曆。",
        "例如，你個人 iCloud 行事曆中的牙醫預約，以及 Microsoft 中的專案會議，對你來說可以一起顯示。但這本身並不會讓同事看見你的牙醫預約，也不會在他們的排程工具中替你保留那段時間。",
        "在變更連線前，先確定你的目標。若要將事件資料移到另一個帳號，請使用下方的「選擇行事曆匯出格式」找出受支援的轉移方式，並在依賴目的地資料前，先檢查具代表性的事件。若只是要比較時間，請保留原有的行事曆擁有者，並將選取的來源一起顯示。若另一個帳號必須接收忙碌時段，請參閱「依工作流程區分 Cloud Calendars 與 OneCal」，了解可用性複製與個人總覽有何不同。"
      ]
    },
    {
      "heading": "透過適當的方式進行連線",
      "body": [
        "若是 iCloud，請先在 iPhone 的目標 Apple Account 下啟用 iCloud Calendar。Apple 的設定指南說明了裝置端設定。Cloud Calendars 會存取 iPhone 行事曆系統中可用的行事曆，並需要行事曆存取權限才能讀取它們。僅在另一台裝置上連接帳號並不足夠。",
        "Cloud Calendars 也提供「Sign in with Google」與「Sign in with Microsoft」操作。登入時請確認你選擇的是哪個帳號，然後開啟其行事曆群組，選取你需要的行事曆。若登入了正確的提供者，卻使用錯誤的個人或工作身分，也可能產生完全有效但出乎預期的行事曆清單。"
      ]
    },
    {
      "heading": "了解方案內容，不要把它和權限混為一談",
      "body": [
        "Base 方案包含 Google Calendar 同步與行事曆檢視。Advanced 在 Base 的基礎上新增移除廣告。Premium 新增 Microsoft Calendar 與 Microsoft Teams 功能。購買前請先查看目前的在地價格與計費週期。",
        "方案會改變 App 可用的功能；但不會賦予你對他人行事曆的擁有權。Google 將查看事件的權限與修改事件的權限分開。雇主政策與 Microsoft 行事曆附帶的權限仍然適用。看到事件，或看到可編輯介面，並不能證明提供者一定會接受更新。"
      ]
    },
    {
      "heading": "合併檢視可能包含行事曆副本",
      "body": [
        "Google 與 Microsoft 連線會利用 iPhone 行事曆系統中的行事曆副本來呈現與同步事件。不要假設連接帳號後，原始提供者之外就不會留下任何副本。這些副本所使用的目的地，可能取決於裝置上可用的行事曆來源。",
        "如果同一個帳號也透過其他方式連到手機，請先檢查行事曆名稱與來源，再判定重複出現的事件是否是不同事件。可先暫時隱藏其中一個行事曆，辨識它提供的是哪個顯示內容。不要只是為了讓畫面看起來整齊，就刪除事件或行事曆：已連線的副本可能會把變更回傳給其提供者。"
      ]
    },
    {
      "heading": "建立事件時，持續確認目的地",
      "body": [
        "儲存前，請像檢查日期與時間一樣仔細確認事件所屬行事曆。家庭約會請選擇家人實際使用的行事曆；工作會議則使用允許的工作目的地。將兩個行事曆一起顯示，並不代表其中任何一個會自動成為所有新事件的預設目的地。",
        "變更事件所屬行事曆，或在行事曆之間拖曳事件，可能是移動，而不是無害的第二種檢視。在排查顯示問題時，請將邀請與重複性會議保留在原本的行事曆中。若確實需要變更，請先確認誰擁有該事件，以及哪個行事曆可以接受它。"
      ]
    },
    {
      "heading": "在依賴總覽前先完成驗證",
      "body": [
        "將提供者自有行事曆中的近期事件，與 Cloud Calendars 中對應的事件互相比對。檢查日期、時區、標題與已選取的行事曆。對於你擁有且可編輯的行事曆，建立一個沒有賓客、可隨時刪除的事件，比修改正在進行中的會議更適合用來測試。在認定連線已可使用前，請先回到提供者端確認結果。",
        "不要依賴合併檢視，自動在另一個帳號中建立匿名的忙碌區塊。若你需要同事看見你無法安排時間、但看不到個人細節，請使用明確核准的可用性安排，並從他們那一側進行驗證。清楚的個人總覽與共享可用性，是兩項不同的工作。"
      ]
    }
  ],
  "claims": {},
  "practical": [
    "列出每個提供者各一個事件的確切帳號與行事曆。",
    "在裝置上啟用目標 iCloud 行事曆，並檢查行事曆存取權限。",
    "使用適當的 Google 或 Microsoft 登入方式，並選取目標行事曆。",
    "在變更任何內容前，先將一個近期事件與其提供者檢視進行比對。",
    "暫時隱藏疑似重複的來源；保留底層事件不動。",
    "每次建立新事件都要檢查目的地行事曆，並另外驗證你需要的任何忙碌時段分享。"
  ],
  "faq": [
    {
      "q": "如果我同時顯示兩個行事曆，我的工作同事會看見我的私人事件嗎？",
      "a": "將行事曆一起顯示，並不是分享指令，也不是自動的忙碌時段橋接。請檢查各行事曆實際的分享設定。提供者連線可能會在裝置上建立行事曆副本，因此合併檢視也不保證事件資料只存在於原始提供者。"
    },
    {
      "q": "為什麼我看得到某個事件，卻無法成功編輯？",
      "a": "該日曆可能是唯讀、事件可能屬於其他主辦人，或是服務提供者拒絕此更新。請在提供者的日曆中確認擁有權與權限。購買更高級的 app 方案不會改變這些權限。"
    },
    {
      "q": "我應該透過所有可用方式連接同一個 Google 帳號嗎？",
      "a": "先檢查它目前在手機上是如何顯示的。多種連接方式會讓辨識日曆副本更複雜。請選擇你打算使用的方式、確認其事件，並在查明前先隱藏多餘的顯示，而不是一開始就刪除資料或中斷帳號連線。"
    }
  ],
  "sourcesHeading": "來源與設定參考資料",
  "sources": [
    {
      "label": "Apple：在你的裝置上設定 iCloud Calendar",
      "url": "https://support.apple.com/guide/icloud/set-up-calendar-mme4d73a8727/icloud"
    },
    {
      "label": "Google：日曆共享與權限",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft：Outlook 日曆 API 與支援的信箱資料",
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
    "heading": "整合檢視、訂閱，還是複製忙碌時段？",
    "columns": [
      "你需要的是什麼",
      "要檢查什麼",
      "不要預設什麼"
    ],
    "rows": [
      {
        "cells": [
          "在單一檢視中查看多個帳號",
          "已連接的帳號、已選取的日曆，以及所需方案。",
          "不要以為共用畫面會合併擁有權或權限。"
        ]
      },
      {
        "cells": [
          "讓事件編輯真正送達其提供者",
          "原始事件、寫入權限，以及來源端儲存後的結果。",
          "不要以為本機看得到的編輯就代表已成功同步到提供者。"
        ]
      },
      {
        "cells": [
          "另一個帳號中的忙碌時段",
          "具有明確來源到目的地同步規則的服務。",
          "不要以為整合檢視會替同事建立可用性封鎖時段。"
        ]
      },
      {
        "cells": [
          "已訂閱的日曆資訊來源",
          "發布者、重新整理行為，以及唯讀狀態。",
          "不要以為 ICS 訂閱是可編輯的雙向連線。"
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-left",
    "hook"
  ],
  "galleryDevice": "iPad",
  "galleryCaption": "真實的 iPad 日曆畫面示範如何檢視行程。截圖無法證明提供者同步的方向或帳號權限。",
  "actionHeading": "在 iPhone 和 iPad 上一起檢視你的日曆",
  "actionText": "Base 已包含 Google Calendar 同步。Advanced 會移除廣告；Premium 則新增 Microsoft Calendar 與 Teams 支援。請將帳號權限與購買方案分開確認。",
  "articleLinks": [
    {
      "slug": "onecal-alternative-iphone-calendar-view-or-sync",
      "label": "比較整合檢視與 OneCal 同步規則"
    },
    {
      "slug": "fantastical-readdle-calendar366-iphone-comparison",
      "label": "比較 iPhone 日曆工作流程"
    },
    {
      "slug": "weather-inside-your-calendar",
      "label": "將天氣與行程一併規劃"
    }
  ]
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
