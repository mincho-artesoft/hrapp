import { LocalisedArticle } from '../types';

/** Os seis artigos sobre o Google: perguntas concretas, respostas claras. */
export const GOOGLE_PT_BR: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
    title: 'Quem vê o quê quando você compartilha uma agenda do Google',
    short: 'Permissões de compartilhamento',
    description:
      'Os níveis de compartilhamento do Google são rápidos de definir e fáceis de entender errado. O que cada um realmente expõe, em termos simples.',
    lede: 'Quase nenhum excesso de compartilhamento é erro de julgamento. É alguém escolhendo um nível que soava modesto e não era.',
    commonBelief: 'Que «ver apenas livre/ocupado» e «ver todos os detalhes» diferem pouco.',
    sections: [
      {
        heading: 'Os níveis estão mais distantes do que parecem',
        body: [
          'Livre/ocupado mostra blocos de tempo sem títulos. Todos os detalhes mostra títulos, locais, anotações e convidados — o que, na maioria das agendas, é uma parte considerável da sua vida.',
          'Fazer alterações permite editar. Gerenciar o compartilhamento permite entregar sua agenda a outras pessoas, e é esse que surpreende depois.',
        ],
      },
      {
        heading: 'Escolher sem pensar toda vez',
        body: [
          'Para colegas que só precisam marcar horários em volta de você, livre/ocupado é quase sempre a resposta certa e quase nunca a escolhida.',
          'Guarde os detalhes completos para agendas criadas para serem compartilhadas, não para aquela em que você vive.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Custo mensal do nível em que isso é gerenciado no app, em dólares',
    },
    faq: [
      {
        q: 'Dá para ver os títulos dos meus eventos se eu compartilhar só livre/ocupado?',
        a: 'Não. Livre/ocupado mostra blocos de tempo sem títulos, locais, anotações ou convidados. Só «ver todos os detalhes» expõe isso — e expõe tudo.',
      },
      {
        q: 'O que permite «fazer alterações e gerenciar o compartilhamento»?',
        a: 'Editar qualquer evento e entregar sua agenda a outras pessoas sem perguntar. É o único nível que deixa outra pessoa distribuir acesso.',
      },
      {
        q: 'Posso ver quem já tem acesso à minha agenda?',
        a: 'Sim, nas configurações de compartilhamento daquela agenda. Nada convida você a olhar e os compartilhamentos só se acumulam: revise a lista duas vezes por ano.',
      },
    ],
    practical: [
      'Use livre/ocupado como padrão para quem só precisa reservar um horário com você.',
      'Deixe «fazer alterações» para quem realmente agenda por você.',
      'Revise quem tem acesso duas vezes por ano: compartilhamentos se acumulam e nada avisa.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'what-guests-can-do-to-your-event'],
  },

  'why-a-shared-calendar-does-not-appear': {
    "updated": "2026-10-21",
    "title": "Compartilharam uma agenda com você e ela não está lá",
    "short": "Agenda compartilhada não aparece",
    "description": "Agenda compartilhada do Google não aparece? Confira a conta convidada, o grupo, a visibilidade e o tipo de link.",
    "lede": "Este guia é da Arte Soft, desenvolvedora do Cloud Calendars. Primeiro diferencie falta de acesso de uma agenda apenas oculta.",
    "commonBelief": "Que aceitar uma agenda compartilhada a coloca no seu telefone.",
    "sections": [
      {
        "heading": "Confira a conta e o grupo",
        "body": [
          "Compare o destinatário do convite com a conta Google no telefone e no navegador. Abra o link com a conta correta. O Google permite compartilhar com pessoas e Grupos do Google. Se o acesso vier de um grupo, peça ao administrador que confirme sua participação e ao proprietário da agenda que confira o grupo autorizado. Um e-mail encaminhado não concede permissão por si só."
        ]
      },
      {
        "heading": "Oculta, ausente ou restrita?",
        "body": [
          "Abra o menu do Google Agenda no iPhone ou iPad. Se a agenda estiver na lista, mas desmarcada, selecione-a. Se não estiver, peça ao proprietário para verificar o acesso: solicitar não é receber autorização. Regras do trabalho ou da escola podem limitar o compartilhamento. Compare a mesma conta no Google Agenda na web. Se funcionar lá, confira a conta conectada e as agendas selecionadas no outro app. Acesso somente para leitura não permite editar."
        ]
      },
      {
        "heading": "Identifique o link",
        "body": [
          "Um convite de compartilhamento também contém um link; nem todo link é uma assinatura ICS. Pergunte se ele concede acesso a uma agenda Google ou publica um feed somente para leitura. Segundo o Google, uma nova assinatura exige um navegador de computador; abrir uma agenda já compartilhada por e-mail é outra ação. A atualização do feed depende do serviço que o recebe. Não há prazo universal; confirme mudanças urgentes com o organizador."
        ]
      }
    ],
    "claims": {},
    "faq": [
      {
        "q": "Um Grupo do Google pode receber acesso?",
        "a": "Sim. Confira o grupo escolhido, sua participação e as restrições da organização. Um e-mail do grupo encaminhado não comprova acesso."
      },
      {
        "q": "Devo excluir e reconectar a conta?",
        "a": "Primeiro confira identidade, permissões e visibilidade e compare a agenda na web. Reconectar não concede permissões ausentes."
      }
    ],
    "practical": [
      "Confirme a conta convidada e a participação no grupo.",
      "Selecione a agenda se estiver na lista, mas oculta.",
      "Peça a verificação do acesso antes de alterar conexões."
    ],
    "sourcesHeading": "Fontes e informações adicionais",
    "sources": [
      {
        "label": "Google: Confira a conta e o grupo",
        "url": "https://support.google.com/calendar/answer/37082?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Oculta, ausente ou restrita?",
        "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Identifique o link",
        "url": "https://support.google.com/calendar/answer/37648?hl=en"
      }
    ],
    "seeAlso": [
      "who-can-see-what-in-google-calendar",
      "google-calendars-that-never-reach-your-iphone"
    ]
  },

  'the-secret-address-of-a-google-calendar': {
    title: 'O que o endereço secreto de uma agenda do Google realmente entrega',
    short: 'O endereço iCal secreto',
    description:
      'O Google oferece um endereço privado que mostra sua agenda inteira a quem o tiver. O que ele expõe e por que não dá para retirá-lo em silêncio.',
    lede: 'Nas configurações de toda agenda do Google há um link que mostra tudo o que ela contém. Sem login, sem permissão, sem registro de quem abriu.',
    commonBelief: 'Que um endereço privado é privado porque é difícil de achar.',
    sections: [
      {
        heading: 'Um link é uma senha que não dá para trocar para uma pessoa só',
        body: [
          'O endereço secreto carrega detalhes completos — títulos, horários, locais, anotações. Quem tem o link vê tudo, e não existe lista de quem tem.',
          'Sua única proteção é a parte aleatória do endereço. Isso protege de verdade contra adivinhação e nada contra um encaminhamento, uma tela compartilhada ou um documento que sobrevive ao emprego.',
        ],
      },
      {
        heading: 'Redefinir quebra para todo mundo',
        body: [
          'Você pode redefinir o endereço, e o antigo morre. Ele morre também para cada colega, cada painel e cada script que dependia dele em silêncio, sem aviso nenhum.',
          'É o argumento para nunca distribuir o endereço da agenda em que você vive. Publique uma agenda feita para isso e redefinir não custa nada.',
        ],
      },
    ],
    claims: {
      linkLength: 'Caracteres aleatórios que protegem um link de compartilhamento nosso',
      sharePrice: 'O que custa compartilhar um evento pelo app',
    },
    faq: [
      {
        q: 'O que alguém pode fazer com o endereço secreto da minha agenda?',
        a: 'Ver tudo o que há nela — títulos, horários, locais e anotações — sem login, sem permissão e sem deixar registro de que olhou.',
      },
      {
        q: 'Dá para retomar um endereço secreto de agenda?',
        a: 'Só redefinindo, o que mata o antigo para todo mundo de uma vez: colegas, painéis e qualquer script que se apoiava nele em silêncio, sem aviso.',
      },
      {
        q: 'Posso mandar o endereço secreto por e-mail para um colega?',
        a: 'Trate como público a partir do instante em que ele sai das suas mãos. A única proteção é ser difícil de adivinhar, e um encaminhamento anula justamente isso.',
      },
    ],
    practical: [
      'Trate o endereço secreto como público no instante em que ele sai das suas mãos.',
      'Nunca publique o endereço da agenda que você realmente usa.',
      'Redefina quando alguém sai, e avise quem vai ficar sem.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'taking-back-a-calendar-you-shared'],
  },

  'what-guests-can-do-to-your-event': {
    title: 'O que seus convidados podem fazer com um evento',
    short: 'Permissões dos convidados',
    description:
      'Três caixas decidem se um convidado pode mudar sua reunião, convidar estranhos ou ler a lista inteira. Elas ficam ligadas mais vezes do que se imagina.',
    lede: 'Convidar alguém dá mais do que um lugar e um horário. Em um evento comum do Google, o convidado costuma ver quem mais foi chamado e muitas vezes pode acrescentar gente.',
    commonBelief: 'Que um convidado só pode aceitar ou recusar.',
    sections: [
      {
        heading: 'As três caixas',
        body: [
          'Modificar o evento deixa o convidado mudar horário, local e título para todos. Raramente é o desejado e é fácil deixar ligado.',
          'Convidar outros permite adicionar pessoas que você nunca viu. Ver a lista de convidados mostra todos os chamados e suas respostas — tudo bem num time, constrangedor com um cliente, errado em qualquer coisa parecida com um grupo de clientes separados.',
        ],
      },
      {
        heading: 'Onde isso dá errado em silêncio',
        body: [
          'Um evento, muitos destinatários individuais, lista visível: agora cada um tem todos. Desmarcar essa caixa é a diferença entre uma reunião e uma agenda de contatos vazada.',
          'As configurações vivem no evento, não na conta, então voltam ao seu padrão toda vez e precisam ser pensadas nos eventos que importam, não uma vez só.',
        ],
      },
    ],
    claims: {
      sharePrice: 'O que custa enviar um único evento pelo app',
    },
    faq: [
      {
        q: 'Os convidados se veem entre si num convite do Google Agenda?',
        a: 'Por padrão, quase sempre sim. «Ver a lista de convidados» mostra todos os chamados e suas respostas: tudo bem num time, constrangedor com cliente, errado quando os convidados são clientes separados.',
      },
      {
        q: 'Um convidado pode mudar o horário da minha reunião?',
        a: 'Se «modificar o evento» estiver marcado, sim, e a mudança vale para todos. Raramente se quer isso e é fácil deixar ligado.',
      },
      {
        q: 'Como impeço que convidados chamem outras pessoas?',
        a: 'Desmarque «convidar outros» no próprio evento. Essas configurações pertencem ao evento e não à conta, então voltam ao seu padrão toda vez.',
      },
    ],
    practical: [
      'Desligue «ver a lista de convidados» em tudo que vai para pessoas que não se conhecem.',
      'Mantenha «modificar o evento» desligado, a menos que alguém realmente agende por você.',
      'Confira as caixas no evento, não nas configurações: é ali que elas moram.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'why-a-shared-calendar-does-not-appear'],
  },

  'google-calendars-that-never-reach-your-iphone': {
    title: 'Por que algumas agendas do Google nunca chegam ao iPhone',
    short: 'Agendas do Google sumidas no iPhone',
    description:
      'Uma conta do Google, várias agendas e só uma no telefone. A lista de sincronização que decide isso e o que fazer no lugar.',
    lede: 'Sua conta do Google guarda oito agendas. Seu iPhone mostra duas. Nada está quebrado: algo que você nunca viu escolheu por você.',
    commonBelief: 'Que adicionar uma conta do Google ao iPhone adiciona as agendas dela.',
    sections: [
      {
        heading: 'Uma lista que nunca te mostraram',
        body: [
          'O Google mantém, por aparelho, uma lista de quais agendas podem sincronizar, e as secundárias — as compartilhadas, as assinadas, as criadas para um projeto — ficam fora com frequência.',
          'Essa lista não está nos ajustes do iOS. Ela vive numa página do próprio Google, e é por isso que olhar no lugar óbvio não encontra nada errado e não muda nada.',
        ],
      },
      {
        heading: 'O outro caminho',
        body: [
          'Um app que fala direto com o Google não usa essa lista: mostra todas as agendas que a conta realmente tem, inclusive as que o telefone deixou cair sem dizer.',
          'Isso também junta as contas. Uma visão com o pessoal, o do trabalho e o compartilhado é o ponto; se o telefone teria sincronizado cada uma deixa de ser pergunta.',
        ],
      },
    ],
    claims: {
      accounts: 'Tipos de conta que uma única visão reúne',
      price: 'O que custa o lado do Google',
    },
    faq: [
      {
        q: 'Por que só algumas das minhas agendas do Google aparecem no iPhone?',
        a: 'O Google mantém, por aparelho, uma lista de quais agendas podem sincronizar, e as secundárias — compartilhadas, assinadas, criadas para um projeto — ficam fora com frequência.',
      },
      {
        q: 'Onde fica a configuração de sincronização do Google Agenda para iPhone?',
        a: 'Não nos ajustes do iOS. Ela mora numa página do próprio Google, e por isso procurar no lugar óbvio não acha nada e não muda nada.',
      },
      {
        q: 'Como vejo todas as minhas agendas do Google no iPhone?',
        a: 'Por um app que consulta o Google diretamente em vez de passar pela lista do aparelho. Ele mostra todas as agendas que a conta realmente tem, inclusive as que o telefone deixou de fora.',
      },
    ],
    practical: [
      'Confira a lista de sincronização do Google antes de achar que a conta quebrou.',
      'Conte com agendas assinadas e compartilhadas excluídas, não incluídas.',
      'Se você mantém mais do que duas agendas, leia-as por algo que consulte o Google diretamente.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'icloud-google-and-outlook-in-one-view'],
  },

  'taking-back-a-calendar-you-shared': {
    title: 'Retomar uma agenda que você compartilhou',
    short: 'Retirar o acesso',
    description:
      'Remover alguém de uma agenda interrompe o que vem depois. O que não faz é desfazer o que já aconteceu.',
    lede: 'Encerrar um acesso é um toque. Decidir se um toque basta leva um pouco mais, porque compartilhar deixa cópias.',
    commonBelief: 'Que remover uma pessoa remove o que ela viu.',
    sections: [
      {
        heading: 'O que para e o que fica',
        body: [
          'Remova alguém e a agenda some da lista dessa pessoa, na hora e sem aviso. Eventos futuros nunca chegam até ela.',
          'O que não volta: convites que ela já tem, eventos copiados para a agenda dela, qualquer coisa exportada e tudo para o que circulou um endereço secreto. O acesso acaba; a memória não.',
        ],
      },
      {
        heading: 'O que sobrevive à remoção',
        body: [
          'Se alguém já teve permissão para gerenciar o compartilhamento, pode ter adicionado outras pessoas. Remover essa pessoa deixa as outras no lugar — é assim que uma agenda acaba compartilhada com alguém que ninguém lembra de ter convidado.',
          'Leia a lista inteira em vez de apagar um nome, e faça isso na saída, não meses depois. Nada te lembra, e compartilhamentos só se acumulam.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Custo mensal do nível em que isso é gerenciado, em dólares',
    },
    faq: [
      {
        q: 'Remover alguém apaga o que essa pessoa já viu?',
        a: 'Não. Convites que ela já tem, eventos copiados para a agenda dela e tudo que foi exportado permanecem. O acesso acaba; as cópias não.',
      },
      {
        q: 'A pessoa é avisada de que retirei o acesso dela?',
        a: 'Não. A agenda some da lista dela na hora e sem mensagem.',
      },
      {
        q: 'Por que minha agenda ainda está compartilhada com alguém que nunca convidei?',
        a: 'Alguém com permissão para gerenciar o compartilhamento a adicionou. Remover essa pessoa deixa no lugar todas as que ela acrescentou — por isso se lê a lista inteira, não um nome.',
      },
    ],
    practical: [
      'Leia a lista completa de acesso, não só o nome que você queria tirar.',
      'Redefina o endereço secreto se a pessoa já o teve.',
      'Presuma que as cópias sobrevivem: mova o que é realmente sensível em vez de escondê-lo.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
