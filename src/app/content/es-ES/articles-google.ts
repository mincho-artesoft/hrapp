import { LocalisedArticle } from '../types';

/** Los seis artículos de Google: preguntas concretas, respuestas claras. */
export const GOOGLE_ES_ES: Readonly<Record<string, LocalisedArticle>> = {
  'who-can-see-what-in-google-calendar': {
    title: 'Quién ve qué cuando compartes un calendario de Google',
    short: 'Permisos de Google',
    description:
      'Los niveles de compartición de Google se ponen rápido y se entienden mal. Qué expone cada uno en realidad, dicho con claridad.',
    lede: 'Casi ningún exceso al compartir es un error de criterio. Es alguien eligiendo un permiso que sonaba modesto y no lo era.',
    commonBelief: 'Que «ver solo libre/ocupado» y «ver todos los detalles» se diferencian en poco.',
    sections: [
      {
        heading: 'Los niveles están más lejos de lo que suenan',
        body: [
          'Libre/ocupado muestra bloques de tiempo sin títulos. Todos los detalles muestra títulos, lugares, notas e invitados: en la mayoría de los calendarios, una parte considerable de tu vida.',
          'Hacer cambios permite editar. Gestionar la compartición permite entregar tu calendario a otras personas, y ese es el que sorprende más tarde.',
        ],
      },
      {
        heading: 'Elegir sin pensarlo cada vez',
        body: [
          'Para compañeros que solo necesitan encajar huecos contigo, libre/ocupado es casi siempre la respuesta correcta y casi nunca la elegida.',
          'Reserva los detalles completos para calendarios creados para compartirse, no para aquel en el que vives.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Coste mensual del nivel donde se gestiona esto en la app, en dólares',
    },
    faq: [
      {
        q: '¿Se ven los títulos de mis eventos si comparto solo libre/ocupado?',
        a: 'No. Libre/ocupado muestra bloques de tiempo sin títulos, lugares, notas ni invitados. Solo «ver todos los detalles» los expone, y los expone todos.',
      },
      {
        q: '¿Qué permite «hacer cambios y gestionar la compartición»?',
        a: 'Editar cualquier evento y entregar tu calendario a más personas sin preguntarte. Es el único nivel que deja a otro repartir el acceso.',
      },
      {
        q: '¿Puedo ver quién tiene ya acceso a mi calendario?',
        a: 'Sí, en los ajustes de compartición de ese calendario. Nada te invita a mirar y lo compartido solo se acumula: revisa la lista dos veces al año.',
      },
    ],
    practical: [
      'Por defecto, libre/ocupado para quien solo necesita reservar tiempo contigo.',
      'Reserva «hacer cambios» para quien de verdad planifica por ti.',
      'Revisa quién tiene acceso dos veces al año: lo compartido se acumula y nadie te avisa.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'what-guests-can-do-to-your-event'],
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
    title: 'Recuperar un calendario que compartiste',
    short: 'Retirar el acceso',
    description:
      'Quitar a alguien de un calendario detiene lo que viene después. Lo que no hace es deshacer lo que ya ocurrió.',
    lede: 'Terminar un acceso es un toque. Decidir si un toque basta lleva algo más, porque compartir deja copias.',
    commonBelief: 'Que quitar a una persona quita lo que ha visto.',
    sections: [
      {
        heading: 'Qué se detiene y qué se queda',
        body: [
          'Quita a alguien y el calendario desaparece de su lista, al instante y sin mensaje. Los eventos futuros no le llegan nunca.',
          'Lo que no vuelve: las invitaciones que ya tiene, los eventos copiados a su propio calendario, lo exportado y todo aquello para lo que circuló una dirección secreta. El acceso termina; la memoria no.',
        ],
      },
      {
        heading: 'El que sobrevive a la retirada',
        body: [
          'Si alguien tuvo alguna vez permiso para gestionar la compartición, puede haber añadido a otras personas. Quitarlo a él las deja a ellas, y así acaba un calendario compartido con alguien a quien nadie recuerda haber invitado.',
          'Lee la lista entera en vez de borrar un nombre, y hazlo a la salida, no meses después. Nada te lo recuerda y lo compartido solo se acumula.',
        ],
      },
    ],
    claims: {
      advancedMonthly: 'Coste mensual del nivel donde se gestiona esto, en dólares',
    },
    faq: [
      {
        q: '¿Quitar a alguien borra lo que ya vio?',
        a: 'No. Las invitaciones que ya tiene, los eventos copiados a su propio calendario y todo lo exportado sobreviven. El acceso termina; las copias no.',
      },
      {
        q: '¿Se le avisa a la persona de que le he quitado el acceso?',
        a: 'No. El calendario desaparece de su lista al instante y sin mensaje.',
      },
      {
        q: '¿Por qué mi calendario sigue compartido con alguien a quien nunca invité?',
        a: 'Alguien con permiso para gestionar la compartición lo añadió. Quitar a esa persona deja en su sitio a todas las que añadió: por eso se lee la lista entera y no un nombre.',
      },
    ],
    practical: [
      'Lee la lista completa de acceso, no solo el nombre que ibas a quitar.',
      'Restablece la dirección secreta si esa persona la tuvo alguna vez.',
      'Da por hecho que las copias sobreviven: mueve lo verdaderamente sensible en vez de esconderlo.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
