import { z } from 'zod';

const baseSkillDto = z.object({
  skillName: z
    .string({ invalid_type_error: 'Skill name must be a string' })
    .min(1, 'Skill name cannot be empty')
    .max(100, 'Skill name cannot exceed 100 characters')
    .optional(),
  level: z
    .enum(['beginner', 'intermediate', 'advanced', 'expert'], {
      invalid_type_error: 'Level must be one of: beginner, intermediate, advanced, expert',
    })
    .optional(),
  yearsOfExperience: z
    .number({ invalid_type_error: 'Years of experience must be a number' })
    .min(0)
    .optional(),
});

export const addSkillDto = baseSkillDto.extend({
  skillName: z
    .string({ required_error: 'Skill name is required', invalid_type_error: 'Skill name must be a string' })
    .min(1, 'Skill name cannot be empty')
    .max(100, 'Skill name cannot exceed 100 characters'),
  level: z
    .enum(['beginner', 'intermediate', 'advanced', 'expert'], {
      required_error: 'Level is required',
      invalid_type_error: 'Level must be one of: beginner, intermediate, advanced, expert',
    }),
});

export const updateSkillDto = baseSkillDto;
