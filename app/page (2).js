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
          id: `wc26_g${String(id++).padStart(3,"0")}`,
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
  const teams = GROUPS[group].map(t => ({ ...t, pj:0, pg:0, pe:0, pp:0, gf:0, gc:0, dg:0, pts:0 }));
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
      if (m.result_home > m.result_away) { h.pg++; h.pts+=3; a.pp++; }
      else if (m.result_home < m.result_away) { a.pg++; a.pts+=3; h.pp++; }
      else { h.pe++; h.pts++; a.pe++; a.pts++; }
    });
  return teams.sort((a,b) => b.pts-a.pts || b.dg-a.dg || b.gf-a.gf);
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
  const d = Math.floor(time / 86400000);
  const h = Math.floor((time % 86400000) / 3600000);
  const m = Math.floor((time % 3600000) / 60000);
  const s = Math.floor((time % 60000) / 1000);
  return { d, h, m, s, started: time === 0 };
}

// ============================================================
// TEMA
// ============================================================
const GOLD = "#c9a84c";
const GOLD_L = "#f0c040";
const DARK = "#0a0806";

const inputStyle = {
  width:"100%", padding:"11px 14px", marginBottom:"12px",
  border:"1px solid rgba(201,168,76,0.25)", borderRadius:"8px",
  background:"rgba(0,0,0,0.4)", color:"#f0e8d0", fontSize:"14px",
  fontFamily:"Georgia,serif", outline:"none", boxSizing:"border-box",
};

const smallInput = {
  padding:"5px 3px", border:"1px solid rgba(201,168,76,0.3)", borderRadius:"5px",
  background:"rgba(0,0,0,0.4)", color:GOLD_L, fontSize:"17px",
  fontFamily:"Georgia,serif", outline:"none", textAlign:"center", width:"42px",
};

const sTitle = {
  fontFamily:"Georgia,serif", fontSize:"11px", letterSpacing:"4px",
  color:GOLD, marginBottom:"20px", textTransform:"uppercase",
  borderBottom:"1px solid rgba(201,168,76,0.2)", paddingBottom:"10px",
};

