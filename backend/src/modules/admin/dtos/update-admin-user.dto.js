import { z } from 'zod';

export const updateAdminUserDto = z.object({
  email: z.string().email('Invalid email format').max(255).optional(),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters')
    .optional()
    .or(z.literal('')),

  firstName: z.string().max(100).optional().or(z.literal('')),
  lastName: z.string().max(100).optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),

  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),

  roles: z.array(z.string().min(1)).optional(),
});