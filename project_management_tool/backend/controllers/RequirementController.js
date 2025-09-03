// controllers/RequirementController.js
const mongoose = require("mongoose");
const Requirement = require("../models/RequirementModel");
const Project = require("../models/ProjectModel");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

const normalize = (s) =>
  String(s || "")
    .trim()
    .toLowerCase();

// -------- CREATE
exports.createRequirement = async (req, res) => {
  try {
    const {
      project_id,
      project_name,
      requirement_number,
      build_name_or_number,
      module_name,
      requirement_title,
      description,
      steps, // can be JSON string
      created_by,
    } = req.body;

    if (!project_id || !mongoose.Types.ObjectId.isValid(project_id)) {
      return res.status(400).json({ error: "Valid project_id is required" });
    }
    if (!module_name || !normalize(module_name)) {
      return res.status(400).json({ error: "module_name is required" });
    }

    // derive project name if not provided
    let finalProjectName = project_name;
    if (!finalProjectName) {
      const proj = await Project.findById(project_id)
        .select("project_name")
        .lean();
      if (!proj) return res.status(404).json({ error: "Project not found" });
      finalProjectName = proj.project_name;
    }

    // auto requirement_number if missing
    let finalRequirementNumber = requirement_number;
    if (!finalRequirementNumber) {
      const countForProject = await Requirement.countDocuments({ project_id });
      const short =
        (finalProjectName || "PRJ")
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, "")
          .slice(0, 4) || "PRJ";
      finalRequirementNumber = `REQ-${short}-${countForProject + 1}`;
    }

    const finalBuildNameOrNumber = build_name_or_number || "v1.0";
    const finalRequirementTitle =
      requirement_title || `Requirement for ${module_name}`;
    const module_name_normalized = normalize(module_name);

    // **Duplicate guard (server-side)**
    const dup = await Requirement.findOne({
      project_id,
      module_name_normalized,
    }).lean();

    if (dup) {
      return res.status(409).json({
        error: "Duplicate requirement",
        details:
          "A requirement with the same module name already exists for this project.",
      });
    }

    // images via multer
    const uploadedImages = Array.isArray(req.files)
      ? req.files.map((f) => f.path)
      : [];

    // steps normalize (supports steps JSON or instructions[] fallback)
    let finalSteps = [];

    // Preferred: steps as JSON (from frontend)
    if (steps) {
      let parsed = steps;
      if (typeof steps === "string") {
        try {
          parsed = JSON.parse(steps);
        } catch (_) {
          // ignore parse error, will try fallback below
        }
      }
      if (Array.isArray(parsed)) {
        finalSteps = parsed
          .map((s, idx) => ({
            step_number: Number(s.step_number) || idx + 1,
            instruction: String(s.instruction || "").trim(),
            for: s.for || "Both",
            image_url: undefined, // will attach below if we have uploads
          }))
          .filter((s) => s.instruction.length > 0);
      }
    }

    // Fallback: accept instructions[] if someone posts with bracket fields
    const rawInstructions =
      req.body["instructions[]"] ?? req.body.instructions ?? null;

    if (!finalSteps.length && rawInstructions) {
      const arr = Array.isArray(rawInstructions)
        ? rawInstructions
        : [rawInstructions];
      finalSteps = arr
        .map((txt, i) => ({
          step_number: i + 1,
          instruction: String(txt || "").trim(),
          for: "Both",
          image_url: undefined,
        }))
        .filter((s) => s.instruction.length > 0);
    }

    // Attach uploaded images to steps by order (first non-empty step gets first image, etc.)
    if (uploadedImages.length && finalSteps.length) {
      let imgIdx = 0;
      for (
        let i = 0;
        i < finalSteps.length && imgIdx < uploadedImages.length;
        i++
      ) {
        // Only attach if this step doesn’t already have an image_url
        if (!finalSteps[i].image_url) {
          finalSteps[i].image_url = uploadedImages[imgIdx++];
        }
      }
    }

    const finalCreatedBy = created_by || (req.user && req.user.id) || undefined;

    const newRequirement = new Requirement({
      project_id,
      project_name: finalProjectName,
      requirement_number: finalRequirementNumber,
      build_name_or_number: finalBuildNameOrNumber,
      module_name,
      module_name_normalized,
      requirement_title: finalRequirementTitle,
      description,
      // Keep a gallery of all uploaded images as before:
      images: uploadedImages,
      // And also save per-step details:
      steps: finalSteps,
      created_by: finalCreatedBy,
    });

    await newRequirement.save();
    return res
      .status(201)
      .json({ message: "Requirement created", data: newRequirement });
  } catch (error) {
    if (error?.code === 11000 && error?.keyPattern?.module_name_normalized) {
      return res.status(409).json({
        error: "Duplicate requirement",
        details:
          "A requirement with the same module name already exists for this project.",
      });
    }
    console.error("createRequirement error:", error);
    return res
      .status(500)
      .json({ error: "Failed to create requirement", details: error.message });
  }
};

