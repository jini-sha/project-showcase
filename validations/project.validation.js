const { z } = require("zod");

const projectValidationSchema = z.object({
    title: z.string().min(1, "Title is required"),
    name: z.string().min(1, "Name is required"),
    module: z.string().min(1, "Module is required"),
    level: z.enum(["4", "5", "6"], {
        errorMap: () => ({ message: "Level must be one of 4, 5, or 6" }),
    }),
    semester: z.enum(["1", "2", "3", "4", "5", "6"], {
        errorMap: () => ({ message: "Semester should be from 1 to 6" }),
    }),
    description: z.string().min(1, "Description is required"),
    year: z.string().min(1, "Year is required"),
    images: z.array(z.string()).max(5).optional(),
    prototypeLink: z.url("Prototype link must be a valid URL"),
});

module.exports = { projectValidationSchema };
