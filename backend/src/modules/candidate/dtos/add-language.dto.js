import { z } from 'zod';

const baseLanguageDto = z.object({
  languageName: z
    .string({ invalid_type_error: 'Language must be a string' })
    .min(1, 'Language cannot be empty')
    .max(100, 'Language cannot exceed 100 characters')
    .optional(),
  proficiency: z
    .enum(['basic', 'intermediate', 'advanced', 'native'], {
      invalid_type_error: 'Proficiency must be one of: basic, intermediate, advanced, native',
    })
    .optional(),
});

export const addLanguageDto = baseLanguageDto.extend({
  languageName: z
    .string({ required_error: 'Language name is required', invalid_type_error: 'Language must be a string' })
    .min(1, 'Language cannot be empty')
    .max(100, 'Language cannot exceed 100 characters'),
  proficiency: z
    .enum(['basic', 'intermediate', 'advanced', 'native'], {
      required_error: 'Proficiency is required',
      invalid_type_error: 'Proficiency must be one of: basic, intermediate, advanced, native',
    }),
});

export const updateLanguageDto = baseLanguageDto;
