"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ============================================================
// ⚙️ PARTIDOS — EDITA AQUÍ FECHAS Y HORAS
// ============================================================
const MATCH_SCHEDULE = {
  "A_0": { date: "2026-06-11", time: "20:00" }, "A_1": { date: "2026-06-11", time: "23:00" },
  "A_2": { date: "2026-06-12", time: "17:00" }, "A_3": { date: "2026-06-12", time: "20:00" },
  "A_4": { date: "2026-06-12", time: "23:00" }, "A_5": { date: "2026-06-13", time: "20:00" },
  "B_0": { date: "2026-06-12", time: "17:00" }, "B_1": { date: "2026-06-12", time: "20:00" },
  "B_2": { date: "2026-06-12", time: "23:00" }, "B_3": { date: "2026-06-13", time: "17:00" },
  "B_4": { date: "2026-06-13", time: "20:00" }, "B_5": { date: "2026-06-14", time: "20:00" },
  "C_0": { date: "2026-06-13", time: "17:00" }, "C_1": { date: "2026-06-13", time: "23:00" },
  "C_2": { date: "2026-06-14", time: "17:00" }, "C_3": { date: "2026-06-14", time: "20:00" },
  "C_4": { date: "2026-06-14", time: "23:00" }, "C_5": { date: "2026-06-15", time: "20:00" },
  "D_0": { date: "2026-06-14", time: "17:00" }, "D_1": { date: "2026-06-15", time: "17:00" },
  "D_2": { date: "2026-06-15", time: "20:00" }, "D_3": { date: "2026-06-15", time: "23:00" },
  "D_4": { date: "2026-06-16", time: "17:00" }, "D_5": { date: "2026-06-16", time: "20:00" },
  "E_0": { date: "2026-06-15", time: "17:00" }, "E_1": { date: "2026-06-16", time: "17:00" },
  "E_2": { date: "2026-06-16", time: "23:00" }, "E_3": { date: "2026-06-17", time: "17:00" },
  "E_4": { date: "2026-06-17", time: "20:00" }, "E_5": { date: "2026-06-17", time: "23:00" },
  "F_0": { date: "2026-06-16", time: "17:00" }, "F_1": { date: "2026-06-17", time: "17:00" },
  "F_2": { date: "2026-06-18", time: "17:00" }, "F_3": { date: "2026-06-18", time: "20:00" },
  "F_4": { date: "2026-06-18", time: "23:00" }, "F_5": { date: "2026-06-19", time: "20:00" },
  "G_0": { date: "2026-06-17", time: "17:00" }, "G_1": { date: "2026-06-18", time: "17:00" },
  "G_2": { date: "2026-06-19", time: "17:00" }, "G_3": { date: "2026-06-19", time: "20:00" },
  "G_4": { date: "2026-06-19", time: "23:00" }, "G_5": { date: "2026-06-20", time: "20:00" },
  "H_0": { date: "2026-06-18", time: "17:00" }, "H_1": { date: "2026-06-19", time: "17:00" },
  "H_2": { date: "2026-06-20", time: "17:00" }, "H_3": { date: "2026-06-20", time: "20:00" },
  "H_4": { date: "2026-06-20", time: "23:00" }, "H_5": { date: "2026-06-21", time: "20:00" },
  "I_0": { date: "2026-06-19", time: "17:00" }, "I_1": { date: "2026-06-20", time: "17:00" },
  "I_2": { date: "2026-06-21", time: "17:00" }, "I_3": { date: "2026-06-21", time: "20:00" },
  "I_4": { date: "2026-06-21", time: "23:00" }, "I_5": { date: "2026-06-22", time: "20:00" },
  "J_0": { date: "2026-06-20", time: "17:00" }, "J_1": { date: "2026-06-21", time: "17:00" },
  "J_2": { date: "2026-06-22", time: "17:00" }, "J_3": { date: "2026-06-22", time: "20:00" },
  "J_4": { date: "2026-06-22", time: "23:00" }, "J_5": { date: "2026-06-23", time: "20:00" },
  "K_0": { date: "2026-06-21", time: "17:00" }, "K_1": { date: "2026-06-22", time: "17:00" },
  "K_2": { date: "2026-06-23", time: "17:00" }, "K_3": { date: "2026-06-23", time: "20:00" },
  "K_4": { date: "2026-06-23", time: "23:00" }, "K_5": { date: "2026-06-24", time: "20:00" },
  "L_0": { date: "2026-06-22", time: "17:00" }, "L_1": { date: "2026-06-23", time: "17:00" },
  "L_2": { date: "2026-06-24", time: "17:00" }, "L_3": { date: "2026-06-24", time: "20:00" },
  "L_4": { date: "2026-06-24", time: "23:00" }, "L_5": { date: "2026-06-25", time: "20:00" },
};

// ============================================================
// ⚙️ GRUPOS — EDITA AQUÍ EQUIPOS Y BANDERAS
// ============================================================
const GROUPS = {
  A: [{ name: "México", flag: "🇲🇽" }, { name: "Corea del Sur", flag: "🇰🇷" }, { name: "Sudáfrica", flag: "🇿🇦" }, { name: "Playoff UEFA D", flag: "🏳️" }],
  B: [{ name: "Canadá", flag: "🇨🇦" }, { name: "Suiza", flag: "🇨🇭" }, { name: "Qatar", flag: "🇶🇦" }, { name: "Playoff UEFA A", flag: "🏳️" }],
  C: [{ name: "Brasil", flag: "🇧🇷" }, { name: "Marruecos", flag: "🇲🇦" }, { name: "Escocia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" }, { name: "Haití", flag: "🇭🇹" }],
  D: [{ name: "Estados Unidos", flag: "🇺🇸" }, { name: "Paraguay", flag: "🇵🇾" }, { name: "Australia", flag: "🇦🇺" }, { name: "Playoff UEFA C", flag: "🏳️" }],
  E: [{ name: "Alemania", flag: "🇩🇪" }, { name: "Ecuador", flag: "🇪🇨" }, { name: "Costa de Marfil", flag: "🇨🇮" }, { name: "Curazao", flag: "🇨🇼" }],
  F: [{ name: "Países Bajos", flag: "🇳🇱" }, { name: "Japón", flag: "🇯🇵" }, { name: "Túnez", flag: "🇹🇳" }, { name: "Playoff UEFA B", flag: "🏳️" }],
  G: [{ name: "Bélgica", flag: "🇧🇪" }, { name: "Egipto", flag: "🇪🇬" }, { name: "Irán", flag: "🇮🇷" }, { name: "Nueva Zelanda", flag: "🇳🇿" }],
  H: [{ name: "España", flag: "🇪🇸" }, { name: "Cabo Verde", flag: "🇨🇻" }, { name: "Arabia Saudí", flag: "🇸🇦" }, { name: "Uruguay", flag: "🇺🇾" }],
  I: [{ name: "Francia", flag: "🇫🇷" }, { name: "Senegal", flag: "🇸🇳" }, { name: "Noruega", flag: "🇳🇴" }, { name: "Playoff FIFA 1", flag: "🏳️" }],
  J: [{ name: "Argentina", flag: "🇦🇷" }, { name: "Panamá", flag: "🇵🇦" }, { name: "Argelia", flag: "🇩🇿" }, { name: "Playoff FIFA 2", flag: "🏳️" }],
  K: [{ name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" }, { name: "Colombia", flag: "🇨🇴" }, { name: "Uzbekistán", flag: "🇺🇿" }, { name: "Jordania", flag: "🇯🇴" }],
  L: [{ name: "Portugal", flag: "🇵🇹" }, { name: "Croacia", flag: "🇭🇷" }, { name: "Ghana", flag: "🇬🇭" }, { name: "Austria", flag: "🇦🇹" }],
};

const TOTAL_MATCHES = 72;

function generateGroupMatches() {
  const matches = [];
  let globalId = 1;
  Object.entries(GROUPS).forEach(([group, teams]) => {
    let localIdx = 0;
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const sk = `${group}_${localIdx}`;
        const sc = MATCH_SCHEDULE[sk] || { date: "2026-06-11", time: "20:00" };
        matches.push({
          id: `wc26_g${String(globalId++).padStart(3, "0")}`,
          grp: group, home: teams[i].name, away: teams[j].name,
          competition: `Grupo ${group} · Mundial 2026`,
          match_date: sc.date, match_time: sc.time,
          status: "open", result_home: null, result_away: null,
        });
        localIdx++;
      }
    }
  });
  return matches;
}

