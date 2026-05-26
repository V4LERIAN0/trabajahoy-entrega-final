import { BaseRepository } from '../../common/repositories/base.repository.js';
import { Profile } from '../auth/models/profile.model.js';
import { Role } from '../auth/models/role.model.js';
import { UserRole } from '../auth/models/user-role.model.js';
import { Company } from '../company/models/company.model.js';
import { CompanyMember } from '../company/models/company-member.model.js';
import { AppDataSource } from '../../database/data-source.js';
import { hashPassword } from '../../common/utils/bcrypt.js';
import { Vacancy } from '../vacancy/models/vacancy.model.js';

export class AdminRepository extends BaseRepository {
  constructor() {
  super(Profile);
  this.roleRepository = AppDataSource.getRepository(Role);
  this.userRoleRepository = AppDataSource.getRepository(UserRole);
  this.companyRepository = AppDataSource.getRepository(Company);
  this.companyMemberRepository = AppDataSource.getRepository(CompanyMember);
  this.vacancyRepository = AppDataSource.getRepository(Vacancy);
}

  async getAllRoles() {
    const roles = await this.roleRepository
      .createQueryBuilder('role')
      .leftJoin('user_roles', 'ur', 'ur.role_id = role.id')
      .select(['role.id', 'role.name', 'role.description', 'role.created_at'])
      .addSelect('COUNT(ur.id)', 'userCount')
      .groupBy('role.id')
      .orderBy('role.name', 'ASC')
      .getRawAndEntities();

    return roles.entities.map((role, index) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      userCount: parseInt(roles.raw[index].userCount, 10),
    }));
  }

  async findUserById(userId) {
    return await this.repository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
  }

  async getAllUsersWithRoles({ page = 1, limit = 10, search } = {}) {
    const queryBuilder = this.repository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.roles', 'role')
      .select([
        'profile.id',
        'profile.email',
        'profile.firstName',
        'profile.lastName',
        'profile.phone',
        'profile.isActive',
        'profile.isVerified',
        'profile.createdAt',
        'profile.updatedAt',
      ])
      .addSelect(['role.id', 'role.name'])
      .orderBy('profile.createdAt', 'DESC');

    if (search) {
      queryBuilder.andWhere(
        `(
          profile.email ILIKE :search
          OR profile.firstName ILIKE :search
          OR profile.lastName ILIKE :search
          OR profile.phone ILIKE :search
        )`,
        { search: `%${search}%` },
      );
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data: data.map((user) => this.mapUser(user)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

 async createUser(userData, createdByUserId) {
  const savedUserId = await AppDataSource.transaction(async (manager) => {
    const profileRepo = manager.getRepository(Profile);
    const roleRepo = manager.getRepository(Role);
    const userRoleRepo = manager.getRepository(UserRole);

    const passwordHash = await hashPassword(userData.password);

    const user = profileRepo.create({
      email: userData.email,
      passwordHash,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      phone: userData.phone || null,
      isActive: userData.isActive ?? true,
      isVerified: userData.isVerified ?? false,
    });

    const savedUser = await profileRepo.save(user);

    const roleNames = userData.roles?.length ? userData.roles : ['candidate'];

    for (const roleName of roleNames) {
      const role = await roleRepo.findOne({ where: { name: roleName } });

      if (!role) {
        throw new Error(`Role '${roleName}' not found`);
      }

      const userRole = userRoleRepo.create({
        userId: savedUser.id,
        roleId: role.id,
        assignedBy: createdByUserId,
      });

      await userRoleRepo.save(userRole);
    }

    return savedUser.id;
  });

  return await this.getUserRoles(savedUserId);
}

  async updateUser(userId, userData, updatedByUserId) {
  const updatedUserId = await AppDataSource.transaction(async (manager) => {
    const profileRepo = manager.getRepository(Profile);
    const roleRepo = manager.getRepository(Role);
    const userRoleRepo = manager.getRepository(UserRole);

    const existingUser = await profileRepo.findOne({ where: { id: userId } });

    if (!existingUser) {
      return null;
    }

    const updateData = {};

    if (userData.email !== undefined) updateData.email = userData.email;
    if (userData.firstName !== undefined) updateData.firstName = userData.firstName || null;
    if (userData.lastName !== undefined) updateData.lastName = userData.lastName || null;
    if (userData.phone !== undefined) updateData.phone = userData.phone || null;
    if (userData.isActive !== undefined) updateData.isActive = userData.isActive;
    if (userData.isVerified !== undefined) updateData.isVerified = userData.isVerified;

    if (userData.password && userData.password.trim()) {
      updateData.passwordHash = await hashPassword(userData.password);
    }

    updateData.updatedAt = new Date();

    if (Object.keys(updateData).length > 0) {
      await profileRepo.update(userId, updateData);
    }

    if (Array.isArray(userData.roles)) {
      await userRoleRepo.delete({ userId });

      for (const roleName of userData.roles) {
        const role = await roleRepo.findOne({ where: { name: roleName } });

        if (!role) {
          throw new Error(`Role '${roleName}' not found`);
        }

        const userRole = userRoleRepo.create({
          userId,
          roleId: role.id,
          assignedBy: updatedByUserId,
        });

        await userRoleRepo.save(userRole);
      }
    }

    return userId;
  });

  if (!updatedUserId) {
    return null;
  }

  return await this.getUserRoles(updatedUserId);
}

  async softDeleteUser(userId) {
    const existingUser = await this.repository.findOne({ where: { id: userId } });

    if (!existingUser) {
      return null;
    }

    await this.repository.update(userId, {
      isActive: false,
      updatedAt: new Date(),
    });

    return await this.getUserRoles(userId);
  }

  async getUserRoles(userId) {
    const user = await this.repository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.roles', 'role')
      .where('profile.id = :userId', { userId })
      .select([
        'profile.id',
        'profile.email',
        'profile.firstName',
        'profile.lastName',
        'profile.phone',
        'profile.isActive',
        'profile.isVerified',
        'profile.createdAt',
        'profile.updatedAt',
      ])
      .addSelect(['role.id', 'role.name'])
      .getOne();

    if (!user) {
      return null;
    }

    return this.mapUser(user);
  }

  async assignRole(userId, roleName, assignedByUserId) {
    const role = await this.roleRepository.findOne({ where: { name: roleName } });

    if (!role) {
      throw new Error(`Role '${roleName}' not found`);
    }

    const existingUserRole = await this.userRoleRepository.findOne({
      where: { userId, roleId: role.id },
    });

    if (existingUserRole) {
      return false;
    }

    const userRole = this.userRoleRepository.create({
      userId,
      roleId: role.id,
      assignedBy: assignedByUserId,
    });

    await this.userRoleRepository.save(userRole);
    return true;
  }

  async removeRole(userId, roleName) {
    const role = await this.roleRepository.findOne({ where: { name: roleName } });

    if (!role) {
      throw new Error(`Role '${roleName}' not found`);
    }

    const userRole = await this.userRoleRepository.findOne({
      where: { userId, roleId: role.id },
    });

    if (!userRole) {
      return false;
    }

    await this.userRoleRepository.remove(userRole);
    return true;
  }

  async getUserRoleCount(userId) {
    return await this.userRoleRepository.count({ where: { userId } });
  }

  async getUsersByRole(roleName, { page = 1, limit = 10 } = {}) {
    const role = await this.roleRepository.findOne({ where: { name: roleName } });

    if (!role) {
      throw new Error(`Role '${roleName}' not found`);
    }

    const queryBuilder = this.repository
      .createQueryBuilder('profile')
      .innerJoin('user_roles', 'ur', 'ur.user_id = profile.id')
      .where('ur.role_id = :roleId', { roleId: role.id })
      .leftJoinAndSelect('profile.roles', 'role')
      .select([
        'profile.id',
        'profile.email',
        'profile.firstName',
        'profile.lastName',
        'profile.phone',
        'profile.isActive',
        'profile.isVerified',
        'profile.createdAt',
        'profile.updatedAt',
      ])
      .addSelect(['role.id', 'role.name'])
      .orderBy('profile.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data: data.map((user) => this.mapUser(user)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllCompanies({ page = 1, limit = 10, search, industry, isVerified } = {}) {
    const queryBuilder = this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.owner', 'owner')
      .leftJoinAndSelect('company.members', 'members')
      .leftJoinAndSelect('members.user', 'memberUser')
      .select([
        'company.id',
        'company.ownerId',
        'company.name',
        'company.description',
        'company.website',
        'company.industry',
        'company.size',
        'company.logoUrl',
        'company.coverUrl',
        'company.email',
        'company.phone',
        'company.isVerified',
        'company.createdAt',
        'company.updatedAt',
        'owner.id',
        'owner.email',
        'owner.firstName',
        'owner.lastName',
        'owner.phone',
        'members.id',
        'members.companyId',
        'members.userId',
        'members.role',
        'members.joinedAt',
        'memberUser.id',
        'memberUser.email',
        'memberUser.firstName',
        'memberUser.lastName',
      ])
      .orderBy('company.createdAt', 'DESC');

    if (search) {
      queryBuilder.andWhere(
        `(
          company.name ILIKE :search
          OR company.description ILIKE :search
          OR company.industry ILIKE :search
          OR company.email ILIKE :search
          OR owner.email ILIKE :search
          OR owner.firstName ILIKE :search
          OR owner.lastName ILIKE :search
        )`,
        { search: `%${search}%` },
      );
    }

    if (industry) {
      queryBuilder.andWhere('company.industry = :industry', { industry });
    }

    if (isVerified !== undefined && isVerified !== null && isVerified !== '') {
      queryBuilder.andWhere('company.isVerified = :isVerified', {
        isVerified: isVerified === true || isVerified === 'true',
      });
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data: data.map((company) => this.mapCompany(company)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findCompanyById(companyId) {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['owner', 'members', 'members.user'],
    });

    if (!company) {
      return null;
    }

    return this.mapCompany(company);
  }

  async findCompanyByOwnerId(ownerId) {
  const company = await this.companyRepository.findOne({
    where: { ownerId },
    relations: ['owner', 'members', 'members.user'],
  });

  if (!company) {
    return null;
  }

  return this.mapCompany(company);
}

async countCompanyVacancies(companyId) {
  return await this.vacancyRepository.count({
    where: {
      companyId,
    },
  });
}

  async createCompany(companyData) {
  const savedCompanyId = await AppDataSource.transaction(async (manager) => {
    const companyRepo = manager.getRepository(Company);
    const memberRepo = manager.getRepository(CompanyMember);
    const profileRepo = manager.getRepository(Profile);

    const owner = await profileRepo.findOne({ where: { id: companyData.ownerId } });

    if (!owner) {
      throw new Error('Owner user not found');
    }

    const company = companyRepo.create({
      ownerId: companyData.ownerId,
      name: companyData.name,
      description: companyData.description || null,
      website: companyData.website || null,
      industry: companyData.industry || null,
      size: companyData.size || null,
      logoUrl: companyData.logoUrl || null,
      coverUrl: companyData.coverUrl || null,
      email: companyData.email || null,
      phone: companyData.phone || null,
      isVerified: companyData.isVerified ?? false,
    });

    const savedCompany = await companyRepo.save(company);

    const existingMember = await memberRepo.findOne({
      where: {
        companyId: savedCompany.id,
        userId: companyData.ownerId,
      },
    });

    if (!existingMember) {
      const member = memberRepo.create({
        companyId: savedCompany.id,
        userId: companyData.ownerId,
        role: 'owner',
      });

      await memberRepo.save(member);
    }

    return savedCompany.id;
  });

  return await this.findCompanyById(savedCompanyId);
}

  async updateCompany(companyId, companyData) {
  const updatedCompanyId = await AppDataSource.transaction(async (manager) => {
    const companyRepo = manager.getRepository(Company);
    const memberRepo = manager.getRepository(CompanyMember);
    const profileRepo = manager.getRepository(Profile);

    const existingCompany = await companyRepo.findOne({ where: { id: companyId } });

    if (!existingCompany) {
      return null;
    }

    const updateData = {};

    if (companyData.ownerId !== undefined) {
      const owner = await profileRepo.findOne({ where: { id: companyData.ownerId } });

      if (!owner) {
        throw new Error('Owner user not found');
      }

      updateData.ownerId = companyData.ownerId;
    }

    if (companyData.name !== undefined) updateData.name = companyData.name;
    if (companyData.description !== undefined) updateData.description = companyData.description || null;
    if (companyData.website !== undefined) updateData.website = companyData.website || null;
    if (companyData.industry !== undefined) updateData.industry = companyData.industry || null;
    if (companyData.size !== undefined) updateData.size = companyData.size || null;
    if (companyData.logoUrl !== undefined) updateData.logoUrl = companyData.logoUrl || null;
    if (companyData.coverUrl !== undefined) updateData.coverUrl = companyData.coverUrl || null;
    if (companyData.email !== undefined) updateData.email = companyData.email || null;
    if (companyData.phone !== undefined) updateData.phone = companyData.phone || null;
    if (companyData.isVerified !== undefined) updateData.isVerified = companyData.isVerified;

    updateData.updatedAt = new Date();

    await companyRepo.update(companyId, updateData);

    if (companyData.ownerId !== undefined) {
      await memberRepo.delete({
        companyId,
        role: 'owner',
      });

      const existingMember = await memberRepo.findOne({
        where: {
          companyId,
          userId: companyData.ownerId,
        },
      });

      if (existingMember) {
        await memberRepo.update(existingMember.id, { role: 'owner' });
      } else {
        const member = memberRepo.create({
          companyId,
          userId: companyData.ownerId,
          role: 'owner',
        });

        await memberRepo.save(member);
      }
    }

    return companyId;
  });

  if (!updatedCompanyId) {
    return null;
  }

  return await this.findCompanyById(updatedCompanyId);
}

  async deleteCompany(companyId) {
  const company = await this.companyRepository.findOne({
    where: { id: companyId },
    relations: ['owner', 'members', 'members.user'],
  });

  if (!company) {
    return null;
  }

  const vacancyCount = await this.countCompanyVacancies(companyId);

  if (vacancyCount > 0) {
    const error = new Error(
      'This company cannot be deleted because it has related vacancies. Close or archive the vacancies first.',
    );
    error.statusCode = 409;
    throw error;
  }

  await this.companyRepository.delete(companyId);

  return this.mapCompany(company);
}

  mapUser(user) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      isActive: user.isActive,
      isVerified: user.isVerified,
      roles: user.roles?.map((role) => role.name) || [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  mapCompany(company) {
    return {
      id: company.id,
      ownerId: company.ownerId,
      name: company.name,
      description: company.description,
      website: company.website,
      industry: company.industry,
      size: company.size,
      logoUrl: company.logoUrl,
      coverUrl: company.coverUrl,
      email: company.email,
      phone: company.phone,
      isVerified: company.isVerified,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      owner: company.owner
        ? {
            id: company.owner.id,
            email: company.owner.email,
            firstName: company.owner.firstName,
            lastName: company.owner.lastName,
            phone: company.owner.phone,
          }
        : null,
      members:
        company.members?.map((member) => ({
          id: member.id,
          companyId: member.companyId,
          userId: member.userId,
          role: member.role,
          joinedAt: member.joinedAt,
          user: member.user
            ? {
                id: member.user.id,
                email: member.user.email,
                firstName: member.user.firstName,
                lastName: member.user.lastName,
              }
            : null,
        })) || [],
    };
  }
}