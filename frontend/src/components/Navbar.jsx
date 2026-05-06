import { NavLink, useNavigate } from "react-router-dom";

const desktopLink = (isActive) => ({
  color: isActive ? "#42A5F5" : "#8BA4C8",
  textDecoration: "none",
  fontWeight: 600,
  fontSize: 14,
  padding: "7px 16px",
  borderRadius: 8,
  background: isActive ? "rgba(66,165,245,0.12)" : "transparent",
  transition: "color 0.15s, background 0.15s",
});

const mobileLink = (isActive) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 3,
  fontSize: 10,
  fontWeight: 600,
  color: isActive ? "#42A5F5" : "#8BA4C8",
  textDecoration: "none",
  minWidth: 52,
});

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <>
      {/* ── DESKTOP TOP BAR ── */}
      <div
        className="ds-nav-top"
        style={{
          position: "sticky", top: 0, zIndex: 400,
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          height: 60,
          background: "rgba(10,22,40,0.97)",
          borderBottom: "1px solid rgba(100,160,255,0.15)",
          backdropFilter: "blur(10px)",
        }}
      >
        <span style={{ color: "#42A5F5", fontWeight: 700, fontSize: 16, letterSpacing: 0.5, whiteSpace: "nowrap" }}>
          🩺 DermScan
        </span>

        <div style={{ display: "flex", gap: 4 }}>
          <NavLink to="/" end style={({ isActive }) => desktopLink(isActive)}>Home</NavLink>
          <NavLink to="/history" style={({ isActive }) => desktopLink(isActive)}>History</NavLink>
          <NavLink to="/profile" style={({ isActive }) => desktopLink(isActive)}>Profile</NavLink>
        </div>

        <div
          onClick={() => alert("Premium coming soon!")}
          style={{
            background: "linear-gradient(135deg,#92400e,#F59E0B)",
            borderRadius: 20, padding: "6px 16px",
            cursor: "pointer", fontSize: 12, fontWeight: 700,
            color: "#1a0a00", whiteSpace: "nowrap",
          }}
        >
          👑 PREMIUM
        </div>
      </div>

      {/* ── MOBILE BOTTOM BAR ── */}
      <div
        className="ds-nav-bottom"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
          background: "rgba(10,22,40,0.97)",
          borderTop: "1px solid rgba(100,160,255,0.15)",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "8px 16px 18px",
        }}
      >
        <NavLink to="/" end style={({ isActive }) => mobileLink(isActive)}>
          <span style={{ fontSize: 22 }}>🏠</span>
          Home
        </NavLink>

        <NavLink to="/history" style={({ isActive }) => mobileLink(isActive)}>
          <span style={{ fontSize: 22 }}>📊</span>
          History
        </NavLink>

        <div
          onClick={() => navigate("/scan")}
          style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "linear-gradient(135deg,#1565C0,#42A5F5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, cursor: "pointer",
            marginTop: -20,
            boxShadow: "0 0 22px rgba(66,165,245,0.55)",
            border: "3px solid rgba(10,22,40,0.97)",
            flexShrink: 0,
          }}
        >
          📷
        </div>

        <NavLink to="/profile" style={({ isActive }) => mobileLink(isActive)}>
          <span style={{ fontSize: 22 }}>👤</span>
          Profile
        </NavLink>
      </div>
    </>
  );
}
