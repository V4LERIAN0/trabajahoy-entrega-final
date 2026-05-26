import { AdminRepository } from './admin.repository.js';
import { logger } from '../../common/utils/logger.js';
import { AppDataSource } from '../../database/data-source.js';
import { Profile } from '../auth/models/profile.model.js';
import { Company } from '../company/models/company.model.js';
import { Vacancy } from '../vacancy/models/vacancy.model.js';

export class AdminService {
  constructor() {
    this.adminRepository = new AdminRepository();
  }

  async getDashboard() {
    const profileRepo = AppDataSource.getRepository(Profile);
    const companyRepo = AppDataSource.getRepository(Company);
    const vacancyRepo = AppDataSource.getRepository(Vacancy);

    const [
      totalUsers,
      activeUsers,
      totalCompanies,
      verifiedCompanies,
      totalVacancies,
      publishedVacancies,
      pendingCompaniesList,
      recentUsersList,
    ] = await Promise.all([
      profileRepo.count(),
      profileRepo.count({ where: { isActive: true } }),
      companyRepo.count(),
      companyRepo.count({ where: { isVerified: true } }),
      vacancyRepo.count(),
      vacancyRepo.count({ where: { status: 'published' } }),
      companyRepo.find({
        where: { isVerified: false },
        order: { createdAt: 'DESC' },
        take: 5,
      }),
      profileRepo.find({
        order: { createdAt: 'DESC' },
        take: 5,
      }),
    ]);

    return {
      totalUsers,
      activeUsers,
      totalCompanies,
      verifiedCompanies,
      totalVacancies,
      publishedVacancies,
      totalApplications: 0,
      pendingApplications: 0,
      kpis: {
        users: totalUsers,
        companies: totalCompanies,
        vacancies: totalVacancies,
        pendingCompanies: totalCompanies - verifiedCompanies,
      },
      pendingCompanies: pendingCompaniesList.map((company) => ({
        id: company.id,
        name: company.name,
        submittedAt: company.createdAt,
      })),
      recentUsers: recentUsersList.map((user) => ({
        id: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
        email: user.email,
        createdAt: user.createdAt,
      })),
    };
  }

  async getAllRoles() {
    try {
      return await this.adminRepository.getAllRoles();
    } catch (error) {
      logger.error('Failed to get all roles', { error: error.message });
      throw error;
    }
  }

  async getAllUsers({ page = 1, limit = 10, search = '' } = {}) {
    try {
      return await this.adminRepository.getAllUsersWithRoles({
        page,
        limit,
        search: search || undefined,
      });
    } catch (error) {
      logger.error('Failed to get all users', { error: error.message });
      throw error;
    }
  }

  async createUser(userData, createdByUserId) {
    try {
      const user = await this.adminRepository.createUser(userData, createdByUserId);

      logger.info('Admin created user', {
        userId: user.id,
        createdBy: createdByUserId,
      });

      return user;
    } catch (error) {
      logger.error('Failed to create admin user', { error: error.message });
      throw error;
    }
  }

