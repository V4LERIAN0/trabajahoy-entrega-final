import { Router } from 'express';
import { CandidateController } from './candidate.controller.js';
import { authMiddleware } from '../../common/middlewares/auth.middleware.js';
import { roleMiddleware } from '../../common/middlewares/role.middleware.js';
import { validateDto } from '../../common/middlewares/validation.middleware.js';
import { createProfileDto } from './dtos/create-profile.dto.js';
import { updateProfileDto } from './dtos/update-profile.dto.js';
import { addExperienceDto, updateExperienceDto } from './dtos/add-experience.dto.js';
import { addEducationDto, updateEducationDto } from './dtos/add-education.dto.js';
import { addSkillDto, updateSkillDto } from './dtos/add-skill.dto.js';
import { addLanguageDto, updateLanguageDto } from './dtos/add-language.dto.js';
import { uploadSingle, multerErrorHandler } from '../../common/middlewares/upload.middleware.js';

const router = Router();
const candidateController = new CandidateController();

// All routes require authentication
router.use(authMiddleware);

// ── Public route for recruiters/admin to view candidate profile ──────────────
// Must be registered BEFORE roleMiddleware(['candidate']) below
router.get(
  '/public/by-user/:userId',
  roleMiddleware(['recruiter', 'company_admin', 'admin']),
  candidateController.getPublicProfileByUserId.bind(candidateController),
);

// All remaining routes require candidate role
router.use(roleMiddleware(['candidate']));

// Profile CRUD
router.post(
  '/profile',
  validateDto(createProfileDto),
  candidateController.create.bind(candidateController),
);
router.get(
  '/profile/:id',
  candidateController.getProfile.bind(candidateController),
);
router.patch(
  '/profile/:id',
  validateDto(updateProfileDto),
  candidateController.updateProfile.bind(candidateController),
);
router.delete(
  '/profile/:id',
  candidateController.deleteProfile.bind(candidateController),
);

// Experience CRUD
router.post(
  '/profile/:candidateId/experiences',
  validateDto(addExperienceDto),
  candidateController.addExperience.bind(candidateController),
);
router.get(
  '/profile/experiences/:id',
  candidateController.getExperience.bind(candidateController),
);
router.patch(
  '/profile/experiences/:id',
  validateDto(updateExperienceDto),
  candidateController.updateExperience.bind(candidateController),
);
router.delete(
  '/profile/experiences/:id',
  candidateController.deleteExperience.bind(candidateController),
);

// Education CRUD
router.post(
  '/profile/:candidateId/education',
  validateDto(addEducationDto),
  candidateController.addEducation.bind(candidateController),
);
router.get(
  '/profile/education/:id',
  candidateController.getEducationItem.bind(candidateController),
);
router.patch(
  '/profile/education/:id',
  validateDto(updateEducationDto),
  candidateController.updateEducation.bind(candidateController),
);
router.delete(
  '/profile/education/:id',
  candidateController.deleteEducation.bind(candidateController),
);

// Skills CRUD
router.post(
  '/profile/:candidateId/skills',
  validateDto(addSkillDto),
  candidateController.addSkill.bind(candidateController),
);
router.get(
  '/profile/skills/:id',
  candidateController.getSkill.bind(candidateController),
);
router.patch(
  '/profile/skills/:id',
  validateDto(updateSkillDto),
  candidateController.updateSkill.bind(candidateController),
);
router.delete(
  '/profile/skills/:id',
  candidateController.deleteSkill.bind(candidateController),
);

// Languages CRUD
router.post(
  '/profile/:candidateId/languages',
  validateDto(addLanguageDto),
  candidateController.addLanguage.bind(candidateController),
);
router.get(
  '/profile/languages/:id',
  candidateController.getLanguage.bind(candidateController),
);
router.patch(
  '/profile/languages/:id',
  validateDto(updateLanguageDto),
  candidateController.updateLanguage.bind(candidateController),
);
router.delete(
  '/profile/languages/:id',
  candidateController.deleteLanguage.bind(candidateController),
);

// CV Management
router.post(
  '/profile/:candidateId/cv',
  uploadSingle('file'),
  multerErrorHandler,
  candidateController.uploadCV.bind(candidateController),
);
router.get(
  '/profile/cv/:id',
  candidateController.getCV.bind(candidateController),
);
router.delete(
  '/profile/cv/:id',
  candidateController.deleteCV.bind(candidateController),
);

// Interests CRUD
router.post(
  '/profile/:candidateId/interests',
  candidateController.addInterest.bind(candidateController),
);
router.get(
  '/profile/interests/:id',
  candidateController.getInterest.bind(candidateController),
);
router.delete(
  '/profile/interests/:id',
  candidateController.deleteInterest.bind(candidateController),
);

// List sub-resources by candidate
router.get(
  '/profile/:id/experiences',
  candidateController.getExperiences.bind(candidateController),
);
router.get(
  '/profile/:id/education',
  candidateController.getEducation.bind(candidateController),
);
router.get(
  '/profile/:id/skills',
  candidateController.getSkills.bind(candidateController),
);
router.get(
  '/profile/:id/languages',
  candidateController.getLanguages.bind(candidateController),
);
router.get(
  '/profile/:id/cv',
  candidateController.getCVs.bind(candidateController),
);
router.get(
  '/profile/:id/interests',
  candidateController.getInterests.bind(candidateController),
);

export default router;
