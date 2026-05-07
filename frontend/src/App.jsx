import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Scan from "./pages/Scan";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import ChatBot from "./components/ChatBot";
import InstallPrompt from "./components/InstallPrompt";
import Splash from "./components/Splash";
import Onboarding from "./components/Onboarding";

export default function App() {
  const [showSplash, setShowSplash]         = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleSplashDone = () => {
    setShowSplash(false);
    if (!localStorage.getItem("ds_onboarded")) setShowOnboarding(true);
  };

  const handleOnboardingDone = () => {
    localStorage.setItem("ds_onboarded", "1");
    setShowOnboarding(false);
  };

  return (
    <>
      {showSplash && <Splash onDone={handleSplashDone} />}
      {showOnboarding && <Onboarding onDone={handleOnboardingDone} />}

      <BrowserRouter>
        <div style={{ width: "100%", minHeight: "100vh", background: "#050D1A", color: "white", fontFamily: "system-ui,-apple-system,sans-serif", position: "relative" }}>

          {/* Animated background mesh */}
          <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
            <div className="ds-mesh" />
          </div>

          {/* App content */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <Navbar />
            <main className="ds-main">
              <Routes>
                <Route path="/"        element={<Home />}    />
                <Route path="/scan"    element={<Scan />}    />
                <Route path="/history" element={<History />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
            <ChatBot />
            <InstallPrompt />
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}
