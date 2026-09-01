import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ShieldCheck,
  CreditCard,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCcw,
  LifeBuoy,
  ChevronLeft,
} from "lucide-react";

/*
  FT_PAY_02 — Procesamiento / Validación de pago
  Pantalla 2 de 3 · Flujo: Reserva / Pago confirmado
  Prototipo web fiel a la ficha técnica (webhook-driven, hold countdown,
  reintentos, estados de sincronización).
*/

const HOLD_SECONDS = 5 * 60; // PAY_08 holdExpiresAt (demo: 5 min)
const MAX_ATTEMPTS = 3;

const STATUS = {
  PROCESSING: "processing",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
  TIMEOUT: "timeout",
  CANCELED: "canceled",
};

const STATUS_META = {
  [STATUS.PROCESSING]: {
    label: "Validando tu pago...",
    sub: "Estamos comunicándonos con tu banco o pasarela de pagos.",
    icon: Loader2,
    tone: "amber",
    severity: "Informativo",
  },
  [STATUS.SUCCEEDED]: {
    label: "Pago confirmado",
    sub: "Tu reserva quedó asegurada. Ya puedes ver el comprobante.",
    icon: CheckCircle2,
    tone: "teal",
    severity: "OK",
  },
  [STATUS.FAILED]: {
    label: "Pago rechazado",
    sub: "Fondos insuficientes, tarjeta inválida o fraude crítico.",
    icon: XCircle,
    tone: "coral",
    severity: "Bloqueante",
  },
  [STATUS.TIMEOUT]: {
    label: "Sin respuesta del gateway",
    sub: "El intento tardó demasiado. Puedes reintentar.",
    icon: Clock,
    tone: "amber",
    severity: "Advertencia",
  },
  [STATUS.CANCELED]: {
    label: "Intento cancelado",
    sub: "Cancelaste el proceso. El hold se liberó.",
    icon: XCircle,
    tone: "gray",
    severity: "Informativo",
  },
};

const tones = {
  amber: { fg: "#F5A524", bg: "rgba(245,165,36,0.12)" },
  teal: { fg: "#2DD4BF", bg: "rgba(45,212,191,0.12)" },
  coral: { fg: "#F27059", bg: "rgba(242,112,89,0.12)" },
  gray: { fg: "#8B93A7", bg: "rgba(139,147,167,0.12)" },
};

