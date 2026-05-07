import { useNavigate } from "react-router-dom";

const glass = {
  background: "rgba(15,31,61,0.72)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(100,160,255,0.15)",
};

const TICKER_ITEMS = [
  "98% Accuracy", "24/7 Available", "AI Powered", "Privacy First",
  "Instant Results", "Free to Use", "30+ Conditions", "Secure & Private",
];

const STEPS = [
  { emoji: "📸", title: "Take a Photo",    sub: "Capture the affected skin area using your camera or upload an image." },
  { emoji: "🤖", title: "AI Analyzes",     sub: "Claude AI examines your image across 30+ skin conditions instantly." },
  { emoji: "📋", title: "Get Guidance",    sub: "Receive a detailed report with severity rating and next steps." },
];

const CONDITIONS = [
  { emoji: "🔴", label: "Acne" },
  { emoji: "🌊", label: "Eczema" },
  { emoji: "❄️", label: "Psoriasis" },
  { emoji: "🌹", label: "Rosacea" },
  { emoji: "💢", label: "Hives" },
  { emoji: "💧", label: "Dry Skin" },
  { emoji: "🩹", label: "Cuts & Wounds" },
  { emoji: "🟤", label: "Bruises" },
  { emoji: "🔥", label: "Burns" },
  { emoji: "🍄", label: "Fungal Infection" },
  { emoji: "🦠", label: "Warts" },
  { emoji: "🔵", label: "Moles" },
  { emoji: "⚠️", label: "Melanoma Signs" },
  { emoji: "🌿", label: "Allergic Reactions" },
  { emoji: "🐝", label: "Insect Bites" },
  { emoji: "☀️", label: "Sunburn" },
  { emoji: "🌓", label: "Vitiligo" },
  { emoji: "🟫", label: "Hyperpigmentation" },
];

const WHY = [
  { icon: "⚡", title: "Instant Results",   sub: "AI analysis delivered in under 5 seconds, anytime, anywhere.",   color: "#F59E0B" },
  { icon: "🔒", title: "Private & Secure",  sub: "Your images are never stored on our servers. Full privacy.",      color: "#10B981" },
  { icon: "🩺", title: "Expert-Grade AI",   sub: "Powered by Claude, trained on thousands of dermatology cases.",  color: "#42A5F5" },
];

