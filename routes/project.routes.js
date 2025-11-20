const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const {
  submitProject,
  getProjects,
  getProjectById,
  updateProjects,
  deleteProject,
} = require("../controllers/project.controller");
router.post("/create", upload.array("images", 5), submitProject);
router.get("/getProjects", getProjects);
router.get("/:id", getProjectById);
router.patch("/updateProject/:id", upload.array("images", 5), updateProjects);
router.delete("/deleteProject/:id", deleteProject);
module.exports = router;
