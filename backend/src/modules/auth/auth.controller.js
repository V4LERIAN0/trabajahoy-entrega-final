import { AuthService } from './auth.service.js';

const authService = new AuthService();

export class AuthController {
  /**
   * POST /api/auth/register
   */
  async register(req, res, next) {
    try {
      const userData = req.body;
      const result = await authService.register(userData);

      res.status(201).json({
        data: result,
        message: 'User registered successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/register-company
   */
  async registerCompany(req, res, next) {
    try {
      const result = await authService.registerCompany(req.body);
      res.status(201).json({
        data: result,
        message: 'Company registered successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.status(200).json({
        data: result,
        message: 'Login successful',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/refresh
   */
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshAccessToken(refreshToken);

      res.status(200).json({
        data: result,
        message: 'Token refreshed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   */
  async logout(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await authService.logout(userId);

      res.status(200).json({
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   */
  async getMe(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await authService.getMe(userId);

      res.status(200).json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
