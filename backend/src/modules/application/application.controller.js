import { z } from "zod";
import { parsePagination } from "../../common/utils/paginator.js";
import { ApplicationService } from "./application.service.js";

const applicationService = new ApplicationService();

const applicationStatusEnum = [
  "pending",
  "reviewed",
  "interview",
  "accepted",
  "rejected",
];

const applicationListQueryDto = z.object({
  status: z.enum(applicationStatusEnum).optional(),
  vacancyId: z
    .string({ invalid_type_error: "vacancyId must be a string" })
    .uuid("vacancyId must be a valid UUID")
    .optional(),
  companyId: z
    .string({ invalid_type_error: "companyId must be a string" })
    .uuid("companyId must be a valid UUID")
    .optional(),
  userId: z
    .string({ invalid_type_error: "userId must be a string" })
    .uuid("userId must be a valid UUID")
    .optional(),
});

export class ApplicationController {
  // Applications
  async apply(req, res, next) {
    try {
      const userId = req.user.id;
      const userRoles = req.user.roles || [];
      const application = await applicationService.applyToJob(
        userId,
        userRoles,
        req.body,
      );

      res.status(201).json({
        data: application,
        message: "Application submitted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const userId = req.user.id;
      const userRoles = req.user.roles || [];
      const pagination = parsePagination(req);
      const filters = applicationListQueryDto.parse(req.query);

      const result = await applicationService.getApplications(
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

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];

      const application = await applicationService.getApplicationById(
        id,
        userId,
        userRoles,
      );

      res.status(200).json({ data: application });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];

      const application = await applicationService.updateApplication(
        id,
        userId,
        userRoles,
        req.body,
      );

      res.status(200).json({
        data: application,
        message: "Application updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Status history
  async changeStatus(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];

      const application = await applicationService.changeStatus(
        id,
        userId,
        userRoles,
        req.body,
      );

      res.status(200).json({
        data: application,
        message: "Application status updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async scheduleInterview(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];

      const application = await applicationService.scheduleInterview(
        id,
        userId,
        userRoles,
        req.body,
      );

      res.status(200).json({
        data: application,
        message: "Interview scheduled successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getApplicantsByVacancy(req, res, next) {
    try {
      const { vacancyId } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];
      const pagination = parsePagination(req);
      const { status } = req.query;

      const result = await applicationService.getApplicantsByVacancy(
        vacancyId,
        userId,
        userRoles,
        { status },
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

  async getHistory(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];
      const pagination = parsePagination(req);

      const result = await applicationService.getStatusHistory(
        id,
        userId,
        userRoles,
        pagination,
      );

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

  // Comments
  async addComment(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];

      const comment = await applicationService.addComment(
        id,
        userId,
        userRoles,
        req.body,
      );

      res.status(201).json({
        data: comment,
        message: "Application comment added successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getComments(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];
      const pagination = parsePagination(req);

      const result = await applicationService.getComments(
        id,
        userId,
        userRoles,
        pagination,
      );

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

  async getComment(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];

      const comment = await applicationService.getCommentById(
        id,
        userId,
        userRoles,
      );

      res.status(200).json({ data: comment });
    } catch (error) {
      next(error);
    }
  }

  async updateComment(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];

      const comment = await applicationService.updateComment(
        id,
        userId,
        userRoles,
        req.body,
      );

      res.status(200).json({
        data: comment,
        message: "Application comment updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];

      await applicationService.deleteComment(id, userId, userRoles);

      res.status(200).json({
        message: "Application comment deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Saved jobs
  async saveJob(req, res, next) {
    try {
      const userId = req.user.id;
      const userRoles = req.user.roles || [];

      const savedJob = await applicationService.saveJob(
        userId,
        userRoles,
        req.body,
      );

      res.status(201).json({
        data: savedJob,
        message: "Job saved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getSavedJobs(req, res, next) {
    try {
      const userId = req.user.id;
      const userRoles = req.user.roles || [];
      const pagination = parsePagination(req);

      const result = await applicationService.getSavedJobs(
        userId,
        userRoles,
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

  async deleteSavedJob(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];

      await applicationService.deleteSavedJob(id, userId, userRoles);

      res.status(200).json({
        message: "Saved job deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Follows
  async followCompany(req, res, next) {
    try {
      const userId = req.user.id;
      const userRoles = req.user.roles || [];

      const follow = await applicationService.followCompany(
        userId,
        userRoles,
        req.body,
      );

      res.status(201).json({
        data: follow,
        message: "Company followed successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getFollows(req, res, next) {
    try {
      const userId = req.user.id;
      const userRoles = req.user.roles || [];
      const pagination = parsePagination(req);

      const result = await applicationService.getFollows(
        userId,
        userRoles,
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

  async unfollowCompany(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];

      await applicationService.unfollowCompany(id, userId, userRoles);

      res.status(200).json({
        message: "Company unfollowed successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
