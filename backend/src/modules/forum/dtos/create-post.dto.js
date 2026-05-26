import { z } from 'zod';

const basePostDto = z.object({
	content: z
		.string({
			invalid_type_error: 'Content must be a string',
		})
		.min(1, 'Content cannot be empty')
		.max(10000, 'Content cannot exceed 10000 characters')
		.optional(),
});

export const createPostDto = basePostDto.extend({
	content: z
		.string({
			required_error: 'Content is required',
			invalid_type_error: 'Content must be a string',
		})
		.min(1, 'Content cannot be empty')
		.max(10000, 'Content cannot exceed 10000 characters'),
});

export const updatePostDto = basePostDto.extend({
	isSolution: z.boolean().optional(),
});
