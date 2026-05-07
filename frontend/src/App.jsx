import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { supabase } from "./supabase";
import Home from "./pages/Home";
import Scan from "./pages/Scan";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Navbar from "./components/Navbar";
import ChatBot from "./components/ChatBot";
import InstallPrompt from "./components/InstallPrompt";
import Splash from "./components/Splash";
import Onboarding from "./components/Onboarding";

function AppContent({ session }) {
  const location = useLocation();
  const isAuth = location.pathname === "/auth";

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#050D1A", color: "white", fontFamily: "system-ui,-apple-system,sans-serif", position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div className="ds-mesh" />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        {!isAuth && <Navbar />}
        <main className={isAuth ? "" : "ds-main"}>
          <Routes>
            <Route path="/auth"    element={<Auth />} />
            <Route path="/"        element={session ? <Home />    : <Navigate to="/auth" replace />} />
            <Route path="/scan"    element={session ? <Scan />    : <Navigate to="/auth" replace />} />
            <Route path="/history" element={session ? <History /> : <Navigate to="/auth" replace />} />
            <Route path="/profile" element={session ? <Profile /> : <Navigate to="/auth" replace />} />
          </Routes>
        </main>
        {!isAuth && <ChatBot />}
        {!isAuth && <InstallPrompt />}
      </div>
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash]         = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [session, setSession]               = useState(null);
  const [authLoading, setAuthLoading]       = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSplashDone = () => {
    setShowSplash(false);
    if (!localStorage.getItem("ds_onboarded")) setShowOnboarding(true);
  };

  const handleOnboardingDone = () => {
    localStorage.setItem("ds_onboarded", "1");
    setShowOnboarding(false);
  };

  if (authLoading) return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#050D1A", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="ds-spinner" />
    </div>
  );

  return (
    <>
      {showSplash && <Splash onDone={handleSplashDone} />}
      {showOnboarding && <Onboarding onDone={handleOnboardingDone} />}
      <BrowserRouter>
        <AppContent session={session} />
      </BrowserRouter>
    </>
  );
}
