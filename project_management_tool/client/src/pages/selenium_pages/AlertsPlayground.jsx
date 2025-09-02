import React, { useEffect, useState } from "react";

export default function AlertsPlayground() {
  const [beforeUnloadOn, setBeforeUnloadOn] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);

  // Inject Bootstrap + Tailwind CDN
  useEffect(() => {
    const bCss = document.createElement("link");
    bCss.rel = "stylesheet";
    bCss.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
    document.head.appendChild(bCss);
    const bJs = document.createElement("script");
    bJs.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
    document.body.appendChild(bJs);
    const tw = document.createElement("script");
    tw.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(tw);

    return () => { [bCss, bJs, tw].forEach(el => el && el.remove()); };  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (beforeUnloadOn) {
        // Standard beforeunload pattern — browsers show a confirmation dialog.
        e.preventDefault();
        e.returnValue = ""; // required by spec to trigger the dialog
        return "";          // Safari
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [beforeUnloadOn]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <header className="p-4 rounded-xl bg-indigo-600 text-white shadow mb-6">
        <h1 className="text-2xl font-semibold">Alerts Playground</h1>
        <p className="text-sm opacity-90">JS alerts, confirm, prompt, beforeunload + Bootstrap/custom modals</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* === Real browser dialogs === */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold">A) Real JS dialogs</h2>
          <button id="btnAlert" className="btn btn-primary"  onClick={() => window.alert("Hello from window.alert!")}>
            Show alert()          </button>
          <button id="btnConfirm" className="btn btn-warning"
                  onClick={() => window.confirm("Do you want to proceed?")}>    Show confirm()  </button>
          <button id="btnPrompt" className="btn btn-info"
                  onClick={() => window.prompt("What is your name?", "John")}> Show prompt() </button>
          <div className="mt-3 form-check">
            <input id="chkBeforeUnload" className="form-check-input" type="checkbox"
                   checked={beforeUnloadOn}
                   onChange={e => setBeforeUnloadOn(e.target.checked)} />
            <label htmlFor="chkBeforeUnload" className="form-check-label">
              Enable beforeunload confirmation
            </label>          </div>
          <button id="btnNavigateAway" className="btn btn-outline-secondary"
                  onClick={() => { window.location.hash = "#leaving"; }}>
            Navigate away (triggers beforeunload if enabled)
          </button>        </section>
        {/* === Bootstrap modal & custom modal === */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold">B) “Fake” alerts (modals)</h2>
          {/* Bootstrap modal trigger */}
          <button id="btnBsModal" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#bsModal">
            Open Bootstrap modal          </button>
          {/* Bootstrap modal */}
          <div className="modal fade" id="bsModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Bootstrap Alert-like Modal</h5>
                  <button id="bsCloseX" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>                </div>
                <div className="modal-body">
                  <p id="bsModalText">This is a Bootstrap modal that looks like an alert.</p>
                </div>
                <div className="modal-footer">
                  <button id="bsCancel" type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button id="bsOk" type="button" className="btn btn-primary" data-bs-dismiss="modal">OK</button>
                </div>              </div>            </div>          </div>
          {/* Custom modal (pure HTML) */}
          <button id="btnCustomModal" className="btn btn-dark" onClick={() => setCustomOpen(true)}>
            Open Custom modal          </button>
          {customOpen && (
            <div id="customBackdrop" className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div id="customModal" className="bg-white rounded-lg p-4 w-96 shadow">
                <h3 className="text-lg font-semibold">Custom Alert Modal</h3>
                <p id="customText" className="mt-2">This is not a browser alert; it’s a normal DOM element.</p>
                <div className="mt-4 flex justify-end gap-2">
                  <button id="customCancel" className="btn btn-outline-secondary" onClick={() => setCustomOpen(false)}>Cancel</button>
                  <button id="customOk" className="btn btn-primary" onClick={() => setCustomOpen(false)}>OK</button>
                </div>              </div>            </div>          )}        </section>      </div>
      <div className="mt-8 p-4 border rounded bg-white">
        <h2 className="text-lg font-bold">C) HTTP Basic/Digest Auth (external demo)</h2>
        <p className="text-sm text-gray-600">
          Use an external page that requires HTTP auth (e.g. the-internet’s Basic Auth) to demo Selenium 4 authentication.
        </p>
        <a id="authDemoLink" className="link-primary" href="https://the-internet.herokuapp.com/basic_auth" target="_blank" rel="noreferrer">
          Open auth demo (opens in same tab if used by Selenium via driver.get)
        </a>
      </div>
    </div>
  );
}
