import { z } from 'zod';

const baseCategoryDto = z.object({
  name: z
    .string({
      invalid_type_error: 'Name must be a string',
    })
    .min(1, 'Name cannot be empty')
    .max(100, 'Name cannot exceed 100 characters')
    .optional(),
  description: z
    .string({
      invalid_type_error: 'Description must be a string',
    })
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),
  icon: z
    .string({
      invalid_type_error: 'Icon must be a string',
    })
    .max(50, 'Icon cannot exceed 50 characters')
    .optional(),
  sortOrder: z
    .number({
      invalid_type_error: 'Sort order must be a number',
    })
    .int('Sort order must be an integer')
    .min(0, 'Sort order cannot be negative')
    .optional(),
});

export const createCategoryDto = baseCategoryDto.extend({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .min(1, 'Name cannot be empty')
    .max(100, 'Name cannot exceed 100 characters'),
});

export const updateCategoryDto = baseCategoryDto;