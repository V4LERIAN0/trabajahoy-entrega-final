import { z } from 'zod';

export const rateResourceDto = z.object({
	rating: z
		.number({
			required_error: 'Rating is required',
			invalid_type_error: 'Rating must be a number',
		})
		.int('Rating must be an integer value')
		.min(1, 'Rating must be at least 1')
		.max(5, 'Rating must be at most 5'),
});
