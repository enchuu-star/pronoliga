"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ============================================================
// DATOS DEL MUNDIAL 2026
// ============================================================
const GROUPS = {
  A: [{ name: "México", flag: "🇲🇽" }, { name: "Ecuador", flag: "🇪🇨" }, { name: "Países Bajos", flag: "🇳🇱" }, { name: "Senegal", flag: "🇸🇳" }],
  B: [{ name: "Argentina", flag: "🇦🇷" }, { name: "Chile", flag: "🇨🇱" }, { name: "Croacia", flag: "🇭🇷" }, { name: "Marruecos", flag: "🇲🇦" }],
  C: [{ name: "Brasil", flag: "🇧🇷" }, { name: "Colombia", flag: "🇨🇴" }, { name: "Alemania", flag: "🇩🇪" }, { name: "Japón", flag: "🇯🇵" }],
  D: [{ name: "España", flag: "🇪🇸" }, { name: "Venezuela", flag: "🇻🇪" }, { name: "Portugal", flag: "🇵🇹" }, { name: "Argelia", flag: "🇩🇿" }],
  E: [{ name: "Francia", flag: "🇫🇷" }, { name: "Uruguay", flag: "🇺🇾" }, { name: "Australia", flag: "🇦🇺" }, { name: "Arabia Saudí", flag: "🇸🇦" }],
  F: [{ name: "Canadá", flag: "🇨🇦" }, { name: "Perú", flag: "🇵🇪" }, { name: "Bélgica", flag: "🇧🇪" }, { name: "Camerún", flag: "🇨🇲" }],
  G: [{ name: "USA", flag: "🇺🇸" }, { name: "Paraguay", flag: "🇵🇾" }, { name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" }, { name: "Túnez", flag: "🇹🇳" }],
  H: [{ name: "Polonia", flag: "🇵🇱" }, { name: "Bolivia", flag: "🇧🇴" }, { name: "Suecia", flag: "🇸🇪" }, { name: "Ghana", flag: "🇬🇭" }],
  I: [{ name: "Italia", flag: "🇮🇹" }, { name: "Costa Rica", flag: "🇨🇷" }, { name: "Turquía", flag: "🇹🇷" }, { name: "Nigeria", flag: "🇳🇬" }],
  J: [{ name: "Corea del Sur", flag: "🇰🇷" }, { name: "Honduras", flag: "🇭🇳" }, { name: "Suiza", flag: "🇨🇭" }, { name: "Egipto", flag: "🇪🇬" }],
  K: [{ name: "Irán", flag: "🇮🇷" }, { name: "Panamá", flag: "🇵🇦" }, { name: "Dinamarca", flag: "🇩🇰" }, { name: "Guinea", flag: "🇬🇳" }],
  L: [{ name: "Nueva Zelanda", flag: "🇳🇿" }, { name: "El Salvador", flag: "🇸🇻" }, { name: "Serbia", flag: "🇷🇸" }, { name: "Costa de Marfil", flag: "🇨🇮" }],
};

function generateGroupMatches() {
  const matches = [];
  let id = 1;
  Object.entries(GROUPS).forEach(([group, teams]) => {
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        matches.push({
          id: `wc26_g${String(id++).padStart(3, "0")}`,
          grp: group,
          home: teams[i].name,
          away: teams[j].name,
          competition: `Grupo ${group} · Mundial 2026`,
          match_date: "2026-06-11",
          status: "open",
          result_home: null,
          result_away: null,
        });
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

function calcStandings(group, matches) {
  const teams = GROUPS[group].map(t => ({ ...t, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 }));
  const map = {};
  teams.forEach(t => { map[t.name] = t; });
  matches
    .filter(m => m.grp === group && m.result_home !== null && m.result_away !== null)
    .forEach(m => {
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
  return {
    d: Math.floor(time / 86400000),
    h: pad(Math.floor((time % 86400000) / 3600000)),
    m: pad(Math.floor((time % 3600000) / 60000)),
    s: pad(Math.floor((time % 60000) / 1000)),
    started: time === 0,
  };
}

// ============================================================
// TEMA — VERDE NEÓN
// ============================================================
const GREEN = "#00e676";
const GREEN_DIM = "rgba(0,230,118,0.15)";
const DARK = "#0a0a0a";
const CARD = "rgba(255,255,255,0.03)";
const BORDER = "rgba(255,255,255,0.08)";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0a; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: #0a0a0a; }
  ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
`;

const inputSt = {
  width: "100%", padding: "12px 14px", marginBottom: "12px",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
  background: "rgba(0,0,0,0.4)", color: "#f0f0f0", fontSize: "16px",
  fontFamily: "monospace", outline: "none",
};

const smallSt = {
  padding: "8px 4px", border: `1px solid rgba(0,230,118,0.3)`, borderRadius: "6px",
  background: "rgba(0,0,0,0.4)", color: GREEN, fontSize: "20px",
  fontFamily: "'Bebas Neue', monospace", outline: "none", textAlign: "center",
  width: "48px", WebkitAppearance: "none",
};

// ============================================================
// ESTRELLAS
// ============================================================
function Stars() {
  const s = Array.from({ length: 40 }, (_, i) => ({
    i, sz: Math.random() * 2 + 1, t: Math.random() * 100, l: Math.random() * 100,
    o: Math.random() * 0.4 + 0.1, dur: Math.random() * 3 + 2, dl: Math.random() * 3,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {s.map(x => (
        <div key={x.i} style={{
          position: "absolute", width: x.sz + "px", height: x.sz + "px",
          background: "white", borderRadius: "50%",
          top: x.t + "%", left: x.l + "%", opacity: x.o,
          animation: `pulse ${x.dur}s ease-in-out infinite`,
          animationDelay: x.dl + "s",
        }} />
      ))}
    </div>
  );
}

// ============================================================
// LOGIN
// ============================================================
function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(36px,10vw,56px)", letterSpacing: "4px", color: "#f0f0f0", lineHeight: 1 }}>
            PORRA <span style={{ color: GREEN }}>VALLAU</span>
          </div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(20px,6vw,30px)", letterSpacing: "6px", color: "#444", marginTop: "2px" }}>
            MUNDIAL 2026
          </div>
          <div style={{ fontSize: "11px", color: "#333", letterSpacing: "3px", fontFamily: "monospace", marginTop: "6px" }}>
            USA · CANADA · MEXICO
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px" }}>
          <div style={{ display: "flex", marginBottom: "20px", background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "3px" }}>
            {["login", "register"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }} style={{
                flex: 1, padding: "10px", border: "none", borderRadius: "6px", cursor: "pointer",
                fontSize: "12px", letterSpacing: "2px", fontFamily: "monospace", textTransform: "uppercase",
                background: mode === m ? GREEN : "transparent",
                color: mode === m ? "#0a0a0a" : "#555", transition: "all 0.2s", fontWeight: 700,
              }}>{m === "login" ? "Entrar" : "Registro"}</button>
            ))}
          </div>
          {mode === "register" && <input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" style={inputSt} />}
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" style={inputSt} />
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" type="password" style={inputSt} onKeyDown={e => e.key === "Enter" && go()} />
          {error && <p style={{ color: "#ff5252", fontSize: "13px", marginBottom: "12px", fontFamily: "monospace" }}>⚠ {error}</p>}
          <button onClick={go} disabled={loading} style={{
            width: "100%", padding: "14px", border: "none", borderRadius: "8px", cursor: "pointer",
            background: loading ? "#111" : `linear-gradient(135deg, ${GREEN}, #00b0ff)`,
            color: "#0a0a0a", fontWeight: 800, fontSize: "14px", letterSpacing: "3px",
            fontFamily: "monospace", textTransform: "uppercase", transition: "all 0.2s",
          }}>
            {loading ? "..." : mode === "login" ? "⚡ ENTRAR" : "🚀 REGISTRARME"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CUENTA ATRÁS — Banner dentro de la app
// ============================================================
function CountdownBanner() {
  const { d, h, m, s, started } = useCountdown();
  if (started) return (
    <div style={{ background: GREEN_DIM, border: `1px solid rgba(0,230,118,0.3)`, borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", textAlign: "center" }}>
      <span style={{ color: GREEN, fontFamily: "monospace", fontSize: "13px", letterSpacing: "2px" }}>⚽ ¡EL MUNDIAL HA COMENZADO!</span>
    </div>
  );
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: BORDER, borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
      <p style={{ color: "#444", fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", textAlign: "center", marginBottom: "12px" }}>
        ⏱ FALTAN PARA EL INICIO · 11 JUN 2026 · 20:00H
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
        {[{ v: d, l: "DÍAS" }, { v: h, l: "HORAS" }, { v: m, l: "MIN" }, { v: s, l: "SEG" }].map(({ v, l }) => (
          <div key={l} style={{ textAlign: "center", flex: 1, maxWidth: "70px" }}>
            <div style={{ background: "rgba(0,0,0,0.4)", border: `1px solid rgba(0,230,118,0.2)`, borderRadius: "8px", padding: "8px 4px" }}>
              <span style={{ fontFamily: "'Bebas Neue', monospace", fontSize: "clamp(22px,6vw,32px)", color: GREEN, lineHeight: 1, display: "block" }}>{v}</span>
            </div>
            <span style={{ fontSize: "8px", color: "#333", fontFamily: "monospace", letterSpacing: "1px", marginTop: "4px", display: "block" }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// NAVBAR — optimizada para móvil
// ============================================================
function NavBar({ user, view, setView, onLogout }) {
  const tabs = user.role === "admin"
    ? [{ id: "groups", icon: "⚽", label: "Grupos" }, { id: "ranking", icon: "🏆", label: "Ranking" }, { id: "admin", icon: "⚙️", label: "Admin" }]
    : [{ id: "groups", icon: "⚽", label: "Grupos" }, { id: "mypreds", icon: "📋", label: "Pronóst." }, { id: "ranking", icon: "🏆", label: "Ranking" }];

  return (
    <>
      {/* Top bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,10,10,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 14px", display: "flex", alignItems: "center", height: "50px" }}>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", letterSpacing: "2px", color: "#f0f0f0", flex: 1 }}>
            PORRA <span style={{ color: GREEN }}>VALLAU</span>
          </span>
          <span style={{ fontSize: "11px", color: "#444", fontFamily: "monospace", marginRight: "10px" }}>{user.name?.split(" ")[0]}</span>
          <button onClick={onLogout} style={{ padding: "5px 10px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", background: "transparent", color: "#555", cursor: "pointer", fontSize: "11px", fontFamily: "monospace" }}>salir</button>
        </div>
      </div>

      {/* Bottom tab bar — ideal para móvil */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,10,10,0.97)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", display: "flex" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setView(t.id)} style={{
              flex: 1, padding: "12px 4px 10px", border: "none", cursor: "pointer",
              background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
              borderTop: view === t.id ? `2px solid ${GREEN}` : "2px solid transparent",
              transition: "all 0.2s",
            }}>
              <span style={{ fontSize: "20px", lineHeight: 1 }}>{t.icon}</span>
              <span style={{ fontSize: "9px", fontFamily: "monospace", letterSpacing: "1px", color: view === t.id ? GREEN : "#444", textTransform: "uppercase" }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ============================================================
// CLASIFICACIÓN
// ============================================================
function GroupStanding({ group, matches }) {
  const st = calcStandings(group, matches);
  return (
    <div style={{ marginTop: "10px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 32px 32px 32px 40px", gap: "1px", padding: "3px 8px 4px" }}>
        {["EQUIPO", "PJ", "GF", "GC", "PTS"].map(c => (
          <span key={c} style={{ fontSize: "9px", color: "#333", fontFamily: "monospace", letterSpacing: "1px", textAlign: c === "EQUIPO" ? "left" : "center" }}>{c}</span>
        ))}
      </div>
      {st.map((t, i) => (
        <div key={t.name} style={{
          display: "grid", gridTemplateColumns: "1fr 32px 32px 32px 40px",
          gap: "1px", padding: "8px", borderRadius: "7px", marginBottom: "3px",
          background: i < 2 ? GREEN_DIM : CARD,
          border: i < 2 ? `1px solid rgba(0,230,118,0.2)` : `1px solid ${BORDER}`,
          borderLeft: i < 2 ? `3px solid ${GREEN}` : "3px solid transparent",
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden" }}>
            <span style={{ fontSize: "16px" }}>{t.flag}</span>
            <span style={{ fontSize: "12px", color: i < 2 ? "#f0f0f0" : "#666", fontFamily: "monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</span>
          </span>
          {[t.pj, t.gf, t.gc].map((v, vi) => (
            <span key={vi} style={{ fontSize: "12px", color: "#555", fontFamily: "monospace", textAlign: "center" }}>{v}</span>
          ))}
          <span style={{ fontSize: "15px", fontWeight: 700, color: GREEN, fontFamily: "'Bebas Neue', monospace", textAlign: "center" }}>{t.pts}</span>
        </div>
      ))}
      <p style={{ fontSize: "9px", color: "#333", fontFamily: "monospace", margin: "5px 0 0", letterSpacing: "1px" }}>🟢 Los 2 primeros pasan a octavos</p>
    </div>
  );
}

// ============================================================
// FILA DE PARTIDO
// ============================================================
function MatchRow({ match, userPred, user, onSaved }) {
  const ht = getTeam(match.home), at = getTeam(match.away);
  const [ph, setPh] = useState(userPred?.predicted_home ?? "");
  const [pa, setPa] = useState(userPred?.predicted_away ?? "");
  const [status, setStatus] = useState(userPred ? "saved" : "idle");
  const timerRef = useRef(null);
  const isOpen = match.status === "open";
  const hasResult = match.result_home !== null && match.result_away !== null;
  const predPoints = userPred && hasResult ? calcPoints(userPred, match.result_home, match.result_away) : null;

  const save = useCallback(async (newPh, newPa) => {
    if (newPh === "" || newPa === "") return;
    setStatus("saving");
    const { error } = await supabase.from("predictions").upsert({
      user_id: user.id, match_id: match.id,
      predicted_home: parseInt(newPh), predicted_away: parseInt(newPa), points: null,
    }, { onConflict: "user_id,match_id" });
    if (error) { setStatus("error"); return; }
    setStatus("saved");
    onSaved();
  }, [user.id, match.id, onSaved]);

  const handleChange = (field, val) => {
    const newPh = field === "h" ? val : ph;
    const newPa = field === "a" ? val : pa;
    field === "h" ? setPh(val) : setPa(val);
    setStatus("typing");
    if (timerRef.current) clearTimeout(timerRef.current);
    if (newPh !== "" && newPa !== "") {
      timerRef.current = setTimeout(() => save(newPh, newPa), 800);
    }
  };

  const statusColor = status === "saved" ? GREEN : status === "saving" ? "#888" : status === "error" ? "#ff5252" : "#444";
  const statusText = status === "saved" ? "✓" : status === "saving" ? "..." : status === "error" ? "✗" : "";

  return (
    <div style={{ padding: "12px", borderRadius: "10px", marginBottom: "6px", background: CARD, border: `1px solid ${BORDER}` }}>
      {/* Teams row */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
          <span style={{ fontSize: "12px", color: "#aaa", textAlign: "right", fontFamily: "monospace" }}>{match.home}</span>
          <span style={{ fontSize: "22px" }}>{ht.flag}</span>
        </div>
        {hasResult ? (
          <div style={{ minWidth: "64px", textAlign: "center" }}>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: GREEN, lineHeight: 1 }}>{match.result_home}</span>
            <span style={{ color: "#333", fontSize: "16px", margin: "0 3px" }}>-</span>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: GREEN, lineHeight: 1 }}>{match.result_away}</span>
          </div>
        ) : (
          <div style={{ minWidth: "44px", textAlign: "center" }}>
            <span style={{ fontSize: "11px", color: "#333", fontFamily: "monospace", letterSpacing: "2px" }}>VS</span>
          </div>
        )}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "22px" }}>{at.flag}</span>
          <span style={{ fontSize: "12px", color: "#aaa", fontFamily: "monospace" }}>{match.away}</span>
        </div>
      </div>

      {/* Prediction row */}
      {user.role !== "admin" && (
        <div style={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          {isOpen ? (
            <>
              <span style={{ fontSize: "10px", color: "#444", fontFamily: "monospace" }}>tu pronóst.:</span>
              <input value={ph} onChange={e => handleChange("h", e.target.value)} type="number" min="0" max="20" style={smallSt} placeholder="0" />
              <span style={{ color: "#333", fontSize: "16px" }}>-</span>
              <input value={pa} onChange={e => handleChange("a", e.target.value)} type="number" min="0" max="20" style={smallSt} placeholder="0" />
              <span style={{ fontSize: "12px", fontFamily: "monospace", color: statusColor, minWidth: "16px" }}>{statusText}</span>
            </>
          ) : userPred ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "11px", color: "#555", fontFamily: "monospace" }}>
                Pronóst.: <span style={{ color: "#888" }}>{userPred.predicted_home}-{userPred.predicted_away}</span>
              </span>
              {predPoints !== null && (
                <span style={{
                  padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontFamily: "monospace", fontWeight: 700,
                  background: predPoints === 3 ? GREEN_DIM : predPoints === 1 ? "rgba(255,193,7,0.1)" : "rgba(255,82,82,0.08)",
                  color: predPoints === 3 ? GREEN : predPoints === 1 ? "#ffc107" : "#ff5252",
                }}>
                  {predPoints === 3 ? "🎯 +3" : predPoints === 1 ? "✓ +1" : "✗ +0"}
                </span>
              )}
            </div>
          ) : (
            <span style={{ fontSize: "10px", color: "#333", fontFamily: "monospace" }}>partido cerrado · sin pronóstico</span>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// VISTA GRUPOS
// ============================================================
function GroupsView({ user, matches, predictions, onDataChange }) {
  const [g, setG] = useState("A");
  const predMap = {};
  predictions.forEach(p => { predMap[p.match_id] = p; });

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <CountdownBanner />

      <p style={{ fontSize: "10px", color: "#444", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "12px" }}>SELECCIONA GRUPO</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
        {Object.keys(GROUPS).map(gr => (
          <button key={gr} onClick={() => setG(gr)} style={{
            width: "40px", height: "40px",
            border: `1px solid ${g === gr ? GREEN : BORDER}`,
            borderRadius: "8px", cursor: "pointer", fontFamily: "'Bebas Neue', cursive", fontSize: "18px",
            background: g === gr ? GREEN_DIM : CARD,
            color: g === gr ? GREEN : "#555", transition: "all 0.15s",
          }}>{gr}</button>
        ))}
      </div>

      <div style={{ background: CARD, border: `1px solid ${g ? "rgba(0,230,118,0.15)" : BORDER}`, borderRadius: "12px", padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "7px", background: GREEN_DIM, border: `1px solid rgba(0,230,118,0.3)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: GREEN }}>{g}</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#f0f0f0", letterSpacing: "1px" }}>GRUPO {g}</div>
            <div style={{ display: "flex", gap: "5px", marginTop: "2px" }}>
              {GROUPS[g].map(t => <span key={t.name} style={{ fontSize: "16px" }} title={t.name}>{t.flag}</span>)}
            </div>
          </div>
        </div>

        <GroupStanding group={g} matches={matches} />

        <div style={{ marginTop: "18px" }}>
          <p style={{ fontSize: "9px", color: "#444", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "10px" }}>PARTIDOS</p>
          {matches.filter(m => m.grp === g).map(m => (
            <MatchRow key={m.id} match={m} userPred={predMap[m.id]} user={user} onSaved={onDataChange} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MIS PRONÓSTICOS
// ============================================================
function MyPredsView({ predictions, matches }) {
  const total = predictions.reduce((s, p) => s + (p.points || 0), 0);
  const exactos = predictions.filter(p => p.points === 3).length;

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <p style={{ fontSize: "10px", color: "#444", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "16px" }}>MIS PRONÓSTICOS</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "20px" }}>
        {[{ l: "PUNTOS", v: total, c: GREEN }, { l: "EXACTOS", v: exactos, c: GREEN }, { l: "ENVIADOS", v: predictions.length, c: "#555" }].map(s => (
          <div key={s.l} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "14px 8px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "30px", color: s.c, lineHeight: 1 }}>{s.v}</div>
            <div style={{ fontSize: "9px", color: "#444", fontFamily: "monospace", marginTop: "3px", letterSpacing: "1px" }}>{s.l}</div>
          </div>
        ))}
      </div>

      {Object.keys(GROUPS).map(group => {
        const gp = predictions.filter(p => matches.find(m => m.id === p.match_id)?.grp === group);
        if (gp.length === 0) return null;
        return (
          <div key={group} style={{ marginBottom: "16px" }}>
            <p style={{ fontSize: "9px", color: GREEN, fontFamily: "monospace", letterSpacing: "3px", marginBottom: "8px" }}>GRUPO {group}</p>
            {gp.map(pred => {
              const m = matches.find(x => x.id === pred.match_id);
              if (!m) return null;
              const ht = getTeam(m.home), at = getTeam(m.away);
              return (
                <div key={pred.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                  <span style={{ flex: 1, fontSize: "12px", color: "#888", fontFamily: "monospace", minWidth: "130px" }}>{ht.flag} {m.home} vs {at.flag} {m.away}</span>
                  <span style={{ fontSize: "13px", color: "#aaa", fontFamily: "monospace" }}>{pred.predicted_home}-{pred.predicted_away}</span>
                  {m.result_home !== null && <span style={{ fontSize: "13px", color: GREEN, fontFamily: "monospace" }}>{m.result_home}-{m.result_away}</span>}
                  {pred.points !== null && pred.points !== undefined && (
                    <span style={{
                      padding: "2px 9px", borderRadius: "10px", fontSize: "11px", fontFamily: "monospace", fontWeight: 700,
                      background: pred.points === 3 ? GREEN_DIM : pred.points === 1 ? "rgba(255,193,7,0.1)" : "rgba(255,82,82,0.08)",
                      color: pred.points === 3 ? GREEN : pred.points === 1 ? "#ffc107" : "#ff5252",
                    }}>
                      {pred.points === 3 ? "🎯 +3" : pred.points === 1 ? "✓ +1" : "✗ +0"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
      {predictions.length === 0 && <p style={{ color: "#333", fontFamily: "monospace", fontSize: "13px" }}>Aún no has enviado pronósticos. ¡Ve a Grupos!</p>}
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
      const { data: preds } = await supabase.from("predictions").select("*").not("points", "is", null);
      const r = (profiles || []).map(p => ({
        ...p,
        total: (preds || []).filter(x => x.user_id === p.id).reduce((s, x) => s + (x.points || 0), 0),
        exactos: (preds || []).filter(x => x.user_id === p.id && x.points === 3).length,
        count: (preds || []).filter(x => x.user_id === p.id).length,
      })).sort((a, b) => b.total - a.total);
      setRanking(r); setLoading(false);
    })();
  }, []);

  const medals = ["🥇", "🥈", "🥉"];
  if (loading) return <p style={{ color: "#444", fontFamily: "monospace" }}>Cargando...</p>;

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <p style={{ fontSize: "10px", color: "#444", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "16px" }}>RANKING GENERAL</p>
      {ranking.length === 0 && <p style={{ color: "#333", fontFamily: "monospace" }}>Aún no hay puntuaciones</p>}
      {ranking.map((u, i) => (
        <div key={u.id} style={{
          display: "flex", alignItems: "center", gap: "12px",
          background: i === 0 ? GREEN_DIM : CARD,
          border: i === 0 ? `1px solid rgba(0,230,118,0.25)` : `1px solid ${BORDER}`,
          borderRadius: "10px", padding: "14px 16px", marginBottom: "6px",
        }}>
          <span style={{ fontSize: "22px", minWidth: "28px" }}>{medals[i] || `#${i + 1}`}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "monospace", fontSize: "15px", color: "#f0f0f0" }}>{u.name}</div>
            <div style={{ fontSize: "10px", color: "#444", fontFamily: "monospace", marginTop: "2px" }}>{u.exactos} exactos · {u.count} evaluados</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "32px", color: i === 0 ? GREEN : "#f0f0f0", lineHeight: 1 }}>{u.total}</div>
            <div style={{ fontSize: "9px", color: "#444", fontFamily: "monospace" }}>PTS</div>
          </div>
        </div>
      ))}
      <div style={{ marginTop: "16px", padding: "12px 14px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: "8px" }}>
        <p style={{ color: "#333", fontFamily: "monospace", fontSize: "10px", lineHeight: 2, letterSpacing: "1px" }}>
          <span style={{ color: GREEN }}>+3</span> exacto &nbsp;|&nbsp; <span style={{ color: "#ffc107" }}>+1</span> signo &nbsp;|&nbsp; <span style={{ color: "#ff5252" }}>+0</span> fallo
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

  const handleResult = async () => {
    if (hr === "" || ar === "") return;
    const rh = parseInt(hr), ra = parseInt(ar);
    await supabase.from("matches").update({ result_home: rh, result_away: ra, status: "closed" }).eq("id", sel);
    const { data: preds } = await supabase.from("predictions").select("*").eq("match_id", sel);
    for (const pred of (preds || [])) {
      await supabase.from("predictions").update({ points: calcPoints(pred, rh, ra) }).eq("id", pred.id);
    }
    setSaved(true); setSel(null); setHr(""); setAr("");
    onDataChange();
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleStatus = async m => {
    await supabase.from("matches").update({ status: m.status === "open" ? "closed" : "open" }).eq("id", m.id);
    onDataChange();
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <p style={{ fontSize: "10px", color: "#444", fontFamily: "monospace", letterSpacing: "3px", marginBottom: "16px" }}>PANEL DE ADMINISTRACIÓN</p>
      {saved && <div style={{ padding: "10px 14px", background: GREEN_DIM, border: `1px solid rgba(0,230,118,0.3)`, borderRadius: "8px", color: GREEN, fontFamily: "monospace", fontSize: "12px", marginBottom: "14px" }}>✓ Resultado guardado y puntos calculados</div>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
        {Object.keys(GROUPS).map(gr => (
          <button key={gr} onClick={() => setG(gr)} style={{
            width: "38px", height: "38px",
            border: `1px solid ${g === gr ? GREEN : BORDER}`,
            borderRadius: "7px", cursor: "pointer", fontFamily: "'Bebas Neue', cursive", fontSize: "17px",
            background: g === gr ? GREEN_DIM : CARD,
            color: g === gr ? GREEN : "#555",
          }}>{gr}</button>
        ))}
      </div>

      <p style={{ fontSize: "9px", color: GREEN, fontFamily: "monospace", letterSpacing: "3px", marginBottom: "10px" }}>GRUPO {g}</p>

      {matches.filter(m => m.grp === g).map(m => {
        const ht = getTeam(m.home), at = getTeam(m.away);
        return (
          <div key={m.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "10px", padding: "12px", marginBottom: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ flex: 1, fontSize: "13px", color: "#888", fontFamily: "monospace", minWidth: "150px" }}>
                {ht.flag} {m.home} vs {at.flag} {m.away}
              </span>
              <span style={{ fontSize: "9px", fontFamily: "monospace", padding: "2px 7px", borderRadius: "8px", background: m.status === "open" ? "rgba(0,200,100,0.08)" : "rgba(255,100,50,0.08)", color: m.status === "open" ? "#00c864" : "#ff6432" }}>
                {m.status === "open" ? "ABIERTO" : "CERRADO"}
              </span>
              {m.result_home !== null && (
                <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: GREEN }}>{m.result_home}-{m.result_away}</span>
              )}
              <button onClick={() => toggleStatus(m)} style={{ padding: "4px 10px", border: `1px solid ${BORDER}`, borderRadius: "5px", background: "transparent", color: "#555", cursor: "pointer", fontSize: "10px", fontFamily: "monospace" }}>
                {m.status === "open" ? "Cerrar" : "Reabrir"}
              </button>
              {sel === m.id ? (
                <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                  <input value={hr} onChange={e => setHr(e.target.value)} type="number" min="0" style={{ ...smallSt, width: "44px" }} placeholder="0" />
                  <span style={{ color: "#333" }}>-</span>
                  <input value={ar} onChange={e => setAr(e.target.value)} type="number" min="0" style={{ ...smallSt, width: "44px" }} placeholder="0" />
                  <button onClick={handleResult} style={{ padding: "6px 14px", border: "none", borderRadius: "6px", background: GREEN, color: "#0a0a0a", cursor: "pointer", fontSize: "11px", fontFamily: "monospace", fontWeight: 700 }}>OK</button>
                  <button onClick={() => setSel(null)} style={{ padding: "6px 10px", border: `1px solid ${BORDER}`, borderRadius: "6px", background: "transparent", color: "#555", cursor: "pointer", fontSize: "11px", fontFamily: "monospace" }}>✕</button>
                </div>
              ) : (
                <button onClick={() => { setSel(m.id); setHr(""); setAr(""); }} style={{ padding: "5px 12px", border: `1px solid rgba(0,230,118,0.25)`, borderRadius: "5px", background: GREEN_DIM, color: GREEN, cursor: "pointer", fontSize: "10px", fontFamily: "monospace" }}>
                  Resultado
                </button>
              )}
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
    const { data: dbMatches } = await supabase.from("matches").select("*").order("grp");
    if (dbMatches && dbMatches.length > 0) {
      setMatches(dbMatches);
    } else {
      const chunks = [];
      for (let i = 0; i < ALL_MATCHES.length; i += 10) chunks.push(ALL_MATCHES.slice(i, i + 10));
      let all = [];
      for (const chunk of chunks) {
        const { data } = await supabase.from("matches").insert(chunk).select();
        if (data) all = [...all, ...data];
      }
      setMatches(all.length > 0 ? all : ALL_MATCHES);
    }
    if (user) {
      const { data: p } = await supabase.from("predictions").select("*").eq("user_id", user.id);
      setPredictions(p || []);
    }
  };

  const handleLogin = u => { setUser(u); setScreen("app"); };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setScreen("login");
  };

  if (loadingSession) return (
    <div style={{ minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "44px", marginBottom: "10px" }}>⚽</div>
        <span style={{ color: GREEN, fontFamily: "monospace", letterSpacing: "4px", fontSize: "11px" }}>CARGANDO...</span>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: DARK, color: "#f0f0f0" }}>
      <style>{css}</style>
      <Stars />

      {screen === "login" && <LoginPage onLogin={handleLogin} />}

      {screen === "app" && user && (
        <>
          <NavBar user={user} view={view} setView={setView} onLogout={handleLogout} />
          {/* padding-top para topbar, padding-bottom para bottombar */}
          <div style={{ maxWidth: "700px", margin: "0 auto", padding: "62px 14px 80px", position: "relative", zIndex: 1 }}>
            {view === "groups" && <GroupsView user={user} matches={matches} predictions={predictions} onDataChange={loadData} />}
            {view === "mypreds" && <MyPredsView predictions={predictions} matches={matches} />}
            {view === "ranking" && <RankingView />}
            {view === "admin" && user.role === "admin" && <AdminView matches={matches} onDataChange={loadData} />}
          </div>
        </>
      )}
    </div>
  );
}