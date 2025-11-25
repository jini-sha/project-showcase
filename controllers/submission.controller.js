const asyncHandler = require("../middleware/asyncHandler.middleware");
const Submission = require("../models/submission.model");
const { StatusCodes } = require("http-status-codes");
const { submissionValidationSchema } = require("../validations/submission.validation");
const { Module } = require("../models/courseTimeline.model");

exports.submit = asyncHandler(async (req, res) => {
  const validated = submissionValidationSchema.parse(req.body);
  const module = await Module.findById(validated.module);
  if (!module) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Module not found" });

  const newSubmission = await Submission.create({
    ...validated,
    level: module.level,
    semesterNumber: module.semesterNumber,
    academicYear: module.academicYear
  });

  await newSubmission.populate([{ path: "course" }, { path: "module" }]);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Submission created successfully",
    submission: newSubmission
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

  const data = submissions.map(sub => {
    const course = sub.course.toObject();
    course.modules = [sub.module];
    return {
      ...sub.toObject(),
      course,
      module: undefined,
    };
  });

  res.status(StatusCodes.OK).json({
    success: true,
    total: submissions.length,
    data,
  });
});
