import { BaseRepository } from "../../common/repositories/base.repository.js";
import { AppDataSource } from "../../database/data-source.js";
import { Company } from "../company/models/company.model.js";
import { CompanyMember } from "../company/models/company-member.model.js";
import { JobCategory } from "./models/job-category.model.js";
import { Vacancy } from "./models/vacancy.model.js";
import { VacancySkill } from "./models/vacancy-skill.model.js";
import { VacancyBenefit } from "./models/vacancy-benefit.model.js";

export class VacancyRepository extends BaseRepository {
  constructor() {
    super(Vacancy);
    this.categoryRepository = AppDataSource.getRepository(JobCategory);
    this.skillRepository = AppDataSource.getRepository(VacancySkill);
    this.benefitRepository = AppDataSource.getRepository(VacancyBenefit);
    this.companyRepository = AppDataSource.getRepository(Company);
    this.companyMemberRepository = AppDataSource.getRepository(CompanyMember);
  }

  // Vacancy methods
  async findVacancyById(id) {
    return await this.repository.findOne({
      where: { id },
      relations: ["company", "category", "skills", "benefits"],
    });
  }

  async findPublishedVacancyById(id) {
    return await this.repository.findOne({
      where: { id, status: "published" },
      relations: ["company", "category", "skills", "benefits"],
    });
  }

  async findVacancies(
    filters = {},
    { page = 1, limit = 10 } = {},
    { onlyPublished = false } = {},
  ) {
    const queryBuilder = this.repository
      .createQueryBuilder("vacancy")
      .leftJoinAndSelect("vacancy.company", "company")
      .leftJoinAndSelect("vacancy.category", "category")
      .orderBy("vacancy.createdAt", "DESC");

    if (filters.q) {
      queryBuilder.andWhere(
        `(
					vacancy.title ILIKE :q OR
					vacancy.description ILIKE :q OR
					vacancy.requirements ILIKE :q
				)`,
        { q: `%${filters.q}%` },
      );
    }

    if (filters.companyId) {
      queryBuilder.andWhere("vacancy.companyId = :companyId", {
        companyId: filters.companyId,
      });
    }

    if (filters.companyIds?.length) {
      queryBuilder.andWhere("vacancy.companyId IN (:...companyIds)", {
        companyIds: filters.companyIds,
      });
    }

    if (filters.categoryId) {
      queryBuilder.andWhere("vacancy.categoryId = :categoryId", {
        categoryId: filters.categoryId,
      });
    }

    if (onlyPublished) {
      queryBuilder.andWhere("vacancy.status = :status", {
        status: "published",
      });
    } else if (filters.status) {
      queryBuilder.andWhere("vacancy.status = :status", {
        status: filters.status,
      });
    }

    if (filters.type) {
      queryBuilder.andWhere("vacancy.type = :type", { type: filters.type });
    }

    if (filters.modality) {
      queryBuilder.andWhere("vacancy.modality = :modality", {
        modality: filters.modality,
      });
    }

    if (filters.level) {
      queryBuilder.andWhere("vacancy.level = :level", { level: filters.level });
    }

    if (filters.country) {
      queryBuilder.andWhere("vacancy.country ILIKE :country", {
        country: `%${filters.country}%`,
      });
    }

    if (filters.city) {
      queryBuilder.andWhere("vacancy.city ILIKE :city", {
        city: `%${filters.city}%`,
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

  async createVacancy(data) {
    const vacancy = this.repository.create(data);
    const savedVacancy = await this.repository.save(vacancy);
    return await this.findVacancyById(savedVacancy.id);
  }

  async updateVacancy(id, data) {
    await this.repository.update(id, data);
    return await this.findVacancyById(id);
  }

  async deleteVacancy(id) {
    return await this.repository.delete(id);
  }

  // Company permission helpers
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
      .filter((member) =>
        ["owner", "admin", "company_admin", "recruiter"].includes(member.role)
      )
      .map((member) => member.companyId);

    return [
      ...new Set([
        ...ownedCompanies.map((company) => company.id),
        ...memberCompanyIds,
      ]),
    ];
  }

  // Category methods
  async findCategories({ page = 1, limit = 10, q } = {}) {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder("category")
      .leftJoinAndSelect("category.parent", "parent")
      .orderBy("category.name", "ASC");

    if (q) {
      queryBuilder.andWhere(
        "(category.name ILIKE :q OR category.slug ILIKE :q OR category.description ILIKE :q)",
        { q: `%${q}%` },
      );
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

  async findCategoryById(id) {
    return await this.categoryRepository.findOne({
      where: { id },
      relations: ["parent", "children"],
    });
  }

  async findCategoryBySlug(slug) {
    return await this.categoryRepository
      .createQueryBuilder("category")
      .where("LOWER(category.slug) = LOWER(:slug)", { slug })
      .getOne();
  }

  async createCategory(data) {
    const category = this.categoryRepository.create(data);
    return await this.categoryRepository.save(category);
  }

  async updateCategory(id, data) {
    await this.categoryRepository.update(id, data);
    return await this.findCategoryById(id);
  }

  async deleteCategory(id) {
    return await this.categoryRepository.delete(id);
  }

  // Skill methods
  async addSkill(vacancyId, data) {
    const skill = this.skillRepository.create({
      ...data,
      vacancyId,
    });
    return await this.skillRepository.save(skill);
  }

  async findSkillById(id) {
    return await this.skillRepository.findOne({
      where: { id },
      relations: ["vacancy"],
    });
  }

  async findSkillByVacancyAndName(vacancyId, skillName) {
    return await this.skillRepository
      .createQueryBuilder("skill")
      .where("skill.vacancyId = :vacancyId", { vacancyId })
      .andWhere("LOWER(skill.skillName) = LOWER(:skillName)", { skillName })
      .getOne();
  }

  async findSkillsByVacancyId(vacancyId, { page, limit } = {}) {
    const queryBuilder = this.skillRepository
      .createQueryBuilder("skill")
      .where("skill.vacancyId = :vacancyId", { vacancyId })
      .orderBy("skill.skillName", "ASC");

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

  // Benefit methods
  async addBenefit(vacancyId, data) {
    const benefit = this.benefitRepository.create({
      ...data,
      vacancyId,
    });
    return await this.benefitRepository.save(benefit);
  }

  async findBenefitById(id) {
    return await this.benefitRepository.findOne({
      where: { id },
      relations: ["vacancy"],
    });
  }

  async findBenefitByVacancyAndName(vacancyId, benefitName) {
    return await this.benefitRepository
      .createQueryBuilder("benefit")
      .where("benefit.vacancyId = :vacancyId", { vacancyId })
      .andWhere("LOWER(benefit.benefitName) = LOWER(:benefitName)", {
        benefitName,
      })
      .getOne();
  }

  async findBenefitsByVacancyId(vacancyId, { page, limit } = {}) {
    const queryBuilder = this.benefitRepository
      .createQueryBuilder("benefit")
      .where("benefit.vacancyId = :vacancyId", { vacancyId })
      .orderBy("benefit.benefitName", "ASC");

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
      const [data, total] = await queryBuilder.getManyAndCount();
      return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    return await queryBuilder.getMany();
  }

  async updateBenefit(id, data) {
    await this.benefitRepository.update(id, data);
    return await this.findBenefitById(id);
  }

  async deleteBenefit(id) {
    return await this.benefitRepository.delete(id);
  }
}
