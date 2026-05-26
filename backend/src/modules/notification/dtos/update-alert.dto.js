import { z } from 'zod';

export const updateAlertDto = z.object({
  keywords: z
    .array(
      z.string({
        invalid_type_error: 'Each keyword must be a string',
      }),
      {
        invalid_type_error: 'Keywords must be an array of strings',
      },
    )
    .optional(),

  location: z
    .string({
      invalid_type_error: 'Location must be a string',
    })
    .max(255, 'Location cannot exceed 255 characters')
    .optional(),

  type: z
    .enum(['full-time', 'part-time', 'contract', 'freelance', 'internship'], {
      invalid_type_error:
        'Type must be one of: full-time, part-time, contract, freelance, internship',
    })
    .optional(),

  modality: z
    .enum(['remote', 'hybrid', 'onsite'], {
      invalid_type_error: 'Modality must be one of: remote, hybrid, onsite',
    })
    .optional(),

  level: z
    .enum(['junior', 'mid', 'senior', 'lead', 'manager', 'director'], {
      invalid_type_error:
        'Level must be one of: junior, mid, senior, lead, manager, director',
    })
    .optional(),

  frequency: z
    .enum(['daily', 'weekly'], {
      invalid_type_error: 'Frequency must be daily or weekly',
    })
    .optional(),

  isActive: z
    .boolean({
      invalid_type_error: 'isActive must be a boolean',
    })
    .optional(),
});