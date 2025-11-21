const mongoose = require("mongoose");

const CourseTimelineSchema = new mongoose.Schema({
  course: {
    type: String,
    enum: ["Cybersecurity", "Computer Science"],
    required: true,
  },
  years: [
    {
      academicYear: { type: Number, required: true },
      level: { type: Number, required: true },
      semesterCount: { type: Number, default: 0 },
      semesters: [
        {
          semesterNumber: { type: Number, required: true },
          modules: [
            {
              _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
              code: { type: String, required: true },
              name: { type: String, required: true },
              credits: { type: Number, required: true },
              topicCoverage: { type: [String], required: true },
              remarks: { type: [String] },
            },
          ],
        },
      ],
    },
  ],
});

module.exports = mongoose.model("CourseTimeline", CourseTimelineSchema);
