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
    title: 'Compartilharam uma agenda com você e ela não está lá',
    short: 'Agenda compartilhada não aparece',
    description:
      'Alguém compartilhou uma agenda, você aceitou e nada mudou. As quatro razões comuns, na ordem em que vale checar.',
    lede: 'O convite chegou, o link foi tocado e a agenda continua sumida. Quase sempre é uma de quatro coisas, e nenhuma delas é o compartilhamento estar quebrado.',
    commonBelief: 'Que aceitar uma agenda compartilhada a coloca no seu telefone.',
    sections: [
      {
        heading: 'Aceitar adiciona a uma conta, não a um aparelho',
        body: [
          'O compartilhamento cai na conta do Google para a qual foi endereçado. Se você aceitou logado em uma conta e seu telefone carrega outra, a agenda está guardada exatamente onde você não está olhando.',
          'Mesmo na conta certa, uma agenda recém-adicionada chega desligada nos outros aparelhos mais vezes do que ligada. Ela existe, só não está marcada — e uma agenda desmarcada é idêntica a uma agenda ausente.',
        ],
      },
      {
        heading: 'As outras duas razões',
        body: [
          'Compartilhar com uma lista de e-mails ou endereço de grupo raramente chega às pessoas; é preciso o endereço que de fato é uma conta do Google. E uma agenda compartilhada como link é uma assinatura: cai em outra parte da lista e atualiza no ritmo de quem publica, não na hora.',
          'No iPhone, as agendas do Google chegam ao app nativo por uma lista de sincronização própria, e as agendas secundárias ficam fora dela por padrão. Por isso uma conta mostra a agenda principal e descarta em silêncio as quatro que importam.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Horas entre os pedidos de atualização de um feed assinado',
      accounts: 'Tipos de conta que uma única visão reúne sem nada disso',
    },
    faq: [
      {
        q: 'Aceitei uma agenda compartilhada e ela não está no meu iPhone. Por quê?',
        a: 'O compartilhamento cai na conta do Google para a qual foi endereçado, e uma agenda recém-adicionada costuma chegar desligada nos outros aparelhos. Veja primeiro a conta, depois procure-a desmarcada, não ausente.',
      },
      {
        q: 'Compartilhar com um endereço de grupo funciona?',
        a: 'Raramente. Uma lista de e-mails quase não alcança as pessoas por trás dela. É preciso o endereço que é em si uma conta do Google.',
      },
      {
        q: 'Quanto tempo leva para uma agenda compartilhada aparecer?',
        a: 'O compartilhamento por permissão aparece assim que a lista atualiza. Uma agenda compartilhada como link é uma assinatura e segue o ritmo de quem publica.',
      },
    ],
    practical: [
      'Veja qual conta aceitou o compartilhamento antes de qualquer outra coisa.',
      'Abra a lista de agendas no aparelho e procure-a desligada, não ausente.',
      'Se veio como link, espere atraso em vez de aparição imediata.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'google-calendars-that-never-reach-your-iphone'],
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
