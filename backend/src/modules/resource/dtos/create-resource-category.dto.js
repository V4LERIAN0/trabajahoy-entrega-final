import { z } from 'zod';

const baseResourceCategoryDto = z.object({
  name: z
    .string({ invalid_type_error: 'Name must be a string' })
    .min(1, 'Name cannot be empty')
    .max(100, 'Name cannot exceed 100 characters')
    .optional(),
  description: z
    .string({ invalid_type_error: 'Description must be a string' })
    .max(1000, 'Description cannot exceed 1000 characters')
    .nullable()
    .optional(),
  parentId: z
    .string({ invalid_type_error: 'Parent ID must be a string' })
    .uuid('Parent ID must be a valid UUID')
    .nullable()
    .optional(),
});

export const createResourceCategoryDto = baseResourceCategoryDto.extend({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .min(1, 'Name cannot be empty')
    .max(100, 'Name cannot exceed 100 characters'),
});

export const updateResourceCategoryDto = baseResourceCategoryDto;
