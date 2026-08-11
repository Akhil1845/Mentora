import React from "react";

interface CodeSimulationEvent {
  line?: number;
  event?: string;
  title?: string;
  description?: string;
  variables?: Record<string, unknown>;
}

interface CodeVisualizationProps {
  event: CodeSimulationEvent | null;
  stepNumber?: number;
  totalSteps?: number;
}

const CodeVisualization: React.FC<CodeVisualizationProps> = ({
  event,
  stepNumber = 1,
  totalSteps = 1,
}) => {
  if (!event) {
    return (
      <div
        style={{
          width: "100%",
          padding: "28px",
          borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "#111214",
          color: "#ffffff",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <span style={{ fontSize: "22px" }}>🎬</span>

          <h3
            style={{
              margin: 0,
              fontSize: "17px",
            }}
          >
            Code Simulation
          </h3>
        </div>

        <p
          style={{
            margin: 0,
            color: "#999",
            lineHeight: 1.6,
          }}
        >
          Run Code Simulation to see your code
          execute step by step.
        </p>
      </div>
    );
  }

  const variables = event.variables || {};

  const variableEntries = Object.entries(
    variables
  );

  const progress =
    totalSteps > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (stepNumber / totalSteps) * 100
          )
        )
      : 0;

  const getValueDisplay = (
    value: unknown
  ): string => {
    if (value === null) {
      return "null";
    }

    if (value === undefined) {
      return "undefined";
    }

    if (typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }

    return String(value);
  };

  const getVariableIcon = (
    name: string
  ): string => {
    const lower = name.toLowerCase();

    if (
      lower.includes("array") ||
      lower.includes("nums")
    ) {
      return "▤";
    }

    if (
      lower.includes("map") ||
      lower.includes("hash")
    ) {
      return "⌗";
    }

    if (
      lower.includes("index") ||
      lower === "i" ||
      lower === "j"
    ) {
      return "↕";
    }

    if (
      lower.includes("target") ||
      lower.includes("need")
    ) {
      return "🎯";
    }

    if (
      lower.includes("result") ||
      lower.includes("answer")
    ) {
      return "✓";
    }

    return "•";
  };

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        color: "#ffffff",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "20px",
          marginBottom: "18px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "#ff7548",
              marginBottom: "7px",
            }}
          >
            CODE EXECUTION
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            {event.title || "Executing Code"}
          </h2>

          {event.event && (
            <div
              style={{
                marginTop: "7px",
                fontSize: "12px",
                color: "#8f8f8f",
              }}
            >
              {event.event}
            </div>
          )}
        </div>

        <div
          style={{
            padding: "7px 11px",
            borderRadius: "8px",
            background:
              "rgba(139, 92, 246, 0.12)",
            border:
              "1px solid rgba(139, 92, 246, 0.25)",
            fontSize: "12px",
            whiteSpace: "nowrap",
          }}
        >
          Step {stepNumber} / {totalSteps}
        </div>
      </div>

      {/* =====================================================
          PROGRESS
      ===================================================== */}

      <div
        style={{
          width: "100%",
          height: "5px",
          borderRadius: "99px",
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            borderRadius: "99px",
            background: "#8b5cf6",
            transition:
              "width 0.35s ease",
          }}
        />
      </div>

      {/* =====================================================
          EXPLANATION
      ===================================================== */}

      <div
        style={{
          padding: "18px",
          borderRadius: "12px",
          background:
            "rgba(255,255,255,0.025)",
          border:
            "1px solid rgba(255,255,255,0.08)",
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            marginBottom: "9px",
          }}
        >
          <span
            style={{
              fontSize: "18px",
            }}
          >
            🧠
          </span>

          <strong
            style={{
              fontSize: "13px",
            }}
          >
            What is happening?
          </strong>
        </div>

        <p
          style={{
            margin: 0,
            color: "#b8b8b8",
            lineHeight: 1.7,
            fontSize: "14px",
          }}
        >
          {event.description ||
            "Mentora is executing this step of your solution."}
        </p>
      </div>

      {/* =====================================================
          VISUALIZATION AREA
      ===================================================== */}

      <div
        style={{
          padding: "20px",
          borderRadius: "14px",
          background: "#0b0c0e",
          border:
            "1px solid rgba(255,255,255,0.08)",
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "#999",
            }}
          >
            LIVE STATE
          </span>
        </div>

        {variableEntries.length === 0 ? (
          <div
            style={{
              padding: "25px",
              textAlign: "center",
              color: "#777",
              borderRadius: "10px",
              border:
                "1px dashed rgba(255,255,255,0.1)",
            }}
          >
            No variables available for
            this step.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(170px, 1fr))",
              gap: "12px",
            }}
          >
            {variableEntries.map(
              ([name, value]) => (
                <div
                  key={name}
                  style={{
                    padding: "14px",
                    borderRadius: "11px",
                    background:
                      "rgba(255,255,255,0.035)",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "9px",
                    }}
                  >
                    <span
                      style={{
                        width: "25px",
                        height: "25px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "7px",
                        background:
                          "rgba(139,92,246,0.14)",
                        color: "#b69cff",
                        fontSize: "13px",
                      }}
                    >
                      {getVariableIcon(name)}
                    </span>

                    <span
                      style={{
                        fontSize: "12px",
                        color: "#999",
                      }}
                    >
                      {name}
                    </span>
                  </div>

                  <code
                    style={{
                      display: "block",
                      color: "#ffffff",
                      fontSize: "14px",
                      lineHeight: 1.5,
                      wordBreak: "break-word",
                      fontFamily:
                        "'Cascadia Code', Consolas, monospace",
                    }}
                  >
                    {getValueDisplay(value)}
                  </code>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          ARRAY VISUALIZATION
      ===================================================== */}

      {variableEntries.some(
        ([name]) =>
          name.toLowerCase() === "nums" ||
          name.toLowerCase() === "array"
      ) && (
        <ArrayVisualization
          variables={variables}
        />
      )}

      {/* =====================================================
          HASHMAP VISUALIZATION
      ===================================================== */}

      {variableEntries.some(
        ([name]) => {
          const lower = name.toLowerCase();

          return (
            lower.includes("map") ||
            lower.includes("hash")
          );
        }
      ) && (
        <HashMapVisualization
          variables={variables}
        />
      )}

      {/* =====================================================
          CURRENT LINE
      ===================================================== */}

      {event.line &&
        event.line > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
              padding: "12px 14px",
              borderRadius: "10px",
              background:
                "rgba(139,92,246,0.08)",
              border:
                "1px solid rgba(139,92,246,0.2)",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                color: "#999",
              }}
            >
              Currently executing
            </span>

            <code
              style={{
                color: "#b69cff",
                fontSize: "13px",
              }}
            >
              Line {event.line}
            </code>
          </div>
        )}
    </div>
  );
};

