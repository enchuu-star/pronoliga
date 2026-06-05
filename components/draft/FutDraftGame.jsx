"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FORMATION_433, drawCandidates, scoreSquad } from "./engine";

/*
  FutDraftGame — Modo Mundial Draft para tu app (Next.js + Supabase).

  Props:
    supabase  -> tu cliente de Supabase (opcional: si no se pasa, usa un ranking local)
    userId    -> id del usuario logueado (auth.uid())
    username  -> nombre a mostrar en el ranking

  Requisitos:
    - Copia players.json a /public/players.json
    - Crea la tabla con supabase_schema.sql
*/

const C = {
  bg: "#0a0e14", panel: "#10161f", line: "#1d2733",
  gold: "#f5c451", goldDim: "#b8923a", text: "#e8edf2", dim: "#7d8a99",
  greenLine: "#2e9e66", red: "#d4574e",
};
const chemColor = (c) => (c >= 3 ? C.gold : c === 2 ? C.greenLine : c === 1 ? "#9aa7b4" : C.red);

function Initials({ name, size }) {
  const t = name.replace(/[^A-Za-zÀ-ÿ. ]/g, "").split(/[. ]/).filter(Boolean).slice(-1)[0] || name;
  return (
    <div style={{ width: size, height: size, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: "#1a2330", color: C.dim, fontFamily: "Anton, sans-serif", fontSize: size * 0.42 }}>
      {t.slice(0, 2).toUpperCase()}
    </div>
  );
}
function Face({ p, size }) {
  const [err, setErr] = useState(false);
  if (!p.photo || err) return <Initials name={p.name} size={size} />;
  return <img src={p.photo} width={size} height={size} onError={() => setErr(true)} alt="" style={{ borderRadius: 6, objectFit: "cover", background: "#1a2330" }} />;
}

function CandidateCard({ p, onPick, i }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onPick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ textAlign: "left", cursor: "pointer", padding: 14, borderRadius: 12, border: `1px solid ${hov ? C.gold : C.line}`, background: hov ? "linear-gradient(160deg,#19222e,#10161f)" : "linear-gradient(160deg,#141c27,#0d131b)", transform: hov ? "translateY(-4px)" : "none", transition: "all .18s ease", boxShadow: hov ? "0 10px 30px rgba(245,196,81,.12)" : "none", animation: "deal .35s ease both", animationDelay: `${i * 60}ms`, color: C.text }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <Face p={p} size={54} />
          <span style={{ position: "absolute", top: -8, left: -8, width: 26, height: 26, borderRadius: "50%", background: C.gold, color: "#0a0e14", fontFamily: "Anton, sans-serif", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #0a0e14" }}>{p.rating}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 19, lineHeight: 1, textTransform: "uppercase" }}>{p.name}</div>
          <div style={{ color: C.dim, fontSize: 12.5, marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.nation} · {p.club || "—"}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 5, marginTop: 10, flexWrap: "wrap" }}>
        {p.positions.map((pos) => <span key={pos} style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 7px", borderRadius: 5, background: "#0a0e14", color: C.dim, border: `1px solid ${C.line}` }}>{pos}</span>)}
      </div>
    </button>
  );
}

function PitchSlot({ slot, pick, active, chem }) {
  return (
    <div style={{ position: "absolute", left: `${slot.x}%`, top: `${slot.y}%`, transform: "translate(-50%,-50%)", textAlign: "center", width: 78 }}>
      <div style={{ width: 54, height: 54, margin: "0 auto", borderRadius: "50%", border: `2px solid ${active ? C.gold : pick ? "rgba(255,255,255,.35)" : "rgba(255,255,255,.18)"}`, background: pick ? "rgba(10,14,20,.55)" : "rgba(10,14,20,.25)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", boxShadow: active ? "0 0 0 4px rgba(245,196,81,.18),0 0 22px rgba(245,196,81,.35)" : "none", animation: active ? "pulse 1.6s ease-in-out infinite" : "none" }}>
        {pick ? <Face p={pick} size={48} /> : <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, color: "rgba(255,255,255,.55)", fontSize: 15 }}>{slot.label}</span>}
        {pick && chem != null && <span style={{ position: "absolute", bottom: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: chemColor(chem), color: "#0a0e14", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #0a0e14" }}>{chem}</span>}
      </div>
      {pick && <div style={{ marginTop: 5, color: "#fff", fontSize: 11.5, fontWeight: 700, textShadow: "0 1px 3px #000", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "'Barlow Condensed',sans-serif" }}>{pick.name}</div>}
    </div>
  );
}

function Pitch({ picks, current, details }) {
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "3/4", borderRadius: 16, overflow: "hidden", border: `1px solid ${C.line}`, background: "repeating-linear-gradient(0deg,#13351f 0 8.33%,#11301c 8.33% 16.66%)" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 80% at 50% 0%,rgba(46,158,102,.25),transparent 60%)" }} />
      <div style={{ position: "absolute", left: "12%", right: "12%", top: "8%", bottom: "8%", border: "2px solid rgba(255,255,255,.12)", borderRadius: 4 }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 90, height: 90, transform: "translate(-50%,-50%)", border: "2px solid rgba(255,255,255,.10)", borderRadius: "50%" }} />
      {FORMATION_433.map((slot, i) => (
        <PitchSlot key={i} slot={slot} pick={picks[i]?.player} active={i === current} chem={details ? details[i]?.chem : null} />
      ))}
    </div>
  );
}

