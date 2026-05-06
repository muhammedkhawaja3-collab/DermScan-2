import { useState, useEffect } from "react";

const isIOS = () => /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
const isAndroid = () => /android/.test(navigator.userAgent.toLowerCase());
const isInstalled = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [platform, setPlatform] = useState(null);

  useEffect(() => {
    if (isInstalled()) return;

    if (isIOS()) {
      setPlatform("ios");
      const dismissed = sessionStorage.getItem("ds-install-dismissed");
      if (!dismissed) {
        const t = setTimeout(() => setShow(true), 4000);
        return () => clearTimeout(t);
      }
      return;
    }

    const handler = e => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPlatform(isAndroid() ? "android" : "desktop");
      const dismissed = sessionStorage.getItem("ds-install-dismissed");
      if (!dismissed) setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("ds-install-dismissed", "1");
    setShow(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShow(false);
    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: platform === "desktop" ? "auto" : 90,
      top: platform === "desktop" ? 70 : "auto",
      right: platform === "desktop" ? 20 : "auto",
      left: platform === "desktop" ? "auto" : 0,
      width: platform === "desktop" ? 320 : "100%",
      zIndex: 450,
      padding: platform === "desktop" ? 0 : "0 12px 12px",
    }}>
      <div style={{
        background: "linear-gradient(135deg,#0F1F3D,#1A2D50)",
        border: "1px solid rgba(100,160,255,0.25)",
        borderRadius: 18,
        padding: 18,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg,#7C3AED,#1565C0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
            📲
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "white" }}>Install DermScan</div>
            <div style={{ fontSize: 11, color: "#8BA4C8", marginTop: 1 }}>Add to your home screen</div>
          </div>
          <div onClick={dismiss} style={{ color: "#8BA4C8", cursor: "pointer", fontSize: 18, padding: "0 4px", lineHeight: 1 }}>✕</div>
        </div>

        {/* iOS instructions */}
        {platform === "ios" && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "#C8DEFF", lineHeight: 1.6, marginBottom: 8 }}>
              Install DermScan on your iPhone or iPad:
            </div>
            {[
              { icon: "1️⃣", text: "Tap the Share button (□↑) at the bottom of Safari" },
              { icon: "2️⃣", text: 'Scroll down and tap "Add to Home Screen"' },
              { icon: "3️⃣", text: 'Tap "Add" — DermScan will appear on your home screen' },
            ].map(step => (
              <div key={step.icon} style={{ display: "flex", gap: 8, fontSize: 11, color: "#8BA4C8", marginBottom: 6 }}>
                <span>{step.icon}</span>
                <span>{step.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Android / Desktop prompt */}
        {(platform === "android" || platform === "desktop") && (
          <div style={{ fontSize: 11, color: "#8BA4C8", lineHeight: 1.55, marginBottom: 14 }}>
            {platform === "android"
              ? "Install DermScan as an app on your Android device. Works offline and opens like a native app."
              : "Install DermScan as a desktop app. Opens in its own window with no browser chrome."}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={dismiss} style={{ flex: 1, padding: "9px 12px", background: "transparent", border: "1px solid rgba(100,160,255,0.2)", borderRadius: 10, color: "#8BA4C8", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            Not now
          </button>
          {platform !== "ios" && (
            <button onClick={install} style={{ flex: 2, padding: "9px 12px", background: "linear-gradient(135deg,#1565C0,#7C3AED)", border: "none", borderRadius: 10, color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              📲 Install App
            </button>
          )}
          {platform === "ios" && (
            <button onClick={dismiss} style={{ flex: 2, padding: "9px 12px", background: "linear-gradient(135deg,#1565C0,#7C3AED)", border: "none", borderRadius: 10, color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              Got it ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
