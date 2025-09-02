import React, { useEffect, useRef, useState } from "react";

/**
 * Tailwind assumed in your project.
 *
 * Timeline of changes:
 *  - #selStateBy (checkbox): unchecked -> checked at 1200ms
 *  - #selStateEl (checkbox): unchecked -> checked at 1600ms
 *  - #clickableBy (button): disabled -> enabled at 1800ms
 *  - #clickableEl (button): disabled -> enabled at 2000ms
 *  - #radioBy (radio): unchecked -> checked at 2200ms
 *  - #selectedEl (checkbox): unchecked -> checked at 2400ms
 */

export default function ClickableAndSelectedBatch() {
  const [selBy, setSelBy] = useState(false);
  const [selEl, setSelEl] = useState(false);

  const [btnByDisabled, setBtnByDisabled] = useState(true);
  const [btnElDisabled, setBtnElDisabled] = useState(true);

  const [radioByChecked, setRadioByChecked] = useState(false);
  const [selectedElChecked, setSelectedElChecked] = useState(false);

  const selElRef = useRef(null);
  const btnElRef = useRef(null);
  const selectedElRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setSelBy(true), 1200);                 // 10
    const t2 = setTimeout(() => { setSelEl(true); if (selElRef.current) selElRef.current.checked = true; }, 1600); // 11
    const t3 = setTimeout(() => setBtnByDisabled(false), 1800);         // 12
    const t4 = setTimeout(() => { setBtnElDisabled(false); if (btnElRef.current) btnElRef.current.disabled = false; }, 2000); // 13
    const t5 = setTimeout(() => setRadioByChecked(true), 2200);         // 14
    const t6 = setTimeout(() => { setSelectedElChecked(true); if (selectedElRef.current) selectedElRef.current.checked = true; }, 2400); // 15

    return () => [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-6 bg-indigo-600 text-white shadow">
        <h1 className="text-2xl font-semibold">Selenium ExpectedConditions — Clickable & Selected</h1>
        <p className="text-sm opacity-90">Demo for selection state, clickable, and selected checks</p>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-8">

        {/* 10) elementSelectionStateToBe(By, selected) */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold">10) elementSelectionStateToBe(By, selected)</h2>
          <label className="flex items-center gap-2">
            <input
              id="selStateBy"
              type="checkbox"
              checked={selBy}
              onChange={(e) => setSelBy(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Checkbox (id="selStateBy") becomes checked at ~1.2s</span>
          </label>
          <div className="font-mono text-xs">checked = {String(selBy)}</div>
        </section>

        {/* 11) elementSelectionStateToBe(WebElement, selected) */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold">11) elementSelectionStateToBe(WebElement, selected)</h2>
          <label className="flex items-center gap-2">
            <input
              id="selStateEl"
              ref={selElRef}
              type="checkbox"
              defaultChecked={false}
              onChange={(e) => setSelEl(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Checkbox (id="selStateEl") becomes checked at ~1.6s</span>
          </label>
          <div className="font-mono text-xs">checked = {String(selEl)}</div>
        </section>

        {/* 12) elementToBeClickable(By) */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold">12) elementToBeClickable(By)</h2>
          <button
            id="clickableBy"
            disabled={btnByDisabled}
            className={`px-4 py-2 rounded-lg border ${btnByDisabled ? "bg-gray-200 cursor-not-allowed" : "bg-green-500 text-white"}`}
          >
            Clickable By after ~1.8s
          </button>
          <div className="font-mono text-xs">disabled = {String(btnByDisabled)}</div>
        </section>

        {/* 13) elementToBeClickable(WebElement) */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold">13) elementToBeClickable(WebElement)</h2>
          <button
            id="clickableEl"
            ref={btnElRef}
            disabled={btnElDisabled}
            className={`px-4 py-2 rounded-lg border ${btnElDisabled ? "bg-gray-200 cursor-not-allowed" : "bg-blue-600 text-white"}`}
            onClick={() => alert("Clicked!")}
          >
            Clickable Element after ~2.0s
          </button>
          <div className="font-mono text-xs">disabled = {String(btnElDisabled)}</div>
        </section>

        {/* 14) elementToBeSelected(By) */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold">14) elementToBeSelected(By)</h2>
          <label className="flex items-center gap-2">
            <input
              id="radioBy"
              type="radio"
              checked={radioByChecked}
              onChange={(e) => setRadioByChecked(e.target.checked)}
              className="w-4 h-4"
              name="group1"
            />
            <span className="text-sm">Radio (id="radioBy") becomes selected at ~2.2s</span>
          </label>
          <div className="font-mono text-xs">selected = {String(radioByChecked)}</div>
        </section>

        {/* 15) elementToBeSelected(WebElement) */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold">15) elementToBeSelected(WebElement)</h2>
          <label className="flex items-center gap-2">
            <input
              id="selectedEl"
              ref={selectedElRef}
              type="checkbox"
              defaultChecked={false}
              onChange={(e) => setSelectedElChecked(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Checkbox (id="selectedEl") becomes selected at ~2.4s</span>
          </label>
          <div className="font-mono text-xs">selected = {String(selectedElChecked)}</div>
        </section>

      </main>
    </div>
  );
}
