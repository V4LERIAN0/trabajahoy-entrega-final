import { z } from 'zod';

export const registerCompanyDto = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email format')
    .max(255, 'Email cannot exceed 255 characters'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters'),
  firstName: z
    .string({ required_error: 'First name is required' })
    .min(1, 'First name cannot be empty')
    .max(100, 'First name cannot exceed 100 characters'),
  lastName: z
    .string({ required_error: 'Last name is required' })
    .min(1, 'Last name cannot be empty')
    .max(100, 'Last name cannot exceed 100 characters'),
  phone: z.string().max(20, 'Phone cannot exceed 20 characters').optional(),
  companyName: z
    .string({ required_error: 'Company name is required' })
    .min(1, 'Company name cannot be empty')
    .max(200, 'Company name cannot exceed 200 characters'),
  industry: z.string().max(100).optional(),
  companySize: z.string().max(20).optional(),
  website: z.string().url('Website must be a valid URL').max(500).optional().or(z.literal('')),
  companyDescription: z.string().max(5000).optional(),
});
