import { useState } from "react";

const SLIDES = [
  {
    icon: "🔬",
    gradient: "linear-gradient(135deg,#7C3AED,#1565C0)",
    glow: "rgba(124,58,237,0.35)",
    accent: "#42A5F5",
    title: "AI Skin Analysis",
    desc: "Take a photo of any skin concern and get instant AI-powered analysis in under 5 seconds.",
  },
  {
    icon: "📈",
    gradient: "linear-gradient(135deg,#1565C0,#10B981)",
    glow: "rgba(21,101,192,0.35)",
    accent: "#10B981",
    title: "Track Your Healing",
    desc: "Monitor your skin's progress over time. Every scan builds your personal healing timeline.",
  },
  {
    icon: "💬",
    gradient: "linear-gradient(135deg,#9F67FF,#7C3AED)",
    glow: "rgba(159,103,255,0.35)",
    accent: "#9F67FF",
    title: "Chat with DermBot",
    desc: "Get personalized skin health advice from our AI assistant, available 24/7 — completely free.",
  },
  {
    icon: "🛡️",
    gradient: "linear-gradient(135deg,#F59E0B,#10B981)",
    glow: "rgba(245,158,11,0.3)",
    accent: "#F59E0B",
    title: "100% Private & Free",
    desc: "All your data stays on your device. No account required. Nothing ever leaves your phone.",
  },
];

export default function Onboarding({ onDone }) {
  const [idx, setIdx]             = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [dir, setDir]             = useState(1);

  const go = (next) => {
    setDir(next > idx ? 1 : -1);
    setIdx(next);
  };

  const advance = () => {
    if (idx < SLIDES.length - 1) go(idx + 1);
    else onDone();
  };

  const handleTouchStart = e => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd   = e => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 50 && idx < SLIDES.length - 1) go(idx + 1);
    if (diff < -50 && idx > 0) go(idx - 1);
    setTouchStart(null);
  };

  const slide = SLIDES[idx];

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "#0A1628",
        display: "flex", flexDirection: "column",
        fontFamily: "system-ui,-apple-system,sans-serif",
        userSelect: "none",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Skip */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "20px 24px", flexShrink: 0 }}>
        <div
          onClick={onDone}
          style={{ fontSize: 13, color: "#8BA4C8", cursor: "pointer", padding: "6px 14px", borderRadius: 20, background: "rgba(100,160,255,0.08)" }}
        >
          Skip
        </div>
      </div>

      {/* Slide content */}
      <div
        key={idx}
        style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "0 40px",
          animation: `slideIn${dir > 0 ? "R" : "L"} 0.4s cubic-bezier(0.22,1,0.36,1) both`,
        }}
      >
        {/* Icon */}
        <div style={{
          width: 130, height: 130, borderRadius: "50%",
          background: slide.gradient,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 56, marginBottom: 40,
          boxShadow: `0 0 0 20px rgba(10,22,40,0.8), 0 0 70px ${slide.glow}`,
        }}>
          {slide.icon}
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: "white", marginBottom: 16, letterSpacing: 0.3 }}>
            {slide.title}
          </div>
          <div style={{ fontSize: 15, color: "#8BA4C8", lineHeight: 1.75, maxWidth: 300 }}>
            {slide.desc}
          </div>
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20, flexShrink: 0 }}>
        {SLIDES.map((_, i) => (
          <div
            key={i}
            onClick={() => go(i)}
            style={{
              height: 8, borderRadius: 4, cursor: "pointer",
              width: i === idx ? 28 : 8,
              background: i === idx ? slide.accent : "rgba(100,160,255,0.2)",
              transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          />
        ))}
      </div>

      {/* CTA button */}
      <div style={{ padding: "0 24px 52px", flexShrink: 0 }}>
        <button
          onClick={advance}
          style={{
            width: "100%", padding: "17px 0",
            background: slide.gradient,
            border: "none", borderRadius: 16,
            color: "white", fontWeight: 700, fontSize: 16,
            cursor: "pointer", letterSpacing: 0.3,
            boxShadow: `0 8px 32px ${slide.glow}`,
            transition: "transform 0.1s, box-shadow 0.2s",
          }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
          onTouchStart={e => e.currentTarget.style.transform = "scale(0.97)"}
          onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
        >
          {idx === SLIDES.length - 1 ? "Get Started 🚀" : "Continue →"}
        </button>
      </div>

    </div>
  );
}
