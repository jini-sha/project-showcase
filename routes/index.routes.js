const express = require("express");
const mainRouter = express.Router();
const submissionRoutes = require('./submission.routes');
const projectRoutes=require('./project.routes')
mainRouter.use('/', submissionRoutes);
mainRouter.use('/project', projectRoutes);
module.exports = mainRouter;