function formatMMSS(totalSeconds) {
  const s = Math.max(0, totalSeconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function Stepper({ current = 2, total = 5 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
      {Array.from({ length: total }).map((_, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <React.Fragment key={step}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 600,
                background: done ? "#2DD4BF" : active ? "#5B8DEF" : "#1E2740",
                color: done || active ? "#06111F" : "#5B6478",
                border: active ? "2px solid #A9C4FF" : "none",
              }}
            >
              {done ? "✓" : step}
            </div>
            {step < total && (
              <div style={{ width: 16, height: 2, background: done ? "#2DD4BF" : "#1E2740" }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function PaymentProcessingScreen() {
  const [status, setStatus] = useState(STATUS.PROCESSING);
  const [holdLeft, setHoldLeft] = useState(HOLD_SECONDS);
  const [attempts, setAttempts] = useState(1);
  const [sync, setSync] = useState("syncing"); // syncing | processing | succeeded | failed | timeout | canceled
  const [log, setLog] = useState([{ t: nowLabel(), msg: "payment_processing_start" }]);
  const intervalRef = useRef(null);

  function nowLabel() {
    return new Date().toLocaleTimeString("es-CL", { hour12: false });
  }

  const pushLog = useCallback((msg) => {
    setLog((l) => [{ t: nowLabel(), msg }, ...l].slice(0, 6));
  }, []);

  // Hold countdown — PAY_08 (Regla de persistencia: libera cupo si expira)
  useEffect(() => {
    if (status !== STATUS.PROCESSING) return;
    intervalRef.current = setInterval(() => {
      setHoldLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          handleWebhook(STATUS.TIMEOUT);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [status]);

  function handleWebhook(next) {
    setStatus(next);
    setSync(next === STATUS.PROCESSING ? "processing" : next);
    pushLog(
      next === STATUS.SUCCEEDED
        ? "payment_success"
        : next === STATUS.FAILED
        ? "payment_failed"
        : next === STATUS.TIMEOUT
        ? "payment_timeout"
        : "payment_abandoned"
    );
  }

  function simulate(next) {
    clearInterval(intervalRef.current);
    handleWebhook(next);
  }

  function retry() {
    if (attempts >= MAX_ATTEMPTS) return;
    setAttempts((a) => a + 1);
    setHoldLeft(HOLD_SECONDS);
    setStatus(STATUS.PROCESSING);
    setSync("processing");
    pushLog(`payment_method_changed (intento ${attempts + 1})`);
  }

  const meta = STATUS_META[status];
  const tone = tones[meta.tone];
  const holdPct = Math.round((holdLeft / HOLD_SECONDS) * 100);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070B14",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 32,
        flexWrap: "wrap",
        padding: "40px 20px",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Phone frame */}
      <div
        style={{
          width: 340,
          borderRadius: 36,
          background: "#0B1120",
          border: "1px solid #1B2438",
          padding: "18px 18px 26px",
          boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <ChevronLeft size={18} color="#5B6478" />
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ color: "#F1F5F9", fontSize: 15, fontWeight: 600 }}>
              Procesando tu pago
            </div>
            <div style={{ color: "#5B6478", fontSize: 11, marginTop: 2 }}>
              Reserva · Paso 2 de 3
            </div>
          </div>
          <div style={{ width: 18 }} />
        </div>

        <div style={{ marginBottom: 22 }}>
          <Stepper current={2} />
        </div>

        {/* Status hero */}
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div
            style={{
              width: 68,
              height: 68,
              margin: "0 auto 14px",
              borderRadius: "50%",
              background: tone.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <meta.icon
              size={30}
              color={tone.fg}
              className={status === STATUS.PROCESSING ? "spin" : ""}
            />
          </div>
          <div style={{ color: "#F1F5F9", fontSize: 17, fontWeight: 600, marginBottom: 6 }}>
            {meta.label}
          </div>
          <div style={{ color: "#8B93A7", fontSize: 13, lineHeight: 1.5, padding: "0 12px" }}>
            {meta.sub}
          </div>
        </div>

        {/* Payment method card (U206) */}
        <div
          style={{
            background: "#111A2E",
            border: "1px solid #1B2438",
            borderRadius: 14,
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <CreditCard size={20} color="#5B8DEF" />
          <div style={{ flex: 1 }}>
            <div style={{ color: "#F1F5F9", fontSize: 13, fontWeight: 500 }}>
              Visa terminada en 4242
            </div>
            <div style={{ color: "#5B6478", fontSize: 11 }}>Método de pago seleccionado</div>
          </div>
          <button
            disabled={status === STATUS.PROCESSING}
            style={{
              background: "none",
              border: "none",
              color: status === STATUS.PROCESSING ? "#374156" : "#5B8DEF",
              fontSize: 12,
              fontWeight: 500,
              cursor: status === STATUS.PROCESSING ? "default" : "pointer",
            }}
          >
            Cambiar
          </button>
        </div>

        {/* Anti-fraud (U207) */}
        <div
          style={{
            background: "#111A2E",
            border: "1px solid #1B2438",
            borderRadius: 14,
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <ShieldCheck size={20} color="#2DD4BF" />
          <div style={{ flex: 1 }}>
            <div style={{ color: "#F1F5F9", fontSize: 13, fontWeight: 500 }}>
              Protección y verificación
            </div>
            <div style={{ color: "#5B6478", fontSize: 11 }}>
              Realizando validaciones de seguridad y anti-fraude
            </div>
          </div>
        </div>

        {/* Hold countdown (U208) */}
        {status === STATUS.PROCESSING && (
          <div
            style={{
              background: "#111A2E",
              border: "1px solid #1B2438",
              borderRadius: 14,
              padding: "14px",
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "#8B93A7", fontSize: 12 }}>
                Tu reserva está en hold — tiempo para confirmar
              </span>
              <span style={{ color: "#F1F5F9", fontSize: 13, fontWeight: 600 }}>
                {formatMMSS(holdLeft)}
              </span>
            </div>
            <div style={{ height: 5, background: "#1B2438", borderRadius: 999 }}>
              <div
                style={{
                  height: "100%",
                  width: `${holdPct}%`,
                  background: holdPct < 20 ? "#F27059" : "#5B8DEF",
                  borderRadius: 999,
                  transition: "width 1s linear",
                }}
              />
            </div>
          </div>
        )}

        {/* Advisory / support (U209/U210) */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            padding: "10px 2px",
            marginBottom: status !== STATUS.PROCESSING ? 12 : 0,
          }}
        >
          <span style={{ color: "#5B6478", fontSize: 11, lineHeight: 1.5 }}>
            {status === STATUS.PROCESSING
              ? "No cierres la app. Te avisaremos en cuanto tengamos una respuesta."
              : "¿Problemas con tu pago? "}
            {status !== STATUS.PROCESSING && (
              <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#5B8DEF" }}>
                Contactar soporte
              </a>
            )}
          </span>
        </div>

        {/* Actions after resolution */}
        {status !== STATUS.PROCESSING && (
          <div style={{ display: "flex", gap: 10 }}>
            {(status === STATUS.FAILED || status === STATUS.TIMEOUT) && attempts < MAX_ATTEMPTS && (
              <button
                onClick={retry}
                style={{
                  flex: 1,
                  background: "#5B8DEF",
                  border: "none",
                  color: "#06111F",
                  fontWeight: 600,
                  fontSize: 13,
                  borderRadius: 10,
                  padding: "11px 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  cursor: "pointer",
                }}
              >
                <RefreshCcw size={14} /> Reintentar ({attempts}/{MAX_ATTEMPTS})
              </button>
            )}
            {status === STATUS.SUCCEEDED && (
              <button
                style={{
                  flex: 1,
                  background: "#2DD4BF",
                  border: "none",
                  color: "#06111F",
                  fontWeight: 600,
                  fontSize: 13,
                  borderRadius: 10,
                  padding: "11px 0",
                  cursor: "pointer",
                }}
              >
                Ver reserva confirmada
              </button>
            )}
            <button
              style={{
                flex: status === STATUS.SUCCEEDED ? "none" : 1,
                background: "none",
                border: "1px solid #1B2438",
                color: "#8B93A7",
                fontWeight: 500,
                fontSize: 13,
                borderRadius: 10,
                padding: "11px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                cursor: "pointer",
              }}
            >
              <LifeBuoy size={14} /> Soporte
            </button>
          </div>
        )}
      </div>

      {/* QA / test harness — simula eventos de webhook (secc. 15 y 16 de la ficha) */}
      <div style={{ width: 300, color: "#8B93A7", fontSize: 13 }}>
        <div style={{ color: "#F1F5F9", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
          Simulador de webhook
        </div>
        <div style={{ marginBottom: 14, fontSize: 12, lineHeight: 1.5 }}>
          Dispara los eventos de <code style={{ color: "#5B8DEF" }}>payment.notification</code> para
          probar cada estado de la pantalla.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18 }}>
          {[
            ["payment_succeeded", STATUS.SUCCEEDED, "#2DD4BF"],
            ["payment_failed", STATUS.FAILED, "#F27059"],
            ["payment_timeout", STATUS.TIMEOUT, "#F5A524"],
            ["payment_canceled", STATUS.CANCELED, "#8B93A7"],
          ].map(([label, s, color]) => (
            <button
              key={label}
              onClick={() => simulate(s)}
              style={{
                background: "#111A2E",
                border: `1px solid ${color}33`,
                color,
                fontSize: 11,
                fontWeight: 500,
                borderRadius: 8,
                padding: "8px 4px",
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setAttempts(1);
            setHoldLeft(HOLD_SECONDS);
            setStatus(STATUS.PROCESSING);
            setSync("processing");
            setLog([{ t: nowLabel(), msg: "payment_processing_start" }]);
          }}
          style={{
            width: "100%",
            background: "none",
            border: "1px solid #1B2438",
            color: "#8B93A7",
            fontSize: 12,
            borderRadius: 8,
            padding: "9px 0",
            marginBottom: 18,
            cursor: "pointer",
          }}
        >
          Reiniciar demo
        </button>

        <div style={{ color: "#F1F5F9", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
          Estado de sincronización
        </div>
        <div
          style={{
            background: "#111A2E",
            border: "1px solid #1B2438",
            borderRadius: 10,
            padding: "10px 12px",
            marginBottom: 18,
            fontSize: 12,
          }}
        >
          <div style={{ color: tone.fg, fontWeight: 600, textTransform: "capitalize" }}>
            {sync}
          </div>
          <div style={{ color: "#5B6478", marginTop: 2 }}>
            Severidad: {meta.severity} · Intento {attempts}/{MAX_ATTEMPTS}
          </div>
        </div>

        <div style={{ color: "#F1F5F9", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
          Evento analítico (log)
        </div>
        <div
          style={{
            background: "#111A2E",
            border: "1px solid #1B2438",
            borderRadius: 10,
            padding: "10px 12px",
            fontSize: 11,
            fontFamily: "monospace",
            maxHeight: 160,
            overflowY: "auto",
          }}
        >
          {log.map((l, i) => (
            <div key={i} style={{ color: i === 0 ? "#F1F5F9" : "#5B6478", marginBottom: 4 }}>
              [{l.t}] {l.msg}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .spin { animation: spin 1.1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
        button:active { transform: scale(0.98); }
      `}</style>
    </div>
  );
}
