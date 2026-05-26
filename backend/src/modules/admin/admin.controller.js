import { AdminService } from './admin.service.js';
import { parsePagination } from '../../common/utils/paginator.js';

const adminService = new AdminService();

export class AdminController {
  async getDashboard(req, res, next) {
    try {
      const data = await adminService.getDashboard();

      res.status(200).json({
        data,
        message: 'Admin dashboard retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllRoles(req, res, next) {
    try {
      const roles = await adminService.getAllRoles();

      res.status(200).json({
        data: roles,
        message: 'Roles retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const pagination = parsePagination(req);
      const search = req.query.search || '';

      const result = await adminService.getAllUsers({
        ...pagination,
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
        message: 'Users retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const createdByUserId = req.user.id;
      const user = await adminService.createUser(req.body, createdByUserId);

      res.status(201).json({
        data: user,
        message: 'User created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const updatedByUserId = req.user.id;

      const user = await adminService.updateUser(id, req.body, updatedByUserId);

      res.status(200).json({
        data: user,
        message: 'User updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const deletedByUserId = req.user.id;

      const user = await adminService.deleteUser(id, deletedByUserId);

      res.status(200).json({
        data: user,
        message: 'User deactivated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserRoles(req, res, next) {
    try {
      const { id } = req.params;
      const userRoles = await adminService.getUserRoles(id);

      res.status(200).json({
        data: userRoles,
        message: 'User roles retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async assignRole(req, res, next) {
    try {
      const { id } = req.params;
      const { roleName } = req.body;
      const assignedByUserId = req.user.id;

      const result = await adminService.assignRole(id, roleName, assignedByUserId);

      res.status(201).json({
        data: result,
        message: 'Role assigned successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async removeRole(req, res, next) {
    try {
      const { id } = req.params;
      const { roleName } = req.body;

      const result = await adminService.removeRole(id, roleName);

      res.status(200).json({
        data: result,
        message: 'Role removed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getUsersByRole(req, res, next) {
    try {
      const { name } = req.params;
      const pagination = parsePagination(req);

      const result = await adminService.getUsersByRole(name, pagination);

      res.status(200).json({
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
        message: `Users with role '${name}' retrieved successfully`,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllCompanies(req, res, next) {
    try {
      const pagination = parsePagination(req);
      const search = req.query.search || '';
      const industry = req.query.industry || '';

      const result = await adminService.getAllCompanies({
        ...pagination,
        search,
        industry,
      });

      res.status(200).json({
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
        message: 'Companies retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async createCompany(req, res, next) {
    try {
      const company = await adminService.createCompany(req.body);

      res.status(201).json({
        data: company,
        message: 'Company created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCompany(req, res, next) {
    try {
      const { id } = req.params;
      const company = await adminService.updateCompany(id, req.body);

      res.status(200).json({
        data: company,
        message: 'Company updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCompany(req, res, next) {
    try {
      const { id } = req.params;
      const result = await adminService.deleteCompany(id);

      res.status(200).json({
        data: result,
        message: 'Company deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}