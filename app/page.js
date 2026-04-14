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
  // GRUPO A — México, Sudáfrica, Corea del Sur, Rep. Checa
  "A_0": { date: "2026-06-11", time: "21:00" },  // México vs Sudáfrica
  "A_1": { date: "2026-06-12", time: "04:00" },  // Corea del Sur vs Rep. Checa
  "A_2": { date: "2026-06-18", time: "18:00" },  // Rep. Checa vs Sudáfrica
  "A_3": { date: "2026-06-19", time: "03:00" },  // México vs Corea del Sur
  "A_4": { date: "2026-06-25", time: "03:00" },  // Sudáfrica vs Corea del Sur
  "A_5": { date: "2026-06-25", time: "03:00" },  // Rep. Checa vs México

  // GRUPO B — Canadá, Bosnia y Herz., Suiza, Qatar
  "B_0": { date: "2026-06-12", time: "21:00" },  // Canadá vs Bosnia y Herz.
  "B_1": { date: "2026-06-13", time: "21:00" },  // Qatar vs Suiza
  "B_2": { date: "2026-06-18", time: "21:00" },  // Suiza vs Bosnia y Herz.
  "B_3": { date: "2026-06-19", time: "00:00" },  // Canadá vs Qatar
  "B_4": { date: "2026-06-24", time: "21:00" },  // Suiza vs Canadá
  "B_5": { date: "2026-06-24", time: "21:00" },  // Bosnia y Herz. vs Qatar

  // GRUPO C — Brasil, Marruecos, Escocia, Haití
  "C_0": { date: "2026-06-13", time: "23:00" },  // Brasil vs Marruecos
  "C_1": { date: "2026-06-14", time: "02:00" },  // Haití vs Escocia  ← madrugada del 14
  "C_2": { date: "2026-06-20", time: "00:00" },  // Escocia vs Marruecos
  "C_3": { date: "2026-06-20", time: "02:30" },  // Brasil vs Haití
  "C_4": { date: "2026-06-25", time: "00:00" },  // Escocia vs Brasil
  "C_5": { date: "2026-06-25", time: "00:00" },  // Marruecos vs Haití

  // GRUPO D — Estados Unidos, Paraguay, Australia, Turquía
  "D_0": { date: "2026-06-13", time: "02:00" },  // Estados Unidos vs Paraguay
  "D_1": { date: "2026-06-13", time: "04:00" },  // Australia vs Turquía
  "D_2": { date: "2026-06-19", time: "21:00" },  // Estados Unidos vs Australia
  "D_3": { date: "2026-06-20", time: "02:00" },  // Turquía vs Paraguay
  "D_4": { date: "2026-06-25", time: "02:00" },  // Estados Unidos vs Turquía
  "D_5": { date: "2026-06-25", time: "02:00" },  // Paraguay vs Australia

  // GRUPO E — Alemania, Curazao, Costa de Marfil, Ecuador
  "E_0": { date: "2026-06-14", time: "19:00" },  // Alemania vs Curazao
  "E_1": { date: "2026-06-15", time: "01:00" },  // Costa de Marfil vs Ecuador
  "E_2": { date: "2026-06-20", time: "22:00" },  // Alemania vs Costa de Marfil
  "E_3": { date: "2026-06-21", time: "04:00" },  // Curazao vs Ecuador
  "E_4": { date: "2026-06-26", time: "00:00" },  // Ecuador vs Alemania
  "E_5": { date: "2026-06-26", time: "00:00" },  // Curazao vs Costa de Marfil

  // GRUPO F — Países Bajos, Japón, Túnez, Suecia
  "F_0": { date: "2026-06-14", time: "22:00" },  // Países Bajos vs Japón
  "F_1": { date: "2026-06-15", time: "04:00" },  // Suecia vs Túnez
  "F_2": { date: "2026-06-21", time: "19:00" },  // Países Bajos vs Suecia
  "F_3": { date: "2026-06-22", time: "04:00" },  // Japón vs Túnez
  "F_4": { date: "2026-06-26", time: "02:00" },  // Túnez vs Países Bajos
  "F_5": { date: "2026-06-26", time: "02:00" },  // Japón vs Suecia

  // GRUPO G — Bélgica, Egipto, Irán, Nueva Zelanda
  "G_0": { date: "2026-06-15", time: "21:00" },  // Bélgica vs Egipto
  "G_1": { date: "2026-06-16", time: "01:00" },  // Irán vs Nueva Zelanda
  "G_2": { date: "2026-06-21", time: "22:00" },  // Bélgica vs Irán
  "G_3": { date: "2026-06-22", time: "01:00" },  // Nueva Zelanda vs Egipto
  "G_4": { date: "2026-06-27", time: "02:00" },  // Nueva Zelanda vs Bélgica
  "G_5": { date: "2026-06-27", time: "02:00" },  // Egipto vs Irán

  // GRUPO H — España, Cabo Verde, Arabia Saudí, Uruguay
  "H_0": { date: "2026-06-15", time: "18:00" },  // España vs Cabo Verde
  "H_1": { date: "2026-06-16", time: "00:00" },  // Arabia Saudí vs Uruguay
  "H_2": { date: "2026-06-21", time: "18:00" },  // España vs Arabia Saudí
  "H_3": { date: "2026-06-22", time: "02:00" },  // Uruguay vs Cabo Verde
  "H_4": { date: "2026-06-27", time: "02:00" },  // Uruguay vs España
  "H_5": { date: "2026-06-27", time: "02:00" },  // Cabo Verde vs Arabia Saudí

  // GRUPO I — Francia, Senegal, Noruega, Iraq
  "I_0": { date: "2026-06-16", time: "21:00" },  // Francia vs Senegal
  "I_1": { date: "2026-06-17", time: "00:00" },  // Iraq vs Noruega
  "I_2": { date: "2026-06-22", time: "21:00" },  // Francia vs Noruega
  "I_3": { date: "2026-06-23", time: "00:00" },  // Senegal vs Iraq
  "I_4": { date: "2026-06-28", time: "21:00" },  // Noruega vs Francia
  "I_5": { date: "2026-06-28", time: "21:00" },  // Senegal vs Iraq

  // GRUPO J — Argentina, Argelia, Austria, Jordania
  "J_0": { date: "2026-06-16", time: "18:00" },  // Argentina vs Argelia
  "J_1": { date: "2026-06-17", time: "02:00" },  // Austria vs Jordania
  "J_2": { date: "2026-06-22", time: "19:00" },  // Argentina vs Austria
  "J_3": { date: "2026-06-23", time: "02:00" },  // Argelia vs Jordania
  "J_4": { date: "2026-06-28", time: "00:00" },  // Argentina vs Jordania
  "J_5": { date: "2026-06-28", time: "00:00" },  // Austria vs Argelia

  // GRUPO K — Portugal, Colombia, Uzbekistán, RD Congo
  "K_0": { date: "2026-06-17", time: "06:00" },  // Uzbekistán vs Colombia
  "K_1": { date: "2026-06-18", time: "00:00" },  // Portugal vs RD Congo
  "K_2": { date: "2026-06-23", time: "04:00" },  // Colombia vs RD Congo
  "K_3": { date: "2026-06-23", time: "07:00" },  // Portugal vs Uzbekistán
  "K_4": { date: "2026-06-28", time: "03:00" },  // Colombia vs Uzbekistán
  "K_5": { date: "2026-06-28", time: "03:00" },  // Portugal vs Colombia

  // GRUPO L — Inglaterra, Croacia, Panamá, Ghana
  "L_0": { date: "2026-06-18", time: "03:00" },  // Inglaterra vs Panamá
  "L_1": { date: "2026-06-18", time: "03:00" },  // Croacia vs Ghana
  "L_2": { date: "2026-06-24", time: "00:00" },  // Inglaterra vs Ghana
  "L_3": { date: "2026-06-24", time: "03:00" },  // Croacia vs Panamá
  "L_4": { date: "2026-06-29", time: "00:00" },  // Panamá vs Ghana
  "L_5": { date: "2026-06-29", time: "00:00" },  // Inglaterra vs Croacia
};
// ============================================================
// ⚙️ GRUPOS — datos oficiales tras playoffs marzo 2026
// ============================================================
const GROUPS = {
  A: [{ name: "México", flag: "🇲🇽" }, { name: "Sudáfrica", flag: "🇿🇦" }, { name: "Corea del Sur", flag: "🇰🇷" }, { name: "Rep. Checa", flag: "🇨🇿" }],
  B: [{ name: "Canadá", flag: "🇨🇦" }, { name: "Bosnia y Herz.", flag: "🇧🇦" }, { name: "Suiza", flag: "🇨🇭" }, { name: "Qatar", flag: "🇶🇦" }],
  C: [{ name: "Brasil", flag: "🇧🇷" }, { name: "Marruecos", flag: "🇲🇦" }, { name: "Escocia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" }, { name: "Haití", flag: "🇭🇹" }],
  D: [{ name: "Estados Unidos", flag: "🇺🇸" }, { name: "Paraguay", flag: "🇵🇾" }, { name: "Australia", flag: "🇦🇺" }, { name: "Turquía", flag: "🇹🇷" }],
  E: [{ name: "Alemania", flag: "🇩🇪" }, { name: "Curazao", flag: "🇨🇼" }, { name: "Costa de Marfil", flag: "🇨🇮" }, { name: "Ecuador", flag: "🇪🇨" }],
  F: [{ name: "Países Bajos", flag: "🇳🇱" }, { name: "Japón", flag: "🇯🇵" }, { name: "Túnez", flag: "🇹🇳" }, { name: "Suecia", flag: "🇸🇪" }],
  G: [{ name: "Bélgica", flag: "🇧🇪" }, { name: "Egipto", flag: "🇪🇬" }, { name: "Irán", flag: "🇮🇷" }, { name: "Nueva Zelanda", flag: "🇳🇿" }],
  H: [{ name: "España", flag: "🇪🇸" }, { name: "Cabo Verde", flag: "🇨🇻" }, { name: "Arabia Saudí", flag: "🇸🇦" }, { name: "Uruguay", flag: "🇺🇾" }],
  I: [{ name: "Francia", flag: "🇫🇷" }, { name: "Senegal", flag: "🇸🇳" }, { name: "Noruega", flag: "🇳🇴" }, { name: "Iraq", flag: "🇮🇶" }],
  J: [{ name: "Argentina", flag: "🇦🇷" }, { name: "Argelia", flag: "🇩🇿" }, { name: "Austria", flag: "🇦🇹" }, { name: "Jordania", flag: "🇯🇴" }],
  K: [{ name: "Portugal", flag: "🇵🇹" }, { name: "Colombia", flag: "🇨🇴" }, { name: "Uzbekistán", flag: "🇺🇿" }, { name: "RD Congo", flag: "🇨🇩" }],
  L: [{ name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" }, { name: "Croacia", flag: "🇭🇷" }, { name: "Panamá", flag: "🇵🇦" }, { name: "Ghana", flag: "🇬🇭" }],
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
const KICKOFF = new Date("2026-06-11T21:00:00+02:00").getTime(); // 21:00h España
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
// TEMA — Azul marino profesional
// ============================================================
const GREEN = "#4fc3f7";           // Azul claro brillante (acentos)
const GREEN_DIM = "rgba(79,195,247,0.12)";
const DARK = "#0a1628";            // Fondo principal — azul muy oscuro
const CARD = "rgba(255,255,255,0.06)";  // Tarjetas translúcidas
const BORDER = "rgba(79,195,247,0.2)";
const TEXT = "#e8f4fd";
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#0a1628; color:#e8f4fd;}
  ::-webkit-scrollbar{width:3px;}
  ::-webkit-scrollbar-track{background:#0a1628;}
  ::-webkit-scrollbar-thumb{background:#4fc3f7;border-radius:2px;}
  input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
`;
const inputSt = {
  width: "100%", padding: "12px 14px", marginBottom: "12px",
  border: "1px solid rgba(79,195,247,0.3)", borderRadius: "8px",
  background: "rgba(255,255,255,0.07)", color: "#e8f4fd",
  fontSize: "16px", fontFamily: "monospace", outline: "none"
};
const smallSt = {
  padding: "8px 4px", border: "1px solid rgba(79,195,247,0.4)",
  borderRadius: "6px", background: "rgba(255,255,255,0.08)",
  color: "#4fc3f7", fontSize: "20px",
  fontFamily: "'Bebas Neue', monospace", outline: "none",
  textAlign: "center", width: "48px"
};
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
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(34px,9vw,52px)", letterSpacing: "4px", color: "#e0eaf8", lineHeight: 1 }}>PORRA <span style={{ color: GREEN }}>VALLAU</span></div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(18px,5vw,26px)", letterSpacing: "6px", color: "#e0eefa", marginTop: "2px" }}>MUNDIAL 2026</div>
          <div style={{ fontSize: "10px", color: "#d0e4f7", letterSpacing: "3px", fontFamily: "monospace", marginTop: "6px" }}>USA · CANADA · MEXICO</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: "16px", padding: "24px" }}>
          <div style={{ display: "flex", marginBottom: "20px", background: "rgba(200,215,235,0.5)", borderRadius: "8px", padding: "3px" }}>
            {["login", "register"].map(m => <button key={m} onClick={() => { setMode(m); setError(""); }} style={{ flex: 1, padding: "10px", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "11px", letterSpacing: "2px", fontFamily: "monospace", textTransform: "uppercase", background: mode === m ? GREEN : "transparent", color: mode === m ? "#0a1628" : "#d0e4f7", fontWeight: 700 }}>{m === "login" ? "Entrar" : "Registro"}</button>)}
          </div>
          {mode === "register" && <input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" style={inputSt} />}
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" style={inputSt} />
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" type="password" style={inputSt} onKeyDown={e => e.key === "Enter" && go()} />
          {error && <p style={{ color: "#cc2222", fontSize: "13px", marginBottom: "12px", fontFamily: "monospace" }}>⚠ {error}</p>}
          <button onClick={go} disabled={loading} style={{ width: "100%", padding: "14px", border: "none", borderRadius: "8px", cursor: "pointer", background: loading ? "#0a1628" : `linear-gradient(135deg,${GREEN},#e07b00)`, color: "#0a1628", fontWeight: 800, fontSize: "13px", letterSpacing: "3px", fontFamily: "monospace", textTransform: "uppercase" }}>{loading ? "..." : mode === "login" ? "⚡ ENTRAR" : "🚀 REGISTRARME"}</button>
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
  if (started) return <div style={{ background: GREEN_DIM, border: "1px solid rgba(245,158,11,0.25)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", textAlign: "center" }}><span style={{ color: GREEN, fontFamily: "monospace", fontSize: "13px", letterSpacing: "2px" }}>⚽ ¡EL MUNDIAL HA COMENZADO!</span></div>;
  return (
    <div style={{ padding: "16px" }}>
      <p style={{ color: "#d0e4f7", fontFamily: "monospace", fontSize: "9px", letterSpacing: "3px", textAlign: "center", marginBottom: "12px" }}>⏱ FALTAN · 11 JUN 2026 · 20:00H</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
        {[{ v: d, l: "DÍAS" }, { v: h, l: "HORAS" }, { v: m, l: "MIN" }, { v: s, l: "SEG" }].map(({ v, l }) => (
          <div key={l} style={{ textAlign: "center", flex: 1, maxWidth: "70px" }}>
            <div style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "8px", padding: "8px 4px" }}>
              <span style={{ fontFamily: "'Bebas Neue', monospace", fontSize: "clamp(22px,6vw,32px)", color: GREEN, lineHeight: 1, display: "block" }}>{v}</span>
            </div>
            <span style={{ fontSize: "8px", color: "#d0e4f7", fontFamily: "monospace", marginTop: "4px", display: "block" }}>{l}</span>
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
        <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#cce0f5", letterSpacing: "2px" }}>TUS PRONÓSTICOS</span>
        <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", color: sent === TOTAL_MATCHES ? GREEN : "#7ab8e0" }}>{sent}/{TOTAL_MATCHES}</span>
      </div>
      <div style={{ background: "rgba(245,158,11,0.08)", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: pct + "%", background: `linear-gradient(90deg,${GREEN},#005599)`, borderRadius: "4px", transition: "width 0.5s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
        <span style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace" }}>{pct}% completado</span>
        {open > 0 && <span style={{ fontSize: "9px", color: "#e0eefa", fontFamily: "monospace" }}>{TOTAL_MATCHES - sent} por enviar</span>}
      </div>
    </div>
  );
}

// ============================================================
// NAVBAR
// ============================================================
function NavBar({ user, view, setView, onLogout }) {
  // 4 tabs principales + perfil en header
  const tabs = [
    { id: "home", icon: "🏠", label: "Inicio" },
    { id: "groups", icon: "⚽", label: "Mis pronóst." },
    { id: "community", icon: "👥", label: "Todos" },
    { id: "ranking", icon: "🏆", label: "Ranking" },
  ];

  return (
    <>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,22,40,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 14px", display: "flex", alignItems: "center", height: "50px" }}>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", letterSpacing: "2px", color: "#e0eaf8", flex: 1 }}>PORRA <span style={{ color: GREEN }}>VALLAU</span></span>
          {/* Avatar / perfil en header */}
          <button onClick={() => setView("profile")} style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: view === "profile" ? GREEN : GREEN_DIM,
            border: `1px solid ${view === "profile" ? GREEN : "rgba(245,158,11,0.3)"}`,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            marginRight: "10px", flexShrink: 0,
          }}>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "15px", color: view === "profile" ? "#0a1628" : GREEN }}>
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </button>
          <button onClick={onLogout} style={{ padding: "5px 10px", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontSize: "11px", fontFamily: "monospace" }}>salir</button>
        </div>
      </div>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,22,40,0.97)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", display: "flex" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setView(t.id)} style={{ flex: 1, padding: "11px 2px 9px", border: "none", cursor: "pointer", background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", borderTop: view === t.id ? `2px solid ${GREEN}` : "2px solid transparent" }}>
              <span style={{ fontSize: "17px", lineHeight: 1 }}>{t.icon}</span>
              <span style={{ fontSize: "7px", fontFamily: "monospace", color: view === t.id ? GREEN : "#7ab8e0", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center" }}>{t.label}</span>
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
        {["EQUIPO", "PJ", "GF", "GC", "PTS"].map(c => <span key={c} style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "1px", textAlign: c === "EQUIPO" ? "left" : "center" }}>{c}</span>)}
      </div>
      {standings.map((t, i) => (
        <div key={t.name} style={{ display: "grid", gridTemplateColumns: "1fr 28px 28px 28px 36px", gap: "1px", padding: "8px", borderRadius: "7px", marginBottom: "3px", background: i < 2 ? GREEN_DIM : CARD, border: i < 2 ? "1px solid rgba(245,158,11,0.18)" : `1px solid ${BORDER}`, borderLeft: i < 2 ? `3px solid ${GREEN}` : "3px solid transparent" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden" }}>
            <span style={{ fontSize: "15px" }}>{t.flag}</span>
            <span style={{ fontSize: "11px", color: i < 2 ? "#e0eaf8" : "#a8d4f0", fontFamily: "monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</span>
          </span>
          {[t.pj, t.gf, t.gc].map((v, vi) => <span key={vi} style={{ fontSize: "11px", color: "#e0eefa", fontFamily: "monospace", textAlign: "center" }}>{v}</span>)}
          <span style={{ fontSize: "14px", fontWeight: 700, color: GREEN, fontFamily: "'Bebas Neue', monospace", textAlign: "center" }}>{t.pts}</span>
        </div>
      ))}
      <p style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "monospace", margin: "5px 0 0" }}>🟢 Los 2 primeros pasan a octavos</p>
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
              <span style={{ fontSize: "11px", color: sel ? GREEN : "#a8d4f0", fontFamily: "monospace" }}>{t.name}</span>
              {sel && <span style={{ fontSize: "10px", color: GREEN }}>✓</span>}
            </button>
          );
        })}
      </div>
      {!locked && <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", marginTop: "6px" }}>Selecciona 2 equipos · {picks.length}/2</p>}
      {locked && <p style={{ fontSize: "9px", color: "#e0eefa", fontFamily: "monospace", marginTop: "6px" }}>Pronósticos cerrados</p>}
    </div>
  );
}

