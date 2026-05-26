import { z } from 'zod';

export const updateCompanyDto = z.object({
  name: z
    .string({ invalid_type_error: 'Company name must be a string' })
    .min(1, 'Company name cannot be empty')
    .max(200, 'Company name cannot exceed 200 characters')
    .optional(),
  description: z
    .string({ invalid_type_error: 'Description must be a string' })
    .max(5000, 'Description cannot exceed 5000 characters')
    .optional(),
  website: z
    .string({ invalid_type_error: 'Website must be a string' })
    .url('Invalid website URL')
    .max(500)
    .optional()
    .or(z.literal('')),
  industry: z
    .string({ invalid_type_error: 'Industry must be a string' })
    .max(100, 'Industry cannot exceed 100 characters')
    .optional(),
  size: z
    .string({ invalid_type_error: 'Size must be a string' })
    .max(20, 'Size cannot exceed 20 characters')
    .optional(),
  logoUrl: z
    .string({ invalid_type_error: 'Logo URL must be a string' })
    .url('Invalid logo URL')
    .max(500)
    .optional()
    .or(z.literal('')),
  coverUrl: z
    .string({ invalid_type_error: 'Cover URL must be a string' })
    .url('Invalid cover URL')
    .max(500)
    .optional()
    .or(z.literal('')),
  email: z
    .string({ invalid_type_error: 'Email must be a string' })
    .email('Invalid email format')
    .max(255)
    .optional(),
  phone: z
    .string({ invalid_type_error: 'Phone must be a string' })
    .max(20, 'Phone cannot exceed 20 characters')
    .optional(),
});
