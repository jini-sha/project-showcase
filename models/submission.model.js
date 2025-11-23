const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
    projectReason: { type: String, required: true },
    prototypeLink: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Submission", submissionSchema);