// ============================================================
// MATCH CHAT — con realtime robusto + contador no leídos
// ============================================================
function MatchChat({ match, user }) {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const channelRef = useRef(null);
  const lastSeenRef = useRef(0); // timestamp del último mensaje visto

  const loadComments = async () => {
    const { data } = await supabase
      .from("match_comments")
      .select("*")
      .eq("match_id", match.id)
      .order("created_at", { ascending: true });
    setComments(data || []);
    setLoading(false);
    // Al cargar con el chat abierto, marcar todo como leído
    if (open) {
      lastSeenRef.current = Date.now();
      setUnread(0);
    }
  };

  // Suscripción realtime — se monta una sola vez por match
  useEffect(() => {
    // Cargar mensajes iniciales (aunque el chat esté cerrado, para saber si hay no leídos)
    (async () => {
      const { data } = await supabase
        .from("match_comments")
        .select("*")
        .eq("match_id", match.id)
        .order("created_at", { ascending: true });
      setComments(data || []);
      setLoading(false);
    })();

    // Canal realtime
    channelRef.current = supabase
      .channel(`match_chat_${match.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "match_comments",
          filter: `match_id=eq.${match.id}`,
        },
        (payload) => {
          setComments(prev => {
            // Evitar duplicados (mensaje propio ya insertado optimistamente)
            if (prev.find(c => c.id === payload.new.id)) return prev;
            // Si el chat está cerrado y el mensaje es de otro usuario → sumar no leído
            if (payload.new.user_id !== user.id) {
              setUnread(u => u + 1);
            }
            return [...prev, payload.new];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "match_comments",
          filter: `match_id=eq.${match.id}`,
        },
        (payload) => {
          setComments(prev => prev.filter(c => c.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [match.id]); // solo se remonta si cambia el partido

  // Al abrir el chat → marcar como leído
  useEffect(() => {
    if (open) {
      setUnread(0);
      lastSeenRef.current = Date.now();
      // Scroll al fondo
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }, [open]);

  // Scroll al fondo cuando llegan mensajes nuevos con el chat abierto
  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments, open]);

  const send = async () => {
    if (!message.trim() || sending) return;
    setSending(true);

    const optimistic = {
      id: `temp_${Date.now()}`,
      match_id: match.id,
      user_id: user.id,
      user_name: user.name,
      message: message.trim(),
      created_at: new Date().toISOString(),
    };
    setComments(prev => [...prev, optimistic]);
    setMessage("");

    const { data, error } = await supabase
      .from("match_comments")
      .insert({
        match_id: match.id,
        user_id: user.id,
        user_name: user.name,
        message: optimistic.message,
      })
      .select()
      .single();

    if (error) {
      setComments(prev => prev.filter(c => c.id !== optimistic.id));
    } else {
      setComments(prev => prev.map(c => c.id === optimistic.id ? data : c));
    }
    setSending(false);
  };

  const sendReaction = async (emoji) => {
    const optimistic = {
      id: `temp_${Date.now()}`,
      match_id: match.id,
      user_id: user.id,
      user_name: user.name,
      message: emoji,
      created_at: new Date().toISOString(),
    };
    setComments(prev => [...prev, optimistic]);

    const { data, error } = await supabase
      .from("match_comments")
      .insert({
        match_id: match.id,
        user_id: user.id,
        user_name: user.name,
        message: emoji,
      })
      .select()
      .single();

    if (error) {
      setComments(prev => prev.filter(c => c.id !== optimistic.id));
    } else {
      setComments(prev => prev.map(c => c.id === optimistic.id ? data : c));
    }
  };

  const deleteComment = async (id) => {
    await supabase.from("match_comments").delete().eq("id", id);
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const REACTIONS = ["⚽", "🔥", "😱", "💀", "🎉", "👏", "😅", "🤞"];

  return (
    <div style={{ marginTop: "10px" }}>
      {/* Botón toggle con badge de no leídos */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", padding: "8px",
          border: `1px solid ${open ? GREEN : BORDER}`,
          borderRadius: "8px",
          background: open ? GREEN_DIM : "transparent",
          color: open ? GREEN : "#d0e4f7",
          fontFamily: "monospace", fontSize: "10px",
          cursor: "pointer", letterSpacing: "1px",
          display: "flex", alignItems: "center",
          justifyContent: "center", gap: "6px",
          position: "relative",
        }}>
        💬
        {open ? "CERRAR CHAT" : `CHAT DEL PARTIDO`}
        {/* Badge de no leídos */}
        {!open && unread > 0 && (
          <span style={{
            background: "#cc2222",
            color: "white",
            borderRadius: "10px",
            fontSize: "10px",
            fontFamily: "monospace",
            fontWeight: 700,
            padding: "1px 7px",
            minWidth: "20px",
            textAlign: "center",
            lineHeight: "18px",
          }}>
            {unread > 99 ? "99+" : unread}
          </span>
        )}
        {/* Punto verde si hay mensajes aunque no haya no leídos */}
        {!open && unread === 0 && comments.length > 0 && (
          <span style={{
            fontSize: "9px", color: "#c0d8f0",
            fontFamily: "monospace",
          }}>
            ({comments.length})
          </span>
        )}
      </button>

      {open && (
        <div style={{
          marginTop: "8px",
          border: `1px solid ${BORDER}`,
          borderRadius: "10px",
          background: "rgba(255,255,255,0.6)",
          overflow: "hidden",
        }}>
          {/* Mensajes */}
          <div style={{
            maxHeight: "220px", overflowY: "auto",
            padding: "10px", display: "flex",
            flexDirection: "column", gap: "6px",
          }}>
            {loading && (
              <p style={{ color: "#c0d8f0", fontFamily: "monospace", fontSize: "11px", textAlign: "center" }}>
                Cargando...
              </p>
            )}
            {!loading && comments.length === 0 && (
              <p style={{ color: "#c0d8f0", fontFamily: "monospace", fontSize: "11px", textAlign: "center", padding: "12px 0" }}>
                Sé el primero en comentar ⚽
              </p>
            )}
            {comments.map(c => {
              const isMe = c.user_id === user.id;
              const isAdmin = user.role === "admin";
              const isReaction = ["⚽", "🔥", "😱", "💀", "🎉", "👏", "😅", "🤞"].includes(c.message);
              return (
                <div key={c.id} style={{
                  display: "flex", flexDirection: "column",
                  alignItems: isMe ? "flex-end" : "flex-start",
                  animation: "fadeIn 0.2s ease",
                }}>
                  {!isMe && (
                    <span style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", marginBottom: "2px", marginLeft: "4px" }}>
                      {c.user_name}
                    </span>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {(isMe || isAdmin) && (
                      <button onClick={() => deleteComment(c.id)} style={{
                        padding: "0 4px", border: "none", background: "transparent",
                        color: "#cc2222", cursor: "pointer", fontSize: "10px", opacity: 0.5,
                      }}>✕</button>
                    )}
                    <div style={{
                      maxWidth: "80%",
                      padding: isReaction ? "4px 8px" : "8px 12px",
                      borderRadius: isMe ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                      background: isMe ? GREEN : "white",
                      boxShadow: "0 1px 4px rgba(26,58,107,0.1)",
                      fontSize: isReaction ? "22px" : "12px",
                      color: isMe ? "white" : "#e0eaf8",
                      fontFamily: "monospace", lineHeight: 1.4,
                      wordBreak: "break-word",
                    }}>
                      {c.message}
                    </div>
                  </div>
                  <span style={{ fontSize: "8px", color: "#c0d8f0", fontFamily: "monospace", marginTop: "2px", marginLeft: "4px", marginRight: "4px" }}>
                    {formatTime(c.created_at)}
                  </span>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Reacciones rápidas */}
          <div style={{
            display: "flex", gap: "4px", padding: "6px 10px",
            borderTop: `1px solid ${BORDER}`, flexWrap: "wrap",
            background: "rgba(26,58,107,0.02)",
          }}>
            {REACTIONS.map(emoji => (
              <button key={emoji} onClick={() => sendReaction(emoji)} style={{
                padding: "4px 8px",
                border: `1px solid ${BORDER}`,
                borderRadius: "20px", background: "white",
                cursor: "pointer", fontSize: "16px", lineHeight: 1,
              }}>{emoji}</button>
            ))}
          </div>

          {/* Input mensaje */}
          <div style={{
            display: "flex", gap: "6px", padding: "8px 10px",
            borderTop: `1px solid ${BORDER}`,
            background: "rgba(26,58,107,0.02)",
          }}>
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Escribe algo..."
              maxLength={200}
              style={{
                flex: 1, padding: "8px 12px",
                border: `1px solid ${BORDER}`, borderRadius: "20px",
                background: "white", color: "#e0eaf8",
                fontFamily: "monospace", fontSize: "12px", outline: "none",
              }}
            />
            <button
              onClick={send}
              disabled={!message.trim() || sending}
              style={{
                padding: "8px 14px", border: "none", borderRadius: "20px",
                background: message.trim() ? GREEN : "rgba(26,58,107,0.1)",
                color: message.trim() ? "white" : "#c0d8f0",
                fontFamily: "monospace", fontSize: "11px", fontWeight: 700,
                cursor: message.trim() ? "pointer" : "default",
              }}>
              {sending ? "..." : "→"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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

  const statusColor = status === "saved" ? GREEN : status === "saving" ? "#a8d4f0" : status === "error" ? "#cc2222" : "#7ab8e0";
  const statusText = status === "saved" ? "✓" : status === "saving" ? "···" : status === "error" ? "✗" : "";

  return (
    <div style={{ padding: "12px", borderRadius: "10px", marginBottom: "6px", background: CARD, border: `1px solid ${BORDER}` }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px", gap: "8px" }}>
        <span style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace" }}>📅 {formatDate(match.match_date)} · ⏰ {match.match_time || "??:??"}h</span>
        <span style={{ fontSize: "9px", fontFamily: "monospace", padding: "1px 6px", borderRadius: "6px", background: isOpen ? "rgba(0,200,100,0.08)" : "rgba(255,100,50,0.08)", color: isOpen ? "#007a3a" : "#cc4422" }}>{isOpen ? "ABIERTO" : "CERRADO"}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
          <span style={{ fontSize: "11px", color: "#c0d8f0", textAlign: "right", fontFamily: "monospace" }}>{match.home}</span>
          <span style={{ fontSize: "22px" }}>{ht.flag}</span>
        </div>
        {hasResult ? (
          <div style={{ minWidth: "64px", textAlign: "center" }}>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: GREEN }}>{match.result_home}</span>
            <span style={{ color: "#b8d4ee", fontSize: "16px", margin: "0 3px" }}>-</span>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: GREEN }}>{match.result_away}</span>
          </div>
        ) : (
          <div style={{ minWidth: "44px", textAlign: "center" }}><span style={{ fontSize: "11px", color: "#b8d4ee", fontFamily: "monospace", letterSpacing: "2px" }}>VS</span></div>
        )}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "22px" }}>{at.flag}</span>
          <span style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "monospace" }}>{match.away}</span>
        </div>
      </div>
      {user.role !== "admin" && (
        <div style={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          {isOpen ? (
            <>
              <span style={{ fontSize: "10px", color: "#d0e4f7", fontFamily: "monospace" }}>pronóst.:</span>
              <input value={ph} onChange={e => handleChange("h", e.target.value)} type="number" min="0" max="20" style={smallSt} placeholder="0" />
              <span style={{ color: "#b8d4ee", fontSize: "16px" }}>-</span>
              <input value={pa} onChange={e => handleChange("a", e.target.value)} type="number" min="0" max="20" style={smallSt} placeholder="0" />
              <span style={{ fontSize: "13px", fontFamily: "monospace", color: statusColor, minWidth: "20px" }}>{statusText}</span>
            </>
          ) : userPred ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "11px", color: "#e0eefa", fontFamily: "monospace" }}>{userPred.predicted_home}-{userPred.predicted_away}</span>
              {predPoints !== null && <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontFamily: "monospace", fontWeight: 700, background: predPoints === 3 ? GREEN_DIM : predPoints === 1 ? "rgba(255,193,7,0.1)" : "rgba(255,82,82,0.08)", color: predPoints === 3 ? GREEN : predPoints === 1 ? "#b8860b" : "#cc2222" }}>{predPoints === 3 ? "🎯 +3" : predPoints === 1 ? "✓ +1" : "✗ +0"}</span>}
            </div>
          ) : (
            <span style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "monospace" }}>cerrado · sin pronóstico</span>
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
  const [showPending, setShowPending] = useState(false);
  const predMap = {};
  predictions.forEach(p => { predMap[p.match_id] = p; });
  const personalStandings = calcPersonalStandings(g, matches, predMap);
  const hasAnyPred = matches.filter(m => m.grp === g).some(m => predMap[m.id]);

  const pendingMatches = matches.filter(m =>
    m.status === "open" && !allClosed && !predMap[m.id]
  );
  const pendingByGroup = {};
  pendingMatches.forEach(m => {
    if (!pendingByGroup[m.grp]) pendingByGroup[m.grp] = [];
    pendingByGroup[m.grp].push(m);
  });

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <ProgressBar predictions={predictions} matches={matches} />
      <SpecialPredictions userId={user.id} locked={allClosed} />

      {/* Botón filtro pendientes */}
      <button
        onClick={() => setShowPending(v => !v)}
        style={{
          width: "100%", marginBottom: "16px",
          padding: "12px 16px",
          border: `1px solid ${showPending ? "#ff6b4a" : BORDER}`,
          borderRadius: "10px",
          background: showPending ? "rgba(255,107,74,0.1)" : CARD,
          color: showPending ? "#ff6b4a" : "#d0e4f7",
          fontFamily: "monospace", fontSize: "11px",
          cursor: "pointer", letterSpacing: "2px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
        }}>
        <span>⚠️ VER SOLO SIN RELLENAR</span>
        <span style={{
          background: pendingMatches.length > 0 ? "#ff6b4a" : "#007a3a",
          color: "white", borderRadius: "10px",
          fontSize: "10px", fontFamily: "monospace",
          fontWeight: 700, padding: "2px 10px",
        }}>
          {pendingMatches.length > 0 ? `${pendingMatches.length} pendientes` : "✓ Todo rellenado"}
        </span>
      </button>

      {showPending ? (
        <div>
          {pendingMatches.length === 0 ? (
            <div style={{
              background: "rgba(0,122,58,0.1)", border: "1px solid rgba(0,122,58,0.3)",
              borderRadius: "12px", padding: "28px", textAlign: "center",
            }}>
              <div style={{ fontSize: "36px", marginBottom: "10px" }}>🎉</div>
              <p style={{ fontFamily: "monospace", fontSize: "13px", color: "#4fc3f7" }}>
                ¡Has rellenado todos los pronósticos abiertos!
              </p>
            </div>
          ) : (
            Object.entries(pendingByGroup).map(([grp, ms]) => (
              <div key={grp} style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <div style={{
                    width: "30px", height: "30px", borderRadius: "6px",
                    background: GREEN_DIM, border: `1px solid ${BORDER}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", color: GREEN }}>{grp}</span>
                  </div>
                  <span style={{ fontSize: "9px", color: "#ff6b4a", fontFamily: "monospace", letterSpacing: "2px" }}>
                    GRUPO {grp} · {ms.length} sin rellenar
                  </span>
                </div>
                {ms.map(m => (
                  <MatchRow key={m.id} match={m} userPred={predMap[m.id]}
                    user={user} onSaved={onDataChange} allClosed={allClosed} />
                ))}
              </div>
            ))
          )}
        </div>
      ) : (
        <>
          <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "12px" }}>SELECCIONA GRUPO</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
            {Object.keys(GROUPS).map(gr => {
              const pending = matches.filter(m =>
                m.grp === gr && m.status === "open" && !allClosed && !predMap[m.id]
              ).length;
              return (
                <button key={gr} onClick={() => setG(gr)} style={{
                  width: "40px", height: "40px",
                  border: `1px solid ${g === gr ? GREEN : BORDER}`,
                  borderRadius: "8px", cursor: "pointer",
                  fontFamily: "'Bebas Neue', cursive", fontSize: "18px",
                  background: g === gr ? GREEN_DIM : CARD,
                  color: g === gr ? GREEN : "#e0eefa",
                  position: "relative",
                }}>
                  {gr}
                  {pending > 0 && (
                    <span style={{
                      position: "absolute", top: "2px", right: "2px",
                      width: "7px", height: "7px",
                      borderRadius: "50%", background: "#ff6b4a",
                    }} />
                  )}
                </button>
              );
            })}
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "7px", background: GREEN_DIM, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: GREEN }}>{g}</span>
              </div>
              <div>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "17px", color: "#e0eaf8" }}>GRUPO {g}</div>
                <div style={{ display: "flex", gap: "5px", marginTop: "3px" }}>
                  {GROUPS[g].map(t => <span key={t.name} style={{ fontSize: "15px" }} title={t.name}>{t.flag}</span>)}
                </div>
              </div>
            </div>
            <p style={{ fontSize: "9px", color: GREEN, fontFamily: "monospace", letterSpacing: "2px", marginBottom: "6px" }}>TU CLASIFICACIÓN</p>
            {!hasAnyPred && <p style={{ fontSize: "10px", color: "#d0e4f7", fontFamily: "monospace", marginBottom: "8px" }}>Introduce pronósticos abajo para ver tu clasificación</p>}
            <StandingTable standings={personalStandings} />
            <QualifierPicker group={g} userId={user.id} locked={allClosed} />
            <div style={{ marginTop: "20px" }}>
              <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "10px" }}>PARTIDOS</p>
              {matches.filter(m => m.grp === g).map(m => (
                <MatchRow key={m.id} match={m} userPred={predMap[m.id]}
                  user={user} onSaved={onDataChange} allClosed={allClosed} />
              ))}
            </div>
          </div>
        </>
      )}
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
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "12px" }}>RESULTADOS REALES</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
        {Object.keys(GROUPS).map(gr => <button key={gr} onClick={() => setG(gr)} style={{ width: "40px", height: "40px", border: `1px solid ${g === gr ? GREEN : BORDER}`, borderRadius: "8px", cursor: "pointer", fontFamily: "'Bebas Neue', cursive", fontSize: "18px", background: g === gr ? GREEN_DIM : CARD, color: g === gr ? GREEN : "#e0eefa" }}>{gr}</button>)}
      </div>
      <div style={{ background: CARD, border: "1px solid rgba(245,158,11,0.1)", borderRadius: "12px", padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "7px", background: GREEN_DIM, border: "1px solid rgba(245,158,11,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: GREEN }}>{g}</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "17px", color: "#e0eaf8" }}>GRUPO {g} — REAL</div>
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
                    <span style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "monospace", textAlign: "right" }}>{m.home}</span>
                    <span style={{ fontSize: "20px" }}>{ht.flag}</span>
                  </div>
                  <div style={{ minWidth: "64px", textAlign: "center" }}>
                    <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: GREEN }}>{m.result_home}</span>
                    <span style={{ color: "#b8d4ee", fontSize: "14px", margin: "0 3px" }}>-</span>
                    <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: GREEN }}>{m.result_away}</span>
                  </div>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "5px" }}>
                    <span style={{ fontSize: "20px" }}>{at.flag}</span>
                    <span style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "monospace" }}>{m.away}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {pending.length > 0 && (
          <div style={{ marginTop: "16px" }}>
            <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "8px" }}>PENDIENTES</p>
            {pending.map(m => {
              const ht = getTeam(m.home), at = getTeam(m.away);
              return (
                <div key={m.id} style={{ padding: "10px 12px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: "8px", marginBottom: "5px", opacity: 0.5 }}>
                  <div style={{ textAlign: "center", fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", marginBottom: "5px" }}>📅 {formatDate(m.match_date)} · {m.match_time}h</div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "5px" }}>
                      <span style={{ fontSize: "11px", color: "#a8d4f0", fontFamily: "monospace" }}>{m.home}</span>
                      <span style={{ fontSize: "20px" }}>{ht.flag}</span>
                    </div>
                    <div style={{ minWidth: "44px", textAlign: "center" }}><span style={{ fontSize: "10px", color: "#b8d4ee", fontFamily: "monospace", letterSpacing: "2px" }}>VS</span></div>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "5px" }}>
                      <span style={{ fontSize: "20px" }}>{at.flag}</span>
                      <span style={{ fontSize: "11px", color: "#a8d4f0", fontFamily: "monospace" }}>{m.away}</span>
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
function SpecialPredictionsTableCollapsible({ currentUserId }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginBottom: "16px" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", padding: "10px 14px",
          border: `1px solid ${open ? GREEN : BORDER}`,
          borderRadius: open ? "10px 10px 0 0" : "10px",
          background: open ? GREEN_DIM : CARD,
          color: open ? GREEN : "#d0e4f7",
          fontFamily: "monospace", fontSize: "10px",
          cursor: "pointer", letterSpacing: "2px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
        }}>
        <span>🏅 PRONÓSTICOS ESPECIALES</span>
        <span style={{ fontSize: "12px" }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{
          border: `1px solid ${GREEN}`,
          borderTop: "none",
          borderRadius: "0 0 10px 10px",
          overflow: "hidden",
        }}>
          <SpecialPredictionsTable currentUserId={currentUserId} />
        </div>
      )}
    </div>
  );
}


function CommunityView({ matches, user }) {
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
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "15px", color: "#e0eaf8" }}>{m.home}</span>
          {m.result_home !== null ? <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: GREEN }}>{m.result_home}-{m.result_away}</span> : <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#d0e4f7" }}>vs</span>}
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "15px", color: "#e0eaf8" }}>{m.away}</span>
          <span style={{ fontSize: "18px" }}>{at.flag}</span>
        </div>
        {matchPreds.length === 0
          ? <p style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "monospace", textAlign: "center" }}>Nadie ha enviado pronóstico</p>
          : matchPreds.map(pred => (
            <div key={pred.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 10px", background: "rgba(255,255,255,0.02)", borderRadius: "6px", marginBottom: "3px" }}>
              <span style={{ fontSize: "12px", color: "#c0d8f0", fontFamily: "monospace", flex: 1 }}>{getName(pred.user_id)}</span>
              <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#e0eefa" }}>{pred.predicted_home}-{pred.predicted_away}</span>
              {pred.points !== null && pred.points !== undefined && <span style={{ padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontFamily: "monospace", fontWeight: 700, background: pred.points === 3 ? GREEN_DIM : pred.points === 1 ? "rgba(255,193,7,0.1)" : "rgba(255,82,82,0.08)", color: pred.points === 3 ? GREEN : pred.points === 1 ? "#b8860b" : "#cc2222" }}>{pred.points === 3 ? "🎯 +3" : pred.points === 1 ? "✓ +1" : "✗ +0"}</span>}
            </div>
          ))}

        {/* ← AÑADIR ESTO */}
        <MatchChat match={m} user={user} />
      </div>
    );
  };

  if (loading) return <p style={{ color: "#d0e4f7", fontFamily: "monospace" }}>Cargando...</p>;
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
    <SpecialPredictionsTableCollapsible currentUserId={user.id} />
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "12px" }}>PRONÓSTICOS DE TODOS</p>
      <div style={{ display: "flex", marginBottom: "16px", background: "rgba(0,0,0,0.35)", borderRadius: "8px", padding: "3px" }}>
        {[{ id: "day", label: "Por día" }, { id: "all", label: "Todos" }].map(opt => <button key={opt.id} onClick={() => setViewMode(opt.id)} style={{ flex: 1, padding: "9px", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "11px", letterSpacing: "2px", fontFamily: "monospace", textTransform: "uppercase", background: viewMode === opt.id ? GREEN : "transparent", color: viewMode === opt.id ? "#0a1628" : "#e0eefa", fontWeight: 700 }}>{opt.label}</button>)}
      </div>
      {viewMode === "day" && (
        <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "8px", marginBottom: "16px" }}>
          {days.map(day => {
            const hasClosed = closedMatches.some(m => m.match_date === day);
            return <button key={day} onClick={() => setSelectedDay(day)} disabled={!hasClosed} style={{ padding: "7px 12px", border: `1px solid ${currentDay === day ? GREEN : BORDER}`, borderRadius: "8px", cursor: hasClosed ? "pointer" : "default", whiteSpace: "nowrap", background: currentDay === day ? GREEN_DIM : CARD, color: currentDay === day ? GREEN : hasClosed ? "#a8d4f0" : "#7ab8e0", fontFamily: "monospace", fontSize: "11px", flexShrink: 0, opacity: hasClosed ? 1 : 0.4 }}>{formatDate(day)}</button>;
          })}
        </div>
      )}
      {viewMode === "day"
        ? matchesByDay(currentDay).length === 0 ? <p style={{ color: "#c0d8f0", fontFamily: "monospace" }}>No hay partidos cerrados este día</p> : matchesByDay(currentDay).map(m => renderMatchPreds(m))
        : closedMatches.length === 0 ? <p style={{ color: "#c0d8f0", fontFamily: "monospace" }}>Aún no hay partidos cerrados</p> : days.map(day => { const dm = matchesByDay(day); if (!dm.length) return null; return <div key={day} style={{ marginBottom: "20px" }}><p style={{ fontSize: "9px", color: GREEN, fontFamily: "monospace", letterSpacing: "3px", marginBottom: "10px" }}>📅 {formatDate(day)}</p>{dm.map(m => renderMatchPreds(m))}</div>; })
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

  if (loading) return <p style={{ color: "#d0e4f7", fontFamily: "monospace" }}>Cargando...</p>;

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
      <div style={{ fontSize: "9px", color: "#e0eefa", fontFamily: "monospace", marginTop: "3px", letterSpacing: "1px" }}>{label}</div>
      {sub && <div style={{ fontSize: "8px", color: "#d0e4f7", fontFamily: "monospace", marginTop: "2px" }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: GREEN_DIM, border: `1px solid rgba(245,158,11,0.3)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: GREEN }}>{user.name?.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: "#e0eaf8", letterSpacing: "1px" }}>{user.name}</div>
          <div style={{ fontSize: "9px", color: "#e0eefa", fontFamily: "monospace" }}>{myPreds.length} pronósticos enviados · {evaluated.length} evaluados</div>
        </div>
      </div>

      <div style={{ display: "flex", marginBottom: "20px", background: "rgba(0,0,0,0.35)", borderRadius: "8px", padding: "3px" }}>
        {[{ id: "stats", label: "Estadísticas" }, { id: "compare", label: "Comparar" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "9px", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "11px", letterSpacing: "2px", fontFamily: "monospace", textTransform: "uppercase", background: tab === t.id ? GREEN : "transparent", color: tab === t.id ? "#0a1628" : "#e0eefa", fontWeight: 700 }}>{t.label}</button>
        ))}
      </div>

      {tab === "stats" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>
            {statCard("PUNTOS", total)}
            {statCard("EXACTOS 🎯", exactos, `${pctExactos}% de éxito`)}
            {statCard("PARCIALES", parciales, null, "#b8860b")}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
            {statCard("FALLOS", fallos, null, "#cc2222")}
            {bestGroup ? statCard("MEJOR GRUPO", `Grupo ${bestGroup[0]}`, `${bestGroup[1].pts} pts`) : statCard("MEJOR GRUPO", "-")}
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "14px", marginBottom: "16px" }}>
            <p style={{ fontSize: "9px", color: "#e0eefa", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "12px" }}>DESGLOSE POR GRUPO</p>
            {Object.keys(GROUPS).map(grp => {
              const g = byGroup[grp];
              if (!g.count) return null;
              return (
                <div key={grp} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "14px", color: GREEN, minWidth: "20px" }}>{grp}</span>
                  <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: "3px", height: "5px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min(100, (g.pts / (g.count * 3)) * 100)}%`, background: GREEN, borderRadius: "3px" }} />
                  </div>
                  <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#c0d8f0", minWidth: "40px", textAlign: "right" }}>{g.pts} pts</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === "compare" && (
        <>
          <p style={{ fontSize: "9px", color: "#e0eefa", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "10px" }}>COMPARA CON OTRO JUGADOR</p>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
            {profiles.filter(p => p.id !== user.id).map(p => (
              <button key={p.id} onClick={() => setCompareWith(compareWith === p.id ? null : p.id)} style={{ padding: "7px 12px", border: `1px solid ${compareWith === p.id ? GREEN : BORDER}`, borderRadius: "8px", background: compareWith === p.id ? GREEN_DIM : CARD, color: compareWith === p.id ? GREEN : "#a8d4f0", fontFamily: "monospace", fontSize: "11px", cursor: "pointer" }}>{p.name}</button>
            ))}
          </div>

          {compareWith && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "8px", marginBottom: "16px", alignItems: "center" }}>
                <div style={{ background: GREEN_DIM, border: "1px solid rgba(245,158,11,0.2)", borderRadius: "10px", padding: "14px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: GREEN }}>{total}</div>
                  <div style={{ fontSize: "9px", color: "#cce0f5", fontFamily: "monospace" }}>{user.name?.split(" ")[0]}</div>
                </div>
                <div style={{ textAlign: "center", fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#d0e4f7" }}>VS</div>
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "14px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: "#e0eefa" }}>{otherTotal}</div>
                  <div style={{ fontSize: "9px", color: "#cce0f5", fontFamily: "monospace" }}>{profiles.find(p => p.id === compareWith)?.name?.split(" ")[0]}</div>
                </div>
              </div>

              {commonMatches.length === 0
                ? <p style={{ color: "#c0d8f0", fontFamily: "monospace", fontSize: "12px" }}>Aún no hay partidos evaluados en común</p>
                : commonMatches.slice(0, 20).map(m => {
                  const mine = myPreds.find(p => p.match_id === m.id);
                  const theirs = otherPreds.find(p => p.match_id === m.id);
                  const ht = getTeam(m.home), at = getTeam(m.away);
                  return (
                    <div key={m.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "8px", padding: "10px 12px", marginBottom: "5px" }}>
                      <div style={{ fontSize: "10px", color: "#cce0f5", fontFamily: "monospace", textAlign: "center", marginBottom: "6px" }}>{ht.flag} {m.home} vs {at.flag} {m.away} · <span style={{ color: GREEN }}>{m.result_home}-{m.result_away}</span></div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ textAlign: "left" }}>
                          <span style={{ fontFamily: "monospace", fontSize: "13px", color: "#e0eefa" }}>{mine?.predicted_home}-{mine?.predicted_away}</span>
                          {mine?.points !== null && <span style={{ marginLeft: "6px", fontSize: "11px", color: mine?.points === 3 ? GREEN : mine?.points === 1 ? "#b8860b" : "#cc2222" }}>{mine?.points === 3 ? "🎯+3" : mine?.points === 1 ? "✓+1" : "✗+0"}</span>}
                        </div>
                        <div style={{ textAlign: "right" }}>
                          {theirs?.points !== null && <span style={{ marginRight: "6px", fontSize: "11px", color: theirs?.points === 3 ? GREEN : theirs?.points === 1 ? "#b8860b" : "#cc2222" }}>{theirs?.points === 3 ? "🎯+3" : theirs?.points === 1 ? "✓+1" : "✗+0"}</span>}
                          <span style={{ fontFamily: "monospace", fontSize: "13px", color: "#e0eefa" }}>{theirs?.predicted_home}-{theirs?.predicted_away}</span>
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
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadRanking = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    const { data: profiles } = await supabase.from("profiles").select("*").eq("role", "user");
    const { data: preds } = await supabase.from("predictions").select("*");
    const { data: qpicks } = await supabase.from("qualifier_picks").select("*");
    const { data: specialPreds } = await supabase.from("special_predictions").select("*");
    const r = (profiles || []).map(p => {
      const myPreds = (preds || []).filter(x => x.user_id === p.id && x.points !== null);
      const myPicks = (qpicks || []).filter(x => x.user_id === p.id);
      const qualPts = myPicks.reduce((s, pick) => s + (pick.points || 0), 0);
      const mySpecial = (specialPreds || []).find(x => x.user_id === p.id);
      const specialPts = mySpecial
        ? (mySpecial.top_scorer_points || 0) + (mySpecial.best_player_points || 0)
        : 0;
      return {
        ...p,
        total: myPreds.reduce((s, x) => s + (x.points || 0), 0) + qualPts + specialPts,
        exactos: myPreds.filter(x => x.points === 3).length,
        count: myPreds.length,
        qualPts, specialPts,
      };
    }).sort((a, b) => b.total - a.total);
    setRanking(r);
    setLoading(false);
    setLastUpdated(new Date());
    if (showRefresh) setRefreshing(false);
  };

  useEffect(() => {
    loadRanking();
    const channel = supabase
      .channel("ranking_realtime")
      .on("postgres_changes", {
        event: "UPDATE", schema: "public", table: "predictions",
      }, () => loadRanking())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const medals = ["🥇", "🥈", "🥉"];
  const formatTime = d => d
    ? `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`
    : "";

  if (loading) return <p style={{ color: "#d0e4f7", fontFamily: "monospace" }}>Cargando...</p>;

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "3px" }}>
          RANKING GENERAL
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {lastUpdated && (
            <span style={{ fontSize: "9px", color: "#7ab8e0", fontFamily: "monospace" }}>
              🟢 {formatTime(lastUpdated)}
            </span>
          )}
          <button
            onClick={() => loadRanking(true)}
            disabled={refreshing}
            style={{
              padding: "5px 10px", border: `1px solid ${BORDER}`,
              borderRadius: "6px", background: "transparent",
              color: refreshing ? "#7ab8e0" : GREEN,
              fontFamily: "monospace", fontSize: "10px",
              cursor: refreshing ? "default" : "pointer",
              animation: refreshing ? "pulse 1s infinite" : "none",
            }}>
            {refreshing ? "···" : "↻ Actualizar"}
          </button>
        </div>
      </div>

      {ranking.map((u, i) => (
        <div key={u.id} style={{
          display: "flex", alignItems: "center", gap: "12px",
          background: i === 0 ? GREEN_DIM : CARD,
          border: i === 0 ? `1px solid rgba(79,195,247,0.3)` : `1px solid ${BORDER}`,
          borderRadius: "10px", padding: "14px 16px", marginBottom: "6px",
        }}>
          <span style={{ fontSize: "20px", minWidth: "28px" }}>{medals[i] || `#${i + 1}`}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "monospace", fontSize: "14px", color: "#e0eaf8" }}>{u.name}</div>
            <div style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "monospace", marginTop: "2px" }}>
              {u.exactos} exactos · {u.count} eval.
              {u.qualPts > 0 ? ` · +${u.qualPts} clasificados` : ""}
              {u.specialPts > 0 ? ` · +${u.specialPts} especiales` : ""}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "30px", color: i === 0 ? GREEN : "#e0eaf8", lineHeight: 1 }}>{u.total}</div>
            <div style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "monospace" }}>PTS</div>
          </div>
        </div>
      ))}

      <div style={{ marginTop: "16px", padding: "12px 14px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: "8px" }}>
        <p style={{ color: "#c0d8f0", fontFamily: "monospace", fontSize: "10px", lineHeight: 2 }}>
          <span style={{ color: GREEN }}>+3</span> exacto · <span style={{ color: "#b8860b" }}>+1</span> signo · <span style={{ color: "#ff6b4a" }}>+0</span> fallo · <span style={{ color: GREEN }}>+2</span> clasificado acertado
        </p>
      </div>
    </div>
  );
}

