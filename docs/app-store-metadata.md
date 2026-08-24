# App Store Connect — Localized Metadata

Copy-paste source for the App Store listing of **Cloud Calendars**.

## Field limits

| Field | Limit | Indexed for search | Localizable |
|---|---|---|---|
| Name | 30 chars | yes (highest weight) | per locale |
| Subtitle | 30 chars | yes | per locale |
| Keywords | 100 chars | yes | per locale |
| Promotional text | 170 chars | no | per locale |
| Description | 4000 chars | no | per locale |

Only Name / Subtitle / Keywords are covered here — they are the three indexed fields
and the only ones with counting constraints tight enough to need pre-computed values.

## Rules applied

1. **The brand is never translated.** `Cloud Calendars` stays Latin script in every
   locale, in the store Name and in `CFBundleDisplayName`. Translating it splits the
   brand across reviews, screenshots and support.
2. **The Name carries the brand + the local word for "calendar."** English already has
   the token via `Calendars`, so en-US / en-CA spend the remaining budget on other terms.
3. **Only Google, Microsoft and iCloud are ever named.** These are the three providers
   the app actually claims. `Outlook`, `Exchange`, `Office365` and `Gmail` are
   deliberately absent — see Notes.
4. **Third-party marks live in Subtitle and Keywords, not in the Name.** Prominent use of
   another company's trademark in the app name is a recurring App Review rejection reason.
5. **No word is repeated across Name, Subtitle and Keywords.** The index is shared; a
   repeat is a wasted character. This is why `microsoft` / `icloud` are dropped from the
   keyword lists of the locales whose Subtitle already names them (en, zh, ja, ko).
6. **Keywords are comma-separated with no space after the comma** — the space counts
   toward the 100.

## Invariants (do not localize)

| Key | Value |
|---|---|
| `CFBundleDisplayName` (all `*.lproj/InfoPlist.strings`) | `Cloud Calendars` |
| `INFOPLIST_KEY_CFBundleDisplayName` (pbxproj, all 4 configs) | `Cloud Calendars` |

## Name + Subtitle

Counts in parentheses. Limit is 30 for both.

| Locale | Name | Subtitle |
|---|---|---|
| English (U.S.) | `Cloud Calendars: Sync & Widget` (30) | `Google, Microsoft, iCloud sync` (30) |
| English (Canada) | `Cloud Calendars: Sync & Widget` (30) | `Google, Microsoft, iCloud sync` (30) |
| Arabic | `Cloud Calendars: تقويم` (22) | `كل تقاويمك في مكان واحد` (23) |
| Chinese (Simplified) | `Cloud Calendars: 日历` (19) | `Google、Microsoft、iCloud 同步` (26) |
| Chinese (Traditional) | `Cloud Calendars: 行事曆` (20) | `Google、Microsoft、iCloud 同步` (26) |
| Czech | `Cloud Calendars: Kalendář` (25) | `Všechny kalendáře v jednom` (26) |
| Danish | `Cloud Calendars: Kalender` (25) | `Alle kalendere på ét sted` (25) |
| Dutch | `Cloud Calendars: Agenda` (23) | `Al je agenda's op één plek` (25) |
| Finnish | `Cloud Calendars: Kalenteri` (26) | `Kaikki kalenterit yhdessä` (25) |
| French | `Cloud Calendars: Agenda` (23) | `Tous vos agendas réunis` (23) |
| French (Canada) | `Cloud Calendars: Agenda` (23) | `Tous vos calendriers réunis` (27) |
| German | `Cloud Calendars: Kalender` (25) | `Alle Kalender an einem Ort` (26) |
| Greek | `Cloud Calendars: Ημερολόγιο` (27) | `Όλα τα ημερολόγια μαζί` (22) |
| Hebrew | `Cloud Calendars: יומן` (21) | `כל היומנים במקום אחד` (20) |
| Hindi | `Cloud Calendars: कैलेंडर` (24) | `सभी कैलेंडर एक ही जगह` (21) |
| Hungarian | `Cloud Calendars: Naptár` (23) | `Minden naptár egy helyen` (24) |
| Indonesian | `Cloud Calendars: Kalender` (25) | `Semua kalender jadi satu` (24) |
| Italian | `Cloud Calendars: Calendario` (27) | `Tutti i calendari in uno` (24) |
| Japanese | `Cloud Calendars: カレンダー` (22) | `Google・Microsoft・iCloudを統合` (26) |
| Korean | `Cloud Calendars: 캘린더` (20) | `Google·Microsoft·iCloud 통합` (26) |
| Malay | `Cloud Calendars: Kalendar` (25) | `Semua kalendar dalam satu` (25) |
| Norwegian Bokmål | `Cloud Calendars: Kalender` (25) | `Alle kalendere på ett sted` (26) |
| Polish | `Cloud Calendars: Kalendarz` (26) | `Wszystkie kalendarze razem` (26) |
| Portuguese (Brazil) | `Cloud Calendars: Calendário` (27) | `Todos os calendários em um só` (29) |
| Romanian | `Cloud Calendars: Calendar` (25) | `Toate calendarele într-un loc` (29) |
| Russian | `Cloud Calendars: Календарь` (26) | `Все календари в одном месте` (27) |
| Spanish (Spain) | `Cloud Calendars: Calendario` (27) | `Todos tus calendarios en uno` (28) |
| Swedish | `Cloud Calendars: Kalender` (25) | `Alla kalendrar på ett ställe` (28) |
| Thai | `Cloud Calendars: ปฏิทิน` (23) | `รวมทุกปฏิทินไว้ที่เดียว` (23) |
| Turkish | `Cloud Calendars: Takvim` (23) | `Tüm takvimleriniz tek yerde` (26) |
| Vietnamese | `Cloud Calendars: Lịch` (21) | `Mọi lịch của bạn ở một nơi` (26) |

