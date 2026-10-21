import { LocalisedArticle } from '../types';

/** Les six articles Google : des questions précises, des réponses nettes. */
export const GOOGLE_FR_FR: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
    title: 'Qui voit quoi lorsque vous partagez un agenda Google',
    short: 'Autorisations de partage Google',
    description:
      "Les niveaux de partage de Google se règlent vite et se comprennent mal. Ce que chacun expose réellement, en termes simples.",
    lede: "La plupart des partages excessifs ne sont pas des erreurs de jugement. Quelqu'un a choisi un niveau qui semblait modeste et ne l'était pas.",
    commonBelief: "Que « voir seulement libre/occupé » et « voir tous les détails » ne diffèrent que de peu.",
    sections: [
      {
        heading: "Les niveaux sont plus éloignés qu'ils n'en ont l'air",
        body: [
          "Libre/occupé montre des blocs de temps sans titre. Tous les détails montre titres, lieux, notes et invités — soit, pour la plupart des agendas, beaucoup de votre vie.",
          "Apporter des modifications permet de modifier. Gérer le partage permet de confier votre agenda à d'autres personnes : c'est celui qui surprend plus tard.",
        ],
      },
      {
        heading: 'Choisir sans y réfléchir à chaque fois',
        body: [
          "Pour des collègues qui doivent seulement caler des créneaux autour de vous, libre/occupé est presque toujours la bonne réponse et presque jamais celle retenue.",
          "Réservez les détails complets aux agendas créés pour être partagés, pas à celui dans lequel vous vivez.",
        ],
      },
    ],
    claims: {
      advancedMonthly: "Coût mensuel du niveau où cela se gère dans l'app, en dollars",
    },
    faq: [
      {
        q: 'Voit-on le titre de mes événements si je partage seulement libre/occupé ?',
        a: 'Non. Libre/occupé montre des blocs de temps sans titres, ni lieux, ni notes, ni invités. Seul « voir tous les détails » les expose — et il les expose tous.',
      },
      {
        q: 'Que permet « apporter des modifications et gérer le partage » ?',
        a: 'Modifier chaque événement, et confier votre agenda à d’autres personnes sans vous demander. C’est le seul niveau qui laisse quelqu’un d’autre distribuer l’accès.',
      },
      {
        q: 'Puis-je vérifier qui a déjà accès à mon agenda ?',
        a: 'Oui, dans les paramètres de partage de cet agenda. Rien ne vous invite à regarder et le partage ne fait que s’accumuler : relisez la liste deux fois par an.',
      },
    ],
    practical: [
      'Par défaut, libre/occupé pour quiconque doit seulement réserver du temps avec vous.',
      "Réservez « apporter des modifications » à ceux qui planifient vraiment pour vous.",
      "Revoyez les accès deux fois par an : le partage s'accumule et rien ne vous le rappelle.",
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'what-guests-can-do-to-your-event'],
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
    title: "Ce que révèle vraiment l'adresse secrète d'un agenda Google",
    short: "L'adresse iCal secrète",
    description:
      "Google propose une adresse privée qui montre tout votre agenda à qui la détient. Ce qu'elle expose, et pourquoi on ne la reprend pas discrètement.",
    lede: "Enfoui dans les paramètres de chaque agenda Google se trouve un lien qui montre tout ce qu'il contient. Sans connexion, sans autorisation, sans trace de qui l'a ouvert.",
    commonBelief: "Qu'une adresse privée est privée parce qu'elle est difficile à trouver.",
    sections: [
      {
        heading: "Un lien est un mot de passe qu'on ne peut pas changer pour une seule personne",
        body: [
          "L'adresse secrète porte tous les détails — titres, horaires, lieux, notes. Quiconque a le lien les voit, et aucune liste ne dit qui.",
          "Sa seule protection est la partie aléatoire de l'adresse. C'est une vraie protection contre la devinette, et aucune contre un transfert, un écran partagé ou un document qui survit au poste.",
        ],
      },
      {
        heading: "La réinitialiser la casse pour tout le monde",
        body: [
          "Vous pouvez réinitialiser l'adresse, ce qui tue l'ancienne. Cela la tue aussi pour chaque collègue, chaque tableau de bord et chaque script qui en dépendait en silence, sans le moindre avertissement.",
          "C'est l'argument pour ne jamais distribuer l'adresse d'un agenda dans lequel vous vivez. Publiez un agenda créé pour ça, et la réinitialisation ne coûte rien.",
        ],
      },
    ],
    claims: {
      linkLength: 'Caractères aléatoires protégeant un lien de partage du nôtre',
      sharePrice: "Ce que coûte le partage d'un événement depuis l'app",
    },
    faq: [
      {
        q: 'Que peut faire quelqu’un avec l’adresse secrète de mon agenda ?',
        a: 'Voir tout ce qu’il contient — titres, horaires, lieux et notes — sans connexion, sans autorisation, et sans qu’il reste la moindre trace de son passage.',
      },
      {
        q: 'Puis-je reprendre une adresse secrète d’agenda ?',
        a: 'Seulement en la réinitialisant, ce qui tue l’ancienne pour tout le monde d’un coup : collègues, tableaux de bord et scripts qui s’y appuyaient en silence, sans avertissement.',
      },
      {
        q: 'Puis-je envoyer l’adresse secrète à un collègue par e-mail ?',
        a: 'Considérez-la comme publique dès qu’elle quitte vos mains. Sa seule protection est d’être difficile à deviner, et un transfert annule exactement cela.',
      },
    ],
    practical: [
      "Considérez l'adresse secrète comme publique dès qu'elle quitte vos mains.",
      "Ne publiez jamais l'adresse de l'agenda que vous utilisez réellement.",
      "Réinitialisez au départ de quelqu'un, et prévenez ceux pour qui cela cassera.",
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'taking-back-a-calendar-you-shared'],
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
    title: 'Reprendre un agenda que vous avez partagé',
    short: "Retirer l'accès",
    description:
      "Retirer quelqu'un d'un agenda arrête ce qui vient ensuite. Ce que cela ne fait pas, c'est défaire ce qui a déjà eu lieu.",
    lede: "Mettre fin à un accès prend une touche. Décider si une touche suffit prend un peu plus longtemps, car le partage laisse des copies.",
    commonBelief: "Que retirer une personne retire ce qu'elle a vu.",
    sections: [
      {
        heading: "Ce qui s'arrête et ce qui reste",
        body: [
          "Retirez une personne et l'agenda disparaît de sa liste, aussitôt et sans message. Les événements à venir ne l'atteignent jamais.",
          "Ce qui ne revient pas : les invitations déjà reçues, les événements copiés dans son propre agenda, tout ce qui a été exporté, et tout ce pour quoi une adresse secrète a circulé. L'accès s'arrête ; la mémoire non.",
        ],
      },
      {
        heading: 'Celui qui survit au retrait',
        body: [
          "Si quelqu'un a eu un jour le droit de gérer le partage, il a peut-être ajouté d'autres personnes. Le retirer les laisse en place : c'est ainsi qu'un agenda finit partagé avec quelqu'un que personne ne se souvient d'avoir invité.",
          "Lisez donc toute la liste plutôt qu'un nom, et faites-le au moment du départ, pas des mois plus tard. Rien ne vous le rappelle, et le partage ne fait que s'accumuler.",
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Coût mensuel du niveau où cela se gère, en dollars',
    },
    faq: [
      {
        q: 'Retirer quelqu’un efface-t-il ce qu’il a déjà vu ?',
        a: 'Non. Les invitations qu’il détient déjà, les événements copiés dans son propre agenda et tout ce qui a été exporté survivent. L’accès se termine, pas les copies.',
      },
      {
        q: 'La personne est-elle prévenue que je lui ai retiré l’accès ?',
        a: 'Non. L’agenda disparaît de sa liste immédiatement et sans message.',
      },
      {
        q: 'Pourquoi mon agenda est-il partagé avec quelqu’un que je n’ai jamais invité ?',
        a: 'Quelqu’un ayant le droit de gérer le partage l’a ajouté. Le retirer laisse en place toutes les personnes qu’il a ajoutées — d’où la nécessité de lire la liste entière.',
      },
    ],
    practical: [
      "Lisez la liste complète des accès, pas seulement le nom que vous vouliez retirer.",
      "Réinitialisez l'adresse secrète si la personne l'a eue un jour.",
      'Supposez que les copies survivent : déplacez ce qui est vraiment sensible au lieu de le cacher.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
