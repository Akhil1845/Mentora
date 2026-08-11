import { useEffect, useMemo, useState } from "react";

import {
  BrainCircuit,
  LayoutDashboard,
  Code2,
  BarChart3,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  Circle,
  Clock3,
  Rows3,
  Type,
  Link2,
  GitBranch,
  Share2,
  Layers,
  ChevronRight,
  Bookmark,
  Shuffle,
  Flame,
  Target,
  RotateCcw,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./DashboardPage.css";
import "./PracticePage.css";

// =====================================================
// USER
// =====================================================

interface MentoraUser {
  id: number;
  name: string;
  email: string;
  createdAt?: string | null;
}

// =====================================================
// TYPES
// =====================================================

type Difficulty = "Easy" | "Medium" | "Hard";

type Status =
  | "solved"
  | "attempted"
  | "not-started";

// =====================================================
// BACKEND PROBLEM
// =====================================================

interface BackendProblem {
  id: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  topic: string;
  tags: string | null;
  estimatedTime: number | null;
  releaseDate: string | null;
  active: boolean;
}

// =====================================================
// BACKEND DAILY PROBLEM
// =====================================================

interface BackendDailyProblem {
  id: number;
  problem: BackendProblem;
  releaseDate: string;
  active: boolean;
}

// =====================================================
// FRONTEND PROBLEM
// =====================================================

interface Problem {
  id: number;
  title: string;
  topic: string;
  difficulty: Difficulty;
  status: Status;
  description: string;
  tags: string[];
  estimatedTime: number;
  releaseDate: string | null;
  active: boolean;
}

// =====================================================
// TOPIC ICONS
// =====================================================

const TOPIC_ICONS: Record<
  string,
  typeof Rows3
> = {
  Arrays: Rows3,
  Strings: Type,
  "Linked Lists": Link2,
  Trees: GitBranch,
  Graphs: Share2,
  "Dynamic Programming": Layers,
};

// =====================================================
// DIFFICULTIES
// =====================================================

const DIFFICULTIES: Difficulty[] = [
  "Easy",
  "Medium",
  "Hard",
];

// =====================================================
// STATUSES
// =====================================================

const STATUSES: Status[] = [
  "solved",
  "attempted",
  "not-started",
];

// =====================================================
// PRACTICE PAGE
// =====================================================

export default function PracticePage() {
  const navigate = useNavigate();

  // ===================================================
  // USER
  // ===================================================

  const [user, setUser] =
    useState<MentoraUser | null>(null);

  // ===================================================
  // UI STATE
  // ===================================================

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [filtersOpen, setFiltersOpen] =
    useState(false);

  // ===================================================
  // FILTER STATE
  // ===================================================

  const [search, setSearch] =
    useState("");

  const [activeTopics, setActiveTopics] =
    useState<string[]>([]);

  const [activeDifficulties, setActiveDifficulties] =
    useState<Difficulty[]>([]);

  const [activeStatuses, setActiveStatuses] =
    useState<Status[]>([]);

  const [bookmarkedOnly, setBookmarkedOnly] =
    useState(false);

  const [bookmarks, setBookmarks] =
    useState<number[]>([]);

  // ===================================================
  // PROBLEM STATE
  // ===================================================

  const [problems, setProblems] =
    useState<Problem[]>([]);

  const [dailyProblem, setDailyProblem] =
    useState<Problem | null>(null);

  // ===================================================
  // LOADING / ERROR
  // ===================================================

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ===================================================
  // LOAD USER
  // ===================================================

  useEffect(() => {
    const storedUser =
      localStorage.getItem("mentoraUser");

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

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
  }, []);

  // ===================================================
  // LOAD PROBLEMS
  // ===================================================

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        setError("");

        // ---------------------------------------------
        // FETCH ALL PROBLEMS
        // ---------------------------------------------

        const problemsResponse =
          await fetch(
            "http://localhost:8080/api/problems"
          );

        if (!problemsResponse.ok) {
          throw new Error(
            "Failed to load practice problems."
          );
        }

        const problemsData:
          BackendProblem[] =
          await problemsResponse.json();

        // ---------------------------------------------
        // FETCH TODAY'S DAILY PROBLEM
        // ---------------------------------------------

        const dailyResponse =
          await fetch(
            "http://localhost:8080/api/daily-problems/today"
          );

        let dailyData:
          BackendDailyProblem | null =
          null;

        if (dailyResponse.ok) {
          dailyData =
            await dailyResponse.json();
        } else if (
          dailyResponse.status !== 404
        ) {
          throw new Error(
            "Failed to load today's daily problem."
          );
        }

        // ---------------------------------------------
        // CONVERT PROBLEM
        // ---------------------------------------------

        const convertProblem = (
          problem: BackendProblem
        ): Problem => {
          return {
            id: problem.id,

            title: problem.title,

            topic: problem.topic,

            difficulty:
              problem.difficulty,

            status: "not-started",

            description:
              problem.description,

            tags:
              problem.tags
                ? problem.tags
                    .split(",")
                    .map(
                      (tag) =>
                        tag.trim()
                    )
                    .filter(Boolean)
                : [],

            estimatedTime:
              problem.estimatedTime ?? 0,

            releaseDate:
              problem.releaseDate,

            active:
              problem.active,
          };
        };

        // ---------------------------------------------
        // ACTIVE PROBLEMS
        // ---------------------------------------------

        const convertedProblems =
          problemsData
            .filter(
              (problem) =>
                problem.active
            )
            .map(convertProblem);

        setProblems(
          convertedProblems
        );

        // ---------------------------------------------
        // TODAY'S QUESTION
        // ---------------------------------------------

        if (
          dailyData &&
          dailyData.problem &&
          dailyData.active &&
          dailyData.problem.active
        ) {
          setDailyProblem(
            convertProblem(
              dailyData.problem
            )
          );
        } else {
          setDailyProblem(null);
        }
      } catch (err) {
        console.error(
          "Error loading practice problems:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load practice problems."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "mentoraUser"
    );

    window.location.href =
      "/login";
  };

  // ===================================================
  // USER NAME
  // ===================================================

  const firstName =
    user?.name
      ? user.name.split(" ")[0]
      : "Student";

  // ===================================================
  // DAILY DATE
  // ===================================================

  const dailyProblemDate =
    dailyProblem?.releaseDate
      ? new Date(
          dailyProblem.releaseDate
        )
      : null;

  const today =
    new Date();

  const isToday =
    dailyProblemDate !== null &&
    dailyProblemDate.toDateString() ===
      today.toDateString();

  const formattedDailyDate =
    dailyProblemDate
      ? dailyProblemDate.toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        )
      : "";

  // ===================================================
  // TOPIC FILTER
  // ===================================================

  const toggleTopic = (
    topic: string
  ) => {
    setActiveTopics(
      (previous) =>
        previous.includes(topic)
          ? previous.filter(
              (item) =>
                item !== topic
            )
          : [
              ...previous,
              topic,
            ]
    );
  };

  // ===================================================
  // DIFFICULTY FILTER
  // ===================================================

  const toggleDifficulty = (
    difficulty: Difficulty
  ) => {
    setActiveDifficulties(
      (previous) =>
        previous.includes(
          difficulty
        )
          ? previous.filter(
              (item) =>
                item !== difficulty
            )
          : [
              ...previous,
              difficulty,
            ]
    );
  };

  // ===================================================
  // STATUS FILTER
  // ===================================================

  const toggleStatus = (
    status: Status
  ) => {
    setActiveStatuses(
      (previous) =>
        previous.includes(status)
          ? previous.filter(
              (item) =>
                item !== status
            )
          : [
              ...previous,
              status,
            ]
    );
  };

  // ===================================================
  // BOOKMARK
  // ===================================================

  const toggleBookmark = (
    id: number
  ) => {
    setBookmarks(
      (previous) =>
        previous.includes(id)
          ? previous.filter(
              (item) =>
                item !== id
            )
          : [
              ...previous,
              id,
            ]
    );
  };

  // ===================================================
  // CLEAR FILTERS
  // ===================================================

  const clearFilters = () => {
    setSearch("");
    setActiveTopics([]);
    setActiveDifficulties([]);
    setActiveStatuses([]);
    setBookmarkedOnly(false);
  };

  // ===================================================
  // TOPICS
  // ===================================================

  const topics = useMemo(() => {
    const uniqueTopics =
      Array.from(
        new Set(
          problems.map(
            (problem) =>
              problem.topic
          )
        )
      );

    return uniqueTopics.map(
      (name) => ({
        name,
        icon:
          TOPIC_ICONS[name] ||
          Code2,
      })
    );
  }, [problems]);

  // ===================================================
  // FILTERED PROBLEMS
  // ===================================================

  const filteredProblems =
    useMemo(() => {
      return problems.filter(
        (problem) => {
          const searchTerm =
            search
              .toLowerCase()
              .trim();

          const matchesSearch =
            searchTerm === "" ||
            problem.title
              .toLowerCase()
              .includes(
                searchTerm
              ) ||
            problem.description
              .toLowerCase()
              .includes(
                searchTerm
              ) ||
            problem.topic
              .toLowerCase()
              .includes(
                searchTerm
              ) ||
            problem.tags.some(
              (tag) =>
                tag
                  .toLowerCase()
                  .includes(
                    searchTerm
                  )
            );

          const matchesTopic =
            activeTopics.length === 0 ||
            activeTopics.includes(
              problem.topic
            );

          const matchesDifficulty =
            activeDifficulties.length ===
              0 ||
            activeDifficulties.includes(
              problem.difficulty
            );

          const matchesStatus =
            activeStatuses.length === 0 ||
            activeStatuses.includes(
              problem.status
            );

          const matchesBookmark =
            !bookmarkedOnly ||
            bookmarks.includes(
              problem.id
            );

          return (
            matchesSearch &&
            matchesTopic &&
            matchesDifficulty &&
            matchesStatus &&
            matchesBookmark
          );
        }
      );
    }, [
      problems,
      search,
      activeTopics,
      activeDifficulties,
      activeStatuses,
      bookmarkedOnly,
      bookmarks,
    ]);

  // ===================================================
  // STATISTICS
  // ===================================================

  const solvedCount =
    problems.filter(
      (problem) =>
        problem.status === "solved"
    ).length;

  const attemptedCount =
    problems.filter(
      (problem) =>
        problem.status === "attempted"
    ).length;

  const remainingCount =
    problems.length -
    solvedCount -
    attemptedCount;

  const completion =
    problems.length === 0
      ? 0
      : Math.round(
          (solvedCount /
            problems.length) *
            100
        );

  // ===================================================
  // RANDOM PROBLEM
  // ===================================================

  const startRandomProblem =
    () => {
      if (
        problems.length === 0
      ) {
        return;
      }

      const randomIndex =
        Math.floor(
          Math.random() *
            problems.length
        );

      const randomProblem =
        problems[randomIndex];

      navigate(
        `/practice/${randomProblem.id}`
      );
    };

  // ===================================================
  // OPEN PROBLEM
  // ===================================================

  const openProblem = (
    problemId: number
  ) => {
    navigate(
      `/practice/${problemId}`
    );
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="dashboard-page">

      {/* ==========================================
          MOBILE OVERLAY
      ========================================== */}

      {sidebarOpen && (
        <div
          className="dashboard-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <aside
        className={`dashboard-sidebar ${
          sidebarOpen
            ? "dashboard-sidebar-open"
            : ""
        }`}
      >

        <div className="dashboard-brand">
          <span>
            Mentora
          </span>

          <span className="dashboard-brand-dot">
            .
          </span>
        </div>

        <button
          className="dashboard-mobile-close"
          onClick={() =>
            setSidebarOpen(false)
          }
        >
          <X size={20} />
        </button>

        <nav className="dashboard-nav">

          <button
            className="dashboard-nav-item"
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
          >
            <LayoutDashboard
              size={18}
            />

            <span>
              Dashboard
            </span>
          </button>

          <button
            className="dashboard-nav-item"
            onClick={() =>
              navigate(
                "/ai-mentor"
              )
            }
          >
            <BrainCircuit
              size={18}
            />

            <span>
              AI Mentor
            </span>
          </button>

          <button
            className="dashboard-nav-item active"
          >
            <Code2 size={18} />

            <span>
              Practice
            </span>
          </button>

          <button
            className="dashboard-nav-item"
            onClick={() =>
              navigate(
                "/progress"
              )
            }
          >
            <BarChart3
              size={18}
            />

            <span>
              Progress
            </span>
          </button>

          <button
            className="dashboard-nav-item"
            onClick={() =>
              navigate(
                "/profile"
              )
            }
          >
            <User size={18} />

            <span>
              Profile
            </span>
          </button>

          <button
            className="dashboard-nav-item"
            onClick={() =>
              navigate(
                "/settings"
              )
            }
          >
            <Settings
              size={18}
            />

            <span>
              Settings
            </span>
          </button>

        </nav>

        {/* SIDEBAR USER */}

        <div className="dashboard-sidebar-bottom">

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

          <button
            className="dashboard-logout"
            onClick={
              handleLogout
            }
          >
            <LogOut size={17} />

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>

      {/* ==========================================
          MAIN
      ========================================== */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <button
            className="dashboard-menu-button"
            onClick={() =>
              setSidebarOpen(true)
            }
          >
            <Menu size={22} />
          </button>

          <div className="dashboard-header-right">

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

        {/* ==========================================
            CONTENT
        ========================================== */}

        <div className="dashboard-content">

          {/* ========================================
              TITLE
          ======================================== */}

          <section className="practice-heading">

            <p className="dashboard-eyebrow">
              PRACTICE ARENA
            </p>

            <h1>
              Build your{" "}
              <span>
                problem-solving skills.
              </span>
            </h1>

            <p className="dashboard-welcome-text">
              Solve problems, understand your
              mistakes, and let Mentora visualize
              how your code works.
            </p>

          </section>

          {/* ========================================
              DAILY + RANDOM
          ======================================== */}

          <section className="practice-feature-row">

            {/* ======================================
                DAILY QUESTION
            ====================================== */}

            <div
              className="practice-daily-card"
              onClick={() => {
                if (dailyProblem) {
                  openProblem(
                    dailyProblem.id
                  );
                }
              }}
              style={{
                cursor: dailyProblem
                  ? "pointer"
                  : "default",
              }}
            >

              {/* ICON */}

              <div className="practice-feature-icon">
                <Flame size={22} />
              </div>

              {/* CONTENT */}

              <div className="practice-daily-content">

                <div className="practice-daily-label-row">

                  <span className="dashboard-panel-label">
                    DAILY CHALLENGE
                  </span>

                  {dailyProblem && (
                    <span className="practice-today-badge">
                      {isToday
                        ? "● ADDED TODAY"
                        : "DAILY QUESTION"}
                    </span>
                  )}

                </div>

                {/* LOADING */}

                {loading ? (
                  <>
                    <h2>
                      Loading today's
                      challenge...
                    </h2>

                    <p>
                      Mentora is preparing
                      your daily question.
                    </p>
                  </>
                ) : dailyProblem ? (
                  <>
                    <h2>
                      {dailyProblem.title}
                    </h2>

                    <div className="practice-daily-meta">

                      <span>
                        {
                          dailyProblem
                            .difficulty
                        }
                      </span>

                      <span>
                        ·
                      </span>

                      <span>
                        {
                          dailyProblem
                            .topic
                        }
                      </span>

                      <span>
                        ·
                      </span>

                      <span>
                        {
                          dailyProblem
                            .estimatedTime
                        }{" "}
                        min
                      </span>

                    </div>

                    {/* DATE */}

                    <div className="practice-daily-date">

                      <CheckCircle2
                        size={14}
                      />

                      <span>
                        {isToday
                          ? "Today's question"
                          : "Daily question"}
                      </span>

                      {formattedDailyDate && (
                        <>
                          <span>
                            ·
                          </span>

                          <span>
                            Added{" "}
                            {
                              formattedDailyDate
                            }
                          </span>
                        </>
                      )}

                    </div>
                  </>
                ) : (
                  <>
                    <h2>
                      No challenge available
                    </h2>

                    <p>
                      No daily question has
                      been assigned yet.
                    </p>
                  </>
                )}

              </div>

              {/* ARROW */}

              {dailyProblem && (
                <ChevronRight
                  size={22}
                  className="practice-daily-arrow"
                />
              )}

            </div>

            {/* ======================================
                RANDOM PROBLEM
            ====================================== */}

            <div className="practice-random-card">

              <Shuffle size={25} />

              <h3>
                Feeling adventurous?
              </h3>

              <p>
                Let Mentora randomly choose
                a problem for you.
              </p>

              <button
                className="dashboard-secondary-button"
                onClick={
                  startRandomProblem
                }
                disabled={
                  problems.length === 0
                }
              >
                Random problem

                <Shuffle size={15} />
              </button>

            </div>

          </section>

          {/* ========================================
              STATISTICS
          ======================================== */}

          <section className="dashboard-stats practice-stats">

            {/* SOLVED */}

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon solved">

                <CheckCircle2 size={20} />

              </div>

              <div>

                <span>
                  Solved
                </span>

                <strong>
                  {solvedCount}
                </strong>

              </div>

            </div>

            {/* ATTEMPTED */}

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon progress">

                <Clock3 size={20} />

              </div>

              <div>

                <span>
                  Attempted
                </span>

                <strong>
                  {attemptedCount}
                </strong>

              </div>

            </div>

            {/* COMPLETION */}

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon streak">

                <Target size={20} />

              </div>

              <div>

                <span>
                  Completion
                </span>

                <strong>
                  {completion}%
                </strong>

              </div>

            </div>

            {/* REMAINING */}

            <div className="dashboard-stat-card">

              <div className="dashboard-stat-icon">

                <Circle size={20} />

              </div>

              <div>

                <span>
                  Remaining
                </span>

                <strong>
                  {remainingCount}
                </strong>

              </div>

            </div>

          </section>

          {/* ========================================
              SEARCH / FILTER TOOLBAR
          ======================================== */}

          <section className="practice-toolbar">

            {/* SEARCH */}

            <div className="practice-search">

              <Search size={16} />

              <input
                type="text"
                placeholder="Search problems..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />

            </div>

            {/* SAVED */}

            <button
              className={`practice-filter-toggle ${
                bookmarkedOnly
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setBookmarkedOnly(
                  (previous) =>
                    !previous
                )
              }
            >

              <Bookmark size={16} />

              <span>
                Saved
              </span>

            </button>

            {/* FILTERS */}

            <button
              className="practice-filter-toggle"
              onClick={() =>
                setFiltersOpen(
                  (previous) =>
                    !previous
                )
              }
            >

              <SlidersHorizontal
                size={16}
              />

              <span>
                Filters
              </span>

              {(
                activeTopics.length +
                activeDifficulties.length +
                activeStatuses.length
              ) > 0 && (
                <span className="practice-filter-count">
                  {activeTopics.length +
                    activeDifficulties.length +
                    activeStatuses.length}
                </span>
              )}

            </button>

          </section>

          {/* ========================================
              PRACTICE LAYOUT
          ======================================== */}

          <div className="practice-layout">

            {/* ======================================
                FILTER SIDEBAR
            ====================================== */}

            <aside
              className={`practice-filters ${
                filtersOpen
                  ? "practice-filters-open"
                  : ""
              }`}
            >

              <div className="practice-filters-header">

                <span className="dashboard-panel-label">
                  FILTERS
                </span>

                <button
                  className="practice-clear"
                  onClick={
                    clearFilters
                  }
                >
                  <RotateCcw
                    size={13}
                  />

                  Clear
                </button>

              </div>

              {/* DIFFICULTY */}

              <span className="dashboard-panel-label">
                DIFFICULTY
              </span>

              <div className="practice-difficulty-row">

                {DIFFICULTIES.map(
                  (difficulty) => (
                    <button
                      key={difficulty}
                      className={`practice-diff-chip practice-diff-${difficulty.toLowerCase()} ${
                        activeDifficulties.includes(
                          difficulty
                        )
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        toggleDifficulty(
                          difficulty
                        )
                      }
                    >
                      {difficulty}
                    </button>
                  )
                )}

              </div>

              {/* STATUS */}

              <span className="dashboard-panel-label practice-topics-label">
                STATUS
              </span>

              <div className="practice-topic-list">

                {STATUSES.map(
                  (status) => {
                    const icon =
                      status ===
                      "solved"
                        ? (
                          <CheckCircle2
                            size={16}
                          />
                        )
                        : status ===
                          "attempted"
                        ? (
                          <Clock3
                            size={16}
                          />
                        )
                        : (
                          <Circle
                            size={16}
                          />
                        );

                    const label =
                      status ===
                      "solved"
                        ? "Solved"
                        : status ===
                          "attempted"
                        ? "Attempted"
                        : "Not started";

                    const count =
                      problems.filter(
                        (problem) =>
                          problem.status ===
                          status
                      ).length;

                    return (
                      <button
                        key={status}
                        className={`practice-topic-item ${
                          activeStatuses.includes(
                            status
                          )
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          toggleStatus(
                            status
                          )
                        }
                      >

                        {icon}

                        <span className="practice-topic-name">
                          {label}
                        </span>

                        <span className="practice-topic-count">
                          {count}
                        </span>

                      </button>
                    );
                  }
                )}

              </div>

              {/* TOPICS */}

              <span className="dashboard-panel-label practice-topics-label">
                TOPICS
              </span>

              <div className="practice-topic-list">

                {topics.map(
                  ({
                    name,
                    icon: Icon,
                  }) => {

                    const count =
                      problems.filter(
                        (problem) =>
                          problem.topic ===
                          name
                      ).length;

                    const solved =
                      problems.filter(
                        (problem) =>
                          problem.topic ===
                            name &&
                          problem.status ===
                            "solved"
                      ).length;

                    return (
                      <button
                        key={name}
                        className={`practice-topic-item ${
                          activeTopics.includes(
                            name
                          )
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          toggleTopic(
                            name
                          )
                        }
                      >

                        <Icon size={16} />

                        <span className="practice-topic-name">
                          {name}
                        </span>

                        <span className="practice-topic-count">
                          {solved}/{count}
                        </span>

                      </button>
                    );
                  }
                )}

              </div>

            </aside>

            {/* ======================================
                RESULTS
            ====================================== */}

            <section className="practice-results">

              <div className="practice-results-count">

                {loading
                  ? "Loading problems..."
                  : `${filteredProblems.length} ${
                      filteredProblems.length ===
                      1
                        ? "problem"
                        : "problems"
                    }`}

              </div>

              {/* ERROR */}

              {!loading &&
                error && (
                  <div className="practice-empty">

                    <Search size={24} />

                    <h3>
                      Unable to load problems
                    </h3>

                    <p>
                      {error}
                    </p>

                    <button
                      className="dashboard-secondary-button"
                      onClick={() =>
                        window.location.reload()
                      }
                    >
                      Try again
                    </button>

                  </div>
                )}

              {/* LOADING */}

              {loading && (
                <div className="practice-empty">

                  <Clock3 size={24} />

                  <h3>
                    Loading practice problems...
                  </h3>

                  <p>
                    Mentora is loading your
                    problem library.
                  </p>

                </div>
              )}

              {/* NO RESULTS */}

              {!loading &&
                !error &&
                filteredProblems.length ===
                  0 && (
                  <div className="practice-empty">

                    <Search size={24} />

                    <h3>
                      No problems found
                    </h3>

                    <p>
                      Try changing your
                      filters or search term.
                    </p>

                    <button
                      className="dashboard-secondary-button"
                      onClick={
                        clearFilters
                      }
                    >
                      Clear filters
                    </button>

                  </div>
                )}

              {/* PROBLEM CARDS */}

              {!loading &&
                !error &&
                filteredProblems.length >
                  0 && (
                  <div className="practice-grid">

                    {filteredProblems.map(
                      (problem) => {

                        const isBookmarked =
                          bookmarks.includes(
                            problem.id
                          );

                        return (
                          <div
                            className="practice-card"
                            key={problem.id}
                          >

                            {/* TOP */}

                            <div className="practice-card-top">

                              <span
                                className={`practice-badge practice-badge-${problem.difficulty.toLowerCase()}`}
                              >
                                {
                                  problem.difficulty
                                }
                              </span>

                              <button
                                className={`practice-bookmark ${
                                  isBookmarked
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() =>
                                  toggleBookmark(
                                    problem.id
                                  )
                                }
                              >

                                <Bookmark
                                  size={16}
                                  fill={
                                    isBookmarked
                                      ? "currentColor"
                                      : "none"
                                  }
                                />

                              </button>

                            </div>

                            {/* TITLE */}

                            <h3 className="practice-card-title">
                              {problem.title}
                            </h3>

                            {/* DESCRIPTION */}

                            <p className="practice-card-desc">
                              {
                                problem.description
                              }
                            </p>

                            {/* TAGS */}

                            <div className="practice-card-tags">

                              {problem.tags.map(
                                (tag) => (
                                  <span
                                    key={tag}
                                  >
                                    {tag}
                                  </span>
                                )
                              )}

                            </div>

                            {/* META */}

                            <div className="practice-card-meta">

                              <span>

                                <Clock3
                                  size={13}
                                />

                                {
                                  problem.estimatedTime
                                }{" "}
                                min

                              </span>

                              <span>
                                {
                                  problem.topic
                                }
                              </span>

                            </div>

                            {/* FOOTER */}

                            <div className="practice-card-footer">

                              <span className="practice-card-status">

                                {
                                  problem.status ===
                                  "solved"
                                    ? "Solved"
                                    : problem.status ===
                                      "attempted"
                                    ? "Continue"
                                    : "Not started"
                                }

                              </span>

                              <button
                                className="practice-start-button"
                                onClick={() =>
                                  openProblem(
                                    problem.id
                                  )
                                }
                              >

                                {
                                  problem.status ===
                                  "attempted"
                                    ? "Continue"
                                    : problem.status ===
                                      "solved"
                                    ? "Review"
                                    : "Start"
                                }

                                <ChevronRight
                                  size={15}
                                />

                              </button>

                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>
                )}

            </section>

          </div>

        </div>

      </main>

    </div>
  );
}