## Keywords

Limit is 100. Counts in the right column.

| Locale | Keywords | n |
|---|---|---|
| English (U.S.) | `agenda,planner,schedule,meeting,reminder,event,month,week,timeline,appointment,organizer,diary` | 94 |
| English (Canada) | `agenda,planner,schedule,meeting,reminder,event,month,week,timeline,appointment,organizer,diary` | 94 |
| Arabic | `مواعيد,جدول,منظم,اجتماع,تذكير,حدث,مزامنة,أجندة,أسبوع,شهر,google,microsoft,icloud` | 80 |
| Chinese (Simplified) | `日程,行事历,提醒,会议,议程,小组件,周视图,月视图,约会,备忘,规划,农历,时间表,天气,安排,通知` | 52 |
| Chinese (Traditional) | `日曆,日程,提醒,會議,議程,小工具,週檢視,月檢視,約會,備忘,規劃,農曆,時間表,天氣,安排,通知` | 51 |
| Czech | `diář,plánovač,schůzka,připomínka,událost,synchronizace,agenda,týden,měsíc,google,microsoft,icloud` | 97 |
| Danish | `aftale,planlægger,møde,påmindelse,begivenhed,synk,agenda,uge,måned,widget,google,microsoft,icloud` | 97 |
| Dutch | `kalender,planner,afspraak,vergadering,herinnering,evenement,week,maand,sync,google,microsoft,icloud` | 99 |
| Finnish | `ajanvaraus,suunnittelija,tapaaminen,muistutus,tapahtuma,synkronointi,viikko,google,microsoft,icloud` | 99 |
| French | `calendrier,planificateur,rendez-vous,réunion,rappel,événement,semaine,mois,google,microsoft,icloud` | 98 |
| French (Canada) | `planificateur,rendez-vous,réunion,rappel,événement,semaine,mois,synchro,google,microsoft,icloud` | 95 |
| German | `terminplaner,termin,besprechung,erinnerung,ereignis,sync,woche,monat,google,microsoft,icloud` | 92 |
| Greek | `ατζέντα,προγραμματισμός,ραντεβού,υπενθύμιση,συμβάν,συγχρονισμός,εβδομάδα,google,microsoft,icloud` | 96 |
| Hebrew | `לוח שנה,מתזמן,פגישה,תזכורת,אירוע,סנכרון,שבוע,חודש,google,microsoft,icloud` | 73 |
| Hindi | `एजेंडा,प्लानर,मीटिंग,रिमाइंडर,इवेंट,सिंक,सप्ताह,महीना,google,microsoft,icloud` | 77 |
| Hungarian | `határidőnapló,tervező,találkozó,emlékeztető,esemény,szinkronizálás,hónap,google,icloud,microsoft` | 96 |
| Indonesian | `agenda,jadwal,perencana,rapat,pengingat,acara,sinkronisasi,minggu,bulan,google,microsoft,icloud` | 95 |
| Italian | `agenda,pianificatore,appuntamento,riunione,promemoria,evento,sync,settimana,google,microsoft,icloud` | 99 |
| Japanese | `予定表,スケジュール,リマインダー,会議,同期,ウィジェット,週表示,月表示,予定,手帳,アジェンダ,天気` | 53 |
| Korean | `일정,스케줄,알림,회의,동기화,위젯,플래너,다이어리,주간,월간,약속,날씨,일정관리` | 45 |
| Malay | `agenda,jadual,perancang,mesyuarat,peringatan,acara,penyegerakan,minggu,google,icloud,microsoft` | 94 |
| Norwegian Bokmål | `avtale,planlegger,møte,påminnelse,hendelse,synkronisering,uke,måned,google,microsoft,icloud` | 91 |
| Polish | `terminarz,organizer,spotkanie,przypomnienie,wydarzenie,sync,tydzień,miesiąc,google,microsoft,icloud` | 99 |
| Portuguese (Brazil) | `agenda,planejador,reunião,lembrete,evento,sincronizar,semana,mês,google,microsoft,icloud` | 88 |
| Romanian | `agendă,planificator,întâlnire,memento,eveniment,sincronizare,săptămână,google,microsoft,icloud` | 94 |
| Russian | `ежедневник,планировщик,встреча,напоминание,событие,синхронизация,неделя,google,microsoft,icloud` | 95 |
| Spanish (Spain) | `agenda,planificador,reunión,recordatorio,evento,sincronizar,semana,mes,google,microsoft,icloud` | 94 |
| Swedish | `almanacka,planerare,möte,påminnelse,händelse,synkronisering,vecka,månad,google,microsoft,icloud` | 95 |
| Thai | `กำหนดการ,นัดหมาย,ประชุม,เตือนความจำ,กิจกรรม,ซิงค์,สัปดาห์,เดือน,google,microsoft,icloud` | 87 |
| Turkish | `ajanda,planlayıcı,toplantı,hatırlatıcı,etkinlik,senkronizasyon,hafta,ay,google,microsoft,icloud` | 95 |
| Vietnamese | `lịch biểu,kế hoạch,cuộc họp,nhắc nhở,sự kiện,đồng bộ,tuần,tháng,google,microsoft,icloud` | 87 |

