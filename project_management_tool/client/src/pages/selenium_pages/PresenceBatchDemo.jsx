import React, { useEffect, useState, useRef } from "react";

/**
 * Presence demo:
 *  - new elements get added after delays (so wait conditions have effect)
 *  - Some nested structures (parent->child divs)
 */
export default function PresenceBatchDemo() {
  const [showItems, setShowItems] = useState(false);
  const [showSingle, setShowSingle] = useState(false);
  const [showNested, setShowNested] = useState(false);
  const [showNestedEl, setShowNestedEl] = useState(false);
  const [showNestedGroup, setShowNestedGroup] = useState(false);

  const parentRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setShowItems(true), 1000);       // for 33
    const t2 = setTimeout(() => setShowSingle(true), 1400);      // for 34
    const t3 = setTimeout(() => setShowNested(true), 1800);      // for 35
    const t4 = setTimeout(() => setShowNestedEl(true), 2200);    // for 36
    const t5 = setTimeout(() => setShowNestedGroup(true), 2600); // for 37
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-6 bg-indigo-600 text-white shadow">
        <h1 className="text-2xl font-semibold">Selenium ExpectedConditions — Presence batch</h1>
        <p className="text-sm opacity-90">Demo for presenceOf*</p>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-8">

        {/* 33) presenceOfAllElementsLocatedBy */}
        <section>
          <h2 className="font-bold">33) presenceOfAllElementsLocatedBy(By)</h2>
          <div id="itemsBox" className="space-y-2">
            {showItems && (
              <>
                <div className="dyn p-2 bg-green-100 border">Item A</div>
                <div className="dyn p-2 bg-green-100 border">Item B</div>
              </>
            )}
          </div>
        </section>

        {/* 34) presenceOfElementLocated */}
        <section>
          <h2 className="font-bold">34) presenceOfElementLocated(By)</h2>
          <div id="singleBox">
            {showSingle && (
              <div className="p-2 bg-blue-100 border">I appear at ~1.4s</div>
            )}
          </div>
        </section>

        {/* 35) presenceOfNestedElementLocatedBy(By parent, By child) */}
        <section>
          <h2 className="font-bold">35) presenceOfNestedElementLocatedBy(By, By)</h2>
          <div id="parentBy" className="p-2 border bg-yellow-50">
            Parent (id="parentBy")
            {showNested && <div className="child p-2 mt-2 bg-yellow-200">Child inside parentBy</div>}
          </div>
        </section>

        {/* 36) presenceOfNestedElementLocatedBy(WebElement, By) */}
        <section>
          <h2 className="font-bold">36) presenceOfNestedElementLocatedBy(WebElement, By)</h2>
          <div id="parentEl" ref={parentRef} className="p-2 border bg-purple-50">
            Parent (id="parentEl")
            {showNestedEl && <div className="kid p-2 mt-2 bg-purple-200">Kid inside parentEl</div>}
          </div>
        </section>

        {/* 37) presenceOfNestedElementsLocatedBy(By parent, By child) */}
        <section>
          <h2 className="font-bold">37) presenceOfNestedElementsLocatedBy(By, By)</h2>
          <div id="groupParent" className="p-2 border bg-red-50">
            Parent (id="groupParent")
            {showNestedGroup && (
              <>
                <div className="gchild p-2 mt-2 bg-red-200">Group Child 1</div>
                <div className="gchild p-2 mt-2 bg-red-200">Group Child 2</div>
              </>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
