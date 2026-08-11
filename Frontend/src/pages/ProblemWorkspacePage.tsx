import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Code2,
  BookOpen,
  Lightbulb,
  Play,
  Send,
  Terminal,
  RotateCcw,
  FlaskConical,
  Eye,
  XCircle,
  Video,
  Layers3,
  Zap,
  Target,
} from "lucide-react";

import "./ProblemWorkspacePage.css";

interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

interface BackendProblem {
  id: number;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  tags: string | null;
  estimatedTime: number | null;
  releaseDate: string | null;
  active: boolean;

  examples?: ProblemExample[];
  constraints?: string[];
}

type Language = "java" | "python" | "c" | "cpp";

type Tab = "concept" | "simulate" | "output";

interface ConceptApproach {
  name: string;
  complexity: string;
  explanation: string;
  whenToUse: string;
}

interface ConceptModule {
  title: string;
  description: string;
  approaches: ConceptApproach[];
}

interface SimulationStep {
  title: string;
  description: string;
  code: string;
}

interface TestResult {
  id: number;
  passed: boolean;
  hidden?: boolean;
}

const LANGUAGE_LABELS: Record<Language, string> = {
  java: "Java",
  python: "Python",
  c: "C",
  cpp: "C++",
};

const MONACO_LANGUAGES: Record<Language, string> = {
  java: "java",
  python: "python",
  c: "c",
  cpp: "cpp",
};

const STARTER_CODE: Record<Language, string> = {
  java: `import java.util.*;

class Solution {
    public int[] solve(int[] nums, int target) {

        // Write your solution here

        return new int[]{};
    }
}`,

  python: `class Solution:
    def solve(self, nums, target):

        # Write your solution here

        return []`,

  c: `#include <stdio.h>

void solve(int nums[], int n, int target) {

    // Write your solution here

}`,

  cpp: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> solve(vector<int>& nums, int target) {

        // Write your solution here

        return {};
    }
};`,
};

const DEFAULT_EXAMPLES: Record<string, ProblemExample[]> = {
  "Two Sum": [
    {
      input: `nums = [2, 7, 11, 15]
target = 9`,
      output: "[0, 1]",
      explanation:
        "Because nums[0] + nums[1] = 2 + 7 = 9.",
    },
    {
      input: `nums = [3, 2, 4]
target = 6`,
      output: "[1, 2]",
      explanation:
        "Because nums[1] + nums[2] = 2 + 4 = 6.",
    },
  ],

  "Best Time to Buy and Sell Stock": [
    {
      input: "prices = [7, 1, 5, 3, 6, 4]",
      output: "5",
      explanation:
        "Buy at 1 and sell at 6.",
    },
  ],

  "Contains Duplicate": [
    {
      input: "nums = [1, 2, 3, 1]",
      output: "true",
      explanation:
        "The value 1 appears more than once.",
    },
  ],

  "Maximum Subarray": [
    {
      input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
      output: "6",
      explanation:
        "The subarray [4,-1,2,1] has the largest sum.",
    },
  ],

  "Product of Array Except Self": [
    {
      input: "nums = [1,2,3,4]",
      output: "[24,12,8,6]",
      explanation:
        "Each position contains the product of all other elements.",
    },
  ],

  "Maximum Product Subarray": [
    {
      input: "nums = [2,3,-2,4]",
      output: "6",
      explanation:
        "The subarray [2,3] produces the maximum product.",
    },
  ],

  "Find Minimum in Rotated Sorted Array": [
    {
      input: "nums = [4,5,6,7,0,1,2]",
      output: "0",
      explanation:
        "The smallest value is 0.",
    },
  ],

  "Search in Rotated Sorted Array": [
    {
      input: `nums = [4,5,6,7,0,1,2]
