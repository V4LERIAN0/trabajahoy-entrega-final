import { z } from 'zod';

const baseEducationDto = z.object({
  institution: z
    .string({ invalid_type_error: 'Institution must be a string' })
    .max(200, 'Institution name cannot exceed 200 characters')
    .optional(),
  degree: z
    .string({ invalid_type_error: 'Degree must be a string' })
    .max(100, 'Degree cannot exceed 100 characters')
    .optional(),
  fieldOfStudy: z
    .string({ invalid_type_error: 'Field must be a string' })
    .max(200, 'Field cannot exceed 200 characters')
    .optional(),
  startDate: z
    .string({ invalid_type_error: 'Start date must be a string' })
    .date('Invalid date format')
    .optional(),
  endDate: z
    .string({ invalid_type_error: 'End date must be a string' })
    .date('Invalid date format')
    .optional(),
  grade: z
    .string({ invalid_type_error: 'Grade must be a string' })
    .max(50, 'Grade cannot exceed 50 characters')
    .optional(),
  description: z
    .string({ invalid_type_error: 'Description must be a string' })
    .max(2000, 'Description cannot exceed 2000 characters')
    .optional(),
});

export const addEducationDto = baseEducationDto.extend({
  institution: z
    .string({ required_error: 'Institution name is required', invalid_type_error: 'Institution must be a string' })
    .max(200, 'Institution name cannot exceed 200 characters'),
  degree: z
    .string({ required_error: 'Degree is required', invalid_type_error: 'Degree must be a string' })
    .max(100, 'Degree cannot exceed 100 characters'),
  startDate: z
    .string({ required_error: 'Start date is required', invalid_type_error: 'Start date must be a string' })
    .date('Invalid date format'),
});

export const updateEducationDto = baseEducationDto;
