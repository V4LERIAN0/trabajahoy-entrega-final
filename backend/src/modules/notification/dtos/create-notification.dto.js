import { z } from 'zod';

export const createNotificationDto = z.object({
  userId: z
    .string({
      required_error: 'User ID is required',
      invalid_type_error: 'User ID must be a string',
    })
    .uuid('User ID must be a valid UUID'),

  type: z
    .string({
      required_error: 'Type is required',
      invalid_type_error: 'Type must be a string',
    })
    .min(1, 'Type cannot be empty')
    .max(100, 'Type cannot exceed 100 characters'),

  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title must be a string',
    })
    .min(1, 'Title cannot be empty')
    .max(255, 'Title cannot exceed 255 characters'),

  message: z
    .string({
      required_error: 'Message is required',
      invalid_type_error: 'Message must be a string',
    })
    .min(1, 'Message cannot be empty'),

  link: z
    .string({
      invalid_type_error: 'Link must be a string',
    })
    .max(500, 'Link cannot exceed 500 characters')
    .optional(),

  metadata: z
    .object({})
    .passthrough()
    .optional(),
});