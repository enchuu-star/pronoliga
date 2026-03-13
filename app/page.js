"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ============================================================
// UTILIDADES
// ============================================================
function calcPoints(pred, result) {
  if (pred.predicted_home === result.result_home && pred.predicted_away === result.result_away) return 3;
  const predSign = pred.predicted_home > pred.predicted_away ? "H" : pred.predicted_home < pred.predicted_away ? "A" : "D";
  const resSign = result.result_home > result.result_away ? "H" : result.result_home < result.result_away ? "A" : "D";
  if (predSign === resSign) return 1;
  return 0;
}

// ============================================================
// COMPONENTES VISUALES
// ============================================================
function StarField() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    top: Math.random() * 100,
    left: Math.random() * 100,
    opacity: Math.random() * 0.5 + 0.1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 3,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: "absolute", width: s.size + "px", height: s.size + "px",
          background: "white", borderRadius: "50%", top: s.top + "%", left: s.left + "%",
          opacity: s.opacity, animation: `twinkle ${s.duration}s ease-in-out infinite`,
          animationDelay: s.delay + "s",
        }} />
      ))}
    </div>
  );
}

// ============================================================
// LOGIN / REGISTRO
// ============================================================
function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", position: "relative", zIndex: 1 }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "52px", marginBottom: "8px" }}>⚽</div>
          <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "42px", letterSpacing: "4px", color: "#f0f0f0", margin: 0, lineHeight: 1 }}>
            PRONO<span style={{ color: "#00e676" }}>LIGA</span>
          </h1>
          <p style={{ color: "#666", fontSize: "13px", letterSpacing: "2px", marginTop: "6px", fontFamily: "monospace" }}>
            QUINIELA · RANKING · GLORIA
          </p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "32px", backdropFilter: "blur(12px)" }}>
          <div style={{ display: "flex", marginBottom: "28px", background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "3px" }}>
            {["login", "register"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }} style={{
                flex: 1, padding: "8px", border: "none", borderRadius: "6px", cursor: "pointer",
                fontSize: "13px", fontWeight: 600, letterSpacing: "1px", fontFamily: "monospace",
                background: mode === m ? "#00e676" : "transparent",
                color: mode === m ? "#0a0a0a" : "#888", transition: "all 0.2s",
              }}>
                {m === "login" ? "ENTRAR" : "REGISTRO"}
              </button>
            ))}
          </div>

          {mode === "register" && (
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" style={inputStyle} />
          )}
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" style={inputStyle} />
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" type="password" style={inputStyle}
            onKeyDown={e => e.key === "Enter" && handleSubmit()} />

          {error && <p style={{ color: "#ff5252", fontSize: "13px", marginBottom: "16px", fontFamily: "monospace" }}>⚠ {error}</p>}

          <button onClick={handleSubmit} disabled={loading} style={{
            width: "100%", padding: "14px", border: "none", borderRadius: "8px", cursor: "pointer",
            background: loading ? "#333" : "linear-gradient(135deg, #00e676, #00b0ff)",
            color: "#0a0a0a", fontWeight: 800, fontSize: "14px", letterSpacing: "2px",
            fontFamily: "monospace", transition: "all 0.2s",
          }}>
            {loading ? "..." : mode === "login" ? "⚡ ENTRAR" : "🚀 REGISTRARME"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "12px 14px", marginBottom: "14px",
  border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px",
  background: "rgba(0,0,0,0.3)", color: "#f0f0f0", fontSize: "14px",
  fontFamily: "monospace", outline: "none", boxSizing: "border-box",
};

const smallInput = {
  padding: "6px 8px", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px",
  background: "rgba(0,0,0,0.3)", color: "#f0f0f0", fontSize: "16px",
  fontFamily: "'Bebas Neue', cursive", outline: "none", textAlign: "center",
};

