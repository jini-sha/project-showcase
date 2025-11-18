const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("../middleware/asyncHandler.middleware");
const Project = require("../models/project.model");
const { projectValidationSchema } = require("../validations/project.validation");
const fs = require("fs");

exports.submitProject = asyncHandler(async (req, res, next) => {
    const data = {
        ...req.body,
        images: req.files ? req.files.map(f => f.path) : [],
    };

    const validatedData = projectValidationSchema.safeParse(data);

    if (!validatedData.success) {
        if (req.files) {
            req.files.forEach(f => fs.unlink(f.path, () => { }));
        }
        const error = new Error("Validation failed");
        error.statusCode = StatusCodes.BAD_REQUEST;
        error.details = validatedData.error.errors;
        return next(error);
    }

    const newProject = await Project.create(validatedData.data);

    res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Project uploaded successfully",
        project: newProject,
    });
});

exports.getProjects = asyncHandler(async (req, res, next) => {
    const { level, semester, module, year, sort } = req.query;

    const filter = {};
    if (level) filter.level = level;
    if (semester) filter.semester = semester;
    if (module) filter.module = module;
    if (year) filter.year = year;

    const sortOrder = sort === "asc" ? 1 : -1;

    const projects = await Project.find(filter).sort({ createdAt: sortOrder });

    res.status(StatusCodes.OK).json({
        success: true,
        message: "Projects retrieved successfully",
        count: projects.length,
        projects,
    });
});
exports.getProjectById = asyncHandler(async (req, res, next) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        const error = new Error("Project not found");
        error.statusCode = StatusCodes.NOT_FOUND;
        return next(error);
    }

    res.status(StatusCodes.OK).json({
        success: true,
        message: "Project retrieved successfully",
        project,
    });
});

exports.updateProjects = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        const error = new Error("Project not found");
        error.statusCode = StatusCodes.NOT_FOUND;
        return next(error);
    }

    const data = {
        ...req.body,
        images: req.files
            ? req.files.map(f => f.path)
            : project.images,
    };

    const validated = projectValidationSchema.safeParse(data);
    if (!validated.success) {
        if (req.files) req.files.forEach(f => fs.unlink(f.path, () => { }));
        const error = new Error("Validation failed");
        error.statusCode = StatusCodes.BAD_REQUEST;
        error.details = validated.error.errors;
        return next(error);
    }

    Object.assign(project, validated.data);
    await project.save();

    res.status(StatusCodes.OK).json({
        success: true,
        message: "Project updated successfully",
        project,
    });
});

exports.deleteProject = asyncHandler(async (req, res, next) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        const error = new Error("Project not found");
        error.statusCode = StatusCodes.NOT_FOUND;
        return next(error);
    }

    if (project.images && project.images.length) {
        project.images.forEach(f => fs.unlink(f, () => { }));
    }

    await project.deleteOne();

    res.status(StatusCodes.OK).json({
        success: true,
        message: "Project deleted successfully",
    });
});