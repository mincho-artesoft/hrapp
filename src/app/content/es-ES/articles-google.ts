import { LocalisedArticle } from '../types';

/** Los seis artículos de Google: preguntas concretas, respuestas claras. */
export const GOOGLE_ES_ES: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
  "title": "Permisos de Google Calendar: revisa el acceso que realmente concedes",
  "short": "Acceso y privacidad en Google Calendar",
  "description": "Elige acceso a disponibilidad, detalles o edición. Revisa los permisos públicos y de grupos, además de los individuales, antes de compartir.",
  "lede": "Antes de compartir un calendario, decide qué necesita hacer la otra persona. Planificar según tu disponibilidad, leer detalles y mantener el calendario son tareas distintas. Esta guía la publica Arte Soft, desarrollador de Cloud Calendars.",
  "commonBelief": "Dar a una persona un permiso restringido garantiza que no podrá ver detalles por ninguna otra vía.",
  "sections": [
    {
      "heading": "Adapta el acceso a la tarea",
      "body": [
        "Un compañero que busca un horario puede necesitar disponibilidad sin detalles de citas. Quien mantiene el calendario de un proyecto necesita otra configuración. Decide primero la tarea y después revisa el permiso que muestran los ajustes actuales del calendario.",
        "Google distingue disponibilidad, detalles y varios niveles de edición. Una opción de edición limita el acceso a eventos privados; otra permite editar eventos y ver detalles, y la más amplia permite administrar el uso compartido. No trates como equivalentes todas las opciones que mencionan cambios."
      ]
    },
    {
      "heading": "Revisa el acceso general y el de cada persona",
      "body": [
        "Además de personas concretas, comprueba si el calendario es público, está disponible para tu organización o se comparte con un grupo. Google indica que un acceso más amplio puede prevalecer sobre uno restringido: limitar a una persona no oculta detalles ya publicados.",
        "Por ejemplo, piensa en un calendario de un club publicado para sus socios. Antes de añadir una cita personal, revisa su público en lugar de suponer que solo importa el permiso junto al nombre de un amigo. Guarda las citas privadas en un destino adecuado."
      ]
    },
    {
      "heading": "Usa los ajustes de Google del calendario exacto",
      "body": [
        "En Google Calendar para ordenador, localiza el calendario entre los tuyos, abre su menú y entra en los ajustes para compartir. Google documenta áreas separadas para personas o grupos y para acceso más amplio. Comprueba nombre del calendario y cuenta antes de cambiar algo.",
        "Confirma la identidad Google prevista del destinatario al invitarlo. Si no encuentra el calendario, verifica la dirección y el mensaje de invitación en lugar de ampliar el acceso para que aparezca. Una visualización ausente y unos permisos de edición insuficientes son problemas distintos."
      ]
    },
    {
      "heading": "Prueba el resultado sin citas privadas",
      "body": [
        "Usa una cita de prueba normal sin título privado, notas, ubicación ni lista de invitados. Pide al destinatario que confirme qué ve y, solo si editar es necesario y está permitido, qué puede cambiar. No compartas las credenciales de tu cuenta para hacer la prueba.",
        "Anota el calendario y el rol concedido y revisa el resultado después de cambiar el ajuste. Así verificas la configuración prevista, pero no demuestras que haya desaparecido información leída o copiada antes. No hagas la prueba publicando un calendario laboral real."
      ]
    },
    {
      "heading": "Separa las políticas laborales de los planes de la app",
      "body": [
        "Google indica que administradores de trabajo o centros educativos pueden restringir los controles para compartir. Si falta el ajuste necesario, usa la vía aprobada por la organización. No publiques información laboral para sortear una restricción de cuenta.",
        "Cloud Calendars puede mostrar calendarios conectados, pero sus planes no redefinen los permisos de Google. Advanced elimina anuncios; no es un pago que dé a otra persona acceso a todos los eventos Google. Revisa el uso compartido del proveedor y verifica el resultado aceptado, sin depender solo de un editor local disponible."
      ]
    },
    {
      "heading": "Revisa y retira el acceso que ya no necesitas",
      "body": [
        "Al terminar un proyecto, revisa destinatarios reales, grupos y cualquier publicación más amplia. Quitar una persona es solo parte de la comprobación si hay otras vías de acceso. Acordad quién mantiene el calendario y cómo gestionar futuros cambios de permisos.",
        "Google documenta por separado quitar personas o grupos y desactivar el acceso más amplio. Retirar acceso no recupera archivos exportados, capturas ni información copiada en otro lugar. Trátalos por separado con las personas implicadas, sin prometer que un interruptor borre todas las copias anteriores."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifica el calendario y la tarea del destinatario.",
    "Revisa acceso individual, de grupos, de la organización y público.",
    "Elige el permiso para esa tarea en los ajustes actuales de Google.",
    "Verifica la identidad antes de cambiar el acceso.",
    "Comprueba un evento de prueba inocuo desde el lado del destinatario.",
    "Revisa las vías de acceso obsoletas sin suponer que se recuperan las copias anteriores."
  ],
  "faq": [
    {
      "q": "¿Un permiso individual restringido prevalece sobre un calendario público?",
      "a": "No. Google documenta que los permisos más amplios prevalecen cuando hay conflicto. Revisa los ajustes públicos y de organización además del permiso individual."
    },
    {
      "q": "¿Todos los permisos de edición exponen igual los eventos privados?",
      "a": "No. Google documenta una opción de edición que limita el acceso a eventos privados por separado de otras opciones de edición y administración. Lee el permiso actual exacto antes de elegir."
    },
    {
      "q": "¿Comprar Advanced cambia los derechos para compartir en Google?",
      "a": "No. Advanced elimina anuncios en Cloud Calendars. El acceso depende de los permisos del calendario y de las restricciones de la organización."
    }
  ],
  "sourcesHeading": "Orientación actual de Google sobre permisos y uso compartido",
  "sources": [
    {
      "label": "Google: elegir permisos del calendario",
      "url": "https://support.google.com/calendar/answer/15716974?hl=en"
    },
    {
      "label": "Google: compartir un calendario y retirar acceso",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    }
  ],
  "seeAlso": [
    "why-a-shared-calendar-does-not-appear"
  ],
  "updated": "2026-10-21"
},

  'why-a-shared-calendar-does-not-appear': {
    "updated": "2026-10-21",
    "title": "Te compartieron un calendario y no aparece",
    "short": "Calendario compartido que no aparece",
    "description": "Si falta un calendario compartido de Google, revisa la cuenta invitada, el grupo, la visibilidad y el tipo de enlace.",
    "lede": "Esta guía es de Arte Soft, desarrollador de Cloud Calendars. Primero distingue la falta de acceso de un calendario que simplemente está oculto.",
    "commonBelief": "Que aceptar un calendario compartido lo pone en tu teléfono.",
    "sections": [
      {
        "heading": "Comprueba la cuenta y el grupo",
        "body": [
          "Compara el destinatario de la invitación con la cuenta de Google del teléfono y del navegador. Abre el enlace con la cuenta correcta. Google permite compartir con personas y Grupos de Google. Si accedes mediante un grupo, pide a su administrador que confirme tu pertenencia y al propietario del calendario que compruebe el grupo autorizado. Un correo reenviado no concede permiso por sí solo."
        ]
      },
      {
        "heading": "¿Oculto, ausente o restringido?",
        "body": [
          "Abre el menú de Google Calendar en el iPhone o iPad. Si el calendario aparece sin marcar, selecciónalo. Si no aparece, pide al propietario que revise el acceso: solicitarlo no equivale a obtenerlo. Las políticas del trabajo o del centro educativo pueden limitarlo. Compara la misma cuenta en Google Calendar en la web. Si allí funciona, revisa la cuenta conectada y los calendarios seleccionados en la otra app. El acceso de solo lectura no permite editar."
        ]
      },
      {
        "heading": "Identifica el enlace",
        "body": [
          "Una invitación para compartir también contiene un enlace; no todos son suscripciones ICS. Pregunta si concede acceso a un calendario de Google o publica un feed de solo lectura. Google indica que una suscripción nueva requiere un navegador de ordenador; abrir un calendario ya compartido por correo es otra operación. La actualización de un feed depende del servicio receptor. No hay un plazo universal: confirma los cambios urgentes con el organizador."
        ]
      }
    ],
    "claims": {},
    "faq": [
      {
        "q": "¿Puede un Grupo de Google recibir acceso?",
        "a": "Sí. Comprueba el grupo elegido, tu pertenencia y las restricciones de la organización. Un correo del grupo reenviado no demuestra acceso."
      },
      {
        "q": "¿Debo borrar y volver a conectar la cuenta?",
        "a": "Primero revisa la identidad, los permisos y la visibilidad, y compara el calendario web. Reconectar no concede permisos que faltan."
      }
    ],
    "practical": [
      "Confirma la cuenta invitada y la pertenencia al grupo.",
      "Selecciona el calendario si aparece pero está oculto.",
      "Pide que revisen el acceso antes de cambiar conexiones."
    ],
    "sourcesHeading": "Fuentes y más información",
    "sources": [
      {
        "label": "Google: Comprueba la cuenta y el grupo",
        "url": "https://support.google.com/calendar/answer/37082?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: ¿Oculto, ausente o restringido?",
        "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
      },
      {
        "label": "Google: Identifica el enlace",
        "url": "https://support.google.com/calendar/answer/37648?hl=en"
      }
    ],
    "seeAlso": [
      "who-can-see-what-in-google-calendar",
      "google-calendars-that-never-reach-your-iphone"
    ]
  },

  'the-secret-address-of-a-google-calendar': {
  "title": "La dirección iCal secreta de Google: suscribirse no es compartir",
  "short": "La dirección iCal secreta",
  "description": "Distingue la dirección iCal secreta, las conexiones de cuenta y los canales compartidos, sin prometer cambios inmediatos ni borrar copias.",
  "lede": "Una dirección de calendario, una conexión de cuenta y una invitación cumplen funciones distintas. Identifica cuál tienes antes de llevar un calendario a otra aplicación. Esta guía la publica Arte Soft, desarrollador de Cloud Calendars.",
  "commonBelief": "Una dirección secreta es una invitación personal que puede retirarse a un único destinatario.",
  "sections": [
    {
      "heading": "Elige la conexión adecuada",
      "body": [
        "Google distingue entre iniciar sesión en otra aplicación de calendario y consultar mediante una dirección iCal secreta. La conexión de cuenta puede permitir editar; la dirección ofrece una suscripción de solo lectura. Google indica que la dirección secreta es para uso propio y desaconseja compartirla con otras personas.",
        "Mostrar tu propio horario de trabajo en otro calendario compatible no equivale a dar acceso continuado a un compañero. Define primero el objetivo: consultar tu agenda, colaborar con alguien concreto o distribuir un horario para un público. No elijas una URL solo porque sea fácil pegarla."
      ]
    },
    {
      "heading": "Busca el calendario correcto, no solo la cuenta",
      "body": [
        "En un ordenador, las instrucciones de Google sitúan «Secret address in iCal format» dentro de «Integrate calendar» del calendario elegido. Comprueba antes su nombre. Los administradores del trabajo o centro educativo pueden restringir esta opción; que falte la dirección no justifica publicar el calendario.",
        "Evita que la dirección aparezca en capturas, consultas públicas de soporte o notas compartidas. Al pedir ayuda, describe el tipo de cuenta, el nombre del calendario y la conexión sin aportar la URL. Normalmente, soporte necesita identificar primero la vía de conexión, antes de conocer el contenido de los eventos."
      ]
    },
    {
      "heading": "Comprueba qué ha añadido la aplicación receptora",
      "body": [
        "Una suscripción sigue un canal; importar un archivo crea una copia independiente. Lee las instrucciones de la aplicación receptora y confirma qué acción realizas. Si solo abres un archivo de calendario descargado, no presupongas que las citas resultantes seguirán los cambios posteriores.",
        "Compara el nombre del calendario, la fecha y los detalles con un evento habitual que reconozcas y que no sea sensible. No crees una segunda suscripción para diagnosticar la primera: dos copias visibles pueden hacer que un retraso parezca un conflicto de citas. Oculta temporalmente un calendario al identificar el origen."
      ]
    },
    {
      "heading": "Distingue los enlaces de Google y Cloud Calendars",
      "body": [
        "Cloud Calendars tiene sus propios procesos para compartir eventos y calendarios, incluidos canales de suscripción. No son direcciones secretas de Google. Antes de abrirlo, aclara si el remitente compartió un evento, un calendario o una invitación vinculada a una cuenta.",
        "Un destinatario de Cloud Calendars puede tener el rol Reader, Writer u Owner. Una dirección de canal por sí sola no demuestra derechos de edición. Del mismo modo, recibir una dirección de consulta de Google no te convierte en propietario. Pregunta al remitente en qué sistema deben hacerse los cambios."
      ]
    },
    {
      "heading": "Ten en cuenta la actualización del calendario receptor",
      "body": [
        "Una suscripción no promete entrega inmediata. Los canales de Cloud Calendars incluyen un intervalo de actualización sugerido, pero la aplicación receptora decide cuándo obtiene y muestra las novedades. Una hora antigua en un dispositivo no demuestra por sí sola que el organizador no guardara el cambio.",
        "Para una reunión del mismo día, compara con la agenda actual del organizador y confirma directamente los cambios importantes. Anota qué calendario sigue mostrando la información antigua y cuándo lo comprobaste. No importes repetidamente el evento ni borres el calendario de origen para forzar la actualización."
      ]
    },
    {
      "heading": "Actúa ante una divulgación sin prometer recuperar las copias",
      "body": [
        "Google explica cómo restablecer una dirección secreta divulgada: invalida la anterior y crea otra. Identifica tus aplicaciones que la utilizan para actualizar sus suscripciones después. Restablecer una dirección es distinto de retirar a un colaborador concreto.",
        "Las citas guardadas, exportaciones y capturas anteriores son otra cuestión. Cambiar un enlace no demuestra que todas las copias hayan desaparecido. Si distribuiste información al público equivocado, considera el contenido y los destinatarios reales, en vez de interpretar un restablecimiento correcto como prueba de eliminación completa."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifica si tienes una conexión de cuenta, invitación, suscripción o archivo.",
    "Comprueba el calendario de origen antes de copiar una dirección.",
    "Reserva la dirección secreta de Google para tus propias aplicaciones compatibles.",
    "Verifica que la aplicación receptora se suscribió y no importó.",
    "Confirma los cambios urgentes con el organizador sin depender de los plazos de actualización.",
    "Si se divulgó la dirección, sigue las instrucciones de Google para restablecerla y actualizar las conexiones previstas."
  ],
  "faq": [
    {
      "q": "¿Puedo dar la dirección secreta a un compañero?",
      "a": "Google recomienda reservarla para tus propias aplicaciones. Si otra persona necesita acceso, utiliza los controles para compartir del calendario y elige el permiso adecuado."
    },
    {
      "q": "¿Una suscripción me permite editar el original?",
      "a": "La dirección iCal secreta de Google es una vía de consulta. Editar requiere una conexión de cuenta y un permiso adecuados; los roles de Cloud Calendars son un mecanismo aparte."
    },
    {
      "q": "¿Restablecer la dirección borra las citas antiguas de todas partes?",
      "a": "Invalida la dirección anterior de Google. No demuestra que se hayan eliminado archivos, citas o capturas guardados de forma independiente."
    }
  ],
  "sourcesHeading": "Orientación de los proveedores y lecturas adicionales",
  "sources": [
    {
      "label": "Google: conexiones de cuenta y direcciones iCal secretas",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    },
    {
      "label": "Google: compartir un calendario",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Microsoft: importar, suscribirse y plazos de actualización",
      "url": "https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "taking-back-a-calendar-you-shared",
    "sharing-one-event-not-your-calendar"
  ],
  "updated": "2026-10-21"
},

  'what-guests-can-do-to-your-event': {
  "title": "Permisos de invitados en Google Calendar: edición, invitaciones y lista de asistentes",
  "short": "Permisos de invitados de un evento",
  "description": "Revisa los permisos y valores predeterminados de invitados. Distingue invitaciones, acceso al calendario y roles Reader, Writer y Owner.",
  "lede": "Poder responder a una invitación no describe todo lo que puede hacer un invitado. Revisa los permisos del evento antes de usar una invitación para el equipo, clientes o una reunión pública. Esta guía la publica Arte Soft, desarrollador de Cloud Calendars.",
  "commonBelief": "Los invitados solo pueden aceptar o rechazar y todas las aplicaciones ofrecen los mismos controles de permisos.",
  "sections": [
    {
      "heading": "Empieza por el organizador y el evento original",
      "body": [
        "Abre el evento correcto en Google Calendar con la cuenta organizadora o una autorizada para gestionarlo. Comprueba calendario, fecha y organizador antes de cambiar permisos. Una cita importada por separado no es un lugar fiable para controlar la invitación original.",
        "Para una reunión de equipo, define quién puede cambiar la hora, invitar a otras personas y ver a los demás participantes. Son decisiones distintas. Un invitado que necesita asistir no necesariamente debe gestionar la reunión."
      ]
    },
    {
      "heading": "Decide si los invitados deben modificar la reunión",
      "body": [
        "Google documenta la opción «Modify event» dentro de «Guests can» en su editor de eventos para ordenador. Es un permiso amplio de colaboración, no solo una forma de proponer otra hora. Google explica que permite gestionar el evento, incluidos editar campos, ver invitados y reservar salas.",
        "Por ejemplo, un coorganizador de confianza que prepara un taller puede necesitar esa flexibilidad; un cliente que acude a una cita quizá no. Decide según la responsabilidad que das al invitado y verifica el evento guardado, sin basarte en la configuración de otra reunión."
      ]
    },
    {
      "heading": "Revisa por separado las invitaciones y la visibilidad de invitados",
      "body": [
        "El modelo de eventos de Google distingue el permiso para invitar a otros del permiso para ver a los demás invitados. Revisa ambos junto al acceso de edición. Desactivar uno no significa haber comprobado el otro, y un valor predeterminado mostrado no demuestra la configuración de un evento existente.",
        "Si reúnes a clientes sin relación entre sí, considera si una invitación compartida es adecuada. La información ya incluida en un correo, una descripción o un mensaje reenviado queda fuera del control actual de la lista de invitados. No pongas datos confidenciales de participantes en la descripción esperando ocultarlos con una lista invisible."
      ]
    },
    {
      "heading": "Comprueba los valores predeterminados y los eventos importantes",
      "body": [
        "Google también documenta «Default guest permissions» en los ajustes de eventos, incluido un valor predeterminado para modificar. Por tanto, los controles no son exclusivamente por evento. Revisa tus valores habituales cuando cambie tu forma de planificar y después comprueba individualmente las invitaciones existentes importantes.",
        "En una reunión recurrente, confirma qué ocurrencia o serie editas antes de guardar. No supongas que cambiar una preferencia ha reescrito invitaciones anteriores. Para probar una configuración con un compañero, usa un ejemplo acordado y sin datos sensibles, en vez de mover o cancelar una reunión real con un cliente."
      ]
    },
    {
      "heading": "Distingue los roles de Cloud Calendars",
      "body": [
        "Cloud Calendars tiene un sistema de uso compartido separado con roles Reader, Writer y Owner. Reader permite consultar y sincronizar; Writer permite editar; Owner también gestiona la participación y el acceso con la identidad invitada. Estos roles no deben presentarse como interruptores de los tres permisos de invitados de Google.",
        "Si importa un permiso específico de Google, inspecciona el evento original en Google Calendar. Ver un asistente en Cloud Calendars no demuestra que todos los ajustes de invitados de Google puedan cambiarse allí. Ten claro el servicio propietario y la identidad del destinatario al investigar un control ausente o una edición fallida."
      ]
    },
    {
      "heading": "Verifica el resultado guardado y comunica las responsabilidades",
      "body": [
        "Después de guardar, vuelve a abrir el evento original y comprueba los ajustes previstos. Cuando corresponda, pide a un compañero autorizado que confirme qué permite su propia cuenta. No intercambiéis contraseñas ni enviéis datos privados de invitados como atajo para comprobar el acceso.",
        "Separa asistencia y permisos. Poder editar, tener una copia importada y registrar una aceptación son hechos distintos. En Cloud Calendars, un recibo de uso compartido no es una confirmación de asistencia. Para una reunión importante, solicita la respuesta que necesitas y aclara quién es responsable de cambiar el horario."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifica la cuenta organizadora y el evento original.",
    "Decide quién gestiona la reunión, invita a otros y ve invitados.",
    "Inspecciona los permisos reales del evento de Google.",
    "Revisa los valores predeterminados sin asumir que cambian eventos existentes.",
    "Trata los roles de Cloud Calendars como un sistema de permisos separado.",
    "Reabre el evento guardado y confirma la asistencia por separado."
  ],
  "faq": [
    {
      "q": "¿Un invitado puede cambiar la hora de mi reunión?",
      "a": "Google permite conceder el permiso de modificación. Comprueba el evento real y el acceso del invitado; no lo deduzcas solo porque recibió una invitación."
    },
    {
      "q": "¿Todos los permisos se configuran únicamente en cada evento?",
      "a": "No. Google también documenta permisos predeterminados. Revísalos para futuras reuniones y comprueba directamente los eventos existentes importantes."
    },
    {
      "q": "¿Ocultar la lista elimina información ya enviada?",
      "a": "No demuestra que se hayan eliminado correos, descripciones, capturas o copias independientes anteriores. Revisa por separado lo que realmente se distribuyó."
    }
  ],
  "sourcesHeading": "Orientación del proveedor y lecturas adicionales",
  "sources": [
    {
      "label": "Google: colaboración en eventos y permisos predeterminados de invitados",
      "url": "https://support.google.com/a/users/answer/13293412?hl=en"
    },
    {
      "label": "Google: campos de permisos de invitados",
      "url": "https://developers.google.com/workspace/calendar/api/v3/reference/events"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "sharing-one-event-not-your-calendar",
    "keeping-track-of-who-replied"
  ],
  "updated": "2026-10-21"
},

  'google-calendars-that-never-reach-your-iphone': {
  "title": "Falta un calendario de Google en el iPhone: comprueba la conexión y la selección",
  "short": "Calendarios de Google que faltan en el iPhone",
  "description": "Localiza un calendario de Google ausente revisando el acceso, la visibilidad y la conexión utilizada por Apple Calendar o Cloud Calendars.",
  "lede": "Si aparece un calendario de Google y otro no, determina primero dónde está disponible el que falta. El acceso a la cuenta, la selección de calendarios y la disponibilidad de eventos son comprobaciones distintas. Esta guía la publica Arte Soft, desarrollador de Cloud Calendars.",
  "commonBelief": "Todo calendario de Google ausente tiene una misma causa oculta de sincronización y conectarse directamente garantiza que aparezca todo.",
  "sections": [
    {
      "heading": "Confirma que el calendario existe para esta cuenta",
      "body": [
        "Abre Google Calendar en la web con la misma cuenta que quieres usar en el teléfono. Busca el calendario, no solo un título de evento conocido. Dos cuentas pueden tener calendarios con nombres parecidos; una invitación enviada al correo de trabajo no acredita acceso para la cuenta personal.",
        "Si tampoco aparece allí, empieza por el propietario o la invitación de uso compartido. Si el acceso depende de un grupo, confirma la pertenencia y el grupo que recibió el permiso. No borres la cuenta del teléfono mientras siga sin resolverse la cuestión del acceso."
      ]
    },
    {
      "heading": "Distingue un calendario oculto de uno ausente",
      "body": [
        "Google documenta la selección de calendarios visibles mediante el menú de su aplicación. Un calendario listado pero desmarcado plantea un problema de visibilidad. Si no figura en la lista, investiga la identidad invitada, la aprobación o la conexión.",
        "Una invitación por correo para compartir un calendario y una dirección de suscripción son vías diferentes. Google explica por separado cómo añadir una suscripción desde el navegador de un ordenador y cómo abrir un calendario ya compartido por correo. Conserva la invitación original, pero no reenvíes enlaces privados a consultas públicas de soporte."
      ]
    },
    {
      "heading": "Identifica cómo recibe los datos esta aplicación del iPhone",
      "body": [
        "Apple Calendar puede conectarse mediante la cuenta de Google configurada en el dispositivo. Las instrucciones de Google incluyen activar Calendarios para esa cuenta. Sigue las indicaciones actuales del proveedor para tu versión de iOS; cambiar los ajustes de otra aplicación no equivale a cambiar esa cuenta del dispositivo.",
        "Cloud Calendars también ofrece inicio de sesión directo con Google. Identifica la cuenta y la vía que realmente utilizas antes de añadir otra conexión. Si el mismo calendario llega mediante el dispositivo y una conexión directa, compara sus identidades antes de concluir que se duplicó un evento en Google."
      ]
    },
    {
      "heading": "Revisa la selección de Cloud Calendars sin asumir cobertura completa",
      "body": [
        "En Cloud Calendars, revisa los calendarios asociados a la cuenta de Google prevista y selecciona los que quieras usar. Su sincronización con Google comprueba la selección. Iniciar sesión correctamente no demuestra que todos estén seleccionados ni que cada actualización solicitada haya terminado.",
        "Una conexión directa es otra vía para recibir datos de Google, no una promesa de que aparezcan todos los calendarios accesibles. Si uno está en la web de Google pero no en Cloud Calendars, anota cuenta, nombre y método de conexión para soporte. Sigue utilizando el proveedor original para planificar asuntos urgentes mientras se investiga la diferencia."
      ]
    },
    {
      "heading": "Distingue un calendario ausente de fechas ausentes",
      "body": [
        "Si el calendario figura pero falta una cita concreta, compara esa fecha exacta en Google Calendar. Comprueba que el elemento pertenezca al calendario seleccionado y que mires la misma ocurrencia de una reunión recurrente. Un título parecido en otro calendario no es el mismo registro de origen.",
        "No presupongas que una aplicación ha descargado todos los eventos históricos o de un futuro lejano. La sincronización de Google en Cloud Calendars solicita un intervalo de fechas limitado. Una búsqueda histórica vacía no prueba que Google haya borrado el evento; comprueba el proveedor original antes de modificar o recrear algo."
      ]
    },
    {
      "heading": "Pide ayuda con una comparación útil, no con un restablecimiento",
      "body": [
        "Anota aplicación, tipo de cuenta, nombre del calendario, fecha de ejemplo y dónde aparece el calendario. Incluye el mensaje de error si existe, eliminando información privada. Esto diferencia mejor los problemas de permisos, selección y sincronización que decir que toda la cuenta está rota.",
        "En planes urgentes, confirma el evento actual con el organizador. Evita empezar borrando cuentas, importando copias repetidas o moviendo eventos entre calendarios. Una vez entendido el problema de conexión, verifica el mismo ejemplo antes de cambiar más ajustes."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Compara la cuenta y el calendario previstos en Google Calendar web.",
    "Comprueba si el calendario falta o solo está desmarcado.",
    "Identifica sincronización del dispositivo, conexión directa o suscripción.",
    "Revisa los calendarios seleccionados para la cuenta prevista en Cloud Calendars.",
    "Compara una fecha exacta en el proveedor original.",
    "Comunica la diferencia sin compartir direcciones privadas ni restablecer cuentas."
  ],
  "faq": [
    {
      "q": "¿El acceso directo con Google mostrará todos los calendarios?",
      "a": "No asumas cobertura completa. Importan la cuenta, la lista, la selección y una sincronización correcta. Compara el calendario ausente con Google Calendar web."
    },
    {
      "q": "¿Debo borrar la cuenta y añadirla otra vez?",
      "a": "Comprueba primero identidad, acceso, visibilidad y conexión. Reconectar no aporta un permiso que el propietario no ha concedido."
    },
    {
      "q": "¿Que falte un evento antiguo significa que se borró?",
      "a": "No. Comprueba su calendario original de Google y la fecha. El intervalo disponible o la búsqueda de la aplicación pueden diferir del historial guardado por el proveedor."
    }
  ],
  "sourcesHeading": "Orientación del proveedor y lecturas adicionales",
  "sources": [
    {
      "label": "Google: añadir eventos de Google a Apple Calendar",
      "url": "https://support.google.com/calendar/answer/99358?hl=en&co=GENIE.Platform%3DiOS"
    },
    {
      "label": "Google: suscripciones y visibilidad de calendarios",
      "url": "https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DiOS"
    },
    {
      "label": "Google: comportamiento de la lista de calendarios",
      "url": "https://developers.google.com/workspace/calendar/api/v3/reference/calendarList/list"
    }
  ],
  "seeAlso": [
    "why-a-shared-calendar-does-not-appear",
    "icloud-google-and-outlook-in-one-view"
  ],
  "updated": "2026-10-21"
},

  'taking-back-a-calendar-you-shared': {
  "title": "Dejar de compartir un calendario: retira el acceso y revisa las demás vías",
  "short": "Revisa y retira los accesos compartidos",
  "description": "Deja de compartir un calendario revisando personas, grupos, acceso público y enlaces de suscripción. Descubre por qué pueden quedar copias guardadas.",
  "lede": "Para terminar una colaboración, primero identifica cómo se concedió el acceso. Quitar a una persona, desactivar la publicación y restablecer una dirección de suscripción son acciones distintas. Esta guía la publica Arte Soft, desarrollador de Cloud Calendars.",
  "commonBelief": "Quitar a un destinatario recupera al instante todas las copias del calendario y cierra cualquier otra vía de acceso.",
  "sections": [
    {
      "heading": "Identifica el calendario y la vía de acceso",
      "body": [
        "Antes de cambiar el acceso, confirma la cuenta propietaria, el calendario y el público previsto. Compartir un calendario de Google con una persona concreta no es lo mismo que publicarlo, conceder acceso a un grupo o facilitar una dirección de suscripción. Cloud Calendars también tiene sus propias relaciones de uso compartido de eventos y calendarios.",
        "Por ejemplo, la secretaría de un club puede recibir permisos de edición mediante una invitación personal, mientras los socios siguen un calendario publicado. Retirar ese permiso individual no determina qué debe pasar con las suscripciones de los socios. Enumera los mecanismos que realmente has configurado."
      ]
    },
    {
      "heading": "Retira el permiso de Google correspondiente",
      "body": [
        "Google documenta controles separados para personas o grupos concretos, el acceso de toda una organización y la disponibilidad pública. En un ordenador, abre los ajustes para compartir del calendario correspondiente y cambia la entrada o el ajuste general adecuado. Comprueba primero la cuenta iniciada y el nombre del calendario.",
        "Una persona puede conservar otra vía de acceso, como un grupo o una publicación más amplia. Revisa el conjunto en vez de eliminar repetidamente la misma dirección de correo. Las políticas de trabajo o del centro educativo pueden limitar los controles disponibles; utiliza el procedimiento aprobado por el propietario o administrador cuando sea necesario."
      ]
    },
    {
      "heading": "Trata la dirección secreta del calendario por separado",
      "body": [
        "Google indica que la dirección iCal secreta es para tu propio uso en otra aplicación de calendario y no debe facilitarse a otras personas. Si se ha divulgado, Google explica cómo restablecerla para invalidar la dirección anterior. Es una acción distinta de quitar a una persona concreta.",
        "Antes de cambiar una dirección de suscripción que utilizas, identifica los clientes o herramientas que dependen de ella para poder volver a conectar los que quieras conservar. No pegues la URL secreta en una consulta pública de soporte ni la envíes como prueba de haber encontrado el calendario correcto. Indica el nombre del calendario y el tipo de conexión."
      ]
    },
    {
      "heading": "Distingue los destinatarios de Cloud Calendars de los enlaces de suscripción",
      "body": [
        "En Cloud Calendars, el acceso de destinatarios a un evento o calendario y un canal de suscripción emitido son mecanismos distintos. Revisa la relación concreta de uso compartido y el enlace correspondiente antes de actuar. Quitar a un destinatario identificado no garantiza que se hayan retirado todas las URL distribuidas o las copias independientes.",
        "Si un coorganizador solo debe dejar de editar, considera su función prevista y el público restante en vez de borrar el calendario compartido. Si termina toda la colaboración, aclara quién es propietario del calendario y quién debe conservarlo. Abandonar un calendario recibido y borrar uno propio son decisiones distintas."
      ]
    },
    {
      "heading": "Verifica el resultado sin prometer una desaparición inmediata",
      "body": [
        "Comprueba que el sistema propietario ha guardado el cambio previsto. Si puede ayudarte un compañero autorizado, confirma el resultado de consulta o edición desde su propia cuenta, sin compartir contraseñas. Distingue una denegación de acceso de un evento antiguo que sigue visible en una copia importada o en caché.",
        "No prometas un plazo universal de actualización ni que no se enviará ninguna notificación. En un traspaso de grupo, comunica qué calendario debe utilizarse a partir de ahora. Un registro antiguo visible no demuestra por sí solo si la persona mantiene acceso activo, dispone de otro permiso o conserva una copia independiente."
      ]
    },
    {
      "heading": "Gestiona las copias anteriores como una tarea aparte",
      "body": [
        "Los archivos exportados, capturas de pantalla, mensajes y citas guardadas por separado pueden permanecer después de cambiar el acceso. Decide qué copias importan para el traspaso y habla con las personas implicadas sobre su tratamiento. Cambiar un permiso no permite saber qué ha guardado ya cada destinatario.",
        "Conserva los registros originales necesarios mientras revisas el resultado. No traslades reuniones sensibles a otro calendario compartido solo para que el antiguo parezca vacío ni canceles invitaciones reales para probar el acceso. Anota el calendario, la vía de acceso y el cambio realizado para facilitar futuras comprobaciones."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Identifica la cuenta propietaria, el calendario y la vía de acceso.",
    "Revisa por separado personas, grupos y publicaciones más amplias.",
    "Utiliza los controles adecuados de Google o Cloud Calendars.",
    "Decide por separado si debes restablecer una dirección secreta divulgada.",
    "Verifica el acceso guardado sin compartir credenciales.",
    "Planifica el tratamiento de exportaciones o copias anteriores aparte del acceso activo."
  ],
  "faq": [
    {
      "q": "¿Quitar a una persona desactiva un calendario público o su acceso mediante un grupo?",
      "a": "No lo des por hecho. Revisa cada vía real. Google documenta los destinatarios concretos, los grupos y la publicación más amplia como ajustes separados."
    },
    {
      "q": "¿El calendario desaparecerá inmediatamente y sin avisar?",
      "a": "No existe una promesa universal sobre la desaparición, las notificaciones o el tiempo de actualización. Confirma el cambio guardado y distingue el acceso activo de la información importada o en caché."
    },
    {
      "q": "¿Advanced permite comprar la posibilidad de retirar el acceso a un calendario de Google?",
      "a": "Advanced elimina los anuncios de Cloud Calendars. Los controles de Google dependen de la propiedad, los permisos y las normas de la organización, no de ese plan de la aplicación."
    }
  ],
  "sourcesHeading": "Orientación del proveedor sobre acceso y suscripciones",
  "sources": [
    {
      "label": "Google: controles para compartir y retirar el acceso",
      "url": "https://support.google.com/calendar/answer/37082?hl=en"
    },
    {
      "label": "Google: sincronización de cuentas y direcciones iCal secretas",
      "url": "https://support.google.com/calendar/answer/37648?hl=en"
    }
  ],
  "seeAlso": [
    "who-can-see-what-in-google-calendar",
    "the-secret-address-of-a-google-calendar"
  ],
  "updated": "2026-10-21"
},
};
