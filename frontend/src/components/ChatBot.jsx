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
    <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "10px 14px", background: "#0F1F3D", borderRadius: 12 }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#42A5F5",
            animation: "dsTyping 1.2s ease infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function ChatBot() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm DermBot. Ask me anything about skin health." },
  ]);
  const [input, setInput]     = useState("");
  const [typing, setTyping]   = useState(false);
  const bottomRef             = useRef();

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-chat", handler);
    return () => window.removeEventListener("open-chat", handler);
  }, []);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;

    if (!isSkinRelated(text)) {
      setMessages(m => [
        ...m,
        { from: "user", text },
        { from: "bot", text: "I'm specialized in skin health topics. Please ask me about skin conditions, care routines, or dermatology." },
      ]);
      setInput("");
      return;
    }

    setMessages(m => [...m, { from: "user", text }]);
    setInput("");
    setTyping(true);
    try {
      const res = await axios.post(
        "https://dermscan-2-production.up.railway.app/chat",
        { message: text },
        { headers: { "Content-Type": "application/json" } }
      );
      setTyping(false);
      setMessages(m => [...m, { from: "bot", text: res.data.reply }]);
    } catch {
      setTyping(false);
      setMessages(m => [...m, { from: "bot", text: "Connection error. Make sure the backend is running on https://dermscan-2-production.up.railway.app." }]);
    }
  };

  return (
    <>
      {/* FAB */}
      <div
        className="ds-chat-fab"
        onClick={() => setOpen(o => !o)}
        style={{
          width: 52, height: 52, borderRadius: "50%",
          background: "linear-gradient(135deg,#7C3AED,#9F67FF)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, cursor: "pointer",
          boxShadow: "0 4px 20px rgba(124,58,237,0.55)",
        }}
      >
        💬
      </div>

      {/* PANEL */}
      {open && (
        <div
          className="ds-chat-panel"
          style={{
            width: 300, maxHeight: 420,
            background: "#1A2D50",
            border: "1px solid rgba(124,58,237,0.3)",
            borderRadius: 20,
            display: "flex", flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
          }}
        >
          {/* Header */}
          <div style={{ background: "linear-gradient(135deg,#7C3AED,#1565C0)", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "white" }}>🩺 DermBot AI</div>
            <div onClick={() => setOpen(false)} style={{ cursor: "pointer", color: "rgba(255,255,255,0.7)", fontSize: 18, lineHeight: 1, padding: "0 2px" }}>✕</div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8, maxHeight: 275 }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                maxWidth: "85%", fontSize: 11, padding: "8px 10px", borderRadius: 12, lineHeight: 1.55,
                background: m.from === "bot" ? "#0F1F3D" : "linear-gradient(135deg,#1565C0,#7C3AED)",
                color: m.from === "bot" ? "#C8DEFF" : "white",
                marginLeft: m.from === "user" ? "auto" : 0,
              }}>
                {m.text}
              </div>
            ))}
            {typing && (
              <div style={{ maxWidth: "85%" }}>
                <TypingDots />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(100,160,255,0.15)", display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask about skin health…"
              style={{ flex: 1, background: "#0F1F3D", border: "1px solid rgba(100,160,255,0.15)", borderRadius: 20, padding: "8px 14px", color: "white", fontSize: 11, outline: "none" }}
            />
            <button onClick={send} style={{ width: 32, height: 32, borderRadius: "50%", background: "#7C3AED", border: "none", color: "white", cursor: "pointer", fontSize: 14, flexShrink: 0 }}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
