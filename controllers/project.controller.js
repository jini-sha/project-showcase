const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("../middleware/asyncHandler.middleware");
const Project = require("../models/project.model");
const CourseTimeline = require("../models/courseTimeline.model");
const { findModule } = require("../utils/findModule");
const fs = require("fs");
const { projectValidationSchema } = require("../validations/project.validation");
const { parseBoolean } = require("../utils/parseBool");
exports.submitProject = asyncHandler(async (req, res, next) => {
  const { course, moduleCode } = req.body;
  console.log("Request body:", req.body);

  const timeline = await CourseTimeline.findOne({ course });
  console.log("Found timeline:", timeline);

  if (!timeline) return next(Object.assign(new Error("Course timeline not found"), { statusCode: StatusCodes.NOT_FOUND }));

  const moduleInfo = findModule(timeline, moduleCode);
  console.log("Found moduleInfo:", moduleInfo);

  if (!moduleInfo) return next(Object.assign(new Error("Module not found inside this course timeline"), { statusCode: StatusCodes.BAD_REQUEST }));

  const data = {
    ...req.body,
    module: moduleInfo.module,
    level: String(moduleInfo.level),
    semester: String(moduleInfo.semester),
    academicYear: String(moduleInfo.year),
    featured: parseBoolean(req.body.featured),
    viewCount: req.body.viewCount ? Number(req.body.viewCount) : 0,
    images: req.files ? req.files.map(f => f.path) : [],
  };

  console.log("Data before validation:", data);

  const validatedData = projectValidationSchema.safeParse(data);
  console.log("Validation result:", validatedData);

  if (!validatedData.success) {
    console.log("Validation errors:", validatedData.error.errors);
    if (req.files) req.files.forEach(f => fs.unlink(f.path, () => {}));
    const error = new Error("Validation failed");
    error.statusCode = StatusCodes.BAD_REQUEST;
    error.details = validatedData.error.errors;
    return next(error);
  }

  const newProject = await Project.create(validatedData.data);
  console.log("Project created:", newProject);

  res.status(StatusCodes.CREATED).json({ success: true, message: "Project uploaded successfully", project: newProject });
});


exports.getProjects = asyncHandler(async (req, res) => {
  const { level, semester, year, course, featured, sort } = req.query;

  const filter = {};
  if (level) filter.level = level;
  if (semester) filter.semester = semester;
  if (year) filter.year = year;
  if (course) filter.course = course;
  if (featured) filter.featured = parseBoolean(featured);

  let sortOption = { createdAt: -1 };
  if (sort === "oldest") sortOption = { createdAt: 1 };
  if (sort === "alphabetical") sortOption = { title: 1 };
  if (sort === "reverse-alpha") sortOption = { title: -1 };
  if (sort === "popular") sortOption = { viewCount: -1 };

  const projects = await Project.find(filter).sort(sortOption);

  const courses = [...new Set(projects.map(p => p.course))];
  const timelines = await CourseTimeline.find({ course: { $in: courses } });
  const timelineMap = {};
  timelines.forEach(tl => { timelineMap[tl.course] = tl; });

  const projectsWithModuleInfo = projects.map(proj => {
    let moduleData = {};
    const timeline = timelineMap[proj.course];
    if (timeline && proj.moduleCode) {
      const moduleInfo = findModule(timeline, proj.moduleCode);
      if (moduleInfo) {
        moduleData = {
          moduleName: moduleInfo.module,
          level: moduleInfo.level,
          semester: moduleInfo.semester,
          academicYear: moduleInfo.year,
          credits: moduleInfo.credits,
        };
      }
    }
    return { ...proj.toObject(), ...moduleData };
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Projects retrieved successfully",
    count: projectsWithModuleInfo.length,
    projects: projectsWithModuleInfo,
  });
});

exports.getProjectById = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) return next(Object.assign(new Error("Project not found"), { statusCode: StatusCodes.NOT_FOUND }));

  const timeline = await CourseTimeline.findOne({ course: project.course });
  let moduleInfo = null;
  if (timeline && project.moduleCode) moduleInfo = findModule(timeline, project.moduleCode);

  const projectWithModuleInfo = {
    ...project.toObject(),
    ...(moduleInfo ? {
      moduleName: moduleInfo.module,
      level: moduleInfo.level,
      semester: moduleInfo.semester,
      academicYear: moduleInfo.year,
      credits: moduleInfo.credits
    } : {}),
  };

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Project retrieved successfully",
    project: projectWithModuleInfo,
  });
});

exports.getProjectById = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) return next(Object.assign(new Error("Project not found"), { statusCode: StatusCodes.NOT_FOUND }));

  const timeline = await CourseTimeline.findOne({ course: project.course });
  let moduleInfo = null;
  if (timeline && project.moduleCode) moduleInfo = findModule(timeline, project.moduleCode);

  const projectWithModuleInfo = {
    ...project.toObject(),
    ...(moduleInfo ? { moduleName: moduleInfo.module, level: moduleInfo.level, semester: moduleInfo.semester, year: moduleInfo.year, credits: moduleInfo.credits } : {}),
  };

  res.status(StatusCodes.OK).json({ success: true, message: "Project retrieved successfully", project: projectWithModuleInfo });
});

exports.updateProject = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { course, moduleCode } = req.body;
  const project = await Project.findById(id);
  if (!project) return next(Object.assign(new Error("Project not found"), { statusCode: StatusCodes.NOT_FOUND }));

  const timeline = await CourseTimeline.findOne({ course });
  if (!timeline) return next(Object.assign(new Error("Course timeline not found for the given course"), { statusCode: StatusCodes.NOT_FOUND }));

  const moduleInfo = findModule(timeline, moduleCode);
  if (!moduleInfo) return next(Object.assign(new Error("Module not found inside this course timeline"), { statusCode: StatusCodes.BAD_REQUEST }));

  const data = {
    ...req.body,
    moduleCode,
    featured: parseBoolean(req.body.featured),
    images: req.files ? req.files.map(f => f.path) : project.images,
  };

  const validated = projectValidationSchema.partial().safeParse(data);
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
