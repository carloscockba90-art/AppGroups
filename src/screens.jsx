import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft, Bell, Sparkles, Mic, Send, Heart, MapPin, Calendar, Star, Users, Share2, Copy,
  MessageCircle, Instagram, Music2, ChevronRight, Lock, LogOut, Settings, Pencil, Search,
  SlidersHorizontal, Check, Clock, RefreshCw, AlertTriangle, Globe, Apple, Mail, X,
} from "lucide-react";
import { useApp } from "./App.jsx";
import { EVENTS, GROUPS, INTERESTS, PEOPLE, initials, money } from "./data/mock.js";

/* ---------- piezas comunes ---------- */

const who = (id) => PEOPLE.find((p) => p.id === String(id).split("_")[0]) || PEOPLE[0];

function Avatar({ id, size }) {
  const p = who(id);
  return (
    <div className="avatar" style={{ background: p.color, ...(size ? { width: size, height: size } : {}) }}>
      {initials(p.name)}
    </div>
  );
}

function Top({ title, right, noBack }) {
  const { back } = useApp();
  return (
    <div className="topbar">
      {!noBack && (
        <button className="iconbtn" onClick={back} aria-label="Volver">
          <ArrowLeft size={20} />
        </button>
      )}
      <h1>{title}</h1>
      {right}
    </div>
  );
}

function HomeHeader({ title }) {
  const { go, state } = useApp();
  return (
    <div className="topbar">
      <h1>{title}</h1>
      <button className="iconbtn" onClick={() => go("IN_02")} aria-label="Notificaciones">
        <Bell size={20} />
        {state.unread > 0 && <span className="badge">{state.unread}</span>}
      </button>
      <button onClick={() => go("PF_01")} aria-label="Mi perfil">
        <div className="avatar" style={{ background: "#5b4bff", width: 32, height: 32 }}>
          {initials(state.user?.name || "Tú")}
        </div>
      </button>
    </div>
  );
}

// Carga simulada: respeta el control "Red / datos" del panel.
function useNet(ms = 650) {
  const { state } = useApp();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), ms);
    return () => clearTimeout(t);
  }, [ms]);
  if (state.net === "loading" || !ready) return "loading";
  return state.net;
}

const Skeleton = ({ n = 3, h = 84 }) => (
  <div className="col">
    {Array.from({ length: n }).map((_, i) => <div key={i} className="skel" style={{ height: h }} />)}
  </div>
);

function ErrorState({ text = "No pudimos cargar esto." }) {
  const { set } = useApp();
  return (
    <div className="empty">
      <div className="big">⚠️</div>
      <p><b>{text}</b></p>
      <p className="muted">Revisa tu conexión e inténtalo de nuevo.</p>
      <button className="btn btn-ghost btn-sm" onClick={() => set({ net: "normal" })}>
        <RefreshCw size={14} /> Reintentar
      </button>
    </div>
  );
}

function Sheet({ onClose, children }) {
  return (
    <div className="scrim" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="grab" />
        {children}
      </div>
    </div>
  );
}

function OutOfBeta({ id, name, phase = "Lanzamiento" }) {
  return (
    <div className="card" style={{ background: "var(--warn-2)", borderColor: "transparent" }}>
      <div className="row"><Lock size={16} color="var(--warn)" /><b style={{ fontSize: 14 }}>{name}</b></div>
      <p className="muted" style={{ margin: "6px 0 0" }}>{id} es de {phase}: no entra en la beta cerrada.</p>
    </div>
  );
}

function EventCard({ e, wide }) {
  const { go } = useApp();
  return (
    <button className="card" style={{ textAlign: "left", padding: 0, overflow: "hidden", width: wide ? "100%" : undefined }} onClick={() => go("EX_03", { eid: e.id })}>
      <div className="thumb" style={{ background: e.bg, borderRadius: 0, height: wide ? 110 : 96 }}>{e.emoji}</div>
      <div style={{ padding: 12 }}>
        <div className="row between">
          <span className="pill brand">{e.cat}</span>
          <b style={{ fontSize: 14 }}>{money(e.price)}</b>
        </div>
        <div style={{ fontWeight: 700, margin: "8px 0 4px", fontSize: 15 }}>{e.title}</div>
        <div className="muted">{e.date}</div>
      </div>
    </button>
  );
}

/* ---------- AU: acceso ---------- */

function InviteBanner() {
  const { state } = useApp();
  const g = state.groups.find((x) => x.id === "g1");
  if (!state.invite) return null;
  return (
    <div className="banner" style={{ margin: "0 0 16px" }}>
      <div className="row">
        <Avatar id={g.invitedBy} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14 }}><b>Te invitó {who(g.invitedBy).name}</b> a <b>{g.name}</b></div>
          <div className="muted">{g.zone}</div>
        </div>
        <div style={{ fontSize: 28 }}>{g.emoji}</div>
      </div>
      <div className="progress" style={{ marginTop: 10 }}><div style={{ width: `${(g.members.length / g.min) * 100}%` }} /></div>
      <div className="muted" style={{ marginTop: 6 }}>Faltan {g.min - g.members.length} personas para activar el grupo</div>
    </div>
  );
}

function AU_01() {
  const { go, state, set } = useApp();
  useEffect(() => { set({ pendingInvite: state.invite }); }, [state.invite, set]);
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div className="hero" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-.02em" }}>Groups</div>
        <p style={{ fontSize: 20, lineHeight: 1.35, margin: "10px 0 0", opacity: .95 }}>
          Dile a Lucas qué quieres hacer.<br />Nosotros juntamos al grupo.
        </p>
      </div>
      <div className="pad">
        <InviteBanner />
        <div className="col">
          <button className="btn btn-primary" onClick={() => go("AU_03")}>{state.invite ? "Continuar" : "Crear cuenta"}</button>
          <button className="btn btn-ghost" onClick={() => go("AU_02")}>Ya tengo cuenta</button>
        </div>
      </div>
    </div>
  );
}

function finishAuth({ state, set, reset, toast }, user) {
  set({ user });
  if (state.pendingInvite) {
    set((s) => ({
      pendingInvite: false,
      joined: { ...s.joined, g1: true },
      groups: s.groups.map((g) => (g.id === "g1" && !g.members.includes("p7_me") ? { ...g, members: [...g.members, "p7_me"] } : g)),
    }));
    reset("GR_03", { gid: "g1", fromInvite: true });
    toast("Invitación conservada: te llevamos al grupo");
  } else reset("IN_01");
}