// ============================================================
// PROGRESO DE PARTICIPANTES (nuevo componente)
// ============================================================
function ParticipantProgress() {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: profiles } = await supabase.from("profiles").select("*").eq("role", "user");
      const { data: preds } = await supabase.from("predictions").select("user_id");
      const result = (profiles || []).map(p => {
        const count = (preds || []).filter(x => x.user_id === p.id).length;
        const pct = Math.round((count / TOTAL_MATCHES) * 100);
        return { name: p.name, count, pct };
      }).sort((a, b) => b.count - a.count);
      setProgress(result);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p style={{ color: "#d0e4f7", fontFamily: "monospace", fontSize: "11px" }}>Cargando...</p>;

  return (
    <div>
      {progress.map((p, i) => (
        <div key={i} style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#e0eaf8" }}>{p.name}</span>
            <span style={{ fontFamily: "monospace", fontSize: "11px", color: p.count === TOTAL_MATCHES ? GREEN : "#e0eefa" }}>
              {p.count}/{TOTAL_MATCHES} · {p.pct}%
            </span>
          </div>
          <div style={{ background: "rgba(245,158,11,0.08)", borderRadius: "4px", height: "5px", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: p.pct + "%",
              background: p.count === TOTAL_MATCHES
                ? `linear-gradient(90deg,${GREEN},#007a3a)`
                : `linear-gradient(90deg,${GREEN},#005599)`,
              borderRadius: "4px",
              transition: "width 0.5s ease"
            }} />
          </div>
        </div>
      ))}
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
  const [syncingMatches, setSyncingMatches] = useState(false);
  const [confirmSync, setConfirmSync] = useState(false);

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

  const syncMatchData = async () => {
    setSyncingMatches(true);
    const { data: dbMatches } = await supabase.from("matches").select("*");
    if (dbMatches) {
      const updates = [];
      for (const m of dbMatches) {
        const local = ALL_MATCHES.find(x => x.id === m.id);
        if (local) {
          updates.push(
            supabase.from("matches").update({
              home: local.home,
              away: local.away,
              match_date: local.match_date,
              match_time: local.match_time,
              grp: local.grp,
              competition: local.competition,
            }).eq("id", m.id)
          );
        }
      }
      await Promise.all(updates);
    }
    setSyncingMatches(false);
    setConfirmSync(false);
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
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "16px" }}>PANEL DE ADMINISTRACIÓN</p>

      {/* PROGRESO DE PARTICIPANTES */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "14px", marginBottom: "20px" }}>
        <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "12px" }}>PROGRESO DE PARTICIPANTES</p>
        <ParticipantProgress />
      </div>

      {/* BOTÓN CERRAR TODO */}
      <div style={{ background: CARD, border: "1px solid rgba(255,82,82,0.2)", borderRadius: "10px", padding: "14px", marginBottom: "20px" }}>
        <p style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "monospace", marginBottom: "10px" }}>
          🔒 Cierra todos los pronósticos de golpe al inicio del torneo. Una vez cerrado, los usuarios no podrán modificar sus pronósticos.
        </p>
        {allClosed
          ? <div style={{ padding: "10px", background: "rgba(255,82,82,0.08)", borderRadius: "7px", textAlign: "center" }}><span style={{ color: "#cc4422", fontFamily: "monospace", fontSize: "12px" }}>🔒 TODOS LOS PRONÓSTICOS ESTÁN CERRADOS</span></div>
          : confirmClose
            ? <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={closeAll} disabled={closingAll} style={{ flex: 1, padding: "12px", border: "none", borderRadius: "7px", background: "#cc2222", color: "white", fontFamily: "monospace", fontSize: "12px", cursor: "pointer", fontWeight: 700 }}>{closingAll ? "Cerrando..." : "⚠️ SÍ, CERRAR TODO"}</button>
              <button onClick={() => setConfirmClose(false)} style={{ padding: "12px 16px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#cce0f5", fontFamily: "monospace", fontSize: "12px", cursor: "pointer" }}>Cancelar</button>
            </div>
            : <button onClick={() => setConfirmClose(true)} style={{ width: "100%", padding: "12px", border: "1px solid rgba(255,82,82,0.3)", borderRadius: "7px", background: "rgba(255,82,82,0.08)", color: "#cc2222", fontFamily: "monospace", fontSize: "12px", cursor: "pointer", fontWeight: 700, letterSpacing: "2px" }}>🔒 CERRAR TODOS LOS PRONÓSTICOS</button>
        }
      </div>

      {/* SINCRONIZAR PARTIDOS */}
      <div style={{ background: CARD, border: "1px solid rgba(0,176,255,0.2)", borderRadius: "10px", padding: "14px", marginBottom: "20px" }}>
        <p style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "monospace", marginBottom: "10px" }}>
          🔄 Sincroniza equipos, fechas y horas desde el código sin borrar resultados ni predicciones.
        </p>
        {confirmSync
          ? <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={syncMatchData} disabled={syncingMatches} style={{ flex: 1, padding: "12px", border: "none", borderRadius: "7px", background: "#005599", color: "#0a1628", fontFamily: "monospace", fontSize: "12px", cursor: "pointer", fontWeight: 700 }}>
                {syncingMatches ? "Sincronizando..." : "✓ SÍ, SINCRONIZAR"}
              </button>
              <button onClick={() => setConfirmSync(false)} style={{ padding: "12px 16px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#cce0f5", fontFamily: "monospace", fontSize: "12px", cursor: "pointer" }}>
                Cancelar
              </button>
            </div>
          : <button onClick={() => setConfirmSync(true)} style={{ width: "100%", padding: "12px", border: "1px solid rgba(0,176,255,0.3)", borderRadius: "7px", background: "rgba(0,176,255,0.06)", color: "#005599", fontFamily: "monospace", fontSize: "12px", cursor: "pointer", fontWeight: 700, letterSpacing: "2px" }}>
              🔄 SINCRONIZAR PARTIDOS (SIN BORRAR RESULTADOS)
            </button>
        }
      </div>

      {/* ADJUDICAR PRONÓSTICOS ESPECIALES */}
      <SpecialAwardsAdmin />
        
      {saved && <div style={{ padding: "10px 14px", background: GREEN_DIM, border: "1px solid rgba(245,158,11,0.3)", borderRadius: "8px", color: GREEN, fontFamily: "monospace", fontSize: "12px", marginBottom: "14px" }}>✓ Resultado guardado y puntos calculados</div>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
        {Object.keys(GROUPS).map(gr => <button key={gr} onClick={() => setG(gr)} style={{ width: "38px", height: "38px", border: `1px solid ${g === gr ? GREEN : BORDER}`, borderRadius: "7px", cursor: "pointer", fontFamily: "'Bebas Neue', cursive", fontSize: "17px", background: g === gr ? GREEN_DIM : CARD, color: g === gr ? GREEN : "#e0eefa" }}>{gr}</button>)}
      </div>
      <p style={{ fontSize: "9px", color: GREEN, fontFamily: "monospace", letterSpacing: "3px", marginBottom: "10px" }}>GRUPO {g}</p>

      {matches.filter(m => m.grp === g).map(m => {
        const ht = getTeam(m.home), at = getTeam(m.away);
        return (
          <div key={m.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px", marginBottom: "6px" }}>
            <div style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", marginBottom: "6px" }}>📅 {formatDate(m.match_date)} · ⏰ {m.match_time}h</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ flex: 1, fontSize: "12px", color: "#a8d4f0", fontFamily: "monospace", minWidth: "150px" }}>{ht.flag} {m.home} vs {at.flag} {m.away}</span>
              <span style={{ fontSize: "9px", fontFamily: "monospace", padding: "2px 7px", borderRadius: "8px", background: m.status === "open" ? "rgba(0,200,100,0.08)" : "rgba(255,100,50,0.08)", color: m.status === "open" ? "#007a3a" : "#cc4422" }}>{m.status === "open" ? "ABIERTO" : "CERRADO"}</span>
              {m.result_home !== null && <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: GREEN }}>{m.result_home}-{m.result_away}</span>}
              <button onClick={() => toggleStatus(m)} style={{ padding: "4px 10px", border: `1px solid ${BORDER}`, borderRadius: "5px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontSize: "9px", fontFamily: "monospace" }}>{m.status === "open" ? "Cerrar" : "Reabrir"}</button>
              {sel === m.id
                ? <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                  <input value={hr} onChange={e => setHr(e.target.value)} type="number" min="0" style={{ ...smallSt, width: "44px" }} placeholder="0" />
                  <span style={{ color: "#b8d4ee" }}>-</span>
                  <input value={ar} onChange={e => setAr(e.target.value)} type="number" min="0" style={{ ...smallSt, width: "44px" }} placeholder="0" />
                  <button onClick={handleResult} style={{ padding: "6px 14px", border: "none", borderRadius: "6px", background: GREEN, color: "#0a1628", cursor: "pointer", fontSize: "11px", fontFamily: "monospace", fontWeight: 700 }}>OK</button>
                  <button onClick={() => setSel(null)} style={{ padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "6px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontSize: "11px", fontFamily: "monospace" }}>✕</button>
                </div>
                : <button onClick={() => { setSel(m.id); setHr(""); setAr(""); }} style={{ padding: "5px 12px", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "5px", background: GREEN_DIM, color: GREEN, cursor: "pointer", fontSize: "9px", fontFamily: "monospace" }}>Resultado</button>
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SpecialPredictions({ userId, locked }) {
  const [topScorer, setTopScorer] = useState(null);
  const [bestPlayer, setBestPlayer] = useState(null);
  const [saved, setSaved] = useState({ scorer: false, player: false });
  const [loading, setLoading] = useState(true);
  const [inputScorer, setInputScorer] = useState("");
  const [inputPlayer, setInputPlayer] = useState("");
  const [activeTab, setActiveTab] = useState("scorer");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("special_predictions")
        .select("*")
        .eq("user_id", userId)
        .single();
      if (data) {
        setTopScorer(data.top_scorer || null);
        setBestPlayer(data.best_player || null);
        setInputScorer(data.top_scorer || "");
        setInputPlayer(data.best_player || "");
      }
      setLoading(false);
    })();
  }, [userId]);

  const savePick = async (field, value) => {
    if (locked || !value.trim()) return;
    const { error } = await supabase
      .from("special_predictions")
      .upsert({ user_id: userId, [field]: value.trim() }, { onConflict: "user_id" });
    if (!error) {
      const key = field === "top_scorer" ? "scorer" : "player";
      if (field === "top_scorer") setTopScorer(value.trim());
      else setBestPlayer(value.trim());
      setSaved(s => ({ ...s, [key]: true }));
      setTimeout(() => setSaved(s => ({ ...s, [key]: false })), 2000);
    }
  };

  const clearPick = async (field) => {
    if (locked) return;
    await supabase
      .from("special_predictions")
      .upsert({ user_id: userId, [field]: null }, { onConflict: "user_id" });
    if (field === "top_scorer") { setTopScorer(null); setInputScorer(""); }
    else { setBestPlayer(null); setInputPlayer(""); }
  };

  if (loading) return null;

  const renderTab = (field) => {
    const isScorer = field === "top_scorer";
    const current = isScorer ? topScorer : bestPlayer;
    const input = isScorer ? inputScorer : inputPlayer;
    const setInput = isScorer ? setInputScorer : setInputPlayer;
    const savedKey = isScorer ? "scorer" : "player";
    const icon = isScorer ? "⚽" : "🏅";
    const label = isScorer ? "máximo goleador" : "mejor jugador";

    return (
      <div>
        {/* Selección guardada */}
        {current ? (
          <div style={{
            display: "flex", alignItems: "center", gap: "10px", padding: "12px",
            background: GREEN_DIM, border: `1px solid ${BORDER}`,
            borderRadius: "10px", marginBottom: "14px"
          }}>
            <span style={{ fontSize: "26px" }}>{icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "17px", color: GREEN }}>
                {current}
              </div>
              <div style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace" }}>
                Tu pronóstico de {label}
              </div>
            </div>
            {saved[savedKey] && (
              <span style={{ color: GREEN, fontFamily: "monospace", fontSize: "12px" }}>✓ guardado</span>
            )}
            {!locked && (
              <button onClick={() => clearPick(field)}
                style={{ padding: "4px 8px", border: `1px solid rgba(204,34,34,0.3)`, borderRadius: "6px", background: "rgba(204,34,34,0.06)", color: "#cc2222", cursor: "pointer", fontSize: "10px", fontFamily: "monospace" }}>
                ✕
              </button>
            )}
          </div>
        ) : (
          <div style={{
            padding: "12px", background: "rgba(26,58,107,0.04)",
            border: `1px dashed ${BORDER}`, borderRadius: "10px",
            marginBottom: "14px", textAlign: "center"
          }}>
            <span style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "monospace" }}>
              {locked ? `No enviaste pronóstico de ${label}` : `Escribe el nombre del ${label}`}
            </span>
          </div>
        )}

        {/* Input libre */}
        {!locked && (
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && savePick(field, input)}
                placeholder={`Ej: Kylian Mbappé, Erling Haaland...`}
                style={{ ...inputSt, marginBottom: "4px" }}
              />
              <p style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "monospace" }}>
                Escribe el nombre y pulsa Guardar o Enter
              </p>
            </div>
            <button
              onClick={() => savePick(field, input)}
              disabled={!input.trim() || input.trim() === current}
              style={{
                padding: "12px 16px", border: "none", borderRadius: "8px",
                background: input.trim() && input.trim() !== current ? GREEN : "rgba(26,58,107,0.1)",
                color: input.trim() && input.trim() !== current ? "white" : "#c0d8f0",
                fontFamily: "monospace", fontSize: "11px", fontWeight: 700,
                cursor: input.trim() && input.trim() !== current ? "pointer" : "default",
                whiteSpace: "nowrap", letterSpacing: "1px",
              }}>
              GUARDAR
            </button>
          </div>
        )}

        {locked && current && (
          <p style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "monospace", textAlign: "center", marginTop: "8px" }}>
            🔒 Pronóstico cerrado
          </p>
        )}
      </div>
    );
  };

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "14px" }}>
        PRONÓSTICOS ESPECIALES · +5 PTS c/u
      </p>

      {/* Tabs */}
      <div style={{ display: "flex", marginBottom: "16px", background: "rgba(26,58,107,0.06)", borderRadius: "8px", padding: "3px" }}>
        {[
          { id: "scorer", icon: "⚽", label: "Máx. Goleador" },
          { id: "player", icon: "🏅", label: "Mejor Jugador" },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, padding: "9px 4px", border: "none", borderRadius: "6px", cursor: "pointer",
            background: activeTab === t.id ? GREEN : "transparent",
            color: activeTab === t.id ? "white" : "#e0eefa",
            fontFamily: "monospace", fontSize: "10px", fontWeight: 700, letterSpacing: "1px",
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {activeTab === "scorer" && renderTab("top_scorer")}
      {activeTab === "player" && renderTab("best_player")}
    </div>
  );
}

