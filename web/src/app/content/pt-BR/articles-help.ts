import { LocalisedArticle } from '../types';

export const HELP_PT_BR: Readonly<Record<string, LocalisedArticle>> = {
  "calendar-notifications-missing-silent-or-duplicated": {
    "updated": "2026-10-21",
    "title": "Notificações do calendário no iPhone: ausentes, sem som ou duplicadas?",
    "short": "Resolver problemas com notificações",
    "description": "Separe alertas de eventos, ajustes do Cloud Calendars e controles do iPhone. Verifique lembretes ausentes, sem som ou duplicados sem apagar dados.",
    "lede": "Comece pelo que aconteceu: o evento não apareceu, a notificação não chegou, apareceu sem som ou dois apps avisaram você? Cada caso pede uma verificação diferente. Este guia é publicado pela Arte Soft, desenvolvedora do Cloud Calendars.",
    "commonBelief": "Se um evento aparece no calendário, todos os alertas e permissões de notificação já devem estar configurados.",
    "sections": [
      {
        "heading": "Primeiro, identifique o tipo de problema",
        "body": [
          "Se o próprio evento está ausente, confira a conta à qual ele pertence e o calendário selecionado antes de alterar o som. Um alerta não determina se o evento correto chegou ao app. Consulte o guia de sincronização para esse outro problema.",
          "Se o evento está visível, mas nenhuma notificação aparece, confira o alerta salvo e os dois controles de notificação abaixo. Se aparece sem som, concentre-se nos ajustes de entrega e som do iPhone. Se recebe mais de uma, identifique cada app remetente e cada alerta configurado antes de remover algo."
        ]
      },
      {
        "heading": "Nenhuma notificação: confira o evento e os controles do app",
        "body": [
          "Abra o evento e confira o horário do alerta. O editor do Cloud Calendars tem os controles “Alert” e, quando aplicável, “Second Alert”, incluindo “None” e opções anteriores ao evento. Um segundo alerta pode ser intencional. Confira novamente o evento salvo após uma edição, sobretudo quando o provedor ou as permissões de um calendário compartilhado limitam as alterações.",
          "Nos ajustes do Cloud Calendars, procure “Event Notifications”. Os ajustes também separam notificações de convites e de clima: ativar uma delas não comprova que os lembretes comuns de eventos estejam ativos. Confira tanto “Event Notifications” no app quanto a permissão de notificações do iOS.",
          "A seleção do calendário também importa: o funcionamento atual agenda alertas dos calendários selecionados. Confira se o calendário relevante está selecionado. Não presuma que ocultá-lo muda apenas sua aparência neste app, nem apague eventos para interromper lembretes."
        ]
      },
      {
        "heading": "Alerta sem som ou atrasado: confira a entrega no iPhone",
        "body": [
          "No app de ajustes do iPhone, abra a seção de notificações e escolha Cloud Calendars. Confira “Allow Notifications”, os locais disponíveis para exibir alertas e os controles de som. Veja se “Scheduled Summary” ou um modo “Focus” ativo está alterando a entrega. Esses são ajustes do sistema Apple, não o menu “Alert” dentro de um evento. Os nomes podem variar conforme a versão do iOS.",
          "Ver um banner sem som é diferente de não encontrar nenhuma notificação. Anote se ele apareceu na tela bloqueada ou na central de notificações, se o telefone estava em uso e qual modo de foco estava ativo. Altere um único ajuste relevante por vez para que o próximo resultado ajude a entender o problema. A contagem regressiva de uma Atividade ao Vivo é outra superfície: vê-la não comprova que um lembrete sonoro chegará."
        ]
      },
      {
        "heading": "Dois alertas: identifique os remetentes antes de alterar o evento",
        "body": [
          "Leia o nome do app em cada notificação. Calendário da Apple, Google Agenda e Cloud Calendars podem enviar notificações separadamente mesmo quando mostram eventos relacionados. Duas notificações não bastam para comprovar que existem dois registros do evento. Compare também os horários: um lembrete no dia anterior e outro perto do início podem corresponder aos alertas salvos.",
          "O guia de notificações do Google explica que seus ajustes são pessoais para a conta e que as opções de um evento podem ser diferentes dos padrões do calendário. Essas instruções se aplicam ao Google Agenda, não aos ajustes do Cloud Calendars. Confira o remetente relevante em vez de supor que a opção de um app controla todos os outros.",
          "Escolha qual app deve avisar você e ajuste apenas o lembrete ou a preferência de notificação relevante. Se houver dois registros reais do evento, compare os calendários e seus proprietários usando o guia de eventos duplicados. Não cancele uma reunião real só para silenciar um alerta extra."
        ]
      },
      {
        "heading": "Use um evento de teste para delimitar o problema",
        "body": [
          "Crie um compromisso de teste com nome claro em um calendário seu que permita edição. Defina o início com antecedência suficiente para que o horário do alerta escolhido ainda esteja no futuro. Confirme que o calendário está selecionado, que o alerta foi salvo e que os dois controles de notificações estão ativos. Anote o horário esperado e qual app deve enviá-lo.",
          "Observe separadamente se a notificação aparece e se emite som. Repita apenas depois de alterar um ajuste suspeito. Use um evento comum de teste, sem participantes, e não uma reunião importante ou série recorrente. Guarde o resultado junto com as versões do app e do iOS para comparar depois."
        ]
      },
      {
        "heading": "Se o resultado continuar inconsistente",
        "body": [
          "O app agenda um conjunto limitado de alertas próximos; não conte com uma fila ilimitada de lembretes distantes. Confira os controles da versão instalada e registre entregas inconsistentes. Informe as versões do app e do iOS, o tipo de calendário, a antecedência do alerta salvo, o horário esperado e o resultado observado.",
          "Não inclua títulos privados, endereços de participantes ou links de assinatura de calendários em um relato público. Reinstalar, limpar o armazenamento local ou remover contas não é o primeiro passo do diagnóstico. Preserve os eventos e a configuração das contas enquanto o suporte investiga."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Classifique a falha: evento ausente, notificação ausente, entrega sem som ou alertas duplicados.",
      "Confira o alerta salvo e o calendário selecionado.",
      "Confira “Event Notifications” do Cloud Calendars separadamente da permissão de notificações do iPhone.",
      "Para duplicados, compare os apps remetentes e os horários configurados.",
      "Use um único evento futuro de teste e registre o resultado sem alterar convites reais."
    ],
    "faq": [
      {
        "q": "Ativar notificações de clima habilita lembretes de eventos?",
        "a": "Não. Os ajustes separam notificações de eventos, convites e clima. Confira “Event Notifications” e a permissão do iOS para alertas de eventos comuns."
      },
      {
        "q": "Devo apagar um evento quando chegam dois alertas?",
        "a": "Primeiro identifique os apps remetentes e os horários. Várias notificações podem vir de apps diferentes ou de vários alertas em um único evento. Apagar não é uma forma segura de diagnosticar isso."
      },
      {
        "q": "Configurar um alerta garante a entrega?",
        "a": "Não. É apenas uma parte do processo. Preferências do app, permissão do sistema e ajustes de entrega também importam. Confira o resultado no dispositivo."
      }
    ],
    "sourcesHeading": "Fontes e ajustes de notificações",
    "sources": [
      {
        "label": "Apple: alterar os ajustes de notificações no iPhone",
        "url": "https://support.apple.com/guide/iphone/change-notification-settings-iph7c3d96bab/ios"
      },
      {
        "label": "Google: alterar notificações do Google Agenda no iPhone e iPad",
        "url": "https://support.google.com/calendar/answer/37242?hl=en&co=GENIE.Platform%3DiOS"
      }
    ],
    "seeAlso": [
      "what-calendar-sync-actually-does",
      "when-two-calendars-disagree"
    ]
  },
  "find-old-calendar-events-by-account-date-and-title": {
    "updated": "2026-10-21",
    "title": "Encontre um evento antigo: confira a conta, as datas e os campos de busca",
    "short": "Encontrar eventos passados",
    "description": "Uma busca vazia não prova que um evento foi apagado. Confira a conta, as datas e os campos pesquisados antes de consultar o arquivo do provedor.",
    "lede": "Quando você lembra de uma reunião, mas não a encontra, separe três perguntas: em qual conta ela estava, quais datas a visualização atual cobre e quais campos a busca compara. Este guia é publicado pela Arte Soft, desenvolvedora do Cloud Calendars.",
    "commonBelief": "Toda caixa de busca de um app de calendário pesquisa todos os campos de todos os eventos já armazenados pelo provedor.",
    "sections": [
      {
        "heading": "Anote a menor pista útil",
        "body": [
          "Comece com um mês ou ano aproximado, uma palavra característica do título e a conta que provavelmente usou. Mantenha essas pistas separadas. O nome de um colega pode ter sido registrado como participante, não no título; um endereço pode ter ficado apenas no campo de local.",
          "Tente um trecho curto do título antes de uma frase longa. Um resultado negativo não informa se o registro está ausente, fora das datas carregadas ou em um campo que não é pesquisado."
        ]
      },
      {
        "heading": "Confira a conta de origem e a seleção do calendário",
        "body": [
          "Procure a conta e o calendário aos quais o evento pertencia originalmente. Um calendário de trabalho do Google, um pessoal do iCloud e um local no dispositivo são destinos diferentes, mesmo que um app os mostrasse juntos. Confirme que você ainda tem acesso à conta esperada e que o calendário está selecionado.",
          "Não crie uma nova cópia só porque a busca está vazia. Se encontrar o evento navegando até a data aproximada, confira título, calendário e organizador. Isso fornece evidências para comparar com a busca sem alterar o registro."
        ]
      },
      {
        "heading": "Confira as datas e os campos usados pela busca do Cloud Calendars",
        "body": [
          "O Cloud Calendars busca nos títulos dos eventos carregados sem diferenciar maiúsculas e minúsculas. Use uma palavra característica do título. Não espere que um local, endereço de participante ou nota seja encontrado só porque aparece em outra parte do evento.",
          "A visualização de busca atual carrega eventos do ano civil em curso dos calendários selecionados. Uma reunião de um ano anterior pode, portanto, não aparecer nessa busca mesmo continuando no provedor. Confira o intervalo antes de interpretar um resultado vazio.",
          "Navegar até uma data antiga e pesquisar em um ano antigo são ações diferentes. Para buscas históricas, use as ferramentas do provedor quando disponíveis e confirme que é a mesma conta. Confira os controles da versão instalada em vez de supor que a busca cobre todos os anos."
        ]
      },
      {
        "heading": "Use as ferramentas do provedor conforme os campos e datas documentados",
        "body": [
          "No Google Agenda para computador, as opções permitem filtrar por calendário, informações do evento, pessoas, local e intervalo de datas. O Google recomenda uma busca avançada com datas delimitadas quando eventos antigos não aparecem e documenta um limite de 200 resultados. Divida uma busca ampla em intervalos menores em vez de presumir que o primeiro conjunto esteja completo.",
          "Esses são controles do Google Agenda na web, não uma descrição do Cloud Calendars. Da mesma forma, o guia do Calendário da Apple diz que sua busca no iPhone pode encontrar títulos, convidados, locais e notas. Isso descreve a busca do próprio Calendário da Apple. Usar o EventKit em outro app não lhe dá automaticamente a mesma interface ou regras de busca."
        ]
      },
      {
        "heading": "Interprete onde o evento aparece e onde não aparece",
        "body": [
          "Encontrado no provedor, ausente no Cloud Calendars: confira a identidade da conta, o calendário selecionado, as datas cobertas e o título pesquisado. Preserve o registro do provedor. A próxima questão é o que o app carregou ou encontrou, não se é preciso recriar o compromisso.",
          "Encontrado ao navegar, ausente na busca: compare o título real com a consulta e anote a data. Isso é uma evidência útil de um problema de abrangência ou correspondência da busca. Não altere o título de uma reunião antiga só para fazer um teste funcionar.",
          "Ausente também no provedor: confirme conta, acesso ao calendário e intervalo de datas antes de investigar retenção ou exclusão com o provedor. Para um calendário local, o site de um provedor não é uma cópia independente, a menos que você tenha estabelecido uma conexão separada. Não presuma que exista um arquivo na nuvem para cada evento local."
        ]
      },
      {
        "heading": "Mantenha um registro útil sem expor o evento",
        "body": [
          "Para o suporte, registre a versão do app, o provedor do calendário ou o tipo de armazenamento local, o ano aproximado e se o evento aparece no provedor ou ao navegar por datas. Informe se a consulta era uma palavra do título, um local ou um participante. Isso ajuda mais do que simplesmente dizer que a busca não funciona.",
          "Evite enviar notas privadas, links de convite ou URLs secretas de feeds de calendário. Mantenha as contas e os dados locais intactos; limpar o armazenamento ou importar novamente um arquivo antigo pode aumentar a incerteza."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Identifique a provável conta de origem e a data aproximada.",
      "Confira se o calendário está selecionado e acessível.",
      "Tente uma palavra característica do título do evento.",
      "Separe a busca do ano atual no app da busca no arquivo do provedor.",
      "Use os filtros de data do Google Agenda na web ou os campos documentados do Calendário da Apple quando for pertinente.",
      "Registre onde o evento aparece antes de alterar dados."
    ],
    "faq": [
      {
        "q": "Um resultado vazio significa que meu evento antigo foi apagado?",
        "a": "Não. Conta errada, calendário não selecionado, data fora do intervalo carregado ou campo não pesquisado podem explicar o resultado vazio. Confira o provedor e a data aproximada."
      },
      {
        "q": "Posso buscar no Cloud Calendars pelo e-mail de um participante ou por uma nota?",
        "a": "A busca atual compara o texto do título dos eventos. Para participantes, notas ou locais, use as ferramentas do provedor que documentam a pesquisa nesses campos."
      },
      {
        "q": "Navegar até o ano passado faz a busca cobrir aquele ano?",
        "a": "Não conte com isso. A visualização de busca atual carrega o ano em curso ao abrir. Para registros históricos, use a busca por intervalo do provedor em vez de supor que o app pesquisa um histórico ilimitado."
      }
    ],
    "sourcesHeading": "Fontes e ajuda de busca dos provedores",
    "sources": [
      {
        "label": "Google: pesquisar no Google Agenda pelo computador",
        "url": "https://support.google.com/calendar/answer/37176?hl=en&co=GENIE.Platform%3DDesktop"
      },
      {
        "label": "Apple: buscar eventos no Calendário do iPhone",
        "url": "https://support.apple.com/guide/iphone/search-for-events-iph2c9ef44ad/ios"
      }
    ],
    "seeAlso": [
      "what-calendar-sync-actually-does",
      "a-list-for-people-who-dislike-grids",
      "when-two-calendars-disagree"
    ]
  },
  "calendar-export-ics-pdf-and-backup": {
    "updated": "2026-10-21",
    "title": "Exportar um calendário: arquivos ICS, PDFs e assinaturas",
    "short": "Exportação e backup de calendários",
    "description": "Precisa de um arquivo de calendário de uma conta do iPhone? Escolha ICS, PDF ou assinatura e siga o processo adequado do Google, Mac ou Outlook.",
    "lede": "Um calendário no iPhone pode mostrar várias contas. Para obter uma cópia útil, identifique a origem e decida se precisa de dados dos eventos, uma programação legível ou atualizações contínuas.",
    "sections": [
      {
        "heading": "Escolha o resultado antes do formato",
        "body": [
          "Exportar um calendário pode significar tarefas diferentes. Se quiser que outro app leia os registros de eventos, escolha um formato estruturado compatível, como ICS. Se alguém precisa de uma programação legível, escolha PDF ou uma página impressa. Se deve receber mudanças posteriores, avalie uma assinatura ou compartilhamento baseado em permissões.",
          "Um PDF registra o layout salvo; não é um arquivo para importar eventos. Um ICS baixado contém dados do calendário no momento em que foi obtido. Uma assinatura ICS usa um endereço que o cliente de calendário consulta novamente. A extensão sozinha não informa se o destinatário importou uma cópia daquele momento ou assinou atualizações.",
          "Por exemplo, um roteiro de fim de semana em PDF é fácil de ler. Um colega transferindo compromissos para outra conta precisa de dados de eventos. Um membro de um clube acompanhando a programação variável do próximo mês precisa de uma fonte atualizável. Decida qual desses resultados precisa antes de enviar algo."
        ]
      },
      {
        "heading": "Comece pela conta que contém os eventos",
        "body": [
          "No iPhone, identifique o calendário e a conta que contêm os eventos necessários. Uma visualização combinada pode incluir várias contas, calendários compartilhados e assinaturas. Vê-los juntos não significa que exista um único calendário de origem para exportar.",
          "Para o Google Agenda, use um computador: o Google não oferece exportação pelo app Agenda. Na versão web, abra “Settings”, depois “Import & export” e “Export”. O ZIP baixado contém arquivos ICS individuais. Para um calendário, abra “Settings and sharing” e escolha “Export calendar”. O Google exige permissão para gerenciar alterações e compartilhamento; uma organização também pode restringir a exportação.",
          "Para um calendário disponível no Calendário do Mac, selecione seu nome na barra lateral e use “File > Export > Export” para salvar um ICS. É um processo do Mac, não um comando oculto do iPhone. Confira se selecionou o calendário desejado antes de salvar."
        ]
      },
      {
        "heading": "Quando você precisa de uma programação em PDF",
        "body": [
          "No Calendário do Mac, use “File > Print” e escolha layout, intervalo de datas e calendários a incluir. Na janela de impressão do macOS, use o menu “PDF” e “Save as PDF”. Abra o resultado antes de enviar: uma grade pequena pode omitir ou cortar detalhes importantes para o destinatário.",
          "Inclua um intervalo de datas claro e o fuso horário relevante na mensagem que acompanha o documento. Revise compromissos privados, notas e locais antes de compartilhar. Edições posteriores no calendário não reescrevem um PDF já enviado; identifique claramente as revisões para que os destinatários saibam qual programação seguir."
        ]
      },
      {
        "heading": "Assinar e publicar são diferentes de fazer backup",
        "body": [
          "A Microsoft documenta a diferença no Outlook na web: baixar e importar um ICS publicado cria uma cópia sem atualizações posteriores; assinar o endereço ICS acompanha as mudanças. O intervalo de atualização depende do provedor do destinatário, e o calendário publicado é somente leitura.",
          "Quando disponível, “Settings > Shared calendars > Publish a calendar” do Outlook permite escolher calendário e nível de detalhe. Publicar o expõe para consulta ou assinatura; use isso para um público pretendido, não como técnica de backup privado. Um link salvo ainda depende de a origem permanecer disponível."
        ]
      },
      {
        "heading": "O que o compartilhamento do Cloud Calendars oferece",
        "body": [
          "Nós desenvolvemos o Cloud Calendars. O fluxo de compartilhamento de eventos oferece App Clip, e-mail e QR para entregar links de convite. Esses links têm outra finalidade que não baixar o calendário inteiro em um arquivo. Um link pode abrir um convite ou uma assinatura; não é, por si só, um arquivo portátil de todos os calendários que você vê.",
          "Este guia não oferece um procedimento do Cloud Calendars para exportar calendários completos em ICS, CSV ou PDF. Para isso, use os caminhos documentados do provedor ou do Mac acima. Para enviar um evento específico, siga nosso guia de compartilhamento; para uma programação compartilhada contínua, decida primeiro quem deve acessar e se precisa de atualizações ou direitos de edição."
        ]
      },
      {
        "heading": "Confira a cópia antes de depender dela",
        "body": [
          "Mantenha o calendário original enquanto verifica a exportação. Registre conta, nome do calendário e data de exportação. Se testar uma importação, use um calendário de destino separado quando possível e compare um compromisso comum, um evento de dia inteiro e uma série recorrente com uma ocorrência alterada.",
          "Transferir calendários não garante preservar todos os recursos das reuniões. O Google informa que eventos importados omitem convidados e dados de videoconferência, e que recorrências em CSV podem virar eventos avulsos. Confira explicitamente convites, links de reunião e recorrências antes de considerar a migração concluída.",
          "A Apple também oferece “File > Export > Calendar Archive” no Mac, que gera um arquivo ICBU. É uma operação diferente de exportar um ICS. A Apple avisa que importar esse arquivo substitui as informações e os dados atuais do calendário; não use a restauração de um arquivo como teste informal de importação."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Identifique a conta e o calendário necessários e escolha entre cópia pontual, programação imprimível ou assinatura atualizável.",
      "Use o processo de exportação documentado e mantenha o original enquanto verifica o resultado.",
      "Revise destino, dados sensíveis e eventos representativos antes de enviar ou confiar na cópia."
    ],
    "faq": [
      {
        "q": "Posso exportar o Google Agenda diretamente pelo app para iPhone?",
        "a": "Não. O processo documentado pelo Google exige um computador. Exportar também requer a permissão adequada para gerenciar o compartilhamento."
      },
      {
        "q": "Assinar um endereço ICS me dá um backup?",
        "a": "Uma assinatura acompanha uma origem que pode mudar ou ficar indisponível. Salve uma exportação independente se precisar de uma cópia datada e verifique o que o arquivo preserva."
      },
      {
        "q": "Devo escolher ICS ou PDF?",
        "a": "Escolha ICS para dados de eventos que um calendário compatível consiga importar. Escolha PDF para uma programação legível. Um PDF não fornece atualizações nem reconstrói eventos editáveis pelos processos de importação documentados."
      }
    ],
    "sourcesHeading": "Instruções oficiais e limitações dos formatos",
    "sources": [
      {
        "label": "Google: exportar eventos do calendário",
        "url": "https://support.google.com/calendar/answer/37111?hl=en"
      },
      {
        "label": "Google: importar eventos e limitações de transferência",
        "url": "https://support.google.com/calendar/answer/37118?hl=en"
      },
      {
        "label": "Apple: exportar arquivos ICS e arquivos de calendário no Mac",
        "url": "https://support.apple.com/guide/calendar/import-or-export-calendars-icl1023/mac"
      },
      {
        "label": "Apple: salvar um documento como PDF no Mac",
        "url": "https://support.apple.com/en-gb/guide/mac-help/mchlp1531/mac"
      },
      {
        "label": "Microsoft: publicar, importar e assinar no Outlook",
        "url": "https://support.microsoft.com/en-us/outlook/share-your-calendar-in-outlook-on-the-web"
      }
    ],
    "seeAlso": [
      "sharing-one-event-not-your-calendar",
      "inviting-people-who-do-not-have-the-app",
      "the-secret-address-of-a-google-calendar"
    ]
  }
};
