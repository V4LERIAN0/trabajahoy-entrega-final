import { z } from 'zod';

const baseExperienceDto = z.object({
  companyName: z
    .string({ invalid_type_error: 'Company must be a string' })
    .max(200, 'Company name cannot exceed 200 characters')
    .optional(),
  role: z
    .string({ invalid_type_error: 'Position must be a string' })
    .max(200, 'Position cannot exceed 200 characters')
    .optional(),
  startDate: z
    .string({ invalid_type_error: 'Start date must be a string' })
    .date('Invalid date format')
    .optional(),
  endDate: z
    .string({ invalid_type_error: 'End date must be a string' })
    .date('Invalid date format')
    .optional(),
  description: z
    .string({ invalid_type_error: 'Description must be a string' })
    .max(2000, 'Description cannot exceed 2000 characters')
    .optional(),
  isCurrent: z
    .boolean({ invalid_type_error: 'isCurrent must be a boolean' })
    .optional(),
  location: z
    .string({ invalid_type_error: 'Location must be a string' })
    .max(200, 'Location cannot exceed 200 characters')
    .optional(),
});

export const addExperienceDto = baseExperienceDto.extend({
  companyName: z
    .string({ required_error: 'Company name is required', invalid_type_error: 'Company must be a string' })
    .max(200, 'Company name cannot exceed 200 characters'),
  role: z
    .string({ required_error: 'Position is required', invalid_type_error: 'Position must be a string' })
    .max(200, 'Position cannot exceed 200 characters'),
  startDate: z
    .string({ required_error: 'Start date is required', invalid_type_error: 'Start date must be a string' })
    .date('Invalid date format'),
  isCurrent: z.boolean().optional().default(false),
});

export const updateExperienceDto = baseExperienceDto;
