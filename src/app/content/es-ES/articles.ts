import { LocalisedArticle } from '../types';

/**
 * Los artículos en español.
 *
 * Doce de los cuarenta, elegidos por la consulta que responden en
 * ai-visibility/prompts.json y no por lo fáciles que fueran de traducir. Las
 * cifras no están aquí: viven una sola vez en article-facts.ts y se unen al
 * texto por su identificador al renderizar, de modo que una traducción puede
 * reescribir cada frase sin tocar un número.
 */
export const ARTICLES_ES_ES: Readonly<Record<string, LocalisedArticle>> = {
  "month-view-on-a-bigger-screen": {
  "updated": "2026-10-22",
  "title": "Calendario mensual en iPad y iPhone: compara fechas y comprueba los detalles",
  "short": "Usa la vista mensual sin perder detalles",
  "description": "Compara fechas en iPad o iPhone. Revisa eventos ocultos, calendarios seleccionados y horas exactas antes de mover citas compartidas o recurrentes.",
  "lede": "La vista mensual muestra cómo se distribuyen los compromisos entre fechas. Sirve menos para demostrar que una hora concreta está libre. Elige una fecha en la vista general y revisa el día y el evento antes de comprometerte. Esta guía la publica Arte Soft, desarrollador de Cloud Calendars.",
  "commonBelief": "Una cuadrícula mensual más grande muestra todos los detalles y un día aparentemente vacío demuestra que todos están disponibles.",
  "sections": [
    {
      "heading": "Decide si necesitas fechas u horas exactas",
      "body": [
        "Usa el mes para comparar un plazo de proyecto, un viaje y una cita familiar a lo largo de varias semanas. Si necesitas saber si dos citas se solapan a las 14:30, cambia a la vista diaria o semanal y revisa inicio y final exactos. Una celda mensual no tiene la misma escala que una cuadrícula horaria.",
        "Por ejemplo, quien organiza un taller puede descartar primero una semana de viaje. Después debe revisar el día propuesto: compromisos, preparación, desplazamientos y hora límite de finalización. Una celda despejada es una opción por investigar, no una reserva confirmada ni prueba de disponibilidad ajena."
      ]
    },
    {
      "heading": "Lee el indicador de eventos adicionales",
      "body": [
        "La celda mensual actual de Cloud Calendars muestra un número limitado de etiquetas de eventos y un contador cuando hay más. Los títulos ocupan una línea y pueden recortarse. Abre el día o el evento si importan el título completo o los compromisos restantes.",
        "Una pantalla de iPad más grande facilita la lectura, pero no elimina necesariamente todos los límites. Una ventana estrecha o un texto mayor cambian lo que cabe. Haz la misma comprobación en iPhone: inspecciona el día antes de considerar las etiquetas visibles como la agenda completa."
      ]
    },
    {
      "heading": "Comprueba mes, calendarios seleccionados y fechas contiguas",
      "body": [
        "Lee el mes y el año antes de elegir una fecha. La cuadrícula puede incluir días del mes contiguo para completar filas. En Cloud Calendars, usa la navegación mensual y revisa la fecha seleccionada, sin depender solo de la posición de una casilla.",
        "Comprueba qué calendarios están seleccionados. Ocultar trabajo facilita leer un plan familiar, pero también retira esos compromisos de esa vista. Para investigar un duplicado, oculta temporalmente un origen y compara; no borres una cita solo para despejar el mes."
      ]
    },
    {
      "heading": "Abre el evento antes de cambiar un acuerdo compartido",
      "body": [
        "Confirma título, propietario o calendario, hora local y duración en los detalles. El color ayuda a explorar, pero no sustituye saber la cuenta ni si puedes editar. Una invitación visible no equivale a una cita que organizas tú.",
        "Cloud Calendars permite arrastrar eventos a otra fecha desde la vista mensual. Antes de hacerlo con un compromiso real, determina la fecha prevista y el alcance de repetición. Tras un cambio permitido, reabre el evento y comprueba el resultado; un gesto local no demuestra que el proveedor o todos los participantes hayan aceptado el nuevo acuerdo."
      ]
    },
    {
      "heading": "Revisa repeticiones y zonas horarias por separado",
      "body": [
        "Si solo cambia la clase de esta semana, no modifiques por error el patrón futuro. Lee la opción de alcance disponible y revisa después la ocurrencia modificada y una posterior. El mes facilita comparar repeticiones, pero el alcance de edición determina qué cambia.",
        "En viajes o reuniones entre zonas horarias, revisa expresamente fecha y hora locales. Mover a otro día no convierte automáticamente la hora de reunión prevista. Comprueba cambios de horario estacional cuando corresponda y confirma la hora acordada con los implicados."
      ]
    },
    {
      "heading": "Aprovecha la vista grande sin confundir productos",
      "body": [
        "Apple Calendar ofrece sus propias opciones mensuales y Teamup documenta conjuntos de vistas distintos en navegador y móvil. Esos controles pertenecen a cada producto. No busques la configuración web de Teamup o el menú de Apple en Cloud Calendars porque las vistas tengan el mismo nombre.",
        "Un mes de citas tampoco equivale a un mes de previsiones meteorológicas. Para un plan al aire libre, comprueba por separado lugar, fecha y horas de previsión disponibles. Guarda la cita final en el calendario previsto y confirma directamente los cambios con los participantes."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Preselecciona fechas en el mes y revisa horas exactas en día o semana.",
    "Abre días con contador adicional o títulos recortados.",
    "Comprueba mes, año y calendarios seleccionados antes de asumir disponibilidad.",
    "Confirma calendario, hora, duración y permiso de edición.",
    "Lee el alcance de repetición y verifica la ocurrencia guardada tras moverla.",
    "Comprueba la previsión disponible y confirma cambios con los participantes."
  ],
  "faq": [
    {
      "q": "¿La vista mensual de iPad muestra todas las citas completas?",
      "a": "No lo supongas. Cloud Calendars limita las etiquetas por celda y utiliza un contador adicional. Abre el día y el evento para inspeccionar la agenda completa."
    },
    {
      "q": "¿Un día vacío significa que estoy libre?",
      "a": "Primero comprueba calendarios seleccionados, fecha y disponibilidad de los datos de cuenta relevantes. La vista solo representa información actualmente disponible y mostrada."
    },
    {
      "q": "¿Mover un evento recurrente cambia solo esa fecha?",
      "a": "Lee la opción de alcance en vez de asumirlo. Tras guardar, revisa la ocurrencia modificada y una posterior y confirma el acuerdo previsto."
    }
  ],
  "sourcesHeading": "Compara las descripciones oficiales de las vistas",
  "sources": [
    {
      "label": "Apple: vistas mensual, de varios días y de lista en Apple Calendar",
      "url": "https://support.apple.com/en-ca/guide/iphone/iphfd1054569/ios"
    },
    {
      "label": "Teamup: vistas y configuración en navegador frente a aplicación",
      "url": "https://calendar.teamup.com/kb/how-to-use-calendar-views/"
    }
  ],
  "seeAlso": [
  "drag-an-event-to-move-it",
  "recurring-events-without-the-mess"
]
},

"keeping-track-of-who-replied":{
  "updated": "2026-10-21",
  "title": "Respuestas del calendario: distingue asistencia y acceso compartido",
  "short": "Quién respondió y quién tiene acceso",
  "description": "Distingue respuestas de asistencia, invitaciones pendientes, destinatarios anónimos y acceso aceptado. Confirma asistentes sin inventar cifras.",
  "lede": "Una persona puede abrir un enlace, añadir un evento o aceptar acceso al calendario sin prometer que asistirá. Decide qué respuesta necesitas antes de interpretar la lista de destinatarios. Esta guía la escribe Arte Soft, desarrollador de Cloud Calendars.",
  "commonBelief": "Toda persona registrada como destinataria o acceso aceptado es un asistente confirmado, y el silencio permite hacer una estimación fiable.",
  "sections": [
    {
      "heading": "1. Identifica el tipo de invitación",
      "body": [
        "Una invitación de reunión del proveedor pide una respuesta de asistencia. Un enlace compartido de Cloud Calendars da acceso a detalles o a un calendario, quizá con permisos de edición. Una suscripción ICS sigue información. Estas acciones pueden referirse a la misma reunión sin registrar la misma decisión.",
        "Por ejemplo, un voluntario puede aceptar acceso «Writer» para actualizar un evento sin asistir. Un invitado puede leer los detalles en una vista web y responder por mensaje. Ningún caso debe contarse solo desde una pantalla de gestión de acceso."
      ]
    },
    {
      "heading": "2. Interpreta los destinatarios como información de acceso",
      "body": [
        "La información de destinatarios de Cloud Calendars distingue invitaciones por correo pendientes, destinatarios identificados, anónimos y roles de acceso. Una invitación pendiente puede ofrecer reenvío. «Reader», «Writer» y «Owner» describen lo que se puede hacer con la información compartida.",
        "El sistema registra aceptación o recepción durante los procesos de añadir o acceder. Sirve para entender la relación de acceso, pero no es una respuesta de asistencia Sí/Quizá/No. La recepción anónima tampoco identifica a un invitado concreto para el recuento."
      ]
    },
    {
      "heading": "3. Consulta la asistencia en el proceso de invitación del organizador",
      "body": [
        "Google documenta respuestas explícitas «Yes», «No» y «Maybe» para sus invitaciones. Calendario de Apple distingue «Accept», «Maybe» y «Decline» en invitaciones compatibles. Usa el evento y la cuenta correspondientes del organizador para comprobarlas.",
        "Si una respuesta falta o parece incorrecta, confirma con la persona el correo invitado y la versión del evento. Una copia importada, un enlace reenviado o un evento de otra cuenta pueden no representar la invitación original. No supongas que toda visualización de terceros tiene la respuesta más reciente."
      ]
    },
    {
      "heading": "4. Mantén desconocida la asistencia que no se conoce",
      "body": [
        "Un acceso pendiente, la falta de respuesta o un mensaje sin leer no equivalen a aceptar ni rechazar de forma fiable. Registra por separado confirmaciones expresas, rechazos y respuestas aún desconocidas. No sumes una fracción fija de destinatarios silenciosos al total confirmado.",
        "Para una comida con fecha límite de reserva, indica cuándo necesitas respuesta y pregunta directamente a quienes faltan. El seguimiento depende del evento; no existe una regla universal según la cual baste un recordatorio dos días antes."
      ]
    },
    {
      "heading": "5. Trata los enlaces de reunión como datos para unirse",
      "body": [
        "Una URL de Google Meet o Microsoft Teams indica dónde unirse, no si alguien aceptó o asistirá. Cloud Calendars incluye Google Meet en Base y Microsoft Teams en Premium, según la cuenta y el proceso del proveedor. Un plan superior no aporta un recuento más fiable.",
        "Comprueba que el enlace previsto exista en el evento y funcione para el público previsto. Las importaciones y conversiones pueden perder información de conferencia. Si cambias la reunión, indica qué evento y enlace usar en lugar de interpretar el antiguo registro de acceso como confirmación."
      ]
    },
    {
      "heading": "6. Confirma de nuevo después de un cambio importante",
      "body": [
        "Si un evento cambia sustancialmente de horario, actualízalo desde su calendario de origen o proceso para compartir. Después avisa a quienes deban asistir y pide confirmación renovada cuando haga falta. Una respuesta al martes no es necesariamente una respuesta al jueves.",
        "Separa la lista final de asistentes de la lista de acceso. Quitar permisos de edición no cancela la asistencia de un invitado, y rechazar acceso compartido no implica rechazar el encuentro. Usa mensajes claros para que sepan qué decisión les estás pidiendo."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifica si enviaste una invitación de reunión del proveedor, un acceso de la app o un feed.",
    "Usa la lista compartida para consultar acceso e invitaciones pendientes, no totales de asistentes.",
    "Comprueba la respuesta del proveedor en el evento real del organizador cuando corresponda.",
    "Separa respuestas desconocidas, confirmaciones y rechazos.",
    "Pide una respuesta directa con un plazo adecuado al evento.",
    "Tras un cambio importante, confirma la nueva organización y el enlace con los invitados afectados."
  ],
  "faq": [
    {
      "q": "¿Aceptar acceso al calendario significa que la persona viene?",
      "a": "No. Significa que aceptó una relación de acceso mediante ese proceso. La asistencia necesita una respuesta en la invitación del proveedor o una confirmación explícita."
    },
    {
      "q": "¿Puedo contar destinatarios anónimos como invitados confirmados?",
      "a": "No. La recepción anónima no es un compromiso de asistencia identificado. Puede describir el uso de un evento compartido, pero no proporciona una lista fiable de invitados con nombre."
    },
    {
      "q": "¿Necesito Premium para saber quién respondió?",
      "a": "No equipares el nivel de la app con la fiabilidad de las respuestas. Premium añade Microsoft Calendar y Teams; los registros de acceso y las respuestas de asistencia siguen siendo información distinta. Revisa la invitación original y la cuenta del organizador."
    }
  ],
  "sourcesHeading": "Referencias sobre asistencia e importación",
  "sources": [
    {
      "label": "Google: responder a invitaciones de eventos",
      "url": "https://support.google.com/calendar/answer/37135?hl=en"
    },
    {
      "label": "Apple: responder a invitaciones de Calendario en iPhone",
      "url": "https://support.apple.com/en-ph/guide/iphone/iphc0eddfe3c/ios"
    },
    {
      "label": "Google: importar eventos y sus limitaciones",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    }
  ],
  "seeAlso": [
    "sharing-one-event-not-your-calendar"
  ]
},

"exchange-calendars-on-an-iphone":{
  "updated": "2026-10-22",
  "title": "Calendarios Microsoft y Exchange en iPhone: comprueba primero la conexión",
  "short": "Calendarios Microsoft en iPhone",
  "description": "Revisa el tipo de cuenta Microsoft, la autorización de la empresa y los permisos antes de conectar el calendario. Qué añade Cloud Calendars Premium.",
  "lede": "«Calendario Exchange» puede significar servicios y normas laborales distintos. Antes de cambiar ajustes o comprar un plan, identifica dónde se aloja tu buzón y qué conexión permite tu organización. Esta guía la escribe Arte Soft, desarrollador de Cloud Calendars.",
  "commonBelief": "Toda app con inicio de sesión Microsoft debe funcionar con cualquier servidor Exchange y calendario laboral compartido.",
  "sections": [
    {
      "heading": "1. Identifica el buzón, no solo la app Outlook",
      "body": [
        "Outlook es una app y también un nombre usado para servicios de Microsoft. Tener una cuenta en Outlook no indica qué servidor aloja su calendario. Pregunta si usas una cuenta Microsoft personal, un buzón Microsoft 365 en Exchange Online o una instalación Exchange propia de la organización.",
        "Cloud Calendars ofrece inicio de sesión Microsoft y usa la conexión a su servicio de calendarios. No es una configuración universal mediante dirección de servidor y contraseña para cualquier Exchange. Microsoft documenta su API de calendario por separado de la configuración genérica de Exchange: confirma la vía prevista para tu buzón en lugar de adivinar un servidor."
      ]
    },
    {
      "heading": "2. Separa la cuenta del dispositivo Apple de la conexión de la app",
      "body": [
        "Un calendario laboral ya disponible en Calendario de Apple mediante una cuenta de dispositivo autorizada utiliza una vía distinta de «Sign in with Microsoft» dentro de Cloud Calendars. Los calendarios expuestos por el sistema del teléfono también dependen del permiso de acceso. Configurar correctamente la cuenta en los ajustes de Apple no demuestra que se apruebe otro inicio de sesión Microsoft.",
        "Antes de añadir otra conexión, revisa dónde aparece el calendario laboral existente. Si después ves dos versiones de una reunión, identifica sus fuentes y oculta una temporalmente. No uses la eliminación de cuentas o eventos para diagnosticar qué conexión los generó. En Cloud Calendars, anota la selección original y restablécela después de comparar. La selección también puede afectar a los widgets y a la programación de notificaciones; no supongas que solo cambia la visualización."
      ]
    },
    {
      "heading": "3. Comprueba Premium y la autorización de la organización por separado",
      "body": [
        "Premium añade funciones de Microsoft Calendar y Microsoft Teams a Cloud Calendars. Advanced elimina anuncios de Base; no desbloquea el inicio de sesión Microsoft de la app. Revisa el precio local actual y el periodo de facturación en lugar de confiar en un precio de otra región.",
        "Una suscripción no puede anular la decisión de una empresa sobre el acceso de apps. Microsoft permite controlar el consentimiento del usuario y exigir aprobación administrativa. Si la página solicita aprobación, facilita al administrador el nombre de la app, la cuenta prevista y el mensaje exacto. No publiques el calendario laboral ni cambies a una cuenta personal para eludir esa decisión."
      ]
    },
    {
      "heading": "4. Diagnostica en qué fase se produjo el fallo",
      "body": [
        "Si el inicio de sesión no termina, revisa la identidad seleccionada, la red y el mensaje de Microsoft. Una solicitud de aprobación es distinta de una sesión caducada o un fallo de conexión. No hay base para suponer que todo fallo sea una política de la empresa.",
        "Si entras pero falta un calendario, revisa el grupo de la cuenta y la selección en Cloud Calendars y compara con la misma cuenta en Outlook. Si falta un calendario compartido o delegado mientras aparece el tuyo, investiga el acceso a ese calendario concreto. Las capacidades generales de la API de Microsoft no garantizan todos los casos de buzones compartidos o delegación en esta app."
      ]
    },
    {
      "heading": "5. Distingue una copia visible de una actualización confirmada",
      "body": [
        "La conexión Microsoft usa copias de calendarios en el sistema del iPhone. Su destino de almacenamiento puede depender de las fuentes disponibles en el dispositivo. En una cuenta laboral, confirma que esta disposición cumple los requisitos de la organización antes de usarla para reuniones sensibles; no supongas que la copia permanece solo en el buzón original.",
        "Por ejemplo, un calendario de equipo puede mostrar una reunión y rechazar tu cambio por falta de permisos. Una edición local correcta no es la comprobación final. Compara el evento en Outlook con la misma cuenta. Prueba solo un evento desechable en un calendario tuyo, sin invitar a compañeros ni modificar una reunión establecida."
      ]
    },
    {
      "heading": "6. Mantén explícitas la propiedad y la disponibilidad",
      "body": [
        "Una reunión organizada por un compañero no es tuya para trasladarla o reescribirla solo porque aparezca junto a tus planes personales. Ten presentes el organizador, el calendario laboral y los participantes previstos. Usa el proceso autorizado del proveedor si la acción necesaria no está disponible o el cambio no llega al servidor.",
        "Del mismo modo, mostrar una cita personal junto al trabajo no bloquea automáticamente la disponibilidad laboral ni oculta sus detalles como una entrada genérica de ocupado. Si ese es tu objetivo, pregunta qué método admite la organización y verifica el resultado. Un enlace de solo lectura no sustituye el acceso editable, y publicar un enlace no es un atajo para resolver problemas."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifica dónde se aloja el buzón y qué conexión permite la organización.",
    "Comprueba si el calendario ya llega al iPhone mediante una cuenta del dispositivo.",
    "Revisa Premium por separado del consentimiento Microsoft y los permisos del calendario.",
    "Elige la identidad prevista al iniciar sesión y conserva cualquier error para soporte.",
    "Después de entrar, selecciona el calendario necesario y compara un evento reciente en Outlook.",
    "Confirma un cambio de prueba autorizado en el proveedor; deja intactas invitaciones y reuniones recurrentes."
  ],
  "faq": [
    {
      "q": "¿Premium garantiza que se conecte el Exchange de mi empresa?",
      "a": "No. Premium habilita las funciones Microsoft de la app. Compatibilidad del buzón, aprobación de la organización y permisos de cada calendario son requisitos separados. Confirma la conexión con el administrador antes de dar una instalación Exchange por compatible."
    },
    {
      "q": "¿Por qué funciona Outlook y se rechaza otra app de calendario?",
      "a": "Las apps pueden tener permisos y requisitos de aprobación distintos. Que Outlook funcione sirve de referencia para la cuenta, pero no establece autorización para otra app. Usa el error real o la solicitud de aprobación para identificar el problema."
    },
    {
      "q": "¿Puedo usar un enlace público si se bloquea el inicio de sesión Microsoft?",
      "a": "No publiques información laboral para sortear un bloqueo. Una suscripción suele ser una vista de solo lectura, no equivalente al acceso editable. Pide al propietario o administrador un método aprobado; no supongas que publicar un enlace esté permitido."
    }
  ],
  "sourcesHeading": "Fuentes y orientación de los proveedores",
  "sources": [
    {
      "label": "Microsoft: API de calendario de Outlook y datos de buzón compatibles",
      "url": "https://learn.microsoft.com/en-us/graph/outlook-calendar-concept-overview"
    },
    {
      "label": "Microsoft: consentimiento del usuario y del administrador",
      "url": "https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/user-admin-consent-overview"
    },
    {
      "label": "Apple: varios calendarios y suscripciones de solo lectura",
      "url": "https://support.apple.com/en-lamr/guide/iphone/iph3d1110d4/ios"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "what-a-subscription-actually-buys"
  ]
},

  'weather-inside-your-calendar': {
  "updated": "2026-10-22",
  "title": "Calendario con tiempo en iPhone y iPad: revisa tus planes en contexto",
  "short": "Usa el calendario y el tiempo juntos",
  "description": "Usa calendario y tiempo juntos en iPhone y iPad. Comprueba el lugar, las horas de previsión disponibles y los detalles antes de guardar un plan.",
  "lede": "El calendario indica cuándo tienes un compromiso. El tiempo responde a otra pregunta: qué condiciones se prevén para el lugar y periodo que necesitas. Úsalos juntos sin perder de vista sus lugares y fechas. Esta guía la publica Arte Soft, desarrollador de Cloud Calendars.",
  "commonBelief": "El tiempo junto al calendario describe automáticamente la dirección de cada cita, todas las horas y cualquier fecha futura.",
  "sections": [
    {
      "heading": "Elige una pregunta concreta de planificación",
      "body": [
        "Empieza por una cita específica, como una visita al parque por la tarde. Identifica qué podría cambiar: hora, lugar, preparación o decisión de optar por una alternativa. No hace falta reorganizar todo el calendario porque el símbolo del día muestre lluvia.",
        "Anota el inicio y final reales de la actividad, incluido el montaje si corresponde. La vista general ayuda a encontrar fechas posibles; la consulta meteorológica se refiere a un lugar y un intervalo concretos. Mantén separadas ambas tareas al comparar opciones."
      ]
    },
    {
      "heading": "Confirma el lugar del tiempo antes de leer los valores",
      "body": [
        "Cloud Calendars ofrece el tiempo de la ubicación actual o seleccionada. Comprueba el lugar mostrado en vez de asumir que la dirección de un evento cambia la previsión silenciosamente. Una cita en otra ciudad necesita compararse con el tiempo de esa ciudad.",
        "Por ejemplo, puedes estar preparando la llegada a un museo mientras el teléfono sigue en casa. Lee el lugar de la previsión y la hora local de la cita antes de compararlos. La proximidad visual de los valores no demuestra que la agenda y el tiempo usen el mismo lugar."
      ]
    },
    {
      "heading": "Comprueba por separado la cobertura diaria y horaria",
      "body": [
        "Usa el dato diario como orientación y las horas disponibles para una parte del día. Una cita de dos a cinco necesita algo más que mirar un símbolo. Comprueba si esas horas están realmente presentes.",
        "En el código actual, la lista diaria toma hasta diez días devueltos por WeatherKit. Es independiente de la navegación del calendario y de las horas recibidas. Una cita futura no amplía la cobertura del tiempo. Si su periodo no aparece, programa una revisión meteorológica posterior."
      ]
    },
    {
      "heading": "Entiende qué significa el valor meteorológico",
      "body": [
        "Apple documenta datos de WeatherKit como temperatura, precipitación, viento y UV, con algunos productos disponibles solo en determinadas regiones. Lee los valores disponibles para tu lugar, sin esperar todos los productos meteorológicos en cualquier zona.",
        "La orientación de Met Office ilustra por qué importan el periodo y la definición de cada variable: unos valores corresponden a un instante y otros a un intervalo. Usa las etiquetas del proveedor correspondiente. Probabilidad, cantidad y duración de lluvia son preguntas diferentes; ningún número decide por sí solo toda actividad al aire libre."
      ]
    },
    {
      "heading": "Revisa el borrador creado desde una hora del tiempo",
      "body": [
        "Donde la aplicación permite crear un evento desde una hora, abre un borrador. El código actual usa la zona horaria del lugar del tiempo, propone una duración de una hora y selecciona el calendario predeterminado para eventos nuevos. Revisa cada valor antes de guardar.",
        "Confirma título, calendario de destino, inicio, final y lugar previsto. Elegir una previsión no concede permisos para editar un calendario compartido, no avisa a un establecimiento ni reserva una sala. Comprueba el evento guardado y consigue los acuerdos necesarios."
      ]
    },
    {
      "heading": "Distingue la demostración del sitio web",
      "body": [
        "La demostración meteorológica interactiva del sitio usa Open-Meteo. La aplicación utiliza Apple WeatherKit. La demo sirve para explorar la presentación, pero el lugar, los datos y las fechas disponibles pueden diferir de los de la aplicación.",
        "Para una decisión real, abre la aplicación y compara la cita prevista con su previsión disponible. Si cambias un plan compartido, confirma organizador, alcance de repetición y participantes. Mantén una alternativa acordada cuando la actividad dependa de las condiciones."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifica la cita y la decisión que podría cambiar el tiempo.",
    "Confirma el lugar del tiempo y la fecha y hora locales de la cita.",
    "Examina las horas disponibles por separado del resumen diario.",
    "Lee probabilidad, cantidad y otros valores según sus etiquetas.",
    "Revisa todos los detalles del borrador y el calendario de destino antes de guardar.",
    "Vuelve a comprobar al decidir y confirma directamente los cambios compartidos."
  ],
  "faq": [
    {
      "q": "¿El tiempo junto al calendario sigue la dirección de cada evento?",
      "a": "No lo supongas. Confirma la ubicación meteorológica mostrada y compárala con el lugar de la cita; estar cerca en pantalla no acredita que coincidan."
    },
    {
      "q": "¿La aplicación usa el proveedor meteorológico del sitio web?",
      "a": "No. La aplicación usa Apple WeatherKit y la demostración web utiliza Open-Meteo por separado."
    },
    {
      "q": "¿Elegir una hora de previsión guarda una cita automáticamente?",
      "a": "Inicia un borrador donde se ofrece esa acción. Comprueba fecha, zona horaria, duración, calendario y lugar, y después guarda el evento previsto."
    }
  ],
  "seeAlso": [
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather",
    "planning-outdoors-without-being-rained-on"
  ],
  "sourcesHeading": "Fuentes oficiales y lecturas adicionales",
  "sources": [
    {
      "label": "Apple: previsiones WeatherKit y disponibilidad regional",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: lugar, periodos y valores de la previsión",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ]
},

  'forecast-beside-every-event': {
  "title": "Compara una cita con la previsión del tiempo por horas",
  "short": "El tiempo a la hora de tu cita",
  "description": "Comprueba el lugar, la fecha y las horas de previsión disponibles para tu cita. Revisa el borrador antes de guardar un plan basado en el tiempo.",
  "lede": "Para comparar el tiempo con una cita, deben coincidir tres cosas: el lugar seleccionado, la fecha de la previsión y las horas que ocupa tu plan. Un icono del tiempo cercano no demuestra que coincidan. Esta guía la publica Arte Soft, desarrollador de Cloud Calendars.",
  "commonBelief": "Un icono diario del tiempo en el calendario es lo mismo que una previsión asociada a un evento.",
  "sections": [
    {
      "heading": "Empieza por el lugar y la fecha",
      "body": [
        "Abre la previsión del lugar previsto y compara su fecha con la entrada del calendario. El tiempo del calendario puede corresponder al lugar seleccionado para la previsión. Comprueba que sea adecuado para la cita en lugar de suponer que lo determina la dirección del evento.",
        "Puede existir una cita para el mes próximo antes de que haya datos meteorológicos para esa fecha. Conserva la cita y vuelve a consultar la previsión cuando se acerque; que falte una entrada meteorológica no significa que se prevea buen tiempo."
      ]
    },
    {
      "heading": "Usa el detalle horario para una pregunta sobre horas",
      "body": [
        "El resumen diario y la previsión por horas responden a preguntas distintas. Si la cita dura de dos a cinco, revisa las horas disponibles de ese intervalo en lugar de tratar un icono diario como una imagen completa.",
        "Si solo hay datos para parte del intervalo, deja el resto sin resolver. La app no promete una previsión horaria completa para cada evento que puedas crear, y esta guía tampoco promete que abrir cualquier evento muestre siempre todo su intervalo meteorológico."
      ]
    },
    {
      "heading": "Distingue probabilidad, cantidad y momento",
      "body": [
        "Lee la etiqueta del valor que estás consultando. La probabilidad de precipitación no es la cantidad ni la duración de la lluvia. Del mismo modo, un valor horario y un resumen diario abarcan periodos distintos; compara periodos equivalentes al valorar dos posibles horarios.",
        "Elige una alternativa apropiada para tu plan en lugar de usar un porcentaje como regla universal para seguir adelante o cancelar. La información meteorológica puede cambiar; revísala cuando llegue el momento de decidir."
      ]
    },
    {
      "heading": "Revisa la cita basada en el tiempo antes de guardarla",
      "body": [
        "La app puede iniciar un borrador de evento desde una hora de la previsión. Revisa su fecha, inicio, final y calendario de destino antes de guardarlo. Elegir una hora de la previsión no sustituye a comprobar que estás creando el compromiso correcto.",
        "Si el acceso al calendario o el calendario de destino impide guardar, resuelve ese permiso por separado del acceso al tiempo. Encontrar una previsión no otorga permisos de edición sobre un calendario compartido."
      ]
    },
    {
      "heading": "Consulta la previsión completa si el resumen no basta",
      "body": [
        "Para una actividad al aire libre, revisa las variables relevantes para esa actividad y el lugar que realmente has elegido. Un widget del tiempo actual o una demo de la página de inicio no sustituye a comprobar las horas de previsión disponibles en la app.",
        "Si observas una discrepancia, compara primero el lugar y la marca de tiempo. Distintos proveedores, lugares seleccionados y periodos de previsión pueden producir pantallas distintas sin demostrar que haya cambiado el evento."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Confirma el lugar y la fecha del evento.",
    "Comprueba las horas disponibles durante toda la actividad.",
    "Interpreta probabilidad y cantidad como valores diferentes.",
    "Revisa el borrador del evento antes de guardarlo."
  ],
  "seeAlso": [
    "weather-inside-your-calendar",
    "planning-outdoors-without-being-rained-on"
  ],
  "updated": "2026-10-21",
  "faq": [
    {
      "q": "¿Todos los eventos tienen una previsión completa?",
      "a": "No. La cobertura depende del lugar seleccionado y de las fechas y horas disponibles."
    },
    {
      "q": "¿El icono del tiempo corresponde a la dirección del evento?",
      "a": "No lo deduzcas por su cercanía al evento. Confirma por separado el lugar de la previsión."
    },
    {
      "q": "¿Tocar una hora guarda una cita nueva?",
      "a": "Cuando está disponible, inicia un borrador de evento. Revisa fecha, hora y calendario antes de guardarlo."
    }
  ],
  "sourcesHeading": "Fuentes meteorológicas y ajustes de ubicación",
  "sources": [
    {
      "label": "Apple: previsiones de WeatherKit y disponibilidad regional",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Apple: privacidad y servicios de localización",
      "url": "https://support.apple.com/en-us/102515"
    }
  ]
},

  'planning-outdoors-without-being-rained-on': {
  "updated": "2026-10-22",
  "title": "Planifica un evento al aire libre con previsión y alternativa",
  "short": "Elige un plan exterior y una alternativa viable",
  "description": "Planifica al aire libre comprobando lugar, horas de previsión y una alternativa acordada. Revisa el calendario antes de cambiar una cita compartida.",
  "lede": "El tiempo ayuda a comparar momentos posibles para una actividad exterior, pero no promete un resultado sin lluvia. Empieza por sus requisitos y las decisiones que aún puedes cambiar; después usa la previsión relevante para orientarlas. Esta guía la publica Arte Soft, desarrollador de Cloud Calendars.",
  "commonBelief": "Consultar más a menudo o mover un poco la actividad garantiza evitar el mal tiempo.",
  "sections": [
    {
      "heading": "Define la actividad antes de elegir un dato meteorológico",
      "body": [
        "Identifica el lugar, las personas implicadas y lo que necesita la actividad. Una comida en el jardín, una sesión deportiva escolar y una actuación exterior reservada tienen limitaciones prácticas distintas. Evita aplicarles un único porcentaje genérico de lluvia.",
        "Anota quién puede decidir un cambio y la última hora útil para hacerlo. El plazo de un recinto o la disponibilidad de un ayudante pueden limitar las opciones antes que el tiempo. Estos ejemplos de planificación no proporcionan límites técnicos de seguridad para ninguna actividad."
      ]
    },
    {
      "heading": "Haz coincidir lugar, fecha local e intervalo completo",
      "body": [
        "Compara la ubicación meteorológica seleccionada con el lugar real. Incluye llegada y preparación cuando proceda y examina las horas disponibles durante la actividad. Un icono diario no describe cada momento de una reserva larga.",
        "Si el evento queda fuera de las fechas de previsión, conserva la fecha acordada y fija una revisión posterior. Si viajas, compara la hora local del lugar con la cita. No sustituyas inadvertidamente la información de la reserva por una previsión de tu ubicación actual."
      ]
    },
    {
      "heading": "Compara alternativas reales sin inventar periodos secos",
      "body": [
        "Compara los intervalos posibles con los campos meteorológicos relevantes y sus etiquetas. La guía de Met Office distingue probabilidad de otros valores y explica que los campos pueden describir periodos distintos. Lee las definiciones correspondientes de la fuente que utilizas.",
        "Salir una hora después puede mejorar las condiciones o no. Trata un intervalo que parece más adecuado como información para planificar, no como garantía. No extrapoles una hora sin cobertura ni una observación para toda una ruta a partir del valor de un solo lugar."
      ]
    },
    {
      "heading": "Acuerda una alternativa que los participantes puedan usar",
      "body": [
        "La alternativa debe resolver el problema real: un espacio interior autorizado, un aplazamiento acordado u otra opción a la que puedan llegar los participantes. Comprueba acceso, coste y disponibilidad con el organizador o recinto correspondiente.",
        "Por ejemplo, trasladar un pícnic al interior puede fallar si nadie ha confirmado la sala. Registra claramente la alternativa y decide quién comunicará la elección final. Una nota en el calendario privado de una persona no es un acuerdo compartido."
      ]
    },
    {
      "heading": "Guarda y cambia el evento previsto",
      "body": [
        "Antes de crear o editar, confirma calendario de destino, inicio, final y lugar. Un borrador iniciado desde una hora meteorológica sigue necesitando revisión. Su duración propuesta puede no incluir preparación, viaje o toda la actividad.",
        "En una cita compartida o recurrente, revisa responsabilidades del organizador, permisos de edición y alcance de repetición. Después de un cambio autorizado, reabre el evento guardado. Un cambio local no demuestra que el recinto o todos los participantes lo hayan aceptado."
      ]
    },
    {
      "heading": "Revisa cuando aún puedas actuar",
      "body": [
        "Elige una hora de revisión que permita actuar según las condiciones de la reserva. Compara la previsión relevante más reciente y las indicaciones oficiales o del recinto aplicables. La información meteorológica orienta decisiones; no autoriza a ignorar los requisitos de la actividad.",
        "Comunica el plan final y confirma directamente los traspasos importantes de responsabilidad. Si una actualización posterior cambia la decisión, identifica qué evento y ocurrencia debes modificar. Actualizar repetidamente sin una alternativa viable no elimina la incertidumbre."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifica lugar, requisitos y responsable de decidir.",
    "Comprueba el lugar meteorológico seleccionado y todo el intervalo en hora local.",
    "Compara solo fechas y horas de previsión realmente disponibles.",
    "Acuerda una alternativa viable y un plazo de decisión.",
    "Revisa destino del calendario, detalles y alcance de repetición antes de guardar.",
    "Revisa a la hora acordada y confirma el plan final con los participantes."
  ],
  "faq": [
    {
      "q": "¿Mover el evento una hora garantiza que no llueva?",
      "a": "No. Compara los periodos disponibles y conserva una alternativa adecuada a la actividad. La previsión no promete un resultado."
    },
    {
      "q": "¿Y si la previsión no alcanza la fecha del evento?",
      "a": "Mantén la cita acordada y programa una revisión meteorológica posterior. La falta de información no predice buen tiempo."
    },
    {
      "q": "¿Puedo mover un evento compartido si otra hora parece mejor?",
      "a": "Confirma primero el acuerdo del organizador, los permisos de edición y los participantes. Comprueba el alcance de repetición y el resultado guardado y comunica el cambio."
    }
  ],
  "seeAlso": [
    "forecast-beside-every-event"
  ],
  "sourcesHeading": "Fuentes oficiales y lecturas adicionales",
  "sources": [
    {
      "label": "Apple: previsiones WeatherKit y disponibilidad regional",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: lugar, periodos y valores de la previsión",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ]
},

  'a-fourteen-day-view-of-the-weather': {
  "updated": "2026-10-22",
  "title": "¿Hasta qué fecha puedo ver el tiempo en Cloud Calendars?",
  "short": "Comprueba las fechas de previsión disponibles",
  "description": "Comprueba las fechas de previsión de Cloud Calendars. Distingue cobertura diaria y horaria, citas futuras y la demostración meteorológica del sitio web.",
  "lede": "Un calendario a largo plazo y una previsión a largo plazo son cosas distintas. Puedes concertar una reunión antes de que exista su previsión. Lee las fechas disponibles en la aplicación en vez de deducirlas del mes que puedes abrir. Esta guía la publica Arte Soft, desarrollador de Cloud Calendars.",
  "commonBelief": "Cada fecha futura del calendario tiene previsión, y la demostración de catorce días del sitio web es el alcance de la aplicación.",
  "sections": [
    {
      "heading": "Lee las fechas de la vista meteorológica",
      "body": [
        "Abre el tiempo del lugar previsto e identifica las fechas que realmente figuran. No deduzcas la disponibilidad de la navegación mensual o anual del calendario. Si faltan datos, necesitas revisarlos más adelante; no significa que vaya a hacer buen tiempo.",
        "Si organizas una reunión con varias semanas de antelación, guarda la fecha acordada y anota por separado la decisión meteorológica. La disponibilidad del lugar, las invitaciones y una futura previsión son elementos distintos del plan."
      ]
    },
    {
      "heading": "Comprende la lista diaria de la aplicación",
      "body": [
        "La aplicación utiliza Apple WeatherKit. Su implementación actual conserva hasta diez días devueltos por el servicio en la lista diaria. Lee la primera y última fecha reales del lugar seleccionado, sin suponer que cada vista o petición dispone de diez días completos.",
        "Este límite describe la lista diaria mostrada. No promete que todas las variables tengan igual fiabilidad ni que cada cita dentro de esas fechas disponga de una previsión completa. Usa el nivel de detalle que necesita tu decisión."
      ]
    },
    {
      "heading": "Comprueba las horas disponibles para actividades con horario",
      "body": [
        "Un resumen diario no establece las condiciones exactas durante toda una cita. Abre el día y compara las horas disponibles para la llegada, la actividad y la salida. Si falta parte del periodo, déjala como una cuestión pendiente.",
        "Para un evento nocturno, asegúrate de que lugar y fecha local sigan coincidiendo con el plan. Llegar después de medianoche corresponde a otra fecha. Comprueba las marcas horarias reales en vez de considerar el final de la lista diaria como el final de todas las series horarias."
      ]
    },
    {
      "heading": "Distingue la demostración del sitio web",
      "body": [
        "El sitio actual solicita catorce días de previsión a Open-Meteo para su demostración. Open-Meteo documenta intervalos configurables; esa petición del sitio es una implementación separada de la aplicación iOS.",
        "No uses el resultado web para afirmar que la aplicación ofrece catorce días de WeatherKit. Si las vistas difieren, compara primero lugar, hora y proveedor. Un alcance distinto de previsión no significa que el calendario haya perdido una cita."
      ]
    },
    {
      "heading": "Programa una revisión si aún no hay previsión",
      "body": [
        "Mantén la fecha real de la reserva y organiza una revisión que deje tiempo para decidir el lugar o avisar a los participantes. Por ejemplo, una celebración exterior puede necesitar una alternativa interior acordada antes de la siguiente consulta meteorológica.",
        "Elige la revisión según las limitaciones reales de la actividad. Esta guía no asigna porcentajes de precisión ni umbrales universales para celebrar o cancelar según el número de día de previsión. Consulta la información actual cuando pueda cambiar una decisión que aún puedas ejecutar."
      ]
    },
    {
      "heading": "Revisa los detalles después de elegir una hora",
      "body": [
        "Si una hora de previsión disponible ayuda a elegir el momento, revisa el borrador de evento resultante. Confirma fecha local, inicio, final, calendario de destino y lugar. Navegar por la previsión no sustituye los permisos del calendario ni el acuerdo del organizador.",
        "Después de un cambio autorizado, reabre el evento y comprueba la ocurrencia o serie prevista. Confirma por separado los cambios importantes con los participantes. Que aparezcan datos meteorológicos no equivale a que se haya recibido una invitación modificada."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Selecciona el lugar relevante para la cita.",
    "Lee la primera y última fecha de la lista diaria de la aplicación.",
    "Comprueba por separado el intervalo horario, incluidos los límites de medianoche.",
    "Distingue la cobertura Open-Meteo del sitio de la cobertura WeatherKit de la aplicación.",
    "Programa una revisión posterior para planes fuera de la previsión disponible.",
    "Verifica el evento guardado y confirma los cambios compartidos con los participantes."
  ],
  "faq": [
    {
      "q": "¿Cloud Calendars ofrece catorce días de previsión en la aplicación?",
      "a": "La lista diaria actual usa hasta diez días devueltos por WeatherKit. El sitio solicita por separado catorce días a Open-Meteo. Comprueba las fechas realmente disponibles en la aplicación."
    },
    {
      "q": "¿Por qué puedo crear un evento después de la última fecha meteorológica?",
      "a": "El almacenamiento del calendario y la disponibilidad del tiempo son independientes. Mantén la cita y revisa la previsión cuando se acerque la fecha."
    },
    {
      "q": "¿Un dato diario garantiza previsión para cada hora del evento?",
      "a": "No. Comprueba las horas realmente suministradas para ese lugar y periodo. No deduzcas una cobertura horaria completa de la lista diaria."
    }
  ],
  "seeAlso": [
    "weather-inside-your-calendar",
    "forecast-beside-every-event",
    "planning-outdoors-without-being-rained-on"
  ],
  "sourcesHeading": "Fuentes oficiales y lecturas adicionales",
  "sources": [
    {
      "label": "Apple: previsiones WeatherKit y disponibilidad regional",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Open-Meteo: parámetros de previsión e intervalos disponibles",
      "url": "https://open-meteo.com/en/docs"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
  "updated": "2026-10-21",
  "title": "iCloud, Google y Outlook en una vista: cuentas, copias y permisos",
  "short": "Tres proveedores, una vista",
  "description": "Ve juntos calendarios de iCloud, Google y Microsoft. Revisa cuentas, permisos y copias antes de mover eventos o confiar en la disponibilidad.",
  "lede": "Una cita familiar, una llamada con un cliente y una reunión de trabajo pueden solaparse aunque pertenezcan a cuentas distintas. Una vista conjunta permite detectar el conflicto, pero no convierte esas cuentas en un calendario compartido. Esta guía la escribe Arte Soft, desarrollador de Cloud Calendars.",
  "commonBelief": "Reunir varios calendarios en una app mantiene automáticamente de acuerdo la disponibilidad, el uso compartido y las copias de eventos.",
  "sections": [
    {
      "heading": "1. Identifica la cuenta y el calendario de cada evento",
      "body": [
        "Empieza por un evento normal de cada proveedor. Anota el correo de la sesión iniciada, el nombre del calendario y si el evento es tuyo o recibiste una invitación. Dos calendarios llamados «Calendario» pueden pertenecer a cuentas completamente distintas. El color ayuda a revisar la semana; la cuenta y el calendario identifican dónde debe aplicarse un cambio.",
        "Por ejemplo, una cita con el dentista en tu iCloud personal y una reunión de proyecto en Microsoft pueden aparecer juntas para ti. Eso no hace por sí solo que tus compañeros vean la cita dental ni reserva ese tiempo en sus herramientas de planificación."
      ]
    },
    {
      "heading": "2. Conecta por la vía adecuada",
      "body": [
        "Para iCloud, activa primero Calendario de iCloud en el iPhone con la cuenta de Apple prevista. La guía de Apple explica los ajustes del dispositivo. Cloud Calendars accede a los calendarios disponibles en el sistema de calendarios del iPhone y necesita permiso para leerlos. Que la cuenta esté conectada en otro dispositivo no basta.",
        "Cloud Calendars también incluye «Sign in with Google» y «Sign in with Microsoft». Comprueba la cuenta elegida al iniciar sesión y después abre su grupo de calendarios y selecciona los necesarios. Entrar en el proveedor correcto con la identidad personal o laboral equivocada puede mostrar una lista válida, pero inesperada."
      ]
    },
    {
      "heading": "3. Distingue los planes de los permisos",
      "body": [
        "Base incluye sincronización con Google Calendar y las vistas de calendario. Advanced añade la eliminación de anuncios a Base. Premium añade funciones de Microsoft Calendar y Microsoft Teams. Revisa el precio local actual y el periodo de facturación antes de comprar.",
        "Un plan cambia las funciones disponibles en la app; no te convierte en propietario del calendario de otra persona. Google distingue entre ver eventos y modificarlos. Siguen aplicándose las políticas de la empresa y los permisos del calendario Microsoft. Ver un evento o disponer de un editor no demuestra que el proveedor vaya a aceptar el cambio."
      ]
    },
    {
      "heading": "4. Una vista conjunta puede incluir copias de calendarios",
      "body": [
        "Las conexiones de Google y Microsoft usan copias de calendarios en el sistema del iPhone para mostrar y sincronizar eventos. No supongas que conectar una cuenta no deja ninguna copia fuera del proveedor original. El destino de esas copias puede depender de las fuentes de calendario disponibles en el dispositivo.",
        "Si la misma cuenta también llega al teléfono por otra vía, revisa nombres y fuentes antes de tratar las citas repetidas como eventos distintos. Oculta temporalmente un calendario para identificar qué parte de la vista aporta. No borres eventos ni calendarios solo para ordenar la pantalla: una copia conectada puede devolver cambios al proveedor."
      ]
    },
    {
      "heading": "5. Sigue eligiendo el destino al crear eventos",
      "body": [
        "Antes de guardar, revisa el calendario del evento con el mismo cuidado que la fecha y la hora. Para una cita familiar, elige el calendario que usa realmente la familia; para una reunión laboral, el destino autorizado del trabajo. Ver ambos juntos no convierte a ninguno en destino automático de todos los eventos nuevos.",
        "Cambiar el calendario de un evento o arrastrarlo entre calendarios puede ser un traslado, no una segunda vista inocua. Mantén invitaciones y reuniones recurrentes en su calendario habitual mientras investigas un problema de visualización. Si necesitas un cambio, establece primero quién es el propietario y qué calendario puede aceptarlo."
      ]
    },
    {
      "heading": "6. Verifica la vista antes de depender de ella",
      "body": [
        "Compara un evento reciente en el calendario del proveedor con el correspondiente en Cloud Calendars. Revisa fecha, zona horaria, título y calendario seleccionado. En un calendario tuyo editable, es mejor usar un evento de prueba sin invitados que cambiar una reunión real. Confirma el resultado en el proveedor antes de dar la conexión por lista.",
        "No confíes en que la vista conjunta cree automáticamente bloques anónimos de tiempo ocupado en otra cuenta. Si necesitas que los compañeros vean que no estás disponible sin conocer detalles personales, usa un sistema expresamente aprobado y verifícalo desde su lado. La visión personal clara y la disponibilidad compartida son tareas distintas."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Anota la cuenta y el calendario exactos de un evento de cada proveedor.",
    "Activa en el dispositivo los calendarios iCloud previstos y revisa el permiso de acceso.",
    "Usa el inicio de sesión adecuado de Google o Microsoft y selecciona los calendarios previstos.",
    "Compara un evento reciente con la vista del proveedor antes de cambiar nada.",
    "Oculta temporalmente una fuente que parezca duplicada; conserva los eventos originales.",
    "Revisa el calendario de destino de cada evento nuevo y verifica aparte cualquier uso compartido de tiempo ocupado."
  ],
  "faq": [
    {
      "q": "¿Verán mis compañeros mis eventos personales porque muestro ambos calendarios?",
      "a": "Mostrarlos juntos no es una instrucción para compartir ni un puente automático de disponibilidad. Revisa los ajustes reales de cada calendario. Las conexiones pueden crear copias en el dispositivo; la vista conjunta tampoco garantiza que los datos existan solo en el proveedor original."
    },
    {
      "q": "¿Por qué veo un evento pero no consigo editarlo?",
      "a": "El calendario puede ser de solo lectura, el evento pertenecer a otro organizador o el proveedor rechazar la actualización. Comprueba propiedad y permisos en el proveedor. Comprar un plan superior no cambia esos permisos."
    },
    {
      "q": "¿Conviene conectar la misma cuenta Google por todas las vías disponibles?",
      "a": "Primero comprueba cómo aparece ya en el teléfono. Varias vías dificultan identificar las copias. Elige la que quieras usar, verifica sus eventos y oculta la visualización extra mientras investigas, en lugar de empezar borrando datos o desconectando cuentas."
    }
  ],
  "sourcesHeading": "Fuentes y referencias de configuración",
  "sources": [
    {
      "label": "Apple: configurar Calendario de iCloud en tus dispositivos",
      "url": "https://support.apple.com/guide/icloud/set-up-calendar-mme4d73a8727/icloud"
    },
    {
      "label": "Google: compartir calendarios y permisos",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: API de calendario de Outlook y datos de buzón compatibles",
      "url": "https://learn.microsoft.com/en-us/graph/outlook-calendar-concept-overview"
    }
  ],
  "seeAlso": [
    "exchange-calendars-on-an-iphone",
    "work-and-personal-without-two-apps"
  ]
},

  'three-calendar-apps-is-two-too-many': {
  "title": "Reúne tus calendarios en iPhone sin perder de vista los eventos",
  "short": "Una vista conjunta que hayas comprobado",
  "description": "Reúne tus cuentas de calendario en iPhone. Comprueba destinos, duplicados, cambios en el proveedor y avisos antes de cambiar tu rutina.",
  "lede": "Una sola vista de calendario puede ayudarte a comparar compromisos de varias cuentas. Empieza por comprobar qué incluye y dónde se guardan los cambios. Esta guía la publica Arte Soft, desarrollador de Cloud Calendars.",
  "commonBelief": "Sustituir varias apps de calendario significa fusionar todos los calendarios y borrar las otras apps inmediatamente.",
  "sections": [
    {
      "heading": "Decide para qué necesitas la vista conjunta",
      "body": [
        "Anota los calendarios que influyen en una decisión real de agenda: por ejemplo, las reuniones de trabajo, las citas personales y un calendario compartido del hogar. Identifica sus cuentas y quién es el propietario de cada calendario. Varios calendarios dentro de una misma cuenta de Google siguen siendo calendarios distintos.",
        "Decide si necesitas ver los compromisos juntos, editar sus originales o copiar la disponibilidad a otra cuenta. Son tareas diferentes. Una vista conjunta ayuda a comparar horas, pero no hace por sí sola que tus compañeros vean una cita personal en el sistema de planificación del trabajo."
      ]
    },
    {
      "heading": "Comprueba la autorización de la empresa antes de conectar",
      "body": [
        "Para una cuenta de trabajo, utiliza el método de conexión que permita tu organización. Conserva su app autorizada cuando sea necesaria para responder a reuniones, acceder mediante delegación o realizar otras tareas laborales. Una app personal de pago no puede concederte permisos que no tienes.",
        "Si falla una conexión, anota el tipo de cuenta y la fase del fallo en vez de cambiar contraseñas repetidamente o eliminar cuentas. Una decisión sobre el acceso, un error de conexión y un calendario que simplemente está oculto necesitan soluciones distintas. Consulta al administrador si no está clara la vía permitida."
      ]
    },
    {
      "heading": "Añade cuentas sin dar por hecho que no se crean copias",
      "body": [
        "Cloud Calendars puede mostrar los calendarios seleccionados de iOS junto a los calendarios conectados de Google y Microsoft. Sus conexiones con proveedores utilizan copias de los calendarios en el almacén de calendarios del iPhone. Esto no equivale a prometer una conexión que solo muestre datos y nunca guarde otra representación de un evento.",
        "Antes de añadir una segunda vía a la misma cuenta, comprueba cómo aparece ya en el teléfono. Un calendario de un proveedor disponible tanto a través de iOS como mediante una conexión independiente de la app puede ser difícil de identificar solo por su nombre. Revisa el calendario y su fuente en lugar de suponer que las entradas con nombres parecidos son intercambiables."
      ]
    },
    {
      "heading": "Comprueba un evento de prueba en ambos sentidos",
      "body": [
        "Crea una cita de prueba sin datos sensibles y con un nombre distintivo en el calendario editable previsto. Comprueba que aparece en la vista del propio proveedor. Cambia allí su título, vuelve a la vista conjunta y revisa el mismo registro. Después realiza un pequeño cambio de prueba desde la vista conjunta y confírmalo en el proveedor.",
        "Así compruebas tu configuración real; no estás verificando un plazo de actualización garantizado. Usa una cita normal que te pertenezca, sin invitados ni repetición, para que la prueba no envíe invitaciones modificadas a otras personas. Deja intactas las reuniones reales hasta entender qué vía está fallando."
      ]
    },
    {
      "heading": "Reduce lo que se muestra antes de borrar nada",
      "body": [
        "Si la vista conjunta muestra duplicados, oculta temporalmente un calendario y anota qué entrada desaparece. Compara la cuenta, el calendario, el organizador y la hora antes de decidir si hay dos registros guardados o dos vías de visualización. Los nombres repetidos no bastan para justificar una eliminación. Anota la selección original y restablécela después de comparar. En Cloud Calendars, la selección también puede afectar a los widgets, a la programación de notificaciones y a la sincronización con Google.",
        "Apple documenta cómo mostrar u ocultar calendarios mediante las casillas de la lista de calendarios. Ocultar es una primera comprobación útil de la visualización; eliminar un registro o una cuenta puede tener efectos más amplios. Conserva la fuente y cualquier copia de seguridad necesaria mientras investigas."
      ]
    },
    {
      "heading": "Elige tu rutina después de completar las comprobaciones",
      "body": [
        "Utiliza la vista conjunta como pantalla habitual de planificación si incluye los calendarios que necesitas. Conserva otra app autorizada para las tareas que esa vista no admita, como un proceso de invitaciones específico de tu empresa. Reducir los cambios de app puede ser útil sin hacer que una sola aplicación se encargue de todas las funciones de cada cuenta.",
        "Comprueba las notificaciones por separado. Ver un evento una sola vez no demuestra que solo vaya a avisarte una app o un dispositivo. Cloud Calendars Base incluye sincronización con Google y vistas de calendario; Advanced elimina anuncios y Premium añade compatibilidad con Microsoft Calendar y Teams. Revisa los precios locales y los permisos de las cuentas antes de suscribirte."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Enumera los calendarios y sus cuentas de origen que necesitas para planificar.",
    "Confirma la autorización de la empresa y conserva cualquier app laboral necesaria.",
    "Comprueba las vías de acceso existentes antes de añadir otra conexión al proveedor.",
    "Sigue un evento de prueba desde la vista conjunta hasta el proveedor y de vuelta.",
    "Oculta el calendario que parezca duplicado antes de plantearte borrar algo.",
    "Revisa los avisos independientemente de lo que se ve en el calendario."
  ],
  "faq": [
    {
      "q": "¿Tengo que borrar las otras apps de calendario?",
      "a": "No. Conserva las apps necesarias y mantén tu configuración actual mientras compruebas la nueva vista conjunta. Usa cada app para las tareas que hayas verificado."
    },
    {
      "q": "¿Verán mis compañeros que estoy ocupado durante mis citas personales?",
      "a": "Una vista conjunta en tu teléfono no demuestra que otra cuenta reciba tu disponibilidad. Eso requiere un proceso aparte de uso compartido o sincronización."
    },
    {
      "q": "¿Conectar un proveedor significa que los datos se quedan solo allí?",
      "a": "No lo des por hecho. Cloud Calendars utiliza copias de los calendarios de los proveedores en el almacén de calendarios de iOS. Comprueba la vía real de la cuenta y dónde se almacenan los datos antes de conectar calendarios sensibles."
    }
  ],
  "sourcesHeading": "Guías oficiales de configuración y visibilidad de calendarios",
  "sources": [
    {
      "label": "Apple: configurar varios calendarios en iPhone",
      "url": "https://support.apple.com/guide/iphone/use-multiple-calendars-iph3d1110d4/ios"
    },
    {
      "label": "Apple: ocultar calendarios al investigar duplicados",
      "url": "https://support.apple.com/en-us/102180"
    }
  ],
  "seeAlso": [
    "icloud-google-and-outlook-in-one-view",
    "calendar-notifications-missing-silent-or-duplicated"
  ],
  "updated": "2026-10-22"
},

  'the-widget-that-shows-what-is-next': {
  "updated": "2026-10-22",
  "title": "Widgets de calendario en iPhone y iPad: muestra los próximos eventos",
  "short": "Próximos eventos en la pantalla de inicio",
  "description": "Configura widgets de eventos en iPhone o iPad. Revisa calendarios seleccionados, filas visibles y citas ausentes antes de fiarte de la pantalla de inicio.",
  "lede": "Para consultar de forma útil la próxima cita, elige un widget que realmente muestre eventos. Una tarjeta con fecha y tiempo responde a otra pregunta. Esta guía la publica Arte Soft, desarrollador de Cloud Calendars.",
  "sections": [
    {
      "heading": "Elige primero el diseño con eventos",
      "body": [
        "En la galería de widgets de Cloud Calendars, «Calendar Events» es el diseño mediano con lista de eventos. «Calendar Events Large» ofrece más espacio para las próximas citas. «Calendar & Weather» es un diseño independiente de fecha y tiempo; su tamaño pequeño no promete una fila con el próximo evento. Los nombres pueden aparecer traducidos en tu dispositivo.",
        "En el iPhone, mantén pulsada una zona vacía de la pantalla de inicio, elige la opción de edición «Edit» y después «Add Widget» para añadir un widget. Busca Cloud Calendars y selecciona el diseño que quieras. Compara la vista previa antes de añadirlo. Las instrucciones de Apple describen esta galería del sistema, que es distinta de las vistas del calendario dentro de la app."
      ]
    },
    {
      "heading": "Añade y comprueba el widget en el iPad",
      "body": [
        "En el iPad, utiliza la galería de widgets de Apple para la pantalla de inicio: mantén pulsado el fondo, abre «Edit» y después «Add Widget». Busca Cloud Calendars, revisa los estilos y tamaños disponibles, añade el diseño que necesites, colócalo y termina con «Done». Estas etiquetas en inglés pueden aparecer traducidas en tu dispositivo. Sigue los controles que muestre tu versión de iPadOS; una vista previa no confirma que se hayan cargado tus datos de calendario.",
        "Elige «Calendar Events» o «Calendar Events Large» si necesitas consultar citas. Compara los estilos que ofrece la app instalada: una tarjeta de fecha y tiempo responde a una pregunta distinta de una lista de eventos.",
        "Abre Cloud Calendars en ese iPad y busca una cita conocida con hora de inicio futura en un calendario seleccionado. Que la vista del iPhone sea correcta no confirma las cuentas, el acceso ni los datos cargados en el iPad. Compara el título, la fecha y la hora de inicio y, si el widget difiere, continúa con las comprobaciones de inclusión y actualización que se explican a continuación."
      ]
    },
    {
      "heading": "Comprueba qué se considera próximo",
      "body": [
        "La lista utiliza los calendarios seleccionados y las citas con hora de inicio futura. Excluye los eventos de todo el día y las citas cuya hora de inicio ya ha pasado. Por eso un cumpleaños o una reunión en curso pueden aparecer en la app sin figurar aquí.",
        "Por ejemplo, si tu única entrada de hoy es un viaje marcado como evento de todo el día, una lista vacía no significa que ese viaje se haya perdido. Abre la app para revisar el día completo. Del mismo modo, la siguiente cita con hora puede ser mañana o más adelante: lee su fecha en lugar de suponer que todas las filas corresponden a hoy."
      ]
    },
    {
      "heading": "Distingue un evento ausente de una lista sin más filas",
      "body": [
        "Un widget muestra un conjunto limitado de próximas citas. Si los eventos anteriores ocupan sus filas, una cita posterior puede no aparecer aunque exista en la app y cumpla los criterios de la lista. Un diseño de eventos más grande puede mostrar más filas, pero tampoco es el calendario completo.",
        "Empieza por la cita con hora de inicio futura más cercana en un calendario seleccionado. Si aparece pero otra posterior no, abre la app para revisar el resto de la agenda. Si también falta el evento más cercano que cumple los criterios, continúa comprobando la selección de calendarios, el acceso y las actualizaciones. No muevas ni borres citas solo para que aparezca una entrada posterior."
      ]
    },
    {
      "heading": "Compara primero con la app",
      "body": [
        "Abre Cloud Calendars y localiza una cita concreta con hora de inicio futura. Confirma que el calendario al que pertenece está seleccionado y que la app tiene el acceso al calendario que necesita. Compara el título, la fecha y la hora de inicio con el widget. Si el evento también falta en la app, investiga primero la cuenta o la sincronización.",
        "Si necesitas un ejemplo claro, utiliza una cita de prueba sin consecuencias en un calendario propio. Ponle un inicio futuro y un título reconocible. Evita modificar una invitación real o quitar cuentas solo para probar la pantalla de inicio."
      ]
    },
    {
      "heading": "Ten en cuenta las actualizaciones sin suponer un plazo fijo",
      "body": [
        "Los widgets muestran información guardada y no funcionan continuamente como una app abierta. Apple controla cuándo se actualizan. Abrir la app y comprobar el evento te proporciona una referencia actual, pero no establece un número exacto de segundos tras el cual el widget deba cambiar.",
        "Si la app sigue mostrando la información correcta y el widget no, anota el diseño, el calendario seleccionado, la hora del evento y las versiones de la app y de iOS. Una lista vacía, una cita antigua y una hora incorrecta son observaciones distintas: indica cuál ves."
      ]
    },
    {
      "heading": "Interpreta el tiempo como un resumen independiente",
      "body": [
        "El tiempo junto a la fecha no es una previsión asociada al lugar y a la hora de inicio de cada cita. Antes de un evento al aire libre, abre la vista del tiempo y comprueba el lugar y la hora previstos. Un icono de las condiciones actuales no demuestra qué tiempo hará en una reunión posterior.",
        "Utiliza este widget para orientarte rápidamente. Consulta el calendario completo para los compromisos de todo el día, los detalles de los eventos y las decisiones que requieren ver toda la agenda."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Elige «Calendar Events» o «Calendar Events Large» para ver una lista de eventos.",
    "Comprueba una cita con hora de inicio futura en un calendario seleccionado.",
    "Compara su fecha y hora en la app antes de investigar el widget.",
    "Anota las diferencias persistentes en lugar de borrar datos del calendario."
  ],
  "faq": [
    {
      "q": "¿Por qué falta mi cumpleaños?",
      "a": "La lista de próximos eventos excluye los de todo el día. Consulta el calendario completo para los cumpleaños y otras entradas que solo tienen fecha."
    },
    {
      "q": "¿El widget pequeño muestra la siguiente reunión?",
      "a": "El diseño pequeño «Calendar & Weather» muestra fecha y tiempo. Para consultar citas, elige un diseño con lista de eventos."
    },
    {
      "q": "¿No tener próximos eventos significa que hoy estoy libre?",
      "a": "No. Los eventos de todo el día, los que están en curso, los calendarios no seleccionados y la información desactualizada pueden cambiar esa conclusión."
    }
  ],
  "sourcesHeading": "Fuentes e instrucciones de Apple",
  "sources": [
    {
      "label": "Apple: Añadir y editar widgets en el iPhone",
      "url": "https://support.apple.com/118610"
    },
    {
      "label": "Apple: Mantener actualizado un widget",
      "url": "https://developer.apple.com/documentation/widgetkit/keeping-a-widget-up-to-date"
    },
    {
      "label": "Apple: Añadir, editar y eliminar widgets en el iPad",
      "url": "https://support.apple.com/guide/ipad/add-edit-and-remove-widgets-ipadb0de8630/ipados"
    }
  ],
  "seeAlso": [
    "a-countdown-to-your-next-meeting"
  ]
},

  'a-countdown-to-your-next-meeting': {
  "updated": "2026-10-21",
  "title": "Una cuenta atrás que complementa los avisos del calendario",
  "short": "Cuenta atrás para la próxima cita",
  "description": "Usa la actividad en directo para una cita futura, comprueba los cambios de horario y conserva los avisos independientemente de la cuenta atrás.",
  "lede": "Una cuenta atrás ayuda a calcular cuánto tiempo queda. Para ser útil, debe mostrar la cita correcta y su hora de inicio actual. Esta guía la publica Arte Soft, desarrollador de Cloud Calendars.",
  "sections": [
    {
      "heading": "Empieza por una cita confirmada",
      "body": [
        "Abre el evento en Cloud Calendars y comprueba fecha, hora y calendario seleccionado. La actividad sigue eventos futuros con hora; no mide eventos de todo el día ni el tiempo restante de una reunión que ya comenzó.",
        "Iníciala con «Live» cuando esté disponible; mientras funciona, el control pasa a «Stop». Si no aparece, comprueba si iPhone permite las actividades en directo de la app. Las etiquetas y la disponibilidad pueden variar."
      ]
    },
    {
      "heading": "Distingue las dos superficies",
      "body": [
        "La actividad puede mostrar la siguiente cita en la pantalla bloqueada. Los iPhone compatibles también disponen de una presentación en la Dynamic Island. La guía de Apple explica cómo ampliarla para ver detalles.",
        "Un widget de la pantalla de inicio es otra función. Añadirlo no demuestra que la actividad esté iniciada; activar los sonidos de las notificaciones tampoco la pone en marcha."
      ]
    },
    {
      "heading": "Comprueba la cita, no solo el número",
      "body": [
        "La cuenta puede seguir avanzando hacia una hora guardada que ya no es correcta. Si el organizador cambia la reunión, ver un número que disminuye no demuestra que haya llegado la modificación. Mira también el título, la fecha y la información de actualización.",
        "Después de un cambio importante, abre la app y compara el evento guardado con la actividad. Si no coinciden, utiliza los datos confirmados de la cita mientras investigas la diferencia."
      ]
    },
    {
      "heading": "Mantén un aviso cuando no estés mirando",
      "body": [
        "Una cuenta atrás visual solo ayuda cuando miras la pantalla. Conserva un aviso adecuado para las citas importantes y comprueba por separado el permiso de notificaciones. No sustituyas un recordatorio necesario por la mera presencia de la actividad.",
        "Añade el tiempo de preparación o desplazamiento que necesites. El número cuenta hasta el inicio del evento; no verifica de forma independiente cuándo debes salir. Comprueba la ubicación y tus necesidades."
      ]
    },
    {
      "heading": "Investiga una actividad ausente o desactualizada",
      "body": [
        "Revisa primero el evento en la app, después si la actividad está iniciada y permitida. Las actualizaciones en segundo plano dependen de iOS; no hay una garantía de sincronización continua ni una agenda futura ilimitada.",
        "Compara una cita de prueba antes y después de cambiar su hora. Anota el inicio previsto y el mostrado, y si volver a abrir la app cambia el resultado. Mantén intactas las invitaciones reales e incluye las versiones al informar del problema."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Confirma la cita futura y su calendario.",
    "Inicia «Live» y revisa el evento mostrado.",
    "Vuelve a comparar tras un cambio de horario.",
    "Conserva por separado los avisos que necesites."
  ],
  "faq": [
    {
      "q": "¿La cuenta atrás está siempre actualizada?",
      "a": "No. Puede seguir contando hacia una hora guardada anteriormente. Comprueba los cambios importantes en la app."
    },
    {
      "q": "¿Por qué no cuenta un evento de todo el día?",
      "a": "La actividad selecciona citas futuras con hora."
    },
    {
      "q": "¿Todos los iPhone tienen Dynamic Island?",
      "a": "No. Es una superficie distinta de la pantalla bloqueada y requiere un modelo compatible."
    }
  ],
  "sourcesHeading": "Fuentes e instrucciones de Apple",
  "sources": [
    {
      "label": "Apple: Funciones y actividades en directo en la pantalla bloqueada",
      "url": "https://support.apple.com/guide/iphone/access-features-from-the-lock-screen-iphcd5c65ccf/ios"
    },
    {
      "label": "Apple: Actividades en directo en la Dynamic Island",
      "url": "https://support.apple.com/guide/iphone/view-live-activities-in-the-dynamic-island-iph28f50d10d/ios"
    }
  ],
  "seeAlso": [
    "the-widget-that-shows-what-is-next"
  ]
},

  'drag-an-event-to-move-it': {
    title: 'Mover un evento arrastrándolo',
    short: 'Arrastrar para mover',
    description:
      'Reprogramar debería costar un gesto, no un formulario. Por qué la manipulación directa importa más en un calendario que casi en cualquier otro sitio.',
    lede: 'Abrir el evento, tocar el campo de hora, girar una rueda y guardar son cuatro pasos para expresar algo que ya había señalado con el dedo.',
    commonBelief: 'Que editar la hora en un formulario es preciso y arrastrar es aproximado.',
    sections: [
      {
        heading: 'El formulario no es más exacto',
        body: [
          'Al arrastrar se cae en la cuadrícula, y la cuadrícula está en las unidades en las que usted planifica de verdad. No está siendo impreciso: está trabajando en la resolución que tiene el día.',
          'Donde la precisión sí importa — un vuelo, una reserva con minuto fijo — el formulario sigue ahí. Solo deja de ser lo primero para el noventa por ciento de los casos que son «una hora más tarde».',
        ],
      },
      {
        heading: 'Mover es más frecuente que crear',
        body: [
          'Casi todo el trabajo de calendario es recolocar, no introducir. En cuanto se advierte, se ve que una aplicación que hace elegante la creación y laboriosa la recolocación ha optimizado la mitad menos frecuente.',
          'Arrastrar y redimensionar convierten la recolocación en lo que ya era en su cabeza: esto, pero más tarde, y un poco más largo.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Arrastre para lo aproximado y abra el evento para lo exacto.',
      'Cambie la duración desde el borde en vez de editar una hora de fin.',
      'En la vista de semana, arrastrar entre días mueve fecha y hora a la vez.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view'],
  },

  'sharing-one-event-not-your-calendar': {
  "updated": "2026-10-21",
  "title": "Comparte un evento: elige el enlace y el acceso adecuados",
  "short": "Compartir un evento",
  "description": "Comparte un evento sin todo el calendario. Entiende Reader, Writer y Owner, las vistas previas, actualizaciones y límites de retirar acceso.",
  "lede": "Compartir los detalles de una cena, permitir que un coorganizador edite y recoger respuestas de asistencia son tareas distintas. Elige primero la tarea y después la vía. Esta guía la escribe Arte Soft, desarrollador de Cloud Calendars.",
  "commonBelief": "Todo enlace de evento es una suscripción de solo lectura que se actualiza inmediatamente y registra una respuesta.",
  "sections": [
    {
      "heading": "Empieza por un evento y revisa sus detalles",
      "body": [
        "Compartir un evento se limita a ese evento, no al calendario completo del remitente. Antes de enviarlo, revisa título, zona horaria, ubicación, notas y URL de reunión. La información útil para un invitado puede no ser apropiada para un enlace distribuido ampliamente.",
        "Compartir una cena no exige compartir el calendario con tus citas médicas. Sin embargo, la ubicación y los enlaces de la cena sí acompañan al evento. Revisa el evento en sí, sin depender de la privacidad del calendario que lo contiene."
      ]
    },
    {
      "heading": "Elige vista previa, invitación por correo o QR",
      "body": [
        "Cloud Calendars ofrece vías distintas. Su App Clip muestra una vista previa; para añadir el evento desde esa experiencia hace falta la app completa. Las invitaciones por correo y QR usan una página web que ofrece abrir Cloud Calendars. No describas todos estos enlaces como URL de suscripción intercambiables.",
        "El remitente inicia sesión para el proceso sincronizado. Un enlace o QR puede reenviarse: envíalo solo donde su contenido sea apropiado. Un QR transmite un enlace, no demuestra quién lo abrió."
      ]
    },
    {
      "heading": "Concede solo el acceso necesario",
      "body": [
        "Las invitaciones por correo permiten elegir Reader, Writer u Owner. Reader puede ver y sincronizar; Writer puede editar; Owner además puede compartir y administrar acceso. Son decisiones con consecuencias, no tres nombres para ver lo mismo. Usa Reader para quien solo necesita el horario.",
        "Elige Writer para un coorganizador que deba modificar el evento. Elige Owner solo si también debe gestionar el acceso de otros. Los permisos superiores requieren la identidad adecuada con sesión iniciada. Un destinatario anónimo no es un copropietario identificado."
      ]
    },
    {
      "heading": "Entiende cómo lo añade el destinatario",
      "body": [
        "En la app completa, añadir requiere permiso de calendario y un destino editable. El destinatario debe comprobarlo antes de guardar. La copia recibida puede asociarse después al evento compartido para recibir actualizaciones.",
        "Esto difiere de importar un ICS normal a otro calendario. La importación es una copia; una suscripción consulta periódicamente un feed. Si envías un feed ICS y no una invitación de la app, explica esa vía y confirma que el calendario del destinatario la admite."
      ]
    },
    {
      "heading": "Verifica los cambios antes de depender de ellos",
      "body": [
        "El acceso sincronizado puede transmitir ediciones o cancelaciones, pero el dispositivo debe tener oportunidad de recibirlas. Una indicación de refresco del feed no es un plazo de entrega. Un dispositivo sin conexión, una suscripción sin actualizar o una copia importada independiente pueden seguir mostrando datos antiguos.",
        "Si la cena cambia poco antes del inicio, actualiza el evento y contacta directamente con los invitados. Pide que confirmen la nueva hora. Enviar una actualización y recibir una respuesta de asistencia son pasos separados."
      ]
    },
    {
      "heading": "Gestiona el acceso sin prometer borrar copias",
      "body": [
        "Revisa los destinatarios y retira permisos innecesarios. Quitar un destinatario y revocar un enlace de feed son acciones distintas; ninguna debe describirse como borrado remoto de capturas, mensajes o todas las copias.",
        "Si el enlace circuló más allá del público previsto, identifica qué enlace o permiso está implicado. Comprueba la vía afectada después de cambiar el acceso. Para futuros eventos, evita detalles privados en enlaces amplios en lugar de confiar en recuperarlos mediante revocación."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Revisa los detalles y decide si necesitas visualización, edición o respuestas de asistencia.",
    "Elige la vía e inicia sesión cuando corresponda.",
    "Usa Reader para lectores; concede Writer u Owner solo por la responsabilidad correspondiente.",
    "Pide al destinatario que compruebe hora y calendario de destino al añadir.",
    "Para cambios urgentes, actualiza el evento y envía un mensaje directo.",
    "Al terminar, revisa permisos de destinatarios y acceso de enlaces por separado."
  ],
  "faq": [
    {
      "q": "¿Compartir un evento expone todo mi calendario?",
      "a": "La vía sincronizada de un evento se limita a él. Sus propios detalles sí se muestran por la vía elegida. Revísalos y no envíes una invitación de todo el calendario si solo quieres compartir un evento."
    },
    {
      "q": "¿Puede el destinatario modificarlo?",
      "a": "Sí, con acceso Writer u Owner apropiado mediante el proceso compatible con sesión iniciada. Reader permite ver y sincronizar. Una suscripción ICS normal no es el mismo mecanismo de edición."
    },
    {
      "q": "¿Eliminar a alguien deshace todo lo que ya recibió?",
      "a": "No debe suponerse tal garantía. Los cambios afectan la relación compartida admitida, pero pueden quedar copias, capturas y mensajes. Una URL de feed compartido también requiere revisión separada."
    }
  ],
  "sourcesHeading": "Referencias sobre las opciones del destinatario",
  "sources": [
    {
      "label": "Apple: descripción de App Clips",
      "url": "https://developer.apple.com/help/app-store-connect/offer-app-clip-experiences/overview-of-app-clips/"
    },
    {
      "label": "Google: importar eventos y sus limitaciones",
      "url": "https://support.google.com/calendar/answer/37118?co=GENIE.Platform%3DDesktop&hl=en"
    },
    {
      "label": "Microsoft: importar o suscribirse a un calendario",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "keeping-track-of-who-replied"
  ]
},

  'free-google-sync-without-adverts': {
  "updated": "2026-10-22",
  "claims": {},
  "title": "Sincronizar Google Calendar gratis en iPhone: funciones y publicidad",
  "short": "Google gratis y publicidad",
  "description": "Comprueba qué incluye Base, qué publicidad elimina Advanced y cuándo necesitas Premium para Microsoft. Separa la suscripción de los permisos.",
  "lede": "Arte Soft desarrolla Cloud Calendars y publica esta guía. La sincronización de Google Calendar está incluida en el plan gratuito Base. La aplicación gratuita puede mostrar publicidad; Advanced la elimina. Una suscripción y el permiso para editar el calendario de otra persona son cosas distintas.",
  "commonBelief": "Una conexión gratuita al calendario es solo una prueba, o contratar un plan sin anuncios concede automáticamente más permisos sobre calendarios compartidos.",
  "sections": [
    {
      "heading": "Empieza por la conexión que necesitas",
      "body": [
        "Base incluye sincronización de Google Calendar, compatibilidad con Google Meet, vistas del calendario, tiempo meteorológico y widgets de la pantalla de inicio. Debes conectar la cuenta de Google adecuada y seleccionar los calendarios que quieres ver. Un calendario compartido en modo de solo lectura sigue siendo de solo lectura, independientemente del plan.",
        "Puedes usar calendarios locales en el dispositivo sin crear una cuenta en la aplicación. Conectar un proveedor y utilizar servicios de uso compartido puede requerir iniciar sesión. No confundas el permiso para leer los calendarios del iPhone con haber conectado todos los calendarios de Google que tienes."
      ]
    },
    {
      "heading": "Qué cambia al pagar",
      "body": [
        "Advanced incluye las funciones de Base y elimina los anuncios. Pagar no cambia los permisos de uso compartido de Google ni da prioridad a las previsiones meteorológicas. Eliminar la publicidad no concede el derecho a editar calendarios de otras cuentas.",
        "Premium incluye Advanced y añade compatibilidad con Microsoft Calendar y Microsoft Teams. Si tu organización limita las conexiones de terceros, una compra no puede anular esas reglas. Verifica la conexión que necesitas antes de depender de ella para el trabajo."
      ]
    },
    {
      "heading": "Prueba una semana normal antes de decidir",
      "body": [
        "Selecciona un pequeño conjunto de calendarios reales, comprueba que aparezcan los eventos correctos y crea un evento de prueba que puedas descartar en un calendario editable. Confirma su destino, en lugar de suponer que ver dos cuentas significa que sus eventos se han fusionado.",
        "Decide por separado si la publicidad interrumpe tu uso y si necesitas compatibilidad con Microsoft. No hace falta contratar un plan superior solo porque otra persona necesite un proveedor distinto. Los precios y los periodos de facturación se muestran para tu región antes de comprar."
      ]
    },
    {
      "heading": "Gestiona la compra desde la Cuenta de Apple correcta",
      "body": [
        "Si Apple factura la suscripción, abre Ajustes, toca tu nombre y después Suscripciones para consultar el plan y las opciones de cancelación. Si no aparece la compra, comprueba la Cuenta de Apple del recibo. Iniciar sesión en un proveedor de calendarios no equivale a iniciar sesión en la Cuenta de Apple a la que pertenece la suscripción.",
        "Eliminar la aplicación no es la forma de gestionar la renovación. Antes de cambiar cuentas o borrar datos locales, asegúrate de saber qué calendarios son locales y cuáles están almacenados con un proveedor."
      ]
    }
  ],
  "practical": [
    "Conecta la cuenta de Google adecuada y comprueba los calendarios seleccionados.",
    "Confirma el permiso de edición con un evento de prueba en el destino correcto.",
    "Usa Base para valorar las vistas, el tiempo y los widgets que necesitas.",
    "Elige Advanced para eliminar anuncios; Premium si necesitas Microsoft Calendar o Teams.",
    "Comprueba el precio local, el periodo de facturación y la Cuenta de Apple usada para la compra."
  ],
  "faq": [
    {
      "q": "¿Necesito Advanced para sincronizar Google Calendar?",
      "a": "No. La sincronización de Google Calendar está incluida en Base. Advanced elimina los anuncios; Premium añade compatibilidad con Microsoft Calendar y Teams."
    },
    {
      "q": "¿Pagar me permite editar un calendario compartido en modo de solo lectura?",
      "a": "No. El propietario del calendario y el proveedor controlan los permisos de edición. Una suscripción a la aplicación no concede acceso al calendario de otra persona."
    }
  ],
  "sourcesHeading": "Fuentes y ayuda con las compras",
  "sources": [
    {
      "label": "Apple: cancelar una suscripción",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "what-a-subscription-actually-buys",
    "icloud-google-and-outlook-in-one-view"
  ]
},

  'what-a-subscription-actually-buys': {
  "updated": "2026-10-21",
  "title": "Qué compra realmente una suscripción, plan por plan",
  "short": "Qué compra una suscripción",
  "description": "Qué compra una suscripción: Base, Advanced, Premium.",
  "lede": "Esta guía la publica Arte Soft, desarrollador de Cloud Calendars.",
  "sections": [
    {
      "heading": "Base",
      "body": [
        "Base incluye sincronización con Google Calendar, Google Meet, vistas del calendario, tiempo y widgets. El plan gratuito puede mostrar anuncios."
      ]
    },
    {
      "heading": "Advanced · Premium",
      "body": [
        "Advanced incluye Base y elimina los anuncios. Premium incluye Advanced y añade Microsoft Calendar y Microsoft Teams.",
        "Una suscripción no concede permisos para editar calendarios ajenos ni evita las restricciones de una cuenta de trabajo."
      ]
    },
    {
      "heading": "Información de compra y cancelación",
      "body": [
        "Antes de comprar, consulta el precio local, el período de facturación y las condiciones de renovación.",
        "Para una suscripción facturada por Apple, abre Ajustes → tu nombre → Suscripciones. Revisa el estado y la fecha de vencimiento. Cancelar la renovación es distinto de borrar la app o los datos del calendario; no des por hecho que las funciones de pago siguen disponibles al vencer."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Antes de comprar, consulta el precio local, el período de facturación y las condiciones de renovación.",
    "Una suscripción no concede permisos para editar calendarios ajenos ni evita las restricciones de una cuenta de trabajo."
  ],
  "faq": [
    {
      "q": "¿Cómo detengo la renovación?",
      "a": "Para una suscripción facturada por Apple, abre Ajustes → tu nombre → Suscripciones. Revisa el estado y la fecha de vencimiento. Cancelar la renovación es distinto de borrar la app o los datos del calendario; no des por hecho que las funciones de pago siguen disponibles al vencer."
    }
  ],
  "sourcesHeading": "Información de compra y cancelación",
  "sources": [
    {
      "label": "Apple: ¿Cómo detengo la renovación?",
      "url": "https://support.apple.com/en-us/118428"
    }
  ],
  "seeAlso": [
    "free-google-sync-without-adverts"
  ]
},
};
