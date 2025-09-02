import React, { useEffect, useMemo, useState } from "react";

/**
 * Tabs / Windows Playground
 * - target=_blank link
 * - JS window.open() (tab & popup-style window)
 * - open two tabs at once
 * - Ctrl/Cmd-click friendly link
 * - per-tab title/URL markers
 * - simple localStorage write to demonstrate same-origin sharing
 * Stable IDs for Selenium.
 */

function getParam(name) {
  const m = new URL(window.location.href).searchParams.get(name);
  return m || "";
}

export default function TabsPlayground() {
  const tab = getParam("tab"); // helps make each opened tab unique
  const [notes, setNotes] = useState("");

  useEffect(() => {
    // Give each opened page a distinct title
    const base = "Tabs Playground";
    document.title = tab ? `${base} — ${tab}` : base;
  }, [tab]);

  const selfUrl = useMemo(() => window.location.origin + window.location.pathname, []);

  const openJsTab = (suffix) => {
    const u = `${selfUrl}?tab=${encodeURIComponent(suffix)}`;
    window.open(u, "_blank");
  };

  const openJsWindowPopup = (suffix) => {
    const u = `${selfUrl}?tab=${encodeURIComponent(suffix)}`;
    window.open(u, "_blank", "width=520,height=420,noopener");
  };

  const openTwoTabs = () => {
    openJsTab("dual-1");
    openJsTab("dual-2");
  };

  const writeLocalStorage = () => {
    localStorage.setItem("tabsDemoKey", `set-from-${tab || "main"}-${Date.now()}`);
    setNotes(`localStorage['tabsDemoKey'] written by ${tab || "main"}`);
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "system-ui, sans-serif", padding: 16 }}>
      <header style={{ padding: 16, background: "#4f46e5", color: "white", borderRadius: 12, marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>Tabs / Windows Playground</h1>
        <p style={{ opacity: 0.9 }}>This page is safe to open in many tabs. It embeds unique titles/URLs for targeting.</p>
      </header>
      <main style={{ display: "grid", gap: 16 }}>
        <section style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12 }}>
          <h2 style={{ fontWeight: 700 }}>Open via anchor (target=_blank)</h2>
          <a            id="linkBlank"            href={`${selfUrl}?tab=blank-link`}            target="_blank"    rel="noopener"
            style={{ display: "inline-block", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8, textDecoration: "none" }}          >            Open target=_blank tab          </a>        </section>
        <section style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12 }}>
          <h2 style={{ fontWeight: 700 }}>Open via JavaScript</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button id="btnJsTab" onClick={() => openJsTab("js-tab")} style={btn}>
              window.open() → new TAB
            </button>
            <button id="btnJsWindow" onClick={() => openJsWindowPopup("js-window")} style={btn}>
              window.open() → popup WINDOW
            </button>
            <button id="btnTwoTabs" onClick={openTwoTabs} style={btn}>
              Open TWO tabs
            </button>
          </div>
        </section>

        <section style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12 }}>
          <h2 style={{ fontWeight: 700 }}>Ctrl/Cmd-click scenario</h2>
          <p style={{ marginTop: 0 }}>Hold <kbd>Ctrl</kbd> (Windows/Linux) or <kbd>⌘ Cmd</kbd> (macOS) and click:</p>
          <a
            id="linkCtrlClick"
            href={`${selfUrl}?tab=ctrl-click`}
            style={{ display: "inline-block", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8, textDecoration: "none" }}          >            Ctrl/Cmd-click me (new tab)         </a>        </section>

        <section style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12 }}>
          <h2 style={{ fontWeight: 700 }}>Per-tab markers</h2>
          <div id="titleMarker" style={{ padding: 8, background: "#f3f4f6", borderRadius: 8 }}>
            <div>document.title = <strong>{document.title}</strong></div>
            <div>URL = <code>{window.location.href}</code></div>
            <div>tab param = <code id="tabParam">{tab || "(none)"}</code></div>
          </div>        </section>

        <section style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12 }}>
          <h2 style={{ fontWeight: 700 }}>Storage demo (same-origin sharing)</h2>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button id="btnWriteLS" onClick={writeLocalStorage} style={btn}>Write localStorage['tabsDemoKey']</button>
            <span id="notes" style={{ fontFamily: "monospace", fontSize: 12 }}>{notes}</span>
          </div>
        </section>
      </main>
    </div>
  );
}const btn={ padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8,  background: "#fff", cursor: "pointer",};