// ============================================================
// TABLA PRONÓSTICOS ESPECIALES DE TODOS
// ============================================================
function SpecialPredictionsTable({ currentUserId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("scorer");

  useEffect(() => {
    (async () => {
      const { data: specials } = await supabase.from("special_predictions").select("*");
      const { data: profiles } = await supabase.from("profiles").select("*").eq("role", "user");
      const merged = (profiles || []).map(p => {
        const sp = (specials || []).find(x => x.user_id === p.id);
        return {
          name: p.name,
          isMe: p.id === currentUserId,
          top_scorer: sp?.top_scorer || null,
          best_player: sp?.best_player || null,
        };
      }).sort((a, b) => a.name.localeCompare(b.name));
      setData(merged);
      setLoading(false);
    })();
  }, [currentUserId]);

  if (loading) return null;

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "14px" }}>
        PRONÓSTICOS ESPECIALES · TODOS
      </p>

      {/* Tabs */}
      <div style={{ display: "flex", marginBottom: "14px", background: "rgba(26,58,107,0.06)", borderRadius: "8px", padding: "3px" }}>
        {[
          { id: "scorer", icon: "⚽", label: "Máx. Goleador" },
          { id: "player", icon: "🏅", label: "Mejor Jugador" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "9px 4px", border: "none", borderRadius: "6px", cursor: "pointer",
            background: tab === t.id ? GREEN : "transparent",
            color: tab === t.id ? "white" : "#e0eefa",
            fontFamily: "monospace", fontSize: "10px", fontWeight: 700, letterSpacing: "1px",
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {/* Cabecera */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", padding: "4px 10px" }}>
          <span style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "1px" }}>JUGADOR</span>
          <span style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "1px" }}>
            {tab === "scorer" ? "MÁXIMO GOLEADOR" : "MEJOR JUGADOR"}
          </span>
        </div>

        {data.map((u, i) => {
          const value = tab === "scorer" ? u.top_scorer : u.best_player;
          return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px",
              padding: "10px", borderRadius: "8px",
              background: u.isMe ? GREEN_DIM : "rgba(255,255,255,0.5)",
              border: u.isMe ? `1px solid rgba(26,58,107,0.3)` : `1px solid ${BORDER}`,
              borderLeft: u.isMe ? `3px solid ${GREEN}` : "3px solid transparent",
            }}>
              <span style={{
                fontSize: "12px", fontFamily: "monospace",
                color: u.isMe ? GREEN : "#e0eaf8",
                fontWeight: u.isMe ? 700 : 400,
                display: "flex", alignItems: "center", gap: "4px",
              }}>
                {u.isMe && <span style={{ fontSize: "9px", color: GREEN }}>▶</span>}
                {u.name}
              </span>
              <span style={{
                fontSize: "12px", fontFamily: "monospace",
                color: value ? "#e0eaf8" : "#6aacda",
                fontStyle: value ? "normal" : "italic",
              }}>
                {value || "Sin pronóstico"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
                
function SpecialAwardsAdmin() {
  const [topScorer, setTopScorer] = useState("");
  const [bestPlayer, setBestPlayer] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const award = async () => {
    if (!topScorer && !bestPlayer) return;
    setSaving(true);
    const { data: preds } = await supabase.from("special_predictions").select("*");
    for (const u of (preds || [])) {
      await supabase.from("special_predictions").update({
        top_scorer_points: topScorer && u.top_scorer?.toLowerCase().trim() === topScorer.toLowerCase().trim() ? 5 : u.top_scorer_points,
        best_player_points: bestPlayer && u.best_player?.toLowerCase().trim() === bestPlayer.toLowerCase().trim() ? 5 : u.best_player_points,
      }).eq("id", u.id);
    }
    setSaving(false); setDone(true);
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <div style={{ background: CARD, border: "1px solid rgba(0,200,100,0.2)", borderRadius: "10px", padding: "14px", marginBottom: "20px" }}>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "12px" }}>
        🏅 ADJUDICAR PRONÓSTICOS ESPECIALES
      </p>
      <p style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "monospace", marginBottom: "12px" }}>
        Escribe el nombre exacto del ganador. Se compara sin distinguir mayúsculas.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "12px" }}>
        <div>
          <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", marginBottom: "4px" }}>⚽ MÁXIMO GOLEADOR</p>
          <input
            value={topScorer}
            onChange={e => setTopScorer(e.target.value)}
            placeholder="Ej: Kylian Mbappé"
            style={{ ...inputSt, marginBottom: 0 }}
          />
        </div>
        <div>
          <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", marginBottom: "4px" }}>🏅 MEJOR JUGADOR</p>
          <input
            value={bestPlayer}
            onChange={e => setBestPlayer(e.target.value)}
            placeholder="Ej: Lamine Yamal"
            style={{ ...inputSt, marginBottom: 0 }}
          />
        </div>
      </div>
      {done && (
        <p style={{ color: "#007a3a", fontFamily: "monospace", fontSize: "11px", marginBottom: "8px" }}>
          ✓ Puntos adjudicados correctamente
        </p>
      )}
      <button onClick={award} disabled={saving || (!topScorer && !bestPlayer)}
        style={{
          width: "100%", padding: "11px", borderRadius: "7px",
          background: "rgba(0,200,100,0.12)", color: "#007a3a",
          fontFamily: "monospace", fontSize: "11px", fontWeight: 700,
          cursor: "pointer", letterSpacing: "2px",
          border: "1px solid rgba(0,200,100,0.3)"
        }}>
        {saving ? "Guardando..." : "✓ ADJUDICAR PUNTOS"}
      </button>
    </div>
  );
}

// ============================================================
// EXPORTAR RANKING Y PRONÓSTICOS (solo admin)
// ============================================================
function ExportView({ matches, onBack }) {
  const [ranking, setRanking] = useState([]);
  const [allPreds, setAllPreds] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportType, setExportType] = useState("ranking");
  const rankingRef = useRef(null);
  const predsRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { data: profs } = await supabase.from("profiles").select("*").eq("role", "user");
      const { data: preds } = await supabase.from("predictions").select("*");
      const { data: qpicks } = await supabase.from("qualifier_picks").select("*");
      const { data: special } = await supabase.from("special_predictions").select("*");
      setProfiles(profs || []);
      setAllPreds(preds || []);
      const r = (profs || []).map(p => {
        const myPreds = (preds || []).filter(x => x.user_id === p.id && x.points !== null);
        const qualPts = (qpicks || []).filter(x => x.user_id === p.id).reduce((s, pick) => s + (pick.points || 0), 0);
        const mySpecial = (special || []).find(x => x.user_id === p.id);
        const specialPts = mySpecial ? (mySpecial.top_scorer_points || 0) + (mySpecial.best_player_points || 0) : 0;
        return {
          ...p,
          total: myPreds.reduce((s, x) => s + (x.points || 0), 0) + qualPts + specialPts,
          exactos: myPreds.filter(x => x.points === 3).length,
          parciales: myPreds.filter(x => x.points === 1).length,
          fallos: myPreds.filter(x => x.points === 0).length,
          count: myPreds.length,
          qualPts, specialPts,
        };
      }).sort((a, b) => b.total - a.total);
      setRanking(r);
      setLoading(false);
    })();
  }, []);

  const loadHtml2Canvas = () => new Promise(resolve => {
    if (window.html2canvas) { resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    s.onload = resolve;
    document.head.appendChild(s);
  });

  const exportImage = async (ref, filename) => {
    setExporting(true);
    try {
      await loadHtml2Canvas();
      const canvas = await window.html2canvas(ref.current, {
        backgroundColor: "#f0f4f8",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = filename;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Export error:", e);
    } finally {
      setExporting(false);
    }
  };

  const medals = ["🥇", "🥈", "🥉"];
  const playedMatches = matches.filter(m => m.result_home !== null);
  const getName = id => profiles.find(p => p.id === id)?.name || "?";
  const today = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });

  if (loading) return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <p style={{ color: "#d0e4f7", fontFamily: "monospace" }}>Cargando datos...</p>
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <button onClick={onBack} style={{ padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "monospace", fontSize: "11px" }}>← Volver</button>
        <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "3px" }}>EXPORTAR IMÁGENES</p>
      </div>

      {/* Selector tipo */}
      <div style={{ display: "flex", marginBottom: "16px", background: "rgba(26,58,107,0.06)", borderRadius: "8px", padding: "3px" }}>
        {[{ id: "ranking", label: "🏆 Ranking" }, { id: "preds", label: "⚽ Pronósticos" }].map(t => (
          <button key={t.id} onClick={() => setExportType(t.id)} style={{
            flex: 1, padding: "10px", border: "none", borderRadius: "6px", cursor: "pointer",
            background: exportType === t.id ? GREEN : "transparent",
            color: exportType === t.id ? "white" : "#e0eefa",
            fontFamily: "monospace", fontSize: "11px", fontWeight: 700,
          }}>{t.label}</button>
        ))}
      </div>

      {/* Botón exportar */}
      <button
        onClick={() => exportType === "ranking"
          ? exportImage(rankingRef, `ranking-porra-vallau-${today}.png`)
          : exportImage(predsRef, `pronosticos-porra-vallau-${today}.png`)
        }
        disabled={exporting}
        style={{
          width: "100%", padding: "14px", border: "none", borderRadius: "10px", marginBottom: "24px",
          background: exporting ? "rgba(26,58,107,0.1)" : `linear-gradient(135deg,${GREEN},#2a5aab)`,
          color: exporting ? "#c0d8f0" : "white",
          fontFamily: "monospace", fontSize: "13px", fontWeight: 800,
          cursor: exporting ? "default" : "pointer", letterSpacing: "2px",
        }}>
        {exporting ? "⏳ GENERANDO IMAGEN..." : "📸 DESCARGAR IMAGEN PNG"}
      </button>

      {/* Botón exportar JSON backup */}
