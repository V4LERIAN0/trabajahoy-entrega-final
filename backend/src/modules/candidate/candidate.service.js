import { CandidateRepository } from './candidate.repository.js';
import { supabaseStorage } from '../../common/utils/supabase-storage.js';
import { logger } from '../../common/utils/logger.js';

export class CandidateService {
  constructor() {
    this.candidateRepository = new CandidateRepository();
  }

  sanitizePublicUser(user) {
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  sanitizePublicProfile(profile) {
    return {
      id: profile.id ?? null,
      userId: profile.userId ?? profile.user?.id ?? null,
      bio: profile.bio ?? null,
      headline: profile.headline ?? null,
      website: profile.website ?? null,
      location: profile.location ?? null,
      availability: profile.availability ?? null,
      createdAt: profile.createdAt ?? null,
      updatedAt: profile.updatedAt ?? null,
      user: this.sanitizePublicUser(profile.user),
      experiences: profile.experiences ?? [],
      education: profile.education ?? [],
      skills: profile.skills ?? [],
      languages: profile.languages ?? [],
      cvs: profile.cvs ?? [],
      interests: profile.interests ?? [],
    };
  }

  // Profile CRUD
  async createProfile(userId, data) {
    const existingProfile = await this.candidateRepository.findByUserId(userId);
    if (existingProfile) {
      throw new Error('Candidate profile already exists');
    }

    const profile = await this.candidateRepository.create({
      ...data,
      userId,
    });

    logger.info(`Candidate profile created: ${userId}`, { candidateId: profile.id });
    return profile;
  }

  async getProfile(candidateId, userId) {
    const profile = await this.candidateRepository.findById(candidateId);
    if (!profile) {
      throw new Error('Candidate profile not found');
    }

    if (userId && profile.userId !== userId) {
      throw new Error('Unauthorized: You do not have access to this profile');
    }

    return await this.candidateRepository.findWithAllRelations(candidateId);
  }

  // For recruiters/admins: get full profile by userId without ownership check
  async getPublicProfileByUserId(userId) {
    const profileByUserId = await this.candidateRepository.findByUserId(userId);
    if (profileByUserId) {
      const fullProfile = await this.candidateRepository.findWithAllRelations(profileByUserId.id);
      return this.sanitizePublicProfile(fullProfile);
    }

    const profileByCandidateId = await this.candidateRepository.findWithAllRelations(userId);
    if (profileByCandidateId) {
      return this.sanitizePublicProfile(profileByCandidateId);
    }

    const user = await this.candidateRepository.findUserById(userId);
    if (!user) {
      throw Object.assign(new Error('Candidate profile not found'), {
        statusCode: 404,
      });
    }

    return this.sanitizePublicProfile({
      id: null,
      userId: user.id,
      bio: null,
      headline: null,
      website: null,
      location: null,
      availability: null,
      createdAt: null,
      updatedAt: null,
      user,
      experiences: [],
      education: [],
      skills: [],
      languages: [],
      cvs: [],
      interests: [],
    });
  }

  async updateProfile(candidateId, userId, data) {
    const profile = await this.candidateRepository.findById(candidateId);
    if (!profile) {
      throw new Error('Candidate profile not found');
    }

    if (userId && profile.userId !== userId) {
      throw new Error('Unauthorized: You do not have permission to update this profile');
    }

    return await this.candidateRepository.update(candidateId, data);
  }

  async deleteProfile(candidateId, userId) {
    const profile = await this.candidateRepository.findById(candidateId);
    if (!profile) {
      throw new Error('Candidate profile not found');
    }

    if (userId && profile.userId !== userId) {
      throw new Error('Unauthorized: You do not have permission to delete this profile');
    }

    return await this.candidateRepository.delete(candidateId);
  }

  // Experience CRUD
  async addExperience(candidateId, userId, data) {
    const profile = await this.candidateRepository.findById(candidateId);
    if (!profile) {
      throw new Error('Candidate profile not found');
    }

    if (userId && profile.userId !== userId) {
      throw new Error('Unauthorized: You do not have permission to add experiences to this profile');
    }

    return await this.candidateRepository.addExperience(candidateId, data);
  }

  async getExperience(experienceId) {
    const experience = await this.candidateRepository.findExperienceById(experienceId);
    if (!experience) {
      throw new Error('Experience not found');
    }
    return experience;
  }

  async getExperiences(candidateId, userId, pagination = {}) {
    const profile = await this.candidateRepository.findById(candidateId);
    if (!profile) {
      throw new Error('Candidate profile not found');
    }

    if (userId && profile.userId !== userId) {
      throw new Error('Unauthorized: You do not have access to these experiences');
    }

    return await this.candidateRepository.findExperiencesByCandidateId(candidateId, pagination);
  }

  async updateExperience(experienceId, userId, data) {
    const experience = await this.candidateRepository.findExperienceById(experienceId);
    if (!experience) {
      throw new Error('Experience not found');
    }

    if (userId) {
      const profile = await this.candidateRepository.findById(experience.candidateId);
      if (!profile || profile.userId !== userId) {
        throw new Error('Unauthorized: You do not have permission to update this experience');
      }
    }

    return await this.candidateRepository.updateExperience(experienceId, data);
  }

  async deleteExperience(experienceId, userId) {
    const experience = await this.candidateRepository.findExperienceById(experienceId);
    if (!experience) {
      throw new Error('Experience not found');
    }

    if (userId) {
      const profile = await this.candidateRepository.findById(experience.candidateId);
      if (!profile || profile.userId !== userId) {
        throw new Error('Unauthorized: You do not have permission to delete this experience');
      }
    }

    return await this.candidateRepository.deleteExperience(experienceId);
  }

  // Education CRUD
  async addEducation(candidateId, userId, data) {
    const profile = await this.candidateRepository.findById(candidateId);
    if (!profile) {
      throw new Error('Candidate profile not found');
    }

    if (userId && profile.userId !== userId) {
      throw new Error('Unauthorized: You do not have permission to add education to this profile');
    }

    return await this.candidateRepository.addEducation(candidateId, data);
  }

  async getEducationItem(educationId) {
    const education = await this.candidateRepository.findEducationById(educationId);
    if (!education) {
      throw new Error('Education not found');
    }
    return education;
  }

  async getEducation(candidateId, userId, pagination = {}) {
    const profile = await this.candidateRepository.findById(candidateId);
    if (!profile) {
      throw new Error('Candidate profile not found');
    }

    if (userId && profile.userId !== userId) {
      throw new Error('Unauthorized: You do not have access to this education');
    }

    return await this.candidateRepository.findEducationByCandidateId(candidateId, pagination);
  }

  async updateEducation(educationId, userId, data) {
    const education = await this.candidateRepository.findEducationById(educationId);
    if (!education) {
      throw new Error('Education not found');
    }

    if (userId) {
      const profile = await this.candidateRepository.findById(education.candidateId);
      if (!profile || profile.userId !== userId) {
        throw new Error('Unauthorized: You do not have permission to update this education');
      }
    }

    return await this.candidateRepository.updateEducation(educationId, data);
  }

  async deleteEducation(educationId, userId) {
    const education = await this.candidateRepository.findEducationById(educationId);
    if (!education) {
      throw new Error('Education not found');
    }

    if (userId) {
      const profile = await this.candidateRepository.findById(education.candidateId);
      if (!profile || profile.userId !== userId) {
        throw new Error('Unauthorized: You do not have permission to delete this education');
      }
    }

    return await this.candidateRepository.deleteEducation(educationId);
  }

  // Skills CRUD
  async addSkill(candidateId, userId, data) {
    const profile = await this.candidateRepository.findById(candidateId);
    if (!profile) {
      throw new Error('Candidate profile not found');
    }

    if (userId && profile.userId !== userId) {
      throw new Error('Unauthorized: You do not have permission to add skills to this profile');
    }

    return await this.candidateRepository.addSkill(candidateId, data);
  }

  async getSkill(skillId) {
    const skill = await this.candidateRepository.findSkillById(skillId);
    if (!skill) {
      throw new Error('Skill not found');
    }
    return skill;
  }

  async getSkills(candidateId, userId, pagination = {}) {
    const profile = await this.candidateRepository.findById(candidateId);
    if (!profile) {
      throw new Error('Candidate profile not found');
    }

    if (userId && profile.userId !== userId) {
      throw new Error('Unauthorized: You do not have access to these skills');
    }

    return await this.candidateRepository.findSkillsByCandidateId(candidateId, pagination);
  }

  async updateSkill(skillId, userId, data) {
    const skill = await this.candidateRepository.findSkillById(skillId);
    if (!skill) {
      throw new Error('Skill not found');
    }

    if (userId) {
      const profile = await this.candidateRepository.findById(skill.candidateId);
      if (!profile || profile.userId !== userId) {
        throw new Error('Unauthorized: You do not have permission to update this skill');
      }
    }

    return await this.candidateRepository.updateSkill(skillId, data);
  }

  async deleteSkill(skillId, userId) {
    const skill = await this.candidateRepository.findSkillById(skillId);
    if (!skill) {
      throw new Error('Skill not found');
    }

    if (userId) {
      const profile = await this.candidateRepository.findById(skill.candidateId);
      if (!profile || profile.userId !== userId) {
        throw new Error('Unauthorized: You do not have permission to delete this skill');
      }
    }

    return await this.candidateRepository.deleteSkill(skillId);
  }

  // Languages CRUD
  async addLanguage(candidateId, userId, data) {
    const profile = await this.candidateRepository.findById(candidateId);
    if (!profile) {
      throw new Error('Candidate profile not found');
    }

    if (userId && profile.userId !== userId) {
      throw new Error('Unauthorized: You do not have permission to add languages to this profile');
    }

    return await this.candidateRepository.addLanguage(candidateId, data);
  }

  async getLanguage(languageId) {
    const language = await this.candidateRepository.findLanguageById(languageId);
    if (!language) {
      throw new Error('Language not found');
    }
    return language;
  }

  async getLanguages(candidateId, userId, pagination = {}) {
    const profile = await this.candidateRepository.findById(candidateId);
    if (!profile) {
      throw new Error('Candidate profile not found');
    }

    if (userId && profile.userId !== userId) {
      throw new Error('Unauthorized: You do not have access to these languages');
    }

    return await this.candidateRepository.findLanguagesByCandidateId(candidateId, pagination);
  }

  async updateLanguage(languageId, userId, data) {
    const language = await this.candidateRepository.findLanguageById(languageId);
    if (!language) {
      throw new Error('Language not found');
    }

    if (userId) {
      const profile = await this.candidateRepository.findById(language.candidateId);
      if (!profile || profile.userId !== userId) {
        throw new Error('Unauthorized: You do not have permission to update this language');
      }
    }

    return await this.candidateRepository.updateLanguage(languageId, data);
  }

  async deleteLanguage(languageId, userId) {
    const language = await this.candidateRepository.findLanguageById(languageId);
    if (!language) {
      throw new Error('Language not found');
    }

    if (userId) {
      const profile = await this.candidateRepository.findById(language.candidateId);
      if (!profile || profile.userId !== userId) {
        throw new Error('Unauthorized: You do not have permission to delete this language');
      }
    }

    return await this.candidateRepository.deleteLanguage(languageId);
  }

  // CV Management with Supabase
  async uploadCV(candidateId, userId, file) {
    const profile = await this.candidateRepository.findById(candidateId);
    if (!profile) {
      throw new Error('Candidate profile not found');
    }

    if (userId && profile.userId !== userId) {
      throw new Error('Unauthorized: You do not have permission to upload a CV to this profile');
    }

    // Upload to Supabase Storage
    const uploadResult = await supabaseStorage.uploadCV(
      candidateId,
      file.buffer,
      file.originalname,
    );

    // Save metadata in database
    const cv = await this.candidateRepository.addCv(candidateId, {
      fileName: uploadResult.name,
      fileUrl: uploadResult.filePath,
      fileSize: file.size,
      fileType: file.mimetype,
    });

    // Generate signed URL for immediate access
    const signedUrl = await supabaseStorage.generateSignedUrl('CVs', cv.fileUrl);

    logger.info(`CV uploaded: ${candidateId}`, { candidateId, cvId: cv.id });

    return {
      id: cv.id,
      fileName: cv.fileName,
      file: signedUrl,
      uploadedAt: cv.uploadedAt,
    };
  }

  async getCV(cvId) {
    const cv = await this.candidateRepository.findCvById(cvId);
    if (!cv) {
      throw new Error('CV not found');
    }

    const signedUrl = await supabaseStorage.generateSignedUrl('CVs', cv.fileUrl);

    return {
      id: cv.id,
      fileName: cv.fileName,
      file: signedUrl,
      uploadedAt: cv.uploadedAt,
    };
  }

  async getCVs(candidateId, userId, pagination = {}) {
    const profile = await this.candidateRepository.findById(candidateId);
    if (!profile) {
      throw new Error('Candidate profile not found');
    }

    if (userId && profile.userId !== userId) {
      throw new Error('Unauthorized: You do not have access to these CVs');
    }

    const cvs = await this.candidateRepository.findCvsByCandidateId(candidateId, pagination);

    // If paginated, wrap response
    if (cvs.data) {
      const signedUrls = await Promise.all(
        cvs.data.map(async (cv) => {
          const signedUrl = await supabaseStorage.generateSignedUrl('CVs', cv.fileUrl);
          return { ...cv, file: signedUrl };
        }),
      );
      return { ...cvs, data: signedUrls };
    }

    // Generate signed URLs for all CVs
    return await supabaseStorage.getCVs(candidateId, cvs);
  }

  async deleteCV(cvId, userId) {
    const cv = await this.candidateRepository.findCvById(cvId);
    if (!cv) {
      throw new Error('CV not found');
    }

    if (userId) {
      const profile = await this.candidateRepository.findById(cv.candidateId);
      if (!profile || profile.userId !== userId) {
        throw new Error('Unauthorized: You do not have permission to delete this CV');
      }
    }

    // Delete from Supabase
    await supabaseStorage.deleteCV(cv.fileUrl);

    logger.info(`CV deleted: ${cvId}`, { candidateId: cv.candidateId, cvId });

    return { message: 'CV deleted successfully' };
  }

  // Interests CRUD
  async addInterest(candidateId, userId, interest) {
    const profile = await this.candidateRepository.findById(candidateId);
    if (!profile) {
      throw new Error('Candidate profile not found');
    }

    if (userId && profile.userId !== userId) {
      throw new Error('Unauthorized: You do not have permission to add interests to this profile');
    }

    return await this.candidateRepository.addInterest(candidateId, interest);
  }

  async getInterest(interestId) {
    const interest = await this.candidateRepository.findInterestById(interestId);
    if (!interest) {
      throw new Error('Interest not found');
    }
    return interest;
  }

  async getInterests(candidateId, userId, pagination = {}) {
    const profile = await this.candidateRepository.findById(candidateId);
    if (!profile) {
      throw new Error('Candidate profile not found');
    }

    if (userId && profile.userId !== userId) {
      throw new Error('Unauthorized: You do not have access to these interests');
    }

    return await this.candidateRepository.findInterestsByCandidateId(candidateId, pagination);
  }

  async deleteInterest(interestId, userId) {
    const interest = await this.candidateRepository.findInterestById(interestId);
    if (!interest) {
      throw new Error('Interest not found');
    }

    if (userId) {
      const profile = await this.candidateRepository.findById(interest.candidateId);
      if (!profile || profile.userId !== userId) {
        throw new Error('Unauthorized: You do not have permission to delete this interest');
      }
    }

    return await this.candidateRepository.deleteInterest(interestId);
  }
}
