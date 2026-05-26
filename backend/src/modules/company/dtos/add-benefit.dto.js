import { z } from 'zod';

export const addBenefitDto = z.object({
  name: z
    .string({
      required_error: 'Benefit name is required',
      invalid_type_error: 'Benefit name must be a string',
    })
    .min(1, 'Benefit name cannot be empty')
    .max(100, 'Benefit name cannot exceed 100 characters'),
  description: z
    .string({ invalid_type_error: 'Description must be a string' })
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),
  icon: z
    .string({ invalid_type_error: 'Icon must be a string' })
    .max(50, 'Icon cannot exceed 50 characters')
    .optional(),
});