// -------- READ: All
exports.getAllRequirements = async (req, res) => {
  try {
    // optional filter by project_id via query: /requirements?project_id=...
    const { project_id } = req.query;
    const filter =
      project_id && mongoose.Types.ObjectId.isValid(project_id)
        ? { project_id }
        : {};
    const requirements = await Requirement.find(filter).sort({ createdAt: -1 });
    res.status(200).json(requirements);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch requirements", details: error.message });
  }
};

// -------- READ: By ID
exports.getRequirementById = async (req, res) => {
  try {
    const requirement = await Requirement.findById(req.params.id);
    if (!requirement)
      return res.status(404).json({ error: "Requirement not found" });
    res.status(200).json(requirement);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch requirement", details: error.message });
  }
};

// -------- UPDATE
// controllers/RequirementController.js (replace the existing updateRequirement)
exports.updateRequirement = async (req, res) => {
  try {
    const { id } = req.params;

    // fetch existing for diff & file cleanup if needed
    const existing = await Requirement.findById(id);
    if (!existing) {
      return res.status(404).json({ error: "Requirement not found" });
    }

    const body = req.body || {};
    const updateFields = {};
    const changedFields = new Set();

    // basic fields
    if (
      body.requirement_title != null &&
      body.requirement_title !== existing.requirement_title
    ) {
      updateFields.requirement_title = body.requirement_title;
      changedFields.add("requirement_title");
    }
    if (body.description != null && body.description !== existing.description) {
      updateFields.description = body.description;
      changedFields.add("description");
    }
    if (
      body.build_name_or_number != null &&
      body.build_name_or_number !== existing.build_name_or_number
    ) {
      updateFields.build_name_or_number = body.build_name_or_number;
      changedFields.add("build_name_or_number");
    }
    if (body.module_name != null && body.module_name !== existing.module_name) {
      const mod = String(body.module_name).trim();
      updateFields.module_name = mod;
      updateFields.module_name_normalized = mod.toLowerCase();
      changedFields.add("module_name");
    }

    // steps
    let stepsReplaced = false;
    if (body.steps_replace === "true" || body.steps_replace === true) {
      let finalSteps = [];
      if (body.steps) {
        let parsed = body.steps;
        if (typeof parsed === "string") {
          try {
            parsed = JSON.parse(parsed);
          } catch (e) {
            parsed = [];
          }
        }
        if (Array.isArray(parsed)) {
          finalSteps = parsed
            .map((s, idx) => ({
              step_number: Number(s.step_number) || idx + 1,
              instruction: String(s.instruction || "").trim(),
              for: s.for || "Both",
            }))
            .filter((s) => s.instruction.length > 0);
        }
      }
      updateFields.steps = finalSteps;
      stepsReplaced = true;
      changedFields.add("steps");
    }

    // images
    const clearImages =
      body.clear_images === "true" || body.clear_images === true;
    const newImages = Array.isArray(req.files)
      ? req.files.map((f) => f.path)
      : [];

    if (clearImages) {
      // delete old files from disk
      const old = existing.images || [];
      await Promise.all(
        old.map(async (p) => {
          try {
            const abs = path.isAbsolute(p)
              ? p
              : path.join(process.cwd(), String(p).replace(/\\/g, "/"));
            await unlinkAsync(abs);
          } catch (_) {}
        })
      );
      updateFields.images = []; // reset
      changedFields.add("images");
    }

    if (newImages.length) {
      // append to images array
      if (!updateFields.images)
        updateFields.$push = { images: { $each: newImages } };
      else updateFields.images = (updateFields.images || []).concat(newImages);
      changedFields.add("images");
    }

    // attach new images to steps in order if steps replaced & newImages exist
    if (stepsReplaced && newImages.length) {
      // map in order to steps that don't have image_url
      updateFields.steps = (updateFields.steps || []).map((s, i) => ({
        ...s,
        image_url: newImages[i] || s.image_url,
      }));
    }

    // figure out who updated
    const updated_by =
      body.updated_by || (req.user && req.user.id) || undefined;
    let updated_by_name = "";
    try {
      if (req.user && req.user.name) updated_by_name = req.user.name;
    } catch (_) {}

    // apply update
    const updated = await Requirement.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    // audit log (push)
    if (updated) {
      const logEntry = {
        updated_by: updated_by,
        updated_by_name,
        changed_fields: Array.from(changedFields),
        at: new Date(),
      };
      await Requirement.findByIdAndUpdate(
        id,
        { $push: { update_logs: logEntry } },
        { new: true }
      );
    }

    return res
      .status(200)
      .json({ message: "Requirement updated", data: updated });
  } catch (error) {
    if (error?.code === 11000 && error?.keyPattern?.module_name_normalized) {
      return res.status(409).json({
        error: "Duplicate requirement",
        details:
          "A requirement with the same module name already exists for this project.",
      });
    }
    console.error("updateRequirement error:", error);
    return res
      .status(500)
      .json({ error: "Failed to update requirement", details: error.message });
  }
};

