const { z } = require("zod");

const projectValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  academicYear: z.string().min(1, "Year is required"),
  name: z.string().min(1, "Name is required"),
  studentId: z.string().min(7, "Student Id needs to be of minimum 7 digits"),
  caseStudyBy: z.string().optional(),
  course: z.enum(["Computer Science", "Cybersecurity", "Business Management"], {
    errorMap: () => ({
      message:
        "Course must be one of Computer Science, Cybersecurity, or Business Management",
    }),
  }),
  module: z.string().min(1, "Module is required"),
  level: z.enum(["4", "5", "6"], {
    errorMap: () => ({ message: "Level must be one of 4, 5, or 6" }),
  }),
  featured: z.boolean(),
  semester: z.enum(["1", "2", "3", "4", "5", "6"], {
    errorMap: () => ({ message: "Semester should be from 1 to 6" }),
  }),
  description: z.string().min(1, "Description is required"),
  year: z.string().min(1, "Year is required"),
  images: z.array(z.string()).max(5).optional(),
  prototypeLink: z.url("Prototype link must be a valid URL"),
  viewCount: z.number().optional(),
});

module.exports = { projectValidationSchema };
