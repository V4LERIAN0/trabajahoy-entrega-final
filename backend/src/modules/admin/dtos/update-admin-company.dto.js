import { z } from 'zod';

export const updateAdminCompanyDto = z.object({
  ownerId: z.string().uuid('Owner ID must be a valid UUID').optional(),

  name: z
    .string()
    .min(1, 'Company name cannot be empty')
    .max(200, 'Company name cannot exceed 200 characters')
    .optional(),

  description: z.string().max(5000).optional().or(z.literal('')),

  website: z
    .string()
    .url('Invalid website URL')
    .max(500)
    .optional()
    .or(z.literal('')),

  industry: z.string().max(100).optional().or(z.literal('')),
  size: z.string().max(20).optional().or(z.literal('')),

  logoUrl: z
    .string()
    .url('Invalid logo URL')
    .max(500)
    .optional()
    .or(z.literal('')),

  coverUrl: z
    .string()
    .url('Invalid cover URL')
    .max(500)
    .optional()
    .or(z.literal('')),

  email: z
    .string()
    .email('Invalid email format')
    .max(255)
    .optional()
    .or(z.literal('')),

  phone: z.string().max(20).optional().or(z.literal('')),

  isVerified: z.boolean().optional(),
});