// ============================================================
// PARTÍCULAS
// ============================================================
function Particles() {
  const p = Array.from({length:20},(_,i)=>({
    i, s:Math.random()*3+1, t:Math.random()*100, l:Math.random()*100,
    o:Math.random()*0.2+0.05, d:Math.random()*4+3, dl:Math.random()*4,
  }));
  return (
    <div style={{position:"fixed",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
      {p.map(x=>(
        <div key={x.i} style={{
          position:"absolute",width:x.s+"px",height:x.s+"px",background:GOLD,
          borderRadius:"50%",top:x.t+"%",left:x.l+"%",opacity:x.o,
          animation:`floatUp ${x.d}s ease-in-out infinite`,animationDelay:x.dl+"s",
        }}/>
      ))}
    </div>
  );
}

// ============================================================
// PANTALLA DE INICIO CON CUENTA ATRÁS
// ============================================================
function SplashScreen({ onEnter }) {
  const { d, h, m, s, started } = useCountdown();
  const pad = n => String(n).padStart(2,"0");

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px",position:"relative",zIndex:1,textAlign:"center"}}>
      <div style={{fontSize:"72px",marginBottom:"12px",filter:"drop-shadow(0 0 32px rgba(201,168,76,0.7))"}}>🏆</div>

      <p style={{color:GOLD,fontFamily:"Georgia,serif",letterSpacing:"6px",fontSize:"11px",margin:"0 0 8px",textTransform:"uppercase"}}>
        Porra Vallau
      </p>
      <h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(28px,6vw,52px)",color:"#f0e8d0",margin:"0 0 4px",fontWeight:"normal",letterSpacing:"3px",lineHeight:1.1}}>
        Mundial 2026
      </h1>
      <p style={{color:"#554433",fontSize:"11px",letterSpacing:"4px",margin:"0 0 40px",fontFamily:"monospace"}}>
        USA · CANADA · MEXICO
      </p>

      {/* Cuenta atrás */}
      {!started ? (
        <>
          <p style={{color:"#776644",fontFamily:"monospace",fontSize:"10px",letterSpacing:"3px",marginBottom:"16px"}}>
            EL TORNEO EMPIEZA EN
          </p>
          <div style={{display:"flex",gap:"12px",marginBottom:"40px"}}>
            {[{v:d,l:"DÍAS"},{v:pad(h),l:"HORAS"},{v:pad(m),l:"MIN"},{v:pad(s),l:"SEG"}].map(({v,l})=>(
              <div key={l} style={{textAlign:"center"}}>
                <div style={{
                  background:"rgba(201,168,76,0.08)",border:"1px solid rgba(201,168,76,0.25)",
                  borderRadius:"10px",padding:"14px 16px",minWidth:"64px",
                }}>
                  <span style={{fontFamily:"Georgia,serif",fontSize:"clamp(24px,5vw,38px)",color:GOLD_L,fontWeight:"bold",lineHeight:1}}>{v}</span>
                </div>
                <span style={{fontSize:"9px",color:"#554433",fontFamily:"monospace",letterSpacing:"2px",marginTop:"6px",display:"block"}}>{l}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p style={{color:GOLD,fontFamily:"Georgia,serif",fontSize:"18px",marginBottom:"40px",letterSpacing:"2px"}}>
          ¡El torneo ha comenzado! ⚽
        </p>
      )}

      <button onClick={onEnter} style={{
        padding:"14px 40px",border:`1px solid ${GOLD}`,borderRadius:"8px",cursor:"pointer",
        background:`linear-gradient(135deg,rgba(201,168,76,0.15),rgba(201,168,76,0.05))`,
        color:GOLD_L,fontSize:"12px",letterSpacing:"4px",fontFamily:"monospace",
        textTransform:"uppercase",transition:"all 0.2s",
      }}>
        Entrar a la porra →
      </button>

      <p style={{color:"#332211",fontSize:"10px",fontFamily:"monospace",marginTop:"16px",letterSpacing:"1px"}}>
        11 junio 2026 · 20:00h · México vs ??
      </p>
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
        const {data,error} = await supabase.auth.signInWithPassword({email,password});
        if (error) { setError("Email o contraseña incorrectos"); return; }
        const {data:profile} = await supabase.from("profiles").select("*").eq("id",data.user.id).single();
        onLogin({...data.user, name:profile?.name||email, role:profile?.role||"user"});
      } else {
        if (!name||!email||!password) { setError("Rellena todos los campos"); return; }
        const {data,error} = await supabase.auth.signUp({email,password});
        if (error) { setError(error.message); return; }
        await supabase.from("profiles").insert({id:data.user.id,name,role:"user"});
        onLogin({...data.user,name,role:"user"});
      }
    } finally { setLoading(false); }
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",position:"relative",zIndex:1}}>
      <div style={{width:"100%",maxWidth:"400px"}}>
        <div style={{textAlign:"center",marginBottom:"28px"}}>
          <div style={{fontSize:"52px",filter:"drop-shadow(0 0 24px rgba(201,168,76,0.6))",marginBottom:"8px"}}>🏆</div>
          <p style={{color:GOLD,fontFamily:"Georgia,serif",letterSpacing:"5px",fontSize:"10px",margin:"0 0 4px",textTransform:"uppercase"}}>Porra Vallau · Mundial 2026</p>
          <h2 style={{fontFamily:"Georgia,serif",fontSize:"26px",color:"#f0e8d0",margin:0,fontWeight:"normal",letterSpacing:"2px"}}>Accede a tu cuenta</h2>
        </div>
        <div style={{background:"rgba(18,13,7,0.95)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:"12px",padding:"26px"}}>
          <div style={{display:"flex",marginBottom:"20px",background:"rgba(0,0,0,0.4)",borderRadius:"7px",padding:"3px"}}>
            {["login","register"].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setError("");}} style={{
                flex:1,padding:"8px",border:"none",borderRadius:"5px",cursor:"pointer",
                fontSize:"10px",letterSpacing:"2px",fontFamily:"monospace",textTransform:"uppercase",
                background:mode===m?GOLD:"transparent",
                color:mode===m?"#0a0806":"#665533",transition:"all 0.2s",
              }}>{m==="login"?"Entrar":"Registro"}</button>
            ))}
          </div>
          {mode==="register"&&<input value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre" style={inputStyle}/>}
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" style={inputStyle}/>
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Contraseña" type="password" style={inputStyle} onKeyDown={e=>e.key==="Enter"&&go()}/>
          {error&&<p style={{color:"#cc4444",fontSize:"12px",marginBottom:"12px",fontFamily:"monospace"}}>⚠ {error}</p>}
          <button onClick={go} disabled={loading} style={{
            width:"100%",padding:"13px",border:"none",borderRadius:"7px",cursor:"pointer",
            background:loading?"#221a0a":`linear-gradient(135deg,${GOLD},#8b6914)`,
            color:"#0a0806",fontWeight:700,fontSize:"12px",letterSpacing:"3px",
            fontFamily:"monospace",textTransform:"uppercase",
          }}>
            {loading?"...":mode==="login"?"⚡ Entrar":"🚀 Registrarme"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// NAVBAR
// ============================================================
function NavBar({user,view,setView,onLogout}) {
  const {d,h,m} = useCountdown();
  const tabs = user.role==="admin"
    ? [{id:"groups",icon:"⚽",label:"Grupos"},{id:"ranking",icon:"🏆",label:"Ranking"},{id:"admin",icon:"⚙️",label:"Admin"}]
    : [{id:"groups",icon:"⚽",label:"Grupos"},{id:"mypreds",icon:"📋",label:"Mis pronóst."},{id:"ranking",icon:"🏆",label:"Ranking"}];
  return (
    <div style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(8,6,3,0.97)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(201,168,76,0.12)"}}>
      <div style={{maxWidth:"900px",margin:"0 auto",padding:"0 14px",display:"flex",alignItems:"center",height:"52px",gap:"2px"}}>
        <span style={{fontSize:"16px",marginRight:"6px"}}>🏆</span>
        <div style={{marginRight:"auto"}}>
          <span style={{fontFamily:"Georgia,serif",fontSize:"13px",color:GOLD,letterSpacing:"1px"}}>Porra Vallau </span>
          <span style={{fontFamily:"Georgia,serif",fontSize:"13px",color:"#f0e8d0"}}>Mundial 2026</span>
        </div>
        <span style={{fontSize:"10px",color:"#443322",fontFamily:"monospace",marginRight:"8px",display:"none"}}>
          {d}d {h}h {m}m
        </span>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setView(t.id)} style={{
            padding:"6px 11px",border:"none",cursor:"pointer",fontSize:"10px",fontFamily:"monospace",
            background:"transparent",letterSpacing:"1px",textTransform:"uppercase",
            color:view===t.id?GOLD_L:"#554433",
            borderBottom:view===t.id?`2px solid ${GOLD}`:"2px solid transparent",
            transition:"all 0.2s",
          }}>{t.icon} {t.label}</button>
        ))}
        <span style={{fontSize:"10px",color:"#443322",fontFamily:"monospace",marginLeft:"8px"}}>{user.name?.split(" ")[0]}</span>
        <button onClick={onLogout} style={{marginLeft:"6px",padding:"4px 9px",border:"1px solid rgba(201,168,76,0.15)",borderRadius:"5px",background:"transparent",color:"#554433",cursor:"pointer",fontSize:"10px",fontFamily:"monospace"}}>salir</button>
      </div>
    </div>
  );
}

