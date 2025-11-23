const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("../middleware/asyncHandler.middleware");
const Project = require("../models/project.model");
const { Course, Module } = require("../models/courseTimeline.model");
const fs = require("fs");
const { projectValidationSchema } = require("../validations/project.validation");
const { parseBoolean } = require("../utils/parseBool");

exports.submitProject = asyncHandler(async (req, res, next) => {
  const { courseId, moduleId } = req.body;

  const course = await Course.findById(courseId);
  if (!course) return next(Object.assign(new Error("Course not found"), { statusCode: StatusCodes.NOT_FOUND }));

  const module = await Module.findById(moduleId);
  if (!module || !module.course.equals(course._id))
    return next(Object.assign(new Error("Module not found for this course"), { statusCode: StatusCodes.BAD_REQUEST }));

  const data = {
    ...req.body,
    courseId: course._id.toString(),
    moduleId: module._id.toString(),
    level: module.level,
    semesterNumber: module.semesterNumber,
    academicYear: module.academicYear,
    featured: parseBoolean(req.body.featured),
    viewCount: req.body.viewCount ? Number(req.body.viewCount) : 0,
    images: req.files ? req.files.map(f => f.path) : [],
  };

  const validated = projectValidationSchema.safeParse(data);
  if (!validated.success) {
    if (req.files) req.files.forEach(f => fs.unlink(f.path, () => {}));
    const error = new Error("Validation failed");
    error.statusCode = StatusCodes.BAD_REQUEST;
    error.details = validated.error.errors;
    return next(error);
  }

  const newProject = await Project.create(validated.data);
  res.status(StatusCodes.CREATED).json({ success: true, message: "Project uploaded successfully", project: newProject });
});

exports.getProjects = asyncHandler(async (req, res) => {
  const { level, semesterNumber, courseId, featured, sort } = req.query;

  const filter = {};
  if (level) filter.level = level;
  if (semesterNumber) filter.semesterNumber = semesterNumber;
  if (courseId) filter.courseId = courseId;
  if (featured) filter.featured = parseBoolean(featured);

  let sortOption = { createdAt: -1 };
  if (sort === "oldest") sortOption = { createdAt: 1 };
  if (sort === "alphabetical") sortOption = { title: 1 };
  if (sort === "reverse-alpha") sortOption = { title: -1 };
  if (sort === "popular") sortOption = { viewCount: -1 };

  const projects = await Project.find(filter)
    .sort(sortOption)
    .populate("courseId")
    .populate("moduleId");

  res.status(StatusCodes.OK).json({ success: true, message: "Projects retrieved successfully", count: projects.length, projects });
});

exports.getProjectById = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id).populate("courseId").populate("moduleId");
  if (!project) return next(Object.assign(new Error("Project not found"), { statusCode: StatusCodes.NOT_FOUND }));
  res.status(StatusCodes.OK).json({ success: true, message: "Project retrieved successfully", project });
});

exports.updateProject = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { courseId, moduleId } = req.body;

  const project = await Project.findById(id);
  if (!project) return next(Object.assign(new Error("Project not found"), { statusCode: StatusCodes.NOT_FOUND }));

  if (courseId) {
    const course = await Course.findById(courseId);
    if (!course) return next(Object.assign(new Error("Course not found"), { statusCode: StatusCodes.NOT_FOUND }));
    project.courseId = course._id.toString();
  }

  if (moduleId) {
    const module = await Module.findById(moduleId);
    if (!module || !module.course.equals(project.courseId))
      return next(Object.assign(new Error("Module not found for this course"), { statusCode: StatusCodes.BAD_REQUEST }));
    project.moduleId = module._id.toString();
    project.level = module.level;
    project.semesterNumber = module.semesterNumber;
    project.academicYear = module.academicYear;
  }

  if (req.files) project.images = req.files.map(f => f.path);
  Object.assign(project, req.body);
  const validated = projectValidationSchema.partial().safeParse(project.toObject());
  if (!validated.success) {
    if (req.files) req.files.forEach(f => fs.unlink(f.path, () => {}));
    const error = new Error("Validation failed");
    error.statusCode = StatusCodes.BAD_REQUEST;
    error.details = validated.error.errors;
    return next(error);
  }

  Object.assign(project, validated.data);
  await project.save();
  res.status(StatusCodes.OK).json({ success: true, message: "Project updated successfully", project });
});

exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) return next(Object.assign(new Error("Project not found"), { statusCode: StatusCodes.NOT_FOUND }));

  if (project.images && project.images.length) project.images.forEach(f => fs.unlink(f, () => {}));
  await project.deleteOne();
  res.status(StatusCodes.OK).json({ success: true, message: "Project deleted successfully" });
});