  async updateUser(userId, userData, updatedByUserId) {
    const user = await this.adminRepository.findUserById(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    try {
      const updatedUser = await this.adminRepository.updateUser(userId, userData, updatedByUserId);

      logger.info('Admin updated user', {
        userId,
        updatedBy: updatedByUserId,
      });

      return updatedUser;
    } catch (error) {
      logger.error('Failed to update admin user', {
        userId,
        error: error.message,
      });
      throw error;
    }
  }

  async deleteUser(userId, deletedByUserId) {
    const user = await this.adminRepository.findUserById(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    if (userId === deletedByUserId) {
      const error = new Error('You cannot deactivate your own admin account');
      error.statusCode = 400;
      throw error;
    }

    try {
      const deletedUser = await this.adminRepository.softDeleteUser(userId);

      logger.info('Admin deactivated user', {
        userId,
        deletedBy: deletedByUserId,
      });

      return deletedUser;
    } catch (error) {
      logger.error('Failed to deactivate user', {
        userId,
        error: error.message,
      });
      throw error;
    }
  }

  async getUserRoles(userId) {
    const user = await this.adminRepository.getUserRoles(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  async assignRole(userId, roleName, assignedByUserId) {
    const user = await this.adminRepository.getUserRoles(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const assigned = await this.adminRepository.assignRole(userId, roleName, assignedByUserId);

    if (!assigned) {
      const error = new Error(`Role '${roleName}' is already assigned to this user`);
      error.statusCode = 400;
      throw error;
    }

    logger.info('Role assigned', {
      userId,
      roleName,
      assignedBy: assignedByUserId,
    });

    return await this.adminRepository.getUserRoles(userId);
  }

  async removeRole(userId, roleName) {
    const user = await this.adminRepository.getUserRoles(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const removed = await this.adminRepository.removeRole(userId, roleName);

    if (!removed) {
      const error = new Error(`Role '${roleName}' is not assigned to this user`);
      error.statusCode = 400;
      throw error;
    }

    logger.info('Role removed', {
      userId,
      roleName,
    });

    return await this.adminRepository.getUserRoles(userId);
  }

  async getUsersByRole(roleName, { page = 1, limit = 10 } = {}) {
    try {
      return await this.adminRepository.getUsersByRole(roleName, {
        page,
        limit,
      });
    } catch (error) {
      logger.error('Failed to get users by role', {
        roleName,
        error: error.message,
      });
      throw error;
    }
  }

  async getAllCompanies({ page = 1, limit = 10, search = '', industry = '' } = {}) {
    try {
      return await this.adminRepository.getAllCompanies({
        page,
        limit,
        search: search || undefined,
        industry: industry || undefined,
      });
    } catch (error) {
      logger.error('Failed to get admin companies', { error: error.message });
      throw error;
    }
  }

  async createCompany(companyData) {
  const owner = await this.adminRepository.findUserById(companyData.ownerId);

  if (!owner) {
    const error = new Error('Owner user not found');
    error.statusCode = 404;
    throw error;
  }

  const existingCompany = await this.adminRepository.findCompanyByOwnerId(companyData.ownerId);

  if (existingCompany) {
    const error = new Error('This owner already has an associated company');
    error.statusCode = 409;
    throw error;
  }

  try {
    const company = await this.adminRepository.createCompany(companyData);

    logger.info('Admin created company', {
      companyId: company.id,
      ownerId: company.ownerId,
    });

    return company;
  } catch (error) {
    logger.error('Failed to create admin company', { error: error.message });
    throw error;
  }
}

  async updateCompany(companyId, companyData) {
  const company = await this.adminRepository.findCompanyById(companyId);

  if (!company) {
    const error = new Error('Company not found');
    error.statusCode = 404;
    throw error;
  }

  if (companyData.ownerId) {
    const owner = await this.adminRepository.findUserById(companyData.ownerId);

    if (!owner) {
      const error = new Error('Owner user not found');
      error.statusCode = 404;
      throw error;
    }

    const existingCompany = await this.adminRepository.findCompanyByOwnerId(companyData.ownerId);

    if (existingCompany && existingCompany.id !== companyId) {
      const error = new Error('This owner already has an associated company');
      error.statusCode = 409;
      throw error;
    }
  }

  try {
    const updatedCompany = await this.adminRepository.updateCompany(companyId, companyData);

    logger.info('Admin updated company', {
      companyId,
    });

    return updatedCompany;
  } catch (error) {
    logger.error('Failed to update admin company', {
      companyId,
      error: error.message,
    });
    throw error;
  }
}

  async deleteCompany(companyId) {
  const company = await this.adminRepository.findCompanyById(companyId);

  if (!company) {
    const error = new Error('Company not found');
    error.statusCode = 404;
    throw error;
  }

  try {
    await this.adminRepository.deleteCompany(companyId);

    logger.info('Admin deleted company', {
      companyId,
    });

    return {
      id: companyId,
      deleted: true,
    };
  } catch (error) {
    if (error.statusCode === 409) {
      throw error;
    }

    if (error.code === '23503') {
      const conflict = new Error(
        'This company cannot be deleted because it has related records such as vacancies, applications, members, or reviews.',
      );
      conflict.statusCode = 409;
      throw conflict;
    }

    logger.error('Failed to delete admin company', {
      companyId,
      error: error.message,
    });
    throw error;
  }
}
}