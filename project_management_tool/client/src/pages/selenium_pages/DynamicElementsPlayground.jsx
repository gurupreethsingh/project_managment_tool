import React, { useEffect, useMemo, useState } from "react";

/**
 * DynamicElementsPlayground.jsx
 * - Hidden elements:
 *   H1: display:none (revealed by button)
 *   H2: visibility:hidden (we can toggle)
 *   H3: covered by overlay (intercepts clicks)
 *   H4: off-screen element (requires scrolling)
 * - Partially dynamic:
 *   P1: id="user-<RANDOM>-action" + data-testid="user-action"
 *   P2: async list with dynamic ids, but stable text
 * - Completely dynamic:
 *   C1: Product cards with random ids/classes — select by nearby text ("Product Alpha/Beta")
 *   C2: Role-based control: <div role="button">Pay Now</div>
 */

// ---- move style objects above to avoid no-use-before-define / hoisting issues
const card = { border: "1px solid #ddd", borderRadius: 8, padding: 12 };
const payBtn = {
  display: "inline-block",
  padding: "8px 12px",
  border: "1px solid #333",
  borderRadius: 8,
  cursor: "pointer",
};

function rand4() {
  return Math.floor(1000 + Math.random() * 9000);
}

export default function DynamicElementsPlayground() {
  const [showHidden, setShowHidden] = useState(false); // H1
  const [visHidden, setVisHidden] = useState(true); // H2
  const [overlayOn, setOverlayOn] = useState(true); // H3
  const [asyncRows, setAsyncRows] = useState([]); // P2

  // P1: random once per mount
  const userActionId = useMemo(() => `user-${rand4()}-action`, []);

  useEffect(() => {
    // Load async items after delay to simulate late-rendering dynamic elements (P2)
    const t = setTimeout(() => {
      setAsyncRows([
        { id: `row-${rand4()}`, label: "Row A" },
        { id: `row-${rand4()}`, label: "Row B" },
        { id: `row-${rand4()}`, label: "Row C" },
      ]);
    }, 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 16 }}>
      <header
        style={{
          padding: 16,
          background: "#4f46e5",
          color: "#fff",
          borderRadius: 12,
          marginBottom: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>Dynamic Elements Playground</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>
          Hidden / partially dynamic / completely dynamic targets
        </p>
      </header>

      {/* ==================== HIDDEN ELEMENTS ==================== */}
      <section style={{ marginBottom: 24 }}>
        <h2>H) Hidden elements</h2>

        {/* H1: display:none until revealed */}
        <div style={{ marginBottom: 12 }}>
          <button id="btnReveal" onClick={() => setShowHidden((v) => !v)}>
            {showHidden ? "Hide checkbox" : "Reveal checkbox"}
          </button>
          <label style={{ marginLeft: 12 }}>
            <input
              id="hiddenChk"
              type="checkbox"
              style={{ display: showHidden ? "inline-block" : "none" }}
            />{" "}
            I was hidden
          </label>
        </div>

        {/* H2: visibility:hidden (occupies space, non-interactive) */}
        <div style={{ marginBottom: 12 }}>
          <button
            id="btnToggleVisibility"
            onClick={() => setVisHidden((v) => !v)}
          >
            Toggle visibility:hidden target
          </button>
          <button
            id="visHiddenBtn"
            style={{ marginLeft: 12, visibility: visHidden ? "hidden" : "visible" }}
            onClick={() => alert("Clicked visible button")}
          >
            Visibility target
          </button>
        </div>

        {/* H3: covered by overlay */}
        <div
          style={{
            position: "relative",
            width: 280,
            height: 80,
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 8,
          }}
        >
          <button
            id="coveredBtn"
            style={{ position: "absolute", top: 24, left: 16 }}
            onClick={() => alert("Covered button clicked!")}
          >
            Covered Button
          </button>
          {overlayOn && (
            <div
              id="overlay"
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,.25)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <button id="closeOverlay" onClick={() => setOverlayOn(false)}>
                Close overlay
              </button>
            </div>
          )}
        </div>

        {/* H4: off-screen element down below */}
        <div style={{ height: 900 }} />
        <button
          id="offscreenBtn"
          onClick={() => alert("Offscreen clicked")}
          style={{ marginBottom: 24 }}
        >
          Off-screen button (scroll to me)
        </button>
      </section>

      {/* ==================== PARTIALLY DYNAMIC ==================== */}
      <section style={{ marginBottom: 24 }}>
        <h2>P) Partially dynamic elements</h2>

        {/* P1: predictable pattern id + stable data-testid */}
        <button
          id={userActionId}
          data-testid="user-action"
          onClick={() => alert("User Action clicked")}
        >
          User Action (id pattern: user-&lt;rand&gt;-action)
        </button>

        {/* P2: async rows with dynamic ids; text is stable */}
        <div
          id="asyncList"
          style={{ marginTop: 12, border: "1px solid #eee", borderRadius: 8, padding: 8 }}
        >
          <div style={{ fontWeight: 600 }}>Async rows</div>
          <ul id="rows">
            {asyncRows.map((r) => (
              <li key={r.id} id={r.id} className={`row-${rand4()}`}>
                {r.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ==================== COMPLETELY DYNAMIC ==================== */}
      <section style={{ marginBottom: 24 }}>
        <h2>C) Completely dynamic elements</h2>

        {/* Random classes/ids but human-visible text anchors remain */}
        <div id="products" style={{ display: "grid", gap: 12 }}>
          <div id={`card-${rand4()}`} className={`card-${rand4()}`} style={card}>
            <h3 className="title">Product Alpha</h3>
            <div className="price">₹ 999</div>
            <button className={`buy-${rand4()}`}>Buy</button>
          </div>
          <div id={`card-${rand4()}`} className={`card-${rand4()}`} style={card}>
            <h3 className="title">Product Beta</h3>
            <div className="price">₹ 1499</div>
            <button className={`buy-${rand4()}`}>Buy</button>
          </div>
        </div>

        {/* Role-based control (no id/class, only role+text) */}
        <div id="payments" style={{ marginTop: 12 }}>
          <div role="button" id={`pay-${rand4()}`} style={payBtn}>
            Pay Now
          </div>
        </div>
      </section>
    </div>
  );
}
