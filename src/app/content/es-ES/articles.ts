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
  'weather-inside-your-calendar': {
  "title": "Un calendario que ya lleva el tiempo dentro",
  "short": "El tiempo dentro del calendario",
  "description": "Por qué consultar dos aplicaciones para planificar un día es un fallo de diseño, y cómo es un calendario en el que la previsión forma parte de la vista en lugar de estar al lado.",
  "lede": "Casi todo el mundo planifica el día entre dos aplicaciones. El calendario dice dónde hay que estar; la del tiempo dice cómo estará cuando lleguemos. Sostener las dos cosas en la cabeza es la parte que nadie nota que hace, hasta que un sábado se estropea.",
  "commonBelief": "Que un calendario es para compromisos y una aplicación del tiempo es para el tiempo, y que mantenerlos separados es sencillamente cómo funcionan los teléfonos.",
  "sections": [
    {
      "heading": "El coste de dos aplicaciones no son dos toques",
      "body": [
        "Cambiar de aplicación no cuesta nada. Lo caro es que las dos no se ponen de acuerdo sobre qué importa. Su calendario sabe que el sábado hay dos horas bloqueadas a las once; la del tiempo sabe que lloverá de diez a una. Ninguna de las dos sabe que esos dos hechos, juntos, significan que hay que mover el bloque.",
        "Usted es la capa de integración. Eso funciona hasta que está ocupado, que es justo cuando merece la pena proteger los planes."
      ]
    },
    {
      "heading": "La previsión disponible",
      "body": [
        "Cloud Calendars utiliza la previsión disponible para el lugar seleccionado. Los datos por horas y por días pueden abarcar períodos distintos.",
        "Las fechas que puedes consultar en el calendario no determinan el alcance de la previsión. La vista mensual no implica una previsión para todo el mes ni para cada evento."
      ]
    }
  ],
  "claims": {
    "price": "Lo que cuestan las funciones del tiempo"
  },
  "practical": [
    "Comprueba el lugar, la fecha y las horas disponibles antes de usar la previsión para planificar."
  ],
  "seeAlso": [
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather"
  ],
  "updated": "2026-10-21"
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
  "title": "Planificar actividades al aire libre sin acabar bajo la lluvia",
  "short": "Planificar al aire libre",
  "description": "Un método práctico para organizar actividades al aire libre con el calendario que ya utilizas, sin crear otra rutina para consultar el tiempo.",
  "lede": "Si tus aficiones son al aire libre, seguramente tienes tu propio ritual: mirar el tiempo, repasar la semana e intentar adivinar. Esa última parte se puede sustituir por una comparación consciente. Esta guía la publica Arte Soft, desarrollador de Cloud Calendars.",
  "commonBelief": "Evitar el mal tiempo consiste en consultar la previsión más a menudo.",
  "sections": [
    {
      "heading": "Empieza por el lugar y la decisión",
      "body": [
        "Elige el lugar de la previsión que corresponda a la actividad y comprueba si están disponibles la fecha y las horas relevantes. Decide qué necesitas saber: si conviene cambiar de horario, conservar una alternativa o aplazar la decisión.",
        "Volver a consultar no cambia el tiempo, pero la información actualizada puede importar. No existe una frecuencia de consulta adecuada para todos los planes al aire libre."
      ]
    },
    {
      "heading": "Compara horarios disponibles sin prometer el resultado",
      "body": [
        "Compara la información horaria relevante de cada periodo posible. Un icono diario es un resumen, no una garantía de las condiciones durante todo el día.",
        "Mover una actividad una hora puede ayudar o no. No deduzcas un intervalo seco que la previsión no muestra ni apliques un umbral porcentual universal a cualquier actividad."
      ]
    },
    {
      "heading": "Prepara una alternativa antes de cambiar invitaciones",
      "body": [
        "Si la actividad depende de condiciones adecuadas, conserva una alternativa realista y decide cuándo revisarás la información más reciente. Consulta las indicaciones oficiales locales cuando corresponda.",
        "Para una cita compartida, confirma quién la organiza y los permisos de edición antes de moverla. Una previsión aparentemente mejor no autoriza por sí sola a cambiar la agenda de todos."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Confirma el lugar de la previsión y las fechas y horas disponibles.",
    "Compara horarios posibles con los factores meteorológicos relevantes para tu actividad.",
    "Conserva un plan alternativo y vuelve a consultar antes de que la decisión importe.",
    "Consulta indicaciones oficiales locales si las condiciones pueden hacer insegura la actividad."
  ],
  "seeAlso": [
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather"
  ],
  "updated": "2026-10-21",
  "faq": [
    {
      "q": "¿Mover el evento garantiza que no llueva?",
      "a": "No. Compara los periodos de previsión disponibles y conserva una alternativa realista."
    },
    {
      "q": "¿Basta con mirar el icono diario?",
      "a": "Para una actividad a una hora concreta, revisa las horas disponibles durante toda su duración y confirma el lugar."
    },
    {
      "q": "¿Puedo mover un evento compartido solo porque otro horario parece mejor?",
      "a": "Confirma las responsabilidades de quien organiza, los permisos de edición y los participantes antes de cambiar su agenda."
    }
  ],
  "sources": [
    {
      "label": "Apple: datos de previsión de WeatherKit y disponibilidad regional",
      "url": "https://developer.apple.com/weatherkit/"
    }
  ]
},

  'a-fourteen-day-view-of-the-weather': {
  "title": "La previsión disponible",
  "short": "La previsión disponible",
  "description": "Cloud Calendars utiliza la previsión disponible para el lugar seleccionado. Los datos por horas y por días pueden abarcar períodos distintos.",
  "lede": "Las fechas que puedes consultar en el calendario no determinan el alcance de la previsión. La vista mensual no implica una previsión para todo el mes ni para cada evento.",
  "sections": [
    {
      "heading": "La previsión disponible",
      "body": [
        "Cloud Calendars utiliza la previsión disponible para el lugar seleccionado. Los datos por horas y por días pueden abarcar períodos distintos.",
        "Las fechas que puedes consultar en el calendario no determinan el alcance de la previsión. La vista mensual no implica una previsión para todo el mes ni para cada evento."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Comprueba el lugar, la fecha y las horas disponibles antes de usar la previsión para planificar."
  ],
  "seeAlso": [
    "weather-inside-your-calendar",
    "planning-outdoors-without-being-rained-on"
  ],
  "updated": "2026-10-21",
  "sources": [
    {
      "label": "Apple WeatherKit",
      "url": "https://developer.apple.com/weatherkit/"
    }
  ]
},

  'icloud-google-and-outlook-in-one-view': {
    title: 'iCloud, Google y Outlook en una sola vista',
    short: 'Tres cuentas, una vista',
    description:
      'La vida de casi todo el mundo está repartida entre un calendario personal de Apple, una cuenta de Google y uno de Exchange del trabajo. Qué cambia al ponerlos en una misma cuadrícula.',
    lede: 'El problema rara vez es que alguno de los calendarios sea malo. Es que tiene tres y solo una semana.',
    commonBelief:
      'Que mantener el trabajo y lo personal en aplicaciones separadas es un límite y no un defecto.',
    sections: [
      {
        heading: 'La doble reserva es estructural',
        body: [
          'Si sus compromisos viven en tres sitios, ningún sitio puede decirle si está libre. Usted es el paso de fusión, y lo ejecuta de memoria, normalmente mientras alguien espera una respuesta.',
          'Por eso el fallo clásico no es olvidar un evento; es aceptar algo que choca con un evento que no podía ver.',
        ],
      },
      {
        heading: 'Qué da una sola cuadrícula',
        body: [
          'Todas las cuentas en la misma semana, con color según su origen, editables ahí mismo. Deja de preguntarse qué aplicación tiene la respuesta, porque la pregunta deja de estar en plural.',
          'La separación que la gente quiere en realidad es visual, no estructural. Ver el trabajo de un color y la familia de otro da el límite sin renunciar a la vista de conjunto.',
        ],
      },
      {
        heading: 'Dónde caen los planes',
        body: [
          'iCloud y Google se sincronizan en el plan gratuito. Las cuentas de Microsoft — Outlook y Exchange — están en el de pago, porque esa conexión tiene un coste recurrente que las otras no tienen.',
          'Si su calendario de trabajo es de Google, no necesitará pagar nunca por sincronizar.',
        ],
      },
    ],
    claims: {
      accounts: 'Tipos de cuenta que pueden compartir una vista',
      premiumMonthly: 'Coste mensual de añadir Microsoft, en dólares',
    },
    practical: [
      'Añada primero la cuenta personal y después la que provoca las colisiones.',
      'Coloree por cuenta y no por categoría: el origen es lo que necesita de un vistazo.',
      'Siga escribiendo en el calendario que las otras personas ya leen.',
    ],
    seeAlso: ['three-calendar-apps-is-two-too-many', 'free-google-sync-without-adverts'],
  },

  'three-calendar-apps-is-two-too-many': {
    title: 'Tres aplicaciones de calendario son dos de más',
    short: 'Tres aplicaciones son dos de más',
    description:
      'Cambiar de aplicación de calendario no es un flujo de trabajo, es un impuesto. Lo que cuesta y cómo se ve sustituirlo.',
    lede: 'Nadie eligió tener tres aplicaciones de calendario. Ocurrió una cuenta cada vez, y cada añadido parecía razonable.',
    commonBelief:
      'Que cambiar de aplicación es una molestia menor y no el origen del problema real.',
    sections: [
      {
        heading: 'El coste no son los toques',
        body: [
          'Dos segundos cambiando no son nada. Lo caro es que responde a preguntas de agenda con información parcial, porque comprobar las tres cada vez cuesta más de lo que la pregunta parece merecer.',
          'Así que responde desde la que tiene abierta y corrige después. La corrección es la parte cara, y además aterriza en el calendario de otra persona.',
        ],
      },
      {
        heading: 'Qué tiene que ser cierto',
        body: [
          'Un sitio tiene que poder decir sí o no sobre su tiempo. Ese es todo el requisito, y no lo cumple ningún arreglo en el que la respuesta viva en más de una aplicación.',
          'Todo lo demás — qué aplicación, qué colores, qué vistas — es preferencia. Esto es estructura.',
        ],
      },
    ],
    claims: {
      accounts: 'Tipos de cuenta que cabe en una vista',
    },
    practical: [
      'Elija la aplicación que sostiene todas sus cuentas, no la que más le gusta por separado.',
      'Migre añadiendo cuentas, no moviendo eventos: los eventos se quedan donde están.',
      'Borre las otras aplicaciones cuando la vista esté completa, o seguirá consultándolas.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view'],
  },

  'the-widget-that-shows-what-is-next': {
  "updated": "2026-10-21",
  "title": "Próximos eventos en la pantalla de inicio del iPhone",
  "short": "Próximos eventos en el widget",
  "description": "Elige un widget con eventos, comprueba los calendarios seleccionados y diagnostica ausencias. Una lista vacía no demuestra que tu agenda esté libre.",
  "lede": "Para consultar la próxima cita, elige un widget que incluya eventos. Una tarjeta con fecha y tiempo responde a otra pregunta. Esta guía la publica Arte Soft, desarrollador de Cloud Calendars.",
  "sections": [
    {
      "heading": "Elige primero el diseño con eventos",
      "body": [
        "«Calendar Events» es el diseño mediano con lista de eventos. «Calendar Events Large» ofrece más espacio. «Calendar & Weather» es un diseño independiente de fecha y tiempo; su tamaño pequeño no incluye automáticamente la próxima cita. Los nombres pueden aparecer traducidos.",
        "Mantén pulsada una zona vacía de la pantalla de inicio y abre la galería de widgets desde las opciones de edición. Busca Cloud Calendars y revisa la vista previa antes de añadirlo. Esta galería del iPhone es distinta de las vistas del calendario dentro de la app."
      ]
    },
    {
      "heading": "Qué se considera próximo",
      "body": [
        "La lista utiliza los calendarios seleccionados y los eventos con hora de inicio futura. Excluye los eventos de todo el día y los que ya han empezado. Por eso un cumpleaños o una reunión en curso pueden aparecer en la app y no en el widget.",
        "Si hoy solo tienes un viaje marcado como evento de todo el día, una lista vacía no significa que se haya perdido. Abre el día completo y lee la fecha de cada próxima cita: podría corresponder a mañana o más adelante."
      ]
    },
    {
      "heading": "Compara primero con la app",
      "body": [
        "Localiza un evento futuro concreto en Cloud Calendars. Comprueba a qué calendario pertenece, que esté seleccionado y que la app tenga acceso al calendario. Compara título, fecha y hora. Si también falta en la app, investiga primero la cuenta o la sincronización.",
        "Para una comprobación sencilla, crea una cita de prueba sin invitados en un calendario propio, con un título reconocible y un inicio futuro. No modifiques una invitación real ni elimines cuentas para probar el widget."
      ]
    },
    {
      "heading": "No presupongas una actualización inmediata",
      "body": [
        "Los widgets muestran información guardada y no funcionan continuamente como una app abierta. iOS decide cuándo actualizarlos. Abrir la app y comprobar el evento proporciona una referencia, pero no establece un plazo exacto para que cambie el widget.",
        "Si la app sigue correcta y el widget no, anota el diseño, el calendario, la hora del evento y las versiones de la app y de iOS. Distingue entre una lista vacía, una cita antigua y una hora equivocada."
      ]
    },
    {
      "heading": "Comprueba el tiempo por separado",
      "body": [
        "El tiempo junto a la fecha no es una previsión para el lugar y la hora de cada evento. Antes de una actividad al aire libre, consulta el lugar y la franja horaria adecuados en la vista del tiempo.",
        "Usa el widget para orientarte y el calendario completo para eventos de todo el día, detalles y decisiones que requieren ver toda la agenda."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Elige un diseño con lista de eventos.",
    "Comprueba una cita futura en un calendario seleccionado.",
    "Compara fecha y hora con la app.",
    "Documenta las diferencias persistentes sin borrar datos."
  ],
  "faq": [
    {
      "q": "¿Por qué falta mi cumpleaños?",
      "a": "La lista de próximos eventos excluye los de todo el día. Comprueba el calendario completo."
    },
    {
      "q": "¿El widget pequeño muestra la siguiente reunión?",
      "a": "El diseño pequeño «Calendar & Weather» muestra fecha y tiempo. Para citas, elige una lista de eventos."
    },
    {
      "q": "¿Una lista vacía significa que hoy estoy libre?",
      "a": "No. Puede omitir eventos de todo el día, reuniones en curso, calendarios no seleccionados o información pendiente de actualizar."
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
    title: 'Compartir un evento sin entregar el calendario',
    short: 'Compartir un evento',
    description:
      'Cómo funciona enviar un solo evento, qué recibe realmente la otra persona y por qué no necesita instalar nada para verlo.',
    lede: 'Compartir un calendario suele ser todo o nada: o alguien tiene acceso al suyo o no lo tiene. Enviar una cena no debería exigir ninguna de las dos cosas.',
    commonBelief:
      'Que compartir un evento significa dar a alguien una ventana al resto de su semana.',
    sections: [
      {
        heading: 'Qué se envía en realidad',
        body: [
          'Al crear un evento se le ofrece compartirlo. Lo que viaja es un enlace — por correo, por mensaje, por lo que tenga instalado — y detrás de ese enlace hay un canal de calendario que contiene ese evento y nada más.',
          'No es una captura ni una copia que se queda vieja. Si la hora cambia, el canal cambia con ella, y la persona a la que se lo mandó ve el cambio sin que usted vuelva a enviar nada.',
        ],
      },
      {
        heading: 'No necesita esta aplicación',
        body: [
          'El enlace es una suscripción de calendario corriente. Lo lee el Calendario de Apple, lo lee Google Calendar, lo lee Outlook. Alguien con Android y una cuenta de Gmail puede suscribirse y ver su evento; nada de eso exige un iPhone.',
          'En el mensaje va además un App Clip para quien sí quiera la aplicación: se abre sin instalar nada y muestra el evento al momento. Eso es una puerta, no un peaje, y la distinción importa cuando invita a alguien a quien no puede pedir que instale software.',
        ],
      },
      {
        heading: 'Lo que no es',
        body: [
          'No es instantáneo. El canal pide a las aplicaciones que vuelvan a mirar cada hora, y eso es una petición y no una regla: cada programa se actualiza a su ritmo, y algunos son más perezosos. Para una cena de la semana que viene eso es invisible. Para un cambio veinte minutos antes, mande también un mensaje.',
          'Tampoco es secreto. El enlace lleva veintidós caracteres al azar, que nadie va a adivinar, pero cualquiera que lo tenga puede leer el canal. Trátelo como un enlace a un documento: se envía sin problema, y conviene revocarlo cuando ya ha hecho su trabajo.',
          'Y por ahora es solo de lectura. Quien lo recibe ve el evento. No puede editarlo ni escribir en su calendario.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Horas entre las peticiones de actualización del canal',
      linkLength: 'Caracteres al azar del enlace, que es lo que lo hace inadivinable',
      sharePrice: 'Lo que cuesta compartir',
    },
    practical: [
      'Comparta desde el propio evento, justo después de crearlo: ahí aparece la oferta.',
      'Mande el enlace por donde ya se comunica con esa persona; el formato da igual.',
      'Si cambia la hora con poco margen, escríbale además de mover el evento.',
      'Revoque el enlace cuando el evento haya pasado, igual que dejaría de compartir un documento.',
    ],
    seeAlso: ['icloud-google-and-outlook-in-one-view'],
  },

  'free-google-sync-without-adverts': {
    title: 'Sincronización gratuita con Google, y qué paga la publicidad',
    short: 'Gratis, y la publicidad',
    description:
      'Qué incluye de verdad el plan gratuito, dónde aparece la publicidad y cuánto cuesta quitarla. Dicho claro, porque casi ninguna aplicación lo hace.',
    lede: 'Las aplicaciones de calendario gratuitas suelen serlo porque se está vendiendo otra cosa. Conviene saber cuál antes de confiarle la semana.',
    commonBelief:
      'Que un plan gratuito es una prueba y que la aplicación de verdad está detrás del muro de pago.',
    sections: [
      {
        heading: 'Qué cubre el plan gratuito',
        body: [
          'Todas las vistas, sincronización con iCloud, sincronización con Google, todo el tiempo dentro del calendario, widgets, enlaces de Meet en los eventos y edición arrastrando. No una prueba de esas cosas: esas cosas.',
          'Si sus calendarios son de Apple y de Google, que es el caso de la mayoría, el plan gratuito es la aplicación.',
        ],
      },
      {
        heading: 'Qué hace la publicidad y qué cuesta quitarla',
        body: [
          'El plan gratuito lleva publicidad. Quitarla es el plan de pago más barato, y quitar la publicidad es honestamente casi todo lo que ese plan hace.',
          'Decirlo así parece mejor que el arreglo habitual, en el que el plan sin anuncios se empaqueta con funciones que nadie pidió para que el precio parezca comprar más.',
        ],
      },
    ],
    claims: {
      price: 'Coste del plan gratuito',
      advancedMonthly: 'Coste mensual de quitar la publicidad, en dólares',
    },
    practical: [
      'Empiece gratis: la sincronización que necesita probablemente ya está ahí.',
      'Pague por quitar la publicidad, no porque espere que la aplicación cambie.',
      'El plan superior solo tiene sentido si su calendario de trabajo es de Microsoft.',
    ],
    seeAlso: ['what-a-subscription-actually-buys', 'icloud-google-and-outlook-in-one-view'],
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
