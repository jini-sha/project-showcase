const mongoose = require("mongoose")
const projectSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        name: { type: String, required: true },
        module: { type: String, required: true },
        level: { type: String, required: true },
        semester: { type: String, required: true },
        description: { type: String, required: true },
        year: { type: String, required: true },
        images: [{ type: String }],
        prototypeLink: { type: String, required: true },
    },
    { timestamps: true },
);
module.exports = mongoose.model("Project", projectSchema);
