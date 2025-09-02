import React, { useEffect, useState } from "react";

/**
 * Tailwind assumed in your project.
 * Route this page anywhere in your MERN frontend.
 *
 * What changes (timelines):
 *  - #attrContainsBy   : data-status becomes "loading" -> "loaded" (1200ms)
 *  - #attrContainsEl   : data-state becomes "boot" -> "booted" (1400ms)
 *  - #attrToBeBy       : title becomes exactly "Ready" (1600ms)
 *  - #attrToBeEl       : data-role becomes exactly "admin" (1800ms)
 *  - #notEmptyEl       : value (input) becomes non-empty "Hello" (2000ms)
 */	

export default function AttributeBatchDemo() {
  const [status, setStatus] = useState("idle");       // for #attrContainsBy (data-status)
  const [stateStr, setStateStr] = useState("boot");   // for #attrContainsEl (data-state)
  const [titleStr, setTitleStr] = useState("Init");   // for #attrToBeBy (title)
  const [role, setRole] = useState("guest");          // for #attrToBeEl (data-role)
  const [inputVal, setInputVal] = useState("");       // for #notEmptyEl (value)

  useEffect(() => {
    const t1 = setTimeout(() => setStatus("loading"), 600);
    const t1b = setTimeout(() => setStatus("loaded"), 1200);

    const t2 = setTimeout(() => setStateStr("booted"), 1400);

    const t3 = setTimeout(() => setTitleStr("Ready"), 1600);

    const t4 = setTimeout(() => setRole("admin"), 1800);

    const t5 = setTimeout(() => setInputVal("Hello"), 2000);

    return () => [t1, t1b, t2, t3, t4, t5].forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-6 bg-indigo-600 text-white shadow">
        <h1 className="text-2xl font-semibold">Selenium ExpectedConditions — Attribute Batch</h1>
        <p className="text-sm opacity-90">Demo for attributeContains / attributeToBe / attributeToBeNotEmpty</p>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-8">

        {/* 3) attributeContains(By, attr, value) */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold">3) attributeContains(By, attr, value)</h2>
          <div
            id="attrContainsBy"
            data-status={status}
            className="p-4 rounded-xl border bg-white"
          >
            <div className="text-sm opacity-70">data-status evolves: idle → loading → loaded</div>
            <div className="font-mono text-xs mt-1">data-status="{status}"</div>
          </div>
        </section>

        {/* 4) attributeContains(WebElement, attr, value) */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold">4) attributeContains(WebElement, attr, value)</h2>
          <div
            id="attrContainsEl"
            data-state={stateStr}
            className="p-4 rounded-xl border bg-white"
          >
            <div className="text-sm opacity-70">data-state evolves: boot → booted</div>
            <div className="font-mono text-xs mt-1">data-state="{stateStr}"</div>
          </div>
        </section>

        {/* 5) attributeToBe(By, attr, value) */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold">5) attributeToBe(By, attr, value)</h2>
          <div
            id="attrToBeBy"
            title={titleStr}
            className="p-4 rounded-xl border bg-white"
          >
            <div className="text-sm opacity-70">title evolves: Init → Ready</div>
            <div className="font-mono text-xs mt-1">title="{titleStr}"</div>
          </div>
        </section>

        {/* 6) attributeToBe(WebElement, attr, value) */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold">6) attributeToBe(WebElement, attr, value)</h2>
          <div
            id="attrToBeEl"
            data-role={role}
            className="p-4 rounded-xl border bg-white"
          >
            <div className="text-sm opacity-70">data-role evolves: guest → admin</div>
            <div className="font-mono text-xs mt-1">data-role="{role}"</div>
          </div>
        </section>

        {/* 7) attributeToBeNotEmpty(WebElement, attr) */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold">7) attributeToBeNotEmpty(WebElement, attr)</h2>
          <input
            id="notEmptyEl"
            className="p-3 rounded-lg border w-full"
            placeholder="This will auto-fill after 2s"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
          />
          <div className="font-mono text-xs mt-1">value="{inputVal}"</div>
        </section>

      </main>
    </div>
  );
}
