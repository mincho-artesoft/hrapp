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
  "title": "La prévision à côté de chaque événement, pas seulement de la journée",
  "short": "Une prévision par événement",
  "description": "Un résumé quotidien moyenne précisément les heures qui comptent. Ce que signifie une météo par événement, et pourquoi l'écart compte en extérieur.",
  "lede": "La plupart des agendas qui mentionnent la météo affichent une icône par jour. Cette icône est une moyenne, et la moyenne d'une matinée pluvieuse et d'un après-midi sec est une bruine qui n'arrive jamais.",
  "commonBelief": "Qu'une icône quotidienne dans l'agenda revient au même qu'une prévision attachée à un événement.",
  "sections": [
    {
      "heading": "Ce qu'une icône quotidienne dissimule",
      "body": [
        "Prenez une journée où il pleut fort jusqu'à onze heures puis se dégage. Le résumé choisit un entre-deux et affiche un nuage. Vous regardez votre rendez-vous de quatorze heures, vous voyez le nuage, et vous déplacez une promenade qu'il n'y avait pas lieu de déplacer.",
        "L'erreur va dans les deux sens. Une journée correcte à l'exception d'une heure violente à dix-huit heures s'affiche comme correcte, et le seul événement qui comptait est celui qui prend l'averse."
      ]
    },
    {
      "heading": "Attacher la prévision aux heures",
      "body": [
        "Un événement occupe des heures précises. La prévision de ces heures est un chiffre différent de celle de sa journée, et c'est le seul qui réponde à ce que vous demandez réellement.",
        "Ouvrez un événement et les conditions affichées sont celles de sa fenêtre. Un créneau de trois heures reçoit ses trois heures, pas les vingt-quatre."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Consultez l'événement, pas la journée, dès que le plan dépend du temps.",
    "Pour tout ce qui dure plus de deux heures, regardez comment les conditions évoluent sur le créneau.",
    "Déplacez avant d'annuler : une heure dans un sens ou dans l'autre suffit souvent."
  ],
  "seeAlso": [
    "weather-inside-your-calendar",
    "planning-outdoors-without-being-rained-on"
  ],
  "updated": "2026-10-21"
},

  'planning-outdoors-without-being-rained-on': {
  "title": "Organiser une sortie sans se faire surprendre par la pluie",
  "short": "Organiser en extérieur",
  "description": "Une méthode concrète pour programmer tout ce qui se passe dehors, en utilisant l'agenda que vous avez déjà plutôt qu'une routine météo à part.",
  "lede": "Si vos loisirs se passent dehors, vous avez sans doute inventé un rituel privé : consulter la météo, plisser les yeux sur la semaine, deviner. La partie « deviner » peut disparaître.",
  "commonBelief": "Qu'éviter le mauvais temps consiste à consulter la météo plus souvent.",
  "sections": [
    {
      "heading": "Regarder davantage n'est pas la réponse",
      "body": [
        "Ouvrir l'application météo cinq fois n'améliore pas la prévision ; cela améliore l'anxiété. Ce qui change le résultat, c'est de la regarder au moment où vous choisissez une heure — et c'est un moment tout à fait différent.",
        "Ce moment-là se passe dans l'agenda. Si la météo n'y est pas, la décision se prend sans elle et se corrige après."
      ]
    },
    {
      "heading": "Choisir le créneau sur la semaine",
      "body": [
        "Regardez la semaine avec les conditions derrière et le choix se fait souvent tout seul. Deux après-midi possibles, un seul au sec : il n'y a plus rien à délibérer.",
        "L'habitude qui vaut la peine est minuscule : avant de poser quelque chose en extérieur, regardez la bande, pas une autre application."
      ]
    },
    {
      "heading": "Ensuite, les heures et non la journée",
      "body": [
        "Une fois l'événement créé, la prévision qui compte est la sienne. Une journée peut être pluvieuse et vos deux heures sèches, et le résumé quotidien ne vous le dira jamais.",
        "Déplacez avant d'annuler. Une heure dans un sens sauve plus de projets que n'importe quelle quantité de vérifications."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Posez les événements en extérieur depuis la vue Semaine, conditions visibles.",
    "L'avant-veille, consultez les heures de l'événement et non sa journée.",
    "Décalez d'une heure avant d'abandonner le projet.",
    "À plus d'une semaine, choisissez le jour et acceptez d'affiner plus tard."
  ],
  "seeAlso": [
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather"
  ],
  "updated": "2026-10-21"
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
    title: 'iCloud, Google et Outlook dans une seule vue',
    short: 'Trois comptes, une vue',
    description:
      'La vie de presque tout le monde se répartit entre un agenda personnel Apple, un compte Google et un Exchange professionnel. Ce que change le fait de les mettre dans une même grille.',
    lede: "Le problème n'est presque jamais qu'un de ces agendas soit mauvais. C'est que vous en avez trois et une seule semaine.",
    commonBelief:
      'Que garder le travail et le personnel dans des applications séparées est une frontière et non un défaut.',
    sections: [
      {
        heading: 'Le double engagement est structurel',
        body: [
          "Si vos engagements vivent à trois endroits, aucun endroit ne peut vous dire si vous êtes libre. C'est vous, l'étape de fusion, et vous l'exécutez de mémoire — en général pendant que quelqu'un attend une réponse.",
          "D'où l'échec classique : non pas oublier un événement, mais accepter quelque chose qui entre en collision avec un événement que vous ne pouviez pas voir.",
        ],
      },
      {
        heading: "Ce qu'apporte une grille unique",
        body: [
          "Tous les comptes dans la même semaine, colorés selon leur origine, modifiables sur place. Vous cessez de vous demander quelle application détient la réponse, parce que la question cesse d'être au pluriel.",
          "La séparation que les gens veulent vraiment est visuelle, pas structurelle. Voir le travail d'une couleur et la famille d'une autre donne la frontière sans sacrifier la vue d'ensemble.",
        ],
      },
      {
        heading: 'Où tombent les formules',
        body: [
          "iCloud et Google se synchronisent dans la formule gratuite. Les comptes Microsoft — Outlook et Exchange — relèvent du payant, parce que cette connexion a un coût récurrent que les autres n'ont pas.",
          "Si votre agenda professionnel est chez Google, vous n'aurez jamais à payer pour la synchronisation.",
        ],
      },
    ],
    claims: {
      accounts: 'Types de comptes pouvant partager une vue',
      premiumMonthly: 'Coût mensuel pour ajouter Microsoft, en dollars',
    },
    practical: [
      "Ajoutez d'abord le compte personnel, puis celui qui provoque les collisions.",
      "Colorez par compte et non par catégorie : c'est l'origine qu'il faut voir d'un coup d'œil.",
      "Continuez d'écrire dans l'agenda que les autres lisent déjà.",
    ],
    seeAlso: ['three-calendar-apps-is-two-too-many', 'free-google-sync-without-adverts'],
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