// ============================================================
// NAVBAR
// ============================================================
function NavBar({ user, view, setView, onLogout }) {
  const tabs = user.role === "admin"
    ? [{ id: "matches", label: "Partidos", icon: "⚽" }, { id: "ranking", label: "Ranking", icon: "🏆" }, { id: "admin", label: "Admin", icon: "⚙️" }]
    : [{ id: "matches", label: "Partidos", icon: "⚽" }, { id: "mypreds", label: "Mis pronóst.", icon: "📋" }, { id: "ranking", label: "Ranking", icon: "🏆" }];

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,10,10,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", height: "56px", gap: "8px" }}>
        <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", letterSpacing: "2px", color: "#f0f0f0", marginRight: "auto" }}>
          PRONO<span style={{ color: "#00e676" }}>LIGA</span>
        </span>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setView(t.id)} style={{
            padding: "6px 14px", border: "none", borderRadius: "20px", cursor: "pointer",
            fontSize: "12px", fontWeight: 600,
            background: view === t.id ? "rgba(0,230,118,0.15)" : "transparent",
            color: view === t.id ? "#00e676" : "#888",
            borderBottom: view === t.id ? "2px solid #00e676" : "2px solid transparent",
            transition: "all 0.2s", fontFamily: "monospace",
          }}>
            {t.icon} {t.label}
          </button>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "8px" }}>
          <span style={{ fontSize: "12px", color: "#666", fontFamily: "monospace" }}>{user.name?.split(" ")[0]}</span>
          <button onClick={onLogout} style={{ padding: "5px 10px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", background: "transparent", color: "#888", cursor: "pointer", fontSize: "11px", fontFamily: "monospace" }}>salir</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TARJETA DE PARTIDO
