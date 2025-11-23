const { z } = require("zod");

const submissionValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  course: z.enum(["Computer Science", "Cybersecurity", "Business Management"], {
    errorMap: () => ({
      message: "Course must be one of Computer Science, Cybersecurity, or Business Management",
    }),
  }),
  level: z.number().int().min(4).max(6),
  semesterNumber: z.number().int().min(1).max(6),
  projectReason: z.string().min(1, "Project reason is required"),
  prototypeLink: z.string().url("Prototype link must be a valid URL"),
});

module.exports = { submissionValidationSchema };
