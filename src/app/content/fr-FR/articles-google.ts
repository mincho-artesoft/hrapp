import { LocalisedArticle } from '../types';

/** Les six articles Google : des questions précises, des réponses nettes. */
export const GOOGLE_FR_FR: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
  "title": "Autorisations Google Agenda : vérifiez l’accès réellement accordé",
  "short": "Accès et confidentialité dans Google Agenda",
  "description": "Choisissez un accès aux disponibilités, aux détails ou à la modification. Vérifiez aussi les accès publics et par groupe avant de partager.",
  "lede": "Avant de partager un calendrier, décidez ce que l’autre personne doit faire. Trouver un créneau, lire les détails et tenir le calendrier à jour sont des tâches différentes. Ce guide est publié par Arte Soft, développeur de Cloud Calendars.",
  "commonBelief": "Accorder un accès limité à une personne garantirait qu’elle ne voit aucun détail par une autre voie.",
  "sections": [
    {
      "heading": "Adaptez l’accès à la tâche",
      "body": [
        "Un collègue cherchant un créneau peut avoir besoin des disponibilités sans les détails. Un collaborateur chargé du planning d’un projet a d’autres besoins. Définissez la tâche, puis examinez l’autorisation affichée dans les réglages actuels de partage du calendrier.",
        "Google distingue disponibilités, détails et plusieurs niveaux de modification. Une option limite l’accès aux événements privés ; une autre permet la modification et les détails, tandis que la plus étendue permet aussi de gérer le partage. Toutes les options parlant de modifications ne sont pas équivalentes."
      ]
    },
    {
      "heading": "Examinez l’accès global et celui de chaque personne",
      "body": [
        "Vérifiez si le calendrier est public, accessible à l’organisation ou partagé via un groupe, en plus des personnes nommées. Selon Google, un accès plus large peut primer sur un droit plus limité : restreindre une personne ne retire pas les détails déjà rendus publics.",
        "Prenez un planning de club publié pour ses membres. Avant d’y placer un rendez-vous personnel, vérifiez son public plutôt que de supposer que seul le droit affiché à côté d’un ami compte. Conservez les rendez-vous privés dans une destination adaptée."
      ]
    },
    {
      "heading": "Utilisez les réglages Google du calendrier exact",
      "body": [
        "Dans Google Agenda sur ordinateur, trouvez le calendrier parmi les vôtres, ouvrez son menu puis ses réglages de partage. Google décrit des zones distinctes pour les personnes ou groupes et pour l’accès plus large. Vérifiez le nom du calendrier et le compte connecté avant tout changement.",
        "Confirmez l’identité Google prévue du destinataire lors de l’invitation. S’il ne trouve pas le calendrier, vérifiez l’adresse et le message d’invitation plutôt que d’élargir les droits pour le faire apparaître. Un affichage absent et des droits de modification insuffisants sont deux problèmes différents."
      ]
    },
    {
      "heading": "Testez sans rendez-vous privés",
      "body": [
        "Utilisez un rendez-vous de test ordinaire sans titre privé, notes, lieu ou liste d’invités. Demandez au destinataire de confirmer ce qu’il voit et, uniquement si la modification est nécessaire et autorisée, ce qu’il peut changer. Ne transmettez pas vos identifiants pour effectuer ce test.",
        "Notez le calendrier et le rôle accordé, puis examinez le résultat après modification du réglage. Cela vérifie le partage prévu, sans prouver que des informations déjà lues ou copiées ont disparu. Ne testez pas en publiant un vrai planning professionnel."
      ]
    },
    {
      "heading": "Séparez règles professionnelles et formules de l’app",
      "body": [
        "Google précise que les administrateurs professionnels ou scolaires peuvent restreindre les commandes de partage. Si le réglage nécessaire manque, suivez la voie approuvée par l’organisation. Ne publiez pas d’informations professionnelles pour contourner une restriction du compte.",
        "Cloud Calendars peut afficher des calendriers connectés, mais ses formules ne redéfinissent pas les droits Google. Advanced supprime les publicités ; ce paiement ne donne pas à autrui accès à tous les événements Google. Vérifiez le partage chez le fournisseur et le résultat accepté, sans vous fier au seul éditeur local disponible."
      ]
    },
    {
      "heading": "Réexaminez et retirez les accès devenus inutiles",
      "body": [
        "À la fin d’un projet, examinez destinataires réels, groupes et publications plus larges. Retirer une personne nommée n’est qu’une partie du contrôle si d’autres voies existent. Convenez de qui tient le planning et de la gestion des futurs changements d’accès.",
        "Google documente séparément le retrait de personnes ou groupes et la désactivation du partage plus large. Retirer un accès ne récupère ni fichier exporté, ni capture, ni information déjà copiée ailleurs. Traitez ces copies séparément avec les personnes concernées, sans promettre qu’un bouton efface toutes les anciennes copies."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifiez le calendrier et la tâche du destinataire.",
    "Examinez les accès individuels, de groupe, d’organisation et publics.",
    "Choisissez le droit adapté dans les réglages Google actuels.",
    "Vérifiez l’identité avant de modifier l’accès.",
    "Contrôlez un événement de test sans données sensibles du côté du destinataire.",
    "Réexaminez les accès obsolètes sans supposer le rappel des copies antérieures."
  ],
  "faq": [
    {
      "q": "Un droit individuel restreint prime-t-il sur un calendrier public ?",
      "a": "Non. Google indique que les droits plus larges ont priorité lorsque les réglages se contredisent. Vérifiez les accès publics et d’organisation ainsi que l’entrée de la personne."
    },
    {
      "q": "Tous les droits de modification exposent-ils pareillement les événements privés ?",
      "a": "Non. Google décrit séparément une option de modification limitant l’accès aux événements privés et d’autres options de modification ou de gestion du partage. Lisez le droit actuel exact avant de choisir."
    },
    {
      "q": "Acheter Advanced change-t-il les droits de partage Google ?",
      "a": "Non. Advanced supprime les publicités dans Cloud Calendars. L’accès dépend des droits du calendrier et des restrictions de l’organisation."
    }
  ],
  "sourcesHeading": "Conseils Google actuels sur les droits et le partage",
  "sources": [
    {
      "label": "Google : choisir les autorisations du calendrier",
      "url": "https://support.google.com/calendar/answer/15716974?hl=en"
    },
    {
      "label": "Google : partager un calendrier et retirer un accès",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    }
  ],
  "seeAlso": [
    "why-a-shared-calendar-does-not-appear"
  ],
  "updated": "2026-10-21"
},

  'why-a-shared-calendar-does-not-appear': {
    "updated": "2026-10-21",
    "title": "Un agenda a été partagé avec vous et il n'est pas là",
    "short": "Agenda partagé qui n'apparaît pas",
    "description": "Agenda Google partagé absent : vérifiez le compte invité, le groupe, la visibilité et le type de lien reçu.",
    "lede": "Ce guide est rédigé par Arte Soft, développeur de Cloud Calendars. Distinguez d’abord un accès manquant d’un agenda simplement masqué.",
    "commonBelief": "Qu'accepter un agenda partagé le met sur votre téléphone.",
    "sections": [
      {
        "heading": "Vérifier le compte et le groupe",
        "body": [
          "Comparez le destinataire de l’invitation au compte Google utilisé sur le téléphone et dans le navigateur. Ouvrez le lien avec le compte concerné. Google permet le partage avec des personnes et des groupes Google. Pour un accès par groupe, faites confirmer votre appartenance par son gestionnaire et le partage avec le bon groupe par le propriétaire de l’agenda. Un courriel transféré ne suffit pas à accorder une autorisation."
        ]
      },
      {
        "heading": "Masqué, absent ou limité ?",
        "body": [
          "Dans Google Agenda sur iPhone ou iPad, ouvrez le menu. Si l’agenda figure dans la liste sans être coché, sélectionnez-le. S’il est absent, faites vérifier l’accès par le propriétaire : une demande n’est pas une approbation. Les règles professionnelles ou scolaires peuvent limiter le partage. Comparez le même compte sur le Web. S’il y fonctionne, vérifiez le compte connecté et les agendas sélectionnés dans l’autre application. Un accès en lecture seule ne permet pas de modifier les événements."
        ]
      },
      {
        "heading": "Identifier le lien reçu",
        "body": [
          "Une invitation de partage contient aussi un lien : ce n’est pas forcément un abonnement ICS. Demandez s’il donne accès à un agenda Google ou à un flux en lecture seule. Google exige un navigateur sur ordinateur pour un nouvel abonnement ; ouvrir un agenda déjà partagé par courriel est une autre opération. La mise à jour d’un flux dépend du service destinataire. Aucun délai universel ne s’applique ; confirmez les changements urgents auprès de l’organisateur."
        ]
      }
    ],
    "claims": {},
    "faq": [
      {
        "q": "Un groupe Google peut-il recevoir un accès ?",
        "a": "Oui. Vérifiez le groupe choisi, votre appartenance et les restrictions de l’organisation. Un courriel de groupe transféré ne prouve pas cet accès."
      },
      {
        "q": "Faut-il supprimer puis reconnecter le compte ?",
        "a": "Vérifiez d’abord le compte, les autorisations et la visibilité, puis comparez l’agenda Web. Une reconnexion n’accorde pas les droits manquants."
      }
    ],
    "practical": [
      "Confirmez le compte invité et votre appartenance au groupe.",
      "Cochez l’agenda s’il est présent mais masqué.",
      "Faites vérifier l’accès avant de modifier les connexions."
    ],
    "sourcesHeading": "Sources et lectures complémentaires",
    "sources": [
      {
        "label": "Google: Vérifier le compte et le groupe",
        "url": "https://support.google.com/calendar/answer/37082?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Masqué, absent ou limité ?",
        "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Identifier le lien reçu",
        "url": "https://support.google.com/calendar/answer/37648?hl=en"
      }
    ],
    "seeAlso": [
      "who-can-see-what-in-google-calendar",
      "google-calendars-that-never-reach-your-iphone"
    ]
  },

  'the-secret-address-of-a-google-calendar': {
  "title": "L’adresse iCal secrète de Google : distinguer abonnement et partage",
  "short": "L’adresse iCal secrète",
  "description": "Distinguez adresse iCal secrète, connexion de compte et flux partagés, sans promettre de mises à jour immédiates ni l’effacement des copies.",
  "lede": "Une adresse de calendrier, une connexion de compte et une invitation remplissent des fonctions différentes. Identifiez ce que vous avez avant de transférer un planning dans une autre application. Ce guide est publié par Arte Soft, développeur de Cloud Calendars.",
  "commonBelief": "Une adresse secrète est une invitation personnelle que l’on peut retirer à un seul destinataire.",
  "sections": [
    {
      "heading": "Choisir la connexion adaptée",
      "body": [
        "Google distingue la connexion à une autre application de calendrier de la consultation via une adresse iCal secrète. La connexion de compte peut permettre la modification ; l’adresse fournit un abonnement en lecture seule. Google la réserve à votre propre usage et déconseille de la partager avec autrui.",
        "Afficher votre planning professionnel dans un autre calendrier compatible diffère d’un accès permanent accordé à un collègue. Commencez par l’objectif : consulter votre planning, collaborer avec une personne précise ou diffuser un programme destiné à un public. Ne choisissez pas une URL simplement parce qu’elle est facile à coller."
      ]
    },
    {
      "heading": "Trouver le bon calendrier, pas seulement le bon compte",
      "body": [
        "Sur ordinateur, les instructions de Google placent « Secret address in iCal format » dans les réglages « Integrate calendar » du calendrier choisi. Vérifiez d’abord son nom. Un administrateur d’entreprise ou d’établissement scolaire peut restreindre cette option ; l’absence d’adresse ne justifie pas de publier le calendrier.",
        "Évitez de faire apparaître l’adresse dans des captures, des demandes d’assistance publiques ou des notes partagées. Pour demander de l’aide, indiquez le type de compte, le nom du calendrier et la méthode de connexion sans fournir l’URL. L’assistance doit normalement identifier le mode de connexion avant d’avoir besoin du contenu des événements."
      ]
    },
    {
      "heading": "Vérifier ce que l’application destinataire a ajouté",
      "body": [
        "Un abonnement suit un flux ; l’importation d’un fichier crée une copie distincte. Lisez les instructions de l’application destinataire et confirmez l’action choisie. Ouvrir simplement un fichier de calendrier téléchargé ne garantit pas que les rendez-vous obtenus suivront les modifications ultérieures.",
        "Comparez le nom du calendrier, la date et les détails affichés à l’aide d’un événement ordinaire, connu et non sensible. Ne créez pas un second abonnement pour diagnostiquer le premier : deux copies visibles peuvent faire passer un retard de mise à jour pour un conflit de rendez-vous. Masquez temporairement un calendrier pour identifier la source."
      ]
    },
    {
      "heading": "Séparer les liens Google et Cloud Calendars",
      "body": [
        "Cloud Calendars possède ses propres parcours de partage d’événements et de calendriers, avec notamment des flux d’abonnement. Ce ne sont pas des adresses secrètes Google. Avant d’ouvrir un lien, déterminez si l’expéditeur a partagé un événement, un calendrier ou une invitation liée à un compte.",
        "Un destinataire Cloud Calendars peut avoir le rôle Reader, Writer ou Owner. Une adresse de flux ne prouve pas à elle seule un droit de modification. De même, recevoir une adresse de consultation Google ne fait pas de vous le propriétaire du calendrier. Demandez à l’expéditeur dans quel système effectuer les changements."
      ]
    },
    {
      "heading": "Tenir compte de l’actualisation du calendrier destinataire",
      "body": [
        "Un abonnement ne promet pas une livraison immédiate. Les flux Cloud Calendars proposent un intervalle d’actualisation, mais l’application destinataire décide quand récupérer et afficher les changements. Une ancienne heure sur un appareil ne prouve pas que l’organisateur a oublié d’enregistrer la modification.",
        "Pour une réunion le jour même, comparez avec le planning actuel de l’organisateur et confirmez directement les changements importants. Notez quel calendrier affiche encore les anciennes informations et l’heure de votre vérification. N’importez pas l’événement à répétition et ne supprimez pas le calendrier source pour forcer l’actualisation."
      ]
    },
    {
      "heading": "Réagir à une divulgation sans promettre un rappel",
      "body": [
        "Google décrit la réinitialisation d’une adresse secrète divulguée : l’ancienne devient invalide et une nouvelle est créée. Identifiez vos applications qui l’utilisent pour actualiser ensuite leurs abonnements. Réinitialiser une adresse diffère du retrait d’un collaborateur nommé.",
        "Les rendez-vous enregistrés, exportations et captures antérieures sont une question distincte. Un lien modifié ne prouve pas que toutes les anciennes copies ont disparu. Si des informations ont atteint le mauvais public, examinez le contenu et les destinataires réels plutôt que de considérer une réinitialisation réussie comme une preuve de suppression complète."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifier connexion de compte, invitation, abonnement ou fichier.",
    "Vérifier le calendrier propriétaire avant de copier une adresse.",
    "Réserver l’adresse secrète Google à vos propres applications compatibles.",
    "Vérifier que l’application destinataire s’est abonnée au lieu d’importer.",
    "Confirmer les changements urgents auprès de l’organisateur sans dépendre du délai d’actualisation.",
    "Si l’adresse a été divulguée, suivre la procédure Google de réinitialisation et actualiser les connexions voulues."
  ],
  "faq": [
    {
      "q": "Puis-je donner l’adresse secrète à un collègue ?",
      "a": "Google recommande de la réserver à vos propres applications. Si une autre personne a besoin d’un accès, utilisez les réglages de partage du calendrier avec l’autorisation souhaitée."
    },
    {
      "q": "Un abonnement me permet-il de modifier l’original ?",
      "a": "L’adresse iCal secrète Google permet la consultation. La modification nécessite une connexion de compte adaptée et une autorisation ; les rôles Cloud Calendars constituent un dispositif distinct."
    },
    {
      "q": "La réinitialisation efface-t-elle les anciens rendez-vous partout ?",
      "a": "Elle invalide l’ancienne adresse Google. Elle ne prouve pas la suppression des fichiers, rendez-vous ou captures enregistrés indépendamment."
    }
  ],
  "sourcesHeading": "Conseils des fournisseurs et lectures complémentaires",
  "sources": [
    {
      "label": "Google : connexions de compte et adresses iCal secrètes",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    },
    {
      "label": "Google : partager un calendrier",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft : importation, abonnement et délais d’actualisation",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "taking-back-a-calendar-you-shared",
    "sharing-one-event-not-your-calendar"
  ],
  "updated": "2026-10-21"
},

  'what-guests-can-do-to-your-event': {
    title: 'Ce que vos invités peuvent faire à un événement',
    short: 'Autorisations des invités',
    description:
      "Trois cases décident si un invité peut déplacer votre réunion, inviter des inconnus ou lire toute la liste. Elles sont actives plus souvent qu'on ne le croit.",
    lede: "Inviter quelqu'un lui donne plus qu'un lieu et une heure. Sur un événement Google ordinaire, un invité voit généralement qui d'autre a été convié, et peut souvent ajouter à la liste.",
    commonBelief: "Qu'un invité ne peut qu'accepter ou refuser.",
    sections: [
      {
        heading: 'Les trois cases',
        body: [
          "Modifier l'événement laisse un invité changer l'heure, le lieu et le titre pour tout le monde. Rarement voulu, facilement laissé actif.",
          "Inviter d'autres personnes lui permet d'ajouter des gens que vous n'avez jamais rencontrés. Voir la liste des invités montre tous les conviés et leurs réponses — acceptable pour une équipe, gênant pour un client, faux pour tout ce qui ressemble à un groupe de clients distincts.",
        ],
      },
      {
        heading: 'Là où cela dérape en silence',
        body: [
          "Un événement, beaucoup de destinataires individuels, liste visible : chacun a désormais tout le monde. Décocher cette case est la différence entre une réunion et un carnet d'adresses fuité.",
          "Ces réglages vivent sur l'événement, pas sur le compte. Ils reviennent à vos valeurs par défaut à chaque fois et doivent être pensés sur les événements qui comptent, pas une fois pour toutes.",
        ],
      },
    ],
    claims: {
      sharePrice: "Ce que coûte l'envoi d'un seul événement depuis l'app",
    },
    faq: [
      {
        q: 'Les invités se voient-ils entre eux sur une invitation Google Agenda ?',
        a: 'Par défaut, le plus souvent oui. « Voir la liste des invités » montre tous les conviés et leurs réponses — acceptable en équipe, gênant avec un client, faux quand les invités sont des clients distincts.',
      },
      {
        q: 'Un invité peut-il changer l’heure de ma réunion ?',
        a: 'Si « modifier l’événement » est coché, oui, et le changement s’applique à tout le monde. Rarement souhaité, facilement laissé actif.',
      },
      {
        q: 'Comment empêcher les invités d’en inviter d’autres ?',
        a: 'Décochez « inviter d’autres personnes » sur l’événement lui-même. Ces réglages appartiennent à l’événement et non au compte : ils reviennent à vos valeurs par défaut à chaque création.',
      },
    ],
    practical: [
      "Désactivez « voir la liste des invités » pour tout envoi à des gens qui ne se connaissent pas.",
      "Laissez « modifier l'événement » désactivé sauf si quelqu'un planifie vraiment pour vous.",
      "Vérifiez les cases sur l'événement, pas dans vos paramètres : c'est là qu'elles vivent.",
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'why-a-shared-calendar-does-not-appear'],
  },

  'google-calendars-that-never-reach-your-iphone': {
    title: "Pourquoi certains agendas Google n'arrivent jamais sur votre iPhone",
    short: 'Agendas Google absents sur iPhone',
    description:
      "Un compte Google, plusieurs agendas, et un seul sur le téléphone. La liste de synchronisation qui en décide, et quoi faire à la place.",
    lede: "Votre compte Google contient huit agendas. Votre iPhone en montre deux. Rien n'est cassé : quelque chose que vous n'avez jamais vu a choisi pour vous.",
    commonBelief: "Qu'ajouter un compte Google à un iPhone ajoute les agendas qu'il contient.",
    sections: [
      {
        heading: "Une liste qu'on ne vous a jamais montrée",
        body: [
          "Google tient, par appareil, une liste des agendas autorisés à se synchroniser, et les agendas secondaires — partagés, abonnés, créés pour un projet — en sont fréquemment absents.",
          "Cette liste n'est pas dans les réglages d'iOS. Elle vit sur une page Google à part : voilà pourquoi chercher à l'endroit évident ne trouve rien d'anormal et ne change rien.",
        ],
      },
      {
        heading: "L'autre chemin",
        body: [
          "Une app qui parle directement à Google n'utilise pas cette liste : elle montre tous les agendas que le compte détient vraiment, y compris ceux que le téléphone a discrètement laissés de côté.",
          "Cela rapproche aussi les comptes. Une vue qui tient le personnel, le travail et le partagé est tout l'intérêt ; savoir si le téléphone aurait synchronisé chacun d'eux cesse d'être une question.",
        ],
      },
    ],
    claims: {
      accounts: 'Types de comptes réunis dans une seule vue',
      price: 'Ce que coûte le côté Google',
    },
    faq: [
      {
        q: 'Pourquoi seuls certains de mes agendas Google apparaissent-ils sur iPhone ?',
        a: 'Google tient, par appareil, une liste des agendas autorisés à se synchroniser, et les agendas secondaires — partagés, abonnés, créés pour un projet — en sont fréquemment absents.',
      },
      {
        q: 'Où est le réglage de synchronisation Google Agenda pour iPhone ?',
        a: 'Pas dans les réglages d’iOS. Il vit sur une page Google à part, et c’est pourquoi chercher à l’endroit évident ne trouve rien et ne change rien.',
      },
      {
        q: 'Comment voir tous mes agendas Google sur iPhone ?',
        a: 'En passant par une app qui interroge Google directement plutôt que par la liste de l’appareil. Elle montre chaque agenda que le compte détient, y compris ceux que le téléphone a écartés.',
      },
    ],
    practical: [
      "Vérifiez la liste de synchronisation Google avant de croire le compte cassé.",
      "Attendez-vous à ce que les agendas abonnés et partagés soient exclus, pas inclus.",
      "Au-delà de deux agendas, lisez-les avec quelque chose qui interroge Google directement.",
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'icloud-google-and-outlook-in-one-view'],
  },

  'taking-back-a-calendar-you-shared': {
  "title": "Ne plus partager un calendrier : retirer l’accès et vérifier les autres voies",
  "short": "Vérifier et retirer les accès partagés",
  "description": "Arrêtez le partage en distinguant personnes, groupes, accès public et liens de flux. Vérifiez le résultat et les copies qui peuvent subsister.",
  "lede": "Pour mettre fin à une collaboration, commencez par identifier comment l’accès a été accordé. Retirer une personne, désactiver la publication et réinitialiser une adresse de flux sont des actions différentes. Ce guide est publié par Arte Soft, développeur de Cloud Calendars.",
  "commonBelief": "Retirer un destinataire rappelle immédiatement toutes les copies du calendrier et ferme toutes les autres voies d’accès.",
  "sections": [
    {
      "heading": "Identifier le calendrier et le mode de partage",
      "body": [
        "Avant de modifier l’accès, confirmez le compte propriétaire, le calendrier et le public visé. Un calendrier Google partagé avec un collègue nommé diffère d’un calendrier public, d’une autorisation de groupe ou d’une adresse d’abonnement. Cloud Calendars possède aussi ses propres relations de partage d’événements et de calendriers.",
        "Par exemple, le secrétaire d’un club peut recevoir des droits de modification par invitation nominative, tandis que les membres suivent un planning publié. Retirer cette autorisation ne détermine pas ce qui doit arriver aux abonnements des membres. Dressez la liste des dispositifs réellement mis en place."
      ]
    },
    {
      "heading": "Retirer l’autorisation Google concernée",
      "body": [
        "Google décrit des réglages distincts pour les personnes ou groupes nommés, le partage à l’échelle d’une organisation et la disponibilité publique. Sur un ordinateur, ouvrez les paramètres de partage du calendrier concerné et modifiez l’entrée ou le réglage général approprié. Vérifiez d’abord le compte connecté et le nom du calendrier.",
        "Une personne peut conserver une autre voie d’accès, par exemple un groupe ou une publication plus large. Examinez l’ensemble du partage au lieu de retirer plusieurs fois la même adresse e-mail. Les règles de l’entreprise ou de l’établissement scolaire peuvent limiter les réglages disponibles ; suivez si nécessaire la procédure approuvée par le propriétaire ou l’administrateur."
      ]
    },
    {
      "heading": "Traiter séparément une adresse secrète de calendrier",
      "body": [
        "Google indique que l’adresse iCal secrète est destinée à votre propre usage dans une autre application de calendrier et ne doit pas être communiquée à autrui. Si elle a été divulguée, Google décrit sa réinitialisation pour invalider l’ancienne adresse. Cette action diffère du retrait d’une personne nommée.",
        "Avant de modifier une adresse d’abonnement que vous utilisez, identifiez les applications ou outils qui en dépendent afin de reconnecter ensuite ceux à conserver. Ne collez pas l’URL secrète dans une demande d’assistance publique et ne l’envoyez pas pour prouver que vous avez trouvé le bon calendrier. Indiquez plutôt son nom et le type de connexion."
      ]
    },
    {
      "heading": "Distinguer les destinataires Cloud Calendars des liens de flux",
      "body": [
        "Dans Cloud Calendars, l’accès d’un destinataire à un événement ou un calendrier et un flux d’abonnement émis sont des mécanismes distincts. Examinez la relation de partage réelle et le lien concerné avant d’agir. Retirer un destinataire identifié ne garantit pas le rappel de toutes les URL déjà diffusées ni des copies indépendantes.",
        "Si un coorganisateur doit simplement cesser de modifier le calendrier, examinez son rôle prévu et le public restant plutôt que de supprimer le planning partagé. Si toute la collaboration prend fin, déterminez qui possède le calendrier et qui doit le conserver. Quitter un calendrier reçu et supprimer un calendrier dont vous êtes propriétaire sont des décisions différentes."
      ]
    },
    {
      "heading": "Vérifier le résultat sans promettre une disparition immédiate",
      "body": [
        "Vérifiez que la modification prévue est enregistrée dans le système propriétaire. Si un collègue autorisé peut vous aider, confirmez le résultat de consultation ou de modification depuis son propre compte, sans échanger de mots de passe. Distinguez un refus d’accès d’un ancien événement encore visible dans une copie importée ou en cache.",
        "Ne promettez ni délai universel d’actualisation ni absence de notification. Lors d’un passage de relais dans un groupe, précisez quel planning utiliser désormais. Un ancien élément visible ne permet pas, à lui seul, de savoir si la personne conserve un accès actif, une autre autorisation ou une copie autonome."
      ]
    },
    {
      "heading": "Prévoir un suivi distinct pour les anciennes copies",
      "body": [
        "Les fichiers exportés, captures d’écran, messages et rendez-vous enregistrés séparément peuvent subsister après une modification des accès. Déterminez quelles copies comptent pour le passage de relais et discutez de leur traitement avec les personnes concernées. Une modification d’autorisation ne révèle pas ce que chaque destinataire a déjà conservé.",
        "Conservez les documents sources nécessaires pendant la vérification. Ne déplacez pas des réunions sensibles dans un autre calendrier partagé pour donner l’impression que l’ancien est vide, et n’annulez pas de vraies invitations pour tester l’accès. Notez le calendrier, la voie d’accès et la modification effectuée afin de disposer d’un point de départ clair pour tout dépannage ultérieur."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifier le compte propriétaire, le calendrier et le mode de partage.",
    "Examiner séparément les personnes, les groupes et la publication plus large.",
    "Utiliser les réglages de partage appropriés de Google ou Cloud Calendars.",
    "Décider séparément de la réinitialisation d’une adresse secrète divulguée.",
    "Vérifier le résultat enregistré sans partager d’identifiants.",
    "Prévoir le traitement des anciennes copies et exportations séparément de l’accès actif."
  ],
  "faq": [
    {
      "q": "Retirer une personne désactive-t-il un calendrier public ou son accès par un groupe ?",
      "a": "Ne le supposez pas. Examinez chaque voie réelle. Google décrit les destinataires nommés, les groupes et la publication plus large comme des réglages distincts."
    },
    {
      "q": "Le calendrier disparaîtra-t-il immédiatement et sans notification ?",
      "a": "Aucune promesse universelle ne s’applique ici à la disparition, aux notifications ou aux délais d’actualisation. Confirmez la modification enregistrée et distinguez l’accès actif des informations importées ou en cache."
    },
    {
      "q": "Advanced permet-il d’acheter le droit de retirer un accès Google ?",
      "a": "Advanced supprime les publicités dans Cloud Calendars. Les réglages de partage Google dépendent de la propriété, des autorisations et des règles de l’organisation, pas de cette formule de l’application."
    }
  ],
  "sourcesHeading": "Conseils du fournisseur sur les accès et abonnements",
  "sources": [
    {
      "label": "Google : réglages de partage et retrait des accès",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Google : synchronisation des comptes et adresses iCal secrètes",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "the-secret-address-of-a-google-calendar"
  ],
  "updated": "2026-10-21"
},
};