target = 0`,
      output: "4",
      explanation:
        "The target 0 exists at index 4.",
    },
  ],

  "3Sum": [
    {
      input: "nums = [-1,0,1,2,-1,-4]",
      output: "[[-1,-1,2],[-1,0,1]]",
      explanation:
        "These triplets have a sum of zero.",
    },
  ],

  "Container With Most Water": [
    {
      input: "height = [1,8,6,2,5,4,8,3,7]",
      output: "49",
      explanation:
        "The maximum area is produced by heights 8 and 7.",
    },
  ],
};

const CONCEPT_MODULES: Record<string, ConceptModule> = {
  Arrays: {
    title: "Arrays",
    description:
      "Learn how to traverse, search, transform and optimize problems involving arrays.",

    approaches: [
      {
        name: "Brute Force",
        complexity: "Usually O(n²)",
        explanation:
          "Try every possible combination before looking for an optimization.",
        whenToUse:
          "Use it first when you need to understand the problem or when constraints are small.",
      },
      {
        name: "Two Pointers",
        complexity: "Usually O(n)",
        explanation:
          "Use two indexes to process an array from different directions.",
        whenToUse:
          "Useful for sorted arrays, pair problems and problems involving both ends.",
      },
      {
        name: "HashMap / HashSet",
        complexity: "Usually O(n)",
        explanation:
          "Store previously seen values so that they can be found quickly.",
        whenToUse:
          "Useful when you need fast lookup, frequency counting or duplicate detection.",
      },
      {
        name: "Prefix / Suffix",
        complexity: "Usually O(n)",
        explanation:
          "Precompute information from the left and right sides of the array.",
        whenToUse:
          "Useful when each position depends on values before or after it.",
      },
    ],
  },

  Strings: {
    title: "Strings",
    description:
      "Learn character traversal, frequency counting, two pointers and substring techniques.",

    approaches: [
      {
        name: "Character Frequency",
        complexity: "Usually O(n)",
        explanation:
          "Count characters to quickly compare or detect repeated values.",
        whenToUse:
          "Useful for anagrams, duplicates and frequency-based problems.",
      },
      {
        name: "Two Pointers",
        complexity: "Usually O(n)",
        explanation:
          "Process characters from both ends of a string.",
        whenToUse:
          "Useful for palindrome and reverse-style problems.",
      },
      {
        name: "Sliding Window",
        complexity: "Usually O(n)",
        explanation:
          "Maintain a dynamic window while processing a string.",
        whenToUse:
          "Useful for substring and longest/shortest window problems.",
      },
    ],
  },

  "Linked List": {
    title: "Linked Lists",
    description:
      "Understand nodes, pointers, traversal, reversal and fast/slow pointer techniques.",

    approaches: [
      {
        name: "Traversal",
        complexity: "O(n)",
        explanation:
          "Move through nodes one by one using the next pointer.",
        whenToUse:
          "Use when you need to inspect or modify nodes sequentially.",
      },
      {
        name: "Fast and Slow Pointers",
        complexity: "O(n)",
        explanation:
          "Use two pointers moving at different speeds to detect cycles or middle nodes.",
        whenToUse:
          "Useful for cycle detection and finding the middle node.",
      },
      {
        name: "Reversal",
        complexity: "O(n)",
        explanation:
          "Change node links to reverse the direction of the list.",
        whenToUse:
          "Useful for reversing lists and palindrome-style problems.",
      },
    ],
  },
};

export default function ProblemWorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [problem, setProblem] =
    useState<BackendProblem | null>(null);

  const [language, setLanguage] =
    useState<Language>("java");

  const [code, setCode] =
    useState(STARTER_CODE.java);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [activeTab, setActiveTab] =
    useState<Tab>("concept");

  const [selectedExample, setSelectedExample] =
    useState(0);

  const [selectedApproach, setSelectedApproach] =
    useState(0);

  const [output, setOutput] =
    useState("");

  const [running, setRunning] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [runComplete, setRunComplete] =
    useState(false);

  const [submitComplete, setSubmitComplete] =
    useState(false);

  const [simulationStep, setSimulationStep] =
    useState(0);

  const [testResults, setTestResults] =
    useState<TestResult[]>([]);

  // =========================================================
  // FETCH SELECTED PROBLEM
  // =========================================================

  useEffect(() => {
    const fetchProblem = async () => {
      if (!id) {
        setError("Problem ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:8080/api/problems/${id}`
        );

        if (!response.ok) {
          throw new Error("Problem not found.");
        }

        const data: BackendProblem =
          await response.json();

        setProblem(data);
      } catch (err) {
        console.error(
          "Error fetching problem:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load problem."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  // =========================================================
  // EXAMPLES
  // =========================================================

  const examples = useMemo(() => {
    if (!problem) {
      return [];
    }

    if (
      problem.examples &&
      problem.examples.length > 0
    ) {
      return problem.examples;
    }

    return (
      DEFAULT_EXAMPLES[problem.title] || [
        {
          input: "Sample input will be added.",
          output: "Expected output will be added.",
          explanation:
            "Detailed examples will be connected to the backend.",
        },
      ]
    );
  }, [problem]);

  // =========================================================
  // CONCEPT
  // =========================================================

  const concept = useMemo(() => {
    if (!problem) {
      return null;
    }

    return (
      CONCEPT_MODULES[problem.topic] ||
      CONCEPT_MODULES.Arrays
    );
  }, [problem]);

  // =========================================================
  // SIMULATION
  // =========================================================

  const simulationSteps: SimulationStep[] =
    useMemo(() => {
      if (!problem) {
        return [];
      }

      if (problem.title === "Two Sum") {
        return [
          {
            title: "Step 1 — Read the input",
            description:
              "We start with the array and target value.",
            code:
              "nums = [2, 7, 11, 15]\ntarget = 9",
          },
          {
            title: "Step 2 — Read first value",
            description:
              "The current value is 2. We need 7 to make the target 9.",
            code:
              "current = 2\nneed = target - current\nneed = 9 - 2\nneed = 7",
          },
          {
            title: "Step 3 — Store the value",
            description:
              "Store 2 in the HashMap along with its index.",
            code:
              "HashMap = {\n    2 : 0\n}",
          },
          {
            title: "Step 4 — Read second value",
            description:
              "The current value is 7. We need 2, and 2 already exists.",
            code:
              "current = 7\nneed = 9 - 7\nneed = 2\n\n2 exists ✓",
          },
          {
            title: "Step 5 — Answer found",
            description:
              "The indexes are 0 and 1.",
            code:
              "answer = [0, 1]",
          },
        ];
      }

      return [
        {
          title: "Step 1 — Understand input",
          description:
            "Identify the input values and what the problem asks us to return.",
          code:
            "Read input\n→\nIdentify required operation",
        },
        {
          title: "Step 2 — Process data",
          description:
            "Apply the selected algorithm to the problem data.",
          code:
            "Process input\n→\nApply algorithm",
        },
        {
          title: "Step 3 — Generate result",
          description:
            "The algorithm produces the required answer.",
          code:
            "return answer",
        },
      ];
    }, [problem]);

  // =========================================================
  // LANGUAGE CHANGE
  // =========================================================

  const handleLanguageChange = (
    newLanguage: Language
  ) => {
    setLanguage(newLanguage);
    setCode(STARTER_CODE[newLanguage]);

    setOutput("");
    setRunComplete(false);
    setSubmitComplete(false);
    setTestResults([]);
  };

  // =========================================================
  // RESET
  // =========================================================

  const handleResetCode = () => {
    setCode(STARTER_CODE[language]);

    setOutput("");
    setRunComplete(false);
    setSubmitComplete(false);
    setTestResults([]);
  };

  // =========================================================
  // RUN
  // =========================================================

  const handleRun = async () => {
    if (!problem) {
      return;
    }

    setRunning(true);
    setRunComplete(false);
    setSubmitComplete(false);

    setActiveTab("output");

    setOutput(
      "Compiling your code...\n\nRunning visible sample test cases..."
    );

    try {
      /*
       * TEMPORARY UI EXECUTION
       *
       * Real compiler endpoint will be connected later.
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      setOutput(
        [
          "✓ Compilation successful.",
          "",
          `Language : ${LANGUAGE_LABELS[language]}`,
          `Problem  : ${problem.title}`,
          "",
          "Visible test cases executed.",
          "Compiler integration will be connected next.",
        ].join("\n")
      );

      setRunComplete(true);
    } catch (err) {
      console.error(err);

      setOutput(
        "✕ Unable to execute the code."
      );
    } finally {
      setRunning(false);
    }
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async () => {
    if (!problem) {
      return;
    }

    setSubmitting(true);
    setSubmitComplete(false);

    setActiveTab("output");

    setOutput(
      [
        "Submitting solution...",
        "",
        "Running visible test cases...",
        "Running hidden test cases...",
      ].join("\n")
    );

    try {
      /*
       * TEMPORARY UI SIMULATION
       *
       * Future endpoint:
       *
       * POST /api/submissions
       *
       * {
       *   problemId,
       *   language,
       *   code
       * }
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 1500)
      );

      const simulatedResults: TestResult[] =
        examples.map((_, index) => ({
          id: index + 1,
          passed: true,
          hidden: false,
        }));

      setTestResults(simulatedResults);

      setOutput(
        [
          "✓ Submission evaluated.",
          "",
          `Language : ${LANGUAGE_LABELS[language]}`,
          "",
          `Visible test cases: ${examples.length}/${examples.length} passed`,
          "",
          "Hidden test cases: pending compiler integration.",
          "",
          "⚠ This is currently a frontend simulation.",
        ].join("\n")
      );

      setSubmitComplete(true);
    } catch (err) {
      console.error(err);

      setOutput("✕ Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // SIMULATE
  // =========================================================

  const handleSimulation = () => {
    setActiveTab("simulate");
    setSimulationStep(0);
  };

  const nextSimulationStep = () => {
    setSimulationStep((current) =>
      Math.min(
        current + 1,
        simulationSteps.length - 1
      )
    );
  };

  const previousSimulationStep = () => {
    setSimulationStep((current) =>
      Math.max(current - 1, 0)
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="workspace-page workspace-center">
        <div className="workspace-loading-icon">
          <BrainCircuit size={28} />
        </div>

        <h2>Loading problem...</h2>

        <p>
          Mentora is fetching the problem
          from the backend.
        </p>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !problem) {
    return (
      <div className="workspace-page workspace-center">
        <div className="workspace-error-icon">
          <XCircle size={28} />
        </div>

        <h2>Unable to load problem</h2>

        <p>
          {error || "Problem not found."}
        </p>

        <button
          className="workspace-back-button"
          onClick={() =>
            navigate("/practice")
          }
        >
          <ArrowLeft size={16} />
          Back to Practice
        </button>
      </div>
    );
  }

  const currentApproach =
    concept?.approaches[selectedApproach];

  const currentSimulation =
    simulationSteps[simulationStep];

  return (
    <div className="workspace-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="workspace-header">

        <button
          className="workspace-back-button"
          onClick={() =>
            navigate("/practice")
          }
        >
          <ArrowLeft size={17} />
          Practice
        </button>

        <div className="workspace-brand">
          <span>Mentora</span>
          <span>.</span>
        </div>

        <div className="workspace-header-right">
          <Code2 size={17} />

          <span>
            {LANGUAGE_LABELS[language]}
          </span>
        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="workspace-main">

        {/* ===================================================
            LEFT SIDE
        =================================================== */}

        <section className="workspace-left">

          {/* PROBLEM */}

          <div className="workspace-problem">

            <div className="workspace-problem-header">

              <div>

                <div className="workspace-meta">

                  <span
                    className={`workspace-difficulty workspace-${problem.difficulty.toLowerCase()}`}
                  >
                    {problem.difficulty}
                  </span>

                  <span>
                    {problem.topic}
                  </span>

                  {problem.estimatedTime && (
                    <span>
                      <Clock3 size={13} />
                      {problem.estimatedTime} min
                    </span>
                  )}

                </div>

                <h1>
                  {problem.title}
                </h1>

              </div>

              <CheckCircle2
                size={23}
                className="workspace-problem-icon"
              />

            </div>

            {/* DESCRIPTION */}

            <div className="workspace-section">

              <div className="workspace-section-title">
                <Target size={16} />
                <h2>Problem</h2>
              </div>

              <p>
                {problem.description}
              </p>

            </div>

            {/* EXAMPLES */}

            <div className="workspace-section">

              <div className="workspace-section-title">
                <Layers3 size={16} />
                <h2>Examples</h2>
              </div>

              <div className="workspace-example-tabs">

                {examples.map(
                  (_, index) => (
                    <button
                      key={index}
                      className={
                        selectedExample === index
                          ? "workspace-example-tab active"
                          : "workspace-example-tab"
                      }
                      onClick={() =>
                        setSelectedExample(index)
                      }
                    >
                      Example {index + 1}
                    </button>
                  )
                )}

              </div>

              {examples[selectedExample] && (
                <div className="workspace-example">

                  <div className="workspace-example-block">

                    <strong>
                      Input
                    </strong>

                    <pre>
                      {examples[
                        selectedExample
                      ].input}
                    </pre>

                  </div>

                  <div className="workspace-example-block">

                    <strong>
                      Expected Output
                    </strong>

                    <pre>
                      {examples[
                        selectedExample
                      ].output}
                    </pre>

                  </div>

                  {examples[
                    selectedExample
                  ].explanation && (
                    <div className="workspace-example-explanation">

                      <strong>
                        Explanation
                      </strong>

                      <p>
                        {
                          examples[
                            selectedExample
                          ].explanation
                        }
                      </p>

                    </div>
                  )}

                </div>
              )}

            </div>

            {/* CONSTRAINTS */}

            <div className="workspace-section">

              <div className="workspace-section-title">
                <Zap size={16} />
                <h2>Constraints</h2>
              </div>

              <div className="workspace-constraints">

                {problem.constraints?.length ? (
                  problem.constraints.map(
                    (constraint, index) => (
                      <code key={index}>
                        {constraint}
                      </code>
                    )
                  )
                ) : (
                  <>
                    <code>
                      Input follows the problem definition.
                    </code>

                    <code>
                      Return the required result.
                    </code>
                  </>
                )}

              </div>

            </div>

            {/* TAGS */}

            {problem.tags && (
              <div className="workspace-section">

                <div className="workspace-section-title">
                  <BookOpen size={16} />
                  <h2>Topics</h2>
                </div>

                <div className="workspace-tags">

                  {problem.tags
                    .split(",")
                    .map((tag) => (
                      <span key={tag}>
                        {tag.trim()}
                      </span>
                    ))}

                </div>

              </div>
            )}

          </div>

          {/* =================================================
              CONCEPT MODULES — LEFT SIDE
          ================================================= */}

          {concept && (
            <section className="workspace-learning">

              <div className="workspace-learning-header">

                <div className="workspace-learning-icon">
                  <BrainCircuit size={21} />
                </div>

                <div>
                  <span>
                    MENTORA LEARNING
                  </span>

                  <h2>
                    Learn {concept.title}
                  </h2>
                </div>

              </div>

              <p className="workspace-learning-description">
                Learn multiple approaches to solve
                this type of problem.
              </p>

              {/* MODULE LIST */}

              <div className="workspace-module-list">

                {concept.approaches.map(
                  (approach, index) => (
                    <button
                      key={approach.name}
                      className={
                        selectedApproach === index
                          ? "workspace-module active"
                          : "workspace-module"
                      }
                      onClick={() =>
                        setSelectedApproach(index)
                      }
                    >

                      <span className="workspace-module-number">
                        {index + 1}
                      </span>

                      <span className="workspace-module-info">

                        <strong>
                          {approach.name}
                        </strong>

                        <small>
                          {approach.complexity}
                        </small>

                      </span>

                    </button>
                  )
                )}

              </div>

              {/* SELECTED CONCEPT */}

              {currentApproach && (
                <div className="workspace-concept-card">

                  <div className="workspace-concept-card-header">

                    <div>

                      <span>
                        CONCEPT
                      </span>

                      <h3>
                        {currentApproach.name}
                      </h3>

                    </div>

                    <Lightbulb size={20} />

                  </div>

                  <p>
                    {currentApproach.explanation}
                  </p>

                  <div className="workspace-when">

                    <strong>
                      When to use
                    </strong>

                    <span>
                      {currentApproach.whenToUse}
                    </span>

                  </div>

                </div>
              )}

              {/* AI VIDEO */}

              <div className="workspace-ai-video">

                <div className="workspace-ai-video-icon">
                  <Video size={21} />
                </div>

                <div>

                  <span>
                    AI CONCEPT VIDEO
                  </span>

                  <h3>
                    Learn visually
                  </h3>

                  <p>
                    An AI-generated explanation
                    for this concept will appear here.
                  </p>

                </div>

                <button
                  className="workspace-video-button"
                  type="button"
                  onClick={() =>
                    setActiveTab("concept")
                  }
                >
                  <Play size={14} />
                  Watch
                </button>

              </div>

            </section>
          )}

        </section>

        {/* ===================================================
            RIGHT CODE WORKSPACE
        =================================================== */}

        <section className="workspace-editor-panel">

          {/* EDITOR HEADER */}

          <div className="workspace-editor-header">

            <div className="workspace-editor-title">
              <Terminal size={17} />
              <span>Code</span>
            </div>

            <div className="workspace-language">

              <label htmlFor="language-select">
                Language
              </label>

              <div className="workspace-select-wrapper">

                <select
                  id="language-select"
                  value={language}
                  onChange={(event) =>
                    handleLanguageChange(
                      event.target.value as Language
                    )
                  }
                >

                  <option value="java">
                    Java
                  </option>

                  <option value="python">
                    Python
                  </option>

                  <option value="c">
                    C
                  </option>

                  <option value="cpp">
                    C++
                  </option>

                </select>

                <ChevronDown size={14} />

              </div>

            </div>

          </div>

          {/* FILE TOOLBAR */}

          <div className="workspace-editor-toolbar">

            <div className="workspace-file-tab">

              <span className="workspace-file-dot" />

              <span>
                Solution.
                {language === "java"
                  ? "java"
                  : language === "python"
                  ? "py"
                  : language === "cpp"
                  ? "cpp"
                  : "c"}
              </span>

            </div>

            <button
              className="workspace-reset-button"
              onClick={handleResetCode}
            >
              <RotateCcw size={14} />
              Reset
            </button>

          </div>

          {/* MONACO */}

          <div className="workspace-editor">

            <Editor
              height="100%"
              language={
                MONACO_LANGUAGES[language]
              }
              theme="vs-dark"
              value={code}
              onChange={(value) =>
                setCode(value ?? "")
              }
              options={{
                minimap: {
                  enabled: true,
                },

                fontSize: 14,

                lineHeight: 23,

                fontFamily:
                  "'Cascadia Code', 'Fira Code', Consolas, monospace",

                fontLigatures: true,

                automaticLayout: true,

                smoothScrolling: true,

                scrollBeyondLastLine: false,

                wordWrap: "on",

                padding: {
                  top: 18,
                  bottom: 18,
                },

                suggestOnTriggerCharacters: true,

                tabSize: 4,

                cursorBlinking: "smooth",

                renderWhitespace: "selection",

                bracketPairColorization: {
                  enabled: true,
                },

                guides: {
                  bracketPairs: true,
                  indentation: true,
                },

                roundedSelection: true,

                overviewRulerBorder: false,
              }}
            />

          </div>

          {/* ACTION BAR */}

          <div className="workspace-actions">

            <div className="workspace-action-info">

              <Code2 size={14} />

              <span>
                {LANGUAGE_LABELS[language]}
              </span>

              {runComplete && (
                <span className="workspace-success-label">
                  ✓ Ready
                </span>
              )}

            </div>

            <div className="workspace-action-buttons">

              <button
                className="workspace-simulate-button"
                onClick={handleSimulation}
              >
                <Eye size={15} />
                Simulate
              </button>

              <button
                className="workspace-run-button"
                onClick={handleRun}
                disabled={running}
              >
                <Play size={15} />

                {running
                  ? "Running..."
                  : "Run"}
              </button>

              <button
                className="workspace-submit-button"
                onClick={handleSubmit}
                disabled={submitting}
              >
                <Send size={15} />

                {submitting
                  ? "Submitting..."
                  : "Submit"}
              </button>

            </div>

          </div>

          {/* =================================================
              BOTTOM PANEL
          ================================================= */}

          <div className="workspace-bottom">

            {/* TABS */}

            <div className="workspace-bottom-tabs">

              <button
                className={
                  activeTab === "concept"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab("concept")
                }
              >
                <BookOpen size={15} />
                Learn Concept
              </button>

              <button
                className={
                  activeTab === "simulate"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab("simulate")
                }
              >
                <FlaskConical size={15} />
                Simulate
              </button>

              <button
                className={
                  activeTab === "output"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab("output")
                }
              >
                <Terminal size={15} />
                Output
              </button>

            </div>

            {/* =================================================
                CONCEPT TAB
            ================================================= */}

            {activeTab === "concept" && concept && (
              <div className="workspace-concept-bottom">

                <div className="workspace-concept-bottom-header">

                  <div>

                    <span>
                      CONCEPT OVERVIEW
                    </span>

                    <h2>
                      {concept.title}
                    </h2>

                  </div>

                  <BrainCircuit size={23} />

                </div>

                <p>
                  {concept.description}
                </p>

                <div className="workspace-concept-grid">

                  {concept.approaches.map(
                    (approach, index) => (
                      <button
                        key={approach.name}
                        className={
                          selectedApproach === index
                            ? "workspace-approach-card selected"
                            : "workspace-approach-card"
                        }
                        onClick={() =>
                          setSelectedApproach(index)
                        }
                      >

                        <div className="workspace-approach-number">
                          {index + 1}
                        </div>

                        <div>

                          <h3>
                            {approach.name}
                          </h3>

                          <span>
                            {approach.complexity}
                          </span>

                          <p>
                            {approach.explanation}
                          </p>

                        </div>

                      </button>
                    )
                  )}

                </div>

              </div>
            )}

            {/* =================================================
                SIMULATE TAB
            ================================================= */}

            {activeTab === "simulate" && (
              <div className="workspace-simulation-panel">

                <div className="workspace-simulation-heading">

                  <div>

                    <span>
                      STEP-BY-STEP EXECUTION
                    </span>

                    <h2>
                      {currentSimulation?.title ||
                        "Simulation"}
                    </h2>

                  </div>

                  <div className="workspace-step-count">
                    Step {simulationStep + 1} /{" "}
                    {simulationSteps.length}
                  </div>

                </div>

                <p className="workspace-simulation-description">
                  {currentSimulation?.description}
                </p>

                <pre className="workspace-simulation-code">
                  {currentSimulation?.code}
                </pre>

                <div className="workspace-simulation-controls">

                  <button
                    onClick={
                      previousSimulationStep
                    }
                    disabled={
                      simulationStep === 0
                    }
                  >
                    ← Previous
                  </button>

                  <button
                    onClick={
                      nextSimulationStep
                    }
                    disabled={
                      simulationStep ===
                      simulationSteps.length - 1
                    }
                  >
                    Next Step →
                  </button>

                </div>

              </div>
            )}

            {/* =================================================
                OUTPUT TAB
            ================================================= */}

            {activeTab === "output" && (
              <div className="workspace-output">

                <div className="workspace-output-header">

                  <span>
                    Terminal Output
                  </span>

                  {submitComplete && (
                    <span className="workspace-submitted">
                      ✓ Accepted
                    </span>
                  )}

                </div>

                <pre>
                  {output ||
                    "Run your code to see the output here."}
                </pre>

              </div>
            )}

            {/* TEST RESULTS */}

            {testResults.length > 0 && (
              <div className="workspace-test-results">

                <div className="workspace-test-results-header">

                  <span>
                    Test Cases
                  </span>

                  <span>
                    {
                      testResults.filter(
                        (result) =>
                          result.passed
                      ).length
                    }{" "}
                    / {testResults.length} passed
                  </span>

                </div>

                {testResults.map(
                  (result) => (
                    <div
                      key={result.id}
                      className="workspace-test-row"
                    >

                      {result.passed ? (
                        <CheckCircle2
                          size={16}
                          className="test-pass"
                        />
                      ) : (
                        <XCircle
                          size={16}
                          className="test-fail"
                        />
                      )}

                      <span>
                        Test Case {result.id}
                      </span>

                      <span className="test-visibility">
                        {result.hidden
                          ? "Hidden"
                          : "Visible"}
                      </span>

                      <strong
                        className={
                          result.passed
                            ? "test-pass"
                            : "test-fail"
                        }
                      >
                        {result.passed
                          ? "Passed"
                          : "Failed"}
                      </strong>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

        </section>

      </main>

    </div>
  );
}