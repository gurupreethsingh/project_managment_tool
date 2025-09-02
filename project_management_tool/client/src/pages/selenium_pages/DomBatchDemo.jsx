import React, { useEffect, useRef, useState } from "react";

/**
 * What changes (timelines):
 *  - #domAttrTarget  : setAttribute('data-level', 'pro') after 1200ms
 *  - #domPropTarget  : checkbox.checked = true after 1600ms (property), and
 *                      input.value = 'Hi' after 2000ms (property)
 *
 * We'll assert:
 *  - domAttributeToBe(..., 'data-level', 'pro')
 *  - domPropertyToBe(..., 'checked', 'true')  on the checkbox
 *  - domPropertyToBe(..., 'value', 'Hi')      on the text input
 */

export default function DomBatchDemo() {
  const attrRef = useRef(null);
  const checkRef = useRef(null);
  const inputRef = useRef(null);
  const [level, setLevel] = useState("novice");  // for DOM attribute
  const [checked, setChecked] = useState(false); // for DOM property (checkbox)
  const [val, setVal] = useState("");            // for DOM property (input value)

  useEffect(() => {
    const t1 = setTimeout(() => {
      setLevel("pro"); // We'll also set attribute directly for clarity
      if (attrRef.current) {
        attrRef.current.setAttribute("data-level", "pro");
      }    }, 1200);

    const t2 = setTimeout(() => {
      setChecked(true);
      if (checkRef.current) {
        checkRef.current.checked = true; // property change (not attribute)
      }    }, 1600);

    const t3 = setTimeout(() => {
      setVal("Hi");
      if (inputRef.current) {
        inputRef.current.value = "Hi"; // property change (value prop)
      }    }, 2000);

    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-6 bg-emerald-600 text-white shadow">
        <h1 className="text-2xl font-semibold">Selenium ExpectedConditions — DOM Attribute/Property</h1>
        <p className="text-sm opacity-90">Demo for domAttributeToBe / domPropertyToBe</p>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-8">

        {/* 8) domAttributeToBe(WebElement, attr, value) */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold">8) domAttributeToBe(element, attribute, value)</h2>
          <div
            id="domAttrTarget"
            ref={attrRef}
            data-level={level}
            className="p-4 rounded-xl border bg-white"
          >
            <div className="text-sm opacity-70">data-level evolves: novice → pro (via setAttribute)</div>
            <div className="font-mono text-xs mt-1">data-level="{level}"</div>
          </div>
        </section>

        {/* 9) domPropertyToBe(WebElement, property, value) */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold">9) domPropertyToBe(element, property, value)</h2>

          <label className="flex items-center gap-2">
            <input
              id="domPropCheckbox"
              ref={checkRef}
              type="checkbox"
              defaultChecked={false}
              className="w-4 h-4"
              onChange={(e) => setChecked(e.target.checked)}
            />
            <span className="text-sm">Checkbox property "checked" → true</span>
          </label>
          <div className="font-mono text-xs">checked = {String(checked)}</div>

          <div className="space-y-1">
            <input
              id="domPropInput"
              ref={inputRef}
              className="p-3 rounded-lg border w-full"
              defaultValue=""
              placeholder='Property "value" → "Hi" at 2s'
              onChange={(e) => setVal(e.target.value)}
            />
            <div className="font-mono text-xs">value = "{val}"</div>
          </div>
        </section>

      </main>
    </div>
  );
}
