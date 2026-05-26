import { CompanyRepository } from './company.repository.js';
import { supabaseStorage } from '../../common/utils/supabase-storage.js';
import { logger } from '../../common/utils/logger.js';
import { AppDataSource } from '../../database/data-source.js';
import { Vacancy } from '../vacancy/models/vacancy.model.js';
import { JobApplication } from '../application/models/job-application.model.js';

export class CompanyService {
  constructor() {
    this.companyRepository = new CompanyRepository();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Dashboard
  // ─────────────────────────────────────────────────────────────────────────

  async _assertDashboardAccess(companyId, userId, userRoles = []) {
    if (userRoles.includes('admin')) {
      return await this.verifyCompanyExists(companyId);
    }
    return await this.verifyCompanyOwnerOrAdmin(companyId, userId);
  }

  async getDashboard(companyId, userId, userRoles = []) {
    await this._assertDashboardAccess(companyId, userId, userRoles);

    const vacancyRepo = AppDataSource.getRepository(Vacancy);
    const applicationRepo = AppDataSource.getRepository(JobApplication);

    const [activeVacancies, applicationsTotal, inProcess, hires] = await Promise.all([
      vacancyRepo.count({ where: { companyId, status: 'published' } }),
      applicationRepo
        .createQueryBuilder('app')
        .innerJoin('app.vacancy', 'v')
        .where('v.company_id = :companyId', { companyId })
        .getCount(),
      applicationRepo
        .createQueryBuilder('app')
        .innerJoin('app.vacancy', 'v')
        .where('v.company_id = :companyId', { companyId })
        .andWhere('app.status IN (:...statuses)', {
          statuses: ['pending', 'reviewed', 'interview'],
        })
        .getCount(),
      applicationRepo
        .createQueryBuilder('app')
        .innerJoin('app.vacancy', 'v')
        .where('v.company_id = :companyId', { companyId })
        .andWhere('app.status = :status', { status: 'accepted' })
        .getCount(),
    ]);

    return {
      vacancies: activeVacancies,
      applications: applicationsTotal,
      candidatesInProcess: inProcess,
      hires,
    };
  }

  async getApplicationsByStatus(companyId, userId, userRoles = []) {
    await this._assertDashboardAccess(companyId, userId, userRoles);

    const applicationRepo = AppDataSource.getRepository(JobApplication);
    const rows = await applicationRepo
      .createQueryBuilder('app')
      .innerJoin('app.vacancy', 'v')
      .select('app.status', 'status')
      .addSelect('COUNT(app.id)', 'count')
      .where('v.company_id = :companyId', { companyId })
      .groupBy('app.status')
      .getRawMany();

    const base = { pending: 0, reviewed: 0, interview: 0, accepted: 0, rejected: 0 };
    for (const row of rows) {
      base[row.status] = parseInt(row.count, 10) || 0;
    }
    return base;
  }

  async getRecentApplications(companyId, userId, userRoles = [], limit = 5) {
    await this._assertDashboardAccess(companyId, userId, userRoles);

    const applicationRepo = AppDataSource.getRepository(JobApplication);
    const apps = await applicationRepo
      .createQueryBuilder('app')
      .innerJoinAndSelect('app.vacancy', 'v')
      .innerJoinAndSelect('app.user', 'u')
      .where('v.company_id = :companyId', { companyId })
      .orderBy('app.appliedAt', 'DESC')
      .limit(limit)
      .getMany();

    return apps.map((app) => ({
      id: app.id,
      candidateName:
        `${app.user?.firstName || ''} ${app.user?.lastName || ''}`.trim() ||
        app.user?.email ||
        'Candidato',
      vacancyTitle: app.vacancy?.title || '',
      status: app.status,
      appliedAt: app.appliedAt,
    }));
  }

  // Company CRUD
  async createCompany(userId, companyData) {
    const existingCompany = await this.companyRepository.findCompanyByOwnerId(userId);
    if (existingCompany) {
      throw new Error('You already have a company registered. Only one company per owner is allowed.');
    }

    return await this.companyRepository.createCompany({
      ...companyData,
      ownerId: userId,
    });
  }

  async getCompanyById(id) {
    const company = await this.companyRepository.findCompanyById(id);
    if (!company) {
      throw new Error('Company not found');
    }
    return company;
  }

  async getMyCompany(userId) {
    const company = await this.companyRepository.findCompanyByOwnerId(userId);
    if (!company) {
      throw new Error('You do not have a company registered');
    }
    return company;
  }

  async getAllCompanies(options) {
    return await this.companyRepository.findAllCompanies(options);
  }

  async updateCompany(companyId, userId, updateData) {
    await this.verifyCompanyOwnerOrAdmin(companyId, userId);

    return await this.companyRepository.updateCompany(companyId, updateData);
  }

  async deleteCompany(companyId, userId) {
    const company = await this.companyRepository.findCompanyById(companyId);
    if (!company) {
      throw new Error('Company not found');
    }

    if (company.ownerId !== userId) {
      throw new Error('You do not have permission to delete this company');
    }

    return await this.companyRepository.deleteCompany(companyId);
  }

  // Location management
  async addLocation(companyId, userId, locationData) {
    await this.verifyCompanyOwnership(companyId, userId);

    if (locationData.isHeadquarters) {
      const existingLocations = await this.companyRepository.findLocationsByCompanyId(companyId);
      const headquarters = existingLocations.find((loc) => loc.isHeadquarters);
      if (headquarters) {
        await this.companyRepository.updateLocation(headquarters.id, { isHeadquarters: false });
      }
    }

    return await this.companyRepository.addLocation(companyId, locationData);
  }

  async getLocations(companyId, pagination = {}) {
    await this.verifyCompanyExists(companyId);
    return await this.companyRepository.findLocationsByCompanyId(companyId, pagination);
  }

  async updateLocation(companyId, userId, locationId, updateData) {
    await this.verifyCompanyOwnership(companyId, userId);

    const location = await this.companyRepository.findLocationById(locationId);
    if (!location || location.companyId !== companyId) {
      throw new Error('Location not found for this company');
    }

    if (updateData.isHeadquarters) {
      const existingLocations = await this.companyRepository.findLocationsByCompanyId(companyId);
      const headquarters = existingLocations.find(
        (loc) => loc.isHeadquarters && loc.id !== locationId,
      );
      if (headquarters) {
        await this.companyRepository.updateLocation(headquarters.id, { isHeadquarters: false });
      }
    }

    return await this.companyRepository.updateLocation(locationId, updateData);
  }

  async deleteLocation(companyId, userId, locationId) {
    await this.verifyCompanyOwnership(companyId, userId);

    const location = await this.companyRepository.findLocationById(locationId);
    if (!location || location.companyId !== companyId) {
      throw new Error('Location not found for this company');
    }

    return await this.companyRepository.deleteLocation(locationId);
  }

  // Benefit management
  async addBenefit(companyId, userId, benefitData) {
    await this.verifyCompanyOwnership(companyId, userId);
    return await this.companyRepository.addBenefit(companyId, benefitData);
  }

  async getBenefits(companyId, pagination = {}) {
    await this.verifyCompanyExists(companyId);
    return await this.companyRepository.findBenefitsByCompanyId(companyId, pagination);
  }

  async updateBenefit(companyId, userId, benefitId, updateData) {
    await this.verifyCompanyOwnership(companyId, userId);

    const benefit = await this.companyRepository.findBenefitById(benefitId);
    if (!benefit || benefit.companyId !== companyId) {
      throw new Error('Benefit not found for this company');
    }

    return await this.companyRepository.updateBenefit(benefitId, updateData);
  }

  async deleteBenefit(companyId, userId, benefitId) {
    await this.verifyCompanyOwnership(companyId, userId);

    const benefit = await this.companyRepository.findBenefitById(benefitId);
    if (!benefit || benefit.companyId !== companyId) {
      throw new Error('Benefit not found for this company');
    }

    return await this.companyRepository.deleteBenefit(benefitId);
  }

  // Member management
  async addMember(companyId, userId, userRoles = [], memberData) {
    if (!userRoles.includes('admin') && !userRoles.includes('company_admin')) {
      await this.verifyCompanyOwnerOrAdmin(companyId, userId);
    }

    if (memberData.role === 'owner') {
      throw new Error('Cannot assign owner role through member management');
    }

    const existingMember = await this.companyRepository.findMemberByCompanyAndUser(
      companyId,
      memberData.userId,
    );
    if (existingMember) {
      throw new Error('User is already a member of this company');
    }

    return await this.companyRepository.addMember(companyId, memberData);
  }

  async getMembers(companyId, pagination = {}) {
    await this.verifyCompanyExists(companyId);
    return await this.companyRepository.findMembersByCompanyId(companyId, pagination);
  }

  async updateMember(companyId, userId, memberId, updateData) {
    await this.verifyCompanyOwnerOrAdmin(companyId, userId);

    const member = await this.companyRepository.findMemberById(memberId);
    if (!member || member.companyId !== companyId) {
      throw new Error('Member not found for this company');
    }

    if (member.role === 'owner') {
      throw new Error('Cannot change the role of the company owner');
    }

    if (updateData.role === 'owner') {
      throw new Error('Cannot assign owner role through member management');
    }

    return await this.companyRepository.updateMember(memberId, updateData);
  }

  async removeMember(companyId, userId, memberId) {
    await this.verifyCompanyOwnerOrAdmin(companyId, userId);

    const member = await this.companyRepository.findMemberById(memberId);
    if (!member || member.companyId !== companyId) {
      throw new Error('Member not found for this company');
    }

    if (member.role === 'owner') {
      throw new Error('Cannot remove the company owner');
    }

    return await this.companyRepository.deleteMember(memberId);
  }

  // Verification workflow
  async submitForVerification(companyId, userId, files) {
    await this.verifyCompanyOwnership(companyId, userId);

    const pendingSubmission = await this.companyRepository.findPendingVerificationByCompanyId(
      companyId,
    );
    if (pendingSubmission) {
      throw new Error('There is already a pending verification submission');
    }

    // Create submission
    const submission = await this.companyRepository.createVerificationSubmission({
      companyId,
      status: 'pending',
    });

    // Upload each document to Supabase and create record
    const documentPromises = files.map(async ({ file, documentType }) => {
      // Upload to Supabase: CompanyDocs/{companyId}/{timestamp}-{filename}
      const uploadResult = await supabaseStorage.uploadCompanyDoc(
        companyId,
        file.buffer,
        file.originalname,
      );

      // Create record in DB with filePath (not public URL)
      return this.companyRepository.createVerificationDocument({
        submissionId: submission.id,
        documentType,
        fileUrl: uploadResult.filePath,
        status: 'pending',
      });
    });

    const documents = await Promise.all(documentPromises);

    logger.info(`Company verification submitted: ${companyId}`, { companyId, userId });

    const submissionWithDocuments = await this.companyRepository.findVerificationSubmissionById(submission.id);
    
    // Generate signed URLs for all documents
    if (submissionWithDocuments.documents && submissionWithDocuments.documents.length > 0) {
      const signedUrls = await supabaseStorage.getCompanyDocs(companyId, submissionWithDocuments.documents);
      
      // Replace fileUrl with signed URLs in the response
      submissionWithDocuments.documents = submissionWithDocuments.documents.map((doc, index) => ({
        ...doc,
        fileUrl: signedUrls[index]?.file || doc.fileUrl,
      }));
    }

    return submissionWithDocuments;
  }

  async getVerificationStatus(companyId, userId) {
    await this.verifyCompanyOwnership(companyId, userId);
    const submission = await this.companyRepository.findLatestVerificationByCompanyId(companyId);
    
    // Generate signed URLs for documents if present
    if (submission && submission.documents && submission.documents.length > 0) {
      const signedUrls = await supabaseStorage.getCompanyDocs(companyId, submission.documents);
      
      submission.documents = submission.documents.map((doc, index) => ({
        ...doc,
        fileUrl: signedUrls[index]?.file || doc.fileUrl,
      }));
    }
    
    return submission;
  }

  async getCompanyFiles(companyId, userId) {
    await this.verifyCompanyOwnership(companyId, userId);

    // Get latest submission
    const submission = await this.companyRepository.findLatestVerificationByCompanyId(companyId);
    if (!submission || !submission.documents) {
      return null;
    }

    // Generate signed URLs for each document
    const companyFiles = await supabaseStorage.getCompanyDocs(companyId, submission.documents);

    return {
      ...submission,
      company_files: companyFiles,
    };
  }

  async reviewVerification(submissionId, adminId, status, notes) {
    if (!['approved', 'rejected'].includes(status)) {
      throw new Error('Invalid status. Must be "approved" or "rejected"');
    }

    const submission = await this.companyRepository.findVerificationSubmissionById(submissionId);
    if (!submission) {
      throw new Error('Verification submission not found');
    }

    if (submission.status !== 'pending') {
      throw new Error('This submission has already been reviewed');
    }

    const updatedSubmission = await this.companyRepository.updateVerificationSubmission(submissionId, {
      status,
      reviewedAt: new Date(),
      reviewedBy: adminId,
      notes,
    });

    if (status === 'approved') {
      await this.companyRepository.updateCompany(submission.companyId, {
        isVerified: true,
      });
    }

    // Generate signed URLs for documents if present
    if (updatedSubmission && updatedSubmission.documents && updatedSubmission.documents.length > 0) {
      const signedUrls = await supabaseStorage.getCompanyDocs(
        updatedSubmission.companyId,
        updatedSubmission.documents
      );
      
      updatedSubmission.documents = updatedSubmission.documents.map((doc, index) => ({
        ...doc,
        fileUrl: signedUrls[index]?.file || doc.fileUrl,
      }));
    }

    return updatedSubmission;
  }

  // Helper methods
  async verifyCompanyExists(companyId) {
    const company = await this.companyRepository.findCompanyById(companyId);
    if (!company) {
      throw new Error('Company not found');
    }
    return company;
  }

  async verifyCompanyOwnership(companyId, userId) {
    const company = await this.companyRepository.findCompanyById(companyId);
    if (!company) {
      throw new Error('Company not found');
    }

    if (company.ownerId !== userId) {
      throw new Error('You do not have permission to perform this action');
    }

    return company;
  }

  async verifyCompanyOwnerOrAdmin(companyId, userId) {
    const company = await this.companyRepository.findCompanyById(companyId);
    if (!company) {
      throw new Error('Company not found');
    }

    if (company.ownerId === userId) {
      return company;
    }

    const member = await this.companyRepository.findMemberByCompanyAndUser(companyId, userId);
    if (member && ['admin', 'company_admin'].includes(member.role)) {
      return company;
    }

    throw new Error('You do not have permission to perform this action');
  }
}
