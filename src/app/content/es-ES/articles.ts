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
  "title": "La previsión junto a cada evento, no solo junto al día",
  "short": "Previsión en cada evento",
  "description": "Un resumen diario promedia justo las horas que importan. Qué significa el tiempo por evento y por qué la diferencia cuenta al aire libre.",
  "lede": "La mayoría de los calendarios que mencionan el tiempo muestran un icono por día. Ese icono es un promedio, y el promedio de una mañana lluviosa y una tarde seca es una llovizna que no ocurre nunca.",
  "commonBelief": "Que un icono diario en el calendario es lo mismo que una previsión unida a un evento.",
  "sections": [
    {
      "heading": "Lo que esconde un icono diario",
      "body": [
        "Tome un día que llueve con fuerza hasta las once y luego despeja. El resumen elige algo intermedio y muestra una nube. Usted mira su cita de las dos, ve la nube y mueve un paseo que no hacía falta mover.",
        "El error va en las dos direcciones. Un día que está bien salvo por una hora violenta a las seis aparece como bueno, y el único evento que importaba es el que se moja."
      ]
    },
    {
      "heading": "Unir la previsión a las horas",
      "body": [
        "Un evento ocupa horas concretas. La previsión de esas horas es una cifra distinta de la de su día, y es la única que responde a lo que usted está preguntando de verdad.",
        "Abra un evento y las condiciones que aparecen son las de su ventana. Un bloque de tres horas recibe las tres horas, no las veinticuatro."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Consulte el evento, no el día, siempre que el plan dependa del tiempo.",
    "Para algo de más de un par de horas, mire cómo se mueven las condiciones a lo largo del bloque.",
    "Mueva antes de cancelar: una hora arriba o abajo suele ser toda la diferencia."
  ],
  "seeAlso": [
    "weather-inside-your-calendar",
    "planning-outdoors-without-being-rained-on"
  ],
  "updated": "2026-10-21"
},

  'planning-outdoors-without-being-rained-on': {
  "title": "Planificar al aire libre sin acabar empapado",
  "short": "Planificar al aire libre",
  "description": "Un método práctico para programar cualquier cosa que ocurra fuera, usando el calendario que ya lleva en lugar de una rutina meteorológica aparte.",
  "lede": "Si sus aficiones ocurren al aire libre, probablemente ha construido un ritual privado: mirar el tiempo, entornar los ojos ante la semana, adivinar. La parte de adivinar puede desaparecer.",
  "commonBelief": "Que evitar el mal tiempo consiste en consultar la previsión más a menudo.",
  "sections": [
    {
      "heading": "Mirar más no es la respuesta",
      "body": [
        "Abrir la aplicación del tiempo cinco veces no mejora la previsión; mejora la ansiedad. Lo que cambia el resultado es mirarla en el momento en que se elige una hora, y ese es un momento completamente distinto.",
        "Ese momento ocurre en el calendario. Si el tiempo no está ahí, la decisión se toma sin él y se corrige después."
      ]
    },
    {
      "heading": "Elegir el hueco contra la semana",
      "body": [
        "Mire la semana con las condiciones detrás y la elección suele hacerse sola. Dos tardes posibles, una seca: no hay nada que deliberar.",
        "El hábito que merece la pena es pequeño: antes de colocar algo al aire libre, mire la banda, no otra aplicación."
      ]
    },
    {
      "heading": "Después, las horas y no el día",
      "body": [
        "Una vez que el evento existe, la previsión que importa es la suya. Un día puede ser lluvioso y sus dos horas secas, y el resumen diario no se lo dirá nunca.",
        "Mueva antes de cancelar. Una hora en cualquier dirección rescata más planes que cualquier cantidad de comprobaciones."
      ]
    }
  ],
  "claims": {},
  "practical": [
    "Coloque los eventos al aire libre desde la vista de semana, con las condiciones a la vista.",
    "Dos días antes, consulte las horas del evento y no su día.",
    "Desplace una hora antes de abandonar el plan.",
    "Para algo a más de una semana, elija el día y acepte que lo afinará luego."
  ],
  "seeAlso": [
    "forecast-beside-every-event",
    "a-fourteen-day-view-of-the-weather"
  ],
  "updated": "2026-10-21"
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
    title: 'Un widget que responde a una sola pregunta',
    short: 'El widget de lo siguiente',
    description:
      'Casi todos los widgets de calendario intentan ser un calendario pequeño. Los útiles responden a la única pregunta que usted hace veinte veces al día.',
    lede: 'Nadie desbloquea el teléfono para navegar por su calendario. Lo desbloquea para saber qué viene ahora y cuánto tiempo queda.',
    commonBelief: 'Que un buen widget de calendario es una vista de mes en miniatura.',
    sections: [
      {
        heading: 'Las pantallas pequeñas castigan la densidad',
        body: [
          'Un mes apretado en un widget es ilegible de un vistazo, que es la única manera en que se lee un widget. Acaba abriendo la aplicación igualmente, y el widget le ha costado espacio a cambio de nada.',
          'El widget que se gana su sitio muestra lo siguiente, la hora y, si importa, qué está haciendo el cielo cuando llegue.',
        ],
      },
      {
        heading: 'Por qué el tiempo pertenece ahí',
        body: [
          'Los dos datos que quiere antes de salir son cuándo y cómo está fuera. Repartirlos en dos widgets recrea el problema de las dos aplicaciones en una pantalla más pequeña.',
          'Un vistazo, las dos respuestas, sin desbloquear.',
        ],
      },
    ],
    claims: {
      views: 'Vistas de la aplicación, para cuando sí la abre',
    },
    practical: [
      'Ponga el widget donde cae el pulgar, no donde queda ordenado.',
      'Use un tamaño mayor solo si de verdad lee más que el siguiente elemento.',
      'Si consulta el tiempo justo después del calendario, use un widget que lleve ambos.',
    ],
    seeAlso: ['a-countdown-to-your-next-meeting'],
  },

  'a-countdown-to-your-next-meeting': {
    title: 'Una cuenta atrás en la pantalla bloqueada',
    short: 'Cuenta atrás hasta la reunión',
    description:
      'Una actividad en vivo convierte «cuándo es» en «cuánto me queda», que era la pregunta de verdad.',
    lede: 'Entre saber que algo es a las tres y saber que quedan once minutos hay una diferencia práctica enorme, y solo una de las dos cambia lo que hace a continuación.',
    commonBelief: 'Que basta con un aviso unos minutos antes.',
    sections: [
      {
        heading: 'Una hora no es una duración',
        body: [
          'Leer «las tres» le obliga a una resta contra un reloj que además tiene que encontrar. Leer «once minutos» no. Lo segundo es accionable; lo primero es una consulta.',
          'Importa sobre todo en los veinte minutos previos, que es justo cuando la gente calcula mal.',
        ],
      },
      {
        heading: 'Por qué vive en la pantalla bloqueada',
        body: [
          'La cuenta atrás se actualiza en su sitio, así que basta con mirar. No hay aplicación que abrir ni aviso que descartar, y el dato es correcto cada vez que mira, en vez de haberlo sido una vez cuando saltó.',
          'Una única alerta cinco minutos antes dice lo mismo una sola vez y después deja de ayudar.',
        ],
      },
    ],
    claims: {},
    practical: [
      'Use la cuenta atrás para la última media hora y las alertas para el día anterior.',
      'Si suele salir tarde, mire el número en lugar de adelantar la alerta: la alerta se descarta con un dedo y el número no.',
    ],
    seeAlso: ['the-widget-that-shows-what-is-next'],
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
