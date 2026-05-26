import { z } from 'zod';

export const removeRoleDto = z.object({
  roleName: z
    .string({
      required_error: 'Role name is required',
      invalid_type_error: 'Role name must be a string',
    })
    .min(1, 'Role name cannot be empty')
    .max(50, 'Role name cannot exceed 50 characters'),
});
