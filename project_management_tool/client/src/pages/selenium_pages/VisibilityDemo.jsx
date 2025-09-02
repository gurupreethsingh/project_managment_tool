import React, { useEffect, useState } from "react";

export default function VisibilityDemo() {
  const [showDelayed, setShowDelayed] = useState(false);
  const [showLateCards, setShowLateCards] = useState(false);
  const [showChildOfParent, setShowChildOfParent] = useState(false);
  const [showKids, setShowKids] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowDelayed(true), 1200);     // 52
    const t2 = setTimeout(() => setShowLateCards(true), 1500);   // 53–54
    const t3 = setTimeout(() => setShowChildOfParent(true), 1800); // 56
    const t4 = setTimeout(() => setShowKids(true), 2100);        // 57
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-6 bg-indigo-600 text-white shadow">
        <h1 className="text-2xl font-semibold">Selenium ExpectedConditions: visibility*</h1>
 <p className="text-sm opacity-90">
   Demo page for visibilityOf*, visibilityOf*Located*, and nested elements
  </p>
      </header>      <main className="max-w-4xl mx-auto p-6 space-y-10">
        {/* 51 */}
<section id="section-51" className="space-y-3">
 <h2 className="text-xl font-bold">51) visibilityOf(WebElement element)</h2>
  <div id="visibleBox" className="p-4 rounded-xl bg-green-100 border border-green-300">I am visible immediately. (id="visibleBox")
          </div>
        </section>
        {/* 52 */}
        <section id="section-52" className="space-y-3">
          <h2 className="text-xl font-bold">52) visibilityOfElementLocated(By locator)</h2>
          <div
            id="delayedBox"
            className={
              "p-4 rounded-xl bg-yellow-100 border border-yellow-300 " +
              (showDelayed ? "" : "hidden")
            }          >
            I become visible after 1200ms. (id="delayedBox")
          </div>
        </section>
        {/* 53–54 */}
        <section id="section-53-54" className="space-y-3">
          <h2 className="text-xl font-bold">53–54) visibilityOfAllElements(List/WebElement...)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="cards">
            <div className="card p-4 rounded-xl bg-blue-100 border border-blue-300">Card A (.card)</div>
            <div className="card p-4 rounded-xl bg-blue-100 border border-blue-300">Card B (.card)</div>
            <div className="card p-4 rounded-xl bg-blue-100 border border-blue-300">Card C (.card)</div>
          </div>
          <div id="lateCards" className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className={"late-card p-4 rounded-xl bg-purple-100 border border-purple-300 " + (showLateCards ? "" : "hidden")}>
              Late Card 1 (.late-card)
            </div>
            <div className={"late-card p-4 rounded-xl bg-purple-100 border border-purple-300 " + (showLateCards ? "" : "hidden")}>
              Late Card 2 (.late-card)
            </div>
          </div>
        </section>
        {/* 55 */}
        <section id="section-55" className="space-y-3">
          <h2 className="text-xl font-bold">55) visibilityOfAllElementsLocatedBy(By locator)</h2>
          <ul id="menu" className="list-disc pl-6">
            <li className="menu-item">Menu Item 1 (.menu-item)</li>
            <li className="menu-item">Menu Item 2 (.menu-item)</li>
            <li className="menu-item">Menu Item 3 (.menu-item)</li>
          </ul>
        </section>
        {/* 56–57 */}
        <section id="section-56-57" className="space-y-3">
          <h2 className="text-xl font-bold">56–57) Nested elements</h2>
          {/* 56) By parent locator + child locator */}
          <div id="parentBy" className="p-4 rounded-xl bg-gray-100 border">
            <p>Parent (id="parentBy")</p>
 <div className={"child-of-parent " + (showChildOfParent ? "" : "hidden")}>
      Child 1 becomes visible late (.child-of-parent)   </div>
  <div className={"child-of-parent " + (showChildOfParent ? "" : "hidden")}>
              Child 2 becomes visible late (.child-of-parent)
            </div>
          </div>
          {/* 57) WebElement parent + child locator */}
          <div id="parentElem" className="p-4 rounded-xl bg-gray-100 border">
            <p>Parent element (id="parentElem")</p>
            <div className={"kid " + (showKids ? "" : "hidden")}>Kid A becomes visible late (.kid)</div>
            <div className={"kid " + (showKids ? "" : "hidden")}>Kid B becomes visible late (.kid)</div>
          </div>
        </section>
      </main>
    </div>
  );
}