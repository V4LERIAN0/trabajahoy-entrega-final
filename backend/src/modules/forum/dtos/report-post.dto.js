import { z } from 'zod';

const reportStatusValues = ['pending', 'resolved', 'dismissed'];

const baseReportDto = z.object({
	reason: z
		.string({
			invalid_type_error: 'Reason must be a string',
		})
		.min(1, 'Reason cannot be empty')
		.max(200, 'Reason cannot exceed 200 characters')
		.optional(),
	description: z
		.string({
			invalid_type_error: 'Description must be a string',
		})
		.max(2000, 'Description cannot exceed 2000 characters')
		.optional(),
	status: z.enum(reportStatusValues).optional(),
});

export const createForumReportDto = baseReportDto.omit({ status: true }).extend({
	reason: z
		.string({
			required_error: 'Reason is required',
			invalid_type_error: 'Reason must be a string',
		})
		.min(1, 'Reason cannot be empty')
		.max(200, 'Reason cannot exceed 200 characters'),
});

export const updateForumReportDto = z.object({
	status: z.enum(reportStatusValues, {
		required_error: 'Status is required',
		invalid_type_error: 'Status must be valid',
	}),
}).strict();
