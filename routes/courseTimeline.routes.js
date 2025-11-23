const express = require("express");
const router = express.Router();
const {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
  createModule,
  updateModule,
  deleteModule
} = require("../controllers/courseTimeline.controller");

router.post("/course", createCourse);
router.get("/course", getCourses);
router.patch("/course/:id", updateCourse);
router.delete("/course/:id", deleteCourse);

router.post("/module", createModule);
router.patch("/module/:moduleId", updateModule);
router.delete("/module/:moduleId", deleteModule);

module.exports = router;
