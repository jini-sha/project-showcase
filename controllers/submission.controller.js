const asyncHandler = require("../middleware/asyncHandler.middleware");
const Submission = require("../models/submission.model");
const { StatusCodes } = require("http-status-codes");
const { submissionValidationSchema } = require("../validations/submission.validation");

exports.submit = asyncHandler(async (req, res) => {
  const validated = submissionValidationSchema.parse(req.body);

  const newSubmission = await Submission.create(validated);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Submission created successfully",
    submission: newSubmission,
  });
});

exports.getSubmissions = asyncHandler(async (req, res) => {
  const { courseId, moduleId, sort = "desc" } = req.query;

  const filter = {};
  if (courseId) filter.course = courseId;
  if (moduleId) filter.module = moduleId;

  const sortOrder = sort.toLowerCase() === "asc" ? 1 : -1;

  const submissions = await Submission.find(filter)
    .populate("course")
    .populate("module")
    .sort({ createdAt: sortOrder });

  res.status(StatusCodes.OK).json({
    success: true,
    total: submissions.length,
    data: submissions,
  });
});
