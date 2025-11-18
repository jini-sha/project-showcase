const express = require("express");
const mainRouter = express.Router();
const submissionRoutes = require('./submission.routes');
mainRouter.use('/', submissionRoutes);
module.exports = mainRouter;
