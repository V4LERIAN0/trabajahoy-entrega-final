import { AuthRepository } from './auth.repository.js';
import { hashPassword, comparePassword } from '../../common/utils/bcrypt.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../common/utils/jwt.js';
import { logger } from '../../common/utils/logger.js';
import { AppDataSource } from '../../database/data-source.js';
import { Profile } from './models/profile.model.js';
import { Role } from './models/role.model.js';
import { UserRole } from './models/user-role.model.js';
import { Company } from '../company/models/company.model.js';
import { CompanyMember } from '../company/models/company-member.model.js';

export class AuthService {
  constructor() {
    this.authRepository = new AuthRepository();
  }

  /**
   * Register a new company (profile + company + owner membership) atomically.
   * @param {Object} data - { email, password, firstName, lastName, phone?, companyName, industry?, companySize?, website?, companyDescription? }
   * @returns {Promise<Object>} { user, company, roles, accessToken, refreshToken }
   */
  async registerCompany(data) {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      companyName,
      industry,
      companySize,
      website,
      companyDescription,
    } = data;

    const existingUser = await this.authRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email is already registered');
    }

    const companyRepo = AppDataSource.getRepository(Company);
    const existingCompany = await companyRepo.findOne({ where: { name: companyName } });
    if (existingCompany) {
      throw new Error('Company name is already in use');
    }

    const hashedPassword = await hashPassword(password);

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const savedProfile = await queryRunner.manager.save(Profile, {
        email,
        passwordHash: hashedPassword,
        firstName,
        lastName,
        phone,
        isActive: true,
      });

      const recruiterRole = await queryRunner.manager.findOne(Role, { where: { name: 'recruiter' } });
      if (!recruiterRole) {
        throw new Error("Role 'recruiter' not found. Check database seed.");
      }
      await queryRunner.manager.save(UserRole, {
        userId: savedProfile.id,
        roleId: recruiterRole.id,
      });

      const savedCompany = await queryRunner.manager.save(Company, {
        ownerId: savedProfile.id,
        name: companyName,
        description: companyDescription || null,
        website: website || null,
        industry: industry || null,
        size: companySize || null,
        isVerified: false,
      });

      await queryRunner.manager.save(CompanyMember, {
        companyId: savedCompany.id,
        userId: savedProfile.id,
        role: 'owner',
      });

      await queryRunner.commitTransaction();

      const roles = ['recruiter'];
      const tokenPayload = { id: savedProfile.id, email: savedProfile.email, roles };
      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken({ id: savedProfile.id });

      logger.info(`New company registered: ${companyName}`, {
        userId: savedProfile.id,
        companyId: savedCompany.id,
      });

      return {
        user: this.sanitizeUser(savedProfile),
        company: savedCompany,
        roles,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Register a new user
   * @param {Object} data - Registration data
   * @returns {Promise<Object>} Created user with tokens
   */
  async register(data) {
    const { email, password, firstName, lastName, phone } = data;

    // Check if user already exists
    const existingUser = await this.authRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email is already registered');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create profile with default 'candidate' role
    const profile = await this.authRepository.createProfileWithRoles(
      {
        email,
        passwordHash: hashedPassword,
        firstName,
        lastName,
        phone,
        isActive: true,
      },
      ['candidate'],
    );

    // Generate tokens
    const tokenPayload = {
      id: profile.id,
      email: profile.email,
      roles: ['candidate'],
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken({ id: profile.id });

    logger.info(`New user registered: ${email}`, { userId: profile.id });

    return {
      user: this.sanitizeUser(profile),
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User with tokens
   */
  async login(email, password) {
    // Find user by email
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Your account has been deactivated. Please contact support.');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Get user roles
    const roles = await this.authRepository.getUserRoleNames(user.id);

    // Generate tokens
    const tokenPayload = {
      id: user.id,
      email: user.email,
      roles,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken({ id: user.id });

    logger.info(`User logged in: ${email}`, { userId: user.id });

    return {
      user: this.sanitizeUser(user),
      roles,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} New access token
   */
  async refreshAccessToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Get user with roles
      const user = await this.authRepository.findWithRoles(decoded.id);
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      const roles = await this.authRepository.getUserRoleNames(user.id);

      // Generate new access token
      const tokenPayload = {
        id: user.id,
        email: user.email,
        roles,
      };

      const newAccessToken = generateAccessToken(tokenPayload);

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Logout user (could invalidate refresh tokens if stored in DB)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Success message
   */
  async logout(userId) {
    logger.info(`User logged out: ${userId}`, { userId });

    return {
      message: 'Logged out successfully',
    };
  }

  /**
   * Get current user profile
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User profile with roles
   */
  async getMe(userId) {
    const user = await this.authRepository.findWithRoles(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const roles = await this.authRepository.getUserRoleNames(userId);

    return {
      user: this.sanitizeUser(user),
      roles,
    };
  }

  /**
   * Remove sensitive data from user object
   * @param {Object} user - User object
   * @returns {Object} Sanitized user
   */
  sanitizeUser(user) {
    const { passwordHash, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
