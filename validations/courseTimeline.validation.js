const { z } = require("zod");

const courseSchema = z.object({
  name: z.enum(["Cybersecurity", "Computer Science"], {
    errorMap: () => ({ message: "Course must be Cybersecurity or Computer Science" }),
  }),
  code: z.string().nonempty("Course code is required"),
});

const moduleSchema = z.object({
  course: z.string().nonempty("Course ID is required"),
  academicYear: z.number().int().min(1, "Academic year must be at least 1"),
  level: z.number().nonnegative(),
  semesterNumber: z.number().int().min(1, "Semester number must be at least 1"),
  code: z.string().nonempty("Module code is required"),
  name: z.string().nonempty("Module name is required"),
  credits: z.number().min(0, "Credits must be at least 0"),
  topicCoverage: z.array(z.string().nonempty("Topic coverage item is required")),
  remarks: z.array(z.string()).optional(),
});

module.exports = { courseSchema, moduleSchema };
