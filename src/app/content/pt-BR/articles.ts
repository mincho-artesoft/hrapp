import { LocalisedArticle } from '../types';

/**
 * The four articles this language carries.
 *
 * Chosen one per intent -- weather, one view, sharing, price -- so the language
 * answers a whole question rather than a quarter of four. The numbers are not
 * here: they live once in article-facts.ts and join the prose by id, so a
 * translation can rewrite every sentence without touching a figure.
 */
export const ARTICLES_PT_BR: Readonly<Record<string, LocalisedArticle>> = {
  'weather-inside-your-calendar': {
  "title": "Uma agenda que já traz a previsão dentro",
  "short": "A previsão dentro da agenda",
  "description": "Por que consultar dois aplicativos para organizar um dia é uma falha de projeto, e como é uma agenda em que a previsão faz parte da vista em vez de ficar ao lado.",
  "lede": "Quase todo mundo organiza o dia entre dois aplicativos. A agenda diz onde é preciso estar; o de previsão diz que tempo fará na hora. Segurar as duas coisas na cabeça é a parte que ninguém percebe que faz, até um sábado se perder.",
  "commonBelief": "Que agenda serve para compromissos e aplicativo de previsão serve para o tempo, e que mantê-los separados é simplesmente como os telefones funcionam.",
  "sections": [
    {
      "heading": "O custo de dois aplicativos não são dois toques",
      "body": [
        "Trocar de aplicativo não custa nada. Caro é que os dois nunca concordam sobre o que importa. Sua agenda sabe que no sábado há duas horas ocupadas às onze; o aplicativo de previsão sabe que chove das dez à uma. Nenhum dos dois sabe que esses dois fatos juntos significam mover o bloco.",
        "A camada de integração é você. Isso funciona até você ficar ocupado, que é exatamente quando proteger os planos mais vale a pena."
      ]
    },
    {
      "heading": "A previsão disponível",
      "body": [
        "O Cloud Calendars usa a previsão disponível para o local selecionado. Dados horários e diários podem abranger períodos diferentes.",
        "As datas que você pode consultar no calendário não determinam o alcance da previsão. A visualização mensal não significa previsão para o mês inteiro ou para cada evento."
      ]
    }
  ],
  "claims": {
    "price": "Quanto custam os recursos de previsão"
  },
  "practical": [
    "Confira o local, a data e as horas disponíveis antes de planejar com a previsão."
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-a-subscription-actually-buys"
  ],
  "updated": "2026-10-21"
},

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google e Outlook em uma só vista',
    short: 'Três contas, uma vista',
    description:
      'A vida de quase todo mundo está repartida entre uma agenda pessoal da Apple, uma conta do Google e um Exchange do trabalho. O que muda ao colocá-los na mesma grade.',
    lede: 'O problema quase nunca é que alguma dessas agendas seja ruim. É que você tem três e uma só semana.',
    commonBelief:
      'Que manter trabalho e vida pessoal em aplicativos separados é uma fronteira, e não um defeito.',
    sections: [
      {
        heading: 'Marcar duas coisas no mesmo horário é estrutural',
        body: [
          'Se seus compromissos vivem em três lugares, nenhum lugar pode dizer se você está livre. O passo de fusão é você, e você o executa de memória, em geral enquanto alguém espera resposta.',
          'Por isso a falha clássica não é esquecer um compromisso; é aceitar algo que colide com um compromisso que você não podia ver.',
        ],
      },
      {
        heading: 'O que uma grade só entrega',
        body: [
          'Todas as contas na mesma semana, coloridas pela origem, editáveis ali mesmo. Você para de se perguntar qual aplicativo tem a resposta, porque a pergunta deixa de estar no plural.',
          'iCloud e Google sincronizam no plano gratuito. As contas Microsoft — Outlook e Exchange — ficam no pago, porque essa conexão tem um custo recorrente que as outras não têm.',
        ],
      },
    ],
    claims: {
      accounts: 'Tipos de conta que cabem numa vista',
      premiumMonthly: 'Custo mensal para acrescentar a Microsoft, em dólares',
    },
    practical: [
      'Acrescente primeiro a conta pessoal e depois a que provoca as colisões.',
      'Colora por conta e não por categoria: a origem é o que se precisa ver de relance.',
      'Continue escrevendo na agenda que as outras pessoas já leem.',
    ],
    seeAlso: ['weather-inside-your-calendar', 'what-a-subscription-actually-buys'],
  },

  'sharing-one-event-not-your-calendar': {
    title: 'Compartilhar um compromisso, não a agenda',
    short: 'Compartilhar um compromisso',
    description:
      'Como funciona enviar um único compromisso, o que a outra pessoa realmente recebe e por que ela não precisa instalar nada para ver.',
    lede: 'Compartilhar uma agenda costuma ser tudo ou nada: ou alguém tem acesso à sua ou não tem. Enviar um jantar não deveria exigir nenhuma das duas coisas.',
    commonBelief:
      'Que compartilhar um compromisso significa dar a alguém uma janela para o resto da sua semana.',
    sections: [
      {
        heading: 'O que de fato é enviado',
        body: [
          'Ao criar um compromisso, o aplicativo oferece compartilhá-lo. O que viaja é um link — por e-mail, por mensagem, pelo que a pessoa tiver — e atrás desse link há um canal de agenda que contém aquele compromisso e mais nada.',
          'Não é uma captura de tela nem uma cópia que envelhece. Se o horário mudar, o canal muda junto, e quem recebeu vê a mudança sem que você reenvie nada.',
        ],
      },
      {
        heading: 'O que não é',
        body: [
          'O link é uma assinatura de agenda comum: o Calendário da Apple lê, o Google Agenda lê, o Outlook lê. Na mensagem vai também um App Clip para quem quiser o aplicativo — ele abre sem instalar nada. É uma porta, não um pedágio.',
          'Não é instantâneo: o canal pede aos aplicativos que voltem a olhar a cada hora, e isso é um pedido, não uma regra. Também não é secreto: o link carrega vinte e dois caracteres aleatórios, que ninguém adivinha, mas quem o tiver pode ler. E, por ora, é somente leitura.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Horas entre os pedidos de atualização do canal',
      linkLength: 'Caracteres aleatórios do link, que é o que o torna inadivinhável',
      sharePrice: 'Quanto custa compartilhar',
    },
    practical: [
      'Compartilhe a partir do próprio compromisso, logo depois de criá-lo.',
      'Mande o link pelo canal que você já usa com aquela pessoa.',
      'Se o horário mudar em cima da hora, escreva além de mover o compromisso.',
      'Revogue o link quando o compromisso passar, como deixaria de compartilhar um documento.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'weather-inside-your-calendar'],
  },

  'what-a-subscription-actually-buys': {
  "updated": "2026-10-21",
  "title": "O que uma assinatura realmente compra",
  "short": "O que uma assinatura compra",
  "description": "O que uma assinatura compra: Base, Advanced, Premium.",
  "lede": "Este guia é publicado pela Arte Soft, desenvolvedora do Cloud Calendars.",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "Base inclui sincronização com Google Calendar, Google Meet, visualizações do calendário, clima e widgets. O plano gratuito pode exibir anúncios."
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Advanced inclui Base e remove os anúncios. Premium inclui Advanced e adiciona Microsoft Calendar e Microsoft Teams.",
        "Uma assinatura não concede permissão para editar calendários de outras pessoas nem contorna restrições de uma conta de trabalho."
      ]
    },
    {
      "heading": "Informações de compra e cancelamento",
      "body": [
        "Antes de comprar, confira o preço local, o período de cobrança e os termos de renovação.",
        "Para uma assinatura cobrada pela Apple, abra Ajustes → seu nome → Assinaturas. Confira o status e a data de vencimento. Cancelar a renovação é diferente de excluir o app ou os dados do calendário; não presuma que os recursos pagos continuam disponíveis após o vencimento."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Antes de comprar, confira o preço local, o período de cobrança e os termos de renovação.",
    "Uma assinatura não concede permissão para editar calendários de outras pessoas nem contorna restrições de uma conta de trabalho."
  ],
  "faq": [
    {
      "q": "Como interrompo a renovação?",
      "a": "Para uma assinatura cobrada pela Apple, abra Ajustes → seu nome → Assinaturas. Confira o status e a data de vencimento. Cancelar a renovação é diferente de excluir o app ou os dados do calendário; não presuma que os recursos pagos continuam disponíveis após o vencimento."
    }
  ],
  "sourcesHeading": "Informações de compra e cancelamento",
  "sources": [
    {
      "label": "Apple: Como interrompo a renovação?",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view"
  ]
},
};
