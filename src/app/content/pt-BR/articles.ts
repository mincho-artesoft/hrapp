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
  "updated": "2026-10-23",
  "title": "Calendário com tempo no iPhone e iPad: planeje seu dia em uma única visualização",
  "short": "Use calendário e tempo juntos",
  "description": "Compare seu calendário com a previsão do tempo do local selecionado no iPhone e iPad.",
  "lede": "Cloud Calendars reúne sua agenda e a previsão do tempo no mesmo app para iPhone ou iPad. Use o calendário para escolher uma data e a visualização do tempo para consultar o local selecionado e os horários de previsão disponíveis. Para um plano ao ar livre, verifique o período que importa em vez de confiar em um ícone diário. Este guia é publicado pela Arte Soft, desenvolvedora do app.",
  "commonBelief": "O tempo exibido ao lado de um calendário descreve automaticamente o endereço de todos os eventos, todas as horas e todas as datas futuras.",
  "sections": [
    {
      "heading": "Escolha uma pergunta real de planejamento",
      "body": [
        "Comece com um evento específico, como uma visita a um parque à tarde. Identifique o que pode mudar: o horário, o local, a preparação ou a decisão de usar uma alternativa. Você não precisa reorganizar o calendário inteiro só porque o símbolo do dia indica chuva.",
        "Anote o horário real de início e término da atividade, incluindo preparação, se for relevante. Uma visão geral do calendário ajuda a encontrar datas possíveis, enquanto a verificação da previsão diz respeito a um local e a um intervalo específicos. Mantenha essas duas funções separadas ao comparar opções."
      ]
    },
    {
      "heading": "Confirme o local da previsão antes de ler os valores",
      "body": [
        "Cloud Calendars oferece previsão do tempo para o local atual ou selecionado. Verifique o local exibido em vez de presumir que o endereço de um evento altera a previsão automaticamente. Um evento em outra cidade precisa ser comparado com a previsão dessa cidade.",
        "Por exemplo, uma pessoa pode estar planejando chegar a um museu enquanto o telefone ainda está em casa. Leia o local da previsão e o horário local do evento antes de compará-los. Valores que parecem próximos não provam que a agenda e a previsão usam o mesmo local."
      ]
    },
    {
      "heading": "Verifique separadamente a cobertura horária e a diária",
      "body": [
        "Use uma entrada diária para se orientar e as entradas horárias disponíveis para uma dúvida sobre parte do dia. Uma reserva das duas às cinco precisa de mais do que uma olhada em um único símbolo. Verifique se as horas relevantes estão realmente disponíveis.",
        "Na fonte atual do app, a lista diária mostra até dez dias retornados pelo WeatherKit. Isso é separado da navegação no calendário e das horas atualmente fornecidas. Um evento futuro não amplia a cobertura da previsão. Se o período não aparecer, programe uma nova verificação depois."
      ]
    },
    {
      "heading": "Entenda o que significa cada valor da previsão",
      "body": [
        "A Apple documenta dados do WeatherKit, como temperatura, precipitação, vento e UV, com alguns produtos disponíveis apenas em regiões selecionadas. Leia os valores disponíveis para o local escolhido em vez de esperar todos os produtos de tempo em qualquer lugar.",
        "As orientações do Met Office mostram por que o período da previsão e as definições das variáveis importam: alguns valores se referem a um momento e outros a um período. Use os rótulos do provedor relevante. Probabilidade de chuva, volume e duração são questões diferentes, e nenhum número único decide toda atividade ao ar livre."
      ]
    },
    {
      "heading": "Revise um rascunho criado a partir de um horário da previsão",
      "body": [
        "Quando o app oferece a criação de um evento a partir de um horário da previsão, ele abre um rascunho. Na fonte atual, ele usa o fuso horário do local da previsão, propõe duração de uma hora e seleciona o calendário padrão de novos eventos. Verifique cada valor antes de salvar.",
        "Confirme o título, o calendário de destino, o início, o término e o local pretendido. Selecionar um horário da previsão não dá permissão para editar um calendário compartilhado, avisar um local ou reservar uma sala. Confira o evento salvo e obtenha qualquer aprovação necessária para o plano."
      ]
    },
    {
      "heading": "Mantenha separada a demonstração do site",
      "body": [
        "A demonstração interativa de tempo no site usa Open-Meteo. O app usa Apple WeatherKit. Uma demonstração na web é útil para explorar a apresentação, mas o local, os dados e as datas disponíveis podem ser diferentes dos do app.",
        "Para uma decisão real, abra o app e compare o evento pretendido com a previsão disponível. Se você alterar um plano compartilhado, confirme o organizador, o escopo da recorrência e os participantes. Tenha uma alternativa combinada quando a atividade depender das condições."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifique o evento e a decisão que o tempo pode alterar.",
    "Confirme o local da previsão e a data e hora locais do evento.",
    "Verifique a cobertura horária disponível separadamente do resumo diário.",
    "Leia a probabilidade, o volume e outros valores relevantes usando seus rótulos.",
    "Revise todos os detalhes do rascunho do evento e o calendário de destino antes de salvar.",
    "Verifique novamente no momento da decisão e confirme diretamente as mudanças compartilhadas."
  ],
  "faq": [
    {
      "q": "O tempo ao lado do meu calendário acompanha o endereço de cada evento?",
      "a": "Não presuma isso. Confirme o local da previsão exibido e compare-o com o local do evento; a proximidade na tela não comprova a correspondência."
    },
    {
      "q": "O app usa o provedor de tempo do site?",
      "a": "Não. O app usa Apple WeatherKit; a demonstração do site usa Open-Meteo separadamente."
    },
    {
      "q": "Escolher um horário da previsão salva um evento automaticamente?",
      "a": "Isso inicia um rascunho quando essa ação é oferecida. Verifique a data, o fuso horário, a duração, o calendário e o local, e então salve o evento desejado."
    }
  ],
  "seeAlso": [
    "weather-calendar-history-versus-forecast-iphone",
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather",
    "weather-where-the-event-is",
    "planning-outdoors-without-being-rained-on"
  ],
  "sourcesHeading": "Fontes oficiais e leituras adicionais",
  "sources": [
    {
      "label": "Apple: informações de previsão do WeatherKit e disponibilidade regional",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: local da previsão, períodos e valores meteorológicos",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ],
  "comparison": {
    "heading": "Qual visualização do tempo responde à sua pergunta?",
    "columns": [
      "Sua pergunta",
      "O que verificar",
      "O que isso não comprova"
    ],
    "rows": [
      {
        "cells": [
          "O que vem pela frente hoje?",
          "Visualização diária ou semanal do calendário ao lado da previsão do local selecionado.",
          "Que o endereço de cada evento altera automaticamente o local da previsão."
        ]
      },
      {
        "cells": [
          "A chuva pode afetar meu evento da tarde?",
          "Dados por hora do local do evento e de todo o período do evento.",
          "Que um símbolo diário descreve todas as horas."
        ]
      },
      {
        "cells": [
          "Posso planejar o próximo mês com base no tempo?",
          "Seu calendário agora e, depois, uma nova verificação da previsão mais perto da data.",
          "Que navegar pelo calendário amplia a cobertura da previsão."
        ]
      },
      {
        "cells": [
          "Posso ver uma visão geral rápida na tela inicial?",
          "O widget apropriado da Tela de Início.",
          "Que todo layout de widget inclui eventos ou uma previsão completa."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-right",
    "hook"
  ],
  "galleryCaption": "Telas reais do Cloud Calendars: a visualização do tempo e um dia com eventos. Verifique o local e a data selecionados no app.",
  "actionHeading": "Planeje com sua agenda e a previsão juntas",
  "actionText": "Cloud Calendars está disponível para iPhone e iPad. Comece com as visualizações, o tempo e a sincronização com Google Calendar incluídos no Base; o Advanced remove anúncios, enquanto o Premium adiciona suporte a Microsoft Calendar e Teams.",
  "articleLinks": [
    {
      "slug": "forecast-beside-every-event",
      "label": "Verifique a previsão do tempo para as horas de um evento"
    },
    {
      "slug": "the-widget-that-shows-what-is-next",
      "label": "Escolha um widget de calendário e tempo"
    },
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "Reúna contas de calendário em uma única visualização"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
  "updated": "2026-10-23",
  "title": "Veja calendários do Google, iCloud e Outlook juntos no iPhone e iPad",
  "short": "Três provedores, uma visualização",
  "description": "Combine visualizações de calendário e entenda permissões de conta, cópias e requisitos de plano.",
  "lede": "Para ver juntos eventos de trabalho e pessoais, conecte as contas desejadas, selecione os calendários delas e confira os mesmos eventos em uma única visualização. Cloud Calendars oferece suporte ao planejamento no iPhone e iPad com iCloud e Google Calendar; o suporte ao Microsoft Calendar está no Premium. Ver eventos juntos é diferente de copiar períodos ocupados entre contas de provedores. A Arte Soft, desenvolvedora do app, publica este guia.",
  "commonBelief": "Colocar vários calendários em um único app mantém automaticamente alinhadas a disponibilidade, o compartilhamento e as cópias de eventos deles.",
  "sections": [
    {
      "heading": "Identifique a conta e o calendário por trás de cada evento",
      "body": [
        "Comece com um evento comum de cada provedor. Anote o endereço de e-mail conectado, o nome do calendário e se o evento é seu ou se você recebeu um convite. Dois calendários chamados “Calendar” podem pertencer a contas totalmente diferentes. Uma cor ajuda a visualizar a semana; a conta e o calendário identificam onde uma edição deve ser feita.",
        "Por exemplo, uma consulta no dentista no seu calendário pessoal do iCloud e uma reunião de projeto no Microsoft podem aparecer juntos para você. Isso, por si só, não torna a consulta visível para seus colegas nem reserva esse horário nas ferramentas de agendamento deles.",
        "Escolha o resultado desejado antes de alterar uma conexão. Para mover dados de eventos para outra conta, use “Escolher um formato de exportação de calendário” abaixo para encontrar uma rota de transferência compatível e verifique eventos representativos antes de confiar no destino. Para comparar horários, mantenha os proprietários atuais dos calendários e exiba juntas as fontes selecionadas. Se outra conta precisar receber períodos ocupados, “Cloud Calendars e OneCal por fluxo de trabalho” explica como a cópia de disponibilidade difere de uma visão pessoal."
      ]
    },
    {
      "heading": "Conecte-se pela rota apropriada",
      "body": [
        "No caso do iCloud, primeiro ative o iCloud Calendar no iPhone na Apple Account desejada. O guia de configuração da Apple explica os ajustes do dispositivo. O Cloud Calendars acessa os calendários disponíveis pelo sistema de calendário do iPhone e precisa de acesso ao calendário para lê-los. Não basta que uma conta esteja conectada em outro dispositivo.",
        "O Cloud Calendars também oferece as ações “Sign in with Google” e “Sign in with Microsoft”. Verifique qual conta você seleciona ao entrar e depois abra o grupo de calendários dela e selecione os calendários de que precisa. Entrar no provedor certo com a identidade pessoal ou de trabalho errada pode produzir uma lista de calendários perfeitamente válida, mas inesperada."
      ]
    },
    {
      "heading": "Entenda os planos sem confundi-los com permissões",
      "body": [
        "O plano Base inclui sincronização com Google Calendar e as visualizações de calendário. O Advanced adiciona remoção de anúncios ao Base. O Premium adiciona recursos do Microsoft Calendar e do Microsoft Teams. Revise o preço local atual e o período de cobrança antes de comprar.",
        "Um plano altera quais recursos do app estão disponíveis; ele não concede propriedade sobre o calendário de outra pessoa. O Google distingue a permissão para ver eventos da permissão para alterá-los. As políticas do empregador e as permissões vinculadas a um calendário do Microsoft continuam valendo. Um evento visível ou um editor disponível não prova que o provedor aceitará uma atualização."
      ]
    },
    {
      "heading": "Uma visualização combinada pode incluir cópias de calendário",
      "body": [
        "As conexões com Google e Microsoft usam cópias de calendário no sistema de calendário do iPhone para apresentar e sincronizar eventos. Não presuma que conectar uma conta não deixa nenhuma cópia fora do provedor original. O destino usado para essas cópias pode depender das fontes de calendário disponíveis no dispositivo.",
        "Se a mesma conta também chegar ao telefone por outra rota, verifique os nomes e as fontes dos calendários antes de tratar eventos repetidos como eventos separados. Oculte temporariamente um calendário para identificar qual visualização ele fornece. Não exclua um evento ou calendário apenas para deixar a tela mais organizada: uma cópia conectada pode enviar alterações de volta ao provedor."
      ]
    },
    {
      "heading": "Continue escolhendo o destino ao criar um evento",
      "body": [
        "Antes de salvar, verifique o calendário do evento com o mesmo cuidado que a data e o horário. Para um compromisso de família, escolha o calendário que a família realmente usa; para uma reunião de trabalho, use o destino de trabalho permitido. Ver os dois calendários juntos não faz de nenhum deles o destino automático para todo novo evento.",
        "Alterar o calendário de um evento ou arrastá-lo entre calendários pode ser uma transferência, não uma segunda visualização inofensiva. Mantenha convites e reuniões recorrentes no calendário já estabelecido enquanto diagnostica um problema de exibição. Se precisar fazer uma mudança, primeiro determine quem é o proprietário do evento e qual calendário pode aceitá-lo."
      ]
    },
    {
      "heading": "Verifique a visão geral antes de confiar nela",
      "body": [
        "Compare um evento recente no calendário do próprio provedor com o evento correspondente no Cloud Calendars. Verifique a data, o fuso horário, o título e o calendário selecionado. Para um calendário editável que seja seu, um evento descartável sem convidados é um teste melhor do que alterar uma reunião real. Confirme o resultado no provedor antes de considerar a conexão pronta.",
        "Não conte com a visualização combinada para criar automaticamente blocos de ocupado anônimos em outra conta. Se você precisa que colegas vejam você como indisponível sem ver detalhes pessoais, use um arranjo de disponibilidade explicitamente aprovado e verifique do lado deles. Uma visão pessoal clara e disponibilidade compartilhada são tarefas separadas."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Liste a conta exata e o calendário de um evento de cada provedor.",
    "Ative os calendários do iCloud desejados no dispositivo e revise o acesso ao calendário.",
    "Use a entrada apropriada do Google ou Microsoft e selecione os calendários desejados.",
    "Compare um evento recente com a visualização do provedor antes de mudar qualquer coisa.",
    "Oculte temporariamente uma fonte suspeita de duplicação; mantenha os eventos subjacentes intactos.",
    "Verifique o calendário de destino em cada novo evento e, separadamente, confirme qualquer compartilhamento de períodos ocupados de que você precise."
  ],
  "faq": [
    {
      "q": "Meus colegas de trabalho verão meus eventos pessoais porque exibo os dois calendários?",
      "a": "Exibir calendários juntos não é uma instrução de compartilhamento nem uma ponte automática de períodos ocupados. Verifique as configurações reais de compartilhamento de cada calendário. As conexões com provedores podem criar cópias de calendário no dispositivo, portanto uma visualização combinada também não garante que os dados dos eventos existam apenas no provedor original."
    },
    {
      "q": "Por que consigo ver um evento, mas não editá-lo com sucesso?",
      "a": "O calendário pode ser somente leitura, o evento pode pertencer a outro organizador ou o provedor pode rejeitar a atualização. Verifique a propriedade e as permissões no calendário do provedor. Comprar um plano mais alto do app não altera essas permissões."
    },
    {
      "q": "Devo conectar a mesma conta do Google por todas as rotas disponíveis?",
      "a": "Primeiro, verifique como ela já aparece no telefone. Várias rotas podem dificultar a identificação de cópias de calendários. Escolha a rota que pretende usar, confira os eventos dela e, durante a análise, oculte uma exibição extra em vez de apagar dados ou desconectar contas como primeiro passo."
    }
  ],
  "sourcesHeading": "Fontes e referências de configuração",
  "sources": [
    {
      "label": "Apple: configure o iCloud Calendar nos seus dispositivos",
      "url": "https://support.apple.com/guide/icloud/set-up-calendar-mme4d73a8727/icloud"
    },
    {
      "label": "Google: compartilhamento e permissões do calendário",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: API do calendário do Outlook e dados de caixa de correio compatíveis",
      "url": "https://learn.microsoft.com/en-us/graph/outlook-calendar-concept-overview"
    }
  ],
  "seeAlso": [
    "exchange-calendars-on-an-iphone",
    "what-calendar-sync-actually-does",
    "when-two-calendars-disagree",
    "caldav-calendar-on-iphone",
    "calendar-export-ics-pdf-and-backup",
    "onecal-alternative-iphone-calendar-view-or-sync"
  ],
  "comparison": {
    "heading": "Visualização combinada, assinatura ou horários ocupados copiados?",
    "columns": [
      "O que você precisa",
      "O que verificar",
      "O que não presumir"
    ],
    "rows": [
      {
        "cells": [
          "Uma única visualização de várias contas",
          "A conta conectada, o calendário selecionado e o plano necessário.",
          "Que uma tela compartilhada una propriedade ou permissões."
        ]
      },
      {
        "cells": [
          "Uma edição de evento chegando ao provedor",
          "O evento original, a permissão de escrita e o resultado salvo na origem.",
          "Que uma edição local visível comprove uma sincronização bem-sucedida com o provedor."
        ]
      },
      {
        "cells": [
          "Horário ocupado em outra conta",
          "Um serviço com regras explícitas de sincronização da origem para o destino.",
          "Que uma visualização combinada crie blocos de disponibilidade para colegas."
        ]
      },
      {
        "cells": [
          "Um feed de calendário assinado",
          "O publicador, o comportamento de atualização e o status de somente leitura.",
          "Que uma assinatura ICS seja uma conexão editável de mão dupla."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-left",
    "hook"
  ],
  "galleryDevice": "iPad",
  "galleryCaption": "Visualizações reais de calendário no iPad ilustram a revisão de uma agenda. Uma captura de tela não demonstra a direção da sincronização do provedor nem as permissões da conta.",
  "actionHeading": "Revise seus calendários juntos no iPhone e no iPad",
  "actionText": "A sincronização com Google Calendar está incluída no Base. O Advanced remove anúncios; o Premium adiciona suporte a Microsoft Calendar e Teams. Confirme as permissões da conta independentemente do plano adquirido.",
  "articleLinks": [
    {
      "slug": "onecal-alternative-iphone-calendar-view-or-sync",
      "label": "Compare uma visualização combinada com as regras de sincronização do OneCal"
    },
    {
      "slug": "fantastical-readdle-calendar366-iphone-comparison",
      "label": "Compare fluxos de trabalho de calendário no iPhone"
    },
    {
      "slug": "weather-inside-your-calendar",
      "label": "Planeje com meteorologia e eventos juntos"
    }
  ]
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
