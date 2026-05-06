import { useNavigate } from "react-router-dom";

const glass = {
  background: "rgba(15,31,61,0.72)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid rgba(100,160,255,0.15)",
};

export default function Home() {
  const navigate  = useNavigate();
  const openChat  = () => window.dispatchEvent(new CustomEvent("open-chat"));

  return (
    <div className="ds-fade" style={{ minHeight: "100vh", padding: "20px 20px 100px" }}>
      <div className="ds-home-grid">

        {/* ── LEFT PANEL ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Brand card */}
          <div style={{ ...glass, borderRadius: 22, padding: "22px 24px", display: "flex", alignItems: "center", gap: 18, background: "linear-gradient(135deg,rgba(21,101,192,0.6),rgba(13,33,68,0.8))", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
            <div style={{ width: 58, height: 58, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#9F67FF)", flexShrink: 0, boxShadow: "0 0 24px rgba(124,58,237,0.45)" }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 22, color: "white", letterSpacing: 2 }}>DERM SCAN</div>
              <div style={{ fontSize: 10, color: "#42A5F5", letterSpacing: 3, marginTop: 2 }}>AI SKIN INTELLIGENCE</div>
            </div>
          </div>

          {/* Stats row */}
          <div className="ds-stagger" style={{ display: "flex", gap: 10 }}>
            {[
              { value: "98%", label: "Accuracy",  icon: "🎯" },
              { value: "24/7", label: "Available", icon: "⚡" },
              { value: "<5s",  label: "Results",   icon: "🚀" },
            ].map(s => (
              <div key={s.label} style={{ ...glass, flex: 1, borderRadius: 16, padding: "14px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 16, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#42A5F5" }}>{s.value}</div>
                <div style={{ fontSize: 9, color: "#8BA4C8", marginTop: 2, letterSpacing: 0.5 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Wellness tip */}
          <div style={{ background: "linear-gradient(135deg,rgba(16,185,129,0.12),rgba(21,101,192,0.12))", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 18, padding: "16px 18px", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#6EE7B7", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              🧘 Daily Wellness Tip
            </div>
            <div style={{ fontSize: 12, color: "#8BA4C8", lineHeight: 1.7 }}>
              Skin health and stress are deeply connected. A few slow deep breaths can reduce cortisol levels that contribute to flare-ups.
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Feature list */}
          <div style={{ ...glass, borderRadius: 20, overflow: "hidden" }}>
            {[
              { icon: "🔬", label: "Skin Scan",       sub: "Analyze with AI",           action: () => navigate("/scan"),    color: "#42A5F5" },
              { icon: "📈", label: "Healing Tracker",  sub: "Monitor your progress",     action: () => navigate("/history"), color: "#7C3AED" },
              { icon: "💬", label: "Ask DermBot",      sub: "Chat with AI assistant",    action: openChat,                   color: "#9F67FF" },
              { icon: "👑", label: "Premium",          sub: "Unlock advanced features",  action: () => alert("Premium coming soon!"), color: "#F59E0B" },
            ].map((item, i, arr) => (
              <div
                key={item.label}
                onClick={item.action}
                className="ds-pressable"
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "15px 16px", cursor: "pointer",
                  borderBottom: i < arr.length - 1 ? "1px solid rgba(100,160,255,0.07)" : "none",
                  transition: "background 0.15s",
                  animation: `dsIn 0.4s ease ${0.05 + i * 0.07}s both`,
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(66,165,245,0.05)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ width: 42, height: 42, borderRadius: 13, background: `${item.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0, border: `1px solid ${item.color}25` }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "#8BA4C8", marginTop: 2 }}>{item.sub}</div>
                </div>
                <div style={{ color: "#42A5F5", fontSize: 18, opacity: 0.6 }}>›</div>
              </div>
            ))}
          </div>

          {/* Healing journey */}
          <div style={{ ...glass, borderRadius: 18, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>📸 Healing Journey</div>
              <div
                onClick={() => navigate("/scan")}
                className="ds-pressable"
                style={{ fontSize: 11, color: "#42A5F5", cursor: "pointer", background: "rgba(66,165,245,0.1)", border: "1px solid rgba(66,165,245,0.2)", borderRadius: 20, padding: "4px 14px", fontWeight: 600 }}
              >
                + Add
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {["May 2", "Apr 28", "Apr 21"].map(date => (
                <div key={date} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ height: 76, borderRadius: 12, background: "linear-gradient(135deg,rgba(21,101,192,0.15),rgba(124,58,237,0.15))", border: "1px dashed rgba(100,160,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 6 }}>
                    🖼️
                  </div>
                  <div style={{ fontSize: 10, color: "#8BA4C8" }}>{date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
