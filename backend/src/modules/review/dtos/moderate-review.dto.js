import { z } from 'zod';

export const moderateReviewDto = z.object({
  status: z.enum(['pending', 'approved', 'rejected'], {
    required_error: 'Status is required',
    invalid_type_error: 'Status must be one of: pending, approved, rejected',
  }),
});