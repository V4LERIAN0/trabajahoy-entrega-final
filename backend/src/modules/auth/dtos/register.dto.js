import { z } from 'zod';

export const registerDto = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email('Invalid email format')
    .max(255, 'Email cannot exceed 255 characters'),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters'),
  firstName: z
    .string({
      required_error: 'First name is required',
      invalid_type_error: 'First name must be a string',
    })
    .min(1, 'First name cannot be empty')
    .max(100, 'First name cannot exceed 100 characters'),
  lastName: z
    .string({
      required_error: 'Last name is required',
      invalid_type_error: 'Last name must be a string',
    })
    .min(1, 'Last name cannot be empty')
    .max(100, 'Last name cannot exceed 100 characters'),
  phone: z
    .string({ invalid_type_error: 'Phone must be a string' })
    .max(20, 'Phone cannot exceed 20 characters')
    .optional(),
});
