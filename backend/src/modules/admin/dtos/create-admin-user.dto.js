import { z } from 'zod';

export const createAdminUserDto = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email format')
    .max(255, 'Email cannot exceed 255 characters'),

  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters'),

  firstName: z.string().max(100).optional().or(z.literal('')),
  lastName: z.string().max(100).optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),

  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),

  roles: z.array(z.string().min(1)).optional(),
});