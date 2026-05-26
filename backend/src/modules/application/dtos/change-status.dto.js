import { z } from "zod";

const applicationStatusEnum = [
  "pending",
  "reviewed",
  "interview",
  "accepted",
  "rejected",
];

export const changeStatusDto = z.object({
  toStatus: z.enum(applicationStatusEnum, {
    required_error: "Target status is required",
    invalid_type_error: "Invalid target status",
  }),
  notes: z
    .string({ invalid_type_error: "Notes must be a string" })
    .max(2000, "Notes cannot exceed 2000 characters")
    .optional(),
});
