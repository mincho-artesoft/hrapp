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
  "month-view-on-a-bigger-screen": {
  "updated": "2026-10-22",
  "title": "Calendário mensal no iPad e iPhone: veja as datas e confira os detalhes",
  "short": "Use a visão mensal sem perder detalhes",
  "description": "Compare datas no iPad ou iPhone. Confira eventos ocultos, calendários selecionados e horários antes de mover compromissos compartilhados ou recorrentes.",
  "lede": "A visão mensal mostra em quais datas estão os compromissos. Ela é menos adequada para confirmar que um horário específico está livre. Escolha uma data no panorama geral e examine o dia e o evento antes de confirmar. Este guia é publicado pela Arte Soft, desenvolvedora do Cloud Calendars.",
  "commonBelief": "Uma grade mensal maior mostra todos os detalhes, e uma data aparentemente vazia prova que todos estão disponíveis.",
  "sections": [
    {
      "heading": "Decida se precisa comparar datas ou horários",
      "body": [
        "Use o mês para comparar um prazo de projeto, uma viagem e um compromisso familiar ao longo das semanas. Se a dúvida é se duas reuniões se sobrepõem às 14h30, mude para a visão diária ou semanal e confira início e término. Uma célula mensal não tem a mesma escala de uma grade horária.",
        "Por exemplo, quem escolhe a data de uma oficina pode primeiro evitar uma semana de viagem. Depois precisa verificar o dia proposto: compromissos, preparação, deslocamento e horário de término necessário. Uma célula aparentemente livre é uma possibilidade a investigar, não uma reserva confirmada nem prova de disponibilidade alheia."
      ]
    },
    {
      "heading": "Leia o indicador de eventos adicionais",
      "body": [
        "A célula mensal atual do Cloud Calendars mostra um número limitado de etiquetas de eventos e indica quantos outros pertencem à data. Os títulos ocupam uma linha e podem ser encurtados. Abra o dia ou o evento quando precisar do título completo ou dos compromissos restantes.",
        "A tela maior do iPad pode facilitar a leitura, mas não suponha que o espaço elimina todos os limites de exibição. Uma janela estreita ou texto maior muda o que cabe. Faça a mesma verificação no iPhone: examine o dia antes de considerar as etiquetas visíveis como a programação completa."
      ]
    },
    {
      "heading": "Confira mês, calendários selecionados e datas próximas",
      "body": [
        "Leia o mês e o ano exibidos antes de escolher uma data. A grade pode incluir datas de um mês vizinho para completar as linhas. No Cloud Calendars, use a navegação mensal e confira a data selecionada, sem confiar apenas na posição do quadrado.",
        "Confira os calendários selecionados. Ocultar eventos de trabalho ajuda a ler um plano familiar, mas também retira esses compromissos daquele panorama. Para investigar uma duplicata, oculte temporariamente uma origem e compare; não exclua um compromisso só para aliviar a grade."
      ]
    },
    {
      "heading": "Abra o evento antes de mudar um compromisso compartilhado",
      "body": [
        "Nos detalhes, confirme título, proprietário ou calendário, horário local e duração. A cor ajuda a localizar eventos, mas não substitui saber a conta ou se você pode editar. Um convite visível não é o mesmo que um compromisso organizado por você.",
        "O Cloud Calendars permite mover eventos para outra data por arrastar e soltar na visão mensal. Antes de usar isso num compromisso real, confirme a data e o alcance da recorrência. Após uma alteração permitida, reabra e confira: um gesto local não prova que o provedor ou todos os participantes aceitaram a mudança."
      ]
    },
    {
      "heading": "Verifique recorrência e fuso horário separadamente",
      "body": [
        "Se apenas a aula desta semana mudou, não altere sem querer o padrão futuro. Leia a opção de alcance da edição e depois examine tanto a ocorrência alterada quanto uma posterior. A visão mensal facilita comparar datas repetidas, mas é o alcance escolhido que define a mudança.",
        "Em viagens ou reuniões entre fusos, confira explicitamente data e horário local do evento. Mover para outro dia não converte automaticamente o horário pretendido. Verifique transições de horário de verão quando relevantes e confirme o horário combinado com as pessoas envolvidas."
      ]
    },
    {
      "heading": "Use a tela maior sem confundir produtos",
      "body": [
        "O Calendário da Apple tem suas próprias opções mensais; o Teamup documenta conjuntos diferentes de visões no navegador e no aplicativo. Esses controles pertencem a cada produto. Não procure configurações do navegador Teamup ou menus do Calendário da Apple dentro do Cloud Calendars só porque a visão tem o mesmo nome.",
        "Um mês de compromissos também não equivale a um mês de previsão do tempo. Para planos ao ar livre, confira separadamente local, data e horários com previsão disponível. Salve o compromisso no calendário desejado e confirme mudanças diretamente com os participantes."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Escolha datas no mês e confira horários na visão diária ou semanal.",
    "Abra dias com contagem adicional ou títulos encurtados.",
    "Confira mês, ano e calendários antes de considerar uma data livre.",
    "Confirme calendário, horário, duração e permissão de edição.",
    "Leia o alcance da recorrência e confira a ocorrência salva após mover.",
    "Verifique a previsão separadamente e confirme mudanças com participantes."
  ],
  "faq": [
    {
      "q": "A visão mensal do iPad mostra todos os compromissos completos?",
      "a": "Não suponha isso. O Cloud Calendars limita as etiquetas na célula e usa uma contagem adicional. Abra o dia e o evento para ver a programação completa."
    },
    {
      "q": "Um dia vazio significa que estou livre?",
      "a": "Confira calendários selecionados, data e presença dos dados das contas relevantes. O panorama representa apenas as informações disponíveis e exibidas naquele momento."
    },
    {
      "q": "Mover um evento recorrente altera só aquela data?",
      "a": "Leia a opção de alcance da edição. Depois de salvar, examine a ocorrência alterada e outra posterior e confirme o resultado desejado."
    }
  ],
  "sourcesHeading": "Compare as descrições oficiais das visões",
  "sources": [
    {
      "label": "Apple: visões mensal, de vários dias e em lista",
      "url": "https://support.apple.com/en-ca/guide/iphone/iphfd1054569/ios"
    },
    {
      "label": "Teamup: visões e configurações no navegador e aplicativo",
      "url": "https://calendar.teamup.com/kb/how-to-use-calendar-views/"
    }
  ],
  "seeAlso": []
},

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
  "updated": "2026-10-21",
  "title": "Compartilhe um evento: escolha o link e o acesso adequados",
  "short": "Compartilhar um evento",
  "description": "Compartilhe um evento sem compartilhar todo o calendário. Entenda os acessos Reader, Writer e Owner, prévias, atualizações e limites da revogação.",
  "lede": "Enviar os detalhes de um jantar, permitir que outro organizador edite e coletar confirmações de presença são tarefas diferentes. Defina o que precisa antes de escolher como compartilhar. Este guia foi escrito pela Arte Soft, desenvolvedora do Cloud Calendars.",
  "commonBelief": "Todo link de evento seria uma assinatura somente de leitura, com atualização imediata e registro de resposta.",
  "sections": [
    {
      "heading": "Comece conferindo os detalhes de um evento",
      "body": [
        "O compartilhamento de um único evento abrange esse evento, não todo o calendário do remetente. Antes de enviar, confira título, fuso horário, local, notas e links de reunião. Uma informação útil para um convidado pode não ser adequada para um link distribuído amplamente.",
        "Compartilhar um jantar não exige compartilhar o calendário das suas consultas médicas. Porém, o local e os links do jantar acompanham o evento. Confira o conteúdo do próprio evento, sem depender da privacidade do calendário em que ele está."
      ]
    },
    {
      "heading": "Escolha uma prévia, um convite por e-mail ou um código QR",
      "body": [
        "O Cloud Calendars oferece caminhos distintos. O App Clip apresenta uma prévia; para adicionar o evento por esse caminho, é necessário o aplicativo completo. Convites por e-mail e QR usam uma página web que oferece abrir o Cloud Calendars. Esses links não são URLs de assinatura intercambiáveis.",
        "O remetente entra na conta para usar o compartilhamento sincronizado do aplicativo. Um link ou código QR pode ser encaminhado: envie-o apenas onde seu conteúdo for apropriado. O QR transmite um link, mas não comprova quem o abriu."
      ]
    },
    {
      "heading": "Conceda apenas o acesso necessário",
      "body": [
        "Convites por e-mail permitem escolher Reader, Writer ou Owner. Reader pode visualizar e sincronizar; Writer pode editar; Owner também pode compartilhar e gerenciar acessos. São permissões com consequências diferentes. Use Reader para quem só precisa consultar a programação.",
        "Use Writer para um coorganizador que deve alterar o evento. Reserve Owner para quem também deve administrar o acesso de outras pessoas. O destinatário precisa entrar com a identidade correta para receber permissões ampliadas. Um destinatário anônimo não é um coproprietário identificado."
      ]
    },
    {
      "heading": "Entenda como o destinatário adiciona o evento",
      "body": [
        "No aplicativo completo, adicionar um evento compartilhado exige permissão de calendário e um calendário de destino que aceite alterações. O destinatário deve conferir o destino antes de salvar. A cópia recebida pode então ser associada ao evento compartilhado para atualizações futuras.",
        "Isso difere de importar um arquivo ICS comum em outro calendário. A importação cria uma cópia; uma assinatura consulta periodicamente um feed. Se você enviar um feed ICS em vez de um convite do aplicativo, explique esse caminho e confirme que o calendário do destinatário oferece suporte a ele."
      ]
    },
    {
      "heading": "Confira as alterações antes de depender delas",
      "body": [
        "Um compartilhamento sincronizado pode transmitir edições e cancelamentos, mas o dispositivo do destinatário precisa ter oportunidade de recebê-los. Uma indicação de atualização do feed não é um prazo de entrega. Um dispositivo offline, uma assinatura não atualizada ou uma cópia importada independente ainda pode mostrar informações antigas.",
        "Se o jantar mudar pouco antes do início, atualize o evento e contate os convidados diretamente. Peça confirmação do novo horário. Enviar uma atualização e receber uma resposta de presença são etapas separadas."
      ]
    },
    {
      "heading": "Gerencie o acesso sem prometer apagar cópias",
      "body": [
        "Revise o acesso dos destinatários e remova permissões desnecessárias. Remover um destinatário e revogar um link de feed são operações distintas. Nenhuma deve ser descrita como capaz de apagar remotamente capturas de tela, mensagens ou todas as cópias do calendário.",
        "Se um link circular além do público previsto, identifique o link ou a permissão envolvida. Confirme o caminho afetado após alterar o acesso. Em eventos futuros, mantenha informações privadas fora de links amplamente distribuídos, em vez de confiar na revogação posterior para recuperá-las."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Revise o evento e defina se precisa de visualização, edição ou respostas de presença.",
    "Escolha o caminho de compartilhamento e entre na conta quando necessário.",
    "Use Reader para consulta; conceda Writer ou Owner apenas para a responsabilidade correspondente.",
    "Peça ao destinatário que confira o horário e o calendário de destino ao adicionar.",
    "Em alterações urgentes, atualize o evento e envie uma mensagem direta.",
    "Ao encerrar o compartilhamento, revise separadamente permissões e acesso por link."
  ],
  "faq": [
    {
      "q": "Compartilhar um evento expõe todo o meu calendário?",
      "a": "O compartilhamento sincronizado de um único evento se limita a ele. Ainda assim, seus próprios detalhes ficam disponíveis pelo caminho escolhido. Confira essas informações e não envie um convite para todo o calendário quando pretende compartilhar somente um evento."
    },
    {
      "q": "O destinatário pode alterar o evento?",
      "a": "Sim, se tiver acesso Writer ou Owner adequado e usar o fluxo conectado compatível. Reader permite visualizar e sincronizar. Uma assinatura ICS comum não é o mesmo mecanismo de edição."
    },
    {
      "q": "Remover alguém desfaz tudo o que essa pessoa já recebeu?",
      "a": "Não presuma essa garantia. Alterações de acesso afetam a relação de compartilhamento compatível, mas cópias salvas, capturas de tela e mensagens podem permanecer. Uma URL de feed compartilhado também exige análise separada."
    }
  ],
  "sourcesHeading": "Referências sobre opções para o destinatário",
  "sources": [
    {
      "label": "Apple: visão geral dos App Clips",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google: importação de eventos e suas limitações",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft: importar um calendário ou assinar um calendário",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "what-guests-can-do-to-your-event",
    "taking-back-a-calendar-you-shared"
  ]
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