<button
  onClick={() => {
    const backup = {
      fecha: new Date().toISOString(),
      ranking: ranking.map(u => ({
        nombre: u.name,
        puntos_totales: u.total,
        exactos: u.exactos,
        parciales: u.parciales,
        fallos: u.fallos,
        partidos_evaluados: u.count,
        puntos_clasificados: u.qualPts,
        puntos_especiales: u.specialPts,
      })),
      pronosticos: profiles.map(u => ({
        jugador: u.name,
        predicciones: allPreds
          .filter(p => p.user_id === u.id)
          .map(p => {
            const m = matches.find(x => x.id === p.match_id);
            return {
              partido: m ? `${m.home} vs ${m.away}` : p.match_id,
              grupo: m?.grp || "-",
              fecha: m?.match_date || "-",
              pronostico: `${p.predicted_home}-${p.predicted_away}`,
              resultado: m?.result_home !== null ? `${m.result_home}-${m.result_away}` : "pendiente",
              puntos: p.points ?? "sin evaluar",
            };
          }),
      })),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.download = `backup-porra-vallau-${new Date().toLocaleDateString("es-ES").replace(/\//g, "-")}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
  }}
  style={{
    width: "100%", padding: "14px", border: `1px solid rgba(0,122,58,0.3)`,
    borderRadius: "10px", marginBottom: "24px",
    background: "rgba(0,122,58,0.08)",
    color: "#007a3a",
    fontFamily: "monospace", fontSize: "13px", fontWeight: 800,
    cursor: "pointer", letterSpacing: "2px",
  }}>
  💾 DESCARGAR BACKUP JSON
</button>

      {/* ===== PREVIEW RANKING ===== */}
      {exportType === "ranking" && (
        <div ref={rankingRef} style={{
          background: "#f0f4f8", padding: "28px", borderRadius: "16px",
          fontFamily: "monospace", maxWidth: "600px", margin: "0 auto",
          border: "1px solid rgba(26,58,107,0.1)",
        }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "24px", paddingBottom: "18px", borderBottom: "2px solid rgba(26,58,107,0.12)" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "40px", color: GREEN, letterSpacing: "4px", lineHeight: 1 }}>PORRA VALLAU</div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: "#e0eefa", letterSpacing: "6px", marginTop: "2px" }}>MUNDIAL 2026</div>
            <div style={{ fontSize: "10px", color: "#c0d8f0", marginTop: "6px", letterSpacing: "2px" }}>🏆 RANKING GENERAL · {today.toUpperCase()}</div>
          </div>

          {/* Podio top 3 */}
          {ranking.length >= 3 && (
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "8px", marginBottom: "24px" }}>
              {[{ i: 1, h: 80, fs: 28, emoji: "🥈" }, { i: 0, h: 100, fs: 36, emoji: "🥇" }, { i: 2, h: 64, fs: 22, emoji: "🥉" }].map(({ i, h, fs, emoji }) => (
                <div key={i} style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ fontSize: i === 0 ? "38px" : "28px", marginBottom: "4px" }}>{emoji}</div>
                  <div style={{
                    background: i === 0 ? GREEN : "white",
                    borderRadius: "10px 10px 0 0", padding: "10px 6px",
                    height: `${h}px`, display: "flex", flexDirection: "column",
                    justifyContent: "center", alignItems: "center",
                    boxShadow: i === 0 ? "0 4px 16px rgba(26,58,107,0.2)" : "0 2px 8px rgba(26,58,107,0.08)",
                  }}>
                    <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: `${fs}px`, color: i === 0 ? "white" : GREEN, lineHeight: 1 }}>{ranking[i].total}</div>
                    <div style={{ fontSize: "10px", color: i === 0 ? "rgba(255,255,255,0.85)" : "#e0eefa", fontWeight: 700, marginTop: "3px" }}>{ranking[i].name?.split(" ")[0]}</div>
                    <div style={{ fontSize: "8px", color: i === 0 ? "rgba(255,255,255,0.6)" : "#c0d8f0", marginTop: "1px" }}>PTS</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tabla completa */}
          <div style={{ background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 12px rgba(26,58,107,0.08)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 48px 48px 48px 56px", padding: "8px 14px", background: GREEN, gap: "4px" }}>
              {["#", "JUGADOR", "🎯", "✓", "✗", "PTS"].map(h => (
                <span key={h} style={{ fontSize: "9px", color: "rgba(255,255,255,0.85)", fontFamily: "monospace", letterSpacing: "1px", textAlign: h === "JUGADOR" ? "left" : "center" }}>{h}</span>
              ))}
            </div>
            {ranking.map((u, i) => (
              <div key={u.id} style={{
                display: "grid", gridTemplateColumns: "32px 1fr 48px 48px 48px 56px",
                padding: "10px 14px", gap: "4px", alignItems: "center",
                background: i % 2 === 0 ? "white" : "rgba(26,58,107,0.03)",
                borderBottom: "1px solid rgba(26,58,107,0.06)",
              }}>
                <span style={{ fontSize: "14px", textAlign: "center" }}>{medals[i] || `#${i + 1}`}</span>
                <div>
                  <div style={{ fontSize: "12px", color: "#e0eaf8", fontWeight: i < 3 ? 700 : 400 }}>{u.name}</div>
                  <div style={{ fontSize: "8px", color: "#c0d8f0" }}>{u.count} eval.</div>
                </div>
                <span style={{ fontSize: "11px", color: "#007a3a", textAlign: "center", fontWeight: 700 }}>{u.exactos}</span>
                <span style={{ fontSize: "11px", color: "#b8860b", textAlign: "center" }}>{u.parciales}</span>
                <span style={{ fontSize: "11px", color: "#cc2222", textAlign: "center" }}>{u.fallos}</span>
                <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: i === 0 ? GREEN : "#e0eaf8", textAlign: "center" }}>{u.total}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid rgba(26,58,107,0.1)" }}>
            <span style={{ fontSize: "9px", color: "#c0d8f0", letterSpacing: "2px" }}>
              🎯 EXACTO +3 · ✓ SIGNO +1 · ✗ FALLO +0
            </span>
          </div>
        </div>
      )}

      {/* ===== PREVIEW PRONÓSTICOS ===== */}
      {exportType === "preds" && (
        <div ref={predsRef} style={{
          background: "#f0f4f8", padding: "28px", borderRadius: "16px",
          fontFamily: "monospace", maxWidth: "700px", margin: "0 auto",
          border: "1px solid rgba(26,58,107,0.1)",
        }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "20px", paddingBottom: "16px", borderBottom: "2px solid rgba(26,58,107,0.12)" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "36px", color: GREEN, letterSpacing: "4px", lineHeight: 1 }}>PORRA VALLAU</div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#e0eefa", letterSpacing: "6px", marginTop: "2px" }}>PRONÓSTICOS · MUNDIAL 2026</div>
            <div style={{ fontSize: "10px", color: "#c0d8f0", marginTop: "6px", letterSpacing: "2px" }}>⚽ {playedMatches.length} PARTIDOS JUGADOS · {today.toUpperCase()}</div>
          </div>

          {/* Cabecera de jugadores */}
          <div style={{ display: "grid", gap: "2px", marginBottom: "8px", gridTemplateColumns: `180px repeat(${ranking.length}, 1fr)` }}>
            <div></div>
            {ranking.map(u => (
              <div key={u.id} style={{ textAlign: "center", padding: "6px 2px" }}>
                <div style={{ fontSize: "10px", color: GREEN, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name?.split(" ")[0]}</div>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "14px", color: "#e0eefa" }}>{u.total}</div>
              </div>
            ))}
          </div>

          {/* Partidos jugados */}
          {playedMatches.slice(0, 30).map((m, mi) => {
            const ht = getTeam(m.home), at = getTeam(m.away);
            return (
              <div key={m.id} style={{
                display: "grid", gap: "2px", alignItems: "center", padding: "6px 0",
                gridTemplateColumns: `180px repeat(${ranking.length}, 1fr)`,
                borderBottom: "1px solid rgba(26,58,107,0.07)",
                background: mi % 2 === 0 ? "transparent" : "rgba(26,58,107,0.02)",
                borderRadius: "4px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ fontSize: "13px" }}>{ht.flag}</span>
                  <span style={{ fontSize: "9px", color: "#e0eaf8", fontWeight: 700 }}>{m.result_home}-{m.result_away}</span>
                  <span style={{ fontSize: "13px" }}>{at.flag}</span>
                </div>
                {ranking.map(u => {
                  const pred = allPreds.find(p => p.match_id === m.id && p.user_id === u.id);
                  const pts = pred?.points;
                  return (
                    <div key={u.id} style={{ textAlign: "center" }}>
                      {pred ? (
                        <span style={{
                          fontSize: "10px", fontFamily: "monospace", fontWeight: 700,
                          color: pts === 3 ? "#007a3a" : pts === 1 ? "#b8860b" : "#cc2222",
                          background: pts === 3 ? "rgba(0,122,58,0.1)" : pts === 1 ? "rgba(184,134,11,0.1)" : "rgba(204,34,34,0.08)",
                          padding: "1px 4px", borderRadius: "4px",
                        }}>
                          {pred.predicted_home}-{pred.predicted_away}
                        </span>
                      ) : (
                        <span style={{ fontSize: "10px", color: "#c0cfe0" }}>—</span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Fila totales */}
          <div style={{
            display: "grid", gap: "2px", alignItems: "center", padding: "10px 0 0",
            gridTemplateColumns: `180px repeat(${ranking.length}, 1fr)`,
            borderTop: "2px solid rgba(26,58,107,0.15)", marginTop: "8px",
          }}>
            <div style={{ fontSize: "10px", color: "#e0eefa", fontWeight: 700, letterSpacing: "1px" }}>TOTAL PTS</div>
            {ranking.map(u => (
              <div key={u.id} style={{ textAlign: "center" }}>
                <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: GREEN }}>{u.total}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid rgba(26,58,107,0.1)" }}>
            <span style={{ fontSize: "9px", color: "#c0d8f0", letterSpacing: "2px" }}>
              🟢 EXACTO · 🟡 SIGNO · 🔴 FALLO
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PANTALLA DE INICIO
// ============================================================
function HomeView({ user, matches, predictions, setView }) {
  const sent = predictions.length;
  const pct = Math.round((sent / TOTAL_MATCHES) * 100);

  const navCard = (icon, label, sub, color, border, bg, target) => (
    <button onClick={() => setView(target)} style={{
      padding: "18px 12px", border: `1px solid ${border}`, borderRadius: "14px",
      background: bg, cursor: "pointer", textAlign: "center",
      display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
    }}>
      <span style={{ fontSize: "30px", lineHeight: 1 }}>{icon}</span>
      <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "14px", color: "#e0eaf8", letterSpacing: "2px" }}>{label}</span>
      {sub && <span style={{ fontSize: "9px", color, fontFamily: "monospace" }}>{sub}</span>}
    </button>
  );

  // Top 3 ranking rápido
  const [topRanking, setTopRanking] = useState([]);
  useEffect(() => {
    (async () => {
      const { data: profiles } = await supabase.from("profiles").select("*").eq("role", "user");
      const { data: preds } = await supabase.from("predictions").select("*");
      const { data: qpicks } = await supabase.from("qualifier_picks").select("*");
      const r = (profiles || []).map(p => {
        const myPreds = (preds || []).filter(x => x.user_id === p.id && x.points !== null);
        const qualPts = (qpicks || []).filter(x => x.user_id === p.id).reduce((s, pick) => s + (pick.points || 0), 0);
        return { name: p.name, total: myPreds.reduce((s, x) => s + (x.points || 0), 0) + qualPts };
      }).sort((a, b) => b.total - a.total).slice(0, 3);
      setTopRanking(r);
    })();
  }, []);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {/* Cuenta atrás */}
      <CountdownBanner />

      {/* Grid de accesos */}
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "12px" }}>ACCESO RÁPIDO</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
        {navCard("⚽", "MIS PRONÓSTICOS", `${sent}/${TOTAL_MATCHES} enviados`, "#f59e0b", "rgba(245,158,11,0.2)", "rgba(245,158,11,0.05)", "groups")}
        {navCard("👥", "TODOS", "ver todos los pronósticos", "#005599", "rgba(0,176,255,0.2)", "rgba(0,176,255,0.05)", "community")}
        {navCard("🏆", "RANKING", "clasificación general", "#ffd700", "rgba(255,215,0,0.2)", "rgba(255,215,0,0.05)", "ranking")}
        {navCard("📊", "RESULTADOS", "marcadores reales", "#ff8a00", "rgba(255,138,0,0.2)", "rgba(255,138,0,0.05)", "results")}
        {navCard("🎮", "JUEGOS", "trivial · flappy · banderas", "#f59e0b", "rgba(245,158,11,0.15)", "rgba(245,158,11,0.04)", "games")}
        {navCard("👤", "MI PERFIL", "estadísticas y comparativas", "#e0eefa", "rgba(245,158,11,0.15)", "rgba(255,255,255,0.03)", "profile")}
        {user.role === "admin" && navCard("⚙️", "ADMIN", "gestión de partidos", "#cc2222", "rgba(255,82,82,0.2)", "rgba(255,82,82,0.05)", "admin")}
        {user.role === "admin" && navCard("📸", "EXPORTAR", "ranking e imágenes", "#007a3a", "rgba(0,122,58,0.2)", "rgba(0,122,58,0.05)", "export")}
      </div>

      {/* Mini ranking top 3 */}
      {topRanking.length > 0 && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "3px" }}>TOP RANKING</p>
            <button onClick={() => setView("ranking")} style={{ fontSize: "9px", color: GREEN, fontFamily: "monospace", background: "none", border: "none", cursor: "pointer" }}>ver todo →</button>
          </div>
          {topRanking.map((u, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: i === 0 ? GREEN_DIM : CARD, border: i === 0 ? "1px solid rgba(245,158,11,0.2)" : `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "5px" }}>
              <span style={{ fontSize: "18px", minWidth: "24px" }}>{medals[i]}</span>
              <span style={{ flex: 1, fontFamily: "monospace", fontSize: "13px", color: "#e0eaf8" }}>{u.name}</span>
              <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "24px", color: i === 0 ? GREEN : "#e0eaf8" }}>{u.total}</span>
              <span style={{ fontSize: "9px", color: "#cce0f5", fontFamily: "monospace" }}>PTS</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}


const TRIVIA_QUESTIONS = [
  // — HISTORIA DE LOS MUNDIALES —
  { q: "¿En qué año se celebró el primer Mundial de fútbol?", opts: ["1928","1930","1934","1926"], a: 1 },
  { q: "¿Dónde se jugó el primer Mundial de fútbol?", opts: ["Brasil","Italia","Uruguay","Argentina"], a: 2 },
  { q: "¿Qué selección ganó el primer Mundial en 1930?", opts: ["Argentina","Uruguay","Brasil","USA"], a: 1 },
  { q: "¿Cuántos equipos participaron en el primer Mundial de 1930?", opts: ["13","16","12","8"], a: 0 },
  { q: "¿Qué país organizó el Mundial de 1934?", opts: ["Francia","Alemania","Italia","España"], a: 2 },
  { q: "¿Qué país ganó los Mundiales de 1934 y 1938?", opts: ["Brasil","Alemania","Italia","Argentina"], a: 2 },
  { q: "¿Cuántos Mundiales ha ganado Brasil?", opts: ["4","5","6","3"], a: 1 },
  { q: "¿Cuántos Mundiales ha ganado Alemania?", opts: ["3","4","5","2"], a: 1 },
  { q: "¿Cuántos Mundiales ha ganado Italia?", opts: ["3","4","5","2"], a: 1 },
  { q: "¿Cuántos Mundiales ha ganado Argentina?", opts: ["1","2","3","4"], a: 2 },
  { q: "¿Cuántos Mundiales ha ganado Francia?", opts: ["1","2","3","0"], a: 1 },
  { q: "¿Cuántos Mundiales ha ganado España?", opts: ["0","1","2","3"], a: 1 },
  { q: "¿Cuántos Mundiales ha ganado Inglaterra?", opts: ["0","1","2","3"], a: 1 },
  { q: "¿Qué país ha organizado el Mundial más veces?", opts: ["Italia","Francia","México","Brasil"], a: 2 },
  { q: "¿Qué países coorganizaron el Mundial 2002?", opts: ["Japón y China","Corea del Sur y Japón","China y Corea del Sur","Japón y Australia"], a: 1 },
  { q: "¿Qué país fue anfitrión del Mundial 2010?", opts: ["Nigeria","Kenia","Sudáfrica","Egipto"], a: 2 },
  { q: "¿Qué país fue anfitrión del Mundial 2014?", opts: ["Argentina","Chile","Colombia","Brasil"], a: 3 },
  { q: "¿Qué país fue anfitrión del Mundial 2018?", opts: ["Rusia","Ucrania","Polonia","Turquía"], a: 0 },
  { q: "¿Qué país fue anfitrión del Mundial 2022?", opts: ["Emiratos Árabes","Arabia Saudí","Qatar","Bahréin"], a: 2 },
  { q: "¿Qué selección ganó el Mundial 2010?", opts: ["Brasil","Alemania","España","Argentina"], a: 2 },
  { q: "¿Qué selección ganó el Mundial 2014?", opts: ["Argentina","Alemania","Brasil","Francia"], a: 1 },
  { q: "¿Qué selección ganó el Mundial 2018?", opts: ["Francia","Croacia","Bélgica","Argentina"], a: 0 },
  { q: "¿Qué selección ganó el Mundial 2022?", opts: ["Francia","Brasil","Argentina","Croacia"], a: 2 },
  { q: "¿Cuántos equipos europeos han ganado el Mundial fuera de Europa?", opts: ["0","1","2","3"], a: 0 },
  { q: "¿Qué año se disputó el Mundial en México por primera vez?", opts: ["1966","1970","1974","1978"], a: 1 },

  // — MUNDIAL 2026 —
  { q: "¿Cuántos equipos participan en el Mundial 2026?", opts: ["32","36","48","40"], a: 2 },
  { q: "¿En qué países se celebra el Mundial 2026?", opts: ["USA y México","USA, Canadá y México","USA, Canadá y Brasil","Canadá y México"], a: 1 },
  { q: "¿Cuántos grupos hay en la fase de grupos del Mundial 2026?", opts: ["8","10","12","16"], a: 2 },
  { q: "¿Cuántos equipos pasan de cada grupo en el Mundial 2026?", opts: ["1","2","3","4"], a: 1 },
  { q: "¿Cuántos partidos se jugarán en total en el Mundial 2026?", opts: ["64","80","96","104"], a: 2 },
  { q: "¿En qué estadio se jugará la final del Mundial 2026?", opts: ["Rose Bowl","Azteca","MetLife Stadium","AT&T Stadium"], a: 2 },
  { q: "¿En qué ciudad está el MetLife Stadium, sede de la final 2026?", opts: ["Nueva York","Los Ángeles","Dallas","Chicago"], a: 0 },
  { q: "¿Qué grupo compartirán España y Uruguay en el Mundial 2026?", opts: ["Grupo F","Grupo G","Grupo H","Grupo I"], a: 2 },
  { q: "¿Qué selección defiende el título en el Mundial 2026?", opts: ["Francia","Brasil","Argentina","Alemania"], a: 2 },
  { q: "¿En qué fecha comienza el Mundial 2026?", opts: ["11 de junio","1 de junio","15 de junio","20 de junio"], a: 0 },
  { q: "¿Cuántas sedes americanas tendrá el Mundial 2026 en total?", opts: ["12","14","16","20"], a: 2 },
  { q: "¿Qué selección de África debutará en el Mundial 2026?", opts: ["Etiopía","Tanzania","Cabo Verde","Ruanda"], a: 2 },
  { q: "¿Qué grupo tienen Argentina y Panamá en el Mundial 2026?", opts: ["Grupo I","Grupo J","Grupo K","Grupo L"], a: 1 },
  { q: "¿Cuál es el mascota oficial del Mundial 2026?", opts: ["Zakumi","Fuleco","Ola","Tezcat"], a: 3 },
  { q: "¿Cuántos equipos de CONMEBOL clasifican al Mundial 2026?", opts: ["4","5","6","7"], a: 2 },
  { q: "¿Qué selección va en el Grupo C junto a Brasil en el Mundial 2026?", opts: ["Portugal","Marruecos","Argentina","España"], a: 1 },
  { q: "¿Qué continente tiene más plazas en el Mundial 2026?", opts: ["América","Europa","África","Asia"], a: 1 },
  { q: "¿Cuántas plazas tiene UEFA en el Mundial 2026?", opts: ["13","14","16","17"], a: 2 },

  // — RÉCORDS Y ESTADÍSTICAS —
  { q: "¿Quién es el máximo goleador de la historia de los Mundiales?", opts: ["Ronaldo","Miroslav Klose","Pelé","Gerd Müller"], a: 1 },
  { q: "¿Cuántos goles marcó Miroslav Klose en Mundiales?", opts: ["14","16","15","13"], a: 1 },
  { q: "¿Cuántos goles marcó Pelé a lo largo de su carrera mundialista?", opts: ["10","12","15","8"], a: 1 },
  { q: "¿Cuántos goles marcó Mbappé en el Mundial 2022?", opts: ["6","7","8","5"], a: 2 },
  { q: "¿Cuál es el resultado más goleador en la historia del Mundial?", opts: ["10-1","11-0","12-0","9-0"], a: 2 },
  { q: "¿Entre qué selecciones se jugó el partido con el marcador 12-0?", opts: ["Alemania vs Brasil","Australia vs Samoa Americana","Brasil vs Bolivia","Hungría vs El Salvador"], a: 1 },
  { q: "¿Cuántos goles marcó Alemania a Brasil en las semis del 2014?", opts: ["6","7","8","5"], a: 1 },
  { q: "¿Quién marcó el primer hat-trick en la historia de los Mundiales?", opts: ["Bert Patenaude","Guillermo Stábile","Ademir","Sándor Kocsis"], a: 0 },
  { q: "¿Qué portero es conocido como 'La Araña Negra'?", opts: ["Oliver Kahn","Buffon","Lev Yashin","Casillas"], a: 2 },
  { q: "¿Quién marcó hat-trick en la final del Mundial 1966?", opts: ["Charlton","Hurst","Moore","Peters"], a: 1 },
  { q: "¿Cuál es el récord de goles en una sola edición del Mundial?", opts: ["171 (USA 1994)","171 (Francia 1998)","171 (Corea 2002)","147 (España 2010)"], a: 1 },
  { q: "¿Qué selección ha perdido más finales mundiales?", opts: ["Brasil","Argentina","Alemania","Italia"], a: 2 },
  { q: "¿Cuántas finales ha perdido Alemania en Mundiales?", opts: ["2","3","4","5"], a: 2 },
  { q: "¿Quién es el jugador más joven en marcar en un Mundial?", opts: ["Pelé","Mbappe","Cesc Fàbregas","Owen"], a: 0 },
  { q: "¿Con cuántos años marcó Pelé en el Mundial 1958?", opts: ["16","17","18","15"], a: 1 },
  { q: "¿Qué selección tiene la mayor racha de partidos invictos en Mundiales?", opts: ["Brasil","Italia","Alemania","España"], a: 2 },
  { q: "¿Cuántos goles lleva Cristiano Ronaldo en Mundiales?", opts: ["5","7","8","4"], a: 1 },
  { q: "¿Cuántos goles lleva Messi en Mundiales?", opts: ["10","12","13","9"], a: 2 },
  { q: "¿Quién tiene el récord de más Mundiales jugados (5)?", opts: ["Maldini","Cafu","Antonio Carbajal / Lothar Matthäus","Buffon"], a: 2 },
  { q: "¿Qué jugador fue expulsado más veces en la historia de los Mundiales?", opts: ["Zidane","Camoranesi","Rigobert Song","Leonardo"], a: 2 },

  // — SELECCIONES Y JUGADORES —
  { q: "¿Qué jugador ganó el Balón de Oro en el Mundial 2018?", opts: ["Modric","Mbappé","Griezmann","Hazard"], a: 0 },
  { q: "¿Quién ganó el Balón de Oro del Mundial 2022?", opts: ["Mbappé","Messi","Modric","Benzema"], a: 1 },
  { q: "¿Quién ganó la Bota de Oro del Mundial 2022?", opts: ["Messi","Benzema","Mbappé","Giroud"], a: 2 },
  { q: "¿Quién marcó el gol de la 'Mano de Dios'?", opts: ["Pelé","Ronaldo","Maradona","Zidane"], a: 2 },
  { q: "¿En qué Mundial debutó Pelé con solo 17 años?", opts: ["1954","1958","1962","1966"], a: 1 },
  { q: "¿Qué jugador fue expulsado en la final del Mundial 2006?", opts: ["Buffon","Maldini","Zidane","Trezeguet"], a: 2 },
  { q: "¿Cuántos Mundiales disputó Diego Maradona?", opts: ["2","3","4","5"], a: 2 },
  { q: "¿Qué selección eliminó a España en cuartos del Mundial 2018?", opts: ["Rusia","Francia","Croacia","Uruguay"], a: 0 },
  { q: "¿Qué selección eliminó a Brasil en cuartos del Mundial 2022?", opts: ["Argentina","Croacia","Francia","Holanda"], a: 1 },
  { q: "¿Qué selección llegó por primera vez a una final en el Mundial 2018?", opts: ["Bélgica","Dinamarca","Croacia","Suecia"], a: 2 },
  { q: "¿Qué arquero atajó el penal decisivo en la final del Mundial 2022?", opts: ["Lloris","Alisson","Martínez","Oblak"], a: 2 },
  { q: "¿Qué selección derrotó a Alemania en la fase de grupos del Mundial 2018?", opts: ["Suecia","México","Corea del Sur","Brasil"], a: 2 },
  { q: "¿Qué selección derrotó a Brasil en el 'Maracanazo' de 1950?", opts: ["Argentina","Paraguay","Uruguay","Colombia"], a: 2 },
  { q: "¿Cuántos jugadores tiene una selección en el torneo 2026?", opts: ["23","25","26","28"], a: 2 },
  { q: "¿Quién es el seleccionador de España para el Mundial 2026?", opts: ["Luis Enrique","Julen Lopetegui","Luis de la Fuente","Míchel"], a: 2 },
  { q: "¿Qué jugador argentino ganó su primer Mundial en 2022?", opts: ["Di María","Agüero","Messi","Dybala"], a: 2 },
  { q: "¿Qué portero ganó el guante de oro del Mundial 2022?", opts: ["Lloris","Courtois","Martínez","Szczesny"], a: 2 },
  { q: "¿Cuál es el nombre real del estadio 'Azteca' de México?", opts: ["Estadio Olímpico","Estadio Azteca","Estadio Ciudad de México","Estadio Nacional"], a: 1 },
  { q: "¿Qué selección ganó tres Mundiales consecutivos?", opts: ["Brasil","Alemania","Italia","Argentina"], a: 0 },
  { q: "¿Qué año ganó Brasil su primer Mundial?", opts: ["1950","1954","1958","1962"], a: 2 },
  { q: "¿Quién fue el goleador del Mundial 2014?", opts: ["Messi","James Rodríguez","Müller","Neymar"], a: 2 },
  { q: "¿Cuántos goles marcó el goleador del Mundial 2014?", opts: ["5","6","7","8"], a: 2 },

  // — MOMENTOS HISTÓRICOS —
  { q: "¿Cómo se llama el gol de cabeza de Zidane en la final del Mundial 2006?", opts: ["Cabezazo de Berlín","Golpe de Berlín","El golazo","El cabezazo dorado"], a: 0 },
  { q: "¿Qué portero paró el penal de Baggio en la final del Mundial 1994?", opts: ["Schmeichel","Taffarel","Kahn","Barthez"], a: 1 },
  { q: "¿Cómo se conoce la derrota de Brasil 7-1 ante Alemania en 2014?", opts: ["La vergüenza de Belo Horizonte","El Mineirazo","La goleada del siglo","El humillazo"], a: 1 },
  { q: "¿En qué estadio se disputó el Mineirazo en 2014?", opts: ["Maracaná","Castelão","Estádio Mineirão","Arena Corinthians"], a: 2 },
  { q: "¿Qué selección fue eliminada por Senegal en el Mundial 2002?", opts: ["Brasil","Argentina","Francia","España"], a: 2 },
  { q: "¿Qué árbitro pitó la final del Mundial 2006 siendo muy cuestionado?", opts: ["Howard Webb","Horacio Elizondo","Valentin Ivanov","Pierluigi Collina"], a: 1 },
  { q: "¿Cuántos penaltis fallaron en la final del Mundial 1994?", opts: ["1","2","3","4"], a: 1 },
  { q: "¿Qué jugador falló el penal decisivo en la final del Mundial 1994?", opts: ["Romario","Bebeto","Roberto Baggio","Maldini"], a: 2 },
  { q: "¿En qué Mundial ocurrió la 'Batalla de Santiago'?", opts: ["1954","1958","1962","1966"], a: 2 },
  { q: "¿Qué selección protagonizó el 'Milagro de Berna' en 1954?", opts: ["Brasil","Hungría","Alemania Occidental","Uruguay"], a: 2 },
  { q: "¿En qué año Alemania del Oeste venció a Hungría en la final de Suiza?", opts: ["1950","1954","1958","1962"], a: 1 },
  { q: "¿Qué árbitro anuló un gol a Maradona legítimamente en 1986?", opts: ["El de la mano de Dios","El gol del siglo","Todos sus goles","Ninguno"], a: 0 },
  { q: "¿En qué ciudad se jugó la polémica final del Mundial 1966?", opts: ["Manchester","Londres","Birmingham","Glasgow"], a: 1 },
  { q: "¿Qué jugador marcó en la final de 1966 para el 4-2 definitivo?", opts: ["Charlton","Moore","Hurst","Peters"], a: 2 },
  { q: "¿Cómo se llama el famoso gol de 60 metros de Maradona en 1986?", opts: ["El gol del milenio","El gol del siglo","El golazo de Azteca","La joya"], a: 1 },
];

// ============================================================
// JUEGO TRIVIAL
// ============================================================
function TriviaGame({ user, onBack }) {
  const [phase, setPhase] = useState("menu");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [rankings, setRankings] = useState([]);
  const [loadingRank, setLoadingRank] = useState(false);
  const timerRef = useRef(null);

  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

  const startGame = () => {
    const qs = shuffle(TRIVIA_QUESTIONS).slice(0, 10);
    setQuestions(qs); setCurrent(0); setScore(0); setSelected(null); setAnswered(false); setTimeLeft(15);
    setPhase("playing");
  };

  useEffect(() => {
    if (phase !== "playing") return;
    if (answered) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleAnswer(null); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, current, answered]);

  const handleAnswer = (idx) => {
    if (answered) return;
    clearInterval(timerRef.current);
    setSelected(idx);
    setAnswered(true);
    const correct = idx === questions[current].a;
    const pts = correct ? (timeLeft >= 10 ? 3 : timeLeft >= 5 ? 2 : 1) : 0;
    setScore(s => s + pts);
  };

  const next = () => {
    if (current + 1 >= questions.length) { finishGame(); }
    else { setCurrent(c => c + 1); setSelected(null); setAnswered(false); setTimeLeft(15); }
  };

  const finishGame = async () => {
    const finalScore = score;
    setPhase("result");
    await supabase.from("trivia_scores").insert({ user_id: user.id, score: finalScore });
    loadRankings();
  };

  const loadRankings = async () => {
    setLoadingRank(true);
    const { data: scores } = await supabase.from("trivia_scores").select("*").order("score", { ascending: false }).limit(20);
    const { data: profiles } = await supabase.from("profiles").select("*");
    if (scores && profiles) {
      const byUser = {};
      scores.forEach(s => { if (!byUser[s.user_id] || s.score > byUser[s.user_id]) byUser[s.user_id] = s.score; });
      const r = Object.entries(byUser).map(([uid, sc]) => ({ name: profiles.find(p => p.id === uid)?.name || "Usuario", score: sc })).sort((a, b) => b.score - a.score);
      setRankings(r);
    }
    setLoadingRank(false);
  };

  useEffect(() => { if (phase === "menu") loadRankings(); }, [phase]);

  const q = questions[current];
  const medals = ["🥇", "🥈", "🥉"];

  if (phase === "menu") return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <button onClick={onBack} style={{ padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "monospace", fontSize: "11px" }}>← Volver</button>
        <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "3px" }}>TRIVIAL MUNDIAL</p>
      </div>
      <div style={{ background: CARD, border: "1px solid rgba(245,158,11,0.15)", borderRadius: "14px", padding: "24px", textAlign: "center", marginBottom: "20px" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🧠</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: "#e0eaf8", letterSpacing: "3px", marginBottom: "8px" }}>TRIVIAL MUNDIAL 2026</div>
        <p style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "monospace", lineHeight: 1.8, marginBottom: "20px" }}>10 preguntas · 15 segundos por pregunta<br/><span style={{ color: GREEN }}>+3</span> rápido · <span style={{ color: "#b8860b" }}>+2</span> normal · <span style={{ color: "#ff8a00" }}>+1</span> lento · <span style={{ color: "#cc2222" }}>+0</span> fallo</p>
        <button onClick={startGame} style={{ padding: "14px 40px", border: "none", borderRadius: "10px", background: `linear-gradient(135deg,${GREEN},#e07b00)`, color: "#0a1628", fontFamily: "monospace", fontSize: "13px", fontWeight: 800, cursor: "pointer", letterSpacing: "3px" }}>⚡ JUGAR</button>
      </div>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "12px" }}>RANKING TRIVIAL</p>
      {loadingRank ? <p style={{ color: "#d0e4f7", fontFamily: "monospace", fontSize: "11px" }}>Cargando...</p> : rankings.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: i === 0 ? GREEN_DIM : CARD, border: i === 0 ? "1px solid rgba(245,158,11,0.2)" : `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "5px" }}>
          <span style={{ fontSize: "18px", minWidth: "26px" }}>{medals[i] || `#${i + 1}`}</span>
          <span style={{ flex: 1, fontFamily: "monospace", fontSize: "13px", color: "#e0eaf8" }}>{r.name}</span>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: i === 0 ? GREEN : "#e0eaf8" }}>{r.score}</span>
          <span style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace" }}>PTS</span>
        </div>
      ))}
    </div>
  );

  if (phase === "playing" && q) return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
    {/* BOTÓN SALIR */}
    <button onClick={() => setPhase("menu")}
      style={{ marginBottom: "12px", padding: "6px 12px", border: `1px solid ${BORDER}`,
        borderRadius: "7px", background: "transparent", color: "#c0d8f0",
        cursor: "pointer", fontFamily: "monospace", fontSize: "11px" }}>
      ← Salir
    </button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#d0e4f7" }}>Pregunta {current + 1}/10</span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: GREEN }}>{score} PTS</span>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: `3px solid ${timeLeft > 8 ? GREEN : timeLeft > 4 ? "#b8860b" : "#cc2222"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: timeLeft > 8 ? GREEN : timeLeft > 4 ? "#b8860b" : "#cc2222" }}>{timeLeft}</span>
          </div>
        </div>
      </div>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(245,158,11,0.12)", borderRadius: "14px", padding: "20px", marginBottom: "14px" }}>
        <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", marginBottom: "16px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(current / 10) * 100}%`, background: GREEN, borderRadius: "3px" }} />
        </div>
        <p style={{ fontFamily: "monospace", fontSize: "14px", color: "#e0eaf8", lineHeight: 1.6, textAlign: "center" }}>{q.q}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {q.opts.map((opt, i) => {
          let bg = CARD, border = BORDER, color = "#a8d4f0";
          if (answered) {
            if (i === q.a) { bg = GREEN_DIM; border = "rgba(245,158,11,0.5)"; color = GREEN; }
            else if (i === selected) { bg = "rgba(255,82,82,0.1)"; border = "rgba(255,82,82,0.4)"; color = "#cc2222"; }
          }
          return (
            <button key={i} onClick={() => handleAnswer(i)} disabled={answered} style={{ padding: "14px 10px", border: `1px solid ${border}`, borderRadius: "10px", background: bg, color, fontFamily: "monospace", fontSize: "12px", cursor: answered ? "default" : "pointer", textAlign: "left", lineHeight: 1.4 }}>
              <span style={{ color: "#cce0f5", marginRight: "6px" }}>{["A", "B", "C", "D"][i]}.</span>{opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <div style={{ marginTop: "14px", textAlign: "center" }}>
          {selected === q.a ? <p style={{ color: GREEN, fontFamily: "monospace", fontSize: "13px", marginBottom: "12px" }}>✓ ¡Correcto! +{timeLeft >= 10 ? 3 : timeLeft >= 5 ? 2 : 1} pts</p> : <p style={{ color: "#cc2222", fontFamily: "monospace", fontSize: "13px", marginBottom: "12px" }}>✗ Era: {q.opts[q.a]}</p>}
          <button onClick={next} style={{ padding: "12px 32px", border: "none", borderRadius: "9px", background: GREEN, color: "#0a1628", fontFamily: "monospace", fontSize: "12px", fontWeight: 800, cursor: "pointer", letterSpacing: "2px" }}>{current + 1 >= questions.length ? "VER RESULTADO" : "SIGUIENTE →"}</button>
        </div>
      )}
    </div>
  );

  if (phase === "result") return (
    <div style={{ animation: "fadeIn 0.3s ease", textAlign: "center" }}>
      <button onClick={() => setPhase("menu")} style={{ marginBottom: "20px", padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "monospace", fontSize: "11px" }}>← Volver</button>
      <div style={{ background: CARD, border: "1px solid rgba(245,158,11,0.15)", borderRadius: "14px", padding: "28px", marginBottom: "20px" }}>
        <div style={{ fontSize: "44px", marginBottom: "10px" }}>{score >= 25 ? "🏆" : score >= 15 ? "⚽" : "😅"}</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#d0e4f7", letterSpacing: "3px" }}>TU PUNTUACIÓN</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "64px", color: GREEN, lineHeight: 1 }}>{score}</div>
        <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#c0d8f0", marginTop: "4px" }}>de 30 posibles</div>
        <p style={{ marginTop: "14px", fontSize: "12px", color: "#e0eefa", fontFamily: "monospace" }}>{score >= 25 ? "¡Crack del balón! 🔥" : score >= 15 ? "Buen nivel futbolero ⚽" : "A repasar el mundial 😅"}</p>
      </div>
      <button onClick={startGame} style={{ padding: "13px 36px", border: "none", borderRadius: "10px", background: `linear-gradient(135deg,${GREEN},#e07b00)`, color: "#0a1628", fontFamily: "monospace", fontSize: "12px", fontWeight: 800, cursor: "pointer", letterSpacing: "3px", marginBottom: "20px" }}>🔄 REPETIR</button>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "12px" }}>RANKING TRIVIAL</p>
      {loadingRank ? <p style={{ color: "#d0e4f7", fontFamily: "monospace", fontSize: "11px" }}>Cargando...</p> : rankings.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: i === 0 ? GREEN_DIM : CARD, border: i === 0 ? "1px solid rgba(245,158,11,0.2)" : `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "5px", textAlign: "left" }}>
          <span style={{ fontSize: "18px", minWidth: "26px" }}>{medals[i] || `#${i + 1}`}</span>
          <span style={{ flex: 1, fontFamily: "monospace", fontSize: "13px", color: "#e0eaf8" }}>{r.name}</span>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: i === 0 ? GREEN : "#e0eaf8" }}>{r.score}</span>
          <span style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace" }}>PTS</span>
        </div>
      ))}
    </div>
  );
  return null;
}

