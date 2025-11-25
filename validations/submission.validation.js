const { z } = require("zod");

const submissionValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  course:z.string().min(1, "Course ID is required"),
  module:z.string().min(1, "Module ID is required"),
  projectReason: z.string().min(1, "Project reason is required"),
  prototypeLink: z.url("Prototype link must be a valid URL"),
});

module.exports = { submissionValidationSchema };
