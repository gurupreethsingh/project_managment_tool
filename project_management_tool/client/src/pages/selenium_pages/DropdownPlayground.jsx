import React, { useEffect, useMemo, useState } from "react";

/**
 * Dropdown Playground
 * - Injects Bootstrap 5 CSS/JS via <head> once (CDN)
 * - Uses Tailwind utility classes via CDN (for visuals only)
 * - Provides IDs for every control so Selenium can target reliably
 */

export default function DropdownPlayground() {
  // ----- Inject Bootstrap & Tailwind CDN once -----
  useEffect(() => {
    // Bootstrap CSS
    const bCss = document.createElement("link");
    bCss.rel = "stylesheet";
    bCss.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
    document.head.appendChild(bCss);

    // Bootstrap JS (Dropdowns need this for toggling)
    const bJs = document.createElement("script");
    bJs.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
    document.body.appendChild(bJs);

    // Tailwind (CDN)
    const tw = document.createElement("script");
    tw.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(tw);

    return () => {
      [bCss, bJs, tw].forEach((el) => el && el.remove());
    };
  }, []);

  // ----- Native <select> demos -----
  const [dynamicOptions, setDynamicOptions] = useState([]);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const citiesByCountry = useMemo(
    () => ({
      India: ["Mumbai", "Delhi", "Bengaluru"],
      USA: ["New York", "Austin", "Seattle"],
      Japan: ["Tokyo", "Osaka", "Kyoto"],
    }),
    []
  );

  useEffect(() => {
    // reset city if country changes
    setCity("");
  }, [country]);

  // Async options simulation
  const [asyncLoading, setAsyncLoading] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState([]);

  const loadAsyncOptions = () => {
    setAsyncLoading(true);
    setTimeout(() => {
      setAsyncOptions(["Alpha", "Beta", "Gamma"]);
      setAsyncLoading(false);
    }, 1200);
  };

  // ----- Custom/ARIA Combobox (searchable) -----
  const [comboOpen, setComboOpen] = useState(false);
  const [comboInput, setComboInput] = useState("");
  const comboAll = ["Apple", "Banana", "Berry", "Cherry", "Grape", "Mango", "Orange", "Peach"];
  const comboFiltered = comboAll.filter((x) => x.toLowerCase().includes(comboInput.toLowerCase()));
  const [comboActiveIndex, setComboActiveIndex] = useState(-1);
  const [comboSelection, setComboSelection] = useState("");

  // ----- Custom Multi-Select with Checkboxes -----
  const [multiOpen, setMultiOpen] = useState(false);
  const [multiSelected, setMultiSelected] = useState(new Set());
  const multiChoices = ["Cricket", "Football", "Badminton", "Tennis", "Hockey"];
  const toggleMulti = (v) => {
    const next = new Set(multiSelected);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    setMultiSelected(next);
  };

  // ----- Datalist (input + datalist) -----
  const datalistOptions = ["Goa", "Pune", "Nagpur", "Nashik", "Kochi", "Chennai"];
  const [datalistVal, setDatalistVal] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <header className="p-4 rounded-xl bg-indigo-600 text-white shadow mb-6">
        <h1 className="text-2xl font-semibold">Dropdowns Playground (Native, Bootstrap, Custom/ARIA)</h1>
        <p className="text-sm opacity-90">
          All common dropdown patterns with stable IDs for Selenium automation.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ============================ Native <select> ============================ */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold">A) Native &lt;select&gt; dropdowns</h2>

          {/* A1: single select */}
          <div>
            <label htmlFor="selectSingle" className="block text-sm font-medium">Single Select</label>
            <select id="selectSingle" className="form-select mt-1">
              <option value="">-- Choose one --</option>
              <option value="cat">Cat</option>
              <option value="dog">Dog</option>
              <option value="bird">Bird</option>
            </select>
          </div>

          {/* A2: multiple select */}
          <div>
            <label htmlFor="selectMultiple" className="block text-sm font-medium">Multiple Select</label>
            <select id="selectMultiple" className="form-select mt-1" multiple size={4}>
              <option value="red">Red</option>
              <option value="green">Green</option>
              <option value="blue">Blue</option>
              <option value="orange">Orange</option>
            </select>
          </div>

          {/* A3: with optgroups */}
          <div>
            <label htmlFor="selectOptGroup" className="block text-sm font-medium">With &lt;optgroup&gt;</label>
            <select id="selectOptGroup" className="form-select mt-1">
              <optgroup label="Frontend">
                <option value="react">React</option>
                <option value="vue">Vue</option>
              </optgroup>
              <optgroup label="Backend">
                <option value="node">Node.js</option>
                <option value="django">Django</option>
              </optgroup>
            </select>
          </div>

          {/* A4: disabled options */}
          <div>
            <label htmlFor="selectDisabled" className="block text-sm font-medium">Disabled option</label>
            <select id="selectDisabled" className="form-select mt-1">
              <option value="">-- Choose --</option>
              <option value="alpha">Alpha</option>
              <option value="beta" disabled>Beta (disabled)</option>
              <option value="gamma">Gamma</option>
            </select>
          </div>

          {/* A5: dynamic (populate via button) */}
          <div>
            <div className="flex items-center gap-2">
              <label htmlFor="selectDynamic" className="text-sm font-medium">Dynamic options</label>
              <button
                id="btnPopulateDynamic"
                className="btn btn-sm btn-outline-primary"
                onClick={() => setDynamicOptions(["One", "Two", "Three"])}
              >
                Populate
              </button>
            </div>
            <select id="selectDynamic" className="form-select mt-1">
              <option value="">-- None yet --</option>
              {dynamicOptions.map((v) => (
                <option key={v} value={v.toLowerCase()}>{v}</option>
              ))}
            </select>
          </div>

          {/* A6: dependent dropdowns */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="selectCountry" className="text-sm font-medium">Country</label>
              <select
                id="selectCountry"
                className="form-select mt-1"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">-- select country --</option>
                <option>India</option>
                <option>USA</option>
                <option>Japan</option>
              </select>
            </div>
            <div>
              <label htmlFor="selectCity" className="text-sm font-medium">City</label>
              <select
                id="selectCity"
                className="form-select mt-1"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="">-- select city --</option>
                {(citiesByCountry[country] || []).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* A7: async-loading options */}
          <div>
            <div className="flex items-center gap-2">
              <label htmlFor="selectAsync" className="text-sm font-medium">Async options</label>
              <button id="btnLoadAsync" className="btn btn-sm btn-outline-secondary" onClick={loadAsyncOptions}>
                {asyncLoading ? "Loading..." : "Load"}
              </button>
            </div>
            <select id="selectAsync" className="form-select mt-1" disabled={asyncLoading}>
              <option value="">{asyncLoading ? "Loading..." : "-- choose --"}</option>
              {asyncOptions.map((o) => (
                <option key={o} value={o.toLowerCase()}>{o}</option>
              ))}
            </select>
          </div>

          {/* A8: datalist (input + datalist) */}
          <div>
            <label htmlFor="datalistDemo" className="block text-sm font-medium">Datalist (type-ahead)</label>
            <input
              id="datalistDemo"
              className="form-control mt-1"
              list="cityOptions"
              value={datalistVal}
              onChange={(e) => setDatalistVal(e.target.value)}
              placeholder="Type a city..."
            />
            <datalist id="cityOptions">
              {datalistOptions.map((o) => <option key={o} value={o} />)}
            </datalist>
          </div>
        </section>

        {/* ============================ Bootstrap dropdowns ============================ */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold">B) Bootstrap 5 dropdowns</h2>

          {/* B1: standard dropdown */}
          <div className="dropdown">
            <button
              id="bsDropdownToggle"
              className="btn btn-primary dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              type="button"
            >
              Bootstrap Dropdown
            </button>
            <ul id="bsDropdownMenu" className="dropdown-menu" aria-labelledby="bsDropdownToggle">
              <li><button id="bsItem1" className="dropdown-item" type="button">BS Item 1</button></li>
              <li><button id="bsItem2" className="dropdown-item" type="button">BS Item 2</button></li>
              <li><hr className="dropdown-divider" /></li>
              <li><button id="bsItem3" className="dropdown-item" type="button">BS Item 3</button></li>
            </ul>
          </div>

          {/* B2: split button dropdown */}
          <div className="btn-group">
            <button id="bsPrimaryAction" className="btn btn-success" type="button">Primary Action</button>
            <button
              id="bsSplitToggle"
              type="button"
              className="btn btn-success dropdown-toggle dropdown-toggle-split"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="visually-hidden">Toggle Dropdown</span>
            </button>
            <ul id="bsSplitMenu" className="dropdown-menu">
              <li><button id="bsSplitItem1" className="dropdown-item" type="button">Split Item 1</button></li>
              <li><button id="bsSplitItem2" className="dropdown-item" type="button">Split Item 2</button></li>
            </ul>
          </div>

          {/* B3: dropup + end-aligned */}
          <div className="btn-group dropup">
            <button
              id="bsDropupToggle"
              type="button"
              className="btn btn-secondary dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Dropup (end)
            </button>
            <ul id="bsDropupMenu" className="dropdown-menu dropdown-menu-end">
              <li><button id="bsDropupItem1" className="dropdown-item" type="button">Up Item A</button></li>
              <li><button id="bsDropupItem2" className="dropdown-item" type="button">Up Item B</button></li>
            </ul>
          </div>

          {/* ============================ Custom / ARIA dropdowns ============================ */}
          <h2 className="text-lg font-bold mt-6">C) Custom / ARIA Dropdowns</h2>

          {/* C1: Searchable Combobox (ARIA) */}
          <div>
            <label htmlFor="comboInput" className="block text-sm font-medium">Searchable Combobox</label>
            <div className="relative">
              <input
                id="comboInput"
                className="form-control mt-1"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={comboOpen}
                aria-controls="comboListbox"
                aria-activedescendant={comboActiveIndex >= 0 ? `comboOpt-${comboActiveIndex}` : undefined}
                value={comboInput}
                onFocus={() => setComboOpen(true)}
                onChange={(e) => { setComboInput(e.target.value); setComboOpen(true); setComboActiveIndex(-1); }}
                onKeyDown={(e) => {
                  if (!comboOpen) setComboOpen(true);
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setComboActiveIndex((i) => Math.min(i + 1, comboFiltered.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setComboActiveIndex((i) => Math.max(i - 1, 0));
                  } else if (e.key === "Enter") {
                    if (comboActiveIndex >= 0) {
                      const val = comboFiltered[comboActiveIndex];
                      setComboSelection(val);
                      setComboInput(val);
                      setComboOpen(false);
                    }
                  } else if (e.key === "Escape") {
                    setComboOpen(false);
                  }
                }}
                placeholder="Type to filter…"
              />
              {comboOpen && (
                <ul
                  id="comboListbox"
                  role="listbox"
                  className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow"
                >
                  {comboFiltered.length === 0 && (
                    <li className="px-3 py-2 text-sm text-gray-500">No results</li>
                  )}
                  {comboFiltered.map((opt, i) => (
                    <li
                      id={`comboOpt-${i}`}
                      key={opt}
                      role="option"
                      aria-selected={comboActiveIndex === i}
                      className={`px-3 py-2 cursor-pointer text-sm ${comboActiveIndex === i ? "bg-indigo-50" : ""}`}
                      onMouseEnter={() => setComboActiveIndex(i)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setComboSelection(opt);
                        setComboInput(opt);
                        setComboOpen(false);
                      }}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div id="comboResult" className="text-xs font-mono mt-1">Selected: {comboSelection || "(none)"}</div>
          </div>

          {/* C2: Custom Multi-select (checkboxes) */}
          <div className="relative">
            <label className="block text-sm font-medium">Custom Multi-select</label>
            <button
              id="multiToggle"
              className="btn btn-outline-dark mt-1"
              onClick={() => setMultiOpen((v) => !v)}
              aria-expanded={multiOpen}
              aria-controls="multiMenu"            >
              {multiSelected.size ? `Selected (${multiSelected.size})` : "Choose sports"}
            </button>
            {multiOpen && (
              <div                id="multiMenu"
                className="absolute z-10 mt-1 w-64 bg-white border rounded-md shadow p-2"
                role="menu"              >
                {multiChoices.map((c) => (
                  <label key={c} className="flex items-center gap-2 py-1 px-2 hover:bg-gray-50 cursor-pointer">
                    <input            id={`multiOpt-${c}`}
                      type="checkbox"
                      className="form-check-input"
                      checked={multiSelected.has(c)}
                      onChange={() => toggleMulti(c)}                    />
                    <span>{c}</span>
                  </label>
                ))}
                <div className="mt-2 text-end">
                  <button id="multiDone" className="btn btn-sm btn-primary" onClick={() => setMultiOpen(false)}>Done</button>
                </div>
              </div>
            )}
            <div id="multiResult" className="text-xs font-mono mt-1">
              Selected: {Array.from(multiSelected).join(", ") || "(none)"}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
