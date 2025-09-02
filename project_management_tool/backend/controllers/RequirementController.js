// const Requirement = require("../models/RequirementModel.js");
// const Project = require("../models/ProjectModel.js");
// const mongoose = require("mongoose");

// exports.createRequirement = async (req, res) => {
//   try {
//     const {
//       project_id,
//       project_name,              // optional from client
//       requirement_number,        // optional from client
//       build_name_or_number,      // optional from client
//       module_name,               // required
//       requirement_title,         // optional from client
//       description,               // optional
//       steps,                     // optional JSON string OR array of objects
//       created_by,                // optional; or use req.user? (if protect)
//     } = req.body;

//     // ---- Basic validations
//     if (!project_id || !mongoose.Types.ObjectId.isValid(project_id)) {
//       return res.status(400).json({ error: "Valid project_id is required" });
//     }
//     if (!module_name) {
//       return res.status(400).json({ error: "module_name is required" });
//     }

//     // ---- Derive project_name from DB if not provided
//     let finalProjectName = project_name;
//     if (!finalProjectName) {
//       const proj = await Project.findById(project_id).select("project_name");
//       if (!proj) {
//         return res.status(404).json({ error: "Project not found" });
//       }
//       finalProjectName = proj.project_name;
//     }

//     // ---- Build requirement_number if not provided (e.g., incremental per project)
//     let finalRequirementNumber = requirement_number;
//     if (!finalRequirementNumber) {
//       // Example: REQ-<projectShort>-<count+1>
//       const countForProject = await Requirement.countDocuments({ project_id });
//       const short = (finalProjectName || "PRJ").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4) || "PRJ";
//       finalRequirementNumber = `REQ-${short}-${countForProject + 1}`;
//     }

//     // ---- Build name/number default if not provided
//     const finalBuildNameOrNumber = build_name_or_number || "v1.0";

//     // ---- Title default if not provided
//     const finalRequirementTitle = requirement_title || `Requirement for ${module_name}`;

//     // ---- Images from multer
//     const images = Array.isArray(req.files) ? req.files.map(f => f.path) : [];

//     // ---- Normalize steps:
//     // You may receive:
//     //  1) steps as JSON string (array of objects) in req.body.steps
//     //  2) "instructions[]" as array of strings (your current UI)
//     let finalSteps = [];

//     // Case 1: steps provided explicitly (object array or JSON)
//     if (steps) {
//       let parsed = steps;
//       if (typeof steps === "string") {
//         try { parsed = JSON.parse(steps); } catch (e) { /* ignore */ }
//       }
//       if (Array.isArray(parsed)) {
//         finalSteps = parsed.map((s, idx) => ({
//           step_number: s.step_number ?? idx + 1,
//           instruction: (s.instruction || "").trim(),
//           for: s.for || "Both",
//         })).filter(s => s.instruction.length > 0);
//       }
//     }

//     // Case 2: instructions[] coming from your current UI
//     const rawInstructions = req.body["instructions[]"];
//     if (rawInstructions) {
//       const instrArray = Array.isArray(rawInstructions) ? rawInstructions : [rawInstructions];
//       const mapped = instrArray
//         .map((txt, idx) => ({
//           step_number: idx + 1,
//           instruction: String(txt || "").trim(),
//           for: "Both",
//         }))
//         .filter(s => s.instruction.length > 0);

//       // If both exist, merge; otherwise use whichever is present
//       if (finalSteps.length === 0) finalSteps = mapped;
//       else finalSteps = finalSteps.concat(mapped);
//     }

//     // ---- created_by (fallback to authenticated user if available)
//     const finalCreatedBy = created_by || (req.user && req.user.id) || undefined;

//     // ---- Create and save
//     const newRequirement = new Requirement({
//       project_id,
//       project_name: finalProjectName,
//       requirement_number: finalRequirementNumber,
//       build_name_or_number: finalBuildNameOrNumber,
//       module_name,
//       requirement_title: finalRequirementTitle,
//       description,
//       images,
//       steps: finalSteps,
//       created_by: finalCreatedBy,
//     });

