import { useState, useEffect } from "react";

const glass = {
  background: "rgba(15,31,61,0.72)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid rgba(100,160,255,0.15)",
};

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width:46, height:26, borderRadius:13, cursor:"pointer", position:"relative", background: value?"linear-gradient(135deg,#1565C0,#42A5F5)":"rgba(100,160,255,0.12)", border:`1px solid ${value?"rgba(66,165,245,0.4)":"rgba(100,160,255,0.2)"}`, flexShrink:0, transition:"background 0.25s" }}>
      <div style={{ position:"absolute", top:4, left: value?24:4, width:16, height:16, borderRadius:"50%", background:"white", transition:"left 0.25s cubic-bezier(0.34,1.56,0.64,1)", boxShadow:"0 1px 4px rgba(0,0,0,0.35)" }} />
    </div>
  );
}

export default function Profile() {
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

  const settingsRows = [
    { icon:"🔔", label:"Healing Reminders", sub:"Daily check-in notifications",     right:<Toggle value={reminders}    onChange={setReminders} /> },
    { icon:"🔒", label:"Private Mode",       sub:"Hide scans from shared devices",   right:<Toggle value={privateMode}  onChange={setPrivateMode} /> },
    { icon:"🌐", label:"Language",           sub:"App display language",             right:<div style={{fontSize:12,color:"#42A5F5"}}>English</div> },
    { icon:"👑", label:"Upgrade to Premium", sub:"Unlock advanced AI features",      right:<div style={{fontSize:16,color:"#42A5F5"}}>›</div>, action:() => alert("Premium coming soon!") },
    { icon:"📄", label:"Privacy Policy",     sub:"How we handle your data",          right:<div style={{fontSize:16,color:"#42A5F5"}}>›</div>, action:() => alert("Your data stays on your device. Nothing is shared without your consent.") },
  ];

  return (
    <div className="ds-fade" style={{ minHeight:"100vh", color:"white" }}>

      <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(100,160,255,0.1)" }}>
        <div style={{ fontSize:16, fontWeight:700, color:"#42A5F5" }}>👤 Profile</div>
      </div>

      <div style={{ maxWidth:700, margin:"0 auto", padding:"28px 20px 100px" }}>

        {/* Avatar section */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:32 }}>
          <div style={{ position:"relative", marginBottom:14 }}>
            {/* Animated outer ring */}
            <div style={{ position:"absolute", inset:-6, borderRadius:"50%", border:"2px solid transparent", background:"linear-gradient(135deg,#7C3AED,#42A5F5,#7C3AED) border-box", WebkitMask:"linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)", WebkitMaskComposite:"destination-out", maskComposite:"exclude", animation:"spin 6s linear infinite" }} />
            <div style={{ width:84, height:84, borderRadius:"50%", background:"linear-gradient(135deg,#7C3AED,#1565C0)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:800, color:"white", boxShadow:"0 0 32px rgba(124,58,237,0.4)" }}>
              ME
            </div>
          </div>
          <div style={{ fontSize:17, fontWeight:800, color:"white" }}>My Profile</div>
          <div style={{ fontSize:12, color:"#8BA4C8", marginTop:3 }}>DermScan Member</div>
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
              <div style={{ fontSize:20, fontWeight:800, color:"#42A5F5" }}>{s.value}</div>
              <div style={{ fontSize:9, color:"#8BA4C8", marginTop:3, letterSpacing:0.5 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div style={{ ...glass, borderRadius:20, overflow:"hidden", marginBottom:28 }}>
          {settingsRows.map((row, i) => (
            <div key={row.label} onClick={row.action} className={row.action?"ds-pressable":""} style={{ display:"flex", alignItems:"center", gap:14, padding:"15px 16px", borderBottom: i<settingsRows.length-1?"1px solid rgba(100,160,255,0.07)":"none", cursor:row.action?"pointer":"default", transition:"background 0.15s" }}
              onMouseEnter={e => row.action && (e.currentTarget.style.background="rgba(66,165,245,0.05)")}
              onMouseLeave={e => row.action && (e.currentTarget.style.background="transparent")}
            >
              <div style={{ width:40, height:40, borderRadius:12, background:"rgba(66,165,245,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>
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

        <div style={{ textAlign:"center", fontSize:11, color:"rgba(100,160,255,0.25)", paddingBottom:8 }}>
          DermScan v1.0.0
        </div>
      </div>

    </div>
  );
}
