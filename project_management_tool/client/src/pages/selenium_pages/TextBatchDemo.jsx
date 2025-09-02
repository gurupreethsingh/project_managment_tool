import React, { useEffect, useState, useRef } from "react";

/**
 * Demo for text-related ExpectedConditions:
 * - refreshed: re-renders text
 * - stalenessOf: element removed from DOM
 * - textMatches: element text changes, matched by regex
 * - textToBe, textToBePresentInElement, textToBePresentInElementLocated
 * - textToBePresentInElementValue (input values)
 */
export default function TextBatchDemo() {
  const [msg, setMsg] = useState("Old text");
  const [removed, setRemoved] = useState(true);
  const [regexText, setRegexText] = useState("Number: 1");
  const [exactText, setExactText] = useState("Waiting...");
  const [containsText, setContainsText] = useState("Loading...");
  const [inputVal, setInputVal] = useState("");

  const removableRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setMsg("New text after refresh"), 1000);      // refreshed demo
    const t2 = setTimeout(() => setRemoved(false), 1400);                     // staleness demo (element removed)
    const t3 = setTimeout(() => setRegexText("Number: 42"), 1800);            // regex demo
    const t4 = setTimeout(() => setExactText("Done"), 2200);                  // textToBe
    const t5 = setTimeout(() => setContainsText("Loaded successfully!"), 2600); // present in element
    const t6 = setTimeout(() => setInputVal("Hello World"), 3000);            // input value demo
    return () => [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-6 bg-indigo-600 text-white shadow">
        <h1 className="text-2xl font-semibold">Selenium ExpectedConditions — Refreshed, Staleness & Text</h1>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-8">

        {/* 38) refreshed */}
        <section>
          <h2 className="font-bold">38) refreshed</h2>
          <div id="refreshBox" className="p-2 bg-green-100 border">{msg}</div>
        </section>

        {/* 39) stalenessOf */}
        <section>
          <h2 className="font-bold">39) stalenessOf</h2>
          {removed && (
            <div id="removable" ref={removableRef} className="p-2 bg-red-100 border">
              I will be removed at ~1.4s
            </div>
          )}
        </section>

        {/* 40) textMatches */}
        <section>
          <h2 className="font-bold">40) textMatches</h2>
          <div id="regexBox" className="p-2 bg-yellow-100 border">{regexText}</div>
        </section>

        {/* 41) textToBe */}
        <section>
          <h2 className="font-bold">41) textToBe</h2>
          <div id="exactBox" className="p-2 bg-blue-100 border">{exactText}</div>
        </section>

        {/* 42 & 43) textToBePresentInElement(WebElement) & textToBePresentInElementLocated(By) */}
        <section>
          <h2 className="font-bold">42 & 43) textToBePresentInElement</h2>
          <div id="containsBox" className="p-2 bg-purple-100 border">{containsText}</div>
        </section>

        {/* 44 & 45) textToBePresentInElementValue */}
        <section>
          <h2 className="font-bold">44 & 45) textToBePresentInElementValue</h2>
          <input
            id="inputBox"
            value={inputVal}
            readOnly
            className="p-2 border rounded w-full"
          />
        </section>

      </main>
    </div>
  );
}
