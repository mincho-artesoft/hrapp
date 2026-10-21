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
  "title": "Permissões de convidados no Google Agenda: edição, convites e lista de participantes",
  "short": "Permissões dos convidados",
  "description": "Confira permissões e padrões dos convidados no Google. Separe os direitos do convite do acesso ao calendário e das funções do Cloud Calendars.",
  "lede": "Poder responder a um convite não resume tudo o que um convidado pode fazer. Revise as permissões antes de usar um único convite para uma equipe, clientes ou encontro público. Este guia é publicado pela Arte Soft, desenvolvedora do Cloud Calendars.",
  "commonBelief": "Convidados só podem aceitar ou recusar, e todos os aplicativos oferecem os mesmos controles de permissão.",
  "sections": [
    {
      "heading": "Comece pelo organizador e pelo evento original",
      "body": [
        "Abra o evento no Google Agenda usando a conta organizadora ou uma conta autorizada a gerenciá-lo. Confira calendário, data e organizador antes de mudar permissões. Um compromisso importado separadamente não é um lugar confiável para controlar o convite original.",
        "Para uma reunião de equipe, defina quem poderá reagendar, convidar outras pessoas e ver os participantes. São decisões separadas. Quem precisa participar não necessariamente precisa gerenciar a reunião."
      ]
    },
    {
      "heading": "Decida se convidados devem alterar a reunião",
      "body": [
        "O Google documenta a opção de modificar o evento na seção de permissões dos convidados do editor para computador. É uma permissão ampla de colaboração, não apenas uma forma de sugerir outro horário. Segundo o Google, ela permite gerenciar o evento, editar campos, ver convidados e reservar salas.",
        "Um coorganizador de confiança preparando uma oficina pode precisar dessa flexibilidade. Um cliente comparecendo a uma consulta talvez não. Escolha conforme a responsabilidade que está atribuindo e confira o evento salvo, sem se basear na configuração de outra reunião."
      ]
    },
    {
      "heading": "Revise convites e visibilidade separadamente",
      "body": [
        "O modelo de eventos do Google distingue a permissão de convidar outras pessoas da permissão de ver os demais convidados. Revise ambas junto com o direito de editar. Desativar uma não significa conferir a outra; um padrão exibido também não comprova a configuração de um evento existente.",
        "Para reunir clientes sem relação entre si, considere se um convite compartilhado é adequado. Informações já incluídas em e-mails, descrições ou mensagens encaminhadas vão além do controle atual da lista de convidados. Não coloque dados confidenciais na descrição esperando que ocultar a lista os esconda."
      ]
    },
    {
      "heading": "Confira padrões e eventos importantes",
      "body": [
        "O Google também documenta permissões padrão dos convidados nas configurações de eventos, inclusive para modificação. Portanto, os controles não existem apenas em cada evento. Revise os padrões quando sua forma habitual de agendar mudar e confira individualmente convites importantes já existentes.",
        "Em uma reunião recorrente, confirme qual ocorrência ou série está editando antes de salvar. Não suponha que mudar uma preferência reescreveu convites antigos. Para testar com um colega, use um exemplo combinado e sem dados sensíveis, em vez de mover ou cancelar uma reunião real de cliente."
      ]
    },
    {
      "heading": "Diferencie as funções do Cloud Calendars",
      "body": [
        "O Cloud Calendars tem um mecanismo de compartilhamento separado, com Reader, Writer e Owner. Reader permite ver e sincronizar; Writer permite editar; Owner também gerencia compartilhamento e acesso usando a identidade convidada. Essas funções não são controles das três permissões de convidados do Google.",
        "Se uma permissão específica do Google importa, inspecione o evento original no Google Agenda. Ver um participante no Cloud Calendars não comprova que todas as configurações de convidados do Google podem ser alteradas ali. Ao investigar um controle ausente ou edição malsucedida, confirme o serviço proprietário e a identidade do destinatário."
      ]
    },
    {
      "heading": "Verifique o resultado e defina responsabilidades",
      "body": [
        "Depois de salvar, reabra o evento original e confira as configurações desejadas. Quando apropriado, peça a um colega autorizado que confirme o que consegue fazer pela própria conta. Não troque senhas nem envie dados privados de convidados como atalho para testar acesso.",
        "Separe presença de permissões. Poder editar, ter uma cópia importada e registrar uma aceitação são fatos diferentes. No Cloud Calendars, um registro de recebimento do compartilhamento não é confirmação de presença. Em reuniões importantes, peça a resposta necessária e esclareça quem cuida das mudanças no horário."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifique a conta organizadora e o evento original.",
    "Defina quem gerencia a reunião, convida pessoas e vê os convidados.",
    "Confira as permissões reais do evento Google.",
    "Revise os padrões sem presumir que mudam eventos existentes.",
    "Trate as funções do Cloud Calendars como um sistema separado.",
    "Reabra o evento salvo e confirme a presença separadamente."
  ],
  "faq": [
    {
      "q": "Um convidado pode mudar o horário da minha reunião?",
      "a": "O Google permite conceder direito de modificação. Confira o evento e o acesso do convidado; receber um convite não comprova essa permissão."
    },
    {
      "q": "Todas as permissões são definidas apenas em cada evento?",
      "a": "Não. O Google também documenta permissões padrão. Confira os padrões para próximos agendamentos e examine os eventos importantes já existentes."
    },
    {
      "q": "Ocultar a lista remove informações já enviadas?",
      "a": "Isso não comprova a remoção de e-mails, descrições, capturas de tela ou cópias independentes anteriores. Revise separadamente o que foi distribuído."
    }
  ],
  "sourcesHeading": "Orientações dos provedores e leitura complementar",
  "sources": [
    {
      "label": "Google: colaboração em eventos e permissões padrão",
      "url": "https://support.google.com/a/users/answer/13293412?hl=en"
    },
    {
      "label": "Google: campos de permissão dos convidados",
      "url": "https://developers.google.com/workspace/calendar/api/v3/reference/events"
    }
  ],
  "updated": "2026-10-21",
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "sharing-one-event-not-your-calendar"
  ]
},

  'google-calendars-that-never-reach-your-iphone': {
  "title": "Um calendário Google não aparece no iPhone: confira a conexão e a seleção",
  "short": "Calendários Google ausentes no iPhone",
  "description": "Encontre um calendário Google ausente conferindo acesso à conta, visibilidade e a conexão usada pelo Calendário da Apple ou Cloud Calendars.",
  "lede": "Quando um calendário Google aparece e outro não, primeiro descubra onde a programação ausente está disponível. Acesso à conta, seleção de calendários e disponibilidade de eventos exigem verificações diferentes. Este guia é publicado pela Arte Soft, desenvolvedora do Cloud Calendars.",
  "commonBelief": "Todo calendário Google ausente tem a mesma causa numa lista oculta de sincronização, e conectar diretamente garante que tudo apareça.",
  "sections": [
    {
      "heading": "Confirme que o calendário está disponível para essa conta",
      "body": [
        "Abra o Google Agenda na web com a mesma conta que pretende usar no celular. Procure o calendário em si, não apenas um título conhecido. Duas contas podem ter calendários com nomes parecidos, e um convite enviado ao e-mail profissional não comprova acesso para a conta pessoal.",
        "Se o calendário também estiver ausente ali, comece pelo proprietário ou convite de compartilhamento. Se o acesso vier de um grupo, confirme sua participação e qual grupo recebeu a permissão. Não exclua a conta do celular enquanto a dúvida sobre o acesso continuar sem solução."
      ]
    },
    {
      "heading": "Diferencie um calendário oculto de um ausente",
      "body": [
        "No aplicativo Google Agenda, o Google orienta selecionar pelo menu os calendários que serão exibidos. Um calendário listado, mas desmarcado, é uma questão de visibilidade. Se ele não está na lista, investigue outros fatores, como a identidade convidada, aprovação ou conexão.",
        "Um convite de compartilhamento enviado por e-mail e um endereço de assinatura também são caminhos diferentes. O Google distingue adicionar uma nova assinatura pelo navegador do computador de abrir um calendário já compartilhado por e-mail. Guarde o convite original, mas não publique links privados em pedidos de ajuda."
      ]
    },
    {
      "heading": "Identifique como o aplicativo recebe os dados Google",
      "body": [
        "O Calendário da Apple pode se conectar pela conta Google configurada no dispositivo. As instruções do Google incluem ativar calendários para essa conta. Siga as orientações atuais do provedor para sua versão do iOS; alterar outro aplicativo não equivale a mudar essa conta do dispositivo.",
        "O Cloud Calendars também oferece login direto no Google. Identifique a conta e o caminho realmente usados antes de criar outra conexão. Se a mesma programação chega pelo calendário do dispositivo e pela conexão direta, compare a identidade dos calendários antes de concluir que o evento foi duplicado no Google."
      ]
    },
    {
      "heading": "Confira a seleção no Cloud Calendars sem presumir cobertura completa",
      "body": [
        "No Cloud Calendars, revise os calendários associados à conta Google desejada e selecione os que pretende usar. A sincronização Google considera essa seleção. Um login bem-sucedido, sozinho, não confirma que todos os calendários foram selecionados ou que todas as atualizações terminaram.",
        "A conexão direta é outra forma de receber dados Google, não uma promessa de exibir todo calendário acessível. Se ele aparece no site Google, mas não no Cloud Calendars, registre conta, nome do calendário e método de conexão para o suporte. Use o provedor original para agendamentos urgentes enquanto a diferença é investigada."
      ]
    },
    {
      "heading": "Separe calendário ausente de datas ausentes",
      "body": [
        "Se o calendário aparece na lista, mas um compromisso não, compare a data exata no Google Agenda. Confira se o item pertence ao calendário selecionado e se é a mesma ocorrência de uma reunião recorrente. Um título parecido em outro calendário não é o mesmo registro de origem.",
        "Não suponha que um aplicativo baixou todo o histórico e todos os eventos futuros distantes. A sincronização Google do Cloud Calendars consulta um intervalo limitado de datas. Uma busca antiga sem resultados não prova exclusão no Google; confira o provedor original antes de alterar ou recriar algo."
      ]
    },
    {
      "heading": "Peça ajuda com uma comparação útil, sem redefinir a conta",
      "body": [
        "Anote aplicativo, tipo de conta, nome do calendário, uma data de exemplo e onde a programação aparece. Inclua a mensagem de erro, se houver, removendo informações privadas. Isso distingue problemas de permissão, seleção e sincronização melhor do que dizer que toda a conta está com defeito.",
        "Para planos urgentes, confirme o evento atual com o organizador. Evite excluir contas, importar cópias repetidas ou mover eventos entre calendários como testes iniciais. Depois de entender o problema de conexão, confira o resultado com o mesmo exemplo antes de alterar outras configurações."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Compare a conta e o calendário desejados no Google Agenda na web.",
    "Confira se o calendário está ausente ou apenas desmarcado.",
    "Identifique sincronização do dispositivo, conexão direta ou assinatura.",
    "Revise os calendários selecionados na conta correta do Cloud Calendars.",
    "Compare uma data exata do evento no provedor original.",
    "Informe a diferença sem compartilhar endereços privados ou redefinir contas."
  ],
  "faq": [
    {
      "q": "O login direto no Google mostrará todos os calendários?",
      "a": "Não presuma cobertura completa. Conta, lista, seleção e sincronização bem-sucedida importam. Compare o calendário ausente no Google Agenda na web."
    },
    {
      "q": "Devo excluir a conta e adicioná-la novamente?",
      "a": "Confira primeiro identidade, acesso, visibilidade e conexão. Reconectar não concede uma permissão que o proprietário não deu."
    },
    {
      "q": "Um evento antigo ausente foi excluído?",
      "a": "Não necessariamente. Confira o calendário Google original e a data. O intervalo disponível ou a busca do aplicativo podem diferir do histórico armazenado pelo provedor."
    }
  ],
  "sourcesHeading": "Orientações dos provedores e leitura complementar",
  "sources": [
    {
      "label": "Google: adicionar eventos ao Calendário da Apple",
      "url": "https://support.google.com/calendar/answer/99358?hl=en&co=GENIE.Platform%3DiOS"
    },
    {
      "label": "Google: assinaturas e visibilidade de calendários",
      "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
    },
    {
      "label": "Google: funcionamento da lista de calendários",
      "url": "https://developers.google.com/workspace/calendar/api/v3/reference/calendarList/list"
    }
  ],
  "updated": "2026-10-21",
  "seeAlso": [
    "why-a-shared-calendar-does-not-appear",
    "icloud-google-and-outlook-in-one-view"
  ]
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
