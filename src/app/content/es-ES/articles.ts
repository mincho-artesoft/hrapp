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
  "updated": "2026-10-23",
  "title": "Calendario con tiempo en iPhone y iPad: planifica tu día de un vistazo",
  "short": "Usa el calendario y el tiempo juntos",
  "description": "Compara tu calendario con el tiempo del lugar seleccionado en iPhone y iPad.",
  "lede": "Cloud Calendars reúne tu agenda y el tiempo en la misma app para iPhone o iPad. Usa el calendario para elegir una fecha y la vista del tiempo para consultar el lugar seleccionado y las horas de previsión disponibles. Si tienes un plan al aire libre, comprueba el periodo que te interesa en lugar de fiarte de un icono diario. Esta guía la publica Arte Soft, desarrollador de la app.",
  "commonBelief": "El tiempo que se muestra junto al calendario describe automáticamente la dirección de cada evento, cada hora y cualquier fecha futura.",
  "sections": [
    {
      "heading": "Elige una pregunta de planificación real",
      "body": [
        "Empieza por un evento concreto, como una visita al parque por la tarde. Identifica qué podría cambiar: la hora, el lugar, la preparación o la decisión de optar por una alternativa. No necesitas reorganizar todo el calendario solo porque el símbolo del día muestre lluvia.",
        "Anota la hora real de inicio y fin de la actividad, incluida la preparación si procede. La vista general del calendario ayuda a encontrar fechas posibles, mientras que la comprobación de la previsión se refiere a un lugar y a un intervalo concretos. Mantén separadas esas dos tareas al comparar opciones."
      ]
    },
    {
      "heading": "Confirma el lugar del tiempo antes de leer los valores",
      "body": [
        "Cloud Calendars ofrece el tiempo del lugar actual o del lugar seleccionado. Comprueba la ubicación mostrada en vez de dar por hecho que la dirección de un evento cambia la previsión sin indicarlo. Un evento en otra ciudad requiere compararlo con el tiempo de esa ciudad.",
        "Por ejemplo, alguien puede estar planeando llegar a un museo mientras el teléfono sigue en casa. Lee la ubicación de la previsión y la hora local del evento antes de compararlas. Que los valores parezcan cercanos en pantalla no demuestra que la agenda y el tiempo usen el mismo lugar."
      ]
    },
    {
      "heading": "Comprueba por separado la cobertura por horas y por días",
      "body": [
        "Usa una entrada diaria para orientarte y las entradas horarias disponibles cuando tengas una pregunta sobre una parte del día. Una reserva de dos a cinco necesita algo más que un vistazo a un solo símbolo. Comprueba si las horas relevantes están realmente disponibles.",
        "En la fuente actual de la app, la lista diaria incluye hasta diez días devueltos por WeatherKit. Esto es independiente de la navegación del calendario y de las horas que se suministran en ese momento. Un evento futuro no amplía la cobertura meteorológica. Si su periodo no aparece, programa una nueva revisión de la previsión más adelante."
      ]
    },
    {
      "heading": "Interpreta correctamente lo que significa cada valor meteorológico",
      "body": [
        "Apple documenta datos de WeatherKit como temperatura, precipitación, viento y UV, con algunos productos disponibles solo en determinadas regiones. Lee los valores disponibles para el lugar que hayas elegido en vez de esperar todos los productos meteorológicos en cualquier sitio.",
        "La guía del Met Office muestra por qué importan el periodo de la previsión y las definiciones de las variables: algunos valores se refieren a un momento y otros a un periodo. Usa las etiquetas del proveedor correspondiente. La probabilidad de lluvia, la cantidad y la duración responden a preguntas distintas, y ningún número por sí solo decide cualquier actividad al aire libre."
      ]
    },
    {
      "heading": "Revisa el borrador creado a partir de una hora meteorológica",
      "body": [
        "Cuando la app ofrece crear un evento a partir de una hora, abre un borrador. La fuente actual usa la zona horaria de la ubicación meteorológica, propone una duración de una hora y selecciona el calendario predeterminado para eventos nuevos. Revisa cada valor antes de guardar.",
        "Confirma el título, el calendario de destino, el inicio, el fin y la ubicación prevista. Seleccionar una previsión no te da permiso para editar un calendario compartido, avisar a un recinto ni reservar una sala. Comprueba el evento guardado y consigue cualquier acuerdo que el plan necesite."
      ]
    },
    {
      "heading": "Mantén separada la demostración del sitio web",
      "body": [
        "La demostración interactiva del tiempo en el sitio web usa Open-Meteo. La app usa Apple WeatherKit. Una demostración web es útil para explorar la presentación, pero su lugar, sus datos y las fechas disponibles pueden diferir de los de la app.",
        "Para una decisión real, abre la app y compara el evento previsto con la previsión disponible. Si cambias un plan compartido, confirma el organizador, el alcance de la recurrencia y los participantes. Ten preparada una alternativa acordada cuando la actividad dependa de las condiciones."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifica el evento y la decisión que el tiempo podría cambiar.",
    "Confirma la ubicación meteorológica y la fecha y hora locales del evento.",
    "Revisa por separado la cobertura horaria disponible y el resumen diario.",
    "Lee la probabilidad, la cantidad y otros valores relevantes según sus etiquetas.",
    "Revisa todos los detalles del borrador del evento y el calendario de destino antes de guardar.",
    "Vuelve a comprobarlo en el momento de decidir y confirma directamente los cambios compartidos."
  ],
  "faq": [
    {
      "q": "¿El tiempo junto a mi calendario sigue la dirección de cada evento?",
      "a": "No lo des por hecho. Confirma la ubicación meteorológica mostrada y compárala con el lugar; que aparezcan cerca en pantalla no demuestra que coincidan."
    },
    {
      "q": "¿La app usa el proveedor meteorológico del sitio web?",
      "a": "No. La app usa Apple WeatherKit; la demostración del sitio web usa Open-Meteo por separado."
    },
    {
      "q": "¿Elegir una hora de previsión guarda un evento automáticamente?",
      "a": "Inicia un borrador cuando se ofrece esa acción. Comprueba la fecha, la zona horaria, la duración, el calendario y la ubicación, y después guarda el evento previsto."
    }
  ],
  "seeAlso": [
    "weather-calendar-history-versus-forecast-iphone",
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather",
    "weather-where-the-event-is",
    "planning-outdoors-without-being-rained-on"
  ],
  "sourcesHeading": "Fuentes oficiales y lecturas complementarias",
  "sources": [
    {
      "label": "Apple: información de previsión de WeatherKit y disponibilidad regional",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Met Office: lugar de la previsión, periodos y valores meteorológicos",
      "url": "https://weather.metoffice.gov.uk/guides/what-does-this-forecast-mean"
    }
  ],
  "comparison": {
    "heading": "¿Qué vista del tiempo responde a tu pregunta?",
    "columns": [
      "Tu pregunta",
      "Qué revisar",
      "Qué no demuestra"
    ],
    "rows": [
      {
        "cells": [
          "¿Qué toca hoy?",
          "La vista diaria o semanal del calendario junto al tiempo del lugar seleccionado.",
          "Que la dirección de cada evento cambie automáticamente la ubicación meteorológica."
        ]
      },
      {
        "cells": [
          "¿Puede la lluvia afectar a mi evento de la tarde?",
          "Datos horarios del lugar y del periodo completo del evento.",
          "Que un símbolo diario describa cada hora."
        ]
      },
      {
        "cells": [
          "¿Puedo planificar el mes que viene en función del tiempo?",
          "Tu calendario ahora y, después, una revisión de la previsión más cerca de la fecha.",
          "Que navegar por el calendario amplíe la cobertura de la previsión."
        ]
      },
      {
        "cells": [
          "¿Puedo ver un resumen rápido en casa?",
          "El widget adecuado de la pantalla de inicio.",
          "Que todos los diseños de widget incluyan eventos o una previsión completa."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-right",
    "hook"
  ],
  "galleryCaption": "Pantallas reales de Cloud Calendars: la vista del tiempo y un día con eventos. Comprueba en la app el lugar y la fecha seleccionados.",
  "actionHeading": "Planifica con tu agenda y la previsión juntas",
  "actionText": "Cloud Calendars está disponible para iPhone y iPad. Empieza con las vistas, el tiempo y la sincronización con Google Calendar incluidos en Base; Advanced elimina los anuncios, y Premium añade compatibilidad con Microsoft Calendar y Teams.",
  "articleLinks": [
    {
      "slug": "forecast-beside-every-event",
      "label": "Consulta el tiempo en las horas de un evento"
    },
    {
      "slug": "the-widget-that-shows-what-is-next",
      "label": "Elige un widget de calendario y tiempo"
    },
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "Reúne cuentas de calendario en una sola vista"
    }
  ]
},

  'forecast-beside-every-event': {
  "title": "Consulta el tiempo por horas para un evento del calendario en iPhone y iPad",
  "short": "Tiempo durante las horas del evento",
  "description": "Relaciona el lugar, la fecha y las horas de tu evento con la previsión meteorológica disponible.",
  "lede": "Para consultar el tiempo de un evento del calendario, haz coincidir tres cosas: el lugar, su fecha local y el periodo completo del evento. En Cloud Calendars, elige la ubicación meteorológica y revisa las horas disponibles. La dirección de un evento y un icono del tiempo cercano no son, por sí solos, prueba de que coincidan. Arte Soft, el desarrollador, publica esta guía.",
  "commonBelief": "Que un icono meteorológico diario en un calendario es la misma función que una previsión asociada a un evento.",
  "sections": [
    {
      "heading": "Empieza por el lugar y la fecha",
      "body": [
        "Abre la previsión del lugar previsto y compara su fecha con la de la entrada del calendario. La meteorología del calendario puede reflejar el lugar meteorológico seleccionado, así que comprueba que sea el adecuado para el evento en lugar de dar por hecho que la dirección del evento lo determina.",
        "Un evento del mes que viene puede existir antes de que haya datos meteorológicos disponibles para esa fecha. Conserva el evento y vuelve a consultar la previsión cuando se acerque el día; que no aparezca información meteorológica no significa que se prevea cielo despejado."
      ]
    },
    {
      "heading": "Usa el detalle por horas para una consulta por horas",
      "body": [
        "Un resumen diario y una previsión por horas responden a preguntas distintas. Si el evento dura de dos a cinco, revisa las horas disponibles que cubren ese intervalo en lugar de tomar un único icono diario como si fuera la imagen completa.",
        "Si solo está disponible una parte del intervalo, deja el resto sin resolver. La app no promete información meteorológica completa por horas para todos los eventos que puedas crear, y esta guía tampoco promete que al abrir cualquier evento siempre se muestre toda su franja meteorológica."
      ]
    },
    {
      "heading": "Distingue entre probabilidad, cantidad y momento",
      "body": [
        "Lee la etiqueta del valor que estás consultando. La probabilidad de precipitación no es la cantidad de lluvia ni su duración. Del mismo modo, un valor por horas y un resumen diario abarcan periodos distintos; compara periodos equivalentes al valorar dos posibles horarios.",
        "Elige una alternativa adecuada a tu plan en lugar de tratar un único porcentaje como una regla universal para seguir adelante o cancelar. La información meteorológica puede cambiar, así que vuelve a consultarla cuando haya que tomar una decisión."
      ]
    },
    {
      "heading": "Revisa antes de guardar un evento basado en el tiempo",
      "body": [
        "La app puede iniciar un borrador de evento a partir de una hora de la previsión. Revisa la fecha, la hora de inicio, la hora de fin y el calendario de destino del borrador antes de guardarlo. Seleccionar una previsión no sustituye comprobar que estás creando el compromiso correcto.",
        "Si el acceso al calendario o el calendario de destino impiden guardar, resuelve ese permiso por separado del acceso a la información meteorológica. Encontrar una previsión no concede derechos de edición sobre un calendario compartido."
      ]
    },
    {
      "heading": "Usa la previsión completa cuando el resumen no sea suficiente",
      "body": [
        "Para una actividad al aire libre, revisa las variables relevantes para esa actividad y para el lugar que realmente has elegido. Un widget del tiempo actual o una demostración en la página de inicio no sustituyen la comprobación de las horas de previsión disponibles en la app.",
        "Si observas una discrepancia, compara primero el lugar y la marca de tiempo. Distintos proveedores, lugares seleccionados y periodos de previsión pueden dar lugar a visualizaciones diferentes sin demostrar que el evento del calendario haya cambiado."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Confirma la ubicación y la fecha del evento.",
    "Comprueba las horas disponibles durante toda la actividad.",
    "Interpreta la probabilidad y la cantidad como valores distintos.",
    "Revisa el borrador del evento antes de guardarlo."
  ],
  "seeAlso": [
    "weather-inside-your-calendar",
    "planning-outdoors-without-being-rained-on"
  ],
  "updated": "2026-10-23",
  "faq": [
    {
      "q": "¿Todos los eventos tienen una previsión completa?",
      "a": "No. La cobertura depende del lugar seleccionado y de las fechas y horas disponibles."
    },
    {
      "q": "¿El icono del tiempo es específico de la dirección del evento?",
      "a": "No lo deduzcas por su proximidad al evento. Confirma por separado la ubicación meteorológica."
    },
    {
      "q": "¿Tocar una hora guarda un nuevo evento?",
      "a": "Inicia un borrador de evento cuando está disponible. Revisa su fecha, hora y calendario antes de guardarlo."
    }
  ],
  "sourcesHeading": "Fuentes meteorológicas y ajustes de ubicación",
  "sources": [
    {
      "label": "Apple: previsiones de WeatherKit y disponibilidad regional",
      "url": "https://developer.apple.com/weatherkit/"
    },
    {
      "label": "Apple: privacidad y Servicios de Localización",
      "url": "https://support.apple.com/en-us/102515"
    }
  ],
  "comparison": {
    "heading": "Una comprobación práctica antes de un evento al aire libre",
    "columns": [
      "Comprobación",
      "Ejemplo",
      "Decisión"
    ],
    "rows": [
      {
        "cells": [
          "Lugar",
          "El evento es en otra ciudad.",
          "Selecciona ese destino en la vista del tiempo y lee su nombre."
        ]
      },
      {
        "cells": [
          "Periodo",
          "La actividad va de 14:00 a 16:00.",
          "Revisa ambas horas, además de la preparación o el desplazamiento pertinentes."
        ]
      },
      {
        "cells": [
          "Cobertura",
          "Solo están disponibles algunas de las horas necesarias.",
          "Mantén el plan como provisional y programa otra comprobación."
        ]
      },
      {
        "cells": [
          "Evento guardado",
          "Inicias un borrador desde una hora meteorológica.",
          "Revisa la fecha, la zona horaria, la duración y el calendario de destino antes de guardar."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-right",
    "week-left"
  ],
  "galleryCaption": "Las vistas del tiempo y de la semana muestran partes distintas de la misma tarea de planificación. Confirma por separado el lugar de la previsión y la ubicación del evento.",
  "actionHeading": "Comprueba la previsión frente a tus eventos reales",
  "actionText": "Usa Cloud Calendars en iPhone o iPad para revisar la previsión disponible y tu agenda. El tiempo orienta tu elección; no mueve automáticamente un evento ni confirma un cambio con los participantes.",
  "articleLinks": [
    {
      "slug": "weather-inside-your-calendar",
      "label": "Entiende las vistas de calendario y tiempo"
    },
    {
      "slug": "the-widget-that-shows-what-is-next",
      "label": "Elige una vista rápida de la pantalla de inicio"
    },
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "Comprueba los calendarios detrás de tu agenda"
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
  "updated": "2026-10-23",
  "title": "Ve juntos los calendarios de Google, iCloud y Outlook en iPhone y iPad",
  "short": "Tres proveedores, una sola vista",
  "description": "Combina vistas de calendario y entiende los permisos de la cuenta, las copias y los requisitos del plan.",
  "lede": "Para ver juntos los eventos del trabajo y los personales, conecta las cuentas que quieras, selecciona sus calendarios y comprueba los mismos eventos en una sola vista. Cloud Calendars es compatible con la planificación en iPhone y iPad con iCloud y Google Calendar; la compatibilidad con Microsoft Calendar está en Premium. Ver los eventos juntos es distinto de copiar el tiempo ocupado entre cuentas de distintos proveedores. Arte Soft, el desarrollador, publica esta guía.",
  "commonBelief": "Poner varios calendarios en una sola app hace automáticamente que su disponibilidad, el uso compartido y las copias de eventos se mantengan sincronizados entre sí.",
  "sections": [
    {
      "heading": "Identifica la cuenta y el calendario detrás de cada evento",
      "body": [
        "Empieza con un evento corriente de cada proveedor. Anota la dirección de correo con la que has iniciado sesión, el nombre del calendario y si el evento es tuyo o si recibiste una invitación. Dos calendarios llamados “Calendar” pueden pertenecer a cuentas completamente distintas. Un color ayuda a revisar una semana de un vistazo; la cuenta y el calendario identifican dónde debe hacerse una edición.",
        "Por ejemplo, una cita con el dentista en tu calendario personal de iCloud y una reunión de proyecto en Microsoft pueden aparecer juntas para ti. Eso, por sí solo, no hace que la cita con el dentista sea visible para tus compañeros ni reserva ese tiempo en sus herramientas de programación.",
        "Decide el resultado que quieres antes de cambiar una conexión. Si quieres mover datos de eventos a otra cuenta, usa «Elige un formato de exportación de calendario» más abajo para encontrar una vía de transferencia compatible y comprueba eventos representativos antes de confiar en el destino. Si quieres comparar horarios, mantén los propietarios actuales de los calendarios y muestra juntas las fuentes seleccionadas. Si otra cuenta debe recibir el tiempo ocupado, «Cloud Calendars y OneCal según el flujo de trabajo» explica en qué se diferencia la copia de disponibilidad de una vista personal general."
      ]
    },
    {
      "heading": "Conecta mediante la vía adecuada",
      "body": [
        "Para iCloud, activa primero iCloud Calendar en el iPhone con la Apple Account correspondiente. La guía de configuración de Apple explica los ajustes del dispositivo. Cloud Calendars accede a los calendarios disponibles a través del sistema de calendario del iPhone y necesita acceso al calendario para leerlos. No basta con que una cuenta esté conectada en otro dispositivo.",
        "Cloud Calendars también incluye las acciones «Sign in with Google» y «Sign in with Microsoft». Comprueba qué cuenta seleccionas al iniciar sesión y luego abre su grupo de calendarios y selecciona los calendarios que necesites. Iniciar sesión en el proveedor correcto con una identidad personal o de trabajo equivocada puede producir una lista de calendarios perfectamente válida, pero inesperada."
      ]
    },
    {
      "heading": "Entiende los planes sin confundirlos con los permisos",
      "body": [
        "El plan Base incluye la sincronización con Google Calendar y las vistas de calendario. Advanced añade la eliminación de anuncios a Base. Premium añade funciones de Microsoft Calendar y Microsoft Teams. Revisa el precio local actual y el periodo de facturación antes de comprar.",
        "Un plan cambia qué funciones de la app están disponibles; no te concede la propiedad del calendario de otra persona. Google distingue entre permiso para ver eventos y permiso para cambiarlos. Las políticas de la empresa y los permisos asociados a un calendario de Microsoft siguen aplicándose. Que un evento sea visible o que haya un editor disponible no demuestra que el proveedor vaya a aceptar una actualización."
      ]
    },
    {
      "heading": "Una vista combinada puede incluir copias de calendarios",
      "body": [
        "Las conexiones con Google y Microsoft usan copias de calendarios en el sistema de calendario del iPhone para presentar y sincronizar eventos. No des por hecho que conectar una cuenta no deja ninguna copia fuera del proveedor original. El destino usado para esas copias puede depender de las fuentes de calendario disponibles en el dispositivo.",
        "Si la misma cuenta también llega al teléfono por otra vía, revisa los nombres y las fuentes de los calendarios antes de tratar eventos repetidos como si fueran eventos distintos. Oculta temporalmente un calendario para identificar qué visualización aporta. No elimines un evento o un calendario solo para que la pantalla quede más ordenada: una copia conectada puede enviar cambios de vuelta a su proveedor."
      ]
    },
    {
      "heading": "Sigue eligiendo el destino cuando crees un evento",
      "body": [
        "Antes de guardar, comprueba el calendario del evento con el mismo cuidado que su fecha y su hora. Para un evento familiar, elige el calendario que realmente usa la familia; para una reunión de trabajo, usa el destino de trabajo permitido. Ver ambos calendarios juntos no convierte automáticamente ninguno de los dos en el destino de todos los eventos nuevos.",
        "Cambiar el calendario de un evento o arrastrarlo entre calendarios puede ser un traslado, no una segunda vista inocua. Mantén las invitaciones y las reuniones recurrentes en su calendario habitual mientras diagnosticas un problema de visualización. Si necesitas hacer un cambio, determina primero quién es el propietario del evento y qué calendario puede aceptarlo."
      ]
    },
    {
      "heading": "Verifica la vista general antes de confiar en ella",
      "body": [
        "Compara un evento reciente en el propio calendario del proveedor con el evento correspondiente en Cloud Calendars. Comprueba la fecha, la zona horaria, el título y el calendario seleccionado. En un calendario editable que sea tuyo, un evento desechable sin invitados es una mejor comprobación que modificar una reunión real. Confirma el resultado en el proveedor antes de considerar que la conexión está lista.",
        "No confíes en que la vista combinada cree automáticamente bloques anónimos de tiempo ocupado en otra cuenta. Si necesitas que tus compañeros te vean como no disponible sin ver detalles personales, usa una configuración de disponibilidad aprobada explícitamente y verifícala desde su lado. Una vista personal clara y la disponibilidad compartida son tareas distintas."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Anota la cuenta exacta y el calendario de un evento de cada proveedor.",
    "Activa en el dispositivo los calendarios de iCloud que quieras y revisa el acceso al calendario.",
    "Usa el inicio de sesión adecuado de Google o Microsoft y selecciona los calendarios deseados.",
    "Compara un evento reciente con su vista en el proveedor antes de cambiar nada.",
    "Oculta temporalmente una fuente sospechosa de estar duplicada; mantén intactos los eventos subyacentes.",
    "Comprueba el calendario de destino en cada evento nuevo y verifica por separado cualquier uso compartido de tiempo ocupado que necesites."
  ],
  "faq": [
    {
      "q": "¿Verán mis compañeros de trabajo mis eventos personales porque muestro ambos calendarios?",
      "a": "Mostrar calendarios juntos no es una instrucción para compartir ni un puente automático de tiempo ocupado. Comprueba la configuración real de uso compartido de cada calendario. Las conexiones con proveedores pueden crear copias de calendarios en el dispositivo, así que una vista combinada tampoco garantiza que los datos de los eventos existan solo en su proveedor original."
    },
    {
      "q": "¿Por qué puedo ver un evento pero no editarlo correctamente?",
      "a": "Puede que el calendario sea de solo lectura, que el evento pertenezca a otro organizador o que el proveedor rechace la actualización. Comprueba la propiedad y los permisos en el calendario del proveedor. Contratar un plan superior de la app no cambia esos permisos."
    },
    {
      "q": "¿Debo conectar la misma cuenta de Google por todas las vías disponibles?",
      "a": "Primero comprueba cómo aparece ya en el teléfono. Varias vías pueden dificultar la identificación de copias del calendario. Elige la vía que vayas a usar, verifica sus eventos y, mientras investigas, oculta una visualización adicional en lugar de borrar datos o desconectar cuentas como primer paso."
    }
  ],
  "sourcesHeading": "Fuentes y referencias de configuración",
  "sources": [
    {
      "label": "Apple: configurar iCloud Calendar en tus dispositivos",
      "url": "https://support.apple.com/guide/icloud/set-up-calendar-mme4d73a8727/icloud"
    },
    {
      "label": "Google: uso compartido y permisos del calendario",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: API de calendario de Outlook y datos de buzón compatibles",
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
    "heading": "¿Vista combinada, suscripción o tiempo ocupado copiado?",
    "columns": [
      "Lo que necesitas",
      "Qué comprobar",
      "Qué no debes dar por hecho"
    ],
    "rows": [
      {
        "cells": [
          "Una sola vista de varias cuentas",
          "La cuenta conectada, el calendario seleccionado y el plan necesario.",
          "Que una pantalla compartida combine la propiedad o los permisos."
        ]
      },
      {
        "cells": [
          "Que la edición de un evento llegue a su proveedor",
          "El evento original, el permiso de escritura y el resultado guardado en el origen.",
          "Que una edición local visible demuestre una sincronización correcta con el proveedor."
        ]
      },
      {
        "cells": [
          "Tiempo ocupado en otra cuenta",
          "Un servicio con reglas explícitas de sincronización de origen a destino.",
          "Que una vista combinada cree bloques de disponibilidad para compañeros."
        ]
      },
      {
        "cells": [
          "Un calendario suscrito",
          "El editor, el comportamiento de actualización y el estado de solo lectura.",
          "Que una suscripción ICS sea una conexión editable y bidireccional."
        ]
      }
    ]
  },
  "galleryKinds": [
    "week-left",
    "hook"
  ],
  "galleryDevice": "iPad",
  "galleryCaption": "Las vistas reales del calendario en iPad ilustran la revisión de un horario. Una captura de pantalla no demuestra la dirección de la sincronización del proveedor ni los permisos de la cuenta.",
  "actionHeading": "Revisa tus calendarios juntos en iPhone y iPad",
  "actionText": "La sincronización con Google Calendar está incluida en Base. Advanced añade la eliminación de anuncios; Premium añade compatibilidad con Microsoft Calendar y Teams. Confirma los permisos de la cuenta independientemente del plan contratado.",
  "articleLinks": [
    {
      "slug": "onecal-alternative-iphone-calendar-view-or-sync",
      "label": "Comparar una vista combinada con las reglas de sincronización de OneCal"
    },
    {
      "slug": "fantastical-readdle-calendar366-iphone-comparison",
      "label": "Comparar flujos de trabajo del calendario en iPhone"
    },
    {
      "slug": "weather-inside-your-calendar",
      "label": "Planificar con la meteorología y los eventos juntos"
    }
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
  "updated": "2026-10-23",
  "title": "Widgets de calendario en iPhone y iPad: próximos eventos y tiempo",
  "short": "Próximos eventos en la pantalla de inicio",
  "description": "Elige un widget de Cloud Calendars para próximos eventos, la fecha o el tiempo.",
  "lede": "Elige Calendar Events o Calendar Events Large si quieres ver próximos eventos en tu pantalla de inicio. Elige Calendar & Weather para mostrar la fecha y el tiempo. Estos diseños responden a preguntas distintas; previsualiza el que se ofrezca en tu dispositivo antes de añadirlo. Esta guía la publica Arte Soft, desarrollador de Cloud Calendars.",
  "sections": [
    {
      "heading": "Elige primero el diseño de eventos",
      "body": [
        "En la galería de widgets de Cloud Calendars, Calendar Events es el diseño mediano de lista de eventos. Calendar Events Large ofrece más espacio para próximos eventos. Calendar & Weather es un diseño independiente de fecha y tiempo; su tamaño pequeño no garantiza una fila para el próximo evento. Los nombres pueden aparecer traducidos en tu dispositivo.",
        "En iPhone, mantén pulsada una zona vacía de la pantalla de inicio, toca Editar y Añadir widget, luego busca Cloud Calendars y selecciona el diseño que quieras. Compara la vista previa antes de añadirlo. Las instrucciones de Apple sobre widgets se refieren a esta galería del sistema; es independiente de las vistas de calendario dentro de la app."
      ]
    },
    {
      "heading": "Añade y comprueba el widget en iPad",
      "body": [
        "En iPad, usa la galería de widgets de la pantalla de inicio de Apple: mantén pulsado el fondo, abre Editar y después Añadir widget. Busca Cloud Calendars, revisa los estilos y tamaños disponibles, añade el diseño que necesites, colócalo y termina con OK. Sigue los controles que muestre tu versión de iPadOS; una vista previa no confirma que se hayan cargado los datos de tu calendario.",
        "Elige Calendar Events o Calendar Events Large cuando necesites ver eventos. Compara los estilos que ofrece la app instalada; un recuadro de fecha y tiempo responde a una necesidad distinta de la de una lista de eventos.",
        "Abre Cloud Calendars en ese iPad y localiza un evento futuro con hora de inicio en un calendario seleccionado. Que se vea correctamente en tu iPhone no confirma las cuentas, el acceso ni los datos cargados en el iPad. Compara el título, la fecha y la hora de inicio, y después sigue con las comprobaciones de compatibilidad y actualización de abajo si el widget es distinto."
      ]
    },
    {
      "heading": "Comprueba qué se considera próximo",
      "body": [
        "La visualización de eventos usa los calendarios seleccionados y los eventos futuros con hora de inicio. Las entradas de todo el día y los eventos cuya hora de inicio ya ha pasado se excluyen de esta lista de próximos eventos. Por eso, un cumpleaños o una reunión ya iniciada pueden verse en la app sin aparecer aquí.",
        "Por ejemplo, si hoy tu única entrada es una etiqueta de viaje de todo el día, una lista de próximos eventos vacía no significa que esa etiqueta se haya perdido. Abre la app para revisar el día completo. Del mismo modo, el siguiente evento con hora de inicio puede ser mañana o más adelante; mira la fecha en lugar de asumir que todas las filas son de hoy."
      ]
    },
    {
      "heading": "Distingue entre un evento que falta y una lista que ya no tiene más filas",
      "body": [
        "Un widget muestra un conjunto limitado de próximos eventos. Si los eventos anteriores ocupan sus filas, puede que un evento posterior no aparezca aunque sí esté en la app y cumpla los requisitos para la lista de próximos eventos. Un diseño de eventos más grande puede mostrar más filas, pero sigue sin ser el calendario completo.",
        "Empieza por el evento futuro con hora de inicio más cercano en un calendario seleccionado. Si aparece, pero uno posterior no, abre la app para revisar el resto de la programación. Si también falta el evento apto más cercano, continúa con las comprobaciones de selección de calendario, acceso y actualización. No muevas ni elimines eventos solo para que aparezca una entrada posterior."
      ]
    },
    {
      "heading": "Haz de la app tu primera comparación",
      "body": [
        "Abre Cloud Calendars y localiza un evento futuro concreto con hora de inicio. Confirma que su calendario esté seleccionado y que la app tenga el acceso al calendario que necesita. Compara el título, la fecha y la hora de inicio con el widget. Si el evento tampoco aparece en la app, investiga primero la cuenta o la sincronización.",
        "Usa un evento de prueba inocuo en un calendario tuyo si necesitas un ejemplo claro. Asígnale una hora de inicio futura y un título reconocible. Evita modificar una invitación real o eliminar cuentas solo para probar la pantalla de inicio."
      ]
    },
    {
      "heading": "Ten en cuenta las actualizaciones sin asumir un plazo fijo",
      "body": [
        "Los widgets muestran información guardada y no se ejecutan continuamente como una app abierta. Apple controla su programación de actualización. Abrir la app y comprobar el evento te da un punto de comparación reciente, pero no establece un número exacto de segundos tras los cuales el widget deba cambiar.",
        "Si la app sigue mostrando la información correcta mientras el widget sigue siendo incorrecto, anota el diseño, el calendario seleccionado, la hora del evento y las versiones de la app y de iOS. Una lista vacía, un evento antiguo y una hora incorrecta son observaciones distintas; indica cuál ves."
      ]
    },
    {
      "heading": "Lee el tiempo como un resumen independiente",
      "body": [
        "El tiempo que aparece junto a la fecha no es una previsión asociada al lugar y la hora de inicio de cada evento. Antes de un evento al aire libre, abre la vista del tiempo y consulta el lugar y la hora previstos. Un icono de condiciones actuales no puede determinar qué condiciones habrá en una reunión posterior.",
        "Mantén este widget para orientarte rápidamente. Usa el calendario completo para compromisos de todo el día, detalles de los eventos y decisiones que requieran ver toda la programación."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Elige Calendar Events o Calendar Events Large para ver una lista de eventos.",
    "Verifica un evento futuro con hora de inicio en un calendario seleccionado.",
    "Compara su fecha y su hora en la app antes de solucionar problemas del widget.",
    "Anota las diferencias persistentes en lugar de eliminar datos del calendario."
  ],
  "faq": [
    {
      "q": "¿Por qué no aparece mi cumpleaños?",
      "a": "La lista de próximos eventos excluye los eventos de todo el día. Consulta el calendario completo para ver cumpleaños y otras entradas solo de fecha."
    },
    {
      "q": "¿El widget pequeño muestra la próxima reunión?",
      "a": "El diseño pequeño Calendar & Weather muestra la fecha y el tiempo. Elige un diseño de lista de eventos para ver eventos."
    },
    {
      "q": "¿Que no haya ningún próximo evento significa que hoy estoy libre?",
      "a": "No. Las entradas de todo el día, los eventos ya iniciados, los calendarios no seleccionados y la información desactualizada pueden cambiar esa conclusión."
    }
  ],
  "sourcesHeading": "Fuentes e instrucciones de Apple",
  "sources": [
    {
      "label": "Apple: añadir y editar widgets en iPhone",
      "url": "https://support.apple.com/118610"
    },
    {
      "label": "Apple: mantener un widget actualizado",
      "url": "https://developer.apple.com/documentation/widgetkit/keeping-a-widget-up-to-date"
    },
    {
      "label": "Apple: añadir, editar y eliminar widgets en iPad",
      "url": "https://support.apple.com/guide/ipad/add-edit-and-remove-widgets-ipadb0de8630/ipados"
    }
  ],
  "seeAlso": [
    "choosing-a-widget-size",
    "a-countdown-to-your-next-meeting",
    "calendar-on-apple-watch"
  ],
  "comparison": {
    "heading": "Elige la visualización que realmente necesitas",
    "columns": [
      "Visualización",
      "Úsalo para",
      "Compruébalo antes de confiar en ello"
    ],
    "rows": [
      {
        "cells": [
          "Calendar Events",
          "Una vista compacta de próximos eventos con hora de inicio.",
          "El evento pertenece a un calendario seleccionado y aún no ha empezado."
        ]
      },
      {
        "cells": [
          "Calendar Events Large",
          "Más espacio para próximos eventos.",
          "Un diseño más grande sigue teniendo un número limitado de filas."
        ]
      },
      {
        "cells": [
          "Calendar & Weather",
          "Un resumen rápido de fecha y tiempo.",
          "Su diseño pequeño no garantiza una fila de próximo evento."
        ]
      },
      {
        "cells": [
          "Live Activity",
          "Una cuenta atrás independiente para el próximo evento en las superficies compatibles del iPhone.",
          "No es un widget de la pantalla de inicio ni un diseño específico de widget para la pantalla bloqueada."
        ]
      }
    ]
  },
  "galleryKinds": [
    "widgets",
    "live"
  ],
  "galleryCaption": "Los widgets de la pantalla de inicio y la Live Activity son visualizaciones independientes. Selecciona el diseño que se ajuste a la información que necesitas.",
  "actionHeading": "Pon la parte útil de tu agenda en la pantalla de inicio",
  "actionText": "Abre Cloud Calendars, comprueba un evento futuro conocido con hora de inicio y luego añade el widget adecuado en tu iPhone o iPad. La app sigue siendo el lugar para revisar el calendario completo.",
  "articleLinks": [
    {
      "slug": "weather-inside-your-calendar",
      "label": "Consulta el tiempo junto a tu agenda"
    },
    {
      "slug": "forecast-beside-every-event",
      "label": "Comprueba las horas de un evento al aire libre"
    },
    {
      "slug": "icloud-google-and-outlook-in-one-view",
      "label": "Comprueba tus cuentas de calendario conectadas"
    }
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
