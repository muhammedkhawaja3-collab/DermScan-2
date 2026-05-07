import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const glass = {
  background: "rgba(13,27,46,0.88)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(37,99,235,0.16)",
};

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width:46, height:26, borderRadius:13, cursor:"pointer", position:"relative", background: value?"linear-gradient(135deg,#2563EB,#1d4ed8)":"rgba(37,99,235,0.12)", border:`1px solid ${value?"rgba(37,99,235,0.5)":"rgba(37,99,235,0.2)"}`, flexShrink:0, transition:"background 0.25s" }}>
      <div style={{ position:"absolute", top:4, left: value?24:4, width:16, height:16, borderRadius:"50%", background:"white", transition:"left 0.25s cubic-bezier(0.34,1.56,0.64,1)", boxShadow:"0 1px 4px rgba(0,0,0,0.35)" }} />
    </div>
  );
}

function getMotivation(count) {
  if (count === 0) return "Take your first scan to start your skin health journey.";
  if (count < 4)  return "Great start! Keep monitoring your skin health.";
  if (count < 10) return "You're building healthy habits! Keep it up. 🌟";
  return "Skin health expert! You're doing amazing. 🏆";
}

export default function Profile() {
  const navigate = useNavigate();
  const [scans, setScans]             = useState([]);
  const [reminders, setReminders]     = useState(false);
  const [privateMode, setPrivateMode] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("dermscan_scans") || "[]");
    setScans(data);
  }, []);

  const totalScans       = scans.length;
  const uniqueConditions = new Set(
    scans.map(s => (s.condition || "").toLowerCase().split(" ").slice(0, 3).join(" ")).filter(Boolean)
  ).size;
  const avgHealing = scans.length
    ? Math.round(scans.reduce((sum, s) => sum + (s.healingPercent ?? 0), 0) / scans.length)
    : 0;

  const radius       = 50;
  const circumference = 2 * Math.PI * radius;
  const dashOffset    = circumference * (1 - avgHealing / 100);

  const shareProfile = async () => {
    if (!navigator.share) { alert("Sharing not supported on this device."); return; }
    try {
      await navigator.share({
        title: "My DermScan Health Score",
        text: `My DermScan skin health score: ${avgHealing}% average healing across ${totalScans} scan${totalScans !== 1 ? "s" : ""}. Try DermScan for AI-powered skin analysis!`,
      });
    } catch {}
  };

  const goPremium = () => {
    navigate("/");
    setTimeout(() => document.getElementById("pricing")?.scrollIntoView({ behavior:"smooth" }), 350);
  };

  const settingsRows = [
    { icon:"🔔", label:"Healing Reminders", sub:"Daily check-in notifications",    right:<Toggle value={reminders}   onChange={setReminders} /> },
    { icon:"🔒", label:"Private Mode",       sub:"Hide scans from shared devices",  right:<Toggle value={privateMode} onChange={setPrivateMode} /> },
    { icon:"🌐", label:"Language",           sub:"App display language",            right:<div style={{fontSize:12,color:"#2563EB"}}>English</div> },
    { icon:"👑", label:"Upgrade to Premium", sub:"Unlock advanced AI features",     right:<div style={{fontSize:16,color:"#F59E0B"}}>›</div>, action:goPremium },
    { icon:"📄", label:"Privacy Policy",     sub:"How we handle your data",         right:<div style={{fontSize:16,color:"#2563EB"}}>›</div>, action:() => alert("Your data stays on your device. Nothing is shared without your consent.") },
  ];

  return (
    <div className="ds-fade" style={{ minHeight:"100vh", color:"white" }}>

      <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(37,99,235,0.1)" }}>
        <div style={{ fontSize:16, fontWeight:700, color:"#2563EB" }}>👤 Profile</div>
      </div>

      <div style={{ maxWidth:700, margin:"0 auto", padding:"28px 20px 100px" }}>

        {/* Avatar with SVG health ring */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:28 }}>
          <div style={{ position:"relative", width:112, height:112, marginBottom:14, display:"flex", alignItems:"center", justifyContent:"center" }}>
            {/* SVG health score ring */}
            <svg width="112" height="112" style={{ position:"absolute", inset:0 }}>
              <defs>
                <linearGradient id="healthGrad" gradientUnits="userSpaceOnUse" x1="56" y1="6" x2="56" y2="106">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
              </defs>
              {/* Track */}
              <circle cx="56" cy="56" r={radius} fill="none" stroke="rgba(37,99,235,0.1)" strokeWidth="6" />
              {/* Progress */}
              <circle
                cx="56" cy="56" r={radius}
                fill="none"
                stroke={avgHealing > 0 ? "url(#healthGrad)" : "rgba(37,99,235,0.1)"}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform="rotate(-90, 56, 56)"
                style={{ transition:"stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
              />
            </svg>
            {/* Avatar circle */}
            <div style={{ width:84, height:84, borderRadius:"50%", background:"linear-gradient(135deg,#7C3AED,#2563EB)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:800, color:"white", boxShadow:"0 0 28px rgba(124,58,237,0.4)", zIndex:1 }}>
              ME
            </div>
          </div>

          <div style={{ fontSize:17, fontWeight:800, color:"white" }}>My Profile</div>
          <div style={{ fontSize:12, color:"#8BA4C8", marginTop:3 }}>DermScan Member</div>

          {avgHealing > 0 && (
            <div style={{ fontSize:22, fontWeight:900, color:"#2563EB", marginTop:6 }}>{avgHealing}% <span style={{fontSize:12,fontWeight:400,color:"#8BA4C8"}}>avg healing</span></div>
          )}

          {/* Motivational message */}
          <div style={{ marginTop:10, fontSize:12, color:"#6EE7B7", textAlign:"center", padding:"8px 20px", background:"rgba(16,185,129,0.07)", border:"1px solid rgba(16,185,129,0.15)", borderRadius:12, maxWidth:280 }}>
            {getMotivation(totalScans)}
          </div>
        </div>

        {/* Stats */}
        <div className="ds-stagger" style={{ display:"flex", gap:10, marginBottom:24 }}>
          {[
            { value:totalScans,       label:"Total Scans",   icon:"🔬" },
            { value:uniqueConditions, label:"Conditions",    icon:"📋" },
            { value:`${avgHealing}%`, label:"Avg Healing",   icon:"💚" },
          ].map(s => (
            <div key={s.label} style={{ ...glass, flex:1, borderRadius:16, padding:"14px 8px", textAlign:"center" }}>
              <div style={{ fontSize:15, marginBottom:4 }}>{s.icon}</div>
              <div style={{ fontSize:20, fontWeight:800, color:"#2563EB" }}>{s.value}</div>
              <div style={{ fontSize:9, color:"#8BA4C8", marginTop:3, letterSpacing:0.5 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Share button */}
        {typeof navigator !== "undefined" && navigator.share && (
          <button
            onClick={shareProfile}
            className="ds-pressable"
            style={{ width:"100%", marginBottom:20, padding:"13px", background:"rgba(37,99,235,0.08)", border:"1px solid rgba(37,99,235,0.22)", borderRadius:14, color:"#2563EB", fontWeight:700, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
          >
            ↗ Share My Health Score
          </button>
        )}

        {/* Settings */}
        <div style={{ ...glass, borderRadius:20, overflow:"hidden", marginBottom:28 }}>
          {settingsRows.map((row, i) => (
            <div key={row.label} onClick={row.action} className={row.action?"ds-pressable":""} style={{ display:"flex", alignItems:"center", gap:14, padding:"15px 16px", borderBottom: i<settingsRows.length-1?"1px solid rgba(37,99,235,0.07)":"none", cursor:row.action?"pointer":"default", transition:"background 0.15s" }}
              onMouseEnter={e => row.action && (e.currentTarget.style.background="rgba(37,99,235,0.05)")}
              onMouseLeave={e => row.action && (e.currentTarget.style.background="transparent")}
            >
              <div style={{ width:40, height:40, borderRadius:12, background:"rgba(37,99,235,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>
                {row.icon}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"white" }}>{row.label}</div>
                <div style={{ fontSize:11, color:"#8BA4C8", marginTop:2 }}>{row.sub}</div>
              </div>
              {row.right}
            </div>
          ))}
        </div>

        <div style={{ textAlign:"center", fontSize:11, color:"rgba(37,99,235,0.25)", paddingBottom:8 }}>
          DermScan v1.0.0
        </div>
      </div>
    </div>
  );
}
