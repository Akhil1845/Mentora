import React, { useEffect, useState } from "react";
import "./RegisterPage.css";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Flame,
  Loader2,
  Check,
} from "lucide-react";

const STREAK_TOPICS: { label: string; pct: number }[] = [
  { label: "Java Arrays", pct: 85 },
  { label: "Recursion", pct: 41 },
  { label: "Trees", pct: 25 },
];

type Status = "idle" | "loading" | "success";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [agree, setAgree] = useState(false);

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("Please fill in all the required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agree) {
      setError("Please accept the terms to create your account.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : "Unable to create your account."
        );
      }

      setStatus("success");
    } catch (error) {
      setStatus("idle");

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const goHome = () => {
    navigate("/");
  };

  const goLogin = () => {
    navigate("/login");
  };

  return (
    <div className="lgn-page">
      {/* BRAND PANEL */}
      <aside className="lgn-brandside">
        <div className="lgn-brand-top">
          <button className="lgn-logo" onClick={goHome} type="button">
            Mentora<span className="lgn-dot">.</span>
          </button>
        </div>

        <div className="lgn-brand-copy">
          <h1 className="lgn-brand-h1">
            Don't just
            <br />
            <span className="lgn-color-cycle">learn code.</span>
          </h1>

          <p className="lgn-brand-sub">
            Build the habit of thinking, testing, failing, and understanding
            every mistake along the way.
          </p>
        </div>

        <div className={`lgn-streak-card ${mounted ? "lgn-in" : ""}`}>
          <div className="lgn-streak-head">
            <Flame size={15} strokeWidth={2.2} />
            <span>Your learning path</span>
          </div>

          {STREAK_TOPICS.map((topic, index) => (
            <div className="lgn-bar-row" key={topic.label}>
              <div className="lgn-bar-label">
                <span>{topic.label}</span>
                <span className="lgn-bar-pct">{topic.pct}%</span>
              </div>

              <div className="lgn-bar-track">
                <div
                  className="lgn-bar-fill"
                  style={{
                    width: mounted ? `${topic.pct}%` : "0%",
                    transitionDelay: `${0.3 + index * 0.15}s`,
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
        <button className="lgn-back" onClick={goHome} type="button">
          <ArrowLeft size={15} />
          Back to home
        </button>

        <div className="lgn-card">
          <div className="lgn-card-head">
            <h2 className="lgn-h2">Create your account</h2>
            <p className="lgn-card-sub">
              Start learning coding with Mentora.
            </p>
          </div>

          {status === "success" ? (
            <div className="lgn-success">
              <div className="lgn-success-icon">
                <Check size={22} strokeWidth={2.6} />
              </div>

              <h3>You're ready.</h3>

              <p>
                Your Mentora account has been created. Let's start learning.
              </p>

              <button
                type="button"
                className="lgn-submit"
                onClick={goLogin}
              >
                Continue to sign in
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <form
              className="lgn-form"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* FULL NAME */}
              <label className="lgn-field">
                <span className="lgn-field-label">Full name</span>

                <span className="lgn-input-wrap">
                  <User size={16} className="lgn-input-icon" />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </span>
              </label>

              {/* EMAIL */}
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

              {/* PASSWORD */}
              <label className="lgn-field">
                <span className="lgn-field-label">Password</span>

                <span className="lgn-input-wrap">
                  <Lock size={16} className="lgn-input-icon" />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="lgn-eye"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </span>
              </label>

              {/* CONFIRM PASSWORD */}
              <label className="lgn-field">
                <span className="lgn-field-label">
                  Confirm password
                </span>

                <span className="lgn-input-wrap">
                  <Lock size={16} className="lgn-input-icon" />

                  <input
                    type={
                      showConfirmPassword ? "text" : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="lgn-eye"
                    onClick={() =>
                      setShowConfirmPassword((value) => !value)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </span>
              </label>

              {/* TERMS */}
              <label className="lgn-check lgn-terms">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />

                <span
                  className="lgn-check-box"
                  aria-hidden="true"
                />

                <span>
                  I agree to Mentora's{" "}
                  <button
                    type="button"
                    className="lgn-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    Terms
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="lgn-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>

              {error && (
                <p className="lgn-error" role="alert">
                  {error}
                </p>
              )}

              {/* CREATE ACCOUNT */}
              <button
                type="submit"
                className="lgn-submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2
                      size={16}
                      className="lgn-spin"
                    />
                    Creating account…
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="lgn-divider">
                <span>or continue with</span>
              </div>

              {/* OAUTH */}
              <div className="lgn-oauth-row">
                <button
                  type="button"
                  className="lgn-oauth-btn"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
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
          Already have an account?{" "}
          <button
            type="button"
            className="lgn-link lgn-link-strong"
            onClick={goLogin}
          >
            Sign in
          </button>
        </p>
      </main>
    </div>
  );
}