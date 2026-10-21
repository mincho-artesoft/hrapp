import { LocalisedArticle } from '../types';

export const HELP_FR_FR: Readonly<Record<string, LocalisedArticle>> = {
  "disconnect-calendar-integration-without-losing-track": {
  "updated": "2026-10-22",
  "title": "Déconnecter une intégration de calendrier : accès, synchronisation et copies existantes",
  "short": "Déconnecter une intégration avec précaution",
  "description": "Distinguez déconnexion, accès du fournisseur et copies existantes. Vérifiez les connexions Cloud Calendars avant de supprimer un calendrier.",
  "lede": "Arrêter une connexion et supprimer ses copies de calendrier sont deux décisions différentes. Identifiez le mode de connexion et préservez les informations nécessaires avant de choisir une action. Ce guide est publié par Arte Soft, développeur de Cloud Calendars.",
  "commonBelief": "Se déconnecter suspend seulement les mises à jour, révoque toutes les autorisations associées et laisse toutes les données du calendrier intactes.",
  "sections": [
    {
      "heading": "Identifier la connexion à arrêter",
      "body": [
        "Commencez par le compte et le calendrier qui détiennent les événements. Un compte fournisseur ajouté dans les réglages de l’iPhone, une connexion directe dans Cloud Calendars, un abonnement iCalendar et l’identité de partage de l’app sont des accès distincts. Une même adresse e-mail ne rend pas leurs commandes interchangeables.",
        "Notez les noms des calendriers et la connexion qui les affiche, sans divulguer les détails privés. Déterminez si vous voulez arrêter les accès futurs, quitter un partage ou supprimer une copie. Pour rechercher un événement manquant ou en double, la déconnexion n’est pas la première étape du diagnostic."
      ]
    },
    {
      "heading": "Vérifier ce que la déconnexion de l’app supprime",
      "body": [
        "L’implémentation examinée tente de déconnecter le profil Google sélectionné et de supprimer ses copies de calendrier associées du stockage des calendriers iOS. Considérez cela comme une suppression, pas une pause. Une erreur de connexion reste possible : vérifiez séparément l’état des accès chez le fournisseur sans supposer que toutes les autorisations ont été révoquées.",
        "La déconnexion du profil de calendrier Microsoft tente aussi de supprimer les calendriers associés et les enregistrements locaux de connexion. Ne supposez pas que ces copies resteront visibles. Leur stockage peut dépendre des sources disponibles sur l’appareil : vérifiez la source et préservez les informations nécessaires avant de poursuivre."
      ]
    },
    {
      "heading": "Examiner séparément les accès futurs chez le fournisseur",
      "body": [
        "Les commandes Google pour les applications associées distinguent « Se connecter avec Google » de l’accès aux données du compte Google. Vérifiez l’app, le compte et le type de lien concernés. Retirer l’accès aux données et arrêter un lien de connexion répondent à des questions différentes ; une déconnexion dans l’app ne prouve pas que tous les liens ont disparu.",
        "Pour un compte professionnel ou scolaire Microsoft, la documentation décrit My Apps > Manage your application pour examiner les autorisations. Vous pouvez révoquer celles que vous avez accordées, mais les droits accordés par l’administrateur nécessitent son intervention. Ces instructions concernent les comptes professionnels ou scolaires, pas tous les comptes Microsoft personnels."
      ]
    },
    {
      "heading": "Distinguer l’identité de partage de la synchronisation du fournisseur",
      "body": [
        "Cloud Calendars possède aussi un compte utilisé pour le partage. Son code actuel traite sa déconnexion séparément des profils de calendrier : il efface la session locale de partage et ramène les accès partagés suivis localement au statut lecteur. Cela ne signifie pas que toutes les données serveur ont été supprimées.",
        "Lorsque plusieurs identités de partage sont liées, en déconnecter une conserve le compte grâce à une autre identité. Pour la dernière, le parcours actuel ferme la session locale et garde le lien serveur pour la récupération. Ne remplacez pas une demande de suppression des données par une déconnexion et ne supposez pas qu’elle déconnecte tous les fournisseurs de calendriers."
      ]
    },
    {
      "heading": "Traiter les abonnements et les anciennes copies selon leurs règles",
      "body": [
        "Apple décrit le désabonnement d’un calendrier externe séparément du choix des calendriers à afficher. Si l’élément est un abonnement en lecture seule, identifiez-le avant d’utiliser sa commande de désabonnement. Masquer un calendrier, se désabonner d’un flux et supprimer un calendrier modifiable sont des opérations différentes.",
        "Google indique que retirer l’accès d’une app peut nécessiter une demande distincte pour supprimer les données déjà détenues par le développeur. Un fichier exporté ou la copie d’une autre personne n’est pas non plus rappelé par un changement d’autorisation. Distinguez le suivi de confidentialité ou de conservation de l’autorisation des nouvelles mises à jour."
      ]
    },
    {
      "heading": "Confirmer le résultat avant tout autre nettoyage",
      "body": [
        "Après une modification voulue, vérifiez l’état de connexion chez le fournisseur et comparez le calendrier original à l’app. Identifiez ce qui ne se met plus à jour, ce qui a disparu localement et ce qui reste ailleurs. Ne supprimez pas des événements semblables uniquement parce qu’un nom de connexion n’apparaît plus.",
        "Si le résultat est inattendu, arrêtez le nettoyage et contactez l’assistance avec le mode de connexion, la source du calendrier et l’action utilisée. N’envoyez ni mots de passe, ni jetons d’accès, ni adresses privées de flux, ni captures de rendez-vous sensibles. Précisez si le calendrier du fournisseur contient encore les événements pour distinguer un problème de connexion d’une copie manquante."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifiez précisément le compte, le calendrier et le mode de connexion.",
    "Décidez si vous voulez arrêter un accès, quitter un partage ou supprimer une copie.",
    "Préservez les informations nécessaires par une méthode d’exportation ou de sauvegarde vérifiée.",
    "Avant d’utiliser la commande installée de déconnexion, vérifiez ce qu’elle supprime.",
    "Examinez séparément les autorisations du fournisseur ; sollicitez un administrateur pour les accès gérés.",
    "Vérifiez le résultat chez le fournisseur et dans l’app avant tout autre nettoyage."
  ],
  "faq": [
    {
      "q": "Se déconnecter d’une connexion directe Cloud Calendars conserve-t-il ses copies de calendrier ?",
      "a": "Ne le supposez pas. Les parcours de profils Google et Microsoft examinés tentent de supprimer les calendriers associés du stockage iOS. Vérifiez la source et préservez les informations nécessaires avant la déconnexion."
    },
    {
      "q": "Retirer l’accès Google d’une app supprime-t-il les données déjà copiées ?",
      "a": "Google indique qu’une demande distincte peut être nécessaire pour supprimer les données déjà détenues par le développeur. Considérez l’accès futur et les données conservées comme des résultats différents."
    },
    {
      "q": "Se déconnecter du compte de partage revient-il à le supprimer ?",
      "a": "Non. Le parcours actuel efface une session locale et conserve des mécanismes de récupération. Il est distinct des déconnexions de fournisseurs et ne prouve pas la suppression des données serveur."
    }
  ],
  "sourcesHeading": "Instructions officielles sur les accès et les abonnements",
  "sources": [
    {
      "label": "Google : gérer les applications associées et les différents types de connexion",
      "url": "https://support.google.com/accounts/answer/13533235?hl=en"
    },
    {
      "label": "Google : accès et données déjà détenues par une application associée",
      "url": "https://support.google.com/accounts/answer/14012355?hl=en"
    },
    {
      "label": "Microsoft : autorisations My Apps des comptes professionnels ou scolaires",
      "url": "https://support.microsoft.com/en-us/accounts-billing/work-school/edit-or-revoke-application-permissions-in-the-my-apps-portal"
    },
    {
      "label": "Apple : sélection des calendriers et abonnements sur iPhone",
      "url": "https://support.apple.com/guide/iphone/use-multiple-calendars-iph3d1110d4/ios"
    }
  ],
  "seeAlso": [
    "calendar-export-ics-pdf-and-backup",
    "taking-back-a-calendar-you-shared",
    "the-secret-address-of-a-google-calendar",
    "icloud-google-and-outlook-in-one-view",
    "google-calendars-that-never-reach-your-iphone"
  ]
},

  "calendar-notifications-missing-silent-or-duplicated": {
    "updated": "2026-10-21",
    "title": "Notifications de calendrier sur iPhone : absentes, silencieuses ou en double ?",
    "short": "Dépanner les notifications",
    "description": "Distinguez les alertes des événements, Cloud Calendars et les réglages de l’iPhone. Diagnostiquez les rappels sans supprimer de données.",
    "lede": "Commencez par ce qui s’est réellement passé : l’événement manque-t-il, la notification est-elle absente, silencieuse, ou envoyée par deux apps ? Chaque cas appelle une vérification différente. Ce guide est publié par Arte Soft, le développeur de Cloud Calendars.",
    "commonBelief": "Si un événement apparaît dans le calendrier, toutes les alertes et autorisations de notification sont forcément déjà configurées.",
    "sections": [
      {
        "heading": "Choisir d’abord la bonne piste",
        "body": [
          "Si l’événement lui-même manque, vérifiez son compte d’origine et le calendrier sélectionné avant de modifier le son. Une alerte ne permet pas de savoir si le bon événement est arrivé dans l’app. Consultez le guide de synchronisation pour ce problème distinct.",
          "Si l’événement est visible sans notification, vérifiez l’alerte enregistrée et les deux niveaux de réglages ci-dessous. Si la notification est silencieuse, examinez la réception et le son sur l’iPhone. S’il y en a plusieurs, identifiez les apps expéditrices et les alertes configurées avant de retirer quoi que ce soit."
        ]
      },
      {
        "heading": "Aucune notification : vérifier l’événement et l’app",
        "body": [
          "Ouvrez l’événement et vérifiez l’heure de son alerte. L’éditeur de Cloud Calendars propose « Alert » et, selon le cas, « Second Alert », avec « None » et plusieurs délais avant l’événement. Une deuxième alerte peut être volontaire. Vérifiez de nouveau l’événement enregistré après modification, surtout si le fournisseur ou les droits d’un calendrier partagé limitent les changements.",
          "Dans les réglages de Cloud Calendars, recherchez « Event Notifications ». Les notifications d’invitations et de météo sont séparées : activer l’une ne prouve pas que les rappels d’événements sont actifs. Vérifiez à la fois « Event Notifications » et l’autorisation de notification d’iOS.",
          "La sélection du calendrier compte aussi : la planification actuelle utilise les alertes des calendriers sélectionnés. Vérifiez que le bon calendrier est coché. Ne supposez pas que masquer un calendrier change uniquement son apparence dans cette app, et ne supprimez pas d’événements pour arrêter les rappels."
        ]
      },
      {
        "heading": "Alerte silencieuse ou retardée : vérifier l’iPhone",
        "body": [
          "Dans Réglages sur l’iPhone, ouvrez les notifications et choisissez Cloud Calendars. Vérifiez l’autorisation, les endroits où les alertes peuvent apparaître et les réglages sonores. Regardez si un résumé programmé ou un mode Concentration actif modifie leur réception. Il s’agit de réglages système Apple, pas du menu « Alert » d’un événement. Les libellés peuvent varier selon iOS.",
          "Une bannière sans son n’est pas la même observation qu’une absence totale de notification. Notez si elle apparaît sur l’écran verrouillé ou dans le centre de notifications, si le téléphone était utilisé et quel mode Concentration était actif. Modifiez un seul réglage pertinent à la fois. Le compte à rebours d’une activité en direct est un autre affichage ; sa présence ne garantit pas un rappel sonore."
        ]
      },
      {
        "heading": "Deux alertes : identifier les expéditeurs",
        "body": [
          "Lisez le nom de l’app sur chaque notification. Calendrier Apple, Google Agenda et Cloud Calendars peuvent notifier séparément, même s’ils affichent des événements liés. Deux notifications ne prouvent pas l’existence de deux enregistrements. Comparez aussi les horaires : un rappel la veille et un autre près du début peuvent correspondre aux choix enregistrés.",
          "Le guide de Google précise que les réglages de notification sont propres au compte et que ceux d’un événement peuvent différer des valeurs du calendrier. Ces instructions concernent Google Agenda, pas Cloud Calendars. Vérifiez l’expéditeur concerné au lieu de supposer qu’un seul interrupteur commande toutes les apps.",
          "Choisissez l’app qui doit vous prévenir, puis ajustez seulement le rappel ou le réglage concerné. S’il reste deux véritables événements, comparez leurs calendriers et propriétaires à l’aide du guide sur les doublons. N’annulez pas une vraie réunion simplement pour supprimer une alerte supplémentaire."
        ]
      },
      {
        "heading": "Isoler le problème avec un événement de test",
        "body": [
          "Créez un rendez-vous de test clairement nommé dans un calendrier vous appartenant et modifiable. Placez son début assez loin dans le futur pour que l’heure de l’alerte soit elle aussi à venir. Vérifiez le calendrier sélectionné, l’alerte enregistrée et les deux autorisations. Notez l’heure attendue et l’app qui doit envoyer la notification.",
          "Observez séparément l’apparition de la notification et son éventuel son. Ne recommencez qu’après avoir modifié un réglage suspect. Utilisez un événement ordinaire sans invités, pas une réunion importante ni une série récurrente. Conservez le résultat avec les versions de l’app et d’iOS pour les comparer ultérieurement."
        ]
      },
      {
        "heading": "Si les résultats restent irréguliers",
        "body": [
          "L’app programme un nombre limité d’alertes à venir ; ne comptez pas sur une file illimitée de rappels lointains. Vérifiez votre version installée et consignez les anomalies. Signalez les versions de l’app et d’iOS, le type de calendrier, le délai de l’alerte, l’heure attendue et le résultat.",
          "N’incluez pas de titres privés, d’adresses d’invités ou de liens d’abonnement dans un signalement public. Réinstaller, effacer le stockage local ou retirer des comptes ne sont pas les premières étapes du diagnostic. Préservez les événements et les comptes pendant l’examen par l’assistance."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Distinguez événement absent, notification absente, réception silencieuse et alertes multiples.",
      "Vérifiez l’alerte enregistrée et le calendrier sélectionné.",
      "Vérifiez « Event Notifications » séparément de l’autorisation de l’iPhone.",
      "Pour les doublons, comparez les apps expéditrices et les heures d’alerte.",
      "Utilisez un événement futur de test sans modifier de vraies invitations."
    ],
    "faq": [
      {
        "q": "Activer les notifications météo active-t-il les rappels d’événements ?",
        "a": "Non. Les réglages d’événements, d’invitations et de météo sont séparés. Vérifiez « Event Notifications » et l’autorisation iOS pour les rappels ordinaires."
      },
      {
        "q": "Faut-il supprimer un événement quand deux alertes arrivent ?",
        "a": "Identifiez d’abord les apps et les horaires. Plusieurs apps ou plusieurs alertes d’un même événement peuvent en être la cause. La suppression n’est pas une méthode de diagnostic sûre."
      },
      {
        "q": "Une alerte configurée garantit-elle la réception ?",
        "a": "Non. Ce n’est qu’un maillon. Les préférences de l’app, l’autorisation système et les réglages de réception comptent aussi. Vérifiez le résultat sur votre appareil."
      }
    ],
    "sourcesHeading": "Sources et réglages de notification",
    "sources": [
      {
        "label": "Apple : modifier les notifications sur iPhone",
        "url": "https://support.apple.com/guide/iphone/change-notification-settings-iph7c3d96bab/ios"
      },
      {
        "label": "Google : modifier les notifications de Google Agenda sur iPhone et iPad",
        "url": "https://support.google.com/calendar/answer/37242?hl=en&co=GENIE.Platform%3DiOS"
      }
    ],
    "seeAlso": [
      "what-calendar-sync-actually-does",
      "when-two-calendars-disagree"
    ]
  },
  "find-old-calendar-events-by-account-date-and-title": {
    "updated": "2026-10-21",
    "title": "Retrouver un ancien événement : compte, dates et champs de recherche",
    "short": "Retrouver des événements passés",
    "description": "Un résultat vide ne prouve pas une suppression. Vérifiez le compte, la période et les champs recherchés avant de consulter l’archive du fournisseur.",
    "lede": "Si vous vous souvenez d’une réunion sans la retrouver, séparez trois questions : quel compte la contenait, quelles dates couvre la vue et quels champs sont recherchés ? Ce guide est publié par Arte Soft, le développeur de Cloud Calendars.",
    "commonBelief": "Chaque champ de recherche d’une app de calendrier parcourt tous les champs de tous les événements jamais stockés par le fournisseur.",
    "sections": [
      {
        "heading": "Partir d’un indice simple et utile",
        "body": [
          "Notez un mois ou une année approximative, un mot distinctif du titre et le compte probablement utilisé. Gardez ces indices séparés. Le nom d’un collègue pouvait être dans les invités plutôt que dans le titre ; une adresse pouvait figurer uniquement dans le lieu.",
          "Essayez un court fragment du titre avant une longue expression. Un résultat vide ne dit pas si l’enregistrement manque, se trouve hors des dates chargées ou contient le terme dans un champ non recherché."
        ]
      },
      {
        "heading": "Vérifier le compte et la sélection du calendrier",
        "body": [
          "Identifiez le compte et le calendrier d’origine. Un calendrier Google professionnel, un calendrier iCloud personnel et un calendrier local sur l’appareil sont des destinations différentes, même affichées ensemble. Vérifiez que vous avez toujours accès au compte attendu et que son calendrier est sélectionné.",
          "Ne créez pas de copie simplement parce que la recherche est vide. Si vous trouvez l’événement en parcourant sa date approximative, examinez son titre, son calendrier et son organisateur. Vous pourrez comparer ces éléments à la recherche sans modifier le contenu."
        ]
      },
      {
        "heading": "Vérifier les dates et champs de la recherche Cloud Calendars",
        "body": [
          "Cloud Calendars recherche dans les titres des événements chargés, sans distinguer majuscules et minuscules. Utilisez un mot caractéristique du titre. N’attendez pas de correspondance pour un lieu, une adresse d’invité ou une note uniquement parce qu’ils figurent ailleurs dans l’événement.",
          "La vue de recherche actuelle charge l’année civile en cours pour les calendriers sélectionnés. Une réunion d’une année précédente peut donc être absente de cette recherche tout en existant chez le fournisseur. Vérifiez la période avant d’interpréter un résultat vide.",
          "Parcourir une ancienne date et rechercher dans une ancienne année sont deux actions distinctes. Pour l’historique, utilisez les outils du fournisseur lorsqu’ils existent, avec le même compte. Vérifiez les possibilités de votre version installée au lieu de supposer que toutes les années sont recherchées."
        ]
      },
      {
        "heading": "Utiliser les champs et périodes documentés par le fournisseur",
        "body": [
          "Sur ordinateur, les options de recherche de Google Agenda permettent de filtrer par calendrier, informations d’événement, personnes, lieu et période. Google recommande une recherche avancée limitée dans le temps lorsque d’anciens événements manquent et indique une limite de 200 résultats. Divisez une recherche large en périodes plus petites plutôt que de considérer la première liste comme complète.",
          "Ce sont les commandes du site Google Agenda, pas celles de Cloud Calendars. De même, le guide Apple indique que Calendrier sur iPhone recherche les titres, invités, lieux et notes. Cela décrit l’app Calendrier d’Apple. Employer EventKit dans une autre app ne lui donne pas automatiquement la même interface ni les mêmes règles de recherche."
        ]
      },
      {
        "heading": "Interpréter les endroits où l’événement apparaît",
        "body": [
          "Présent chez le fournisseur mais absent de Cloud Calendars : vérifiez le compte, la sélection du calendrier, la période et le titre recherché. Conservez l’enregistrement d’origine. La question suivante est ce que l’app a chargé ou trouvé, pas s’il faut recréer la réunion.",
          "Présent en parcourant les dates mais absent de la recherche : comparez le titre réel à la requête et notez la date. Cela aide à identifier un problème de portée ou de correspondance. Ne renommez pas une ancienne réunion simplement pour faire réussir un test.",
          "Absent aussi chez le fournisseur : confirmez le compte, les droits d’accès et la période avant d’examiner la conservation ou la suppression avec ce fournisseur. Pour un calendrier local, un site fournisseur n’est pas une copie indépendante sans connexion distincte établie. Ne supposez pas que tout événement local possède une archive cloud."
        ]
      },
      {
        "heading": "Documenter la recherche sans divulguer l’événement",
        "body": [
          "Pour l’assistance, notez la version de l’app, le fournisseur ou le stockage local, l’année approximative et si l’événement apparaît chez le fournisseur ou par navigation. Précisez si la requête était un mot du titre, un lieu ou un invité. C’est plus utile que dire seulement que la recherche ne fonctionne pas.",
          "Évitez d’envoyer des notes privées, des liens d’invitation ou des adresses secrètes de flux calendrier. Préservez les comptes et les données locales ; vider le stockage ou réimporter un ancien fichier peut compliquer le diagnostic."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Identifiez le compte probable et la date approximative.",
      "Vérifiez que le calendrier est accessible et sélectionné.",
      "Essayez un mot caractéristique du titre.",
      "Distinguez la recherche de l’année en cours de l’archive du fournisseur.",
      "Utilisez au besoin les filtres de date de Google sur le Web ou les champs documentés de Calendrier Apple.",
      "Notez où apparaît l’événement avant de modifier des données."
    ],
    "faq": [
      {
        "q": "Un résultat vide signifie-t-il que mon ancien événement a été supprimé ?",
        "a": "Non. Un autre compte, un calendrier non sélectionné, une date hors de la période chargée ou un champ non recherché peuvent l’expliquer. Vérifiez le fournisseur et la date approximative."
      },
      {
        "q": "Puis-je rechercher un e-mail d’invité ou une note dans Cloud Calendars ?",
        "a": "La recherche actuelle compare le texte du titre. Pour les invités, notes ou lieux, utilisez les outils documentés du fournisseur correspondant."
      },
      {
        "q": "Parcourir l’année passée étend-il la recherche à cette année ?",
        "a": "Ne comptez pas dessus. La vue de recherche actuelle charge l’année en cours à son ouverture. Pour l’historique, utilisez une recherche par période chez le fournisseur, sans supposer un historique illimité dans l’app."
      }
    ],
    "sourcesHeading": "Sources et aide à la recherche",
    "sources": [
      {
        "label": "Google : rechercher dans Google Agenda sur ordinateur",
        "url": "https://support.google.com/calendar/answer/37176?hl=en&co=GENIE.Platform%3DDesktop"
      },
      {
        "label": "Apple : rechercher des événements dans Calendrier sur iPhone",
        "url": "https://support.apple.com/guide/iphone/search-for-events-iph2c9ef44ad/ios"
      }
    ],
    "seeAlso": [
      "what-calendar-sync-actually-does",
      "a-list-for-people-who-dislike-grids",
      "when-two-calendars-disagree"
    ]
  },
  "calendar-export-ics-pdf-and-backup": {
  "updated": "2026-10-21",
  "title": "Exporter un calendrier : fichiers ICS, PDF et abonnements",
  "short": "Export et sauvegarde du calendrier",
  "description": "Besoin d’un fichier de calendrier ? Choisissez ICS, PDF ou un abonnement, puis la procédure adaptée dans Google, sur Mac ou dans Outlook.",
  "lede": "Le calendrier de votre iPhone peut afficher plusieurs comptes. Pour obtenir une copie utile, identifiez la source et choisissez entre données d’événements, planning lisible et mises à jour continues. Ce guide est publié par Arte Soft, le développeur de Cloud Calendars.",
  "sections": [
    {
      "heading": "Choisir le résultat avant le format",
      "body": [
        "Exporter un calendrier peut répondre à plusieurs besoins. Pour transmettre des enregistrements à une autre app, choisissez un format structuré compatible, comme ICS. Pour un planning lisible, choisissez un PDF ou une impression. Pour recevoir les changements futurs, examinez un abonnement ou un partage avec autorisations.",
        "Un PDF conserve la mise en page enregistrée ; ce n’est pas un fichier d’importation d’événements. Un ICS téléchargé contient les données au moment de son obtention. Un abonnement ICS utilise une adresse que le logiciel consulte de nouveau. L’extension seule ne dit pas si le destinataire a importé une copie ou s’est abonné aux changements.",
        "Un itinéraire de week-end en PDF se lit facilement. Un collègue qui transfère des rendez-vous vers un autre compte a besoin des données d’événements. Un membre de club qui suit des rencontres susceptibles de changer a besoin d’une source actualisée. Déterminez ce résultat avant tout envoi."
      ]
    },
    {
      "heading": "Commencer par le compte qui contient les événements",
      "body": [
        "Sur l’iPhone, identifiez le calendrier et le compte concernés. Une vue combinée peut contenir plusieurs comptes, calendriers partagés et abonnements. Les voir ensemble ne signifie pas qu’ils forment un seul calendrier source à exporter.",
        "Pour Google Agenda, utilisez un ordinateur : son app ne propose pas l’exportation. Sur le site, ouvrez « Settings », puis « Import & export » et « Export ». Le ZIP téléchargé contient des fichiers ICS individuels. Pour un seul calendrier, ouvrez ses « Settings and sharing » puis « Export calendar ». Google exige le droit de gérer les modifications et le partage ; une organisation peut aussi restreindre l’exportation.",
        "Pour un calendrier disponible dans Calendrier sur Mac, sélectionnez son nom dans la barre latérale puis « File > Export > Export » afin de créer un ICS. C’est une procédure Mac, pas une commande cachée sur iPhone. Vérifiez le calendrier sélectionné avant d’enregistrer."
      ]
    },
    {
      "heading": "Quand un planning PDF est nécessaire",
      "body": [
        "Dans Calendrier sur Mac, utilisez « File > Print » et choisissez la présentation, la période et les calendriers inclus. Dans la boîte d’impression de macOS, utilisez le menu PDF et « Save as PDF ». Ouvrez le résultat avant de l’envoyer : une petite grille peut omettre ou tronquer des détails utiles.",
        "Précisez la période et le fuseau horaire dans le message accompagnant le document. Relisez les rendez-vous privés, notes et lieux avant partage. Des modifications ultérieures ne réécrivent pas un PDF déjà envoyé ; identifiez clairement une copie révisée."
      ]
    },
    {
      "heading": "Abonnement et publication ne sont pas une sauvegarde",
      "body": [
        "Microsoft distingue explicitement les deux usages dans Outlook sur le Web : télécharger puis importer un ICS publié crée une copie sans mises à jour futures ; s’abonner à son adresse suit les changements. La fréquence dépend du fournisseur du destinataire, et le calendrier publié est en lecture seule.",
        "Lorsque cette option est disponible, « Settings > Shared calendars > Publish a calendar » dans Outlook permet de choisir calendrier et niveau de détail. Publier l’expose à la consultation ou à l’abonnement. Utilisez cela pour une audience prévue, pas comme technique de sauvegarde privée. Un lien enregistré dépend toujours de la disponibilité de sa source."
      ]
    },
    {
      "heading": "Ce que propose le partage de Cloud Calendars",
      "body": [
        "Nous développons Cloud Calendars. Le partage d’événements propose App Clip, e-mail et QR pour transmettre des liens d’invitation. Ces liens servent un autre objectif que télécharger un calendrier entier. Ils peuvent ouvrir une invitation ou un abonnement, mais ne constituent pas une archive portable de tous les calendriers affichés.",
        "Ce guide ne propose pas de procédure d’exportation complète en ICS, CSV ou PDF depuis Cloud Calendars. Utilisez les méthodes documentées du fournisseur ou du Mac. Pour un événement précis, consultez notre guide de partage ; pour un planning commun suivi dans le temps, décidez qui a besoin d’accès, de mises à jour ou de droits de modification."
      ]
    },
    {
      "heading": "Vérifier une copie avant de s’y fier",
      "body": [
        "Conservez le calendrier original pendant la vérification. Notez compte, nom du calendrier et date d’exportation. Pour tester un import, utilisez si possible un calendrier de destination distinct, puis comparez un rendez-vous ordinaire, un événement sur toute la journée et une série avec une occurrence modifiée.",
        "Un transfert ne garantit pas la conservation de toutes les fonctions de réunion. Google indique que les événements importés omettent invités et données de conférence, et que les récurrences CSV peuvent devenir des événements ponctuels séparés. Vérifiez invitations, liens de réunion et répétitions avant de considérer la migration comme terminée.",
        "Apple propose aussi « File > Export > Calendar Archive » sur Mac, qui produit une archive ICBU. Cette opération diffère de l’export d’un ICS. Apple avertit que l’importation d’une archive remplace les informations et données actuelles du calendrier. N’utilisez pas une restauration d’archive comme simple essai d’importation."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifiez compte et calendrier, puis choisissez une copie datée, un planning imprimable ou un abonnement actualisé.",
    "Utilisez la procédure documentée et conservez l’original pendant la vérification.",
    "Vérifiez destination, données sensibles et événements représentatifs avant partage ou utilisation."
  ],
  "faq": [
    {
      "q": "Puis-je exporter Google Agenda directement depuis son app iPhone ?",
      "a": "Non. La procédure documentée par Google nécessite un ordinateur et l’autorisation appropriée de gestion du partage."
    },
    {
      "q": "Un abonnement ICS constitue-t-il une sauvegarde ?",
      "a": "Il suit une source qui peut changer ou disparaître. Pour une copie datée, enregistrez un export indépendant et vérifiez ce qu’il conserve."
    },
    {
      "q": "Faut-il choisir ICS ou PDF ?",
      "a": "ICS convient aux données importables dans un calendrier compatible. PDF convient à un planning lisible. Un PDF ne fournit pas de mises à jour et ne reconstitue pas des événements modifiables par les procédures d’importation documentées."
    }
  ],
  "sourcesHeading": "Instructions officielles et limites des formats",
  "sources": [
    {
      "label": "Google : exporter des événements de calendrier",
      "url": "https://support.google.com/calendar/answer/37111?hl=en"
    },
    {
      "label": "Google : importation et limites des transferts",
      "url": "https://support.google.com/calendar/answer/37118?hl=en"
    },
    {
      "label": "Apple : fichiers ICS et archives de calendrier sur Mac",
      "url": "https://support.apple.com/guide/calendar/import-or-export-calendars-icl1023/mac"
    },
    {
      "label": "Apple : enregistrer un document en PDF sur Mac",
      "url": "https://support.apple.com/en-gb/guide/mac-help/mchlp1531/mac"
    },
    {
      "label": "Microsoft : publication, importation et abonnement dans Outlook",
      "url": "https://support.microsoft.com/en-us/outlook/share-your-calendar-in-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "sharing-one-event-not-your-calendar",
    "inviting-people-who-do-not-have-the-app",
    "the-secret-address-of-a-google-calendar",
    "disconnect-calendar-integration-without-losing-track"
  ]
}
};
