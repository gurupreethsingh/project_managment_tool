import React, { useEffect, useState } from "react";

/**
 * Demo for Selenium ExpectedConditions "invisibility*"
 *
 * Elements appear first, then are hidden (set display:none) after delays.
 */

export default function InvisibilityBatchDemo() {
  const [showEl, setShowEl] = useState(true);          // for invisibilityOf
  const [showGroup, setShowGroup] = useState(true);    // for invisibilityOfAllElements
  const [showLocated, setShowLocated] = useState(true);// for invisibilityOfElementLocated
  const [textContent, setTextContent] = useState("Hide me soon");

  useEffect(() => {
    const t1 = setTimeout(() => setShowEl(false), 1200);        // element hidden
    const t2 = setTimeout(() => setShowGroup(false), 1500);     // group hidden
    const t3 = setTimeout(() => setShowLocated(false), 1800);   // locator element hidden
    const t4 = setTimeout(() => setTextContent(""), 2100);      // text removed
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-6 bg-pink-600 text-white shadow">
        <h1 className="text-2xl font-semibold">Selenium ExpectedConditions — Invisibility</h1>
        <p className="text-sm opacity-90">Demo for invisibilityOf*, invisibilityOfElementLocated, invisibilityOfElementWithText</p>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-8">

        {/* 20) invisibilityOf(WebElement element) */}
        <section>
          <h2 className="font-bold">20) invisibilityOf(WebElement element)</h2>
          {showEl && (
            <div id="disappearEl" className="p-4 rounded-lg bg-green-100 border">
              I will disappear after ~1.2s
            </div>
          )}
        </section>

        {/* 21 & 22) invisibilityOfAllElements(List/WebElement...) */}
        <section>
          <h2 className="font-bold">21–22) invisibilityOfAllElements</h2>
          <div id="disappearGroup" className="flex gap-2">
            {showGroup && (
              <>
                <div className="box p-2 bg-blue-100 border">Box A</div>
                <div className="box p-2 bg-blue-100 border">Box B</div>
              </>
            )}
          </div>
        </section>

        {/* 23) invisibilityOfElementLocated(By locator) */}
        <section>
          <h2 className="font-bold">23) invisibilityOfElementLocated(By locator)</h2>
          {showLocated && (
            <div id="disappearBy" className="p-4 rounded-lg bg-yellow-100 border">
              I will disappear after ~1.8s
            </div>
          )}
        </section>

        {/* 24) invisibilityOfElementWithText(By locator, String text) */}
        <section>
          <h2 className="font-bold">24) invisibilityOfElementWithText(By locator, text)</h2>
          <div id="disappearText" className="p-4 rounded-lg bg-red-100 border">
            {textContent}
          </div>
        </section>

      </main>
    </div>
  );
}