// ============================================================
function MatchCard({ match, userPred, user, onPredictSaved }) {
  const [home, setHome] = useState(userPred?.predicted_home ?? "");
  const [away, setAway] = useState(userPred?.predicted_away ?? "");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const isOpen = match.status === "open";
  const hasResult = match.result_home !== null && match.result_away !== null;

  const handleSave = async () => {
    if (home === "" || away === "") return;
    setSaving(true);
    const payload = {
      user_id: user.id,
      match_id: match.id,
      predicted_home: parseInt(home),
      predicted_away: parseInt(away),
      points: null,
    };
    await supabase.from("predictions").upsert(payload, { onConflict: "user_id,match_id" });
    setSaving(false);
    setSaved(true);
    onPredictSaved();
    setTimeout(() => setSaved(false), 2000);
  };

  const predPoints = userPred && hasResult
    ? calcPoints(userPred, match)
    : null;

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "12px", padding: "20px", marginBottom: "12px",
      borderLeft: isOpen ? "3px solid #00e676" : "3px solid #ff6b35",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <span style={{ fontSize: "10px", color: "#555", fontFamily: "monospace", letterSpacing: "1px" }}>
          {match.competition} · {match.match_date}
        </span>
        <span style={{
          fontSize: "10px", padding: "2px 8px", borderRadius: "10px", fontFamily: "monospace", letterSpacing: "1px",
          background: isOpen ? "rgba(0,230,118,0.1)" : "rgba(255,107,53,0.1)",
          color: isOpen ? "#00e676" : "#ff6b35",
        }}>{isOpen ? "ABIERTO" : "CERRADO"}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <span style={{ flex: 1, textAlign: "right", fontFamily: "'Bebas Neue', cursive", fontSize: "20px", letterSpacing: "1px", color: "#f0f0f0" }}>{match.home}</span>
        {hasResult ? (
          <div style={{ textAlign: "center", minWidth: "60px" }}>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: "#00e676" }}>{match.result_home}</span>
            <span style={{ color: "#444", margin: "0 4px" }}>-</span>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: "#00e676" }}>{match.result_away}</span>
          </div>
        ) : (
          <div style={{ textAlign: "center", minWidth: "50px" }}>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: "#444" }}>VS</span>
          </div>
        )}
        <span style={{ flex: 1, textAlign: "left", fontFamily: "'Bebas Neue', cursive", fontSize: "20px", letterSpacing: "1px", color: "#f0f0f0" }}>{match.away}</span>
      </div>

      {user.role !== "admin" && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "14px" }}>
          {isOpen ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "11px", color: "#666", fontFamily: "monospace", minWidth: "80px" }}>Tu pronóst.:</span>
              <input value={home} onChange={e => setHome(e.target.value)} type="number" min="0" max="20" style={{ ...smallInput, width: "48px" }} placeholder="0" />
              <span style={{ color: "#555" }}>-</span>
              <input value={away} onChange={e => setAway(e.target.value)} type="number" min="0" max="20" style={{ ...smallInput, width: "48px" }} placeholder="0" />
              <button onClick={handleSave} disabled={saving} style={{
                padding: "6px 16px", border: "none", borderRadius: "6px", cursor: "pointer",
                fontSize: "11px", fontFamily: "monospace", fontWeight: 700,
                background: saved ? "#00e676" : "rgba(0,230,118,0.15)",
                color: saved ? "#0a0a0a" : "#00e676", transition: "all 0.2s", letterSpacing: "1px",
              }}>
                {saving ? "..." : saved ? "✓ GUARDADO" : userPred ? "ACTUALIZAR" : "GUARDAR"}
              </button>
            </div>
          ) : userPred ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "11px", color: "#666", fontFamily: "monospace" }}>Tu pronóst.:</span>
              <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: "#aaa" }}>
                {userPred.predicted_home} - {userPred.predicted_away}
              </span>
              {predPoints !== null && (
                <span style={{
                  marginLeft: "auto", padding: "4px 12px", borderRadius: "20px",
                  fontFamily: "monospace", fontSize: "13px", fontWeight: 700,
                  background: predPoints === 3 ? "rgba(0,230,118,0.15)" : predPoints === 1 ? "rgba(255,193,7,0.15)" : "rgba(255,82,82,0.15)",
                  color: predPoints === 3 ? "#00e676" : predPoints === 1 ? "#ffc107" : "#ff5252",
                }}>
                  {predPoints === 3 ? "🎯 +3" : predPoints === 1 ? "✓ +1" : "✗ +0"}
                </span>
              )}
            </div>
          ) : (
            <p style={{ fontSize: "11px", color: "#444", fontFamily: "monospace", margin: 0 }}>No enviaste pronóstico para este partido</p>
          )}
        </div>
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
    const load = async () => {
      const { data: profiles } = await supabase.from("profiles").select("*").eq("role", "user");
      const { data: predictions } = await supabase.from("predictions").select("*").not("points", "is", null);

      const result = (profiles || []).map(p => ({
        ...p,
        total: (predictions || []).filter(pr => pr.user_id === p.id).reduce((s, pr) => s + (pr.points || 0), 0),
        count: (predictions || []).filter(pr => pr.user_id === p.id).length,
      })).sort((a, b) => b.total - a.total);

      setRanking(result);
      setLoading(false);
    };
    load();
  }, []);

  const medals = ["🥇", "🥈", "🥉"];

  if (loading) return <p style={{ color: "#555", fontFamily: "monospace" }}>Cargando ranking...</p>;

  return (
    <div>
      <h2 style={sectionTitle}>🏆 Ranking General</h2>
      {ranking.length === 0 && <p style={{ color: "#444", fontFamily: "monospace" }}>Aún no hay puntuaciones</p>}
      {ranking.map((u, i) => (
        <div key={u.id} style={{
          display: "flex", alignItems: "center", gap: "16px",
          background: i === 0 ? "rgba(255,193,7,0.06)" : "rgba(255,255,255,0.02)",
          border: i === 0 ? "1px solid rgba(255,193,7,0.2)" : "1px solid rgba(255,255,255,0.06)",
          borderRadius: "10px", padding: "16px 20px", marginBottom: "8px",
        }}>
          <span style={{ fontSize: "22px", minWidth: "30px" }}>{medals[i] || `#${i + 1}`}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#f0f0f0", letterSpacing: "1px" }}>{u.name}</div>
            <div style={{ fontSize: "11px", color: "#555", fontFamily: "monospace" }}>{u.count} pronósticos evaluados</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "32px", color: i === 0 ? "#ffc107" : "#00e676", lineHeight: 1 }}>{u.total}</div>
            <div style={{ fontSize: "10px", color: "#555", fontFamily: "monospace" }}>PUNTOS</div>
          </div>
        </div>
      ))}
      <div style={{ marginTop: "24px", padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ color: "#555", fontFamily: "monospace", fontSize: "11px", margin: 0, lineHeight: 1.8 }}>
          <span style={{ color: "#00e676" }}>+3 pts</span> Resultado exacto &nbsp;|&nbsp;
          <span style={{ color: "#ffc107" }}>+1 pt</span> Signo correcto (1X2) &nbsp;|&nbsp;
          <span style={{ color: "#ff5252" }}>+0 pts</span> Fallo
        </p>
      </div>
    </div>
  );
}