//     await newRequirement.save();
//     return res.status(201).json({ message: "Requirement created", data: newRequirement });
//   } catch (error) {
//     console.error("createRequirement error:", error);
//     return res.status(500).json({ error: "Failed to create requirement", details: error.message });
//   }
// };


// // ✅ READ: Get all requirements
// exports.getAllRequirements = async (req, res) => {
//   try {
//     const requirements = await Requirement.find().sort({ createdAt: -1 });
//     res.status(200).json(requirements);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch requirements", details: error.message });
//   }
// };

// // ✅ READ: Get a single requirement by ID
// exports.getRequirementById = async (req, res) => {
//   try {
//     const requirement = await Requirement.findById(req.params.id);
//     if (!requirement) return res.status(404).json({ error: "Requirement not found" });
//     res.status(200).json(requirement);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch requirement", details: error.message });
//   }
// };

// // ✅ UPDATE: Update a requirement by ID
// exports.updateRequirement = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateFields = req.body;

//     // Handle new images if any
//     const newImages = req.files ? req.files.map(file => file.path) : [];
//     if (newImages.length > 0) {
//       updateFields.$push = { images: { $each: newImages } };
//     }

//     const updatedRequirement = await Requirement.findByIdAndUpdate(
//       id,
//       updateFields,
//       { new: true, runValidators: true }
//     );

//     if (!updatedRequirement)
//       return res.status(404).json({ error: "Requirement not found" });

//     res.status(200).json({ message: "Requirement updated", data: updatedRequirement });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update requirement", details: error.message });
//   }
// };

// // ✅ DELETE: Remove a requirement by ID
// exports.deleteRequirement = async (req, res) => {
//   try {
//     const deleted = await Requirement.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ error: "Requirement not found" });
//     res.status(200).json({ message: "Requirement deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to delete requirement", details: error.message });
//   }
// };

// // ✅ COUNT: Total number of requirements
// exports.countRequirements = async (req, res) => {
//   try {
//     const count = await Requirement.countDocuments();
//     res.status(200).json({ totalRequirements: count });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to count requirements", details: error.message });
//   }
// };

// // ✅ Get requirements by project ID
// exports.getRequirementsByProject = async (req, res) => {
//   try {
//     const { projectId } = req.params;
//     const requirements = await Requirement.find({ project_id: projectId });
//     res.status(200).json(requirements);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch project requirements", details: error.message });
//   }
// };

// // ✅ Get requirements by module name (within a project)
// exports.getRequirementsByModule = async (req, res) => {
//   try {
//     const { projectId, moduleName } = req.params;
//     const requirements = await Requirement.find({
//       project_id: projectId,
//       module_name: moduleName,
//     });
//     res.status(200).json(requirements);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch module requirements", details: error.message });
//   }
// };

// // ✅ Search requirements by title or requirement number
// exports.searchRequirements = async (req, res) => {
//   try {
//     const { keyword } = req.query;
//     const regex = new RegExp(keyword, "i"); // case-insensitive
//     const results = await Requirement.find({
//       $or: [{ requirement_title: regex }, { requirement_number: regex }],
//     });
//     res.status(200).json(results);
//   } catch (error) {
//     res.status(500).json({ error: "Search failed", details: error.message });
//   }
// };


// new 

// controllers/RequirementController.js
const mongoose = require("mongoose");
const Requirement = require("../models/RequirementModel");
const Project = require("../models/ProjectModel");