// ============================================================
// FLAPPY BALÓN
// ============================================================
function FlappyGame({ user, onBack }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const rafRef = useRef(null);
  const [phase, setPhase] = useState("menu");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [rankings, setRankings] = useState([]);
  const [loadingRank, setLoadingRank] = useState(false);

  const W = 360, H = 500;
  const BALL_X = 80, GRAVITY = 0.45, JUMP = -8, PIPE_W = 52, GAP = 150, PIPE_SPEED = 2.8;
  const FLAGS = ["🇧🇷","🇩🇪","🇪🇸","🇫🇷","🇦🇷","🇵🇹","🇳🇱","🇧🇪","🇮🇹","🇲🇽","🇦🇺","🇯🇵","🇰🇷","🇺🇸","🇨🇦","🇳🇴","🇸🇳","🇨🇴","🇺🇾","🇭🇷"];

  const initState = () => ({ ballY: H / 2, ballVY: 0, pipes: [], frame: 0, score: 0, alive: true });
  const jump = () => { if (stateRef.current?.alive) stateRef.current.ballVY = JUMP; };
  const startGame = () => { stateRef.current = initState(); setScore(0); setPhase("playing"); };

  useEffect(() => {
    if (phase !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const draw = () => {
      const s = stateRef.current;
      if (!s) return;
      s.ballVY += GRAVITY; s.ballY += s.ballVY; s.frame++;
      if (s.frame % 90 === 0) {
        const gapY = 100 + Math.random() * (H - GAP - 180);
        s.pipes.push({ x: W + 10, gapY, flag: FLAGS[Math.floor(Math.random() * FLAGS.length)], scored: false });
      }
      s.pipes = s.pipes.filter(p => p.x > -PIPE_W - 10);
      s.pipes.forEach(p => { p.x -= PIPE_SPEED; if (!p.scored && p.x + PIPE_W < BALL_X) { p.scored = true; s.score++; setScore(s.score); } });
      const br = 16;
      if (s.ballY - br < 0 || s.ballY + br > H) { endGame(); return; }
      for (const p of s.pipes) {
        if (BALL_X + br > p.x && BALL_X - br < p.x + PIPE_W) {
          if (s.ballY - br < p.gapY || s.ballY + br > p.gapY + GAP) { endGame(); return; }
        }
      }
      ctx.clearRect(0, 0, W, H);
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, "#0a0a1a"); bgGrad.addColorStop(1, "#0a1a0a");
      ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      for (let i = 0; i < 30; i++) { const sx = ((i * 137 + s.frame * 0.3) % W); const sy = (i * 53) % H; ctx.beginPath(); ctx.arc(sx, sy, 1, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = "#1a3a1a"; ctx.fillRect(0, H - 20, W, 20);
      ctx.fillStyle = "#f59e0b"; ctx.fillRect(0, H - 22, W, 3);
      s.pipes.forEach(p => {
        const grad = ctx.createLinearGradient(p.x, 0, p.x + PIPE_W, 0);
        grad.addColorStop(0, "#1a4a1a"); grad.addColorStop(0.5, "#2a6a2a"); grad.addColorStop(1, "#1a4a1a");
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.roundRect(p.x, 0, PIPE_W, p.gapY - 6, [0, 0, 8, 8]); ctx.fill();
        ctx.fillStyle = "#f59e0b"; ctx.fillRect(p.x - 4, p.gapY - 18, PIPE_W + 8, 12);
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.roundRect(p.x, p.gapY + GAP + 6, PIPE_W, H - (p.gapY + GAP + 6), [8, 8, 0, 0]); ctx.fill();
        ctx.fillStyle = "#f59e0b"; ctx.fillRect(p.x - 4, p.gapY + GAP + 6, PIPE_W + 8, 12);
        ctx.font = "20px serif"; ctx.textAlign = "center"; ctx.fillText(p.flag, p.x + PIPE_W / 2, p.gapY + GAP / 2 + 7);
      });
      ctx.save(); ctx.translate(BALL_X, s.ballY); ctx.rotate(s.frame * 0.08);
      ctx.font = "32px serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("⚽", 0, 0); ctx.restore();
      ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.beginPath(); ctx.roundRect(W/2 - 36, 14, 72, 32, 8); ctx.fill();
      ctx.fillStyle = "#f59e0b"; ctx.font = "bold 20px 'Courier New'"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(s.score, W / 2, 30);
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  const endGame = async () => {
    const finalScore = stateRef.current?.score || 0;
    cancelAnimationFrame(rafRef.current);
    setScore(finalScore); setBestScore(b => Math.max(b, finalScore));
    stateRef.current = null; setPhase("dead");
    await supabase.from("flappy_scores").insert({ user_id: user.id, score: finalScore });
    loadRankings();
  };

  const loadRankings = async () => {
    setLoadingRank(true);
    const { data: scores } = await supabase.from("flappy_scores").select("*").order("score", { ascending: false });
    const { data: profiles } = await supabase.from("profiles").select("*");
    if (scores && profiles) {
      const byUser = {};
      scores.forEach(s => { if (!byUser[s.user_id] || s.score > byUser[s.user_id]) byUser[s.user_id] = s.score; });
      const r = Object.entries(byUser).map(([uid, sc]) => ({ name: profiles.find(p => p.id === uid)?.name || "Usuario", score: sc })).sort((a, b) => b.score - a.score);
      setRankings(r);
    }
    setLoadingRank(false);
  };

  useEffect(() => { if (phase === "menu") loadRankings(); }, [phase]);
  const medals = ["🥇", "🥈", "🥉"];
  const handleTap = () => { if (phase === "playing") jump(); else if (phase === "dead") startGame(); };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <button onClick={onBack} style={{ padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "monospace", fontSize: "11px" }}>← Volver</button>
        <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "3px" }}>FLAPPY BALÓN</p>
      </div>
      {phase === "menu" && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ background: CARD, border: "1px solid rgba(245,158,11,0.15)", borderRadius: "14px", padding: "24px", marginBottom: "20px" }}>
            <div style={{ fontSize: "52px", marginBottom: "10px" }}>⚽</div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: "#e0eaf8", letterSpacing: "3px", marginBottom: "8px" }}>FLAPPY BALÓN</div>
            <p style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "monospace", lineHeight: 1.8, marginBottom: "20px" }}>Esquiva las porterías · Toca para saltar</p>
            <button onClick={startGame} style={{ padding: "14px 40px", border: "none", borderRadius: "10px", background: `linear-gradient(135deg,${GREEN},#e07b00)`, color: "#0a1628", fontFamily: "monospace", fontSize: "13px", fontWeight: 800, cursor: "pointer", letterSpacing: "3px" }}>⚡ JUGAR</button>
          </div>
          <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "12px" }}>RANKING FLAPPY</p>
          {loadingRank ? <p style={{ color: "#d0e4f7", fontFamily: "monospace", fontSize: "11px" }}>Cargando...</p> : rankings.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: i === 0 ? GREEN_DIM : CARD, border: i === 0 ? "1px solid rgba(245,158,11,0.2)" : `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "5px", textAlign: "left" }}>
              <span style={{ fontSize: "18px", minWidth: "26px" }}>{medals[i] || `#${i + 1}`}</span>
              <span style={{ flex: 1, fontFamily: "monospace", fontSize: "13px", color: "#e0eaf8" }}>{r.name}</span>
              <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: i === 0 ? GREEN : "#e0eaf8" }}>{r.score}</span>
            </div>
          ))}
        </div>
      )}
      {(phase === "playing" || phase === "dead") && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* BOTÓN SALIR */}
    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
      <button onClick={() => { cancelAnimationFrame(rafRef.current); setPhase("menu"); }}
        style={{ padding: "6px 12px", border: `1px solid ${BORDER}`, borderRadius: "7px",
          background: "transparent", color: "#c0d8f0",
          cursor: "pointer", fontFamily: "monospace", fontSize: "11px" }}>
        ← Salir
      </button>
      <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: GREEN }}>{score}</span>
    </div>
          <div style={{ position: "relative", borderRadius: "14px", overflow: "hidden", border: `1px solid ${BORDER}`, cursor: "pointer", userSelect: "none" }}
            onClick={handleTap} onTouchStart={e => { e.preventDefault(); handleTap(); }}>
            <canvas ref={canvasRef} width={W} height={H} style={{ display: "block", maxWidth: "100%" }} />
            {phase === "dead" && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <div style={{ fontSize: "40px" }}>💥</div>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: "#e0eaf8", letterSpacing: "3px" }}>GAME OVER</div>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "52px", color: GREEN, lineHeight: 1 }}>{score}</div>
                <div style={{ padding: "12px 28px", background: GREEN, color: "#0a1628", borderRadius: "9px", fontFamily: "monospace", fontSize: "12px", fontWeight: 800 }}>TOCA PARA REPETIR</div>
              </div>
            )}
          </div>
          {phase === "playing" && <p style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "monospace", marginTop: "10px" }}>Toca la pantalla o haz clic para saltar</p>}
        </div>
      )}
    </div>
  );
}

// ============================================================
// ADIVINA LA BANDERA
// ============================================================
const FLAG_COUNTRIES = [
  { name: "México", flag: "🇲🇽" }, { name: "Corea del Sur", flag: "🇰🇷" }, { name: "Sudáfrica", flag: "🇿🇦" },
  { name: "Canadá", flag: "🇨🇦" }, { name: "Suiza", flag: "🇨🇭" }, { name: "Qatar", flag: "🇶🇦" },
  { name: "Brasil", flag: "🇧🇷" }, { name: "Marruecos", flag: "🇲🇦" }, { name: "Escocia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" }, { name: "Haití", flag: "🇭🇹" },
  { name: "Estados Unidos", flag: "🇺🇸" }, { name: "Paraguay", flag: "🇵🇾" }, { name: "Australia", flag: "🇦🇺" },
  { name: "Alemania", flag: "🇩🇪" }, { name: "Ecuador", flag: "🇪🇨" }, { name: "Costa de Marfil", flag: "🇨🇮" }, { name: "Curazao", flag: "🇨🇼" },
  { name: "Países Bajos", flag: "🇳🇱" }, { name: "Japón", flag: "🇯🇵" }, { name: "Túnez", flag: "🇹🇳" },
  { name: "Bélgica", flag: "🇧🇪" }, { name: "Egipto", flag: "🇪🇬" }, { name: "Irán", flag: "🇮🇷" }, { name: "Nueva Zelanda", flag: "🇳🇿" },
  { name: "España", flag: "🇪🇸" }, { name: "Cabo Verde", flag: "🇨🇻" }, { name: "Arabia Saudí", flag: "🇸🇦" }, { name: "Uruguay", flag: "🇺🇾" },
  { name: "Francia", flag: "🇫🇷" }, { name: "Senegal", flag: "🇸🇳" }, { name: "Noruega", flag: "🇳🇴" },
  { name: "Argentina", flag: "🇦🇷" }, { name: "Panamá", flag: "🇵🇦" }, { name: "Argelia", flag: "🇩🇿" },
  { name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" }, { name: "Colombia", flag: "🇨🇴" }, { name: "Uzbekistán", flag: "🇺🇿" }, { name: "Jordania", flag: "🇯🇴" },
  { name: "Portugal", flag: "🇵🇹" }, { name: "Croacia", flag: "🇭🇷" }, { name: "Ghana", flag: "🇬🇭" }, { name: "Austria", flag: "🇦🇹" },
];

function FlagsGame({ user, onBack }) {
  const [phase, setPhase] = useState("menu");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [rankings, setRankings] = useState([]);
  const [loadingRank, setLoadingRank] = useState(false);

  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

  const buildQuestions = () => {
    const pool = shuffle([...FLAG_COUNTRIES]);
    return pool.slice(0, 15).map(correct => {
      const wrong = shuffle(FLAG_COUNTRIES.filter(c => c.name !== correct.name)).slice(0, 3);
      return { correct, opts: shuffle([correct, ...wrong]) };
    });
  };

  const startGame = () => {
    setQuestions(buildQuestions());
    setCurrent(0); setScore(0); setSelected(null); setAnswered(false); setStreak(0);
    setPhase("playing");
  };

  const handleAnswer = (name) => {
    if (answered) return;
    setSelected(name);
    setAnswered(true);
    const isCorrect = name === questions[current].correct.name;
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore(s => s + (newStreak >= 3 ? 2 : 1));
    } else {
      setStreak(0);
    }
  };

  const next = async () => {
    if (current + 1 >= questions.length) {
      setPhase("result");
      await supabase.from("flags_scores").insert({ user_id: user.id, score });
      loadRankings();
    } else {
      setCurrent(c => c + 1); setSelected(null); setAnswered(false);
    }
  };

  const loadRankings = async () => {
    setLoadingRank(true);
    const { data: scores } = await supabase.from("flags_scores").select("*").order("score", { ascending: false });
    const { data: profiles } = await supabase.from("profiles").select("*");
    if (scores && profiles) {
      const byUser = {};
      scores.forEach(s => { if (!byUser[s.user_id] || s.score > byUser[s.user_id]) byUser[s.user_id] = s.score; });
      const r = Object.entries(byUser).map(([uid, sc]) => ({ name: profiles.find(p => p.id === uid)?.name || "Usuario", score: sc })).sort((a, b) => b.score - a.score);
      setRankings(r);
    }
    setLoadingRank(false);
  };

  useEffect(() => { if (phase === "menu") loadRankings(); }, [phase]);
  const medals = ["🥇", "🥈", "🥉"];
  const q = questions[current];

  if (phase === "menu") return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <button onClick={onBack} style={{ padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "monospace", fontSize: "11px" }}>← Volver</button>
        <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "3px" }}>ADIVINA LA BANDERA</p>
      </div>
      <div style={{ background: CARD, border: "1px solid rgba(255,193,7,0.2)", borderRadius: "14px", padding: "24px", textAlign: "center", marginBottom: "20px" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌍</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: "#e0eaf8", letterSpacing: "3px", marginBottom: "8px" }}>ADIVINA LA BANDERA</div>
        <p style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "monospace", lineHeight: 1.8, marginBottom: "20px" }}>15 banderas del Mundial 2026<br/><span style={{ color: GREEN }}>+1</span> acierto · <span style={{ color: "#b8860b" }}>+2</span> con racha de 3 seguidas 🔥</p>
        <button onClick={startGame} style={{ padding: "14px 40px", border: "none", borderRadius: "10px", background: "linear-gradient(135deg,#b8860b,#ff8a00)", color: "#0a1628", fontFamily: "monospace", fontSize: "13px", fontWeight: 800, cursor: "pointer", letterSpacing: "3px" }}>⚡ JUGAR</button>
      </div>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "12px" }}>RANKING BANDERAS</p>
      {loadingRank ? <p style={{ color: "#d0e4f7", fontFamily: "monospace", fontSize: "11px" }}>Cargando...</p> : rankings.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: i === 0 ? "rgba(255,193,7,0.1)" : CARD, border: i === 0 ? "1px solid rgba(255,193,7,0.2)" : `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "5px" }}>
          <span style={{ fontSize: "18px", minWidth: "26px" }}>{medals[i] || `#${i + 1}`}</span>
          <span style={{ flex: 1, fontFamily: "monospace", fontSize: "13px", color: "#e0eaf8" }}>{r.name}</span>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: i === 0 ? "#b8860b" : "#e0eaf8" }}>{r.score}</span>
          <span style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace" }}>PTS</span>
        </div>
      ))}
    </div>
  );

  if (phase === "playing" && q) return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
    {/* BOTÓN SALIR */}
    <button onClick={() => { clearInterval(timerRef.current); setPhase("menu"); }}
      style={{ marginBottom: "12px", padding: "6px 12px", border: `1px solid ${BORDER}`,
        borderRadius: "7px", background: "transparent", color: "#c0d8f0",
        cursor: "pointer", fontFamily: "monospace", fontSize: "11px" }}>
      ← Salir
    </button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#d0e4f7" }}>{current + 1}/15</span>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {streak >= 2 && <span style={{ fontSize: "10px", fontFamily: "monospace", color: "#b8860b" }}>🔥 ×{streak}</span>}
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: "#b8860b" }}>{score} PTS</span>
        </div>
      </div>
      <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", marginBottom: "24px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(current / 15) * 100}%`, background: "#b8860b", borderRadius: "3px" }} />
      </div>
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div style={{ fontSize: "96px", lineHeight: 1, marginBottom: "12px" }}>{q.correct.flag}</div>
        <p style={{ fontSize: "12px", color: "#a8d4f0", fontFamily: "monospace" }}>¿De qué país es esta bandera?</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {q.opts.map(opt => {
          let bg = CARD, border = BORDER, color = "#a8d4f0";
          if (answered) {
            if (opt.name === q.correct.name) { bg = GREEN_DIM; border = "rgba(245,158,11,0.5)"; color = GREEN; }
            else if (opt.name === selected) { bg = "rgba(255,82,82,0.1)"; border = "rgba(255,82,82,0.4)"; color = "#cc2222"; }
          }
          return (
            <button key={opt.name} onClick={() => handleAnswer(opt.name)} disabled={answered}
              style={{ padding: "14px 10px", border: `1px solid ${border}`, borderRadius: "10px", background: bg, color, fontFamily: "monospace", fontSize: "12px", cursor: answered ? "default" : "pointer", textAlign: "center" }}>
              {opt.name}
            </button>
          );
        })}
      </div>
      {answered && (
        <div style={{ marginTop: "14px", textAlign: "center" }}>
          {selected === q.correct.name
            ? <p style={{ color: GREEN, fontFamily: "monospace", fontSize: "13px", marginBottom: "12px" }}>✓ ¡Correcto! {streak >= 3 ? "+2 🔥 RACHA!" : "+1"}</p>
            : <p style={{ color: "#cc2222", fontFamily: "monospace", fontSize: "13px", marginBottom: "12px" }}>✗ Era {q.correct.name}</p>}
          <button onClick={next} style={{ padding: "12px 32px", border: "none", borderRadius: "9px", background: "#b8860b", color: "#0a1628", fontFamily: "monospace", fontSize: "12px", fontWeight: 800, cursor: "pointer", letterSpacing: "2px" }}>{current + 1 >= questions.length ? "VER RESULTADO" : "SIGUIENTE →"}</button>
        </div>
      )}
    </div>
  );

  if (phase === "result") return (
    <div style={{ animation: "fadeIn 0.3s ease", textAlign: "center" }}>
      <button onClick={() => setPhase("menu")} style={{ marginBottom: "20px", padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "monospace", fontSize: "11px" }}>← Volver</button>
      <div style={{ background: CARD, border: "1px solid rgba(255,193,7,0.2)", borderRadius: "14px", padding: "28px", marginBottom: "20px" }}>
        <div style={{ fontSize: "44px", marginBottom: "10px" }}>{score >= 20 ? "🏆" : score >= 12 ? "🌍" : "😅"}</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#d0e4f7", letterSpacing: "3px" }}>TU PUNTUACIÓN</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "64px", color: "#b8860b", lineHeight: 1 }}>{score}</div>
        <p style={{ marginTop: "10px", fontSize: "12px", color: "#e0eefa", fontFamily: "monospace" }}>{score >= 20 ? "¡Experto en geografía! 🌍" : score >= 12 ? "Buen conocimiento ⚽" : "A practicar geografía 😅"}</p>
      </div>
      <button onClick={startGame} style={{ padding: "13px 36px", border: "none", borderRadius: "10px", background: "linear-gradient(135deg,#b8860b,#ff8a00)", color: "#0a1628", fontFamily: "monospace", fontSize: "12px", fontWeight: 800, cursor: "pointer", letterSpacing: "3px", marginBottom: "20px" }}>🔄 REPETIR</button>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "12px" }}>RANKING BANDERAS</p>
      {loadingRank ? <p style={{ color: "#d0e4f7", fontFamily: "monospace", fontSize: "11px" }}>Cargando...</p> : rankings.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: i === 0 ? "rgba(255,193,7,0.1)" : CARD, border: i === 0 ? "1px solid rgba(255,193,7,0.2)" : `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "5px", textAlign: "left" }}>
          <span style={{ fontSize: "18px", minWidth: "26px" }}>{medals[i] || `#${i + 1}`}</span>
          <span style={{ flex: 1, fontFamily: "monospace", fontSize: "13px", color: "#e0eaf8" }}>{r.name}</span>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: i === 0 ? "#b8860b" : "#e0eaf8" }}>{r.score}</span>
          <span style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace" }}>PTS</span>
        </div>
      ))}
    </div>
  );
  return null;
}

// ============================================================
// PENALTIS EN TIEMPO REAL — Canvas animado
// ============================================================
const PENALTY_DIRS = ["izq", "centro", "der"];
const PENALTY_LABELS = { izq: "← Izq", centro: "↑ Centro", der: "→ Der" };

const SHOOTERS = [
  { name: "MESSI", num: "10", shirt: "#6dc8f3", shorts: "#1a1a4e", skin: "#f5c89a" },
  { name: "MBAPPÉ", num: "10", shirt: "#002395", shorts: "#002395", skin: "#7a4a2a" },
  { name: "VINICIUS", num: "7",  shirt: "#ffd700", shorts: "#009900", skin: "#6b3a1a" },
  { name: "BELLINGHAM", num: "22", shirt: "#ffffff", shorts: "#c0392b", skin: "#c8915a" },
  { name: "PEDRI", num: "8",  shirt: "#a50044", shorts: "#004d98", skin: "#f0c090" },
  { name: "LEWANDOWSKI", num: "9", shirt: "#dc143c", shorts: "#ffffff", skin: "#f5d5b0" },
  { name: "SALAH", num: "11", shirt: "#cc0000", shorts: "#cc0000", skin: "#b07040" },
  { name: "KANE", num: "9",  shirt: "#ffffff", shorts: "#c0392b", skin: "#f0d0b0" },
  { name: "RONALDO", num: "7",  shirt: "#006600", shorts: "#cc0000", skin: "#d4a070" },
  { name: "YAMAL", num: "19", shirt: "#a50044", shorts: "#004d98", skin: "#f0c090" },
];

const KEEPERS = [
  { name: "OBLAK", num: "1",  shirt: "#ff6600", shorts: "#333333", skin: "#f5d5b0" },
  { name: "COURTOIS", num: "1",  shirt: "#ff0000", shorts: "#000000", skin: "#f5e0c0" },
  { name: "ALISSON", num: "1",  shirt: "#006600", shorts: "#006600", skin: "#7a4a2a" },
  { name: "EDERSON", num: "31", shirt: "#6eccf5", shorts: "#1c2c5b", skin: "#6b3a1a" },
  { name: "TER STEGEN", num: "1",  shirt: "#a50044", shorts: "#004d98", skin: "#f5e0c0" },
  { name: "DONNARUMMA", num: "1",  shirt: "#009246", shorts: "#009246", skin: "#f0c8a0" },
  { name: "PICKFORD", num: "1",  shirt: "#ffff00", shorts: "#333333", skin: "#f5e0c0" },
  { name: "SZCZESNY", num: "1",  shirt: "#dc143c", shorts: "#ffffff", skin: "#f5d5b0" },
];

