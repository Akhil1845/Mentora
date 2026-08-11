import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  BrainCircuit,
  Code2,
  BarChart3,
  User,
  Settings,
  LogOut,
  Flame,
  Trophy,
  ChevronRight,
  BookOpen,
  Menu,
  X,
} from "lucide-react";

import "./DashboardPage.css";

// ==========================================
// USER
// ==========================================

interface MentoraUser {
  id: number;
  name: string;
  email: string;
  createdAt?: string | null;
}

// ==========================================
// PROBLEM
// ==========================================

interface PracticeProblem {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  topic: string;
  tags: string;
  estimatedTime: number;
  releaseDate?: string | null;
  active: boolean;
}

// ==========================================
// DAILY PROBLEM RESPONSE
// ==========================================

interface DailyProblemResponse {
  id: number;
  problem: PracticeProblem;
  releaseDate: string;
  active: boolean;
}

// ==========================================
// DASHBOARD
// ==========================================

export default function DashboardPage() {

  const [user, setUser] =
    useState<MentoraUser | null>(null);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // Today's automatically assigned problem
  const [dailyProblem, setDailyProblem] =
    useState<PracticeProblem | null>(null);

  const [problemsLoading, setProblemsLoading] =
    useState(true);

  // ==========================================
  // LOAD LOGGED-IN USER
  // ==========================================

  useEffect(() => {

    const storedUser =
      localStorage.getItem("mentoraUser");

    if (storedUser) {

      try {

        setUser(
          JSON.parse(storedUser)
        );

      } catch {

        localStorage.removeItem(
          "mentoraUser"
        );

        window.location.href = "/login";
      }

    } else {

      window.location.href = "/login";

    }

  }, []);

  // ==========================================
  // LOAD TODAY'S DAILY PROBLEM
  // ==========================================

  useEffect(() => {

    const fetchTodayProblem = async () => {

      try {

        setProblemsLoading(true);

        const response = await fetch(
          "http://localhost:8080/api/daily-problems/today"
        );

        // No daily problem assigned
        if (response.status === 404) {

          setDailyProblem(null);

          return;
        }

        if (!response.ok) {

          throw new Error(
            "Failed to fetch today's problem"
          );

        }

        const data: DailyProblemResponse =
          await response.json();

        console.log(
          "Today's Daily Problem:",
          data
        );

        if (
          data &&
          data.problem &&
          data.active
        ) {

          setDailyProblem(
            data.problem
          );

        } else {

          setDailyProblem(null);

        }

      } catch (error) {

        console.error(
          "Error fetching today's problem:",
          error
        );

        setDailyProblem(null);

      } finally {

        setProblemsLoading(false);

      }

    };

    fetchTodayProblem();

  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.removeItem(
      "mentoraUser"
    );

    window.location.href = "/login";

  };

  // ==========================================
  // NAVIGATION
  // ==========================================

  const goToPractice = () => {

    window.location.href =
      "/practice";

  };

  const goToProblem = (
    problemId: number
  ) => {

    window.location.href =
      `/practice/${problemId}`;

  };

  // ==========================================
  // USER DETAILS
  // ==========================================

  const firstName = user?.name
    ? user.name.split(" ")[0]
    : "Student";

  const memberSince = user?.createdAt
    ? new Date(
        user.createdAt
      ).toLocaleDateString(
        undefined,
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      )
    : "Account active";

  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="dashboard-page">

      {/* ======================================
          MOBILE OVERLAY
      ====================================== */}

      {sidebarOpen && (

        <div
          className="dashboard-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />

      )}

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <aside
        className={`dashboard-sidebar ${
          sidebarOpen
            ? "dashboard-sidebar-open"
            : ""
        }`}
      >

        {/* BRAND */}

        <div className="dashboard-brand">

          <span>
            Mentora
          </span>

          <span className="dashboard-brand-dot">
            .
          </span>

        </div>

        {/* MOBILE CLOSE */}

        <button
          className="dashboard-mobile-close"
          onClick={() =>
            setSidebarOpen(false)
          }
        >
          <X size={20} />
        </button>

        {/* NAVIGATION */}

        <nav className="dashboard-nav">

          {/* DASHBOARD */}

          <button
            className="dashboard-nav-item active"
          >

            <LayoutDashboard size={18} />

            <span>
              Dashboard
            </span>

          </button>

          {/* AI MENTOR */}

          <button
            className="dashboard-nav-item"
          >

            <BrainCircuit size={18} />

            <span>
              AI Mentor
            </span>

          </button>

          {/* PRACTICE */}

          <button
            className="dashboard-nav-item"
            onClick={goToPractice}
          >

            <Code2 size={18} />

            <span>
              Practice
            </span>

          </button>

          {/* PROGRESS */}

          <button
            className="dashboard-nav-item"
          >

            <BarChart3 size={18} />

            <span>
              Progress
            </span>

          </button>

          {/* PROFILE */}

          <button
            className="dashboard-nav-item"
          >

            <User size={18} />

            <span>
              Profile
            </span>

          </button>

          {/* SETTINGS */}

          <button
            className="dashboard-nav-item"
          >

            <Settings size={18} />

            <span>
              Settings
            </span>

          </button>

        </nav>

        {/* SIDEBAR BOTTOM */}

        <div className="dashboard-sidebar-bottom">

          {/* USER */}

          <div className="dashboard-user-mini">

            <div className="dashboard-avatar">

              {firstName
                .charAt(0)
                .toUpperCase()}

            </div>

            <div className="dashboard-user-mini-info">

              <strong>
                {firstName}
              </strong>

              <span>
                Student
              </span>

            </div>

          </div>

          {/* LOGOUT */}

          <button
            className="dashboard-logout"
            onClick={handleLogout}
          >

            <LogOut size={17} />

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>

      {/* ======================================
          MAIN
      ====================================== */}

      <main className="dashboard-main">

        {/* ====================================
            TOP BAR
        ==================================== */}

        <header className="dashboard-header">

          {/* MOBILE MENU */}

          <button
            className="dashboard-menu-button"
            onClick={() =>
              setSidebarOpen(true)
            }
          >

            <Menu size={22} />

          </button>

          {/* HEADER RIGHT */}

          <div className="dashboard-header-right">

            <button
              className="dashboard-icon-button"
            >

              <Trophy size={18} />

            </button>

            <div className="dashboard-header-user">

              <div className="dashboard-avatar">

                {firstName
                  .charAt(0)
                  .toUpperCase()}

              </div>

              <div>

                <strong>
                  {firstName}
                </strong>

                <span>
                  Student
                </span>

              </div>

            </div>

          </div>

        </header>

        {/* ====================================
            CONTENT
        ==================================== */}

        <div className="dashboard-content">

          {/* ==================================
              WELCOME
          ================================== */}

          <section className="dashboard-welcome">

            <div>

              <p className="dashboard-eyebrow">
                YOUR LEARNING SPACE
              </p>

              <h1>

                Good to see you{" "}

                <span>
                  {firstName}.
                </span>

              </h1>

              <p className="dashboard-welcome-text">

                Keep building your
                problem-solving skills.

                Your next breakthrough
                might be one problem away.

              </p>

            </div>

            <div className="dashboard-welcome-mark">

              <BrainCircuit size={46} />

            </div>

          </section>

          {/* ==================================
              STAT CARDS
          ================================== */}

          <section className="dashboard-stats">

            {/* USER */}

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon streak">

                <User size={20} />

              </div>

              <div>

                <span>
                  Signed in as
                </span>

                <strong>
                  {user?.name || "Student"}
                </strong>

              </div>

            </div>

            {/* EMAIL */}

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon progress">

                <Settings size={20} />

              </div>

              <div>

                <span>
                  Email
                </span>

                <strong>
                  {user?.email ||
                    "Not available"}
                </strong>

              </div>

            </div>

            {/* MEMBER SINCE */}

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon solved">

                <Flame size={20} />

              </div>

              <div>

                <span>
                  Member since
                </span>

                <strong>
                  {memberSince}
                </strong>

              </div>

            </div>

          </section>

          {/* ==================================
              GRID
          ================================== */}

          <section className="dashboard-grid">

            {/* =================================
                CONTINUE LEARNING
            ================================= */}

            <div className="dashboard-panel continue-panel">

              <div className="dashboard-panel-heading">

                <div>

                  <span className="dashboard-panel-label">
                    LEARNING STATUS
                  </span>

                  <h2>
                    No learning history yet
                  </h2>

                </div>

                <BookOpen size={20} />

              </div>

              <p className="dashboard-panel-description">

                Start solving problems to track
                real progress, streaks, and
                topic history here.

              </p>

              <div className="dashboard-progress-row">

                <div className="dashboard-progress-track">

                  <div
                    className="dashboard-progress-fill"
                    style={{
                      width: "0%",
                    }}
                  />

                </div>

                <span>
                  0%
                </span>

              </div>

              <button
                className="dashboard-primary-button"
                onClick={goToPractice}
              >

                Start practice

                <ChevronRight size={17} />

              </button>

            </div>

            {/* =================================
                AI MENTOR
            ================================= */}

            <div className="dashboard-panel mentor-panel">

              <div className="mentor-icon">

                <BrainCircuit size={24} />

              </div>

              <span className="dashboard-panel-label">

                AI MENTOR

              </span>

              <h2>

                Stuck on a problem?

              </h2>

              <p>

                Don't just get the answer.
                Understand why your solution
                works — or doesn't.

              </p>

              <button
                className="dashboard-secondary-button"
              >

                Ask Mentora

                <ChevronRight size={17} />

              </button>

            </div>

          </section>

          {/* ==================================
              TODAY'S DAILY PROBLEM
          ================================== */}

          <section className="dashboard-recommended">

            {/* SECTION HEADER */}

            <div className="dashboard-section-heading">

              <div>

                <span className="dashboard-panel-label">

                  DAILY CHALLENGE

                </span>

                <h2>

                  Today's problem is ready.

                </h2>

              </div>

              <button
                className="dashboard-secondary-button"
                onClick={goToPractice}
              >

                View Practice

                <ChevronRight size={17} />

              </button>

            </div>

            {/* =================================
                LOADING
            ================================= */}

            {problemsLoading && (

              <div className="dashboard-topic-grid">

                <div className="dashboard-topic-card dashboard-topic-empty">

                  <div className="topic-icon">

                    <Flame size={19} />

                  </div>

                  <div>

                    <h3>

                      Loading today's problem...

                    </h3>

                    <p>

                      Mentora is preparing your
                      daily challenge.

                    </p>

                  </div>

                </div>

              </div>

            )}

            {/* =================================
                NO DAILY PROBLEM
            ================================= */}

            {!problemsLoading &&
              !dailyProblem && (

                <div className="dashboard-topic-grid">

                  <div
                    className="dashboard-topic-card dashboard-topic-empty"
                    onClick={goToPractice}
                  >

                    <div className="topic-icon">

                      <Code2 size={19} />

                    </div>

                    <div>

                      <h3>

                        No daily problem assigned

                      </h3>

                      <p>

                        Your next daily challenge
                        will appear here automatically.

                      </p>

                    </div>

                  </div>

                </div>

              )}

            {/* =================================
                TODAY'S PROBLEM
            ================================= */}

            {!problemsLoading &&
              dailyProblem && (

                <div className="dashboard-topic-grid">

                  <div
                    className="dashboard-topic-card dashboard-daily-problem-card"
                    onClick={() =>
                      goToProblem(
                        dailyProblem.id
                      )
                    }
                  >

                    {/* ICON */}

                    <div className="topic-icon daily">

                      <Flame size={19} />

                    </div>

                    {/* PROBLEM INFORMATION */}

                    <div className="dashboard-daily-problem-info">

                      <div className="dashboard-daily-problem-label">

                        <span>
                          ADDED TODAY
                        </span>

                      </div>

                      <h3>

                        {dailyProblem.title}

                      </h3>

                      <p>

                        {dailyProblem.difficulty}

                        {" · "}

                        {dailyProblem.topic}

                        {" · "}

                        {dailyProblem.estimatedTime}

                        {" min"}

                      </p>

                    </div>

                    {/* ARROW */}

                    <ChevronRight size={18} />

                  </div>

                </div>

              )}

          </section>

        </div>

      </main>

    </div>

  );
}