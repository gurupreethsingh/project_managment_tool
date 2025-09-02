import React, { useEffect, useRef, useState } from "react";

/**
 * Actions / Keys Playground for Selenium
 *
 * Sections & targets:
 *  A. Clicks: single, double, context (right)
 *  B. Click & Hold / Release
 *  C. Move: to element, and by offset (with live pad to read coords)
 *  D. Drag & Drop: onto target; Drag by offset (slider & chip)
 *  E. Scroll & Wheel: scrollable panel + far target
 *  F. Keyboard: keyDown/keyUp/sendKeys with modifiers, chars, arrows, tabs
 *  G. Composite: hover to reveal submenu → click item
 *
 * Every actionable element has a stable id for Selenium.
 */

export default function ActionsPlayground() {
  // A. Clicks
  const [clicks, setClicks] = useState(0);
  const [dblClicks, setDblClicks] = useState(0);
  const [contextClicks, setContextClicks] = useState(0);

  // B. Click & Hold
  const [isHeld, setIsHeld] = useState(false);
  const holdTimer = useRef(null);

  // C. Move by offset pad
  const padRef = useRef(null);
  const [padCoords, setPadCoords] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  // D. Drag & Drop
  const [dropMsg, setDropMsg] = useState("Drop zone empty");
  const [dragOffset, setDragOffset] = useState(0); // slider position (0..100)
  const chipRef = useRef(null);
  const [chipOffset, setChipOffset] = useState({ x: 0, y: 0 });

  // E. Scroll & Wheel
  const scrollRef = useRef(null);
  const [scrollPos, setScrollPos] = useState({ top: 0, left: 0 });
  const farTargetRef = useRef(null);

  // F. Keyboard
  const [keyLog, setKeyLog] = useState([]);
  const [lastKeyEvent, setLastKeyEvent] = useState({ type: "", key: "", ctrl: false, shift: false, alt: false, meta: false });

  // G. Composite Hover → Menu
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMsg, setMenuMsg] = useState("No selection yet");

  // ----- Helpers -----
  const appendKeyLog = (msg) =>
    setKeyLog((prev) => [msg, ...prev].slice(0, 10)); // keep last 10

  // Drag & drop (HTML5)
  const onDragStart = (e) => {
    e.dataTransfer.setData("text/plain", "DRAGGABLE_PAYLOAD");
    e.dataTransfer.dropEffect = "move";
  };
  const onDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    setDropMsg(`Dropped: ${data}`);
  };
  const onDragOver = (e) => e.preventDefault();

  // Track scroll pos
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrollPos({ top: el.scrollTop, left: el.scrollLeft });
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-6 bg-indigo-600 text-white shadow">
        <h1 className="text-2xl font-semibold">Selenium Actions & Keys Playground</h1>
        <p className="text-sm opacity-90">Targets for click, double/right click, hold/release, move, drag, scroll, wheel, and keyboard.</p>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-10">

        {/* A. Clicks */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold">A) Clicks</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              id="singleClickBtn"
              className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
              onClick={() => setClicks((c) => c + 1)}
            >
              Single Click Me
            </button>
            <button
              id="doubleClickBtn"
              className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
              onDoubleClick={() => setDblClicks((c) => c + 1)}
            >
              Double-Click Me
            </button>
            <button
              id="contextClickBtn"
              className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
              onContextMenu={(e) => {
                e.preventDefault();
                setContextClicks((c) => c + 1);
              }}
            >
              Right-Click Me
            </button>
          </div>
          <div className="text-sm font-mono">
            Clicks: {clicks} | Double: {dblClicks} | Context: {contextClicks}
          </div>
        </section>

        {/* B. Click & Hold / Release */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold">B) Click & Hold / Release</h2>
          <div
            id="holdBox"
            className={`p-6 rounded-xl border ${isHeld ? "bg-green-100 border-green-400" : "bg-white"}`}
            onMouseDown={() => {
              setIsHeld(true);
              // simulate long press
              holdTimer.current = setTimeout(() => {}, 800);
            }}
            onMouseUp={() => {
              setIsHeld(false);
              clearTimeout(holdTimer.current);
            }}
          >
            Press and hold mouse button here…
          </div>
          <div className="text-sm font-mono">isHeld = {String(isHeld)}</div>
        </section>

        {/* C. Move to element / by offset (pad) */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold">C) Move To / Move By Offset</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div
              id="hoverTarget"
              className={`p-6 rounded-xl border ${hovered ? "bg-blue-100 border-blue-400" : "bg-white"}`}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              Hover over this box (moveToElement)
              <div className="text-sm font-mono mt-2">hovered = {String(hovered)}</div>
            </div>
            <div
              id="offsetPad"
              ref={padRef}
              className="relative h-40 rounded-xl border bg-white overflow-hidden"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setPadCoords({ x: Math.round(e.clientX - rect.left), y: Math.round(e.clientY - rect.top) });
              }}
            >
              <div className="absolute inset-0 pointer-events-none select-none p-2 text-xs text-gray-600">
                Move by offset inside this pad (0,0 at top-left)
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-gray-800 text-white rounded text-xs font-mono">
                x={padCoords.x}, y={padCoords.y}
              </div>
            </div>
          </div>
        </section>

        {/* D. Drag & Drop + Drag by offset */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold">D) Drag & Drop / Drag by Offset</h2>

          {/* D1: element->element */}
          <div className="grid md:grid-cols-2 gap-6">
            <div
              id="dragSource"
              className="p-4 rounded-lg border bg-white cursor-move"
              draggable
              onDragStart={onDragStart}
            >
              Drag Source
            </div>
            <div
              id="dropTarget"
              className="p-4 rounded-lg border-2 border-dashed bg-gray-50"
              onDragOver={onDragOver}
              onDrop={onDrop}
            >
              Drop Target
              <div className="text-xs font-mono mt-2">{dropMsg}</div>
            </div>
          </div>

          {/* D2: slider (drag by X offset) */}
          <div className="mt-4">
            <div className="mb-1 text-sm">Slider (drag thumb horizontally)</div>
            <div className="relative w-full h-10 bg-gray-100 rounded-lg border overflow-hidden" id="sliderTrack">
              <div
                id="sliderThumb"
                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-indigo-600 cursor-grab active:cursor-grabbing"
                style={{ left: `calc(${dragOffset}% - 12px)` }}
              />
            </div>
            <div className="text-xs font-mono mt-2">dragOffset = {dragOffset}%</div>
          </div>

          {/* D3: chip drag by arbitrary offset */}
          <div className="relative h-32 border rounded-lg bg-white mt-4" id="chipCanvas">
            <div
              id="draggableChip"
              ref={chipRef}
              className="absolute w-10 h-10 rounded-full bg-pink-500 cursor-move"
              style={{ left: `${chipOffset.x}px`, top: `${chipOffset.y}px` }}
            />
            <div className="absolute bottom-2 right-2 text-xs font-mono bg-gray-800 text-white px-2 py-1 rounded">
              chip x={chipOffset.x}, y={chipOffset.y}
            </div>
          </div>
        </section>

        {/* E. Scroll & Wheel */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold">E) Scroll & Wheel</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div
              id="scrollPanel"
              ref={scrollRef}
              className="h-48 overflow-auto rounded-xl border bg-white p-4"
              onWheel={() => { /* intentionally empty; Selenium Wheel actions will fire */ }}
            >
              <div className="h-[800px] w-[1200px] bg-gradient-to-b from-white to-gray-100 relative">
                <div className="sticky top-0 text-xs font-mono bg-white/80 p-1">
                  scrollTop={scrollPos.top}, scrollLeft={scrollPos.left}
                </div>
                <div className="absolute top-[700px] left-[1000px] p-2 bg-green-200 rounded" id="deepPanelTarget">
                  Deep panel target (scroll to me)
                </div>
              </div>
            </div>
            <div className="h-48 overflow-auto rounded-xl border bg-white p-4">
              <div className="h-[900px]">
                <div className="mt-[850px] p-2 bg-yellow-200 rounded" id="farPageTarget" ref={farTargetRef}>
                  Far page target (scrollToElement)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* F. Keyboard */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold">F) Keyboard (Keys, keyDown/keyUp/sendKeys)</h2>

          <input
            id="typingInput"
            className="p-3 rounded-lg border w-full"
            placeholder="Focus here; Selenium sendKeys / keyDown / keyUp"
            onKeyDown={(e) => {
              setLastKeyEvent({ type: "down", key: e.key, ctrl: e.ctrlKey, shift: e.shiftKey, alt: e.altKey, meta: e.metaKey });
              appendKeyLog(`DOWN: ${e.ctrlKey ? "Ctrl+" : ""}${e.shiftKey ? "Shift+" : ""}${e.altKey ? "Alt+" : ""}${e.metaKey ? "Meta+" : ""}${e.key}`);
            }}
            onKeyUp={(e) => {
              setLastKeyEvent({ type: "up", key: e.key, ctrl: e.ctrlKey, shift: e.shiftKey, alt: e.altKey, meta: e.metaKey });
              appendKeyLog(`UP  : ${e.ctrlKey ? "Ctrl+" : ""}${e.shiftKey ? "Shift+" : ""}${e.altKey ? "Alt+" : ""}${e.metaKey ? "Meta+" : ""}${e.key}`);
            }}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <div className="text-xs font-mono p-2 bg-gray-100 rounded">
              Last: {lastKeyEvent.type} {lastKeyEvent.key} | ctrl={String(lastKeyEvent.ctrl)} shift={String(lastKeyEvent.shift)} alt={String(lastKeyEvent.alt)} meta={String(lastKeyEvent.meta)}
            </div>
            <div className="text-xs font-mono p-2 bg-gray-100 rounded">
              Log:
              <ul className="list-disc pl-5">
                {keyLog.map((k, i) => <li key={i}>{k}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* G. Composite: hover → submenu → click */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold">G) Composite: Hover to open menu, then click item</h2>

          <div
            id="menuRoot"
            className="inline-block relative"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button id="menuButton" className="px-4 py-2 rounded-lg border bg-white">Hover Me</button>
            {menuOpen && (
              <div id="menuPanel" className="absolute mt-2 w-40 bg-white border rounded-lg shadow">
                <button
                  id="menuItem1"
                  className="w-full text-left px-3 py-2 hover:bg-gray-50"
                  onClick={() => setMenuMsg("Selected: Item 1")}
                >
                  Item 1
                </button>
                <button
                  id="menuItem2"
                  className="w-full text-left px-3 py-2 hover:bg-gray-50"
                  onClick={() => setMenuMsg("Selected: Item 2")}
                >
                  Item 2
                </button>
              </div>
            )}
          </div>

          <div id="menuResult" className="text-sm font-mono">{menuMsg}</div>
        </section>
      </main>
    </div>
  );
}
