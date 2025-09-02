// src/pages/requirements/SingleRequirement.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import globalBackendRoute from "../../config/Config";

const GET_SINGLE_REQUIREMENT = (id) =>  `${globalBackendRoute}/api/single-requirement/${id}`;
const UPDATE_REQUIREMENT_ROUTE = (id) => `/update-requirement/${id}`;
const PROJECT_REQUIREMENTS_ROUTE = (projectId) => `/all-requirements/${projectId}`;
const MODULE_REQUIREMENTS_ROUTE = (projectId, moduleName) =>
  `/all-requirements/${projectId}/module/${encodeURIComponent(moduleName)}`;

const normalizeImageUrl = (urlOrPath) => {
  if (!urlOrPath) return "https://via.placeholder.com/800x450?text=Requirement";
  if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;
  const normalizedPath = String(urlOrPath).replace(/\\/g, "/").split("uploads/").pop();
  return `${globalBackendRoute}/uploads/${normalizedPath}`;
};

export default function SingleRequirement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reqData, setReqData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [role, setRole] = useState("");
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.role) setRole(user.role);
    } catch (_) {}
  }, []);

  // Fetch single requirement
  useEffect(() => {
    let isMounted = true;
    const fetchOne = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(GET_SINGLE_REQUIREMENT(id), {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!isMounted) return;
        setReqData(res?.data || null);
      } catch (err) {
        if (!isMounted) return;
        setFetchError(err?.response?.data?.error || "Failed to fetch requirement");
        setReqData(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchOne();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const canEdit = useMemo(() => {
    const r = (role || "").toLowerCase();
    return r === "superadmin" || r === "project_manager";
  }, [role]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading requirement…</div>
      </div>
    );
  }

  if (fetchError || !reqData) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
        >
          <FaArrowLeft /> Back
        </button>
        <div className="mt-6 rounded-lg border p-6 bg-white">
          <p className="text-red-600 font-medium">{fetchError || "Requirement not found."}</p>
        </div>
      </div>
    );
  }

  const {
    _id,
    project_id,
    project_name,
    requirement_number,
    build_name_or_number,
    module_name,
    requirement_title,
    description,
    images = [],
    steps = [],
    createdAt,
  } = reqData;

  const cover = normalizeImageUrl(images?.[0]);
  const restImages = (images || []).slice(1).map(normalizeImageUrl);

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Top bar: back + actions */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
            >
              <FaArrowLeft />
              Back
            </button>

            {project_id && (
              <Link
                to={PROJECT_REQUIREMENTS_ROUTE(project_id)}
                className="text-sm text-indigo-600 hover:underline"
              >
                View all requirements for this project
              </Link>
            )}

            {project_id && module_name && (
              <Link
                to={MODULE_REQUIREMENTS_ROUTE(project_id, module_name)}
                className="text-sm text-indigo-600 hover:underline"
              >
                View {module_name} module list
              </Link>
            )}
          </div>

          {canEdit && (
            <Link
              to={UPDATE_REQUIREMENT_ROUTE(_id)}
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50"
              title="Update requirement"
            >
              <FaEdit />
              Update
            </Link>
          )}
        </div>

        {/* Header */}
        <div className="mt-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {requirement_title || "(Untitled Requirement)"}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {project_name && (
              <span className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border">
                Project: {project_name}
              </span>
            )}
            {module_name && (
              <span className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border">
                Module: {module_name}
              </span>
            )}
            {requirement_number && (
              <span className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border">
                Req#: {requirement_number}
              </span>
            )}
            {build_name_or_number && (
              <span className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border">
                Build: {build_name_or_number}
              </span>
            )}
            {createdAt && (
              <span className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border">
                Created: {new Date(createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Media */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main image */}
          <div className="lg:col-span-2">
            <img
              src={cover}
              alt={requirement_title || "Requirement"}
              className="w-full h-80 sm:h-96 object-cover rounded-xl shadow"
            />
          </div>

          {/* Thumbnails */}
          <div className="lg:col-span-1">
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-2 gap-3">
              {(restImages.length ? restImages : []).map((src, idx) => (
                <a key={idx} href={src} target="_blank" rel="noreferrer">
                  <img
                    src={src}
                    alt={`Requirement image ${idx + 2}`}
                    className="w-full h-28 object-cover rounded-lg border hover:shadow"
                  />
                </a>
              ))}
              {images.length === 0 && (
                <div className="col-span-full text-sm text-gray-500">
                  No additional images.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 rounded-lg border bg-white p-5">
          <h2 className="text-lg font-semibold text-gray-900">Description</h2>
          <p className="mt-2 text-gray-700 whitespace-pre-line">
            {description || "No description provided."}
          </p>
        </div>

        {/* Steps */}
        <div className="mt-8 rounded-lg border bg-white p-5">
          <h2 className="text-lg font-semibold text-gray-900">Steps</h2>
          {Array.isArray(steps) && steps.length > 0 ? (
            <ol className="mt-4 space-y-3">
              {steps.map((s, i) => {
                const n = s?.step_number ?? i + 1;
                const forWhom = s?.for || "Both";
                return (
                  <li key={i} className="p-3 rounded-md border">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Step {n}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border">
                        For: {forWhom}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-700 whitespace-pre-line">
                      {s?.instruction || "No instruction."}
                    </p>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="mt-2 text-gray-600">No steps added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
