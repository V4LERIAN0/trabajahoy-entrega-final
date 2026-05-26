import { z } from "zod";

export const addCommentDto = z.object({
  content: z
    .string({
      required_error: "Comment content is required",
      invalid_type_error: "Comment content must be a string",
    })
    .min(1, "Comment content cannot be empty")
    .max(3000, "Comment content cannot exceed 3000 characters"),
});

export const updateCommentDto = z.object({
  content: z
    .string({
      required_error: "Comment content is required",
      invalid_type_error: "Comment content must be a string",
    })
    .min(1, "Comment content cannot be empty")
    .max(3000, "Comment content cannot exceed 3000 characters"),
});
