import { BaseRepository } from '../../common/repositories/base.repository.js';
import { Company } from './models/company.model.js';
import { CompanyLocation } from './models/company-location.model.js';
import { CompanyBenefit } from './models/company-benefit.model.js';
import { CompanyMember } from './models/company-member.model.js';
import { CompanyVerificationSubmission } from './models/company-verification-submission.model.js';
import { CompanyVerificationDocument } from './models/company-verification-document.model.js';
import { AppDataSource } from '../../database/data-source.js';

export class CompanyRepository extends BaseRepository {
  constructor() {
    super(Company);
    this.locationRepository = AppDataSource.getRepository(CompanyLocation);
    this.benefitRepository = AppDataSource.getRepository(CompanyBenefit);
    this.memberRepository = AppDataSource.getRepository(CompanyMember);
    this.verificationRepository = AppDataSource.getRepository(CompanyVerificationSubmission);
    this.verificationDocumentRepository = AppDataSource.getRepository(CompanyVerificationDocument);
  }

  // Company CRUD
  async createCompany(companyData) {
    const company = this.repository.create(companyData);
    return await this.repository.save(company);
  }

  async findCompanyById(id) {
    return await this.findOne({ id }, ['locations', 'benefits', 'members']);
  }

  /**
   * Find all companies with pagination and filters
   * @param {Object} options - Query options
   * @returns {Object} Paginated result
   */
  async findAllCompanies({ page = 1, limit = 10, industry, search } = {}) {
    const queryBuilder = this.createQueryBuilder('company')
      .leftJoinAndSelect('company.owner', 'owner')
      .leftJoinAndSelect('company.locations', 'locations');

    if (industry) {
      queryBuilder.andWhere('company.industry = :industry', { industry });
    }

    if (search) {
      queryBuilder.andWhere('company.name ILIKE :search', { search: `%${search}%` });
    }

    queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('company.createdAt', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Update company by ID
   * @param {string} id - Company UUID
   * @param {Object} updateData - Update data
   * @returns {Object} Updated company
   */
  async updateCompany(id, updateData) {
    await this.repository.update(id, updateData);
    return await this.findCompanyById(id);
  }

  /**
   * Delete company by ID
   * @param {string} id - Company UUID
   * @returns {Object} Delete result
   */
  async deleteCompany(id) {
    return await this.repository.delete(id);
  }

  /**
   * Find company by owner ID
   * @param {string} ownerId - Owner user UUID
   * @returns {Object|null} Company or null
   */
  async findCompanyByOwnerId(ownerId) {
    return await this.findOne({ ownerId }, ['locations', 'benefits', 'members']);
  }

  /**
   * Search companies by industry
   * @param {string} industry - Industry name
   * @returns {Object[]} Array of companies
   */
  async searchCompaniesByIndustry(industry) {
    return await this.find({ industry }, { relations: ['locations', 'benefits'] });
  }

  /**
   * Search companies by name or description
   * @param {string} searchTerm - Search term
   * @param {Object} options - Query options
   * @returns {Object} Paginated result
   */
  async searchCompanies(searchTerm, { page, limit } = {}) {
    const queryBuilder = this.createQueryBuilder('company')
      .leftJoinAndSelect('company.owner', 'owner')
      .leftJoinAndSelect('company.locations', 'locations')
      .leftJoinAndSelect('company.benefits', 'benefits')
      .where('company.name ILIKE :search OR company.description ILIKE :search', {
        search: `%${searchTerm}%`,
      })
      .orderBy('company.createdAt', 'DESC');

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
      const [data, total] = await queryBuilder.getManyAndCount();
      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    const data = await queryBuilder.getMany();
    return data;
  }

  // Location management

  async addLocation(companyId, locationData) {
    const location = this.locationRepository.create({
      ...locationData,
      companyId,
    });
    return await this.locationRepository.save(location);
  }

  async findLocationById(id) {
    return await this.locationRepository.findOne({
      where: { id },
      relations: ['company'],
    });
  }

  async findLocationsByCompanyId(companyId, { page, limit } = {}) {
    const queryBuilder = this.locationRepository
      .createQueryBuilder('location')
      .where('location.companyId = :companyId', { companyId })
      .orderBy('location.isHeadquarters', 'DESC')
      .addOrderBy('location.createdAt', 'DESC');

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
      const [data, total] = await queryBuilder.getManyAndCount();
      return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    return await queryBuilder.getMany();
  }

  async updateLocation(id, updateData) {
    await this.locationRepository.update(id, updateData);
    return await this.findLocationById(id);
  }

  async deleteLocation(id) {
    return await this.locationRepository.delete(id);
  }

  // Benefit management

  async addBenefit(companyId, benefitData) {
    const benefit = this.benefitRepository.create({
      ...benefitData,
      companyId,
    });
    return await this.benefitRepository.save(benefit);
  }

  async findBenefitById(id) {
    return await this.benefitRepository.findOne({
      where: { id },
      relations: ['company'],
    });
  }

  async findBenefitsByCompanyId(companyId, { page, limit } = {}) {
    const queryBuilder = this.benefitRepository
      .createQueryBuilder('benefit')
      .where('benefit.companyId = :companyId', { companyId })
      .orderBy('benefit.createdAt', 'DESC');

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
      const [data, total] = await queryBuilder.getManyAndCount();
      return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    return await queryBuilder.getMany();
  }

  async updateBenefit(id, updateData) {
    await this.benefitRepository.update(id, updateData);
    return await this.findBenefitById(id);
  }

  async deleteBenefit(id) {
    return await this.benefitRepository.delete(id);
  }

  // Member management

  async addMember(companyId, memberData) {
    const member = this.memberRepository.create({
      ...memberData,
      companyId,
    });
    return await this.memberRepository.save(member);
  }

  async findMemberById(id) {
    return await this.memberRepository.findOne({
      where: { id },
      relations: ['company', 'user'],
    });
  }

  async findMembersByCompanyId(companyId, { page, limit } = {}) {
    const queryBuilder = this.memberRepository
      .createQueryBuilder('member')
      .where('member.companyId = :companyId', { companyId })
      .leftJoinAndSelect('member.user', 'user')
      .orderBy('member.joinedAt', 'DESC');

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
      const [data, total] = await queryBuilder.getManyAndCount();
      return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    return await queryBuilder.getMany();
  }

  async findMemberByCompanyAndUser(companyId, userId) {
    return await this.memberRepository.findOne({
      where: { companyId, userId },
      relations: ['company', 'user'],
    });
  }

  async updateMember(id, updateData) {
    await this.memberRepository.update(id, updateData);
    return await this.findMemberById(id);
  }

  async deleteMember(id) {
    return await this.memberRepository.delete(id);
  }

  // Verification workflow

  async createVerificationSubmission(submissionData) {
    const submission = this.verificationRepository.create(submissionData);
    return await this.verificationRepository.save(submission);
  }

  async findVerificationSubmissionById(id) {
    return await this.verificationRepository.findOne({
      where: { id },
      relations: ['company', 'documents', 'reviewer'],
    });
  }

  async findPendingVerificationByCompanyId(companyId) {
    return await this.verificationRepository.findOne({
      where: { companyId, status: 'pending' },
      relations: ['documents'],
      order: { submittedAt: 'DESC' },
    });
  }

  async findLatestVerificationByCompanyId(companyId) {
    return await this.verificationRepository.findOne({
      where: { companyId },
      relations: ['documents', 'reviewer'],
      order: { submittedAt: 'DESC' },
    });
  }

  async updateVerificationSubmission(id, updateData) {
    await this.verificationRepository.update(id, updateData);
    return await this.findVerificationSubmissionById(id);
  }

  async findAllVerificationSubmissions({ page = 1, limit = 10, status } = {}) {
    const queryBuilder = this.verificationRepository.createQueryBuilder('submission')
      .leftJoinAndSelect('submission.company', 'company')
      .leftJoinAndSelect('submission.documents', 'documents')
      .leftJoinAndSelect('submission.reviewer', 'reviewer');

    if (status) {
      queryBuilder.andWhere('submission.status = :status', { status });
    }

    queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('submission.submittedAt', 'DESC');

    const [submissions, total] = await queryBuilder.getManyAndCount();

    return {
      data: submissions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Verification document management

  async createVerificationDocument(documentData) {
    const document = this.verificationDocumentRepository.create(documentData);
    return await this.verificationDocumentRepository.save(document);
  }

  async findVerificationDocumentsBySubmissionId(submissionId) {
    return await this.verificationDocumentRepository.find({
      where: { submissionId },
      order: { createdAt: 'ASC' },
    });
  }
}
