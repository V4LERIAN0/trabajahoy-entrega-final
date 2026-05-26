import { z } from "zod";

export const followCompanyDto = z.object({
  companyId: z
    .string({
      required_error: "Company id is required",
      invalid_type_error: "Company id must be a string",
    })
    .uuid("Company id must be a valid UUID"),
});
