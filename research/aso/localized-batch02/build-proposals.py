import json,pathlib,re,unicodedata
p=pathlib.Path(__file__).parent
copy={
'de-DE':{
'subtitle':'Termine, Wetter und Widgets',
'keywords':'planer,wochenansicht,monatsansicht,erinnerung,besprechung,ereignis,teilen,einladung,vorhersage',
'promotionalText':'Plane mit Terminen und Wetter an einem Ort. Entdecke Home-Bildschirm-Widgets und flexible Ansichten oder starte mit einem lokalen Kalender ohne App-Konto.',
'description':'''Termine und Wetter gemeinsam planen: Cloud Calendars bringt berufliche und private Kalender auf deinem iPhone und iPad zusammen.

KALENDER UND ANSICHTEN
Nutze iCloud-Kalender und verbinde Google Kalender. Mit Premium kommt die Unterstützung für Microsoft-Kalender hinzu. Wechsle zwischen Tages-, Wochen-, Monats-, Jahres- und Listenansicht.

Du kannst auch einen lokalen Kalender auf deinem Gerät anlegen, ohne ein Cloud Calendars-Konto zu erstellen. Zum Verbinden von Diensten und zum Teilen kann eine Anmeldung erforderlich sein.

WETTER UND WIDGETS
Prüfe die Wettervorhersage bei der Planung. Widgets für den Home-Bildschirm sind in kleinen, mittleren und großen Größen verfügbar. Die verfügbaren Vorhersagen hängen vom Standort und Wetteranbieter ab.

BESPRECHUNGEN UND EINLADUNGEN
Nutze Google Meet mit Google Kalender. Premium unterstützt zusätzlich Microsoft Teams. Teile Ereignisse und Kalender und lade andere per E-Mail, QR-Code oder App Clip ein. Die Zugriffsrechte hängen vom Kalender und der Art der Einladung ab.

WÄHLE DEINEN TARIF
Base ist kostenlos und umfasst Google-Kalender-Synchronisierung, Google Meet, mehrere Kalenderansichten, Wetter und Widgets.
Advanced enthält die Funktionen von Base und entfernt Werbung.
Premium enthält Advanced und ergänzt Microsoft-Kalender und Microsoft Teams.

Der Download ist kostenlos. Optional sind Abonnements mit automatischer Verlängerung verfügbar. Aktuelle Preise findest du in der App oder im App Store. Die Zahlung wird bei Kaufbestätigung deinem Apple-ID-Konto belastet. Das Abonnement verlängert sich automatisch, wenn du es nicht mindestens 24 Stunden vor Ablauf des aktuellen Zeitraums kündigst. Die Verlängerung wird innerhalb der letzten 24 Stunden vor Ablauf berechnet. Verwalte oder kündige dein Abonnement in deinen App-Store-Account-Einstellungen.

Datenschutz: https://www.cloud-calendars.com/privacy-policy
Nutzungsbedingungen: https://www.apple.com/legal/internet-services/itunes/dev/stdeula/'''
},
'fr-FR':{
'subtitle':'Météo, rendez-vous et widgets',
'keywords':'calendrier,planning,semaine,mois,rappel,réunion,événement,partage,invitation,prévisions,organisation',
'promotionalText':'Vos rendez-vous et la météo au même endroit. Découvrez les widgets et les vues du calendrier, ou créez un calendrier local sans compte dans l’app.',
'description':'''Réunissez vos calendriers et la météo sur iPhone et iPad. Cloud Calendars vous aide à consulter vos rendez-vous professionnels et personnels pour préparer votre journée.

VOS CALENDRIERS, PLUSIEURS VUES
Utilisez vos calendriers iCloud et connectez Google Agenda. Premium ajoute la prise en charge des calendriers Microsoft. Passez des vues Jour et Semaine aux vues Mois, Année et Liste.

Vous pouvez aussi créer un calendrier local sur votre appareil sans compte Cloud Calendars. La connexion à un service et le partage peuvent nécessiter une identification.

MÉTÉO ET WIDGETS
Consultez les prévisions pendant que vous organisez vos activités. Choisissez des widgets petits, moyens ou grands pour l’écran d’accueil. Les prévisions disponibles dépendent du lieu et du fournisseur météo.

RÉUNIONS ET PARTAGE
Utilisez Google Meet avec Google Agenda. Premium ajoute Microsoft Teams. Partagez des événements et des calendriers, puis envoyez des invitations par e-mail, code QR ou App Clip. Les droits d’accès dépendent du calendrier et du type d’invitation.

CHOISISSEZ VOTRE FORMULE
Base est gratuit et comprend la synchronisation avec Google Agenda, Google Meet, plusieurs vues de calendrier, la météo et les widgets.
Advanced comprend les fonctions de Base et supprime les publicités.
Premium comprend Advanced et ajoute les calendriers Microsoft et Microsoft Teams.

Le téléchargement est gratuit, avec des abonnements facultatifs à renouvellement automatique. Consultez les prix en vigueur dans l’app ou l’App Store. Le paiement est débité de votre compte Apple à la confirmation de l’achat. L’abonnement se renouvelle automatiquement, sauf résiliation au moins 24 heures avant la fin de la période en cours. Le renouvellement est facturé dans les 24 heures précédant cette échéance. Gérez ou résiliez votre abonnement dans les réglages de votre compte App Store.

Confidentialité : https://www.cloud-calendars.com/privacy-policy
Conditions d’utilisation : https://www.apple.com/legal/internet-services/itunes/dev/stdeula/'''
},
'es-ES':{
'subtitle':'Tiempo, agenda y widgets',
'keywords':'planificador,horario,semana,mes,recordatorio,reunión,evento,compartir,invitación,previsión,citas',
'promotionalText':'Consulta tus planes y el tiempo en un mismo lugar. Prueba los widgets y las distintas vistas, o crea un calendario local sin una cuenta en la app.',
'description':'''Reúne tus calendarios y el tiempo en tu iPhone y iPad. Consulta tus planes de trabajo y personales con Cloud Calendars para organizar el día.

TUS CALENDARIOS, DISTINTAS VISTAS
Utiliza calendarios de iCloud y conecta Google Calendar. Premium añade compatibilidad con calendarios de Microsoft. Elige entre las vistas de día, semana, mes, año y lista.

También puedes crear un calendario local en el dispositivo sin una cuenta de Cloud Calendars. Para conectar servicios y compartir contenido puede ser necesario iniciar sesión.

EL TIEMPO Y LOS WIDGETS
Consulta la previsión mientras organizas tus actividades. Los widgets para la pantalla de inicio están disponibles en tamaño pequeño, mediano y grande. Las previsiones disponibles dependen de la ubicación y del proveedor meteorológico.

REUNIONES E INVITACIONES
Utiliza Google Meet con Google Calendar. Premium también admite Microsoft Teams. Comparte eventos y calendarios y envía invitaciones por correo electrónico, código QR o App Clip. Los permisos dependen del calendario y del tipo de invitación.

ELIGE TU PLAN
Base es gratuito e incluye sincronización con Google Calendar, Google Meet, distintas vistas de calendario, el tiempo y widgets.
Advanced incluye las funciones de Base y elimina los anuncios.
Premium incluye Advanced y añade calendarios de Microsoft y Microsoft Teams.

La descarga es gratuita y hay suscripciones opcionales con renovación automática. Consulta los precios actuales en la app o el App Store. El pago se carga a tu cuenta de Apple al confirmar la compra. La suscripción se renueva automáticamente salvo que la canceles al menos 24 horas antes de que termine el periodo actual. El cobro de la renovación se realiza en las 24 horas anteriores al final del periodo. Puedes gestionar o cancelar la suscripción en los ajustes de tu cuenta del App Store.

Privacidad: https://www.cloud-calendars.com/privacy-policy
Condiciones de uso: https://www.apple.com/legal/internet-services/itunes/dev/stdeula/'''
},
'it':{
'subtitle':'Meteo, impegni e widget',
'keywords':'agenda,pianificazione,settimana,mese,promemoria,riunione,evento,condivisione,invito,previsioni',
'promotionalText':'Impegni e meteo nello stesso posto. Scopri i widget e le diverse viste, oppure crea un calendario locale senza un account nell’app.',
'description':'''Riunisci calendari e meteo su iPhone e iPad. Con Cloud Calendars puoi consultare gli impegni di lavoro e personali e organizzare la giornata.

I TUOI CALENDARI, PIÙ VISTE
Usa i calendari iCloud e collega Google Calendar. Premium aggiunge il supporto per i calendari Microsoft. Scegli tra le viste Giorno, Settimana, Mese, Anno ed Elenco.

Puoi anche creare un calendario locale sul dispositivo senza un account Cloud Calendars. Il collegamento ai servizi e la condivisione possono richiedere l’accesso a un account.

METEO E WIDGET
Consulta le previsioni mentre organizzi le tue attività. I widget per la schermata Home sono disponibili nei formati piccolo, medio e grande. La disponibilità delle previsioni dipende dal luogo e dal fornitore meteo.

RIUNIONI E INVITI
Usa Google Meet con Google Calendar. Premium supporta anche Microsoft Teams. Condividi eventi e calendari e invia inviti tramite email, codice QR o App Clip. I permessi dipendono dal calendario e dal tipo di invito.

SCEGLI IL TUO PIANO
Base è gratuito e include la sincronizzazione con Google Calendar, Google Meet, diverse viste del calendario, meteo e widget.
Advanced include le funzioni di Base e rimuove gli annunci.
Premium include Advanced e aggiunge i calendari Microsoft e Microsoft Teams.

Il download è gratuito, con abbonamenti facoltativi a rinnovo automatico. Consulta i prezzi attuali nell’app o nell’App Store. Il pagamento viene addebitato sul tuo account Apple alla conferma dell’acquisto. L’abbonamento si rinnova automaticamente, salvo disdetta almeno 24 ore prima della fine del periodo in corso. Il rinnovo viene addebitato nelle 24 ore precedenti la scadenza. Puoi gestire o annullare l’abbonamento nelle impostazioni del tuo account App Store.

Privacy: https://www.cloud-calendars.com/privacy-policy
Termini di utilizzo: https://www.apple.com/legal/internet-services/itunes/dev/stdeula/'''
},
'ja':{
'subtitle':'天気・予定管理・ホーム画面ウィジェット',
'keywords':'スケジュール,手帳,日程,リマインダー,会議,イベント,共有,招待,週間表示,月間表示,予報,仕事,プライベート,同期',
'promotionalText':'予定と天気をまとめて確認。ホーム画面ウィジェットや多彩な表示を活用できます。アプリのアカウントを作らずに、端末内のローカルカレンダーから始めることもできます。',
'description':'''iPhoneとiPadで、カレンダーと天気をまとめて確認。Cloud Calendarsで仕事とプライベートの予定を見ながら、一日の計画を立てられます。

カレンダーをまとめて表示
iCloudのカレンダーを利用し、Google カレンダーを接続できます。PremiumではMicrosoftのカレンダーにも対応。日・週・月・年・リスト表示から、用途に合った表示を選べます。

Cloud Calendarsのアカウントを作らずに、端末内のローカルカレンダーを作成することもできます。サービスの接続や共有には、サインインが必要になる場合があります。

天気とホーム画面ウィジェット
予定を立てながら天気予報を確認できます。ホーム画面ウィジェットは小・中・大のサイズに対応しています。利用できる予報は地域や気象情報の提供元によって異なります。

会議と共有
Google カレンダーでGoogle Meetを利用できます。PremiumではMicrosoft Teamsにも対応。イベントやカレンダーを共有し、メール、QRコード、App Clipで招待できます。アクセス権はカレンダーや招待の種類によって異なります。

プランについて
無料のBaseには、Google カレンダーの同期、Google Meet、複数のカレンダー表示、天気、ウィジェットが含まれます。
AdvancedにはBaseの機能が含まれ、広告が非表示になります。
PremiumにはAdvancedの機能に加え、MicrosoftのカレンダーとMicrosoft Teamsへの対応が含まれます。

ダウンロードは無料です。任意で自動更新のサブスクリプションを購入できます。現在の価格はアプリ内またはApp Storeでご確認ください。購入確定時にAppleアカウントに請求されます。現在の期間が終了する24時間前までに解約しない限り、自動的に更新されます。更新料金は期間終了前の24時間以内に請求されます。サブスクリプションはApp Storeのアカウント設定で管理・解約できます。

プライバシーポリシー: https://www.cloud-calendars.com/privacy-policy
利用規約: https://www.apple.com/legal/internet-services/itunes/dev/stdeula/'''
},
'ko':{
'subtitle':'날씨와 일정 관리, 홈 화면 위젯',
'keywords':'스케줄,다이어리,플래너,알림,회의,이벤트,공유,초대,주간보기,월간보기,예보,업무,개인,동기화,약속,시간표',
'promotionalText':'일정과 날씨를 한곳에서 확인하세요. 홈 화면 위젯과 다양한 보기를 활용하거나, 앱 계정 없이 기기에 로컬 캘린더를 만들어 시작할 수 있어요.',
'description':'''iPhone과 iPad에서 캘린더와 날씨를 함께 확인하세요. Cloud Calendars로 업무 일정과 개인 일정을 살펴보며 하루를 계획할 수 있어요.

캘린더와 다양한 보기
iCloud 캘린더를 사용하고 Google Calendar를 연결하세요. Premium은 Microsoft 캘린더도 지원합니다. 일간, 주간, 월간, 연간, 목록 보기 중에서 원하는 방식을 선택할 수 있어요.

Cloud Calendars 계정을 만들지 않고 기기에 로컬 캘린더를 생성할 수도 있어요. 서비스 연결이나 공유 기능에는 로그인이 필요할 수 있습니다.

날씨와 홈 화면 위젯
계획을 세우면서 일기예보를 확인하세요. 홈 화면 위젯은 소형, 중형, 대형 크기를 지원합니다. 제공되는 예보는 위치와 기상 정보 제공업체에 따라 달라집니다.

회의와 공유
Google Calendar에서 Google Meet를 사용할 수 있어요. Premium은 Microsoft Teams도 지원합니다. 이벤트와 캘린더를 공유하고 이메일, QR 코드 또는 App Clip으로 초대하세요. 접근 권한은 캘린더와 초대 유형에 따라 다릅니다.

요금제 안내
무료 Base에는 Google Calendar 동기화, Google Meet, 다양한 캘린더 보기, 날씨, 위젯이 포함됩니다.
Advanced에는 Base 기능이 포함되며 광고가 제거됩니다.
Premium에는 Advanced 기능과 함께 Microsoft 캘린더 및 Microsoft Teams 지원이 포함됩니다.

앱은 무료로 다운로드할 수 있으며, 자동 갱신 구독을 선택하여 구매할 수 있습니다. 현재 가격은 앱 또는 App Store에서 확인하세요. 구매 확정 시 Apple 계정으로 요금이 청구됩니다. 현재 구독 기간이 끝나기 최소 24시간 전에 취소하지 않으면 자동으로 갱신됩니다. 갱신 요금은 기간 종료 전 24시간 이내에 청구됩니다. App Store 계정 설정에서 구독을 관리하거나 취소할 수 있습니다.

개인정보 처리방침: https://www.cloud-calendars.com/privacy-policy
이용 약관: https://www.apple.com/legal/internet-services/itunes/dev/stdeula/'''
}}
s=json.loads((p/'asc-current-20261021.json').read_text())
i=next(x for x in s['appInfos'] if x['attributes']['appStoreState']=='PREPARE_FOR_SUBMISSION')
v=next(x for x in s['versions'] if x['attributes']['versionString']=='1.7.4')
names={x['attributes']['locale']:x for x in i['localizations']}
versions={x['attributes']['locale']:x for x in v['localizations']}
limits={'name':30,'subtitle':30,'keywords':100,'promotionalText':170,'description':4000}
summary=[]
for locale,c in copy.items():
 c={'name':names[locale]['attributes']['name'],**c}
 fields={k:{'value':text,'characters':len(text),'utf8Bytes':len(text.encode('utf-8')),'characterLimit':limits[k],'withinCharacterLimit':len(text)<=limits[k]} for k,text in c.items()}
 assert all(f['withinCharacterLimit'] for f in fields.values()),(locale,[(k,x['characters']) for k,x in fields.items()])
 title_tokens=set(re.findall(r'\w+',unicodedata.normalize('NFC',c['name']+' '+c['subtitle']).casefold()))
 kw=c['keywords'].split(',')
 dup=[x for x in kw if x.casefold() in title_tokens]
 assert not dup,(locale,dup)
 out={'date':'2026-10-21','status':'proposal_only_not_applied','locale':locale,'appId':'6744690319','targetVersion':'1.7.4','targetState':v['attributes']['appStoreState'],'appInfoLocalizationId':names[locale]['id'],'versionLocalizationId':versions[locale]['id'],'nameAction':'preserve_exact_current_draft_name','fields':fields,'current':{'appInfo':names[locale]['attributes'],'version':versions[locale]['attributes']},'keywordChecks':{'exactDuplicateKeywords':len(kw)!=len(set(kw)),'exactTitleSubtitleTokenDuplicates':dup,'note':'Exact Unicode token check only. Japanese/Korean segmentation and grammatical forms require linguistic judgment. Keywords use actual localized terms; no provider trademarks added to keyword field. UTF-8 bytes reported, not treated as a rejection threshold.'},'readiness':'ready_for_editorial_review_not_applied','translationConfidence':'medium-high' if locale in ['de-DE','fr-FR','es-ES','it'] else 'medium','translationCaveat':'Model-authored localization; no native-speaker review or live ASC validation performed. Brand and tier names preserved. Confirm localized tier labels match shipping UI before submission.','evidence':['../../product-facts.json','../english-applied-20261021.json','asc-current-20261021.json'],'claims':'Supported features only. No standalone Lock Screen widget, blanket Exchange, forecast-duration, privacy guarantee, superiority, search-volume or ranking claim. Sharing permissions and sign-in qualified.','mutationPolicy':'Do not change name, URLs, privacy fields, release notes, screenshots or other locales as part of applying these four proposed fields.'}
 (p/(locale+'-proposal.json')).write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
 (p/(locale+'-description.txt')).write_text(c['description']+'\n')
 summary.append({'locale':locale,'name':c['name'],'subtitle':c['subtitle'],'counts':{k:{'characters':f['characters'],'utf8Bytes':f['utf8Bytes']} for k,f in fields.items()},'ready':True,'confidence':out['translationConfidence']})
(p/'validation.json').write_text(json.dumps({'date':'2026-10-21','freshReadAt':s['retrievedAt'],'prepared':6,'readyForEditorialReview':6,'applied':0,'validation':'All six retain current draft names. All character limits pass; no exact keyword or name/subtitle-token duplication. No byte rejection threshold imposed. No native speaker review; proposals are not ranking predictions.','locales':summary},ensure_ascii=False,indent=2)+'\n')
print(json.dumps(summary,ensure_ascii=False,indent=2))
