import { z } from "zod";

export const saveJobDto = z.object({
  vacancyId: z
    .string({
      required_error: "Vacancy id is required",
      invalid_type_error: "Vacancy id must be a string",
    })
    .uuid("Vacancy id must be a valid UUID"),
});
