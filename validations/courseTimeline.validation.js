const { z } = require("zod");

const courseTimelineSchema = z.object({
  course: z.enum(["Cybersecurity", "Computer Science"], {
    errorMap: () => ({
      message: "Course must be Cybersecurity or Computer Science",
    }),
  }),
  years: z
    .array(
      z.object({
        academicYear: z
          .number()
          .int()
          .min(1, "Academic year must be at least 1"),
        level: z.number().nonnegative(),
        semesterCount: z.number().int().nonnegative(),
        semesters: z
          .array(
            z.object({
              semesterNumber: z.enum(["1", "2", "Year long"], {
                errorMap: () => ({ message: "Invalid semester number." }),
              }),
              modules: z
                .array(
                  z.object({
                    code: z.string().nonempty("Module code is required"),
                    name: z.string().nonempty("Module name is required"),
                    credits: z.number().min(0, "Credits must be at least 0"),
                    topicCoverage: z.array(
                      z.string().nonempty("Topic coverage item is required"),
                    ),
                    remarks: z.array(z.string()).optional(),
                  }),
                )
                .refine(
                  (modules) => {
                    const codes = modules.map((m) => m.code);
                    return new Set(codes).size === codes.length;
                  },
                  { message: "Module codes must be unique in a semester" },
                ),
            }),
          )
          .min(1, "Each year must have at least 1 semester"),
      }),
    )
    .min(1, "At least 1 year is required"),
});

module.exports = { courseTimelineSchema };
