import pathlib,json,re
p=pathlib.Path(__file__).parent
# Localized original copy; brand and tier names intentionally unchanged.
copy={
'bn-BD':[
'আবহাওয়া ও পরিকল্পনা',
'সময়সূচি,সভা,ঘটনা,স্মরণ,আমন্ত্রণ,শেয়ার,সপ্তাহ,মাস,পূর্বাভাস,উইজেট',
'পরিকল্পনা ও আবহাওয়া একসঙ্গে দেখুন। বিভিন্ন ভিউ ও হোম স্ক্রিন উইজেট ব্যবহার করুন, অথবা অ্যাপ অ্যাকাউন্ট ছাড়াই স্থানীয় ক্যালেন্ডার তৈরি করুন।',
'''iPhone ও iPad-এ Cloud Calendars দিয়ে কাজের ও ব্যক্তিগত পরিকল্পনার সঙ্গে আবহাওয়া দেখুন।

iCloud ক্যালেন্ডার ব্যবহার করুন এবং Google Calendar যুক্ত করুন। দিন, সপ্তাহ, মাস, বছর বা তালিকা ভিউ বেছে নিন। Cloud Calendars অ্যাকাউন্ট ছাড়াই ডিভাইসে স্থানীয় ক্যালেন্ডার তৈরি করা যায়। পরিষেবা যুক্ত করা ও শেয়ার করার জন্য সাইন ইন লাগতে পারে। শেয়ারের অনুমতি ক্যালেন্ডার ও আমন্ত্রণের ধরনের ওপর নির্ভর করে।

পরিকল্পনার সময় আবহাওয়ার পূর্বাভাস দেখুন। হোম স্ক্রিন উইজেট ছোট, মাঝারি ও বড় আকারে পাওয়া যায়। পূর্বাভাসের প্রাপ্যতা অবস্থান ও আবহাওয়া পরিষেবার ওপর নির্ভর করে।

বিনামূল্যের Base-এ Google Calendar সিঙ্ক, Google Meet, বিভিন্ন ক্যালেন্ডার ভিউ, আবহাওয়া ও উইজেট রয়েছে। Advanced-এ Base-এর সুবিধা থাকে এবং বিজ্ঞাপন সরিয়ে দেয়। Premium-এ Advanced-এর সুবিধার সঙ্গে Microsoft ক্যালেন্ডার ও Microsoft Teams সমর্থন রয়েছে।

ডাউনলোড বিনামূল্যে; ঐচ্ছিক সাবস্ক্রিপশন স্বয়ংক্রিয়ভাবে নবায়ন হয়। নেওয়ার আগে অ্যাপ বা App Store-এ বর্তমান স্থানীয় মূল্য ও বিলিং সময়কাল দেখুন। বর্তমান মেয়াদ শেষ হওয়ার অন্তত ২৪ ঘণ্টা আগে বাতিল না করলে সাবস্ক্রিপশন নবায়ন হয়। App Store অ্যাকাউন্ট সেটিংসে পরিচালনা বা বাতিল করুন।''',('গোপনীয়তা','ব্যবহারের শর্ত')],
'ca':[
'Temps, cites i ginys',
'agenda,planificador,horari,setmana,mes,recordatori,reunió,esdeveniment,compartir,invitació,previsió',
'Consulta els plans i el temps junts. Utilitza ginys i diferents vistes, o crea un calendari local sense un compte a l’app.',
'''Consulta els plans de feina, les cites personals i el temps a l’iPhone i l’iPad amb Cloud Calendars.

Utilitza calendaris de l’iCloud i connecta Google Calendar. Tria la vista de dia, setmana, mes, any o llista. També pots crear un calendari local al dispositiu sense un compte de Cloud Calendars. Connectar serveis i compartir pot requerir iniciar sessió. Els permisos depenen del calendari i del tipus d’invitació.

Consulta la previsió mentre fas plans. Els ginys de la pantalla d’inici estan disponibles en mides petita, mitjana i gran. Les previsions disponibles depenen de la ubicació i del proveïdor meteorològic.

Base és gratuït i inclou sincronització amb Google Calendar, Google Meet, diverses vistes de calendari, temps i ginys. Advanced inclou les funcions de Base i elimina els anuncis. Premium inclou Advanced i afegeix calendaris de Microsoft i Microsoft Teams.

La descàrrega és gratuïta, amb subscripcions opcionals de renovació automàtica. Abans de subscriure’t, comprova el preu local actual i el període de facturació a l’app o a l’App Store. La subscripció es renova si no la cancel·les almenys 24 hores abans del final del període actual. Pots gestionar-la o cancel·lar-la als ajustos del compte de l’App Store.''',('Privadesa','Condicions d’ús')],
'gu-IN':[
'હવામાન અને આયોજન',
'સમયપત્રક,બેઠક,ઇવેન્ટ,યાદ,આમંત્રણ,શેર,અઠવાડિયું,મહિનો,આગાહી,વિજેટ',
'આયોજન અને હવામાન સાથે જુઓ. જુદા દૃશ્યો અને હોમ સ્ક્રીન વિજેટ વાપરો અથવા ઍપ ખાતા વિના સ્થાનિક કૅલેન્ડર બનાવો.',
'''iPhone અને iPad પર Cloud Calendars સાથે કામ અને વ્યક્તિગત આયોજનની સાથે હવામાન જુઓ.

iCloud કૅલેન્ડર વાપરો અને Google Calendar જોડો. દિવસ, અઠવાડિયું, મહિનો, વર્ષ અથવા સૂચિ દૃશ્ય પસંદ કરો. Cloud Calendars ખાતા વિના ઉપકરણ પર સ્થાનિક કૅલેન્ડર બનાવી શકાય છે. સેવાઓ જોડવા અને શેર કરવા માટે સાઇન ઇન જરૂરી હોઈ શકે છે. ઍક્સેસની પરવાનગી કૅલેન્ડર અને આમંત્રણના પ્રકાર પર આધાર રાખે છે.

આયોજન કરતી વખતે હવામાનની આગાહી જુઓ. હોમ સ્ક્રીન વિજેટ નાના, મધ્યમ અને મોટા કદમાં ઉપલબ્ધ છે. ઉપલબ્ધ આગાહી સ્થાન અને હવામાન સેવા પર આધાર રાખે છે.

મફત Base માં Google Calendar સિંક, Google Meet, વિવિધ કૅલેન્ડર દૃશ્યો, હવામાન અને વિજેટ છે. Advanced માં Base ની સુવિધાઓ છે અને જાહેરાતો દૂર થાય છે. Premium માં Advanced ની સુવિધાઓ સાથે Microsoft કૅલેન્ડર અને Microsoft Teams નો સપોર્ટ છે.

ડાઉનલોડ મફત છે; વૈકલ્પિક સબ્સ્ક્રિપ્શન આપમેળે રિન્યૂ થાય છે. લેતાં પહેલાં ઍપ અથવા App Store માં વર્તમાન સ્થાનિક કિંમત અને બિલિંગ સમયગાળો તપાસો. વર્તમાન સમયગાળો પૂરો થાય તેના ઓછામાં ઓછા 24 કલાક પહેલાં રદ ન કરો તો સબ્સ્ક્રિપ્શન રિન્યૂ થાય છે. App Store ખાતાની સેટિંગ્સમાં તેને મેનેજ અથવા રદ કરો.''',('ગોપનીયતા','ઉપયોગની શરતો')],
'id':[
'Cuaca, jadwal dan widget',
'agenda,perencana,minggu,bulan,pengingat,rapat,acara,berbagi,undangan,prakiraan,janji',
'Lihat rencana dan cuaca bersama. Gunakan widget dan berbagai tampilan, atau mulai dengan kalender lokal tanpa akun aplikasi.',
'''Lihat jadwal kerja, rencana pribadi, dan cuaca di iPhone serta iPad dengan Cloud Calendars.

Gunakan kalender iCloud dan hubungkan Google Kalender. Pilih tampilan hari, minggu, bulan, tahun, atau daftar. Anda juga dapat membuat kalender lokal di perangkat tanpa akun Cloud Calendars. Menghubungkan layanan dan berbagi mungkin memerlukan login. Izin akses bergantung pada kalender dan jenis undangan.

Periksa prakiraan saat membuat rencana. Widget Layar Utama tersedia dalam ukuran kecil, sedang, dan besar. Ketersediaan prakiraan bergantung pada lokasi dan penyedia cuaca.

Base gratis mencakup sinkronisasi Google Kalender, Google Meet, berbagai tampilan kalender, cuaca, dan widget. Advanced mencakup fitur Base dan menghapus iklan. Premium mencakup Advanced serta menambahkan kalender Microsoft dan Microsoft Teams.

Aplikasi dapat diunduh gratis, dengan langganan opsional yang diperpanjang otomatis. Periksa harga lokal saat ini dan periode penagihan di aplikasi atau App Store sebelum berlangganan. Langganan diperpanjang kecuali dibatalkan setidaknya 24 jam sebelum periode berjalan berakhir. Kelola atau batalkan melalui pengaturan akun App Store Anda.''',('Privasi','Ketentuan Penggunaan')],
'kn-IN':[
'ಹವಾಮಾನ ಮತ್ತು ಯೋಜನೆ',
'ವೇಳಾಪಟ್ಟಿ,ಸಭೆ,ಈವೆಂಟ್,ಜ್ಞಾಪನೆ,ಆಹ್ವಾನ,ಹಂಚಿಕೆ,ವಾರ,ತಿಂಗಳು,ಮುನ್ಸೂಚನೆ,ವಿಜೆಟ್',
'ಯೋಜನೆ ಮತ್ತು ಹವಾಮಾನವನ್ನು ಒಟ್ಟಿಗೆ ನೋಡಿ. ವಿಭಿನ್ನ ವೀಕ್ಷಣೆಗಳು ಮತ್ತು ಹೋಮ್ ಸ್ಕ್ರೀನ್ ವಿಜೆಟ್ ಬಳಸಿ ಅಥವಾ ಆ್ಯಪ್ ಖಾತೆಯಿಲ್ಲದೆ ಸ್ಥಳೀಯ ಕ್ಯಾಲೆಂಡರ್ ರಚಿಸಿ.',
'''iPhone ಮತ್ತು iPad ನಲ್ಲಿ Cloud Calendars ಮೂಲಕ ಕೆಲಸದ ಮತ್ತು ವೈಯಕ್ತಿಕ ಯೋಜನೆಗಳ ಜೊತೆಗೆ ಹವಾಮಾನವನ್ನು ನೋಡಿ.

iCloud ಕ್ಯಾಲೆಂಡರ್ ಬಳಸಿ ಮತ್ತು Google Calendar ಸಂಪರ್ಕಿಸಿ. ದಿನ, ವಾರ, ತಿಂಗಳು, ವರ್ಷ ಅಥವಾ ಪಟ್ಟಿ ವೀಕ್ಷಣೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ. Cloud Calendars ಖಾತೆಯಿಲ್ಲದೆ ಸಾಧನದಲ್ಲಿ ಸ್ಥಳೀಯ ಕ್ಯಾಲೆಂಡರ್ ರಚಿಸಬಹುದು. ಸೇವೆಗಳನ್ನು ಸಂಪರ್ಕಿಸಲು ಮತ್ತು ಹಂಚಿಕೊಳ್ಳಲು ಸೈನ್ ಇನ್ ಅಗತ್ಯವಾಗಬಹುದು. ಪ್ರವೇಶ ಅನುಮತಿಗಳು ಕ್ಯಾಲೆಂಡರ್ ಮತ್ತು ಆಹ್ವಾನದ ಪ್ರಕಾರವನ್ನು ಅವಲಂಬಿಸಿರುತ್ತವೆ.

ಯೋಜನೆ ಮಾಡುವಾಗ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಪರಿಶೀಲಿಸಿ. ಹೋಮ್ ಸ್ಕ್ರೀನ್ ವಿಜೆಟ್‌ಗಳು ಸಣ್ಣ, ಮಧ್ಯಮ ಮತ್ತು ದೊಡ್ಡ ಗಾತ್ರಗಳಲ್ಲಿ ಲಭ್ಯವಿವೆ. ಮುನ್ಸೂಚನೆಯ ಲಭ್ಯತೆ ಸ್ಥಳ ಮತ್ತು ಹವಾಮಾನ ಸೇವೆಯನ್ನು ಅವಲಂಬಿಸಿರುತ್ತದೆ.

ಉಚಿತ Base ನಲ್ಲಿ Google Calendar ಸಿಂಕ್, Google Meet, ವಿವಿಧ ಕ್ಯಾಲೆಂಡರ್ ವೀಕ್ಷಣೆಗಳು, ಹವಾಮಾನ ಮತ್ತು ವಿಜೆಟ್‌ಗಳು ಸೇರಿವೆ. Advanced ನಲ್ಲಿ Base ವೈಶಿಷ್ಟ್ಯಗಳು ಸೇರಿವೆ ಮತ್ತು ಜಾಹೀರಾತುಗಳನ್ನು ತೆಗೆದುಹಾಕುತ್ತದೆ. Premium ನಲ್ಲಿ Advanced ಜೊತೆಗೆ Microsoft ಕ್ಯಾಲೆಂಡರ್ ಮತ್ತು Microsoft Teams ಬೆಂಬಲ ಸೇರಿದೆ.

ಡೌನ್‌ಲೋಡ್ ಉಚಿತ; ಐಚ್ಛಿಕ ಚಂದಾದಾರಿಕೆಗಳು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ನವೀಕರಣಗೊಳ್ಳುತ್ತವೆ. ಖರೀದಿಸುವ ಮೊದಲು ಆ್ಯಪ್ ಅಥವಾ App Store ನಲ್ಲಿ ಪ್ರಸ್ತುತ ಸ್ಥಳೀಯ ಬೆಲೆ ಮತ್ತು ಬಿಲ್ಲಿಂಗ್ ಅವಧಿ ಪರಿಶೀಲಿಸಿ. ಪ್ರಸ್ತುತ ಅವಧಿ ಮುಗಿಯುವ ಕನಿಷ್ಠ 24 ಗಂಟೆಗಳ ಮೊದಲು ರದ್ದುಪಡಿಸದಿದ್ದರೆ ಚಂದಾದಾರಿಕೆ ನವೀಕರಣಗೊಳ್ಳುತ್ತದೆ. App Store ಖಾತೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ನಿರ್ವಹಿಸಿ ಅಥವಾ ರದ್ದುಪಡಿಸಿ.''',('ಗೌಪ್ಯತೆ','ಬಳಕೆಯ ನಿಯಮಗಳು')],
'ml-IN':[
'കാലാവസ്ഥയും പദ്ധതികളും',
'സമയക്രമം,യോഗം,ഓർമ്മപ്പെടുത്തൽ,ക്ഷണം,പങ്കിടൽ,ആഴ്ച,മാസം,പ്രവചനം,വിജറ്റ്',
'പദ്ധതികളും കാലാവസ്ഥയും ഒരുമിച്ച് കാണുക. വിവിധ കാഴ്ചകളും ഹോം സ്ക്രീൻ വിജറ്റുകളും ഉപയോഗിക്കുക, അല്ലെങ്കിൽ ആപ്പ് അക്കൗണ്ടില്ലാതെ പ്രാദേശിക കലണ്ടർ സൃഷ്ടിക്കുക.',
'''iPhone, iPad എന്നിവയിൽ Cloud Calendars ഉപയോഗിച്ച് ജോലി, സ്വകാര്യ പദ്ധതികൾക്കൊപ്പം കാലാവസ്ഥയും കാണുക.

iCloud കലണ്ടറുകൾ ഉപയോഗിച്ച് Google Calendar ബന്ധിപ്പിക്കുക. ദിവസം, ആഴ്ച, മാസം, വർഷം അല്ലെങ്കിൽ പട്ടിക കാഴ്ച തിരഞ്ഞെടുക്കുക. Cloud Calendars അക്കൗണ്ടില്ലാതെ ഉപകരണത്തിൽ പ്രാദേശിക കലണ്ടർ സൃഷ്ടിക്കാം. സേവനങ്ങൾ ബന്ധിപ്പിക്കാനും പങ്കിടാനും സൈൻ ഇൻ ആവശ്യമായേക്കാം. പ്രവേശനാനുമതികൾ കലണ്ടറിനെയും ക്ഷണത്തിന്റെ തരത്തെയും ആശ്രയിച്ചിരിക്കും.

പദ്ധതികൾ തയ്യാറാക്കുമ്പോൾ കാലാവസ്ഥാ പ്രവചനം പരിശോധിക്കുക. ഹോം സ്ക്രീൻ വിജറ്റുകൾ ചെറുതും ഇടത്തരവും വലുതുമായ വലുപ്പങ്ങളിൽ ലഭ്യമാണ്. പ്രവചനങ്ങളുടെ ലഭ്യത സ്ഥലത്തെയും കാലാവസ്ഥാ സേവനത്തെയും ആശ്രയിച്ചിരിക്കും.

സൗജന്യ Base-ൽ Google Calendar സമന്വയം, Google Meet, വിവിധ കലണ്ടർ കാഴ്ചകൾ, കാലാവസ്ഥ, വിജറ്റുകൾ എന്നിവ ഉൾപ്പെടുന്നു. Advanced-ൽ Base സവിശേഷതകൾ ഉൾപ്പെടുകയും പരസ്യങ്ങൾ നീക്കം ചെയ്യുകയും ചെയ്യുന്നു. Premium-ൽ Advanced കൂടാതെ Microsoft കലണ്ടറുകളും Microsoft Teams പിന്തുണയും ഉൾപ്പെടുന്നു.

ഡൗൺലോഡ് സൗജന്യമാണ്; ഐച്ഛിക സബ്‌സ്‌ക്രിപ്‌ഷനുകൾ സ്വയമേവ പുതുക്കും. വാങ്ങുന്നതിന് മുമ്പ് ആപ്പിലോ App Store-ലോ നിലവിലെ പ്രാദേശിക വിലയും ബില്ലിംഗ് കാലയളവും പരിശോധിക്കുക. നിലവിലെ കാലയളവ് അവസാനിക്കുന്നതിന് കുറഞ്ഞത് 24 മണിക്കൂർ മുമ്പ് റദ്ദാക്കിയില്ലെങ്കിൽ സബ്‌സ്‌ക്രിപ്‌ഷൻ പുതുക്കും. App Store അക്കൗണ്ട് ക്രമീകരണങ്ങളിൽ നിയന്ത്രിക്കുകയോ റദ്ദാക്കുകയോ ചെയ്യാം.''',('സ്വകാര്യത','ഉപയോഗ നിബന്ധനകൾ')],
'mr-IN':[
'हवामान आणि नियोजन',
'वेळापत्रक,बैठक,कार्यक्रम,स्मरण,आमंत्रण,शेअर,आठवडा,महिना,अंदाज,विजेट',
'नियोजन आणि हवामान एकत्र पाहा. वेगवेगळी दृश्ये आणि होम स्क्रीन विजेट वापरा किंवा ॲप खाते न बनवता स्थानिक कॅलेंडर तयार करा.',
'''iPhone आणि iPad वर Cloud Calendars वापरून कामाचे आणि वैयक्तिक नियोजन हवामानासह पाहा.

iCloud कॅलेंडर वापरा आणि Google Calendar जोडा. दिवस, आठवडा, महिना, वर्ष किंवा सूची दृश्य निवडा. Cloud Calendars खाते न बनवता डिव्हाइसवर स्थानिक कॅलेंडर तयार करता येते. सेवा जोडण्यासाठी आणि शेअर करण्यासाठी साइन इन करावे लागू शकते. प्रवेशाच्या परवानग्या कॅलेंडर आणि आमंत्रणाच्या प्रकारावर अवलंबून असतात.

नियोजन करताना हवामानाचा अंदाज पाहा. होम स्क्रीन विजेट लहान, मध्यम आणि मोठ्या आकारांत उपलब्ध आहेत. अंदाजांची उपलब्धता स्थान आणि हवामान सेवा पुरवठादारावर अवलंबून असते.

मोफत Base मध्ये Google Calendar सिंक, Google Meet, वेगवेगळी कॅलेंडर दृश्ये, हवामान आणि विजेट समाविष्ट आहेत. Advanced मध्ये Base ची वैशिष्ट्ये आहेत आणि जाहिराती काढल्या जातात. Premium मध्ये Advanced सोबत Microsoft कॅलेंडर आणि Microsoft Teams समर्थन मिळते.

डाउनलोड मोफत आहे; ऐच्छिक सदस्यता आपोआप नूतनीकृत होतात. घेण्यापूर्वी ॲप किंवा App Store मध्ये सध्याची स्थानिक किंमत आणि बिलिंग कालावधी तपासा. चालू कालावधी संपण्याच्या किमान 24 तास आधी रद्द न केल्यास सदस्यता नूतनीकृत होते. App Store खात्याच्या सेटिंग्जमध्ये व्यवस्थापित किंवा रद्द करा.''',('गोपनीयता','वापराच्या अटी')],
'ms':[
'Cuaca, jadual dan widget',
'agenda,perancang,minggu,bulan,peringatan,mesyuarat,acara,perkongsian,jemputan,ramalan,janji temu',
'Lihat rancangan dan cuaca bersama. Gunakan widget dan pelbagai paparan, atau mulakan dengan kalendar setempat tanpa akaun aplikasi.',
'''Lihat jadual kerja, rancangan peribadi dan cuaca pada iPhone serta iPad dengan Cloud Calendars.

Gunakan kalendar iCloud dan sambungkan Google Calendar. Pilih paparan hari, minggu, bulan, tahun atau senarai. Anda juga boleh mencipta kalendar setempat pada peranti tanpa akaun Cloud Calendars. Menyambungkan perkhidmatan dan berkongsi mungkin memerlukan daftar masuk. Kebenaran akses bergantung pada kalendar dan jenis jemputan.

Semak ramalan semasa merancang. Widget Skrin Utama tersedia dalam saiz kecil, sederhana dan besar. Ketersediaan ramalan bergantung pada lokasi dan penyedia cuaca.

Base percuma merangkumi penyegerakan Google Calendar, Google Meet, pelbagai paparan kalendar, cuaca dan widget. Advanced merangkumi ciri Base dan membuang iklan. Premium merangkumi Advanced serta menambah kalendar Microsoft dan Microsoft Teams.

Muat turun adalah percuma, dengan langganan pilihan yang diperbaharui secara automatik. Semak harga tempatan semasa dan tempoh pengebilan dalam aplikasi atau App Store sebelum melanggan. Langganan diperbaharui melainkan dibatalkan sekurang-kurangnya 24 jam sebelum tempoh semasa tamat. Urus atau batalkan melalui tetapan akaun App Store anda.''',('Privasi','Syarat Penggunaan')],
'or-IN':[
'ପାଣିପାଗ ଓ ଯୋଜନା',
'ସମୟସୂଚୀ,ବୈଠକ,ଇଭେଣ୍ଟ,ସ୍ମରଣ,ନିମନ୍ତ୍ରଣ,ସେୟାର,ସପ୍ତାହ,ମାସ,ପୂର୍ବାନୁମାନ,ୱିଜେଟ୍',
'ଯୋଜନା ଓ ପାଣିପାଗ ଏକାଠି ଦେଖନ୍ତୁ। ବିଭିନ୍ନ ଦୃଶ୍ୟ ଓ ହୋମ୍ ସ୍କ୍ରିନ୍ ୱିଜେଟ୍ ବ୍ୟବହାର କରନ୍ତୁ, କିମ୍ବା ଆପ୍ ଆକାଉଣ୍ଟ ବିନା ସ୍ଥାନୀୟ କ୍ୟାଲେଣ୍ଡର ତିଆରି କରନ୍ତୁ।',
'''iPhone ଓ iPad ରେ Cloud Calendars ସହ କାମ ଓ ବ୍ୟକ୍ତିଗତ ଯୋଜନା ସହିତ ପାଣିପାଗ ଦେଖନ୍ତୁ।

iCloud କ୍ୟାଲେଣ୍ଡର ବ୍ୟବହାର କରନ୍ତୁ ଏବଂ Google Calendar ଯୋଡ଼ନ୍ତୁ। ଦିନ, ସପ୍ତାହ, ମାସ, ବର୍ଷ କିମ୍ବା ତାଲିକା ଦୃଶ୍ୟ ବାଛନ୍ତୁ। Cloud Calendars ଆକାଉଣ୍ଟ ବିନା ଡିଭାଇସରେ ସ୍ଥାନୀୟ କ୍ୟାଲେଣ୍ଡର ତିଆରି କରିପାରିବେ। ସେବା ଯୋଡ଼ିବା ଓ ସେୟାର କରିବା ପାଇଁ ସାଇନ୍ ଇନ୍ ଆବଶ୍ୟକ ହୋଇପାରେ। ପ୍ରବେଶ ଅନୁମତି କ୍ୟାଲେଣ୍ଡର ଓ ନିମନ୍ତ୍ରଣର ପ୍ରକାର ଉପରେ ନିର୍ଭର କରେ।

ଯୋଜନା ସମୟରେ ପାଣିପାଗ ପୂର୍ବାନୁମାନ ଦେଖନ୍ତୁ। ହୋମ୍ ସ୍କ୍ରିନ୍ ୱିଜେଟ୍ ଛୋଟ, ମଧ୍ୟମ ଓ ବଡ଼ ଆକାରରେ ଉପଲବ୍ଧ। ପୂର୍ବାନୁମାନର ଉପଲବ୍ଧତା ସ୍ଥାନ ଓ ପାଣିପାଗ ସେବା ଉପରେ ନିର୍ଭର କରେ।

ମାଗଣା Base ରେ Google Calendar ସିଙ୍କ୍, Google Meet, ବିଭିନ୍ନ କ୍ୟାଲେଣ୍ଡର ଦୃଶ୍ୟ, ପାଣିପାଗ ଓ ୱିଜେଟ୍ ଅଛି। Advanced ରେ Base ସୁବିଧା ଅଛି ଏବଂ ବିଜ୍ଞାପନ ହଟାଯାଏ। Premium ରେ Advanced ସହ Microsoft କ୍ୟାଲେଣ୍ଡର ଓ Microsoft Teams ସମର୍ଥନ ଅଛି।

ଡାଉନଲୋଡ୍ ମାଗଣା; ଇଚ୍ଛାଧୀନ ସବ୍‌ସ୍କ୍ରିପ୍‌ସନ୍ ସ୍ୱୟଂଚାଳିତ ଭାବେ ନବୀକରଣ ହୁଏ। ନେବା ପୂର୍ବରୁ ଆପ୍ କିମ୍ବା App Store ରେ ବର୍ତ୍ତମାନର ସ୍ଥାନୀୟ ମୂଲ୍ୟ ଓ ବିଲିଂ ଅବଧି ଯାଞ୍ଚ କରନ୍ତୁ। ଚାଲୁ ଅବଧି ଶେଷର ଅତି କମରେ 24 ଘଣ୍ଟା ପୂର୍ବରୁ ବାତିଲ ନକଲେ ନବୀକରଣ ହୁଏ। App Store ଆକାଉଣ୍ଟ ସେଟିଂରେ ପରିଚାଳନା କିମ୍ବା ବାତିଲ କରନ୍ତୁ।''',('ଗୋପନୀୟତା','ବ୍ୟବହାର ସର୍ତ୍ତ')],
'pa-IN':[
'ਮੌਸਮ ਅਤੇ ਯੋਜਨਾਵਾਂ',
'ਸਮਾਂਸਾਰਣੀ,ਮੀਟਿੰਗ,ਇਵੈਂਟ,ਯਾਦ,ਸੱਦਾ,ਸਾਂਝਾ,ਹਫ਼ਤਾ,ਮਹੀਨਾ,ਪੂਰਵਅਨੁਮਾਨ,ਵਿਜੇਟ',
'ਯੋਜਨਾਵਾਂ ਅਤੇ ਮੌਸਮ ਇਕੱਠੇ ਦੇਖੋ। ਵੱਖਰੇ ਦ੍ਰਿਸ਼ ਅਤੇ ਹੋਮ ਸਕ੍ਰੀਨ ਵਿਜੇਟ ਵਰਤੋ ਜਾਂ ਐਪ ਖਾਤੇ ਤੋਂ ਬਿਨਾਂ ਸਥਾਨਕ ਕੈਲੰਡਰ ਬਣਾਓ।',
'''iPhone ਅਤੇ iPad ਉੱਤੇ Cloud Calendars ਨਾਲ ਕੰਮ ਅਤੇ ਨਿੱਜੀ ਯੋਜਨਾਵਾਂ ਦੇ ਨਾਲ ਮੌਸਮ ਦੇਖੋ।

iCloud ਕੈਲੰਡਰ ਵਰਤੋ ਅਤੇ Google Calendar ਜੋੜੋ। ਦਿਨ, ਹਫ਼ਤੇ, ਮਹੀਨੇ, ਸਾਲ ਜਾਂ ਸੂਚੀ ਦਾ ਦ੍ਰਿਸ਼ ਚੁਣੋ। Cloud Calendars ਖਾਤੇ ਤੋਂ ਬਿਨਾਂ ਡਿਵਾਈਸ ਉੱਤੇ ਸਥਾਨਕ ਕੈਲੰਡਰ ਬਣਾ ਸਕਦੇ ਹੋ। ਸੇਵਾਵਾਂ ਜੋੜਨ ਅਤੇ ਸਾਂਝਾ ਕਰਨ ਲਈ ਸਾਈਨ ਇਨ ਦੀ ਲੋੜ ਹੋ ਸਕਦੀ ਹੈ। ਪਹੁੰਚ ਦੀਆਂ ਇਜਾਜ਼ਤਾਂ ਕੈਲੰਡਰ ਅਤੇ ਸੱਦੇ ਦੀ ਕਿਸਮ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀਆਂ ਹਨ।

ਯੋਜਨਾ ਬਣਾਉਂਦੇ ਸਮੇਂ ਮੌਸਮ ਦਾ ਪੂਰਵਅਨੁਮਾਨ ਦੇਖੋ। ਹੋਮ ਸਕ੍ਰੀਨ ਵਿਜੇਟ ਛੋਟੇ, ਦਰਮਿਆਨੇ ਅਤੇ ਵੱਡੇ ਆਕਾਰ ਵਿੱਚ ਉਪਲਬਧ ਹਨ। ਪੂਰਵਅਨੁਮਾਨਾਂ ਦੀ ਉਪਲਬਧਤਾ ਸਥਾਨ ਅਤੇ ਮੌਸਮ ਸੇਵਾ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।

ਮੁਫ਼ਤ Base ਵਿੱਚ Google Calendar ਸਿੰਕ, Google Meet, ਵੱਖਰੇ ਕੈਲੰਡਰ ਦ੍ਰਿਸ਼, ਮੌਸਮ ਅਤੇ ਵਿਜੇਟ ਸ਼ਾਮਲ ਹਨ। Advanced ਵਿੱਚ Base ਦੀਆਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਹਨ ਅਤੇ ਇਸ਼ਤਿਹਾਰ ਹਟ ਜਾਂਦੇ ਹਨ। Premium ਵਿੱਚ Advanced ਦੇ ਨਾਲ Microsoft ਕੈਲੰਡਰ ਅਤੇ Microsoft Teams ਸਹਾਇਤਾ ਸ਼ਾਮਲ ਹੈ।

ਡਾਊਨਲੋਡ ਮੁਫ਼ਤ ਹੈ; ਚੋਣਵੀਆਂ ਗਾਹਕੀਆਂ ਆਪਣੇ ਆਪ ਨਵਿਆਈਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਲੈਣ ਤੋਂ ਪਹਿਲਾਂ ਐਪ ਜਾਂ App Store ਵਿੱਚ ਮੌਜੂਦਾ ਸਥਾਨਕ ਕੀਮਤ ਅਤੇ ਬਿਲਿੰਗ ਮਿਆਦ ਦੇਖੋ। ਮੌਜੂਦਾ ਮਿਆਦ ਮੁੱਕਣ ਤੋਂ ਘੱਟੋ-ਘੱਟ 24 ਘੰਟੇ ਪਹਿਲਾਂ ਰੱਦ ਨਾ ਕਰਨ ਉੱਤੇ ਗਾਹਕੀ ਨਵਿਆਈ ਜਾਂਦੀ ਹੈ। App Store ਖਾਤੇ ਦੀਆਂ ਸੈਟਿੰਗਾਂ ਵਿੱਚ ਪ੍ਰਬੰਧਿਤ ਜਾਂ ਰੱਦ ਕਰੋ।''',('ਪਰਦੇਦਾਰੀ','ਵਰਤੋਂ ਦੀਆਂ ਸ਼ਰਤਾਂ')],
 'ta-IN':[
'வானிலை மற்றும் திட்டங்கள்',
'அட்டவணை,சந்திப்பு,நிகழ்வு,நினைவூட்டல்,பகிர்வு,அழைப்பு,வாரம்,மாதம்,முன்னறிவிப்பு,விட்ஜெட்',
'திட்டங்களையும் வானிலையையும் ஒன்றாகப் பாருங்கள். பல காட்சிகளையும் முகப்புத் திரை விட்ஜெட்களையும் பயன்படுத்துங்கள் அல்லது ஆப் கணக்கின்றி உள்ளூர் காலெண்டரை உருவாக்குங்கள்.',
'''iPhone மற்றும் iPad இல் Cloud Calendars மூலம் வேலை மற்றும் தனிப்பட்ட திட்டங்களுடன் வானிலையைப் பாருங்கள்.

iCloud காலெண்டர்களைப் பயன்படுத்தி Google Calendar ஐ இணைக்கவும். நாள், வாரம், மாதம், ஆண்டு அல்லது பட்டியல் காட்சியைத் தேர்ந்தெடுக்கவும். Cloud Calendars கணக்கின்றி சாதனத்தில் உள்ளூர் காலெண்டரை உருவாக்கலாம். சேவைகளை இணைக்கவும் பகிரவும் உள்நுழைவு தேவைப்படலாம். அணுகல் அனுமதிகள் காலெண்டர் மற்றும் அழைப்பின் வகையைப் பொறுத்தது.

திட்டமிடும்போது வானிலை முன்னறிவிப்பைப் பார்க்கவும். முகப்புத் திரை விட்ஜெட்கள் சிறிய, நடுத்தர, பெரிய அளவுகளில் உள்ளன. முன்னறிவிப்புகளின் கிடைக்கும் தன்மை இடம் மற்றும் வானிலை சேவையைப் பொறுத்தது.

இலவச Base இல் Google Calendar ஒத்திசைவு, Google Meet, பல காலெண்டர் காட்சிகள், வானிலை மற்றும் விட்ஜெட்கள் உள்ளன. Advanced இல் Base அம்சங்கள் உள்ளன; விளம்பரங்கள் அகற்றப்படும். Premium இல் Advanced உடன் Microsoft காலெண்டர் மற்றும் Microsoft Teams ஆதரவும் உள்ளது.

பதிவிறக்கம் இலவசம்; விருப்பச் சந்தாக்கள் தானாகப் புதுப்பிக்கப்படும். வாங்கும் முன் ஆப் அல்லது App Store இல் தற்போதைய உள்ளூர் விலை மற்றும் பில்லிங் காலத்தைச் சரிபார்க்கவும். தற்போதைய காலம் முடிவதற்குக் குறைந்தது 24 மணிநேரம் முன்பு ரத்து செய்யாவிட்டால் சந்தா புதுப்பிக்கப்படும். App Store கணக்கு அமைப்புகளில் நிர்வகிக்கலாம் அல்லது ரத்து செய்யலாம்.''',('தனியுரிமை','பயன்பாட்டு விதிமுறைகள்')],
 'te-IN':[
'వాతావరణం మరియు ప్రణాళికలు',
'సమయపట్టిక,సమావేశం,ఈవెంట్,రిమైండర్,ఆహ్వానం,షేరింగ్,వారం,నెల,అంచనా,విడ్జెట్',
'ప్రణాళికలు, వాతావరణం కలిపి చూడండి. వేర్వేరు వీక్షణలు, హోమ్ స్క్రీన్ విడ్జెట్లు వాడండి లేదా యాప్ ఖాతా లేకుండా స్థానిక క్యాలెండర్ సృష్టించండి.',
'''iPhone, iPad లో Cloud Calendars తో పని, వ్యక్తిగత ప్రణాళికలతో పాటు వాతావరణం చూడండి.

iCloud క్యాలెండర్లు ఉపయోగించి Google Calendar కనెక్ట్ చేయండి. రోజు, వారం, నెల, సంవత్సరం లేదా జాబితా వీక్షణ ఎంచుకోండి. Cloud Calendars ఖాతా లేకుండా పరికరంలో స్థానిక క్యాలెండర్ సృష్టించవచ్చు. సేవలను కనెక్ట్ చేయడానికి, షేర్ చేయడానికి సైన్ ఇన్ అవసరం కావచ్చు. యాక్సెస్ అనుమతులు క్యాలెండర్, ఆహ్వాన రకంపై ఆధారపడతాయి.

ప్రణాళిక వేసేటప్పుడు వాతావరణ అంచనా చూడండి. హోమ్ స్క్రీన్ విడ్జెట్లు చిన్న, మధ్యస్థ, పెద్ద పరిమాణాల్లో అందుబాటులో ఉన్నాయి. అంచనాల లభ్యత స్థానం, వాతావరణ సేవపై ఆధారపడుతుంది.

ఉచిత Base లో Google Calendar సింక్, Google Meet, వేర్వేరు క్యాలెండర్ వీక్షణలు, వాతావరణం, విడ్జెట్లు ఉంటాయి. Advanced లో Base ఫీచర్లు ఉంటాయి; ప్రకటనలు తొలగించబడతాయి. Premium లో Advanced తో పాటు Microsoft క్యాలెండర్, Microsoft Teams మద్దతు ఉంటుంది.

డౌన్‌లోడ్ ఉచితం; ఐచ్ఛిక సబ్‌స్క్రిప్షన్లు ఆటోమేటిక్‌గా పునరుద్ధరించబడతాయి. తీసుకునే ముందు యాప్ లేదా App Store లో ప్రస్తుత స్థానిక ధర, బిల్లింగ్ వ్యవధి చూడండి. ప్రస్తుత వ్యవధి ముగియడానికి కనీసం 24 గంటల ముందు రద్దు చేయకపోతే సబ్‌స్క్రిప్షన్ పునరుద్ధరించబడుతుంది. App Store ఖాతా సెట్టింగ్‌లలో నిర్వహించండి లేదా రద్దు చేయండి.''',('గోప్యత','వినియోగ నిబంధనలు')],
 'th':[
'อากาศ นัดหมาย และวิดเจ็ต',
'ตารางเวลา,วางแผน,สัปดาห์,เดือน,เตือน,ประชุม,กิจกรรม,แชร์,คำเชิญ,พยากรณ์',
'ดูแผนและอากาศด้วยกัน ใช้วิดเจ็ตและมุมมองต่าง ๆ หรือเริ่มด้วยปฏิทินในเครื่องโดยไม่ต้องมีบัญชีแอป',
'''ดูแผนงาน นัดหมายส่วนตัว และอากาศบน iPhone และ iPad ด้วย Cloud Calendars

ใช้ปฏิทิน iCloud และเชื่อมต่อ Google ปฏิทิน เลือกมุมมองวัน สัปดาห์ เดือน ปี หรือรายการ คุณยังสร้างปฏิทินในเครื่องได้โดยไม่ต้องมีบัญชี Cloud Calendars การเชื่อมต่อบริการและการแชร์อาจต้องลงชื่อเข้าใช้ สิทธิ์เข้าถึงขึ้นอยู่กับปฏิทินและประเภทคำเชิญ

ดูพยากรณ์อากาศขณะวางแผน วิดเจ็ตหน้าจอโฮมมีขนาดเล็ก กลาง และใหญ่ พยากรณ์ที่มีให้ขึ้นอยู่กับตำแหน่งและผู้ให้บริการสภาพอากาศ

Base ใช้ฟรี รวมการซิงค์ Google ปฏิทิน, Google Meet, มุมมองปฏิทินหลายแบบ สภาพอากาศ และวิดเจ็ต Advanced รวมคุณสมบัติของ Base และนำโฆษณาออก Premium รวม Advanced และเพิ่มการรองรับปฏิทิน Microsoft และ Microsoft Teams

ดาวน์โหลดได้ฟรี พร้อมการสมัครรับแบบต่ออายุอัตโนมัติที่เลือกซื้อได้ ก่อนสมัคร โปรดตรวจสอบราคาท้องถิ่นปัจจุบันและรอบการเรียกเก็บเงินในแอปหรือ App Store การสมัครรับจะต่ออายุหากไม่ยกเลิกอย่างน้อย 24 ชั่วโมงก่อนสิ้นสุดรอบปัจจุบัน จัดการหรือยกเลิกได้ในการตั้งค่าบัญชี App Store''',('ความเป็นส่วนตัว','ข้อกำหนดการใช้งาน')],
'ur-PK':[
'موسم اور منصوبہ بندی',
'شیڈول,ملاقات,تقریب,یاددہانی,دعوت,اشتراک,ہفتہ,مہینہ,پیشگوئی,ویجٹ',
'اپنے منصوبے اور موسم ایک ساتھ دیکھیں۔ مختلف منظر اور ہوم اسکرین ویجٹ استعمال کریں یا ایپ اکاؤنٹ کے بغیر مقامی کیلنڈر بنائیں۔',
'''iPhone اور iPad پر Cloud Calendars کے ساتھ کام اور ذاتی منصوبوں کے ساتھ موسم دیکھیں۔

iCloud کیلنڈر استعمال کریں اور Google Calendar منسلک کریں۔ دن، ہفتے، مہینے، سال یا فہرست کا منظر منتخب کریں۔ Cloud Calendars اکاؤنٹ کے بغیر بھی آلے پر مقامی کیلنڈر بنایا جا سکتا ہے۔ خدمات منسلک کرنے اور اشتراک کے لیے سائن ان ضروری ہو سکتا ہے۔ رسائی کی اجازتیں کیلنڈر اور دعوت کی قسم پر منحصر ہوتی ہیں۔

منصوبہ بناتے وقت موسم کی پیشگوئی دیکھیں۔ ہوم اسکرین ویجٹ چھوٹے، درمیانے اور بڑے سائز میں دستیاب ہیں۔ پیشگوئیوں کی دستیابی مقام اور موسم کی خدمت فراہم کرنے والے پر منحصر ہے۔

مفت Base میں Google Calendar سنک، Google Meet، کیلنڈر کے مختلف منظر، موسم اور ویجٹ شامل ہیں۔ Advanced میں Base کی خصوصیات شامل ہیں اور اشتہارات ہٹا دیے جاتے ہیں۔ Premium میں Advanced کے ساتھ Microsoft کیلنڈر اور Microsoft Teams کی معاونت شامل ہے۔

ڈاؤن لوڈ مفت ہے؛ اختیاری سبسکرپشن خودکار طور پر تجدید ہوتی ہیں۔ لینے سے پہلے ایپ یا App Store میں موجودہ مقامی قیمت اور بلنگ کی مدت دیکھیں۔ موجودہ مدت ختم ہونے سے کم از کم 24 گھنٹے پہلے منسوخ نہ کرنے پر سبسکرپشن تجدید ہو جاتی ہے۔ App Store اکاؤنٹ کی ترتیبات میں انتظام یا منسوخی کریں۔''',('رازداری','استعمال کی شرائط')],
'vi':[
'Thời tiết, kế hoạch, tiện ích',
'lịch trình,nhắc nhở,cuộc họp,sự kiện,chia sẻ,lời mời,tuần,tháng,dự báo,cuộc hẹn',
'Xem kế hoạch và thời tiết cùng nhau. Dùng tiện ích và nhiều chế độ xem, hoặc tạo lịch cục bộ mà không cần tài khoản ứng dụng.',
'''Xem lịch làm việc, kế hoạch cá nhân và thời tiết trên iPhone và iPad với Cloud Calendars.

Dùng lịch iCloud và kết nối Lịch Google. Chọn chế độ xem ngày, tuần, tháng, năm hoặc danh sách. Bạn cũng có thể tạo lịch cục bộ trên thiết bị mà không cần tài khoản Cloud Calendars. Kết nối dịch vụ và chia sẻ có thể yêu cầu đăng nhập. Quyền truy cập phụ thuộc vào lịch và loại lời mời.

Xem dự báo khi lên kế hoạch. Tiện ích Màn hình chính có kích thước nhỏ, vừa và lớn. Dự báo có sẵn phụ thuộc vào vị trí và nhà cung cấp thời tiết.

Base miễn phí gồm đồng bộ Lịch Google, Google Meet, nhiều chế độ xem lịch, thời tiết và tiện ích. Advanced gồm tính năng của Base và loại bỏ quảng cáo. Premium gồm Advanced cùng hỗ trợ lịch Microsoft và Microsoft Teams.

Ứng dụng được tải miễn phí, với gói đăng ký tự động gia hạn tùy chọn. Trước khi đăng ký, hãy kiểm tra giá hiện tại tại địa phương và kỳ thanh toán trong ứng dụng hoặc App Store. Gói đăng ký sẽ gia hạn nếu không hủy ít nhất 24 giờ trước khi kỳ hiện tại kết thúc. Quản lý hoặc hủy trong phần cài đặt tài khoản App Store.''',('Quyền riêng tư','Điều khoản sử dụng')]
}
s=json.loads((p/'asc-current.json').read_text());ins={x['attributes']['locale']:x for x in s['appInfo']['localizations']};vs={x['attributes']['locale']:x for x in s['version']['localizations']};summary=[]
for loc in s['selected']:
 sub,kw,promo,desc,labels=copy[loc];a,b=labels;desc+=f'\n\n{a}: https://www.cloud-calendars.com/privacy-policy\n{b}: https://www.apple.com/legal/internet-services/itunes/dev/stdeula/'
 raw={'name':ins[loc]['attributes']['name'],'subtitle':sub,'keywords':kw,'promotionalText':promo,'description':desc};limits={'name':30,'subtitle':30,'keywords':100,'promotionalText':170,'description':4000}
 fields={k:{'value':v,'characters':len(v),'utf8Bytes':len(v.encode()),'characterLimit':limits[k],'withinCharacterLimit':len(v)<=limits[k]} for k,v in raw.items()};assert all(v['withinCharacterLimit'] for v in fields.values()),(loc,{k:v['characters'] for k,v in fields.items()})
 tokens=set(re.findall(r'\w+',raw['name'].casefold()+' '+sub.casefold()));dups=[x for x in kw.split(',') if x.casefold() in tokens];assert not dups,(loc,dups)
 confidence='medium' if loc in ['ca','id','ms','th','vi'] else 'low-medium'
 out={'status':'proposal_only_not_applied','locale':loc,'appId':'6744690319','targetVersion':'1.7.4','targetState':s['version']['attributes']['appStoreState'],'appInfoLocalizationId':ins[loc]['id'],'versionLocalizationId':vs[loc]['id'],'nameAction':'preserve_exact_current_draft_name','fields':fields,'current':{'appInfo':ins[loc]['attributes'],'version':vs[loc]['attributes']},'keywordChecks':{'exactDuplicateKeywords':len(kw.split(','))!=len(set(kw.split(','))),'exactTitleSubtitleTokenDuplicates':dups,'note':'Unicode code-point counts include combining marks. UTF-8 bytes separate. Token checks are not a full linguistic or rendered-text review.'},'readiness':'ready_for_editorial_review_not_applied','translationConfidence':confidence,'caveat':'Model-authored; native-language editorial review recommended, particularly Indic morphology and terminology. No external translator or ASC write validation. Urdu mixed RTL/LTR rendering not visually verified.','evidence':['../../product-facts.json','../localized-batch05/audit.json','asc-current.json'],'applyOnly':['subtitle','keywords','promotionalText','description'],'preserve':['name','release notes','URLs','privacy declarations','screenshots','other locales']}
 (p/(loc+'-proposal.json')).write_text(json.dumps(out,indent=2,ensure_ascii=False)+'\n');(p/(loc+'-description.txt')).write_text(desc+'\n');summary.append({'locale':loc,'name':raw['name'],'subtitle':sub,'counts':{k:{'characters':v['characters'],'utf8Bytes':v['utf8Bytes']} for k,v in fields.items()},'readyForEditorialReview':True,'confidence':confidence})
(p/'validation.json').write_text(json.dumps({'retrievedAt':s['retrievedAt'],'prepared':len(summary),'applied':0,'locales':summary},ensure_ascii=False,indent=2)+'\n');print(json.dumps(summary,ensure_ascii=False,indent=2))
