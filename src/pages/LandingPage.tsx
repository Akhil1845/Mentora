import React, { useEffect, useRef, useState } from "react";
import "./LandingPage.css";

import {
  Sparkles,
  Terminal,
  Microscope,
  TrendingUp,
  ArrowRight,
  Menu,
  X
} from "lucide-react";

import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ *
 *  Mentora — landing page
 *  Signature idea: the hero doesn't describe the product, it performs
 *  it. A real-looking submission fails, and instead of a fix, Mentora
 *  circles the mistake in amber and asks the student to reason about
 *  it — the whole "explain, don't replace" thesis, staged as motion.
 * ------------------------------------------------------------------ */

const CODE_LINES: { n: number; jsx: React.ReactElement }[] = [
  { n: 1, jsx: <>for <span className="mnt-sym">(</span><span className="mnt-kw">int</span> i = <span className="mnt-num">0</span>; <span className="mnt-flag">i &lt;= array.length</span>; i++<span className="mnt-sym">)</span> {"{"}</> },
  { n: 2, jsx: <>&nbsp;&nbsp;System.out.println<span className="mnt-sym">(</span>array[i]<span className="mnt-sym">)</span>;</> },
  { n: 3, jsx: <>{"}"}</> },
];

function useReveal(): React.RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>(".mnt-reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            target.classList.add("mnt-in");
            io.unobserve(target);
          }
        });
      },
      { threshold: 0.2 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

function HeroDemo({ cycleKey }: { cycleKey: number }) {
  return (
    <div className="mnt-terminal" key={cycleKey}>
      <div className="mnt-term-head">
        <div className="mnt-dots">
          <span /><span /><span />
        </div>
        <span className="mnt-term-name">solution.java — attempt 3</span>
      </div>

      <div className="mnt-term-body">
        {CODE_LINES.map((l, i) => (
          <div
            className="mnt-code-line mnt-reveal-line"
            style={{ animationDelay: `${0.15 + i * 0.28}s` }}
            key={l.n}
          >
            <span className="mnt-ln">{l.n}</span>
            <span className="mnt-code-text">{l.jsx}</span>
          </div>
        ))}
      </div>

      <div className="mnt-run-out mnt-fade-in" style={{ animationDelay: "1.05s" }}>
        <span className="mnt-run-dot" /> Run finished — 1 of 4 tests failed
      </div>

      <div className="mnt-annotation mnt-fade-up" style={{ animationDelay: "1.55s" }}>
        <div className="mnt-annotation-head">
          <Sparkles size={13} strokeWidth={2.4} />
          <span>Mentora — line 1</span>
        </div>
        <p>
          The array holds 5 elements, so valid indexes run 0 through 4.
          Your condition lets <code>i</code> reach 5.
        </p>
        <p className="mnt-annotation-q">What happens when the loop reads index 5?</p>
      </div>
    </div>
  );
}

export default function MentoraLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [cycle, setCycle] = useState(0);
  const revealRoot = useReveal();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setCycle((c) => c + 1), 8200);
    return () => clearInterval(id);
  }, []);

  const scrollTo = (id: string) => {
    setNavOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mnt-root" ref={revealRoot}>

      {/* NAV */}
      <nav className={`mnt-nav ${scrolled ? "mnt-nav-scrolled" : ""}`}>
        <div className="mnt-nav-inner">
          <div className="mnt-logo">
            Mentora<span className="mnt-dot">.</span>
          </div>

          <div className={`mnt-nav-links ${navOpen ? "mnt-nav-open" : ""}`}>
            <button className="mnt-link" onClick={() => scrollTo("how")}>How it works</button>
            <button className="mnt-link" onClick={() => scrollTo("features")}>Features</button>
            <button className="mnt-link" onClick={() => scrollTo("principle")}>Philosophy</button>
            <div className="mnt-nav-actions">
              <button
                className="mnt-btn-ghost"
                onClick={() => navigate("/login")}
              >
                Sign in
              </button>
              <button
                className="mnt-btn-solid"
                onClick={() => navigate("/register")}
              >
                Get started
              </button>
            </div>
          </div>

          <button className="mnt-burger" onClick={() => setNavOpen((v) => !v)} aria-label="Menu">
            {navOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <header className="mnt-hero">
        <div className="mnt-hero-grid">
          <div className="mnt-hero-copy">
            <div className="mnt-eyebrow mnt-reveal">
              <span className="mnt-eyebrow-dot" /> AI‑POWERED CODING MENTOR
            </div>

            <h1 className="mnt-h1 mnt-reveal">
              Don't just write code.
              <br />
              <span className="mnt-h1-accent mnt-color-cycle">Understand it.</span>
            </h1>

            <p className="mnt-lead mnt-reveal">
              Mentora watches you fail a test case, then does the one thing
              most tools won't — it makes you figure out why, before it
              lets you fix it.
            </p>

            <div className="mnt-hero-actions mnt-reveal">
              <button
                className="mnt-btn-solid mnt-btn-lg"
                onClick={() => navigate("/register")}
              >
                Start learning <ArrowRight size={16} />
              </button>
              <button className="mnt-btn-ghost mnt-btn-lg" onClick={() => scrollTo("principle")}>
                See the philosophy
              </button>
            </div>

            <div className="mnt-hero-meta mnt-reveal">
              <div><strong>12</strong> languages</div>
              <div className="mnt-meta-rule" />
              <div><strong>0</strong> answers handed over</div>
            </div>
          </div>

          <div className="mnt-hero-visual mnt-reveal">
            <HeroDemo cycleKey={cycle} />
          </div>
        </div>
      </header>

      {/* HOW IT WORKS — the loop */}
      <section className="mnt-section" id="how">
        <div className="mnt-section-head mnt-reveal">
          <p className="mnt-eyebrow-sm mnt-color-cycle mnt-cc-0">THE MENTORA METHOD</p>
          <h2 className="mnt-h2 mnt-color-cycle mnt-cc-1">A loop, not a lookup.</h2>
          <p className="mnt-section-sub">
            Four steps that repeat until a concept actually sticks —
            not a straight line to an answer.
          </p>
        </div>

        <div className="mnt-loop">
          {[
            { k: "LEARN", t: "Learn", d: "A concept, explained plainly, with an example you can poke at." },
            { k: "PRACTICE", t: "Practice", d: "A task sized to what you already know — and what you don't yet." },
            { k: "SUBMIT", t: "Submit", d: "Your own solution, run against real tests, no hints along the way." },
            { k: "UNDERSTAND", t: "Understand", d: "Where it broke, what that means, why — never the rewritten fix." },
          ].map((s, i, arr) => (
            <div className="mnt-loop-item mnt-reveal" style={{ transitionDelay: `${i * 90}ms` }} key={s.k}>
              <div className="mnt-loop-card">
                <span className={`mnt-loop-key mnt-color-cycle mnt-cc-${i}`}>{s.k}</span>
                <h3 className={`mnt-color-cycle mnt-cc-${i}`}>{s.t}</h3>
                <p>{s.d}</p>
              </div>
              {i < arr.length - 1 && <div className="mnt-loop-dash" aria-hidden="true" />}
            </div>
          ))}
          <div className="mnt-loop-back mnt-reveal">
            <svg width="46" height="34" viewBox="0 0 46 34" fill="none" aria-hidden="true">
              <path d="M40 4C40 4 42 22 24 27C10 30.5 4 22 4 22" stroke="var(--insight)" strokeWidth="2" strokeLinecap="round" />
              <path d="M2 16L4 24L11 21" stroke="var(--insight)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="mnt-color-cycle mnt-cc-2">repeats until it's mastered, not until it's memorized</span>
          </div>
        </div>
      </section>

      {/* PRINCIPLE — big editorial statement */}
      <section className="mnt-principle" id="principle">
        <p className="mnt-eyebrow-sm mnt-eyebrow-light mnt-reveal mnt-color-cycle mnt-cc-0">THE MENTORA PRINCIPLE</p>
        <h2 className="mnt-principle-line mnt-reveal mnt-color-cycle mnt-cc-1">
          The student thinks first.
        </h2>
        <h2 className="mnt-principle-line mnt-principle-accent mnt-reveal mnt-color-cycle mnt-cc-3">
          Mentora evaluates second.
        </h2>
        <p className="mnt-principle-sub mnt-reveal">
          No suggestions while you're mid‑thought. No autocomplete finishing
          the hard part for you. Just a clean shot at solving it yourself —
          and an honest breakdown when you don't.
        </p>
      </section>

      {/* FEATURES */}
      <section className="mnt-section" id="features">
        <div className="mnt-section-head mnt-reveal">
          <p className="mnt-eyebrow-sm mnt-color-cycle mnt-cc-0">BUILT FOR LEARNING</p>
          <h2 className="mnt-h2 mnt-color-cycle mnt-cc-1">More than a coding chatbot.</h2>
        </div>

        <div className="mnt-feature-grid">
          {[
            { icon: Sparkles, t: "AI Mentor", d: "Ask why, not just what. Get guidance sized to a hint, not a hand‑out." },
            { icon: Terminal, t: "Code Lab", d: "Write, run, and submit in one editor — nothing watches over your shoulder while you think." },
            { icon: Microscope, t: "AI Evaluation", d: "After you submit, a plain‑language breakdown of where it broke and why." },
            { icon: TrendingUp, t: "Progress", d: "Every topic, mistake, and retry, tracked so you can see the trend line." },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div className="mnt-feature-card mnt-reveal" key={f.t}>
                <Icon size={20} strokeWidth={2} className="mnt-feature-icon" />
                <h3 className={`mnt-feature-title mnt-color-cycle mnt-cc-${i}`}>{f.t}</h3>
                <p>{f.d}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mnt-cta mnt-reveal">
        <h2 className="mnt-color-cycle mnt-cc-2">Stop copying answers. Start understanding them.</h2>
        <button
          className="mnt-btn-solid mnt-btn-lg"
          onClick={() => navigate("/register")}
        >
          Start learning free <ArrowRight size={16} />
        </button>
      </section>

      {/* FOOTER */}
      <footer className="mnt-footer">
        <div className="mnt-logo mnt-color-cycle mnt-cc-2">
          Mentora<span className="mnt-dot">.</span>
        </div>
        <p>Learn coding. Understand mistakes. Build mastery.</p>
        <small>© 2026 Mentora. Built for learners.</small>
      </footer>
    </div>
  );
}