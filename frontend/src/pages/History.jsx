import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FILTERS = ["All", "Wounds", "Rashes", "Blemishes", "Other"];

const SEV = {
  high:   { color:"#EF4444", bg:"rgba(239,68,68,0.15)",  label:"High"     },
  medium: { color:"#F59E0B", bg:"rgba(245,158,11,0.15)", label:"Moderate" },
  low:    { color:"#10B981", bg:"rgba(16,185,129,0.15)", label:"Low"      },
};

const glass = {
  background: "rgba(13,27,46,0.88)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(37,99,235,0.16)",
};

function matchCategory(scan, filter) {
  if (filter === "All") return true;
  const text = ((scan.condition || "") + " " + (scan.result || "")).toLowerCase();
  if (filter === "Wounds")    return ["wound","cut","lacerat","lesion","ulcer","sore","abrasion","blister"].some(k => text.includes(k));
  if (filter === "Rashes")    return ["rash","eczema","dermatitis","hive","urticaria","inflam","psoriasis","allergic"].some(k => text.includes(k));
  if (filter === "Blemishes") return ["acne","pimple","blemish","blackhead","whitehead","comedone","spot","breakout"].some(k => text.includes(k));
  return false;
}

export default function History() {
  const [scans, setScans]           = useState([]);
  const [filter, setFilter]         = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("dermscan_scans") || "[]");
    setScans(data);
  }, []);

  const save = (updated) => {
    setScans(updated);
    localStorage.setItem("dermscan_scans", JSON.stringify(updated));
  };

  const deleteOne = (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this scan?")) return;
    save(scans.filter(s => s.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const clearAll = () => {
    if (!confirm("Delete all scans? This cannot be undone.")) return;
    setScans([]);
    localStorage.removeItem("dermscan_scans");
    setExpandedId(null);
  };

  const filtered = filter === "Other"
    ? scans.filter(s => !matchCategory(s,"Wounds") && !matchCategory(s,"Rashes") && !matchCategory(s,"Blemishes"))
    : scans.filter(s => matchCategory(s, filter));

  const avgHealing = scans.length
    ? Math.round(scans.reduce((a,s) => a + (s.healingPercent ?? 0), 0) / scans.length)
    : 0;

  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

  return (
    <div className="ds-fade" style={{ minHeight:"100vh", color:"white" }}>

      {/* Header */}
      <div style={{ padding:"14px 16px", borderBottom:"1px solid rgba(37,99,235,0.1)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontSize:16, fontWeight:700, color:"#2563EB" }}>📊 Healing History</div>
        {scans.length > 0 && (
          <button
            onClick={clearAll}
            className="ds-pressable"
            style={{ padding:"5px 14px", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.22)", borderRadius:20, color:"#EF4444", fontSize:11, fontWeight:700, cursor:"pointer" }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Stats banner */}
      {scans.length > 0 && (
        <div className="ds-stagger" style={{ display:"flex", gap:10, padding:"14px 20px 0" }}>
          {[
            { value: scans.length,                          label: "Total Scans", color: "#2563EB" },
            { value: `${avgHealing}%`,                      label: "Avg Healing", color: "#10B981" },
            { value: SEV[scans[0]?.severity]?.label ?? "—", label: "Last Scan",   color: SEV[scans[0]?.severity]?.color ?? "#8BA4C8" },
          ].map(s => (
            <div key={s.label} style={{ ...glass, flex:1, borderRadius:14, padding:"12px 8px", textAlign:"center" }}>
              <div style={{ fontSize:17, fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:9, color:"#8BA4C8", marginTop:2, letterSpacing:0.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display:"flex", gap:8, padding:"14px 20px", overflowX:"auto" }}>
        {FILTERS.map(f => (
          <div
            key={f}
            onClick={() => setFilter(f)}
            className="ds-pressable"
            style={{
              padding:"6px 16px", borderRadius:20, fontSize:12, fontWeight:600,
              cursor:"pointer", flexShrink:0, transition:"all 0.2s",
              background: filter===f ? "linear-gradient(135deg,#2563EB,#1d4ed8)" : "rgba(37,99,235,0.08)",
              color: filter===f ? "white" : "#8BA4C8",
              border: filter===f ? "none" : "1px solid rgba(37,99,235,0.15)",
            }}
          >
            {f}
          </div>
        ))}
      </div>

      {/* Cards */}
      <div style={{ padding:"0 20px 100px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"64px 20px" }}>
            <div style={{ fontSize:56, marginBottom:18 }}>🩺</div>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>No scans yet</div>
            <div style={{ fontSize:12, color:"#8BA4C8", marginBottom:28, lineHeight:1.6 }}>
              {filter === "All"
                ? "Take your first scan to start tracking your skin health."
                : `No ${filter.toLowerCase()} found. Try a different filter.`}
            </div>
            {filter === "All" && (
              <button
                onClick={() => navigate("/scan")}
                className="ds-pressable"
                style={{ padding:"13px 28px", background:"linear-gradient(135deg,#2563EB,#1d4ed8)", border:"none", borderRadius:14, color:"white", fontWeight:700, fontSize:14, cursor:"pointer" }}
              >
                📷 Take Your First Scan
              </button>
            )}
          </div>
        ) : (
          <div className="ds-history-grid ds-stagger">
            {filtered.map(scan => {
              const s = SEV[scan.severity] || SEV.low;
              const healing = scan.healingPercent ?? 0;
              const isExpanded = expandedId === scan.id;
              return (
                <div
                  key={scan.id}
                  onClick={() => toggleExpand(scan.id)}
                  className="ds-pressable"
                  style={{ ...glass, borderRadius:18, padding:14, display:"flex", flexDirection:"column", gap:10, cursor:"pointer", position:"relative" }}
                >
                  {/* Delete button */}
                  <button
                    onClick={(e) => deleteOne(scan.id, e)}
                    style={{ position:"absolute", top:10, right:10, width:28, height:28, minHeight:"unset", borderRadius:"50%", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.18)", color:"#EF4444", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", zIndex:1, padding:0 }}
                  >
                    🗑️
                  </button>

                  {/* Thumbnail */}
                  <div style={{ width:"100%", height:120, borderRadius:12, overflow:"hidden", background:"#1A2D50", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {scan.imageUrl
                      ? <img src={scan.imageUrl} alt="scan" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                      : <span style={{ fontSize:34 }}>🖼️</span>
                    }
                  </div>

                  {/* Meta */}
                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4, paddingRight:34 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:"white", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginRight:8 }}>
                        {scan.condition || "Scan"}
                      </div>
                      <div style={{ fontSize:10, fontWeight:700, color:s.color, background:s.bg, border:`1px solid ${s.color}44`, borderRadius:20, padding:"2px 8px", flexShrink:0 }}>
                        {s.label}
                      </div>
                    </div>
                    <div style={{ fontSize:11, color:"#8BA4C8", marginBottom:8 }}>{scan.date}</div>

                    {/* Progress bar */}
                    <div style={{ height:5, background:"rgba(37,99,235,0.1)", borderRadius:4, overflow:"hidden", marginBottom:5 }}>
                      <div style={{ height:"100%", width:`${healing}%`, background:"linear-gradient(90deg,#2563EB,#10B981)", borderRadius:4 }} />
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom: isExpanded ? 10 : 0 }}>
                      <div style={{ fontSize:10, color:"#8BA4C8" }}>{healing}% healed</div>
                      <div style={{ fontSize:10, color:"#2563EB", fontWeight:600 }}>
                        {isExpanded ? "▲ Hide" : "▼ Details"}
                      </div>
                    </div>

                    {/* Expanded: full AI result */}
                    {isExpanded && scan.result && (
                      <div style={{ borderTop:"1px solid rgba(37,99,235,0.1)", paddingTop:10 }}>
                        <div style={{ fontSize:10, fontWeight:700, color:"#2563EB", marginBottom:6 }}>📋 AI Analysis</div>
                        <div style={{ fontSize:11, color:"#C8DEFF", lineHeight:1.7 }}>{scan.result}</div>
                        <div style={{ fontSize:9, color:"#8BA4C8", marginTop:8, fontStyle:"italic" }}>
                          ⚠️ Not a medical diagnosis. Consult a professional.
                        </div>
                      </div>
                    )}
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
