import { z } from "zod";

export const applyJobDto = z.object({
  vacancyId: z
    .string({
      required_error: "Vacancy id is required",
      invalid_type_error: "Vacancy id must be a string",
    })
    .uuid("Vacancy id must be a valid UUID"),
  coverLetter: z
    .string({ invalid_type_error: "Cover letter must be a string" })
    .max(5000, "Cover letter cannot exceed 5000 characters")
    .optional(),
  cvFileUrl: z
    .string({ invalid_type_error: "CV file URL must be a string" })
    .max(500, "CV file URL cannot exceed 500 characters")
    .optional(),
  resumeUrl: z
    .string({ invalid_type_error: "Resume URL must be a string" })
    .max(500, "Resume URL cannot exceed 500 characters")
    .optional(),
});
