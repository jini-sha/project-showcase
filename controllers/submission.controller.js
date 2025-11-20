const asyncHandler = require("../middleware/asyncHandler.middleware");
const Submission = require("../models/submission.model");
const { StatusCodes } = require("http-status-codes");
const {
  submissionValidationSchema,
} = require("../validations/submission.validation");

exports.submit = asyncHandler(async (req, res) => {
  const validatedSubmission = submissionValidationSchema.parse(req.body);

  const newSubmission = await Submission.create(validatedSubmission);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Submission created successfully",
    submission: newSubmission,
  });
});

exports.getSubmissions = asyncHandler(async (req, res) => {
  const { level, semester, sort = "desc" } = req.query;

  const filter = {};
  if (level) filter.level = level;
  if (semester) filter.semester = semester;

  const sortOrder = sort.toLowerCase() === "asc" ? 1 : -1;

  const submissions = await Submission.find(filter).sort({
    createdAt: sortOrder,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    total: submissions.length,
    data: submissions,
  });
});
