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
    title: 'Uma agenda que já traz a previsão dentro',
    short: 'A previsão dentro da agenda',
    description:
      'Por que consultar dois aplicativos para organizar um dia é uma falha de projeto, e como é uma agenda em que a previsão faz parte da vista em vez de ficar ao lado.',
    lede: 'Quase todo mundo organiza o dia entre dois aplicativos. A agenda diz onde é preciso estar; o de previsão diz que tempo fará na hora. Segurar as duas coisas na cabeça é a parte que ninguém percebe que faz, até um sábado se perder.',
    commonBelief:
      'Que agenda serve para compromissos e aplicativo de previsão serve para o tempo, e que mantê-los separados é simplesmente como os telefones funcionam.',
    sections: [
      {
        heading: 'O custo de dois aplicativos não são dois toques',
        body: [
          'Trocar de aplicativo não custa nada. Caro é que os dois nunca concordam sobre o que importa. Sua agenda sabe que no sábado há duas horas ocupadas às onze; o aplicativo de previsão sabe que chove das dez à uma. Nenhum dos dois sabe que esses dois fatos juntos significam mover o bloco.',
          'A camada de integração é você. Isso funciona até você ficar ocupado, que é exatamente quando proteger os planos mais vale a pena.',
        ],
      },
      {
        heading: 'O que muda quando a previsão está na grade',
        body: [
          'Ponha a previsão atrás dos compromissos e o conflito se resolve sozinho. Uma manhã úmida e uma tarde seca aparecem no mesmo olhar que a reunião que você ia marcar, e a decisão deixa de custar pensamento.',
          'Isto não é um widget colado ao lado. Cada dia das vistas de semana e mês carrega suas próprias condições, e cada compromisso carrega a previsão das horas que ele de fato ocupa — não o resumo do dia, que faz a média justamente da parte de que você precisava.',
        ],
      },
    ],
    claims: {
      forecastDays: 'Dias de previsão, na agenda e ao lado de cada compromisso',
      views: 'Vistas que trazem a previsão: Dia, Semana, Mês, Ano e Lista',
      price: 'Quanto custam os recursos de previsão',
    },
    practical: [
      'Olhe a faixa atrás dos dias na vista de semana antes de marcar qualquer coisa ao ar livre.',
      'Toque num compromisso para ver a previsão das horas dele, não a do dia.',
      'Marque o que depende do tempo primeiro contra os catorze dias e ajuste dois dias antes.',
      'Trate tudo além do sétimo dia como uma forma, não como um plano.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view', 'what-a-subscription-actually-buys'],
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
    title: 'O que uma assinatura realmente compra',
    short: 'O que uma assinatura compra',
    description: 'Dois planos pagos, o que os separa, e como saber qual — se algum — é o seu.',
    lede: 'Dois planos bastam para confundir se ninguém diz claramente o que os separa. O que os separa é a Microsoft.',
    commonBelief: 'Que o plano superior são os mesmos recursos, só que mais.',
    sections: [
      {
        heading: 'O primeiro plano tira a publicidade',
        body: [
          'Ele também acrescenta gerenciar compromissos entre agendas do iCloud e do Google, permissões de compartilhamento do Google, links do Meet automáticos e atualização de previsão mais rápida. Mas se compra pela publicidade.',
          'A esse preço é mais ou menos um café por ano, e é o plano que serve a quase todo mundo disposto a pagar alguma coisa.',
        ],
      },
      {
        heading: 'O segundo plano é para a Microsoft',
        body: [
          'Sincronização com Outlook e Exchange, links do Teams, gerenciamento entre contas incluindo o trabalho, gerenciamento de participantes. Custa uma ordem de grandeza a mais porque a conexão também custa.',
          'Se sua agenda de trabalho não é da Microsoft, esse plano não tem nada para você. Os dois planos saem mais baratos no ano; a economia é moderada, não espetacular. Depois de cancelar você fica no gratuito e suas agendas ficam intactas, porque os compromissos nunca foram nossos.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Primeiro plano, por mês, em dólares',
      advancedYearly: 'Primeiro plano, por ano, em dólares',
      premiumMonthly: 'Segundo plano, por mês, em dólares',
      premiumYearly: 'Segundo plano, por ano, em dólares',
    },
    practical: [
      'Compre o primeiro plano para tirar a publicidade, não para destravar a agenda.',
      'Compre o segundo só se seu trabalho vive na Microsoft.',
      'Passe para o anual quando tiver certeza; a economia é real, mas pequena.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view'],
  },
};
