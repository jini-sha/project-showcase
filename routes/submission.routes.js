const express = require("express");
const { submit,getSubmissions } = require("../controllers/submission.controller");
const router = express.Router();
router.post("/submit", submit);
router.get("/submissions",getSubmissions)

module.exports = router;