function pickRandom(arr, seed) {
  return arr[seed % arr.length];
}

function drawPlayer(ctx, x, y, scale, shirt, shorts, skin, num, name, lean, legAngle, armAngle, isGk) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.rotate(lean);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Shadow
  ctx.save();
  ctx.scale(1, 0.3);
  ctx.beginPath();
  ctx.ellipse(0, 62, 14, 8, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fill();
  ctx.restore();

  // Legs
  const legW = 6;
  // Left leg
  ctx.save();
  ctx.translate(-6, 20);
  ctx.rotate(isGk ? lean * 0.5 : 0);
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(-3, 22);
  ctx.strokeStyle = shorts; ctx.lineWidth = legW; ctx.stroke();
  // Boot left
  ctx.beginPath();
  ctx.moveTo(-3, 22); ctx.lineTo(-7, 28);
  ctx.strokeStyle = "#111"; ctx.lineWidth = 5; ctx.stroke();
  ctx.restore();

  // Right leg (kicking)
  ctx.save();
  ctx.translate(6, 20);
  ctx.rotate(isGk ? -lean * 0.5 : -legAngle);
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(4, 22);
  ctx.strokeStyle = shorts; ctx.lineWidth = legW; ctx.stroke();
  // Boot right
  ctx.save();
  ctx.translate(4, 22);
  ctx.rotate(isGk ? 0 : legAngle * 0.5);
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(8, 5);
  ctx.strokeStyle = "#111"; ctx.lineWidth = 5; ctx.stroke();
  ctx.restore();
  ctx.restore();

  // Shirt body
  ctx.beginPath();
  ctx.moveTo(-12, -8);
  ctx.lineTo(-13, 20);
  ctx.lineTo(13, 20);
  ctx.lineTo(12, -8);
  ctx.closePath();
  ctx.fillStyle = shirt;
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.15)"; ctx.lineWidth = 0.5; ctx.stroke();

  // Shirt stripe accent
  ctx.beginPath();
  ctx.moveTo(-3, -8); ctx.lineTo(-3, 20); ctx.lineTo(3, 20); ctx.lineTo(3, -8);
  ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fill();

  // Number on shirt
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText(num, 0, 7);

  // Left arm
  ctx.save();
  ctx.translate(-12, 0);
  ctx.rotate(isGk ? armAngle : -0.3);
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(-10, 14);
  ctx.strokeStyle = shirt; ctx.lineWidth = 6; ctx.stroke();
  // Hand
  ctx.beginPath(); ctx.arc(-10, 14, 4, 0, Math.PI * 2);
  ctx.fillStyle = skin; ctx.fill();
  ctx.restore();

  // Right arm
  ctx.save();
  ctx.translate(12, 0);
  ctx.rotate(isGk ? -armAngle : 0.4);
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(10, 14);
  ctx.strokeStyle = shirt; ctx.lineWidth = 6; ctx.stroke();
  ctx.beginPath(); ctx.arc(10, 14, 4, 0, Math.PI * 2);
  ctx.fillStyle = skin; ctx.fill();
  ctx.restore();

  // Neck
  ctx.beginPath(); ctx.moveTo(-3, -8); ctx.lineTo(-3, -14); ctx.moveTo(3, -8); ctx.lineTo(3, -14);
  ctx.strokeStyle = skin; ctx.lineWidth = 5; ctx.stroke();

  // Head
  ctx.beginPath(); ctx.arc(0, -22, 10, 0, Math.PI * 2);
  ctx.fillStyle = skin; ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.1)"; ctx.lineWidth = 0.5; ctx.stroke();

  // Hair (simple)
  ctx.beginPath();
  ctx.arc(0, -28, 9, Math.PI, 0);
  ctx.fillStyle = isGk ? "#222" : "#1a0a00";
  ctx.fill();

  // Eyes
  ctx.beginPath(); ctx.arc(-3.5, -22, 1.5, 0, Math.PI * 2);
  ctx.beginPath(); ctx.arc(3.5, -22, 1.5, 0, Math.PI * 2);
  ctx.fillStyle = "#1a1a1a"; ctx.fill();

  // Name tag below
  ctx.font = "bold 7px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fillText(name, 0, 32);

  ctx.restore();
}

// Draw idle scene (jugadores en posicion, sin animacion)
function drawIdleScene(ctx, W, H, shooter, keeper, highlightZone) {
  const GW = W * 0.74, GH = H * 0.44;
  const GX = (W - GW) / 2, GY = H * 0.04;

  // Pitch
  ctx.fillStyle = "#111c0e"; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#173212" : "#1a3a15";
    ctx.fillRect(i * (W / 6), H * 0.55, W / 6, H * 0.45);
  }
  ctx.beginPath();
  ctx.arc(W / 2, H * 0.97, H * 0.22, Math.PI * 1.15, Math.PI * 1.85);
  ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.lineWidth = 1.2; ctx.stroke();
  ctx.beginPath(); ctx.arc(W / 2, H * 0.82, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fill();
  ctx.beginPath(); ctx.moveTo(GX - 14, GY + GH); ctx.lineTo(GX + GW + 14, GY + GH);
  ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 2; ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.07)"; ctx.lineWidth = 0.7;
  for (let nx = GX + 8; nx < GX + GW; nx += GW / 10) {
    ctx.beginPath(); ctx.moveTo(nx, GY + 4); ctx.lineTo(nx + 5, GY + GH - 2); ctx.stroke();
  }
  for (let ny = GY + 6; ny < GY + GH; ny += GH / 5) {
    ctx.beginPath(); ctx.moveTo(GX + 4, ny); ctx.lineTo(GX + GW - 4, ny); ctx.stroke();
  }

  // Highlight zones inside goal
  const zones = {
    izq:    { x: GX + 2,           y: GY + 2, w: GW * 0.33,  h: GH - 4 },
    centro: { x: GX + GW * 0.33,   y: GY + 2, w: GW * 0.34,  h: GH - 4 },
    der:    { x: GX + GW * 0.67,   y: GY + 2, w: GW * 0.33 - 2, h: GH - 4 },
  };
  Object.entries(zones).forEach(([key, z]) => {
    const isHover = highlightZone === key;
    ctx.fillStyle = isHover ? "rgba(245,158,11,0.25)" : "rgba(255,255,255,0.04)";
    ctx.fillRect(z.x, z.y, z.w, z.h);
    if (isHover) {
      ctx.strokeStyle = "rgba(245,158,11,0.7)"; ctx.lineWidth = 2;
      ctx.strokeRect(z.x, z.y, z.w, z.h);
    }
    // Zone label
    ctx.font = "bold 11px monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = isHover ? "#f59e0b" : "rgba(255,255,255,0.3)";
    const label = key === "izq" ? "←" : key === "centro" ? "↑" : "→";
    ctx.fillText(label, z.x + z.w / 2, z.y + z.h / 2);
  });

  // Keeper idle (slight sway)
  drawPlayer(ctx, W / 2, GY + GH - 5, 0.85, keeper.shirt, keeper.shorts, keeper.skin, keeper.num, keeper.name, 0, 0, 0.3, true);

  // Posts (on top of keeper)
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(GX + 3, GY + 3, 5, GH); ctx.fillRect(GX + GW - 10, GY + 3, 5, GH); ctx.fillRect(GX + 3, GY + 3, GW - 6, 5);
  ctx.fillStyle = "#f0f0e8";
  ctx.fillRect(GX, GY, 5, GH); ctx.fillRect(GX + GW - 5, GY, 5, GH); ctx.fillRect(GX, GY, GW, 5);
  ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.fillRect(GX + 1, GY + 1, 2, GH);

  // Ball on spot
  const ballR = 9;
  ctx.save(); ctx.translate(W / 2, H * 0.82);
  ctx.beginPath(); ctx.arc(0, 0, ballR, 0, Math.PI * 2);
  const bg = ctx.createRadialGradient(-3, -3, 1, 0, 0, ballR);
  bg.addColorStop(0, "#fff"); bg.addColorStop(0.7, "#e8e8e8"); bg.addColorStop(1, "#bbb");
  ctx.fillStyle = bg; ctx.fill();
  ctx.fillStyle = "#1a1a1a";
  for (let p = 0; p < 5; p++) { const a = (p/5)*Math.PI*2; ctx.beginPath(); ctx.arc(Math.cos(a)*ballR*0.5, Math.sin(a)*ballR*0.5, ballR*0.22, 0, Math.PI*2); ctx.fill(); }
  ctx.restore();

  // Shooter idle
  drawPlayer(ctx, W / 2, H * 0.87, 1.0, shooter.shirt, shooter.shorts, shooter.skin, shooter.num, shooter.name, 0, 0, 0.15, false);
}

function usePenaltyCanvas(canvasRef, animState) {
  const rafRef = useRef(null);
  const frameRef = useRef(0);
  const playersRef = useRef(null);

  useEffect(() => {
    if (!animState || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    frameRef.current = 0;
    const { shootDir, saveDir, scored, seed } = animState;

    if (!playersRef.current || animState !== playersRef.current.state) {
      const s = seed || Math.floor(Math.random() * 999);
      playersRef.current = { state: animState, shooter: pickRandom(SHOOTERS, s), keeper: pickRandom(KEEPERS, s + 3) };
    }
    const { shooter, keeper } = playersRef.current;

    const GW = W * 0.74, GH = H * 0.44;
    const GX = (W - GW) / 2, GY = H * 0.04;
    const POST = 5;

    // Todo desde perspectiva del ESPECTADOR
    // izq = izquierda de pantalla, der = derecha de pantalla
    const zonasX = {
      izq:    GX + GW * 0.2,
      centro: GX + GW * 0.5,
      der:    GX + GW * 0.8,
    };

    const ballStartX = W / 2, ballStartY = H * 0.87;
    const ballEndX = zonasX[shootDir];
    const ballEndY = GY + GH * 0.5;

    const gkStartX = W / 2, gkStartY = GY + GH - 5;

    // El portero se mueve a la zona donde el lanzador disparó
    // (desde perspectiva espectador, izq del lanzador = izq de pantalla)
    // El portero se tira hacia donde va el balón
    const gkZonaX = {
      izq:    GX + 22,
      centro: W / 2,
      der:    GX + GW - 22,
    };
    const gkZonaY = {
      izq:    GY + GH * 0.25,
      centro: GY + GH - 5,
      der:    GY + GH * 0.25,
    };

    const gkEndX = gkZonaX[saveDir];
    const gkEndY = gkZonaY[saveDir];

    // Lean del portero: si va a izq de pantalla, se inclina a izq (-), si va a der se inclina a der (+)
    const gkLeanDir = saveDir === "izq" ? -1 : saveDir === "der" ? 1 : 0;

    const TOTAL_FRAMES = 60;

    const drawPitch = () => {
      ctx.fillStyle = "#111c0e"; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 6; i++) {
        ctx.fillStyle = i % 2 === 0 ? "#173212" : "#1a3a15";
        ctx.fillRect(i * (W / 6), H * 0.55, W / 6, H * 0.45);
      }
      ctx.beginPath();
      ctx.arc(W / 2, H * 0.97, H * 0.22, Math.PI * 1.15, Math.PI * 1.85);
      ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.beginPath(); ctx.arc(W / 2, H * 0.82, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fill();
      ctx.beginPath(); ctx.moveTo(GX - 14, GY + GH); ctx.lineTo(GX + GW + 14, GY + GH);
      ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 2; ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.07)"; ctx.lineWidth = 0.7;
      for (let nx = GX + 8; nx < GX + GW; nx += GW / 10) {
        ctx.beginPath(); ctx.moveTo(nx, GY + 4); ctx.lineTo(nx + 5, GY + GH - 2); ctx.stroke();
      }
      for (let ny = GY + 6; ny < GY + GH; ny += GH / 5) {
        ctx.beginPath(); ctx.moveTo(GX + 4, ny); ctx.lineTo(GX + GW - 4, ny); ctx.stroke();
      }
    };

    const drawGoal = () => {
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(GX + 3, GY + 3, POST, GH);
      ctx.fillRect(GX + GW - POST - 1, GY + 3, POST, GH);
      ctx.fillRect(GX + 3, GY + 3, GW - 6, POST);
      ctx.fillStyle = "#f0f0e8";
      ctx.fillRect(GX, GY, POST, GH);
      ctx.fillRect(GX + GW - POST, GY, POST, GH);
      ctx.fillRect(GX, GY, GW, POST);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fillRect(GX + 1, GY + 1, 2, GH);
    };

    const drawBall = (bx, by, frame, t) => {
      const r = 10 - t * 3;
      const spin = frame * 0.3;
      ctx.save(); ctx.translate(bx, by);
      ctx.save(); ctx.scale(1, 0.4);
      ctx.beginPath(); ctx.arc(0, r * 2, r * 0.9, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.2)"; ctx.fill();
      ctx.restore();
      ctx.rotate(spin);
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
      const ballGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
      ballGrad.addColorStop(0, "#ffffff");
      ballGrad.addColorStop(0.7, "#e8e8e8");
      ballGrad.addColorStop(1, "#c0c0c0");
      ctx.fillStyle = ballGrad; ctx.fill();
      ctx.fillStyle = "#1a1a1a";
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 + spin * 0.3;
        const px = Math.cos(a) * r * 0.52, py = Math.sin(a) * r * 0.52;
        ctx.beginPath();
        for (let v = 0; v < 5; v++) {
          const va = (v / 5) * Math.PI * 2;
          const vx = px + Math.cos(va) * r * 0.22, vy = py + Math.sin(va) * r * 0.22;
          v === 0 ? ctx.moveTo(vx, vy) : ctx.lineTo(vx, vy);
        }
        ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    };

    const draw = () => {
      const t = Math.min(frameRef.current / TOTAL_FRAMES, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const easeIn = t * t;

      ctx.clearRect(0, 0, W, H);
      drawPitch();

      // Portero se mueve hacia donde va el balón
      const gkX = gkStartX + (gkEndX - gkStartX) * ease;
      const gkY = gkStartY + (gkEndY - gkStartY) * ease;
      const gkLean = gkLeanDir * 1.1 * ease;
      const gkArm = ease * 1.2;
      drawPlayer(ctx, gkX, gkY, 0.85, keeper.shirt, keeper.shorts, keeper.skin, keeper.num, keeper.name, gkLean, 0, gkArm, true);

      // Balón va a donde el lanzador eligió
      const bx = ballStartX + (ballEndX - ballStartX) * ease;
      const arcY = -H * 0.08 * Math.sin(t * Math.PI);
      const by = ballStartY + (ballEndY - ballStartY) * ease + arcY;
      drawBall(bx, by, frameRef.current, ease);

      const runOffset = Math.min(ease, 0.4) * 18;
      const kickLean = easeIn * 0.35;
      const legSwing = easeIn * 1.1;
      drawPlayer(ctx, W / 2 + runOffset, H * 0.87, 1.0, shooter.shirt, shooter.shorts, shooter.skin, shooter.num, shooter.name, kickLean, legSwing, 0.2, false);

      drawGoal();

      if (t >= 1) {
        ctx.save();
        ctx.fillStyle = scored ? "rgba(245,158,11,0.18)" : "rgba(0,100,200,0.18)";
        ctx.fillRect(0, 0, W, H);
        ctx.font = "bold 36px 'Bebas Neue', monospace";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillStyle = scored ? "#f59e0b" : "#005599";
        ctx.shadowColor = scored ? "#f59e0b" : "#005599";
        ctx.shadowBlur = 18;
        ctx.fillText(scored ? "¡GOL!" : "¡PARADA!", W / 2, H / 2);
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      frameRef.current++;
      if (frameRef.current <= TOTAL_FRAMES + 30) rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animState]);
}

function useIdleCanvas(canvasRef, shooter, keeper, highlightZone, active) {
  useEffect(() => {
    if (!active || !canvasRef.current || !shooter || !keeper) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawIdleScene(ctx, canvas.width, canvas.height, shooter, keeper, highlightZone);
  }, [shooter, keeper, highlightZone, active, canvasRef]);
}

function PenaltyGame({ user, onBack }) {
  const [phase, setPhase] = useState("lobby");
  const [roomCode, setRoomCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [room, setRoom] = useState(null);
  const [myRole, setMyRole] = useState(null);
  const [myChoice, setMyChoice] = useState(null);
  const [waitingForOther, setWaitingForOther] = useState(false);
  const [animState, setAnimState] = useState(null);
  const [error, setError] = useState("");
  const [hoverZone, setHoverZone] = useState(null);
  const [players, setPlayers] = useState(null);
  const canvasRef = useRef(null);
  const channelRef = useRef(null);
  const roomIdRef = useRef(null);
  const myRoleRef = useRef(null);

  // Pick players when game starts
  useEffect(() => {
    if (phase === "playing" && !players) {
      const s = Math.floor(Math.random() * 999);
      setPlayers({ shooter: pickRandom(SHOOTERS, s), keeper: pickRandom(KEEPERS, s + 3) });
    }
  }, [phase]);

  const isIdle = phase === "playing" && !animState && !waitingForOther;
  usePenaltyCanvas(canvasRef, animState);
  useIdleCanvas(canvasRef, players?.shooter, players?.keeper, hoverZone, isIdle);
  useEffect(() => { myRoleRef.current = myRole; }, [myRole]);
  useEffect(() => {
    return () => {
      if (channelRef.current) channelRef.current.unsubscribe();
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const pollRef = useRef(null);

  const prevChoicesRef = useRef({ p1: null, p2: null });

  const checkRoom = async (roomId) => {
    const { data } = await supabase.from("penalty_rooms").select("*").eq("id", roomId).single();
    if (!data) return;
    setRoom(data);
    if (data.status === "playing") setPhase("playing");
    if (data.status === "finished") setPhase("finished");

    // p1 resuelve la ronda cuando ambos han elegido
    if (data.p1_turn_choice && data.p2_turn_choice && data.status === "playing" && myRoleRef.current === "p1") {
      resolveRound(data);
      return;
    }

    // p2: detectar que la ronda fue resuelta (choices vuelven a null) y resetear su estado
    if (myRoleRef.current === "p2") {
      const hadChoices = prevChoicesRef.current.p1 || prevChoicesRef.current.p2;
      const nowEmpty = !data.p1_turn_choice && !data.p2_turn_choice;
      if (hadChoices && nowEmpty) {
        // p1 acaba de resolver la ronda, sacar resultado del ultimo shot
        // El shooter anterior era el que tenía más shots antes de que se vaciaran los choices
        const p1s = Array.isArray(data.p1_shots) ? data.p1_shots : [];
        const p2s = Array.isArray(data.p2_shots) ? data.p2_shots : [];
        // El último en tirar es quien tiene el último shot en total
        const lastP1 = p1s[p1s.length - 1];
        const lastP2 = p2s[p2s.length - 1];
        // Comparar por índice total: quien tiene más shots tiró en el último turno
        const lastShot = p1s.length > p2s.length ? lastP1 : p2s.length > p1s.length ? lastP2 : (lastP1 || lastP2);
        if (lastShot) { setAnimState({ shootDir: lastShot.shoot, saveDir: lastShot.save, scored: lastShot.scored, seed: (data.p1_score + data.p2_score + p1s.length + p2s.length) }); setHoverZone(null); }
        setMyChoice(null);
        setWaitingForOther(false);
        setTimeout(() => setAnimState(null), 2800);
      }
    }
    prevChoicesRef.current = { p1: data.p1_turn_choice, p2: data.p2_turn_choice };
  };

  const subscribeRoom = (roomId) => {
    if (channelRef.current) channelRef.current.unsubscribe();
    channelRef.current = supabase
      .channel(`penalty_room_${roomId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "penalty_rooms", filter: `id=eq.${roomId}` },
        payload => {
          // Route through checkRoom so p2 reset logic runs in one place
          checkRoom(roomId);
        })
      .subscribe();
    // Polling fallback cada 2s por si Realtime no llega
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => checkRoom(roomId), 2000);
  };

  const createRoom = async () => {
    setError("");
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    const { data, error: err } = await supabase.from("penalty_rooms").insert({
      code, player1_id: user.id, player1_name: user.name,
      status: "waiting", current_round: 1, current_shooter: "p1",
      p1_shots: [], p2_shots: [], p1_score: 0, p2_score: 0,
    }).select().single();
    if (err) { setError("Error al crear sala: " + err.message); return; }
    setRoomCode(code); setMyRole("p1"); setRoom(data);
    roomIdRef.current = data.id; subscribeRoom(data.id); setPhase("waiting");
  };

  const joinRoom = async () => {
    setError("");
    if (!inputCode.trim()) return;
    const { data, error: err } = await supabase.from("penalty_rooms")
      .select("*").eq("code", inputCode.trim().toUpperCase()).eq("status", "waiting").single();
    if (err || !data) { setError("Sala no encontrada o ya en curso"); return; }
    if (data.player1_id === user.id) { setError("No puedes unirte a tu propia sala"); return; }
    const { data: updated, error: err2 } = await supabase.from("penalty_rooms")
      .update({ player2_id: user.id, player2_name: user.name, status: "playing" })
      .eq("id", data.id).select().single();
    if (err2) { setError("Error al unirse"); return; }
    setMyRole("p2"); setRoom(updated); roomIdRef.current = updated.id; subscribeRoom(updated.id); setPhase("playing");
  };

  const submitChoice = async () => {
    if (!myChoice) return;
    setWaitingForOther(true);
    const field = myRole === "p1" ? "p1_turn_choice" : "p2_turn_choice";
    await supabase.from("penalty_rooms").update({ [field]: JSON.stringify({ choice: myChoice }) }).eq("id", roomIdRef.current);
  };

  const resolveRound = async (r) => {
    try {
      const p1c = typeof r.p1_turn_choice === "string" ? JSON.parse(r.p1_turn_choice) : r.p1_turn_choice;
      const p2c = typeof r.p2_turn_choice === "string" ? JSON.parse(r.p2_turn_choice) : r.p2_turn_choice;
      const shooter = r.current_shooter;
      const shootDir = shooter === "p1" ? p1c.choice : p2c.choice;
      const saveDir = shooter === "p1" ? p2c.choice : p1c.choice;
      const scored = shootDir !== saveDir;
      const newP1Score = r.p1_score + (shooter === "p1" && scored ? 1 : 0);
      const newP2Score = r.p2_score + (shooter === "p2" && scored ? 1 : 0);
      const p1Shots = Array.isArray(r.p1_shots) ? [...r.p1_shots] : [];
      const p2Shots = Array.isArray(r.p2_shots) ? [...r.p2_shots] : [];
      if (shooter === "p1") p1Shots.push({ shoot: shootDir, save: saveDir, scored });
      else p2Shots.push({ shoot: shootDir, save: saveDir, scored });
      let nextShooter = shooter === "p1" ? "p2" : "p1";
      let nextRound = r.current_round;
      if (nextShooter === "p1") nextRound += 1;
      const totalShots = p1Shots.length + p2Shots.length;
      const nextStatus = totalShots >= 10 ? "finished" : "playing";
      await supabase.from("penalty_rooms").update({
        p1_score: newP1Score, p2_score: newP2Score,
        current_round: Math.min(nextRound, 5), current_shooter: nextShooter,
        status: nextStatus, p1_shots: p1Shots, p2_shots: p2Shots,
        p1_turn_choice: null, p2_turn_choice: null,
      }).eq("id", r.id);
      setAnimState({ shootDir, saveDir, scored, seed: (newP1Score + newP2Score + p1Shots.length + p2Shots.length) }); setHoverZone(null);
      setMyChoice(null); setWaitingForOther(false); setHoverZone(null);
      setTimeout(() => setAnimState(null), 2800);
    } catch (e) { console.error("resolveRound error", e); }
  };

  const myScore = room ? (myRole === "p1" ? room.p1_score : room.p2_score) : 0;
  const theirScore = room ? (myRole === "p1" ? room.p2_score : room.p1_score) : 0;
  const theirName = room ? (myRole === "p1" ? room.player2_name : room.player1_name) : "";
  const amIShooter = room && room.current_shooter === myRole;
  const myShots = room ? (myRole === "p1" ? (Array.isArray(room.p1_shots) ? room.p1_shots : []) : (Array.isArray(room.p2_shots) ? room.p2_shots : [])) : [];
  const theirShots = room ? (myRole === "p1" ? (Array.isArray(room.p2_shots) ? room.p2_shots : []) : (Array.isArray(room.p1_shots) ? room.p1_shots : [])) : [];

  const btnSt = (val) => ({
    flex: 1, padding: "14px 4px", border: `1px solid ${myChoice === val ? GREEN : BORDER}`,
    borderRadius: "10px", background: myChoice === val ? GREEN_DIM : CARD,
    color: myChoice === val ? GREEN : "#d0e4f7", fontFamily: "monospace", fontSize: "12px",
    cursor: "pointer", textAlign: "center", fontWeight: myChoice === val ? 700 : 400,
  });

  if (phase === "lobby") return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <button onClick={onBack} style={{ padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "monospace", fontSize: "11px" }}>← Volver</button>
        <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "3px" }}>PENALTIS 1v1</p>
      </div>
      <div style={{ background: CARD, border: "1px solid rgba(255,82,82,0.2)", borderRadius: "14px", padding: "24px", textAlign: "center", marginBottom: "20px" }}>
        <div style={{ fontSize: "48px", marginBottom: "10px" }}>🥅</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: "#e0eaf8", letterSpacing: "3px", marginBottom: "8px" }}>PENALTIS 1v1</div>
        <p style={{ fontSize: "11px", color: "#c0d8f0", fontFamily: "monospace", lineHeight: 1.8 }}>Multijugador · 5 penaltis cada uno<br/>Se alternan lanzador y portero</p>
      </div>
      {error && <p style={{ color: "#cc2222", fontFamily: "monospace", fontSize: "12px", marginBottom: "12px", textAlign: "center" }}>⚠ {error}</p>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <button onClick={createRoom} style={{ padding: "20px", border: `1px solid ${GREEN}`, borderRadius: "12px", background: GREEN_DIM, color: GREEN, fontFamily: "monospace", fontSize: "12px", cursor: "pointer", fontWeight: 700 }}>➕ CREAR SALA</button>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "14px" }}>
          <p style={{ fontSize: "9px", color: "#e0eefa", fontFamily: "monospace", marginBottom: "8px", letterSpacing: "2px" }}>UNIRSE CON CÓDIGO</p>
          <input value={inputCode} onChange={e => setInputCode(e.target.value.toUpperCase())} placeholder="XXXXX" maxLength={5}
            style={{ width: "100%", padding: "10px", marginBottom: "8px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "rgba(0,0,0,0.3)", color: "#e0eaf8", fontSize: "18px", fontFamily: "'Bebas Neue', monospace", letterSpacing: "4px", textAlign: "center", outline: "none" }} />
          <button onClick={joinRoom} style={{ width: "100%", padding: "10px", border: "none", borderRadius: "7px", background: GREEN, color: "#0a1628", fontFamily: "monospace", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>UNIRSE</button>
        </div>
      </div>
    </div>
  );

  if (phase === "waiting") return (
    <div style={{ animation: "fadeIn 0.3s ease", textAlign: "center", padding: "40px 0" }}>
      <div style={{ fontSize: "52px", marginBottom: "16px" }}>⏳</div>
      <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: "#e0eaf8", marginBottom: "8px" }}>ESPERANDO RIVAL</div>
      <p style={{ fontFamily: "monospace", fontSize: "12px", color: "#e0eefa", marginBottom: "24px" }}>Comparte este código:</p>
      <div style={{ display: "inline-block", background: GREEN_DIM, border: `2px solid ${GREEN}`, borderRadius: "12px", padding: "16px 32px", marginBottom: "24px" }}>
        <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "42px", color: GREEN, letterSpacing: "8px" }}>{roomCode}</span>
      </div>
      <p style={{ fontFamily: "monospace", fontSize: "10px", color: "#cce0f5" }}>La partida comenzará automáticamente</p>
      <button onClick={onBack} style={{ display: "block", margin: "24px auto 0", padding: "8px 16px", border: `1px solid ${BORDER}`, borderRadius: "7px", background: "transparent", color: "#e0eefa", cursor: "pointer", fontFamily: "monospace", fontSize: "11px" }}>Cancelar</button>
    </div>
  );

  if (phase === "playing" && room) return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "8px", marginBottom: "12px", alignItems: "center" }}>
        <div style={{ background: GREEN_DIM, border: `1px solid rgba(245,158,11,0.3)`, borderRadius: "10px", padding: "10px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "36px", color: GREEN }}>{myScore}</div>
          <div style={{ fontSize: "9px", fontFamily: "monospace", color: "#c0d8f0" }}>TÚ · {amIShooter ? "⚽ LANZAS" : "🧤 PARAS"}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#cce0f5", marginBottom: "2px" }}>RONDA {room.current_round}/5</div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#cce0f5" }}>VS</div>
        </div>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "10px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "36px", color: "#e0eaf8" }}>{theirScore}</div>
          <div style={{ fontSize: "9px", fontFamily: "monospace", color: "#c0d8f0" }}>{theirName?.split(" ")[0] || "Rival"}</div>
        </div>
      </div>

      {/* Canvas — siempre visible */}
      <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: `1px solid ${BORDER}`, marginBottom: "10px", background: "#111c0e" }}>
        <canvas ref={canvasRef} width={360} height={260} style={{ display: "block", width: "100%", height: "auto" }} />

        {/* Clickable goal zones — solo cuando el usuario elige */}
        {!animState && !waitingForOther && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
            {/* Instruction overlay top */}
            <div style={{ position: "absolute", top: "6px", left: 0, right: 0, textAlign: "center" }}>
              <span style={{ fontSize: "10px", fontFamily: "'Bebas Neue', cursive", letterSpacing: "2px",
                color: amIShooter ? "#f59e0b" : "#005599",
                background: "rgba(0,0,0,0.55)", padding: "2px 10px", borderRadius: "6px" }}>
                {amIShooter ? "⚽ TAP DONDE DISPARAS" : "🧤 TAP DONDE TE TIRAS"}
              </span>
            </div>

            {/* Three clickable zones over the goal area (top ~46% of canvas) */}
            {["izq","centro","der"].map((zone, i) => (
              <div key={zone}
                onClick={() => { setMyChoice(zone); setHoverZone(zone); }}
                onMouseEnter={() => setHoverZone(zone)}
                onMouseLeave={() => !myChoice && setHoverZone(null)}
                style={{
                  position: "absolute",
                  top: "4%", height: "42%",
                  left: i === 0 ? "13%" : i === 1 ? "46%" : "67%",
                  width: "21%",
                  cursor: "pointer",
                  borderRadius: "4px",
                  background: myChoice === zone ? "rgba(245,158,11,0.15)" : "transparent",
                  border: myChoice === zone ? "2px solid rgba(245,158,11,0.8)" : "2px solid transparent",
                  transition: "all 0.15s ease",
                }}
              />
            ))}
          </div>
        )}

        {/* Waiting overlay */}
        {waitingForOther && !animState && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(28,21,16,0.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px", animation: "pulse 1.5s infinite" }}>⏳</div>
            <p style={{ fontFamily: "monospace", fontSize: "12px", color: "#e0eefa" }}>Esperando a {theirName?.split(" ")[0] || "rival"}...</p>
          </div>
        )}
      </div>

      {/* Confirm button or result */}
      {animState ? (
        <div style={{ padding: "12px", background: animState.scored ? GREEN_DIM : "rgba(255,82,82,0.1)", border: `1px solid ${animState.scored ? "rgba(245,158,11,0.4)" : "rgba(255,82,82,0.3)"}`, borderRadius: "10px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "24px", letterSpacing: "3px", color: animState.scored ? GREEN : "#cc2222" }}>
            {animState.scored ? "⚽ ¡GOL!" : "🧤 ¡PARADA!"}
          </p>
          <p style={{ fontFamily: "monospace", fontSize: "10px", color: "#d0e4f7", marginTop: "3px" }}>
            Disparo: {PENALTY_LABELS[animState.shootDir]} · Parada: {PENALTY_LABELS[animState.saveDir]}
          </p>
        </div>
      ) : !waitingForOther && (
        <button onClick={() => { if (myChoice) submitChoice(); }}
          disabled={!myChoice}
          style={{ width: "100%", padding: "13px", border: "none", borderRadius: "9px",
            background: myChoice ? `linear-gradient(135deg,${GREEN},#e07b00)` : "rgba(0,0,0,0.2)",
            color: myChoice ? "#0a1628" : "#cce0f5",
            fontFamily: "'Bebas Neue', cursive", fontSize: "16px", fontWeight: 800,
            cursor: myChoice ? "pointer" : "default", letterSpacing: "3px" }}>
          {myChoice ? `CONFIRMAR ${PENALTY_LABELS[myChoice]}` : "TAP EN LA PORTERÍA"}
        </button>
      )}

      {(myShots.length > 0 || theirShots.length > 0) && (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "10px", marginTop: "10px" }}>
          <p style={{ fontSize: "9px", color: "#cce0f5", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "6px" }}>HISTORIAL</p>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "9px", color: "#cce0f5", fontFamily: "monospace", marginRight: "4px" }}>TÚ:</span>
            {myShots.map((s, i) => <span key={i} style={{ fontSize: "16px" }}>{s.scored ? "⚽" : "❌"}</span>)}
            <span style={{ color: "#b8d4ee", margin: "0 8px" }}>|</span>
            <span style={{ fontSize: "9px", color: "#cce0f5", fontFamily: "monospace", marginRight: "4px" }}>RIVAL:</span>
            {theirShots.map((s, i) => <span key={i} style={{ fontSize: "16px" }}>{s.scored ? "⚽" : "❌"}</span>)}
          </div>
        </div>
      )}
    </div>
  );

  if (phase === "finished" && room) {
    const iWon = myScore > theirScore;
    const draw = myScore === theirScore;
    return (
      <div style={{ animation: "fadeIn 0.3s ease", textAlign: "center" }}>
        <div style={{ background: CARD, border: `1px solid ${iWon ? "rgba(245,158,11,0.4)" : draw ? BORDER : "rgba(255,82,82,0.25)"}`, borderRadius: "14px", padding: "28px", marginBottom: "20px" }}>
          <div style={{ fontSize: "52px", marginBottom: "10px" }}>{iWon ? "🏆" : draw ? "🤝" : "😔"}</div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: iWon ? GREEN : draw ? "#e0eefa" : "#cc2222", letterSpacing: "3px", marginBottom: "16px" }}>
            {iWon ? "¡GANASTE!" : draw ? "EMPATE" : "PERDISTE"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "8px", alignItems: "center", marginBottom: "16px" }}>
            <div><div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "52px", color: GREEN }}>{myScore}</div><div style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "monospace" }}>TÚ</div></div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#cce0f5" }}>VS</div>
            <div><div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "52px", color: "#e0eaf8" }}>{theirScore}</div><div style={{ fontSize: "10px", color: "#c0d8f0", fontFamily: "monospace" }}>{theirName?.split(" ")[0] || "Rival"}</div></div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
            {myShots.map((s, i) => <span key={i} style={{ fontSize: "18px" }}>{s.scored ? "⚽" : "❌"}</span>)}
          </div>
        </div>
        <button onClick={() => { setPhase("lobby"); setRoom(null); setMyRole(null); setMyChoice(null); setAnimState(null); setWaitingForOther(false); if (pollRef.current) clearInterval(pollRef.current); }}
          style={{ padding: "13px 36px", border: "none", borderRadius: "10px", background: `linear-gradient(135deg,${GREEN},#e07b00)`, color: "#0a1628", fontFamily: "monospace", fontSize: "12px", fontWeight: 800, cursor: "pointer", letterSpacing: "3px" }}>
          🔄 NUEVA PARTIDA
        </button>
      </div>
    );
  }
  return null;
}


