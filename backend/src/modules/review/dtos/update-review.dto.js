import { z } from 'zod';

const optionalRatingField = (fieldName) =>
  z
    .number({
      invalid_type_error: `${fieldName} must be a number`,
    })
    .int(`${fieldName} must be an integer`)
    .min(1, `${fieldName} must be at least 1`)
    .max(5, `${fieldName} cannot be greater than 5`)
    .optional();

export const updateReviewDto = z.object({
  overallRating: optionalRatingField('Overall rating'),
  workLifeBalance: optionalRatingField('Work life balance'),
  compensation: optionalRatingField('Compensation'),
  culture: optionalRatingField('Culture'),
  managementRating: optionalRatingField('Management rating'),
  careerOpportunities: optionalRatingField('Career opportunities'),

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
      invalid_type_error: 'Review date must be a string',
    })
    .date('Review date must be a valid date in YYYY-MM-DD format')
    .optional(),

  isAnonymous: z
    .boolean({
      invalid_type_error: 'isAnonymous must be a boolean',
    })
    .optional(),
});