import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CARD = {
  background: "rgba(13,27,46,0.85)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(37,99,235,0.14)",
};

/* ── Hero orb config ── */
const ORBS = [
  { w:640, h:640, top:"-18%",  left:"-12%",  color:"rgba(37,99,235,0.20)",  anim:"orbFloat1 20s ease-in-out infinite" },
  { w:520, h:520, top:"15%",   right:"-14%", color:"rgba(124,58,237,0.16)", anim:"orbFloat2 25s ease-in-out infinite" },
  { w:420, h:420, bottom:"0%", left:"18%",   color:"rgba(37,99,235,0.13)",  anim:"orbFloat3 17s ease-in-out 2s infinite" },
  { w:320, h:320, top:"45%",   left:"42%",   color:"rgba(124,58,237,0.10)", anim:"orbFloat1 28s ease-in-out 1s infinite" },
  { w:260, h:260, top:"8%",    right:"28%",  color:"rgba(245,158,11,0.08)", anim:"orbFloat2 22s ease-in-out 3s infinite" },
  { w:200, h:200, bottom:"22%",right:"8%",   color:"rgba(37,99,235,0.10)",  anim:"orbFloat3 15s ease-in-out 0.5s infinite" },
];

const STEPS = [
  { n:"01", icon:"📸", title:"Take a Photo",  sub:"Capture the affected area with your camera or upload from your gallery." },
  { n:"02", icon:"🤖", title:"AI Analyzes",   sub:"Claude AI cross-references your image against 30+ skin conditions instantly." },
  { n:"03", icon:"📋", title:"Get Guidance",  sub:"Receive a detailed report — severity rating, what it means, and next steps." },
];

const CONDITIONS = [
  "🔴 Acne","🌊 Eczema","❄️ Psoriasis","🌹 Rosacea","💢 Hives","💧 Dry Skin",
  "🩹 Wounds","✂️ Cuts","🟤 Bruises","🔥 Burns","🍄 Fungal","🦠 Bacterial",
  "⚠️ Cancer Signs","🔬 Melanoma","🐝 Insect Bites","☀️ Sunburn","🌿 Allergies","🔵 Moles",
];

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/month",
    badge: null,
    icon: null,
    border: "rgba(37,99,235,0.3)",
    gradient: null,
    glow: "rgba(37,99,235,0.15)",
    buttonStyle: { background:"transparent", border:"1px solid rgba(37,99,235,0.5)", color:"#2563EB" },
    features: [
      "5 scans per month",
      "Basic AI analysis",
      "DermBot chat (10 messages)",
      "7-day history",
      "Standard speed",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: "$8.99",
    period: "/month",
    badge: "Most Popular",
    icon: null,
    gradient: "linear-gradient(135deg,#7C3AED,#2563EB)",
    glow: "rgba(124,58,237,0.25)",
    buttonStyle: { background:"linear-gradient(135deg,#7C3AED,#2563EB)", border:"none", color:"white" },
    features: [
      "50 scans per month",
      "Advanced AI analysis",
      "Unlimited DermBot",
      "90-day history",
      "Faster results",
      "Healing tracker",
      "Severity scoring",
      "Next steps guidance",
      "Email support",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$12.99",
    period: "/month",
    badge: "Best Value",
    icon: "👑",
    gradient: "linear-gradient(135deg,#F59E0B,#EF4444,#F59E0B)",
    gradientSize: "200% 100%",
    gradientAnim: "gradientShift 3s ease infinite",
    glow: "rgba(245,158,11,0.2)",
    buttonStyle: { background:"linear-gradient(135deg,#F59E0B,#EF4444)", border:"none", color:"white" },
    features: [
      "Unlimited scans",
      "Priority AI (under 3 seconds)",
      "Lifetime history",
      "PDF reports",
      "Cancer & melanoma detection",
      "Dermatologist directory",
      "Mental health tips",
      "Family account (4 members)",
      "24/7 priority support",
      "Early access to new features",
    ],
  },
];

