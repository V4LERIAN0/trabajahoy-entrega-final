import { z } from 'zod';

export const reportReviewDto = z.object({
  reason: z
    .string({
      required_error: 'Reason is required',
      invalid_type_error: 'Reason must be a string',
    })
    .min(1, 'Reason cannot be empty')
    .max(100, 'Reason cannot exceed 100 characters'),

  description: z
    .string({
      invalid_type_error: 'Description must be a string',
    })
    .optional(),
});