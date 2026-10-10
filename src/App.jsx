import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Home, Search, PlusCircle, Users, MessageCircle, ArrowLeft } from "lucide-react";
import MAESTRO from "./data/maestro.json";
import { INTERP } from "./data/interpretacion.js";
import { GROUPS } from "./data/mock.js";
import { SCREENS } from "./screens.jsx";
import PaymentProcessingScreen from "./PaymentProcessingScreen.jsx";

export const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const BETA = MAESTRO.filter((s) => s.fase === "Beta cerrada");
const byId = Object.fromEntries(MAESTRO.map((s) => [s.id, s]));

const TABS = [
  { key: "Inicio", label: "Inicio", icon: Home, root: "IN_01" },
  { key: "Explorar", label: "Explorar", icon: Search, root: "EX_02" },
  { key: "Crear", label: "Crear", icon: PlusCircle, root: "CREAR" },
  { key: "Grupos", label: "Grupos", icon: Users, root: "GR_01" },
  { key: "Chats", label: "Chats", icon: MessageCircle, root: "CHATS" },
];

// Pestaña a la que pertenece cada pantalla (de la columna "Pestaña" del Maestro).
const tabOf = (id) => {
  if (id === "CREAR") return "Crear";
  if (id === "CHATS") return "Chats";
  return byId[id]?.pestana;
};
const NO_NAV = new Set(["AU_01", "AU_02", "AU_03", "AU_04", "AU_05", "LINK", "LU_01"]);

const DEMO_USER = { name: "Carla Rojas", email: "carla@groups.app", interests: ["yoga", "padel"], isPublic: true, bio: "Me gusta probar cosas nuevas los fines de semana." };

const initialState = () => ({
  user: null,
  invite: false,
  pendingInvite: false,
  groups: GROUPS.map((g) => ({ ...g, members: [...g.members] })),
  joined: { g1: false },
  groupState: "activo",
  net: "normal",
  noConnections: false,
  favs: [],
  pushAsked: false,
  unread: 3,
  extraGroup: null,
});

export default function App() {
  const [stack, setStack] = useState([{ id: "AU_01", p: {} }]);
  const [state, setState] = useState(initialState);
  const [toastMsg, setToastMsg] = useState(null);
  const [payPreview, setPayPreview] = useState(false);

  const cur = stack[stack.length - 1];

  const set = useCallback((patch) => setState((s) => ({ ...s, ...(typeof patch === "function" ? patch(s) : patch) })), []);
  const go = useCallback((id, p = {}) => setStack((st) => [...st, { id, p }]), []);
  const back = useCallback(() => setStack((st) => (st.length > 1 ? st.slice(0, -1) : st)), []);
  const reset = useCallback((id, p = {}) => setStack([{ id, p }]), []);
  const toast = useCallback((m) => {
    setToastMsg(m);
    clearTimeout(window.__t);
    window.__t = setTimeout(() => setToastMsg(null), 2600);
  }, []);

  const jump = (id) => {
    if (!id.startsWith("AU_") && id !== "LINK" && !state.user) set({ user: DEMO_USER });
    const tab = tabOf(id);
    const root = TABS.find((t) => t.key === tab)?.root;
    if (root && root !== id) setStack([{ id: root, p: {} }, { id, p: id === "GR_03" || id === "GR_04" ? { gid: "g1" } : id === "GR_02" ? { gid: "g2" } : id === "EX_03" ? { eid: "e1" } : {} }]);
    else reset(id, id === "GR_03" ? { gid: "g1" } : {});
  };

  const ctx = useMemo(() => ({ state, set, go, back, reset, toast, cur, openPay: () => setPayPreview(true) }), [state, set, go, back, reset, toast, cur]);

  if (payPreview) {
    return (
      <div>
        <button className="pbtn" style={{ position: "fixed", top: 12, left: 12, zIndex: 99 }} onClick={() => setPayPreview(false)}>
          ← Volver al prototipo
        </button>
        <PaymentProcessingScreen />
      </div>
    );
  }

  const Screen = SCREENS[cur.id] || SCREENS.CREAR;
  const tab = tabOf(cur.id);
  const showNav = !NO_NAV.has(cur.id);

  return (
    <Ctx.Provider value={ctx}>
      <div className="layout">
        <aside className="side side-left">
          <Index current={cur.id} onJump={jump} />
        </aside>
        <div className="phone">
          <div className="screen" key={stack.length + cur.id}>
            <Screen p={cur.p} />
          </div>
          {showNav && (
            <nav className="nav">
              {TABS.map((t) => {
                const Icon = t.icon;
                const outOfBeta = t.key === "Crear" || t.key === "Chats";
                return (
                  <button key={t.key} className={tab === t.key ? "on" : ""} onClick={() => reset(t.root)}>
                    <Icon size={22} />
                    {t.label}
                    {outOfBeta && <span className="lock">Lanzamiento</span>}
                  </button>
                );
              })}
            </nav>
          )}
          {toastMsg && <div className="toast">{toastMsg}</div>}
        </div>
        <aside className="side">
          <Ficha id={cur.id} />
          <Sim id={cur.id} onRestart={() => { setState(initialState()); reset("AU_01"); }} />
        </aside>
      </div>
    </Ctx.Provider>
  );
}