/* ============================================================
   ARRAY VISUALIZATION
============================================================ */

interface ArrayVisualizationProps {
  variables: Record<string, unknown>;
}

const ArrayVisualization: React.FC<
  ArrayVisualizationProps
> = ({ variables }) => {
  const arrayEntry = Object.entries(
    variables
  ).find(
    ([name, value]) =>
      (name.toLowerCase() === "nums" ||
        name.toLowerCase() === "array") &&
      Array.isArray(value)
  );

  if (!arrayEntry) {
    return null;
  }

  const [, rawArray] = arrayEntry;

  const array = Array.isArray(rawArray)
    ? rawArray
    : [];

  const currentIndex =
    typeof variables.i === "number"
      ? variables.i
      : typeof variables.index === "number"
      ? variables.index
      : -1;

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "14px",
        background: "#0b0c0e",
        border:
          "1px solid rgba(255,255,255,0.08)",
        marginBottom: "18px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "#999",
          }}
        >
          ARRAY
        </span>

        {currentIndex >= 0 && (
          <span
            style={{
              fontSize: "11px",
              color: "#8b5cf6",
            }}
          >
            Current index: {currentIndex}
          </span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "9px",
        }}
      >
        {array.map(
          (value, index) => {
            const isCurrent =
              index === currentIndex;

            return (
              <div
                key={index}
                style={{
                  minWidth: "58px",
                  padding: "11px 10px",
                  borderRadius: "9px",
                  textAlign: "center",
                  background: isCurrent
                    ? "rgba(139,92,246,0.2)"
                    : "rgba(255,255,255,0.035)",
                  border: isCurrent
                    ? "1px solid rgba(139,92,246,0.65)"
                    : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: isCurrent
                    ? "0 0 18px rgba(139,92,246,0.15)"
                    : "none",
                  transition:
                    "all 0.35s ease",
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    color: isCurrent
                      ? "#b69cff"
                      : "#666",
                    marginBottom: "5px",
                  }}
                >
                  [{index}]
                </div>

                <code
                  style={{
                    fontSize: "14px",
                    color: isCurrent
                      ? "#ffffff"
                      : "#bbbbbb",
                  }}
                >
                  {String(value)}
                </code>

                {isCurrent && (
                  <div
                    style={{
                      marginTop: "5px",
                      fontSize: "10px",
                      color: "#b69cff",
                    }}
                  >
                    ↑ current
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

/* ============================================================
   HASHMAP VISUALIZATION
============================================================ */

interface HashMapVisualizationProps {
  variables: Record<string, unknown>;
}

const HashMapVisualization: React.FC<
  HashMapVisualizationProps
> = ({ variables }) => {
  const mapEntry = Object.entries(
    variables
  ).find(([name]) => {
    const lower = name.toLowerCase();

    return (
      lower.includes("map") ||
      lower.includes("hash")
    );
  });

  if (!mapEntry) {
    return null;
  }

  const [, rawMap] = mapEntry;

  let entries: Array<
    [string, unknown]
  > = [];

  if (
    rawMap &&
    typeof rawMap === "object" &&
    !Array.isArray(rawMap)
  ) {
    entries = Object.entries(
      rawMap as Record<string, unknown>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "14px",
        background: "#0b0c0e",
        border:
          "1px solid rgba(255,255,255,0.08)",
        marginBottom: "18px",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: "#999",
          marginBottom: "15px",
        }}
      >
        HASHMAP
      </div>

      {entries.length === 0 ? (
        <div
          style={{
            padding: "15px",
            borderRadius: "9px",
            border:
              "1px dashed rgba(255,255,255,0.1)",
            color: "#666",
            textAlign: "center",
            fontSize: "13px",
          }}
        >
          HashMap is empty
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {entries.map(
            ([key, value]) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    padding: "11px 13px",
                    borderRadius: "9px",
                    background:
                      "rgba(255,255,255,0.035)",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    fontFamily:
                      "monospace",
                    color: "#ffffff",
                  }}
                >
                  {key}
                </div>

                <span
                  style={{
                    color: "#8b5cf6",
                    fontSize: "16px",
                  }}
                >
                  →
                </span>

                <div
                  style={{
                    flex: 1,
                    padding: "11px 13px",
                    borderRadius: "9px",
                    background:
                      "rgba(139,92,246,0.08)",
                    border:
                      "1px solid rgba(139,92,246,0.2)",
                    fontFamily:
                      "monospace",
                    color: "#b69cff",
                  }}
                >
                  {String(value)}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default CodeVisualization;