// ============================================================
// CLASIFICACIÓN
// ============================================================
function GroupStanding({group,matches}) {
  const st = calcStandings(group,matches);
  return (
    <div style={{marginTop:"10px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 28px 28px 28px 28px 36px",gap:"1px",padding:"3px 8px 2px"}}>
        {["EQUIPO","PJ","GF","GC","DG","PTS"].map(c=>(
          <span key={c} style={{fontSize:"9px",color:"#443322",fontFamily:"monospace",letterSpacing:"1px",textAlign:c==="EQUIPO"?"left":"center"}}>{c}</span>
        ))}
      </div>
      {st.map((t,i)=>(
        <div key={t.name} style={{
          display:"grid",gridTemplateColumns:"1fr 28px 28px 28px 28px 36px",
          gap:"1px",padding:"7px 8px",borderRadius:"6px",marginBottom:"2px",
          background:i<2?"rgba(201,168,76,0.06)":"rgba(255,255,255,0.015)",
          border:i<2?"1px solid rgba(201,168,76,0.12)":"1px solid rgba(255,255,255,0.04)",
          borderLeft:i<2?`3px solid ${GOLD}`:"3px solid transparent",
        }}>
          <span style={{display:"flex",alignItems:"center",gap:"5px",overflow:"hidden"}}>
            <span style={{fontSize:"15px"}}>{t.flag}</span>
            <span style={{fontSize:"11px",color:i<2?"#f0e8d0":"#776655",fontFamily:"Georgia,serif",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.name}</span>
          </span>
          {[t.pj,t.gf,t.gc,t.dg>0?`+${t.dg}`:t.dg].map((v,vi)=>(
            <span key={vi} style={{fontSize:"11px",color:"#665544",fontFamily:"monospace",textAlign:"center"}}>{v}</span>
          ))}
          <span style={{fontSize:"13px",fontWeight:700,color:GOLD_L,fontFamily:"monospace",textAlign:"center"}}>{t.pts}</span>
        </div>
      ))}
      <p style={{fontSize:"9px",color:"#443322",fontFamily:"monospace",margin:"5px 0 0",letterSpacing:"1px"}}>🟡 Los 2 primeros pasan a octavos</p>
    </div>
  );
}

// ============================================================
// FILA DE PARTIDO — AUTOGUARDADO
// ============================================================
function MatchRow({match,userPred,user,onSaved}) {
  const ht = getTeam(match.home), at = getTeam(match.away);
  const [ph,setPh] = useState(userPred?.predicted_home??"");
  const [pa,setPa] = useState(userPred?.predicted_away??"");
  const [status,setStatus] = useState("idle"); // idle | saving | saved | error
  const timerRef = useRef(null);
  const isOpen = match.status==="open";
  const hasResult = match.result_home!==null && match.result_away!==null;
  const predPoints = userPred&&hasResult ? calcPoints(userPred,match.result_home,match.result_away) : null;

  const save = useCallback(async (newPh, newPa) => {
    if (newPh===""||newPa==="") return;
    setStatus("saving");
    const {error} = await supabase.from("predictions").upsert({
      user_id:user.id, match_id:match.id,
      predicted_home:parseInt(newPh), predicted_away:parseInt(newPa), points:null,
    },{onConflict:"user_id,match_id"});
    if (error) { setStatus("error"); return; }
    setStatus("saved");
    onSaved();
    setTimeout(()=>setStatus("idle"),2000);
  },[user.id,match.id,onSaved]);

  const handleChange = (setter,val,other) => {
    setter(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    const ph2 = setter===setPh ? val : ph;
    const pa2 = setter===setPa ? val : pa;
    if (ph2!==""&&pa2!=="") {
      timerRef.current = setTimeout(()=>save(ph2,pa2),800);
    }
  };

  return (
    <div style={{padding:"10px 12px",borderRadius:"8px",marginBottom:"5px",background:"rgba(255,255,255,0.018)",border:"1px solid rgba(255,255,255,0.04)"}}>
      <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"flex-end",gap:"5px"}}>
          <span style={{fontSize:"11px",color:"#997755",fontFamily:"Georgia,serif",textAlign:"right"}}>{match.home}</span>
          <span style={{fontSize:"18px"}}>{ht.flag}</span>
        </div>
        {hasResult?(
          <div style={{minWidth:"60px",textAlign:"center"}}>
            <span style={{fontFamily:"Georgia,serif",fontSize:"22px",color:GOLD_L,fontWeight:"bold"}}>{match.result_home}</span>
            <span style={{color:"#332211",fontSize:"13px",margin:"0 2px"}}>-</span>
            <span style={{fontFamily:"Georgia,serif",fontSize:"22px",color:GOLD_L,fontWeight:"bold"}}>{match.result_away}</span>
          </div>
        ):(
          <div style={{minWidth:"44px",textAlign:"center"}}>
            <span style={{fontFamily:"monospace",fontSize:"10px",color:"#332211",letterSpacing:"2px"}}>VS</span>
          </div>
        )}
        <div style={{flex:1,display:"flex",alignItems:"center",gap:"5px"}}>
          <span style={{fontSize:"18px"}}>{at.flag}</span>
          <span style={{fontSize:"11px",color:"#997755",fontFamily:"Georgia,serif"}}>{match.away}</span>
        </div>
      </div>

      {user.role!=="admin"&&(
        <div style={{marginTop:"7px",display:"flex",alignItems:"center",justifyContent:"center",gap:"7px"}}>
          {isOpen?(
            <>
              <span style={{fontSize:"9px",color:"#443322",fontFamily:"monospace"}}>pronóst.:</span>
              <input value={ph} onChange={e=>handleChange(setPh,e.target.value,pa)} type="number" min="0" max="20" style={smallInput} placeholder="0"/>
              <span style={{color:"#332211"}}>-</span>
              <input value={pa} onChange={e=>handleChange(setPa,e.target.value,ph)} type="number" min="0" max="20" style={smallInput} placeholder="0"/>
              <span style={{
                fontSize:"9px",fontFamily:"monospace",minWidth:"50px",textAlign:"left",
                color:status==="saved"?GOLD_L:status==="saving"?"#665533":status==="error"?"#cc4444":"#332211",
              }}>
                {status==="saving"?"guardando...":status==="saved"?"✓ guardado":status==="error"?"✗ error":userPred?"✓ guardado":"escribe..."}
              </span>
            </>
          ):userPred?(
            <>
              <span style={{fontSize:"10px",color:"#554433",fontFamily:"monospace"}}>
                {userPred.predicted_home}-{userPred.predicted_away}
              </span>
              {predPoints!==null&&(
                <span style={{
                  padding:"2px 9px",borderRadius:"10px",fontSize:"10px",fontFamily:"monospace",fontWeight:700,
                  background:predPoints===3?"rgba(201,168,76,0.14)":predPoints===1?"rgba(255,193,7,0.1)":"rgba(255,82,82,0.08)",
                  color:predPoints===3?GOLD_L:predPoints===1?"#ffc107":"#ff5252",
                }}>
                  {predPoints===3?"🎯 +3":predPoints===1?"✓ +1":"✗ +0"}
                </span>
              )}
            </>
          ):(
            <span style={{fontSize:"9px",color:"#332211",fontFamily:"monospace"}}>cerrado · sin pronóstico</span>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// VISTA GRUPOS
// ============================================================
function GroupsView({user,matches,predictions,onDataChange}) {
  const [g,setG] = useState("A");
  const predMap = {};
  predictions.forEach(p=>{predMap[p.match_id]=p;});

  return (
    <div>
      <h2 style={sTitle}>⚽ Fase de Grupos · Mundial 2026</h2>
      <div style={{display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"22px"}}>
        {Object.keys(GROUPS).map(gr=>(
          <button key={gr} onClick={()=>setG(gr)} style={{
            width:"36px",height:"36px",
            border:`1px solid ${g===gr?GOLD:"rgba(201,168,76,0.2)"}`,
            borderRadius:"7px",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:"15px",fontWeight:"bold",
            background:g===gr?GOLD:"rgba(201,168,76,0.05)",
            color:g===gr?"#0a0806":GOLD,transition:"all 0.15s",
          }}>{gr}</button>
        ))}
      </div>

      <div style={{background:"rgba(18,13,7,0.85)",border:"1px solid rgba(201,168,76,0.14)",borderRadius:"12px",padding:"18px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"14px"}}>
          <div style={{width:"36px",height:"36px",borderRadius:"7px",background:GOLD,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontFamily:"Georgia,serif",fontSize:"18px",fontWeight:"bold",color:"#0a0806"}}>{g}</span>
          </div>
          <div>
            <h3 style={{margin:0,fontFamily:"Georgia,serif",color:"#f0e8d0",fontSize:"16px",fontWeight:"normal"}}>Grupo {g}</h3>
            <div style={{display:"flex",gap:"6px",marginTop:"3px"}}>
              {GROUPS[g].map(t=><span key={t.name} style={{fontSize:"15px"}} title={t.name}>{t.flag}</span>)}
            </div>
          </div>
        </div>

        <GroupStanding group={g} matches={matches}/>

        <div style={{marginTop:"18px"}}>
          <p style={{fontSize:"9px",color:GOLD,fontFamily:"monospace",letterSpacing:"3px",marginBottom:"8px"}}>PARTIDOS</p>
          {matches.filter(m=>m.grp===g).map(m=>(
            <MatchRow key={m.id} match={m} userPred={predMap[m.id]} user={user} onSaved={onDataChange}/>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MIS PRONÓSTICOS
// ============================================================
function MyPredsView({predictions,matches}) {
  const total = predictions.reduce((s,p)=>s+(p.points||0),0);
  const exactos = predictions.filter(p=>p.points===3).length;
  return (
    <div>
      <h2 style={sTitle}>📋 Mis Pronósticos</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginBottom:"22px"}}>
        {[{l:"Puntos totales",v:total,c:GOLD_L},{l:"Exactos 🎯",v:exactos,c:GOLD},{l:"Enviados",v:predictions.length,c:"#887755"}].map(s=>(
          <div key={s.l} style={{background:"rgba(18,13,7,0.85)",border:"1px solid rgba(201,168,76,0.14)",borderRadius:"9px",padding:"14px",textAlign:"center"}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:"26px",color:s.c,lineHeight:1}}>{s.v}</div>
            <div style={{fontSize:"9px",color:"#554433",fontFamily:"monospace",marginTop:"4px",letterSpacing:"1px"}}>{s.l}</div>
          </div>
        ))}
      </div>
      {Object.keys(GROUPS).map(group=>{
        const gp = predictions.filter(p=>{
          const m = matches.find(x=>x.id===p.match_id);
          return m?.grp===group;
        });
        if(gp.length===0) return null;
        return (
          <div key={group} style={{marginBottom:"14px"}}>
            <p style={{fontSize:"9px",color:GOLD,fontFamily:"monospace",letterSpacing:"3px",marginBottom:"7px"}}>GRUPO {group}</p>
            {gp.map(pred=>{
              const m = matches.find(x=>x.id===pred.match_id);
              if(!m) return null;
              const ht=getTeam(m.home),at=getTeam(m.away);
              return (
                <div key={pred.id} style={{display:"flex",alignItems:"center",gap:"10px",padding:"9px 12px",background:"rgba(255,255,255,0.018)",border:"1px solid rgba(255,255,255,0.04)",borderRadius:"7px",marginBottom:"3px",flexWrap:"wrap"}}>
                  <span style={{flex:1,fontSize:"11px",color:"#887755",fontFamily:"Georgia,serif",minWidth:"140px"}}>{ht.flag} {m.home} vs {at.flag} {m.away}</span>
                  <span style={{fontSize:"13px",color:"#b09060",fontFamily:"monospace"}}>{pred.predicted_home}-{pred.predicted_away}</span>
                  {m.result_home!==null&&<span style={{fontSize:"13px",color:GOLD,fontFamily:"monospace"}}>Real: {m.result_home}-{m.result_away}</span>}
                  {pred.points!==null&&pred.points!==undefined&&(
                    <span style={{
                      padding:"2px 9px",borderRadius:"10px",fontSize:"11px",fontFamily:"monospace",fontWeight:700,
                      background:pred.points===3?"rgba(201,168,76,0.14)":pred.points===1?"rgba(255,193,7,0.1)":"rgba(255,82,82,0.08)",
                      color:pred.points===3?GOLD_L:pred.points===1?"#ffc107":"#ff5252",
                    }}>
                      {pred.points===3?"🎯 +3":pred.points===1?"✓ +1":"✗ +0"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
      {predictions.length===0&&<p style={{color:"#443322",fontFamily:"monospace"}}>Aún no has enviado pronósticos. ¡Ve a Grupos y empieza!</p>}
    </div>
  );
}

// ============================================================
// RANKING
// ============================================================
function RankingView() {
  const [ranking,setRanking] = useState([]);
  const [loading,setLoading] = useState(true);
  useEffect(()=>{
    (async()=>{
      const {data:profiles} = await supabase.from("profiles").select("*").eq("role","user");
      const {data:preds} = await supabase.from("predictions").select("*").not("points","is",null);
      const r = (profiles||[]).map(p=>({
        ...p,
        total:(preds||[]).filter(x=>x.user_id===p.id).reduce((s,x)=>s+(x.points||0),0),
        exactos:(preds||[]).filter(x=>x.user_id===p.id&&x.points===3).length,
        count:(preds||[]).filter(x=>x.user_id===p.id).length,
      })).sort((a,b)=>b.total-a.total);
      setRanking(r); setLoading(false);
    })();
  },[]);
  const medals = ["🥇","🥈","🥉"];
  if(loading) return <p style={{color:"#554433",fontFamily:"monospace"}}>Cargando...</p>;
  return (
    <div>
      <h2 style={sTitle}>🏆 Ranking · Porra Vallau Mundial 2026</h2>
      {ranking.length===0&&<p style={{color:"#443322",fontFamily:"monospace"}}>Aún no hay puntuaciones</p>}
      {ranking.map((u,i)=>(
        <div key={u.id} style={{
          display:"flex",alignItems:"center",gap:"14px",
          background:i===0?"rgba(201,168,76,0.07)":"rgba(255,255,255,0.018)",
          border:i===0?"1px solid rgba(201,168,76,0.22)":"1px solid rgba(255,255,255,0.05)",
          borderRadius:"9px",padding:"15px 18px",marginBottom:"7px",
        }}>
          <span style={{fontSize:"22px",minWidth:"28px"}}>{medals[i]||`#${i+1}`}</span>
          <div style={{flex:1}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:"16px",color:"#f0e8d0"}}>{u.name}</div>
            <div style={{fontSize:"9px",color:"#554433",fontFamily:"monospace",marginTop:"2px"}}>{u.exactos} exactos · {u.count} evaluados</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:"30px",color:i===0?GOLD_L:GOLD,lineHeight:1}}>{u.total}</div>
            <div style={{fontSize:"9px",color:"#554433",fontFamily:"monospace"}}>PUNTOS</div>
          </div>
        </div>
      ))}
      <div style={{marginTop:"18px",padding:"12px 14px",background:"rgba(18,13,7,0.7)",border:"1px solid rgba(201,168,76,0.08)",borderRadius:"7px"}}>
        <p style={{color:"#554433",fontFamily:"monospace",fontSize:"9px",margin:0,lineHeight:2,letterSpacing:"1px"}}>
          <span style={{color:GOLD_L}}>+3 pts</span> resultado exacto &nbsp;|&nbsp;
          <span style={{color:"#ffc107"}}>+1 pt</span> signo correcto (1X2) &nbsp;|&nbsp;
          <span style={{color:"#ff5252"}}>+0 pts</span> fallo
        </p>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN
// ============================================================
function AdminView({matches,onDataChange}) {
  const [g,setG] = useState("A");
  const [sel,setSel] = useState(null);
  const [hr,setHr] = useState(""); const [ar,setAr] = useState("");
  const [saved,setSaved] = useState(false);

  const handleResult = async () => {
    if(hr===""||ar==="") return;
    const rh=parseInt(hr),ra=parseInt(ar);
    await supabase.from("matches").update({result_home:rh,result_away:ra,status:"closed"}).eq("id",sel);
    const {data:preds} = await supabase.from("predictions").select("*").eq("match_id",sel);
    for(const pred of (preds||[])) {
      await supabase.from("predictions").update({points:calcPoints(pred,rh,ra)}).eq("id",pred.id);
    }
    setSaved(true); setSel(null); setHr(""); setAr("");
    onDataChange();
    setTimeout(()=>setSaved(false),3000);
  };

  const toggleStatus = async m => {
    await supabase.from("matches").update({status:m.status==="open"?"closed":"open"}).eq("id",m.id);
    onDataChange();
  };

  return (
    <div>
      <h2 style={sTitle}>⚙️ Panel de Administración</h2>
      {saved&&<div style={{padding:"10px 14px",background:"rgba(201,168,76,0.1)",border:`1px solid ${GOLD}`,borderRadius:"7px",color:GOLD,fontFamily:"monospace",fontSize:"11px",marginBottom:"14px"}}>✓ Resultado guardado y puntos calculados</div>}
      <div style={{display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"18px"}}>
        {Object.keys(GROUPS).map(gr=>(
          <button key={gr} onClick={()=>setG(gr)} style={{
            width:"34px",height:"34px",
            border:`1px solid ${g===gr?GOLD:"rgba(201,168,76,0.18)"}`,
            borderRadius:"6px",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:"14px",fontWeight:"bold",
            background:g===gr?GOLD:"rgba(201,168,76,0.04)",color:g===gr?"#0a0806":GOLD,
          }}>{gr}</button>
        ))}
      </div>
      <p style={{fontSize:"9px",color:GOLD,fontFamily:"monospace",letterSpacing:"3px",marginBottom:"10px"}}>GRUPO {g}</p>
      {matches.filter(m=>m.grp===g).map(m=>{
        const ht=getTeam(m.home),at=getTeam(m.away);
        return (
          <div key={m.id} style={{background:"rgba(18,13,7,0.8)",border:"1px solid rgba(201,168,76,0.1)",borderRadius:"9px",padding:"13px",marginBottom:"6px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}}>
              <span style={{flex:1,fontFamily:"Georgia,serif",fontSize:"13px",color:"#a08060",minWidth:"160px"}}>
                {ht.flag} {m.home} vs {at.flag} {m.away}
              </span>
              <span style={{fontSize:"9px",fontFamily:"monospace",padding:"2px 7px",borderRadius:"8px",background:m.status==="open"?"rgba(0,200,100,0.08)":"rgba(255,100,50,0.08)",color:m.status==="open"?"#00c864":"#ff6432"}}>
                {m.status==="open"?"ABIERTO":"CERRADO"}
              </span>
              {m.result_home!==null&&(
                <span style={{fontFamily:"Georgia,serif",fontSize:"17px",color:GOLD_L}}>{m.result_home} - {m.result_away}</span>
              )}
              <button onClick={()=>toggleStatus(m)} style={{padding:"3px 9px",border:"1px solid rgba(201,168,76,0.18)",borderRadius:"4px",background:"transparent",color:"#776644",cursor:"pointer",fontSize:"9px",fontFamily:"monospace"}}>
                {m.status==="open"?"Cerrar":"Reabrir"}
              </button>
              {sel===m.id?(
                <div style={{display:"flex",gap:"5px",alignItems:"center"}}>
                  <input value={hr} onChange={e=>setHr(e.target.value)} type="number" min="0" style={{...smallInput,width:"38px"}} placeholder="0"/>
                  <span style={{color:"#332211"}}>-</span>
                  <input value={ar} onChange={e=>setAr(e.target.value)} type="number" min="0" style={{...smallInput,width:"38px"}} placeholder="0"/>
                  <button onClick={handleResult} style={{padding:"4px 10px",border:"none",borderRadius:"4px",background:GOLD,color:"#0a0806",cursor:"pointer",fontSize:"9px",fontFamily:"monospace",fontWeight:700}}>OK</button>
                  <button onClick={()=>setSel(null)} style={{padding:"4px 7px",border:"1px solid #332211",borderRadius:"4px",background:"transparent",color:"#665544",cursor:"pointer",fontSize:"9px",fontFamily:"monospace"}}>✕</button>
                </div>
              ):(
                <button onClick={()=>{setSel(m.id);setHr("");setAr("");}} style={{padding:"4px 10px",border:"1px solid rgba(201,168,76,0.25)",borderRadius:"4px",background:"rgba(201,168,76,0.05)",color:GOLD,cursor:"pointer",fontSize:"9px",fontFamily:"monospace"}}>
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
  const [screen,setScreen] = useState("splash"); // splash | login | app
  const [user,setUser] = useState(null);
  const [view,setView] = useState("groups");
  const [matches,setMatches] = useState([]);
  const [predictions,setPredictions] = useState([]);
  const [loadingSession,setLoadingSession] = useState(true);

  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(session){
        const {data:profile} = await supabase.from("profiles").select("*").eq("id",session.user.id).single();
        setUser({...session.user,name:profile?.name||session.user.email,role:profile?.role||"user"});
        setScreen("app");
      }
      setLoadingSession(false);
    });
  },[]);

  useEffect(()=>{ if(user) loadData(); },[user]);

  const loadData = async () => {
    const {data:dbMatches} = await supabase.from("matches").select("*").order("grp");
    if(dbMatches&&dbMatches.length>0){
      setMatches(dbMatches);
    } else {
      // Insertar de 10 en 10 para evitar límites
      const chunks = [];
      for(let i=0;i<ALL_MATCHES.length;i+=10) chunks.push(ALL_MATCHES.slice(i,i+10));
      let all = [];
      for(const chunk of chunks){
        const {data} = await supabase.from("matches").insert(chunk).select();
        if(data) all=[...all,...data];
      }
      setMatches(all.length>0?all:ALL_MATCHES);
    }
    if(user){
      const {data:p} = await supabase.from("predictions").select("*").eq("user_id",user.id);
      setPredictions(p||[]);
    }
  };

  const handleLogin = (u) => { setUser(u); setScreen("app"); };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setScreen("splash");
  };

  if(loadingSession){
    return (
      <div style={{minHeight:"100vh",background:DARK,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:"44px",marginBottom:"10px",filter:"drop-shadow(0 0 20px rgba(201,168,76,0.5))"}}>🏆</div>
          <span style={{color:GOLD,fontFamily:"Georgia,serif",letterSpacing:"4px",fontSize:"11px"}}>CARGANDO...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh",background:`radial-gradient(ellipse at top,#1c1408 0%,${DARK} 65%)`,color:"#f0e8d0"}}>
      <style>{`
        @keyframes floatUp{0%,100%{transform:translateY(0);opacity:0.08}50%{transform:translateY(-10px);opacity:0.22}}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:#0a0806}
        ::-webkit-scrollbar-thumb{background:#332211;border-radius:2px}
      `}</style>
      <Particles/>

      {screen==="splash"&&(
        <SplashScreen onEnter={()=>setScreen("login")}/>
      )}

      {screen==="login"&&(
        <LoginPage onLogin={handleLogin}/>
      )}

      {screen==="app"&&user&&(
        <>
          <NavBar user={user} view={view} setView={setView} onLogout={handleLogout}/>
          <div style={{maxWidth:"740px",margin:"0 auto",padding:"70px 14px 48px",position:"relative",zIndex:1}}>
            {view==="groups"&&<GroupsView user={user} matches={matches} predictions={predictions} onDataChange={loadData}/>}
            {view==="mypreds"&&<MyPredsView predictions={predictions} matches={matches}/>}
            {view==="ranking"&&<RankingView/>}
            {view==="admin"&&user.role==="admin"&&<AdminView matches={matches} onDataChange={loadData}/>}
          </div>
        </>
      )}
    </div>
  );
}
