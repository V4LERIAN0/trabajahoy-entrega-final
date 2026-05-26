import { VacancyRepository } from "./vacancy.repository.js";

const ALLOWED_STATUS_TRANSITIONS = {
  draft: ["published"],
  published: ["closed"],
  closed: ["published", "archived"],
  archived: [],
};

export class VacancyService {
  constructor() {
    this.vacancyRepository = new VacancyRepository();
  }

  createHttpError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
  }

  normalizeSlug(slug) {
    return slug.trim().toLowerCase();
  }

  isValidDateString(dateString) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return false;
    }

    const date = new Date(`${dateString}T00:00:00.000Z`);
    return (
      !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) === dateString
    );
  }

  validateVacancyBusinessRules(data, currentVacancy = null) {
    const salaryMin = data.salaryMin ?? currentVacancy?.salaryMin ?? null;
    const salaryMax = data.salaryMax ?? currentVacancy?.salaryMax ?? null;

    if (
      salaryMin !== null &&
      salaryMax !== null &&
      Number(salaryMin) > Number(salaryMax)
    ) {
      throw this.createHttpError(
        400,
        "Salary min cannot be greater than salary max",
      );
    }

    const openings = data.openings ?? currentVacancy?.openings;
    if (openings !== undefined && openings !== null && openings < 1) {
      throw this.createHttpError(400, "Openings must be at least 1");
    }

    const applicationDeadline = data.applicationDeadline;
    if (
      applicationDeadline !== undefined &&
      applicationDeadline !== null &&
      !this.isValidDateString(applicationDeadline)
    ) {
      throw this.createHttpError(
        400,
        "Application deadline must be a valid date in YYYY-MM-DD format",
      );
    }
  }

  ensureValidStatusTransition(currentStatus, nextStatus) {
    if (currentStatus === nextStatus) {
      return;
    }

    const allowedNext = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
    if (!allowedNext.includes(nextStatus)) {
      throw this.createHttpError(
        409,
        `Invalid status transition from ${currentStatus} to ${nextStatus}`,
      );
    }
  }

  // Vacancy methods
  async getPublishedVacancies(filters = {}, pagination = {}) {
    return await this.vacancyRepository.findVacancies(filters, pagination, {
      onlyPublished: true,
    });
  }

  async getVacanciesForManagement(
    userId,
    userRoles = [],
    filters = {},
    pagination = {},
  ) {
    const scopedFilters = { ...filters };

    if (!userRoles.includes("admin")) {
      const companyIds =
        await this.vacancyRepository.findManagedCompanyIds(userId);
      if (companyIds.length === 0) {
        return {
          data: [],
          total: 0,
          page: pagination.page || 1,
          limit: pagination.limit || 10,
          totalPages: 0,
        };
      }

      if (
        scopedFilters.companyId &&
        !companyIds.includes(scopedFilters.companyId)
      ) {
        throw this.createHttpError(
          403,
          "You do not have permission to access this company vacancies",
        );
      }

      scopedFilters.companyIds = companyIds;
    }

    return await this.vacancyRepository.findVacancies(
      scopedFilters,
      pagination,
      {
        onlyPublished: false,
      },
    );
  }

  async getPublishedVacancyById(id) {
    const vacancy = await this.vacancyRepository.findPublishedVacancyById(id);
    if (!vacancy) {
      throw this.createHttpError(404, "Vacancy not found");
    }
    return vacancy;
  }

  async getVacancyById(id, userId, userRoles = []) {
    const vacancy = await this.vacancyRepository.findVacancyById(id);
    if (!vacancy) {
      throw this.createHttpError(404, "Vacancy not found");
    }

    if (vacancy.status !== "published") {
      await this.verifyCompanyPermission(vacancy.companyId, userId, userRoles);
    }

    return vacancy;
  }

  async createVacancy(userId, userRoles = [], data) {
    await this.verifyCompanyPermission(data.companyId, userId, userRoles);

    const payload = {
      ...data,
      status: data.status || "draft",
    };

    this.validateVacancyBusinessRules(payload);

    if (!["draft", "published"].includes(payload.status)) {
      throw this.createHttpError(
        409,
        "Vacancy can only be created with draft or published status",
      );
    }

    if (payload.status !== "published" && payload.publishedAt) {
      throw this.createHttpError(
        400,
        "publishedAt can only be set when status is published",
      );
    }

    if (payload.status === "published" && !payload.publishedAt) {
      payload.publishedAt = new Date();
    }

    return await this.vacancyRepository.createVacancy(payload);
  }

  async updateVacancy(vacancyId, userId, userRoles = [], data) {
    const vacancy = await this.verifyVacancyPermission(
      vacancyId,
      userId,
      userRoles,
    );

    const payload = { ...data };

    this.validateVacancyBusinessRules(payload, vacancy);

    if (payload.status !== undefined) {
      this.ensureValidStatusTransition(vacancy.status, payload.status);

      if (
        payload.status === "published" &&
        !vacancy.publishedAt &&
        !payload.publishedAt
      ) {
        payload.publishedAt = new Date();
      }

      if (
        payload.status !== "published" &&
        payload.publishedAt !== undefined &&
        payload.publishedAt !== null
      ) {
        throw this.createHttpError(
          400,
          "publishedAt can only be set when status is published",
        );
      }
    } else if (
      payload.publishedAt !== undefined &&
      payload.publishedAt !== null &&
      vacancy.status !== "published"
    ) {
      throw this.createHttpError(
        400,
        "publishedAt can only be set when status is published",
      );
    }

    return await this.vacancyRepository.updateVacancy(vacancyId, payload);
  }

  async deleteVacancy(vacancyId, userId, userRoles = []) {
    await this.verifyVacancyPermission(vacancyId, userId, userRoles);
    return await this.vacancyRepository.deleteVacancy(vacancyId);
  }

  async closeVacancy(vacancyId, userId, userRoles = []) {
    const vacancy = await this.verifyVacancyPermission(
      vacancyId,
      userId,
      userRoles,
    );
    this.ensureValidStatusTransition(vacancy.status, "closed");

    return await this.vacancyRepository.updateVacancy(vacancyId, {
      status: "closed",
    });
  }

  async archiveVacancy(vacancyId, userId, userRoles = []) {
    const vacancy = await this.verifyVacancyPermission(
      vacancyId,
      userId,
      userRoles,
    );
    this.ensureValidStatusTransition(vacancy.status, "archived");

    return await this.vacancyRepository.updateVacancy(vacancyId, {
      status: "archived",
    });
  }

  // Category methods
  async getCategories(pagination = {}, filters = {}) {
    return await this.vacancyRepository.findCategories({
      ...pagination,
      q: filters.q,
    });
  }

  async getCategoryById(id) {
    const category = await this.vacancyRepository.findCategoryById(id);
    if (!category) {
      throw this.createHttpError(404, "Job category not found");
    }
    return category;
  }

  async createCategory(data) {
    const normalizedSlug = this.normalizeSlug(data.slug);

    const existingCategory =
      await this.vacancyRepository.findCategoryBySlug(normalizedSlug);
    if (existingCategory) {
      throw this.createHttpError(
        409,
        "A category with this slug already exists",
      );
    }

    if (data.parentId) {
      const parentCategory = await this.vacancyRepository.findCategoryById(
        data.parentId,
      );
      if (!parentCategory) {
        throw this.createHttpError(404, "Parent category not found");
      }
    }

    return await this.vacancyRepository.createCategory({
      ...data,
      slug: normalizedSlug,
    });
  }

  async updateCategory(categoryId, data) {
    const category = await this.vacancyRepository.findCategoryById(categoryId);
    if (!category) {
      throw this.createHttpError(404, "Job category not found");
    }

    if (data.parentId === categoryId) {
      throw this.createHttpError(409, "Category cannot be its own parent");
    }

    if (data.parentId) {
      const parentCategory = await this.vacancyRepository.findCategoryById(
        data.parentId,
      );
      if (!parentCategory) {
        throw this.createHttpError(404, "Parent category not found");
      }
    }

    const payload = { ...data };
    if (payload.slug !== undefined) {
      payload.slug = this.normalizeSlug(payload.slug);
      const existingCategory = await this.vacancyRepository.findCategoryBySlug(
        payload.slug,
      );
      if (existingCategory && existingCategory.id !== categoryId) {
        throw this.createHttpError(
          409,
          "A category with this slug already exists",
        );
      }
    }

    return await this.vacancyRepository.updateCategory(categoryId, payload);
  }

  async deleteCategory(categoryId) {
    const category = await this.vacancyRepository.findCategoryById(categoryId);
    if (!category) {
      throw this.createHttpError(404, "Job category not found");
    }

    if (category.children?.length) {
      throw this.createHttpError(
        409,
        "Cannot delete a category with child categories",
      );
    }

    return await this.vacancyRepository.deleteCategory(categoryId);
  }

  // Skill methods
  async addSkill(vacancyId, userId, userRoles = [], data) {
    await this.verifyVacancyPermission(vacancyId, userId, userRoles);

    const duplicateSkill =
      await this.vacancyRepository.findSkillByVacancyAndName(
        vacancyId,
        data.skillName,
      );
    if (duplicateSkill) {
      throw this.createHttpError(
        409,
        "This skill already exists for the vacancy",
      );
    }

    return await this.vacancyRepository.addSkill(vacancyId, {
      ...data,
      skillName: data.skillName.trim(),
    });
  }

  async getSkillById(id) {
    const skill = await this.vacancyRepository.findSkillById(id);
    if (!skill) {
      throw this.createHttpError(404, "Vacancy skill not found");
    }

    const vacancy = await this.vacancyRepository.findVacancyById(
      skill.vacancyId,
    );
    if (!vacancy || vacancy.status !== "published") {
      throw this.createHttpError(404, "Vacancy skill not found");
    }

    return skill;
  }

  async getSkills(vacancyId, pagination = {}) {
    const vacancy =
      await this.vacancyRepository.findPublishedVacancyById(vacancyId);
    if (!vacancy) {
      throw this.createHttpError(404, "Vacancy not found");
    }
    return await this.vacancyRepository.findSkillsByVacancyId(
      vacancyId,
      pagination,
    );
  }

  async updateSkill(skillId, userId, userRoles = [], data) {
    const skill = await this.vacancyRepository.findSkillById(skillId);
    if (!skill) {
      throw this.createHttpError(404, "Vacancy skill not found");
    }

    await this.verifyVacancyPermission(skill.vacancyId, userId, userRoles);

    const payload = { ...data };
    if (payload.skillName) {
      const duplicateSkill =
        await this.vacancyRepository.findSkillByVacancyAndName(
          skill.vacancyId,
          payload.skillName,
        );

      if (duplicateSkill && duplicateSkill.id !== skillId) {
        throw this.createHttpError(
          409,
          "This skill already exists for the vacancy",
        );
      }

      payload.skillName = payload.skillName.trim();
    }

    return await this.vacancyRepository.updateSkill(skillId, payload);
  }

  async deleteSkill(skillId, userId, userRoles = []) {
    const skill = await this.vacancyRepository.findSkillById(skillId);
    if (!skill) {
      throw this.createHttpError(404, "Vacancy skill not found");
    }

    await this.verifyVacancyPermission(skill.vacancyId, userId, userRoles);
    return await this.vacancyRepository.deleteSkill(skillId);
  }

  // Benefit methods
  async addBenefit(vacancyId, userId, userRoles = [], data) {
    await this.verifyVacancyPermission(vacancyId, userId, userRoles);

    const duplicateBenefit =
      await this.vacancyRepository.findBenefitByVacancyAndName(
        vacancyId,
        data.benefitName,
      );
    if (duplicateBenefit) {
      throw this.createHttpError(
        409,
        "This benefit already exists for the vacancy",
      );
    }

    return await this.vacancyRepository.addBenefit(vacancyId, {
      ...data,
      benefitName: data.benefitName.trim(),
    });
  }

  async getBenefitById(id) {
    const benefit = await this.vacancyRepository.findBenefitById(id);
    if (!benefit) {
      throw this.createHttpError(404, "Vacancy benefit not found");
    }

    const vacancy = await this.vacancyRepository.findVacancyById(
      benefit.vacancyId,
    );
    if (!vacancy || vacancy.status !== "published") {
      throw this.createHttpError(404, "Vacancy benefit not found");
    }

    return benefit;
  }

  async getBenefits(vacancyId, pagination = {}) {
    const vacancy =
      await this.vacancyRepository.findPublishedVacancyById(vacancyId);
    if (!vacancy) {
      throw this.createHttpError(404, "Vacancy not found");
    }
    return await this.vacancyRepository.findBenefitsByVacancyId(
      vacancyId,
      pagination,
    );
  }

  async updateBenefit(benefitId, userId, userRoles = [], data) {
    const benefit = await this.vacancyRepository.findBenefitById(benefitId);
    if (!benefit) {
      throw this.createHttpError(404, "Vacancy benefit not found");
    }

    await this.verifyVacancyPermission(benefit.vacancyId, userId, userRoles);

    const payload = { ...data };
    if (payload.benefitName) {
      const duplicateBenefit =
        await this.vacancyRepository.findBenefitByVacancyAndName(
          benefit.vacancyId,
          payload.benefitName,
        );

      if (duplicateBenefit && duplicateBenefit.id !== benefitId) {
        throw this.createHttpError(
          409,
          "This benefit already exists for the vacancy",
        );
      }

      payload.benefitName = payload.benefitName.trim();
    }

    return await this.vacancyRepository.updateBenefit(benefitId, payload);
  }

  async deleteBenefit(benefitId, userId, userRoles = []) {
    const benefit = await this.vacancyRepository.findBenefitById(benefitId);
    if (!benefit) {
      throw this.createHttpError(404, "Vacancy benefit not found");
    }

    await this.verifyVacancyPermission(benefit.vacancyId, userId, userRoles);
    return await this.vacancyRepository.deleteBenefit(benefitId);
  }

  // Permission helpers
  async verifyVacancyPermission(vacancyId, userId, userRoles = []) {
    const vacancy = await this.vacancyRepository.findVacancyById(vacancyId);
    if (!vacancy) {
      throw this.createHttpError(404, "Vacancy not found");
    }

    await this.verifyCompanyPermission(vacancy.companyId, userId, userRoles);
    return vacancy;
  }

  async verifyCompanyPermission(companyId, userId, userRoles = []) {
    const company = await this.vacancyRepository.findCompanyById(companyId);
    if (!company) {
      throw this.createHttpError(404, "Company not found");
    }

    if (userRoles.includes("admin")) {
      return company;
    }

    if (company.ownerId === userId) {
      return company;
    }

    const member = await this.vacancyRepository.findCompanyMember(
      companyId,
      userId,
    );
    if (
      !member
      || !["owner", "admin", "company_admin", "recruiter"].includes(member.role)
    ) {
      throw this.createHttpError(
        403,
        "You do not have permission to perform this action",
      );
    }

    return company;
  }
}
