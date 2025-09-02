import React, { useEffect, useRef, useState } from "react";


/**
 * Demo page to practice Selenium frameToBeAvailableAndSwitchToIt
 *
 * Four frames:
 *  - #frameIndex (index=0)
 *  - name="frameByName"
 *  - #frameByLocator
 *  - #frameByElement
 *
 * They appear with a small delay so waits have something to detect.
 */

export default function FrameBatchDemo() {
  const [showFrames, setShowFrames] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowFrames(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-6 bg-indigo-600 text-white shadow">
        <h1 className="text-2xl font-semibold">Selenium ExpectedConditions — Frames</h1>
        <p className="text-sm opacity-90">Demo for frameToBeAvailableAndSwitchToIt</p>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-10">
        {!showFrames ? (
          <p className="italic text-gray-500">Frames will appear in ~1.2s...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 16) frameToBeAvailableAndSwitchToIt(int) */}
            <iframe
              id="frameIndex"
              title="Frame by Index"
              srcDoc={`<div style="font-family:sans-serif;padding:1rem;color:green;">Hello from frame index=0</div>`}
              className="w-full h-32 border-2"
            ></iframe>

            {/* 17) frameToBeAvailableAndSwitchToIt(String) */}
            <iframe
              name="frameByName"
              title="Frame by Name"
              srcDoc={`<div style="font-family:sans-serif;padding:1rem;color:blue;">Hello from frame name="frameByName"</div>`}
              className="w-full h-32 border-2"
            ></iframe>

            {/* 18) frameToBeAvailableAndSwitchToIt(By) */}
            <iframe
              id="frameByLocator"
              title="Frame by Locator"
              srcDoc={`<div style="font-family:sans-serif;padding:1rem;color:purple;">Hello from frame id="frameByLocator"</div>`}
              className="w-full h-32 border-2"
            ></iframe>

            {/* 19) frameToBeAvailableAndSwitchToIt(WebElement) */}
            <iframe
              id="frameByElement"
              title="Frame by Element"
              srcDoc={`<div style="font-family:sans-serif;padding:1rem;color:red;">Hello from frame id="frameByElement"</div>`}
              className="w-full h-32 border-2"
            ></iframe>
          </div>
        )}
      </main>
    </div>
  );
}
