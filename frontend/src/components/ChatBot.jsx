import { useState, useEffect, useRef } from "react";
import axios from "axios";

const SKIN_KEYWORDS = [
  "skin","rash","acne","eczema","dermatitis","wound","sore","blemish","lesion",
  "dermatolog","moistur","sunscreen","treatment","cream","itch","pimple",
  "blackhead","whitehead","sunburn","psoriasis","hive","infect","heal","scar",
  "symptom","spot","pore","dry","oily","sensitiv","inflam","pigment","spf",
  "irritat","condition","diagnos","bump","blister","cut","bruise","redness",
  "flare","breakout","sebum","clog","peel","flak","derma","skin care",
];

function isSkinRelated(text) {
  if (text.trim().length < 15) return true;
  const t = text.toLowerCase();
  return SKIN_KEYWORDS.some(k => t.includes(k));
}

function TypingDots() {
  return (
    <div style={{ display:"flex", gap:5, alignItems:"center", padding:"10px 14px", background:"rgba(13,27,46,0.9)", borderRadius:12 }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:"#2563EB", animation:"dsTyping 1.2s ease infinite", animationDelay:`${i*0.2}s` }} />
      ))}
    </div>
  );
}

export default function ChatBot() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    { from:"bot", text:"Hi! I'm DermBot. Ask me anything about skin health." },
  ]);
  const [input, setInput]   = useState("");
  const [typing, setTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const bottomRef = useRef();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-chat", handler);
    return () => window.removeEventListener("open-chat", handler);
  }, []);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, typing, open]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;

    if (!isSkinRelated(text)) {
      setMessages(m => [...m, { from:"user", text }, { from:"bot", text:"I'm specialized in skin health topics. Please ask me about skin conditions, care routines, or dermatology." }]);
      setInput("");
      return;
    }

    setMessages(m => [...m, { from:"user", text }]);
    setInput("");
    setTyping(true);
    try {
      const res = await axios.post(
        "https://dermscan-2-production.up.railway.app/chat",
        { message: text },
        { headers: { "Content-Type":"application/json" } }
      );
      setTyping(false);
      setMessages(m => [...m, { from:"bot", text:res.data.reply }]);
    } catch {
      setTyping(false);
      setMessages(m => [...m, { from:"bot", text:"Connection error. Please try again." }]);
    }
  };

  const mobilePanel = {
    position:"fixed", bottom:0, left:0, right:0, zIndex:500,
    background:"#0D1B2E",
    border:"1px solid rgba(37,99,235,0.25)",
    borderRadius:"20px 20px 0 0",
    display:"flex", flexDirection:"column",
    overflow:"hidden",
    boxShadow:"0 -8px 40px rgba(0,0,0,0.6)",
    maxHeight:"80vh",
    paddingBottom:"env(safe-area-inset-bottom,0px)",
  };
  const desktopPanel = {
    position:"fixed", bottom:96, right:12, zIndex:299,
    width:300, maxHeight:420,
    background:"#0D1B2E",
    border:"1px solid rgba(124,58,237,0.35)",
    borderRadius:20,
    display:"flex", flexDirection:"column",
    overflow:"hidden",
    boxShadow:"0 8px 40px rgba(0,0,0,0.5)",
  };

  return (
    <>
      {/* FAB */}
      <div
        className="ds-chat-fab"
        onClick={() => setOpen(o => !o)}
        style={{ width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,#7C3AED,#2563EB)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, cursor:"pointer", boxShadow:"0 4px 20px rgba(37,99,235,0.55)" }}
      >
        {open ? "✕" : "💬"}
      </div>

      {/* Mobile backdrop */}
      {open && isMobile && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:499 }} onClick={() => setOpen(false)} />
      )}

      {/* Panel */}
      {open && (
        <div style={isMobile ? mobilePanel : desktopPanel}>
          {/* Header */}
          <div style={{ background:"linear-gradient(135deg,#7C3AED,#2563EB)", padding:"13px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
            <div style={{ fontWeight:700, fontSize:14, color:"white" }}>🩺 DermBot AI</div>
            <div onClick={() => setOpen(false)} style={{ cursor:"pointer", color:"rgba(255,255,255,0.75)", fontSize:18, lineHeight:1, padding:"0 4px" }}>✕</div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", padding:14, display:"flex", flexDirection:"column", gap:8, WebkitOverflowScrolling:"touch" }}>
            {messages.map((m,i) => (
              <div key={i} style={{ maxWidth:"85%", fontSize:12, padding:"9px 12px", borderRadius:14, lineHeight:1.6, background:m.from==="bot"?"rgba(13,27,46,0.9)":"linear-gradient(135deg,#2563EB,#7C3AED)", color:m.from==="bot"?"#C8DEFF":"white", marginLeft:m.from==="user"?"auto":0 }}>
                {m.text}
              </div>
            ))}
            {typing && <div style={{ maxWidth:"85%" }}><TypingDots /></div>}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding:"10px 12px", borderTop:"1px solid rgba(37,99,235,0.15)", display:"flex", gap:8, flexShrink:0, background:"rgba(5,13,26,0.5)" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask about skin health…"
              style={{ flex:1, background:"rgba(13,27,46,0.9)", border:"1px solid rgba(37,99,235,0.2)", borderRadius:22, padding:"10px 16px", color:"white", fontSize:13, outline:"none", minWidth:0 }}
            />
            <button
              onClick={send}
              style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,#2563EB,#1d4ed8)", border:"none", color:"white", cursor:"pointer", fontSize:15, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
