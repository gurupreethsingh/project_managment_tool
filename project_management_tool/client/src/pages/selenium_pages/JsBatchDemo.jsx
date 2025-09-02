import React, { useEffect, useState } from "react";

/**
 * JS Batch Demo:
 *  - #jsBox : changes textContent using JS after 1.2s
 *  - we’ll run a harmless JS snippet (no exceptions)
 *  - also a condition wrapped with not(...)
 */

export default function JsBatchDemo() {
  const [msg, setMsg] = useState("Waiting...");

  useEffect(() => {
    const t1 = setTimeout(() => setMsg("JS Updated!"), 1200);
    return () => clearTimeout(t1);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-6 bg-emerald-600 text-white shadow">
        <h1 className="text-2xl font-semibold">Selenium ExpectedConditions — JavaScript batch</h1>
        <p className="text-sm opacity-90">Demo for javaScriptThrowsNoExceptions / jsReturnsValue / not()</p>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-8">
        {/* JS box */}
        <section>
          <h2 className="font-bold">#jsBox (text changes after 1.2s)</h2>
          <div  id="jsBox"
            className="p-4 rounded-lg bg-yellow-100 border"      >
            {msg}
          </div>
        </section>

        <section>
          <h2 className="font-bold">For "not" demo</h2>
          <p id="notTarget" className="p-2 bg-blue-100 rounded">I will stay visible</p>
        </section>
      </main>
    </div>
  );
}
