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

interface MentoraUser {
  id: number;
  name: string;
  email: string;
  createdAt?: string | null;
}

interface PracticeProblem {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  topic: string;
  tags: string;
  estimatedTime: number;
  releaseDate: string;
  active: boolean;
}

export default function DashboardPage() {
  const [user, setUser] = useState<MentoraUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [dailyProblems, setDailyProblems] = useState<PracticeProblem[]>([]);
  const [problemsLoading, setProblemsLoading] = useState(true);

  // =========================
  // LOAD LOGGED-IN USER
  // =========================

  useEffect(() => {
    const storedUser = localStorage.getItem("mentoraUser");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("mentoraUser");
        window.location.href = "/login";
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

  // =========================
  // LOAD TODAY'S PRACTICE
  // =========================

  useEffect(() => {
    const fetchDailyProblems = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/problems/daily"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch daily problems");
        }

        const data: PracticeProblem[] = await response.json();

        // Temporary:
        // Our initializer currently has 10 problems for today.
        // Dashboard should show only the first 4.
        setDailyProblems(data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching daily problems:", error);
      } finally {
        setProblemsLoading(false);
      }
    };

    fetchDailyProblems();
  }, []);

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("mentoraUser");
    window.location.href = "/login";
  };

  // =========================
  // NAVIGATION
  // =========================

  const goToPractice = () => {
    window.location.href = "/practice";
  };

  const goToProblem = (problemId: number) => {
    window.location.href = `/practice/${problemId}`;
  };

  // =========================
  // USER DETAILS
  // =========================

  const firstName = user?.name
    ? user.name.split(" ")[0]
    : "Student";

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Account active";

  // =========================
  // UI
  // =========================

  return (
    <div className="dashboard-page">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="dashboard-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`dashboard-sidebar ${
          sidebarOpen ? "dashboard-sidebar-open" : ""
        }`}
      >
        <div className="dashboard-brand">
          <span>Mentora</span>
          <span className="dashboard-brand-dot">.</span>
        </div>

        <button
          className="dashboard-mobile-close"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={20} />
        </button>

        <nav className="dashboard-nav">

          <button className="dashboard-nav-item active">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button className="dashboard-nav-item">
            <BrainCircuit size={18} />
            <span>AI Mentor</span>
          </button>

          <button
            className="dashboard-nav-item"
            onClick={goToPractice}
          >
            <Code2 size={18} />
            <span>Practice</span>
          </button>

          <button className="dashboard-nav-item">
            <BarChart3 size={18} />
            <span>Progress</span>
          </button>

          <button className="dashboard-nav-item">
            <User size={18} />
            <span>Profile</span>
          </button>

          <button className="dashboard-nav-item">
            <Settings size={18} />
            <span>Settings</span>
          </button>

        </nav>

        <div className="dashboard-sidebar-bottom">

          <div className="dashboard-user-mini">

            <div className="dashboard-avatar">
              {firstName.charAt(0).toUpperCase()}
            </div>

            <div className="dashboard-user-mini-info">
              <strong>{firstName}</strong>
              <span>Student</span>
            </div>

          </div>

          <button
            className="dashboard-logout"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>

        </div>
      </aside>

      {/* MAIN */}
      <main className="dashboard-main">

        {/* TOP BAR */}
        <header className="dashboard-header">

          <button
            className="dashboard-menu-button"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          <div className="dashboard-header-right">

            <button className="dashboard-icon-button">
              <Trophy size={18} />
            </button>

            <div className="dashboard-header-user">

              <div className="dashboard-avatar">
                {firstName.charAt(0).toUpperCase()}
              </div>

              <div>
                <strong>{firstName}</strong>
                <span>Student</span>
              </div>

            </div>

          </div>

        </header>

        {/* CONTENT */}
        <div className="dashboard-content">

          {/* WELCOME */}
          <section className="dashboard-welcome">

            <div>

              <p className="dashboard-eyebrow">
                YOUR LEARNING SPACE
              </p>

              <h1>
                Good to see you{" "}
                <span>{firstName}.</span>
              </h1>

              <p className="dashboard-welcome-text">
                Keep building your problem-solving skills.
                Your next breakthrough might be one problem away.
              </p>

            </div>

            <div className="dashboard-welcome-mark">
              <BrainCircuit size={46} />
            </div>

          </section>

          {/* STAT CARDS */}
          <section className="dashboard-stats">

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon streak">
                <User size={20} />
              </div>

              <div>
                <span>Signed in as</span>
                <strong>{user?.name || "Student"}</strong>
              </div>

            </div>

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon progress">
                <Settings size={20} />
              </div>

              <div>
                <span>Email</span>
                <strong>{user?.email || "Not available"}</strong>
              </div>

            </div>

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon solved">
                <Flame size={20} />
              </div>

              <div>
                <span>Member since</span>
                <strong>{memberSince}</strong>
              </div>

            </div>

          </section>

          {/* GRID */}
          <section className="dashboard-grid">

            {/* CONTINUE LEARNING */}
            <div className="dashboard-panel continue-panel">

              <div className="dashboard-panel-heading">

                <div>

                  <span className="dashboard-panel-label">
                    LEARNING STATUS
                  </span>

                  <h2>No learning history yet</h2>

                </div>

                <BookOpen size={20} />

              </div>

              <p className="dashboard-panel-description">
                Start solving problems to track real progress,
                streaks, and topic history here.
              </p>

              <div className="dashboard-progress-row">

                <div className="dashboard-progress-track">

                  <div
                    className="dashboard-progress-fill"
                    style={{ width: "0%" }}
                  />

                </div>

                <span>0%</span>

              </div>

              <button
                className="dashboard-primary-button"
                onClick={goToPractice}
              >
                Start practice
                <ChevronRight size={17} />
              </button>

            </div>

            {/* AI MENTOR */}
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
                Don't just get the answer. Understand why
                your solution works — or doesn't.
              </p>

              <button className="dashboard-secondary-button">
                Ask Mentora
                <ChevronRight size={17} />
              </button>

            </div>

          </section>

          {/* TODAY'S PRACTICE */}
          <section className="dashboard-recommended">

            <div className="dashboard-section-heading">

              <div>

                <span className="dashboard-panel-label">
                  TODAY'S PRACTICE
                </span>

                <h2>
                  Keep your problem-solving sharp.
                </h2>

              </div>

              <button
                className="dashboard-secondary-button"
                onClick={goToPractice}
              >
                View all
                <ChevronRight size={17} />
              </button>

            </div>

            {/* LOADING */}
            {problemsLoading && (

              <div className="dashboard-topic-grid">

                <div className="dashboard-topic-card dashboard-topic-empty">

                  <div className="topic-icon">
                    <Code2 size={19} />
                  </div>

                  <div>

                    <h3>
                      Loading today's problems...
                    </h3>

                    <p>
                      Mentora is getting your daily practice ready.
                    </p>

                  </div>

                </div>

              </div>

            )}

            {/* NO PROBLEMS */}
            {!problemsLoading && dailyProblems.length === 0 && (

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
                      No problems available today
                    </h3>

                    <p>
                      Check the Practice section for more problems.
                    </p>

                  </div>

                </div>

              </div>

            )}

            {/* DAILY PROBLEMS */}
            {!problemsLoading && dailyProblems.length > 0 && (

              <div className="dashboard-topic-grid">

                {dailyProblems.map((problem) => (

                  <div
                    key={problem.id}
                    className="dashboard-topic-card"
                    onClick={() => goToProblem(problem.id)}
                  >

                    <div className="topic-icon">
                      <Code2 size={19} />
                    </div>

                    <div>

                      <h3>{problem.title}</h3>

                      <p>
                        {problem.difficulty} · {problem.topic}
                      </p>

                    </div>

                    <ChevronRight size={18} />

                  </div>

                ))}

              </div>

            )}

          </section>

        </div>

      </main>

    </div>
  );
}