// src/pages/requirements/AllRequirements.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaThList, FaThLarge, FaTh, FaSearch } from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

// ✅ Routes aligned to your Express router mounted at /api
const GET_ALL_REQS = `${globalBackendRoute}/api/requirements`;
const GET_REQS_BY_PROJECT = (pid) =>
  `${globalBackendRoute}/api/projects/${pid}/requirements`;
const GET_REQS_BY_MODULE = (pid, m) =>
  `${globalBackendRoute}/api/projects/${pid}/modules/${encodeURIComponent(m)}/requirements`;

// Client-side route for opening a single requirement page in your React app
const SINGLE_REQUIREMENT_ROUTE = (id) => `/single-requirement/${id}`;

export default function AllRequirements() {
  const { projectId, moduleName } = useParams();
  const navigate = useNavigate();

  const [requirements, setRequirements] = useState([]);
  const [view, setView] = useState("grid"); // grid | card | list
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [moduleFilter, setModuleFilter] = useState("All");
  const [reqNumberFilter, setReqNumberFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Sorting
  const [sortBy, setSortBy] = useState("Newest"); // Newest | Oldest | Module A→Z | Module Z→A | Req# ↑ | Req# ↓

  // Fetch data depending on route params
  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        let url = GET_ALL_REQS;
        if (projectId && moduleName) url = GET_REQS_BY_MODULE(projectId, moduleName);
        else if (projectId) url = GET_REQS_BY_PROJECT(projectId);

        const token = localStorage.getItem("token");
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const res = await axios.get(url, config);
        setRequirements(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching requirements:", err);
        setRequirements([]);
      }
    };
    fetchRequirements();
  }, [projectId, moduleName]);

  // Sync dropdown to URL moduleName (if present)
  useEffect(() => {
    if (moduleName) setModuleFilter(moduleName);
    else setModuleFilter("All");
  }, [moduleName]);

  const getCoverImage = (req) => {
    const first = Array.isArray(req.images) && req.images.length ? req.images[0] : null;
    if (!first) return "https://via.placeholder.com/600x400?text=Requirement";
    // Normalize Windows paths and strip leading "uploads/"
    const normalizedPath = String(first).replace(/\\/g, "/").split("uploads/").pop();
    // Static files typically served at /uploads (NOT behind /api)
    return `${globalBackendRoute}/uploads/${normalizedPath}`;
  };

  const openSingle = (id) => navigate(SINGLE_REQUIREMENT_ROUTE(id));

  // Build filter options
  const moduleOptions = useMemo(() => {
    const set = new Set();
    requirements.forEach((r) => r.module_name && set.add(r.module_name));
    const arr = Array.from(set).sort((a, b) => a.localeCompare(b));
    return ["All", ...arr];
  }, [requirements]);

  const statusOptions = useMemo(() => {
    const set = new Set();
    requirements.forEach((r) => set.add(r.status ?? "Unknown")); // schema currently has no 'status'
    return ["All", ...Array.from(set)];
  }, [requirements]);

  // Apply client-side search/filters/sort
  const filteredAndSorted = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    let arr = requirements.filter((r) => {
      const fields = [
        r.project_name,
        r.requirement_number,
        r.build_name_or_number,
        r.module_name,
        r.requirement_title,
        r.description,
      ]
        .filter(Boolean)
        .map((s) => String(s).toLowerCase());

      const matchesSearch = q.length === 0 || fields.some((f) => f.includes(q));

      const matchesModule =
        moduleFilter === "All" ||
        String(r.module_name ?? "").toLowerCase() === moduleFilter.toLowerCase();

      const reqNo = String(r.requirement_number ?? "");
      const matchesReqNumber =
        reqNumberFilter.trim().length === 0 ||
        reqNo.toLowerCase().includes(reqNumberFilter.trim().toLowerCase());

      const statusValue = (r.status ?? "Unknown").toLowerCase();
      const matchesStatus =
        statusFilter === "All" || statusValue === statusFilter.toLowerCase();

      return matchesSearch && matchesModule && matchesReqNumber && matchesStatus;
    });

    arr.sort((a, b) => {
      switch (sortBy) {
        case "Newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "Oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "Module A→Z":
          return String(a.module_name ?? "").localeCompare(String(b.module_name ?? ""));
        case "Module Z→A":
          return String(b.module_name ?? "").localeCompare(String(a.module_name ?? ""));
        case "Req# ↑":
          return String(a.requirement_number ?? "").localeCompare(
            String(b.requirement_number ?? ""),
            undefined,
            { numeric: true, sensitivity: "base" }
          );
        case "Req# ↓":
          return String(b.requirement_number ?? "").localeCompare(
            String(a.requirement_number ?? ""),
            undefined,
            { numeric: true, sensitivity: "base" }
          );
        default:
          return 0;
      }
    });

    return arr;
  }, [requirements, searchQuery, moduleFilter, reqNumberFilter, statusFilter, sortBy]);

  const clearFilters = () => {
    setModuleFilter("All");
    setReqNumberFilter("");
    setStatusFilter("All");
    setSortBy("Newest");
    setSearchQuery("");
    if (projectId && moduleName) {
      // If we were on a module route, go back to project scope
      navigate(`/all-requirements/${projectId}`);
    }
  };

  // If user changes module dropdown while we’re scoped to a project, update the URL to your module API
  const onModuleChange = (val) => {
    setModuleFilter(val);
    if (!projectId) return; // global list – just filter locally

    if (val === "All") {
      navigate(`/all-requirements/${projectId}`);
    } else {
      navigate(`/all-requirements/${projectId}/module/${encodeURIComponent(val)}`);
    }
  };

  const StatBadge = ({ label }) => (
    <span className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border">
      {label}
    </span>
  );

  const RequirementCard = ({ r }) => (
    <div
      onClick={() => openSingle(r._id)}
      className="flex flex-col items-start bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer"
    >
      <img
        src={getCoverImage(r)}
        alt={r.requirement_title || "Requirement"}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-3 w-full">
        <h3 className="text-md font-semibold text-gray-900 line-clamp-1">
          {r.requirement_title || "(Untitled Requirement)"}
        </h3>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
          {r.description || "No description"}
        </p>
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          {r.project_name && <StatBadge label={`Project: ${r.project_name}`} />}
          {r.module_name && <StatBadge label={`Module: ${r.module_name}`} />}
          {r.requirement_number && <StatBadge label={`Req#: ${r.requirement_number}`} />}
          <StatBadge label={`Created: ${new Date(r.createdAt).toLocaleDateString()}`} />
          <StatBadge label={`Status: ${r.status ?? "Unknown"}`} />
        </div>
      </div>
    </div>
  );

  const RequirementRow = ({ r }) => (
    <div
      onClick={() => openSingle(r._id)}
      className="flex items-center gap-4 bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer p-3"
    >
      <img
        src={getCoverImage(r)}
        alt={r.requirement_title || "Requirement"}
        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">
          {r.requirement_title || "(Untitled Requirement)"}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">{r.description || "No description"}</p>
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          {r.project_name && <StatBadge label={`Project: ${r.project_name}`} />}
          {r.module_name && <StatBadge label={`Module: ${r.module_name}`} />}
          {r.requirement_number && <StatBadge label={`Req#: ${r.requirement_number}`} />}
          <StatBadge label={`Created: ${new Date(r.createdAt).toLocaleDateString()}`} />
          <StatBadge label={`Status: ${r.status ?? "Unknown"}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header + Controls */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-left text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {projectId
                ? moduleName
                  ? `Requirements · ${moduleName}`
                  : "Project Requirements"
                : "All Requirements"}
            </h2>
            {projectId && (
              <Link
                to={`/all-requirements/${projectId}`}
                className="text-sm text-indigo-600 underline"
              >
                View all modules
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* View toggles */}
            <FaThList
              className={`text-xl cursor-pointer ${view === "list" ? "text-indigo-600" : "text-gray-600"}`}
              onClick={() => setView("list")}
              title="List view"
            />
            <FaThLarge
              className={`text-xl cursor-pointer ${view === "card" ? "text-indigo-600" : "text-gray-600"}`}
              onClick={() => setView("card")}
              title="Large card view"
            />
            <FaTh
              className={`text-xl cursor-pointer ${view === "grid" ? "text-indigo-600" : "text-gray-600"}`}
              onClick={() => setView("grid")}
              title="Grid view"
            />

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none"
                placeholder="Search requirements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <select
              className="border rounded-md px-3 py-2"
              value={moduleFilter}
              onChange={(e) => onModuleChange(e.target.value)}
              title="Filter by module"
            >
              {moduleOptions.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <input
              type="text"
              className="border rounded-md px-3 py-2"
              placeholder="Req# contains..."
              value={reqNumberFilter}
              onChange={(e) => setReqNumberFilter(e.target.value)}
              title="Filter by requirement number"
            />

            <select
              className="border rounded-md px-3 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              title="Filter by status"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              className="border rounded-md px-3 py-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              title="Sort by"
            >
              <option>Newest</option>
              <option>Oldest</option>
              <option>Module A→Z</option>
              <option>Module Z→A</option>
              <option>Req# ↑</option>
              <option>Req# ↓</option>
            </select>

            <button
              onClick={clearFilters}
              className="px-3 py-2 rounded-md border hover:bg-gray-50"
              title="Clear all filters"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-10">
          {view === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {filteredAndSorted.map((r) => (
                <div key={r._id} className="flex flex-col items-start relative">
                  <RequirementCard r={r} />
                </div>
              ))}
            </div>
          )}

          {view === "card" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSorted.map((r) => (
                <div key={r._id} className="flex flex-col items-start bg-white rounded-lg shadow relative">
                  <img
                    src={getCoverImage(r)}
                    alt={r.requirement_title || "Requirement"}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                  <div className="p-4 w-full cursor-pointer" onClick={() => openSingle(r._id)}>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {r.requirement_title || "(Untitled Requirement)"}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {r.description || "No description"}
                    </p>
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      {r.project_name && <StatBadge label={`Project: ${r.project_name}`} />}
                      {r.module_name && <StatBadge label={`Module: ${r.module_name}`} />}
                      {r.requirement_number && <StatBadge label={`Req#: ${r.requirement_number}`} />}
                      <StatBadge label={`Created: ${new Date(r.createdAt).toLocaleDateString()}`} />
                      <StatBadge label={`Status: ${r.status ?? "Unknown"}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {view === "list" && (
            <div className="space-y-6">
              {filteredAndSorted.map((r) => (
                <div key={r._id}>
                  <RequirementRow r={r} />
                </div>
              ))}
            </div>
          )}

          {filteredAndSorted.length === 0 && (
            <div className="text-center text-gray-500">No requirements found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
