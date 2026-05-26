import { z } from 'zod';

export const addLocationDto = z.object({
  country: z
    .string({
      required_error: 'Country is required',
      invalid_type_error: 'Country must be a string',
    })
    .min(1, 'Country cannot be empty')
    .max(100, 'Country cannot exceed 100 characters'),
  city: z
    .string({
      required_error: 'City is required',
      invalid_type_error: 'City must be a string',
    })
    .min(1, 'City cannot be empty')
    .max(100, 'City cannot exceed 100 characters'),
  address: z
    .string({ invalid_type_error: 'Address must be a string' })
    .max(300, 'Address cannot exceed 300 characters')
    .optional(),
  isHeadquarters: z
    .boolean({ invalid_type_error: 'isHeadquarters must be a boolean' })
    .optional()
    .default(false),
});
