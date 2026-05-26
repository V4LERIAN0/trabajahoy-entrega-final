import { z } from "zod";

export const scheduleInterviewDto = z.object({
  scheduledAt: z
    .string({ required_error: "Interview date/time is required" })
    .datetime({ message: "scheduledAt must be a valid ISO 8601 datetime" }),
  location: z
    .string({ invalid_type_error: "Location must be a string" })
    .max(500, "Location cannot exceed 500 characters")
    .optional(),
  notes: z
    .string({ invalid_type_error: "Notes must be a string" })
    .max(2000, "Notes cannot exceed 2000 characters")
    .optional(),
});
