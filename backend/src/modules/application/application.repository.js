import { BaseRepository } from "../../common/repositories/base.repository.js";
import { AppDataSource } from "../../database/data-source.js";
import { Company } from "../company/models/company.model.js";
import { CompanyMember } from "../company/models/company-member.model.js";
import { Vacancy } from "../vacancy/models/vacancy.model.js";
import { ApplicationComment } from "./models/application-comment.model.js";
import { ApplicationStatusHistory } from "./models/application-status-history.model.js";
import { CandidateCompanyFollow } from "./models/candidate-company-follow.model.js";
import { JobApplication } from "./models/job-application.model.js";
import { SavedJob } from "./models/saved-job.model.js";

export class ApplicationRepository extends BaseRepository {
  constructor() {
    super(JobApplication);
    this.statusHistoryRepository = AppDataSource.getRepository(
      ApplicationStatusHistory,
    );
    this.commentRepository = AppDataSource.getRepository(ApplicationComment);
    this.savedJobRepository = AppDataSource.getRepository(SavedJob);
    this.followRepository = AppDataSource.getRepository(CandidateCompanyFollow);
    this.vacancyRepository = AppDataSource.getRepository(Vacancy);
    this.companyRepository = AppDataSource.getRepository(Company);
    this.companyMemberRepository = AppDataSource.getRepository(CompanyMember);
  }

  // Application methods
  async findApplicationById(id) {
    return await this.repository.findOne({
      where: { id },
      relations: ["user", "vacancy", "vacancy.company"],
    });
  }

  async findApplicationWithDetailsById(id) {
    return await this.repository.findOne({
      where: { id },
      relations: [
        "user",
        "user.candidateProfile",
        "user.candidateProfile.cvs",
        "vacancy",
        "vacancy.company",
        "history",
        "history.changedByUser",
        "comments",
        "comments.user",
      ],
    });
  }

  async findApplicationByUserAndVacancy(userId, vacancyId) {
    return await this.repository.findOne({
      where: { userId, vacancyId },
      relations: ["vacancy", "vacancy.company"],
    });
  }

