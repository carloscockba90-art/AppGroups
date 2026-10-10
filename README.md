# Groups · Prototipo de la beta cerrada

Prototipo navegable (React + Vite) de las **18 pantallas de la beta cerrada**, interpretadas desde
`PRO_RESUMEN_MAESTRO_v25_CIERRE.xlsx`. Sirve para revisar con el equipo si la lectura del Maestro
es la correcta antes de programar en serio.

## Qué se ve

- **Centro:** el teléfono con la app. Barra inferior definitiva de v25 (Inicio, Explorar, Crear,
  Grupos, Chats); Perfil se abre desde el avatar. Crear y Chats aparecen marcadas como Lanzamiento.
- **Izquierda:** índice de las 18 pantallas de la beta (las marcadas `rev` siguen EN REVISIÓN en el
  Maestro) más la página pública del enlace de invitación.
- **Derecha:** la ficha del Maestro de la pantalla abierta (fase, estados, descripción, flujo,
  estados por cubrir), **cómo la interpreté** y los **huecos o contradicciones** que encontré.
  Debajo, controles para simular carga, vacío, error, la llegada por invitación, los estados de
  GR_03 y un invitado que se une al grupo.

## Ciclo para probar

1. En AU_01 activa "Llegué por invitación" → Continuar → registro → código (cualquiera; `000000`
   falla) → intereses → aterriza en GR_03 con la invitación conservada.
2. En GR_03 toca Compartir: hoja con WhatsApp (abre wa.me con el mensaje), Instagram, TikTok y
   copiar enlace; "Ver lo que recibe el invitado" muestra la página pública.
3. Desde Inicio, abre Lucas: si lo que pides calza con algo, muestra la experiencia; si no, ofrece
   crear el grupo (demanda) y te lleva a GR_03.

Datos de demo: contraseña `error` en AU_02 y correo `ya@groups.app` en AU_03 simulan errores.

## Archivos

- `src/data/maestro.json` — las filas del Maestro (extraídas del Excel v25).
- `src/data/interpretacion.js` — supuestos y huecos por pantalla. Es lo que hay que discutir.
- `src/screens.jsx` — las pantallas.
- `src/App.jsx` — navegación, ficha y simulador.
- `src/PaymentProcessingScreen.jsx` — pantalla de pago previa (RS_02, Lanzamiento), accesible
  desde "Reservar" en EX_03.

## Correr y publicar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
```

En Vercel: importar el repo, framework **Vite** (se detecta solo), build `npm run build`,
salida `dist`. No necesita variables de entorno.
