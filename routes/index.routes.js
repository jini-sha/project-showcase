const express = require("express");
const mainRouter = express.Router();
const submissionRoutes = require("./submission.routes");
const projectRoutes = require("./project.routes");
const courseTimelineRoutes = require("./courseTimeline.routes");
mainRouter.use("/", submissionRoutes);
mainRouter.use("/project", projectRoutes);
mainRouter.use("/courseTimeline", courseTimelineRoutes);
module.exports = mainRouter;
