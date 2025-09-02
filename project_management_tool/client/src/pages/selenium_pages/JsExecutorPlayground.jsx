import React, { useEffect, useRef, useState } from "react";

/**
 * JS Executor Playground
 * Targets for:
 * - Scroll page + inside container
 * - Click via JS
 * - Inputs (change/input events reflected in UI)
 * - Toggle attributes (disabled/readonly/data-*)
 * - Style/class updates
 * - Bootstrap-esque "modal" (just a DOM div)
 * - Shadow DOM host with inner content
 * - localStorage/sessionStorage
 * - Create/remove DOM nodes
 * - Measure element rects
 */

export default function JsExecutorPlayground() {
  const [textVal, setTextVal] = useState("");
  const [changeCount, setChangeCount] = useState(0);
  const [inputCount, setInputCount] = useState(0);
  const [isShown, setIsShown] = useState(false);
  const [log, setLog] = useState([]);
  const scrollBoxRef = useRef(null);
  const shadowHostRef = useRef(null);

  // Build Shadow DOM on mount
  useEffect(() => {
    if (shadowHostRef.current && !shadowHostRef.current.shadowRoot) {
      const root = shadowHostRef.current.attachShadow({ mode: "open" });
      const wrap = document.createElement("div");
      wrap.setAttribute("id", "shadowInner");
      wrap.style.padding = "12px";
      wrap.style.border = "1px solid #bbb";
      wrap.style.borderRadius = "8px";
      wrap.style.background = "#f1f5f9";
      wrap.innerHTML = `<strong id="shadowLabel">Shadow content</strong>
        <button id="shadowBtn">Shadow Button</button>`;
      root.appendChild(wrap);
    }
  }, []);

  // Simple logger
  const pushLog = (m) => setLog((prev) => [m, ...prev].slice(0, 10));

  return (
    <div style={{ minHeight: "140vh", padding: 16, fontFamily: "system-ui, sans-serif", color: "#111827" }}>
      <header style={{ padding: 16, background: "#4f46e5", color: "white", borderRadius: 12, marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>JavascriptExecutor Playground</h1>
        <p style={{ opacity: 0.9, fontSize: 14 }}>
          Use Selenium’s JavascriptExecutor to manipulate the elements below. All IDs are stable.
        </p>
      </header>

      {/* A. Page scrolling target */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700 }}>A) Page scroll & basic reads</h2>
        <p id="pageTopMarker">Top marker (id="pageTopMarker")</p>
      </section>

      {/* B. Click / value / events */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700 }}>B) Clicking & Inputs</h2>

        <button
          id="jsTargetButton"
          onClick={() => pushLog("Clicked main button")}
          style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 8, background: "white" }}
        >
          Clickable Button (id="jsTargetButton")
        </button>

        <div style={{ marginTop: 12 }}>
          <label htmlFor="textInput">Text Input (id="textInput")</label>
          <input
            id="textInput"
            value={textVal}
            onInput={() => setInputCount((c) => c + 1)}
            onChange={(e) => {
              setTextVal(e.target.value);
              setChangeCount((c) => c + 1);
            }}
            placeholder="Type here"
            style={{ marginLeft: 8, padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6 }}
          />
        </div>

        <div id="inputState" style={{ fontFamily: "monospace", fontSize: 12, marginTop: 6 }}>
          value="{textVal}" | changeCount={changeCount} | inputCount={inputCount}
        </div>

        <div style={{ marginTop: 12 }}>
          <button
            id="disableInputBtn"
            onClick={() => {
              const el = document.getElementById("textInput");
              el.toggleAttribute("disabled");
              pushLog(`Input disabled = ${el.hasAttribute("disabled")}`);
            }}
            style={{ padding: "6px 10px", border: "1px solid #ddd", borderRadius: 8, background: "#f9fafb" }}
          >
            Toggle disabled on input
          </button>
          <button
            id="readonlyInputBtn"
            onClick={() => {
              const el = document.getElementById("textInput");
              el.toggleAttribute("readonly");
              pushLog(`Input readonly = ${el.hasAttribute("readonly")}`);
            }}
            style={{ marginLeft: 8, padding: "6px 10px", border: "1px solid #ddd", borderRadius: 8, background: "#f9fafb" }}
          >
            Toggle readonly on input
          </button>
        </div>
      </section>

      {/* C. Attributes / style / class */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700 }}>C) Attributes, Class & Style</h2>
        <div id="box" data-state="idle" style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
          Box (id="box") — data-state="<span id='stateVal'>idle</span>"
        </div>
        <div style={{ marginTop: 8 }}>
          <button
            id="setAttrBtn"
            onClick={() => {
              const box = document.getElementById("box");
              box.setAttribute("data-state", "active");
              document.getElementById("stateVal").textContent = "active";
            }}
            style={{ padding: "6px 10px", border: "1px solid #ddd", borderRadius: 8, background: "#f9fafb" }}
          >
            Set data-state="active"
          </button>
          <button
            id="classToggleBtn"
            onClick={() => {
              const box = document.getElementById("box");
              box.classList.toggle("highlight");
            }}
            style={{ marginLeft: 8, padding: "6px 10px", border: "1px solid #ddd", borderRadius: 8, background: "#f9fafb" }}
          >
            Toggle class "highlight"
          </button>
          <button
            id="styleBtn"
            onClick={() => {
              const box = document.getElementById("box");
              box.style.background = "#d1fae5"; // green-100
              box.style.borderColor = "#10b981";
              box.style.boxShadow = "0 0 0 3px rgba(16,185,129,.25)";
            }}
            style={{ marginLeft: 8, padding: "6px 10px", border: "1px solid #ddd", borderRadius: 8, background: "#f9fafb" }}
          >
            Style highlight
          </button>
        </div>
      </section>

      {/* D. Scrollable container */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700 }}>D) Scrollable Container</h2>
        <div
          id="scrollBox"
          ref={scrollBoxRef}
          style={{
            height: 160,
            overflow: "auto",
            border: "1px solid #ddd",
            borderRadius: 8,
            position: "relative",
            background: "white",
          }}
        >
          <div style={{ height: 500, padding: 8 }}>
            <div style={{ position: "sticky", top: 0, background: "white" }}>
              <small id="scrollReadout">scrollTop=0 | scrollLeft=0</small>
            </div>
            <div style={{ marginTop: 420, padding: 8, background: "#fde68a", borderRadius: 8 }} id="innerDeepTarget">
              Inner deep target (id="innerDeepTarget")
            </div>
          </div>
        </div>
      </section>

      {/* E. “Modal” */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700 }}>E) Modal (DOM-only alert)</h2>
        <button
          id="openModalBtn"
          onClick={() => setIsShown(true)}
          style={{ padding: "6px 10px", border: "1px solid #ddd", borderRadius: 8, background: "white" }}
        >
          Open custom modal
        </button>
        {isShown && (
          <div id="modalBackdrop" style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,.35)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50
          }}>
            <div id="modal" style={{ background: "white", borderRadius: 10, padding: 16, width: 360 }}>
              <h3>Custom Modal</h3>
              <p id="modalText">I am a normal DOM element.</p>
              <div style={{ textAlign: "right", marginTop: 8 }}>
                <button id="modalCancel" onClick={() => setIsShown(false)} style={{ marginRight: 8 }}>Cancel</button>
                <button id="modalOk" onClick={() => setIsShown(false)}>OK</button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* F. Shadow DOM host */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700 }}>F) Shadow DOM</h2>
        <div id="shadowHost" ref={shadowHostRef} style={{ border: "1px dashed #bbb", borderRadius: 8, padding: 12 }}>
          Shadow Host (id="shadowHost")
        </div>
      </section>

      {/* G. Storage */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700 }}>G) Storage</h2>
        <div id="storageState" style={{ fontFamily: "monospace", fontSize: 12 }}>
          localStorage["demoKey"] & sessionStorage["demoKey"] will be used.
        </div>
      </section>

      {/* H. Create/remove nodes */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700 }}>H) Create / Remove nodes</h2>
        <div id="listArea" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span className="chip" style={{ padding: "4px 8px", background: "#e5e7eb", borderRadius: 999 }}>chip-1</span>
        </div>
      </section>

      {/* I. Bottom marker */}
      <section style={{ marginBottom: 24 }}>
        <div id="pageBottomMarker" style={{ padding: 8, background: "#e0f2fe", borderRadius: 8 }}>
          Bottom marker (id="pageBottomMarker")
        </div>
      </section>

      {/* Logs */}
      <section>
        <h2 style={{ fontWeight: 700 }}>Log</h2>
        <ul id="logList" style={{ fontFamily: "monospace", fontSize: 12 }}>
          {log.map((l, i) => <li key={i}>{l}</li>)}
        </ul>
      </section>

      {/* observe scrollBox scroll */}
      <ScriptScrollObserver targetRef={scrollBoxRef} />
      <style>{`.highlight { outline: 3px solid rgba(59,130,246,.6); }`}</style>
    </div>
  );
}

function ScriptScrollObserver({ targetRef }) {
  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    const onScroll = () => {
      const t = document.getElementById("scrollReadout");
      if (t) t.textContent = `scrollTop=${el.scrollTop} | scrollLeft=${el.scrollLeft}`;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [targetRef]);
  return null;
}
