const express = require("express");
const router = express.Router();
const {
  createTimeline,
  getTimelines,
  updateTimeline,
  deleteTimeline,
  deleteModule,
} = require("../controllers/courseTimeline.controller");
router.post("/create", createTimeline);
router.get("/get", getTimelines);
router.patch("/update/:id", updateTimeline);
router.delete("/delete/:id/:moduleCode", deleteModule);
router.delete("/delete/:id", deleteTimeline);
module.exports = router;
