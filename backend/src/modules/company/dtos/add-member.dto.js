import { z } from 'zod';

export const addMemberDto = z.object({
  userId: z
    .string({
      required_error: 'User ID is required',
      invalid_type_error: 'User ID must be a string',
    })
    .uuid('Invalid user ID format'),
  role: z
    .enum(['company_admin', 'recruiter'], {
      required_error: 'Role is required',
      invalid_type_error: 'Role must be one of: company_admin, recruiter',
    })
    .default('recruiter'),
});
