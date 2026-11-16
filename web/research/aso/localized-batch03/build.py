import pathlib,json,re
p=pathlib.Path(__file__).parent
copy={
'nl-NL':[
'Weer, afspraken en widgets',
'kalender,planner,schema,week,maand,herinnering,vergadering,evenement,delen,uitnodiging,verwachting',
'Bekijk je afspraken en het weer samen. Gebruik widgets en verschillende weergaven, of begin met een lokale kalender zonder een account voor de app.',
'''Bekijk je werkafspraken, privéplannen en het weer op je iPhone en iPad. Met Cloud Calendars houd je verschillende kalenders bij elkaar.

KALENDERS EN WEERGAVEN
Gebruik iCloud-kalenders en verbind Google Agenda. Premium voegt ondersteuning voor Microsoft-kalenders toe. Kies een dag-, week-, maand-, jaar- of lijstweergave.

Je kunt ook een lokale kalender op je apparaat maken zonder een Cloud Calendars-account. Voor het verbinden van diensten en het delen van gegevens kan aanmelden nodig zijn.

WEER EN WIDGETS
Raadpleeg de weersverwachting terwijl je plannen maakt. Widgets voor het beginscherm zijn beschikbaar in klein, middelgroot en groot formaat. Beschikbare voorspellingen hangen af van je locatie en de weerprovider.

VERGADERINGEN EN DELEN
Gebruik Google Meet met Google Agenda. Premium ondersteunt ook Microsoft Teams. Deel evenementen en kalenders en nodig anderen uit via e-mail, een QR-code of een App Clip. Toegangsrechten hangen af van de kalender en het type uitnodiging.

KIES JE ABONNEMENT
Base is gratis en bevat synchronisatie met Google Agenda, Google Meet, verschillende kalenderweergaven, weer en widgets.
Advanced bevat de functies van Base en verwijdert advertenties.
Premium bevat Advanced en voegt Microsoft-kalenders en Microsoft Teams toe.

De app is gratis te downloaden. Optionele abonnementen worden automatisch verlengd, tenzij je ze uiterlijk 24 uur voor het einde van de huidige periode opzegt. Je kunt je abonnement beheren of opzeggen via de instellingen van je App Store-account.'''],
'pt-BR':[
'Clima, compromissos e widgets',
'agenda,planejador,horário,semana,mês,lembrete,reunião,evento,compartilhar,convite,previsão',
'Veja seus compromissos e o clima em um só lugar. Explore widgets e diferentes visualizações ou crie um calendário local sem uma conta no app.',
'''Reúna seus calendários e o clima no iPhone e no iPad. Consulte compromissos de trabalho e planos pessoais com o Cloud Calendars.

CALENDÁRIOS E VISUALIZAÇÕES
Use calendários do iCloud e conecte o Google Agenda. O Premium também oferece suporte aos calendários da Microsoft. Escolha entre as visualizações de dia, semana, mês, ano e lista.

Você também pode criar um calendário local no dispositivo sem uma conta do Cloud Calendars. Conectar serviços e compartilhar conteúdo pode exigir login.

CLIMA E WIDGETS
Consulte a previsão do tempo ao planejar suas atividades. Os widgets para a Tela de Início estão disponíveis nos tamanhos pequeno, médio e grande. As previsões disponíveis dependem da localização e do provedor de dados meteorológicos.

REUNIÕES E CONVITES
Use o Google Meet com o Google Agenda. O Premium também oferece suporte ao Microsoft Teams. Compartilhe eventos e calendários e envie convites por e-mail, código QR ou App Clip. As permissões dependem do calendário e do tipo de convite.

ESCOLHA SEU PLANO
O Base é gratuito e inclui sincronização com o Google Agenda, Google Meet, diferentes visualizações de calendário, clima e widgets.
O Advanced inclui os recursos do Base e remove os anúncios.
O Premium inclui o Advanced e adiciona calendários da Microsoft e Microsoft Teams.

O download é gratuito. As assinaturas opcionais são renovadas automaticamente, a menos que você cancele pelo menos 24 horas antes do fim do período atual. Gerencie ou cancele sua assinatura nos ajustes da sua conta da App Store.'''],
'pt-PT':[
'Meteorologia, planos e widgets',
'calendário,planeamento,horário,semana,mês,lembrete,reunião,evento,partilha,convite,previsão',
'Consulte os seus compromissos e a meteorologia no mesmo lugar. Explore widgets e várias vistas ou crie um calendário local sem uma conta na aplicação.',
'''Reúna os seus calendários e a meteorologia no iPhone e no iPad. Consulte compromissos profissionais e planos pessoais com o Cloud Calendars.

CALENDÁRIOS E VISTAS
Utilize calendários do iCloud e ligue o Calendário Google. O Premium também permite utilizar calendários da Microsoft. Escolha entre as vistas de dia, semana, mês, ano e lista.

Pode ainda criar um calendário local no dispositivo sem uma conta do Cloud Calendars. A ligação a serviços e a partilha podem exigir que inicie sessão.

METEOROLOGIA E WIDGETS
Consulte a previsão do tempo ao planear as suas atividades. Os widgets para o ecrã principal estão disponíveis nos tamanhos pequeno, médio e grande. As previsões disponíveis dependem da localização e do fornecedor de dados meteorológicos.

REUNIÕES E CONVITES
Utilize o Google Meet com o Calendário Google. O Premium também inclui suporte para o Microsoft Teams. Partilhe eventos e calendários e envie convites por e-mail, código QR ou App Clip. As permissões dependem do calendário e do tipo de convite.

ESCOLHA O SEU PLANO
O Base é gratuito e inclui sincronização com o Calendário Google, Google Meet, várias vistas de calendário, meteorologia e widgets.
O Advanced inclui as funcionalidades do Base e remove os anúncios.
O Premium inclui o Advanced e acrescenta calendários da Microsoft e Microsoft Teams.

A descarga é gratuita. As assinaturas opcionais renovam-se automaticamente, salvo cancelamento pelo menos 24 horas antes do fim do período atual. Pode gerir ou cancelar a assinatura nas definições da sua conta da App Store.'''],
'pl':[
'Pogoda, terminy i widżety',
'planer,agenda,tydzień,miesiąc,przypomnienie,spotkanie,wydarzenie,udostępnianie,zaproszenie,prognoza',
'Plany i pogoda w jednym miejscu. Korzystaj z widżetów i różnych widoków albo zacznij od lokalnego kalendarza bez konta w aplikacji.',
'''Połącz kalendarze i pogodę na iPhonie i iPadzie. W Cloud Calendars możesz przeglądać plany zawodowe i prywatne podczas organizowania dnia.

KALENDARZE I WIDOKI
Korzystaj z kalendarzy iCloud i połącz Kalendarz Google. Premium dodaje obsługę kalendarzy Microsoft. Wybierz widok dnia, tygodnia, miesiąca, roku lub listy.

Możesz też utworzyć lokalny kalendarz na urządzeniu bez konta Cloud Calendars. Łączenie usług i udostępnianie mogą wymagać zalogowania.

POGODA I WIDŻETY
Sprawdzaj prognozę podczas planowania. Widżety na ekran początkowy są dostępne w małym, średnim i dużym rozmiarze. Dostępność prognoz zależy od lokalizacji i dostawcy danych pogodowych.

SPOTKANIA I UDOSTĘPNIANIE
Korzystaj z Google Meet z Kalendarzem Google. Premium obsługuje także Microsoft Teams. Udostępniaj wydarzenia i kalendarze oraz wysyłaj zaproszenia przez e-mail, kod QR lub App Clip. Uprawnienia zależą od kalendarza i rodzaju zaproszenia.

WYBIERZ PLAN
Bezpłatny Base obejmuje synchronizację z Kalendarzem Google, Google Meet, różne widoki kalendarza, pogodę i widżety.
Advanced zawiera funkcje Base i usuwa reklamy.
Premium zawiera Advanced oraz dodaje kalendarze Microsoft i Microsoft Teams.

Aplikację można pobrać bezpłatnie. Opcjonalne subskrypcje odnawiają się automatycznie, chyba że anulujesz je co najmniej 24 godziny przed końcem bieżącego okresu. Subskrypcją możesz zarządzać lub ją anulować w ustawieniach konta App Store.'''],
'sv':[
'Väder, möten och widgetar',
'planerare,agenda,schema,vecka,månad,påminnelse,händelse,dela,inbjudan,prognos,bokning',
'Se dina planer och vädret på samma ställe. Använd widgetar och olika vyer, eller börja med en lokal kalender utan ett konto i appen.',
'''Samla kalendrar och väder på din iPhone och iPad. Med Cloud Calendars kan du se jobbets och privatlivets planer när du organiserar dagen.

KALENDRAR OCH VYER
Använd iCloud-kalendrar och anslut Google Kalender. Premium lägger till stöd för Microsoft-kalendrar. Välj dag-, vecko-, månads-, års- eller listvy.

Du kan också skapa en lokal kalender på enheten utan ett Cloud Calendars-konto. Anslutning till tjänster och delning kan kräva inloggning.

VÄDER OCH WIDGETAR
Se väderprognosen när du planerar dina aktiviteter. Widgetar för hemskärmen finns i små, mellanstora och stora storlekar. Tillgängliga prognoser beror på platsen och väderleverantören.

MÖTEN OCH DELNING
Använd Google Meet med Google Kalender. Premium stöder också Microsoft Teams. Dela händelser och kalendrar och skicka inbjudningar via e-post, QR-kod eller App Clip. Åtkomst beror på kalendern och typen av inbjudan.

VÄLJ DITT ABONNEMANG
Gratisplanen Base innehåller synkronisering med Google Kalender, Google Meet, olika kalendervyer, väder och widgetar.
Advanced innehåller funktionerna i Base och tar bort annonser.
Premium innehåller Advanced och lägger till Microsoft-kalendrar och Microsoft Teams.

Appen är gratis att hämta. Valfria abonnemang förnyas automatiskt om de inte sägs upp minst 24 timmar innan den aktuella perioden löper ut. Hantera eller säg upp ditt abonnemang i inställningarna för ditt App Store-konto.'''],
 'tr':[
'Hava durumu ve günlük planlar',
'ajanda,program,hafta,hatırlatıcı,toplantı,etkinlik,paylaşım,davet,tahmin,randevu,araç takımı',
'Planlarınızı ve hava durumunu birlikte görün. Araç takımlarını ve farklı görünümleri kullanın veya uygulama hesabı olmadan yerel bir takvimle başlayın.',
'''iPhone ve iPad’de takvimlerinizi ve hava durumunu birlikte görüntüleyin. Cloud Calendars ile iş ve kişisel planlarınızı inceleyerek gününüzü düzenleyin.

TAKVİMLER VE GÖRÜNÜMLER
iCloud takvimlerini kullanın ve Google Takvim’i bağlayın. Premium, Microsoft takvimleri için de destek sunar. Gün, hafta, ay, yıl ve liste görünümleri arasından seçim yapın.

Cloud Calendars hesabı oluşturmadan cihazınızda yerel bir takvim de oluşturabilirsiniz. Hizmetleri bağlamak ve paylaşım yapmak için oturum açmanız gerekebilir.

HAVA DURUMU VE ARAÇ TAKIMLARI
Plan yaparken hava tahminini kontrol edin. Ana Ekran araç takımları küçük, orta ve büyük boyutlarda sunulur. Kullanılabilir tahminler konuma ve hava durumu sağlayıcısına bağlıdır.

TOPLANTILAR VE PAYLAŞIM
Google Takvim ile Google Meet’i kullanın. Premium, Microsoft Teams’i de destekler. Etkinlikleri ve takvimleri paylaşın; e-posta, QR kodu veya App Clip ile davet gönderin. Erişim izinleri takvime ve davet türüne bağlıdır.

PLANINIZI SEÇİN
Ücretsiz Base; Google Takvim eşzamanlaması, Google Meet, farklı takvim görünümleri, hava durumu ve araç takımlarını içerir.
Advanced, Base özelliklerini içerir ve reklamları kaldırır.
Premium, Advanced özelliklerine Microsoft takvimleri ve Microsoft Teams desteğini ekler.

Uygulamayı ücretsiz indirebilirsiniz. İsteğe bağlı abonelikler, mevcut dönem sona ermeden en az 24 saat önce iptal edilmezse otomatik olarak yenilenir. Aboneliğinizi App Store hesap ayarlarınızdan yönetebilir veya iptal edebilirsiniz.'''],
'zh-Hans':[
'天气、日程安排与主屏幕小组件',
'计划,提醒,会议,活动,共享,邀请,周视图,月视图,预报,工作,生活,同步,时间表,预约',
'在同一处查看日程和天气，使用主屏幕小组件与多种日历视图。也可以先创建本地日历，无需注册应用账户。',
'''在 iPhone 和 iPad 上一起查看日历与天气。使用 Cloud Calendars 浏览工作和个人安排，规划每一天。

日历与多种视图
使用 iCloud 日历并连接 Google 日历。Premium 还支持 Microsoft 日历。可选择日、周、月、年或列表视图。

您也可以直接在设备上创建本地日历，无需注册 Cloud Calendars 账户。连接服务或使用共享功能时，可能需要登录。

天气与主屏幕小组件
安排活动时查看天气预报。主屏幕小组件提供小、中、大三种尺寸。可用的预报取决于所在位置和天气服务提供商。

会议与共享
通过 Google 日历使用 Google Meet。Premium 还支持 Microsoft Teams。共享活动和日历，并通过电子邮件、二维码或 App Clip 发送邀请。访问权限取决于日历和邀请类型。

选择方案
免费 Base 包含 Google 日历同步、Google Meet、多种日历视图、天气和小组件。
Advanced 包含 Base 的功能，并移除广告。
Premium 包含 Advanced 的功能，并增加 Microsoft 日历和 Microsoft Teams 支持。

应用可免费下载，并提供可选的自动续订订阅。除非在当前订阅期结束前至少 24 小时取消，否则订阅将自动续订。您可以在 App Store 账户设置中管理或取消订阅。'''],
'zh-Hant':[
'天氣、日程安排與主畫面小工具',
'日曆,計畫,提醒,會議,活動,共享,邀請,週檢視,月檢視,預報,工作,生活,同步,時間表,預約',
'在同一處查看行程和天氣，使用主畫面小工具與多種行事曆檢視。也可以先建立本機行事曆，無須註冊 App 帳號。',
'''在 iPhone 和 iPad 上一起查看行事曆與天氣。使用 Cloud Calendars 瀏覽工作與個人安排，規劃每一天。

行事曆與多種檢視
使用 iCloud 行事曆並連結 Google 日曆。Premium 也支援 Microsoft 行事曆。可選擇日、週、月、年或列表檢視。

您也可以直接在裝置上建立本機行事曆，無須註冊 Cloud Calendars 帳號。連結服務或使用共享功能時，可能需要登入。

天氣與主畫面小工具
安排行程時查看天氣預報。主畫面小工具提供小、中、大三種尺寸。可用的預報取決於所在地點與天氣服務供應商。

會議與共享
透過 Google 日曆使用 Google Meet。Premium 也支援 Microsoft Teams。共享活動和行事曆，並透過電子郵件、QR 碼或 App Clip 傳送邀請。存取權限取決於行事曆與邀請類型。

選擇方案
免費 Base 包含 Google 日曆同步、Google Meet、多種行事曆檢視、天氣和小工具。
Advanced 包含 Base 的功能，並移除廣告。
Premium 包含 Advanced 的功能，並新增 Microsoft 行事曆與 Microsoft Teams 支援。

App 可免費下載，並提供可選的自動續訂訂閱。除非在目前訂閱期間結束前至少 24 小時取消，否則訂閱將自動續訂。您可以在 App Store 帳號設定中管理或取消訂閱。''']}
labels={'nl-NL':('Privacy','Gebruiksvoorwaarden'),'pt-BR':('Privacidade','Termos de uso'),'pt-PT':('Privacidade','Termos de utilização'),'pl':('Prywatność','Warunki użytkowania'),'sv':('Integritet','Användarvillkor'),'tr':('Gizlilik','Kullanım Koşulları'),'zh-Hans':('隐私政策','使用条款'),'zh-Hant':('隱私權政策','使用條款')}
s=json.loads((p/'asc-current.json').read_text());ins={x['attributes']['locale']:x for x in s['appInfo']['localizations']};vs={x['attributes']['locale']:x for x in s['version']['localizations']}
summary=[]
for loc in s['selected']:
 sub,kw,promo,desc=copy[loc];a,b=labels[loc];desc+=f'\n\n{a}: https://www.cloud-calendars.com/privacy-policy\n{b}: https://www.apple.com/legal/internet-services/itunes/dev/stdeula/'
 raw={'name':ins[loc]['attributes']['name'],'subtitle':sub,'keywords':kw,'promotionalText':promo,'description':desc};limits={'name':30,'subtitle':30,'keywords':100,'promotionalText':170,'description':4000}
 fields={k:{'value':v,'characters':len(v),'utf8Bytes':len(v.encode()),'characterLimit':limits[k],'withinCharacterLimit':len(v)<=limits[k]} for k,v in raw.items()}
 assert all(v['withinCharacterLimit'] for v in fields.values()),(loc,{k:v['characters'] for k,v in fields.items()})
 tokens=set(re.findall(r'\w+',raw['name'].casefold()+' '+sub.casefold()));dups=[x for x in kw.split(',') if x.casefold() in tokens]
 assert not dups,(loc,dups)
 out={'status':'proposal_only_not_applied','locale':loc,'appId':'6744690319','targetVersion':'1.7.4','targetState':s['version']['attributes']['appStoreState'],'appInfoLocalizationId':ins[loc]['id'],'versionLocalizationId':vs[loc]['id'],'nameAction':'preserve_exact_current_draft_name','fields':fields,'current':{'appInfo':ins[loc]['attributes'],'version':vs[loc]['attributes']},'keywordChecks':{'exactDuplicateKeywords':len(kw.split(','))!=len(set(kw.split(','))),'exactTitleSubtitleTokenDuplicates':dups,'note':'Exact tokens only; compounds, inflections and CJK segmentation require linguistic judgment. UTF-8 bytes reported separately, no forced byte cap.'},'readiness':'ready_for_editorial_review_not_applied','translationConfidence':'medium','caveat':'Model-authored localized proposals, no native-speaker review or ASC write validation. Confirm tier names match shipping UI. No popularity/rank claim.','evidence':['../../product-facts.json','../localized-batch02/validation.json','asc-current.json'],'applyOnly':['subtitle','keywords','promotionalText','description'],'preserve':['name','release notes','URLs','privacy declarations','screenshots','other locales']}
 (p/(loc+'-proposal.json')).write_text(json.dumps(out,indent=2,ensure_ascii=False)+'\n');(p/(loc+'-description.txt')).write_text(desc+'\n')
 summary.append({'locale':loc,'name':raw['name'],'subtitle':sub,'counts':{k:{'characters':v['characters'],'utf8Bytes':v['utf8Bytes']} for k,v in fields.items()},'ready':True})
(p/'validation.json').write_text(json.dumps({'retrievedAt':s['retrievedAt'],'requested':s['requested'],'absentRequested':s['absentRequested'],'substitution':'bg absent from fresh appInfo/version locale intersection; zh-Hant substituted. This is evidence of this app state, not a universal assertion about locale support.','prepared':len(summary),'applied':0,'confidence':'medium; no native-speaker review','locales':summary},ensure_ascii=False,indent=2)+'\n')
print(json.dumps(summary,ensure_ascii=False,indent=2))
