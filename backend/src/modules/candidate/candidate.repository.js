import { BaseRepository } from '../../common/repositories/base.repository.js';
import { CandidateProfile } from './models/candidate-profile.model.js';
import { CandidateExperience } from './models/candidate-experience.model.js';
import { CandidateEducation } from './models/candidate-education.model.js';
import { CandidateSkill } from './models/candidate-skill.model.js';
import { CandidateLanguage } from './models/candidate-language.model.js';
import { CandidateCvFile } from './models/candidate-cv-file.model.js';
import { CandidateInterest } from './models/candidate-interest.model.js';
import { AppDataSource } from '../../database/data-source.js';

export class CandidateRepository extends BaseRepository {
  constructor() {
    super(CandidateProfile);
    this.experienceRepository = AppDataSource.getRepository(CandidateExperience);
    this.educationRepository = AppDataSource.getRepository(CandidateEducation);
    this.skillRepository = AppDataSource.getRepository(CandidateSkill);
    this.languageRepository = AppDataSource.getRepository(CandidateLanguage);
    this.cvRepository = AppDataSource.getRepository(CandidateCvFile);
    this.interestRepository = AppDataSource.getRepository(CandidateInterest);
    this.profileRepository = AppDataSource.getRepository('Profile');
  }

  // Profile methods
  async findByUserId(userId) {
    return await this.repository.findOne({
      where: { userId },
      relations: ['user'],
    });
  }

  async findWithAllRelations(candidateId) {
    return await this.repository.findOne({
      where: { id: candidateId },
      relations: ['user', 'experiences', 'education', 'skills', 'languages', 'cvs', 'interests'],
    });
  }

  async findUserById(userId) {
    return await this.profileRepository.findOne({
      where: { id: userId },
    });
  }

  // Experience methods
  async findExperienceById(id) {
    return await this.experienceRepository.findOne({
      where: { id },
      relations: ['candidate'],
    });
  }

  async addExperience(candidateId, data) {
    const experience = this.experienceRepository.create({ ...data, candidateId });
    return await this.experienceRepository.save(experience);
  }

  async findExperiencesByCandidateId(candidateId, { page, limit } = {}) {
    const queryBuilder = this.experienceRepository
      .createQueryBuilder('experience')
      .where('experience.candidateId = :candidateId', { candidateId })
      .orderBy('experience.startDate', 'DESC');

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
      const [data, total] = await queryBuilder.getManyAndCount();
      return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    return await queryBuilder.getMany();
  }

  async updateExperience(id, data) {
    await this.experienceRepository.update(id, data);
    return await this.findExperienceById(id);
  }

  async deleteExperience(id) {
    return await this.experienceRepository.delete(id);
  }

  // Education methods
  async findEducationById(id) {
    return await this.educationRepository.findOne({
      where: { id },
      relations: ['candidate'],
    });
  }

  async addEducation(candidateId, data) {
    const education = this.educationRepository.create({ ...data, candidateId });
    return await this.educationRepository.save(education);
  }

  async findEducationByCandidateId(candidateId, { page, limit } = {}) {
    const queryBuilder = this.educationRepository
      .createQueryBuilder('education')
      .where('education.candidateId = :candidateId', { candidateId })
      .orderBy('education.startDate', 'DESC');

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
      const [data, total] = await queryBuilder.getManyAndCount();
      return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    return await queryBuilder.getMany();
  }

  async updateEducation(id, data) {
    await this.educationRepository.update(id, data);
    return await this.findEducationById(id);
  }

  async deleteEducation(id) {
    return await this.educationRepository.delete(id);
  }

  // Skills methods
  async findSkillById(id) {
    return await this.skillRepository.findOne({
      where: { id },
      relations: ['candidate'],
    });
  }

  async addSkill(candidateId, data) {
    const skill = this.skillRepository.create({ ...data, candidateId });
    return await this.skillRepository.save(skill);
  }

  async findSkillsByCandidateId(candidateId, { page, limit } = {}) {
    const queryBuilder = this.skillRepository
      .createQueryBuilder('skill')
      .where('skill.candidateId = :candidateId', { candidateId })
      .orderBy('skill.createdAt', 'DESC');

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
      const [data, total] = await queryBuilder.getManyAndCount();
      return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    return await queryBuilder.getMany();
  }

  async updateSkill(id, data) {
    await this.skillRepository.update(id, data);
    return await this.findSkillById(id);
  }

  async deleteSkill(id) {
    return await this.skillRepository.delete(id);
  }

  // Languages methods
  async findLanguageById(id) {
    return await this.languageRepository.findOne({
      where: { id },
      relations: ['candidate'],
    });
  }

  async addLanguage(candidateId, data) {
    const language = this.languageRepository.create({ ...data, candidateId });
    return await this.languageRepository.save(language);
  }

  async findLanguagesByCandidateId(candidateId, { page, limit } = {}) {
    const queryBuilder = this.languageRepository
      .createQueryBuilder('language')
      .where('language.candidateId = :candidateId', { candidateId })
      .orderBy('language.createdAt', 'DESC');

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
      const [data, total] = await queryBuilder.getManyAndCount();
      return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    return await queryBuilder.getMany();
  }

  async updateLanguage(id, data) {
    await this.languageRepository.update(id, data);
    return await this.findLanguageById(id);
  }

  async deleteLanguage(id) {
    return await this.languageRepository.delete(id);
  }

  // CV methods
  async findCvById(id) {
    return await this.cvRepository.findOne({
      where: { id },
      relations: ['candidate'],
    });
  }

  async addCv(candidateId, data) {
    const cv = this.cvRepository.create({ ...data, candidateId });
    return await this.cvRepository.save(cv);
  }

  async findCvsByCandidateId(candidateId, { page, limit } = {}) {
    const queryBuilder = this.cvRepository
      .createQueryBuilder('cv')
      .where('cv.candidateId = :candidateId', { candidateId })
      .orderBy('cv.uploadedAt', 'DESC');

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
      const [data, total] = await queryBuilder.getManyAndCount();
      return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    return await queryBuilder.getMany();
  }

  async deleteCv(id) {
    const cv = await this.cvRepository.findOne({ where: { id } });
    if (!cv) return null;
    await this.cvRepository.delete(id);
    return cv;
  }

  // Interests methods
  async findInterestById(id) {
    return await this.interestRepository.findOne({
      where: { id },
      relations: ['candidate'],
    });
  }

  async addInterest(candidateId, interest) {
    const interestEntity = this.interestRepository.create({ candidateId, tagName: interest });
    return await this.interestRepository.save(interestEntity);
  }

  async findInterestsByCandidateId(candidateId, { page, limit } = {}) {
    const queryBuilder = this.interestRepository
      .createQueryBuilder('interest')
      .where('interest.candidateId = :candidateId', { candidateId })
      .orderBy('interest.createdAt', 'DESC');

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
      const [data, total] = await queryBuilder.getManyAndCount();
      return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    return await queryBuilder.getMany();
  }

  async deleteInterest(id) {
    return await this.interestRepository.delete(id);
  }
}