const normalize = (s) => String(s || "").trim().toLowerCase();

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
      steps,
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
      const proj = await Project.findById(project_id).select("project_name").lean();
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
    const finalRequirementTitle = requirement_title || `Requirement for ${module_name}`;
    const module_name_normalized = normalize(module_name);

    // **Duplicate guard (server-side)**
    const dup = await Requirement.findOne({
      project_id,
      module_name_normalized,
    }).lean();

    if (dup) {
      return res.status(409).json({
        error: "Duplicate requirement",
        details: "A requirement with the same module name already exists for this project.",
      });
    }

    // images via multer
    const images = Array.isArray(req.files) ? req.files.map((f) => f.path) : [];

    // steps normalize (supports steps JSON or instructions[])
    let finalSteps = [];

    if (steps) {
      let parsed = steps;
      if (typeof steps === "string") {
        try {
          parsed = JSON.parse(steps);
        } catch (_) {}
      }
      if (Array.isArray(parsed)) {
        finalSteps = parsed
          .map((s, idx) => ({
            step_number: s.step_number ?? idx + 1,
            instruction: String(s.instruction || "").trim(),
            for: s.for || "Both",
          }))
          .filter((s) => s.instruction.length > 0);
      }
    }

    const rawInstructions = req.body["instructions[]"];
    if (rawInstructions) {
      const arr = Array.isArray(rawInstructions) ? rawInstructions : [rawInstructions];
      const mapped = arr
        .map((txt, i) => ({
          step_number: (finalSteps.length ? finalSteps.length : 0) + i + 1,
          instruction: String(txt || "").trim(),
          for: "Both",
        }))
        .filter((s) => s.instruction.length > 0);

      finalSteps = finalSteps.concat(mapped);
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
      images,
      steps: finalSteps,
      created_by: finalCreatedBy,
    });

    await newRequirement.save();
    return res
      .status(201)
      .json({ message: "Requirement created", data: newRequirement });
  } catch (error) {
    // Handle unique index collision nicely
    if (error?.code === 11000 && error?.keyPattern?.module_name_normalized) {
      return res.status(409).json({
        error: "Duplicate requirement",
        details: "A requirement with the same module name already exists for this project.",
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
    const filter = project_id && mongoose.Types.ObjectId.isValid(project_id)
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
    if (!requirement) return res.status(404).json({ error: "Requirement not found" });
    res.status(200).json(requirement);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch requirement", details: error.message });
  }
};

// -------- UPDATE
exports.updateRequirement = async (req, res) => {
  try {
    const { id } = req.params;

    // collect fields
    const updateFields = { ...req.body };

    // normalize module_name if provided (keep DB constraints in sync)
    if (updateFields.module_name) {
      updateFields.module_name = String(updateFields.module_name).trim();
      updateFields.module_name_normalized = normalize(updateFields.module_name);
    }

    // handle new images if any (append)
    const newImages = Array.isArray(req.files) ? req.files.map((f) => f.path) : [];
    if (newImages.length > 0) {
      updateFields.$push = { images: { $each: newImages } };
    }

    const updatedRequirement = await Requirement.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedRequirement) {
      return res.status(404).json({ error: "Requirement not found" });
    }

    res
      .status(200)
      .json({ message: "Requirement updated", data: updatedRequirement });
  } catch (error) {
    if (error?.code === 11000 && error?.keyPattern?.module_name_normalized) {
      return res.status(409).json({
        error: "Duplicate requirement",
        details: "A requirement with the same module name already exists for this project.",
      });
    }
    res
      .status(500)
      .json({ error: "Failed to update requirement", details: error.message });
  }
};

// -------- DELETE
exports.deleteRequirement = async (req, res) => {
  try {
    const deleted = await Requirement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Requirement not found" });
    res.status(200).json({ message: "Requirement deleted successfully" });
  } catch (error) {
    res
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
    const requirements = await Requirement.find({ project_id: projectId }).sort({
      createdAt: -1,
    });
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
    res
      .status(500)
      .json({ error: "Search failed", details: error.message });
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
    return res.status(500).json({ error: "Failed to fetch project", details: err.message });
  }
};