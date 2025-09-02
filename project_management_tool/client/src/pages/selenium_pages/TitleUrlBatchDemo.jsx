import React, { useEffect } from "react";

/**
 * Demo for title + URL ExpectedConditions
 *
 * Timeline:
 *  - Title changes: "Demo Start" -> "Loaded Page" -> "Final Title"
 *  - URL changes: base -> ?step=1 -> /final
 */
export default function TitleUrlBatchDemo() {
  useEffect(() => {
    document.title = "Demo Start";
    const t1 = setTimeout(() => {
      document.title = "Loaded Page";                 // for titleContains
      window.history.pushState({}, "", "?step=1");    // for urlContains
    }, 1000);
    const t2 = setTimeout(() => {
      document.title = "Final Title";                 // for titleIs
      window.history.pushState({}, "", "/final");     // for urlToBe
    }, 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-6 bg-indigo-600 text-white shadow">
        <h1 className="text-2xl font-semibold">Selenium ExpectedConditions — Title & URL</h1>
        <p className="text-sm opacity-90">Demo for titleContains, titleIs, urlContains, urlMatches, urlToBe</p>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-8">
        <section>
          <h2 className="font-bold">Watch the browser tab title & URL</h2>
          <p className="p-4 border bg-yellow-100 rounded">Changes happen automatically after ~1s and ~2s</p>
        </section>
      </main>
    </div>
  );
}
