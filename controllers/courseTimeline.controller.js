const { Course, Module } = require("../models/courseTimeline.model");
const asyncHandler = require("../middleware/asyncHandler.middleware");
const Project = require("../models/project.model.js");
const { StatusCodes } = require("http-status-codes");

exports.createCourse = asyncHandler(async (req, res) => {
  const { name, code } = req.body;
  const existingCourse = await Course.findOne({ code });
  if (existingCourse) {
    const error = new Error("A course with this code already exists");
    error.statusCode = StatusCodes.CONFLICT;
    return next(error);
  }
  const course = await Course.create({ name, code, modules: [] });
  res.status(StatusCodes.CREATED).json({ success: true, message: "Course created successfully", data: course });
});
exports.getCourses = asyncHandler(async (req, res) => {
  const { name, code, moduleTitle } = req.query;

  let courseQuery = {};
  if (name) courseQuery.name = name;
  if (code) courseQuery.code = code;

  const courses = await Course.find(courseQuery).populate({
    path: "modules",
    match: moduleTitle ? { title: { $regex: moduleTitle, $options: "i" } } : {},
  });

  const coursesWithCount = await Promise.all(
    courses.map(async (course) => {
      const modulesWithCount = await Promise.all(
        course.modules.map(async (mod) => {
          const projectCount = await Project.countDocuments({ moduleId: mod._id });
          return { ...mod.toObject(), projectCount };
        })
      );
      return { ...course.toObject(), modules: modulesWithCount };
    })
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Courses fetched successfully",
    data: coursesWithCount,
  });
});


exports.updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const course = await Course.findByIdAndUpdate(id, updates, { new: true });
  if (!course) return res.status(StatusCodes.NOT_FOUND).json({ message: "Course not found" });
  res.status(StatusCodes.OK).json({ success: true, message: "Course updated successfully", data: course });
});

exports.deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const course = await Course.findByIdAndDelete(id);
  if (!course) return res.status(StatusCodes.NOT_FOUND).json({ message: "Course not found" });
  await Module.deleteMany({ course: course._id });
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Course and its modules deleted successfully"
  });
});

exports.createModule = asyncHandler(async (req, res) => {
  const { course: courseId, academicYear, level, semesterNumber, code, name, credits, topicCoverage, remarks } = req.body;
  const course = await Course.findById(courseId);
  if (!course) return res.status(StatusCodes.NOT_FOUND).json({ message: "Course not found" });
  const module = await Module.create({ course: course._id, academicYear, level, semesterNumber, code, name, credits, topicCoverage, remarks });
  course.modules.push(module._id);
  await course.save();
  res.status(StatusCodes.CREATED).json({ success: true, message: "Module created successfully", data: module });
});

exports.updateModule = asyncHandler(async (req, res) => {
  const { moduleId } = req.params;
  const updates = req.body;
  const module = await Module.findByIdAndUpdate(moduleId, updates, { new: true });
  if (!module) return res.status(StatusCodes.NOT_FOUND).json({ message: "Module not found" });
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Module updated successfully",
    data: module
  });
});

exports.deleteModule = asyncHandler(async (req, res) => {
  const { moduleId } = req.params;
  const module = await Module.findByIdAndDelete(moduleId);
  if (!module) return res.status(StatusCodes.NOT_FOUND).json({
    success: true,
    message: "Module not found"
  });
  await Course.findByIdAndUpdate(module.course, { $pull: { modules: module._id } });
  res.status(StatusCodes.OK).json({ success: true, message: "Module deleted successfully" });
});