export default function Home() {
  const navigate = useNavigate();
  const openChat = () => window.dispatchEvent(new CustomEvent("open-chat"));

  return (
    <div className="ds-fade" style={{ minHeight: "100vh", color: "white" }}>

      {/* ── Marquee ticker ── */}
      <div style={{ background: "rgba(66,165,245,0.06)", borderBottom: "1px solid rgba(66,165,245,0.1)", padding: "9px 0", overflow: "hidden" }}>
        <div className="ds-ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0 26px", fontSize: 11, fontWeight: 700, color: "#42A5F5", whiteSpace: "nowrap", letterSpacing: 0.5 }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#42A5F5", flexShrink: 0 }} />
              {item}
            </span>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 20px 100px" }}>
        <div className="ds-home-grid">

          {/* ── LEFT PANEL ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Brand card */}
            <div style={{ borderRadius: 22, padding: "22px 24px", display: "flex", alignItems: "center", gap: 18, background: "linear-gradient(135deg,rgba(21,101,192,0.6),rgba(13,33,68,0.85))", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: "1px solid rgba(66,165,245,0.2)" }}>
              <div style={{ width: 58, height: 58, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#9F67FF)", flexShrink: 0, boxShadow: "0 0 24px rgba(124,58,237,0.5)" }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 22, color: "white", letterSpacing: 2 }}>DERM SCAN</div>
                <div style={{ fontSize: 10, color: "#42A5F5", letterSpacing: 3, marginTop: 2 }}>AI SKIN INTELLIGENCE</div>
              </div>
            </div>

            {/* Stats row */}
            <div className="ds-stagger" style={{ display: "flex", gap: 10 }}>
              {[
                { value: "98%",  label: "Accuracy",  icon: "🎯" },
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
            <div style={{ background: "linear-gradient(135deg,rgba(16,185,129,0.1),rgba(21,101,192,0.1))", border: "1px solid rgba(16,185,129,0.22)", borderRadius: 18, padding: "16px 18px", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
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
                { icon: "🔬", label: "Skin Scan",       sub: "Analyze with AI",          action: () => navigate("/scan"),    color: "#42A5F5" },
                { icon: "📈", label: "Healing Tracker", sub: "Monitor your progress",    action: () => navigate("/history"), color: "#7C3AED" },
                { icon: "💬", label: "Ask DermBot",     sub: "Chat with AI assistant",   action: openChat,                   color: "#9F67FF" },
                { icon: "👑", label: "Premium",         sub: "Unlock advanced features", action: () => alert("Premium coming soon!"), color: "#F59E0B" },
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
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(66,165,245,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ width: 42, height: 42, borderRadius: 13, background: `${item.color}1A`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0, border: `1px solid ${item.color}28` }}>
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
                    <div style={{ height: 76, borderRadius: 12, background: "linear-gradient(135deg,rgba(21,101,192,0.12),rgba(124,58,237,0.12))", border: "1px dashed rgba(100,160,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 6 }}>
                      🖼️
                    </div>
                    <div style={{ fontSize: 10, color: "#8BA4C8" }}>{date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <div style={{ marginTop: 40 }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "white", marginBottom: 6 }}>How It Works</div>
            <div style={{ fontSize: 12, color: "#8BA4C8" }}>Three simple steps to understand your skin</div>
          </div>
          <div className="ds-steps-grid ds-stagger">
            {STEPS.map((step, i) => (
              <div key={step.title} style={{ ...glass, borderRadius: 18, padding: "22px 18px", textAlign: "center", position: "relative" }}>
                {i < STEPS.length - 1 && (
                  <div style={{ display: "none", position: "absolute", right: -12, top: "50%", transform: "translateY(-50%)", color: "#42A5F5", fontSize: 18, opacity: 0.4 }}>›</div>
                )}
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,rgba(21,101,192,0.3),rgba(124,58,237,0.3))", border: "1px solid rgba(66,165,245,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 14px" }}>
                  {step.emoji}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#42A5F5", letterSpacing: 1, marginBottom: 6 }}>STEP {i + 1}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "white", marginBottom: 8 }}>{step.title}</div>
                <div style={{ fontSize: 11, color: "#8BA4C8", lineHeight: 1.7 }}>{step.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CONDITIONS WE DETECT ── */}
        <div style={{ marginTop: 40 }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "white", marginBottom: 6 }}>Conditions We Detect</div>
            <div style={{ fontSize: 12, color: "#8BA4C8" }}>AI-powered detection across a wide range of skin concerns</div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {CONDITIONS.map(c => (
              <div key={c.label} style={{ padding: "7px 15px", borderRadius: 20, background: "rgba(66,165,245,0.06)", border: "1px solid rgba(66,165,245,0.12)", fontSize: 12, color: "#C8DEFF", display: "inline-flex", alignItems: "center", gap: 6, transition: "background 0.15s" }}>
                <span>{c.emoji}</span>
                {c.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── WHY DERMSCAN ── */}
        <div style={{ marginTop: 40 }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "white", marginBottom: 6 }}>Why DermScan?</div>
            <div style={{ fontSize: 12, color: "#8BA4C8" }}>Built with care for your skin health journey</div>
          </div>
          <div className="ds-why-grid ds-stagger">
            {WHY.map(w => (
              <div key={w.title} style={{ ...glass, borderRadius: 18, padding: "20px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 30, marginBottom: 12 }}>{w.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: w.color, marginBottom: 8 }}>{w.title}</div>
                <div style={{ fontSize: 11, color: "#8BA4C8", lineHeight: 1.7 }}>{w.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ marginTop: 48, textAlign: "center", borderTop: "1px solid rgba(100,160,255,0.08)", paddingTop: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#42A5F5", letterSpacing: 2, marginBottom: 6 }}>DERM SCAN</div>
          <div style={{ fontSize: 10, color: "rgba(100,160,255,0.35)", marginBottom: 10 }}>AI SKIN INTELLIGENCE</div>
          <div style={{ fontSize: 10, color: "rgba(100,160,255,0.25)", lineHeight: 1.8 }}>
            For informational purposes only. Not a substitute for professional medical advice.<br />
            Always consult a licensed healthcare professional for diagnosis and treatment.
          </div>
        </div>
      </div>
    </div>
  );
}
