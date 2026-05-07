import { useState, useEffect, useRef } from "react";

const haptic = (p = 12) => navigator.vibrate?.(p);

const glass = {
  background: "rgba(15,31,61,0.72)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid rgba(100,160,255,0.15)",
};

function getSeverity(text) {
  const t = text.toLowerCase();
  if (t.includes("severe")||t.includes("urgent")||t.includes("immediately")||t.includes("serious")||t.includes("emergency"))
    return { label:"high",   display:"High",     color:"#EF4444", bg:"rgba(239,68,68,0.15)"  };
  if (t.includes("moderate")||t.includes("consult")||t.includes("monitor")||t.includes("concerning")||t.includes("persistent"))
    return { label:"medium", display:"Moderate", color:"#F59E0B", bg:"rgba(245,158,11,0.15)" };
  return   { label:"low",    display:"Low",      color:"#10B981", bg:"rgba(16,185,129,0.15)" };
}


export default function Scan() {
  const [mode, setMode]             = useState("camera");
  const [facingMode, setFacingMode] = useState("environment");
  const [flashOn, setFlashOn]       = useState(false);
  const [preview, setPreview]       = useState(null);
  const [base64, setBase64]         = useState(null);
  const [blob, setBlob]             = useState(null);
  const [result, setResult]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [camError, setCamError]     = useState(null);
  const [flash, setFlash]           = useState(false);

  const videoRef  = useRef();
  const streamRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    if (mode !== "camera") return;
    let active = true;
    const start = async () => {
      setCamError(null);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (!active) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        if (active) setCamError("Camera access denied or unavailable.");
      }
    };
    start();
    return () => {
      active = false;
      if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    };
  }, [mode, facingMode]);

  const toggleFlash = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    try { await track.applyConstraints({ advanced: [{ torch: !flashOn }] }); setFlashOn(f => !f); }
    catch { alert("Flash not supported on this device."); }
  };

  const capture = () => {
    haptic(15);
    setFlash(true);
    setTimeout(() => setFlash(false), 300);
    const video = videoRef.current, canvas = canvasRef.current;
    const maxW = 800, vw = video.videoWidth || 640, vh = video.videoHeight || 480;
    const w = Math.min(vw, maxW), h = Math.round((w / vw) * vh);
    canvas.width = w; canvas.height = h;
    canvas.getContext("2d").drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
    setBase64(dataUrl);
    canvas.toBlob(b => {
      setBlob(b);
      setPreview(URL.createObjectURL(b));
      if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
      setMode("preview");
    }, "image/jpeg", 0.75);
  };

  const analyze = async () => {
    if (!blob) return;
    haptic([20, 30, 20]);
    setLoading(true);
    const form = new FormData();
    form.append("file", blob, "scan.jpg");
    console.log("[DermScan] Sending image to /analyze —", blob.size, "bytes");
    try {
      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      console.log("[DermScan] /analyze response:", data);
      const text = data.result;
      const sev = getSeverity(text);
      const condition = text.split(/[.!?\n]/)[0].trim().slice(0, 100);
      const scan = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        imageUrl: base64,
        condition,
        severity: sev.label,
        result: text,
        healingPercent: 0,
      };
      const existing = JSON.parse(localStorage.getItem("dermscan_scans") || "[]");
      localStorage.setItem("dermscan_scans", JSON.stringify([scan, ...existing]));
      haptic([30, 20, 60]);
      setResult(text);
      setMode("result");
    } catch (err) {
      console.error("[DermScan] /analyze error:", err);
      setResult("Error connecting to backend. Make sure it is running on http://localhost:8000.");
      setMode("result");
    }
    setLoading(false);
  };

  const shareResult = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: "My DermScan Analysis",
        text: `${conditionTitle}\n\n${result}\n\n⚠️ Not a medical diagnosis. Always consult a healthcare professional.`,
      });
    } catch {}
  };

  const retake = () => { setPreview(null); setBlob(null); setBase64(null); setResult(null); setMode("camera"); };

  const sev = result ? getSeverity(result) : null;
  const conditionTitle = result ? result.split(/[.!?]/)[0].trim() : "";

  return (
    <div className="ds-fade" style={{ minHeight: "100vh", color: "white" }}>

      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(100,160,255,0.1)", display: "flex", alignItems: "center" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#42A5F5" }}>🔬 Skin Scan</div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "20px 20px 100px" }}>

        {/* ── CAMERA ── */}
        {mode === "camera" && (
          <div>
            <div style={{ ...glass, borderRadius: 22, overflow: "hidden", aspectRatio: "4/3", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {camError ? (
                <div style={{ textAlign: "center", color: "#8BA4C8", padding: 28 }}>
                  <div style={{ fontSize: 52, marginBottom: 14 }}>📷</div>
                  <div style={{ fontSize: 13 }}>{camError}</div>
                </div>
              ) : (
                <>
                  <video ref={videoRef} autoPlay playsInline muted style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />

                  {/* Oval guide overlay */}
                  <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
                    <svg width="100%" height="100%" style={{ position:"absolute", inset:0 }}>
                      <defs>
                        <mask id="ovalMask">
                          <rect width="100%" height="100%" fill="white"/>
                          <ellipse cx="50%" cy="50%" rx="41%" ry="44%" fill="black"/>
                        </mask>
                      </defs>
                      <rect width="100%" height="100%" fill="rgba(10,22,40,0.45)" mask="url(#ovalMask)"/>
                      <ellipse cx="50%" cy="50%" rx="41%" ry="44%" fill="none" stroke="#42A5F5" strokeWidth="1.5" strokeDasharray="10 6" opacity="0.85"/>
                    </svg>
                    <div style={{ position:"absolute", top:"7%", left:"50%", transform:"translateX(-50%)", fontSize:10, color:"#42A5F5", whiteSpace:"nowrap", background:"rgba(10,22,40,0.75)", padding:"4px 14px", borderRadius:20, border:"1px solid rgba(66,165,245,0.3)", letterSpacing:0.5 }}>
                      Position skin within the oval
                    </div>
                  </div>

                  {/* Corner brackets */}
                  <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
                    {[
                      { top:12,    left:12,    borderLeft:"2px solid #42A5F5", borderTop:"2px solid #42A5F5"    },
                      { top:12,    right:12,   borderRight:"2px solid #42A5F5", borderTop:"2px solid #42A5F5"   },
                      { bottom:12, left:12,    borderLeft:"2px solid #42A5F5", borderBottom:"2px solid #42A5F5" },
                      { bottom:12, right:12,   borderRight:"2px solid #42A5F5", borderBottom:"2px solid #42A5F5"},
                    ].map((s, i) => (
                      <div key={i} style={{ position:"absolute", width:22, height:22, borderRadius:2, animation:`bracketPulse 2s ease-in-out ${i * 0.2}s infinite`, ...s }} />
                    ))}
                  </div>

                  {/* Capture flash */}
                  {flash && <div style={{ position:"absolute", inset:0, background:"white", animation:"captureFlash 0.3s ease forwards", pointerEvents:"none" }} />}
                </>
              )}
            </div>

            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:44, padding:"24px 0" }}>
              <div onClick={toggleFlash} className="ds-pressable" style={{ width:50, height:50, borderRadius:"50%", background: flashOn?"rgba(245,158,11,0.2)":"rgba(100,160,255,0.1)", border:`1px solid ${flashOn?"rgba(245,158,11,0.5)":"rgba(100,160,255,0.2)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, cursor:"pointer" }}>
                {flashOn ? "⚡" : "🔦"}
              </div>

              <div onClick={camError?undefined:capture} className="ds-pressable" style={{ width:74, height:74, borderRadius:"50%", background:camError?"#1A2D50":"linear-gradient(135deg,#1565C0,#42A5F5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, cursor:camError?"not-allowed":"pointer", boxShadow:camError?"none":"0 0 0 6px rgba(66,165,245,0.15), 0 0 32px rgba(66,165,245,0.5)", border:"3px solid rgba(255,255,255,0.12)" }}>
                📸
              </div>

              <div onClick={() => setFacingMode(f => f==="environment"?"user":"environment")} className="ds-pressable" style={{ width:50, height:50, borderRadius:"50%", background:"rgba(100,160,255,0.1)", border:"1px solid rgba(100,160,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, cursor:"pointer" }}>
                🔄
              </div>
            </div>

            <div style={{ textAlign:"center", fontSize:11, color:"#8BA4C8" }}>
              Position the affected area in frame and tap capture
            </div>
          </div>
        )}

        {/* ── PREVIEW ── */}
        {mode === "preview" && (
          <div>
            <div style={{ ...glass, borderRadius: 22, overflow:"hidden", marginBottom:16, position:"relative" }}>
              <img src={preview} alt="preview" style={{ width:"100%", maxHeight:360, objectFit:"cover", display:"block" }} />

              {/* Analyzing overlay */}
              {loading && (
                <div style={{ position:"absolute", inset:0 }}>
                  <div style={{ position:"absolute", inset:0, background:"rgba(10,22,40,0.7)", backdropFilter:"blur(2px)" }} />
                  <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12 }}>
                    <div className="ds-spinner" style={{ width:48, height:48, borderWidth:4 }} />
                    <div style={{ fontSize:13, color:"#42A5F5", fontWeight:600, letterSpacing:1 }}>ANALYZING…</div>
                    <div style={{ fontSize:11, color:"#8BA4C8" }}>AI is examining your skin</div>
                  </div>
                </div>
              )}
            </div>

            {!loading && (
              <div style={{ display:"flex", gap:12 }}>
                <button onClick={retake} className="ds-pressable" style={{ flex:1, padding:14, background:"transparent", border:"1px solid rgba(100,160,255,0.25)", borderRadius:14, color:"#8BA4C8", fontWeight:600, fontSize:14, cursor:"pointer" }}>
                  ↩ Retake
                </button>
                <button onClick={analyze} className="ds-pressable" style={{ flex:2, padding:14, background:"linear-gradient(135deg,#1565C0,#7C3AED)", border:"none", borderRadius:14, color:"white", fontWeight:700, fontSize:14, cursor:"pointer", boxShadow:"0 4px 20px rgba(124,58,237,0.3)" }}>
                  🔬 Analyze with AI
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── RESULT ── */}
        {mode === "result" && (
          <div className="ds-stagger">
            {preview && (
              <div style={{ ...glass, borderRadius:18, overflow:"hidden", marginBottom:16 }}>
                <img src={preview} alt="scan" style={{ width:"100%", maxHeight:190, objectFit:"cover", display:"block" }} />
              </div>
            )}

            <div style={{ ...glass, borderRadius:18, padding:18, marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, marginBottom:12 }}>
                <div style={{ fontWeight:800, fontSize:15, color:"white", flex:1 }}>{conditionTitle}</div>
                {sev && (
                  <div style={{ fontSize:11, fontWeight:700, color:sev.color, background:sev.bg, border:`1px solid ${sev.color}55`, borderRadius:20, padding:"4px 12px", flexShrink:0 }}>
                    {sev.display}
                  </div>
                )}
              </div>

              <div style={{ fontSize:12, color:"#C8DEFF", lineHeight:1.8, marginBottom:12 }}>{result}</div>

              <div style={{ fontSize:10, color:"#8BA4C8", background:"rgba(245,158,11,0.07)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:10, padding:"8px 10px" }}>
                ⚠️ This is not a medical diagnosis. Always consult a licensed healthcare professional.
              </div>
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <button onClick={retake} className="ds-pressable" style={{ flex:1, padding:14, background:"transparent", border:"1px solid rgba(100,160,255,0.25)", borderRadius:14, color:"#8BA4C8", fontWeight:600, fontSize:13, cursor:"pointer" }}>
                ↩ Retake
              </button>
              {navigator.share && (
                <button onClick={shareResult} className="ds-pressable" style={{ flex:1, padding:14, background:"rgba(66,165,245,0.1)", border:"1px solid rgba(66,165,245,0.25)", borderRadius:14, color:"#42A5F5", fontWeight:600, fontSize:13, cursor:"pointer" }}>
                  ↗ Share
                </button>
              )}
              <button onClick={retake} className="ds-pressable" style={{ flex:2, padding:14, background:"linear-gradient(135deg,#1565C0,#42A5F5)", border:"none", borderRadius:14, color:"white", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                📷 Scan Again
              </button>
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display:"none" }} />
    </div>
  );
}
