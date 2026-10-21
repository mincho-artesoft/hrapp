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
    title: 'Qué revela de verdad la dirección secreta de un calendario de Google',
    short: 'La dirección iCal secreta',
    description:
      'Google ofrece una dirección privada que enseña tu calendario entero a quien la tenga. Qué expone y por qué no se retira sin ruido.',
    lede: 'En los ajustes de cada calendario de Google hay un enlace que muestra todo lo que contiene. Sin iniciar sesión, sin permiso y sin registro de quién lo abrió.',
    commonBelief: 'Que una dirección privada es privada porque es difícil de encontrar.',
    sections: [
      {
        heading: 'Un enlace es una contraseña que no puedes cambiar para una sola persona',
        body: [
          'La dirección secreta lleva detalles completos: títulos, horas, lugares, notas. Quien tenga el enlace los ve, y no hay lista de quién es.',
          'Su única protección es la parte aleatoria de la dirección. Eso protege de verdad contra adivinar, y nada contra un reenvío, una pantalla compartida o un documento que sobrevive al puesto de trabajo.',
        ],
      },
      {
        heading: 'Restablecerla la rompe para todos',
        body: [
          'Puedes restablecer la dirección, y la antigua muere. También muere para cada compañero, cada panel y cada script que dependía de ella en silencio, sin aviso alguno.',
          'Ese es el argumento para no repartir nunca la dirección del calendario en el que vives. Publica un calendario hecho para eso y restablecer no te cuesta nada.',
        ],
      },
    ],
    claims: {
      linkLength: 'Caracteres aleatorios que protegen un enlace nuestro',
      sharePrice: 'Lo que cuesta compartir un evento desde la app',
    },
    faq: [
      {
        q: '¿Qué puede hacer alguien con la dirección secreta de mi calendario?',
        a: 'Ver todo lo que hay en él —títulos, horas, lugares y notas— sin iniciar sesión, sin permiso y sin dejar rastro de que ha mirado.',
      },
      {
        q: '¿Puedo recuperar una dirección secreta de calendario?',
        a: 'Solo restableciéndola, lo que mata la anterior para todos a la vez: compañeros, paneles y cualquier script que se apoyaba en ella en silencio, sin aviso.',
      },
      {
        q: '¿Puedo enviar la dirección secreta por correo a un compañero?',
        a: 'Trátala como pública desde que sale de tus manos. Su única protección es ser difícil de adivinar, y un reenvío anula exactamente eso.',
      },
    ],
    practical: [
      'Trata la dirección secreta como pública en cuanto sale de tus manos.',
      'No publiques nunca la dirección del calendario que usas de verdad.',
      'Restablécela cuando alguien se va, y avisa a quienes se les romperá.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'taking-back-a-calendar-you-shared'],
  },

  'what-guests-can-do-to-your-event': {
    title: 'Qué pueden hacerle tus invitados a un evento',
    short: 'Permisos de los invitados',
    description:
      'Tres casillas deciden si un invitado puede mover tu reunión, invitar a desconocidos o leer la lista entera. Están activas más veces de las que crees.',
    lede: 'Invitar a alguien le da más que un sitio y una hora. En un evento normal de Google, un invitado suele ver a quién más has llamado y a menudo puede añadir gente.',
    commonBelief: 'Que un invitado solo puede aceptar o rechazar.',
    sections: [
      {
        heading: 'Las tres casillas',
        body: [
          'Modificar el evento deja que un invitado cambie la hora, el lugar y el título para todos. Casi nunca se quiere y es fácil dejarla activada.',
          'Invitar a otros le permite añadir a personas que no conoces. Ver la lista de invitados enseña a todos los llamados y su respuesta: correcto en un equipo, incómodo con un cliente, equivocado en cualquier cosa parecida a un grupo de clientes distintos.',
        ],
      },
      {
        heading: 'Dónde se tuerce en silencio',
        body: [
          'Un evento, muchos destinatarios individuales, lista visible: ahora todos tienen a todos. Quitar esa casilla es la diferencia entre una reunión y una agenda de contactos filtrada.',
          'Los ajustes viven en el evento, no en la cuenta, así que vuelven a tus valores por defecto cada vez y hay que pensarlos en los eventos que importan, no una sola vez.',
        ],
      },
    ],
    claims: {
      sharePrice: 'Lo que cuesta enviar un solo evento desde la app',
    },
    faq: [
      {
        q: '¿Los invitados se ven entre sí en una invitación de Google Calendar?',
        a: 'Por defecto, casi siempre sí. «Ver la lista de invitados» muestra a todos los llamados y sus respuestas: bien en un equipo, incómodo con un cliente y equivocado cuando los invitados son clientes distintos.',
      },
      {
        q: '¿Puede un invitado cambiar la hora de mi reunión?',
        a: 'Si «modificar el evento» está marcado, sí, y el cambio vale para todos. Rara vez se quiere y es fácil dejarlo activo.',
      },
      {
        q: '¿Cómo evito que los invitados inviten a otros?',
        a: 'Desmarca «invitar a otros» en el propio evento. Estos ajustes pertenecen al evento y no a la cuenta, así que vuelven a tus valores por defecto cada vez.',
      },
    ],
    practical: [
      'Desactiva «ver la lista de invitados» en todo lo que va a gente que no se conoce entre sí.',
      'Deja «modificar el evento» apagado salvo que alguien planifique realmente por ti.',
      'Mira las casillas en el evento, no en tus ajustes: ahí es donde viven.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'why-a-shared-calendar-does-not-appear'],
  },

  'google-calendars-that-never-reach-your-iphone': {
    title: 'Por qué algunos calendarios de Google nunca llegan a tu iPhone',
    short: 'Calendarios de Google que faltan en el iPhone',
    description:
      'Una cuenta de Google, varios calendarios y solo uno en el teléfono. La lista de sincronización que lo decide y qué hacer en su lugar.',
    lede: 'Tu cuenta de Google guarda ocho calendarios. Tu iPhone enseña dos. No hay nada roto: algo que nunca has visto eligió por ti.',
    commonBelief: 'Que añadir una cuenta de Google al iPhone añade los calendarios que contiene.',
    sections: [
      {
        heading: 'Una lista que nadie te ha enseñado',
        body: [
          'Google mantiene, por dispositivo, una lista de qué calendarios pueden sincronizarse, y los secundarios —los compartidos, los suscritos, los que alguien creó para un proyecto— quedan fuera con frecuencia.',
          'Esa lista no está en los ajustes de iOS. Vive en una página propia de Google, y por eso mirar en el sitio evidente no encuentra nada mal y no cambia nada.',
        ],
      },
      {
        heading: 'El otro camino',
        body: [
          'Una app que habla directamente con Google no usa esa lista, así que enseña todos los calendarios que la cuenta tiene de verdad, incluidos los que el teléfono dejó caer sin decirlo.',
          'Eso además junta las cuentas. Una vista con lo personal, lo del trabajo y lo compartido es el objetivo; si el teléfono habría sincronizado cada uno deja de ser una pregunta.',
        ],
      },
    ],
    claims: {
      accounts: 'Tipos de cuenta que una sola vista reúne',
      price: 'Lo que cuesta la parte de Google',
    },
    faq: [
      {
        q: '¿Por qué solo aparecen algunos de mis calendarios de Google en el iPhone?',
        a: 'Google guarda, por dispositivo, una lista de qué calendarios pueden sincronizarse, y los secundarios —compartidos, suscritos, creados para un proyecto— quedan fuera con frecuencia.',
      },
      {
        q: '¿Dónde está el ajuste de sincronización de Google Calendar para iPhone?',
        a: 'No está en los ajustes de iOS. Vive en una página propia de Google, y por eso buscar en el sitio evidente no encuentra nada ni cambia nada.',
      },
      {
        q: '¿Cómo veo todos mis calendarios de Google en el iPhone?',
        a: 'A través de una app que consulta a Google directamente en vez de por la lista del dispositivo. Enseña todos los calendarios que la cuenta tiene, incluidos los que el teléfono dejó fuera.',
      },
    ],
    practical: [
      'Mira la lista de sincronización de Google antes de dar la cuenta por rota.',
      'Da por hecho que los calendarios suscritos y compartidos quedan excluidos.',
      'Si guardas más de un par de calendarios, léelos con algo que consulte a Google directamente.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'icloud-google-and-outlook-in-one-view'],
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
