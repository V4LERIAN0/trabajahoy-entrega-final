import { z } from 'zod';

const ratingField = (fieldName) =>
  z
    .number({
      invalid_type_error: `${fieldName} must be a number`,
      required_error: `${fieldName} is required`,
    })
    .int(`${fieldName} must be an integer`)
    .min(1, `${fieldName} must be at least 1`)
    .max(5, `${fieldName} cannot be greater than 5`);

export const createReviewDto = z.object({
  companyId: z
    .string({
      required_error: 'Company ID is required',
      invalid_type_error: 'Company ID must be a string',
    })
    .uuid('Company ID must be a valid UUID'),

  overallRating: ratingField('Overall rating'),

  workLifeBalance: z
    .number({
      invalid_type_error: 'Work life balance must be a number',
    })
    .int('Work life balance must be an integer')
    .min(1, 'Work life balance must be at least 1')
    .max(5, 'Work life balance cannot be greater than 5')
    .optional(),

  compensation: z
    .number({
      invalid_type_error: 'Compensation must be a number',
    })
    .int('Compensation must be an integer')
    .min(1, 'Compensation must be at least 1')
    .max(5, 'Compensation cannot be greater than 5')
    .optional(),

  culture: z
    .number({
      invalid_type_error: 'Culture must be a number',
    })
    .int('Culture must be an integer')
    .min(1, 'Culture must be at least 1')
    .max(5, 'Culture cannot be greater than 5')
    .optional(),

  managementRating: z
    .number({
      invalid_type_error: 'Management rating must be a number',
    })
    .int('Management rating must be an integer')
    .min(1, 'Management rating must be at least 1')
    .max(5, 'Management rating cannot be greater than 5')
    .optional(),

  careerOpportunities: z
    .number({
      invalid_type_error: 'Career opportunities must be a number',
    })
    .int('Career opportunities must be an integer')
    .min(1, 'Career opportunities must be at least 1')
    .max(5, 'Career opportunities cannot be greater than 5')
    .optional(),

  title: z
    .string({
      invalid_type_error: 'Title must be a string',
    })
    .max(255, 'Title cannot exceed 255 characters')
    .optional(),

  pros: z
    .string({
      invalid_type_error: 'Pros must be a string',
    })
    .optional(),

  cons: z
    .string({
      invalid_type_error: 'Cons must be a string',
    })
    .optional(),

  reviewDate: z
    .string({
      required_error: 'Review date is required',
      invalid_type_error: 'Review date must be a string',
    })
    .date('Review date must be a valid date in YYYY-MM-DD format'),

  isAnonymous: z
    .boolean({
      invalid_type_error: 'isAnonymous must be a boolean',
    })
    .optional(),
});