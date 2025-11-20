const { z } = require("zod");
const submissionValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  course: z.enum(["Computer Science", "Cybersecurity", "Business Management"], {
    errorMap: () => ({
      message:
        "Course must be one of Computer Science, Cybersecurity, or Business Management",
    }),
  }),
  level: z.enum(["4", "5", "6"], {
    errorMap: () => ({ message: "Level must be one of 4, 5, or 6" }),
  }),
  semester: z.enum(["1", "2", "3", "4", "5", "6"], {
    errorMap: () => ({ message: "Semester should be from 1 to 6" }),
  }),
  projectReason: z.string().min(1, "Project reason is required"),
  prototypeLink: z.url("Prototype link must be a valid URL"),
});
module.exports = { submissionValidationSchema };