function AU_02() {
  const app = useApp();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = () => {
    if (!/\S+@\S+\.\S+/.test(email)) return setErr("Escribe un correo válido.");
    if (pass.length < 4) return setErr("La contraseña es muy corta.");
    setErr(""); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (pass === "error") return setErr("Correo o contraseña incorrectos.");
      finishAuth(app, { name: "Carla Rojas", email, interests: ["yoga"], isPublic: true, bio: "" });
    }, 900);
  };
  const social = () => finishAuth(app, { name: "Carla Rojas", email: "carla@gmail.com", interests: ["yoga"], isPublic: true, bio: "" });
  return (
    <>
      <Top title="Iniciar sesión" />
      <div className="pad">
        <InviteBanner />
        <label className={"field" + (err ? " err" : "")}>Correo<input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" /></label>
        <label className={"field" + (err ? " err" : "")}>Contraseña<input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••" /></label>
        {err && <p className="errtxt">{err}</p>}
        <button className="btn btn-primary" disabled={loading} onClick={submit}>{loading ? "Entrando…" : "Entrar"}</button>
        <p className="muted" style={{ textAlign: "center", margin: "18px 0" }}>o continúa con</p>
        <div className="row">
          <button className="btn btn-outline" onClick={social}><Globe size={18} /> Google</button>
          <button className="btn btn-outline" onClick={social}><Apple size={18} /> Apple</button>
        </div>
        <p className="muted" style={{ textAlign: "center", marginTop: 22 }}>
          ¿No tienes cuenta? <button style={{ color: "var(--brand)", fontWeight: 600 }} onClick={() => app.go("AU_03")}>Regístrate</button>
        </p>
      </div>
    </>
  );
}

function AU_03() {
  const { go, set } = useApp();
  const [f, setF] = useState({ name: "", email: "", pass: "", terms: false });
  const [errs, setErrs] = useState({});
  const [loading, setLoading] = useState(false);
  const up = (k) => (e) => setF({ ...f, [k]: k === "terms" ? e.target.checked : e.target.value });
  const submit = () => {
    const e = {};
    if (f.name.trim().length < 2) e.name = "Escribe tu nombre.";
    if (!/\S+@\S+\.\S+/.test(f.email)) e.email = "Correo no válido.";
    if (f.pass.length < 8) e.pass = "Mínimo 8 caracteres.";
    if (!f.terms) e.terms = "Debes aceptar los términos.";
    setErrs(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (f.email.toLowerCase() === "ya@groups.app") return setErrs({ email: "Este correo ya tiene cuenta. Inicia sesión." });
      set({ draftUser: { name: f.name, email: f.email } });
      go("AU_04", { email: f.email });
    }, 900);
  };
  return (
    <>
      <Top title="Crear cuenta" />
      <div className="pad">
        <InviteBanner />
        <label className={"field" + (errs.name ? " err" : "")}>Nombre<input value={f.name} onChange={up("name")} placeholder="Tu nombre" />{errs.name && <span className="errtxt">{errs.name}</span>}</label>
        <label className={"field" + (errs.email ? " err" : "")}>Correo<input value={f.email} onChange={up("email")} placeholder="tu@correo.com" />{errs.email && <span className="errtxt">{errs.email}</span>}</label>
        <label className={"field" + (errs.pass ? " err" : "")}>Contraseña<input type="password" value={f.pass} onChange={up("pass")} placeholder="Mínimo 8 caracteres" />{errs.pass && <span className="errtxt">{errs.pass}</span>}</label>
        <label className="row" style={{ fontSize: 13, color: "var(--ink-2)", marginBottom: 6 }}>
          <input type="checkbox" checked={f.terms} onChange={up("terms")} /> Acepto los términos y la política de privacidad
        </label>
        {errs.terms && <p className="errtxt">{errs.terms}</p>}
        <button className="btn btn-primary" style={{ marginTop: 12 }} disabled={loading} onClick={submit}>{loading ? "Creando cuenta…" : "Crear cuenta"}</button>
      </div>
    </>
  );
}

function AU_04({ p }) {
  const { go } = useApp();
  const [code, setCode] = useState(Array(6).fill(""));
  const [err, setErr] = useState("");
  const [left, setLeft] = useState(30);
  const refs = useRef([]);
  useEffect(() => {
    refs.current[0]?.focus();
  }, []);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  const put = (i, v) => {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = d;
    setCode(next);
    setErr("");
    if (d && i < 5) refs.current[i + 1]?.focus();
    if (next.every(Boolean)) {
      const c = next.join("");
      setTimeout(() => {
        if (c === "000000") { setErr("Código inválido o expirado."); setCode(Array(6).fill("")); refs.current[0]?.focus(); }
        else go("AU_05");
      }, 300);
    }
  };
  return (
    <>
      <Top title="Verifica tu correo" />
      <div className="pad" style={{ textAlign: "center" }}>
        <Mail size={40} color="var(--brand)" style={{ margin: "20px 0 8px" }} />
        <p>Enviamos un código de 6 dígitos a<br /><b>{p.email || "tu correo"}</b></p>
        <div className={"otp" + (err ? " err" : "")} style={{ margin: "22px 0 10px" }}>
          {code.map((d, i) => (
            <input key={i} ref={(el) => (refs.current[i] = el)} value={d} inputMode="numeric" onChange={(e) => put(i, e.target.value)}
              onKeyDown={(e) => e.key === "Backspace" && !d && i > 0 && refs.current[i - 1]?.focus()} />
          ))}
        </div>
        {err && <p className="errtxt">{err}</p>}
        <p className="muted">Demo: cualquier código sirve; 000000 simula uno inválido.</p>
        <button className="btn btn-ghost btn-sm" disabled={left > 0} style={{ marginTop: 10, opacity: left > 0 ? .5 : 1 }} onClick={() => setLeft(30)}>
          {left > 0 ? `Reenviar en ${left}s` : "Reenviar código"}
        </button>
      </div>
    </>
  );
}

