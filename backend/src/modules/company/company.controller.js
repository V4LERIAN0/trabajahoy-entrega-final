import { CompanyService } from "./company.service.js";
import { parsePagination } from "../../common/utils/paginator.js";

const companyService = new CompanyService();

export class CompanyController {
  // Dashboard
  async getDashboard(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];
      const data = await companyService.getDashboard(id, userId, userRoles);
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationsByStatus(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];
      const data = await companyService.getApplicationsByStatus(id, userId, userRoles);
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getRecentApplications(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];
      const limit = parseInt(req.query.limit, 10) || 5;
      const data = await companyService.getRecentApplications(
        id,
        userId,
        userRoles,
        limit,
      );
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  // Company CRUD
  async create(req, res, next) {
    try {
      const userId = req.user.id;
      const companyData = req.body;

      const company = await companyService.createCompany(userId, companyData);

      res.status(201).json({
        data: company,
        message: "Company created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, industry, search } = req.query;

      const result = await companyService.getAllCompanies({
        page: parseInt(page),
        limit: parseInt(limit),
        industry,
        search,
      });

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

      const company = await companyService.getCompanyById(id);

      res.status(200).json({
        data: company,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyCompany(req, res, next) {
    try {
      const userId = req.user.id;

      const company = await companyService.getMyCompany(userId);

      res.status(200).json({
        data: company,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updateData = req.body;

      const company = await companyService.updateCompany(
        id,
        userId,
        updateData,
      );

      res.status(200).json({
        data: company,
        message: "Company updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const company = await companyService.deleteCompany(id, userId);

      res.status(200).json({
        data: company,
        message: "Company deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Location management
  async addLocation(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const locationData = req.body;

      const location = await companyService.addLocation(
        id,
        userId,
        locationData,
      );

      res.status(201).json({
        data: location,
        message: "Location added successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getLocations(req, res, next) {
    try {
      const { id } = req.params;
      const pagination = parsePagination(req);
      const result = await companyService.getLocations(id, pagination);

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

  async updateLocation(req, res, next) {
    try {
      const { id, locId } = req.params;
      const userId = req.user.id;
      const updateData = req.body;

      const location = await companyService.updateLocation(
        id,
        userId,
        locId,
        updateData,
      );

      res.status(200).json({
        data: location,
        message: "Location updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteLocation(req, res, next) {
    try {
      const { id, locId } = req.params;
      const userId = req.user.id;

      await companyService.deleteLocation(id, userId, locId);

      res.status(200).json({
        message: "Location deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Benefit management
  async addBenefit(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const benefitData = req.body;

      const benefit = await companyService.addBenefit(id, userId, benefitData);

      res.status(201).json({
        data: benefit,
        message: "Benefit added successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getBenefits(req, res, next) {
    try {
      const { id } = req.params;
      const pagination = parsePagination(req);
      const result = await companyService.getBenefits(id, pagination);

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
      const { id, benId } = req.params;
      const userId = req.user.id;
      const updateData = req.body;

      const benefit = await companyService.updateBenefit(
        id,
        userId,
        benId,
        updateData,
      );

      res.status(200).json({
        data: benefit,
        message: "Benefit updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBenefit(req, res, next) {
    try {
      const { id, benId } = req.params;
      const userId = req.user.id;

      await companyService.deleteBenefit(id, userId, benId);

      res.status(200).json({
        message: "Benefit deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Member management
  async addMember(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRoles = req.user.roles || [];
      const memberData = req.body;

      const member = await companyService.addMember(
        id,
        userId,
        userRoles,
        memberData,
      );

      res.status(201).json({
        data: member,
        message: "Member added successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getMembers(req, res, next) {
    try {
      const { id } = req.params;
      const pagination = parsePagination(req);
      const result = await companyService.getMembers(id, pagination);

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

  async updateMember(req, res, next) {
    try {
      const { id, memId } = req.params;
      const userId = req.user.id;
      const updateData = req.body;

      const member = await companyService.updateMember(
        id,
        userId,
        memId,
        updateData,
      );

      res.status(200).json({
        data: member,
        message: "Member updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async removeMember(req, res, next) {
    try {
      const { id, memId } = req.params;
      const userId = req.user.id;

      await companyService.removeMember(id, userId, memId);

      res.status(200).json({
        message: "Member removed successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Verification workflow
  async submitForVerification(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          message: "At least one document is required",
        });
      }

      const files = req.files.map((f) => ({
        file: f,
        documentType: f.originalname,
      }));

      const submission = await companyService.submitForVerification(
        id,
        userId,
        files,
      );

      res.status(201).json({
        data: submission,
        message: "Verification submitted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getVerificationStatus(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const status = await companyService.getVerificationStatus(id, userId);

      res.status(200).json({
        data: status,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompanyFiles(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const companyFiles = await companyService.getCompanyFiles(id, userId);

      res.status(200).json({
        data: companyFiles,
      });
    } catch (error) {
      next(error);
    }
  }

  async reviewVerification(req, res, next) {
    try {
      const { submissionId } = req.params;
      const adminId = req.user.id;
      const { status, notes } = req.body;

      const submission = await companyService.reviewVerification(
        submissionId,
        adminId,
        status,
        notes,
      );

      res.status(200).json({
        data: submission,
        message: `Verification ${status} successfully`,
      });
    } catch (error) {
      next(error);
    }
  }
}
