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
  "month-view-on-a-bigger-screen": {
  "updated": "2026-10-22",
  "title": "Calendrier mensuel sur iPad et iPhone : voir les dates, vérifier les détails",
  "short": "Utiliser le mois sans manquer les détails",
  "description": "Comparez les dates sur iPad ou iPhone. Vérifiez événements masqués, calendriers choisis et heures avant de déplacer des rendez-vous partagés ou récurrents.",
  "lede": "La vue mensuelle situe les engagements dans les dates. Elle prouve moins bien qu’une heure précise est libre. Choisissez une date dans l’aperçu, puis examinez le jour et l’événement avant de vous engager. Ce guide est publié par Arte Soft, développeur de Cloud Calendars.",
  "commonBelief": "Une grille mensuelle plus grande montre tous les détails et une date apparemment vide prouve que tout le monde est disponible.",
  "sections": [
    {
      "heading": "Choisir entre dates et heures exactes",
      "body": [
        "Utilisez le mois pour comparer échéance de projet, voyage et rendez-vous familial sur plusieurs semaines. Pour savoir si deux rendez-vous se chevauchent à 14 h 30, passez au jour ou à la semaine et vérifiez début et fin exacts. Une case mensuelle n’a pas l’échelle d’une grille horaire.",
        "Un organisateur d’atelier peut d’abord éviter une semaine de voyage. Il doit ensuite examiner le jour proposé : engagements, préparation, trajet et heure de fin nécessaire. Une case dégagée est une piste à vérifier, pas une réservation confirmée ni une indication de disponibilité des autres."
      ]
    },
    {
      "heading": "Lire le compteur plutôt que les seuls titres visibles",
      "body": [
        "La case mensuelle actuelle de Cloud Calendars affiche un nombre limité de pastilles d’événements et un compteur supplémentaire si d’autres existent. Les titres restent sur une ligne et peuvent être tronqués. Ouvrez le jour ou l’événement pour le titre complet ou les autres engagements.",
        "Un grand écran d’iPad facilite la lecture sans supprimer forcément toutes les limites. Une fenêtre étroite ou un texte agrandi modifient la place disponible. Faites le même contrôle sur iPhone : examinez le jour avant de considérer les pastilles visibles comme le planning complet."
      ]
    },
    {
      "heading": "Vérifier mois, calendriers sélectionnés et dates voisines",
      "body": [
        "Lisez le mois et l’année avant de choisir. La grille peut inclure des dates du mois voisin pour compléter ses lignes. Dans Cloud Calendars, utilisez la navigation mensuelle et examinez la date sélectionnée sans vous fier à la seule position d’une case.",
        "Vérifiez les calendriers sélectionnés. Masquer le travail clarifie un programme familial mais retire ces engagements de cet aperçu. Pour diagnostiquer un doublon, masquez temporairement une source et comparez ; ne supprimez pas un rendez-vous pour alléger le mois."
      ]
    },
    {
      "heading": "Ouvrir l’événement avant de changer une organisation partagée",
      "body": [
        "Confirmez titre, propriétaire ou calendrier, heure locale et durée dans les détails. La couleur facilite le repérage sans remplacer l’identification du compte ou du droit de modification. Une invitation visible diffère d’un rendez-vous que vous organisez.",
        "Cloud Calendars permet de glisser un événement vers une autre date dans le mois. Avant un vrai déplacement, déterminez la date voulue et la portée de récurrence. Après une modification autorisée, rouvrez l’événement ; un geste local ne prouve pas que le fournisseur ou tous les participants ont accepté la nouvelle organisation."
      ]
    },
    {
      "heading": "Vérifier séparément récurrence et fuseaux horaires",
      "body": [
        "Si seul le cours de cette semaine change, ne modifiez pas involontairement la série future. Lisez le choix de portée proposé, puis vérifiez l’occurrence modifiée et une suivante. Le mois facilite les comparaisons, mais la portée de modification définit l’effet.",
        "Pour un voyage ou une réunion entre fuseaux, examinez explicitement date et heure locales. Déplacer à un autre jour ne convertit pas automatiquement l’heure de réunion prévue. Vérifiez les changements d’heure saisonniers si nécessaire et confirmez l’heure convenue avec les personnes concernées."
      ]
    },
    {
      "heading": "Utiliser la grande vue sans confondre les produits",
      "body": [
        "Calendrier Apple propose ses propres affichages mensuels, et Teamup décrit des vues différentes sur navigateur et mobile. Ces commandes appartiennent à leurs produits respectifs. Ne cherchez pas la configuration web de Teamup ou le menu d’Apple dans Cloud Calendars parce que les vues portent le même nom.",
        "Un mois de rendez-vous n’est pas non plus un mois de prévisions météo. Pour une sortie, vérifiez séparément lieu, date et heures de prévision disponibles. Enregistrez le rendez-vous final dans le bon calendrier et confirmez directement les changements avec les participants."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Présélectionner les dates au mois, puis vérifier les heures au jour ou à la semaine.",
    "Ouvrir les jours avec compteur supplémentaire ou titres tronqués.",
    "Vérifier mois, année et calendriers sélectionnés avant de supposer une date libre.",
    "Confirmer calendrier, heure, durée et droit de modification.",
    "Lire la portée de récurrence et vérifier l’occurrence après déplacement.",
    "Vérifier la météo disponible séparément et confirmer les changements."
  ],
  "faq": [
    {
      "q": "Le mois sur iPad affiche-t-il tous les rendez-vous en entier ?",
      "a": "Ne le supposez pas. Cloud Calendars limite les pastilles par case et utilise un compteur supplémentaire. Ouvrez le jour et l’événement pour examiner tout le planning."
    },
    {
      "q": "Un jour vide signifie-t-il que je suis libre ?",
      "a": "Vérifiez d’abord les calendriers sélectionnés, la date et la présence des données de compte utiles. L’aperçu représente seulement les informations disponibles et affichées."
    },
    {
      "q": "Déplacer un événement récurrent change-t-il seulement cette date ?",
      "a": "Lisez le choix de portée au lieu de le supposer. Après enregistrement, vérifiez l’occurrence modifiée et une suivante, puis confirmez l’organisation voulue."
    }
  ],
  "sourcesHeading": "Comparer les descriptions officielles des vues",
  "sources": [
    {
      "label": "Apple : vues mensuelle, sur plusieurs jours et en liste",
      "url": "https://support.apple.com/en-ca/guide/iphone/iphfd1054569/ios"
    },
    {
      "label": "Teamup : vues et configuration sur navigateur et application",
      "url": "https://calendar.teamup.com/kb/how-to-use-calendar-views/"
    }
  ],
  "seeAlso": [
    "drag-an-event-to-move-it"
  ]
},

"keeping-track-of-who-replied":{
  "updated": "2026-10-21",
  "title": "Réponses aux invitations : distinguer présence et accès partagé",
  "short": "Qui a répondu et qui a accès",
  "description": "Distinguez réponses de présence, invitations en attente, destinataires anonymes et partage accepté. Confirmez les présences sans inventer de total.",
  "lede": "Une personne peut ouvrir un lien, ajouter un événement ou accepter un accès sans promettre de venir. Déterminez la réponse recherchée avant d’interpréter une liste de destinataires. Ce guide est rédigé par Arte Soft, développeur de Cloud Calendars.",
  "commonBelief": "Tout destinataire ou partage accepté serait une présence confirmée, et le silence permettrait une estimation fiable.",
  "sections": [
    {
      "heading": "1. Identifiez le type d’invitation",
      "body": [
        "Une invitation de réunion du fournisseur demande une réponse de présence. Un partage Cloud Calendars donne accès aux détails ou à un calendrier, parfois avec modification. Un abonnement ICS suit des informations. Ces actions peuvent concerner la même réunion sans enregistrer la même décision.",
        "Un bénévole peut accepter un accès « Writer » pour mettre à jour l’événement sans y assister. Un invité peut lire l’aperçu web puis répondre par message. Aucun de ces cas ne doit être compté uniquement depuis un écran de gestion des accès."
      ]
    },
    {
      "heading": "2. Lisez les destinataires comme des informations d’accès",
      "body": [
        "Cloud Calendars distingue invitations par e-mail en attente, destinataires identifiés, destinataires anonymes et rôles d’accès. Une invitation en attente peut proposer un renvoi. « Reader », « Writer » et « Owner » décrivent ce que le destinataire peut faire des informations partagées.",
        "Le système enregistre l’acceptation ou la réception lors des parcours d’ajout ou d’accès. Cela éclaire la relation de partage, mais ne constitue pas une réponse de présence Oui/Peut-être/Non. Une réception anonyme n’identifie pas non plus un invité nommé à compter."
      ]
    },
    {
      "heading": "3. Vérifiez la présence dans le parcours d’invitation de l’organisateur",
      "body": [
        "Google décrit des réponses explicites « Yes », « No » et « Maybe ». Calendrier Apple distingue aussi « Accept », « Maybe » et « Decline » pour les invitations prises en charge. Consultez l’événement et le compte correspondants de l’organisateur pour vérifier ces réponses.",
        "Si une réponse paraît erronée ou manque, confirmez avec la personne l’adresse invitée et la version de l’événement. Une copie importée, un lien transféré ou un événement dans un autre compte peut ne pas représenter l’invitation d’origine. Ne supposez pas que tout affichage tiers contient la dernière réponse."
      ]
    },
    {
      "heading": "4. Laissez inconnue une présence inconnue",
      "body": [
        "Un partage en attente, une absence de réponse ou un message non lu n’est ni une acceptation ni un refus fiable. Séparez confirmations explicites, refus et réponses encore inconnues. N’ajoutez pas une proportion fixe des destinataires silencieux au total confirmé.",
        "Pour un repas avec une date limite de réservation, indiquez quand vous avez besoin d’une réponse et contactez directement les personnes restantes. Le suivi dépend de l’événement ; aucune règle universelle ne dit qu’un seul rappel deux jours avant suffit."
      ]
    },
    {
      "heading": "5. Traitez les liens de réunion comme des moyens de rejoindre",
      "body": [
        "Une URL Google Meet ou Microsoft Teams indique où rejoindre, pas si la personne a accepté ou viendra. Cloud Calendars inclut Google Meet dans Base et Microsoft Teams dans Premium, selon le compte et le parcours du fournisseur. Une formule supérieure ne rend pas le décompte plus fiable.",
        "Vérifiez que le lien prévu figure sur l’événement et fonctionne pour le public visé. Les imports et conversions peuvent perdre des informations de conférence. Si vous changez l’organisation, précisez l’événement et le lien à utiliser plutôt que de prendre l’ancien accès pour une confirmation."
      ]
    },
    {
      "heading": "6. Confirmez après un changement important",
      "body": [
        "Si un événement est sensiblement déplacé, mettez-le à jour via son calendrier d’origine ou le parcours de partage. Prévenez ensuite les personnes dont la présence compte et demandez une nouvelle confirmation si nécessaire. Une réponse pour mardi ne vaut pas forcément pour jeudi.",
        "Séparez la liste finale des présents de celle des accès. Retirer les droits de modification n’annule pas la présence ; refuser un accès partagé ne signifie pas forcément refuser la rencontre. Formulez clairement la décision demandée dans vos messages."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifiez si vous avez envoyé une invitation du fournisseur, un partage de l’app ou un flux.",
    "Utilisez la liste de partage pour les accès et invitations en attente, pas les totaux de présence.",
    "Vérifiez si nécessaire la réponse chez le fournisseur sur le vrai événement de l’organisateur.",
    "Séparez réponses inconnues, confirmations et refus.",
    "Demandez une réponse directe avec un délai adapté.",
    "Après une modification majeure, confirmez les nouvelles modalités et le lien avec les invités concernés."
  ],
  "faq": [
    {
      "q": "Accepter l’accès au calendrier signifie-t-il que la personne vient ?",
      "a": "Non. Cela signifie qu’une relation de partage a été acceptée par ce parcours. La présence exige une réponse à l’invitation du fournisseur ou une confirmation explicite."
    },
    {
      "q": "Puis-je compter les destinataires anonymes comme invités confirmés ?",
      "a": "Non. Une réception anonyme n’est pas un engagement de présence identifié. Elle peut décrire l’usage d’un événement partagé, sans fournir une liste nominative fiable."
    },
    {
      "q": "Faut-il Premium pour savoir qui a répondu ?",
      "a": "Ne confondez pas formule et fiabilité des réponses. Premium ajoute les fonctions de calendrier Microsoft et Teams ; reçus d’accès et réponses de présence restent distincts. Vérifiez l’invitation d’origine et le compte de l’organisateur."
    }
  ],
  "sourcesHeading": "Références sur les réponses et les imports",
  "sources": [
    {
      "label": "Google : répondre aux invitations à des événements",
      "url": "https://support.google.com/calendar/answer/37135?hl=en"
    },
    {
      "label": "Apple : répondre aux invitations Calendrier sur iPhone",
      "url": "https://support.apple.com/en-ph/guide/iphone/iphc0eddfe3c/ios"
    },
    {
      "label": "Google : importer des événements et limites associées",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    }
  ],
  "seeAlso": [
    "sharing-one-event-not-your-calendar"
  ]
},

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
  "updated": "2026-10-22",
  "title": "Calendrier et météo sur iPhone et iPad : vérifier un projet dans son contexte",
  "short": "Utiliser ensemble calendrier et météo",
  "description": "Associez calendrier et météo sur iPhone et iPad. Vérifiez le lieu, les heures de prévision disponibles et les détails avant d’enregistrer un projet.",
  "lede": "Le calendrier indique quand un engagement est prévu. La météo répond à une autre question : quelles conditions sont annoncées pour le lieu et la période utiles ? Utilisez les deux en gardant leurs lieux et dates explicites. Ce guide est publié par Arte Soft, développeur de Cloud Calendars.",
  "commonBelief": "La météo affichée près du calendrier décrit automatiquement l’adresse de chaque rendez-vous, toutes les heures et toutes les dates futures.",
  "sections": [
    {
      "heading": "Choisir une vraie question de planification",
      "body": [
        "Commencez par un rendez-vous précis, par exemple une visite au parc l’après-midi. Déterminez ce qui pourrait changer : heure, lieu, préparation ou choix d’une solution de repli. Inutile de réorganiser tout le calendrier parce que le symbole du jour annonce de la pluie.",
        "Notez le début et la fin réels de l’activité, installation comprise si nécessaire. L’aperçu du calendrier aide à trouver des dates possibles, tandis que la vérification météo concerne un lieu et un intervalle précis. Distinguez ces deux tâches pour comparer les options."
      ]
    },
    {
      "heading": "Confirmer le lieu météo avant de lire les valeurs",
      "body": [
        "Cloud Calendars propose la météo du lieu actuel ou sélectionné. Vérifiez le lieu affiché sans supposer que l’adresse d’un événement change silencieusement les prévisions. Un rendez-vous dans une autre ville exige une comparaison avec la météo de cette ville.",
        "Vous pouvez préparer une arrivée au musée alors que le téléphone est encore chez vous. Lisez le lieu des prévisions et l’heure locale du rendez-vous avant de les comparer. Des valeurs voisines à l’écran ne prouvent pas que planning et météo utilisent le même lieu."
      ]
    },
    {
      "heading": "Vérifier séparément les couvertures horaire et quotidienne",
      "body": [
        "Utilisez une donnée quotidienne pour vous orienter et les données horaires disponibles pour une partie de journée. Un rendez-vous de 14 h à 17 h demande plus qu’un regard sur un symbole. Vérifiez que les heures concernées sont présentes.",
        "Dans le code actuel, la liste quotidienne retient jusqu’à dix jours renvoyés par WeatherKit. Cela reste distinct de la navigation du calendrier et des heures actuellement fournies. Un rendez-vous futur n’étend pas les prévisions. Si sa période manque, prévoyez une vérification météo ultérieure."
      ]
    },
    {
      "heading": "Comprendre la signification de la valeur météo",
      "body": [
        "Apple décrit les données WeatherKit telles que température, précipitations, vent et UV ; certains produits ne sont disponibles que dans certaines régions. Lisez les valeurs proposées pour le lieu choisi plutôt que d’attendre tous les produits partout.",
        "Les conseils du Met Office illustrent l’importance de la période et de la définition des variables : certaines valeurs concernent un instant, d’autres une période. Utilisez les libellés du fournisseur concerné. Probabilité, quantité et durée de pluie sont des questions différentes ; aucun chiffre ne décide à lui seul de toutes les activités extérieures."
      ]
    },
    {
      "heading": "Examiner le brouillon créé depuis une heure météo",
      "body": [
        "Lorsque l’application propose de créer un événement depuis une heure, elle ouvre un brouillon. Le code actuel utilise le fuseau du lieu météo, propose une durée d’une heure et choisit le calendrier par défaut des nouveaux événements. Examinez chaque valeur avant d’enregistrer.",
        "Confirmez titre, calendrier de destination, début, fin et lieu prévu. Choisir une prévision n’accorde pas de droit de modification sur un calendrier partagé, n’avertit pas un établissement et ne réserve pas une salle. Vérifiez l’événement enregistré et obtenez les accords nécessaires."
      ]
    },
    {
      "heading": "Distinguer la démonstration du site",
      "body": [
        "La démonstration météo interactive du site utilise Open-Meteo. L’application utilise Apple WeatherKit. La démonstration permet d’explorer la présentation, mais son lieu, ses données et ses dates disponibles peuvent différer de l’application.",
        "Pour une vraie décision, ouvrez l’application et comparez le rendez-vous aux prévisions disponibles. Si vous modifiez un projet partagé, confirmez l’organisateur, la portée de récurrence et les participants. Gardez une solution de repli convenue lorsque l’activité dépend des conditions."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifier le rendez-vous et la décision que la météo pourrait modifier.",
    "Confirmer le lieu météo ainsi que la date et l’heure locales du rendez-vous.",
    "Examiner les heures disponibles séparément du résumé quotidien.",
    "Lire probabilité, quantité et autres valeurs selon leurs libellés.",
    "Vérifier tous les détails du brouillon et le calendrier de destination avant l’enregistrement.",
    "Revérifier au moment de décider et confirmer directement les changements partagés."
  ],
  "faq": [
    {
      "q": "La météo du calendrier suit-elle chaque adresse d’événement ?",
      "a": "Ne le supposez pas. Confirmez le lieu météo affiché et comparez-le au lieu du rendez-vous ; la proximité à l’écran ne prouve pas leur correspondance."
    },
    {
      "q": "L’application utilise-t-elle le fournisseur météo du site ?",
      "a": "Non. L’application utilise Apple WeatherKit ; la démonstration web utilise séparément Open-Meteo."
    },
    {
      "q": "Choisir une heure de prévision enregistre-t-il automatiquement un rendez-vous ?",
      "a": "Cela ouvre un brouillon lorsque cette action est proposée. Vérifiez date, fuseau, durée, calendrier et lieu, puis enregistrez l’événement voulu."
    }
  ],
  "seeAlso": [
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather",
    "planning-outdoors-without-being-rained-on"
  ],
  "sourcesHeading": "Sources officielles et lectures complémentaires",
  "sources": [
    {
      "label": "Apple : prévisions WeatherKit et disponibilité régionale",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office : lieu, périodes et valeurs des prévisions",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ]
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
  "updated": "2026-10-21",
  "title": "Partager un événement : choisir le lien et les droits adaptés",
  "short": "Partager un événement",
  "description": "Partagez un événement, pas tout le calendrier : rôles Reader, Writer et Owner, aperçus, mises à jour et limites du retrait d’accès.",
  "lede": "Transmettre les détails d’un dîner, autoriser un coorganisateur à modifier un événement et recueillir des réponses de présence sont trois tâches différentes. Définissez votre besoin avant de choisir le mode de partage. Ce guide est rédigé par Arte Soft, développeur de Cloud Calendars.",
  "commonBelief": "Tous les liens d’événement seraient des abonnements en lecture seule, mis à jour immédiatement et enregistrant une réponse.",
  "sections": [
    {
      "heading": "Commencer par vérifier les détails de l’événement",
      "body": [
        "Le partage d’un événement porte sur cet événement, et non sur tout le calendrier de l’expéditeur. Avant l’envoi, vérifiez le titre, le fuseau horaire, le lieu, les notes et les éventuels liens de réunion. Une information utile à un invité n’a pas forcément sa place dans un lien largement diffusé.",
        "Partager un dîner ne nécessite pas de partager le calendrier de vos rendez-vous médicaux. Le lieu et les liens du dîner restent toutefois inclus dans l’événement partagé. Vérifiez son contenu plutôt que de vous fier à la confidentialité du calendrier qui l’entoure."
      ]
    },
    {
      "heading": "Choisir un aperçu, une invitation par e-mail ou un code QR",
      "body": [
        "Cloud Calendars propose plusieurs modes de partage. Son App Clip affiche un aperçu ; l’application complète est nécessaire pour ajouter l’événement depuis ce parcours. Les invitations par e-mail et code QR passent par une page web proposant d’ouvrir Cloud Calendars. Ces liens ne sont pas des URL d’abonnement interchangeables.",
        "L’expéditeur se connecte pour utiliser le partage synchronisé de l’application. Un lien ou un code QR peut être transféré : envoyez-le uniquement à un public auquel son contenu convient. Le code QR transmet un lien ; il ne prouve pas l’identité de la personne qui l’ouvre."
      ]
    },
    {
      "heading": "Accorder uniquement les droits nécessaires",
      "body": [
        "Les invitations par e-mail permettent de choisir Reader, Writer ou Owner. Reader peut consulter et synchroniser ; Writer peut modifier ; Owner peut aussi partager et gérer les accès. Ces rôles ont des conséquences différentes. Choisissez Reader pour quelqu’un qui a seulement besoin du programme.",
        "Choisissez Writer pour un coorganisateur chargé de modifier l’événement. Réservez Owner à une personne qui doit aussi gérer l’accès des autres. Le destinataire doit utiliser l’identité connectée appropriée pour recevoir des droits étendus. Un destinataire anonyme n’est pas un copropriétaire identifié."
      ]
    },
    {
      "heading": "Comprendre comment le destinataire ajoute l’événement",
      "body": [
        "Dans l’application complète, l’ajout d’un événement partagé exige l’autorisation d’accéder aux calendriers et un calendrier de destination modifiable. Le destinataire doit vérifier cette destination avant d’enregistrer. La copie reçue peut ensuite être associée à l’événement partagé pour les mises à jour ultérieures.",
        "Ce mécanisme diffère de l’importation d’un fichier ICS ordinaire dans un autre calendrier. L’importation crée une copie, tandis qu’un abonnement consulte périodiquement un flux. Si vous envoyez un flux ICS plutôt qu’une invitation de l’application, expliquez-le et vérifiez sa compatibilité avec le calendrier du destinataire."
      ]
    },
    {
      "heading": "Vérifier les modifications avant de s’y fier",
      "body": [
        "Un partage synchronisé peut transmettre des modifications ou une annulation, mais l’appareil du destinataire doit pouvoir les recevoir. Une indication de fréquence d’actualisation n’est pas un délai de livraison garanti. Un appareil hors ligne, un abonnement non actualisé ou une copie importée indépendante peuvent encore afficher d’anciennes informations.",
        "Si l’heure du dîner change au dernier moment, modifiez l’événement et contactez directement les invités. Demandez-leur de confirmer la nouvelle heure. Envoyer une mise à jour et obtenir une réponse de présence sont deux démarches distinctes."
      ]
    },
    {
      "heading": "Gérer l’accès sans promettre l’effacement des copies",
      "body": [
        "Vérifiez les droits des destinataires et retirez ceux qui ne sont plus nécessaires. Supprimer l’accès d’une personne et révoquer un lien de flux sont deux opérations distinctes. Aucune ne doit être présentée comme effaçant à distance les captures d’écran, messages ou toutes les copies du calendrier.",
        "Si un lien a circulé au-delà du public prévu, identifiez le lien ou l’autorisation concerné. Vérifiez le parcours affecté après la modification des accès. Pour les événements futurs, évitez les détails privés dans les liens largement diffusés plutôt que de compter sur une révocation ultérieure pour les récupérer."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Vérifiez les détails et choisissez entre consultation, modification et réponses de présence.",
    "Choisissez le mode de partage voulu et connectez-vous si nécessaire.",
    "Utilisez Reader pour consulter ; réservez Writer et Owner aux responsabilités correspondantes.",
    "Demandez au destinataire de vérifier l’heure et le calendrier de destination lors de l’ajout.",
    "Pour un changement urgent, modifiez l’événement et envoyez un message direct.",
    "À la fin du partage, examinez séparément les droits des destinataires et l’accès par lien."
  ],
  "faq": [
    {
      "q": "Partager un événement expose-t-il tout mon calendrier ?",
      "a": "Le partage synchronisé d’un seul événement porte sur cet événement. Il transmet néanmoins ses propres détails par le parcours choisi. Vérifiez-les et n’envoyez pas une invitation à tout le calendrier si vous voulez partager un seul événement."
    },
    {
      "q": "Le destinataire peut-il modifier l’événement ?",
      "a": "Oui, avec les droits Writer ou Owner appropriés et le parcours connecté pris en charge. Reader permet la consultation et la synchronisation. Un abonnement ICS ordinaire n’offre pas le même mécanisme de modification."
    },
    {
      "q": "Retirer une personne annule-t-il tout ce qu’elle a reçu ?",
      "a": "Il ne faut pas supposer une telle garantie. La modification des droits agit sur la relation de partage prise en charge, mais des copies enregistrées, captures d’écran et messages peuvent subsister. Une URL de flux partagé doit aussi être examinée séparément."
    }
  ],
  "sourcesHeading": "Références sur les options du destinataire",
  "sources": [
    {
      "label": "Apple : présentation des App Clips",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google : importation d’événements et limites",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft : importer un calendrier ou s’y abonner",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "keeping-track-of-who-replied",
    "who-can-see-what-in-google-calendar",
    "what-guests-can-do-to-your-event"
  ]
},

  'free-google-sync-without-adverts': {
    title: 'Synchronisation Google gratuite, et ce que paie la publicité',
    short: 'Gratuit, et la publicité',
    description:
      "Découvrez ce que comprend la formule gratuite, où intervient la publicité et quelle formule permet de la retirer.",
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
