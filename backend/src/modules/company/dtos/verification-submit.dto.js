import { z } from 'zod';

export const verificationSubmitDto = z.object({
  documents: z
    .array(
      z.object({
        documentType: z
          .string({
            required_error: 'Document type is required',
            invalid_type_error: 'Document type must be a string',
          })
          .min(1, 'Document type cannot be empty')
          .max(100, 'Document type cannot exceed 100 characters'),
        fileUrl: z
          .string({
            required_error: 'File URL is required',
            invalid_type_error: 'File URL must be a string',
          })
          .url('Invalid file URL')
          .max(500, 'File URL cannot exceed 500 characters'),
      }),
      {
        required_error: 'At least one document is required',
        invalid_type_error: 'Documents must be an array',
      },
    )
    .min(1, 'At least one document is required')
    .max(10, 'Cannot submit more than 10 documents at once'),
});
