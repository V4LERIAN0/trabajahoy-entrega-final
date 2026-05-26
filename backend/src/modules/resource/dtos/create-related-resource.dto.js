import { z } from 'zod';

export const createRelatedResourceDto = z.object({
  relatedResourceId: z
    .string({
      required_error: 'Related resource ID is required',
      invalid_type_error: 'Related resource ID must be a string',
    })
    .uuid('Related resource ID must be a valid UUID'),
});
