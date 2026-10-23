import type { LocalisedArticle } from '../types';

export const PRIORITY_PT_BR: Readonly<Record<string, LocalisedArticle>> = {
  "forecast-beside-every-event": {
    "title": "Verifique a previsão do tempo por hora para um evento do calendário no iPhone e iPad",
    "short": "Previsão do tempo para o horário do evento",
    "description": "Relacione o local, a data e os horários do seu evento com a previsão do tempo disponível.",
    "lede": "Para verificar a previsão do tempo de um evento do calendário, relacione três elementos: o local, a data local e o período entre o início e o fim do evento. No Cloud Calendars, escolha o local da previsão e consulte as horas disponíveis. O endereço de um evento e um ícone de tempo próximo, por si só, não provam que isso corresponda. A Arte Soft, desenvolvedora do app, publica este guia.",
    "commonBelief": "Que um ícone diário de clima em um calendário é o mesmo recurso que uma previsão vinculada a um evento.",
    "sections": [
      {
        "heading": "Comece pelo local e pela data",
        "body": [
          "Abra a previsão do local desejado e compare a data dela com a do evento no calendário. O clima no calendário pode refletir o local meteorológico selecionado, então verifique se ele é adequado para o evento em vez de presumir que o endereço do evento o controla.",
          "Um evento no próximo mês pode existir antes de haver dados meteorológicos disponíveis para essa data. Mantenha o evento e volte à previsão mais perto da data; a ausência de informação meteorológica não é uma previsão de tempo bom."
        ]
      },
      {
        "heading": "Use detalhes por hora para uma dúvida sobre horário",
        "body": [
          "Um resumo diário e uma previsão por hora respondem a perguntas diferentes. Se o evento durar das duas às cinco, examine as horas disponíveis que cobrem esse intervalo em vez de tratar um único ícone diário como o quadro completo.",
          "Se apenas parte do intervalo estiver disponível, deixe o restante em aberto. O app não promete clima horário completo para todos os eventos que você pode criar, e este guia não promete que abrir qualquer evento sempre mostrará toda a janela de previsão dele."
        ]
      },
      {
        "heading": "Separe probabilidade, quantidade e horário",
        "body": [
          "Leia o rótulo do valor que você está verificando. A probabilidade de precipitação não é a quantidade nem a duração da chuva. Da mesma forma, um valor por hora e um resumo diário cobrem períodos diferentes; compare períodos equivalentes ao avaliar dois horários possíveis.",
          "Escolha uma alternativa adequada ao seu plano em vez de tratar uma única porcentagem como uma regra universal de confirmar ou cancelar. As informações meteorológicas podem mudar, então consulte-as novamente quando for preciso tomar uma decisão."
        ]
      },
      {
        "heading": "Revise antes de salvar um evento baseado na previsão do tempo",
        "body": [
          "O app pode iniciar um rascunho de evento a partir de uma hora da previsão. Revise a data, o horário de início, o de término e o calendário de destino do rascunho antes de salvar. Selecionar a previsão não substitui a verificação de que você está criando o compromisso correto.",
          "Se o acesso ao calendário ou o calendário de destino impedir o salvamento, resolva essa permissão separadamente do acesso ao clima. Encontrar uma previsão não concede direitos de edição em um calendário compartilhado."
        ]
      },
      {
        "heading": "Use a previsão completa quando o resumo não bastar",
        "body": [
          "Para uma atividade ao ar livre, verifique as variáveis relevantes para essa atividade e para o local que você realmente escolheu. Um widget de clima atual ou uma demonstração na página inicial não substitui a verificação das horas de previsão disponíveis no app.",
          "Se você notar uma discrepância, compare primeiro o local e o registro de data e hora. Provedores diferentes, locais selecionados e períodos de previsão podem gerar exibições diferentes sem provar que o evento do calendário mudou."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Confirme o local e a data do evento.",
      "Verifique as horas disponíveis ao longo da atividade.",
      "Leia probabilidade e quantidade como valores diferentes.",
      "Revise o rascunho do evento antes de salvar."
    ],
    "seeAlso": [
      "weather-inside-your-calendar",
      "planning-outdoors-without-being-rained-on"
    ],
    "updated": "2026-10-23",
    "faq": [
      {
        "q": "Todo evento tem uma previsão completa?",
        "a": "Não. A cobertura depende do local selecionado e das datas e horas disponíveis."
      },
      {
        "q": "O ícone do clima é específico do endereço do evento?",
        "a": "Não conclua isso pela proximidade com o evento. Confirme separadamente o local meteorológico."
      },
      {
        "q": "Tocar em uma hora salva um novo evento?",
        "a": "Isso inicia um rascunho de evento, quando disponível. Revise a data, o horário e o calendário antes de salvar."
      }
    ],
    "sourcesHeading": "Fontes de clima e ajustes de localização",
    "sources": [
      {
        "label": "Apple: previsões do WeatherKit e disponibilidade regional",
        "url": "https://developer.apple.com/weatherkit/"
      },
      {
        "label": "Apple: Privacidade e Serviços de Localização",
        "url": "https://support.apple.com/en-us/102515"
      }
    ],
    "comparison": {
      "heading": "Uma verificação prática antes de um evento ao ar livre",
      "columns": [
        "Verificação",
        "Exemplo",
        "Decisão"
      ],
      "rows": [
        {
          "cells": [
            "Local",
            "O evento é em outra cidade.",
            "Selecione esse destino na visualização do tempo e leia o nome dele."
          ]
        },
        {
          "cells": [
            "Período",
            "A atividade vai das 14:00 às 16:00.",
            "Verifique as duas horas, além da preparação ou do deslocamento relevantes."
          ]
        },
        {
          "cells": [
            "Cobertura",
            "Apenas algumas das horas necessárias estão disponíveis.",
            "Mantenha o plano provisório e programe outra verificação."
          ]
        },
        {
          "cells": [
            "Evento salvo",
            "Você inicia um rascunho a partir de um horário da previsão.",
            "Revise a data, o fuso horário, a duração e o calendário de destino antes de salvar."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-right",
      "week-left"
    ],
    "galleryCaption": "As visualizações de tempo e de semana mostram partes diferentes da mesma tarefa de planejamento. Confirme separadamente o local da previsão e o local do evento.",
    "actionHeading": "Compare a previsão com seus eventos reais",
    "actionText": "Use Cloud Calendars no iPhone ou iPad para revisar a previsão disponível e sua agenda. O tempo orienta sua escolha; ele não move automaticamente um evento nem confirma uma alteração com os participantes.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Entenda as visualizações de calendário e tempo"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Escolha uma visão geral rápida para a Tela de Início"
      },
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Verifique os calendários por trás da sua agenda"
      }
    ]
  },
  "the-widget-that-shows-what-is-next": {
    "updated": "2026-10-23",
    "title": "Widgets de calendário no iPhone e iPad: próximos eventos e tempo",
    "short": "Próximos eventos na Tela de Início",
    "description": "Escolha um widget do Cloud Calendars para próximos eventos, a data ou o tempo.",
    "lede": "Escolha Calendar Events ou Calendar Events Large quando quiser ver os próximos eventos na sua Tela de Início. Escolha Calendar & Weather para uma exibição de data e tempo. Esses layouts respondem a perguntas diferentes; visualize o que está disponível no seu dispositivo antes de adicionar. Este guia é publicado pela Arte Soft, desenvolvedora do Cloud Calendars.",
    "sections": [
      {
        "heading": "Primeiro, escolha o layout de eventos",
        "body": [
          "Na galeria de widgets do Cloud Calendars, Calendar Events é o layout médio em lista de eventos. Calendar Events Large oferece mais espaço para próximos eventos. Calendar & Weather é um layout separado de data e clima; o tamanho pequeno não garante uma linha com o próximo evento. Os nomes podem aparecer traduzidos no seu dispositivo.",
          "No iPhone, toque e segure uma área vazia da Tela de Início, escolha Editar e Adicionar Widget, depois encontre Cloud Calendars e selecione o layout desejado. Compare a prévia antes de adicioná-lo. As instruções da Apple sobre widgets cobrem essa galeria do sistema; ela é separada das visualizações de calendário dentro do app."
        ]
      },
      {
        "heading": "Adicionar e verificar o widget no iPad",
        "body": [
          "No iPad, use a galeria de widgets da Tela de Início da Apple: toque e segure o plano de fundo, abra Editar e depois Adicionar Widget. Procure Cloud Calendars, examine os estilos e tamanhos oferecidos, adicione o layout de que você precisa, posicione-o e finalize com OK. Siga os controles mostrados pela sua versão do iPadOS; uma prévia não confirma que os dados do seu calendário foram carregados.",
          "Escolha Calendar Events ou Calendar Events Large quando precisar de eventos. Compare os estilos oferecidos pelo app instalado; um bloco de data e clima responde a algo diferente de uma lista de eventos.",
          "Abra o Cloud Calendars nesse iPad e localize um evento futuro com horário definido em um calendário selecionado. Uma visualização correta no iPhone não confirma as contas, o acesso ou os dados carregados no iPad. Compare o título, a data e o horário de início e, se o widget estiver diferente, prossiga com as verificações de elegibilidade e atualização abaixo."
        ]
      },
      {
        "heading": "Verifique o que conta como próximo",
        "body": [
          "A exibição de eventos usa os calendários selecionados e eventos futuros com horário definido. Entradas de dia inteiro e eventos cujo horário de início já passou ficam excluídos dessa lista de próximos eventos. Por isso, um aniversário ou uma reunião em andamento pode estar visível no app sem aparecer aqui.",
          "Por exemplo, se a sua única entrada de hoje for um lembrete de viagem de dia inteiro, uma lista vazia de próximos eventos não significa que esse lembrete foi perdido. Abra o app para verificar o dia completo. Da mesma forma, o próximo evento com horário definido pode ser amanhã ou depois; leia a data em vez de presumir que toda linha é de hoje."
        ]
      },
      {
        "heading": "Diferencie um evento ausente de uma lista sem mais linhas",
        "body": [
          "Um widget mostra um conjunto limitado de próximos eventos. Se eventos anteriores ocuparem as linhas, um evento posterior pode não aparecer mesmo estando no app e sendo elegível para a lista de próximos eventos. Um layout de eventos maior pode mostrar mais linhas; ainda assim, não é o calendário completo.",
          "Comece pelo evento futuro com horário definido mais próximo em um calendário selecionado. Se ele aparecer, mas um posterior não, abra o app para verificar o restante da agenda. Se o evento elegível mais próximo também estiver ausente, continue com as verificações de seleção de calendário, acesso e atualização. Não mova nem exclua eventos só para fazer uma entrada posterior aparecer."
        ]
      },
      {
        "heading": "Faça do app a sua primeira comparação",
        "body": [
          "Abra o Cloud Calendars e localize um evento futuro específico com horário definido. Confirme que o calendário ao qual ele pertence está selecionado e que o app tem o acesso ao calendário de que precisa. Compare o título, a data e o horário de início com o widget. Se o evento também estiver ausente no app, investigue primeiro a conta ou a sincronização.",
          "Use um evento de teste inofensivo em um calendário seu se precisar de um exemplo claro. Defina um início futuro e um título fácil de reconhecer. Evite alterar um convite real ou remover contas apenas para testar a Tela de Início."
        ]
      },
      {
        "heading": "Considere as atualizações sem presumir um prazo fixo",
        "body": [
          "Os widgets exibem informações salvas e não ficam em execução contínua como um app aberto. A Apple controla a programação de atualização deles. Abrir o app e verificar o evento oferece um ponto de comparação atualizado, mas isso não estabelece um número exato de segundos até que o widget precise mudar.",
          "Se o app continuar correto enquanto o widget permanecer incorreto, anote o layout, o calendário selecionado, o horário do evento e as versões do app e do iOS. Lista vazia, evento antigo e horário incorreto são observações diferentes; informe qual delas você está vendo."
        ]
      },
      {
        "heading": "Leia o clima como um resumo separado",
        "body": [
          "O clima ao lado da data não é uma previsão vinculada ao local e ao horário de início de cada evento. Antes de um evento ao ar livre, abra a visualização do clima e verifique o local e a hora pretendidos. Um ícone das condições atuais não pode determinar quais serão as condições em uma reunião posterior.",
          "Mantenha este widget para uma orientação rápida. Use o calendário completo para compromissos de dia inteiro, detalhes dos eventos e decisões que exigem a agenda inteira."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Escolha Calendar Events ou Calendar Events Large para uma lista de eventos.",
      "Verifique um evento futuro com horário definido em um calendário selecionado.",
      "Compare a data e o horário dele no app antes de investigar o widget.",
      "Registre diferenças persistentes em vez de excluir dados do calendário."
    ],
    "faq": [
      {
        "q": "Por que meu aniversário não aparece?",
        "a": "A lista de próximos eventos exclui eventos de dia inteiro. Consulte o calendário completo para aniversários e outras entradas apenas com data."
      },
      {
        "q": "O widget pequeno mostra a próxima reunião?",
        "a": "O layout pequeno Calendar & Weather mostra data e clima. Escolha um layout de lista de eventos para ver eventos."
      },
      {
        "q": "Não haver próximo evento significa que estou livre hoje?",
        "a": "Não. Entradas de dia inteiro, eventos em andamento, calendários não selecionados e informações desatualizadas podem mudar essa conclusão."
      }
    ],
    "sourcesHeading": "Fontes e instruções da Apple",
    "sources": [
      {
        "label": "Apple: adicionar e editar widgets no iPhone",
        "url": "https://support.apple.com/118610"
      },
      {
        "label": "Apple: manter um widget atualizado",
        "url": "https://developer.apple.com/documentation/widgetkit/keeping-a-widget-up-to-date"
      },
      {
        "label": "Apple: adicionar, editar e remover widgets no iPad",
        "url": "https://support.apple.com/guide/ipad/add-edit-and-remove-widgets-ipadb0de8630/ipados"
      }
    ],
    "seeAlso": [
      "choosing-a-widget-size",
      "a-countdown-to-your-next-meeting",
      "calendar-on-apple-watch"
    ],
    "comparison": {
      "heading": "Escolha a visualização de que você realmente precisa",
      "columns": [
        "Visualização",
        "Use para",
        "Verifique antes de confiar"
      ],
      "rows": [
        {
          "cells": [
            "Calendar Events",
            "Uma visualização compacta de próximos eventos com horário definido.",
            "O evento pertence a um calendário selecionado e ainda não começou."
          ]
        },
        {
          "cells": [
            "Calendar Events Large",
            "Mais espaço para próximos eventos.",
            "Mesmo um layout maior tem um número limitado de linhas."
          ]
        },
        {
          "cells": [
            "Calendar & Weather",
            "Uma visão rápida de data e clima.",
            "O layout pequeno não garante uma linha de próximo evento."
          ]
        },
        {
          "cells": [
            "Live Activity",
            "Uma contagem regressiva separada para o próximo evento em áreas compatíveis do iPhone.",
            "Não é um widget da Tela de Início nem um layout dedicado de widget da Tela Bloqueada."
          ]
        }
      ]
    },
    "galleryKinds": [
      "widgets",
      "live"
    ],
    "galleryCaption": "Os widgets da Tela de Início e a Live Activity são visualizações separadas. Selecione o layout que corresponde às informações de que você precisa.",
    "actionHeading": "Coloque a parte útil da sua agenda na Tela de Início",
    "actionText": "Abra o Cloud Calendars, verifique um evento futuro conhecido com horário definido e depois adicione o widget apropriado no seu iPhone ou iPad. O app continua sendo o lugar para consultar o calendário completo.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Ver o clima ao lado da sua agenda"
      },
      {
        "slug": "forecast-beside-every-event",
        "label": "Verificar os horários de um evento ao ar livre"
      },
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Verificar suas contas de calendário conectadas"
      }
    ]
  },
  "onecal-alternative-iphone-calendar-view-or-sync": {
    "updated": "2026-10-23",
    "title": "Cloud Calendars ou OneCal? Escolha entre visualização combinada ou sincronização de calendário",
    "short": "Cloud Calendars e OneCal por fluxo de trabalho",
    "description": "Compare OneCal e Cloud Calendars por visualizações, eventos copiados, controles móveis e planos.",
    "lede": "Escolha pelo resultado de que você precisa: revisar várias agendas juntas, editar um evento original ou copiar horários ocupados para outra conta. Cloud Calendars oferece visualizações de planejamento no iPhone e no iPad; o OneCal documenta uma Unified Calendar View e regras separadas de Calendar Sync. Esta comparação é publicada pela Arte Soft, desenvolvedora do Cloud Calendars.",
    "commonBelief": "Dois produtos que mostram calendários do Google, iCloud e Outlook necessariamente mantêm disponibilidade, edições de eventos e cópias sincronizadas da mesma forma.",
    "sections": [
      {
        "heading": "Escolha entre uma visão geral e uma alteração em outra conta",
        "body": [
          "Se o seu objetivo é ver um compromisso pessoal ao lado de uma reunião de trabalho, você precisa de uma visualização combinada. Se o seu calendário de trabalho também precisa conter um bloco de ocupado para o compromisso pessoal, você precisa de um fluxo de trabalho definido da origem para o destino. O primeiro resultado não estabelece o segundo.",
          "Cloud Calendars reúne calendários selecionados em uma visualização de planejamento no iPhone e no iPad. O OneCal documenta a Unified Calendar View separadamente do Calendar Sync; segundo o publicador, você pode usar essa visualização sem configurar regras de sincronização. Decida qual resultado importa antes de conectar contas ou comparar nomes de assinatura."
        ]
      },
      {
        "heading": "Entenda o que um evento copiado pode alterar",
        "body": [
          "A documentação do Calendar Sync do OneCal descreve regras unidirecionais e multidirecionais que criam eventos clonados. Seu guia separado de cobertura informa que edições em um clone não são propagadas de volta ao original. Identifique o original e o calendário proprietário antes de tratar um compromisso copiado como o lugar para reagendar uma reunião.",
          "As conexões de provedor do Cloud Calendars também podem criar calendários espelhados no armazenamento do iOS. Uma exibição combinada não prova que os registros foram mesclados nem que uma edição chegou ao provedor. Em um calendário que você possui e pode editar, verifique um evento descartável sem convidados tanto no provedor quanto no app."
        ]
      },
      {
        "heading": "Verifique os controles no dispositivo que você realmente vai usar",
        "body": [
          "O guia móvel atual do OneCal descreve a criação e a edição de eventos de calendário, opções de recorrência, RSVP e entrada em reuniões. Ele também informa separadamente que criar, editar, pausar ou excluir configurações de Calendar Sync acontece no app web; no celular, essas configurações são apenas exibidas. A configuração de links de agendamento também é descrita como uma tarefa da web.",
          "Cloud Calendars é um app para iPhone e iPad com visualizações por dia, semana, mês, ano e lista. Faça a edição necessária na visualização instalada, leia qualquer opção de recorrência e confirme o evento salvo. Não suponha que o menu móvel, o fluxo de agendamento ou os controles de automação de outro produto existam nele."
        ]
      },
      {
        "heading": "Verifique a cobertura em vez de presumir histórico ilimitado",
        "body": [
          "O guia atual de cobertura do OneCal lista uma janela futura de sincronização de até um ano para Google e iCloud e de até três meses para Outlook. Ele também distingue séries recorrentes futuras de eventos históricos avulsos. Esses são limites documentados pelo publicador, não um teste da sua conta específica nem uma afirmação sobre todos os recursos da visualização de calendário.",
          "Cloud Calendars também exige verificar a rota da conta, os calendários selecionados e as datas relevantes. Se reuniões antigas forem essenciais, compare um evento identificado no provedor e no app. Um app de calendário não é automaticamente um backup completo nem uma garantia de que todo registro passado foi recuperado."
        ]
      },
      {
        "heading": "Compare os requisitos dos planos e a forma de cobrança",
        "body": [
          "Cloud Calendars inclui sincronização com Google Calendar no Base; o Advanced remove anúncios e o Premium adiciona suporte a Microsoft Calendar e Teams. Verifique as permissões da conta separadamente do plano. Antes de comprar, confira o preço local atual e o período de cobrança, em vez de usar uma comparação fixa de preços internacionais.",
          "O guia de planos web do OneCal descreve planos por membro e um teste de quatorze dias, incluindo a remoção de clones quando o teste expira. O guia de cobrança no celular descreve compras gerenciadas pela loja e restrições para adicionar membros da equipe. Verifique quais recursos exigem um plano contínuo e onde a compra é gerenciada; um download gratuito, por si só, não responde a essas questões."
        ]
      },
      {
        "heading": "Teste seu fluxo real de planejamento antes de mudar",
        "body": [
          "Se meteorologia, widgets ou uma Live Activity forem importantes, inclua esses itens no teste no dispositivo que você usa. Cloud Calendars oferece essas superfícies de planejamento, com meteorologia limitada às datas disponíveis e ao local selecionado. As páginas do OneCal analisadas aqui não estabelecem equivalência de recursos para essas superfícies; verifique o produto atual em vez de inferir ausência a partir de um guia.",
          "Mantenha os apps originais e os detalhes de conexão até verificar o resultado necessário. Registre se você confirmou visibilidade, edição do evento original, cópia de horário ocupado ou um lembrete; são resultados diferentes. Antes de desconectar um serviço, revise o que acontece com as cópias existentes e evite testar em um convite ativo ou em uma reunião real com cliente."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Anote se você precisa de uma visualização combinada ou de eventos copiados para outra conta.",
      "Identifique originais, cópias e a conta proprietária de cada evento importante.",
      "Verifique os controles necessários no seu fluxo real de telefone, tablet ou web.",
      "Compare uma semana comum e quaisquer datas históricas das quais você depende.",
      "Verifique os requisitos atuais do plano, o preço local e o provedor da compra.",
      "Valide um evento descartável e revise as regras de remoção de cópias antes de mudar."
    ],
    "faq": [
      {
        "q": "Uma visualização combinada de calendário é o mesmo que sincronizar horários ocupados?",
        "a": "Não. Uma visualização combinada permite comparar compromissos. Criar uma entrada em outra conta exige um fluxo de trabalho separado e compatível; o OneCal documenta as regras de Calendar Sync separadamente da sua Unified Calendar View."
      },
      {
        "q": "Posso alterar um clone do OneCal para reagendar a reunião original?",
        "a": "O guia de cobertura informa que edições em clones não são propagadas para o original. Identifique o evento original e siga as permissões de edição e de organizador do calendário dele."
      },
      {
        "q": "Qual app é mais barato para a minha configuração?",
        "a": "Isso depende dos recursos, das contas, da forma de cobrança e do preço local de que você precisa. Cloud Calendars inclui sincronização com Google no Base e suporte da Microsoft no Premium. Revise o plano atual e os termos de cobrança móvel do OneCal para o fluxo de trabalho pretendido; este guia não afirma um vencedor universal de preço."
      }
    ],
    "sourcesHeading": "Documentação oficial do OneCal sobre fluxo de trabalho e planos",
    "sources": [
      {
        "label": "OneCal: recursos móveis e tarefas de configuração exclusivas da web",
        "url": "https://docs.onecal.io/docs/mobile-apps"
      },
      {
        "label": "OneCal: Calendar Sync e regras da origem para o destino",
        "url": "https://docs.onecal.io/docs/calendar-sync/calendar-sync-intro"
      },
      {
        "label": "OneCal: janelas de sincronização e edições em eventos clonados",
        "url": "https://docs.onecal.io/docs/calendar-sync/what-does-onecal-sync"
      },
      {
        "label": "OneCal: planos, teste e comportamento no vencimento",
        "url": "https://docs.onecal.io/docs/billing/plans-and-free-trial"
      },
      {
        "label": "OneCal: assinaturas da App Store e do Google Play",
        "url": "https://docs.onecal.io/docs/billing/mobile-subscriptions"
      }
    ],
    "seeAlso": [
      "what-calendar-sync-actually-does",
      "three-calendar-apps-is-two-too-many",
      "free-google-sync-without-adverts",
      "disconnect-calendar-integration-without-losing-track",
      "what-fantastical-costs-and-what-this-does"
    ],
    "comparison": {
      "heading": "Compare o fluxo de trabalho antes da assinatura",
      "columns": [
        "Pergunta",
        "Cloud Calendars",
        "Documentação do OneCal"
      ],
      "rows": [
        {
          "cells": [
            "Onde reviso minha agenda?",
            "No iPhone e no iPad, com visualizações por dia, semana, mês, ano e lista.",
            "A Unified Calendar View é separada da configuração do Calendar Sync."
          ]
        },
        {
          "cells": [
            "Preciso de blocos de ocupado copiados entre contas?",
            "Não deduza isso da visualização combinada; conexões com provedores podem espelhar calendários localmente.",
            "O Calendar Sync cria eventos clonados usando regras unidirecionais ou multidirecionais."
          ]
        },
        {
          "cells": [
            "Onde altero as regras de sincronização?",
            "Use os controles documentados para a conexão de conta do app.",
            "O guia móvel analisado atribui as mudanças de configuração de sincronização ao app web."
          ]
        },
        {
          "cells": [
            "De qual plano do Cloud Calendars eu preciso?",
            "O Base inclui sincronização com Google Calendar; o Advanced remove anúncios; o Premium adiciona Microsoft Calendar e Teams.",
            "Verifique o plano atual do OneCal e a forma de cobrança para o fluxo de trabalho necessário."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-left",
      "hook"
    ],
    "galleryCaption": "As telas reais de calendário do Cloud Calendars mostram a visualização de planejamento. A comparação distingue essa visualização das regras de clonagem no servidor de um serviço.",
    "actionHeading": "Escolha o resultado que você quer verificar",
    "actionText": "Para uma visão geral no iPhone ou iPad com meteorologia e widgets, experimente o Cloud Calendars com um evento de teste inofensivo. Se a sua exigência for copiar horários ocupados para outra conta, avalie um serviço que documente explicitamente essa operação.",
    "articleLinks": [
      {
        "slug": "icloud-google-and-outlook-in-one-view",
        "label": "Configurar uma visualização combinada dos calendários"
      },
      {
        "slug": "fantastical-readdle-calendar366-iphone-comparison",
        "label": "Comparar outras opções de calendário para iPhone"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Escolher o que mostrar na Tela de Início"
      }
    ]
  },
  "fantastical-readdle-calendar366-iphone-comparison": {
    "updated": "2026-10-23",
    "title": "Alternativas de calendário para iPhone: Cloud Calendars, Fantastical, Readdle e BusyCal",
    "short": "Compare alternativas de calendário para iPhone",
    "description": "Compare calendários para iPhone por clima, visualizações, tarefas e pelo fluxo de trabalho de que você precisa.",
    "lede": "Escolha um calendário pelo trabalho que você quer concluir: revisar eventos com previsão do tempo, inserir um evento rapidamente, gerenciar tarefas ou combinar visualizações de contas. Cloud Calendars, Fantastical, Calendars by Readdle, Calendar 366 e BusyCal diferem nesses fluxos de trabalho e nos requisitos de seus planos. A Arte Soft desenvolve o Cloud Calendars e publica esta comparação.",
    "sections": [
      {
        "heading": "Escolha o que precisa funcionar antes de comparar a aparência",
        "body": [
          "Anote seus provedores de calendário, dispositivos e três ações essenciais. Por exemplo: ver juntos os calendários de trabalho e pessoal, concluir um lembrete e adicionar uma reunião rapidamente. Teste essas ações com dados de exemplo privados antes de importar toda a sua agenda.",
          "O fato de um produto oferecer suporte ao nome do seu provedor não significa que todos os métodos de conexão tenham permissões ou recursos idênticos. Um calendário do dispositivo, uma conta conectada diretamente e um feed assinado podem gerar entradas visualmente parecidas, mas permitir ações diferentes."
        ]
      },
      {
        "heading": "Use o calendário do próprio provedor como referência",
        "body": [
          "O guia de introdução do Google descreve a interface do próprio calendário para agendamento, tarefas, compartilhamento e vários calendários. Se a sua agenda já está lá, teste a ação necessária na origem antes de decidir se você precisa de outro app.",
          "Por exemplo, compare o mesmo evento no Google Calendar e no Fantastical depois de conectar a conta desejada. Verifique se a vantagem de que você precisa é uma visualização combinada, uma conexão com tarefas, inserção rápida ou uma interface específica do dispositivo. Um cliente de calendário diferente não significa automaticamente migrar para outro provedor."
        ]
      },
      {
        "heading": "Fantastical: verifique as conexões de conta e a inserção rápida",
        "body": [
          "A Flexibits documenta tanto conexões diretas com contas de calendário quanto opções para calendários e lembretes já configurados no iOS. Seu guia de introdução recomenda conexões diretas para uso completo dos recursos do app. Identifique qual caminho você escolheu, em vez de conectar o mesmo calendário duas vezes sem motivo.",
          "O Fantastical também documenta a inserção baseada em frases e modelos reutilizáveis de evento ou tarefa. Teste uma data explícita, uma duração e o calendário de destino, depois inspecione o resultado salvo. Essa sintaxe pertence ao Fantastical; o campo de texto de outro app pode interpretar a mesma frase de forma diferente."
        ]
      },
      {
        "heading": "Calendars by Readdle: verifique a origem das tarefas",
        "body": [
          "A Readdle apresenta calendários do Google, Outlook e iCloud junto com recursos de tarefas e inserção em linguagem natural. Seu guia de configuração de tarefas descreve a seleção de iOS Reminders ou Google Tasks em Task Options. Essa escolha importa se concluir uma tarefa no telefone precisa atualizar uma lista original específica.",
          "Use uma tarefa descartável para testar a conclusão nas duas pontas, não apenas se um título aparece em uma linha do tempo. Se você também precisar de uma visualização ou ação no Mac, além do iPhone, teste lá também. Não presuma controles idênticos só por causa de um nome de produto compartilhado."
        ]
      },
      {
        "heading": "Calendar 366: verifique o acesso ao sistema, os conjuntos e a localização do clima",
        "body": [
          "A documentação do Calendar 366 distingue o acesso aos calendários e lembretes do sistema das integrações diretas com contas. Ela descreve conjuntos de calendários que selecionam os calendários e listas visíveis. Esses conjuntos também podem determinar um calendário padrão, então verifique a qual calendário um novo evento pertencerá.",
          "A mesma documentação descreve seu próprio analisador de linguagem natural e o clima usando Apple Weather, com opções de localização do sistema ou personalizada. Para planejar atividades ao ar livre, confirme o local selecionado em vez de supor que a previsão acompanha o endereço de cada evento. Esses são recursos documentados pelo publicador, não recursos testados na sua conta."
        ]
      },
      {
        "heading": "BusyCal: verifique a exibição de tarefas e a visualização usada para o clima",
        "body": [
          "O guia de tarefas do BusyCal para iOS distingue tarefas com data, com horário e sem data. Ele descreve controles de conclusão e o adiamento de tarefas com data não concluídas. Seu guia de clima coloca previsões nas visualizações Lista, Dia e Mês, então teste a visualização específica que você usa em vez de supor que o clima aparece em toda parte.",
          "O BusyCal também documenta a inserção em linguagem natural como uma opção nos padrões de novo evento. Experimente o mesmo evento privado de exemplo usado nos outros apps e depois verifique o calendário e o horário salvos. Esses são controles do BusyCal, não comandos compartilhados por todos os apps de calendário."
        ]
      },
      {
        "heading": "Verifique o fluxo de trabalho no Watch separadamente do telefone",
        "body": [
          "O guia do Fantastical para Watch documenta as visualizações Up Next, List e Tasks, incluindo a conclusão de tarefas. O guia de tarefas do BusyCal distingue tarefas com data e com horário mostradas no Watch de tarefas sem data. Se um backlog sem data for importante, inclua-o no seu teste em vez de testar apenas o próximo evento.",
          "Uma complicação no Watch oferece uma visão rápida, enquanto o app no Watch pode oferecer ações adicionais. Verifique os dados e a ação no relógio e no telefone reais, e revise o plano atual. As interfaces de desktop, telefone e relógio não são intercambiáveis só porque usam o mesmo nome de produto."
        ]
      },
      {
        "heading": "Trate preço e direitos do plano como uma verificação separada",
        "body": [
          "Verifique a tela local de compra atual, os recursos disponíveis após o fim de um teste e se uma compra anterior altera seus direitos. Download gratuito, assinatura recorrente e compra antiga não necessariamente desbloqueiam o mesmo conjunto de recursos.",
          "As páginas dos publicadores podem mudar em momentos diferentes. O FAQ atual do produto da Readdle descreve vários recursos centrais como gratuitos, enquanto uma página de ajuda separada sobre gratuito versus completo lista uma divisão diferente. Em vez de tratar uma descrição como uma promessa universal, verifique a ação necessária no app instalado e seus termos de compra atuais."
        ]
      },
      {
        "heading": "Onde o Cloud Calendars se encaixa na lista curta",
        "body": [
          "O Cloud Calendars é outra opção para iPhone e iPad, com calendários selecionados, várias visualizações de planejamento, clima e widgets. A sincronização com Google está incluída no Base, o Advanced remove anúncios e o Premium adiciona suporte ao Microsoft Calendar. Verifique o plano atual e as permissões do provedor para a sua configuração.",
          "Se uma conexão especializada com tarefas, um comando de modelo ou um fluxo de trabalho no desktop for essencial, use o produto que documenta e executa com sucesso esse requisito. Compare os resultados salvos e o esforço diário; uma lista de verificação deve ajudar você a escolher, não sugerir que todos os recursos mencionados aqui existem no Cloud Calendars."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Liste suas contas, dispositivos e ações essenciais.",
      "Escolha uma rota de conexão de conta e inspecione os calendários que ela disponibiliza.",
      "Teste a inserção rápida e a conclusão de tarefas com exemplos inofensivos.",
      "Verifique a localização do clima e as visualizações usadas em cada dispositivo.",
      "Confira os termos de compra atuais após qualquer período de teste ou direito antigo."
    ],
    "faq": [
      {
        "q": "Qual é a melhor alternativa ao Fantastical?",
        "a": "Depende do fluxo de trabalho de que você precisa. Compare fontes de calendários e tarefas, inserção de eventos, suporte a dispositivos e direitos atuais do plano. Este guia não declara um vencedor universal de desempenho."
      },
      {
        "q": "O mesmo nome de provedor significa que todos os apps sincronizam da mesma forma?",
        "a": "Não. Verifique separadamente conexões diretas, calendários do dispositivo, feeds e permissões, e depois confirme uma mudança de exemplo na origem."
      },
      {
        "q": "Posso presumir que todo recurso anunciado é gratuito?",
        "a": "Não. Verifique o app instalado, a tela local de compra e os recursos que permanecem após um teste. A documentação do publicador pode descrever versões ou direitos de plano diferentes."
      }
    ],
    "sourcesHeading": "Documentação oficial consultada para este guia",
    "sources": [
      {
        "label": "Fantastical: rotas de conexão de conta",
        "url": "https://flexibits.com/fantastical-ios/help/getting-started"
      },
      {
        "label": "Fantastical: inserção em linguagem natural e modelos",
        "url": "https://flexibits.com/fantastical-ios/help/adding-events-and-tasks"
      },
      {
        "label": "Readdle: recursos atuais do produto e FAQ",
        "url": "https://readdle.com/calendars"
      },
      {
        "label": "Readdle: seleção da origem das tarefas",
        "url": "https://support.readdle.com/calendars/synchronization/how-to-sync-tasks-with-ios-reminders-or-google-tasks"
      },
      {
        "label": "Readdle: orientação separada para plano gratuito/completo",
        "url": "https://apphelp.readdle.com/en/index.php?id=585&pg=kb.page"
      },
      {
        "label": "Calendar 366: integrações, conjuntos, inserção rápida e clima",
        "url": "https://calendar366.com/help/index.html"
      },
      {
        "label": "BusyCal para iOS: tarefas e limites de tarefas no Watch",
        "url": "https://www.busymac.com/docs/busycalios/70659-tasks/"
      },
      {
        "label": "BusyCal para iOS: clima e visualizações compatíveis",
        "url": "https://www.busymac.com/docs/busycalios/70665-weather/"
      },
      {
        "label": "BusyCal para iOS: inserção em linguagem natural",
        "url": "https://www.busymac.com/docs/busycalios/70669-natural-language/"
      },
      {
        "label": "Fantastical: visualizações e ações no Apple Watch",
        "url": "https://flexibits.com/fantastical-ios/help/apple-watch"
      },
      {
        "label": "Google: interface do próprio Calendar baseada em conta",
        "url": "https://support.google.com/calendar/answer/2465776?hl=en"
      }
    ],
    "seeAlso": [
      "what-fantastical-costs-and-what-this-does",
      "natural-language-calendar-events-iphone",
      "iphone-calendar-tasks-reminders-versus-event-alerts"
    ],
    "comparison": {
      "heading": "Comece pelo seu principal requisito",
      "columns": [
        "Requisito",
        "Opções relevantes para verificar",
        "Distinção importante"
      ],
      "rows": [
        {
          "cells": [
            "Eventos com clima e visualizações para iPhone/iPad",
            "Cloud Calendars e as visualizações de clima documentadas nos apps comparados.",
            "Verifique o local da previsão, o período disponível e a visualização; a cobertura do clima não é ilimitada."
          ]
        },
        {
          "cells": [
            "Inserção de eventos em linguagem natural",
            "Fantastical e o recurso relevante do Readdle ou BusyCal.",
            "A interpretação de frases não é o mesmo que ditado ou edição comum de eventos."
          ]
        },
        {
          "cells": [
            "Tarefas ao lado dos eventos",
            "A origem de tarefas documentada no Readdle, Calendar 366, BusyCal ou Fantastical.",
            "Um lembrete de evento não é uma integração de conclusão de tarefas."
          ]
        },
        {
          "cells": [
            "Sincronização com Google Calendar e remoção opcional de anúncios",
            "O Base do Cloud Calendars inclui sincronização com Google Calendar; o Advanced remove anúncios.",
            "O suporte a Microsoft Calendar e Teams exige o Premium."
          ]
        },
        {
          "cells": [
            "Um modelo de compra diferente",
            "A listagem atual na loja e os direitos do plano para cada app e plataforma.",
            "Um download gratuito não prova que todos os recursos são grátis; preços e planos regionais podem mudar."
          ]
        }
      ]
    },
    "galleryKinds": [
      "week-left",
      "week-right",
      "widgets"
    ],
    "galleryDevice": "iPad",
    "galleryCaption": "Estas são telas do Cloud Calendars mostrando as visualizações, o clima e os widgets do app. Elas não são capturas de tela dos outros produtos da comparação.",
    "actionHeading": "Teste o calendário com uma necessidade real de planejamento",
    "actionText": "Se o seu principal requisito for uma agenda no iPhone ou iPad com clima e widgets, avalie o Cloud Calendars com um evento descartável. Mantenha separados os requisitos especializados de tarefas, reservas e linguagem natural ao comparar produtos.",
    "articleLinks": [
      {
        "slug": "weather-inside-your-calendar",
        "label": "Veja como o clima se encaixa no fluxo de trabalho do calendário"
      },
      {
        "slug": "the-widget-that-shows-what-is-next",
        "label": "Compare os widgets do Cloud Calendars"
      },
      {
        "slug": "onecal-alternative-iphone-calendar-view-or-sync",
        "label": "Diferencie uma visualização combinada de tempo ocupado copiado"
      }
    ]
  }
};
