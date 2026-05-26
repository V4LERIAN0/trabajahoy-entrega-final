import { CandidateService } from './candidate.service.js';
import { parsePagination } from '../../common/utils/paginator.js';

const candidateService = new CandidateService();

export class CandidateController {
  // Profile CRUD
  async create(req, res, next) {
    try {
      const userId = req.user.id;
      const profileData = req.body;
      const profile = await candidateService.createProfile(userId, profileData);

      res.status(201).json({
        data: profile,
        message: 'Candidate profile created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const profile = await candidateService.getProfile(id, userId);

      res.status(200).json({
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const profileData = req.body;
      const profile = await candidateService.updateProfile(id, userId, profileData);

      res.status(200).json({
        data: profile,
        message: 'Candidate profile updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProfile(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const profile = await candidateService.deleteProfile(id, userId);

      res.status(200).json({
        data: profile,
        message: 'Candidate profile deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Public: Recruiter/Admin view of a candidate profile by userId
  async getPublicProfileByUserId(req, res, next) {
    try {
      const { userId } = req.params;
      const profile = await candidateService.getPublicProfileByUserId(userId);
      res.status(200).json({ data: profile });
    } catch (error) {
      next(error);
    }
  }

  // Experience CRUD
  async addExperience(req, res, next) {
    try {
      const { candidateId } = req.params;
      const userId = req.user.id;
      const data = req.body;
      const experience = await candidateService.addExperience(candidateId, userId, data);

      res.status(201).json({
        data: experience,
        message: 'Experience added successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getExperience(req, res, next) {
    try {
      const { id } = req.params;
      const experience = await candidateService.getExperience(id);

      res.status(200).json({
        data: experience,
      });
    } catch (error) {
      next(error);
    }
  }

  async getExperiences(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const pagination = parsePagination(req);
      const result = await candidateService.getExperiences(id, userId, pagination);

      res.status(200).json({
        data: result.data || result,
        ...(result.total && {
          pagination: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
          },
        }),
      });
    } catch (error) {
      next(error);
    }
  }

  async updateExperience(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const data = req.body;
      const experience = await candidateService.updateExperience(id, userId, data);

      res.status(200).json({
        data: experience,
        message: 'Experience updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteExperience(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await candidateService.deleteExperience(id, userId);

      res.status(200).json({
        message: 'Experience deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Education CRUD
  async addEducation(req, res, next) {
    try {
      const { candidateId } = req.params;
      const userId = req.user.id;
      const data = req.body;
      const education = await candidateService.addEducation(candidateId, userId, data);

      res.status(201).json({
        data: education,
        message: 'Education added successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getEducationItem(req, res, next) {
    try {
      const { id } = req.params;
      const education = await candidateService.getEducationItem(id);

      res.status(200).json({
        data: education,
      });
    } catch (error) {
      next(error);
    }
  }

  async getEducation(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const pagination = parsePagination(req);
      const result = await candidateService.getEducation(id, userId, pagination);

      res.status(200).json({
        data: result.data || result,
        ...(result.total && {
          pagination: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
          },
        }),
      });
    } catch (error) {
      next(error);
    }
  }

  async updateEducation(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const data = req.body;
      const education = await candidateService.updateEducation(id, userId, data);

      res.status(200).json({
        data: education,
        message: 'Education updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteEducation(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await candidateService.deleteEducation(id, userId);

      res.status(200).json({
        message: 'Education deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Skills CRUD
  async addSkill(req, res, next) {
    try {
      const { candidateId } = req.params;
      const userId = req.user.id;
      const data = req.body;
      const skill = await candidateService.addSkill(candidateId, userId, data);

      res.status(201).json({
        data: skill,
        message: 'Skill added successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getSkill(req, res, next) {
    try {
      const { id } = req.params;
      const skill = await candidateService.getSkill(id);

      res.status(200).json({
        data: skill,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSkills(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const pagination = parsePagination(req);
      const result = await candidateService.getSkills(id, userId, pagination);

      res.status(200).json({
        data: result.data || result,
        ...(result.total && {
          pagination: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
          },
        }),
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSkill(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const data = req.body;
      const skill = await candidateService.updateSkill(id, userId, data);

      res.status(200).json({
        data: skill,
        message: 'Skill updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteSkill(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await candidateService.deleteSkill(id, userId);

      res.status(200).json({
        message: 'Skill deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Languages CRUD
  async addLanguage(req, res, next) {
    try {
      const { candidateId } = req.params;
      const userId = req.user.id;
      const data = req.body;
      const language = await candidateService.addLanguage(candidateId, userId, data);

      res.status(201).json({
        data: language,
        message: 'Language added successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getLanguage(req, res, next) {
    try {
      const { id } = req.params;
      const language = await candidateService.getLanguage(id);

      res.status(200).json({
        data: language,
      });
    } catch (error) {
      next(error);
    }
  }

  async getLanguages(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const pagination = parsePagination(req);
      const result = await candidateService.getLanguages(id, userId, pagination);

      res.status(200).json({
        data: result.data || result,
        ...(result.total && {
          pagination: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
          },
        }),
      });
    } catch (error) {
      next(error);
    }
  }

  async updateLanguage(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const data = req.body;
      const language = await candidateService.updateLanguage(id, userId, data);

      res.status(200).json({
        data: language,
        message: 'Language updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteLanguage(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await candidateService.deleteLanguage(id, userId);

      res.status(200).json({
        message: 'Language deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteLanguage(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await candidateService.deleteLanguage(id, userId);

      res.status(200).json({
        message: 'Language deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // CV Management
  async uploadCV(req, res, next) {
    try {
      const { candidateId } = req.params;
      const userId = req.user.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          message: 'No file uploaded',
        });
      }

      const cv = await candidateService.uploadCV(candidateId, userId, file);

      res.status(201).json({
        data: cv,
        message: 'CV uploaded successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getCV(req, res, next) {
    try {
      const { id } = req.params;
      const cv = await candidateService.getCV(id);

      res.status(200).json({
        data: cv,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCVs(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const pagination = parsePagination(req);
      const result = await candidateService.getCVs(id, userId, pagination);

      res.status(200).json({
        data: result.data || result,
        ...(result.total && {
          pagination: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
          },
        }),
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCV(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await candidateService.deleteCV(id, userId);

      res.status(200).json({
        message: 'CV deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Interests CRUD
  async addInterest(req, res, next) {
    try {
      const { candidateId } = req.params;
      const userId = req.user.id;
      const { interest } = req.body;
      const interestEntity = await candidateService.addInterest(candidateId, userId, interest);

      res.status(201).json({
        data: interestEntity,
        message: 'Interest added successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getInterest(req, res, next) {
    try {
      const { id } = req.params;
      const interest = await candidateService.getInterest(id);

      res.status(200).json({
        data: interest,
      });
    } catch (error) {
      next(error);
    }
  }

  async getInterests(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const pagination = parsePagination(req);
      const result = await candidateService.getInterests(id, userId, pagination);

      res.status(200).json({
        data: result.data || result,
        ...(result.total && {
          pagination: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
          },
        }),
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteInterest(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await candidateService.deleteInterest(id, userId);

      res.status(200).json({
        message: 'Interest deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
