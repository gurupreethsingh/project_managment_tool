import React, { useEffect, useMemo, useState } from "react";

/**
 * Calendar / Date-Time Playground
 * Sections:
 *  A) Native inputs: date, datetime-local, time, month, week (with min/max/step/disabled)
 *  B) Custom Inline Calendar (single date)
 *  C) Custom Range Picker (start/end)
 *  D) Popover Calendar (open/close)
 *
 * All elements have stable IDs for Selenium.
 */

// Utility to format yyyy-mm-dd
function fmtYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const dd= String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${dd}`;
}

function daysInMonth(year, monthIndex) { // monthIndex: 0..11
  return new Date(year, monthIndex+1, 0).getDate();
}

// build a matrix for given month; returns {weeks: [[Date|null]], firstOfMonth, lastOfMonth}
function buildMonthMatrix(year, monthIndex, weekStartsOn = 0) {
  const first = new Date(year, monthIndex, 1);
  const lastDay = daysInMonth(year, monthIndex);
  const weeks = [];
  let week = new Array(7).fill(null);
  let dow = (first.getDay() - weekStartsOn + 7) % 7;
  for (let i = 0; i < dow; i++) week[i] = null;

  let day = 1;
  while (day <= lastDay) {
    if (dow === 7) { weeks.push(week); week = new Array(7).fill(null); dow = 0; }
    week[dow] = new Date(year, monthIndex, day);
    day++; dow++;
  }
  weeks.push(week);
  return { weeks, firstOfMonth: first, lastOfMonth: new Date(year, monthIndex, lastDay) };
}

function isSameDate(a, b) {
  return a && b && a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}

export default function CalendarPlayground() {
  // A) Native inputs
  const today = useMemo(() => new Date(), []);
  const minDate = useMemo(() => new Date(today.getFullYear(), today.getMonth(), today.getDate()-3), [today]);
  const maxDate = useMemo(() => new Date(today.getFullYear(), today.getMonth(), today.getDate()+10), [today]);
  const [nativeDate, setNativeDate] = useState("");
  const [nativeDateTime, setNativeDateTime] = useState("");
  const [nativeTime, setNativeTime] = useState("");
  const [nativeMonth, setNativeMonth] = useState("");
  const [nativeWeek, setNativeWeek] = useState("");

  // B) Inline single-date calendar
  const [calYM, setCalYM] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = useState(null);
  const disabledBefore = new Date(today.getFullYear(), today.getMonth(), today.getDate()-2); // example disabled rule
  const disabledWeekend = true;

  // C) Range picker
  const [rangeYM, setRangeYM] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);

  // D) Popover
  const [popOpen, setPopOpen] = useState(false);
  const [popYM, setPopYM] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [popSelected, setPopSelected] = useState(null);

  // Helpers
  const prevMonth = (s, setS) => {
    const m = s.m - 1;
    if (m < 0) setS({ y: s.y - 1, m: 11 }); else setS({ y: s.y, m });
  };
  const nextMonth = (s, setS) => {
    const m = s.m + 1;
    if (m > 11) setS({ y: s.y + 1, m: 0 }); else setS({ y: s.y, m });
  };
  const monthLabel = (y,m) => new Date(y,m,1).toLocaleString(undefined, { month: "long", year: "numeric" });

  const isDisabled = (d) => {
    if (!d) return true;
    if (d < disabledBefore) return true;
    if (disabledWeekend && (d.getDay()===0 || d.getDay()===6)) return true;
    return false;
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 16 }}>
      <header style={{ padding: 16, background: "#4f46e5", color: "white", borderRadius: 12, marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>Calendar / Date-Time Playground</h1>
        <p style={{ opacity: 0.9 }}>Native inputs + custom calendars (single + range + popover).</p>
      </header>

      {/* A) Native inputs */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700 }}>A) Native Inputs</h2>

        {/* date */}
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="inDate">Date (min/max & step)</label>
          <input
            id="inDate"
            type="date"
            min={fmtYMD(minDate)}
            max={fmtYMD(maxDate)}
            step="1"
            value={nativeDate}
            onChange={(e)=>setNativeDate(e.target.value)}
            style={{ marginLeft: 8 }}
          />
          <span id="inDateVal" style={{ marginLeft: 8, fontFamily: "monospace" }}>{nativeDate}</span>
        </div>

        {/* datetime-local */}
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="inDateTime">Datetime-local (step=60s)</label>
          <input
            id="inDateTime"
            type="datetime-local"
            step="60"
            value={nativeDateTime}
            onChange={(e)=>setNativeDateTime(e.target.value)}
            style={{ marginLeft: 8 }}
          />
          <span id="inDateTimeVal" style={{ marginLeft: 8, fontFamily: "monospace" }}>{nativeDateTime}</span>
        </div>

        {/* time */}
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="inTime">Time (min/max)</label>
          <input
            id="inTime"
            type="time"
            min="09:00"
            max="18:00"
            step="300"
            value={nativeTime}
            onChange={(e)=>setNativeTime(e.target.value)}
            style={{ marginLeft: 8 }}
          />
          <span id="inTimeVal" style={{ marginLeft: 8, fontFamily: "monospace" }}>{nativeTime}</span>
        </div>

        {/* month */}
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="inMonth">Month</label>
          <input id="inMonth" type="month" value={nativeMonth} onChange={(e)=>setNativeMonth(e.target.value)} style={{ marginLeft: 8 }}/>
          <span id="inMonthVal" style={{ marginLeft: 8, fontFamily: "monospace" }}>{nativeMonth}</span>
        </div>

        {/* week */}
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="inWeek">Week</label>
          <input id="inWeek" type="week" value={nativeWeek} onChange={(e)=>setNativeWeek(e.target.value)} style={{ marginLeft: 8 }}/>
          <span id="inWeekVal" style={{ marginLeft: 8, fontFamily: "monospace" }}>{nativeWeek}</span>
        </div>
      </section>

      {/* B) Custom inline calendar (single date) */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700 }}>B) Inline Calendar (single date)</h2>
        <div id="calSingle" style={{ display: "inline-block", border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <button id="singlePrev" onClick={()=>prevMonth(calYM, setCalYM)}></button>
            <div id="singleLabel" style={{ fontWeight: 600 }}>{monthLabel(calYM.y, calYM.m)}</div>
            <button id="singleNext" onClick={()=>nextMonth(calYM, setCalYM)}></button>
          </div>
          <CalGrid
            idPrefix="single"
            y={calYM.y}
            m={calYM.m}
            selected={selected}
            setSelected={setSelected}
            isDisabled={isDisabled}
          />
          <div id="singleSelected" style={{ marginTop: 8, fontFamily: "monospace" }}>
            Selected: {selected ? fmtYMD(selected) : "(none)"}
          </div>
        </div>
      </section>

      {/* C) Range Picker */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700 }}>C) Range Picker</h2>
        <div id="calRange" style={{ display: "inline-block", border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <button id="rangePrev" onClick={()=>prevMonth(rangeYM, setRangeYM)}></button>
            <div id="rangeLabel" style={{ fontWeight: 600 }}>{monthLabel(rangeYM.y, rangeYM.m)}</div>
            <button id="rangeNext" onClick={()=>nextMonth(rangeYM, setRangeYM)}></button>
          </div>
          <RangeGrid
            y={rangeYM.y}
            m={rangeYM.m}
            start={rangeStart}
            end={rangeEnd}
            setStart={setRangeStart}
            setEnd={setRangeEnd}
            isDisabled={isDisabled}
          />
          <div id="rangeSelected" style={{ marginTop: 8, fontFamily: "monospace" }}>
            Range: {rangeStart ? fmtYMD(rangeStart) : "(none)"} → {rangeEnd ? fmtYMD(rangeEnd) : "(none)"}
          </div>
        </div>
      </section>

      {/* D) Popover calendar */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700 }}>D) Popover Calendar</h2>
        <div>
          <button id="popOpen" onClick={()=>setPopOpen(true)} style={{ padding: "6px 10px" }}>Open calendar</button>
          <span id="popSelectedVal" style={{ marginLeft: 8, fontFamily: "monospace" }}>
            {popSelected ? fmtYMD(popSelected) : "(none)"}
          </span>
        </div>
        {popOpen && (
          <div id="popPanel" style={{ position: "relative", display: "inline-block" }}>
            <div style={{
              position: "absolute", top: 8, left: 0, background: "white", border: "1px solid #ddd",
              borderRadius: 10, padding: 12, zIndex: 10
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <button id="popPrev" onClick={()=>prevMonth(popYM, setPopYM)}></button>
                <div id="popLabel" style={{ fontWeight: 600 }}>{monthLabel(popYM.y, popYM.m)}</div>
                <button id="popNext" onClick={()=>nextMonth(popYM, setPopYM)}></button>
              </div>
              <CalGrid
                idPrefix="pop"
                y={popYM.y}
                m={popYM.m}
                selected={popSelected}
                setSelected={(d)=>{ setPopSelected(d); setPopOpen(false); }}
                isDisabled={isDisabled}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function CalGrid({ idPrefix, y, m, selected, setSelected, isDisabled }) {
  const { weeks } = buildMonthMatrix(y, m, 0);
  return (
    <table id={`${idPrefix}Grid`} cellPadding="6" style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <th key={d}>{d}</th>)}
        </tr>
      </thead>
      <tbody>
        {weeks.map((w, i) => (
          <tr key={i}>
            {w.map((d, j) => {
              const dis = isDisabled(d);
              const sel = isSameDate(d, selected);
              const isToday = d && isSameDate(d, new Date());
              const label = d ? d.getDate() : "";
              const id = d ? `${idPrefix}-${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}` : `${idPrefix}-null-${i}-${j}`;
              return (
                <td
                  key={j}
                  id={id}
                  data-date={d ? fmtYMD(d) : ""}
                  aria-disabled={dis}
                  aria-selected={sel}
                  style={{
                    border: "1px solid #eee",
                    minWidth: 36,
                    textAlign: "center",
                    background: sel ? "#d1fae5" : dis ? "#f3f4f6" : "white",
                    color: dis ? "#9ca3af" : "inherit",
                    outline: isToday ? "2px solid #60a5fa" : "none",
                    cursor: dis ? "not-allowed" : "pointer",
                  }}
                  onClick={() => { if (!dis && d) setSelected(d); }}
                >
                  {label}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RangeGrid({ y, m, start, end, setStart, setEnd, isDisabled }) {
  const { weeks } = buildMonthMatrix(y, m, 0);
  const inRange = (d) => start && end && d >= start && d <= end;

  const onPick = (d) => {
    if (!start || (start && end)) {
      setStart(d); setEnd(null);
    } else if (start && !end) {
      if (d < start) { setEnd(start); setStart(d); } else { setEnd(d); }
    }
  };

  return (
    <table id="rangeGrid" cellPadding="6" style={{ borderCollapse: "collapse" }}>
      <thead>        <tr>          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <th key={d}>{d}</th>)}
        </tr>      </thead>      <tbody>
        {weeks.map((w, i) => (
          <tr key={i}>
            {w.map((d, j) => {
              const dis = isDisabled(d);
              const isStart = isSameDate(d, start);
              const isEnd = isSameDate(d, end);
              const inside = d && inRange(d);
              const id = d ? `range-${fmtYMD(d)}` : `range-null-${i}-${j}`;
              return (
                <td    key={j}       id={id}   data-date={d ? fmtYMD(d) : ""}     aria-disabled={dis}
                  aria-selected={isStart || isEnd}
                  style={{                   border: "1px solid #eee",   minWidth: 36,  textAlign: "center",
                    background: isStart || isEnd ? "#fde68a" : inside ? "#fef3c7" : dis ? "#f3f4f6" : "white",
                    color: dis ? "#9ca3af" : "inherit",  cursor: dis ? "not-allowed" : "pointer",   }}
                  onClick={() => { if (!dis && d) onPick(d); }}  >
                  {d ? d.getDate() : ""}
                </td>
              );            })}          </tr>        ))}      </tbody>
    </table>
  );
}
