import { z } from "zod";

export const updateApplicationDto = z.object({
  coverLetter: z
    .string({ invalid_type_error: "Cover letter must be a string" })
    .max(5000, "Cover letter cannot exceed 5000 characters")
    .nullable()
    .optional(),
  cvFileUrl: z
    .string({ invalid_type_error: "CV file URL must be a string" })
    .max(500, "CV file URL cannot exceed 500 characters")
    .nullable()
    .optional(),
  resumeUrl: z
    .string({ invalid_type_error: "Resume URL must be a string" })
    .max(500, "Resume URL cannot exceed 500 characters")
    .nullable()
    .optional(),
});
