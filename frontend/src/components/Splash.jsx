import { useEffect, useState } from "react";

export default function Splash({ onDone }) {
  const [phase, setPhase]     = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 800);

    let p = 0;
    const iv = setInterval(() => {
      p += 2.2;
      setProgress(Math.min(p, 100));
      if (p >= 100) clearInterval(iv);
    }, 55);

    const t3 = setTimeout(onDone, 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearInterval(iv); };
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "linear-gradient(160deg,#0D1F3C 0%,#0A1628 60%,#0D0A1F 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "system-ui,-apple-system,sans-serif",
    }}>
      {/* Background glow orbs */}
      <div style={{ position: "absolute", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.12) 0%,transparent 70%)", top: "30%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle,rgba(66,165,245,0.08) 0%,transparent 70%)", top: "60%", left: "60%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />

      {/* Logo circle */}
      <div style={{
        width: 108, height: 108, borderRadius: "50%",
        background: "linear-gradient(135deg,#7C3AED,#1565C0)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 38, fontWeight: 900, color: "white",
        boxShadow: "0 0 0 16px rgba(124,58,237,0.08), 0 0 60px rgba(124,58,237,0.35)",
        animation: "splashPop 0.7s cubic-bezier(0.34,1.56,0.64,1) both",
        marginBottom: 28, letterSpacing: -1,
      }}>
        DS
      </div>

      {/* App name */}
      <div style={{
        fontSize: 30, fontWeight: 800, color: "white", letterSpacing: 3,
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? "translateY(0)" : "translateY(14px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        marginBottom: 8,
      }}>
        DERM SCAN
      </div>

      {/* Tagline */}
      <div style={{
        fontSize: 11, color: "#42A5F5", letterSpacing: 5, textTransform: "uppercase",
        opacity: phase >= 1 ? 0.9 : 0,
        transform: phase >= 1 ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.5s ease 0.12s, transform 0.5s ease 0.12s",
        marginBottom: 64,
      }}>
        AI Skin Intelligence
      </div>

      {/* Progress bar */}
      <div style={{
        position: "absolute", bottom: 56, left: "50%", transform: "translateX(-50%)",
        width: 160,
        opacity: phase >= 2 ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}>
        <div style={{ height: 3, background: "rgba(100,160,255,0.12)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: "linear-gradient(90deg,#7C3AED,#42A5F5)",
            borderRadius: 4, transition: "width 0.055s linear",
          }} />
        </div>
        <div style={{ fontSize: 10, color: "rgba(139,164,200,0.7)", textAlign: "center", marginTop: 10, letterSpacing: 1 }}>
          LOADING
        </div>
      </div>

    </div>
  );
}
