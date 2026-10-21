import { LocalisedArticle } from '../types';

export const HELP_ES_ES: Readonly<Record<string, LocalisedArticle>> = {
  "disconnect-calendar-integration-without-losing-track": {
  "updated": "2026-10-22",
  "title": "Desconectar un calendario: acceso, sincronización y copias existentes",
  "short": "Desconecta una integración de calendario con cuidado",
  "description": "Distingue cierre de sesión, acceso del proveedor y copias existentes. Revisa las conexiones de Cloud Calendars antes de desconectar o quitar un calendario.",
  "lede": "Detener una conexión y retirar sus copias de calendario son decisiones distintas. Identifica la vía que utilizas y conserva la información necesaria antes de elegir una acción de desconexión. Esta guía la publica Arte Soft, desarrollador de Cloud Calendars.",
  "commonBelief": "Cerrar sesión solo pausa las actualizaciones, revoca todos los permisos relacionados y deja intactos todos los datos existentes del calendario.",
  "sections": [
    {
      "heading": "Identifica la conexión que quieres detener",
      "body": [
        "Empieza por la cuenta y el calendario propietarios de los eventos. Una cuenta añadida desde Ajustes del iPhone, una conexión directa en Cloud Calendars, una suscripción iCalendar y la identidad de uso compartido de la aplicación son vías distintas. Usar el mismo correo no hace intercambiables sus controles.",
        "Anota los nombres de los calendarios y la vía que los muestra, sin compartir detalles privados de eventos. Decide si quieres detener el acceso futuro, abandonar un acuerdo de uso compartido o quitar una copia. Si investigas un evento ausente o duplicado, desconectar no es el primer paso de diagnóstico."
      ]
    },
    {
      "heading": "Comprueba qué elimina el cierre de sesión de la aplicación",
      "body": [
        "La implementación revisada para esta guía intenta desconectar el perfil de calendario de Google seleccionado y quitar sus copias de calendario vinculadas del almacén de calendarios de iOS. Trátalo como una acción de eliminación, no como una pausa. Aun así puede producirse un error de conexión; comprueba por separado el estado de acceso del proveedor, sin asumir que todos los permisos quedaron revocados.",
        "El cierre de sesión del perfil de calendario de Microsoft también intenta quitar sus calendarios vinculados y registros locales de conexión. No presupongas que esas copias seguirán visibles. El almacenamiento de copias puede depender de los orígenes de calendario disponibles en el dispositivo; comprueba el origen y conserva la información necesaria antes de continuar."
      ]
    },
    {
      "heading": "Revisa el acceso futuro en el proveedor por separado",
      "body": [
        "Los controles de aplicaciones vinculadas de Google distinguen Iniciar sesión con Google del acceso a datos de la cuenta. Revisa la aplicación, cuenta y tipo de vínculo previstos. Retirar el acceso a datos y detener un vínculo de inicio de sesión resuelven cuestiones distintas; cerrar sesión en la aplicación no prueba que hayan desaparecido todas las conexiones.",
        "Para cuentas profesionales o educativas de Microsoft, su documentación indica «My Apps > Manage your application» para revisar permisos. Puedes revocar los que concediste personalmente, pero el acceso otorgado por un administrador requiere al administrador de la organización. Son indicaciones para trabajo o escuela, no un procedimiento universal para cuentas personales de Microsoft."
      ]
    },
    {
      "heading": "Separa la identidad de uso compartido de la sincronización del proveedor",
      "body": [
        "Cloud Calendars también tiene una cuenta para compartir. El código actual trata su cierre de sesión por separado de las conexiones de perfiles de calendario: borra la sesión local de uso compartido y reduce a lector el acceso compartido registrado localmente. Eso no declara que se hayan eliminado todos los datos del servidor.",
        "Si hay varias identidades vinculadas, desconectar una mantiene la cuenta mediante otra. Con la última identidad, el proceso actual cierra la sesión local y deja el vínculo del servidor para recuperación. No uses el cierre de sesión como sustituto de una solicitud de eliminación de datos ni supongas que también desconecta todos los proveedores de calendario."
      ]
    },
    {
      "heading": "Gestiona suscripciones y copias anteriores según sus propias reglas",
      "body": [
        "Apple documenta la cancelación de una suscripción a un calendario externo por separado de la selección de calendarios visibles. Si es una suscripción de solo lectura, identifícala antes de utilizar su control para dejar de suscribirte. Ocultar un calendario, cancelar un canal y borrar un calendario editable son operaciones distintas.",
        "Google señala que retirar el acceso de una aplicación puede requerir una solicitud aparte para borrar datos que el desarrollador ya conserva. Del mismo modo, un cambio de permisos no recupera un archivo exportado ni la copia de otra persona. Separa el seguimiento de privacidad o conservación de la autorización para nuevas actualizaciones."
      ]
    },
    {
      "heading": "Confirma el resultado antes de seguir limpiando",
      "body": [
        "Tras un cambio intencionado, comprueba el estado de conexión del proveedor y compara el calendario original con la aplicación. Identifica qué dejó de actualizarse, qué desapareció localmente y qué permanece en otros lugares. No borres eventos parecidos solo porque ya no aparezca el nombre de una conexión.",
        "Si el resultado es inesperado, detén la limpieza y contacta con soporte indicando la vía de cuenta, el origen del calendario y la acción utilizada. No envíes contraseñas, tokens de acceso, URL privadas de canales ni capturas de citas sensibles. Explica si el calendario original del proveedor conserva los eventos para distinguir un problema de conexión de una copia ausente."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifica la cuenta, el calendario y la vía de conexión exactos.",
    "Decide si quieres detener acceso, abandonar un uso compartido o quitar una copia.",
    "Conserva la información necesaria mediante una exportación o copia de seguridad verificada.",
    "Lee qué elimina la acción instalada de cierre de sesión o desconexión antes de usarla.",
    "Revisa permisos del proveedor por separado y consulta al administrador para accesos gestionados.",
    "Comprueba el resultado en proveedor y aplicación antes de seguir limpiando."
  ],
  "faq": [
    {
      "q": "¿Cerrar una conexión directa de Cloud Calendars conserva sus copias de calendario?",
      "a": "No lo supongas. Los procesos inspeccionados de perfiles de Google y Microsoft intentan quitar sus calendarios vinculados del almacén de iOS. Revisa el origen y conserva la información necesaria antes de desconectar."
    },
    {
      "q": "¿Retirar el acceso de Google de una aplicación borra datos que ya copió?",
      "a": "Google indica que quizá necesites solicitar por separado la eliminación de datos que el desarrollador ya conserva. Revisa acceso futuro y datos retenidos como resultados distintos."
    },
    {
      "q": "¿Cerrar sesión en la cuenta para compartir equivale a borrarla?",
      "a": "No. El proceso actual borra una sesión local y mantiene mecanismos de recuperación; es independiente del cierre de sesión de proveedores de calendario y no demuestra eliminación de datos del servidor."
    }
  ],
  "sourcesHeading": "Orientación oficial sobre acceso y suscripciones",
  "sources": [
    {
      "label": "Google: gestionar aplicaciones vinculadas y tipos de conexión",
      "url": "https://support.google.com/accounts/answer/13533235?hl=en"
    },
    {
      "label": "Google: acceso y datos ya conservados por una aplicación vinculada",
      "url": "https://support.google.com/accounts/answer/14012355?hl=en"
    },
    {
      "label": "Microsoft: permisos de My Apps para trabajo o escuela",
      "url": "https://support.microsoft.com/en-us/accounts-billing/work-school/edit-or-revoke-application-permissions-in-the-my-apps-portal"
    },
    {
      "label": "Apple: selección y suscripciones de calendarios en iPhone",
      "url": "https://support.apple.com/guide/iphone/use-multiple-calendars-iph3d1110d4/ios"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "calendar-export-ics-pdf-and-backup",
    "taking-back-a-calendar-you-shared",
    "the-secret-address-of-a-google-calendar",
    "google-calendars-that-never-reach-your-iphone"
  ]
},

  "calendar-notifications-missing-silent-or-duplicated": {
    "updated": "2026-10-21",
    "title": "Notificaciones del calendario en iPhone: ¿faltan, no suenan o se duplican?",
    "short": "Resolver problemas con las notificaciones",
    "description": "Distingue avisos de eventos, ajustes de Cloud Calendars y controles del iPhone. Revisa recordatorios ausentes, silenciosos o duplicados sin borrar datos.",
    "lede": "Empieza por lo que ocurrió: ¿faltaba el evento, no llegó su notificación, apareció sin sonido o te avisaron dos apps? Cada caso requiere una comprobación distinta. Esta guía la publica Arte Soft, desarrollador de Cloud Calendars.",
    "commonBelief": "Si un evento aparece en el calendario, todos sus avisos y permisos de notificación ya deben estar configurados.",
    "sections": [
      {
        "heading": "Primero, identifica el caso",
        "body": [
          "Si falta el evento, comprueba primero a qué cuenta pertenece y qué calendario está seleccionado, antes de cambiar el sonido. Un aviso no permite determinar si el evento correcto ha llegado a la app. Consulta la guía de sincronización para ese otro problema.",
          "Si el evento está visible pero no aparece ninguna notificación, revisa el aviso guardado y los dos controles de notificaciones que se explican a continuación. Si aparece sin sonido, céntrate en los ajustes de entrega y sonido del iPhone. Si recibes más de una, identifica qué app envía cada una y qué avisos están configurados antes de eliminar nada."
        ]
      },
      {
        "heading": "No hay notificación: revisa el evento y los controles de la app",
        "body": [
          "Abre el evento y revisa la hora de su aviso. El editor de Cloud Calendars incluye los controles «Alert» y, cuando corresponde, «Second Alert», con «None» y opciones anteriores al evento. Un segundo aviso puede ser intencionado. Vuelve a comprobar el evento guardado después de editarlo, sobre todo si el proveedor o los permisos del calendario compartido limitan los cambios.",
          "En los ajustes de Cloud Calendars, busca «Event Notifications». Los ajustes distinguen también las notificaciones de invitaciones y del tiempo; activar una de ellas no demuestra que estén activados los recordatorios de eventos normales. Comprueba tanto «Event Notifications» como el permiso de notificaciones de iOS.",
          "La selección del calendario también importa: el funcionamiento actual programa los avisos de los calendarios seleccionados. Comprueba que el calendario correspondiente esté seleccionado. No supongas que ocultarlo solo cambia su aspecto en esta app, ni borres eventos para detener recordatorios."
        ]
      },
      {
        "heading": "Aviso silencioso o retrasado: revisa la entrega en el iPhone",
        "body": [
          "En la app de ajustes del iPhone, abre la sección de notificaciones y elige Cloud Calendars. Revisa «Allow Notifications», dónde pueden mostrarse los avisos y los controles de sonido. Comprueba si «Scheduled Summary» o un modo «Focus» activo modifica la entrega. Son ajustes del sistema de Apple, no el menú «Alert» de un evento. Los nombres pueden variar según la versión de iOS.",
          "Ver un banner sin sonido no es lo mismo que no encontrar ninguna notificación. Anota si apareció en la pantalla bloqueada o en el centro de notificaciones, si estabas usando el teléfono y qué modo de concentración estaba activo. Cambia un solo ajuste relevante cada vez para que el siguiente resultado aporte información. La cuenta atrás de una Actividad en directo es otra superficie: verla no demuestra que vaya a llegar un recordatorio sonoro."
        ]
      },
      {
        "heading": "Dos avisos: identifica las apps antes de cambiar el evento",
        "body": [
          "Lee el nombre de la app en cada notificación. Calendario de Apple, Google Calendar y Cloud Calendars pueden enviar notificaciones por separado aunque muestren eventos relacionados. Dos notificaciones no bastan para concluir que hay dos registros del evento. Compara también las horas: un recordatorio el día anterior y otro cerca del inicio pueden corresponder a los avisos guardados.",
          "La guía de Google explica que sus ajustes de notificaciones son personales para cada cuenta y que los de un evento pueden diferir de los predeterminados del calendario. Esas instrucciones se aplican a Google Calendar, no a los ajustes de Cloud Calendars. Revisa la app que envía el aviso en lugar de suponer que el interruptor de una app controla las demás.",
          "Elige qué app quieres que te avise y modifica solo el recordatorio o la preferencia correspondiente. Si siguen existiendo dos registros reales del evento, compara sus calendarios y propietarios con la guía de eventos duplicados. No canceles una reunión real solo para silenciar un aviso extra."
        ]
      },
      {
        "heading": "Acota el problema con un evento de prueba",
        "body": [
          "Crea una cita de prueba con un nombre claro en un calendario tuyo que puedas editar. Programa su inicio con margen suficiente para que la hora elegida para el aviso aún sea futura. Confirma que el calendario esté seleccionado, el aviso esté guardado y los dos controles de notificaciones estén activados. Anota la hora prevista del aviso y qué app debería enviarlo.",
          "Observa por separado si aparece una notificación y si suena. Repite la prueba solo después de cambiar un ajuste que sospeches que influye. Usa un evento normal sin asistentes, no una reunión importante ni una serie recurrente. Conserva el resultado junto con las versiones de la app y de iOS para compararlo más adelante."
        ]
      },
      {
        "heading": "Si el resultado sigue siendo irregular",
        "body": [
          "La app programa un conjunto limitado de avisos próximos; no dependas de una cola ilimitada de recordatorios lejanos. Comprueba los controles de tu versión instalada y registra los fallos de entrega. Indica las versiones de la app y de iOS, el tipo de calendario, la antelación del aviso guardado, la hora prevista y el resultado observado.",
          "No incluyas títulos privados de eventos, direcciones de asistentes ni enlaces de suscripción a calendarios en un informe público. Reinstalar, vaciar el almacenamiento local o eliminar cuentas no es el primer paso de diagnóstico. Conserva los eventos y la configuración de cuentas mientras soporte investiga."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Clasifica el fallo: evento ausente, notificación ausente, entrega silenciosa o avisos duplicados.",
      "Comprueba el aviso guardado y el calendario seleccionado.",
      "Revisa «Event Notifications» de Cloud Calendars por separado del permiso de notificaciones del iPhone.",
      "Para los duplicados, compara las apps remitentes y las horas configuradas.",
      "Usa un único evento futuro de prueba y anota el resultado sin modificar invitaciones reales."
    ],
    "faq": [
      {
        "q": "¿Activar las notificaciones del tiempo activa los recordatorios de eventos?",
        "a": "No. Los ajustes distinguen notificaciones de eventos, invitaciones y tiempo. Revisa «Event Notifications» y el permiso de iOS para los avisos de eventos normales."
      },
      {
        "q": "¿Debo borrar un evento si llegan dos avisos?",
        "a": "Primero identifica las apps remitentes y las horas. Varias notificaciones pueden proceder de distintas apps o de varios avisos del mismo evento. Borrar no es una forma segura de diagnosticarlo."
      },
      {
        "q": "¿Configurar un aviso garantiza que llegue?",
        "a": "No. Es solo una parte del proceso. También cuentan las preferencias de la app, los permisos del sistema y los ajustes de entrega; comprueba el resultado en tu dispositivo."
      }
    ],
    "sourcesHeading": "Fuentes y ajustes de notificaciones",
    "sources": [
      {
        "label": "Apple: cambiar los ajustes de notificaciones en el iPhone",
        "url": "https://support.apple.com/guide/iphone/change-notification-settings-iph7c3d96bab/ios"
      },
      {
        "label": "Google: cambiar las notificaciones de Google Calendar en iPhone y iPad",
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
    "title": "Encuentra un evento antiguo: comprueba la cuenta, las fechas y los campos de búsqueda",
    "short": "Encontrar eventos pasados",
    "description": "Una búsqueda vacía no demuestra que se haya borrado un evento. Revisa la cuenta, las fechas y los campos antes de consultar el archivo del proveedor.",
    "lede": "Si recuerdas una reunión pero no la encuentras, separa tres preguntas: en qué cuenta estaba, qué fechas abarca la vista actual y qué campos compara la búsqueda. Esta guía la publica Arte Soft, desarrollador de Cloud Calendars.",
    "commonBelief": "Cualquier buscador de una app de calendario busca en todos los campos de todos los eventos que el proveedor haya guardado.",
    "sections": [
      {
        "heading": "Anota la pista útil más sencilla",
        "body": [
          "Empieza por un mes o año aproximado, una palabra distintiva del título y la cuenta que probablemente usaste. Mantén esas pistas separadas. El nombre de un compañero quizá figuraba como asistente y no en el título; una dirección podía estar solo en el campo de ubicación.",
          "Prueba un fragmento corto del título antes de una frase larga. Un resultado negativo no indica si el registro falta, queda fuera de las fechas cargadas o contiene el texto en un campo que no se busca."
        ]
      },
      {
        "heading": "Comprueba la cuenta de origen y la selección del calendario",
        "body": [
          "Busca la cuenta y el calendario a los que pertenecía originalmente el evento. Un calendario laboral de Google, uno personal de iCloud y uno local del dispositivo son destinos distintos, aunque una app los muestre juntos. Confirma que aún puedes acceder a la cuenta esperada y que su calendario está seleccionado.",
          "No crees otra copia solo porque la búsqueda esté vacía. Si encuentras el evento navegando hasta su fecha aproximada, revisa su título, calendario y organizador. Así tendrás datos para comparar con el resultado de búsqueda sin modificar el registro."
        ]
      },
      {
        "heading": "Revisa las fechas y los campos que busca Cloud Calendars",
        "body": [
          "Cloud Calendars busca en los títulos de los eventos cargados sin distinguir mayúsculas de minúsculas. Usa una palabra distintiva del título. No esperes que coincida una ubicación, la dirección de un asistente o una nota solo porque aparezca en otra parte del evento.",
          "La vista de búsqueda actual carga los eventos del año natural en curso de los calendarios seleccionados. Por eso, una reunión de un año anterior puede no aparecer en esta búsqueda aunque siga existiendo en el proveedor. Comprueba el intervalo antes de interpretar un resultado vacío.",
          "Navegar hasta una fecha anterior y buscar en un año anterior son acciones distintas. Para búsquedas históricas, usa las herramientas del proveedor cuando estén disponibles y verifica que sea la misma cuenta. Comprueba los controles de tu versión instalada en lugar de suponer que la búsqueda abarca todos los años."
        ]
      },
      {
        "heading": "Usa las herramientas del proveedor según sus campos y fechas documentados",
        "body": [
          "En Google Calendar para ordenador, las opciones permiten filtrar por calendario, información del evento, personas, ubicación e intervalo de fechas. Google recomienda una búsqueda avanzada con fechas delimitadas si no aparecen eventos antiguos y documenta un límite de 200 resultados. Divide una búsqueda amplia en intervalos menores en lugar de dar por completo el primer conjunto de resultados.",
          "Esos son controles de Google Calendar en la web, no una descripción de Cloud Calendars. Del mismo modo, la guía de Calendario de Apple indica que su búsqueda en iPhone puede encontrar títulos, invitados, ubicaciones y notas. Eso describe la búsqueda de Calendario de Apple. Usar EventKit en otra app no le proporciona automáticamente la misma interfaz ni las mismas reglas de búsqueda."
        ]
      },
      {
        "heading": "Interpreta dónde aparece el evento y dónde no",
        "body": [
          "Aparece en el proveedor pero no en Cloud Calendars: comprueba la identidad de la cuenta, el calendario seleccionado, las fechas cubiertas y el título buscado. Conserva el registro del proveedor. La siguiente pregunta es qué ha cargado o encontrado la app, no si hay que recrear la cita.",
          "Aparece al navegar pero no al buscar: compara el título real con la consulta y anota la fecha. Es una pista útil sobre el alcance o la coincidencia de la búsqueda. No cambies el título de una reunión antigua solo para que una prueba funcione.",
          "Tampoco aparece en el proveedor: confirma la cuenta, el acceso al calendario y el intervalo antes de investigar con ese proveedor la conservación o el borrado de datos. Para un calendario local, la web de un proveedor no es una copia independiente salvo que hayas establecido una conexión aparte. No supongas que cada evento local tiene un archivo en la nube."
        ]
      },
      {
        "heading": "Guarda un registro útil sin exponer el evento",
        "body": [
          "Para soporte, anota la versión de la app, el proveedor del calendario o el tipo de almacenamiento local, el año aproximado y si el evento aparece en el proveedor o al navegar por fechas. Indica si buscabas una palabra del título, una ubicación o un asistente. Eso ayuda más que decir simplemente que la búsqueda no funciona.",
          "Evita enviar notas privadas, enlaces de invitación o URL secretas de calendarios. Mantén intactos las cuentas y los datos locales; vaciar el almacenamiento o volver a importar un archivo antiguo puede añadir incertidumbre."
        ]
      }
    ],
    "claims": {},
    "practical": [
      "Identifica la cuenta de origen probable y la fecha aproximada.",
      "Comprueba que el calendario esté seleccionado y sea accesible.",
      "Prueba una palabra distintiva del título del evento.",
      "Distingue la búsqueda del año actual en la app de la búsqueda del archivo del proveedor.",
      "Usa los filtros por fecha de Google Calendar web o los campos documentados de Calendario de Apple cuando corresponda.",
      "Anota dónde aparece el evento antes de cambiar datos."
    ],
    "faq": [
      {
        "q": "¿Un resultado vacío significa que se ha borrado mi evento antiguo?",
        "a": "No. Puede deberse a una cuenta incorrecta, un calendario sin seleccionar, una fecha fuera del intervalo cargado o un campo que no se busca. Comprueba el proveedor y la fecha aproximada del evento."
      },
      {
        "q": "¿Puedo buscar en Cloud Calendars por el correo de un asistente o por una nota?",
        "a": "La búsqueda actual compara el texto del título del evento. Para buscar asistentes, notas o ubicaciones, usa las herramientas del proveedor que documenten esos campos."
      },
      {
        "q": "¿Navegar al año pasado hace que la búsqueda abarque ese año?",
        "a": "No cuentes con ello. La vista de búsqueda actual carga el año en curso al abrirse. Para registros históricos, usa la búsqueda por fechas del proveedor en lugar de suponer que la app busca en un historial ilimitado."
      }
    ],
    "sourcesHeading": "Fuentes y ayuda de búsqueda de los proveedores",
    "sources": [
      {
        "label": "Google: buscar en Google Calendar desde un ordenador",
        "url": "https://support.google.com/calendar/answer/37176?hl=en&co=GENIE.Platform%3DDesktop"
      },
      {
        "label": "Apple: buscar eventos en Calendario en el iPhone",
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
  "title": "Exportar un calendario: archivos ICS, PDF y suscripciones",
  "short": "Exportación y copia de calendarios",
  "description": "¿Necesitas un archivo de un calendario de tu iPhone? Elige ICS, PDF o una suscripción y sigue el proceso adecuado de Google, Mac u Outlook.",
  "lede": "Un calendario en el iPhone puede mostrar varias cuentas. Para obtener una copia útil, identifica el origen y decide si necesitas datos de eventos, un horario legible o actualizaciones continuas.",
  "sections": [
    {
      "heading": "Elige el resultado antes que el formato",
      "body": [
        "Exportar un calendario puede significar tareas distintas. Si quieres que otra app lea los registros de eventos, elige un formato estructurado compatible, como ICS. Si alguien necesita un horario legible, elige PDF o una página impresa. Si debe recibir cambios posteriores, estudia una suscripción o el uso compartido con permisos.",
        "Un PDF conserva el diseño que guardaste; no es un archivo para importar eventos. Un ICS descargado contiene los datos del momento en que lo obtuviste. Una suscripción ICS usa una dirección que el cliente de calendario consulta de nuevo. La extensión por sí sola no indica si el destinatario importó una copia puntual o se suscribió a las actualizaciones.",
        "Por ejemplo, un itinerario de fin de semana en PDF es fácil de leer. Un compañero que traslada citas a otra cuenta necesita datos de eventos. Un socio que sigue los encuentros cambiantes de un club el mes próximo necesita una fuente que se actualice. Decide qué resultado necesitas antes de enviar nada."
      ]
    },
    {
      "heading": "Empieza por la cuenta que contiene los eventos",
      "body": [
        "En el iPhone, identifica el calendario y la cuenta con los eventos que necesitas. Una vista conjunta puede incluir varias cuentas, calendarios compartidos y suscripciones. Verlos juntos no significa que exista un único calendario de origen que exportar.",
        "Para Google Calendar, usa un ordenador: Google no permite exportar desde su app Calendar. En la web, abre «Settings», después «Import & export» y «Export». El ZIP descargado contiene archivos ICS individuales. Para un solo calendario, abre «Settings and sharing» y elige «Export calendar». Google exige permiso para gestionar cambios y uso compartido; una organización también puede restringir la exportación.",
        "Para un calendario disponible en Calendario del Mac, selecciona su nombre en la barra lateral y usa «File > Export > Export» para guardar un ICS. Es un proceso del Mac, no un comando oculto del iPhone. Comprueba que has seleccionado el calendario correcto antes de guardar."
      ]
    },
    {
      "heading": "Cuando necesitas un horario en PDF",
      "body": [
        "En Calendario del Mac, usa «File > Print» y elige el diseño, el intervalo de fechas y los calendarios que incluir. En el cuadro de impresión de macOS, usa el menú «PDF» y «Save as PDF». Abre el resultado antes de enviarlo: una cuadrícula pequeña puede omitir o cortar detalles importantes para el destinatario.",
        "Indica claramente el intervalo de fechas y la zona horaria pertinente en el mensaje que acompaña al documento. Revisa las citas privadas, notas y ubicaciones antes de compartir. Los cambios posteriores del calendario no reescriben un PDF ya enviado; identifica claramente las revisiones para que los destinatarios sepan qué horario seguir."
      ]
    },
    {
      "heading": "Suscribirse y publicar no equivale a hacer una copia de seguridad",
      "body": [
        "Microsoft documenta la diferencia en Outlook en la web: descargar e importar un ICS publicado crea una copia sin cambios posteriores; suscribirse a su dirección permite seguirlos. El tiempo de actualización depende del proveedor del destinatario, y el calendario publicado es de solo lectura.",
        "Cuando esté disponible, «Settings > Shared calendars > Publish a calendar» de Outlook permite elegir calendario y nivel de detalle. Publicarlo lo expone para su consulta o suscripción; úsalo para un público previsto, no como técnica de copia privada. Un enlace guardado sigue dependiendo de que el origen permanezca disponible."
      ]
    },
    {
      "heading": "Qué ofrece el uso compartido de Cloud Calendars",
      "body": [
        "Desarrollamos Cloud Calendars. Su flujo para compartir eventos ofrece App Clip, correo electrónico y QR para entregar enlaces de invitación. Esos enlaces tienen una finalidad distinta a descargar todo el calendario en un archivo. Un enlace puede conducir a una invitación o suscripción; no es un archivo portátil de todos los calendarios que ves.",
        "Esta guía no ofrece un procedimiento de Cloud Calendars para exportar calendarios completos a ICS, CSV o PDF. Para ello, usa las rutas documentadas del proveedor o del Mac anteriores. Para enviar un evento concreto, sigue nuestra guía de compartir eventos; para un calendario compartido continuo, decide primero quién debe acceder y si necesita actualizaciones o permisos de edición."
      ]
    },
    {
      "heading": "Comprueba la copia antes de depender de ella",
      "body": [
        "Conserva el calendario original mientras compruebas la exportación. Anota la cuenta, el nombre del calendario y la fecha de exportación. Si pruebas una importación, usa un calendario de destino separado cuando sea posible y compara una cita normal, un evento de todo el día y una serie recurrente con una ocurrencia modificada.",
        "Transferir calendarios no garantiza conservar todas las funciones de las reuniones. Google indica que los eventos importados omiten invitados y datos de conferencias, y que las repeticiones CSV pueden convertirse en eventos individuales. Comprueba expresamente invitaciones, enlaces de reunión y recurrencias antes de dar por terminada la migración.",
        "Apple también ofrece «File > Export > Calendar Archive» en el Mac, que genera un archivo ICBU. Es una operación distinta a exportar un ICS. Apple advierte de que importar un archivo de este tipo sustituye la información y los datos actuales del calendario; no uses su restauración como una prueba informal de importación."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifica la cuenta y el calendario necesarios y elige entre copia puntual, horario imprimible o suscripción actualizable.",
    "Usa la ruta de exportación documentada y conserva el original mientras compruebas el resultado.",
    "Revisa el destino, los datos sensibles y eventos representativos antes de enviar o confiar en la copia."
  ],
  "faq": [
    {
      "q": "¿Puedo exportar Google Calendar directamente desde su app de iPhone?",
      "a": "No. El proceso de exportación documentado por Google requiere un ordenador. También necesitas el permiso adecuado para gestionar el uso compartido."
    },
    {
      "q": "¿Suscribirme a una dirección ICS me proporciona una copia de seguridad?",
      "a": "Una suscripción sigue un origen que puede cambiar o dejar de estar disponible. Guarda una exportación independiente si necesitas una copia fechada y verifica qué conserva el archivo."
    },
    {
      "q": "¿Debo elegir ICS o PDF?",
      "a": "Elige ICS para datos de eventos que un calendario compatible pueda importar. Elige PDF para un horario legible. Un PDF no ofrece actualizaciones ni reconstruye eventos editables mediante los procesos de importación documentados."
    }
  ],
  "sourcesHeading": "Instrucciones oficiales y límites de los formatos",
  "sources": [
    {
      "label": "Google: exportar eventos del calendario",
      "url": "https://support.google.com/calendar/answer/37111?hl=en"
    },
    {
      "label": "Google: importar eventos y límites de transferencia",
      "url": "https://support.google.com/calendar/answer/37118?hl=en"
    },
    {
      "label": "Apple: exportar archivos ICS y archivos de calendario en Mac",
      "url": "https://support.apple.com/guide/calendar/import-or-export-calendars-icl1023/mac"
    },
    {
      "label": "Apple: guardar un documento como PDF en Mac",
      "url": "https://support.apple.com/en-gb/guide/mac-help/mchlp1531/mac"
    },
    {
      "label": "Microsoft: publicar, importar y suscribirse en Outlook",
      "url": "https://support.microsoft.com/en-us/outlook/share-your-calendar-in-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "sharing-one-event-not-your-calendar",
    "inviting-people-who-do-not-have-the-app",
    "the-secret-address-of-a-google-calendar",
    "disconnect-calendar-integration-without-losing-track"
  ]
}
};