// ============================================================
// PANEL ADMIN
// ============================================================
function AdminView() {
  const [matches, setMatches] = useState([]);
  const [selected, setSelected] = useState(null);
  const [homeR, setHomeR] = useState("");
  const [awayR, setAwayR] = useState("");
  const [saved, setSaved] = useState(false);
  const [newMatch, setNewMatch] = useState({ home: "", away: "", competition: "", match_date: "" });
  const [adding, setAdding] = useState(false);

  const loadMatches = async () => {
    const { data } = await supabase.from("matches").select("*").order("match_date", { ascending: false });
    setMatches(data || []);
  };

  useEffect(() => { loadMatches(); }, []);

  const handleSetResult = async () => {
    if (homeR === "" || awayR === "") return;
    const rh = parseInt(homeR), ra = parseInt(awayR);
    await supabase.from("matches").update({ result_home: rh, result_away: ra, status: "closed" }).eq("id", selected);

    // Calcular y guardar puntos de cada pronóstico
    const { data: preds } = await supabase.from("predictions").select("*").eq("match_id", selected);
    for (const pred of (preds || [])) {
      const pts = calcPoints(pred, { result_home: rh, result_away: ra });
      await supabase.from("predictions").update({ points: pts }).eq("id", pred.id);
    }

    setSaved(true);
    setSelected(null);
    setHomeR(""); setAwayR("");
    loadMatches();
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAddMatch = async () => {
    if (!newMatch.home || !newMatch.away || !newMatch.match_date) return;
    setAdding(true);
    await supabase.from("matches").insert({ ...newMatch, status: "open" });
    setNewMatch({ home: "", away: "", competition: "", match_date: "" });
    setAdding(false);
    loadMatches();
  };

  const handleToggleStatus = async (match) => {
    const newStatus = match.status === "open" ? "closed" : "open";
    await supabase.from("matches").update({ status: newStatus }).eq("id", match.id);
    loadMatches();
  };

  const openMatches = matches.filter(m => m.status === "open");
  const closedMatches = matches.filter(m => m.status === "closed");

  return (
    <div>
      <h2 style={sectionTitle}>⚙️ Panel de Administración</h2>

      {saved && (
        <div style={{ padding: "12px 16px", background: "rgba(0,230,118,0.1)", border: "1px solid #00e676", borderRadius: "8px", color: "#00e676", fontFamily: "monospace", fontSize: "13px", marginBottom: "16px" }}>
          ✓ Resultado guardado y puntos calculados automáticamente
        </div>
      )}

      {/* Añadir partido */}
      <h3 style={subTitle}>AÑADIR PARTIDO</h3>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "16px", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input value={newMatch.home} onChange={e => setNewMatch({ ...newMatch, home: e.target.value })} placeholder="Equipo local" style={{ ...inputStyle, flex: 1, minWidth: "140px", marginBottom: 0 }} />
          <input value={newMatch.away} onChange={e => setNewMatch({ ...newMatch, away: e.target.value })} placeholder="Equipo visitante" style={{ ...inputStyle, flex: 1, minWidth: "140px", marginBottom: 0 }} />
          <input value={newMatch.competition} onChange={e => setNewMatch({ ...newMatch, competition: e.target.value })} placeholder="Competición" style={{ ...inputStyle, flex: 1, minWidth: "120px", marginBottom: 0 }} />
          <input value={newMatch.match_date} onChange={e => setNewMatch({ ...newMatch, match_date: e.target.value })} type="date" style={{ ...inputStyle, flex: 1, minWidth: "140px", marginBottom: 0 }} />
          <button onClick={handleAddMatch} disabled={adding} style={{
            padding: "12px 20px", border: "none", borderRadius: "8px", background: "#00e676",
            color: "#0a0a0a", cursor: "pointer", fontWeight: 800, fontFamily: "monospace", fontSize: "13px",
          }}>
            {adding ? "..." : "+ AÑADIR"}
          </button>
        </div>
      </div>

      {/* Partidos abiertos */}
      <h3 style={subTitle}>INTRODUCIR RESULTADOS</h3>
      {openMatches.length === 0 && <p style={{ color: "#444", fontFamily: "monospace" }}>No hay partidos abiertos</p>}
      {openMatches.map(m => (
        <div key={m.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "16px", marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#f0f0f0", flex: 1, minWidth: "200px" }}>{m.home} vs {m.away}</span>
            <span style={{ fontSize: "11px", color: "#555", fontFamily: "monospace" }}>{m.match_date}</span>
            <button onClick={() => handleToggleStatus(m)} style={{ padding: "5px 12px", border: "1px solid rgba(255,107,53,0.3)", borderRadius: "6px", background: "rgba(255,107,53,0.05)", color: "#ff6b35", cursor: "pointer", fontSize: "11px", fontFamily: "monospace" }}>
              Cerrar partido
            </button>
            {selected === m.id ? (
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input value={homeR} onChange={e => setHomeR(e.target.value)} type="number" min="0" style={{ ...smallInput, width: "48px" }} placeholder="0" />
                <span style={{ color: "#555" }}>-</span>
                <input value={awayR} onChange={e => setAwayR(e.target.value)} type="number" min="0" style={{ ...smallInput, width: "48px" }} placeholder="0" />
                <button onClick={handleSetResult} style={{ padding: "6px 14px", border: "none", borderRadius: "6px", background: "#00e676", color: "#0a0a0a", cursor: "pointer", fontSize: "11px", fontFamily: "monospace", fontWeight: 700 }}>CONFIRMAR</button>
                <button onClick={() => setSelected(null)} style={{ padding: "6px 10px", border: "1px solid #444", borderRadius: "6px", background: "transparent", color: "#888", cursor: "pointer", fontSize: "11px", fontFamily: "monospace" }}>✕</button>
              </div>
            ) : (
              <button onClick={() => { setSelected(m.id); setHomeR(""); setAwayR(""); }} style={{ padding: "6px 16px", border: "1px solid rgba(0,230,118,0.3)", borderRadius: "6px", background: "rgba(0,230,118,0.05)", color: "#00e676", cursor: "pointer", fontSize: "11px", fontFamily: "monospace" }}>
                Resultado
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Partidos cerrados */}
      <h3 style={{ ...subTitle, marginTop: "28px" }}>CERRADOS</h3>
      {closedMatches.map(m => (
        <div key={m.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", padding: "14px 16px", marginBottom: "6px", display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", color: "#888", flex: 1 }}>{m.home} vs {m.away}</span>
          {m.result_home !== null && (
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: "#00e676" }}>{m.result_home} - {m.result_away}</span>
          )}
          <button onClick={() => handleToggleStatus(m)} style={{ padding: "4px 10px", border: "1px solid rgba(0,230,118,0.2)", borderRadius: "6px", background: "transparent", color: "#00e676", cursor: "pointer", fontSize: "10px", fontFamily: "monospace" }}>
            Reabrir
          </button>
        </div>
      ))}
    </div>
  );
}

const sectionTitle = { fontFamily: "'Bebas Neue', cursive", fontSize: "26px", letterSpacing: "3px", color: "#f0f0f0", marginBottom: "20px" };
const subTitle = { color: "#888", fontFamily: "monospace", fontSize: "12px", letterSpacing: "2px", marginBottom: "12px" };

// ============================================================
// APP PRINCIPAL
// ============================================================
export default function Home() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("matches");
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loadingSession, setLoadingSession] = useState(true);

  // Recuperar sesión al cargar
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        setUser({ ...session.user, name: profile?.name || session.user.email, role: profile?.role || "user" });
      }
      setLoadingSession(false);
    });
  }, []);

  // Cargar partidos y pronósticos cuando hay usuario
  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    const { data: m } = await supabase.from("matches").select("*").order("match_date", { ascending: false });
    setMatches(m || []);
    if (user) {
      const { data: p } = await supabase.from("predictions").select("*").eq("user_id", user.id);
      setPredictions(p || []);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setView("matches");
  };

  if (loadingSession) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#555", fontFamily: "monospace" }}>Cargando...</span>
      </div>
    );
  }

  const predMap = {};
  predictions.forEach(p => { predMap[p.match_id] = p; });

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f0f0f0", fontFamily: "system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @keyframes twinkle { 0%,100% { opacity: 0.1; } 50% { opacity: 0.6; } }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
      `}</style>

      <StarField />

      {!user ? (
        <LoginPage onLogin={setUser} />
      ) : (
        <>
          <NavBar user={user} view={view} setView={setView} onLogout={handleLogout} />
          <div style={{ maxWidth: "700px", margin: "0 auto", padding: "76px 16px 40px", position: "relative", zIndex: 1 }}>

            {view === "matches" && (
              <div>
                <h2 style={sectionTitle}>⚽ Partidos</h2>
                {matches.filter(m => m.status === "open").length > 0 && (
                  <>
                    <p style={{ color: "#555", fontFamily: "monospace", fontSize: "11px", letterSpacing: "1px", marginBottom: "12px" }}>ABIERTOS</p>
                    {matches.filter(m => m.status === "open").map(m => (
                      <MatchCard key={m.id} match={m} userPred={predMap[m.id]} user={user} onPredictSaved={loadData} />
                    ))}
                  </>
                )}
                {matches.filter(m => m.status === "closed").length > 0 && (
                  <>
                    <p style={{ color: "#555", fontFamily: "monospace", fontSize: "11px", letterSpacing: "1px", margin: "20px 0 12px" }}>CERRADOS</p>
                    {matches.filter(m => m.status === "closed").map(m => (
                      <MatchCard key={m.id} match={m} userPred={predMap[m.id]} user={user} onPredictSaved={loadData} />
                    ))}
                  </>
                )}
                {matches.length === 0 && (
                  <p style={{ color: "#444", fontFamily: "monospace" }}>No hay partidos todavía. El administrador los añadirá pronto.</p>
                )}
              </div>
            )}

            {view === "mypreds" && (
              <div>
                <h2 style={sectionTitle}>📋 Mis Pronósticos</h2>
                {predictions.length === 0
                  ? <p style={{ color: "#444", fontFamily: "monospace" }}>Aún no has enviado ningún pronóstico</p>
                  : predictions.map(pred => {
                      const match = matches.find(m => m.id === pred.match_id);
                      if (!match) return null;
                      return (
                        <div key={pred.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "16px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                          <div style={{ flex: 1, minWidth: "150px" }}>
                            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "16px", color: "#f0f0f0" }}>{match.home} vs {match.away}</div>
                            <div style={{ fontSize: "11px", color: "#555", fontFamily: "monospace" }}>{match.competition} · {match.match_date}</div>
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "24px", color: "#aaa" }}>{pred.predicted_home} - {pred.predicted_away}</div>
                            <div style={{ fontSize: "10px", color: "#555", fontFamily: "monospace" }}>MI PRONÓST.</div>
                          </div>
                          {match.result_home !== null && (
                            <div style={{ textAlign: "center" }}>
                              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "24px", color: "#00e676" }}>{match.result_home} - {match.result_away}</div>
                              <div style={{ fontSize: "10px", color: "#555", fontFamily: "monospace" }}>RESULTADO</div>
                            </div>
                          )}
                          {pred.points !== null && pred.points !== undefined && (
                            <span style={{
                              padding: "6px 14px", borderRadius: "20px", fontFamily: "monospace", fontSize: "14px", fontWeight: 700,
                              background: pred.points === 3 ? "rgba(0,230,118,0.15)" : pred.points === 1 ? "rgba(255,193,7,0.15)" : "rgba(255,82,82,0.15)",
                              color: pred.points === 3 ? "#00e676" : pred.points === 1 ? "#ffc107" : "#ff5252",
                            }}>
                              {pred.points === 3 ? "🎯 +3" : pred.points === 1 ? "✓ +1" : "✗ +0"}
                            </span>
                          )}
                        </div>
                      );
                    })
                }
                <div style={{ marginTop: "20px", padding: "16px 20px", background: "rgba(0,230,118,0.05)", border: "1px solid rgba(0,230,118,0.15)", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "monospace", color: "#888" }}>Total acumulado:</span>
                  <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "32px", color: "#00e676" }}>
                    {predictions.reduce((s, p) => s + (p.points || 0), 0)} PTS
                  </span>
                </div>
              </div>
            )}

            {view === "ranking" && <RankingView />}
            {view === "admin" && user.role === "admin" && <AdminView />}
          </div>
        </>
      )}
    </div>
  );
}