function Index({ current, onJump }) {
  const extra = [{ id: "LINK", nombre: "Página pública del enlace" }];
  return (
    <div className="ppanel idx">
      <h3>Beta cerrada · {BETA.length} pantallas</h3>
      {BETA.map((s) => (
        <button key={s.id} className={current === s.id ? "on" : ""} onClick={() => onJump(s.id)}>
          <code>{s.id}</code>
          <span style={{ flex: 1 }}>{s.nombre}</span>
          {s.diseno !== "BASE LISTA" && <span className="ptag warn">rev</span>}
        </button>
      ))}
      <h3 style={{ marginTop: 14 }}>Sin fila en el Maestro</h3>
      {extra.map((s) => (
        <button key={s.id} className={current === s.id ? "on" : ""} onClick={() => onJump(s.id)}>
          <code>web</code>
          <span>{s.nombre}</span>
        </button>
      ))}
    </div>
  );
}

const tagTone = (v) => (["BASE LISTA", "ESPECIFICADO", "Hecho"].includes(v) ? "ok" : ["EN REVISIÓN", "PENDIENTE"].includes(v) ? "warn" : "");

function Ficha({ id }) {
  const s = byId[id];
  const interp = INTERP[id];

  if (id === "CREAR" || id === "CHATS") {
    const tab = id === "CREAR" ? "Crear" : "Chats";
    const list = MAESTRO.filter((x) => x.pestana === tab);
    return (
      <div className="ppanel">
        <h3>Pestaña {tab}</h3>
        <p className="ptext">Ninguna pantalla de esta pestaña está en la beta cerrada. Lo que trae el Maestro:</p>
        {list.map((x) => (
          <div key={x.id} className="ptext">
            <span className="ptag">{x.id}</span> {x.nombre} · <span className="ptag">{x.fase}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="ppanel">
      <h3>Ficha del Maestro</h3>
      {s ? (
        <>
          <p className="title">{s.id} · {s.nombre}</p>
          <dl className="kv">
            <dt>Fase</dt><dd><span className="ptag">{s.fase}</span> <span className="ptag">{s.ola}</span></dd>
            <dt>Diseño</dt><dd><span className={"ptag " + tagTone(s.diseno)}>{s.diseno}</span></dd>
            <dt>Backend</dt><dd><span className={"ptag " + tagTone(s.backend)}>{s.backend}</span></dd>
            <dt>Horas</dt><dd>{s.horas} h · {s.rol}</dd>
            <dt>Se abre desde</dt><dd>{s.padre}</dd>
          </dl>
          <div className="plabel">Descripción UI</div>
          <p className="ptext">{s.ui}</p>
          <div className="plabel">Flujo / transiciones</div>
          <p className="ptext">{s.flujo}</p>
          <div className="plabel">Estados por cubrir</div>
          <p className="ptext">{s.estados}</p>
          <details>
            <summary>Tablas, endpoints y notas</summary>
            <p className="ptext" style={{ marginTop: 8 }}>{s.tablas}</p>
            <p className="ptext">{s.endpoints}</p>
            <p className="ptext" style={{ color: "var(--p-ink-2)" }}>{s.notas}</p>
          </details>
        </>
      ) : (
        <p className="title">Página pública del enlace</p>
      )}
      {interp && (
        <>
          <div className="plabel">Cómo lo interpreté</div>
          {interp.supuestos.map((t, i) => <p key={i} className="ptext">• {t}</p>)}
          {interp.huecos.length > 0 && (
            <div className="gap">
              <div className="plabel" style={{ color: "#ffc14d" }}>Huecos o contradicciones</div>
              {interp.huecos.map((t, i) => <p key={i} className="ptext">• {t}</p>)}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Sim({ id, onRestart }) {
  const { state, set } = useApp();
  const Opt = ({ k, v, label }) => (
    <button className={"pbtn" + (state[k] === v ? " on" : "")} onClick={() => set({ [k]: v })}>{label}</button>
  );
  const g1 = state.groups.find((g) => g.id === "g1");
  return (
    <div className="ppanel">
      <h3>Simular</h3>
      <div className="plabel">Red / datos (pantallas con lista)</div>
      <Opt k="net" v="normal" label="Normal" />
      <Opt k="net" v="loading" label="Cargando" />
      <Opt k="net" v="empty" label="Vacío" />
      <Opt k="net" v="error" label="Error" />
      {id === "AU_01" && (
        <>
          <div className="plabel">Acceso</div>
          <button className={"pbtn" + (state.invite ? " on" : "")} onClick={() => set({ invite: !state.invite })}>Llegué por invitación</button>
        </>
      )}
      {id === "GR_03" && (
        <>
          <div className="plabel">Estado del grupo en formación</div>
          <Opt k="groupState" v="activo" label="Activo" />
          <Opt k="groupState" v="completo" label="Completo" />
          <Opt k="groupState" v="expirado" label="Expirado" />
          <Opt k="groupState" v="cancelado" label="Cancelado" />
          <div className="plabel">Viralidad</div>
          <button
            className="pbtn"
            onClick={() =>
              set((s) => {
                const groups = s.groups.map((g) => {
                  if (g.id !== "g1" || g.members.length >= g.min) return g;
                  return { ...g, members: [...g.members, ["p3", "p7", "p1", "p4"][g.members.length % 4] + "_" + g.members.length] };
                });
                const full = groups.find((g) => g.id === "g1").members.length >= g1.min;
                return { groups, groupState: full ? "completo" : s.groupState, unread: s.unread + (full ? 1 : 0) };
              })
            }
          >
            Simular invitado que se une ({g1.members.length}/{g1.min})
          </button>
        </>
      )}
      {id === "GR_04" && (
        <>
          <div className="plabel">Conexiones</div>
          <button className={"pbtn" + (state.noConnections ? " on" : "")} onClick={() => set({ noConnections: !state.noConnections })}>Sin conexiones</button>
        </>
      )}
      <div className="plabel">Prototipo</div>
      <button className="pbtn" onClick={onRestart}><ArrowLeft size={12} /> Reiniciar desde AU_01</button>
    </div>
  );
}
