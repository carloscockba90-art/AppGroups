// Cómo interpreté cada pantalla de la beta a partir del Maestro v25:
// "supuestos" son decisiones mías para poder dibujarla; "huecos" son cosas
// que el Excel no resuelve o se contradicen y conviene decidir con el equipo.

export const INTERP = {
  AU_01: {
    supuestos: [
      "Variante desde invitación: banner 'Te invitó…' con progreso del grupo; el token se conserva hasta terminar el onboarding y se abre GR_03.",
      "Activa la variante con el interruptor 'Llegué por invitación' de este panel.",
    ],
    huecos: ["Faltan estados de carga del acceso social y de error de red."],
  },
  AU_02: {
    supuestos: [
      "Demo: la contraseña 'error' simula credenciales inválidas.",
      "Google / Apple entran directo a Inicio (sin pasar por registro).",
    ],
    huecos: ["Falta captura del estado de error y la opción '¿Olvidaste tu contraseña?' (no está en el Maestro)."],
  },
  AU_03: {
    supuestos: ["Demo: el correo ya@groups.app simula 'correo ya registrado'."],
    huecos: ["El Excel pide definir el error por correo ya registrado y el cargando al crear el usuario."],
  },
  AU_04: {
    supuestos: ["Demo: 000000 es un código inválido; cualquier otro pasa.", "Reenviar con cuenta regresiva de 30 s."],
    huecos: [],
  },
  AU_05: {
    supuestos: ["Hay que elegir al menos un interés para continuar.", "Si llegó por invitación, termina en GR_03 y no en Inicio."],
    huecos: ["No dice si hay mínimo de intereses ni si se puede saltar."],
  },
  IN_01: {
    supuestos: [
      "Orden: bloque Lucas, tarjeta de demanda, recomendados, próximos eventos, personas.",
      "Personas se muestran, pero tocar una no lleva a ningún lado: PE_02 es Lanzamiento.",
    ],
    huecos: ["La sección 'personas' apunta a PE_02, que no está en la beta."],
  },
  IN_02: {
    supuestos: ["Secciones Hoy / Anteriores con los 4 tipos del ciclo mínimo.", "El permiso push se pide al unirse a un grupo, nunca al arrancar."],
    huecos: [
      "Notifica 'llegaron propuestas' y 'votación por cerrar', pero LU_03 (ofertas y votación) está en Lanzamiento. En la beta no hay dónde votar.",
      "Backend PENDIENTE en el Maestro.",
    ],
  },
  LU_00: {
    supuestos: ["Las sugerencias envían el texto directo a LU_01 (decisión 10, cerrada en v25)."],
    huecos: ["Diseño todavía EN REVISIÓN y backend PENDIENTE, aunque es de la beta."],
  },
  LU_01: {
    supuestos: [
      "Lucas simulado con reglas: si el texto calza con una experiencia, la muestra; si no, ofrece crear una demanda (grupo en formación).",
      "La voz se muestra como botón, sin funcionar.",
    ],
    huecos: ["Falta el contrato con el modelo de IA y las reglas para decidir 'hay match' (decisión 4)."],
  },
  EX_02: {
    supuestos: ["Filtros (EX_02a/b) son de Lanzamiento: el botón avisa y no abre el modal.", "Búsqueda por texto y chips de categoría."],
    huecos: [],
  },
  EX_03: {
    supuestos: [
      "En la beta la reserva y el cobro son a mano (decisión 27): 'Reservar' deja la intención y el equipo contacta.",
      "Se puede ver la pantalla de pago de Lanzamiento (RS_02) como adelanto.",
    ],
    huecos: ["El anfitrión enlaza a PE_02, que es Lanzamiento."],
  },
  GR_01: { supuestos: ["Tabs Todos / Organizo / Participo; un grupo en formación abre GR_03."], huecos: ["Falta el estado vacío (sin grupos)."] },
  GR_02: {
    supuestos: ["Tab Chat muestra un aviso: CH_03 es Lanzamiento."],
    huecos: ["El chat de grupo es central para un producto de grupos y queda fuera de la beta."],
  },
  GR_03: {
    supuestos: [
      "Estados activo / completo / expirado / cancelado (cerrados en v25); cámbialos desde este panel.",
      "Compartir abre una hoja inferior, no una ruta nueva.",
      "'Simular invitado' suma un miembro como si alguien entrara por el enlace.",
    ],
    huecos: ["Al completarse sigue 'sourcing → ofertas → votación → evento', pero ofertas y votación (LU_03) no están en la beta."],
  },
  GR_04: {
    supuestos: ["Compartir y Copiar enlace arriba; conexiones como opción secundaria."],
    huecos: ["En la beta no hay conexiones (PE_03 es Después): la lista casi siempre estará vacía.", "Diseño EN REVISIÓN y backend PENDIENTE."],
  },
  PF_01: {
    supuestos: ["Se abre desde el avatar del header (no hay pestaña Perfil).", "Los accesos que no son de la beta aparecen con su fase."],
    huecos: [],
  },
  PF_02: { supuestos: ["Cerrar sesión vuelve a AU_01."], huecos: ["Seguridad, Términos, Ayuda, Privacidad e Idioma sin definir (decisión 13)."] },
  PF_03: {
    supuestos: ["Interruptor público / privado; el perfil nace público."],
    huecos: ["Diseño EN REVISIÓN (decisión 22): no está definido qué ve cada quien en privado."],
  },
  LINK: {
    supuestos: ["Página web ligera que ve quien abre el enlace sin la app (ítem de 'Diseño por entregar', sin ID en el Maestro)."],
    huecos: ["No tiene fila en el Maestro, así que no tiene horas ni responsable."],
  },
};