// -------- DELETE
// Helper: delete a file if it exists; ignore ENOENT
async function safeUnlink(absPath) {
  try {
    await unlinkAsync(absPath);
  } catch (err) {
    if (err.code !== "ENOENT") {
      // log other errors but don't fail the request
      console.warn("safeUnlink warning:", absPath, err.message);
    }
  }
}

// -------- DELETE (with file cleanup)
exports.deleteRequirement = async (req, res) => {
  try {
    const { id } = req.params;
    const reqDoc = await Requirement.findById(id).lean();

    if (!reqDoc) {
      return res.status(404).json({ error: "Requirement not found" });
    }

    // Gather all file paths referenced by this requirement
    const allPaths = [];

    if (Array.isArray(reqDoc.images)) {
      for (const p of reqDoc.images) if (p) allPaths.push(p);
    }
    if (Array.isArray(reqDoc.steps)) {
      for (const s of reqDoc.steps) {
        if (s && s.image_url) allPaths.push(s.image_url);
      }
    }

    // Convert relative paths (e.g., "uploads/requirements/....") to absolute
    // Assuming your server serves files from project root:
    const absPaths = allPaths
      .map((p) => String(p).replace(/\\/g, "/"))
      .map((p) => (path.isAbsolute(p) ? p : path.join(process.cwd(), p)));

    // Delete files from disk
    await Promise.all(absPaths.map((p) => safeUnlink(p)));

    // Finally delete the requirement
    await Requirement.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ message: "Requirement and files deleted successfully" });
  } catch (error) {
    console.error("deleteRequirement error:", error);
    return res
      .status(500)
      .json({ error: "Failed to delete requirement", details: error.message });
  }
};

// -------- COUNT
exports.countRequirements = async (_req, res) => {
  try {
    const count = await Requirement.countDocuments();
    res.status(200).json({ totalRequirements: count });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to count requirements", details: error.message });
  }
};

// -------- BY PROJECT
exports.getRequirementsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid projectId" });
    }
    const requirements = await Requirement.find({ project_id: projectId }).sort(
      {
        createdAt: -1,
      }
    );
    res.status(200).json(requirements);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch project requirements",
      details: error.message,
    });
  }
};

// -------- BY PROJECT + MODULE
exports.getRequirementsByModule = async (req, res) => {
  try {
    const { projectId, moduleName } = req.params;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid projectId" });
    }
    const requirements = await Requirement.find({
      project_id: projectId,
      module_name_normalized: normalize(moduleName),
    }).sort({ createdAt: -1 });
    res.status(200).json(requirements);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch module requirements",
      details: error.message,
    });
  }
};

// -------- SEARCH
exports.searchRequirements = async (req, res) => {
  try {
    const { keyword } = req.query;
    const regex = new RegExp(String(keyword || ""), "i");
    const results = await Requirement.find({
      $or: [{ requirement_title: regex }, { requirement_number: regex }],
    }).sort({ createdAt: -1 });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Search failed", details: error.message });
  }
};

// GET /api/projects/:id
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid project id" });
    }

    const proj = await Project.findById(id).lean();
    if (!proj) return res.status(404).json({ error: "Project not found" });

    // return both keys so the frontend can read either
    return res.status(200).json({
      ...proj,
      projectName: proj.project_name ?? proj.projectName ?? "",
    });
  } catch (err) {
    console.error("getProjectById error:", err);
    return res
      .status(500)
      .json({ error: "Failed to fetch project", details: err.message });
  }
};
