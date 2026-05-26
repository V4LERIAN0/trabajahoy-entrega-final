import { parsePagination } from "../../common/utils/paginator.js";
import { searchVacancyDto } from "./dtos/search-vacancy.dto.js";
import { VacancyService } from "./vacancy.service.js";

const vacancyService = new VacancyService();

export class VacancyController {
  // Public vacancy endpoints
  async getAll(req, res, next) {
    try {
      const pagination = parsePagination(req);
      const filters = searchVacancyDto.parse(req.query);

      const result = await vacancyService.getPublishedVacancies(
        filters,
        pagination,
      );

      res.status(200).json({
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const vacancy = await vacancyService.getPublishedVacancyById(id);

      res.status(200).json({ data: vacancy });
    } catch (error) {
      next(error);
    }
  }

  // Management vacancy endpoints
  async getAllManagement(req, res, next) {
    try {
      const userId = req.user.id;
      const userRoles = req.user.roles || [];
      const pagination = parsePagination(req);
      const filters = searchVacancyDto.parse(req.query);

      const result = await vacancyService.getVacanciesForManagement(
        userId,
        userRoles,
        filters,
        pagination,
      );

      res.status(200).json({
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getByIdManagement(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];

      const vacancy = await vacancyService.getVacancyById(
        id,
        userId,
        userRoles,
      );

      res.status(200).json({ data: vacancy });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const userId = req.user.id;
      const userRoles = req.user.roles || [];
      const vacancy = await vacancyService.createVacancy(
        userId,
        userRoles,
        req.body,
      );

      res.status(201).json({
        data: vacancy,
        message: "Vacancy created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];

      const vacancy = await vacancyService.updateVacancy(
        id,
        userId,
        userRoles,
        req.body,
      );

      res.status(200).json({
        data: vacancy,
        message: "Vacancy updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];

      await vacancyService.deleteVacancy(id, userId, userRoles);

      res.status(200).json({
        message: "Vacancy deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async close(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];

      const vacancy = await vacancyService.closeVacancy(id, userId, userRoles);

      res.status(200).json({
        data: vacancy,
        message: "Vacancy closed successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async archive(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];

      const vacancy = await vacancyService.archiveVacancy(
        id,
        userId,
        userRoles,
      );

      res.status(200).json({
        data: vacancy,
        message: "Vacancy archived successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Category endpoints
  async getCategories(req, res, next) {
    try {
      const pagination = parsePagination(req);
      const filters = searchVacancyDto.parse(req.query);
      const result = await vacancyService.getCategories(pagination, filters);

      res.status(200).json({
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await vacancyService.getCategoryById(id);

      res.status(200).json({ data: category });
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req, res, next) {
    try {
      const category = await vacancyService.createCategory(req.body);

      res.status(201).json({
        data: category,
        message: "Job category created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const category = await vacancyService.updateCategory(id, req.body);

      res.status(200).json({
        data: category,
        message: "Job category updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      await vacancyService.deleteCategory(id);

      res.status(200).json({
        message: "Job category deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Skill endpoints
  async addSkill(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];

      const skill = await vacancyService.addSkill(
        id,
        userId,
        userRoles,
        req.body,
      );

      res.status(201).json({
        data: skill,
        message: "Vacancy skill added successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getSkill(req, res, next) {
    try {
      const { id } = req.params;
      const skill = await vacancyService.getSkillById(id);

      res.status(200).json({ data: skill });
    } catch (error) {
      next(error);
    }
  }

  async getSkills(req, res, next) {
    try {
      const { id } = req.params;
      const pagination = parsePagination(req);
      const result = await vacancyService.getSkills(id, pagination);

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
      const userRoles = req.user.roles || [];

      const skill = await vacancyService.updateSkill(
        id,
        userId,
        userRoles,
        req.body,
      );

      res.status(200).json({
        data: skill,
        message: "Vacancy skill updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteSkill(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];

      await vacancyService.deleteSkill(id, userId, userRoles);

      res.status(200).json({
        message: "Vacancy skill deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Benefit endpoints
  async addBenefit(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];

      const benefit = await vacancyService.addBenefit(
        id,
        userId,
        userRoles,
        req.body,
      );

      res.status(201).json({
        data: benefit,
        message: "Vacancy benefit added successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getBenefit(req, res, next) {
    try {
      const { id } = req.params;
      const benefit = await vacancyService.getBenefitById(id);

      res.status(200).json({ data: benefit });
    } catch (error) {
      next(error);
    }
  }

  async getBenefits(req, res, next) {
    try {
      const { id } = req.params;
      const pagination = parsePagination(req);
      const result = await vacancyService.getBenefits(id, pagination);

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

  async updateBenefit(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];

      const benefit = await vacancyService.updateBenefit(
        id,
        userId,
        userRoles,
        req.body,
      );

      res.status(200).json({
        data: benefit,
        message: "Vacancy benefit updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBenefit(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];

      await vacancyService.deleteBenefit(id, userId, userRoles);

      res.status(200).json({
        message: "Vacancy benefit deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
