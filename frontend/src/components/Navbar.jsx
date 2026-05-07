import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { to:"/",        label:"Home",    end:true  },
  { to:"/history", label:"History", end:false },
  { to:"/profile", label:"Profile", end:false },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [hovLink, setHovLink] = useState(null);

  return (
    <>
      {/* ── DESKTOP TOP BAR ── */}
      <nav
        className="ds-nav-top"
        style={{
          position: "sticky", top: 0, zIndex: 400,
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          height: 64,
          background: "rgba(5,13,26,0.82)",
          borderBottom: "1px solid rgba(37,99,235,0.12)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}
        >
          <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#2563EB,#7C3AED)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, boxShadow:"0 0 16px rgba(37,99,235,0.4)" }}>
            🩺
          </div>
          <span style={{ color:"white", fontWeight:800, fontSize:16, letterSpacing:1.2 }}>
            DERM<span style={{ color:"#2563EB" }}>SCAN</span>
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display:"flex", gap:4 }}>
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onMouseEnter={() => setHovLink(to)}
              onMouseLeave={() => setHovLink(null)}
              style={({ isActive }) => ({
                position: "relative",
                color: isActive ? "white" : hovLink === to ? "white" : "#8BA4C8",
                textDecoration: "none",
                fontWeight: isActive ? 700 : 600,
                fontSize: 14,
                padding: "8px 16px",
                borderRadius: 8,
                transition: "color 0.18s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0,
              })}
            >
              {({ isActive }) => (
                <>
                  {label}
                  <span style={{
                    position: "absolute",
                    bottom: 4,
                    left: "50%",
                    transform: "translateX(-50%)",
                    height: 2,
                    width: isActive ? "60%" : hovLink === to ? "40%" : "0%",
                    background: "linear-gradient(90deg,#2563EB,#7C3AED)",
                    borderRadius: 2,
                    transition: "width 0.22s ease",
                    boxShadow: isActive ? "0 0 8px rgba(37,99,235,0.6)" : "none",
                  }} />
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Premium CTA */}
        <div
          onClick={() => alert("Premium coming soon!")}
          className="ds-pressable"
          style={{ background:"linear-gradient(135deg,#92400e,#F59E0B)", borderRadius:50, padding:"8px 18px", cursor:"pointer", fontSize:12, fontWeight:800, color:"#1a0a00", whiteSpace:"nowrap", boxShadow:"0 0 20px rgba(245,158,11,0.3)", letterSpacing:0.5 }}
          onMouseEnter={e => e.currentTarget.style.boxShadow="0 0 32px rgba(245,158,11,0.5)"}
          onMouseLeave={e => e.currentTarget.style.boxShadow="0 0 20px rgba(245,158,11,0.3)"}
        >
          👑 GO PREMIUM
        </div>
      </nav>

      {/* ── MOBILE BOTTOM BAR ── */}
      <nav
        className="ds-nav-bottom"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
          background: "rgba(5,13,26,0.92)",
          borderTop: "1px solid rgba(37,99,235,0.12)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "10px 16px 18px",
        }}
      >
        {[
          { to:"/",        icon:"🏠", label:"Home",    end:true  },
          { to:"/history", icon:"📊", label:"History", end:false },
        ].map(({ to, icon, label, end }) => (
          <NavLink key={to} to={to} end={end} style={({ isActive }) => ({
            display:"flex", flexDirection:"column", alignItems:"center", gap:3,
            fontSize:10, fontWeight:700, color: isActive ? "#2563EB" : "#8BA4C8",
            textDecoration:"none", minWidth:52, transition:"color 0.15s",
          })}>
            <span style={{ fontSize:22 }}>{icon}</span>
            {label}
          </NavLink>
        ))}

        {/* Center scan button */}
        <div
          onClick={() => navigate("/scan")}
          className="ds-pressable"
          style={{ width:58, height:58, borderRadius:"50%", background:"linear-gradient(135deg,#2563EB,#1d4ed8)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, cursor:"pointer", marginTop:-22, boxShadow:"0 0 28px rgba(37,99,235,0.7), 0 0 0 5px rgba(5,13,26,0.92)", border:"2px solid rgba(37,99,235,0.4)", flexShrink:0 }}
        >
          📷
        </div>

        <NavLink to="/profile" style={({ isActive }) => ({
          display:"flex", flexDirection:"column", alignItems:"center", gap:3,
          fontSize:10, fontWeight:700, color: isActive ? "#2563EB" : "#8BA4C8",
          textDecoration:"none", minWidth:52, transition:"color 0.15s",
        })}>
          <span style={{ fontSize:22 }}>👤</span>
          Profile
        </NavLink>

        <div
          onClick={() => alert("Premium coming soon!")}
          className="ds-pressable"
          style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, fontSize:10, fontWeight:700, color:"#F59E0B", minWidth:52, cursor:"pointer" }}
        >
          <span style={{ fontSize:22 }}>👑</span>
          Premium
        </div>
      </nav>
    </>
  );
}
