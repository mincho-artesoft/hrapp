import { LocalisedArticle } from '../types';

export const HELP_FR_FR: Readonly<Record<string, LocalisedArticle>> = {
  "caldav-calendar-on-iphone": {
  "updated": "2026-10-22",
  "title": "Calendrier CalDAV sur iPhone : configuration, accès et événements manquants",
  "short": "Calendriers CalDAV sur iPhone",
  "description": "Ajoutez un compte CalDAV dans les réglages de l’iPhone, puis vérifiez les accès et calendriers sélectionnés. Distinguez compte, abonnement et copie.",
  "lede": "Un calendrier peut être présent sur son serveur sans apparaître dans une app iPhone. Vérifiez dans l’ordre le compte, le système de calendrier de l’appareil, puis la sélection dans l’app. Ce guide est publié par Arte Soft, le développeur de Cloud Calendars.",
  "commonBelief": "N’importe quelle URL de calendrier équivaut à un compte CalDAV, et un seul ajout permet à toutes les apps de le lire et de le modifier.",
  "sections": [
    {
      "heading": "Distinguer un compte, un abonnement et un fichier importé",
      "body": [
        "Avant toute saisie, demandez au fournisseur quelle connexion il prend en charge sur iPhone. Un compte CalDAV utilise des informations de serveur et de compte. Un abonnement iCal suit un flux de calendrier ; ouvrir un fichier de calendrier exporté peut créer une copie distincte. Ces méthodes répondent à des besoins différents, même si elles affichent des rendez-vous portant les mêmes titres.",
        "Par exemple, la personne qui administre un club et doit actualiser le planning partagé a besoin d’une méthode de modification autorisée par le fournisseur. Un membre qui consulte simplement le planning peut avoir un abonnement. Il ne doit pas multiplier les essais en utilisant l’URL du flux comme identifiant, ni supposer que voir un événement lui donne le droit de le modifier."
      ]
    },
    {
      "heading": "Suivre les instructions iPhone du fournisseur et les réglages de compte Apple",
      "body": [
        "Le guide actuel d’Apple indique le chemin suivant pour configurer CalDAV : Settings > Apps > Calendar > Calendar Accounts > Add Account > Add Other Account > CalDAV account. Saisissez les informations de serveur et de compte fournies par votre service. Les intitulés peuvent différer sur les anciennes versions d’iOS. Choisissez l’option de compte propre au service lorsque ses instructions le demandent.",
        "Vérifiez les exigences d’authentification du fournisseur avant de saisir un mot de passe : certains services utilisent un mot de passe spécifique à une app ou une autre procédure approuvée. Ne remplacez pas ces instructions par celles d’une autre app de calendrier et ne déduisez pas une adresse de serveur du domaine d’une adresse e-mail. Pour un compte professionnel, utilisez la configuration approuvée par votre organisation plutôt que de modifier les contrôles de sécurité pour réussir la connexion."
      ]
    },
    {
      "heading": "Vérifier d’abord que le calendrier apparaît dans Calendrier d’Apple",
      "body": [
        "Ouvrez Calendrier d’Apple et recherchez le compte et le calendrier concerné dans sa liste de calendriers. Comparez un rendez-vous ordinaire avec la vue du fournisseur : titre, nom du calendrier, date et heure locale. Une connexion au compte réussie n’est qu’une première observation ; elle ne permet pas de savoir quels calendriers et quelles dates sont réellement arrivés sur l’appareil.",
        "Si le rendez-vous manque déjà à cet endroit, examinez le compte avec le fournisseur avant de l’ajouter à répétition dans une autre app. Apple décrit une fréquence de récupération des données pour les comptes sans prise en charge de Push. Cela ne garantit pas l’actualisation immédiate de chaque compte ou app destinataire. Notez où le rendez-vous est visible et l’heure de votre vérification."
      ]
    },
    {
      "heading": "Vérifier l’accès de Cloud Calendars et les calendriers sélectionnés",
      "body": [
        "Cloud Calendars lit les calendriers de l’appareil par l’intermédiaire du système de calendrier d’Apple. Dans les réglages de confidentialité et de sécurité de l’iPhone, consultez son accès aux calendriers. Un accès complet au calendrier est nécessaire pour lire les événements existants ; l’autorisation d’ajouter des événements ne donne pas accès au planning existant.",
        "Ouvrez ensuite la liste des calendriers dans Cloud Calendars. Recherchez le calendrier voulu, notamment dans le groupe Other, et vérifiez qu’il est sélectionné. Un calendrier disponible sur l’appareil peut néanmoins présenter des limites de compatibilité ou de partage propres au fournisseur. S’il apparaît dans Calendrier d’Apple mais pas ici, notez cette différence plutôt que de créer une seconde connexion au compte."
      ]
    },
    {
      "heading": "Vérifier séparément la modification et la destination",
      "body": [
        "Un compte peut contenir des calendriers avec des autorisations différentes. Voir un événement ne prouve pas que le fournisseur acceptera une modification, et disposer d’un éditeur local ne confère aucun droit. Conservez une invitation reçue ou une réunion récurrente déjà établie dans son calendrier d’origine pendant la vérification de la connexion.",
        "Si vous possédez un calendrier modifiable et devez tester cette méthode, utilisez un rendez-vous d’essai au nom explicite, sans données sensibles. Choisissez expressément le calendrier de destination, enregistrez, puis vérifiez la vue du fournisseur. Effectuez ensuite une petite modification et comparez de nouveau. Ne testez pas en déplaçant une véritable réunion partagée entre calendriers : cela modifie l’organisation que vous cherchez à examiner."
      ]
    },
    {
      "heading": "Diagnostiquer les doublons sans supprimer la source",
      "body": [
        "Si le même rendez-vous apparaît deux fois, notez les deux noms de calendrier et la méthode par laquelle chacun est arrivé sur le téléphone. Une connexion de compte, un abonnement à un flux et un ancien import peuvent coexister. Masquez temporairement un calendrier pour identifier l’affichage qu’il fournit ; masquer n’est pas supprimer un événement ni retirer un compte. Notez la sélection initiale et rétablissez-la après la comparaison. Dans Cloud Calendars, la sélection peut aussi avoir un effet sur les widgets, la programmation des notifications et la synchronisation Google.",
        "Pour contacter l’assistance, précisez le fournisseur, la version d’iOS, le nom du calendrier, la méthode de connexion et les endroits où le rendez-vous d’essai est visible. N’incluez pas de mots de passe, d’URL de flux privées ou de détails sensibles d’événements dans les captures d’écran. Ce guide décrit une procédure de compte sur l’appareil ; il n’établit pas que Cloud Calendars assure une synchronisation CalDAV directe entre serveurs ou une copie automatique des disponibilités entre fournisseurs."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Déterminez si vous disposez d’un compte CalDAV, d’un abonnement à un flux ou d’un fichier exporté.",
    "Suivez la procédure de configuration et d’authentification iPhone approuvée par le fournisseur.",
    "Vérifiez le calendrier voulu et un rendez-vous connu dans Calendrier d’Apple.",
    "Examinez l’accès de Cloud Calendars aux calendriers et sélectionnez le calendrier voulu.",
    "Utilisez un événement d’essai jetable dans un calendrier qui vous appartient pour vérifier les modifications autorisées.",
    "Comparez les méthodes de connexion avant de masquer un affichage en double ou de demander de l’aide."
  ],
  "faq": [
    {
      "q": "Un compte CalDAV est-il la même chose qu’un abonnement iCal ?",
      "a": "Non. L’accès à un compte et l’abonnement à un flux de calendrier sont des connexions différentes. Vérifiez la méthode fournie par votre service et si elle permet la modification."
    },
    {
      "q": "Pourquoi Calendrier d’Apple affiche-t-il un événement absent de Cloud Calendars ?",
      "a": "Vérifiez l’autorisation d’accès aux calendriers de Cloud Calendars et la sélection du calendrier concerné. S’il reste absent, notez le compte et le calendrier en cause ; sa présence dans une app ne garantit pas le comportement de toutes les autres."
    },
    {
      "q": "Cela signifie-t-il que Cloud Calendars se connecte directement à n’importe quel serveur CalDAV ?",
      "a": "Non. Cette procédure ajoute le compte dans les réglages de l’iPhone, puis vérifie les calendriers de l’appareil accessibles à l’app. La compatibilité du fournisseur, l’authentification et les droits de modification restent à vérifier."
    }
  ],
  "sourcesHeading": "Instructions officielles sur les comptes et les autorisations",
  "sources": [
    {
      "label": "Apple : réglages des comptes de calendrier, configuration CalDAV et récupération des données",
      "url": "https://support.apple.com/guide/iphone/change-calendar-settings-iphc37be2016/ios"
    },
    {
      "label": "Apple : vérifier l’accès aux informations du calendrier",
      "url": "https://support.apple.com/en-ca/guide/iphone/iph251e92810/ios"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "calendar-export-ics-pdf-and-backup"
  ]
},

  "work-and-personal-without-two-apps": {
  "updated": "2026-10-22",
  "title": "Calendriers professionnels et personnels dans une app : gardez leurs propriétaires distincts",
  "short": "Travail et vie privée, une app",
  "description": "Consultez vos calendriers professionnels et personnels ensemble. Vérifiez droits, destinations et offres avant de connecter vos comptes.",
  "lede": "Une vue d’ensemble aide à repérer les conflits sans perdre de vue à qui appartient chaque événement. Vérifiez les calendriers affichés et les connexions de comptes utilisées pour stocker leurs copies. Ce guide est rédigé par Arte Soft, développeur de Cloud Calendars.",
  "commonBelief": "Afficher les calendriers professionnels et personnels dans une app fusionne aussi leurs autorisations de partage.",
  "sections": [
    {
      "heading": "Une vue d’ensemble ne vaut pas un accès partagé",
      "body": [
        "Une app peut afficher plusieurs calendriers sélectionnés ensemble, chacun conservant son compte et ses autorisations. Le guide d’Apple sur les calendriers multiples explique comment choisir les calendriers affichés, leur attribuer des couleurs et sélectionner un calendrier par défaut. Ces choix d’affichage ne transfèrent pas la propriété des événements.",
        "Avant de connecter un compte professionnel, vérifiez les exigences de votre organisation. Google indique que les administrateurs peuvent restreindre le partage des calendriers. Une vue personnelle pratique ne vous autorise pas à publier des informations professionnelles ni à contourner les restrictions du compte.",
        "Les connexions Google et Microsoft de Cloud Calendars utilisent des copies de calendriers dans le stockage des calendriers de l’iPhone. Les sources de calendrier disponibles peuvent influer sur l’emplacement de ces copies. L’autorisation de connecter un compte professionnel doit donc tenir compte du trajet réel des données, pas seulement du nom du compte affiché."
      ]
    },
    {
      "heading": "Utilisez les couleurs et la visibilité pour organiser la vue",
      "body": [
        "Attribuez des couleurs distinctes aux calendriers professionnels et personnels, puis examinez une journée chargée avec les deux visibles. Pour restreindre la vue, masquez un calendrier plutôt que de supprimer ses événements. Le guide d’Apple sur les doublons explique comment afficher et masquer les calendriers à l’aide de cases à cocher. Avant d’accepter un nouvel engagement, réaffichez les calendriers utiles à cette décision et comparez la semaine avec tous ces calendriers visibles. Une vue filtrée vide ne prouve pas que le créneau est libre.",
        "Masquer un calendrier ne modifie pas les droits d’accès des autres personnes. Dans Cloud Calendars, la sélection des calendriers intervient aussi dans la synchronisation Google et la programmation des notifications : ne supposez donc pas que décocher un calendrier ne change que l’affichage. Vérifiez les changements importants auprès du service concerné et examinez séparément les notifications si vous souhaitez une soirée tranquille. Gardez une app professionnelle approuvée disponible si votre organisation l’exige."
      ]
    },
    {
      "heading": "Vérifiez la destination avant d’enregistrer",
      "body": [
        "Un calendrier par défaut est un point de départ utile, pas la garantie que chaque rendez-vous doit y être enregistré. Pour un rendez-vous personnel, vérifiez le calendrier sélectionné avant d’enregistrer. Pour une réunion professionnelle, utilisez le calendrier de travail et la procédure d’invitation de votre organisation.",
        "Ne déplacez pas et ne copiez pas une invitation simplement pour la faire apparaître dans votre vue. Microsoft distingue les événements que vous avez créés des réunions organisées par quelqu’un d’autre : modifier votre propre copie affichée n’est pas une méthode fiable pour mettre à jour l’organisateur ou les participants. Conservez l’invitation d’origine et demandez à l’organisateur tout changement d’horaire."
      ]
    },
    {
      "heading": "Ce qu’ajoutent les offres Cloud Calendars",
      "body": [
        "Cloud Calendars propose des vues de calendrier sur iPhone et iPad. L’offre Base comprend la synchronisation Google Calendar et la vue de plusieurs calendriers. Advanced ajoute la suppression des publicités ; Premium ajoute la prise en charge de Microsoft Calendar et de Teams. Les prix locaux en vigueur figurent dans l’app et l’App Store.",
        "Advanced n’est pas une autorisation payante de gérer tous les comptes. Un abonnement ne rend pas modifiable un calendrier en lecture seule et ne remplace pas les règles de votre employeur. Les calendriers locaux peuvent être utilisés sans compte ; les connexions aux services et le partage ont leurs propres exigences de connexion."
      ]
    },
    {
      "heading": "Vérifiez depuis l’autre côté un créneau occupé qui préserve votre vie privée",
      "body": [
        "Supposons qu’un rendez-vous personnel doive empêcher vos collègues de réserver ce créneau, sans leur en révéler le titre. Le voir à côté du travail sur votre téléphone ne constitue que votre vue d’ensemble. Vérifiez d’abord si votre compte professionnel contient une entrée de disponibilité, puis ce qu’un collègue concerné peut réellement voir.",
        "Si votre organisation autorise la création manuelle d’un créneau d’indisponibilité professionnel, vérifiez sa destination, son titre, ses notes, son lieu, ses participants et son état de disponibilité avant d’enregistrer. N’y copiez pas les détails privés du rendez-vous. Il s’agit d’une organisation autorisée que vous créez et vérifiez, pas d’une fonction de masquage automatique de Cloud Calendars. Maintenez la cohérence lors des changements ultérieurs sans transformer la seconde entrée en nouvelle invitation."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Vérifiez que votre employeur autorise la connexion du compte.",
    "Choisissez des couleurs distinctes et affichez les calendriers nécessaires à votre vue d’ensemble.",
    "Vérifiez le calendrier de destination lors de la création d’un événement.",
    "Masquez temporairement un calendrier pour restreindre la vue ; ne supprimez pas d’événements pour la ranger.",
    "Vérifiez les droits de partage et les notifications séparément de la visibilité des calendriers."
  ],
  "faq": [
    {
      "q": "Mon employeur verra-t-il mes événements personnels simplement parce que les deux calendriers sont dans la même app ?",
      "a": "Afficher les calendriers ensemble n’accorde pas en soi de droit de partage. Vérifiez le compte auquel appartient chaque événement, ses réglages de partage et les éventuelles règles de gestion des appareils de l’employeur. N’enregistrez pas accidentellement un rendez-vous privé dans un calendrier professionnel."
    },
    {
      "q": "Faut-il Advanced pour voir ensemble mes calendriers Google et personnels ?",
      "a": "La synchronisation Google Calendar et la vue de plusieurs calendriers font partie de Base. Advanced supprime les publicités. Microsoft Calendar est pris en charge avec Premium ; les autorisations des comptes continuent de s’appliquer."
    },
    {
      "q": "Cloud Calendars remplace-t-il automatiquement les détails personnels par un créneau occupé au travail ?",
      "a": "Ne comptez pas sur cela. Afficher les calendriers ensemble et créer des copies liées aux fournisseurs ne revient pas à appliquer une règle explicite de masquage des détails qui copie la disponibilité dans un autre compte. Vérifiez l’organisation autorisée par votre employeur."
    }
  ],
  "sourcesHeading": "Sources et lectures complémentaires",
  "sources": [
    {
      "label": "Apple : configurer plusieurs calendriers sur iPhone",
      "url": "https://support.apple.com/guide/iphone/use-multiple-calendars-iph3d1110d4/ios"
    },
    {
      "label": "Apple : si des événements sont en double dans votre calendrier iCloud",
      "url": "https://support.apple.com/en-us/102180"
    },
    {
      "label": "Google : choisir ce que les autres peuvent faire avec votre calendrier",
      "url": "https://support.google.com/calendar/answer/15716974?hl=en"
    },
    {
      "label": "Microsoft : modifier un rendez-vous, une réunion ou un événement dans Outlook",
      "url": "https://support.microsoft.com/en-us/outlook/calendar/change-an-appointment-meeting-or-event-in-outlook"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "calendar-notifications-missing-silent-or-duplicated",
    "who-can-see-what-in-google-calendar"
  ]
},

  "recurring-events-without-the-mess": {
  "updated": "2026-10-21",
  "title": "Événements récurrents : modifier une date ou la série avec précaution",
  "short": "Événements récurrents",
  "description": "Vérifiez vos droits et les dates concernées avant de modifier un événement récurrent. Gérez les changements ponctuels sans supprimer la série.",
  "lede": "Avant de modifier un rendez-vous récurrent, déterminez précisément quelles dates doivent changer. Vérifiez ensuite que l’éditeur propose cette portée. Ce guide est publié par Arte Soft, développeur de Cloud Calendars.",
  "commonBelief": "Tous les éditeurs de calendrier demandent si une modification concerne une seule occurrence ou toute la série.",
  "sections": [
    {
      "heading": "Décrivez le changement avant d’ouvrir l’éditeur",
      "body": [
        "« Décaler le cours de mardi prochain d’une heure » concerne une seule occurrence. « À partir du mois prochain, les cours auront lieu le jeudi » modifie les horaires futurs. « Corriger la salle de toutes les réunions » peut avoir une portée plus large. Ce sont des demandes différentes, même si elles partent du même écran de détails.",
        "Notez la date de l’occurrence sélectionnée et les dates voisines qui doivent rester inchangées. Une courte liste avant et après facilite la vérification du résultat enregistré. N’utilisez pas une série réelle pour découvrir l’effet d’un bouton Enregistrer que vous ne connaissez pas."
      ]
    },
    {
      "heading": "Vérifiez le calendrier et vos droits de modification",
      "body": [
        "Identifiez le calendrier auquel appartient l’événement et votre rôle : organisateur, personne autorisée à modifier ou invité. Voir une série partagée ne donne pas, à lui seul, le droit d’en changer les horaires. Google présente la modification par les invités comme une autorisation que l’organisateur peut accorder : consulter une invitation et la gérer sont deux capacités distinctes.",
        "Dans Cloud Calendars, vérifiez que le calendrier de destination autorise les modifications. Le fait qu’un participant puisse voir une réunion ne signifie pas qu’il peut modifier l’invitation de l’organisateur. Si vous ne pouvez pas effectuer le changement voulu, demandez à l’organisateur plutôt que de créer une invitation concurrente."
      ]
    },
    {
      "heading": "Vérifiez les occurrences concernées avant d’enregistrer dans Cloud Calendars",
      "body": [
        "L’éditeur de Cloud Calendars propose des règles de répétition et un réglage de fin de répétition. Ces commandes définissent une programmation ; elles ne permettent pas, à elles seules, de choisir quelles occurrences une modification touche. Modifier un événement récurrent existant peut affecter les occurrences futures. Ne remplacez pas une exception portant sur une seule date par un changement de règle de répétition.",
        "Avant d’enregistrer une exception pour une seule date, recherchez un choix explicite limitant la modification à cette occurrence. Si votre éditeur ne propose pas cette portée, ouvrez l’événement d’origine dans un éditeur compatible de son fournisseur. Vérifiez ensuite la date concernée et les dates voisines aux deux endroits. Les calendriers locaux et les services connectés ne traitent pas nécessairement les modifications de séries de la même manière."
      ]
    },
    {
      "heading": "Utilisez une portée prise en charge, puis vérifiez des dates représentatives",
      "body": [
        "Les instructions de Google Agenda pour ordinateur indiquent de modifier l’événement récurrent, d’enregistrer, puis de choisir les événements de la série auxquels appliquer la mise à jour. Lisez les choix réellement proposés pour cet événement sans supposer que tous les fournisseurs emploient les mêmes libellés ou permettent les mêmes changements.",
        "Le guide de Calendrier d’Apple pour Mac décrit séparément la fréquence, les répétitions personnalisées et leur date de fin. Il s’agit des commandes de Calendrier d’Apple. Quel que soit l’éditeur compatible utilisé, vérifiez la date modifiée, une date antérieure qui doit rester inchangée et l’occurrence normale suivante. Pour une invitation, vérifiez également l’événement enregistré par l’organisateur : une modification de votre affichage personnel ne confirme pas que la réunion de tous les participants a été déplacée."
      ]
    },
    {
      "heading": "Préservez les exceptions et choisissez les dates de fin délibérément",
      "body": [
        "Un rendez-vous déplacé ou une semaine sautée justifie d’examiner la série existante avant de modifier sa règle. Notez d’abord les exceptions importantes, puis vérifiez-les après la modification. Il serait inexact de promettre que toute modification de série préserve les exceptions, ou d’affirmer qu’elle les efface systématiquement : le résultat dépend de l’opération et du fournisseur.",
        "Indiquez une date de fin connue pour un cours ou un roulement temporaire si elle correspond au programme réel. Un anniversaire annuel ou une réunion régulière peut raisonnablement ne pas avoir de fin prévue. N’imposez pas de limite arbitraire à chaque répétition et ne supprimez pas une série pour la recréer simplement parce qu’elle comporte plusieurs exceptions."
      ]
    },
    {
      "heading": "Si le résultat est inattendu, conservez les éléments utiles au diagnostic",
      "body": [
        "Comparez le service auquel appartient l’événement et Cloud Calendars à la date exacte concernée. Vérifiez le nom du calendrier, l’occurrence sélectionnée, la règle de répétition et toute condition de fin consultable. Des titres semblables ou un rendez-vous copié séparément peuvent ressembler à un problème de récurrence : établissez d’abord quel événement vous regardez.",
        "Si l’événement est correct chez le fournisseur mais diffère dans l’app, signalez les versions de l’app et d’iOS, le type de calendrier, la portée souhaitée et les dates concernées. Si le fournisseur a lui aussi modifié plus de dates que prévu, contactez l’organisateur ou son assistance avant d’effectuer d’autres changements étendus. Évitez de retirer des comptes, d’annuler des invitations ou de supprimer une série pour établir un diagnostic."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Notez les dates des occurrences à modifier et celles qui doivent rester inchangées.",
    "Confirmez le calendrier auquel appartient l’événement, l’organisateur ou vos droits de modification.",
    "Pour une exception ponctuelle, utilisez un éditeur qui propose explicitement cette portée.",
    "Vérifiez une date antérieure, la date modifiée et l’occurrence normale suivante.",
    "Conservez les exceptions existantes et l’invitation d’origine pendant le diagnostic d’une différence."
  ],
  "faq": [
    {
      "q": "Chaque modification d’un événement récurrent demande-t-elle de choisir les occurrences concernées ?",
      "a": "Non. Ne supposez pas que Cloud Calendars vous demandera de choisir cette portée. Vérifiez les options avant d’enregistrer ; si ce choix est absent, utilisez un éditeur compatible du fournisseur pour une exception sur une seule date."
    },
    {
      "q": "Faut-il une date de fin pour chaque événement récurrent ?",
      "a": "Utilisez une date de fin lorsque le programme réel en prévoit une. Les engagements qui se poursuivent n’ont pas besoin d’une échéance inventée simplement pour rendre le calendrier plus ordonné."
    },
    {
      "q": "Modifier la série effacera-t-il ses exceptions ?",
      "a": "Il n’existe pas de réponse universelle pour tous les fournisseurs et toutes les modifications. Notez les exceptions importantes et vérifiez-les après le changement ; ne présumez ni leur conservation garantie ni leur perte automatique."
    }
  ],
  "sourcesHeading": "Documentation officielle sur les récurrences et les droits de modification",
  "sources": [
    {
      "label": "Google : créer et modifier un événement récurrent sur ordinateur",
      "url": "https://support.google.com/calendar/answer/37115?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Apple : créer des événements sur une journée, plusieurs jours ou récurrents sur Mac",
      "url": "https://support.apple.com/guide/calendar/set-up-all-day-multiday-or-repeating-events-icl1018/mac"
    },
    {
      "label": "Google : collaborer dans Agenda et autoriser les invités à modifier les événements",
      "url": "https://support.google.com/a/users/answer/13293412?hl=en"
    }
  ],
  "seeAlso": [
    "drag-an-event-to-move-it",
    "what-guests-can-do-to-your-event"
  ]
},

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
