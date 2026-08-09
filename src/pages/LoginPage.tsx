import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Flame,
  Loader2,
  Check,
} from "lucide-react";

/* ------------------------------------------------------------------ *
 *  Mentora — sign in
 *  Signature idea: the brand panel keeps performing the product even
 *  here — a streak card whose bars fill in on load, the same "explain,
 *  don't just answer" voice in the copy. The form itself borrows the
 *  hero's language: submitting reads like running code, not a POST.
 * ------------------------------------------------------------------ */

const STREAK_TOPICS: { label: string; pct: number }[] = [
  { label: "Java Arrays", pct: 85 },
  { label: "Recursion", pct: 41 },
  { label: "Trees", pct: 25 },
];

type Status = "idle" | "loading" | "success";

interface LoginPageProps {
  /** Hook up real auth here. Falls back to a demo simulation if omitted. */
  onLogin?: (
    email: string,
    password: string,
    remember: boolean
  ) => Promise<void> | void;
  onNavigateHome?: () => void;
  onNavigateSignup?: () => void;
}

export default function LoginPage({ onLogin, onNavigateHome, onNavigateSignup }: LoginPageProps) {
  const navigate = useNavigate();
  const handleNavigateHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
      return;
    }
    navigate("/");
  };
  const handleNavigateSignup = () => {
    if (onNavigateSignup) {
      onNavigateSignup();
      return;
    }
    navigate("/register");
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Enter your email and password to continue.");
      return;
    }

    setStatus("loading");
    try {
      if (onLogin) {
        await onLogin(email, password, remember);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1300));
      }
      setStatus("success");
    } catch {
      setStatus("idle");
      setError("That didn't work. Check your details and try again.");
    }
  };

  return (
    <div className="lgn-root">
      <div className="lgn-shell">
        {/* BRAND PANEL */}
        <aside className="lgn-brand">
          <div className="lgn-glow" aria-hidden="true" />

          <div className="lgn-brand-top">
            <button className="lgn-logo" onClick={handleNavigateHome} type="button">
              Mentora<span className="lgn-dot">.</span>
            </button>
          </div>

          <div className="lgn-brand-copy">
            <h1 className="lgn-brand-h1">
              Pick up
              <br />
              <span className="lgn-color-cycle">where you left off.</span>
            </h1>
            <p className="lgn-brand-sub">
              Every mistake you've worked through is still here — the streaks,
              the weak spots, the topics you've actually mastered.
            </p>
          </div>

          <div className={`lgn-streak-card ${mounted ? "lgn-in" : ""}`}>
            <div className="lgn-streak-head">
              <Flame size={15} strokeWidth={2.2} />
              <span>12‑day streak</span>
            </div>

            {STREAK_TOPICS.map((t, i) => (
              <div className="lgn-bar-row" key={t.label}>
                <div className="lgn-bar-label">
                  <span>{t.label}</span>
                  <span className="lgn-bar-pct">{t.pct}%</span>
                </div>
                <div className="lgn-bar-track">
                  <div
                    className="lgn-bar-fill"
                    style={{
                      width: mounted ? `${t.pct}%` : "0%",
                      transitionDelay: `${0.3 + i * 0.15}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="lgn-brand-quote">
            "The student thinks first. Mentora evaluates second."
          </p>
        </aside>

        {/* FORM PANEL */}
        <main className="lgn-formside">
          <button className="lgn-back" onClick={handleNavigateHome} type="button">
            <ArrowLeft size={15} /> Back to home
          </button>

          <div className="lgn-card">
            <div className="lgn-card-head">
              <h2 className="lgn-h2">Welcome back</h2>
              <p className="lgn-card-sub">Sign in to continue your streak.</p>
            </div>

            {status === "success" ? (
              <div className="lgn-success">
                <div className="lgn-success-icon">
                  <Check size={22} strokeWidth={2.6} />
                </div>
                <h3>You're in.</h3>
                <p>Taking you back to your last topic — Recursion.</p>
              </div>
            ) : (
              <form className="lgn-form" onSubmit={handleSubmit} noValidate>
                <label className="lgn-field">
                  <span className="lgn-field-label">Email</span>
                  <span className="lgn-input-wrap">
                    <Mail size={16} className="lgn-input-icon" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </span>
                </label>

                <label className="lgn-field">
                  <span className="lgn-field-label">Password</span>
                  <span className="lgn-input-wrap">
                    <Lock size={16} className="lgn-input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="lgn-eye"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </span>
                </label>

                <div className="lgn-row">
                  <label className="lgn-check">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    <span className="lgn-check-box" aria-hidden="true" />
                    Remember me for a month
                  </label>
                  <a href="#forgot" className="lgn-link">Forgot password?</a>
                </div>

                {error && <p className="lgn-error" role="alert">{error}</p>}

                <button type="submit" className="lgn-submit" disabled={status === "loading"}>
                  {status === "loading" ? (
                    <>
                      <Loader2 size={16} className="lgn-spin" /> Verifying…
                    </>
                  ) : (
                    <>
                      Sign in <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <div className="lgn-divider">
                  <span>or continue with</span>
                </div>

                <div className="lgn-oauth-row">
                  <button type="button" className="lgn-oauth-btn">
                    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M15.68 8.18c0-.56-.05-1.1-.15-1.62H8v3.07h4.3a3.68 3.68 0 0 1-1.6 2.42v2h2.58c1.51-1.39 2.4-3.44 2.4-5.87Z"
                        opacity=".55"
                      />
                      <path
                        fill="currentColor"
                        d="M8 16c2.16 0 3.97-.72 5.29-1.95l-2.58-2c-.72.48-1.63.77-2.71.77-2.08 0-3.85-1.4-4.48-3.29H.86v2.06A8 8 0 0 0 8 16Z"
                      />
                      <path
                        fill="currentColor"
                        d="M3.52 9.53a4.8 4.8 0 0 1 0-3.06V4.41H.86a8 8 0 0 0 0 7.18l2.66-2.06Z"
                        opacity=".7"
                      />
                      <path
                        fill="currentColor"
                        d="M8 3.18c1.17 0 2.23.4 3.06 1.19l2.29-2.29A7.94 7.94 0 0 0 8 0 8 8 0 0 0 .86 4.41l2.66 2.06C4.15 4.58 5.92 3.18 8 3.18Z"
                      />
                    </svg>
                    Google
                  </button>
                </div>
              </form>
            )}
          </div>

          <p className="lgn-signup-cta">
            New to Mentora?{" "}
            <button type="button" className="lgn-link lgn-link-strong" onClick={handleNavigateSignup}>
              Create an account
            </button>
          </p>
        </main>
      </div>
    </div>
  );
}