function AU_05() {
  const app = useApp();
  const [sel, setSel] = useState([]);
  const toggle = (id) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const d = app.state.draftUser || { name: "Carla Rojas", email: "carla@groups.app" };
  return (
    <>
      <Top title="¿Qué te gusta hacer?" />
      <div className="pad">
        <p className="muted" style={{ marginTop: 0 }}>Elige tus intereses. Lucas los usa para recomendarte grupos y experiencias.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {INTERESTS.map((it) => {
            const on = sel.includes(it.id);
            return (
              <button key={it.id} onClick={() => toggle(it.id)} className="card"
                style={{ textAlign: "center", padding: "14px 6px", borderColor: on ? "var(--brand)" : undefined, background: on ? "var(--brand-2)" : "#fff", position: "relative" }}>
                {on && <Check size={14} color="var(--brand)" style={{ position: "absolute", top: 6, right: 6 }} />}
                <div style={{ fontSize: 28 }}>{it.emoji}</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>{it.label}</div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="sticky-cta">
        <button className="btn btn-primary" disabled={!sel.length}
          onClick={() => finishAuth(app, { ...d, interests: sel, isPublic: true, bio: "" })}>
          Continuar {sel.length ? `(${sel.length})` : ""}
        </button>
      </div>
    </>
  );
}

/* ---------- IN: inicio ---------- */

function IN_01() {
  const { go, state } = useApp();
  const net = useNet();
  const g = state.groups.find((x) => x.id === "g1");
  const name = (state.user?.name || "").split(" ")[0];
  return (
    <>
      <HomeHeader title={`Hola, ${name} 👋`} />
      <div className="pad">
        <button className="card" style={{ width: "100%", textAlign: "left", background: "linear-gradient(135deg,#5b4bff,#8f5bff)", color: "#fff", border: 0 }} onClick={() => go("LU_00")}>
          <div className="row"><Sparkles size={20} /><b>Lucas</b></div>
          <p style={{ margin: "8px 0 12px", fontSize: 15 }}>¿Qué te gustaría hacer este fin de semana?</p>
          <div className="row" style={{ background: "rgba(255,255,255,.18)", borderRadius: 12, padding: "10px 12px" }}>
            <span style={{ flex: 1, opacity: .85 }}>Escríbele o háblale a Lucas…</span><Mic size={18} />
          </div>
        </button>

        {net === "loading" ? <div style={{ marginTop: 16 }}><Skeleton n={3} /></div> : net === "error" ? <ErrorState /> : (
          <>
            <button className="card" style={{ width: "100%", textAlign: "left", marginTop: 14 }} onClick={() => go("GR_03", { gid: "g1" })}>
              <div className="row">
                <div style={{ fontSize: 30 }}>{g.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div className="pill warn">Grupo en formación</div>
                  <div style={{ fontWeight: 700, marginTop: 6 }}>{g.members.length + 9} personas buscan pádel cerca de ti</div>
                  <div className="muted">Faltan {Math.max(0, g.min - g.members.length)} para activar el grupo</div>
                </div>
                <ChevronRight size={18} />
              </div>
            </button>

            {net === "empty" ? (
              <div className="empty"><div className="big">🌱</div><p><b>Aún no tenemos recomendaciones</b></p><p className="muted">Cuéntale a Lucas qué te gusta y te armamos algo.</p></div>
            ) : (
              <>
                <div className="h2">Recomendados para ti</div>
                <div className="hscroll">{EVENTS.slice(0, 3).map((e) => <EventCard key={e.id} e={e} />)}</div>
                <div className="h2">Próximos eventos</div>
                <div className="col">
                  {EVENTS.slice(2).map((e) => (
                    <button key={e.id} className="row card" style={{ textAlign: "left" }} onClick={() => go("EX_03", { eid: e.id })}>
                      <div className="thumb" style={{ background: e.bg, height: 52, width: 52, fontSize: 24 }}>{e.emoji}</div>
                      <div style={{ flex: 1 }}><b style={{ fontSize: 14 }}>{e.title}</b><div className="muted">{e.date}</div></div>
                    </button>
                  ))}
                </div>
                <div className="h2">Personas con tus intereses</div>
                <div className="hscroll">
                  {PEOPLE.slice(0, 5).map((pp) => (
                    <div key={pp.id} className="card" style={{ flex: "0 0 120px", textAlign: "center" }}>
                      <div style={{ display: "grid", placeItems: "center" }}><Avatar id={pp.id} size={48} /></div>
                      <b style={{ fontSize: 13, display: "block", marginTop: 6 }}>{pp.name}</b>
                      <div className="muted" style={{ fontSize: 11 }}>{pp.interests.split(" · ")[0]}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

const NOTIFS = [
  { id: "n1", when: "Hoy", icon: "🎉", title: "¡Grupo completo!", text: "Pádel nivel intermedio llegó al mínimo. Buscamos profesionales.", to: ["GR_03", { gid: "g1" }] },
  { id: "n2", when: "Hoy", icon: "📩", title: "Llegaron propuestas", text: "3 profesionales enviaron ofertas para Pádel nivel intermedio.", to: ["GR_03", { gid: "g1" }] },
  { id: "n3", when: "Hoy", icon: "⏳", title: "La votación cierra en 2 h", text: "Elige la opción que prefieres antes de que cierre.", to: ["GR_03", { gid: "g1" }] },
  { id: "n4", when: "Anteriores", icon: "✅", title: "Opción seleccionada", text: "Yoga del cerro: ganó 'Sábado 07:30 con Sofía'.", to: ["EX_03", { eid: "e1" }] },
];

function IN_02() {
  const { go, set, state } = useApp();
  const net = useNet();
  useEffect(() => { set({ unread: 0 }); }, [set]);
  return (
    <>
      <Top title="Notificaciones" right={<button className="muted" style={{ fontSize: 12 }}>Marcar todas</button>} />
      {net === "loading" ? <div className="pad"><Skeleton n={4} h={64} /></div>
        : net === "error" ? <ErrorState />
        : net === "empty" ? <div className="empty"><div className="big">🔔</div><p><b>No tienes notificaciones</b></p><p className="muted">Te avisaremos cuando tu grupo avance.</p></div>
        : ["Hoy", "Anteriores"].map((w) => (
          <div key={w}>
            <div className="muted" style={{ padding: "14px 16px 4px", fontWeight: 600 }}>{w}</div>
            {NOTIFS.filter((n) => n.when === w).map((n) => (
              <button key={n.id} className="listitem" onClick={() => go(...n.to)}>
                <div style={{ fontSize: 24 }}>{n.icon}</div>
                <div style={{ flex: 1 }}><b style={{ fontSize: 14 }}>{n.title}</b><div className="muted">{n.text}</div></div>
                {w === "Hoy" && <span style={{ width: 8, height: 8, borderRadius: 4, background: "var(--brand)" }} />}
              </button>
            ))}
          </div>
        ))}
      {!state.pushAsked && net === "normal" && (
        <p className="muted" style={{ padding: 16 }}>El permiso de notificaciones push se pide al unirte a un grupo, no al abrir la app.</p>
      )}
    </>
  );
}

/* ---------- LU: Lucas ---------- */

const SUGGESTIONS = ["Quiero jugar pádel el finde", "Algo de yoga al aire libre", "Aprender a cocinar con gente nueva", "Un trekking tranquilo"];

function LU_00() {
  const { go } = useApp();
  const [txt, setTxt] = useState("");
  return (
    <>
      <Top title="Lucas" />
      <div className="pad" style={{ textAlign: "center" }}>
        <div style={{ width: 76, height: 76, borderRadius: "50%", margin: "24px auto 12px", background: "linear-gradient(135deg,#5b4bff,#ff7aa8)", display: "grid", placeItems: "center" }}>
          <Sparkles size={34} color="#fff" />
        </div>
        <h2 style={{ margin: "0 0 6px" }}>Hola, soy Lucas</h2>
        <p className="muted">Cuéntame qué quieres hacer. Si no existe, armo el grupo contigo.</p>
        <div className="col" style={{ marginTop: 18 }}>
          {SUGGESTIONS.map((s) => (
            <button key={s} className="card" style={{ textAlign: "left", fontSize: 14 }} onClick={() => go("LU_01", { first: s })}>{s}</button>
          ))}
        </div>
      </div>
      <div className="composer" style={{ position: "sticky", bottom: 0 }}>
        <input value={txt} onChange={(e) => setTxt(e.target.value)} placeholder="Escríbele a Lucas…" onKeyDown={(e) => e.key === "Enter" && txt && go("LU_01", { first: txt })} />
        <button className="iconbtn" disabled={!txt} onClick={() => go("LU_01", { first: txt })}><Send size={18} /></button>
      </div>
    </>
  );
}

function lucasReply(text) {
  const t = text.toLowerCase();
  const map = [["yoga", "e1"], ["trek", "e2"], ["cocin", "e3"], ["pasta", "e3"], ["foto", "e4"]];
  const hit = map.find(([k]) => t.includes(k));
  if (hit) return { text: "Encontré algo que calza contigo:", event: hit[1] };
  if (t.includes("pádel") || t.includes("padel")) return { text: "Hay un grupo de pádel juntándose cerca de ti. ¿Te sumas?", group: "g1" };
  return { text: "No encontré algo que calce todavía. Puedo crear la demanda y avisarte cuando se junte gente.", demand: text };
}

function LU_01({ p }) {
  const { go, set, toast, state } = useApp();
  const [msgs, setMsgs] = useState([]);
  const [txt, setTxt] = useState("");
  const [typing, setTyping] = useState(false);
  const end = useRef(null);
  const send = (text) => {
    if (!text) return;
    setMsgs((m) => [...m, { me: true, text }]);
    setTxt("");
    setTyping(true);
    setTimeout(() => { setTyping(false); setMsgs((m) => [...m, { me: false, ...lucasReply(text) }]); }, 900);
  };
  useEffect(() => { if (p.first) send(p.first); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);
  const createDemand = (text) => {
    const g = { id: "g9", name: text.length > 28 ? text.slice(0, 28) + "…" : text, emoji: "✨", bg: "#ece9ff", status: "formacion", activity: text, zone: "Cerca de ti", min: 6, members: ["p5"], role: "organizo" };
    set((s) => ({ groups: [...s.groups.filter((x) => x.id !== "g9"), g], groupState: "activo" }));
    toast("Demanda creada: compártela para juntar al grupo");
    go("GR_03", { gid: "g9" });
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Top title="Lucas" right={<span className="pill ok">en línea</span>} />
      <div className="col pad" style={{ flex: 1, overflowY: "auto" }}>
        <div className="bubble bot">Hola {(state.user?.name || "").split(" ")[0]}, ¿qué quieres hacer?</div>
        {msgs.map((m, i) => (
          <React.Fragment key={i}>
            <div className={"bubble " + (m.me ? "me" : "bot")}>{m.text}</div>
            {m.event && <div style={{ width: "80%" }}><EventCard e={EVENTS.find((e) => e.id === m.event)} wide /></div>}
            {m.group && (
              <button className="card" style={{ width: "80%", textAlign: "left" }} onClick={() => go("GR_03", { gid: m.group })}>
                <div className="pill warn">Grupo en formación</div>
                <b style={{ display: "block", marginTop: 6 }}>Pádel nivel intermedio</b>
                <span className="muted">Ver grupo →</span>
              </button>
            )}
            {m.demand && (
              <div className="row" style={{ gap: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={() => createDemand(m.demand)}>Crear el grupo</button>
                <button className="btn btn-ghost btn-sm" onClick={() => toast("Te avisaremos cuando aparezca algo así")}>Avísame</button>
              </div>
            )}
          </React.Fragment>
        ))}
        {typing && <div className="bubble bot muted">Lucas está escribiendo…</div>}
        <div ref={end} />
      </div>
      <div className="chips" style={{ padding: "0 12px 8px" }}>
        {["Este finde", "Algo gratis", "Cerca de mí"].map((q) => <button key={q} className="chip" onClick={() => send(q)}>{q}</button>)}
      </div>
      <div className="composer">
        <input value={txt} onChange={(e) => setTxt(e.target.value)} placeholder="Escribe un mensaje…" onKeyDown={(e) => e.key === "Enter" && send(txt)} />
        <button className="iconbtn" onClick={() => toast("Voz: no funciona en el prototipo")}><Mic size={18} /></button>
        <button className="iconbtn" onClick={() => send(txt)}><Send size={18} /></button>
      </div>
    </div>
  );
}

/* ---------- EX: explorar ---------- */

function EX_02() {
  const { go, toast } = useApp();
  const net = useNet();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todas");
  const cats = ["Todas", ...new Set(EVENTS.map((e) => e.cat))];
  const list = net === "empty" ? [] : EVENTS.filter((e) => (cat === "Todas" || e.cat === cat) && e.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <HomeHeader title="Explorar" />
      <div className="pad">
        <div className="row">
          <div className="row" style={{ flex: 1, border: "1px solid var(--line)", borderRadius: 12, padding: "0 12px" }}>
            <Search size={16} color="var(--ink-2)" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar experiencias" style={{ border: 0, outline: 0, padding: "11px 0", flex: 1 }} />
          </div>
          <button className="iconbtn" style={{ border: "1px solid var(--line)", borderRadius: 12 }} onClick={() => toast("Filtros (EX_02a/b) es de Lanzamiento")}>
            <SlidersHorizontal size={18} />
          </button>
        </div>
        <div className="chips" style={{ margin: "12px 0" }}>
          {cats.map((c) => <button key={c} className={"chip" + (cat === c ? " on" : "")} onClick={() => setCat(c)}>{c}</button>)}
        </div>
        {net === "loading" ? <Skeleton n={3} h={200} />
          : net === "error" ? <ErrorState text="No pudimos cargar los resultados." />
          : list.length === 0 ? (
            <div className="empty">
              <div className="big">🔍</div>
              <p><b>No encontré algo que calce</b></p>
              <p className="muted">Pregúntale a Lucas: si no existe, junta al grupo por ti.</p>
              <div className="col" style={{ marginTop: 12 }}>
                <button className="btn btn-primary" onClick={() => go("LU_01", { first: q || "Busco algo distinto" })}><Sparkles size={16} /> Preguntar a Lucas</button>
                <button className="btn btn-ghost" onClick={() => toast("Te avisaremos cuando haya algo así")}><Bell size={16} /> Avísame</button>
              </div>
            </div>
          ) : (
            <div className="col">{list.map((e) => <EventCard key={e.id} e={e} wide />)}</div>
          )}
      </div>
    </>
  );
}

function EX_03({ p }) {
  const { go, state, set, toast, openPay } = useApp();
  const e = EVENTS.find((x) => x.id === p.eid) || EVENTS[0];
  const [sheet, setSheet] = useState(false);
  const fav = state.favs.includes(e.id);
  const net = useNet(400);
  if (net === "loading") return <><Top title="" /><div className="pad"><Skeleton n={1} h={220} /><div style={{ height: 12 }} /><Skeleton n={3} h={40} /></div></>;
  if (net === "error") return <><Top title="" /><ErrorState text="No pudimos cargar la experiencia." /></>;
  const host = who(e.host);
  return (
    <>
      <Top title="" right={
        <button className="iconbtn" onClick={() => { set({ favs: fav ? state.favs.filter((x) => x !== e.id) : [...state.favs, e.id] }); toast(fav ? "Quitado de favoritos" : "Guardado en favoritos (la lista EX_04 es de Lanzamiento)"); }}>
          <Heart size={20} fill={fav ? "var(--bad)" : "none"} color={fav ? "var(--bad)" : "currentColor"} />
        </button>} />
      <div className="thumb" style={{ background: e.bg, borderRadius: 0, height: 200, fontSize: 80 }}>{e.emoji}</div>
      <div className="pad">
        <span className="pill brand">{e.cat}</span>
        <h2 style={{ margin: "10px 0 8px" }}>{e.title}</h2>
        <div className="col" style={{ gap: 6 }}>
          <div className="row muted"><Calendar size={15} /> {e.date}</div>
          <div className="row muted"><MapPin size={15} /> {e.place}</div>
          <div className="row muted"><Star size={15} /> {e.rating} · <Users size={15} /> {e.total - e.spots}/{e.total} inscritos</div>
        </div>
        <p style={{ lineHeight: 1.5 }}>{e.desc}</p>
        <div className="card row">
          <Avatar id={host.id} />
          <div style={{ flex: 1 }}><div className="muted">Anfitrión</div><b>{host.name}</b></div>
          <button className="muted" onClick={() => toast("Perfil público (PE_02) es de Lanzamiento")}>Ver perfil</button>
        </div>
        <div className="h2">Quiénes van</div>
        <div className="row"><div className="stack">{e.attendees.map((a) => <Avatar key={a} id={a} />)}</div><span className="muted">{e.attendees.length} personas</span></div>
        {e.group && (
          <button className="card row" style={{ width: "100%", marginTop: 14, textAlign: "left" }} onClick={() => go("GR_02", { gid: e.group })}>
            <Users size={18} /><span style={{ flex: 1 }}>Grupo asociado: <b>{GROUPS.find((g) => g.id === e.group).name}</b></span><ChevronRight size={16} />
          </button>
        )}
      </div>
      <div className="sticky-cta row" style={{ background: "#fff", borderTop: "1px solid var(--line)" }}>
        <div style={{ flex: 1 }}><b style={{ fontSize: 18 }}>{money(e.price)}</b><div className="muted">por persona</div></div>
        {e.spots === 0
          ? <button className="btn btn-ghost" style={{ width: "auto" }} onClick={() => toast("Te avisaremos si se libera un cupo")}>Sin cupos · Avísame</button>
          : <button className="btn btn-primary" style={{ width: "auto" }} onClick={() => setSheet(true)}>Reservar</button>}
      </div>
      {sheet && (
        <Sheet onClose={() => setSheet(false)}>
          <h3 style={{ marginTop: 0 }}>Reserva en la beta</h3>
          <p className="muted">En la beta cerrada la reserva y el cobro se hacen a mano: dejas tu intención y el equipo te contacta para confirmar y pagar.</p>
          <div className="col">
            <button className="btn btn-primary" onClick={() => { setSheet(false); toast("Listo: el equipo te contactará para confirmar tu cupo"); }}>Quiero mi cupo</button>
            <button className="btn btn-outline" onClick={openPay}>Ver cómo será el pago (RS_02, Lanzamiento)</button>
          </div>
        </Sheet>
      )}
    </>
  );
}

/* ---------- GR: grupos ---------- */

function GR_01() {
  const { go, state } = useApp();
  const net = useNet();
  const [tab, setTab] = useState("todos");
  const list = net === "empty" ? [] : state.groups.filter((g) => tab === "todos" || g.role === tab);
  return (
    <>
      <HomeHeader title="Mis grupos" />
      <div className="tabs">
        {[["todos", "Todos"], ["organizo", "Organizo"], ["participo", "Participo"]].map(([k, l]) => (
          <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>
      <div className="pad">
        {net === "loading" ? <Skeleton n={3} />
          : net === "error" ? <ErrorState text="No pudimos cargar tus grupos." />
          : list.length === 0 ? (
            <div className="empty"><div className="big">👥</div><p><b>Aún no estás en ningún grupo</b></p><p className="muted">Los grupos nacen cuando le cuentas a Lucas qué quieres hacer.</p>
              <button className="btn btn-primary" onClick={() => go("LU_00")}><Sparkles size={16} /> Hablar con Lucas</button></div>
          ) : (
            <div className="col">
              {list.map((g) => (
                <button key={g.id} className="card row" style={{ textAlign: "left" }} onClick={() => go(g.status === "formacion" ? "GR_03" : "GR_02", { gid: g.id })}>
                  <div className="thumb" style={{ background: g.bg, width: 56, height: 56, fontSize: 28 }}>{g.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <b>{g.name}</b>
                    <div className="muted">{g.members.length} miembros · {g.zone}</div>
                    <span className={"pill " + (g.status === "formacion" ? "warn" : "ok")} style={{ marginTop: 4 }}>{g.status === "formacion" ? "En formación" : "Activo"}</span>
                  </div>
                  <ChevronRight size={18} />
                </button>
              ))}
            </div>
          )}
      </div>
    </>
  );
}

function GR_02({ p }) {
  const { go, state, toast } = useApp();
  const g = state.groups.find((x) => x.id === p.gid) || state.groups[1];
  const [tab, setTab] = useState("Eventos");
  const ev = EVENTS.find((e) => e.id === g.nextEvent);
  return (
    <>
      <Top title={g.name} right={<button className="iconbtn" onClick={() => go("GR_04", { gid: g.id })}><Share2 size={18} /></button>} />
      <div className="thumb" style={{ background: g.bg, borderRadius: 0, height: 120, fontSize: 56 }}>{g.emoji}</div>
      <div className="pad" style={{ paddingBottom: 6 }}>
        <div className="muted">{g.activity} · {g.zone}</div>
        <div className="row" style={{ marginTop: 8 }}><div className="stack">{g.members.slice(0, 5).map((m) => <Avatar key={m} id={m} />)}</div><span className="muted">{g.members.length} miembros</span></div>
      </div>
      <div className="tabs">{["Eventos", "Chat", "Miembros", "Info"].map((t) => <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{t}</button>)}</div>
      <div className="pad">
        {tab === "Eventos" && (ev ? <><div className="muted" style={{ marginBottom: 8 }}>Próximo evento</div><EventCard e={ev} wide /></> : <p className="muted">Sin eventos próximos.</p>)}
        {tab === "Chat" && <OutOfBeta id="CH_03" name="Chat del grupo" />}
        {tab === "Miembros" && g.members.map((m) => (
          <button key={m} className="listitem" style={{ padding: "10px 0" }} onClick={() => toast("Perfil público (PE_02) es de Lanzamiento")}>
            <Avatar id={m} /><div style={{ flex: 1 }}><b style={{ fontSize: 14 }}>{who(m).name}</b><div className="muted">{who(m).interests}</div></div>
          </button>
        ))}
        {tab === "Info" && <p className="muted">Grupo de {g.activity.toLowerCase()} en {g.zone}. Mínimo para activar: {g.min} personas.</p>}
      </div>
      <div className="sticky-cta"><button className="btn btn-primary" onClick={() => go("GR_04", { gid: g.id })}><Users size={18} /> Invitar</button></div>
    </>
  );
}

function ShareSheet({ g, onClose }) {
  const { toast, go, set } = useApp();
  const missing = Math.max(0, g.min - g.members.length);
  const link = `groups.app/g/${g.id}`;
  const msg = `¡Únete a "${g.name}" en Groups! Faltan ${missing} personas para activar el grupo 👉 ${link}`;
  const opts = [
    { label: "Copiar enlace", icon: Copy, bg: "#5b6275", act: () => { navigator.clipboard?.writeText(link); toast("Enlace copiado"); } },
    { label: "WhatsApp", icon: MessageCircle, bg: "#25d366", act: () => window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank") },
    { label: "Instagram", icon: Instagram, bg: "#e1306c", act: () => toast("Instagram: se comparte la imagen para historias (sin texto precargado)") },
    { label: "TikTok", icon: Music2, bg: "#111", act: () => toast("TikTok: se comparte la imagen (sin texto precargado)") },
  ];
  return (
    <Sheet onClose={onClose}>
      <h3 style={{ margin: "0 0 12px" }}>Compartir grupo</h3>
      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 16 }}>
        <div className="thumb" style={{ background: g.bg, borderRadius: 0, height: 90 }}>{g.emoji}</div>
        <div style={{ padding: 12 }}>
          <b>{g.name}</b>
          <div className="muted">{g.activity} · {g.zone}</div>
          <div className="progress" style={{ margin: "8px 0 4px" }}><div style={{ width: `${(g.members.length / g.min) * 100}%` }} /></div>
          <div className="muted">{g.members.length} se unieron · faltan {missing}</div>
        </div>
      </div>
      <div className="share-grid">
        {opts.map((o) => { const I = o.icon; return <button key={o.label} onClick={o.act}><span className="ic" style={{ background: o.bg }}><I size={22} /></span>{o.label}</button>; })}
      </div>
      <button className="btn btn-outline" style={{ marginTop: 16 }} onClick={() => { if (navigator.share) navigator.share({ text: msg }).catch(() => {}); else toast("Menú nativo del teléfono"); }}>
        <Share2 size={16} /> Más opciones
      </button>
      <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={() => { onClose(); set({ invite: true }); go("LINK", { gid: g.id }); }}>
        Ver lo que recibe el invitado →
      </button>
    </Sheet>
  );
}

function GR_03({ p }) {
  const { state, set, toast, go } = useApp();
  const g = state.groups.find((x) => x.id === p.gid) || state.groups[0];
  const [share, setShare] = useState(false);
  const [pushSheet, setPushSheet] = useState(false);
  const joined = state.joined[g.id] || g.role === "organizo" || p.fromInvite;
  const st = state.groupState;
  const missing = Math.max(0, g.min - g.members.length);
  const join = () => {
    set((s) => ({ joined: { ...s.joined, [g.id]: true } }));
    toast("¡Te uniste! Comparte para que se llene más rápido");
    if (!state.pushAsked) setTimeout(() => setPushSheet(true), 500);
  };
  const steps = [
    ["Demanda creada", true],
    [`Alcanzar ${g.min} personas`, st === "completo"],
    ["Buscar profesionales", false],
    ["Ofertas y votación", false],
    ["Evento confirmado", false],
  ];

  if (st === "expirado" || st === "cancelado") {
    return (
      <>
        <Top title={g.name} />
        <div className="empty">
          <div className="big">{st === "expirado" ? "⌛" : "🚫"}</div>
          <p><b>{st === "expirado" ? "No alcanzamos el mínimo" : "La convocatoria se canceló"}</b></p>
          <p className="muted">{st === "expirado" ? `Se juntaron ${g.members.length} de ${g.min} personas antes del 20 oct.` : "El organizador canceló el grupo el 12 oct."} No se cobró ni se reservó nada.</p>
          <div className="col" style={{ marginTop: 14 }}>
            <button className="btn btn-primary" onClick={() => go("LU_01", { first: `Alternativa a ${g.activity}` })}><Sparkles size={16} /> Buscar alternativa con Lucas</button>
            <button className="btn btn-ghost" onClick={() => { set({ groupState: "activo" }); toast("Convocatoria reabierta por 7 días"); }}><RefreshCw size={16} /> Reintentar convocatoria</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Top title={g.name} />
      <div className="thumb" style={{ background: g.bg, borderRadius: 0, height: 130, fontSize: 60 }}>{g.emoji}</div>
      <div className="pad">
        <span className={"pill " + (st === "completo" ? "ok" : "warn")}>{st === "completo" ? "Grupo completo" : "Grupo en formación"}</span>
        <h2 style={{ margin: "8px 0 2px" }}>{g.activity}</h2>
        <div className="muted">{g.zone}</div>
        <div className="card" style={{ marginTop: 14 }}>
          <div className="row between"><b>{st === "completo" ? "¡Llegamos al mínimo!" : `Faltan ${missing} personas para activar el grupo`}</b><span className="muted">{g.members.length}/{g.min}</span></div>
          <div className="progress" style={{ margin: "10px 0" }}><div style={{ width: `${Math.min(100, (g.members.length / g.min) * 100)}%` }} /></div>
          <div className="stack">{g.members.map((m, i) => <Avatar key={m + i} id={m} />)}</div>
        </div>
        <div className="h2">Cómo avanza</div>
        <div className="col" style={{ gap: 8 }}>
          {steps.map(([t, done], i) => (
            <div key={t} className="row" style={{ fontSize: 14, color: done ? "var(--ink)" : "var(--ink-2)" }}>
              <span style={{ width: 22, height: 22, borderRadius: 11, display: "grid", placeItems: "center", background: done ? "var(--ok)" : "var(--surface-2)", color: done ? "#fff" : "var(--ink-2)", fontSize: 11 }}>{done ? <Check size={13} /> : i + 1}</span>
              {t}
              {i === 3 && <span className="pill warn">LU_03 · Lanzamiento</span>}
            </div>
          ))}
        </div>
        {st === "completo" && <p className="muted" style={{ marginTop: 12 }}>En la beta el equipo busca a los profesionales a mano y te avisa cuando haya propuestas.</p>}
        {joined && <button className="muted" style={{ marginTop: 18 }} onClick={() => { set((s) => ({ joined: { ...s.joined, [g.id]: false } })); toast("Saliste del grupo"); }}>Salir del grupo</button>}
      </div>
      <div className="sticky-cta">
        {joined
          ? <button className="btn btn-primary" onClick={() => setShare(true)}><Share2 size={18} /> Compartir {missing > 0 && `· faltan ${missing}`}</button>
          : <div className="row"><button className="btn btn-primary" onClick={join}>Unirme</button><button className="btn btn-ghost" style={{ width: 70 }} onClick={() => setShare(true)}><Share2 size={18} /></button></div>}
      </div>
      {share && <ShareSheet g={g} onClose={() => setShare(false)} />}
      {pushSheet && (
        <Sheet onClose={() => { setPushSheet(false); set({ pushAsked: true }); }}>
          <div style={{ textAlign: "center" }}>
            <Bell size={36} color="var(--brand)" />
            <h3>¿Te avisamos cuando el grupo se llene?</h3>
            <p className="muted">Solo te escribimos cuando tu grupo avanza: se llena, llegan propuestas o hay que votar.</p>
            <button className="btn btn-primary" onClick={() => { setPushSheet(false); set({ pushAsked: true }); toast("Notificaciones activadas"); }}>Activar notificaciones</button>
            <button className="btn" style={{ color: "var(--ink-2)" }} onClick={() => { setPushSheet(false); set({ pushAsked: true }); }}>Ahora no</button>
          </div>
        </Sheet>
      )}
    </>
  );
}

function GR_04({ p }) {
  const { state, toast } = useApp();
  const g = state.groups.find((x) => x.id === p.gid) || state.groups[0];
  const [share, setShare] = useState(false);
  const [sel, setSel] = useState([]);
  const conns = state.noConnections ? [] : PEOPLE.filter((pp) => !g.members.includes(pp.id));
  return (
    <>
      <Top title="Invitar al grupo" />
      <div className="pad">
        <div className="row">
          <button className="btn btn-primary" onClick={() => setShare(true)}><Share2 size={16} /> Compartir enlace</button>
          <button className="btn btn-ghost" onClick={() => { navigator.clipboard?.writeText(`groups.app/g/${g.id}`); toast("Enlace copiado"); }}><Copy size={16} /> Copiar</button>
        </div>
        <div className="h2">Tus conexiones</div>
        {conns.length === 0 ? (
          <div className="empty" style={{ padding: "24px 10px" }}>
            <div className="big">🤝</div>
            <p><b>Todavía no tienes conexiones</b></p>
            <p className="muted">Comparte el enlace por WhatsApp o redes: quien lo abra llega directo al grupo.</p>
            <button className="btn btn-primary" onClick={() => setShare(true)}>Compartir enlace</button>
          </div>
        ) : (
          <>
            {conns.map((pp) => {
              const on = sel.includes(pp.id);
              return (
                <button key={pp.id} className="listitem" style={{ padding: "10px 0" }} onClick={() => setSel(on ? sel.filter((x) => x !== pp.id) : [...sel, pp.id])}>
                  <Avatar id={pp.id} />
                  <div style={{ flex: 1 }}><b style={{ fontSize: 14 }}>{pp.name}</b><div className="muted">{pp.interests}</div></div>
                  <span style={{ width: 22, height: 22, borderRadius: 11, border: "2px solid " + (on ? "var(--brand)" : "var(--line)"), background: on ? "var(--brand)" : "#fff", display: "grid", placeItems: "center" }}>{on && <Check size={13} color="#fff" />}</span>
                </button>
              );
            })}
          </>
        )}
      </div>
      {sel.length > 0 && <div className="sticky-cta"><button className="btn btn-primary" onClick={() => { toast(`Invitaciones enviadas a ${sel.length}`); setSel([]); }}>Enviar invitaciones ({sel.length})</button></div>}
      {share && <ShareSheet g={g} onClose={() => setShare(false)} />}
    </>
  );
}

/* ---------- Página pública del enlace (web) ---------- */

function LINK({ p }) {
  const { state, reset, set } = useApp();
  const g = state.groups.find((x) => x.id === (p.gid || "g1")) || state.groups[0];
  const missing = Math.max(0, g.min - g.members.length);
  return (
    <div style={{ background: "#f4f5f9", minHeight: "100%" }}>
      <div className="row" style={{ padding: "10px 14px", background: "#e9eaf0", fontSize: 12, color: "var(--ink-2)" }}>
        <Lock size={12} /> groups.app/g/{g.id}
        <span style={{ flex: 1 }} />
        <span className="pill brand">navegador</span>
      </div>
      <div className="pad">
        <div style={{ fontWeight: 800, fontSize: 22, color: "var(--brand)" }}>Groups</div>
        <div className="card" style={{ padding: 0, overflow: "hidden", marginTop: 14 }}>
          <div className="thumb" style={{ background: g.bg, borderRadius: 0, height: 150, fontSize: 70 }}>{g.emoji}</div>
          <div style={{ padding: 16 }}>
            {g.invitedBy && <div className="muted">{who(g.invitedBy).name} te invitó a</div>}
            <h2 style={{ margin: "4px 0" }}>{g.name}</h2>
            <div className="muted">{g.activity} · {g.zone}</div>
            <div className="progress" style={{ margin: "12px 0 6px" }}><div style={{ width: `${(g.members.length / g.min) * 100}%` }} /></div>
            <div className="row between"><div className="stack">{g.members.slice(0, 5).map((m, i) => <Avatar key={m + i} id={m} />)}</div><b>Faltan {missing}</b></div>
          </div>
        </div>
        <div className="col" style={{ marginTop: 16 }}>
          <button className="btn btn-primary" onClick={() => { set({ user: null, invite: true }); reset("AU_01"); }}>Continuar / Crear cuenta</button>
          <button className="btn btn-outline" onClick={() => { if (state.user) reset("GR_03", { gid: g.id, fromInvite: true }); else { set({ invite: true }); reset("AU_01"); } }}>Abrir en la app</button>
        </div>
        <p className="muted" style={{ textAlign: "center", marginTop: 14 }}>Al registrarte vuelves directo a este grupo.</p>
      </div>
    </div>
  );
}

/* ---------- PF: perfil ---------- */

function PF_01() {
  const { go, state, toast } = useApp();
  const u = state.user || {};
  const items = [
    ["Editar perfil", "PF_03", null],
    ["Configuración", "PF_02", null],
    ["Mis intereses", "PF_04", "Lanzamiento"],
    ["Mis eventos", "PF_05", "Lanzamiento"],
    ["Conexiones", "PE_03", "Después"],
    ["Métodos de pago", "PF_06", "Después"],
    ["Historial", "PF_08", "Después"],
    ["Beneficios y créditos", "PF_09", "Después"],
  ];
  return (
    <>
      <Top title="Mi perfil" right={<button className="iconbtn" onClick={() => go("PF_02")}><Settings size={20} /></button>} />
      <div className="pad" style={{ textAlign: "center" }}>
        <div style={{ display: "grid", placeItems: "center" }}>
          <div className="avatar" style={{ background: "#5b4bff", width: 84, height: 84, fontSize: 28 }}>{initials(u.name || "Tú")}</div>
        </div>
        <h2 style={{ margin: "10px 0 2px" }}>{u.name}</h2>
        <div className="muted">{u.isPublic ? "Perfil público" : "Perfil privado"} · Santiago</div>
        {u.bio && <p style={{ fontSize: 14 }}>{u.bio}</p>}
        <div className="chips" style={{ justifyContent: "center", marginTop: 10 }}>
          {(u.interests || []).map((i) => { const it = INTERESTS.find((x) => x.id === i); return it && <span key={i} className="chip">{it.emoji} {it.label}</span>; })}
        </div>
        <div className="row" style={{ justifyContent: "space-around", margin: "18px 0" }}>
          {[[state.groups.length, "Grupos"], [2, "Eventos"], [12, "Conexiones"]].map(([n, l]) => <div key={l}><b style={{ fontSize: 20 }}>{n}</b><div className="muted">{l}</div></div>)}
        </div>
      </div>
      {items.map(([l, id, phase]) => (
        <button key={id} className="listitem" onClick={() => (phase ? toast(`${id} es de ${phase}`) : go(id))}>
          <span style={{ flex: 1, color: phase ? "var(--ink-2)" : "var(--ink)" }}>{l}</span>
          {phase ? <span className="pill warn">{phase}</span> : <ChevronRight size={18} />}
        </button>
      ))}
    </>
  );
}

function PF_02() {
  const { go, toast, set, reset } = useApp();
  const [push, setPush] = useState(true);
  const rows = ["Privacidad", "Idioma", "Seguridad", "Términos y condiciones", "Centro de ayuda"];
  return (
    <>
      <Top title="Configuración" />
      <button className="listitem" onClick={() => go("PF_03")}><Pencil size={18} /><span style={{ flex: 1 }}>Editar perfil</span><ChevronRight size={18} /></button>
      <div className="listitem"><Bell size={18} /><span style={{ flex: 1 }}>Notificaciones</span><button className={"switch" + (push ? " on" : "")} onClick={() => setPush(!push)} /></div>
      {rows.map((r) => (
        <button key={r} className="listitem" onClick={() => toast(`${r}: sin definir (decisión 13 del Resumen)`)}>
          <span style={{ width: 18 }} /><span style={{ flex: 1 }}>{r}</span><span className="pill warn">por definir</span>
        </button>
      ))}
      <button className="listitem" onClick={() => toast("Eliminar cuenta (PF_11) es de Lanzamiento")}><X size={18} color="var(--bad)" /><span style={{ flex: 1, color: "var(--bad)" }}>Eliminar cuenta</span><span className="pill warn">Lanzamiento</span></button>
      <button className="listitem" onClick={() => { set({ user: null, invite: false }); reset("AU_01"); }}><LogOut size={18} /><span style={{ flex: 1 }}>Cerrar sesión</span></button>
    </>
  );
}

function PF_03() {
  const { state, set, back, toast } = useApp();
  const u = state.user || {};
  const [f, setF] = useState({ name: u.name || "", bio: u.bio || "", isPublic: u.isPublic !== false });
  const [saving, setSaving] = useState(false);
  const save = () => {
    setSaving(true);
    setTimeout(() => { set({ user: { ...u, ...f } }); setSaving(false); toast("Perfil guardado"); back(); }, 700);
  };
  return (
    <>
      <Top title="Editar perfil" />
      <div className="pad">
        <div style={{ display: "grid", placeItems: "center", marginBottom: 16 }}>
          <div className="avatar" style={{ background: "#5b4bff", width: 84, height: 84, fontSize: 28 }}>{initials(f.name || "Tú")}</div>
          <button className="muted" style={{ marginTop: 6, color: "var(--brand)" }} onClick={() => toast("Subir foto: no funciona en el prototipo")}>Cambiar foto</button>
        </div>
        <label className="field">Nombre<input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
        <label className="field">Bio<textarea rows={3} value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} placeholder="Cuéntale a otros qué te gusta hacer" /></label>
        <div className="card row">
          <div style={{ flex: 1 }}>
            <b style={{ fontSize: 14 }}>Perfil {f.isPublic ? "público" : "privado"}</b>
            <div className="muted">{f.isPublic ? "Cualquiera puede ver tu perfil completo." : "Quien no te conoce solo ve tu nombre y foto."}</div>
          </div>
          <button className={"switch" + (f.isPublic ? " on" : "")} onClick={() => setF({ ...f, isPublic: !f.isPublic })} aria-label="Perfil público" />
        </div>
      </div>
      <div className="sticky-cta"><button className="btn btn-primary" disabled={saving} onClick={save}>{saving ? "Guardando…" : "Guardar"}</button></div>
    </>
  );
}

/* ---------- pestañas fuera de la beta ---------- */

function CREAR() {
  return (
    <>
      <HomeHeader title="Crear" />
      <div className="pad col">
        <OutOfBeta id="EV_01 a EV_09" name="Crear evento" />
        <p className="muted">En la beta cerrada el equipo crea los eventos desde un panel interno (decisión 27). La pestaña existe en la barra para que la estructura sea la definitiva.</p>
      </div>
    </>
  );
}

function CHATS() {
  return (
    <>
      <HomeHeader title="Chats" />
      <div className="pad col">
        <OutOfBeta id="CH_01 y CH_03" name="Chats" />
        <p className="muted">La lista de chats y el chat de grupo son de Lanzamiento; el chat individual (CH_02), de Después.</p>
      </div>
    </>
  );
}

export const SCREENS = {
  AU_01, AU_02, AU_03, AU_04, AU_05,
  IN_01, IN_02, LU_00, LU_01,
  EX_02, EX_03,
  GR_01, GR_02, GR_03, GR_04,
  PF_01, PF_02, PF_03,
  LINK, CREAR, CHATS,
};
