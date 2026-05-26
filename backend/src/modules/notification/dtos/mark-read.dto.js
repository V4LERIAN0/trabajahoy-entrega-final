import { z } from 'zod';

export const markReadDto = z.object({
  isRead: z.boolean({
    required_error: 'isRead is required',
    invalid_type_error: 'isRead must be a boolean',
  }),
});