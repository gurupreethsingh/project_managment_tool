import React, {useEffect, useState } from "react";

export default function WindowOrBatchDemo() {
  const [color, setColor] = useState("bg-red-200");

  useEffect(() => {
    const t = setTimeout(() => setColor("bg-green-200"), 1200);
    return () => clearTimeout(t);}, []);

  const openWindow = () => {
    window.open(
      "about:blank",
      "_blank",
      "width=400,height=300"
    );  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-6 bg-indigo-600 text-white shadow">
        <h1 className="text-2xl font-semibold">Selenium ExpectedConditions — Windows & OR</h1>
        <p className="text-sm opacity-90">Demo for numberOfWindowsToBe / or(...)</p>
      </header>
      <main className="max-w-3xl mx-auto p-6 space-y-8">
        {/* 31) numberOfWindowsToBe */}
        <section>
          <h2 className="font-bold">31) numberOfWindowsToBe</h2>
          <button            id="openWinBtn"            onClick={openWindow}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >            Open Window
          </button>
          <p className="text-xs mt-2">Click above to spawn a new tab/window.</p>
        </section>
        {/* 32) or(...) */}
        <section>
          <h2 className="font-bold">32) or(ExpectedCondition...)</h2>
          <div
            id="colorBox"
            className={`p-4 border rounded ${color}`}
          >
            Color box starts red, turns green after 1.2s
          </div>
        </section>
      </main>
    </div>
  );
}
