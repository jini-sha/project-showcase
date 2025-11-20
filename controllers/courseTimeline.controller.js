const CourseTimeline = require("../models/courseTimeline.model");
const asyncHandler = require("../middleware/asyncHandler.middleware");
const {
    courseTimelineSchema,
} = require("../validations/courseTimeline.validation");
const Project = require("../models/project.model.js");
const { StatusCodes } = require("http-status-codes");

exports.createTimeline = asyncHandler(async (req, res) => {
    const data = req.body;
    courseTimelineSchema.parse(data);
    const timeline = new CourseTimeline(data);
    await timeline.save();
    res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Timeline created successfully",
        data: timeline,
    });
});

exports.getTimelines = asyncHandler(async (req, res) => {
    const { course } = req.query;
    const filter = {};
    if (course) filter.course = course;

    const timelines = await CourseTimeline.find(filter).lean();

    for (const timeline of timelines) {
        for (const year of timeline.years) {
            year.projectCount = await Project.countDocuments({
                course: timeline.course,
                level: year.level.toString().trim(),
            });

            for (const semester of year.semesters) {
                semester.projectCount = await Project.countDocuments({
                    course: timeline.course,
                    level: year.level.toString().trim(),
                    semester: semester.semesterNumber.toString().trim(),
                });

                for (const module of semester.modules) {
                    module.projectCount = await Project.countDocuments({
                        course: timeline.course,
                        level: year.level.toString().trim(),
                        semester: semester.semesterNumber.toString().trim(),
                        module: module.code.trim(),
                    });
                }
            }
        }
    }

    res.status(StatusCodes.OK).json({
        success: true,
        message: "Timelines fetched successfully.",
        data: timelines,
    });
});

exports.deleteTimeline = asyncHandler(async (req, res) => {
    const timeline = await CourseTimeline.findByIdAndDelete(req.params.id);
    if (!timeline) {
        const error = new Error("Timeline not found.");
        error.statusCode = StatusCodes.NOT_FOUND;
        next(error);
    }
    res.json({ message: "Timeline deleted" });
    res.status(StatusCodes.OK).json({ error: err.message });
});

exports.deleteModule = asyncHandler(async (req, res) => {
    const { id, moduleCode } = req.params;

    const timeline = await CourseTimeline.findById(id);
    if (!timeline) {
        const error = new Error("Timeline not found.");
        error.statusCode = StatusCodes.NOT_FOUND;
        next(error);
    }
    let found = false;
    timeline.years.forEach((year) => {
        year.semesters.forEach((semester) => {
            const index = semester.modules.findIndex((m) => m.code === moduleCode);
            if (index !== -1) {
                semester.modules.splice(index, 1);
                found = true;
            }
        });
    });

    if (!module) {
        const error = new Error("Module not found.");
        error.statusCode = StatusCodes.NOT_FOUND;
        next(error);
    }
    await timeline.save();
    res
        .status(StatusCodes.OK)
        .json({
            success: true,
            message: `Module ${moduleCode} deleted successfully`,
        });
});

exports.updateTimeline = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { semesterNumber, moduleCode, ...fieldsToUpdate } = req.body;

    const timeline = await CourseTimeline.findById(id);
    if (!timeline) {
        const error = new Error("Timeline not found.");
        error.statusCode = StatusCodes.NOT_FOUND;
        next(error);
    }

    const semester = timeline.years
        .flatMap((y) => y.semesters)
        .find((s) => s.semesterNumber === Number(semesterNumber));
    if (!semester) {
        const error = new Error("Semester not found.");
        error.statusCode = StatusCodes.NOT_FOUND;
        next(error);
    }

    const module = semester.modules.find((m) => m.code === moduleCode);
    if (!module) {
        const error = new Error("Module not found.");
        error.statusCode = StatusCodes.NOT_FOUND;
        next(error);
    }

    Object.keys(fieldsToUpdate).forEach((key) => {
        module[key] = fieldsToUpdate[key];
    });

    await timeline.save();

    res.status(StatusCodes.OK).json({
        success: true,
        message: "Module updated successfully",
        data: module,
    });
});