const TESTIMONIALS = [
  {
    initials:"SM", color:"#2563EB",
    name:"Sarah M.", role:"Verified User",
    stars:5,
    quote:"DermScan flagged a suspicious mole I'd been ignoring for months. My dermatologist confirmed it needed immediate attention. I'm genuinely grateful this app exists — it may have saved my life.",
  },
  {
    initials:"JK", color:"#7C3AED",
    name:"James K.", role:"Premium Member",
    stars:5,
    quote:"I've struggled with eczema for years. DermScan helps me track flare-ups and understand my triggers. The healing tracker is incredible — I can finally see real progress over time.",
  },
  {
    initials:"PS", color:"#10B981",
    name:"Priya S.", role:"Standard Member",
    stars:5,
    quote:"As a mum of three, being able to check rashes at 2am without panicking is priceless. DermScan gives instant peace of mind. The AI analysis is surprisingly accurate and so easy to use.",
  },
];

const TICKER_ITEMS = [
  "98% Accuracy","24/7 Available","AI Powered","Privacy First",
  "Instant Results","Free to Use","30+ Conditions","HIPAA Compliant",
];

function StarRating({ n }) {
  return (
    <div style={{ display:"flex", gap:2 }}>
      {Array.from({length:n}).map((_,i) => (
        <span key={i} style={{ color:"#F59E0B", fontSize:14 }}>★</span>
      ))}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const openChat = () => window.dispatchEvent(new CustomEvent("open-chat"));
  const [hovPlan, setHovPlan] = useState(null);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

  return (
    <div style={{ minHeight:"100vh", color:"white", overflowX:"hidden" }}>

      {/* ══════════ HERO ══════════ */}
      <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", background:"linear-gradient(180deg,#050D1A 0%,#0D1B2E 60%,#050D1A 100%)", padding:"100px 24px 80px" }}>

        {/* Floating orbs */}
        {ORBS.map((o,i) => (
          <div key={i} style={{ position:"absolute", width:o.w, height:o.h, borderRadius:"50%", background:`radial-gradient(circle,${o.color},transparent 70%)`, animation:o.anim, top:o.top, left:o.left, right:o.right, bottom:o.bottom, filter:"blur(48px)", pointerEvents:"none", willChange:"transform" }} />
        ))}

        {/* Ticker */}
        <div style={{ position:"absolute", top:0, left:0, right:0, background:"rgba(37,99,235,0.06)", borderBottom:"1px solid rgba(37,99,235,0.12)", padding:"10px 0", overflow:"hidden" }}>
          <div className="ds-ticker-track">
            {[...TICKER_ITEMS,...TICKER_ITEMS].map((item,i) => (
              <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"0 28px", fontSize:11, fontWeight:700, color:"#2563EB", whiteSpace:"nowrap", letterSpacing:0.8 }}>
                <span style={{ width:4, height:4, borderRadius:"50%", background:"#2563EB", flexShrink:0 }} />{item}
              </span>
            ))}
          </div>
        </div>

        {/* Hero content */}
        <div style={{ position:"relative", zIndex:2, textAlign:"center", maxWidth:720, animation:"fadeInUp 0.8s ease both" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 18px", borderRadius:50, background:"rgba(37,99,235,0.1)", border:"1px solid rgba(37,99,235,0.3)", fontSize:11, color:"#2563EB", fontWeight:700, marginBottom:28, letterSpacing:1.2 }}>
            ✦ POWERED BY CLAUDE AI · HIPAA COMPLIANT
          </div>

          <h1 style={{ fontSize:"clamp(40px,8vw,76px)", fontWeight:900, color:"white", lineHeight:1.08, marginBottom:20, letterSpacing:-1.5 }}>
            Your Skin.
            <br />
            <span style={{ position:"relative", display:"inline-block" }}>
              Analyzed by AI.
              <div style={{ position:"absolute", bottom:-6, left:0, right:0, height:4, background:"linear-gradient(90deg,#2563EB,#7C3AED,#2563EB)", backgroundSize:"200% 100%", borderRadius:4, animation:"glowLine 3s ease-in-out infinite", boxShadow:"0 0 20px rgba(37,99,235,0.6)" }} />
            </span>
          </h1>

          <p style={{ fontSize:"clamp(15px,2.5vw,19px)", color:"#8BA4C8", lineHeight:1.75, maxWidth:520, margin:"0 auto 44px" }}>
            Instant diagnosis. Personalized guidance. Available 24/7.
          </p>

          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button
              onClick={() => navigate("/scan")}
              className="ds-pressable"
              style={{ padding:"16px 38px", background:"linear-gradient(135deg,#2563EB,#1d4ed8)", border:"none", borderRadius:50, color:"white", fontWeight:800, fontSize:16, cursor:"pointer", boxShadow:"0 0 40px rgba(37,99,235,0.5), 0 4px 20px rgba(37,99,235,0.35)", letterSpacing:0.3 }}
              onMouseEnter={e => e.currentTarget.style.boxShadow="0 0 64px rgba(37,99,235,0.7), 0 6px 28px rgba(37,99,235,0.5)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow="0 0 40px rgba(37,99,235,0.5), 0 4px 20px rgba(37,99,235,0.35)"}
            >
              🔬 Scan Now — It's Free
            </button>
            <button
              onClick={() => scrollTo("pricing")}
              className="ds-pressable"
              style={{ padding:"16px 32px", background:"transparent", border:"1px solid rgba(255,255,255,0.2)", borderRadius:50, color:"white", fontWeight:700, fontSize:15, cursor:"pointer", backdropFilter:"blur(8px)" }}
              onMouseEnter={e => e.currentTarget.style.borderColor="rgba(37,99,235,0.6)"}
              onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.2)"}
            >
              View Plans ↓
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position:"absolute", bottom:32, display:"flex", flexDirection:"column", alignItems:"center", gap:6, animation:"fadeIn 1s ease 2s both" }}>
          <div style={{ fontSize:10, color:"rgba(100,160,255,0.35)", letterSpacing:1.5 }}>SCROLL TO EXPLORE</div>
          <div style={{ width:1, height:36, background:"linear-gradient(180deg,rgba(37,99,235,0.5),transparent)" }} />
        </div>
      </section>

      {/* ══════════ STATS ══════════ */}
      <section className="ds-section" style={{ padding:"72px 24px", background:"#050D1A" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:20 }}>
          {[
            { v:"98%",  l:"AI Accuracy",    i:"🎯", d:"Validated against clinical outcomes",          c:"#2563EB" },
            { v:"24/7", l:"Always On",      i:"⚡", d:"No appointments, no waiting rooms",            c:"#7C3AED" },
            { v:"<5s",  l:"Instant Results",i:"🚀", d:"Faster than any clinic visit",                 c:"#10B981" },
            { v:"30+",  l:"Conditions",     i:"🩺", d:"From acne to melanoma warning signs",          c:"#F59E0B" },
          ].map(s => (
            <div key={s.l} className="ds-stat-card ds-pressable" style={{ ...CARD, borderRadius:20, padding:"28px 20px", textAlign:"center", boxShadow:`0 0 0 0 ${s.c}` }}>
              <div style={{ fontSize:28, marginBottom:12 }}>{s.i}</div>
              <div style={{ fontSize:36, fontWeight:900, color:s.c, lineHeight:1, marginBottom:6 }}>{s.v}</div>
              <div style={{ fontSize:14, fontWeight:700, color:"white", marginBottom:6 }}>{s.l}</div>
              <div style={{ fontSize:11, color:"#8BA4C8", lineHeight:1.6 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section className="ds-section-delay1" id="how" style={{ padding:"80px 24px", background:"linear-gradient(180deg,#050D1A,#0D1B2E)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#2563EB", letterSpacing:2, marginBottom:12 }}>HOW IT WORKS</div>
            <div style={{ fontSize:"clamp(26px,4vw,40px)", fontWeight:900, color:"white", marginBottom:12 }}>Three steps to clarity</div>
            <div style={{ fontSize:15, color:"#8BA4C8", maxWidth:460, margin:"0 auto" }}>No doctor visit required. Results in under 5 seconds.</div>
          </div>

          <div className="ds-steps-grid">
            {STEPS.map((step, i) => (
              <div key={step.n} style={{ position:"relative" }}>
                <div style={{ ...CARD, borderRadius:22, padding:"32px 24px", textAlign:"center", height:"100%", transition:"transform 0.25s ease, box-shadow 0.25s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.boxShadow="0 20px 48px rgba(37,99,235,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}
                >
                  <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:56, height:56, borderRadius:"50%", background:"linear-gradient(135deg,rgba(37,99,235,0.25),rgba(124,58,237,0.2))", border:"1px solid rgba(37,99,235,0.3)", fontSize:24, marginBottom:16 }}>
                    {step.icon}
                  </div>
                  <div style={{ fontSize:11, fontWeight:800, color:"#2563EB", letterSpacing:2, marginBottom:8 }}>STEP {step.n}</div>
                  <div style={{ fontSize:18, fontWeight:800, color:"white", marginBottom:10 }}>{step.title}</div>
                  <div style={{ fontSize:13, color:"#8BA4C8", lineHeight:1.75 }}>{step.sub}</div>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ display:"none", position:"absolute", top:"50%", right:-22, transform:"translateY(-50%)", color:"rgba(37,99,235,0.4)", fontSize:20, fontWeight:300 }}>›</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CONDITIONS ══════════ */}
      <section className="ds-section-delay2" style={{ padding:"80px 24px", background:"#050D1A" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#2563EB", letterSpacing:2, marginBottom:12 }}>WHAT WE DETECT</div>
            <div style={{ fontSize:"clamp(26px,4vw,40px)", fontWeight:900, color:"white", marginBottom:12 }}>Conditions we analyze</div>
            <div style={{ fontSize:15, color:"#8BA4C8" }}>AI-powered detection across a wide spectrum of skin concerns</div>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center" }}>
            {CONDITIONS.map(c => (
              <div key={c} className="ds-pressable" style={{ padding:"9px 18px", borderRadius:50, background:"rgba(37,99,235,0.06)", border:"1px solid rgba(37,99,235,0.15)", fontSize:13, color:"#C8DEFF", transition:"all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(37,99,235,0.14)"; e.currentTarget.style.borderColor="rgba(37,99,235,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="rgba(37,99,235,0.06)"; e.currentTarget.style.borderColor="rgba(37,99,235,0.15)"; }}
              >
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ PRICING ══════════ */}
      <section id="pricing" className="ds-section-delay3" style={{ padding:"80px 24px 96px", background:"linear-gradient(180deg,#050D1A,#0D1B2E)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#2563EB", letterSpacing:2, marginBottom:12 }}>PRICING</div>
            <div style={{ fontSize:"clamp(26px,4vw,40px)", fontWeight:900, color:"white", marginBottom:14 }}>Simple, transparent pricing</div>
            <div style={{ fontSize:15, color:"#8BA4C8", maxWidth:480, margin:"0 auto" }}>Start free. Upgrade when you need more. Cancel anytime.</div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:24, alignItems:"start" }}>
            {PLANS.map(plan => {
              const isHov = hovPlan === plan.id;
              const inner = (
                <div style={{ background:"#0D1B2E", borderRadius: plan.gradient ? 20 : 22, padding:"32px 28px", height:"100%", display:"flex", flexDirection:"column" }}>
                  {/* Badge */}
                  {plan.badge && (
                    <div style={{ display:"inline-flex", alignSelf:"flex-start", alignItems:"center", gap:6, padding:"4px 12px", borderRadius:50, background: plan.icon?"linear-gradient(135deg,rgba(245,158,11,0.2),rgba(239,68,68,0.15))":"rgba(124,58,237,0.15)", border: plan.icon?"1px solid rgba(245,158,11,0.4)":"1px solid rgba(124,58,237,0.4)", fontSize:10, fontWeight:800, color: plan.icon?"#F59E0B":"#A78BFA", letterSpacing:0.8, marginBottom:16 }}>
                      {plan.icon && <span>{plan.icon}</span>}{plan.badge.toUpperCase()}
                    </div>
                  )}
                  {/* Plan name */}
                  <div style={{ fontSize:22, fontWeight:800, color:"white", marginBottom:4 }}>{plan.name}</div>
                  {/* Price */}
                  <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:24 }}>
                    <span style={{ fontSize:42, fontWeight:900, color: plan.id==="premium"?"#F59E0B": plan.id==="standard"?"#A78BFA":"white" }}>{plan.price}</span>
                    <span style={{ fontSize:14, color:"#8BA4C8" }}>{plan.period}</span>
                  </div>
                  {/* Features */}
                  <div style={{ display:"flex", flexDirection:"column", gap:10, flex:1, marginBottom:28 }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                        <span style={{ color: plan.id==="premium"?"#F59E0B": plan.id==="standard"?"#A78BFA":"#2563EB", fontSize:14, flexShrink:0, marginTop:1 }}>✓</span>
                        <span style={{ fontSize:13, color:"#C8DEFF", lineHeight:1.5 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  {/* CTA */}
                  <button
                    className="ds-pressable"
                    onClick={() => plan.id === "free" ? navigate("/scan") : alert(`${plan.name} plan coming soon!`)}
                    style={{ width:"100%", padding:"14px", borderRadius:14, fontWeight:700, fontSize:14, cursor:"pointer", transition:"box-shadow 0.2s ease", ...plan.buttonStyle }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow=`0 0 24px ${plan.glow}`}
                    onMouseLeave={e => e.currentTarget.style.boxShadow="none"}
                  >
                    {plan.id === "free" ? "Get Started Free" : `Get ${plan.name}`}
                  </button>
                </div>
              );

              return plan.gradient ? (
                <div key={plan.id} className="ds-price-card"
                  onMouseEnter={() => setHovPlan(plan.id)}
                  onMouseLeave={() => setHovPlan(null)}
                  style={{ borderRadius:22, padding:2, background:plan.gradient, backgroundSize: plan.gradientSize||"100% 100%", animation: plan.gradientAnim||"none", boxShadow: isHov ? `0 24px 56px ${plan.glow}, 0 0 40px ${plan.glow}` : `0 8px 32px ${plan.glow}`, transition:"box-shadow 0.25s ease" }}
                >
                  {inner}
                </div>
              ) : (
                <div key={plan.id} className="ds-price-card"
                  onMouseEnter={() => setHovPlan(plan.id)}
                  onMouseLeave={() => setHovPlan(null)}
                  style={{ ...CARD, borderRadius:22, border:`1px solid ${plan.border}`, boxShadow: isHov ? `0 20px 48px ${plan.glow}` : "none", transition:"box-shadow 0.25s ease, transform 0.25s ease" }}
                >
                  {inner}
                </div>
              );
            })}
          </div>

          {/* HIPAA note */}
          <div style={{ textAlign:"center", marginTop:32, fontSize:12, color:"#8BA4C8", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            <span style={{ color:"#10B981" }}>🔒</span>
            All plans include end-to-end encryption and HIPAA-compliant data storage.
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section className="ds-section-delay4" style={{ padding:"80px 24px", background:"#050D1A" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#2563EB", letterSpacing:2, marginBottom:12 }}>TESTIMONIALS</div>
            <div style={{ fontSize:"clamp(26px,4vw,40px)", fontWeight:900, color:"white", marginBottom:12 }}>Trusted by thousands</div>
            <div style={{ fontSize:15, color:"#8BA4C8" }}>Real people. Real results. Real peace of mind.</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ ...CARD, borderRadius:22, padding:"28px 24px", transition:"transform 0.25s ease, box-shadow 0.25s ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.boxShadow=`0 20px 48px rgba(37,99,235,0.18)`; }}
                onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}
              >
                <StarRating n={t.stars} />
                <p style={{ fontSize:13, color:"#C8DEFF", lineHeight:1.8, margin:"16px 0 20px", fontStyle:"italic" }}>
                  "{t.quote}"
                </p>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg,${t.color},${t.color}99)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:"white", flexShrink:0 }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:"white" }}>{t.name}</div>
                    <div style={{ fontSize:11, color:"#8BA4C8", marginTop:2 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="ds-section-delay5" style={{ background:"#0D1B2E", borderTop:"1px solid rgba(37,99,235,0.12)", padding:"48px 24px 100px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20 }}>
            {/* Logo */}
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#2563EB,#7C3AED)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🩺</div>
              <div>
                <div style={{ fontSize:18, fontWeight:900, color:"white", letterSpacing:1.5 }}>DERMSCAN</div>
                <div style={{ fontSize:10, color:"#2563EB", letterSpacing:2, marginTop:1 }}>Powered by Claude AI</div>
              </div>
            </div>
            {/* Links */}
            <div style={{ display:"flex", gap:28, flexWrap:"wrap", justifyContent:"center" }}>
              {["Privacy Policy","Terms of Service","Contact"].map(l => (
                <span key={l} className="ds-pressable" onClick={() => alert(`${l} coming soon.`)} style={{ fontSize:13, color:"#8BA4C8", cursor:"pointer", transition:"color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.color="#2563EB"}
                  onMouseLeave={e => e.currentTarget.style.color="#8BA4C8"}
                >
                  {l}
                </span>
              ))}
            </div>
            {/* Copyright */}
            <div style={{ fontSize:12, color:"rgba(100,160,255,0.3)", textAlign:"center" }}>
              © 2026 DermScan. For informational purposes only. Not a substitute for professional medical advice.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