const ALL_MATCHES = generateGroupMatches();

function getTeam(name) {
  return Object.values(GROUPS).flat().find(t => t.name === name) || { name, flag: "🏳️" };
}

function calcPoints(pred, rh, ra) {
  if (pred.predicted_home === rh && pred.predicted_away === ra) return 3;
  const ps = pred.predicted_home > pred.predicted_away ? "H" : pred.predicted_home < pred.predicted_away ? "A" : "D";
  const rs = rh > ra ? "H" : rh < ra ? "A" : "D";
  return ps === rs ? 1 : 0;
}

function calcPersonalStandings(group, matches, predMap) {
  const teams = GROUPS[group].map(t => ({ ...t, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 }));
  const map = {};
  teams.forEach(t => { map[t.name] = t; });
  matches.filter(m => m.grp === group).forEach(m => {
    const pred = predMap[m.id];
    if (!pred || pred.predicted_home === null || pred.predicted_away === null) return;
    const ph = pred.predicted_home, pa = pred.predicted_away;
    const h = map[m.home], a = map[m.away];
    if (!h || !a) return;
    h.pj++; a.pj++;
    h.gf += ph; h.gc += pa; a.gf += pa; a.gc += ph;
    h.dg = h.gf - h.gc; a.dg = a.gf - a.gc;
    if (ph > pa) { h.pg++; h.pts += 3; a.pp++; }
    else if (ph < pa) { a.pg++; a.pts += 3; h.pp++; }
    else { h.pe++; h.pts++; a.pe++; a.pts++; }
  });
  return teams.sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf);
}

function calcRealStandings(group, matches) {
  const teams = GROUPS[group].map(t => ({ ...t, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 }));
  const map = {};
  teams.forEach(t => { map[t.name] = t; });
  matches.filter(m => m.grp === group && m.result_home !== null).forEach(m => {
    const h = map[m.home], a = map[m.away];
    if (!h || !a) return;
    h.pj++; a.pj++;
    h.gf += m.result_home; h.gc += m.result_away;
    a.gf += m.result_away; a.gc += m.result_home;
    h.dg = h.gf - h.gc; a.dg = a.gf - a.gc;
    if (m.result_home > m.result_away) { h.pg++; h.pts += 3; a.pp++; }
    else if (m.result_home < m.result_away) { a.pg++; a.pts += 3; h.pp++; }
    else { h.pe++; h.pts++; a.pe++; a.pts++; }
  });
  return teams.sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf);
}

function formatDate(d) {
  if (!d) return "";
  const [, m, day] = d.split("-");
  return `${parseInt(day)} ${["", "ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"][parseInt(m)]}`;
}

// ============================================================
// CUENTA ATRÁS
// ============================================================
const KICKOFF = new Date("2026-06-11T20:00:00+02:00").getTime();
function useCountdown() {
  const [time, setTime] = useState(() => Math.max(0, KICKOFF - Date.now()));
  useEffect(() => {
    const t = setInterval(() => setTime(Math.max(0, KICKOFF - Date.now())), 1000);
    return () => clearInterval(t);
  }, []);
  const pad = n => String(n).padStart(2, "0");
  return { d: Math.floor(time / 86400000), h: pad(Math.floor((time % 86400000) / 3600000)), m: pad(Math.floor((time % 3600000) / 60000)), s: pad(Math.floor((time % 60000) / 1000)), started: time === 0 };
}

