import React, { useEffect, useState } from "react";
export default function FramePlayground() {
  const [showFrames, setShowFrames] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowFrames(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const innerHtml = (label) => `
    <html>      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: ui-sans-serif, system-ui; padding: 1rem; }
          .box { padding: .5rem .75rem; border: 1px solid #ddd; border-radius: .5rem; }
          .mt { margin-top: .5rem; }
          button { padding: .5rem .75rem; border-radius: .5rem; border: 1px solid #999; background:#f5f5f5; cursor:pointer;}
          input { padding:.4rem .6rem; border:1px solid #bbb; border-radius:.4rem; }
        </style>
      </head>
      <body>
        <div class="box"><strong>${label}</strong></div>
        <div class="mt">
          <input id="typed" placeholder="type here" />
          <button id="sayHiBtn" onclick="document.getElementById('typed').value='Hello from ${label}'">Fill</button>
        </div>
      </body>
    </html>
  `;

  // First frame (index=0) has a NESTED iframe inside srcDoc
  const outerWithNested = `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: ui-sans-serif, system-ui; padding: 1rem; }
          .box { padding: .5rem .75rem; border: 1px solid #ddd; border-radius: .5rem; }
          .mt { margin-top: .5rem; }
          iframe { width: 100%; height: 120px; border:2px solid #aaa; border-radius:.5rem; }
          button { padding: .5rem .75rem; border-radius: .5rem; border: 1px solid #999; background:#f5f5f5; cursor:pointer;}
          input { padding:.4rem .6rem; border:1px solid #bbb; border-radius:.4rem; }
        </style>
      </head>
      <body>
        <div class="box"><strong>Top frame (index=0)</strong></div>
        <div class="mt">
          <input id="outerInput" placeholder="outer input" />
          <button id="outerBtn" onclick="document.getElementById('outerInput').value='Outer set'">Fill Outer</button>
        </div>

        <div class="mt box">Nested iframe below:</div>
        <iframe id="nestedInner" srcdoc='${innerHtml("Nested inner frame")}'></iframe>
      </body>
    </html>
  `;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-6 bg-indigo-600 text-white shadow">
        <h1 className="text-2xl font-semibold">Frames Playground</h1>
        <p className="text-sm opacity-90">
          Four top-level iframes + one nested inside the first. They render ~1.2s after load.
        </p>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {!showFrames ? (
          <p className="italic text-gray-500">Loading frames…</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1) index=0 (also contains nested iframe) */}
            <iframe
              id="frameIndex"
              title="Frame by Index"
              srcDoc={outerWithNested}
              className="w-full h-64 border-2 rounded-xl"
            />

            {/* 2) name=frameByName */}
            <iframe
              name="frameByName"
              title="Frame by Name"
              srcDoc={innerHtml('Frame by name="frameByName"')}
              className="w-full h-48 border-2 rounded-xl"
            />

            {/* 3) id=frameByLocator */}
            <iframe
              id="frameByLocator"
              title="Frame by Locator"
              srcDoc={innerHtml('Frame by id="frameByLocator"')}
              className="w-full h-48 border-2 rounded-xl"
            />

            {/* 4) id=frameByElement */}
            <iframe
              id="frameByElement"
              title="Frame by Element"
              srcDoc={innerHtml('Frame by WebElement')}
              className="w-full h-48 border-2 rounded-xl"
            />
          </div>
        )}
      </main>
    </div>
  );
}
