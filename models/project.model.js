const mongoose = require('mongoose')
const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    name: { type: String, required: true },
    year: { type: String, required: true },
    studentId: { type: String, required: true },
    caseStudyBy: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
    featured: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
    description: { type: String, required: true },
    images: [{ type: String }],
    prototypeLink: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