const Stat = ({ label, value, big, accent }) => (
  <div style={{ textAlign: "center", padding: "0 10px" }}>
    <div style={{ fontFamily: "Anton, sans-serif", fontSize: big ? 56 : 38, lineHeight: 1, color: accent || C.text }}>{value}</div>
    <div style={{ color: C.dim, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{label}</div>
  </div>
);

export default function FutDraftGame({ supabase, userId, username = "Tú" }) {
  const [players, setPlayers] = useState([]);
  const [phase, setPhase] = useState("loading"); // loading | intro | drafting | result | saved
  const [picks, setPicks] = useState([]);
  const [used, setUsed] = useState(() => new Set());
  const [candidates, setCandidates] = useState([]);
  const [board, setBoard] = useState([]);

  useEffect(() => {
    fetch("/players.json").then((r) => r.json()).then((data) => {
      setPlayers(data); setPhase("intro");
    });
  }, []);

  const loadBoard = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("draft_entries").select("username, final_score")
      .order("final_score", { ascending: false }).limit(10);
    if (data) setBoard(data.map((d) => ({ name: d.username, score: d.final_score })));
  }, [supabase]);
  useEffect(() => { loadBoard(); }, [loadBoard]);

  const current = picks.length;
  const slot = FORMATION_433[current] || FORMATION_433[0];
  const result = useMemo(() => (picks.length === 11 ? scoreSquad(picks) : null), [picks]);

  const start = () => {
    const u = new Set();
    setUsed(u); setPicks([]); setPhase("drafting");
    setCandidates(drawCandidates(players, FORMATION_433[0].pos, u));
  };

  const pick = (p) => {
    const newPicks = [...picks, { pos: slot.pos, player: p }];
    const u = new Set(used); u.add(p.id);
    setUsed(u); setPicks(newPicks);
    if (newPicks.length === 11) { setPhase("result"); return; }
    setCandidates(drawCandidates(players, FORMATION_433[newPicks.length].pos, u));
  };

  const save = async () => {
    const r = result;
    if (supabase && userId) {
      await supabase.from("draft_entries").insert({
        user_id: userId,
        username,
        squad: picks.map((p) => ({ pos: p.pos, id: p.player.id })),
        team_rating: r.teamRating,
        team_chem: r.teamChem,
        final_score: r.finalScore,
      });
      await loadBoard();
    } else {
      setBoard((b) => [...b, { name: username, score: r.finalScore }].sort((a, z) => z.score - a.score));
    }
    setPhase("saved");
  };

  const styleTag = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Anton&family=Barlow+Condensed:wght@500;600;700&family=Archivo:wght@400;500;600&display=swap');
      @keyframes deal{from{opacity:0;transform:translateY(14px) scale(.96)}to{opacity:1}}
      @keyframes pulse{0%,100%{box-shadow:0 0 0 4px rgba(245,196,81,.18),0 0 22px rgba(245,196,81,.30)}50%{box-shadow:0 0 0 7px rgba(245,196,81,.10),0 0 30px rgba(245,196,81,.45)}}
      @keyframes rise{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
    `}</style>
  );
  const wrap = { fontFamily: "Archivo, sans-serif", background: `radial-gradient(140% 100% at 50% -10%,#141d28,${C.bg})`, color: C.text, minHeight: 560, padding: 22, borderRadius: 18 };
  const kicker = { color: C.gold, letterSpacing: 4, fontSize: 12, fontWeight: 700, textTransform: "uppercase" };
  const btn = { fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: 1, textTransform: "uppercase", padding: "13px 30px", borderRadius: 10, border: "none", cursor: "pointer", background: `linear-gradient(180deg,${C.gold},${C.goldDim})`, color: "#0a0e14", boxShadow: "0 8px 24px rgba(245,196,81,.25)" };

  if (phase === "loading") return <div style={{ ...wrap, display: "grid", placeItems: "center" }}>{styleTag}<span style={{ color: C.dim }}>Cargando jugadores…</span></div>;

  if (phase === "intro") return (
    <div style={wrap}>{styleTag}
      <div style={{ maxWidth: 560, margin: "30px auto", textAlign: "center", animation: "rise .5s ease both" }}>
        <div style={kicker}>Modo competitivo</div>
        <h1 style={{ fontFamily: "Anton, sans-serif", fontSize: 64, lineHeight: .95, margin: "10px 0 6px" }}>MUNDIAL<span style={{ color: C.gold }}> DRAFT</span></h1>
        <p style={{ color: C.dim, fontSize: 16, maxWidth: 440, margin: "0 auto 26px", lineHeight: 1.5 }}>Monta tu once eligiendo entre 5 opciones aleatorias. Tu puntuación = <b style={{ color: C.text }}>media</b> + <b style={{ color: C.gold }}>química</b>. Enlaza por selección, liga y club.</p>
        <button style={btn} onClick={start}>Empezar draft ▸</button>
      </div>
    </div>
  );

  if (phase === "drafting") return (
    <div style={wrap}>{styleTag}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <div><div style={kicker}>Eligiendo · {slot.label}</div><h2 style={{ fontFamily: "Anton, sans-serif", fontSize: 30, margin: "2px 0 0" }}>Elige tu {slot.label}</h2></div>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 22, color: C.dim }}><span style={{ color: C.gold }}>{current + 1}</span> / 11</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.15fr)", gap: 22, alignItems: "start" }}>
        <div style={{ maxWidth: 360 }}><Pitch picks={picks} current={current} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {candidates.map((p, i) => <CandidateCard key={p.id} p={p} i={i} onPick={() => pick(p)} />)}
        </div>
      </div>
    </div>
  );

  const r = result;
  const myRank = board.findIndex((b) => b.name === username && b.score === r.finalScore) + 1;
  return (
    <div style={wrap}>{styleTag}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 24, alignItems: "start" }}>
        <div style={{ maxWidth: 360 }}><Pitch picks={picks} current={-1} details={r.details} /></div>
        <div style={{ animation: "rise .5s ease both" }}>
          <div style={kicker}>Tu plantilla</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.panel, border: `1px solid ${C.line}`, borderRadius: 14, padding: "16px 8px", margin: "12px 0 18px" }}>
            <Stat label="Media" value={r.teamRating} />
            <div style={{ width: 1, height: 50, background: C.line }} />
            <Stat label="Química" value={r.teamChem} accent={chemColor(r.teamChem / 11)} />
            <div style={{ width: 1, height: 50, background: C.line }} />
            <Stat label="Total" value={r.finalScore} big accent={C.gold} />
          </div>
          {phase === "result" ? (
            <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 14, padding: 16 }}>
              <button style={{ ...btn, width: "100%" }} onClick={save}>Guardar en el ranking</button>
              <button onClick={start} style={{ marginTop: 12, width: "100%", padding: 11, borderRadius: 9, border: `1px solid ${C.line}`, background: "transparent", color: C.dim, cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600, fontSize: 16, textTransform: "uppercase" }}>↻ Jugar otra vez</button>
            </div>
          ) : (
            <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 14, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><span style={kicker}>🏆 Ranking</span>{myRank > 0 && <span style={{ color: C.gold, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700 }}>Puesto #{myRank}</span>}</div>
              {board.map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 10px", borderRadius: 8, marginBottom: 4 }}>
                  <span style={{ fontFamily: "Anton,sans-serif", color: i === 0 ? C.gold : C.dim, width: 22 }}>{i + 1}</span>
                  <span style={{ flex: 1 }}>{b.name}</span>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 19 }}>{b.score}</span>
                </div>
              ))}
              <button onClick={start} style={{ ...btn, width: "100%", marginTop: 12, fontSize: 17 }}>↻ Jugar otra vez</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
