import pathlib,json,re
p=pathlib.Path(__file__).parent
copy={
'es-MX':[
'Clima, agenda y widgets',
'planificador,horario,semana,mes,recordatorio,reunión,evento,compartir,invitación,pronóstico,citas',
'Consulta tus planes y el clima en un solo lugar. Usa widgets y distintas vistas, o empieza con un calendario local sin una cuenta en la app.',
'''Consulta tus compromisos de trabajo, planes personales y el clima en iPhone y iPad con Cloud Calendars.

CALENDARIOS Y VISTAS
Usa calendarios de iCloud y conecta Calendario de Google. Premium agrega compatibilidad con calendarios de Microsoft. Elige entre las vistas de día, semana, mes, año y lista.

También puedes crear un calendario local en tu dispositivo sin una cuenta de Cloud Calendars. Conectar servicios y compartir contenido puede requerir que inicies sesión.

CLIMA, WIDGETS Y CONTENIDO COMPARTIDO
Revisa el pronóstico mientras planeas tus actividades. Los widgets para la pantalla de inicio están disponibles en tamaño pequeño, mediano y grande. Los pronósticos disponibles dependen de la ubicación y del proveedor meteorológico. Comparte eventos y calendarios y envía invitaciones por correo electrónico, código QR o App Clip. Los permisos dependen del calendario y del tipo de invitación.

ELIGE TU PLAN
Base es gratuito e incluye sincronización con Calendario de Google, Google Meet, distintas vistas de calendario, clima y widgets.
Advanced incluye las funciones de Base y elimina los anuncios.
Premium incluye Advanced y agrega calendarios de Microsoft y Microsoft Teams.

La descarga es gratuita, con suscripciones opcionales de renovación automática. Antes de suscribirte, revisa el precio local vigente y el periodo de facturación en la app o en App Store. La suscripción se renueva a menos que la canceles al menos 24 horas antes de que termine el periodo actual. Puedes administrarla o cancelarla en la configuración de tu cuenta de App Store.''',('Privacidad','Términos de uso')],
'fr-CA':[
'Météo, rendez-vous et widgets',
'calendrier,horaire,semaine,mois,rappel,réunion,événement,partage,invitation,prévisions,planification',
'Vos rendez-vous et la météo au même endroit. Utilisez les widgets et différentes vues, ou créez un calendrier local sans compte dans l’app.',
'''Consultez vos rendez-vous professionnels, vos projets personnels et la météo sur iPhone et iPad avec Cloud Calendars.

CALENDRIERS ET VUES
Utilisez vos calendriers iCloud et connectez Google Agenda. Premium ajoute la prise en charge des calendriers Microsoft. Choisissez une vue par jour, semaine, mois, année ou liste.

Vous pouvez aussi créer un calendrier local sur votre appareil sans compte Cloud Calendars. La connexion aux services et le partage peuvent nécessiter une ouverture de session.

MÉTÉO, WIDGETS ET PARTAGE
Consultez les prévisions pendant que vous planifiez vos activités. Les widgets pour l’écran d’accueil sont offerts en formats petit, moyen et grand. Les prévisions disponibles dépendent du lieu et du fournisseur météo. Partagez des événements et des calendriers et envoyez des invitations par courriel, code QR ou App Clip. Les droits d’accès dépendent du calendrier et du type d’invitation.

CHOISISSEZ VOTRE FORFAIT
Base est gratuit et comprend la synchronisation avec Google Agenda, Google Meet, plusieurs vues du calendrier, la météo et les widgets.
Advanced comprend les fonctions de Base et supprime les publicités.
Premium comprend Advanced et ajoute les calendriers Microsoft et Microsoft Teams.

Le téléchargement est gratuit, avec des abonnements facultatifs à renouvellement automatique. Avant de vous abonner, vérifiez le prix local en vigueur et la période de facturation dans l’app ou l’App Store. L’abonnement se renouvelle, sauf annulation au moins 24 heures avant la fin de la période en cours. Vous pouvez le gérer ou l’annuler dans les réglages de votre compte App Store.''',('Confidentialité','Conditions d’utilisation')],
'el':[
'Καιρός, ραντεβού και widget',
'ατζέντα,πρόγραμμα,εβδομάδα,μήνας,υπενθύμιση,συνάντηση,συμβάν,κοινοποίηση,πρόσκληση,πρόγνωση',
'Δείτε τα σχέδιά σας μαζί με τον καιρό. Χρησιμοποιήστε widget και διαφορετικές προβολές ή ξεκινήστε με τοπικό ημερολόγιο χωρίς λογαριασμό στην εφαρμογή.',
'''Δείτε επαγγελματικά ραντεβού, προσωπικά σχέδια και τον καιρό σε iPhone και iPad με το Cloud Calendars.

ΗΜΕΡΟΛΟΓΙΑ ΚΑΙ ΠΡΟΒΟΛΕΣ
Χρησιμοποιήστε ημερολόγια iCloud και συνδέστε το Ημερολόγιο Google. Το Premium προσθέτει υποστήριξη για ημερολόγια Microsoft. Επιλέξτε προβολή ημέρας, εβδομάδας, μήνα, έτους ή λίστας.

Μπορείτε επίσης να δημιουργήσετε τοπικό ημερολόγιο στη συσκευή χωρίς λογαριασμό Cloud Calendars. Η σύνδεση υπηρεσιών και η κοινοποίηση ενδέχεται να απαιτούν σύνδεση σε λογαριασμό.

ΚΑΙΡΟΣ, WIDGET ΚΑΙ ΚΟΙΝΟΠΟΙΗΣΗ
Ελέγξτε την πρόγνωση καθώς σχεδιάζετε τη μέρα σας. Τα widget της οθόνης Αφετηρίας διατίθενται σε μικρό, μεσαίο και μεγάλο μέγεθος. Οι διαθέσιμες προγνώσεις εξαρτώνται από την τοποθεσία και τον πάροχο καιρού. Μοιραστείτε συμβάντα και ημερολόγια και στείλτε προσκλήσεις με email, κωδικό QR ή App Clip. Τα δικαιώματα εξαρτώνται από το ημερολόγιο και τον τύπο πρόσκλησης.

ΕΠΙΛΕΞΤΕ ΠΡΟΓΡΑΜΜΑ
Το δωρεάν Base περιλαμβάνει συγχρονισμό με το Ημερολόγιο Google, Google Meet, διαφορετικές προβολές ημερολογίου, καιρό και widget.
Το Advanced περιλαμβάνει τις λειτουργίες του Base και αφαιρεί τις διαφημίσεις.
Το Premium περιλαμβάνει το Advanced και προσθέτει ημερολόγια Microsoft και Microsoft Teams.

Η λήψη είναι δωρεάν, με προαιρετικές συνδρομές αυτόματης ανανέωσης. Πριν εγγραφείτε, ελέγξτε την τρέχουσα τοπική τιμή και την περίοδο χρέωσης στην εφαρμογή ή στο App Store. Η συνδρομή ανανεώνεται αν δεν ακυρωθεί τουλάχιστον 24 ώρες πριν από τη λήξη της τρέχουσας περιόδου. Διαχειριστείτε ή ακυρώστε τη στις ρυθμίσεις του λογαριασμού σας στο App Store.''',('Απόρρητο','Όροι χρήσης')],
'hr':[
'Vrijeme, sastanci i widgeti',
'planer,raspored,tjedan,mjesec,podsjetnik,događaj,dijeljenje,pozivnica,prognoza,termin',
'Pregledajte planove i vrijeme zajedno. Koristite widgete i različite prikaze ili počnite s lokalnim kalendarom bez računa u aplikaciji.',
'''Pregledajte poslovne obveze, privatne planove i vrijeme na iPhoneu i iPadu uz Cloud Calendars.

KALENDARI I PRIKAZI
Koristite iCloud kalendare i povežite Google kalendar. Premium dodaje podršku za Microsoftove kalendare. Odaberite prikaz dana, tjedna, mjeseca, godine ili popisa.

Možete izraditi i lokalni kalendar na uređaju bez računa za Cloud Calendars. Povezivanje usluga i dijeljenje mogu zahtijevati prijavu.

VRIJEME, WIDGETI I DIJELJENJE
Provjerite prognozu dok planirate. Widgeti za početni zaslon dostupni su u maloj, srednjoj i velikoj veličini. Dostupne prognoze ovise o lokaciji i pružatelju vremenskih podataka. Dijelite događaje i kalendare te šaljite pozivnice e-poštom, QR kodom ili putem App Clipa. Prava pristupa ovise o kalendaru i vrsti pozivnice.

ODABERITE PLAN
Besplatni Base uključuje sinkronizaciju s Google kalendarom, Google Meet, različite prikaze kalendara, vrijeme i widgete.
Advanced uključuje značajke plana Base i uklanja oglase.
Premium uključuje Advanced i dodaje Microsoftove kalendare i Microsoft Teams.

Preuzimanje je besplatno, uz neobavezne pretplate s automatskom obnovom. Prije pretplate provjerite trenutačnu lokalnu cijenu i obračunsko razdoblje u aplikaciji ili App Storeu. Pretplata se obnavlja ako je ne otkažete najmanje 24 sata prije kraja tekućeg razdoblja. Njome možete upravljati ili je otkazati u postavkama računa za App Store.''',('Privatnost','Uvjeti korištenja')],
'sk':[
'Počasie, stretnutia a widgety',
'diár,plánovač,týždeň,mesiac,pripomienka,udalosť,zdieľanie,pozvánka,predpoveď,rozvrh',
'Prezerajte si plány a počasie spolu. Používajte widgety a rôzne zobrazenia alebo začnite miestnym kalendárom bez účtu v aplikácii.',
'''Prezerajte si pracovné aj osobné plány spolu s počasím na iPhone a iPade pomocou Cloud Calendars.

KALENDÁRE A ZOBRAZENIA
Používajte kalendáre iCloud a pripojte Kalendár Google. Premium pridáva podporu kalendárov Microsoft. Vyberte si zobrazenie dňa, týždňa, mesiaca, roka alebo zoznamu.

Môžete tiež vytvoriť miestny kalendár v zariadení bez účtu Cloud Calendars. Pripojenie služieb a zdieľanie môžu vyžadovať prihlásenie.

POČASIE, WIDGETY A ZDIEĽANIE
Pri plánovaní si pozrite predpoveď. Widgety pre plochu sú dostupné v malej, strednej a veľkej veľkosti. Dostupné predpovede závisia od miesta a poskytovateľa počasia. Zdieľajte udalosti a kalendáre a posielajte pozvánky e-mailom, QR kódom alebo cez App Clip. Oprávnenia závisia od kalendára a typu pozvánky.

VYBERTE SI PROGRAM
Bezplatný Base zahŕňa synchronizáciu s Kalendárom Google, Google Meet, rôzne zobrazenia kalendára, počasie a widgety.
Advanced obsahuje funkcie Base a odstraňuje reklamy.
Premium obsahuje Advanced a pridáva kalendáre Microsoft a Microsoft Teams.

Stiahnutie je bezplatné s voliteľným automaticky obnovovaným predplatným. Pred zakúpením si overte aktuálnu miestnu cenu a fakturačné obdobie v aplikácii alebo App Store. Predplatné sa obnoví, ak ho nezrušíte aspoň 24 hodín pred koncom aktuálneho obdobia. Spravovať alebo zrušiť ho môžete v nastaveniach účtu App Store.''',('Súkromie','Podmienky používania')],
'sl-SI':[
'Vreme, sestanki in gradniki',
'načrtovalnik,urnik,teden,mesec,opomnik,dogodek,deljenje,povabilo,napoved,termin',
'Oglejte si načrte in vreme skupaj. Uporabite gradnike in različne poglede ali začnite z lokalnim koledarjem brez računa v aplikaciji.',
'''Oglejte si službene obveznosti, osebne načrte in vreme na napravah iPhone in iPad s Cloud Calendars.

KOLEDARJI IN POGLEDI
Uporabljajte koledarje iCloud in povežite Google Koledar. Premium doda podporo za Microsoftove koledarje. Izberite dnevni, tedenski, mesečni, letni pogled ali seznam.

Ustvarite lahko tudi lokalni koledar v napravi brez računa Cloud Calendars. Povezovanje storitev in deljenje lahko zahtevata prijavo.

VREME, GRADNIKI IN DELJENJE
Med načrtovanjem preverite vremensko napoved. Gradniki za začetni zaslon so na voljo v majhni, srednji in veliki velikosti. Razpoložljive napovedi so odvisne od lokacije in ponudnika vremenskih podatkov. Delite dogodke in koledarje ter pošljite povabila po e-pošti, s kodo QR ali prek App Clipa. Pravice dostopa so odvisne od koledarja in vrste povabila.

IZBERITE PAKET
Brezplačni Base vključuje sinhronizacijo z Google Koledarjem, Google Meet, različne poglede koledarja, vreme in gradnike.
Advanced vključuje funkcije Base in odstrani oglase.
Premium vključuje Advanced ter doda Microsoftove koledarje in Microsoft Teams.

Prenos je brezplačen z izbirnimi naročninami, ki se samodejno obnavljajo. Pred naročilom preverite trenutno lokalno ceno in obračunsko obdobje v aplikaciji ali App Store. Naročnina se obnovi, če je ne prekličete vsaj 24 ur pred koncem trenutnega obdobja. Upravljate ali prekličete jo lahko v nastavitvah računa App Store.''',('Zasebnost','Pogoji uporabe')],
'ru':[
'Погода, встречи и виджеты',
'планировщик,расписание,неделя,месяц,напоминание,событие,приглашение,прогноз,планы,общий доступ',
'Планы и погода в одном месте. Используйте виджеты и разные виды календаря или начните с локального календаря без аккаунта приложения.',
'''Просматривайте рабочие и личные планы вместе с погодой на iPhone и iPad с помощью Cloud Calendars.

КАЛЕНДАРИ И ВИДЫ
Используйте календари iCloud и подключайте Google Календарь. Premium добавляет поддержку календарей Microsoft. Выбирайте вид дня, недели, месяца, года или списка.

Можно также создать локальный календарь на устройстве без аккаунта Cloud Calendars. Подключение сервисов и общий доступ могут потребовать входа в аккаунт.

ПОГОДА, ВИДЖЕТЫ И ОБЩИЙ ДОСТУП
Проверяйте прогноз, когда строите планы. Виджеты для экрана «Домой» доступны в малом, среднем и большом размерах. Наличие прогнозов зависит от местоположения и поставщика погодных данных. Делитесь событиями и календарями, отправляйте приглашения по электронной почте, с помощью QR-кода или через App Clip. Права доступа зависят от календаря и типа приглашения.

ВЫБЕРИТЕ ПЛАН
Бесплатный Base включает синхронизацию с Google Календарём, Google Meet, разные виды календаря, погоду и виджеты.
Advanced включает функции Base и убирает рекламу.
Premium включает Advanced и добавляет календари Microsoft и Microsoft Teams.

Приложение можно скачать бесплатно. Доступны необязательные подписки с автоматическим продлением. Перед оформлением проверьте текущую местную цену и расчётный период в приложении или App Store. Подписка продлевается, если её не отменить как минимум за 24 часа до окончания текущего периода. Управлять подпиской или отменить её можно в настройках аккаунта App Store.''',('Конфиденциальность','Условия использования')]
}
english='''Bring your calendars and weather together on iPhone and iPad. See work appointments and personal plans while planning your day.

CALENDARS AND VIEWS
Use iCloud calendars and connect Google Calendar. Premium adds Microsoft Calendar support. Choose Day, Week, Month, Year or List view.

You can also create a local calendar on your device without a Cloud Calendars account. Connecting services and sharing may require sign-in.

WEATHER, WIDGETS AND SHARING
Check the forecast as you plan. Home Screen widgets come in small, medium and large sizes. Available forecasts depend on your location and weather provider. Share events and calendars, and send invitations by email, QR code or App Clip. Access depends on the calendar and invitation type.

CHOOSE YOUR PLAN
Free Base includes Google Calendar sync, Google Meet support, multiple calendar views, weather and widgets.
Advanced includes Base features and removes ads.
Premium includes Advanced and adds Microsoft Calendar and Microsoft Teams support.

The app is free to download, with optional auto-renewing subscriptions. Check the current local price and billing period in the app or App Store before subscribing. Subscriptions renew unless cancelled at least 24 hours before the current period ends. Manage or cancel your subscription in your App Store account settings.'''
eng={
'en-GB':('diary,planner,agenda,appointment,week,month,reminder,meeting,event,shared,invite,weather,forecast','Plan work appointments and personal time with calendars, weather and Home Screen widgets. Start a local calendar without an app account.'),
'en-CA':('schedule,planner,agenda,meeting,reminder,event,shared,invite,month,week,weather,forecast,appointment','See work and personal plans alongside the weather. Explore calendar views and Home Screen widgets, or start a local calendar without an app account.'),
'en-AU':('weather,forecast,planner,agenda,schedule,outdoor,daily,meeting,event,reminder,week,month,shared','Check the forecast while planning your day. Use calendar views and Home Screen widgets, or start a local calendar without an app account.')}
for loc,(kw,promo) in eng.items():copy[loc]=['Google, Microsoft & iCloud',kw,promo,english,('Privacy Policy','Terms of Use')]
s=json.loads((p/'asc-current.json').read_text());ins={x['attributes']['locale']:x for x in s['appInfo']['localizations']};vs={x['attributes']['locale']:x for x in s['version']['localizations']};summary=[]
for loc in s['selected']:
 sub,kw,promo,desc,labels=copy[loc];a,b=labels;desc+=f'\n\n{a}: https://www.cloud-calendars.com/privacy-policy\n{b}: https://www.apple.com/legal/internet-services/itunes/dev/stdeula/'
 raw={'name':ins[loc]['attributes']['name'],'subtitle':sub,'keywords':kw,'promotionalText':promo,'description':desc};limits={'name':30,'subtitle':30,'keywords':100,'promotionalText':170,'description':4000}
 fields={k:{'value':v,'characters':len(v),'utf8Bytes':len(v.encode()),'characterLimit':limits[k],'withinCharacterLimit':len(v)<=limits[k]} for k,v in raw.items()};assert all(v['withinCharacterLimit'] for v in fields.values()),(loc,{k:v['characters'] for k,v in fields.items()})
 tokens=set(re.findall(r'\w+',raw['name'].casefold()+' '+sub.casefold()));dups=[x for x in kw.split(',') if x.casefold() in tokens];assert not dups,(loc,dups)
 out={'status':'proposal_only_not_applied','locale':loc,'appId':'6744690319','targetVersion':'1.7.4','targetState':s['version']['attributes']['appStoreState'],'appInfoLocalizationId':ins[loc]['id'],'versionLocalizationId':vs[loc]['id'],'nameAction':'preserve_exact_current_draft_name','fields':fields,'current':{'appInfo':ins[loc]['attributes'],'version':vs[loc]['attributes']},'keywordChecks':{'exactDuplicateKeywords':len(kw.split(','))!=len(set(kw.split(','))),'exactTitleSubtitleTokenDuplicates':dups,'note':'Unicode code-point counts, UTF-8 bytes separate. Token checks do not resolve grammar/inflections.'},'readiness':'ready_for_editorial_review_not_applied','translationConfidence':'high' if loc.startswith('en-') else 'medium','caveat':'No native-speaker or ASC write validation. English allocation is an editorial hypothesis, not measured demand. Verify tier labels match shipping UI.','evidence':['../../product-facts.json','../localized-batch04/audit.json','asc-current.json'],'applyOnly':['subtitle','keywords','promotionalText','description'],'preserve':['name','release notes','URLs','privacy declarations','screenshots','other locales']}
 (p/(loc+'-proposal.json')).write_text(json.dumps(out,indent=2,ensure_ascii=False)+'\n');(p/(loc+'-description.txt')).write_text(desc+'\n');summary.append({'locale':loc,'name':raw['name'],'subtitle':sub,'counts':{k:{'characters':v['characters'],'utf8Bytes':v['utf8Bytes']} for k,v in fields.items()},'ready':True})
(p/'validation.json').write_text(json.dumps({'retrievedAt':s['retrievedAt'],'prepared':len(summary),'applied':0,'locales':summary},ensure_ascii=False,indent=2)+'\n');print(json.dumps(summary,ensure_ascii=False,indent=2))
