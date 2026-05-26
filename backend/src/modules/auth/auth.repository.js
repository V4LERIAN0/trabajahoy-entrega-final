import { BaseRepository } from '../../common/repositories/base.repository.js';
import { Profile } from './models/profile.model.js';
import { Role } from './models/role.model.js';
import { UserRole } from './models/user-role.model.js';
import { AppDataSource } from '../../database/data-source.js';
import { In } from 'typeorm';

export class AuthRepository extends BaseRepository {
  constructor() {
    super(Profile);
    this.roleRepository = AppDataSource.getRepository(Role);
    this.userRoleRepository = AppDataSource.getRepository(UserRole);
  }

  /**
   * Find a profile by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} Profile or null
   */
  async findByEmail(email) {
    return await this.repository.findOne({
      where: { email },
    });
  }

  /**
   * Find a profile by ID with roles loaded
   * @param {string} id - Profile UUID
   * @returns {Promise<Object|null>} Profile with roles
   */
  async findWithRoles(id) {
    return await this.repository.findOne({
      where: { id },
      relations: ['roles', 'ownedCompany', 'companyMemberships', 'companyMemberships.company'],
    });
  }

  /**
   * Create a new profile with assigned roles
   * @param {Object} profileData - Profile data
   * @param {string[]} roleNames - Array of role names (e.g., ['candidate'])
   * @returns {Promise<Object>} Created profile with roles
   */
  async createProfileWithRoles(profileData, roleNames) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create profile
      const savedProfile = await queryRunner.manager.save(this.entityClass, profileData);

      // Find roles
      const roles = await queryRunner.manager.find(Role, {
  where: {
    name: In(roleNames),
  },
});

if (roles.length !== roleNames.length) {
  throw new Error(`Some roles were not found: ${roleNames.join(', ')}`);
}

      // Create user_roles entries
      for (const role of roles) {
        const userRole = this.userRoleRepository.create({
          userId: savedProfile.id,
          roleId: role.id,
        });
        await queryRunner.manager.save(UserRole, userRole);
      }

      await queryRunner.commitTransaction();

      // Return profile with roles
      return await this.findWithRoles(savedProfile.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Assign a role to a user
   * @param {string} userId - User UUID
   * @param {string} roleName - Role name
   * @returns {Promise<void>}
   */
  async assignRole(userId, roleName) {
    const role = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!role) {
      throw new Error(`Role '${roleName}' not found`);
    }

    // Check if role already assigned
    const existingUserRole = await this.userRoleRepository.findOne({
      where: { userId, roleId: role.id },
    });

    if (existingUserRole) {
      return; // Role already assigned
    }

    const userRole = this.userRoleRepository.create({
      userId,
      roleId: role.id,
    });

    await this.userRoleRepository.save(userRole);
  }

  /**
   * Get role names for a user
   * @param {string} userId - User UUID
   * @returns {Promise<string[]>} Array of role names
   */
  async getUserRoleNames(userId) {
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
      relations: ['role'],
    });

    const roleNames = new Set(userRoles.map((ur) => ur.role.name));
    const companyAdminMembership = await AppDataSource.query(
      `SELECT 1 FROM company_members WHERE user_id = $1 AND role::text IN ('company_admin', 'admin') LIMIT 1`,
      [userId],
    );

    if (companyAdminMembership.length > 0) {
      roleNames.add('company_admin');
    }

    return Array.from(roleNames);
  }

  /**
   * Find a role by name
   * @param {string} name - Role name
   * @returns {Promise<Object|null>} Role or null
   */
  async findRoleByName(name) {
    return await this.roleRepository.findOne({ where: { name } });
  }
}