  async findApplicationsForCandidate(
    userId,
    filters = {},
    { page = 1, limit = 10 } = {},
  ) {
    const queryBuilder = this.repository
      .createQueryBuilder("application")
      .leftJoinAndSelect("application.vacancy", "vacancy")
      .leftJoinAndSelect("vacancy.company", "company")
      .where("application.userId = :userId", { userId })
      .orderBy("application.appliedAt", "DESC");

    if (filters.status) {
      queryBuilder.andWhere("application.status = :status", {
        status: filters.status,
      });
    }

    if (filters.vacancyId) {
      queryBuilder.andWhere("application.vacancyId = :vacancyId", {
        vacancyId: filters.vacancyId,
      });
    }

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

  async findApplicationsForManagement(
    companyIds,
    filters = {},
    { page = 1, limit = 10 } = {},
  ) {
    const queryBuilder = this.repository
      .createQueryBuilder("application")
      .leftJoinAndSelect("application.user", "user")
      .leftJoinAndSelect("user.candidateProfile", "candidateProfile")
      .leftJoinAndSelect("application.vacancy", "vacancy")
      .leftJoinAndSelect("vacancy.company", "company")
      .orderBy("application.appliedAt", "DESC");

    if (companyIds && companyIds.length > 0) {
      queryBuilder.where("vacancy.companyId IN (:...companyIds)", { companyIds });
    }

    if (filters.status) {
      queryBuilder.andWhere("application.status = :status", {
        status: filters.status,
      });
    }

    if (filters.vacancyId) {
      queryBuilder.andWhere("application.vacancyId = :vacancyId", {
        vacancyId: filters.vacancyId,
      });
    }

    if (filters.userId) {
      queryBuilder.andWhere("application.userId = :userId", {
        userId: filters.userId,
      });
    }

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

  async findApplications(filters = {}, { page = 1, limit = 10 } = {}) {
    const queryBuilder = this.repository
      .createQueryBuilder("application")
      .leftJoinAndSelect("application.user", "user")
      .leftJoinAndSelect("application.vacancy", "vacancy")
      .leftJoinAndSelect("vacancy.company", "company")
      .orderBy("application.appliedAt", "DESC");

    if (filters.status) {
      queryBuilder.andWhere("application.status = :status", {
        status: filters.status,
      });
    }

    if (filters.vacancyId) {
      queryBuilder.andWhere("application.vacancyId = :vacancyId", {
        vacancyId: filters.vacancyId,
      });
    }

    if (filters.userId) {
      queryBuilder.andWhere("application.userId = :userId", {
        userId: filters.userId,
      });
    }

    if (filters.companyId) {
      queryBuilder.andWhere("vacancy.companyId = :companyId", {
        companyId: filters.companyId,
      });
    }

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

  async createApplication(data) {
    const application = this.repository.create(data);
    const saved = await this.repository.save(application);
    return await this.findApplicationById(saved.id);
  }

  async updateApplication(id, data) {
    await this.repository.update(id, data);
    return await this.findApplicationById(id);
  }

  // Vacancy and company helpers
  async findVacancyById(vacancyId) {
    return await this.vacancyRepository.findOne({
      where: { id: vacancyId },
      relations: ["company"],
    });
  }

  async findPublishedVacancyById(vacancyId) {
    return await this.vacancyRepository.findOne({
      where: { id: vacancyId, status: "published" },
      relations: ["company"],
    });
  }

  async findCompanyById(companyId) {
    return await this.companyRepository.findOne({ where: { id: companyId } });
  }

  async findCompanyMember(companyId, userId) {
    return await this.companyMemberRepository.findOne({
      where: { companyId, userId },
    });
  }

  async findManagedCompanyIds(userId) {
    const ownedCompanies = await this.companyRepository.find({
      where: { ownerId: userId },
      select: ["id"],
    });

    const memberships = await this.companyMemberRepository.find({
      where: { userId },
      select: ["companyId", "role"],
    });

    const memberCompanyIds = memberships
      .filter((member) => ["owner", "admin", "company_admin", "recruiter"].includes(member.role))
      .map((member) => member.companyId);

    return [
      ...new Set([
        ...ownedCompanies.map((company) => company.id),
        ...memberCompanyIds,
      ]),
    ];
  }

  // Status history methods
  async addStatusHistory(applicationId, data) {
    const historyEntry = this.statusHistoryRepository.create({
      ...data,
      applicationId,
    });
    return await this.statusHistoryRepository.save(historyEntry);
  }

  async findStatusHistoryByApplicationId(applicationId, { page, limit } = {}) {
    const queryBuilder = this.statusHistoryRepository
      .createQueryBuilder("history")
      .leftJoinAndSelect("history.changedByUser", "changedByUser")
      .where("history.applicationId = :applicationId", { applicationId })
      .orderBy("history.changedAt", "DESC");

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
      const [data, total] = await queryBuilder.getManyAndCount();
      return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    return await queryBuilder.getMany();
  }

  // Comment methods
  async addComment(applicationId, userId, data) {
    const comment = this.commentRepository.create({
      ...data,
      applicationId,
      userId,
    });
    return await this.commentRepository.save(comment);
  }

  async findCommentById(id) {
    return await this.commentRepository.findOne({
      where: { id },
      relations: [
        "user",
        "application",
        "application.vacancy",
        "application.vacancy.company",
      ],
    });
  }

  async findCommentsByApplicationId(applicationId, { page, limit } = {}) {
    const queryBuilder = this.commentRepository
      .createQueryBuilder("comment")
      .leftJoinAndSelect("comment.user", "user")
      .where("comment.applicationId = :applicationId", { applicationId })
      .orderBy("comment.createdAt", "DESC");

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
      const [data, total] = await queryBuilder.getManyAndCount();
      return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    return await queryBuilder.getMany();
  }

  async updateComment(id, data) {
    await this.commentRepository.update(id, data);
    return await this.findCommentById(id);
  }

  async deleteComment(id) {
    return await this.commentRepository.delete(id);
  }

  // Saved jobs methods
  async findSavedJobById(id) {
    return await this.savedJobRepository.findOne({
      where: { id },
      relations: ["vacancy", "vacancy.company"],
    });
  }

  async findSavedJobByUserAndVacancy(userId, vacancyId) {
    return await this.savedJobRepository.findOne({
      where: { userId, vacancyId },
      relations: ["vacancy"],
    });
  }

  async createSavedJob(data) {
    const savedJob = this.savedJobRepository.create(data);
    return await this.savedJobRepository.save(savedJob);
  }

  async findSavedJobsByUser(userId, { page = 1, limit = 10 } = {}) {
    const queryBuilder = this.savedJobRepository
      .createQueryBuilder("savedJob")
      .leftJoinAndSelect("savedJob.vacancy", "vacancy")
      .leftJoinAndSelect("vacancy.company", "company")
      .where("savedJob.userId = :userId", { userId })
      .orderBy("savedJob.savedAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deleteSavedJob(id) {
    return await this.savedJobRepository.delete(id);
  }

  // Follow company methods
  async findFollowById(id) {
    return await this.followRepository.findOne({
      where: { id },
      relations: ["company"],
    });
  }

  async findFollowByUserAndCompany(userId, companyId) {
    return await this.followRepository.findOne({
      where: { userId, companyId },
      relations: ["company"],
    });
  }

  async createFollow(data) {
    const follow = this.followRepository.create(data);
    return await this.followRepository.save(follow);
  }

  async findFollowsByUser(userId, { page = 1, limit = 10 } = {}) {
    const queryBuilder = this.followRepository
      .createQueryBuilder("follow")
      .leftJoinAndSelect("follow.company", "company")
      .where("follow.userId = :userId", { userId })
      .orderBy("follow.followedAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deleteFollow(id) {
    return await this.followRepository.delete(id);
  }
}
