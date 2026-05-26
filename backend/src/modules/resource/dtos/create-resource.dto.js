import { z } from 'zod';

const resourceTypeEnum = ['article', 'guide', 'video', 'podcast', 'template'];
const resourceStatusEnum = ['draft', 'published'];

const baseResourceDto = z.object({
		categoryId: z
			.string({ invalid_type_error: 'Category ID must be a string' })
			.uuid('Category ID must be a valid UUID')
			.nullable()
			.optional(),
		title: z
			.string({ invalid_type_error: 'Title must be a string' })
			.min(1, 'Title cannot be empty')
			.max(300, 'Title cannot exceed 300 characters')
			.optional(),
		content: z
			.string({ invalid_type_error: 'Content must be a string' })
			.min(1, 'Content cannot be empty')
			.max(50000, 'Content cannot exceed 50000 characters')
			.optional(),
		summary: z
			.string({ invalid_type_error: 'Summary must be a string' })
			.max(500, 'Summary cannot exceed 500 characters')
			.nullable()
			.optional(),
		coverUrl: z
			.string({ invalid_type_error: 'Cover URL must be a string' })
			.max(500, 'Cover URL cannot exceed 500 characters')
			.nullable()
			.optional(),
		type: z.enum(resourceTypeEnum).optional(),
		status: z.enum(resourceStatusEnum).optional(),
		state: z.enum(resourceStatusEnum).optional(),
		publishedAt: z
			.union([
				z.string().datetime('Published date must be a valid ISO datetime'),
				z.date(),
			])
			.nullable()
			.optional(),
	});

export const createResourceDto = baseResourceDto.extend({
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
		.max(50000, 'Content cannot exceed 50000 characters'),
}).refine((data) => !data.status || !data.state || data.status === data.state, {
	message: 'status and state must match when both are provided',
	path: ['state'],
});

export const updateResourceDto = baseResourceDto.refine(
	(data) => !data.status || !data.state || data.status === data.state,
	{
		message: 'status and state must match when both are provided',
		path: ['state'],
	},
);
