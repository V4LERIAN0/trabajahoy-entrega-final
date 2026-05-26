import { z } from 'zod';

export const updateProfileDto = z.object({
  bio: z
    .string({ invalid_type_error: 'Bio must be a string' })
    .max(2000, 'Bio cannot exceed 2000 characters')
    .optional(),
  headline: z
    .string({ invalid_type_error: 'Headline must be a string' })
    .max(200, 'Headline cannot exceed 200 characters')
    .optional(),
  website: z
    .string({ invalid_type_error: 'Website must be a string' })
    .url('Invalid website URL')
    .max(500)
    .optional()
    .or(z.literal('')),
  location: z
    .string({ invalid_type_error: 'Location must be a string' })
    .max(200, 'Location cannot exceed 200 characters')
    .optional(),
  availability: z
    .string({ invalid_type_error: 'Availability must be a string' })
    .max(50, 'Availability cannot exceed 50 characters')
    .optional(),
});
