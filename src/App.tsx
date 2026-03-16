import React, { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase/firebaseConfig";
import QuoteBar from "./components/QuoteBar";
import Dashboard from "./pages/Dashboard";
import GroupFeed from "./pages/GroupFeed";
import Friends from "./pages/Friends";

type Tab = "dashboard" | "feed" | "friends";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("dashboard");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  async function handleSignIn() {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Sign-in error:", err);
    }
  }

  async function handleSignOut() {
    await signOut(auth);
  }

  /* ── Auth loading state ─────────────────── */
  if (authLoading) {
    return (
      <div className="app-shell">
        <div className="loading-spinner full-page">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  /* ── Login screen ───────────────────────── */
  if (!user) {
    return (
      <div className="app-shell">
        <div className="login-screen">
          <div className="login-card glass-card">
            <h1 className="brand">
              <span className="brand-icon">🔥</span> HabitTribe
            </h1>
            <p className="tagline">
              Track habits together. Stay accountable. Build streaks.
            </p>
            <button className="google-btn" onClick={handleSignIn}>
              <svg viewBox="0 0 24 24" className="google-icon">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Authenticated app ──────────────────── */
  return (
    <div className="app-shell">
      <QuoteBar />

      <header className="top-bar">
        <h1 className="brand small">
          <span className="brand-icon">🔥</span> HabitTribe
        </h1>
        <div className="user-info">
          <img
            src={user.photoURL ?? ""}
            alt=""
            className="avatar"
            referrerPolicy="no-referrer"
          />
          <button className="sign-out-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </header>

      <nav className="tab-bar">
        <button
          className={`tab ${tab === "dashboard" ? "active" : ""}`}
          onClick={() => setTab("dashboard")}
        >
          📋 My Habits
        </button>
        <button
          className={`tab ${tab === "feed" ? "active" : ""}`}
          onClick={() => setTab("feed")}
        >
          🌍 Feed
        </button>
        <button
          className={`tab ${tab === "friends" ? "active" : ""}`}
          onClick={() => setTab("friends")}
        >
          👥 Groups
        </button>
      </nav>

      <main className="main-content">
        {tab === "dashboard" && <Dashboard />}
        {tab === "feed" && <GroupFeed />}
        {tab === "friends" && <Friends />}
      </main>
    </div>
  );
};

export default App;
