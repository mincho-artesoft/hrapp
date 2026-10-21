import { LocalisedArticle } from '../types';

/** Os seis artigos sobre o Google: perguntas concretas, respostas claras. */
export const GOOGLE_PT_BR: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
  "title": "Permissões do Google Agenda: confira o acesso que você concede",
  "short": "Acesso e privacidade no Google Agenda",
  "description": "Escolha acesso à disponibilidade, aos detalhes ou à edição no Google Agenda. Antes de compartilhar, confira também acessos públicos e por grupos.",
  "lede": "Antes de compartilhar um calendário, defina o que a outra pessoa precisa fazer. Consultar sua disponibilidade, ler detalhes e manter a agenda são tarefas diferentes. Este guia é publicado pela Arte Soft, desenvolvedora do Cloud Calendars.",
  "commonBelief": "Restringir uma pessoa garantiria que ela não veja detalhes por nenhum outro caminho.",
  "sections": [
    {
      "heading": "Combine a permissão com a tarefa",
      "body": [
        "Um colega que procura um horário pode precisar apenas da disponibilidade, sem os detalhes dos compromissos. Quem mantém a programação de um projeto precisa de outro tipo de acesso. Defina a tarefa e depois confira a permissão nas configurações atuais de compartilhamento.",
        "O Google diferencia disponibilidade, detalhes e vários níveis de edição. Uma opção limita o acesso a eventos privados; outra permite editar eventos e consultar detalhes; a mais ampla também permite administrar o compartilhamento. Não trate todas as opções que mencionam alterações como equivalentes."
      ]
    },
    {
      "heading": "Confira o acesso geral, além do acesso individual",
      "body": [
        "Verifique se o calendário é público, está disponível para a organização ou é compartilhado com grupos, além das pessoas nomeadas. O Google informa que o acesso mais amplo pode prevalecer: restringir uma pessoa não desfaz detalhes já publicados.",
        "Pense em uma programação de clube publicada para os membros. Antes de incluir um compromisso pessoal, confira o público do calendário, sem presumir que a permissão ao lado de um amigo seja a única configuração relevante. Guarde compromissos privados no destino adequado."
      ]
    },
    {
      "heading": "Use as configurações do calendário correto no Google",
      "body": [
        "No Google Agenda em um computador, localize o calendário, abra seu menu e acesse as configurações de compartilhamento. O Google documenta áreas separadas para pessoas ou grupos e acesso mais amplo. Confira o nome do calendário e a conta conectada antes de alterar algo.",
        "Confirme a identidade Google pretendida do destinatário ao convidá-lo. Se ele não encontrar o calendário, verifique o endereço e a mensagem de convite, em vez de ampliar o acesso para fazê-lo aparecer. Falta de exibição e falta de permissão para editar são problemas diferentes."
      ]
    },
    {
      "heading": "Teste sem usar compromissos privados",
      "body": [
        "Crie um compromisso de teste sem título, notas, local ou lista de convidados privados. Peça ao destinatário que confirme o que consegue ver e, somente quando necessário e permitido, o que consegue editar. Não compartilhe as credenciais da sua conta para fazer esse teste.",
        "Anote o calendário e a função concedida, depois confira o resultado ao mudar a configuração. Isso verifica o acesso pretendido, mas não comprova que informações já lidas ou copiadas desapareceram. Não teste publicando uma agenda real de trabalho."
      ]
    },
    {
      "heading": "Separe políticas de trabalho dos planos do aplicativo",
      "body": [
        "O Google informa que administradores de empresas ou escolas podem restringir o compartilhamento. Se uma configuração não estiver disponível, use o caminho aprovado pela organização. Não publique informações de trabalho para contornar uma restrição da conta.",
        "O Cloud Calendars pode mostrar calendários conectados, mas os nomes dos planos não redefinem permissões do Google. Advanced remove anúncios; não é um pagamento que concede a outra pessoa acesso a todos os eventos. Confira o compartilhamento no provedor e o resultado aceito, sem depender apenas de um editor local disponível."
      ]
    },
    {
      "heading": "Revise e remova acessos desnecessários",
      "body": [
        "Ao terminar um projeto, confira destinatários, grupos e qualquer publicação mais ampla. Remover uma pessoa é apenas parte da revisão quando existem outros caminhos de acesso. Combine quem mantém a programação e como futuras alterações de acesso serão tratadas.",
        "O Google documenta separadamente a remoção de pessoas ou grupos e a desativação do compartilhamento mais amplo. Remover acesso não recupera arquivos exportados, capturas de tela ou informações copiadas. Trate isso separadamente com os envolvidos, sem prometer que uma opção apaga todas as cópias anteriores."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifique o calendário e a tarefa do destinatário.",
    "Confira acessos individuais, por grupo, da organização e públicos.",
    "Escolha a permissão adequada nas configurações atuais do Google.",
    "Verifique a identidade do destinatário antes de alterar acessos.",
    "Confira um evento de teste inofensivo pelo lado do destinatário.",
    "Revise caminhos de acesso antigos sem presumir que cópias anteriores serão recuperadas."
  ],
  "faq": [
    {
      "q": "Uma restrição individual prevalece sobre um calendário público?",
      "a": "Não. O Google informa que permissões mais amplas prevalecem quando configurações entram em conflito. Revise as opções públicas e da organização, além da entrada individual."
    },
    {
      "q": "Todas as permissões de edição expõem eventos privados da mesma forma?",
      "a": "Não. O Google documenta uma opção de edição que limita acesso a eventos privados, separada das demais opções de edição e administração. Leia a permissão atual exata antes de escolher."
    },
    {
      "q": "Comprar Advanced altera os direitos de compartilhamento do Google?",
      "a": "Não. Advanced remove anúncios no Cloud Calendars. O acesso no provedor depende das permissões do calendário e das restrições da organização."
    }
  ],
  "sourcesHeading": "Orientações atuais do Google sobre permissões e compartilhamento",
  "sources": [
    {
      "label": "Google: escolher permissões do calendário",
      "url": "https://support.google.com/calendar/answer/15716974?hl=en"
    },
    {
      "label": "Google: compartilhar um calendário e remover acesso",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    }
  ],
  "seeAlso": [
    "why-a-shared-calendar-does-not-appear",
    "sharing-one-event-not-your-calendar",
    "taking-back-a-calendar-you-shared"
  ],
  "updated": "2026-10-21"
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
  "title": "Endereço iCal secreto do Google: assinar não é compartilhar",
  "short": "O endereço iCal secreto",
  "description": "Entenda o endereço iCal secreto, a conexão de conta e os feeds compartilhados. Saiba lidar com um endereço exposto e com cópias já salvas.",
  "lede": "Um endereço de calendário, uma conexão de conta e um convite têm funções diferentes. Identifique o que você recebeu antes de levar a programação a outro aplicativo. Este guia é publicado pela Arte Soft, desenvolvedora do Cloud Calendars.",
  "commonBelief": "Um endereço secreto é um convite pessoal que pode ser revogado para apenas um destinatário.",
  "sections": [
    {
      "heading": "Escolha a conexão conforme a tarefa",
      "body": [
        "O Google distingue o login em outro aplicativo de calendário da visualização por um endereço iCal secreto. A conexão de conta pode permitir edição; o endereço oferece uma assinatura somente para leitura. O Google descreve o endereço secreto como destinado ao uso pessoal e recomenda não compartilhá-lo com outras pessoas.",
        "Por exemplo, mostrar sua própria agenda de trabalho em outro calendário compatível é diferente de dar acesso contínuo a um colega. Comece pelo objetivo: consultar sua agenda, colaborar com uma pessoa específica ou distribuir uma programação para um público. Não escolha uma URL apenas porque é fácil colá-la."
      ]
    },
    {
      "heading": "Confira o calendário, não apenas a conta",
      "body": [
        "No computador, as instruções do Google colocam o endereço secreto no formato iCal nas configurações de integração do calendário escolhido. Confira primeiro o nome do calendário. Administradores de trabalho ou escola podem restringir essa opção; a ausência do endereço não é motivo para publicar o calendário.",
        "Não inclua o endereço em capturas de tela, publicações públicas de suporte ou notas compartilhadas. Ao pedir ajuda, descreva o tipo de conta, o nome do calendário e a conexão sem fornecer a URL. Normalmente, o suporte precisa identificar a forma de conexão antes de precisar do conteúdo dos eventos."
      ]
    },
    {
      "heading": "Verifique o que o aplicativo de destino adicionou",
      "body": [
        "Uma assinatura acompanha um feed; um arquivo importado cria uma cópia separada. Leia as instruções do aplicativo de destino e confirme qual ação está realizando. Abrir um arquivo de calendário baixado não significa que os compromissos resultantes acompanharão mudanças futuras.",
        "Compare o nome do calendário, a data e os detalhes usando um evento comum, sem informações sensíveis, que você já reconheça. Evite criar uma segunda assinatura para investigar a primeira: duas cópias visíveis podem fazer uma atualização atrasada parecer um conflito. Oculte temporariamente um calendário para identificar a origem."
      ]
    },
    {
      "heading": "Separe os links do Google dos links do Cloud Calendars",
      "body": [
        "O Cloud Calendars tem suas próprias formas de compartilhar eventos e calendários, incluindo feeds de assinatura. Eles não são endereços secretos do Google. Antes de escolher como abrir, determine se o remetente compartilhou um evento, um calendário ou um convite associado a uma conta.",
        "Um destinatário do Cloud Calendars pode ter a função Reader, Writer ou Owner. Um endereço de feed, por si só, não comprova permissão para editar. Da mesma forma, receber um endereço de visualização do Google não torna você proprietário do calendário. Pergunte ao remetente em qual sistema as alterações devem ser feitas."
      ]
    },
    {
      "heading": "Considere como o calendário de destino atualiza os dados",
      "body": [
        "Uma assinatura não promete entrega imediata. Os feeds do Cloud Calendars incluem um intervalo de atualização sugerido, mas o aplicativo de destino decide quando buscar e exibir mudanças. Um horário antigo em um dispositivo não prova, sozinho, que o organizador deixou de salvar a alteração.",
        "Para uma reunião no mesmo dia, compare com a programação atual do organizador e confirme mudanças importantes diretamente. Anote qual calendário ainda mostra os dados antigos e quando você verificou. Não importe o evento repetidamente nem exclua o calendário de origem para tentar forçar a atualização."
      ]
    },
    {
      "heading": "Responda à exposição sem prometer recolher todas as cópias",
      "body": [
        "O Google orienta redefinir um endereço secreto divulgado, invalidando o antigo e criando um substituto. Identifique seus aplicativos que o utilizam para atualizar as assinaturas depois. Redefinir um endereço é diferente de remover um colaborador específico.",
        "Compromissos salvos, exportações e capturas de tela anteriores são outra questão. A troca do link não demonstra que todas as cópias antigas desapareceram. Se você enviou informações ao público errado, considere o conteúdo e os destinatários reais, sem tratar a redefinição bem-sucedida como prova de remoção completa."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifique se você tem uma conexão de conta, convite, assinatura ou arquivo.",
    "Confira o calendário de origem antes de copiar um endereço.",
    "Reserve o endereço secreto do Google para seus próprios aplicativos compatíveis.",
    "Verifique se o aplicativo assinou o calendário em vez de importar uma cópia.",
    "Confirme mudanças urgentes com o organizador, sem depender do prazo de atualização.",
    "Se o endereço foi exposto, siga a redefinição do Google e atualize as conexões desejadas."
  ],
  "faq": [
    {
      "q": "Posso dar o endereço secreto a um colega?",
      "a": "O Google recomenda reservá-lo aos seus próprios aplicativos. Para dar acesso a outra pessoa, use os controles de compartilhamento e escolha a permissão adequada."
    },
    {
      "q": "Uma assinatura permite editar o original?",
      "a": "O endereço iCal secreto do Google serve para visualização. Editar exige conexão de conta e permissão apropriadas; as funções de compartilhamento do Cloud Calendars são outro mecanismo."
    },
    {
      "q": "Redefinir o endereço apaga os compromissos antigos em todos os lugares?",
      "a": "A redefinição invalida o endereço antigo do Google. Isso não comprova a remoção de arquivos, compromissos ou capturas de tela salvos separadamente."
    }
  ],
  "sourcesHeading": "Orientações dos provedores e leitura complementar",
  "sources": [
    {
      "label": "Google: conexões de conta e endereços iCal secretos",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    },
    {
      "label": "Google: compartilhar um calendário",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: importar, assinar e aguardar atualizações",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "updated": "2026-10-21",
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "taking-back-a-calendar-you-shared",
    "sharing-one-event-not-your-calendar"
  ]
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
  "title": "Como deixar de compartilhar um calendário e conferir os acessos restantes",
  "short": "Revisar e remover acessos",
  "description": "Encerre o compartilhamento distinguindo pessoas, grupos, acesso público e links de assinatura. Confira as alterações e entenda por que cópias podem permanecer.",
  "lede": "Para encerrar uma colaboração, primeiro identifique como o acesso foi concedido. Remover uma pessoa, desativar a publicação e redefinir um endereço de assinatura são ações diferentes. Este guia é publicado pela Arte Soft, desenvolvedora do Cloud Calendars.",
  "commonBelief": "Remover um destinatário recolhe imediatamente todas as cópias e fecha qualquer outro acesso ao calendário.",
  "sections": [
    {
      "heading": "Identifique o calendário e a forma de compartilhamento",
      "body": [
        "Antes de alterar o acesso, confirme a conta proprietária, o calendário e o público pretendido. Compartilhar um calendário Google com um colega específico é diferente de publicá-lo, conceder acesso a um grupo ou fornecer um endereço de assinatura. O Cloud Calendars também possui formas próprias de compartilhar eventos e calendários.",
        "Por exemplo, a secretaria de um clube pode receber uma permissão individual para editar, enquanto os associados acompanham uma programação publicada. Remover essa permissão individual não define o que deve acontecer com as assinaturas dos associados. Liste os compartilhamentos que você realmente criou."
      ]
    },
    {
      "heading": "Remova a permissão correta no Google",
      "body": [
        "O Google oferece controles separados para pessoas ou grupos específicos, compartilhamento com a organização e acesso público. No computador, abra as configurações de compartilhamento do calendário correto e altere a entrada ou configuração correspondente. Confira primeiro a conta conectada e o nome do calendário.",
        "Uma pessoa ainda pode ter acesso por um grupo ou pela publicação mais ampla. Revise o conjunto de permissões em vez de remover repetidamente o mesmo endereço de e-mail. Políticas de trabalho ou escola podem limitar os controles disponíveis; quando necessário, siga o procedimento aprovado pelo proprietário ou administrador."
      ]
    },
    {
      "heading": "Trate o endereço secreto separadamente",
      "body": [
        "O Google informa que o endereço iCal secreto é para uso pessoal em outro aplicativo de calendário e não deve ser entregue a outras pessoas. Se ele foi divulgado, a orientação é redefini-lo para invalidar o endereço antigo. Isso é diferente de remover uma pessoa identificada.",
        "Antes de alterar um endereço de assinatura que você utiliza, identifique os aplicativos e serviços que dependem dele para reconectar os desejados depois. Não cole a URL secreta em uma publicação pública de suporte nem a envie para provar que encontrou o calendário. Informe o nome do calendário e o tipo de conexão."
      ]
    },
    {
      "heading": "Diferencie destinatários e links do Cloud Calendars",
      "body": [
        "No Cloud Calendars, o acesso de destinatários a um evento ou calendário e um feed de assinatura emitido são mecanismos distintos. Confira o compartilhamento real e o link correspondente antes de agir. Remover um destinatário identificado não garante o recolhimento de todas as URLs distribuídas ou cópias independentes.",
        "Se um coorganizador só precisa deixar de editar, avalie a função desejada e quem deve continuar com acesso, em vez de excluir a programação. Se a colaboração inteira terminou, determine quem é o proprietário e quem deve manter o calendário. Sair de um calendário recebido e excluir um calendário próprio são decisões diferentes."
      ]
    },
    {
      "heading": "Confira o resultado sem prometer desaparecimento imediato",
      "body": [
        "Confira se a alteração foi salva no sistema proprietário. Se um colega autorizado puder ajudar, confirme o resultado de visualização ou edição pela conta dele, sem compartilhar senhas. Diferencie uma recusa de acesso de um evento antigo que ainda aparece em uma cópia importada ou em cache.",
        "Não prometa um intervalo universal de atualização nem ausência de notificações. Ao passar a responsabilidade para outro grupo, informe qual programação deverá ser usada. Um registro antigo visível não revela, sozinho, se a pessoa mantém acesso ativo, recebeu outra permissão ou guardou uma cópia independente."
      ]
    },
    {
      "heading": "Cuide das cópias anteriores separadamente",
      "body": [
        "Arquivos exportados, capturas de tela, mensagens e compromissos salvos separadamente podem permanecer após a mudança de acesso. Decida quais cópias importam para a transição e converse com os envolvidos sobre como tratá-las. Alterar uma permissão não permite saber tudo o que cada destinatário já salvou.",
        "Preserve os registros de origem necessários enquanto confere o resultado. Não transfira reuniões confidenciais para outro calendário compartilhado apenas para esvaziar o antigo, nem cancele convites reais para testar o acesso. Registre o calendário, a forma de acesso e a alteração para facilitar investigações futuras."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifique a conta proprietária, o calendário e a forma de compartilhamento.",
    "Revise separadamente pessoas, grupos e publicação mais ampla.",
    "Use os controles adequados do Google ou do Cloud Calendars.",
    "Decida separadamente se um endereço secreto divulgado precisa ser redefinido.",
    "Confira o acesso após salvar, sem compartilhar credenciais.",
    "Trate exportações e cópias anteriores separadamente do acesso ativo."
  ],
  "faq": [
    {
      "q": "Remover uma pessoa desativa o calendário público ou seu acesso por grupo?",
      "a": "Não presuma isso. Confira cada forma de acesso. O Google trata destinatários específicos, grupos e publicação mais ampla em configurações separadas."
    },
    {
      "q": "O calendário desaparecerá imediatamente e sem avisos?",
      "a": "Não há uma garantia universal de desaparecimento, notificações ou prazo de atualização. Confirme a alteração salva e diferencie acesso ativo de dados importados ou em cache."
    },
    {
      "q": "É preciso comprar o Advanced para remover o acesso a um calendário Google?",
      "a": "O Advanced remove anúncios no Cloud Calendars. Os controles de compartilhamento do Google dependem da propriedade, das permissões e das regras da organização, não desse plano."
    }
  ],
  "sourcesHeading": "Orientações sobre acesso e assinaturas",
  "sources": [
    {
      "label": "Google: controles de compartilhamento e remoção de acesso",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Google: sincronização de contas e endereços iCal secretos",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    }
  ],
  "updated": "2026-10-21",
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "the-secret-address-of-a-google-calendar"
  ]
},
};
