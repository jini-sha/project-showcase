const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  academicYear: { type: Number, required: true },
  level: { type: Number, required: true },
  semesterNumber: { type: Number, required: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  credits: { type: Number, required: true },
  topicCoverage: { type: [String], required: true },
  remarks: { type: [String] },
});

const Module = mongoose.model("Module", ModuleSchema);

const CourseSchema = new mongoose.Schema({
  name: { type: String, enum: ["Cybersecurity", "Computer Science"], required: true },
  code: { type: String, required: true, unique: true },
  modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }],
});

const Course = mongoose.model("Course", CourseSchema);

module.exports = { Course, Module };
