import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  background: "rgba(37,99,235,0.06)",
  border: "1px solid rgba(37,99,235,0.2)",
  borderRadius: 12,
  color: "white",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

export default function Auth() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/", { replace: true });
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/", { replace: true });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      if (tab === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const opts = phone ? { options: { data: { phone } } } : {};
        const { error } = await supabase.auth.signUp({ email, password, ...opts });
        if (error) throw error;
        setSuccess("Account created! Check your email to confirm, then sign in.");
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", background: "#050D1A" }}>

      {/* Background orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "15%", left: "10%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(37,99,235,0.14) 0%,transparent 70%)", animation: "orbFloat1 14s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "18%", right: "8%", width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(124,58,237,0.11) 0%,transparent 70%)", animation: "orbFloat2 17s ease-in-out infinite" }} />
      </div>

      {/* Card */}
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420, background: "rgba(13,27,46,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 24, padding: "36px 28px", boxShadow: "0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(37,99,235,0.06)" }}>

        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 30 }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: "linear-gradient(135deg,#2563EB,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: "0 0 32px rgba(37,99,235,0.55)", marginBottom: 14 }}>🩺</div>
          <div style={{ fontSize: 23, fontWeight: 800, color: "white", letterSpacing: 1.4 }}>
            DERM<span style={{ color: "#2563EB" }}>SCAN</span>
          </div>
          <div style={{ fontSize: 11, color: "#8BA4C8", marginTop: 5, letterSpacing: 0.6 }}>AI-Powered Skin Analysis</div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: "rgba(37,99,235,0.07)", borderRadius: 13, padding: 4, marginBottom: 26, border: "1px solid rgba(37,99,235,0.12)" }}>
          {["signin", "signup"].map(t => (
            <button
              key={t}
              type="button"
              onClick={() => { setTab(t); setError(null); setSuccess(null); }}
              style={{
                flex: 1, padding: "10px", border: "none", borderRadius: 10, cursor: "pointer",
                fontSize: 13, fontWeight: 700, transition: "all 0.22s",
                background: tab === t ? "linear-gradient(135deg,#2563EB,#1d4ed8)" : "transparent",
                color: tab === t ? "white" : "#8BA4C8",
                boxShadow: tab === t ? "0 4px 16px rgba(37,99,235,0.4)" : "none",
              }}
            >
              {t === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "rgba(37,99,235,0.55)"}
            onBlur={e => e.target.style.borderColor = "rgba(37,99,235,0.2)"}
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "rgba(37,99,235,0.55)"}
            onBlur={e => e.target.style.borderColor = "rgba(37,99,235,0.2)"}
          />
          {tab === "signup" && (
            <input
              type="tel"
              placeholder="Phone number (optional)"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "rgba(37,99,235,0.55)"}
              onBlur={e => e.target.style.borderColor = "rgba(37,99,235,0.2)"}
            />
          )}

          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", color: "#EF4444", fontSize: 12, lineHeight: 1.5 }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, padding: "10px 14px", color: "#10B981", fontSize: 12, lineHeight: 1.5 }}>
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "15px", border: "none", borderRadius: 14, color: "white", fontWeight: 700, fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s",
              background: loading ? "rgba(37,99,235,0.35)" : "linear-gradient(135deg,#2563EB,#1d4ed8)",
              boxShadow: loading ? "none" : "0 4px 28px rgba(37,99,235,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {loading
              ? <><div className="ds-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Loading…</>
              : tab === "signin" ? "Sign In →" : "Create Account →"
            }
          </button>
        </form>

        <div style={{ textAlign: "center", fontSize: 10, color: "rgba(139,164,200,0.4)", marginTop: 22 }}>
          🔒 Your health data stays secure and private
        </div>
      </div>
    </div>
  );
}
