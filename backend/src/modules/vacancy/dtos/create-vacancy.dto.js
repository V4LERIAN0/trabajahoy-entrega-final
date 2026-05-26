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

export const createVacancyDto = z
  .object({
    companyId: z
      .string({
        required_error: "Company id is required",
        invalid_type_error: "Company id must be a string",
      })
      .uuid("Company id must be a valid UUID"),
    categoryId: z
      .string({ invalid_type_error: "Category id must be a string" })
      .uuid("Category id must be a valid UUID")
      .optional(),
    title: z
      .string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string",
      })
      .min(1, "Title cannot be empty")
      .max(200, "Title cannot exceed 200 characters"),
    description: z
      .string({
        required_error: "Description is required",
        invalid_type_error: "Description must be a string",
      })
      .min(1, "Description cannot be empty"),
    requirements: z
      .string({
        required_error: "Requirements are required",
        invalid_type_error: "Requirements must be a string",
      })
      .min(1, "Requirements cannot be empty"),
    benefitsText: z
      .string({ invalid_type_error: "Benefits text must be a string" })
      .optional(),
    salaryMin: z
      .number({ invalid_type_error: "Salary min must be a number" })
      .nonnegative()
      .optional(),
    salaryMax: z
      .number({ invalid_type_error: "Salary max must be a number" })
      .nonnegative()
      .optional(),
    currency: z
      .string({ invalid_type_error: "Currency must be a string" })
      .max(10, "Currency cannot exceed 10 characters")
      .optional(),
    type: z
      .enum(vacancyTypeEnum, {
        invalid_type_error: "Invalid vacancy type",
      })
      .optional(),
    modality: z
      .enum(vacancyModalityEnum, {
        invalid_type_error: "Invalid vacancy modality",
      })
      .optional(),
    level: z
      .enum(vacancyLevelEnum, {
        invalid_type_error: "Invalid vacancy level",
      })
      .optional(),
    status: z
      .enum(vacancyStatusEnum, {
        invalid_type_error: "Invalid vacancy status",
      })
      .optional(),
    country: z
      .string({
        required_error: "Country is required",
        invalid_type_error: "Country must be a string",
      })
      .min(1, "Country cannot be empty")
      .max(100, "Country cannot exceed 100 characters"),
    city: z
      .string({
        required_error: "City is required",
        invalid_type_error: "City must be a string",
      })
      .min(1, "City cannot be empty")
      .max(100, "City cannot exceed 100 characters"),
    locationText: z
      .string({ invalid_type_error: "Location text must be a string" })
      .max(200, "Location text cannot exceed 200 characters")
      .optional(),
    applicationDeadline: z
      .string({ invalid_type_error: "Application deadline must be a string" })
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Application deadline must be YYYY-MM-DD")
      .optional(),
    openings: z
      .number({ invalid_type_error: "Openings must be a number" })
      .int("Openings must be an integer")
      .min(1, "Openings must be at least 1")
      .optional(),
  })
  .refine(
    (data) =>
      data.salaryMin === undefined ||
      data.salaryMax === undefined ||
      data.salaryMax >= data.salaryMin,
    {
      message: "Salary max must be greater than or equal to salary min",
      path: ["salaryMax"],
    },
  );

export const createVacancySkillDto = z.object({
  skillName: z
    .string({
      required_error: "Skill name is required",
      invalid_type_error: "Skill name must be a string",
    })
    .min(1, "Skill name cannot be empty")
    .max(100, "Skill name cannot exceed 100 characters"),
  isRequired: z
    .boolean({ invalid_type_error: "isRequired must be a boolean" })
    .optional(),
});

export const createVacancyBenefitDto = z.object({
  benefitName: z
    .string({
      required_error: "Benefit name is required",
      invalid_type_error: "Benefit name must be a string",
    })
    .min(1, "Benefit name cannot be empty")
    .max(100, "Benefit name cannot exceed 100 characters"),
});

export const createJobCategoryDto = z.object({
  name: z
    .string({
      required_error: "Category name is required",
      invalid_type_error: "Category name must be a string",
    })
    .min(1, "Category name cannot be empty")
    .max(100, "Category name cannot exceed 100 characters"),
  slug: z
    .string({
      required_error: "Slug is required",
      invalid_type_error: "Slug must be a string",
    })
    .min(1, "Slug cannot be empty")
    .max(100, "Slug cannot exceed 100 characters"),
  description: z
    .string({ invalid_type_error: "Description must be a string" })
    .optional(),
  parentId: z
    .string({ invalid_type_error: "Parent id must be a string" })
    .uuid("Parent id must be a valid UUID")
    .optional(),
});