// ============================================================
// TEMA
// ============================================================
const GREEN = "#00e676";
const GREEN_DIM = "rgba(0,230,118,0.12)";
const DARK = "#0a0a0a";
const CARD = "rgba(255,255,255,0.03)";
const BORDER = "rgba(255,255,255,0.07)";
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}body{background:#0a0a0a;}
  ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:#0a0a0a;}::-webkit-scrollbar-thumb{background:#222;border-radius:2px;}
  input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
`;
const inputSt = { width: "100%", padding: "12px 14px", marginBottom: "12px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", background: "rgba(0,0,0,0.4)", color: "#f0f0f0", fontSize: "16px", fontFamily: "monospace", outline: "none" };
const smallSt = { padding: "8px 4px", border: "1px solid rgba(0,230,118,0.3)", borderRadius: "6px", background: "rgba(0,0,0,0.4)", color: GREEN, fontSize: "20px", fontFamily: "'Bebas Neue', monospace", outline: "none", textAlign: "center", width: "48px" };

function Stars() {
  const s = Array.from({ length: 40 }, (_, i) => ({ i, sz: Math.random() * 2 + 1, t: Math.random() * 100, l: Math.random() * 100, o: Math.random() * 0.35 + 0.08, dur: Math.random() * 3 + 2, dl: Math.random() * 3 }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {s.map(x => <div key={x.i} style={{ position: "absolute", width: x.sz + "px", height: x.sz + "px", background: "white", borderRadius: "50%", top: x.t + "%", left: x.l + "%", opacity: x.o, animation: `pulse ${x.dur}s ease-in-out infinite`, animationDelay: x.dl + "s" }} />)}
    </div>
  );
}

// ============================================================
// LOGIN
// ============================================================
function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [name, setName] = useState("");
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const go = async () => {
    setError(""); setLoading(true);
    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { setError("Email o contraseña incorrectos"); return; }
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
        onLogin({ ...data.user, name: profile?.name || email, role: profile?.role || "user" });
      } else {
        if (!name || !email || !password) { setError("Rellena todos los campos"); return; }
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) { setError(error.message); return; }
        await supabase.from("profiles").insert({ id: data.user.id, name, role: "user" });
        onLogin({ ...data.user, name, role: "user" });
      }
    } finally { setLoading(false); }
  };
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", position: "relative", zIndex: 1 }}>
      <div style={{ width: "100%", maxWidth: "400px", animation: "fadeIn 0.4s ease" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(34px,9vw,52px)", letterSpacing: "4px", color: "#f0f0f0", lineHeight: 1 }}>PORRA <span style={{ color: GREEN }}>VALLAU</span></div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(18px,5vw,26px)", letterSpacing: "6px", color: "#999", marginTop: "2px" }}>MUNDIAL 2026</div>
          <div style={{ fontSize: "10px", color: "#888", letterSpacing: "3px", fontFamily: "monospace", marginTop: "6px" }}>USA · CANADA · MEXICO</div>
        </div>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "24px" }}>
          <div style={{ display: "flex", marginBottom: "20px", background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "3px" }}>
            {["login", "register"].map(m => <button key={m} onClick={() => { setMode(m); setError(""); }} style={{ flex: 1, padding: "10px", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "11px", letterSpacing: "2px", fontFamily: "monospace", textTransform: "uppercase", background: mode === m ? GREEN : "transparent", color: mode === m ? "#0a0a0a" : "#aaa", fontWeight: 700 }}>{m === "login" ? "Entrar" : "Registro"}</button>)}
          </div>
          {mode === "register" && <input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" style={inputSt} />}
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" style={inputSt} />
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" type="password" style={inputSt} onKeyDown={e => e.key === "Enter" && go()} />
          {error && <p style={{ color: "#ff5252", fontSize: "13px", marginBottom: "12px", fontFamily: "monospace" }}>⚠ {error}</p>}
          <button onClick={go} disabled={loading} style={{ width: "100%", padding: "14px", border: "none", borderRadius: "8px", cursor: "pointer", background: loading ? "#111" : `linear-gradient(135deg,${GREEN},#00b0ff)`, color: "#0a0a0a", fontWeight: 800, fontSize: "13px", letterSpacing: "3px", fontFamily: "monospace", textTransform: "uppercase" }}>{loading ? "..." : mode === "login" ? "⚡ ENTRAR" : "🚀 REGISTRARME"}</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COUNTDOWN BANNER
// ============================================================
function CountdownBanner() {
  const { d, h, m, s, started } = useCountdown();
  if (started) return <div style={{ background: GREEN_DIM, border: "1px solid rgba(0,230,118,0.25)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", textAlign: "center" }}><span style={{ color: GREEN, fontFamily: "monospace", fontSize: "13px", letterSpacing: "2px" }}>⚽ ¡EL MUNDIAL HA COMENZADO!</span></div>;
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
      <p style={{ color: "#999", fontFamily: "monospace", fontSize: "9px", letterSpacing: "3px", textAlign: "center", marginBottom: "12px" }}>⏱ FALTAN · 11 JUN 2026 · 20:00H</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
        {[{ v: d, l: "DÍAS" }, { v: h, l: "HORAS" }, { v: m, l: "MIN" }, { v: s, l: "SEG" }].map(({ v, l }) => (
          <div key={l} style={{ textAlign: "center", flex: 1, maxWidth: "70px" }}>
            <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,230,118,0.2)", borderRadius: "8px", padding: "8px 4px" }}>
              <span style={{ fontFamily: "'Bebas Neue', monospace", fontSize: "clamp(22px,6vw,32px)", color: GREEN, lineHeight: 1, display: "block" }}>{v}</span>
            </div>
            <span style={{ fontSize: "8px", color: "#999", fontFamily: "monospace", marginTop: "4px", display: "block" }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// BARRA DE PROGRESO
// ============================================================
function ProgressBar({ predictions, matches }) {
  const open = matches.filter(m => m.status === "open").length;
  const sent = predictions.length;
  const pct = Math.round((sent / TOTAL_MATCHES) * 100);
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px 14px", marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#555", letterSpacing: "2px" }}>TUS PRONÓSTICOS</span>
        <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", color: sent === TOTAL_MATCHES ? GREEN : "#888" }}>{sent}/{TOTAL_MATCHES}</span>
      </div>
      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: pct + "%", background: `linear-gradient(90deg,${GREEN},#00b0ff)`, borderRadius: "4px", transition: "width 0.5s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
        <span style={{ fontSize: "9px", color: "#999", fontFamily: "monospace" }}>{pct}% completado</span>
        {open > 0 && <span style={{ fontSize: "9px", color: "#aaa", fontFamily: "monospace" }}>{TOTAL_MATCHES - sent} por enviar</span>}
      </div>
    </div>
  );
}

// ============================================================
// NAVBAR
// ============================================================
function NavBar({ user, view, setView, onLogout }) {
  // Definimos el orden de las pestañas según el rol
  const tabs = user.role === "admin"
    ? [
        { id: "groups", icon: "⚽", label: "Grupos" }, 
        { id: "community", icon: "👥", label: "Todos los pronósticos" }, 
        { id: "ranking", icon: "🏆", label: "Ranking" },
        { id: "results", icon: "📊", label: "Resultados" }, 
        { id: "admin", icon: "⚙️", label: "Admin" }
      ]
    : [
        { id: "groups", icon: "⚽", label: "Grupos" }, 
        { id: "community", icon: "👥", label: "Todos los pronósticos" }, 
        { id: "ranking", icon: "🏆", label: "Ranking" },
        { id: "results", icon: "📊", label: "Resultados" }, 
        { id: "profile", icon: "👤", label: "Perfil" }
      ];

  return (
    <>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,10,10,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 14px", display: "flex", alignItems: "center", height: "50px" }}>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", letterSpacing: "2px", color: "#f0f0f0", flex: 1 }}>PORRA <span style={{ color: GREEN }}>VALLAU</span></span>
          <span style={{ fontSize: "11px", color: "#999", fontFamily: "monospace", marginRight: "10px" }}>{user.name?.split(" ")[0]}</span>
          <button onClick={onLogout} style={{ padding: "5px 10px", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", background: "transparent", color: "#aaa", cursor: "pointer", fontSize: "11px", fontFamily: "monospace" }}>salir</button>
        </div>
      </div>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,10,10,0.97)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", display: "flex" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setView(t.id)} style={{ flex: 1, padding: "11px 2px 9px", border: "none", cursor: "pointer", background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", borderTop: view === t.id ? `2px solid ${GREEN}` : "2px solid transparent" }}>
              <span style={{ fontSize: "17px", lineHeight: 1 }}>{t.icon}</span>
              <span style={{ fontSize: "7px", fontFamily: "monospace", color: view === t.id ? GREEN : "#999", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center" }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ============================================================
// TABLA CLASIFICACIÓN
// ============================================================
function StandingTable({ standings }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 28px 28px 28px 36px", gap: "1px", padding: "3px 8px 4px" }}>
        {["EQUIPO", "PJ", "GF", "GC", "PTS"].map(c => <span key={c} style={{ fontSize: "9px", color: "#999", fontFamily: "monospace", letterSpacing: "1px", textAlign: c === "EQUIPO" ? "left" : "center" }}>{c}</span>)}
      </div>
      {standings.map((t, i) => (
        <div key={t.name} style={{ display: "grid", gridTemplateColumns: "1fr 28px 28px 28px 36px", gap: "1px", padding: "8px", borderRadius: "7px", marginBottom: "3px", background: i < 2 ? GREEN_DIM : CARD, border: i < 2 ? "1px solid rgba(0,230,118,0.18)" : `1px solid ${BORDER}`, borderLeft: i < 2 ? `3px solid ${GREEN}` : "3px solid transparent" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden" }}>
            <span style={{ fontSize: "15px" }}>{t.flag}</span>
            <span style={{ fontSize: "11px", color: i < 2 ? "#f0f0f0" : "#555", fontFamily: "monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</span>
          </span>
          {[t.pj, t.gf, t.gc].map((v, vi) => <span key={vi} style={{ fontSize: "11px", color: "#aaa", fontFamily: "monospace", textAlign: "center" }}>{v}</span>)}
          <span style={{ fontSize: "14px", fontWeight: 700, color: GREEN, fontFamily: "'Bebas Neue', monospace", textAlign: "center" }}>{t.pts}</span>
        </div>
      ))}
      <p style={{ fontSize: "9px", color: "#888", fontFamily: "monospace", margin: "5px 0 0" }}>🟢 Los 2 primeros pasan a octavos</p>
    </div>
  );
}

// ============================================================
// PRONÓSTICO CLASIFICADOS POR GRUPO
// ============================================================
function QualifierPicker({ group, userId, locked }) {
  const teams = GROUPS[group];
  const [picks, setPicks] = useState([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("qualifier_picks").select("*").eq("user_id", userId).eq("grp", group).single();
      if (data) setPicks([data.pick1, data.pick2].filter(Boolean));
      setLoading(false);
    })();
  }, [group, userId]);

  const toggle = async (name) => {
    if (locked) return;
    let next;
    if (picks.includes(name)) next = picks.filter(p => p !== name);
    else if (picks.length < 2) next = [...picks, name];
    else next = [picks[1], name];
    setPicks(next);
    setSaved(false);
    const { error } = await supabase.from("qualifier_picks").upsert({ user_id: userId, grp: group, pick1: next[0] || null, pick2: next[1] || null }, { onConflict: "user_id,grp" });
    if (!error) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
  };

  if (loading) return null;

  return (
    <div style={{ marginTop: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <p style={{ fontSize: "9px", color: GREEN, fontFamily: "monospace", letterSpacing: "2px" }}>¿QUIÉN PASA DE GRUPO? (+2 PTS c/u)</p>
        {saved && <span style={{ fontSize: "9px", color: GREEN, fontFamily: "monospace" }}>✓</span>}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {teams.map(t => {
          const sel = picks.includes(t.name);
          return (
            <button key={t.name} onClick={() => toggle(t.name)} disabled={locked} style={{
              padding: "7px 10px", border: `1px solid ${sel ? GREEN : BORDER}`, borderRadius: "8px",
              background: sel ? GREEN_DIM : CARD, cursor: locked ? "default" : "pointer",
              display: "flex", alignItems: "center", gap: "5px", opacity: locked && !sel ? 0.4 : 1,
            }}>
              <span style={{ fontSize: "16px" }}>{t.flag}</span>
              <span style={{ fontSize: "11px", color: sel ? GREEN : "#666", fontFamily: "monospace" }}>{t.name}</span>
              {sel && <span style={{ fontSize: "10px", color: GREEN }}>✓</span>}
            </button>
          );
        })}
      </div>
      {!locked && <p style={{ fontSize: "9px", color: "#999", fontFamily: "monospace", marginTop: "6px" }}>Selecciona 2 equipos · {picks.length}/2</p>}
      {locked && <p style={{ fontSize: "9px", color: "#aaa", fontFamily: "monospace", marginTop: "6px" }}>Pronósticos cerrados</p>}
    </div>
  );
}

// ============================================================
// FILA DE PARTIDO
// ============================================================
function MatchRow({ match, userPred, user, onSaved, allClosed }) {
  const ht = getTeam(match.home), at = getTeam(match.away);
  const [ph, setPh] = useState(userPred?.predicted_home ?? "");
  const [pa, setPa] = useState(userPred?.predicted_away ?? "");
  const [status, setStatus] = useState(userPred ? "saved" : "idle");
  const timerRef = useRef(null);
  const isOpen = !allClosed && match.status === "open";
  const hasResult = match.result_home !== null && match.result_away !== null;
  const predPoints = userPred && hasResult ? calcPoints(userPred, match.result_home, match.result_away) : null;

  const save = useCallback(async (newPh, newPa) => {
    if (newPh === "" || newPa === "") return;
    setStatus("saving");
    const { error } = await supabase.from("predictions").upsert({ user_id: user.id, match_id: match.id, predicted_home: parseInt(newPh), predicted_away: parseInt(newPa), points: null }, { onConflict: "user_id,match_id" });
    if (error) { setStatus("error"); return; }
    setStatus("saved"); onSaved();
  }, [user.id, match.id, onSaved]);

  const handleChange = (field, val) => {
    const newPh = field === "h" ? val : ph, newPa = field === "a" ? val : pa;
    field === "h" ? setPh(val) : setPa(val);
    setStatus("typing");
    if (timerRef.current) clearTimeout(timerRef.current);
    if (newPh !== "" && newPa !== "") timerRef.current = setTimeout(() => save(newPh, newPa), 800);
  };

  const statusColor = status === "saved" ? GREEN : status === "saving" ? "#555" : status === "error" ? "#ff5252" : "#999";
  const statusText = status === "saved" ? "✓" : status === "saving" ? "···" : status === "error" ? "✗" : "";

  return (
    <div style={{ padding: "12px", borderRadius: "10px", marginBottom: "6px", background: CARD, border: `1px solid ${BORDER}` }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px", gap: "8px" }}>
        <span style={{ fontSize: "9px", color: "#999", fontFamily: "monospace" }}>📅 {formatDate(match.match_date)} · ⏰ {match.match_time || "??:??"}h</span>
        <span style={{ fontSize: "9px", fontFamily: "monospace", padding: "1px 6px", borderRadius: "6px", background: isOpen ? "rgba(0,200,100,0.08)" : "rgba(255,100,50,0.08)", color: isOpen ? "#00c864" : "#ff6432" }}>{isOpen ? "ABIERTO" : "CERRADO"}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
          <span style={{ fontSize: "11px", color: "#888", textAlign: "right", fontFamily: "monospace" }}>{match.home}</span>
          <span style={{ fontSize: "22px" }}>{ht.flag}</span>
        </div>
        {hasResult ? (
          <div style={{ minWidth: "64px", textAlign: "center" }}>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: GREEN }}>{match.result_home}</span>
            <span style={{ color: "#222", fontSize: "16px", margin: "0 3px" }}>-</span>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: GREEN }}>{match.result_away}</span>
          </div>
        ) : (
          <div style={{ minWidth: "44px", textAlign: "center" }}><span style={{ fontSize: "11px", color: "#222", fontFamily: "monospace", letterSpacing: "2px" }}>VS</span></div>
        )}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "22px" }}>{at.flag}</span>
          <span style={{ fontSize: "11px", color: "#888", fontFamily: "monospace" }}>{match.away}</span>
        </div>
      </div>
      {user.role !== "admin" && (
        <div style={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          {isOpen ? (
            <>
              <span style={{ fontSize: "10px", color: "#999", fontFamily: "monospace" }}>pronóst.:</span>
              <input value={ph} onChange={e => handleChange("h", e.target.value)} type="number" min="0" max="20" style={smallSt} placeholder="0" />
              <span style={{ color: "#222", fontSize: "16px" }}>-</span>
              <input value={pa} onChange={e => handleChange("a", e.target.value)} type="number" min="0" max="20" style={smallSt} placeholder="0" />
              <span style={{ fontSize: "13px", fontFamily: "monospace", color: statusColor, minWidth: "20px" }}>{statusText}</span>
            </>
          ) : userPred ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "11px", color: "#aaa", fontFamily: "monospace" }}>{userPred.predicted_home}-{userPred.predicted_away}</span>
              {predPoints !== null && <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontFamily: "monospace", fontWeight: 700, background: predPoints === 3 ? GREEN_DIM : predPoints === 1 ? "rgba(255,193,7,0.1)" : "rgba(255,82,82,0.08)", color: predPoints === 3 ? GREEN : predPoints === 1 ? "#ffc107" : "#ff5252" }}>{predPoints === 3 ? "🎯 +3" : predPoints === 1 ? "✓ +1" : "✗ +0"}</span>}
            </div>
          ) : (
            <span style={{ fontSize: "10px", color: "#888", fontFamily: "monospace" }}>cerrado · sin pronóstico</span>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// VISTA GRUPOS
// ============================================================
function GroupsView({ user, matches, predictions, onDataChange, allClosed }) {
  const [g, setG] = useState("A");
  const predMap = {};
  predictions.forEach(p => { predMap[p.match_id] = p; });
  const personalStandings = calcPersonalStandings(g, matches, predMap);
  const hasAnyPred = matches.filter(m => m.grp === g).some(m => predMap[m.id]);

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <CountdownBanner />
      <ProgressBar predictions={predictions} matches={matches} />
      <p style={{ fontSize: "9px", color: "#999", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "12px" }}>SELECCIONA GRUPO</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
        {Object.keys(GROUPS).map(gr => <button key={gr} onClick={() => setG(gr)} style={{ width: "40px", height: "40px", border: `1px solid ${g === gr ? GREEN : BORDER}`, borderRadius: "8px", cursor: "pointer", fontFamily: "'Bebas Neue', cursive", fontSize: "18px", background: g === gr ? GREEN_DIM : CARD, color: g === gr ? GREEN : "#aaa" }}>{gr}</button>)}
      </div>
      <div style={{ background: CARD, border: "1px solid rgba(0,230,118,0.1)", borderRadius: "12px", padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "7px", background: GREEN_DIM, border: "1px solid rgba(0,230,118,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: GREEN }}>{g}</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "17px", color: "#f0f0f0" }}>GRUPO {g}</div>
            <div style={{ display: "flex", gap: "5px", marginTop: "3px" }}>{GROUPS[g].map(t => <span key={t.name} style={{ fontSize: "15px" }} title={t.name}>{t.flag}</span>)}</div>
          </div>
        </div>
        <p style={{ fontSize: "9px", color: GREEN, fontFamily: "monospace", letterSpacing: "2px", marginBottom: "6px" }}>TU CLASIFICACIÓN</p>
        {!hasAnyPred && <p style={{ fontSize: "10px", color: "#999", fontFamily: "monospace", marginBottom: "8px" }}>Introduce pronósticos abajo para ver tu clasificación</p>}
        <StandingTable standings={personalStandings} />
        <QualifierPicker group={g} userId={user.id} locked={allClosed} />
        <div style={{ marginTop: "20px" }}>
          <p style={{ fontSize: "9px", color: "#999", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "10px" }}>PARTIDOS</p>
          {matches.filter(m => m.grp === g).map(m => <MatchRow key={m.id} match={m} userPred={predMap[m.id]} user={user} onSaved={onDataChange} allClosed={allClosed} />)}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// RESULTADOS REALES
// ============================================================
function ResultsView({ matches }) {
  const [g, setG] = useState("A");
  const played = matches.filter(m => m.grp === g && m.result_home !== null);
  const pending = matches.filter(m => m.grp === g && m.result_home === null);
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <p style={{ fontSize: "9px", color: "#999", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "12px" }}>RESULTADOS REALES</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
        {Object.keys(GROUPS).map(gr => <button key={gr} onClick={() => setG(gr)} style={{ width: "40px", height: "40px", border: `1px solid ${g === gr ? GREEN : BORDER}`, borderRadius: "8px", cursor: "pointer", fontFamily: "'Bebas Neue', cursive", fontSize: "18px", background: g === gr ? GREEN_DIM : CARD, color: g === gr ? GREEN : "#aaa" }}>{gr}</button>)}
      </div>
      <div style={{ background: CARD, border: "1px solid rgba(0,230,118,0.1)", borderRadius: "12px", padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "7px", background: GREEN_DIM, border: "1px solid rgba(0,230,118,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: GREEN }}>{g}</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "17px", color: "#f0f0f0" }}>GRUPO {g} — REAL</div>
            <div style={{ display: "flex", gap: "5px", marginTop: "3px" }}>{GROUPS[g].map(t => <span key={t.name} style={{ fontSize: "15px" }} title={t.name}>{t.flag}</span>)}</div>
          </div>
        </div>
        <StandingTable standings={calcRealStandings(g, matches)} />
        {played.length > 0 && (
          <div style={{ marginTop: "18px" }}>
            <p style={{ fontSize: "9px", color: GREEN, fontFamily: "monospace", letterSpacing: "3px", marginBottom: "8px" }}>JUGADOS</p>
            {played.map(m => {
              const ht = getTeam(m.home), at = getTeam(m.away);
              return (
                <div key={m.id} style={{ display: "flex", alignItems: "center", padding: "10px 12px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: "8px", marginBottom: "5px" }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "5px" }}>
                    <span style={{ fontSize: "11px", color: "#888", fontFamily: "monospace", textAlign: "right" }}>{m.home}</span>
                    <span style={{ fontSize: "20px" }}>{ht.flag}</span>
                  </div>
                  <div style={{ minWidth: "64px", textAlign: "center" }}>
                    <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: GREEN }}>{m.result_home}</span>
                    <span style={{ color: "#222", fontSize: "14px", margin: "0 3px" }}>-</span>
                    <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: GREEN }}>{m.result_away}</span>
                  </div>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "5px" }}>
                    <span style={{ fontSize: "20px" }}>{at.flag}</span>
                    <span style={{ fontSize: "11px", color: "#888", fontFamily: "monospace" }}>{m.away}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {pending.length > 0 && (
          <div style={{ marginTop: "16px" }}>
            <p style={{ fontSize: "9px", color: "#999", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "8px" }}>PENDIENTES</p>
            {pending.map(m => {
              const ht = getTeam(m.home), at = getTeam(m.away);
              return (
                <div key={m.id} style={{ padding: "10px 12px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: "8px", marginBottom: "5px", opacity: 0.5 }}>
                  <div style={{ textAlign: "center", fontSize: "9px", color: "#999", fontFamily: "monospace", marginBottom: "5px" }}>📅 {formatDate(m.match_date)} · {m.match_time}h</div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "5px" }}>
                      <span style={{ fontSize: "11px", color: "#666", fontFamily: "monospace" }}>{m.home}</span>
                      <span style={{ fontSize: "20px" }}>{ht.flag}</span>
                    </div>
                    <div style={{ minWidth: "44px", textAlign: "center" }}><span style={{ fontSize: "10px", color: "#222", fontFamily: "monospace", letterSpacing: "2px" }}>VS</span></div>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "5px" }}>
                      <span style={{ fontSize: "20px" }}>{at.flag}</span>
                      <span style={{ fontSize: "11px", color: "#666", fontFamily: "monospace" }}>{m.away}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// COMUNIDAD
// ============================================================
function CommunityView({ matches }) {
  const [viewMode, setViewMode] = useState("day");
  const [selectedDay, setSelectedDay] = useState(null);
  const [allPreds, setAllPreds] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: preds } = await supabase.from("predictions").select("*");
      const { data: profs } = await supabase.from("profiles").select("*");
      setAllPreds(preds || []); setProfiles(profs || []); setLoading(false);
    })();
  }, []);

  const getName = id => profiles.find(p => p.id === id)?.name || "Usuario";
  const days = [...new Set(matches.map(m => m.match_date))].sort();
  const closedMatches = matches.filter(m => m.status === "closed" || m.result_home !== null);
  const currentDay = selectedDay || days[0];
  const matchesByDay = day => closedMatches.filter(m => m.match_date === day);

  const renderMatchPreds = m => {
    const matchPreds = allPreds.filter(p => p.match_id === m.id);
    const ht = getTeam(m.home), at = getTeam(m.away);
    return (
      <div key={m.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px", marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "18px" }}>{ht.flag}</span>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "15px", color: "#f0f0f0" }}>{m.home}</span>
          {m.result_home !== null ? <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: GREEN }}>{m.result_home}-{m.result_away}</span> : <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#999" }}>vs</span>}
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "15px", color: "#f0f0f0" }}>{m.away}</span>
          <span style={{ fontSize: "18px" }}>{at.flag}</span>
        </div>
        {matchPreds.length === 0
          ? <p style={{ fontSize: "10px", color: "#888", fontFamily: "monospace", textAlign: "center" }}>Nadie ha enviado pronóstico</p>
          : matchPreds.map(pred => (
            <div key={pred.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 10px", background: "rgba(255,255,255,0.02)", borderRadius: "6px", marginBottom: "3px" }}>
              <span style={{ fontSize: "12px", color: "#888", fontFamily: "monospace", flex: 1 }}>{getName(pred.user_id)}</span>
              <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#aaa" }}>{pred.predicted_home}-{pred.predicted_away}</span>
              {pred.points !== null && pred.points !== undefined && <span style={{ padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontFamily: "monospace", fontWeight: 700, background: pred.points === 3 ? GREEN_DIM : pred.points === 1 ? "rgba(255,193,7,0.1)" : "rgba(255,82,82,0.08)", color: pred.points === 3 ? GREEN : pred.points === 1 ? "#ffc107" : "#ff5252" }}>{pred.points === 3 ? "🎯 +3" : pred.points === 1 ? "✓ +1" : "✗ +0"}</span>}
            </div>
          ))}
      </div>
    );
  };

  if (loading) return <p style={{ color: "#999", fontFamily: "monospace" }}>Cargando...</p>;
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <p style={{ fontSize: "9px", color: "#999", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "12px" }}>PRONÓSTICOS DE TODOS</p>
      <div style={{ display: "flex", marginBottom: "16px", background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "3px" }}>
        {[{ id: "day", label: "Por día" }, { id: "all", label: "Todos" }].map(opt => <button key={opt.id} onClick={() => setViewMode(opt.id)} style={{ flex: 1, padding: "9px", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "11px", letterSpacing: "2px", fontFamily: "monospace", textTransform: "uppercase", background: viewMode === opt.id ? GREEN : "transparent", color: viewMode === opt.id ? "#0a0a0a" : "#aaa", fontWeight: 700 }}>{opt.label}</button>)}
      </div>
      {viewMode === "day" && (
        <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "8px", marginBottom: "16px" }}>
          {days.map(day => {
            const hasClosed = closedMatches.some(m => m.match_date === day);
            return <button key={day} onClick={() => setSelectedDay(day)} disabled={!hasClosed} style={{ padding: "7px 12px", border: `1px solid ${currentDay === day ? GREEN : BORDER}`, borderRadius: "8px", cursor: hasClosed ? "pointer" : "default", whiteSpace: "nowrap", background: currentDay === day ? GREEN_DIM : CARD, color: currentDay === day ? GREEN : hasClosed ? "#666" : "#888", fontFamily: "monospace", fontSize: "11px", flexShrink: 0, opacity: hasClosed ? 1 : 0.4 }}>{formatDate(day)}</button>;
          })}
        </div>
      )}
      {viewMode === "day"
        ? matchesByDay(currentDay).length === 0 ? <p style={{ color: "#888", fontFamily: "monospace" }}>No hay partidos cerrados este día</p> : matchesByDay(currentDay).map(m => renderMatchPreds(m))
        : closedMatches.length === 0 ? <p style={{ color: "#888", fontFamily: "monospace" }}>Aún no hay partidos cerrados</p> : days.map(day => { const dm = matchesByDay(day); if (!dm.length) return null; return <div key={day} style={{ marginBottom: "20px" }}><p style={{ fontSize: "9px", color: GREEN, fontFamily: "monospace", letterSpacing: "3px", marginBottom: "10px" }}>📅 {formatDate(day)}</p>{dm.map(m => renderMatchPreds(m))}</div>; })
      }
    </div>
  );
}

// ============================================================
// PERFIL DE USUARIO
// ============================================================
function ProfileView({ user, matches }) {
  const [myPreds, setMyPreds] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [allPreds, setAllPreds] = useState([]);
  const [compareWith, setCompareWith] = useState(null);
  const [tab, setTab] = useState("stats");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: mp } = await supabase.from("predictions").select("*").eq("user_id", user.id);
      const { data: profs } = await supabase.from("profiles").select("*").eq("role", "user");
      const { data: ap } = await supabase.from("predictions").select("*");
      setMyPreds(mp || []); setProfiles(profs || []); setAllPreds(ap || []);
      setLoading(false);
    })();
  }, [user.id]);

  if (loading) return <p style={{ color: "#999", fontFamily: "monospace" }}>Cargando...</p>;

  const evaluated = myPreds.filter(p => p.points !== null);
  const total = evaluated.reduce((s, p) => s + p.points, 0);
  const exactos = evaluated.filter(p => p.points === 3).length;
  const parciales = evaluated.filter(p => p.points === 1).length;
  const fallos = evaluated.filter(p => p.points === 0).length;
  const pctExactos = evaluated.length ? Math.round((exactos / evaluated.length) * 100) : 0;

  // Mejor grupo
  const byGroup = {};
  Object.keys(GROUPS).forEach(g => { byGroup[g] = { pts: 0, count: 0 }; });
  evaluated.forEach(p => {
    const m = matches.find(x => x.id === p.match_id);
    if (m) { byGroup[m.grp].pts += p.points; byGroup[m.grp].count++; }
  });
  const bestGroup = Object.entries(byGroup).filter(([, v]) => v.count > 0).sort((a, b) => b[1].pts - a[1].pts)[0];

  // Comparativa
  const otherPreds = compareWith ? allPreds.filter(p => p.user_id === compareWith) : [];
  const otherEval = otherPreds.filter(p => p.points !== null);
  const otherTotal = otherEval.reduce((s, p) => s + p.points, 0);

  const commonMatches = matches.filter(m => {
    const mine = myPreds.find(p => p.match_id === m.id && p.points !== null);
    const theirs = otherPreds.find(p => p.match_id === m.id && p.points !== null);
    return mine && theirs;
  });

  const statCard = (label, value, sub, color = GREEN) => (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "14px 10px", textAlign: "center" }}>
      <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "9px", color: "#aaa", fontFamily: "monospace", marginTop: "3px", letterSpacing: "1px" }}>{label}</div>
      {sub && <div style={{ fontSize: "8px", color: "#999", fontFamily: "monospace", marginTop: "2px" }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: GREEN_DIM, border: `1px solid rgba(0,230,118,0.3)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: GREEN }}>{user.name?.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: "#f0f0f0", letterSpacing: "1px" }}>{user.name}</div>
          <div style={{ fontSize: "9px", color: "#aaa", fontFamily: "monospace" }}>{myPreds.length} pronósticos enviados · {evaluated.length} evaluados</div>
        </div>
      </div>

      <div style={{ display: "flex", marginBottom: "20px", background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "3px" }}>
        {[{ id: "stats", label: "Estadísticas" }, { id: "compare", label: "Comparar" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "9px", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "11px", letterSpacing: "2px", fontFamily: "monospace", textTransform: "uppercase", background: tab === t.id ? GREEN : "transparent", color: tab === t.id ? "#0a0a0a" : "#aaa", fontWeight: 700 }}>{t.label}</button>
        ))}
      </div>

      {tab === "stats" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>
            {statCard("PUNTOS", total)}
            {statCard("EXACTOS 🎯", exactos, `${pctExactos}% de éxito`)}
            {statCard("PARCIALES", parciales, null, "#ffc107")}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
            {statCard("FALLOS", fallos, null, "#ff5252")}
            {bestGroup ? statCard("MEJOR GRUPO", `Grupo ${bestGroup[0]}`, `${bestGroup[1].pts} pts`) : statCard("MEJOR GRUPO", "-")}
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "14px", marginBottom: "16px" }}>
            <p style={{ fontSize: "9px", color: "#aaa", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "12px" }}>DESGLOSE POR GRUPO</p>
            {Object.keys(GROUPS).map(grp => {
              const g = byGroup[grp];
              if (!g.count) return null;
              return (
                <div key={grp} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "14px", color: GREEN, minWidth: "20px" }}>{grp}</span>
                  <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: "3px", height: "5px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min(100, (g.pts / (g.count * 3)) * 100)}%`, background: GREEN, borderRadius: "3px" }} />
                  </div>
                  <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#888", minWidth: "40px", textAlign: "right" }}>{g.pts} pts</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === "compare" && (
        <>
          <p style={{ fontSize: "9px", color: "#aaa", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "10px" }}>COMPARA CON OTRO JUGADOR</p>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
            {profiles.filter(p => p.id !== user.id).map(p => (
              <button key={p.id} onClick={() => setCompareWith(compareWith === p.id ? null : p.id)} style={{ padding: "7px 12px", border: `1px solid ${compareWith === p.id ? GREEN : BORDER}`, borderRadius: "8px", background: compareWith === p.id ? GREEN_DIM : CARD, color: compareWith === p.id ? GREEN : "#666", fontFamily: "monospace", fontSize: "11px", cursor: "pointer" }}>{p.name}</button>
            ))}
          </div>

          {compareWith && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "8px", marginBottom: "16px", alignItems: "center" }}>
                <div style={{ background: GREEN_DIM, border: "1px solid rgba(0,230,118,0.2)", borderRadius: "10px", padding: "14px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: GREEN }}>{total}</div>
                  <div style={{ fontSize: "9px", color: "#555", fontFamily: "monospace" }}>{user.name?.split(" ")[0]}</div>
                </div>
                <div style={{ textAlign: "center", fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#999" }}>VS</div>
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "14px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: "#aaa" }}>{otherTotal}</div>
                  <div style={{ fontSize: "9px", color: "#555", fontFamily: "monospace" }}>{profiles.find(p => p.id === compareWith)?.name?.split(" ")[0]}</div>
                </div>
              </div>

              {commonMatches.length === 0
                ? <p style={{ color: "#888", fontFamily: "monospace", fontSize: "12px" }}>Aún no hay partidos evaluados en común</p>
                : commonMatches.slice(0, 20).map(m => {
                  const mine = myPreds.find(p => p.match_id === m.id);
                  const theirs = otherPreds.find(p => p.match_id === m.id);
                  const ht = getTeam(m.home), at = getTeam(m.away);
                  return (
                    <div key={m.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "8px", padding: "10px 12px", marginBottom: "5px" }}>
                      <div style={{ fontSize: "10px", color: "#555", fontFamily: "monospace", textAlign: "center", marginBottom: "6px" }}>{ht.flag} {m.home} vs {at.flag} {m.away} · <span style={{ color: GREEN }}>{m.result_home}-{m.result_away}</span></div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ textAlign: "left" }}>
                          <span style={{ fontFamily: "monospace", fontSize: "13px", color: "#aaa" }}>{mine?.predicted_home}-{mine?.predicted_away}</span>
                          {mine?.points !== null && <span style={{ marginLeft: "6px", fontSize: "11px", color: mine?.points === 3 ? GREEN : mine?.points === 1 ? "#ffc107" : "#ff5252" }}>{mine?.points === 3 ? "🎯+3" : mine?.points === 1 ? "✓+1" : "✗+0"}</span>}
                        </div>
                        <div style={{ textAlign: "right" }}>
                          {theirs?.points !== null && <span style={{ marginRight: "6px", fontSize: "11px", color: theirs?.points === 3 ? GREEN : theirs?.points === 1 ? "#ffc107" : "#ff5252" }}>{theirs?.points === 3 ? "🎯+3" : theirs?.points === 1 ? "✓+1" : "✗+0"}</span>}
                          <span style={{ fontFamily: "monospace", fontSize: "13px", color: "#aaa" }}>{theirs?.predicted_home}-{theirs?.predicted_away}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </>
      )}
    </div>
  );
}

// ============================================================
// RANKING
// ============================================================
function RankingView() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const { data: profiles } = await supabase.from("profiles").select("*").eq("role", "user");
      const { data: preds } = await supabase.from("predictions").select("*");
      const { data: qpicks } = await supabase.from("qualifier_picks").select("*");
      const r = (profiles || []).map(p => {
        const myPreds = (preds || []).filter(x => x.user_id === p.id && x.points !== null);
        const myPicks = (qpicks || []).filter(x => x.user_id === p.id);
        const qualPts = myPicks.reduce((s, pick) => {
          let pts = 0;
          // +2 por cada clasificado acertado (si hay resultado real marcado)
          // Aquí simplemente sumamos los qualifier_points si los tiene
          return s + (pick.points || 0);
        }, 0);
        return {
          ...p,
          total: myPreds.reduce((s, x) => s + (x.points || 0), 0) + qualPts,
          exactos: myPreds.filter(x => x.points === 3).length,
          count: myPreds.length,
          qualPts,
        };
      }).sort((a, b) => b.total - a.total);
      setRanking(r); setLoading(false);
    })();
  }, []);
  const medals = ["🥇", "🥈", "🥉"];
  if (loading) return <p style={{ color: "#999", fontFamily: "monospace" }}>Cargando...</p>;
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <p style={{ fontSize: "9px", color: "#999", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "16px" }}>RANKING GENERAL</p>
      {ranking.map((u, i) => (
        <div key={u.id} style={{ display: "flex", alignItems: "center", gap: "12px", background: i === 0 ? GREEN_DIM : CARD, border: i === 0 ? "1px solid rgba(0,230,118,0.2)" : `1px solid ${BORDER}`, borderRadius: "10px", padding: "14px 16px", marginBottom: "6px" }}>
          <span style={{ fontSize: "20px", minWidth: "28px" }}>{medals[i] || `#${i + 1}`}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "monospace", fontSize: "14px", color: "#f0f0f0" }}>{u.name}</div>
            <div style={{ fontSize: "9px", color: "#999", fontFamily: "monospace", marginTop: "2px" }}>{u.exactos} exactos · {u.count} eval. {u.qualPts > 0 ? `· +${u.qualPts} clasificados` : ""}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "30px", color: i === 0 ? GREEN : "#f0f0f0", lineHeight: 1 }}>{u.total}</div>
            <div style={{ fontSize: "9px", color: "#999", fontFamily: "monospace" }}>PTS</div>
          </div>
        </div>
      ))}
      <div style={{ marginTop: "16px", padding: "12px 14px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: "8px" }}>
        <p style={{ color: "#888", fontFamily: "monospace", fontSize: "10px", lineHeight: 2 }}>
          <span style={{ color: GREEN }}>+3</span> exacto · <span style={{ color: "#ffc107" }}>+1</span> signo · <span style={{ color: "#ff5252" }}>+0</span> fallo · <span style={{ color: GREEN }}>+2</span> clasificado acertado
        </p>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN
// ============================================================
function AdminView({ matches, onDataChange }) {
  const [g, setG] = useState("A");
  const [sel, setSel] = useState(null);
  const [hr, setHr] = useState(""); const [ar, setAr] = useState("");
  const [saved, setSaved] = useState(false);
  const [closingAll, setClosingAll] = useState(false);
  const [allClosed, setAllClosed] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  useEffect(() => {
    setAllClosed(matches.length > 0 && matches.every(m => m.status === "closed"));
  }, [matches]);

  const closeAll = async () => {
    setClosingAll(true);
    const ids = matches.filter(m => m.status === "open").map(m => m.id);
    for (const id of ids) await supabase.from("matches").update({ status: "closed" }).eq("id", id);
    setClosingAll(false); setConfirmClose(false);
    onDataChange();
  };

  const handleResult = async () => {
    if (hr === "" || ar === "") return;
    const rh = parseInt(hr), ra = parseInt(ar);
    await supabase.from("matches").update({ result_home: rh, result_away: ra, status: "closed" }).eq("id", sel);
    const { data: preds } = await supabase.from("predictions").select("*").eq("match_id", sel);
    for (const pred of (preds || [])) await supabase.from("predictions").update({ points: calcPoints(pred, rh, ra) }).eq("id", pred.id);
    setSaved(true); setSel(null); setHr(""); setAr(""); onDataChange();
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleStatus = async m => {
    await supabase.from("matches").update({ status: m.status === "open" ? "closed" : "open" }).eq("id", m.id);
    onDataChange();
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <p style={{ fontSize: "9px", color: "#999", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "16px" }}>PANEL DE ADMINISTRACIÓN</p>

      {/* BOTÓN CERRAR TODO */}
      <div style={{ background: CARD, border: "1px solid rgba(255,82,82,0.2)", borderRadius: "10px", padding: "14px", marginBottom: "20px" }}>
        <p style={{ fontSize: "10px", color: "#888", fontFamily: "monospace", marginBottom: "10px" }}>
          🔒 Cierra todos los pronósticos de golpe al inicio del torneo. Una vez cerrado, los usuarios no podrán modificar sus pronósticos.
        </p>
        {allClosed
          ? <div style={{ padding: "10px", background: "rgba(255,82,82,0.08)", borderRadius: "7px", textAlign: "center" }}><span style={{ color: "#ff6432", fontFamily: "monospace", fontSize: "12px" }}>🔒 TODOS LOS PRONÓSTICOS ESTÁN CERRADOS</span></div>
          : confirmClose
            ? <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={closeAll} disabled={closingAll} style={{ flex: 1, padding: "12px", border: "none", borderRadius: "7px", background: "#ff5252", color: "white", fontFamily: "monospace", fontSize: "12px", cursor: "pointer", fontWeight: 700 }}>{closingAll ? "Cerrando..." : "⚠️ SÍ, CERRAR TODO"}</button>
              <button onClick={() => setConfirmClose(false)} style={{ padding: "12px 16px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#555", fontFamily: "monospace", fontSize: "12px", cursor: "pointer" }}>Cancelar</button>
            </div>
            : <button onClick={() => setConfirmClose(true)} style={{ width: "100%", padding: "12px", border: "1px solid rgba(255,82,82,0.3)", borderRadius: "7px", background: "rgba(255,82,82,0.08)", color: "#ff5252", fontFamily: "monospace", fontSize: "12px", cursor: "pointer", fontWeight: 700, letterSpacing: "2px" }}>🔒 CERRAR TODOS LOS PRONÓSTICOS</button>
        }
      </div>

      {saved && <div style={{ padding: "10px 14px", background: GREEN_DIM, border: "1px solid rgba(0,230,118,0.3)", borderRadius: "8px", color: GREEN, fontFamily: "monospace", fontSize: "12px", marginBottom: "14px" }}>✓ Resultado guardado y puntos calculados</div>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
        {Object.keys(GROUPS).map(gr => <button key={gr} onClick={() => setG(gr)} style={{ width: "38px", height: "38px", border: `1px solid ${g === gr ? GREEN : BORDER}`, borderRadius: "7px", cursor: "pointer", fontFamily: "'Bebas Neue', cursive", fontSize: "17px", background: g === gr ? GREEN_DIM : CARD, color: g === gr ? GREEN : "#aaa" }}>{gr}</button>)}
      </div>
      <p style={{ fontSize: "9px", color: GREEN, fontFamily: "monospace", letterSpacing: "3px", marginBottom: "10px" }}>GRUPO {g}</p>

      {matches.filter(m => m.grp === g).map(m => {
        const ht = getTeam(m.home), at = getTeam(m.away);
        return (
          <div key={m.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px", marginBottom: "6px" }}>
            <div style={{ fontSize: "9px", color: "#999", fontFamily: "monospace", marginBottom: "6px" }}>📅 {formatDate(m.match_date)} · ⏰ {m.match_time}h</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ flex: 1, fontSize: "12px", color: "#777", fontFamily: "monospace", minWidth: "150px" }}>{ht.flag} {m.home} vs {at.flag} {m.away}</span>
              <span style={{ fontSize: "9px", fontFamily: "monospace", padding: "2px 7px", borderRadius: "8px", background: m.status === "open" ? "rgba(0,200,100,0.08)" : "rgba(255,100,50,0.08)", color: m.status === "open" ? "#00c864" : "#ff6432" }}>{m.status === "open" ? "ABIERTO" : "CERRADO"}</span>
              {m.result_home !== null && <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: GREEN }}>{m.result_home}-{m.result_away}</span>}
              <button onClick={() => toggleStatus(m)} style={{ padding: "4px 10px", border: `1px solid ${BORDER}`, borderRadius: "5px", background: "transparent", color: "#aaa", cursor: "pointer", fontSize: "9px", fontFamily: "monospace" }}>{m.status === "open" ? "Cerrar" : "Reabrir"}</button>
              {sel === m.id
                ? <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                  <input value={hr} onChange={e => setHr(e.target.value)} type="number" min="0" style={{ ...smallSt, width: "44px" }} placeholder="0" />
                  <span style={{ color: "#222" }}>-</span>
                  <input value={ar} onChange={e => setAr(e.target.value)} type="number" min="0" style={{ ...smallSt, width: "44px" }} placeholder="0" />
                  <button onClick={handleResult} style={{ padding: "6px 14px", border: "none", borderRadius: "6px", background: GREEN, color: "#0a0a0a", cursor: "pointer", fontSize: "11px", fontFamily: "monospace", fontWeight: 700 }}>OK</button>
                  <button onClick={() => setSel(null)} style={{ padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "6px", background: "transparent", color: "#aaa", cursor: "pointer", fontSize: "11px", fontFamily: "monospace" }}>✕</button>
                </div>
                : <button onClick={() => { setSel(m.id); setHr(""); setAr(""); }} style={{ padding: "5px 12px", border: "1px solid rgba(0,230,118,0.2)", borderRadius: "5px", background: GREEN_DIM, color: GREEN, cursor: "pointer", fontSize: "9px", fontFamily: "monospace" }}>Resultado</button>
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// APP PRINCIPAL
// ============================================================
export default function Home() {
  const [screen, setScreen] = useState("login");
  const [user, setUser] = useState(null);
  const [view, setView] = useState("groups");
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [allClosed, setAllClosed] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        setUser({ ...session.user, name: profile?.name || session.user.email, role: profile?.role || "user" });
        setScreen("app");
      }
      setLoadingSession(false);
    });
  }, []);

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    const { data: dbMatches } = await supabase.from("matches").select("*").order("match_date");
    let finalMatches;
    if (dbMatches && dbMatches.length > 0) {
      finalMatches = dbMatches;
    } else {
      const chunks = [];
      for (let i = 0; i < ALL_MATCHES.length; i += 10) chunks.push(ALL_MATCHES.slice(i, i + 10));
      let all = [];
      for (const chunk of chunks) { const { data } = await supabase.from("matches").insert(chunk).select(); if (data) all = [...all, ...data]; }
      finalMatches = all.length > 0 ? all : ALL_MATCHES;
    }
    setMatches(finalMatches);
    setAllClosed(finalMatches.length > 0 && finalMatches.every(m => m.status === "closed"));
    if (user) {
      const { data: p } = await supabase.from("predictions").select("*").eq("user_id", user.id);
      setPredictions(p || []);
    }
  };

  const handleLogin = u => { setUser(u); setScreen("app"); };
  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); setScreen("login"); };

  if (loadingSession) return (
    <div style={{ minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}><div style={{ fontSize: "44px", marginBottom: "10px" }}>⚽</div><span style={{ color: GREEN, fontFamily: "monospace", letterSpacing: "4px", fontSize: "11px" }}>CARGANDO...</span></div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: DARK, color: "#f0f0f0" }}>
      <style>{css}</style>
      {screen === "login" && <LoginPage onLogin={handleLogin} />}
      {screen === "app" && user && (
        <>
          <NavBar user={user} view={view} setView={setView} onLogout={handleLogout} />
          <div style={{ maxWidth: "700px", margin: "0 auto", padding: "62px 14px 84px", position: "relative", zIndex: 1 }}>
            {view === "groups" && <GroupsView user={user} matches={matches} predictions={predictions} onDataChange={loadData} allClosed={allClosed} />}
            {view === "results" && <ResultsView matches={matches} />}
            {view === "community" && <CommunityView matches={matches} />}
            {view === "profile" && <ProfileView user={user} matches={matches} />}
            {view === "ranking" && <RankingView />}
            {view === "admin" && user.role === "admin" && <AdminView matches={matches} onDataChange={loadData} />}
          </div>
        </>
      )}
    </div>
  );
}