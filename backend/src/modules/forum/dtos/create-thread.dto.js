import { z } from 'zod';

const baseThreadDto = z.object({
	categoryId: z
		.string({
			invalid_type_error: 'Category ID must be a string',
		})
		.uuid('Category ID must be a valid UUID')
		.optional(),
	title: z
		.string({
			invalid_type_error: 'Title must be a string',
		})
		.min(1, 'Title cannot be empty')
		.max(300, 'Title cannot exceed 300 characters')
		.optional(),
	content: z
		.string({
			invalid_type_error: 'Content must be a string',
		})
		.min(1, 'Content cannot be empty')
		.max(20000, 'Content cannot exceed 20000 characters')
		.optional(),
	status: z.enum(['open', 'closed', 'pinned', 'resolved']).optional(),
});

export const createThreadDto = baseThreadDto.extend({
	categoryId: z
		.string({
			required_error: 'Category ID is required',
			invalid_type_error: 'Category ID must be a string',
		})
		.uuid('Category ID must be a valid UUID'),
	title: z
		.string({
			required_error: 'Title is required',
			invalid_type_error: 'Title must be a string',
		})
		.min(1, 'Title cannot be empty')
		.max(300, 'Title cannot exceed 300 characters'),
	content: z
		.string({
			required_error: 'Content is required',
			invalid_type_error: 'Content must be a string',
		})
		.min(1, 'Content cannot be empty')
		.max(20000, 'Content cannot exceed 20000 characters'),
});

export const updateThreadDto = baseThreadDto;
