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
    practical: [
      'Por defecto, libre/ocupado para quien solo necesita reservar tiempo contigo.',
      'Reserva «hacer cambios» para quien de verdad planifica por ti.',
      'Revisa quién tiene acceso dos veces al año: lo compartido se acumula y nadie te avisa.',
    ],
    seeAlso: ['why-a-shared-calendar-does-not-appear', 'what-guests-can-do-to-your-event'],
  },

  'why-a-shared-calendar-does-not-appear': {
    title: 'Te compartieron un calendario y no aparece',
    short: 'Calendario compartido que no aparece',
    description:
      'Alguien compartió un calendario, aceptaste y no cambió nada. Las cuatro razones corrientes, en el orden en que conviene mirarlas.',
    lede: 'Llegó la invitación, se tocó el enlace y el calendario sigue sin estar. Casi siempre es una de cuatro cosas, y ninguna es que la compartición falle.',
    commonBelief: 'Que aceptar un calendario compartido lo pone en tu teléfono.',
    sections: [
      {
        heading: 'Aceptar lo añade a una cuenta, no a un dispositivo',
        body: [
          'Lo compartido aterriza en la cuenta de Google a la que iba dirigido. Si aceptaste con una cuenta y tu teléfono lleva otra, el calendario está a salvo justo donde no estás mirando.',
          'Incluso en la cuenta correcta, un calendario recién añadido llega desactivado en los demás dispositivos más veces de las que llega activado. Existe, solo que no está marcado, y un calendario sin marcar se parece exactamente a uno que falta.',
        ],
      },
      {
        heading: 'Las otras dos razones',
        body: [
          'Compartir con una lista de correo o una dirección de grupo rara vez llega a las personas; hace falta la dirección que de verdad es una cuenta de Google. Y un calendario compartido como enlace es una suscripción: cae en otra parte de la lista y se actualiza al ritmo de quien publica, no al instante.',
          'En el iPhone, los calendarios de Google llegan a la app integrada por una lista de sincronización propia, y los calendarios secundarios quedan fuera por defecto. Por eso una cuenta enseña su calendario principal y descarta en silencio los cuatro que importan.',
        ],
      },
    ],
    claims: {
      refreshHint: 'Horas entre peticiones de actualización de un feed suscrito',
      accounts: 'Tipos de cuenta que una sola vista reúne sin nada de esto',
    },
    practical: [
      'Comprueba qué cuenta aceptó lo compartido antes que ninguna otra cosa.',
      'Abre la lista de calendarios del dispositivo y búscalo desactivado, no ausente.',
      'Si llegó como enlace, espera un retraso en lugar de una aparición inmediata.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'google-calendars-that-never-reach-your-iphone'],
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
    practical: [
      'Lee la lista completa de acceso, no solo el nombre que ibas a quitar.',
      'Restablece la dirección secreta si esa persona la tuvo alguna vez.',
      'Da por hecho que las copias sobreviven: mueve lo verdaderamente sensible en vez de esconderlo.',
    ],
    seeAlso: ['who-can-see-what-in-google-calendar', 'the-secret-address-of-a-google-calendar'],
  },
};