// ============================================================
// VISTA JUEGOS
// ============================================================
function GamesView({ user }) {
  const [game, setGame] = useState(null);

  if (game === "trivia") return <TriviaGame user={user} onBack={() => setGame(null)} />;
  if (game === "flappy") return <FlappyGame user={user} onBack={() => setGame(null)} />;
  if (game === "flags") return <FlagsGame user={user} onBack={() => setGame(null)} />;
  if (game === "penalty") return <PenaltyGame user={user} onBack={() => setGame(null)} />;

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <p style={{ fontSize: "9px", color: "#d0e4f7", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "20px" }}>ZONA DE JUEGOS</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <button onClick={() => setGame("trivia")} style={{ padding: "20px 12px", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "14px", background: "rgba(245,158,11,0.05)", cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: "34px", marginBottom: "8px" }}>🧠</div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", color: "#e0eaf8", letterSpacing: "2px", marginBottom: "4px" }}>TRIVIAL</div>
          <div style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "monospace" }}>10 preguntas · 1 jugador</div>
        </button>
        <button onClick={() => setGame("flappy")} style={{ padding: "20px 12px", border: "1px solid rgba(0,176,255,0.2)", borderRadius: "14px", background: "rgba(0,176,255,0.05)", cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: "34px", marginBottom: "8px" }}>⚽</div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", color: "#e0eaf8", letterSpacing: "2px", marginBottom: "4px" }}>FLAPPY BALÓN</div>
          <div style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "monospace" }}>Esquiva porterías · 1 jugador</div>
        </button>
        <button onClick={() => setGame("flags")} style={{ padding: "20px 12px", border: "1px solid rgba(255,193,7,0.2)", borderRadius: "14px", background: "rgba(255,193,7,0.05)", cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: "34px", marginBottom: "8px" }}>🌍</div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", color: "#e0eaf8", letterSpacing: "2px", marginBottom: "4px" }}>BANDERAS</div>
          <div style={{ fontSize: "9px", color: "#c0d8f0", fontFamily: "monospace" }}>48 países · 1 jugador</div>
        </button>
        <button onClick={() => setGame("penalty")} style={{ padding: "20px 12px", border: "1px solid rgba(255,82,82,0.2)", borderRadius: "14px", background: "rgba(255,82,82,0.05)", cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: "34px", marginBottom: "8px" }}>🥅</div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", color: "#e0eaf8", letterSpacing: "2px", marginBottom: "4px" }}>PENALTIS</div>
          <div style={{ fontSize: "9px", color: "#ff8a80", fontFamily: "monospace" }}>5 penaltis · 2 jugadores 🔴</div>
        </button>
      </div>
    </div>
  );
}


// ============================================================
// TUTORIAL ONBOARDING (tooltips primera vez)
// ============================================================
const ONBOARDING_STEPS = [
  {
    tab: "home",
    icon: "🏠",
    title: "Pantalla de inicio",
    text: "Desde aquí accedes a todas las secciones. Cuenta atrás, tu progreso de pronósticos y acceso rápido a todo.",
  },
  {
    tab: "groups",
    icon: "⚽",
    title: "Mis pronósticos",
    text: "Introduce el marcador que crees que tendrá cada partido. Se guarda automáticamente. +3 exacto, +1 ganador.",
  },
  {
    tab: "community",
    icon: "👥",
    title: "Todos los pronósticos",
    text: "Una vez cerrado un partido, puedes ver qué pronóstico puso cada participante y cuántos puntos sacaron.",
  },
  {
    tab: "ranking",
    icon: "🏆",
    title: "Ranking",
    text: "Consulta la clasificación general de todos los participantes en tiempo real. ¿Quién va ganando la porra?",
  },
];

function OnboardingTooltips({ user, onFinish, setView }) {
  const [step, setStep] = useState(0);
  const current = ONBOARDING_STEPS[step];
  const isLast = step === ONBOARDING_STEPS.length - 1;

  // Tab index en la barra inferior para calcular posición del indicador
  const bottomTabs = ["home", "groups", "community", "ranking"];
  const tabIdx = bottomTabs.indexOf(current.tab);
  const tabCount = bottomTabs.length;
  const arrowLeft = tabIdx >= 0 ? `calc(${(tabIdx + 0.5) / tabCount * 100}%)` : "50%";

  const next = () => {
    if (isLast) { onFinish(); return; }
    setView(ONBOARDING_STEPS[step + 1].tab);
    setStep(s => s + 1);
  };

  const skip = () => onFinish();

  return (
    <>
      {/* Overlay oscuro */}
      <div style={{ position: "fixed", inset: 0, zIndex: 200, pointerEvents: "none" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(28,21,16,0.85)" }} />
        {/* Hueco iluminado en la barra inferior */}
        {tabIdx >= 0 && (
          <div style={{
            position: "absolute", bottom: 0, left: `calc(${tabIdx / tabCount * 100}%)`,
            width: `${100 / tabCount}%`, height: "64px",
            background: "transparent",
            boxShadow: `0 0 0 9999px rgba(28,21,16,0.85), 0 0 20px 4px rgba(245,158,11,0.5)`,
            borderRadius: "8px 8px 0 0",
          }} />
        )}
      </div>

      {/* Tooltip card */}
      <div style={{
        position: "fixed", bottom: "80px", left: "50%", transform: "translateX(-50%)",
        width: "calc(100% - 32px)", maxWidth: "420px",
        zIndex: 201, animation: "fadeIn 0.25s ease",
      }}>
        {tabIdx >= 0 && (
          <div style={{
            position: "absolute", bottom: "-8px", left: arrowLeft, transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "8px solid transparent", borderRight: "8px solid transparent",
            borderTop: `8px solid ${GREEN}`,
          }} />
        )}
        <div style={{
          background: "#0f0f0f", border: `1px solid ${GREEN}`,
          borderRadius: "14px", padding: "18px 18px 14px",
          boxShadow: `0 0 30px rgba(245,158,11,0.2)`,
        }}>
          <div style={{ display: "flex", gap: "5px", marginBottom: "12px" }}>
            {ONBOARDING_STEPS.map((_, i) => (
              <div key={i} style={{ flex: 1, height: "3px", borderRadius: "2px", background: i <= step ? GREEN : "rgba(245,158,11,0.15)", transition: "background 0.3s" }} />
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
            <span style={{ fontSize: "28px", lineHeight: 1 }}>{current.icon}</span>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: GREEN, letterSpacing: "2px", marginBottom: "5px" }}>{current.title}</div>
              <p style={{ fontSize: "12px", color: "#c8a87a", fontFamily: "monospace", lineHeight: 1.6 }}>{current.text}</p>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={skip} style={{ padding: "6px 12px", border: "none", background: "transparent", color: "#cce0f5", fontFamily: "monospace", fontSize: "11px", cursor: "pointer" }}>
              Saltar tutorial
            </button>
            <button onClick={next} style={{
              padding: "10px 22px", border: "none", borderRadius: "8px",
              background: `linear-gradient(135deg,${GREEN},#e07b00)`,
              color: "#0a1628", fontFamily: "monospace", fontSize: "12px", fontWeight: 800,
              cursor: "pointer", letterSpacing: "2px",
            }}>
              {isLast ? "¡EMPEZAR! 🚀" : "SIGUIENTE →"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ position: "fixed", inset: 0, zIndex: 199 }} onClick={next} />
    </>
  );
}

// ============================================================
// APP PRINCIPAL
// ============================================================
export default function Home() {
  const [screen, setScreen] = useState("login");
  const [user, setUser] = useState(null);
  const [view, setView] = useState("home");
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [allClosed, setAllClosed] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        const isOnboarded = profile?.onboarded === true;
        setUser({ ...session.user, name: profile?.name || session.user.email, role: profile?.role || "user" });
        setScreen("app");
        // if (!isOnboarded) setShowOnboarding(true);
      }
      setLoadingSession(false);
    });
  }, []);

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    const { data: dbMatches } = await supabase.from("matches").select("*").order("match_date");
    let finalMatches;

    if (dbMatches && dbMatches.length > 0) {
      // ✅ Siempre sincronizar fechas/horas desde MATCH_SCHEDULE
      const updates = [];
      for (const m of dbMatches) {
        const localMatch = ALL_MATCHES.find(x => x.id === m.id);
        if (localMatch && (m.match_date !== localMatch.match_date || m.match_time !== localMatch.match_time)) {
          updates.push(
            supabase.from("matches")
              .update({ match_date: localMatch.match_date, match_time: localMatch.match_time })
              .eq("id", m.id)
          );
        }
      }
      if (updates.length > 0) await Promise.all(updates);

      // Recargar tras actualizar
      const { data: refreshed } = await supabase.from("matches").select("*").order("match_date");
      finalMatches = refreshed || dbMatches;
    } else {
      // Primera vez: insertar todos los partidos
      const chunks = [];
      for (let i = 0; i < ALL_MATCHES.length; i += 10) chunks.push(ALL_MATCHES.slice(i, i + 10));
      let all = [];
      for (const chunk of chunks) {
        const { data } = await supabase.from("matches").insert(chunk).select();
        if (data) all = [...all, ...data];
      }
      finalMatches = all.length > 0 ? all : ALL_MATCHES;
    }

    setMatches(finalMatches);
    setAllClosed(finalMatches.length > 0 && finalMatches.every(m => m.status === "closed"));
    if (user) {
      const { data: p } = await supabase.from("predictions").select("*").eq("user_id", user.id);
      setPredictions(p || []);
    }
  };

  const handleLogin = async (u) => {
    setUser(u);
    setScreen("app");
    // Comprobar si ya ha hecho el onboarding
    const { data: profile } = await supabase.from("profiles").select("onboarded").eq("id", u.id).single();
    // if (!profile?.onboarded) setShowOnboarding(true);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); setScreen("login"); };

  const finishOnboarding = async () => {
    setShowOnboarding(false);
    setView("home");
    if (user) await supabase.from("profiles").update({ onboarded: true }).eq("id", user.id);
  };

  if (loadingSession) return (
    <div style={{ minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}><div style={{ fontSize: "44px", marginBottom: "10px" }}>⚽</div><span style={{ color: GREEN, fontFamily: "monospace", letterSpacing: "4px", fontSize: "11px" }}>CARGANDO...</span></div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: DARK, color: "#e0eaf8" }}>
      <style>{css}</style>
      {screen === "login" && <LoginPage onLogin={handleLogin} />}
      {screen === "app" && user && (
        <>
          <NavBar user={user} view={view} setView={setView} onLogout={handleLogout} />
          <div style={{ maxWidth: "700px", margin: "0 auto", padding: "62px 14px 84px", position: "relative", zIndex: 1 }}>
            {view === "home" && <HomeView user={user} matches={matches} predictions={predictions} setView={setView} />}
            {view === "groups" && <GroupsView user={user} matches={matches} predictions={predictions} onDataChange={loadData} allClosed={allClosed} />}
            {view === "results" && <ResultsView matches={matches} />}
            {view === "community" && <CommunityView matches={matches} user={user} />}
            {view === "profile" && <ProfileView user={user} matches={matches} />}
            {view === "ranking" && <RankingView />}
            {view === "games" && <GamesView user={user} />}
            {view === "admin" && user.role === "admin" && <AdminView matches={matches} onDataChange={loadData} />}
            {view === "export" && user.role === "admin" && <ExportView matches={matches} onBack={() => setView("home")} />}
          </div>
          {/* {showOnboarding && <OnboardingTooltips user={user} onFinish={finishOnboarding} setView={setView} />}*/}
        </>
      )}
    </div>
  );
}
