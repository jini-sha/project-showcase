const mongoose = require("mongoose")
const submissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    course: { type: String, required: true },
    level: { type: String, required: true },
    semester: { type: String, required: true },
    projectReason: { type: String, required: true },
    prototypeLink: { type: String, required: true },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Submission", submissionSchema);
