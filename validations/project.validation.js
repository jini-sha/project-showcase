const { z } = require("zod");

const projectValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  name: z.string().min(1, "Name is required"),
  year: z.string().min(1, "Year is required"),
  studentId: z.string().min(7, "Student Id needs to be minimum 7 digits"),
  caseStudyBy: z.string().optional(),
  courseId: z.string().min(1, "Course ID is required"),
  moduleId: z.string().min(1, "Module ID is required"),
  featured: z.boolean().optional(),
  viewCount: z.number().optional(),
  description: z.string().min(1, "Description is required"),
  images: z.array(z.string()).max(5).optional(),
  prototypeLink: z.string().url("Prototype link must be a valid URL"),
  level: z.number().int().min(4).max(6),
  semesterNumber: z.number().int().min(1).max(6),
  academicYear: z.number().int().min(1, "Academic year is required"),
});

module.exports = { projectValidationSchema };
