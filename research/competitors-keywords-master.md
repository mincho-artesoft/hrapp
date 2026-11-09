# Проучване на конкуренцията на Cloud Calendars: Ключови думи, наблюдаван SERP/ChatGPT обхват и статии (23 октомври 2026 г.)

> [!IMPORTANT]
> **Методологична точност и корекции спрямо предишната версия:**
> 1. **100% съответствие между обобщените бройки и номерираните редове в таблиците:** Всяко число в обобщената таблица по-долу отговаря **точно 1:1** на броя номерирани редове в детайлните таблици на 23-те конкурента — общо **точно 204 номерирани реда** (`24` видими позиции от Semrush US Desktop + `49` наблюдавани Google SERP Топ 10 класирания със собствен домейн/App Store + `28` наблюдавани Google SERP Топ 10 външни сравнения/форуми + `53` споменавания в извадката от 15 ChatGPT разговора + `50` свързани предложения и кандидат-теми от документация). Свързаните предложения от Google (307 низа в `all-discovered-classification.json`) са **предложения за търсене, а не доказан експорт на ранкиращи ключови думи**.
> 2. **Корекция на брояча за ChatGPT (`3/15` за Cloud Calendars, а не `5/15`):** Старият скрипт [`summarize-chatgpt.py`](file:///Users/minchomilev/cloud-calendars/research/competitor-map-20261022/summarize-chatgpt.py) използваше неанкориран регулярен израз (`re.search(r'Cloud\s*Calendars', answer, re.I)`), който погрешно разпознаваше фразата `"iCloud calendars"` като `"Cloud Calendars"` в два разговора (`chatgpt-combine.json` и `chatgpt-household-display.json`), както и `"OneCalendar"` като `"OneCal"` в `chatgpt-free-sync.json` и `"imported weather events"` като `"Weather Events"` в `chatgpt-weather.json`. След корекция на регулярните изрази в `summarize-chatgpt.py`, `chatgpt-summary.json`, `chatgpt-intent-map.json` и `original-competitor-census.json`, действителният брой споменавания на **Cloud Calendars** е **3/15** (`free-sync`, `ipad`, `widgets`). Извадката от 15 промпта е малка тестова извадка, а не общ пазарен резултат.
> 3. **Премахване на произволни оценки (`98/100`) и включване на всички реални конкуренти (вкл. Morgen и TimeTree):** Премахнати са синтетичните точкови оценки (`XX/100`) и необоснованото твърдение „вече побеждаваме тези конкуренти“. Вместо това конкурентите са подредени по прозрачни, проверими метрики от реалните ни данни — включително проверените в Semrush US Desktop домейни **Morgen (`6,184` позиции)**, **TimeTree (`3,401` позиции в САЩ и `28,100` в Япония)** и **Flexibits / Fantastical (`762` позиции)**.

---

## 1. Базова линия на нашето приложение: Cloud Calendars (`cloud-calendars.com`)

Преди да сравним 23-те конкурента, ето точните измерени показатели за **Cloud Calendars: Sync & Widget** в същите източници на данни:

| Източник на доказателство | Резултат за Cloud Calendars | Конкретни заявки / промптове | Методологична бележка |
| :--- | :--- | :--- | :--- |
| **Semrush US Desktop (21.10.2026)** | **0** отчетени водещи позиции в извадката | — | Срещу **6,184** позиции за `morgen.so`, **3,401** за `timetreeapp.com` и **762** за `flexibits.com`. |
| **Google SERP Топ 10 (извадка от 45 заявки, US/EN)** | **3 / 45 заявки** със собствен домейн (`cloud-calendars.com` / `arte-soft.com`) | 1. `#1` за `print iPhone calendar export PDF ICS`<br>2. `#4` и `#9` за `what is a cloud calendar`<br>3. `#8` за `free calendar app iPhone Google sync no ads` | В останалите **42 от 45 заявки** нашият домейн не е в Топ 10 на Google. |
| **ChatGPT Потребителски UI (извадка от 15 промпта)** | **3 / 15 промпта** (след премахване на 2 фалшиви съвпадения от `iCloud calendars`) | 1. `free-sync` (`chatgpt-free-sync.json`)<br>2. `ipad` (`chatgpt-ipad.json`)<br>3. `widgets` (`chatgpt-widgets.json`) | В `combine` и `household-display` текстът гласи `"iCloud calendars"`, а не `"Cloud Calendars"`. |
| **Собствени статии на сайта (`en-US`)** | **73 публикувани английски статии** | Всички 73 канонични URL адреса в `src/app/content/en-US/articles-*.ts` | Покриват идентифицираните намерения, но самият брой статии не означава автоматично пазарно превъзходство. |

---

## 2. Обобщена таблица на 23-те конкурента (Подредени по проверими доказателства, 1:1 с редовете в таблиците)

В таблицата по-долу за всеки конкурент важи точното равенство: **`Общо редове (N) = [A] Semrush + [B1] Google Собствен домейн + [B2] Google Външни ревюта + [C] ChatGPT + [D] Предложения/Кандидат-теми`**.

| № | Конкурент | Semrush US Desktop (Отчетени общо позиции / Видими редове `[A]`) | `[B1]` Google Топ 10 (Собствен домейн / App Store) | `[B2]` Google Топ 10 (Външни сравнения) | `[C]` ChatGPT (от 15 промпта) | `[D]` Предложения / Кандидат-теми (не са ранк) | **Точен брой редове в таблицата (`N`)** | Прегледани статии на конкурента | Наши статии | Индивидуален MD файл |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **#01** | **Morgen** | **6,184 (US Desktop) | 970 (DE) | 645 (CA)** (`8` реда) | **4** (#1) | **0** | **0** | **3** | **15** | 7 | 5 | [`01-morgen.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/01-morgen.md) |
| **#02** | **TimeTree** | **3,401 (US Desktop) | 28,100 (JP) | 1,700 (DE)** (`8` реда) | **0** (#2) | **2** | **1** | **3** | **14** | 3 | 4 | [`02-timetree.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/02-timetree.md) |
| **#03** | **Fantastical (Flexibits)** | **762 (US Desktop) | 81 (UK) | 75 (RU)** (`8` реда) | **5** (#1) | **7** | **7** | **3** | **30** | 8 | 6 | [`03-fantastical.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/03-fantastical.md) |
| **#04** | **Apple Calendar & Apple Reminders** | — (`0` реда) | **7** (#1) | **5** | **11** | **2** | **25** | 7 | 5 | [`04-apple-calendar.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/04-apple-calendar.md) |
| **#05** | **Google Calendar & Google Tasks** | — (`0` реда) | **6** (#1) | **3** | **11** | **2** | **22** | 6 | 5 | [`05-google-calendar.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/05-google-calendar.md) |
| **#06** | **Calendars by Readdle** | — (`0` реда) | **6** (#3) | **2** | **7** | **2** | **17** | 6 | 5 | [`06-calendars-by-readdle.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/06-calendars-by-readdle.md) |
| **#07** | **Weather Events (by Dejal)** | — (`0` реда) | **5** (#1) | **0** | **1** | **2** | **8** | 3 | 4 | [`07-weather-events-dejal.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/07-weather-events-dejal.md) |
| **#08** | **Motion & FlowSavvy (Auto-Scheduling)** | — (`0` реда) | **3** (#1) | **1** | **1** | **2** | **7** | 4 | 3 | [`08-motion-flowsavvy.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/08-motion-flowsavvy.md) |
| **#09** | **Supershift & Work Shift Planners (Shifter / My Shift Planner)** | — (`0` реда) | **2** (#1) | **0** | **1** | **2** | **5** | 3 | 2 | [`09-supershift-shift-planners.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/09-supershift-shift-planners.md) |
| **#10** | **Microsoft Outlook (Outlook for iOS)** | — (`0` реда) | **1** (#1) | **1** | **3** | **2** | **7** | 3 | 3 | [`10-microsoft-outlook.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/10-microsoft-outlook.md) |
| **#11** | **BusyCal (BusyMac)** | — (`0` реда) | **1** (#1) | **2** | **2** | **2** | **7** | 5 | 3 | [`11-busycal.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/11-busycal.md) |
| **#12** | **Any.do** | — (`0` реда) | **1** (#1,) | **0** | **0** | **2** | **3** | 5 | 2 | [`12-anydo.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/12-anydo.md) |
| **#13** | **Vimcal** | — (`0` реда) | **1** (#1,) | **0** | **0** | **2** | **3** | 4 | 2 | [`13-vimcal.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/13-vimcal.md) |
| **#14** | **Amie** | — (`0` реда) | **1** (#1,) | **0** | **0** | **2** | **3** | 3 | 2 | [`14-amie.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/14-amie.md) |
| **#15** | **Structured — Daily Planner** | — (`0` реда) | **1** (#2) | **0** | **2** | **2** | **5** | 4 | 3 | [`15-structured.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/15-structured.md) |
| **#16** | **Cozi Family Organizer** | — (`0` реда) | **1** (#4) | **2** | **2** | **2** | **7** | 3 | 3 | [`16-cozi.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/16-cozi.md) |
| **#17** | **OneCal** | — (`0` реда) | **1** (#2) | **0** | **0** | **2** | **3** | 4 | 3 | [`17-onecal.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/17-onecal.md) |
| **#18** | **CalendarBridge** | — (`0` реда) | **1** (#3) | **0** | **0** | **2** | **3** | 4 | 3 | [`18-calendarbridge.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/18-calendarbridge.md) |
| **#19** | **Timepage (by Moleskine Studio)** | — (`0` реда) | **1** (#3) | **0** | **1** | **2** | **4** | 4 | 3 | [`19-timepage-moleskine.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/19-timepage-moleskine.md) |
| **#20** | **Notion Calendar (formerly Cron)** | — (`0` реда) | **1** (#8) | **0** | **0** | **2** | **3** | 2 | 2 | [`20-notion-calendar.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/20-notion-calendar.md) |
| **#21** | **Skylight Calendar & DAKboard (Family Wall Displays)** | — (`0` реда) | **0** (#1,) | **1** | **1** | **2** | **4** | 2 | 2 | [`21-skylight-dakboard.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/21-skylight-dakboard.md) |
| **#22** | **Calendar 366 (by Vincent Miethe / nspektor)** | — (`0` реда) | **0** (#2) | **2** | **2** | **2** | **6** | 2 | 3 | [`22-calendar-366.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/22-calendar-366.md) |
| **#23** | **Teamup Calendar** | — (`0` реда) | **0** (Не) | **0** | **0** | **3** | **3** | 3 | 3 | [`23-teamup.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/23-teamup.md) |
| **ОБЩО** | **23 Конкурента** | **3 домейна с Semrush отчет (`24` видими реда)** | **`49` реда** | **`28` реда** | **`53` реда** | **`50` реда** | **Точно `204` номерирани реда** | **95 официални URL** | **73 EN статии на сайта** | Всички 23 файла в `competitors-md/` |

---

## 3. Пълни профили, ключови думи и статии за всеки от 23-те конкурента

По-долу са включени пълните данни за всеки от 23-те конкурента със **същите 204 номерирани реда**, както в индивидуалните `.md` файлове в [`/Users/minchomilev/cloud-calendars/research/competitors-md/`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/).

## #01 — Morgen ([`01-morgen.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/01-morgen.md))

- **Разработчик / Издател:** Morgen AG (morgen.so)
- **Официален уебсайт:** https://www.morgen.so/
- **Отчетени позиции в Semrush (US Desktop, 21.10.2026):** 6,184 (US Desktop) | 970 (DE) | 645 (CA) (Оценяван трафик: 18.6K/мес. ($64.7K трафик стойност в US))
- **Най-добра наблюдавана позиция в Google SERP (извадка 45 заявки):** #1 (Собствен домейн)
- **Споменавания в ChatGPT (извадка 15 промпта):** 0/15 в извадката (но 6,184 позиции в Semrush US)
- **Точен брой номерирани редове в таблицата по-долу (`N`):** **15** (`8` Semrush видими реда + `4` Google SERP собствен домейн/App Store + `0` Google SERP външни сравнения + `0` ChatGPT промпта + `3` предложения/кандидат-теми)

### 1. Защо този конкурент е включен (Доказателства спрямо Cloud Calendars)

Въпреки че не се появява в малката извадка от 15 ChatGPT разговора, реалният Semrush отчет показва 6,184 органични позиции в САЩ (18.6K оценяван месечен трафик) и #3 позиция за високообемната заявка 'schedule builder' (90.5K/мес.), както и 4 класирания в Топ 10 от нашите 45 Google заявки (вкл. #1 за 'Google Calendar vs Fantastical iPhone' и #4 за 'sync Google Tasks Apple Reminders two way iPhone').

### 2. Статии и страници на конкурента, които описват тези теми

| № | Официален URL на конкурента | Заглавие и роля в проучването |
| :--- | :--- | :--- |
| 1 | `https://www.morgen.so/schedule-builder` | Morgen Schedule Builder — Ранкира на #3 в Semrush US за 'schedule builder' (90.5K обем) |
| 2 | `https://www.morgen.so/blog-posts/fantastical-vs-google-calendar` | Fantastical vs Google Calendar: 2026 Side-by-Side Comparison — Ранкира на #1 в Google SERP |
| 3 | `https://www.morgen.so/blog-posts/fantastical-pricing` | Fantastical Pricing — Ранкира на #4 в Semrush US за 'fantastical' (12.1K обем) |
| 4 | `https://www.morgen.so/google-tasks-apple-reminders-integration` | Google Tasks + Apple Reminders Integration — Ранкира на #4 в Google SERP за 'task-bridge' |
| 5 | `https://www.morgen.so/google-calendar-apple-reminders-integration` | Google Calendar + Apple Reminders Integration — Ранкира на #8 в Google SERP за 'tasks-integration' |
| 6 | `https://www.morgen.so/blog-posts/shared-calendar-app` | 9 Best Shared Calendar Apps Compared in 2026 — Ранкира на #8 в Google SERP за 'cozi-brand' |
| 7 | `https://www.morgen.so/pomodoro-timer` | Morgen Pomodoro Timer — Ранкира на #25 в Semrush US за '20 minute timer' (246K обем) |

### 3. Наши статии в Cloud Calendars (`cloud-calendars.com`), които покриват темите

| № | Наш URL (`cloud-calendars.com/articles/...`) | Заглавие на нашата статия | Локален сорс файл |
| :--- | :--- | :--- | :--- |
| 1 | `https://www.cloud-calendars.com/articles/weekly-schedule-builder/` | **Weekly Schedule Builder (интерактивен инструмент + ръководство)** | `src/app/content/en-US/articles-round7.ts` |
| 2 | `https://www.cloud-calendars.com/articles/sync-google-tasks-apple-reminders-iphone/` | **Syncing Google Tasks and Apple Reminders on iPhone: What Works** | `src/app/content/en-US/articles-round4.ts` |
| 3 | `https://www.cloud-calendars.com/articles/iphone-calendar-tasks-reminders-versus-event-alerts/` | **Tasks and Reminders in an iPhone Calendar vs. Event Alerts** | `src/app/content/en-US/articles-round2.ts` |
| 4 | `https://www.cloud-calendars.com/articles/automatic-time-blocking-versus-manual-calendar/` | **Automatic Time Blocking vs. a Manual Calendar on iPhone** | `src/app/content/en-US/articles-round2.ts` |
| 5 | `https://www.cloud-calendars.com/articles/fantastical-readdle-calendar366-iphone-comparison/` | **Fantastical, Calendars by Readdle, Calendar 366, and Cloud Calendars on iPhone** | `src/app/content/en-US/articles-round2.ts` |

### 4. Пълна таблица на записаните заявки, промптове и кандидат-теми (Точно 15 номерирани реда)

> **Важно уточнение за произхода на данните:** Всеки ред по-долу има изрично обозначен тип доказателство (`[A]` Semrush US Desktop видима позиция, `[B1]` Google SERP Топ 10 собствен домейн/App Store, `[B2]` Google SERP Топ 10 външно сравнение, `[C]` ChatGPT потребителски промпт от извадката с 15 разговора, или `[D]` Предложение от Google Related Search / кандидат-тема от документация, което **не е** доказан ранк).

| № | Ключова дума / Заявка / Промпт | Категория доказателство | Детайли на наблюдението (Позиция / Обем / Източник) | Страница на конкурента | Наша целева статия (`cloud-calendars.com`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `schedule builder` | **[A] Semrush US Desktop (видим ред)** | Semrush US Desktop: #3 Organic + AI Overview + #12 Organic (Обем US: 90,500 | KD: 13%) | `https://www.morgen.so/schedule-builder` | `/articles/weekly-schedule-builder/` |
| 2 | `fantastical` | **[A] Semrush US Desktop (видим ред)** | Semrush US Desktop: #4 Organic (Обем US: 12,100 | KD: 41%) | `https://www.morgen.so/blog-posts/fantastical-pricing` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 3 | `phone planner` | **[A] Semrush US Desktop (видим ред)** | Semrush US Desktop: #8 Organic (Обем US: 22,200 | KD: 57%) | `https://www.morgen.so/` | `/articles/automatic-time-blocking-versus-manual-calendar/` |
| 4 | `morgen calendar` | **[A] Semrush US Desktop (видим ред)** | Semrush US Desktop: #1 Sitelinks (Обем US: 880 | KD: 32%) | `https://www.morgen.so/` | `/articles/automatic-time-blocking-versus-manual-calendar/` |
| 5 | `morgen calendar app` | **[A] Semrush US Desktop (видим ред)** | Semrush US Desktop: #1 Sitelinks (Обем US: 260 | KD: 36%) | `https://www.morgen.so/` | `/articles/automatic-time-blocking-versus-manual-calendar/` |
| 6 | `schedule calendar` | **[A] Semrush US Desktop (видим ред)** | Semrush US Desktop: AI Overview (Обем US: 1,600 | KD: 93%) | `https://www.morgen.so/schedule-builder` | `/articles/weekly-schedule-builder/` |
| 7 | `calendar schedule` | **[A] Semrush US Desktop (видим ред)** | Semrush US Desktop: AI Overview (Обем US: 1,000 | KD: 83%) | `https://www.morgen.so/schedule-builder` | `/articles/weekly-schedule-builder/` |
| 8 | `20 minute timer` | **[A] Semrush US Desktop (видим ред)** | Semrush US Desktop: #25 Organic (Обем US: 246,000 | KD: 44% — несвързан таймер, не създаваме статия) | `https://www.morgen.so/pomodoro-timer` | — (извън обхвата на календара) |
| 9 | `Google Calendar vs Fantastical iPhone` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #1 Собствен домейн (queryId: google-fantastical) | `https://www.morgen.so/blog-posts/fantastical-vs-google-calendar` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 10 | `sync Google Tasks Apple Reminders two way iPhone` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #4 Собствен домейн (queryId: task-bridge) | `https://www.morgen.so/google-tasks-apple-reminders-integration` | `/articles/sync-google-tasks-apple-reminders-iphone/` |
| 11 | `Cozi alternative shared calendar iPhone` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #8 Собствен домейн (queryId: cozi-brand) | `https://www.morgen.so/blog-posts/shared-calendar-app` | `/articles/cozi-timetree-family-calendar-iphone-android/` |
| 12 | `iPhone calendar app Apple Reminders Google Tasks integration` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #8 Собствен домейн (queryId: tasks-integration) | `https://www.morgen.so/google-calendar-apple-reminders-integration` | `/articles/iphone-calendar-tasks-reminders-versus-event-alerts/` |
| 13 | `morgen vs fantastical` | **[D] Предложение / Кандидат-тема (не е ранк)** | Google Related Search (от all-discovered-classification.json — предложение, не е измерен ранк) | `https://www.morgen.so/blog-posts/fantastical-pricing` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 14 | `google tasks apple reminders integration` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от документация на Morgen (morgen.so/google-tasks-apple-reminders-integration) | `https://www.morgen.so/google-tasks-apple-reminders-integration` | `/articles/sync-google-tasks-apple-reminders-iphone/` |
| 15 | `weekly schedule builder template` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от функционалността на Morgen Schedule Builder | `https://www.morgen.so/schedule-builder` | `/articles/weekly-schedule-builder/` |

---

## #02 — TimeTree ([`02-timetree.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/02-timetree.md))

- **Разработчик / Издател:** TimeTree, Inc. (timetreeapp.com)
- **Официален уебсайт:** https://timetreeapp.com/
- **Отчетени позиции в Semrush (US Desktop, 21.10.2026):** 3,401 (US Desktop) | 28,100 (JP) | 1,700 (DE) (Оценяван трафик: 30.9K/мес. ($95.4K трафик стойност в US))
- **Най-добра наблюдавана позиция в Google SERP (извадка 45 заявки):** #2 (Външно сравнение за семейни календари)
- **Споменавания в ChatGPT (извадка 15 промпта):** 1/15 промпта (family — препоръчано приложение)
- **Точен брой номерирани редове в таблицата по-долу (`N`):** **14** (`8` Semrush видими реда + `0` Google SERP собствен домейн/App Store + `2` Google SERP външни сравнения + `1` ChatGPT промпта + `3` предложения/кандидат-теми)

### 1. Защо този конкурент е включен (Доказателства спрямо Cloud Calendars)

TimeTree има 3,401 отчетени позиции в Semrush за САЩ (30.9K оценяван месечен трафик) и 28,100 позиции в Япония, като държи #1 в САЩ за 'time tree' (12.1K обем) и 'timetree shared calendar app' (1.6K обем), присъства в 8 от 9-те резултата за 'Cozi vs TimeTree external calendar sync' и е сред 4-те водещи препоръки на ChatGPT за семейни календари (iPhone + Android).

### 2. Статии и страници на конкурента, които описват тези теми

| № | Официален URL на конкурента | Заглавие и роля в проучването |
| :--- | :--- | :--- |
| 1 | `https://timetreeapp.com/` | TimeTree Official Home — Ранкира на #1 в Semrush US за 7 брандови и продуктови заявки |
| 2 | `https://support.timetreeapp.com/hc/en-us/articles/360000375902-How-to-create-and-share-a-calendar` | How to create and share a calendar — Официално ръководство за споделяне с членове на семейството |
| 3 | `https://support.timetreeapp.com/hc/en-us/articles/360000376022-Showing-events-from-other-calendars-OS-Calendar-in-TimeTree` | Showing events from other calendars (OS Calendar) in TimeTree — Официално ръководство за външни календари |

### 3. Наши статии в Cloud Calendars (`cloud-calendars.com`), които покриват темите

| № | Наш URL (`cloud-calendars.com/articles/...`) | Заглавие на нашата статия | Локален сорс файл |
| :--- | :--- | :--- | :--- |
| 1 | `https://www.cloud-calendars.com/articles/cozi-timetree-family-calendar-iphone-android/` | **Shared Family Calendars Across iPhone and Android: Cozi, TimeTree, and Provider Calendars** | `src/app/content/en-US/articles-round2.ts` |
| 2 | `https://www.cloud-calendars.com/articles/family-pickup-calendar-handoff/` | **Coordinating School Pickups and Family Handoffs on a Shared Calendar** | `src/app/content/en-US/articles-sharing.ts` |
| 3 | `https://www.cloud-calendars.com/articles/a-calendar-that-is-yours-to-share/` | **A Calendar That Is Yours to Share** | `src/app/content/en-US/articles-sharing.ts` |
| 4 | `https://www.cloud-calendars.com/articles/inviting-people-who-do-not-have-the-app/` | **Inviting People Who Do Not Have the App** | `src/app/content/en-US/articles-sharing.ts` |

### 4. Пълна таблица на записаните заявки, промптове и кандидат-теми (Точно 14 номерирани реда)

> **Важно уточнение за произхода на данните:** Всеки ред по-долу има изрично обозначен тип доказателство (`[A]` Semrush US Desktop видима позиция, `[B1]` Google SERP Топ 10 собствен домейн/App Store, `[B2]` Google SERP Топ 10 външно сравнение, `[C]` ChatGPT потребителски промпт от извадката с 15 разговора, или `[D]` Предложение от Google Related Search / кандидат-тема от документация, което **не е** доказан ранк).

| № | Ключова дума / Заявка / Промпт | Категория доказателство | Детайли на наблюдението (Позиция / Обем / Източник) | Страница на конкурента | Наша целева статия (`cloud-calendars.com`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `timetree` | **[A] Semrush US Desktop (видим ред)** | Semrush US Desktop: AI Overview x2 + Knowledge Panel (Обем US: 18,100 | KD: 56%) | `https://timetreeapp.com/` | `/articles/cozi-timetree-family-calendar-iphone-android/` |
| 2 | `time tree` | **[A] Semrush US Desktop (видим ред)** | Semrush US Desktop: #1 Sitelinks (Обем US: 12,100 | KD: 63%) | `https://timetreeapp.com/` | `/articles/cozi-timetree-family-calendar-iphone-android/` |
| 3 | `timing tree` | **[A] Semrush US Desktop (видим ред)** | Semrush US Desktop: #1 Sitelinks (Обем US: 1,900 | KD: 62%) | `https://timetreeapp.com/` | `/articles/cozi-timetree-family-calendar-iphone-android/` |
| 4 | `timetree shared calendar app` | **[A] Semrush US Desktop (видим ред)** | Semrush US Desktop: #1 Organic (Обем US: 1,600 | KD: 33%) | `https://timetreeapp.com/` | `/articles/cozi-timetree-family-calendar-iphone-android/` |
| 5 | `time tree app` | **[A] Semrush US Desktop (видим ред)** | Semrush US Desktop: #1 Organic (Обем US: 1,300 | KD: 34%) | `https://timetreeapp.com/` | `/articles/cozi-timetree-family-calendar-iphone-android/` |
| 6 | `time tree calendar` | **[A] Semrush US Desktop (видим ред)** | Semrush US Desktop: #1 Sitelinks (Обем US: 1,300 | KD: 36%) | `https://timetreeapp.com/` | `/articles/cozi-timetree-family-calendar-iphone-android/` |
| 7 | `timetree calendar` | **[A] Semrush US Desktop (видим ред)** | Semrush US Desktop: #1 Sitelinks (Обем US: 1,000 | KD: 32%) | `https://timetreeapp.com/` | `/articles/cozi-timetree-family-calendar-iphone-android/` |
| 8 | `timetree app` | **[A] Semrush US Desktop (видим ред)** | Semrush US Desktop: #1 Organic (Обем US: 720 | KD: 36%) | `https://timetreeapp.com/` | `/articles/cozi-timetree-family-calendar-iphone-android/` |
| 9 | `Cozi vs TimeTree external calendar sync` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #2, #3, #4, #5, #6, #7, #8, #9 Външни сравнения (queryId: family-external-sync) | `https://lighthouse.mapquest.com/blog/cozi-vs-timetree/` | `/articles/cozi-timetree-family-calendar-iphone-android/` |
| 10 | `TimeTree alternative shared family calendar iPhone` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #6 Външно сравнение (queryId: timetree-brand) | `https://gethomsy.com/blog/comparisons/compare-timetree-alternative` | `/articles/cozi-timetree-family-calendar-iphone-android/` |
| 11 | `Shared family calendar apps for iPhone and Android household coordinating school pickups (promptId: family)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение в отговора (chatgpt-family.json) | `https://support.timetreeapp.com/hc/en-us/articles/360000375902-How-to-create-and-share-a-calendar` | `/articles/cozi-timetree-family-calendar-iphone-android/` |
| 12 | `timetree vs cozi` | **[D] Предложение / Кандидат-тема (не е ранк)** | Google Related Search (от all-discovered-classification.json — предложение, не е измерен ранк) | `https://support.timetreeapp.com/hc/en-us/articles/360000376022-Showing-events-from-other-calendars-OS-Calendar-in-TimeTree` | `/articles/cozi-timetree-family-calendar-iphone-android/` |
| 13 | `best shared calendar app for couples` | **[D] Предложение / Кандидат-тема (не е ранк)** | Google Related Search (от all-discovered-classification.json — предложение, не е измерен ранк) | `https://timetreeapp.com/` | `/articles/cozi-timetree-family-calendar-iphone-android/` |
| 14 | `shared family calendar iphone android sync` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от документацията на TimeTree за OS Calendar показване | `https://support.timetreeapp.com/hc/en-us/articles/360000376022-Showing-events-from-other-calendars-OS-Calendar-in-TimeTree` | `/articles/cozi-timetree-family-calendar-iphone-android/` |

---

## #03 — Fantastical (Flexibits) ([`03-fantastical.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/03-fantastical.md))

- **Разработчик / Издател:** Flexibits Inc. (flexibits.com)
- **Официален уебсайт:** https://flexibits.com/fantastical
- **Отчетени позиции в Semrush (US Desktop, 21.10.2026):** 762 (US Desktop) | 81 (UK) | 75 (RU) (Оценяван трафик: 4.1K/мес. ($4.4K трафик стойност в US))
- **Най-добра наблюдавана позиция в Google SERP (извадка 45 заявки):** #1 (Официален App Store листинг и #2 flexibits.com)
- **Споменавания в ChatGPT (извадка 15 промпта):** 7/15 промпта (combine, drag-edit, ipad, shift, tasks, weather, widgets)
- **Точен брой номерирани редове в таблицата по-долу (`N`):** **30** (`8` Semrush видими реда + `5` Google SERP собствен домейн/App Store + `7` Google SERP външни сравнения + `7` ChatGPT промпта + `3` предложения/кандидат-теми)

### 1. Защо този конкурент е включен (Доказателства спрямо Cloud Calendars)

Fantastical има 762 отчетени позиции в Semrush US Desktop (вкл. AI Overview за 'best calendar app' с 3,600 обем), класира се със собствен домейн или App Store страница в 5 от 45-те Google заявки (вкл. #1 за 'natural-language' и #1 за 'ipad'), присъства в заглавията на външни ревюта в 7 от 45-те заявки и е препоръчан в 7 от 15-те ChatGPT разговора.

### 2. Статии и страници на конкурента, които описват тези теми

| № | Официален URL на конкурента | Заглавие и роля в проучването |
| :--- | :--- | :--- |
| 1 | `https://flexibits.com/fantastical` | Fantastical Product Page — Ранкира в Semrush US (AI Overview за 'best calendar app') и Google SERP (#2 natural-language, #6 weather, #9 widgets) |
| 2 | `https://flexibits.com/fantastical/faq` | Fantastical FAQ — Ранкира на #3 в Semrush US за 'fantastical' (12.1K обем) |
| 3 | `https://apps.apple.com/us/app/fantastical-calendar/id718043190` | Fantastical Calendar on App Store — Ранкира на #1 за 'natural-language' и 'ipad', #4 за 'weather' |
| 4 | `https://flexibits.com/fantastical-ios/help/adding-events-and-tasks` | Adding Events and Tasks (iOS Help) — Официална документация за естествен език и задачи |
| 5 | `https://flexibits.com/fantastical-ios/help/calendar-sets` | Calendar Sets (iOS Help) — Официална документация за групиране на календари и фокус филтри |
| 6 | `https://flexibits.com/fantastical-ios/help/widgets` | Widgets & Live Activities (iOS Help) — Официална документация за iOS джаджи и Up Next |
| 7 | `https://flexibits.com/fantastical-ios/help/weather` | Weather in Fantastical (iOS Help) — Официална документация за 10-дневна прогноза по локация |
| 8 | `https://flexibits.com/fantastical/scheduling` | Fantastical Scheduling (Openings & Proposals) — Официална документация за линкове за резервации |

### 3. Наши статии в Cloud Calendars (`cloud-calendars.com`), които покриват темите

| № | Наш URL (`cloud-calendars.com/articles/...`) | Заглавие на нашата статия | Локален сорс файл |
| :--- | :--- | :--- | :--- |
| 1 | `https://www.cloud-calendars.com/articles/fantastical-readdle-calendar366-iphone-comparison/` | **Fantastical, Calendars by Readdle, Calendar 366, and Cloud Calendars on iPhone** | `src/app/content/en-US/articles-round2.ts` |
| 2 | `https://www.cloud-calendars.com/articles/natural-language-calendar-events-iphone/` | **Natural-Language Event Creation on iPhone: What Gets Parsed** | `src/app/content/en-US/articles-round2.ts` |
| 3 | `https://www.cloud-calendars.com/articles/weather-inside-your-calendar/` | **Weather Inside Your Calendar** | `src/app/content/en-US/articles-weather.ts` |
| 4 | `https://www.cloud-calendars.com/articles/the-widget-that-shows-what-is-next/` | **The Widget That Shows What Is Next** | `src/app/content/en-US/articles-widgets.ts` |
| 5 | `https://www.cloud-calendars.com/articles/month-view-on-a-bigger-screen/` | **Month View on a Bigger Screen (iPad)** | `src/app/content/en-US/articles-views.ts` |
| 6 | `https://www.cloud-calendars.com/articles/booking-link-or-shared-calendar/` | **Booking Links vs. a Shared Calendar on iPhone** | `src/app/content/en-US/articles-round2.ts` |

### 4. Пълна таблица на записаните заявки, промптове и кандидат-теми (Точно 30 номерирани реда)

> **Важно уточнение за произхода на данните:** Всеки ред по-долу има изрично обозначен тип доказателство (`[A]` Semrush US Desktop видима позиция, `[B1]` Google SERP Топ 10 собствен домейн/App Store, `[B2]` Google SERP Топ 10 външно сравнение, `[C]` ChatGPT потребителски промпт от извадката с 15 разговора, или `[D]` Предложение от Google Related Search / кандидат-тема от документация, което **не е** доказан ранк).

| № | Ключова дума / Заявка / Промпт | Категория доказателство | Детайли на наблюдението (Позиция / Обем / Източник) | Страница на конкурента | Наша целева статия (`cloud-calendars.com`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `fantastical` | **[A] Semrush US Desktop (видим ред)** | Semrush US Desktop: #3 Organic + AI Overview (Обем US: 12,100 | KD: 41%) | `https://flexibits.com/fantastical/faq` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 2 | `best calendar app` | **[A] Semrush US Desktop (видим ред)** | Semrush US Desktop: AI Overview (Обем US: 3,600 | KD: 42%) | `https://flexibits.com/fantastical` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 3 | `fantastical calendar` | **[A] Semrush US Desktop (видим ред)** | Semrush US Desktop: #2 Organic + AI Overview (Обем US: 1,600 | KD: 45%) | `https://flexibits.com/fantastical` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 4 | `fantasical` | **[A] Semrush US Desktop (видим ред)** | Semrush US Desktop: #1 Organic (Обем US: 720 | KD: 46%) | `https://flexibits.com/fantastical` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 5 | `flexibits` | **[A] Semrush US Desktop (видим ред)** | Semrush US Desktop: #1 Sitelinks (Обем US: 480 | KD: 36%) | `https://flexibits.com/` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 6 | `cardhop` | **[A] Semrush US Desktop (видим ред)** | Semrush US Desktop: #1 Sitelinks (Обем US: 390 | KD: 34% — отделно приложение за контакти на Flexibits) | `https://flexibits.com/cardhop` | — (отделен продукт за контакти) |
| 7 | `flexbits` | **[A] Semrush US Desktop (видим ред)** | Semrush US Desktop: #1 Sitelinks (Обем US: 320 | KD: 33%) | `https://flexibits.com/` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 8 | `flexibit` | **[A] Semrush US Desktop (видим ред)** | Semrush US Desktop: #1 Sitelinks (Обем US: 210 | KD: 24%) | `https://flexibits.com/` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 9 | `calendar app natural language input iPhone` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #1 App Store & #2 flexibits.com (queryId: natural-language) | `https://flexibits.com/fantastical` | `/articles/natural-language-calendar-events-iphone/` |
| 10 | `best iPad calendar week month view` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #1 App Store (queryId: ipad) | `https://apps.apple.com/us/app/fantastical-calendar/id718043190` | `/articles/month-view-on-a-bigger-screen/` |
| 11 | `best iPhone calendar app with weather` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #4 App Store & #6 flexibits.com (queryId: weather) | `https://flexibits.com/fantastical` | `/articles/weather-inside-your-calendar/` |
| 12 | `iPhone カレンダー 天気 予定 アプリ` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #6 App Store JP (queryId: weather-ja) | `https://apps.apple.com/jp/app/fantastical-calendar/id718043190` | `/articles/weather-inside-your-calendar/` |
| 13 | `best calendar widget iPhone upcoming events weather` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #9 flexibits.com (queryId: widgets) | `https://flexibits.com/fantastical` | `/articles/the-widget-that-shows-what-is-next/` |
| 14 | `best Fantastical alternative iPhone calendar` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #1, #2, #3, #6, #7, #8 Външни ревюта/форуми (queryId: alternative) | `https://www.reddit.com/r/macapps/comments/17voupx/fantastical_calendar_alternatives/` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 15 | `Fantastical alternative calendar iPhone` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #1–#8 Външни сравнения (queryId: fantastical-brand) | `https://lifestack.ai/blog/fantastical-alternative` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 16 | `Calendar 366 vs Fantastical iPhone` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #1–#5 Външни сравнения (queryId: calendar366-comparison) | `https://medium.com/productivity-side/fantastical-vs-calendar-366-which-one-to-choose-130c96af8eb3` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 17 | `Fantastical vs Calendars by Readdle Calendar 366 iPhone` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #1, #2, #3, #4, #5, #8 Външни сравнения (queryId: three-calendar-comparison) | `https://slashdot.org/software/comparison/Fantastical-vs-Readdle-Calendars/` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 18 | `BusyCal vs Fantastical iPhone calendar reminders weather` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #1, #2, #3, #6, #7 Външни сравнения (queryId: busycal-comparison) | `https://www.busymac.com/compare/fantastical/` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 19 | `Google Calendar vs Fantastical iPhone` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #1–#8 Външни сравнения (queryId: google-fantastical) | `https://www.morgen.so/blog-posts/fantastical-vs-google-calendar` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 20 | `Calendars by Readdle alternative iPhone` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #7 Външно сравнение (queryId: readdle-brand) | `https://lifestack.ai/blog/fantastical-alternative` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 21 | `See iCloud, Google and Outlook calendars together (promptId: combine)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение в отговора (chatgpt-combine.json) | `https://flexibits.com/fantastical` | `/articles/icloud-google-and-outlook-in-one-view/` |
| 22 | `Drag appointments to reschedule on iPhone (promptId: drag-edit)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение в отговора (chatgpt-drag-edit.json) | `https://flexibits.com/fantastical-ios/help/adding-events-and-tasks` | `/articles/drag-an-event-to-move-it/` |
| 23 | `iPad calendar month and week views with weather (promptId: ipad)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение в отговора (chatgpt-ipad.json) | `https://flexibits.com/fantastical` | `/articles/month-view-on-a-bigger-screen/` |
| 24 | `Rotating shift work beside personal appointments (promptId: shift)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Сравнено приложение в отговора (chatgpt-shift.json) | `https://flexibits.com/fantastical-ios/help/calendar-sets` | `/articles/shift-work-calendar-iphone-rotating-schedules/` |
| 25 | `Show tasks and reminders alongside appointments (promptId: tasks)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение в отговора (chatgpt-tasks.json) | `https://flexibits.com/fantastical-ios/help/adding-events-and-tasks` | `/articles/iphone-calendar-tasks-reminders-versus-event-alerts/` |
| 26 | `Show weather alongside appointments on iPhone/iPad (promptId: weather)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение в отговора (chatgpt-weather.json) | `https://flexibits.com/fantastical-ios/help/weather` | `/articles/weather-inside-your-calendar/` |
| 27 | `Home Screen widgets for upcoming appointments and weather (promptId: widgets)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение в отговора (chatgpt-widgets.json) | `https://flexibits.com/fantastical-ios/help/widgets` | `/articles/the-widget-that-shows-what-is-next/` |
| 28 | `best fantastical alternative iphone calendar reddit` | **[D] Предложение / Кандидат-тема (не е ранк)** | Google Related Search (от all-discovered-classification.json — предложение, не е измерен ранк) | `https://flexibits.com/fantastical` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 29 | `fantastical calendar sets focus filter iphone` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от официалната документация на Flexibits (Calendar Sets) | `https://flexibits.com/fantastical-ios/help/calendar-sets` | `/articles/focus-mode-and-your-calendar/` |
| 30 | `fantastical openings meeting poll booking link` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от официалната документация на Flexibits (Scheduling) | `https://flexibits.com/fantastical/scheduling` | `/articles/booking-link-or-shared-calendar/` |

---

## #04 — Apple Calendar & Apple Reminders ([`04-apple-calendar.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/04-apple-calendar.md))

- **Разработчик / Издател:** Apple Inc. (support.apple.com / icloud.com)
- **Официален уебсайт:** https://support.apple.com/guide/iphone/calendar/
- **Отчетени позиции в Semrush (US Desktop, 21.10.2026):** Не е проверен в Semrush Free Tier (част от apple.com) (Оценяван трафик: — (поддомейн support.apple.com))
- **Най-добра наблюдавана позиция в Google SERP (извадка 45 заявки):** #1 (Собствен домейн support.apple.com)
- **Споменавания в ChatGPT (извадка 15 промпта):** 12/15 промпта (10 като основно приложение + 2 като целеви календар за времето)
- **Точен брой номерирани редове в таблицата по-долу (`N`):** **25** (`0` Semrush видими реда + `7` Google SERP собствен домейн/App Store + `5` Google SERP външни сравнения + `11` ChatGPT промпта + `2` предложения/кандидат-теми)

### 1. Защо този конкурент е включен (Доказателства спрямо Cloud Calendars)

Вграденият календар на Apple и Apple Reminders заемат 7 Топ 10 позиции със собствен домейн (support.apple.com / icloud.com / developer.apple.com) в нашата извадка от 45 Google заявки (вкл. #1 за 'reminders' и #1 & #2 за 'shared-reminders'), присъстват в 12 заявки чрез външни сравнения и се споменават в 12 от 15-те ChatGPT разговора.

### 2. Статии и страници на конкурента, които описват тези теми

| № | Официален URL на конкурента | Заглавие и роля в проучването |
| :--- | :--- | :--- |
| 1 | `https://support.apple.com/guide/iphone/share-and-collaborate-iph2a8f9121e/ios` | Share lists and collaborate in Reminders on iPhone — Ранкира на #1 за 'reminders' и #1 за 'shared-reminders' |
| 2 | `https://support.apple.com/en-us/105124` | Share and assign reminders on your iPhone or iPad — Ранкира на #2 за 'shared-reminders' |
| 3 | `https://www.icloud.com/calendar` | Calendar - Apple iCloud — Ранкира на #2 за 'cloud-calendar-definition' |
| 4 | `https://support.apple.com/guide/icloud/what-you-can-do-with-icloud-and-calendar-mm15eb200ab4/icloud` | Keep your calendars up to date and share them with iCloud — Ранкира на #3 за 'cloud-calendar-definition' |
| 5 | `https://support.apple.com/en-az/guide/iphone/iphc37be2016/ios` | Change your Calendar settings on iPhone (Alternate Calendars / Week Numbers) — Ранкира на #4 за 'calendar-language' |
| 6 | `https://support.apple.com/en-ie/guide/ipad/ipad581be0bc/27/ipados/27` | Change your Calendar settings on iPad (Week Numbers & Alternate Calendars) — Официално ръководство за iPadOS |
| 7 | `https://developer.apple.com/documentation/eventkit/creating-a-recurring-event` | Creating a recurring event (EventKit) — Ранкира на #2 за 'recurrence' |

### 3. Наши статии в Cloud Calendars (`cloud-calendars.com`), които покриват темите

| № | Наш URL (`cloud-calendars.com/articles/...`) | Заглавие на нашата статия | Локален сорс файл |
| :--- | :--- | :--- | :--- |
| 1 | `https://www.cloud-calendars.com/articles/share-assign-reminders-iphone-calendar-difference/` | **Sharing and Assigning Apple Reminders vs. Sharing a Calendar on iPhone** | `src/app/content/en-US/articles-round3.ts` |
| 2 | `https://www.cloud-calendars.com/articles/iphone-calendar-language-alternate-calendar-settings/` | **Chinese, Hebrew, or Hijri Dates on iPhone Calendar: Language vs. Alternate Calendars** | `src/app/content/en-US/articles-round3.ts` |
| 3 | `https://www.cloud-calendars.com/articles/iphone-calendar-tasks-reminders-versus-event-alerts/` | **Tasks and Reminders in an iPhone Calendar vs. Event Alerts** | `src/app/content/en-US/articles-round2.ts` |
| 4 | `https://www.cloud-calendars.com/articles/what-is-a-cloud-calendar/` | **What Is a Cloud Calendar? How Device, Provider, and App Calendars Differ** | `src/app/content/en-US/articles-round2.ts` |
| 5 | `https://www.cloud-calendars.com/articles/icloud-google-and-outlook-in-one-view/` | **iCloud, Google, and Outlook in One View** | `src/app/content/en-US/articles-accounts.ts` |

### 4. Пълна таблица на записаните заявки, промптове и кандидат-теми (Точно 25 номерирани реда)

> **Важно уточнение за произхода на данните:** Всеки ред по-долу има изрично обозначен тип доказателство (`[A]` Semrush US Desktop видима позиция, `[B1]` Google SERP Топ 10 собствен домейн/App Store, `[B2]` Google SERP Топ 10 външно сравнение, `[C]` ChatGPT потребителски промпт от извадката с 15 разговора, или `[D]` Предложение от Google Related Search / кандидат-тема от документация, което **не е** доказан ранк).

| № | Ключова дума / Заявка / Промпт | Категория доказателство | Детайли на наблюдението (Позиция / Обем / Източник) | Страница на конкурента | Наша целева статия (`cloud-calendars.com`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `calendar app tasks reminders iPhone together` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #1 support.apple.com (queryId: reminders) | `https://support.apple.com/guide/iphone/share-and-collaborate-iph2a8f9121e/ios` | `/articles/iphone-calendar-tasks-reminders-versus-event-alerts/` |
| 2 | `share assign reminders iPhone family list` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #1 & #2 support.apple.com (queryId: shared-reminders) | `https://support.apple.com/en-us/105124` | `/articles/share-assign-reminders-iphone-calendar-difference/` |
| 3 | `what is a cloud calendar` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #2 icloud.com & #3 support.apple.com (queryId: cloud-calendar-definition) | `https://support.apple.com/guide/icloud/what-you-can-do-with-icloud-and-calendar-mm15eb200ab4/icloud` | `/articles/what-is-a-cloud-calendar/` |
| 4 | `recurring events calendar app iPhone custom repeat` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #2 developer.apple.com & #7 discussions.apple.com (queryId: recurrence) | `https://developer.apple.com/documentation/eventkit/creating-a-recurring-event` | `/articles/every-second-tuesday-and-other-oddities/` |
| 5 | `iPhone calendar not syncing Google Outlook` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #3 discussions.apple.com (queryId: sync) | `https://discussions.apple.com/thread/255200204` | `/articles/when-an-event- fails-to-appear/` |
| 6 | `iPhone calendar showing Chinese characters language alternate calendar` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #1 discussions.apple.com & #4 support.apple.com (queryId: calendar-language) | `https://support.apple.com/en-az/guide/iphone/iphc37be2016/ios` | `/articles/iphone-calendar-language-alternate-calendar-settings/` |
| 7 | `calendar app natural language input iPhone` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #7 App Store Apple Calendar (queryId: natural-language) | `https://apps.apple.com/sg/app/calendar/id1113106806` | `/articles/natural-language-calendar-events-iphone/` |
| 8 | `Calendar 366 vs Fantastical iPhone` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #1 & #3 Външни сравнения с Apple Calendar (queryId: calendar366-comparison) | `https://setapp.com/app-reviews/fantastical-vs-apple-calendar` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 9 | `Fantastical vs Calendars by Readdle Calendar 366 iPhone` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #1, #4, #8 Външни сравнения с Apple Calendar (queryId: three-calendar-comparison) | `https://horacal.app/blog/apple-calendar-vs-fantastical/` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 10 | `BusyCal vs Fantastical iPhone calendar reminders weather` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #5 & #8 Външни сравнения с Apple Calendar (queryId: busycal-comparison) | `https://bundl.run/compare/busycal-vs-apple-calendar` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 11 | `calendar app booking link availability iPhone` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #4 & #6 Външни инструменти за Apple Calendar (queryId: booking) | `https://koalendar.com/integrations/icloud-calendar` | `/articles/booking-link-or-shared-calendar/` |
| 12 | `shift calendar app export Apple Calendar` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #6 Външна интеграция за Apple Calendar (queryId: shifts2) | `https://help.shiftcare.com/en/articles/14260509-apple-calendar-integration` | `/articles/shift-work-calendar-iphone-rotating-schedules/` |
| 13 | `See iCloud, Google and Outlook calendars together (promptId: combine)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): #1 препоръчана безплатна опция (chatgpt-combine.json) | `https://support.apple.com/guide/iphone/calendar/` | `/articles/icloud-google-and-outlook-in-one-view/` |
| 14 | `Drag appointments to reschedule on iPhone (promptId: drag-edit)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение в отговора (chatgpt-drag-edit.json) | `https://support.apple.com/guide/iphone/calendar/` | `/articles/drag-an-event-to-move-it/` |
| 15 | `Free Google Calendar syncing without subscription (promptId: free-sync)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение в отговора (chatgpt-free-sync.json) | `https://support.apple.com/guide/iphone/calendar/` | `/articles/free-google-sync-without-adverts/` |
| 16 | `iPad as a shared family calendar display (promptId: household-display)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение за iPad дисплей (chatgpt-household-display.json) | `https://support.apple.com/guide/icloud/what-you-can-do-with-icloud-and-calendar-mm15eb200ab4/icloud` | `/articles/ipad-family-calendar-display-skylight-dakboard/` |
| 17 | `Live Activity or Dynamic Island countdown (promptId: live-activity)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Споменато приложение в отговора (chatgpt-live-activity.json) | `https://support.apple.com/guide/iphone/calendar/` | `/articles/a-countdown-to-your-next-meeting/` |
| 18 | `Offline calendar without a subscription (promptId: offline)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение в отговора (chatgpt-offline.json) | `https://support.apple.com/guide/iphone/calendar/` | `/articles/what-calendar-sync-actually-does/` |
| 19 | `Rotating shift work beside personal appointments (promptId: shift)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано комбинирано приложение (chatgpt-shift.json) | `https://support.apple.com/guide/iphone/calendar/` | `/articles/shift-work-calendar-iphone-rotating-schedules/` |
| 20 | `Show tasks and reminders alongside appointments (promptId: tasks)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано за Apple Reminders (chatgpt-tasks.json) | `https://support.apple.com/en-us/105124` | `/articles/iphone-calendar-tasks-reminders-versus-event-alerts/` |
| 21 | `Show weather alongside appointments via ICS feed (promptId: weather)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Сравнено решение с календарен фийд (chatgpt-weather.json) | `https://support.apple.com/guide/iphone/calendar/` | `/articles/weather-inside-your-calendar/` |
| 22 | `Save daily weather history records in Apple Calendar (promptId: weather-history)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Целеви календар за архив на времето (chatgpt-weather-history.json) | `https://support.apple.com/guide/iphone/calendar/` | `/articles/weather-calendar-history-versus-forecast-iphone/` |
| 23 | `Home Screen widgets for upcoming appointments (promptId: widgets)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано в комбинация с Apple Weather (chatgpt-widgets.json) | `https://support.apple.com/guide/iphone/calendar/` | `/articles/the-widget-that-shows-what-is-next/` |
| 24 | `how to turn on week numbers on ipad calendar` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от официалната документация на Apple за iPadOS 27 (round6-primary-checks.json) | `https://support.apple.com/en-ie/guide/ipad/ipad581be0bc/27/ipados/27` | `/articles/iphone-calendar-language-alternate-calendar-settings/` |
| 25 | `shared reminders list notification rules iphone` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от официалната документация на Apple (support.apple.com/en-au/105124) | `https://support.apple.com/en-au/105124` | `/articles/share-assign-reminders-iphone-calendar-difference/` |

---

## #05 — Google Calendar & Google Tasks ([`05-google-calendar.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/05-google-calendar.md))

- **Разработчик / Издател:** Google LLC (support.google.com/calendar)
- **Официален уебсайт:** https://support.google.com/calendar/
- **Отчетени позиции в Semrush (US Desktop, 21.10.2026):** Не е проверен в Semrush Free Tier (част от google.com) (Оценяван трафик: — (поддомейн support.google.com))
- **Най-добра наблюдавана позиция в Google SERP (извадка 45 заявки):** #1 (Собствен домейн support.google.com)
- **Споменавания в ChatGPT (извадка 15 промпта):** 11/15 промпта (9 като основно приложение + 2 като целеви календар/фийд)
- **Точен брой номерирани редове в таблицата по-долу (`N`):** **22** (`0` Semrush видими реда + `6` Google SERP собствен домейн/App Store + `3` Google SERP външни сравнения + `11` ChatGPT промпта + `2` предложения/кандидат-теми)

### 1. Защо този конкурент е включен (Доказателства спрямо Cloud Calendars)

Официалната помощна документация на Google Calendar (support.google.com/calendar) се класира в Топ 10 при 6 от 45-те наблюдавани Google заявки (вкл. #1 за 'can others see my Google Calendar tasks' и #2 за 'sync' и 'booking'), споменава се в заглавията на външни страници при още 8 заявки и присъства в 11 от 15-те ChatGPT разговора.

### 2. Статии и страници на конкурента, които описват тези теми

| № | Официален URL на конкурента | Заглавие и роля в проучването |
| :--- | :--- | :--- |
| 1 | `https://support.google.com/calendar/answer/34580` | Change event & task visibility on your calendar — Ранкира на #1 за 'google-task-visibility' |
| 2 | `https://support.google.com/calendar/answer/6261951?hl=en&co=GENIE.Platform%3DiOS` | Fix sync problems with the Google Calendar app (iOS) — Ранкира на #2 за 'sync' |
| 3 | `https://support.google.com/calendar/answer/10733297?hl=en&co=GENIE.Platform%3DiOS` | Share your appointment schedule (iPhone & iPad) — Ранкира на #2 за 'booking' |
| 4 | `https://support.google.com/calendar/answer/37064?hl=en&co=GENIE.Platform%3DiOS` | Use Google Calendar in different time zones (iOS) — Ранкира на #5 за 'travel' |
| 5 | `https://support.google.com/calendar/answer/16404789?hl=en-RW` | Google Calendar on Apple Watch — Официална документация за седемдневен изглед на събития и задачи на watchOS 11+ |
| 6 | `https://support.google.com/calendar/answer/99358?hl=en&co=GENIE.Platform%3DiOS` | Sync Calendar with a phone or tablet (iPhone & iPad) — Официално ръководство за iOS синхронизация |

### 3. Наши статии в Cloud Calendars (`cloud-calendars.com`), които покриват темите

| № | Наш URL (`cloud-calendars.com/articles/...`) | Заглавие на нашата статия | Локален сорс файл |
| :--- | :--- | :--- | :--- |
| 1 | `https://www.cloud-calendars.com/articles/can-others-see-google-calendar-tasks/` | **Can Others See Your Google Calendar Tasks? Visibility Rules Explained** | `src/app/content/en-US/articles-round3.ts` |
| 2 | `https://www.cloud-calendars.com/articles/sync-google-tasks-apple-reminders-iphone/` | **Syncing Google Tasks and Apple Reminders on iPhone: What Works** | `src/app/content/en-US/articles-round4.ts` |
| 3 | `https://www.cloud-calendars.com/articles/free-google-sync-without-adverts/` | **Free Google Calendar Sync, and What the Adverts Pay For** | `src/app/content/en-US/articles-accounts.ts` |
| 4 | `https://www.cloud-calendars.com/articles/who-can-see-what-in-google-calendar/` | **Who Can See What in Google Calendar** | `src/app/content/en-US/articles-sharing.ts` |
| 5 | `https://www.cloud-calendars.com/articles/calendar-on-apple-watch/` | **Your Calendar on Apple Watch (вкл. правилата за Google Calendar на watchOS)** | `src/app/content/en-US/articles-views.ts` |

### 4. Пълна таблица на записаните заявки, промптове и кандидат-теми (Точно 22 номерирани реда)

> **Важно уточнение за произхода на данните:** Всеки ред по-долу има изрично обозначен тип доказателство (`[A]` Semrush US Desktop видима позиция, `[B1]` Google SERP Топ 10 собствен домейн/App Store, `[B2]` Google SERP Топ 10 външно сравнение, `[C]` ChatGPT потребителски промпт от извадката с 15 разговора, или `[D]` Предложение от Google Related Search / кандидат-тема от документация, което **не е** доказан ранк).

| № | Ключова дума / Заявка / Промпт | Категория доказателство | Детайли на наблюдението (Позиция / Обем / Източник) | Страница на конкурента | Наша целева статия (`cloud-calendars.com`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `can others see my Google Calendar tasks` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #1, #2, #7 support.google.com (queryId: google-task-visibility) | `https://support.google.com/calendar/answer/34580?hl=en&co=GENIE.Platform%3DDesktop` | `/articles/can-others-see-google-calendar-tasks/` |
| 2 | `iPhone calendar not syncing Google Outlook` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #2 & #7 support.google.com (queryId: sync) | `https://support.google.com/calendar/answer/6261951?hl=en&co=GENIE.Platform%3DiOS` | `/articles/when-an-event-fails-to-appear/` |
| 3 | `calendar app booking link availability iPhone` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #2 support.google.com (queryId: booking) | `https://support.google.com/calendar/answer/10733297?hl=en&co=GENIE.Platform%3DiOS` | `/articles/booking-link-or-shared-calendar/` |
| 4 | `iPhone calendar app Apple Reminders Google Tasks integration` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #4 support.google.com (queryId: tasks-integration) | `https://support.google.com/calendar/thread/305159420/can-google-tasks-be-synced-with-apple-reminders?hl=en` | `/articles/sync-google-tasks-apple-reminders-iphone/` |
| 5 | `calendar app travel time zones iPhone` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #5 support.google.com (queryId: travel) | `https://support.google.com/calendar/answer/37064?hl=en&co=GENIE.Platform%3DiOS` | `/articles/landing-in-another-time-zone/` |
| 6 | `sync Google Tasks Apple Reminders two way iPhone` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #5 support.google.com (queryId: task-bridge) | `https://support.google.com/calendar/thread/305159420/can-google-tasks-be-synced-with-apple-reminders?hl=en` | `/articles/sync-google-tasks-apple-reminders-iphone/` |
| 7 | `Google Calendar vs Fantastical iPhone` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #1–#8 Външни сравнения (queryId: google-fantastical) | `https://www.morgen.so/blog-posts/fantastical-vs-google-calendar` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 8 | `Any.do calendar iPhone Google iCloud sync` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #2, #5, #7, #9 Външни страници за Google Calendar синхронизация (queryId: anydo-calendar) | `https://www.any.do/blog/how-to-sync-any-do-with-google-calendar-the-complete-2026-guide/` | `/articles/what-calendar-sync-actually-does/` |
| 9 | `Amie Google Calendar tasks scheduling iPhone` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #3, #6, #8 Външни страници за Google Calendar/Tasks (queryId: amie-calendar) | `https://amie.so/documentation/google-calendar-integration` | `/articles/iphone-calendar-tasks-reminders-versus-event-alerts/` |
| 10 | `See iCloud, Google and Outlook calendars together (promptId: combine)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Сравнено приложение в отговора (chatgpt-combine.json) | `https://support.google.com/calendar/` | `/articles/icloud-google-and-outlook-in-one-view/` |
| 11 | `Drag appointments to reschedule on iPhone (promptId: drag-edit)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение (#4 в списъка, chatgpt-drag-edit.json) | `https://support.google.com/calendar/` | `/articles/drag-an-event-to-move-it/` |
| 12 | `Shared family calendar apps for iPhone and Android (promptId: family)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Начална препоръка за безплатен семеен календар (chatgpt-family.json) | `https://support.google.com/calendar/` | `/articles/cozi-timetree-family-calendar-iphone-android/` |
| 13 | `Free Google Calendar syncing without subscription (promptId: free-sync)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано безплатно приложение (chatgpt-free-sync.json) | `https://support.google.com/calendar/` | `/articles/free-google-sync-without-adverts/` |
| 14 | `iPad as a shared family calendar display (promptId: household-display)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано за домакинства със смесени устройства (chatgpt-household-display.json) | `https://support.google.com/calendar/` | `/articles/ipad-family-calendar-display-skylight-dakboard/` |
| 15 | `Offline calendar without a subscription (promptId: offline)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение с уточнени офлайн лимити (chatgpt-offline.json) | `https://support.google.com/calendar/` | `/articles/what-calendar-sync-actually-does/` |
| 16 | `Rotating shift work beside personal appointments (promptId: shift)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано за междуплатформен график (chatgpt-shift.json) | `https://support.google.com/calendar/` | `/articles/shift-work-calendar-iphone-rotating-schedules/` |
| 17 | `Keep Google Tasks and Apple Reminders synchronized (promptId: task-bridge)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Основен инструмент за преглед на Google Tasks с дати (chatgpt-task-bridge.json) | `https://support.google.com/calendar/answer/34580` | `/articles/sync-google-tasks-apple-reminders-iphone/` |
| 18 | `Show tasks and reminders alongside appointments (promptId: tasks)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано за потребители на Google Tasks (chatgpt-tasks.json) | `https://support.google.com/calendar/answer/34580` | `/articles/iphone-calendar-tasks-reminders-versus-event-alerts/` |
| 19 | `Show weather alongside appointments via URL calendar (promptId: weather)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Споменато за добавяне на публичен URL календар с времето (chatgpt-weather.json) | `https://support.google.com/calendar/` | `/articles/weather-inside-your-calendar/` |
| 20 | `Save daily weather history records (promptId: weather-history)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Споменат целеви календар за ICS/фийд записи (chatgpt-weather-history.json) | `https://support.google.com/calendar/` | `/articles/weather-calendar-history-versus-forecast-iphone/` |
| 21 | `google calendar on apple watch tasks 7 days` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от официалната документация на Google за watchOS 11+ (round6-primary-checks.json) | `https://support.google.com/calendar/answer/16404789?hl=en-RW` | `/articles/calendar-on-apple-watch/` |
| 22 | `are google calendar tasks visible to coworkers` | **[D] Предложение / Кандидат-тема (не е ранк)** | Google Related Search (от all-discovered-classification.json — предложение, не е измерен ранк) | `https://support.google.com/calendar/answer/34580` | `/articles/can-others-see-google-calendar-tasks/` |

---

## #06 — Calendars by Readdle ([`06-calendars-by-readdle.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/06-calendars-by-readdle.md))

- **Разработчик / Издател:** Readdle Inc. (readdle.com / support.readdle.com)
- **Официален уебсайт:** https://readdle.com/calendars
- **Отчетени позиции в Semrush (US Desktop, 21.10.2026):** Не е проверен в Semrush Free Tier (Оценяван трафик: —)
- **Най-добра наблюдавана позиция в Google SERP (извадка 45 заявки):** #3 (Собствен домейн support.readdle.com)
- **Споменавания в ChatGPT (извадка 15 промпта):** 7/15 промпта (combine, drag-edit, free-sync, ipad, offline, tasks, weather)
- **Точен брой номерирани редове в таблицата по-долу (`N`):** **17** (`0` Semrush видими реда + `6` Google SERP собствен домейн/App Store + `2` Google SERP външни сравнения + `7` ChatGPT промпта + `2` предложения/кандидат-теми)

### 1. Защо този конкурент е включен (Доказателства спрямо Cloud Calendars)

Домейните на Readdle (readdle.com, support.readdle.com, apphelp.readdle.com) се класират директно в Топ 10 при 6 от 45-те наблюдавани Google заявки (вкл. #3 за 'tasks-integration', #4 за 'combine' и 'reminders', #5 за 'natural-language', #6 за 'task-bridge' и #8 за 'widgets'), а приложението е препоръчано в 7 от 15-те ChatGPT разговора.

### 2. Статии и страници на конкурента, които описват тези теми

| № | Официален URL на конкурента | Заглавие и роля в проучването |
| :--- | :--- | :--- |
| 1 | `https://support.readdle.com/calendars/synchronization/how-to-sync-tasks-with-ios-reminders-or-google-tasks` | How to sync Tasks with iOS Reminders or Google Tasks — Ранкира на #3 за 'tasks-integration', #4 за 'reminders' и #6 за 'task-bridge' |
| 2 | `https://readdle.com/calendars/how-to-merge-calendars` | How to merge Calendars - Combine & Sync Multiple Calendars — Ранкира на #4 за 'combine' |
| 3 | `https://apphelp.readdle.com/index.php?pg=kb.page&id=429` | 2.4. Natural Language Input — Ранкира на #5 за 'natural-language' |
| 4 | `https://readdle.com/blog/best-calendar-widgets-for-iPhone-and-iPad` | The best Calendar widgets for iPhones and iPads — Ранкира на #8 за 'widgets' |
| 5 | `https://apphelp.readdle.com/en/index.php?id=585&pg=kb.page` | Free vs Full Version in Calendars by Readdle — Официална KB страница, цитирана от ChatGPT за безплатен Google sync |
| 6 | `https://readdle.com/calendars` | Calendars by Readdle Product Page — Официална продуктова страница |

### 3. Наши статии в Cloud Calendars (`cloud-calendars.com`), които покриват темите

| № | Наш URL (`cloud-calendars.com/articles/...`) | Заглавие на нашата статия | Локален сорс файл |
| :--- | :--- | :--- | :--- |
| 1 | `https://www.cloud-calendars.com/articles/fantastical-readdle-calendar366-iphone-comparison/` | **Fantastical, Calendars by Readdle, Calendar 366, and Cloud Calendars on iPhone** | `src/app/content/en-US/articles-round2.ts` |
| 2 | `https://www.cloud-calendars.com/articles/icloud-google-and-outlook-in-one-view/` | **iCloud, Google, and Outlook in One View** | `src/app/content/en-US/articles-accounts.ts` |
| 3 | `https://www.cloud-calendars.com/articles/iphone-calendar-tasks-reminders-versus-event-alerts/` | **Tasks and Reminders in an iPhone Calendar vs. Event Alerts** | `src/app/content/en-US/articles-round2.ts` |
| 4 | `https://www.cloud-calendars.com/articles/natural-language-calendar-events-iphone/` | **Natural-Language Event Creation on iPhone: What Gets Parsed** | `src/app/content/en-US/articles-round2.ts` |
| 5 | `https://www.cloud-calendars.com/articles/free-google-sync-without-adverts/` | **Free Google Calendar Sync, and What the Adverts Pay For** | `src/app/content/en-US/articles-accounts.ts` |

### 4. Пълна таблица на записаните заявки, промптове и кандидат-теми (Точно 17 номерирани реда)

> **Важно уточнение за произхода на данните:** Всеки ред по-долу има изрично обозначен тип доказателство (`[A]` Semrush US Desktop видима позиция, `[B1]` Google SERP Топ 10 собствен домейн/App Store, `[B2]` Google SERP Топ 10 външно сравнение, `[C]` ChatGPT потребителски промпт от извадката с 15 разговора, или `[D]` Предложение от Google Related Search / кандидат-тема от документация, което **не е** доказан ранк).

| № | Ключова дума / Заявка / Промпт | Категория доказателство | Детайли на наблюдението (Позиция / Обем / Източник) | Страница на конкурента | Наша целева статия (`cloud-calendars.com`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `iPhone calendar app Apple Reminders Google Tasks integration` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #3 support.readdle.com (queryId: tasks-integration) | `https://support.readdle.com/calendars/synchronization/how-to-sync-tasks-with-ios-reminders-or-google-tasks` | `/articles/iphone-calendar-tasks-reminders-versus-event-alerts/` |
| 2 | `iPhone app combine iCloud Google Outlook calendars` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #4 readdle.com (queryId: combine) | `https://readdle.com/calendars/how-to-merge-calendars` | `/articles/icloud-google-and-outlook-in-one-view/` |
| 3 | `calendar app tasks reminders iPhone together` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #4 support.readdle.com (queryId: reminders) | `https://support.readdle.com/calendars/synchronization/how-to-sync-tasks-with-ios-reminders-or-google-tasks` | `/articles/iphone-calendar-tasks-reminders-versus-event-alerts/` |
| 4 | `calendar app natural language input iPhone` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #5 apphelp.readdle.com (queryId: natural-language) | `https://apphelp.readdle.com/index.php?pg=kb.page&id=429` | `/articles/natural-language-calendar-events-iphone/` |
| 5 | `sync Google Tasks Apple Reminders two way iPhone` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #6 support.readdle.com (queryId: task-bridge) | `https://support.readdle.com/calendars/synchronization/how-to-sync-tasks-with-ios-reminders-or-google-tasks` | `/articles/sync-google-tasks-apple-reminders-iphone/` |
| 6 | `best calendar widget iPhone upcoming events weather` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #8 readdle.com/blog (queryId: widgets) | `https://readdle.com/blog/best-calendar-widgets-for-iPhone-and-iPad` | `/articles/the-widget-that-shows-what-is-next/` |
| 7 | `Calendars by Readdle alternative iPhone` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #2 & #5 Външни каталози за алтернативи (queryId: readdle-brand) | `https://www.softwaresuggest.com/readdle-calendars/alternatives` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 8 | `Fantastical vs Calendars by Readdle Calendar 366 iPhone` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #3 & #4 Външни сравнения (queryId: three-calendar-comparison) | `https://slashdot.org/software/comparison/Fantastical-vs-Readdle-Calendars/` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 9 | `See iCloud, Google and Outlook calendars together (promptId: combine)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение (#2 в списъка, chatgpt-combine.json) | `https://readdle.com/calendars/how-to-merge-calendars` | `/articles/icloud-google-and-outlook-in-one-view/` |
| 10 | `Drag appointments to reschedule on iPhone (promptId: drag-edit)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение в отговора (chatgpt-drag-edit.json) | `https://readdle.com/calendars` | `/articles/drag-an-event-to-move-it/` |
| 11 | `Free Google Calendar syncing without subscription (promptId: free-sync)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Сравнено приложение с цитат към KB #585 (chatgpt-free-sync.json) | `https://apphelp.readdle.com/en/index.php?id=585&pg=kb.page` | `/articles/free-google-sync-without-adverts/` |
| 12 | `iPad calendar month and week views with weather (promptId: ipad)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение за iPad (chatgpt-ipad.json) | `https://readdle.com/calendars` | `/articles/month-view-on-a-bigger-screen/` |
| 13 | `Offline calendar without a subscription (promptId: offline)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Сравнено приложение в отговора (chatgpt-offline.json) | `https://readdle.com/calendars` | `/articles/what-calendar-sync-actually-does/` |
| 14 | `Show tasks and reminders alongside appointments (promptId: tasks)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение за iOS Reminders + Google Tasks (chatgpt-tasks.json) | `https://support.readdle.com/calendars/synchronization/how-to-sync-tasks-with-ios-reminders-or-google-tasks` | `/articles/iphone-calendar-tasks-reminders-versus-event-alerts/` |
| 15 | `Show weather alongside appointments on iPhone/iPad (promptId: weather)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение (платен Pro план за времето, chatgpt-weather.json) | `https://readdle.com/calendars` | `/articles/weather-inside-your-calendar/` |
| 16 | `how to merge calendars on iphone without duplicates` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от статията на Readdle (readdle.com/calendars/how-to-merge-calendars) | `https://readdle.com/calendars/how-to-merge-calendars` | `/articles/icloud-google-and-outlook-in-one-view/` |
| 17 | `calendars by readdle free vs pro features` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от документацията на Readdle (apphelp.readdle.com id=585) | `https://apphelp.readdle.com/en/index.php?id=585&pg=kb.page` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |

---

## #07 — Weather Events (by Dejal) ([`07-weather-events-dejal.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/07-weather-events-dejal.md))

- **Разработчик / Издател:** Dejal Systems, LLC (dejal.com/weatherevents)
- **Официален уебсайт:** https://dejal.com/weatherevents/
- **Отчетени позиции в Semrush (US Desktop, 21.10.2026):** Не е проверен в Semrush Free Tier (Оценяван трафик: —)
- **Най-добра наблюдавана позиция в Google SERP (извадка 45 заявки):** #1 в 3 отделни Google заявки (weather, widgets, dejal-weather-history) + #2 в Германия
- **Споменавания в ChatGPT (извадка 15 промпта):** 1/15 промпта (weather-history — препоръчано по име Weather Events / Dejal)
- **Точен брой номерирани редове в таблицата по-долу (`N`):** **8** (`0` Semrush видими реда + `5` Google SERP собствен домейн/App Store + `0` Google SERP външни сравнения + `1` ChatGPT промпта + `2` предложения/кандидат-теми)

### 1. Защо този конкурент е включен (Доказателства спрямо Cloud Calendars)

Weather Events (разработено от Dejal Systems, LLC) държи #1 позиция в Google SERP (App Store US) за две от най-важните продуктови заявки за нашия календар — 'best iPhone calendar app with weather' (#1) и 'best calendar widget iPhone upcoming events weather' (#1), плюс #2 в Германия ('Kalender App iPhone Wetter Termine') и #1 със собствения си домейн dejal.com за исторически архив на времето в календара.

### 2. Статии и страници на конкурента, които описват тези теми

| № | Официален URL на конкурента | Заглавие и роля в проучването |
| :--- | :--- | :--- |
| 1 | `https://apps.apple.com/us/app/weather-events-for-calendar/id6475696867` | Weather Events - for Calendar (App Store US) — Ранкира на #1 за 'weather' и #1 за 'widgets' |
| 2 | `https://apps.apple.com/de/app/weather-events-for-calendar/id6475696867` | Weather Events - for Calendar (App Store DE) — Ранкира на #2 за 'Kalender App iPhone Wetter Termine' |
| 3 | `https://dejal.com/weatherevents/` | Dejal Weather Events Official Page — Ранкира на #1 за 'dejal-weather-history'; документира запис на целодневни метео събития за минали и бъдещи дати |

### 3. Наши статии в Cloud Calendars (`cloud-calendars.com`), които покриват темите

| № | Наш URL (`cloud-calendars.com/articles/...`) | Заглавие на нашата статия | Локален сорс файл |
| :--- | :--- | :--- | :--- |
| 1 | `https://www.cloud-calendars.com/articles/weather-calendar-history-versus-forecast-iphone/` | **Saving Weather History in Your iPhone Calendar vs. Viewing a Live Forecast** | `src/app/content/en-US/articles-round5.ts` |
| 2 | `https://www.cloud-calendars.com/articles/weather-inside-your-calendar/` | **Weather Inside Your Calendar** | `src/app/content/en-US/articles-weather.ts` |
| 3 | `https://www.cloud-calendars.com/articles/the-widget-that-shows-what-is-next/` | **The Widget That Shows What Is Next** | `src/app/content/en-US/articles-widgets.ts` |
| 4 | `https://www.cloud-calendars.com/articles/reading-a-chance-of-rain/` | **Reading a Chance of Rain (вкл. количество срещу интензивност на валежа)** | `src/app/content/en-US/articles-weather.ts` |

### 4. Пълна таблица на записаните заявки, промптове и кандидат-теми (Точно 8 номерирани реда)

> **Важно уточнение за произхода на данните:** Всеки ред по-долу има изрично обозначен тип доказателство (`[A]` Semrush US Desktop видима позиция, `[B1]` Google SERP Топ 10 собствен домейн/App Store, `[B2]` Google SERP Топ 10 външно сравнение, `[C]` ChatGPT потребителски промпт от извадката с 15 разговора, или `[D]` Предложение от Google Related Search / кандидат-тема от документация, което **не е** доказан ранк).

| № | Ключова дума / Заявка / Промпт | Категория доказателство | Детайли на наблюдението (Позиция / Обем / Източник) | Страница на конкурента | Наша целева статия (`cloud-calendars.com`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `best iPhone calendar app with weather` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #1 Официален App Store листинг (queryId: weather) | `https://apps.apple.com/us/app/weather-events-for-calendar/id6475696867` | `/articles/weather-inside-your-calendar/` |
| 2 | `best calendar widget iPhone upcoming events weather` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #1 Официален App Store листинг (queryId: widgets) | `https://apps.apple.com/us/app/weather-events-for-calendar/id6475696867` | `/articles/the-widget-that-shows-what-is-next/` |
| 3 | `Dejal Weather Events calendar weather history iPhone` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #1 Собствен домейн dejal.com (queryId: dejal-weather-history) | `https://dejal.com/weatherevents/` | `/articles/weather-calendar-history-versus-forecast-iphone/` |
| 4 | `Kalender App iPhone Wetter Termine` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #2 Официален App Store DE листинг (queryId: weather-de) | `https://apps.apple.com/de/app/weather-events-for-calendar/id6475696867` | `/articles/weather-inside-your-calendar/` |
| 5 | `"Weather Calendar Together" iPhone` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #7 Официален App Store листинг на Weather Events (queryId: weather-together-brand) | `https://apps.apple.com/bh/app/weather-events-for-calendar/id6475696867` | `/articles/weather-inside-your-calendar/` |
| 6 | `Save a record of daily weather in my calendar to look back months later (promptId: weather-history)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Водеща препоръка за исторически метео архив в календара (chatgpt-weather-history.json) | `https://dejal.com/weatherevents/` | `/articles/weather-calendar-history-versus-forecast-iphone/` |
| 7 | `save daily weather history in apple calendar` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от документацията на Dejal Weather Events (round5-primary-checks.json) | `https://dejal.com/weatherevents/` | `/articles/weather-calendar-history-versus-forecast-iphone/` |
| 8 | `weather forecast vs weather diary in calendar iphone` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от сравнението между жива прогноза и записани календарни събития | `https://dejal.com/weatherevents/` | `/articles/weather-calendar-history-versus-forecast-iphone/` |

---

## #08 — Motion & FlowSavvy (Auto-Scheduling) ([`08-motion-flowsavvy.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/08-motion-flowsavvy.md))

- **Разработчик / Издател:** Motion (usemotion.com) & FlowSavvy (flowsavvy.app)
- **Официален уебсайт:** https://www.usemotion.com/ | https://flowsavvy.app/
- **Отчетени позиции в Semrush (US Desktop, 21.10.2026):** Не е проверен в Semrush Free Tier (Оценяван трафик: —)
- **Най-добра наблюдавана позиция в Google SERP (извадка 45 заявки):** #1 за 'timeblocking' (flowsavvy.app) и #1 за 'family' (usemotion.com)
- **Споменавания в ChatGPT (извадка 15 промпта):** 1/15 промпта (auto-scheduling — с изрично посочени имена във въпроса)
- **Точен брой номерирани редове в таблицата по-долу (`N`):** **7** (`0` Semrush видими реда + `3` Google SERP собствен домейн/App Store + `1` Google SERP външни сравнения + `1` ChatGPT промпта + `2` предложения/кандидат-теми)

### 1. Защо този конкурент е включен (Доказателства спрямо Cloud Calendars)

В нашата извадка от 45 Google заявки FlowSavvy заема #1 за 'best time blocking calendar app iPhone' (където Motion е #4), а блогът на Motion заема #1 за 'best shared family calendar app iPhone Android' и #8 за 'TimeTree alternative'. Освен това категорията 'Motion alternative automatic time blocking' формира самостоятелен клъстер от търсения.

### 2. Статии и страници на конкурента, които описват тези теми

| № | Официален URL на конкурента | Заглавие и роля в проучването |
| :--- | :--- | :--- |
| 1 | `https://flowsavvy.app/top-time-blocking-apps` | 9 Best Time Blocking Apps in 2026 (FlowSavvy) — Ранкира на #1 за 'timeblocking' |
| 2 | `https://www.usemotion.com/blog/best-time-blocking-apps.html` | I Reviewed 20 Apps to Find The 9 Best Time Blocking Apps (Motion) — Ранкира на #4 за 'timeblocking' |
| 3 | `https://www.usemotion.com/blog/best-shared-calendar-app-for-families.html` | I Tested The Best Shared Calendar Apps For Families (Motion) — Ранкира на #1 за 'family' и #8 за 'timetree-brand' |
| 4 | `https://flowsavvy.app/pricing` | FlowSavvy Pricing & Auto-Scheduling Rules — Официална страница, цитирана в ChatGPT за автоматично пренареждане на задачи |

### 3. Наши статии в Cloud Calendars (`cloud-calendars.com`), които покриват темите

| № | Наш URL (`cloud-calendars.com/articles/...`) | Заглавие на нашата статия | Локален сорс файл |
| :--- | :--- | :--- | :--- |
| 1 | `https://www.cloud-calendars.com/articles/automatic-time-blocking-versus-manual-calendar/` | **Automatic Time Blocking vs. a Manual Calendar on iPhone** | `src/app/content/en-US/articles-round2.ts` |
| 2 | `https://www.cloud-calendars.com/articles/weekly-schedule-builder/` | **Weekly Schedule Builder** | `src/app/content/en-US/articles-round7.ts` |
| 3 | `https://www.cloud-calendars.com/articles/cozi-timetree-family-calendar-iphone-android/` | **Shared Family Calendars Across iPhone and Android** | `src/app/content/en-US/articles-round2.ts` |

### 4. Пълна таблица на записаните заявки, промптове и кандидат-теми (Точно 7 номерирани реда)

> **Важно уточнение за произхода на данните:** Всеки ред по-долу има изрично обозначен тип доказателство (`[A]` Semrush US Desktop видима позиция, `[B1]` Google SERP Топ 10 собствен домейн/App Store, `[B2]` Google SERP Топ 10 външно сравнение, `[C]` ChatGPT потребителски промпт от извадката с 15 разговора, или `[D]` Предложение от Google Related Search / кандидат-тема от документация, което **не е** доказан ранк).

| № | Ключова дума / Заявка / Промпт | Категория доказателство | Детайли на наблюдението (Позиция / Обем / Източник) | Страница на конкурента | Наша целева статия (`cloud-calendars.com`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `best time blocking calendar app iPhone` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #1 flowsavvy.app & #4 usemotion.com (queryId: timeblocking) | `https://flowsavvy.app/top-time-blocking-apps` | `/articles/automatic-time-blocking-versus-manual-calendar/` |
| 2 | `best shared family calendar app iPhone Android` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #1 usemotion.com/blog (queryId: family) | `https://www.usemotion.com/blog/best-shared-calendar-app-for-families.html` | `/articles/cozi-timetree-family-calendar-iphone-android/` |
| 3 | `TimeTree alternative shared family calendar iPhone` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #8 usemotion.com/blog (queryId: timetree-brand) | `https://www.usemotion.com/blog/best-shared-calendar-app-for-families.html` | `/articles/cozi-timetree-family-calendar-iphone-android/` |
| 4 | `Motion alternative automatic time blocking calendar iPhone` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #1, #3, #4, #7 Външни сравнения за алтернативи на Motion (queryId: auto-scheduling) | `https://www.reddit.com/r/ProductivityApps/comments/1vez2yb/what_are_the_best_motion_alternatives/` | `/articles/automatic-time-blocking-versus-manual-calendar/` |
| 5 | `Planning apps that automatically reschedule tasks around meetings vs manual time blocking (promptId: auto-scheduling)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Сравнени приложения в seeded-comparison промпт (chatgpt-auto-scheduling.json) | `https://flowsavvy.app/pricing` | `/articles/automatic-time-blocking-versus-manual-calendar/` |
| 6 | `free motion alternative automatic time blocking` | **[D] Предложение / Кандидат-тема (не е ранк)** | Google Related Search (от all-discovered-classification.json — предложение, не е измерен ранк) | `https://flowsavvy.app/pricing` | `/articles/automatic-time-blocking-versus-manual-calendar/` |
| 7 | `flowsavvy vs motion iphone calendar` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от документацията на FlowSavvy и Motion за автоматично пренареждане на задачи | `https://flowsavvy.app/top-time-blocking-apps` | `/articles/automatic-time-blocking-versus-manual-calendar/` |

---

## #09 — Supershift & Work Shift Planners (Shifter / My Shift Planner) ([`09-supershift-shift-planners.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/09-supershift-shift-planners.md))

- **Разработчик / Издател:** Supershift (supershift.app) & My Shift Planner
- **Официален уебсайт:** https://supershift.app/
- **Отчетени позиции в Semrush (US Desktop, 21.10.2026):** Не е проверен в Semrush Free Tier (Оценяван трафик: —)
- **Най-добра наблюдавана позиция в Google SERP (извадка 45 заявки):** #1 в 2 отделни Google заявки (shift и shifts2)
- **Споменавания в ChatGPT (извадка 15 промпта):** 1/15 промпта (shift — водещи специализирани приложения за смени)
- **Точен брой номерирани редове в таблицата по-долу (`N`):** **5** (`0` Semrush видими реда + `2` Google SERP собствен домейн/App Store + `0` Google SERP външни сравнения + `1` ChatGPT промпта + `2` предложения/кандидат-теми)

### 1. Защо този конкурент е включен (Доказателства спрямо Cloud Calendars)

Supershift държи #1 в Google SERP (App Store US) и #5 със собствения си домейн supershift.app за 'best shift work calendar app iPhone rotating schedule', както и #1 и #5 за 'shift calendar app export Apple Calendar', а в ChatGPT е препоръчан заедно с My Shift Planner като водещ специализиран инструмент за ротационни и нощни смени.

### 2. Статии и страници на конкурента, които описват тези теми

| № | Официален URL на конкурента | Заглавие и роля в проучването |
| :--- | :--- | :--- |
| 1 | `https://apps.apple.com/us/app/supershift-shift-calendar/id1104165041` | Supershift - Shift Calendar (App Store US) — Ранкира на #1 за 'shift' и #1 за 'shifts2' |
| 2 | `https://supershift.app/` | Supershift Official Website — Ранкира на #5 за 'shift'; документира експорт към iOS/Apple Calendar и ротационни шаблони |
| 3 | `https://apps.apple.com/us/app/work-shift-calendar-shifter/id1523513035` | Work Shift Calendar (Shifter) on App Store — Ранкира на #2 за 'shift' и #3 за 'shifts2' |

### 3. Наши статии в Cloud Calendars (`cloud-calendars.com`), които покриват темите

| № | Наш URL (`cloud-calendars.com/articles/...`) | Заглавие на нашата статия | Локален сорс файл |
| :--- | :--- | :--- | :--- |
| 1 | `https://www.cloud-calendars.com/articles/shift-work-calendar-iphone-rotating-schedules/` | **Shift-Work Calendars on iPhone: Rotating Schedules and Personal Events** | `src/app/content/en-US/articles-round2.ts` |
| 2 | `https://www.cloud-calendars.com/articles/calendar-export-ics-pdf-and-backup/` | **Calendar Export on iPhone: ICS, CSV, PDF, and Subscriptions** | `src/app/content/en-US/articles-accounts.ts` |

### 4. Пълна таблица на записаните заявки, промптове и кандидат-теми (Точно 5 номерирани реда)

> **Важно уточнение за произхода на данните:** Всеки ред по-долу има изрично обозначен тип доказателство (`[A]` Semrush US Desktop видима позиция, `[B1]` Google SERP Топ 10 собствен домейн/App Store, `[B2]` Google SERP Топ 10 външно сравнение, `[C]` ChatGPT потребителски промпт от извадката с 15 разговора, или `[D]` Предложение от Google Related Search / кандидат-тема от документация, което **не е** доказан ранк).

| № | Ключова дума / Заявка / Промпт | Категория доказателство | Детайли на наблюдението (Позиция / Обем / Източник) | Страница на конкурента | Наша целева статия (`cloud-calendars.com`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `best shift work calendar app iPhone rotating schedule` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #1 App Store & #5 supershift.app (queryId: shift) | `https://supershift.app/` | `/articles/shift-work-calendar-iphone-rotating-schedules/` |
| 2 | `shift calendar app export Apple Calendar` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #1 & #5 App Store Supershift, #3 Shifter (queryId: shifts2) | `https://apps.apple.com/us/app/supershift-shift-calendar/id1104165041` | `/articles/shift-work-calendar-iphone-rotating-schedules/` |
| 3 | `iPhone calendar apps suitable for rotating shift work and overnight shifts (promptId: shift)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчани специализирани приложения Supershift и My Shift Planner (chatgpt-shift.json) | `https://supershift.app/` | `/articles/shift-work-calendar-iphone-rotating-schedules/` |
| 4 | `best calendar app for nurses rotating shifts iphone` | **[D] Предложение / Кандидат-тема (не е ранк)** | Google Related Search (от all-discovered-classification.json — предложение, не е измерен ранк) | `https://supershift.app/` | `/articles/shift-work-calendar-iphone-rotating-schedules/` |
| 5 | `overnight shift crossing midnight calendar iphone` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от документацията за сменни графици и нощни смени | `https://supershift.app/` | `/articles/shift-work-calendar-iphone-rotating-schedules/` |

---

## #10 — Microsoft Outlook (Outlook for iOS) ([`10-microsoft-outlook.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/10-microsoft-outlook.md))

- **Разработчик / Издател:** Microsoft Corporation (support.microsoft.com / learn.microsoft.com)
- **Официален уебсайт:** https://support.microsoft.com/en-us/outlook
- **Отчетени позиции в Semrush (US Desktop, 21.10.2026):** Не е проверен в Semrush Free Tier (част от microsoft.com) (Оценяван трафик: — (поддомейн support.microsoft.com))
- **Най-добра наблюдавана позиция в Google SERP (извадка 45 заявки):** #1 (Собствен домейн learn.microsoft.com)
- **Споменавания в ChatGPT (извадка 15 промпта):** 3/15 като сравнявано приложение (combine, drag-edit, family) + 6/15 само като доставчик на акаунт
- **Точен брой номерирани редове в таблицата по-долу (`N`):** **7** (`0` Semrush видими реда + `1` Google SERP собствен домейн/App Store + `1` Google SERP външни сравнения + `3` ChatGPT промпта + `2` предложения/кандидат-теми)

### 1. Защо този конкурент е включен (Доказателства спрямо Cloud Calendars)

Официалните домейни на Microsoft (learn.microsoft.com и support.microsoft.com) заемат #1, #4 и #9 за 'iPhone calendar not syncing Google Outlook', а Outlook for iOS е разгледан като самостоятелно приложение в 3 от 15-те ChatGPT разговора (и в още 6 разговора като синхронизиран доставчик на календар).

### 2. Статии и страници на конкурента, които описват тези теми

| № | Официален URL на конкурента | Заглавие и роля в проучването |
| :--- | :--- | :--- |
| 1 | `https://learn.microsoft.com/en-us/answers/questions/5492026/outlook-ios-and-google-calendar-sync-issues` | Outlook iOS and Google calendar sync issues — Ранкира на #1 за 'sync' |
| 2 | `https://support.microsoft.com/en-us/outlook/can-t-sync-calendar-and-contacts-with-my-phone-or-tablet` | Can't sync calendar and contacts with my phone or tablet — Ранкира на #4 за 'sync' |
| 3 | `https://learn.microsoft.com/en-us/answers/questions/4745323/pc-outlook-calendar-not-syncing-to-iphone-outlook` | PC Outlook calendar not syncing to iPhone Outlook — Ранкира на #9 за 'sync' |

### 3. Наши статии в Cloud Calendars (`cloud-calendars.com`), които покриват темите

| № | Наш URL (`cloud-calendars.com/articles/...`) | Заглавие на нашата статия | Локален сорс файл |
| :--- | :--- | :--- | :--- |
| 1 | `https://www.cloud-calendars.com/articles/icloud-google-and-outlook-in-one-view/` | **iCloud, Google, and Outlook in One View** | `src/app/content/en-US/articles-accounts.ts` |
| 2 | `https://www.cloud-calendars.com/articles/when-an-event-fails-to-appear/` | **When an Event Fails to Appear** | `src/app/content/en-US/articles-accounts.ts` |
| 3 | `https://www.cloud-calendars.com/articles/work-and-personal-without-two-apps/` | **Work and Personal Without Two Apps** | `src/app/content/en-US/articles-accounts.ts` |

### 4. Пълна таблица на записаните заявки, промптове и кандидат-теми (Точно 7 номерирани реда)

> **Важно уточнение за произхода на данните:** Всеки ред по-долу има изрично обозначен тип доказателство (`[A]` Semrush US Desktop видима позиция, `[B1]` Google SERP Топ 10 собствен домейн/App Store, `[B2]` Google SERP Топ 10 външно сравнение, `[C]` ChatGPT потребителски промпт от извадката с 15 разговора, или `[D]` Предложение от Google Related Search / кандидат-тема от документация, което **не е** доказан ранк).

| № | Ключова дума / Заявка / Промпт | Категория доказателство | Детайли на наблюдението (Позиция / Обем / Източник) | Страница на конкурента | Наша целева статия (`cloud-calendars.com`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `iPhone calendar not syncing Google Outlook` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #1 & #9 learn.microsoft.com, #4 support.microsoft.com (queryId: sync) | `https://support.microsoft.com/en-us/outlook/can-t-sync-calendar-and-contacts-with-my-phone-or-tablet` | `/articles/when-an-event-fails-to-appear/` |
| 2 | `iPhone app combine iCloud Google Outlook calendars` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #1, #2, #3, #6, #7 Външни страници за обединяване с Outlook (queryId: combine) | `https://www.youtube.com/watch?v=y9WGtEFQOmM` | `/articles/icloud-google-and-outlook-in-one-view/` |
| 3 | `See iCloud, Google and Outlook calendars together (promptId: combine)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение (#4 Microsoft Outlook for iOS, chatgpt-combine.json) | `https://support.microsoft.com/en-us/outlook` | `/articles/icloud-google-and-outlook-in-one-view/` |
| 4 | `Drag appointments to reschedule on iPhone (promptId: drag-edit)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Разгледани ограничения на Outlook Mobile за повтарящи се събития (chatgpt-drag-edit.json) | `https://support.microsoft.com/en-us/outlook` | `/articles/drag-an-event-to-move-it/` |
| 5 | `Shared family calendar apps for iPhone and Android (promptId: family)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчана 5-та опция за Microsoft 365 домакинства (chatgpt-family.json) | `https://support.microsoft.com/en-us/outlook` | `/articles/cozi-timetree-family-calendar-iphone-android/` |
| 6 | `outlook calendar not syncing with iphone` | **[D] Предложение / Кандидат-тема (не е ранк)** | Google Related Search (от all-discovered-classification.json — предложение, не е измерен ранк) | `https://support.microsoft.com/en-us/outlook/can-t-sync-calendar-and-contacts-with-my-phone-or-tablet` | `/articles/when-an-event-fails-to-appear/` |
| 7 | `combine outlook and icloud calendar on iphone` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от документацията за Microsoft 365 / Exchange и iCloud в един изглед | `https://support.microsoft.com/en-us/outlook` | `/articles/icloud-google-and-outlook-in-one-view/` |

---

## #11 — BusyCal (BusyMac) ([`11-busycal.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/11-busycal.md))

- **Разработчик / Издател:** BusyMac LLC / Beehive Innovations (busymac.com)
- **Официален уебсайт:** https://www.busymac.com/busycalios/index.html
- **Отчетени позиции в Semrush (US Desktop, 21.10.2026):** Не е проверен в Semrush Free Tier (Оценяван трафик: —)
- **Най-добра наблюдавана позиция в Google SERP (извадка 45 заявки):** #1 (Собствен домейн busymac.com)
- **Споменавания в ChatGPT (извадка 15 промпта):** 2/15 промпта (live-activity, tasks)
- **Точен брой номерирани редове в таблицата по-долу (`N`):** **7** (`0` Semrush видими реда + `1` Google SERP собствен домейн/App Store + `2` Google SERP външни сравнения + `2` ChatGPT промпта + `2` предложения/кандидат-теми)

### 1. Защо този конкурент е включен (Доказателства спрямо Cloud Calendars)

BusyCal държи #1 със собствения си домейн busymac.com/compare/fantastical/ за 'BusyCal vs Fantastical iPhone calendar reminders weather', споменава се в 3 сравнителни заявки в Google и е препоръчан в 2 от 15-те ChatGPT разговора (за Live Activities на iOS и за интегрирани задачи/Reminders).

### 2. Статии и страници на конкурента, които описват тези теми

| № | Официален URL на конкурента | Заглавие и роля в проучването |
| :--- | :--- | :--- |
| 1 | `https://www.busymac.com/compare/fantastical/` | BusyCal vs Fantastical for Mac and iOS — Ранкира на #1 за 'busycal-comparison' |
| 2 | `https://www.busymac.com/busycalios/index.html` | BusyCal for iOS Product Overview — Официална страница за iPhone и iPad |
| 3 | `https://www.busymac.com/help/ug-ios/71509-accounts` | BusyCal iOS Accounts Help — Документация за iCloud, Google, Exchange, CalDAV |
| 4 | `https://www.busymac.com/help/ug-ios/71515-weather` | BusyCal iOS Weather Help — Документация за прогноза за времето в календара |
| 5 | `https://www.busymac.com/help/ug-ios/71525-widgets` | BusyCal iOS Widgets & Live Activities — Документация за джаджи и обратно броене |

### 3. Наши статии в Cloud Calendars (`cloud-calendars.com`), които покриват темите

| № | Наш URL (`cloud-calendars.com/articles/...`) | Заглавие на нашата статия | Локален сорс файл |
| :--- | :--- | :--- | :--- |
| 1 | `https://www.cloud-calendars.com/articles/fantastical-readdle-calendar366-iphone-comparison/` | **Fantastical, Calendars by Readdle, Calendar 366, and Cloud Calendars on iPhone** | `src/app/content/en-US/articles-round2.ts` |
| 2 | `https://www.cloud-calendars.com/articles/a-countdown-to-your-next-meeting/` | **A Countdown to Your Next Meeting (Live Activities)** | `src/app/content/en-US/articles-widgets.ts` |
| 3 | `https://www.cloud-calendars.com/articles/iphone-calendar-tasks-reminders-versus-event-alerts/` | **Tasks and Reminders in an iPhone Calendar vs. Event Alerts** | `src/app/content/en-US/articles-round2.ts` |

### 4. Пълна таблица на записаните заявки, промптове и кандидат-теми (Точно 7 номерирани реда)

> **Важно уточнение за произхода на данните:** Всеки ред по-долу има изрично обозначен тип доказателство (`[A]` Semrush US Desktop видима позиция, `[B1]` Google SERP Топ 10 собствен домейн/App Store, `[B2]` Google SERP Топ 10 външно сравнение, `[C]` ChatGPT потребителски промпт от извадката с 15 разговора, или `[D]` Предложение от Google Related Search / кандидат-тема от документация, което **не е** доказан ранк).

| № | Ключова дума / Заявка / Промпт | Категория доказателство | Детайли на наблюдението (Позиция / Обем / Източник) | Страница на конкурента | Наша целева статия (`cloud-calendars.com`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `BusyCal vs Fantastical iPhone calendar reminders weather` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #1 Собствен домейн busymac.com (queryId: busycal-comparison) | `https://www.busymac.com/compare/fantastical/` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 2 | `Calendar 366 vs Fantastical iPhone` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #5 Форумна дискусия BusyCal vs Fantastical (queryId: calendar366-comparison) | `https://talk.macpowerusers.com/t/exploring-busycal-vs-fantastical-in-2024/36673` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 3 | `Fantastical vs Calendars by Readdle Calendar 366 iPhone` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #5 Форумна дискусия BusyCal vs Fantastical (queryId: three-calendar-comparison) | `https://talk.macpowerusers.com/t/exploring-busycal-vs-fantastical-in-2024/36673` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 4 | `Live Activity or Dynamic Island countdown to next meeting (promptId: live-activity)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение за iOS Live Activities (chatgpt-live-activity.json) | `https://www.busymac.com/help/ug-ios/71525-widgets` | `/articles/a-countdown-to-your-next-meeting/` |
| 5 | `Show tasks and reminders alongside appointments (promptId: tasks)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение за задачи и Reminders (chatgpt-tasks.json) | `https://www.busymac.com/busycalios/index.html` | `/articles/iphone-calendar-tasks-reminders-versus-event-alerts/` |
| 6 | `busycal vs fantastical ios` | **[D] Предложение / Кандидат-тема (не е ранк)** | Google Related Search (от all-discovered-classification.json — предложение, не е измерен ранк) | `https://www.busymac.com/compare/fantastical/` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 7 | `busycal travel time and time zones ios` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от документацията на BusyCal за часови зони и време за пътуване | `https://www.busymac.com/busycalios/index.html` | `/articles/landing-in-another-time-zone/` |

---

## #12 — Any.do ([`12-anydo.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/12-anydo.md))

- **Разработчик / Издател:** Any.do Inc. (any.do / support.any.do)
- **Официален уебсайт:** https://www.any.do/calendar-app-for-iphone
- **Отчетени позиции в Semrush (US Desktop, 21.10.2026):** Не е проверен в Semrush Free Tier (Оценяван трафик: —)
- **Най-добра наблюдавана позиция в Google SERP (извадка 45 заявки):** #1, #2, #3, #4, #6, #8 (6 резултата от собствен домейн в Топ 10)
- **Споменавания в ChatGPT (извадка 15 промпта):** 0/15 в извадката
- **Точен брой номерирани редове в таблицата по-долу (`N`):** **3** (`0` Semrush видими реда + `1` Google SERP собствен домейн/App Store + `0` Google SERP външни сравнения + `0` ChatGPT промпта + `2` предложения/кандидат-теми)

### 1. Защо този конкурент е включен (Доказателства спрямо Cloud Calendars)

При заявката 'Any.do calendar iPhone Google iCloud sync' собствените домейни any.do и support.any.do заемат 6 от 9-те органични позиции в Топ 10 (#1, #2, #3, #4, #6 и #8), включително специализиран лендинг 'The Best Calendar App for iPhone' (any.do/calendar-app-for-iphone).

### 2. Статии и страници на конкурента, които описват тези теми

| № | Официален URL на конкурента | Заглавие и роля в проучването |
| :--- | :--- | :--- |
| 1 | `https://support.any.do/en/articles/8610622-getting-started-with-the-calendar-integration` | Getting Started with the Calendar Integration — Ранкира на #1 за 'anydo-calendar' (прегледана в round5-primary-checks.json) |
| 2 | `https://www.any.do/blog/how-to-sync-any-do-with-google-calendar-the-complete-2026-guide/` | How to Sync Any.do with Google Calendar: The Complete 2026 Guide — Ранкира на #2 за 'anydo-calendar' |
| 3 | `https://support.any.do/en/articles/8610074-how-to-sync-and-back-up-your-any-do-account` | How to sync and back up your Any.do account — Ранкира на #3 за 'anydo-calendar' |
| 4 | `https://www.any.do/calendar-app-for-iphone` | The Best Calendar App for iPhone (Any.do Landing Page) — Ранкира на #4 за 'anydo-calendar' |
| 5 | `https://www.any.do/blog/hack-how-to-share-your-any-do-calendar/` | Hack: How To Share Your Any.do Calendar — Ранкира на #8 за 'anydo-calendar' |

### 3. Наши статии в Cloud Calendars (`cloud-calendars.com`), които покриват темите

| № | Наш URL (`cloud-calendars.com/articles/...`) | Заглавие на нашата статия | Локален сорс файл |
| :--- | :--- | :--- | :--- |
| 1 | `https://www.cloud-calendars.com/articles/iphone-calendar-tasks-reminders-versus-event-alerts/` | **Tasks and Reminders in an iPhone Calendar vs. Event Alerts** | `src/app/content/en-US/articles-round2.ts` |
| 2 | `https://www.cloud-calendars.com/articles/what-calendar-sync-actually-does/` | **What Calendar Sync Actually Does** | `src/app/content/en-US/articles-accounts.ts` |

### 4. Пълна таблица на записаните заявки, промптове и кандидат-теми (Точно 3 номерирани реда)

> **Важно уточнение за произхода на данните:** Всеки ред по-долу има изрично обозначен тип доказателство (`[A]` Semrush US Desktop видима позиция, `[B1]` Google SERP Топ 10 собствен домейн/App Store, `[B2]` Google SERP Топ 10 външно сравнение, `[C]` ChatGPT потребителски промпт от извадката с 15 разговора, или `[D]` Предложение от Google Related Search / кандидат-тема от документация, което **не е** доказан ранк).

| № | Ключова дума / Заявка / Промпт | Категория доказателство | Детайли на наблюдението (Позиция / Обем / Източник) | Страница на конкурента | Наша целева статия (`cloud-calendars.com`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `Any.do calendar iPhone Google iCloud sync` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #1, #2, #3, #4, #6, #8 Собствени домейни support.any.do & any.do (queryId: anydo-calendar) | `https://support.any.do/en/articles/8610622-getting-started-with-the-calendar-integration` | `/articles/iphone-calendar-tasks-reminders-versus-event-alerts/` |
| 2 | `any.do calendar integration iphone native calendar` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от официалната документация на Any.do (разлика между мобилно четене на системния календар и десктоп интеграция) | `https://support.any.do/en/articles/8610622-getting-started-with-the-calendar-integration` | `/articles/iphone-calendar-tasks-reminders-versus-event-alerts/` |
| 3 | `combine to do list and calendar app iphone` | **[D] Предложение / Кандидат-тема (не е ранк)** | Google Related Search (от all-discovered-classification.json — предложение, не е измерен ранк) | `https://www.any.do/calendar-app-for-iphone` | `/articles/iphone-calendar-tasks-reminders-versus-event-alerts/` |

---

## #13 — Vimcal ([`13-vimcal.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/13-vimcal.md))

- **Разработчик / Издател:** Vimcal Inc. (vimcal.com)
- **Официален уебсайт:** https://www.vimcal.com/downloads/ios
- **Отчетени позиции в Semrush (US Desktop, 21.10.2026):** Не е проверен в Semrush Free Tier (Оценяван трафик: —)
- **Най-добра наблюдавана позиция в Google SERP (извадка 45 заявки):** #1, #2, #3, #4, #5, #7 (6 резултата от собствен домейн / App Store в Топ 10)
- **Споменавания в ChatGPT (извадка 15 промпта):** 0/15 в извадката
- **Точен брой номерирани редове в таблицата по-долу (`N`):** **3** (`0` Semrush видими реда + `1` Google SERP собствен домейн/App Store + `0` Google SERP външни сравнения + `0` ChatGPT промпта + `2` предложения/кандидат-теми)

### 1. Защо този конкурент е включен (Доказателства спрямо Cloud Calendars)

Vimcal доминира заявката за часови зони и споделяне на свободни слотове ('Vimcal iPhone calendar time zones availability') с 6 собствени резултата в Топ 10 (#1, #3, #4, #5 от vimcal.com и #2, #7 от App Store), позиционирайки се силно за booking links и международни срещи.

### 2. Статии и страници на конкурента, които описват тези теми

| № | Официален URL на конкурента | Заглавие и роля в проучването |
| :--- | :--- | :--- |
| 1 | `https://www.vimcal.com/blog/the-best-calendar-app-for-founders` | The Best Calendar App for Founders — Ранкира на #1 за 'vimcal-availability' |
| 2 | `https://apps.apple.com/us/app/vimcal-ai-calendar-schedule/id1608841561` | Vimcal: AI Calendar & Schedule (App Store US) — Ранкира на #2 за 'vimcal-availability' |
| 3 | `https://www.vimcal.com/downloads/ios` | Download Vimcal for iOS — Ранкира на #3 за 'vimcal-availability' (прегледана в round5-primary-checks.json) |
| 4 | `https://docs.vimcal.com/getting-started/account-setup` | Vimcal Account Setup Documentation — Официална документация за Google и Microsoft акаунти (прегледана в round5-primary-checks.json) |

### 3. Наши статии в Cloud Calendars (`cloud-calendars.com`), които покриват темите

| № | Наш URL (`cloud-calendars.com/articles/...`) | Заглавие на нашата статия | Локален сорс файл |
| :--- | :--- | :--- | :--- |
| 1 | `https://www.cloud-calendars.com/articles/booking-link-or-shared-calendar/` | **Booking Links vs. a Shared Calendar on iPhone** | `src/app/content/en-US/articles-round2.ts` |
| 2 | `https://www.cloud-calendars.com/articles/landing-in-another-time-zone/` | **Landing in Another Time Zone** | `src/app/content/en-US/articles-events.ts` |

### 4. Пълна таблица на записаните заявки, промптове и кандидат-теми (Точно 3 номерирани реда)

> **Важно уточнение за произхода на данните:** Всеки ред по-долу има изрично обозначен тип доказателство (`[A]` Semrush US Desktop видима позиция, `[B1]` Google SERP Топ 10 собствен домейн/App Store, `[B2]` Google SERP Топ 10 външно сравнение, `[C]` ChatGPT потребителски промпт от извадката с 15 разговора, или `[D]` Предложение от Google Related Search / кандидат-тема от документация, което **не е** доказан ранк).

| № | Ключова дума / Заявка / Промпт | Категория доказателство | Детайли на наблюдението (Позиция / Обем / Източник) | Страница на конкурента | Наша целева статия (`cloud-calendars.com`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `Vimcal iPhone calendar time zones availability` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #1, #3, #4, #5 vimcal.com & #2, #7 App Store (queryId: vimcal-availability) | `https://www.vimcal.com/downloads/ios` | `/articles/booking-link-or-shared-calendar/` |
| 2 | `share availability slots time zones iphone calendar` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от официалната документация на Vimcal за iOS (round5-primary-checks.json) | `https://www.vimcal.com/downloads/ios` | `/articles/booking-link-or-shared-calendar/` |
| 3 | `booking link vs shared calendar availability` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от сравнението между линкове за резервации и споделени календари | `https://docs.vimcal.com/getting-started/account-setup` | `/articles/booking-link-or-shared-calendar/` |

---

## #14 — Amie ([`14-amie.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/14-amie.md))

- **Разработчик / Издател:** Amie (amie.so)
- **Официален уебсайт:** https://amie.so/
- **Отчетени позиции в Semrush (US Desktop, 21.10.2026):** Не е проверен в Semrush Free Tier (Оценяван трафик: —)
- **Най-добра наблюдавана позиция в Google SERP (извадка 45 заявки):** #1, #2, #3 (3 резултата от собствен домейн / App Store в Топ 10)
- **Споменавания в ChatGPT (извадка 15 промпта):** 0/15 в извадката
- **Точен брой номерирани редове в таблицата по-долу (`N`):** **3** (`0` Semrush видими реда + `1` Google SERP собствен домейн/App Store + `0` Google SERP външни сравнения + `0` ChatGPT промпта + `2` предложения/кандидат-теми)

### 1. Защо този конкурент е включен (Доказателства спрямо Cloud Calendars)

Amie държи първите три места (#1 amie.so, #2 App Store, #3 amie.so/documentation/google-calendar-integration) за 'Amie Google Calendar tasks scheduling iPhone', съчетавайки календар, задачи (todos) и бележки от срещи.

### 2. Статии и страници на конкурента, които описват тези теми

| № | Официален URL на конкурента | Заглавие и роля в проучването |
| :--- | :--- | :--- |
| 1 | `https://amie.so/` | Amie Official Website — Ранкира на #1 за 'amie-calendar' |
| 2 | `https://apps.apple.com/us/app/amie-todos-calendar/id1548277133` | Amie - Todos, calendar (App Store US) — Ранкира на #2 за 'amie-calendar' |
| 3 | `https://amie.so/documentation/google-calendar-integration` | Google Calendar Integration - Amie Documentation — Ранкира на #3 за 'amie-calendar' (прегледана в round5-primary-checks.json) |

### 3. Наши статии в Cloud Calendars (`cloud-calendars.com`), които покриват темите

| № | Наш URL (`cloud-calendars.com/articles/...`) | Заглавие на нашата статия | Локален сорс файл |
| :--- | :--- | :--- | :--- |
| 1 | `https://www.cloud-calendars.com/articles/automatic-time-blocking-versus-manual-calendar/` | **Automatic Time Blocking vs. a Manual Calendar on iPhone** | `src/app/content/en-US/articles-round2.ts` |
| 2 | `https://www.cloud-calendars.com/articles/iphone-calendar-tasks-reminders-versus-event-alerts/` | **Tasks and Reminders in an iPhone Calendar vs. Event Alerts** | `src/app/content/en-US/articles-round2.ts` |

### 4. Пълна таблица на записаните заявки, промптове и кандидат-теми (Точно 3 номерирани реда)

> **Важно уточнение за произхода на данните:** Всеки ред по-долу има изрично обозначен тип доказателство (`[A]` Semrush US Desktop видима позиция, `[B1]` Google SERP Топ 10 собствен домейн/App Store, `[B2]` Google SERP Топ 10 външно сравнение, `[C]` ChatGPT потребителски промпт от извадката с 15 разговора, или `[D]` Предложение от Google Related Search / кандидат-тема от документация, което **не е** доказан ранк).

| № | Ключова дума / Заявка / Промпт | Категория доказателство | Детайли на наблюдението (Позиция / Обем / Източник) | Страница на конкурента | Наша целева статия (`cloud-calendars.com`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `Amie Google Calendar tasks scheduling iPhone` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #1 & #3 amie.so, #2 App Store (queryId: amie-calendar) | `https://amie.so/documentation/google-calendar-integration` | `/articles/automatic-time-blocking-versus-manual-calendar/` |
| 2 | `amie google calendar integration recurring events` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от документацията на Amie (round5-primary-checks.json) | `https://amie.so/documentation/google-calendar-integration` | `/articles/automatic-time-blocking-versus-manual-calendar/` |
| 3 | `schedule todos on google calendar iphone` | **[D] Предложение / Кандидат-тема (не е ранк)** | Google Related Search (от all-discovered-classification.json — предложение, не е измерен ранк) | `https://amie.so/documentation/google-calendar-integration` | `/articles/iphone-calendar-tasks-reminders-versus-event-alerts/` |

---

## #15 — Structured — Daily Planner ([`15-structured.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/15-structured.md))

- **Разработчик / Издател:** unstructured GmbH (structured.app)
- **Официален уебсайт:** https://structured.app/
- **Отчетени позиции в Semrush (US Desktop, 21.10.2026):** Не е проверен в Semrush Free Tier (Оценяван трафик: —)
- **Най-добра наблюдавана позиция в Google SERP (извадка 45 заявки):** #2 (Официален App Store листинг за 'timeblocking')
- **Споменавания в ChatGPT (извадка 15 промпта):** 2/15 промпта (auto-scheduling, live-activity)
- **Точен брой номерирани редове в таблицата по-долу (`N`):** **5** (`0` Semrush видими реда + `1` Google SERP собствен домейн/App Store + `0` Google SERP външни сравнения + `2` ChatGPT промпта + `2` предложения/кандидат-теми)

### 1. Защо този конкурент е включен (Доказателства спрямо Cloud Calendars)

Structured се класира на #2 в Google SERP (App Store) за висококонкурентната заявка 'best time blocking calendar app iPhone' и е препоръчан в 2 от 15-те ChatGPT разговора — за визуален дневен тайм-блокинг и за Live Activities на iPhone.

### 2. Статии и страници на конкурента, които описват тези теми

| № | Официален URL на конкурента | Заглавие и роля в проучването |
| :--- | :--- | :--- |
| 1 | `https://apps.apple.com/ph/app/structured-daily-planner-todo/id1499198946` | Structured: Daily Planner Todo (App Store) — Ранкира на #2 за 'timeblocking' |
| 2 | `https://help.structured.app/en/articles/559110` | How to Sync Your Calendars with Structured — Официална документация за импорт от системния календар |
| 3 | `https://help.structured.app/en/articles/559135` | How to Sync Your Reminders with Structured — Официална документация за Apple Reminders |
| 4 | `https://help.structured.app/en/articles/723128` | Live Activities & Dynamic Island in Structured — Официална документация за обратно броене до текуща/следваща задача |

### 3. Наши статии в Cloud Calendars (`cloud-calendars.com`), които покриват темите

| № | Наш URL (`cloud-calendars.com/articles/...`) | Заглавие на нашата статия | Локален сорс файл |
| :--- | :--- | :--- | :--- |
| 1 | `https://www.cloud-calendars.com/articles/automatic-time-blocking-versus-manual-calendar/` | **Automatic Time Blocking vs. a Manual Calendar on iPhone** | `src/app/content/en-US/articles-round2.ts` |
| 2 | `https://www.cloud-calendars.com/articles/a-countdown-to-your-next-meeting/` | **A Countdown to Your Next Meeting (Live Activities)** | `src/app/content/en-US/articles-widgets.ts` |
| 3 | `https://www.cloud-calendars.com/articles/weekly-schedule-builder/` | **Weekly Schedule Builder** | `src/app/content/en-US/articles-round7.ts` |

### 4. Пълна таблица на записаните заявки, промптове и кандидат-теми (Точно 5 номерирани реда)

> **Важно уточнение за произхода на данните:** Всеки ред по-долу има изрично обозначен тип доказателство (`[A]` Semrush US Desktop видима позиция, `[B1]` Google SERP Топ 10 собствен домейн/App Store, `[B2]` Google SERP Топ 10 външно сравнение, `[C]` ChatGPT потребителски промпт от извадката с 15 разговора, или `[D]` Предложение от Google Related Search / кандидат-тема от документация, което **не е** доказан ранк).

| № | Ключова дума / Заявка / Промпт | Категория доказателство | Детайли на наблюдението (Позиция / Обем / Източник) | Страница на конкурента | Наша целева статия (`cloud-calendars.com`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `best time blocking calendar app iPhone` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #2 Официален App Store листинг (queryId: timeblocking) | `https://apps.apple.com/ph/app/structured-daily-planner-todo/id1499198946` | `/articles/automatic-time-blocking-versus-manual-calendar/` |
| 2 | `Planning apps that automatically reschedule tasks vs manual time blocking (promptId: auto-scheduling)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Сравнено приложение за визуален ръчен тайм-блокинг (chatgpt-auto-scheduling.json) | `https://help.structured.app/en/articles/559110` | `/articles/automatic-time-blocking-versus-manual-calendar/` |
| 3 | `Live Activity or Dynamic Island countdown to next meeting (promptId: live-activity)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение за Live Activities (chatgpt-live-activity.json) | `https://help.structured.app/en/articles/723128` | `/articles/a-countdown-to-your-next-meeting/` |
| 4 | `visual daily planner timeline iphone` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от документацията на Structured за визуална дневна линия | `https://help.structured.app/en/articles/559110` | `/articles/automatic-time-blocking-versus-manual-calendar/` |
| 5 | `structured app apple reminders sync` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от документацията на Structured (help.structured.app/en/articles/559135) | `https://help.structured.app/en/articles/559135` | `/articles/iphone-calendar-tasks-reminders-versus-event-alerts/` |

---

## #16 — Cozi Family Organizer ([`16-cozi.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/16-cozi.md))

- **Разработчик / Издател:** Cozi Inc. (cozi.com)
- **Официален уебсайт:** https://www.cozi.com/
- **Отчетени позиции в Semrush (US Desktop, 21.10.2026):** Не е проверен в Semrush Free Tier (Оценяван трафик: —)
- **Най-добра наблюдавана позиция в Google SERP (извадка 45 заявки):** #4 (Собствен домейн cozi.com за 'family')
- **Споменавания в ChatGPT (извадка 15 промпта):** 2/15 промпта (family, household-display)
- **Точен брой номерирани редове в таблицата по-долу (`N`):** **7** (`0` Semrush видими реда + `1` Google SERP собствен домейн/App Store + `2` Google SERP външни сравнения + `2` ChatGPT промпта + `2` предложения/кандидат-теми)

### 1. Защо този конкурент е включен (Доказателства спрямо Cloud Calendars)

Cozi се класира на #4 със собствения си домейн cozi.com за 'best shared family calendar app iPhone Android', присъства в 2 сравнителни заявки ('Cozi alternative' и 'Cozi vs TimeTree') и е препоръчан в 2 от 15-те ChatGPT разговора (за семейна координация и за семеен дисплей на iPad).

### 2. Статии и страници на конкурента, които описват тези теми

| № | Официален URL на конкурента | Заглавие и роля в проучването |
| :--- | :--- | :--- |
| 1 | `https://www.cozi.com/` | Cozi Family Calendar & Organizer App — Ранкира на #4 за 'family' |
| 2 | `https://www.cozi.com/calendar/` | Cozi Shared Family Calendar Features — Официална продуктова страница за цветно кодиране по членове на семейството |
| 3 | `https://www.cozi.com/support/using-other-calendars-with-cozi/` | Using Other Calendars with Cozi — Официална документация за ограниченията при синхронизация с Apple/Google/Outlook |

### 3. Наши статии в Cloud Calendars (`cloud-calendars.com`), които покриват темите

| № | Наш URL (`cloud-calendars.com/articles/...`) | Заглавие на нашата статия | Локален сорс файл |
| :--- | :--- | :--- | :--- |
| 1 | `https://www.cloud-calendars.com/articles/cozi-timetree-family-calendar-iphone-android/` | **Shared Family Calendars Across iPhone and Android: Cozi, TimeTree, and Provider Calendars** | `src/app/content/en-US/articles-round2.ts` |
| 2 | `https://www.cloud-calendars.com/articles/family-pickup-calendar-handoff/` | **Coordinating School Pickups and Family Handoffs on a Shared Calendar** | `src/app/content/en-US/articles-sharing.ts` |
| 3 | `https://www.cloud-calendars.com/articles/ipad-family-calendar-display-skylight-dakboard/` | **Using an iPad as a Shared Family Calendar Display vs. Dedicated Hardware** | `src/app/content/en-US/articles-round4.ts` |

### 4. Пълна таблица на записаните заявки, промптове и кандидат-теми (Точно 7 номерирани реда)

> **Важно уточнение за произхода на данните:** Всеки ред по-долу има изрично обозначен тип доказателство (`[A]` Semrush US Desktop видима позиция, `[B1]` Google SERP Топ 10 собствен домейн/App Store, `[B2]` Google SERP Топ 10 външно сравнение, `[C]` ChatGPT потребителски промпт от извадката с 15 разговора, или `[D]` Предложение от Google Related Search / кандидат-тема от документация, което **не е** доказан ранк).

| № | Ключова дума / Заявка / Промпт | Категория доказателство | Детайли на наблюдението (Позиция / Обем / Източник) | Страница на конкурента | Наша целева статия (`cloud-calendars.com`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `best shared family calendar app iPhone Android` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #4 Собствен домейн cozi.com (queryId: family) | `https://www.cozi.com/` | `/articles/cozi-timetree-family-calendar-iphone-android/` |
| 2 | `Cozi alternative shared calendar iPhone` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #1, #5, #7 Външни сравнения за алтернативи на Cozi (queryId: cozi-brand) | `https://remindher.app/cozi-alternatives/` | `/articles/cozi-timetree-family-calendar-iphone-android/` |
| 3 | `Cozi vs TimeTree external calendar sync` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #2–#9 Външни сравнения Cozi vs TimeTree (queryId: family-external-sync) | `https://lighthouse.mapquest.com/blog/cozi-vs-timetree/` | `/articles/cozi-timetree-family-calendar-iphone-android/` |
| 4 | `Shared family calendar apps for iPhone and Android household (promptId: family)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение за семеен календар и списъци (chatgpt-family.json) | `https://www.cozi.com/calendar/` | `/articles/cozi-timetree-family-calendar-iphone-android/` |
| 5 | `Use an iPad as a shared family calendar display (promptId: household-display)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Споменато приложение за семеен календар и интеграция с хардуерни дисплеи (chatgpt-household-display.json) | `https://www.cozi.com/support/using-other-calendars-with-cozi/` | `/articles/ipad-family-calendar-display-skylight-dakboard/` |
| 6 | `cozi external calendar sync limitations` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от официалната документация на Cozi (cozi.com/support/using-other-calendars-with-cozi/) | `https://www.cozi.com/support/using-other-calendars-with-cozi/` | `/articles/cozi-timetree-family-calendar-iphone-android/` |
| 7 | `free cozi alternative shared family calendar` | **[D] Предложение / Кандидат-тема (не е ранк)** | Google Related Search (от all-discovered-classification.json — предложение, не е измерен ранк) | `https://www.cozi.com/` | `/articles/cozi-timetree-family-calendar-iphone-android/` |

---

## #17 — OneCal ([`17-onecal.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/17-onecal.md))

- **Разработчик / Издател:** OneCal Inc. (onecal.io)
- **Официален уебсайт:** https://www.onecal.io/
- **Отчетени позиции в Semrush (US Desktop, 21.10.2026):** Не е проверен в Semrush Free Tier (Оценяван трафик: —)
- **Най-добра наблюдавана позиция в Google SERP (извадка 45 заявки):** #2 (Собствен домейн onecal.io за 'combine')
- **Споменавания в ChatGPT (извадка 15 промпта):** 0/15 в извадката (след премахване на фалшивото съвпадение с 'OneCalendar' в free-sync)
- **Точен брой номерирани редове в таблицата по-долу (`N`):** **3** (`0` Semrush видими реда + `1` Google SERP собствен домейн/App Store + `0` Google SERP външни сравнения + `0` ChatGPT промпта + `2` предложения/кандидат-теми)

### 1. Защо този конкурент е включен (Доказателства спрямо Cloud Calendars)

OneCal държи #2 в Google SERP със собствения си домейн onecal.io за стратегическата ни заявка 'iPhone app combine iCloud Google Outlook calendars' и притежава задълбочена документация за сървърно клониране на заети слотове (busy-time blockers) между служебни и лични календари.

### 2. Статии и страници на конкурента, които описват тези теми

| № | Официален URL на конкурента | Заглавие и роля в проучването |
| :--- | :--- | :--- |
| 1 | `https://www.onecal.io/` | OneCal: Sync Multiple Google, Outlook & iCloud Calendars — Ранкира на #2 за 'combine' |
| 2 | `https://www.onecal.io/calendar-sync` | OneCal Calendar Sync Feature Page — Официална документация за двупосочно клониране на заетост и маскиране на детайли |
| 3 | `https://www.onecal.io/blog/how-to-sync-icloud-calendar-with-google-calendar` | How to Sync iCloud Calendar with Google Calendar — Официално ръководство за iCloud ↔ Google |
| 4 | `https://www.onecal.io/blog/how-to-sync-outlook-and-apple-icloud-calendars` | How to Sync Outlook and Apple iCloud Calendars — Официално ръководство за Outlook ↔ iCloud |

### 3. Наши статии в Cloud Calendars (`cloud-calendars.com`), които покриват темите

| № | Наш URL (`cloud-calendars.com/articles/...`) | Заглавие на нашата статия | Локален сорс файл |
| :--- | :--- | :--- | :--- |
| 1 | `https://www.cloud-calendars.com/articles/icloud-google-and-outlook-in-one-view/` | **iCloud, Google, and Outlook in One View** | `src/app/content/en-US/articles-accounts.ts` |
| 2 | `https://www.cloud-calendars.com/articles/what-calendar-sync-actually-does/` | **What Calendar Sync Actually Does** | `src/app/content/en-US/articles-accounts.ts` |
| 3 | `https://www.cloud-calendars.com/articles/work-and-personal-without-two-apps/` | **Work and Personal Without Two Apps** | `src/app/content/en-US/articles-accounts.ts` |

### 4. Пълна таблица на записаните заявки, промптове и кандидат-теми (Точно 3 номерирани реда)

> **Важно уточнение за произхода на данните:** Всеки ред по-долу има изрично обозначен тип доказателство (`[A]` Semrush US Desktop видима позиция, `[B1]` Google SERP Топ 10 собствен домейн/App Store, `[B2]` Google SERP Топ 10 външно сравнение, `[C]` ChatGPT потребителски промпт от извадката с 15 разговора, или `[D]` Предложение от Google Related Search / кандидат-тема от документация, което **не е** доказан ранк).

| № | Ключова дума / Заявка / Промпт | Категория доказателство | Детайли на наблюдението (Позиция / Обем / Източник) | Страница на конкурента | Наша целева статия (`cloud-calendars.com`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `iPhone app combine iCloud Google Outlook calendars` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #2 Собствен домейн onecal.io (queryId: combine) | `https://www.onecal.io/` | `/articles/icloud-google-and-outlook-in-one-view/` |
| 2 | `sync multiple google and outlook calendars busy time` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от документацията на OneCal (разлика между единен локален изглед и сървърно копиране на busy блокове) | `https://www.onecal.io/calendar-sync` | `/articles/icloud-google-and-outlook-in-one-view/` |
| 3 | `clone calendar events without sharing details` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от документацията на OneCal за поверителност при служебен/личен календар | `https://www.onecal.io/calendar-sync` | `/articles/work-and-personal-without-two-apps/` |

---

## #18 — CalendarBridge ([`18-calendarbridge.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/18-calendarbridge.md))

- **Разработчик / Издател:** CalendarBridge (calendarbridge.com)
- **Официален уебсайт:** https://calendarbridge.com/
- **Отчетени позиции в Semrush (US Desktop, 21.10.2026):** Не е проверен в Semrush Free Tier (Оценяван трафик: —)
- **Най-добра наблюдавана позиция в Google SERP (извадка 45 заявки):** #3 (Собствен домейн calendarbridge.com за 'combine')
- **Споменавания в ChatGPT (извадка 15 промпта):** 0/15 в извадката
- **Точен брой номерирани редове в таблицата по-долу (`N`):** **3** (`0` Semrush видими реда + `1` Google SERP собствен домейн/App Store + `0` Google SERP външни сравнения + `0` ChatGPT промпта + `2` предложения/кандидат-теми)

### 1. Защо този конкурент е включен (Доказателства спрямо Cloud Calendars)

CalendarBridge се класира на #3 в Google SERP със собствения си домейн calendarbridge.com за 'iPhone app combine iCloud Google Outlook calendars' (веднага след Sync2 и OneCal), където Cloud Calendars не е в Топ 10.

### 2. Статии и страници на конкурента, които описват тези теми

| № | Официален URL на конкурента | Заглавие и роля в проучването |
| :--- | :--- | :--- |
| 1 | `https://calendarbridge.com/` | Sync Google, Outlook, & iCloud Calendars with CalendarBridge — Ранкира на #3 за 'combine' |
| 2 | `https://calendarbridge.com/calendar-sync/` | CalendarBridge Real-Time Calendar Sync — Официална продуктова страница за синхронизиране на заетост |
| 3 | `https://calendarbridge.com/unified-calendar/` | CalendarBridge Unified Calendar View — Официална документация за обединен календар |
| 4 | `https://calendarbridge.com/scheduler/` | CalendarBridge Scheduler (Booking Links) — Официална документация за линкове за резервации през множество акаунти |

### 3. Наши статии в Cloud Calendars (`cloud-calendars.com`), които покриват темите

| № | Наш URL (`cloud-calendars.com/articles/...`) | Заглавие на нашата статия | Локален сорс файл |
| :--- | :--- | :--- | :--- |
| 1 | `https://www.cloud-calendars.com/articles/icloud-google-and-outlook-in-one-view/` | **iCloud, Google, and Outlook in One View** | `src/app/content/en-US/articles-accounts.ts` |
| 2 | `https://www.cloud-calendars.com/articles/booking-link-or-shared-calendar/` | **Booking Links vs. a Shared Calendar on iPhone** | `src/app/content/en-US/articles-round2.ts` |
| 3 | `https://www.cloud-calendars.com/articles/what-calendar-sync-actually-does/` | **What Calendar Sync Actually Does** | `src/app/content/en-US/articles-accounts.ts` |

### 4. Пълна таблица на записаните заявки, промптове и кандидат-теми (Точно 3 номерирани реда)

> **Важно уточнение за произхода на данните:** Всеки ред по-долу има изрично обозначен тип доказателство (`[A]` Semrush US Desktop видима позиция, `[B1]` Google SERP Топ 10 собствен домейн/App Store, `[B2]` Google SERP Топ 10 външно сравнение, `[C]` ChatGPT потребителски промпт от извадката с 15 разговора, или `[D]` Предложение от Google Related Search / кандидат-тема от документация, което **не е** доказан ранк).

| № | Ключова дума / Заявка / Промпт | Категория доказателство | Детайли на наблюдението (Позиция / Обем / Източник) | Страница на конкурента | Наша целева статия (`cloud-calendars.com`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `iPhone app combine iCloud Google Outlook calendars` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #3 Собствен домейн calendarbridge.com (queryId: combine) | `https://calendarbridge.com/` | `/articles/icloud-google-and-outlook-in-one-view/` |
| 2 | `unified calendar view vs calendar sync` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от документацията на CalendarBridge (calendarbridge.com/unified-calendar/) | `https://calendarbridge.com/unified-calendar/` | `/articles/icloud-google-and-outlook-in-one-view/` |
| 3 | `multi calendar booking link availability` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от документацията на CalendarBridge Scheduler | `https://calendarbridge.com/scheduler/` | `/articles/booking-link-or-shared-calendar/` |

---

## #19 — Timepage (by Moleskine Studio) ([`19-timepage-moleskine.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/19-timepage-moleskine.md))

- **Разработчик / Издател:** Moleskine Srl (moleskine.com / help.moleskinestudio.com)
- **Официален уебсайт:** https://www.moleskine.com/en-us/shop/moleskine-studio/timepage/
- **Отчетени позиции в Semrush (US Desktop, 21.10.2026):** Не е проверен в Semrush Free Tier (Оценяван трафик: —)
- **Най-добра наблюдавана позиция в Google SERP (извадка 45 заявки):** #3 (Официален App Store листинг за 'weather-de')
- **Споменавания в ChatGPT (извадка 15 промпта):** 1/15 промпта (ipad — препоръчано за iPad месечен heatmap и време)
- **Точен брой номерирани редове в таблицата по-долу (`N`):** **4** (`0` Semrush видими реда + `1` Google SERP собствен домейн/App Store + `0` Google SERP външни сравнения + `1` ChatGPT промпта + `2` предложения/кандидат-теми)

### 1. Защо този конкурент е включен (Доказателства спрямо Cloud Calendars)

Timepage се класира на #3 в Google SERP (App Store) за немската заявка 'Kalender App iPhone Wetter Termine' и е препоръчан в ChatGPT ('ipad') заради своя месечен heatmap изглед, седмичен сплит-екран и почасова прогноза за времето и валежите.

### 2. Статии и страници на конкурента, които описват тези теми

| № | Официален URL на конкурента | Заглавие и роля в проучването |
| :--- | :--- | :--- |
| 1 | `https://apps.apple.com/lu/app/timepage-kalender-und-planer/id989178902?l=de-DE` | Timepage: Kalender und Planer (App Store DE) — Ранкира на #3 за 'weather-de' |
| 2 | `https://www.moleskine.com/en-us/shop/moleskine-studio/timepage/` | Moleskine Studio Timepage Official Page — Официална продуктова страница |
| 3 | `https://help.moleskinestudio.com/hc/en-us/articles/115001918432-Weather` | Timepage Weather Help — Официална документация за температура, вятър и валежи |
| 4 | `https://help.moleskinestudio.com/hc/en-us/articles/115001918292-Calendar-Syncing` | Timepage Calendar Syncing — Официална документация за използване на системните iOS акаунти |

### 3. Наши статии в Cloud Calendars (`cloud-calendars.com`), които покриват темите

| № | Наш URL (`cloud-calendars.com/articles/...`) | Заглавие на нашата статия | Локален сорс файл |
| :--- | :--- | :--- | :--- |
| 1 | `https://www.cloud-calendars.com/articles/month-view-on-a-bigger-screen/` | **Month View on a Bigger Screen (iPad)** | `src/app/content/en-US/articles-views.ts` |
| 2 | `https://www.cloud-calendars.com/articles/weather-inside-your-calendar/` | **Weather Inside Your Calendar** | `src/app/content/en-US/articles-weather.ts` |
| 3 | `https://www.cloud-calendars.com/articles/reading-a-chance-of-rain/` | **Reading a Chance of Rain** | `src/app/content/en-US/articles-weather.ts` |

### 4. Пълна таблица на записаните заявки, промптове и кандидат-теми (Точно 4 номерирани реда)

> **Важно уточнение за произхода на данните:** Всеки ред по-долу има изрично обозначен тип доказателство (`[A]` Semrush US Desktop видима позиция, `[B1]` Google SERP Топ 10 собствен домейн/App Store, `[B2]` Google SERP Топ 10 външно сравнение, `[C]` ChatGPT потребителски промпт от извадката с 15 разговора, или `[D]` Предложение от Google Related Search / кандидат-тема от документация, което **не е** доказан ранк).

| № | Ключова дума / Заявка / Промпт | Категория доказателство | Детайли на наблюдението (Позиция / Обем / Източник) | Страница на конкурента | Наша целева статия (`cloud-calendars.com`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `Kalender App iPhone Wetter Termine` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #3 Официален App Store листинг (queryId: weather-de) | `https://apps.apple.com/lu/app/timepage-kalender-und-planer/id989178902?l=de-DE` | `/articles/weather-inside-your-calendar/` |
| 2 | `iPad calendar apps with useful month and week views with weather (promptId: ipad)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение за iPad с heatmap и прогноза за времето (chatgpt-ipad.json) | `https://help.moleskinestudio.com/hc/en-us/articles/115001918432-Weather` | `/articles/month-view-on-a-bigger-screen/` |
| 3 | `ipad calendar heatmap month view weather` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от документацията на Timepage за iPad изгледи и прогноза за времето | `https://help.moleskinestudio.com/hc/en-us/articles/115001918432-Weather` | `/articles/month-view-on-a-bigger-screen/` |
| 4 | `timepage vs fantastical weather calendar` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от позиционирането на Timepage за дизайн и метео прогноза | `https://www.moleskine.com/en-us/shop/moleskine-studio/timepage/` | `/articles/weather-inside-your-calendar/` |

---

## #20 — Notion Calendar (formerly Cron) ([`20-notion-calendar.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/20-notion-calendar.md))

- **Разработчик / Издател:** Notion Labs, Inc. (notion.com/product/calendar)
- **Официален уебсайт:** https://www.notion.com/product/calendar
- **Отчетени позиции в Semrush (US Desktop, 21.10.2026):** Не е проверен в Semrush Free Tier (част от notion.com) (Оценяван трафик: — (поддомейн notion.com))
- **Най-добра наблюдавана позиция в Google SERP (извадка 45 заявки):** #8 (Собствен домейн notion.com за 'combine')
- **Споменавания в ChatGPT (извадка 15 промпта):** 0/15 в извадката
- **Точен брой номерирани редове в таблицата по-долу (`N`):** **3** (`0` Semrush видими реда + `1` Google SERP собствен домейн/App Store + `0` Google SERP външни сравнения + `0` ChatGPT промпта + `2` предложения/кандидат-теми)

### 1. Защо този конкурент е включен (Доказателства спрямо Cloud Calendars)

Официалната продуктова страница на Notion Calendar (notion.com/product/calendar) се класира в Топ 10 (#8) за ключовата ни заявка 'iPhone app combine iCloud Google Outlook calendars', където нашият домейн все още не е в Топ 10.

### 2. Статии и страници на конкурента, които описват тези теми

| № | Официален URL на конкурента | Заглавие и роля в проучването |
| :--- | :--- | :--- |
| 1 | `https://www.notion.com/product/calendar` | Notion Calendar Product Page — Ранкира на #8 за 'combine' |
| 2 | `https://www.notion.com/help/calendar` | Notion Calendar Help & Account Connections — Официална документация за Google/iCloud/Notion бази данни |

### 3. Наши статии в Cloud Calendars (`cloud-calendars.com`), които покриват темите

| № | Наш URL (`cloud-calendars.com/articles/...`) | Заглавие на нашата статия | Локален сорс файл |
| :--- | :--- | :--- | :--- |
| 1 | `https://www.cloud-calendars.com/articles/icloud-google-and-outlook-in-one-view/` | **iCloud, Google, and Outlook in One View** | `src/app/content/en-US/articles-accounts.ts` |
| 2 | `https://www.cloud-calendars.com/articles/booking-link-or-shared-calendar/` | **Booking Links vs. a Shared Calendar on iPhone** | `src/app/content/en-US/articles-round2.ts` |

### 4. Пълна таблица на записаните заявки, промптове и кандидат-теми (Точно 3 номерирани реда)

> **Важно уточнение за произхода на данните:** Всеки ред по-долу има изрично обозначен тип доказателство (`[A]` Semrush US Desktop видима позиция, `[B1]` Google SERP Топ 10 собствен домейн/App Store, `[B2]` Google SERP Топ 10 външно сравнение, `[C]` ChatGPT потребителски промпт от извадката с 15 разговора, или `[D]` Предложение от Google Related Search / кандидат-тема от документация, което **не е** доказан ранк).

| № | Ключова дума / Заявка / Промпт | Категория доказателство | Детайли на наблюдението (Позиция / Обем / Източник) | Страница на конкурента | Наша целева статия (`cloud-calendars.com`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `iPhone app combine iCloud Google Outlook calendars` | **[B1] Google SERP (Собствен домейн / App Store)** | Google SERP (45 заявки): #8 Собствен домейн notion.com (queryId: combine) | `https://www.notion.com/product/calendar` | `/articles/icloud-google-and-outlook-in-one-view/` |
| 2 | `notion calendar icloud outlook support iphone` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от документацията на Notion Calendar за поддържани доставчици на календари | `https://www.notion.com/help/calendar` | `/articles/icloud-google-and-outlook-in-one-view/` |
| 3 | `notion calendar availability scheduling link` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от документацията на Notion Calendar за споделяне на свободни часове | `https://www.notion.com/help/calendar` | `/articles/booking-link-or-shared-calendar/` |

---

## #21 — Skylight Calendar & DAKboard (Family Wall Displays) ([`21-skylight-dakboard.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/21-skylight-dakboard.md))

- **Разработчик / Издател:** Skylight (myskylight.com) & DAKboard (dakboard.com)
- **Официален уебсайт:** https://myskylight.com/pages/calendar-features/ | https://dakboard.com/site
- **Отчетени позиции в Semrush (US Desktop, 21.10.2026):** Не е проверен в Semrush Free Tier (Оценяван трафик: —)
- **Най-добра наблюдавана позиция в Google SERP (извадка 45 заявки):** #1, #4, #5 (Външни сравнения за Skylight алтернативи на iPad)
- **Споменавания в ChatGPT (извадка 15 промпта):** 1/15 промпта (household-display — сравнени Skylight, DAKboard и Hearth срещу iPad)
- **Точен брой номерирани редове в таблицата по-долу (`N`):** **4** (`0` Semrush видими реда + `0` Google SERP собствен домейн/App Store + `1` Google SERP външни сравнения + `1` ChatGPT промпта + `2` предложения/кандидат-теми)

### 1. Защо този конкурент е включен (Доказателства спрямо Cloud Calendars)

Skylight и DAKboard дефинират цялата продуктова категория за стенен семеен календарен дисплей ('iPad wall calendar Skylight alternative family display'), като са директно анализирани и цитирани от ChatGPT в 'household-display' (където предишният автоматичен брояч грешно отчиташе 'iCloud calendars' като 'Cloud Calendars').

### 2. Статии и страници на конкурента, които описват тези теми

| № | Официален URL на конкурента | Заглавие и роля в проучването |
| :--- | :--- | :--- |
| 1 | `https://myskylight.com/pages/calendar-features/` | Skylight Calendar Features — Официална страница, цитирана от ChatGPT за двупосочна/еднопосочна синхронизация |
| 2 | `https://dakboard.com/site` | DAKboard Smart Display — Официална страница за браузърен календарен дисплей (работи и на iPad чрез Safari) |

### 3. Наши статии в Cloud Calendars (`cloud-calendars.com`), които покриват темите

| № | Наш URL (`cloud-calendars.com/articles/...`) | Заглавие на нашата статия | Локален сорс файл |
| :--- | :--- | :--- | :--- |
| 1 | `https://www.cloud-calendars.com/articles/ipad-family-calendar-display-skylight-dakboard/` | **Using an iPad as a Shared Family Calendar Display vs. Dedicated Hardware** | `src/app/content/en-US/articles-round4.ts` |
| 2 | `https://www.cloud-calendars.com/articles/month-view-on-a-bigger-screen/` | **Month View on a Bigger Screen (iPad)** | `src/app/content/en-US/articles-views.ts` |

### 4. Пълна таблица на записаните заявки, промптове и кандидат-теми (Точно 4 номерирани реда)

> **Важно уточнение за произхода на данните:** Всеки ред по-долу има изрично обозначен тип доказателство (`[A]` Semrush US Desktop видима позиция, `[B1]` Google SERP Топ 10 собствен домейн/App Store, `[B2]` Google SERP Топ 10 външно сравнение, `[C]` ChatGPT потребителски промпт от извадката с 15 разговора, или `[D]` Предложение от Google Related Search / кандидат-тема от документация, което **не е** доказан ранк).

| № | Ключова дума / Заявка / Промпт | Категория доказателство | Детайли на наблюдението (Позиция / Обем / Източник) | Страница на конкурента | Наша целева статия (`cloud-calendars.com`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `iPad wall calendar Skylight alternative family display` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #1, #4, #5 Външни сравнения за алтернативи на Skylight с iPad (queryId: household-display) | `https://mangodisplay.com/best-skylight-calendar-alternatives/` | `/articles/ipad-family-calendar-display-skylight-dakboard/` |
| 2 | `Use an iPad as a shared family calendar display instead of buying dedicated hardware (promptId: household-display)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Сравнени Skylight, DAKboard и Hearth Display с официални линкове (chatgpt-household-display.json) | `https://myskylight.com/pages/calendar-features/` | `/articles/ipad-family-calendar-display-skylight-dakboard/` |
| 3 | `turn old ipad into skylight calendar free` | **[D] Предложение / Кандидат-тема (не е ранк)** | Google Related Search (от all-discovered-classification.json — предложение, не е измерен ранк) | `https://myskylight.com/pages/calendar-features/` | `/articles/ipad-family-calendar-display-skylight-dakboard/` |
| 4 | `dakboard on ipad wall mount family calendar` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от документацията на DAKboard и Skylight за стенен семеен дисплей | `https://dakboard.com/site` | `/articles/ipad-family-calendar-display-skylight-dakboard/` |

---

## #22 — Calendar 366 (by Vincent Miethe / nspektor) ([`22-calendar-366.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/22-calendar-366.md))

- **Разработчик / Издател:** Vincent Miethe (calendar366.com / nspektor.com)
- **Официален уебсайт:** https://nspektor.com/en/calendar366-ios
- **Отчетени позиции в Semrush (US Desktop, 21.10.2026):** Не е проверен в Semrush Free Tier (Оценяван трафик: —)
- **Най-добра наблюдавана позиция в Google SERP (извадка 45 заявки):** #2 (Външно сравнение за 'calendar366-comparison' и 'three-calendar-comparison')
- **Споменавания в ChatGPT (извадка 15 промпта):** 2/15 промпта (ipad, weather)
- **Точен брой номерирани редове в таблицата по-долу (`N`):** **6** (`0` Semrush видими реда + `0` Google SERP собствен домейн/App Store + `2` Google SERP външни сравнения + `2` ChatGPT промпта + `2` предложения/кандидат-теми)

### 1. Защо този конкурент е включен (Доказателства спрямо Cloud Calendars)

Calendar 366 е сред най-често препоръчваните приложения с еднократно плащане (без абонамент) като алтернатива на Fantastical — споменава се в 2 от 15-те ChatGPT разговора ('ipad' и 'weather') с директен цитат към calendar366.com/help/index.html и присъства в 2 сравнителни Google SERP заявки.

### 2. Статии и страници на конкурента, които описват тези теми

| № | Официален URL на конкурента | Заглавие и роля в проучването |
| :--- | :--- | :--- |
| 1 | `https://calendar366.com/help/index.html` | Calendar 366 Help Manual — Официално ръководство за iOS/macOS, цитирано от ChatGPT (прегледано в round3-primary-checks.json) |
| 2 | `https://nspektor.com/en/calendar366-ios` | Calendar 366 for iOS Product Page — Официална продуктова страница за iPhone, iPad и Apple Watch |

### 3. Наши статии в Cloud Calendars (`cloud-calendars.com`), които покриват темите

| № | Наш URL (`cloud-calendars.com/articles/...`) | Заглавие на нашата статия | Локален сорс файл |
| :--- | :--- | :--- | :--- |
| 1 | `https://www.cloud-calendars.com/articles/fantastical-readdle-calendar366-iphone-comparison/` | **Fantastical, Calendars by Readdle, Calendar 366, and Cloud Calendars on iPhone** | `src/app/content/en-US/articles-round2.ts` |
| 2 | `https://www.cloud-calendars.com/articles/weather-inside-your-calendar/` | **Weather Inside Your Calendar** | `src/app/content/en-US/articles-weather.ts` |
| 3 | `https://www.cloud-calendars.com/articles/month-view-on-a-bigger-screen/` | **Month View on a Bigger Screen (iPad)** | `src/app/content/en-US/articles-views.ts` |

### 4. Пълна таблица на записаните заявки, промптове и кандидат-теми (Точно 6 номерирани реда)

> **Важно уточнение за произхода на данните:** Всеки ред по-долу има изрично обозначен тип доказателство (`[A]` Semrush US Desktop видима позиция, `[B1]` Google SERP Топ 10 собствен домейн/App Store, `[B2]` Google SERP Топ 10 външно сравнение, `[C]` ChatGPT потребителски промпт от извадката с 15 разговора, или `[D]` Предложение от Google Related Search / кандидат-тема от документация, което **не е** доказан ранк).

| № | Ключова дума / Заявка / Промпт | Категория доказателство | Детайли на наблюдението (Позиция / Обем / Източник) | Страница на конкурента | Наша целева статия (`cloud-calendars.com`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `Calendar 366 vs Fantastical iPhone` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #2 Външно сравнение Fantastical vs Calendar 366 (queryId: calendar366-comparison) | `https://medium.com/productivity-side/fantastical-vs-calendar-366-which-one-to-choose-130c96af8eb3` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 2 | `Fantastical vs Calendars by Readdle Calendar 366 iPhone` | **[B2] Google SERP (Външно сравнение / форум)** | Google SERP (45 заявки): #2 Външно сравнение Fantastical vs Calendar 366 (queryId: three-calendar-comparison) | `https://medium.com/productivity-side/fantastical-vs-calendar-366-which-one-to-choose-130c96af8eb3` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 3 | `iPad calendar apps with useful month and week views with weather (promptId: ipad)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение без абонамент с цитат към calendar366.com/help (chatgpt-ipad.json) | `https://calendar366.com/help/index.html` | `/articles/month-view-on-a-bigger-screen/` |
| 4 | `Show weather alongside appointments on iPhone/iPad (promptId: weather)` | **[C] ChatGPT (Извадка 15 промпта)** | ChatGPT (15 промпта): Препоръчано приложение с вградена прогноза за времето (chatgpt-weather.json) | `https://calendar366.com/help/index.html` | `/articles/weather-inside-your-calendar/` |
| 5 | `calendar 366 vs fantastical one time purchase` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от сравнението между абонаментни календари и еднократна покупка | `https://nspektor.com/en/calendar366-ios` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |
| 6 | `calendar 366 calendar sets natural language iphone` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от официалното ръководство на Calendar 366 (round3-primary-checks.json) | `https://calendar366.com/help/index.html` | `/articles/fantastical-readdle-calendar366-iphone-comparison/` |

---

## #23 — Teamup Calendar ([`23-teamup.md`](file:///Users/minchomilev/cloud-calendars/research/competitors-md/23-teamup.md))

- **Разработчик / Издател:** Teamup Solutions AG (teamup.com)
- **Официален уебсайт:** https://www.teamup.com/
- **Отчетени позиции в Semrush (US Desktop, 21.10.2026):** Не е проверен в Semrush Free Tier (Оценяван трафик: —)
- **Най-добра наблюдавана позиция в Google SERP (извадка 45 заявки):** Не е в Топ 10 на извадката от 45 заявки (3 прегледани официални KB страници)
- **Споменавания в ChatGPT (извадка 15 промпта):** 0/15 в извадката
- **Точен брой номерирани редове в таблицата по-долу (`N`):** **3** (`0` Semrush видими реда + `0` Google SERP собствен домейн/App Store + `0` Google SERP външни сравнения + `0` ChatGPT промпта + `3` предложения/кандидат-теми)

### 1. Защо този конкурент е включен (Доказателства спрямо Cloud Calendars)

Teamup е включен в нашия първичен корпус с 3 специализирани ръководства за споделяне на календари чрез линкове с роли (read-only, modify, add-only) без изискване за потребителски акаунт и за ротационни графици на смени.

### 2. Статии и страници на конкурента, които описват тези теми

| № | Официален URL на конкурента | Заглавие и роля в проучването |
| :--- | :--- | :--- |
| 1 | `https://calendar.teamup.com/kb/sharing-calendars/` | Sharing Calendars with Customizable Access Permissions (Teamup KB) — Официална документация за линкове с права за достъп без регистрация |
| 2 | `https://calendar.teamup.com/kb/teamup-mobile-apps/` | Teamup Mobile Apps for iOS and Android — Официална документация за мобилното приложение |
| 3 | `https://www.teamup.com/shift-schedule-calendar/` | Teamup Shift Schedule Calendar — Официална продуктова страница за ротационни и екипни смени |

### 3. Наши статии в Cloud Calendars (`cloud-calendars.com`), които покриват темите

| № | Наш URL (`cloud-calendars.com/articles/...`) | Заглавие на нашата статия | Локален сорс файл |
| :--- | :--- | :--- | :--- |
| 1 | `https://www.cloud-calendars.com/articles/inviting-people-who-do-not-have-the-app/` | **Inviting People Who Do Not Have the App** | `src/app/content/en-US/articles-sharing.ts` |
| 2 | `https://www.cloud-calendars.com/articles/a-calendar-that-is-yours-to-share/` | **A Calendar That Is Yours to Share** | `src/app/content/en-US/articles-sharing.ts` |
| 3 | `https://www.cloud-calendars.com/articles/shift-work-calendar-iphone-rotating-schedules/` | **Shift-Work Calendars on iPhone: Rotating Schedules and Personal Events** | `src/app/content/en-US/articles-round2.ts` |

### 4. Пълна таблица на записаните заявки, промптове и кандидат-теми (Точно 3 номерирани реда)

> **Важно уточнение за произхода на данните:** Всеки ред по-долу има изрично обозначен тип доказателство (`[A]` Semrush US Desktop видима позиция, `[B1]` Google SERP Топ 10 собствен домейн/App Store, `[B2]` Google SERP Топ 10 външно сравнение, `[C]` ChatGPT потребителски промпт от извадката с 15 разговора, или `[D]` Предложение от Google Related Search / кандидат-тема от документация, което **не е** доказан ранк).

| № | Ключова дума / Заявка / Промпт | Категория доказателство | Детайли на наблюдението (Позиция / Обем / Източник) | Страница на конкурента | Наша целева статия (`cloud-calendars.com`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `share calendar link without account registration` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от официалната документация на Teamup (calendar.teamup.com/kb/sharing-calendars/) | `https://calendar.teamup.com/kb/sharing-calendars/` | `/articles/inviting-people-who-do-not-have-the-app/` |
| 2 | `read only vs editable shared calendar link permissions` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от официалната документация на Teamup за нива на достъп | `https://calendar.teamup.com/kb/sharing-calendars/` | `/articles/a-calendar-that-is-yours-to-share/` |
| 3 | `team shift schedule calendar iphone android` | **[D] Предложение / Кандидат-тема (не е ранк)** | Кандидат-тема от официалната документация на Teamup (teamup.com/shift-schedule-calendar/) | `https://www.teamup.com/shift-schedule-calendar/` | `/articles/shift-work-calendar-iphone-rotating-schedules/` |

---

