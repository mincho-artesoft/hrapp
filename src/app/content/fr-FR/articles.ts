import { LocalisedArticle } from '../types';

/**
 * Les articles en français.
 *
 * Douze des quarante, choisis pour la question à laquelle ils répondent dans
 * ai-visibility/prompts.json, et non pour leur facilité de traduction. Les
 * chiffres ne sont pas ici : ils vivent une seule fois dans article-facts.ts et
 * rejoignent le texte par identifiant au rendu, de sorte qu'une traduction peut
 * réécrire chaque phrase sans toucher à un nombre.
 */
export const ARTICLES_FR_FR: Readonly<Record<string, LocalisedArticle>> = {
"exchange-calendars-on-an-iphone":{
  "updated": "2026-10-21",
  "title": "Calendriers Microsoft et Exchange sur iPhone : vérifiez d’abord la connexion",
  "short": "Calendriers Microsoft sur iPhone",
  "description": "Vérifiez le type de compte Microsoft, l’accord de l’employeur et les droits avant de connecter un calendrier. Ce qu’ajoute Cloud Calendars Premium.",
  "lede": "« Calendrier Exchange » peut désigner différents services et règles professionnelles. Avant de modifier des réglages ou d’acheter une formule, identifiez l’hébergement de votre boîte aux lettres et la connexion autorisée. Ce guide est rédigé par Arte Soft, développeur de Cloud Calendars.",
  "commonBelief": "Toute app avec connexion Microsoft devrait fonctionner avec chaque serveur Exchange et chaque calendrier professionnel partagé.",
  "sections": [
    {
      "heading": "1. Identifiez la boîte aux lettres, pas seulement l’app Outlook",
      "body": [
        "Outlook désigne une app et des services Microsoft. Avoir un compte dans Outlook ne révèle pas quel serveur héberge son calendrier. Demandez si vous utilisez un compte Microsoft personnel, une boîte Microsoft 365 dans Exchange Online ou une installation Exchange propre à l’organisation.",
        "Cloud Calendars propose la connexion Microsoft et utilise le service de calendrier Microsoft. Ce n’est pas une configuration universelle par adresse de serveur et mot de passe pour toutes les installations Exchange. Microsoft documente son API de calendrier séparément de la configuration Exchange générique : confirmez la voie prévue pour votre boîte plutôt que de deviner un serveur."
      ]
    },
    {
      "heading": "2. Séparez le compte de l’appareil Apple de la connexion de l’app",
      "body": [
        "Un calendrier professionnel déjà accessible dans Calendrier Apple via un compte d’appareil approuvé emprunte une autre voie que « Sign in with Microsoft » dans Cloud Calendars. Les calendriers exposés par le système du téléphone dépendent aussi de l’autorisation d’accès. Une configuration réussie dans les réglages Apple ne prouve pas qu’une connexion Microsoft distincte sera autorisée.",
        "Avant d’ajouter une connexion, examinez où apparaît le calendrier existant. Si vous voyez ensuite deux versions d’une réunion, identifiez leurs sources et masquez-en une temporairement. Évitez de supprimer comptes ou événements pour déterminer quelle connexion les a produits."
      ]
    },
    {
      "heading": "3. Vérifiez Premium et l’accord de l’organisation séparément",
      "body": [
        "Premium ajoute les fonctions de calendrier Microsoft et Microsoft Teams à Cloud Calendars. Advanced supprime les publicités de Base ; il ne débloque pas la connexion Microsoft de l’app. Consultez le prix local actuel et la période de facturation plutôt qu’un prix annoncé pour une autre région.",
        "Un abonnement ne peut pas annuler la décision d’un employeur sur l’accès d’une app. Microsoft permet aux organisations de contrôler le consentement des utilisateurs et d’exiger une approbation administrative. Si la page la demande, transmettez à l’administrateur le nom de l’app, le compte prévu et le message exact. Ne publiez pas le calendrier professionnel et ne passez pas à un compte personnel pour contourner cette décision."
      ]
    },
    {
      "heading": "4. Diagnostiquez l’étape qui a échoué",
      "body": [
        "Si la connexion ne se termine pas, vérifiez l’identité sélectionnée, le réseau et le message Microsoft. Une demande d’approbation diffère d’une session expirée ou d’une panne de connexion. Rien ne permet de supposer que chaque échec relève d’une règle de l’employeur.",
        "Si la connexion réussit mais qu’un calendrier manque, examinez le groupe du compte et la sélection dans Cloud Calendars, puis comparez avec le même compte dans Outlook. Si seul un calendrier partagé ou délégué manque, étudiez ses droits spécifiques. Les capacités générales de l’API Microsoft ne garantissent pas que tous les cas de boîtes partagées ou de délégation soient disponibles dans cette app."
      ]
    },
    {
      "heading": "5. Distinguez une copie visible d’une mise à jour confirmée",
      "body": [
        "La connexion Microsoft utilise des copies dans le système de calendrier de l’iPhone. Leur destination de stockage peut dépendre des sources disponibles sur l’appareil. Pour un compte professionnel, confirmez que cette organisation respecte les exigences de votre entreprise avant de l’utiliser pour des réunions sensibles ; ne supposez pas qu’une copie reste uniquement dans la boîte d’origine.",
        "Un calendrier d’équipe peut, par exemple, afficher une réunion mais refuser votre modification faute de droits. Une édition locale réussie n’est pas la vérification finale. Comparez l’événement dans Outlook avec le même compte. Testez uniquement un événement jetable dans un calendrier qui vous appartient, sans inviter de collègues ni modifier une réunion établie."
      ]
    },
    {
      "heading": "6. Gardez explicites la responsabilité et la disponibilité",
      "body": [
        "Une réunion organisée par un collègue n’est pas à déplacer ou réécrire simplement parce qu’elle apparaît près de vos plans personnels. Gardez à l’esprit l’organisateur, le calendrier professionnel et les participants prévus. Utilisez la procédure approuvée du fournisseur si l’action manque ou si une modification n’atteint pas le serveur.",
        "De même, afficher un rendez-vous personnel près du travail ne bloque pas automatiquement la disponibilité professionnelle et ne masque pas ses détails dans une simple entrée occupée. Si c’est votre objectif, demandez quelle méthode l’organisation prend en charge et vérifiez le résultat. Un lien en lecture seule ne remplace pas un accès modifiable, et publier un lien n’est pas un raccourci de dépannage."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifiez l’hébergement de la boîte et la connexion autorisée par l’organisation.",
    "Vérifiez si le calendrier arrive déjà sur l’iPhone via un compte d’appareil.",
    "Examinez Premium séparément du consentement Microsoft et des droits du calendrier.",
    "Choisissez l’identité prévue à la connexion et conservez les messages d’erreur pour l’assistance.",
    "Après connexion, sélectionnez le calendrier nécessaire et comparez un événement récent dans Outlook.",
    "Confirmez une modification de test autorisée chez le fournisseur ; préservez invitations et réunions récurrentes."
  ],
  "faq": [
    {
      "q": "Premium garantit-il la connexion au serveur Exchange de mon entreprise ?",
      "a": "Non. Premium active les fonctions Microsoft de l’app. Compatibilité de la boîte, accord de l’organisation et autorisations des calendriers sont distincts. Confirmez la connexion avec l’administrateur avant de considérer une installation Exchange comme prise en charge."
    },
    {
      "q": "Pourquoi Outlook fonctionne-t-il alors qu’une autre app est refusée ?",
      "a": "Les apps peuvent avoir des permissions et exigences d’approbation différentes. Outlook est une référence utile pour le compte, mais ne prouve pas qu’une autre app est approuvée. Utilisez l’erreur réelle ou la demande d’approbation pour identifier le point à traiter."
    },
    {
      "q": "Puis-je utiliser un lien public si la connexion Microsoft est bloquée ?",
      "a": "Ne publiez pas d’informations professionnelles pour contourner un blocage. Un abonnement est généralement en lecture seule, sans équivalence avec un accès modifiable. Demandez au propriétaire ou à l’administrateur une méthode approuvée ; ne supposez pas qu’un lien publié soit autorisé."
    }
  ],
  "sourcesHeading": "Sources et conseils des fournisseurs",
  "sources": [
    {
      "label": "Microsoft : API de calendrier Outlook et données de boîte aux lettres prises en charge",
      "url": "https://learn.microsoft.com/en-us/graph/outlook-calendar-concept-overview"
    },
    {
      "label": "Microsoft : consentement des utilisateurs et administrateurs",
      "url": "https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/user-admin-consent-overview"
    },
    {
      "label": "Apple : plusieurs calendriers et abonnements en lecture seule",
      "url": "https://support.apple.com/en-lamr/guide/iphone/iph3d1110d4/ios"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-a-subscription-actually-buys"
  ]
},

  'weather-inside-your-calendar': {
  "title": "Un agenda qui contient déjà la météo",
  "short": "La météo dans l'agenda",
  "description": "Pourquoi consulter deux applications pour organiser une journée est un défaut de conception, et à quoi ressemble un agenda où les prévisions font partie de la vue plutôt que d'être à côté.",
  "lede": "Presque tout le monde organise sa journée entre deux applications. L'agenda dit où il faut être ; la météo dit le temps qu'il fera en arrivant. Tenir les deux ensemble dans sa tête, c'est la partie que personne ne remarque faire — jusqu'à un samedi gâché.",
  "commonBelief": "Qu'un agenda sert aux rendez-vous et une application météo au temps qu'il fait, et que les garder séparés est simplement la façon dont les téléphones fonctionnent.",
  "sections": [
    {
      "heading": "Le coût de deux applications, ce n'est pas deux touches",
      "body": [
        "Changer d'application ne coûte rien. Ce qui coûte cher, c'est que les deux ne s'accordent jamais sur ce qui compte. Votre agenda sait que samedi, deux heures sont réservées à onze heures ; la météo sait qu'il pleuvra de dix heures à treize heures. Ni l'une ni l'autre ne sait que ces deux faits réunis signifient qu'il faut déplacer le créneau.",
        "C'est vous, la couche d'intégration. Cela fonctionne jusqu'à ce que vous soyez débordé — exactement le moment où protéger ses projets a le plus de valeur."
      ]
    },
    {
      "heading": "Les prévisions disponibles",
      "body": [
        "Cloud Calendars utilise les prévisions disponibles pour le lieu sélectionné. Les données horaires et quotidiennes peuvent couvrir des périodes différentes.",
        "Les dates consultables dans le calendrier ne déterminent pas la portée des prévisions. Une vue mensuelle ne signifie pas que la météo couvre tout le mois ou chaque événement."
      ]
    }
  ],
  "claims": {
    "price": "Ce que coûtent les fonctions météo"
  },
  "practical": [
    "Vérifiez le lieu, la date et les heures disponibles avant de planifier avec les prévisions."
  ],
  "seeAlso": [
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather"
  ],
  "updated": "2026-10-21"
},

  'forecast-beside-every-event': {
  "title": "Comparer un rendez-vous aux prévisions météo heure par heure",
  "short": "La météo aux heures du rendez-vous",
  "description": "Vérifiez le lieu, la date et les heures de prévision disponibles pour votre rendez-vous. Relisez le brouillon avant d’enregistrer un projet lié à la météo.",
  "lede": "Pour comparer la météo à un rendez-vous, faites correspondre trois éléments : le lieu sélectionné, la date des prévisions et les heures occupées par votre activité. Une icône météo à proximité ne prouve pas cette correspondance. Ce guide est publié par Arte Soft, développeur de Cloud Calendars.",
  "commonBelief": "Une icône météo quotidienne dans le calendrier équivaudrait à une prévision rattachée à un événement.",
  "sections": [
    {
      "heading": "Commencez par le lieu et la date",
      "body": [
        "Ouvrez les prévisions du lieu prévu et comparez leur date à l’entrée du calendrier. La météo du calendrier peut concerner le lieu sélectionné pour les prévisions. Vérifiez qu’il convient au rendez-vous, sans supposer que l’adresse de l’événement le détermine.",
        "Un rendez-vous du mois prochain peut exister avant que les données météo de cette date soient disponibles. Conservez-le et consultez les prévisions à l’approche du jour prévu ; une donnée météo absente n’annonce pas du beau temps."
      ]
    },
    {
      "heading": "Utilisez les détails horaires pour une question horaire",
      "body": [
        "Un résumé quotidien et des prévisions heure par heure répondent à des questions différentes. Si le rendez-vous dure de deux à cinq heures, examinez les heures disponibles couvrant cet intervalle plutôt que de prendre une seule icône quotidienne pour un tableau complet.",
        "Si une partie seulement de l’intervalle est disponible, laissez le reste indéterminé. L’app ne promet pas des données horaires complètes pour tous les événements que vous pouvez créer. Ce guide ne promet pas non plus qu’ouvrir n’importe quel événement affiche toujours toute sa plage météo."
      ]
    },
    {
      "heading": "Distinguez probabilité, quantité et moment",
      "body": [
        "Lisez le libellé de la valeur consultée. Une probabilité de précipitations n’est ni une quantité ni une durée de pluie. De même, une valeur horaire et un résumé quotidien couvrent des périodes différentes : comparez des périodes équivalentes pour départager deux horaires possibles.",
        "Prévoyez une solution de repli adaptée à votre activité au lieu d’utiliser un pourcentage comme règle universelle pour maintenir ou annuler. Les informations météo peuvent évoluer ; consultez-les à nouveau au moment de décider."
      ]
    },
    {
      "heading": "Vérifiez le rendez-vous fondé sur la météo avant de l’enregistrer",
      "body": [
        "L’app peut ouvrir un brouillon d’événement à partir d’une heure des prévisions. Vérifiez la date, le début, la fin et le calendrier de destination avant de l’enregistrer. Sélectionner une prévision ne remplace pas la vérification de l’engagement que vous créez.",
        "Si l’accès au calendrier ou le calendrier de destination empêche l’enregistrement, réglez cette autorisation séparément de l’accès à la météo. Trouver des prévisions ne donne pas de droits de modification sur un calendrier partagé."
      ]
    },
    {
      "heading": "Consultez les prévisions complètes si le résumé ne suffit pas",
      "body": [
        "Pour une activité en extérieur, examinez les variables pertinentes et le lieu effectivement choisi. Un widget de météo actuelle ou une démonstration sur la page d’accueil ne remplace pas la consultation des heures de prévision disponibles dans l’app.",
        "En cas d’écart, comparez d’abord le lieu et l’horodatage. Des fournisseurs, lieux sélectionnés ou périodes de prévision différents peuvent produire des affichages différents sans prouver que l’événement du calendrier a changé."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Confirmez le lieu et la date de l’événement.",
    "Vérifiez les heures disponibles sur toute la durée de l’activité.",
    "Lisez la probabilité et la quantité comme deux valeurs distinctes.",
    "Relisez le brouillon d’événement avant de l’enregistrer."
  ],
  "seeAlso": [
    "weather-inside-your-calendar",
    "planning-outdoors-without-being-rained-on"
  ],
  "updated": "2026-10-21",
  "faq": [
    {
      "q": "Chaque événement dispose-t-il de prévisions complètes ?",
      "a": "Non. La couverture dépend du lieu sélectionné ainsi que des dates et heures disponibles."
    },
    {
      "q": "L’icône météo correspond-elle à l’adresse de l’événement ?",
      "a": "Ne le déduisez pas de sa proximité avec l’événement. Confirmez séparément le lieu des prévisions."
    },
    {
      "q": "Toucher une heure enregistre-t-il un nouveau rendez-vous ?",
      "a": "Lorsque cette possibilité est disponible, cela ouvre un brouillon d’événement. Vérifiez sa date, son heure et son calendrier avant de l’enregistrer."
    }
  ],
  "sourcesHeading": "Sources météo et réglages de localisation",
  "sources": [
    {
      "label": "Apple : prévisions WeatherKit et disponibilité régionale",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Apple : confidentialité et services de localisation",
      "url": "https://support.apple.com/en-us/102515"
    }
  ]
},

  'planning-outdoors-without-being-rained-on': {
  "title": "Organiser des activités en extérieur sans finir sous la pluie",
  "short": "Planifier en extérieur",
  "description": "Une méthode pratique pour organiser vos activités en extérieur avec votre calendrier habituel, sans ajouter une routine météo distincte.",
  "lede": "Si vos loisirs se déroulent dehors, vous avez sans doute votre rituel : consulter la météo, scruter la semaine, deviner. Cette dernière étape peut laisser place à une comparaison réfléchie. Ce guide est publié par Arte Soft, développeur de Cloud Calendars.",
  "commonBelief": "Éviter le mauvais temps consisterait à consulter les prévisions plus souvent.",
  "sections": [
    {
      "heading": "Commencez par le lieu et la décision",
      "body": [
        "Choisissez le lieu météo correspondant à l’activité, puis vérifiez si la date et les heures nécessaires sont disponibles. Déterminez ce que vous devez savoir : faut-il choisir un autre horaire, garder une solution de repli ou reporter la décision ?",
        "Consulter à nouveau ne change pas le temps, mais des informations actualisées peuvent compter. Il n’existe pas de fréquence de vérification adaptée à tous les projets en extérieur."
      ]
    },
    {
      "heading": "Comparez les horaires disponibles sans promettre le résultat",
      "body": [
        "Comparez les informations horaires pertinentes pour chaque période envisagée. Une icône quotidienne est un résumé, pas une garantie des conditions tout au long de la journée.",
        "Décaler une activité d’une heure peut aider, ou non. Ne supposez pas un créneau sec que les prévisions ne montrent pas et n’appliquez pas un seuil de pourcentage universel à toutes les activités."
      ]
    },
    {
      "heading": "Prévoyez une solution de repli avant de modifier les invitations",
      "body": [
        "Si l’activité dépend de conditions favorables, gardez une alternative réaliste et décidez quand consulter les informations les plus récentes. Vérifiez les consignes officielles locales si nécessaire.",
        "Pour un rendez-vous partagé, confirmez l’organisateur et les droits de modification avant de le déplacer. Des prévisions apparemment plus favorables n’autorisent pas à elles seules à changer l’emploi du temps de tout le monde."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Confirmez le lieu des prévisions ainsi que les dates et heures disponibles.",
    "Comparez les horaires possibles selon les facteurs météo pertinents pour votre activité.",
    "Gardez un autre plan et vérifiez à nouveau avant que la décision devienne importante.",
    "Consultez les consignes officielles locales si les conditions peuvent rendre l’activité dangereuse."
  ],
  "seeAlso": [
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather"
  ],
  "updated": "2026-10-21",
  "faq": [
    {
      "q": "Déplacer l’événement garantit-il un temps sec ?",
      "a": "Non. Comparez les périodes de prévision disponibles et gardez une alternative réaliste."
    },
    {
      "q": "Puis-je me limiter à l’icône quotidienne ?",
      "a": "Pour une activité à une heure précise, consultez les heures disponibles sur toute sa durée et confirmez le lieu."
    },
    {
      "q": "Puis-je déplacer un événement partagé simplement parce qu’un autre horaire semble meilleur ?",
      "a": "Vérifiez les responsabilités de l’organisateur, les droits de modification et les participants avant de changer leur emploi du temps."
    }
  ],
  "sources": [
    {
      "label": "Apple : données de prévision WeatherKit et disponibilité régionale",
      "url": "https://developer.apple.com/weatherkit/"
    }
  ]
},

  'a-fourteen-day-view-of-the-weather': {
  "title": "Les prévisions disponibles",
  "short": "Les prévisions disponibles",
  "description": "Cloud Calendars utilise les prévisions disponibles pour le lieu sélectionné. Les données horaires et quotidiennes peuvent couvrir des périodes différentes.",
  "lede": "Les dates consultables dans le calendrier ne déterminent pas la portée des prévisions. Une vue mensuelle ne signifie pas que la météo couvre tout le mois ou chaque événement.",
  "sections": [
    {
      "heading": "Les prévisions disponibles",
      "body": [
        "Cloud Calendars utilise les prévisions disponibles pour le lieu sélectionné. Les données horaires et quotidiennes peuvent couvrir des périodes différentes.",
        "Les dates consultables dans le calendrier ne déterminent pas la portée des prévisions. Une vue mensuelle ne signifie pas que la météo couvre tout le mois ou chaque événement."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Vérifiez le lieu, la date et les heures disponibles avant de planifier avec les prévisions."
  ],
  "seeAlso": [
    "weather-inside-your-calendar",
    "planning-outdoors-without-being-rained-on"
  ],
  "updated": "2026-10-21",
  "sources": [
    {
      "label": "Apple WeatherKit",
      "url": "https://developer.apple.com/weatherkit/"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
  "updated": "2026-10-21",
  "title": "iCloud, Google et Outlook dans une vue : comptes, copies et autorisations",
  "short": "Trois fournisseurs, une vue",
  "description": "Affichez ensemble iCloud, Google et Microsoft. Vérifiez comptes, droits et copies avant de déplacer des événements ou de vous fier aux disponibilités.",
  "lede": "Un rendez-vous familial, un appel client et une réunion peuvent se chevaucher tout en appartenant à des comptes différents. Une vue commune révèle ce conflit, mais ne transforme pas ces comptes en calendrier partagé. Ce guide est rédigé par Arte Soft, développeur de Cloud Calendars.",
  "commonBelief": "Réunir plusieurs calendriers dans une app maintiendrait automatiquement la cohérence des disponibilités, du partage et des copies d’événements.",
  "sections": [
    {
      "heading": "1. Identifiez le compte et le calendrier de chaque événement",
      "body": [
        "Commencez par un événement ordinaire de chaque fournisseur. Notez l’adresse e-mail utilisée, le nom du calendrier et si vous possédez l’événement ou avez reçu une invitation. Deux calendriers nommés « Calendrier » peuvent appartenir à des comptes totalement différents. Une couleur aide à parcourir la semaine ; le compte et le calendrier indiquent où appliquer une modification.",
        "Par exemple, un rendez-vous chez le dentiste dans votre iCloud personnel et une réunion de projet dans Microsoft peuvent apparaître ensemble pour vous. Cela ne rend pas le rendez-vous chez le dentiste visible à vos collègues et ne réserve pas automatiquement ce créneau dans leurs outils."
      ]
    },
    {
      "heading": "2. Utilisez la connexion adaptée",
      "body": [
        "Pour iCloud, activez d’abord Calendrier iCloud sur l’iPhone avec le compte Apple prévu. Le guide Apple explique les réglages de l’appareil. Cloud Calendars accède aux calendriers disponibles dans le système de calendrier de l’iPhone et a besoin d’une autorisation pour les lire. Un compte connecté sur un autre appareil ne suffit pas.",
        "Cloud Calendars propose aussi « Sign in with Google » et « Sign in with Microsoft ». Vérifiez le compte choisi à la connexion, ouvrez son groupe de calendriers et sélectionnez ceux nécessaires. Utiliser le bon fournisseur avec la mauvaise identité personnelle ou professionnelle peut produire une liste valide, mais inattendue."
      ]
    },
    {
      "heading": "3. Distinguez les formules des autorisations",
      "body": [
        "Base comprend la synchronisation Google Agenda et les vues du calendrier. Advanced ajoute la suppression des publicités à Base. Premium ajoute les fonctions de calendrier Microsoft et Microsoft Teams. Vérifiez le prix local actuel et la période de facturation avant l’achat.",
        "Une formule change les fonctions disponibles dans l’app ; elle ne vous rend pas propriétaire du calendrier d’autrui. Google distingue le droit de voir les événements de celui de les modifier. Les règles de l’employeur et les autorisations du calendrier Microsoft restent applicables. Un événement visible ou un éditeur accessible ne prouve pas que le fournisseur acceptera une modification."
      ]
    },
    {
      "heading": "4. Une vue commune peut contenir des copies de calendriers",
      "body": [
        "Les connexions Google et Microsoft utilisent des copies dans le système de calendrier de l’iPhone pour présenter et synchroniser les événements. Ne supposez pas que connecter un compte ne laisse aucune copie hors du fournisseur d’origine. La destination de ces copies peut dépendre des sources de calendrier disponibles sur l’appareil.",
        "Si le même compte arrive aussi sur le téléphone par une autre voie, examinez les noms et les sources avant de traiter les rendez-vous répétés comme des événements distincts. Masquez temporairement un calendrier pour identifier ce qu’il affiche. Ne supprimez pas un événement ou un calendrier uniquement pour ranger l’écran : une copie connectée peut renvoyer les modifications au fournisseur."
      ]
    },
    {
      "heading": "5. Choisissez toujours la destination d’un nouvel événement",
      "body": [
        "Avant d’enregistrer, vérifiez le calendrier aussi soigneusement que la date et l’heure. Pour un rendez-vous familial, choisissez le calendrier réellement utilisé par la famille ; pour une réunion, la destination professionnelle autorisée. Voir les deux ensemble ne rend aucun des deux automatiquement destinataire de tous les nouveaux événements.",
        "Changer le calendrier d’un événement ou le faire glisser entre calendriers peut être un déplacement, pas une simple seconde vue. Gardez invitations et réunions récurrentes dans leur calendrier habituel pendant le diagnostic. Si un changement est nécessaire, établissez d’abord qui possède l’événement et quel calendrier peut le recevoir."
      ]
    },
    {
      "heading": "6. Vérifiez la vue d’ensemble avant de vous y fier",
      "body": [
        "Comparez un événement récent dans le calendrier du fournisseur avec son équivalent dans Cloud Calendars. Vérifiez date, fuseau horaire, titre et calendrier sélectionné. Dans un calendrier modifiable qui vous appartient, un événement de test sans invités vaut mieux qu’une modification de réunion réelle. Confirmez le résultat chez le fournisseur avant de considérer la connexion comme prête.",
        "Ne comptez pas sur la vue commune pour créer automatiquement des créneaux occupés anonymes dans un autre compte. Si vos collègues doivent voir votre indisponibilité sans détails personnels, utilisez une méthode expressément approuvée et vérifiez le résultat de leur côté. Une vue personnelle claire et la disponibilité partagée sont deux tâches distinctes."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Relevez le compte et le calendrier exacts d’un événement de chaque fournisseur.",
    "Activez les calendriers iCloud prévus sur l’appareil et vérifiez l’autorisation d’accès.",
    "Utilisez la connexion Google ou Microsoft adaptée et sélectionnez les calendriers voulus.",
    "Comparez un événement récent avec la vue du fournisseur avant toute modification.",
    "Masquez temporairement une source supposée en double ; conservez les événements intacts.",
    "Vérifiez la destination de chaque nouvel événement et, séparément, le partage des créneaux occupés."
  ],
  "faq": [
    {
      "q": "Mes collègues voient-ils mes événements privés parce que j’affiche les deux calendriers ?",
      "a": "L’affichage commun n’est ni une instruction de partage ni un transfert automatique de disponibilité. Vérifiez les réglages réels de chaque calendrier. Les connexions peuvent créer des copies sur l’appareil ; cette vue ne garantit donc pas non plus que les données existent uniquement chez leur fournisseur d’origine."
    },
    {
      "q": "Pourquoi puis-je voir un événement sans réussir à le modifier ?",
      "a": "Le calendrier peut être en lecture seule, l’événement appartenir à un autre organisateur ou le fournisseur refuser la mise à jour. Vérifiez propriété et autorisations chez le fournisseur. Acheter une formule supérieure ne change pas ces droits."
    },
    {
      "q": "Faut-il connecter le même compte Google par toutes les voies disponibles ?",
      "a": "Vérifiez d’abord comment il apparaît déjà sur le téléphone. Plusieurs connexions compliquent l’identification des copies. Choisissez la voie souhaitée, vérifiez ses événements et masquez l’affichage supplémentaire pendant l’enquête plutôt que de commencer par supprimer des données ou déconnecter des comptes."
    }
  ],
  "sourcesHeading": "Sources et références de configuration",
  "sources": [
    {
      "label": "Apple : configurer Calendrier iCloud sur vos appareils",
      "url": "https://support.apple.com/guide/icloud/set-up-calendar-mme4d73a8727/icloud"
    },
    {
      "label": "Google : partage de calendriers et autorisations",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft : API de calendrier Outlook et données de boîte aux lettres prises en charge",
      "url": "https://learn.microsoft.com/en-us/graph/outlook-calendar-concept-overview"
    }
  ],
  "seeAlso": [
    "exchange-calendars-on-an-iphone"
  ]
},

  'three-calendar-apps-is-two-too-many': {
    title: "Trois applications d'agenda, c'est deux de trop",
    short: 'Trois applications, deux de trop',
    description:
      "Passer d'une application d'agenda à l'autre n'est pas une méthode de travail, c'est un impôt. Ce qu'il coûte et à quoi ressemble sa suppression.",
    lede: "Personne n'a choisi d'avoir trois applications d'agenda. C'est arrivé un compte à la fois, et chaque ajout paraissait raisonnable.",
    commonBelief:
      "Que changer d'application est un désagrément mineur et non la source du vrai problème.",
    sections: [
      {
        heading: "Le coût n'est pas dans les touches",
        body: [
          "Deux secondes de bascule, ce n'est rien. Ce qui coûte cher, c'est de répondre à des questions d'emploi du temps avec une information partielle, parce que vérifier les trois à chaque fois demande plus d'effort que la question ne semble en mériter.",
          "Alors vous répondez depuis celle qui est ouverte, et vous corrigez ensuite. La correction est la partie chère, et elle atterrit en plus dans l'agenda de quelqu'un d'autre.",
        ],
      },
      {
        heading: 'Ce qui doit être vrai',
        body: [
          "Un endroit doit pouvoir dire oui ou non à propos de votre temps. C'est toute l'exigence, et aucun arrangement où la réponse vit dans plus d'une application ne la satisfait.",
          'Tout le reste — quelle application, quelles couleurs, quelles vues — relève du goût. Ceci relève de la structure.',
        ],
      },
    ],
    claims: {
      accounts: "Types de comptes qu'une seule vue peut contenir",
    },
    practical: [
      "Choisissez l'application qui tient tous vos comptes, pas celle que vous préférez isolément.",
      'Migrez en ajoutant des comptes, pas en déplaçant des événements : les événements restent où ils sont.',
      "Supprimez les autres applications une fois la vue complète, sinon vous continuerez d'y jeter un œil.",
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view'],
  },

  'the-widget-that-shows-what-is-next': {
  "updated": "2026-10-21",
  "title": "Afficher les prochains rendez-vous sur l’écran d’accueil",
  "short": "Les prochains rendez-vous dans un widget",
  "description": "Choisissez un widget avec événements et vérifiez les calendriers sélectionnés. Une liste vide ne signifie pas que votre agenda est vide.",
  "lede": "Pour consulter le prochain rendez-vous, choisissez un widget qui contient une liste. Une vignette de date et de météo répond à une autre question. Ce guide est publié par Arte Soft, le développeur de Cloud Calendars.",
  "sections": [
    {
      "heading": "Choisir d’abord la présentation adaptée",
      "body": [
        "« Calendar Events » est la présentation moyenne avec une liste de rendez-vous. « Calendar Events Large » offre davantage de place. « Calendar & Weather » est une présentation distincte pour la date et la météo ; sa petite taille ne promet pas le prochain événement. Les noms peuvent être traduits sur votre appareil.",
        "Maintenez le doigt sur une zone vide de l’écran d’accueil, puis ouvrez la galerie de widgets dans les options de modification. Recherchez Cloud Calendars et comparez l’aperçu avant l’ajout. Cette galerie de l’iPhone est indépendante des vues de l’agenda dans l’app."
      ]
    },
    {
      "heading": "Comprendre les événements retenus",
      "body": [
        "La liste utilise les calendriers sélectionnés et les rendez-vous horaires dont le début est encore à venir. Les événements sur toute la journée et ceux qui ont déjà commencé en sont exclus. Un anniversaire ou une réunion en cours peut donc être visible dans l’app sans apparaître ici.",
        "Si votre seule entrée du jour est un voyage sur toute la journée, une liste vide ne prouve pas sa disparition. Ouvrez la journée complète. Lisez aussi la date de chaque rendez-vous : le prochain peut être demain ou plus tard."
      ]
    },
    {
      "heading": "Comparer avec l’application en premier",
      "body": [
        "Retrouvez un rendez-vous futur précis dans Cloud Calendars. Vérifiez son calendrier, sa sélection et l’accès de l’app aux calendriers. Comparez le titre, la date et l’heure. S’il manque également dans l’app, commencez par le compte ou la synchronisation.",
        "Pour un essai simple, créez un rendez-vous sans invités dans un calendrier personnel, avec un titre identifiable et un début futur. Ne modifiez pas une vraie invitation et ne retirez pas de compte pour tester l’écran d’accueil."
      ]
    },
    {
      "heading": "Ne pas supposer une mise à jour instantanée",
      "body": [
        "Les widgets affichent des informations enregistrées et ne fonctionnent pas en permanence comme une app ouverte. iOS organise leurs mises à jour. Ouvrir l’app donne un point de comparaison, sans garantir un délai précis avant le changement du widget.",
        "Si l’app reste correcte et le widget incorrect, notez la présentation, le calendrier, l’heure et les versions de l’app et d’iOS. Distinguez une liste vide, un ancien rendez-vous et une heure erronée."
      ]
    },
    {
      "heading": "Lire la météo comme un résumé distinct",
      "body": [
        "La météo près de la date n’est pas une prévision propre au lieu et à l’heure de chaque rendez-vous. Avant une activité dehors, vérifiez le lieu et le créneau souhaités dans la vue météo.",
        "Gardez le widget pour vous orienter rapidement. Utilisez l’agenda complet pour les événements sur toute la journée, les détails et les décisions qui exigent une vue d’ensemble."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Choisir une présentation avec liste de rendez-vous.",
    "Vérifier un événement futur dans un calendrier sélectionné.",
    "Comparer sa date et son heure avec l’app.",
    "Noter les écarts persistants sans supprimer de données."
  ],
  "faq": [
    {
      "q": "Pourquoi mon anniversaire manque-t-il ?",
      "a": "La liste exclut les événements sur toute la journée. Consultez l’agenda complet."
    },
    {
      "q": "Le petit widget affiche-t-il le prochain rendez-vous ?",
      "a": "La petite présentation « Calendar & Weather » affiche la date et la météo. Choisissez une liste pour les rendez-vous."
    },
    {
      "q": "Une liste vide signifie-t-elle que je suis libre ?",
      "a": "Non. Les événements sur toute la journée, les réunions en cours, les calendriers non sélectionnés ou une mise à jour en attente peuvent manquer."
    }
  ],
  "sourcesHeading": "Sources et instructions Apple",
  "sources": [
    {
      "label": "Apple : ajouter et modifier des widgets sur iPhone",
      "url": "https://support.apple.com/118610"
    },
    {
      "label": "Apple : actualiser un widget",
      "url": "https://developer.apple.com/documentation/widgetkit/keeping-a-widget-up-to-date"
    }
  ],
  "seeAlso": [
    "a-countdown-to-your-next-meeting"
  ]
},

  'a-countdown-to-your-next-meeting': {
  "updated": "2026-10-21",
  "title": "Un compte à rebours qui complète les rappels",
  "short": "Compte à rebours du prochain rendez-vous",
  "description": "Utilisez l’activité en direct pour un rendez-vous futur, vérifiez les horaires modifiés et conservez les rappels indépendamment du compte à rebours.",
  "lede": "Un compte à rebours aide à estimer le temps disponible. Encore faut-il que l’activité affiche le bon rendez-vous et son heure de début actuelle. Ce guide est publié par Arte Soft, le développeur de Cloud Calendars.",
  "sections": [
    {
      "heading": "Partir d’un rendez-vous confirmé",
      "body": [
        "Ouvrez d’abord le rendez-vous dans Cloud Calendars et vérifiez sa date, son heure et le calendrier sélectionné. L’activité suit les événements horaires à venir, pas les journées entières ni le temps restant dans une réunion commencée.",
        "Démarrez-la avec « Live » lorsque ce contrôle est disponible ; il devient « Stop » pendant son fonctionnement. Sinon, vérifiez dans les réglages de l’iPhone si les activités en direct sont autorisées pour l’app. Les libellés et la disponibilité peuvent varier."
      ]
    },
    {
      "heading": "Distinguer les deux affichages",
      "body": [
        "L’activité peut présenter le prochain événement sur l’écran verrouillé. Sur les iPhone compatibles, elle dispose aussi d’une présentation dans la Dynamic Island. Apple explique comment y développer une activité pour consulter davantage de détails.",
        "Un widget de l’écran d’accueil reste une autre présentation. L’ajouter ne prouve pas qu’une activité est démarrée. Activer le son des notifications ne la lance pas non plus."
      ]
    },
    {
      "heading": "Vérifier le rendez-vous autant que le nombre",
      "body": [
        "Le temps peut diminuer à partir d’une ancienne heure de début. Si l’organisateur décale la réunion, un nombre qui bouge ne prouve pas que la modification a été reçue. Consultez aussi le titre, la date et l’information de mise à jour affichée.",
        "Après une modification importante, rouvrez l’app et comparez le rendez-vous enregistré avec l’activité. En cas d’écart, utilisez les détails confirmés du rendez-vous pendant la recherche de la cause."
      ]
    },
    {
      "heading": "Garder un rappel lorsque vous ne regardez pas",
      "body": [
        "Un compte à rebours visuel n’aide que si vous regardez l’écran. Conservez un rappel adapté pour les rendez-vous importants et vérifiez séparément l’autorisation de notification. La présence de l’activité ne remplace pas une alerte nécessaire.",
        "Prévoyez également le trajet et la préparation. Le nombre mesure le temps jusqu’au début du rendez-vous ; il ne vérifie pas de manière indépendante votre heure de départ. Contrôlez le lieu et vos besoins."
      ]
    },
    {
      "heading": "Examiner une activité absente ou ancienne",
      "body": [
        "Vérifiez d’abord le rendez-vous dans l’app, puis le démarrage et l’autorisation de l’activité. Les mises à jour en arrière-plan dépendent d’iOS : l’affichage ne garantit ni une synchronisation continue ni une liste illimitée de futurs événements.",
        "Comparez un rendez-vous d’essai avant et après un changement d’heure. Notez le début attendu, celui affiché et l’effet d’une réouverture de l’app. Préservez les vraies invitations et indiquez les versions de l’app et d’iOS dans votre signalement."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Confirmer le rendez-vous futur et son calendrier.",
    "Démarrer « Live » et vérifier l’événement affiché.",
    "Comparer à nouveau après un changement d’horaire.",
    "Conserver séparément les rappels nécessaires."
  ],
  "faq": [
    {
      "q": "Le compte à rebours est-il toujours à jour ?",
      "a": "Non. Il peut compter vers une heure enregistrée auparavant. Vérifiez les changements importants dans l’app."
    },
    {
      "q": "Pourquoi un événement sur toute la journée manque-t-il ?",
      "a": "L’activité sélectionne les rendez-vous horaires à venir."
    },
    {
      "q": "Tous les iPhone ont-ils une Dynamic Island ?",
      "a": "Non. Cet affichage est distinct de l’écran verrouillé et nécessite un modèle compatible."
    }
  ],
  "sourcesHeading": "Sources et instructions Apple",
  "sources": [
    {
      "label": "Apple : fonctions et activités en direct sur l’écran verrouillé",
      "url": "https://support.apple.com/guide/iphone/access-features-from-the-lock-screen-iphcd5c65ccf/ios"
    },
    {
      "label": "Apple : activités en direct dans la Dynamic Island",
      "url": "https://support.apple.com/guide/iphone/view-live-activities-in-the-dynamic-island-iph28f50d10d/ios"
    }
  ],
  "seeAlso": [
    "the-widget-that-shows-what-is-next"
  ]
},

  'drag-an-event-to-move-it': {
    title: 'Déplacer un événement en le faisant glisser',
    short: 'Glisser plutôt que remplir',
    description:
      'Reprogrammer devrait coûter un geste, pas un formulaire. Pourquoi la manipulation directe compte plus dans un agenda que presque partout ailleurs.',
    lede: "Ouvrir l'événement, toucher le champ d'heure, faire tourner une molette, enregistrer : quatre étapes pour exprimer ce que vous aviez déjà montré du doigt.",
    commonBelief:
      "Que modifier l'heure dans un formulaire est précis et que glisser est approximatif.",
    sections: [
      {
        heading: "Le formulaire n'est pas plus exact",
        body: [
          "Un glissement retombe sur la grille, et la grille est dans les unités où vous planifiez de toute façon. Vous n'êtes pas imprécis : vous travaillez à la résolution qu'a réellement la journée.",
          "Là où la précision compte vraiment — un vol, une réservation à la minute — le formulaire est toujours là. Il cesse simplement d'être le premier réflexe pour les quatre-vingt-dix pour cent de cas qui veulent dire « une heure plus tard ».",
        ],
      },
      {
        heading: 'Déplacer est plus fréquent que créer',
        body: [
          "L'essentiel du travail d'agenda consiste à réarranger, pas à saisir. Une fois qu'on l'a remarqué, on voit qu'une application qui rend la création élégante et le réarrangement laborieux a optimisé la moitié la moins fréquente.",
          "Glisser et redimensionner font du réarrangement ce qu'il était déjà dans votre tête : ceci, mais plus tard, et un peu plus long.",
        ],
      },
    ],
    claims: {},
    practical: [
      "Glissez pour l'approximatif, ouvrez l'événement pour l'exact.",
      "Changez la durée par le bord plutôt qu'en saisissant une heure de fin.",
      "En vue Semaine, un glissement entre jours déplace la date et l'heure d'un seul geste.",
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view'],
  },

  'sharing-one-event-not-your-calendar': {
    title: 'Partager un seul événement, pas son agenda',
    short: 'Partager un événement',
    description:
      "Comment fonctionne l'envoi d'un seul événement, ce que reçoit vraiment le destinataire, et pourquoi il n'a rien à installer pour le voir.",
    lede: "Partager un agenda est d'ordinaire tout ou rien : soit quelqu'un a accès au vôtre, soit il ne l'a pas. Envoyer un dîner ne devrait exiger ni l'un ni l'autre.",
    commonBelief:
      'Que partager un événement revient à ouvrir une fenêtre sur le reste de votre semaine.',
    sections: [
      {
        heading: 'Ce qui part réellement',
        body: [
          "En créant un événement, l'application vous propose de le partager. Ce qui circule est un lien — par courriel, par message, par ce que le destinataire a installé — et derrière ce lien se trouve un flux d'agenda contenant cet événement et rien d'autre.",
          "Ce n'est ni une capture d'écran ni une copie qui vieillit. Si l'heure change, le flux change avec elle, et la personne à qui vous l'avez envoyé voit le changement sans que vous renvoyiez quoi que ce soit.",
        ],
      },
      {
        heading: "Elle n'a pas besoin de cette application",
        body: [
          "Le lien est un abonnement d'agenda ordinaire. Le Calendrier d'Apple le lit, Google Agenda le lit, Outlook le lit. Quelqu'un sous Android avec un compte Gmail peut s'y abonner et voir votre événement ; rien de tout cela n'exige un iPhone.",
          "Le message contient aussi un App Clip pour qui voudrait l'application : il s'ouvre sans rien installer et affiche l'événement immédiatement. C'est une porte, pas un péage, et la distinction compte quand vous invitez quelqu'un à qui vous ne pouvez pas demander d'installer un logiciel.",
        ],
      },
      {
        heading: "Ce que ce n'est pas",
        body: [
          "Ce n'est pas instantané. Le flux demande aux applications de revenir voir toutes les heures, et c'est une demande, pas une règle : chaque programme se rafraîchit à son rythme, certains plus paresseusement. Pour un dîner la semaine prochaine, c'est invisible. Pour un changement vingt minutes avant, envoyez aussi un message.",
          "Ce n'est pas secret non plus. Le lien porte vingt-deux caractères aléatoires, que personne ne devinera, mais quiconque l'a peut lire le flux. Traitez-le comme un lien vers un document : envoyez-le sans souci, et révoquez-le quand il a fait son travail.",
          "Et pour l'instant c'est en lecture seule. Le destinataire voit l'événement. Il ne peut ni le modifier ni écrire dans votre agenda.",
        ],
      },
    ],
    claims: {
      refreshHint: 'Heures entre deux demandes de rafraîchissement du flux',
      linkLength: 'Caractères aléatoires du lien, ce qui le rend indevinable',
      sharePrice: 'Ce que coûte le partage',
    },
    practical: [
      "Partagez depuis l'événement lui-même, juste après l'avoir créé : c'est là que la proposition apparaît.",
      'Envoyez le lien par le canal que vous utilisez déjà avec cette personne ; le format est indifférent.',
      "Si l'heure change au dernier moment, écrivez-lui en plus de déplacer l'événement.",
      "Révoquez le lien une fois l'événement passé, comme vous cesseriez de partager un document.",
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view'],
  },

  'free-google-sync-without-adverts': {
    title: 'Synchronisation Google gratuite, et ce que paie la publicité',
    short: 'Gratuit, et la publicité',
    description:
      'Ce que contient vraiment la formule gratuite, où apparaît la publicité et ce que coûte son retrait. Dit clairement, parce que presque aucune application ne le fait.',
    lede: "Les applications d'agenda gratuites le sont généralement parce qu'autre chose se vend. Il vaut la peine de savoir quoi avant de leur confier sa semaine.",
    commonBelief:
      "Qu'une formule gratuite est un essai et que la vraie application se trouve derrière le paiement.",
    sections: [
      {
        heading: 'Ce que couvre le gratuit',
        body: [
          "Toutes les vues, la synchronisation iCloud, la synchronisation Google, toute la météo dans l'agenda, les widgets, les liens Meet sur les événements et la modification par glisser. Pas un essai de ces choses : ces choses.",
          "Si vos agendas sont chez Apple et Google, ce qui est le cas de la plupart des gens, la formule gratuite est l'application.",
        ],
      },
      {
        heading: 'Ce que fait la publicité et ce que coûte son retrait',
        body: [
          "La formule gratuite porte de la publicité. La retirer est la formule payante la moins chère, et retirer la publicité est honnêtement l'essentiel de ce que fait cette formule.",
          "Le dire ainsi paraît préférable à l'arrangement habituel, où la formule sans publicité est empaquetée avec des fonctions que personne n'a demandées pour que le prix ait l'air d'acheter davantage.",
        ],
      },
    ],
    claims: {
      price: 'Coût de la formule gratuite',
      advancedMonthly: 'Coût mensuel du retrait de la publicité, en dollars',
    },
    practical: [
      'Commencez gratuitement : la synchronisation dont vous avez besoin est probablement déjà là.',
      "Payez pour retirer la publicité, pas parce que vous attendez que l'application change.",
      "La formule supérieure n'a de sens que si votre agenda professionnel est chez Microsoft.",
    ],
    seeAlso: ['what-a-subscription-actually-buys', 'icloud-google-and-outlook-in-one-view'],
  },

  'what-a-subscription-actually-buys': {
  "updated": "2026-10-21",
  "title": "Ce qu'achète vraiment un abonnement, formule par formule",
  "short": "Ce qu'achète un abonnement",
  "description": "Ce qu'achète un abonnement: Base, Advanced, Premium.",
  "lede": "Ce guide est publié par Arte Soft, le développeur de Cloud Calendars.",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "Base comprend la synchronisation Google Calendar, Google Meet, les vues du calendrier, la météo et les widgets. L’offre gratuite peut afficher des publicités."
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Advanced comprend Base et supprime les publicités. Premium comprend Advanced et ajoute Microsoft Calendar et Microsoft Teams.",
        "Un abonnement ne donne pas le droit de modifier les calendriers d’autrui et ne contourne pas les restrictions d’un compte professionnel."
      ]
    },
    {
      "heading": "Informations sur l’achat et la résiliation",
      "body": [
        "Avant l’achat, vérifiez le prix local, la période de facturation et les conditions de renouvellement.",
        "Pour un abonnement facturé par Apple, ouvrez Réglages → votre nom → Abonnements. Vérifiez l’état et la date d’expiration. Annuler le renouvellement est distinct de supprimer l’app ou les données du calendrier ; ne supposez pas que les fonctions payantes restent accessibles après expiration."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Avant l’achat, vérifiez le prix local, la période de facturation et les conditions de renouvellement.",
    "Un abonnement ne donne pas le droit de modifier les calendriers d’autrui et ne contourne pas les restrictions d’un compte professionnel."
  ],
  "faq": [
    {
      "q": "Comment arrêter le renouvellement ?",
      "a": "Pour un abonnement facturé par Apple, ouvrez Réglages → votre nom → Abonnements. Vérifiez l’état et la date d’expiration. Annuler le renouvellement est distinct de supprimer l’app ou les données du calendrier ; ne supposez pas que les fonctions payantes restent accessibles après expiration."
    }
  ],
  "sourcesHeading": "Informations sur l’achat et la résiliation",
  "sources": [
    {
      "label": "Apple: Comment arrêter le renouvellement ?",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "free-google-sync-without-adverts"
  ]
},
};
