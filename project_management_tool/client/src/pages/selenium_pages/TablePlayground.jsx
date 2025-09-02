import React, { useEffect, useMemo, useState } from "react";

/**
 * Table Playground
 * - Basic table (#tableBasic)
 * - Sort + Filter + Pagination table (#tableSFPT)
 * - Row selection with checkboxes (#tableSelect)
 * - Merged cells (rowspan/colspan) (#tableMerged)
 * - Scrollable table container (#tableScroll)
 * - Async load table (#tableAsync)
 * - Editable cells (contenteditable) in SFP table
 */

const basePeople = [
  { id: 1, name: "Alice",   role: "QA",      city: "Bengaluru", age: 29 },
  { id: 2, name: "Bob",     role: "Dev",     city: "Mumbai",    age: 32 },
  { id: 3, name: "Charlie", role: "Manager", city: "Delhi",     age: 41 },
  { id: 4, name: "Diana",   role: "Dev",     city: "Pune",      age: 27 },
  { id: 5, name: "Evan",    role: "QA",      city: "Chennai",   age: 36 },
  { id: 6, name: "Fiona",   role: "DevOps",  city: "Hyderabad", age: 30 },
  { id: 7, name: "Gina",    role: "QA",      city: "Bengaluru", age: 24 },
  { id: 8, name: "Henry",   role: "Dev",     city: "Kolkata",   age: 35 },
  { id: 9, name: "Iris",    role: "DevOps",  city: "Noida",     age: 33 },
  { id:10, name: "Jon",     role: "Manager", city: "Delhi",     age: 45 },
];

