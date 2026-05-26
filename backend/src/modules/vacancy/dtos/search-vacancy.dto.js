import { z } from "zod";

const vacancyTypeEnum = [
  "full-time",
  "part-time",
  "contract",
  "freelance",
  "internship",
];
const vacancyModalityEnum = ["remote", "hybrid", "onsite"];
const vacancyLevelEnum = [
  "junior",
  "mid",
  "senior",
  "lead",
  "manager",
  "director",
];
const vacancyStatusEnum = ["draft", "published", "closed", "archived"];

export const searchVacancyDto = z.object({
  page: z.coerce
    .number({ invalid_type_error: "Page must be a number" })
    .int("Page must be an integer")
    .min(1, "Page must be at least 1")
    .optional(),
  limit: z.coerce
    .number({ invalid_type_error: "Limit must be a number" })
    .int("Limit must be an integer")
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .optional(),
  q: z
    .string({ invalid_type_error: "q must be a string" })
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  companyId: z
    .string({ invalid_type_error: "companyId must be a string" })
    .uuid("companyId must be a valid UUID")
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  categoryId: z
    .string({ invalid_type_error: "categoryId must be a string" })
    .uuid("categoryId must be a valid UUID")
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  status: z
    .enum(vacancyStatusEnum, { invalid_type_error: "Invalid status" })
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  type: z
    .enum(vacancyTypeEnum, { invalid_type_error: "Invalid type" })
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  modality: z
    .enum(vacancyModalityEnum, { invalid_type_error: "Invalid modality" })
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  level: z
    .enum(vacancyLevelEnum, { invalid_type_error: "Invalid level" })
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  country: z
    .string({ invalid_type_error: "country must be a string" })
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  city: z
    .string({ invalid_type_error: "city must be a string" })
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
});
