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
    practical: [
      'Par défaut, libre/occupé pour quiconque doit seulement réserver du temps avec vous.',
      "Réservez « apporter des modifications » à ceux qui planifient vraiment pour vous.",
      "Revoyez les accès deux fois par an : le partage s'accumule et rien ne vous le rappelle.",
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'what-guests-can-do-to-your-event'],
  },

  'why-a-shared-calendar-does-not-appear': {
    title: "Un agenda a été partagé avec vous et il n'est pas là",
    short: "Agenda partagé qui n'apparaît pas",
    description:
      "Quelqu'un a partagé un agenda, vous avez accepté, et rien n'a changé. Les quatre raisons ordinaires, dans l'ordre où les vérifier.",
    lede: "L'invitation est arrivée, le lien a été touché, et l'agenda manque toujours. C'est presque toujours l'une de quatre choses, et aucune n'est un partage cassé.",
    commonBelief: "Qu'accepter un agenda partagé le met sur votre téléphone.",
    sections: [
      {
        heading: "Accepter l'ajoute à un compte, pas à un appareil",
        body: [
          "Un partage atterrit dans le compte Google auquel il était adressé. Si vous avez accepté connecté à un compte et que votre téléphone en porte un autre, l'agenda est sagement posé là où vous ne regardez pas.",
          "Même dans le bon compte, un agenda fraîchement ajouté arrive désactivé sur les autres appareils plus souvent qu'activé. Il existe, il n'est simplement pas coché — et un agenda décoché ressemble exactement à un agenda absent.",
        ],
      },
      {
        heading: 'Les deux autres raisons',
        body: [
          "Un partage vers une liste de diffusion ou une adresse de groupe atteint rarement les individus ; il faut l'adresse qui est réellement un compte Google. Et un agenda partagé par lien est un abonnement : il se range ailleurs dans la liste et se rafraîchit au rythme de l'éditeur, pas instantanément.",
          "Sur iPhone, les agendas Google atteignent l'app intégrée par une liste de synchronisation qui leur est propre, et les agendas secondaires en sont exclus par défaut. D'où un compte qui montre son agenda principal et laisse tomber en silence les quatre qui comptent.",
        ],
      },
    ],
    claims: {
      refreshHint: "Heures entre deux demandes d'actualisation d'un flux abonné",
      accounts: 'Types de comptes réunis dans une seule vue, sans rien de tout cela',
    },
    practical: [
      "Vérifiez quel compte a accepté le partage avant toute autre chose.",
      "Ouvrez la liste des agendas sur l'appareil et cherchez-le désactivé plutôt qu'absent.",
      "S'il est venu par lien, attendez un délai plutôt qu'une apparition immédiate.",
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'google-calendars-that-never-reach-your-iphone'],
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
    practical: [
      "Lisez la liste complète des accès, pas seulement le nom que vous vouliez retirer.",
      "Réinitialisez l'adresse secrète si la personne l'a eue un jour.",
      'Supposez que les copies survivent : déplacez ce qui est vraiment sensible au lieu de le cacher.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