export default function TablePlayground() {
  // SFP (sort/filter/pagination) table state
  const [data, setData] = useState(basePeople);
  const [sort, setSort] = useState({ key: "id", dir: "asc" });
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const filtered = useMemo(() => {
    if (!filter.trim()) return data;
    const q = filter.toLowerCase();
    return data.filter((r) =>
      String(r.id).includes(q) ||
      r.name.toLowerCase().includes(q) ||
      r.role.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q) ||
      String(r.age).includes(q)
    );
  }, [data, filter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a,b) => {
      const A = a[sort.key], B = b[sort.key];
      if (A === B) return 0;
      if (typeof A === "number" && typeof B === "number") {
        return sort.dir === "asc" ? A - B : B - A;
      }
      return sort.dir === "asc"
        ? String(A).localeCompare(String(B))
        : String(B).localeCompare(String(A));
    });
    return arr;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageData   = sorted.slice((page-1)*pageSize, page*pageSize);

  // Editable cell handler (contenteditable on name)
  const onNameBlur = (id, ev) => {
    const val = ev.currentTarget.textContent.trim();
    setData((prev) => prev.map(r => r.id === id ? { ...r, name: val } : r));
  };

  // Selection table state
  const [selectData, setSelectData] = useState(basePeople.slice(0,6));
  const [selectedIds, setSelectedIds] = useState(new Set());
  const allSelected = selectedIds.size === selectData.length && selectData.length > 0;

  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(selectData.map(r => r.id)));
  };
  const toggleOne = (id) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  // Async table
  const [asyncRows, setAsyncRows] = useState([]);
  const [asyncLoading, setAsyncLoading] = useState(false);
  const loadAsync = () => {
    setAsyncLoading(true);
    setTimeout(() => {
      setAsyncRows([
        { id:101, product:"Keyboard", price:1999 },
        { id:102, product:"Mouse",    price: 899 },
        { id:103, product:"Monitor",  price:8999 },
      ]);
      setAsyncLoading(false);
    }, 1200);
  };

  // Row delete in SFP table
  const deleteRow = (id) => setData(prev => prev.filter(r => r.id !== id));

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 16 }}>
      <header style={{ padding: 16, background: "#4f46e5", color: "white", borderRadius: 12, marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>Tables Playground</h1>
        <p style={{ opacity: 0.9 }}>All common patterns with stable IDs.</p>
      </header>

      {/* 1) Basic table */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700 }}>1) Basic table</h2>
        <table id="tableBasic" border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
          <caption id="basicCaption">Employees (basic)</caption>
          <thead>
            <tr id="basicHeadRow">
              <th>Id</th><th>Name</th><th>Role</th><th>City</th><th>Age</th>
            </tr>
          </thead>
          <tbody id="basicBody">
            {basePeople.slice(0,5).map(r => (
              <tr key={r.id}>
                <td>{r.id}</td><td>{r.name}</td><td>{r.role}</td><td>{r.city}</td><td>{r.age}</td>
              </tr>
            ))}
          </tbody>          <tfoot>   <tr><td id="basicFoot" colSpan="5">Total rows: 5</td></tr>   </tfoot>
        </table>
      </section>
      {/* 2) Sort + Filter + Pagination + Editable + Actions */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700 }}>2) Sort / Filter / Pagination (editable names)</h2>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
          <label htmlFor="filterInput">Filter:</label>
          <input     id="filterInput"        value={filter}    onChange={(e)=>{ setFilter(e.target.value); setPage(1); }}
            placeholder="id/name/role/city/age"
            style={{ padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6 }}     />
          <span id="pageInfo">Page {page}/{totalPages}</span>
          <button id="prevPage" disabled={page<=1} onClick={()=>setPage(p => Math.max(1, p-1))}>Prev</button>
          <button id="nextPage" disabled={page>=totalPages} onClick={()=>setPage(p => Math.min(totalPages, p+1))}>Next</button>        </div>

        <table id="tableSFPT" border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>            <tr>
              <th id="sortId"     data-key="id"    onClick={()=>toggleSort(setSort, "id",   sort)}>ID {arrow(sort,"id")}</th>
              <th id="sortName"   data-key="name"  onClick={()=>toggleSort(setSort, "name", sort)}>Name {arrow(sort,"name")}</th>
              <th id="sortRole"   data-key="role"  onClick={()=>toggleSort(setSort, "role", sort)}>Role {arrow(sort,"role")}</th>
              <th id="sortCity"   data-key="city"  onClick={()=>toggleSort(setSort, "city", sort)}>City {arrow(sort,"city")}</th>
              <th id="sortAge"    data-key="age"   onClick={()=>toggleSort(setSort, "age",  sort)}>Age {arrow(sort,"age")}</th>
              <th>Actions</th>            </tr>          </thead>          <tbody id="sfptBody">
            {pageData.map(r => (
              <tr key={r.id} data-id={r.id}>
                <td data-col="id">{r.id}</td>
 <td data-col="name" contentEditable suppressContentEditableWarning onBlur={(e)=>onNameBlur(r.id, e)}>{r.name}</td>
                <td data-col="role">{r.role}</td>
                <td data-col="city">{r.city}</td>
                <td data-col="age">{r.age}</td>
                <td>
                  <button id={`btnDetails-${r.id}`} onClick={()=>alert(`Details of ${r.name}`)}>Details</button>
                  <button id={`btnDelete-${r.id}`}  onClick={()=>deleteRow(r.id)} style={{ marginLeft: 6 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 3) Selection table */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700 }}>3) Row Selection (checkbox + select-all)</h2>
        <table id="tableSelect" border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>            <tr>
              <th><input id="chkSelectAll" type="checkbox" checked={allSelected} onChange={toggleAll} /></th>
              <th>ID</th><th>Name</th><th>Role</th>            </tr>          </thead>
          <tbody id="selectBody">
            {selectData.map(r => (
              <tr key={r.id} data-id={r.id}>
   <td><input id={`chk-${r.id}`} type="checkbox" checked={selectedIds.has(r.id)} onChange={()=>toggleOne(r.id)} /></td>
                <td>{r.id}</td><td>{r.name}</td><td>{r.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div id="selectionSummary" style={{ marginTop: 6, fontFamily: "monospace", fontSize: 12 }}>
          Selected IDs: {Array.from(selectedIds).join(", ") || "(none)"}
        </div>
      </section>

      {/* 4) Merged cells */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700 }}>4) Merged cells (rowspan/colspan)</h2>
        <table id="tableMerged" border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th rowSpan="2">Region</th>
              <th colSpan="2">Sales</th>
            </tr>
            <tr>
              <th>2024</th><th>2025</th>
            </tr>
          </thead>
          <tbody id="mergedBody">
            <tr><td rowSpan="2" data-col="region">North</td><td data-col="s2024">120</td><td data-col="s2025">140</td></tr>
            <tr><td data-col="s2024">160</td><td data-col="s2025">170</td></tr>
            <tr><td rowSpan="2" data-col="region">South</td><td data-col="s2024">110</td><td data-col="s2025">115</td></tr>
            <tr><td data-col="s2024">130</td><td data-col="s2025">160</td></tr>
          </tbody>
        </table>
      </section>

      {/* 5) Scrollable container */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700 }}>5) Scrollable table container</h2>
        <div id="scrollWrap" style={{ height: 160, overflow: "auto", border: "1px solid #ddd", borderRadius: 8 }}>
          <table id="tableScroll" border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr><th>#</th><th>Value</th></tr>
            </thead>
            <tbody id="scrollBody">
              {Array.from({ length: 40 }).map((_, i) => (
                <tr key={i} id={`row-${i+1}`}><td>{i+1}</td><td>Row {i+1} value</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6) Async load */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700 }}>6) Async table</h2>
        <button id="btnLoadAsyncTable" onClick={loadAsync} disabled={asyncLoading}>
          {asyncLoading ? "Loading…" : "Load products"}
        </button>
        <table id="tableAsync" border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%", marginTop: 8 }}>
          <thead><tr><th>ID</th><th>Product</th><th>Price</th></tr></thead>
          <tbody id="asyncBody">
            {asyncRows.map(r => <tr key={r.id}><td>{r.id}</td><td>{r.product}</td><td>{r.price}</td></tr>)}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function arrow(sort, key) {
  if (sort.key !== key) return "↕";
  return sort.dir === "asc" ? "↑" : "↓";
}
function toggleSort(setSort, key, sort) {
  setSort((prev) => prev.key === key ? ({ key, dir: prev.dir === "asc" ? "desc" : "asc" }) : ({ key, dir: "asc" }));
}
