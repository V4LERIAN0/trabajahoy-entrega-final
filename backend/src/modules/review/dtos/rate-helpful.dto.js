import { z } from 'zod';

export const rateHelpfulDto = z.object({
  isHelpful: z.boolean({
    required_error: 'isHelpful is required',
    invalid_type_error: 'isHelpful must be a boolean',
  }),
});