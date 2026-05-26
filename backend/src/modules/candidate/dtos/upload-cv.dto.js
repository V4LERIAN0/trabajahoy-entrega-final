import { z } from 'zod';

export const uploadCvDto = z.object({
  fileName: z
    .string({
      required_error: 'File name is required',
      invalid_type_error: 'File name must be a string',
    })
    .min(1, 'File name cannot be empty')
    .max(200, 'File name cannot exceed 200 characters'),
});
