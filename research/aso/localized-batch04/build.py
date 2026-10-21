import pathlib,json,re
p=pathlib.Path(__file__).parent
copy={
'ar-SA':[
'الطقس والمواعيد والأدوات',
'جدول,تخطيط,أسبوع,شهر,تذكير,اجتماع,حدث,مشاركة,دعوة,توقعات,تنظيم',
'اجمع مواعيدك والطقس في مكان واحد، واستخدم أدوات الشاشة الرئيسية وعروض التقويم. يمكنك البدء بتقويم محلي دون حساب في التطبيق.',
'''تابع مواعيد العمل وخططك الشخصية والطقس على iPhone وiPad باستخدام Cloud Calendars.

التقاويم والعروض
استخدم تقاويم iCloud واربط تقويم Google. يضيف Premium دعم تقاويم Microsoft. اختر عرض اليوم أو الأسبوع أو الشهر أو السنة أو القائمة.

يمكنك إنشاء تقويم محلي على جهازك دون إنشاء حساب Cloud Calendars. قد يتطلب ربط الخدمات والمشاركة تسجيل الدخول.

الطقس والأدوات والمشاركة
تحقق من توقعات الطقس أثناء التخطيط. تتوفر أدوات الشاشة الرئيسية بأحجام صغيرة ومتوسطة وكبيرة. تعتمد التوقعات المتاحة على الموقع ومزود الطقس. شارك الأحداث والتقاويم وأرسل دعوات بالبريد الإلكتروني أو رمز QR أو App Clip. تعتمد صلاحيات الوصول على التقويم ونوع الدعوة.

اختر خطتك
Base مجاني ويشمل مزامنة تقويم Google وGoogle Meet وعروض التقويم المختلفة والطقس والأدوات.
يشمل Advanced ميزات Base ويزيل الإعلانات.
يشمل Premium ميزات Advanced ويضيف تقاويم Microsoft وMicrosoft Teams.

التنزيل مجاني مع اشتراكات اختيارية تتجدد تلقائياً. تحقق من السعر المحلي الحالي وفترة الفوترة في التطبيق أو App Store قبل الاشتراك. يتجدد الاشتراك ما لم تلغه قبل نهاية الفترة الحالية بـ24 ساعة على الأقل. يمكنك إدارته أو إلغاؤه من إعدادات حساب App Store.''',('الخصوصية','شروط الاستخدام')],
'he':[
'מזג אוויר, פגישות ווידג׳טים',
'לוח שנה,תכנון,שבוע,חודש,תזכורת,אירוע,שיתוף,הזמנה,תחזית,סדר יום',
'התוכניות ומזג האוויר במקום אחד. אפשר להשתמש בווידג׳טים ובתצוגות שונות, או להתחיל עם לוח שנה מקומי בלי חשבון באפליקציה.',
'''אפשר לעיין בתוכניות לעבודה ולחיים הפרטיים לצד מזג האוויר ב-iPhone וב-iPad עם Cloud Calendars.

לוחות שנה ותצוגות
השתמשו בלוחות שנה של iCloud וחברו את יומן Google. מסלול Premium מוסיף תמיכה בלוחות שנה של Microsoft. בחרו תצוגה יומית, שבועית, חודשית, שנתית או רשימה.

אפשר גם ליצור לוח שנה מקומי במכשיר בלי חשבון Cloud Calendars. חיבור שירותים ושיתוף עשויים לדרוש כניסה לחשבון.

מזג אוויר, ווידג׳טים ושיתוף
בדקו את התחזית בזמן התכנון. ווידג׳טים למסך הבית זמינים בגודל קטן, בינוני וגדול. זמינות התחזיות תלויה במיקום ובספק מזג האוויר. שתפו אירועים ולוחות שנה ושלחו הזמנות בדוא״ל, בקוד QR או ב-App Clip. הרשאות הגישה תלויות בלוח השנה ובסוג ההזמנה.

בחירת מסלול
Base הוא מסלול חינמי הכולל סנכרון עם יומן Google, תמיכה ב-Google Meet, תצוגות לוח שנה שונות, מזג אוויר ווידג׳טים.
Advanced כולל את תכונות Base ומסיר פרסומות.
Premium כולל את Advanced ומוסיף לוחות שנה של Microsoft ותמיכה ב-Microsoft Teams.

ההורדה חינמית, עם מינויים אופציונליים המתחדשים אוטומטית. לפני ההרשמה, בדקו את המחיר המקומי העדכני ואת תקופת החיוב באפליקציה או ב-App Store. המינוי מתחדש אלא אם מבטלים אותו לפחות 24 שעות לפני סיום התקופה הנוכחית. אפשר לנהל או לבטל אותו בהגדרות חשבון App Store.''',('פרטיות','תנאי שימוש')],
'hi':[
'मौसम, योजनाएँ और विजेट',
'समयसारणी,याद दिलाना,बैठक,इवेंट,साझा,निमंत्रण,सप्ताह,महीना,पूर्वानुमान,कार्यक्रम',
'अपनी योजनाएँ और मौसम एक साथ देखें। विजेट और अलग-अलग कैलेंडर दृश्य चुनें, या ऐप खाता बनाए बिना स्थानीय कैलेंडर से शुरू करें।',
'''Cloud Calendars के साथ iPhone और iPad पर काम और निजी जीवन की योजनाएँ मौसम के साथ देखें।

कैलेंडर और दृश्य
iCloud कैलेंडर का उपयोग करें और Google Calendar जोड़ें। Premium में Microsoft कैलेंडर का समर्थन भी मिलता है। दिन, सप्ताह, महीना, वर्ष या सूची दृश्य चुनें।

आप Cloud Calendars खाता बनाए बिना अपने डिवाइस पर स्थानीय कैलेंडर भी बना सकते हैं। सेवाएँ जोड़ने और साझा करने के लिए साइन इन करना पड़ सकता है।

मौसम, विजेट और साझा करना
योजना बनाते समय मौसम का पूर्वानुमान देखें। होम स्क्रीन विजेट छोटे, मध्यम और बड़े आकार में उपलब्ध हैं। उपलब्ध पूर्वानुमान स्थान और मौसम सेवा प्रदाता पर निर्भर करते हैं। इवेंट और कैलेंडर साझा करें तथा ईमेल, QR कोड या App Clip से निमंत्रण भेजें। पहुँच की अनुमति कैलेंडर और निमंत्रण के प्रकार पर निर्भर करती है।

अपना प्लान चुनें
मुफ़्त Base में Google Calendar सिंक, Google Meet, अलग-अलग कैलेंडर दृश्य, मौसम और विजेट शामिल हैं।
Advanced में Base की सुविधाएँ शामिल हैं और विज्ञापन हट जाते हैं।
Premium में Advanced की सुविधाओं के साथ Microsoft कैलेंडर और Microsoft Teams का समर्थन मिलता है।

ऐप डाउनलोड करना मुफ़्त है। वैकल्पिक सदस्यताएँ अपने आप नवीनीकृत होती हैं। सदस्यता लेने से पहले ऐप या App Store में मौजूदा स्थानीय कीमत और बिलिंग अवधि देखें। वर्तमान अवधि समाप्त होने से कम से कम 24 घंटे पहले रद्द न करने पर सदस्यता नवीनीकृत हो जाती है। App Store खाते की सेटिंग में सदस्यता प्रबंधित या रद्द करें।''',('गोपनीयता','उपयोग की शर्तें')],
'cs':[
'Počasí, schůzky a widgety',
'diář,plánovač,týden,měsíc,připomínka,událost,sdílení,pozvánka,předpověď,rozvrh',
'Prohlížejte si plány a počasí společně. Vyberte si widgety a různá zobrazení, nebo začněte místním kalendářem bez účtu v aplikaci.',
'''Plánujte pracovní i osobní program s počasím na iPhonu a iPadu. Cloud Calendars spojuje vaše kalendáře na jednom místě.

KALENDÁŘE A ZOBRAZENÍ
Používejte kalendáře iCloud a připojte Kalendář Google. Premium přidává podporu kalendářů Microsoft. Vyberte zobrazení dne, týdne, měsíce, roku nebo seznamu.

Můžete také vytvořit místní kalendář v zařízení bez účtu Cloud Calendars. Připojení služeb a sdílení mohou vyžadovat přihlášení.

POČASÍ, WIDGETY A SDÍLENÍ
Při plánování sledujte předpověď. Widgety na plochu jsou dostupné v malé, střední a velké velikosti. Dostupnost předpovědí závisí na místě a poskytovateli počasí. Sdílejte události a kalendáře a posílejte pozvánky e-mailem, QR kódem nebo přes App Clip. Oprávnění závisí na kalendáři a typu pozvánky.

VYBERTE SI TARIF
Bezplatný Base zahrnuje synchronizaci s Kalendářem Google, Google Meet, různá zobrazení kalendáře, počasí a widgety.
Advanced obsahuje funkce Base a odstraňuje reklamy.
Premium obsahuje Advanced a přidává kalendáře Microsoft a Microsoft Teams.

Stažení je zdarma s volitelným automaticky obnovovaným předplatným. Před nákupem zkontrolujte aktuální místní cenu a fakturační období v aplikaci nebo App Storu. Předplatné se obnoví, pokud ho nezrušíte alespoň 24 hodin před koncem aktuálního období. Spravovat nebo zrušit ho můžete v nastavení účtu App Store.''',('Soukromí','Podmínky použití')],
'da':[
'Vejr, aftaler og widgets',
'planlægger,agenda,uge,måned,påmindelse,møde,begivenhed,deling,invitation,prognose,tidsplan',
'Se dine planer og vejret samlet. Brug widgets og forskellige visninger, eller begynd med en lokal kalender uden en konto i appen.',
'''Se arbejdsplaner, private aftaler og vejret på din iPhone og iPad med Cloud Calendars.

KALENDERE OG VISNINGER
Brug iCloud-kalendere, og tilslut Google Kalender. Premium tilføjer understøttelse af Microsoft-kalendere. Vælg dags-, uge-, måneds-, års- eller listevisning.

Du kan også oprette en lokal kalender på enheden uden en Cloud Calendars-konto. Tilslutning til tjenester og deling kan kræve login.

VEJR, WIDGETS OG DELING
Se vejrudsigten, mens du planlægger. Widgets til hjemmeskærmen findes i små, mellemstore og store størrelser. Tilgængelige prognoser afhænger af placering og vejrudbyder. Del begivenheder og kalendere, og send invitationer via e-mail, QR-kode eller App Clip. Adgang afhænger af kalenderen og invitationstypen.

VÆLG DIT ABONNEMENT
Gratisplanen Base omfatter synkronisering med Google Kalender, Google Meet, forskellige kalendervisninger, vejr og widgets.
Advanced indeholder Base-funktionerne og fjerner reklamer.
Premium indeholder Advanced og tilføjer Microsoft-kalendere og Microsoft Teams.

Appen er gratis at hente med valgfrie abonnementer, der fornyes automatisk. Kontrollér den aktuelle lokale pris og faktureringsperiode i appen eller App Store, før du abonnerer. Abonnementet fornyes, medmindre du opsiger det mindst 24 timer før periodens udløb. Administrer eller opsig det i indstillingerne for din App Store-konto.''',('Privatliv','Brugsbetingelser')],
'fi':[
'Sää, tapaamiset ja widgetit',
'suunnittelu,viikko,kuukausi,muistutus,kokous,tapahtuma,jakaminen,kutsu,ennuste,aikataulu',
'Tarkastele suunnitelmia ja säätä yhdessä. Käytä widgettejä ja eri näkymiä tai aloita paikallisella kalenterilla ilman sovellustiliä.',
'''Tarkastele työasioita, omia menoja ja säätä iPhonella ja iPadilla Cloud Calendarsin avulla.

KALENTERIT JA NÄKYMÄT
Käytä iCloud-kalentereita ja yhdistä Google Kalenteri. Premium lisää tuen Microsoft-kalentereille. Valitse päivä-, viikko-, kuukausi-, vuosi- tai luettelonäkymä.

Voit myös luoda laitteelle paikallisen kalenterin ilman Cloud Calendars -tiliä. Palvelujen yhdistäminen ja jakaminen voivat edellyttää kirjautumista.

SÄÄ, WIDGETIT JA JAKAMINEN
Tarkista sääennuste suunnittelun yhteydessä. Koti-valikon widgettejä on pienessä, keskikokoisessa ja suuressa koossa. Ennusteiden saatavuus riippuu sijainnista ja sääpalvelusta. Jaa tapahtumia ja kalentereita sekä lähetä kutsuja sähköpostitse, QR-koodilla tai App Clipillä. Käyttöoikeudet riippuvat kalenterista ja kutsun tyypistä.

VALITSE TILAUS
Maksuton Base sisältää Google Kalenterin synkronoinnin, Google Meetin, eri kalenterinäkymät, sään ja widgetit.
Advanced sisältää Basen ominaisuudet ja poistaa mainokset.
Premium sisältää Advancedin ja lisää Microsoft-kalenterit ja Microsoft Teamsin.

Sovelluksen lataaminen on maksutonta. Saatavilla on valinnaisia automaattisesti uusiutuvia tilauksia. Tarkista nykyinen paikallinen hinta ja laskutusjakso sovelluksesta tai App Storesta ennen tilaamista. Tilaus uusiutuu, ellet peruuta sitä vähintään 24 tuntia ennen nykyisen jakson päättymistä. Hallitse tilausta tai peruuta se App Store -tilisi asetuksista.''',('Tietosuoja','Käyttöehdot')],
'no':[
'Vær, avtaler og widgeter',
'planlegger,agenda,uke,måned,påminnelse,møte,hendelse,deling,invitasjon,varsel,timeplan',
'Se planene dine og været samlet. Bruk widgeter og ulike visninger, eller start med en lokal kalender uten en konto i appen.',
'''Se jobbavtaler, private planer og været på iPhone og iPad med Cloud Calendars.

KALENDERE OG VISNINGER
Bruk iCloud-kalendere og koble til Google Kalender. Premium legger til støtte for Microsoft-kalendere. Velg dags-, uke-, måneds-, års- eller listevisning.

Du kan også opprette en lokal kalender på enheten uten en Cloud Calendars-konto. Tilkobling til tjenester og deling kan kreve pålogging.

VÆR, WIDGETER OG DELING
Sjekk værmeldingen mens du planlegger. Widgeter for Hjem-skjermen finnes i små, mellomstore og store størrelser. Tilgjengelige værprognoser avhenger av sted og værleverandør. Del hendelser og kalendere, og send invitasjoner via e-post, QR-kode eller App Clip. Tilgang avhenger av kalenderen og invitasjonstypen.

VELG ABONNEMENT
Gratisplanen Base inkluderer synkronisering med Google Kalender, Google Meet, ulike kalendervisninger, vær og widgeter.
Advanced inkluderer Base-funksjonene og fjerner annonser.
Premium inkluderer Advanced og legger til Microsoft-kalendere og Microsoft Teams.

Appen er gratis å laste ned med valgfrie abonnementer som fornyes automatisk. Sjekk gjeldende lokal pris og faktureringsperiode i appen eller App Store før du abonnerer. Abonnementet fornyes hvis du ikke sier det opp minst 24 timer før perioden utløper. Administrer eller si det opp i innstillingene for App Store-kontoen din.''',('Personvern','Bruksvilkår')],
'hu':[
'Időjárás, programok, widgetek',
'napirend,tervező,hét,hónap,emlékeztető,találkozó,esemény,megosztás,meghívó,előrejelzés',
'Tervek és időjárás egy helyen. Használj widgeteket és különböző nézeteket, vagy kezdj helyi naptárral, alkalmazásfiók nélkül.',
'''Tekintsd át munkahelyi és személyes programjaidat az időjárással együtt iPhone-on és iPaden a Cloud Calendars segítségével.

NAPTÁRAK ÉS NÉZETEK
Használj iCloud-naptárakat, és csatlakoztasd a Google Naptárt. A Premium Microsoft-naptárakat is támogat. Válassz napi, heti, havi, éves vagy listanézetet.

Helyi naptárat is létrehozhatsz az eszközön Cloud Calendars-fiók nélkül. A szolgáltatások csatlakoztatásához és a megosztáshoz bejelentkezésre lehet szükség.

IDŐJÁRÁS, WIDGETEK ÉS MEGOSZTÁS
Tervezés közben nézd meg az előrejelzést. A Főképernyő widgetjei kis, közepes és nagy méretben érhetők el. Az előrejelzések elérhetősége a helytől és az időjárási szolgáltatótól függ. Ossz meg eseményeket és naptárakat, és küldj meghívókat e-mailben, QR-kóddal vagy App Clippel. A hozzáférés a naptártól és a meghívó típusától függ.

VÁLASSZ CSOMAGOT
Az ingyenes Base Google Naptár-szinkronizálást, Google Meetet, különböző naptárnézeteket, időjárást és widgeteket tartalmaz.
Az Advanced tartalmazza a Base funkcióit, és eltávolítja a hirdetéseket.
A Premium tartalmazza az Advanced funkcióit, valamint Microsoft-naptárakat és Microsoft Teamst is támogat.

A letöltés ingyenes, és választható automatikusan megújuló előfizetés. Előfizetés előtt ellenőrizd az aktuális helyi árat és a számlázási időszakot az alkalmazásban vagy az App Store-ban. Az előfizetés megújul, ha nem mondod le legalább 24 órával az aktuális időszak vége előtt. Az App Store-fiókod beállításaiban kezelheted vagy lemondhatod.''',('Adatvédelem','Használati feltételek')],
'ro':[
'Vreme, întâlniri și widgeturi',
'agendă,planificare,săptămână,lună,memento,eveniment,partajare,invitație,prognoză,orar',
'Vezi planurile și vremea în același loc. Folosește widgeturi și vizualizări diferite sau începe cu un calendar local fără cont în aplicație.',
'''Consultă planurile de serviciu, programul personal și vremea pe iPhone și iPad cu Cloud Calendars.

CALENDARE ȘI VIZUALIZĂRI
Folosește calendare iCloud și conectează Google Calendar. Premium adaugă suport pentru calendarele Microsoft. Alege vizualizarea pe zi, săptămână, lună, an sau listă.

Poți crea și un calendar local pe dispozitiv fără un cont Cloud Calendars. Conectarea serviciilor și partajarea pot necesita autentificare.

VREME, WIDGETURI ȘI PARTAJARE
Consultă prognoza în timp ce îți faci planuri. Widgeturile pentru ecranul principal sunt disponibile în dimensiuni mici, medii și mari. Prognozele disponibile depind de locație și de furnizorul meteo. Partajează evenimente și calendare și trimite invitații prin e-mail, cod QR sau App Clip. Permisiunile depind de calendar și de tipul invitației.

ALEGE PLANUL
Base este gratuit și include sincronizare cu Google Calendar, Google Meet, diverse vizualizări ale calendarului, vreme și widgeturi.
Advanced include funcțiile Base și elimină reclamele.
Premium include Advanced și adaugă calendarele Microsoft și Microsoft Teams.

Descărcarea este gratuită, cu abonamente opționale care se reînnoiesc automat. Verifică prețul local actual și perioada de facturare în aplicație sau în App Store înainte de abonare. Abonamentul se reînnoiește dacă nu îl anulezi cu cel puțin 24 de ore înainte de încheierea perioadei curente. Îl poți gestiona sau anula din configurările contului App Store.''',('Confidențialitate','Condiții de utilizare')],
'uk':[
'Погода, зустрічі та віджети',
'планувальник,розклад,тиждень,місяць,нагадування,подія,поширення,запрошення,прогноз,плани',
'Переглядайте плани й погоду разом. Використовуйте віджети та різні подання або почніть із локального календаря без облікового запису застосунку.',
'''Переглядайте робочі й особисті плани разом із погодою на iPhone та iPad за допомогою Cloud Calendars.

КАЛЕНДАРІ ТА ПОДАННЯ
Використовуйте календарі iCloud і підключайте Google Календар. Premium додає підтримку календарів Microsoft. Вибирайте подання дня, тижня, місяця, року або списку.

Можна також створити локальний календар на пристрої без облікового запису Cloud Calendars. Підключення сервісів і спільний доступ можуть потребувати входу в обліковий запис.

ПОГОДА, ВІДЖЕТИ ТА СПІЛЬНИЙ ДОСТУП
Перевіряйте прогноз під час планування. Віджети для початкового екрана доступні в малому, середньому й великому розмірах. Наявність прогнозів залежить від місця та постачальника погодних даних. Діліться подіями й календарями та надсилайте запрошення електронною поштою, QR-кодом або через App Clip. Права доступу залежать від календаря й типу запрошення.

ВИБЕРІТЬ ПЛАН
Безкоштовний Base містить синхронізацію з Google Календарем, Google Meet, різні подання календаря, погоду й віджети.
Advanced містить функції Base та прибирає рекламу.
Premium містить Advanced і додає календарі Microsoft та Microsoft Teams.

Застосунок можна завантажити безкоштовно. Доступні необов’язкові передплати з автоматичним поновленням. Перед оформленням перевірте поточну місцеву ціну та розрахунковий період у застосунку або App Store. Передплата поновлюється, якщо її не скасувати щонайменше за 24 години до завершення поточного періоду. Керувати нею або скасувати її можна в параметрах облікового запису App Store.''',('Конфіденційність','Умови використання')]
}
s=json.loads((p/'asc-current.json').read_text());ins={x['attributes']['locale']:x for x in s['appInfo']['localizations']};vs={x['attributes']['locale']:x for x in s['version']['localizations']}
summary=[]
for loc in s['selected']:
 sub,kw,promo,desc,labels=copy[loc];a,b=labels;desc+=f'\n\n{a}: https://www.cloud-calendars.com/privacy-policy\n{b}: https://www.apple.com/legal/internet-services/itunes/dev/stdeula/'
 raw={'name':ins[loc]['attributes']['name'],'subtitle':sub,'keywords':kw,'promotionalText':promo,'description':desc};limits={'name':30,'subtitle':30,'keywords':100,'promotionalText':170,'description':4000}
 fields={k:{'value':v,'characters':len(v),'utf8Bytes':len(v.encode()),'characterLimit':limits[k],'withinCharacterLimit':len(v)<=limits[k]} for k,v in raw.items()}
 assert all(v['withinCharacterLimit'] for v in fields.values()),(loc,{k:v['characters'] for k,v in fields.items()})
 tokens=set(re.findall(r'\w+',raw['name'].casefold()+' '+sub.casefold()));dups=[x for x in kw.split(',') if x.casefold() in tokens];assert not dups,(loc,dups)
 out={'status':'proposal_only_not_applied','locale':loc,'appId':'6744690319','targetVersion':'1.7.4','targetState':s['version']['attributes']['appStoreState'],'appInfoLocalizationId':ins[loc]['id'],'versionLocalizationId':vs[loc]['id'],'nameAction':'preserve_exact_current_draft_name','fields':fields,'current':{'appInfo':ins[loc]['attributes'],'version':vs[loc]['attributes']},'keywordChecks':{'exactDuplicateKeywords':len(kw.split(','))!=len(set(kw.split(','))),'exactTitleSubtitleTokenDuplicates':dups,'note':'Unicode code-point limits. Bytes reported separately. Exact token checks do not resolve grammatical forms or Hindi combining marks.'},'readiness':'ready_for_editorial_review_not_applied','translationConfidence':'medium','caveat':'Model-authored; no native-speaker or ASC write validation. Review RTL mixed-brand rendering for Arabic/Hebrew, Hindi grammar, and shipped tier labels before submission.','evidence':['../../product-facts.json','../localized-batch03/audit.json','asc-current.json'],'applyOnly':['subtitle','keywords','promotionalText','description'],'preserve':['name','release notes','URLs','privacy declarations','screenshots','other locales']}
 (p/(loc+'-proposal.json')).write_text(json.dumps(out,indent=2,ensure_ascii=False)+'\n');(p/(loc+'-description.txt')).write_text(desc+'\n');summary.append({'locale':loc,'name':raw['name'],'subtitle':sub,'counts':{k:{'characters':v['characters'],'utf8Bytes':v['utf8Bytes']} for k,v in fields.items()},'ready':True})
(p/'validation.json').write_text(json.dumps({'retrievedAt':s['retrievedAt'],'prepared':len(summary),'applied':0,'confidence':'medium; no native-speaker review','locales':summary},ensure_ascii=False,indent=2)+'\n');print(json.dumps(summary,ensure_ascii=False,indent=2))