## Notes

**Why `Outlook`, `Exchange`, `Office365` and `Gmail` are absent.** None of the four appear
anywhere in the Swift sources, and the app reaches calendars through EventKit rather than
a provider-specific integration. Advertising them would be a claim the product does not
make. They are also one family of claim, not four — dropping `outlook` while keeping
`exchange` or `office365` restates the same unsupported promise under another name.
`Microsoft` stays because it is already in the product name and the permission strings.

If Microsoft work/school accounts added in iOS Settings do sync in practice, `exchange`
is the one term worth reconsidering — but add it as a decision, not as leftover copy.

**CJK locales have unused budget.** Japanese, Korean and both Chinese variants land at
45–53 of 100 characters because each keyword is 2–3 characters. That headroom is real:
add long-tail terms there rather than leaving it.

**Bulgarian is absent by design.** App Store Connect has no `bg` metadata locale, so
Bulgarian users see the en-US listing. This has no effect on `Calendar/bg.lproj` — in-app
localization follows the device language and works independently of the store listing.

**Store locales ≠ in-app locales.** The app currently ships 7 in-app localizations
(`en`, `bg`, `de`, `es`, `fr`, `it`, `ru`) against 31 store locales. A Japanese listing
leading to an English UI is allowed and common, but it costs conversion and draws 1-star
reviews. Either keep the store locale set close to the in-app set, or treat this table as
the target list and expand `*.lproj` toward it.

**Character counting.** Apple counts characters, not bytes — Cyrillic, Greek and CJK
carry no penalty, and CJK locales get far more meaning per character. The counts above
are code-point counts; Devanagari and Thai combining marks each count as one, which is
why those entries look shorter on screen than their number suggests.
