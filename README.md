# FT_PAY_02 — Procesamiento / Validación de pago

Prototipo web (React) de la pantalla **IMG_PAY_02** del flujo *Reserva / Pago confirmado*,
construido a partir de la ficha técnica v1.1 (Producto: 02 Groups · Módulo: Reserva/Pago).

## Qué incluye

- Stepper de 5 pasos con el paso 2 activo.
- Estado "Validando tu pago..." con tarjeta de método de pago y verificación anti-fraude.
- Countdown en vivo del hold de la reserva (`PAY_08 holdExpiresAt`), que libera el cupo
  automáticamente (`payment_timeout`) si expira.
- Reintentos limitados a 3 intentos, según la regla de persistencia de la ficha.
- Panel lateral **simulador de webhook** para disparar manualmente los eventos
  `payment_succeeded`, `payment_failed`, `payment_timeout`, `payment_canceled`
  (equivalente a `payment.notification` en la ficha).
- Estado de sincronización y log de eventos analíticos en vivo (sección 16 de la ficha).

## Estructura

```
ft-pay-02/
├── README.md
├── package.json
└── src/
    └── PaymentProcessingScreen.jsx
```

## Uso

Este componente es un archivo React (`.jsx`) autocontenido pensado para integrarse en
cualquier proyecto React existente (Vite, Next.js, Create React App, etc.):

1. Copia `src/PaymentProcessingScreen.jsx` dentro de tu proyecto.
2. Instala la dependencia de íconos:
   ```bash
   npm install lucide-react
   ```
3. Impórtalo y úsalo:
   ```jsx
   import PaymentProcessingScreen from "./PaymentProcessingScreen";

   export default function App() {
     return <PaymentProcessingScreen />;
   }
   ```

## Pendiente / notas

- La ficha original especifica el archivo Flutter `payment_processing_screen.dart`
  (`PaymentProcessingScreen` / `PaymentProcessingController`). Este repo contiene la
  versión web/React equivalente; la versión Flutter se puede generar aparte si se necesita
  para la app móvil real.
- Las integraciones reales (webhook/callback del gateway, servicio de reservas) no están
  conectadas — el panel "Simulador de webhook" las reemplaza para fines de demo y QA.
